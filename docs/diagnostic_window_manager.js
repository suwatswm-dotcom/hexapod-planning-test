/*
 * R1146.11 — Diagnostic Window Manager
 * Developer-only presentation layer. It renders registered diagnostic modules
 * in independent windows; it does not duplicate producers or mutate CASE state.
 */
(function () {
  "use strict";
  if (window.DiagnosticWindowManager?.build === "R1146.11") return;

  const BUILD = "R1146.11";
  const PREFIX = "r1146DiagnosticWindow:";
  const windows = new Map();
  let zIndex = 2147483100;
  let developerMode = false;
  // One global pointer owner prevents overlapping windows from responding to
  // the same touch/mouse gesture. Only the window whose explicit grip received
  // pointerdown may resize until that pointer is released/cancelled.
  let activePointer = null;

  const safeRead = key => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const safeWrite = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) {}
  };
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  const el = (tag, attrs = {}, text) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "className") node.className = value;
      else if (key === "style") Object.assign(node.style, value);
      else node.setAttribute(key, value);
    });
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function addStyles() {
    if (document.getElementById("r1146DiagnosticWindowStyles")) return;
    const style = el("style", { id: "r1146DiagnosticWindowStyles" });
    style.textContent = `
      .r1146-diagnostic-window{position:fixed;display:flex;flex-direction:column;min-width:300px;min-height:190px;width:min(680px,calc(100vw - 32px));height:min(620px,calc(100vh - 32px));max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);background:#111827;color:#e5e7eb;border:1px solid #64748b;border-radius:9px;box-shadow:0 12px 36px #0008;z-index:2147483100;font:12px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;overflow:hidden}
      .r1146-diagnostic-window[hidden]{display:none}
      .r1146-diagnostic-window .r1146-window-head{display:flex;align-items:center;gap:7px;flex:0 0 auto;padding:9px 10px;background:#1f2937;border-bottom:1px solid #475569;cursor:move;touch-action:none;user-select:none}
      .r1146-diagnostic-window .r1146-window-title{flex:1;font-weight:800;letter-spacing:.035em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .r1146-diagnostic-window button{border:1px solid #64748b;border-radius:5px;background:#334155;color:#f8fafc;padding:5px 8px;font:inherit;cursor:pointer}
      .r1146-diagnostic-window .r1146-window-body{flex:1 1 auto;min-height:0;overflow:auto;padding:12px;box-sizing:border-box;touch-action:pan-y;overscroll-behavior:contain;-webkit-user-select:text;user-select:text}
      .r1146-diagnostic-window .r1146-window-resize{position:absolute;z-index:3;touch-action:none;pointer-events:auto;user-select:none;-webkit-user-select:none}
      .r1146-diagnostic-window .r1146-window-resize.n{top:-3px;left:10px;right:10px;height:8px;cursor:n-resize}
      .r1146-diagnostic-window .r1146-window-resize.s{bottom:-3px;left:10px;right:10px;height:8px;cursor:s-resize}
      .r1146-diagnostic-window .r1146-window-resize.e{right:-3px;top:10px;bottom:10px;width:8px;cursor:e-resize}
      .r1146-diagnostic-window .r1146-window-resize.w{left:-3px;top:10px;bottom:10px;width:8px;cursor:w-resize}
      .r1146-diagnostic-window .r1146-window-resize.ne{right:-3px;top:-3px;width:14px;height:14px;cursor:ne-resize}
      .r1146-diagnostic-window .r1146-window-resize.nw{left:-3px;top:-3px;width:14px;height:14px;cursor:nw-resize}
      .r1146-diagnostic-window .r1146-window-resize.se{right:-3px;bottom:-3px;width:16px;height:16px;cursor:se-resize;background:linear-gradient(135deg,transparent 0 45%,#94a3b8 46% 53%,transparent 54%)}
      .r1146-diagnostic-window .r1146-window-resize.sw{left:-3px;bottom:-3px;width:14px;height:14px;cursor:sw-resize}
      .r1146-diagnostic-window .r1146-diagnostic-actions{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}
      .r1146-diagnostic-window .r1146-diagnostic-pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:none}
      .r1146-diagnostic-window .r1146-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:4px 0;border-bottom:1px solid #293548;min-width:0}
      .r1146-diagnostic-window .r1146-row>span:first-child{flex:0 1 auto;min-width:0;color:#cbd5e1}
      .r1146-diagnostic-window .r1146-value{flex:0 1 62%;min-width:0;color:#a7f3d0;text-align:right;overflow-wrap:anywhere;word-break:break-word}
      .r1146-diagnostic-window.r1146-window-minimized{height:auto!important;min-height:0!important}
      .r1146-diagnostic-window.r1146-window-minimized .r1146-window-body,
      .r1146-diagnostic-window.r1146-window-minimized .r1146-window-resize{display:none}
      .r1146-diagnostic-window.r1146-window-maximized{left:8px!important;top:8px!important;width:calc(100vw - 16px)!important;height:calc(100vh - 16px)!important;max-width:none;max-height:none}
      @media(max-width:600px){.r1146-diagnostic-window{min-width:260px}.r1146-diagnostic-window .r1146-window-head{padding:10px}.r1146-diagnostic-window button{padding:7px 9px}}
    `;
    document.head.appendChild(style);
  }

  function persist(record) {
    const rect = record.node.getBoundingClientRect();
    safeWrite(PREFIX + record.id, JSON.stringify({
      left: rect.left, top: rect.top, width: rect.width, height: rect.height
    }));
  }

  function restoreGeometry(record) {
    let saved = null;
    try { saved = JSON.parse(safeRead(PREFIX + record.id) || "null"); } catch (_) {}
    const width = clamp(Number(saved?.width) || Math.min(680, innerWidth - 32), 300, Math.max(300, innerWidth - 16));
    const height = clamp(Number(saved?.height) || Math.min(620, innerHeight - 32), 190, Math.max(190, innerHeight - 16));
    const left = clamp(Number(saved?.left) || 24, Math.min(0, 120 - width), Math.max(0, innerWidth - 120));
    const top = clamp(Number(saved?.top) || 72, 0, Math.max(0, innerHeight - 48));
    record.node.style.left = left + "px";
    record.node.style.top = top + "px";
    record.node.style.width = width + "px";
    record.node.style.height = height + "px";
  }

  function render(record) {
    if (!record || record.minimized) return;
    const body = record.body;
    body.replaceChildren();
    try { record.render(body); }
    catch (error) {
      body.textContent = "Diagnostic window render error: " + (error?.message || String(error));
    }
  }

  function nextZ() {
    zIndex = Math.min(2147483600, zIndex + 1);
    return zIndex;
  }

  function focus(record) {
    record.node.style.zIndex = String(nextZ());
  }

  function focusGlobal(element) {
    if (element) element.style.zIndex = String(nextZ());
  }

  function close(record) {
    if (!record) return;
    persist(record);
    record.node.remove();
    windows.delete(record.id);
  }

  function setMinimized(record, value) {
    if (value === record.minimized) return;
    if (value) {
      // Remember the maximized state, but remove its viewport-sized CSS while
      // minimized so the minimized title bar remains compact.
      record.minimizedWasMaximized = !!record.maximized;
      if (record.maximized) {
        record.node.classList.remove("r1146-window-maximized");
        record.maximized = false;
      }
      record.minimized = true;
      record.node.classList.add("r1146-window-minimized");
      record.minButton.textContent = "↗";
      record.minButton.title = "Restore minimized window";
      record.maxButton.textContent = "□";
      record.maxButton.title = "Maximize window";
    } else {
      record.minimized = false;
      record.node.classList.remove("r1146-window-minimized");
      record.minButton.textContent = "−";
      record.minButton.title = "Minimize window";
      if (record.minimizedWasMaximized) {
        record.minimizedWasMaximized = false;
        record.maximized = true;
        record.node.classList.add("r1146-window-maximized");
        record.maxButton.textContent = "❐";
        record.maxButton.title = "Restore window size";
      }
      render(record);
      focus(record);
    }
  }

  function setMaximized(record, value) {
    // A maximize click on a minimized window is treated as Restore + Maximize.
    // This prevents the minimized class from continuing to hide the body.
    if (record.minimized) {
      record.minimized = false;
      record.node.classList.remove("r1146-window-minimized");
      record.minButton.textContent = "−";
      record.minButton.title = "Minimize window";
      if (record.minimizedWasMaximized) {
        record.minimizedWasMaximized = false;
        record.maximized = true;
        record.node.classList.add("r1146-window-maximized");
        record.maxButton.textContent = "❐";
        record.maxButton.title = "Restore window size";
        render(record);
        focus(record);
        return;
      }
      record.minimizedWasMaximized = false;
      render(record);
    }

    if (value && !record.maximized) {
      const rect = record.node.getBoundingClientRect();
      record.preMax = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }
    record.maximized = !!value;
    record.node.classList.toggle("r1146-window-maximized", record.maximized);
    record.maxButton.textContent = record.maximized ? "❐" : "□";
    record.maxButton.title = record.maximized ? "Restore window size" : "Maximize window";
    if (!record.maximized && record.preMax) {
      Object.assign(record.node.style, {
        left: record.preMax.left + "px", top: record.preMax.top + "px",
        width: record.preMax.width + "px", height: record.preMax.height + "px"
      });
      record.preMax = null;
      persist(record);
    }
    focus(record);
  }

  function beginDrag(record, event) {
    if (event.target.closest("button")) return;
    if (record.maximized) return;
    const rect = record.node.getBoundingClientRect();
    record.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    record.head.setPointerCapture?.(event.pointerId);
    focus(record);
    event.preventDefault();
  }

  function pointerMove(record, event) {
    // Header drag remains separate from resize ownership.
    if (record.drag?.id !== event.pointerId) return;
    const d = record.drag;
    const width = record.node.getBoundingClientRect().width;
    record.node.style.left = clamp(d.left + event.clientX - d.x,
      Math.min(0, 120 - width), Math.max(0, innerWidth - 120)) + "px";
    record.node.style.top = clamp(d.top + event.clientY - d.y,
      0, Math.max(0, innerHeight - 44)) + "px";
    event.preventDefault();
  }

  function endPointer(record, event) {
    if (record.drag?.id !== event.pointerId) return;
    record.drag = null;
    persist(record);
  }

  function beginResize(record, event, edge) {
    if (record.maximized || record.minimized || activePointer) return;
    const grip = event.target.closest?.(".r1146-window-resize");
    if (!grip || !record.node.contains(grip) || !grip.classList.contains(edge)) return;
    const rect = record.node.getBoundingClientRect();
    activePointer = {
      record, pointerId: event.pointerId, mode: "resize",
      edge, x: event.clientX, y: event.clientY,
      left: rect.left, top: rect.top, width: rect.width, height: rect.height
    };
    record.node.setPointerCapture?.(event.pointerId);
    focus(record);
    event.preventDefault();
    event.stopPropagation();
  }

  function beginOwnedPointer(record, event) {
    // Focus the hit window, but only its own explicit grip may start resizing.
    focus(record);
    if (activePointer) return;
    const grip = event.target.closest?.(".r1146-window-resize");
    if (!grip || !record.node.contains(grip)) return;
    const edge = ["n","s","e","w","ne","nw","se","sw"]
      .find(name => grip.classList.contains(name));
    if (edge) beginResize(record, event, edge);
  }

  function pointerMoveOwned(event) {
    const r = activePointer;
    if (!r || r.pointerId !== event.pointerId) return;
    const record = r.record;
    const dx = event.clientX - r.x, dy = event.clientY - r.y;
    let left = r.left, top = r.top, width = r.width, height = r.height;
    if (r.edge.includes("e")) width = r.width + dx;
    if (r.edge.includes("s")) height = r.height + dy;
    if (r.edge.includes("w")) { width = r.width - dx; left = r.left + dx; }
    if (r.edge.includes("n")) { height = r.height - dy; top = r.top + dy; }
    const minW = 280, minH = 180;
    if (width < minW) { if (r.edge.includes("w")) left -= minW - width; width = minW; }
    if (height < minH) { if (r.edge.includes("n")) top -= minH - height; height = minH; }
    width = Math.min(width, innerWidth - 16);
    height = Math.min(height, innerHeight - 16);
    left = clamp(left, Math.min(0, 120 - width), Math.max(0, innerWidth - 120));
    top = clamp(top, 0, Math.max(0, innerHeight - 44));
    record.node.style.left = left + "px";
    record.node.style.top = top + "px";
    record.node.style.width = width + "px";
    record.node.style.height = height + "px";
    event.preventDefault();
  }

  function endOwnedPointer(event) {
    if (!activePointer || activePointer.pointerId !== event.pointerId) return;
    const record = activePointer.record;
    activePointer = null;
    persist(record);
  }

  function open(id, title, renderFn) {
    developerMode = !!window.DiagnosticsManager?.isDeveloperModeEnabled?.() || developerMode;
    if (!developerMode) return false;
    if (windows.has(id)) {
      const existing = windows.get(id);
      setMinimized(existing, false);
      focus(existing);
      return true;
    }
    if (typeof renderFn !== "function") {
      const definition = window.DiagnosticsManager?.getModule?.(id);
      renderFn = definition?.render;
      title = title || definition?.title;
    }
    if (typeof renderFn !== "function") return false;
    addStyles();

    const node = el("section", { className: "r1146-diagnostic-window", role: "region", "aria-label": title || id });
    const head = el("div", { className: "r1146-window-head" });
    const heading = el("div", { className: "r1146-window-title" }, (title || id) + " · " + BUILD);
    const minButton = el("button", { type: "button", title: "Minimize window" }, "−");
    const maxButton = el("button", { type: "button", title: "Maximize window" }, "□");
    const closeButton = el("button", { type: "button", title: "Close window" }, "×");
    head.append(heading, minButton, maxButton, closeButton);
    const body = el("div", { className: "r1146-window-body" });
    node.append(head, body);

    const record = { id, title, render: renderFn, node, head, body, minButton, maxButton,
      closeButton, minimized: false, maximized: false, drag: null, resize: null };
    const edges = ["n","s","e","w","ne","nw","se","sw"];
    edges.forEach(edge => {
      const grip = el("div", { className: "r1146-window-resize " + edge, "aria-hidden": "true" });
      node.appendChild(grip);
    });
    head.addEventListener("pointerdown", event => beginDrag(record, event));
    head.addEventListener("pointermove", event => pointerMove(record, event));
    head.addEventListener("pointerup", event => endPointer(record, event));
    head.addEventListener("pointercancel", event => endPointer(record, event));
    // Capture-phase ownership: only this topmost window may claim a resize
    // gesture, and only when the initial hit target is one of its own grips.
    node.addEventListener("pointerdown", event => beginOwnedPointer(record, event), true);
    minButton.addEventListener("click", () => setMinimized(record, !record.minimized));
    maxButton.addEventListener("click", () => setMaximized(record, !record.maximized));
    closeButton.addEventListener("click", () => close(record));

    document.body.appendChild(node);
    restoreGeometry(record);
    windows.set(id, record);
    focus(record);
    render(record);
    return true;
  }

  function refresh() {
    if (!developerMode) return;
    windows.forEach(record => { if (!record.minimized) render(record); });
  }

  function setEnabled(enabled) {
    developerMode = !!enabled;
    if (!developerMode) {
      Array.from(windows.values()).forEach(close);
    }
  }

  // A single document-level move/up pipeline services the one active pointer.
  // This prevents a gesture from being independently interpreted by windows
  // underneath the one that received pointerdown.
  document.addEventListener("pointermove", pointerMoveOwned, { passive: false, capture: true });
  document.addEventListener("pointerup", endOwnedPointer, true);
  document.addEventListener("pointercancel", endOwnedPointer, true);
  window.addEventListener("developer-mode-changed", event => setEnabled(!!event.detail?.enabled));
  window.addEventListener("resize", () => {
    windows.forEach(record => {
      const rect = record.node.getBoundingClientRect();
      record.node.style.left = clamp(rect.left, Math.min(0, 120 - rect.width), Math.max(0, innerWidth - 120)) + "px";
      record.node.style.top = clamp(rect.top, 0, Math.max(0, innerHeight - 44)) + "px";
      record.node.style.width = Math.min(rect.width, innerWidth - 16) + "px";
      record.node.style.height = Math.min(rect.height, innerHeight - 16) + "px";
      persist(record);
    });
  });

  window.DiagnosticWindowManager = {
    build: BUILD,
    open,
    focusGlobal,
    close: id => close(windows.get(id)),
    refresh,
    setEnabled,
    getOpenWindows: () => Array.from(windows.keys())
  };
  developerMode = !!window.DiagnosticsManager?.isDeveloperModeEnabled?.();
  console.info("[R1146.11] Diagnostic Window Manager ready.");
})();
