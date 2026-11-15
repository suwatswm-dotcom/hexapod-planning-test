/*
 * R1163 — Browser planner integer-candidate evaluation
 *
 * Ports the active Python CorrectionPlanner path:
 *   generate_rounding_candidates()
 *   evaluate_candidates()
 *   simple_search()
 *
 * This module deliberately receives FK recovery as a dependency. In the
 * browser application, pass HexapodCaseRecovery.recoverPoseFromStrutsBrowser
 * (or a compatible adapter). No Python/Flask calls are made here.
 *
 * Compatibility note: score = translation error in mm + rotation error in
 * degrees, exactly as the current Python implementation. This mixed-unit
 * legacy objective is preserved for migration parity, not endorsed as a
 * final clinical weighting model.
 */
(function(root){
  'use strict';

  function finiteVector(values,length,label){
    if(!Array.isArray(values)||values.length!==length||values.some(v=>!Number.isFinite(Number(v)))){
      throw new TypeError(label+' must contain '+length+' finite numbers');
    }
    return values.map(Number);
  }

  function finiteMatrix4(T,label){
    if(!Array.isArray(T)||T.length!==4||T.some(r=>!Array.isArray(r)||r.length!==4||r.some(v=>!Number.isFinite(Number(v))))){
      throw new TypeError(label+' must be a finite 4x4 matrix');
    }
    return T.map(r=>r.map(Number));
  }

  // NumPy np.round uses round-half-to-even. Math.round does not.
  function roundHalfToEven(value){
    if(!Number.isFinite(value)) throw new TypeError('Cannot round a non-finite value');
    const sign=value<0?-1:1;
    const a=Math.abs(value);
    const lo=Math.floor(a);
    const fraction=a-lo;
    let rounded;
    if(fraction<0.5) rounded=lo;
    else if(fraction>0.5) rounded=lo+1;
    else rounded=(lo%2===0)?lo:lo+1;
    const result=sign*rounded;
    return Object.is(result,-0)?0:result;
  }

  function generateRoundingCandidates(idealStruts){
    const v=finiteVector(idealStruts,6,'ideal strut lengths');
    return [
      {name:'Round',prescription:v.map(roundHalfToEven)},
      {name:'Floor',prescription:v.map(Math.floor)},
      {name:'Ceil',prescription:v.map(Math.ceil)}
    ];
  }

  function rotationErrorDegrees(recoveredPose,clinicalPose){
    // Relative rotation is R_recovered^T * R_clinical.
    let trace=0;
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++) trace+=recoveredPose[j][i]*clinicalPose[j][i];
    }
    const cosine=Math.max(-1,Math.min(1,(trace-1)*0.5));
    return Math.acos(cosine)*180/Math.PI;
  }

  function evaluateCandidates(candidates,clinicalPose,recoverPose,dayState){
    if(!Array.isArray(candidates)||candidates.length===0){
      throw new TypeError('At least one strut candidate is required');
    }
    if(typeof recoverPose!=='function') throw new TypeError('recoverPose callback is required');
    const target=finiteMatrix4(clinicalPose,'clinical pose');
    let best=null;
    let bestScore=Infinity;
    const evaluated=[];

    for(const item of candidates){
      if(!item||typeof item.name!=='string') throw new TypeError('Each candidate requires a name');
      const prescription=finiteVector(item.prescription,6,'candidate prescription');
      const recoveredValue=recoverPose(prescription.slice());
      const recoveredPose=finiteMatrix4(
        recoveredValue?.T_db_bone||recoveredValue?.T_bone||recoveredValue,
        'recovered bone pose'
      );
      const translationError=[0,1,2].map(i=>recoveredPose[i][3]-target[i][3]);
      const translationMagnitude=Math.hypot(...translationError);
      const rotationError=rotationErrorDegrees(recoveredPose,target);
      const score=translationMagnitude+rotationError;
      const result={
        name:item.name,
        prescription:prescription.slice(),
        recoveredPose,
        translationError,
        translationMagnitude,
        rotationErrorDegrees:rotationError,
        score
      };
      evaluated.push(result);
      // Strict less-than preserves Python's first-candidate tie behaviour.
      if(score<bestScore){
        bestScore=score;
        best=result;
      }
    }

    if(dayState&&typeof dayState==='object'){
      dayState.prescription=best.prescription.slice();
      dayState.recovered_pose=best.recoveredPose.map(r=>r.slice());
    }

    return {...best,evaluatedCandidates:evaluated};
  }

  function simpleSearch(idealStruts,clinicalPose,recoverPose,dayState){
    return evaluateCandidates(
      generateRoundingCandidates(idealStruts),
      clinicalPose,
      recoverPose,
      dayState
    );
  }

  root.HexapodPlannerCandidates={
    roundHalfToEven,
    generateRoundingCandidates,
    rotationErrorDegrees,
    evaluateCandidates,
    simpleSearch
  };
  if(typeof module!=='undefined'&&module.exports) module.exports=root.HexapodPlannerCandidates;
})(typeof window!=='undefined'?window:globalThis);
