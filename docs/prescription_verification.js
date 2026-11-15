/* R1170.3 — Browser fixed-prescription verification shadow runner.
 * No correction planner, candidate search, network calls, or DOM access.
 * Requires shared.js, hardware_spec.js, planner_mechanics.js,
 * mechanics_recovery.js, and case_phase_executor.js.
 */
(function(root){
 'use strict';
 const FIXED_STRUT_ROWS = [[146,155,179,132,180,141],[146,156,180,133,180,142],[147,156,181,134,181,143],[148,157,181,135,182,144],[149,158,182,135,182,145],[149,159,183,136,183,146],[150,160,184,137,184,146],[151,160,185,138,184,147],[152,161,186,139,185,148],[152,162,187,140,186,149],[153,163,187,141,186,150],[154,164,188,142,187,151],[155,165,189,143,188,152],[155,165,190,144,188,153],[156,165,190,144,189,154],[156,164,191,145,190,154],[156,163,191,146,190,155],[156,162,191,147,191,155],[156,161,191,148,192,156],[157,160,192,149,192,156],[157,159,192,150,193,157],[157,159,192,151,193,157],[157,158,193,151,194,158],[157,157,193,152,195,159],[157,156,193,153,195,159],[158,155,193,154,196,160],[158,154,194,155,197,160],[158,153,194,156,197,161],[158,152,194,157,198,162],[159,152,194,157,199,162],[159,151,195,158,199,162],[159,150,195,159,200,163],[159,149,195,160,201,163],[159,148,196,161,201,164],[159,147,196,161,202,165],[159,146,196,162,203,165],[160,145,196,163,203,166],[160,144,197,164,204,166],[160,143,197,165,205,167],[160,143,197,165,205,167],[160,142,197,166,206,168],[160,141,198,167,207,168],[161,140,198,168,207,169],[161,139,198,169,208,169],[161,138,198,169,209,170],[161,137,199,170,209,171],[162,138,199,171,210,171],[163,139,200,172,211,172],[163,140,201,173,212,173],[164,141,202,174,213,174],[165,141,202,175,213,175],[166,142,203,176,214,176],[167,143,204,177,215,177],[167,144,205,178,216,178],[168,145,206,179,217,179],[169,146,206,180,217,180],[170,147,207,181,218,181],[171,148,208,182,219,182],[171,149,209,183,220,183],[172,149,209,183,221,184],[173,149,208,183,222,186],[173,150,208,183,223,187],[174,150,208,183,224,189],[175,150,208,183,225,190],[175,151,208,183,226,192],[176,151,208,183,227,193],[177,152,209,184,228,193],[178,153,210,185,229,194],[179,154,211,186,230,195],[180,154,212,187,231,196],[181,155,213,187,232,197],[183,156,214,188,234,198],[184,156,215,189,235,199],[185,157,216,190,236,200],[186,158,217,191,237,201],[187,159,218,191,238,202],[188,159,219,192,240,202],[189,160,220,193,241,203],[190,160,221,193,243,203],[192,161,222,194,244,204],[193,161,224,194,245,204],[194,162,225,195,247,205],[195,162,226,196,248,205],[196,163,227,196,250,206],[197,163,229,197,251,207]];
 const INITIAL_FK_STATE = Object.freeze([0,0,-145,0,0,0]);
 function fail(m){throw new Error(m);}
 function clone(v){return typeof structuredClone==='function'?structuredClone(v):JSON.parse(JSON.stringify(v));}
 function finiteVector(v,n,label){if(!Array.isArray(v)||v.length!==n||v.some(x=>!Number.isFinite(Number(x))))throw new TypeError(label+' must contain '+n+' finite numbers');return v.map(Number);}
 function multiply4(A,B){const C=Array.from({length:4},()=>[0,0,0,0]);for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)C[i][j]+=A[i][k]*B[k][j];return C;}
 function requireDependencies(){
  if(!root.HexapodCaseRecovery||typeof root.HexapodCaseRecovery.deriveRecoveryContextFromCase!=='function')fail('HexapodCaseRecovery / mechanics_recovery.js is unavailable.');
  if(!root.HexapodMechanics||typeof root.HexapodMechanics.solvePlatformPoseFromStrutLengths!=='function')fail('HexapodMechanics / planner_mechanics.js is unavailable.');
  if(!root.HexapodCasePhaseExecutor||typeof root.HexapodCasePhaseExecutor.clinicalMetricsFromPose!=='function')fail('HexapodCasePhaseExecutor is unavailable; load case_phase_executor.js first.');
  if(typeof root.buildSimulationAttachmentPoints!=='function')fail('shared.js buildSimulationAttachmentPoints() is unavailable.');
 }
 function run(caseData,options={}){
  requireDependencies();
  if(!caseData||typeof caseData!=='object')throw new TypeError('CASE object is required.');
  const rows=(options.strutRows||FIXED_STRUT_ROWS).map((r,i)=>finiteVector(r,6,'Verification strut row '+i));
  if(!rows.length)fail('Verification prescription is empty.');
  const initialPose=finiteVector(options.initialPose||INITIAL_FK_STATE,6,'Initial FK state');
  const verificationCase={...caseData,frame:{...(caseData.frame||{}),initial_strut_lengths:rows[0].slice()}};
  const context=root.HexapodCaseRecovery.deriveRecoveryContextFromCase(verificationCase,{
   hardware:options.hardware,geometry:options.geometry,initialPose,
   maxIterations:options.maxIterations||240,
   tolerance:options.tolerance===undefined?1e-12:options.tolerance,
   lengthTolerance:options.lengthTolerance===undefined?1e-10:options.lengthTolerance,
   bounds:options.bounds,scales:options.scales
  });
  let warmStart=initialPose.slice(),maxFkRms=0,maxFkResidual=0,totalIterations=0;
  const dailyRing=[],dailyBone=[],dailyRingToBone=[],dailyPoses=[],fkStates=[],solverDiagnostics=[];
  for(let day=0;day<rows.length;day++){
   const fk=root.HexapodMechanics.solvePlatformPoseFromStrutLengths(rows[day],{
    anchorRadius:context.anchorRadius,hardware:context.hardware,geometry:context.geometry,
    initialPose:warmStart,bounds:options.bounds,scales:options.scales,
    maxIterations:options.maxIterations||240,
    tolerance:options.tolerance===undefined?1e-12:options.tolerance,
    lengthTolerance:options.lengthTolerance===undefined?1e-10:options.lengthTolerance
   });
   if(!fk||!fk.success)fail('Verification FK failed on Day '+day+': '+(fk?.reason||'unknown solver failure'));
   const Tdr=fk.transform;
   const TdbRing=multiply4(Tdr,context.boneToRingAnchor);
   const TdrBone=multiply4(context.ringToBone,Tdr);
   const TdbBone=multiply4(context.ringToBone,TdbRing);
   dailyRing.push(clone(Tdr));dailyBone.push(clone(TdbBone));dailyRingToBone.push(clone(TdrBone));dailyPoses.push(clone(TdbBone));
   fkStates.push(fk.pose.slice());
   const rms=Number(fk.residualRms)||0,maxAbs=Number(fk.residualMaxAbs)||0;
   maxFkRms=Math.max(maxFkRms,rms);maxFkResidual=Math.max(maxFkResidual,maxAbs);totalIterations+=Number(fk.iterations)||0;
   solverDiagnostics.push({day,success:fk.success,reason:fk.reason,residualRms:rms,residualMaxAbs:maxAbs,iterations:fk.iterations,initialPose:warmStart.slice(),recoveredPose:fk.pose.slice()});
   warmStart=fk.pose.slice();
  }
  const phase=root.HexapodCasePhaseExecutor;
  const metrics=dailyPoses.map(T=>phase.clinicalMetricsFromPose(T));
  const directions=dailyPoses.map(T=>phase.clinicalDirectionsFromPose(T));
  const counts={strut_rows:rows.length,daily_pose_rows:dailyPoses.length,daily_ring_pose_rows:dailyRing.length,clinical_metric_rows:metrics.length,clinical_direction_rows:directions.length};
  const daysNeeded=rows.length-1;
  const prescriptionCheck={...counts,counts_match:Object.values(counts).every(v=>v===rows.length),six_struts_each_day:rows.every(r=>r.length===6),days_needed_check:daysNeeded===rows.length-1};
  return {
   mode:'prescription_verification',mode_label:'Prescription Verification',planner_mode:'verification',
   strut_array:rows,days_needed:daysNeeded,number_of_days:rows.length,
   daily_poses:dailyPoses,daily_ring_poses:dailyRing,daily_bone_poses:dailyBone,daily_ring_to_bone_poses:dailyRingToBone,
   clinical_metrics:metrics,clinical_directions:directions,recovered_final_pose:dailyPoses.length?clone(dailyPoses[dailyPoses.length-1]):null,
   prescription_check:prescriptionCheck,
   _r1170_1_diagnostics:{initial_fk_state:initialPose,final_fk_state:warmStart,max_fk_residual_rms:maxFkRms,max_fk_residual_abs:maxFkResidual,total_fk_iterations:totalIterations,solver_diagnostics:solverDiagnostics,recovery_context:{anchor_radius_mm:context.anchorRadius,phase1_day0_struts:context.phase1Day0StrutLengths,initial_context_pose:context.initialPose}}
  };
 }
 const api={version:'R1170.3',fixedStrutRows:()=>clone(FIXED_STRUT_ROWS),initialFkState:()=>INITIAL_FK_STATE.slice(),run};
 root.HexapodPrescriptionVerification=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
