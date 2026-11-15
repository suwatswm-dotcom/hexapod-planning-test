async function initializePhasesWorkspace(){

    await populatePhases();

    initializePhaseEditor();

    initializeWorkflowButtons();

}

function refreshPhasesWorkflow(){

    populateTreatment();

}



// Register only when running under the SPA host.
if (window.WorkspaceManager) {

    WorkspaceManager.register(
        "phases",
        {
            initialize:
                initializePhasesWorkspace,

            enter:
                async function(){
                    // R916: the SPA may retain this workspace between cases.
                    // Re-render its tabs and editor from the current CASE on every entry.
                    await populatePhases();
                },

            leave:
                async function(){}
        }
    );

}

// Temporary compatibility while MPA still exists.
if (!window.WorkspaceManager) {
    window.onload = initializePhasesWorkspace;
}