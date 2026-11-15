/*
 * R1172.0 — Temporary compatibility schedule preview mode
 *
 * This module retains both browser planner paths:
 *   PYTHON_COMPAT — legacy fixed-duration schedule generation. This is the
 *                   temporary active mode for animation/engineering preview.
 *   STRICT_JS     — completion-driven planning with actual daily movement
 *                   limits, integer-candidate feasibility and stagnation checks.
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

  // MANUAL PLANNER SETTINGS — edit these assignments when engineering review
  // changes the treatment limits or practical completion thresholds.
  // Daily limits are fixed defaults, not Treatment-page/user settings.
  // Completion tolerances are provisional engineering values (not clinically
  // validated). Evidence used:
  // - R1164 physical integer-mm strut fixture ended at 0.8311 mm / 0.0661 deg.
  // - R1164 deterministic fixtures ended at 0.6000 mm / 0.0146 deg and
  //   0.4899 mm / 0.0418 deg. Values are rounded upward to 1.0 mm / 0.1 deg.
  const PLANNER_CONFIG = Object.freeze({
    // R1172.0 TEMPORARY PREVIEW MODE:
    // Generate the legacy fixed-duration schedule so daily rows are available
    // for animation/engineering review while STRICT_JS stagnation is investigated.
    // This mode does NOT enforce strict actual daily movement limits and does NOT
    // claim clinical target attainment. PYTHON_COMPAT remains explicitly distinct
    // from STRICT_JS and reports schedule_generated separately from complete.
    MODE: 'PYTHON_COMPAT',
    DAILY_TRANSLATION_LIMIT_MM: 1.0,       // maximum actual translation per day
    DAILY_ROTATION_LIMIT_DEG: 1.0,         // maximum actual rotation per day
    COMPLETION_TRANSLATION_TOLERANCE_MM: 1.0, // practical integer-strut tolerance
    COMPLETION_ROTATION_TOLERANCE_DEG: 0.1,    // practical angular tolerance
    DAILY_LIMIT_NUMERICAL_TOLERANCE: 1e-6,
    PROGRESS_TRANSLATION_EPSILON_MM: 1e-8,
    PROGRESS_ROTATION_EPSILON_DEG: 1e-8,
    STAGNATION_WINDOW_DAYS: 3
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
    const candidateSearch=options.candidateSearch||root.HexapodPlannerCandidates?.simpleSearch;
    if(typeof calculateStrutLengths!=='function')throw new TypeError('calculateStrutLengths callback is required');
    if(typeof recoverPoseFromStruts!=='function')throw new TypeError('recoverPoseFromStruts callback is required');
    if(typeof candidateSearch!=='function')throw new TypeError('R1163 candidateSearch callback is required');

    const mode=PLANNER_CONFIG.MODE;
    if(mode!=='PYTHON_COMPAT'&&mode!=='STRICT_JS')throw new Error('Unknown planner mode: '+mode);
    const totalTranslation=distance3(subtract3(targetPose.slice(0,3).map(r=>r[3]),startPose.slice(0,3).map(r=>r[3])));
    const startRotation= startPose.slice(0,3).map(r=>r.slice(0,3));
    const targetRotation=targetPose.slice(0,3).map(r=>r.slice(0,3));
    const totalRotationDegrees=distance3(rotationVectorFromMatrix(multiply3(targetRotation,transpose3(startRotation))))*180/Math.PI;
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
      boneToRingAnchor:clone4(anchor),ringToBone:clone4(ringToBone),initialStruts:initialStruts.slice(),
      calculateStrutLengths,recoverPoseFromStruts,candidateSearch,preserveInitialStruts,
      totalTranslation,daysNeeded,currentActualPose:clone4(startPose),currentDay:0,
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
        const result=this.candidateSearch(ideal,clinicalPose,(struts)=>{
          const recovered=this.recoverPoseFromStruts(vector6(struts,'candidate struts'));
          return matrix4(recovered?.T_db_bone||recovered?.T_bone||recovered,'recovered distal-bone pose');
        },state);
        if(!result||!result.recoveredPose)throw new Error('Candidate search did not return a recovered pose');

        // Python compatibility: accept the best Round/Floor/Ceil result from
        // the original score-only search. Do not apply R1165/R1166 actual-
        // movement rejection or half-step backoff in this mode.
        if(this.mode==='PYTHON_COMPAT'){
          const pose=matrix4(result.recoveredPose,'selected candidate recovered pose');
          const movement=this.movementBetween(previousPose,pose);
          const evaluated=Array.isArray(result.evaluatedCandidates)&&result.evaluatedCandidates.length
            ?result.evaluatedCandidates:[result];
          const candidateTrace=evaluated.map(item=>{
            const candidatePose=matrix4(item.recoveredPose,'candidate recovered pose');
            const candidateMovement=this.movementBetween(previousPose,candidatePose);
            const selected=item.name===result.name&&item.prescription.every((v,i)=>v===result.prescription[i]);
            return {
              method:item.name,prescription:item.prescription.slice(),
              recoveredTranslation:candidatePose.slice(0,3).map(r=>r[3]),
              translationError:Array.isArray(item.translationError)?item.translationError.slice():null,
              targetTranslationErrorMm:Number(item.translationMagnitude),
              targetRotationErrorDeg:Number(item.rotationErrorDegrees),score:Number(item.score),
              actualDailyTranslationMm:candidateMovement.translationMm,
              actualDailyRotationDeg:candidateMovement.rotationDegrees,
              feasible:null,selected
            };
          });
          this.dayCandidateAttempts.push({
            stepScale:1,
            proposedTranslation:clinicalPose.slice(0,3).map(r=>r[3]),
            previousTranslation:previousPose.slice(0,3).map(r=>r[3]),
            idealStruts:ideal.slice(),candidates:candidateTrace
          });
          state.prescription=result.prescription.slice();
          state.recovered_pose=pose.map(r=>r.slice());
          return {
            actualPose:pose,candidate:result.prescription.slice(),
            translationError:result.translationError.slice(),
            translationMagnitude:result.translationMagnitude,
            rotationError:result.rotationErrorDegrees,method:result.name,
            movement,candidateResult:result
          };
        }

        const candidates=Array.isArray(result.evaluatedCandidates)&&result.evaluatedCandidates.length
          ?result.evaluatedCandidates:[result];
        const feasible=[];
        const candidateTrace=[];
        for(const item of candidates){
          if(!item||!item.recoveredPose||!item.prescription)continue;
          const pose=matrix4(item.recoveredPose,'candidate recovered pose');
          const movement=this.movementBetween(previousPose,pose);
          const isFeasible=this.isDailyMovementWithinLimits(movement);
          const traceItem={
            method:item.name,
            prescription:item.prescription.slice(),
            recoveredTranslation:pose.slice(0,3).map(r=>r[3]),
            translationError:Array.isArray(item.translationError)?item.translationError.slice():null,
            targetTranslationErrorMm:Number(item.translationMagnitude),
            targetRotationErrorDeg:Number(item.rotationErrorDegrees),
            score:Number(item.score),
            actualDailyTranslationMm:movement.translationMm,
            actualDailyRotationDeg:movement.rotationDegrees,
            feasible:isFeasible,
            selected:false
          };
          candidateTrace.push(traceItem);
          if(isFeasible)feasible.push({item,pose,movement,traceItem});
        }
        // Diagnostic only: retain each rounding candidate and its recovered
        // movement at every attempted step scale. No candidate strategy or
        // scoring behavior is changed by this trace.
        this.dayCandidateAttempts.push({
          stepScale:Number(this._activeStepScale),
          proposedTranslation:clinicalPose.slice(0,3).map(r=>r[3]),
          previousTranslation:previousPose.slice(0,3).map(r=>r[3]),
          idealStruts:ideal.slice(),
          candidates:candidateTrace
        });
        if(!feasible.length){
          const error=new Error('No integer strut candidate satisfies both actual daily movement limits');
          error.code='DAILY_LIMITS_INFEASIBLE';
          error.candidateCount=candidates.length;
          throw error;
        }
        // Preserve the existing R1163 score and stable candidate ordering.
        feasible.sort((a,b)=>(Number(a.item.score??Infinity)-Number(b.item.score??Infinity)));
        const chosen=feasible[0],item=chosen.item;
        chosen.traceItem.selected=true;
        state.prescription=item.prescription.slice();
        state.recovered_pose=chosen.pose.map(r=>r.slice());
        return {
          actualPose:chosen.pose,
          candidate:item.prescription.slice(),
          translationError:item.translationError.slice(),
          translationMagnitude:item.translationMagnitude,
          rotationError:item.rotationErrorDegrees,
          method:item.name,
          movement:chosen.movement,
          candidateResult:{...result,...item,feasibleCandidateCount:feasible.length}
        };
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
        if(remainingTranslation+this.progressTranslationEpsilon<this.bestRemainingTranslation){
          this.bestRemainingTranslation=remainingTranslation;this.stagnantTranslationDays=0;
        }else if(remainingTranslation>this.translationTolerance)this.stagnantTranslationDays++;
        if(remainingRotationDegrees+this.progressRotationEpsilon<this.bestRemainingRotation){
          this.bestRemainingRotation=remainingRotationDegrees;this.stagnantRotationDays=0;
        }else if(remainingRotationDegrees>this.rotationTolerance)this.stagnantRotationDays++;
        this.stagnantDays=Math.max(this.stagnantTranslationDays,this.stagnantRotationDays);
        return {day,proposedPose:proposed,...recovered,movement,acceptedStepScale:acceptedScale,
          candidateAttempts:this.dayCandidateAttempts.map(a=>JSON.parse(JSON.stringify(a))),
          translationProgressMm:translationProgress,rotationProgressDegrees:rotationProgress,
          remainingTranslation,remainingRotationDegrees,
          stagnantTranslationDays:this.stagnantTranslationDays,stagnantRotationDays:this.stagnantRotationDays,
          stagnantDays:this.stagnantDays};
      },
      generateTrajectory(){
        if(this.mode==='PYTHON_COMPAT'){
          this.dailyPoses=[];this.dailyStates=[];this.currentActualPose=clone4(this.startPose);
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
        this.dayCandidateAttempts=[];this._activeStepScale=null;
        this.stagnantDays=0;this.stagnantTranslationDays=0;this.stagnantRotationDays=0;
        this.bestRemainingTranslation=this.remainingDistance();
        this.bestRemainingRotation=this.remainingRotationAngle();
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
            this.terminationMessage='No new best '+blocked.join(' / ')+' residual for '+this.stagnationWindow+' consecutive days.';
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
        return {
          days_needed:this.daysNeeded,
          estimated_days:this.estimatedDays,
          estimated_translation_days:this.translationDays,
          estimated_rotation_days:this.rotationDays,
          number_of_days:this.dailyPoses.length,
          status:this.status||'not_run',
          complete:this.stageComplete(),
          schedule_generated:this.scheduleGenerated===true,
          clinical_target_reached:this.stageComplete(),
          planner_mode:this.mode,
          termination_reason:this.terminationReason||null,
          termination_message:this.terminationMessage||null,
          daily_poses:this.dailyPoses.map(clone4),
          daily_ring_poses:this.dailyRingPoses.map(clone4),
          strut_array:this.dailyStrutLengths.map(v=>v.slice()),
          daily_states:this.dailyStates.map(s=>JSON.parse(JSON.stringify(s))),
          day_reports:(this.dayReports||[]).map(r=>({
            day:r.day,method:r.method,prescription:r.candidate.slice(),
            translation_error:r.translationError.slice(),translation_error_magnitude:r.translationMagnitude,
            rotation_error_degrees:r.rotationError,
            actual_daily_translation_mm:r.movement.translationMm,
            actual_daily_rotation_degrees:r.movement.rotationDegrees,
            accepted_step_scale:r.acceptedStepScale,
            translation_progress_mm:r.translationProgressMm,rotation_progress_degrees:r.rotationProgressDegrees,
            candidate_attempts:(r.candidateAttempts||[]).map(a=>JSON.parse(JSON.stringify(a))),
            remaining_translation_mm:r.remainingTranslation,
            remaining_rotation_degrees:r.remainingRotationDegrees
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
            stagnation_window:this.stagnationWindow}
        };
      }
    };
    return planner;
  }

  root.HexapodPlannerTrajectory={
    PLANNER_CONFIG,createPlanner,identity4,multiply4,inverse4,rotationMatrixFromVector,rotationVectorFromMatrix
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=root.HexapodPlannerTrajectory;
})(typeof window!=='undefined'?window:globalThis);
