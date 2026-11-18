/*
 * R1168 — CASE-to-mechanics browser phase executor
 *
 * Connects the established CASE recovery bridge (R1160), browser FK/IK
 * mechanics (R1163), fixed-setting trajectory planner (R1166), and phase
 * orchestration (R1167).
 *
 * No Python/Flask calculation calls. No DOM access. No reconstruction,
 * candidate-search, LOC, or Treatment UI changes.
 *
 * Required load order:
 *   shared.js
 *   R1160_hardware_spec.js
 *   R1163_mechanics.js
 *   R1160_mechanics_recovery.js
 *   R1163_planner_candidates.js
 *   R1166_planner_trajectory.js
 *   R1167_treatment_orchestration.js
 *   R1168_case_phase_executor.js
 */
(function(root){
  'use strict';

  const POSITIVE_DIRECTIONS = Object.freeze({
    ap_translation:'medial', lat_translation:'anterior', bone_length:'short',
    bone_rotation:'external', lat_angulation:'posterior', ap_angulation:'valgus'
  });
  const OPPOSITES = Object.freeze({
    medial:'lateral', lateral:'medial', anterior:'posterior', posterior:'anterior',
    short:'long', long:'short', external:'internal', internal:'external',
    valgus:'varus', varus:'valgus'
  });

  function fail(message){ throw new Error(message); }
  function finiteVector(value,n,label){
    if(!Array.isArray(value)||value.length!==n||value.some(v=>!Number.isFinite(Number(v))))
      throw new TypeError(label+' must contain '+n+' finite numbers');
    return value.map(Number);
  }
  function clone(value){
    if(typeof structuredClone==='function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }
  function signedField(field,positiveDirection,label){
    if(!field||!Number.isFinite(Number(field.value))||typeof field.direction!=='string')
      throw new TypeError(label+' must contain a numeric value and direction');
    return field.direction===positiveDirection?Number(field.value):-Number(field.value);
  }
  function matrix4FromRT(R,t){
    return [
      [R[0][0],R[0][1],R[0][2],t[0]],
      [R[1][0],R[1][1],R[1][2],t[1]],
      [R[2][0],R[2][1],R[2][2],t[2]],
      [0,0,0,1]
    ];
  }
  function multiply3(A,B){
    const C=Array.from({length:3},()=>[0,0,0]);
    for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++)C[i][j]+=A[i][k]*B[k][j];
    return C;
  }
  function rotationZXYDegrees(values){
    const [zDeg,xDeg,yDeg]=finiteVector(values,3,'ZXY angles');
    const z=zDeg*Math.PI/180,x=xDeg*Math.PI/180,y=yDeg*Math.PI/180;
    const cz=Math.cos(z),sz=Math.sin(z),cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y);
    const Rz=[[cz,-sz,0],[sz,cz,0],[0,0,1]];
    const Rx=[[1,0,0],[0,cx,-sx],[0,sx,cx]];
    const Ry=[[cy,0,sy],[0,1,0],[-sy,0,cy]];
    return multiply3(multiply3(Rz,Rx),Ry);
  }
  function buildClinicalPose(translation,angles){
    return matrix4FromRT(rotationZXYDegrees(angles),finiteVector(translation,3,'clinical translation'));
  }
  function eulerZXYDegrees(R){
    // Intrinsic uppercase ZXY, matching scipy Rotation.as_euler('ZXY').
    const sx=Math.max(-1,Math.min(1,R[2][1]));
    const x=Math.asin(sx), cx=Math.cos(x);
    let z,y;
    if(Math.abs(cx)>1e-10){
      z=Math.atan2(-R[0][1],R[1][1]);
      y=Math.atan2(-R[2][0],R[2][2]);
    }else{
      // Gimbal-lock convention: third angle is set to zero.
      z=Math.atan2(R[1][0],R[0][0]);
      y=0;
    }
    return [z,x,y].map(v=>v*180/Math.PI);
  }
  function clinicalMetricsFromPose(T){
    const t=[T[0][3],T[1][3],T[2][3]];
    const a=eulerZXYDegrees(T.slice(0,3).map(r=>r.slice(0,3)));
    return {
      ap_translation:t[0],lat_translation:t[1],bone_length:t[2],
      bone_rotation:a[0],lat_angulation:a[1],ap_angulation:a[2]
    };
  }
  function clinicalDirectionsFromPose(T){
    const values=clinicalMetricsFromPose(T),out={};
    for(const [key,positive] of Object.entries(POSITIVE_DIRECTIONS)){
      const v=values[key];
      out[key]=Math.abs(v)<=1e-12?'':(v>0?positive:OPPOSITES[positive]);
    }
    return out;
  }

  function buildTreatmentPrescription(caseData){
    const merged=[];
    const stages=caseData.treatment?.stages||[];
    stages.forEach((stage,index)=>{
      const rows=stage?.prescription?.strut_array;
      if(!Array.isArray(rows)||rows.length===0)return;
      rows.forEach((row,rowIndex)=>{
        if(index>0&&rowIndex===0)return;
        merged.push(finiteVector(row,6,'Stored phase prescription row'));
      });
    });
    return merged;
  }

  function buildParametersFromCase(caseData,options={}){
    if(!caseData||typeof caseData!=='object')throw new TypeError('CASE object is required');
    if(!root.HexapodCaseRecovery||typeof root.HexapodCaseRecovery.deriveLegacySimulationParameters!=='function')
      fail('Load R1160 mechanics recovery and hardware specification before the R1168 executor.');
    const params=root.HexapodCaseRecovery.deriveLegacySimulationParameters(caseData);
    const stage=caseData.treatment?.stages?.find(s=>s.id===caseData.treatment.selected_stage_id)||null;
    const target=stage?.target||null;
    if(target){
      params.TARGET_OFFSET=[
        signedField(target.ap_translation,'medial','target.ap_translation'),
        signedField(target.lat_translation,'anterior','target.lat_translation'),
        signedField(target.bone_length,'short','target.bone_length')
      ];
      params.TARGET_ANGLES=[
        signedField(target.bone_rotation,'external','target.bone_rotation'),
        signedField(target.lat_angulation,'posterior','target.lat_angulation'),
        signedField(target.ap_angulation,'valgus','target.ap_angulation')
      ];
    }
    const plannerMode=caseData.metadata?.planner||'normal';
    if(plannerMode==='verification'){
      if(!Array.isArray(options.verificationStrutArray)||!options.verificationStrutArray.length)
        fail('Verification planner mode requires options.verificationStrutArray.');
      params.PRESCRIPTION_VERIFICATION=true;
      params.VERIFICATION_STRUT_ARRAY=options.verificationStrutArray.map((r,i)=>finiteVector(r,6,'Verification strut row '+i));
      // Python simulation.py replaces PHASE1_DAY0_STRUTS with verification row 0.
      params.PHASE1_DAY0_STRUTS=params.VERIFICATION_STRUT_ARRAY[0].slice();
    }else{
      const treatmentRows=buildTreatmentPrescription(caseData);
      if(treatmentRows.length)params.STRUT_ARRAY_OVERRIDE=treatmentRows;
      else if(Array.isArray(caseData.prescription)&&caseData.prescription.length)
        params.STRUT_ARRAY_OVERRIDE=caseData.prescription.map((r,i)=>finiteVector(r,6,'CASE prescription row '+i));
      else if(options.currentPrescription!=null)
        params.STRUT_ARRAY_OVERRIDE=clone(options.currentPrescription);
    }
    return params;
  }

  function requireDependencies(){
    if(!root.HexapodCaseRecovery||typeof root.HexapodCaseRecovery.deriveRecoveryContextFromCase!=='function'||typeof root.HexapodCaseRecovery.recoverWithContext!=='function')
      fail('R1160 HexapodCaseRecovery is unavailable.');
    if(!root.HexapodMechanics||typeof root.HexapodMechanics.calculateStrutLengthsFromPose!=='function'||typeof root.HexapodMechanics.solvePlatformPoseFromStrutLengths!=='function')
      fail('R1163 HexapodMechanics is unavailable.');
    if(!root.HexapodPlannerTrajectory||typeof root.HexapodPlannerTrajectory.createPlanner!=='function')
      fail('R1166 HexapodPlannerTrajectory is unavailable.');
    if(!root.HexapodPlannerCandidates||typeof root.HexapodPlannerCandidates.simpleSearch!=='function')
      fail('R1163 HexapodPlannerCandidates is unavailable.');
    if(root.HexapodPlannerTrajectory?.PLANNER_CONFIG?.MODE==='STRICT_JS'&&
       typeof root.HexapodPlannerCandidates.strictSearch!=='function')
      fail('R1172.9.3 STRICT_JS requires the 64-combination primary candidate search.');
    if(root.HexapodPlannerTrajectory?.PLANNER_CONFIG?.MODE==='STRICT_JS'&&
       root.HexapodPlannerTrajectory?.PLANNER_CONFIG?.EXPANDED_SEARCH_ENABLED!==false&&
       typeof root.HexapodPlannerCandidates.expandedSearch!=='function')
      fail('R1172.9.3 STRICT_JS expanded-neighborhood fallback is unavailable.');
    if(!root.HexapodTreatmentOrchestration||typeof root.HexapodTreatmentOrchestration.runTreatmentPlanner!=='function')
      fail('R1167 HexapodTreatmentOrchestration is unavailable.');
  }

  function createRecoveryFunctions(context,options={}){
    let maxFkRms=0, fkCalls=0;
    const recoverPoseFromStruts=(struts)=>{
      fkCalls++;
      const recovered=root.HexapodCaseRecovery.recoverWithContext(context,struts,{
        initialPose:context.initialPose,
        maxIterations:options.fkMaxIterations||240,
        tolerance:options.fkTolerance===undefined?1e-12:options.fkTolerance,
        lengthTolerance:options.fkLengthTolerance===undefined?1e-10:options.fkLengthTolerance
      });
      if(recovered.status!=='ok')throw new Error('Browser FK recovery failed: '+(recovered.fk?.reason||'unknown solver failure'));
      if(Number.isFinite(recovered.fk?.residualRms))maxFkRms=Math.max(maxFkRms,recovered.fk.residualRms);
      return recovered.T_db_bone||recovered.T_bone;
    };
    const calculateStrutLengths=(Tdr)=>{
      const rv=root.HexapodPlannerTrajectory.rotationVectorFromMatrix(Tdr.slice(0,3).map(r=>r.slice(0,3)));
      const pose=[Tdr[0][3],Tdr[1][3],Tdr[2][3],...rv];
      return root.HexapodMechanics.calculateStrutLengthsFromPose(pose,context.geometry);
    };
    return {
      recoverPoseFromStruts,calculateStrutLengths,
      getDiagnostics:()=>({fkCalls,maxFkRms})
    };
  }

  function runPhase(context,recoveryContext,options={}){
    const params=buildParametersFromCase(context.caseData,options);
    const startPose=context.startState?.pose
      ? clone(context.startState.pose)
      : buildClinicalPose(params.CLINICAL_OFFSET,params.CLINICAL_ANGLES);
    const targetPose=(params.TARGET_OFFSET&&params.TARGET_ANGLES)
      ? buildClinicalPose(params.TARGET_OFFSET,params.TARGET_ANGLES)
      : buildClinicalPose([0,0,-12],[0,0,0]);
    const initialStruts=context.startState
      ? finiteVector(context.startState.strutLengths,6,'Phase handoff struts')
      : finiteVector(params.PHASE1_DAY0_STRUTS,6,'Phase 1 Day-0 struts');
    const callbacks=createRecoveryFunctions(recoveryContext,options);
    const planner=root.HexapodPlannerTrajectory.createPlanner({
      startPose,targetPose,
      boneToRingAnchor:recoveryContext.boneToRingAnchor,
      ringToBone:recoveryContext.ringToBone,
      initialStruts,
      preserveInitialStruts:!!context.startState,
      calculateStrutLengths:callbacks.calculateStrutLengths,
      recoverPoseFromStruts:callbacks.recoverPoseFromStruts,
      candidateSearch:root.HexapodPlannerCandidates.simpleSearch
    });
    planner.run();
    const result=planner.getResult();
    const poses=result.daily_poses;
    if(!Array.isArray(poses)||poses.length===0)fail('R1166 planner returned no daily poses.');
    const struts=result.strut_array;
    if(!Array.isArray(struts)||struts.length!==poses.length)fail('R1166 planner returned inconsistent pose and strut row counts.');
    if(context.startState){
      const expected=initialStruts;
      const actual=struts[0];
      if(actual.some((v,i)=>v!==expected[i]))fail('Exact predecessor Day-0 strut handoff was not preserved.');
    }
    return {
      phase_id:context.stage.id,phase_name:context.stage.name,
      start_state_source:context.activeReplan?'active-replan':(context.startState?.source||'clinical-default'),
      start_state_overlap:context.startState?.overlap===true,
      start_state_overlap_row_index:context.startState?.overlapRowIndex??null,
      start_pose:clone(startPose),target_pose:clone(targetPose),
      strut_array:struts,daily_poses:poses,daily_ring_poses:result.daily_ring_poses,
      days_needed:result.days_needed,recovered_final_pose:clone(poses[poses.length-1]),
      clinical_metrics:poses.map(clinicalMetricsFromPose),
      clinical_directions:poses.map(clinicalDirectionsFromPose),
      status:result.status,complete:result.complete,
      schedule_generated:result.schedule_generated===true,
      clinical_target_reached:result.clinical_target_reached===true,
      planner_mode:result.planner_mode,
      candidate_search_strategy:result.candidate_search_strategy,
      candidate_selection_strategy:result.candidate_selection_strategy,
      initially_complete_dimensions:result.initially_complete_dimensions,
      completed_dimensions:result.completed_dimensions,
      planner_configuration:result.planner_configuration,
      performance:result.performance,
      termination_reason:result.termination_reason,termination_message:result.termination_message,
      completion:result.completion,day_reports:result.day_reports,
      estimated_days:result.estimated_days,
      _r1168_diagnostics:callbacks.getDiagnostics()
    };
  }

  async function runTreatment(caseData,options={}){
    requireDependencies();
    if(!caseData||typeof caseData!=='object')throw new TypeError('CASE object is required');
    // The physical context is derived from the Phase-1 Day-0 frame baseline,
    // not from the currently selected phase prescription.
    let recoveryCase=caseData;
    if(caseData.metadata?.planner==='verification'){
      if(!Array.isArray(options.verificationStrutArray)||options.verificationStrutArray.length===0)
        fail('Verification planner mode requires options.verificationStrutArray.');
      recoveryCase={...caseData,frame:{...caseData.frame,initial_strut_lengths:finiteVector(options.verificationStrutArray[0],6,'Verification Day-0 struts')}};
    }
    const recoveryContext=root.HexapodCaseRecovery.deriveRecoveryContextFromCase(
      recoveryCase,
      {hardware:options.hardware,geometry:options.geometry,initialPose:options.initialPose,
       maxIterations:options.fkMaxIterations||240,tolerance:options.fkTolerance===undefined?1e-12:options.fkTolerance,
       lengthTolerance:options.fkLengthTolerance===undefined?1e-10:options.fkLengthTolerance}
    );
    const overlapRecover=(struts)=>{
      const recovered=root.HexapodCaseRecovery.recoverWithContext(recoveryContext,struts,{
        initialPose:recoveryContext.initialPose,
        maxIterations:options.fkMaxIterations||240,
        tolerance:options.fkTolerance===undefined?1e-12:options.fkTolerance,
        lengthTolerance:options.fkLengthTolerance===undefined?1e-10:options.fkLengthTolerance
      });
      if(recovered.status!=='ok')throw new Error('Overlap handoff FK failed: '+(recovered.fk?.reason||'unknown solver failure'));
      return recovered.T_db_bone||recovered.T_bone;
    };
    const orchestration=await root.HexapodTreatmentOrchestration.runTreatmentPlanner({
      caseData,
      phaseId:options.phaseId==null?null:options.phaseId,
      recoverPoseFromStruts:overlapRecover,
      runPhase:phaseContext=>runPhase(phaseContext,recoveryContext,options)
    });
    return {
      ...orchestration,
      recovery_context_summary:{
        anchorRadius:recoveryContext.anchorRadius,
        initialPose:clone(recoveryContext.initialPose),
        parameterMirrorDifferences:clone(recoveryContext.compatibility?.parameterMirrorDifferences||[])
      }
    };
  }

  const api={
    buildParametersFromCase,buildClinicalPose,rotationZXYDegrees,eulerZXYDegrees,
    clinicalMetricsFromPose,clinicalDirectionsFromPose,buildTreatmentPrescription,
    createRecoveryFunctions,runPhase,runTreatment
  };
  root.HexapodCasePhaseExecutor=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
