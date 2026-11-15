/*
 * Orthopedic Hexapod Mechanics — browser-first mechanical FK
 *
 * Pose convention (new, explicit):
 *   pose = [tx, ty, tz, wx, wy, wz]
 *   translation in mm; [wx,wy,wz] is a rotation vector in radians.
 *   R = exp([w]x), acting on column vectors; T * [p,1].
 *
 * This deliberately does NOT preserve the historical SciPy Euler sequence
 * parameterization. It preserves the physical transform and strut geometry.
 * Clinical geometric angles are outside this module.
 *
 * Browser dependencies: shared.js must be loaded first. This module reuses
 * buildSimulationAttachmentPoints() and simTransformPoint().
 */
(function(root){
  'use strict';

  const DEFAULT_BOUNDS = [
    [-120,120],[-120,120],[-250,-50],[-0.8,0.8],[-0.8,0.8],[-0.8,0.8]
  ];
  const DEFAULT_INITIAL_POSE = [0,0,-145,0,0,0];
  const DEFAULT_SCALES = [50,50,50,0.25,0.25,0.25];

  function assertVector(v,n,label){
    if(!Array.isArray(v) || v.length!==n || v.some(x=>!Number.isFinite(x)))
      throw new TypeError(label+' must be an array of '+n+' finite numbers');
  }

  function rotationMatrixFromVector(w){
    assertVector(w,3,'rotation vector');
    const theta=Math.hypot(w[0],w[1],w[2]);
    if(theta<1e-12) return [[1,0,0],[0,1,0],[0,0,1]];
    const x=w[0]/theta, y=w[1]/theta, z=w[2]/theta;
    const c=Math.cos(theta), s=Math.sin(theta), q=1-c;
    return [
      [c+x*x*q, x*y*q-z*s, x*z*q+y*s],
      [y*x*q+z*s, c+y*y*q, y*z*q-x*s],
      [z*x*q-y*s, z*y*q+x*s, c+z*z*q]
    ];
  }

  function poseToTransform(pose){
    assertVector(pose,6,'pose');
    const R=rotationMatrixFromVector(pose.slice(3));
    return [
      [R[0][0],R[0][1],R[0][2],pose[0]],
      [R[1][0],R[1][1],R[1][2],pose[1]],
      [R[2][0],R[2][1],R[2][2],pose[2]],
      [0,0,0,1]
    ];
  }

  function calculateStrutLengthsFromPose(pose, geometry){
    const T=poseToTransform(pose);
    return geometry.ptsDLocal.map((p,i)=>{
      const q=root.simTransformPoint(T,p), a=geometry.ptsPAbs[i];
      return Math.hypot(q[0]-a[0],q[1]-a[1],q[2]-a[2]);
    });
  }

  function squaredNorm(v){ return v.reduce((s,x)=>s+x*x,0); }

  function solveLinear(A,b){
    const n=b.length, M=A.map((r,i)=>r.slice().concat(b[i]));
    for(let k=0;k<n;k++){
      let pivot=k;
      for(let i=k+1;i<n;i++) if(Math.abs(M[i][k])>Math.abs(M[pivot][k])) pivot=i;
      if(Math.abs(M[pivot][k])<1e-14) return null;
      [M[k],M[pivot]]=[M[pivot],M[k]];
      const d=M[k][k];
      for(let j=k;j<=n;j++) M[k][j]/=d;
      for(let i=0;i<n;i++) if(i!==k){
        const f=M[i][k];
        for(let j=k;j<=n;j++) M[i][j]-=f*M[k][j];
      }
    }
    return M.map(r=>r[n]);
  }

  function solvePlatformPoseFromStrutLengths(lengths, options){
    options=options||{};
    assertVector(lengths,6,'strut lengths');
    if(typeof root.buildSimulationAttachmentPoints!=='function' || typeof root.simTransformPoint!=='function')
      throw new Error('Load shared.js before mechanics.js; shared geometry helpers are missing');

    const radius=options.anchorRadius===undefined?113.5:options.anchorRadius;
    const hardware=options.hardware||root.DEFAULT_SIMULATION_HARDWARE;
    const geometry=options.geometry||root.buildSimulationAttachmentPoints(radius,hardware);
    const bounds=options.bounds||DEFAULT_BOUNDS;
    const scales=options.scales||DEFAULT_SCALES;
    const initial=(options.initialPose||DEFAULT_INITIAL_POSE).slice();
    const maxIterations=options.maxIterations||160;
    const tolerance=options.tolerance===undefined?1e-9:options.tolerance;
    const lengthTolerance=options.lengthTolerance===undefined?1e-8:options.lengthTolerance;
    if(!Array.isArray(geometry.ptsPAbs)||geometry.ptsPAbs.length!==6||!Array.isArray(geometry.ptsDLocal)||geometry.ptsDLocal.length!==6)
      throw new Error('Mechanical geometry must contain six paired attachment points');
    if(!Array.isArray(bounds)||bounds.length!==6||!Array.isArray(scales)||scales.length!==6)
      throw new Error('Bounds and scales must each contain six entries');

    let p=initial.map((v,i)=>Math.max(bounds[i][0],Math.min(bounds[i][1],v)));
    const clamp=(v,i)=>Math.max(bounds[i][0],Math.min(bounds[i][1],v));
    const residual=pose=>calculateStrutLengthsFromPose(pose,geometry).map((v,i)=>v-lengths[i]);
    let r=residual(p), cost=squaredNorm(r), lambda=options.initialDamping||1e-3;
    let accepted=0, rejected=0, converged=false, reason='maximum-iterations';
    let iteration=0;

    for(;iteration<maxIterations;iteration++){
      const J=Array.from({length:6},()=>Array(6).fill(0));
      for(let j=0;j<6;j++){
        const h=(j<3?1e-3:1e-6)*scales[j];
        const plus=p.slice(), minus=p.slice();
        plus[j]=clamp(p[j]+h,j); minus[j]=clamp(p[j]-h,j);
        const denom=plus[j]-minus[j];
        if(Math.abs(denom)<1e-15) continue;
        const rp=residual(plus), rm=residual(minus);
        for(let i=0;i<6;i++) J[i][j]=(rp[i]-rm[i])/denom*scales[j];
      }
      const A=Array.from({length:6},()=>Array(6).fill(0));
      const g=Array(6).fill(0);
      for(let j=0;j<6;j++){
        for(let i=0;i<6;i++) g[j]+=J[i][j]*r[i];
        for(let k=0;k<6;k++) for(let i=0;i<6;i++) A[j][k]+=J[i][j]*J[i][k];
      }
      const gradMax=Math.max(...g.map(Math.abs));
      if(gradMax<tolerance){converged=true;reason='gradient-tolerance';break;}

      let acceptedThisRound=false;
      for(let trial=0;trial<14;trial++){
        const M=A.map((row,i)=>row.map((v,j)=>v+(i===j?lambda*Math.max(A[i][i],1e-8):0)));
        const delta=solveLinear(M,g.map(v=>-v));
        if(!delta){lambda*=10;rejected++;continue;}
        const candidate=p.map((v,i)=>clamp(v+delta[i]*scales[i],i));
        const stepNorm=Math.hypot(...candidate.map((v,i)=>(v-p[i])/scales[i]));
        if(stepNorm<1e-11){converged=true;reason='step-tolerance';acceptedThisRound=true;break;}
        const rc=residual(candidate), cc=squaredNorm(rc);
        if(Number.isFinite(cc)&&cc<cost){
          const improvement=cost-cc;
          p=candidate;r=rc;cost=cc;lambda=Math.max(lambda/3,1e-12);accepted++;acceptedThisRound=true;
          if(Math.sqrt(cost/6)<=lengthTolerance){converged=true;reason='length-residual-tolerance';}
          else if(improvement<=tolerance*Math.max(1,cost)){converged=true;reason='cost-improvement-tolerance';}
          break;
        }
        lambda*=10;rejected++;
      }
      if(converged) break;
      if(!acceptedThisRound){reason='no-improving-step';break;}
    }

    const predicted=calculateStrutLengthsFromPose(p,geometry);
    const errors=predicted.map((v,i)=>v-lengths[i]);
    const rms=Math.sqrt(squaredNorm(errors)/6);
    const maxAbs=Math.max(...errors.map(Math.abs));
    const success=converged || rms<=lengthTolerance;
    return {
      pose:p,
      transform:poseToTransform(p),
      predictedStrutLengths:predicted,
      residuals:errors,
      objective:squaredNorm(errors),
      residualRms:rms,
      residualMaxAbs:maxAbs,
      iterations:iteration,
      acceptedSteps:accepted,
      rejectedSteps:rejected,
      damping:lambda,
      success,
      converged:success,
      reason:success?(converged?reason:'length-residual-tolerance'):reason,
      parameterization:'translation-plus-rotation-vector',
      rotationConvention:'R=exp([w]x), column vectors, radians'
    };
  }

  const api={
    rotationMatrixFromVector,
    poseToTransform,
    calculateStrutLengthsFromPose,
    solvePlatformPoseFromStrutLengths
  };
  root.HexapodMechanics=api;
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
