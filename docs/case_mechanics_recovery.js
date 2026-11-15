/*
 * mechanics_recovery.js
 * CASE-derived mechanical recovery context (R1149/R1150).
 *
 * Requires shared.js and mechanics.js.
 *
 * Compatibility note:
 * The CASE parameter fields CLINICAL_ANGLES and R_PROX_ANGLES
 * are legacy simulation inputs. This adapter reproduces the
 * current Python build_day0_geometry() convention exactly.
 * It does NOT reinterpret clinical geometric measurements as
 * Euler angles. A future clinical-to-mechanical parameter
 * contract must replace these legacy fields explicitly.
 */
(function(root){
  'use strict';

  function finiteVector(v,n,label){
    if(!Array.isArray(v)||v.length!==n||v.some(x=>!Number.isFinite(Number(x)))){
      throw new TypeError(label+' must contain '+n+' finite numbers');
    }
    return v.map(Number);
  }

  function multiply4(A,B){
    const C=Array.from({length:4},()=>[0,0,0,0]);
    for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)C[i][j]+=A[i][k]*B[k][j];
    return C;
  }

  function transpose3(A){
    return [[A[0][0],A[1][0],A[2][0]],[A[0][1],A[1][1],A[2][1]],[A[0][2],A[1][2],A[2][2]]];
  }

  function multiply3(A,B){
    const C=[[0,0,0],[0,0,0],[0,0,0]];
    for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++)C[i][j]+=A[i][k]*B[k][j];
    return C;
  }

  function rotationZXYDegrees(values){
    const [zDeg,xDeg,yDeg]=finiteVector(values,3,'ZXY angle vector');
    const z=zDeg*Math.PI/180,x=xDeg*Math.PI/180,y=yDeg*Math.PI/180;
    const cz=Math.cos(z),sz=Math.sin(z),cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y);
    const Rz=[[cz,-sz,0],[sz,cz,0],[0,0,1]];
    const Rx=[[1,0,0],[0,cx,-sx],[0,sx,cx]];
    const Ry=[[cy,0,sy],[0,1,0],[-sy,0,cy]];
    return multiply3(multiply3(Rz,Rx),Ry);
  }

  function rigidFromRotationTranslation(R,t){
    return [
      [R[0][0],R[0][1],R[0][2],t[0]],
      [R[1][0],R[1][1],R[1][2],t[1]],
      [R[2][0],R[2][1],R[2][2],t[2]],
      [0,0,0,1]
    ];
  }

  function inverseRigid(T){
    const R=[[T[0][0],T[0][1],T[0][2]],[T[1][0],T[1][1],T[1][2]],[T[2][0],T[2][1],T[2][2]]];
    const Rt=transpose3(R),t=[T[0][3],T[1][3],T[2][3]];
    const ti=Rt.map(row=>-(row[0]*t[0]+row[1]*t[1]+row[2]*t[2]));
    return rigidFromRotationTranslation(Rt,ti);
  }

  function transformPoint(T,p){
    return [
      T[0][0]*p[0]+T[0][1]*p[1]+T[0][2]*p[2]+T[0][3],
      T[1][0]*p[0]+T[1][1]*p[1]+T[1][2]*p[2]+T[1][3],
      T[2][0]*p[0]+T[2][1]*p[1]+T[2][2]*p[2]+T[2][3]
    ];
  }


  function signedCaseValue(field,positiveDirection,label){
    if(!field||!Number.isFinite(Number(field.value))||typeof field.direction!=='string'){
      throw new TypeError(label+' must contain a numeric value and direction');
    }
    return field.direction===positiveDirection?Number(field.value):-Number(field.value);
  }

  function deriveLegacySimulationParameters(caseData){
    const frame=caseData.frame,mounting=caseData.mounting,deformity=caseData.deformity;
    if(!frame||!mounting||!deformity) throw new Error('CASE frame, mounting, and deformity sections are required to derive mechanical recovery context');
    if(!root.HardwareSpec || typeof root.HardwareSpec.resolveAnchorRadiusMm!=='function'){
      throw new Error('R1156 hardware_spec.js must load before mechanics_recovery.js');
    }
    const anchorRadius=root.HardwareSpec.resolveAnchorRadiusMm(frame);
    if(!Number.isFinite(anchorRadius)||anchorRadius<=0){
      throw new Error('HardwareSpec returned an invalid anchor radius');
    }
    const day0=finiteVector(frame.initial_strut_lengths,6,'CASE.frame.initial_strut_lengths');
    return {
      ANCHOR_RADIUS:anchorRadius,
      BONE_PROX_ORIGIN:[
        signedCaseValue(mounting.ap_offset,'lateral','mounting.ap_offset'),
        signedCaseValue(mounting.lat_offset,'posterior','mounting.lat_offset'),
        signedCaseValue(mounting.axial_offset,'distal','mounting.axial_offset')
      ],
      R_PROX_ANGLES:[
        signedCaseValue(mounting.master_rotation,'internal','mounting.master_rotation'),
        signedCaseValue(mounting.lat_tilt,'distal','mounting.lat_tilt'),
        signedCaseValue(mounting.ap_tilt,'distal','mounting.ap_tilt')
      ],
      CLINICAL_OFFSET:[
        signedCaseValue(deformity.ap_translation,'medial','deformity.ap_translation'),
        signedCaseValue(deformity.lat_translation,'anterior','deformity.lat_translation'),
        signedCaseValue(deformity.bone_length,'short','deformity.bone_length')
      ],
      CLINICAL_ANGLES:[
        signedCaseValue(deformity.bone_rotation,'external','deformity.bone_rotation'),
        signedCaseValue(deformity.lat_angulation,'posterior','deformity.lat_angulation'),
        signedCaseValue(deformity.ap_angulation,'valgus','deformity.ap_angulation')
      ],
      PHASE1_DAY0_STRUTS:day0
    };
  }

  function compareParameterMirror(derived,mirror){
    if(!mirror||typeof mirror!=='object') return [];
    const keys=['ANCHOR_RADIUS','BONE_PROX_ORIGIN','R_PROX_ANGLES','CLINICAL_OFFSET','CLINICAL_ANGLES','PHASE1_DAY0_STRUTS'];
    const differences=[];
    for(const key of keys){
      const a=derived[key],b=mirror[key];
      if(Array.isArray(a)&&Array.isArray(b)){
        const delta=a.length===b.length?Math.max(0,...a.map((v,i)=>Math.abs(v-Number(b[i])))):Infinity;
        if(!Number.isFinite(delta)||delta>1e-8) differences.push({key,maxAbsDifference:delta});
      }else if(Number.isFinite(a)&&Number.isFinite(Number(b))){
        const delta=Math.abs(a-Number(b));
        if(delta>1e-8) differences.push({key,maxAbsDifference:delta});
      }else if(b!==undefined){
        differences.push({key,maxAbsDifference:null,reason:'shape-or-value-mismatch'});
      }
    }
    return differences;
  }

  function deriveRecoveryContextFromCase(caseData,options={}){
    if(!root.HexapodMechanics) throw new Error('mechanics.js must load before mechanics_recovery.js');
    if(!caseData||typeof caseData!=='object') throw new TypeError('CASE object is required');
    const p=deriveLegacySimulationParameters(caseData);
    const parameterMirrorDifferences=compareParameterMirror(p,caseData.parameters);

    const anchorRadius=Number(p.ANCHOR_RADIUS);
    if(!Number.isFinite(anchorRadius)||anchorRadius<=0) throw new Error('CASE.parameters.ANCHOR_RADIUS is invalid');
    const origin=finiteVector(p.BONE_PROX_ORIGIN,3,'CASE.parameters.BONE_PROX_ORIGIN');
    const proxAngles=finiteVector(p.R_PROX_ANGLES,3,'CASE.parameters.R_PROX_ANGLES');
    const offset=finiteVector(p.CLINICAL_OFFSET,3,'CASE.parameters.CLINICAL_OFFSET');
    const deformityAngles=finiteVector(p.CLINICAL_ANGLES,3,'CASE.parameters.CLINICAL_ANGLES');
    const phase1Day0Struts=finiteVector(p.PHASE1_DAY0_STRUTS,6,'CASE.frame.initial_strut_lengths');

    const hardware=options.hardware||root.DEFAULT_SIMULATION_HARDWARE;
    const geometry=options.geometry||root.buildSimulationAttachmentPoints(anchorRadius,hardware);
    if(!geometry||!Array.isArray(geometry.ptsPAbs)||!Array.isArray(geometry.ptsDLocal)) throw new Error('Simulation attachment geometry is unavailable');

    const d0Fk=root.HexapodMechanics.solvePlatformPoseFromStrutLengths(phase1Day0Struts,{
      anchorRadius,hardware,geometry,
      initialPose:options.initialPose||[0,0,-145,0,0,0],
      bounds:options.bounds,
      scales:options.scales,
      maxIterations:options.maxIterations||240,
      tolerance:options.tolerance===undefined?1e-12:options.tolerance,
      lengthTolerance:options.lengthTolerance===undefined?1e-10:options.lengthTolerance
    });
    if(!d0Fk.success) throw new Error('Phase 1 Day 0 FK did not converge: '+d0Fk.reason);

    const T_D0=d0Fk.transform;
    const R_D0=[[T_D0[0][0],T_D0[0][1],T_D0[0][2]],[T_D0[1][0],T_D0[1][1],T_D0[1][2]],[T_D0[2][0],T_D0[2][1],T_D0[2][2]]];
    const R_D0_T=transpose3(R_D0);
    const t_D0=[T_D0[0][3],T_D0[1][3],T_D0[2][3]];

    const R_prox=rotationZXYDegrees(proxAngles);
    const R_deformity=rotationZXYDegrees(deformityAngles);
    const boneDeformedPos=origin.map((v,i)=>v+R_prox[i].reduce((sum,a,j)=>sum+a*offset[j],0));
    const localBoneDistPos=R_D0_T.map((row,i)=>row.reduce((sum,a,j)=>sum+a*(boneDeformedPos[j]-t_D0[j]),0));
    const localBoneDistRot=multiply3(R_D0_T,multiply3(R_prox,R_deformity));

    const distalBoneDay0Rotation=multiply3(R_D0,localBoneDistRot);
    const distalBoneDay0Position=t_D0.map((v,i)=>v+R_D0[i].reduce((sum,a,j)=>sum+a*localBoneDistPos[j],0));
    const T_db_ring_d0=rigidFromRotationTranslation(distalBoneDay0Rotation,distalBoneDay0Position);
    const boneToRingAnchor=multiply4(inverseRigid(T_D0),T_db_ring_d0);

    const T_bone_to_ring=rigidFromRotationTranslation(R_prox,origin);
    const ringToBone=inverseRigid(T_bone_to_ring);

    const stage=caseData.treatment?.stages?.find(s=>s.id===caseData.treatment?.selected_stage_id)||null;
    return {
      status:'ok',
      caseId:caseData.metadata?.case_id||caseData.metadata?.id||null,
      selectedStageId:stage?.id||null,
      selectedStageName:stage?.name||null,
      anchorRadius,hardware,geometry,
      phase1Day0StrutLengths:phase1Day0Struts,
      initialPose:d0Fk.pose,
      day0Fk:d0Fk,
      T_dr_ring_day0:T_D0,
      T_db_ring_day0:T_db_ring_d0,
      boneToRingAnchor,
      ringToBone,
      source:{
        proximalMounting:'CASE.mounting direction/value fields mapped by existing Python CaseBuilder rules',
        phase1Baseline:'CASE.frame.initial_strut_lengths',
        deformityCompatibility:'CASE.deformity direction/value fields mapped by existing Python CaseBuilder rules',
        selectedStage:'CASE.treatment.selected_stage_id (metadata only; does not redefine physical Phase 1 baseline)'
      },
      compatibility:{
        convention:'Reproduces simulation_ui.py CaseBuilder.build_parameters_from_case() and simulation.py build_day0_geometry()/build_day_transforms()',
        clinicalAnglesAreGeometricMeasurements:false,
        legacyZXYMechanicalInput:true,
        legacyParameterWarning:'CASE deformity fields are mapped into the legacy CLINICAL_ANGLES ZXY mechanical input only for Python migration parity. These are not reconstructed geometric clinical angle measurements.',
        parameterMirrorDifferences
      }
    };
  }

  function recoverWithContext(context,strutLengths,options={}){
    if(!context||context.status!=='ok') throw new TypeError('A valid CASE-derived recovery context is required');
    const result=root.HexapodRecovery
      ? root.HexapodRecovery.solveDistalBonePoseFromStrutLengths(strutLengths,{
          anchorRadius:context.anchorRadius,hardware:context.hardware,geometry:context.geometry,
          initialPose:options.initialPose||context.initialPose,
          boneToRingAnchor:context.boneToRingAnchor,ringToBone:context.ringToBone,
          bounds:options.bounds,scales:options.scales,maxIterations:options.maxIterations,
          tolerance:options.tolerance,lengthTolerance:options.lengthTolerance
        })
      : solveWithLocalAdapter(context,strutLengths,options);
    return {...result,recoveryContext:context};
  }

  function recoverFromCaseStruts(caseData,strutLengths,options={}){
    const context=deriveRecoveryContextFromCase(caseData,options);
    return recoverWithContext(context,strutLengths,options);
  }

  function solveWithLocalAdapter(context,strutLengths,options){
    const fk=root.HexapodMechanics.solvePlatformPoseFromStrutLengths(strutLengths,{
      anchorRadius:context.anchorRadius,hardware:context.hardware,geometry:context.geometry,
      initialPose:options.initialPose||context.initialPose,bounds:options.bounds,scales:options.scales,
      maxIterations:options.maxIterations,tolerance:options.tolerance,lengthTolerance:options.lengthTolerance
    });
    const T_dr_ring=fk.transform,T_db_ring=multiply4(T_dr_ring,context.boneToRingAnchor);
    const T_dr_bone=multiply4(context.ringToBone,T_dr_ring),T_db_bone=multiply4(context.ringToBone,T_db_ring);
    return {status:fk.success?'ok':'failed',T_dr_ring,T_db_ring,T_dr_bone,T_db_bone,fk};
  }

  // R1150: cache only the immutable physical baseline. Selected-stage metadata
  // is deliberately excluded because changing treatment stage does not change
  // the Phase 1 Day 0 mechanical reference.
  let cachedContextKey=null;
  let cachedContext=null;
  let cachedWarmStart=null;

  function physicalContextKey(caseData){
    if(!caseData||typeof caseData!=='object') throw new TypeError('CASE object is required');
    const physical={
      // CASE identity is part of the cache lifecycle. A newly selected CASE
      // must not inherit another CASE's context or sequential FK warm-start,
      // even when all physical values happen to be identical.
      caseIdentity:caseData.metadata?.case_id||caseData.metadata?.id||null,
      frame:{
        hardware:caseData.frame?.hardware,
        proximal_ring_diameter:caseData.frame?.proximal_ring_diameter,
        initial_strut_lengths:caseData.frame?.initial_strut_lengths
      },
      mounting:caseData.mounting,
      deformity:caseData.deformity
    };
    return JSON.stringify(physical);
  }

  function getRecoveryContext(caseData,options={}){
    const key=physicalContextKey(caseData);
    if(!cachedContext || cachedContextKey!==key){
      cachedContext=deriveRecoveryContextFromCase(caseData,options);
      cachedContextKey=key;
      cachedWarmStart=cachedContext.initialPose.slice();
    } else {
      const stage=caseData.treatment?.stages?.find(
        x=>x.id===caseData.treatment?.selected_stage_id
      )||null;
      cachedContext={
        ...cachedContext,
        caseId:caseData.metadata?.case_id||caseData.metadata?.id||cachedContext.caseId||null,
        selectedStageId:stage?.id||null,
        selectedStageName:stage?.name||null
      };
    }
    return cachedContext;
  }

  function recoverWithCaseCache(caseData,strutLengths,options={}){
    const context=getRecoveryContext(caseData,options);
    const initialPose=options.initialPose
      ? options.initialPose.slice()
      : (options.useWarmStart===false
          ? context.initialPose.slice()
          : (cachedWarmStart||context.initialPose).slice());
    const result=recoverWithContext(context,strutLengths,{...options,initialPose});
    if(result.status==='ok' && result.fk?.pose && options.updateWarmStart!==false){
      cachedWarmStart=result.fk.pose.slice();
    }
    return {
      status:result.status,
      T_bone:result.T_db_bone,
      T_dr_ring:result.T_dr_ring,
      T_db_ring:result.T_db_ring,
      T_dr_bone:result.T_dr_bone,
      T_db_bone:result.T_db_bone,
      fk:result.fk,
      recoveryContext:context
    };
  }

  // Separate browser path with the same matrix-only result as the legacy
  // Python bridge's data.result.T_bone. It is intentionally NOT wired into
  // shared.js recoverPoseFromStruts() in this milestone.
  function recoverPoseFromStrutsBrowserDetailed(struts,options={}){
    const caseData=options.caseData||root.currentCase;
    if(!Array.isArray(struts)||struts.length!==6||struts.some(v=>!Number.isFinite(Number(v)))){
      throw new TypeError('Browser FK recovery requires exactly six finite strut lengths');
    }
    if(!caseData) throw new Error('Browser FK recovery requires window.currentCase or options.caseData');
    return recoverWithCaseCache(caseData,struts.map(Number),options);
  }

  function recoverPoseFromStrutsBrowser(struts,options={}){
    const result=recoverPoseFromStrutsBrowserDetailed(struts,options);
    if(result.status!=='ok') throw new Error('Browser FK recovery failed: '+(result.fk?.reason||'unknown solver failure'));
    return result.T_bone;
  }

  function resetRecoveryCache(){
    cachedContextKey=null;
    cachedContext=null;
    cachedWarmStart=null;
  }

  function getRecoveryCacheInfo(){
    return {
      hasContext:!!cachedContext,
      hasWarmStart:!!cachedWarmStart,
      caseId:cachedContext?.caseId||null,
      selectedStageId:cachedContext?.selectedStageId||null
    };
  }

  root.HexapodCaseRecovery={
    deriveLegacySimulationParameters,
    deriveRecoveryContextFromCase,
    recoverWithContext,
    recoverFromCaseStruts,
    getRecoveryContext,
    recoverWithCaseCache,
    recoverPoseFromStrutsBrowserDetailed,
    recoverPoseFromStrutsBrowser,
    resetRecoveryCache,
    getRecoveryCacheInfo
  };
  if(typeof module!=='undefined'&&module.exports) module.exports=root.HexapodCaseRecovery;
})(typeof window!=='undefined'?window:globalThis);
