async function initializeReportsWorkspace(){
    
    
}


// Register only when running under the SPA host.
if (window.WorkspaceManager) {

    WorkspaceManager.register(
        "reports",
        {
            initialize:
                initializeReportsWorkspace,

            enter:
                async function(){},

            leave:
                async function(){}
        }
    );

}

// Temporary compatibility while MPA still exists.
if (!window.WorkspaceManager) {
    window.onload = initializeReportsWorkspace;
}
