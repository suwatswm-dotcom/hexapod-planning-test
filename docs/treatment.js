let currentPlanningWorkspace = "strutAdjustmentWorkspace";


function updatePlannerModeNotice(){
    const box=document.getElementById("plannerModeNotice");
    const title=document.getElementById("plannerModeNoticeTitle");
    const text=document.getElementById("plannerModeNoticeText");
    if(!box||!title||!text)return;
    const mode=String(window.APP_CONFIG?.planner?.mode||"STRICT_JS").toUpperCase();
    if(mode==="PYTHON_COMPAT"){
        box.style.borderColor="#c58b32";
        box.style.borderLeftColor="#c58b32";
        box.style.background="#fff8e8";
        box.style.color="#5d4215";
        title.textContent="R1172.9.5 · TEMPORARY PREVIEW SCHEDULE MODE";
        text.textContent="Normal Planning generates legacy fixed-duration daily rows for animation and engineering review. It does not enforce the strict JavaScript daily movement limits or establish target completion. Do not use preview schedules as approved patient prescriptions.";
    }else{
        box.style.borderColor="#3b82a0";
        box.style.borderLeftColor="#3b82a0";
        box.style.background="#eef8fc";
        box.style.color="#17445a";
        title.textContent="R1172.9.5 · STRICT BROWSER PLANNER";
        text.textContent="Normal Planning uses the completion-driven browser JavaScript planner. Actual daily movement is checked against configured mechanical limits; target completion is evaluated separately. Planner output still requires appropriate clinical review and approval.";
    }
}

async function initializeTreatmentWorkspace(){

    updatePlannerModeNotice();

    const c =
        await initializeTreatmentIfNeeded();
        
    const stage =
        currentStage();

    const startDate =
        document.getElementById(
            "tp_start_date"
        );

    if(startDate && stage){

        let changed = false;

        // ----------------------------------------------------
        // Phase 1 migration / default
        // ----------------------------------------------------
        //
        // Older data may still have the treatment-level
        // start_date. Move that value into Phase 1.
        //
        if(
            !stage.startDate &&
            c.treatment.start_date &&
            getCurrentPhaseIndex() === 0
        ){

            stage.startDate =
                c.treatment.start_date;

            changed = true;

        }


        // ----------------------------------------------------
        // If this phase already has a start date, show it.
        // ----------------------------------------------------

        if(stage.startDate){

            startDate.value =
                stage.startDate;

        }


        // ----------------------------------------------------
        // Phase 1 with no date:
        // default to today.
        // ----------------------------------------------------

        else if(
            getCurrentPhaseIndex() === 0
        ){

            const today =
                new Date();

            startDate.value =
                formatDateInputValue(
                    today
                );

        }


        // ----------------------------------------------------
        // Later phase with no date:
        //
        // Default to the earliest valid date
        // (previous phase end + 1 day).
        //
        // Surgeon can change this to a later date.
        // ----------------------------------------------------

        else{

            const earliestDate =
                getEarliestValidPhaseStartDate();

            if(earliestDate){

                startDate.value =
                    formatDateInputValue(
                        earliestDate
                    );

            }
            else{

                startDate.value = "";

            }

        }

        if(changed){

            await syncCurrentCase();

        }

    }


    await populateTreatment();
    await window.PrescriptionVerificationImport?.renderStatus();

    const verificationFileInput = document.getElementById("verificationPrescriptionFile");
    const verificationImportStatus = document.getElementById("verificationPrescriptionImportStatus");
    if(verificationFileInput){
        verificationFileInput.addEventListener("change", async function(){
            const file = this.files && this.files[0];
            if(!file) return;
            this.disabled = true;
            if(verificationImportStatus) verificationImportStatus.textContent = "Reading and validating " + file.name + "…";
            try{
                const result = await window.PrescriptionVerificationImport.importFile(file);
                await window.PrescriptionVerificationImport.renderStatus();
                if(verificationImportStatus){
                    verificationImportStatus.textContent = "Imported " + result.rowCount + " rows: Day 0 + " + result.daysNeeded + " correction days. Select Prescription Verification and click Update Adjustment Plan to run FK verification.";
                }
            }catch(error){
                if(verificationImportStatus) verificationImportStatus.textContent = "Import failed: " + (error && error.message ? error.message : String(error));
            }finally{
                this.disabled = false;
                this.value = "";
            }
        });
    }
    const clearVerificationButton = document.getElementById("clearVerificationPrescriptionButton");
    if(clearVerificationButton){
        clearVerificationButton.addEventListener("click", async function(){
            try{
                await window.PrescriptionVerificationImport.clearImportedPrescription();
                await window.PrescriptionVerificationImport.renderStatus();
                if(verificationImportStatus) verificationImportStatus.textContent = "Using the built-in verification prescription.";
            }catch(error){
                if(verificationImportStatus) verificationImportStatus.textContent = "Could not clear imported prescription: " + (error && error.message ? error.message : String(error));
            }
        });
    }

    const plannerModeRadios =
        document.querySelectorAll(
            'input[name="planner_mode"]'
        );
    
    plannerModeRadios.forEach(
        radio => {
    
            radio.addEventListener(
                "change",
                async function(){
    
                    if(!this.checked){
                        return;
                    }
    
                    const c =
                        await ensureCurrentCase();
    
                    if(!c.metadata){
                        c.metadata = {};
                    }
    
                    c.metadata.planner =
                        this.value;
    
                    if (typeof window.noteCaseCommitted === "function") window.noteCaseCommitted("treatment planner-mode selection");
                    if (typeof window.CaseChangeCoordinator?.emit === "function") {
                        window.CaseChangeCoordinator.emit({
                            domain: "case", operation: "update", source: "treatment",
                            reason: "planner-mode-selection"
                        });
                    }
                    // R1172.9.18: activate this mode's isolated Undo state,
                    // then rebuild the treatment schedule and viewer together.
                    if(typeof window.activateUndoTransactionForMode === "function"){
                        window.activateUndoTransactionForMode(this.value);
                    }
                    await populateTreatment();
                    await window.PrescriptionVerificationImport?.renderStatus();
                    if(typeof window.refreshThreePrototypeAfterPlanCommit === "function"){
                        refreshThreePrototypeAfterPlanCommit();
                    }
                    updateCurrentCaseInspector();
    
                }
            );
    
        }
    );

    const edit =
        document.getElementById(
            "currentPhaseLink"
        );

    if(edit){

        edit.onclick =
            async function(){

                await WorkspaceManager.show(
                    "phases"
                );

            };

    }
document.getElementById(
        "strutAdjustmentTab"
    ).onclick =
        function(){

            showPlanningWorkspace(
                "strutAdjustmentWorkspace"
            );

        };


    document.getElementById(
        "strutSwapCalendarTab"
    ).onclick =
        function(){

            showPlanningWorkspace(
                "strutSwapCalendarWorkspace"
            );

        };


    document.getElementById(
        "threePrototypeTab"
    ).onclick =
        function(){

            showPlanningWorkspace(
                "threePrototypeWorkspace"
            );

        };


    document.getElementById(
        "updateAdjustmentPlanButton"
    ).onclick =
        async function(){

            await updateAdjustmentPlan();

        };


    document.getElementById(

        "approvePlanButton"

    ).onclick =

        async function(){

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

            // ----------------------------------------------------

            // The adjustment plan belongs to the CURRENT PHASE.

            // ----------------------------------------------------

            const plan =

                stage.prescription;

            if(

                !plan ||

                !Array.isArray(

                    plan.strut_array

                ) ||

                plan.strut_array.length < 2

            ){

                alert(

                    "Please generate an Adjustment Plan before approving."

                );

                return;

            }

            const dateValidation =

                validateCurrentPhaseStartDate();

            if(!dateValidation.valid){

                alert(

                    dateValidation.message

                );

                return;

            }

            const plannedEnd =

                getCurrentPhasePlannedEndDate(c);

            if(!plannedEnd){

                alert(

                    "The planned end date could not be determined."

                );

                return;

            }

            // ----------------------------------------------------

            // Freeze the actual starting bone state for this phase.

            //

            // Phase 1:

            //     current case deformity

            //

            // Later phases:

            //     existing phase startBoneState is preserved.

            //

            // Sequential pose inheritance will be connected

            // separately when we implement Phase 2.

            // ----------------------------------------------------

            if(!stage.startBoneState){

                if(

                    getCurrentPhaseIndex() === 0 &&

                    c.deformity

                ){

                    stage.startBoneState =

                        structuredClone(

                            c.deformity

                        );

                }

            }

            // ----------------------------------------------------

            // Freeze the generated prescription into this phase.

            // ----------------------------------------------------

            stage.prescription =

                structuredClone(

                    plan

                );

            stage.duration =

                plan.days_needed ??

                (

                    plan.strut_array.length - 1

                );

            // ----------------------------------------------------

            // These dates now belong to THIS PHASE.

            // ----------------------------------------------------

            stage.endDate =

                formatDateInputValue(

                    plannedEnd

                );

            stage.status =

                "approved";

            stage.approvedAt =

                new Date().toISOString();

            await syncCurrentCase();
            if (typeof window.CaseChangeCoordinator?.emit === "function") {
                window.CaseChangeCoordinator.emit({
                    domain: "case", operation: "update", source: "treatment",
                    reason: "phase-plan-approval"
                });
            }

            alert(

                (stage.name || "Current phase") +

                " approved.\n\n" +

                "Start: " +

                stage.startDate +

                "\n" +

                "End: " +

                stage.endDate

            );

            populateTreatment();

        };
}

function showPlanningWorkspace(id){

    // R1172.0: pause playback when leaving the Three.js tab, but keep the
    // iframe mounted so its day, camera and display settings remain intact.
    if(currentPlanningWorkspace === "threePrototypeWorkspace" && id !== "threePrototypeWorkspace"){
        const viewerFrame = document.getElementById("threePrototypeFrame");
        if(viewerFrame && viewerFrame.contentWindow && viewerFrame.dataset.viewerLoaded === "true"){
            viewerFrame.contentWindow.postMessage(
                { type: "threePrototypePause" },
                window.location.origin
            );
        }
    }

    if(id === "treatmentSimWorkspace") id = "strutAdjustmentWorkspace";
    currentPlanningWorkspace = id;

    const workspaces = [
        "strutAdjustmentWorkspace",
        "strutSwapCalendarWorkspace",
        "threePrototypeWorkspace"
    ];

    const tabs = {
        strutAdjustmentWorkspace:
            "strutAdjustmentTab",

        strutSwapCalendarWorkspace:
            "strutSwapCalendarTab",

        threePrototypeWorkspace:
            "threePrototypeTab"
    };

    for(const workspace of workspaces){

        const area =
            document.getElementById(workspace);

        if(area){

            area.style.display =
                workspace === id
                ? "block"
                : "none";

        }

        const button =
            document.getElementById(
                tabs[workspace]
            );

        if(button){

            button.classList.toggle(
                "selectedTab",
                workspace === id
            );
        }
    }

    if(id === "threePrototypeWorkspace"){
        if(typeof loadThreePrototypeFromTreatment === "function"){
            loadThreePrototypeFromTreatment();
        }else{
            const status = document.getElementById("threePrototypeStatus");
            if(status){
                status.textContent = "Three.js handoff unavailable: shared.js did not expose loadThreePrototypeFromTreatment().";
            }
        }
    }
}



// Register only when running under the SPA host.
if (window.WorkspaceManager) {

    WorkspaceManager.register(
        "treatment",
        {
            initialize:
                initializeTreatmentWorkspace,

            enter:
                async function(firstVisit,state){
            
                    // IMPORTANT — TREATMENT DOM / SCROLL-PERSISTENCE RULE:
                    // Do NOT call populateTreatment() from enter(), including when
                    // returning after a case/workspace change. populateTreatment()
                    // rebuilds the Adjustment Plan DOM; that destroys the persistent
                    // planner scroll container and loses its selected scroll position.
                    // initializeTreatmentWorkspace() owns the initial population.
                    // On later entries, refresh CASE-derived fields and summaries
                    // below without rebuilding the Adjustment Plan.
                    // Keep this rule if adding new CASE refresh behaviour here.
                    const c =
                        await initializeTreatmentIfNeeded();
                    
                    showPlanningWorkspace(
            
                        (state?.selectedWorkspace === "treatmentSimWorkspace" ? "strutAdjustmentWorkspace" : state?.selectedWorkspace) ||
            
                        "strutAdjustmentWorkspace"
            
                    );

                    // Do not populate/rebuild the Treatment DOM here.
                    // See the persistence warning above. The lightweight CASE-derived
                    // UI refresh below is intentional and preserves the planner DOM.
            
                    const stage =
                        currentStage();
            
                    if(!stage){
            
                        return;
            
                    }
            
            
                    renderCurrentPhase();
            
            
                    populateTargetSummary(
                        "phase_target_summary",
                        stage.target
                    );
setText(
                        "tp_phase_name",
                        stage.name
                    );
            
            
                    const startDateInput =
                        document.getElementById(
                            "tp_start_date"
                        );
                    
                    if(startDateInput){
                    
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
  
                    const plannerMode =
                        c?.metadata?.planner ||
                        "normal";

                    const plannerRadio =
                        document.querySelector(
                            `input[name="planner_mode"][value="${plannerMode}"]`
                        );

                    if(plannerRadio){

                        plannerRadio.checked =
                            true;

                    }  
  
            
                },
            
            leave:
                async function(){
            
                    return{
                    
                        selectedWorkspace:
                    
                            currentPlanningWorkspace,
                    
                    
                    };
            
                }
        }
    );

}
// Temporary compatibility while MPA still exists.
if (window.location.pathname !== "/app") {
    window.onload = initializeTreatmentWorkspace;
}

