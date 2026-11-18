// R1172.9.4 — Backward-compatible feature alias.
// app_config.js is the single source of truth and must load first.
(function(root){
  'use strict';
  if (!root.APP_CONFIG || !root.APP_CONFIG.application) {
    throw new Error("APP_CONFIG must load before app_features.js");
  }
  root.APP_FEATURES = root.APP_CONFIG.application;
})(typeof window !== 'undefined' ? window : globalThis);
