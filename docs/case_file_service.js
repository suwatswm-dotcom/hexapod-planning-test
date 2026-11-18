/*
 * R1138 — Case File Service · live bridge + installer diagnostics
 * Patient-facing orchestration for portable case ZIPs.
 * Owns portable ZIP encoding/decoding, checksum validation, and patient-facing file orchestration.
 * Live VTK capture, import confirmation, rollback, and installation remain in the X-ray controller.
 */
(function installCaseFileService(global){
  'use strict';
  if(global.CaseFileService && global.CaseFileService.VERSION === 'R1139') return;

  let operationChain = Promise.resolve();
  let portableDirty = false;
  let lastPortableSaveAt = null;
  let xrayLocallySaved = false;
  let nonXrayDirty = false;
  let lastStatus = {state:'ready', message:'Ready · open or save a portable case ZIP.'};

  function emitStatus(state, message, extra={}){
    lastStatus = {state, message, ...extra};
    document.dispatchEvent(new CustomEvent('case-file-status', {detail:lastStatus}));
  }
  function queueOperation(work){
    const next = operationChain.then(work, work);
    operationChain = next.catch(()=>{});
    return next;
  }
  function sleep(ms){ return new Promise(resolve=>setTimeout(resolve,ms)); }

  // R1137 — wait for the current live-controller contract used by the VTK
  // iframe. The retired per-view WIP/autosave APIs were intentionally removed
  // in R1123C9 and must not be required by portable ZIP or Supabase WIP flows.
  async function waitForBridge(timeoutMs=15000){
    if(!global.WorkspaceManager || typeof global.WorkspaceManager.ensureInitialized!=='function'){
      throw new Error('WorkspaceManager.ensureInitialized() is unavailable. Load the R887 workspace manager.');
    }
    // Initialize the hidden X-ray workspace without changing visible navigation.
    await global.WorkspaceManager.ensureInitialized('xray');
    const start = Date.now();
    const bootstrapAttempted = {AP:false, LAT:false};
    const bootstrapErrors = {AP:null, LAT:null};
    const requiredChildApis = [
      'captureXrayLiveRecord',
      'installXrayLiveRecord',
      'captureXrayLiveRollbackCheckpoint',
      'restoreXrayLiveRollbackCheckpoint'
    ];
    while(Date.now()-start < timeoutMs){
      const ap = document.getElementById('xrayAPVtkFrame');
      const lat = document.getElementById('xrayLATVtkFrame');
      const controllerReady = typeof global.exportCaseBundleFromWorkspace==='function' &&
        typeof global.r885OpenCaseBundleFile==='function';
      const frames = {AP:ap, LAT:lat};
      const childReady = {AP:false, LAT:false};

      for(const view of ['AP','LAT']){
        const frame = frames[view];
        const child = frame?.contentWindow;
        if(!child) continue;
        if(!bootstrapAttempted[view] && typeof child.ensureXrayLiveController==='function'){
          bootstrapAttempted[view] = true;
          try {
            const ready = await child.ensureXrayLiveController();
            if(ready?.status !== 'PASS') throw new Error('live controller bootstrap did not report PASS');
            if(ready.view !== view) throw new Error(`controller view identity is ${String(ready.view)}; expected ${view}`);
          } catch(error) {
            bootstrapErrors[view] = String(error?.message || error);
          }
        }
        childReady[view] = requiredChildApis.every(name => typeof child[name] === 'function');
      }
      if(controllerReady && childReady.AP && childReady.LAT) return {ap,lat};
      await sleep(100);
    }
    const ap = document.getElementById('xrayAPVtkFrame');
    const lat = document.getElementById('xrayLATVtkFrame');
    const childChecks = frame => {
      const child = frame?.contentWindow;
      return {
        bootstrapApi: typeof child?.ensureXrayLiveController === 'function',
        captureLiveRecordApi: typeof child?.captureXrayLiveRecord === 'function',
        installLiveRecordApi: typeof child?.installXrayLiveRecord === 'function',
        rollbackCaptureApi: typeof child?.captureXrayLiveRollbackCheckpoint === 'function',
        rollbackRestoreApi: typeof child?.restoreXrayLiveRollbackCheckpoint === 'function'
      };
    };
    const checks = {
      workspaceManager: !!global.WorkspaceManager,
      exportBridge: typeof global.exportCaseBundleFromWorkspace === 'function',
      importBridge: typeof global.r885OpenCaseBundleFile === 'function',
      apFrameFound: !!ap,
      latFrameFound: !!lat,
      apFrameLoaded: !!ap?.contentWindow,
      latFrameLoaded: !!lat?.contentWindow,
      apLiveApis: childChecks(ap),
      latLiveApis: childChecks(lat),
      apBootstrapError: bootstrapErrors.AP,
      latBootstrapError: bootstrapErrors.LAT,
      apSrc: ap?.getAttribute('src') || '(no AP iframe)',
      latSrc: lat?.getAttribute('src') || '(no LAT iframe)'
    };
    console.error('R1137 case-file live bridge readiness diagnostic', checks);
    throw new Error('R1137 — live-controller bridge timeout. Checks: ' + JSON.stringify(checks) + '. No workspace navigation was performed; no case data was installed.');
  }
  async function refreshPatientAfterOpen(){
    try{ if(typeof global.populatePatient==='function') await global.populatePatient(); }catch(error){ console.warn('R886 patient form refresh:',error); }
    try{ if(typeof global.refreshCurrentWorkflow==='function') await global.refreshCurrentWorkflow(); }catch(error){ console.warn('R886 workflow refresh:',error); }
    try{ if(typeof global.refreshDeveloperDashboard==='function') await global.refreshDeveloperDashboard(); }catch(error){ console.warn('R886 dashboard refresh:',error); }
  }
  async function openCase(file, options={}){
    if(!file) return false;
    const timingDetail=(label,started)=>global.ModeSwitchTiming?.detail(label,performance.now()-started);
    const confirmBeforeOpen = options?.confirmBeforeOpen !== false;
    return queueOperation(async()=>{
      emitStatus('opening','Opening portable case · validating ZIP before installation…');
      let phaseStarted=performance.now();
      await waitForBridge();
      timingDetail('Case import · wait for AP/LAT bridge',phaseStarted);
      if(global.__R871_AUTO_WIP_RESTORE_PROMISE){
        try{ await global.__R871_AUTO_WIP_RESTORE_PROMISE; }catch(_){ /* importer validates and attempts rollback */ }
      }
      // R1138: the validated X-ray installer reports detailed failure and
      // rollback diagnostics in its existing report panel, but historically
      // CaseFileService collapsed a false result into a silent boolean. Preserve
      // that single installer and forward its actual diagnostic to callers.
      const report = document.getElementById('r864BundleValidationReport');
      if(report) report.textContent = 'R1138 — IMPORT IN PROGRESS · Waiting for the validated AP/LAT installer…';
      phaseStarted=performance.now();
      const result = await global.r885OpenCaseBundleFile(file, { confirmBeforeOpen });
      timingDetail('Case import · validated bundle installer (ZIP validation + AP/LAT install)',phaseStarted);
      if(result!==true){
        const detail = String(report?.textContent || '').trim();
        const message = detail && !/^R1138 — IMPORT IN PROGRESS/.test(detail)
          ? `Validated case installer returned false.\n${detail}`
          : 'Validated case installer returned false without publishing its diagnostic report.';
        global.__CASE_FILE_LAST_OPEN_DIAGNOSTIC = message;
        emitStatus('open-failed', message, {fileName:file.name});
        throw new Error(message);
      }
      global.__CASE_FILE_LAST_OPEN_DIAGNOSTIC = null;
      phaseStarted=performance.now();
      await refreshPatientAfterOpen();
      timingDetail('Case import · refresh Patient/workflow/dashboard',phaseStarted);
      portableDirty = false;
      nonXrayDirty = false;
      xrayLocallySaved = false;
      global.__R886_PORTABLE_CASE_DIRTY = false;
      emitStatus('opened',`Case opened from portable file · ${file.name}. This was an import, not a new save.`);
      return true;
    });
  }
  async function saveCaseToDevice(){
    return queueOperation(async()=>{
      emitStatus('saving','Saving portable case · flushing AP/LAT autosave and building ZIP…');
      if(typeof global.commitPatientAndMetadata==='function') await global.commitPatientAndMetadata();
      else if(typeof global.commitPatient==='function') await global.commitPatient();
      await waitForBridge();
      const result = await global.exportCaseBundleFromWorkspace();
      if(result===true){
        portableDirty = false;
        nonXrayDirty = false;
        xrayLocallySaved = true;
        lastPortableSaveAt = new Date().toISOString();
        global.__R886_PORTABLE_CASE_DIRTY = false;
        emitStatus('portable-saved','Portable file saved · ZIP download was initiated. Check device downloads.',{lastPortableSaveAt});
      }
      return result===true;
    });
  }
  function markOpenedBaseline(){
    portableDirty = false;
    nonXrayDirty = false;
    xrayLocallySaved = false;
    global.__R886_PORTABLE_CASE_DIRTY = false;
    // Deliberately do not change lastPortableSaveAt: Open is not Save.
  }
  function markDirty(reason, source='workspace'){
    portableDirty = true;
    if(source !== 'xray') nonXrayDirty = true;
    xrayLocallySaved = false;
    global.__R886_PORTABLE_CASE_DIRTY = true;
    global.__R886_PORTABLE_CASE_DIRTY_REASON = String(reason || 'case changed');
    emitStatus('dirty',`Unsaved changes · ${String(reason || 'case changed')} · portable ZIP not yet saved.`);
  }
  function markXrayAutosaved(data={}){
    xrayLocallySaved = true;
    const view = data.view ? ` (${String(data.view).toUpperCase()})` : '';
    if(portableDirty){
      const message = nonXrayDirty
        ? `AP/LAT work autosaved locally${view} · other case changes remain unsaved; portable ZIP not yet saved.`
        : `Autosaved locally${view} · portable ZIP not yet saved.`;
      emitStatus('local-autosaved',message,{view:data.view||null});
    } else {
      emitStatus('local-autosaved',`Autosaved locally${view} · no new portable ZIP has been created.`,{view:data.view||null});
    }
  }
  function markXrayAutosaveFailed(data={}){
    xrayLocallySaved = false;
    emitStatus('autosave-failed',`Local AP/LAT autosave failed${data.view ? ' ('+String(data.view).toUpperCase()+')' : ''} · ${String(data.error||'see X-ray panel diagnostics')}`);
  }

  // Best-effort exit warning only. Browser policy may not show a prompt in every context.
  if(!global.__R886_CASE_FILE_EXIT_WARNING_BOUND){
    global.__R886_CASE_FILE_EXIT_WARNING_BOUND = true;
    const isCaseValueControl = target => !!target?.closest?.('#workspaceHost') &&
      !target.matches?.('input[type="file"],button,[type="button"],[type="submit"]');
    document.addEventListener('input',event=>{
      if(isCaseValueControl(event.target)) markDirty('workspace input changed','workspace');
    },true);
    document.addEventListener('change',event=>{
      if(isCaseValueControl(event.target)) markDirty('workspace value changed','workspace');
    },true);
    global.addEventListener('message',event=>{
      if(event.origin!==global.location.origin) return;
      if(event.data?.type==='xray-wip-changed') markDirty(event.data.reason||'X-ray annotations changed','xray');
      if(event.data?.type==='xray-wip-autosaved') markXrayAutosaved(event.data);
      if(event.data?.type==='xray-wip-autosave-failed') markXrayAutosaveFailed(event.data);
    });
    global.addEventListener('beforeunload',event=>{
      if(!portableDirty) return;
      event.preventDefault();
      event.returnValue='';
    });
  }


  // R1113 — portable archive utilities support each AP/LAT view as IMAGE or EMPTY; v1.0.0 bundles remain readable.
  // R904 — portable archive utilities, bundle assembly, validation + import-record transformation.
  // These functions are pure bundle/file operations: no workspace navigation,
  // VTK widget access, CASE mutation, IndexedDB writes, or import installation.
function r863BytesFromText(text){ return new TextEncoder().encode(text); }

async function r863Sha256Hex(bytes){
    if(!crypto?.subtle?.digest) throw new Error("R863 — Web Crypto SHA-256 is unavailable; use HTTPS or localhost.");
    const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const digest = await crypto.subtle.digest("SHA-256", source);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,"0")).join("");
}

function r863Crc32(bytes){
    let crc = 0xffffffff;
    for(let i=0;i<bytes.length;i++){
        crc ^= bytes[i];
        for(let j=0;j<8;j++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function r863DosDateTime(date=new Date()){
    const year = Math.max(1980,date.getFullYear());
    const time = (date.getHours()<<11) | (date.getMinutes()<<5) | Math.floor(date.getSeconds()/2);
    const day = ((year-1980)<<9) | ((date.getMonth()+1)<<5) | date.getDate();
    return {time,day};
}

function r863ZipStore(files){
    // ZIP method 0 (STORE): no compression dependency, preserves every input byte.
    const enc = new TextEncoder();
    const localParts=[], centralParts=[];
    let offset=0;
    const dt=r863DosDateTime();
    for(const file of files){
        const name=enc.encode(file.path);
        const data=file.bytes instanceof Uint8Array ? file.bytes : new Uint8Array(file.bytes);
        const crc=r863Crc32(data);
        const local=new Uint8Array(30+name.length);
        const lv=new DataView(local.buffer);
        lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0x0800,true);
        lv.setUint16(8,0,true); lv.setUint16(10,dt.time,true); lv.setUint16(12,dt.day,true);
        lv.setUint32(14,crc,true); lv.setUint32(18,data.length,true); lv.setUint32(22,data.length,true);
        lv.setUint16(26,name.length,true); lv.setUint16(28,0,true); local.set(name,30);
        localParts.push(local,data);
        const central=new Uint8Array(46+name.length);
        const cv=new DataView(central.buffer);
        cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true);
        cv.setUint16(8,0x0800,true); cv.setUint16(10,0,true); cv.setUint16(12,dt.time,true); cv.setUint16(14,dt.day,true);
        cv.setUint32(16,crc,true); cv.setUint32(20,data.length,true); cv.setUint32(24,data.length,true);
        cv.setUint16(28,name.length,true); cv.setUint16(30,0,true); cv.setUint16(32,0,true);
        cv.setUint16(34,0,true); cv.setUint16(36,0,true); cv.setUint32(38,0,true); cv.setUint32(42,offset,true); central.set(name,46);
        centralParts.push(central);
        offset += local.length + data.length;
    }
    const centralOffset=offset;
    const centralSize=centralParts.reduce((n,p)=>n+p.length,0);
    const end=new Uint8Array(22); const ev=new DataView(end.buffer);
    ev.setUint32(0,0x06054b50,true); ev.setUint16(4,0,true); ev.setUint16(6,0,true);
    ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true);
    ev.setUint32(12,centralSize,true); ev.setUint32(16,centralOffset,true); ev.setUint16(20,0,true);
    return new Blob([...localParts,...centralParts,end],{type:"application/zip"});
}

function r863SafeStem(value){
    const s=String(value||"case").normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60);
    return s || "case";
}

function r863SafeImageExtension(fileName, source){
    const ext=String(fileName||"").match(/\.([a-zA-Z0-9]{1,8})$/)?.[1]?.toLowerCase();
    if(ext && ["dcm","ima","png","jpg","jpeg","tif","tiff","bmp","webp"].includes(ext)) return ext;
    return String(source).toUpperCase()==="DICOM" ? "dcm" : "bin";
}

function r864CRC32(bytes){
    let crc=0xffffffff;
    for(let i=0;i<bytes.length;i++){
        crc^=bytes[i];
        for(let j=0;j<8;j++) crc=(crc>>>1)^((crc&1)?0xedb88320:0);
    }
    return (crc^0xffffffff)>>>0;
}
function r864U16(view,offset){ if(offset<0||offset+2>view.byteLength) throw new Error('ZIP structure is truncated (16-bit field).'); return view.getUint16(offset,true); }
function r864U32(view,offset){ if(offset<0||offset+4>view.byteLength) throw new Error('ZIP structure is truncated (32-bit field).'); return view.getUint32(offset,true); }
function r864SafeMemberPath(path){
    return typeof path==='string' && path.length>0 && !path.startsWith('/') && !path.includes('\\') && !path.split('/').some(p=>p==='..'||p==='.'||p==='') && !/^[A-Za-z]:/.test(path);
}
function r864ReadStoredZip(input){
    const bytes=input instanceof Uint8Array?input:new Uint8Array(input);
    if(bytes.length<22) throw new Error('File is too small to be a ZIP archive.');
    if(bytes.length>100*1024*1024) throw new Error('Archive exceeds the 100 MB validation safety limit.');
    const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    const min=Math.max(0,bytes.length-65557); let eocd=-1;
    for(let i=bytes.length-22;i>=min;i--){ if(r864U32(view,i)===0x06054b50){eocd=i;break;} }
    if(eocd<0) throw new Error('ZIP end-of-central-directory record was not found.');
    const disk=r864U16(view,eocd+4), cdDisk=r864U16(view,eocd+6), entriesDisk=r864U16(view,eocd+8), entries=r864U16(view,eocd+10);
    const cdSize=r864U32(view,eocd+12), cdOffset=r864U32(view,eocd+16), commentLength=r864U16(view,eocd+20);
    if(disk!==0||cdDisk!==0||entriesDisk!==entries) throw new Error('Multi-disk ZIP archives are not supported.');
    if(entries===0xffff||cdSize===0xffffffff||cdOffset===0xffffffff) throw new Error('ZIP64 archives are not supported by this R864 test.');
    if(entries<1||entries>100) throw new Error('ZIP member count is outside the supported 1–100 range.');
    if(eocd+22+commentLength!==bytes.length) throw new Error('ZIP comment/trailing data length is inconsistent.');
    if(cdOffset+cdSize!==eocd) throw new Error('ZIP central-directory bounds are inconsistent.');
    const decoder=new TextDecoder('utf-8',{fatal:true}); const files=new Map(); let pos=cdOffset; let total=0;
    for(let i=0;i<entries;i++){
        if(r864U32(view,pos)!==0x02014b50) throw new Error(`Invalid central-directory header at member ${i+1}.`);
        const flags=r864U16(view,pos+8), method=r864U16(view,pos+10), crc=r864U32(view,pos+16), compressed=r864U32(view,pos+20), uncompressed=r864U32(view,pos+24);
        const nameLen=r864U16(view,pos+28), extraLen=r864U16(view,pos+30), commentLen=r864U16(view,pos+32), localOffset=r864U32(view,pos+42);
        if(flags&1) throw new Error('Encrypted ZIP entries are not supported.');
        if(flags&8) throw new Error('ZIP data-descriptor entries are not supported by the R863 STORE format.');
        if(method!==0) throw new Error(`Member compression method ${method} is unsupported; this validator expects the R863 STORE format.`);
        if(compressed!==uncompressed) throw new Error('STORE member has differing compressed/uncompressed sizes.');
        if(uncompressed>50*1024*1024) throw new Error('A ZIP member exceeds the 50 MB safety limit.');
        const nameStart=pos+46, next=nameStart+nameLen+extraLen+commentLen;
        if(next>cdOffset+cdSize) throw new Error('Central-directory member record exceeds directory bounds.');
        const path=decoder.decode(bytes.subarray(nameStart,nameStart+nameLen));
        if(!r864SafeMemberPath(path)) throw new Error(`Unsafe or invalid ZIP member path: ${JSON.stringify(path)}`);
        if(files.has(path)) throw new Error(`Duplicate ZIP member path: ${path}`);
        if(localOffset+30>cdOffset || r864U32(view,localOffset)!==0x04034b50) throw new Error(`Invalid local header for ${path}.`);
        const lFlags=r864U16(view,localOffset+6), lMethod=r864U16(view,localOffset+8), lCrc=r864U32(view,localOffset+14), lCompressed=r864U32(view,localOffset+18), lUncompressed=r864U32(view,localOffset+22);
        const lNameLen=r864U16(view,localOffset+26), lExtraLen=r864U16(view,localOffset+28), lNameStart=localOffset+30, dataStart=lNameStart+lNameLen+lExtraLen, dataEnd=dataStart+compressed;
        if(lFlags!==flags||lMethod!==method||lCrc!==crc||lCompressed!==compressed||lUncompressed!==uncompressed) throw new Error(`Local/central ZIP header mismatch for ${path}.`);
        if(dataStart>cdOffset||dataEnd>cdOffset||dataEnd< dataStart) throw new Error(`ZIP data bounds are invalid for ${path}.`);
        const localName=decoder.decode(bytes.subarray(lNameStart,lNameStart+lNameLen));
        if(localName!==path) throw new Error(`Local/central path mismatch for ${path}.`);
        const data=bytes.slice(dataStart,dataEnd);
        if(r864CRC32(data)!==crc) throw new Error(`ZIP CRC-32 mismatch for ${path}.`);
        files.set(path,data); total+=data.length; pos=next;
    }
    if(pos!==cdOffset+cdSize) throw new Error('Central-directory entry count/size mismatch.');
    if(total>100*1024*1024) throw new Error('Total expanded member size exceeds safety limit.');
    return files;
}
async function r864SHA256(bytes){
    if(!crypto?.subtle?.digest) throw new Error('Web Crypto SHA-256 is unavailable; use HTTPS or localhost.');
    const digest=await crypto.subtle.digest('SHA-256',bytes instanceof Uint8Array?bytes:new Uint8Array(bytes));
    return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
}
function r864ParseJSON(files,path){
    const bytes=files.get(path); if(!bytes) throw new Error(`Required JSON member is missing: ${path}`);
    try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}
    catch(e){throw new Error(`${path} is not valid UTF-8 JSON: ${e.message}`);}
}
async function r864ValidateBundleFile(file){
    const lines=['R864 — PORTABLE CASE BUNDLE VALIDATION','File: '+file.name,'Size: '+file.size.toLocaleString()+' bytes'];
    const files=r864ReadStoredZip(await file.arrayBuffer());
    lines.push(`PASS · ZIP structure, local/central headers, member CRC-32 (${files.size} members)`);
    if(!files.has('manifest.json')) throw new Error('manifest.json is missing.');
    const manifest=r864ParseJSON(files,'manifest.json');
    if(manifest.bundleFormat!=='orthopedic-case-bundle') throw new Error('Unsupported bundleFormat.');
    if(!['1.0.0','1.1.0'].includes(manifest.bundleFormatVersion)) throw new Error(`Unsupported bundle format version: ${manifest.bundleFormatVersion}`);
    const mixedCapable=manifest.bundleFormatVersion==='1.1.0';
    if(manifest.caseFile!=='case.json') throw new Error('Manifest caseFile must be case.json.');
    if(manifest.integrity?.algorithm!=='SHA-256') throw new Error('Manifest integrity algorithm must be SHA-256.');
    if(!Array.isArray(manifest.members)||manifest.members.length!==files.size-1) throw new Error('Manifest member list must account for every non-manifest ZIP member exactly once.');
    const listed=new Map();
    for(const member of manifest.members){
        if(!member||!r864SafeMemberPath(member.path)||member.path==='manifest.json') throw new Error('Manifest contains an invalid member path.');
        if(listed.has(member.path)) throw new Error(`Manifest lists duplicate member: ${member.path}`);
        listed.set(member.path,member);
    }
    for(const path of files.keys()) if(path!=='manifest.json'&&!listed.has(path)) throw new Error(`ZIP member is not declared by manifest: ${path}`);
    for(const path of listed.keys()) if(!files.has(path)) throw new Error(`Manifest member is missing from ZIP: ${path}`);
    for(const [path,member] of listed){
        const bytes=files.get(path);
        if(!Number.isInteger(member.byteLength)||member.byteLength!==bytes.length) throw new Error(`Byte-length mismatch: ${path}`);
        if(!/^[a-f0-9]{64}$/.test(String(member.sha256||''))) throw new Error(`Invalid SHA-256 value in manifest: ${path}`);
        if(await r864SHA256(bytes)!==member.sha256) throw new Error(`SHA-256 mismatch: ${path}`);
    }
    lines.push(`PASS · Manifest member list, byte lengths, SHA-256 (${listed.size}/${listed.size} members)`);
    const caseData=r864ParseJSON(files,'case.json');
    if(!caseData||typeof caseData!=='object'||Array.isArray(caseData)) throw new Error('case.json must contain a JSON object.');
    lines.push(`PASS · CASE JSON parses (${Object.keys(caseData).length} top-level fields; original fields not normalized)`);
    if(!Array.isArray(manifest.images)||manifest.images.length!==2) throw new Error('Manifest must contain exactly AP and LAT state records.');
    if(!Array.isArray(manifest.observations)||manifest.observations.length!==2) throw new Error('Manifest must contain exactly AP and LAT observation records.');
    const observations={}; const allowedPaths=new Set(['case.json']); const states={};
    for(const view of ['AP','LAT']){
        const imageRecords=manifest.images.filter(x=>x?.view===view);
        const obsRecords=manifest.observations.filter(x=>x?.view===view);
        if(imageRecords.length!==1||obsRecords.length!==1) throw new Error(`Manifest must have exactly one state and one observation record for ${view}.`);
        const image=imageRecords[0], obsMeta=obsRecords[0];
        if(image.observationPath!==obsMeta.path||obsMeta.path!==`observations/${view}-xray-observation-v2.json`) throw new Error(`${view}: observation path mismatch.`);
        const observationMember=listed.get(obsMeta.path);
        if(!observationMember||observationMember.kind!=='xray-observation'||observationMember.view!==view) throw new Error(`${view}: observation manifest/member identity mismatch.`);
        const observation=r864ParseJSON(files,obsMeta.path);
        if(observation.version!=='xray-observation-v2'||!Array.isArray(observation.images)||observation.images.length!==1||!Array.isArray(observation.annotations)) throw new Error(`${view}: invalid xray-observation-v2 structure.`);
        const oi=observation.images[0];
        if(oi.view!==view) throw new Error(`${view}: observation view identity mismatch.`);
        if(obsMeta.schemaVersion!==observation.version||obsMeta.annotationCount!==observation.annotations.length||image.annotationCount!==observation.annotations.length) throw new Error(`${view}: annotation count/schema metadata mismatch.`);
        if(image.state==='EMPTY' || image.source==='EMPTY'){
            if(!mixedCapable) throw new Error(`${view}: empty panels require portable bundle format 1.1.0.`);
            if(image.identityStatus!=='EMPTY'||image.path!==null||image.byteLength!==0||image.sha256!==null||image.checksumAlgorithm!==null) throw new Error(`${view}: empty-state manifest must not claim an image payload or checksum.`);
            if(oi.id!==image.imageId||oi.source!=='empty'||oi.identityStatus!=='EMPTY_NO_IMAGE'||oi.contentChecksum!=null||observation.annotations.length!==0) throw new Error(`${view}: empty observation must have no image checksum and zero annotations.`);
            for(const a of observation.annotations){ if(a.imageId!==oi.id) throw new Error(`${view}: annotation ${a.id||'(unnamed)'} references a different image ID.`); }
            states[view]='EMPTY';
            lines.push(`PASS · ${view} intentionally empty · zero annotations · no image member`);
        } else {
            if(image.identityStatus!=='VERIFIED'||image.checksumAlgorithm!=='SHA-256') throw new Error(`${view}: image identity/checksum is not marked verified.`);
            if(image.path!==`images/${view}/original.${String(image.path||'').split('.').pop()}`||!image.path.startsWith(`images/${view}/original.`)) throw new Error(`${view}: unexpected original image path.`);
            const imageMember=listed.get(image.path);
            if(!imageMember||imageMember.kind!=='original-image'||imageMember.view!==view||imageMember.sha256!==image.sha256||imageMember.byteLength!==image.byteLength) throw new Error(`${view}: image manifest/member identity mismatch.`);
            if(oi.id!==image.imageId||oi.contentChecksum!==image.sha256||oi.checksumAlgorithm!=='SHA-256') throw new Error(`${view}: observation is bound to a different image or checksum.`);
            for(const a of observation.annotations){ if(a.imageId!==oi.id) throw new Error(`${view}: annotation ${a.id||'(unnamed)'} references a different image ID.`); }
            if(image.dimensions?.width!==oi.width||image.dimensions?.height!==oi.height) throw new Error(`${view}: image dimension metadata mismatch.`);
            states[view]='IMAGE';
            lines.push(`PASS · ${view} image identity + SHA-256 + dimensions (${oi.width}×${oi.height})`);
        }
        allowedPaths.add(obsMeta.path); if(image.path) allowedPaths.add(image.path);
        observations[view]=observation;
        lines.push(`PASS · ${view} observation schema, image binding and ${observation.annotations.length} annotations`);
    }
    const unexpected=[...files.keys()].filter(path=>path!=='manifest.json'&&!allowedPaths.has(path));
    if(unexpected.length) throw new Error('Unexpected bundle members: '+unexpected.join(', '));
    lines.push(`PASS · CASE + AP(${states.AP}) + LAT(${states.LAT}) portable state layout`);
    lines.push(''); lines.push('VALIDATION RESULT: PASS');
    lines.push('Read-only validation complete. No CASE, IndexedDB, image, or annotation data was changed.');
    lines.push('R871 import validates before explicit confirmation and creates rollback checkpoints before installation.');
    lines.push(`Case name: ${manifest.caseName||'(not set)'}`);
    lines.push(`Exporter: ${manifest.exporterBuild||'(not set)'} · Exported at: ${manifest.exportedAt||'(not set)'}`);
    return {lines,files,manifest,caseData,observations};
}

async function r904BuildBundle(caseSnapshot, records, exporterBuild='R904'){
    if(!caseSnapshot || typeof caseSnapshot!=='object' || Array.isArray(caseSnapshot)) throw new Error('The current CASE snapshot must be a JSON object.');
    if(!records || typeof records!=='object') throw new Error('AP/LAT export records are required.');
    const files=[];
    const manifest={bundleFormat:'orthopedic-case-bundle',bundleFormatVersion:'1.1.0',exporterBuild,exportedAt:new Date().toISOString(),caseFile:'case.json',caseSchemaVersion:caseSnapshot?.metadata?.version??null,caseName:caseSnapshot?.metadata?.case_name??null,integrity:{algorithm:'SHA-256',scope:'all listed members except manifest.json'},images:[],observations:[],members:[]};
    const caseBytes=r863BytesFromText(JSON.stringify(caseSnapshot,null,2));
    files.push({path:'case.json',bytes:caseBytes});
    manifest.members.push({path:'case.json',kind:'case',byteLength:caseBytes.length,sha256:await r863Sha256Hex(caseBytes)});
    for(const view of ['AP','LAT']){
        const record=records[view];
        if(!record) throw new Error(`${view}: live workspace state is missing.`);
        if(record.imageView!==view||record.observation?.images?.[0]?.view!==view) throw new Error(`${view}: live observation/view identity mismatch.`);
        if(record.observation?.version!=='xray-observation-v2'||!Array.isArray(record.observation.annotations)||!Array.isArray(record.observation.images)||record.observation.images.length!==1) throw new Error(`${view}: observation does not match xray-observation-v2.`);
        const observation=JSON.parse(JSON.stringify(record.observation));
        const observationPath=`observations/${view}-xray-observation-v2.json`;
        const observationBytes=r863BytesFromText(JSON.stringify(observation,null,2));
        const source=String(record.imageSource||observation.images[0].source||'').toUpperCase();
        if(source==='EMPTY'){
            if(record.imageBytes?.byteLength||record.imageChecksum||observation.annotations.length!==0||observation.images[0].source!=='empty'||observation.images[0].identityStatus!=='EMPTY_NO_IMAGE'||observation.images[0].contentChecksum!=null) throw new Error(`${view}: empty panel record is inconsistent or contains image/annotation data.`);
            const image=observation.images[0];
            manifest.images.push({view,state:'EMPTY',imageId:image.id||`empty-image-${view}`,source:'EMPTY',fileName:null,mediaType:null,path:null,byteLength:0,checksumAlgorithm:null,sha256:null,identityStatus:'EMPTY',observationPath,annotationCount:0,pixelSpacing:null,dimensions:{width:image.width||null,height:image.height||null}});
            files.push({path:observationPath,bytes:observationBytes});
            manifest.observations.push({view,path:observationPath,schemaVersion:observation.version,annotationCount:0});
            manifest.members.push({path:observationPath,kind:'xray-observation',view,byteLength:observationBytes.length,sha256:await r863Sha256Hex(observationBytes)});
            continue;
        }
        if(!record.imageBytes?.byteLength||!/^[a-f0-9]{64}$/.test(String(record.imageChecksum||''))) throw new Error(`${view}: original image bytes or SHA-256 are missing. A loaded panel must include its original image.`);
        const imageBytes=record.imageBytes instanceof Uint8Array?record.imageBytes:new Uint8Array(record.imageBytes);
        const checksum=await r863Sha256Hex(imageBytes);
        if(checksum!==record.imageChecksum) throw new Error(`${view}: checksum mismatch; no bundle was downloaded.`);
        const ext=r863SafeImageExtension(record.imageFileName,source);
        const imagePath=`images/${view}/original.${ext}`;
        files.push({path:imagePath,bytes:imageBytes},{path:observationPath,bytes:observationBytes});
        manifest.images.push({view,state:'IMAGE',imageId:observation.images[0].id||null,source:record.imageSource,fileName:record.imageFileName||null,mediaType:record.imageFileType||null,path:imagePath,byteLength:imageBytes.length,checksumAlgorithm:'SHA-256',sha256:checksum,identityStatus:'VERIFIED',observationPath,annotationCount:observation.annotations.length,pixelSpacing:observation.images[0].pixelSpacing||null,dimensions:{width:observation.images[0].width||null,height:observation.images[0].height||null}});
        manifest.observations.push({view,path:observationPath,schemaVersion:observation.version,annotationCount:observation.annotations.length});
        manifest.members.push({path:imagePath,kind:'original-image',view,byteLength:imageBytes.length,sha256:checksum},{path:observationPath,kind:'xray-observation',view,byteLength:observationBytes.length,sha256:await r863Sha256Hex(observationBytes)});
    }
    const manifestBytes=r863BytesFromText(JSON.stringify(manifest,null,2));
    files.push({path:'manifest.json',bytes:manifestBytes});
    const blob=r863ZipStore(files);
    const caseName=r863SafeStem(caseSnapshot?.metadata?.case_name||caseSnapshot?.patient?.patient_id||'case');
    return {blob,caseName,memberCount:files.length,manifest};
}


// R904 — Convert a validated portable AP/LAT payload into the renderer-neutral WIP record shape.
// Pure data conversion only: no VTK access, IndexedDB writes, workspace changes, or CASE mutation.
function r904BuildWipRecord(view, validated){
    if(view!=='AP'&&view!=='LAT') throw new Error('WIP import record view must be AP or LAT.');
    if(!validated||!validated.manifest||!validated.files||!validated.observations) throw new Error('Validated portable bundle payload is incomplete.');
    const matches=(validated.manifest.images||[]).filter(x=>x?.view===view);
    if(matches.length!==1) throw new Error(`${view}: expected exactly one state manifest record.`);
    const image=matches[0]; const observation=validated.observations[view];
    if(!observation||!Array.isArray(observation.images)||observation.images.length!==1||observation.images[0]?.view!==view) throw new Error(`${view}: validated observation/image binding is invalid.`);
    if(image.state==='EMPTY'||image.source==='EMPTY'){
        if(image.path!==null||image.byteLength!==0||image.sha256!==null||observation.annotations.length!==0||observation.images[0].source!=='empty') throw new Error(`${view}: invalid empty-panel portable state.`);
        return {schemaVersion:'xray-live-empty-v1',savedAt:new Date().toISOString(),observation:JSON.parse(JSON.stringify(observation)),imageFileBytes:null,imageFileBlob:null,imageFile:null,imageFileName:null,imageFileType:null,imageFileLastModified:null,imageByteLength:0,imageChecksumAlgorithm:null,imageChecksum:null,imageIdentityStatus:'EMPTY_NO_IMAGE',imageSource:'EMPTY',imageView:view};
    }
    const bytes=validated.files.get(image.path);
    if(!(bytes instanceof Uint8Array)||!bytes.length) throw new Error(`${view}: validated original image bytes are missing.`);
    const arrayBuffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
    return {schemaVersion:'xray-wip-v3',savedAt:new Date().toISOString(),observation:JSON.parse(JSON.stringify(observation)),imageFileBytes:arrayBuffer,imageFileBlob:null,imageFile:null,imageFileName:image.fileName||`original.${String(image.path).split('.').pop()}`,imageFileType:image.mediaType||'application/dicom',imageFileLastModified:null,imageByteLength:bytes.length,imageChecksumAlgorithm:'SHA-256',imageChecksum:image.sha256,imageIdentityStatus:'CHECKSUM_VERIFIED',imageSource:image.source||'DICOM',imageView:view};
}


  global.CaseFileService={
    VERSION:'R1139', openCase, saveCaseToDevice, markOpenedBaseline, markDirty,
    archive:{
      bytesFromText:r863BytesFromText, sha256Hex:r863Sha256Hex, zipStore:r863ZipStore,
      safeStem:r863SafeStem, safeImageExtension:r863SafeImageExtension,
      buildBundle:r904BuildBundle,
      // R1139 compatibility alias: the validated importer calls buildLiveRecord;
      // R904 implemented the same pure conversion under buildWipRecord.
      // Keep both names so existing archive callers retain their contract.
      buildWipRecord:r904BuildWipRecord,
      buildLiveRecord:r904BuildWipRecord,
      validateBundleFile:r864ValidateBundleFile
    },
    getStatus(){return {portableDirty,lastPortableSaveAt,xrayLocallySaved,nonXrayDirty,...lastStatus};}
  };
})(window);

/* ============================================================================
 * R909 — Local named-case repository adapter.
 * Separate responsibility/API from portable ZIP CaseFileService above.
 * IndexedDB only; this block does not alter the portable ZIP workflow.
 * ========================================================================== */
/* R909 — Browser-first CaseRepository v1 integrated into existing CaseFileService asset (standalone IndexedDB adapter)
 *
 * Scope: storage only. This file does not capture VTK data, mutate window.currentCase,
 * alter the portable ZIP format, or add UI controls.
 *
 * Load before code that calls window.CaseRepository.
 */
(function installCaseRepository(global) {
  'use strict';

  const VERSION = 'R913';
  const DB_NAME = 'orthopedic-hexapod-case-repository';
  const DB_VERSION = 1;
  const STORE_NAME = 'cases';

  function makeError(code, message, details) {
    const error = new Error(message);
    error.name = 'CaseRepositoryError';
    error.code = code;
    if (details !== undefined) error.details = details;
    return error;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function makeId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    // UUID-shaped fallback for browsers without crypto.randomUUID.
    const bytes = new Uint8Array(16);
    if (global.crypto && typeof global.crypto.getRandomValues === 'function') {
      global.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const h = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
  }

  function requireName(name) {
    if (typeof name !== 'string' || !name.trim()) {
      throw makeError('INVALID_NAME', 'A non-empty case name is required.');
    }
    return name.trim();
  }

  function requireCaseData(caseData) {
    if (!caseData || typeof caseData !== 'object' || Array.isArray(caseData)) {
      throw makeError('INVALID_CASE_DATA', 'caseData must be a complete CASE object.');
    }
  }

  function requireXray(xray) {
    if (!xray || typeof xray !== 'object' || Array.isArray(xray)) {
      throw makeError('INVALID_XRAY_DATA', 'xray must contain AP and LAT work records.');
    }
    if (!Object.prototype.hasOwnProperty.call(xray, 'AP') ||
        !Object.prototype.hasOwnProperty.call(xray, 'LAT')) {
      throw makeError('INVALID_XRAY_DATA', 'Both AP and LAT record slots are required. A slot may contain an explicit null when no work exists.');
    }
  }

  // Clone through the platform structured-clone implementation so Blob, ArrayBuffer,
  // typed arrays and ordinary nested CASE data are not converted to JSON strings.
  function clone(value) {
    if (typeof global.structuredClone === 'function') return global.structuredClone(value);
    // IndexedDB itself performs structured cloning, but callers need a detached object.
    // Do not silently JSON-clone binary image payloads on older browsers.
    throw makeError('STRUCTURED_CLONE_UNAVAILABLE',
      'This browser does not expose structuredClone. Use a supported browser or add a tested clone adapter before saving binary X-ray data.');
  }

  function summarize(record) {
    const caseData = record.caseData || {};
    const patient = caseData.patient || {};
    const metadata = caseData.metadata || {};
    const rawName = patient.patient_name ?? metadata.patient_name ?? '';
    const cleanedName = String(rawName || '').trim();
    const patientName = !cleanedName || /^enter\s+name\s*$/i.test(cleanedName) ? 'UnknownPatient' : cleanedName;
    const rawId = patient.patient_id ?? metadata.patient_id ?? '';
    const cleanedId = String(rawId || '').trim();
    const patientId = !cleanedId || /^enter\s+id\s*$/i.test(cleanedId) ? '' : cleanedId;
    return {
      caseId: record.caseId,
      name: record.name,
      patientName,
      patientId,
      hasCompleteXray: ['AP','LAT'].every(view => {
        const xrayRecord = record.xray && record.xray[view];
        return !!(xrayRecord && xrayRecord.observation && xrayRecord.imageFileBytes && xrayRecord.imageChecksum);
      }),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      revision: record.revision,
      recordVersion: record.recordVersion
    };
  }

  let dbPromise = null;

  function openDatabase() {
    if (dbPromise) return dbPromise;
    if (!global.indexedDB) {
      return Promise.reject(makeError('INDEXEDDB_UNAVAILABLE',
        'IndexedDB is unavailable in this browser context.'));
    }

    dbPromise = new Promise((resolve, reject) => {
      let request;
      try {
        request = global.indexedDB.open(DB_NAME, DB_VERSION);
      } catch (error) {
        reject(makeError('OPEN_FAILED', 'Could not open the local case database.', String(error && error.message || error)));
        return;
      }

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'caseId' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          dbPromise = null;
        };
        db.onclose = () => { dbPromise = null; };
        resolve(db);
      };
      request.onerror = () => {
        dbPromise = null;
        reject(makeError('OPEN_FAILED', 'Could not open the local case database.',
          String(request.error && request.error.message || request.error || 'Unknown IndexedDB error')));
      };
      request.onblocked = () => {
        // Do not reject here: another open tab may close and allow the upgrade/open.
      };
    });
    return dbPromise;
  }

  function transactionFailure(tx, fallback) {
    return makeError('TRANSACTION_FAILED',
      fallback || 'The IndexedDB transaction did not complete.',
      String(tx.error && tx.error.message || tx.error || 'Unknown transaction error'));
  }

  async function listCases() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      let records;
      request.onsuccess = () => {
        records = (request.result || []).map(summarize);
      };
      request.onerror = () => reject(makeError('LIST_FAILED', 'Could not list saved cases.'));
      tx.oncomplete = () => {
        (records || []).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
        resolve(records || []);
      };
      tx.onerror = () => reject(transactionFailure(tx, 'Could not list saved cases.'));
      tx.onabort = () => reject(transactionFailure(tx, 'Listing saved cases was aborted.'));
    });
  }

  async function getCase(caseId) {
    if (typeof caseId !== 'string' || !caseId) throw makeError('INVALID_CASE_ID', 'A caseId is required.');
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(caseId);
      let result = null;
      request.onsuccess = () => { result = request.result ? clone(request.result) : null; };
      request.onerror = () => reject(makeError('READ_FAILED', 'Could not read the selected case.'));
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(transactionFailure(tx, 'Could not read the selected case.'));
      tx.onabort = () => reject(transactionFailure(tx, 'Reading the selected case was aborted.'));
    });
  }

  async function createCase(input) {
    if (!input || typeof input !== 'object') throw makeError('INVALID_INPUT', 'createCase expects an input object.');
    const name = requireName(input.name);
    requireCaseData(input.caseData);
    requireXray(input.xray);

    const timestamp = nowIso();
    const caseData = clone(input.caseData);
    if (caseData.metadata && typeof caseData.metadata === 'object' && !Array.isArray(caseData.metadata)) {
      caseData.metadata.case_name = name;
    }

    const record = {
      recordVersion: 1,
      caseId: makeId(),
      name,
      createdAt: timestamp,
      updatedAt: timestamp,
      revision: 1,
      caseData,
      xray: clone(input.xray)
    };

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).add(record);
      tx.oncomplete = () => resolve(clone(record));
      tx.onerror = () => reject(transactionFailure(tx, 'Could not create the saved case.'));
      tx.onabort = () => reject(transactionFailure(tx, 'Creating the saved case was aborted.'));
    });
  }

  async function saveCase(caseId, input) {
    if (typeof caseId !== 'string' || !caseId) throw makeError('INVALID_CASE_ID', 'A caseId is required.');
    if (!input || typeof input !== 'object') throw makeError('INVALID_INPUT', 'saveCase expects an input object.');
    const expectedRevision = input.expectedRevision;
    if (!Number.isInteger(expectedRevision) || expectedRevision < 1) {
      throw makeError('EXPECTED_REVISION_REQUIRED', 'Updating a case requires its expectedRevision.');
    }
    const name = requireName(input.name);
    requireCaseData(input.caseData);
    requireXray(input.xray);

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      let updatedRecord = null;
      let conflict = null;
      const getRequest = store.get(caseId);

      getRequest.onsuccess = () => {
        const current = getRequest.result;
        if (!current) {
          conflict = makeError('CASE_NOT_FOUND', 'The case no longer exists. No changes were saved.', { caseId });
          tx.abort();
          return;
        }
        if (current.revision !== expectedRevision) {
          conflict = makeError('REVISION_CONFLICT',
            'This saved case changed since it was opened. Reload or compare the newer version before saving.',
            { caseId, expectedRevision, actualRevision: current.revision });
          tx.abort();
          return;
        }

        const caseData = clone(input.caseData);
        if (caseData.metadata && typeof caseData.metadata === 'object' && !Array.isArray(caseData.metadata)) {
          caseData.metadata.case_name = name;
        }
        updatedRecord = {
          recordVersion: 1,
          caseId: current.caseId,
          name,
          createdAt: current.createdAt,
          updatedAt: nowIso(),
          revision: current.revision + 1,
          caseData,
          xray: clone(input.xray)
        };
        store.put(updatedRecord);
      };

      tx.oncomplete = () => resolve(clone(updatedRecord));
      tx.onerror = () => reject(conflict || transactionFailure(tx, 'Could not update the saved case.'));
      tx.onabort = () => reject(conflict || transactionFailure(tx, 'Updating the saved case was aborted.'));
    });
  }

  async function duplicateCase(caseId, newName) {
    const source = await getCase(caseId);
    if (!source) throw makeError('CASE_NOT_FOUND', 'The case to duplicate was not found.', { caseId });
    return createCase({
      name: requireName(newName),
      caseData: source.caseData,
      xray: source.xray
    });
  }

  async function renameCase(caseId, newName, expectedRevision) {
    const current = await getCase(caseId);
    if (!current) throw makeError('CASE_NOT_FOUND', 'The case to rename was not found.', { caseId });
    if (!Number.isInteger(expectedRevision) || expectedRevision < 1) {
      throw makeError('EXPECTED_REVISION_REQUIRED', 'Renaming a case requires its expectedRevision.');
    }
    if (current.revision !== expectedRevision) {
      throw makeError('REVISION_CONFLICT', 'This saved case changed since it was read. Refresh the list before renaming.',
        { caseId, expectedRevision, actualRevision: current.revision });
    }
    const name = requireName(newName);
    const caseData = clone(current.caseData);
    if (caseData.metadata && typeof caseData.metadata === 'object' && !Array.isArray(caseData.metadata)) {
      caseData.metadata.case_name = name;
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      let result = null;
      let conflict = null;
      const request = store.get(caseId);
      request.onsuccess = () => {
        const latest = request.result;
        if (!latest) {
          conflict = makeError('CASE_NOT_FOUND', 'The case no longer exists.', { caseId });
          tx.abort();
          return;
        }
        if (latest.revision !== expectedRevision) {
          conflict = makeError('REVISION_CONFLICT', 'This saved case changed during rename. No rename was applied.',
            { caseId, expectedRevision, actualRevision: latest.revision });
          tx.abort();
          return;
        }
        result = {
          ...latest,
          name,
          caseData,
          updatedAt: nowIso(),
          revision: latest.revision + 1
        };
        store.put(result);
      };
      tx.oncomplete = () => resolve(clone(result));
      tx.onerror = () => reject(conflict || transactionFailure(tx, 'Could not rename the saved case.'));
      tx.onabort = () => reject(conflict || transactionFailure(tx, 'Renaming the saved case was aborted.'));
    });
  }

  async function deleteCase(caseId, expectedRevision) {
    if (typeof caseId !== 'string' || !caseId) throw makeError('INVALID_CASE_ID', 'A caseId is required.');
    if (!Number.isInteger(expectedRevision) || expectedRevision < 1) {
      throw makeError('EXPECTED_REVISION_REQUIRED', 'Deleting a case requires its expectedRevision.');
    }
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      let conflict = null;
      const request = store.get(caseId);
      request.onsuccess = () => {
        const current = request.result;
        if (!current) {
          conflict = makeError('CASE_NOT_FOUND', 'The case no longer exists.', { caseId });
          tx.abort();
          return;
        }
        if (current.revision !== expectedRevision) {
          conflict = makeError('REVISION_CONFLICT', 'This saved case changed since it was listed. Refresh before deleting.',
            { caseId, expectedRevision, actualRevision: current.revision });
          tx.abort();
          return;
        }
        store.delete(caseId);
      };
      tx.oncomplete = () => resolve({ deleted: true, caseId });
      tx.onerror = () => reject(conflict || transactionFailure(tx, 'Could not delete the saved case.'));
      tx.onabort = () => reject(conflict || transactionFailure(tx, 'Deleting the saved case was aborted.'));
    });
  }

  async function storageStatus() {
    const db = await openDatabase();
    let estimate = null;
    let persisted = null;
    try {
      if (global.navigator && global.navigator.storage) {
        if (typeof global.navigator.storage.estimate === 'function') {
          estimate = await global.navigator.storage.estimate();
        }
        if (typeof global.navigator.storage.persisted === 'function') {
          persisted = await global.navigator.storage.persisted();
        }
      }
    } catch (_) { /* Diagnostics only; database availability is the primary result. */ }
    return {
      available: true,
      databaseName: DB_NAME,
      databaseVersion: DB_VERSION,
      objectStore: STORE_NAME,
      storageEstimate: estimate,
      persistentStorageGranted: persisted,
      note: 'IndexedDB survives ordinary reloads and browser restarts, but users can clear site data and browser eviction policies vary. Keep portable ZIP backups.'
    };
  }

  global.CaseRepository = Object.freeze({
    VERSION,
    DB_NAME,
    DB_VERSION,
    init: openDatabase,
    listCases,
    getCase,
    createCase,
    saveCase,
    duplicateCase,
    renameCase,
    deleteCase,
    storageStatus
  });
})(window);



/* R910 — Delegated Patient repository diagnostics.
 * Workspace fragments may be inserted with innerHTML, which does not execute inline scripts.
 * This controller lives in the already-loaded case_file_service.js asset and uses delegated clicks.
 */
(function installR910RepositoryDiagnostics(global) {
  'use strict';
  if (global.__R910_REPOSITORY_DIAGNOSTICS__) return;
  global.__R910_REPOSITORY_DIAGNOSTICS__ = true;
  const PROBE_KEY = 'r909.caseRepository.persistenceProbeId';
  let initializedPanel = null;
  const byId = id => global.document.getElementById(id);
  function say(message, detail) {
    const status = byId('r909RepoStatus');
    const output = byId('r909RepoOutput');
    if (status) status.textContent = 'R910 — ' + message;
    if (output && detail !== undefined) output.textContent = typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2);
  }
  function repo() {
    if (!global.CaseRepository) throw new Error('window.CaseRepository is missing. The updated case_file_service.js did not install its repository API.');
    return global.CaseRepository;
  }
  async function refreshList() {
    const rows = await repo().listCases();
    const box = byId('r909RepoList');
    if (box) box.textContent = rows.length ? JSON.stringify(rows, null, 2) : '(No saved local cases.)';
    return rows;
  }
  async function initPanel() {
    const status = byId('r909RepoStatus');
    if (!status || initializedPanel === status) return;
    initializedPanel = status;
    try {
      await repo().init();
      const info = await repo().storageStatus();
      say('READY · ' + repo().VERSION + ' · delegated controller active', info);
      await refreshList();
    } catch (e) { say('NOT READY', String(e.stack || e)); }
  }
  async function runTests() {
    const log = []; let first = null, duplicate = null;
    try {
      const api = repo(); await api.init();
      log.push('PASS: IndexedDB init (' + api.VERSION + ')');
      const before = await api.listCases(); log.push('PASS: listCases() returned ' + before.length + ' row(s)');
      const caseData = { metadata: { case_name: 'R910 TEST — temporary CRUD record' }, diagnostic: { testOnly: true } };
      const xray = { AP: { schemaVersion: 'r910-test', testPayload: 'AP' }, LAT: { schemaVersion: 'r910-test', testPayload: 'LAT' } };
      first = await api.createCase({ name: 'R910 TEST — temporary CRUD record', caseData, xray });
      log.push('PASS: createCase() revision=' + first.revision + ', id=' + first.caseId);
      const read = await api.getCase(first.caseId);
      if (!read || read.xray?.AP?.testPayload !== 'AP' || read.xray?.LAT?.testPayload !== 'LAT') throw new Error('Read-back did not preserve both AP/LAT payload slots.');
      log.push('PASS: getCase() preserved CASE and AP/LAT test payloads');
      const updated = await api.saveCase(first.caseId, { name: first.name, expectedRevision: first.revision, caseData: { ...read.caseData, diagnostic: { testOnly: true, updated: true } }, xray: read.xray });
      if (updated.revision !== first.revision + 1) throw new Error('Revision did not increment after saveCase().');
      log.push('PASS: saveCase() incremented revision');
      try { await api.saveCase(first.caseId, { name: first.name, expectedRevision: first.revision, caseData: read.caseData, xray: read.xray }); throw new Error('Stale revision was incorrectly accepted.'); }
      catch(e) { if (e.code !== 'REVISION_CONFLICT') throw e; log.push('PASS: stale revision rejected'); }
      duplicate = await api.duplicateCase(first.caseId, 'R910 TEST — temporary duplicate');
      log.push('PASS: duplicateCase() created separate ID');
      const renamed = await api.renameCase(duplicate.caseId, 'R910 TEST — temporary renamed duplicate', duplicate.revision);
      if (renamed.caseId !== duplicate.caseId || renamed.revision !== duplicate.revision + 1) throw new Error('Rename changed identity or failed revision increment.');
      log.push('PASS: renameCase() preserved identity');
      await api.deleteCase(duplicate.caseId, renamed.revision); duplicate = null; log.push('PASS: deleteCase() removed duplicate');
      await api.deleteCase(first.caseId, updated.revision); first = null; log.push('PASS: deleteCase() removed temporary record');
      await refreshList(); log.push('PASS: final list refresh');
      say('ALL TESTS PASSED', log.join('\n'));
    } catch(e) {
      log.push('FAIL: ' + String(e.stack || e));
      try { if (duplicate) { const latest = await repo().getCase(duplicate.caseId); if (latest) await repo().deleteCase(latest.caseId, latest.revision); } } catch(_) {}
      try { if (first) { const latest = await repo().getCase(first.caseId); if (latest) await repo().deleteCase(latest.caseId, latest.revision); } } catch(_) {}
      try { await refreshList(); } catch(_) {}
      say('TEST FAILED', log.join('\n'));
    }
  }
  async function createProbe() {
    const api = repo(); await api.init();
    const oldId = global.localStorage.getItem(PROBE_KEY);
    if (oldId) { try { const old = await api.getCase(oldId); if (old) await api.deleteCase(old.caseId, old.revision); } catch(_) {} }
    const record = await api.createCase({ name: 'R910 TEST — reload persistence probe', caseData: { metadata: { case_name: 'R910 TEST — reload persistence probe' }, diagnostic: { testOnly: true, purpose: 'reload-persistence' } }, xray: { AP: null, LAT: null } });
    global.localStorage.setItem(PROBE_KEY, record.caseId);
    await refreshList(); say('PROBE CREATED · reload Patient workspace, then check probe.', {caseId:record.caseId, revision:record.revision, note:'One labelled test record remains until deleted.'});
  }
  async function checkProbe() {
    const api = repo(); await api.init(); const id = global.localStorage.getItem(PROBE_KEY);
    if (!id) { say('NO PROBE ID', 'Create the persistence probe first.'); return; }
    const record = await api.getCase(id);
    if (!record) { say('PROBE NOT FOUND', {caseId:id, message:'ID exists in localStorage but record is missing from IndexedDB.'}); return; }
    say('PERSISTENCE PASS · record survived workspace reload', {caseId:record.caseId, name:record.name, revision:record.revision, createdAt:record.createdAt}); await refreshList();
  }
  async function deleteProbe() {
    const api = repo(); await api.init(); const id = global.localStorage.getItem(PROBE_KEY);
    if (!id) { say('NO PROBE TO DELETE'); return; }
    const record = await api.getCase(id); if (record) await api.deleteCase(record.caseId, record.revision);
    global.localStorage.removeItem(PROBE_KEY); await refreshList(); say('PROBE DELETED · no persistence test record remains');
  }
  const actions = {
    r909RepoRunTests: runTests,
    r909RepoCreatePersistenceProbe: createProbe,
    r909RepoCheckPersistenceProbe: checkProbe,
    r909RepoDeletePersistenceProbe: deleteProbe,
    r909RepoRefreshList: async () => { await refreshList(); say('LIST REFRESHED'); }
  };
  global.document.addEventListener('click', async event => {
    const button = event.target && event.target.closest ? event.target.closest('button[id]') : null;
    if (!button || !actions[button.id]) return;
    event.preventDefault();
    try { await actions[button.id](); }
    catch(e) { say('ERROR', String(e.stack || e)); }
  });
  const observer = new global.MutationObserver(() => { if (byId('r909RepoStatus')) initPanel(); });
  observer.observe(global.document.documentElement, { childList: true, subtree: true });
  if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', initPanel, { once: true });
  else initPanel();
})(window);
