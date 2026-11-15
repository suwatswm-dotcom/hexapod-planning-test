/*
 * R1146.8 — Global Developer Diagnostics Manager
 * Read-only diagnostics UI. Does not modify CASE or persistence state.
 */
(function () {
  "use strict";

  if (window.DiagnosticsManager && window.DiagnosticsManager.build === "R1146.8") return;

  const BUILD = "R1146.9";
  const MODE_KEY = "developerModeEnabled";
  const POSITION_KEY = "developerDiagnosticsPositionR1146";
  const SIZE_KEY = "developerDiagnosticsSizeR1146";
  const modules = new Map();
  let developerMode = false;
  let activeModule = "system-overview";
  let panel = null;
  let launcher = null;
  let collapsed = false;
  let drag = null;

  function safeRead(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (_) { return fallback; }
  }

  function safeWrite(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (key === "style") Object.assign(node.style, value);
      else if (key === "className") node.className = value;
      else if (key.startsWith("aria-") || key === "role" || key === "type" || key === "title") node.setAttribute(key, value);
      else node[key] = value;
    });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function addStyles() {
    if (document.getElementById("r1146DiagnosticsStyles")) return;
    const style = el("style", { id: "r1146DiagnosticsStyles" });
    style.textContent = `
      #r1146DevLauncher{position:fixed;right:14px;top:10px;z-index:2147483000;border:1px solid #64748b;border-radius:7px;background:#172033;color:#fff;padding:7px 11px;font:600 11px/1.2 system-ui;letter-spacing:.06em;cursor:pointer;box-shadow:0 2px 8px #0003}
      #r1146DevPanel{position:fixed;right:14px;bottom:14px;width:min(390px,calc(100vw - 28px));height:min(560px,68vh);min-width:min(320px,calc(100vw - 16px));min-height:240px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);display:flex;flex-direction:column;z-index:2147482999;background:#111827;color:#e5e7eb;border:1px solid #64748b;border-radius:10px;box-shadow:0 8px 30px #0005; font:12px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;overflow:hidden}
      #r1146DevPanel[hidden]{display:none}
      #r1146DevPanel .r1146-head{display:flex;flex:0 0 auto;align-items:center;gap:8px;padding:9px 10px;background:#1f2937;border-bottom:1px solid #475569;cursor:move;touch-action:none;user-select:none}
      #r1146DevPanel .r1146-heading{flex:1;font-weight:700;letter-spacing:.035em}
      #r1146DevPanel button{border:1px solid #64748b;border-radius:5px;background:#334155;color:#f8fafc;padding:4px 7px;font:inherit;cursor:pointer}
      #r1146DevPanel .r1146-body{flex:1 1 auto;min-height:0;box-sizing:border-box;padding:10px;overflow:auto;max-height:none}
      #r1146DevPanel .r1146-modules button[aria-pressed="true"]{background:#0f766e;border-color:#5eead4;color:#ecfeff;box-shadow:inset 0 0 0 1px #5eead4;font-weight:800}
      #r1146DevPanel .r1146-modules button[aria-pressed="false"]{background:#273449;color:#cbd5e1}
      #r1146DevPanel .r1146-resize-grip{position:absolute;right:2px;bottom:2px;width:22px;height:22px;z-index:2;cursor:nwse-resize;touch-action:none;border-radius:4px;background:linear-gradient(135deg,transparent 0 43%,#64748b 44% 49%,transparent 50% 61%,#94a3b8 62% 67%,transparent 68%);opacity:.9}
      #r1146DevPanel .r1146-resize-grip:focus{outline:2px solid #5eead4;outline-offset:-2px}
      #r1146DevPanel .r1146-row{display:flex;justify-content:space-between;gap:12px;padding:4px 0;border-bottom:1px solid #293548}
      #r1146DevPanel .r1146-value{color:#a7f3d0;text-align:right;overflow-wrap:anywhere}
      #r1146DevPanel .r1146-note{color:#94a3b8;margin-top:9px;font-size:11px}
      #r1146DevPanel .r1146-modules{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px}
      #r1146DevPanel .r1146-module-groups{display:grid;gap:7px;margin-bottom:9px}
      #r1146DevPanel .r1146-module-category{font-size:10px;letter-spacing:.1em;color:#94a3b8;font-weight:800;margin:3px 0}
      #r1146DevPanel .r1146-content-header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-top:1px solid #475569}
      #r1146DevPanel .r1146-content-header strong{font-size:11px;letter-spacing:.04em}
      #r1146DevPanel .r1146-content-header button{white-space:nowrap}
      @media(max-width:600px){#r1146DevLauncher{top:auto;bottom:14px;right:14px}#r1146DevPanel{bottom:58px;right:8px;width:calc(100vw - 16px)}}
    `;
    document.head.appendChild(style);
  }

  function row(label, value) {
    const line = el("div", { className: "r1146-row" });
    line.append(el("span", {}, label), el("span", { className: "r1146-value" }, value));
    return line;
  }

  function overviewRender(host) {
    const mode = window.__APP_OPERATING_MODE || "not-started";
    const startup = window.__APP_STARTUP_STATE || "not-started";
    const workspace = window.WorkspaceManager?.currentWorkspace || "none";
    host.append(
      row("Build", BUILD),
      row("Developer Mode", developerMode ? "ON" : "OFF"),
      row("Operating mode", mode),
      row("Startup state", startup),
      row("Active workspace", workspace)
    );

    const coordinator = window.CaseChangeCoordinator;
    if (coordinator && typeof coordinator.getDiagnostics === "function") {
      try {
        const d = coordinator.getDiagnostics();
        const c = d.counters || {};
        host.append(
          row("CASE events", String(c.emitted ?? "—")),
          row("Suppressed events", String(c.suppressed ?? "—")),
          row("Rejected events", String(c.rejected ?? "—")),
          row("Transaction depth", String(d.transactionDepth ?? "—"))
        );
      } catch (error) {
        host.append(row("CASE diagnostics", "read error: " + (error.message || error)));
      }
    } else {
      host.append(row("CASE coordinator", "not available"));
    }
    host.append(el("div", { className: "r1146-note" }, "Read-only overview. No CASE data, images, annotations, or patient identifiers are displayed."));
  }

  function register(definition) {
    if (!definition || !definition.id || typeof definition.render !== "function") {
      throw new Error("DiagnosticsManager.register requires id and render(host).");
    }
    modules.set(definition.id, {
      id: definition.id,
      title: definition.title || definition.id,
      category: definition.category || "Development",
      render: definition.render
    });
    if (panel && activeModule === definition.id) renderPanel();
    return true;
  }

  function renderPanel() {
    if (!panel) return;
    const head = panel.querySelector(".r1146-heading");
    const body = panel.querySelector(".r1146-body");
    const current = modules.get(activeModule) || modules.get("system-overview");
    if (!current) return;
    activeModule = current.id;
    head.textContent = current.title + " · " + BUILD;
    body.replaceChildren();
    const tabs = el("div", { className: "r1146-module-groups" });
    const categories = ["Operational", "Engineering", "Development"];
    categories.forEach(category => {
      const entries = Array.from(modules.values()).filter(module => module.category === category);
      if (!entries.length) return;
      const group = el("section", { className: "r1146-module-group" });
      group.appendChild(el("div", { className: "r1146-module-category" }, category.toUpperCase()));
      const buttons = el("div", { className: "r1146-modules" });
      entries.forEach(module => {
        const selected = module.id === activeModule;
        const button = el("button", { type: "button", className: selected ? "is-active" : "" }, module.title);
        button.setAttribute("aria-pressed", String(selected));
        button.addEventListener("click", () => { activeModule = module.id; renderPanel(); });
        buttons.appendChild(button);
      });
      group.appendChild(buttons);
      tabs.appendChild(group);
    });
    const uncategorized = Array.from(modules.values()).filter(module => !categories.includes(module.category));
    if (uncategorized.length) {
      const group = el("section", { className: "r1146-module-group" });
      group.appendChild(el("div", { className: "r1146-module-category" }, "OTHER"));
      const buttons = el("div", { className: "r1146-modules" });
      uncategorized.forEach(module => {
        const selected = module.id === activeModule;
        const button = el("button", { type: "button", className: selected ? "is-active" : "" }, module.title);
        button.setAttribute("aria-pressed", String(selected));
        button.addEventListener("click", () => { activeModule = module.id; renderPanel(); });
        buttons.appendChild(button);
      });
      group.appendChild(buttons);
      tabs.appendChild(group);
    }
    body.appendChild(tabs);
    const contentHeader = el("div", { className: "r1146-content-header" });
    const contentTitle = el("strong", {}, current.title);
    const popout = el("button", { type: "button", title: "Open this diagnostic module in a separate window" }, "↗ Pop out");
    popout.addEventListener("click", () => {
      const windows = window.DiagnosticWindowManager;
      if (!windows || typeof windows.open !== "function") {
        popout.textContent = "Window manager unavailable";
        return;
      }
      windows.open(current.id, current.title, current.render);
    });
    contentHeader.append(contentTitle, popout);
    body.appendChild(contentHeader);
    const content = el("div", { className: "r1146-content" });
    body.appendChild(content);
    try { current.render(content); }
    catch (error) { content.textContent = "Diagnostic module error: " + (error.message || String(error)); }
  }

  function restorePosition() {
    try {
      const saved = JSON.parse(safeRead(POSITION_KEY, "null"));
      if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
        const minVisibleX = 80;
        const panelWidth = panel.offsetWidth || parseFloat(getComputedStyle(panel).width) || Math.min(390, innerWidth - 28);
        panel.style.left = Math.max(minVisibleX - panelWidth, Math.min(saved.left, innerWidth - minVisibleX)) + "px";
        panel.style.top = Math.max(0, Math.min(saved.top, innerHeight - 44)) + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";
      }
    } catch (_) {}
    try {
      const size = JSON.parse(safeRead(SIZE_KEY, "null"));
      if (size && Number.isFinite(size.width) && Number.isFinite(size.height)) {
        const minW = Math.min(320, innerWidth - 16);
        panel.style.width = Math.max(minW, Math.min(size.width, innerWidth - 16)) + "px";
        panel.style.height = Math.max(240, Math.min(size.height, innerHeight - 16)) + "px";
      }
    } catch (_) {}
  }

  function savePosition() {
    const rect = panel.getBoundingClientRect();
    safeWrite(POSITION_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
  }

  function saveSize() {
    const rect = panel.getBoundingClientRect();
    safeWrite(SIZE_KEY, JSON.stringify({ width: rect.width, height: rect.height }));
  }

  function createUI() {
    if (launcher || !document.body) return;
    addStyles();
    launcher = el("button", { id: "r1146DevLauncher", type: "button", title: "Toggle Developer Mode" }, "DEVELOPER MODE · OFF");
    launcher.addEventListener("click", toggleDeveloperMode);
    launcher.addEventListener("pointerdown", () => window.DiagnosticWindowManager?.focusGlobal?.(launcher));
    document.body.appendChild(launcher);

    panel = el("section", { id: "r1146DevPanel", role: "region", "aria-label": "Developer diagnostics", hidden: true });
    panel.addEventListener("pointerdown", () => window.DiagnosticWindowManager?.focusGlobal?.(panel));
    const header = el("div", { className: "r1146-head" });
    const heading = el("div", { className: "r1146-heading" }, "SYSTEM OVERVIEW · " + BUILD);
    const collapse = el("button", { type: "button", title: "Collapse or expand diagnostics" }, "—");
    const close = el("button", { type: "button", title: "Close diagnostics" }, "×");
    collapse.addEventListener("click", () => {
      collapsed = !collapsed;
      panel.querySelector(".r1146-body").hidden = collapsed;
      collapse.textContent = collapsed ? "+" : "—";
    });
    close.addEventListener("click", () => { panel.hidden = true; });
    header.append(heading, collapse, close);
    const body = el("div", { className: "r1146-body" });
    const resizeGrip = el("div", { className: "r1146-resize-grip", role: "separator", "aria-label": "Resize diagnostics panel", tabindex: 0, title: "Drag to resize" });
    panel.append(header, body, resizeGrip);
    document.body.appendChild(panel);
    restorePosition();

    let resizeDrag = null;
    resizeGrip.addEventListener("pointerdown", event => {
      const rect = panel.getBoundingClientRect();
      resizeDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
      resizeGrip.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    });
    resizeGrip.addEventListener("pointermove", event => {
      if (!resizeDrag || resizeDrag.pointerId !== event.pointerId) return;
      const minW = Math.min(320, innerWidth - 16);
      const minH = Math.min(240, innerHeight - 16);
      const width = Math.max(minW, Math.min(resizeDrag.width + event.clientX - resizeDrag.x, innerWidth - 16));
      const height = Math.max(minH, Math.min(resizeDrag.height + event.clientY - resizeDrag.y, innerHeight - 16));
      panel.style.width = width + "px";
      panel.style.height = height + "px";
    });
    const stopResize = event => {
      if (resizeDrag && resizeDrag.pointerId === event.pointerId) {
        resizeDrag = null;
        saveSize();
      }
    };
    resizeGrip.addEventListener("pointerup", stopResize);
    resizeGrip.addEventListener("pointercancel", stopResize);

    header.addEventListener("pointerdown", event => {
      if (event.target.closest("button")) return;
      const rect = panel.getBoundingClientRect();
      drag = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
      header.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });
    header.addEventListener("pointermove", event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const minVisibleX = 80;
      const left = Math.max(minVisibleX - panel.offsetWidth, Math.min(event.clientX - drag.dx, innerWidth - minVisibleX));
      const top = Math.max(0, Math.min(event.clientY - drag.dy, innerHeight - 44));
      panel.style.left = left + "px";
      panel.style.top = top + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    });
    const stopDrag = event => {
      if (drag && drag.pointerId === event.pointerId) { drag = null; savePosition(); }
    };
    header.addEventListener("pointerup", stopDrag);
    header.addEventListener("pointercancel", stopDrag);
    window.addEventListener("resize", () => {
      if (!panel || panel.hidden) return;
      const rect = panel.getBoundingClientRect();
      panel.style.width = Math.min(rect.width, innerWidth - 16) + "px";
      panel.style.height = Math.min(rect.height, innerHeight - 16) + "px";
      const minVisibleX = 80;
      panel.style.left = Math.max(minVisibleX - panel.offsetWidth, Math.min(rect.left, innerWidth - minVisibleX)) + "px";
      panel.style.top = Math.max(0, Math.min(rect.top, innerHeight - 44)) + "px";
      saveSize();
    });
  }

  function open(moduleId) {
    if (!developerMode) return false;
    if (moduleId && modules.has(moduleId)) activeModule = moduleId;
    panel.hidden = false;
    collapsed = false;
    panel.querySelector(".r1146-body").hidden = false;
    panel.querySelector(".r1146-head button").textContent = "—";
    renderPanel();
    return true;
  }

  function toggleDeveloperMode() {
    developerMode = !developerMode;
    safeWrite(MODE_KEY, developerMode ? "true" : "false");
    launcher.textContent = developerMode ? "DEVELOPER MODE · ON" : "DEVELOPER MODE · OFF";
    launcher.setAttribute("aria-pressed", String(developerMode));
    if (developerMode) {
      open("system-overview");
      window.DiagnosticWindowManager?.focusGlobal?.(panel);
    } else panel.hidden = true;
    window.dispatchEvent(new CustomEvent("developer-mode-changed", { detail: { enabled: developerMode } }));
  }

  register({ id: "system-overview", title: "SYSTEM OVERVIEW", category: "Development", render: overviewRender });

  window.DiagnosticsManager = {
    build: BUILD,
    register,
    open,
    close: () => { if (panel) panel.hidden = true; },
    toggleDeveloperMode,
    isDeveloperModeEnabled: () => developerMode,
    getModules: () => Array.from(modules.values()).map(({ id, title, category }) => ({ id, title, category })),
    getModule: id => modules.get(id) || null,
    refresh: refreshIfOpen
  };

  function refreshIfOpen() {
    if (developerMode && panel && !panel.hidden) renderPanel();
    if (window.DiagnosticWindowManager?.refresh) window.DiagnosticWindowManager.refresh();
  }
  ["application-operating-mode-changed", "case-change-diagnostics-updated", "workspace-changed", "connected-case-autosave-status", "supabase-wip-save-diagnostic", "DOMContentLoaded"].forEach(name => {
    window.addEventListener(name, refreshIfOpen);
  });

  function init() {
    createUI();
    developerMode = safeRead(MODE_KEY, "false") === "true";
    launcher.textContent = developerMode ? "DEVELOPER MODE · ON" : "DEVELOPER MODE · OFF";
    launcher.setAttribute("aria-pressed", String(developerMode));
    if (developerMode) open("system-overview");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
