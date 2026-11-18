/*
 * R1172.9.4 — Strict completion-driven planner with preview compatibility path
 *
 * This module retains both browser planner paths:
 *   PYTHON_COMPAT — legacy fixed-duration schedule generation using the
 *                   original Round/Floor/Ceil candidate search.
 *   STRICT_JS     — completion-driven planning with actual daily movement
 *                   limits, 64 floor/ceil combinations, and stagnation checks.
 *
 * PYTHON_COMPAT produces daily rows but does not enforce STRICT_JS daily
 * movement limits and does not guarantee clinical target attainment. Its
 * schedule_generated result is deliberately distinct from clinical completion.
 *
 * CASE is resolved by the caller into start/target transforms and mechanical
 * dependencies. This module does not read CASE, call Flask, or touch X-ray data.
 * Dependencies are injected:
 *   calculateStrutLengths(T_DR_PR) -> six ideal strut lengths
 *   recoverPoseFromStruts(lengths) -> T_DB_PB (4x4)
 *   candidateSearch(ideal, targetPose, recoverFn, dayState) -> R1163 result
 */
(function(root){
  'use strict';

  // R1172.9.4 — planner settings come from the central hidden app_config.js.
  // The fallback values keep this module independently testable in Node.
  const appPlannerConfig=root.APP_CONFIG?.planner||{};
  const PLANNER_CONFIG = Object.freeze({
    MODE: appPlannerConfig.mode || 'STRICT_JS',
    DAILY_TRANSLATION_LIMIT_MM: Number(appPlannerConfig.dailyMovementLimit?.translationMm ?? 1.0),
    DAILY_ROTATION_LIMIT_DEG: Number(appPlannerConfig.dailyMovementLimit?.rotationDeg ?? 1.0),
    COMPLETION_TRANSLATION_TOLERANCE_MM: Number(appPlannerConfig.completionTolerance?.translationMm ?? 1.0),
    COMPLETION_ROTATION_TOLERANCE_DEG: Number(appPlannerConfig.completionTolerance?.rotationDeg ?? 0.5),
    DAILY_LIMIT_NUMERICAL_TOLERANCE: Number(appPlannerConfig.numericalTolerance ?? 1e-6),
    PROGRESS_TRANSLATION_EPSILON_MM: Number(appPlannerConfig.progressEpsilon?.translationMm ?? 1e-8),
    PROGRESS_ROTATION_EPSILON_DEG: Number(appPlannerConfig.progressEpsilon?.rotationDeg ?? 1e-8),
    STAGNATION_WINDOW_DAYS: Number(appPlannerConfig.stagnation?.windowDays ?? 3),
    PRIMARY_SEARCH_STRATEGY: appPlannerConfig.candidateSearch?.primaryStrategy || 'FLOOR_CEIL_64',
    EXPANDED_SEARCH_ENABLED: appPlannerConfig.candidateSearch?.expandedFallbackEnabled !== false,
    EXPANDED_SEARCH_STRATEGY: appPlannerConfig.candidateSearch?.expandedFallbackStrategy || 'INTEGER_NEIGHBORHOOD_729',
    EXPANDED_SEARCH_RADIUS_MM: Number(appPlannerConfig.candidateSearch?.neighborhoodRadiusMm ?? 1)
  });

  function vector3(v,label){
    if(!Array.isArray(v)||v.length!==3||v.some(x=>!Number.isFinite(Number(x))))
      throw new TypeError(label+' must be a finite 3-vector');
    return v.map(Number);
  }
  function vector6(v,label){
    if(!Array.isArray(v)||v.length!==6||v.some(x=>!Number.isFinite(Number(x))))
      throw new TypeError(label+' must be a finite 6-vector');
    return v.map(Number);
  }
  function matrix4(T,label){
    if(!Array.isArray(T)||T.length!==4||T.some(r=>!Array.isArray(r)||r.length!==4||r.some(x=>!Number.isFinite(Number(x)))))
      throw new TypeError(label+' must be a finite 4x4 matrix');
    return T.map(r=>r.map(Number));
  }
  const identity4=()=>[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
  const identity3=()=>[[1,0,0],[0,1,0],[0,0,1]];
  function multiply4(A,B){
    const C=Array.from({length:4},()=>[0,0,0,0]);
    for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)C[i][j]+=A[i][k]*B[k][j];
    return C;
  }
  function inverse4(A){
    const M=A.map((r,i)=>r.slice().concat(identity4()[i]));
    for(let k=0;k<4;k++){
      let p=k;for(let i=k+1;i<4;i++)if(Math.abs(M[i][k])>Math.abs(M[p][k]))p=i;
      if(Math.abs(M[p][k])<1e-14)throw new Error('Transform matrix is singular');
      [M[k],M[p]]=[M[p],M[k]];
      const d=M[k][k];for(let j=0;j<8;j++)M[k][j]/=d;
      for(let i=0;i<4;i++)if(i!==k){const f=M[i][k];for(let j=0;j<8;j++)M[i][j]-=f*M[k][j];}
    }
    return M.map(r=>r.slice(4));
  }
  function transpose3(A){return A[0].map((_,j)=>A.map(r=>r[j]));}
  function multiply3(A,B){
    const C=Array.from({length:3},()=>[0,0,0]);
    for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++)C[i][j]+=A[i][k]*B[k][j];
    return C;
  }
  function rotationMatrixFromVector(w){
    const [x0,y0,z0]=vector3(w,'rotation vector');
    const theta=Math.hypot(x0,y0,z0);
    if(theta<1e-14)return identity3();
    const x=x0/theta,y=y0/theta,z=z0/theta,c=Math.cos(theta),s=Math.sin(theta),q=1-c;
    return [
      [c+x*x*q,x*y*q-z*s,x*z*q+y*s],
      [y*x*q+z*s,c+y*y*q,y*z*q-x*s],
      [z*x*q-y*s,z*y*q+x*s,c+z*z*q]
    ];
  }
  // Stable SO(3) logarithm via matrix-to-quaternion conversion.
  function rotationVectorFromMatrix(R){
    const tr=R[0][0]+R[1][1]+R[2][2];
    let w,x,y,z;
    if(tr>0){
      const s=Math.sqrt(tr+1)*2;w=0.25*s;x=(R[2][1]-R[1][2])/s;y=(R[0][2]-R[2][0])/s;z=(R[1][0]-R[0][1])/s;
    }else if(R[0][0]>R[1][1]&&R[0][0]>R[2][2]){
      const s=Math.sqrt(Math.max(0,1+R[0][0]-R[1][1]-R[2][2]))*2;
      w=(R[2][1]-R[1][2])/s;x=0.25*s;y=(R[0][1]+R[1][0])/s;z=(R[0][2]+R[2][0])/s;
    }else if(R[1][1]>R[2][2]){
      const s=Math.sqrt(Math.max(0,1+R[1][1]-R[0][0]-R[2][2]))*2;
      w=(R[0][2]-R[2][0])/s;x=(R[0][1]+R[1][0])/s;y=0.25*s;z=(R[1][2]+R[2][1])/s;
    }else{
      const s=Math.sqrt(Math.max(0,1+R[2][2]-R[0][0]-R[1][1]))*2;
      w=(R[1][0]-R[0][1])/s;x=(R[0][2]+R[2][0])/s;y=(R[1][2]+R[2][1])/s;z=0.25*s;
    }
    const qn=Math.hypot(w,x,y,z);w/=qn;x/=qn;y/=qn;z/=qn;
    // q and -q encode the same rotation; choose the principal angle <= pi.
    if(w<0){w=-w;x=-x;y=-y;z=-z;}
    const sn=Math.hypot(x,y,z);
    if(sn<1e-14)return [0,0,0];
    const angle=2*Math.atan2(sn,Math.max(0,w));
    const scale=angle/sn;
    return [x*scale,y*scale,z*scale];
  }
  function poseWithRotationAndTranslation(R,t){
    return [
      [R[0][0],R[0][1],R[0][2],t[0]],
      [R[1][0],R[1][1],R[1][2],t[1]],
      [R[2][0],R[2][1],R[2][2],t[2]],
      [0,0,0,1]
    ];
  }
  function clone4(T){return T.map(r=>r.slice());}
  function distance3(v){return Math.hypot(v[0],v[1],v[2]);}
  function subtract3(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
  function scale3(v,s){return [v[0]*s,v[1]*s,v[2]*s];}

  // R1172.9.3 — dynamic objective selection. A dimension becomes completed
  // as soon as it enters its configured tolerance and remains protected for
  // the rest of the phase. This avoids switching back to the legacy score after
  // a completed dimension experiences a temporary deviation.
  function chooseGoalAwareCandidate(feasible, policy){
    if(!Array.isArray(feasible)||!feasible.length)throw new Error('No feasible candidates to select');
    const p=policy||{};
    const eps=Number(p.progressEpsilon??1e-8);
    const translationTolerance=Number(p.translationTolerance??1.0);
    const rotationTolerance=Number(p.rotationTolerance??0.5);
    const limitTolerance=Number(p.limitTolerance??1e-6);
    const completedTranslation=!!(p.completedTranslation ?? p.initialTranslationComplete);
    const completedRotation=!!(p.completedRotation ?? p.initialRotationComplete);
    const scoreOf=x=>Number(x.item?.score??x.traceItem?.score??Infinity);
    const stableScoreSort=items=>items.slice().sort((a,b)=>scoreOf(a)-scoreOf(b));
    const bestProtectedSort=(items,field)=>items.slice().sort((a,b)=>{
      const delta=Number(a.traceItem[field])-Number(b.traceItem[field]);
      return Math.abs(delta)>1e-12?delta:scoreOf(a)-scoreOf(b);
    });

    if(completedRotation && !completedTranslation){
      const advancing=feasible.filter(x=>Number(x.traceItem.translationProgressMm)>eps);
      const preserving=feasible.filter(x=>Number(x.traceItem.finalTargetRotationResidualDeg)<=rotationTolerance+limitTolerance);
      const preservingAndAdvancing=preserving.filter(x=>Number(x.traceItem.translationProgressMm)>eps);
      if(preservingAndAdvancing.length){
        return {chosen:stableScoreSort(preservingAndAdvancing)[0],strategy:'dynamic_protect_rotation_advance_translation',progressFound:true,reason:'Rotation is a completed objective; selected a feasible candidate that preserves its tolerance while advancing translation.'};
      }
      if(advancing.length){
        return {chosen:bestProtectedSort(advancing,'finalTargetRotationResidualDeg')[0],strategy:'dynamic_rotation_recovery_deviation_minimized',progressFound:true,reason:'No progressing candidate preserves completed rotation tolerance; selected the translation-progress candidate with the smallest rotation residual.'};
      }
      if(preserving.length){
        return {chosen:stableScoreSort(preserving)[0],strategy:'dynamic_hold_completed_rotation',progressFound:false,reason:'No feasible candidate advances translation; selected a candidate preserving completed rotation.'};
      }
      return {chosen:bestProtectedSort(feasible,'finalTargetRotationResidualDeg')[0],strategy:'dynamic_rotation_recovery_fallback',progressFound:false,reason:'No candidate advances translation or preserves completed rotation; selected the feasible candidate with the smallest rotation residual.'};
    }

    if(completedTranslation && !completedRotation){
      const advancing=feasible.filter(x=>Number(x.traceItem.rotationProgressDeg)>eps);
      const preserving=feasible.filter(x=>Number(x.traceItem.finalTargetTranslationResidualMm)<=translationTolerance+limitTolerance);
      const preservingAndAdvancing=preserving.filter(x=>Number(x.traceItem.rotationProgressDeg)>eps);
      if(preservingAndAdvancing.length){
        return {chosen:stableScoreSort(preservingAndAdvancing)[0],strategy:'dynamic_protect_translation_advance_rotation',progressFound:true,reason:'Translation is a completed objective; selected a feasible candidate that preserves its tolerance while advancing rotation.'};
      }
      if(advancing.length){
        return {chosen:bestProtectedSort(advancing,'finalTargetTranslationResidualMm')[0],strategy:'dynamic_translation_recovery_deviation_minimized',progressFound:true,reason:'No progressing candidate preserves completed translation tolerance; selected the rotation-progress candidate with the smallest translation residual.'};
      }
      if(preserving.length){
        return {chosen:stableScoreSort(preserving)[0],strategy:'dynamic_hold_completed_translation',progressFound:false,reason:'No feasible candidate advances rotation; selected a candidate preserving completed translation.'};
      }
      return {chosen:bestProtectedSort(feasible,'finalTargetTranslationResidualMm')[0],strategy:'dynamic_translation_recovery_fallback',progressFound:false,reason:'No candidate advances rotation or preserves completed translation; selected the feasible candidate with the smallest translation residual.'};
    }

    if(completedTranslation && completedRotation){
      return {chosen:stableScoreSort(feasible)[0],strategy:'both_objectives_completed',progressFound:false,reason:'Both objectives were already completed; retained the lowest-score feasible candidate as a defensive fallback.'};
    }

    const hasProgress=feasible.some(x=>
      Number(x.traceItem.translationProgressMm)>eps || Number(x.traceItem.rotationProgressDeg)>eps
    );
    return {chosen:stableScoreSort(feasible)[0],strategy:'dynamic_multi_objective_score',progressFound:hasProgress,
      reason:hasProgress?'Neither objective is complete; retained the established mixed-unit score among feasible candidates making progress.':'The primary candidate pool has no feasible candidate making positive progress toward either incomplete objective.'};
  }

  // Protected dimensions use day-to-day recovery progress after a temporary
  // deviation. Other dimensions retain the established all-time-best rule.
  function nextProtectedStagnationCount(currentResidual,previousResidual,tolerance,epsilon,currentCount){
    if(currentResidual<=tolerance)return 0;
    if(currentResidual+epsilon<previousResidual)return 0;
    return Number(currentCount||0)+1;
  }

  function createPlanner(options){
    options=options||{};
    const startPose=matrix4(options.startPose,'startPose');
    const targetPose=matrix4(options.targetPose,'targetPose');
    // The daily limits are intentionally hardcoded in PLANNER_CONFIG for now.
    // Do not expose them as Treatment-page/user settings unless the clinical
    // specification changes.
    const transLimit=PLANNER_CONFIG.DAILY_TRANSLATION_LIMIT_MM;
    const rotLimit=PLANNER_CONFIG.DAILY_ROTATION_LIMIT_DEG;
    if(!Number.isFinite(transLimit)||transLimit<=0)throw new RangeError('transLimit must be finite and > 0');
    if(!Number.isFinite(rotLimit)||rotLimit<0)throw new RangeError('rotLimit must be finite and >= 0');
    const translationTolerance=PLANNER_CONFIG.COMPLETION_TRANSLATION_TOLERANCE_MM;
    const rotationTolerance=PLANNER_CONFIG.COMPLETION_ROTATION_TOLERANCE_DEG;
    const limitTolerance=PLANNER_CONFIG.DAILY_LIMIT_NUMERICAL_TOLERANCE;
    const progressTranslationEpsilon=PLANNER_CONFIG.PROGRESS_TRANSLATION_EPSILON_MM;
    const progressRotationEpsilon=PLANNER_CONFIG.PROGRESS_ROTATION_EPSILON_DEG;
    const stagnationWindow=PLANNER_CONFIG.STAGNATION_WINDOW_DAYS;
    if(!Number.isFinite(translationTolerance)||translationTolerance<0)throw new RangeError('translationToleranceMm must be finite and >= 0');
    if(!Number.isFinite(rotationTolerance)||rotationTolerance<0)throw new RangeError('rotationToleranceDegrees must be finite and >= 0');
    if(!Number.isFinite(limitTolerance)||limitTolerance<0)throw new RangeError('dailyLimitTolerance must be finite and >= 0');
    if(!Number.isFinite(progressTranslationEpsilon)||progressTranslationEpsilon<0)throw new RangeError('progressTranslationEpsilon must be finite and >= 0');
    if(!Number.isFinite(progressRotationEpsilon)||progressRotationEpsilon<0)throw new RangeError('progressRotationEpsilon must be finite and >= 0');
    if(!Number.isInteger(stagnationWindow)||stagnationWindow<1)throw new RangeError('stagnationWindow must be a positive integer');
    const anchor=matrix4(options.boneToRingAnchor||identity4(),'boneToRingAnchor');
    const ringToBone=matrix4(options.ringToBone||identity4(),'ringToBone');
    const initialStruts=vector6(options.initialStruts||[0,0,0,0,0,0],'initialStruts');
    const preserveInitialStruts=options.preserveInitialStruts===true;
    const calculateStrutLengths=options.calculateStrutLengths;
    const recoverPoseFromStruts=options.recoverPoseFromStruts;
    const mode=PLANNER_CONFIG.MODE;
    if(mode!=='PYTHON_COMPAT'&&mode!=='STRICT_JS')throw new Error('Unknown planner mode: '+mode);
    const compatCandidateSearch=options.candidateSearch||root.HexapodPlannerCandidates?.simpleSearch;
    const strictCandidateSearch=options.strictCandidateSearch||root.HexapodPlannerCandidates?.strictSearch;
    const expandedCandidateSearch=options.expandedCandidateSearch||root.HexapodPlannerCandidates?.expandedSearch;
    const candidateSearch=mode==='STRICT_JS'?strictCandidateSearch:compatCandidateSearch;
    if(typeof calculateStrutLengths!=='function')throw new TypeError('calculateStrutLengths callback is required');
    if(typeof recoverPoseFromStruts!=='function')throw new TypeError('recoverPoseFromStruts callback is required');
    if(mode==='STRICT_JS'&&PLANNER_CONFIG.PRIMARY_SEARCH_STRATEGY!=='FLOOR_CEIL_64')throw new Error('Unsupported primary candidate search strategy: '+PLANNER_CONFIG.PRIMARY_SEARCH_STRATEGY);
    if(mode==='STRICT_JS'&&PLANNER_CONFIG.EXPANDED_SEARCH_STRATEGY!=='INTEGER_NEIGHBORHOOD_729')throw new Error('Unsupported expanded candidate search strategy: '+PLANNER_CONFIG.EXPANDED_SEARCH_STRATEGY);
    if(typeof candidateSearch!=='function'){
      throw new TypeError(mode==='STRICT_JS'
        ?'STRICT_JS requires HexapodPlannerCandidates.strictSearch (64 floor/ceil combinations)'
        :'PYTHON_COMPAT requires HexapodPlannerCandidates.simpleSearch');
    }
    const totalTranslation=distance3(subtract3(targetPose.slice(0,3).map(r=>r[3]),startPose.slice(0,3).map(r=>r[3])));
    const startRotation= startPose.slice(0,3).map(r=>r.slice(0,3));
    const targetRotation=targetPose.slice(0,3).map(r=>r.slice(0,3));
    const totalRotationDegrees=distance3(rotationVectorFromMatrix(multiply3(targetRotation,transpose3(startRotation))))*180/Math.PI;
    const initialTranslationComplete=totalTranslation<=translationTolerance;
    const initialRotationComplete=totalRotationDegrees<=rotationTolerance;
    const translationDays=totalTranslation<=translationTolerance?0:totalTranslation/transLimit;
    const rotationDays=totalRotationDegrees<=rotationTolerance?0:(rotLimit>0?totalRotationDegrees/rotLimit:null);
    // Python CorrectionPlanner.__init__ uses translation duration only:
    // max(1, total_translation / trans_limit). Rotation does not extend the
    // fixed schedule duration in the legacy implementation.
    const pythonCompatDays=totalTranslation===0?1.0:Math.max(1.0,totalTranslation/transLimit);
    const estimatedDays=mode==='PYTHON_COMPAT'
      ?pythonCompatDays
      :((rotationDays===null)?null:Math.max(1,translationDays,rotationDays));
    const daysNeeded=estimatedDays;
    const planner={
      mode, scheduleGenerated:false, plannedTreatmentDays:Math.ceil(daysNeeded),
      startPose:clone4(startPose),targetPose:clone4(targetPose),transLimit,rotLimit,
      translationTolerance,rotationTolerance,limitTolerance,
      progressTranslationEpsilon,progressRotationEpsilon,stagnationWindow,
      totalRotationDegrees,translationDays,rotationDays,estimatedDays,
      initialTranslationComplete,initialRotationComplete,
      completedTranslation:initialTranslationComplete,completedRotation:initialRotationComplete,
      boneToRingAnchor:clone4(anchor),ringToBone:clone4(ringToBone),initialStruts:initialStruts.slice(),
      calculateStrutLengths,recoverPoseFromStruts,candidateSearch,expandedCandidateSearch,preserveInitialStruts,
      expandedSearchEnabled:mode==='STRICT_JS'&&PLANNER_CONFIG.EXPANDED_SEARCH_ENABLED,
      totalTranslation,daysNeeded,currentActualPose:clone4(startPose),currentDay:0,
      fkCallCount:0,
      dailyStates:[],dailyPoses:[],dailyRingPoses:[],dailyStrutLengths:[],
      getCurrentPose(){return clone4(this.currentActualPose);},
      createDayState(){return {bone_pose:null,ring_pose:null,struts:null};},
      bonePoseToRingPose(bonePose){
        const TboneToRing=inverse4(this.ringToBone);
        const TanchorInv=inverse4(this.boneToRingAnchor);
        return multiply4(multiply4(TboneToRing,matrix4(bonePose,'bonePose')),TanchorInv);
      },
      remainingTranslation(){
        return subtract3(this.targetPose.slice(0,3).map(r=>r[3]),this.currentActualPose.slice(0,3).map(r=>r[3]));
      },
      remainingDistance(){return distance3(this.remainingTranslation());},
      remainingDirection(){
        const v=this.remainingTranslation(),d=distance3(v);
        return d<1e-9?[0,0,0]:scale3(v,1/d);
      },
      idealTranslationIncrement(){
        const v=this.remainingTranslation(),d=distance3(v);
        if(d<1e-9)return [0,0,0];
        return scale3(v,Math.min(d,this.transLimit)/d);
      },
      remainingRotationMatrix(){
        const Rc=this.currentActualPose.slice(0,3).map(r=>r.slice(0,3));
        const Rt=this.targetPose.slice(0,3).map(r=>r.slice(0,3));
        return multiply3(Rt,transpose3(Rc));
      },
      remainingRotationVector(){return rotationVectorFromMatrix(this.remainingRotationMatrix());},
      remainingRotationAngle(){return distance3(this.remainingRotationVector())*180/Math.PI;},
      idealRotationIncrement(){
        const remaining=this.remainingRotationAngle();
        return remaining<1e-9?0:Math.min(remaining,this.rotLimit);
      },
      determineTodayTranslation(){return this.idealTranslationIncrement();},
      determineTodayRotation(){return this.idealRotationIncrement();},
      buildNextPose(currentPose,translationIncrement,rotationIncrement){
        const current=matrix4(currentPose,'currentPose');
        const t=vector3(translationIncrement,'translationIncrement');
        const Rcurrent=current.slice(0,3).map(r=>r.slice(0,3));
        const nextT=[current[0][3]+t[0],current[1][3]+t[1],current[2][3]+t[2]];
        const rv=this.remainingRotationVector(),angle=distance3(rv);
        let Rnext=Rcurrent;
        if(angle>1e-9){
          const axis=scale3(rv,1/angle);
          const step=rotationMatrixFromVector(scale3(axis,rotationIncrement*Math.PI/180));
          Rnext=multiply3(step,Rcurrent);
        }
        return poseWithRotationAndTranslation(Rnext,nextT);
      },
      proposeNextPose(currentPose,stepScale=1){
        const scale=Number(stepScale);
        if(!Number.isFinite(scale)||scale<=0||scale>1)throw new RangeError('stepScale must be in (0, 1]');
        return this.buildNextPose(currentPose,
          scale3(this.determineTodayTranslation(),scale),
          this.determineTodayRotation()*scale);
      },
      stageComplete(){
        return this.remainingDistance()<=this.translationTolerance &&
          this.remainingRotationAngle()<=this.rotationTolerance;
      },
      movementBetween(fromPose,toPose){
        const a=matrix4(fromPose,'previous actual pose');
        const b=matrix4(toPose,'next actual pose');
        const translation=distance3(subtract3(b.slice(0,3).map(r=>r[3]),a.slice(0,3).map(r=>r[3])));
        const Ra=a.slice(0,3).map(r=>r.slice(0,3));
        const Rb=b.slice(0,3).map(r=>r.slice(0,3));
        const rotation=distance3(rotationVectorFromMatrix(multiply3(Rb,transpose3(Ra))))*180/Math.PI;
        return {translationMm:translation,rotationDegrees:rotation};
      },
      isDailyMovementWithinLimits(movement){
        return movement.translationMm<=this.transLimit+this.limitTolerance &&
          movement.rotationDegrees<=this.rotLimit+this.limitTolerance;
      },
      acceptActualPose(pose){
        const accepted=matrix4(pose,'accepted pose');
        this.currentActualPose=clone4(accepted);
        this.dailyPoses.push(clone4(accepted));
        const state=this.createDayState();state.bone_pose=clone4(accepted);
        this.dailyStates.push(state);
      },
      recoverActualPose(clinicalPose){
        const ringPose=this.bonePoseToRingPose(clinicalPose);
        const ideal=vector6(this.calculateStrutLengths(ringPose),'ideal strut lengths');
        const state=this.dailyStates[this.dailyStates.length-1];
        const previousPose=clone4(this.currentActualPose);
        const recoverFn=(struts)=>{
          this.fkCallCount += 1;
          const recovered=this.recoverPoseFromStruts(vector6(struts,'candidate struts'));
          return matrix4(recovered?.T_db_bone||recovered?.T_bone||recovered,'recovered distal-bone pose');
        };
        const result=this.candidateSearch(ideal,clinicalPose,recoverFn,state);
        if(!result||!result.recoveredPose)throw new Error('Candidate search did not return a recovered pose');

        // PYTHON_COMPAT remains the original three-candidate preview behavior.
        if(this.mode==='PYTHON_COMPAT'){
          const pose=matrix4(result.recoveredPose,'selected candidate recovered pose');
          const movement=this.movementBetween(previousPose,pose);
          const evaluated=Array.isArray(result.evaluatedCandidates)&&result.evaluatedCandidates.length
            ?result.evaluatedCandidates:[result];
          const candidateTrace=evaluated.map(item=>{
            const candidatePose=matrix4(item.recoveredPose,'candidate recovered pose');
            const candidateMovement=this.movementBetween(previousPose,candidatePose);
            const selected=item.name===result.name&&item.prescription.every((v,i)=>v===result.prescription[i]);
            return {method:item.name,prescription:item.prescription.slice(),
              recoveredTranslation:candidatePose.slice(0,3).map(r=>r[3]),
              translationError:Array.isArray(item.translationError)?item.translationError.slice():null,
              targetTranslationErrorMm:Number(item.translationMagnitude),targetRotationErrorDeg:Number(item.rotationErrorDegrees),score:Number(item.score),
              actualDailyTranslationMm:candidateMovement.translationMm,actualDailyRotationDeg:candidateMovement.rotationDegrees,
              feasible:null,selected};
          });
          this.dayCandidateAttempts.push({stepScale:1,searchLevel:'LEGACY_ROUND_FLOOR_CEIL_3',
            proposedTranslation:clinicalPose.slice(0,3).map(r=>r[3]),previousTranslation:previousPose.slice(0,3).map(r=>r[3]),
            idealStruts:ideal.slice(),candidateCount:candidateTrace.length,candidates:candidateTrace});
          state.prescription=result.prescription.slice();state.recovered_pose=pose.map(r=>r.slice());
          return {actualPose:pose,candidate:result.prescription.slice(),translationError:result.translationError.slice(),
            translationMagnitude:result.translationMagnitude,rotationError:result.rotationErrorDegrees,method:result.name,
            movement,candidateResult:result};
        }

        const evaluatePool=(searchResult,searchLevel)=>{
          const candidates=Array.isArray(searchResult.evaluatedCandidates)&&searchResult.evaluatedCandidates.length
            ?searchResult.evaluatedCandidates:[searchResult];
          const feasible=[];
          const candidateTrace=[];
          for(const item of candidates){
            if(!item||!item.recoveredPose||!item.prescription)continue;
            const pose=matrix4(item.recoveredPose,'candidate recovered pose');
            const movement=this.movementBetween(previousPose,pose);
            const isFeasible=this.isDailyMovementWithinLimits(movement);
            const finalTranslationResidual=distance3(subtract3(
              this.targetPose.slice(0,3).map(r=>r[3]),pose.slice(0,3).map(r=>r[3])));
            const finalRotationResidual=distance3(rotationVectorFromMatrix(multiply3(
              this.targetPose.slice(0,3).map(r=>r.slice(0,3)),
              transpose3(pose.slice(0,3).map(r=>r.slice(0,3))))))*180/Math.PI;
            const traceItem={
              method:item.name,prescription:item.prescription.slice(),searchLevel,
              recoveredTranslation:pose.slice(0,3).map(r=>r[3]),
              translationError:Array.isArray(item.translationError)?item.translationError.slice():null,
              targetTranslationErrorMm:Number(item.translationMagnitude),targetRotationErrorDeg:Number(item.rotationErrorDegrees),
              score:Number(item.score),actualDailyTranslationMm:movement.translationMm,
              actualDailyRotationDeg:movement.rotationDegrees,feasible:isFeasible,
              finalTargetTranslationResidualMm:finalTranslationResidual,
              finalTargetRotationResidualDeg:finalRotationResidual,
              translationProgressMm:this.remainingDistance()-finalTranslationResidual,
              rotationProgressDeg:this.remainingRotationAngle()-finalRotationResidual,
              preservesCompletedTranslation:this.completedTranslation&&finalTranslationResidual<=this.translationTolerance+this.limitTolerance,
              preservesCompletedRotation:this.completedRotation&&finalRotationResidual<=this.rotationTolerance+this.limitTolerance,
              preservesInitiallyCompleteTranslation:this.initialTranslationComplete&&finalTranslationResidual<=this.translationTolerance+this.limitTolerance,
              preservesInitiallyCompleteRotation:this.initialRotationComplete&&finalRotationResidual<=this.rotationTolerance+this.limitTolerance,
              selected:false
            };
            candidateTrace.push(traceItem);
            if(isFeasible)feasible.push({item,pose,movement,traceItem});
          }
          const selection=feasible.length?chooseGoalAwareCandidate(feasible,{
            completedTranslation:this.completedTranslation,completedRotation:this.completedRotation,
            translationTolerance:this.translationTolerance,rotationTolerance:this.rotationTolerance,
            limitTolerance:this.limitTolerance,
            progressEpsilon:Math.max(this.progressTranslationEpsilon,this.progressRotationEpsilon)
          }):null;
          return {searchResult,searchLevel,candidates,feasible,candidateTrace,selection};
        };
        const recordPool=(pool,selectedPool)=>{
          const selection=pool.selection;
          this.dayCandidateAttempts.push({
            stepScale:Number(this._activeStepScale),searchLevel:pool.searchLevel,
            proposedTranslation:clinicalPose.slice(0,3).map(r=>r[3]),
            previousTranslation:previousPose.slice(0,3).map(r=>r[3]),idealStruts:ideal.slice(),
            candidateCount:pool.candidateTrace.length,feasibleCandidateCount:pool.feasible.length,
            completedDimensionsAtSearch:{translation:this.completedTranslation,rotation:this.completedRotation},
            candidateSelectionStrategy:selection?.strategy||'no_feasible_candidate',
            candidateSelectionReason:selection?.reason||'No candidate passed both actual daily movement limits.',
            progressFound:selection?.progressFound===true,
            selectedForAcceptance:selectedPool===true,
            candidates:pool.candidateTrace
          });
        };

        let primary=evaluatePool(result,PLANNER_CONFIG.PRIMARY_SEARCH_STRATEGY);
        let chosenPool=primary;
        const shouldExpand=this.expandedSearchEnabled&&typeof this.expandedCandidateSearch==='function'&&
          (!primary.feasible.length||!primary.selection?.progressFound);
        let expanded=null;
        if(shouldExpand){
          const expandedResult=this.expandedCandidateSearch(ideal,clinicalPose,recoverFn,state,{
            neighborhoodRadiusMm:PLANNER_CONFIG.EXPANDED_SEARCH_RADIUS_MM
          });
          if(!expandedResult||!expandedResult.recoveredPose)throw new Error('Expanded candidate search did not return a recovered pose');
          expanded=evaluatePool(expandedResult,'INTEGER_NEIGHBORHOOD_729');
          if(expanded.feasible.length)chosenPool=expanded;
        }

        if(!chosenPool.feasible.length){
          recordPool(primary,false);
          if(expanded)recordPool(expanded,false);
          const error=new Error('No integer strut candidate in the 64-candidate or expanded neighborhood satisfies both actual daily movement limits');
          error.code='DAILY_LIMITS_INFEASIBLE';
          error.candidateCount=(primary.candidateTrace.length)+(expanded?.candidateTrace.length||0);
          throw error;
        }
        if(chosenPool===primary&&expanded){
          // The expanded neighborhood was tried but produced no feasible row;
          // retain the primary pool's safest feasible candidate.
        }
        const selection=chosenPool.selection;
        const chosen=selection.chosen,item=chosen.item;
        chosen.traceItem.selected=true;
        chosen.traceItem.selectionReason=selection.reason;
        recordPool(primary,chosenPool===primary);
        if(expanded)recordPool(expanded,chosenPool===expanded);
        const latestAttempt=this.dayCandidateAttempts[this.dayCandidateAttempts.length-1];
        latestAttempt.candidateSelectionStrategy=selection.strategy+(expanded?'_expanded_search_checked':'');
        latestAttempt.candidateSelectionReason=selection.reason;
        latestAttempt.expandedSearchTriggered=!!expanded;
        latestAttempt.expandedSearchUsed=chosenPool===expanded;
        latestAttempt.searchLevelsAttempted=expanded?[PLANNER_CONFIG.PRIMARY_SEARCH_STRATEGY,PLANNER_CONFIG.EXPANDED_SEARCH_STRATEGY]:[PLANNER_CONFIG.PRIMARY_SEARCH_STRATEGY];
        state.prescription=item.prescription.slice();
        state.recovered_pose=chosen.pose.map(r=>r.slice());
        return {actualPose:chosen.pose,candidate:item.prescription.slice(),
          translationError:item.translationError.slice(),translationMagnitude:item.translationMagnitude,
          rotationError:item.rotationErrorDegrees,method:item.name,movement:chosen.movement,
          candidateResult:{...chosenPool.searchResult,...item,feasibleCandidateCount:chosenPool.feasible.length,
            candidateSearchLevel:chosenPool.searchLevel,candidateSelectionStrategy:selection.strategy,
            expandedSearchTriggered:!!expanded,expandedSearchUsed:chosenPool===expanded}};
      },
      executeOneDay(day){
        this.currentDay=day;
        if(this.mode==='PYTHON_COMPAT'){
          const previousPose=clone4(this.currentActualPose);
          this.remainingDistanceBeforeDay=this.remainingDistance();
          this.remainingRotationBeforeDay=this.remainingRotationAngle();
          this.dayCandidateAttempts=[];
          const proposed=this.proposeNextPose(previousPose,1);
          const recovered=this.recoverActualPose(proposed);
          this.acceptActualPose(recovered.actualPose);
          const movement=recovered.movement||this.movementBetween(previousPose,recovered.actualPose);
          const translationProgress=this.remainingDistanceBeforeDay-this.remainingDistance();
          const rotationProgress=this.remainingRotationBeforeDay-this.remainingRotationAngle();
          return {
            day,proposedPose:proposed,...recovered,movement,acceptedStepScale:1,
            candidateAttempts:this.dayCandidateAttempts.map(a=>JSON.parse(JSON.stringify(a))),
            translationProgressMm:translationProgress,rotationProgressDegrees:rotationProgress,
            remainingTranslation:this.remainingDistance(),
            remainingRotationDegrees:this.remainingRotationAngle(),
            stagnantTranslationDays:0,stagnantRotationDays:0,stagnantDays:0
          };
        }
        const previousPose=clone4(this.currentActualPose);
        this.remainingDistanceBeforeDay=this.remainingDistance();
        this.remainingRotationBeforeDay=this.remainingRotationAngle();
        let proposed=null,recovered=null,lastLimitError=null,acceptedScale=null;
        this.dayCandidateAttempts=[];
        // Integer strut rounding can make the recovered movement exceed a
        // nominal full-limit proposal. Back off the requested step until an
        // actually recovered candidate satisfies both hard daily limits.
        for(let scale=1;scale>=1/1024;scale*=0.5){
          this._activeStepScale=scale;
          proposed=this.proposeNextPose(previousPose,scale);
          try{
            recovered=this.recoverActualPose(proposed);
            acceptedScale=scale;
            break;
          }catch(error){
            if(error.code!=='DAILY_LIMITS_INFEASIBLE')throw error;
            lastLimitError=error;
          }
        }
        if(!recovered){
          const error=lastLimitError||new Error('No feasible daily prescription was found');
          error.code='DAILY_LIMITS_INFEASIBLE';
          throw error;
        }
        this.acceptActualPose(recovered.actualPose);
        const movement=recovered.movement||this.movementBetween(previousPose,recovered.actualPose);
        const translationProgress=this.remainingDistanceBeforeDay-this.remainingDistance();
        const rotationProgress=this.remainingRotationBeforeDay-this.remainingRotationAngle();
        const remainingTranslation=this.remainingDistance();
        const remainingRotationDegrees=this.remainingRotationAngle();
        if(remainingTranslation<=this.translationTolerance)this.completedTranslation=true;
        if(remainingRotationDegrees<=this.rotationTolerance)this.completedRotation=true;
        if(this.completedTranslation){
          this.stagnantTranslationDays=nextProtectedStagnationCount(
            remainingTranslation,this.remainingDistanceBeforeDay,this.translationTolerance,
            this.progressTranslationEpsilon,this.stagnantTranslationDays
          );
        }else if(remainingTranslation+this.progressTranslationEpsilon<this.bestRemainingTranslation){
          this.bestRemainingTranslation=remainingTranslation;this.stagnantTranslationDays=0;
        }else if(remainingTranslation>this.translationTolerance)this.stagnantTranslationDays++;
        if(this.completedRotation){
          this.stagnantRotationDays=nextProtectedStagnationCount(
            remainingRotationDegrees,this.remainingRotationBeforeDay,this.rotationTolerance,
            this.progressRotationEpsilon,this.stagnantRotationDays
          );
        }else if(remainingRotationDegrees+this.progressRotationEpsilon<this.bestRemainingRotation){
          this.bestRemainingRotation=remainingRotationDegrees;this.stagnantRotationDays=0;
        }else if(remainingRotationDegrees>this.rotationTolerance)this.stagnantRotationDays++;
        this.stagnantDays=Math.max(this.stagnantTranslationDays,this.stagnantRotationDays);
        return {day,proposedPose:proposed,...recovered,movement,acceptedStepScale:acceptedScale,
          candidateAttempts:this.dayCandidateAttempts.map(a=>JSON.parse(JSON.stringify(a))),
          translationProgressMm:translationProgress,rotationProgressDegrees:rotationProgress,
          remainingTranslation,remainingRotationDegrees,
          stagnantTranslationDays:this.stagnantTranslationDays,stagnantRotationDays:this.stagnantRotationDays,
          completedTranslation:this.completedTranslation,completedRotation:this.completedRotation,
          activeObjectives:[...(this.completedTranslation?[]:['translation']),...(this.completedRotation?[]:['rotation'])],
          stagnantDays:this.stagnantDays};
      },
      generateTrajectory(){
        if(this.mode==='PYTHON_COMPAT'){
          this.dailyPoses=[];this.dailyStates=[];this.currentActualPose=clone4(this.startPose);
          this.fkCallCount=0;
          this.dayCandidateAttempts=[];this._activeStepScale=null;
          this.terminationReason=null;this.terminationMessage=null;this.status='running';
          this.scheduleGenerated=false;
          const day0=this.createDayState();day0.bone_pose=clone4(this.currentActualPose);
          this.dailyStates.push(day0);this.dailyPoses.push(clone4(this.currentActualPose));
          const rows=[];
          const plannedDays=Math.ceil(this.daysNeeded);
          for(let day=1;day<=plannedDays;day++){
            try{rows.push(this.executeOneDay(day));}
            catch(error){
              this.status='incomplete';
              this.terminationReason='candidate_or_fk_recovery_failed';
              this.terminationMessage=String(error&&error.message||error);
              break;
            }
          }
          this.dayReports=rows;
          this.scheduleGenerated=rows.length===plannedDays;
          if(this.scheduleGenerated){
            this.status='schedule_generated';
            this.terminationReason='python_compat_duration_elapsed';
            this.terminationMessage='Original Python fixed-duration schedule generated; clinical target attainment is reported separately.';
          }
          return this.dailyPoses.map(clone4);
        }
        this.dailyPoses=[];this.dailyStates=[];this.currentActualPose=clone4(this.startPose);
        this.fkCallCount=0;
        this.dayCandidateAttempts=[];this._activeStepScale=null;
        this.stagnantDays=0;this.stagnantTranslationDays=0;this.stagnantRotationDays=0;
        this.bestRemainingTranslation=this.remainingDistance();
        this.bestRemainingRotation=this.remainingRotationAngle();
        this.completedTranslation=this.initialTranslationComplete;
        this.completedRotation=this.initialRotationComplete;
        this.terminationReason=null;this.terminationMessage=null;this.status='running';
        const day0=this.createDayState();day0.bone_pose=clone4(this.currentActualPose);
        this.dailyStates.push(day0);this.dailyPoses.push(clone4(this.currentActualPose));
        const rows=[];
        while(!this.stageComplete()){
          const day=rows.length+1;
          try{
            const report=this.executeOneDay(day);
            rows.push(report);
          }catch(error){
            this.status='incomplete';
            this.terminationReason=error.code==='DAILY_LIMITS_INFEASIBLE'?'daily_limits_infeasible':'fk_or_candidate_recovery_failed';
            this.terminationMessage=String(error&&error.message||error);
            break;
          }
          if(this.stageComplete()){
            this.status='complete';this.terminationReason='target_reached';break;
          }
          if(this.stagnantTranslationDays>=this.stagnationWindow ||
             this.stagnantRotationDays>=this.stagnationWindow){
            this.status='incomplete';this.terminationReason='stagnation';
            const blocked=[];
            if(this.stagnantTranslationDays>=this.stagnationWindow)blocked.push('translation');
            if(this.stagnantRotationDays>=this.stagnationWindow)blocked.push('rotation');
            this.terminationMessage='No progress toward '+blocked.join(' / ')+' target for '+this.stagnationWindow+' consecutive days.';
            break;
          }
        }
        if(this.stageComplete()&&this.status==='running'){
          this.status='complete';this.terminationReason='target_reached';
        }
        if(this.status==='running'){
          this.status='complete';this.terminationReason='target_reached';
        }
        this.dayReports=rows;
        return this.dailyPoses.map(clone4);
      },
      generateRingTrajectory(){
        this.dailyRingPoses=this.dailyPoses.map(p=>this.bonePoseToRingPose(p));
        return this.dailyRingPoses.map(clone4);
      },
      generateStrutSchedule(){
        this.dailyStrutLengths=this.dailyRingPoses.map(p=>vector6(this.calculateStrutLengths(p),'daily strut lengths'));
        // App.run_phase_planner() preserves an explicitly supplied predecessor
        // phase handoff row. First phases retain the IK-generated Day-0 row.
        if(this.preserveInitialStruts&&this.dailyStrutLengths.length)
          this.dailyStrutLengths[0]=this.initialStruts.slice();
        return this.dailyStrutLengths.map(v=>v.slice());
      },
      executeStage(){
        this.generateTrajectory();this.generateRingTrajectory();this.generateStrutSchedule();
        return this.getResult();
      },
      run(){return this.executeStage();},
      getResult(){
        const reports=this.dayReports||[];
        const attempts=reports.flatMap(r=>Array.isArray(r.candidateAttempts)?r.candidateAttempts:[]);
        const candidateEvaluations=attempts.reduce((n,a)=>n+(Number(a.candidateCount)||0),0);
        const feasibleCandidateEvaluations=attempts.reduce((n,a)=>n+(Number(a.feasibleCandidateCount)||0),0);
        const expandedSearchAttempts=attempts.filter(a=>a.expandedSearchTriggered===true).length;
        const expandedSearchUsed=attempts.filter(a=>a.expandedSearchUsed===true).length;
        const maxDailyTranslationMm=reports.reduce((m,r)=>Math.max(m,Number(r.movement?.translationMm)||0),0);
        const maxDailyRotationDeg=reports.reduce((m,r)=>Math.max(m,Number(r.movement?.rotationDegrees)||0),0);
        let objectiveSwitches=0;
        let previousObjectives=null;
        for(const report of reports){
          const current=Array.isArray(report.activeObjectives)?report.activeObjectives.join('|'):'';
          if(previousObjectives!==null&&current!==previousObjectives)objectiveSwitches++;
          previousObjectives=current;
        }
        const maxTranslationStagnation=reports.reduce((m,r)=>Math.max(m,Number(r.stagnantTranslationDays)||0),0);
        const maxRotationStagnation=reports.reduce((m,r)=>Math.max(m,Number(r.stagnantRotationDays)||0),0);
        const performance={
          accepted_days:reports.length,
          candidate_attempts:attempts.length,
          candidate_evaluations:candidateEvaluations,
          feasible_candidate_evaluations:feasibleCandidateEvaluations,
          candidate_feasibility_percent:candidateEvaluations?100*feasibleCandidateEvaluations/candidateEvaluations:0,
          expanded_search_attempts:expandedSearchAttempts,
          expanded_search_used:expandedSearchUsed,
          fk_calls:this.fkCallCount||0,
          max_daily_translation_mm:maxDailyTranslationMm,
          max_daily_rotation_degrees:maxDailyRotationDeg,
          objective_switches:objectiveSwitches,
          max_translation_stagnation_days:maxTranslationStagnation,
          max_rotation_stagnation_days:maxRotationStagnation,
          average_candidates_per_day:reports.length?candidateEvaluations/reports.length:0
        };
        return {
          days_needed:this.daysNeeded,
          estimated_days:this.estimatedDays,
          estimated_translation_days:this.translationDays,
          estimated_rotation_days:this.rotationDays,
          number_of_days:this.dailyPoses.length,
          status:this.status||'not_run',
          complete:this.stageComplete(),
          performance,
          schedule_generated:this.scheduleGenerated===true,
          clinical_target_reached:this.stageComplete(),
          planner_mode:this.mode,
          candidate_search_strategy:this.mode==='STRICT_JS'?'floor_ceil_64_then_integer_neighborhood_729_fallback':'legacy_round_floor_ceil_3',
          candidate_selection_strategy:this.mode==='STRICT_JS'?'dynamic_goal_aware_completed_objective_protection':'legacy_mixed_unit_score',
          initially_complete_dimensions:{translation:this.initialTranslationComplete,rotation:this.initialRotationComplete},
          completed_dimensions:{translation:this.completedTranslation,rotation:this.completedRotation},
          planner_configuration:{version:root.APP_CONFIG?.version||'fallback-defaults',completion_tolerance:{translation_mm:this.translationTolerance,rotation_degrees:this.rotationTolerance},daily_movement_limit:{translation_mm:this.transLimit,rotation_degrees:this.rotLimit},stagnation_window_days:this.stagnationWindow,primary_candidate_search:PLANNER_CONFIG.PRIMARY_SEARCH_STRATEGY,expanded_search_enabled:this.expandedSearchEnabled,expanded_search_strategy:PLANNER_CONFIG.EXPANDED_SEARCH_STRATEGY,expanded_neighborhood_radius_mm:PLANNER_CONFIG.EXPANDED_SEARCH_RADIUS_MM},
          termination_reason:this.terminationReason||null,
          termination_message:this.terminationMessage||null,
          daily_poses:this.dailyPoses.map(clone4),
          daily_ring_poses:this.dailyRingPoses.map(clone4),
          strut_array:this.dailyStrutLengths.map(v=>v.slice()),
          daily_states:this.dailyStates.map(s=>JSON.parse(JSON.stringify(s))),
          target_pose:clone4(this.targetPose),
          day_reports:(this.dayReports||[]).map(r=>({
            day:r.day,method:r.method,prescription:r.candidate.slice(),
            translation_error:r.translationError.slice(),translation_error_magnitude:r.translationMagnitude,
            rotation_error_degrees:r.rotationError,
            actual_daily_translation_mm:r.movement.translationMm,
            actual_daily_rotation_degrees:r.movement.rotationDegrees,
            accepted_step_scale:r.acceptedStepScale,
            translation_progress_mm:r.translationProgressMm,rotation_progress_degrees:r.rotationProgressDegrees,
            stagnant_translation_days:r.stagnantTranslationDays??0,
            stagnant_rotation_days:r.stagnantRotationDays??0,
            stagnant_days:r.stagnantDays??0,
            candidate_attempts:(r.candidateAttempts||[]).map(a=>JSON.parse(JSON.stringify(a))),
            remaining_translation_mm:r.remainingTranslation,
            remaining_rotation_degrees:r.remainingRotationDegrees,
            completed_translation:r.completedTranslation===true,
            completed_rotation:r.completedRotation===true,
            active_objectives:Array.isArray(r.activeObjectives)?r.activeObjectives.slice():[]
          })),
          completion:{translation_complete:this.remainingDistance()<=this.translationTolerance,
            rotation_complete:this.remainingRotationAngle()<=this.rotationTolerance,
            remaining_translation_mm:this.remainingDistance(),remaining_rotation_degrees:this.remainingRotationAngle(),
            translation_tolerance_mm:this.translationTolerance,rotation_tolerance_degrees:this.rotationTolerance,
            daily_translation_limit_mm:this.transLimit,daily_rotation_limit_degrees:this.rotLimit,
            no_fixed_maximum_days:this.mode!=='PYTHON_COMPAT',
            termination_mode:this.mode==='PYTHON_COMPAT'?'python_fixed_translation_duration':'strict_js_completion_driven',
            schedule_generated:this.scheduleGenerated===true,
            clinical_target_reached:this.stageComplete(),
            stagnation_window:this.stagnationWindow,
            initially_complete_dimensions:{translation:this.initialTranslationComplete,rotation:this.initialRotationComplete},
            candidate_selection_strategy:this.mode==='STRICT_JS'?'dynamic_goal_aware_completed_objective_protection':'legacy_mixed_unit_score',completed_dimensions:{translation:this.completedTranslation,rotation:this.completedRotation}}
        };
      }
    };
    return planner;
  }

  root.HexapodPlannerTrajectory={
    PLANNER_CONFIG,createPlanner,identity4,multiply4,inverse4,rotationMatrixFromVector,rotationVectorFromMatrix,
    chooseGoalAwareCandidate,nextProtectedStagnationCount
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=root.HexapodPlannerTrajectory;
})(typeof window!=='undefined'?window:globalThis);
