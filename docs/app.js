// R1145.2 — Connected WIP autosave integration + R1144.6 recovery navigation barrier.
// Workspace navigation must not enter X-ray while automatic full-case recovery
// is still preparing/installing the AP/LAT VTK panels. A click is accepted and
// queued; it is executed after startup recovery settles.
let resolveAppStartupReady;
const appStartupReady = new Promise(resolve => { resolveAppStartupReady = resolve; });
window.__APP_STARTUP_READY = appStartupReady;
window.__APP_STARTUP_STATE = "loading";
window.__APP_OPERATING_MODE = "resolving"; // resolving | connected | standalone | signed-out
window.__APP_MODE_TRANSITION_PENDING = false;
let appNavigationRequest = 0;

// R1142: one explicit mode boundary controls local recovery and workspace access.
// Standalone can only be activated by a caller that represents an explicit user choice.
window.setApplicationOperatingMode = async function(mode, options = {}) {
    const allowed = ["connected", "standalone", "signed-out", "resolving"];
    if (!allowed.includes(mode)) throw new Error("Unknown application operating mode: " + mode);
    if (mode === "connected" && options.authenticated !== true) {
        throw new Error("Connected mode requires a verified authenticated session.");
    }
    if (mode === "standalone" && options.explicit !== true) {
        throw new Error("Standalone mode requires an explicit user choice.");
    }
    if (mode === "standalone" && window.APP_FEATURES?.standaloneModeEnabled !== true) {
        throw new Error("Standalone mode is disabled by the application feature flag.");
    }

    const recovery = window.CaseRecoveryDiagnostics;
    if (mode === "standalone") {
        if (!recovery || typeof recovery.startStandalone !== "function") {
            throw new Error("Standalone local recovery engine is unavailable.");
        }
        window.__APP_OPERATING_MODE = "standalone";
        document.body.dataset.operatingMode = "standalone";
        window.ModeSwitchTiming?.mark("Standalone operating mode selected");
        await recovery.startStandalone();
        window.ModeSwitchTiming?.mark("Standalone local recovery initialized");
        const result = await recovery.offerStartupRecovery();
        window.ModeSwitchTiming?.mark("Standalone startup recovery check completed");
        window.__APP_STANDALONE_RECOVERY_RESULT = result;
    } else {
        // Connected, signed-out and resolving states must never run local autosave.
        if (typeof recovery?.stop === "function") recovery.stop();
        window.__APP_OPERATING_MODE = mode;
        document.body.dataset.operatingMode = mode;
    }

    window.dispatchEvent(new CustomEvent("application-operating-mode-changed", {
        detail: { mode, at: new Date().toISOString() }
    }));
    return {
        mode,
        localRecoveryAvailable: mode === "standalone",
        localRecoveryObserverActive: recovery?.isStandaloneRecoveryActive?.() === true
    };
};

const WorkspaceCache = {};
const WorkspaceDomCache = {};

async function loadScript(url){

    return new Promise((resolve,reject)=>{

        const script = document.createElement("script");

        script.src = url;

        script.onload = resolve;

        script.onerror = reject;

        document.body.appendChild(script);

    });

}


async function loadWorkspace(name){

    if (WorkspaceCache[name]) {
    
        document.getElementById(
            "workspaceHost"
        ).innerHTML = WorkspaceCache[name];
    
        return;
    
    }


    // R916: force the updated Patient fragment after deploying the local-case workflow.
    const workspaceUrl = window.WorkspaceManager
        ? window.WorkspaceManager.getWorkspaceUrl(name)
        : window.appAssetUrl(name + "_workspace.html");
    const response = await fetch(workspaceUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Workspace HTML request failed: " + response.status);
    const html = await response.text();

    WorkspaceCache[name] = html;
    
    document.getElementById(
        "workspaceHost"
    ).innerHTML = html;

    // R916: the Patient controller is also loaded by app.html; keep this dynamic
    // workspace load on the same explicit cache-busted revision.
    const scriptPath = name + ".js";
    const scriptUrl = window.appAssetUrl ? window.appAssetUrl(scriptPath + "?build=" + (window.APP_BUILD || "R1172.7.1")) : "./" + scriptPath;
    await loadScript(scriptUrl);

    const initName =
        "initialize"
        + name.charAt(0).toUpperCase()
        + name.slice(1)
        + "Workspace";

    if(typeof window[initName] === "function"){

        await window[initName]();

    }

}


window.onload = async function(){

    window.__APP_STARTUP_STATE = "initializing-patient";

    try {
        await WorkspaceManager.show("patient");

        // R1135: retain the R1129 automatic-recovery navigation barrier before allowing any workspace
        // enter() lifecycle to run. Navigation clicks during this period are
        // accepted and queued; they do not compete with the R869 installer.
        window.__APP_STARTUP_STATE = "automatic-recovery";
        const status = document.getElementById("statusText");
        if (status) status.textContent = "Restoring saved case… navigation will continue when ready";

        // R1142: wait for verified authentication. A missing/failed session is
        // signed-out, NOT standalone; it must never activate local recovery.
        let connectionState = { connected: false, reason: "session-state-unavailable" };
        try {
            if (window.__SUPABASE_SESSION_READY && typeof window.__SUPABASE_SESSION_READY.then === "function") {
                connectionState = await window.__SUPABASE_SESSION_READY;
            }
        } catch (sessionError) {
            console.warn("R1145.2 Supabase session readiness failed; remaining signed out.", sessionError);
            connectionState = { connected: false, reason: "session-readiness-error" };
        }

        if (connectionState?.connected) {
            await window.setApplicationOperatingMode("connected", { authenticated: true, source: "session-restore" });
            window.__STARTUP_RECOVERY_SOURCE = "supabase";
            if (typeof window.restoreSupabaseWorkingCopyAtStartup === "function") {
                window.__STARTUP_RECOVERY_RESULT = await window.restoreSupabaseWorkingCopyAtStartup(connectionState);
            } else {
                window.__STARTUP_RECOVERY_RESULT = {
                    mode: "supabase", restored: false,
                    reason: "cloud-startup-recovery-function-unavailable"
                };
                console.error("R1142: authenticated Supabase session exists, but startup WIP restore function is unavailable.");
            }
        } else {
            await window.setApplicationOperatingMode("signed-out");
            window.__STARTUP_RECOVERY_SOURCE = "none";
            window.__STARTUP_RECOVERY_RESULT = {
                mode: "signed-out", restored: false,
                reason: connectionState?.reason || "no-authenticated-session",
                localRecoveryStarted: false
            };
            if (status) status.textContent = "Sign in for Connected Mode. Local recovery is currently disabled.";
        }
    } catch (error) {
        console.error("R1145.2 application startup/recovery error:", error);
        try { await window.setApplicationOperatingMode("signed-out"); } catch (modeError) { console.error(modeError); }
    } finally {
        window.__APP_STARTUP_STATE = "ready";
        resolveAppStartupReady(true);
        const status = document.getElementById("statusText");
        if (status) {
            status.textContent = window.__APP_OPERATING_MODE === "connected"
                ? "Ready · Connected mode"
                : window.__APP_OPERATING_MODE === "standalone"
                    ? "Ready · Standalone mode"
                    : "Sign in for Connected Mode. Local recovery is currently disabled.";
        }

    }
};


function initializeAppNavigation(){

    const links =
        document.querySelectorAll("#menu a");

    links.forEach(link=>{

        link.onclick = async function(event){

            event.preventDefault();

            const href = this.getAttribute("href") || "";
            const page = this.dataset.workspace || href.replace(/^#/, "").replace(/^\//, "");
            if (!page) return;
            const requestId = ++appNavigationRequest;

            // During startup, retain the latest requested destination. Do not
            // call WorkspaceManager.show() until the restore transaction ends.
            if (window.__APP_STARTUP_STATE !== "ready") {
                window.__APP_PENDING_WORKSPACE = page;
                const status = document.getElementById("statusText");
                if (status) status.textContent = "Finishing recovery… " + page + " will open automatically";
                await appStartupReady;
                if (requestId !== appNavigationRequest) return;
                if (window.__APP_PENDING_WORKSPACE === page) {
                    window.__APP_PENDING_WORKSPACE = null;
                }
            } else {
                // Multiple rapid clicks resolve to the most recent request.
                await Promise.resolve();
                if (requestId !== appNavigationRequest) return;
            }

            const mode = window.__APP_OPERATING_MODE;
            if (page !== "patient" && mode !== "connected" && mode !== "standalone") {
                const status = document.getElementById("statusText");
                if (status) status.textContent = "ACCESS BLOCKED · Sign in for Connected Mode on the Patient page.";
                return;
            }
            if (window.__APP_MODE_TRANSITION_PENDING) {
                const status = document.getElementById("statusText");
                if (status) status.textContent = "Please wait · operating-mode transition is still in progress.";
                return;
            }
            await WorkspaceManager.show(page);

        };

    });

}

// Bind navigation immediately when app.js executes, not at window.onload, so
// an early user click is also held behind the startup/recovery barrier.
initializeAppNavigation();


