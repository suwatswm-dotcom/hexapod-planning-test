let currentPlanningWorkspace = "treatmentSimWorkspace";


async function initializeTreatmentWorkspace(){

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
        "treatmentSimTab"
    ).onclick =
        function(){

            showPlanningWorkspace(
                "treatmentSimWorkspace"
            );

        };


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

    currentPlanningWorkspace = id;
    
    if(id === "treatmentSimWorkspace"){
        ensureTreatmentSimulationLoaded();
    }

    const workspaces = [
        "treatmentSimWorkspace",
        "strutAdjustmentWorkspace",
        "strutSwapCalendarWorkspace",
        "threePrototypeWorkspace"
    ];

    const tabs = {
        treatmentSimWorkspace:
            "treatmentSimTab",

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
            
                    // R915: this SPA workspace can be cached after a case change.
                    // Ensure the current CASE has its default Phase 1 and refresh all
                    // summaries and adjustment rows from that CASE on every entry.
                    const c =
                        await initializeTreatmentIfNeeded();
                    
                    showPlanningWorkspace(
            
                        state?.selectedWorkspace ||
            
                        "treatmentSimWorkspace"
            
                    );

                    await populateTreatment();
            
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
            
            
                    populateResidualSummary(
                        "tp_residual",
                        stage.target,
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
if (!window.WorkspaceManager) {
    window.onload = initializeTreatmentWorkspace;
}

