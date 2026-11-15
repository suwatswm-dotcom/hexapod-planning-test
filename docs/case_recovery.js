/* Full-Case Local Recovery Capture + Mode-Gated Standalone Recovery + repeatable mode-entry restore — R1146.4
 * Adds coherent CASE + AP/LAT image/observation snapshots to the existing local
 * recovery store. R1121 removes obsolete CASE-only recovery writes and read/restore APIs; full-case snapshots are the sole local recovery authority. R1120 added a temporary manual-test autosave pause; R1118 stages candidates and promotes only after post-write
 * CASE/AP/LAT fingerprints pass, preserving the previous authoritative snapshot
 * when a candidate fails consistency verification. Reuses the X-ray workspace capture API; no parallel VTK path.
 * R1087 coalesces repeated X-ray notifications within one pending capture interval;
 * actual AP/LAT content fingerprints remain authoritative for capture consistency.
 * R1087 retains the R1078 read-only AP/LAT before/after content fingerprints to distinguish
 * genuine concurrent edits from notifications emitted by the capture/checkpoint path.
 * Preserves full-case restore through the existing R869 transactional installer in local-only mode.
 * R1126 enables automatic startup restoration through the existing verified R869 local-only transaction.
 * Transfer filename ends in .js.html; contents are plain JavaScript.
 */
(function () {
    "use strict";
    // R1092 startup breadcrumb: distinguishes a loaded script from an app/cache/URL failure.
    window.__CASE_RECOVERY_SCRIPT_R1121_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1123C7_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1123C8_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1125B_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1125B1_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1125B2_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1126_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1128_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1140_LOADED = true;
    window.__CASE_RECOVERY_SCRIPT_R1145_4_LOADED = true;

    const state = {
        generation: 0,
        transitionStack: [],
        events: [],
        lastEvent: null,
        lastReason: "initializing",
        lastSnapshot: null,
        committedSnapshot: null,
        lastSnapshotError: null,
        dirty: false,
        dirtySince: 0,
        lastMutationAt: 0,
        dirtyObservedCaseMutation: false,
        baselineEstablished: false,
        caseReady: false,
        readinessReason: "waiting for application CASE load",
        pollCount: 0,
        xrayDirty: false,
        xrayMutationCounters: { AP: 0, LAT: 0 },
        xrayNotificationsCoalesced: { AP: 0, LAT: 0 },
        fullCaseCaptureAttempts: 0,
        fullCaseContentChangesDetected: 0,
        fullCaseDuplicateCapturesDiscarded: 0,
        fullCaseSuccessfulCommits: 0,
        fullCaseCaptureInProgress: false,
        fullCaseRestoreInProgress: false,
        autosavePaused: false,
        stagedRaceTestArmed: false,
        stagedRaceTestInFlight: false,
        stagedRaceTestBaseline: null,
        stagedRaceTestStatus: "not armed",
        mutationSerial: 0,
        fullCaseRetryAttempts: 0,
        nextFullCaseRetryAt: 0,
        lastSuccessfulCaseIdentity: null,
        activeCaseIdentity: null,
        activeXrayImageIds: { AP: null, LAT: null },
        activeXrayAnnotationCounts: { AP: null, LAT: null },
        activeXrayDiagnostics: { AP: null, LAT: null },
        activeWorkspaceProbeAt: 0,
        activeWorkspaceProbeInProgress: false,
    };

    const MAX_EVENTS = 100;
    const RECOVERY_DB_NAME = "orthopedic-hexapod-case-recovery";
    const RECOVERY_DB_VERSION = 1;
    const RECOVERY_STORE = "snapshots";
    const FULL_CASE_RECOVERY_ID = "latest-stable-full-case";
    const FULL_CASE_RECOVERY_PENDING_ID = "pending-stable-full-case";
    const FULL_CASE_RECOVERY_SCHEMA = "case-recovery-snapshot-v2";
    // Legacy latest-stable-case records are intentionally left untouched in this
    // retirement step; no current code reads or writes them. Database cleanup is separate.
    let recoveryDbPromise = null;
    const recoveryState = {
        supported: typeof indexedDB !== "undefined",
        fullCaseStatus: "waiting for complete AP/LAT state",
        fullCaseSavedAt: null,
        fullCaseSavedGeneration: null,
        lastSuccessfulCaseIdentity: null,
        fullCaseImageIds: null,
        fullCaseLastError: null,
        caseComponentStatus: "waiting for CASE baseline",
        xrayComponentStatus: { AP: "waiting for AP workspace", LAT: "waiting for LAT workspace" }
    };
    const POLL_MS = 2500;
    const STABLE_MS = 1000;
    let timer = null; // legacy polling observer; inactive by default
    let eventCaptureTimer = null;
    let caseChangeEventsBound = false;
    let standaloneRecoveryActive = false; // local recovery availability in Standalone mode
    function isStandaloneMode() {
        return window.__APP_OPERATING_MODE === "standalone";
    }
    const STATUS_DISPLAY_MIN_MS = 1800;
    const displayedComponentStatus = {
        CASE: { value: null, changedAt: 0, pending: null },
        AP: { value: null, changedAt: 0, pending: null },
        LAT: { value: null, changedAt: 0, pending: null }
    };
    function stableDisplayStatus(key, nextValue) {
        const item = displayedComponentStatus[key];
        const now = Date.now();
        if (item.value === null) {
            item.value = nextValue;
            item.changedAt = now;
            return item.value;
        }
        if (nextValue === item.value) {
            item.pending = null;
            return item.value;
        }
        item.pending = nextValue;
        if (now - item.changedAt >= STATUS_DISPLAY_MIN_MS) {
            item.value = nextValue;
            item.changedAt = now;
            item.pending = null;
        }
        return item.value;
    }

    function safeSnapshot() {
        if (!Object.prototype.hasOwnProperty.call(window, "currentCase") || window.currentCase == null) {
            return { available: false, text: "<no-current-case>" };
        }
        try {
            return { available: true, text: JSON.stringify(window.currentCase) };
        } catch (error) {
            return { available: true, error: error?.message || String(error) };
        }
    }

    // R1100 — read-only iframe build/API diagnostics.
    // This inspects the already-loaded AP/LAT iframe globals; it does not
    // capture images, touch WIP storage, or trigger autosave.
    function getXrayIframeBuildStatus(view) {
        const frameId = view === "LAT" ? "xrayLATVtkFrame" : "xrayAPVtkFrame";
        const frame = document.getElementById(frameId);
        if (!frame) return "iframe not found";
        try {
            const child = frame.contentWindow;
            if (!child) return "iframe window unavailable";
            if (frame.contentDocument?.readyState !== "complete" &&
                frame.contentDocument?.readyState !== "interactive") {
                return "iframe loading";
            }
            const diagnostics = child.getXrayLiveDiagnostics;
            if (typeof diagnostics !== "function") return "diagnostics API unavailable";
            const result = diagnostics();
            const build = result?.build || "unknown build";
            const capture = result?.liveCaptureApi === true ? "live capture YES" : "live capture NO";
            return build + " · " + capture;
        } catch (error) {
            return "inspection blocked: " + (error?.message || String(error));
        }
    }

    function render() {
        let panel = document.getElementById("caseRecoveryDiagnosticPanel");
        if (!panel) {
            ensureRecoveryVerifyButton();
            panel = document.getElementById("caseRecoveryDiagnosticPanel");
        }
        if (!panel) return;
        // A stale/legacy monitor can exist without its required child nodes.
        // Rebuild the structure instead of replacing the panel with plain text.
        if (!panel.querySelector("#caseRecoveryMonitorSummaryR1076") ||
            !panel.querySelector("#caseRecoveryVerifyButtonR1092")) {
            ensureRecoveryVerifyButton();
            panel = document.getElementById("caseRecoveryDiagnosticPanel");
        }
        if (!panel) return;
        const depth = state.transitionStack.length;
        const mode = depth ? "TRANSITION IN PROGRESS" : (state.autosavePaused ? "AUTOSAVE PAUSED · changes held" : (state.dirty ? "CHANGE SETTLING" : "EVENT-DRIVEN · READY"));
        const summary = panel.querySelector("#caseRecoveryMonitorSummaryR1076");
        const lines = [
            "CASE       " + stableDisplayStatus("CASE", recoveryState.caseComponentStatus),
            "AP X-ray   " + stableDisplayStatus("AP", recoveryState.xrayComponentStatus.AP),
            "LAT X-ray  " + stableDisplayStatus("LAT", recoveryState.xrayComponentStatus.LAT),
            "AP iframe  " + getXrayIframeBuildStatus("AP"),
            "LAT iframe " + getXrayIframeBuildStatus("LAT"),
            "",
            "Saved snapshot " + recoveryState.fullCaseStatus,
            "Capture    " + mode + " · dirty=" + (state.dirty ? "yes" : "no"),
            "Autosave   " + (state.autosavePaused ? "PAUSED — snapshot protected" : (standaloneRecoveryActive ? "EVENT-DRIVEN ACTIVE" : "INACTIVE")),
            "Legacy poller " + (timer === null ? "INACTIVE" : "EXPLICITLY ENABLED"),
            "Race test  " + state.stagedRaceTestStatus,
            "Generation " + state.generation + " · transition depth " + depth,
            "Last event " + (state.lastEvent || "waiting for CASE baseline")
        ];
        const activeIdentity = state.activeCaseIdentity || recoveryCaseIdentity(window.currentCase || {});
        lines.push("Active CASE " + (activeIdentity.id || activeIdentity.name || "identity unavailable"));
        if (recoveryState.lastSuccessfulCaseIdentity) {
            const identity = recoveryState.lastSuccessfulCaseIdentity;
            lines.push("Saved CASE " + (identity.id || identity.name || "identity unavailable"));
        }
        if (recoveryState.fullCaseSavedAt) lines.push("Saved at   " + new Date(recoveryState.fullCaseSavedAt).toLocaleString());
        if (recoveryState.fullCaseImageIds) {
            lines.push("Saved AP   " + (recoveryState.fullCaseImageIds.AP || "unknown"));
            lines.push("Saved LAT  " + (recoveryState.fullCaseImageIds.LAT || "unknown"));
        }
        lines.push("Active AP  " + (state.activeXrayImageIds.AP || "not yet probed") +
            (Number.isInteger(state.activeXrayAnnotationCounts.AP) ? " · " + state.activeXrayAnnotationCounts.AP + " annotations" : ""));
        lines.push("Active LAT " + (state.activeXrayImageIds.LAT || "not yet probed") +
            (Number.isInteger(state.activeXrayAnnotationCounts.LAT) ? " · " + state.activeXrayAnnotationCounts.LAT + " annotations" : ""));
        for (const view of ["AP", "LAT"]) {
            const d = state.activeXrayDiagnostics[view];
            if (d?.diagnosticError) {
                lines.push(view + " live diagnostic unavailable · " + d.diagnosticError);
            } else if (d) {
                lines.push(view + " live source " + d.imageSource + " · DICOM loaded=" + d.dicomLoaded + " · image ready=" + d.hasLoadedXrayImage);
                lines.push(view + " source bytes " + d.cachedImageBytes + " cached · File=" + (d.fileHandlePresent ? `${d.fileHandleName || "present"} (${d.fileHandleSize} bytes)` : "none") + " · checksum=" + d.imageChecksumPresent);
                lines.push(view + " pixels " + (Array.isArray(d.dimensions) ? d.dimensions.join("×") : "unknown") + " · scalars=" + d.scalarValueCount + " · visible=" + d.imageVisible);
            }
        }
        lines.push("X-ray notifications AP/LAT " + state.xrayMutationCounters.AP + "/" + state.xrayMutationCounters.LAT);
        lines.push("Notification meaning: committed case-data-changed coordinator events");
        lines.push("Coalesced notifications AP/LAT " + state.xrayNotificationsCoalesced.AP + "/" + state.xrayNotificationsCoalesced.LAT);
        lines.push("Full captures attempted " + state.fullCaseCaptureAttempts);
        lines.push("Content changes detected " + state.fullCaseContentChangesDetected);
        lines.push("Duplicate captures discarded " + state.fullCaseDuplicateCapturesDiscarded);
        lines.push("Successful full commits " + state.fullCaseSuccessfulCommits);
        if (state.fullCaseRetryAttempts) lines.push("Retry      attempt " + state.fullCaseRetryAttempts + " · next " + new Date(state.nextFullCaseRetryAt).toLocaleTimeString());
        if (recoveryState.fullCaseLastError) lines.push("Full-case error " + recoveryState.fullCaseLastError);
        // Never write diagnostics to panel.textContent: doing so removes the
        // header, controls and <pre> formatting. If repair failed, fail visibly
        // in the console and leave the existing monitor DOM intact.
        const nextSummaryText = lines.join("\n");
        if (summary && summary.textContent !== nextSummaryText) {
            summary.textContent = nextSummaryText;
        } else if (!summary) {
            console.error("[R1121] Recovery monitor summary element could not be created; panel structure preserved.");
        }
        panel.dataset.transition = depth ? "active" : "idle";
        panel.dataset.generation = String(state.generation);
        panel.dataset.observer = state.dirty ? "settling" : "stable";
        panel.title = "Full-case local recovery storage · event-driven capture; legacy poller inactive by default" +
            "\nFull-case status: " + recoveryState.fullCaseStatus +
            "\nFull-case last saved: " + (recoveryState.fullCaseSavedAt || "never") +
            "\n" + state.events.slice(-18).map(e =>
            e.time + " | " + e.type + " | " + e.reason + (e.detail ? " | " + e.detail : "")
        ).join("\n");
        const history = document.getElementById("caseRecoveryEventHistoryR1074");
        if (history && history.style.display !== "none") renderEventHistory();
    }

    function ensureEventHistoryPanel() {
        let box = document.getElementById("caseRecoveryEventHistoryR1074");
        if (box) return box;
        box = document.createElement("div");
        box.id = "caseRecoveryEventHistoryR1074";
        box.style.cssText = [
            "position:fixed", "left:8px", "right:8px", "bottom:8px", "z-index:2147483646",
            "max-height:38vh", "overflow:auto", "display:none", "padding:10px",
            "border:1px solid #64748b", "border-radius:8px", "background:#f8fafc",
            "color:#111827", "box-shadow:0 3px 14px rgba(0,0,0,.22)",
            "font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace", "white-space:pre-wrap",
            "pointer-events:auto"
        ].join(";");
        document.body.appendChild(box);
        return box;
    }

    function renderEventHistory() {
        const box = ensureEventHistoryPanel();
        box.textContent = "R1106 EVENT HISTORY (tap the CASE diagnostics label to close)\n" +
            state.events.slice(-16).map(e => {
                const t = new Date(e.time).toLocaleTimeString();
                return t + " | " + e.type + " | " + e.reason + (e.detail ? " | " + e.detail : "");
            }).join("\n");
    }

    function toggleEventHistory() {
        const box = ensureEventHistoryPanel();
        const opening = box.style.display === "none";
        if (opening) renderEventHistory();
        box.style.display = opening ? "block" : "none";
    }

    function record(type, reason, detail) {
        const e = {
            time: new Date().toISOString(),
            type,
            reason: String(reason || "unspecified"),
            detail: detail || ""
        };
        state.events.push(e);
        if (state.events.length > MAX_EVENTS) state.events.shift();
        state.lastEvent = type + ": " + e.reason;
        render();
        // R1146.4: notify read-only Developer Diagnostics after the recovery
        // state and event history have both been updated. This closes the
        // one-event-behind display gap without changing capture or persistence.
        try {
            window.dispatchEvent(new CustomEvent("case-recovery-diagnostics-updated", {
                detail: { type, time: e.time }
            }));
        } catch (_) {}
        console.info("[CaseRecovery R1076]", e);
        return e;
    }

    function markDirty(reason, source) {
        const now = Date.now();
        if (!state.dirty) {
            state.dirtySince = now;
            state.dirtyObservedCaseMutation = false;
        }
        state.dirty = true;
        state.mutationSerial += 1;
        state.lastReason = String(reason || source || "CASE mutation detected");
        state.lastMutationAt = now;
        record("case-change-pending", state.lastReason, "source=" + (source || "case-change-event"));
        scheduleEventDrivenCapture();
    }

    function beginCaseTransition(reason) {
        const token = {
            id: "case-transition-" + Date.now() + "-" + (state.events.length + 1),
            reason: String(reason || "unspecified"),
            closed: false
        };
        state.transitionStack.push(token);
        record("transition-begin", token.reason, "depth=" + state.transitionStack.length);
        return token;
    }

    function endCaseTransition(token, options) {
        const opts = options || {};
        const index = state.transitionStack.indexOf(token);
        if (!token || token.closed || index < 0) {
            record("transition-error", "invalid-or-closed-token");
            return false;
        }
        token.closed = true;
        state.transitionStack.splice(index, 1);
        if (opts.committed) {
            markDirty(opts.reason || token.reason, "transition-commit");
        } else {
            record("transition-ended", opts.reason || token.reason,
                "committed=false; depth=" + state.transitionStack.length);
        }
        record("transition-depth", token.reason, "depth=" + state.transitionStack.length);
        return true;
    }

    // Compatibility shim for existing commit-hook calls.
    // R1144.6: committed coordinator events are the normal mutation trigger.
    // This compatibility hook remains intentionally non-persisting; the central
    // event listener schedules a coherent full-case capture after real commits.
    // Transition lifecycle remains handled by beginCaseTransition/endCaseTransition.
    function noteCaseCommitted(_reason) {
        return state.generation;
    }

    function isPlausibleLoadedCase() {
        const c = window.currentCase;
        // A null/empty placeholder is not a recoverable baseline. This is a
        // structural readiness guard, not schema validation or clinical validation.
        return !!(c && typeof c === "object" && !Array.isArray(c) &&
            c.metadata && typeof c.metadata === "object" && !Array.isArray(c.metadata) &&
            (c.patient || c.frame || c.deformity || c.parameters));
    }

    function openRecoveryDb() {
        if (!recoveryState.supported) return Promise.reject(new Error("IndexedDB is not available"));
        if (recoveryDbPromise) return recoveryDbPromise;
        recoveryDbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(RECOVERY_DB_NAME, RECOVERY_DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(RECOVERY_STORE)) {
                    const store = db.createObjectStore(RECOVERY_STORE, { keyPath: "id" });
                    store.createIndex("savedAt", "savedAt", { unique: false });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error("Could not open recovery database"));
            request.onblocked = () => reject(new Error("Recovery database upgrade is blocked by another open tab"));
        }).catch(error => {
            recoveryDbPromise = null;
            throw error;
        });
        return recoveryDbPromise;
    }

    async function readLatestFullCaseRecoverySnapshot() {
        const db = await openRecoveryDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RECOVERY_STORE, "readonly");
            const request = tx.objectStore(RECOVERY_STORE).get(FULL_CASE_RECOVERY_ID);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error || new Error("Full-case recovery snapshot read failed"));
        });
    }

    async function readPendingFullCaseRecoverySnapshot() {
        const db = await openRecoveryDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RECOVERY_STORE, "readonly");
            const request = tx.objectStore(RECOVERY_STORE).get(FULL_CASE_RECOVERY_PENDING_ID);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error || new Error("Pending full-case snapshot read failed"));
        });
    }

    function sameAuthoritativeSnapshotIdentity(current, baseline) {
        if (!current || !baseline) return false;
        return current.schema === baseline.schema &&
            current.generation === baseline.generation &&
            current.savedAt === baseline.savedAt &&
            r1078CanonicalJson(current.caseData) === r1078CanonicalJson(baseline.caseData) &&
            r1078CanonicalJson(current.integrity) === r1078CanonicalJson(baseline.integrity) &&
            ["AP", "LAT"].every(view =>
                r1078CanonicalJson(current.xray?.[view]?.observation) ===
                r1078CanonicalJson(baseline.xray?.[view]?.observation) &&
                String(current.xray?.[view]?.imageChecksum || "").toLowerCase() ===
                String(baseline.xray?.[view]?.imageChecksum || "").toLowerCase());
    }

    async function armStagedWriteRaceTest(button) {
        if (state.fullCaseCaptureInProgress || state.transitionStack.length || state.autosavePaused) {
            showRecoveryVerification("R1121 RACE TEST NOT ARMED\nAutosave must be active, with no capture or CASE transition in progress.", false);
            return;
        }
        try {
            const baseline = await readLatestFullCaseRecoverySnapshot();
            if (!baseline || baseline.schema !== FULL_CASE_RECOVERY_SCHEMA) {
                throw new Error("No valid authoritative full-case snapshot exists. Save a full-case snapshot before arming this test.");
            }
            state.stagedRaceTestBaseline = baseline;
            state.stagedRaceTestArmed = true;
            state.stagedRaceTestInFlight = false;
            state.stagedRaceTestStatus = "ARMED · make first annotation change";
            record("staged-write-race-test-armed", "R1121 controlled test", "Baseline generation=" + baseline.generation + "; baseline savedAt=" + baseline.savedAt);
            if (button) { button.disabled = true; button.textContent = "RACE TEST ARMED"; }
            render();
        } catch (error) {
            showRecoveryVerification("R1121 RACE TEST NOT ARMED\n" + (error?.message || String(error)), false);
        }
    }

    function validateCapturedXrayRecord(view, record, sha256) {
        if (!record || record.imageView !== view) throw new Error(view + ": live X-ray record/view identity is missing.");
        const observation = record.observation;
        if (!observation || observation.version !== "xray-observation-v2" ||
            !Array.isArray(observation.images) || observation.images.length !== 1 ||
            observation.images[0]?.view !== view || !Array.isArray(observation.annotations)) {
            throw new Error(view + ": observation does not match the required xray-observation-v2 contract.");
        }
        const image = observation.images[0];
        if (record.imageSource === "EMPTY") {
            if (record.imageFileBytes && Number(record.imageFileBytes.byteLength || record.imageFileBytes.length || 0) !== 0) {
                throw new Error(view + ": an empty panel unexpectedly contains original image bytes.");
            }
            if (Number(record.imageByteLength || 0) !== 0 || record.imageChecksum ||
                image.source !== "empty" || image.identityStatus !== "EMPTY_NO_IMAGE" || observation.annotations.length !== 0) {
                throw new Error(view + ": explicit empty-panel record is internally inconsistent.");
            }
            return { bytes:new Uint8Array(0), observation, imageId:image.id || null, empty:true };
        }
        if (!record.imageFileBytes) throw new Error(view + ": complete original image record is missing.");
        const bytes = record.imageFileBytes instanceof Uint8Array
            ? record.imageFileBytes
            : new Uint8Array(record.imageFileBytes);
        if (!bytes.length) throw new Error(view + ": original image payload is empty.");
        if (!record.imageChecksum || !/^[a-f0-9]{64}$/i.test(String(record.imageChecksum))) {
            throw new Error(view + ": a valid SHA-256 image checksum is required.");
        }
        if (String(image.contentChecksum || "").toLowerCase() !== String(record.imageChecksum).toLowerCase() ||
            String(image.checksumAlgorithm || "").toUpperCase() !== "SHA-256") {
            throw new Error(view + ": observation is not bound to the captured image checksum.");
        }
        for (const annotation of observation.annotations) {
            if (annotation.imageId !== image.id) {
                throw new Error(view + ": annotation " + (annotation.id || "(unnamed)") + " references a different image.");
            }
        }
        return { bytes, observation, imageId: image.id || null, empty:false };
    }

    // R1078: canonical observation fingerprint. This deliberately ignores save timestamps
    // and event counters; it compares the actual image identity and clinical markup.
    function r1078CanonicalJson(value) {
        if (Array.isArray(value)) return "[" + value.map(r1078CanonicalJson).join(",") + "]";
        if (value && typeof value === "object") {
            return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + r1078CanonicalJson(value[k])).join(",") + "}";
        }
        return JSON.stringify(value);
    }

    // R1101: fingerprint the live iframe state through the read-only R1099 API.
    // No WIP export, IndexedDB read/write, or autosave flush is involved.
    async function r1078ReadXrayFingerprint(view, sha256) {
        if (typeof window.waitForXrayLiveApi !== "function") {
            throw new Error("R1118: X-ray iframe locator is unavailable.");
        }
        const panel = await window.waitForXrayLiveApi(view, "captureXrayLiveRecord");
        const live = await panel.captureXrayLiveRecord();
        if (!live?.observation) throw new Error(view + ": live capture observation is missing.");
        const observation = live.observation;
        if (observation.version !== "xray-observation-v2" ||
            !Array.isArray(observation.images) || observation.images.length !== 1 ||
            observation.images[0]?.view !== view || !Array.isArray(observation.annotations)) {
            throw new Error(view + ": live observation does not satisfy the X-ray observation contract.");
        }
        if (live.imageSource === "EMPTY") {
            if (live.imageFileBytes?.byteLength || Number(live.imageByteLength || 0) !== 0 ||
                observation.annotations.length !== 0 || observation.images[0].source !== "empty") {
                throw new Error(view + ": empty live panel fingerprint contains image bytes or annotations.");
            }
            return {
                view, imageSource:"EMPTY", imageId:observation.images[0].id || null,
                imageChecksum:null, byteLength:0,
                observationJson:r1078CanonicalJson(observation), annotationCount:0
            };
        }
        const rawBytes = live.imageFileBytes;
        if (!rawBytes) throw new Error(view + ": original live image bytes are missing.");
        const bytes = rawBytes instanceof Uint8Array ? rawBytes : new Uint8Array(rawBytes);
        if (!bytes.length) throw new Error(view + ": live original image is empty.");
        const actualHash = String(await sha256(bytes)).toLowerCase();
        const declaredHash = String(live.imageChecksum || "").toLowerCase();
        if (!declaredHash || actualHash !== declaredHash) {
            throw new Error(view + ": live capture bytes do not match the declared SHA-256 checksum.");
        }
        return {
            view, imageSource:String(live.imageSource || observation.images[0].source || "IMAGE").toUpperCase(),
            imageId: observation.images[0].id || null,
            imageChecksum: actualHash, byteLength: bytes.length,
            observationJson: r1078CanonicalJson(observation),
            annotationCount: observation.annotations.length
        };
    }

    function r1078SameFingerprint(a, b) {
        return !!a && !!b && a.view === b.view && a.imageSource === b.imageSource && a.imageId === b.imageId &&
            a.imageChecksum === b.imageChecksum && a.byteLength === b.byteLength &&
            a.observationJson === b.observationJson;
    }

    function recoveryCaseIdentity(caseData) {
        const metadata = caseData && typeof caseData === "object" ? (caseData.metadata || {}) : {};
        const id = caseData?.caseId ?? caseData?.id ?? metadata.caseId ?? metadata.id ?? null;
        const name = caseData?.caseName ?? caseData?.name ?? metadata.caseName ?? metadata.case_name ?? metadata.name ?? null;
        return { id: id == null ? null : String(id), name: name == null ? null : String(name) };
    }

    async function captureAndCommitStableFullCase(snapshotText, reason) {
        if (state.fullCaseCaptureInProgress) return;
        state.fullCaseCaptureAttempts += 1;
        if (state.autosavePaused) return;
        const candidateGeneration = state.generation + 1;
        const candidateMutationSerial = state.mutationSerial;
        const mutationCounters = { ...state.xrayMutationCounters };
        const caseChanged = snapshotText !== state.committedSnapshot;
        const xrayChanged = state.xrayDirty;
        record("full-case-change-stable", reason,
            "candidate generation=" + candidateGeneration + "; CASE changed=" + caseChanged +
            "; X-ray changed=" + xrayChanged + "; waiting for full-case transaction");
        const result = await captureFullCaseRecoverySnapshot(
            snapshotText, candidateGeneration, reason, mutationCounters
        );
        if (result?.ok && result.unchanged) {
            const active = safeSnapshot();
            if (active.error || active.text !== snapshotText || state.transitionStack.length > 0 ||
                state.mutationSerial !== candidateMutationSerial) {
                state.dirty = true;
                state.lastMutationAt = Date.now();
                record("full-case-duplicate-deferred", "active state changed during duplicate comparison",
                    "no generation change; waiting for a fresh stable comparison");
                render();
                return;
            }
            state.committedSnapshot = snapshotText;
            state.lastSnapshot = snapshotText;
            state.dirty = false;
            state.dirtySince = 0;
            state.dirtyObservedCaseMutation = false;
            state.xrayDirty = false;
            state.fullCaseRetryAttempts = 0;
            state.nextFullCaseRetryAt = 0;
            state.lastSuccessfulCaseIdentity = recoveryCaseIdentity(JSON.parse(snapshotText));
            recoveryState.lastSuccessfulCaseIdentity = state.lastSuccessfulCaseIdentity;
            state.fullCaseDuplicateCapturesDiscarded += 1;
            recoveryState.fullCaseStatus = "unchanged · previous snapshot retained";
            recoveryState.caseComponentStatus = "unchanged · matches saved CASE";
            recoveryState.xrayComponentStatus.AP = "unchanged · matches saved AP";
            recoveryState.xrayComponentStatus.LAT = "unchanged · matches saved LAT";
            record("full-case-duplicate-discarded", "captured content matches committed snapshot",
                "generation remains " + state.generation + "; no IndexedDB write performed");
            render();
            return;
        }
        if (!result?.ok) {
            state.fullCaseRetryAttempts += 1;
            const delay = Math.min(15000, 1500 * Math.pow(2, Math.min(state.fullCaseRetryAttempts - 1, 4)));
            state.nextFullCaseRetryAt = Date.now() + delay;
            // Keep dirty state and the old committed baseline. The event-driven
            // scheduler retries after this bounded backoff interval.
            state.dirty = true;
            state.lastMutationAt = Math.min(state.lastMutationAt || Date.now(), Date.now() - STABLE_MS);
            record("full-case-retry-scheduled", "full-case capture/storage failed",
                "attempt=" + state.fullCaseRetryAttempts + "; retry in " + delay + " ms; previous committed snapshot preserved");
            render();
            return;
        }

        const active = safeSnapshot();
        if (active.error || active.text !== snapshotText || state.transitionStack.length > 0 ||
            state.mutationSerial !== candidateMutationSerial) {
            state.fullCaseRetryAttempts = 0;
            state.nextFullCaseRetryAt = 0;
            state.dirty = true;
            state.lastMutationAt = Date.now();
            record("full-case-commit-deferred", "state changed during commit confirmation",
                "IndexedDB write completed, but active CASE/transition/mutation state no longer matches capture; a fresh snapshot is required");
            render();
            return;
        }

        // The IndexedDB transaction has completed successfully. Only now may the
        // in-memory committed baseline advance and dirty flags be cleared.
        state.generation = candidateGeneration;
        state.fullCaseSuccessfulCommits += 1;
        state.committedSnapshot = snapshotText;
        state.lastSnapshot = snapshotText;
        state.dirty = false;
        state.dirtySince = 0;
        state.dirtyObservedCaseMutation = false;
        state.xrayDirty = false;
        state.fullCaseRetryAttempts = 0;
        state.nextFullCaseRetryAt = 0;
        const caseData = JSON.parse(snapshotText);
        state.lastSuccessfulCaseIdentity = recoveryCaseIdentity(caseData);
        recoveryState.lastSuccessfulCaseIdentity = state.lastSuccessfulCaseIdentity;
        record("full-case-commit-confirmed", "IndexedDB transaction completed",
            "generation=" + candidateGeneration + "; CASE=" + (state.lastSuccessfulCaseIdentity.id || state.lastSuccessfulCaseIdentity.name || "identity unavailable") +
            "; AP image=" + (result.integrity?.AP?.imageId || "unknown") +
            "; LAT image=" + (result.integrity?.LAT?.imageId || "unknown"));
        render();
    }

    async function promoteStagedFullCaseRecoverySnapshot(db, expectedRecord) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RECOVERY_STORE, "readwrite");
            const store = tx.objectStore(RECOVERY_STORE);
            const request = store.get(FULL_CASE_RECOVERY_PENDING_ID);
            request.onsuccess = () => {
                const staged = request.result;
                if (!staged || staged.schema !== expectedRecord.schema ||
                    staged.generation !== expectedRecord.generation || staged.savedAt !== expectedRecord.savedAt) {
                    try { tx.abort(); } catch (_) {}
                    reject(new Error("Staged full-case candidate is missing or no longer matches the verified capture."));
                    return;
                }
                const authoritative = { ...staged, id: FULL_CASE_RECOVERY_ID };
                store.put(authoritative);
                store.delete(FULL_CASE_RECOVERY_PENDING_ID);
            };
            request.onerror = () => {
                try { tx.abort(); } catch (_) {}
                reject(request.error || new Error("Staged full-case candidate read failed."));
            };
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error("Full-case promotion transaction failed."));
            tx.onabort = () => reject(tx.error || new Error("Full-case promotion transaction aborted."));
        });
    }

    async function discardPendingFullCaseRecoverySnapshot() {
        try {
            const db = await openRecoveryDb();
            await new Promise((resolve, reject) => {
                const tx = db.transaction(RECOVERY_STORE, "readwrite");
                tx.objectStore(RECOVERY_STORE).delete(FULL_CASE_RECOVERY_PENDING_ID);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error || new Error("Pending full-case cleanup failed."));
                tx.onabort = () => reject(tx.error || new Error("Pending full-case cleanup aborted."));
            });
        } catch (error) {
            record("full-case-pending-cleanup-failed", "discard staged candidate", error?.message || String(error));
        }
    }

    async function captureFullCaseRecoverySnapshot(snapshotText, generation, reason, mutationCounters) {
        if (state.autosavePaused) return { ok: false, reason: "autosave-paused" };
        if (state.fullCaseCaptureInProgress) return { ok: false, reason: "capture-already-running" };
        state.fullCaseCaptureInProgress = true;
        recoveryState.fullCaseStatus = "capturing CASE + AP/LAT";
        recoveryState.caseComponentStatus = "capturing stable CASE";
        recoveryState.xrayComponentStatus.AP = "capturing image + observations";
        recoveryState.xrayComponentStatus.LAT = "capturing image + observations";
        recoveryState.fullCaseLastError = null;
        render();
        try {
            if (typeof window.waitForXrayLiveApi !== "function") {
                throw new Error("The X-ray iframe locator is unavailable.");
            }
            const caseData = JSON.parse(snapshotText);
            if (!caseData || typeof caseData !== "object" || Array.isArray(caseData)) {
                throw new Error("The stable CASE snapshot is not a JSON object.");
            }
            const sha256 = window.CaseFileService?.archive?.sha256Hex;
            if (typeof sha256 !== "function") throw new Error("CaseFileService SHA-256 helper is unavailable.");

            // Capture a read-only AP/LAT baseline directly from each live iframe.
            // R1101 no longer invokes the legacy helper that checkpointed per-view WIP.
            const before = {
                AP: await r1078ReadXrayFingerprint("AP", sha256),
                LAT: await r1078ReadXrayFingerprint("LAT", sha256)
            };

            const xray = {};
            const integrity = {};
            for (const view of ["AP", "LAT"]) {
                const panel = await window.waitForXrayLiveApi(view, "captureXrayLiveRecord");
                const record = await panel.captureXrayLiveRecord();
                const checked = validateCapturedXrayRecord(view, record, sha256);
                let actualHash = null;
                if (!checked.empty) {
                    actualHash = String(await sha256(checked.bytes)).toLowerCase();
                    if (actualHash !== String(record.imageChecksum).toLowerCase()) {
                        throw new Error(view + ": image bytes failed SHA-256 verification during full-case capture.");
                    }
                }
                xray[view] = record;
                integrity[view] = {
                    imageSource: checked.empty ? "EMPTY" : String(record.imageSource || "IMAGE").toUpperCase(),
                    imageId: checked.imageId,
                    byteLength: checked.bytes.length,
                    sha256: actualHash,
                    annotationCount: checked.observation.annotations.length
                };
            }

            // Compare actual exported content after capture. A save acknowledgement or
            // event counter increment alone cannot invalidate an unchanged observation.
            const after = {
                AP: await r1078ReadXrayFingerprint("AP", sha256),
                LAT: await r1078ReadXrayFingerprint("LAT", sha256)
            };
            for (const view of ["AP", "LAT"]) {
                if (!r1078SameFingerprint(before[view], after[view])) {
                    throw new Error(view + ": image or observations genuinely changed during capture; snapshot discarded for a coherent retry.");
                }
                const capturedObservation = r1078CanonicalJson(xray[view].observation);
                const capturedHash = xray[view].imageChecksum ? String(xray[view].imageChecksum).toLowerCase() : null;
                if (capturedObservation !== after[view].observationJson ||
                    capturedHash !== after[view].imageChecksum ||
                    (xray[view].imageSource === "EMPTY") !== (after[view].imageSource === "EMPTY")) {
                    throw new Error(view + ": captured record differs from the stable exported workspace record.");
                }
            }

            const activeAfter = safeSnapshot();
            if (!activeAfter.available || activeAfter.error || activeAfter.text !== snapshotText) {
                throw new Error("CASE changed while AP/LAT assets were being captured; full-case snapshot was discarded.");
            }

            // Compare complete clinical content with the last committed record before
            // allocating a generation or writing IndexedDB. Notifications alone are
            // never sufficient reason to create a new recovery generation.
            const previous = await readLatestFullCaseRecoverySnapshot();
            if (previous && previous.schema === FULL_CASE_RECOVERY_SCHEMA &&
                previous.caseData && previous.xray && previous.integrity) {
                const sameCase = r1078CanonicalJson(previous.caseData) === r1078CanonicalJson(caseData);
                const sameXray = ["AP", "LAT"].every(view => {
                    const oldIntegrity = previous.integrity[view];
                    const newIntegrity = integrity[view];
                    const oldObservation = previous.xray[view]?.observation;
                    const newObservation = xray[view]?.observation;
                    return !!oldIntegrity && !!newIntegrity && !!oldObservation && !!newObservation &&
                        String(oldIntegrity.imageSource || previous.xray[view]?.imageSource || "IMAGE") === String(newIntegrity.imageSource || xray[view]?.imageSource || "IMAGE") &&
                        String(oldIntegrity.imageId || "") === String(newIntegrity.imageId || "") &&
                        String(oldIntegrity.sha256 || "").toLowerCase() === String(newIntegrity.sha256 || "").toLowerCase() &&
                        Number(oldIntegrity.byteLength) === Number(newIntegrity.byteLength) &&
                        r1078CanonicalJson(oldObservation) === r1078CanonicalJson(newObservation);
                });
                if (sameCase && sameXray) {
                    recoveryState.fullCaseLastError = null;
                    record("full-case-content-unchanged", "candidate equals last committed snapshot",
                        "CASE JSON, AP/LAT image IDs, SHA-256, byte lengths and complete observations match");
                    return {
                        ok: true,
                        unchanged: true,
                        generation: previous.generation,
                        savedAt: previous.savedAt,
                        integrity: previous.integrity
                    };
                }
            }

            state.fullCaseContentChangesDetected += 1;
            const savedAt = new Date().toISOString();
            const recordData = {
                id: FULL_CASE_RECOVERY_ID,
                schema: FULL_CASE_RECOVERY_SCHEMA,
                appVersion: "R1121",
                savedAt,
                generation,
                reason: String(reason || "stable full-case change"),
                caseData,
                caseIdentity: recoveryCaseIdentity(caseData),
                xray,
                integrity,
                capture: {
                    caseJsonLength: snapshotText.length,
                    xrayMutationCounters: { ...mutationCounters },
                    requiredViews: ["AP", "LAT"]
                }
            };
            const db = await openRecoveryDb();
            // R1118: write to a staging key first. The authoritative latest snapshot
            // remains untouched until the candidate passes the post-write live-state
            // verification below.
            const stagedRecord = { ...recordData, id: FULL_CASE_RECOVERY_PENDING_ID };
            await new Promise((resolve, reject) => {
                const tx = db.transaction(RECOVERY_STORE, "readwrite");
                tx.objectStore(RECOVERY_STORE).put(stagedRecord);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error || new Error("Full-case staging transaction failed"));
                tx.onabort = () => reject(tx.error || new Error("Full-case staging transaction aborted"));
            });

            // R1121 controlled race test: hold the candidate at the staging key
            // for 20 seconds so a second live annotation edit can occur before
            // the normal post-write fingerprints and promotion decision.
            if (state.stagedRaceTestArmed) {
                state.stagedRaceTestArmed = false;
                state.stagedRaceTestInFlight = true;
                state.stagedRaceTestStatus = "STAGED · make SECOND annotation change now (20 seconds)";
                record("staged-write-race-test-window-open", "pending candidate written", "The authoritative snapshot is still untouched; post-write verification will run after the test window.");
                render();
                await new Promise(resolve => setTimeout(resolve, 20000));
            }

            // Verify the live clinical state AFTER the staging transaction completes.
            // If any component changed while the write was pending, discard the staged
            // candidate; the previous authoritative snapshot remains available.
            const postWriteCase = safeSnapshot();
            if (!postWriteCase.available || postWriteCase.error || postWriteCase.text !== snapshotText) {
                throw new Error("CASE changed while the full-case IndexedDB staging transaction was completing; staged candidate rejected.");
            }
            const postWrite = {
                AP: await r1078ReadXrayFingerprint("AP", sha256),
                LAT: await r1078ReadXrayFingerprint("LAT", sha256)
            };
            for (const view of ["AP", "LAT"]) {
                if (!r1078SameFingerprint(after[view], postWrite[view])) {
                    throw new Error(view + ": live image or observations changed before post-write confirmation; staged candidate rejected.");
                }
            }
            if (state.stagedRaceTestInFlight) {
                throw new Error("R1121 race test inconclusive: no concurrent CASE/AP/LAT edit was detected during the staged-write window; candidate deliberately rejected.");
            }

            // Promote atomically only after CASE/AP/LAT still match the captured
            // candidate. The fixed pending key is removed in the same transaction.
            await promoteStagedFullCaseRecoverySnapshot(db, recordData);

            recoveryState.fullCaseStatus = "saved · CASE + AP/LAT verified";
            recoveryState.caseComponentStatus = "captured · stable JSON";
            recoveryState.xrayComponentStatus.AP = integrity.AP.imageSource === "EMPTY" ? "captured · intentionally empty · 0 annotations" : "captured · SHA-256 verified · " + integrity.AP.annotationCount + " annotations";
            recoveryState.xrayComponentStatus.LAT = integrity.LAT.imageSource === "EMPTY" ? "captured · intentionally empty · 0 annotations" : "captured · SHA-256 verified · " + integrity.LAT.annotationCount + " annotations";
            recoveryState.fullCaseSavedAt = savedAt;
            recoveryState.fullCaseSavedGeneration = generation;
            recoveryState.lastSuccessfulCaseIdentity = recoveryCaseIdentity(caseData);
            recoveryState.fullCaseImageIds = {
                AP: integrity.AP.imageId || null,
                LAT: integrity.LAT.imageId || null
            };
            recoveryState.fullCaseLastError = null;
            record("full-case-recovery-snapshot-saved", "stable CASE + AP/LAT change",
                "schema=" + FULL_CASE_RECOVERY_SCHEMA + "; generation=" + generation +
                "; AP=" + integrity.AP.imageSource + "/" + integrity.AP.byteLength + " bytes/" + integrity.AP.annotationCount + " annotations" +
                "; LAT=" + integrity.LAT.imageSource + "/" + integrity.LAT.byteLength + " bytes/" + integrity.LAT.annotationCount + " annotations");
            return { ok: true, savedAt, generation, integrity };
        } catch (error) {
            await discardPendingFullCaseRecoverySnapshot();
            if (state.stagedRaceTestInFlight) {
                state.stagedRaceTestInFlight = false;
                state.autosavePaused = true;
                const baseline = state.stagedRaceTestBaseline;
                let authoritative = null;
                let pending = null;
                try {
                    authoritative = await readLatestFullCaseRecoverySnapshot();
                    pending = await readPendingFullCaseRecoverySnapshot();
                } catch (_) {}
                const preserved = sameAuthoritativeSnapshotIdentity(authoritative, baseline);
                const pendingCleared = !pending;
                const detectedConcurrentEdit = /changed before post-write confirmation|CASE changed while the full-case IndexedDB staging/i.test(error?.message || String(error));
                state.stagedRaceTestStatus = preserved && pendingCleared && detectedConcurrentEdit
                    ? "PASS · candidate rejected; prior snapshot preserved"
                    : (preserved && pendingCleared ? "INCONCLUSIVE · no concurrent edit detected" : "FAIL · authoritative snapshot/pending-key check failed");
                record("staged-write-race-test-finished", "R1121 controlled test",
                    "concurrentEditDetected=" + detectedConcurrentEdit + "; priorSnapshotPreserved=" + preserved + "; pendingKeyCleared=" + pendingCleared + "; autosave paused");
                showRecoveryVerification(
                    (preserved && pendingCleared && detectedConcurrentEdit ? "RESULT: PASS — STAGED-WRITE RACE PROTECTED" : "RESULT: " + (preserved && pendingCleared ? "INCONCLUSIVE — NO CONCURRENT EDIT DETECTED" : "FAIL — SNAPSHOT INTEGRITY CHECK FAILED")) +
                    "\nConcurrent edit detected: " + (detectedConcurrentEdit ? "YES" : "NO") +
                    "\nPrevious authoritative snapshot preserved: " + (preserved ? "YES" : "NO") +
                    "\nPending candidate removed: " + (pendingCleared ? "YES" : "NO") +
                    "\nAutosave: PAUSED automatically" +
                    "\n\n" + (error?.message || String(error)),
                    preserved && pendingCleared && detectedConcurrentEdit);
                state.stagedRaceTestBaseline = null;
            }
            recoveryState.fullCaseStatus = "capture failed · previous full-case snapshot retained";
            recoveryState.fullCaseLastError = error?.message || String(error);
            if (/genuinely changed during capture|captured record differs|changed before post-write confirmation/i.test(recoveryState.fullCaseLastError)) {
                state.xrayDirty = true;
                markDirty("X-ray content changed during full-case capture or commit", "content-fingerprint-retry");
            }
            if (/CASE changed while the full-case IndexedDB transaction/i.test(recoveryState.fullCaseLastError)) {
                markDirty("CASE changed during full-case commit", "case-post-write-retry");
            }
            if (/\bCASE\b/i.test(recoveryState.fullCaseLastError)) recoveryState.caseComponentStatus = "capture failed";
            if (/\bAP\b/i.test(recoveryState.fullCaseLastError)) recoveryState.xrayComponentStatus.AP = "capture failed";
            if (/\bLAT\b/i.test(recoveryState.fullCaseLastError)) recoveryState.xrayComponentStatus.LAT = "capture failed";
            record("full-case-recovery-snapshot-failed", "stable CASE + AP/LAT change", recoveryState.fullCaseLastError);
            return { ok: false, reason: recoveryState.fullCaseLastError };
        } finally {
            state.fullCaseCaptureInProgress = false;
            render();
        }
    }

    async function copyRecoveryMonitorResult(button) {
        const summary = document.getElementById("caseRecoveryMonitorSummaryR1076");
        const text = summary?.textContent || "";
        if (!text) {
            button.textContent = "EMPTY";
            return;
        }
        try {
            if (navigator.clipboard?.writeText && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const field = document.createElement("textarea");
                field.value = text;
                field.setAttribute("readonly", "");
                field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
                document.body.appendChild(field);
                field.select();
                const copied = document.execCommand("copy");
                field.remove();
                if (!copied) throw new Error("Clipboard copy was not accepted");
            }
            button.textContent = "COPIED";
            button.title = "Recovery result copied to clipboard";
        } catch (error) {
            button.textContent = "SELECT";
            button.title = "Copy unavailable. Use the event panel or select the monitor text manually.";
            if (summary) {
                const range = document.createRange();
                range.selectNodeContents(summary);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    function ensureRecoveryVerifyButton() {
        // R1103: remove the obsolete ZIP transition overlay; transition depth
        // remains internal state for import/restore transaction safety.
        document.getElementById("caseRecoveryTransitionPopupR1074")?.remove();
        let panel = document.getElementById("caseRecoveryDiagnosticPanel");
        if (!panel) {
            panel = document.createElement("section");
            panel.id = "caseRecoveryDiagnosticPanel";
            panel.setAttribute("role", "status");
            panel.setAttribute("aria-live", "polite");
            document.body.appendChild(panel);
        }
        // A prior script instance may have marked the panel as built. Reuse it
        // only when its required DOM structure is still present; never trust the
        // marker alone because a second start() must not leave a text-only panel.
        if (panel.dataset.monitorBuilt === "R1146.5" &&
            panel.querySelector("#caseRecoveryResultRegionR1128") &&
            panel.querySelector("#caseRecoveryMonitorSummaryR1076") &&
            panel.querySelector("#caseRecoveryVerifyButtonR1092") &&
            panel.querySelector("#caseRecoveryPauseAutosaveButtonR1121") &&
            panel.querySelector("#caseRecoveryStagedRaceTestButtonR1121")) {
            return document.getElementById("caseRecoveryVerifyButtonR1092");
        }
        panel.dataset.monitorBuilt = "R1146.5";
        document.getElementById("caseRecoveryVerificationResultR1074")?.remove();
        panel.style.cssText = [
            "position:fixed", "right:14px", "bottom:14px", "left:auto", "top:auto",
            "width:min(444px,calc(100vw - 24px))", "max-height:min(68vh,620px)",
            "z-index:2147483644", "overflow:auto", "padding:0",
            "border:1px solid #64748b", "border-radius:11px", "background:#ffffff",
            "color:#111827", "box-shadow:0 5px 24px rgba(0,0,0,.25)",
            "font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
            "overflow-wrap:anywhere", "pointer-events:auto"
        ].join(";");
        panel.innerHTML = "";
        const header = document.createElement("div");
        header.id = "caseRecoveryMonitorHeaderR1092";
        header.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;background:#1e293b;color:#fff;border-radius:10px 10px 0 0;cursor:move;touch-action:none;user-select:none";
        const title = document.createElement("strong");
        title.textContent = "STANDALONE LOCAL INDEXEDDB RECOVERY · R1146.5";
        title.style.cssText = "font-size:12px;letter-spacing:.02em";
        const headerActions = document.createElement("div");
        headerActions.style.cssText = "display:flex;gap:5px";
        const copyButton = document.createElement("button");
        copyButton.type = "button"; copyButton.textContent = "COPY";
        copyButton.title = "Copy current recovery result";
        copyButton.style.cssText = "padding:4px 7px;border:1px solid #94a3b8;border-radius:5px;background:#334155;color:#fff;font-size:10px;cursor:pointer";
        copyButton.addEventListener("click", () => { void copyRecoveryMonitorResult(copyButton); });
        const eventsButton = document.createElement("button");
        eventsButton.type = "button"; eventsButton.textContent = "EVENTS";
        eventsButton.style.cssText = "padding:4px 7px;border:1px solid #94a3b8;border-radius:5px;background:#334155;color:#fff;font-size:10px;cursor:pointer";
        eventsButton.addEventListener("click", toggleEventHistory);
        const closeButton = document.createElement("button");
        closeButton.type = "button"; closeButton.textContent = "×";
        closeButton.title = "Close recovery monitor";
        closeButton.setAttribute("aria-label", "Close recovery monitor");
        closeButton.style.cssText = "padding:2px 8px;border:1px solid #94a3b8;border-radius:5px;background:#334155;color:#fff;font-size:17px;line-height:1;cursor:pointer";
        headerActions.append(copyButton, eventsButton, closeButton);
        header.append(title, headerActions);
        const body = document.createElement("div");
        body.id = "caseRecoveryMonitorBodyR1092";
        body.style.cssText = "padding:10px 11px 11px";
        const resultRegion = document.createElement("section");
        resultRegion.id = "caseRecoveryResultRegionR1128";
        resultRegion.style.cssText = "display:none;margin:0 0 10px;padding:9px;border:1px solid #94a3b8;border-left:4px solid #64748b;border-radius:7px;background:#f8fafc;color:#111827";
        const resultHeading = document.createElement("strong");
        resultHeading.id = "caseRecoveryResultHeadingR1128";
        resultHeading.style.cssText = "display:block;margin-bottom:5px;font:700 11px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";
        const resultSummary = document.createElement("pre");
        resultSummary.id = "caseRecoveryResultSummaryR1128";
        resultSummary.style.cssText = "margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:10px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace";
        const resultDetails = document.createElement("details");
        resultDetails.style.cssText = "margin-top:6px;font:10px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";
        const resultDetailsLabel = document.createElement("summary");
        resultDetailsLabel.textContent = "Additional recovery details";
        resultDetailsLabel.style.cssText = "cursor:pointer;color:#475569";
        const resultFull = document.createElement("pre");
        resultFull.id = "caseRecoveryResultFullR1128";
        resultFull.style.cssText = "margin:5px 0 0;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font:10px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace";
        resultDetails.append(resultDetailsLabel, resultFull);
        resultRegion.append(resultHeading, resultSummary, resultDetails);
        const summary = document.createElement("pre");
        summary.id = "caseRecoveryMonitorSummaryR1076";
        summary.style.cssText = "margin:0 0 10px;white-space:pre;overflow-x:auto;overflow-y:hidden;overflow-wrap:normal;font:11px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace";
        // R1146.5: separate routine recovery operations from advanced test controls.
        // Existing button IDs, handlers and recovery algorithms are preserved.
        const recoveryHeading = document.createElement("strong");
        recoveryHeading.textContent = "RECOVERY ACTIONS";
        recoveryHeading.style.cssText = "display:block;margin:2px 0 7px;font-size:10px;letter-spacing:.06em;color:#334155";
        const actionRow = document.createElement("div");
        actionRow.style.cssText = "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-bottom:7px";
        const capture = document.createElement("button");
        capture.id = "caseRecoveryCaptureNowButtonR1092"; capture.type = "button"; capture.textContent = "CAPTURE FULL CASE NOW";
        capture.style.cssText = "width:100%;padding:8px 9px;border:1px solid #166534;border-radius:6px;background:#f0fdf4;color:#166534;font-weight:700;font-size:10px;cursor:pointer";
        capture.addEventListener("click", () => { void captureFullCaseNow(); });
        const verify = document.createElement("button");
        verify.id = "caseRecoveryVerifyButtonR1092"; verify.type = "button"; verify.textContent = "VERIFY SNAPSHOT";
        verify.style.cssText = "width:100%;padding:8px 9px;border:1px solid #1d4ed8;border-radius:6px;background:#eff6ff;color:#1d4ed8;font-weight:700;font-size:10px;cursor:pointer";
        verify.addEventListener("click", () => { void verifyLatestFullCaseRecoverySnapshot(); });
        const advanced = document.createElement("details");
        advanced.id = "caseRecoveryAdvancedControlsR1146_5";
        advanced.style.cssText = "margin:3px 0 8px;border:1px solid #cbd5e1;border-radius:7px;background:#f8fafc;padding:7px 8px";
        const advancedSummary = document.createElement("summary");
        advancedSummary.textContent = "ADVANCED / DEVELOPER CONTROLS";
        advancedSummary.style.cssText = "cursor:pointer;font-size:10px;font-weight:800;letter-spacing:.04em;color:#475569";
        advanced.appendChild(advancedSummary);
        const advancedActions = document.createElement("div");
        advancedActions.style.cssText = "display:flex;gap:7px;flex-wrap:wrap;margin-top:8px";
        const pauseAutosave = document.createElement("button");
        pauseAutosave.id = "caseRecoveryPauseAutosaveButtonR1121";
        pauseAutosave.type = "button";
        pauseAutosave.textContent = "PAUSE AUTOSAVE";
        pauseAutosave.title = "Temporarily stop automatic full-case commits while preserving the last committed snapshot";
        pauseAutosave.style.cssText = "flex:1 1 100%;padding:8px 9px;border:1px solid #92400e;border-radius:6px;background:#fffbeb;color:#92400e;font-weight:800;font-size:10px;cursor:pointer";
        pauseAutosave.addEventListener("click", () => {
            if (state.fullCaseCaptureInProgress || state.transitionStack.length) {
                showRecoveryVerification("AUTOSAVE PAUSE NOT APPLIED\nWait for the current capture or CASE transition to finish.", false);
                return;
            }
            state.autosavePaused = !state.autosavePaused;
            pauseAutosave.textContent = state.autosavePaused ? "RESUME AUTOSAVE" : "PAUSE AUTOSAVE";
            pauseAutosave.style.background = state.autosavePaused ? "#fee2e2" : "#fffbeb";
            pauseAutosave.style.color = state.autosavePaused ? "#991b1b" : "#92400e";
            pauseAutosave.style.borderColor = state.autosavePaused ? "#991b1b" : "#92400e";
            record(state.autosavePaused ? "autosave-paused-for-manual-recovery-test" : "autosave-resumed-after-manual-recovery-test",
                "temporary R1121 test control", state.autosavePaused ? "Automatic full-case commits are suspended; the authoritative snapshot is unchanged." : "Automatic full-case commits are active again.");
            if (!state.autosavePaused && state.dirty) scheduleEventDrivenCapture();
            render();
        });
        const raceTest = document.createElement("button");
        raceTest.id = "caseRecoveryStagedRaceTestButtonR1121";
        raceTest.type = "button";
        raceTest.textContent = "ARM STAGED-WRITE RACE TEST";
        raceTest.title = "One-time controlled test: make one edit to trigger autosave, then a second edit during the 12-second staged-write window";
        raceTest.style.cssText = "flex:1 1 100%;padding:8px 9px;border:1px solid #7c3aed;border-radius:6px;background:#f5f3ff;color:#6d28d9;font-weight:800;font-size:10px;cursor:pointer";
        raceTest.addEventListener("click", () => { void armStagedWriteRaceTest(raceTest); });
        const restore = document.createElement("button");
        restore.id = "caseRecoveryRestoreFullButtonR1092"; restore.type = "button"; restore.textContent = "RESTORE FULL CASE";
        restore.style.cssText = "flex:1 1 100%;padding:9px;border:1px solid #9a3412;border-radius:6px;background:#fff7ed;color:#9a3412;font-weight:800;font-size:11px;cursor:pointer";
        restore.addEventListener("click", () => { void restoreLatestFullCaseRecoverySnapshot(); });
        advancedActions.append(pauseAutosave, raceTest);
        advanced.appendChild(advancedActions);
        restore.style.cssText = "width:100%;padding:9px;border:1px solid #9a3412;border-radius:6px;background:#fff7ed;color:#9a3412;font-weight:800;font-size:11px;cursor:pointer;margin:0 0 9px";
        actionRow.append(capture, verify);
        body.append(resultRegion, summary, recoveryHeading, actionRow, restore, advanced);
        panel.append(header, body);
        document.body.appendChild(panel);

        // Remember the floating position, but keep it entirely outside case data.
        try {
            const saved = JSON.parse(localStorage.getItem("caseRecoveryMonitorPositionR1087") || "null");
            if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
                panel.style.left = Math.max(0, Math.min(saved.left, window.innerWidth - 90)) + "px";
                panel.style.top = Math.max(0, Math.min(saved.top, window.innerHeight - 45)) + "px";
                panel.style.right = "auto"; panel.style.bottom = "auto";
            }
        } catch (_) {}
        let reopenButton = document.getElementById("caseRecoveryMonitorReopenR1092");
        if (!reopenButton) {
            reopenButton = document.createElement("button");
            reopenButton.id = "caseRecoveryMonitorReopenR1092";
            reopenButton.type = "button";
            reopenButton.textContent = "RECOVERY";
            reopenButton.title = "Reopen Standalone local IndexedDB recovery monitor";
            reopenButton.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:2147483644;padding:8px 11px;border:1px solid #64748b;border-radius:8px;background:#1e293b;color:#fff;font:700 11px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;box-shadow:0 3px 12px rgba(0,0,0,.22);cursor:pointer;display:none";
            document.body.appendChild(reopenButton);
        }
        closeButton.addEventListener("click", () => {
            panel.style.display = "none";
            reopenButton.style.display = "block";
        });
        reopenButton.addEventListener("click", () => {
            panel.style.display = "block";
            reopenButton.style.display = "none";
        });

        let drag = null;
        header.style.touchAction = "none";
        header.style.cursor = "move";
        header.addEventListener("pointerdown", event => {
            if (event.target.closest("button")) return;
            if (event.button !== undefined && event.button !== 0) return;
            const rect = panel.getBoundingClientRect();
            drag = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, pointerId: event.pointerId };
            panel.style.left = rect.left + "px"; panel.style.top = rect.top + "px";
            panel.style.right = "auto"; panel.style.bottom = "auto";
            event.preventDefault();
        });
        // Listen on window so a quick drag remains tracked after the pointer leaves the header.
        window.addEventListener("pointermove", event => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - 42);
            panel.style.left = Math.max(0, Math.min(maxLeft, drag.left + event.clientX - drag.x)) + "px";
            panel.style.top = Math.max(0, Math.min(maxTop, drag.top + event.clientY - drag.y)) + "px";
        });
        const stopDrag = event => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            drag = null;
            const rect = panel.getBoundingClientRect();
            try { localStorage.setItem("caseRecoveryMonitorPositionR1087", JSON.stringify({left:rect.left,top:rect.top})); } catch (_) {}
        };
        window.addEventListener("pointerup", stopDrag);
        window.addEventListener("pointercancel", stopDrag);
        window.addEventListener("resize", () => {
            const rect = panel.getBoundingClientRect();
            if (rect.right > window.innerWidth) panel.style.left = Math.max(0, window.innerWidth - panel.offsetWidth) + "px";
            if (rect.bottom > window.innerHeight) panel.style.top = Math.max(0, window.innerHeight - Math.min(panel.offsetHeight, window.innerHeight)) + "px";
        });
        return verify;
    }

    function byteLengthOf(value) {
        if (!value) return 0;
        if (value instanceof ArrayBuffer) return value.byteLength;
        if (ArrayBuffer.isView(value)) return value.byteLength;
        if (typeof Blob !== "undefined" && value instanceof Blob) return value.size;
        return Number(value.byteLength || value.length || 0) || 0;
    }

    async function inspectXrayAssetRecords() {
        const rows = [];
        try {
            for (const view of ["AP", "LAT"]) {
                const frameId = view === "LAT" ? "xrayLATVtkFrame" : "xrayAPVtkFrame";
                const frame = document.getElementById(frameId);
                if (!frame?.contentWindow) throw new Error(view + ": X-ray iframe is unavailable.");
                const vtk = await waitForXrayLiveApi(view, "captureXrayLiveRecord");
                const live = await vtk.captureXrayLiveRecord();
                const observation = live?.observation || null;
                const image = observation?.images?.[0] || null;
                const bytes = live?.imageFileBytes || null;
                const byteLength = byteLengthOf(bytes);
                const empty = live?.imageSource === "EMPTY";
                rows.push({
                    view,
                    iframeReadyState: frame.contentDocument?.readyState || "unknown",
                    recordPresent: !!live,
                    observationPresent: !!observation,
                    observationVersion: observation?.version || null,
                    observationView: image?.view || null,
                    imageId: image?.id || null,
                    annotationCount: Array.isArray(observation?.annotations) ? observation.annotations.length : null,
                    imageBytesPresent: byteLength > 0,
                    imageBytesLength: byteLength,
                    exportedImageByteLength: live?.imageByteLength ?? null,
                    imageFileName: live?.imageFileName || null,
                    imageFileType: live?.imageFileType || null,
                    imageSource: live?.imageSource || image?.source || null,
                    recordChecksum: live?.imageChecksum || null,
                    observationChecksum: image?.contentChecksum || null,
                    checksumAlgorithm: live?.imageChecksumAlgorithm || image?.checksumAlgorithm || null,
                    empty
                });
            }
            const lines = [
                "R1123 — READ-ONLY LIVE AP/LAT ASSET INSPECTION",
                "Reads current VTK panel state only. No per-view WIP database access or writes occur.",
                "",
                ...rows.flatMap(row => [
                    row.view + ":",
                    "  iframe=" + row.iframeReadyState + "; live record=" + (row.recordPresent ? "present" : "missing"),
                    "  observation=" + (row.observationPresent ? row.observationVersion : "missing") + "; view=" + (row.observationView || "n/a"),
                    "  imageId=" + (row.imageId || "n/a") + "; annotations=" + (row.annotationCount ?? "n/a"),
                    "  state=" + (row.empty ? "intentionally empty" : (row.imageSource || "unknown")),
                    "  original image bytes=" + row.imageBytesLength,
                    "  file=" + (row.imageFileName || "n/a") + "; type=" + (row.imageFileType || "n/a"),
                    "  SHA-256=" + (row.recordChecksum || "not applicable"),
                    ""
                ]),
                "Interpretation: this is a live-state inspection, not a persisted per-view working-copy inspection."
            ];
            const message = lines.join("\n");
            const ok = rows.length === 2 && rows.every(r =>
                r.observationPresent && (r.empty
                    ? r.annotationCount === 0 && r.imageBytesLength === 0
                    : r.imageBytesLength > 0 && !!r.recordChecksum));
            showRecoveryVerification(message, ok);
            record("readonly-live-xray-asset-inspection", "floating recovery monitor",
                rows.map(r => r.view + " source=" + r.imageSource + "; bytes=" + r.imageBytesLength + "; annotations=" + r.annotationCount).join(" | "));
            return { ok, rows };
        } catch (error) {
            const message = error?.message || String(error);
            showRecoveryVerification("R1123 — READ-ONLY LIVE ASSET INSPECTION FAILED\n" + message, false);
            record("readonly-live-xray-asset-inspection-failed", "floating recovery monitor", message);
            return { ok: false, reason: message, rows };
        }
    }

    async function captureFullCaseNow() {
        if (!isStandaloneMode() || !standaloneRecoveryActive) {
            throw new Error("Local full-case capture is available only after explicit Standalone Mode selection.");
        }
        const button = document.getElementById("caseRecoveryCaptureNowButtonR1092");
        if (button) button.disabled = true;
        try {
            const snapshot = safeSnapshot();
            if (!state.caseReady || !state.baselineEstablished || !snapshot.available || snapshot.error) {
                throw new Error("CASE is not ready for a manual full-case capture. Wait until the application CASE has loaded.");
            }
            if (state.transitionStack.length) throw new Error("A CASE transition is in progress. Wait for it to finish before capturing.");
            if (state.fullCaseCaptureInProgress) throw new Error("A full-case capture is already running.");
            recoveryState.caseComponentStatus = "manual capture requested";
            recoveryState.xrayComponentStatus.AP = "manual capture requested";
            recoveryState.xrayComponentStatus.LAT = "manual capture requested";
            record("manual-full-case-capture-requested", "floating recovery monitor", "No workspace navigation or case mutation was triggered by the monitor.");
            const manualGeneration = state.generation + 1;
            const manualCounters = { ...state.xrayMutationCounters };
            const result = await captureFullCaseRecoverySnapshot(snapshot.text, manualGeneration,
                "manual floating-monitor capture", manualCounters);
            if (!result.ok) throw new Error(result.reason || "Full-case capture failed.");
            state.generation = manualGeneration;
            state.lastSnapshot = snapshot.text;
            state.committedSnapshot = snapshot.text;
            if (manualCounters.AP === state.xrayMutationCounters.AP && manualCounters.LAT === state.xrayMutationCounters.LAT) {
                state.dirty = false;
                state.dirtySince = 0;
                state.dirtyObservedCaseMutation = false;
                state.xrayDirty = false;
            }
            render();
            showRecoveryVerification("RESULT: PASS — FULL CASE CAPTURED\nCASE + AP + LAT were captured and SHA-256 verified.\nThis did not restore or modify the active CASE.", true);
            return result;
        } catch (error) {
            const message = error?.message || String(error);
            recoveryState.fullCaseStatus = "manual capture failed";
            recoveryState.fullCaseLastError = message;
            showRecoveryVerification("RESULT: FULL-CASE CAPTURE FAILED\n" + message, false);
            record("manual-full-case-capture-failed", "floating recovery monitor", message);
            render();
            return { ok: false, reason: message };
        } finally {
            if (button) button.disabled = false;
        }
    }

    function showRecoveryVerification(message, ok) {
        const fullMessage = String(message ?? "");
        // Keep recovery progress/results in the existing draggable monitor.
        document.getElementById("caseRecoveryVerificationResultR1074")?.remove();

        let panel = document.getElementById("caseRecoveryDiagnosticPanel");
        if (!panel || !panel.querySelector("#caseRecoveryResultRegionR1128")) {
            ensureRecoveryVerifyButton();
            panel = document.getElementById("caseRecoveryDiagnosticPanel");
        }
        const region = panel?.querySelector("#caseRecoveryResultRegionR1128");
        const heading = panel?.querySelector("#caseRecoveryResultHeadingR1128");
        const summary = panel?.querySelector("#caseRecoveryResultSummaryR1128");
        const full = panel?.querySelector("#caseRecoveryResultFullR1128");
        if (!region || !heading || !summary || !full) {
            console.error("[R1128] Floating recovery result region is unavailable.", fullMessage);
            return;
        }

        const lines = fullMessage.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        const isPass = /RESULT:\s*PASS/i.test(fullMessage);
        const isFailure = /FAILED|FAILURE|STOPPED|REJECTED|NOT APPLIED/i.test(fullMessage);
        const isProgress = /STARTED|validating|restoring .*…/i.test(fullMessage);
        heading.textContent = isPass
            ? "AUTOMATIC RECOVERY · PASS"
            : (isFailure ? "AUTOMATIC RECOVERY · ATTENTION REQUIRED" : (isProgress ? "RECOVERY · IN PROGRESS" : "RECOVERY STATUS"));
        heading.style.color = isPass ? "#166534" : (isFailure ? "#9a3412" : "#1e40af");
        region.style.borderLeftColor = isPass ? "#16a34a" : (isFailure ? "#d97706" : "#3b82f6");
        region.style.borderColor = isPass ? "#86efac" : (isFailure ? "#fdba74" : "#93c5fd");
        region.style.background = isPass ? "#f0fdf4" : (isFailure ? "#fff7ed" : "#eff6ff");

        // The visible summary carries the result and restored components.
        // Every other original message line appears only in the expandable
        // details section, so the same lines are never shown twice.
        const summaryMatchers = [
            /^RESULT:/i,
            /^Snapshot saved at:/i,
            /^Generation:/i,
            /^Case:/i,
            /^CASE:/i,
            /^AP:/i,
            /^LAT:/i,
            /^Automatic startup restore:/i
        ];
        const summaryLines = [];
        const detailLines = [];
        for (const line of lines) {
            if (summaryMatchers.some(pattern => pattern.test(line))) summaryLines.push(line);
            else detailLines.push(line);
        }
        const summaryText = summaryLines.join("\n") || (ok ? "Operation completed." : "See additional recovery details.");
        const detailsText = detailLines.join("\n") || "No additional recovery details.";
        if (summary.textContent !== summaryText) summary.textContent = summaryText;
        if (full.textContent !== detailsText) full.textContent = detailsText;
        region.style.display = "block";
    }

    function r1079CaseLabel(caseData) {
        const patient = caseData?.patient?.patient_name || caseData?.metadata?.patient_name || caseData?.patient_name || 'Unknown patient';
        const name = caseData?.metadata?.case_name || '(unnamed case)';
        const patientId = caseData?.patient?.patient_id || caseData?.metadata?.patient_id || '(no patient ID)';
        return { patient: String(patient), name: String(name), patientId: String(patientId) };
    }

    async function restoreLatestFullCaseRecoverySnapshot(restoreOptions = {}) {
        if (!isStandaloneMode() || !standaloneRecoveryActive) {
            throw new Error("Local full-case recovery is available only in explicitly selected Standalone Mode.");
        }
        const button = document.getElementById('caseRecoveryRestoreFullButtonR1092');
        if (button) button.disabled = true;
        recoveryState.fullCaseStatus = 'validating full-case restore';
        state.fullCaseRestoreInProgress = true;
        if (eventCaptureTimer !== null) window.clearTimeout(eventCaptureTimer);
        eventCaptureTimer = null;
        render();
        try {
            const saved = await readLatestFullCaseRecoverySnapshot();
            if (!saved) throw new Error('No latest-stable-full-case snapshot exists in IndexedDB.');
            if (saved.schema !== FULL_CASE_RECOVERY_SCHEMA || saved.id !== FULL_CASE_RECOVERY_ID) throw new Error('Saved full-case snapshot has an unsupported schema or ID.');
            if (restoreOptions.expectedGeneration != null && saved.generation !== restoreOptions.expectedGeneration) throw new Error('The recovery snapshot generation changed during startup validation. No data was installed; the saved snapshot was preserved.');
            if (restoreOptions.expectedSavedAt != null && saved.savedAt !== restoreOptions.expectedSavedAt) throw new Error('The recovery snapshot timestamp changed during startup validation. No data was installed; the saved snapshot was preserved.');
            const sha = window.CaseFileService?.archive?.sha256Hex;
            const buildLiveRecord = window.CaseFileService?.archive?.buildLiveRecord;
            if (typeof sha !== 'function' || typeof buildLiveRecord !== 'function') throw new Error('CaseFileService SHA-256 or buildLiveRecord API is unavailable.');
            const caseData = JSON.parse(JSON.stringify(saved.caseData));
            const required = ['metadata','patient','deformity','frame','mounting','parameters','treatment'];
            const missing = required.filter(key => !caseData?.[key] || typeof caseData[key] !== 'object' || Array.isArray(caseData[key]));
            if (missing.length) throw new Error('Saved CASE is missing required groups: ' + missing.join(', '));
            const label = r1079CaseLabel(caseData);

            // R1113 — all four AP/LAT combinations (IMAGE/EMPTY) use the same
            // transactional installer. EMPTY records clear only their target
            // panel; loaded records retain their verified original bytes.
            const files = new Map();
            const observations = {};
            const images = [];
            const observationsMeta = [];
            for (const view of ['AP','LAT']) {
                const record = saved.xray?.[view];
                const checked = validateCapturedXrayRecord(view, record, sha);
                const observation = JSON.parse(JSON.stringify(checked.observation));
                observations[view] = observation;
                const observationPath = `observations/${view}-xray-observation-v2.json`;
                if (checked.empty) {
                    if (saved.integrity?.[view]?.annotationCount != null && saved.integrity[view].annotationCount !== 0) throw new Error(view + ': empty-state annotation count does not match integrity metadata.');
                    images.push({ view, state:'EMPTY', imageId:checked.imageId, source:'EMPTY', fileName:null, mediaType:null, path:null, byteLength:0, checksumAlgorithm:null, sha256:null, identityStatus:'EMPTY', observationPath, annotationCount:0, pixelSpacing:null, dimensions:{ width:observation.images[0].width || null, height:observation.images[0].height || null } });
                } else {
                    const actualHash = String(await sha(checked.bytes)).toLowerCase();
                    const expectedHash = String(saved.integrity?.[view]?.sha256 || record.imageChecksum || '').toLowerCase();
                    if (!expectedHash || actualHash !== expectedHash || actualHash !== String(record.imageChecksum).toLowerCase()) throw new Error(view + ': saved original image SHA-256 validation failed.');
                    if (saved.integrity?.[view]?.byteLength != null && saved.integrity[view].byteLength !== checked.bytes.length) throw new Error(view + ': saved image byte length does not match integrity metadata.');
                    if (saved.integrity?.[view]?.imageId && saved.integrity[view].imageId !== checked.imageId) throw new Error(view + ': saved image ID does not match integrity metadata.');
                    if (saved.integrity?.[view]?.annotationCount != null && saved.integrity[view].annotationCount !== checked.observation.annotations.length) throw new Error(view + ': saved image annotation count does not match integrity metadata.');
                    const fileName = String(record.imageFileName || `original-${view.toLowerCase()}.dcm`);
                    const ext = (fileName.split('.').pop() || 'dcm').toLowerCase().replace(/[^a-z0-9]/g,'') || 'dcm';
                    const path = `images/${view}/original.${ext}`;
                    files.set(path, new Uint8Array(checked.bytes));
                    images.push({ view, state:'IMAGE', imageId:checked.imageId, source:record.imageSource || 'DICOM', fileName, mediaType:record.imageFileType || 'application/dicom', path, byteLength:checked.bytes.length, checksumAlgorithm:'SHA-256', sha256:actualHash, identityStatus:'VERIFIED', observationPath, annotationCount:observation.annotations.length, pixelSpacing:observation.images[0].pixelSpacing || null, dimensions:{ width:observation.images[0].width || null, height:observation.images[0].height || null } });
                }
                observationsMeta.push({ view, path:observationPath, schemaVersion:observation.version, annotationCount:observation.annotations.length });
            }
            const validated = {
                caseData, files, observations,
                manifest: { caseName: caseData.metadata?.case_name || '', exporterBuild: saved.appVersion || 'R1078', exportedAt: saved.savedAt || null, images, observations: observationsMeta }
            };
            // Ensure the live installer can construct the exact panel-native records.
            for (const view of ['AP','LAT']) buildLiveRecord(view, validated);
            const preview = [
                'R1126 — AUTOMATIC FULL-CASE RESTORE',
                `Patient: ${label.patient}`,
                `Patient ID: ${label.patientId}`,
                `Case: ${label.name}`,
                `Snapshot saved: ${saved.savedAt || 'unknown'}`,
                `Generation: ${saved.generation ?? 'unknown'}`,
                `CASE JSON: ${JSON.stringify(caseData).length.toLocaleString()} characters`,
                `AP: ${images[0].state === 'EMPTY' ? 'intentionally empty · 0 annotations' : images[0].byteLength.toLocaleString() + ' bytes · ' + observations.AP.annotations.length + ' annotations · SHA-256 verified'}`,
                `LAT: ${images[1].state === 'EMPTY' ? 'intentionally empty · 0 annotations' : images[1].byteLength.toLocaleString() + ' bytes · ' + observations.LAT.annotations.length + ' annotations · SHA-256 verified'}`,
                '',
                'The saved CASE and both X-ray workspaces will be restored automatically.',
                'The existing installer creates rollback checkpoints before changing anything.',
                'This is local recovery only: syncCurrentCase() and Supabase will NOT be called.'
            ].join('\n');
            // R1126 startup recovery is automatic after the saved snapshot passes validation.
            showRecoveryVerification(preview + "\n\nRESTORE STARTED — validating and installing locally…", false);
            // R1125B1 — startup recovery runs after Patient initialization, but
            // the AP/LAT VTK iframes live inside the separately cached X-ray
            // workspace. Prepare that workspace without navigating away from
            // Patient so the transactional installer can capture checkpoints
            // and install both live panels. WorkspaceManager.ensureInitialized()
            // loads its hidden DOM and runs initialize(), but deliberately does
            // not call enter() or change the visible workspace.
            const workspaceManager = window.WorkspaceManager;
            if (!workspaceManager || typeof workspaceManager.ensureInitialized !== 'function') {
                throw new Error('WorkspaceManager.ensureInitialized() is unavailable; cannot prepare the hidden X-ray workspace for local recovery.');
            }
            await workspaceManager.ensureInitialized('xray');
            for (const view of ['AP', 'LAT']) {
                const frameId = view === 'AP' ? 'xrayAPVtkFrame' : 'xrayLATVtkFrame';
                const frame = document.getElementById(frameId);
                if (!frame || !frame.contentWindow) {
                    throw new Error(`${view} VTK iframe is still unavailable after initializing the hidden X-ray workspace (#${frameId}).`);
                }
            }

            const installer = window.r869InstallValidatedBundle;
            if (typeof installer !== 'function') throw new Error('Existing R869 transactional installer is unavailable.');
            const installed = await installer(validated, { localRecovery: true });
            if (installed !== true) throw new Error('R869 installer did not confirm a complete local restore. Review its rollback report.');
            const activeText = JSON.stringify(window.currentCase);
            if (r1078CanonicalJson(window.currentCase) !== r1078CanonicalJson(caseData)) throw new Error('Post-install CASE read-back differs from the saved snapshot.');
            // R1144.6.2 — the installer replaces currentCase, but cached workspace
            // controls do not automatically repopulate. Refresh the active workspace
            // using its data-population functions, not its full initializer (which
            // would rebind handlers and may perform unrelated setup).
            const activeWorkspace = String(window.WorkspaceManager?.currentWorkspace || '').toLowerCase();
            const activeWorkspaceRefreshers = {
                patient: typeof populatePatient === 'function' ? populatePatient : null,
                deformity: typeof populateDeformity === 'function' ? populateDeformity : null,
                frame: typeof populateFrame === 'function' ? populateFrame : null,
                mounting: typeof populateMounting === 'function' ? populateMounting : null,
                phases: typeof populatePhases === 'function' ? populatePhases : null,
                treatment: (typeof populateTreatment === 'function' && typeof window.currentCase === 'object')
                    ? async function() {
                        await populateTreatment();
                        // Treatment workspace entry also synchronizes this radio group.
                        // Do the same after restore so the visible mode matches restored CASE metadata.
                        const plannerMode = window.currentCase?.metadata?.planner || 'normal';
                        const plannerRadio = document.querySelector(
                            `input[name="planner_mode"][value="${plannerMode}"]`
                        );
                        if (plannerRadio) plannerRadio.checked = true;
                    }
                    : null
            };
            const refreshActiveWorkspace = activeWorkspaceRefreshers[activeWorkspace];
            if (refreshActiveWorkspace) {
                try {
                    await refreshActiveWorkspace();
                    record('full-case-restore-active-workspace-refreshed', 'local full-case restore',
                        'workspace=' + activeWorkspace + '; visible controls repopulated from restored window.currentCase.');
                } catch (error) {
                    // The CASE and X-ray installer has already passed its read-back.
                    // Surface a refresh warning without misreporting the data restore.
                    record('full-case-restore-active-workspace-refresh-warning', 'local full-case restore',
                        'workspace=' + activeWorkspace + '; ' + (error?.message || String(error)));
                }
            } else if (typeof populatePatient === 'function' && activeWorkspace === '') {
                // Legacy non-SPA fallback: retain the former Patient refresh behavior.
                try { await populatePatient(); } catch (error) {
                    record('full-case-restore-patient-refresh-warning', 'local full-case restore', error?.message || String(error));
                }
            }
            state.generation = Number(saved.generation) || state.generation;
            state.caseReady = true;
            state.baselineEstablished = true;
            state.lastSnapshot = activeText;
            state.committedSnapshot = activeText;
            state.dirty = false;
            state.dirtySince = 0;
            state.dirtyObservedCaseMutation = false;
            state.xrayDirty = false;
            state.lastReason = 'full-case local recovery';
            state.lastMutationAt = Date.now();
            recoveryState.fullCaseStatus = 'restored · CASE + AP/LAT verified';
            recoveryState.caseComponentStatus = 'restored · exact CASE match';
            recoveryState.xrayComponentStatus.AP = images[0].state === 'EMPTY' ? 'restored · intentionally empty · 0 annotations' : 'restored · SHA-256 + observations verified';
            recoveryState.xrayComponentStatus.LAT = images[1].state === 'EMPTY' ? 'restored · intentionally empty · 0 annotations' : 'restored · SHA-256 + observations verified';
            const lines = [
                'RESULT: PASS — FULL CASE RESTORED',
                `Snapshot saved at: ${saved.savedAt || 'unknown'}`,
                `Generation: ${saved.generation ?? 'unknown'}`,
                `Case: ${label.name} · ${label.patient}`,
                'CASE: exact saved JSON match',
                `AP: ${images[0].state === 'EMPTY' ? 'intentionally empty · 0 annotations' : observations.AP.annotations.length + ' annotations · original image SHA-256 verified'}`,
                `LAT: ${images[1].state === 'EMPTY' ? 'intentionally empty · 0 annotations' : observations.LAT.annotations.length + ' annotations · original image SHA-256 verified'}`,
                'Installer: existing R869 transactional pathway',
                'Rollback checkpoints: captured before installation',
                'Supabase: NOT WRITTEN',
                'syncCurrentCase(): NOT CALLED',
                'Automatic startup restore: ENABLED · confirmation prompt: DISABLED'
            ];
            showRecoveryVerification(lines.join('\n'), true);
            record('full-case-restore-pass','local full-case restore',`generation=${saved.generation}; AP=${observations.AP.annotations.length}; LAT=${observations.LAT.annotations.length}; remoteSync=not-called`);
            render();
            return { ok: true, savedAt: saved.savedAt, generation: saved.generation, caseName: label.name };
        } catch (error) {
            const message = error?.message || String(error);
            recoveryState.fullCaseStatus = 'restore failed · inspect installer rollback report';
            recoveryState.fullCaseLastError = message;
            showRecoveryVerification('RESULT: FULL-CASE RESTORE FAILED\n' + message + '\n\nIf installation had begun, the existing R869 installer attempted to restore the previous CASE + AP + LAT checkpoints. Review the installer rollback report before proceeding.\nSupabase: NOT WRITTEN by the local recovery path.', false);
            record('full-case-restore-failed','local full-case restore',message);
            render();
            return { ok: false, reason: message };
        } finally {
            state.fullCaseRestoreInProgress = false;
            if (button) button.disabled = false;
        }
    }

    async function verifyLatestFullCaseRecoverySnapshot() {
        try {
            const saved = await readLatestFullCaseRecoverySnapshot();
            if (!saved) {
                showRecoveryVerification("RESULT: NO FULL-CASE SNAPSHOT FOUND\nDatabase: " + RECOVERY_DB_NAME + "\nStore: " + RECOVERY_STORE, false);
                record("full-case-snapshot-read-empty", "manual verification", "No latest-stable-full-case record found");
                return { ok: false, reason: "empty" };
            }
            const validView = view => {
                const r = saved.xray?.[view];
                return !!(r?.observation && r.imageView === view &&
                    (r.imageSource === "EMPTY" ? Number(r.imageByteLength || 0) === 0 && (r.observation.annotations || []).length === 0 : !!r.imageFileBytes));
            };
            const valid = saved.schema === FULL_CASE_RECOVERY_SCHEMA &&
                saved.caseData && typeof saved.caseData === "object" && !Array.isArray(saved.caseData) &&
                validView("AP") && validView("LAT");
            if (!valid) throw new Error("Full-case snapshot schema or required CASE/AP/LAT payload is incomplete.");
            const sha = window.CaseFileService?.archive?.sha256Hex;
            if (typeof sha !== "function") throw new Error("CaseFileService SHA-256 helper is unavailable.");
            const lines = [
                "RESULT: FULL-CASE SNAPSHOT READ",
                "Saved at: " + (saved.savedAt || "unknown"),
                "Generation: " + (saved.generation ?? "unknown"),
                "Schema: " + saved.schema,
                "CASE JSON characters: " + JSON.stringify(saved.caseData).length
            ];
            for (const view of ["AP", "LAT"]) {
                const checked = validateCapturedXrayRecord(view, saved.xray[view], sha);
                if (checked.empty) {
                    if (saved.integrity?.[view]?.imageSource !== "EMPTY" || Number(saved.integrity?.[view]?.byteLength || 0) !== 0) throw new Error(view + " empty-state integrity metadata is inconsistent.");
                    lines.push("PASS · " + view + " intentionally empty · no image bytes · 0 annotations");
                } else {
                    const actualHash = await sha(checked.bytes);
                    const expectedHash = String(saved.integrity?.[view]?.sha256 || saved.xray[view].imageChecksum || "").toLowerCase();
                    if (actualHash.toLowerCase() !== expectedHash) throw new Error(view + " image SHA-256 does not match the saved integrity record.");
                    if (saved.integrity?.[view]?.byteLength !== checked.bytes.length) throw new Error(view + " image byte length does not match the saved integrity record.");
                    lines.push("PASS · " + view + " image bytes " + checked.bytes.length + " · SHA-256 verified");
                }
                lines.push("PASS · " + view + " observations " + checked.observation.annotations.length + (checked.empty ? " · empty panel verified" : " · image binding verified"));
            }
            const current = safeSnapshot();
            const sameAsCurrent = !!(!current.error && current.available && current.text === JSON.stringify(saved.caseData));
            lines.push("Matches current CASE exactly: " + (sameAsCurrent ? "YES" : "NO"));
            lines.push("X-ray assets included: YES · AP + LAT");
            lines.push("\nRESULT: PASS — COMPLETE LOCAL FULL-CASE SNAPSHOT VERIFIED");
            lines.push("This verifies the stored recovery record only; it does not install or restore it.");
            showRecoveryVerification(lines.join("\n"), true);
            record("full-case-snapshot-read-verified", "manual verification", "generation=" + saved.generation + "; matchesCurrent=" + sameAsCurrent);
            return { ok: true, savedAt: saved.savedAt, generation: saved.generation, sameAsCurrent, integrity: saved.integrity };
        } catch (error) {
            const message = error?.message || String(error);
            showRecoveryVerification("RESULT: FULL-CASE SNAPSHOT VERIFICATION FAILED\n" + message, false);
            record("full-case-snapshot-read-failed", "manual verification", message);
            return { ok: false, reason: message };
        }
    }

    async function refreshExistingFullCaseStatus() {
        try {
            const saved = await readLatestFullCaseRecoverySnapshot();
            if (!saved || saved.schema !== FULL_CASE_RECOVERY_SCHEMA || !saved.xray || !saved.caseData) return;
            state.generation = Math.max(state.generation, Number(saved.generation) || 0);
            recoveryState.fullCaseStatus = "saved snapshot found · integrity not rechecked this session";
            recoveryState.fullCaseSavedAt = saved.savedAt || null;
            recoveryState.fullCaseSavedGeneration = saved.generation ?? null;
            recoveryState.lastSuccessfulCaseIdentity = saved.caseIdentity || recoveryCaseIdentity(saved.caseData);
            recoveryState.fullCaseImageIds = {
                AP: saved.integrity?.AP?.imageId || null,
                LAT: saved.integrity?.LAT?.imageId || null
            };
            recoveryState.caseComponentStatus = "present in saved snapshot · not rechecked";
            for (const view of ["AP", "LAT"]) {
                const item = saved.integrity?.[view];
                recoveryState.xrayComponentStatus[view] = item
                    ? "present in saved snapshot · " + item.annotationCount + " annotations · not rechecked"
                    : "saved snapshot record incomplete";
            }
            render();
            record("existing-full-case-snapshot-found", "startup diagnostic read",
                "A stored full-case record exists. Integrity remains unverified until VERIFY SNAPSHOT is run.");
        } catch (error) {
            recoveryState.fullCaseStatus = "could not read existing full-case snapshot";
            recoveryState.fullCaseLastError = error?.message || String(error);
            render();
        }
    }

    // R1128 — automatic local recovery after the initial Patient workspace load.
    // The existing app.js startup hook still calls offerStartupRecovery() for
    // compatibility, but this function no longer asks for consent. It verifies
    // the latest complete snapshot and sends it through the existing transactional
    // R869 local-only installer. No Flask synchronization or Supabase write occurs.
    let startupRecoveryPromise = null;
    async function offerStartupRecovery() {
        if (!isStandaloneMode() || !standaloneRecoveryActive) {
            return { ok:false, reason:"standalone-mode-not-active", localRecoveryStarted:false };
        }
        // Share only an in-flight recovery attempt. A completed Promise must not
        // be cached across operating-mode transitions: every new explicit entry
        // into Standalone must re-read IndexedDB and restore its latest snapshot.
        if (startupRecoveryPromise) return startupRecoveryPromise;
        const recoveryRun = (async () => {
            if (!isPlausibleLoadedCase()) {
                const message = 'The active CASE is not ready for startup recovery.';
                record('startup-recovery-not-run', 'application startup', message);
                return { ok:false, reason:'active-case-not-ready' };
            }
            if (state.transitionStack.length || state.fullCaseCaptureInProgress) {
                const message = 'A CASE transition or snapshot capture is already in progress.';
                record('startup-recovery-not-run', 'application startup', message);
                return { ok:false, reason:'recovery-busy' };
            }

            let saved;
            try {
                saved = await readLatestFullCaseRecoverySnapshot();
            } catch (error) {
                const message = error?.message || String(error);
                recoveryState.fullCaseStatus = 'startup recovery check failed';
                recoveryState.fullCaseLastError = message;
                showRecoveryVerification('AUTOMATIC STARTUP RECOVERY CHECK FAILED\n' + message + '\nThe active CASE was left unchanged. The saved snapshot has not been deleted.', false);
                record('startup-recovery-check-failed', 'application startup', message);
                render();
                return { ok:false, reason:message };
            }
            if (!saved) {
                recoveryState.fullCaseStatus = 'no recovery snapshot · normal startup';
                record('startup-recovery-not-needed', 'application startup', 'No full-case recovery snapshot exists; normal startup continues.');
                render();
                return { ok:true, available:false };
            }
            if (saved.schema !== FULL_CASE_RECOVERY_SCHEMA || saved.id !== FULL_CASE_RECOVERY_ID) {
                const message = 'The stored recovery record has an unsupported schema or identity.';
                recoveryState.fullCaseStatus = 'startup recovery rejected · unsupported snapshot';
                recoveryState.fullCaseLastError = message;
                showRecoveryVerification('AUTOMATIC STARTUP RECOVERY STOPPED\n' + message + '\nThe active CASE was left unchanged. The saved record was preserved.', false);
                record('startup-recovery-invalid-candidate', 'application startup', message);
                render();
                return { ok:false, reason:message };
            }

            // Verify the complete CASE/AP/LAT snapshot before installation.
            const verification = await verifyLatestFullCaseRecoverySnapshot();
            if (!verification?.ok) {
                const message = verification?.reason || 'snapshot integrity verification failed';
                recoveryState.fullCaseStatus = 'startup recovery rejected · integrity check failed';
                recoveryState.fullCaseLastError = message;
                showRecoveryVerification('AUTOMATIC STARTUP RECOVERY STOPPED\n' + message + '\nThe active CASE was left unchanged. The saved snapshot was preserved.', false);
                record('startup-recovery-candidate-rejected', 'application startup', message);
                render();
                return { ok:false, reason:message };
            }

            const required = ['metadata','patient','deformity','frame','mounting','parameters','treatment'];
            const missing = required.filter(key => !saved.caseData?.[key] || typeof saved.caseData[key] !== 'object' || Array.isArray(saved.caseData[key]));
            if (missing.length) {
                const message = 'Saved CASE is missing required groups: ' + missing.join(', ');
                recoveryState.fullCaseStatus = 'startup recovery rejected · incomplete CASE';
                recoveryState.fullCaseLastError = message;
                showRecoveryVerification('AUTOMATIC STARTUP RECOVERY STOPPED\n' + message + '\nThe active CASE was left unchanged. The saved snapshot was preserved.', false);
                record('startup-recovery-candidate-rejected', 'application startup', message);
                render();
                return { ok:false, reason:message };
            }

            // The user may have switched modes while snapshot validation was in
            // progress. Never install a local snapshot after Standalone has ended.
            if (!isStandaloneMode() || !standaloneRecoveryActive) {
                record('startup-recovery-cancelled', 'operating-mode transition',
                    'Standalone ended before local snapshot installation; saved data was left untouched.');
                return { ok:false, reason:'standalone-mode-ended-before-install' };
            }

            record('startup-recovery-started', 'application startup',
                'generation=' + String(saved.generation) + '; savedAt=' + String(saved.savedAt));
            showRecoveryVerification(
                'AUTOMATIC STARTUP RECOVERY\n' +
                'A valid full-case snapshot was found and verified.\n' +
                'Restoring CASE + AP + LAT using the existing R869 transactional installer…\n' +
                'Local-only operation · Flask sync NOT called · Supabase NOT written.',
                false
            );

            const result = await restoreLatestFullCaseRecoverySnapshot({
                expectedGeneration: saved.generation,
                expectedSavedAt: saved.savedAt
            });
            if (result?.ok) {
                record('startup-recovery-completed', 'automatic local startup restore',
                    'generation=' + String(saved.generation));
            } else {
                record('startup-recovery-failed', 'automatic local startup restore',
                    result?.reason || 'restore did not confirm success');
            }
            return result;
        })();
        startupRecoveryPromise = recoveryRun;
        try {
            return await recoveryRun;
        } finally {
            // Keep concurrent callers joined to this attempt, but allow a later
            // Standalone re-entry to run a fresh read/verify/install cycle.
            if (startupRecoveryPromise === recoveryRun) startupRecoveryPromise = null;
        }
    }

    function getRecoveryStorageStatus() {
        return {
            ...recoveryState,
            database: RECOVERY_DB_NAME,
            store: RECOVERY_STORE,
            includesXrayAssets: recoveryState.fullCaseStatus.startsWith("saved"),
            fullCaseSchema: FULL_CASE_RECOVERY_SCHEMA,
            automaticRestoreEnabled: standaloneRecoveryActive,
            eventDrivenAutosaveEnabled: standaloneRecoveryActive,
            legacyObserverActive: timer !== null,
            standaloneRecoveryActive,
            startupRecoveryPromptEnabled: false
        };
    }

    // R1123C7 — PASSIVE-ONLY iframe diagnostics.
    // R1123C8 — per-view pending status is updated before shared dirty-event coalescing.
    // Automatic startup recovery uses the explicit restore path; the passive monitor runs while the X-ray workspace may be hidden. It must
    // never call waitForXrayLiveApi(), because that helper bootstraps the lazy
    // VTK controller and can allocate WebGL/rendering resources in hidden panels.
    // Explicit workspace entry and user-requested capture/restore operations
    // remain responsible for initializing the controller.
    function refreshActiveWorkspaceDiagnostics(force = false) {
        if (state.activeWorkspaceProbeInProgress) return;
        const now = Date.now();
        if (!force && now - state.activeWorkspaceProbeAt < 2500) return;
        state.activeWorkspaceProbeAt = now;
        state.activeWorkspaceProbeInProgress = true;
        try {
            state.activeCaseIdentity = recoveryCaseIdentity(window.currentCase || {});
            for (const view of ["AP", "LAT"]) {
                const frameId = view === "LAT" ? "xrayLATVtkFrame" : "xrayAPVtkFrame";
                const frame = document.getElementById(frameId);
                try {
                    if (!frame?.contentWindow) {
                        throw new Error(`R1123C7 — ${view} iframe is unavailable.`);
                    }
                    const child = frame.contentWindow;
                    const readyState = frame.contentDocument?.readyState || "unknown";
                    const diagnostic = child.getXrayLiveObservationDiagnostics;
                    if (typeof diagnostic !== "function") {
                        const build = child.__XRAY_VTK_ENGINE_BUILD__ || "not initialized";
                        state.activeXrayImageIds[view] = null;
                        state.activeXrayAnnotationCounts[view] = null;
                        state.activeXrayDiagnostics[view] = {
                            diagnosticError: `R1123C7 — ${view} controller not initialized (readyState=${readyState}, build=${build}); passive monitor did not initialize it.`
                        };
                        continue;
                    }
                    const live = diagnostic.call(child);
                    const observation = live?.observation;
                    const image = Array.isArray(observation?.images) ? observation.images[0] : null;
                    state.activeXrayImageIds[view] = image?.id == null ? null : String(image.id);
                    state.activeXrayAnnotationCounts[view] = Array.isArray(observation?.annotations)
                        ? observation.annotations.length : null;
                    state.activeXrayDiagnostics[view] = live || null;
                } catch (error) {
                    state.activeXrayImageIds[view] = null;
                    state.activeXrayAnnotationCounts[view] = null;
                    state.activeXrayDiagnostics[view] = { diagnosticError: error?.message || String(error) };
                }
            }
        } finally {
            state.activeWorkspaceProbeInProgress = false;
            render();
        }
    }

    // R1144.6 — the central CASE coordinator is now the mutation trigger.
    // Snapshot content checks, AP/LAT fingerprints, staged IndexedDB writes,
    // and post-write verification remain in the existing full-case pipeline.
    function bindCaseChangeEvents() {
        if (caseChangeEventsBound) return;
        caseChangeEventsBound = true;
        window.addEventListener("case-data-changed", event => {
            if (!isStandaloneMode() || !standaloneRecoveryActive) return;
            const detail = event?.detail;
            if (!detail || detail.version !== 1 || !["case", "xray"].includes(detail.domain)) return;
            if (state.fullCaseRestoreInProgress || state.transitionStack.length) {
                record("case-change-event-suppressed", "restore or CASE transition active",
                    "domain=" + detail.domain + "; source=" + (detail.source || "unknown"));
                return;
            }
            const activeIdentity = recoveryCaseIdentity(window.currentCase || {});
            if (detail.caseId != null && activeIdentity.id != null && String(detail.caseId) !== activeIdentity.id) {
                record("case-change-event-rejected", "event case identity does not match active CASE",
                    "event=" + detail.caseId + "; active=" + activeIdentity.id);
                return;
            }
            if (detail.domain === "xray") {
                const view = detail.view === "LAT" ? "LAT" : detail.view === "AP" ? "AP" : null;
                if (!view) return;
                state.xrayMutationCounters[view] += 1;
                if (state.xrayDirty) state.xrayNotificationsCoalesced[view] += 1;
                state.xrayDirty = true;
                recoveryState.xrayComponentStatus[view] = "change pending · waiting for stable capture";
            }
            const reason = [detail.domain, detail.source, detail.operation, detail.reason]
                .filter(Boolean).join(" · ");
            markDirty(reason || "CASE data changed", "coordinator-event-" + detail.domain);
        });
    }

    function scheduleEventDrivenCapture(delay = STABLE_MS) {
        if (!isStandaloneMode() || !standaloneRecoveryActive || state.autosavePaused) return;
        if (state.transitionStack.length || state.fullCaseRestoreInProgress) return;
        if (eventCaptureTimer !== null) window.clearTimeout(eventCaptureTimer);
        const retryDelay = Math.max(0, Number(delay) || 0);
        eventCaptureTimer = window.setTimeout(() => {
            eventCaptureTimer = null;
            void runEventDrivenCapture();
        }, retryDelay);
    }

    async function runEventDrivenCapture() {
        if (!isStandaloneMode() || !standaloneRecoveryActive || state.autosavePaused) return;
        if (!state.dirty) return;
        if (state.transitionStack.length || state.fullCaseRestoreInProgress || state.fullCaseCaptureInProgress) {
            scheduleEventDrivenCapture(STABLE_MS);
            return;
        }
        const snapshot = safeSnapshot();
        if (!snapshot.available || snapshot.error || !isPlausibleLoadedCase()) {
            recoveryState.caseComponentStatus = "waiting · active CASE is not ready for full-case capture";
            recoveryState.fullCaseLastError = snapshot.error || "Active CASE is not structurally ready.";
            render();
            scheduleEventDrivenCapture(1500);
            return;
        }
        state.caseReady = true;
        state.baselineEstablished = true;
        state.activeCaseIdentity = recoveryCaseIdentity(window.currentCase || {});
        const caseChanged = snapshot.text !== state.committedSnapshot;
        const xrayChanged = state.xrayDirty;
        if (!caseChanged && !xrayChanged) {
            state.dirty = false;
            state.dirtySince = 0;
            state.dirtyObservedCaseMutation = false;
            state.lastSnapshot = snapshot.text;
            record("case-change-event-no-content-change", state.lastReason,
                "No CASE JSON or AP/LAT content change was found; no snapshot generation created.");
            render();
            return;
        }
        const stableAge = Date.now() - state.lastMutationAt;
        if (stableAge < STABLE_MS) {
            scheduleEventDrivenCapture(STABLE_MS - stableAge);
            return;
        }
        if (Date.now() < state.nextFullCaseRetryAt) {
            scheduleEventDrivenCapture(state.nextFullCaseRetryAt - Date.now());
            return;
        }
        await captureAndCommitStableFullCase(snapshot.text, state.lastReason);
        if (state.dirty && !state.autosavePaused) {
            const wait = Math.max(STABLE_MS, (state.nextFullCaseRetryAt || 0) - Date.now());
            scheduleEventDrivenCapture(wait);
        }
    }

    function bindXrayRecoverySignals() {
        if (window.__R1078_XRAY_RECOVERY_SIGNALS_BOUND) return;
        window.__R1078_XRAY_RECOVERY_SIGNALS_BOUND = true;
        window.addEventListener("message", event => {
            if (event.origin !== window.location.origin) return;
            const data = event.data;
            if (!data || typeof data !== "object" || (data.view !== "AP" && data.view !== "LAT")) return;
            const frameId = data.view === "LAT" ? "xrayLATVtkFrame" : "xrayAPVtkFrame";
            const frame = document.getElementById(frameId);
            if (!frame || event.source !== frame.contentWindow) return;
            const isObservationChange = data.type === "xray-observation-updated";
            // Only semantic live observation changes are mutation signals.
            if (!isObservationChange) return;
            if (isObservationChange) {
                state.xrayMutationCounters[data.view] += 1;
            }

            // During capture, event notifications are not authoritative evidence of
            // a user edit. The read-only before/after content fingerprints decide.
            if (state.fullCaseCaptureInProgress) {
                recoveryState.xrayComponentStatus[data.view] =
                    "observation event during capture · checking actual content";
                return;
            }

            // Coalesce repeated notifications while an X-ray change is already pending.
            // VTK/workspace installation can emit several identical observation events
            // for one logical update. Re-marking dirty on every message continually
            // resets lastMutationAt and can prevent the stable capture from ever starting.
            // Counters still advance for diagnostics and capture-race analysis; actual
            // exported AP/LAT content fingerprints remain the authority on content.
            const alreadyPending = state.xrayDirty;
            state.xrayDirty = true;
            // Update the notifying view before global coalescing. AP and LAT share
            // one full-case dirty interval, but each view needs its own visible
            // pending status even when the other view has already marked it dirty.
            recoveryState.xrayComponentStatus[data.view] = "change pending · waiting for stable capture";
            if (alreadyPending) {
                state.xrayNotificationsCoalesced[data.view] += 1;
                // Repeated notifications keep the same per-view pending label;
                // they do not reset lastMutationAt or create another dirty interval.
                render();
                return;
            }

            markDirty("X-ray " + data.view + " observation changed", "xray-workspace-" + data.view);
        });
    }

    function poll() {
        if (!isStandaloneMode() || !standaloneRecoveryActive) return;
        state.pollCount += 1;
        state.activeCaseIdentity = recoveryCaseIdentity(window.currentCase || {});
        void refreshActiveWorkspaceDiagnostics();
        const snapshot = safeSnapshot();
        if (snapshot.error) {
            if (state.lastSnapshotError !== snapshot.error) {
                state.lastSnapshotError = snapshot.error;
                record("observer-snapshot-error", "currentCase-not-serializable", snapshot.error);
            }
            render();
            return;
        }
        state.lastSnapshotError = null;

        if (!state.caseReady) {
            if (!isPlausibleLoadedCase()) {
                state.readinessReason = "currentCase missing or structurally incomplete";
                render();
                return;
            }
            state.caseReady = true;
            recoveryState.caseComponentStatus = "CASE loaded";
            state.readinessReason = "currentCase has metadata and a CASE data section";
            record("case-ready-detected", "application CASE readiness", state.readinessReason);
        }

        if (!state.baselineEstablished) {
            state.lastSnapshot = snapshot.text;
            state.committedSnapshot = snapshot.text;
            state.baselineEstablished = true;
            recoveryState.caseComponentStatus = "baseline established · monitoring changes";
            record("observer-baseline-established", "loaded currentCase baseline", "CASE ready; initial snapshot adopted as baseline; no generation increment");
            return;
        }

        if (snapshot.text !== state.lastSnapshot) {
            state.lastSnapshot = snapshot.text;
            // Only the polling observer can establish that CASE content actually
            // differed during this dirty interval. A commit hook alone is not proof.
            markDirty("currentCase content changed", "central-snapshot-observer");
            if (snapshot.text !== state.committedSnapshot) {
                state.dirtyObservedCaseMutation = true;
            }
        }

        if (!state.autosavePaused && state.dirty && state.transitionStack.length === 0 && !state.fullCaseCaptureInProgress &&
            Date.now() - state.lastMutationAt >= STABLE_MS && Date.now() >= state.nextFullCaseRetryAt) {
            const stable = safeSnapshot();
            const caseChanged = !stable.error && stable.text !== state.committedSnapshot;
            const xrayChanged = state.xrayDirty;
            if (!stable.error && (caseChanged || xrayChanged)) {
                void captureAndCommitStableFullCase(stable.text, state.lastReason);
            } else if (!stable.error) {
                const reason = state.lastReason;
                const observedMutation = state.dirtyObservedCaseMutation;
                state.dirty = false;
                state.dirtySince = 0;
                state.dirtyObservedCaseMutation = false;
                state.lastSnapshot = stable.text;
                if (observedMutation) {
                    record("case-change-reverted-no-commit", reason,
                        "observer saw CASE differ from committed snapshot, then return to it; generation unchanged");
                } else {
                    record("commit-notification-no-case-change", reason,
                        "no differing CASE snapshot or X-ray mutation observed during this dirty interval; generation unchanged");
                }
            }
        }
        render();
    }

    function getDiagnostics() {
        return {
            generation: state.generation,
            autosavePaused: state.autosavePaused,
            transitionDepth: state.transitionStack.length,
            activeTransitions: state.transitionStack.map(t => ({ id: t.id, reason: t.reason })),
            dirty: state.dirty,
            dirtyObservedCaseMutation: state.dirtyObservedCaseMutation,
            baselineEstablished: state.baselineEstablished,
            caseReady: state.caseReady,
            readinessReason: state.readinessReason,
            lastEvent: state.lastEvent,
            lastReason: state.lastReason,
            pollCount: state.pollCount,
            legacyObserverActive: timer !== null,
            eventDrivenCaptureBound: caseChangeEventsBound,
            eventCapturePending: eventCaptureTimer !== null,
            fullCaseRestoreInProgress: state.fullCaseRestoreInProgress,
            mutationSerial: state.mutationSerial,
            xrayMutationCounters: { ...state.xrayMutationCounters },
            xrayNotificationsCoalesced: { ...state.xrayNotificationsCoalesced },
            fullCaseCaptureAttempts: state.fullCaseCaptureAttempts,
            fullCaseContentChangesDetected: state.fullCaseContentChangesDetected,
            fullCaseDuplicateCapturesDiscarded: state.fullCaseDuplicateCapturesDiscarded,
            fullCaseSuccessfulCommits: state.fullCaseSuccessfulCommits,
            fullCaseRetryAttempts: state.fullCaseRetryAttempts,
            nextFullCaseRetryAt: state.nextFullCaseRetryAt || null,
            lastSuccessfulCaseIdentity: state.lastSuccessfulCaseIdentity,
            activeCaseIdentity: state.activeCaseIdentity,
            activeXrayImageIds: { ...state.activeXrayImageIds },
            activeXrayAnnotationCounts: { ...state.activeXrayAnnotationCounts },
            events: state.events.slice()
        };
    }

    async function startStandalone() {
        if (!isStandaloneMode()) {
            throw new Error("Cannot initialize local recovery unless Standalone Mode is active.");
        }
        // R1144.6: local recovery remains available while the legacy 2.5-second
        // observer stays inactive. Event-driven autosave listens to committed
        // coordinator events and reuses the existing full-case capture pipeline.
        standaloneRecoveryActive = true;
        try {
            bindCaseChangeEvents();
            ensureRecoveryVerifyButton();
            await refreshExistingFullCaseStatus();
            const snapshot = safeSnapshot();
            if (snapshot.available && !snapshot.error && isPlausibleLoadedCase()) {
                state.caseReady = true;
                state.baselineEstablished = true;
                state.lastSnapshot = snapshot.text;
                state.committedSnapshot = snapshot.text;
                state.activeCaseIdentity = recoveryCaseIdentity(window.currentCase || {});
                state.dirty = false;
                state.xrayDirty = false;
                state.dirtySince = 0;
                state.dirtyObservedCaseMutation = false;
                state.lastReason = "Standalone baseline established";
                recoveryState.caseComponentStatus = "baseline established · event-driven capture ready";
            }
            record("standalone-recovery-ready-event-driven", "explicit Standalone Mode selection",
                "Coordinator events trigger full-case capture; legacy polling observer remains inactive.");
            return { started:true, alreadyActive:false, observerActive:false, eventDrivenCapture:true };
        } catch (error) {
            standaloneRecoveryActive = false;
            const message = error?.stack || error?.message || String(error);
            const fallback = document.getElementById("caseRecoveryDiagnosticPanel");
            if (fallback) {
                const summary = fallback.querySelector("#caseRecoveryMonitorSummaryR1076");
                if (summary) summary.textContent = "STANDALONE RECOVERY INITIALIZATION FAILED\n" + message;
                else {
                    fallback.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:2147483647;padding:12px;background:#fff1f2;color:#881337;border:2px solid #be123c;border-radius:8px;font:12px/1.45 monospace;white-space:pre-wrap;overflow-wrap:anywhere";
                    fallback.textContent = "R1144.6 STANDALONE RECOVERY INITIALIZATION FAILED\n" + message;
                }
            }
            console.error("[R1144.6 standalone recovery startup]", error);
            throw error;
        }
    }

    // R1144.5: explicit fallback switch for the preserved legacy poller.
    function startObserver() {
        if (!isStandaloneMode()) {
            throw new Error("Cannot start the legacy recovery observer outside Standalone Mode.");
        }
        if (timer !== null) return { started:false, alreadyActive:true, observerActive:true };
        standaloneRecoveryActive = true;
        try {
            // CASE mutations are detected by the central coordinator event.
            // The legacy poller is retained only as an explicit CASE-diff fallback.
            poll();
            timer = window.setInterval(poll, POLL_MS);
            record("standalone-recovery-observer-started", "explicit CaseRecoveryDiagnostics.startObserver() call", "Legacy 2.5-second polling observer explicitly enabled.");
            return { started:true, alreadyActive:false, observerActive:true };
        } catch (error) {
            // A failed optional legacy poller must not disable event-driven recovery.
            throw error;
        }
    }

    function stop() {
        const wasActive = timer !== null || standaloneRecoveryActive || eventCaptureTimer !== null;
        if (timer !== null) window.clearInterval(timer);
        if (eventCaptureTimer !== null) window.clearTimeout(eventCaptureTimer);
        timer = null;
        eventCaptureTimer = null;
        standaloneRecoveryActive = false;
        // A completed startup-recovery result is never a reusable mode-entry result.
        // Clearing the reference also prevents stale lifecycle state after mode exit.
        startupRecoveryPromise = null;
        if (wasActive) record("standalone-recovery-stopped", "operating-mode transition", "Local event-driven capture and any legacy polling stopped; existing IndexedDB snapshot was preserved.");
        return { stopped:wasActive, active:false };
    }

    window.CaseRecoveryDiagnostics = {
        beginCaseTransition,
        endCaseTransition,
        noteCaseCommitted,
        getDiagnostics,
        getTransitionPopupHistory: () => [],
        getRecoveryStorageStatus,
        refreshExistingFullCaseStatus,
        refreshActiveWorkspaceDiagnostics,
        readLatestFullCaseRecoverySnapshot,
        verifyLatestFullCaseRecoverySnapshot,
        restoreLatestFullCaseRecoverySnapshot,
        offerStartupRecovery,
        startStandalone,
        startObserver,
        stop,
        isStandaloneRecoveryActive: () => standaloneRecoveryActive && timer !== null,
        isLegacyObserverActive: () => timer !== null,
        captureFullCaseNow,
        inspectXrayAssetRecords,
        render,
        poll
    };
    window.beginCaseTransition = beginCaseTransition;
    window.endCaseTransition = endCaseTransition;
    window.noteCaseCommitted = noteCaseCommitted;
    window.getCaseRecoveryDiagnostics = getDiagnostics;

    // R1144.6: deliberately do not start on DOMContentLoaded. The application
    // binds event-driven local capture only after explicit Standalone Mode selection.
})();
