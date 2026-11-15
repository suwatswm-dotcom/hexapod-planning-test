"use strict";

/*=========================================================
    Workspace Manager
=========================================================*/

window.WorkspaceManager = {

    currentWorkspace : null,

    registry : {},

    domCache : {},

    // R887: one in-flight initialization per workspace, shared by navigation and background callers.
    _initializationPromises : {},

    state : {

        patient:{},
        frame:{},
        xray:{},
        deformity:{},
        mounting:{},
        phases:{},
        treatment:{},
        reports:{}

    },

    // Static workspace files are the only workspace source in this build.
    staticFiles : {
        patient: "patient_workspace.html",
        frame: "frame_workspace.html",
        xray: "xray_reconstruction_workspace.html",
        deformity: "deformity_workspace.html",
        mounting: "mounting_workspace.html",
        phases: "phases_workspace.html",
        treatment: "treatment_workspace.html",
        reports: "reports_workspace.html"
    },

    getWorkspaceUrl(name) {
        const file = this.staticFiles[name];
        if (!file) throw new Error("No static HTML file is registered for workspace: " + name);
        return window.appAssetUrl ? window.appAssetUrl(file) : new URL(file, document.baseURI).href;
    },

    register(name,callbacks){

        this.registry[name] = callbacks;

    },

    // R887: initialize/cache a workspace without changing currentWorkspace or visibility.
    // Concurrent show() and background calls share the same HTML-load/initialize operation.
    async ensureInitialized(name){
        if (this._initializationPromises[name]) {
            await this._initializationPromises[name];
            return false;
        }

        const ws = this.registry[name];
        if (this.domCache[name] && (!ws || ws.initialized)) return false;

        const task = (async () => {
            const host = document.getElementById("workspaceHost");
            if (!host) throw new Error("Workspace host element #workspaceHost was not found.");

            if (!this.domCache[name]) {
                const route = this.getWorkspaceUrl(name);
                const response = await fetch(route, { cache: "no-store" });
                if (!response.ok) {
                    throw new Error("Unable to load workspace HTML.\nWorkspace : " + name + "\nHTTP Status : " + response.status);
                }
                const html = await response.text();
                const container = document.createElement("div");
                container.id = "workspace_" + name;
                container.style.display = "none";
                container.innerHTML = html;
                host.appendChild(container);
                this.domCache[name] = container;
            }

            let firstVisit = false;
            if (ws && !ws.initialized) {
                if (ws.initialize) await ws.initialize();
                ws.initialized = true;
                firstVisit = true;
            }
            return firstVisit;
        })();

        this._initializationPromises[name] = task;
        try {
            return await task;
        } finally {
            if (this._initializationPromises[name] === task) {
                delete this._initializationPromises[name];
            }
        }
    },

    async show(name){


// alert(
//     "ENTER show()\n" +
//     "name = " + name + "\n" +
//     "currentWorkspace = " + this.currentWorkspace
// );



        const host =
            document.getElementById(
                "workspaceHost"
            );

        const previousWorkspace =
            this.currentWorkspace;
        
        const previousCallbacks =
            previousWorkspace
            ? this.registry[previousWorkspace]
            : null;
        
        const previousNode =
            previousWorkspace
            ? this.domCache[previousWorkspace]
            : null;

        //
        // Leave current workspace
        //
        // if (this.currentWorkspace) {
        
        //     const previous =
        //         this.registry[
        //             this.currentWorkspace
        //         ];
        
        //     if (
        //         previous &&
        //         previous.leave
        //     ) {
        
        //         // this.state[
        //         //     this.currentWorkspace
        //         // ] = await previous.leave();

        // //--
        // const leaving = this.currentWorkspace;
        
        // alert(
        //     "Calling leave() for " + leaving
        // );
        
        // const returnedState =
        //     await previous.leave();
        
        // alert(
        //     "leave() returned:\n" +
        //     JSON.stringify(returnedState)
        // );
        
        // this.state[leaving] =
        //     returnedState;
        
        // //--
        
        //     }
        
        // }

        const ws =
                this.registry[name];
    
        let firstVisit = false;
        
        try{
        
            // R887: navigation and background case-file work share this initializer.
            firstVisit = await this.ensureInitialized(name);

        }
        catch(error){

            // R1144.3.3: make startup initialization failures visible in the page.
            // The previous behavior depended entirely on the DeveloperErrors panel,
            // which may not be visible while the first workspace is still loading.
            const message = error && error.message ? error.message : String(error);
            const status = document.getElementById("statusText");
            if (status) {
                status.textContent = "Patient workspace initialization failed: " + message;
            }
            if (!previousWorkspace && host) {
                host.innerHTML = "<div style=\"padding:12px;color:#991b1b;background:#fef2f2;border:1px solid #fecaca;white-space:pre-wrap\">R1144.3.3 · WORKSPACE INITIALIZATION ERROR\n" +
                    String(message).replace(/[&<>\"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch])) +
                    "</div>";
            }

            // Preserve the existing developer diagnostic when available, but never
            // allow a missing diagnostic helper to hide the original failure.
            try {
                if (window.DeveloperErrors && typeof window.DeveloperErrors.report === "function") {
                    window.DeveloperErrors.report({
                        workspace: name,
                        stage: "initialize",
                        error,
                        recovery: {
                            action: "Stayed in previous workspace",
                            previousWorkspace
                        }
                    });
                }
            } catch (reportError) {
                console.error("R1144.3.3 DeveloperErrors reporting failed", reportError);
            }
            console.error("R1144.3.3 workspace initialization failed", { workspace: name, error });
            return;
        }
        
        //
        // Leave previous workspace
        //
        if(
            previousWorkspace &&
            previousCallbacks &&
            previousCallbacks.leave
        ){
        
            try{
        
                this.state[
                    previousWorkspace
                ] =
                    await previousCallbacks.leave();
        
            }
            catch(error){
        
                DeveloperErrors.report({
        
                    workspace:
                        previousWorkspace,
        
                    stage:
                        "leave",
        
                    source:
                        "Workspace.leave()",
        
                    severity:
                        "recoverable",
        
                    error,
        
                    recovery:{
        
                        action:
                            "Using previous saved state."
        
                    }
        
                });
        
                this.state[
                    previousWorkspace
                ] =
                    this.state[
                        previousWorkspace
                    ] || {};
        
            }
        
        }
        
        //
        // Hide every existing workspace
        //
        Object.values(
            this.domCache
        ).forEach(node=>{

            node.style.display="none";

        });

        //
        // Show workspace
        //
        this.domCache[name]
            .style.display="block";


        this.currentWorkspace = name;
        
// alert(
//     "currentWorkspace now = " +
//     this.currentWorkspace
// );
        
        //
        // enter()
        //
        
        if(
            ws &&
            ws.enter
        ){
            
            try{
        
                await ws.enter(
        
                    firstVisit,
        
                    this.state[name]
        
                );
        
            }
            catch(error){
        
                DeveloperErrors.report({
        
                    workspace: name,
        
                    stage: "enter",
        
                    source: "WorkspaceManager.enter()",
        
                    severity: "recoverable",
        
                    error,
        
                    recovery:{
        
                        action:
        
                            "Workspace opened successfully, but activation was incomplete."
        
                    }
        
                });
        
            }
        
        }
        
        if (this.currentWorkspace === "patient") {
            // R880 — retain the cached Patient DOM, but refresh after activation and paint.
            // updateCurrentCaseInspector preserves scroll during ordinary workspace navigation.
            await refreshDeveloperDashboard();
            await new Promise(resolve => requestAnimationFrame(() => resolve()));
            const resetImportedCaseScroll = window.__caseInspectorResetPending === true;
            updateCurrentCaseInspector({resetScroll: resetImportedCaseScroll});
            if (resetImportedCaseScroll) window.__caseInspectorResetPending = false;
            await new Promise(resolve => requestAnimationFrame(() => resolve()));

            const inspector = document.getElementById("currentCaseInspector");
            window.__caseInspectorLifecycleDiagnostic = {
                build: "R880",
                activeWorkspace: this.currentWorkspace,
                patientDomCached: !!this.domCache.patient,
                inspectorFound: !!inspector,
                inspectorVisible: !!inspector && inspector.getClientRects().length > 0,
                inspectorLocation: inspector?.parentElement?.id || "(not attached)",
                inspectorMatchesCurrentCase: !!inspector && (() => {
                    try {
                        return JSON.stringify(JSON.parse(inspector.textContent)) ===
                               JSON.stringify(window.currentCase);
                    } catch (_) {
                        return false;
                    }
                })(),
                inspectorScrollTop: inspector ? inspector.scrollTop : null,
                caseName: window.currentCase?.metadata?.case_name || "(unnamed)"
            };
        }
        
    }

};


