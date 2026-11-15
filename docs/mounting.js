function initializeMountingWorkspace(){

    populateMounting();
    initializeWorkflowButtons();

    // detect .onchange, .onblur and commit change
    bindWorkspaceInputs(commitMounting, "workspace_mounting");


}

// Register only when running under the SPA host.
if (window.WorkspaceManager) {

    WorkspaceManager.register(
        "mounting",
        {
            initialize:
                initializeMountingWorkspace,

            enter:
                async function(){
                    populateMounting();
                },

            leave:
                async function(){}
        }
    );

}

// Temporary compatibility while MPA still exists.
if (!window.WorkspaceManager) {
    window.onload = initializeMountingWorkspace;
}
