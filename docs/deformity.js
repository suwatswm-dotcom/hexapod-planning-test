function initializeDeformityWorkspace(){

    populateDeformity();
    initializeWorkflowButtons();

    document.getElementById("loc_enabled").onchange=function(){
    document.getElementById("locSection").style.display=this.checked?"block":"none";
    };
    
    // detect .onchange, .onblur and commit change
    bindWorkspaceInputs(commitDeformity, "workspace_deformity");

    document.getElementById(
        "loc_enabled"
    ).onchange = async function(){
    
        document.getElementById(
            "locSection"
        ).style.display =
            this.checked
            ? "block"
            : "none";
    
        await commitDeformity();
    
    };    

}

// Register only when running under the SPA host.
if (window.WorkspaceManager) {

    WorkspaceManager.register(
        "deformity",
        {
            initialize:
                initializeDeformityWorkspace,

            enter:
                async function(){
                    populateDeformity();
                },
                
            leave:
                async function(){}
        }
    );

}

// Temporary compatibility while MPA still exists.
if (!window.WorkspaceManager) {
    window.onload = initializeDeformityWorkspace;
}




