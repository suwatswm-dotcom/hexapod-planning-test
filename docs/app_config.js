/*
 * R1172.9.6 — Central hidden application and engineering configuration.
 * This file is loaded before application modules. Values here are system
 * configuration, not surgeon-facing treatment inputs.
 */
(function(root){
  'use strict';
  const application = Object.freeze({
    // Preserve the existing deliberate Standalone capability setting.
    standaloneModeEnabled: false
  });
  const planner = Object.freeze({
    mode: 'STRICT_JS',
    completionTolerance: Object.freeze({
      translationMm: 1.0,
      rotationDeg: 0.5
    }),
    dailyMovementLimit: Object.freeze({
      translationMm: 1.0,
      rotationDeg: 1.0
    }),
    numericalTolerance: 1e-6,
    progressEpsilon: Object.freeze({
      translationMm: 1e-8,
      rotationDeg: 1e-8
    }),
    stagnation: Object.freeze({ windowDays: 3 }),
    candidateSearch: Object.freeze({
      primaryStrategy: 'FLOOR_CEIL_64',
      expandedFallbackEnabled: true,
      expandedFallbackStrategy: 'INTEGER_NEIGHBORHOOD_729',
      neighborhoodRadiusMm: 1
    })
  });
  const diagnostics = Object.freeze({
    // Master switch for the Global Diagnostics workspace and diagnostic data bridge.
    enabled: true,
    // Allow manual, on-demand inspection of the prepared SimulationFrameV1 from shared.js.
    captureSimulationContract: true,
    // Capture only viewer-specific runtime failures from the iframe.
    captureRuntimeErrors: true,
    // Verbose console tracing is deliberately separate from diagnostics capture.
    verboseLogging: false
  });
  root.APP_CONFIG = Object.freeze({
    version: 'R1172.9.10',
    application,
    planner,
    diagnostics
  });
  // Backward-compatible alias for existing modules. The value is derived
  // from APP_CONFIG; app_features.js no longer owns a second setting.
  root.APP_FEATURES = application;
})(typeof window !== 'undefined' ? window : globalThis);
