/*
 * R1146.8 — Global Diagnostics Modules
 *
 * Single deployment file for the logical diagnostics modules.
 * Add future small diagnostics modules to this file as separate IIFEs.
 *
 * Current modules include CASE Change Events, Connected WIP, Standalone Recovery,
 * Local Case Repository, Planner Validation, and Current Case Inspector.
 *
 * The global DiagnosticsManager remains a separate shared UI/registry engine.
 * Each module below is presentation-only and preserves its subsystem producer.
 */

/*
 * R1146.1 — CASE Change Diagnostics module
 * Presentation adapter for the existing CaseChangeCoordinator.
 * Read-only: does not emit events, reset counters, mutate CASE, or persist data.
 */
(function () {
  "use strict";

  const BUILD = "R1146.1";
  const MANAGER = window.DiagnosticsManager;
  if (!MANAGER || typeof MANAGER.register !== "function") {
    console.error("[R1146.1] DiagnosticsManager unavailable; CASE diagnostics module not registered.");
    return;
  }

  function node(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  }

  function addRow(host, label, value) {
    const line = node("div", "r1146-row");
    line.append(node("span", "", label), node("span", "r1146-value", value));
    host.appendChild(line);
  }

  function addGroup(host, title, values) {
    const heading = node("div", "r1146-note", title);
    heading.style.marginTop = "12px";
    heading.style.fontWeight = "700";
    host.appendChild(heading);
    const entries = Object.entries(values || {}).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      host.appendChild(node("div", "r1146-note", "No events recorded."));
      return;
    }
    entries.forEach(([key, value]) => addRow(host, key, String(value)));
  }

  function render(host) {
    const coordinator = window.CaseChangeCoordinator;
    if (!coordinator || typeof coordinator.getDiagnostics !== "function") {
      host.appendChild(node("div", "r1146-note", "CaseChangeCoordinator is unavailable."));
      return;
    }

    let diagnostics;
    try { diagnostics = coordinator.getDiagnostics(); }
    catch (error) {
      host.appendChild(node("div", "r1146-note", "Unable to read CASE diagnostics: " + (error.message || error)));
      return;
    }

    const counters = diagnostics.counters || {};
    addRow(host, "Module build", BUILD);
    addRow(host, "Event contract", diagnostics.eventName || "case-data-changed");
    addRow(host, "Sequence", String(diagnostics.sequence ?? 0));
    addRow(host, "Emitted", String(counters.emitted ?? 0));
    addRow(host, "Suppressed", String(counters.suppressed ?? 0));
    addRow(host, "Rejected", String(counters.rejected ?? 0));
    addRow(host, "Transaction depth", String(diagnostics.transactionDepth ?? 0));
    addRow(host, "Operating mode", diagnostics.operatingMode || "unknown");
    addRow(host, "Mode transition pending", diagnostics.transitionPending ? "YES" : "NO");
    addRow(host, "Persistence adapter", diagnostics.persistenceConnected ? "CONNECTED" : "NOT REPORTED BY COORDINATOR");

    addGroup(host, "EVENTS BY DOMAIN", counters.byDomain);
    addGroup(host, "EVENTS BY SOURCE", counters.bySource);
    addGroup(host, "EVENTS BY OPERATION", counters.byOperation);

    const last = counters.lastEvent;
    const lastTitle = node("div", "r1146-note", "LAST ACCEPTED EVENT");
    lastTitle.style.marginTop = "12px";
    lastTitle.style.fontWeight = "700";
    host.appendChild(lastTitle);
    if (last) {
      addRow(host, "Sequence", String(last.sequence));
      addRow(host, "Source", last.source || "—");
      addRow(host, "Domain", last.domain || "—");
      addRow(host, "Operation", last.operation || "—");
      addRow(host, "View", last.view || "—");
      addRow(host, "Reason", last.reason || "—");
      addRow(host, "Time", last.timestamp ? new Date(last.timestamp).toLocaleString() : "—");
    } else {
      host.appendChild(node("div", "r1146-note", "No accepted event recorded."));
    }

    if (counters.lastError) {
      const error = node("div", "r1146-note", "LAST ERROR: " + counters.lastError);
      error.style.color = "#fca5a5";
      error.style.overflowWrap = "anywhere";
      host.appendChild(error);
    }

    host.appendChild(node("div", "r1146-note", "Read-only view of coordinator counters. No CASE identifiers or clinical payloads are displayed. Refreshes when coordinator diagnostics change."));
  }

  MANAGER.register({
    id: "case-change-events",
    title: "CASE CHANGE EVENTS",
    category: "Operational",
    render
  });

  console.info("[R1146.1] CASE Change Diagnostics module registered.");
})();

/* ------------------------------------------------------------------------- */
/* MODULE 2 — CONNECTED WIP                                                   */
/* ------------------------------------------------------------------------- */

/*
 * R1146.2 — Connected WIP Diagnostics module.
 *
 * Presentation-only adapter for the existing R1145.7 ConnectedCaseAutosave
 * and R1145.8/R1145.9 SupabaseCaseStorage pipelines.
 *
 * Does not save, retry, mutate CASE, alter the save queue, or change persistence.
 * The only action button invokes the existing read-only uncertain-outcome check.
 */
(function () {
  "use strict";

  const BUILD = "R1146.2";
  const MANAGER = window.DiagnosticsManager;
  const TRACE_LIMIT = 100;
  const traceEntries = [];
  let copyFeedback = "Copy Diagnostic Log";

  if (!MANAGER || typeof MANAGER.register !== "function") {
    console.error("[R1146.2] DiagnosticsManager unavailable; Connected WIP module not registered.");
    return;
  }

  // The old producer-owned strip remains generated by R1145.7 for compatibility,
  // but its presentation is now provided by the global Developer Diagnostics panel.
  if (!document.getElementById("r1146ConnectedWipHideLegacyStyle")) {
    const style = document.createElement("style");
    style.id = "r1146ConnectedWipHideLegacyStyle";
    style.textContent = "#connectedAutosaveDiagnosticPanel{display:none!important}";
    document.head.appendChild(style);
  }

  function node(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  }

  function addRow(host, label, value) {
    const line = node("div", "r1146-row");
    line.append(node("span", "", label), node("span", "r1146-value", value));
    host.appendChild(line);
  }

  function safeError(value) {
    return String(value || "").replace(/https?:\/\/\S+/g, "[URL REDACTED]");
  }

  // Display-only conversion. Source values remain UTC ISO timestamps.
  function formatLocalTimestamp(value) {
    if (value == null || value === "") return value;
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return value;
    const parts = new Intl.DateTimeFormat(undefined, {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZoneName: "short"
    }).format(date);
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return parts + " (UTC" + sign + String(Math.floor(abs / 60)).padStart(2, "0") + ":" + String(abs % 60).padStart(2, "0") + ")";
  }

  function localizeTimestampFields(value) {
    if (Array.isArray(value)) return value.map(localizeTimestampFields);
    if (!value || typeof value !== "object") return value;
    const out = {};
    Object.keys(value).forEach(key => {
      const item = value[key];
      if (/^(capturedAt|timestamp|updatedAt|createdAt|savedAt|committedAt|completedAt|startedAt|finishedAt|lastSaveAt)$/i.test(key)) {
        out[key] = formatLocalTimestamp(item);
      } else {
        out[key] = localizeTimestampFields(item);
      }
    });
    return out;
  }

  // Remove identifiers and image fingerprints from the diagnostic export.
  function redact(value) {
    if (Array.isArray(value)) return value.map(redact);
    if (!value || typeof value !== "object") return value;
    const out = {};
    Object.keys(value).forEach(key => {
      if (/^(caseId|patientId|ownerId|sha256|imageChecksum)$/i.test(key)) {
        out[key] = "[REDACTED]";
      } else {
        out[key] = redact(value[key]);
      }
    });
    return out;
  }

  function captureTrace(detail) {
    const entry = redact({
      capturedAt: new Date().toISOString(),
      ...(detail && typeof detail === "object" ? detail : { detail: String(detail) })
    });
    traceEntries.push(entry);
    copyFeedback = "Copy Diagnostic Log";
    if (traceEntries.length > TRACE_LIMIT) traceEntries.splice(0, traceEntries.length - TRACE_LIMIT);
    if (typeof MANAGER.refresh === "function") MANAGER.refresh();
  }

  function currentDiagnostics() {
    try {
      return window.ConnectedCaseAutosave?.getDiagnostics?.() || null;
    } catch (error) {
      return { status: "Unable to read autosave state.", lastError: safeError(error.message || error) };
    }
  }

  function render(host) {
    const d = currentDiagnostics();
    addRow(host, "Module build", BUILD);
    addRow(host, "Autosave engine", d ? (d.version || "available") : "not loaded");
    addRow(host, "Operating mode", d?.mode || window.__APP_OPERATING_MODE || "unknown");
    addRow(host, "Autosave eligible", d ? (d.active ? "YES" : "NO") : "UNKNOWN");
    addRow(host, "Save status", d?.status || "Waiting for ConnectedCaseAutosave.");
    addRow(host, "Pending edits", String(d?.pendingEvents ?? "—"));
    addRow(host, "Event serial", String(d?.eventSerial ?? "—"));
    addRow(host, "Saved serial", String(d?.savedSerial ?? "—"));
    addRow(host, "Save in progress", d ? (d.saving ? "YES" : "NO") : "—");
    addRow(host, "Completed save count", String(d?.saveCount ?? "—"));
    addRow(host, "Uncertain outcome", d?.uncertainAttempt ? "YES — verification available" : "NO");
    if (d?.uncertainAttempt) {
      addRow(host, "Reconciliation", d.reconciling ? "READ-ONLY SERVER CHECK IN PROGRESS" : "WAITING FOR USER VERIFICATION");
    }
    addRow(host, "Last save", d?.lastSave ? JSON.stringify(localizeTimestampFields(redact(d.lastSave))) : "—");
    if (d?.lastError) {
      const error = node("div", "r1146-note", "LAST ERROR: " + safeError(d.lastError));
      error.style.color = "#fca5a5";
      error.style.overflowWrap = "anywhere";
      host.appendChild(error);
    }

    const controls = node("div", "");
    controls.style.cssText = "display:flex;gap:7px;flex-wrap:wrap;margin:10px 0;";
    if (d?.uncertainAttempt) {
      const reconcile = node("button", "", d.reconciling ? "Checking server…" : "Verify Uncertain Save");
      reconcile.type = "button";
      reconcile.disabled = !!d.reconciling;
      reconcile.title = "Read-only server lookup for the exact uncertain save generation; does not retry or write.";
      reconcile.addEventListener("click", async () => {
        const api = window.ConnectedCaseAutosave;
        if (!api || typeof api.reconcileUncertainSave !== "function") return;
        reconcile.disabled = true;
        reconcile.textContent = "Checking server…";
        try { await api.reconcileUncertainSave(); }
        finally { MANAGER.refresh?.(); }
      });
      controls.appendChild(reconcile);
    }

    const copy = node("button", "", copyFeedback);
    copy.type = "button";
    copy.addEventListener("click", async () => {
      const payload = traceEntries.map(item => JSON.stringify(localizeTimestampFields(item))).join("\n") ||
        "No Connected WIP diagnostic events captured since this module loaded.";
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(payload);
          ok = true;
        }
      } catch (_) {}
      if (!ok) {
        const fallback = node("textarea", "");
        fallback.value = payload;
        fallback.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(fallback);
        fallback.select();
        try { ok = document.execCommand("copy"); } catch (_) {}
        fallback.remove();
      }
      copyFeedback = ok ? "Copied" : "Select log below to copy";
      copy.textContent = copyFeedback;
    });
    controls.appendChild(copy);
    host.appendChild(controls);

    const traceHeading = node("div", "r1146-note", "CONNECTED WIP SAVE TRACE · newest events at bottom");
    traceHeading.style.fontWeight = "700";
    traceHeading.style.marginTop = "12px";
    host.appendChild(traceHeading);

    const trace = node("textarea", "");
    trace.readOnly = true;
    trace.rows = 9;
    trace.setAttribute("aria-label", "Connected WIP diagnostic trace");
    trace.style.cssText = "display:block;box-sizing:border-box;width:100%;max-width:100%;margin-top:5px;font:10px/1.35 ui-monospace,monospace;white-space:pre;overflow:auto;background:#0b1220;color:#d1d5db;border:1px solid #475569;border-radius:5px;padding:6px;";
    trace.value = traceEntries.map(item => JSON.stringify(localizeTimestampFields(item))).join("\n") ||
      "Waiting for Connected WIP save events…\nTrace collection starts when this module loads.";
    host.appendChild(trace);

    host.appendChild(node("div", "r1146-note",
      "Read-only operational view. Save execution remains in ConnectedCaseAutosave and SupabaseCaseStorage. " +
      "Verify Uncertain Save appears only after an uncertain outcome and calls the existing read-only reconciliation function; it does not start a new save. " +
      "Trace is held in memory (maximum 100 events) and is not stored in CASE or local persistence."
    ));
  }

  window.addEventListener("supabase-wip-save-diagnostic", event => captureTrace(event?.detail || {}));
  window.addEventListener("connected-case-autosave-status", () => {
    copyFeedback = "Copy Diagnostic Log";
    if (typeof MANAGER.refresh === "function") MANAGER.refresh();
  });

  MANAGER.register({
    id: "connected-wip",
    title: "CONNECTED WIP",
    category: "Operational",
    render
  });

  console.info("[R1146.2] Connected WIP Diagnostics module registered.");
})();


/* ------------------------------------------------------------------------- */
/* MODULE 3 — STANDALONE RECOVERY                                              */
/* ------------------------------------------------------------------------- */

/*
 * R1146.4 — Standalone Recovery Diagnostics.
 * Read-only presentation adapter for CaseRecoveryDiagnostics.
 * Snapshot inspection is automatic and uses only IndexedDB readonly transactions.
 */
(function () {
  "use strict";

  const BUILD = "R1146.4";
  const MANAGER = window.DiagnosticsManager;
  let lastSnapshot = null;
  let snapshotReadAt = null;
  let snapshotReadError = null;
  let snapshotReadBusy = false;
  let snapshotReadRequested = false;

  if (!MANAGER || typeof MANAGER.register !== "function") {
    console.error("[R1146.4] DiagnosticsManager unavailable; Standalone Recovery module not registered.");
    return;
  }

  function node(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  }

  function addRow(host, label, value) {
    const line = node("div", "r1146-row");
    line.append(node("span", "", label), node("span", "r1146-value", value == null || value === "" ? "—" : String(value)));
    host.appendChild(line);
  }

  function formatLocalTimestamp(value) {
    if (value == null || value === "") return "—";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return String(value);
    const parts = new Intl.DateTimeFormat(undefined, {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZoneName: "short"
    }).format(date);
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return parts + " (UTC" + sign + String(Math.floor(abs / 60)).padStart(2, "0") + ":" + String(abs % 60).padStart(2, "0") + ")";
  }

  function redactRecoveryText(value) {
    return String(value || "")
      .replace(/\bCASE=[^;|]+/gi, "CASE=[REDACTED]")
      .replace(/\b(AP|LAT) image=[^;|]+/gi, "$1 image=[REDACTED]")
      .replace(/\b(?:caseId|patientId|ownerId|imageId|sha256|checksum)\s*[:=]\s*[^;|, ]+/gi, "[REDACTED]");
  }

  function getApi() { return window.CaseRecoveryDiagnostics || null; }

  function getData() {
    const api = getApi();
    if (!api) return { api: null, diagnostics: null, storage: null };
    let diagnostics = null, storage = null;
    try { diagnostics = api.getDiagnostics?.() || null; } catch (_) {}
    try { storage = api.getRecoveryStorageStatus?.() || null; } catch (_) {}
    return { api, diagnostics, storage };
  }

  // Coalesce overlapping notifications. A fresh read is queued if another
  // recovery event arrives while the readonly IndexedDB request is in flight.
  async function requestSnapshotRead() {
    snapshotReadRequested = true;
    if (snapshotReadBusy) return;
    snapshotReadBusy = true;
    try {
      while (snapshotReadRequested) {
        snapshotReadRequested = false;
        const api = getApi();
        if (!api || typeof api.readLatestFullCaseRecoverySnapshot !== "function") {
          snapshotReadError = "Read-only snapshot API is unavailable.";
          break;
        }
        try {
          lastSnapshot = await api.readLatestFullCaseRecoverySnapshot();
          snapshotReadAt = new Date().toISOString();
          snapshotReadError = null;
        } catch (error) {
          snapshotReadError = String(error?.message || error);
        }
      }
    } finally {
      snapshotReadBusy = false;
      MANAGER.refresh?.();
    }
  }

  function render(host) {
    const { api, diagnostics: d, storage: s } = getData();
    addRow(host, "Module build", BUILD);
    if (!api || !d || !s) {
      host.appendChild(node("div", "r1146-note", "CaseRecoveryDiagnostics is not available. Confirm case_recovery.js loaded successfully."));
      return;
    }

    addRow(host, "Operating mode", window.__APP_OPERATING_MODE || "unknown");
    addRow(host, "IndexedDB supported", s.supported ? "YES" : "NO");
    addRow(host, "Recovery active", s.standaloneRecoveryActive ? "YES" : "NO");
    addRow(host, "Event-driven capture", s.eventDrivenAutosaveEnabled ? "ENABLED" : "INACTIVE");
    addRow(host, "Legacy polling observer", s.legacyObserverActive ? "ACTIVE" : "INACTIVE");
    addRow(host, "Autosave paused", d.autosavePaused ? "YES" : "NO");
    addRow(host, "Full-case status", s.fullCaseStatus || "unknown");
    addRow(host, "Saved generation", s.fullCaseSavedGeneration ?? d.generation ?? 0);
    addRow(host, "Last saved", formatLocalTimestamp(s.fullCaseSavedAt));
    addRow(host, "CASE ready", d.caseReady ? "YES" : "NO");
    addRow(host, "Baseline established", d.baselineEstablished ? "YES" : "NO");
    addRow(host, "Pending changes", d.dirty ? "YES" : "NO");
    addRow(host, "Capture pending", d.eventCapturePending ? "YES" : "NO");
    addRow(host, "Capture in progress", d.fullCaseCaptureInProgress == null ? "—" : (d.fullCaseCaptureInProgress ? "YES" : "NO"));
    addRow(host, "Restore in progress", d.fullCaseRestoreInProgress ? "YES" : "NO");
    addRow(host, "Capture attempts", d.fullCaseCaptureAttempts ?? 0);
    addRow(host, "Successful commits", d.fullCaseSuccessfulCommits ?? 0);
    addRow(host, "Duplicate captures discarded", d.fullCaseDuplicateCapturesDiscarded ?? 0);
    addRow(host, "Retry attempts", d.fullCaseRetryAttempts ?? 0);
    addRow(host, "Next retry", formatLocalTimestamp(d.nextFullCaseRetryAt));
    addRow(host, "Last recovery event", d.lastEvent || "—");

    addRow(host, "Snapshot inspection", snapshotReadBusy ? "Updating…" : (snapshotReadAt ? "Live · checked " + formatLocalTimestamp(snapshotReadAt) : "Initializing…"));
    if (snapshotReadError) {
      const error = node("div", "r1146-note", "SNAPSHOT READ ERROR: " + snapshotReadError);
      error.style.color = "#fca5a5"; error.style.overflowWrap = "anywhere"; host.appendChild(error);
    } else if (lastSnapshot) {
      addRow(host, "Snapshot present", "YES");
      addRow(host, "Snapshot generation", lastSnapshot.generation ?? "—");
      addRow(host, "Snapshot saved", formatLocalTimestamp(lastSnapshot.savedAt));
      addRow(host, "Snapshot schema", lastSnapshot.schema || "—");
      addRow(host, "AP observations", lastSnapshot.xray?.AP?.observation?.annotations?.length ?? "—");
      addRow(host, "LAT observations", lastSnapshot.xray?.LAT?.observation?.annotations?.length ?? "—");
    } else if (snapshotReadAt) {
      addRow(host, "Snapshot present", "NO");
    } else {
      addRow(host, "Snapshot present", "Checking IndexedDB…");
    }

    if (s.fullCaseLastError) {
      const error = node("div", "r1146-note", "LAST RECOVERY ERROR: " + redactRecoveryText(s.fullCaseLastError));
      error.style.color = "#fca5a5"; error.style.overflowWrap = "anywhere"; host.appendChild(error);
    }

    const history = node("textarea", "");
    history.readOnly = true; history.rows = 9;
    history.setAttribute("aria-label", "Standalone Recovery diagnostic event history");
    history.style.cssText = "display:block;box-sizing:border-box;width:100%;max-width:100%;margin-top:5px;font:10px/1.35 ui-monospace,monospace;white-space:pre;overflow:auto;background:#0b1220;color:#d1d5db;border:1px solid #475569;border-radius:5px;padding:6px;";
    history.value = (Array.isArray(d.events) ? d.events.slice(-30) : []).map(item =>
      formatLocalTimestamp(item.time) + " | " + item.type + " | " + redactRecoveryText(item.reason) + (item.detail ? " | " + redactRecoveryText(item.detail) : "")
    ).join("\n") || "No recovery events recorded.";
    host.appendChild(history);

    const copy = node("button", "", recoveryCopyFeedback);
    copy.type = "button";
    copy.addEventListener("click", async () => {
      const events = Array.isArray(d.events) ? d.events : [];
      const payload = events.map(item => JSON.stringify({
        ...item,
        reason: redactRecoveryText(item.reason),
        detail: redactRecoveryText(item.detail),
        time: formatLocalTimestamp(item.time)
      })).join("\n") || "No Standalone Recovery diagnostic events recorded.";
      let ok = false;
      try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(payload); ok = true; } } catch (_) {}
      if (!ok) {
        const area = node("textarea", ""); area.value = payload;
        area.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(area); area.select();
        try { ok = document.execCommand("copy"); } catch (_) {}
        area.remove();
      }
      recoveryCopyFeedback = ok ? "Copied" : "Copy unavailable";
      copy.textContent = recoveryCopyFeedback;
    });
    const controls = node("div", "");
    controls.style.cssText = "display:flex;gap:7px;flex-wrap:wrap;margin:10px 0;";
    controls.appendChild(copy);
    host.appendChild(controls);

    host.appendChild(node("div", "r1146-note",
      "Read-only diagnostics. Snapshot inspection refreshes automatically on recovery events using an IndexedDB readonly transaction. " +
      "Capture, verify, restore, mode changes and persistence remain owned by CaseRecoveryDiagnostics. " +
      "Times are formatted in this browser's local timezone; stored timestamps remain UTC ISO values."));
  }

  let recoveryCopyFeedback = "Copy Recovery Diagnostic Log";
  window.addEventListener("case-recovery-diagnostics-updated", () => {
    recoveryCopyFeedback = "Copy Recovery Diagnostic Log";
    void requestSnapshotRead();
    MANAGER.refresh?.();
  });
  ["application-operating-mode-changed", "case-data-changed", "case-change-diagnostics-updated"].forEach(name => {
    window.addEventListener(name, () => {
      MANAGER.refresh?.();
      if (name === "application-operating-mode-changed") void requestSnapshotRead();
    });
  });

  MANAGER.register({
    id: "standalone-recovery",
    title: "STANDALONE RECOVERY",
    category: "Operational",
    render
  });
  void requestSnapshotRead();
  console.info("[R1146.4] Standalone Recovery Diagnostics module registered.");
})();


/* ------------------------------------------------------------------------- */
/* R1146.8 — CURRENT CASE INSPECTOR                          */
/* ------------------------------------------------------------------------- */
(function () {
  "use strict";
  const MANAGER = window.DiagnosticsManager;
  if (!MANAGER || typeof MANAGER.register !== "function") return;

  // Stable, hidden producer targets preserve the existing shared.js contracts.
  // They live in the persistent document shell, not the cached Patient workspace.
  function ensureSink(id, tag) {
    let element = document.getElementById(id);
    if (!element) {
      const holder = document.getElementById("r1146DiagnosticProducerSinks") || (() => {
        const node = document.createElement("div");
        node.id = "r1146DiagnosticProducerSinks";
        node.hidden = true;
        node.setAttribute("aria-hidden", "true");
        document.body.appendChild(node);
        return node;
      })();
      element = document.createElement(tag || "pre");
      element.id = id;
      holder.appendChild(element);
    }
    return element;
  }
  const plannerSink = ensureSink("plannerValidationInspector", "pre");
  const workspaceSink = ensureSink("workspaceManagerInspector", "pre");
  const currentCaseSink = ensureSink("currentCaseInspector", "pre");

  // updateValidationSummary() creates this sibling before plannerSink.
  // Ensure it is also contained by the hidden holder if/when created.
  const sinkHolder = document.getElementById("r1146DiagnosticProducerSinks");
  if (sinkHolder) {
    const existingSummary = document.getElementById("plannerValidationSummary");
    if (existingSummary && existingSummary.parentElement !== sinkHolder) sinkHolder.appendChild(existingSummary);
  }

  const styles = document.createElement("style");
  styles.textContent = `
    #r1146DiagnosticProducerSinks{display:none!important}
    .r1146-diagnostic-pre{display:block;box-sizing:border-box;width:100%;max-height:52vh;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#0b1220;color:#d1d5db;border:1px solid #475569;border-radius:6px;padding:9px;font:11px/1.45 ui-monospace,monospace}
    .r1146-diagnostic-actions{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}
  `;
  document.head.appendChild(styles);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function action(label, handler) {
    const button = el("button", "", label);
    button.type = "button";
    button.addEventListener("click", handler);
    return button;
  }
  async function copyText(text, button) {
    let ok = false;
    try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); ok = true; } } catch (_) {}
    if (!ok) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(area); area.select();
      try { ok = document.execCommand("copy"); } catch (_) {}
      area.remove();
    }
    if (button) button.textContent = ok ? "Copied" : "Copy unavailable";
    return ok;
  }

  let plannerCopyLabel = "Copy Validation Report";
  let repoStatus = "Waiting for CaseRepository API.";
  let repoOutput = "No tests run yet.";
  let repoList = "Not loaded.";
  let repoBusy = false;
  let repoInitialized = false;
  const PROBE_KEY = "r909.caseRepository.persistenceProbeId";

  const repo = () => {
    if (!window.CaseRepository) throw new Error("window.CaseRepository is missing. Confirm /case_file_service.js is loaded.");
    return window.CaseRepository;
  };
  const setRepoStatus = (status, detail) => {
    repoStatus = "R909 — " + status;
    if (detail !== undefined) repoOutput = typeof detail === "string" ? detail : JSON.stringify(detail, null, 2);
    MANAGER.refresh?.();
  };
  async function refreshRepoList() {
    const rows = await repo().listCases();
    repoList = rows.length ? JSON.stringify(rows, null, 2) : "(No saved local cases.)";
    return rows;
  }
  async function initializeRepo() {
    if (repoInitialized) return;
    repoBusy = true; repoStatus = "R909 — INITIALIZING";
    MANAGER.refresh?.();
    try {
      const api = repo(); await api.init();
      const info = await api.storageStatus();
      await refreshRepoList();
      repoInitialized = true;
      repoStatus = "R909 — READY · " + api.VERSION;
      repoOutput = JSON.stringify(info, null, 2);
    } catch (error) {
      repoStatus = "R909 — NOT READY";
      repoOutput = String(error.stack || error);
    } finally { repoBusy = false; MANAGER.refresh?.(); }
  }

  async function runRepoTests() {
    if (repoBusy) return;
    repoBusy = true; repoStatus = "R909 — RUNNING STORAGE TESTS"; MANAGER.refresh?.();
    const log = []; let first = null, duplicate = null;
    try {
      const api = repo(); await api.init();
      log.push("PASS: IndexedDB init (" + api.VERSION + ")");
      const before = await api.listCases(); log.push("PASS: listCases() returned " + before.length + " row(s)");
      const caseData = { metadata: { case_name: "R909 TEST — temporary CRUD record" }, diagnostic: { testOnly: true } };
      const xray = { AP: { schemaVersion: "r909-test", testPayload: "AP" }, LAT: { schemaVersion: "r909-test", testPayload: "LAT" } };
      first = await api.createCase({ name: "R909 TEST — temporary CRUD record", caseData, xray });
      log.push("PASS: createCase() revision=" + first.revision + ", id=" + first.caseId);
      const read = await api.getCase(first.caseId);
      if (!read || read.xray.AP.testPayload !== "AP" || read.xray.LAT.testPayload !== "LAT") throw new Error("Read-back did not preserve both AP/LAT payload slots.");
      log.push("PASS: getCase() preserved CASE and AP/LAT test payloads");
      const updated = await api.saveCase(first.caseId, { name: first.name, expectedRevision: first.revision, caseData: { ...read.caseData, diagnostic: { testOnly: true, updated: true } }, xray: read.xray });
      if (updated.revision !== first.revision + 1) throw new Error("Revision did not increment after saveCase().");
      log.push("PASS: saveCase() updated record and incremented revision");
      try { await api.saveCase(first.caseId, { name: first.name, expectedRevision: first.revision, caseData: read.caseData, xray: read.xray }); throw new Error("Stale revision was incorrectly accepted."); }
      catch (error) { if (error.code !== "REVISION_CONFLICT") throw error; log.push("PASS: stale revision rejected (REVISION_CONFLICT)"); }
      duplicate = await api.duplicateCase(first.caseId, "R909 TEST — temporary duplicate");
      log.push("PASS: duplicateCase() created a separate ID");
      const renamed = await api.renameCase(duplicate.caseId, "R909 TEST — temporary renamed duplicate", duplicate.revision);
      if (renamed.caseId !== duplicate.caseId || renamed.revision !== duplicate.revision + 1) throw new Error("Rename changed identity or failed revision increment.");
      log.push("PASS: renameCase() preserved identity and incremented revision");
      await api.deleteCase(duplicate.caseId, renamed.revision); duplicate = null;
      log.push("PASS: deleteCase() removed temporary duplicate");
      await api.deleteCase(first.caseId, updated.revision); first = null;
      log.push("PASS: deleteCase() removed temporary CRUD record");
      await refreshRepoList(); log.push("PASS: final list refresh");
      setRepoStatus("ALL TESTS PASSED · temporary test records cleaned up", log.join("\n"));
    } catch (error) {
      log.push("FAIL: " + String(error.stack || error));
      try { if (duplicate) await repo().deleteCase(duplicate.caseId, duplicate.revision); } catch (_) {}
      try { if (first) { const latest = await repo().getCase(first.caseId); if (latest) await repo().deleteCase(latest.caseId, latest.revision); } } catch (_) {}
      try { await refreshRepoList(); } catch (_) {}
      setRepoStatus("TEST FAILED", log.join("\n"));
    } finally { repoBusy = false; MANAGER.refresh?.(); }
  }

  async function createProbe() {
    if (repoBusy) return;
    repoBusy = true; MANAGER.refresh?.();
    try {
      const api = repo(); await api.init();
      const oldId = localStorage.getItem(PROBE_KEY);
      if (oldId) { try { const old = await api.getCase(oldId); if (old) await api.deleteCase(old.caseId, old.revision); } catch (_) {} }
      const record = await api.createCase({
        name: "R909 TEST — reload persistence probe",
        caseData: { metadata: { case_name: "R909 TEST — reload persistence probe" }, diagnostic: { testOnly: true, purpose: "reload-persistence" } },
        xray: { AP: null, LAT: null }
      });
      localStorage.setItem(PROBE_KEY, record.caseId);
      await refreshRepoList();
      setRepoStatus("PROBE CREATED · reload the application, then check the probe.", {
        caseId: record.caseId, revision: record.revision,
        note: "This intentionally leaves one clearly labelled test record until deleted."
      });
    } catch (error) { setRepoStatus("PROBE CREATE FAILED", String(error.stack || error)); }
    finally { repoBusy = false; MANAGER.refresh?.(); }
  }
  async function checkProbe() {
    if (repoBusy) return;
    repoBusy = true; MANAGER.refresh?.();
    try {
      const api = repo(); await api.init(); const id = localStorage.getItem(PROBE_KEY);
      if (!id) { setRepoStatus("NO PROBE ID", "Create the persistence probe first."); return; }
      const record = await api.getCase(id);
      if (!record) { setRepoStatus("PROBE NOT FOUND", { caseId: id, message: "The probe ID remains in localStorage but the IndexedDB record is missing." }); return; }
      setRepoStatus("PERSISTENCE PASS · record survived application reload", {
        caseId: record.caseId, name: record.name, revision: record.revision, createdAt: record.createdAt
      });
      await refreshRepoList();
    } catch (error) { setRepoStatus("PROBE CHECK FAILED", String(error.stack || error)); }
    finally { repoBusy = false; MANAGER.refresh?.(); }
  }
  async function deleteProbe() {
    if (repoBusy) return;
    repoBusy = true; MANAGER.refresh?.();
    try {
      const api = repo(); await api.init(); const id = localStorage.getItem(PROBE_KEY);
      if (!id) { setRepoStatus("NO PROBE TO DELETE"); return; }
      const record = await api.getCase(id); if (record) await api.deleteCase(record.caseId, record.revision);
      localStorage.removeItem(PROBE_KEY); await refreshRepoList();
      setRepoStatus("PROBE DELETED · no persistence test record remains");
    } catch (error) { setRepoStatus("PROBE DELETE FAILED", String(error.stack || error)); }
    finally { repoBusy = false; MANAGER.refresh?.(); }
  }

  MANAGER.register({
    id: "patient-local-repository",
    title: "LOCAL CASE REPOSITORY",
    category: "Development",
    render(host) {
      const intro = el("div", "r1146-note", "R909 IndexedDB engineering tests. These operations use clearly labelled temporary records and do not mutate window.currentCase or X-ray workspaces.");
      host.appendChild(intro);
      const controls = el("div", "r1146-diagnostic-actions");
      controls.append(
        action(repoBusy ? "Working…" : "Run storage tests", runRepoTests),
        action("Create reload-persistence probe", createProbe),
        action("Check probe after reload", checkProbe),
        action("Delete probe", deleteProbe),
        action("Refresh saved-case list", async () => {
          try { await refreshRepoList(); setRepoStatus("LIST REFRESHED"); }
          catch (error) { setRepoStatus("ERROR", String(error.stack || error)); }
        })
      );
      controls.querySelectorAll("button").forEach(button => button.disabled = repoBusy);
      host.append(controls, el("div", "r1146-row", repoStatus));
      const out = el("pre", "r1146-diagnostic-pre", repoOutput);
      host.appendChild(out);
      host.appendChild(el("div", "r1146-note", "Saved local cases (metadata only)"));
      host.appendChild(el("pre", "r1146-diagnostic-pre", repoList));
      if (!repoInitialized && !repoBusy) void initializeRepo();
    }
  });

  // R1171.1 — obsolete Runtime / Debug Log tab retired.

  MANAGER.register({
    id: "current-case-inspector",
    title: "CURRENT CASE INSPECTOR",
    category: "Operational",
    render(host) {
      // Do not refresh the producer while rendering: the stable hidden sink is
      // observed by MutationObserver and refreshing here would create a render loop.
      const current = window.currentCase;
      const metadata = current?.metadata || {};
      const controls = el("div", "r1146-diagnostic-actions");
      const copy = action("Copy CASE JSON", async () => {
        const ok = await copyText(currentCaseSink.textContent || "", copy);
        copy.textContent = ok ? "Copied" : "Copy unavailable";
      });
      const refresh = action("Refresh CASE view", () => {
        if (typeof window.updateCurrentCaseInspector === "function") window.updateCurrentCaseInspector();
        MANAGER.refresh?.();
      });
      controls.append(refresh, copy);
      host.append(controls,
        el("div", "r1146-row", "Case: " + (metadata.case_name || "(unnamed)")),
        el("div", "r1146-row", "Inspector source: browser window.currentCase"),
        el("div", "r1146-note", "Full CASE JSON is shown below. This module is available only while Developer Mode is enabled. Treat the contents as potentially identifying clinical data; do not copy or share it unless appropriate."),
        el("pre", "r1146-diagnostic-pre", currentCaseSink.textContent || "No current CASE is available yet."));
    }
  });

  MANAGER.register({
    id: "planner-validation",
    title: "PLANNER VALIDATION",
    category: "Engineering",
    render(host) {
      const summary = document.getElementById("plannerValidationSummary");
      const controls = el("div", "r1146-diagnostic-actions");
      const copy = action(plannerCopyLabel, async () => {
        plannerCopyLabel = await copyText((summary?.textContent ? summary.textContent + "\n\n" : "") + (plannerSink.textContent || "No planner validation report yet."), copy) ? "Copied" : "Copy unavailable";
      });
      controls.appendChild(copy);
      host.append(controls, el("div", "r1146-row", summary?.textContent || "No validation summary yet."));
      host.appendChild(el("pre", "r1146-diagnostic-pre", plannerSink.textContent || "Planner validation has not run in this session."));
      host.appendChild(el("div", "r1146-note", "Read-only view of the existing planner regression-validation output. Planner algorithms and validation producers are unchanged."));
    }
  });

  // Legacy producers update their stable hidden sinks. Refresh only the visible
  // module when those sinks change; no timers or polling are introduced.
  let mutationQueued = false;
  const observer = new MutationObserver(() => {
    if (mutationQueued) return;
    mutationQueued = true;
    queueMicrotask(() => {
      mutationQueued = false;
      plannerCopyLabel = "Copy Validation Report";
      MANAGER.refresh?.();
    });
  });
  [plannerSink, workspaceSink, currentCaseSink].forEach(target => observer.observe(target, { childList: true, characterData: true, subtree: true }));
})();
