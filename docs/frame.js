async function initializeFrameWorkspace(){

    await ensureCurrentCase();
    populateFrame();
    initializeWorkflowButtons();

    // detect .onchange, .onblur and commit change
    bindWorkspaceInputs(commitFrame, "workspace_frame");


}

// Register only when running under the SPA host.
if (window.WorkspaceManager) {

    WorkspaceManager.register(
        "frame",
        {
            initialize:
                initializeFrameWorkspace,

            enter:
                async function(){
                    // R916: restore form controls from the current CASE whenever
                    // this cached SPA workspace is entered (including after New Case).
                    await populateFrame();
                },

            leave:
                async function(){}
        }
    );

}

// Temporary compatibility while MPA still exists.
if (!window.WorkspaceManager) {
    window.onload = initializeFrameWorkspace;
}

