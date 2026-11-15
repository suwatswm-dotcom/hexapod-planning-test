/*
 * R1146.5 — Connected Mode event-triggered WIP autosave with on-page save trace.
 *
 * Reuses the existing CaseChangeCoordinator event and the existing
 * SupabaseCaseStorage.saveCurrentWorkingCopy() persistence pipeline.
 * Does not implement a second CASE/AP/LAT capture or recovery pipeline.
 * Does not write to IndexedDB and never creates immutable revisions.
 */
(function installConnectedCaseAutosave(global) {
  'use strict';

  if (global.ConnectedCaseAutosave?.VERSION === 'R1146.5') return;

  const SELECTED_CASE_KEY = 'orthopedic.supabaseCaseStorage.selectedCaseId.v1';
  const DEBOUNCE_MS = 1200;
  const TRACE_LIMIT = 100;
  const traceEntries = [];
  let traceArea = null;
  let traceCopyStatus = null;
  const state = {
    timer: null,
    suspended: false,
    inFlight: null,
    eventSerial: 0,
    savedSerial: 0,
    saveCount: 0,
    lastEvent: null,
    lastSave: null,
    lastError: null,
    status: 'Waiting for Connected Mode and a selected cloud CASE.',
    statusKind: 'info',
    lastTargetId: null,
    uncertainAttempt: null,
    statusNode: null,
    reconcileButton: null,
    reconciling: false
  };

  function selectedCloudCaseId() {
    try { return String(global.localStorage.getItem(SELECTED_CASE_KEY) || '').trim(); }
    catch (_) { return ''; }
  }

  function activeCloudCaseId() {
    return String(global.currentCase?.metadata?.cloud_case_id || '').trim();
  }

  function transactionDepth() {
    try { return Number(global.CaseChangeCoordinator?.getDiagnostics?.()?.transactionDepth || 0); }
    catch (_) { return 0; }
  }

  function diagnostics() {
    return {
      version: 'R1146.5',
      mode: global.__APP_OPERATING_MODE || 'unknown',
      active: isEligible(),
      selectedCloudCaseId: selectedCloudCaseId() || null,
      activeCloudCaseId: activeCloudCaseId() || null,
      pendingEvents: Math.max(0, state.eventSerial - state.savedSerial),
      eventSerial: state.eventSerial,
      savedSerial: state.savedSerial,
      saving: !!state.inFlight,
      saveCount: state.saveCount,
      lastEvent: state.lastEvent,
      lastSave: state.lastSave,
      lastError: state.lastError,
      uncertainAttempt: state.uncertainAttempt ? { caseId: state.uncertainAttempt.caseId, generationId: state.uncertainAttempt.generationId, expectedVersion: state.uncertainAttempt.expectedVersion } : null,
      reconciling: !!state.reconciling,
      status: state.status,
      statusKind: state.statusKind
    };
  }

  function renderStatus(message, kind = 'info') {
    state.status = String(message || '');
    state.statusKind = kind;
    const panel = global.document?.getElementById('connectedAutosaveDiagnosticPanel');
    if (panel) {
      if (state.statusNode) state.statusNode.textContent = 'R1146.5 CONNECTED WIP AUTOSAVE · ' + state.status;
      else panel.textContent = 'R1146.5 CONNECTED WIP AUTOSAVE · ' + state.status;
      panel.dataset.state = kind;
      if (state.reconcileButton) state.reconcileButton.hidden = !state.uncertainAttempt || state.reconciling;
    }
    global.dispatchEvent(new CustomEvent('connected-case-autosave-status', { detail: diagnostics() }));
  }

  function ensurePanel() {
    if (!global.document || global.document.getElementById('connectedAutosaveDiagnosticPanel')) return;
    const panel = global.document.createElement('div');
    panel.id = 'connectedAutosaveDiagnosticPanel';
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');
    panel.style.cssText = 'font:12px/1.4 monospace;padding:6px 10px;border-top:1px solid #aaa;overflow-wrap:anywhere;';
    const anchor = global.document.getElementById('caseChangeDiagnosticPanel') || global.document.getElementById('statusBar');
    if (anchor?.parentNode) anchor.parentNode.insertBefore(panel, anchor.nextSibling);
    else global.document.body?.appendChild(panel);
    const label = global.document.createElement('span');
    label.textContent = 'R1146.5 CONNECTED WIP AUTOSAVE · ' + state.status;
    panel.appendChild(label);
    state.statusNode = label;
    const button = global.document.createElement('button');
    button.type = 'button';
    button.textContent = 'Verify Uncertain Save';
    button.hidden = true;
    button.style.cssText = 'margin-left:10px;font:inherit;padding:3px 8px;cursor:pointer;';
    button.addEventListener('click', () => { void reconcileUncertainSave(); });
    panel.appendChild(button);
    state.reconcileButton = button;

    const traceHeading = global.document.createElement('div');
    traceHeading.textContent = 'R1146.5 SAVE TRACE · newest events at bottom';
    traceHeading.style.cssText = 'margin-top:8px;font-weight:600;';
    panel.appendChild(traceHeading);

    traceArea = global.document.createElement('textarea');
    traceArea.id = 'connectedAutosaveTraceLog';
    traceArea.readOnly = true;
    traceArea.rows = 7;
    traceArea.setAttribute('aria-label', 'Connected WIP save diagnostic log');
    traceArea.style.cssText = 'display:block;box-sizing:border-box;width:100%;max-width:100%;margin-top:4px;font:11px/1.35 monospace;white-space:pre;overflow:auto;';
    traceArea.value = 'Waiting for the next WIP save diagnostic event…';
    panel.appendChild(traceArea);

    const copyButton = global.document.createElement('button');
    copyButton.type = 'button';
    copyButton.textContent = 'Copy Diagnostic Log';
    copyButton.style.cssText = 'margin-top:5px;font:inherit;padding:4px 9px;cursor:pointer;';
    copyButton.addEventListener('click', async () => {
      const text = traceEntries.map(entry => JSON.stringify(entry)).join('\n') || 'No WIP save diagnostic events captured.';
      let copied = false;
      try {
        if (global.navigator?.clipboard?.writeText) {
          await global.navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch (_) { /* iOS Safari may deny clipboard API outside a secure gesture context. */ }
      if (!copied && traceArea) {
        traceArea.focus();
        traceArea.select();
        try { copied = !!global.document.execCommand?.('copy'); } catch (_) { copied = false; }
      }
      if (traceCopyStatus) traceCopyStatus.textContent = copied
        ? 'Copied. Paste the log into this chat.'
        : 'Text selected; use Copy from the iPad selection menu.';
    });
    panel.appendChild(copyButton);
    traceCopyStatus = global.document.createElement('span');
    traceCopyStatus.style.cssText = 'display:block;margin-top:3px;';
    panel.appendChild(traceCopyStatus);
  }

  function appendTrace(detail) {
    const entry = detail && typeof detail === 'object' ? detail : { value: String(detail) };
    traceEntries.push(entry);
    if (traceEntries.length > TRACE_LIMIT) traceEntries.splice(0, traceEntries.length - TRACE_LIMIT);
    if (traceArea) traceArea.value = traceEntries.map(item => JSON.stringify(item)).join('\n');
    if (traceArea) traceArea.scrollTop = traceArea.scrollHeight;
  }

  function isEligible() {
    if (state.suspended) return false;
    if (global.__APP_OPERATING_MODE !== 'connected') return false;
    if (global.__APP_MODE_TRANSITION_PENDING === true) return false;
    if (global.__APP_STARTUP_STATE !== 'ready') return false;
    if (transactionDepth() > 0) return false;
    const selectedId = selectedCloudCaseId();
    const activeId = activeCloudCaseId();
    return !!selectedId && !!activeId && selectedId === activeId;
  }

  function clearTimer() {
    if (state.timer !== null) global.clearTimeout(state.timer);
    state.timer = null;
  }

  function currentTarget() {
    if (!isEligible()) return null;
    const id = selectedCloudCaseId();
    return {
      caseId: id,
      caseName: String(global.currentCase?.metadata?.case_name || 'Selected cloud case')
    };
  }

  function schedule() {
    clearTimer();
    if (!isEligible() || state.eventSerial <= state.savedSerial) return;
    state.timer = global.setTimeout(() => {
      state.timer = null;
      void savePendingChanges();
    }, DEBOUNCE_MS);
  }

  async function savePendingChanges() {
    const target = currentTarget();
    if (!target) {
      renderStatus('PAUSED · Connected mode, selected cloud CASE, startup readiness, or transaction guard is not satisfied.');
      return { saved: false, reason: 'not-eligible' };
    }
    if (state.inFlight) {
      // Keep the newest edit pending. The in-flight save's finally block schedules
      // another full WIP save after the first version-checked commit completes.
      return { saved: false, reason: 'save-in-progress' };
    }
    if (state.eventSerial <= state.savedSerial) return { saved: false, reason: 'no-pending-change' };

    const capturedSerial = state.eventSerial;
    const api = global.SupabaseCaseStorage;
    if (!api || typeof api.saveCurrentWorkingCopy !== 'function') {
      state.lastError = 'SupabaseCaseStorage.saveCurrentWorkingCopy is unavailable.';
      renderStatus('ERROR · ' + state.lastError, 'error');
      return { saved: false, reason: 'api-unavailable' };
    }

    renderStatus('SAVING · ' + target.caseName + ' · capturing current CASE and AP/LAT through the existing Supabase pipeline…');
    state.lastError = null;
    const work = api.saveCurrentWorkingCopy({
      caseId: target.caseId,
      saveSource: 'connected-autosave',
      commitPatient: false,
      shouldContinue: () => isEligible() && selectedCloudCaseId() === target.caseId && activeCloudCaseId() === target.caseId
    });
    state.inFlight = work;
    try {
      const result = await work;
      // The storage call was bound to the target captured before it began. If the
      // user switched cloud cases during the request, do not report the new target
      // as saved; the completed write remains associated with the original caseId.
      state.savedSerial = Math.max(state.savedSerial, capturedSerial);
      state.uncertainAttempt = null;
      state.saveCount++;
      state.lastSave = {
        caseId: target.caseId,
        workingCopyVersion: result.workingCopyVersion,
        updatedAt: result.updatedAt || null,
        saveGenerationId: result.saveGenerationId || null
      };
      state.lastTargetId = target.caseId;
      const stillSameTarget = currentTarget()?.caseId === target.caseId;
      const cleanup = result.cleanupWarning ? ' · cleanup warning: ' + result.cleanupWarning : '';
      renderStatus((stillSameTarget ? 'SAVED' : 'SAVED PREVIOUS TARGET') +
        ' · ' + target.caseName + ' · WIP v' + result.workingCopyVersion +
        (result.updatedAt ? ' · ' + new Date(result.updatedAt).toLocaleString() : '') + cleanup,
        result.cleanupWarning ? 'warning' : 'success');
      return { saved: true, result, targetChanged: !stillSameTarget };
    } catch (error) {
      state.lastError = String(error?.message || error);
      if (error?.code === 'WIP_SAVE_OUTCOME_UNCERTAIN') {
        state.uncertainAttempt = {
          caseId: target.caseId,
          caseName: target.caseName,
          generationId: error.generationId || null,
          expectedVersion: error.expectedVersion ?? null,
          message: state.lastError
        };
        renderStatus('SAVE OUTCOME UNCERTAIN · ' + target.caseName + ' · ' +
          (error.generationId ? 'generation ' + error.generationId : 'generation ID unavailable') +
          ' · no retry has been started. Use Check WIP status for a read-only server check.', 'warning');
      } else {
        state.uncertainAttempt = null;
        renderStatus('SAVE FAILED · ' + state.lastError + ' · no automatic retry until another committed edit.', 'error');
      }
      return { saved: false, error: state.lastError, code: error?.code || null };
    } finally {
      if (state.inFlight === work) state.inFlight = null;
      if (state.eventSerial > state.savedSerial && isEligible() && !state.lastError) schedule();
    }
  }

  async function reconcileUncertainSave() {
    const attempt = state.uncertainAttempt;
    if (!attempt || state.reconciling) return { checked: false, reason: 'no-uncertain-save' };
    if (!attempt.generationId) {
      renderStatus('OUTCOME STILL UNCERTAIN · no generation ID was returned; inspect the cloud WIP manually.', 'warning');
      return { checked: false, reason: 'generation-id-unavailable' };
    }
    const api = global.SupabaseCaseStorage;
    if (!api || typeof api.getWorkingCopy !== 'function') {
      renderStatus('OUTCOME STILL UNCERTAIN · read-only Supabase WIP lookup is unavailable.', 'warning');
      return { checked: false, reason: 'read-api-unavailable' };
    }
    state.reconciling = true;
    if (state.reconcileButton) state.reconcileButton.hidden = true;
    renderStatus('CHECKING WIP · read-only lookup for generation ' + attempt.generationId + '…');
    try {
      const row = await api.getWorkingCopy(attempt.caseId);
      if (row?.save_generation_id === attempt.generationId) {
        state.uncertainAttempt = null;
        state.lastError = null;
        state.lastSave = {
          caseId: attempt.caseId,
          workingCopyVersion: Number(row.working_copy_version),
          updatedAt: row.updated_at || null,
          saveGenerationId: row.save_generation_id
        };
        state.lastTargetId = attempt.caseId;
        renderStatus('SAVED · ' + attempt.caseName + ' · WIP v' + row.working_copy_version +
          ' · generation confirmed by read-only server check' +
          (row.updated_at ? ' · ' + new Date(row.updated_at).toLocaleString() : ''), 'success');
        return { checked: true, committed: true, row };
      }
      const currentVersion = row ? Number(row.working_copy_version) : 0;
      renderStatus('GENERATION NOT CURRENT · the WIP row does not contain attempted generation ' +
        attempt.generationId + (row ? ' · current WIP v' + currentVersion +
        ' · current generation ' + (row.save_generation_id || 'unknown') : ' · no WIP row exists') +
        '. No write or retry was performed.', 'warning');
      return { checked: true, committed: false, row: row || null };
    } catch (error) {
      renderStatus('OUTCOME STILL UNCERTAIN · read-only WIP lookup failed: ' + String(error?.message || error), 'warning');
      return { checked: false, error: String(error?.message || error) };
    } finally {
      state.reconciling = false;
      if (state.reconcileButton) state.reconcileButton.hidden = !state.uncertainAttempt;
      // Publish the completed reconciliation state after the in-flight flag
      // is cleared so external diagnostics can render the final button state.
      global.dispatchEvent(new CustomEvent('connected-case-autosave-status', { detail: diagnostics() }));
    }
  }

  function onCaseChange(event) {
    const detail = event?.detail;
    if (!detail || detail.version !== 1 || !['case', 'xray'].includes(detail.domain)) return;

    // A restore/replacement establishes the selected cloud CASE baseline; it is
    // not a user edit and must never immediately write itself back as autosave.
    if (detail.operation === 'restore' || detail.operation === 'replace' || detail.source === 'recovery') {
      renderStatus('READY · restore/replacement event ignored; waiting for the next committed user edit.');
      return;
    }

    if (!isEligible()) return;

    // Coordinator caseId identifies the application CASE, not the Supabase UUID.
    // When it is present, verify it still describes the active CASE identity.
    if (detail.caseId != null) {
      const c = global.currentCase;
      const appIds = [c?.metadata?.case_id, c?.metadata?.case_uuid, c?.metadata?.id, c?.case_id]
        .filter(value => value != null).map(String);
      if (appIds.length && !appIds.includes(String(detail.caseId))) return;
    }

    state.eventSerial++;
    state.lastEvent = {
      sequence: detail.sequence,
      domain: detail.domain,
      source: detail.source,
      operation: detail.operation,
      reason: detail.reason,
      at: detail.timestamp
    };
    state.lastError = null;
    renderStatus('CHANGE PENDING · ' + currentTarget().caseName + ' · ' +
      [detail.domain, detail.source, detail.reason].filter(Boolean).join(' / ') +
      ' · waiting ' + DEBOUNCE_MS + ' ms.');
    schedule();
  }

  global.addEventListener('supabase-wip-save-diagnostic', event => appendTrace(event?.detail || { stage: 'diagnostic-event-without-detail' }));
  global.addEventListener('case-data-changed', onCaseChange);
  global.addEventListener('case-change-diagnostics-updated', event => {
    if (Number(event?.detail?.transactionDepth || 0) > 0) {
      clearTimer();
      renderStatus('PAUSED · CASE transaction active; no cloud save will start during restore or case switching.');
    }
  });
  global.addEventListener('application-operating-mode-changed', () => {
    if (global.__APP_OPERATING_MODE !== 'connected') {
      clearTimer();
      renderStatus('INACTIVE · Connected Mode is not active.');
    } else {
      renderStatus(isEligible()
        ? 'READY · selected cloud CASE is bound; waiting for a committed edit.'
        : 'WAITING · Connected Mode is active, but the selected cloud CASE identity is not yet confirmed.');
    }
  });

  async function deactivateAndDrain(reason) {
    state.suspended = true;
    clearTimer();
    renderStatus('PAUSED · ' + String(reason || 'operating-mode transition') + ' · waiting for any in-flight cloud write to settle.');
    const pending = state.inFlight;
    if (pending) {
      try { await pending; } catch (_) { /* the save status already records failure */ }
    }
    return { suspended: true, inFlightDrained: !state.inFlight };
  }

  function activate({ caseId } = {}) {
    const selected = selectedCloudCaseId();
    const active = activeCloudCaseId();
    if (!caseId || String(caseId) !== selected || selected !== active) {
      throw new Error('Cannot activate Connected autosave: selected cloud CASE and active CASE identity do not match.');
    }
    state.suspended = false;
    renderStatus('READY · ' + String(global.currentCase?.metadata?.case_name || 'Selected cloud case') + ' · Connected WIP autosave armed.');
    schedule();
    return diagnostics();
  }

  function deactivate(reason) {
    state.suspended = true;
    clearTimer();
    renderStatus('INACTIVE · ' + String(reason || 'Connected autosave deactivated') + '.');
    return diagnostics();
  }

  global.ConnectedCaseAutosave = Object.freeze({
    VERSION: 'R1146.5',
    getDiagnostics: diagnostics,
    saveNow: savePendingChanges,
    reconcileUncertainSave,
    activate,
    deactivate,
    deactivateAndDrain
  });

  if (global.document?.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', ensurePanel, { once: true });
  } else {
    ensurePanel();
  }
  renderStatus('LOADED · on-page save trace enabled; waiting for Connected Mode, completed startup recovery, and a matching selected cloud CASE.');
})(window);
