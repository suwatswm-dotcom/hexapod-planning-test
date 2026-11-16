/*
R1172.6 — Browser-owned CASE runtime and local commit boundary; preserves connected/standalone controls and canonical AP/LAT reset helper.
Based on the R1145.9 patient.js implementation; preserves its Connected WIP serialization and mode-boundary behaviour.
Install this file as: /content/drive/MyDrive/Simulation/patient.js (rename downloaded .js.html to .js)

Purpose:
- Keep the Patient form and SPA controller browser-owned.
- Use window.currentCase as the only active in-memory CASE authority.
- Use portable ZIP, IndexedDB and Supabase services for their respective save/recovery workflows.
- Do not depend on Flask CASE or legacy server JSON save/load routes.
*/

// R853 compatibility repair (retained in R854): some saved CASE files may lack the patient
// object even though the current Patient workspace expects it. Preserve every
// existing patient value and add only missing fields; never replace the CASE.
async function ensurePatientSection(caseObject){
    const c = caseObject || await ensureCurrentCase();
    if (!c || typeof c !== "object" || Array.isArray(c)) {
        throw new Error("No valid CASE object is available.");
    }

    let changed = false;
    if (!c.patient || typeof c.patient !== "object" || Array.isArray(c.patient)) {
        c.patient = {};
        changed = true;
    }

    const defaults = {
        patient_name: "enter name ",
        patient_id: "enter ID",
        hospital: "enter hospital",
        surgeon: "enter surgeon",
        notes: "enter notes"
    };
    for (const [key, defaultValue] of Object.entries(defaults)) {
        if (!(key in c.patient)) {
            c.patient[key] = defaultValue;
            changed = true;
        }
    }

    // Keep the browser-local CASE commit boundary intact.
    if (changed && c === window.currentCase && typeof syncCurrentCase === "function") {
        await syncCurrentCase();
    }
    return c;
}

// R854: the Patient workspace is the edit owner for these four fields.
// Mirror them into metadata before the browser-local CASE commit.
async function commitPatientAndMetadata(options = {}){
    const c = await ensurePatientSection();
    if (!c.metadata || typeof c.metadata !== "object" || Array.isArray(c.metadata)) {
        c.metadata = {};
    }

    // Use the existing collector so the visible form remains the source of edits.
    collectPatient();
    const fieldMap = {
        patient_name: "patient_name",
        patient_id: "patient_id",
        hospital: "hospital",
        surgeon: "surgeon"
    };
    for (const [patientKey, metadataKey] of Object.entries(fieldMap)) {
        c.metadata[metadataKey] = c.patient[patientKey] ?? "";
    }

    if (typeof syncCurrentCase === "function") {
        await syncCurrentCase();
    }
    // R1145.9: A manual Connected WIP save already persists this commit directly.
    // Suppress only its redundant autosave notification; ordinary Patient commits
    // continue to emit the qualified CASE-change event.
    if (!options.suppressChangeEvent && window.CaseChangeCoordinator?.emit) {
        window.CaseChangeCoordinator.emit({
            domain: 'case', operation: 'update', source: 'patient',
            reason: 'Patient workspace committed'
        });
    }
}

// R916 — fresh CASE mirrors simulation_ui.py CaseBuilder defaults.
// It replaces only the active CASE. Portable ZIP files and R913 local recovery snapshots are untouched.
function r914BuildDefaultCase(existingCase){
    const now = new Date().toISOString();
    const planner = existingCase?.metadata?.planner || "Analysis";
    return {
        metadata: {
            version: 1,
            case_name: "Demo Case xz",
            planner,
            case_created: now,
            case_modified: "",
            file_saved: ""
        },
        patient: {
            patient_name: "enter name ",
            patient_id: "enter ID",
            hospital: "enter hospital",
            surgeon: "enter surgeon",
            notes: "enter notes"
        },
        deformity: {
            ap_translation: { value: 22, direction: "medial" },
            ap_angulation: { value: 6, direction: "valgus" },
            lat_translation: { value: 1, direction: "posterior" },
            lat_angulation: { value: 14, direction: "anterior" },
            bone_length: { value: 2, direction: "short" },
            bone_rotation: { value: 5, direction: "internal" },
            loc: {
                enabled: false,
                ap: { value: 38, direction: "lateral" },
                lat: { value: 24, direction: "posterior" },
                axial: { value: 42, direction: "proximal" }
            }
        },
        frame: {
            hardware: "Hexapod",
            proximal_ring_diameter: 180,
            distal_ring_diameter: 180,
            strut_size: "M",
            master_tab_position: "standard",
            initial_strut_lengths: [146, 155, 179, 132, 180, 141]
        },
        mounting: {
            ap_offset: { value: 16, direction: "lateral" },
            ap_tilt: { value: 1, direction: "proximal" },
            lat_offset: { value: 34, direction: "posterior" },
            lat_tilt: { value: 11, direction: "distal" },
            axial_offset: { value: 46, direction: "proximal" },
            master_rotation: { value: 5, direction: "internal" }
        },
        parameters: {
            ANCHOR_RADIUS: 113.5,
            BONE_PROX_ORIGIN: [16, 34, -46],
            R_PROX_ANGLES: [5, 11, -1],
            CLINICAL_OFFSET: [22, -1, 2],
            CLINICAL_ANGLES: [-5, -14, 6],
            PHASE1_DAY0_STRUTS: [146, 155, 179, 132, 180, 141]
        },
        treatment: { selected_stage_id: null, stages: [] },
        prescription: null,
        planner_result: null,
        simulation: { day: 0, total_days: 0 }
    };
}

// R1172.4: expose the existing CASE factory as the application bootstrap API.
// This is the same factory already used by New Case and operating-mode resets.
window.r914BuildDefaultCase = r914BuildDefaultCase;

async function initializeR914NewCaseButton(){
    const button = document.getElementById("r914NewCaseButton");
    const status = document.getElementById("r887CaseFileStatus");
    if (!button || button.dataset.r914Bound === "1") return;
    button.dataset.r914Bound = "1";
    button.addEventListener("click", async () => {
        if (button.disabled) return;
        const confirmed = window.confirm(
            "Start a new case using the application's default values?\n\n" +
            "The active patient/case data and AP/LAT images and annotations will be replaced.\n" +
            "Existing ZIP files and saved local recovery cases will not be deleted."
        );
        if (!confirmed) return;
        const otherButtonIds = ["r887OpenCaseButton", "r887SaveCaseButton", "r913SaveLocalCaseButton", "r913OpenLocalCaseButton"];
        const otherButtons = otherButtonIds.map(id => document.getElementById(id)).filter(Boolean);
        button.disabled = true;
        otherButtons.forEach(b => b.disabled = true);
        // R1112 — New Case is one recovery-observer transaction.
        const say = message => { if (status) status.textContent = "R1112 — " + message; };
        const previousCase = window.currentCase && typeof window.currentCase === "object"
            ? JSON.parse(JSON.stringify(window.currentCase)) : null;
        let caseCommitAttempted = false;
        let resetCommitted = false;
        // R1112 — hold the full-case recovery observer across the ENTIRE New Case
        // transaction: browser CASE replacement/commit, AP/LAT iframe reset, and any
        // CASE rollback. Without this guard the observer can capture a hybrid
        // state (new CASE + one old/one resetting X-ray panel).
        const recoveryTransition = typeof window.beginCaseTransition === "function"
            ? window.beginCaseTransition("New Case: browser CASE plus AP/LAT reset") : null;
        try {
            const freshCase = r914BuildDefaultCase(previousCase);
            window.currentCase = freshCase;
            if (typeof syncCurrentCase !== "function") throw new Error("syncCurrentCase() is unavailable; default CASE was not committed.");
            caseCommitAttempted = true;
            say("SETTING DEFAULTS · Building and validating a fresh browser CASE…");
            await syncCurrentCase();
            if (!window.currentCase?.metadata || !window.currentCase?.parameters || window.currentCase.debug_sync?.success !== true) {
                throw new Error(window.currentCase?.debug_sync?.error || "The new browser CASE failed parameter validation.");
            }
            // Keep a JSON-safe canonical snapshot for the remainder of this transaction.
            window.currentCase = JSON.parse(JSON.stringify(window.currentCase));

            say("CLEARING X-RAYS · Capturing AP/LAT rollback checkpoints…");
            if (typeof window.clearActiveXrayWorkspaces !== "function") {
                throw new Error("The R914 AP/LAT reset helper is not loaded.");
            }
            // This helper checkpoints both views before clearing and attempts rollback if either view fails.
            const xrayResult = await window.clearActiveXrayWorkspaces();
            if (xrayResult?.status !== "PASS") throw new Error(xrayResult?.message || "AP/LAT reset was not confirmed.");
            resetCommitted = true;
            // Reset visible and deferred X-ray status/diagnostic UI so it cannot
            // continue to describe the previous CASE after a successful New Case.
            if (typeof window.r916ResetXrayCaseDiagnostics === "function") {
                window.r916ResetXrayCaseDiagnostics();
            }

            await ensurePatientSection(window.currentCase);

            // Phase 1/default target are already created lazily by shared.js
            // initializeTreatmentIfNeeded(), called by populatePhases() and the
            // Treatment workspace. Do not duplicate that initialization here.

            if (typeof initializeCommittedStageSnapshots === "function") {
                initializeCommittedStageSnapshots(window.currentCase);
            }
            // A new case must not inherit an Undo transaction from the previous case.
            window.lastUndoTransaction = null;
            if (typeof updateUndoButton === "function") updateUndoButton();

            await populatePatient();
            const shellName = document.getElementById("shellCaseName");
            if (shellName) shellName.value = window.currentCase.metadata.case_name || "";

            // Cached workspaces refresh from the canonical CASE in their enter callbacks.
            if (typeof updateCurrentCaseInspector === "function") {
                updateCurrentCaseInspector({ resetScroll: true });
            }
            if (typeof refreshDeveloperDashboard === "function") await refreshDeveloperDashboard();
            say("NEW CASE READY · Case defaults restored; Phase 1/default target will be created by the existing shared.js workspace initializer; strut plan reset on Treatment entry; AP/LAT images and annotations cleared. Existing saved ZIPs and local recovery snapshots were preserved.");
        } catch (error) {
            let rollbackNote = "";
            // If CASE commit succeeded but the two-view reset did not, return CASE to its prior state.
            // The X-ray helper independently attempts to restore its checkpoints when its reset fails.
            if (caseCommitAttempted && !resetCommitted && previousCase) {
                try {
                    window.currentCase = previousCase;
                    await syncCurrentCase();
                    if (window.currentCase?.debug_sync?.success !== true) {
                        throw new Error(window.currentCase?.debug_sync?.error || "browser CASE parameter validation failed");
                    }
                    await populatePatient();
                    rollbackNote = " Previous browser CASE restored and validated.";
                } catch (rollbackError) {
                    rollbackNote = " CASE rollback needs review: " + (rollbackError?.message || String(rollbackError));
                }
            }
            say("RESET NOT CONFIRMED · " + (error?.message || String(error)) + rollbackNote + (resetCommitted ? " · CASE and X-ray reset had completed; check the visible workspace status." : ""));
        } finally {
            // Commit exactly once after all CASE and X-ray work has settled.
            // On failure, the normal observer compares the restored/current CASE
            // after the transition closes; no intermediate snapshot is committed.
            if (recoveryTransition && typeof window.endCaseTransition === "function") {
                window.endCaseTransition(recoveryTransition, {
                    committed: resetCommitted,
                    reason: resetCommitted ? "New Case reset completed" : "New Case reset did not commit"
                });
            }
            button.disabled = false;
            otherButtons.forEach(b => b.disabled = false);
        }
    });
}

async function initializePatientWorkspace(){
    await ensurePatientSection();
    await populatePatient();
    await initializeR914NewCaseButton();
    initializeWorkflowButtons();
    bindWorkspaceInputs(commitPatientAndMetadata, "workspace_patient");

    // R1172.6: the active Patient workspace uses portable ZIP, IndexedDB and
    // Supabase controls. Legacy Flask JSON save/list/load controls are retired.
    initializeOperatingModeControls();
    initializePortableCaseFileControls();
    initializeLocalCaseRepositoryControls();
    initializeSupabaseCaseStorageControls();
    await refreshDeveloperDashboard();
}

// R1143 — clean CASE/AP/LAT boundary when switching between Connected and Standalone.
// The destination may restore only its own saved record after this clean context is installed.
window.resetActiveCaseForModeSwitch = async function(reason){
    const transition = typeof window.beginCaseTransition === 'function'
        ? window.beginCaseTransition('R1145.2 operating-mode boundary: ' + String(reason || 'mode switch'))
        : null;
    let committed = false;
    try {
        const fresh = typeof r914BuildDefaultCase === 'function' ? r914BuildDefaultCase(null) : null;
        if (!fresh) throw new Error('Default CASE builder is unavailable.');
        fresh.frame.hardware = 'Hexapod';
        fresh.metadata.case_name = 'New Case';

        if (!window.WorkspaceManager || typeof window.WorkspaceManager.ensureInitialized !== 'function') {
            throw new Error('WorkspaceManager.ensureInitialized("xray") is unavailable.');
        }
        await window.WorkspaceManager.ensureInitialized('xray');
        if (typeof window.clearActiveXrayWorkspaces !== 'function') {
            throw new Error('Verified AP/LAT clear helper is unavailable.');
        }
        const cleared = await window.clearActiveXrayWorkspaces();
        if (cleared?.status !== 'PASS') {
            throw new Error(cleared?.message || 'AP/LAT workspaces could not be cleared.');
        }

        window.currentCase = fresh;
        if (typeof syncCurrentCase !== 'function') throw new Error('syncCurrentCase() is unavailable.');
        await syncCurrentCase();
        if (!window.currentCase?.metadata || !window.currentCase?.parameters || window.currentCase.debug_sync?.success !== true) {
            throw new Error(window.currentCase?.debug_sync?.error || 'Browser did not validate the clean CASE.');
        }
        const canonical = JSON.parse(JSON.stringify(window.currentCase));
        window.currentCase = canonical;
        if (typeof window.r916ResetXrayCaseDiagnostics === 'function') window.r916ResetXrayCaseDiagnostics();
        if (typeof populatePatient === 'function') await populatePatient();
        if (typeof updateCurrentCaseInspector === 'function') updateCurrentCaseInspector({ resetScroll: true });
        const shellName = document.getElementById('shellCaseName');
        if (shellName) shellName.value = canonical.metadata.case_name || '';
        window.lastUndoTransaction = null;
        if (typeof updateUndoButton === 'function') updateUndoButton();
        committed = true;
        return { status: 'PASS', caseName: canonical.metadata.case_name || 'New Case', xrayCleared: true };
    } finally {
        if (transition && typeof window.endCaseTransition === 'function') {
            window.endCaseTransition(transition, { committed, reason: 'R1145.3 clean operating-mode context installed' });
        }
    }
};

// R1143 — Connected-first, mutually exclusive mode panels with automatic transitions.
function initializeOperatingModeControls(){
    const standaloneEnabled = window.APP_FEATURES?.standaloneModeEnabled === true;
    const standaloneCard=document.getElementById('r1141OperatingModeCard');
    const showStandaloneControl=document.getElementById('r1143ShowStandalone');
    if (!standaloneEnabled) {
        if (standaloneCard) standaloneCard.hidden = true;
        if (showStandaloneControl) {
            const controlLabel = showStandaloneControl.closest('label');
            if (controlLabel) controlLabel.hidden = true;
            showStandaloneControl.checked = false;
            showStandaloneControl.disabled = true;
        }
    }
    if(!standaloneCard || standaloneCard.dataset.r1143Bound==='1') return;
    standaloneCard.dataset.r1143Bound='1';
    const ack=document.getElementById('r1141StandaloneAck');
    const button=document.getElementById('r1141StandaloneButton');
    const status=document.getElementById('r1141ModeStatus');
    const cloudCard=document.getElementById('supabaseCaseStorageCard');
    const showStandalone=document.getElementById('r1143ShowStandalone');
    const showConnected=document.getElementById('r1143ShowConnected');
    const connectedHeading=document.getElementById('r1145ConnectedModeHeading');
    const standaloneHeading=document.getElementById('r1145StandaloneModeHeading');
    const say=message=>{if(status)status.textContent='R1145.3.1 · '+message;};
    let lastMode=window.__APP_OPERATING_MODE||'resolving';
    const update=()=>{
        const mode=window.__APP_OPERATING_MODE||'resolving';
        // Clear the privacy acknowledgement only after the application has
        // actually left Standalone Mode, not merely when its Connected panel is revealed.
        if(lastMode==='standalone' && mode!=='standalone' && ack) ack.checked=false;
        lastMode=mode;
        const ready=window.__APP_STARTUP_STATE==='ready';
        const pending=!!window.__APP_MODE_TRANSITION_PENDING;
        const standaloneOptions=standaloneEnabled && !!showStandalone?.checked;
        const connectedOptions=!!showConnected?.checked;
        const canEnterStandalone=(mode==='signed-out' || mode==='connected');
        if(button) button.disabled=!(ready && !!ack?.checked && !pending && canEnterStandalone);
        if(cloudCard) cloudCard.hidden=(mode==='standalone' && !connectedOptions);
        if(standaloneCard) standaloneCard.hidden=(mode!=='standalone' && !standaloneOptions);
        if(showStandalone){showStandalone.checked=standaloneOptions;showStandalone.disabled=!standaloneEnabled || pending || mode==='standalone';}
        if(showConnected){showConnected.checked=connectedOptions;showConnected.disabled=pending || mode!=='standalone';}
        // Highlight only the active mode heading, leaving the surrounding cards neutral.
        const setHeadingActive=(heading,active)=>{
            if(!heading)return;
            heading.style.background=active?(heading===connectedHeading?'#dcfce7':'#fef3c7'):'transparent';
            heading.style.color=active?(heading===connectedHeading?'#166534':'#854d0e'):'inherit';
            heading.style.borderRadius='6px';
            heading.style.padding='6px 10px';
            heading.style.boxShadow='none';
        };
        setHeadingActive(connectedHeading,mode==='connected');
        setHeadingActive(standaloneHeading,mode==='standalone');
        if(mode==='connected'){
            say(standaloneEnabled ? 'CONNECTED MODE ACTIVE · Authenticated cloud storage is active. Standalone can be enabled from the application feature flag.' : 'CONNECTED MODE ACTIVE · Authenticated cloud storage is active. Standalone mode is disabled by the application feature flag.');
        }else if(mode==='standalone' && connectedOptions){
            say('STANDALONE MODE IS STILL ACTIVE · The Connected panel is only being displayed. Sign in there to leave Standalone Mode. The privacy acknowledgement will clear after Connected Mode is successfully entered.');
        }else if(mode==='standalone'){
            say('STANDALONE MODE ACTIVE · Local recovery is enabled. Select “Switch to Connected” to display cloud sign-in; local recovery stops when Connected Mode is entered.');
        }else if(mode==='resolving'){
            say('CHECKING SESSION · Choose a mode after session verification finishes.');
        }else{
            say(standaloneEnabled ? 'SIGNED OUT · Sign in for Connected Mode, or explicitly choose Standalone Mode.' : 'SIGNED OUT · Sign in for Connected Mode. Standalone mode is disabled by the application feature flag.');
        }
    };
    showStandalone?.addEventListener('change',update);
    showConnected?.addEventListener('change',update);
    ack?.addEventListener('change',update);
    button?.addEventListener('click',async()=>{
        if (!standaloneEnabled) { say('STANDALONE DISABLED · The application feature flag is OFF.'); return; }
        if(button.disabled || window.__APP_STARTUP_STATE!=='ready' || window.__APP_MODE_TRANSITION_PENDING) return;
        button.disabled=true;
        window.__APP_MODE_TRANSITION_PENDING=true;
        update();
        say('SWITCHING TO STANDALONE · Signing out of Supabase, clearing the active CASE and AP/LAT, then checking the local recovery snapshot…');
        try{
            if(window.__APP_OPERATING_MODE==='connected'){
                if(!window.SupabaseCaseStorage || typeof window.SupabaseCaseStorage.signOut!=='function') throw new Error('Supabase sign-out API is unavailable.');
                await window.SupabaseCaseStorage.signOut();
            }
            if(typeof window.setApplicationOperatingMode!=='function') throw new Error('Operating-mode controller is unavailable.');
            await window.setApplicationOperatingMode('signed-out',{source:'r1143-before-standalone'});
            if(typeof window.resetActiveCaseForModeSwitch!=='function') throw new Error('Clean CASE/AP/LAT reset is unavailable.');
            await window.resetActiveCaseForModeSwitch('Connected/Signed-out to Standalone');
            await window.setApplicationOperatingMode('standalone',{explicit:true,source:'patient-page-user-choice'});
            if(showStandalone)showStandalone.checked=false;
            if(showConnected)showConnected.checked=false;
            say('STANDALONE MODE ACTIVE · Clean CASE installed; only the local IndexedDB snapshot was considered.');
        }catch(error){
            say('STANDALONE SWITCH FAILED · '+(error?.message||error)+' · Local recovery was not activated.');
        }finally{
            window.__APP_MODE_TRANSITION_PENDING=false;
            update();
        }
    });
    window.addEventListener('application-operating-mode-changed',update);
    window.addEventListener('load',update,{once:true});
    Promise.resolve(window.__APP_STARTUP_READY).then(update).catch(update);
    update();
}

function initializePortableCaseFileControls(){
    const openButton = document.getElementById("r887OpenCaseButton");
    const saveButton = document.getElementById("r887SaveCaseButton");
    const fileInput = document.getElementById("r887OpenCaseFile");
    const status = document.getElementById("r887CaseFileStatus");
    if (!openButton && !saveButton && !fileInput) return;

    const setStatus = message => { if (status) status.textContent = message; };
    if (openButton && openButton.dataset.r887Bound === "1") return;
    if (openButton) openButton.dataset.r887Bound = "1";

    if (!window.CaseFileService) {
        setStatus("R887 — ERROR · Case File Service is not loaded. Check app.html script order.");
        if (openButton) openButton.disabled = true;
        if (saveButton) saveButton.disabled = true;
        return;
    }

    if (!document.documentElement.dataset.r887CaseStatusBound) {
        document.documentElement.dataset.r887CaseStatusBound = "1";
        document.addEventListener("case-file-status", event => {
            const detail = event.detail || {};
            setStatus("R887 — " + String(detail.state || "status").toUpperCase() + " · " + (detail.message || ""));
        });
    }

    if (openButton && fileInput) {
        openButton.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", async () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            openButton.disabled = true;
            if (saveButton) saveButton.disabled = true;
            try {
                setStatus("R887 — OPENING · Validating the portable case before installation…");
                const opened = await window.CaseFileService.openCase(file);
                if (opened) {
                    window.CaseFileService.markOpenedBaseline();
                    setStatus("R887 — OPENED · " + file.name + " · imported from portable file; not a new save.");
                } else {
                    setStatus("R887 — OPEN NOT COMPLETED · " + file.name + " · check the X-ray import diagnostics.");
                }
            } catch (error) {
                setStatus("R887 — OPEN FAILED · " + (error && error.message ? error.message : String(error)));
            } finally {
                openButton.disabled = false;
                if (saveButton) saveButton.disabled = false;
                fileInput.value = "";
            }
        });
    }

    if (saveButton) {
        saveButton.addEventListener("click", async () => {
            if (openButton) openButton.disabled = true;
            saveButton.disabled = true;
            try {
                setStatus("R887 — SAVING · Flushing AP/LAT autosave and building portable ZIP…");
                const saved = await window.CaseFileService.saveCaseToDevice();
                setStatus(saved
                    ? "R887 — PORTABLE FILE SAVED · ZIP download initiated. Check device downloads."
                    : "R887 — SAVE NOT COMPLETED · No successful portable ZIP export was reported.");
            } catch (error) {
                setStatus("R887 — SAVE FAILED · " + (error && error.message ? error.message : String(error)));
            } finally {
                if (openButton) openButton.disabled = false;
                saveButton.disabled = false;
            }
        });
    }
}

function initializeLocalCaseRepositoryControls(){
    const saveButton=document.getElementById('r913SaveLocalCaseButton');
    const openButton=document.getElementById('r913OpenLocalCaseButton');
    const refreshButton=document.getElementById('r913RefreshLocalCasesButton');
    const select=document.getElementById('r913LocalCaseSelect');
    const status=document.getElementById('r913LocalCaseStatus');
    if(!saveButton || !openButton || !refreshButton || !select || !status) return;
    const say=message=>{status.textContent='R913 — '+message;};
    if(saveButton.dataset.r913Bound==='1') return;
    saveButton.dataset.r913Bound='1';
    async function refresh(){
        const prior=select.value;
        select.replaceChildren();
        const placeholder=document.createElement('option');
        placeholder.value=''; placeholder.textContent='Choose a saved local case…';
        select.appendChild(placeholder);
        const api=window.CaseRepository;
        if(!api || typeof api.listCases!=='function') throw new Error('Local CaseRepository is not loaded.');
        const rows=await api.listCases();
        for(const row of rows){
            const option=document.createElement('option'); option.value=row.caseId;
            const patient=String(row.patientName||'UnknownPatient').trim()||'UnknownPatient';
            const caseName=String(row.name||'(unnamed case)');
            const date=row.updatedAt ? new Date(row.updatedAt).toLocaleString() : 'date unknown';
            option.textContent=`${patient} · ${caseName} · ${date}${row.hasCompleteXray ? '' : ' · incomplete / test record'}`;
            select.appendChild(option);
        }
        if(rows.some(row=>row.caseId===prior)) select.value=prior;
        say(`LOCAL LIST READY · ${rows.length} case(s) on this browser.`);
        return rows;
    }
    refreshButton.addEventListener('click',async()=>{
        refreshButton.disabled=true;
        try{await refresh();}catch(error){say('LIST FAILED · '+(error?.message||error));}
        finally{refreshButton.disabled=false;}
    });
    saveButton.addEventListener('click',async()=>{
        const currentName=String(document.getElementById('case_name')?.value||window.currentCase?.metadata?.case_name||'').trim();
        const requested=currentName || window.prompt('Enter a Case Name for this local snapshot:','');
        if(!requested || !String(requested).trim()){say('SAVE CANCELLED · Enter a Case Name to save locally.');return;}
        saveButton.disabled=true; openButton.disabled=true; refreshButton.disabled=true;
        try{
            say('SAVING · Capturing CASE and verified AP/LAT image/annotation records…');
            const result=await window.saveCurrentCaseToLocalRepository(String(requested).trim());
            await refresh(); select.value=result.caseId;
            say(`SAVED LOCALLY · ${result.patientName} · ${result.name} · revision ${result.revision}. A new local entry was created in this browser; use Save Case for a portable ZIP backup.`);
        }catch(error){say('SAVE FAILED · '+(error?.message||error));}
        finally{saveButton.disabled=false;openButton.disabled=false;refreshButton.disabled=false;}
    });
    openButton.addEventListener('click',async()=>{
        const id=select.value;
        if(!id){say('SELECT A CASE · Choose a saved local case first.');return;}
        saveButton.disabled=true; openButton.disabled=true; refreshButton.disabled=true;
        try{
            say('OPENING · Verifying stored AP/LAT image checksums before installation…');
            const result=await window.openLocalRepositoryCase(id);
            if(result?.cancelled) say('OPEN CANCELLED · The active CASE was not replaced.');
            else if(result?.opened) say(`OPENED LOCALLY · ${result.patientName} · ${result.name}. This was a local restore, not a portable ZIP save.`);
            else say('OPEN NOT COMPLETED · The existing import diagnostic contains details.');
        }catch(error){say('OPEN FAILED · '+(error?.message||error));}
        finally{saveButton.disabled=false;openButton.disabled=false;refreshButton.disabled=false;}
    });
    refresh().catch(error=>say('LIST UNAVAILABLE · '+(error?.message||error)));
}



async function enterPatientWorkspace(firstVisit, state){
    // R1144.6.3 — Patient is a cached SPA workspace. initialize() runs only
    // once, so repopulate its controls from the current CASE on every entry.
    // This also makes a restore performed on another workspace visible here.
    await populatePatient();

    if (state && state.scrollY != null) {
        window.scrollTo({ top: state.scrollY, behavior: "auto" });
    }
}

function leavePatientWorkspace(){
    return { scrollY: window.scrollY };
}

// Register only when running under the SPA host.
if (window.WorkspaceManager) {
    WorkspaceManager.register("patient", {
        initialize: initializePatientWorkspace,
        enter: enterPatientWorkspace,
        leave: leavePatientWorkspace
    });
}

// Temporary compatibility while MPA still exists.
if (!window.WorkspaceManager) {
    window.onload = initializePatientWorkspace;
}


// R1 — Supabase cloud case controls. Kept separate from portable ZIP and IndexedDB.
function initializeSupabaseCaseStorageControls(){
    const card=document.getElementById('supabaseCaseStorageCard');
    if(!card){
        window.__SUPABASE_SESSION_READY=Promise.resolve({connected:false,reason:'cloud-controls-not-present'});
        return window.__SUPABASE_SESSION_READY;
    }
    if(card.dataset.r924Bound==='1') return window.__SUPABASE_SESSION_READY || Promise.resolve({connected:false,reason:'cloud-controls-already-bound'});
    card.dataset.r924Bound='1';
    const $=id=>document.getElementById(id);
    const status=$('supabaseCaseStorageStatus');
    const setStatus=message=>{ if(status) status.textContent='R1135 — '+message; };
    const api=()=>{
        if(!window.SupabaseCaseStorage) throw new Error('SupabaseCaseStorage did not load. Check app.html script order.');
        return window.SupabaseCaseStorage;
    };
    const EMAIL_KEY='orthopedic.supabaseCaseStorage.accountEmail.v1';
    const REVISION_KEY_PREFIX='orthopedic.supabaseCaseStorage.selectedRevisionId.v1:';
    const readStoredRevision=caseId=>{
        try{return caseId?localStorage.getItem(REVISION_KEY_PREFIX+caseId)||'':'';}catch(_){return '';}
    };
    const storeSelectedRevision=(caseId,revisionId)=>{
        if(!caseId)return;
        try{
            const key=REVISION_KEY_PREFIX+caseId;
            if(revisionId)localStorage.setItem(key,revisionId);else localStorage.removeItem(key);
        }catch(_){}
    };
    const storeAccountEmail=()=>{
        const email=String($('supabaseEmail')?.value||'').trim();
        try{if(email)localStorage.setItem(EMAIL_KEY,email);else localStorage.removeItem(EMAIL_KEY);}catch(_){}
    };
    try{
        const savedEmail=localStorage.getItem(EMAIL_KEY)||'';
        if($('supabaseEmail')&&!$('supabaseEmail').value)$('supabaseEmail').value=savedEmail;
    }catch(_){}
    $('supabaseEmail')?.addEventListener('change',storeAccountEmail);
    $('supabaseEmail')?.addEventListener('blur',storeAccountEmail);
    // R1142: any explicitly configured Supabase project is a valid connection target.
    // The designated-project restriction below applies only to destructive deletion.
    const DISPOSABLE_PROJECT_URL='https://xrsbznxlurtrckyhsrwy.supabase.co';
    const isDisposableProjectUrl=value=>{
        try{return new URL(String(value||'')).origin.toLowerCase()===new URL(DISPOSABLE_PROJECT_URL).origin.toLowerCase();}
        catch(_){return false;}
    };
    try {
        const savedConfig=api().getSavedConfig();
        if(savedConfig) {
            if($('supabaseProjectUrl') && !$('supabaseProjectUrl').value) $('supabaseProjectUrl').value=savedConfig.url;
            if($('supabasePublishableKey') && !$('supabasePublishableKey').value) $('supabasePublishableKey').value=savedConfig.publishableKey;
        }
    } catch (_) { /* Config fields remain editable; a storage read failure must not force a different project. */ }
    const selectedRow=()=>{
        const select=$('supabaseCaseSelect');
        const id=select?.value;
        return (select?._r924Rows||[]).find(row=>row.id===id)||null;
    };
    const connectedAutosave=()=>window.ConnectedCaseAutosave||null;
    function activateConnectedAutosave(caseId,caseName){
        const controller=connectedAutosave();
        if(!controller || window.__APP_OPERATING_MODE!=='connected') return false;
        try{
            controller.activate({caseId,caseName});
            return true;
        }catch(error){
            console.warn('[R1145.2] Connected WIP autosave was not activated:',error);
            setStatus('CONNECTED · Cloud case is open, but autosave is not armed: '+(error?.message||error));
            return false;
        }
    }
    async function deactivateConnectedAutosave(reason){
        const controller=connectedAutosave();
        if(controller?.deactivateAndDrain) await controller.deactivateAndDrain(reason||'cloud case operation');
        else controller?.deactivate(reason||'cloud case operation');
    }
    window.addEventListener('application-operating-mode-changed',event=>{
        if(event?.detail?.mode!=='connected' && window.__APP_OPERATING_MODE!=='connected'){
            void deactivateConnectedAutosave('operating mode changed');
        }
    });
    async function refreshList(){
        const rows=await api().listCases();
        const select=$('supabaseCaseSelect');
        let previous=select.value;
        if(!previous){try{previous=localStorage.getItem('orthopedic.supabaseCaseStorage.selectedCaseId.v1')||'';}catch(_){}}
        select.replaceChildren();
        const first=document.createElement('option'); first.value=''; first.textContent='Choose a saved cloud case…'; select.appendChild(first);
        for(const row of rows){
            const option=document.createElement('option'); option.value=row.id;
            const date=row.updated_at?new Date(row.updated_at).toLocaleString():'date unknown';
            const revisionLabel = row.current_revision_number != null
                ? `R${row.current_revision_number}`
                : (row.current_revision_id ? 'revision unknown' : 'no revision');
            option.textContent=`${row.patient_name} · ${row.case_name} · ${revisionLabel} · ${date}`;
            select.appendChild(option);
        }
        select._r924Rows=rows;
        if(rows.some(row=>row.id===previous)) select.value=previous;
        try { if(select.value) localStorage.setItem('orthopedic.supabaseCaseStorage.selectedCaseId.v1',select.value); } catch (_) {}
        setStatus(`SIGNED IN · ${rows.length} cloud case(s) visible to this account. Select a case to save a new revision or open it.`);
        return rows;
    }
    async function refreshRevisionHistory(caseId, preferredRevisionId=''){
        const historySelect=$('supabaseRevisionSelect');
        if(!historySelect) return [];
        historySelect.replaceChildren();
        const placeholder=document.createElement('option');
        placeholder.value='';
        placeholder.textContent='Choose a revision…';
        historySelect.appendChild(placeholder);
        if(!caseId){
            historySelect.disabled=true;
            return [];
        }
        historySelect.disabled=true;
        try{
            const revisions=await api().listRevisions(caseId);
            for(const revision of revisions){
                const option=document.createElement('option');
                option.value=revision.id;
                const date=revision.created_at?new Date(revision.created_at).toLocaleString():'date unknown';
                option.textContent=`R${revision.revision_number}${revision.is_current_revision?' · CURRENT':''} · ${date}`;
                historySelect.appendChild(option);
            }
            const rememberedRevisionId=preferredRevisionId||readStoredRevision(caseId);
            if(revisions.some(revision=>revision.id===rememberedRevisionId)){
                historySelect.value=rememberedRevisionId;
            }else if(revisions.length){
                const current=revisions.find(revision=>revision.is_current_revision);
                historySelect.value=(current||revisions[0]).id;
            }
            storeSelectedRevision(caseId,historySelect.value||'');
            setStatus(`REVISION HISTORY LOADED · ${revisions.length} revision(s) for the selected case.`);
            return revisions;
        }finally{
            historySelect.disabled=false;
        }
    }
    $('supabaseRevisionSelect')?.addEventListener('change',()=>{
        const row=selectedRow();
        if(row)storeSelectedRevision(row.id,$('supabaseRevisionSelect')?.value||'');
    });
    let cloudCaseSwitchGeneration=0;
    function isWorkingCopySchemaUnavailable(error){
        const code=String(error?.code||error?.cause?.code||'').toUpperCase();
        const message=String(error?.message||error||'');
        return code==='42P01' || code==='PGRST205' ||
            (/case_working_copies/i.test(message) && /(does not exist|not found|schema cache|undefined table)/i.test(message));
    }
    async function readWorkingCopyForSelectedProject(caseId){
        try{return {workingCopy:await api().getWorkingCopy(caseId),schemaAvailable:true};}
        catch(error){
            if(isWorkingCopySchemaUnavailable(error))return {workingCopy:null,schemaAvailable:false,error};
            throw error;
        }
    }
    async function installCleanCloudCaseContext(row, stillCurrent=()=>true){
        const fresh=typeof r914BuildDefaultCase==='function'?r914BuildDefaultCase(null):null;
        if(!fresh)throw new Error('Clean CASE initializer is unavailable; refusing to carry the previous case forward.');
        fresh.metadata.case_name=row.case_name;
        fresh.metadata.cloud_case_id=row.id;
        fresh.frame.hardware='Hexapod';
        fresh.patient.patient_name=row.patient_name||'enter name';
        if(!window.WorkspaceManager || typeof window.WorkspaceManager.ensureInitialized!=='function')throw new Error('WorkspaceManager.ensureInitialized("xray") is unavailable.');
        await window.WorkspaceManager.ensureInitialized('xray');
        if(typeof window.clearActiveXrayWorkspaces!=='function')throw new Error('Verified AP/LAT clear helper is unavailable.');
        const cleared=await window.clearActiveXrayWorkspaces();
        if(cleared?.status!=='PASS')throw new Error(cleared?.message||'AP/LAT workspaces could not be cleared.');
        if(!stillCurrent())return {stale:true};
        window.currentCase=fresh;
        if(typeof syncCurrentCase!=='function')throw new Error('syncCurrentCase() is unavailable.');
        await syncCurrentCase();
        if(typeof populatePatient==='function')await populatePatient();
        if(typeof updateCurrentCaseInspector==='function')updateCurrentCaseInspector({resetScroll:true});
        return {installed:true};
    }
    async function openSelectedCloudCase(row, generation){
        await deactivateConnectedAutosave('cloud case switch in progress');
        const select=$('supabaseCaseSelect');
        const controls=['supabaseCreateCaseButton','supabaseSaveRevisionButton','supabaseSaveWipButton','supabaseOpenWipButton','supabaseOpenCaseButton','supabaseOpenRevisionButton','supabaseRefreshCasesButton','supabaseRefreshRevisionHistoryButton','supabaseDeleteCaseButton','supabaseReadDeletionStatusButton','supabaseSignOutButton'];
        const priorDisabled=new Map(controls.map(id=>[id,$(id)?.disabled]));
        controls.forEach(id=>{if($(id))$(id).disabled=true;});
        if(select)select.disabled=true;
        const transition=typeof window.beginCaseTransition==='function'
            ? window.beginCaseTransition('Connected cloud case switch: '+row.case_name) : null;
        const stillCurrent=()=>generation===cloudCaseSwitchGeneration && $('supabaseCaseSelect')?.value===row.id;
        let switchCommitted=false;
        try{
            setStatus(`SWITCHING CLOUD CASE · Clearing the previous active CASE and AP/LAT workspace before opening ${row.case_name}…`);
            const cleanResult=await installCleanCloudCaseContext(row,stillCurrent);
            if(cleanResult?.stale || !stillCurrent())return {stale:true};
            const wipLookup=await readWorkingCopyForSelectedProject(row.id);
            const wip=wipLookup.workingCopy;
            if(!stillCurrent())return {stale:true};
            let result;
            if(wip){
                result=await api().openWorkingCopyIntoApplication(row.id,{
                    caseName:row.case_name,
                    confirmBeforeOpen:false,
                    shouldInstall:stillCurrent
                });
                if(result?.stale || !stillCurrent())return {stale:true};
                if(!result?.opened)throw new Error('The selected case WIP was not installed.');
                switchCommitted=true;
                setStatus(`ACTIVE CLOUD CASE · ${row.case_name} · WIP version ${result.workingCopyVersion} · AP/LAT images and annotations restored.`);
            }else if(row.current_revision_id){
                result=await api().openCaseIntoApplication(row.id,{
                    confirmBeforeOpen:false,
                    shouldInstall:stillCurrent
                });
                if(result?.stale || !stillCurrent())return {stale:true};
                if(!result?.opened)throw new Error('The selected case current revision was not installed.');
                switchCommitted=true;
                setStatus(wipLookup.schemaAvailable
                    ? `ACTIVE CLOUD CASE · ${row.case_name} · no WIP existed; current immutable revision R${result.revisionNumber} loaded as the baseline, including AP/LAT images and annotations.`
                    : `ACTIVE CLOUD CASE · ${row.case_name} · this Supabase project does not yet have the WIP table; current immutable revision R${result.revisionNumber} loaded as the baseline.`);
            }else{
                switchCommitted=true;
                setStatus(wipLookup.schemaAvailable
                    ? `ACTIVE CLOUD CASE · ${row.case_name} · no WIP or immutable revision exists. A clean CASE context is active and previous AP/LAT content has been cleared.`
                    : `ACTIVE CLOUD CASE · ${row.case_name} · WIP storage is not provisioned in this Supabase project and no immutable revision exists. A clean CASE context is active; previous AP/LAT content has been cleared.`);
            }
            if(typeof updateCurrentCaseInspector==='function')updateCurrentCaseInspector({resetScroll:true});
            if(typeof refreshDeveloperDashboard==='function')await refreshDeveloperDashboard();
            return {opened:true,caseId:row.id,source:wip?'wip':(row.current_revision_id?'current-revision':'clean-context')};
        }finally{
            if(transition && typeof window.endCaseTransition==='function')window.endCaseTransition(transition,{committed:switchCommitted,reason:switchCommitted?'Connected cloud case switch completed':'Connected cloud case switch did not complete'});
            if(switchCommitted && stillCurrent()) activateConnectedAutosave(row.id,row.case_name);
            controls.forEach(id=>{const el=$(id);if(el && priorDisabled.has(id))el.disabled=priorDisabled.get(id);});
            if(select)select.disabled=false;
        }
    }
    $('supabaseCaseSelect')?.addEventListener('change',async()=>{
        const generation=++cloudCaseSwitchGeneration;
        try { const id=$('supabaseCaseSelect')?.value||''; if(id) localStorage.setItem('orthopedic.supabaseCaseStorage.selectedCaseId.v1',id); else localStorage.removeItem('orthopedic.supabaseCaseStorage.selectedCaseId.v1'); } catch (_) {}
        const row=selectedRow();
        try{
            if(!row){
                deactivateConnectedAutosave('no cloud case selected');
                await refreshRevisionHistory('');
                if(typeof updateDeleteGate==='function') updateDeleteGate();
                return;
            }
            await refreshRevisionHistory(row.id);
            if(generation!==cloudCaseSwitchGeneration)return;
            if(typeof updateDeleteGate==='function') updateDeleteGate();
            await openSelectedCloudCase(row,generation);
        }catch(error){
            setStatus('CLOUD CASE OPEN FAILED · '+(error?.message||error)+' · The previous case was not intentionally reused as the selected case.');
        }
    });
    $('supabaseRefreshRevisionHistoryButton')?.addEventListener('click',async()=>{
        const row=selectedRow();
        if(!row){setStatus('SELECT A CASE · Choose a saved cloud case first.');return;}
        try{
            setStatus('LOADING REVISION HISTORY · Reading saved revision metadata…');
            await refreshRevisionHistory(row.id,$('supabaseRevisionSelect')?.value||'');
        }catch(error){setStatus('REVISION HISTORY FAILED · '+(error?.message||error));}
    });
    $('supabaseOpenRevisionButton')?.addEventListener('click',async()=>{
        const row=selectedRow();
        const revisionId=$('supabaseRevisionSelect')?.value;
        if(!row){setStatus('SELECT A CASE · Choose a saved cloud case first.');return;}
        if(!revisionId){setStatus('SELECT A REVISION · Choose a revision from the history list.');return;}
        const button=$('supabaseOpenRevisionButton');button.disabled=true;
        const autosavePause=await connectedAutosave()?.suspend('manual immutable revision restore');
        try{
            setStatus('OPENING REVISION · Downloading assets and verifying byte lengths/SHA-256…');
            const result=await api().openCaseIntoApplication(row.id,{revisionId,confirmBeforeOpen:true});
            if(result.cancelled){setStatus('OPEN CANCELLED · Active case was not replaced.');return;}
            if(!result.opened)throw new Error('Existing validated case installer did not confirm a successful open.');
            setStatus(`OPEN PASS · ${result.caseName} · revision R${result.revisionNumber} restored through the existing validated case-import path.`);
        }catch(error){setStatus('OPEN REVISION FAILED · '+(error?.message||error));}
        finally{
            if(autosavePause) connectedAutosave()?.resume(autosavePause,'revision restore completed or cancelled');
            button.disabled=false;
        }
    });
    $('supabaseSignInButton')?.addEventListener('click',async()=>{
        const button=$('supabaseSignInButton'); button.disabled=true;
        window.__APP_MODE_TRANSITION_PENDING = true;
        let authenticated=false;
        let connectedModeSet=false;
        const priorMode=window.__APP_OPERATING_MODE;
        window.dispatchEvent(new Event('application-operating-mode-changed'));
        try{
            if(priorMode==='standalone'){
                setStatus('LEAVING STANDALONE · Stopping local recovery and clearing the local CASE/AP/LAT before cloud sign-in…');
                await window.setApplicationOperatingMode('signed-out',{source:'r1143-before-connected-sign-in'});
                await window.resetActiveCaseForModeSwitch('Standalone to Connected');
            }else if(priorMode==='connected'){
                setStatus('CONNECTED MODE · Refreshing the authenticated cloud session…');
            }else{
                await window.setApplicationOperatingMode('signed-out',{source:'r1143-sign-in-boundary'});
                if(typeof window.resetActiveCaseForModeSwitch==='function') await window.resetActiveCaseForModeSwitch('Signed-out to Connected');
            }
            const targetUrl=String($('supabaseProjectUrl').value||'').trim();
            setStatus('SIGNING IN · Connecting to the configured Supabase project…');
            const result=await api().signIn({url:targetUrl,publishableKey:$('supabasePublishableKey').value,email:$('supabaseEmail').value,password:$('supabasePassword').value});
            authenticated=true;
            if (typeof window.setApplicationOperatingMode === 'function') {
                await window.setApplicationOperatingMode('connected', { authenticated:true, source:'interactive-sign-in' });
            }
            connectedModeSet=true;
            if(result.user?.email && $('supabaseEmail'))$('supabaseEmail').value=result.user.email;
            storeAccountEmail();
            if($('supabasePassword'))$('supabasePassword').value='';
            setStatus(`SIGNED IN · User ${result.user.id}. Refreshing cloud list…`);
            await refreshList();
            const selected=selectedRow();
            if(selected) await refreshRevisionHistory(selected.id);
            if(typeof updateDeleteGate==='function') updateDeleteGate();

            // R1135: signing in after the SPA has already started is also a
            // connected-mode recovery boundary. Reuse the same selected-case-only
            // WIP restore path as startup; never guess a case by name or recency.
            // The startup restore function explicitly opens with confirmBeforeOpen:false.
            if(selected && typeof window.restoreSupabaseWorkingCopyAtStartup==='function'){
                window.__STARTUP_RECOVERY_SOURCE='supabase';
                setStatus(`SIGNED IN · ${selected.case_name} selected. Checking its saved working copy…`);
                const recoveryResult=await window.restoreSupabaseWorkingCopyAtStartup({
                    connected:true,
                    userId:result.user?.id||null,
                    userEmail:result.user?.email||null,
                    selectedCaseId:selected.id,
                    selectedCaseName:selected.case_name||'',
                    selectedCaseRevisionId:selected.current_revision_id||null,
                    selectedCasePatientName:selected.patient_name||''
                });
                if(recoveryResult?.restored){
                    window.__STARTUP_RECOVERY_RESULT=recoveryResult;
                }else if(recoveryResult?.reason==='wip-not-found'){
                    setStatus(`SIGNED IN · ${selected.case_name} has no saved WIP. Active CASE left unchanged.`);
                }else if(!recoveryResult?.restored){
                    setStatus(`SIGNED IN · Cloud WIP recovery not completed (${recoveryResult?.reason||'unknown reason'}). Active CASE was not replaced unless the validated restore completed.`);
                }
            }else if(!selected){
                setStatus('SIGNED IN · No previously selected cloud case. Automatic WIP recovery skipped; no unrelated case was selected.');
            }else{
                setStatus('SIGNED IN · Cloud case selected, but automatic WIP recovery is unavailable in this build.');
            }
        }catch(error){
            if(priorMode==='connected' && !authenticated){
                setStatus('CONNECTED · Re-authentication attempt failed: '+(error?.message||error)+' · The existing Connected session remains active.');
            }else if(authenticated && connectedModeSet){
                setStatus('CONNECTED · Authentication succeeded, but cloud list/recovery initialization did not finish: '+(error?.message||error)+' · Connected mode remains active; retry the cloud operation.');
            }else{
                if(authenticated){
                    try{await api().signOut();}catch(signOutError){console.error('R1143 cleanup sign-out failed:',signOutError);}
                }
                try{
                    if(window.__APP_OPERATING_MODE!=='signed-out') await window.setApplicationOperatingMode('signed-out',{source:'r1143-sign-in-failed'});
                }catch(modeError){console.error('R1143 failed to close mode after sign-in error:',modeError);}
                setStatus('SIGN-IN FAILED · '+(error?.message||error)+' · Local recovery remains stopped; retry sign-in or explicitly enter Standalone Mode.');
            }
        }
        finally{window.__APP_MODE_TRANSITION_PENDING = false;button.disabled=false;window.dispatchEvent(new Event('application-operating-mode-changed'));}
    });
    $('supabaseSignOutButton')?.addEventListener('click',async()=>{
        try{
            window.__APP_MODE_TRANSITION_PENDING = true;
            await deactivateConnectedAutosave('sign out requested');
            await api().signOut();
            if (typeof window.setApplicationOperatingMode === 'function') await window.setApplicationOperatingMode('signed-out');
            if(typeof window.resetActiveCaseForModeSwitch==='function') await window.resetActiveCaseForModeSwitch('Connected to Signed-out');
            $('supabaseCaseSelect').replaceChildren();
            setStatus('SIGNED OUT · Active CASE/AP/LAT cleared; cloud and local saved records remain untouched.');
            if(typeof updateDeleteGate==='function')updateDeleteGate();
        }
        catch(error){setStatus('SIGN-OUT FAILED · '+(error?.message||error));}
        finally{window.__APP_MODE_TRANSITION_PENDING = false;window.dispatchEvent(new Event('application-operating-mode-changed'));}
    });
    $('supabaseRefreshCasesButton')?.addEventListener('click',async()=>{
        try{setStatus('REFRESHING · Reading owner-scoped case list…');await refreshList();}
        catch(error){setStatus('LIST FAILED · '+(error?.message||error));}
    });
    $('supabaseCreateCaseButton')?.addEventListener('click',async()=>{
        const confirmed=window.confirm('SAVE A NEW CLOUD CASE\n\nThis uploads the active CASE JSON, AP/LAT original image bytes, and annotations to your authenticated Supabase account. It creates a new patient record from the current CASE; it does not match by patient name or clinical ID.\n\nUse synthetic/demo data for this first test. Continue?');
        if(!confirmed)return;
        const button=$('supabaseCreateCaseButton'); button.disabled=true;
        try{
            setStatus('SAVING NEW CLOUD CASE · Capturing and verifying AP/LAT assets…');
            const result=await api().createNewCaseFromCurrent({createPatientFromCurrent:true});
            await refreshList(); $('supabaseCaseSelect').value=result.case.id;
            await refreshRevisionHistory(result.case.id, result.revision.revisionId);
            setStatus(`SAVE PASS · New cloud case created · revision R${result.revision.revisionNumber} · case ${result.case.id}.`);
        }catch(error){setStatus('SAVE FAILED · '+(error?.message||error)+'\nIf image uploads succeeded before a later error, orphaned objects may remain; do not retry repeatedly until the exact error is reviewed.');}
        finally{button.disabled=false;}
    });
    $('supabaseSaveRevisionButton')?.addEventListener('click',async()=>{
        const row=selectedRow(); if(!row){setStatus('SELECT A CASE · Choose a saved cloud case first.');return;}
        if(!window.confirm(`SAVE A NEW IMMUTABLE REVISION?\n\nCase: ${row.case_name}\nCurrent revision: ${row.current_revision_id||'(none)'}\n\nThis uploads the active CASE and both AP/LAT image/annotation records. Continue?`))return;
        const button=$('supabaseSaveRevisionButton');button.disabled=true;
        try{
            setStatus('SAVING REVISION · Capturing AP/LAT and checking expected revision…');
            const result=await api().saveCurrentRevision({caseId:row.id,expectedCurrentRevisionId:row.current_revision_id});
            await refreshList(); $('supabaseCaseSelect').value=row.id;
            await refreshRevisionHistory(row.id, result.revisionId);
            setStatus(`SAVE PASS · Case ${row.case_name} · new revision R${result.revisionNumber}.`);
        }catch(error){setStatus('REVISION SAVE FAILED · '+(error?.message||error)+'\nA revision conflict means refresh the list and inspect the current saved version before retrying.');}
        finally{button.disabled=false;}
    });
    $('supabaseSaveWipButton')?.addEventListener('click',async()=>{
        const row=selectedRow();
        if(!row){setStatus('SELECT A CASE · Choose a saved cloud case first.');return;}
        if(!window.confirm(`SAVE THE CURRENT WORKING COPY TO SUPABASE?\n\nCase: ${row.case_name}\n\nThis updates the one mutable WIP record for this case. It does NOT create an immutable revision or change the current revision pointer. Both AP and LAT original images are required. Continue?`))return;
        const button=$('supabaseSaveWipButton');button.disabled=true;
        try{
            setStatus('SAVING WIP · Capturing CASE and AP/LAT, uploading a new image generation, then committing the WIP pointer…');
            const result=await api().saveCurrentWorkingCopy({caseId:row.id,saveSource:'manual-wip-button',suppressPatientChangeEvent:true});
            const cleanup=result.cleanupWarning?`\nCLEANUP WARNING · ${result.cleanupWarning}`:'';
            setStatus(`WIP SAVE PASS · Case ${row.case_name} · working-copy version ${result.workingCopyVersion} · saved ${result.updatedAt?new Date(result.updatedAt).toLocaleString():'time unavailable'}.${cleanup}`);
        }catch(error){setStatus('WIP SAVE FAILED · '+(error?.message||error));}
        finally{button.disabled=false;}
    });
    $('supabaseOpenWipButton')?.addEventListener('click',async()=>{
        const row=selectedRow();
        if(!row){setStatus('SELECT A CASE · Choose a saved cloud case first.');return;}
        const button=$('supabaseOpenWipButton');button.disabled=true;
        const autosavePause=await connectedAutosave()?.suspend('manual WIP restore');
        try{
            setStatus('RESTORING WIP · Reading the mutable working copy and verifying AP/LAT image byte lengths and SHA-256…');
            const result=await api().openWorkingCopyIntoApplication(row.id,{caseName:row.case_name,confirmBeforeOpen:true});
            if(result.cancelled){setStatus('WIP RESTORE CANCELLED · Active CASE was not replaced.');return;}
            if(!result.opened)throw new Error('Existing validated case installer did not confirm a successful WIP restore.');
            setStatus(`WIP RESTORE PASS · ${result.caseName} · working-copy version ${result.workingCopyVersion} restored through the existing validated case-import path.`);
        }catch(error){setStatus('WIP RESTORE FAILED · '+(error?.message||error));}
        finally{
            if(autosavePause) connectedAutosave()?.resume(autosavePause,'WIP restore completed or cancelled');
            button.disabled=false;
        }
    });
    $('supabaseOpenCaseButton')?.addEventListener('click',async()=>{
        const row=selectedRow();if(!row){setStatus('SELECT A CASE · Choose a saved cloud case first.');return;}
        const button=$('supabaseOpenCaseButton');button.disabled=true;
        try{
            setStatus('OPENING · Downloading assets and verifying byte lengths/SHA-256 before installation…');
            const result=await api().openCaseIntoApplication(row.id,{confirmBeforeOpen:true});
            if(result.cancelled){setStatus('OPEN CANCELLED · Active case was not replaced.');return;}
            if(!result.opened)throw new Error('Existing validated case installer did not confirm a successful open.');
            setStatus(`OPEN PASS · ${result.caseName} · revision R${result.revisionNumber} restored through the existing validated case-import path.`);
        }catch(error){setStatus('OPEN FAILED · '+(error?.message||error));}
        finally{button.disabled=false;}
    });
    // R1006: guarded whole-case deletion with durable job-ID status lookup. No revision-only deletion is implemented here.
    const deleteButton=$('supabaseDeleteCaseButton');
    const deleteAck=$('supabaseDeleteDisposableAck');
    const deleteStatus=$('supabaseDeleteCaseStatus');
    const readDeleteStatusButton=$('supabaseReadDeletionStatusButton');
    const DISPOSABLE_ORIGIN='https://xrsbznxlurtrckyhsrwy.supabase.co'; // Designated disposable target for the guarded whole-case deletion workflow only.
    let deleteStatusIsResult=false;
    // Keep the most recent deletion target in this page session, even after refreshList()
    // removes the deleted case from the selectable case list.
    let lastDeletionLookup=null;
    const setDeleteStatus=(message,{result=false}={})=>{
        deleteStatusIsResult=!!result;
        if(deleteStatus)deleteStatus.textContent='R1142 — '+message;
    };
    const isActiveDisposableProject=()=>{
        try{return new URL(String(api().getActiveProjectUrl()||'')).origin===DISPOSABLE_ORIGIN;}
        catch(_){return false;}
    };
    const updateDeleteGate=()=>{
        let configured=false;
        try{configured=api().isConfigured();}catch(_){}
        const disposable=isActiveDisposableProject();
        const row=selectedRow();
        const allowed=disposable && !!deleteAck?.checked && !!row && configured;
        if(deleteButton)deleteButton.disabled=!allowed;
        // Do not replace a lookup/deletion result during finally{} cleanup.
        if(!deleteStatusIsResult){
            if(!disposable)setDeleteStatus('LOCKED · The ACTIVE signed-in Supabase client is not the exact designated disposable test project. The editable URL field alone cannot unlock deletion.');
            else if(!configured)setDeleteStatus('LOCKED · Supabase client is not configured.');
            else if(!deleteAck?.checked)setDeleteStatus('LOCKED · Confirm the designated disposable test project database and synthetic case.');
            else if(!row)setDeleteStatus('LOCKED · Select a cloud case first.');
            else setDeleteStatus('ARMED · Disposable project only. Verify the selected case is synthetic before continuing.');
        }
    };
    const clearDeleteResultAndRefreshGate=()=>{deleteStatusIsResult=false;updateDeleteGate();};
    $('supabaseProjectUrl')?.addEventListener('input',clearDeleteResultAndRefreshGate);
    deleteAck?.addEventListener('change',clearDeleteResultAndRefreshGate);
    $('supabaseCaseSelect')?.addEventListener('change',clearDeleteResultAndRefreshGate);
    $('supabaseSignInButton')?.addEventListener('click',()=>setTimeout(updateDeleteGate,0));
    $('supabaseSignOutButton')?.addEventListener('click',()=>setTimeout(updateDeleteGate,0));
    deleteButton?.addEventListener('click',async()=>{
        const row=selectedRow();
        updateDeleteGate();
        if(deleteButton.disabled||!row){setDeleteStatus('BLOCKED · Rebuild-test project guard, acknowledgement, or case selection did not pass.');return;}
        const typed=window.prompt(`PERMANENTLY DELETE THIS DISPOSABLE TEST CASE?\n\nPatient: ${row.patient_name}\nCase: ${row.case_name}\nCase ID: ${row.id}\nCurrent revision: ${row.current_revision_id||'(none)'}\n\nType the exact case name to continue:`);
        if(typed===null){setDeleteStatus('CANCELLED · No deletion request was sent.');return;}
        if(typed!==row.case_name){setDeleteStatus('CANCELLED · Typed name did not exactly match. No deletion request was sent.');return;}
        if(!window.confirm(`FINAL DELETION CONFIRMATION\n\nDatabase: designated disposable test project\nCase: ${row.case_name}\nID: ${row.id}\n\nThis permanently deletes all revisions and case assets. The patient record is preserved. Continue?`)){setDeleteStatus('CANCELLED · Final confirmation declined.');return;}
        // Save the case ID before deletion; it remains the status lookup key after list refresh.
        lastDeletionLookup={caseId:row.id,caseName:row.case_name,patientName:row.patient_name,deletionJobId:null,rememberedAt:new Date().toISOString()};
        deleteStatusIsResult=false;
        const ids=['supabaseCreateCaseButton','supabaseSaveRevisionButton','supabaseOpenCaseButton','supabaseOpenRevisionButton','supabaseRefreshCasesButton','supabaseRefreshRevisionHistoryButton','supabaseDeleteCaseButton','supabaseReadDeletionStatusButton'];
        const priorDisabled=new Map(ids.map(id=>[id,$(id)?.disabled]));
        ids.forEach(id=>{const el=$(id);if(el)el.disabled=true;});
        try{
            setDeleteStatus('STARTING · Verifying the selected case and requesting its deletion job…');
            const result=await api().deleteCloudCase({caseId:row.id,typedCaseName:typed,expectedCurrentRevisionId:row.current_revision_id||null});
            lastDeletionLookup.deletionJobId=result.deletionJobId||null;
            await refreshList();
            await refreshRevisionHistory('');
            setDeleteStatus(`PASS · Entire case ${result.caseId} deleted; job ${result.deletionJobId} completed; patient preserved; case Storage prefix verified empty. The deletion job ID is retained for a read-only status lookup in this page session.`,{result:true});
            setStatus('DELETE PASS · Disposable synthetic case deleted and post-checked.');
        }catch(error){
            if(lastDeletionLookup&&error?.deletionJobId)lastDeletionLookup.deletionJobId=error.deletionJobId;
            setDeleteStatus(`STOPPED · ${error?.message||error}\nNo automatic retry was attempted. Use the read-only status lookup for the remembered deletion job ID when available; otherwise use the case ID.`,{result:true});
        }finally{
            ids.forEach(id=>{const el=$(id);if(el)el.disabled=!!priorDisabled.get(id);});
            updateDeleteGate();
        }
    });
    readDeleteStatusButton?.addEventListener('click',async()=>{
        const row=selectedRow();
        // If the selected row is the remembered deletion target (or no row remains),
        // use its durable job ID. If another case is selected, query that case by case ID.
        const useRememberedJob=!!lastDeletionLookup&&(!row||row.id===lastDeletionLookup.caseId);
        const caseId=useRememberedJob?lastDeletionLookup.caseId:row?.id;
        const caseLabel=useRememberedJob?lastDeletionLookup.caseName:(row?.case_name||'(selected case)');
        const jobId=useRememberedJob?lastDeletionLookup.deletionJobId:null;
        if(!caseId){setDeleteStatus('STATUS READ BLOCKED · Select a case, or perform/attempt its deletion in this page session first.',{result:true});return;}
        if(!isActiveDisposableProject()){setDeleteStatus('STATUS READ BLOCKED · Active client is not the designated disposable test project.',{result:true});return;}
        readDeleteStatusButton.disabled=true;
        setDeleteStatus(`LOOKUP RUNNING · Read-only status for ${caseLabel} · ${jobId?`deletion job ID ${jobId}`:`case ID ${caseId}`}`,{result:true});
        try{
            const rows=jobId?await api().readDeletionJobStatus(jobId):await api().readDeletionStatus(caseId);
            setDeleteStatus(rows.length?('READ-ONLY STATUS · '+JSON.stringify(rows,null,2)):(jobId?`READ-ONLY STATUS · No deletion job is visible for job ID ${jobId} to the signed-in owner.`:`READ-ONLY STATUS · No deletion job is visible for case ID ${caseId} to the signed-in owner.`),{result:true});
        }catch(error){setDeleteStatus('STATUS READ FAILED · '+(error?.message||error),{result:true});}
        finally{readDeleteStatusButton.disabled=false;updateDeleteGate();}
    });
    updateDeleteGate();


    // R1140: make persisted Supabase authentication/session restoration awaitable.
    // app.js must choose the recovery source only after this promise settles.
    const SELECTED_CASE_KEY='orthopedic.supabaseCaseStorage.selectedCaseId.v1';
    const sessionRestorePromise=(async()=>{
        try{
            const saved=api().getSavedConfig();
            if(!saved){
                setStatus('NOT CONNECTED · No saved Supabase project configuration/session. Local recovery remains inactive until Standalone Mode is explicitly selected.');
                if(typeof updateDeleteGate==='function') updateDeleteGate();
                return {connected:false,reason:'not-configured'};
            }
            setStatus('RESTORING SESSION · Verifying the saved Supabase project session…');
            const restored=await api().restoreSession();
            if(!restored.signedIn){
                setStatus(restored.configured
                    ? 'SESSION NOT ACTIVE · Please sign in again. Local recovery remains inactive until Standalone Mode is explicitly selected.'
                    : 'NOT CONNECTED · No active Supabase session. Local recovery remains inactive until Standalone Mode is explicitly selected.');
                if(typeof updateDeleteGate==='function') updateDeleteGate();
                return {connected:false,reason:'no-active-session'};
            }

            // getUser() verifies that the restored session is accepted by Supabase,
            // rather than relying only on a locally cached session object.
            const user=await api().getUser();
            if(user?.email && $('supabaseEmail')) $('supabaseEmail').value=user.email;
            storeAccountEmail();
            if($('supabasePassword')) $('supabasePassword').value='';

            let selectedCaseId='';
            let selectedCaseName='';
            let caseListError=null;
            try{
                await refreshList();
                const row=selectedRow();
                if(row){ selectedCaseId=row.id; selectedCaseName=row.case_name||''; }
                if(row){
                    try{ await refreshRevisionHistory(row.id); }
                    catch(historyError){ console.warn('[R1134] Revision history refresh failed; WIP recovery may still proceed.',historyError); }
                }
            }catch(listError){
                caseListError=listError?.message||String(listError);
                // If the list endpoint is temporarily unavailable, retain only the
                // previously selected UUID. getWorkingCopy() will re-check ownership
                // through the authenticated client/RLS before any restore is allowed.
                try{ selectedCaseId=localStorage.getItem(SELECTED_CASE_KEY)||''; }catch(_){}
            }

            if(typeof updateDeleteGate==='function') updateDeleteGate();
            if(caseListError){
                setStatus(`SESSION RESTORED · Authenticated as ${user?.email||user?.id}. Cloud case list unavailable (${caseListError}); checking only the previously selected case ID if one exists.`);
            }else{
                setStatus(`SESSION RESTORED · ${user?.email||user?.id} · ${($('supabaseCaseSelect')?._r924Rows||[]).length} cloud case(s) loaded.`);
            }
            return {
                connected:true,
                userId:user?.id||restored.user?.id||null,
                userEmail:user?.email||restored.user?.email||null,
                selectedCaseId,
                selectedCaseName,
                selectedCaseRevisionId: selectedRow()?.id===selectedCaseId ? (selectedRow()?.current_revision_id || null) : null,
                selectedCasePatientName: selectedRow()?.id===selectedCaseId ? (selectedRow()?.patient_name || '') : '',
                caseListError
            };
        }catch(error){
            setStatus('SESSION RESTORE FAILED · '+(error?.message||error)+' · Local recovery remains inactive until Standalone Mode is explicitly selected.');
            if(typeof updateDeleteGate==='function') updateDeleteGate();
            return {connected:false,reason:'session-restore-failed',error:error?.message||String(error)};
        }
    })();
    window.__SUPABASE_SESSION_READY=sessionRestorePromise;

    // R1135: automatic cloud recovery targets only the previously selected cloud
    // case. It never guesses from a case name or chooses the most recently modified case.
    // A connected session with no selected case/WIP does NOT fall back to local restore.
    window.restoreSupabaseWorkingCopyAtStartup=async function(connectionState){
        await deactivateConnectedAutosave('startup cloud restore in progress');
        const connection=connectionState||await sessionRestorePromise;
        if(!connection?.connected) return {mode:'local',restored:false,reason:'not-connected'};
        const caseId=String(connection.selectedCaseId||'').trim();
        if(!caseId){
            deactivateConnectedAutosave('no previously selected cloud case');
            setStatus('CONNECTED · No previously selected cloud case. Automatic cloud recovery skipped; no unrelated case was selected.');
            return {mode:'supabase',restored:false,available:false,reason:'no-selected-cloud-case'};
        }
        try{
            const cleanContext=await installCleanCloudCaseContext(
                {id:caseId,case_name:connection.selectedCaseName||'Selected cloud case',patient_name:connection.selectedCasePatientName||''},
                ()=>{try{return localStorage.getItem(SELECTED_CASE_KEY)===caseId;}catch(_){return false;}}
            );
            if(cleanContext?.stale)throw new Error('Selected cloud case changed before startup context installation.');
            setStatus('AUTOMATIC WIP RECOVERY · Previous active CASE/AP/LAT content cleared. Checking the selected cloud case…');
            const wipLookup=await readWorkingCopyForSelectedProject(caseId);
            const saved=wipLookup.workingCopy;
            const caseName=connection.selectedCaseName||saved?.case_data?.metadata?.case_name||'Selected cloud case';
            if(!saved){
                if(connection.selectedCaseRevisionId){
                    setStatus(`AUTOMATIC CLOUD CASE OPEN · ${caseName} has no WIP. Loading its current immutable revision as the baseline…`);
                    const result=await api().openCaseIntoApplication(caseId,{
                        confirmBeforeOpen:false,
                        shouldInstall:()=>{try{return localStorage.getItem(SELECTED_CASE_KEY)===caseId;}catch(_){return false;}}
                    });
                    if(result?.stale || !result?.opened)throw new Error('The selected case current revision was not installed.');
                    setStatus(wipLookup.schemaAvailable
                        ? `AUTO CASE OPEN PASS · ${caseName} · no WIP existed; current immutable revision R${result.revisionNumber} loaded with AP/LAT images and annotations.`
                        : `AUTO CASE OPEN PASS · ${caseName} · this Supabase project has no WIP table yet; current immutable revision R${result.revisionNumber} loaded as the baseline.`);
                    activateConnectedAutosave(caseId,caseName);
                    return {mode:'supabase',restored:true,source:'current-revision',wipSchemaAvailable:wipLookup.schemaAvailable,caseId,revisionNumber:result.revisionNumber};
                }
                setStatus(wipLookup.schemaAvailable
                    ? `AUTO CLEAN CASE PASS · ${caseName} · no WIP or immutable revision exists. A clean CASE context is active and prior AP/LAT content has been cleared.`
                    : `AUTO CLEAN CASE PASS · ${caseName} · WIP storage is not provisioned in this Supabase project and no immutable revision exists. A clean CASE context is active.`);
                activateConnectedAutosave(caseId,caseName);
                return {mode:'supabase',restored:true,source:'clean-context',wipSchemaAvailable:wipLookup.schemaAvailable,caseId};
            }
            const result=await api().openWorkingCopyIntoApplication(caseId,{
                caseName,
                confirmBeforeOpen:false
            });
            if(!result?.opened) throw new Error('The existing validated case-import path did not confirm a complete WIP restore.');
            setStatus(`AUTO WIP RESTORE PASS · ${caseName} · working-copy version ${result.workingCopyVersion} restored through the existing validated case-import path.`);
            activateConnectedAutosave(caseId,caseName);
            return {
                mode:'supabase',restored:true,caseId,
                workingCopyVersion:result.workingCopyVersion,
                saveGenerationId:result.saveGenerationId,
                updatedAt:result.updatedAt
            };
        }catch(error){
            deactivateConnectedAutosave('cloud startup restore failed');
            const message=error?.message||String(error);
            setStatus('AUTO WIP RESTORE FAILED · '+message+' · Connected mode remains selected; local recovery was not used. Review the error before continuing.');
            return {mode:'supabase',restored:false,reason:message,caseId};
        }
    };
    return sessionRestorePromise;
}
