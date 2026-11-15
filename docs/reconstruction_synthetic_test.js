/*
R639 — MASTER ROTATION ANGLE SWEEP WITHOUT MASTER ANNOTATION
===============================================
This is the R257 synthetic regression layer with the obsolete historical
4+4 strut attachment block replaced by the verified STANDARD_HEXAPOD S1-S6
topology. All existing R257 clinical inputs, diagnostics, detailed result
data, and human-readable reporting are retained.

R376/R384/R385 were verification tests; their result is now incorporated
here as the single active synthetic strut geometry.
*/

"use strict";
/* R553 — INDEPENDENT LINE EXTENTS + DETERMINISTIC PIXEL NOISE
   Use infinite axis directions when PBE/DBE are intentionally absent.
*/
/* R509 — SYNTHETIC AXIS ACCURACY DIAGNOSTIC
   Adds truth-based PF/DF mechanical-axis error reporting only.
   Reconstruction math remains unchanged.
*/
/* R627 — retain the programmatic load marker but remove the obsolete floating
   yellow "reconstruction_synthetic_test version loaded" badge. */
window.__RECONSTRUCTION_SYNTHETIC_TEST_R472_LOADED = true;
(function(){
    const old = document.getElementById("r472SyntheticLoadIndicator");
    if(old) old.remove();
})();


/*
===============================================================================
R257 — SYNTHETIC REGRESSION / INTERACTIVE TEST LAYER
-------------------------------------------------------------------------------
This file owns ONLY synthetic data construction and end-to-end test orchestration.

It deliberately does NOT contain reconstruction mathematics.
The production engine remains in reconstruction.js and receives the same
renderer-neutral observation contract that the future VTK annotation layer will
produce.

Synthetic pipeline:
    known 3D case
        ↓
    synthetic AP/LAT projections
        ↓
    complete observation contract
        ↓
    Reconstruction.reconstruct()
        ↓
    reconstructed 3D state + CASE patch
        ↓
    synthetic-truth comparison

When real X-ray observations become available, this file is not part of the
clinical input path. VTK will populate the same observation contract directly.
===============================================================================
*/

const RECONSTRUCTION_SYNTHETIC_TEST_VERSION = "R639";
const SYNTHETIC_SCHEMA = "XrayCompleteReconstructionInput";
const SYNTHETIC_SCHEMA_VERSION = "1.0";

const SYNTHETIC_TEST_CONFIG = {
    laterality:"right",
    mounting:{
        ap_offset:5.0,
        ap_offset_direction:"medial",
        lat_offset:45.0,
        lat_offset_direction:"posterior",
        axial_offset:46.0,
        axial_offset_direction:"proximal",
        ap_tilt:1.0,
        ap_tilt_direction:"proximal",
        lat_tilt:11.0,
        lat_tilt_direction:"distal",
        master_rotation:2.0,
        master_rotation_direction:"external"
    },
    deformity:{
        ap_translation:22.0,
        ap_translation_direction:"medial",
        lat_translation:1.0,
        lat_translation_direction:"anterior",
        bone_length:2.0,
        bone_length_direction:"short",
        ap_angulation:6.0,
        ap_angulation_direction:"valgus",
        lat_angulation:14.0,
        lat_angulation_direction:"anterior",
        bone_rotation:5.0,
        bone_rotation_direction:"internal"
    },
    imaging:{
        latPlaneAngleDeg:90.0
    },
    loc:{
        enabled:true,
        ap:12.0,
        ap_direction:"medial",
        lat:8.0,
        lat_direction:"posterior",
        axial:25.0,
        axial_direction:"proximal"
    }
};

function cloneConfig(config){
    return JSON.parse(JSON.stringify(config));
}

/* R257: clinical input is magnitude + explicit clinical direction.
   Mathematical signs are created only inside the synthetic builder. */
function clinicalSignedMagnitude(value,direction,positiveDirection,negativeDirection){
    const magnitude=Math.abs(Number(value)||0);
    if(magnitude < 1e-12) return 0;
    if(direction===positiveDirection) return magnitude;
    if(direction===negativeDirection) return -magnitude;
    throw new Error(`R257: invalid direction "${direction}"; expected "${positiveDirection}" or "${negativeDirection}".`);
}
function oppositeDirection(direction){
    const map={internal:"external",external:"internal",medial:"lateral",lateral:"medial",anterior:"posterior",posterior:"anterior",proximal:"distal",distal:"proximal",short:"long",long:"short",valgus:"varus",varus:"valgus"};
    return map[direction] || direction;
}
function clinicalDirectionValue(value,direction){
    const magnitude=Math.abs(Number(value)||0);
    return {value:magnitude,direction:magnitude < 1e-12 ? null : direction};
}
function expectedClinicalFromConfigR257(config){
    const m=config.mounting,d=config.deformity,l=config.loc;
    return {mounting:{
        ap_offset:clinicalDirectionValue(m.ap_offset,m.ap_offset_direction),
        lat_offset:clinicalDirectionValue(m.lat_offset,m.lat_offset_direction),
        axial_offset:clinicalDirectionValue(m.axial_offset,m.axial_offset_direction),
        ap_tilt:clinicalDirectionValue(m.ap_tilt,m.ap_tilt_direction),
        lat_tilt:clinicalDirectionValue(m.lat_tilt,m.lat_tilt_direction),
        master_rotation:clinicalDirectionValue(m.master_rotation,m.master_rotation_direction)
    },deformity:{
        ap_translation:clinicalDirectionValue(d.ap_translation,d.ap_translation_direction),
        lat_translation:clinicalDirectionValue(d.lat_translation,d.lat_translation_direction),
        bone_length:clinicalDirectionValue(d.bone_length,d.bone_length_direction),
        ap_angulation:clinicalDirectionValue(d.ap_angulation,d.ap_angulation_direction),
        lat_angulation:clinicalDirectionValue(d.lat_angulation,d.lat_angulation_direction),
        bone_rotation:clinicalDirectionValue(d.bone_rotation,d.bone_rotation_direction),
        loc:l.enabled?{enabled:true,
            ap:clinicalDirectionValue(l.ap,l.ap_direction),
            lat:clinicalDirectionValue(l.lat,l.lat_direction),
            axial:clinicalDirectionValue(l.axial,l.axial_direction)
        }:{enabled:false,ap:{value:0,direction:null},lat:{value:0,direction:null},axial:{value:0,direction:null}}
    }};
}
function expectedClinicalForOutputLaterality(config,inputLaterality,outputLaterality){
    const expected=expectedClinicalFromConfigR257(config);
    if(inputLaterality===outputLaterality) return expected;
    const flip=d=>oppositeDirection(d);
    // Only quantities whose clinical meaning depends on the anatomical
    // lateral side change when the same physical geometry is reinterpreted
    // under the opposite laterality. Anterior/posterior and proximal/distal
    // quantities tied to the shared +Y/+Z references do not flip.
    for(const k of ["ap_offset","ap_tilt","master_rotation"]){
        expected.mounting[k].direction=flip(expected.mounting[k].direction);
    }
    for(const k of ["ap_translation","ap_angulation","bone_rotation"]){
        expected.deformity[k].direction=flip(expected.deformity[k].direction);
    }
    expected.deformity.loc.ap.direction=flip(expected.deformity.loc.ap.direction);
    return expected;
}

function degToRad(deg){
    return Number(deg) * Math.PI / 180;
}

function matMul3(A,B){
    return A.map(r => B[0].map((_,j) =>
        r.reduce((sum,v,k) => sum + v * B[k][j], 0)
    ));
}

function matVec3(A,v){
    return A.map(r => r.reduce((sum,x,i) => sum + x * v[i], 0));
}

function add3(a,b){ return a.map((v,i) => v + b[i]); }
function sub3(a,b){ return a.map((v,i) => v - b[i]); }
function norm3(a){ return Math.hypot(a[0],a[1],a[2]); }
function normalize3(a){
    const n = norm3(a);
    if(n < 1e-12) throw new Error("Synthetic test: zero-length vector.");
    return a.map(v => v / n);
}
/* R636 — sparse-only coherent physical scene.
   Keep buildR213GeometricCaseInput() frozen for the protected R257 round-trip.
   The sparse/DICOM scene needs the ring roll represented consistently in the
   proximal hardware, distal hardware, and anatomy. This builder rotates the
   complete physical scene but leaves patient anterior (+Y) fixed. */
function buildSparseGeometricCaseInput(config=SYNTHETIC_TEST_CONFIG){
    const input=buildR213GeometricCaseInput(config);
    const truth=input.syntheticTruth;
    const cameras=truth.cameraMatrices;
    const params=cloneConfig(config);
    const right=params.laterality!=='left';
    const desiredMasterSignedDeg=clinicalSignedMagnitude(
        params.mounting.master_rotation,
        params.mounting.master_rotation_direction,
        right?'internal':'external',
        right?'external':'internal'
    );
    const baseAxis=truth.proximalAxis.slice();
    const anterior=[0,1,0];
    function rotatePointZ(p,angleDeg){
        const a=degToRad(angleDeg),c=Math.cos(a),s=Math.sin(a);
        return [c*p[0]-s*p[1],s*p[0]+c*p[1],p[2]];
    }
    function cross3(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
    function dot3(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
    function masterSignedForAngle(angleDeg){
        const delta=angleDeg-90;
        const axis=normalize3(rotatePointZ(baseAxis,delta));
        const a=degToRad(angleDeg),radial=[Math.cos(a),Math.sin(a),0];
        const ringSagittal=normalize3(cross3(radial,[0,0,1]));
        const fragmentSagittal=normalize3(cross3(anterior,axis));
        return Math.atan2(dot3(axis,cross3(fragmentSagittal,ringSagittal)),dot3(fragmentSagittal,ringSagittal))*180/Math.PI;
    }
    let lo=60,hi=120;
    for(let i=0;i<70;i++){
        const mid=(lo+hi)/2;
        if(masterSignedForAngle(mid)>desiredMasterSignedDeg) hi=mid; else lo=mid;
    }
    const masterAngleDeg=(lo+hi)/2;
    const rollDeg=masterAngleDeg-90;
    const rollRad=degToRad(rollDeg);
    const Rz=rotationZXY([0,0,rollDeg]);
    const originalMountingR=truth.proximalMountingPose.R.map(row=>row.slice());
    const originalOrigin=truth.proximalOrigin.slice();
    const originalPBE=truth.PBE.slice();
    const originalDBE=truth.DBE.slice();
    const originalDRP=add3(originalOrigin,matVec3(originalMountingR,truth.deformityTranslation));
    const originalLOC=truth.LOC?truth.LOC.slice():null;
    const originalOrientB=add3(originalOrigin,matVec3(originalMountingR,[0,30,0]));

    // Rotate both endpoints of every physical strut, preserving lengths and
    // ensuring P, D, and DIR observations all come from one scene geometry.
    for(const strut of input.struts){
        if(!Array.isArray(strut.proximalPoint3D)||!Array.isArray(strut.distalPoint3D)) continue;
        const p=rotatePointZ(strut.proximalPoint3D,rollDeg);
        const d=rotatePointZ(strut.distalPoint3D,rollDeg);
        strut.proximalPoint3D=p; strut.distalPoint3D=d;
        strut.AP={pointA:project(cameras.AP,p),pointB:project(cameras.AP,d)};
        strut.LAT={pointA:project(cameras.LAT,p),pointB:project(cameras.LAT,d)};
        strut.recordedLengthMm=distance3(p,d);
    }
    input.recordedStrutLengthsMm=input.struts.map(s=>s.recordedStrutLengthsMm??s.recordedLengthMm);
    input.recordedStrutLengthsMm=input.struts.map(s=>s.recordedLengthMm);

    const proxOrigin=rotatePointZ(originalOrigin,rollDeg);
    const PBE=rotatePointZ(originalPBE,rollDeg);
    const DRP=rotatePointZ(originalDRP,rollDeg);
    const DBE=rotatePointZ(originalDBE,rollDeg);
    const LOC=originalLOC?rotatePointZ(originalLOC,rollDeg):null;
    const orientB=rotatePointZ(originalOrientB,rollDeg);
    const proxAxis=normalize3(rotatePointZ(baseAxis,rollDeg));
    const distalAxis=normalize3(rotatePointZ(truth.distalAxis,rollDeg));
    const masterRadius=113.5,ringCenter=[0,0,60],ma=degToRad(masterAngleDeg);
    const masterPoint=[ringCenter[0]+masterRadius*Math.cos(ma),ringCenter[1]+masterRadius*Math.sin(ma),ringCenter[2]];
    const pointObs=p=>({AP:project(cameras.AP,p),LAT:project(cameras.LAT,p),coordinateSystem:'imageIndex',source:'synthetic-R636-sparse-scene',status:'committed'});
    const lineObs=(a,b)=>({AP:{pointA:project(cameras.AP,a),pointB:project(cameras.AP,b)},LAT:{pointA:project(cameras.LAT,a),pointB:project(cameras.LAT,b)},coordinateSystem:'imageIndex',source:'synthetic-R636-sparse-scene',status:'committed'});
    input.anatomy.PFCL=lineObs(proxOrigin,PBE);
    input.anatomy.PRP=pointObs(proxOrigin);
    input.anatomy.DFCL=lineObs(DBE,DRP);
    input.anatomy.DRP=pointObs(DRP);
    if(LOC) input.anatomy.LOC=pointObs(LOC); else input.anatomy.LOC=null;
    input.anatomy.proximalOrientationReference=lineObs(proxOrigin,orientB);
    input.anatomy.masterTabReference=pointObs(masterPoint);

    // Keep synthetic ground-truth metadata aligned with the same transformed scene.
    truth.proximalRingPose={R:matMul3(Rz,truth.proximalRingPose.R),t:rotatePointZ(truth.proximalRingPose.t,rollDeg)};
    const originalDistalPose=input.hardwareGeometry.distalRingPose;
    truth.distalRingPose={R:matMul3(Rz,originalDistalPose.R),t:rotatePointZ(originalDistalPose.t,rollDeg)};
    truth.proximalMountingPose={R:matMul3(Rz,originalMountingR),t:proxOrigin.slice()};
    truth.proximalOrigin=proxOrigin;
    truth.proximalAxis=proxAxis;
    truth.PBE=PBE;
    truth.DRP=DRP;
    truth.DBE=DBE;
    truth.LOC=LOC;
    truth.distalAxis=distalAxis;
    truth.masterTabReference=masterPoint;
    truth.masterTabPhysicalRingAngleDeg=masterAngleDeg;
    truth.sparseSceneRollDeg=rollDeg;
    input.hardwareGeometry.proximalRingPose=truth.proximalRingPose;
    input.hardwareGeometry.distalRingPose=truth.distalRingPose;
    for(const view of ['AP','LAT']){
        for(const cal of input.calibration[view]||[]){
            cal.model3D=rotatePointZ(cal.model3D,rollDeg);
            cal.image2D=project(cameras[view],cal.model3D);
        }
    }
    return input;
}

function distance3(a,b){ return norm3(sub3(a,b)); }

/*
    Rotation convention is the project's established ZXY convention.
*/
function rotationZXY([rz,rx,ry]){
    const z = degToRad(rz), x = degToRad(rx), y = degToRad(ry);
    const cz=Math.cos(z), sz=Math.sin(z);
    const cx=Math.cos(x), sx=Math.sin(x);
    const cy=Math.cos(y), sy=Math.sin(y);

    const Rz = [
        [cz,-sz,0],
        [sz, cz,0],
        [0,0,1]
    ];
    const Rx = [
        [1,0,0],
        [0,cx,-sx],
        [0,sx, cx]
    ];
    const Ry = [
        [cy,0,sy],
        [0,1,0],
        [-sy,0,cy]
    ];

    return matMul3(matMul3(Rz,Rx),Ry);
}

function project(P,p){
    if(!window.Reconstruction ||
       typeof window.Reconstruction.projectPoint !== "function"){
        throw new Error("Synthetic reconstruction test requires Reconstruction.projectPoint().");
    }
    return window.Reconstruction.projectPoint(P,p);
}

function buildSyntheticCameras(config=SYNTHETIC_TEST_CONFIG){
    /*
       R393 — CAMERA DIRECTION AUDIT / FIX
       -----------------------------------
       The 3D truth is deliberately untouched here.

       Physical camera convention:
         AP         : source +Y, shoots -Y
         LAT RIGHT  : source +X, shoots -X
         LAT LEFT   : source -X, shoots +X

       The image axes are kept physically meaningful:
         AP  : horizontal = X, vertical = Z
         LAT : horizontal = Y, vertical = Z

       `latPlaneAngleDeg` is retained as the synthetic LAT orientation
       parameter.  At 90 degrees it gives the orthogonal medial/lateral
       LAT view.  Values below 90 tilt the shooting direction toward -Z.
       Values above 90 tilt it farther toward the medial/lateral direction.

       The camera matrices below are ordinary 3x4 projective matrices.  They
       are the ONLY known cameras used to generate the synthetic observations.
       The inverse reconstruction engine never receives these matrices as
       solver truth; it receives only the resulting 2D observations.
    */

    const K = [
        [800,0,320],
        [0,800,240],
        [0,0,1]
    ];

    const focal = 800;
    const cx = 320;
    const cy = 240;

    // Finite source distance keeps the synthetic cameras genuinely
    // projective while remaining effectively orthogonal at this scale.
    const sourceDistance = 1000;

    function dot3(a,b){
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    }

    function cross3(a,b){
        return [
            a[1]*b[2] - a[2]*b[1],
            a[2]*b[0] - a[0]*b[2],
            a[0]*b[1] - a[1]*b[0]
        ];
    }

    function neg3(a){ return a.map(v => -v); }

    function makeCamera({center,direction,right,up,label}){
        const d = normalize3(direction);
        const r = normalize3(right);
        const u = normalize3(up);

        if(Math.abs(dot3(d,r)) > 1e-9 ||
           Math.abs(dot3(d,u)) > 1e-9 ||
           Math.abs(dot3(r,u)) > 1e-9){
            throw new Error(`R393: ${label} camera basis is not orthogonal.`);
        }

        // Camera-coordinate rows are R = [right; up; forward].
        // P = K [R | -R*C].
        const t = [
            -dot3(r,center),
            -dot3(u,center),
            -dot3(d,center)
        ];

        const P = [
            [
                focal*r[0] + cx*d[0],
                focal*r[1] + cx*d[1],
                focal*r[2] + cx*d[2],
                focal*t[0] + cx*t[2]
            ],
            [
                focal*u[0] + cy*d[0],
                focal*u[1] + cy*d[1],
                focal*u[2] + cy*d[2],
                focal*t[1] + cy*t[2]
            ],
            [d[0],d[1],d[2],t[2]]
        ];

        return {
            matrix:P,
            center:center.slice(),
            direction:d,
            imageRight:r,
            imageUp:u,
            label
        };
    }

    // ---------------------------------------------------------------------
    // AP: source +Y, shooting toward -Y.
    // Image horizontal follows +X.  Image vertical follows -Z because
    // image pixel v increases downward.
    // ---------------------------------------------------------------------
    const APcamera = makeCamera({
        center:[0,sourceDistance,0],
        direction:[0,-1,0],
        right:[1,0,0],
        up:[0,0,-1],
        label:"AP +Y -> -Y"
    });

    const laterality =
        String(config?.laterality || "right").toLowerCase() === "left"
            ? "left"
            : "right";

    const angleDeg = Number(config?.imaging?.latPlaneAngleDeg ?? 90);
    if(!(angleDeg>0 && angleDeg<=180)){
        throw new Error("R393: LAT camera orientation angle must be > 0 and <= 180 degrees.");
    }

    const a = degToRad(angleDeg);
    const lateralSign = laterality === "right" ? -1 : 1;

    // At 90 degrees:
    //   RIGHT -> direction [-1,0,0]  (+X source, shoots -X)
    //   LEFT  -> direction [+1,0,0]  (-X source, shoots +X)
    // The -Z component preserves a continuous tilt parameter away from
    // the pure lateral view.
    const latDirection = [
        lateralSign * Math.sin(a),
        0,
        -Math.cos(a)
    ];

    const latCenter = [
        -latDirection[0] * sourceDistance,
        0,
        -latDirection[2] * sourceDistance
    ];

    // R443 — standard lateral radiographic display orientation.
    // The physical camera direction remains unchanged: RIGHT is +X -> -X
    // and LEFT is -X -> +X.  For the displayed lateral image, anterior
    // (+Y) is placed on the LEFT side of the image for both laterality cases.
    // Therefore the camera image-right basis is -Y for RIGHT and +Y for LEFT.
    const latRight = laterality === "right"
        ? [0,-1,0]
        : [0,1,0];
    /* R635: when the LAT source direction is oblique, image-up must remain
       perpendicular to the viewing direction. Projecting a fixed -Z vector
       into the camera plane preserves a valid pinhole camera basis. At 90°
       this reduces exactly to the prior standard lateral up direction. */
    const latUp = normalize3(cross3(latRight,latDirection));

    const LATcamera = makeCamera({
        center:latCenter,
        direction:latDirection,
        right:latRight,
        up:latUp,
        label:laterality === "right"
            ? "LAT RIGHT +X -> -X"
            : "LAT LEFT -X -> +X"
    });

    return {
        K,
        AP:APcamera.matrix,
        LAT:LATcamera.matrix,
        cameraDefinition:{
            test:"R393 — CAMERA DIRECTION AUDIT",
            laterality,
            sourceDistance,
            AP:{
                sourceSide:"+Y",
                shootingDirection:"-Y",
                center:APcamera.center,
                direction:APcamera.direction,
                imageRight:APcamera.imageRight,
                imageUp:APcamera.imageUp
            },
            LAT:{
                sourceSide:laterality === "right" ? "+X" : "-X",
                shootingDirection:laterality === "right" ? "-X" : "+X",
                center:LATcamera.center,
                direction:LATcamera.direction,
                imageRight:LATcamera.imageRight,
                imageUp:LATcamera.imageUp,
                planeAngleDeg:angleDeg
            }
        },
        latPlaneAngleDeg:angleDeg
    };
}


function runR393CameraDirectionAudit(){
    const vectorClose=(a,b,tol=1e-12)=>a.length===b.length && a.every((v,i)=>Math.abs(v-b[i])<tol);
    const cases=[];

    for(const laterality of ["right","left"]){
        const cfg=cloneConfig(SYNTHETIC_TEST_CONFIG);
        cfg.laterality=laterality;
        const cameras=buildSyntheticCameras(cfg);
        const def=cameras.cameraDefinition;

        const expectedLATDirection=laterality==="right" ? [-1,0,0] : [1,0,0];
        const expectedLATSource=laterality==="right" ? "+X" : "-X";
        const expectedLATShoot=laterality==="right" ? "-X" : "+X";

        const pass =
            vectorClose(def.AP.direction,[0,-1,0]) &&
            def.AP.sourceSide==="+Y" &&
            def.AP.shootingDirection==="-Y" &&
            vectorClose(def.LAT.direction,expectedLATDirection) &&
            def.LAT.sourceSide===expectedLATSource &&
            def.LAT.shootingDirection===expectedLATShoot &&
            vectorClose(def.AP.imageRight,[1,0,0]) &&
            vectorClose(def.AP.imageUp,[0,0,-1]) &&
            vectorClose(def.LAT.imageUp,[0,0,-1]);

        cases.push({
            laterality,
            status:pass?"PASS":"FAIL",
            AP:def.AP,
            LAT:def.LAT,
            expected:{
                AP:{sourceSide:"+Y",shootingDirection:"-Y",direction:[0,-1,0]},
                LAT:{sourceSide:expectedLATSource,shootingDirection:expectedLATShoot,direction:expectedLATDirection}
            }
        });
    }

    return {
        test:"R393 — CAMERA DIRECTION AUDIT",
        status:cases.every(c=>c.status==="PASS")?"PASS":"FAIL",
        cases
    };
}

function buildSyntheticBaseInput(config=SYNTHETIC_TEST_CONFIG){

    const cameras = buildSyntheticCameras(config);

    /*
       This base input contains only the common imaging/calibration/frame
       observations needed by the current R248 regression.

       The actual proximal/distal anatomy is constructed by
       buildR213GeometricCaseInput() below.  Keeping the base case free of
       obsolete cut-point fields is intentional: PBE/DBE are now centerline
       endpoints, while PRP/DRP remain independent reference points.
    */
    // R395 — AUTHORITATIVE DAY-0 RING POSES
    // --------------------------------------
    // Proximal ring: identity pose.
    // Distal ring: the verified Day-0 mechanical pose already established
    // by the FK / strut-length truth.  Do NOT recreate a second synthetic
    // the verified Day-0 pose.  The distal attachment points are local to this ring
    // and are transformed by this pose.
    const ringR = rotationZXY([0,0,0]);
    const ringT = [0,0,0];
    const distalRingR = [
        [0.972791842439594, -0.223584701122995, 0.060711718034653],
        [0.223348022734208,  0.974679548440000, 0.010744235362098],
        [-0.061576716571262, 0.003107937666336, 0.998097514624581]
    ];
    const distalRingT = [
        23.545586472285109,
        11.088488698765145,
        -159.501165999364957
    ];

    const radius = 99;
    const modelRing = [];

    for(const angle of [0,90,180,270]){
        const a = degToRad(angle);
        const localPoint = [
            radius * Math.cos(a),
            radius * Math.sin(a),
            0
        ];
        modelRing.push(add3(matVec3(ringR,localPoint),ringT));
    }

    for(const angle of [0,90,180,270]){
        const a = degToRad(angle);
        const localPoint = [
            radius * Math.cos(a),
            radius * Math.sin(a),
            0
        ];
        modelRing.push(add3(matVec3(distalRingR,localPoint),distalRingT));
    }

    const ringWorld = modelRing.slice();

    const input = {
        schema:SYNTHETIC_SCHEMA,
        schemaVersion:SYNTHETIC_SCHEMA_VERSION,
        images:{
            AP:{
                id:"synthetic-AP",
                source:"synthetic",
                coordinateSystem:"imageIndex",
                unit:"pixel"
            },
            LAT:{
                id:"synthetic-LAT",
                source:"synthetic",
                coordinateSystem:"imageIndex",
                unit:"pixel"
            }
        },
        calibration:{AP:[],LAT:[]},
        struts:[],
        anatomy:{
            PFCL:null,
            PRP:null,
            DFCL:null,
            DRP:null,
            proximalOrientationReference:null,
            masterTabReference:null
        },
        manualClinical:{
            axialRotationDeg:7,
            direction:"internal",
            source:"synthetic-clinical-input"
        },
        recordedStrutLengthsMm:[]
    };

    for(let i=0;i<modelRing.length;i++){
        input.calibration.AP.push({
            id:`CAL-${i+1}`,
            model3D:modelRing[i],
            image2D:project(cameras.AP,ringWorld[i])
        });
        input.calibration.LAT.push({
            id:`CAL-${i+1}`,
            model3D:modelRing[i],
            image2D:project(cameras.LAT,ringWorld[i])
        });
    }

    /*
       Six independent strut observations.

       IMPORTANT R386 CHANGE:
       The historical R257 4+4 strutPairs arrangement is replaced here by
       the verified STANDARD_HEXAPOD S1-S6 topology traced from simulation.py.

       The surrounding synthetic construction is intentionally unchanged:
         ring geometry -> attachment endpoints -> 3D length -> AP/LAT
         projection -> synthetic observation.

       Hardware geometry:
         hole-center radius = 113.5 mm
         hole step          = 7.5 deg
         proximal mounting offset = -17 mm
         distal mounting offset   = +17 mm

       The distal ring uses the verified Day-0 rigid pose.  Its local center
       is [0,0,0], and the distal strut attachments are local z=+17 mm.
       The world endpoints therefore come from distalRingR/distalRingT.
       This is the same mechanical pose that reproduces the verified
       Day-0 strut lengths [146,155,179,132,180,141] mm.

       No Euler clinical parameters are introduced here.
    */
    const HARDWARE_ANCHOR_RADIUS = 113.5;
    const HARDWARE_HOLE_STEP = degToRad(7.5);
    const HARDWARE_PROX_Z = -17;
    const HARDWARE_DIST_Z = 17;

    const PROX_TAB_TOP = degToRad(90);
    const PROX_TAB_LEFT = degToRad(210);
    const PROX_TAB_RIGHT = degToRad(330);
    const DIST_TAB_TOP_RIGHT = degToRad(30);
    const DIST_TAB_TOP_LEFT = degToRad(150);
    const DIST_TAB_BOTTOM = degToRad(270);

    function hardwarePoint(tabAngle,sign,z){
        const a = tabAngle + sign*HARDWARE_HOLE_STEP;
        return [
            HARDWARE_ANCHOR_RADIUS*Math.cos(a),
            HARDWARE_ANCHOR_RADIUS*Math.sin(a),
            z
        ];
    }

    const hardwareProx = {
        S1:hardwarePoint(PROX_TAB_TOP,+1,HARDWARE_PROX_Z),
        S2:hardwarePoint(PROX_TAB_TOP,-1,HARDWARE_PROX_Z),
        S3:hardwarePoint(PROX_TAB_RIGHT,+1,HARDWARE_PROX_Z),
        S4:hardwarePoint(PROX_TAB_RIGHT,-1,HARDWARE_PROX_Z),
        S5:hardwarePoint(PROX_TAB_LEFT,+1,HARDWARE_PROX_Z),
        S6:hardwarePoint(PROX_TAB_LEFT,-1,HARDWARE_PROX_Z)
    };

    const hardwareDist = {
        S1:hardwarePoint(DIST_TAB_TOP_LEFT,-1,HARDWARE_DIST_Z),
        S2:hardwarePoint(DIST_TAB_TOP_RIGHT,+1,HARDWARE_DIST_Z),
        S3:hardwarePoint(DIST_TAB_TOP_RIGHT,-1,HARDWARE_DIST_Z),
        S4:hardwarePoint(DIST_TAB_BOTTOM,+1,HARDWARE_DIST_Z),
        S5:hardwarePoint(DIST_TAB_BOTTOM,-1,HARDWARE_DIST_Z),
        S6:hardwarePoint(DIST_TAB_TOP_LEFT,+1,HARDWARE_DIST_Z)
    };

    function lineObservation(A,B){
        return {
            AP:{pointA:project(cameras.AP,A),pointB:project(cameras.AP,B)},
            LAT:{pointA:project(cameras.LAT,A),pointB:project(cameras.LAT,B)},
            coordinateSystem:"imageIndex",
            source:"synthetic",
            status:"committed"
        };
    }

    for(let i=1;i<=6;i++){
        const id=`S${i}`;
        const A = add3(matVec3(ringR,hardwareProx[id]),ringT);
        const B = add3(matVec3(distalRingR,hardwareDist[id]),distalRingT);
        const length = distance3(A,B);
        const obs = lineObservation(A,B);
        input.struts.push({
            id,
            AP:obs.AP,
            LAT:obs.LAT,
            recordedLengthMm:length,
            // Test-only world endpoints let all sparse observations share one physical geometry.
            proximalPoint3D:A.slice(),
            distalPoint3D:B.slice(),
            source:"synthetic",
            status:"committed"
        });
        input.recordedStrutLengthsMm.push(length);
    }

    input.hardwareGeometry = {
        id:"STANDARD_HEXAPOD",
        anchorRadiusMm:HARDWARE_ANCHOR_RADIUS,
        holeStepDeg:7.5,
        mountingOffsetMm:17,
        topology:"simulation.py S1-S6",
        proximalRingPose:{R:ringR,t:ringT},
        distalRingPose:{R:distalRingR,t:distalRingT},
        source:"verified Day-0 mechanical pose"
    };

    input.syntheticTruth = {
        proximalRingPose:{R:ringR,t:ringT},
        distalRingPose:{R:distalRingR,t:distalRingT},
        cameraMatrices:cameras
    };

    return input;
}

// Keep the old internal name as a compatibility alias while callers are
// migrated. It is deliberately not exported as part of the public test API.
const buildSyntheticInput = buildSyntheticBaseInput;

// ============================================================
// R213 — GEOMETRIC CLINICAL-TRUTH CASE
// ============================================================

/*
   R213 is deliberately different from the older R205 default-case test.

   R205 legacy synthetic input:
     - mounting and deformity rotation were created from ZXY/Euler values;
     - reconstruction then converted the recovered 3D geometry to clinical
       AP/LAT angles.
     - Therefore the clinical output angles were not required to equal the
       Euler input components.

   R213 synthetic input:
     - mounting tilt is defined directly as the geometric clinical tilt;
     - deformity AP/LAT angulation is defined directly from the projected
       proximal/distal mechanical axes;
     - axial bone rotation remains an explicit manual clinical input;
     - Master Tab rotation is supplied as a physical ring reference point.

   The purpose is a true round-trip test:

       clinical geometric truth
            -> 3D geometry
            -> synthetic AP/LAT observations
            -> reconstruction
            -> clinical geometric output

   Therefore the reconstructed AP/LAT angles should agree with the synthetic
   clinical truth apart from numerical reconstruction error.
*/

const R213_GEOMETRIC_PARAMS = cloneConfig(SYNTHETIC_TEST_CONFIG);

/*
   Return a rotation matrix that maps +Z onto the supplied unit axis using
   the minimum-angle rotation.  R213 uses this only to construct a distal
   frame from an already-defined geometric axis; it is not a clinical Euler
   input.
*/
function minimalAxisAlignmentR213(targetAxis){
    const z = [0,0,1];
    const d = normalize3(targetAxis);
    const c = Math.max(-1,Math.min(1,
        z[0]*d[0] + z[1]*d[1] + z[2]*d[2]
    ));

    if(c > 1 - 1e-12){
        return [[1,0,0],[0,1,0],[0,0,1]];
    }

    if(c < -1 + 1e-12){
        return rotationZXY([180,0,0]);
    }

    const axis = normalize3([
        z[1]*d[2] - z[2]*d[1],
        z[2]*d[0] - z[0]*d[2],
        z[0]*d[1] - z[1]*d[0]
    ]);
    const angle = Math.acos(c);
    const x=axis[0], y=axis[1], zc=axis[2];
    const s=Math.sin(angle), co=Math.cos(angle), v=1-co;

    return [
        [co+x*x*v,   x*y*v-zc*s, x*zc*v+y*s],
        [y*x*v+zc*s, co+y*y*v,   y*zc*v-x*s],
        [zc*x*v-y*s, zc*y*v+x*s, co+zc*zc*v]
    ];
}

function buildR213GeometricCaseInput(config=SYNTHETIC_TEST_CONFIG){
    const params=cloneConfig(config);

    /*
       Start from the established synthetic camera/frame/strut construction.
       Only the clinical anatomy and mounting truth are replaced here.
       This keeps R213 focused on the geometric clinical conversion rather
       than creating a second imaging/calibration test.
    */
    const input = buildSyntheticBaseInput(params);
    input.laterality = params.laterality;

    const cameras = input.syntheticTruth.cameraMatrices;

    /*
       ------------------------------------------------------------
       1. PROXIMAL MOUNTING — GEOMETRIC TRUTH
       ------------------------------------------------------------

       The proximal ring itself remains the reference frame (identity pose).
       The proximal mechanical axis is constructed directly from the two
       clinical ring-side tilts:

         AP clinical tilt is defined from the anatomical lateral-side
         direction. Positive clinical AP tilt means that lateral-side
         direction points toward proximal. The required mathematical X
         component therefore changes with laterality:
           RIGHT lateral side = -X
           LEFT  lateral side = +X

       No ZXY/Euler mounting angles are used here.
    */
    const ringR = rotationZXY([0,0,0]);
    const ringT = [0,0,0];

    const right=params.laterality !== "left";
    const apOffsetSigned=clinicalSignedMagnitude(params.mounting.ap_offset,params.mounting.ap_offset_direction,right?"medial":"lateral",right?"lateral":"medial");
    const latOffsetSigned=clinicalSignedMagnitude(params.mounting.lat_offset,params.mounting.lat_offset_direction,"anterior","posterior");
    const axialOffsetSigned=clinicalSignedMagnitude(params.mounting.axial_offset,params.mounting.axial_offset_direction,"proximal","distal");
    const apTiltSigned=clinicalSignedMagnitude(params.mounting.ap_tilt,params.mounting.ap_tilt_direction,right?"distal":"proximal",right?"proximal":"distal");
    const latTiltSigned=clinicalSignedMagnitude(params.mounting.lat_tilt,params.mounting.lat_tilt_direction,"distal","proximal");
    const masterSignedClinical=clinicalSignedMagnitude(params.mounting.master_rotation,params.mounting.master_rotation_direction,right?"internal":"external",right?"external":"internal");
    const apTiltRad=degToRad(apTiltSigned);
    const latTiltRad=degToRad(latTiltSigned);

    const proxAxisRing = normalize3([
        Math.sin(apTiltRad),
        -Math.sin(latTiltRad),
        Math.sqrt(
            Math.max(
                0,
                1 -
                Math.sin(apTiltRad)**2 -
                Math.sin(latTiltRad)**2
            )
        )
    ]);

    /*
       Complete the proximal frame using +Y as the anatomical anterior
       reference.  The frame is constructed from geometry, not Euler angles.
    */
    const proxAnteriorRing = [0,1,0];
    const proxXRing = normalize3([
        proxAnteriorRing[1]*proxAxisRing[2] - proxAnteriorRing[2]*proxAxisRing[1],
        proxAnteriorRing[2]*proxAxisRing[0] - proxAnteriorRing[0]*proxAxisRing[2],
        proxAnteriorRing[0]*proxAxisRing[1] - proxAnteriorRing[1]*proxAxisRing[0]
    ]);
    const proxYRing = normalize3([
        proxAxisRing[1]*proxXRing[2] - proxAxisRing[2]*proxXRing[1],
        proxAxisRing[2]*proxXRing[0] - proxAxisRing[0]*proxXRing[2],
        proxAxisRing[0]*proxXRing[1] - proxAxisRing[1]*proxXRing[0]
    ]);

    const mountingR = [
        proxXRing,
        proxYRing,
        proxAxisRing
    ].map((_,row)=>[
        proxXRing[row],
        proxYRing[row],
        proxAxisRing[row]
    ]);

    // PRP is reconstructed in ring coordinates. Clinical mounting is then
    // defined directly as ringCenter - PRP, expressed in the ring frame.
    const proxOriginRing = [-apOffsetSigned,-latOffsetSigned,-axialOffsetSigned];
    const proxOriginWorld = proxOriginRing.slice();
    const proxAxisWorld = proxAxisRing.slice();
    const PBEWorld = add3(
        proxOriginWorld,
        matVec3(mountingR,[0,0,120])
    );

    /*
       Proximal orientation reference: +Y = anatomical anterior.
       This is independent of the proximal centerline and is required for
       the Master Tab / sagittal-plane calculation.
    */
    const orientA = proxOriginWorld.slice();
    const orientB = add3(
        orientA,
        matVec3(mountingR,[0,30,0])
    );

    /*
       ------------------------------------------------------------
       2. MASTER TAB — GEOMETRIC TRUTH
       ------------------------------------------------------------

       The engine measures Master Tab rotation from the physical radial
       reference point.  Because the proximal axis is tilted, the physical
       ring radial angle that produces exactly 2° External is not simply
       90°-2°.  Solve that geometric condition in the ring plane.
    */
    const desiredMasterSignedDeg = masterSignedClinical;
    const ringCenter = [0,0,60];
    const masterRadius = 113.5;
    const fragmentSagittalNormal = normalize3([
        proxAnteriorRing[1]*proxAxisRing[2] - proxAnteriorRing[2]*proxAxisRing[1],
        proxAnteriorRing[2]*proxAxisRing[0] - proxAnteriorRing[0]*proxAxisRing[2],
        proxAnteriorRing[0]*proxAxisRing[1] - proxAnteriorRing[1]*proxAxisRing[0]
    ]);

    function masterSignedForAngle(angleDeg){
        const a=degToRad(angleDeg);
        const radial=[Math.cos(a),Math.sin(a),0];
        const ringSagittal=normalize3([
            radial[1]*1-radial[2]*0,
            radial[2]*0-radial[0]*1,
            radial[0]*0-radial[1]*0
        ]);
        return Math.atan2(
            proxAxisRing[0]*(fragmentSagittalNormal[1]*ringSagittal[2]-fragmentSagittalNormal[2]*ringSagittal[1]) +
            proxAxisRing[1]*(fragmentSagittalNormal[2]*ringSagittal[0]-fragmentSagittalNormal[0]*ringSagittal[2]) +
            proxAxisRing[2]*(fragmentSagittalNormal[0]*ringSagittal[1]-fragmentSagittalNormal[1]*ringSagittal[0]),
            fragmentSagittalNormal[0]*ringSagittal[0] +
            fragmentSagittalNormal[1]*ringSagittal[1] +
            fragmentSagittalNormal[2]*ringSagittal[2]
        )*180/Math.PI;
    }

    let lo=60, hi=120;
    for(let i=0;i<60;i++){
        const mid=(lo+hi)/2;
        if(masterSignedForAngle(mid) > desiredMasterSignedDeg) hi=mid;
        else lo=mid;
    }
    const masterAngleDeg=(lo+hi)/2;

    const ma=degToRad(masterAngleDeg);
    const masterTabReferenceWorld=add3(
        ringCenter,
        [
            masterRadius*Math.cos(ma),
            masterRadius*Math.sin(ma),
            0
        ]
    );

    /*
       ------------------------------------------------------------
       3. DISTAL DEFORMITY — GEOMETRIC TRUTH
       ------------------------------------------------------------

       AP and LAT angulation are defined directly in the two clinical
       projection planes.  For the RIGHT tibia:

         +AP angle  = Valgus
         +LAT angle = Anterior

       Therefore the distal axis is constructed by rotating the proximal
       projected axis by +6° in X-Z and +14° in Y-Z.

       This is deliberately NOT a ZXY Euler representation.
    */
    const proxAPAngle=Math.atan2(proxAxisWorld[0],proxAxisWorld[2]);
    const proxLATAngle=Math.atan2(proxAxisWorld[1],proxAxisWorld[2]);
    const apAngulationSigned=clinicalSignedMagnitude(params.deformity.ap_angulation,params.deformity.ap_angulation_direction,right?"valgus":"varus",right?"varus":"valgus");
    const latAngulationSigned=clinicalSignedMagnitude(params.deformity.lat_angulation,params.deformity.lat_angulation_direction,"anterior","posterior");
    const apTranslationSigned=clinicalSignedMagnitude(params.deformity.ap_translation,params.deformity.ap_translation_direction,right?"medial":"lateral",right?"lateral":"medial");
    const latTranslationSigned=clinicalSignedMagnitude(params.deformity.lat_translation,params.deformity.lat_translation_direction,"anterior","posterior");
    const boneLengthSigned=clinicalSignedMagnitude(params.deformity.bone_length,params.deformity.bone_length_direction,"short","long");
    const boneRotationSigned=clinicalSignedMagnitude(params.deformity.bone_rotation,params.deformity.bone_rotation_direction,right?"internal":"external",right?"external":"internal");
    const distAPAngle=proxAPAngle + degToRad(apAngulationSigned);
    const distLATAngle=proxLATAngle + degToRad(latAngulationSigned);

    const distalAxisWorld=normalize3([
        Math.tan(distAPAngle),
        Math.tan(distLATAngle),
        1
    ]);

    /*
       Build the distal frame from the geometric distal axis, then apply the
       explicit clinical axial rotation about that axis.  The roll does not
       alter the centerline, so it cannot contaminate AP/LAT angulation.
    */
    const mountingRT=[
        [mountingR[0][0], mountingR[1][0], mountingR[2][0]],
        [mountingR[0][1], mountingR[1][1], mountingR[2][1]],
        [mountingR[0][2], mountingR[1][2], mountingR[2][2]]
    ];
    
    const distalAxisRing=normalize3(
        matVec3(
            mountingRT,
            distalAxisWorld
        )
    );


   
    const alignmentR=minimalAxisAlignmentR213(distalAxisRing);
    const clinicalRollDeg=boneRotationSigned;
    const clinicalRollR=rotationZXY([clinicalRollDeg,0,0]);
    const distalLocalR=matMul3(alignmentR,clinicalRollR);
    const distalR=matMul3(mountingR,distalLocalR);

    const deformityTranslation=[apTranslationSigned,latTranslationSigned,boneLengthSigned];
    const DRPWorld=add3(
        proxOriginWorld,
        matVec3(mountingR,deformityTranslation)
    );
    const DBEWorld=add3(
        DRPWorld,
        matVec3(distalR,[0,0,-120])
    );

    function pointObservationR213(point){
        return {
            AP:project(cameras.AP,point),
            LAT:project(cameras.LAT,point),
            coordinateSystem:"imageIndex",
            source:"synthetic-R213-geometric",
            status:"committed"
        };
    }

    function lineObservationR213(A,B){
        return {
            AP:{pointA:project(cameras.AP,A),pointB:project(cameras.AP,B)},
            LAT:{pointA:project(cameras.LAT,A),pointB:project(cameras.LAT,B)},
            coordinateSystem:"imageIndex",
            source:"synthetic-R213-geometric",
            status:"committed"
        };
    }

    input.anatomy.PFCL=lineObservationR213(
        proxOriginWorld,
        PBEWorld
    );
    input.anatomy.PRP=pointObservationR213(proxOriginWorld);

    input.anatomy.DFCL=lineObservationR213(
        DBEWorld,
        DRPWorld
    );
    input.anatomy.DRP=pointObservationR213(DRPWorld);

    // LOC is an independent clinical reference point, not the deformity
    // translation itself.  Its local value is [12,-8,+25] mm from PRP:
    // 12 medial/lateral, 8 posterior, 25 proximal.
    const locApSigned=params.loc?.enabled?clinicalSignedMagnitude(params.loc.ap,params.loc.ap_direction,right?"medial":"lateral",right?"lateral":"medial"):0;
    const locLatSigned=params.loc?.enabled?clinicalSignedMagnitude(params.loc.lat,params.loc.lat_direction,"anterior","posterior"):0;
    const locAxialSigned=params.loc?.enabled?clinicalSignedMagnitude(params.loc.axial,params.loc.axial_direction,"proximal","distal"):0;
    const locLocal=params.loc?.enabled?[locApSigned,locLatSigned,locAxialSigned]:[0,0,0];
    const LOCWorld=params.loc?.enabled ? add3(
        proxOriginWorld,
        matVec3(mountingR,locLocal)
    ) : null;
    if(params.loc?.enabled){
        input.anatomy.LOC=pointObservationR213(LOCWorld);
    }

    input.anatomy.proximalOrientationReference=lineObservationR213(
        orientA,
        orientB
    );
    input.anatomy.masterTabReference=pointObservationR213(
        masterTabReferenceWorld
    );

    input.manualClinical={
        axialRotationDeg:clinicalRollDeg,
        direction:params.deformity.bone_rotation_direction,
        source:"synthetic-R213-geometric-truth"
    };

    input.syntheticTruth={
        proximalRingPose:{R:ringR,t:ringT},
        proximalMountingPose:{R:mountingR,t:proxOriginRing},
        proximalOrigin:proxOriginWorld,
        proximalAxis:proxAxisWorld,
        PBE:PBEWorld,
        DBE:DBEWorld,
        LOC:LOCWorld,
        distalAxis:normalize3(distalAxisWorld),
        deformityTranslation,
        clinicalAxialRotationDeg:clinicalRollDeg,
        cameraMatrices:cameras,
        geometricClinical:params,
        imagingClinical:{latPlaneAngleDeg:params.imaging?.latPlaneAngleDeg},
        masterTabReference:masterTabReferenceWorld,
        masterTabPhysicalRingAngleDeg:masterAngleDeg
    };

    return input;
}


function distance3(a,b){
    if(!a || !b) return Infinity;
    const dx=a[0]-b[0];
    const dy=a[1]-b[1];
    const dz=a[2]-b[2];
    return Math.sqrt(dx*dx+dy*dy+dz*dz);
}

function vectorErrorDeg(a,b){
    const na=normalize3(a);
    const nb=normalize3(b);
    const dot=Math.max(-1,Math.min(1,
        na[0]*nb[0] + na[1]*nb[1] + na[2]*nb[2]
    ));
    return Math.acos(Math.abs(dot))*180/Math.PI;
}

function cloneSyntheticValue(value){
    return JSON.parse(JSON.stringify(value));
}

function clinicalValue(value){
    return value ? {
        value:Number(value.value),
        direction:value.direction
    } : null;
}

function numericError(actual,expected){
    return Math.abs(Number(actual)-Number(expected));
}

// ============================================================================
// R248 — RIGHT / LEFT CLINICAL LATERALITY REGRESSION
// ----------------------------------------------------------------------------
// The same physical synthetic geometry is reconstructed twice. Only the
// laterality label changes. This verifies that the clinical vocabulary changes
// correctly without changing the underlying reconstructed 3D geometry.
//
// This is intentionally an end-to-end regression: it calls the same public
// Reconstruction.reconstructComplete() API used by the real X-ray caller.
// ============================================================================

function runR257ClinicalRoundTripTest(config=SYNTHETIC_TEST_CONFIG,outputLaterality=null){
    const activeConfig=cloneConfig(config);
    const inputLaterality=activeConfig.laterality==="left"?"left":"right";
    const sameLaterality=outputLaterality==="left"||outputLaterality==="right"?outputLaterality:inputLaterality;
    const oppositeLaterality=inputLaterality==="right"?"left":"right";
    if(!window.Reconstruction||typeof window.Reconstruction.reconstructComplete!=="function") throw new Error("R257 reconstruction engine is unavailable.");
    const syntheticInput=buildR213GeometricCaseInput(activeConfig);
    const inputExpected=expectedClinicalFromConfigR257(activeConfig);
    const run=(interpretationLaterality)=>{
        const input=cloneSyntheticValue(syntheticInput);
        /* R552: synthetic truth is retained beside the test, never passed into the reconstruction call. */
        delete input.syntheticTruth;
        input.laterality=interpretationLaterality;
        const roll=Number(input.manualClinical?.axialRotationDeg||0);
        input.manualClinical.direction=Math.abs(roll)<1e-12?null:(roll>0
            ? (interpretationLaterality==="left"?"external":"internal")
            : (interpretationLaterality==="left"?"internal":"external"));
        const result=window.Reconstruction.reconstructComplete(input);
        const expected=expectedClinicalForOutputLaterality(activeConfig,inputLaterality,interpretationLaterality);
        const c=result.casePatch;
        const actual={mounting:{},deformity:{}};
        for(const k of ["ap_offset","lat_offset","axial_offset","ap_tilt","lat_tilt","master_rotation"]) actual.mounting[k]=clinicalValue(c.mounting[k]);
        for(const k of ["ap_translation","lat_translation","bone_length","ap_angulation","lat_angulation","bone_rotation"]) actual.deformity[k]=clinicalValue(c.deformity[k]);
        actual.deformity.loc=cloneSyntheticValue(c.deformity.loc);
        let pass=result.valid===true; const errors={};
        for(const group of ["mounting","deformity"]){
            for(const k of Object.keys(expected[group])){
                if(k==="loc"){
                    pass=pass&&actual.deformity.loc.enabled===expected.deformity.loc.enabled;
                    for(const q of ["ap","lat","axial"]){const e=expected.deformity.loc[q],a=actual.deformity.loc[q];errors[`deformity.loc.${q}`]=Math.abs(Number(a.value)-Number(e.value));pass=pass&&errors[`deformity.loc.${q}`]<1e-3&&a.direction===e.direction;}
                }else{const e=expected[group][k],a=actual[group][k];errors[`${group}.${k}`]=Math.abs(Number(a.value)-Number(e.value));pass=pass&&errors[`${group}.${k}`]<1e-3&&a.direction===e.direction;}
            }
        }
        return {interpretationLaterality,status:pass?"PASS":"FAIL",engineValid:result.valid===true,clinicalPass:pass,expected,clinical:actual,numericErrors:errors,result};
    };
    const same=run(sameLaterality);
    const opposite=run(oppositeLaterality);
    const truth=syntheticInput.syntheticTruth,pose=same.result.transforms.proximalMounting;
    /* R554: compare the reconstructed infinite projective axes directly.
       Do not fall back to artificial PBE/DBE endpoints: R552 does not emit
       those records, and arbitrary image-line endpoints are not bone ends. */
    const proxDirection=same.result.anatomy.PFCL?.orientedDirection;
    const distDirection=same.result.anatomy.DFCL?.orientedDirection;
    if(!Array.isArray(proxDirection)||!Array.isArray(distDirection)){
        throw new Error('R554 clinical round-trip requires PFCL.orientedDirection and DFCL.orientedDirection from the R552 projective-line engine.');
    }
    const reconstructedProxAxis=normalize3(proxDirection);
    const reconstructedDistAxis=normalize3(distDirection);
    const PFaxisErrorDeg=vectorErrorDeg(truth.proximalAxis,reconstructedProxAxis);
    const DFaxisErrorDeg=vectorErrorDeg(truth.distalAxis,reconstructedDistAxis);
    const axisAccuracy={
        PF:{valueDeg:PFaxisErrorDeg,thresholdDeg:1e-5,pass:PFaxisErrorDeg<1e-5},
        DF:{valueDeg:DFaxisErrorDeg,thresholdDeg:1e-5,pass:DFaxisErrorDeg<1e-5},
        pass:PFaxisErrorDeg<1e-5 && DFaxisErrorDeg<1e-5,
        source:'syntheticTruth',
        scope:'synthetic test only'
    };
    const geometryResidual={proximalOriginMm:distance3(truth.proximalOrigin,pose.t),proximalAxisDeg:vectorErrorDeg(truth.proximalAxis,[pose.R[0][2],pose.R[1][2],pose.R[2][2]]),LOCWorldMm:truth.LOC&&same.result.anatomy.LOC?distance3(truth.LOC,same.result.anatomy.LOC.point):null,cameraRmsAPPx:same.result.diagnostics.cameraRmsPx.AP,cameraRmsLATPx:same.result.diagnostics.cameraRmsPx.LAT,PFaxisErrorDeg,DFaxisErrorDeg,axisComparisonMode:'projective-line direction; no artificial bone endpoints'};
    same.axisAccuracy=axisAccuracy;
    same.geometryResidual=geometryResidual;
    const recoveredLatPlaneAngleDeg=Number(same.result?.diagnostics?.viewPlaneAngleDeg);
    const inputLatPlaneAngleDeg=Number(activeConfig.imaging?.latPlaneAngleDeg ?? NaN);
    const cameraAudit=runR393CameraDirectionAudit();
    return {test:"R257 — CLINICAL DIRECTION ROUND-TRIP / LATERALITY INTERPRETATION",syntheticVersion:RECONSTRUCTION_SYNTHETIC_TEST_VERSION,syntheticViewTestVersion:"R395",cameraDirectionTestVersion:"R443",engineVersion:window.Reconstruction.VERSION,status:same.status==="PASS"&&opposite.status==="PASS"&&cameraAudit.status==="PASS"&&axisAccuracy.pass?"PASS":"FAIL",cameraAudit,inputLaterality,outputInterpretation:{same:sameLaterality,opposite:oppositeLaterality},config:activeConfig,clinicalInput:inputExpected,imaging:{inputLatPlaneAngleDeg,recoveredAPtoLATPlaneAngleDeg:recoveredLatPlaneAngleDeg,planeAngleErrorDeg:Number.isFinite(recoveredLatPlaneAngleDeg)?Math.abs(recoveredLatPlaneAngleDeg-inputLatPlaneAngleDeg):null},sameLaterality:same,oppositeLaterality:opposite,geometryResidual,results:{[sameLaterality]:same.result,[oppositeLaterality]:opposite.result}};
}

function runR253ZeroDirectionRegression(){
    const zero=cloneConfig(SYNTHETIC_TEST_CONFIG);
    zero.mounting.ap_offset=0;
    zero.mounting.lat_offset=0;
    zero.mounting.axial_offset=0;
    zero.mounting.ap_tilt=0;
    zero.mounting.lat_tilt=0;
    zero.mounting.master_rotation=0;
    zero.deformity.ap_translation=0;
    zero.deformity.lat_translation=0;
    zero.deformity.bone_length=0;
    zero.deformity.ap_angulation=0;
    zero.deformity.lat_angulation=0;
    zero.deformity.bone_rotation=0;
    zero.loc.ap=0; zero.loc.lat=0; zero.loc.axial=0;
    const input=buildR213GeometricCaseInput(zero);
    input.laterality="right";
    input.manualClinical.direction=null;
    const result=window.Reconstruction.reconstructComplete(input);
    const values=[
        result.clinical.mounting.ap_offset,
        result.clinical.mounting.lat_offset,
        result.clinical.mounting.axial_offset,
        result.clinical.mounting.ap_tilt,
        result.clinical.mounting.lat_tilt,
        result.clinical.mounting.master_rotation,
        result.clinical.deformity.ap_translation,
        result.clinical.deformity.lat_translation,
        result.clinical.deformity.bone_length,
        result.clinical.deformity.ap_angulation,
        result.clinical.deformity.lat_angulation,
        result.clinical.deformity.bone_rotation,
        result.clinical.deformity.loc.ap,
        result.clinical.deformity.loc.lat,
        result.clinical.deformity.loc.axial
    ];
    const pass=result.valid===true && values.every(v=>Number.isFinite(Number(v.value)));
    return {test:"R256 — ZERO INPUT NUMERICAL STABILITY REGRESSION",status:pass?"PASS":"FAIL",pass,values};
}

function fmtR257(v){
    if(v===null||v===undefined)return "—";
    const n=Number(v);
    return Number.isFinite(n)?String(n):String(v);
}
function clinicalTextR257(v){
    return v&&typeof v.value!=="undefined"
        ? `${fmtR257(v.value)} ${v.direction||""}`.trim()
        : "—";
}
function formatR257HumanReadableReport(result){
    const L=[];const add=s=>L.push(s||"");
    /*
       R257 human report is deliberately compact. JSON retains the complete
       numerical precision. The human report uses short parameter names and
       a narrow INPUT column so the comparison remains readable on smaller
       browser windows.
    */
    const pad=(s,n)=>String(s).padEnd(n," ");
    const PARAM_W=17, INPUT_W=17, SIDE_W=24;
    const lineW=PARAM_W+3+INPUT_W+3+SIDE_W+3+SIDE_W;
    const header=(name)=>`${pad(name,PARAM_W)} | ${pad("INPUT",INPUT_W)} | ${pad(nameForSame, SIDE_W)} | ${pad(nameForOpposite,SIDE_W)}`;
    const nameForSame=result.sameLaterality.interpretationLaterality.toUpperCase();
    const nameForOpposite=result.oppositeLaterality.interpretationLaterality.toUpperCase();

    add("R257 — CLINICAL DIRECTION ROUND-TRIP / LATERALITY INTERPRETATION");
    add("=".repeat(lineW));
    add(`Status: ${result.status}    Input / geometry laterality: ${result.inputLaterality.toUpperCase()}`);
    add("");

    add("IMAGING");
    add("-".repeat(40));
    add(`LAT plane input: ${fmtR257(result.imaging?.inputLatPlaneAngleDeg)}°`);
    add(`AP ↔ LAT recovered: ${fmtR257(result.imaging?.recoveredAPtoLATPlaneAngleDeg)}°`);
    add(`Plane-angle error: ${fmtR257(result.imaging?.planeAngleErrorDeg)}°`);
    add(`Camera direction audit (R393): ${result.cameraAudit?.status||"—"}`);
    add(`Synthetic hardware / image-coordinate fix (R395): ${result.syntheticViewTestVersion||"—"}`);
    for(const c of result.cameraAudit?.cases||[]){
        add(`  ${c.laterality.toUpperCase()}: AP ${c.AP.shootingDirection} · LAT ${c.LAT.shootingDirection}`);
    }
    add("");

    add("CLINICAL INPUT VS OUTPUT");
    add("-".repeat(lineW));
    add(header("PARAMETER"));
    add(`${pad("",PARAM_W)} | ${pad("clinical input",INPUT_W)} | ${pad("same geometry",SIDE_W)} | ${pad("same geometry",SIDE_W)}`);
    add("-".repeat(lineW));

    const rowsByGroup={mounting:[],deformity:[]};
    for(const g of ["mounting","deformity"]){
        for(const [k,v] of Object.entries(result.clinicalInput[g])){
            if(k==="loc") continue;
            rowsByGroup[g].push([k,clinicalTextR257(v),clinicalTextR257(result.sameLaterality.clinical[g][k]),clinicalTextR257(result.oppositeLaterality.clinical[g][k])]);
        }
    }
    rowsByGroup.deformity.push(
        ["loc.ap",clinicalTextR257(result.clinicalInput.deformity.loc.ap),clinicalTextR257(result.sameLaterality.clinical.deformity.loc.ap),clinicalTextR257(result.oppositeLaterality.clinical.deformity.loc.ap)],
        ["loc.lat",clinicalTextR257(result.clinicalInput.deformity.loc.lat),clinicalTextR257(result.sameLaterality.clinical.deformity.loc.lat),clinicalTextR257(result.oppositeLaterality.clinical.deformity.loc.lat)],
        ["loc.axial",clinicalTextR257(result.clinicalInput.deformity.loc.axial),clinicalTextR257(result.sameLaterality.clinical.deformity.loc.axial),clinicalTextR257(result.oppositeLaterality.clinical.deformity.loc.axial)]
    );

    for(const g of ["mounting","deformity"]){
        add("");
        add(g.toUpperCase());
        for(const r of rowsByGroup[g]){
            add(`${pad(r[0],PARAM_W)} | ${pad(r[1],INPUT_W)} | ${pad(r[2],SIDE_W)} | ${pad(r[3],SIDE_W)}`);
        }
    }

    add("");
    add(`Same-laterality (${nameForSame}): ${result.sameLaterality.status}`);
    add(`Opposite-laterality (${nameForOpposite}): ${result.oppositeLaterality.status}`);
    add("");
    add("GEOMETRIC RECONSTRUCTION RESIDUALS");
    add("-".repeat(40));
    add("Bone axes are compared as infinite projective lines; PBE/DBE endpoints are not constructed.");
    for(const [k,v] of Object.entries(result.geometryResidual)) add(`  ${k}: ${fmtR257(v)}`);
    return L.join("\n");
}



/* =========================================================
   DIRECT SYNTHETIC XrayObservation v2 GENERATOR
   ---------------------------------------------------------
   Uses R257/R213 truth only in the developer/test world. The returned
   observationSet contains semantic image observations only; no truth CASE,
   camera matrices, model3D coordinates, or calibration correspondences are
   included in the production observation contract.
   ========================================================= */

const SYNTHETIC_OBSERVATION_CODES = Object.freeze([
    'PFCL','PRP','DFCL','DRP','LOC','MASTER',
    'S1-P','S2-P','S3-P','S4-P','S5-P','S6-P',
    'S1-D','S2-D','S3-D','S4-D','S5-D','S6-D',
    'S1-DIR','S2-DIR','S3-DIR','S4-DIR','S5-DIR','S6-DIR'
]);

function syntheticObservationMetadata(code){
    const n=/^S([1-6])-(P|D|DIR)$/.exec(code);
    if(n){
        const i=Number(n[1]);
        const type=n[2];
        return {
            label:type==='P'?`Strut ${i} proximal hinge`:type==='D'?`Strut ${i} distal hinge`:`Strut ${i} direction`,
            role:type==='P'?'strut_proximal_hinge':type==='D'?'strut_distal_hinge':'strut_direction',
            geometry:type==='DIR'?'line':'point',
            strutIndex:i
        };
    }
    const map={
        PFCL:{label:'Proximal bone axis',role:'proximal_centerline',geometry:'line'},
        PRP:{label:'Proximal reference',role:'proximal_reference',geometry:'point'},
        DFCL:{label:'Distal bone axis',role:'distal_centerline',geometry:'line'},
        DRP:{label:'Distal reference',role:'distal_reference',geometry:'point'},
        LOC:{label:'Location of concern',role:'location_of_concern',geometry:'point'},
        MASTER:{label:'Master tab reference',role:'master_tab_reference',geometry:'point'}
    };
    return map[code] || null;
}

function syntheticAnnotationFromGeometry(code,geometry,view){
    const meta=syntheticObservationMetadata(code);
    if(!meta || !geometry) return null;
    const imagePoint=p=>({image:[Number(p[0]),Number(p[1])]});
    const base={
        id:`R487-${code}-${view}`, geometry:meta.geometry, label:meta.label, code, role:meta.role,
        ...(meta.strutIndex?{strutIndex:meta.strutIndex}:{}), status:'assigned', imageId:`synthetic-${view}`,
        coordinateSystems:{image:{axes:['u','v'],unit:'pixel'}},
        provenance:{source:'R487 direct synthetic observation provider',renderer:'none',interaction:'synthetic'}
    };
    if(meta.geometry==='point') base.point=imagePoint(geometry);
    else {
        base.pointA=imagePoint(geometry.pointA); base.pointB=imagePoint(geometry.pointB);
        base.measurement={
            pixelLength:Math.hypot(geometry.pointB[0]-geometry.pointA[0],geometry.pointB[1]-geometry.pointA[1]),
            angleDeg:Math.atan2(geometry.pointB[1]-geometry.pointA[1],geometry.pointB[0]-geometry.pointA[0])*180/Math.PI
        };
    }
    return base;
}

/* R553 synthetic annotation controls.
   lineExtents are parameter fractions along each view's own projected segment.
   They are intentionally view-specific: AP endpoint A is NOT paired with LAT A.
   noise.sigmaPx is a Gaussian standard deviation applied to image coordinates
   after line-extent changes; seed makes each noise realization reproducible.
   Example:
     lineExtents:{PFCL:{AP:{start:-0.2,end:0.65},LAT:{start:0.15,end:1.3}},
                  DFCL:{AP:{start:0.05,end:0.85},LAT:{start:-0.3,end:1.1}},
                  'S1-DIR':{AP:{start:0.1,end:0.7},LAT:{start:-0.2,end:1.25}}},
     noise:{sigmaPx:0.5,seed:553,targets:'all'}
   Targets may be 'all', 'lines', 'points', or an array of semantic codes.
*/
function r553ApplyLineExtent(geometry,extent){
    if(!geometry || !geometry.pointA || !geometry.pointB || !extent) return geometry;
    const a=geometry.pointA,b=geometry.pointB;
    const start=Number.isFinite(Number(extent.start))?Number(extent.start):0;
    const end=Number.isFinite(Number(extent.end))?Number(extent.end):1;
    const lerp=(t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    return {pointA:lerp(start),pointB:lerp(end)};
}
function r553SeededNormal(seed){
    let state=(Number(seed)>>>0)||0x9e3779b9;
    function uniform(){state=(Math.imul(1664525,state)+1013904223)>>>0;return (state+0.5)/4294967296;}
    let spare=null;
    return function(){
        if(spare!==null){const v=spare;spare=null;return v;}
        const u1=Math.max(1e-12,uniform()),u2=uniform();
        const mag=Math.sqrt(-2*Math.log(u1)),ang=2*Math.PI*u2;
        spare=mag*Math.sin(ang);return mag*Math.cos(ang);
    };
}
function r553NoiseGeometry(geometry,meta,code,options,normal){
    const noise=options?.noise;
    const sigma=Number(noise?.sigmaPx||0);
    if(!(sigma>0)||!geometry) return geometry;
    const targets=noise.targets||'all';
    const applies=Array.isArray(targets)?targets.includes(code):targets==='all'||(targets==='lines'&&meta.geometry==='line')||(targets==='points'&&meta.geometry==='point');
    if(!applies) return geometry;
    const perturb=p=>[p[0]+sigma*normal(),p[1]+sigma*normal()];
    return meta.geometry==='line'?{pointA:perturb(geometry.pointA),pointB:perturb(geometry.pointB)}:perturb(geometry);
}
function r553DefaultExtent(code,view){
    const m=/^S([1-6])-DIR$/.exec(code);
    const i=m?Number(m[1]):0;
    if(code==='PFCL') return view==='AP'?{start:-0.18,end:0.72}:{start:0.16,end:1.28};
    if(code==='DFCL') return view==='AP'?{start:0.08,end:0.91}:{start:-0.22,end:1.17};
    if(m) return view==='AP'?{start:-0.12+0.025*i,end:0.68+0.018*i}:{start:0.14-0.02*i,end:1.22+0.025*i};
    return null;
}

function buildSyntheticObservationSet({selectedCodes=[],config=SYNTHETIC_TEST_CONFIG,lineExtents=null,noise=null}={}){
    const selected=new Set(selectedCodes.filter(code=>SYNTHETIC_OBSERVATION_CODES.includes(code)));
    const truth=buildSparseGeometricCaseInput(config);
    const observationsByView={AP:[],LAT:[]};
    const options={lineExtents,noise};
    const normal=r553SeededNormal(noise?.seed??553);
    function add(code,source){
        if(!selected.has(code)||!source) return;
        const meta=syntheticObservationMetadata(code);
        for(const view of ['AP','LAT']){
            let geometry=view==='AP'?source.AP:source.LAT;
            const perCode=lineExtents?.[code];
            const extent=perCode?.[view] || (lineExtents?.independentPreset ? r553DefaultExtent(code,view) : null);
            if(meta?.geometry==='line' && extent) geometry=r553ApplyLineExtent(geometry,extent);
            geometry=r553NoiseGeometry(geometry,meta,code,options,normal);
            const ann=syntheticAnnotationFromGeometry(code,geometry,view);
            if(ann) observationsByView[view].push(ann);
        }
    }
    /* R636 — all visible and renderer-neutral observations are projected from
       the same physical strut endpoints. Extent/noise changes affect only the
       resulting 2D annotation geometry, never the underlying truth geometry. */
    for(const code of selected){
        const m=code.match(/^(S[1-6])-(P|D|DIR)$/);
        if(m){
            const strut=truth.struts.find(s=>s.id===m[1]);
            if(!strut) continue;
            if(m[2]==='P') add(code,{AP:strut.AP.pointA,LAT:strut.LAT.pointA});
            else if(m[2]==='D') add(code,{AP:strut.AP.pointB,LAT:strut.LAT.pointB});
            else add(code,{AP:strut.AP,LAT:strut.LAT});
        } else if(code==='MASTER') add(code,truth.anatomy.masterTabReference);
        else add(code,truth.anatomy[code]);
    }
    function makeView(view){return {
        version:'xray-observation-v2',
        laterality:config.laterality||'right',
        images:[{id:`synthetic-${view}`,view,laterality:config.laterality||'right',source:'synthetic',width:640,height:480,pixelSpacing:null,pixelSpacingUnit:null,
            imageCoordinateSystem:{axes:['u','v'],origin:'image-index',convention:'synthetic camera image coordinates'},
            provenance:{source:'R487 direct synthetic image',renderer:'none'}}],
        annotations:observationsByView[view],
        provenance:{producer:'R487 direct synthetic observation provider',renderer:'none',contract:'renderer-neutral-semantic-v2'}
    };}
    /* Truth is deliberately retained only beside the observation for test comparison.
       It is never copied into XrayObservation v2. Manual bone rotation is also absent: it
       belongs to the Deformity page / CASE workflow. */
    const observationSet={version:'xray-observation-set-v2',laterality:config.laterality||'right',AP:makeView('AP'),LAT:makeView('LAT'),
        provenance:{producer:'R487 Clean Observation Contract Test',contract:'renderer-neutral-semantic-v2',selectedCodes:[...selected],syntheticProvider:true}};
    return {test:'R636 — Shared physical strut geometry for DICOM and sparse observations',syntheticVersion:'R636',selectedCodes:[...selected],observationSet,truthForTestComparison:truth,generatorConfig:{lineExtents:lineExtents||null,noise:noise?{sigmaPx:Number(noise.sigmaPx||0),seed:Number(noise.seed??553),targets:noise.targets||'all'}:null},truthKeptOutsideObservation:true};
}

const R487_FORBIDDEN_KEYS=new Set(['model3D','calibration','anatomy','truth','case','CASE','camera','cameraMatrix','cameraMatrices','framePose','framePoses','geometry3D','geometry3d','points3D','point3D','points3d','point3d','manualClinical','syntheticCamera','syntheticCameras','frame','world3D','world3d']);
function auditR487ForbiddenFields(value,path='observationSet',hits=[]){
    if(value===null||value===undefined) return hits;
    if(Array.isArray(value)){value.forEach((x,i)=>auditR487ForbiddenFields(x,`${path}[${i}]`,hits));return hits;}
    if(typeof value!=='object') return hits;
    for(const [key,child] of Object.entries(value)){
        if(R487_FORBIDDEN_KEYS.has(key)) hits.push({path:`${path}.${key}`,key,valueType:Array.isArray(child)?'array':typeof child});
        auditR487ForbiddenFields(child,`${path}.${key}`,hits);
    } return hits;
}
function auditR487ObservationContract(observationSet){
    const errors=[];
    if(!observationSet||typeof observationSet!=='object') errors.push('Observation payload is not an object.');
    else {
        if(observationSet.version!=='xray-observation-set-v2') errors.push(`Unexpected observation version: ${observationSet.version}`);
        if(!observationSet.AP||!observationSet.LAT) errors.push('Both AP and LAT observation views are required.');
        const forbiddenFields=auditR487ForbiddenFields(observationSet);
        if(forbiddenFields.length) errors.push(`Forbidden fields detected: ${forbiddenFields.map(x=>x.path).join(', ')}`);
        if(JSON.stringify(observationSet).includes('manualClinical')) errors.push('manualClinical must not appear anywhere in XrayObservation v2.');
        return {pass:errors.length===0,errors,forbiddenFields};
    }
    return {pass:false,errors,forbiddenFields:[]};
}
function runR487CleanObservationContractTest({selectedCodes=[]}={}){
    const built=buildSyntheticObservationSet({selectedCodes}), audit=auditR487ObservationContract(built.observationSet);
    return {version:'R487',test:'R487 — Clean XrayObservation v2 Contract',pass:audit.pass,selectedCodes:built.selectedCodes,observationSet:built.observationSet,truthForTestComparison:built.truthForTestComparison,
        audit:{pass:audit.pass,forbiddenFieldCount:audit.forbiddenFields.length,forbiddenFields:audit.forbiddenFields,errors:audit.errors},
        diagnostics:{observationOnly:true,manualClinicalIncluded:false,truthIncludedInObservation:false,calibrationIncludedInObservation:false,model3DIncludedInObservation:false,cameraIncludedInObservation:false,framePoseIncludedInObservation:false,truthRetainedOutsideObservation:true,truthMayBeUsedOnlyForLaterTestComparison:true},
        payloadJSON:JSON.stringify(built.observationSet,null,2)};
}


/*
 * R487 compatibility bridge for the existing R257 Clinical Round-Trip UI.
 *
 * The R257 popup expects this public provider API.  Keep it as a thin
 * adapter over the R487-clean observation builder so there is still only
 * one synthetic observation construction path.
 */


function createSyntheticObservationPool(config=SYNTHETIC_TEST_CONFIG,options={}){
    const result=buildSyntheticObservationSet({
        selectedCodes:SYNTHETIC_OBSERVATION_CODES,
        config,
        ...options
    });

    return {
        source:'R554 Clean XrayObservation v2 provider',
        selectedCodes:[...result.selectedCodes],
        observationSet:result.observationSet
    };
}

function runR635MasterTabSparseRegression(){
    const baseCodes=[...Array.from({length:6},(_,i)=>`S${i+1}-P`),...Array.from({length:6},(_,i)=>`S${i+1}-D`),"PFCL","PRP","DFCL","DRP"];
    const cases=[];
    for(const laterality of ["right","left"]){
        for(const latPlaneAngleDeg of [70,90,110]){
            for(const signedDeg of [0,2,-2,5,-5,10,-10]){
                const config=cloneConfig(SYNTHETIC_TEST_CONFIG);
                config.laterality=laterality;
                config.imaging.latPlaneAngleDeg=latPlaneAngleDeg;
                config.mounting.master_rotation=Math.abs(signedDeg);
                const externalIsPositive=laterality==="right";
                config.mounting.master_rotation_direction=signedDeg===0?SYNTHETIC_TEST_CONFIG.mounting.master_rotation_direction:((signedDeg>0)===externalIsPositive?"external":"internal");
                const built=buildSyntheticObservationSet({selectedCodes:baseCodes,config});
                const result=window.Reconstruction.reconstruct(built.observationSet);
                const actual=result?.clinical?.mounting?.master_rotation;
                const signedActual=actual?.value==null?null:(actual.direction==="external"?(laterality==="right"?actual.value:-actual.value):(actual.direction==="internal"?(laterality==="right"?-actual.value:actual.value):0));
                const errorDeg=signedActual==null?null:Math.abs(signedActual-signedDeg);
                const noMasterAnnotation=!built.observationSet.AP.annotations.some(a=>a.code==="MASTER")&&!built.observationSet.LAT.annotations.some(a=>a.code==="MASTER");
                cases.push({laterality,latPlaneAngleDeg,expectedSignedDeg:signedDeg,actual:actual||null,signedActualDeg:signedActual,errorDeg,engineValid:result?.valid===true,masterAnnotationAbsent:noMasterAnnotation,masterTabObserved:result?.diagnostics?.masterTabObserved===true,masterTabReferenceDerived:result?.diagnostics?.masterTabReferenceDerived===true,cameraRmsPx:result?.diagnostics?.cameraRmsPx??null,proximalRegistrationRmsMm:result?.diagnostics?.proximalRegistrationRmsMm??null,pass:result?.valid===true&&noMasterAnnotation&&result?.diagnostics?.masterTabObserved!==true&&result?.diagnostics?.masterTabReferenceDerived===true&&errorDeg!==null&&errorDeg<1e-3});
            }
        }
    }
    const noiseConfig=cloneConfig(SYNTHETIC_TEST_CONFIG);
    noiseConfig.mounting.master_rotation=5;
    noiseConfig.mounting.master_rotation_direction="external";
    const noisyBuilt=buildSyntheticObservationSet({selectedCodes:baseCodes,config:noiseConfig,noise:{sigmaPx:0.25,seed:635,targets:"all"}});
    const noisyResult=window.Reconstruction.reconstruct(noisyBuilt.observationSet);
    const noisyValue=noisyResult?.clinical?.mounting?.master_rotation;
    const noisySigned=noisyValue?.value==null?null:(noisyValue.direction==="external"?noisyValue.value:-noisyValue.value);
    const noisyErrorDeg=noisySigned==null?null:Math.abs(noisySigned-5);
    const noiseCheck={sigmaPx:0.25,seed:635,expectedSignedDeg:5,actual:noisyValue||null,errorDeg:noisyErrorDeg,cameraRmsPx:noisyResult?.diagnostics?.cameraRmsPx??null,pass:noisyResult?.valid===true&&noisyResult?.diagnostics?.masterTabReferenceDerived===true&&noisyErrorDeg!==null&&noisyErrorDeg<0.75};

    const explicitConfig=cloneConfig(SYNTHETIC_TEST_CONFIG);
    const explicitBuilt=buildSyntheticObservationSet({selectedCodes:[...baseCodes,"MASTER"],config:explicitConfig});
    const explicitResult=window.Reconstruction.reconstruct(explicitBuilt.observationSet);
    const explicitValue=explicitResult?.clinical?.mounting?.master_rotation;
    const explicitErrorDeg=explicitValue?.value==null?null:Math.abs(explicitValue.value-Number(explicitConfig.mounting.master_rotation));
    const explicitReferenceCheck={expectedMagnitudeDeg:Number(explicitConfig.mounting.master_rotation),actual:explicitValue||null,errorDeg:explicitErrorDeg,masterTabObserved:explicitResult?.diagnostics?.masterTabObserved===true,pass:explicitResult?.valid===true&&explicitResult?.diagnostics?.masterTabObserved===true&&explicitErrorDeg!==null&&explicitErrorDeg<1e-3};

    const contractAudit=auditR487ObservationContract(buildSyntheticObservationSet({selectedCodes:baseCodes,config:SYNTHETIC_TEST_CONFIG}).observationSet);
    const pass=cases.every(c=>c.pass)&&noiseCheck.pass&&explicitReferenceCheck.pass&&contractAudit.pass;
    return {test:"R635 — production sparse-engine Master Tab rotation regression",status:pass?"PASS":"FAIL",masterAnnotationIncludedInSparseSweep:false,toleranceDeg:1e-3,caseCount:cases.length,cases,noiseCheck,explicitReferenceCheck,observationContractAudit:contractAudit,truthKeptOutsideObservation:true};
}



/*
 * R639 — Master Tab rotation sweep with no MASTER observation.
 * Ground-truth angles are retained only in this test harness. The observation
 * payload is built from ordinary strut endpoints and anatomical landmarks.
 * No MASTER point annotation or masterTabReference is passed to reconstruct().
 */
function runR639MasterRotationAngleSweep(){
    const baseCodes=[...Array.from({length:6},(_,i)=>`S${i+1}-P`),...Array.from({length:6},(_,i)=>`S${i+1}-D`),"PFCL","PRP","DFCL","DRP"];
    const lateralityValues=["right","left"];
    const cameraYawValues=[55,70,90,110,125,145];
    const signedAngles=[-15,-10,-5,-2,-1,0,1,2,5,10,15];
    const cases=[];
    for(const laterality of lateralityValues){
        for(const latPlaneAngleDeg of cameraYawValues){
            for(const signedDeg of signedAngles){
                const config=cloneConfig(SYNTHETIC_TEST_CONFIG);
                config.laterality=laterality;
                config.imaging.latPlaneAngleDeg=latPlaneAngleDeg;
                config.mounting.master_rotation=Math.abs(signedDeg);
                const externalIsPositive=laterality==="right";
                config.mounting.master_rotation_direction=signedDeg===0?"external":((signedDeg>0)===externalIsPositive?"external":"internal");
                const built=buildSyntheticObservationSet({selectedCodes:baseCodes,config});
                const result=window.Reconstruction.reconstruct(built.observationSet);
                const actual=result?.clinical?.mounting?.master_rotation;
                const signedActual=actual?.value==null?null:(actual.direction==="external"?(laterality==="right"?actual.value:-actual.value):(actual.direction==="internal"?(laterality==="right"?-actual.value:actual.value):0));
                const errorDeg=signedActual==null?null:Math.abs(signedActual-signedDeg);
                const noMasterAnnotation=!built.observationSet.AP.annotations.some(a=>a.code==="MASTER")&&!built.observationSet.LAT.annotations.some(a=>a.code==="MASTER");
                const noMasterTruthLeak=!Object.hasOwn(built.observationSet,"truthForTestComparison")&&!JSON.stringify(built.observationSet).includes('"masterTabReference"');
                cases.push({laterality,latPlaneAngleDeg,expectedSignedDeg:signedDeg,actualSignedDeg:signedActual,errorDeg,engineValid:result?.valid===true,noMasterAnnotation,noMasterTruthLeak,masterTabObserved:result?.diagnostics?.masterTabObserved===true,masterTabReferenceDerived:result?.diagnostics?.masterTabReferenceDerived===true,cameraRmsPx:result?.diagnostics?.cameraRmsPx??null,proximalRegistrationRmsMm:result?.diagnostics?.proximalRegistrationRmsMm??null,pass:result?.valid===true&&noMasterAnnotation&&noMasterTruthLeak&&result?.diagnostics?.masterTabObserved!==true&&result?.diagnostics?.masterTabReferenceDerived===true&&errorDeg!==null&&errorDeg<1e-3});
            }
        }
    }
    const noisyCases=[];
    for(const laterality of lateralityValues){
        const config=cloneConfig(SYNTHETIC_TEST_CONFIG);
        config.laterality=laterality;
        config.imaging.latPlaneAngleDeg=110;
        config.mounting.master_rotation=5;
        config.mounting.master_rotation_direction=laterality==="right"?"external":"internal";
        const built=buildSyntheticObservationSet({selectedCodes:baseCodes,config,noise:{sigmaPx:0.25,seed:639,targets:"all"}});
        const result=window.Reconstruction.reconstruct(built.observationSet);
        const actual=result?.clinical?.mounting?.master_rotation;
        const signedActual=actual?.value==null?null:(actual.direction==="external"?(laterality==="right"?actual.value:-actual.value):(actual.direction==="internal"?(laterality==="right"?-actual.value:actual.value):0));
        const errorDeg=signedActual==null?null:Math.abs(signedActual-5);
        const noMasterAnnotation=!built.observationSet.AP.annotations.some(a=>a.code==="MASTER")&&!built.observationSet.LAT.annotations.some(a=>a.code==="MASTER");
        noisyCases.push({laterality,expectedSignedDeg:5,actualSignedDeg:signedActual,errorDeg,noiseSigmaPx:0.25,engineValid:result?.valid===true,noMasterAnnotation,masterTabReferenceDerived:result?.diagnostics?.masterTabReferenceDerived===true,pass:result?.valid===true&&noMasterAnnotation&&result?.diagnostics?.masterTabReferenceDerived===true&&errorDeg!==null&&errorDeg<0.75});
    }
    const pass=cases.every(c=>c.pass)&&noisyCases.every(c=>c.pass);
    return {test:"R639 — Master Tab rotation angle sweep without MASTER annotation",status:pass?"PASS":"FAIL",engineVersion:window.Reconstruction.VERSION,syntheticVersion:RECONSTRUCTION_SYNTHETIC_TEST_VERSION,caseCount:cases.length,passedCases:cases.filter(c=>c.pass).length,failedCases:cases.filter(c=>!c.pass),toleranceDeg:1e-3,cameraYawValues,lateralityValues,signedAngles,truthKeptOutsideObservation:true,masterAnnotationIncluded:false,noMasterPointSuppliedToEngine:true,noisyCases,pass,cases};
}

window.ReconstructionSyntheticTest={VERSION:RECONSTRUCTION_SYNTHETIC_TEST_VERSION,R553_VERSION:"R553",R554_VERSION:"R554",R487_VERSION:"R487",CAMERA_DIRECTION_TEST_VERSION:"R393",SYNTHETIC_VIEW_TEST_VERSION:"R395",buildSyntheticCameras,runR393CameraDirectionAudit,buildR213GeometricCaseInput,buildSparseGeometricCaseInput,runR257ClinicalRoundTripTest,runR253ZeroDirectionRegression,getDefaultSyntheticTestConfig:function(){return cloneConfig(SYNTHETIC_TEST_CONFIG);},formatR257HumanReadableReport,buildSyntheticObservationSet,runR635MasterTabSparseRegression,runR639MasterRotationAngleSweep,createSyntheticObservationPool,r553DefaultExtent,r553ApplyLineExtent,auditR487ObservationContract,runR487CleanObservationContractTest,SYNTHETIC_OBSERVATION_CODES};
window.R257SyntheticObservationPoolAPI=Object.freeze({createSyntheticObservationPool,getDefaultSyntheticTestConfig:function(){return cloneConfig(SYNTHETIC_TEST_CONFIG);},SYNTHETIC_OBSERVATION_CODES});
