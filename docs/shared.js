// ============================================================
// APPLICATION CONSTANT
// ============================================================

const WORKFLOW = [
    "patient",
    "deformity",
    "frame",
    "mounting",
    "phases",
    "treatment",
    "reports"
];

const DEFORMITY_FIELDS = [
    "ap_translation",
    "ap_angulation",
    "lat_translation",
    "lat_angulation",
    "bone_length",
    "bone_rotation"
];

const TARGET_FIELDS = [
    "ap_translation",
    "ap_angulation",
    "lat_translation",
    "lat_angulation",
    "bone_length",
    "bone_rotation"

];

// ============================================================
// CALENDAR POLICY
// ============================================================
//
// true  = preserve the existing downstream calendar gap
// false = do not pull an already-later downstream phase
//
// This is currently a development setting.
// It should eventually come from treatment/settings UI.
//
const PRESERVE_CALENDAR_GAP = false;



// ============================================================
// R1172.9.23 — COMMITTED STAGE SNAPSHOTS — MODE ISOLATED
//
// Normal Planning and Prescription Verification can both
// operate on the same CASE phase IDs, but their prescriptions
// are different schedule products. Their rollback baselines
// must therefore never share a phase-ID-only snapshot slot.
//
// Runtime only; intentionally NOT stored inside CASE.
// ============================================================

window.savedStageSnapshotsByMode =
    window.savedStageSnapshotsByMode || {
        normal: {},
        verification: {}
    };

function getCommittedStageSnapshotStore(mode, caseRef = null){
    const activeCase = caseRef || window.currentCase || window.CASE || window.caseData || null;
    const modeKey = normalizePlannerMode(
        mode !== undefined && mode !== null
            ? mode
            : (activeCase && activeCase.metadata && activeCase.metadata.planner)
    );

    if(!window.savedStageSnapshotsByMode || typeof window.savedStageSnapshotsByMode !== "object"){
        window.savedStageSnapshotsByMode = { normal: {}, verification: {} };
    }

    // Snapshot IDs are CASE-local. If a different CASE object is installed,
    // discard the previous CASE's runtime snapshots before using its phase IDs.
    if(activeCase && window.savedStageSnapshotsOwnerCase !== activeCase){
        window.savedStageSnapshotsByMode = { normal: {}, verification: {} };
        window.savedStageSnapshotsOwnerCase = activeCase;
    }

    if(!window.savedStageSnapshotsByMode.normal || typeof window.savedStageSnapshotsByMode.normal !== "object"){
        window.savedStageSnapshotsByMode.normal = {};
    }
    if(!window.savedStageSnapshotsByMode.verification || typeof window.savedStageSnapshotsByMode.verification !== "object"){
        window.savedStageSnapshotsByMode.verification = {};
    }

    return window.savedStageSnapshotsByMode[modeKey];
}

// ============================================================
// ONE-LEVEL UNDO
//
// Holds the PREVIOUS committed state of the most recently
// successfully committed planning transaction.
//
// Runtime only.
// Never stored inside CASE.
// ============================================================

window.lastUndoTransaction =
    window.lastUndoTransaction || null;

// R1172.9.18: keep one-level Undo isolated by planner mode.
window.lastUndoTransactionsByMode =
    window.lastUndoTransactionsByMode || { normal: null, verification: null };

function normalizePlannerMode(mode){
    return mode === "verification" ? "verification" : "normal";
}

function activateUndoTransactionForMode(mode){
    const key = normalizePlannerMode(mode);
    window.lastUndoTransaction =
        window.lastUndoTransactionsByMode[key] || null;
    updateUndoButton();
}

function saveUndoTransactionForCurrentMode(transaction, mode = null){
    const c = window.currentCase || window.CASE || window.caseData;
    const key = normalizePlannerMode(
        mode !== null && mode !== undefined
            ? mode
            : (transaction && transaction.plannerMode) || (c && c.metadata && c.metadata.planner)
    );
    if(!window.lastUndoTransactionsByMode){
        window.lastUndoTransactionsByMode = { normal: null, verification: null };
    }
    transaction = transaction || null;
    if(transaction) transaction.plannerMode = key;
    window.lastUndoTransactionsByMode[key] = transaction;
    window.lastUndoTransaction = transaction;
    updateUndoButton();
}

function saveCommittedStageSnapshot(
    stage,
    mode = null
){

    if(!stage || !stage.id){
        return;
    }

    const snapshotStore = getCommittedStageSnapshotStore(mode);
    snapshotStore[stage.id] = structuredClone(stage);
}


function getCommittedStageSnapshot(
    stage,
    mode = null
){

    if(!stage || !stage.id){
        return null;
    }

    const snapshotStore = getCommittedStageSnapshotStore(mode);
    const snapshot = snapshotStore[stage.id];

    if(!snapshot){
        return null;
    }

    return structuredClone(snapshot);

}


function restoreCommittedStageSnapshot(
    stage,
    mode = null
){

    if(
        !stage ||
        !stage.id
    ){

        return false;

    }


    const snapshot =
        getCommittedStageSnapshot(
            stage,
            mode
        );


    if(!snapshot){

        return false;

    }


    Object.keys(stage)
        .forEach(
            key => {

                delete stage[key];

            }
        );


    Object.assign(
        stage,
        snapshot
    );


    return true;

}

function initializeCommittedStageSnapshots(
    c
){

    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        )
    ){

        return;

    }


    const snapshotMode = normalizePlannerMode(
        c.metadata && c.metadata.planner
    );
    const snapshotStore = getCommittedStageSnapshotStore(snapshotMode, c);

    c.treatment.stages.forEach(
        stage => {

            if(
                !stage ||
                !stage.id
            ){

                return;

            }


            // A phase with an existing prescription already
            // has a committed planning state.
            //
            // If no runtime snapshot exists yet, establish
            // the current CASE state as its rollback point.

            if(
                stage.prescription &&
                !snapshotStore[
                    stage.id
                ]
            ){

                saveCommittedStageSnapshot(
                    stage,
                    snapshotMode
                );

            }

        }
    );

}


function rollbackCascadeTransaction(
    cascadeContext
){

    if(
        !cascadeContext ||
        !Array.isArray(
            cascadeContext.stagesChanged
        )
    ){

        return false;

    }


    const c =
        window.currentCase;


    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        )
    ){

        return false;

    }


    // ----------------------------------------------------
    // Restore in reverse order.
    //
    // P3 → P2 → P1
    //
    // This is safer because a downstream phase may depend
    // on the preceding phase.
    // ----------------------------------------------------

    const stagesToRestore =
        [
            ...cascadeContext.stagesChanged
        ].reverse();


    for(
        const stageId
            of stagesToRestore
    ){

        const snapshot =
            cascadeContext.originalSnapshots[
                stageId
            ];


        if(
            !snapshot
        ){

            continue;

        }


        const index =
            c.treatment.stages.findIndex(
                stage =>
                    stage.id === stageId
            );


        if(
            index < 0
        ){

            continue;

        }


        c.treatment.stages[
            index
        ] =
            structuredClone(
                snapshot
            );

    }


    return true;

}

function captureUndoTransaction(
    cascadeContext
){

    if(
        !cascadeContext ||
        !Array.isArray(
            cascadeContext.stagesChanged
        ) ||
        cascadeContext.stagesChanged.length === 0 ||
        !cascadeContext.originalSnapshots
    ){

        return null;

    }



    return {

        transactionId:
            cascadeContext.transactionId,

        plannerMode:
            normalizePlannerMode(
                cascadeContext.plannerMode ||
                (window.currentCase && window.currentCase.metadata && window.currentCase.metadata.planner) ||
                "normal"
            ),

        rootStageId:
            cascadeContext.rootStageId,

        stagesChanged:
            structuredClone(
                cascadeContext.stagesChanged
            ),

        originalSnapshots:
            structuredClone(
                cascadeContext.originalSnapshots
            )

    };

}


// ============================================================
// ONE-LEVEL UNDO BUTTON STATE
//
// The button itself is defined in the HTML.
// shared.js only controls its enabled/disabled state and
// connects its action.
// ============================================================

function updateUndoButton(){

    const undoButton =
        document.getElementById(
            "undoPlanningButton"
        );


    if(!undoButton){

        return;

    }


    undoButton.disabled =
        !window.lastUndoTransaction;


    undoButton.onclick =
        undoLastPlanningTransaction;

}

async function undoLastPlanningTransaction(){

    const undoTransaction =
        window.lastUndoTransaction;


    if(!undoTransaction){

        updateUndoButton();

        return false;

    }

    // R1172.9.19 safety guard: never apply a transaction captured
    // under a different planner mode. Re-activate the current mode's
    // own Undo slot instead of allowing cross-mode rollback.
    const activeCaseForUndo = window.currentCase || window.CASE || window.caseData;
    const activeUndoMode = normalizePlannerMode(
        activeCaseForUndo && activeCaseForUndo.metadata && activeCaseForUndo.metadata.planner
    );
    const transactionUndoMode = normalizePlannerMode(undoTransaction.plannerMode);
    if(transactionUndoMode !== activeUndoMode){
        activateUndoTransactionForMode(activeUndoMode);
        alert("Undo was blocked because this transaction belongs to a different planning mode. The correct mode-specific Undo state has been restored.");
        return false;
    }


    // --------------------------------------------------------
    // Restore the exact state that existed BEFORE the most
    // recently committed planning transaction.
    // --------------------------------------------------------

    const rollbackContext = {

        rootStageId:
            undoTransaction.rootStageId,

        stagesChanged:
            structuredClone(
                undoTransaction.stagesChanged
            ),

        originalSnapshots:
            structuredClone(
                undoTransaction.originalSnapshots
            )

    };


    const restored =
        rollbackCascadeTransaction(
            rollbackContext
        );

    // --------------------------------------------------------
    // IMPORTANT:
    //
    // Undo has restored the previous committed state into CASE.
    // The per-phase committed snapshots must now be synchronized
    // with that restored state.
    //
    // Otherwise the next planning transaction would still think
    // that the undone plan is the committed baseline.
    // --------------------------------------------------------

    const currentCase =
        await ensureCurrentCase();


    if(
        currentCase &&
        currentCase.treatment &&
        Array.isArray(
            currentCase.treatment.stages
        )
    ){

        for(
            const stageId of
            undoTransaction.stagesChanged
        ){

            const restoredStage =
                currentCase.treatment.stages.find(
                    s =>
                        s.id === stageId
                );


            if(restoredStage){

                saveCommittedStageSnapshot(
                    restoredStage,
                    undoTransaction.plannerMode
                );

            }

        }

    }



    if(!restored){

        alert(
            "Undo could not be completed safely.\n\n" +
            "The previous committed planning state " +
            "could not be restored."
        );

        updateUndoButton();

        return false;

    }


    const c =
        await ensureCurrentCase();


    // --------------------------------------------------------
    // IMPORTANT:
    //
    // Undo has restored the previous committed state into CASE.
    // Synchronize the active mode's committed snapshot store with that restored state.
    //
    // This is essential for the NEXT planning transaction.
    // --------------------------------------------------------

    for(
        const stageId of
        undoTransaction.stagesChanged
    ){

        const restoredStage =
            c.treatment.stages.find(
                s =>
                    s.id === stageId
            );


        if(restoredStage){

            saveCommittedStageSnapshot(
                restoredStage,
                undoTransaction.plannerMode
            );

        }

    }


    // --------------------------------------------------------
    // Restore the phase that started the transaction.
    // --------------------------------------------------------

    if(
        c &&
        c.treatment &&
        undoTransaction.rootStageId
    ){

        c.treatment.selected_stage_id =
            undoTransaction.rootStageId;

    }


    await syncCurrentCase();

    // R1172.6.2 — Undo is a committed CASE change too.
    // Notify the existing persistence listeners and republish the
    // restored treatment plan to an already-mounted Three.js viewer.
    emitCommittedCaseChange("treatment", "planning-undo");
    refreshThreePrototypeAfterPlanCommit();

    // --------------------------------------------------------
    // Refresh the visible Treatment Plan UI.
    // --------------------------------------------------------

    populatePhases();

    await populateTreatment();


    setPlannerStatus(
        "Undo completed"
    );


    // --------------------------------------------------------
    // One-level Undo:
    //
    // Once used, the Undo transaction is consumed.
    // --------------------------------------------------------

    const undoMode = normalizePlannerMode(undoTransaction.plannerMode);
    if(!window.lastUndoTransactionsByMode){
        window.lastUndoTransactionsByMode = { normal: null, verification: null };
    }
    window.lastUndoTransactionsByMode[undoMode] = null;
    window.lastUndoTransaction = null;

    updateUndoButton();


    alert(
        "Undo completed.\n\n" +
        "The previous committed planning state " +
        "has been restored."
    );


    return true;

}

// ============================================================
// BROWSER-OWNED CASE BOOTSTRAP — R1172.6
// ============================================================
let currentCaseBootstrapPromise = null;

function isR1172_6CaseObject(value){
    return !!(
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value.metadata &&
        typeof value.metadata === "object" &&
        !Array.isArray(value.metadata)
    );
}

async function createAndCommitBrowserDefaultCase(){
    const factory = window.r914BuildDefaultCase;
    if(typeof factory !== "function"){
        throw new Error("Browser default CASE factory is unavailable. Check patient.js loading.");
    }

    const freshCase = factory(null);
    if(!isR1172_6CaseObject(freshCase) || !freshCase.frame || !freshCase.mounting || !freshCase.deformity || !freshCase.treatment){
        throw new Error("Browser default CASE factory returned an incomplete CASE.");
    }

    try{
        window.currentCase = freshCase;
        await syncCurrentCase();
        if(!freshCase.debug_sync || freshCase.debug_sync.success !== true || freshCase.debug_sync.source !== "browser-js"){
            const detail = freshCase.debug_sync && freshCase.debug_sync.error;
            throw new Error("Default CASE parameter translation failed" + (detail ? ": " + detail : "."));
        }
        return freshCase;
    }catch(error){
        // Never leave an uncommitted in-memory CASE looking initialized.
        window.currentCase = null;
        throw error;
    }
}

async function ensureCurrentCase(){
    // A recovered/imported CASE already installed in the browser always wins.
    // Otherwise create the default CASE locally; there is no server CASE mirror.
    if(currentCaseBootstrapPromise){
        window.currentCase = await currentCaseBootstrapPromise;
    }else if(!isR1172_6CaseObject(window.currentCase)){
        currentCaseBootstrapPromise = createAndCommitBrowserDefaultCase().finally(function(){
            currentCaseBootstrapPromise = null;
        });
        window.currentCase = await currentCaseBootstrapPromise;
    }

    initializeCommittedStageSnapshots(window.currentCase);
    return window.currentCase;
}

// R1144.3.4: explicitly publish the CASE bootstrap API for workspace controllers.
// This preserves the existing implementation while making the cross-script
// dependency unambiguous in the browser global scope.
window.ensureCurrentCase = ensureCurrentCase;

async function initializeTreatmentIfNeeded(){

    const c = await ensureCurrentCase();

    // Ensure treatment object exists.
    if(!c.treatment){
        c.treatment = {};
    }

    // Ensure stages array exists.
    if(!Array.isArray(c.treatment.stages)){
        c.treatment.stages = [];
    }

    let changed = false;

    // Create Phase 1 if needed.
    if(c.treatment.stages.length === 0){

        c.treatment.stages.push({
        
            id:
                crypto.randomUUID(),
        
            name:
                "Phase 1",
        
            notes:
                "",
        
            startBoneState:
                null,
        
            target:
                createDefaultTarget(c),
        
            prescription:
                null,
        
            duration:
                null,
        
            startDate:
                null,
        
            endDate:
                null,
        
            status:
                "target",
        
            approvedAt:
                null
        });

        changed = true;
    }

    // Ensure a valid selected stage.
    const selectedExists =
        c.treatment.stages.some(
            s => s.id === c.treatment.selected_stage_id
        );

    if(!selectedExists){

        c.treatment.selected_stage_id =
            c.treatment.stages[0].id;

        changed = true;
    }

    if(changed){
        await syncCurrentCase();
    }

    return c;
}

function currentStage(){
    if(
        !window.currentCase ||
        !window.currentCase.treatment
    ){
        return null;
    }

    const id =
        window.currentCase
              .treatment
              .selected_stage_id;

    return window.currentCase
                 .treatment
                 .stages
                 .find(
                     stage => stage.id === id
                 );
}


function ensureStageDefaults(stage){
    if(!stage){
        return;
    }

    if(!stage.target){
        stage.target = {
            ap_translation:{
                value:0,
                direction:"lateral"
            },
            ap_angulation:{
                value:0,
                direction:"valgus"
            },
            lat_translation:{
                value:0,
                direction:"anterior"
            },
            lat_angulation:{
                value:0,
                direction:"anterior"
            },
            bone_length:{
                value:0,
                direction:"short"
            },
            bone_rotation:{
                value:0,
                direction:"internal"
            }
        };
    }

    if(!stage.prescription){
        stage.prescription={
            generated:false,
            total_days:0
        };
    }
}


// ============================================================
// CASE SYNCHRONIZATION GATE
//
// Browser CASE edits are synchronized to the application
// through a serialized/coalesced request queue.
//
// IMPORTANT:
// R1172.6 — Browser-owned CASE commit boundary.
// `window.currentCase` is the only active in-memory CASE authority.
// Durable recovery is handled separately by IndexedDB (Standalone) or
// Supabase (Connected); this function deliberately performs no HTTP request.
let caseSyncRequestedVersion = 0;
let caseSyncCompletedVersion = 0;

// ============================================================
// R1172.2 — BROWSER CASE → MECHANICAL PARAMETER TRANSLATION
// Mirrors simulation_ui.py::build_parameters_from_case().
// Flask now stores the already-translated CASE; Python retains
// the original translator as an offline/reference implementation.
// ============================================================
function r1172_2SignedCaseValue(item, positiveDirection, label){
    if(!item || typeof item !== "object"){
        throw new TypeError(label + " is missing.");
    }
    const value = Number(item.value);
    if(!Number.isFinite(value)){
        throw new TypeError(label + ".value must be finite.");
    }
    return item.direction === positiveDirection ? value : -value;
}

function buildBrowserCaseMechanicalParameters(caseData){
    const c = caseData;
    if(!c || typeof c !== "object") throw new TypeError("CASE object is required.");
    const frame = c.frame;
    const mounting = c.mounting;
    const deformity = c.deformity;
    if(!frame || !mounting || !deformity) {
        throw new TypeError("CASE.frame, CASE.mounting and CASE.deformity are required.");
    }
    if(!window.HardwareSpec || typeof window.HardwareSpec.resolveAnchorRadiusMm !== "function"){
        throw new Error("HardwareSpec.resolveAnchorRadiusMm() is unavailable.");
    }
    const initialStruts = frame.initial_strut_lengths;
    if(!Array.isArray(initialStruts) || initialStruts.length !== 6 || initialStruts.some(v => !Number.isFinite(Number(v)))){
        throw new TypeError("CASE.frame.initial_strut_lengths must contain six finite values.");
    }

    const params = {};
    params.ANCHOR_RADIUS = window.HardwareSpec.resolveAnchorRadiusMm(frame);
    params.PHASE1_DAY0_STRUTS = initialStruts.map(Number);

    params.BONE_PROX_ORIGIN = [
        r1172_2SignedCaseValue(mounting.ap_offset, "lateral", "mounting.ap_offset"),
        r1172_2SignedCaseValue(mounting.lat_offset, "posterior", "mounting.lat_offset"),
        r1172_2SignedCaseValue(mounting.axial_offset, "distal", "mounting.axial_offset")
    ];

    // Preserve the legacy ZXY parameter order: master rotation, LAT tilt, AP tilt.
    params.R_PROX_ANGLES = [
        r1172_2SignedCaseValue(mounting.master_rotation, "internal", "mounting.master_rotation"),
        r1172_2SignedCaseValue(mounting.lat_tilt, "distal", "mounting.lat_tilt"),
        r1172_2SignedCaseValue(mounting.ap_tilt, "distal", "mounting.ap_tilt")
    ];

    params.CLINICAL_OFFSET = [
        r1172_2SignedCaseValue(deformity.ap_translation, "medial", "deformity.ap_translation"),
        r1172_2SignedCaseValue(deformity.lat_translation, "anterior", "deformity.lat_translation"),
        r1172_2SignedCaseValue(deformity.bone_length, "short", "deformity.bone_length")
    ];

    params.CLINICAL_ANGLES = [
        r1172_2SignedCaseValue(deformity.bone_rotation, "external", "deformity.bone_rotation"),
        r1172_2SignedCaseValue(deformity.lat_angulation, "posterior", "deformity.lat_angulation"),
        r1172_2SignedCaseValue(deformity.ap_angulation, "valgus", "deformity.ap_angulation")
    ];

    const treatment = c.treatment || {};
    const stages = Array.isArray(treatment.stages) ? treatment.stages : [];
    const selectedStage = stages.find(stage => stage && stage.id === treatment.selected_stage_id);
    const target = selectedStage && selectedStage.target;
    if(target){
        params.TARGET_OFFSET = [
            r1172_2SignedCaseValue(target.ap_translation, "medial", "target.ap_translation"),
            r1172_2SignedCaseValue(target.lat_translation, "anterior", "target.lat_translation"),
            r1172_2SignedCaseValue(target.bone_length, "short", "target.bone_length")
        ];
        params.TARGET_ANGLES = [
            r1172_2SignedCaseValue(target.bone_rotation, "external", "target.bone_rotation"),
            r1172_2SignedCaseValue(target.lat_angulation, "posterior", "target.lat_angulation"),
            r1172_2SignedCaseValue(target.ap_angulation, "valgus", "target.ap_angulation")
        ];
    }

    const plannerMode = (c.metadata && c.metadata.planner) || "normal";
    if(plannerMode === "verification"){
        params.PRESCRIPTION_VERIFICATION = true;
        params.VERIFICATION_STRUT_ARRAY = getPrescriptionVerificationRows(c);
    } else {
        const merged = [];
        stages.forEach((stage, index) => {
            const rows = stage && stage.prescription && stage.prescription.strut_array;
            if(!Array.isArray(rows) || rows.length === 0) return;
            const start = index === 0 ? 0 : 1;
            for(let i = start; i < rows.length; i++){
                const row = rows[i];
                if(!Array.isArray(row) || row.length !== 6 || row.some(v => !Number.isFinite(Number(v)))){
                    throw new TypeError("Treatment stage " + index + " contains an invalid six-strut row.");
                }
                merged.push(row.map(Number));
            }
        });
        if(merged.length){
            params.STRUT_ARRAY_OVERRIDE = merged;
        } else {
            const fallback = Array.isArray(c.prescription) ? c.prescription : c.prescription?.strut_array;
            if(Array.isArray(fallback) && fallback.length){
                params.STRUT_ARRAY_OVERRIDE = fallback.map(row => row.map(Number));
            }
        }
    }
    return params;
}

function applyBrowserCaseParameterTranslation(caseData){
    try{
        caseData.parameters = buildBrowserCaseMechanicalParameters(caseData);
        caseData.debug_sync = { success:true, source:"browser-js", version:"R1172.2" };
        return true;
    }catch(err){
        caseData.debug_sync = {
            success:false,
            stage:"browser_case_parameter_translation",
            error:String(err && err.message || err),
            exception:(err && err.name) || "Error",
            source:"browser-js",
            version:"R1172.2"
        };
        return false;
    }
}

// ------------------------------------------------------------
// R1144.2 / R1172.6.1 — CENTRAL CASE CHANGE NOTIFICATION
// ------------------------------------------------------------
// Announces a successfully committed browser CASE edit to the existing
// coordinator. This is a notification only; persistence remains owned by
// ConnectedCaseAutosave or the Standalone recovery listener.
function emitCommittedCaseChange(source, reason){
    const coordinator = window.CaseChangeCoordinator;
    if (!coordinator || typeof coordinator.emit !== "function") {
        return { accepted: false, reason: "coordinator-unavailable" };
    }
    return coordinator.emit({
        domain: "case",
        operation: "update",
        source: source,
        reason: reason || "workspace-commit"
    });
}

// ------------------------------------------------------------
// BROWSER-LOCAL CASE COMMIT BOUNDARY — R1172.6
// ------------------------------------------------------------
// Historical call sites continue to await syncCurrentCase(), but the commit
// now means: translate derived mechanics, verify JSON serializability, and
// advance the browser commit version. No Flask/server copy is created.
function syncCurrentCase(){
    const version = ++caseSyncRequestedVersion;
    return Promise.resolve().then(function(){
        const activeCase = window.currentCase;
        if(!activeCase || typeof activeCase !== "object" || Array.isArray(activeCase)){
            throw new Error("There is no valid browser CASE to commit.");
        }

        const translationSucceeded = applyBrowserCaseParameterTranslation(activeCase);
        const snapshot = JSON.parse(JSON.stringify(activeCase));
        if(!snapshot || !snapshot.metadata || typeof snapshot.metadata !== "object") {
            throw new Error("Browser CASE commit failed: CASE metadata is missing.");
        }

        caseSyncCompletedVersion = version;
        window.__CASE_SYNC_STATE = {
            status: "committed",
            source: "browser-memory",
            version: version,
            parameterTranslationSucceeded: translationSucceeded,
            committedAt: new Date().toISOString()
        };
        window.dispatchEvent(new CustomEvent("case-sync-completed", {
            detail: window.__CASE_SYNC_STATE
        }));

        return {
            status: "ok",
            source: "browser-memory",
            version: version,
            parameterTranslationSucceeded: translationSucceeded
        };
    });
}

// ============================================================
// WORKFLOW NVIGATION 
// ============================================================

function currentWorkspace(){
    const path = window.location.pathname;
    return path.replace("/", "");
}


function nextWorkspace(){
    const current = currentWorkspace();
    const index = WORKFLOW.indexOf(current);
    if(index < 0) return null;
    if(index >= WORKFLOW.length - 1) return null;
    return WORKFLOW[index + 1];
}


function previousWorkspace(){
    const current = currentWorkspace();
    const index = WORKFLOW.indexOf(current);
    if(index <= 0) return null;
    return WORKFLOW[index - 1];
}

function goNextWorkspace(){
    const next = nextWorkspace();
    if(next){
        window.location.href = "/" + next;
    }
}


function goPreviousWorkspace(){
    const previous = previousWorkspace();
    if(previous){
        window.location.href = "/" + previous;
    }
}

function initializeWorkflowButtons(){
    const previous =document.getElementById("previousButton");
    if(previous){previous.onclick = goPreviousWorkspace;}
    const next =document.getElementById("nextButton");
    if(next){next.onclick = goNextWorkspace;}
}

//  triggered when current_case is updated..
//jul 9, 2026 currently only patient_workspace has load case
// so it is used in the page only.. the fuction might be needed on other pages in future
function refreshCurrentWorkflow(){ 
    const path = window.location.pathname;

    if(path == "/patient"){
        if(typeof refreshPatientWorkflow === "function"){refreshPatientWorkflow();}}

    else if(path == "/deformity"){
        if(typeof refreshDeformityWorkflow === "function"){refreshDeformityWorkflow();}}

    else if(path == "/mounting"){
        if(typeof refreshMountingWorkflow === "function"){refreshMountingWorkflow();}}

    else if(path == "/frame"){
        if(typeof refreshFrameWorkflow === "function"){refreshFrameWorkflow();}}

    else if(path == "/phases"){
        if(typeof refreshPhasesWorkflow === "function"){refreshPhaseWorkflow();}}

    else if(path == "/treatment"){
        if(typeof refreshTreatmentWorkflow === "function"){refreshTreatmentWorkflow();}}

}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
// work for input snd checkbox
function setValue(id, value){
    const e = document.getElementById(id);
    if(!e) return;
    if(e.type === "checkbox"){
        e.checked = !!value;
    }else{
        e.value = value;
    }
}

function getValue(id){
    const e = document.getElementById(id);
    if(!e){return "";}
    return e.value;
}

function setText(id,text){
    const e = document.getElementById(id);
    if(e){e.textContent = text;}
}


function setRadio(name, value){
    const radios = document.getElementsByName(name);
    for(const radio of radios){
        radio.checked = (radio.value === value);
    }
}

function getRadio(name){
    const radios = document.getElementsByName(name);
    for(const radio of radios){
        if(radio.checked){return radio.value;}
    }
    return null;
}

function capitalize(text){
    if(!text){return "";}
    return (text.charAt(0).toUpperCase() +text.slice(1));
}

function formatFileSize(bytes){
    if(bytes < 1024){return bytes + " B"; }
    if(bytes < 1024 * 1024){return (bytes / 1024).toFixed(1) + " KB";}
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}


function populateTargetSummary(

    containerId,

    target

){

    const container =

        document.getElementById(

            containerId

        );

    if(!container){

        return;

    }

    container.innerHTML = `

        <div class="summaryCard">

            <div class="summaryHeader">

                <div>

                    <b>Translation</b>

                </div>

                <div>

                    <b>Rotation</b>

                </div>

            </div>

            <div class="summaryRow">
            
                <div>
            
                    ${Math.abs(Number(target.ap_translation.value) || 0)}
                    mm
                    ${capitalize(target.ap_translation.direction)}
            
                </div>
            
                <div>
            
                    ${Math.abs(Number(target.ap_angulation.value) || 0)}°
                    ${capitalize(target.ap_angulation.direction)}
            
                </div>
            
            </div>
            
            <div class="summaryRow">
            
                <div>
            
                    ${Math.abs(Number(target.lat_translation.value) || 0)}
                    mm
                    ${capitalize(target.lat_translation.direction)}
            
                </div>
            
                <div>
            
                    ${Math.abs(Number(target.lat_angulation.value) || 0)}°
                    ${capitalize(target.lat_angulation.direction)}
            
                </div>
            
            </div>
            
            <div class="summaryRow">
            
                <div>
            
                    ${Math.abs(Number(target.bone_length.value) || 0)}
                    mm
                    ${capitalize(target.bone_length.direction)}
            
                </div>
            
                <div>
            
                    ${Math.abs(Number(target.bone_rotation.value) || 0)}°
                    ${capitalize(target.bone_rotation.direction)}
            
                </div>
            
            </div>

        </div>

    `;

}

function renumberStages(c){

    c.treatment.stages.forEach(

        function(stage,index){

            // Preserve only genuine user names.
            // Renumber anything that still looks like a default phase name.

            if(
                stage.name === "" ||
                /^Phase\s+\d+$/.test(stage.name)
            ){

                stage.name =
                    "Phase " + (index + 1);

            }

        }

    );

}



function showPlannerOverlay(titleText, messageText, hintText) {
    const overlay = document.getElementById("plannerOverlay");

    if (overlay) {
        // Update the text content dynamically
        overlay.querySelector(".plannerOverlayTitle").textContent = titleText;
        overlay.querySelector(".plannerOverlayMessage").textContent = messageText;
        overlay.querySelector(".plannerOverlayHint").textContent = hintText;

        // Show the overlay
        overlay.classList.add("show");
    }
}


function hidePlannerOverlay(){

    const overlay =
        document.getElementById(
            "plannerOverlay"
        );

    if(overlay){

        overlay.classList.remove(
            "show"
        );

    }

}

// Bind only the inputs owned by the workspace being initialized.
// In the SPA, pass its cached container ID (for example, "workspace_deformity").
// In the legacy MPA, omit workspaceRoot and use the page's #workspace container.
function bindWorkspaceInputs(callback, workspaceRoot){

    let root;

    if (typeof workspaceRoot === "string") {
        root = document.getElementById(workspaceRoot);
        // Fail closed: never fall back to #workspaceHost if an explicit
        // workspace container is missing, because that would bind every workspace.
        if (!root) return;
    } else if (workspaceRoot) {
        root = workspaceRoot;
    } else {
        root = document.getElementById("workspace");
    }

    if (!root) return;

    root
        .querySelectorAll("input, textarea, select")
        .forEach(control=>{
            // One commit event per control; avoid duplicate async CASE writes.
            control.onchange = callback;
        });

}

function getPhaseStartingBoneState(c, stage){

    if(!stage){
        return null;
    }

    // If this phase already has a frozen starting state,
    // preserve it.
    if(stage.startBoneState){
        return structuredClone(
            stage.startBoneState
        );
    }

    // Phase 1 starts from the patient's current deformity.
    if(
        !stage.startBoneState &&
        c.deformity
    ){

        return {
            apTranslation:
                structuredClone(
                    c.deformity.ap_translation
                ),

            apAngulation:
                structuredClone(
                    c.deformity.ap_angulation
                ),

            latTranslation:
                structuredClone(
                    c.deformity.lat_translation
                ),

            latAngulation:
                structuredClone(
                    c.deformity.lat_angulation
                ),

            boneLength:
                structuredClone(
                    c.deformity.bone_length
                ),

            boneRotation:
                structuredClone(
                    c.deformity.bone_rotation
                )
        };
    }

    return null;
}


// ============================================================
// PATIENT
// ============================================================

async function populatePatient(){
    const c = await ensureCurrentCase();
    
    setValue("case_name",c.metadata.case_name);
    setValue("planner_mode",c.metadata.planner);
    setValue("case_created",c.metadata.case_created);
    setValue("case_modified",c.metadata.case_modified);
    setValue("file_saved",c.metadata.file_saved);
    setValue("version",c.metadata.version);

    setValue("patient_name",c.patient.patient_name);
    setValue("patient_id",c.patient.patient_id);
    setValue("surgeon",c.patient.surgeon);
    setValue("hospital",c.patient.hospital);  
    if(document.getElementById("notes")){
        setValue("notes",c.patient.notes || "");
    }
}

function collectPatient(){

    window.currentCase.metadata.case_name = getValue("case_name");
    window.currentCase.patient.patient_name = getValue("patient_name");
    window.currentCase.patient.patient_id = getValue("patient_id");
    window.currentCase.patient.surgeon = getValue("surgeon");
    window.currentCase.patient.hospital = getValue("hospital");
    window.currentCase.patient.notes = getValue("notes");
}

async function commitPatient(){
    collectPatient();
    await syncCurrentCase();
}

function refreshPatientWorkflow(){
    populatePatient();
}


// ============================================================
// DEFORMITY
// ============================================================
async function populateDeformity(){
    const c = await ensureCurrentCase();
    //alert(JSON.stringify(c, null, 2));
    
    const deformity = c.deformity;
    for(const field of DEFORMITY_FIELDS){
        setValue(field, deformity[field].value);
        const radios = document.getElementsByName(
            field + "_direction"
        );

        for(const radio of radios){
            radio.checked =
                radio.value === deformity[field].direction;
        }
    }

    setValue(
        "loc_enabled",
        c.deformity.loc.enabled
    );
    
    document.getElementById(
        "locSection"
    ).style.display =
        c.deformity.loc.enabled
        ? "block"
        : "none";
    
    setValue(
        "loc_ap_offset",
        c.deformity.loc.ap.value
    );
    setRadio(
        "loc_ap_direction",
        c.deformity.loc.ap.direction
    );
    
    setValue(
        "loc_lat_offset",
        c.deformity.loc.lat.value
    );
    setRadio(
        "loc_lat_direction",
        c.deformity.loc.lat.direction
    );
    
    setValue(
        "loc_axial_offset",
        c.deformity.loc.axial.value
    );
    setRadio(
        "loc_axial_direction",
        c.deformity.loc.axial.direction
    );
    
    
}


async function collectDeformity(){
    if(!window.currentCase){
        return;
    }
    //alert("in collectDeformity ")
    //alert(JSON.stringify(window.currentCase, null, 2));
    for(const field of DEFORMITY_FIELDS){
        window.currentCase.deformity[field].value =
            Number(document.getElementById(field).value);

        const radios = document.getElementsByName(field + "_direction");

        for(const radio of radios){
            if(radio.checked){window.currentCase.deformity[field].direction = radio.value;}
        }
    }

    window.currentCase.deformity.loc.enabled =
        document.getElementById(
            "loc_enabled"
        ).checked;
    
    window.currentCase.deformity.loc.ap.value =
        Number(getValue("loc_ap_offset"));
    
    window.currentCase.deformity.loc.ap.direction =
        getRadio("loc_ap_direction");
    
    
    window.currentCase.deformity.loc.lat.value =
        Number(getValue("loc_lat_offset"));
    
    window.currentCase.deformity.loc.lat.direction =
        getRadio("loc_lat_direction");
    
    
    window.currentCase.deformity.loc.axial.value =
        Number(getValue("loc_axial_offset"));
    
    window.currentCase.deformity.loc.axial.direction =
        getRadio("loc_axial_direction");    
    
}

async function commitDeformity(){

    await collectDeformity();
    await syncCurrentCase();
    emitCommittedCaseChange("deformity", "deformity-commit");
}

function refreshDeformityWorkflow(){
    populateDeformity();
}

// ============================================================
// FRAME
// ============================================================
async function populateFrame(){

    const c = await ensureCurrentCase();
    setValue("hardware",c.frame.hardware);
    setValue("proximal_ring_diameter",c.frame.proximal_ring_diameter);
    setValue("distal_ring_diameter",c.frame.distal_ring_diameter);
    setValue("strut_size",c.frame.strut_size);
    setValue("master_tab_position",c.frame.master_tab_position);
    for(let i=0;i<6;i++){
        setValue("strut"+(i+1),c.frame.initial_strut_lengths[i]);
    }
}

function collectFrame(){
    window.currentCase.frame.hardware = getValue("hardware");
    window.currentCase.frame.proximal_ring_diameter =Number(getValue("proximal_ring_diameter"));
    window.currentCase.frame.distal_ring_diameter =Number(getValue("distal_ring_diameter"));
    window.currentCase.frame.strut_size =getValue("strut_size");
    window.currentCase.frame.master_tab_position =getValue("master_tab_position");
    window.currentCase.frame.initial_strut_lengths = [];
    for(let i=1;i<=6;i++){
        window.currentCase.frame.initial_strut_lengths.push(
            Number(getValue("strut"+i))
        );
    }
}


async function commitFrame(){

    collectFrame();
    await syncCurrentCase();
    emitCommittedCaseChange("frame", "frame-commit");

}

function refreshFrameWorkflow(){
    populateFrame();
}


// ============================================================
// MOUNTING
// ============================================================

async function populateMounting(){

    const c = await ensureCurrentCase();
    //alert("populateMounting ver 1 ");
    //alert(JSON.stringify(c, null, 2));
    setValue("mount_ap_offset",c.mounting.ap_offset.value);
    setValue("mount_ap_tilt",c.mounting.ap_tilt.value);
    setValue("mount_lat_offset",c.mounting.lat_offset.value);
    setValue("mount_lat_tilt",c.mounting.lat_tilt.value);
    setValue("mount_axial_offset",c.mounting.axial_offset.value);
    setValue("mount_master_rotation",c.mounting.master_rotation.value);
    
    setRadio("mount_ap_offset_dir",c.mounting.ap_offset.direction);
    setRadio("mount_ap_tilt_dir",c.mounting.ap_tilt.direction);
    setRadio("mount_lat_offset_dir",c.mounting.lat_offset.direction);
    setRadio("mount_lat_tilt_dir",c.mounting.lat_tilt.direction);
    setRadio("mount_axial_offset_dir",c.mounting.axial_offset.direction);
    setRadio("mount_master_rotation_dir",c.mounting.master_rotation.direction);
    
}

function collectMounting(){
    
    window.currentCase.mounting.ap_offset = {value:Number(getValue("mount_ap_offset")),direction:getRadio("mount_ap_offset_dir")};    
    window.currentCase.mounting.lat_offset = {value:Number(getValue("mount_lat_offset")),direction:getRadio("mount_lat_offset_dir")};    
    window.currentCase.mounting.axial_offset = {value:Number(getValue("mount_axial_offset")),direction:getRadio("mount_axial_offset_dir")};    
    window.currentCase.mounting.ap_tilt = {value:Number(getValue("mount_ap_tilt")),direction:getRadio("mount_ap_tilt_dir")};    
    window.currentCase.mounting.lat_tilt = {value:Number(getValue("mount_lat_tilt")),direction:getRadio("mount_lat_tilt_dir")};    
    window.currentCase.mounting.master_rotation = {value:Number(getValue("mount_master_rotation")),direction:getRadio("mount_master_rotation_dir")};    

    
    
}


async function commitMounting(){

    collectMounting();
    await syncCurrentCase();
    emitCommittedCaseChange("mounting", "mounting-commit");
}

function refreshMountingWorkflow(){
    populateMounting();
}


// ============================================================
// TREATMENT
// ============================================================

// create default target
function createDefaultTarget(c){
    const stages =
        c.treatment.stages;
    
    // First stage
    if(stages.length === 0){
        return structuredClone(
            c.deformity
        );
    }
    // Otherwise copy previous stage
    return structuredClone(
        stages[
            stages.length - 1
        ].target
    );
}


async function addStage(){

    const c =
        await ensureCurrentCase();

    c.treatment.stages.push({

        id:
            crypto.randomUUID(),

        name:
            "",

        notes:
            "",

        // Actual bone state when this phase begins.
        // Filled when the phase is committed/approved.
        startBoneState:
            null,
        
        // Calculated final state produced by the planner.
        // This is used as the starting reference for
        // a later phase without recalculating this phase.
        recoveredFinalState:
            null,
        
        target:
            createDefaultTarget(c),
            
        // Generated prescription for this phase.
        prescription:
            null,

        duration:
            null,

        // Calendar dates for this phase.
        startDate:
            null,

        endDate:
            null,

        // target → planned → approved
        status:
            "target",

        // Timestamp when the plan is approved.
        approvedAt:
            null
    });

    renumberStages(c);

    c.treatment.selected_stage_id =
        c.treatment.stages[
            c.treatment.stages.length - 1
        ].id;

    await syncCurrentCase();
    emitCommittedCaseChange("phases", "phase-create");
    
    populatePhases();
    
    await populateTreatment();
}



async function deleteCurrentStage(){
    const c = await ensureCurrentCase();
    const stages =
        c.treatment.stages;
    if(stages.length===0){
        return;
    }

    const stage = currentStage();
    if(!stage){return;}

    if(stages.length === 1){alert("At least one phase is required.");
        return;
    }
    
    const ok = confirm("Delete " +stage.name +" ?");

    if(!ok){return;}

    const index = stages.findIndex(s=>s.id===stage.id);

    stages.splice(index,1);
    renumberStages(c);
    if(stages.length===0){
        c.treatment.selected_stage_id =
            null;
    }else{
        const newIndex =
            Math.max(
                0,
                index-1
            );

        c.treatment.selected_stage_id =
            stages[newIndex].id;
    }

    await syncCurrentCase();
    emitCommittedCaseChange("phases", "phase-delete");
    populatePhases();

}

function bindNumericField(
    elementId,
    getter,
    setter
){

    document.getElementById(
        elementId
    ).oninput = async function(){

        const stage = currentStage();

        if(!stage){
            return;
        }

        setter(
            stage,
            Number(this.value)
        );

        await syncCurrentCase();
        emitCommittedCaseChange("phases", "phase-target-value-change");

    };

}

function bindDirectionField(

    radioName,

    getter,

    setter

){

    const radios =
        document.getElementsByName(
            radioName
        );

    radios.forEach(

        function(radio){

            radio.onchange = async function(){

                if(!this.checked){
                    return;
                }

                const stage =
                    currentStage();

                if(!stage){
                    return;
                }

                setter(
                    stage,
                    this.value
                );

                await syncCurrentCase();
                emitCommittedCaseChange("phases", "phase-target-direction-change");

            };

        }

    );

}

function populatePhaseEditor(){

    const stage = currentStage();

    if(!stage){
        return;
    }

    document.getElementById(
        "stage_name"
    ).value = stage.name;

    document.getElementById(
        "stage_notes"
    ).value = stage.notes;


    document.getElementById(
        "phase_ap_translation_value"
    ).value =
        stage.target.ap_translation.value;
    
    document.getElementById(
        "phase_ap_angulation_value"
    ).value =
        stage.target.ap_angulation.value;
    
    document.getElementById(
        "phase_lat_translation_value"
    ).value =
        stage.target.lat_translation.value;
    
    document.getElementById(
        "phase_lat_angulation_value"
    ).value =
        stage.target.lat_angulation.value;
    
    document.getElementById(
        "phase_bone_length_value"
    ).value =
        stage.target.bone_length.value;
    
    document.getElementById(
        "phase_bone_rotation_value"
    ).value =
        stage.target.bone_rotation.value;
        
    document.querySelector(
    
        `input[name="phase_ap_translation_direction"][value="${stage.target.ap_translation.direction}"]`
    
    ).checked = true;
    
    document.querySelector(
    
        `input[name="phase_ap_angulation_direction"][value="${stage.target.ap_angulation.direction}"]`
    
    ).checked = true;
    
    document.querySelector(
    
        `input[name="phase_lat_translation_direction"][value="${stage.target.lat_translation.direction}"]`
    
    ).checked = true;
    
    document.querySelector(
    
        `input[name="phase_lat_angulation_direction"][value="${stage.target.lat_angulation.direction}"]`
    
    ).checked = true;
    
    document.querySelector(
    
        `input[name="phase_bone_length_direction"][value="${stage.target.bone_length.direction}"]`
    
    ).checked = true;
    
    document.querySelector(
    
        `input[name="phase_bone_rotation_direction"][value="${stage.target.bone_rotation.direction}"]`
    
    ).checked = true;        
        
}


function initializePhaseEditor(){

    document.getElementById(
        "stage_name"
    ).oninput = async function(){

        const stage = currentStage();

        if(!stage){
            return;
        }

        stage.name = this.value;

        await syncCurrentCase();
        emitCommittedCaseChange("phases", "phase-name-change");

        populatePhases();

    };

    const stageNotesField = document.getElementById("stage_notes");

    // Keep the working CASE value synchronized while the user types.
    // Do not emit a semantic CASE event for every input keystroke.
    stageNotesField.oninput = async function(){

        const stage = currentStage();

        if(!stage){
            return;
        }

        stage.notes = this.value;

        await syncCurrentCase();

    };

    // A native change event fires once the edited value is committed
    // (normally when the user leaves the textarea).
    stageNotesField.onchange = async function(){

        const stage = currentStage();

        if(!stage){
            return;
        }

        stage.notes = this.value;

        await syncCurrentCase();
        emitCommittedCaseChange("phases", "phase-notes-change");

    };

    bindNumericField(
    
        "phase_ap_translation_value",
    
        stage => stage.target.ap_translation.value,
    
        (stage,value)=>{
            stage.target.ap_translation.value =
                value;
        }
    
    );
    
    bindNumericField(
    
        "phase_ap_angulation_value",
    
        stage => stage.target.ap_angulation.value,
    
        (stage,value)=>{
            stage.target.ap_angulation.value =
                value;
        }
    
    );
    
    bindNumericField(
    
        "phase_lat_translation_value",
    
        stage => stage.target.lat_translation.value,
    
        (stage,value)=>{
            stage.target.lat_translation.value =
                value;
        }
    
    );
    
    bindNumericField(
    
        "phase_lat_angulation_value",
    
        stage => stage.target.lat_angulation.value,
    
        (stage,value)=>{
            stage.target.lat_angulation.value =
                value;
        }
    
    );
    
    bindNumericField(
    
        "phase_bone_length_value",
    
        stage => stage.target.bone_length.value,
    
        (stage,value)=>{
            stage.target.bone_length.value =
                value;
        }
    
    );
    
    bindNumericField(
    
        "phase_bone_rotation_value",
    
        stage => stage.target.bone_rotation.value,
    
        (stage,value)=>{
            stage.target.bone_rotation.value =
                value;
        }
    
    );

    bindDirectionField(
    
        "phase_ap_translation_direction",
    
        stage => stage.target.ap_translation.direction,
    
        (stage,value)=>{
            stage.target.ap_translation.direction =
                value;
        }
    
    );
    
    bindDirectionField(
    
        "phase_ap_angulation_direction",
    
        stage => stage.target.ap_angulation.direction,
    
        (stage,value)=>{
            stage.target.ap_angulation.direction =
                value;
        }
    
    );
    
    bindDirectionField(
    
        "phase_lat_translation_direction",
    
        stage => stage.target.lat_translation.direction,
    
        (stage,value)=>{
            stage.target.lat_translation.direction =
                value;
        }
    
    );
    
    bindDirectionField(
    
        "phase_lat_angulation_direction",
    
        stage => stage.target.lat_angulation.direction,
    
        (stage,value)=>{
            stage.target.lat_angulation.direction =
                value;
        }
    
    );
    
    bindDirectionField(
    
        "phase_bone_length_direction",
    
        stage => stage.target.bone_length.direction,
    
        (stage,value)=>{
            stage.target.bone_length.direction =
                value;
        }
    
    );
    
    bindDirectionField(
    
        "phase_bone_rotation_direction",
    
        stage => stage.target.bone_rotation.direction,
    
        (stage,value)=>{
            stage.target.bone_rotation.direction =
                value;
        }
    
    );    
    
    
}



async function populatePhases(){
    //const c = await ensureCurrentCase();
    const c = await initializeTreatmentIfNeeded();
    const stages = c.treatment.stages;

    const container = document.getElementById("phase_tabs");
    container.innerHTML = "";
    //alert(JSON.stringify(stages, null, 2)); //******
    for(const stage of stages){
        const button = document.createElement("button");
        button.className = "moduleButton";
        button.innerText = stage.name;
        if(stage.id === c.treatment.selected_stage_id){
            button.classList.add("selectedTab");
        }
        button.onclick =
            async function(){
                c.treatment.selected_stage_id =
                    stage.id;
                await syncCurrentCase();
                populatePhases();
            };
        container.appendChild(button);
    }

    const addButton = document.createElement("button");
    addButton.className = "moduleButton";
    addButton.innerText = "+";
    addButton.onclick = addStage;
    container.appendChild(addButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "moduleButton";
    deleteButton.innerText = "🗑";
    deleteButton.onclick = deleteCurrentStage;
    container.appendChild(deleteButton);
    
    populatePhaseEditor();
    
    document.getElementById("plannerButton").onclick = function(){
            window.location.href = "/planner";
        };
}


function CollectPhases(){

    // nothing to collect yet

}

async function commitPhases(){
    CollectPhases();
    await syncCurrentCase();
    emitCommittedCaseChange("phases", "phases-commit");
}

function refreshPhasesWorkflow(){
    populatePhases();
}

// ============================================================
// STAGE
// ============================================================

async function populateStage(){

    await ensureCurrentCase();
    const stage = currentStage();
    if(!stage){
        return;
    }
    ensureStageDefaults(stage);
    await syncCurrentCase();
    setValue("stage_name",stage.name);
    setValue("stage_notes",stage.notes || "");
    //alert(JSON.stringify(stage.target, null, 2));
    for(const field of TARGET_FIELDS){
        setValue("target_" + field,stage.target[field].value);
        setRadio("target_" + field + "_direction",stage.target[field].direction);
    }
    
}

function collectStage(){
    const stage = currentStage();
    if(!stage){
        return;
    }
    ensureStageDefaults(stage);

    stage.name = getValue("stage_name");
    stage.notes = getValue("stage_notes");
    for(const field of TARGET_FIELDS){
        stage.target[field].value = Number(getValue("target_" + field));
        stage.target[field].direction = getRadio("target_" + field + "_direction");
    }
}

async function commitStage(){;
    collectStage();
    await syncCurrentCase();
    emitCommittedCaseChange("phases", "phase-stage-commit");

    // R1172.6: the committed CASE remains browser-owned; no server read-back.
    return window.currentCase;
}

function refreshStageWorkflow(){

    populateStage();

}

// ============================================================
// PLANNER
// ============================================================

async function populatePlanner(){
    await ensureCurrentCase();
    const stage = currentStage();
    if(!stage){
        return;
    }
    setText(
        "planner_stage_name",
        stage.name
    );
    setText(
        "planner_stage_notes",
        stage.notes || ""
    );
}

// ============================================================
// TREATEMENT PLAN
// ============================================================

function getPrescriptionVerificationRows(caseData){
    const api = window.HexapodPrescriptionVerification;
    if(!api || typeof api.fixedStrutRows !== "function"){
        throw new Error("Browser Prescription Verification rows are unavailable.");
    }

    const imported = caseData && caseData.treatment
        ? caseData.treatment.verification_prescription
        : null;
    let sourceRows;
    if(imported){
        if(!Array.isArray(imported.strut_rows)){
            throw new TypeError("The imported Verification prescription is present but its strut_rows are missing or invalid.");
        }
        sourceRows = imported.strut_rows;
    }else{
        sourceRows = api.fixedStrutRows();
    }

    if(!Array.isArray(sourceRows) || sourceRows.length === 0){
        throw new Error("Prescription Verification requires at least one Day 0 row.");
    }
    if(sourceRows.length > 500){
        throw new Error("Prescription Verification is limited to 500 daily rows per import.");
    }

    return sourceRows.map((row, rowIndex) => {
        if(!Array.isArray(row) || row.length !== 6){
            throw new TypeError("Verification Day " + rowIndex + " must contain exactly six strut lengths.");
        }
        return row.map((value, strutIndex) => {
            const number = Number(value);
            if(!Number.isFinite(number) || number <= 0){
                throw new TypeError("Verification Day " + rowIndex + ", Strut " + (strutIndex + 1) + " must be a positive finite number.");
            }
            return number;
        });
    });
}

function validateR1171_2PrescriptionVerificationResult(result, expectedRows){
    const fail = message => { throw new Error("Browser Prescription Verification returned an invalid result: " + message); };
    if(!result || typeof result !== "object") fail("result is not an object.");
    if(result.mode !== "prescription_verification") fail("mode is not prescription_verification.");

    const rows = result.strut_array;
    if(!Array.isArray(expectedRows) || !expectedRows.length) fail("the selected verification prescription is unavailable.");
    if(!Array.isArray(rows) || rows.length !== expectedRows.length) fail("row count does not match the selected verification prescription.");
    if(rows.some((row,index) => !Array.isArray(row) || row.length !== 6 || row.some(value => !Number.isFinite(Number(value))))) {
        fail("each prescription row must contain six finite strut lengths.");
    }
    if(rows.some((row,index) => row.some((value,strutIndex) => Number(value) !== Number(expectedRows[index][strutIndex])))) {
        fail("strut rows differ from the selected verification prescription.");
    }

    const rowFields = ["daily_poses", "daily_ring_poses", "daily_bone_poses", "daily_ring_to_bone_poses", "clinical_metrics", "clinical_directions"];
    for(const key of rowFields){
        if(!Array.isArray(result[key]) || result[key].length !== rows.length){
            fail(key + " row count does not match the prescription.");
        }
    }

    const validMatrix = matrix => Array.isArray(matrix) && matrix.length === 4 &&
        matrix.every(row => Array.isArray(row) && row.length === 4 && row.every(value => Number.isFinite(Number(value))));
    if(!result.daily_poses.every(validMatrix)) fail("daily_poses contains an invalid 4×4 transform.");
    if(!result.daily_ring_poses.every(validMatrix)) fail("daily_ring_poses contains an invalid 4×4 transform.");
    if(!result.daily_bone_poses.every(validMatrix)) fail("daily_bone_poses contains an invalid 4×4 transform.");
    if(!result.daily_ring_to_bone_poses.every(validMatrix)) fail("daily_ring_to_bone_poses contains an invalid 4×4 transform.");
    if(!validMatrix(result.recovered_final_pose)) fail("recovered_final_pose is not a finite 4×4 transform.");

    if(result.days_needed !== rows.length - 1) fail("days_needed does not match the selected prescription.");
    if(result.number_of_days !== rows.length) fail("number_of_days does not match the selected prescription.");

    const check = result.prescription_check;
    if(!check || check.counts_match !== true || check.six_struts_each_day !== true || check.days_needed_check !== true){
        fail("prescription_check did not pass its structural checks.");
    }

    const diagnostics = result._r1170_1_diagnostics;
    if(!diagnostics || !Array.isArray(diagnostics.solver_diagnostics) || diagnostics.solver_diagnostics.length !== rows.length){
        fail("per-day FK diagnostics are missing or incomplete.");
    }
    if(diagnostics.solver_diagnostics.some(row => !row || row.success !== true)){
        fail("one or more daily FK solves did not report success.");
    }
    if(diagnostics.solver_diagnostics.some(row => !Number.isFinite(Number(row.residualRms)) || !Number.isFinite(Number(row.residualMaxAbs)))){
        fail("one or more daily FK residual diagnostics are missing or non-finite.");
    }
    return result;
}

async function runPlanner(phaseId){

// CASE synchronization remains part of the existing application contract.
// The normal planner calculation itself now runs in browser JavaScript.
await syncCurrentCase();

const c = await ensureCurrentCase();
if(!c){
    throw new Error("The current CASE is not available.");
}

// R1172.9.16: Verification is a standalone prescription schedule. It does
// not require, select, or mutate a normal treatment phase.
if((c.metadata && c.metadata.planner) === "verification"){
    const api = window.HexapodPrescriptionVerification;
    if(!api || typeof api.run !== "function"){
        throw new Error("Browser Prescription Verification is unavailable. Check prescription_verification.js loading.");
    }

    const verificationRows = getPrescriptionVerificationRows(c);
    const result = validateR1171_2PrescriptionVerificationResult(api.run(c, { strutRows: verificationRows }), verificationRows);
    window.__R1171_2_PRESCRIPTION_VERIFICATION_RESULT__ = result;

    return result;
}

if(!c.treatment || !Array.isArray(c.treatment.stages)){
    throw new Error("The current CASE has no treatment phases.");
}

const requestedPhaseId = phaseId || c.treatment.selected_stage_id;
const stage = c.treatment.stages.find(s => s && s.id === requestedPhaseId);
if(!stage){
    throw new Error("No current phase is selected or the requested phase was not found.");
}

const executor = window.HexapodCasePhaseExecutor;
if(!executor || typeof executor.runTreatment !== "function"){
    throw new Error(
        "Browser planner modules are not ready. " +
        "Check that R1160/R1163/R1166/R1167/R1168 scripts loaded before app.js."
    );
}

// Run exactly the selected phase. The existing updateAdjustmentPlan()
// transaction remains responsible for approval, active-replan splicing,
// calendar decisions, downstream cascade, rollback, Undo and persistence.
const execution = await executor.runTreatment(c, { phaseId: stage.id });
const phaseResult = Array.isArray(execution && execution.phase_results)
    ? execution.phase_results.find(item => item && item.phase_id === stage.id)
    : null;

if(!phaseResult){
    throw new Error("Browser planner returned no result for " + (stage.name || "the selected phase") + ".");
}

// Strict-JS incomplete results are rejected. Python-compatibility mode may
// return a successfully generated fixed-duration schedule without claiming
// clinical target attainment; that schedule is allowed into the existing
// transaction, while phaseResult.complete remains false when target residuals
// remain.
if(phaseResult.complete !== true && phaseResult.schedule_generated !== true){
    const reason = phaseResult.termination_message || phaseResult.termination_reason || phaseResult.status || "unknown reason";
    const reports = Array.isArray(phaseResult.day_reports) ? phaseResult.day_reports : [];
    const fmt = value => Number.isFinite(Number(value)) ? Number(value).toFixed(6) : String(value);
    const fmtVector = values => Array.isArray(values) ? "[" + values.map(v => fmt(v)).join(", ") + "]" : "not reported";
    const dayTrace = reports.length
        ? reports.map(row => {
            const attempts = Array.isArray(row.candidate_attempts) ? row.candidate_attempts : [];
            const attemptText = attempts.map((attempt, attemptIndex) => {
                const candidates = Array.isArray(attempt.candidates) ? attempt.candidates : [];
                const candidateText = candidates.map(candidate =>
                    "    " + candidate.method +
                    " | struts=" + fmtVector(candidate.prescription) +
                    " | movement=" + fmt(candidate.actualDailyTranslationMm) + " mm / " + fmt(candidate.actualDailyRotationDeg) + " deg" +
                    " | feasible=" + candidate.feasible +
                    " | target error=" + fmt(candidate.targetTranslationErrorMm) + " mm / " + fmt(candidate.targetRotationErrorDeg) + " deg" +
                    " | score=" + fmt(candidate.score) +
                    (candidate.selected ? " | SELECTED" : "")
                ).join("\n");
                return "  Attempt " + (attemptIndex + 1) + " | step scale=" + fmt(attempt.stepScale) +
                    " | proposed translation=" + fmtVector(attempt.proposedTranslation) +
                    " | ideal struts=" + fmtVector(attempt.idealStruts) + "\n" + candidateText;
            }).join("\n");
            return "Day " + row.day + " | accepted=" + (row.method || "candidate") +
                " | actual movement=" + fmt(row.actual_daily_translation_mm) + " mm / " + fmt(row.actual_daily_rotation_degrees) + " deg" +
                " | translation progress=" + fmt(row.translation_progress_mm) + " mm" +
                " | remaining=" + fmt(row.remaining_translation_mm) + " mm" +
                " | struts=" + fmtVector(row.prescription) +
                (attemptText ? "\n" + attemptText : "\n  Candidate-attempt details unavailable.");
          }).join("\n")
        : "No daily candidate reports were returned.";
    const fk = phaseResult._r1168_diagnostics || {};
    const diagnostic = {
        phaseId: stage.id,
        phaseName: stage.name,
        target: stage.target || null,
        startPose: phaseResult.start_pose || null,
        day0Struts: Array.isArray(phaseResult.strut_array) ? phaseResult.strut_array[0] : null,
        completion: phaseResult.completion || null,
        dayReports: reports,
        fkDiagnostics: fk,
        terminationReason: reason
    };
    // Keep the complete structured trace available for inspection without
    // changing CASE data or the existing rollback/commit transaction.
    window.__R1169_BROWSER_PLANNER_LAST_FAILURE__ = diagnostic;
    throw new Error(
        "Browser planner did not complete " + (stage.name || "the selected phase") + ".\n\n" +
        "Reason: " + reason + "\n" +
        "Remaining translation: " + (phaseResult.completion && phaseResult.completion.remaining_translation_mm != null
            ? phaseResult.completion.remaining_translation_mm + " mm" : "not reported") + "\n" +
        "Remaining rotation: " + (phaseResult.completion && phaseResult.completion.remaining_rotation_degrees != null
            ? phaseResult.completion.remaining_rotation_degrees + "°" : "not reported") + "\n\n" +
        "R1169.7 CANDIDATE ATTEMPT TRACE\n" +
        "Phase target fields: " + JSON.stringify(stage.target || null) + "\n" +
        "Start pose translation: " + (phaseResult.start_pose ? fmtVector(phaseResult.start_pose.slice(0,3).map(r => r[3])) : "not reported") + "\n" +
        "Day-0 struts: " + fmtVector(diagnostic.day0Struts) + "\n" +
        dayTrace + "\n" +
        "FK calls: " + (fk.fkCalls == null ? "not reported" : fk.fkCalls) +
        " | maximum FK RMS: " + (fk.maxFkRms == null ? "not reported" : fmt(fk.maxFkRms)) + " mm"
    );
}

return phaseResult;
}


async function populateTreatment(){

    const c =
        await initializeTreatmentIfNeeded();

    const stage =
        currentStage();


    if(
        !stage ||
        !stage.target ||
        Object.keys(
            stage.target
        ).length === 0
    ){

        document.getElementById(
            "phase_target_summary"
        ).innerHTML =
            "No target defined.<br><br>" +
            "Edit Phase to define the target.";

        return;

    }


    const startDateInput =
        document.getElementById(
            "tp_start_date"
        );

    if(startDateInput){

        // ----------------------------------------------------
        // Display the authoritative planned start date when
        // this phase is already planned.
        //
        // If the phase is not yet planned, display only the
        // current proposed date for the UI.
        //
        // The displayed value is NOT written to stage.startDate
        // merely by populating this field.
        // ----------------------------------------------------

        let displayDate =
            stage.startDate ||
            "";

        if(!displayDate){

            if(
                getCurrentPhaseIndex() === 0
            ){

                displayDate =
                    formatDateInputValue(
                        new Date()
                    );

            }
            else{

                const earliestDate =
                    getEarliestValidPhaseStartDate();

                if(earliestDate){

                    displayDate =
                        formatDateInputValue(
                            earliestDate
                        );

                }

            }

        }

        startDateInput.value =
            displayDate;

    }

    renderCurrentPhase();

    // --------------------------------------------------------
    // Render the plan belonging to the selected phase only.
    // --------------------------------------------------------

    const continuousPlan =
        buildContinuousAdjustmentPlanResult(
            c
        );

    // R1172.9.23: capture the schedule resolved by Treatment itself.
    // This checkpoint runs even when the Three.js iframe has never been opened.

    if(
        continuousPlan
    ){
    
        renderAdjustmentPlan(
            continuousPlan
        );
    
    }
    else{
    
        const container =
            document.getElementById(
                "adjustmentPlanContainer"
            );
    
        if(container){
    
            container.innerHTML = "";
    
        }
    
    }

    populateTargetSummary(
        "current_state_summary",
        stage.target
    );

    populateTargetSummary(
        "phase_target_summary",
        stage.target
    );
setText(
        "tp_phase_name",
        stage.name
    );

}


function buildPlannerRecords(c){

    const planner = [];

    c.treatment.stages.forEach(

        (stage,index)=>{

            planner.push({

                phaseIndex:
                    index,

                phaseId:
                    stage.id,

                phaseName:
                    stage.name ||
                    ("Phase " + (index + 1)),

                target:
                    structuredClone(
                        stage.target
                    ),

                currentBoneState:
                    null,

                residual:
                    null,

                warnings:
                    [],

                status:
                    "Pending"

            });

        }

    );

    return planner;
}

function renderCurrentPhase(){

    const el =
        document.getElementById(
            "currentPhaseLink"
        );

    if(!el){
        return;
    }

    const stage =
        currentStage();

    if(!stage){

        el.textContent =
            "No phase";

        return;

    }

    const stages =
        window.currentCase
              .treatment
              .stages;

    const index =
        stages.findIndex(
            s => s.id === stage.id
        );

    el.textContent =
        `${stage.name} (${index + 1}/${stages.length}) ✎`;

}
function setPlannerStatus(message){

    const el =
        document.getElementById(
            "tp_planner_status"
        );

    if(!el){
        return;
    }

    el.textContent = message;

}



function renderPlannerStatus(result){

    const warnings =
        document.getElementById("tp_warnings");

    if(!warnings){
        return;
    }

    let text =
        "<b>Planner Status</b><br>";

    text +=
        "Treatment Start: " +
        (
            result.treatment.start_date ||
            "(not set)"
        ) +
        "<br><br>";

    result.planner.forEach(
        p => {

            text +=
                "<b>" +
                p.phaseName +
                "</b><br>";

            text +=
                "Status : " +
                p.status +
                "<br><br>";

        }
    );

    warnings.innerHTML =
        text;
}

// ============================================================
// R1172.9.10 — COMPLETE ALL-DAYS SIMULATION FRAME INSPECTOR
//
// The inspector retains the exact prepared renderer contract by reference.
// It does not follow animation-day changes, duplicate the daily array, or
// recalculate geometry. Capture is an explicit developer action only.
// ============================================================
function publishSimulationDiagnosticsSnapshot(frameContract, caseData){
    const config = window.APP_CONFIG?.diagnostics;
    if(!config?.enabled || !config?.captureSimulationContract) return null;
    if(!frameContract || frameContract.contract !== "SimulationFrameV1" || !Array.isArray(frameContract.days)) return null;

    const c = caseData || window.currentCase || window.CASE || window.caseData || null;
    const stages = c?.treatment?.stages || [];
    const provenance = {
        case: "CASE STORED — patient/case parameters and treatment-stage prescriptions remain authoritative in window.currentCase.",
        contract: "DERIVED — SimulationFrameV1 is assembled by shared.js from the current CASE and simulation geometry.",
        static: {
            ring: "DERIVED FROM CASE — static ring radius is read from CASE parameters (ANCHOR_RADIUS).",
            bone: "APPLICATION / HARDWARE CONFIG — bone radius and section height come from DEFAULT_SIMULATION_HARDWARE.",
            proximalBoneOrigin: "CASE STORED — copied from CASE parameters (BONE_PROX_ORIGIN)."
        },
        phases: "DERIVED FROM CASE — phase identity, names, colors and dates are mapped from treatment stages.",
        days: "DERIVED FROM CASE — daily frames combine stored prescription rows/pose arrays and resolved mechanical geometry; strut endpoints and lengths are generated for renderer handoff."
    };

    const snapshot = {
        schema: "SimulationDiagnosticsV2",
        build: "R1172.9.10",
        source: "shared.js / prepareBrowserSimulationFrameV1",
        capturedAt: new Date().toISOString(),
        provenance,
        // Exact original contract reference. No field selection or daily-array copy.
        contractReference: frameContract,
        dayCount: frameContract.days.length,
        totalDays: Math.max(0, frameContract.days.length - 1),
        plannerHealth: (function(){
            const selectedId = c?.treatment?.selected_stage_id;
            let stage = stages.find(item => item && item.id === selectedId) || null;
            if(!stage){
                for(let i = stages.length - 1; i >= 0; i--){
                    if(stages[i]?.prescription?.planner_health){ stage = stages[i]; break; }
                }
            }
            return stage?.prescription?.planner_health || null;
        })()
    };

    window.SimulationDiagnostics = window.SimulationDiagnostics || {};
    window.SimulationDiagnostics.getSnapshot = function(){ return snapshot; };
    window.SimulationDiagnostics.getDiagnostics = function(){
        return {
            schema: snapshot.schema,
            build: snapshot.build,
            source: snapshot.source,
            capturedAt: snapshot.capturedAt,
            contract: snapshot.contractReference.contract,
            version: snapshot.contractReference.version,
            dayCount: snapshot.dayCount,
            totalDays: snapshot.totalDays,
            hasPlannerHealth: !!snapshot.plannerHealth
        };
    };
    window.dispatchEvent(new CustomEvent("simulation-diagnostics-updated", { detail: { captured: true, dayCount: snapshot.dayCount } }));
    return snapshot;
}

// Explicit developer action: capture the complete currently prepared contract.
window.SimulationDiagnostics = window.SimulationDiagnostics || {};
window.SimulationDiagnostics.captureCurrent = function(){
    const config = window.APP_CONFIG?.diagnostics;
    if(!config?.enabled || !config?.captureSimulationContract) {
        throw new Error("Simulation contract inspection is disabled in app_config.js.");
    }
    const contract = window.__CURRENT_SIMULATION_FRAME_V1__ || null;
    if(!contract) throw new Error("No prepared SimulationFrameV1 is available. Open the simulation first.");
    const caseData = window.currentCase || window.CASE || window.caseData || null;
    return publishSimulationDiagnosticsSnapshot(contract, caseData);
};

// ============================================================
// R1172.1 — LIVE PLAN-TO-ANIMATION REFRESH
//
// Builds and publishes SimulationFrameV1 without looking up an
// iframe, SVG Viewer, DOM element, or renderer API.
// Three.js consumes the renderer-neutral `frames` output through SimulationFrameV1.
// ============================================================
function prepareBrowserSimulationFrameV1(){

    const c =
        window.currentCase ||
        window.CASE ||
        window.caseData;

    if(!c){
        throw new Error("Current CASE not available.");
    }

    if(!c.parameters){
        throw new Error("Current CASE parameters are not available.");
    }

    // Treatment planning has already produced the stage prescriptions.
    // This function assembles the continuous result; it does not run a planner.
    const plan = buildContinuousAdjustmentPlanResult(c);

    if(
        !plan ||
        !Array.isArray(plan.strut_array) ||
        !Array.isArray(plan.daily_poses) ||
        !Array.isArray(plan.daily_ring_poses) ||
        plan.strut_array.length === 0
    ){
        throw new Error("Continuous treatment plan is incomplete.");
    }

    const viewerPhases = Array.isArray(plan.viewer_phases)
        ? plan.viewer_phases
        : (c.treatment?.stages || []);

    const frames = buildContinuousSimulationGeometry(
        plan,
        c.parameters,
        DEFAULT_SIMULATION_HARDWARE,
        viewerPhases
    );

    if(
        !Array.isArray(frames) ||
        frames.length !== plan.strut_array.length
    ){
        throw new Error(
            "Simulation frame count does not match the continuous adjustment plan."
        );
    }

    const frameContract = buildSimulationFrameContractV1(
        frames,
        c.parameters,
        DEFAULT_SIMULATION_HARDWARE,
        viewerPhases
    );

    if(
        !frameContract ||
        !Array.isArray(frameContract.days) ||
        frameContract.days.length !== plan.strut_array.length
    ){
        throw new Error("SimulationFrameV1 could not be created for every treatment day.");
    }

    for(let i = 0; i < frameContract.days.length; i++){
        const day = frameContract.days[i];
        if(!day || !Array.isArray(day.struts) || day.struts.length !== 6){
            throw new Error("SimulationFrameV1 Day " + i + " does not contain exactly six struts.");
        }
        for(let j = 0; j < 6; j++){
            const strut = day.struts[j];
            if(
                !strut ||
                !Array.isArray(strut.proximal) ||
                !Array.isArray(strut.distal) ||
                !Number.isFinite(Number(strut.length))
            ){
                throw new Error("SimulationFrameV1 Day " + i + " has an invalid strut endpoint pair.");
            }
        }
    }

    // R1172.9.10: retain the prepared contract by reference for optional,
    // user-initiated inspection. No diagnostic snapshot is created automatically.
    window.__CURRENT_SIMULATION_FRAME_V1__ = frameContract;

    // Preserve the established handoff key consumed by three_test.html.
    localStorage.setItem(
        "simulationFrameV1",
        JSON.stringify(frameContract)
    );

    return { c, plan, frames, frameContract };
}

function buildContinuousAdjustmentPlanResult(c){

    if(c && c.metadata && c.metadata.planner === "verification"){
        const api = window.HexapodPrescriptionVerification;
        if(!api || typeof api.run !== "function" || typeof api.fixedStrutRows !== "function"){
            throw new Error("Browser Prescription Verification is unavailable for the viewer schedule.");
        }
        const verificationRows = getPrescriptionVerificationRows(c);
        const verification = validateR1171_2PrescriptionVerificationResult(
            api.run(c, { strutRows: verificationRows }), verificationRows
        );
        const count = verification.strut_array.length;
        const repeat = value => Array.from({length:count}, () => value);
        // Verification uses the same treatment start-date control as Normal
        // Planning. Initial is undated; Day 1 is the selected date.
        const dateInput = document.getElementById("tp_start_date");
        const startDate = dateInput && dateInput.value ? dateInput.value : null;
        const rowDates = repeat(null);
        if(startDate){
            const base = parseLocalDate(startDate);
            if(base){
                for(let i=1;i<count;i++){
                    const d = new Date(base.getTime());
                    d.setDate(d.getDate() + i - 1);
                    rowDates[i] = formatDateInputValue(d);
                }
            }
        }
        return {
            mode: "prescription_verification",
            strut_array: verification.strut_array,
            daily_poses: verification.daily_poses,
            daily_ring_poses: verification.daily_ring_poses,
            clinical_metrics: verification.clinical_metrics,
            clinical_directions: verification.clinical_directions,
            clinical_targets: repeat(null),
            phase_ids: repeat("prescription-verification"),
            phase_indices: repeat(0),
            phase_names: repeat("Prescription Verification"),
            row_dates: rowDates,
            start_date: startDate,
            days_needed: verification.days_needed,
            viewer_phases: [{
                id: "prescription-verification",
                name: "Prescription Verification",
                startDate: startDate,
                endDate: null
            }]
        };
    }

    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        )
    ){

        return null;

    }


    const stages =
        c.treatment.stages;


    const mergedStruts = [];
    
    const mergedDailyPoses = [];
    
    const mergedDailyRingPoses = [];

    const mergedClinicalMetrics = [];

    const mergedClinicalDirections = [];

    const mergedClinicalTargets = [];
    
    const phaseIds = [];
    
    const phaseIndices = [];
    
    const phaseNames = [];
    
    const rowDates = [];

    let firstStartDate = null;


    let treatmentDay = 0;


    stages.forEach(
        (stage, phaseIndex) => {

            const plan =
                stage?.prescription;

            // Normal treatment phase targets use the signed clinical
            // coordinate convention used by the mechanical parameter builder.
            const stageTarget = stage?.target;
            const targetKeys = [
                "ap_translation", "ap_angulation", "lat_translation",
                "lat_angulation", "bone_length", "bone_rotation"
            ];
            const hasCompleteClinicalTarget = !!stageTarget && targetKeys.every(key =>
                    stageTarget[key] && typeof stageTarget[key] === "object" &&
                    Number.isFinite(Number(stageTarget[key].value))
                );
            const clinicalTarget = !hasCompleteClinicalTarget
                ? null
                : {
                    ap_translation: r1172_2SignedCaseValue(stageTarget.ap_translation, "medial", "stage.target.ap_translation"),
                    ap_angulation: r1172_2SignedCaseValue(stageTarget.ap_angulation, "valgus", "stage.target.ap_angulation"),
                    lat_translation: r1172_2SignedCaseValue(stageTarget.lat_translation, "anterior", "stage.target.lat_translation"),
                    lat_angulation: r1172_2SignedCaseValue(stageTarget.lat_angulation, "posterior", "stage.target.lat_angulation"),
                    bone_length: r1172_2SignedCaseValue(stageTarget.bone_length, "short", "stage.target.bone_length"),
                    bone_rotation: r1172_2SignedCaseValue(stageTarget.bone_rotation, "external", "stage.target.bone_rotation")
                };


            if(
                !plan ||
                !Array.isArray(
                    plan.strut_array
                ) ||
                plan.strut_array.length === 0
            ){

                return;

            }


            const phaseStartDate =
                stage.startDate ||
                null;


            if(
                firstStartDate === null &&
                phaseStartDate
            ){

                firstStartDate =
                    phaseStartDate;

            }


            /*
             * Day 0 is included only once in the
             * continuous treatment.
             *
             * Every later phase begins from the
             * previous phase's final pose, so its
             * own Day 0 is the same transition pose.
             */

            const startIndex =
                phaseIndex === 0
                ? 0
                : 1;


            for(
                let i = startIndex;
                i < plan.strut_array.length;
                i++
            ){

                const isInitial =
                    (
                        phaseIndex === 0 &&
                        i === 0
                    );


                if(
                    !isInitial
                ){

                    treatmentDay++;

                }


                mergedStruts.push(
                    structuredClone(
                        plan.strut_array[i]
                    )
                );

                // --------------------------------------------------------
                // Continuous simulation pose data.
                //
                // Use the exact same phase/day selection as the
                // continuous strut rows above.
                //
                // This deliberately does NOT create another timeline.
                // The simulation follows the Adjustment Plan row order.
                // --------------------------------------------------------
                
                mergedDailyPoses.push(
                    Array.isArray(plan.daily_poses)
                        ?
                        structuredClone(
                            plan.daily_poses[i]
                        )
                        :
                        null
                );
                
                mergedDailyRingPoses.push(
                    Array.isArray(plan.daily_ring_poses)
                        ?
                        structuredClone(
                            plan.daily_ring_poses[i]
                        )
                        :
                        null
                );

                mergedClinicalMetrics.push(
                    Array.isArray(plan.clinical_metrics)
                        ?
                        structuredClone(
                            plan.clinical_metrics[i]
                        )
                        :
                        null
                );

                mergedClinicalDirections.push(
                    Array.isArray(plan.clinical_directions)
                        ?
                        structuredClone(
                            plan.clinical_directions[i]
                        )
                        :
                        null
                );

                mergedClinicalTargets.push(
                    clinicalTarget ? structuredClone(clinicalTarget) : null
                );

                phaseIds.push(
                    stage.id
                );


                phaseIndices.push(
                    phaseIndex
                );

                phaseNames.push(
                    stage?.name ?? null
                );


                /*
                 * IMPORTANT:
                 *
                 * The calendar date belongs to the
                 * phase, not to the continuous row number.
                 *
                 * Phase Day 1 = phase.startDate.
                 * Phase Day 2 = startDate + 1 day.
                 *
                 * The later continuous timeline may have
                 * a calendar gap between phases.
                 */

                let rowDate = null;


                if(
                    phaseStartDate
                ){

                    const d =
                        parseLocalDate(
                            phaseStartDate
                        );


                    if(d){

                        /*
                         * i = 1 means Phase Day 1.
                         * i = 2 means Phase Day 2.
                         */

                        d.setDate(
                            d.getDate() +
                            i -
                            1
                        );


                        rowDate =
                            formatDateInputValue(
                                d
                            );

                    }

                }


                rowDates.push(
                    rowDate
                );

            }

        }
    );


    if(
        mergedStruts.length === 0
    ){

        return null;

    }


    return {
    
        strut_array:
            mergedStruts,
    
        daily_poses:
            mergedDailyPoses,
    
        daily_ring_poses:
            mergedDailyRingPoses,
    
        phase_ids:
            phaseIds,
            
        phase_indices:
            phaseIndices,

        phase_names:
            phaseNames,

        row_dates:
            rowDates,

        clinical_metrics:
            mergedClinicalMetrics,

        clinical_directions:
            mergedClinicalDirections,

        clinical_targets: mergedClinicalTargets,

        start_date:
            firstStartDate,

        days_needed:
            Math.max(
                0,
                mergedStruts.length - 1
            )

    };

}

// ============================================================
// BROWSER SIMULATION GEOMETRY
//
// Converts stored CASE poses directly into the geometry
// renderer-neutral geometry vocabulary consumed by SimulationFrameV1.
//
// IMPORTANT:
//   No FK / IK is performed here.
//
//   daily_poses      = T_db_bone
//   daily_ring_poses = T_dr_ring
//
// Hardware-specific dimensions are currently development
// defaults. They are passed through an explicit hardware
// definition so they can later come from CASE.
// ============================================================

const DEFAULT_SIMULATION_HARDWARE = {

    boneRadius: 16.0,

    boneSectionHeight: 120.0,

    markerLength: 30.0,

    markerOffset: 1.0,

    holeStepDeg: 7.5,

    proxTabTopDeg: 90.0,
    proxTabLeftDeg: 210.0,
    proxTabRightDeg: 330.0,

    distTabTopRightDeg: 30.0,
    distTabTopLeftDeg: 150.0,
    distTabBottomDeg: 270.0,

    mountingOffset: -17.0,

    pinOffset: 0.0

};

// ============================================================
// Three.js / Renderer-neutral static frame definition
//
// Static = geometry/definitions that do not change by day.
//
// Dynamic daily state remains inside frames[].
// SVG's existing frames[] interface is unchanged.
// ============================================================

const SIMULATION_RENDER_STATIC = {

    contract:
        "SimulationFrameV1",

    version:
        1,

    coordinateSystem: {

        x:
            "right",

        y:
            "towardViewer",

        z:
            "up"

    },

    units:
        "mm",

    ring: {

        radius:
            113.5

    },

    bone: {

        radius:
            16,

        sectionHeight:
            120

    },

    struts: [

        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }

    ]

};

// ============================================================
// MATRIX HELPERS
// ============================================================

function simMat4Multiply(A, B){

    const C = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    for(let i = 0; i < 4; i++){

        for(let j = 0; j < 4; j++){

            for(let k = 0; k < 4; k++){

                C[i][j] +=
                    A[i][k] * B[k][j];

            }

        }

    }

    return C;

}


function simTransformPoint(T, p){

    return [

        T[0][0] * p[0] +
        T[0][1] * p[1] +
        T[0][2] * p[2] +
        T[0][3],

        T[1][0] * p[0] +
        T[1][1] * p[1] +
        T[1][2] * p[2] +
        T[1][3],

        T[2][0] * p[0] +
        T[2][1] * p[1] +
        T[2][2] * p[2] +
        T[2][3]

    ];

}


function simTransformSegment(T, seg){

    return [

        simTransformPoint(T, seg[0]),

        simTransformPoint(T, seg[1])

    ];

}


function simTransformGeometry(T, geometry){

    return geometry.map(
        seg =>
            simTransformSegment(T, seg)
    );

}


// ============================================================
// RIGID 4x4 INVERSE
//
// T = [ R  t ]
//     [ 0  1 ]
//
// inverse = [ Rᵀ   -Rᵀt ]
//           [ 0       1 ]
// ============================================================

function simInverseRigid(T){

    const Rt = [

        [T[0][0], T[1][0], T[2][0]],

        [T[0][1], T[1][1], T[2][1]],

        [T[0][2], T[1][2], T[2][2]]

    ];

    const t = [
        T[0][3],
        T[1][3],
        T[2][3]
    ];

    const ti = [

        -(
            Rt[0][0] * t[0] +
            Rt[0][1] * t[1] +
            Rt[0][2] * t[2]
        ),

        -(
            Rt[1][0] * t[0] +
            Rt[1][1] * t[1] +
            Rt[1][2] * t[2]
        ),

        -(
            Rt[2][0] * t[0] +
            Rt[2][1] * t[1] +
            Rt[2][2] * t[2]
        )

    ];

    return [

        [
            Rt[0][0],
            Rt[0][1],
            Rt[0][2],
            ti[0]
        ],

        [
            Rt[1][0],
            Rt[1][1],
            Rt[1][2],
            ti[1]
        ],

        [
            Rt[2][0],
            Rt[2][1],
            Rt[2][2],
            ti[2]
        ],

        [0,0,0,1]

    ];

}


// ============================================================
// STATIC GEOMETRY
//
// Direct JS equivalent of simulation.py:
//     build_static_geometry()
//
// Geometry remains local to each bone/ring coordinate system.
// ============================================================

function buildSimulationStaticGeometry(
    anchorRadius,
    hardware = DEFAULT_SIMULATION_HARDWARE
){

    const t_s = [];

    for(let i = 0; i < 49; i++){

        t_s.push(
            2 * Math.PI * i / 48
        );

    }


    // --------------------------------------------------------
    // RING
    // --------------------------------------------------------

    const ringSegmentsLocal = [];

    for(let i = 0; i < 48; i++){

        ringSegmentsLocal.push([

            [
                anchorRadius * Math.cos(t_s[i]),
                anchorRadius * Math.sin(t_s[i]),
                0
            ],

            [
                anchorRadius * Math.cos(t_s[i + 1]),
                anchorRadius * Math.sin(t_s[i + 1]),
                0
            ]

        ]);

    }


    // --------------------------------------------------------
    // BONES
    // --------------------------------------------------------

    const proxBoneRaw = [];
    const distBoneRaw = [];

    for(let ti = 0; ti < 48; ti++){

        proxBoneRaw.push([

            [
                hardware.boneRadius *
                    Math.cos(t_s[ti]),

                hardware.boneRadius *
                    Math.sin(t_s[ti]),

                0
            ],

            [
                hardware.boneRadius *
                    Math.cos(t_s[ti]),

                hardware.boneRadius *
                    Math.sin(t_s[ti]),

                hardware.boneSectionHeight
            ]

        ]);


        distBoneRaw.push([

            [
                hardware.boneRadius *
                    Math.cos(t_s[ti]),

                hardware.boneRadius *
                    Math.sin(t_s[ti]),

                -hardware.boneSectionHeight
            ],

            [
                hardware.boneRadius *
                    Math.cos(t_s[ti]),

                hardware.boneRadius *
                    Math.sin(t_s[ti]),

                0
            ]

        ]);

    }


    // --------------------------------------------------------
    // SURFACE MARKERS
    // --------------------------------------------------------

    const proxMarkerRaw = {

        ap: [],
        lat: [],
        ap_opp: [],
        lat_opp: []

    };

    const distMarkerRaw = {

        ap: [],
        lat: [],
        ap_opp: [],
        lat_opp: []

    };


    const markerAngles = {

        ap: 0,

        lat: Math.PI / 2,

        ap_opp: Math.PI,

        lat_opp: 3 * Math.PI / 2

    };


    const zMidProx =
        hardware.boneSectionHeight / 2;

    const z1Prox =
        zMidProx -
        hardware.markerLength / 2;

    const z2Prox =
        zMidProx +
        hardware.markerLength / 2;


    const zMidDist =
        -hardware.boneSectionHeight / 2;

    const z1Dist =
        zMidDist -
        hardware.markerLength / 2;

    const z2Dist =
        zMidDist +
        hardware.markerLength / 2;


    for(
        const name in markerAngles
    ){

        const a =
            markerAngles[name];


        const r =
            hardware.boneRadius +
            hardware.markerOffset;


        const x =
            r * Math.cos(a);

        const y =
            r * Math.sin(a);


        proxMarkerRaw[name].push([

            [x, y, z1Prox],

            [x, y, z2Prox]

        ]);


        distMarkerRaw[name].push([

            [x, y, z1Dist],

            [x, y, z2Dist]

        ]);

    }


    return {

        ringSegmentsLocal,

        proxBoneRaw,

        distBoneRaw,

        proxMarkerRaw,

        distMarkerRaw

    };

}


// ============================================================
// FRAME ATTACHMENT POINTS
//
// Direct equivalent of simulation.py build_frame_geometry().
//
// Returned in:
//     proximal-ring coordinates for ptsPAbs
//     distal-ring coordinates for ptsDLocal
// ============================================================

function buildSimulationAttachmentPoints(
    anchorRadius,
    hardware = DEFAULT_SIMULATION_HARDWARE
){

    const hs =
        hardware.holeStepDeg *
        Math.PI / 180;


    const proxTop =
        hardware.proxTabTopDeg *
        Math.PI / 180;

    const proxLeft =
        hardware.proxTabLeftDeg *
        Math.PI / 180;

    const proxRight =
        hardware.proxTabRightDeg *
        Math.PI / 180;


    const distTopRight =
        hardware.distTabTopRightDeg *
        Math.PI / 180;

    const distTopLeft =
        hardware.distTabTopLeftDeg *
        Math.PI / 180;

    const distBottom =
        hardware.distTabBottomDeg *
        Math.PI / 180;


    function polar(angle, z){

        return [

            anchorRadius * Math.cos(angle),

            anchorRadius * Math.sin(angle),

            z

        ];

    }


    const proxMap = {

        S2:
            polar(
                proxTop - hs,
                hardware.mountingOffset +
                hardware.pinOffset
            ),

        S1:
            polar(
                proxTop + hs,
                hardware.mountingOffset +
                hardware.pinOffset
            ),

        S6:
            polar(
                proxLeft - hs,
                hardware.mountingOffset +
                hardware.pinOffset
            ),

        S5:
            polar(
                proxLeft + hs,
                hardware.mountingOffset +
                hardware.pinOffset
            ),

        S4:
            polar(
                proxRight - hs,
                hardware.mountingOffset +
                hardware.pinOffset
            ),

        S3:
            polar(
                proxRight + hs,
                hardware.mountingOffset +
                hardware.pinOffset
            )

    };


    const distMap = {

        S2:
            polar(
                distTopRight + hs,
                -hardware.mountingOffset
            ),

        S1:
            polar(
                distTopLeft - hs,
                -hardware.mountingOffset
            ),

        S6:
            polar(
                distTopLeft + hs,
                -hardware.mountingOffset
            ),

        S5:
            polar(
                distBottom - hs,
                -hardware.mountingOffset
            ),

        S4:
            polar(
                distBottom + hs,
                -hardware.mountingOffset
            ),

        S3:
            polar(
                distTopRight - hs,
                -hardware.mountingOffset
            )

    };


    return {

        ptsPAbs: [

            proxMap.S1,
            proxMap.S2,
            proxMap.S3,
            proxMap.S4,
            proxMap.S5,
            proxMap.S6

        ],

        ptsDLocal: [

            distMap.S1,
            distMap.S2,
            distMap.S3,
            distMap.S4,
            distMap.S5,
            distMap.S6

        ]

    };

}


// ============================================================
// COMPLETE ONE-DAY POSE → GEOMETRY
//
// bonePose:
//     T_db_bone
//
// ringPose:
//     T_dr_ring
//
// Both are already supplied by the planner.
// ============================================================

function buildSimulationFrameGeometry(

    bonePose,

    ringPose,

    params,

    hardware =
        DEFAULT_SIMULATION_HARDWARE

){

    if(
        !Array.isArray(bonePose) ||
        bonePose.length !== 4 ||
        !Array.isArray(ringPose) ||
        ringPose.length !== 4
    ){

        return null;

    }


    const anchorRadius =
        Number(
            params?.ANCHOR_RADIUS
        );


    if(
        !Number.isFinite(anchorRadius)
    ){

        return null;

    }


    // T_ring_to_bone is the fixed transform used
    // throughout simulation.py.
    //
    // Build T_bone_to_ring from the CASE mounting
    // parameters, then invert it.

    const origin =
        params.BONE_PROX_ORIGIN ||
        [0,0,0];

    const angles =
        params.R_PROX_ANGLES ||
        [0,0,0];


    const z =
        angles[0] *
        Math.PI / 180;

    const x =
        angles[1] *
        Math.PI / 180;

    const y =
        angles[2] *
        Math.PI / 180;


    const cz = Math.cos(z);
    const sz = Math.sin(z);

    const cx = Math.cos(x);
    const sx = Math.sin(x);

    const cy = Math.cos(y);
    const sy = Math.sin(y);


    const Rz = [

        [cz,-sz,0],
        [sz, cz,0],
        [0,  0, 1]

    ];

    const Rx = [

        [1,0,0],
        [0,cx,-sx],
        [0,sx,cx]

    ];

    const Ry = [

        [cy,0,sy],
        [0,1,0],
        [-sy,0,cy]

    ];


    function mm3(A,B){

        const C = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];

        for(let i=0;i<3;i++){

            for(let j=0;j<3;j++){

                for(let k=0;k<3;k++){

                    C[i][j] +=
                        A[i][k] *
                        B[k][j];

                }

            }

        }

        return C;

    }


    const R =
        mm3(
            mm3(Rz,Rx),
            Ry
        );


    const T_bone_to_ring = [

        [
            R[0][0],
            R[0][1],
            R[0][2],
            origin[0]
        ],

        [
            R[1][0],
            R[1][1],
            R[1][2],
            origin[1]
        ],

        [
            R[2][0],
            R[2][1],
            R[2][2],
            origin[2]
        ],

        [0,0,0,1]

    ];


    const T_ring_to_bone =
        simInverseRigid(
            T_bone_to_ring
        );


    const T_dr_bone =
        simMat4Multiply(
            T_ring_to_bone,
            ringPose
        );


    const staticGeometry =
        buildSimulationStaticGeometry(
            anchorRadius,
            hardware
        );


    const attachments =
        buildSimulationAttachmentPoints(
            anchorRadius,
            hardware
        );


    // --------------------------------------------------------
    // PROXIMAL BONE
    // --------------------------------------------------------

    const bpSegs =
        staticGeometry.proxBoneRaw.map(
            seg => [
                [...seg[0]],
                [...seg[1]]
            ]
        );


    // --------------------------------------------------------
    // DISTAL BONE
    // --------------------------------------------------------

    const bdSegs =
        simTransformGeometry(
            bonePose,
            staticGeometry.distBoneRaw
        );


    // --------------------------------------------------------
    // PROXIMAL MARKERS
    // --------------------------------------------------------

    const bpAp =
        staticGeometry.proxMarkerRaw.ap.map(
            seg => [
                [...seg[0]],
                [...seg[1]]
            ]
        );

    const bpLat =
        staticGeometry.proxMarkerRaw.lat.map(
            seg => [
                [...seg[0]],
                [...seg[1]]
            ]
        );

    const bpApOpp =
        staticGeometry.proxMarkerRaw.ap_opp.map(
            seg => [
                [...seg[0]],
                [...seg[1]]
            ]
        );

    const bpLatOpp =
        staticGeometry.proxMarkerRaw.lat_opp.map(
            seg => [
                [...seg[0]],
                [...seg[1]]
            ]
        );


    // --------------------------------------------------------
    // DISTAL MARKERS
    // --------------------------------------------------------

    const bdAp =
        simTransformGeometry(
            bonePose,
            staticGeometry.distMarkerRaw.ap
        );

    const bdLat =
        simTransformGeometry(
            bonePose,
            staticGeometry.distMarkerRaw.lat
        );

    const bdApOpp =
        simTransformGeometry(
            bonePose,
            staticGeometry.distMarkerRaw.ap_opp
        );

    const bdLatOpp =
        simTransformGeometry(
            bonePose,
            staticGeometry.distMarkerRaw.lat_opp
        );


    // --------------------------------------------------------
    // RINGS
    // --------------------------------------------------------

    const wpSegs =
        simTransformGeometry(
            T_ring_to_bone,
            staticGeometry.ringSegmentsLocal
        );


    const wdSegs =
        simTransformGeometry(
            T_dr_bone,
            staticGeometry.ringSegmentsLocal
        );


    // --------------------------------------------------------
    // STRUT ENDPOINTS
    // --------------------------------------------------------

    const ptsPBone =
        attachments.ptsPAbs.map(
            p =>
                simTransformPoint(
                    T_ring_to_bone,
                    p
                )
        );


    const ptsDBone =
        attachments.ptsDLocal.map(
            p =>
                simTransformPoint(
                    T_dr_bone,
                    p
                )
        );


    const struts =
        ptsPBone.map(
            (p,i) => [

                p,

                ptsDBone[i]

            ]
        );


    // --------------------------------------------------------
    // AXES
    // --------------------------------------------------------

    const axisProx = [

        [0,0,0],

        [0,0,hardware.boneSectionHeight]

    ];


    const axisDist = [
    
        simTransformPoint(
            bonePose,
            [0,0,hardware.boneSectionHeight]
        ),
    
        simTransformPoint(
            bonePose,
            [0,0,-hardware.boneSectionHeight]
        )
    
    ];

    // --------------------------------------------------------
    // VIEWER-COMPATIBLE DAILY STATE
    //
    // These values correspond to the fields produced by
    // simulation.py all_days_data.
    //
    // No FK is performed here.
    // The pose already comes from CASE.
    // --------------------------------------------------------

    const tx =
        Number(bonePose[0][3]);

    const ty =
        Number(bonePose[1][3]);

    const tz =
        Number(bonePose[2][3]);


    const translationMag =
        Math.sqrt(
            tx * tx +
            ty * ty +
            tz * tz
        );


    // --------------------------------------------------------
    // ZXY Euler angles.
    //
    // This matches the rotation construction used above:
    //
    // R = Rz * Rx * Ry
    // --------------------------------------------------------

    const r00 = bonePose[0][0];
    const r01 = bonePose[0][1];
    const r02 = bonePose[0][2];

    const r10 = bonePose[1][0];
    const r11 = bonePose[1][1];
    const r12 = bonePose[1][2];

    const r20 = bonePose[2][0];
    const r21 = bonePose[2][1];
    const r22 = bonePose[2][2];


    const clamp =
        Math.max(
            -1,
            Math.min(
                1,
                r21
            )
        );


    const xAngle =
        Math.asin(clamp);


    const cosX =
        Math.cos(xAngle);


    let zAngle;
    let yAngle;


    if(
        Math.abs(cosX) > 1e-10
    ){

        zAngle =
            Math.atan2(
                -r01,
                r11
            );

        yAngle =
            Math.atan2(
                -r20,
                r22
            );

    }
    else{

        // Gimbal-lock fallback.
        zAngle =
            Math.atan2(
                r10,
                r00
            );

        yAngle = 0;

    }


    const rx =
        xAngle *
        180 / Math.PI;

    const ry =
        yAngle *
        180 / Math.PI;

    const rz =
        zAngle *
        180 / Math.PI;


    return {

        // --------------------------------------------------------
        // Renderer-neutral world transform
        //
        // Converts proximal-bone coordinates back into the
        // proximal-ring/world coordinate system.
        //
        // This is the same transform already calculated above.
        // No new mathematics is introduced.
        // --------------------------------------------------------
    
        matrix_bone_to_ring:
            structuredClone(
                T_bone_to_ring
            ),

        // ----------------------------------------------------
        // Geometry
        // ----------------------------------------------------

        bp_segs: bpSegs,

        bd_segs: bdSegs,

        wp_segs: wpSegs,

        wd_segs: wdSegs,

        bp_ap: bpAp,

        bp_lat: bpLat,

        bp_ap_opp: bpApOpp,

        bp_lat_opp: bpLatOpp,

        bd_ap: bdAp,

        bd_lat: bdLat,

        bd_ap_opp: bdApOpp,

        bd_lat_opp: bdLatOpp,

        axis_prox: axisProx,

        axis_dist: axisDist,

        struts: struts,


        // ----------------------------------------------------
        // Daily viewer state
        // ----------------------------------------------------

        tx: tx,

        ty: ty,

        tz: tz,

        rx: rx,

        ry: ry,

        rz: rz,

        translation_mag:
            translationMag,


        lengths:
            null,

        day:
            0,

        rot_seq:
            "ZXY",


        bp_offset:
            [
                Number(origin[0]),
                Number(origin[1]),
                Number(origin[2])
            ],

        bp_tilt:
            [
                Number(angles[0]),
                Number(angles[1]),
                Number(angles[2])
            ],


        bd_offset:
            [
                Number(
                    params.CLINICAL_OFFSET?.[0] ||
                    0
                ),
                Number(
                    params.CLINICAL_OFFSET?.[1] ||
                    0
                ),
                Number(
                    params.CLINICAL_OFFSET?.[2] ||
                    0
                )
            ],

        bd_tilt:
            [
                Number(
                    params.CLINICAL_ANGLES?.[0] ||
                    0
                ),
                Number(
                    params.CLINICAL_ANGLES?.[1] ||
                    0
                ),
                Number(
                    params.CLINICAL_ANGLES?.[2] ||
                    0
                )
            ],


        coords:
            [
                tx,
                ty,
                tz
            ],


        matrix_db:
            structuredClone(
                bonePose
            ),
        
        matrix_pr:
            structuredClone(
                T_ring_to_bone
            ),
        
        matrix_dr:
            structuredClone(
                T_dr_bone
            )

    };

}

// ============================================================
// SIMULATION FRAME CONTRACT V1
//
// Renderer-neutral output produced by the existing adaptor.
//
// STATIC:
//     Geometry and definitions that do not change by day.
//
// DYNAMIC:
//     Poses, attachment locations and strut state that change
//     by day.
//
// IMPORTANT:
//     This is an extension of the existing browser adaptor.
//     It is NOT a second simulation or geometry engine.
// ============================================================

function buildSimulationFrameContractV1(

    frames,

    params,

    hardware =
        DEFAULT_SIMULATION_HARDWARE,

    treatmentStages =
        []

){



    if(
        !Array.isArray(frames) ||
        frames.length === 0
    ){

        return null;

    }


    const anchorRadius =
        Number(
            params?.ANCHOR_RADIUS
        );



    return {

        contract:
            "SimulationFrameV1",

        version:
            1,


        // ----------------------------------------------------
        // Coordinate convention
        // ----------------------------------------------------

        coordinateSystem: {

            x:
                "right",

            y:
                "towardViewer",

            z:
                "up"

        },


        units:
            "mm",


        // ----------------------------------------------------
        // Static mechanical definition
        // ----------------------------------------------------

        static: {
        
            ring: {
        
                radius:
                    anchorRadius
        
            },
        
        
            bone: {
        
                radius:
                    Number(
                        hardware.boneRadius
                    ),
        
                sectionHeight:
                    Number(
                        hardware.boneSectionHeight
                    )
        
            },
        
            proximalBoneOrigin:
                structuredClone(
                    params.BONE_PROX_ORIGIN
                ),        
                
            // Renderer-neutral physical dimensions only.
            // Graphical ring/bone meshes belong to the renderer.
            // SVG segment arrays remain available to the legacy SVG adapter,
            // but are deliberately not copied into SimulationFrameV1.
        
        },

        // ----------------------------------------------------
        // Treatment / phase metadata
        // ----------------------------------------------------

        treatment: {

            phases:
                Array.isArray(treatmentStages)
                    ? treatmentStages.map(
                        (phase, index) => ({
                            index: index,
                            id: phase?.id ?? null,
                            name: phase?.name ?? null,
                            color:
                                [
                                    "#4A90E2",
                                    "#50B83C",
                                    "#9B59B6",
                                    "#F5A623",
                                    "#E45C5C",
                                    "#00A6A6",
                                    "#7B61A8",
                                    "#D97706"
                                ][
                                    index % 8
                                ],
                            startDate: phase?.startDate ?? null,
                            endDate: phase?.endDate ?? null
                        })
                    )
                    : []

        },
        // ----------------------------------------------------
        // Dynamic daily state
        // ----------------------------------------------------

        days:
        
            frames.map(
                frame => ({
        
                    day:
                        frame.day,

                    date:
                        frame.date ?? null,

                    phaseId:
                        frame.phaseId ?? null,

                    phaseIndex:
                        frame.phaseIndex ?? null,

                    phaseName:
                        frame.phaseName ?? null,

                    clinicalMetrics:
                        frame.clinicalMetrics ?? null,

                    clinicalDirections:
                        frame.clinicalDirections ?? null,

                    clinicalTargets:
                        frame.clinicalTargets ?? null,
        
                    proximalRingPose:
                        structuredClone(
                            frame.matrix_pr
                        ),
        
                    distalRingPose:
                        structuredClone(
                            frame.matrix_dr
                        ),

                    proximalBonePose:
                        structuredClone(
                            frame.matrix_bone_to_ring
                        ),

                    distalBonePose:
                        structuredClone(
                            frame.matrix_db
                        ),
        
                    struts:
                        frame.struts.map(
                            (pair, i) => ({
        
                                id:
                                    i,
        
                                proximal:
                                    structuredClone(
                                        pair[0]
                                    ),
        
                                distal:
                                    structuredClone(
                                        pair[1]
                                    ),
        
                                length:
                                    Number(
                                        frame.lengths[i]
                                    )
        
                            })
                        )
        
                })
            )
    };

}

// ============================================================
// CONTINUOUS POSE → GEOMETRY
//
// IMPORTANT:
// The pose arrays and strut rows use the same continuous
// Adjustment Plan ordering.
// ============================================================

function buildContinuousSimulationGeometry(

    continuousPlan,

    params,

    hardware =
        DEFAULT_SIMULATION_HARDWARE,

    treatmentStages =
        []

){

    if(
        !continuousPlan ||
        !Array.isArray(
            continuousPlan.daily_poses
        ) ||
        !Array.isArray(
            continuousPlan.daily_ring_poses
        )
    ){

        return [];

    }


    const count =
        Math.min(

            continuousPlan.daily_poses.length,

            continuousPlan.daily_ring_poses.length

        );


    const frames = [];


    for(let i = 0; i < count; i++){

        const frame =
            buildSimulationFrameGeometry(

                continuousPlan.daily_poses[i],

                continuousPlan.daily_ring_poses[i],

                params,

                hardware

            );


        if(frame){
        
            frame.lengths =
                structuredClone(
                    continuousPlan.strut_array[i]
                );
        
            frame.day =
                i;

            frame.date =
                continuousPlan.row_dates?.[i] ?? null;

            frame.phaseId =
                continuousPlan.phase_ids?.[i] ?? null;

            frame.phaseIndex =
                continuousPlan.phase_indices?.[i] ?? null;

            frame.phaseName =
                continuousPlan.phase_names?.[i] ?? null;

            frame.clinicalMetrics =
                continuousPlan.clinical_metrics?.[i] ?? null;

            frame.clinicalDirections =
                continuousPlan.clinical_directions?.[i] ?? null;

            frame.clinicalTargets =
                continuousPlan.clinical_targets?.[i] ?? null;
        
            frames.push(frame);
        
        }

    }

    
    frames.renderStatic = {
    
        contract:
            "SimulationFrameV1",
    
        version:
            1,
    
        coordinateSystem: {
    
            x:
                "right",
    
            y:
                "towardViewer",
    
            z:
                "up"
    
        },
    
        units:
            "mm",
    
        ring: {
    
            radius:
                Number(
                    params.ANCHOR_RADIUS
                )
    
        },
    
        bone: {
        
            radius:
                Number(
                    hardware.boneRadius
                ),
        
            sectionHeight:
                Number(
                    hardware.boneSectionHeight
                )
        
        },
    
        strutCount:
            6
    
    };
    
    
    return frames;

}

// ============================================================
// R1172.1 — THREE.JS TREATMENT HANDOFF
//
// Publishes the current renderer-neutral contract and the two
// temporary compatibility captures consumed by three_test.html.
// This function has no dependency on the SVG iframe.
// ============================================================
function publishThreePrototypeHandoff(preparedData){

    const prepared = preparedData || prepareBrowserSimulationFrameV1();
    const c = prepared.c;
    const plan = prepared.plan;
    const frames = prepared.frames;
    const frameContract = prepared.frameContract;

    if(!c || !plan || !Array.isArray(frames) || !frameContract){
        throw new Error("Prepared SimulationFrameV1 data is incomplete.");
    }

    if(
        frameContract.contract !== "SimulationFrameV1" ||
        !Array.isArray(frameContract.days) ||
        frameContract.days.length !== frames.length ||
        frameContract.days.length === 0
    ){
        throw new Error("Three.js handoff requires a complete SimulationFrameV1 contract.");
    }

    // The contract itself is published by prepareBrowserSimulationFrameV1().
    // Verify the storage handoff before allowing the iframe to start.
    const storedContractJSON = localStorage.getItem("simulationFrameV1");
    if(!storedContractJSON){
        throw new Error("SimulationFrameV1 was not published to localStorage.");
    }

    let storedContract;
    try{
        storedContract = JSON.parse(storedContractJSON);
    }catch(error){
        throw new Error("Published SimulationFrameV1 could not be parsed: " + error.message);
    }

    if(
        !storedContract ||
        storedContract.contract !== "SimulationFrameV1" ||
        !Array.isArray(storedContract.days) ||
        storedContract.days.length !== frameContract.days.length
    ){
        throw new Error("Published SimulationFrameV1 does not match the prepared treatment frames.");
    }

    // Retain the established temporary plan capture used by the prototype.
    window.__threeTestPlan = structuredClone(plan);
    localStorage.setItem("threeTestPlan", JSON.stringify(plan));

    // Temporary compatibility capture for the existing Three.js prototype.
    // These values are copied from the same prepared frames; no second
    // geometry calculation occurs.
    const threeTestFrames = frames.map(frame => ({
        day: frame.day,
        struts: structuredClone(frame.struts),
        axis_prox: structuredClone(frame.axis_prox),
        axis_dist: structuredClone(frame.axis_dist),
        matrix_db: structuredClone(frame.matrix_db),
        matrix_dr: structuredClone(frame.matrix_dr),
        lengths: structuredClone(frame.lengths)
    }));

    localStorage.setItem("threeTestFrames", JSON.stringify(threeTestFrames));


    return { c, plan, frames, frameContract, threeTestFrames };
}

// Called by the Treatment workspace only after the user opens the Three.js tab.
// The iframe is assigned its URL only after all required data has been published.
function loadThreePrototypeFromTreatment(){

    const iframe = document.getElementById("threePrototypeFrame");
    const status = document.getElementById("threePrototypeStatus");
    if(status){ status.textContent = ""; status.style.display = "none"; }

    if(!iframe){
        if(status){ status.style.display = "block"; status.textContent = "Three.js cannot start: iframe element is missing."; }
        return false;
    }

    // Permit the embedded Three.js document to request browser fullscreen.
    iframe.setAttribute("allowfullscreen", "");
    const existingAllow = (iframe.getAttribute("allow") || "")
        .split(";").map(part => part.trim()).filter(Boolean);
    if(!existingAllow.some(part => part === "fullscreen" || part.startsWith("fullscreen "))){
        existingAllow.push("fullscreen");
        iframe.setAttribute("allow", existingAllow.join("; "));
    }

    try{
        const prepared = prepareBrowserSimulationFrameV1();
        const handoff = publishThreePrototypeHandoff(prepared);

        // Do not recreate an existing viewer when Treatment tabs change.
        if(iframe.hasAttribute("src")){
            if(iframe.dataset.viewerLoaded === "true" && iframe.contentWindow){
                iframe.contentWindow.postMessage(
                    { type: "simulationFrameV1Updated" },
                    window.location.origin
                );
                if(status){
                    status.textContent = "";
                    status.style.display = "none";
                }
            }
            return true;
        }

        iframe.dataset.viewerLoaded = "false";
        iframe.onload = function(){
            iframe.dataset.viewerLoaded = "true";
            if(status){ status.textContent = ""; status.style.display = "none"; }
        };
        iframe.onerror = function(){
            iframe.dataset.viewerLoaded = "false";
            iframe.removeAttribute("src");
            if(status){ status.style.display = "block"; status.textContent = "Three.js document failed to load. Check the Flask route /three_test.html, then reopen this tab to retry."; }
        };

        // First visit only. The iframe remains alive on subsequent tab visits.
        iframe.src = "/three_test.html?v=R1172.9.24";
        return true;

    }catch(error){
        if(status){ status.style.display = "block"; status.textContent = "Three.js handoff not started: " + String(error && error.message || error); }
        return false;
    }
}

// R1172.1 — refresh an already-mounted Three.js viewer after a
// successful Treatment plan transaction. Do not start the iframe here:
// if it has never been opened, its first visit will publish the latest CASE.
function refreshThreePrototypeAfterPlanCommit(){

    const iframe = document.getElementById("threePrototypeFrame");

    if(!iframe || !iframe.hasAttribute("src")){
        return false;
    }

    // loadThreePrototypeFromTreatment republishes the latest contract.
    // If the iframe is loaded it receives the update message; if it is
    // still loading, its startup read sees the newly published contract.
    return loadThreePrototypeFromTreatment();
}

function renderAdjustmentPlan(
    plannerResult
){

    const container =
        document.getElementById(
            "adjustmentPlanContainer"
        );

    if(!container){
        return;
    }


    if(
        !plannerResult ||
        !Array.isArray(
            plannerResult.strut_array
        )
    ){
    
        container.innerHTML = "";
    
        return;
    
    }


    // --------------------------------------------------------
    // IMPORTANT:
    //
    // Date belongs to the phase whose prescription we are
    // rendering.
    //
    // Never use #tp_start_date here.
    // --------------------------------------------------------

    const startDate =
        plannerResult.start_date;

    function dayLabel(day){

        return (
            day === 0
        )
        ?
        "Initial"
        :
        "Day " + day;

    }

    const caseData =
        window.currentCase;


    /*
     * --------------------------------------------------------
     * DAY LABEL
     *
     * Row 0 represents the initial state.
     * Subsequent rows represent treatment days.
     * --------------------------------------------------------
     */

    function dayLabel(day){

        return (
            day === 0
        )
        ?
        "Initial"
        :
        "Day " + day;

    }

    const stages =
        caseData &&
        caseData.treatment &&
        Array.isArray(
            caseData.treatment.stages
        )
        ?
        caseData.treatment.stages
        :
        [];

    const approvedPhase =
        stages.find(
            stage =>
                stage.status ===
                "approved"
        );

    const approvedPhaseId =
        approvedPhase
        ?
        approvedPhase.id
        :
        null;

    const phaseColors = [
        "#4A90E2",
        "#50B83C",
        "#9B59B6",
        "#F5A623",
        "#E45C5C",
        "#00A6A6",
        "#7B61A8",
        "#D97706"
    ];

    const phaseColorMap = {};

    stages.forEach(
        (stage,index) => {

            phaseColorMap[
                stage.id
            ] =
                phaseColors[
                    index %
                    phaseColors.length
                ];

        }
    );

    function formatDate(day){
    
        let d = null;
    
    
        /*
         * Continuous multi-phase plan:
         *
         * If row_dates exists, use the date belonging
         * to that specific treatment row.
         *
         * This preserves each phase's own selected
         * start date, including calendar gaps.
         */
    
        if(
            Array.isArray(
                plannerResult.row_dates
            ) &&
            plannerResult.row_dates[day]
        ){
    
            d =
                parseLocalDate(
                    plannerResult.row_dates[day]
                );
    
        }
        else{
    
            /*
             * Fallback for an ordinary planner result
             * that does not contain row_dates.
             *
             * Preserve the existing date behaviour.
             */
    
            d =
                parseLocalDate(
                    startDate
                );
    
            if(d && day > 0){
    
                d.setDate(
                    d.getDate() +
                    day -
                    1
                );
    
            }
    
        }
    
    
        if(!d){
            return "";
        }

        const weekday =
            d.toLocaleDateString(
                "en-GB",
                {
                    weekday:"short"
                }
            );


        const date =
            d.toLocaleDateString(
                "en-GB",
                {
                    day:"2-digit",
                    month:"short"
                }
            );


        return (
            weekday +
            " " +
            date
        );

    }

    const rowPhaseIds = new Set(
        Array.isArray(plannerResult.phase_ids)
            ? plannerResult.phase_ids.filter(Boolean)
            : []
    );
    const legendStages = stages.filter(stage => rowPhaseIds.has(stage.id));
    if(plannerResult.mode === "prescription_verification"){
        phaseColorMap["prescription-verification"] = phaseColors[0];
    }
    const verificationLegend = plannerResult.mode === "prescription_verification"
        ? [{id:"prescription-verification", name:"Prescription Verification", status:"", _phaseColor:phaseColors[0]}]
        : [];
    const visibleLegendStages = legendStages.length ? legendStages : verificationLegend;

    const phaseLegend =
        visibleLegendStages.length > 0
        ?
        `
        <div class="plannerPhaseLegend">

            ${visibleLegendStages.map(
                (stage,index) => {

                    const isApproved =
                        stage.id ===
                        approvedPhaseId;

                    const color =
                        stage._phaseColor || phaseColorMap[stage.id] || phaseColors[index % phaseColors.length];

                    const phaseName =
                        stage.name &&
                        stage.name.trim()
                        ?
                        stage.name
                        :
                        "Phase " +
                        (index + 1);

                    return `
                        <div
                            class="
                                plannerPhaseLegendItem
                                ${isApproved
                                    ? "approved"
                                    : ""}
                            "
                        >

                            <span
                                class="plannerPhaseLegendStrip"
                                style="
                                    background:${color};
                                    width:${isApproved
                                        ? "9px"
                                        : "4px"};
                                "
                            ></span>

                            <span
                                class="plannerPhaseLegendName"
                            >
                                ${phaseName}
                            </span>

                        </div>
                    `;

                }
            ).join("")}

        </div>
        `
        :
        "";
        
    const columnGroup = `
        <colgroup>
            <col class="colDay">
            <col class="colDate">
            <col class="colStrut">
            <col class="colStrut">
            <col class="colStrut">
            <col class="colStrut">
            <col class="colStrut">
            <col class="colStrut">
        </colgroup>
    `;


    const headerNumbers =
        Array.from(
            {length:6},
            (_,i)=>
                `<th class="strutColumn">
                    ${i + 1}
                </th>`
        ).join("");


    let rows = "";


    plannerResult.strut_array.forEach(
        (row,index)=>{

            const phaseId =
                Array.isArray(
                    plannerResult.phase_ids
                )
                ?
                plannerResult.phase_ids[index]
                :
                null;

            const phaseColor =
                phaseColorMap[
                    phaseId
                ] ||
                "#999999";
            
            const isApprovedPhase =
                phaseId ===
                approvedPhaseId;

            const phaseStripWidth =
                isApprovedPhase
                ?
                "9px"
                :
                "4px";

            rows += "<tr>";


            rows +=
                `<td
                    class="dayColumn plannerPhaseDayCell"
                    style="
                        border-left:
                            ${phaseStripWidth}
                            solid
                            ${phaseColor};
                    "
                >
                    ${dayLabel(index)}
                </td>`;

                const rowDate =
                    plannerResult.row_dates &&
                    plannerResult.row_dates[index]
                    ?
                    plannerResult.row_dates[index]
                    :
                    null;
                
                const todayDate =
                    new Date()
                        .toISOString()
                        .slice(0,10);
                
                const isToday =
                    rowDate ===
                    todayDate;
                
                rows +=
                    `<td class="dateColumn">
                        ${
                            isToday
                            ?
                            `<span class="adjustmentPlanTodayDate">
                                ${formatDate(index)}
                            </span>`
                            :
                            formatDate(index)
                        }
                    </td>`;


            row.forEach(
                value=>{

                    rows +=
                        `<td class="strutValue">
                            ${Math.round(value)}
                        </td>`;

                }
            );


            rows += "</tr>";

        }
    );


    container.innerHTML = `

<div class="adjustmentPlanCard">

    ${phaseLegend}

    <div class="adjustmentPlanToolbar">
        <div>

            <div class="plannerTitle">
                Daily Strut Lengths
            </div>

            <div class="plannerSubtitle">
                ${
                    plannerResult.mode ===
                    "prescription_verification"
                    ?
                    "Prescription Verification Mode"
                    :
                    "Normal Planning Mode"
                }
            </div>

            <div class="plannerSubtitle">
                All dimensions in millimetres
            </div>

        </div>

        <button
            id="viewPdfReportButton"
            class="moduleButton">

            View Draft PDF

        </button>

    </div>


    <div class="plannerTable">

        <table class="plannerHeaderTable">

            ${columnGroup}

            <thead>

                <tr>

                    <th class="dayColumn">
                        Day
                    </th>

                    <th class="dateColumn">
                        Date
                    </th>

                    ${headerNumbers}

                </tr>

            </thead>

        </table>


        <div class="plannerBodyScroll">

            <table class="plannerBodyTable">

                ${columnGroup}

                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    </div>

</div>

`;


    const scrollPanel =
        container.querySelector(
            ".plannerBodyScroll"
        );


    const savedState =
        WorkspaceManager?.state?.treatment;


    if(
        scrollPanel &&
        savedState &&
        savedState.adjustmentScroll != null
    ){

        scrollPanel.scrollTop =
            savedState.adjustmentScroll;

    }

}

function computeCurrentBoneStates(planner, c){

    if(!planner || planner.length === 0){
        return;
    }

    planner.forEach((phase, index)=>{

        phase.currentBoneState = null;
        phase.residual = null;

        // Phase 1 starts from the case deformity.
        if(index === 0){

            phase.currentBoneState = {

                apTranslation:
                    structuredClone(c.deformity.ap_translation),

                apAngulation:
                    structuredClone(c.deformity.ap_angulation),

                latTranslation:
                    structuredClone(c.deformity.lat_translation),

                latAngulation:
                    structuredClone(c.deformity.lat_angulation),

                boneLength:
                    structuredClone(c.deformity.bone_length),

                boneRotation:
                    structuredClone(c.deformity.bone_rotation)

            };

        }

        // Later phases:      
        // Leave null for now.
        // Later this will become either:
        //    previous phase recovered pose
        // or
        //    stage.startBoneState override
        else{

            phase.currentBoneState = null;

        }

    });

}


// ============================================================
// TREATMENT DATE HELPERS
// ============================================================

function parseLocalDate(dateString){

    if(!dateString){
        return null;
    }

    const parts =
        dateString.split("-");

    if(parts.length !== 3){
        return null;
    }

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const day =
        Number(parts[2]);

    if(
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day)
    ){
        return null;
    }

    const date =
        new Date(
            year,
            month - 1,
            day
        );

    if(
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ){
        return null;
    }

    return date;
}


function formatDateInputValue(date){

    if(!date){
        return "";
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2,"0");

    const day =
        String(
            date.getDate()
        ).padStart(2,"0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


function getCurrentPhase(){

    const c =
        window.currentCase;

    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        )
    ){
        return null;
    }

    return currentStage();
}


function getCurrentPhaseIndex(){

    const c =
        window.currentCase;

    const stage =
        getCurrentPhase();

    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        ) ||
        !stage
    ){
        return -1;
    }

    return c.treatment.stages.findIndex(
        s => s.id === stage.id
    );
}


function getPreviousPhase(){

    const c =
        window.currentCase;

    const index =
        getCurrentPhaseIndex();

    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        ) ||
        index <= 0
    ){
        return null;
    }

    return c.treatment.stages[index - 1];
}



function getEarliestValidPhaseStartDate(){

    const c =
        window.currentCase;

    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        )
    ){

        return null;

    }

    const stages =
        c.treatment.stages;

    const currentIndex =
        stages.findIndex(
            s =>
                s.id ===
                c.treatment.selected_stage_id
        );

    if(
        currentIndex <= 0
    ){

        return null;

    }

    /*
     * A later phase can have an automatically derived
     * start date only when the IMMEDIATELY preceding
     * phase has a known end date.
     *
     * Do NOT search farther backward.
     *
     * Example:
     *
     * P1 ends Aug 20
     * P2 is unplanned
     * P3 is unplanned
     *
     * P2 → Aug 21
     * P3 → BLANK
     *
     * P3 must wait for P2's actual planner result
     * before its start date can be determined.
     */

    const previousPhase =
        stages[currentIndex - 1];

    if(
        !previousPhase ||
        !previousPhase.endDate
    ){

        return null;

    }

    const previousEnd =
        parseLocalDate(
            previousPhase.endDate
        );

    if(!previousEnd){

        return null;

    }

    previousEnd.setDate(
        previousEnd.getDate() + 1
    );

    return previousEnd;

}

function validateCurrentPhaseStartDate(
    proposedStartDate = null
){

    const stage =
        getCurrentPhase();


    if(!stage){

        return {
            valid:false,
            overlap:false,
            message:"No current phase is selected."
        };

    }


    const dateToValidate =
        proposedStartDate !== null
            ? proposedStartDate
            : stage.startDate;


    if(!dateToValidate){

        return {
            valid:false,
            overlap:false,
            message:
                "Please select a start date for " +
                (stage.name || "the current phase") +
                "."
        };

    }


    const selectedDate =
        parseLocalDate(
            dateToValidate
        );


    if(!selectedDate){

        return {
            valid:false,
            overlap:false,
            message:
                "The selected phase start date is invalid."
        };

    }


    const previousPhase =
        getPreviousPhase();


    let calendarOverlap =
        false;


    if(
        previousPhase
    ){

        const previousStart =
            previousPhase.startDate
                ? parseLocalDate(
                    previousPhase.startDate
                )
                : null;


        const previousEnd =
            previousPhase.endDate
                ? parseLocalDate(
                    previousPhase.endDate
                )
                : null;


        if(
            previousEnd &&
            !previousStart
        ){

            return {
                valid:false,
                overlap:false,
                message:
                    "The previous phase has an end date " +
                    "but no start date. " +
                    "Its treatment timeline cannot be determined."
            };

        }


        if(
            previousStart &&
            selectedDate < previousStart
        ){

            const previousStartText =
                previousStart.toLocaleDateString(
                    "en-GB",
                    {
                        weekday:"short",
                        day:"2-digit",
                        month:"short",
                        year:"numeric"
                    }
                );


            return {
                valid:false,
                overlap:false,
                message:
                    "The start date for " +
                    (stage.name || "this phase") +
                    " cannot be before the previous phase's " +
                    "start date.\n\n" +
                    "Previous phase starts: " +
                    previousStartText
            };

        }


        if(
            previousEnd &&
            selectedDate <= previousEnd
        ){

            calendarOverlap =
                true;

        }

    }


    return {
        valid:true,
        overlap:calendarOverlap,
        message:""
    };

}

function getCurrentPhasePlannedEndDate(c){

    const stage =
        currentStage();

    if(
        !stage ||
        !stage.startDate
    ){
        return null;
    }

    const plan =
        stage.prescription;

    if(
        !plan ||
        !Array.isArray(
            plan.strut_array
        ) ||
        plan.strut_array.length < 2
    ){
        return null;
    }

    /*
     * Day 0 = starting pose.
     * Day 1 = first patient adjustment.
     *
     * Example:
     * 5 poses = Day 0,1,2,3,4
     * therefore 4 adjustment days.
     *
     * If Day 1 = Aug 5,
     * Day 4 = Aug 8.
     */

    const adjustmentDays =
        plan.strut_array.length - 1;

    const endDate =
        parseLocalDate(
            stage.startDate
        );

    if(!endDate){
        return null;
    }

    endDate.setDate(
        endDate.getDate() +
        adjustmentDays -
        1
    );

    return endDate;
}


function getCurrentPhasePlan(c){

    const stage =
        currentStage();

    return (
        stage?.prescription ||
        null
    );
}


function getCurrentPhaseStartBoneState(c,stage){

    if(!stage){
        return null;
    }

    // Preserve an already established starting state.
    if(stage.startBoneState){

        return structuredClone(
            stage.startBoneState
        );

    }

    // Phase 1 starts from the current deformity.
    //
    // For later phases, the sequential Python planner
    // already determines the actual Day 0 pose from the
    // previous phase's final pose. We will connect that
    // recovered pose to the stored phase state in the
    // next sequential-phase data-model step.
    if(
        c?.deformity
    ){

        return {

            apTranslation:
                structuredClone(
                    c.deformity.ap_translation
                ),

            apAngulation:
                structuredClone(
                    c.deformity.ap_angulation
                ),

            latTranslation:
                structuredClone(
                    c.deformity.lat_translation
                ),

            latAngulation:
                structuredClone(
                    c.deformity.lat_angulation
                ),

            boneLength:
                structuredClone(
                    c.deformity.bone_length
                ),

            boneRotation:
                structuredClone(
                    c.deformity.bone_rotation
                )

        };

    }

    return null;
}


async function approveCurrentPhase(){

    const c =
        await ensureCurrentCase();

    const stage =
        currentStage();

    if(!stage){

        alert(
            "No current phase is selected."
        );

        return;

    }


    const plan =
        getCurrentPhasePlan(c);


    if(
        !plan ||
        !Array.isArray(
            plan.strut_array
        ) ||
        plan.strut_array.length < 2
    ){

        alert(
            "Please generate the adjustment plan before approving it."
        );

        return;

    }


    if(stage.status === "approved"){

        alert(
            stage.name +
            " is already approved."
        );

        return;

    }


    // --------------------------------------------------------
    // The phase start date must already have been selected
    // and stored on the phase.
    // --------------------------------------------------------

    const startDate =
        stage.startDate ||
        "";


    if(!startDate){

        alert(
            "Please select a treatment start date before approving the plan."
        );

        return;

    }


    /*
     * Day 0 = starting pose.
     * Day 1 = first patient-adjustment day.
     */

    const adjustmentDays =
        plan.strut_array.length - 1;


    const endDate =
        parseLocalDate(
            startDate
        );


    if(!endDate){

        alert(
            "The phase start date is invalid."
        );

        return;

    }


    endDate.setDate(
        endDate.getDate() +
        adjustmentDays -
        1
    );


    // --------------------------------------------------------
    // Freeze the phase starting state.
    // --------------------------------------------------------

    stage.startBoneState =
        getCurrentPhaseStartBoneState(
            c,
            stage
        );


    // --------------------------------------------------------
    // Freeze the generated prescription.
    // --------------------------------------------------------

    stage.prescription =
        structuredClone(
            plan
        );


    // --------------------------------------------------------
    // These dates now belong permanently to this phase.
    // --------------------------------------------------------

    stage.startDate =
        startDate;

    stage.endDate =
        formatDateInputValue(
            endDate
        );


    stage.duration =
        adjustmentDays;


    stage.status =
        "approved";


    stage.approvedAt =
        new Date().toISOString();


    await syncCurrentCase();


    setPlannerStatus(
        "Approved"
    );


    populatePhases();


    alert(
        stage.name +
        " has been approved."
    );
}

function comparePlannerHandoffStates(
    existingPose,
    existingStruts,
    plannerPose,
    plannerStruts
){

    let poseDifference = 0;

    let strutDifference = 0;


    if(
        !Array.isArray(existingPose) ||
        !Array.isArray(plannerPose) ||
        existingPose.length !==
            plannerPose.length
    ){

        poseDifference = Infinity;

    }
    else{

        for(
            let r = 0;
            r < existingPose.length;
            r++
        ){

            if(
                !Array.isArray(existingPose[r]) ||
                !Array.isArray(plannerPose[r]) ||
                existingPose[r].length !==
                    plannerPose[r].length
            ){

                poseDifference = Infinity;
                break;

            }


            for(
                let c = 0;
                c < existingPose[r].length;
                c++
            ){

                const difference =
                    Math.abs(
                        Number(existingPose[r][c]) -
                        Number(plannerPose[r][c])
                    );


                if(
                    Number.isFinite(difference) &&
                    difference > poseDifference
                ){

                    poseDifference =
                        difference;

                }

            }

        }

    }


    if(
        !Array.isArray(existingStruts) ||
        !Array.isArray(plannerStruts) ||
        existingStruts.length !==
            plannerStruts.length
    ){

        strutDifference = Infinity;

    }
    else{

        for(
            let i = 0;
            i < existingStruts.length;
            i++
        ){

            const difference =
                Math.abs(
                    Number(existingStruts[i]) -
                    Number(plannerStruts[i])
                );


            if(
                Number.isFinite(difference) &&
                difference > strutDifference
            ){

                strutDifference =
                    difference;

            }

        }

    }


    return {
        poseDifference,
        strutDifference
    };

}

function comparePreservedTrajectory(
    originalPoses,
    originalStruts,
    combinedPoses,
    combinedStruts,
    dayIndex,
    tolerance
){

    let poseDifference = 0;
    let strutDifference = 0;


    for(
        let i = 0;
        i < dayIndex;
        i++
    ){

        const oldPose =
            originalPoses[i];

        const newPose =
            combinedPoses[i];


        // ------------------------------------------------
        // Compare 4 x 4 pose matrices.
        // ------------------------------------------------

        if(
            !Array.isArray(oldPose) ||
            !Array.isArray(newPose) ||
            oldPose.length !== newPose.length
        ){

            poseDifference =
                Infinity;

        }
        else{

            for(
                let r = 0;
                r < oldPose.length;
                r++
            ){

                const oldRow =
                    oldPose[r];

                const newRow =
                    newPose[r];


                if(
                    !Array.isArray(oldRow) ||
                    !Array.isArray(newRow) ||
                    oldRow.length !== newRow.length
                ){

                    poseDifference =
                        Infinity;

                    break;

                }


                for(
                    let c = 0;
                    c < oldRow.length;
                    c++
                ){

                    const difference =
                        Math.abs(
                            Number(oldRow[c]) -
                            Number(newRow[c])
                        );


                    if(
                        Number.isFinite(difference) &&
                        difference > poseDifference
                    ){

                        poseDifference =
                            difference;

                    }

                }

            }

        }


        // ------------------------------------------------
        // Compare six strut lengths.
        // ------------------------------------------------

        const oldStruts =
            originalStruts[i];

        const newStruts =
            combinedStruts[i];


        if(
            !Array.isArray(oldStruts) ||
            !Array.isArray(newStruts) ||
            oldStruts.length !== newStruts.length
        ){

            strutDifference =
                Infinity;

        }
        else{

            for(
                let j = 0;
                j < oldStruts.length;
                j++
            ){

                const difference =
                    Math.abs(
                        Number(oldStruts[j]) -
                        Number(newStruts[j])
                    );


                if(
                    Number.isFinite(difference) &&
                    difference > strutDifference
                ){

                    strutDifference =
                        difference;

                }

            }

        }

    }


    return {

        poseDifference,

        strutDifference,

        pass:
            poseDifference <= tolerance &&
            strutDifference <= tolerance

    };

}


function compareRegeneratedTrajectory(
    plannerPoses,
    plannerStruts,
    combinedPoses,
    combinedStruts,
    dayIndex,
    tolerance
){

    let poseDifference = 0;
    let strutDifference = 0;

    for(
        let i = 0;
        i < plannerPoses.length;
        i++
    ){

        const combinedIndex =
            dayIndex + i;

        const plannerPose =
            plannerPoses[i];

        const combinedPose =
            combinedPoses[combinedIndex];


        if(
            !Array.isArray(plannerPose) ||
            !Array.isArray(combinedPose)
        ){

            poseDifference =
                Infinity;

            break;

        }


        for(
            let r = 0;
            r < plannerPose.length;
            r++
        ){

            for(
                let c = 0;
                c < plannerPose[r].length;
                c++
            ){

                const difference =
                    Math.abs(
                        Number(plannerPose[r][c]) -
                        Number(combinedPose[r][c])
                    );

                if(
                    Number.isFinite(difference) &&
                    difference > poseDifference
                ){

                    poseDifference =
                        difference;

                }

            }

        }


        const plannerStrutRow =
            plannerStruts[i];

        const combinedStrutRow =
            combinedStruts[combinedIndex];


        if(
            !Array.isArray(plannerStruts) ||
            !Array.isArray(combinedStrutRow)
        ){

            strutDifference =
                Infinity;

            break;

        }


        for(
            let j = 0;
            j < plannerStruts.length;
            j++
        ){

            const difference =
                Math.abs(
                    Number(plannerStrutRow[j]) -
                    Number(combinedStrutRow[j])
                );

            if(
                Number.isFinite(difference) &&
                difference > strutDifference
            ){

                strutDifference =
                    difference;

            }

        }

    }


    return {

        poseDifference,

        strutDifference,

        pass:
            poseDifference <= tolerance &&
            strutDifference <= tolerance

    };

}

// ============================================================
// GLOBAL VALIDATION SUMMARY
// ============================================================
//
// Collects the results of whichever validation categories
// were actually run for the current transaction.
//
// Active Phase: 3 tests
// Early Start : 3 tests
// Calendar Gap: 1 test
//
// Only actual FAIL results are counted.
// Not-run / not-applicable categories are ignored.
//
function updateValidationSummary(){

    const results =
        window.__validationResults ||
        {};


    let failCount = 0;


    function countFailures(
        report
    ){

        if(!report){

            return;

        }


        Object.keys(
            report
        ).forEach(
            key => {

                const test =
                    report[key];

                if(
                    test &&
                    typeof test.pass ===
                        "boolean" &&
                    !test.pass
                ){

                    failCount++;

                }

            }
        );

    }


    countFailures(
        results.active
    );


    countFailures(
        results.early
    );


    if(
        results.calendar &&
        typeof results.calendar.pass ===
            "boolean" &&
        !results.calendar.pass
    ){

        failCount++;

    }


    const summary =
        failCount === 0
            ? "VALIDATION: ALL PASS"
            : "VALIDATION: " +
              failCount +
              " FAIL";


    const summaryElement =
        document.getElementById(
            "plannerValidationSummary"
        );


    if(summaryElement){

        summaryElement.textContent =
            summary;

        return;

    }


    //
    // Fallback: create a small summary element
    // immediately before the detailed validation panel.
    //
    const panel =
        document.getElementById(
            "plannerValidationInspector"
        );


    if(!panel){

        return;

    }


    const newElement =
        document.createElement(
            "div"
        );


    newElement.id =
        "plannerValidationSummary";


    newElement.textContent =
        summary;


    newElement.style.fontWeight =
        "bold";


    newElement.style.marginBottom =
        "8px";


    panel.parentNode.insertBefore(
        newElement,
        panel
    );

}


async function runPlannerValidation(
    context
){

    if(
        !context ||
        !context.plannerResult
    ){

        return null;

    }


    const {
        mode,
        dayIndex,
        handoffPose,
        handoffStrutLengths,
        existingPrescription,
        plannerResult,
        handoffTolerance,
        originalPoses,
        originalStruts,
        combinedPoses,
        combinedStruts,
        preservedPrescription
    } = context;


    if(
        mode !== "active-replan"
    ){

        // ----------------------------------------------------
        // EARLY START
        //
        // Validate the recovered previous-phase Day-N state,
        // preservation of the elapsed previous-phase trajectory,
        // and the planner handoff.
        //
        // Unlike active replan, there is no splice into the
        // current phase. The new phase simply receives the
        // recovered Day-N state.
        // ----------------------------------------------------
    
        if(
            mode === "early-start" &&
            handoffPose &&
            handoffStrutLengths &&
            existingPrescription &&
            preservedPrescription &&
            Array.isArray(
                existingPrescription.strut_array
            ) &&
            Array.isArray(
                existingPrescription.daily_poses
            ) &&
            Array.isArray(
                preservedPrescription.strut_array
            ) &&
            Array.isArray(
                plannerResult.daily_poses
            ) &&
            Array.isArray(
                plannerResult.strut_array
            )
        ){
    
            //
            // TEST 1
            //
            // Independent FK-recovery check.
            //
            // Re-run the SAME recovery function using the
            // SAME floating-point strut lengths that were
            // used to create the early-start handoff.
            //
            // This deliberately does NOT use
            // existingPrescription.daily_poses as the
            // reference.
            //

            const validationRecoveredPose =
                await recoverPoseFromStruts(
                    handoffStrutLengths
                );


            const recovery =
                comparePlannerHandoffStates(

                    handoffPose,

                    handoffStrutLengths,

                    validationRecoveredPose,

                    handoffStrutLengths

                );


            const recoveryDiagnostic = {

                dayIndex,

                recoveryStruts:
                    structuredClone(
                        handoffStrutLengths
                    ),

                handoffPose:
                    structuredClone(
                        handoffPose
                    ),

                validationRecoveredPose:
                    structuredClone(
                        validationRecoveredPose
                    )

            };
    
            //
            // TEST 2
            //
            // The completed portion of the previous phase
            // must remain unchanged.
            //
            // Include Day N itself because that is the final
            // retained mechanical state of the previous phase.
            //
    
            const preserved =
                comparePreservedTrajectory(
    
                    existingPrescription
                        .daily_poses,
    
                    existingPrescription
                        .strut_array,
    
                    preservedPrescription
                        .daily_poses,
    
                    preservedPrescription
                        .strut_array,
    
                    dayIndex + 1,
    
                    handoffTolerance
    
                );
    
    
            //
            // TEST 3
            //
            // Confirm that the recovered Day-N state is actually
            // the starting state received by the new planner.
            //
    
            const plannerHandoff =
                comparePlannerHandoffStates(
    
                    handoffPose,
    
                    handoffStrutLengths,
    
                    plannerResult.daily_poses[0],
    
                    plannerResult.strut_array[0]
    
                );
    
    
            const report = {
    
                recovery: {
    
                    test:
                        "Early Start — Day-N FK Recovery",
    
                    dayIndex,
    
                    poseDifference:
                        recovery.poseDifference,
    
                    strutDifference:
                        recovery.strutDifference,
    
                    tolerance:
                        handoffTolerance,
    
                    pass:
                        recovery.poseDifference <=
                            handoffTolerance &&
                        recovery.strutDifference <=
                            handoffTolerance
    
                },
    
    
                preserved: {
    
                    test:
                        "Early Start — Previous Phase Preservation",
    
                    throughDay:
                        dayIndex,
    
                    poseDifference:
                        preserved.poseDifference,
    
                    strutDifference:
                        preserved.strutDifference,
    
                    tolerance:
                        handoffTolerance,
    
                    pass:
                        preserved.pass
    
                },
    
    
                handoff: {
    
                    test:
                        "Early Start — Planner Handoff Integrity",
    
                    dayIndex,
    
                    poseDifference:
                        plannerHandoff.poseDifference,
    
                    strutDifference:
                        plannerHandoff.strutDifference,
    
                    tolerance:
                        handoffTolerance,
    
                    pass:
                        plannerHandoff.poseDifference <=
                            handoffTolerance &&
                        plannerHandoff.strutDifference <=
                            handoffTolerance
    
                }
    
            };
    
    
            const panel =
                document.getElementById(
                    "plannerValidationInspector"
                );
    
    
            if(panel){
    
                panel.textContent =
    
                    "EARLY START VALIDATION\n\n" +

                    "RECOVERY STRUTS:\n" +
                    JSON.stringify(
                        recoveryDiagnostic.recoveryStruts
                    ) +
                    "\n\n" +
        
                    "EARLY-START RECOVERED POSE:\n" +
                    JSON.stringify(
                        recoveryDiagnostic.handoffPose
                    ) +
                    "\n\n" +
        
                    "VALIDATION RECOVERED POSE:\n" +
                    JSON.stringify(
                        recoveryDiagnostic.validationRecoveredPose
                    ) +
                    "\n\n" +

    
                    "Test 1: " +
                    report.recovery.test +
                    "\n\n" +
    
                    "Day N: " +
                    report.recovery.dayIndex +
                    "\n\n" +
    
                    "Pose difference: " +
                    report.recovery.poseDifference +
                    "\n\n" +
    
                    "Strut difference: " +
                    report.recovery.strutDifference +
                    "\n\n" +
    
                    "Numerical acceptance: " +
                    report.recovery.tolerance +
                    "\n\n" +
    
                    "Result: " +
                    (
                        report.recovery.pass
                            ? "PASS"
                            : "FAIL"
                    ) +
    
                    "\n\n" +
                    "────────────────────────────────\n\n" +
                    
                    "Test 2: " +
                    report.preserved.test +
                    "\n\n" +
    
                    "Through Day: " +
                    report.preserved.throughDay +
                    "\n\n" +
    
                    "Pose difference: " +
                    report.preserved.poseDifference +
                    "\n\n" +
    
                    "Strut difference: " +
                    report.preserved.strutDifference +
                    "\n\n" +
    
                    "Numerical acceptance: " +
                    report.preserved.tolerance +
                    "\n\n" +
    
                    "Result: " +
                    (
                        report.preserved.pass
                            ? "PASS"
                            : "FAIL"
                    ) +
    
                    "\n\n" +
                    "────────────────────────────────\n\n" +
                    
                    "Test 3: " +
                    report.handoff.test +
                    "\n\n" +
    
                    "Day N: " +
                    report.handoff.dayIndex +
                    "\n\n" +
    
                    "Pose difference: " +
                    report.handoff.poseDifference +
                    "\n\n" +
    
                    "Strut difference: " +
                    report.handoff.strutDifference +
                    "\n\n" +
    
                    "Numerical acceptance: " +
                    report.handoff.tolerance +
                    "\n\n" +
    
                    "Result: " +
                    (
                        report.handoff.pass
                            ? "PASS"
                            : "FAIL"
                    );
    
            }
    
    
            return report;
    
        }

        return null;

    }


    if(
        !existingPrescription ||
        !Array.isArray(
            existingPrescription.strut_array
        ) ||
        !Array.isArray(
            plannerResult.daily_poses
        ) ||
        !Array.isArray(
            plannerResult.strut_array
        ) ||
        !Array.isArray(
            originalPoses
        ) ||
        !Array.isArray(
            originalStruts
        ) ||
        !Array.isArray(
            combinedPoses
        ) ||
        !Array.isArray(
            combinedStruts
        )
    ){

        return null;

    }


    const validation =
        comparePlannerHandoffStates(

            handoffPose,

            existingPrescription
                .strut_array[dayIndex],

            plannerResult.daily_poses[0],

            plannerResult.strut_array[0]

        );


    const preserved =
        comparePreservedTrajectory(

            originalPoses,

            originalStruts,

            combinedPoses,

            combinedStruts,

            dayIndex,

            handoffTolerance

        );


    const regenerated =
        compareRegeneratedTrajectory(

            plannerResult.daily_poses,

            plannerResult.strut_array,

            combinedPoses,

            combinedStruts,

            dayIndex,

            handoffTolerance

        );


    const report = {

        handoff: {

            test:
                "Active Replan — Day-N Handoff Integrity",

            dayIndex,

            poseDifference:
                validation.poseDifference,

            strutDifference:
                validation.strutDifference,

            tolerance:
                handoffTolerance,

            pass:
                validation.poseDifference <=
                    handoffTolerance &&
                validation.strutDifference <=
                    handoffTolerance

        },


        elapsed: {

            test:
                "Active Replan — Elapsed Trajectory Preservation",

            throughDay:
                dayIndex - 1,

            poseDifference:
                preserved.poseDifference,

            strutDifference:
                preserved.strutDifference,

            tolerance:
                handoffTolerance,

            pass:
                preserved.pass

        },


        regenerated: {

            test:
                "Active Replan — Regenerated Trajectory Integrity",

            fromDay:
                dayIndex,

            poseDifference:
                regenerated.poseDifference,

            strutDifference:
                regenerated.strutDifference,

            tolerance:
                handoffTolerance,

            pass:
                regenerated.pass

        }

    };


    const panel =
        document.getElementById(
            "plannerValidationInspector"
        );


    if(panel){

        panel.textContent =

            "PLANNER VALIDATION\n\n" +

            "Test 1: " +
            report.handoff.test +
            "\n\n" +

            "Day N: " +
            report.handoff.dayIndex +
            "\n\n" +

            "Pose difference: " +
            report.handoff.poseDifference +
            "\n\n" +

            "Strut difference: " +
            report.handoff.strutDifference +
            "\n\n" +

            "Numerical acceptance: " +
            report.handoff.tolerance +
            "\n\n" +

            "Result: " +
            (
                report.handoff.pass
                    ? "PASS"
                    : "FAIL"
            ) +

            "\n\n" +
            "────────────────────────────────\n\n" +
            
            "Test 2: " +
            report.elapsed.test +
            "\n\n" +

            "Through Day: " +
            report.elapsed.throughDay +
            "\n\n" +

            "Pose difference: " +
            report.elapsed.poseDifference +
            "\n\n" +

            "Strut difference: " +
            report.elapsed.strutDifference +
            "\n\n" +

            "Numerical acceptance: " +
            report.elapsed.tolerance +
            "\n\n" +

            "Result: " +
            (
                report.elapsed.pass
                    ? "PASS"
                    : "FAIL"
            ) +

            "\n\n" +
            "────────────────────────────────\n\n" +
            
            "Test 3: " +
            report.regenerated.test +
            "\n\n" +

            "From Day: " +
            report.regenerated.fromDay +
            "\n\n" +

            "Pose difference: " +
            report.regenerated.poseDifference +
            "\n\n" +

            "Strut difference: " +
            report.regenerated.strutDifference +
            "\n\n" +

            "Numerical acceptance: " +
            report.regenerated.tolerance +
            "\n\n" +

            "Result: " +
            (
                report.regenerated.pass
                    ? "PASS"
                    : "FAIL"
            );

    }


    return report;

}

async function recoverPoseFromStruts(
    struts
){

    if(
        !Array.isArray(struts) ||
        struts.length !== 6 ||
        struts.some(value => !Number.isFinite(Number(value)))
    ){

        throw new Error(
            "Cannot recover pose: exactly six finite strut lengths are required."
        );

    }

    if(
        !window.HexapodCaseRecovery ||
        typeof window.HexapodCaseRecovery.recoverPoseFromStrutsBrowser !== "function"
    ){

        throw new Error(
            "Browser FK recovery is unavailable: HexapodCaseRecovery did not load."
        );

    }

    if(!window.currentCase){

        throw new Error(
            "Browser FK recovery requires the active CASE to be loaded."
        );

    }

    try{

        // R1171.1 — Browser JavaScript is now authoritative for Treatment FK.
        // This preserves the legacy helper's matrix-only T_bone return contract.
        return window.HexapodCaseRecovery.recoverPoseFromStrutsBrowser(
            struts,
            { caseData: window.currentCase }
        );

    }catch(error){

        throw new Error(
            "Browser FK recovery failed: " +
            (error && error.message ? error.message : String(error))
        );

    }

}


async function updateAdjustmentPlan(
    cascadeContext = null
){

    const isRootTransaction =
        !cascadeContext;


    if(isRootTransaction){

        window.__validationResults =
            {};


        const validationPanel =
            document.getElementById(
                "plannerValidationInspector"
            );


        if(validationPanel){

            validationPanel.textContent =
                "";

        }

    }


    showPlannerOverlay(
        "Generating Adjustment Plan",
        "Preparing the planning transaction.",
        "Please wait."
    );


    await new Promise(
        resolve =>
            requestAnimationFrame(
                () => resolve()
            )
    );


    const button =
        document.getElementById(
            "updateAdjustmentPlanButton"
        );

    updateUndoButton();
    
    const c =
        await ensureCurrentCase();

    // Pin this planner transaction to the mode active when it starts.
    // Nested cascade work inherits the same mode even if UI state changes.
    const planningMode = normalizePlannerMode(
        cascadeContext && cascadeContext.plannerMode
            ? cascadeContext.plannerMode
            : (c.metadata && c.metadata.planner)
    );

    // R1172.9.24 — Prescription Verification is a standalone FK check.
    // It must never enter the normal phase-planning transaction below:
    // that path commits plannerResult into stage.prescription and creates
    // phase snapshots/Undo transactions. Doing so allowed the 84-row
    // verification schedule to overwrite a Normal phase's 7-row plan.
    // Keep Verification output in its dedicated runtime result and let
    // buildContinuousAdjustmentPlanResult() publish it to the viewer.
    if(planningMode === "verification" && !cascadeContext){
        try{
            const verificationResult = await runPlanner();
            await populateTreatment();
            if(typeof window.refreshThreePrototypeAfterPlanCommit === "function"){
                window.refreshThreePrototypeAfterPlanCommit();
            }
            updateUndoButton();
            if(typeof window.updateCurrentCaseInspector === "function"){
                window.updateCurrentCaseInspector();
            }
            return verificationResult;
        }catch(error){
            console.error("[R1172.9.24] Prescription Verification failed", error);
            alert(error && error.message ? error.message : String(error));
            return null;
        }finally{
            hidePlannerOverlay();
            if(button) button.disabled = false;
        }
    }

    const stage =
        currentStage();


    if(!stage){

        alert(
            "No current phase is selected."
        );

        return;

    }

    const startDateInput =
        document.getElementById(
            "tp_start_date"
        );

    // --------------------------------------------------------
    // DETERMINE THE START DATE FOR THIS PLANNING TRANSACTION
    //
    // Normal user-initiated planning:
    //     Read the visible Treatment Start Date field.
    //
    // Cascade planning:
    //     The downstream phase already has its proposed/committed
    //     start date in CASE, so use stage.startDate.
    //
    // IMPORTANT:
    //     An unplanned phase's HTML date is only a proposal.
    //     It becomes stage.startDate only after this planning
    //     transaction passes validation.
    //
    // This distinction must be preserved:
    //
    //     tp_start_date = UI proposal
    //     stage.startDate = committed planned date
    // --------------------------------------------------------
    const proposedStartDate =
        (
            cascadeContext &&
            cascadeContext.active
        )
        ?
        (
            stage.startDate ||
            ""
        )
        :
        (
            startDateInput
                ? startDateInput.value
                : (
                    stage.startDate ||
                    ""
                )
        );

    // ----------------------------------------------------
    // COMMITTED TRANSACTION SNAPSHOT
    //
    // Retrieve the last committed version of this phase BEFORE
    // runPlanner().  Do NOT clone stage here: stage.target may
    // already contain a newly edited user value.
    //
    // savedStageSnapshotsByMode[mode][stage.id] represents the last
    // accepted plan, not the current editable CASE.
    // ----------------------------------------------------

    const committedStageSnapshot =
        getCommittedStageSnapshot(
            stage,
            planningMode
        );

    // --------------------------------------------------------
    // ACTIVE-PHASE REPLAN
    //
    // The current phase is already in progress.
    // The selected Treatment Start Date becomes the
    // replan/diversion date.
    //
    // The original stage.startDate remains unchanged.
    // --------------------------------------------------------
    
    let activeReplan =
        false;
    
    let activeReplanDayIndex =
        null;
    
    let activeReplanOriginalPrescription =
        null;
    
    let earlyStartOriginalPrescription =
        null;

    let earlyStartPreservedPrescription =
        null;

    let earlyStartHandoff =
        null;

    let earlyStartDayIndex =
        null;

    let earlyStartPreviousPhaseId =
        null;
    // ----------------------------------------------------
    // CASCADE TRANSACTION CONTEXT
    //
    // A top-level planner run creates a new transaction.
    //
    // A nested downstream planner receives the SAME context,
    // allowing the entire P1 → P2 → P3 ... chain to be
    // treated as one coordinated operation.
    //
    // The context is browser-runtime state only.
    // It is NOT stored in CASE.
    // ----------------------------------------------------

    if(
        !cascadeContext
    ){

        cascadeContext = {

            active:
                false,

            transactionId:
                crypto.randomUUID(),

            plannerMode:
                planningMode,

            rootStageId:
                stage.id,

            stagesChanged:
                [],

            originalSnapshots:
                {}

        };

    }

    if(!cascadeContext.plannerMode){
        cascadeContext.plannerMode = planningMode;
    }


    // ----------------------------------------------------
    // Record this phase's original committed state once.
    //
    // IMPORTANT:
    // This happens BEFORE the planner changes the phase.
    //
    // Therefore the snapshot represents the rollback state,
    // not the newly edited candidate.
    // ----------------------------------------------------

    if(
        !cascadeContext.originalSnapshots[
            stage.id
        ]
    ){
    
        cascadeContext.originalSnapshots[
            stage.id
        ] =
            structuredClone(
                committedStageSnapshot ||
                stage
            );
    
    }





    // ----------------------------------------------------
    // Record that this phase participates in this transaction.
    //
    // Do not add the same phase twice.
    // ----------------------------------------------------

    if(
        !cascadeContext.stagesChanged.includes(
            stage.id
        )
    ){

        cascadeContext.stagesChanged.push(
            stage.id
        );

    }

//-------temporary 
    // ----------------------------------------------------
    // TEMPORARY CASCADE ROLLBACK TEST
    //
    // Force Phase 3 to fail after it has been registered
    // in the cascade transaction, but BEFORE its planner
    // runs.
    //
    // This is TEST CODE ONLY.
    // Remove it immediately after the rollback test.
    // ----------------------------------------------------

//    if(
//        cascadeContext &&
//        cascadeContext.active &&
//        stage.name === "Phase 3"
//    ){

//        throw new Error(
//            "TEST: Forced Phase 3 cascade failure."
//        );

//    }


//------


    // --------------------------------------------------------
    // ACTIVE-PHASE REPLAN
    //
    // Approval is normally a lock.
    // An approved phase that is currently active may be
    // explicitly replanned.
    //
    // A planned active phase is also allowed to replan.
    // --------------------------------------------------------
    
    const phaseStartDate =
        stage.startDate
            ? parseLocalDate(
                stage.startDate
            )
            : null;
    
    const phaseEndDate =
        stage.endDate
            ? parseLocalDate(
                stage.endDate
            )
            : null;
    
    const today =
        parseLocalDate(
            formatDateInputValue(
                new Date()
            )
        );
    
    const proposedDate =
        proposedStartDate
            ? parseLocalDate(
                proposedStartDate
            )
            : null;
    
    const phaseIsActive =
        !!(
            phaseStartDate &&
            today &&
            today > phaseStartDate &&
            (
                !phaseEndDate ||
                today <= phaseEndDate
            )
        );
    
    if(
        phaseIsActive
    ){
    
        if(!proposedDate){
    
            alert(
                "Please select a replan start date."
            );
    
            return;
    
        }
    
        if(
            proposedDate < today
        ){
    
            alert(
                "The replan start date cannot be before today."
            );
    
            return;
    
        }
    
        if(
            proposedDate < phaseStartDate
        ){
    
            alert(
                "The replan start date cannot be before the phase start date."
            );
    
            return;
    
        }
    
        if(
            phaseEndDate &&
            proposedDate > phaseEndDate
        ){
    
            alert(
                "The replan start date cannot be after the current phase end date."
            );
    
            return;
    
        }
    
        activeReplan =
            true;
    
        activeReplanDayIndex =
            1;

    
        const cursor =
            new Date(
                phaseStartDate.getTime()
            );
    
        while(
            cursor < proposedDate
        ){
    
            cursor.setDate(
                cursor.getDate() + 1
            );
    
            activeReplanDayIndex++;
    
        }
    
        //
        // Approved + active:
        // ask for explicit confirmation BEFORE attempting
        // the Day-N mechanical-state handoff.
        //
        if(
            stage.status === "approved"
        ){

            const confirmed =
                window.confirm(
                    stage.name +
                    " is currently active and approved.\n\n" +
                    "Do you want to replan the remaining treatment " +
                    "from the selected start date?"
                );

            if(!confirmed){

                delete stage._activeReplan;

                setPlannerStatus(
                    "Planning cancelled"
                );

                return;

            }

        }


        //
        // Now obtain the existing Day-N mechanical state.
        //
        const activeReplanPrescription =
            stage.prescription &&
            stage.prescription.strut_array;

        if(
            !Array.isArray(
                activeReplanPrescription
            ) ||
            activeReplanDayIndex < 0 ||
            activeReplanDayIndex >=
                activeReplanPrescription.length
        ){

            alert(
                "The selected replan date cannot be mapped " +
                "to the existing treatment prescription."
            );

            return;

        }

        const activeReplanStruts =
            activeReplanPrescription[
                activeReplanDayIndex
            ];

        let activeReplanPose;

        try{

            activeReplanPose =
                await recoverPoseFromStruts(
                    activeReplanStruts
                );

        }catch(error){

            alert(
                "Unable to recover the Day-N pose.\n\n" +
                error.message
            );

            return;

        }

        //
        // Save the existing complete prescription and pose
        // trajectory BEFORE replacing the planner handoff.
        //
        activeReplanOriginalPrescription =
            structuredClone(
                stage.prescription
            );


        //
        // Existing early-start-style mechanical handoff.
        //
        stage.recoveredFinalState = {
        
            pose:
                structuredClone(
                    activeReplanPose
                ),
        
            strutLengths:
                structuredClone(
                    activeReplanStruts
                )
        
        };


        //
        // Tell Python that this recovered state is the
        // active-replan starting state.
        //
        stage._activeReplan =
            true;

    }
    else{
    
        //
        // Normal approval lock.
        //
        if(
            stage.status === "approved"
        ){
    
            alert(
                stage.name +
                " is already approved and cannot be replanned."
            );
    
            return;
    
        }
    
    }


    const dateValidation =
        activeReplan
            ? {
                valid:true,
                overlap:false,
                message:""
            }
            : validateCurrentPhaseStartDate(
                proposedStartDate
            );


    if(!dateValidation.valid){
    
        alert(
            dateValidation.message
        );
    
        return;
    
    }
    
    
    alert(
        "EARLY START CHECK\n\n" +
    
        "overlap = " +
        String(
            dateValidation.overlap
        ) +
    
        "\n\ncascade active = " +
        String(
            !!(
                cascadeContext &&
                cascadeContext.active
            )
        )
    );

    // --------------------------------------------------------
    // INTENTIONAL EARLY-START DECISION
    //
    // A normal user-initiated planning transaction may
    // intentionally start this phase before the previous
    // phase has finished.
    //
    // This is a CALENDAR decision only.
    //
    // It does not run the planner, change mechanical state,
    // or trigger downstream cascade logic.
    //
    // The surgeon must explicitly allow the overlap before
    // the proposed date becomes stage.startDate.
    //
    // Nested cascade planning does not ask this question.
    // --------------------------------------------------------
    
    if(
        dateValidation.overlap &&
        !(
            cascadeContext &&
            cascadeContext.active
        )
    ){
    
        const previousPhase =
            getPreviousPhase();

        if(
            previousPhase
        ){
        
            earlyStartPreviousPhaseId =
                previousPhase.id;
        
        }    
    
        const previousStartText =
            previousPhase &&
            previousPhase.startDate
                ? (
                    parseLocalDate(
                        previousPhase.startDate
                    )
                    ?.toLocaleDateString(
                        "en-GB",
                        {
                            weekday:"short",
                            day:"2-digit",
                            month:"short",
                            year:"numeric"
                        }
                    )
                    ||
                    previousPhase.startDate
                )
                : "unknown";
    
    
        const previousEndText =
            previousPhase &&
            previousPhase.endDate
                ? (
                    parseLocalDate(
                        previousPhase.endDate
                    )
                    ?.toLocaleDateString(
                        "en-GB",
                        {
                            weekday:"short",
                            day:"2-digit",
                            month:"short",
                            year:"numeric"
                        }
                    )
                    ||
                    previousPhase.endDate
                )
                : "unknown";
    
    
        const allowOverlap =
            window.confirm(
    
                "INTENTIONAL PHASE OVERLAP\n\n" +
    
                (stage.name || "This phase") +
                " is scheduled to start on " +
                proposedStartDate +
                ".\n\n" +
    
                (
                    previousPhase
                        ? (
                            previousPhase.name +
                            " runs from " +
                            previousStartText +
                            " through " +
                            previousEndText +
                            "."
                        )
                        : ""
                ) +
    
                "\n\n" +
    
                "The phases will overlap.\n\n" +
    
                "Do you want to allow this " +
                "intentional overlap?"
            );
    
    
        if(!allowOverlap){

            setPlannerStatus(
                "Planning cancelled"
            );

            return;

        }

        // Register the previous phase in the
        // existing cascade transaction so its
        // current committed state can be undone.

        if(
            previousPhase
        ){

            const previousSnapshot =
                getCommittedStageSnapshot(
                    previousPhase,
                    cascadeContext.plannerMode
                );

            if(
                previousSnapshot &&
                !cascadeContext.originalSnapshots[
                    previousPhase.id
                ]
            ){

                cascadeContext.originalSnapshots[
                    previousPhase.id
                ] =
                    structuredClone(
                        previousSnapshot
                    );

            }

            if(
                !cascadeContext.stagesChanged.includes(
                    previousPhase.id
                )
            ){

                cascadeContext.stagesChanged.push(
                    previousPhase.id
                );

            }

        }

        //
        // Preserve the complete previous-phase prescription
        // BEFORE truncating it for the intentional early start.
        //
        earlyStartOriginalPrescription =
            structuredClone(
                previousPhase.prescription
            );
            
        const previousStart =
            parseLocalDate(
                previousPhase.startDate
            );
        
        const proposedStart =
            parseLocalDate(
                proposedStartDate
            );
        
        let retainedIndex = 0;
        
        while(
            previousStart < proposedStart
        ){
        
            previousStart.setDate(
                previousStart.getDate() + 1
            );
        
            retainedIndex++;
        
        }

        earlyStartDayIndex =
            retainedIndex;
        
        previousPhase.prescription.strut_array =
            previousPhase.prescription.strut_array.slice(
                0,
                retainedIndex + 1
            );
        
        const previousEnd =
            parseLocalDate(
                proposedStartDate
            );
        
        previousEnd.setDate(
            previousEnd.getDate() - 1
        );
        
        previousPhase.endDate =
            formatDateInputValue(
                previousEnd
            );
        
        previousPhase.duration =
            retainedIndex;


        const previousStrutArray =
            previousPhase &&
            previousPhase.prescription &&
            previousPhase.prescription.strut_array;

        if(
            !Array.isArray(
                previousStrutArray
            ) ||
            retainedIndex < 0 ||
            retainedIndex >=
                previousStrutArray.length
        ){

            throw new Error(
                "Cannot recover the early-start state: " +
                "the previous phase prescription does not " +
                "contain the selected day."
            );

        }

        const earlyStartStruts =
            previousStrutArray[
                retainedIndex
            ];

        let earlyStartPose;

        try{

            earlyStartPose =
                await recoverPoseFromStruts(
                    earlyStartStruts
                );

        }catch(error){

            throw new Error(
                "Unable to recover the early-start pose.\n\n" +
                error.message
            );

        }

        previousPhase.recoveredFinalState = {

            pose:
                structuredClone(
                    earlyStartPose
                ),

            strutLengths:
                structuredClone(
                    earlyStartStruts
                )

        };
        
        earlyStartHandoff =
            structuredClone(
                previousPhase.recoveredFinalState
            );        
        
        previousPhase.duration =
            retainedIndex;

        //
        // Snapshot the retained previous-phase prescription
        // AFTER the early-start truncation.
        //
        earlyStartPreservedPrescription =
            structuredClone(
                previousPhase.prescription
            );

    }


    // --------------------------------------------------------
    // The date was only a UI proposal until this point.
    //
    // It has now passed validation, so it becomes the
    // committed start date for this planning transaction.
    // --------------------------------------------------------

    if(!activeReplan){
    
        stage.startDate =
            proposedStartDate;
    
    }


    setPlannerStatus(
        "Updating..."
    );


    const planner =
        buildPlannerRecords(c);


    computeCurrentBoneStates(
        planner,
        c
    );


    const result = {
        treatment:c.treatment,
        planner:planner
    };


    renderPlannerStatus(
        result
    );


    if(button){

        button.disabled = true;

    }


    try{

        // ----------------------------------------------------
        // IMPORTANT:
        //
        // Capture the PREVIOUS mechanical handoff BEFORE
        // running the planner.
        //
        // runPlanner() will produce the NEW handoff.
        // ----------------------------------------------------

        const previousRecoveredState =
            stage.recoveredFinalState
                ? structuredClone(
                    stage.recoveredFinalState
                )
                : null;
        
        
        // ----------------------------------------------------
        // ACTIVE REPLAN DIAGNOSTIC
        //
        // Capture the actual Day-N mechanical handoff that
        // is already being used by the planner.
        //
        // Diagnostic only.
        // This does not create or modify any planner state.
        // ----------------------------------------------------
        
        const activeReplanHandoff =
            activeReplan &&
            stage.recoveredFinalState
                ? structuredClone(
                    stage.recoveredFinalState
                )
                : null;
        
        
        const plannerResult =
            await runPlanner(stage.id);

        // ----------------------------------------------------
        // ACTIVE REPLAN DIAGNOSTIC
        //
        // Verify that the planner actually started from the
        // mechanical handoff we captured above.
        //
        // Diagnostic only.
        // ----------------------------------------------------
        
        if(
            activeReplanHandoff &&
            plannerResult
        ){
        
            const plannerInitialPose =
                Array.isArray(
                    plannerResult.daily_poses
                ) &&
                plannerResult.daily_poses.length > 0
                    ? plannerResult.daily_poses[0]
                    : null;
        
        
            const plannerInitialStruts =
                Array.isArray(
                    plannerResult.strut_array
                ) &&
                plannerResult.strut_array.length > 0
                    ? plannerResult.strut_array[0]
                    : null;
        
        
            let poseDifference =
                null;
        
            let strutDifference =
                null;
        
        
            if(
                Array.isArray(
                    activeReplanHandoff.pose
                ) &&
                Array.isArray(
                    plannerInitialPose
                )
            ){
        
                poseDifference =
                    0;
        
        
                for(
                    let r = 0;
                    r < activeReplanHandoff.pose.length;
                    r++
                ){
        
                    for(
                        let c = 0;
                        c <
                        activeReplanHandoff.pose[r].length;
                        c++
                    ){
        
                        const difference =
                            Math.abs(
                                Number(
                                    activeReplanHandoff
                                        .pose[r][c]
                                ) -
                                Number(
                                    plannerInitialPose[r][c]
                                )
                            );
        
        
                        if(
                            Number.isFinite(
                                difference
                            ) &&
                            difference >
                                poseDifference
                        ){
        
                            poseDifference =
                                difference;
        
                        }
        
                    }
        
                }
        
            }
        
        
            if(
                Array.isArray(
                    activeReplanHandoff.strutLengths
                ) &&
                Array.isArray(
                    plannerInitialStruts
                )
            ){
        
                strutDifference =
                    0;
        
        
                for(
                    let i = 0;
                    i <
                    activeReplanHandoff
                        .strutLengths.length;
                    i++
                ){
        
                    const difference =
                        Math.abs(
                            Number(
                                activeReplanHandoff
                                    .strutLengths[i]
                            ) -
                            Number(
                                plannerInitialStruts[i]
                            )
                        );
        
        
                    if(
                        Number.isFinite(
                            difference
                        ) &&
                        difference >
                            strutDifference
                    ){
        
                        strutDifference =
                            difference;
        
                    }
        
                }
        
            }
        
        
            if(
                typeof debugLog === "function"
            ){
        
                debugLog(
                    "ACTIVE REPLAN DIAGNOSTIC\n" +
                    "Pose difference = " +
                    poseDifference +
                    "\n" +
                    "Strut difference = " +
                    strutDifference
                );
        
            }
        
        }
        // ACTIVE REPLAN DIAGNOSTIC...^^^




        // ----------------------------------------------------
        // The generated plan belongs to the CURRENT PHASE.
        //
        // Keep plannerResult intact because it is also used
        // for rendering and may contain developer diagnostics.
        // ----------------------------------------------------

        // old..keep debug in prescription
        //stage.prescription =
        //    structuredClone(
        //        plannerResult
        //    );


        const phasePrescription =
            structuredClone(
                plannerResult
            );


        // ----------------------------------------------------
        // DEBUG IS NOT CLINICAL/PRESCRIPTION DATA.
        //
        // Keep it in the separate live debug channel
        // Legacy debug-log bridge retired in R1171.1.
        //
        // Do not store it underneath stage.prescription.
        // ----------------------------------------------------

        delete phasePrescription.debug;
        // Browser-only diagnostics and redundant transform aliases stay out of CASE prescription data.
        delete phasePrescription._r1170_1_diagnostics;
        delete phasePrescription.daily_bone_poses;
        delete phasePrescription.daily_ring_to_bone_poses;

        // --------------------------------------------------------
        // ACTIVE REPLAN SPLICE
        //
        // Preserve the existing trajectory BEFORE Day N.
        // The new planner starts at Day N.
        //
        // Old rows:
        //     0 ... N-1
        //
        // New planner rows:
        //     0 ... remaining
        //
        // New row 0 is the recovered Day-N state.
        // --------------------------------------------------------
        
        if(
            activeReplan
        ){
        
            const oldPrescription =
                activeReplanOriginalPrescription;
        
            const oldStruts =
                oldPrescription &&
                Array.isArray(
                    oldPrescription.strut_array
                )
                    ? oldPrescription.strut_array
                    : null;
        
            const newStruts =
                Array.isArray(
                    plannerResult.strut_array
                )
                    ? plannerResult.strut_array
                    : [];
        
            if(
                !oldStruts ||
                activeReplanDayIndex === null ||
                activeReplanDayIndex < 0 ||
                activeReplanDayIndex >=
                    oldStruts.length
            ){
        
                throw new Error(
                    "Cannot splice the active-phase replan: " +
                    "the existing prescription does not contain Day N."
                );
        
            }
        
            //
            // Preserve everything BEFORE Day N.
            //
            phasePrescription.strut_array =
                oldStruts
                    .slice(
                        0,
                        activeReplanDayIndex
                    )
                    .concat(
                        structuredClone(
                            newStruts
                        )
                    );
        
        
            //
            // Preserve the corresponding daily poses when
            // available.
            //
            if(
                Array.isArray(
                    oldPrescription.daily_poses
                ) &&
                Array.isArray(
                    plannerResult.daily_poses
                )
            ){
        
                phasePrescription.daily_poses =
                    oldPrescription.daily_poses
                        .slice(
                            0,
                            activeReplanDayIndex
                        )
                        .concat(
                            structuredClone(
                                plannerResult.daily_poses
                            )
                        );
        
            }
        
        
            //
            // Preserve the corresponding ring poses when
            // available.
            //
            if(
                Array.isArray(
                    oldPrescription.daily_ring_poses
                ) &&
                Array.isArray(
                    plannerResult.daily_ring_poses
                )
            ){
        
                phasePrescription.daily_ring_poses =
                    oldPrescription.daily_ring_poses
                        .slice(
                            0,
                            activeReplanDayIndex
                        )
                        .concat(
                            structuredClone(
                                plannerResult.daily_ring_poses
                            )
                        );
        
            }

            if(
                Array.isArray(
                    oldPrescription.clinical_metrics
                ) &&
                Array.isArray(
                    plannerResult.clinical_metrics
                )
            ){

                phasePrescription.clinical_metrics =
                    oldPrescription.clinical_metrics
                        .slice(
                            0,
                            activeReplanDayIndex
                        )
                        .concat(
                            structuredClone(
                                plannerResult.clinical_metrics
                            )
                        );

            }
        
        
            phasePrescription.days_needed =
                Math.max(
                    0,
                    phasePrescription.strut_array.length - 1
                );
        
            phasePrescription.number_of_days =
                phasePrescription.strut_array.length;
        
        }


        // ----------------------------------------------------
        // ACTIVE REPLAN VALIDATION
        //
        // Validate the new Day-N handoff and the resulting
        // preserved/regenerated trajectory.
        //
        // No browser pose cache is used.
        // ----------------------------------------------------

        if(
            activeReplan &&
            activeReplanHandoff &&
            activeReplanOriginalPrescription
        ){

            const activeValidationReport =
                await runPlannerValidation({
            
                    mode:
                        "active-replan",
            
                    dayIndex:
                        activeReplanDayIndex,
            
                    handoffPose:
                        activeReplanHandoff.pose,
            
                    existingPrescription:
                        activeReplanOriginalPrescription,
            
                    plannerResult,
            
                    handoffTolerance:
                        1e-6,
            
                    originalPoses:
                        activeReplanOriginalPrescription
                            .daily_poses,
            
                    originalStruts:
                        activeReplanOriginalPrescription
                            .strut_array,
            
                    combinedPoses:
                        phasePrescription
                            .daily_poses,
            
                    combinedStruts:
                        phasePrescription
                            .strut_array
            
                });
            
            
            window.__validationResults.active =
                activeValidationReport;
            
            updateValidationSummary();

        }


        if(
            !activeReplan &&
            earlyStartHandoff &&
            earlyStartOriginalPrescription &&
            earlyStartPreservedPrescription
        ){

            const earlyValidationReport =
                await runPlannerValidation({

                    mode:
                        "early-start",

                    dayIndex:
                        earlyStartDayIndex,

                    handoffPose:
                        earlyStartHandoff.pose,

                    handoffStrutLengths:
                        earlyStartHandoff.strutLengths,

                    existingPrescription:
                        earlyStartOriginalPrescription,

                    plannerResult,

                    handoffTolerance:
                        1e-6,

                    originalPoses:
                        earlyStartOriginalPrescription
                            .daily_poses,

                    originalStruts:
                        earlyStartOriginalPrescription
                            .strut_array,

                    combinedPoses:
                        plannerResult
                            .daily_poses,

                    combinedStruts:
                        plannerResult
                            .strut_array,

                    preservedPrescription:
                        earlyStartPreservedPrescription

                });


            window.__validationResults.early =
                earlyValidationReport;


            updateValidationSummary();
        }


        stage.prescription =
            phasePrescription;

        // ----------------------------------------------------
        // Build the NEW recovered final mechanical state.
        // ----------------------------------------------------

        let newRecoveredState =
            null;


        if(
            Array.isArray(
                plannerResult.recovered_final_pose
            ) &&
            Array.isArray(
                plannerResult.strut_array
            ) &&
            plannerResult.strut_array.length > 0
        ){

            newRecoveredState = {

                pose:
                    structuredClone(
                        plannerResult.recovered_final_pose
                    ),

                strutLengths:
                    structuredClone(
                        plannerResult.strut_array[
                            plannerResult.strut_array.length - 1
                        ]
                    )

            };

        }


        // ----------------------------------------------------
        // Compare OLD and NEW mechanical handoffs.
        //
        // A handoff is considered changed when either:
        //
        //   1. recovered final pose changes
        //   2. final strut lengths change
        //
        // This reproduces the meaning of the existing Python
        // comparison without moving planner mathematics into JS.
        // ----------------------------------------------------

        let handoffChanged =
            false;


        let poseDifference =
            null;


        let strutDifference =
            null;


        const HANDOFF_TOLERANCE =
            1e-6;


        const previousHandoffComplete =
            previousRecoveredState !== null &&
            Array.isArray(
                previousRecoveredState.pose
            ) &&
            Array.isArray(
                previousRecoveredState.strutLengths
            );


        const newHandoffComplete =
            newRecoveredState !== null &&
            Array.isArray(
                newRecoveredState.pose
            ) &&
            Array.isArray(
                newRecoveredState.strutLengths
            );


        if(
            previousHandoffComplete &&
            newHandoffComplete
        ){

            // ------------------------------------------------
            // Compare recovered pose.
            //
            // Pose is normally a 4 x 4 matrix.
            // ------------------------------------------------

            poseDifference =
                0;


            if(
                previousRecoveredState.pose.length !==
                newRecoveredState.pose.length
            ){

                poseDifference =
                    Infinity;

            }
            else{

                for(
                    let r = 0;
                    r <
                    previousRecoveredState.pose.length;
                    r++
                ){

                    const oldRow =
                        previousRecoveredState.pose[r];

                    const newRow =
                        newRecoveredState.pose[r];


                    if(
                        !Array.isArray(oldRow) ||
                        !Array.isArray(newRow) ||
                        oldRow.length !== newRow.length
                    ){

                        poseDifference =
                            Infinity;

                        break;

                    }


                    for(
                        let col = 0;
                        col < oldRow.length;
                        col++
                    ){

                        const difference =
                            Math.abs(
                                Number(oldRow[col]) -
                                Number(newRow[col])
                            );


                        if(
                            Number.isFinite(difference) &&
                            difference > poseDifference
                        ){

                            poseDifference =
                                difference;

                        }

                    }

                }

            }


            // ------------------------------------------------
            // Compare final six strut lengths.
            // ------------------------------------------------

            strutDifference =
                0;


            if(
                previousRecoveredState.strutLengths.length !==
                newRecoveredState.strutLengths.length
            ){

                strutDifference =
                    Infinity;

            }
            else{

                for(
                    let i = 0;
                    i <
                    previousRecoveredState.strutLengths.length;
                    i++
                ){

                    const difference =
                        Math.abs(
                            Number(
                                previousRecoveredState
                                    .strutLengths[i]
                            ) -
                            Number(
                                newRecoveredState
                                    .strutLengths[i]
                            )
                        );


                    if(
                        Number.isFinite(difference) &&
                        difference > strutDifference
                    ){

                        strutDifference =
                            difference;

                    }

                }

            }


            handoffChanged =
                poseDifference >
                    HANDOFF_TOLERANCE ||
                strutDifference >
                    HANDOFF_TOLERANCE;

        }


        // ----------------------------------------------------
        // Store the NEW recovered final mechanical state
        // separately from the browser-facing prescription.
        //
        // IMPORTANT:
        // This occurs AFTER the old/new comparison.
        // ----------------------------------------------------

        if(
            newRecoveredState
        ){

            stage.recoveredFinalState =
                newRecoveredState;

        }


        // ----------------------------------------------------
        // Successful replanning makes THIS phase's prescription
        // mechanically current again.
        //
        // This is especially important when the phase was
        // previously marked "stale" because its predecessor
        // changed.
        // ----------------------------------------------------
        
        stage.prescriptionState =
            "current";

        // ----------------------------------------------------
        // Calculate the end date from this phase's
        // prescription.
        // ----------------------------------------------------

        const plannedEnd =
            getCurrentPhasePlannedEndDate(
                c
            );


        if(plannedEnd){

            stage.endDate =
                formatDateInputValue(
                    plannedEnd
                );

        }
        else{

            stage.endDate =
                null;

        }


        // ----------------------------------------------------
        // FINALIZE THE NEW PLANNED PHASE STATE
        //
        // The planner has succeeded.
        //
        // Before this phase can become the new committed
        // rollback point, its planning metadata must be complete.
        //
        // IMPORTANT:
        // saveCommittedStageSnapshot(stage) must happen AFTER
        // these fields are finalized.
        // ----------------------------------------------------

        stage.duration =
            activeReplan
                ? (
                    phasePrescription.days_needed
                )
                : (
                    plannerResult.days_needed ??
                    (
                        Array.isArray(
                            plannerResult.strut_array
                        )
                            ?
                            plannerResult.strut_array.length - 1
                            :
                            null
                    )
                );

        if(
            activeReplan ||
            stage.status !== "approved"
        ){
        
            stage.status =
                "planned";
        
        }

        if(
            activeReplan
        ){
        
            delete stage._activeReplan;
        
        }



        // ----------------------------------------------------
        // Successful single-phase transaction.
        //
        // Preserve its BEFORE state as the one-level Undo.
        // ----------------------------------------------------

        if(
            isRootTransaction
        ){

            saveUndoTransactionForCurrentMode(

                captureUndoTransaction(cascadeContext),

                cascadeContext.plannerMode

            );
        }


        // ----------------------------------------------------
        // Check whether the newly planned end date conflicts
        // with the NEXT phase's existing start date.
        //
        // This is detection only.
        // Do NOT move or replan the next phase here.
        // ----------------------------------------------------

        let calendarConflict = false;
        let gapDays = 0;
        let nextPhase = null;

        const currentPhaseIndex =
            c.treatment.stages.findIndex(
                s => s.id === stage.id
            );


        if(
            currentPhaseIndex >= 0 &&
            currentPhaseIndex <
                c.treatment.stages.length - 1
        ){

            nextPhase =
                c.treatment.stages[
                    currentPhaseIndex + 1
                ];


            if(
                plannedEnd &&
                nextPhase &&
                nextPhase.startDate
            ){

                const nextStart =
                    parseLocalDate(
                        nextPhase.startDate
                    );


                if(nextStart){
                
                    const preserveCalendarGap = PRESERVE_CALENDAR_GAP;
                
                    const requiredStart =
                        new Date(plannedEnd);
                
                    requiredStart.setDate(
                        requiredStart.getDate() + 1
                    );
                
                
                    if(preserveCalendarGap){
                
                        const originalPhase =
                            cascadeContext &&
                            cascadeContext.originalSnapshots
                            ?
                            cascadeContext.originalSnapshots[
                                stage.id
                            ]
                            :
                            null;
                
                
                        if(
                            originalPhase &&
                            originalPhase.endDate
                        ){
                
                            const originalEnd =
                                parseLocalDate(
                                    originalPhase.endDate
                                );
                
                
                            if(originalEnd){
                
                                const originalStart =
                                    new Date(originalEnd);
                
                                originalStart.setDate(
                                    originalStart.getDate() + 1
                                );
                
                
                                const cursor =
                                    new Date(originalStart);
                
                
                                while(cursor < nextStart){
                
                                    cursor.setDate(
                                        cursor.getDate() + 1
                                    );
                
                                    gapDays++;
                
                                }
                
                            }
                
                        }
                
                    }
                
                
                    const expectedStart =
                        new Date(requiredStart);
                
                    expectedStart.setDate(
                        expectedStart.getDate() + gapDays
                    );
                
                
                    if(preserveCalendarGap){
                    
                        calendarConflict =
                            nextStart.getTime() !==
                            expectedStart.getTime();
                    
                    }
                    else{
                    
                        calendarConflict =
                            nextStart < requiredStart;
                    
                    }
                
                }

            }

        }


        if(calendarConflict){

            alert(
                "CALENDAR CONFLICT\n\n" +
        
                stage.name +
                " now ends on " +
                plannedEnd.toLocaleDateString(
                    "en-GB",
                    {
                        weekday:"short",
                        day:"2-digit",
                        month:"short",
                        year:"numeric"
                    }
                ) +
        
                ".\n\n" +
        
                nextPhase.name +
                " is currently scheduled to start on " +
                nextPhase.startDate +
        
                ".\n\n" +
        
                "The downstream phase must be replanned or " +
                "the change must be cancelled."
            );

        }


        // ----------------------------------------------------
        // Classify downstream impact.
        //
        // handoffChanged was already calculated above by
        // the NEW JS-side recovered-state comparison.
        //
        // Do NOT read plannerResult.handoff_changed here.
        // Handoff change is determined by the current JS-side
        // recovered-state comparison above.
        // This is detection only.
        // Do NOT modify the next phase here.
        // ----------------------------------------------------

        let downstreamImpact =
            "none";


        if(
            handoffChanged &&
            calendarConflict
        ){

            downstreamImpact =
                "mechanical_and_calendar";

        }
        else if(
            handoffChanged
        ){

            downstreamImpact =
                "mechanical";

        }
        else if(
            calendarConflict
        ){

            downstreamImpact =
                "calendar";

        }

        // ----------------------------------------------------
        // Identify the immediate downstream phase affected
        // by this result.
        //
        // A downstream phase is eligible for cascade handling
        // only if it already has a mechanical prescription.
        //
        // An unplanned future phase has no existing prescription
        // that can become stale, so it is NOT a cascade target.
        //
        // Detection only.
        // Do NOT modify the downstream phase here.
        // ----------------------------------------------------
        
        let affectedPhase =
            null;
        
        
        const downstreamHasPrescription =
            !!(
                nextPhase &&
                nextPhase.prescription &&
                Array.isArray(
                    nextPhase.prescription.strut_array
                ) &&
                nextPhase.prescription.strut_array.length > 0
            );
        
        
        if(
            (
                handoffChanged ||
                calendarConflict
            ) &&
            downstreamHasPrescription
        ){
        
            affectedPhase =
                nextPhase;
        
        }
        
        

        // ----------------------------------------------------
        // DOWNSTREAM REPLAN DECISION
        //
        // Detection has identified an affected downstream
        // phase.
        //
        // Ask the user BEFORE changing the downstream phase.
        //
        // NO:
        //     Leave the downstream phase completely untouched.
        //
        // YES:
        //     Replan the affected phase using the existing
        //     updateAdjustmentPlan() workflow.
        //
        // IMPORTANT:
        //     The downstream phase is temporarily selected
        //     so that updateAdjustmentPlan() operates on the
        //     correct phase.
        // ----------------------------------------------------


        let downstreamReplanRequested =
            Boolean(
                affectedPhase &&
                cascadeContext &&
                cascadeContext.active
            );


        if(
            affectedPhase &&
            (
                handoffChanged ||
                calendarConflict
            ) &&
            affectedPhase.status !== "approved" &&
            !cascadeContext.active
        ){

            downstreamReplanRequested =
                window.confirm(
                    "DOWNSTREAM PHASE REPLAN\n\n" +

                    affectedPhase.name +
                    " is affected by the new plan for " +
                    stage.name +
                    ".\n\n" +

                    "Do you want to replan " +
                    affectedPhase.name +
                    " now?"
                );

        }


        // ----------------------------------------------------
        // USER CHOSE NO
        //
        // NO means CANCEL the current planning transaction.
        //
        // Use the SAME transaction rollback mechanism used
        // for unexpected cascade failures.
        //
        // For a normal single-phase run:
        //
        //     stagesChanged = [current phase]
        //
        // so only that phase is restored.
        //
        // For a multi-phase transaction:
        //
        //     stagesChanged = [P1, P2, P3]
        //
        // the whole transaction is restored.
        //
        // The downstream phase has not been modified yet.
        // ----------------------------------------------------

        if(
            affectedPhase &&
            (
                handoffChanged ||
                calendarConflict
            ) &&
            !downstreamReplanRequested
        ){

            const rolledBack =
                rollbackCascadeTransaction(
                    cascadeContext
                );


            if(!rolledBack){

                alert(
                    "Change cannot be cancelled safely.\n\n" +
                    "The previous committed plan could not be restored."
                );

                return result;

            }


            // ------------------------------------------------
            // Restore the phase that originally started
            // this transaction.
            // ------------------------------------------------

            c.treatment.selected_stage_id =
                cascadeContext.rootStageId;


            await syncCurrentCase();


            populatePhases();


            // ------------------------------------------------
            // Refresh the Treatment Plan workspace so the
            // visible target summary immediately reflects
            // the restored CASE.
            // ------------------------------------------------

            await populateTreatment();


            setPlannerStatus(
                "Change cancelled"
            );


            alert(
                "Change cancelled.\n\n" +
                "The previous plan has been restored."
            );


            return result;

        }

        // ----------------------------------------------------
        // USER CHOSE YES
        //
        // The current phase's NEW plan is now accepted.
        // Save it as the new committed rollback point BEFORE
        // moving on to the downstream phase.
        // ----------------------------------------------------

        // ----------------------------------------------------
        // USER CHOSE YES
        //
        // The current phase's NEW plan is now accepted.
        //
        // Save it as the new committed rollback point BEFORE
        // moving on to the downstream phase.
        //
        // If the downstream phase has a calendar conflict,
        // move its start date to the earliest valid date:
        //
        //     previous phase end + 1 day
        //
        // Only AFTER that calendar correction do we invoke
        // the downstream planner.
        // ----------------------------------------------------

        if(
            downstreamReplanRequested
        ){

            saveCommittedStageSnapshot(
                stage,
                cascadeContext.plannerMode
            );


            // ------------------------------------------------
            // The surgeon has explicitly approved propagation
            // to the downstream phase.
            //
            // All nested replans belonging to this transaction
            // now operate in cascade mode.
            // ------------------------------------------------

            cascadeContext.active =
                true;


            const originalSelectedStageId =
                c.treatment.selected_stage_id;


            // ------------------------------------------------
            // Select the affected downstream phase.
            // ------------------------------------------------

            c.treatment.selected_stage_id =
                affectedPhase.id;


            // ------------------------------------------------
            // If the predecessor's new end date creates a
            // calendar conflict, move the downstream phase
            // to the earliest valid start date.
            //
            // IMPORTANT:
            // Do this only AFTER selecting the downstream
            // phase, because getEarliestValidPhaseStartDate()
            // determines the previous phase from the current
            // selection.
            // ------------------------------------------------

            if(
                calendarConflict
            ){
            
                const earliestValidStartDate =
                    getEarliestValidPhaseStartDate();
            
            
                if(
                    earliestValidStartDate
                ){
            
                    const newStartDate =
                        new Date(
                            earliestValidStartDate
                        );
            
            
                    newStartDate.setDate(
                        newStartDate.getDate() +
                        gapDays
                    );
            
            
                    affectedPhase.startDate =
                        formatDateInputValue(
                            newStartDate
                        );
            
                }
            
            }

            // ------------------------------------------------
            // Make the selected phase and any corrected date
            // available to the normal planner workflow.
            // ------------------------------------------------

            await syncCurrentCase();


// --------------------------------------------------------
// *CASCADE REPLAN*
//
// The downstream phase has now been selected and its
// calendar start date has been corrected if necessary.
//
// Pass cascadeContext so the nested planner:
//
//   1. uses the downstream phase's committed start date,
//   2. does NOT reread the root phase's HTML date field,
//   3. remains inside the same transaction,
//   4. can propagate a changed handoff to the next phase.
//
// The downstream phase's planner is therefore the normal
// updateAdjustmentPlan() workflow operating in cascade mode.
// --------------------------------------------------------
try{

    await updateAdjustmentPlan(
        cascadeContext
    );

}

finally{

    c.treatment.selected_stage_id =
        originalSelectedStageId;

    await syncCurrentCase();

}

//---debug


            // ------------------------------------------------
            // The entire downstream cascade has now completed.
            //
            // The nested planner may have changed:
            //
            //     - downstream prescriptions
            //     - downstream end dates
            //     - proposed dates of later unplanned phases
            //
            // Re-populate the Treatment workspace from the
            // final CASE so the visible UI immediately reflects
            // the completed transaction.
            //
            // Only the ROOT transaction should do this.
            // Nested cascade calls must not repeatedly rebuild
            // the Treatment page.
            // ------------------------------------------------

            if(
                isRootTransaction
            ){

                populatePhases();

                await populateTreatment();

                // R1172.1: the complete cascade is now committed.
                // Push the final CASE trajectory into an already-open
                // Three.js viewer without requiring a tab switch.
                refreshThreePrototypeAfterPlanCommit();

            }


            // ------------------------------------------------
            // The entire downstream cascade completed
            // successfully.
            //
            // Preserve its BEFORE state as the one-level
            // Undo transaction.
            // ------------------------------------------------

            if(
                isRootTransaction &&
                earlyStartPreviousPhaseId
            ){
            
                const earlyStartPhase =
                    c.treatment.stages.find(
                        s =>
                            s.id ===
                            earlyStartPreviousPhaseId
                    );
            
                if(
                    earlyStartPhase
                ){
            
                    saveCommittedStageSnapshot(
                        earlyStartPhase,
                        cascadeContext.plannerMode
                    );
            
                }
            
            }

            if(
                isRootTransaction
            ){

                saveUndoTransactionForCurrentMode(

                    captureUndoTransaction(cascadeContext),

                    cascadeContext.plannerMode

                );
            }

            if(
                isRootTransaction
            ){
    
                appendCalendarValidationToPlannerPanel();
    
            }


            // The downstream phase has now been handled by
            // updateAdjustmentPlan().
            //
            // Do not continue processing the original phase
            // as though the downstream replan had not occurred.
            return result;

        }
        // ----------------------------------------------------
        // NO DOWNSTREAM IMPACT
        //
        // The new current-phase plan can be committed directly.
        // ----------------------------------------------------

        if(
            !affectedPhase ||
            affectedPhase.status === "approved"
        ){

            saveCommittedStageSnapshot(
                stage,
                cascadeContext.plannerMode
            );

        }

        if(
            isRootTransaction &&
            earlyStartPreviousPhaseId
        ){
        
            const earlyStartPhase =
                c.treatment.stages.find(
                    s =>
                        s.id ===
                        earlyStartPreviousPhaseId
                );
        
            if(
                earlyStartPhase
            ){
        
                saveCommittedStageSnapshot(
                    earlyStartPhase,
                    cascadeContext.plannerMode
                );
        
            }
        
        }

        if(
            isRootTransaction
        ){

            appendCalendarValidationToPlannerPanel();

        }


        alert(
            "PRESCRIPTION STATE:\n\n" +

            "CURRENT PHASE\n" +
            stage.name +
            "\n" +
            "prescriptionState = " +
            (
                stage.prescriptionState ||
                "current"
            ) +

            "\n\n" +

            "DOWNSTREAM PHASE\n" +

            (
                nextPhase
                    ? (
                        nextPhase.name +
                        "\n" +
                        "prescriptionState = " +
                        (
                            nextPhase.prescriptionState ||
                            "current"
                        )
                    )
                    : "None"
            ) +

            "\n\n" +

            (
                downstreamImpact === "none"
                    ? "No downstream impact."
                    : (
                        affectedPhase
                            ? (
                                "Affected phase: " +
                                affectedPhase.name
                            )
                            : "No mechanical invalidation."
                    )
            )
        );


        await syncCurrentCase();
        if (isRootTransaction) {
            emitCommittedCaseChange("treatment", "adjustment-plan-committed");

            // R1172.1: publish and push the new plan immediately.
            // This also works while the Three.js tab remains visible.
            refreshThreePrototypeAfterPlanCommit();
        }


        // ----------------------------------------------------
        // Render using the ORIGINAL planner result.
        //
        // Do not use phasePrescription here because the
        // renderer does not need to know about the debug
        // separation.
        // ----------------------------------------------------


        const continuousPlan =
            buildContinuousAdjustmentPlanResult(
                c
            );


        renderAdjustmentPlan(
            continuousPlan
        );
setPlannerStatus(
            "Ready"
        );

    }

    
    catch(err){

        // ----------------------------------------------------
        // CASCADE FAILURE
        //
        // If this planner run belongs to an already-approved
        // downstream cascade, restore every phase that was
        // changed during the transaction.
        //
        // A failed cascade must never leave:
        //
        //     P1 = new
        //     P2 = new
        //     P3 = old
        //
        // The entire transaction is rolled back.
        // ----------------------------------------------------

        if(
            cascadeContext &&
            cascadeContext.stagesChanged &&
            cascadeContext.stagesChanged.length > 0
        ){

            const rolledBack =
                rollbackCascadeTransaction(
                    cascadeContext
                );


            if(
                rolledBack
            ){

                await syncCurrentCase();


                // Restore the phase that originally started
                // the cascade.

                c.treatment.selected_stage_id =
                    cascadeContext.rootStageId;


                await syncCurrentCase();


                populatePhases();


                await populateTreatment();

            }

        }


        setPlannerStatus(
            "Planner failed"
        );


        alert(
            err.message ||
            String(err)
        );

    }
    
    
    finally{
        

        hidePlannerOverlay();


        if(button){

            button.disabled = false;

        }

    }


    return result;
}

// ============================================================
// CALENDAR GAP VALIDATION
// ============================================================
//
// Permanent validation helper.
//
// This replaces the temporary CALENDAR CASCADE TEST tool.
// It does not modify CASE or trigger a cascade.
// It only inspects the completed transaction.
//
function runCalendarGapValidation(){

    const c =
        window.currentCase;

    if(
        !c ||
        !c.treatment ||
        !Array.isArray(
            c.treatment.stages
        )
    ){

        return null;

    }


    const undo =
        window.lastUndoTransaction;


    if(!undo){

        return null;

    }


    const rootStage =
        c.treatment.stages.find(
            s =>
                s.id ===
                undo.rootStageId
        ) ||
        null;


    if(!rootStage){

        return null;

    }


    const changedIds =
        Array.isArray(
            undo.stagesChanged
        )
        ?
        undo.stagesChanged
        :
        [];


    const rootIndex =
        c.treatment.stages.findIndex(
            s =>
                s.id ===
                undo.rootStageId
        );


    //
    // Calendar validation concerns the immediate next
    // treatment phase after the root phase.
    //
    // Do NOT derive this from stagesChanged.
    // A downstream phase may be completely unaffected
    // by the transaction and therefore not appear in
    // stagesChanged, while still being the phase whose
    // calendar relationship must be validated.
    //
    const downstreamStage =
        rootIndex >= 0
        ?
        (
            c.treatment.stages[
                rootIndex + 1
            ] ||
            null
        )
        :
        null;


    const downstreamId =
        downstreamStage
        ?
        downstreamStage.id
        :
        null;
        
    //
    // Calendar Test 4 applies only when the immediate
    // downstream phase already has a planned treatment
    // relationship.
    //
    // A future/unplanned phase is not a calendar relationship
    // and must not be treated as a validation failure.
    //
    const downstreamIsPlanned =
        !!(
            downstreamStage &&
            (
                downstreamStage.status === "planned" ||
                downstreamStage.status === "approved"
            )
        );


    if(!downstreamStage){

        return {

            applicable:false,

            pass:true,

            message:
                "TEST 4: NOT APPLICABLE — no downstream phase."

        };

    }


    if(!downstreamIsPlanned){

        return {

            applicable:false,

            pass:true,

            message:
                "TEST 4: NOT APPLICABLE — no planned downstream relationship."

        };

    }


    const originalRoot =
        undo.originalSnapshots[
            undo.rootStageId
        ] ||
        null;


    const originalDownstream =
        downstreamId
        ?
        (
            undo.originalSnapshots[
                downstreamId
            ] ||
            null
        )
        :
        null;



    function dateDiff(
        a,
        b
    ){

        if(!a || !b){

            return null;

        }


        const da =
            parseLocalDate(a);

        const db =
            parseLocalDate(b);


        if(!da || !db){

            return null;

        }


        let days = 0;

        const cursor =
            new Date(da);


        while(
            cursor < db
        ){

            cursor.setDate(
                cursor.getDate() + 1
            );

            days++;

        }


        while(
            cursor > db
        ){

            cursor.setDate(
                cursor.getDate() - 1
            );

            days--;

        }


        return days;

    }


    function expectedEnd(
        stage
    ){

        if(
            !stage ||
            !stage.startDate ||
            !stage.prescription ||
            !Array.isArray(
                stage.prescription.strut_array
            ) ||
            stage.prescription.strut_array.length < 2
        ){

            return null;

        }


        const d =
            parseLocalDate(
                stage.startDate
            );


        if(!d){

            return null;

        }


        d.setDate(
            d.getDate() +
            stage.prescription.strut_array.length -
            2
        );


        return formatDateInputValue(d);

    }


    function rowCount(
        stage
    ){

        return (
            stage &&
            stage.prescription &&
            Array.isArray(
                stage.prescription.strut_array
            )
        )
        ?
        stage.prescription.strut_array.length
        :
        0;

    }


    const originalEnd =
        originalRoot
        ?
        originalRoot.endDate
        :
        null;


    const originalP2Start =
        originalDownstream &&
        originalDownstream.startDate
        ?
        originalDownstream.startDate
        :
        downstreamStage.startDate;


    let originalGap =
        null;


    if(
        originalEnd &&
        originalP2Start
    ){

        const d =
            parseLocalDate(
                originalEnd
            );


        if(d){

            d.setDate(
                d.getDate() + 1
            );


            originalGap =
                dateDiff(
                    formatDateInputValue(d),
                    originalP2Start
                );

        }

    }


    const requiredDate =
        rootStage.endDate
        ?
        parseLocalDate(
            rootStage.endDate
        )
        :
        null;


    if(requiredDate){

        requiredDate.setDate(
            requiredDate.getDate() + 1
        );

    }


    const requiredStart =
        requiredDate
        ?
        formatDateInputValue(
            requiredDate
        )
        :
        null;


    const preserve =
        PRESERVE_CALENDAR_GAP;


    //
    // When preserving the gap, we need the original
    // downstream relationship. If there was no downstream
    // change in this transaction, there is no independent
    // original-gap snapshot to validate against.
    //
    if(
        preserve &&
        originalGap === null
    ){

        return {

            applicable:false,

            pass:true,

            message:
                "No downstream calendar change — preserved-gap test not applicable.",

            preserve,

            requiredStart,

            actualStart:
                downstreamStage.startDate

        };

    }


    let expectedStart =
        requiredStart;


    if(
        preserve &&
        originalGap !== null &&
        expectedStart
    ){

        const d =
            parseLocalDate(
                expectedStart
            );


        d.setDate(
            d.getDate() +
            originalGap
        );


        expectedStart =
            formatDateInputValue(d);

    }


    const actualStart =
        downstreamStage.startDate;


    const actualDate =
        parseLocalDate(
            actualStart
        );


    const expectedDate =
        parseLocalDate(
            expectedStart
        );


    const originalStartDate =
        parseLocalDate(
            originalP2Start
        );


    //
    // For preserveCalendarGap = false:
    //
    // If the original downstream start is still valid
    // after the new upstream plan, P2 must remain exactly
    // where it was.
    //
    // If the new upstream plan reaches into P2's original
    // start, P2 must be pushed to the next day after the
    // new upstream end.
    //
    const pushRequired =
        !preserve &&
        originalStartDate &&
        requiredDate &&
        originalStartDate <
            requiredDate;


    const falsePolicyExpectedStart =
        pushRequired
        ?
        requiredStart
        :
        originalP2Start;

    const policyExpectedStart =
        preserve
        ?
        expectedStart
        :
        falsePolicyExpectedStart;

    const actualDateForCheck =
        parseLocalDate(
            actualStart
        );


    const expectedDateForCheck =
        parseLocalDate(
            policyExpectedStart
        );


    const startIsValid =
        !!(
            actualDateForCheck &&
            expectedDateForCheck &&
            actualDateForCheck.getTime() ===
            expectedDateForCheck.getTime()
        );


    const actualGap =
        rootStage.endDate &&
        actualStart
        ?
        dateDiff(
            rootStage.endDate,
            actualStart
        ) - 1
        :
        null;


    const gapIsValid =
        preserve
        ?
        actualGap ===
            originalGap
        :
        true;
        
    const noOverlap =
        !!(
            actualDateForCheck &&
            requiredDate &&
            actualDateForCheck >=
            requiredDate
        );


    const rows =
        rowCount(
            downstreamStage
        );


    const prescriptionExists =
        rows > 1;


    const datesConsistent =
        downstreamStage.endDate ===
        expectedEnd(
            downstreamStage
        );


    const recoveredStateExists =
        !!downstreamStage.recoveredFinalState;


    let prescriptionRegenerated =
        true;


    if(
        originalDownstream &&
        originalDownstream.prescription &&
        downstreamStage.prescription
    ){

        const oldRows =
            Array.isArray(
                originalDownstream
                    .prescription
                    .strut_array
            )
            ?
            originalDownstream
                .prescription
                .strut_array
                .length
            :
            0;


        prescriptionRegenerated =
            rows > 0 &&
            rows !== oldRows;

    }


    //
    // A same-row prescription is not necessarily a failure:
    // a valid replan can theoretically produce the same number
    // of rows. Therefore, only require existence here.
    //
    const pass =
        startIsValid &&
        gapIsValid &&
        noOverlap &&
        prescriptionExists &&
        datesConsistent &&
        recoveredStateExists;


    return {

        applicable:true,

        pass,

        preserve,

        pushRequired,

        rootName:
            rootStage.name,

        downstreamName:
            downstreamStage.name,

        originalEnd,

        currentEnd:
            rootStage.endDate,

        originalP2Start,

        originalGap,

        requiredStart,

        expectedStart:
            policyExpectedStart,

        actualStart,

        actualGap,

        prescriptionRows:
            rows,

        startIsValid,

        gapIsValid,

        noOverlap,

        prescriptionExists,

        datesConsistent,

        recoveredStateExists,

        prescriptionRegenerated

    };

}

function appendCalendarValidationToPlannerPanel(){

    const validation =
        runCalendarGapValidation();


    if(!validation){

        return;

    }


    if(
        validation.applicable
    ){
    
        window.__validationResults.calendar =
            validation;
    
    }
    else{
    
        delete
            window.__validationResults.calendar;
    
    }

    updateValidationSummary();


    const panel =
        document.getElementById(
            "plannerValidationInspector"
        );


    if(!panel){

        return;

    }


    let text =
        panel.textContent ||
        "";


    text +=
        "\n\n" +
        "────────────────────────────────\n\n" +
        "Test 4: Calendar Gap Integrity\n\n";


    if(
        !validation.applicable
    ){
    
        //
        // Test 4 is not part of this transaction.
        // Remove any previous Test 4 display so that
        // an old result cannot remain visible.
        //
    
        const marker =
            "────────────────────────────────\n\n" +
            "Test 4: Calendar Gap Integrity\n\n";
    
    
        const markerIndex =
            text.indexOf(
                marker
            );
    
    
        if(
            markerIndex >= 0
        ){
    
            text =
                text.substring(
                    0,
                    markerIndex
                ).trimEnd();
    
        }
    
    
        panel.textContent =
            text;
    
        return;
    
    }
    
    let quickResult =
        "";
    
    
    if(
        validation.preserve
    ){
    
        quickResult =
            "PRESERVE GAP — final gap remains " +
            (
                validation.actualGap === null
                ?
                "—"
                :
                validation.actualGap +
                " day(s)"
            ) +
            ".";
    
    }
    else if(
        validation.pushRequired
    ){
    
        quickResult =
            "PUSH — downstream moved to the next day " +
            "after upstream. Final gap = " +
            (
                validation.actualGap === null
                ?
                "—"
                :
                validation.actualGap +
                " day(s)"
            ) +
            ".";
    
    }
    if(
        validation.preserve
    ){
    
        quickResult =
            "PRESERVE GAP — final gap remains " +
            (
                validation.actualGap === null
                ?
                "—"
                :
                validation.actualGap +
                " day(s)"
            ) +
            ".";
    
    }
    else if(
        validation.pushRequired
    ){
    
        if(
            validation.actualStart ===
            validation.requiredStart
        ){
    
            quickResult =
                "PUSH — downstream moved to the required date. " +
                "Final gap = " +
                (
                    validation.actualGap === null
                    ?
                    "—"
                    :
                    validation.actualGap +
                    " day(s)"
                ) +
                ".";
    
        }
        else if(
            validation.originalP2Start &&
            validation.actualStart &&
            parseLocalDate(
                validation.actualStart
            ) <
            parseLocalDate(
                validation.originalP2Start
            )
        ){
    
            quickResult =
                "PUSH EXPECTED — downstream moved earlier unexpectedly.";
    
        }
        else{
    
            quickResult =
                "PUSH EXPECTED — downstream did not move to required date.";
    
        }
    
    }
    else{
    
        if(
            validation.actualStart ===
            validation.originalP2Start
        ){
    
            quickResult =
                "NO PULL — downstream stayed at original date.";
    
        }
        else if(
            validation.originalP2Start &&
            validation.actualStart &&
            parseLocalDate(
                validation.actualStart
            ) <
            parseLocalDate(
                validation.originalP2Start
            )
        ){
    
            quickResult =
                "NO PULL EXPECTED — downstream moved earlier unexpectedly.";
    
        }
        else{
    
            quickResult =
                "NO PULL EXPECTED — downstream moved unexpectedly.";
    
        }
    
    }

    text +=
        "QUICK RESULT:\n" +
        quickResult +
        "\n\n" +
        "Detailed validation:\n\n";


    text +=
        "DEBUG — original P2 start used: " +
        (
            validation.originalP2Start ||
            "—"
        ) +
        "\n\n" +
    
        "DEBUG — required P2 start: " +
        (
            validation.requiredStart ||
            "—"
        ) +
        "\n\n" +
    
        "DEBUG — actual P2 start: " +
        (
            validation.actualStart ||
            "—"
        ) +
        "\n\n" +
    
        "DEBUG — pushRequired: " +
        String(
            validation.pushRequired
        ) +
        "\n\n";


    text +=
        "Policy: preserveCalendarGap = " +
        validation.preserve +
        "\n\n" +

        "Root phase: " +
        validation.rootName +
        "\n\n" +

        "Downstream phase: " +
        validation.downstreamName +
        "\n\n" +

        "Upstream final end: " +
        (
            validation.currentEnd ||
            "—"
        ) +
        "\n\n" +

        "Original downstream start: " +
        (
            validation.originalP2Start ||
            "—"
        ) +
        "\n\n" +

        "Original gap: " +
        (
            validation.preserve
            ?
            (
                validation.originalGap === null
                ?
                "—"
                :
                validation.originalGap +
                " day(s)"
            )
            :
            "not used"
        ) +
        "\n\n" +

        "Required earliest start: " +
        (
            validation.requiredStart ||
            "—"
        ) +
        "\n\n" +

        "Expected downstream start: " +
        (
            validation.expectedStart ||
            "—"
        ) +
        "\n\n" +

        "Actual downstream start: " +
        (
            validation.actualStart ||
            "—"
        ) +
        "\n\n" +

        "Final gap: " +
        (
            validation.actualGap === null
            ?
            "—"
            :
            validation.actualGap +
            " day(s)"
        ) +
        "\n\n" +

        "Start-date check: " +
        (
            validation.startIsValid
            ?
            "PASS"
            :
            "FAIL"
        ) +
        "\n\n" +

        "Gap check: " +
        (
            validation.gapIsValid
            ?
            "PASS"
            :
            "FAIL"
        ) +
        "\n\n" +

        "No-overlap check: " +
        (
            validation.noOverlap
            ?
            "PASS"
            :
            "FAIL"
        ) +
        "\n\n" +

        "Prescription exists: " +
        (
            validation.prescriptionExists
            ?
            "PASS"
            :
            "FAIL"
        ) +
        "\n\n" +

        "Start/end dates consistent: " +
        (
            validation.datesConsistent
            ?
            "PASS"
            :
            "FAIL"
        ) +
        "\n\n" +

        "Recovered final state exists: " +
        (
            validation.recoveredStateExists
            ?
            "PASS"
            :
            "FAIL"
        ) +
        "\n\n" +

        "Result: " +
        (
            validation.pass
            ?
            "PASS"
            :
            "FAIL"
        );


    panel.textContent =
        text;

}


// ============================================================
// DEVELOPER FRAMEWORK
// ============================================================


// R880 — refresh the cached Inspector in place and reset its actual scroll area when requested.
function updateCurrentCaseInspector(options = {}){
    const panel = document.getElementById("currentCaseInspector");
    if(!panel) return { found:false, scrollTargets:[] };

    const previousScrollTop = panel.scrollTop;
    panel.textContent = JSON.stringify(window.currentCase, null, 2);
    const reset = options.resetScroll === true;
    panel.scrollTop = reset ? 0 : previousScrollTop;

    // The <pre> may not be the element that owns scrolling. Reset scrollable
    // ancestors inside this Inspector's own card, but do not scroll the whole page.
    const scrollTargets = [];
    if(reset){
        let node = panel.parentElement;
        const card = panel.closest(".developerPanel");
        while(node){
            const style = window.getComputedStyle(node);
            const overflowY = style.overflowY;
            const isScrollable = (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") && node.scrollHeight > node.clientHeight;
            if(isScrollable){
                node.scrollTop = 0;
                scrollTargets.push({element:node.id || node.className || node.tagName, scrollTop:node.scrollTop});
            }
            if(node === card) break;
            node = node.parentElement;
        }
        // Re-apply after text/layout has been recalculated.
        requestAnimationFrame(() => {
            panel.scrollTop = 0;
            let parent = panel.parentElement;
            while(parent){
                const style = window.getComputedStyle(parent);
                const overflowY = style.overflowY;
                if((overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") && parent.scrollHeight > parent.clientHeight){
                    parent.scrollTop = 0;
                }
                if(parent === card) break;
                parent = parent.parentElement;
            }
        });
    }
    return { found:true, panelScrollTop:panel.scrollTop, reset, scrollTargets };
}

function updateWorkspaceManagerInspector(){

    if(!window.WorkspaceManager){

        return;

    }

    const snapshot = {

        currentWorkspace:

            WorkspaceManager.currentWorkspace,

        registered:

            Object.keys(
                WorkspaceManager.registry
            ),

        "@statistics":{

            cachedWorkspaces:

                Object.keys(
                    WorkspaceManager.domCache
                ).length,

            totalElements:0,

            totalHtmlLength:0

        },

        domCache:{},

        state:

            WorkspaceManager.state

    };

    for(

        const [name,node]

        of Object.entries(
            WorkspaceManager.domCache
        )

    ){

        const elements =

            node.querySelectorAll("*").length;

        const htmlLength =

            node.innerHTML.length;

        snapshot.domCache[name]={

            "@elements":elements,

            "@htmlLength":htmlLength

        };

        snapshot["@statistics"].totalElements +=

            elements;

        snapshot["@statistics"].totalHtmlLength +=

            htmlLength;

    }

    const panel =

        document.getElementById(
            "workspaceManagerInspector"
        );

    if(panel){

        panel.textContent =

            JSON.stringify(
                snapshot,
                null,
                2
            );

    }

}

async function refreshDeveloperDashboard(){
    updateCurrentCaseInspector();
    updateWorkspaceManagerInspector();
}


window.DeveloperErrors = {

    history: [],

    report(info){

        info = info || {};

        //
        // Validate required fields
        //
        const required = [
            "workspace",
            "stage",
            "error"
        ];

        for(const field of required){

            if(!(field in info)){

                alert(
                    "DeveloperErrors misuse\n\n" +
                    "Missing required field:\n\n" +
                    field
                );

                return;

            }

        }

        //
        // Normalise fields
        //
        const workspace =
            info.workspace;

        const stage =
            info.stage;

        const error =
            info.error;

        const source =
            info.source;

        const severity =
            info.severity;

        const recovery =
            info.recovery;

        const suggestion =
            info.suggestion;

        const timestamp =
            info.timestamp ||
            Date.now();

        //
        // Build message
        //
        const message =

            error?.message ??

            String(error);

        //
        // Save history
        //
        this.history.push({

            timestamp,

            workspace,

            stage,

            source,

            severity,

            recovery,

            suggestion,

            message,

            error

        });

        //
        // Popup
        //
        let text =
            "Developer Error\n\n";

        text +=
            "Workspace\n" +
            workspace +
            "\n\n";

        text +=
            "Stage\n" +
            stage +
            "\n\n";

        if(source){

            text +=
                "Source\n" +
                source +
                "\n\n";

        }

        if(severity){

            text +=
                "Severity\n" +
                severity +
                "\n\n";

        }

        text +=
            "Message\n" +
            message +
            "\n\n";

        if(recovery){

            text +=
                "Recovery\n";

            if(recovery.action){

                text +=
                    recovery.action +
                    "\n";

            }

            if(recovery.previousWorkspace){

                text +=
                    "Previous workspace : " +
                    recovery.previousWorkspace +
                    "\n";

            }

            text +=
                "\n";

        }

        if(suggestion){

            text +=
                "Suggestion\n" +
                suggestion +
                "\n\n";

        }

        alert(text);

    }

};