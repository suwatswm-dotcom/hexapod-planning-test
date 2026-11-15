/* R1145.2 — Central CASE change-event coordinator.
 *
 * This build establishes the event contract and visible diagnostics only.
 * It deliberately does NOT save to IndexedDB or Supabase and does NOT
 * automatically hook workspace commits yet.
 */
(function () {
    "use strict";

    if (window.CaseChangeCoordinator) {
        console.warn("[R1145.2] CaseChangeCoordinator already exists; keeping first instance.");
        return;
    }

    const EVENT_NAME = "case-data-changed";
    const VALID_DOMAINS = new Set(["case", "xray"]);
    const VALID_OPERATIONS = new Set([
        "update", "create", "import", "restore", "replace", "delete"
    ]);
    const VALID_SOURCES = new Set([
        "patient", "deformity", "frame", "mounting", "treatment",
        "phases", "reconstruction", "xray", "case-file", "recovery",
        "system", "unknown"
    ]);

    let sequence = 0;
    let transactionSequence = 0;
    const transactions = new Map();

    const counters = {
        emitted: 0,
        suppressed: 0,
        rejected: 0,
        byDomain: { case: 0, xray: 0 },
        bySource: {},
        byOperation: {},
        lastEvent: null,
        lastError: null
    };

    function activeTransaction() {
        return transactions.size > 0;
    }

    function currentCaseId() {
        const c = window.currentCase;
        return c?.metadata?.case_id ??
            c?.metadata?.case_uuid ??
            c?.metadata?.id ??
            c?.case_id ??
            null;
    }

    function snapshotDiagnostics() {
        return {
            version: 1,
            eventName: EVENT_NAME,
            sequence,
            transactionDepth: transactions.size,
            transactionReasons: Array.from(transactions.values()),
            counters: JSON.parse(JSON.stringify(counters)),
            operatingMode: window.__APP_OPERATING_MODE || "unknown",
            transitionPending: window.__APP_MODE_TRANSITION_PENDING === true,
            persistenceConnected: (window.__APP_OPERATING_MODE === "connected")
                ? !!window.ConnectedCaseAutosave && !!window.SupabaseCaseStorage
                : (window.__APP_OPERATING_MODE === "standalone")
                    ? !!window.CaseRecoveryDiagnostics?.isStandaloneRecoveryActive?.()
                    : false
        };
    }

    function emit(input) {
        try {
            if (!input || typeof input !== "object") {
                throw new Error("Event detail must be an object.");
            }

            const domain = String(input.domain || "");
            const operation = String(input.operation || "update");
            const source = String(input.source || "unknown");

            if (!VALID_DOMAINS.has(domain)) {
                throw new Error("Unsupported event domain: " + domain);
            }
            if (!VALID_OPERATIONS.has(operation)) {
                throw new Error("Unsupported event operation: " + operation);
            }
            if (!VALID_SOURCES.has(source)) {
                throw new Error("Unsupported event source: " + source);
            }

            if (activeTransaction()) {
                counters.suppressed++;
                return { accepted: false, suppressed: true, reason: "transaction" };
            }

            if (window.__APP_MODE_TRANSITION_PENDING === true ||
                window.__APP_OPERATING_MODE === "resolving") {
                counters.suppressed++;
                return { accepted: false, suppressed: true, reason: "application-not-ready" };
            }

            const eventCaseId = input.caseId ?? currentCaseId();
            const detail = Object.freeze({
                version: 1,
                sequence: ++sequence,
                source,
                domain,
                operation,
                caseId: eventCaseId == null ? null : String(eventCaseId),
                view: domain === "xray" ? (input.view === "LAT" ? "LAT" : input.view === "AP" ? "AP" : null) : null,
                reason: String(input.reason || ""),
                timestamp: Number.isFinite(input.timestamp) ? input.timestamp : Date.now()
            });

            if (domain === "xray" && !detail.view) {
                throw new Error("X-ray events require view 'AP' or 'LAT'.");
            }

            counters.emitted++;
            counters.byDomain[domain]++;
            counters.bySource[source] = (counters.bySource[source] || 0) + 1;
            counters.byOperation[operation] = (counters.byOperation[operation] || 0) + 1;
            counters.lastEvent = detail;
            counters.lastError = null;

            window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
            window.dispatchEvent(new CustomEvent("case-change-diagnostics-updated", {
                detail: snapshotDiagnostics()
            }));

            return { accepted: true, event: detail };
        } catch (error) {
            counters.rejected++;
            counters.lastError = String(error?.message || error);
            console.error("[R1145.2] CASE change event rejected:", error);
            window.dispatchEvent(new CustomEvent("case-change-diagnostics-updated", {
                detail: snapshotDiagnostics()
            }));
            return { accepted: false, error: counters.lastError };
        }
    }

    function beginTransaction(reason) {
        const token = "case-tx-" + (++transactionSequence);
        transactions.set(token, String(reason || "unspecified"));
        window.dispatchEvent(new CustomEvent("case-change-diagnostics-updated", {
            detail: snapshotDiagnostics()
        }));
        return token;
    }

    function endTransaction(token) {
        if (!transactions.has(token)) {
            counters.rejected++;
            counters.lastError = "Unknown or already closed transaction token.";
            return false;
        }
        transactions.delete(token);
        window.dispatchEvent(new CustomEvent("case-change-diagnostics-updated", {
            detail: snapshotDiagnostics()
        }));
        return true;
    }

    function resetDiagnostics() {
        counters.emitted = 0;
        counters.suppressed = 0;
        counters.rejected = 0;
        counters.byDomain = { case: 0, xray: 0 };
        counters.bySource = {};
        counters.byOperation = {};
        counters.lastEvent = null;
        counters.lastError = null;
        sequence = 0;
        window.dispatchEvent(new CustomEvent("case-change-diagnostics-updated", {
            detail: snapshotDiagnostics()
        }));
        return snapshotDiagnostics();
    }

    window.CaseChangeCoordinator = Object.freeze({
        EVENT_NAME,
        emit,
        beginTransaction,
        endTransaction,
        getDiagnostics: snapshotDiagnostics,
        resetDiagnostics
    });

    window.addEventListener("application-operating-mode-changed", function () {
        window.dispatchEvent(new CustomEvent("case-change-diagnostics-updated", {
            detail: snapshotDiagnostics()
        }));
    });

    console.info("[R1145.2] CASE change-event coordinator ready. Persistence is not connected.");
})();
