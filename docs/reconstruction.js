/* ENGINE BUILD / VERSION IDENTIFICATION
   Build: R841
   Engine lineage/API version: R755-R636-MASTER-TAB-PORT-CANDIDATE
   Basis: renderer-neutral engine lineage with the R841 provisional
          sparse held-out cross-validation RMS gate set to 3.00 image pixels.
   This build marker identifies the supplied source revision; it does not
   claim clinical validation of the 3.00 px gate. See the R841 test result
   and handover notes for observed diagnostics and limitations.

   Historical implementation note (preserved):
*/
/* R441 — CALIBRATION-ONLY RECONSTRUCTION BOUNDARY
   Based on the current R256 renderer-neutral reconstruction engine.
   This revision adds only the calibration-only execution boundary.

   /* R458 — CLEANED RECONSTRUCTION ENGINE
   Baseline: R248 verified PBE/DBE + laterality regression.
   This file is the renderer-neutral inverse reconstruction engine.

   IMPORTANT CLINICAL GEOMETRY CONTRACT
   -------------------------------------
   Coordinate system is left-handed:
     +X = patient LEFT
     +Y = anterior
     +Z = proximal
   Positive 3-D rotation follows the left-hand rule.

   Anatomy observations:
     PFCL / DFCL = independently marked AP/LAT image lines, reconstructed
                   as 3-D projective-line intersections
     PRP / DRP   = independent proximal/distal reference points
     S1-DIR–S6-DIR = direction-only strut line observations in each view

   Bone axes are oriented with Method C toward positive world Z when
   unambiguous. Arbitrary line endpoints are not bone endpoints and are
   never used to infer bone length.

   The engine does not depend on VTK.js, Three.js, DOM, or SVG.
*/
"use strict";


window.Reconstruction = window.Reconstruction || {
};
const RECONSTRUCTION_ENGINE_BUILD = "R845-OFFLINE-SPARSE-DIRECTION-CANDIDATE";
const RECONSTRUCTION_ENGINE_VERSION = "R755-R636-MASTER-TAB-PORT-CANDIDATE";
const RECONSTRUCTION_SCHEMA = "XrayCompleteReconstructionInput";
const RECONSTRUCTION_SCHEMA_VERSION = "1.0";
const EPS = 1e-12;
function zeros(r,c) {
    return Array.from( {
        length:r
    },()=>Array(c).fill(0));
}
function identity(n) {
    const A=zeros(n,n);
    for(let i=0;
    i<n;
    i++)A[i][i]=1;
    return A;
}
function transpose(A) {
    return A[0].map((_,j)=>A.map(r=>r[j]));
}
function matMul(A,B) {
    const BT=transpose(B);
    return A.map(r=>BT.map(c=>r.reduce((s,v,k)=>s+v*c[k],0)));
}
function matVec(A,x) {
    return A.map(r=>r.reduce((s,v,i)=>s+v*x[i],0));
}
function dot(a,b) {
    return a.reduce((s,v,i)=>s+v*b[i],0);
}
function norm(a) {
    return Math.sqrt(dot(a,a));
}
function normalize(a) {
    const n=norm(a);
    if(n<EPS)throw new Error("Cannot normalize near-zero vector");
    return a.map(v=>v/n);
}
function add(a,b) {
    return a.map((v,i)=>v+b[i]);
}
function sub(a,b) {
    return a.map((v,i)=>v-b[i]);
}
function scale(a,s) {
    return a.map(v=>v*s);
}
function cross(a,b) {
    return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
}
function distance(a,b) {
    return norm(sub(a,b));
}
function clone(A) {
    return Array.isArray(A[0])?A.map(r=>r.slice()):A.slice();
}
function determinant3(A) {
    return A[0][0]*(A[1][1]*A[2][2]-A[1][2]*A[2][1])-A[0][1]*(A[1][0]*A[2][2]-A[1][2]*A[2][0])+A[0][2]*(A[1][0]*A[2][1]-A[1][1]*A[2][0]);
}
function inverse3(A) {
    const d=determinant3(A);
    if(Math.abs(d)<EPS)throw new Error("Singular 3x3 matrix");
    return[[(A[1][1]*A[2][2]-A[1][2]*A[2][1])/d,(A[0][2]*A[2][1]-A[0][1]*A[2][2])/d,(A[0][1]*A[1][2]-A[0][2]*A[1][1])/d],[(A[1][2]*A[2][0]-A[1][0]*A[2][2])/d,(A[0][0]*A[2][2]-A[0][2]*A[2][0])/d,(A[0][2]*A[1][0]-A[0][0]*A[1][2])/d],[(A[1][0]*A[2][1]-A[1][1]*A[2][0])/d,(A[0][1]*A[2][0]-A[0][0]*A[2][1])/d,(A[0][0]*A[1][1]-A[0][1]*A[1][0])/d]];
}
function solve3(A,b) {
    return matVec(inverse3(A),b);
}
/* Symmetric Jacobi eigen decomposition; used for the small DLT normal matrix. */
function symmetricEigen(A,maxIterations=20000,tolerance=1e-12) {
    const n=A.length,D=clone(A),V=identity(n);
    for(let iter=0;
    iter<maxIterations;
    iter++) {
        let p=0,q=1,max=Math.abs(D[0][1]);
        for(let i=0;
        i<n;
        i++)for(let j=i+1;
        j<n;
        j++) {
            const v=Math.abs(D[i][j]);
            if(v>max) {
                max=v;
                p=i;
                q=j;
            }
        }
        if(max<tolerance)break;
        const app=D[p][p],aqq=D[q][q],apq=D[p][q];
        const phi=.5*Math.atan2(2*apq,aqq-app),c=Math.cos(phi),s=Math.sin(phi);
        for(let k=0;
        k<n;
        k++)if(k!==p&&k!==q) {
            const dkp=D[k][p],dkq=D[k][q];
            D[k][p]=D[p][k]=c*dkp-s*dkq;
            D[k][q]=D[q][k]=s*dkp+c*dkq;
        }
        D[p][p]=c*c*app-2*s*c*apq+s*s*aqq;
        D[q][q]=s*s*app+2*s*c*apq+c*c*aqq;
        D[p][q]=D[q][p]=0;
        for(let k=0;
        k<n;
        k++) {
            const vkp=V[k][p],vkq=V[k][q];
            V[k][p]=c*vkp-s*vkq;
            V[k][q]=s*vkp+c*vkq;
        }
    }
    const values=Array.from( {
        length:n
    },(_,i)=>D[i][i]);
    const order=values.map((v,i)=>i).sort((a,b)=>values[a]-values[b]);
    return {
        values:order.map(i=>values[i]),vectors:order.map(i=>V.map(r=>r[i]))
    };
}
function nullspaceVector(A) {
    const At=transpose(A),N=matMul(At,A),eig=symmetricEigen(N),v=eig.vectors[0];
    return normalize(v);
}
function normalize2D(points) {
    const c=[points.reduce((s,p)=>s+p[0],0)/points.length,points.reduce((s,p)=>s+p[1],0)/points.length];
    const md=points.reduce((s,p)=>s+Math.hypot(p[0]-c[0],p[1]-c[1]),0)/points.length;
    const k=md>EPS?Math.SQRT2/md:1;
    return {
        points:points.map(p=>[(p[0]-c[0])*k,(p[1]-c[1])*k]),T:[[k,0,-k*c[0]],[0,k,-k*c[1]],[0,0,1]]
    };
}
function normalize3D(points) {
    const c=[0,0,0];
    for(const p of points)for(let i=0;
    i<3;
    i++)c[i]+=p[i]/points.length;
    const md=points.reduce((s,p)=>s+Math.hypot(p[0]-c[0],p[1]-c[1],p[2]-c[2]),0)/points.length;
    const k=md>EPS?Math.sqrt(3)/md:1;
    return {
        points:points.map(p=>[(p[0]-c[0])*k,(p[1]-c[1])*k,(p[2]-c[2])*k]),T:[[k,0,0,-k*c[0]],[0,k,0,-k*c[1]],[0,0,k,-k*c[2]],[0,0,0,1]]
    };
}
function solveProjectiveCamera(points3D,points2D) {
    if(points3D.length!==points2D.length||points3D.length<6)throw new Error("Camera calibration requires >=6 3D/2D correspondences");
    const X=normalize3D(points3D),x=normalize2D(points2D),A=[];
    for(let i=0;
    i<points3D.length;
    i++) {
        const q=[...X.points[i],1],[u,v]=x.points[i];
        A.push([...q,0,0,0,0,-u*q[0],-u*q[1],-u*q[2],-u*q[3]]);
        A.push([0,0,0,0,...q,-v*q[0],-v*q[1],-v*q[2],-v*q[3]]);
    }
    const p=nullspaceVector(A),Pn=[p.slice(0,4),p.slice(4,8),p.slice(8,12)];
    const P=matMul(matMul(inverse3(x.T),Pn),X.T),s=norm(P.flat());
    const camera=P.map(r=>r.map(v=>v/s));
    const residuals=points3D.map((X3,i)=>distance(projectPoint(camera,X3),points2D[i]));
    return {
        P:camera,residuals,rms:Math.sqrt(residuals.reduce((s,v)=>s+v*v,0)/residuals.length),max:Math.max(...residuals)
    };
}
function projectPoint(P,p) {
    const q=matVec(P,[p[0],p[1],p[2],1]);
    if(Math.abs(q[2])<EPS)throw new Error("Point projects at infinity");
    return[q[0]/q[2],q[1]/q[2]];
}
function projectPoints(P,pts) {
    return pts.map(p=>projectPoint(P,p));
}
function dehomogenize(x) {
    if(Math.abs(x[x.length-1])<EPS)throw new Error("Point at infinity");
    return x.slice(0,-1).map(v=>v/x[x.length-1]);
}
function cameraCenter(P) {
    // Directly solve M*C = -p. This avoids the small homogeneous-nullspace
    // numerical residual previously observed at the proximal endpoint.
    const M=[[P[0][0],P[0][1],P[0][2]],
             [P[1][0],P[1][1],P[1][2]],
             [P[2][0],P[2][1],P[2][2]]];
    const p=[P[0][3],P[1][3],P[2][3]];
    return scale(solve3(M,p),-1);
}
function backProjectRay(P,xy) {
    const C=cameraCenter(P),u=xy[0],v=xy[1];
    const a=[u*P[2][0]-P[0][0],u*P[2][1]-P[0][1],u*P[2][2]-P[0][2]],b=[v*P[2][0]-P[1][0],v*P[2][1]-P[1][1],v*P[2][2]-P[1][2]];
    return {
        origin:C,direction:normalize(cross(a,b))
    };
}
function triangulatePoint(P1,P2,x1,x2) {
    const r1=backProjectRay(P1,x1),r2=backProjectRay(P2,x2),u=normalize(r1.direction),v=normalize(r2.direction),w=sub(r1.origin,r2.origin),a=dot(u,u),b=dot(u,v),c=dot(v,v),d=dot(u,w),e=dot(v,w),den=a*c-b*b;
    let s,t;
    if(Math.abs(den)<EPS) {
        s=0;
        t=e/c;
    }else {
        s=(b*e-c*d)/den;
        t=(a*e-b*d)/den;
    }
    const p1=add(r1.origin,scale(u,s)),p2=add(r2.origin,scale(v,t)),p=scale(add(p1,p2),.5);
    return {
        point:p,raySeparation:distance(p1,p2),reprojectionError: {
            view1:distance(projectPoint(P1,p),x1),view2:distance(projectPoint(P2,p),x2)
        }
    };
}
function triangulate(P1,P2,a,b) {
    return a.map((p,i)=>triangulatePoint(P1,P2,p,b[i]));
}

/* R552 — Same approach: an image line back-projects to a 3-D plane.
   Intersect AP/LAT planes to recover an undirected 3-D line. Endpoints are
   used only within each image to define its line; they are never paired
   across views. */
function imageLineFromPoints(a,b) {
    if(!Array.isArray(a)||!Array.isArray(b)||a.length<2||b.length<2) throw new Error("R552 invalid image-line endpoints");
    const p=[Number(a[0]),Number(a[1]),1],q=[Number(b[0]),Number(b[1]),1];
    if(!p.concat(q).every(Number.isFinite)) throw new Error("R552 non-finite image-line endpoint");
    const l=cross(p,q),n=norm(l);
    if(n<EPS) throw new Error("R552 degenerate image line");
    return scale(l,1/n);
}
function backProjectImageLine(P,a,b) {
    const l=imageLineFromPoints(a,b);
    const plane=matVec(transpose(P),l);
    const nn=norm(plane.slice(0,3));
    if(nn<EPS) throw new Error("R552 image line does not define a stable back-projection plane");
    return scale(plane,1/nn);
}
function reconstructProjectiveLine(Pap,Plat,apA,apB,latA,latB) {
    const p1=backProjectImageLine(Pap,apA,apB),p2=backProjectImageLine(Plat,latA,latB);
    const n1=p1.slice(0,3),n2=p2.slice(0,3),directionRaw=cross(n1,n2),den=dot(directionRaw,directionRaw);
    if(!Number.isFinite(den)||den<1e-12) throw new Error("R552 AP/LAT back-projection planes are parallel or ill-conditioned");
    const direction=normalize(directionRaw),c1=p1[3],c2=p2[3];
    const origin=scale(cross(sub(scale(n1,c2),scale(n2,c1)),directionRaw),1/den);
    const planeResiduals=[Math.abs(dot(n1,origin)+c1),Math.abs(dot(n2,origin)+c2)];
    const planeNormalCrossNorm=Math.sqrt(den);
    const planeNormalAngleDeg=Math.acos(Math.max(-1,Math.min(1,Math.abs(dot(n1,n2)))))*180/Math.PI;
    return {origin,direction,planeResiduals,planeNormalCrossNorm,planeNormalAngleDeg,
        conditioningStatus:den<1e-10?"near-parallel-low-confidence":"well-conditioned",
        geometry:"undirected-3d-line",endpointCorrespondenceUsed:false};
}
function orientAxisTowardPositiveZ(direction,epsilon=1e-8) {
    const u=normalize(direction);
    if(Math.abs(u[2])<epsilon) return {direction:u,resolved:false,status:"ambiguous-near-horizontal-world-Z"};
    const sign=u[2]>0?1:-1;
    return {direction:scale(u,sign),resolved:true,status:"oriented-toward-positive-world-Z"};
}
function reconstructAnatomyLine(Pap,Plat,o) {
    const line=reconstructProjectiveLine(Pap,Plat,o.AP.pointA,o.AP.pointB,o.LAT.pointA,o.LAT.pointB);
    const oriented=orientAxisTowardPositiveZ(line.direction);
    const conditioningPass=line.conditioningStatus==="well-conditioned";
    return {...line,orientedDirection:oriented.direction,orientationResolved:oriented.resolved&&conditioningPass,
        orientationStatus:conditioningPass?oriented.status:"ambiguous-near-parallel-low-confidence"};
}
function fitLine(points) {
    if(points.length<2)throw new Error("At least two points required");
    const c=[0,0,0];
    for(const p of points)for(let i=0;
    i<3;
    i++)c[i]+=p[i]/points.length;
    const C=zeros(3,3);
    for(const p of points) {
        const d=sub(p,c);
        for(let i=0;
        i<3;
        i++)for(let j=0;
        j<3;
        j++)C[i][j]+=d[i]*d[j];
    }
    const e=symmetricEigen(C),dir=normalize(e.vectors[2]);
    return {
        origin:c,direction:dir,residuals:points.map(p=>norm(cross(sub(p,c),dir))),rms:Math.sqrt(points.reduce((s,p)=>s+Math.pow(norm(cross(sub(p,c),dir)),2),0)/points.length)
    };
}
function centroid(pts) {
    const c=[0,0,0];
    for(const p of pts)for(let i=0;
    i<3;
    i++)c[i]+=p[i]/pts.length;
    return c;
}
function svd3(A) {
    const e=symmetricEigen(matMul(transpose(A),A)),V=transpose(e.vectors),sv=e.values.map(v=>Math.sqrt(Math.max(0,v))),U=zeros(3,3);
    for(let i=0;
    i<3;
    i++) {
        if(sv[i]>EPS) {
            const u=normalize(matVec(A,e.vectors[i]));
            for(let r=0;
            r<3;
            r++)U[r][i]=u[r];
        }
    }
    for(let i=0;
    i<3;
    i++) {
        let u=[U[0][i],U[1][i],U[2][i]];
        for(let j=0;
        j<i;
        j++) {
            const q=[U[0][j],U[1][j],U[2][j]];
            u=sub(u,scale(q,dot(u,q)));
        }
        if(norm(u)<EPS) {
            u=i===0?[1,0,0]:i===1?normalize(cross([U[0][0],U[1][0],U[2][0]],[0,0,1])):normalize(cross([U[0][0],U[1][0],U[2][0]],[U[0][1],U[1][1],U[2][1]]));
        }
        u=normalize(u);
        for(let r=0;
        r<3;
        r++)U[r][i]=u[r];
    }
    return {
        U,V
    };
}
function quaternionToMatrix(q){
    const [w,x,y,z]=q;
    return [
        [1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],
        [2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],
        [2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]
    ];
}
function rigidRegistration(source,target) {
    if(source.length!==target.length||source.length<3)throw new Error("Rigid registration requires >=3 correspondences");
    const cs=centroid(source),ct=centroid(target),X=source.map(p=>sub(p,cs)),Y=target.map(p=>sub(p,ct));
    let S=zeros(3,3);
    for(let k=0;k<X.length;k++)for(let i=0;i<3;i++)for(let j=0;j<3;j++)S[i][j]+=X[k][i]*Y[k][j];
    const [sxx,sxy,sxz]=S[0], [syx,syy,syz]=S[1], [szx,szy,szz]=S[2];
    const N=[
        [sxx+syy+szz, syz-szy, szx-sxz, sxy-syx],
        [syz-szy, sxx-syy-szz, sxy+syx, szx+sxz],
        [szx-sxz, sxy+syx, -sxx+syy-szz, syz+szy],
        [sxy-syx, szx+sxz, syz+szy, -sxx-syy+szz]
    ];
    const eig=symmetricEigen(N),q=eig.vectors[3];
    const R=quaternionToMatrix(normalize(q));
    if(determinant3(R)<0)throw new Error("Rigid registration produced a reflection");
    const t=sub(ct,matVec(R,cs)),res=source.map((p,i)=>distance(add(matVec(R,p),t),target[i]));
    return {R,t,residuals:res,rms:Math.sqrt(res.reduce((s,v)=>s+v*v,0)/res.length),max:Math.max(...res)};
}
function eulerZXY(R) {
    return {
        z:Math.atan2(-R[0][1],R[1][1])*180/Math.PI,x:Math.atan2(R[2][1],R[2][2])*180/Math.PI,y:Math.asin(Math.max(-1,Math.min(1,-R[2][0])))*180/Math.PI
    };
}
function mat4(R,t) {
    return {
        R,t
    };
}
function transformPose(T,p) {
    return add(matVec(T.R,p),T.t);
}
function inversePose(T) {
    const R=transpose(T.R);
    return {
        R,t:scale(matVec(R,T.t),-1)
    };
}
function composePose(A,B) {
    return {
        R:matMul(A.R,B.R),t:add(matVec(A.R,B.t),A.t)
    };
}
function angleError(a,b) {
    return Math.acos(Math.max(-1,Math.min(1,Math.abs(dot(normalize(a),normalize(b))))))*180/Math.PI;
}
function mapSigned(value,pos,neg) {
    const n=Number(value);
    const magnitude=Math.abs(n);
    const zero=n===0;
    return {
        value:magnitude,
        direction:zero ? null : (n>0 ? pos : neg)
    };
}
function normalizeLaterality(input) {
    const raw=input?.laterality ?? input?.patient?.laterality ?? input?.metadata?.laterality ?? null;
    if(raw==null)return null;
    const v=String(raw).trim().toLowerCase();
    if(v==="right"||v==="r")return "right";
    if(v==="left"||v==="l")return "left";
    return null;
}
function projectedAxisXZ(v) {
    const p=[v[0],v[2]];
    const n=Math.hypot(p[0],p[1]);
    if(n<EPS)throw new Error("Axis has no AP projection");
    return [p[0]/n,p[1]/n];
}
function projectedAxisYZ(v) {
    const p=[v[1],v[2]];
    const n=Math.hypot(p[0],p[1]);
    if(n<EPS)throw new Error("Axis has no LAT projection");
    return [p[0]/n,p[1]/n];
}
function orientProjectedAxisToReference(p,d) {
    return (p[0]*d[0]+p[1]*d[1])<0 ? [-d[0],-d[1]] : d;
}
function signedProjectedAngleDeg(p,d) {
    const cross2=p[0]*d[1]-p[1]*d[0];
    const dot2=Math.max(-1,Math.min(1,p[0]*d[0]+p[1]*d[1]));
    return {
        signedDeg:Math.atan2(cross2,dot2)*180/Math.PI,
        magnitudeDeg:Math.abs(Math.atan2(cross2,dot2)*180/Math.PI)
    };
}
function clinicalAPAngulation(proxAxis,distAxis,laterality) {
    const p=projectedAxisXZ(normalize(proxAxis));
    const d=orientProjectedAxisToReference(p,projectedAxisXZ(normalize(distAxis)));
    const a=signedProjectedAngleDeg(p,d);
    const zero=a.signedDeg === 0;
    let direction=null;
    if(!zero){
        if(laterality==="right")direction=a.signedDeg<0?"valgus":"varus";
        else if(laterality==="left")direction=a.signedDeg<0?"varus":"valgus";
    }
    return {
        value:zero ? 0 : a.magnitudeDeg,
        direction,
        signedDeg:zero ? 0 : a.signedDeg
    };
}
function clinicalLATAngulation(proxAxis,distAxis) {
    const p=projectedAxisYZ(normalize(proxAxis));
    const d=orientProjectedAxisToReference(p,projectedAxisYZ(normalize(distAxis)));
    const a=signedProjectedAngleDeg(p,d);
    const zero=a.signedDeg === 0;
    return {
        value:zero ? 0 : a.magnitudeDeg,
        direction:zero
            ? null
            : (a.signedDeg<0 ? "anterior" : "posterior"),
        signedDeg:zero ? 0 : a.signedDeg
    };
}
function sideTiltDeg(sideVector,proxAxis) {
    const s=normalize(sideVector),a=normalize(proxAxis);
    const axial=dot(s,a);
    const signedDeg=Math.asin(Math.max(-1,Math.min(1,axial)))*180/Math.PI;
    const zero=signedDeg === 0;
    return {
        value:zero ? 0 : Math.abs(signedDeg),
        direction:zero ? null : (axial>0 ? "proximal" : "distal"),
        signedDeg:zero ? 0 : signedDeg
    };
}
function signedPlaneRotationDeg(referenceNormal,rotatedNormal,axis) {
    const r=normalize(referenceNormal),q=normalize(rotatedNormal),a=normalize(axis);
    return Math.atan2(dot(a,cross(r,q)),Math.max(-1,Math.min(1,dot(r,q))))*180/Math.PI;
}
function calculateMasterTabRotation(masterRadialWorld,ringAxisWorld,fragmentAnteriorWorld,proxAxisWorld,laterality){
    const vectors=[masterRadialWorld,ringAxisWorld,fragmentAnteriorWorld,proxAxisWorld];
    if(vectors.some(v=>!Array.isArray(v)||v.length!==3||!v.every(Number.isFinite)||norm(v)<EPS)){
        return {value:null,direction:null,source:"undetermined",reason:"Master Tab radial direction, ring axis, or patient-anterior reference is not observable."};
    }
    const masterRadial=normalize(masterRadialWorld);
    const ringAxis=normalize(ringAxisWorld);
    const fragmentAnterior=normalize(fragmentAnteriorWorld);
    const proxAxis=normalize(proxAxisWorld);
    const ringSagittalNormal=normalize(cross(masterRadial,ringAxis));
    const fragmentSagittalNormal=normalize(cross(fragmentAnterior,proxAxis));
    const measuredSigned=signedPlaneRotationDeg(fragmentSagittalNormal,ringSagittalNormal,proxAxis);
    // R636: remove registration/triangulation round-off at the zero-angle
    // boundary so a true 0° reference is reported as direction=null, not as
    // an arbitrary internal/external direction from a ~1e-12° residue.
    const signed=Math.abs(measuredSigned)<1e-8?0:measuredSigned;
    const mapped=laterality === "left"
        ? mapSigned(signed,"external","internal")
        : mapSigned(signed,"internal","external");
    return {...mapped,source:"hardware-derived-ring-pose",reference:"proximal-ring-centre-to-Master-Tab-centre-hole",angleReference:"patient-anterior"};
}
/* ---------------------------------------------------------------------------
Complete renderer-neutral observation contract
--------------------------------------------------------------------------- */
function createCompleteObservationInput() {
    return {
        schema:RECONSTRUCTION_SCHEMA,schemaVersion:RECONSTRUCTION_SCHEMA_VERSION,images: {
            AP: {
                id:"AP",coordinateSystem:"imageIndex",unit:"pixel"
            },LAT: {
                id:"LAT",coordinateSystem:"imageIndex",unit:"pixel"
            }
        },calibration: {
            AP:[],LAT:[]
        },struts:[],anatomy: {
            PFCL:null,PRP:null,DFCL:null,DRP:null,proximalOrientationReference:null,masterTabReference:null,LOC:null
        },manualClinical: {
            axialRotationDeg:null,source:null
        },recordedStrutLengthsMm:[]
    };
}
function extractCalibration(input,view) {
    return input.calibration[view].map(o=>( {
        model3D:o.model3D,image2D:o.image2D
    }));
}
function reconstructAnatomyPoint(Pap,Plat,o) {
    const r=triangulatePoint(Pap,Plat,o.AP,o.LAT);
    return r;
}
function mergeSemanticViewField(ap,lat,key){
    const A=ap?.anatomy?.[key] || null;
    const L=lat?.anatomy?.[key] || null;
    if(!A && !L) return null;
    const out={};
    if(A?.AP) out.AP=A.AP;
    if(L?.LAT) out.LAT=L.LAT;
    return Object.keys(out).length ? out : null;
}
function mergeSemanticAnatomy(ap,lat){
    return {
        PFCL:mergeSemanticViewField(ap,lat,'PFCL'),
        PRP:mergeSemanticViewField(ap,lat,'PRP'),
        DFCL:mergeSemanticViewField(ap,lat,'DFCL'),
        DRP:mergeSemanticViewField(ap,lat,'DRP'),
        proximalOrientationReference:mergeSemanticViewField(ap,lat,'proximalOrientationReference'),
        masterTabReference:mergeSemanticViewField(ap,lat,'masterTabReference'),
        LOC:mergeSemanticViewField(ap,lat,'LOC')
    };
}
function mergeSemanticClinical(ap,lat,set){
    const c=ap?.manualClinical || lat?.manualClinical || set?.manualClinical || null;
    return c ? {
        axialRotationDeg:c.axialRotationDeg ?? null,
        source:c.source ?? null,
        direction:c.direction ?? null
    } : {axialRotationDeg:null,source:null,direction:null};
}
/* ---------------------------------------------------------------------------
   R486 — CLEAN SPARSE OBSERVATION BOUNDARY
   ---------------------------------------------------------------------------
   This is the first implementation step of the new sparse reconstruction
   engine.

   HARD RULE:
       Only renderer-neutral 2-D X-ray observations may cross into the sparse
       inverse solver.

   Explicitly excluded from the sparse solver input:
       calibration[]
       anatomy[]
       model3D
       truth / CASE
       synthetic camera matrices
       frame poses
       precomputed 3-D geometry
       renderer objects

   The raw caller object is NEVER forwarded to the sparse solver.  A new
   sanitized observation object is constructed field-by-field.

   R486 deliberately does NOT claim reconstruction success yet.  The next
   stage will consume ONLY this sanitized object.
   --------------------------------------------------------------------------- */

const SPARSE_OBSERVATION_VERSION = "xray-sparse-observation-v1";

function sparseNumberPair(value, label) {
    if(!Array.isArray(value) || value.length < 2 ||
       !Number.isFinite(Number(value[0])) || !Number.isFinite(Number(value[1]))) {
        throw new Error(`Invalid 2-D ${label}`);
    }
    return [Number(value[0]), Number(value[1])];
}

function sparsePointGeometry(source) {
    const p = source?.point;
    if(!p) return null;
    // R817 found that physical-space coordinates could be silently relabelled as
    // image-index pixels when `image` was absent. Require the declared image field;
    // do not change coordinate systems or the downstream solver math.
    const image = sparseNumberPair(p.image, "point image-index coordinates");
    return {image};
}

function sparseLineGeometry(source) {
    const a = source?.pointA;
    const b = source?.pointB;
    if(!a || !b) return null;
    // R817 found the same coordinate-system fallback for line endpoints. Preserve
    // native image-index semantics and reject physical-only endpoint payloads.
    return {
        pointA:{image:sparseNumberPair(a.image, "pointA image-index coordinates")},
        pointB:{image:sparseNumberPair(b.image, "pointB image-index coordinates")}
    };
}

function sanitizeSparseAnnotation(annotation, view) {
    if(!annotation || typeof annotation !== "object") {
        throw new Error(`Invalid ${view} annotation`);
    }

    const geometryType = annotation.geometry === "line" ||
                         annotation.geometry === "point"
        ? annotation.geometry
        : null;
    if(!geometryType) throw new Error(`Annotation ${annotation.id || "unknown"} has no supported geometry type`);

    const geometry = geometryType === "point"
        ? sparsePointGeometry(annotation)
        : sparseLineGeometry(annotation);
    if(!geometry) throw new Error(`Annotation ${annotation.id || "unknown"} has invalid 2-D geometry`);

    const out = {
        id: annotation.id == null ? null : String(annotation.id),
        code: annotation.code == null ? null : String(annotation.code),
        role: annotation.role == null ? null : String(annotation.role),
        geometry: geometryType,
        status: annotation.status == null ? null : String(annotation.status),
        view,
        imageId: annotation.imageId == null ? null : String(annotation.imageId),
        geometry2D: geometry
    };

    if(annotation.coordinateSystems && typeof annotation.coordinateSystems === "object") {
        const cs = {};
        if(annotation.coordinateSystems.image) {
            cs.image = {
                axes:Array.isArray(annotation.coordinateSystems.image.axes)
                    ? annotation.coordinateSystems.image.axes.slice(0,2).map(String) : ["u","v"],
                unit:annotation.coordinateSystems.image.unit == null
                    ? null : String(annotation.coordinateSystems.image.unit)
            };
        }
        if(Object.keys(cs).length) out.coordinateSystems = cs;
    }

    if(annotation.confidence != null && Number.isFinite(Number(annotation.confidence))) {
        out.confidence = Number(annotation.confidence);
    }

    /* Provenance is metadata only.  Never copy arbitrary nested objects. */
    if(annotation.provenance && typeof annotation.provenance === "object") {
        out.provenance = {
            source:annotation.provenance.source == null ? null : String(annotation.provenance.source),
            renderer:annotation.provenance.renderer == null ? null : String(annotation.provenance.renderer),
            interaction:annotation.provenance.interaction == null ? null : String(annotation.provenance.interaction)
        };
    }

    return out;
}

function sanitizeSparseImage(view, expectedView) {
    if(!view || typeof view !== "object") return null;
    const image = Array.isArray(view.images) ? view.images[0] : null;
    if(!image || typeof image !== "object") return {
        id:null, view:expectedView
    };

    const out = {
        id:image.id == null ? null : String(image.id),
        view:expectedView,
        width:Number.isFinite(Number(image.width)) ? Number(image.width) : null,
        height:Number.isFinite(Number(image.height)) ? Number(image.height) : null,
        coordinateSystem:image.imageCoordinateSystem ? {
            axes:Array.isArray(image.imageCoordinateSystem.axes)
                ? image.imageCoordinateSystem.axes.slice(0,2).map(String) : ["u","v"],
            origin:image.imageCoordinateSystem.origin == null
                ? null : String(image.imageCoordinateSystem.origin),
            convention:image.imageCoordinateSystem.convention == null
                ? null : String(image.imageCoordinateSystem.convention)
        } : null,
        pixelSpacing:Array.isArray(image.pixelSpacing)
            ? image.pixelSpacing.slice(0,2).map(Number) : null,
        pixelSpacingUnit:image.pixelSpacingUnit == null ? null : String(image.pixelSpacingUnit),
    };
    return out;
}

function sanitizeObservationView(view, expectedView) {
    if(!view) return null;
    if(view.version !== "xray-observation-v2") {
        throw new Error(`${expectedView} does not contain xray-observation-v2`);
    }
    const image=sanitizeSparseImage(view, expectedView);
    const annotations = Array.isArray(view.annotations)
        ? view.annotations.map(a=>sanitizeSparseAnnotation(a, expectedView))
        : [];
    return {
        version:"xray-observation-v2",
        image,
        annotations,
        laterality:view.laterality == null ? null : String(view.laterality)
    };
}

function sanitizeSparseObservationSet(input) {
    if(!input || input.version !== "xray-observation-set-v2") {
        throw new Error("R486 — expected xray-observation-set-v2");
    }
    // R817 showed that direct sanitizer calls bypassed the public reconstruction
    // contract gate. Apply the same sparse contract here so malformed inputs cannot
    // enter the sanitized solver boundary through the exported helper. Sparse
    // subsets remain permitted; this does not require all semantic codes per view.
    validateR815ObservationContract(input);

    const AP = sanitizeObservationView(input.AP, "AP");
    const LAT = sanitizeObservationView(input.LAT, "LAT");

    const sanitized = {
        version:SPARSE_OBSERVATION_VERSION,
        views:{AP,LAT},
        provenance:{
            source:"XrayObservation v2",
            contract:"renderer-neutral-semantic-v2",
            sanitizedBy:RECONSTRUCTION_ENGINE_VERSION
        }
    };

    return sanitized;
}

function sparseObservationInventory(set) {
    const inventory={AP:{points:[],lines:[],directions:[],codes:[]},LAT:{points:[],lines:[],directions:[],codes:[]}};
    for(const view of ["AP","LAT"]) {
        const annotations=set.views[view]?.annotations || [];
        for(const a of annotations) {
            inventory[view].codes.push(a.code);
            if(a.geometry === "line"){
                inventory[view].lines.push(a.code);
                if(/^S[1-6]-DIR$/.test(String(a.code||""))) inventory[view].directions.push(a.code);
            } else inventory[view].points.push(a.code);
        }
    }
    return inventory;
}


/* ---------------------------------------------------------------------------
   Physical sparse frame/camera solver

   Reference gauge:
     proximal ring local coordinate system == reconstruction world frame.

   Unknowns:
     AP camera pose      6
     LAT camera pose     6
     distal ring pose    6

   The observation contract supplies only image coordinates + semantic codes.
   Hardware local coordinates are an internal authoritative model.
--------------------------------------------------------------------------- */
const SPARSE_CAMERA_INTRINSICS=Object.freeze({fx:800,fy:800,cx:320,cy:240});
const SPARSE_HARDWARE=Object.freeze({anchorRadiusMm:113.5,holeStepDeg:7.5,proximalZ:-17,distalZ:17});

function sparseHardwarePoint(tabDeg,sign,z){
    const a=(tabDeg+sign*SPARSE_HARDWARE.holeStepDeg)*Math.PI/180;
    return [SPARSE_HARDWARE.anchorRadiusMm*Math.cos(a),SPARSE_HARDWARE.anchorRadiusMm*Math.sin(a),z];
}
function sparseHardwareTopology(){
    return {
        S1:{P:sparseHardwarePoint(90,+1,-17),D:sparseHardwarePoint(150,-1,17)},
        S2:{P:sparseHardwarePoint(90,-1,-17),D:sparseHardwarePoint(30,+1,17)},
        S3:{P:sparseHardwarePoint(330,+1,-17),D:sparseHardwarePoint(30,-1,17)},
        S4:{P:sparseHardwarePoint(330,-1,-17),D:sparseHardwarePoint(270,+1,17)},
        S5:{P:sparseHardwarePoint(210,+1,-17),D:sparseHardwarePoint(270,-1,17)},
        S6:{P:sparseHardwarePoint(210,-1,-17),D:sparseHardwarePoint(150,+1,17)}
    };
}
function sparseRotVecToMatrix(v){
    const a=norm(v);
    if(a<EPS)return identity(3);
    const x=v[0]/a,y=v[1]/a,z=v[2]/a,c=Math.cos(a),s=Math.sin(a),q=1-c;
    return [
        [c+x*x*q,x*y*q-z*s,x*z*q+y*s],
        [y*x*q+z*s,c+y*y*q,y*z*q-x*s],
        [z*x*q-y*s,z*y*q+x*s,c+z*z*q]
    ];
}
function sparseCameraMatrix(center,rotVec,baseAxes,principalOffset=[0,0],focalPx=SPARSE_CAMERA_INTRINSICS.fx){
    const Q=sparseRotVecToMatrix(rotVec);
    const axes=baseAxes.map(a=>matVec(Q,a));
    const r=axes[0],u=axes[1],d=axes[2];
    const K={fx:focalPx,fy:focalPx,
        cx:SPARSE_CAMERA_INTRINSICS.cx+principalOffset[0],
        cy:SPARSE_CAMERA_INTRINSICS.cy+principalOffset[1]};
    const t=[-dot(r,center),-dot(u,center),-dot(d,center)];
    return [
        [K.fx*r[0]+K.cx*d[0],K.fx*r[1]+K.cx*d[1],K.fx*r[2]+K.cx*d[2],K.fx*t[0]+K.cx*t[2]],
        [K.fy*u[0]+K.cy*d[0],K.fy*u[1]+K.cy*d[1],K.fy*u[2]+K.cy*d[2],K.fy*t[1]+K.cy*t[2]],
        [d[0],d[1],d[2],t[2]]
    ];
}
const SPARSE_AP_BASE=[[1,0,0],[0,0,-1],[0,-1,0]];
const SPARSE_LAT_BASE_RIGHT=[[0,-1,0],[0,0,-1],[-1,0,0]];
const SPARSE_LAT_BASE_LEFT=[[0,1,0],[0,0,-1],[1,0,0]];

function sparsePosePoint(pose,p){return add(matVec(pose.R,p),pose.t);}
function sparseParameterToState(x){
    return {
        AP:{center:x.slice(0,3),rot:x.slice(3,6)},
        LAT:{center:x.slice(6,9),rot:x.slice(9,12)},
        distal:{t:x.slice(12,15),rot:x.slice(15,18)},
        principalOffset:{AP:x.slice(18,20),LAT:x.slice(20,22)},
        focalPx:Math.exp(x[22])
    };
}
function sparseStateToCameras(state,laterality="right"){
    const latBase=laterality==="left"?SPARSE_LAT_BASE_LEFT:SPARSE_LAT_BASE_RIGHT;
    return {
        AP:sparseCameraMatrix(state.AP.center,state.AP.rot,SPARSE_AP_BASE,state.principalOffset?.AP||[0,0],state.focalPx),
        LAT:sparseCameraMatrix(state.LAT.center,state.LAT.rot,latBase,state.principalOffset?.LAT||[0,0],state.focalPx)
    };
}
function sparseObservationPoints(sparse){
    const topology=sparseHardwareTopology(),out=[];
    for(const viewName of ['AP','LAT']){
        const anns=sparse.views[viewName]?.annotations || [];
        for(const a of anns){
            if(!a || a.geometry!=='point' || !/^S[1-6]-[PD]$/.test(String(a.code||'')))continue;
            const id=a.code.slice(0,2),side=a.code.slice(3);
            const xy=Array.isArray(a.geometry2D?.image) ? a.geometry2D.image : null;
            if(!xy || xy.length<2 || !Number.isFinite(Number(xy[0])) || !Number.isFinite(Number(xy[1])))continue;
            out.push({view:viewName,code:a.code,xy:[Number(xy[0]),Number(xy[1])],local:side==='P'?topology[id].P:topology[id].D,side});
        }
    }
    return out;
}
function sparseObservationDirections(sparse){
    const topology=sparseHardwareTopology(),out=[];
    for(const viewName of ["AP","LAT"]){
        for(const a of (sparse.views[viewName]?.annotations||[])){
            const m=String(a?.code||"").match(/^(S[1-6])-DIR$/);
            if(!m||a.geometry!=="line") continue;
            const pa=a.geometry2D?.pointA?.image,pb=a.geometry2D?.pointB?.image;
            if(!Array.isArray(pa)||!Array.isArray(pb)) throw new Error(`R552 ${a.code} direction observation has invalid endpoints`);
            const observed=sub([Number(pb[0]),Number(pb[1])],[Number(pa[0]),Number(pa[1])]);
            const length=norm(observed);
            if(!observed.every(Number.isFinite)||!Number.isFinite(length)||length<1e-6) throw new Error(`R552 ${a.code} direction observation is degenerate`);
            out.push({view:viewName,code:a.code,strutId:m[1],a:[Number(pa[0]),Number(pa[1])],b:[Number(pb[0]),Number(pb[1])],direction:scale(observed,1/length),length,proximal:topology[m[1]].P,distal:topology[m[1]].D});
        }
    }
    return out;
}
function sparseResidualVector(params,obs,directionObs=[],laterality="right"){
    const state=sparseParameterToState(params),cams=sparseStateToCameras(state,laterality),res=[];
    const distalPose={R:sparseRotVecToMatrix(state.distal.rot),t:state.distal.t};
    for(const o of obs){
        const world=o.side==='P' ? o.local : sparsePosePoint(distalPose,o.local);
        const q=projectPoint(cams[o.view],world);
        res.push(q[0]-o.xy[0],q[1]-o.xy[1]);
    }
    /* A DIR annotation constrains projected orientation, not line offset. */
    for(const o of directionObs){
        const p=o.proximal,d=sparsePosePoint(distalPose,o.distal);
        const qa=projectPoint(cams[o.view],p),qb=projectPoint(cams[o.view],d);
        const predicted=sub(qb,qa),pn=norm(predicted);
        if(!Number.isFinite(pn)||pn<1e-9){res.push(1e3);continue;}
        const unit=scale(predicted,1/pn);
        const sine=unit[0]*o.direction[1]-unit[1]*o.direction[0];
        res.push(2.0*Math.tanh((sine*o.length)/2.0));
        /* R845 candidate: a surgeon-drawn strut-axis line carries both
           orientation and image-line location. Retain the perpendicular
           distance from the predicted distal attachment to that line. This
           is deliberately separate from the orientation residual above. */
        const lineOffset=(qb[0]-o.a[0])*o.direction[1]-(qb[1]-o.a[1])*o.direction[0];
        res.push(lineOffset);
    }
    return res;
}
function sparseSolveLinear(A,b){
    const n=A.length,M=A.map((r,i)=>[...r,b[i]]);
    for(let c=0;c<n;c++){
        let p=c;
        for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
        if(Math.abs(M[p][c])<1e-14)throw new Error('Singular normal matrix');
        [M[c],M[p]]=[M[p],M[c]];
        const q=M[c][c];
        for(let j=c;j<=n;j++)M[c][j]/=q;
        for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];if(Math.abs(f)<1e-15)continue;for(let j=c;j<=n;j++)M[r][j]-=f*M[c][j];}
    }
    return M.map(r=>r[n]);
}
/* Diagonally scaled adaptive Levenberg-Marquardt. Parameter scales differ
   greatly (camera centres in mm, rotations in radians, offsets in pixels), so
   fixed absolute damping is not a reliable acceptance strategy. */
function sparseGaussNewton(initial,obs,directionObs=[],{maxIterations=180,lambda=1e-3,tolerance=1e-8}={},laterality="right"){
    let x=initial.slice(),r=sparseResidualVector(x,obs,directionObs,laterality),cost=dot(r,r)/2;
    if(!Number.isFinite(cost))return {ok:false,reason:"Non-finite initial residual",params:x,residuals:r,iterations:0};
    let accepted=0,iterations=0,converged=false;
    for(let iter=0;iter<maxIterations;iter++){
        iterations=iter+1;
        const m=r.length,n=x.length,J=Array.from({length:m},()=>Array(n).fill(0));
        for(let j=0;j<n;j++){
            const h=1e-5*Math.max(1,Math.abs(x[j]));
            const xp=x.slice(),xm=x.slice();xp[j]+=h;xm[j]-=h;
            const rp=sparseResidualVector(xp,obs,directionObs,laterality);
            const rm=sparseResidualVector(xm,obs,directionObs,laterality);
            for(let i=0;i<m;i++)J[i][j]=(rp[i]-rm[i])/(2*h);
        }
        const JT=transpose(J),H=matMul(JT,J),g=matVec(JT,r);
        const diag=H.map((row,i)=>Math.max(Math.abs(row[i]),1e-12));
        let acceptedStep=false;
        for(let trial=0;trial<14;trial++){
            const Hd=H.map((row,i)=>row.map((v,j)=>i===j?v+lambda*diag[i]:v));
            let dx;
            try{dx=sparseSolveLinear(Hd,scale(g,-1));}
            catch(e){lambda=Math.min(lambda*10,1e15);continue;}
            if(!dx.every(Number.isFinite)){lambda=Math.min(lambda*10,1e15);continue;}
            const xn=x.map((v,i)=>v+dx[i]),rn=sparseResidualVector(xn,obs,directionObs,laterality),cn=dot(rn,rn)/2;
            if(Number.isFinite(cn)&&cn<cost){
                const improvement=cost-cn;x=xn;r=rn;cost=cn;accepted++;acceptedStep=true;lambda=Math.max(lambda/3,1e-12);
                const scaledStep=Math.sqrt(dx.reduce((s,v,i)=>s+(v/Math.max(1,Math.abs(x[i])))**2,0));
                if(scaledStep<tolerance||improvement<Math.max(tolerance*tolerance,1e-14)){converged=true;}
                break;
            }
            lambda=Math.min(lambda*10,1e15);
        }
        if(converged)break;
        if(!acceptedStep && lambda>=1e14)break;
    }
    const rms=Math.sqrt(dot(r,r)/Math.max(1,r.length));
    const max=Math.max(0,...r.map(Math.abs));
    const finite=x.every(Number.isFinite)&&Number.isFinite(rms)&&Number.isFinite(max);
    return {ok:finite&&accepted>0,reason:finite?(accepted>0?null:"Optimizer made no improving step"):"Non-finite optimizer state",params:x,residuals:r,rms,max,iterations,acceptedSteps:accepted,lambdaFinal:lambda,converged};
}
function sparseInitialState(laterality="right"){
    return [
        0,1000,0, 0,0,0,
        laterality==="left"?-1000:1000,0,0, 0,0,0,
        0,0,-150, 0,0,0,
        0,0,0,0,Math.log(800)
    ];
}
/* R745 — held-out semantic-point validation. The full fit has enough
   parameters to absorb small annotation errors while reporting tiny training
   residuals. Three strut-pair folds estimate whether the recovered camera/frame
   model predicts points it did not fit. This is an engineering rejection gate,
   not a clinical accuracy threshold. */
const SPARSE_CV_MAX_RMS_PX = 3.0; // R841 provisional human-scale held-out RMS gate; diagnostic candidate only
function sparseCrossValidate(sparse,laterality){
    const allObs=sparseObservationPoints(sparse);
    const folds=[["S1","S2"],["S3","S4"],["S5","S6"]];
    const errors=[],foldsOut=[];
    for(const heldStruts of folds){
        const held=new Set(heldStruts);
        const train={...sparse,views:{
            AP:{...sparse.views.AP,annotations:(sparse.views.AP?.annotations||[]).filter(a=>!held.has(String(a?.code||"").slice(0,2)))},
            LAT:{...sparse.views.LAT,annotations:(sparse.views.LAT?.annotations||[]).filter(a=>!held.has(String(a?.code||"").slice(0,2)))}
        }};
        const trainObs=sparseObservationPoints(train),trainDirections=sparseObservationDirections(train);
        if(trainObs.length<12||!trainObs.some(o=>o.side==="P")||!trainObs.some(o=>o.side==="D")){
            foldsOut.push({heldStruts,ok:false,reason:"Insufficient training points"});
            continue;
        }
        const fit=sparseGaussNewton(sparseInitialState(laterality),trainObs,trainDirections,{},laterality);
        if(!fit.ok){foldsOut.push({heldStruts,ok:false,reason:fit.reason||"Fold optimizer failed"});continue;}
        const state=sparseParameterToState(fit.params),cams=sparseStateToCameras(state,laterality);
        const distalPose={R:sparseRotVecToMatrix(state.distal.rot),t:state.distal.t};
        const foldErrors=[];
        for(const o of allObs){
            if(!held.has(o.code.slice(0,2)))continue;
            const world=o.side==="P"?o.local:sparsePosePoint(distalPose,o.local);
            const q=projectPoint(cams[o.view],world),e=Math.hypot(q[0]-o.xy[0],q[1]-o.xy[1]);
            if(Number.isFinite(e)){errors.push(e);foldErrors.push(e);}
        }
        foldsOut.push({heldStruts,ok:foldErrors.length>0,heldOutPointCount:foldErrors.length,
            rmsPx:foldErrors.length?Math.sqrt(foldErrors.reduce((a,e)=>a+e*e,0)/foldErrors.length):null,
            maxPx:foldErrors.length?Math.max(...foldErrors):null,
            focalLengthPx:state.focalPx});
    }
    const ok=foldsOut.length===folds.length&&foldsOut.every(f=>f.ok)&&errors.length>0;
    const rmsPx=ok?Math.sqrt(errors.reduce((a,e)=>a+e*e,0)/errors.length):null;
    return {ok,rmsPx,maxPx:ok?Math.max(...errors):null,heldOutPointCount:errors.length,foldCount:foldsOut.length,folds:foldsOut,
        focalLengthSpreadPx:ok?Math.max(...foldsOut.map(f=>f.focalLengthPx))-Math.min(...foldsOut.map(f=>f.focalLengthPx)):null,
        thresholdRmsPx:SPARSE_CV_MAX_RMS_PX};
}

function sparseDirectionCrossValidate(sparse,laterality){
    const allObs=sparseObservationPoints(sparse),allDirections=sparseObservationDirections(sparse);
    const folds=[],errors=[];
    for(let i=1;i<=6;i++){
        const sid=`S${i}`;
        const train={...sparse,views:{}};
        for(const viewName of ["AP","LAT"]) train.views[viewName]={...sparse.views[viewName],annotations:(sparse.views[viewName]?.annotations||[]).filter(a=>!(a?.geometry==="line"&&String(a.code||"")===`${sid}-DIR`))};
        const trainObs=sparseObservationPoints(train),trainDirs=sparseObservationDirections(train);
        if(trainObs.length<6||new Set(trainDirs.map(o=>o.strutId)).size<5){folds.push({heldStrut:sid,ok:false,reason:"Insufficient direction training data"});continue;}
        const fit=sparseGaussNewton(sparseInitialState(laterality),trainObs,trainDirs,{},laterality);
        if(!fit.ok){folds.push({heldStrut:sid,ok:false,reason:fit.reason||"Fold optimizer failed"});continue;}
        const state=sparseParameterToState(fit.params),cams=sparseStateToCameras(state,laterality),dp={R:sparseRotVecToMatrix(state.distal.rot),t:state.distal.t};
        const held=allDirections.filter(o=>o.strutId===sid),local=[];
        for(const o of held){
            const p=sparsePosePoint(dp,o.distal),qa=projectPoint(cams[o.view],o.proximal),qb=projectPoint(cams[o.view],p),v=sub(qb,qa),vn=norm(v);
            if(!Number.isFinite(vn)||vn<1e-9)continue;
            const u=scale(v,1/vn),angularPx=Math.abs(u[0]*o.direction[1]-u[1]*o.direction[0])*o.length;
            const offsetPx=Math.abs((qb[0]-o.a[0])*o.direction[1]-(qb[1]-o.a[1])*o.direction[0]);
            local.push(angularPx,offsetPx);
        }
        errors.push(...local);folds.push({heldStrut:sid,ok:local.length===4,rmsPx:local.length?Math.sqrt(local.reduce((s,e)=>s+e*e,0)/local.length):null,maxPx:local.length?Math.max(...local):null,residualCount:local.length});
    }
    const ok=folds.length===6&&folds.every(f=>f.ok)&&errors.length>0;
    return {ok,rmsPx:ok?Math.sqrt(errors.reduce((s,e)=>s+e*e,0)/errors.length):null,maxPx:ok?Math.max(...errors):null,heldOutResidualCount:errors.length,foldCount:folds.length,folds,thresholdRmsPx:SPARSE_CV_MAX_RMS_PX,metric:"held-out strut-axis orientation-equivalent-pixels plus line-offset pixels"};
}
function solveSparseFrameCameras(sparse){
    const obs=sparseObservationPoints(sparse);
    const directionObs=sparseObservationDirections(sparse);
    const requiredCodes=obs.map(o=>o.code);
    const paired={P:new Set(),D:new Set()};
    for(const o of obs)paired[o.side].add(`${o.code.slice(0,2)}|${o.view}`);
    const pairedIds={P:new Set(),D:new Set()};
    for(const side of ["P","D"])for(const code of ["S1","S2","S3","S4","S5","S6"])if(["AP","LAT"].every(v=>obs.some(o=>o.code===`${code}-${side}`&&o.view===v)))pairedIds[side].add(code);
    const supportedSide=["P","D"].find(side=>pairedIds[side].size>=3);
    const directionIds=new Set(directionObs.map(o=>o.strutId));
    if(!supportedSide)return {ok:false,stage:'imaging',reason:'Need at least three distinct paired hinge identities on either the proximal or distal side.',observationCount:obs.length,observedCodes:requiredCodes,pairedPointIdentities:{P:[...pairedIds.P],D:[...pairedIds.D]}};
    const completeHingePair=pairedIds.P.size>=3&&pairedIds.D.size>=3;
    if(!completeHingePair&&pairedIds.D.size<3&&pairedIds.P.size<6)return {ok:false,stage:'imaging',reason:'Proximal-hinge + strut-axis mode is not robust enough with fewer than six paired proximal identities; mark S1–S6 proximal hinges in both views, or use at least three paired distal hinges with strut-axis lines.',observationCount:obs.length,directionObservationCount:directionObs.length,pairedPointIdentities:{P:[...pairedIds.P],D:[...pairedIds.D]},observedCodes:requiredCodes};
    if(!completeHingePair&&(directionIds.size<5||!["AP","LAT"].every(v=>directionObs.some(o=>o.view===v))))return {ok:false,stage:'imaging',reason:'Sparse hinge-plus-direction reconstruction needs direction lines for at least five distinct struts across both AP and LAT views.',observationCount:obs.length,directionObservationCount:directionObs.length,observedCodes:requiredCodes};
    const laterality=normalizeLaterality({laterality:sparse.views.AP?.laterality||sparse.views.LAT?.laterality})||"right";
    const fit=sparseGaussNewton(sparseInitialState(laterality),obs,directionObs,{},laterality);
    if(!fit.ok)return {...fit,stage:'imaging'};
    const state=sparseParameterToState(fit.params),cams=sparseStateToCameras(state,laterality);
    const pointResiduals=sparseResidualVector(fit.params,obs,[],laterality);
    const directionResiduals=sparseResidualVector(fit.params,[],directionObs,laterality);
    const rmsPx=Math.sqrt(dot(pointResiduals,pointResiduals)/Math.max(1,pointResiduals.length));
    const maxPx=Math.max(0,...pointResiduals.map(Math.abs));
    const sparseMode=!completeHingePair;
    const crossValidation=sparseMode?sparseDirectionCrossValidate(sparse,laterality):sparseCrossValidate(sparse,laterality);
    const qualityAccepted=crossValidation.ok&&crossValidation.rmsPx<=SPARSE_CV_MAX_RMS_PX;
    const qualityReason=!crossValidation.ok
        ? "Held-out validation could not be completed; clinical output withheld."
        : (!qualityAccepted
            ? `Held-out point prediction RMS ${crossValidation.rmsPx.toFixed(3)} px exceeds the exploratory ${SPARSE_CV_MAX_RMS_PX.toFixed(2)} px gate; clinical output withheld.`
            : null);
    return {ok:qualityAccepted,stage:qualityAccepted?'imaging':'quality-gate',reason:qualityReason,
        state:qualityAccepted?state:null,cameras:qualityAccepted?cams:null,
        estimatedPrincipalPointOffsets:{AP:state.principalOffset.AP.slice(),LAT:state.principalOffset.LAT.slice()},
        estimatedFocalLengthPx:state.focalPx,
        focalLengthMode:"jointly-estimated",
        rmsPx,maxPx,
        directionResidualRmsPx:Math.sqrt(dot(directionResiduals,directionResiduals)/Math.max(1,directionResiduals.length)),
        crossValidationRmsPx:crossValidation.rmsPx,crossValidationMaxPx:crossValidation.maxPx,
        crossValidationFocalSpreadPx:crossValidation.focalLengthSpreadPx,
        crossValidationFoldCount:crossValidation.foldCount,crossValidation,
        qualityGateThresholdPx:SPARSE_CV_MAX_RMS_PX,
        qualityGateMarginPx:Number.isFinite(crossValidation.rmsPx)?SPARSE_CV_MAX_RMS_PX-crossValidation.rmsPx:null,
        qualityGateUtilizationPct:Number.isFinite(crossValidation.rmsPx)?100*crossValidation.rmsPx/SPARSE_CV_MAX_RMS_PX:null,
        qualityGateRule:"PASS when all held-out folds are valid and combined held-out point-prediction RMS <= threshold; maximum residual is diagnostic, not the gate criterion",
        qualityGateStatus:qualityAccepted?"PASS":"REJECTED",
        iterations:fit.iterations,acceptedSteps:fit.acceptedSteps,converged:fit.converged,lambdaFinal:fit.lambdaFinal,
        observationCount:obs.length,observedCodes:requiredCodes,
        directionObservationCount:directionObs.length,directionObservationCodes:directionObs.map(o=>`${o.view}|${o.code}`),
        sparseReconstructionMode:sparseMode?`${supportedSide}-HINGE+STRUT-AXIS`:"HINGE+HINGE",
        directionLineOffsetUsed:true};
}

function reconstructComplete(input) {
    if(!input) throw new Error("Invalid reconstruction input: missing input");

    /* New sparse semantic path. */
    if(input.version === "xray-observation-set-v2") {
        const sparse = sanitizeSparseObservationSet(input);
        const inventory = sparseObservationInventory(sparse);
        const imaging = solveSparseFrameCameras(sparse);

        let frame3D = null;
        let frameStatus = "not-evaluated";
        let frameReason = null;
        if(imaging.ok){
            const byViewCode = new Map();
            for(const viewName of ["AP","LAT"]){
                for(const a of (sparse.views[viewName]?.annotations || [])){
                    if(!a || a.geometry !== "point" || !/^S[1-6]-[PD]$/.test(String(a.code||""))) continue;
                    const xy = Array.isArray(a.geometry2D?.image) ? a.geometry2D.image : null;
                    if(!xy || xy.length < 2) continue;
                    byViewCode.set(`${viewName}|${a.code}`,[Number(xy[0]),Number(xy[1])]);
                }
            }
            const topology = sparseHardwareTopology();
            const reconstructed = {P:[],D:[]};
            const missingViews = [];
            for(const code of ["S1-P","S2-P","S3-P","S4-P","S5-P","S6-P","S1-D","S2-D","S3-D","S4-D","S5-D","S6-D"]){
                const ap=byViewCode.get(`AP|${code}`), lat=byViewCode.get(`LAT|${code}`);
                if(!ap || !lat) continue;
                const tri=triangulatePoint(imaging.cameras.AP,imaging.cameras.LAT,ap,lat);
                const side=code.slice(3);
                reconstructed[side].push({code,point:tri.point,raySeparation:tri.raySeparation,reprojectionError:tri.reprojectionError});
            }
            const identityPose={R:identity(3),t:[0,0,0],rms:null};
            const proxTarget = reconstructed.P.map(o=>o.point);
            const proxSource = reconstructed.P.map(o=>topology[o.code.slice(0,2)].P);
            const distTarget = reconstructed.D.map(o=>o.point);
            const distSource = reconstructed.D.map(o=>topology[o.code.slice(0,2)].D);
            /* R845: proximal local frame is the solver's world gauge. If proximal
               hinge points are absent, use that explicit gauge pose; if distal
               points are absent, use the distal pose estimated from AP/LAT strut
               axis lines. Do not label predicted points as observed. */
            const proxPose = reconstructed.P.length>=3 ? rigidRegistration(proxSource,proxTarget) : identityPose;
            const fittedDistal=imaging.state?.distal;
            const fittedDistalPose=fittedDistal?{R:sparseRotVecToMatrix(fittedDistal.rot),t:fittedDistal.t,rms:null}:null;
            const distalPose = reconstructed.D.length>=3 ? rigidRegistration(distSource,distTarget) : fittedDistalPose;
            if(!proxPose || !distalPose){frameReason="Neither measured hinge points nor a valid direction-constrained pose are available for both rings.";}
            else {
                const haveP=new Set(reconstructed.P.map(o=>o.code.slice(0,2))),haveD=new Set(reconstructed.D.map(o=>o.code.slice(0,2)));
                for(const sid of ["S1","S2","S3","S4","S5","S6"]){
                    if(!haveP.has(sid))reconstructed.P.push({code:`${sid}-P`,point:sparsePosePoint(proxPose,topology[sid].P),source:"hardware-gauge-prediction"});
                    if(!haveD.has(sid))reconstructed.D.push({code:`${sid}-D`,point:sparsePosePoint(distalPose,topology[sid].D),source:"direction-constrained-prediction"});
                }
                const proxResiduals = reconstructed.P.filter(o=>!o.source).map(o=>distance(sparsePosePoint(proxPose,topology[o.code.slice(0,2)].P),o.point));
                const distalResiduals = reconstructed.D.filter(o=>!o.source).map(o=>distance(sparsePosePoint(distalPose,topology[o.code.slice(0,2)].D),o.point));
                frame3D = {
                    proximal:{points:reconstructed.P,pose:proxPose,poseSource:proxTarget.length>=3?"paired-hinge-registration":"proximal-local-world-gauge"},
                    distal:{points:reconstructed.D,pose:distalPose,poseSource:distTarget.length>=3?"paired-hinge-registration":"AP-LAT-strut-axis-fit"},
                    proximalRegistrationRmsMm:proxPose.rms,
                    distalRegistrationRmsMm:distalPose.rms,
                    proximalRegistrationMaxMm:proxResiduals.length?Math.max(...proxResiduals):null,
                    distalRegistrationMaxMm:distalResiduals.length?Math.max(...distalResiduals):null,
                    observedProximalHingeCount:proxTarget.length,
                    observedDistalHingeCount:distTarget.length,
                    predictedProximalHingeCount:6-proxTarget.length,
                    predictedDistalHingeCount:6-distTarget.length
                };
                frameStatus = "reconstructed";
            }
        }
        /* Sparse semantic anatomy triangulation.
           This stage reconstructs only what the observation contract actually
           supplies: PFCL/DFCL image lines and PRP/DRP image points. */
        let anatomy3D = null;
        let anatomyStatus = "not-evaluated";
        let anatomyReason = null;
        if(imaging.ok && frame3D){
            const byViewCode = new Map();
            for(const viewName of ["AP","LAT"]){
                for(const a of (sparse.views[viewName]?.annotations || [])){
                    if(!a || !["PFCL","PRP","DFCL","DRP","LOC"].includes(String(a.code||""))) continue;
                    byViewCode.set(`${viewName}|${a.code}`,a);
                }
            }
            const triangulatePointCode=(code)=>{
                const ap=byViewCode.get(`AP|${code}`), lat=byViewCode.get(`LAT|${code}`);
                const xa=ap?.geometry2D?.image, xl=lat?.geometry2D?.image;
                if(!Array.isArray(xa)||!Array.isArray(xl)) return null;
                return {code,point:triangulatePoint(imaging.cameras.AP,imaging.cameras.LAT,xa,xl)};
            };
            const triangulateLineCode=(code)=>{
                const ap=byViewCode.get(`AP|${code}`), lat=byViewCode.get(`LAT|${code}`);
                const aa=ap?.geometry2D?.pointA?.image, ab=ap?.geometry2D?.pointB?.image;
                const la=lat?.geometry2D?.pointA?.image, lb=lat?.geometry2D?.pointB?.image;
                if(!Array.isArray(aa)||!Array.isArray(ab)||!Array.isArray(la)||!Array.isArray(lb)) return null;
                const line=reconstructProjectiveLine(imaging.cameras.AP,imaging.cameras.LAT,aa,ab,la,lb);
                const oriented=orientAxisTowardPositiveZ(line.direction);
                const conditioningPass=line.conditioningStatus==="well-conditioned";
                return {code,line,axis:{direction:oriented.direction,resolved:oriented.resolved&&conditioningPass,
                    status:conditioningPass?oriented.status:"ambiguous-near-parallel-low-confidence"}};
            };
            const PFCL=triangulateLineCode("PFCL"), DFCL=triangulateLineCode("DFCL");
            const PRP=triangulatePointCode("PRP"), DRP=triangulatePointCode("DRP");
            const LOC=triangulatePointCode("LOC");
            const required=[PFCL,PRP,DFCL,DRP];
            if(required.every(Boolean)){
                anatomy3D={PFCL,PRP,DFCL,DRP,LOC};
                anatomyStatus="reconstructed";
            }else{
                const missing=["PFCL","PRP","DFCL","DRP"].filter((c,i)=>!required[i]);
                anatomyReason=`Missing anatomy observations in both AP and LAT: ${missing.join(", ")}.`;
            }
        }
        const overallValid = Boolean(imaging.ok && frame3D);
        const completedValid = Boolean(overallValid && anatomy3D);

        /* ---------------------------------------------------------------
           Sparse clinical conversion

           This reuses the established renderer-neutral clinical definitions
           already used by the complete reconstruction path. The sparse path
           supplies the same geometric ingredients directly:
             ring pose, PRP/DRP, PFCL/DFCL, optional MASTER.

           No synthetic truth, calibration arrays, CASE data, or hidden 3D
           anatomy enters this conversion.
        --------------------------------------------------------------- */
        let clinical = null;
        let clinicalStatus = "not-evaluated";
        let clinicalMissing = [];
        let masterTabObserved = false;

        if(completedValid){
            const P = anatomy3D.PFCL;
            const PRP = anatomy3D.PRP;
            const D = anatomy3D.DFCL;
            const DRP = anatomy3D.DRP;
            const proxPose = frame3D.proximal.pose;
            const ringPose = proxPose;
            const ringInv = {R:transpose(ringPose.R),t:scale(matVec(transpose(ringPose.R),ringPose.t),-1)};

            /* R552: axes come from AP/LAT projective-plane intersections,
               then Method C orients them toward +world Z. PRP/DRP remain
               independent reference points; no artificial bone ends. */
            const pRef=PRP.point.point, dRef=DRP.point.point;
            const proxAxisResult=P.axis, distAxisResult=D.axis;
            if(!proxAxisResult.resolved || !distAxisResult.resolved){
                clinicalStatus="orientation-ambiguous";
                clinicalMissing=["PFCL positive-Z orientation","DFCL positive-Z orientation"].filter((_,i)=>!(i===0?proxAxisResult.resolved:distAxisResult.resolved));
            }
            const proxAxis=normalize(proxAxisResult.direction);
            const distAxis=normalize(distAxisResult.direction);
            const proxAxisRing=normalize(matVec(ringInv.R,proxAxis));

            /* Proximal anatomical frame. +Y is the established patient
               anterior reference; project it perpendicular to the proximal
               mechanical axis, then construct the left-handed frame. */
            const anteriorWorld=[0,1,0];
            const apProjection=imaging.cameras.AP;
            const patientAnteriorForMaster=normalize([-apProjection[2][0],-apProjection[2][1],-apProjection[2][2]]);
            const masterFragmentAnterior=sub(patientAnteriorForMaster,scale(proxAxis,dot(patientAnteriorForMaster,proxAxis)));
            let proxY=normalize(sub(anteriorWorld,scale(proxAxis,dot(anteriorWorld,proxAxis))));
            if(norm(proxY)<EPS){
                proxY=[0,1,0];
            }
            const proxX=normalize(cross(proxY,proxAxis));
            proxY=normalize(cross(proxAxis,proxX));
            const proxFrame={
                R:[proxX,proxY,proxAxis].map((_,row)=>[
                    proxX[row],proxY[row],proxAxis[row]
                ]),
                t:pRef
            };
            const proxFrameInv={R:transpose(proxFrame.R),t:scale(matVec(transpose(proxFrame.R),proxFrame.t),-1)};

            const ringCenter=ringPose.t.slice();
            const ringCenterMinusPRP=matVec(ringInv.R,sub(ringCenter,pRef));
            const ringAnterior = [0,1,0];

            const sparseLaterality = normalizeLaterality(input) || normalizeLaterality({laterality:sparse.views.AP?.laterality}) || "right";
            const lateralReference = sparseLaterality === "right" ? [-1,0,0] : [1,0,0];
            const mountingApTilt=sideTiltDeg(lateralReference,proxAxisRing);
            const mountingLatTilt=sideTiltDeg(ringAnterior,proxAxisRing);

            /* R755 — port the established R636/R635 Master Tab path into this
               isolated candidate. Keep the explicit observation path, but when
               it is absent derive the radial reference from the same S1-P/S2-P
               hardware topology and registered proximal-ring pose. Do not add
               a free scene-roll parameter: this clinical output is a geometric
               relation to patient anterior, not a camera-fit Euler angle. */
            let masterRotation={value:null,direction:null,source:"undetermined",reason:"Hardware reference geometry or proximal ring pose is unavailable."};
            const masterAnnotationCodeCandidates=["MASTER","masterTabReference"];
            const masterByView=new Map();
            for(const viewName of ["AP","LAT"]){
                for(const a of (sparse.views[viewName]?.annotations || [])){
                    if(masterAnnotationCodeCandidates.includes(String(a.code||""))) masterByView.set(`${viewName}|MASTER`,a);
                }
            }
            const masterAP=masterByView.get("AP|MASTER"), masterLAT=masterByView.get("LAT|MASTER");
            const masterXYAP=masterAP?.geometry2D?.image, masterXYLAT=masterLAT?.geometry2D?.image;
            const ringAxis=normalize(matVec(ringPose.R,[0,0,1]));
            if(Array.isArray(masterXYAP) && Array.isArray(masterXYLAT)){
                masterTabObserved=true;
                const MASTER=triangulatePoint(imaging.cameras.AP,imaging.cameras.LAT,masterXYAP,masterXYLAT).point;
                masterRotation=calculateMasterTabRotation(normalize(sub(MASTER,ringCenter)),ringAxis,masterFragmentAnterior,proxAxis,sparseLaterality);
                masterRotation.source="observed-master-tab-reference";
            } else {
                /* Ported from R636 R635: S1-P and S2-P flank the proximal
                   Master Tab centre-hole direction. Their midpoint defines
                   the radial direction in ring-local coordinates; apply the
                   registered ring pose, then use the same clinical angle
                   calculation as the explicit-MASTER branch. */
                const masterTopology=sparseHardwareTopology();
                const topA=masterTopology.S1?.P, topB=masterTopology.S2?.P;
                if(Array.isArray(topA) && Array.isArray(topB) && ringPose?.R){
                    const localDirection=normalize([
                        (topA[0]+topB[0])*0.5,
                        (topA[1]+topB[1])*0.5,
                        0
                    ]);
                    const masterRadialWorld=normalize(matVec(ringPose.R,localDirection));
                    masterRotation=calculateMasterTabRotation(masterRadialWorld,ringAxis,masterFragmentAnterior,proxAxis,sparseLaterality);
                }
            }

            const relOffset=matVec(proxFrameInv.R,sub(dRef,pRef));
            const locClinical = anatomy3D.LOC?.point
                ? (()=>{
                    const locLocal=matVec(proxFrameInv.R,sub(anatomy3D.LOC.point.point,pRef));
                    return {
                        enabled:true,
                        ap:sparseLaterality === "left"
                            ? mapSigned(locLocal[0],"lateral","medial")
                            : mapSigned(locLocal[0],"medial","lateral"),
                        lat:mapSigned(locLocal[1],"anterior","posterior"),
                        axial:mapSigned(locLocal[2],"proximal","distal")
                    };
                })()
                : {enabled:false,ap:null,lat:null,axial:null};
            const apAngulation=clinicalAPAngulation(proxAxis,distAxis,sparseLaterality);
            const latAngulation=clinicalLATAngulation(proxAxis,distAxis);

            clinical={
                mounting:{
                    ap_offset:sparseLaterality === "left"
                        ? mapSigned(ringCenterMinusPRP[0],"lateral","medial")
                        : mapSigned(ringCenterMinusPRP[0],"medial","lateral"),
                    lat_offset:mapSigned(ringCenterMinusPRP[1],"anterior","posterior"),
                    axial_offset:mapSigned(ringCenterMinusPRP[2],"proximal","distal"),
                    ap_tilt:mountingApTilt,
                    lat_tilt:mountingLatTilt,
                    master_rotation:masterRotation
                },
                deformity:{
                    ap_translation:sparseLaterality === "left"
                        ? mapSigned(relOffset[0],"lateral","medial")
                        : mapSigned(relOffset[0],"medial","lateral"),
                    lat_translation:mapSigned(relOffset[1],"anterior","posterior"),
                    bone_length:mapSigned(relOffset[2],"short","long"),
                    ap_angulation:apAngulation,
                    lat_angulation:latAngulation,
                    bone_rotation:{value:null,direction:null,source:"manual-clinical-required"},
                    loc:locClinical
                },
                manualAxialRotationDeg:null,
                manualAxialRotationSource:"manual-clinical-required"
            };
            clinicalMissing=[
                ["mounting.ap_offset",clinical.mounting.ap_offset],
                ["mounting.lat_offset",clinical.mounting.lat_offset],
                ["mounting.axial_offset",clinical.mounting.axial_offset],
                ["mounting.ap_tilt",clinical.mounting.ap_tilt],
                ["mounting.lat_tilt",clinical.mounting.lat_tilt],
                ["deformity.ap_translation",clinical.deformity.ap_translation],
                ["deformity.lat_translation",clinical.deformity.lat_translation],
                ["deformity.bone_length",clinical.deformity.bone_length],
                ["deformity.ap_angulation",clinical.deformity.ap_angulation],
                ["deformity.lat_angulation",clinical.deformity.lat_angulation]
            ].filter(([,v])=>!v || !Number.isFinite(Number(v.value)) || (Number(v.value)!==0 && !v.direction)).map(([k])=>k);
            clinicalStatus=(!proxAxisResult.resolved || !distAxisResult.resolved) ? "orientation-ambiguous" : (clinicalMissing.length ? "incomplete" : "reconstructed");
        }

        /* Sparse acceptance: manual axial bone rotation is deliberately
           excluded because it is not reconstructed from a centerline. */
        const geometryPass = Boolean(
            imaging.ok &&
            frame3D &&
            Number.isFinite(Number(imaging.rmsPx)) &&
            Number.isFinite(Number(imaging.maxPx)) &&
            Number.isFinite(Number(frame3D.proximalRegistrationRmsMm)) &&
            Number.isFinite(Number(frame3D.distalRegistrationRmsMm))
        );
        const sparsePass = Boolean(geometryPass && clinicalStatus === "reconstructed");

        return {
            version:RECONSTRUCTION_ENGINE_VERSION,
            schema:"XraySparseObservationInput",
            schemaVersion:"1",
            pass:sparsePass,
            valid:completedValid && clinicalStatus === "reconstructed",
            stage:imaging.stage==="quality-gate" ? "quality-review-required" : (completedValid ? (clinicalStatus === "reconstructed" ? "clinical-reconstructed" : "clinical-incomplete") : (overallValid ? "frame-reconstructed" : (imaging.ok ? "imaging-recovered" : "insufficient-observations"))),
            anatomyStatus,
            cameras:imaging.ok ? imaging.cameras : null,
            frame:frame3D,
            anatomy:anatomy3D,
            transforms:completedValid ? {
                proximalMounting:null,
                distalBonePose:null,
                deformity:null
            } : null,
            clinical,
            diagnostics:{
                observationContract:"renderer-neutral-semantic-v2",
                sparseInputVersion:SPARSE_OBSERVATION_VERSION,
                observationInventory:inventory,
                forbiddenInputPolicy:"raw XrayObservation object is never forwarded to the sparse solver",
                hiddenCalibrationConsumed:false, hiddenAnatomyConsumed:false,
                model3DConsumed:false, truthConsumed:false, caseConsumed:false,
                syntheticCameraConsumed:false,
                solverStatus:imaging.stage==="quality-gate" ? "held-out-quality-gate-rejected" : (imaging.ok ? (anatomy3D ? "imaging-frame-anatomy-and-clinical-solve" : (frame3D ? "imaging-and-rigid-frame-solve" : "imaging-recovered-frame-pending")) : "insufficient-observations"),
                cameraRmsPx:Number.isFinite(imaging.rmsPx) ? imaging.rmsPx : null,
                cameraMaxPx:Number.isFinite(imaging.maxPx) ? imaging.maxPx : null,
                estimatedFocalLengthPx:Number.isFinite(imaging.estimatedFocalLengthPx) ? imaging.estimatedFocalLengthPx : null,
                focalLengthMode:imaging.focalLengthMode || null,
                crossValidationRmsPx:Number.isFinite(imaging.crossValidationRmsPx) ? imaging.crossValidationRmsPx : null,
                crossValidationMaxPx:Number.isFinite(imaging.crossValidationMaxPx) ? imaging.crossValidationMaxPx : null,
                crossValidationFocalSpreadPx:Number.isFinite(imaging.crossValidationFocalSpreadPx) ? imaging.crossValidationFocalSpreadPx : null,
                qualityGateThresholdPx:Number.isFinite(imaging.qualityGateThresholdPx) ? imaging.qualityGateThresholdPx : SPARSE_CV_MAX_RMS_PX,
                qualityGateMarginPx:Number.isFinite(imaging.qualityGateMarginPx) ? imaging.qualityGateMarginPx : (Number.isFinite(imaging.crossValidationRmsPx) ? SPARSE_CV_MAX_RMS_PX-imaging.crossValidationRmsPx : null),
                qualityGateUtilizationPct:Number.isFinite(imaging.qualityGateUtilizationPct) ? imaging.qualityGateUtilizationPct : (Number.isFinite(imaging.crossValidationRmsPx) ? 100*imaging.crossValidationRmsPx/SPARSE_CV_MAX_RMS_PX : null),
                qualityGateRule:imaging.qualityGateRule || "PASS when all held-out folds are valid and combined held-out point-prediction RMS <= threshold; maximum residual is diagnostic, not the gate criterion",
                crossValidationFoldCount:imaging.crossValidationFoldCount ?? 0,
                crossValidationFolds:imaging.crossValidation?.folds ?? [],
                qualityGateStatus:imaging.qualityGateStatus || (imaging.ok ? "PASS" : "NOT-PASSED"),
                qualityGateReason:imaging.reason || null,
                observationCount:imaging.observationCount,
                observedCodes:imaging.observedCodes,
                directionObservationCount:imaging.directionObservationCount ?? 0,
                directionObservationCodes:imaging.directionObservationCodes ?? [],
                directionConstraintRmsPx:imaging.directionResidualRmsPx ?? null,
                estimatedPrincipalPointOffsets:imaging.estimatedPrincipalPointOffsets ?? null,
                frameStatus,
                proximalRegistrationRmsMm:frame3D?.proximalRegistrationRmsMm ?? null,
                proximalRegistrationMaxMm:frame3D?.proximalRegistrationMaxMm ?? null,
                distalRegistrationRmsMm:frame3D?.distalRegistrationRmsMm ?? null,
                distalRegistrationMaxMm:frame3D?.distalRegistrationMaxMm ?? null,
                anatomyRequired:["PFCL","PRP","DFCL","DRP"],
                optionalAnatomy:["LOC"],
                anatomyMissing:anatomy3D ? [] : ["PFCL","PRP","DFCL","DRP"].filter((c)=>{
                    const anns=[...(sparse.views.AP?.annotations||[]),...(sparse.views.LAT?.annotations||[])].filter(a=>a?.code===c);
                    return anns.length<2;
                }),
                anatomyStatus,
                anatomyPlaneIntersectionAnglesDeg:anatomy3D?{PFCL:anatomy3D.PFCL.line.planeNormalAngleDeg,DFCL:anatomy3D.DFCL.line.planeNormalAngleDeg}:null,
                clinicalStatus,
                clinicalMissing,
                geometryPass,
                sparsePass,
                acceptance: {
                    boneRotationEvaluated:false,
                    clinicalOutputComplete:clinicalStatus === "reconstructed",
                    geometryAvailable:geometryPass,
                    reconstructionQualityGate:imaging.qualityGateStatus || "NOT-PASSED",
                    clinicalOutputWithheld:imaging.stage==="quality-gate"
                },
                masterTabObserved,
                masterTabReferenceDerived:clinical?.mounting?.master_rotation?.source === "hardware-derived-ring-pose",
                masterTabReferenceSource:clinical?.mounting?.master_rotation?.source || "undetermined",
                clinicalConversion:{
                    method:"geometric-projection",
                    laterality:completedValid ? (normalizeLaterality(input) || normalizeLaterality({laterality:sparse.views.AP?.laterality}) || "right") : null,
                    mountingEulerNotUsed:true,
                    deformityEulerNotUsed:true,
                    masterTabReference:"proximal ring center to Master Tab center hole versus patient anterior",
                    boneRotationInferred:false,
                    anatomySemantics:"PFCL/DFCL are reconstructed as projective 3D lines; Method C orients axes toward +world Z; PRP/DRP remain separate reference points; no bone ends inferred"
                },
                reason:imaging.ok ? (anatomy3D ? "Camera recovery, 3D hinge triangulation, rigid-frame registration, semantic anatomy triangulation, and geometric clinical conversion completed." : (frame3D ? (anatomyReason || "Frame geometry reconstructed; semantic anatomy is not sufficiently observed in both views.") : (frameReason || "Imaging recovered; frame geometry is not yet sufficiently observed."))) : imaging.reason
            },
            observationSet:sparse,
            casePatch:null
        };
    }

    /* Existing complete-input path is retained for regression compatibility.
       It is not used by the new sparse semantic boundary. */
    let reconstructionInput=input;
    if(input.schema !== RECONSTRUCTION_SCHEMA) {
        throw new Error("Invalid complete reconstruction input schema");
    }

    const calAP=extractCalibration(reconstructionInput,"AP"),calLAT=extractCalibration(reconstructionInput,"LAT");
    const camAP=solveProjectiveCamera(calAP.map(x=>x.model3D),calAP.map(x=>x.image2D));
    const camLAT=solveProjectiveCamera(calLAT.map(x=>x.model3D),calLAT.map(x=>x.image2D));
    const P1=camAP.P,P2=camLAT.P;

    /*
       R441 — CALIBRATION-ONLY BOUNDARY
       --------------------------------
       Frame calibration/camera recovery is a valid reconstruction stage
       before anatomical observations are available.  Do not manufacture
       PFCL/DFCL/PRP/DRP/orientation observations merely to exercise the
       camera solver.

       The full anatomical solve below remains unchanged.
    */
    const anatomyInput=reconstructionInput.anatomy || {};
    const requiredAnatomy=[
        anatomyInput.PFCL,
        anatomyInput.PRP,
        anatomyInput.DFCL,
        anatomyInput.DRP,
        anatomyInput.proximalOrientationReference
    ];
    const hasCompleteAnatomy=requiredAnatomy.every(Boolean);
    if(!hasCompleteAnatomy){
        const modelRing=calAP.map(o=>o.model3D);
        const reconRing=triangulate(P1,P2,calAP.map(o=>o.image2D),calLAT.map(o=>o.image2D)).map(r=>r.point);
        const ringPose=rigidRegistration(modelRing,reconRing);
        const cameraPlaneNormal=function(P){
            return normalize([P[2][0],P[2][1],P[2][2]]);
        };
        const apPlaneNormal=cameraPlaneNormal(P1);
        const latPlaneNormal=cameraPlaneNormal(P2);
        const viewPlaneAngleDeg=Math.acos(Math.max(-1,Math.min(1,Math.abs(dot(apPlaneNormal,latPlaneNormal)))))*180/Math.PI;
        const calibrationPass=camAP.rms < 1e-5 && camLAT.rms < 1e-5;
        return {
            version:RECONSTRUCTION_ENGINE_VERSION,
            schema:RECONSTRUCTION_SCHEMA,
            pass:calibrationPass,
            valid:calibrationPass,
            stage:"calibration-only",
            anatomyStatus:"awaiting-semantic-anatomy",
            cameras:{
                AP:P1,LAT:P2,APCalibration:camAP,LATCalibration:camLAT
            },
            frame:{
                ringPose,
                reconstructedProximalRing:reconRing,
                struts:[]
            },
            anatomy:null,
            transforms:null,
            clinical:null,
            diagnostics:{
                cameraRmsPx:{AP:camAP.rms,LAT:camLAT.rms},
                cameraMaxPx:{AP:camAP.max,LAT:camLAT.max},
                calibrationCorrespondenceCount:{AP:calAP.length,LAT:calLAT.length},
                rigidFrameRmsMm:ringPose.rms,
                viewPlaneAngleDeg,
                viewPlaneNormals:{AP:apPlaneNormal,LAT:latPlaneNormal},
                anatomySolveSkipped:true,
                reason:"Semantic frame calibration is available; required anatomical observations are not yet supplied."
            },
            casePatch:null
        };
    }
    /* R552 Same approach for S1–S6 DIR: each AP/LAT pair of image segments
       defines two back-projection planes. Their intersection gives an
       undirected 3-D strut line. The four 2-D endpoints are not paired into
       two artificial 3-D endpoints, and line extent is not a strut-length
       measurement. Recorded physical lengths remain metadata only. */
    const strut3D=reconstructionInput.struts.map(s=> {
        const line=reconstructProjectiveLine(P1,P2,s.AP.pointA,s.AP.pointB,s.LAT.pointA,s.LAT.pointB);
        return {
            id:s.id,origin:line.origin,direction:line.direction,
            geometry:"undirected-3d-line",endpointCorrespondenceUsed:false,
            planeResiduals:line.planeResiduals,
            planeNormalCrossNorm:line.planeNormalCrossNorm,
            planeNormalAngleDeg:line.planeNormalAngleDeg,
            conditioningStatus:line.conditioningStatus,
            reconstructedLengthMm:null,
            recordedLengthMm:Number.isFinite(Number(s.recordedLengthMm))?Number(s.recordedLengthMm):null,
            lengthResidualMm:null
        };
    });
    const a=reconstructionInput.anatomy;
    const PFCL=reconstructAnatomyLine(P1,P2,a.PFCL),DFCL=reconstructAnatomyLine(P1,P2,a.DFCL);
    const PRP=reconstructAnatomyPoint(P1,P2,a.PRP),DRP=reconstructAnatomyPoint(P1,P2,a.DRP);
    const LOC=a.LOC ? reconstructAnatomyPoint(P1,P2,a.LOC) : null;
    const ORIENT=reconstructAnatomyLine(P1,P2,a.proximalOrientationReference);

    // R552: PFCL/DFCL are infinite reconstructed axes. PRP/DRP are distinct
    // reference points; artificial PBE/DBE endpoints are not constructed.
    if(!PFCL.orientationResolved || !DFCL.orientationResolved) throw new Error("R552 anatomical axis orientation is ambiguous near world Z horizontal");
    /* Frame pose: model ring landmarks -> reconstructed ring landmarks. */
    const modelRing=reconstructionInput.calibration.AP.map(o=>o.model3D);
    const reconRing=triangulate(P1,P2,reconstructionInput.calibration.AP.map(o=>o.image2D),reconstructionInput.calibration.LAT.map(o=>o.image2D)).map(r=>r.point);
    const ringPose=rigidRegistration(modelRing,reconRing);
    // PRP/DRP define the fragment reference locations. The independent
    // projective lines define their axes; no line endpoints are treated as
    // physical bone ends.
    const proxAxis=normalize(PFCL.orientedDirection);
    const distAxis=normalize(DFCL.orientedDirection);
    const proxRef=PRP.point,distRef=DRP.point;
    const ringInv=inversePose( {
        R:ringPose.R,t:ringPose.t
    });
    const proxBoneOrigin=transformPose(ringInv,proxRef);
    const proxAxisRing=normalize(matVec(ringInv.R,proxAxis));
    /* Orientation reference resolves proximal roll in this synthetic/complete contract. */
    const proxOrientVec=(()=>{const v=normalize(ORIENT.direction);return v[1]<0?scale(v,-1):v;})();

    /*
       Proximal bone frame construction:
       - proximal Z is the Method C-oriented PFCL axis;
       - the surgeon's orientation reference supplies the proximal BONE Y
         (anterior) direction;
       - proximal X is then derived from the project frame convention.

       The distal axis is subsequently aligned in this proximal-bone-local
       frame. This is the production geometry construction, not a test-only
       diagnostic.
    */
    const proxY=normalize(matVec(ringInv.R,proxOrientVec));
    const proxZ=proxAxisRing;
    const proxX=normalize(cross(proxY,proxZ));
    const proxYOrtho=normalize(cross(proxZ,proxX));
    const Rprox=[[proxX[0],proxYOrtho[0],proxZ[0]],[proxX[1],proxYOrtho[1],proxZ[1]],[proxX[2],proxYOrtho[2],proxZ[2]]];
    const proxPose= {
        R:Rprox,t:proxBoneOrigin
    };
    const proxReferencePose={
        R:Rprox,
        t:proxBoneOrigin
    };

    /*
       Deformity translation is defined by DRP relative to PRP, expressed in
       the proximal-bone frame. PRP/DRP are reference points, not cut points.

       The distal fragment axis supplies two rotational degrees of freedom.
       Axial bone rotation is NOT inferred from a centerline alone; the
       remaining roll is supplied explicitly by manual clinical input.
    */
    const distReference3D=DRP.point;
    const distAxis3D=distAxis;
    // Express the distal mechanical axis in the proximal-bone local frame
    // before constructing the distal local orientation.
    const distalAxisLocal=normalize(matVec(transpose(proxPose.R),distAxis3D));
    const z0=[0,0,1];
    const z1=distalAxisLocal;
    let rollAxis=cross(z0,z1);
    let alignR=identity(3);
    if(norm(rollAxis)>1e-10) {
        rollAxis=normalize(rollAxis);
        const aa=Math.acos(Math.max(-1,Math.min(1,dot(z0,z1))));
        const cA=Math.cos(aa),sA=Math.sin(aa),xA=rollAxis[0],yA=rollAxis[1],zA=rollAxis[2],vA=1-cA;
        alignR=[[cA+xA*xA*vA,xA*yA*vA-zA*sA,xA*zA*vA+yA*sA],[yA*xA*vA+zA*sA,cA+yA*yA*vA,yA*zA*vA-xA*sA],[zA*xA*vA-yA*sA,zA*yA*vA+xA*sA,cA+zA*zA*vA]];
    }
    const manualClinical=input.manualClinical || {axialRotationDeg:null,source:null,direction:null};
    const clinicalRollDeg=Number(manualClinical.axialRotationDeg||0);
    const ar=clinicalRollDeg*Math.PI/180,ca=Math.cos(ar),sa=Math.sin(ar);
    const rollR=[[ca,-sa,0],[sa,ca,0],[0,0,1]];
    const distLocalR=matMul(alignR,rollR);
    const RdistRecovered=matMul(proxPose.R,distLocalR);
    const distPose= {
        R:RdistRecovered,t:transformPose(ringInv,distReference3D)
    };
    const rel=composePose(inversePose(proxReferencePose),distPose);
    const relOffset=rel.t;
    const laterality=normalizeLaterality(input);

    /*
       CLINICAL MOUNTING CONVERSION
       ----------------------------
       These values are derived directly from reconstructed geometry rather
       than from an Euler decomposition. The anatomical lateral-side radial
       direction of the ring is: RIGHT = -X, LEFT = +X. The anterior-side
       radial direction is +Y for both sides.

       This laterality rule is intentionally explicit because the same
       physical frame geometry has opposite medial/lateral clinical labels
       on the two limbs.
    */
    const ringLateral= laterality === "right" ? [-1,0,0] : [1,0,0];
    const ringAnterior=[0,1,0];
    /*
       Mounting tilt conventions:
       AP tilt is measured against the ring's anatomical lateral radial
       direction. The sign is therefore laterality-dependent through
       ringLateral above. LAT tilt is measured against +Y (anterior) for both
       sides. sideTiltDeg() reports proximal when the axis points toward the
       positive reference vector and distal otherwise.
    */
    const mountingApTilt=sideTiltDeg(ringLateral,proxAxisRing);
    const mountingLatTilt=sideTiltDeg(ringAnterior,proxAxisRing);

    // Master-tab rotation is an observed frame-to-bone relationship. It is
    // not safely recoverable from the bone centerline alone.
    let masterRotation=null;
    if(a.masterTabReference){
        const MASTER=reconstructAnatomyPoint(P1,P2,a.masterTabReference);
        // R458 — use the reconstructed proximal-ring pose itself as the
        // authoritative ring center. `ringPose.t` is the translation of
        // the registered proximal ring model; averaging mixed proximal +
        // distal landmarks would shift the reference and corrupt master
        // rotation.
        const ringCenter=ringPose.t.slice();
        const masterRadial=normalize(sub(MASTER.point,ringCenter));
        const ringAxis=normalize(matVec(ringPose.R,[0,0,1]));
        const fragmentAnterior=normalize(proxOrientVec); // Same proximal anterior reference used by proximal-frame construction.
        masterRotation=calculateMasterTabRotation(masterRadial,ringAxis,fragmentAnterior,proxAxis,laterality);
    }

    /*
       Translation convention:
         mounting = ringCenter - PRP, expressed in ring coordinates.
       Because ringCenter is the ring-frame origin, the vector is simply
       -proxBoneOrigin. Do NOT compute PRP - ringCenter and invert it later;
       that would reverse the clinical direction.
    */
    const ringCenterMinusPRP=scale(proxBoneOrigin,-1);

    /*
       Final mounting translation conversion:
         RIGHT +X = medial; RIGHT -X = lateral
         LEFT  +X = lateral; LEFT  -X = medial
       LAT: +Y = anterior, -Y = posterior
       Axial: +Z = proximal, -Z = distal
    */
    const mounting= {
        ap_offset:laterality==="left"
            ? mapSigned(ringCenterMinusPRP[0],"lateral","medial")
            : mapSigned(ringCenterMinusPRP[0],"medial","lateral"),
        lat_offset:mapSigned(ringCenterMinusPRP[1],"anterior","posterior"),
        axial_offset:mapSigned(ringCenterMinusPRP[2],"proximal","distal"),
        ap_tilt:mountingApTilt,
        lat_tilt:mountingLatTilt,
        master_rotation:masterRotation || {value:null,direction:null,source:"not-observed"}
    };

    /*
       Clinical deformity angulation is derived from the two directed
       mechanical axes. AP uses the X-Z projection about +Y; its left-handed
       sign maps to valgus/varus by laterality. LAT uses the Y-Z projection
       about +X; the physical anterior/posterior direction is preserved.
    */
    const apAngulation=clinicalAPAngulation(proxAxis,distAxis,laterality);
    const latAngulation=clinicalLATAngulation(proxAxis,distAxis);
    /*
       Deformity translation is LOC = DRP - PRP, expressed in the proximal
       bone frame. Laterality changes only the AP clinical label:
         RIGHT +X = medial; LEFT +X = lateral.
       LAT and axial conventions are shared as documented by the project.
    */
    const deformity= {
        ap_translation: laterality === "left"
            ? mapSigned(relOffset[0],"lateral","medial")
            : mapSigned(relOffset[0],"medial","lateral"),
        lat_translation:mapSigned(relOffset[1],"anterior","posterior"),
        // +Z in the proximal-bone frame represents shortening; -Z represents
        // lengthening under the established clinical convention.
        bone_length:mapSigned(relOffset[2],"short","long"),
        ap_angulation: {
            value:apAngulation.value,
            direction:apAngulation.direction,
            signedDeg:apAngulation.signedDeg,
            laterality
        },
        lat_angulation: {
            value:latAngulation.value,
            direction:latAngulation.direction,
            signedDeg:latAngulation.signedDeg
        },
        // Axial bone rotation is manual clinical input. A two-point fragment
        // centerline cannot determine roll about its own axis, so this value
        // is never inferred from PFCL/DFCL geometry.
        bone_rotation: {
            value:Math.abs(clinicalRollDeg),
            direction:clinicalRollDeg === 0 ? null : (manualClinical.direction||"internal"),
            source:"manual-clinical"
        },
        loc: (LOC ? (()=>{
            const locLocal=transformPose(inversePose(proxReferencePose),LOC.point);
            return {
                enabled:true,
                ap: laterality === "left"
                    ? mapSigned(locLocal[0],"lateral","medial")
                    : mapSigned(locLocal[0],"medial","lateral"),
                lat:mapSigned(locLocal[1],"anterior","posterior"),
                axial:mapSigned(locLocal[2],"proximal","distal")
            };
        })() : {
            enabled:false,
            ap:{value:0,direction:null},
            lat:{value:0,direction:null},
            axial:{value:0,direction:null}
        })
    };
    const strutResiduals=strut3D.map(s=>s.lengthResidualMm).filter(Number.isFinite);
    const strutLinePlaneResiduals=strut3D.flatMap(s=>s.planeResiduals||[]);
    const pointResiduals=[PRP,DRP].flatMap(r=>[
        r.reprojectionError.view1,
        r.reprojectionError.view2
    ]);
    const linePlaneResiduals=[...PFCL.planeResiduals,...DFCL.planeResiduals];

    // Axis diagnostics compare the semantic directed axes, not the raw
    // surgeon endpoint order. This makes the diagnostic invariant to which
    // endpoint was drawn first.
    // Optional syntheticTruth is test-only input. It is never needed for
    // clinical reconstruction and does not alter the reconstruction itself.
    const axisErrors=input.syntheticTruth
        ? [
            angleError(proxAxis,input.syntheticTruth.proximalAxis),
            angleError(distAxis,input.syntheticTruth.distalAxis)
          ]
        : null;
    const manualAxialRotation=manualClinical.axialRotationDeg;

    /*
       AP/LAT image-plane angle:
       For a projective camera P = K[R|t], the third row of the left 3x3
       block is the camera optical-axis normal because K's third row is
       [0,0,1].  The angle between the two image planes is therefore the
       acute angle between their recovered plane normals.
    */
    const cameraPlaneNormal=function(P){
        return normalize([P[2][0],P[2][1],P[2][2]]);
    };
    const apPlaneNormal=cameraPlaneNormal(P1);
    const latPlaneNormal=cameraPlaneNormal(P2);
    const viewPlaneAngleDeg=
        Math.acos(Math.max(-1,Math.min(1,Math.abs(dot(apPlaneNormal,latPlaneNormal))))) * 180/Math.PI;

    const axisPass = !axisErrors || Math.max(...axisErrors) < 1e-5;

    /*
       R483 — RESULT CONTRACT / CLINICAL OUTPUT INVARIANT
       ----------------------------------------------------
       `valid` means the completed reconstruction result is structurally and
       numerically usable. `pass` means the applicable engineering acceptance
       criteria passed. Manual axial rotation is NOT required for a geometric
       reconstruction pass because a centerline cannot determine roll about
       its own axis. When no manual clinical input is supplied, bone_rotation
       remains explicitly unavailable rather than being fabricated.

       Mounting/deformity quantities that are mathematically reconstructable
       must be finite before a completed result can be considered valid.
       Master rotation remains optional because it requires the independent
       master-tab observation.
    */
    const requiredClinicalPairs=[
        ['mounting.ap_offset',mounting.ap_offset],
        ['mounting.lat_offset',mounting.lat_offset],
        ['mounting.axial_offset',mounting.axial_offset],
        ['mounting.ap_tilt',mounting.ap_tilt],
        ['mounting.lat_tilt',mounting.lat_tilt],
        ['deformity.ap_translation',deformity.ap_translation],
        ['deformity.lat_translation',deformity.lat_translation],
        ['deformity.bone_length',deformity.bone_length],
        ['deformity.ap_angulation',deformity.ap_angulation],
        ['deformity.lat_angulation',deformity.lat_angulation]
    ];
    const clinicalMissing=requiredClinicalPairs
        .filter(([,pair])=>!pair || !Number.isFinite(Number(pair.value)) || !pair.direction)
        .map(([name])=>name);
    const clinicalOutputValid=clinicalMissing.length===0;
    const geometryFinite=[
        camAP.rms,camLAT.rms,ringPose.rms,
        ...pointResiduals,...linePlaneResiduals,...strutLinePlaneResiduals,
        ...strutResiduals
    ].every(Number.isFinite);
    const valid=geometryFinite && clinicalOutputValid;
    const pass =
        valid &&
        camAP.rms < 1e-5 &&
        camLAT.rms < 1e-5 &&
        Math.max(...strutResiduals,0) < 1e-5 &&
        axisPass &&
        strut3D.every(s=>s.conditioningStatus==="well-conditioned") &&
        ringPose.rms < 1e-5;
    const status=pass ? 'PASS' : (valid ? 'VALID — NOT PASS' : 'INVALID');
    return {
        version:RECONSTRUCTION_ENGINE_VERSION,schema:RECONSTRUCTION_SCHEMA,
        status,stage:'reconstructed',anatomyStatus:'reconstructed',pass,valid,
        cameras: {
            AP:P1,LAT:P2,APCalibration:camAP,LATCalibration:camLAT
        },
        frame: {
            ringPose,reconstructedProximalRing:reconRing,struts:strut3D
        },
        anatomy: {
            PFCL,PRP,DFCL,DRP,LOC,proximalOrientationReference:ORIENT
        },
        transforms: {
            proximalMounting:proxPose,distalBonePose:distPose,deformity:rel
        },
        clinical: {
            mounting,deformity,manualAxialRotationDeg:manualAxialRotation,manualAxialRotationSource:manualClinical.source
        },
        diagnostics: {
            cameraRmsPx: {
                AP:camAP.rms,LAT:camLAT.rms
            },
            cameraMaxPx: {
                AP:camAP.max,LAT:camLAT.max
            },
            viewPlaneAngleDeg,
            viewPlaneNormals:{AP:apPlaneNormal,LAT:latPlaneNormal},
            strutMaxLengthResidualMm:strutResiduals.length?Math.max(...strutResiduals):null,
            strutRmsLengthResidualMm:strutResiduals.length?Math.sqrt(strutResiduals.reduce((s,v)=>s+v*v,0)/strutResiduals.length):null,
            strutDirectionLineCount:strut3D.length,
            strutLinePlaneResidualMax:strutLinePlaneResiduals.length?Math.max(...strutLinePlaneResiduals):null,
            strutPlaneIntersectionMinAngleDeg:strut3D.length?Math.min(...strut3D.map(s=>s.planeNormalAngleDeg)):null,
            strutLineConditioningPass:strut3D.every(s=>s.conditioningStatus==="well-conditioned"),
            anatomyPlaneIntersectionAnglesDeg:{PFCL:PFCL.planeNormalAngleDeg,DFCL:DFCL.planeNormalAngleDeg},
            strutLengthEvaluated:false,
            anatomyMaxReprojectionPx:Math.max(...pointResiduals),
            linePlaneResiduals,
            axisErrorsDeg:axisErrors ? {
                PFCL:axisErrors[0],DFCL:axisErrors[1]
            }
            : null,
            rigidFrameRmsMm:ringPose.rms,
            manualAxialRotationNotInferred:true,
            clinicalOutputValid,
            clinicalMissing,
            clinicalConversion:{
                method:"geometric-projection",
                laterality,
                mountingEulerNotUsed:true,
                deformityEulerNotUsed:true,
                masterTabObserved:Boolean(a.masterTabReference),
                anatomySemantics:"PFCL/DFCL are projective 3D lines oriented toward +world Z; PRP/DRP remain separate reference points; PBE/DBE not constructed"
            }
        },
        casePatch: {
            mounting,deformity,reconstruction: {
                version:RECONSTRUCTION_ENGINE_VERSION,retained:true,manualClinical: {
                    axialRotationDeg:manualAxialRotation,source:manualClinical.source
                },frameResidualMm:ringPose.rms,axisResidualDeg:axisErrors ? {
                    PFCL:axisErrors[0],DFCL:axisErrors[1]
                }
                : null
            }
        }

    };
}


/* Public renderer-neutral API. Keep this surface small and stable; UI code
   should call reconstructComplete() rather than reaching into internals. */
window.Reconstruction= {
    BUILD:RECONSTRUCTION_ENGINE_BUILD,
    VERSION:RECONSTRUCTION_ENGINE_VERSION,
    SCHEMA:RECONSTRUCTION_SCHEMA,
    SCHEMA_VERSION:RECONSTRUCTION_SCHEMA_VERSION,
    createCompleteObservationInput,
    reconstructComplete,
    sanitizeSparseObservationSet,
    solveProjectiveCamera,
    solveSparseFrameCameras,
    sparseHardwareTopology,
    projectPoint,
    triangulatePoint,
    rigidRegistration,
};
/* R815 candidate-only observation-contract gate (corrected sparse-subset semantics).
   Native behavior observed in R811: the sparse solver normalized unknown laterality
   to its right-side default and silently accepted absent/invalid image descriptors,
   duplicate annotation IDs, and unknown semantic codes. This gate validates the
   existing XrayObservation v2 payload before calling the unchanged reconstruction
   pipeline; camera fitting, triangulation, and clinical calculations remain unchanged.
   R838 changes the provisional held-out RMS quality gate to 3.00 px. */
function validateR815ObservationContract(input) {
    if(!input || input.version !== "xray-observation-set-v2") return;
    const normalize = v => ({right:"right",r:"right",left:"left",l:"left"}[String(v == null ? "" : v).trim().toLowerCase()] || null);
    const laterality = normalize(input.laterality);
    if(!laterality) throw new Error("R812 contract: top-level laterality must be right/left (or R/L)");
    const allowed = new Map();
    for(let i=1;i<=6;i++) { allowed.set(`S${i}-P`,"point"); allowed.set(`S${i}-D`,"point"); allowed.set(`S${i}-DIR`,"line"); }
    for(const c of ["PRP","DRP","LOC"]) allowed.set(c,"point");
    for(const c of ["PFCL","DFCL"]) allowed.set(c,"line");
    for(const viewName of ["AP","LAT"]) {
        const view=input[viewName];
        if(!view || view.version !== "xray-observation-v2") throw new Error(`R812 contract: missing/invalid ${viewName} xray-observation-v2 view`);
        if(normalize(view.laterality) !== laterality) throw new Error(`R812 contract: ${viewName} laterality must match top-level laterality`);
        if(!Array.isArray(view.images) || view.images.length !== 1) throw new Error(`R812 contract: ${viewName} must contain exactly one image descriptor`);
        const image=view.images[0];
        if(!image || !Number.isFinite(Number(image.width)) || !Number.isFinite(Number(image.height)) || Number(image.width)<=0 || Number(image.height)<=0) throw new Error(`R812 contract: ${viewName} image width/height must be finite and positive`);
        // Pixel spacing is optional, but when supplied it must be a complete pair
        // of finite positive values. It is metadata only; camera/clinical math is unchanged.
        if(image.pixelSpacing != null) {
            if(!Array.isArray(image.pixelSpacing) || image.pixelSpacing.length !== 2 ||
               !Number.isFinite(Number(image.pixelSpacing[0])) || !Number.isFinite(Number(image.pixelSpacing[1])) ||
               Number(image.pixelSpacing[0]) <= 0 || Number(image.pixelSpacing[1]) <= 0) {
                throw new Error(`R818 contract: ${viewName} pixelSpacing, when supplied, must contain exactly two finite positive values`);
            }
        }
        if(image.view != null && image.view !== viewName) throw new Error(`R812 contract: image view label does not match ${viewName}`);
        if(image.id == null || String(image.id).trim()==="") throw new Error(`R812 contract: ${viewName} image id is required`);
        if(!Array.isArray(view.annotations)) throw new Error(`R812 contract: ${viewName} annotations must be an array`);
        const ids=new Set(), codes=new Set();
        for(const a of view.annotations) {
            if(!a || a.id == null || String(a.id).trim()==="") throw new Error(`R812 contract: every ${viewName} annotation needs an id`);
            const id=String(a.id);
            if(ids.has(id)) throw new Error(`R812 contract: duplicate annotation id in ${viewName}: ${id}`);
            ids.add(id);
            const code=a.code == null ? "" : String(a.code);
            if(!allowed.has(code)) throw new Error(`R812 contract: unknown semantic code in ${viewName}: ${code||"<empty>"}`);
            if(a.geometry !== allowed.get(code)) throw new Error(`R812 contract: ${viewName} ${code} must use ${allowed.get(code)} geometry`);
            const coordinateOf = (endpoint, label) => {
                const imagePoint = endpoint && endpoint.image;
                if(!Array.isArray(imagePoint) || imagePoint.length < 2 || !Number.isFinite(imagePoint[0]) || !Number.isFinite(imagePoint[1]))
                    throw new Error(`R815 contract: ${viewName} ${code} ${label} must contain two finite image-index coordinates`);
                return imagePoint;
            };
            if(a.geometry === "point") {
                coordinateOf(a.point, "point");
            } else {
                const pa = coordinateOf(a.pointA, "pointA");
                const pb = coordinateOf(a.pointB, "pointB");
                if(Math.hypot(pb[0]-pa[0], pb[1]-pa[1]) < 1e-6)
                    throw new Error(`R815 contract: ${viewName} ${code} line endpoints must be distinct`);
            }
            if(a.view != null && a.view !== viewName) throw new Error(`R812 contract: annotation view label does not match ${viewName}`);
            if(a.imageId != null && String(a.imageId)!==String(image.id)) throw new Error(`R812 contract: ${viewName} annotation references a different image id`);
            if(codes.has(code)) throw new Error(`R812 contract: duplicate semantic code in ${viewName}: ${code}`);
            codes.add(code);
        }
        // R815: semantic codes are a supported vocabulary, not a per-view checklist.
        // The canonical XrayObservation contract permits sparse annotation subsets;
        // downstream reconstruction stages decide whether the available geometry
        // is sufficient. Do not turn missing optional annotations into contract errors.
    }
}

/* R815 candidate-only shared public-boundary guard. The R814 all-hinges-per-view requirement has been removed because the canonical observation contract allows sparse semantic subsets.
   Native behavior observed in R813: the R812 validator guarded only the legacy
   `reconstruct()` alias, while callers could invoke the exported primary
   `reconstructComplete()` method directly and bypass the contract checks. This
   patch guards both public entry points and converts contract-validation failures
   into the engine's ordinary result shape (`valid:false`, `stage`, `reason`,
   `diagnostics`) rather than throwing an uncaught validation exception. The
   underlying camera, triangulation, registration, and clinical math are not modified.
   R838 sets the provisional held-out RMS gate to 3.00 px. */
function r814ValidateOrResult(input) {
    try {
        validateR815ObservationContract(input);
        return null;
    } catch (error) {
        const message = String(error && error.message ? error.message : error);
        return {
            valid: false,
            stage: "invalid-input",
            reason: message,
            diagnostics: {
                error: message,
                validationErrors: [message],
                validationStage: "observation-contract"
            }
        };
    }
}
const r814ReconstructComplete = window.Reconstruction.reconstructComplete;
window.Reconstruction.validateObservationContract = function(input) {
    const result = r814ValidateOrResult(input);
    return result
        ? { valid: false, errors: result.diagnostics.validationErrors }
        : { valid: true, errors: [] };
};
window.Reconstruction.reconstructComplete = function(input) {
    const invalid = r814ValidateOrResult(input);
    if (invalid) return invalid;
    return r814ReconstructComplete(input);
};
window.Reconstruction.reconstruct = function(input) {
    return window.Reconstruction.reconstructComplete(input);
};