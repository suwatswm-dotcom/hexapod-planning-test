
/* R1136 — programmatic validated imports can suppress the inner ZIP confirmation; manual ZIP import remains confirmed.
   R1125A — local-only full-case recovery installer mode; ZIP import behavior preserved.
   R1124C1 — local named-case repository retired; ZIP and live X-ray workflows retained.
   R1123C7 — remove independent per-view persistence and restore.
   Live AP/LAT capture, ZIP installation and transaction rollback remain available.
   Legacy WIP records are preserved but are no longer restored automatically. */
window.XRAY_RECONSTRUCTION_BUILD = 'R1136';
window.R1125A_LOCAL_RECOVERY_INSTALLER = true;
window.__XRAY_RECONSTRUCTION_LOADED = true;

// Read-only runtime diagnostic: values come from the objects actually loaded in this page.
function r905RuntimeDiagnosticLines(){
    const service=window.CaseFileService;
    const archive=service?.archive;
    const api=(name)=>typeof archive?.[name]==='function'?'PRESENT':'MISSING';
    return [
        'RUNTIME IDENTITY (read-only; actual loaded objects)',
        `X-ray controller build: ${window.XRAY_RECONSTRUCTION_BUILD||'MISSING'}`,
        `CaseFileService.VERSION: ${service?.VERSION||'MISSING'}`,
        `archive.buildBundle: ${api('buildBundle')}`,
        `archive.buildLiveRecord: ${api('buildLiveRecord')}`,
        `archive.validateBundleFile: ${api('validateBundleFile')}`
    ];
}
(function(){
    const old = document.getElementById('xrayReconstructionLoadIndicator');
    if(old) old.remove();
})();


"use strict";

/* =========================================================
   X-ray Reconstruction Workspace
   ---------------------------------------------------------
   R368
   Purpose:
     Top-level X-ray workspace boundary and reconstruction/CASE integration.

   Architecture:
     X-ray workspace
          ↓
     xray_reconstruction.js
          ↓
     reconstruction.js

   This file owns:
     - X-ray workspace lifecycle
     - future X-ray annotation workflow
     - future reconstruction workflow
     - CASE integration boundary

   This file does NOT own:
     - reconstruction mathematics
     - mechanical solver mathematics
     - rendering-specific reconstruction logic

   Reconstruction mathematics belongs in:
     reconstruction.js
   ========================================================= */



/* =========================================================
   R628 — PRODUCTION DETERMINE INTEGRATION / DEVELOPER DIAGNOSTIC MODE
   ---------------------------------------------------------
   Production is the default. The application bootstrap may explicitly set
   window.XRAY_DEVELOPER_MODE = true before entering the X-ray workspace.
   This controls visibility only; observation and reconstruction functions
   remain shared. It does not provide an access-control/security boundary.
   ========================================================= */
function applyXrayDeveloperModeVisibility(){
    const developerMode = window.XRAY_DEVELOPER_MODE === true;
    const diagnostics = document.getElementById("xrayDeveloperDiagnostics");
    if(diagnostics){
        diagnostics.hidden = !developerMode;
        diagnostics.setAttribute("aria-hidden", developerMode ? "false" : "true");
    }

    // R627: legacy panels are now grouped inside the developer diagnostics section.
    // Keep individual hidden state explicit as well as the parent wrapper.
    [
        "xrayDeveloperClinicalMetadataPanel",
        "xrayDeveloperViewIdentityPanel",
        "xrayDeveloperObservationsPanel"
    ].forEach(function(id){
        const panel = document.getElementById(id);
        if(panel){
            panel.hidden = !developerMode;
            panel.setAttribute("aria-hidden", developerMode ? "false" : "true");
        }
    });

    const toggle = document.getElementById("xrayDeveloperModeToggle");
    if(toggle) toggle.checked = developerMode;
    const modeStatus = document.getElementById("xrayDeveloperModeStatus");
    if(modeStatus) modeStatus.textContent = developerMode
        ? "Developer mode · diagnostics visible"
        : "Production mode · diagnostics hidden";

    const production = document.getElementById("xrayProductionWorkflow");
    if(production) production.setAttribute("data-xray-mode", developerMode ? "developer" : "production");
}

function bindXrayDeveloperModeToggle(){
    if(window.__xrayDeveloperModeToggleBound) return;
    window.__xrayDeveloperModeToggleBound = true;
    // Delegation is required because the workspace fragment is injected later.
    document.addEventListener("change", function(event){
        const toggle = event.target;
        if(!toggle || toggle.id !== "xrayDeveloperModeToggle") return;
        window.XRAY_DEVELOPER_MODE = toggle.checked === true;
        applyXrayDeveloperModeVisibility();
    });
}

bindXrayDeveloperModeToggle();

/* =========================================================
   Workspace initialization
   ========================================================= */

async function initializeXrayReconstructionWorkspace(){

    console.log(
        "R186 — X-ray Reconstruction Workspace initialized"
    );

    /*
       Ensure the browser has the current CASE.

       Do not create a second CASE representation here.
       The application CASE remains window.currentCase.
    */

    if(
        typeof ensureCurrentCase === "function"
    ){
        await ensureCurrentCase();
    }

    applyXrayDeveloperModeVisibility();
    updateXrayReconstructionStatus();
    initializeXrayImageInputs();

    // R885 — register the import/export bridge during initialization as well as
    // enter(). This lets CaseFileService call it while the workspace stays hidden.
    initializeXrayPortableCaseControls();

    /*
       The workspace HTML is injected before enter() runs.
       Way 2 controls therefore bind from enter(), after their elements exist.
    */
}


/* =========================================================
   Workspace enter
   ========================================================= */

/* =========================================================
   R513 — R257 button capture binding
   ---------------------------------------------------------
   The workspace is injected dynamically and other page controls use
   capture-phase click delegation.  Bind R257 at document capture phase so
   its click cannot be swallowed before the legacy bubbling dispatcher sees it.
   This is UI wiring only; it does not alter reconstruction.js / R507.
   ========================================================= */
function initializeR257ClinicalRoundTripButton(){
    if(window.__r257ClinicalRoundTripCaptureBound) return;
    window.__r257ClinicalRoundTripCaptureBound=true;

    document.addEventListener('click',function(event){
        const target=event.target && typeof event.target.closest==='function'
            ? event.target.closest('[data-reconstruction-synthetic-test="runR257ClinicalRoundTripTest"]')
            : null;
        if(!target) return;

        event.preventDefault();
        event.stopPropagation();

        try{
            openSyntheticReconstructionDialog(target);
        }catch(error){
            const status=document.getElementById('xrayReconstructionApiStatus');
            if(status){
                status.textContent='R257 BUTTON ERROR · '+String(error?.message || error);
            }
            throw error;
        }
    },true);
}

initializeR257ClinicalRoundTripButton();

async function enterXrayReconstructionWorkspace(
    firstVisit,
    savedState
){

    console.log(
        "R186 — Enter X-ray Reconstruction Workspace",
        {
            firstVisit,
            savedState
        }
    );

    applyXrayDeveloperModeVisibility();
    updateXrayReconstructionStatus();
    updateXrayCaseStatus();
    updateXrayWorkflowStatus();

    // R561: bind controls after the workspace HTML has been injected.
    initializeXrayImageInputs();
    testXrayVtkObservationBridge();
    initializeXrayPortableCaseControls();
    initializeR368ViewControls();
    initializeWay2AndDicomControls();
    initializeObservationTestPanel();

    // R1123 — independent per-view persistence and startup restoration are removed.
    // Legacy per-view records are left untouched but are no longer read. Full-case recovery is the only automatic local restore path.
    setXrayWorkspaceStatus("R1123 — live AP/LAT panels ready · full-case recovery is the only local recovery authority");

    // R894 — activate VTK after WorkspaceManager visibility reaches a layout frame.
    // No per-view restore is performed before activation.
    try {
        // R894: WorkspaceManager has set display:block, but allow the parent
        // document to complete a layout frame before asking the child VTK canvases
        // to measure their viewport. This is a one-time lifecycle synchronization,
        // not a DOM observer or polling loop.
        await new Promise(resolve => requestAnimationFrame(() => resolve()));
        const activationResults = [];
        for (const view of ['AP', 'LAT']) {
            const vtkWindow = await waitForXrayLiveApi(view, 'activateXrayViewport');
            const result = await vtkWindow.activateXrayViewport('R894-workspace-enter');
            if (!result || result.status !== 'PASS' || !(result.viewport?.width > 0) || !(result.viewport?.height > 0)) {
                throw new Error(`${view} viewport activation did not confirm a non-zero visible viewport.`);
            }
            activationResults.push(`${view}:${result.viewport.width}x${result.viewport.height}`);
        }
        console.log(`[R894] VTK viewport activation complete · ${activationResults.join(' · ')}`);
    } catch (error) {
        setXrayWorkspaceStatus(`R894 — VIEW ACTIVATION FAILED · ${error?.message || error}`);
        console.error('[R894] VTK viewport activation failed', error);
    } finally {
        if (window.__R916_XRAY_CASE_RESET_PENDING) {
            r916ApplyXrayCaseDiagnosticsReset();
            window.__R916_XRAY_CASE_RESET_PENDING = false;
        }
    }
}


/* =========================================================
   Workspace leave
   ========================================================= */

async function leaveXrayReconstructionWorkspace(){

    /*
       No X-ray state is committed here yet.

       Future implementation may return workspace-local
       transient state, but CASE remains the application
       source of truth.
    */

    return {};
}


/* =========================================================
   Visible diagnostic
   ========================================================= */

function updateXrayReconstructionStatus(){

    const el =
        document.getElementById(
            "xrayWorkspaceStatus"
        );

    if(!el){
        return;
    }

    const hasCase =
        !!window.currentCase;

    const hasReconstructionEngine =
        !!window.ReconstructionEngine &&
        window.ReconstructionEngine.ready === true;

    el.textContent =
        "R187 — X-RAY RECONSTRUCTION WORKSPACE\n" +
        "CASE: " +
        (hasCase ? "loaded" : "not loaded") +
        "\n" +
        "RECONSTRUCTION ENGINE: " +
        (hasReconstructionEngine ? "loaded" : "NOT loaded");
}

function updateXrayCaseStatus(){

    const el =
        document.getElementById(
            "xrayCaseStatus"
        );

    if(!el){
        return;
    }

    if(!window.currentCase){

        el.textContent =
            "CASE not loaded.";

        return;
    }

    el.textContent =
        JSON.stringify(
            window.currentCase,
            null,
            2
        );
}


function updateXrayWorkflowStatus(){

    const el =
        document.getElementById(
            "xrayReconstructionWorkflowStatus"
        );

    if(!el){
        return;
    }

    const apCount =
        document.getElementById(
            "xrayAPObservationCount"
        );

    const latCount =
        document.getElementById(
            "xrayLATObservationCount"
        );

    const ap =
        apCount
            ? apCount.textContent
            : "0";

    const lat =
        latCount
            ? latCount.textContent
            : "0";

    const observation =
        getXrayObservation();

    el.textContent =
        observation
            ? "R193 — R152 observation bridge: PASS"
            : "Status: Waiting for AP + LAT observations" +
              " (AP " + ap + ", LAT " + lat + ")";
}

/* =========================================================
   R193 — R152 observation bridge
   ---------------------------------------------------------
   Reads the renderer-neutral observation exposed by the
   annotation layer.

   This does NOT access VTK objects.
   ========================================================= */

function getXrayObservation(){

    if(!window.XrayObservation){
        return null;
    }

    return window.XrayObservation;
}


/* =========================================================
   R368 — AP / LAT observation identity
   ---------------------------------------------------------
   The parent workspace only tells the renderer which radiographic
   view the current image represents. It does not inspect VTK state.
   ========================================================= */

async function setXrayObservationViewFromWorkspace(view){

    try{
        const vtkWindow = getXrayVtkWindow();

        if(typeof vtkWindow.setXrayObservationView !== "function"){
            throw new Error(
                "R368 — VTK AP/LAT view API is not available. Load the R368 VTK build first."
            );
        }

        const observation =
            vtkWindow.setXrayObservationView(view);

        setXrayViewStatus(
            "R368 — CURRENT VIEW: " +
            (observation?.images?.[0]?.view || "UNKNOWN")
        );

        testXrayVtkObservationBridge();

    }catch(error){
        setXrayViewStatus(
            "R368 — VIEW CHANGE FAILED · " + error.message
        );
    }
}

function setXrayViewStatus(text){
    const el = document.getElementById("xrayViewStatus");
    if(el) el.textContent = text;
}

function initializeR368ViewControls(){
    const bindings = [
        ["xraySetApViewButton", () => setXrayObservationViewFromWorkspace("AP")],
        ["xraySetLatViewButton", () => setXrayObservationViewFromWorkspace("LAT")],
        ["xraySetUnknownViewButton", () => setXrayObservationViewFromWorkspace("UNKNOWN")]
    ];
    bindings.forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (!button || button.dataset.r561ViewBound === "1") return;
        button.addEventListener("click", handler);
        button.dataset.r561ViewBound = "1";
    });

    const refresh = document.getElementById("xrayRefreshObservationButton");
    if (refresh && refresh.dataset.r561RefreshBound !== "1") {
        refresh.addEventListener("click", () => {
            testXrayVtkObservationBridge();
        });
        refresh.dataset.r561RefreshBound = "1";
    }
}

/* =========================================================
   R1123C7 — LIVE X-RAY WORKSPACE STATUS
   ---------------------------------------------------------
   The VTK iframe owns live annotations. Full-case recovery owns local persistence.
   No per-view working-copy save/restore path remains.
   ========================================================= */

function setXrayWorkspaceStatus(text){
    const el = document.getElementById("xrayWipStatus");
    if(el) el.textContent = text;
}

// R916 — clear prior-case X-ray status and import diagnostics after New Case.
// The X-ray workspace may be cached/unmounted when New Case is clicked, so retain
// a pending reset and apply it again after the next workspace-entry restore finishes.
function r916ResetXrayCaseDiagnostics(){
    window.__R916_XRAY_CASE_RESET_PENDING = true;
    r916ApplyXrayCaseDiagnosticsReset();
}

function r916ApplyXrayCaseDiagnosticsReset(){
    const status = document.getElementById("xrayWipStatus");
    if(status) status.textContent = "Live AP/LAT annotation workspace ready.";

    const report = document.getElementById("r864BundleValidationReport");
    if(report){
        report.textContent = [...r905RuntimeDiagnosticLines(), "",
            "R884 — CASE FILE VALIDATION · Select a portable CASE ZIP to validate its structure, checksums, images and annotations without installing it."
        ].join("\n");
        delete report.dataset.status;
        report.scrollTop = 0;
    }

    const title = document.querySelector(".mountingCard > div[style*=\"font-weight:700\"]");
    if(title) title.textContent = "R1123 — X-RAY RECONSTRUCTION · LIVE AP/LAT ANNOTATION";

    const ap = document.getElementById("xrayAPStatus");
    const lat = document.getElementById("xrayLATStatus");
    if(ap) ap.textContent = "No image loaded";
    if(lat) lat.textContent = "No image loaded";
    const apObs = document.getElementById("xrayAPObservationStatus");
    const latObs = document.getElementById("xrayLATObservationStatus");
    if(apObs) apObs.textContent = "R570 — AP observations: 0";
    if(latObs) latObs.textContent = "R570 — LAT observations: 0";
}
window.r916ResetXrayCaseDiagnostics = r916ResetXrayCaseDiagnostics;

// R862 — the SPA can expose its Restore control before the VTK iframe finishes
// initializing. Wait for the documented public API, but fail with frame/build
// diagnostics if the API never appears; do not touch IndexedDB during this wait.
// R1123C7 — initialize and acquire a live X-ray panel without touching WIP APIs.
async function ensureXrayLivePanel(view, timeoutMs = 15000){
    const frameId = view === "LAT" ? "xrayLATVtkFrame" : "xrayAPVtkFrame";
    const frame = document.getElementById(frameId);
    if(!frame?.contentWindow) throw new Error(`R1123 — ${view} iframe #${frameId} is unavailable.`);
    const started = Date.now();
    let lastError = null;
    while(Date.now() - started < timeoutMs){
        const win = frame.contentWindow;
        if(typeof win.ensureXrayLiveController === "function"){
            try {
                const ready = await win.ensureXrayLiveController();
                if(ready?.status !== "PASS") throw new Error("live controller bootstrap did not report PASS");
                if(ready.view !== view) throw new Error(`controller view identity is ${String(ready.view)}; expected ${view}`);
                const required = ["captureXrayLiveRollbackCheckpoint", "restoreXrayLiveRollbackCheckpoint"];
                const missing = required.filter(name => typeof win[name] !== "function");
                if(missing.length) throw new Error(`live APIs missing after initialization: ${missing.join(", ")}`);
                return win;
            } catch(error){
                lastError = error;
                // A failed initialization is not retried indefinitely; surface its cause.
                throw new Error(`R1123 — ${view} live controller initialization failed: ${error?.message || error}`);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    let marker = "unavailable";
    let scripts = "unavailable";
    try {
        marker = String(frame.contentWindow.__XRAY_VTK_ENGINE_BUILD__ || "not initialized");
        scripts = Array.from(frame.contentDocument?.scripts || []).map(script => script.src || "inline").join(" | ");
    } catch(_) {}
    throw new Error(`R1123 — ${view} live bootstrap API did not become available within ${timeoutMs} ms; build=${marker}; scripts=${scripts}; cause=${lastError?.message || "bootstrap not published"}`);
}

async function waitForXrayLiveApi(view, apiName, timeoutMs = 15000){
    const frameId = view === "LAT" ? "xrayLATVtkFrame" : "xrayAPVtkFrame";
    const frame = document.getElementById(frameId);
    if(!frame?.contentWindow) throw new Error(`R1123 — ${view} iframe #${frameId} is unavailable.`);
    const started = Date.now();
    let lastReadyState = "unknown";
    let bootstrapAttempted = false;
    let bootstrapError = null;
    while(Date.now() - started < timeoutMs){
        const win = frame.contentWindow;
        try { lastReadyState = win.document?.readyState || "cross-origin/unreadable"; }
        catch (_) { lastReadyState = "cross-origin/unreadable"; }

        if(!bootstrapAttempted && typeof win.ensureXrayLiveController === "function"){
            bootstrapAttempted = true;
            try {
                const ready = await win.ensureXrayLiveController();
                if(ready?.status !== "PASS") throw new Error("live controller bootstrap did not report PASS");
                if(ready.view !== view) throw new Error(`controller view identity is ${String(ready.view)}; expected ${view}`);
            } catch(error) {
                bootstrapError = error;
                throw new Error(`R1123 — ${view} live controller bootstrap failed: ${error?.message || error}`);
            }
        }
        if(typeof win[apiName] === "function") return win;
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    let iframeUrl = frame.getAttribute("src") || "(src unavailable)";
    let scriptList = "unavailable";
    let title = "unavailable";
    let apiSnapshot = "unavailable";
    let engineMarker = "unavailable";
    try {
        const doc = frame.contentWindow.document;
        iframeUrl = frame.contentWindow.location.href;
        title = doc.title || "(no title)";
        scriptList = Array.from(doc.scripts || []).map(s => s.src || "[inline script]").join(" | ") || "(no script elements)";
        const child = frame.contentWindow;
        apiSnapshot = `bootstrap=${typeof child.ensureXrayLiveController}, capture=${typeof child.captureXrayLiveRecord}, install=${typeof child.installXrayLiveRecord}, rollbackCapture=${typeof child.captureXrayLiveRollbackCheckpoint}, rollbackRestore=${typeof child.restoreXrayLiveRollbackCheckpoint}`;
        engineMarker = String(child.__XRAY_VTK_ENGINE_BUILD__ || "not published");
    } catch (diagnosticError) {
        scriptList = `unreadable: ${diagnosticError?.message || diagnosticError}`;
    }
    throw new Error(`R1123 — ${view} live API '${apiName}' did not become available within ${timeoutMs} ms. iframe=${iframeUrl}; readyState=${lastReadyState}; title=${title}; engineMarker=${engineMarker}; bootstrapError=${bootstrapError?.message || "none"}; APIs=[${apiSnapshot}]; scripts=[${scriptList}].`);
}

/* ============================================================================
 * R1131 — PUBLIC LIVE AP/LAT CAPTURE API FOR SUPABASE WIP
 * --------------------------------------------------------------------------
 * The R1124C1 retirement removed the old r913 local named-case helper. Supabase
 * WIP must therefore capture through the same live iframe API already used by
 * portable ZIP export, not depend on the retired local-WIP checkpoint path.
 * ========================================================================== */
window.r1131CaptureCurrentXrayRecord = async function(view){
    if(view !== 'AP' && view !== 'LAT') throw new Error('X-ray view must be AP or LAT.');
    const panel = await waitForXrayLiveApi(view, 'captureXrayLiveRecord');
    const live = await panel.captureXrayLiveRecord();
    if(!live || live.imageView !== view || !live.observation){
        throw new Error(`${view}: live X-ray capture returned an invalid view or observation.`);
    }
    if(live.observation?.images?.length !== 1 || live.observation.images[0]?.view !== view){
        throw new Error(`${view}: live image/observation identity is invalid.`);
    }
    if(!Array.isArray(live.observation.annotations)){
        throw new Error(`${view}: live annotation list is invalid.`);
    }
    if(live.imageSource === 'EMPTY' || !live.imageFileBytes?.byteLength){
        throw new Error(`${view}: original image bytes are missing. Load the image before saving WIP to Supabase.`);
    }
    const bytes = live.imageFileBytes instanceof Uint8Array
        ? new Uint8Array(live.imageFileBytes)
        : new Uint8Array(live.imageFileBytes);
    if(!bytes.length) throw new Error(`${view}: original image is empty.`);
    const archive = window.CaseFileService?.archive;
    if(typeof archive?.sha256Hex !== 'function') throw new Error('CaseFileService SHA-256 helper is unavailable.');
    const actualHash = String(await archive.sha256Hex(bytes)).toLowerCase();
    if(!/^[a-f0-9]{64}$/.test(actualHash)) throw new Error(`${view}: SHA-256 helper returned an invalid digest.`);
    if(live.imageChecksum && String(live.imageChecksum).toLowerCase() !== actualHash){
        throw new Error(`${view}: live image checksum does not match its original bytes.`);
    }
    return {
        schemaVersion: 'xray-wip-v3',
        savedAt: new Date().toISOString(),
        observation: JSON.parse(JSON.stringify(live.observation)),
        imageFileBytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
        imageFileName: live.imageFileName || `original-${view.toLowerCase()}.dcm`,
        imageFileType: live.imageFileType || 'application/dicom',
        imageFileLastModified: live.imageFileLastModified || null,
        imageByteLength: bytes.length,
        imageChecksumAlgorithm: 'SHA-256',
        imageChecksum: actualHash,
        imageIdentityStatus: 'CHECKSUM_VERIFIED',
        imageSource: live.imageSource || 'DICOM',
        imageView: view
    };
};

/* =========================================================
   R904/R1104 — PORTABLE CASE BUNDLE EXPORT DELEGATION
   ---------------------------------------------------------
   Export packages the exact CASE snapshot + verified live AP/LAT source bytes
   + renderer-neutral observations. R1104 captures directly from the iframe APIs;
   it does not flush or read per-view persistence.
   ========================================================= */
async function exportCaseBundleFromWorkspace(){
    const status=document.getElementById("xrayWipStatus");
    const setStatus=(s)=>{if(status)status.textContent=s;};
    try{
        if(!window.currentCase || typeof window.currentCase!=="object") throw new Error("The current CASE is not available. Nothing was exported.");
        // R1104: portable export now reads the live AP/LAT iframe state directly.
        // It captures directly from the live panels and uses no per-view persistence.
        const caseSnapshot=JSON.parse(JSON.stringify(window.currentCase));
        const records={};
        for(const view of ["AP","LAT"]){
            const vtk=await waitForXrayLiveApi(view,"captureXrayLiveRecord");
            const liveRecord=await vtk.captureXrayLiveRecord();
            if(!liveRecord?.observation || liveRecord.imageView!==view) {
                throw new Error(`${view}: live capture returned an invalid observation/view.`);
            }
            // CaseFileService.archive.buildBundle() has a stable input contract:
            // imageBytes (not the iframe capture API's imageFileBytes).
            // Adapt the live capture record at this boundary without changing
            // either the iframe API or the portable ZIP schema.
            const isEmpty = liveRecord.imageSource === "EMPTY";
            if (isEmpty) {
                if (liveRecord.imageFileBytes?.byteLength || liveRecord.imageChecksum ||
                    liveRecord.imageByteLength !== 0 || liveRecord.observation.annotations.length !== 0 ||
                    liveRecord.observation.images[0].source !== "empty" ||
                    liveRecord.observation.images[0].identityStatus !== "EMPTY_NO_IMAGE") {
                    throw new Error(`${view}: live EMPTY panel record is inconsistent.`);
                }
            } else if (!liveRecord.imageFileBytes?.byteLength ||
                !/^[a-f0-9]{64}$/i.test(String(liveRecord.imageChecksum || ""))) {
                throw new Error(`${view}: live original image bytes or SHA-256 checksum are missing.`);
            }
            records[view]={
                schemaVersion: isEmpty ? "xray-live-empty-v1" : "xray-live-state-v1",
                savedAt:null,
                observation:liveRecord.observation,
                imageBytes:isEmpty ? null : liveRecord.imageFileBytes,
                imageChecksum:isEmpty ? null : String(liveRecord.imageChecksum).toLowerCase(),
                imageFileName:isEmpty ? null : liveRecord.imageFileName,
                imageFileType:isEmpty ? null : liveRecord.imageFileType,
                imageSource:liveRecord.imageSource,
                imageView:liveRecord.imageView
            };
        }
        // Prevent exporting a mixed CASE if it changed while AP/LAT were captured.
        if(JSON.stringify(window.currentCase)!==JSON.stringify(caseSnapshot)) {
            throw new Error("CASE changed during portable export capture. No ZIP was created; retry after the CASE is stable.");
        }
        // Portable serialization, manifest assembly, member checksums and ZIP packaging belong to CaseFileService.
        const archive=window.CaseFileService?.archive;
        if(typeof archive?.buildBundle!=="function") throw new Error("CaseFileService R904 buildBundle API is unavailable. No bundle was exported.");
        const built=await archive.buildBundle(caseSnapshot,records,window.XRAY_RECONSTRUCTION_BUILD||"R1107");
        const url=URL.createObjectURL(built.blob);
        const anchor=document.createElement("a");
        const date=new Date().toISOString().slice(0,10);

        // R911 — patient name leads the portable filename so surgeons can find
        // cases by patient in the device's Files/Downloads browser. Preserve
        // Unicode names (including Thai); strip filesystem-reserved characters.
        const patientCandidates = [
            window.currentCase?.patient?.patient_name,
            window.currentCase?.metadata?.patient_name,
            window.currentCase?.patient?.patient_id,
            window.currentCase?.metadata?.patient_id
        ].map(value => String(value ?? "").trim());
        const isPlaceholderPatientValue = value =>
            !value || /^(enter\s*(name|id)|patient\s*(name|id)|unknown|n\/a)$/i.test(value);
        const patientText = patientCandidates.find(value => !isPlaceholderPatientValue(value)) || "";
        const patientLabel = !patientText ? "UnknownPatient" :
            patientText
                .normalize("NFKC")
                .replace(/[\\/:*?"<>|]/g, "_")
                .replace(/[\u0000-\u001F\u007F]/g, "")
                .replace(/\s+/g, "_")
                .replace(/_+/g, "_")
                .replace(/^[_.]+|[_.]+$/g, "")
                .slice(0, 80) || "UnknownPatient";
        anchor.href=url;
        anchor.download=`${patientLabel}_${built.caseName}_${date}_case-bundle.zip`;
        anchor.style.display="none";
        document.body.appendChild(anchor); anchor.click(); anchor.remove();
        setTimeout(()=>URL.revokeObjectURL(url),30000);
        setStatus(`${window.XRAY_RECONSTRUCTION_BUILD||"R1107"} — CASE SAVED · CASE preserved · AP/LAT records and original images checksum-verified · ${built.memberCount} ZIP members · ${(built.blob.size/1024).toFixed(1)} KB`);
        return true;
    }catch(error){
        setStatus(`${window.XRAY_RECONSTRUCTION_BUILD||"R913"} — SAVE CASE FAILED · ${error?.message||error}`);
        return false;
    }
}
window.exportCaseBundleFromWorkspace = exportCaseBundleFromWorkspace;


/* R1124C1: R913 local named-case capture/save/open workflow retired. */

/* =========================================================
   R912 — PATIENT-IDENTIFIED PORTABLE CASE OPEN + IMPORT ORCHESTRATION
   ---------------------------------------------------------
   Validation/archive parsing is delegated to CaseFileService.archive.
   This controller retains UI, import confirmation, rollback, and live VTK installation.
   ========================================================= */
function r864AddValidationControls(){
    const host=document.getElementById('xrayWipControls');
    if(!host || document.getElementById('r864ValidateBundleButton')) return;
    const row=host.querySelector('div[style*="display:flex"]') || host;
    const button=document.createElement('button');
    button.type='button'; button.id='r864ValidateBundleButton';
    button.textContent='Validate Case File';
    button.style.cssText='padding:8px 12px;cursor:pointer;font-weight:700;';
    const input=document.createElement('input');
    input.type='file'; input.accept='.zip,application/zip,application/x-zip-compressed';
    input.id='r864ValidateBundleFile'; input.style.display='none';
    button.addEventListener('click',()=>input.click());
    input.addEventListener('change',async()=>{
        const file=input.files && input.files[0];
        if(!file) return;
        const report=document.getElementById('r864BundleValidationReport');
        report.textContent=[...r905RuntimeDiagnosticLines(),'','R864 — VALIDATING · Reading archive; no active data will be changed.'].join('\n');
        button.disabled=true;
        try{
            const result=await window.CaseFileService.archive.validateBundleFile(file);
            report.textContent=[...r905RuntimeDiagnosticLines(),' ',...result.lines].join('\n');
            report.dataset.status='PASS';
        }catch(error){
            report.textContent=[...r905RuntimeDiagnosticLines(),'','R864 — VALIDATION FAILED',String(error?.message||error),'','No CASE, IndexedDB, image, or annotation data was changed.'].join('\n');
            report.dataset.status='FAIL';
        }finally{ button.disabled=false; input.value=''; }
    });
    row.appendChild(button); row.appendChild(input);
    // R901: explicit opt-in rollback test; verifies authoritative CASE fields and server-regenerated derived parameters. It selects and validates a ZIP, installs
    // AP only, injects a failure before LAT installation, then exercises normal rollback.
    const rollbackTestButton=document.createElement('button');
    rollbackTestButton.type='button'; rollbackTestButton.id='r899RollbackTestButton';
    rollbackTestButton.textContent='Test Rollback (controlled)';
    rollbackTestButton.style.cssText='padding:8px 12px;cursor:pointer;font-weight:700;margin-left:6px;';
    const rollbackTestInput=document.createElement('input');
    rollbackTestInput.type='file'; rollbackTestInput.accept='.zip,application/zip,application/x-zip-compressed';
    rollbackTestInput.id='r899RollbackTestFile'; rollbackTestInput.style.display='none';
    rollbackTestButton.addEventListener('click',()=>rollbackTestInput.click());
    rollbackTestInput.addEventListener('change',async()=>{
        const file=rollbackTestInput.files && rollbackTestInput.files[0];
        if(!file)return;
        const confirmed=window.confirm('CONTROLLED ROLLBACK TEST\n\nThis will checkpoint the current CASE and AP/LAT work, temporarily install the AP data from the selected ZIP, then deliberately force a failure before LAT installation to test recovery.\n\nUse a disposable/test case and do not continue if you cannot risk a temporary change to the current workspace. Continue?');
        if(!confirmed){rollbackTestInput.value='';return;}
        rollbackTestButton.disabled=true;
        const reportNow=document.getElementById('r864BundleValidationReport');
        try{
            if(reportNow)reportNow.textContent='R901 — CONTROLLED ROLLBACK VERIFICATION · Validating selected ZIP; no installation has started.';
            const validated=await window.CaseFileService.archive.validateBundleFile(file);
            if(reportNow)reportNow.textContent=[...validated.lines,'','R901 TEST PLAN · AP will be installed temporarily; a deliberate failure will then trigger the normal rollback path.'].join('\n');
            const completed=await r869InstallValidatedBundle(validated,{r899ForceFailureAfterAP:true});
            if(completed && reportNow){reportNow.textContent='R901 — TEST INVALID · The deliberate failure did not trigger as expected.';reportNow.dataset.status='FAIL';}
        }catch(error){
            if(reportNow){reportNow.textContent='R901 — ROLLBACK TEST COULD NOT START\n'+(error?.message||error)+'\nNo controlled installation test was completed.';reportNow.dataset.status='FAIL';}
        }finally{rollbackTestButton.disabled=false;rollbackTestInput.value='';}
    });
    row.appendChild(rollbackTestButton); row.appendChild(rollbackTestInput);
    const report=document.createElement('pre');
    report.id='r864BundleValidationReport'; report.setAttribute('role','status'); report.setAttribute('aria-live','polite');
    report.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto;margin:10px 0 0;padding:10px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;color:#172033;font:12px/1.5 ui-monospace,monospace;';
    report.textContent=[...r905RuntimeDiagnosticLines(),'','R884 — CASE FILE VALIDATION · Select a portable CASE ZIP to validate its structure, checksums, images and annotations without installing it.'].join('\n');
    host.appendChild(report);
    const title=document.querySelector('.mountingCard > div[style*="font-weight:700"]');
    if(title && /CASE BUNDLE EXPORT/i.test(title.textContent)) title.textContent='R901 — X-RAY RECONSTRUCTION · PORTABLE CASE BUNDLE IMPORT + ROLLBACK VERIFICATION';
}

function r869ArrayBuffer(bytes){ return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength); }
async function r869CaptureRollbackRecord(view){
    const vtk=await waitForXrayLiveApi(view,'captureXrayLiveRollbackCheckpoint');
    const activeView=typeof vtk.getXrayObservationView==='function'?vtk.getXrayObservationView():null;
    if(activeView!==view) throw new Error(`${view}: live panel reports view '${activeView||'unknown'}'; refusing to change view during rollback capture.`);
    const captured=await vtk.captureXrayLiveRollbackCheckpoint();
    if(!captured || captured.schemaVersion!=='xray-live-rollback-v1' || captured.view!==view || !captured.observation){
        throw new Error(`${view}: live in-memory rollback checkpoint is incomplete.`);
    }
    const bytes=captured.imageBytes;
    return {
        schemaVersion:captured.schemaVersion, view,
        observation:captured.observation,
        syntheticImage:captured.syntheticImage||null,
        imageFileBytes:bytes?r869ArrayBuffer(new Uint8Array(bytes)):null,
        imageFileBlob:null,imageFile:null,
        imageFileName:captured.imageFileName||'rollback-image.dcm',
        imageFileType:captured.imageFileType||'application/dicom',
        imageFileLastModified:captured.imageFileLastModified||null,
        imageByteLength:captured.imageByteLength||bytes?.byteLength||0,
        imageChecksumAlgorithm:captured.imageChecksumAlgorithm||null,
        imageChecksum:captured.imageChecksum||null,
        imageIdentityStatus:captured.imageChecksum?'CHECKSUM_VERIFIED':'NO_EXTERNAL_IMAGE_BYTES',
        imageSource:captured.imageSource||'synthetic',imageView:view
    };
}
// R880 — read-only comparison helper; object key order does not affect the result.
function r877CanonicalJson(value){
    if(Array.isArray(value)) return '['+value.map(r877CanonicalJson).join(',')+']';
    if(value && typeof value==='object'){
        return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+r877CanonicalJson(value[key])).join(',')+'}';
    }
    return JSON.stringify(value);
}

// R882 — classify field-level differences and trace selected values around the browser-local CASE commit.
// `expected` is the imported CASE; `actual` is a browser-owned CASE snapshot.
function r881CompareCaseFields(expected, actual, maxSamples=24){
    const counts={onlyInImported:0,onlyOnServer:0,valueDifferent:0};
    const samples={onlyInImported:[],onlyOnServer:[],valueDifferent:[]};
    const add=(kind,path)=>{
        counts[kind]++;
        if(samples[kind].length<maxSamples) samples[kind].push(path||'$');
    };
    const isObject=v=>v!==null&&typeof v==='object';
    const walk=(a,b,path)=>{
        if(Array.isArray(a)||Array.isArray(b)){
            if(!Array.isArray(a)||!Array.isArray(b)){add('valueDifferent',path);return;}
            const max=Math.max(a.length,b.length);
            for(let i=0;i<max;i++){
                const p=`${path}[${i}]`;
                if(i>=a.length){add('onlyOnServer',p);continue;}
                if(i>=b.length){add('onlyInImported',p);continue;}
                walk(a[i],b[i],p);
            }
            return;
        }
        if(isObject(a)||isObject(b)){
            if(!isObject(a)||!isObject(b)){add('valueDifferent',path);return;}
            const keysA=Object.keys(a), keysB=new Set(Object.keys(b));
            const keysASet=new Set(keysA);
            for(const key of keysA){
                const p=path?`${path}.${key}`:key;
                if(!keysB.has(key)){add('onlyInImported',p);continue;}
                walk(a[key],b[key],p);
            }
            for(const key of keysB){
                if(!keysASet.has(key)) add('onlyOnServer',path?`${path}.${key}`:key);
            }
            return;
        }
        if(!Object.is(a,b)) add('valueDifferent',path);
    };
    walk(expected,actual,'');
    return {counts,samples,maxSamples};
}

function r882ReadBrowserCase(){
    try{
        if(!window.currentCase || typeof window.currentCase !== 'object') throw new Error('window.currentCase is unavailable');
        return {ok:true,caseData:JSON.parse(JSON.stringify(window.currentCase)),error:null};
    }catch(error){return {ok:false,caseData:null,error:error?.message||String(error)};}
}
function r882WithoutDerivedCaseFields(caseData){
    const copy=JSON.parse(JSON.stringify(caseData||{}));
    delete copy.parameters;
    delete copy.debug_sync;
    return copy;
}
function r882GetPath(root,path){return path.split('.').reduce((value,key)=>value==null?undefined:value[key],root);}
function r882FormatValue(value){if(value===undefined)return '<MISSING>';try{return JSON.stringify(value);}catch(_){return String(value);}}
const R882_TRACE_PATHS=['parameters.STRUT_ARRAY_OVERRIDE','parameters.BONE_PROX_ORIGIN','parameters.R_PROX_ANGLES','parameters.CLINICAL_OFFSET','parameters.CLINICAL_ANGLES','mounting','deformity'];
function r882BuildValueTrace(importedCase,browserBefore,browserAfter){
    return R882_TRACE_PATHS.map(path=>({
        path,
        imported:r882FormatValue(r882GetPath(importedCase,path)),
        browserBefore:r882FormatValue(r882GetPath(browserBefore,path)),
        browserAfter:r882FormatValue(r882GetPath(browserAfter,path)),
        importedEqualsBefore:r877CanonicalJson(r882GetPath(importedCase,path))===r877CanonicalJson(r882GetPath(browserBefore,path)),
        importedEqualsAfter:r877CanonicalJson(r882GetPath(importedCase,path))===r877CanonicalJson(r882GetPath(browserAfter,path)),
        beforeEqualsAfter:r877CanonicalJson(r882GetPath(browserBefore,path))===r877CanonicalJson(r882GetPath(browserAfter,path))
    }));
}
function r877DiagnoseCaseReplacement(importedCase,browserBeforeSync){
    const afterRead=r882ReadBrowserCase();
    const result={browserMatchesImported:false,parameterTranslationSuccess:false,browserCaseName:window.currentCase?.metadata?.case_name||'(unnamed)',importedCaseName:importedCase?.metadata?.case_name||'(unnamed)',browserReadError:afterRead.ok?null:afterRead.error,browserFieldDifferences:null,browserBeforeFieldDifferences:null,valueTrace:null,inspectorPresent:!!document.getElementById('currentCaseInspector'),inspectorMatchesImported:null};
    if(afterRead.ok){
        const importedSource=r882WithoutDerivedCaseFields(importedCase);
        const browserSource=r882WithoutDerivedCaseFields(afterRead.caseData);
        result.browserMatchesImported=r877CanonicalJson(browserSource)===r877CanonicalJson(importedSource);
        result.parameterTranslationSuccess=afterRead.caseData.debug_sync?.success===true && !!afterRead.caseData.parameters && typeof afterRead.caseData.parameters==='object' && !Array.isArray(afterRead.caseData.parameters);
        result.browserFieldDifferences=r881CompareCaseFields(importedSource,browserSource);
        const before=browserBeforeSync?.ok?browserBeforeSync.caseData:null;
        result.browserBeforeFieldDifferences=before?r881CompareCaseFields(importedSource,r882WithoutDerivedCaseFields(before)):null;
        result.valueTrace=r882BuildValueTrace(importedCase,before||{},afterRead.caseData);
    }
    const inspector=document.getElementById('currentCaseInspector');
    if(inspector){try{result.inspectorMatchesImported=r877CanonicalJson(r882WithoutDerivedCaseFields(JSON.parse(inspector.textContent)))===r877CanonicalJson(r882WithoutDerivedCaseFields(importedCase));}catch(error){result.inspectorMatchesImported=false;result.inspectorParseError=error?.message||String(error);}}
    return result;
}

// R880 — replacing CASE resets Inspector scroll; normal refreshes preserve it.
async function r880RefreshAndVerifyInspector(importedCase){
    window.__caseInspectorResetPending = true;
    const selector='[id="currentCaseInspector"]';
    const beforeNodes=Array.from(document.querySelectorAll(selector));
    let sharedRefreshAvailable=typeof updateCurrentCaseInspector==='function';
    let sharedRefreshError=null;
    if(sharedRefreshAvailable){
        try{ updateCurrentCaseInspector({resetScroll:true}); }
        catch(error){ sharedRefreshError=error?.message||String(error); }
    }
    // Update the cached Patient DOM in place. Do not replace its element.
    const expectedCase=JSON.parse(JSON.stringify(window.currentCase));
    const expected=JSON.stringify(expectedCase,null,2);
    for(const node of beforeNodes){
        node.textContent=expected;
        node.scrollTop=0;
    }
    await new Promise(resolve=>requestAnimationFrame(()=>resolve()));
    const afterNodes=Array.from(document.querySelectorAll(selector));
    const visibleNodes=afterNodes.filter(node=>node.getClientRects().length>0);
    const matches=node=>{
        try{return r877CanonicalJson(JSON.parse(node.textContent))===r877CanonicalJson(expectedCase);}
        catch(_){return false;}
    };
    return {
        sharedRefreshAvailable,
        sharedRefreshError,
        nodeCountBefore:beforeNodes.length,
        nodeCountAfter:afterNodes.length,
        visibleNodeCount:visibleNodes.length,
        allNodesMatch:afterNodes.length>0&&afterNodes.every(matches),
        visibleNodesMatch:visibleNodes.length>0&&visibleNodes.every(matches),
        matchingNodeCount:afterNodes.filter(matches).length,
        visibleMatchingNodeCount:visibleNodes.filter(matches).length,
        scrollTopAfterImport:afterNodes.length ? afterNodes[0].scrollTop : null
    };
}

async function r899VerifyRollbackRecord(view, expected, panel){
    const installed=await panel.restoreXrayLiveRollbackCheckpoint({
        schemaVersion:'xray-live-rollback-v1',view,
        observation:expected.observation,
        syntheticImage:expected.syntheticImage||null,
        imageBytes:expected.imageFileBytes||null,
        imageByteLength:expected.imageByteLength||0,
        imageChecksumAlgorithm:expected.imageChecksumAlgorithm||null,
        imageChecksum:expected.imageChecksum||null,
        imageSource:expected.imageSource||'synthetic',
        imageFileName:expected.imageFileName||null,
        imageFileType:expected.imageFileType||null,
        imageFileLastModified:expected.imageFileLastModified||null
    });
    if(installed?.status!=='PASS'||installed.view!==view||installed.persisted!==false) throw new Error('live rollback restore was not confirmed as an in-memory-only operation');
    const checkPanel=await waitForXrayLiveApi(view,'captureXrayLiveRollbackCheckpoint');
    const actual=await checkPanel.captureXrayLiveRollbackCheckpoint();
    if(!actual?.observation) throw new Error('restored live observation is missing after rollback');
    if(r877CanonicalJson(actual.observation)!==r877CanonicalJson(expected.observation)) throw new Error('restored live annotation observation does not match checkpoint');
    if(expected.imageSource!=='DICOM' && expected.imageSource!=='RASTER'){
        if(!actual.syntheticImage || r877CanonicalJson(actual.syntheticImage)!==r877CanonicalJson(expected.syntheticImage)) {
            throw new Error('restored synthetic image dimensions/spacing/origin/pixels do not match checkpoint');
        }
    }
    const expectedBytes=expected.imageFileBytes ? new Uint8Array(expected.imageFileBytes) : null;
    const actualBytes=actual.imageBytes ? new Uint8Array(actual.imageBytes) : null;
    if(expectedBytes && !actualBytes) throw new Error('restored live image bytes are missing');
    if(!expectedBytes && actualBytes && actualBytes.length) throw new Error('unexpected live image bytes exist in restored checkpoint');
    if(expectedBytes && actualBytes){
        if(expectedBytes.length!==actualBytes.length) throw new Error('restored live image byte length differs from checkpoint');
        const archive=window.CaseFileService?.archive;
        if(!archive?.sha256Hex) throw new Error('SHA-256 helper is unavailable for live rollback verification');
        const [expectedHash,actualHash]=await Promise.all([archive.sha256Hex(expectedBytes),archive.sha256Hex(actualBytes)]);
        if(expectedHash!==actualHash) throw new Error('restored live image SHA-256 differs from checkpoint');
    }
    return {view,annotations:actual.observation.annotations?.length??null,imageBytes:actualBytes?.length||0,persisted:false};
}

// R1123 — transactionally reset AP/LAT live workspaces for New Case.
// Checkpoints, reset, and rollback are live-memory operations only; this path
// does not call per-view persistence or compatibility APIs.
window.clearActiveXrayWorkspaces = async function(){
    const views = ["AP", "LAT"];
    const panels = {};
    const checkpoints = {};
    const frames = {};
    const reloaded = new Set();

    const reloadPanel = async view => {
        const frame = document.getElementById(view === "LAT" ? "xrayLATVtkFrame" : "xrayAPVtkFrame");
        if (!frame) throw new Error(view + " iframe is unavailable.");
        frames[view] = frame;
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                frame.removeEventListener("load", onLoad);
                reject(new Error(view + " iframe reload timed out."));
            }, 10000);
            const onLoad = () => {
                clearTimeout(timer);
                frame.removeEventListener("load", onLoad);
                resolve();
            };
            frame.addEventListener("load", onLoad, { once: true });
            frame.contentWindow.location.reload();
        });
        reloaded.add(view);
        // Reacquire the NEW iframe Window and initialize its lazy VTK controller.
        panels[view] = await ensureXrayLivePanel(view);
        return panels[view];
    };

    const verifyEmptyLivePanel = async view => {
        const panel = panels[view] || await ensureXrayLivePanel(view);
        const live = await panel.captureXrayLiveRollbackCheckpoint();
        const annotations = live?.observation?.annotations;
        if (!Array.isArray(annotations) || annotations.length !== 0) {
            throw new Error(view + " still contains " + (annotations?.length ?? "unknown") + " live annotation(s) after New Case reset.");
        }
        if (live.imageSource !== "SYNTHETIC" || live.syntheticImage?.hasLoadedXrayImage !== false) {
            throw new Error(view + " did not return to the intentionally empty startup image state.");
        }
        if (live.imageBytes?.byteLength) {
            throw new Error(view + " unexpectedly retains external image bytes after New Case reset.");
        }
        return { view, annotations: 0, image: "intentionally empty", persisted: false };
    };

    const verifyCheckpoint = async (view, expected, actual) => {
        if (!actual || actual.schemaVersion !== "xray-live-rollback-v1" || actual.view !== view) {
            throw new Error(view + " rollback readback is not a valid live checkpoint.");
        }
        if (JSON.stringify(actual.observation) !== JSON.stringify(expected.observation)) {
            throw new Error(view + " restored live observation differs from its checkpoint.");
        }
        if (actual.imageSource !== expected.imageSource) {
            throw new Error(view + " restored image source differs from its checkpoint.");
        }
        if (expected.syntheticImage) {
            const a = expected.syntheticImage;
            const b = actual.syntheticImage;
            if (!b) throw new Error(view + " restored synthetic pixel state is missing.");
            for (const key of ["dimensions", "spacing", "origin"]) {
                if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
                    throw new Error(view + " restored synthetic " + key + " differs from its checkpoint.");
                }
            }
            const av = a.values;
            const bv = b.values;
            if (!av || !bv || av.length !== bv.length) {
                throw new Error(view + " restored synthetic pixel array length differs from its checkpoint.");
            }
            for (let i = 0; i < av.length; i++) {
                if (av[i] !== bv[i]) throw new Error(view + " restored synthetic pixel values differ at scalar " + i + ".");
            }
        } else {
            if (expected.imageByteLength !== actual.imageByteLength) {
                throw new Error(view + " restored external image byte length differs from its checkpoint.");
            }
            if (!expected.imageChecksum || actual.imageChecksum !== expected.imageChecksum) {
                throw new Error(view + " restored external image SHA-256 differs from its checkpoint.");
            }
        }
        return true;
    };

    try {
        // Ensure the hidden X-ray workspace and both iframe elements exist without
        // changing the currently visible Patient workspace.
        if (!window.WorkspaceManager || typeof window.WorkspaceManager.ensureInitialized !== "function") {
            throw new Error("R1123 — WorkspaceManager.ensureInitialized('xray') is unavailable.");
        }
        await window.WorkspaceManager.ensureInitialized("xray");

        // Prepare and capture BOTH live panels before changing either one.
        // No per-view persistence APIs or IndexedDB operations are used here.
        for (const view of views) {
            const panel = await ensureXrayLivePanel(view);
            panels[view] = panel;
            const checkpoint = await panel.captureXrayLiveRollbackCheckpoint();
            if (checkpoint?.schemaVersion !== "xray-live-rollback-v1" ||
                checkpoint.view !== view || !checkpoint.observation) {
                throw new Error(view + " did not provide a valid live rollback checkpoint.");
            }
            if ((checkpoint.imageSource === "DICOM" || checkpoint.imageSource === "RASTER") &&
                (!checkpoint.imageBytes?.byteLength || !checkpoint.imageChecksum)) {
                throw new Error(view + " external image checkpoint lacks original bytes or SHA-256 identity.");
            }
            if (checkpoint.imageSource !== "DICOM" && checkpoint.imageSource !== "RASTER" &&
                (!checkpoint.syntheticImage?.values?.length)) {
                throw new Error(view + " synthetic image checkpoint lacks pixel data.");
            }
            checkpoints[view] = checkpoint;
        }

        // A freshly loaded clinical VTK iframe is the established empty-panel state.
        // Reload only after both live checkpoints have been captured.
        for (const view of views) await reloadPanel(view);

        const verified = {};
        for (const view of views) verified[view] = await verifyEmptyLivePanel(view);

        return {
            status: "PASS",
            cleared: views.slice(),
            storage: "live-memory-only",
            rollbackCheckpoints: "captured in memory",
            verified
        };
    } catch (error) {
        const rollbackErrors = [];
        const rollbackVerified = [];

        // Always reacquire the current iframe window. The old Window reference
        // becomes stale after reload, so it must never be used for rollback.
        for (const view of views) {
            const checkpoint = checkpoints[view];
            if (!checkpoint) continue;
            try {
                const panel = await ensureXrayLivePanel(view);
                panels[view] = panel;
                const restored = await panel.restoreXrayLiveRollbackCheckpoint(checkpoint);
                if (restored?.status !== "PASS" || restored.view !== view || restored.persisted !== false) {
                    throw new Error("live checkpoint restoration was not confirmed as memory-only");
                }
                const readback = await panel.captureXrayLiveRollbackCheckpoint();
                await verifyCheckpoint(view, checkpoint, readback);
                rollbackVerified.push(view + ": live image/annotations restored and verified; no per-view persistence");
            } catch (rollbackError) {
                rollbackErrors.push(view + ": " + (rollbackError?.message || String(rollbackError)));
            }
        }

        const expectedRollbackCount = Object.keys(checkpoints).length;
        const rollbackComplete = expectedRollbackCount === views.length && rollbackVerified.length === views.length && rollbackErrors.length === 0;
        const suffix = rollbackComplete
            ? " Both captured live AP/LAT checkpoints were restored and verified."
            : ` Rollback incomplete: captured=${expectedRollbackCount}/2, verified=${rollbackVerified.length}/2` +
              (rollbackErrors.length ? "; errors=" + rollbackErrors.join("; ") : ".");
        return {
            status: "FAIL",
            message: (error?.message || String(error)) + suffix,
            rollbackComplete,
            rollbackErrors,
            rollbackVerified,
            reloaded: Array.from(reloaded),
            storage: "live-memory-only"
        };
    }
};

async function r869InstallValidatedBundle(validated, options={}){
    const status=document.getElementById('xrayWipStatus');
    const report=document.getElementById('r864BundleValidationReport');
    const setStatus=s=>{if(status)status.textContent=s;};
    if(!validated?.caseData||!validated?.manifest) throw new Error('R882 — validated bundle payload is missing.');
    const localRecovery = options?.localRecovery === true;
    const operationLabel = localRecovery ? 'Local full-case recovery' : 'Portable ZIP import';
    const importedCase=validated.caseData;
    const requiredObjects=['metadata','patient','deformity','frame','mounting','parameters','treatment'];
    const missing=requiredObjects.filter(k=>!importedCase[k]||typeof importedCase[k]!=='object'||Array.isArray(importedCase[k]));
    if(missing.length) throw new Error('R881 — CASE lacks required current workspace object groups: '+missing.join(', ')+'. Nothing installed.');
    const hadPreviousCase=Object.prototype.hasOwnProperty.call(window,'currentCase');
    const previousCaseSnapshot=hadPreviousCase && window.currentCase ? JSON.parse(JSON.stringify(window.currentCase)) : null;
    const recoveryTransition = typeof window.beginCaseTransition === "function"
        ? window.beginCaseTransition(operationLabel + ": CASE plus AP/LAT installation") : null;
    let recoveryImportCommitted = false;
    const backup={}; const panels={};
    try{
        for(const view of ['AP','LAT']) {
            panels[view] = await waitForXrayLiveApi(view,'installXrayLiveRecord');
            await waitForXrayLiveApi(view,'restoreXrayLiveRollbackCheckpoint');
        }
        setStatus(localRecovery ? 'R1125A — PREPARING LOCAL RECOVERY · Capturing in-memory rollback checkpoints…' : 'R882 — PREPARING IMPORT · Capturing rollback checkpoints without overwriting saved work…');
        for(const view of ['AP','LAT']) backup[view]=await r869CaptureRollbackRecord(view);
        setStatus(localRecovery ? 'R1125A — INSTALLING LOCALLY · Checkpoints ready; installing CASE + AP/LAT…' : 'R882 — INSTALLING · Checkpoints ready; installing validated bundle…');
        for(const view of ['AP','LAT']){
            const result=await panels[view].installXrayLiveRecord((()=>{
                const buildRecord=window.CaseFileService?.archive?.buildLiveRecord;
                if(typeof buildRecord!=='function') throw new Error('CaseFileService R1123 buildLiveRecord API is unavailable.');
                return buildRecord(view,validated);
            })());
            if(result?.status!=='PASS'||result.view!==view) throw new Error(`${view}: panel did not confirm import installation.`);
            if(options?.r899ForceFailureAfterAP===true && view==='AP') throw new Error('R899 CONTROLLED TEST: deliberate failure after AP installation and before LAT installation.');
        }
        // CASE replacement occurs only after both image/annotation installs pass.
        // R1172.6: CASE state and commit verification are entirely browser-owned.
        const browserBeforeSync = r882ReadBrowserCase();
        window.currentCase=JSON.parse(JSON.stringify(importedCase));
        if(typeof syncCurrentCase!=='function') throw new Error('R871 — browser CASE commit function is unavailable; CASE was not committed.');
        await syncCurrentCase();
        const caseDiagnostic = r877DiagnoseCaseReplacement(importedCase,browserBeforeSync);
        if(!caseDiagnostic.browserMatchesImported) throw new Error('Imported CASE source fields do not match the browser-owned CASE after commit.');
        if(!caseDiagnostic.parameterTranslationSuccess) throw new Error(window.currentCase?.debug_sync?.error || 'Browser CASE parameter translation did not validate.');
        const inspectorRefresh=await r880RefreshAndVerifyInspector(importedCase);
        const inspectorResult=inspectorRefresh.visibleNodesMatch
            ? 'PASS · all visible Inspector nodes match imported CASE'
            : inspectorRefresh.allNodesMatch
                ? 'PARTIAL · all Inspector nodes match, but no visible Inspector node was found'
                : 'FAIL · one or more Inspector nodes remain stale after refresh';
        const fieldDiff=caseDiagnostic.browserFieldDifferences;
        const fieldDiffLines=fieldDiff ? [
            'BROWSER CASE SOURCE-FIELD COMPARISON (imported CASE vs committed browser CASE)',
            `Fields only in imported CASE: ${fieldDiff.counts.onlyInImported}`,
            ...(fieldDiff.counts.onlyInImported ? [`  Examples: ${fieldDiff.samples.onlyInImported.join(', ')}${fieldDiff.counts.onlyInImported>fieldDiff.samples.onlyInImported.length?' …':''}`] : []),
            `Fields only in browser CASE: ${fieldDiff.counts.onlyOnServer}`,
            ...(fieldDiff.counts.onlyOnServer ? [`  Examples: ${fieldDiff.samples.onlyOnServer.join(', ')}${fieldDiff.counts.onlyOnServer>fieldDiff.samples.onlyOnServer.length?' …':''}`] : []),
            `Shared source fields with different values/types: ${fieldDiff.counts.valueDifferent}`,
            ...(fieldDiff.counts.valueDifferent ? [`  Examples: ${fieldDiff.samples.valueDifferent.join(', ')}${fieldDiff.counts.valueDifferent>fieldDiff.samples.valueDifferent.length?' …':''}`] : []),
            'Derived parameters/debug_sync are regenerated in browser JavaScript.'
        ] : ['BROWSER CASE SOURCE-FIELD COMPARISON: unavailable'+(caseDiagnostic.browserReadError?` (${caseDiagnostic.browserReadError})`:'')];
        const beforeDiff=caseDiagnostic.browserBeforeFieldDifferences;
        const beforeDiffLines=beforeDiff ? [
            'BROWSER CASE BEFORE COMMIT (imported CASE vs prior browser CASE)',
            `Fields only in imported CASE: ${beforeDiff.counts.onlyInImported}`,
            `Fields only in prior browser CASE: ${beforeDiff.counts.onlyOnServer}`,
            `Shared fields with different values/types: ${beforeDiff.counts.valueDifferent}`
        ] : ['No prior browser CASE snapshot was available.'];
        const traceLines=caseDiagnostic.valueTrace ? [
            '', 'R882 SELECTED FIELD VALUE TRACE (JSON values; <MISSING> means path absent)',
            ...caseDiagnostic.valueTrace.map(row=>`${row.path} | imported=${row.imported} | browser-before=${row.browserBefore} | browser-after=${row.browserAfter} | imported==before:${row.importedEqualsBefore?'YES':'NO'} | imported==after:${row.importedEqualsAfter?'YES':'NO'} | before==after:${row.beforeEqualsAfter?'YES':'NO'}`)
        ] : ['R882 selected value trace unavailable.'];
        if(report){
            report.textContent=[...r905RuntimeDiagnosticLines(),' ',(localRecovery ? `R1125A — LOCAL FULL-CASE RECOVERY` : `R1123 — CASE BUNDLE IMPORT + BROWSER COMMIT TRACE`),`Case: ${validated.manifest.caseName||importedCase.metadata?.case_name||'(unnamed)'}`,`Source: ${validated.manifest.exporterBuild||'unknown'} · ${validated.manifest.exportedAt||'timestamp unavailable'}`,`PASS · AP image + ${validated.observations.AP.annotations.length} annotations installed in live panel`,`PASS · LAT image + ${validated.observations.LAT.annotations.length} annotations installed in live panel`,`PASS · AP/LAT checksum identity verified`,`PASS · rollback checkpoints created before installation`,``,`CASE REPLACEMENT CHECKS`,`Browser CASE source fields match imported CASE: ${caseDiagnostic.browserMatchesImported?'YES':'NO'}`,`Browser parameter translation: ${caseDiagnostic.parameterTranslationSuccess?'PASS':'FAIL'}`,`` ,...beforeDiffLines,``,...fieldDiffLines,...traceLines,``,`Inspector shared refresh function available: ${inspectorRefresh.sharedRefreshAvailable?'YES':'NO'}`,`Inspector shared refresh error: ${inspectorRefresh.sharedRefreshError||'none'}`,`Inspector nodes before/after refresh: ${inspectorRefresh.nodeCountBefore}/${inspectorRefresh.nodeCountAfter}`,`Visible Inspector nodes: ${inspectorRefresh.visibleNodeCount}`,`Inspector nodes matching imported CASE: ${inspectorRefresh.matchingNodeCount}/${inspectorRefresh.nodeCountAfter}`,`Visible matching Inspector nodes: ${inspectorRefresh.visibleMatchingNodeCount}/${inspectorRefresh.visibleNodeCount}`,`Inspector result: ${inspectorResult}`,`Inspector scrollTop after import: ${inspectorRefresh.scrollTopAfterImport}`,`Browser CASE name: ${caseDiagnostic.browserCaseName}`,`Imported CASE name: ${caseDiagnostic.importedCaseName}`,``,`CASE COMMIT: window.currentCase is the sole active CASE authority. syncCurrentCase() performed browser-side parameter translation and JSON validation; durable WIP/recovery remains with IndexedDB or Supabase. Inspector refreshed in place; scroll reset requested for the imported CASE; if Patient is hidden, R880 repeats the reset after Patient becomes visible. Other workspace forms/planner controls are not rebuilt by this change.`,`Legacy permanent Save Case was not invoked.`].join('\n');
            report.dataset.status='IMPORTED';
        }
        setStatus(localRecovery ? `R1125A — LOCAL RECOVERY COMPLETE · ${validated.manifest.caseName||'Case'} · Browser CASE ${caseDiagnostic.browserMatchesImported?'VERIFIED':'MISMATCH'} · Inspector ${inspectorRefresh.visibleNodesMatch?'REFRESHED':'NEEDS REVIEW'}` : `R882 — IMPORT COMPLETE · ${validated.manifest.caseName||'Case'} · Browser CASE ${caseDiagnostic.browserMatchesImported?'VERIFIED':'MISMATCH'} · Inspector ${inspectorRefresh.visibleNodesMatch?'REFRESHED':'NEEDS REVIEW'}`);
        recoveryImportCommitted = true;
        if (typeof window.noteCaseCommitted === "function") window.noteCaseCommitted(localRecovery ? "Local full-case recovery completed" : "Portable ZIP import completed");
        return true;
    }catch(error){
        const rollbackErrors=[];
        const rollbackVerified=[];
        if(hadPreviousCase){
            window.currentCase=previousCaseSnapshot;
            try {
                if(typeof syncCurrentCase!=='function') throw new Error('Browser CASE commit function is unavailable');
                await syncCurrentCase();
                const restoredBrowser=JSON.parse(JSON.stringify(window.currentCase));
                const checkpointSource=r882WithoutDerivedCaseFields(previousCaseSnapshot);
                const browserSource=r882WithoutDerivedCaseFields(restoredBrowser);
                if(r877CanonicalJson(browserSource)!==r877CanonicalJson(checkpointSource)) {
                    const diff=r881CompareCaseFields(checkpointSource,browserSource,30);
                    const detail=[`checkpoint-only=${diff.counts.onlyInImported}`,`browser-only=${diff.counts.onlyOnServer}`,`different values/types=${diff.counts.valueDifferent}`,diff.samples.onlyInImported.length?`checkpoint-only examples: ${diff.samples.onlyInImported.join(', ')}`:'',diff.samples.onlyOnServer.length?`browser-only examples: ${diff.samples.onlyOnServer.join(', ')}`:'',diff.samples.valueDifferent.length?`different-value examples: ${diff.samples.valueDifferent.join(', ')}`:''].filter(Boolean).join('; ');
                    throw new Error('browser CASE source fields were not restored ('+detail+')');
                }
                if(!restoredBrowser.parameters || typeof restoredBrowser.parameters!=='object' || Array.isArray(restoredBrowser.parameters) || restoredBrowser.debug_sync?.success!==true) {
                    throw new Error(restoredBrowser.debug_sync?.error || 'browser CASE parameter translation did not validate');
                }
                rollbackVerified.push('CASE: previous browser-owned source fields restored; derived parameters regenerated and validated in JavaScript');
            }catch(e){rollbackErrors.push('CASE rollback verification: '+(e?.message||e));}
        }
        else { try { delete window.currentCase; rollbackVerified.push('CASE: no prior browser CASE existed; property removed'); } catch(e) { rollbackErrors.push('CASE rollback: '+(e?.message||e)); } }
        for(const view of ['LAT','AP']){
            if(!backup[view])continue;
            try{
                const verified=await r899VerifyRollbackRecord(view,backup[view],panels[view]);
                rollbackVerified.push(`${view}: live observation restored; ${verified.annotations===null?'annotation count unavailable':verified.annotations+' annotations'}; image SHA-256/length verified when bytes were present; no per-view persistence`);
            }catch(e){rollbackErrors.push(`${view} rollback: ${e?.message||e}`);}
        }
        const suffix=rollbackErrors.length?'\nROLLBACK NOT VERIFIED: '+rollbackErrors.join(' | '):'\nRollback verified: restored prior records or returned previously empty panels to empty state.';
        const verificationLines=rollbackVerified.length?'\nRollback read-back checks:\n'+rollbackVerified.join('\n'):'';
        const testBanner=options?.r899ForceFailureAfterAP===true?'\nR901 CONTROLLED FAILURE INJECTION: expected failure was deliberately triggered after AP install.':'';
        if(report){report.textContent=(localRecovery?'R1125A — LOCAL RECOVERY FAILED':(options?.r899ForceFailureAfterAP===true?'R901 — CONTROLLED ROLLBACK VERIFICATION':'R871 — IMPORT FAILED'))+'\n'+(error?.message||error)+testBanner+suffix+verificationLines+'\nReview the rollback status before continuing.'+'\nNo Flask CASE endpoint was used.';report.dataset.status=rollbackErrors.length?'FAIL':(options?.r899ForceFailureAfterAP===true?'ROLLBACK_TEST_PASS':'FAIL');}
        setStatus((localRecovery?'R1125A — LOCAL RECOVERY FAILED · ':(options?.r899ForceFailureAfterAP===true?'R901 — ROLLBACK VERIFICATION ':'R871 — IMPORT FAILED · '))+(error?.message||error)+(rollbackErrors.length?' · rollback requires review':(options?.r899ForceFailureAfterAP===true?' · rollback verified':' · rollback attempted')));
        return false;
    } finally {
        if (recoveryTransition && typeof window.endCaseTransition === "function") {
            window.endCaseTransition(recoveryTransition, {
                committed: recoveryImportCommitted,
                reason: recoveryImportCommitted ? (localRecovery ? "Local full-case recovery completed" : "Portable ZIP import completed") : (localRecovery ? "Local full-case recovery failed or rolled back" : "Portable ZIP import failed or rolled back")
            });
        }
    }
}
function r869AddImportControls(){
    // R885: Open Case is launched from Patient. This hidden-workspace handler remains
    // the shared validated import/rollback path; no duplicate visible X-ray button.
    const host=document.getElementById('xrayWipControls');
    if(!host) return;
    if(document.getElementById('r869ImportBundleButton')) return;
    const button=document.createElement('button');button.type='button';button.id='r869ImportBundleButton';button.textContent='Open Case (.zip)';button.style.display='none';
    const input=document.createElement('input');input.type='file';input.accept='.zip,application/zip,application/x-zip-compressed';input.id='r869ImportBundleFile';input.style.display='none';
    const handleFile=async(file, options={})=>{
        if(!file)return false;
        const confirmBeforeOpen = options?.confirmBeforeOpen !== false;
        button.disabled=true;
        const report=document.getElementById('r864BundleValidationReport');
        try{
            if(report)report.textContent='R885 — VALIDATING BEFORE IMPORT · No active data will be changed during validation…';
            const validated=await window.CaseFileService.archive.validateBundleFile(file);
            const importedCase = validated.caseData || {};
            const importedPatient = importedCase.patient || {};
            const importedMetadata = importedCase.metadata || {};
            const patientName = String(
                importedPatient.patient_name ||
                importedMetadata.patient_name ||
                importedCase.patient_name ||
                ''
            ).trim();
            const patientId = String(
                importedPatient.patient_id ||
                importedMetadata.patient_id ||
                importedCase.patient_id ||
                ''
            ).trim();
            const caseName = String(
                importedMetadata.case_name ||
                validated.manifest.caseName ||
                ''
            ).trim();
            const exportedAt = validated.manifest.exportedAt
                ? new Date(validated.manifest.exportedAt).toLocaleString()
                : 'Not recorded';
            const displayPatient = patientName || 'UnknownPatient';
            const displayCase = caseName || '(unnamed case)';
            if(report){report.textContent=[...r905RuntimeDiagnosticLines(),' ',...validated.lines,`\nIMPORT PREVIEW · ${displayPatient}`,`Patient ID: ${patientId||'(not recorded)'}`,`Case: ${displayCase}`,`Exported: ${exportedAt}`,`Selected file: ${file.name}`,`AP: ${validated.observations.AP.annotations.length} annotations · ${validated.manifest.images.find(x=>x.view==='AP').byteLength.toLocaleString()} image bytes`,`LAT: ${validated.observations.LAT.annotations.length} annotations · ${validated.manifest.images.find(x=>x.view==='LAT').byteLength.toLocaleString()} image bytes`,`CASE fields: ${Object.keys(validated.caseData).length}`,`\nValidation passed. Nothing has been installed yet.`].join('\n');report.dataset.status='PASS';}
            const summary=`Open this case?\n\nPatient: ${displayPatient}\nPatient ID: ${patientId||'(not recorded)'}\nCase: ${displayCase}\nExported: ${exportedAt}\nFile: ${file.name}\n\nThis replaces the active CASE and AP/LAT annotation workspace.\n\nAP: ${validated.observations.AP.annotations.length} annotations\nLAT: ${validated.observations.LAT.annotations.length} annotations\n\nPlease verify the patient and case before continuing.`;
            if(confirmBeforeOpen && !window.confirm(summary)){if(report)report.textContent+='\n\nIMPORT CANCELLED · Active CASE and displayed work unchanged.';if(report)report.dataset.status='CANCELLED';return false;}
            const ok=await r869InstallValidatedBundle(validated);
            return ok===true;
        }catch(error){
            if(report){report.textContent='R885 — IMPORT VALIDATION FAILED\n'+(error?.message||error)+'\n\nNo bundle installation was started.';report.dataset.status='FAIL';}
            setXrayWorkspaceStatus('R885 — IMPORT VALIDATION FAILED · '+(error?.message||error));
            return false;
        }finally{button.disabled=false;input.value='';}
    };
    input.addEventListener('change',()=>handleFile(input.files?.[0]));
    host.appendChild(button);host.appendChild(input);
    window.r885OpenCaseBundleFile=handleFile;
}

function initializeXrayPortableCaseControls(){
    // R1123: New Case rollback checkpoints are live-memory-only; per-view persistence is removed.
    // Portable CASE Open/Save and live import rollback APIs remain intact.
    r864AddValidationControls();
    r869AddImportControls();
    const exportButton = document.getElementById("xrayExportCaseBundleButton");
    if(exportButton && exportButton.dataset.r883Bound !== "1"){
        exportButton.addEventListener("click", exportCaseBundleFromWorkspace);
        exportButton.dataset.r883Bound = "1";
    }
}

/* =========================================================
   R200 — RECONSTRUCTION INPUT BOUNDARY
   ---------------------------------------------------------
   This is deliberately only an adapter.

   It does NOT call reconstruction mathematics yet.

   It takes the renderer-neutral semantic observation
   contract and stages it as reconstruction input.

   No VTK objects cross this boundary.
   ========================================================= */

function getCurrentV2XrayObservation(){

    const vtkWindow = getXrayVtkWindow();
    const observation =
        typeof vtkWindow.getXrayObservation === "function"
            ? vtkWindow.getXrayObservation()
            : vtkWindow.XrayObservation;

    if(!observation){
        throw new Error("R434 — no XrayObservation available from VTK.");
    }

    if(observation.version !== "xray-observation-v2"){
        throw new Error(
            "R434 — expected XrayObservation v2; received " +
            String(observation.version || "unknown") + "."
        );
    }

    return JSON.parse(JSON.stringify(observation));
}

function mergeV2XrayObservation(viewObservation){

    const view = viewObservation.images?.[0]?.view;

    if(view !== "AP" && view !== "LAT"){
        throw new Error("R434 — XrayObservation v2 must identify AP or LAT view.");
    }

    if(!window.xrayObservationV2Set){
        window.xrayObservationV2Set = {
            version: "xray-observation-set-v2",
            AP: null,
            LAT: null,
            provenance: {
                producer: "X-ray reconstruction workspace",
                contract: "renderer-neutral-semantic-v2"
            }
        };
    }

    window.xrayObservationV2Set[view] = viewObservation;

    return window.xrayObservationV2Set;
}

function stageXrayObservationsForReconstruction(){

    const status = document.getElementById("xrayReconstructionInputStatus");
    const output = document.getElementById("xrayReconstructionInput");

    try{
        const observation = getCurrentV2XrayObservation();
        const set = mergeV2XrayObservation(observation);

        window.xrayReconstructionInput = set;

        if(output){
            output.textContent = JSON.stringify(set, null, 2);
        }

        const haveAP = !!set.AP;
        const haveLAT = !!set.LAT;

        if(status){
            status.textContent =
                `R434 — XrayObservation v2 captured · AP ${haveAP ? "READY" : "missing"} · LAT ${haveLAT ? "READY" : "missing"}`;
        }

        return set;
    }
    catch(error){
        if(status) status.textContent = "R434 — FAIL — " + error.message;
        if(output) output.textContent = error.stack || error.message;
        return null;
    }
}


/* =========================================================
   RECONSTRUCTION INPUT / CASE HANDOFF
   ---------------------------------------------------------
   This workspace controller owns only the application boundary around
   the reconstruction engine:

       VTK observations
            ↓
       renderer-neutral observation contract
            ↓
       Reconstruction.reconstruct(input)
            ↓
       reconstructed result / CASE patch

   Reconstruction mathematics belongs in reconstruction.js.
   Synthetic regression construction belongs in
   reconstruction_synthetic_test.js.

   Historical R204 function names are retained only where needed for
   compatibility with existing workspace code. They are not current test
   identifiers or reconstruction algorithms.
   ========================================================= */

function formatReconstructionNumber(value, unit){
    /* R552 compatibility: a null metric means NOT EVALUATED, not numeric zero.
       This matters for projective strut DIR lines, which intentionally do not
       infer physical length from arbitrary AP/LAT annotation extents. */
    if(value === null || value === undefined || value === ""){
        return "n/a";
    }
    if(!Number.isFinite(Number(value))){
        return "n/a";
    }
    return Number(value).toExponential(6) +
           (unit ? " " + unit : "");
}


function runXrayReconstructionInput(input, sourceLabel){

    const status =
        document.getElementById(
            "xrayReconstructionApiStatus"
        );

    const output =
        document.getElementById(
            "xrayReconstructionApiOutput"
        );

    const inputOutput =
        document.getElementById(
            "xrayReconstructionInput"
        );

    try{

        if(
            !window.Reconstruction ||
            typeof window.Reconstruction.reconstruct !==
                "function"
        ){
            throw new Error(
                "window.Reconstruction.reconstruct() is unavailable."
            );
        }

        if(!input){
            throw new Error(
                "No reconstruction input was supplied."
            );
        }

        const result =
            window.Reconstruction.reconstruct(
                input
            );

        window.xrayReconstructionInput =
            input;

        window.xrayReconstructionResult =
            result;

        if(inputOutput){
            inputOutput.textContent =
                JSON.stringify(
                    input,
                    null,
                    2
                );
        }

        const d = result.diagnostics || {};
        const c = result.clinical || {};

        let text =
            "RECONSTRUCTION ENGINE RESULT\n" +
            "==============================\n\n";

        text +=
            "SOURCE\n" +
            "  " +
            (sourceLabel || "renderer-neutral observation input") +
            "\n\n";

        const displayCalAP = input.calibration?.AP || input.AP?.calibration || [];
        const displayCalLAT = input.calibration?.LAT || input.LAT?.calibration || [];

        text +=
            "INPUT CONTRACT\n" +
            "  Schema                 : " +
            (result.schema || input.version) +
            "\n" +
            "  AP calibration        : " +
            displayCalAP.length +
            " landmarks\n" +
            "  LAT calibration       : " +
            displayCalLAT.length +
            " landmarks\n" +
            "  Struts                : " +
            (input.struts?.length || 0) +
            "\n" +
            "  Proximal anatomy     : PFCL projective axis / PRP reference point\n" +
            "  Distal anatomy       : DFCL projective axis / DRP reference point\n" +
            "  Orientation reference: present\n" +
            "  Clinical axial input  : " +
            input.manualClinical?.axialRotationDeg +
            " deg\n\n";

        const cameraRms = d.cameraRmsPx;
        const cameraRmsText = (typeof cameraRms === "number" && Number.isFinite(cameraRms))
            ? "  Camera RMS (combined) : " + formatReconstructionNumber(cameraRms,"px") + "\n"
            : "  AP camera RMS         : " + formatReconstructionNumber(cameraRms?.AP,"px") + "\n" +
              "  LAT camera RMS        : " + formatReconstructionNumber(cameraRms?.LAT,"px") + "\n";
        const coordinateNormalization = d.coordinateNormalization || {};
        const normalizationText = "  Coordinate normalization: AP=" +
            (coordinateNormalization.AP?.applied === true ? "applied" : "not supplied") +
            "; LAT=" + (coordinateNormalization.LAT?.applied === true ? "applied" : "not supplied") + "\n";

        text +=
            "RECONSTRUCTION DIAGNOSTICS\n" +
            cameraRmsText + normalizationText +
            "  Frame registration    : " +
            formatReconstructionNumber(d.rigidFrameRmsMm,"mm") +
            "\n" +
            "  Strut max length      : " +
            formatReconstructionNumber(d.strutMaxLengthResidualMm,"mm") +
            "\n" +
            "  Anatomy max reproj.   : " +
            formatReconstructionNumber(d.anatomyMaxReprojectionPx,"px") +
            "\n" +
            "  PFCL axis residual    : " +
            formatReconstructionNumber(d.axisErrorsDeg?.PFCL,"deg") +
            "\n" +
            "  DFCL axis residual    : " +
            formatReconstructionNumber(d.axisErrorsDeg?.DFCL,"deg") +
            "\n" +
            "  Axial rotation        : manual input; NOT inferred\n\n";

        text +=
            "MOUNTING OUTPUT\n" +
            JSON.stringify(
                c.mounting || {},
                null,
                2
            ) +
            "\n\n";

        text +=
            "DEFORMITY OUTPUT\n" +
            JSON.stringify(
                c.deformity || {},
                null,
                2
            ) +
            "\n\n";

        text +=
            "CASE HANDOFF\n" +
            "  Mounting patch       : " +
            (result.casePatch?.mounting ? "YES" : "NO") +
            "\n" +
            "  Deformity patch      : " +
            (result.casePatch?.deformity ? "YES" : "NO") +
            "\n" +
            "  Reconstruction state : " +
            (result.casePatch?.reconstruction?.retained ? "RETAINED" : "NO") +
            "\n";

        if(status){
            status.textContent =
                "RECONSTRUCTION: " +
                (result.valid === true || result.pass === true ? "VALID" : "INVALID");
        }

        if(output){
            output.textContent = text;
        }

        return result;

    }
    catch(error){

        if(status){
            status.textContent =
                "RECONSTRUCTION: FAIL";
        }

        if(output){
            output.textContent =
                "RECONSTRUCTION ERROR\n\n" +
                String(
                    error?.message ||
                    error
                );
        }

        return null;
    }
}


/*
   CASE application helper.

   The historical function name is retained for compatibility. It is not a
   synthetic test and it does not run reconstruction mathematics itself.
   It only applies the already-produced reconstruction casePatch.
*/
function prepareClinicalCaseForHandoff(casePatch){
    /* Preserve the exact reconstructed clinical values.
       No rounding is applied at CASE handoff. */
    return structuredClone(casePatch);
}

/*
   R568 — CASE adapter for a valid sparse Way 2 result.
   reconstruction.js deliberately returns casePatch:null for the sparse
   observation schema. This UI boundary may create a CASE patch only after a
   complete clinical solve, while preserving fields that X-rays cannot infer
   (notably manual axial bone rotation) from the existing CASE.
   Reconstruction mathematics and the sparse engine contract remain unchanged.
*/
function buildWay2CasePatchFromSparseResult(result, currentCase){
    if(!result || result.schema !== "XraySparseObservationInput"){
        throw new Error("Way 2 CASE adapter received an unexpected result schema.");
    }
    if(result.valid !== true || result.diagnostics?.clinicalStatus !== "reconstructed"){
        const why = result.diagnostics?.reason || result.diagnostics?.clinicalStatus || result.stage || "incomplete result";
        throw new Error("Way 2 reconstruction is not eligible for CASE apply: " + why + ". Review missing observations/diagnostics first.");
    }
    const clinical = result.clinical;
    if(!clinical?.mounting || !clinical?.deformity){
        throw new Error("Way 2 result does not contain complete mounting and deformity outputs.");
    }
    const resultLaterality = String(result.diagnostics?.clinicalConversion?.laterality || "").toLowerCase();
    const currentLaterality = String(
        currentCase?.laterality ?? currentCase?.patient?.laterality ?? currentCase?.metadata?.laterality ?? ""
    ).toLowerCase();
    if(resultLaterality && currentLaterality && resultLaterality !== currentLaterality){
        throw new Error(`Way 2 laterality (${resultLaterality}) does not match current CASE (${currentLaterality}). CASE was not changed.`);
    }
    const finiteClinical = value => {
        const raw = value && typeof value === "object" && "value" in value ? value.value : value;
        return raw !== null && raw !== undefined && raw !== "" && Number.isFinite(Number(raw));
    };
    const requiredMounting = ["ap_offset","lat_offset","axial_offset","ap_tilt","lat_tilt","master_rotation"];
    const requiredDeformity = ["ap_translation","lat_translation","bone_length","ap_angulation","lat_angulation"];
    const missing = [
        ...requiredMounting.filter(key => !finiteClinical(clinical.mounting[key])).map(key => "mounting." + key),
        ...requiredDeformity.filter(key => !finiteClinical(clinical.deformity[key])).map(key => "deformity." + key)
    ];
    if(missing.length){
        throw new Error("Way 2 clinical output is incomplete: " + missing.join(", ") + ". CASE was not changed.");
    }

    const existingMounting = currentCase?.mounting || {};
    const existingDeformity = currentCase?.deformity || {};
    const mounting = structuredClone(clinical.mounting);
    const deformity = structuredClone(clinical.deformity);

    // R804 policy: Master Tab rotation is an engine-reconstructed mounting
    // quantity, never a surgeon annotation or a manual CASE fallback. Require
    // a finite hardware-derived result and apply it even if an older CASE has
    // a manually sourced Master Tab value. Bone axial rotation is the sole
    // rotation field retained manually below.
    const masterResult = clinical.mounting.master_rotation;
    const masterSource = String(masterResult?.source || "");
    if(!finiteClinical(masterResult) || masterSource !== "hardware-derived-ring-pose"){
        throw new Error("Automatic Master Tab reconstruction is unavailable or not hardware-derived. CASE was not changed.");
    }

    // LOC is optional; preserve the existing CASE LOC when it was not reconstructed.
    if(!deformity.loc?.enabled && existingDeformity.loc !== undefined){
        deformity.loc = structuredClone(existingDeformity.loc);
    }

    // Axial bone rotation cannot be inferred from a centerline. Preserve the
    // manual CASE value; if no valid manual value exists, fail safely.
    const manualBoneRotation = existingDeformity.bone_rotation;
    if(!manualBoneRotation || !finiteClinical(manualBoneRotation)){
        throw new Error("Manual bone rotation is unavailable in the current CASE. It cannot be inferred from X-rays; enter/preserve it before applying Way 2.");
    }
    deformity.bone_rotation = structuredClone(manualBoneRotation);

    const priorReconstruction = currentCase?.reconstruction || {};
    const provenanceFor = (value, fallback) => {
        if(!finiteClinical(value)) return fallback || "Undetermined";
        return String(value?.source || "").toLowerCase() === "manual" ? "Manual" : "Reconstructed";
    };
    const mountingProvenance = {};
    for(const [key,value] of Object.entries(mounting)){
        mountingProvenance[key] = key === "master_rotation"
            ? "Reconstructed"
            : provenanceFor(value, existingMounting[key] !== undefined ? "Manual" : "Undetermined");
    }
    const deformityProvenance = {};
    for(const [key,value] of Object.entries(deformity)){
        if(key === "bone_rotation") deformityProvenance[key] = "Manual";
        else if(key === "loc" && !value?.enabled && existingDeformity.loc !== undefined) deformityProvenance[key] = "Manual";
        else deformityProvenance[key] = provenanceFor(value, existingDeformity[key] !== undefined ? "Manual" : "Undetermined");
    }
    const reconstruction = {
        ...structuredClone(priorReconstruction),
        version: window.Reconstruction?.VERSION || priorReconstruction.version || "sparse-xray-reconstruction",
        retained: true,
        source: "R804 automatic Master Tab candidate · production AP/LAT observations",
        frameResidualMm: result.diagnostics?.proximalRegistrationRmsMm ?? priorReconstruction.frameResidualMm ?? null,
        fieldProvenance: {mounting:mountingProvenance,deformity:deformityProvenance},
        manualClinical: structuredClone(priorReconstruction.manualClinical || {source:"preserved-current-CASE"})
    };
    return {mounting,deformity,reconstruction};
}

async function applyR204ReconstructionToCase(){

    const status =
        document.getElementById(
            "xrayReconstructionApiStatus"
        );

    const humanDownloadButton =
        document.getElementById(
            "downloadReconstructionSyntheticTestHumanResultButton"
        );

    // R568: the unified R257 dialog also runs an extent/noise sparse test.
    // That report result is not necessarily a CASE-applicable clinical result.
    // Resolve an actual casePatch instead of letting the diagnostic result
    // overwrite/obscure the R257 clinical or Way 2 result.
    const syntheticLaterality =
        String(window.xrayReconstructionSyntheticTestConfig?.laterality || "right").toLowerCase() === "left"
            ? "left" : "right";
    // R568: when R540 has just run, the production and Way 2 result slots
    // point to the exact same sparse result. Treat it as the latest source and
    // do not fall back to an older synthetic result if Way 2 is incomplete.
    const latestWay2Result = Boolean(
        window.xrayReconstructionResult &&
        window.xrayReconstructionResult === window.xrayWay2ReconstructionResult
    );
    const candidates = latestWay2Result
        ? [window.xrayWay2ReconstructionResult]
        : [
            window.xrayReconstructionResult,
            window.xrayReconstructionSyntheticTestResult?.results?.[syntheticLaterality],
            window.xrayWay2ReconstructionResult
        ];
    const result = candidates.find(candidate => {
        if(!candidate) return false;
        const hasPatch = candidate.casePatch && candidate.casePatch.mounting && candidate.casePatch.deformity && candidate.casePatch.reconstruction;
        const isEligibleSparseWay2 = latestWay2Result && candidate.schema === "XraySparseObservationInput";
        return Boolean(hasPatch || isEligibleSparseWay2);
    }) || null;

    if(!result){

        if(status){
            status.textContent =
                "CASE APPLY: FAIL — no eligible reconstruction result. Run the intended workflow and inspect its result before applying.";
        }

        return null;
    }

    try{

        if(typeof ensureCurrentCase === "function"){
            await ensureCurrentCase();
        }

        if(!window.currentCase){
            throw new Error(
                "window.currentCase is unavailable."
            );
        }

        // R568: sparse Way 2 intentionally has no engine-owned casePatch.
        // Build the application patch at the UI boundary only after validating
        // completeness and preserving manual/unobserved values from current CASE.
        const rawCasePatch = (!result.casePatch && latestWay2Result)
            ? buildWay2CasePatchFromSparseResult(result, window.currentCase)
            : result.casePatch;
        if(!rawCasePatch || !rawCasePatch.mounting || !rawCasePatch.deformity || !rawCasePatch.reconstruction){
            throw new Error("The latest reconstruction result has no complete CASE patch. CASE was not changed.");
        }
        const casePatch=prepareClinicalCaseForHandoff(rawCasePatch);

        window.currentCase.mounting =
            structuredClone(
                casePatch.mounting
            );

        window.currentCase.deformity =
            structuredClone(
                casePatch.deformity
            );

        window.currentCase.reconstruction =
            structuredClone(
                casePatch.reconstruction
            );

        if(typeof syncCurrentCase === "function"){
            await syncCurrentCase();
        }

        if(typeof updateXrayCaseStatus === "function"){
            updateXrayCaseStatus();
        }

        // Refresh the visible workspace controls from the newly applied CASE.
        // The CASE is authoritative; do not leave stale form values on screen.
        if(typeof populateMounting === "function"){
            await populateMounting();
        }
        if(
            typeof populateDeformity === "function" &&
            document.getElementById("locSection")
        ){
            await populateDeformity();
        }

        if(status){
            status.textContent =
                "CASE APPLY: PASS — mounting + deformity + reconstruction updated; reconstructed clinical precision preserved.";
        }

        return window.currentCase;

    }
    catch(error){

        if(status){
            status.textContent =
                "CASE APPLY: FAIL — " +
                String(
                    error?.message ||
                    error
                );
        }

        return null;
    }
}

/*
   Reconstruction CASE integration boundary.

   The historical object name is retained for compatibility with any older
   workspace code, but reconstruction itself is no longer coupled to an R204
   test runner.  The production reconstruction API lives in reconstruction.js.
*/
window.XrayR204Reconstruction = {
    runInput:runXrayReconstructionInput,
    applyToCase:applyR204ReconstructionToCase,
    getResult:function(){
        return window.xrayReconstructionResult || null;
    }
};


/* =========================================================
   CURRENT SYNTHETIC REGRESSION TEST RUNNER
   ---------------------------------------------------------
   R248 is the current reconstruction regression test.

   Architecture:
       X-ray workspace button
            -> this generic caller
            -> window.ReconstructionSyntheticTest[testFunctionName]
            -> shared production window.Reconstruction.reconstruct() entry point

   This file deliberately does NOT contain reconstruction mathematics or
   synthetic truth.  Those belong to reconstruction.js and
   reconstruction_synthetic_test.js respectively.

   The runner stores both report forms:
     - JSON: complete machine-readable regression result
     - human: concise side-by-side engineering report
   ========================================================= */
/* R456 — R257 synthetic dispatcher uses the actual exported API name. */
function runXraySyntheticReconstructionTest(testFunctionName, button, testConfig=null, outputMode="same"){

    const status =
        document.getElementById("xrayReconstructionApiStatus");

    const output =
        document.getElementById("xrayReconstructionApiOutput");

    try{

        if(
            !window.ReconstructionSyntheticTest ||
            typeof window.ReconstructionSyntheticTest[testFunctionName] !==
                "function"
        ){
            throw new Error(
                "Synthetic reconstruction test is unavailable: " +
                testFunctionName
            );
        }

        if(status){
            status.textContent =
                "RUNNING — " + testFunctionName;
        }

        const result =
            window.ReconstructionSyntheticTest[testFunctionName](testConfig || undefined);

        window.xrayReconstructionSyntheticTestResult = result;
        if(testFunctionName === "runR257ClinicalRoundTripTest"){
            window.xrayReconstructionSyntheticTestConfig = structuredClone(testConfig || {});
        }

        /*
           A synthetic regression run is also a valid reconstruction source
           for the CASE handoff test.  Use the RIGHT synthetic reconstruction
           as the production-style result so Apply Reconstructed CASE works
           without requiring real X-ray annotations first.
        */
        if(
            result &&
            result.results &&
            window.ReconstructionSyntheticTest &&
            typeof window.ReconstructionSyntheticTest.buildR213GeometricCaseInput === "function"
        ){
            const selectedLaterality =
                testConfig?.laterality === "left" ? "left" : "right";
            const syntheticInput =
                window.ReconstructionSyntheticTest.buildR213GeometricCaseInput(testConfig || undefined);
            syntheticInput.laterality = selectedLaterality;
            // R567: R257 is a synthetic regression workflow, not the current
            // production VTK input. Keep its generated input in a separate slot
            // so Call Reconstruction Engine cannot accidentally reuse test data.
            if(testFunctionName === "runR257ClinicalRoundTripTest"){
                window.xraySyntheticReconstructionInput = syntheticInput;
            } else {
                window.xrayReconstructionInput = syntheticInput;
            }
            // CASE handoff may explicitly use the clinical round-trip result.
            // Keep the selected-laterality result, including its casePatch.
            window.xrayReconstructionResult = result.results[selectedLaterality];
        }

        const jsonText =
            typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2);

        /* R457 — use the actual R257 human-report export name. */
        const humanFormatter =
            window.ReconstructionSyntheticTest
                .formatR257HumanReadableReport ||
            window.ReconstructionSyntheticTest
                .formatHumanReadableReport;

        let humanText =
            typeof humanFormatter === "function"
                ? humanFormatter(result)
                : jsonText;

        if(result.zeroDirectionRegression){
            humanText +=
                "\n\nZERO INPUT NUMERICAL STABILITY REGRESSION\n" +
                "  Result: " +
                result.zeroDirectionRegression.status +
                "\n  All zero-input clinical outputs finite: " +
                (result.zeroDirectionRegression.pass ? "PASS" : "FAIL") +
                "\n";
        }

        window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_RESULT__ =
            jsonText;

        window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_HUMAN_RESULT__ =
            humanText;

        /*
           The human report is the default visible report because it is the
           report intended for engineering review.  The complete JSON remains
           available through the stored result above and its download action.
        */
        if(output){
            // Replace the text node explicitly so the browser repaints the
            // newly generated report even when the output box is reused.
            output.textContent = "";
            void output.offsetHeight;
            output.textContent = humanText;
        }

        const downloadButton =
            document.getElementById(
                "downloadReconstructionSyntheticTestResultButton"
            );

        if(downloadButton){
            downloadButton.disabled = false;
        }

        const humanDownloadButton =
            document.getElementById(
                "downloadReconstructionSyntheticTestHumanResultButton"
            );

        if(humanDownloadButton){
            humanDownloadButton.disabled = false;
        }

        if(status){
            status.textContent =
                result && result.status
                    ? result.status
                    : "COMPLETE — " + testFunctionName;
        }

        return result;

    }catch(error){

        const errorText =
            "SYNTHETIC RECONSTRUCTION TEST ERROR\n\n" +
            String(
                error?.stack ||
                error?.message ||
                error
            );

        if(status){
            status.textContent =
                "TEST FAIL — " + testFunctionName;
        }

        if(output){
            output.textContent = errorText;
        }

        window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_RESULT__ =
            errorText;

        window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_HUMAN_RESULT__ =
            errorText;

        const downloadButton =
            document.getElementById(
                "downloadReconstructionSyntheticTestResultButton"
            );

        if(downloadButton){
            downloadButton.disabled = false;
        }

        const humanDownloadButton =
            document.getElementById(
                "downloadReconstructionSyntheticTestHumanResultButton"
            );

        if(humanDownloadButton){
            humanDownloadButton.disabled = false;
        }

        return null;
    }
}

/*
   R257 interactive synthetic-test controller.
   Clinical inputs are magnitude + explicit clinical direction. No clinical
   angle/translation field uses a +/- sign convention.
*/
function syntheticClinicalField(id,label,value,unit,directionName,directionValue,dirA,dirB){
    const radioName=`${id}Direction`;
    const current=String(directionValue||"").toLowerCase();
    const checkedA=current===String(dirA).toLowerCase()?' checked':'';
    const checkedB=current===String(dirB).toLowerCase()?' checked':'';
    return `
        <div style="display:grid;grid-template-columns:145px 100px 170px;gap:7px;align-items:center;margin:3px 0;min-height:24px;">
            <span>${label}</span>
            <span style="display:flex;align-items:center;gap:5px;white-space:nowrap;">
                <input id="${id}" type="number" value="${Number(value)}" step="0.1" style="width:66px;box-sizing:border-box;">
                <span style="font-size:11px;color:#666;">${unit}</span>
            </span>
            <span style="display:grid;grid-template-columns:1fr 1fr;column-gap:4px;align-items:center;white-space:nowrap;font-size:12px;">
                <label><input type="radio" name="${radioName}" value="${dirA}"${checkedA}> ${dirA}</label>
                <label><input type="radio" name="${radioName}" value="${dirB}"${checkedB}> ${dirB}</label>
            </span>
        </div>`;
}
function syntheticPlainNumberField(id,label,value,unit,min=null,max=null,step="0.1"){
    const minAttr=min===null?"":` min="${min}"`,maxAttr=max===null?"":` max="${max}"`;
    return `
        <div style="display:grid;grid-template-columns:145px 100px 170px;gap:7px;align-items:center;margin:3px 0;min-height:24px;">
            <span>${label}</span><span style="display:flex;align-items:center;gap:5px;white-space:nowrap;"><input id="${id}" type="number" value="${Number(value)}"${minAttr}${maxAttr} step="${step}" style="width:66px;box-sizing:border-box;"><span style="font-size:11px;color:#666;">${unit}</span></span><span></span>
        </div>`;
}
function syntheticDirectionValue(id,defaultValue,root=document){
    const fieldId=id.startsWith("syn") ? id : `syn${id.charAt(0).toUpperCase()}${id.slice(1)}`;
    const el=root.querySelector(`input[name="${fieldId}Direction"]:checked`);
    return el ? el.value : defaultValue;
}
function updateSyntheticRunButtonLabels(laterality){
    const side=laterality==="left"?"LEFT":"RIGHT";
    const runButton=document.getElementById("synRun");
    if(runButton) runButton.textContent=`Run ${side}`;
}
function openSyntheticReconstructionDialog(button){
    if(document.getElementById("xraySyntheticReconstructionDialog")) return;
    const defaults=window.ReconstructionSyntheticTest&&typeof window.ReconstructionSyntheticTest.getDefaultSyntheticTestConfig==="function"
        ? window.ReconstructionSyntheticTest.getDefaultSyntheticTestConfig() : null;
    if(!defaults){alert("Synthetic reconstruction configuration is unavailable.");return;}

    const overlay=document.createElement("div");
    overlay.id="xraySyntheticReconstructionDialog";
    overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;";
    const panel=document.createElement("div");
    panel.style.cssText="background:#fff;color:#111;width:min(560px,96vw);max-height:94vh;overflow:auto;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.3);padding:12px 14px;font-family:system-ui,sans-serif;font-size:13px;";
    const sec=t=>`<div style="font-weight:700;margin:8px 0 4px;border-bottom:1px solid #ddd;padding-bottom:2px;">${t}</div>`;
    panel.innerHTML=`
        <div style="font-size:17px;font-weight:700;">R639 — Sparse Reconstruction Accuracy Test</div>
        <div style="font-size:11px;color:#555;margin:2px 0 7px;">Clinical inputs use magnitude + direction. The builder converts them to mathematical geometry.</div>
        <div style="margin:5px 0 7px;">
            <b>Input laterality:</b>
            <label style="margin-left:10px;"><input type="radio" name="synLaterality" value="right" checked> Right</label>
            <label style="margin-left:10px;"><input type="radio" name="synLaterality" value="left"> Left</label>
        </div>
        ${sec("Mounting")}
        ${syntheticClinicalField("synMountAp","AP offset",defaults.mounting.ap_offset,"mm","mountAp",defaults.mounting.ap_offset_direction,"Medial","Lateral")}
        ${syntheticClinicalField("synMountLat","LAT offset",defaults.mounting.lat_offset,"mm","mountLat",defaults.mounting.lat_offset_direction,"Anterior","Posterior")}
        ${syntheticClinicalField("synMountAxial","Axial offset",defaults.mounting.axial_offset,"mm","mountAxial",defaults.mounting.axial_offset_direction,"Proximal","Distal")}
        ${syntheticClinicalField("synMountApTilt","AP tilt",defaults.mounting.ap_tilt,"deg","mountApTilt",defaults.mounting.ap_tilt_direction,"Proximal","Distal")}
        ${syntheticClinicalField("synMountLatTilt","LAT tilt",defaults.mounting.lat_tilt,"deg","mountLatTilt",defaults.mounting.lat_tilt_direction,"Proximal","Distal")}
        ${syntheticClinicalField("synMountMaster","Master rotation",defaults.mounting.master_rotation,"deg","mountMaster",defaults.mounting.master_rotation_direction,"Internal","External")}
        ${sec("Deformity")}
        ${syntheticClinicalField("synDefAp","AP translation",defaults.deformity.ap_translation,"mm","defAp",defaults.deformity.ap_translation_direction,"Medial","Lateral")}
        ${syntheticClinicalField("synDefLat","LAT translation",defaults.deformity.lat_translation,"mm","defLat",defaults.deformity.lat_translation_direction,"Anterior","Posterior")}
        ${syntheticClinicalField("synDefLength","Bone length",defaults.deformity.bone_length,"mm","defLength",defaults.deformity.bone_length_direction,"Short","Long")}
        ${syntheticClinicalField("synDefApAng","AP angulation",defaults.deformity.ap_angulation,"deg","defApAng",defaults.deformity.ap_angulation_direction,"Valgus","Varus")}
        ${syntheticClinicalField("synDefLatAng","LAT angulation",defaults.deformity.lat_angulation,"deg","defLatAng",defaults.deformity.lat_angulation_direction,"Anterior","Posterior")}
        ${syntheticClinicalField("synDefRotation","Bone rotation",defaults.deformity.bone_rotation,"deg","defRotation",defaults.deformity.bone_rotation_direction,"Internal","External")}
        ${sec("Imaging")}
        ${syntheticPlainNumberField("synLatPlane","LAT camera yaw around Z",defaults.imaging.latPlaneAngleDeg,"deg",1,180,"1")}
        ${syntheticPlainNumberField("synApElevation","AP shooting elevation / pitch",defaults.imaging.apElevationDeg ?? 0,"deg",-45,45,"1")}
        ${syntheticPlainNumberField("synLatElevation","LAT shooting elevation / pitch",defaults.imaging.latElevationDeg ?? 0,"deg",-45,45,"1")}
        ${syntheticPlainNumberField("synPixelSpacing","DICOM pixel spacing (mm/pixel)",defaults.imaging.pixelSpacingMmPerPixel ?? 1,"mm/pixel",0.05,5,"0.05")}
        <div style="font-size:11px;color:#555;margin:3px 0 7px;">AP and LAT elevation are source-ray pitch angles: positive = ray points upward (+Z); negative = ray points downward (−Z). Zero elevation preserves the existing horizontal/edge-on baseline. Pixel spacing is written to DICOM metadata; it does not rescale the projected synthetic pixels.</div>
        ${sec("R639 — R257 round-trip + sparse truth/extent validation")}
        <div style="font-size:11px;color:#555;margin:2px 0 6px;">The single Run button below runs the original clinical round-trip and then the sparse engine with these observation settings. Extents change drawn image segments, not physical bone or strut lengths.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;align-items:center;margin:4px 0;">
          <label style="grid-column:1 / -1;"><input id="synUseLineExtent" type="checkbox" checked> Use different AP/LAT line extents (recommended default)</label>
          <label style="grid-column:1 / -1;"><input id="synInjectNoise" type="checkbox"> Inject Gaussian pixel noise</label>
          <label for="synNoiseSigma">Noise σ (pixels)</label><input id="synNoiseSigma" type="number" min="0" max="5" step="0.25" value="0.5" disabled style="width:100%;box-sizing:border-box;">
          <label for="synNoiseSeed">Noise seed</label><input id="synNoiseSeed" type="number" step="1" value="554" disabled style="width:100%;box-sizing:border-box;">
          <label for="synNoiseTargets">Apply noise to</label><select id="synNoiseTargets" disabled><option value="all">All points and lines</option><option value="lines">Lines only</option><option value="points">Points only</option></select>
        </div>
        ${sec("LOC")}
        <div style="margin:3px 0 5px;"><label><input id="synLocEnabled" type="checkbox" ${defaults.loc.enabled?"checked":""}> Enabled</label></div>
        ${syntheticClinicalField("synLocAp","LOC AP",defaults.loc.ap,"mm","locAp",defaults.loc.ap_direction || "Medial","Medial","Lateral")}
        ${syntheticClinicalField("synLocLat","LOC LAT",defaults.loc.lat,"mm","locLat",defaults.loc.lat_direction || "Posterior","Anterior","Posterior")}
        ${syntheticClinicalField("synLocAxial","LOC axial",defaults.loc.axial,"mm","locAxial",defaults.loc.axial_direction || "Proximal","Proximal","Distal")}
        <div style="border:1px solid #9bb7d3;background:#f3f8fd;border-radius:6px;padding:8px;margin-top:10px;">
          <div style="font-weight:700;margin-bottom:4px;">R639 — Synthetic AP/LAT DICOM projection</div>
          <div style="font-size:11px;color:#444;margin-bottom:6px;">Uses the clinical settings above. Extent variation and injected noise are disabled for these files. Generates DICOM files and loads them into the small AP/LAT VTK panels.</div>
          <button type="button" id="synGenerateDicomButton" style="font-weight:700;width:100%;">Generate AP + LAT DICOM and Load Small Panels</button>
          <div id="synGenerateDicomStatus" role="status" style="font-size:11px;white-space:pre-wrap;margin-top:6px;">Not generated</div>
          <div id="synGenerateDicomLinks" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:6px;margin-top:10px;">
            <button type="button" id="synResetDefaults">Reset defaults</button>
            <span style="flex:1"></span>
            <button type="button" id="synCancel">Cancel</button>
            <button type="button" id="synRun" style="font-weight:700;">Run RIGHT</button>
        </div>`;
    overlay.appendChild(panel);document.body.appendChild(overlay);

    const setVal=(id,v)=>{const e=overlay.querySelector(`#${id}`);if(e)e.value=v;};
    const R257_UI_DEFAULTS={
        laterality:"right",
        mountAp:"medial",mountLat:"posterior",mountAxial:"proximal",mountApTilt:"proximal",mountLatTilt:"distal",mountMaster:"external",
        defAp:"medial",defLat:"anterior",defLength:"short",defApAng:"valgus",defLatAng:"anterior",defRotation:"internal",
        locAp:"medial",locLat:"posterior",locAxial:"proximal"
    };
    const setDir=(id,v)=>{
        const fieldId=id.startsWith("syn") ? id : `syn${id.charAt(0).toUpperCase()}${id.slice(1)}`;
        const radios=Array.from(overlay.querySelectorAll(`input[name="${fieldId}Direction"]`));
        radios.forEach(r=>{r.checked=false;});
        const wanted=String(v||"").trim().toLowerCase();
        const match=radios.find(r=>String(r.value||"").trim().toLowerCase()===wanted);
        if(match){match.click();match.checked=true;}
    };
    const reset=()=>{
        // R257: UI defaults are owned here. Reset is independent of the synthetic-test module.
        const lateralityRadios=Array.from(overlay.querySelectorAll('input[name="synLaterality"]'));
        lateralityRadios.forEach(r=>{r.checked=false;});
        const laterality=lateralityRadios.find(r=>String(r.value||"").toLowerCase()===R257_UI_DEFAULTS.laterality);
        if(laterality){laterality.click();laterality.checked=true;}
        setVal("synMountAp",5.0);setDir("mountAp",R257_UI_DEFAULTS.mountAp);
        setVal("synMountLat",45.0);setDir("mountLat",R257_UI_DEFAULTS.mountLat);
        setVal("synMountAxial",46.0);setDir("mountAxial",R257_UI_DEFAULTS.mountAxial);
        setVal("synMountApTilt",1.0);setDir("mountApTilt",R257_UI_DEFAULTS.mountApTilt);
        setVal("synMountLatTilt",11.0);setDir("mountLatTilt",R257_UI_DEFAULTS.mountLatTilt);
        setVal("synMountMaster",2.0);setDir("mountMaster",R257_UI_DEFAULTS.mountMaster);
        setVal("synDefAp",22.0);setDir("defAp",R257_UI_DEFAULTS.defAp);
        setVal("synDefLat",1.0);setDir("defLat",R257_UI_DEFAULTS.defLat);
        setVal("synDefLength",2.0);setDir("defLength",R257_UI_DEFAULTS.defLength);
        setVal("synDefApAng",6.0);setDir("defApAng",R257_UI_DEFAULTS.defApAng);
        setVal("synDefLatAng",14.0);setDir("defLatAng",R257_UI_DEFAULTS.defLatAng);
        setVal("synDefRotation",5.0);setDir("defRotation",R257_UI_DEFAULTS.defRotation);
        setVal("synLatPlane",90.0);setVal("synLatElevation",0.0);setVal("synPixelSpacing",1.0);
        setVal("synLocAp",12.0);setDir("locAp",R257_UI_DEFAULTS.locAp);
        setVal("synLocLat",8.0);setDir("locLat",R257_UI_DEFAULTS.locLat);
        setVal("synLocAxial",25.0);setDir("locAxial",R257_UI_DEFAULTS.locAxial);
        const locEnabled=overlay.querySelector("#synLocEnabled");if(locEnabled)locEnabled.checked=true;
        updateSyntheticRunButtonLabels("right");
    };
    overlay.querySelectorAll('input[name="synLaterality"]').forEach(r=>r.addEventListener("change",()=>updateSyntheticRunButtonLabels(r.value)));
    updateSyntheticRunButtonLabels("right");
    document.getElementById("synResetDefaults").onclick=()=>{ reset(); };
    // R257 reset verification: after resetting, every direction group must have exactly one checked option.
    // Keep this local to the dialog so unrelated page radios cannot interfere.

    document.getElementById("synCancel").onclick=()=>{
        overlay.remove();
        window.dispatchEvent(new CustomEvent("r257-synthetic-config-complete",{detail:{status:"CANCELLED",message:"R257 configuration cancelled; no observation pool was generated."}}));
    };

    const collect=()=>{
        const n=id=>Math.abs(Number(document.getElementById(id).value)||0);
        const cfg=JSON.parse(JSON.stringify(defaults));
        cfg.laterality=overlay.querySelector('input[name="synLaterality"]:checked').value;
        cfg.mounting.ap_offset=n("synMountAp");cfg.mounting.ap_offset_direction=syntheticDirectionValue("mountAp",defaults.mounting.ap_offset_direction,overlay);
        cfg.mounting.lat_offset=n("synMountLat");cfg.mounting.lat_offset_direction=syntheticDirectionValue("mountLat",defaults.mounting.lat_offset_direction,overlay);
        cfg.mounting.axial_offset=n("synMountAxial");cfg.mounting.axial_offset_direction=syntheticDirectionValue("mountAxial",defaults.mounting.axial_offset_direction,overlay);
        cfg.mounting.ap_tilt=n("synMountApTilt");cfg.mounting.ap_tilt_direction=syntheticDirectionValue("mountApTilt",defaults.mounting.ap_tilt_direction,overlay);
        cfg.mounting.lat_tilt=n("synMountLatTilt");cfg.mounting.lat_tilt_direction=syntheticDirectionValue("mountLatTilt",defaults.mounting.lat_tilt_direction,overlay);
        cfg.mounting.master_rotation=n("synMountMaster");cfg.mounting.master_rotation_direction=syntheticDirectionValue("mountMaster",defaults.mounting.master_rotation_direction,overlay);
        cfg.deformity.ap_translation=n("synDefAp");cfg.deformity.ap_translation_direction=syntheticDirectionValue("defAp",defaults.deformity.ap_translation_direction,overlay);
        cfg.deformity.lat_translation=n("synDefLat");cfg.deformity.lat_translation_direction=syntheticDirectionValue("defLat",defaults.deformity.lat_translation_direction,overlay);
        cfg.deformity.bone_length=n("synDefLength");cfg.deformity.bone_length_direction=syntheticDirectionValue("defLength",defaults.deformity.bone_length_direction,overlay);
        cfg.deformity.ap_angulation=n("synDefApAng");cfg.deformity.ap_angulation_direction=syntheticDirectionValue("defApAng",defaults.deformity.ap_angulation_direction,overlay);
        cfg.deformity.lat_angulation=n("synDefLatAng");cfg.deformity.lat_angulation_direction=syntheticDirectionValue("defLatAng",defaults.deformity.lat_angulation_direction,overlay);
        cfg.deformity.bone_rotation=n("synDefRotation");cfg.deformity.bone_rotation_direction=syntheticDirectionValue("defRotation",defaults.deformity.bone_rotation_direction,overlay);
        cfg.imaging.latPlaneAngleDeg=Number(overlay.querySelector("#synLatPlane").value);
        cfg.imaging.apElevationDeg=Number(overlay.querySelector("#synApElevation").value);
        cfg.imaging.latElevationDeg=Number(overlay.querySelector("#synLatElevation").value);
        cfg.imaging.pixelSpacingMmPerPixel=Number(overlay.querySelector("#synPixelSpacing").value);
        if(!Number.isFinite(cfg.imaging.latPlaneAngleDeg)||cfg.imaging.latPlaneAngleDeg<1||cfg.imaging.latPlaneAngleDeg>180) throw new Error("LAT camera yaw must be 1–180°.");
        if(!Number.isFinite(cfg.imaging.apElevationDeg)||cfg.imaging.apElevationDeg < -45||cfg.imaging.apElevationDeg > 45) throw new Error("AP shooting elevation must be −45° to +45°.");
        if(!Number.isFinite(cfg.imaging.latElevationDeg)||cfg.imaging.latElevationDeg < -45||cfg.imaging.latElevationDeg > 45) throw new Error("LAT shooting elevation must be −45° to +45°.");
        if(!Number.isFinite(cfg.imaging.pixelSpacingMmPerPixel)||cfg.imaging.pixelSpacingMmPerPixel<0.05||cfg.imaging.pixelSpacingMmPerPixel>5) throw new Error("DICOM pixel spacing must be 0.05–5 mm/pixel.");
        cfg.loc.enabled=document.getElementById("synLocEnabled").checked;
        cfg.loc.ap=n("synLocAp");cfg.loc.ap_direction=syntheticDirectionValue("locAp",defaults.loc.ap_direction || "Medial",overlay);
        cfg.loc.lat=n("synLocLat");cfg.loc.lat_direction=syntheticDirectionValue("locLat",defaults.loc.lat_direction || "Posterior",overlay);
        cfg.loc.axial=n("synLocAxial");cfg.loc.axial_direction=syntheticDirectionValue("locAxial",defaults.loc.axial_direction || "Proximal",overlay);
        // Normalize UI labels to the lower-case clinical vocabulary used by JS.
        const lower=v=>String(v).toLowerCase();
        for(const k of Object.keys(cfg.mounting)){if(k.endsWith("_direction"))cfg.mounting[k]=lower(cfg.mounting[k]);}
        for(const k of Object.keys(cfg.deformity)){if(k.endsWith("_direction"))cfg.deformity[k]=lower(cfg.deformity[k]);}
        cfg.loc.ap_direction=lower(cfg.loc.ap_direction);cfg.loc.lat_direction=lower(cfg.loc.lat_direction);cfg.loc.axial_direction=lower(cfg.loc.axial_direction);
        return cfg;
    };

    const generateSyntheticDicomPair=async()=>{
        const button=overlay.querySelector("#synGenerateDicomButton");
        const status=overlay.querySelector("#synGenerateDicomStatus");
        const links=overlay.querySelector("#synGenerateDicomLinks");
        if(!button||!status||!links) return;
        button.disabled=true;
        button.textContent="Generating AP/LAT DICOM…";
        status.textContent="R623 — Reading current R257 clinical settings…";
        links.replaceChildren();
        const createdUrls=[];
        try{
            // Stage A uses the exact clinical config currently visible in R257.
            // Extent/noise are observation perturbations and must be OFF here.
            const extent=overlay.querySelector("#synUseLineExtent");
            const noise=overlay.querySelector("#synInjectNoise");
            if(extent) extent.checked=false;
            if(noise){noise.checked=false;noise.dispatchEvent(new Event("change",{bubbles:true}));}
            await ensureSyntheticObservationProvider();
            const cfg=collect();
            const sparseBuilder=window.ReconstructionSyntheticTest.buildSparseGeometricCaseInput || window.ReconstructionSyntheticTest.buildR213GeometricCaseInput;
            const syntheticCase=sparseBuilder(cfg);
            if(!syntheticCase || !syntheticCase.syntheticTruth) throw new Error("R257 did not produce a synthetic 3D case.");
            // R623: DICOM generation also makes this exact case available to Way #2.
            window.xraySyntheticGeneratedCase=syntheticCase;
            window.xraySyntheticReconstructionTestConfig=JSON.parse(JSON.stringify(cfg));
            window.syntheticXrayObservationPoolConfig=JSON.parse(JSON.stringify(cfg));
            window.xraySyntheticGeneratedCaseId=window.xraySyntheticGeneratedCaseId || `R623-${Date.now()}`;
            const files=[];
            // R615 — one stable case identity and timestamp shared by AP and LAT.
            const generationDate = new Date();
            const dicomGeneratedAt = generationDate.toISOString();
            const pad2 = n => String(n).padStart(2, "0");
            const fileTimestamp = `${generationDate.getFullYear()}${pad2(generationDate.getMonth()+1)}${pad2(generationDate.getDate())}-${pad2(generationDate.getHours())}${pad2(generationDate.getMinutes())}${pad2(generationDate.getSeconds())}`;
            const suffixAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
            const randomSuffix = Array.from({length:5}, () => suffixAlphabet[Math.floor(Math.random()*suffixAlphabet.length)]).join("");
            const dicomCaseId = `SYNTH-${fileTimestamp}-${randomSuffix}-${String(cfg.laterality || "right").toUpperCase()}`;
            for(const view of ["AP","LAT"]){
                const frame=document.getElementById(view==="AP"?"xrayAPVtkFrame":"xrayLATVtkFrame");
                const panelWindow=frame?.contentWindow;
                if(!panelWindow) throw new Error(`R623 — ${view} small VTK panel is unavailable.`);
                const scene=r369BuildScene(syntheticCase,view);
                if(typeof panelWindow.createSyntheticXrayDicomArrayBuffer!=="function")
                    throw new Error(`R623 — ${view} panel does not expose the synthetic DICOM builder. Confirm its main.js build includes the R615-compatible DICOM API.`);
                if(typeof panelWindow.loadDicomArrayBuffer!=="function")
                    throw new Error(`R623 — ${view} panel does not expose loadDicomArrayBuffer().`);
                // R615 — persist the actual inputs used for this generated pair.
                // Keep semantic UI config separate from geometric truth so the file
                // remains auditable and does not pretend truth was reconstructed.
                const cameraSet = window.ReconstructionSyntheticTest.buildSyntheticCameras(cfg);
                const dicomCaseMetadata = {
                    caseId: dicomCaseId,
                    generatedAt: dicomGeneratedAt,
                    laterality: cfg.laterality || null,
                    view,
                    config: cfg,
                    imaging: JSON.parse(JSON.stringify(cfg.imaging)),
                    camera: cameraSet.cameraDefinition?.[view] || null,
                    pixelSpacingMmPerPixel: cfg.imaging.pixelSpacingMmPerPixel,
                    geometricClinical: syntheticCase.syntheticTruth?.geometricClinical || null
                };
                const buffer=await panelWindow.createSyntheticXrayDicomArrayBuffer(scene, dicomCaseMetadata);
                if(!buffer || Object.prototype.toString.call(buffer)!=="[object ArrayBuffer]" || buffer.byteLength<132)
                    throw new Error(`R623 — ${view} DICOM builder returned an invalid file buffer.`);
                const fileName=`R621_Synthetic_${view}_${String(cfg.laterality||"right").toUpperCase()}_${fileTimestamp}_${randomSuffix}.dcm`;
                // The generated byte stream is a real Explicit-VR Little-Endian
                // DICOM Part 10 file; load it through the existing DICOM reader.
                await panelWindow.loadDicomArrayBuffer(buffer,fileName);
                panelWindow.setXrayObservationView?.(view);
                const blob=new Blob([buffer],{type:"application/dicom"});
                const url=URL.createObjectURL(blob); createdUrls.push(url);
                files.push({view,fileName,bytes:buffer.byteLength,url});
            }
            files.forEach(file=>{
                const a=document.createElement("a");a.href=file.url;a.download=file.fileName;
                a.textContent=`Download ${file.view} DICOM (${Math.round(file.bytes/1024)} KB)`;
                a.style.cssText="display:inline-block;padding:5px 7px;border:1px solid #8aa;border-radius:4px;background:white;";
                links.appendChild(a);
            });
            status.textContent=`R623 — PASS
AP and LAT DICOM generated and loaded into the small VTK panels.
Laterality: ${String(cfg.laterality||"right").toUpperCase()} · extent variation: OFF · injected noise: OFF.
These are synthetic projected landmark/line images for workflow testing, not anatomically realistic or clinically calibrated radiographs.`;
            window.R582SyntheticDicomGeneration={status:"PASS",config:cfg,files:files.map(({view,fileName,bytes})=>({view,fileName,bytes})),truthExcludedFromAnnotations:true,extentNoiseDisabled:true};
        }catch(error){
            createdUrls.forEach(url=>URL.revokeObjectURL(url));
            status.textContent=`R623 — FAILED · ${String(error?.message||error)}
${String(error?.stack||"")}`;
            window.R582SyntheticDicomGeneration={status:"FAIL",error:String(error?.message||error)};
        }finally{
            button.disabled=false;
            button.textContent="Generate AP + LAT DICOM and Load Small Panels";
        }
    };
    overlay.querySelector("#synGenerateDicomButton")?.addEventListener("click",generateSyntheticDicomPair);

    const ensureSyntheticObservationProvider=async()=>{
        if(window.ReconstructionSyntheticTest?.VERSION==="R639" && window.R257SyntheticObservationPoolAPI && typeof window.R257SyntheticObservationPoolAPI.createSyntheticObservationPool==="function") return;

        if(!window.__reconstructionSyntheticTestLoadPromise){
            window.__reconstructionSyntheticTestLoadPromise=new Promise((resolve,reject)=>{
                const script=document.createElement("script");
                // Cache-bust deliberately: app.html may already have loaded an older
                // reconstruction_synthetic_test.js before this controller was updated.
                script.src = window.appAssetUrl ? window.appAssetUrl("reconstruction_synthetic_test.js?build=R639") : "./reconstruction_synthetic_test.js?build=R639";
                script.async=false;
                script.dataset.reconstructionSyntheticTest="true";
                script.onload=resolve;
                script.onerror=()=>reject(new Error("Unable to load /reconstruction_synthetic_test.js"));
                document.head.appendChild(script);
            });
        }

        await window.__reconstructionSyntheticTestLoadPromise;
        if(window.ReconstructionSyntheticTest?.VERSION!=="R639" || !window.R257SyntheticObservationPoolAPI || typeof window.R257SyntheticObservationPoolAPI.createSyntheticObservationPool!=="function")
            throw new Error("R639 synthetic provider did not load. Confirm reconstruction_synthetic_test.js is the R639 build.");
    };

    const noiseControls=["synNoiseSigma","synNoiseSeed","synNoiseTargets"].map(id=>document.getElementById(id));
    const updateNoiseControls=()=>{const enabled=document.getElementById("synInjectNoise").checked;noiseControls.forEach(el=>{if(el)el.disabled=!enabled;});};
    document.getElementById("synInjectNoise").addEventListener("change",updateNoiseControls);
    updateNoiseControls();

    const run=async()=>{
        const cfg=collect();
        const runButton=document.getElementById("synRun");
        if(runButton){runButton.disabled=true;runButton.textContent="Running both tests…";}
        try{
            await ensureSyntheticObservationProvider();
            const useExtents=document.getElementById("synUseLineExtent").checked;
            const injectNoise=document.getElementById("synInjectNoise").checked;
            const lineExtents=useExtents?{independentPreset:true}:null;
            const sigma=injectNoise?Math.max(0,Math.min(5,Number(document.getElementById("synNoiseSigma").value)||0)):0;
            const seed=Number(document.getElementById("synNoiseSeed").value)||554;
            const targets=document.getElementById("synNoiseTargets").value;
            const noise={sigmaPx:sigma,seed,targets};

            // Preserve the established R257 clinical round-trip as the reference run.
            const sparseCodes=window.ReconstructionSyntheticTest.SYNTHETIC_OBSERVATION_CODES.filter(code=>code!=="MASTER");
            const pool=window.ReconstructionSyntheticTest.buildSyntheticObservationSet({
                selectedCodes:sparseCodes,
                config:cfg,lineExtents,noise
            });
            window.syntheticXrayObservationPool=pool.observationSet;
            window.syntheticXrayObservationPoolConfig=JSON.parse(JSON.stringify(cfg));
            // R623: retain the exact geometric case in memory for Way #2.
            // Loading AP/LAT must reuse this case instead of rebuilding a parallel default.
            window.xraySyntheticReconstructionTestConfig=JSON.parse(JSON.stringify(cfg));
            window.xraySyntheticGeneratedCase=(window.ReconstructionSyntheticTest.buildSparseGeometricCaseInput || window.ReconstructionSyntheticTest.buildR213GeometricCaseInput)(cfg);
            window.xraySyntheticGeneratedCaseId=`R623-${Date.now()}`;
            // R567: do not clear current VTK observations or production input
            // just because the separate synthetic regression is running.

            const roundTripResult=await runXraySyntheticReconstructionTest("runR257ClinicalRoundTripTest",null,cfg);
            if(!roundTripResult) throw new Error("The original R257 clinical round-trip did not return a result.");

            // Separately run the sparse engine on the actual extent/noise-adjusted observation payload.
            const result=window.Reconstruction.reconstructComplete(JSON.parse(JSON.stringify(pool.observationSet)));
            const settings={lineExtents:useExtents?"independent AP/LAT preset":"original projected extents",noiseInjected:injectNoise,noiseSigmaPx:sigma,seed:injectNoise?seed:null,targets:injectNoise?targets:"none"};
            const frameAccuracy={proximalRmsMm:result.diagnostics?.proximalRegistrationRmsMm??null,distalRmsMm:result.diagnostics?.distalRegistrationRmsMm??null,thresholdMm:1e-5};
            frameAccuracy.pass=Number.isFinite(frameAccuracy.proximalRmsMm)&&Number.isFinite(frameAccuracy.distalRmsMm)&&frameAccuracy.proximalRmsMm<frameAccuracy.thresholdMm&&frameAccuracy.distalRmsMm<frameAccuracy.thresholdMm;

            // R636: an explicit, controlled no-noise pair isolates line cropping
            // from the independent synthetic-truth accuracy check above.
            const pairCodes=window.ReconstructionSyntheticTest.SYNTHETIC_OBSERVATION_CODES.filter(code=>code!=="MASTER");
            const pairNoise={sigmaPx:0,seed:554,targets:"all"};
            const pairNoExtentPool=window.ReconstructionSyntheticTest.buildSyntheticObservationSet({selectedCodes:pairCodes,config:cfg,lineExtents:null,noise:pairNoise});
            const pairExtentPool=window.ReconstructionSyntheticTest.buildSyntheticObservationSet({selectedCodes:pairCodes,config:cfg,lineExtents:{independentPreset:true},noise:pairNoise});
            const pairNoExtentResult=window.Reconstruction.reconstructComplete(JSON.parse(JSON.stringify(pairNoExtentPool.observationSet)));
            const pairExtentResult=window.Reconstruction.reconstructComplete(JSON.parse(JSON.stringify(pairExtentPool.observationSet)));
            const extentDiffs=[];
            const extentDirectionMismatches=[];
            const compareClinical=(a,b,path="clinical")=>{
                if(typeof a==="number"&&typeof b==="number"&&Number.isFinite(a)&&Number.isFinite(b)){
                    extentDiffs.push({path,absDelta:Math.abs(a-b),a,b});
                    return;
                }
                if(a&&b&&typeof a==="object"&&typeof b==="object"){
                    for(const key of new Set([...Object.keys(a),...Object.keys(b)])) compareClinical(a[key],b[key],`${path}.${key}`);
                    return;
                }
                if(a!==b && (typeof a==="string"||typeof b==="string")) extentDirectionMismatches.push({path,noExtent:a,extent:b});
            };
            compareClinical(pairNoExtentResult.clinical,pairExtentResult.clinical);
            const extentSensitivity={noise:"OFF in both paired runs",masterAnnotationIncluded:false,lineExtentsCompared:"original projected extents vs independent AP/LAT preset",noExtents:{valid:pairNoExtentResult.valid,enginePass:pairNoExtentResult.pass,proximalRmsMm:pairNoExtentResult.diagnostics?.proximalRegistrationRmsMm??null,distalRmsMm:pairNoExtentResult.diagnostics?.distalRegistrationRmsMm??null,clinical:pairNoExtentResult.clinical},independentExtents:{valid:pairExtentResult.valid,enginePass:pairExtentResult.pass,proximalRmsMm:pairExtentResult.diagnostics?.proximalRegistrationRmsMm??null,distalRmsMm:pairExtentResult.diagnostics?.distalRegistrationRmsMm??null,clinical:pairExtentResult.clinical},clinicalNumericMaxAbsDelta:extentDiffs.length?Math.max(...extentDiffs.map(x=>x.absDelta)):null,clinicalNumericDifferences:extentDiffs,directionMismatches:extentDirectionMismatches,clinicalInvariant:extentDiffs.every(x=>x.absDelta<1e-6)&&extentDirectionMismatches.length===0};
            const report={build:"R639",test:"R257 round-trip + sparse extent/noise reconstruction + paired extent sensitivity",engine:window.Reconstruction.VERSION,settings,clinicalRoundTrip:{status:roundTripResult.status,engineVersion:roundTripResult.engineVersion,clinicalPass:roundTripResult.sameLaterality?.clinicalPass??null,axisAccuracy:roundTripResult.sameLaterality?.axisAccuracy??null,fullResult:roundTripResult},sparseReconstruction:{valid:result.valid,enginePass:result.pass,stage:result.stage,anatomyStatus:result.anatomyStatus,clinical:result.clinical,casePatch:result.casePatch,frameAccuracy,diagnostics:result.diagnostics},extentSensitivity,observationCounts:{AP:pool.observationSet.AP?.annotations?.length||0,LAT:pool.observationSet.LAT?.annotations?.length||0},truthIncludedInObservation:false,interpretation:"The paired extent sensitivity check isolates line cropping with noise disabled. Clinical truth accuracy is a separate check; frame RMS is a registration residual and does not by itself prove clinical truth accuracy."};

            // R636: keep the original R257 clinical report and the sparse extent/noise
            // report together in one human-readable artifact. The R257 formatter
            // restores its side-by-side input / same-laterality / opposite-laterality
            // comparison. The existing observation-panel formatter supplies the
            // sparse reconstruction-vs-truth comparison and actual-input audit.
            const r257Formatter=window.ReconstructionSyntheticTest?.formatR257HumanReadableReport;
            const r257HumanText=typeof r257Formatter==="function"
                ? r257Formatter(roundTripResult)
                : JSON.stringify(roundTripResult,null,2);

            // R567: retain the sparse extent/noise result separately. The
            // CASE Apply action must use a CASE-applicable clinical/Way 2 result.
            window.xrayExtentNoiseReconstructionResult=result;
            window.xrayExtentNoiseObservationInput=pool.observationSet;
            observationPanelOutput({
                reconstructionResult:result,
                observationSet:pool.observationSet,
                selectedCodes:pool.observationSet.provenance?.selectedCodes || [],
                selectedCodesByView:pool.observationSet.provenance?.selectedCodesByView || null
            });
            const sparseHumanText=document.getElementById("observationOutput")?.textContent ||
                ["Sparse reconstruction report unavailable.",JSON.stringify(result.clinical,null,2),JSON.stringify(result.diagnostics,null,2)].join("\n\n");

            window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_RESULT__=JSON.stringify({
                ...report,
                observationSet:pool.observationSet,
                humanReportSections:{r257ClinicalRoundTrip:r257HumanText,sparseExtentNoise:sparseHumanText}
            },null,2);
            window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_HUMAN_RESULT__=[
                "R639 — CONSOLIDATED SYNTHETIC RECONSTRUCTION HUMAN REPORT",
                "",
                "================ SECTION 1 — R257 CLINICAL ROUND-TRIP ================",
                "This is the clean clinical round-trip reference run. The table compares the clinical input with same- and opposite-laterality interpretations.",
                "",
                r257HumanText,
                "",
                "================ SECTION 2 — EXTENT / NOISE SPARSE RECONSTRUCTION ================",
                `Engine: ${report.engine}`,
                `Input settings: line extents=${settings.lineExtents}; Gaussian noise=${settings.noiseInjected?`ON, σ=${sigma}px, seed=${seed}, targets=${targets}`:"OFF"}`,
                `Observation counts: AP=${report.observationCounts.AP}; LAT=${report.observationCounts.LAT}`,
                "This section evaluates the actual extent/noise-adjusted observation payload. The clinical comparison below is against R257 synthetic truth; frame RMS is a registration residual, not by itself a truth-accuracy measure.",
                `Paired no-noise extent sensitivity: ${report.extentSensitivity.clinicalInvariant?"PASS — clinical outputs invariant":"FAIL/CHECK — clinical outputs changed"}; maximum numeric delta=${report.extentSensitivity.clinicalNumericMaxAbsDelta}; direction mismatches=${report.extentSensitivity.directionMismatches.length}.`,
                `No-extents frame RMS: proximal=${report.extentSensitivity.noExtents.proximalRmsMm} mm, distal=${report.extentSensitivity.noExtents.distalRmsMm} mm.`,
                `Independent-extents frame RMS: proximal=${report.extentSensitivity.independentExtents.proximalRmsMm} mm, distal=${report.extentSensitivity.independentExtents.distalRmsMm} mm.`,
                "",
                sparseHumanText
            ].join("\n");

            // Keep the Observation Test Panel's raw pool display unchanged after
            // borrowing its formatter to produce the unified report above.
            observationPanelPoolOutput(pool.observationSet);
            const output=document.getElementById("xrayReconstructionApiOutput");
            if(output)output.textContent=window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_HUMAN_RESULT__;
            const status=document.getElementById("xrayReconstructionApiStatus");
            if(status)status.textContent=`R639 complete · round-trip ${roundTripResult.status} · sparse engine ${result.valid&&result.pass?"PASS":"CHECK"} · frame accuracy ${frameAccuracy.pass?"PASS":"FAIL"}`;
            observationPanelStatus(`R639 complete · AP ${report.observationCounts.AP} / LAT ${report.observationCounts.LAT} · extents ${useExtents?"ON":"OFF"} · noise ${injectNoise?`${sigma}px`:"OFF"}`);
            overlay.remove();
            window.dispatchEvent(new CustomEvent("r257-synthetic-config-complete",{detail:{status:"PASS",config:JSON.parse(JSON.stringify(cfg)),pool:window.syntheticXrayObservationPool,engineVersion:window.Reconstruction?.VERSION||null}}));
        }catch(error){
            window.dispatchEvent(new CustomEvent("r257-synthetic-config-complete",{detail:{status:"FAIL",message:String(error?.message||error)}}));
            const status=document.getElementById("xrayReconstructionApiStatus");
            if(status)status.textContent="R639 integrated test ERROR · "+String(error?.message||error);
            alert("R639 integrated clinical/extent-noise test failed: "+String(error?.message||error));
            if(runButton){runButton.disabled=false;runButton.textContent=cfg.laterality.toLowerCase()==="left"?"Run LEFT":"Run RIGHT";}
        }
    };
    document.getElementById("synRun").onclick=run;
}

document.addEventListener("click", function(event){
    const button=event.target&&typeof event.target.closest==="function"?event.target.closest("[data-reconstruction-synthetic-test]"):null;
    if(!button)return;
    const testFunctionName=button.getAttribute("data-reconstruction-synthetic-test");
    if(!testFunctionName)return;
    /*
       R257 owns the synthetic clinical test window.  Keep the legacy R248
       button name as a compatibility alias so an existing app.html does not
       accidentally call the old regression API.
    */
    if(
        testFunctionName === "runClinicalRoundTrip" ||
        testFunctionName === "runR257ClinicalRoundTripTest" ||
        testFunctionName === "runR248RightLeftLateralityTest"
    ){
        openSyntheticReconstructionDialog(button);
        return;
    }
    runXraySyntheticReconstructionTest(testFunctionName,button);
});

/* =========================================================
   R628 — PRODUCTION DETERMINE WORKFLOW
   ---------------------------------------------------------
   Capture each small AP/LAT VTK panel independently. Never use the legacy
   large VTK iframe, stale staged observations, or synthetic test fixtures.
   This is a UI/contract adapter only; reconstruction math remains in
   Reconstruction.reconstruct(). CASE application remains a separate step.
   ========================================================= */
function getProductionPanelObservation(view){
    const frameId = view === "AP" ? "xrayAPVtkFrame" : "xrayLATVtkFrame";
    const frame = document.getElementById(frameId);
    if(!frame || !frame.contentWindow){
        throw new Error(`${view} X-ray panel is unavailable. Reload the workspace and load the ${view} image again.`);
    }
    const vtk = frame.contentWindow;
    const observation = typeof vtk.getXrayObservation === "function"
        ? vtk.getXrayObservation()
        : vtk.XrayObservation;
    if(!observation){
        throw new Error(`${view}: no native annotation observation is available. Load the image and create/assign annotations first.`);
    }
    if(observation.version !== "xray-observation-v2"){
        throw new Error(`${view}: expected XrayObservation v2, received ${observation.version || "no version"}. Check the panel build.`);
    }
    const cloned = JSON.parse(JSON.stringify(observation));
    const actualView = cloned.images?.[0]?.view;
    if(actualView !== view){
        throw new Error(`${view} panel identity mismatch: its observation reports ${actualView || "UNKNOWN"}. Set the correct AP/LAT view before continuing.`);
    }
    return cloned;
}

/* R804 — explicit observation-adequacy preflight; MASTER is not a surgeon annotation.
   This gate checks the minimum semantic geometry required by the existing
   R743 solver before it runs. It does not score residuals or claim clinical
   accuracy. Suspected outliers remain diagnostics/review items because the
   R737 synthetic detector still has false positives and is not validated for
   automatic production rejection.
*/
function assessProductionObservationAdequacy(set){
    const errors=[];
    const warnings=[];
    const views={AP:set?.AP, LAT:set?.LAT};
    const annotations={
        AP:Array.isArray(views.AP?.annotations)?views.AP.annotations:[],
        LAT:Array.isArray(views.LAT?.annotations)?views.LAT.annotations:[]
    };
    const codes={AP:annotations.AP.map(a=>String(a?.code||'')),
                 LAT:annotations.LAT.map(a=>String(a?.code||''))};
    for(const view of ['AP','LAT']){
        const declared=views[view]?.images?.[0]?.view;
        if(declared!==view) errors.push(`${view}: image identity must be ${view}; received ${declared||'missing'}.`);
        annotations[view].forEach((a,i)=>{
            if(!String(a?.code||'').trim()) errors.push(`${view}: annotation ${i+1} has no engine semantic code in annotation.code; labels alone cannot identify a reconstruction landmark.`);
        });
        const duplicate=[...new Set(codes[view].filter((code,i)=>code && codes[view].indexOf(code)!==i))];
        if(duplicate.length) errors.push(`${view}: duplicate semantic annotation code(s): ${duplicate.join(', ')}.`);
    }
    const apLaterality=String(views.AP?.laterality||views.AP?.images?.[0]?.laterality||set?.laterality||'').toLowerCase();
    const latLaterality=String(views.LAT?.laterality||views.LAT?.images?.[0]?.laterality||set?.laterality||'').toLowerCase();
    if(apLaterality && latLaterality && apLaterality!==latLaterality)
        errors.push(`AP/LAT laterality mismatch (${apLaterality} versus ${latLaterality}).`);
    const caseLaterality=String(set?.laterality||'').toLowerCase();
    const apImageLaterality=String(views.AP?.images?.[0]?.laterality||'').toLowerCase();
    const latImageLaterality=String(views.LAT?.images?.[0]?.laterality||'').toLowerCase();
    if(apImageLaterality && apLaterality && apImageLaterality!==apLaterality)
        errors.push(`AP image metadata laterality (${apImageLaterality}) conflicts with AP observation/CASE laterality (${apLaterality}).`);
    if(latImageLaterality && latLaterality && latImageLaterality!==latLaterality)
        errors.push(`LAT image metadata laterality (${latImageLaterality}) conflicts with LAT observation/CASE laterality (${latLaterality}).`);
    if(caseLaterality && apLaterality && caseLaterality!==apLaterality)
        errors.push(`AP observation laterality (${apLaterality}) does not match current CASE/set laterality (${caseLaterality}).`);
    if(caseLaterality && latLaterality && caseLaterality!==latLaterality)
        errors.push(`LAT observation laterality (${latLaterality}) does not match current CASE/set laterality (${caseLaterality}).`);
    if(caseLaterality && apImageLaterality && caseLaterality!==apImageLaterality)
        errors.push(`AP image metadata laterality (${apImageLaterality}) does not match current CASE/set laterality (${caseLaterality}).`);
    if(caseLaterality && latImageLaterality && caseLaterality!==latImageLaterality)
        errors.push(`LAT image metadata laterality (${latImageLaterality}) does not match current CASE/set laterality (${caseLaterality}).`);
    const find=(view,code)=>annotations[view].filter(a=>String(a?.code||a?.label||a?.semantic?.code||'')===code);
    const hasGeometry=(view,code,geometry)=>find(view,code).some(a=>String(a?.geometry||'').toLowerCase()===geometry);
    const paired={P:[],D:[]};
    for(let i=1;i<=6;i++){
        for(const side of ['P','D']){
            const code=`S${i}-${side}`;
            const pairedPoint=['AP','LAT'].every(view=>hasGeometry(view,code,'point'));
            if(pairedPoint) paired[side].push(code);
            else if(codes.AP.includes(code)||codes.LAT.includes(code)) warnings.push(`${code}: present in only one view or not represented as a point; it cannot contribute a paired 3D hinge.`);
        }
    }
    if(paired.P.length<3) errors.push(`Insufficient proximal hinge geometry: ${paired.P.length} paired point identity/identities; at least 3 distinct S1–S6 proximal identities must be marked in both AP and LAT.`);
    if(paired.D.length<3) errors.push(`Insufficient distal hinge geometry: ${paired.D.length} paired point identity/identities; at least 3 distinct S1–S6 distal identities must be marked in both AP and LAT.`);
    const requiredAnatomy=[['PFCL','line'],['PRP','point'],['DFCL','line'],['DRP','point']];
    for(const view of ['AP','LAT']){
        for(const [code,geometry] of requiredAnatomy){
            if(!hasGeometry(view,code,geometry)) errors.push(`${view}: missing required ${geometry} observation ${code}.`);
        }
    }
    if(!['right','left'].includes(apLaterality||latLaterality)) warnings.push('Laterality is not explicitly recognized as right/left; verify CASE laterality before Apply.');
    return {
        version:'R804-observation-adequacy-v1',
        pass:errors.length===0,
        status:errors.length===0?'STRUCTURALLY SUFFICIENT FOR ENGINE':'INADEQUATE — RECONSTRUCTION BLOCKED',
        pairedProximalHinges:paired.P,
        pairedDistalHinges:paired.D,
        minimums:{pairedProximalHinges:3,pairedDistalHinges:3,anatomyPerView:['PFCL line','PRP point','DFCL line','DRP point']},
        errors,
        warnings,
        limitation:'Structural sufficiency is not proof of observability, accuracy, or clinical validity. Residual/outlier detector research is not used as an automatic rejection rule.'
    };
}

function buildProductionObservationSet(){
    const AP = getProductionPanelObservation("AP");
    const LAT = getProductionPanelObservation("LAT");
    const apValidation = validateXrayObservation(AP, "AP");
    const latValidation = validateXrayObservation(LAT, "LAT");
    const errors = [];
    if(!apValidation.pass) errors.push("AP observation contract: " + apValidation.errors.join("; "));
    if(!latValidation.pass) errors.push("LAT observation contract: " + latValidation.errors.join("; "));
    const duplicateWithin = (obs, view) => {
        const ids = (obs.annotations || []).map(a => a.id).filter(Boolean);
        const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
        if(duplicates.length) errors.push(`${view} has duplicate annotation IDs: ${duplicates.join(", ")}`);
        return duplicates;
    };
    const duplicateAP = duplicateWithin(AP, "AP");
    const duplicateLAT = duplicateWithin(LAT, "LAT");
    const selectedLaterality = window.currentCase?.laterality || window.currentCase?.patient?.laterality || window.currentCase?.metadata?.laterality || "right";
    AP.laterality = AP.laterality || selectedLaterality;
    LAT.laterality = LAT.laterality || selectedLaterality;
    if(Array.isArray(AP.images) && AP.images[0] && !AP.images[0].laterality) AP.images[0].laterality = selectedLaterality;
    if(Array.isArray(LAT.images) && LAT.images[0] && !LAT.images[0].laterality) LAT.images[0].laterality = selectedLaterality;
    const set = {
        version: "xray-observation-set-v2",
        laterality: selectedLaterality,
        AP,
        LAT,
        provenance: {
            producer: "R628 production X-ray workspace",
            contract: "renderer-neutral-semantic-v2",
            observationSource: "native AP/LAT VTK panels",
            syntheticFallbackUsed: false
        },
        validation: {
            AP: apValidation,
            LAT: latValidation,
            setLevel: {
                duplicateAnnotationIdsWithinAP: duplicateAP,
                duplicateAnnotationIdsWithinLAT: duplicateLAT,
                sharedAnnotationIdsAcrossViewsAllowed: true,
                errors,
                pass: errors.length === 0
            },
            pass: errors.length === 0
        }
    };
    return set;
}

function renderProductionObservationSummary(set){
    const el = document.getElementById("xrayProductionResultOutput");
    if(!el) return;
    const summarize = (obs, validation) => ({
        view: obs?.images?.[0]?.view || null,
        image: obs?.images?.[0] ? {
            id: obs.images[0].id ?? obs.images[0].imageId ?? null,
            width: obs.images[0].width ?? obs.images[0].columns ?? null,
            height: obs.images[0].height ?? obs.images[0].rows ?? null
        } : null,
        annotationCount: obs?.annotations?.length || 0,
        semanticCodes: validation?.semanticCodes || [],
        missingSupportedCodes: validation?.missingSupportedCodes || [],
        schemaErrors: validation?.errors || [],
        warnings: validation?.warnings || []
    });
    el.textContent = JSON.stringify({
        stage: "R632 — real AP/LAT observation capture",
        source: "small native VTK AP/LAT panels",
        syntheticFallbackUsed: false,
        AP: summarize(set.AP, set.validation.AP),
        LAT: summarize(set.LAT, set.validation.LAT),
        setValidation: set.validation.setLevel
    }, null, 2);
}


function ensureProductionResultControls(){
    const panel = document.getElementById("xrayProductionResultPanel");
    const output = document.getElementById("xrayProductionResultOutput");
    if(!panel || !output) return;
    let summary = document.getElementById("xrayProductionClinicalSummary");
    if(!summary){
        summary = document.createElement("div");
        summary.id = "xrayProductionClinicalSummary";
        summary.setAttribute("aria-live", "polite");
        summary.style.cssText = "margin:10px 0 14px;padding:10px 12px;border:1px solid #cbd5e1;border-radius:6px;background:#f8fafc;color:#1f2937;";
        const status = document.getElementById("xrayProductionResultStatus");
        if(status && status.parentNode === panel) status.insertAdjacentElement("afterend", summary);
        else output.insertAdjacentElement("beforebegin", summary);
    }
    let copyButton = document.getElementById("xrayProductionCopyResultsButton");
    if(!copyButton){
        copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.id = "xrayProductionCopyResultsButton";
        copyButton.textContent = "Copy results";
        copyButton.title = "Copy the human-readable clinical summary and detailed JSON report";
        copyButton.style.cssText = "margin-top:8px;padding:7px 11px;cursor:pointer;";
        output.insertAdjacentElement("afterend", copyButton);
    }
}

function renderProductionClinicalSummary(result){
    ensureProductionResultControls();
    const el = document.getElementById("xrayProductionClinicalSummary");
    if(!el) return;
    const clinical = result?.clinical;
    if(!clinical){
        el.textContent = "No clinical parameter summary is available for this run.";
        return;
    }
    const mounting = clinical.mounting || {};
    const deformity = clinical.deformity || {};
    const fmt = (item, unit) => {
        if(!item || item.value === null || item.value === undefined || !Number.isFinite(Number(item.value))){
            return item?.source === "not-observed" ? "Not observed" :
                   item?.source === "manual-clinical-required" ? "Manual clinical input required" :
                   item?.source === "not-enabled" ? "Not enabled" : "Undetermined";
        }
        const value = Number(item.value);
        const direction = item.direction ? ` ${item.direction}` : "";
        return `${value.toFixed(2)}${unit ? " " + unit : ""}${direction}`;
    };
    const row = (label, value) => `<div style="display:flex;gap:12px;justify-content:space-between;padding:4px 0;border-bottom:1px solid #e5e7eb;"><span>${label}</span><strong style="text-align:right;">${value}</strong></div>`;
    const groups = [
        ["Mounting", [
            ["AP offset", mounting.ap_offset, "mm"],
            ["LAT offset", mounting.lat_offset, "mm"],
            ["Axial offset", mounting.axial_offset, "mm"],
            ["AP tilt", mounting.ap_tilt, "°"],
            ["LAT tilt", mounting.lat_tilt, "°"],
            ["Master-tab rotation", mounting.master_rotation, "°"]
        ]],
        ["Deformity", [
            ["AP translation", deformity.ap_translation, "mm"],
            ["LAT translation", deformity.lat_translation, "mm"],
            ["Bone length", deformity.bone_length, "mm"],
            ["AP angulation", deformity.ap_angulation, "°"],
            ["LAT angulation", deformity.lat_angulation, "°"],
            ["Bone axial rotation", deformity.bone_rotation, "°"]
        ]],
        ["Centre of rotation (LOC)", deformity.loc?.enabled === false ? [
            ["LOC AP", {value:null,source:"not-enabled"}, "mm"],
            ["LOC LAT", {value:null,source:"not-enabled"}, "mm"],
            ["LOC axial", {value:null,source:"not-enabled"}, "mm"]
        ] : [
            ["LOC AP", deformity.loc?.ap, "mm"],
            ["LOC LAT", deformity.loc?.lat, "mm"],
            ["LOC axial", deformity.loc?.axial, "mm"]
        ]]
    ];
    let html = `<div style="font-size:13px;color:#475569;margin-bottom:8px;">Human-readable clinical values and directions · copied with the full JSON report separately.</div>`;
    for(const [heading, rows] of groups){
        html += `<h4 style="margin:10px 0 4px;font-size:14px;">${heading}</h4>`;
        for(const [label, item, unit] of rows) html += row(label, fmt(item, unit));
    }
    const masterObserved = result?.diagnostics?.masterTabObserved === true;
    const masterDerived = result?.diagnostics?.masterTabReferenceDerived === true || mounting.master_rotation?.source === "hardware-derived-ring-pose";
    const masterText = masterObserved ? "centre-hole reference observed in both AP and LAT" : masterDerived ? "centre-hole reference derived from the reconstructed proximal-ring pose and hardware topology" : "rotation undetermined: hardware reference or ring pose was insufficient";
    html += `<p style="margin:10px 0 0;font-size:12px;color:${masterObserved || masterDerived ? "#166534" : "#92400e"};">Master-tab rotation: ${masterText}.</p>`;
    el.innerHTML = html;
}

function runProductionDetermineWorkflow(){
    ensureProductionResultControls();
    const status = document.getElementById("xrayReconstructionWorkflowStatus");
    const resultStatus = document.getElementById("xrayProductionResultStatus");
    const output = document.getElementById("xrayProductionResultOutput");
    const clinicalSummary = document.getElementById("xrayProductionClinicalSummary");
    if(clinicalSummary) clinicalSummary.textContent = "Clinical summary will appear after reconstruction.";
    const applyButton = document.getElementById("xrayProductionApplyCaseButton");
    if(applyButton) applyButton.disabled = true;
    window.xrayProductionReconstructionResult = null;
    try{
        if(!window.Reconstruction || typeof window.Reconstruction.reconstruct !== "function"){
            throw new Error("The existing Reconstruction.reconstruct() engine is unavailable. Confirm reconstruction.js loaded before retrying.");
        }
        const set = buildProductionObservationSet();
        window.xrayProductionObservationSet = set;
        window.xrayReconstructionInput = set;
        renderProductionObservationSummary(set);
        if(!set.validation.pass){
            const problems = [
                ...set.validation.AP.errors.map(x => "AP: " + x),
                ...set.validation.LAT.errors.map(x => "LAT: " + x),
                ...set.validation.setLevel.errors
            ];
            const message = "Observation contract validation failed. Correct the listed issues and try again.\n\n" + problems.join("\n");
            if(status) status.textContent = "Status: AP/LAT observations need correction";
            if(resultStatus) resultStatus.textContent = message;
            if(output) output.textContent += "\n\nVALIDATION BLOCKED\n" + message;
            return null;
        }
        const adequacy = assessProductionObservationAdequacy(set);
        window.xrayProductionObservationAdequacy = adequacy;
        if(!adequacy.pass){
            const message = adequacy.status + "\n\n" + adequacy.errors.join("\n") +
                (adequacy.warnings.length ? "\n\nWarnings:\n" + adequacy.warnings.join("\n") : "");
            if(status) status.textContent = "Status: inadequate observations — reconstruction blocked";
            if(resultStatus) resultStatus.textContent = message;
            if(output) output.textContent = JSON.stringify({
                stage:"R846 workflow — production observation adequacy preflight",
                source:"actual AP/LAT VTK observations",
                syntheticFallbackUsed:false,
                observationSetValidation:set.validation,
                observationAdequacy:adequacy,
                engineCalled:false
            },null,2);
            return null;
        }
        if(status) status.textContent = `Status: AP ${set.AP.annotations.length} annotations · LAT ${set.LAT.annotations.length} annotations · structural adequacy PASS · running existing reconstruction engine`;
        if(resultStatus) resultStatus.textContent = "Both observation contracts are valid. Assessing reconstruction sufficiency…";
        const result = window.Reconstruction.reconstruct(set);
        window.xrayProductionReconstructionResult = result;
        window.xrayReconstructionResult = result;
        const engineValid = result?.valid === true || result?.pass === true;
        const clinicalReady = result?.schema === "XraySparseObservationInput"
            ? result?.valid === true && result?.diagnostics?.clinicalStatus === "reconstructed" && !!result?.clinical?.mounting && !!result?.clinical?.deformity
            : !!(result?.casePatch?.mounting && result?.casePatch?.deformity);
        renderProductionClinicalSummary(result);
        const outcome = clinicalReady ? "RECONSTRUCTION RESULT READY FOR REVIEW" : engineValid ? "ENGINE RETURNED A VALID RESULT; CLINICAL PARAMETER SUFFICIENCY IS NOT CONFIRMED" : "RECONSTRUCTION INCOMPLETE — REVIEW DIAGNOSTICS";
        if(status) status.textContent = "Status: " + outcome;
        if(resultStatus) resultStatus.textContent = outcome + (result?.diagnostics?.reason ? "\n" + result.diagnostics.reason : result?.diagnostics?.clinicalStatus ? "\nClinical status: " + result.diagnostics.clinicalStatus : "");
        if(output) output.textContent = JSON.stringify({
            stage: "R846 workflow → loaded reconstruction engine (engine identity reported separately)",
            source: "actual AP/LAT VTK observations",
            syntheticFallbackUsed: false,
            observationSetValidation: set.validation,
            observationAdequacy: adequacy,
            engine: window.Reconstruction.VERSION || "existing Reconstruction API",
            engineOutcome: outcome,
            result
        }, null, 2);
        // R743: enable explicit Apply only after a complete result is ready.
        // CASE mutation still occurs only after the user presses Apply.
        if(applyButton){
            applyButton.disabled = !clinicalReady;
            applyButton.style.cursor = clinicalReady ? "pointer" : "not-allowed";
            applyButton.title = clinicalReady
                ? "Apply the reviewed reconstructed fields to the current CASE; manual axial rotation is preserved"
                : "A clinically applicable reconstruction result is not yet available";
        }
        return result;
    }catch(error){
        const message = String(error?.message || error);
        if(status) status.textContent = "Status: unable to reconstruct — input/action required";
        if(resultStatus) resultStatus.textContent = "PRODUCTION RECONSTRUCTION NOT RUN\n" + message;
        if(output) output.textContent = JSON.stringify({
            stage: "R846 workflow — production workflow stopped safely",
            syntheticFallbackUsed: false,
            error: message
        }, null, 2);
        return null;
    }
}

async function applyProductionReconstructionToCase(){
    const status = document.getElementById("xrayReconstructionWorkflowStatus");
    const resultStatus = document.getElementById("xrayProductionResultStatus");
    const applyButton = document.getElementById("xrayProductionApplyCaseButton");
    const result = window.xrayProductionReconstructionResult;
    try{
        if(!result || result.schema !== "XraySparseObservationInput"){
            throw new Error("No eligible production reconstruction result is available. Run Determine and review the result first.");
        }
        if(result.valid !== true || result.diagnostics?.clinicalStatus !== "reconstructed"){
            throw new Error("The reconstruction result is not clinically complete. CASE was not changed.");
        }
        if(typeof ensureCurrentCase === "function") await ensureCurrentCase();
        if(!window.currentCase) throw new Error("The current CASE is unavailable. CASE was not changed.");
        // Build and validate the complete patch before mutating CASE.
        const patch = buildWay2CasePatchFromSparseResult(result, window.currentCase);
        if(!patch?.mounting || !patch?.deformity || !patch?.reconstruction){
            throw new Error("The reconstruction did not produce a complete CASE patch. CASE was not changed.");
        }
        window.currentCase.mounting = structuredClone(patch.mounting);
        window.currentCase.deformity = structuredClone(patch.deformity);
        window.currentCase.reconstruction = structuredClone(patch.reconstruction);
        if(typeof syncCurrentCase === "function") await syncCurrentCase();
        if(typeof updateXrayCaseStatus === "function") updateXrayCaseStatus();
        if(typeof populateMounting === "function") await populateMounting();
        if(typeof populateDeformity === "function" && document.getElementById("locSection")) await populateDeformity();
        if(status) status.textContent = "Status: reconstructed parameters applied to CASE · manual bone axial rotation preserved";
        if(resultStatus) resultStatus.textContent = "CASE APPLY: PASS — reviewed reconstruction fields were applied. Per-field provenance was retained; bone axial rotation remains Manual.";
        if(applyButton){ applyButton.disabled = true; applyButton.title = "This result has been applied. Run Determine again before applying another result."; }
        return patch;
    }catch(error){
        const message = String(error?.message || error);
        if(status) status.textContent = "Status: CASE apply blocked";
        if(resultStatus) resultStatus.textContent = "CASE APPLY: NOT APPLIED\n" + message;
        return null;
    }
}

window.XrayObservationAdequacy = assessProductionObservationAdequacy;

if(!window.__xrayProductionDetermineDelegated){
    window.__xrayProductionDetermineDelegated = true;
    document.addEventListener("click", function(event){
        const button = event.target && typeof event.target.closest === "function"
            ? event.target.closest("#xrayDetermineParametersButton") : null;
        if(!button) return;
        event.preventDefault();
        runProductionDetermineWorkflow();
    }, true);
}

if(!window.__xrayProductionApplyDelegated){
    window.__xrayProductionApplyDelegated = true;
    document.addEventListener("click", function(event){
        const button = event.target && typeof event.target.closest === "function"
            ? event.target.closest("#xrayProductionApplyCaseButton") : null;
        if(!button) return;
        event.preventDefault();
        if(button.disabled) return;
        applyProductionReconstructionToCase();
    });
}

/* =========================================================
   PRODUCTION RECONSTRUCTION BUTTONS
   ---------------------------------------------------------
   These handlers are intentionally thin UI-to-engine bridges.

   "Call Reconstruction Engine" stages the current renderer-neutral
   observation input if necessary, then calls the production reconstruction
   API.  "Apply Reconstructed CASE" only applies the casePatch produced by
   that completed reconstruction; it does not run reconstruction again.
   ========================================================= */
document.addEventListener("click", function(event){

    const callButton =
        event.target &&
        typeof event.target.closest === "function"
            ? event.target.closest("#xrayCallReconstructionButton")
            : null;

    if(callButton){

        let input = window.xrayReconstructionInput;
        let sourceLabel = "current X-ray reconstruction input";

        /*
           Production path: this button must run the reconstruction engine
           from the CURRENT VTK/renderer-neutral observation contract.

           Do not silently substitute the synthetic R213 builder here.
           Synthetic reconstruction is a separate test workflow (R257).
           If no staged observation input exists, stage the current VTK
           observation contract now. If that contract is unavailable, show
           a visible failure rather than running synthetic geometry.
        */
        if(!input || !input.version || input.version !== "xray-observation-set-v2"){
            input = stageXrayObservationsForReconstruction();
            sourceLabel = "current VTK XrayObservation v2 set";
        }

        if(!input){
            return;
        }

        if(input.version === "xray-observation-set-v2"){
            const status = document.getElementById("xrayReconstructionApiStatus");
            const output = document.getElementById("xrayReconstructionApiOutput");
            const haveAP = !!input.AP;
            const haveLAT = !!input.LAT;
            /*
               R450 — do not pre-judge observation sufficiency here.
               The production caller forwards whatever semantic observation
               set the user has supplied. The reconstruction engine reports
               whether the current information is sufficient.
            */

            if(status) status.textContent =
                `R450 — semantic observation set received — AP ${haveAP ? "present" : "missing"} · LAT ${haveLAT ? "present" : "missing"} · calling reconstruction engine.`;

            runXrayReconstructionInput(
                input,
                "current VTK XrayObservation v2 semantic set"
            );
            return;
        }

        runXrayReconstructionInput(
            input,
            sourceLabel
        );

        return;
    }

    const applyButton =
        event.target &&
        typeof event.target.closest === "function"
            ? event.target.closest("#xrayApplyReconstructionButton")
            : null;

    if(applyButton){
        applyR204ReconstructionToCase();
    }
});

/* =========================================================
   Synthetic-test report downloads
   ---------------------------------------------------------
   JSON is retained for complete machine diagnostics.
   Human report is retained for engineering review and comparison.
   Both downloads use the exact strings produced by the same test run.
   ========================================================= */
function downloadXraySyntheticTestReport(type){

    const isHuman = type === "human";

    const text =
        isHuman
            ? window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_HUMAN_RESULT__
            : window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_RESULT__;

    if(!text){
        alert("No reconstruction synthetic test result is available.");
        return;
    }

    const blob = new Blob(
        [text],
        {type:"text/plain;charset=utf-8"}
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    const syntheticVersion =
        window.ReconstructionSyntheticTest &&
        window.ReconstructionSyntheticTest.VERSION
            ? window.ReconstructionSyntheticTest.VERSION
            : "reconstruction";

    anchor.download = isHuman
        ? syntheticVersion + "_reconstruction_synthetic_test_human.txt"
        : syntheticVersion + "_reconstruction_synthetic_test_result.txt";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

document.addEventListener("click", function(event){

    const jsonButton =
        event.target &&
        typeof event.target.closest === "function"
            ? event.target.closest(
                "#downloadReconstructionSyntheticTestResultButton"
            )
            : null;

    if(jsonButton){
        downloadXraySyntheticTestReport("json");
        return;
    }

    const humanButton =
        event.target &&
        typeof event.target.closest === "function"
            ? event.target.closest(
                "#downloadReconstructionSyntheticTestHumanResultButton"
            )
            : null;

    if(humanButton){
        downloadXraySyntheticTestReport("human");
    }
});



/* =========================================================
   R190 — X-ray image loading
   ---------------------------------------------------------
   Browser-side image loading only.

   This test does NOT:
     - use VTK.js
     - perform DICOM decoding
     - create annotations
     - perform reconstruction

   It only proves that AP and LAT image files can be
   selected and displayed inside the X-ray workspace.
   ========================================================= */

function initializeXrayImageInputs(){
    const bindings = [
        {view:'AP', button:'xrayAPLoadButton', input:'xrayAPFileInput', frame:'xrayAPVtkFrame', status:'xrayAPStatus'},
        {view:'LAT', button:'xrayLATLoadButton', input:'xrayLATFileInput', frame:'xrayLATVtkFrame', status:'xrayLATStatus'}
    ];
    bindings.forEach(({view,button,input,frame,status})=>{
        const b=document.getElementById(button), f=document.getElementById(input);
        if(b && f && b.dataset.r536Bound!=='1'){
            b.addEventListener('click',()=>f.click());
            f.addEventListener('change',()=>loadXrayImage(view,f).catch(error=>{
                const s=document.getElementById(status);
                if(s) s.textContent=`R576 — ${view} load failed: ${String(error?.message || error)}`;
            }));
            b.dataset.r536Bound='1';
        }
        const frameEl=document.getElementById(frame);
        if(frameEl && frameEl.contentWindow){
            frameEl.addEventListener('load',()=>{
                try { frameEl.contentWindow.setXrayObservationView?.(view); } catch(_) {}
            },{once:true});
        }
    });
    document.querySelectorAll('[data-xray-expand]').forEach(button=>{
        if(button.dataset.r536Bound==='1') return;
        button.addEventListener('click',()=>toggleXrayPanelExpansion(button.dataset.xrayExpand));
        button.dataset.r536Bound='1';
    });
    document.querySelectorAll('[data-xray-create-point]').forEach(button=>{
        if(button.dataset.r538Bound==='1') return;
        button.addEventListener('click',()=>{
            const view=button.dataset.xrayCreatePoint;
            const frame=document.getElementById(view==='LAT'?'xrayLATVtkFrame':'xrayAPVtkFrame');
            frame?.contentWindow?.postMessage({type:'xray-create-point'}, window.location.origin);
        });
        button.dataset.r538Bound='1';
    });
}

// R1123 — display live observation counts and workspace state below each image.
if (!window.__r896XrayPanelStatus) {
    window.__r896XrayPanelStatus = {
        AP: { count: 0, points: 0, lines: 0, liveState: 'active' },
        LAT: { count: 0, points: 0, lines: 0, liveState: 'active' }
    };
}
function r896RenderXrayPanelStatus(view) {
    const state = window.__r896XrayPanelStatus[view];
    if (!state) return;
    const status = document.getElementById(view === 'AP' ? 'xrayAPObservationStatus' : 'xrayLATObservationStatus');
    if (!status) return;
    status.textContent = `R576 — ${view} observations: ${state.count} (${state.points} points, ${state.lines} lines) · Live state: ${state.liveState}`;
}
if (!window.__r896XrayPanelStatusMessagesBound) {
    window.__r896XrayPanelStatusMessagesBound = true;
    window.addEventListener('message', event => {
        if (event.origin !== window.location.origin) return;
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        // R1144.4 — accept messages only from the iframe assigned to that view.
        // The iframe is the authority for its own live VTK state; origin alone
        // is insufficient because both AP and LAT panels share this origin.
        const view = data.view === 'LAT' ? 'LAT' : (data.view === 'AP' ? 'AP' : null);
        if (!view) return;
        const expectedFrameId = view === 'LAT' ? 'xrayLATVtkFrame' : 'xrayAPVtkFrame';
        const expectedFrame = document.getElementById(expectedFrameId);
        if (!expectedFrame || event.source !== expectedFrame.contentWindow) return;

        // R1144.4 — semantic VTK change notification -> central CASE event.
        // This is notification only: it does not capture a snapshot or persist data.
        if (data.type === 'xray-live-changed') {
            if (data.build !== 'R1123') return;
            const reason = typeof data.reason === 'string' ? data.reason.trim() : '';
            if (!reason) return;
            // R1144.5: selection/highlight is transient UI state, never a CASE mutation.
            if (/\b(highlight|highlighted|selected|selection)\b/i.test(reason)) return;
            const coordinator = window.CaseChangeCoordinator;
            if (!coordinator || typeof coordinator.emit !== 'function') return;
            coordinator.emit({
                domain: 'xray',
                operation: 'update',
                source: 'xray',
                view,
                reason: `VTK ${reason}`
            });
            return;
        }

        const state = window.__r896XrayPanelStatus[view];
        if (data.type === 'xray-observation-updated') {
            state.count = Number.isFinite(Number(data.count)) ? Number(data.count) : 0;
            state.points = Number.isFinite(Number(data.pointCount)) ? Number(data.pointCount) : 0;
            state.lines = Number.isFinite(Number(data.lineCount)) ? Number(data.lineCount) : 0;
            r896RenderXrayPanelStatus(view);
            const summary = document.getElementById(view === 'AP' ? 'xrayAPObservationCount' : 'xrayLATObservationCount');
            if (summary) summary.textContent = String(state.count);
            if (typeof updateXrayWorkflowStatus === 'function') updateXrayWorkflowStatus();
            return;
        }
    });
}

function getXrayPanelWindow(view){
    const id=view==='LAT'?'xrayLATVtkFrame':'xrayAPVtkFrame';
    const frame=document.getElementById(id);
    if(!frame?.contentWindow) throw new Error(`R536 — ${view} VTK panel is not available`);
    return frame.contentWindow;
}

async function loadXrayImage(view,input){
    const file=input?.files?.[0];
    if(!file) return;
    const name=file.name || 'selected image';
    const lower=name.toLowerCase();
    const isDicom=/\.(dcm|ima)$/.test(lower) || /application\/dicom/i.test(file.type||'');
    const isRaster=/\.(png|jpe?g|webp|bmp|gif)$/.test(lower) || /^image\//i.test(file.type||'');
    if(!isDicom && !isRaster) throw new Error('Choose DICOM/IMA or a supported raster image (PNG/JPG)');
    const win=getXrayPanelWindow(view);
    const status=document.getElementById(view==='LAT'?'xrayLATStatus':'xrayAPStatus');
    if(status) status.textContent=`R576 — Loading ${name}…`;
    if(typeof win.setXrayObservationView==='function') win.setXrayObservationView(view);
    if(isDicom){
        if(typeof win.loadDicomArrayBuffer!=='function') throw new Error('VTK panel does not expose loadDicomArrayBuffer(); reload the VTK panel and verify its build marker');
        const buffer=await file.arrayBuffer();
        await win.loadDicomArrayBuffer(buffer,name);
    }else{
        if(typeof win.loadRasterImageFile!=='function') throw new Error('VTK panel does not expose loadRasterImageFile(); reload the VTK panel and verify its build marker');
        await win.loadRasterImageFile(file,name);
    }
    if(typeof win.setXrayObservationView==='function') win.setXrayObservationView(view);
    if(status) status.textContent=`${view} · ${name} · loaded in VTK`;
    if(input) input.value='';
    return true;
}

function toggleXrayPanelExpansion(view){
    const card=document.getElementById(view==='LAT'?'xrayLATPanelCard':'xrayAPPanelCard');
    const frame=document.getElementById(view==='LAT'?'xrayLATVtkFrame':'xrayAPVtkFrame');
    const button=document.querySelector(`[data-xray-expand="${view}"]`);
    if(!card || !frame) return;
    const expanded=card.classList.toggle('r537-xray-expanded');
    if(button) {
        // R576: change the same control into Restore while expanded.
        // This removes the misleading Expand action but keeps a visible way back.
        button.textContent=expanded?'Restore':'Expand';
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        button.setAttribute('aria-label', expanded ? `Restore ${view} X-ray panel` : `Expand ${view} X-ray panel`);
        button.style.display='';
    }
    frame.style.height=expanded?'calc(100vh - 180px)':'380px';
    if(expanded){
        window.__r575ExpandedXrayView=view;
        card.setAttribute('aria-label', `${view} X-ray expanded. Press Escape to restore the panel.`);
    } else {
        if(window.__r575ExpandedXrayView===view) delete window.__r575ExpandedXrayView;
        card.removeAttribute('aria-label');
    }
    // Reflow the same iframe/renderer; do not reload it or discard annotation state.
    const win=frame.contentWindow;
    requestAnimationFrame(()=>{
        try {
            void card.offsetHeight;
            win?.dispatchEvent(new win.Event('resize')); win?.grw?.resize?.();
        } catch(_) {}
    });
}

// R576 — Escape remains an alternate way to restore an expanded AP/LAT panel.
if (!window.__r575EscapeRestoreBound) {
    window.__r575EscapeRestoreBound=true;
    window.addEventListener('keydown', event=>{
        if(event.key!=='Escape') return;
        const view=window.__r575ExpandedXrayView;
        if(view==='AP' || view==='LAT') toggleXrayPanelExpansion(view);
    });
}

/* =========================================================
   R190 initialization
   ========================================================= */

/* =========================================================
   R192 — Surgeon observation points
   ---------------------------------------------------------
   Observation coordinates are stored in ORIGINAL IMAGE
   PIXEL coordinates.

   u = horizontal pixel coordinate
   v = vertical pixel coordinate

   Origin:
     top-left of image

   No 3D reconstruction is performed here.
   ========================================================= */

window.xrayObservationState =
    window.xrayObservationState || {

        AP: [],
        LAT: []

    };


function createXrayObservationPoint(
    view,
    img,
    event
){

    const rect =
        img.getBoundingClientRect();


    const scaleX =
        img.naturalWidth /
        rect.width;

    const scaleY =
        img.naturalHeight /
        rect.height;


    const u =
        (event.clientX - rect.left) *
        scaleX;

    const v =
        (event.clientY - rect.top) *
        scaleY;


    const point = {

        id:
            "P" +
            (
                window.xrayObservationState[view].length +
                1
            ),

        u: u,

        v: v

    };


    window.xrayObservationState[view].push(
        point
    );


    drawXrayObservationPoint(
        view,
        img,
        u,
        v
    );


    updateXrayObservationStatus(
        view
    );


    console.log(
        "R192 — Observation point:",
        view,
        point
    );

}


/* =========================================================
   Draw observation marker
   ========================================================= */

function drawXrayObservationPoint(
    view,
    img,
    u,
    v
){

    const container =
        document.getElementById(
            view === "AP"
                ? "xrayAPImageContainer"
                : "xrayLATImageContainer"
        );


    if(!container){
        return;
    }


    const displayU =
        u *
        img.clientWidth /
        img.naturalWidth;

    const displayV =
        v *
        img.clientHeight /
        img.naturalHeight;


    const marker =
        document.createElement("div");


    marker.style.position = "absolute";

    marker.style.left =
        displayU + "px";

    marker.style.top =
        displayV + "px";

    marker.style.width = "12px";
    marker.style.height = "12px";

    marker.style.border =
        "2px solid red";

    marker.style.borderRadius =
        "50%";

    marker.style.transform =
        "translate(-50%, -50%)";

    marker.style.pointerEvents =
        "none";


    container.appendChild(
        marker
    );

}


/* =========================================================
   Visible observation status
   ========================================================= */

function updateXrayObservationStatus(
    view
){

    const el =
        document.getElementById(
            view === "AP"
                ? "xrayAPObservationStatus"
                : "xrayLATObservationStatus"
        );


    if(!el){
        return;
    }


    const observations =
        window.xrayObservationState[view];


    el.textContent =
        "R192 — " +
        view +
        " observations: " +
        observations.length;


    observations.forEach(
        function(point, index){

            el.textContent +=
                "\nPoint " +
                (index + 1) +
                ": u=" +
                point.u.toFixed(1) +
                " px, v=" +
                point.v.toFixed(1) +
                " px";

        }
    );

}

/* =========================================================
   R195 — VTK browser ESM URL delivery probe
   ---------------------------------------------------------
   Tests whether the browser can directly import a VTK.js
   ESM module from an explicit URL.

   This deliberately does NOT use:
       @kitware/vtk.js/...

   because the browser cannot resolve bare package names
   without a bundler/import-map.
   ========================================================= */

async function testXrayVtkDelivery(){

    const el =
        document.getElementById(
            "xrayVtkDeliveryStatus"
        );

    if(!el){
        return;
    }

    el.textContent =
        "R195 — testing browser VTK ESM URL delivery...";

    try{

        const module =
            await import(
                "https://cdn.jsdelivr.net/npm/@kitware/vtk.js/Rendering/Misc/GenericRenderWindow.js"
            );

        const vtkGenericRenderWindow =
            module.default || module;

        if(
            typeof vtkGenericRenderWindow.newInstance
            !== "function"
        ){
            throw new Error(
                "VTK module loaded, but newInstance() " +
                "is unavailable"
            );
        }

        el.textContent =
            "R195 — VTK ESM URL DELIVERY: PASS";

        console.log(
            "R195 — VTK ESM URL DELIVERY: PASS",
            vtkGenericRenderWindow
        );

    }catch(error){

        el.textContent =
            "R195 — VTK ESM URL DELIVERY: FAIL — " +
            error.message;

        console.error(
            "R195 VTK ESM URL delivery test:",
            error
        );
    }
}

/* =========================================================
   R198 — VTK → X-RAY observation bridge
   ---------------------------------------------------------
   Reads the renderer-neutral observation exposed by the
   proven R152 VTK application inside the same-origin iframe.

   This test intentionally does NOT modify the R152 VTK app.
   ========================================================= */

let xrayVtkObservationTimer = null;

function testXrayVtkObservationBridge(){

    const frame =
        document.getElementById(
            "xrayVtkFrame"
        );

    const status =
        document.getElementById(
            "xrayVtkObservationBridgeStatus"
        );

    const data =
        document.getElementById(
            "xrayVtkObservationBridgeData"
        );

    if(!frame || !status || !data){
        return;
    }

    if(xrayVtkObservationTimer){
        clearInterval(
            xrayVtkObservationTimer
        );
    }

    function readObservation(){

        try{

            const observation =
                frame.contentWindow
                    ? (typeof frame.contentWindow.getXrayObservation === 'function'
                        ? frame.contentWindow.getXrayObservation()
                        : frame.contentWindow.XrayObservation)
                    : null;

            if(!observation){

                status.textContent =
                    "R198 — waiting for R152 XrayObservation...";

                data.textContent =
                    "No observation received yet.";

                return;
            }

            status.textContent =
                "R198 — VTK → X-RAY OBSERVATION BRIDGE: PASS";

            data.textContent =
                JSON.stringify(
                    observation,
                    null,
                    2
                );

        }
        catch(error){

            status.textContent =
                "R198 — VTK → X-RAY OBSERVATION BRIDGE: FAIL — " +
                error.message;

            console.error(
                "R198 observation bridge:",
                error
            );
        }
    }

    readObservation();

    xrayVtkObservationTimer =
        setInterval(
            readObservation,
            30000      //500
        );
}

/* =========================================================
   WorkspaceManager registration
   ========================================================= */

if(window.WorkspaceManager){

    window.WorkspaceManager.register(
        "xray",
        {

            initialize:
                initializeXrayReconstructionWorkspace,

            enter:
                enterXrayReconstructionWorkspace,

            leave:
                leaveXrayReconstructionWorkspace

        }
    );

}

/* ========================================================================
   R371 — SYNTHETIC AP/LAT → VTK → XrayObservation → RECONSTRUCTION
   ------------------------------------------------------------------------
   This layer does not modify R256 reconstruction.js or R257 synthetic test
   logic. It consumes their existing public APIs and orchestrates the test.
   ======================================================================== */

let r369SyntheticCase = null;
let r369APObservation = null;

function r369RequireSyntheticApi(){
    if(!window.ReconstructionSyntheticTest ||
       typeof window.ReconstructionSyntheticTest.buildR213GeometricCaseInput !== 'function'){
        throw new Error('R371 — synthetic reconstruction test API is unavailable.');
    }
    if(!window.Reconstruction ||
       typeof window.Reconstruction.solveProjectiveCamera !== 'function' ||
       typeof window.Reconstruction.triangulatePoint !== 'function'){
        throw new Error('R371 — R256 reconstruction API is unavailable.');
    }
}

function r369BuildScene(input, view){
    const calibrationPoints = (input.calibration?.[view] || []).map(c => c.image2D);
    const lines = [];
    const points = [];
    const anatomy = input.anatomy || {};

    function addLine(observation, label, kind='reference'){
        const o = observation?.[view];
        if(o?.pointA && o?.pointB) lines.push({
            id: label,
            kind,
            pointA: o.pointA,
            pointB: o.pointB
        });
    }

    // R437: tolerate both historical array-form and semantic object-form
    // strut containers. This scene builder must never require a specific
    // container representation merely to load the synthetic calibration.
    // The reconstruction contract remains authoritative downstream.
    const strutContainer = input.struts || [];
    const strutList = Array.isArray(strutContainer)
        ? strutContainer
        : Object.entries(strutContainer).map(([id, value]) => ({
            id,
            ...(value && typeof value === 'object' ? value : {})
        }));

    strutList.forEach(strut => {
        const o = strut?.[view];
        if(o?.pointA && o?.pointB) lines.push({
            id: strut.id,
            kind: 'strut',
            pointA: o.pointA,
            pointB: o.pointB
        });
    });
    function addPoint(observation, label){
        const p = observation?.[view];
        if(p) points.push({id: label, point: p});
    }

    addLine(anatomy.PFCL, 'proximal-axis', 'anatomy');
    addLine(anatomy.DFCL, 'distal-axis', 'anatomy');
    addLine(anatomy.proximalOrientationReference, 'proximal-orientation', 'anatomy');
    addPoint(anatomy.PRP, 'PRP');
    addPoint(anatomy.DRP, 'DRP');
    if(anatomy.LOC) addPoint(anatomy.LOC, 'LOC');
    // R639 — deliberately do not add anatomy.masterTabReference to the image scene.
    // The synthetic image must not contain a special point/circle that gives away
    // the Master Tab location. The reconstruction engine receives only the normal
    // strut and anatomical observations and derives the hardware angle from the
    // recovered proximal-ring pose.

    return {
        view,
        width: 500,
        height: 500,
        calibrationPoints,
        calibrationModel3D: (input.calibration?.[view] || []).map(c => c.model3D),
        lines,
        points: points.map(x => x.point),
        truthLabels: {
            lines: lines.map(x => x.id),
            points: points.map(x => x.id)
        },
        // R442: carry the synthetic anatomical observations themselves in
        // the same semantic shape consumed by XrayObservation v2.
        anatomy: JSON.parse(JSON.stringify(input.anatomy || {})),
        manualClinical: JSON.parse(JSON.stringify(input.manualClinical || null)),
        laterality: input.laterality || null,
        // R611 — expose only the declared synthetic test input used to build
        // this AP/LAT scene. This is ground truth for engineering comparison,
        // not a reconstructed clinical result or a patient measurement.
        syntheticClinicalTruth: JSON.parse(JSON.stringify(input.syntheticTruth?.geometricClinical || null))
    };
}

function r369GetVtkWindow(){
    const frame = document.getElementById('xrayVtkFrame');
    if(!frame?.contentWindow) throw new Error('R579 — big VTK iframe is unavailable.');
    return frame.contentWindow;
}

/* R579 — Wait for the VTK iframe's public synthetic-scene API and await its
   lazy VTK initialization. Older R369/R371/R518 callers treated this async
   API as synchronous, so failures could become unhandled rejections while
   the parent page reported success or showed an empty result. */
async function r579LoadSyntheticSceneIntoBigVtk(scene){
    const frame=document.getElementById('xrayVtkFrame');
    if(!frame) throw new Error('R579 — big VTK iframe element #xrayVtkFrame was not found.');
    if(!frame.contentWindow) throw new Error('R579 — big VTK iframe has no contentWindow.');

    const deadline=Date.now()+10000;
    let lastState='iframe not ready';
    while(Date.now()<deadline){
        let vtk;
        try{ vtk=frame.contentWindow; }
        catch(error){ throw new Error('R579 — cannot access big VTK iframe (same-origin access failed): '+error.message); }
        if(typeof vtk.loadSyntheticXrayScene==='function'){
            return await vtk.loadSyntheticXrayScene(scene);
        }
        lastState=frame.contentDocument?.readyState || 'iframe document unavailable';
        await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw new Error(`R579 — VTK synthetic-image API did not become available within 10 seconds (${lastState}). Check the iframe load/build and its visible VTK diagnostic.`);
}

function r369Status(text){
    const el = document.getElementById('r369SyntheticStatus');
    if(el) el.textContent = text;
}

function r369Output(text){
    const el = document.getElementById('r369SyntheticOutput');
    if(el) el.textContent = text;
}

async function r369LoadAP(){
    try{
        r369RequireSyntheticApi();
        r369SyntheticCase = window.ReconstructionSyntheticTest.buildR213GeometricCaseInput();
        r369APObservation = null;
        const scene = r369BuildScene(r369SyntheticCase, 'AP');
        const result = await r579LoadSyntheticSceneIntoBigVtk(scene);
        r369Status(`R579 — AP scene loaded · ${result.calibrationCount} calibration marks · ${result.lineCount} reference lines · ${result.pointCount} reference point(s)`);
        r369Output('Draw the AP target point and bone/reference lines over the visible synthetic truth. Then click “Capture AP + Load LAT”.');
        return result;
    }catch(error){
        r369Status('R371 — AP LOAD FAILED · ' + error.message);
        throw error;
    }
}

async function r369CaptureAPLoadLAT(){
    try{
        const vtk = r369GetVtkWindow();
        const observation = typeof vtk.getXrayObservation === 'function'
            ? vtk.getXrayObservation()
            : vtk.XrayObservation;
        if(!observation || observation.version !== 'xray-observation-v1'){
            throw new Error('R370 — no valid AP XrayObservation v1 available.');
        }
        if(observation.images?.[0]?.view !== 'AP'){
            throw new Error('R370 — current VTK observation is not AP.');
        }
        r369APObservation = JSON.parse(JSON.stringify(observation));

        const scene = r369BuildScene(r369SyntheticCase, 'LAT');
        const result = await r579LoadSyntheticSceneIntoBigVtk(scene);
        r369Status(`R579 — AP captured (${r369APObservation.annotations.length} annotation(s)) · LAT scene loaded`);
        r369Output('Draw the corresponding LAT target point and reference lines. Then click “Run 3D Point Reconstruction”.');
        return result;
    }catch(error){
        r369Status('R371 — AP→LAT FAILED · ' + error.message);
        throw error;
    }
}

function r369RunPointReconstruction(statusFn=r369Status, outputFn=r369Output, resultPrefix='R411'){
    try{
        r369RequireSyntheticApi();
        if(!r369SyntheticCase || !r369APObservation){
            throw new Error('R371 — load AP, draw annotations, and capture AP first.');
        }
        const latVtk = r369GetVtkWindow();
        const latObservation = typeof latVtk.getXrayObservation === 'function'
            ? latVtk.getXrayObservation()
            : latVtk.XrayObservation;
        if(!latObservation || latObservation.images?.[0]?.view !== 'LAT'){
            throw new Error('R371 — no valid LAT XrayObservation v1 available.');
        }

        const calAP = r369SyntheticCase.calibration.AP;
        const calLAT = r369SyntheticCase.calibration.LAT;
        const PapResult = window.Reconstruction.solveProjectiveCamera(
            calAP.map(x => x.model3D), calAP.map(x => x.image2D)
        );
        const PlatResult = window.Reconstruction.solveProjectiveCamera(
            calLAT.map(x => x.model3D), calLAT.map(x => x.image2D)
        );

        // R409 — INPUT CONTRACT ADAPTER
        // solveProjectiveCamera() returns { P, residuals, rms, max }.
        // triangulatePoint() requires the raw 3x4 projection matrix P.
        const Pap = PapResult?.P ?? PapResult;
        const Plat = PlatResult?.P ?? PlatResult;

        const isProjectionMatrix = (P) =>
            Array.isArray(P) &&
            P.length === 3 &&
            P.every(row =>
                Array.isArray(row) &&
                row.length === 4 &&
                row.every(value => Number.isFinite(Number(value)))
            );

        if(!isProjectionMatrix(Pap) || !isProjectionMatrix(Plat)){
            throw new Error('R409 — camera adapter produced an invalid 3x4 projection matrix.');
        }

        const apPoint = r369APObservation.annotations.find(a => a.geometry === 'point');
        const latPoint = latObservation.annotations.find(a => a.geometry === 'point');
        if(!apPoint?.point?.image || !latPoint?.point?.image){
            throw new Error('R371 — one point annotation is required in both AP and LAT.');
        }

        const truth = r369SyntheticCase.syntheticTruth.proximalOrigin;
        const apXY = apPoint.point.image;
        const latXY = latPoint.point.image;

        // R411 — OBSERVATION COORDINATE DIAGNOSTIC
        // Project the same 3D truth point through the exact recovered camera
        // matrices used by this reconstruction call. This isolates any
        // VTK XrayObservation coordinate mismatch before triangulation.
        const expectedAP = window.Reconstruction.projectPoint(Pap, truth);
        const expectedLAT = window.Reconstruction.projectPoint(Plat, truth);
        const deltaAP = [
            Number(apXY[0]) - Number(expectedAP[0]),
            Number(apXY[1]) - Number(expectedAP[1])
        ];
        const deltaLAT = [
            Number(latXY[0]) - Number(expectedLAT[0]),
            Number(latXY[1]) - Number(expectedLAT[1])
        ];
        const magnitude2D = (d) => Math.hypot(Number(d[0]), Number(d[1]));
        const observationDiagnostic = {
            AP: {
                observed: apXY,
                expected: expectedAP,
                delta: deltaAP,
                magnitudePx: magnitude2D(deltaAP)
            },
            LAT: {
                observed: latXY,
                expected: expectedLAT,
                delta: deltaLAT,
                magnitudePx: magnitude2D(deltaLAT)
            }
        };

        const result = window.Reconstruction.triangulatePoint(Pap, Plat, apXY, latXY);
        const p = result.point;
        const err = Math.sqrt(
            (p[0]-truth[0])**2 +
            (p[1]-truth[1])**2 +
            (p[2]-truth[2])**2
        );

        const report = {
            test: 'R371 — ONE 3D POINT ROUND-TRIP',
            status: err < 1.0 ? 'PASS' : 'CHECK',
            truth3Dmm: truth,
            AP: apXY,
            LAT: latXY,
            reconstructed3Dmm: p,
            errorMm: err,
            raySeparationMm: result.raySeparation,
            reprojectionErrorPx: result.reprojectionError,
            cameraRecovery: {
                AP: 'PASS',
                LAT: 'PASS'
            },
            observationCoordinateDiagnostic: observationDiagnostic,
            source: 'R257 synthetic truth + R409 XrayObservation adapter + R411 coordinate diagnostic + R256 triangulation'
        };
        statusFn(`${resultPrefix} — ${report.status} · 3D point error ${err.toFixed(6)} mm · AP Δ ${observationDiagnostic.AP.magnitudePx.toFixed(3)} px · LAT Δ ${observationDiagnostic.LAT.magnitudePx.toFixed(3)} px`);
        outputFn(JSON.stringify(report, null, 2));
        window.R369PointRoundTripResult = report;
        return report;
    }catch(error){
        statusFn(`${resultPrefix} — RECONSTRUCTION FAILED · ` + error.message);
        outputFn(error.stack || error.message);
        throw error;
    }
}

function r413Status(text){
    const el=document.getElementById('r413SyntheticStatus');
    if(el) el.textContent=text;
}
function r413Output(text){
    const el=document.getElementById('r413SyntheticOutput');
    if(el) el.textContent=text;
}

/* ========================================================================
   R415 — SYNTHETIC DICOM → XrayObservation → R256 ROUND-TRIP
   ------------------------------------------------------------------------
   This test uses the same R257 synthetic truth, but sends each rendered
   synthetic image through the DICOM parser/display path before annotation.
   R256 reconstruction mathematics and native VTK interaction are unchanged.
   ======================================================================== */

async function r413LoadAPAsDicom(){
    try{
        r369RequireSyntheticApi();
        r369SyntheticCase = window.ReconstructionSyntheticTest.buildR213GeometricCaseInput();
        r369APObservation = null;
        const scene = r369BuildScene(r369SyntheticCase, 'AP');
        const vtk = r369GetVtkWindow();
        if(typeof vtk.loadSyntheticXraySceneAsDicom !== 'function'){
            throw new Error('R415 — VTK synthetic-DICOM loader is unavailable.');
        }
        const parsed = await vtk.loadSyntheticXraySceneAsDicom(scene);
        if(typeof vtk.setXrayObservationView === 'function') vtk.setXrayObservationView('AP');
        r413Status(`R415 — AP entered through DICOM path · ${parsed.columns}×${parsed.rows} · Pixel Spacing ${parsed.colSpacing.toFixed(4)}×${parsed.rowSpacing.toFixed(4)} mm/px`);
        r413Output('R415 — AP synthetic truth is now displayed through the DICOM parser with clinical labels. Draw/assign the target point, then click “R415 — Capture AP + Load LAT”.');
        return parsed;
    }catch(error){
        r413Status('R415 — AP DICOM LOAD FAILED · ' + error.message);
        r413Output(error.stack || error.message);
        throw error;
    }
}

function r414FormatObservationAnnotations(observation){
    const annotations = Array.isArray(observation?.annotations) ? observation.annotations : [];
    if(!annotations.length) return 'R415 — AP captured · annotations: 0';
    const lines = annotations.map((a, i) => {
        if(a.geometry === 'point'){
            const code = a.code || a.label || 'UNASSIGNED';
            const img = a.point?.image || [];
            const phys = a.point?.physical || [];
            return `${i+1}. ${code} · point image=[${Number(img[0]).toFixed(3)}, ${Number(img[1]).toFixed(3)}] physical=[${Number(phys[0]).toFixed(3)}, ${Number(phys[1]).toFixed(3)}]`;
        }
        const code = a.code || a.label || 'UNASSIGNED';
        const A = a.pointA?.image || [];
        const B = a.pointB?.image || [];
        return `${i+1}. ${code} · line A=[${Number(A[0]).toFixed(3)}, ${Number(A[1]).toFixed(3)}] B=[${Number(B[0]).toFixed(3)}, ${Number(B[1]).toFixed(3)}]`;
    });
    return `R415 — AP captured · annotations: ${annotations.length}\n${lines.join('\n')}`;
}

async function r413CaptureAPLoadLATAsDicom(){
    try{
        const vtk = r369GetVtkWindow();
        const observation = typeof vtk.getXrayObservation === 'function'
            ? vtk.getXrayObservation()
            : vtk.XrayObservation;
        if(!observation || observation.version !== 'xray-observation-v1' || observation.images?.[0]?.view !== 'AP'){
            throw new Error('R415 — no valid AP XrayObservation v1 available.');
        }
        r369APObservation = JSON.parse(JSON.stringify(observation));
        r413Output(r414FormatObservationAnnotations(r369APObservation));
        const scene = r369BuildScene(r369SyntheticCase, 'LAT');
        if(typeof vtk.loadSyntheticXraySceneAsDicom !== 'function'){
            throw new Error('R415 — VTK synthetic-DICOM loader is unavailable.');
        }
        const parsed = await vtk.loadSyntheticXraySceneAsDicom(scene);
        r413Status(`R415 — AP captured (${r369APObservation.annotations.length} annotation(s)) · LAT entered through DICOM path`);
        r413Output(`${r414FormatObservationAnnotations(r369APObservation)}\n\nR415 — LAT synthetic truth is now displayed through the DICOM parser with fresh annotation/semantic state · ${parsed.columns}×${parsed.rows}. Draw the LAT target point, then click “R415 — Run 3D Point Reconstruction”.`);
        return parsed;
    }catch(error){
        r413Status('R415 — AP→LAT DICOM FAILED · ' + error.message);
        r413Output(error.stack || error.message);
        throw error;
    }
}

/* R564 — The obsolete R436 visible calibration test/controller was removed.
   The active Way 2 path now owns the synthetic AP/LAT workflow. */

/* =========================================================
   OBSERVATION TEST PANEL
   ---------------------------------------------------------
   The synthetic observation pool is created upstream by the
   R257 Clinical Round-Trip dialog. This panel only selects a
   subset from that existing pool and sends the selected subset
   through the normal production reconstruction boundary.
   ========================================================= */

const OBSERVATION_CODES = Object.freeze([
    'PFCL','PRP','DFCL','DRP','LOC',
    'S1-P','S2-P','S3-P','S4-P','S5-P','S6-P',
    'S1-D','S2-D','S3-D','S4-D','S5-D','S6-D',
    'S1-DIR','S2-DIR','S3-DIR','S4-DIR','S5-DIR','S6-DIR'
]);

function observationPanelStatus(text){
    const el=document.getElementById('observationStatus');
    if(el) el.textContent=text;
}

function observationPanelPoolOutput(observationSet){
    const el=document.getElementById('observationOutput');
    if(!el) return;
    if(!observationSet){
        el.textContent='No synthetic observation pool selected yet.';
        return;
    }
    el.textContent=JSON.stringify(observationSet,null,2);
}

function observationPanelOutput(value){
    const el=document.getElementById('observationOutput');
    if(!el) return;

    if(typeof value==='string'){
        el.textContent=value;
        return;
    }

    const result=value?.reconstructionResult || null;
    const input=value?.observationSet || null;
    const selected=value?.selectedCodes || [];
    const diagnostics=result?.diagnostics || {};
    const counts=diagnostics?.observationCounts || {
        AP:input?.AP?.annotations?.length || 0,
        LAT:input?.LAT?.annotations?.length || 0
    };
    const calibrationCounts=diagnostics?.calibrationCounts || {AP:0,LAT:0};
    const loadedEngineVersion=window.Reconstruction?.VERSION || null;
    const resultEngineVersion=result?.version || null;
    const engineVersionMatch=Boolean(loadedEngineVersion && resultEngineVersion && loadedEngineVersion===resultEngineVersion);
    const workflowRevision='R850';

    const engineStatus = result?.pass === true ? 'ENGINE PASS' : (result?.valid === true ? 'VALID — ENGINE NOT PASS' : 'ENGINE INVALID');
    const clinical = result?.clinical || null;
    const anatomy = result?.anatomy || null;
    const cameraRms = Number(diagnostics?.cameraRmsPx);
    const proxRms = Number(diagnostics?.proximalRegistrationRmsMm);
    const distRms = Number(diagnostics?.distalRegistrationRmsMm);
    const clinicalComplete = diagnostics?.acceptance?.clinicalOutputComplete === true || diagnostics?.clinicalStatus === 'reconstructed';
    const validChecks = {
        observationsAccepted: (counts.AP ?? 0) > 0 && (counts.LAT ?? 0) > 0,
        imagingGeometryRecovered: Number.isFinite(cameraRms),
        frameReconstructed: Number.isFinite(proxRms) && Number.isFinite(distRms),
        anatomyReconstructed: diagnostics?.anatomyStatus === 'reconstructed' || Boolean(anatomy),
        clinicalOutputComplete: clinicalComplete
    };

    const r257TruthResult=window.xrayReconstructionSyntheticTestResult || null;
    const axisAccuracy = r257TruthResult?.sameLaterality?.axisAccuracy || null;
    const truthClinicalAvailable = Boolean(r257TruthResult?.clinicalInput && clinical);
    const passChecks = {
        cameraAccuracy: {
            /*
             * R511 reporting correction: the sparse clinical reconstruction
             * does not use the historical full-calibration camera threshold
             * as an acceptance gate. Keep the measured value visible, but
             * explicitly mark this criterion as out-of-scope for sparse PASS.
             */
            applicable: false,
            valuePx: Number.isFinite(cameraRms) ? cameraRms : null,
            thresholdPx: 1e-5,
            pass: null,
            scopeReason: 'Historical full-calibration criterion; not an acceptance gate for sparse clinical reconstruction.'
        },
        frameAccuracy: {
            applicable: Number.isFinite(proxRms) && Number.isFinite(distRms),
            proximalRmsMm: Number.isFinite(proxRms) ? proxRms : null,
            distalRmsMm: Number.isFinite(distRms) ? distRms : null,
            thresholdMm: 1e-5,
            pass: Number.isFinite(proxRms) && Number.isFinite(distRms) ? proxRms < 1e-5 && distRms < 1e-5 : null
        },
        axisAccuracy: axisAccuracy ? {
            applicable: true,
            PF: axisAccuracy.PF,
            DF: axisAccuracy.DF,
            pass: axisAccuracy.pass
        } : {
            applicable: false,
            scopeReason: 'Truth comparison is available only in the controlled synthetic reconstruction test.',
            pass: null
        },
        clinicalComparison: truthClinicalAvailable ? {
            applicable: true,
            pass: r257TruthResult?.sameLaterality?.clinicalPass === true
        } : {
            applicable: false,
            scopeReason: 'No hidden truth is available for a production/real-X-ray reconstruction.',
            pass: null
        },
        boneRotationRequired: false
    };

    const failureReasons = [];
    Object.entries(validChecks).forEach(([name,ok])=>{ if(ok!==true) failureReasons.push(`validChecks.${name}=false`); });
    Object.entries(passChecks).forEach(([name,check])=>{
        if(check && typeof check === 'object' && check.applicable === true && check.pass !== true) failureReasons.push(`passChecks.${name}=false`);
    });

    /* Frame RMS is a registration residual, not a ground-truth accuracy measure. Keep it visible but do not mix it into the synthetic truth-accuracy verdict. */
    const accuracyChecksApplicable = [passChecks.axisAccuracy, passChecks.clinicalComparison].filter(c=>c && c.applicable===true);
    const accuracyPass = accuracyChecksApplicable.length>0 && accuracyChecksApplicable.every(c=>c.pass===true);
    const summary={
        status: engineStatus + (accuracyChecksApplicable.length ? (accuracyPass ? ' · SYNTHETIC ACCURACY PASS' : ' · SYNTHETIC ACCURACY FAIL/CHECK') : ' · ACCURACY NOT EVALUATED'),
        engineStatus,
        syntheticAccuracyStatus: accuracyChecksApplicable.length ? (accuracyPass ? 'PASS' : 'FAIL/CHECK') : 'NOT EVALUATED',
        valid: result?.valid ?? null,
        validChecks,
        pass: null,
        enginePass: result?.pass ?? null,
        passSemantics: 'Overall acceptance when synthetic accuracy is evaluated; null when accuracy is not evaluated. Use enginePass for raw reconstruction-engine execution.',
        syntheticAccuracyPass: null,
        overallAcceptanceStatus: 'NOT EVALUATED',
        passChecks,
        stage: result?.stage || null,
        anatomyStatus: result?.anatomyStatus || null,
        APObservations: counts.AP ?? 0,
        LATObservations: counts.LAT ?? 0,
        APCalibration: calibrationCounts.AP ?? 0,
        LATCalibration: calibrationCounts.LAT ?? 0,
        missing: diagnostics?.missing || diagnostics?.anatomyMissing || [],
        summary: diagnostics?.summary || diagnostics?.reason || null,
        failureReasons,
        workflowRevision,
        loadedEngineVersion,
        reconstructionEngine: resultEngineVersion,
        engineVersionMatch,
        engineVersionStatus: engineVersionMatch ? 'MATCH' : 'MISMATCH OR VERSION UNAVAILABLE' 
    };

    /* R480 — keep the existing top summary unchanged; add the reconstructed
       clinical result immediately below it.  Values/directions come directly
       from result.clinical so the UI does not recalculate clinical meaning. */
    const mounting=clinical?.mounting || {};
    const deformity=clinical?.deformity || {};
    const clinicalPair=(value)=>({
        value: value?.value ?? null,
        direction: value?.direction ?? null
    });
    /* R499 — compact reconstructed-vs-truth clinical summary.
       The truth is taken only from the existing R257 synthetic regression
       result when this page is running the controlled synthetic test.
       Production/real-X-ray reconstruction has no hidden truth and therefore
       shows a clear NOT AVAILABLE message rather than inventing one. */
    const r257TruthClinical=r257TruthResult?.clinicalInput || null;
    const r257TruthLaterality=r257TruthResult?.outputInterpretation?.same || null;
    const r257SameClinical=r257TruthResult?.sameLaterality?.clinical || null;

    const fmtClinicalPair=(pair)=>{
        if(!pair || pair.value==null) return '—';
        const value=Number(pair.value);
        // Preserve the reconstructed numeric value exactly; do not round.
        const valueText=Number.isFinite(value) ? String(value) : String(pair.value);
        return `${valueText}${pair.direction ? ` (${pair.direction})` : ''}`;
    };

    let clinicalComparisonPass = null;
    const clinicalComparisonLines=()=>{
        const lines=[
            '',
            '================ CLINICAL OUTPUT: RECONSTRUCTED VS TRUTH ================',
            'Mounting'
        ];

        if(!r257TruthClinical || !clinical){
            lines.push('Truth is not available for this reconstruction run.');
            lines.push('Truth comparison is shown only for the controlled R257 synthetic test.');
            return lines;
        }

        const get=(obj,path,key)=>{
            const group=path==='deformity.loc' ? obj?.deformity?.loc : obj?.[path];
            return group?.[key] || null;
        };

        const compare=(reconstructed,truth)=>{
            return Boolean(reconstructed && truth) &&
                Number.isFinite(Number(reconstructed.value)) &&
                Number.isFinite(Number(truth.value)) &&
                Math.abs(Number(reconstructed.value)-Number(truth.value)) < 1e-3 &&
                reconstructed.direction===truth.direction;
        };

        /* Compact columns: parameter / reconstructed / truth / Match. */
        const addRow=(label,path,key)=>{
            const reconstructed=get(clinical,path,key);
            const truth=get(r257TruthClinical,path,key);
            const valueMatch=compare(reconstructed,truth);
            lines.push(
                `  ${label.padEnd(17)}${fmtClinicalPair(reconstructed).padEnd(22)}${fmtClinicalPair(truth).padEnd(22)}${valueMatch?'PASS':'FAIL'}`
            );
            return valueMatch;
        };

        const mountingRows=[
            ['AP offset','mounting','ap_offset'],
            ['LAT offset','mounting','lat_offset'],
            ['Axial offset','mounting','axial_offset'],
            ['AP tilt','mounting','ap_tilt'],
            ['LAT tilt','mounting','lat_tilt'],
            ['Master rotation','mounting','master_rotation']
        ];

        for(const row of mountingRows){
            addRow(...row);
        }

        lines.push('', 'Deformity');

        const deformityRows=[
            ['AP translation','deformity','ap_translation'],
            ['LAT translation','deformity','lat_translation'],
            ['Bone length','deformity','bone_length'],
            ['AP angulation','deformity','ap_angulation'],
            ['LAT angulation','deformity','lat_angulation']
        ];

        for(const row of deformityRows){
            addRow(...row);
        }

        /* Bone axial rotation is manual clinical input, not reconstructed. */
        lines.push(
            `  ${'Bone rotation'.padEnd(17)}${'—'.padEnd(22)}${fmtClinicalPair(get(r257TruthClinical,'deformity','bone_rotation')).padEnd(22)}N/E`
        );

        /* LOC is surgeon-optional: evaluate only when actually observed. */
        const observedLOC=Boolean(
            input?.AP?.annotations?.some(a=>a?.code==='LOC') ||
            input?.LAT?.annotations?.some(a=>a?.code==='LOC')
        );

        lines.push('');
        lines.push('LOC');

        if(observedLOC){
            addRow('AP','deformity.loc','ap');
            addRow('LAT','deformity.loc','lat');
            addRow('Axial','deformity.loc','axial');
        }else{
            lines.push('  Not observed — NOT EVALUATED');
        }

        if(r257TruthLaterality){
            lines.push(`Truth source: R257 synthetic clinical truth (${r257TruthLaterality} laterality).`);
        }

        /* Overall result excludes manual bone rotation and omitted LOC. */
        const applicableRows=[...mountingRows,...deformityRows];
        if(observedLOC){
            applicableRows.push(
                ['LOC','deformity.loc','ap'],
                ['LOC','deformity.loc','lat'],
                ['LOC','deformity.loc','axial']
            );
        }

        const overallPass=applicableRows.every(([label,path,key])=>
            compare(get(clinical,path,key),get(r257TruthClinical,path,key))
        );
        clinicalComparisonPass = overallPass;

        lines.push(`Overall clinical comparison: ${overallPass?'PASS':'FAIL'}`);
        lines.push(
            observedLOC
                ? 'LOC: EVALUATED — LOC observation was submitted.'
                : 'LOC: NOT EVALUATED — no LOC observation was submitted.'
        );
        lines.push('Bone rotation: NOT EVALUATED — manual clinical input.');

        return lines;
    };

    const clinicalComparisonText=clinicalComparisonLines();

    /* R556: evaluate the sparse candidate against truth, not the separate clean R257 reference run.
       Frame RMS is also an applicable synthetic acceptance gate; engine execution PASS remains separate. */
    if(passChecks.clinicalComparison.applicable === true && clinicalComparisonPass !== null){
        passChecks.clinicalComparison.pass = clinicalComparisonPass;
    }
    const finalAccuracyChecksApplicable = [
        passChecks.frameAccuracy, passChecks.axisAccuracy, passChecks.clinicalComparison
    ].filter(c=>c && c.applicable === true);
    const finalAccuracyPass = finalAccuracyChecksApplicable.length > 0 &&
        finalAccuracyChecksApplicable.every(c=>c.pass === true);
    summary.syntheticAccuracyStatus = finalAccuracyChecksApplicable.length
        ? (finalAccuracyPass ? 'PASS' : 'FAIL')
        : 'NOT EVALUATED';
    summary.syntheticAccuracyPass = finalAccuracyChecksApplicable.length ? finalAccuracyPass : null;
    summary.overallAcceptanceStatus = finalAccuracyChecksApplicable.length
        ? (finalAccuracyPass && result?.valid === true ? 'PASS' : 'FAIL')
        : 'NOT EVALUATED';
    summary.pass = finalAccuracyChecksApplicable.length
        ? (finalAccuracyPass && result?.valid === true)
        : null;
    summary.status = engineStatus + (finalAccuracyChecksApplicable.length
        ? (finalAccuracyPass ? ' · SYNTHETIC ACCURACY PASS' : ' · SYNTHETIC ACCURACY FAIL')
        : ' · ACCURACY NOT EVALUATED');
    summary.failureReasons = [];
    Object.entries(validChecks).forEach(([name,ok])=>{
        if(ok !== true) summary.failureReasons.push(`validChecks.${name}=false`);
    });
    Object.entries(passChecks).forEach(([name,check])=>{
        if(check && typeof check === 'object' && check.applicable === true && check.pass !== true){
            summary.failureReasons.push(`passChecks.${name}=false`);
        }
    });

    const acceptanceDiagnosticsLines=()=>{
        const d=result?.diagnostics || {};
        const fmtNum=(v)=>Number.isFinite(Number(v)) ? String(Number(v)) : 'N/A';
        const threshold=(v,t)=>Number.isFinite(Number(v)) ? (Number(v) < t ? 'PASS' : 'FAIL') : 'N/A';
        const camera=Number(d.cameraRmsPx);
        const prox=Number(d.proximalRegistrationRmsMm);
        const dist=Number(d.distalRegistrationRmsMm);
        const axis=axisAccuracy;
        const geometryPass=
            passChecks.frameAccuracy.applicable === true &&
            passChecks.frameAccuracy.pass === true &&
            (!passChecks.axisAccuracy.applicable || passChecks.axisAccuracy.pass === true);
        const lines=[
            '',
            '================ RECONSTRUCTION ACCEPTANCE DIAGNOSTICS ================',
            `  Camera RMS                          ${fmtNum(camera).padEnd(20)} NOT APPLICABLE`,
            '    Historical threshold: < 1e-5 px   Scope: full-calibration diagnostic only',
            `  Proximal frame RMS < 1e-5 mm          ${fmtNum(prox).padEnd(20)} ${threshold(prox,1e-5)}`,
            `  Distal frame RMS < 1e-5 mm            ${fmtNum(dist).padEnd(20)} ${threshold(dist,1e-5)}`,
            '  Max strut residual < 1e-5 mm          N/A                  NOT APPLICABLE — sparse clinical path',
            axis
                ? `  PF axis error < 1e-5 deg              ${String(axis.PF.valueDeg).padEnd(20)} ${axis.PF.pass ? 'PASS' : 'FAIL'}`
                : '  PF axis error < 1e-5 deg              N/A                  NOT APPLICABLE — no synthetic truth',
            axis
                ? `  DF axis error < 1e-5 deg              ${String(axis.DF.valueDeg).padEnd(20)} ${axis.DF.pass ? 'PASS' : 'FAIL'}`
                : '  DF axis error < 1e-5 deg              N/A                  NOT APPLICABLE — no synthetic truth',
            `  Geometry acceptance                  ${geometryPass ? 'YES' : 'NO'}                  ${geometryPass ? 'PASS' : 'FAIL'}`,
            `  Clinical output complete             ${clinicalComplete ? 'YES' : 'NO'}                  ${clinicalComplete ? 'PASS' : 'FAIL'}`,
            '  Bone rotation                        NOT EVALUATED        EXCLUDED FROM PASS',
            `  Engine execution pass                ${result?.pass === true ? 'PASS' : 'FAIL'}`,
            `  Synthetic accuracy                   ${summary.syntheticAccuracyStatus}`,
            `  Overall acceptance                   ${summary.overallAcceptanceStatus}`
        ];
        return lines;
    };

    const acceptanceDiagnosticsText=acceptanceDiagnosticsLines();

    const clinicalSummary={
        mounting:{
            ap_offset:clinicalPair(mounting.ap_offset),
            lat_offset:clinicalPair(mounting.lat_offset),
            axial_offset:clinicalPair(mounting.axial_offset),
            ap_tilt:clinicalPair(mounting.ap_tilt),
            lat_tilt:clinicalPair(mounting.lat_tilt),
            master_rotation:clinicalPair(mounting.master_rotation)
        },
        deformity:{
            ap_translation:clinicalPair(deformity.ap_translation),
            lat_translation:clinicalPair(deformity.lat_translation),
            bone_length:clinicalPair(deformity.bone_length),
            ap_angulation:clinicalPair(deformity.ap_angulation),
            lat_angulation:clinicalPair(deformity.lat_angulation),
            bone_rotation:clinicalPair(deformity.bone_rotation),
            loc:{
                enabled:deformity.loc?.enabled ?? null,
                ap:clinicalPair(deformity.loc?.ap),
                lat:clinicalPair(deformity.loc?.lat),
                axial:clinicalPair(deformity.loc?.axial)
            }
        },
        manualAxialRotationDeg:clinical?.manualAxialRotationDeg ?? null,
        manualAxialRotationSource:clinical?.manualAxialRotationSource ?? null,
        engineCheck:{loadedEngineVersion,resultEngineVersion,engineVersionMatch}
    };

    const clinicalReportLines=[
        'Mounting',
        `  AP offset         ${fmtClinicalPair(mounting.ap_offset)}`,
        `  LAT offset        ${fmtClinicalPair(mounting.lat_offset)}`,
        `  Axial offset      ${fmtClinicalPair(mounting.axial_offset)}`,
        `  AP tilt           ${fmtClinicalPair(mounting.ap_tilt)}`,
        `  LAT tilt          ${fmtClinicalPair(mounting.lat_tilt)}`,
        `  Master rotation   ${fmtClinicalPair(mounting.master_rotation)}`,
        '',
        'Deformity',
        `  AP translation    ${fmtClinicalPair(deformity.ap_translation)}`,
        `  LAT translation   ${fmtClinicalPair(deformity.lat_translation)}`,
        `  Bone length       ${fmtClinicalPair(deformity.bone_length)}`,
        `  AP angulation     ${fmtClinicalPair(deformity.ap_angulation)}`,
        `  LAT angulation    ${fmtClinicalPair(deformity.lat_angulation)}`,
        '  Bone rotation     NOT EVALUATED — manual clinical input',
        '',
        'LOC',
        ...(deformity.loc?.enabled ? [
            `  AP                ${fmtClinicalPair(deformity.loc.ap)}`,
            `  LAT               ${fmtClinicalPair(deformity.loc.lat)}`,
            `  Axial             ${fmtClinicalPair(deformity.loc.axial)}`
        ] : ['  NOT EVALUATED — LOC observation was not submitted.']),
        '',
        `Engine             loaded=${loadedEngineVersion ?? 'unknown'}  result=${resultEngineVersion ?? 'unknown'}  match=${engineVersionMatch}`
    ];

    el.textContent=[
        '================ RECONSTRUCTION RESULT SUMMARY ================',
        JSON.stringify(summary,null,2),
        '',
        '================ CLINICAL RECONSTRUCTION ================',
        ...clinicalComparisonText,
        ...(result?.stage === "reconstructed" && !clinical
            ? [
                '',
                '*** CLINICAL OUTPUT ERROR ***',
                'Reconstruction reached stage "reconstructed" but result.clinical is null.',
                'The loaded reconstruction engine/result path is inconsistent with the current contract.'
            ]
            : []),
        ...(resultEngineVersion && loadedEngineVersion && !engineVersionMatch
            ? [
                '',
                '*** ENGINE VERSION MISMATCH ***',
                `Loaded engine: ${loadedEngineVersion}`,
                `Result engine: ${resultEngineVersion}`,
                'Reload/cache-bust the reconstruction assets before accepting the result.'
            ]
            : []),
        ...acceptanceDiagnosticsText,
        '',
        '================ OBSERVATION SELECTION / ACTUAL INPUT AUDIT ================',
        JSON.stringify((()=>{
            const requestedByView=value?.selectedCodesByView || value?.observationSet?.provenance?.selectedCodesByView || null;
            const codesFromInput=(view)=>[...new Set((input?.[view]?.annotations || []).map(a=>a?.code).filter(Boolean))].sort();
            const normalize=(codes)=>[...new Set((Array.isArray(codes)?codes:[]).filter(Boolean))].sort();
            const actualPayloadCodesByView={AP:codesFromInput('AP'),LAT:codesFromInput('LAT')};
            const actualPayloadCountsByView={AP:(input?.AP?.annotations || []).length,LAT:(input?.LAT?.annotations || []).length};
            const mismatchFor=(view)=>{
                if(!requestedByView || !Array.isArray(requestedByView[view])) return null;
                const requested=normalize(requestedByView[view]);
                const actual=actualPayloadCodesByView[view];
                return {
                    matches:JSON.stringify(requested)===JSON.stringify(actual),
                    requestedCount:requested.length,
                    actualAnnotationCount:actualPayloadCountsByView[view],
                    actualUniqueCodeCount:actual.length,
                    requestedButMissingFromPayload:requested.filter(code=>!actual.includes(code)),
                    presentInPayloadButNotRequested:actual.filter(code=>!requested.includes(code))
                };
            };
            const payloadMatchByView={AP:mismatchFor('AP'),LAT:mismatchFor('LAT')};
            const comparable=payloadMatchByView.AP!==null && payloadMatchByView.LAT!==null;
            const payloadMatchesSelection=comparable && payloadMatchByView.AP.matches && payloadMatchByView.LAT.matches;
            return {
                requestedSelectionCodesByView:requestedByView,
                requestedSelectionUniqueCodes:[...new Set([...(requestedByView?.AP||[]),...(requestedByView?.LAT||[])])].sort(),
                actualPayloadCodesByView,
                actualPayloadCountsByView,
                actualPayloadUniqueCodeCountsByView:{AP:actualPayloadCodesByView.AP.length,LAT:actualPayloadCodesByView.LAT.length},
                payloadMatchesSelection:comparable?payloadMatchesSelection:null,
                payloadMatchByView,
                producer:input?.provenance?.producer || value?.observationSet?.provenance?.producer || null,
                sourcePool:input?.provenance?.sourcePool || value?.observationSet?.provenance?.sourcePool || null,
                contract:input?.provenance?.contract || value?.observationSet?.provenance?.contract || null,
                note:'Actual payload codes/counts are derived from the input annotations supplied to the reconstruction call; requested selection/provenance is shown separately.'
            };
        })(),null,2),
        '',
        '================ FULL OBSERVATION JSON ================',
        JSON.stringify(input,null,2),
        '',
        '================ FULL RECONSTRUCTION JSON ================',
        JSON.stringify(result,null,2)
    ].join('\n');
}

function selectedObservationCodes(view){
    const normalizedView=view === 'LAT' ? 'LAT' : 'AP';
    const panel=document.getElementById('observationTestPanel');
    if(!panel) return [];

    return Array.from(panel.querySelectorAll(
        `input[type="checkbox"][data-observation-view="${normalizedView}"][data-observation-code]`
    ))
    .filter(input=>input.checked)
    .map(input=>input.getAttribute('data-observation-code'))
    .filter(Boolean);
}
function selectedObservationCodesByView(){
    return {AP:selectedObservationCodes('AP'),LAT:selectedObservationCodes('LAT')};
}
async function ensureObservationPanelSyntheticPool(){
    const validPool = pool => pool && pool.version === 'xray-observation-set-v2' &&
        Array.isArray(pool.AP?.annotations) && Array.isArray(pool.LAT?.annotations);

    // R850: follow the established Way 2 Load Synthetic AP policy. Reuse an
    // already-generated pool (and its retained truth config when available).
    // Only open the R257 configuration dialog if no valid pool exists. Never
    // replace an existing pool with default truth and never silently synthesize.
    const existingPool=window.syntheticXrayObservationPool;
    if(validPool(existingPool)){
        const existingConfig=window.syntheticXrayObservationPoolConfig ||
            window.xraySyntheticReconstructionTestConfig || null;
        if(existingConfig && typeof existingConfig==='object'){
            window.syntheticXrayObservationPoolConfig=JSON.parse(JSON.stringify(existingConfig));
        }
        observationPanelStatus(
            `R850 · reusing existing R257 observation pool · AP ${existingPool.AP.annotations.length} · `+
            `LAT ${existingPool.LAT.annotations.length} · truth config ${existingConfig?'retained':'not separately available'} · `+
            `engine ${window.Reconstruction?.VERSION || 'version unavailable'}`
        );
        return existingPool;
    }

    if(!window.ReconstructionSyntheticTest || window.ReconstructionSyntheticTest.VERSION !== 'R639'){
        if(!window.__reconstructionSyntheticTestLoadPromise){
            window.__reconstructionSyntheticTestLoadPromise = new Promise((resolve,reject)=>{
                const script=document.createElement('script');
                script.src = window.appAssetUrl ? window.appAssetUrl("reconstruction_synthetic_test.js?build=R850") : "./reconstruction_synthetic_test.js?build=R850";
                script.async=false;
                script.dataset.reconstructionSyntheticTest='true';
                script.onload=resolve;
                script.onerror=()=>reject(new Error('Unable to load /reconstruction_synthetic_test.js for the R257 configuration dialog.'));
                document.head.appendChild(script);
            });
        }
        await window.__reconstructionSyntheticTestLoadPromise;
    }
    if(window.ReconstructionSyntheticTest?.VERSION !== 'R639' || typeof window.ReconstructionSyntheticTest.getDefaultSyntheticTestConfig !== 'function'){
        throw new Error('R257 configuration provider unavailable or unexpected version. No default truth was generated.');
    }

    return await new Promise((resolve,reject)=>{
        let settled=false;
        const finish=(error,detail)=>{
            if(settled)return;
            settled=true;
            window.removeEventListener('r257-synthetic-config-complete',onComplete);
            if(error){reject(error);return;}
            const pool=detail?.pool || window.syntheticXrayObservationPool;
            if(detail?.status !== 'PASS'){
                reject(new Error(detail?.message || (detail?.status==='CANCELLED'
                    ? 'R257 configuration was cancelled; reconstruction was not run.'
                    : 'R257 configuration did not complete successfully; reconstruction was not run.')));
                return;
            }
            if(!validPool(pool)){
                reject(new Error('R257 completed but did not provide a valid AP/LAT xray-observation-set-v2 pool.'));
                return;
            }
            const config=detail?.config || window.syntheticXrayObservationPoolConfig || window.xraySyntheticReconstructionTestConfig;
            if(!config || typeof config!=='object'){
                reject(new Error('R257 completed without retaining its exact truth configuration.'));
                return;
            }
            window.syntheticXrayObservationPool=pool;
            window.syntheticXrayObservationPoolConfig=JSON.parse(JSON.stringify(config));
            observationPanelStatus(`R850 · configured R257 truth accepted · AP ${pool.AP.annotations.length} · LAT ${pool.LAT.annotations.length} · engine ${detail.engineVersion || window.Reconstruction?.VERSION || 'version unavailable'}`);
            resolve(pool);
        };
        const onComplete=event=>finish(null,event.detail||{});
        window.addEventListener('r257-synthetic-config-complete',onComplete);
        try{
            openSyntheticReconstructionDialog(document.getElementById('observationRunButton'));
            const dialog=document.getElementById('xraySyntheticReconstructionDialog');
            if(!dialog){
                finish(new Error('Could not open the R257 synthetic truth configuration dialog.'));
                return;
            }
            observationPanelStatus('R850 · no existing pool found · configure synthetic truth in the R257 dialog, then press its Run button.');
        }catch(error){finish(error);}
    });
}

function buildSelectedObservationSubset(pool,selectedCodesByView){
    if(!pool || pool.version!=='xray-observation-set-v2') throw new Error('Synthetic observation pool could not be created. Check the R639 test-data provider status.');
    const AP=Array.isArray(selectedCodesByView?.AP)?selectedCodesByView.AP:[];
    const LAT=Array.isArray(selectedCodesByView?.LAT)?selectedCodesByView.LAT:[];
    if(!AP.length && !LAT.length) throw new Error('Select at least one observation in AP or LAT.');
    const subset=structuredClone(pool);
    subset.AP.annotations=(pool.AP?.annotations||[]).filter(a=>AP.includes(a.code));
    subset.LAT.annotations=(pool.LAT?.annotations||[]).filter(a=>LAT.includes(a.code));
    subset.provenance={...(pool.provenance||{}),producer:'Observation Test Panel',selectedCodesByView:{AP:[...AP],LAT:[...LAT]},selectedCodes:[...new Set([...AP,...LAT])],sourcePool:'R257 Clinical Round-Trip'};
    return subset;
}

async function runObservationTestPanelReconstruction(){
    try{
        const pool=await ensureObservationPanelSyntheticPool();
        if(!window.Reconstruction || typeof window.Reconstruction.reconstruct !== 'function'){
            throw new Error('The production Reconstruction.reconstruct() API is unavailable; no alternate/legacy engine will be called.');
        }
        const selectedByView=selectedObservationCodesByView();
        const subset=buildSelectedObservationSubset(pool,selectedByView);
        const selected=[...new Set([...selectedByView.AP,...selectedByView.LAT])];
        window.xrayObservationV2Set=subset;
        window.xrayReconstructionInput=subset;

        const result=await runXrayReconstructionInput(
            subset,
            'Observation Test Panel'
        );

        observationPanelStatus(
            `R850 · window.Reconstruction.reconstruct() · engine ${window.Reconstruction.VERSION || 'version unavailable'} · ` +
            `selected ${selected.length} · AP ${subset.AP.annotations.length} · LAT ${subset.LAT.annotations.length} · ` +
            `status: ${result?.status || result?.stage || 'unknown'}`
        );
        observationPanelOutput({
            selectedCodes:selected,
            selectedCodesByView:selectedByView,
            observationSet:subset,
            reconstructionResult:result
        });
        return result;
    }catch(error){
        observationPanelStatus('RECONSTRUCTION FAILED · '+error.message);
        observationPanelOutput(error.stack || error.message);
        throw error;
    }
}


const CONTROLLED_SPARSE_HINGE_CODES=['S1-P','S2-P','S3-P','S1-D','S2-D','S3-D'];
const CONTROLLED_SPARSE_ANATOMY_CODES=['PFCL','PRP','DFCL','DRP'];

function applyControlledObservationSelection(codes){
    const panel=document.getElementById('observationTestPanel');
    if(!panel) throw new Error('Observation Test Panel is not available.');

    panel.querySelectorAll('input[data-observation-code]').forEach(el=>{el.checked=false;});
    for(const view of ['AP','LAT']){
        for(const code of codes){
            const selector=`input[data-observation-view="${view}"][data-observation-code="${code}"]`;
            const el=panel.querySelector(selector);
            if(!el) throw new Error(`Missing ${view} observation control: ${code}`);
            el.checked=true;
        }
    }
    return selectedObservationCodesByView();
}

function runControlledSparseThreePlusThree(){
    const selectedByView=applyControlledObservationSelection(CONTROLLED_SPARSE_HINGE_CODES);
    observationPanelStatus(
        `CONTROLLED SPARSE 3+3 · AP ${selectedByView.AP.length} · LAT ${selectedByView.LAT.length} selected`
    );
    return runObservationTestPanelReconstruction();
}

function runControlledSparseAnatomy(){
    const selectedByView=applyControlledObservationSelection([
        ...CONTROLLED_SPARSE_HINGE_CODES,
        ...CONTROLLED_SPARSE_ANATOMY_CODES
    ]);
    observationPanelStatus(
        `CONTROLLED SPARSE 3+3 + ANATOMY · AP ${selectedByView.AP.length} · LAT ${selectedByView.LAT.length} selected`
    );
    return runObservationTestPanelReconstruction();
}



/* ============================================================
   R519 — WAY #2: VTK → XrayObservation v2 VALIDATION ONLY
   ------------------------------------------------------------
   This test deliberately STOPS at the observation boundary.
   It does not call Reconstruction and does not compare clinical values.

   Flow:
       synthetic AP/LAT image
            → native VTK marking
            → XrayObservation v2
            → semantic/geometry validation

   Synthetic scene data may be used to generate the developer image, but
   synthetic truth is never accepted as the observation result.
   ============================================================ */
function setObservationWorkflowStatus(text){
    // R559: preserve the existing workspace DOM ID; only the JS helper was renamed.
    const el=document.getElementById('r514ObservationStatus');
    if(el) el.textContent=text;
}
function renderObservationWorkflowOutput(value){
    // R559: preserve the existing workspace DOM ID; only the JS helper was renamed.
    const el=document.getElementById('r514ObservationOutput');
    if(el) el.textContent=typeof value==='string' ? value : JSON.stringify(value,null,2);
}
function getCurrentVtkObservation(expectedView){
    const vtk=r369GetVtkWindow();
    const observation=typeof vtk.getXrayObservation==='function'
        ? vtk.getXrayObservation()
        : vtk.XrayObservation;
    if(!observation) throw new Error(`R514 — no XrayObservation returned by VTK for ${expectedView}.`);
    if(observation.version!=='xray-observation-v2'){
        throw new Error(`R514 — expected XrayObservation v2; received ${observation.version || 'none'}.`);
    }
    const view=observation.images?.[0]?.view;
    if(view!==expectedView) throw new Error(`R514 — expected ${expectedView}; received ${view || 'none'}.`);
    return JSON.parse(JSON.stringify(observation));
}
function isFiniteImagePoint(a){
    return Array.isArray(a) && a.length===2 && Number.isFinite(Number(a[0])) && Number.isFinite(Number(a[1]));
}
function validateXrayObservation(observation, expectedView){
    const errors=[];
    // These are supported semantic codes, not required codes. AP/LAT may
    // legitimately contain different sparse subsets; missing codes are
    // reported as completeness information and are never a contract failure.
    const supportedSemanticCodes=['S1-P','S2-P','S3-P','S4-P','S5-P','S6-P','S1-D','S2-D','S3-D','S4-D','S5-D','S6-D','PFCL','PRP','DFCL','DRP','LOC'];
    const warnings=[];
    const image=observation?.images?.[0] || null;
    const annotations=Array.isArray(observation?.annotations) ? observation.annotations : [];
    if(!image) errors.push('missing images[0]');
    if(image && image.view!==expectedView) errors.push(`view mismatch: ${image.view || 'none'}`);
    if(!annotations.length) errors.push('no annotations');
    const codes=[];
    const forbidden=['model3D','truth','syntheticTruth','cameraMatrix','framePose','case','currentCase'];
    annotations.forEach((a,i)=>{
        const code=String(a?.code || a?.label || a?.semantic?.code || '').trim();
        if(!code) errors.push(`annotation ${i+1}: missing semantic code`); else codes.push(code);
        if(code === 'MASTER' || code === 'masterTabReference') errors.push('Master Tab marking is not supported: rotation must be reconstructed automatically from frame geometry.');
        const geometry=String(a?.geometry || '').toLowerCase();
        if(geometry!=='point' && geometry!=='line') errors.push(`annotation ${code || i+1}: invalid geometry '${geometry || 'missing'}'`);
        if(geometry==='point' && !isFiniteImagePoint(a?.point?.image)) errors.push(`annotation ${code || i+1}: invalid point.image`);
        if(geometry==='line' && (!isFiniteImagePoint(a?.pointA?.image) || !isFiniteImagePoint(a?.pointB?.image))) errors.push(`annotation ${code || i+1}: invalid line image endpoints`);
        if(a?.point?.physical && !Array.isArray(a.point.physical)) errors.push(`annotation ${code || i+1}: invalid point.physical`);
        if(a?.pointA?.physical && !Array.isArray(a.pointA.physical)) errors.push(`annotation ${code || i+1}: invalid pointA.physical`);
        if(a?.pointB?.physical && !Array.isArray(a.pointB.physical)) errors.push(`annotation ${code || i+1}: invalid pointB.physical`);
        forbidden.forEach(key=>{ if(Object.prototype.hasOwnProperty.call(a,key)) errors.push(`annotation ${code || i+1}: forbidden field '${key}' leaked into observation`); });
    });
    const duplicates=codes.filter((c,i)=>codes.indexOf(c)!==i);
    if(duplicates.length) errors.push(`duplicate semantic codes: ${[...new Set(duplicates)].join(', ')}`);
    const missingSupportedCodes=supportedSemanticCodes.filter(code=>!codes.includes(code));
    const unexpectedCodes=codes.filter(code=>!supportedSemanticCodes.includes(code));
    if(unexpectedCodes.length) warnings.push(`additional semantic codes: ${[...new Set(unexpectedCodes)].join(', ')}`);
    if(!observation.provenance) warnings.push('provenance is missing');
    const result={
        view:expectedView,
        contract:observation.version,
        image:{
            id:image?.id ?? image?.imageId ?? null,
            view:image?.view ?? null,
            width:image?.width ?? image?.columns ?? null,
            height:image?.height ?? image?.rows ?? null,
            coordinateSystem:{
                image:image?.imageCoordinateSystem ?? null,
                physical:image?.physicalCoordinateSystem ?? null
            }
        },
        annotationCount:annotations.length,
        supportedSemanticCodes,
        semanticCodes:codes,
        missingSupportedCodes,
        unexpectedCodes:[...new Set(unexpectedCodes)],
        duplicateCodes:[...new Set(duplicates)],
        errors,
        warnings,
        pass:errors.length===0
    };
    return result;
}
function validateCurrentXrayView(expectedView){
    try{
        const observation=getCurrentVtkObservation(expectedView);
        const validation=validateXrayObservation(observation,expectedView);
        window.xrayWay2Observations=window.xrayWay2Observations || {};
        window.xrayWay2Observations[expectedView]=observation;
        setObservationWorkflowStatus(`R519 — ${expectedView} observation validation: ${validation.pass ? 'PASS' : 'FAIL'} · ${validation.annotationCount} annotation(s) · completeness ${validation.missingSupportedCodes.length ? 'partial' : 'full'}`);
        renderObservationWorkflowOutput({validation,observation});
        return validation;
    }catch(error){
        setObservationWorkflowStatus('R519 — VALIDATION FAILED · '+error.message);
        renderObservationWorkflowOutput(error.stack || error.message);
        return {pass:false,errors:[error.message]};
    }
}
function renderLiveXrayObservation(){
    const el=document.getElementById('r514LiveObservationOutput');
    if(!el) return;
    try{
        const vtk=r369GetVtkWindow();
        const observation=typeof vtk?.getXrayObservation==='function'
            ? vtk.getXrayObservation()
            : vtk?.XrayObservation;
        if(!observation){
            el.textContent=JSON.stringify({status:'waiting-for-vtk-observation'},null,2);
            return;
        }
        const view=observation.images?.[0]?.view || null;
        const annotations=Array.isArray(observation.annotations) ? observation.annotations : [];
        el.textContent=JSON.stringify({
            live:true,
            view,
            annotationCount:annotations.length,
            observation
        },null,2);
    }catch(error){
        el.textContent=JSON.stringify({live:true,status:'VTK observation unavailable',message:error.message},null,2);
    }
}
function startLiveXrayObservation(){
    if(window.__r519LiveObservationTimer) return;
    renderLiveXrayObservation();
    window.__r519LiveObservationTimer=setInterval(renderLiveXrayObservation,250);
}

function getWay2SyntheticConfig(){
    // The popup's latest Run action stores its exact input configuration here.
    // Reuse that configuration for Way #2 instead of silently rebuilding a
    // default-angle case. The AP case is then retained and reused for LAT.
    const source=window.xraySyntheticReconstructionTestConfig || window.syntheticXrayObservationPoolConfig;
    return source && typeof source==="object" ? JSON.parse(JSON.stringify(source)) : null;
}

async function loadSyntheticAPForWay2(){
    try{
        const activeConfig=getWay2SyntheticConfig();
        const retainedCase=window.xraySyntheticGeneratedCase || null;
        // R623: if the popup has already generated a case in this page session,
        // load that exact in-memory case. Only open the popup when no generated
        // case is retained; never silently create a Way-2-specific default.
        if(!retainedCase || !activeConfig){
            setObservationWorkflowStatus('R623 — CONFIGURATION REQUIRED · no generated synthetic case is retained in memory. Choose the configuration in the R257 popup, press Run, then click Load Synthetic AP again.');
            renderObservationWorkflowOutput('No generated synthetic case is retained in memory. The R257 configuration popup is opening. Run it to create the case, then click Load Synthetic AP again. Way 2 will not generate a default case.');
            openSyntheticReconstructionDialog(document.getElementById('r514LoadAPButton'));
            return null;
        }
        r369RequireSyntheticApi();
        const angle=Number(activeConfig.imaging?.latPlaneAngleDeg);
        if(!Number.isFinite(angle)||angle<=0||angle>180){
            throw new Error('The saved synthetic configuration has an invalid LAT camera angle. Reopen the R257 popup, correct the angle, and press Run.');
        }
        r369SyntheticCase=retainedCase;
        window.xrayWay2SyntheticConfig=JSON.parse(JSON.stringify(activeConfig));
        const scene=r369BuildScene(r369SyntheticCase,'AP');
        const result=await r579LoadSyntheticSceneIntoBigVtk(scene);
        window.xrayWay2Observations={};
        window.xrayWay2ObservationSet=null;
        startLiveXrayObservation();
        setObservationWorkflowStatus(`R623 — retained in-memory synthetic AP case loaded · LAT angle ${angle}° · ${result.calibrationCount} calibration marks · ${result.lineCount} reference lines · ${result.pointCount} reference points · native VTK ready for marking`);
        renderObservationWorkflowOutput('Mark/assign the AP observations in the VTK viewer. Then click Validate AP. LAT will reuse this exact generated case.');
        return result;
    }catch(error){
        setObservationWorkflowStatus('R623 — AP LOAD FAILED · '+error.message);
        renderObservationWorkflowOutput(error.stack || error.message);
        return null;
    }
}
function validateWay2AP(){
    try{
        const AP=getCurrentVtkObservation('AP');
        const validation=validateXrayObservation(AP,'AP');
        window.xrayWay2Observations=window.xrayWay2Observations || {};
        window.xrayWay2Observations.AP={observation:AP,validation};
        setObservationWorkflowStatus(`R519 — AP validation: ${validation.pass ? 'PASS' : 'FAIL'} · ${validation.annotationCount} annotation(s) · completeness ${validation.missingSupportedCodes.length ? 'partial' : 'full'}`);
        renderObservationWorkflowOutput({validation,observation:AP});
        return validation;
    }catch(error){
        setObservationWorkflowStatus('R519 — AP VALIDATION FAILED · '+error.message);
        renderObservationWorkflowOutput(error.stack || error.message);
        return {pass:false,errors:[error.message]};
    }
}
async function loadWay2LAT(){
    try{
        const APState=window.xrayWay2Observations?.AP;
        if(!APState?.observation || APState.validation?.pass!==true){
            throw new Error('R519 — AP must be successfully validated before loading LAT.');
        }
        if(!r369SyntheticCase){
            throw new Error('R623 — the AP synthetic case is missing; load the R257-generated AP case first so LAT uses the same case/configuration.');
        }
        const activeConfig=window.xrayWay2SyntheticConfig || getWay2SyntheticConfig();
        const scene=r369BuildScene(r369SyntheticCase,'LAT');
        const result=await r579LoadSyntheticSceneIntoBigVtk(scene);
        startLiveXrayObservation();
        setObservationWorkflowStatus(`R623 — AP PASS retained · LAT loaded from the same retained in-memory synthetic case · LAT angle ${activeConfig?.imaging?.latPlaneAngleDeg ?? 90}° · ${result.calibrationCount} calibration marks · native VTK ready for marking`);
        renderObservationWorkflowOutput({AP:APState.validation,LAT:'ready for marking'});
        return result;
    }catch(error){
        setObservationWorkflowStatus('R623 — LAT LOAD FAILED · '+error.message);
        renderObservationWorkflowOutput(error.stack || error.message);
        return null;
    }
}
function runR641CoordinateAudit(view){
    const status=document.getElementById('r514ObservationStatus');
    const output=document.getElementById('r514ObservationOutput');
    const requestedView=String(view||'').toUpperCase();
    try{
        if(requestedView!=='AP' && requestedView!=='LAT') throw new Error('Choose the AP or LAT audit button so the correct VTK panel is inspected.');
        // R641: Way 2 now uses the two clinical AP/LAT iframes, not the legacy
        // xrayVtkFrame used by older synthetic-scene test helpers.
        const vtk=getXrayPanelWindow(requestedView);
        if(typeof vtk.getXrayCoordinateAudit!=='function'){
            const url=(()=>{try{return vtk.location?.href||'(unavailable)';}catch(_){return '(cross-origin)';}})();
            throw new Error(`R641 ${requestedView} coordinate audit API is unavailable in #${requestedView==='AP'?'xrayAPVtkFrame':'xrayLATVtkFrame'}. The panel may still be serving an older main.js build. Iframe URL: ${url}`);
        }
        const audit=vtk.getXrayCoordinateAudit();
        const observation=typeof vtk.getXrayObservation==='function' ? vtk.getXrayObservation() : vtk.XrayObservation;
        const payload={requestedView,iframeId:requestedView==='AP'?'xrayAPVtkFrame':'xrayLATVtkFrame',audit,observationSummary:{version:observation?.version||null,view:observation?.images?.[0]?.view||null,imageId:observation?.images?.[0]?.id||null,dimensions:[observation?.images?.[0]?.width??null,observation?.images?.[0]?.height??null],annotationCount:observation?.annotations?.length||0,annotations:(observation?.annotations||[]).map(a=>({id:a.id,code:a.code,geometry:a.geometry,point:a.point?.image||null,pointA:a.pointA?.image||null,pointB:a.pointB?.image||null}))}};
        window.xrayR641CoordinateAudits=window.xrayR641CoordinateAudits||{};
        window.xrayR641CoordinateAudits[requestedView]=payload;
        const pass=audit.coordinateErrorCount===0 && audit.annotationCount===payload.observationSummary.annotationCount && (!audit.view || audit.view===requestedView);
        if(status) status.textContent=`R641 ${requestedView} COORDINATE AUDIT ${pass?'PASS':'CHECK'} · ${audit.view||'view unknown'} · ${audit.annotationCount} annotation(s) · ${audit.coordinateErrorCount} coordinate error(s) · internal mapping only`;
        if(output) output.textContent=JSON.stringify(payload,null,2);
        return payload;
    }catch(error){
        if(status) status.textContent=`R641 ${requestedView||'VIEW'} COORDINATE AUDIT FAILED · `+String(error?.message||error);
        if(output) output.textContent=error?.stack||String(error?.message||error);
        return {pass:false,error:String(error?.message||error)};
    }
}
function runR641AuditAP(){return runR641CoordinateAudit('AP');}
function runR641AuditLAT(){return runR641CoordinateAudit('LAT');}

function validateWay2LAT(){
    try{
        const LAT=getCurrentVtkObservation('LAT');
        const validation=validateXrayObservation(LAT,'LAT');
        window.xrayWay2Observations=window.xrayWay2Observations || {};
        window.xrayWay2Observations.LAT={observation:LAT,validation};
        setObservationWorkflowStatus(`R519 — LAT validation: ${validation.pass ? 'PASS' : 'FAIL'} · ${validation.annotationCount} annotation(s) · completeness ${validation.missingSupportedCodes.length ? 'partial' : 'full'}`);
        renderObservationWorkflowOutput({validation,observation:LAT});
        return validation;
    }catch(error){
        setObservationWorkflowStatus('R519 — LAT VALIDATION FAILED · '+error.message);
        renderObservationWorkflowOutput(error.stack || error.message);
        return {pass:false,errors:[error.message]};
    }
}
function finalizeWay2Observations(){
    const APState=window.xrayWay2Observations?.AP;
    const LATState=window.xrayWay2Observations?.LAT;
    const errors=[];
    if(!APState?.observation) errors.push('AP observation has not been validated');
    if(!LATState?.observation) errors.push('LAT observation has not been validated');
    if(APState?.validation?.pass!==true) errors.push('AP validation did not PASS');
    if(LATState?.validation?.pass!==true) errors.push('LAT validation did not PASS');
    const AP=APState?.observation || null;
    const LAT=LATState?.observation || null;
    const apView=AP?.images?.[0]?.view ?? null;
    const latView=LAT?.images?.[0]?.view ?? null;
    if(AP && apView!=='AP') errors.push(`saved AP observation has view ${apView || 'none'}`);
    if(LAT && latView!=='LAT') errors.push(`saved LAT observation has view ${latView || 'none'}`);
    // Annotation IDs are scoped to their source X-ray observation/image.
    // Therefore annotation-1 on AP and annotation-1 on LAT are different
    // annotations and MUST NOT be treated as duplicates. PRP/DRP may also
    // legitimately occur once in each view.
    const apIds=(AP?.annotations || []).map(a=>a.id).filter(Boolean);
    const latIds=(LAT?.annotations || []).map(a=>a.id).filter(Boolean);
    const duplicateIdsWithinAP=[...new Set(apIds.filter((id,i)=>apIds.indexOf(id)!==i))];
    const duplicateIdsWithinLAT=[...new Set(latIds.filter((id,i)=>latIds.indexOf(id)!==i))];
    if(duplicateIdsWithinAP.length) errors.push(`duplicate annotation IDs within AP: ${duplicateIdsWithinAP.join(', ')}`);
    if(duplicateIdsWithinLAT.length) errors.push(`duplicate annotation IDs within LAT: ${duplicateIdsWithinLAT.join(', ')}`);
    const sharedAnnotationIds=[...new Set(apIds.filter(id=>latIds.includes(id)))];
    const result={
        version:'xray-observation-set-v2',
        AP,
        LAT,
        provenance:{producer:'R519 X-ray observation boundary',contract:'renderer-neutral-semantic-v2'},
        validation:{
            AP:APState?.validation || {pass:false,errors:['AP validation missing']},
            LAT:LATState?.validation || {pass:false,errors:['LAT validation missing']},
            setLevel:{
                APView:apView,
                LATView:latView,
                duplicateAnnotationIdsWithinAP:duplicateIdsWithinAP,
                duplicateAnnotationIdsWithinLAT:duplicateIdsWithinLAT,
                sharedAnnotationIdsAcrossViews:sharedAnnotationIds,
                annotationIdScope:'per-view observation; shared IDs across AP/LAT are allowed',
                errors,
                pass:errors.length===0
            },
            pass:errors.length===0
        }
    };
    window.xrayWay2ObservationSet=result;
    setObservationWorkflowStatus(`R519 — FINALIZE AP + LAT: ${result.validation.pass ? 'PASS · observation set ready for reconstruction' : 'FAIL'}`);
    renderObservationWorkflowOutput(result);
    return result;
}

function initializeObservationTestPanel(){
    /*
       Capture-phase delegation is intentional. The workspace controls may
       be inserted dynamically and other page handlers may otherwise stop
       propagation before a bubbling listener sees the click.
    */
    if(window.__observationTestPanelDelegatedBound) return;
    window.__observationTestPanelDelegatedBound=true;

    document.addEventListener('click',function(event){
        const target=event.target && typeof event.target.closest==='function'
            ? event.target.closest('button')
            : null;
        if(!target) return;

        const id=target.id;
        const panel=document.getElementById('observationTestPanel');
        if(!panel) return;
        if(!panel.contains(target)) return;

        const setViewSelection=(view,checked)=>{
            panel.querySelectorAll(
                `input[type="checkbox"][data-observation-view="${view}"][data-observation-code]`
            ).forEach(input=>{ input.checked=checked; });

            const selectedByView=selectedObservationCodesByView();
            observationPanelStatus(
                `AP ${selectedByView.AP.length} selected · LAT ${selectedByView.LAT.length} selected`
            );
        };

        switch(id){
            case 'observationSelectAllApButton':
                setViewSelection('AP',true);
                return;
            case 'observationClearAllApButton':
                setViewSelection('AP',false);
                return;
            case 'observationSelectAllLatButton':
                setViewSelection('LAT',true);
                return;
            case 'observationClearAllLatButton':
                setViewSelection('LAT',false);
                return;
            case 'observationRunButton':
                runObservationTestPanelReconstruction().catch(()=>{});
                return;
            case 'observationRunSparseThreePlusThreeButton':
                runControlledSparseThreePlusThree().catch(()=>{});
                return;
            case 'observationControlledSparseAnatomyButton':
                runControlledSparseAnatomy().catch(()=>{});
                return;
            default:
                return;
        }
    },true);
}

/* =========================================================
   R561 — FULL WORKSPACE WIRING AUDIT + PANEL BINDINGS
   ---------------------------------------------------------
   This UI bridge consumes the already validated renderer-neutral AP/LAT
   observation set. It does not modify reconstruction mathematics.
   ========================================================= */
function runFinalizedWay2Reconstruction(){
    const status=document.getElementById('r514ObservationStatus');
    const output=document.getElementById('r514ObservationOutput');
    try{
        // Rebuild the set from saved AP/LAT observations and re-check its
        // set-level validation rather than trusting stale UI state.
        const set=finalizeWay2Observations();
        if(!set || set.validation?.pass!==true){
            throw new Error('Finalize AP + LAT must PASS before reconstruction.');
        }
        if(!window.Reconstruction || typeof window.Reconstruction.reconstruct!=='function'){
            throw new Error('Protected Reconstruction.reconstruct API is unavailable.');
        }

        // R623: call the protected engine directly here. The shared
        // runXrayReconstructionInput() helper also writes to Way 3's output
        // panel; Way 2 must not replace the independent R257 round-trip report.
        const result=window.Reconstruction.reconstruct(set);
        window.xrayReconstructionInput=set;
        window.xrayReconstructionResult=result;
        window.xrayWay2ReconstructionResult=result;

        if(status){
            const outcome=result && (result.valid===true || result.pass===true)
                ? 'ENGINE RETURNED VALID RESULT'
                : result ? 'ENGINE RETURNED RESULT — inspect diagnostics' : 'ENGINE CALL FAILED';
            status.textContent='R623 — protected reconstruction: '+outcome;
        }
        if(output){
            output.textContent=JSON.stringify({
                stage:'R623 — Way 2 → protected reconstruction (isolated output)',
                source:'R560 finalized Way 2 native VTK XrayObservation v2 set',
                inputVersion:set.version,
                AP:{annotations:set.AP?.annotations?.length||0,view:set.AP?.images?.[0]?.view||null},
                LAT:{annotations:set.LAT?.annotations?.length||0,view:set.LAT?.images?.[0]?.view||null},
                finalizeValidation:set.validation,
                reconstructionResult:result
            },null,2);
        }
        return result;
    }catch(error){
        if(status) status.textContent='R623 — RECONSTRUCTION BRIDGE FAILED · '+String(error?.message||error);
        if(output) output.textContent=error?.stack||String(error?.message||error);
        return null;
    }
}

function initializeWay2AndDicomControls(){
    const bindings = [
        ['r514LoadAPButton', loadSyntheticAPForWay2],
        ['r514ValidateAPButton', validateWay2AP],
        ['r641CoordinateAuditAPButton', runR641AuditAP],
        ['r641CoordinateAuditLATButton', runR641AuditLAT],
        ['r514LoadLATButton', loadWay2LAT],
        ['r514ValidateLATButton', validateWay2LAT],
        ['r514FinalizeButton', finalizeWay2Observations],
        ['r540RunReconstructionButton', runFinalizedWay2Reconstruction],
        ['r413LoadAPDicomButton', r413LoadAPAsDicom],
        ['r413CaptureAPDicomButton', r413CaptureAPLoadLATAsDicom]
    ];

    bindings.forEach(([id, handler]) => {
        const element = document.getElementById(id);
        if(!element || element.dataset.xrayControlBound === '1') return;
        element.addEventListener('click', handler);
        element.dataset.xrayControlBound = '1';
    });

    const r413Run = document.getElementById('r413RunDicomButton');
    if(r413Run && r413Run.dataset.xrayControlBound !== '1'){
        r413Run.addEventListener('click', () => r369RunPointReconstruction(r413Status, r413Output, 'R415'));
        r413Run.dataset.xrayControlBound = '1';
    }
}



/* R555 — Reliable delegated copy for dynamically injected X-ray result panels. */
if(!window.__R555_COPY_RESULTS_HANDLER_INSTALLED__){
  window.__R555_COPY_RESULTS_HANDLER_INSTALLED__=true;
  if(!window.__xrayProductionCopyResultsDelegated){
  window.__xrayProductionCopyResultsDelegated = true;
  document.addEventListener("click", async function(event){
    const button = event.target && event.target.closest
      ? event.target.closest("#xrayProductionCopyResultsButton") : null;
    if(!button) return;
    event.preventDefault();
    ensureProductionResultControls();
    const summary = document.getElementById("xrayProductionClinicalSummary");
    const output = document.getElementById("xrayProductionResultOutput");
    const status = document.getElementById("xrayProductionResultStatus");
    const report = [
      "CLINICAL SUMMARY",
      summary?.innerText || summary?.textContent || "No clinical summary yet.",
      "",
      "RESULT STATUS",
      status?.innerText || status?.textContent || "No status yet.",
      "",
      "DETAILED JSON REPORT",
      output?.innerText || output?.textContent || "No JSON report yet."
    ].join("\n");
    const original = button.textContent;
    try{
      if(navigator.clipboard && typeof navigator.clipboard.writeText === "function"){
        await navigator.clipboard.writeText(report);
      }else{
        const area = document.createElement("textarea");
        area.value = report; area.readOnly = true;
        area.style.cssText = "position:fixed;left:-9999px;top:0;";
        document.body.appendChild(area); area.focus(); area.select();
        area.setSelectionRange(0, area.value.length);
        const copied = document.execCommand("copy"); area.remove();
        if(!copied) throw new Error("Browser rejected clipboard copy.");
      }
      button.textContent = "Copied ✓";
      button.title = "Clinical summary, status, and detailed JSON copied";
    }catch(error){
      button.textContent = "Copy failed — select report";
      button.title = String(error?.message || error);
      if(output && typeof window.getSelection === "function"){
        const range = document.createRange();
        range.selectNodeContents(output);
        const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      }
    }
    window.setTimeout(()=>{ if(button.isConnected) button.textContent = original || "Copy results"; }, 1800);
  }, true);
}

document.addEventListener('click',async function(event){
    const button=event.target&&event.target.closest?event.target.closest('.xray-copy-results-button[data-copy-target], #copyReconstructionJsonResultButton'):null;
    if(!button)return;
    event.preventDefault();
    const targetId=button.getAttribute('data-copy-target');
    const target=targetId?document.getElementById(targetId):null;
    let value='';
    if(button.id==='copyReconstructionJsonResultButton'){
      value=window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_RESULT__||'';
    }else if(targetId==='xrayReconstructionApiOutput'){
      value=window.__LAST_RECONSTRUCTION_SYNTHETIC_TEST_HUMAN_RESULT__||target?.innerText||target?.textContent||'';
    }else{
      value=target?.innerText||target?.textContent||'';
    }
    if(!target&&!value){button.textContent='No results yet';return;}
    const original=button.textContent;
    try{
      if(navigator.clipboard&&typeof navigator.clipboard.writeText==='function'){
        await navigator.clipboard.writeText(value);
      }else{
        const ta=document.createElement('textarea');ta.value=value;ta.readOnly=true;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);
        const ok=document.execCommand('copy');ta.remove();if(!ok)throw new Error('Browser rejected clipboard copy.');
      }
      button.textContent='Copied ✓';button.title='Results copied to clipboard';
    }catch(error){
      button.textContent='Copy failed';button.title=String(error?.message||error);
      // Make failure recoverable: select the target/output text so the user can copy manually.
      if(target&&typeof window.getSelection==='function'){
        const range=document.createRange();range.selectNodeContents(target);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      }
    }
    window.setTimeout(()=>{if(button.isConnected){button.textContent=original||'Copy results';}},1800);
  },true);
}
