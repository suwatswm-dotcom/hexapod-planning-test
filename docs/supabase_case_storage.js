/*
 * Supabase Case Storage adapter — R1145.8 serialized Connected WIP saves.
 *
 * Requires on the page:
 *   1. Supabase JS v2 UMD: window.supabase.createClient
 *   2. Existing application scripts: CaseFileService + xray_reconstruction.js
 *
 * This file does NOT add UI, auto-sign-in, alter window.currentCase, or change ZIP behavior.
 * All writes require an authenticated user. Never use a service-role key in the browser.
 */
(function installSupabaseCaseStorage(global) {
  'use strict';
  if (global.SupabaseCaseStorage?.VERSION === 'R1145.8') return; // Preserve idempotency for this adapter revision only.

  let client = null;
  // One in-page WIP save queue per cloud CASE. Manual and automatic callers
  // enter through the same public method, so version-read/upload/RPC operations
  // for one CASE can never overlap. Different CASE IDs remain independent.
  const wipSaveQueues = new Map();
  const CONFIG_STORAGE_KEY = 'orthopedic.supabaseCaseStorage.config.v1';
  function readSavedConfig() {
    try {
      const value = JSON.parse(global.localStorage.getItem(CONFIG_STORAGE_KEY) || 'null');
      if (!value || typeof value.url !== 'string' || typeof value.publishableKey !== 'string' || !value.url || !value.publishableKey) return null;
      return { url: value.url, publishableKey: value.publishableKey };
    } catch (_) { return null; }
  }
  function saveConfig(url, publishableKey) {
    try { global.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ url, publishableKey })); }
    catch (_) { /* Session restoration will be unavailable if browser storage is disabled. */ }
  }

  function fail(message, code = 'SUPABASE_CASE_STORAGE_ERROR') {
    const error = new Error(message);
    error.code = code;
    return error;
  }
  function needClient() {
    if (!client) throw fail('Supabase client is not configured. Call configure(client) first.', 'NOT_CONFIGURED');
    return client;
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function emitWipSaveDiagnostic(detail) {
    try {
      global.dispatchEvent(new CustomEvent('supabase-wip-save-diagnostic', { detail: {
        timestamp: new Date().toISOString(), ...detail
      }}));
    } catch (_) { /* diagnostics must never affect persistence */ }
  }
  function safeName(value, fallback = 'case') {
    const name = String(value || fallback).trim();
    if (!name) throw fail('A non-empty case name is required.', 'INVALID_CASE_NAME');
    return name;
  }
  function safeExtension(fileName) {
    const last = String(fileName || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
    return (last && last.length <= 10) ? last : 'dcm';
  }
  function requiredCaseGroups(caseData) {
    if (!caseData || typeof caseData !== 'object' || Array.isArray(caseData)) throw fail('CASE must be a JSON object.');
    const required = ['metadata','patient','deformity','frame','mounting','parameters','treatment'];
    const missing = required.filter(k => !caseData[k] || typeof caseData[k] !== 'object' || Array.isArray(caseData[k]));
    if (missing.length) throw fail('CASE is missing required workspace data: ' + missing.join(', '));
  }
  async function userOrThrow() {
    const c = needClient();
    const { data, error } = await c.auth.getUser();
    if (error) throw error;
    if (!data?.user?.id) throw fail('Sign in to Supabase before saving or opening cases.', 'AUTH_REQUIRED');
    return data.user;
  }
  async function checked(result) {
    // R922: Supabase query/RPC calls return Promises; resolve them before reading data/error.
    const response = await result;
    if (response?.error) throw response.error;
    return response?.data;
  }
  async function captureCurrentCase({ commitPatient = true, suppressPatientChangeEvent = false } = {}) {
    // Manual SAVE WIP retains the historical Patient-form commit behavior.
    // Background autosave passes commitPatient:false because the Patient workspace
    // may be cached/inactive; window.currentCase is already the committed CASE source.
    if (commitPatient && typeof global.commitPatientAndMetadata === 'function') {
      await global.commitPatientAndMetadata({ suppressChangeEvent: suppressPatientChangeEvent });
    }
    if (!global.currentCase || typeof global.currentCase !== 'object') throw fail('There is no active CASE to save.');
    const caseData = clone(global.currentCase);
    requiredCaseGroups(caseData);
    if (typeof global.r1131CaptureCurrentXrayRecord !== 'function') {
      throw fail('The R1131 live AP/LAT capture API is unavailable. Confirm xray_reconstruction.js R1131 is loaded and both X-ray panels are initialized.', 'XRAY_CAPTURE_UNAVAILABLE');
    }
    const xray = {};
    for (const view of ['AP', 'LAT']) xray[view] = await global.r1131CaptureCurrentXrayRecord(view);
    return { caseData, xray };
  }
  async function createPatient({ displayName, clinicalIdentifiers = {}, metadata = {} }) {
    const c = needClient();
    const user = await userOrThrow();
    const name = safeName(displayName, 'Unnamed patient');

    // R920/R921: retain the complete PostgREST result so a missing row is reported
    // as a patient-insert/returning problem, not as the misleading patient.id error.
    const response = await c.from('patients').insert({
      owner_id: user.id,
      display_name: name,
      clinical_identifiers: clinicalIdentifiers && typeof clinicalIdentifiers === 'object' ? clinicalIdentifiers : {},
      metadata: metadata && typeof metadata === 'object' ? metadata : {}
    }).select('id,owner_id,display_name,created_at').single();

    if (response?.error) throw response.error;
    const row = response?.data;
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw fail(
        'Patient insert returned no row (Supabase data was empty). The save stopped before creating the case. Check the patients INSERT and SELECT RLS policies and confirm the insert .select(...).single() returns a row.',
        'PATIENT_INSERT_NO_ROW'
      );
    }
    if (typeof row.id !== 'string' || !row.id.trim()) {
      throw fail(
        'Patient insert returned a row without a valid id. The save stopped before creating the case. Check the patients table primary key/default and returned columns.',
        'PATIENT_INSERT_MISSING_ID'
      );
    }
    return row;
  }
  async function createCaseRecord({ patientId, caseName, metadata = {} }) {
    const c = needClient();
    const user = await userOrThrow();
    if (!patientId) throw fail('Choose an existing patient UUID or explicitly create a new patient first.', 'PATIENT_ASSOCIATION_REQUIRED');
    const response = await c.from('cases').insert({
      owner_id: user.id,
      patient_id: patientId,
      case_name: safeName(caseName),
      metadata: metadata && typeof metadata === 'object' ? metadata : {}
    }).select('id,owner_id,patient_id,case_name,current_revision_id,created_at,updated_at').single();
    if (response?.error) throw response.error;
    const row = response?.data;
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw fail(
        'Case insert returned no row (Supabase data was empty). The save stopped before uploading AP/LAT images. A patient record may already have been created. Check the cases INSERT and SELECT RLS policies and confirm the insert .select(...).single() returns a row.',
        'CASE_INSERT_NO_ROW'
      );
    }
    if (typeof row.id !== 'string' || !row.id.trim()) {
      throw fail(
        'Case insert returned a row without a valid id. The save stopped before uploading AP/LAT images. A patient record may already have been created. Check the cases table primary key/default and returned columns.',
        'CASE_INSERT_MISSING_ID'
      );
    }
    return row;
  }
  async function saveRevision({ caseId, caseData, xray, expectedCurrentRevisionId = null }) {
    const c = needClient();
    const user = await userOrThrow();
    if (!caseId) throw fail('caseId is required.');
    requiredCaseGroups(caseData);
    if (!xray || !xray.AP || !xray.LAT) throw fail('Both AP and LAT image/observation records are required.');
    const shaFn = global.CaseFileService?.archive?.sha256Hex;
    if (typeof shaFn !== 'function') throw fail('CaseFileService SHA-256 helper is unavailable.');

    const revisionId = global.crypto?.randomUUID?.();
    if (!revisionId) throw fail('This browser does not provide crypto.randomUUID(). Use a supported secure browser context.');
    const assets = [];
    const bucket = 'case-assets';

    // Upload original images first. Every revision uses unique paths; no overwrite is allowed.
    for (const view of ['AP', 'LAT']) {
      const record = xray[view];
      if (!record?.observation || record.observation?.images?.length !== 1 || record.observation.images[0]?.view !== view || !Array.isArray(record.observation.annotations)) {
        throw fail(`${view}: image/observation identity is invalid.`);
      }
      const sourceBytes = record.imageFileBytes || record.imageBytes;
      if (!sourceBytes) throw fail(`${view}: original image bytes are missing.`);
      const bytes = sourceBytes instanceof Uint8Array ? sourceBytes : new Uint8Array(sourceBytes);
      if (!bytes.byteLength) throw fail(`${view}: original image is empty.`);
      const checksum = await shaFn(bytes);
      if (record.imageChecksum && String(record.imageChecksum).toLowerCase() !== checksum) throw fail(`${view}: image SHA-256 mismatch; upload stopped.`);
      const ext = safeExtension(record.imageFileName || record.imageFile?.name || `${view.toLowerCase()}.dcm`);
      const path = `${user.id}/${caseId}/${revisionId}/${view}_original.${ext}`;
      const contentType = String(record.imageFileType || record.imageFile?.type || 'application/dicom');
      const { error: uploadError } = await c.storage.from(bucket).upload(path, new Blob([bytes], { type: contentType }), { contentType, upsert: false });
      if (uploadError) throw uploadError;
      assets.push({
        view_name: view, asset_role: 'original_image', payload_kind: 'storage', storage_path: path,
        content_type: contentType, byte_length: bytes.byteLength, sha256_hex: checksum
      });
      assets.push({ view_name: view, asset_role: 'observations', payload_kind: 'jsonb', json_payload: clone(record.observation) });
    }

    const schemaVersion = String(caseData?.metadata?.version ?? '1');
    const committed = await checked(c.rpc('commit_case_revision', {
      p_case_id: caseId,
      p_revision_id: revisionId,
      p_expected_current_revision_id: expectedCurrentRevisionId,
      p_schema_version: schemaVersion,
      p_case_data: caseData,
      p_assets: assets
    }));
    const result = Array.isArray(committed) ? committed[0] : committed;
    if (!result?.revision_id) {
      // R921 diagnostic: report only the RPC response shape, never clinical/case data.
      const dataType = committed === null ? 'null' : Array.isArray(committed) ? 'array' : typeof committed;
      const rowCount = Array.isArray(committed) ? committed.length : 'n/a';
      const dataKeys = committed && typeof committed === 'object' && !Array.isArray(committed)
        ? Object.keys(committed) : [];
      const rowKeys = result && typeof result === 'object' && !Array.isArray(result)
        ? Object.keys(result) : [];
      const diagnostic = { dataType, rowCount, dataKeys, rowKeys };
      console.error('[SupabaseCaseStorage R921] commit_case_revision returned no usable revision_id', diagnostic);
      throw fail(
        `Revision commit returned no revision identifier (R921 diagnostic: dataType=${dataType}; rowCount=${rowCount}; dataKeys=${dataKeys.join(',') || '(none)'}; rowKeys=${rowKeys.join(',') || '(none)'}). No case data was logged.`,
        'REVISION_COMMIT_NO_ID'
      );
    }
    return { caseId, revisionId: result.revision_id, revisionNumber: Number(result.revision_number), committedAt: result.committed_at, uploadedAssetCount: 2 };
  }
  async function createNewCaseFromCurrent({ patientId, createPatientFromCurrent = false, caseName, metadata = {} } = {}) {
    const { caseData, xray } = await captureCurrentCase();
    let chosenPatientId = patientId || null;
    let patient = null;
    if (createPatientFromCurrent) {
      if (chosenPatientId) throw fail('Choose either an existing patient UUID or create a new patient, not both.');
      const displayName = String(caseData.patient?.patient_name || caseData.metadata?.patient_name || '').trim();
      const clinicalId = String(caseData.patient?.patient_id || caseData.metadata?.patient_id || '').trim();
      patient = await createPatient({
        displayName: displayName && !/^enter\s+name\s*$/i.test(displayName) ? displayName : 'Unnamed patient',
        clinicalIdentifiers: clinicalId && !/^enter\s+id\s*$/i.test(clinicalId) ? { clinical_patient_id: clinicalId } : {},
        metadata: { hospital: caseData.patient?.hospital || '', surgeon: caseData.patient?.surgeon || '' }
      });
      chosenPatientId = patient.id;
    }
    if (!chosenPatientId) throw fail('Patient association is required. Explicitly select an existing patient UUID or choose createPatientFromCurrent:true. No name/clinical-ID matching is performed.', 'PATIENT_ASSOCIATION_REQUIRED');
    const name = safeName(caseName || caseData.metadata?.case_name);
    const caseRow = await createCaseRecord({ patientId: chosenPatientId, caseName: name, metadata });
    caseData.metadata = caseData.metadata && typeof caseData.metadata === 'object' ? caseData.metadata : {};
    caseData.metadata.cloud_case_id = caseRow.id;
    if (global.currentCase && typeof global.currentCase === 'object') {
      global.currentCase.metadata = global.currentCase.metadata && typeof global.currentCase.metadata === 'object' ? global.currentCase.metadata : {};
      global.currentCase.metadata.cloud_case_id = caseRow.id;
    }
    try { global.localStorage.setItem('orthopedic.supabaseCaseStorage.selectedCaseId.v1', caseRow.id); } catch (_) {}
    const saved = await saveRevision({ caseId: caseRow.id, caseData, xray, expectedCurrentRevisionId: null });
    return { patient, case: { ...caseRow, current_revision_id: saved.revisionId }, revision: saved };
  }
  async function listCases() {
    const c = needClient();
    await userOrThrow();
    const rows = await checked(c.from('cases').select('id,patient_id,case_name,current_revision_id,created_at,updated_at').order('updated_at', { ascending: false }));
    if (!rows?.length) return [];
    const patientIds = [...new Set(rows.map(row => row.patient_id).filter(Boolean))];
    const revisionIds = [...new Set(rows.map(row => row.current_revision_id).filter(Boolean))];
    const [patients, revisions] = await Promise.all([
      patientIds.length
        ? checked(c.from('patients').select('id,display_name').in('id', patientIds))
        : Promise.resolve([]),
      revisionIds.length
        ? checked(c.from('case_revisions').select('id,revision_number').in('id', revisionIds))
        : Promise.resolve([])
    ]);
    const names = new Map((patients || []).map(patient => [patient.id, patient.display_name]));
    const revisionNumbers = new Map((revisions || []).map(revision => [revision.id, Number(revision.revision_number)]));
    return rows.map(row => ({
      ...row,
      patient_name: names.get(row.patient_id) || '(patient record unavailable)',
      current_revision_number: row.current_revision_id
        ? (revisionNumbers.get(row.current_revision_id) ?? null)
        : null
    }));
  }
  async function listRevisions(caseId) {
    const c = needClient();
    await userOrThrow();
    // First confirm that the case is visible to this authenticated user.
    const caseRow = await checked(c.from('cases')
      .select('id,current_revision_id')
      .eq('id', caseId)
      .single());
    const rows = await checked(c.from('case_revisions')
      .select('id,case_id,revision_number,parent_revision_id,created_at')
      .eq('case_id', caseId)
      .order('revision_number', { ascending: false }));
    return (rows || []).map(revision => ({
      ...revision,
      is_current_revision: revision.id === caseRow.current_revision_id
    }));
  }
  async function saveCurrentRevision({ caseId, expectedCurrentRevisionId }) {
    const { caseData, xray } = await captureCurrentCase();
    const result = await saveRevision({ caseId, caseData, xray, expectedCurrentRevisionId: expectedCurrentRevisionId || null });
    return result;
  }
  async function downloadVerifiedImage({ bucket = 'case-assets', path, byteLength, sha256, view, contentType }) {
    const c = needClient();
    const shaFn = global.CaseFileService?.archive?.sha256Hex;
    if (typeof shaFn !== 'function') throw fail('CaseFileService SHA-256 helper is unavailable.');
    if (!path || !Number.isFinite(Number(byteLength)) || Number(byteLength) <= 0 || !/^[a-f0-9]{64}$/i.test(String(sha256 || ''))) {
      throw fail(`${view}: stored image manifest is incomplete.`);
    }
    const { data: blob, error } = await c.storage.from(bucket).download(path);
    if (error) throw error;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const checksum = await shaFn(bytes);
    if (bytes.byteLength !== Number(byteLength) || checksum !== String(sha256).toLowerCase()) {
      throw fail(`${view}: downloaded image failed length/SHA-256 verification. No case was opened.`);
    }
    return {
      imageBytes: bytes,
      imageChecksum: checksum,
      imageFileName: `${view.toLowerCase()}.${safeExtension(path)}`,
      imageFileType: contentType || 'application/dicom',
      imageSource: 'DICOM',
      imageView: view
    };
  }

  async function openValidatedBundleIntoApplication({ caseData, xray, fileName, exporterBuild, confirmMessage, confirmBeforeOpen = true, shouldInstall = null, cloudCaseId = null }) {
    const buildBundle = global.CaseFileService?.archive?.buildBundle;
    if (typeof buildBundle !== 'function' || typeof global.CaseFileService?.openCase !== 'function') {
      throw fail('CaseFileService archive/open APIs are unavailable.');
    }
    // Preserve the explicit Supabase identity in the installed CASE even when
    // an older saved revision/WIP predates the cloud_case_id metadata field.
    const installCaseData = clone(caseData);
    if (cloudCaseId) {
      installCaseData.metadata = installCaseData.metadata && typeof installCaseData.metadata === 'object' ? installCaseData.metadata : {};
      installCaseData.metadata.cloud_case_id = String(cloudCaseId);
    }
    const built = await buildBundle(installCaseData, xray, exporterBuild);
    let file;
    try {
      file = new File([built.blob], fileName, { type: 'application/zip', lastModified: Date.now() });
    } catch (_) {
      throw fail('This browser cannot create the temporary ZIP File needed by the existing validated restore path.');
    }
    if (typeof shouldInstall === 'function' && !shouldInstall()) return { opened: false, cancelled: true, stale: true };
    if (confirmBeforeOpen && typeof global.confirm === 'function' && !global.confirm(confirmMessage)) {
      return { opened: false, cancelled: true };
    }
    // The adapter owns the optional confirmation. Suppress the portable ZIP
    // importer's second confirmation for this already-validated programmatic path.
    const opened = await global.CaseFileService.openCase(file, { confirmBeforeOpen: false });
    return { opened: opened === true };
  }

  async function getRevision(caseId, revisionId) {
    const c = needClient();
    await userOrThrow();
    const row = await checked(c.from('cases')
      .select('id,patient_id,case_name,current_revision_id,metadata')
      .eq('id', caseId)
      .single());
    const chosenRevisionId = revisionId || row.current_revision_id;
    if (!chosenRevisionId) throw fail('This case has no saved revision yet.');
    const revision = await checked(c.from('case_revisions')
      .select('id,case_id,revision_number,parent_revision_id,schema_version,case_data,created_at')
      .eq('id', chosenRevisionId)
      .eq('case_id', caseId)
      .single());
    const assets = await checked(c.from('case_revision_assets').select('*').eq('revision_id', revision.id));
    if (!Array.isArray(assets) || assets.length !== 4) throw fail('Saved revision does not have exactly four required AP/LAT assets.');
    return { case: row, revision, assets };
  }
  async function getCurrentRevision(caseId) {
    return getRevision(caseId, null);
  }
  async function openCaseIntoApplication(caseId, { revisionId = null, confirmBeforeOpen = true, shouldInstall = null } = {}) {
    const c = needClient();
    const saved = await getRevision(caseId, revisionId);
    const xray = {};
    for (const view of ['AP', 'LAT']) {
      const imageAsset = saved.assets.find(a => a.view_name === view && a.asset_role === 'original_image');
      const obsAsset = saved.assets.find(a => a.view_name === view && a.asset_role === 'observations');
      if (!imageAsset || !obsAsset || imageAsset.payload_kind !== 'storage' || obsAsset.payload_kind !== 'jsonb') {
        throw fail(`${view}: required image or observation asset is missing.`);
      }
      const observation = obsAsset.json_payload;
      if (!observation || observation.images?.length !== 1 || observation.images[0]?.view !== view || !Array.isArray(observation.annotations)) {
        throw fail(`${view}: saved observation identity is invalid. No case was opened.`);
      }
      xray[view] = {
        ...(await downloadVerifiedImage({
          bucket: imageAsset.storage_bucket || 'case-assets',
          path: imageAsset.storage_path,
          byteLength: imageAsset.byte_length,
          sha256: imageAsset.sha256_hex,
          view,
          contentType: imageAsset.content_type
        })),
        imageSource: observation.images[0]?.source || 'DICOM',
        observation
      };
    }
    let patientName = '(patient name unavailable)';
    if (confirmBeforeOpen) {
      const patientResult = await checked(c.from('patients').select('display_name').eq('id', saved.case.patient_id).single());
      patientName = patientResult?.display_name || patientName;
    }
    const opened = await openValidatedBundleIntoApplication({
      caseData: saved.revision.case_data,
      xray,
      fileName: `${safeName(saved.case.case_name)}.zip`,
      exporterBuild: 'SUPABASE_CASE_STORAGE_R1',
      confirmBeforeOpen,
      shouldInstall,
      cloudCaseId: saved.case.id,
      confirmMessage: `Open saved Supabase revision?\n\nPatient: ${patientName}\nCase: ${saved.case.case_name}\nRevision: R${saved.revision.revision_number}${saved.revision.id === saved.case.current_revision_id ? ' (current)' : ' (HISTORICAL)'}\n\nThis replaces the active CASE and AP/LAT workspace. Continue?`
    });
    return {
      opened: opened.opened,
      cancelled: !!opened.cancelled,
      stale: !!opened.stale,
      caseId: saved.case.id,
      revisionId: saved.revision.id,
      revisionNumber: Number(saved.revision.revision_number),
      caseName: saved.case.case_name
    };
  }

  const WORKING_COPY_COLUMNS = [
    'case_id','owner_id','schema_version','case_data','ap_observations','lat_observations',
    'ap_storage_path','ap_content_type','ap_byte_length','ap_sha256_hex',
    'lat_storage_path','lat_content_type','lat_byte_length','lat_sha256_hex',
    'working_copy_version','save_generation_id','updated_by','updated_at'
  ].join(',');

  async function getWorkingCopy(caseId) {
    const c = needClient();
    await userOrThrow();
    if (!caseId) throw fail('caseId is required.');
    return await checked(c.from('case_working_copies')
      .select(WORKING_COPY_COLUMNS)
      .eq('case_id', caseId)
      .maybeSingle()) || null;
  }

  async function saveCurrentWorkingCopy(options = {}) {
    const { caseId, shouldContinue = null, saveSource = 'unspecified' } = options || {};
    if (!caseId) throw fail('caseId is required.');
    const queueKey = String(caseId);
    const previousTurn = wipSaveQueues.get(queueKey) || Promise.resolve();
    const queuedBehindAnotherSave = wipSaveQueues.has(queueKey);
    let releaseTurn;
    const thisTurn = new Promise(resolve => { releaseTurn = resolve; });
    const queueTail = previousTurn.catch(() => {}).then(() => thisTurn);
    wipSaveQueues.set(queueKey, queueTail);
    const queuedAt = Date.now();
    if (queuedBehindAnotherSave) {
      emitWipSaveDiagnostic({
        timestamp: new Date().toISOString(), saveSource, caseId,
        stage: 'save-queued', queueWaitStartedAt: queuedAt
      });
    }
    try {
      await previousTurn.catch(() => {});
      const queueWaitMs = Date.now() - queuedAt;
      if (typeof shouldContinue === 'function' && !shouldContinue()) {
        throw fail('Connected WIP save cancelled while waiting because the selected cloud CASE changed.', 'STALE_AUTOSAVE_TARGET');
      }
      emitWipSaveDiagnostic({
        timestamp: new Date().toISOString(), saveSource, caseId,
        stage: 'save-lock-acquired', queueWaitMs
      });
      return await saveCurrentWorkingCopyUnlocked(options);
    } finally {
      releaseTurn();
      if (wipSaveQueues.get(queueKey) === queueTail) wipSaveQueues.delete(queueKey);
    }
  }

  async function saveCurrentWorkingCopyUnlocked({ caseId, commitPatient = true, shouldContinue = null, saveSource = 'unspecified', suppressPatientChangeEvent = false }) {
    const trace = { saveSource, caseId, commitPatient, startedAt: Date.now(), stage: 'start' };
    const mark = (stage, extra = {}) => { trace.stage = stage; emitWipSaveDiagnostic({ ...trace, elapsedMs: Date.now() - trace.startedAt, ...extra }); };
    mark('start');
    const c = needClient();
    const user = await userOrThrow();
    if (!caseId) throw fail('caseId is required.');
    const captureStarted = Date.now();
    const { caseData, xray } = await captureCurrentCase({ commitPatient, suppressPatientChangeEvent });
    const caseJsonBytes = new TextEncoder().encode(JSON.stringify(caseData)).byteLength;
    const imageSummary = Object.fromEntries(['AP','LAT'].map(view => [view, { byteLength: Number(xray[view]?.imageFileBytes?.byteLength || xray[view]?.imageBytes?.byteLength || 0), annotationCount: Number(xray[view]?.observation?.annotations?.length || 0), imageCount: Number(xray[view]?.observation?.images?.length || 0) }]));
    mark('capture-complete', { captureMs: Date.now() - captureStarted, caseJsonBytes, imageSummary });
    if (typeof shouldContinue === 'function' && !shouldContinue()) {
      throw fail('Connected WIP save cancelled because the selected cloud CASE changed during capture.', 'STALE_AUTOSAVE_TARGET');
    }
    const previous = await getWorkingCopy(caseId);
    const expectedVersion = previous ? Number(previous.working_copy_version) : 0;
    mark('wip-version-read', { expectedVersion, previousGenerationId: previous?.save_generation_id || null });
    if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0) {
      throw fail('The saved WIP version is invalid. Refresh the cloud case before saving.');
    }
    const generationId = global.crypto?.randomUUID?.();
    trace.generationId = generationId || null;
    mark('generation-created', { generationId });
    if (!generationId) throw fail('This browser does not provide crypto.randomUUID(). Use a supported secure browser context.');
    const shaFn = global.CaseFileService?.archive?.sha256Hex;
    if (typeof shaFn !== 'function') throw fail('CaseFileService SHA-256 helper is unavailable.');
    const bucket = 'case-assets';
    const uploadedPaths = [];
    const manifests = {};
    const observations = {};

    try {
      for (const view of ['AP', 'LAT']) {
        const record = xray[view];
        if (!record?.observation || record.observation?.images?.length !== 1 ||
            record.observation.images[0]?.view !== view || !Array.isArray(record.observation.annotations)) {
          throw fail(`${view}: image/observation identity is invalid.`);
        }
        const sourceBytes = record.imageFileBytes || record.imageBytes;
        if (!sourceBytes) throw fail(`${view}: original image bytes are missing.`);
        const bytes = sourceBytes instanceof Uint8Array ? sourceBytes : new Uint8Array(sourceBytes);
        if (!bytes.byteLength) throw fail(`${view}: original image is empty.`);
        const checksum = await shaFn(bytes);
        if (record.imageChecksum && String(record.imageChecksum).toLowerCase() !== checksum) {
          throw fail(`${view}: image SHA-256 mismatch; WIP upload stopped.`);
        }
        const ext = safeExtension(record.imageFileName || `${view.toLowerCase()}.dcm`);
        const path = `${user.id}/${caseId}/wip/${generationId}/${view}_original.${ext}`;
        const contentType = String(record.imageFileType || 'application/dicom');
        const { error: uploadError } = await c.storage.from(bucket).upload(
          path,
          new Blob([bytes], { type: contentType }),
          { contentType, upsert: false }
        );
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        mark('image-uploaded-' + view, { generationId, imageByteLength: bytes.byteLength, sha256: checksum });
        manifests[view] = {
          storage_path: path,
          content_type: contentType,
          byte_length: bytes.byteLength,
          sha256_hex: checksum
        };
        observations[view] = clone(record.observation);
      }
    } catch (error) {
      if (uploadedPaths.length) {
        try { await checked(c.storage.from(bucket).remove(uploadedPaths)); } catch (_) { /* best-effort cleanup of an uncommitted generation */ }
      }
      throw error;
    }

    // A cloud-case switch/restore may begin while image bytes are uploading.
    // Do not commit a captured snapshot if its selected target is no longer current.
    if (typeof shouldContinue === 'function' && !shouldContinue()) {
      if (uploadedPaths.length) {
        try { await checked(c.storage.from(bucket).remove(uploadedPaths)); } catch (_) { /* best-effort cleanup of an uncommitted generation */ }
      }
      throw fail('Connected WIP save cancelled because the selected cloud CASE changed before commit.', 'STALE_AUTOSAVE_TARGET');
    }

    let committedRow = null;
    try {
      mark('rpc-start', { expectedVersion, generationId });
      const rpcStarted = Date.now();
      const committed = await checked(c.rpc('save_case_working_copy', {
        p_case_id: caseId,
        p_expected_working_copy_version: expectedVersion,
        p_save_generation_id: generationId,
        p_schema_version: String(caseData?.metadata?.version ?? '1'),
        p_case_data: caseData,
        p_ap_observations: observations.AP,
        p_lat_observations: observations.LAT,
        p_ap_image: manifests.AP,
        p_lat_image: manifests.LAT
      }));
      committedRow = Array.isArray(committed) ? committed[0] : committed;
      mark('rpc-success', { rpcMs: Date.now() - rpcStarted, workingCopyVersion: committedRow?.working_copy_version ?? null, committedGenerationId: committedRow?.save_generation_id || null });
      if (!committedRow?.save_generation_id) throw fail('WIP save RPC returned no generation identifier.');
    } catch (saveError) {
      mark('rpc-error', { errorMessage: String(saveError?.message || saveError), errorCode: saveError?.code || null, generationId, expectedVersion });
      // A network timeout can happen after the database committed. Read the row
      // before deciding whether this generation is safe to remove.
      let observed;
      try { observed = await getWorkingCopy(caseId); mark('timeout-readback', { observedVersion: observed?.working_copy_version ?? null, observedGenerationId: observed?.save_generation_id || null, attemptedGenerationId: generationId }); }
      catch (readError) {
        const uncertain = fail(
          `WIP save outcome is uncertain. The uploaded generation ${generationId} was retained to protect a possibly committed save. Check the WIP row before retrying. Original error: ${saveError?.message || saveError}. Read-back error: ${readError?.message || readError}`,
          'WIP_SAVE_OUTCOME_UNCERTAIN'
        );
        uncertain.generationId = generationId;
        uncertain.expectedVersion = expectedVersion;
        uncertain.caseId = caseId;
        throw uncertain;
      }
      if (observed?.save_generation_id === generationId) {
        committedRow = {
          case_id: observed.case_id,
          working_copy_version: observed.working_copy_version,
          save_generation_id: observed.save_generation_id,
          updated_at: observed.updated_at
        };
      } else {
        try { await checked(c.storage.from(bucket).remove(uploadedPaths)); } catch (_) { /* leave an orphan rather than mask the original RPC error */ }
        const notCurrent = fail(
          `The WIP read-back did not find attempted generation ${generationId}. Current WIP version: ${observed?.working_copy_version ?? 'none'}; current generation: ${observed?.save_generation_id || 'none'}. Original RPC error: ${saveError?.message || saveError}`,
          'WIP_SAVE_NOT_CONFIRMED'
        );
        notCurrent.generationId = generationId;
        notCurrent.expectedVersion = expectedVersion;
        notCurrent.observedVersion = observed?.working_copy_version ?? null;
        notCurrent.observedGenerationId = observed?.save_generation_id ?? null;
        throw notCurrent;
      }
    }

    let cleanupWarning = null;
    if (previous) {
      const oldPaths = [previous.ap_storage_path, previous.lat_storage_path].filter(path =>
        typeof path === 'string' &&
        path.startsWith(`${user.id}/${caseId}/wip/`) &&
        !path.includes(`/${generationId}/`)
      );
      if (oldPaths.length) {
        try {
          await checked(c.storage.from(bucket).remove(oldPaths));
        } catch (error) {
          cleanupWarning = `New WIP is committed, but the previous image generation could not be removed: ${error?.message || error}`;
        }
      }
    }
    mark('save-complete', { workingCopyVersion: Number(committedRow.working_copy_version), saveGenerationId: committedRow.save_generation_id, totalMs: Date.now() - trace.startedAt });
    return {
      caseId,
      workingCopyVersion: Number(committedRow.working_copy_version),
      saveGenerationId: committedRow.save_generation_id,
      updatedAt: committedRow.updated_at,
      cleanupWarning
    };
  }

  async function openWorkingCopyIntoApplication(caseId, { caseName = 'case', confirmBeforeOpen = true, shouldInstall = null } = {}) {
    const c = needClient();
    const user = await userOrThrow();
    const saved = await getWorkingCopy(caseId);
    if (!saved) throw fail('This cloud case has no saved working copy yet.', 'WIP_NOT_FOUND');
    requiredCaseGroups(saved.case_data);
    const generationPrefix = `${user.id}/${caseId}/wip/${saved.save_generation_id}/`;
    const xray = {};
    for (const view of ['AP', 'LAT']) {
      const path = view === 'AP' ? saved.ap_storage_path : saved.lat_storage_path;
      const contentType = view === 'AP' ? saved.ap_content_type : saved.lat_content_type;
      const byteLength = view === 'AP' ? saved.ap_byte_length : saved.lat_byte_length;
      const sha256 = view === 'AP' ? saved.ap_sha256_hex : saved.lat_sha256_hex;
      const observation = view === 'AP' ? saved.ap_observations : saved.lat_observations;
      if (typeof path !== 'string' || !path.startsWith(generationPrefix) ||
          !new RegExp(`${view}_original\\.[A-Za-z0-9]{1,10}$`).test(path)) {
        throw fail(`${view}: WIP Storage path does not match the saved generation.`);
      }
      if (!observation || observation.images?.length !== 1 ||
          observation.images[0]?.view !== view || !Array.isArray(observation.annotations)) {
        throw fail(`${view}: saved WIP observation identity is invalid.`);
      }
      xray[view] = {
        ...(await downloadVerifiedImage({ path, byteLength, sha256, view, contentType })),
        imageSource: observation.images[0]?.source || 'DICOM',
        observation
      };
    }
    const opened = await openValidatedBundleIntoApplication({
      caseData: saved.case_data,
      xray,
      fileName: `${safeName(caseName)}-WIP.zip`,
      exporterBuild: 'SUPABASE_WIP_R1',
      confirmBeforeOpen,
      shouldInstall,
      cloudCaseId: caseId,
      confirmMessage: `Restore Supabase working copy?\n\nCase: ${caseName}\nWorking-copy version: ${saved.working_copy_version}\nLast saved: ${saved.updated_at ? new Date(saved.updated_at).toLocaleString() : 'unknown'}\n\nThis replaces the active CASE and AP/LAT workspace. Continue?`
    });
    return {
      opened: opened.opened,
      cancelled: !!opened.cancelled,
      stale: !!opened.stale,
      caseId,
      caseName,
      workingCopyVersion: Number(saved.working_copy_version),
      saveGenerationId: saved.save_generation_id,
      updatedAt: saved.updated_at
    };
  }

  // R1010: destructive case operations are project-agnostic. They run only against
  // the active authenticated client and still rely on owner-scoped RPCs/RLS and exact case confirmation.
  function activeProjectUrl() {
    const c = needClient();
    return String(c.supabaseUrl || '');
  }
  async function listStorageFilesRecursively(bucketApi, folderPath) {
    const files = [];
    const folders = [folderPath];
    while (folders.length) {
      const folder = folders.pop();
      let offset = 0;
      while (true) {
        const entries = await checked(bucketApi.list(folder, { limit: 100, offset, sortBy: { column: 'name', order: 'asc' } }));
        const batch = Array.isArray(entries) ? entries : [];
        for (const entry of batch) {
          if (!entry || typeof entry.name !== 'string' || !entry.name) continue;
          const fullPath = `${folder}/${entry.name}`;
          if (entry.id == null && entry.metadata == null) folders.push(fullPath);
          else files.push(fullPath);
        }
        if (batch.length < 100) break;
        offset += batch.length;
      }
    }
    return [...new Set(files)];
  }
  async function readDeletionStatus(caseId) {
    const c = needClient();
    await userOrThrow();
    if (!caseId) throw fail('Select a case before reading deletion status.', 'CASE_REQUIRED');
    const data = await checked(c.rpc('read_own_case_deletion_status', { p_case_id: caseId }));
    return Array.isArray(data) ? data : (data ? [data] : []);
  }
  async function readDeletionJobStatus(jobId) {
    const c = needClient();
    await userOrThrow();
    if (!jobId) throw fail('A deletion job ID is required for status lookup.', 'DELETION_JOB_REQUIRED');
    const data = await checked(c.rpc('read_own_case_deletion_job_status', { p_deletion_job_id: jobId }));
    return Array.isArray(data) ? data : (data ? [data] : []);
  }
  async function deleteCloudCase({ caseId, typedCaseName, expectedCurrentRevisionId = null } = {}) {
    const c = needClient();
    const user = await userOrThrow();
    if (!caseId) throw fail('Select a cloud case before requesting deletion.', 'CASE_REQUIRED');
    const typed = String(typedCaseName || '');
    if (!typed) throw fail('The exact case name must be typed to confirm deletion.', 'TYPED_NAME_REQUIRED');
    const visible = await checked(c.from('cases').select('id,owner_id,case_name,current_revision_id').eq('id', caseId).single());
    if (!visible || visible.owner_id !== user.id) throw fail('Selected case is not visible to the signed-in owner.', 'CASE_NOT_OWNED');
    if (visible.case_name !== typed) throw fail('Typed case name does not exactly match the selected case.', 'CASE_NAME_MISMATCH');
    if ((visible.current_revision_id || null) !== (expectedCurrentRevisionId || null)) throw fail('The selected case changed since the list was loaded. Refresh the cloud list before deletion.', 'CASE_REVISION_CHANGED');

    let phase = 'begin';
    let jobId = null;
    try {
      const beginData = await checked(c.rpc('begin_case_deletion', {
        p_case_id: caseId,
        p_expected_current_revision_id: expectedCurrentRevisionId || null,
        p_typed_case_name: typed
      }));
      const begin = Array.isArray(beginData) ? beginData[0] : beginData;
      jobId = begin?.deletion_job_id || begin?.job_id || null;
      if (!jobId) throw fail('begin_case_deletion returned no deletion job ID. Stop and inspect read-only status; do not retry blindly.', 'DELETE_JOB_ID_MISSING');

      phase = 'storage-list';
      const prefix = `${user.id}/${caseId}`;
      const storage = c.storage.from('case-assets');
      let paths = await listStorageFilesRecursively(storage, prefix);
      phase = 'storage-remove';
      for (let i = 0; i < paths.length; i += 100) {
        const chunk = paths.slice(i, i + 100);
        if (chunk.length) {
          const { error } = await storage.remove(chunk);
          if (error) throw error;
        }
      }
      phase = 'storage-verify-empty';
      paths = await listStorageFilesRecursively(storage, prefix);
      if (paths.length) throw fail(`Storage prefix still contains ${paths.length} object(s). Deletion remains resumable; do not finalize.`, 'STORAGE_NOT_EMPTY');

      phase = 'mark-storage-deleted';
      await checked(c.rpc('mark_case_deletion_storage_deleted', { p_deletion_job_id: jobId }));
      phase = 'finalize';
      const finalData = await checked(c.rpc('finalize_case_deletion', { p_deletion_job_id: jobId }));
      const final = Array.isArray(finalData) ? finalData[0] : finalData;
      if (final?.status !== 'completed') throw fail('Finalization did not explicitly return status=completed. Check read-only status before any further action.', 'DELETE_FINAL_STATUS_UNCONFIRMED');

      phase = 'post-check';
      const after = await c.from('cases').select('id').eq('id', caseId).maybeSingle();
      if (after?.error) throw after.error;
      if (after?.data) throw fail('Finalization reported completed, but the case is still visible. Stop and investigate; do not retry.', 'DELETE_POSTCHECK_CASE_REMAINS');
      const remaining = await listStorageFilesRecursively(storage, prefix);
      if (remaining.length) throw fail(`Finalization reported completed, but ${remaining.length} Storage object(s) remain. Stop and investigate.`, 'DELETE_POSTCHECK_STORAGE_REMAINS');
      return { caseId, deletionJobId: jobId, status: 'completed', storagePrefixEmpty: true };
    } catch (error) {
      const wrapped = fail(`Case deletion stopped during phase "${phase}"${jobId ? ` (job ${jobId})` : ''}: ${error?.message || error}. No automatic retry was attempted. If this was a timeout, inspect read-only deletion status and the exact Storage prefix first.`, error?.code || 'CASE_DELETE_FAILED');
      wrapped.cause = error;
      wrapped.phase = phase;
      wrapped.deletionJobId = jobId;
      throw wrapped;
    }
  }

  function createClient(projectUrl, key) {
    if (!global.supabase?.createClient) throw fail('Supabase JS v2 is not loaded.');
    client = global.supabase.createClient(projectUrl, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
    return client;
  }
  async function restoreSession() {
    const saved = readSavedConfig();
    if (!saved) return { configured: false, signedIn: false, user: null };
    const c = createClient(saved.url, saved.publishableKey);
    const { data, error } = await c.auth.getSession();
    if (error) throw error;
    const session = data?.session || null;
    return { configured: true, signedIn: !!session, user: session?.user || null, client: c };
  }
  function getSavedConfig() { return readSavedConfig(); }
  async function signIn({ url, publishableKey, email, password }) {
    const projectUrl = String(url || '').trim().replace(/\/+$/, '');
    const key = String(publishableKey || '').trim();
    if (!projectUrl || !key) throw fail('Supabase project URL and publishable/anon key are required.');
    const c = createClient(projectUrl, key);
    const { data, error } = await c.auth.signInWithPassword({ email: String(email || '').trim(), password: String(password || '') });
    if (error) throw error;
    saveConfig(projectUrl, key);
    return { user: data.user, client };
  }
  async function signOut() {
    const c = needClient();
    const { error } = await c.auth.signOut();
    if (error) throw error;
    return { signedOut: true };
  }
  function configure(existingClient) {
    if (!existingClient || typeof existingClient.from !== 'function' || !existingClient.auth) throw fail('configure() expects a Supabase JS client.');
    client = existingClient;
    return api;
  }
  const api = Object.freeze({
    VERSION: 'R1145.8', configure, signIn, restoreSession, getSavedConfig, signOut,
    getActiveProjectUrl: activeProjectUrl, readDeletionStatus, readDeletionJobStatus, deleteCloudCase,
    getUser: userOrThrow, createPatient, createCaseRecord,
    createNewCaseFromCurrent, saveCurrentRevision, saveRevision,
    listCases, listRevisions, getRevision, getCurrentRevision, openCaseIntoApplication,
    getWorkingCopy, saveCurrentWorkingCopy, openWorkingCopyIntoApplication,
    isConfigured: () => !!client
  });
  global.SupabaseCaseStorage = api;
})(window);
