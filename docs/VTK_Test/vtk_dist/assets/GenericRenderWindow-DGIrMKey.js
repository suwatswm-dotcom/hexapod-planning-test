import{m,q as Ct,j as k,t as Rt,u as Wr,w as Ot,d as kr,n as ct,g as ut,s as lt,p as Ir,x as Hr,f as jr,y as br,z as Qe,A as $r,B as Ar,c as At,C as Xr,o as Xt,E as Kr}from"./Math-BEu_l5xq.js";import{D as st,V as $}from"./DataArray-18WVy4Au.js";import{C as Zr,P as Qr}from"./LookupTable-D0Q8T--3.js";import{D as Et,I as Ue,R as Yr}from"./InteractorObserver-CPPTwB1e.js";import{a as Kt,C as Zt}from"./Mapper-D0DzFbZi.js";import{I as qr,C as Jr}from"./InteractorStyle-H-1ywX7d.js";import{h as Qt,i as P,D as ue,q as Z,a as U,c as Ge,e as Se,l as ea,m as Q,t as se,E as ke,r as ot,s as Bt,n as _t,F as ta,G as ra,k as aa,A as Vt,B as Oe,j as Dt,H as na}from"./BoundingBox-C1hltylu.js";import{t as De}from"./vec4-CAesuCqb.js";import{f as Mt,c as Ft,a as sa,m as Lt,s as oa}from"./Prop--ZA0pgXz.js";import{H as ia,d as ft,T as Ye,i as ca,S as ne,V as ua,r as la,A as fa,o as I,w as oe,u as be,U as Yt,t as Ie,e as A,D as pa,I as ga,n as ha,l as va,q as Sa,b as da,x as qt,k as ya,m as Jt,E as xa,G as it,j as ma,J as Ta,K as Pe}from"./FullScreenQuad-BDVyIUIw.js";import{D as pt}from"./ImageData-DWC4rEYz.js";import"./Plane-Cbs-kNLn.js";import"./Prop3D-DcSaBMkz.js";import"./CoincidentTopologyHelper-dmX-HibR.js";import"./AbstractMapper-CGC4NR1O.js";import"./mat3-XneHzAl3.js";import"./Texture-BSag7eNu.js";import"./Constants-D7OX7HTV.js";function wa(t){return t}function gt(t){if(t===null||t==="null")return null;if(t==="true")return!0;if(t==="false")return!1;if(!(t===void 0||t==="undefined"))return t[0]==="["&&t[t.length-1]==="]"?t.substring(1,t.length-1).split(",").map(e=>gt(e.trim())):t===""||Number.isNaN(Number(t))?t:Number(t)}function Ca(t=!0,e=window.location.search){const r={},o=t?gt:wa;return new URLSearchParams(e).forEach((s,n)=>{n&&(r[n]=s?o(s):!0)}),r}var Ra={toNativeType:gt,extractURLParameters:Ca},{States:re}=Jr;function Oa(t,e){e.classHierarchy.push("vtkInteractorStyleTrackballCamera"),t.handleMouseMove=r=>{const o=r.position,s=e.getRenderer(r);switch(e.state){case re.IS_ROTATE:t.handleMouseRotate(s,o),t.invokeInteractionEvent({type:"InteractionEvent"});break;case re.IS_PAN:t.handleMousePan(s,o),t.invokeInteractionEvent({type:"InteractionEvent"});break;case re.IS_DOLLY:e.wheelDolly||(t.handleMouseDolly(s,o),t.invokeInteractionEvent({type:"InteractionEvent"}));break;case re.IS_SPIN:t.handleMouseSpin(s,o),t.invokeInteractionEvent({type:"InteractionEvent"});break}e.previousPosition=o},t.handleButton3D=r=>{if(r&&r.pressed&&r.device===Et.RightController&&(r.input===Ue.Trigger||r.input===Ue.TrackPad)){t.startCameraPose();return}r&&!r.pressed&&r.device===Et.RightController&&(r.input===Ue.Trigger||r.input===Ue.TrackPad)&&e.state===re.IS_CAMERA_POSE&&t.endCameraPose()},t.handleMove3D=r=>{e.state===re.IS_CAMERA_POSE&&t.updateCameraPose(r)},t.updateCameraPose=r=>{const o=e.getRenderer(r).getActiveCamera(),s=o.getPhysicalTranslation(),n=.5*.05*o.getPhysicalScale(),i=o.physicalOrientationToWorldDirection([r.orientation.x,r.orientation.y,r.orientation.z,r.orientation.w]);o.setPhysicalTranslation(s[0]+i[0]*n,s[1]+i[1]*n,s[2]+i[2]*n)},t.handleLeftButtonPress=r=>{e.previousPosition=r.position,r.shiftKey?r.controlKey||r.altKey?t.startDolly():t.startPan():r.controlKey||r.altKey?t.startSpin():t.startRotate()},t.handleLeftButtonRelease=()=>{switch(e.state){case re.IS_DOLLY:t.endDolly();break;case re.IS_PAN:t.endPan();break;case re.IS_SPIN:t.endSpin();break;case re.IS_ROTATE:t.endRotate();break}},t.handleStartMouseWheel=()=>{e.wheelDolly=!0,t.startDolly()},t.handleEndMouseWheel=()=>{t.endDolly(),e.wheelDolly=!1},t.handleStartPinch=r=>{e.previousScale=r.scale,t.startDolly()},t.handleEndPinch=()=>{t.endDolly()},t.handleStartRotate=r=>{e.previousRotation=r.rotation,t.startRotate()},t.handleEndRotate=()=>{t.endRotate()},t.handleStartPan=r=>{e.previousTranslation=r.translation,t.startPan()},t.handleEndPan=()=>{t.endPan()},t.handlePinch=r=>{t.dollyByFactor(e.getRenderer(r),r.scale/e.previousScale),e.previousScale=r.scale},t.handlePan=r=>{const o=e.getRenderer(r).getActiveCamera();let s=o.getFocalPoint();s=t.computeWorldToDisplay(e.getRenderer(r),s[0],s[1],s[2]);const n=s[2],i=r.translation,f=e.previousTranslation,d=t.computeDisplayToWorld(e.getRenderer(r),s[0]+i[0]-f[0],s[1]+i[1]-f[1],n),g=t.computeDisplayToWorld(e.getRenderer(r),s[0],s[1],n),h=[];h[0]=g[0]-d[0],h[1]=g[1]-d[1],h[2]=g[2]-d[2],s=o.getFocalPoint();const a=o.getPosition();o.setFocalPoint(h[0]+s[0],h[1]+s[1],h[2]+s[2]),o.setPosition(h[0]+a[0],h[1]+a[1],h[2]+a[2]),e._interactor.getLightFollowCamera()&&e.getRenderer(r).updateLightsGeometryToFollowCamera(),o.orthogonalizeViewUp(),e.previousTranslation=r.translation},t.handleRotate=r=>{const o=e.getRenderer(r).getActiveCamera();o.roll(r.rotation-e.previousRotation),o.orthogonalizeViewUp(),e.previousRotation=r.rotation},t.handleMouseRotate=(r,o)=>{if(!e.previousPosition)return;const s=e._interactor,n=o.x-e.previousPosition.x,i=o.y-e.previousPosition.y,f=s.getView().getViewportSize(r);let d=-.1,g=-.1;f[0]&&f[1]&&(d=-20/f[1],g=-20/f[0]);const h=n*g*e.motionFactor,a=i*d*e.motionFactor,y=r.getActiveCamera();!Number.isNaN(h)&&!Number.isNaN(a)&&(y.azimuth(h),y.elevation(a),y.orthogonalizeViewUp()),e.autoAdjustCameraClippingRange&&r.resetCameraClippingRange(),s.getLightFollowCamera()&&r.updateLightsGeometryToFollowCamera()},t.handleMouseSpin=(r,o)=>{if(!e.previousPosition)return;const s=e._interactor,n=r.getActiveCamera(),i=s.getView().getViewportCenter(r),f=Ct(Math.atan2(e.previousPosition.y-i[1],e.previousPosition.x-i[0])),d=Ct(Math.atan2(o.y-i[1],o.x-i[0]))-f;Number.isNaN(d)||(n.roll(d),n.orthogonalizeViewUp())},t.handleMousePan=(r,o)=>{if(!e.previousPosition)return;const s=r.getActiveCamera();let n=s.getFocalPoint();n=t.computeWorldToDisplay(r,n[0],n[1],n[2]);const i=n[2],f=t.computeDisplayToWorld(r,o.x,o.y,i),d=t.computeDisplayToWorld(r,e.previousPosition.x,e.previousPosition.y,i),g=[];g[0]=d[0]-f[0],g[1]=d[1]-f[1],g[2]=d[2]-f[2],n=s.getFocalPoint();const h=s.getPosition();s.setFocalPoint(g[0]+n[0],g[1]+n[1],g[2]+n[2]),s.setPosition(g[0]+h[0],g[1]+h[1],g[2]+h[2]),e._interactor.getLightFollowCamera()&&r.updateLightsGeometryToFollowCamera()},t.handleMouseDolly=(r,o)=>{if(!e.previousPosition)return;const s=o.y-e.previousPosition.y,n=e._interactor.getView().getViewportCenter(r),i=e.motionFactor*s/n[1];t.dollyByFactor(r,1.1**i)},t.handleMouseWheel=r=>{const o=Math.exp(-r.spinY/e.zoomFactor);t.dollyByFactor(e.getRenderer(r),o)},t.dollyByFactor=(r,o)=>{if(Number.isNaN(o))return;const s=r.getActiveCamera();s.getParallelProjection()?s.setParallelScale(s.getParallelScale()/o):(s.dolly(o),e.autoAdjustCameraClippingRange&&r.resetCameraClippingRange()),e._interactor.getLightFollowCamera()&&r.updateLightsGeometryToFollowCamera()}}var Ea={motionFactor:10,zoomFactor:10,wheelDolly:!1};function er(t,e,r={}){Object.assign(e,Ea,r),qr.extend(t,e,r),m.setGet(t,e,["motionFactor","zoomFactor"]),Oa(t,e)}var Ba=m.newInstance(er,"vtkInteractorStyleTrackballCamera"),_a={newInstance:Ba,extend:er},{vtkDebugMacro:ze}=m;function Va(t,e){e.classHierarchy.push("vtkCamera");const r=new Float64Array(3),o=new Float64Array([0,0,-1]),s=new Float64Array([0,1,0]),n=P(new Float64Array(16)),i=P(new Float64Array(16)),f=new Float64Array(3),d=new Float64Array(3),g=new Float64Array(3),h=P(new Float64Array(16)),a=P(new Float64Array(16)),y=new Float64Array(3),x=new Float64Array(3);function T(){e.viewPlaneNormal[0]=-e.directionOfProjection[0],e.viewPlaneNormal[1]=-e.directionOfProjection[1],e.viewPlaneNormal[2]=-e.directionOfProjection[2]}t.orthogonalizeViewUp=()=>{t.getViewMatrix(n),e.viewUp[0]=n[4],e.viewUp[1]=n[5],e.viewUp[2]=n[6],t.modified()};const C=(c,p,u)=>c===e.position[0]&&p===e.position[1]&&u===e.position[2]?!1:(e.position[0]=c,e.position[1]=p,e.position[2]=u,!0);t.setPosition=(c,p,u)=>C(c,p,u)?(t.computeDistance(),t.modified(),!0):!1;const w=(c,p,u)=>c===e.focalPoint[0]&&p===e.focalPoint[1]&&u===e.focalPoint[2]?!1:(e.focalPoint[0]=c,e.focalPoint[1]=p,e.focalPoint[2]=u,!0);t.setFocalPoint=(c,p,u)=>w(c,p,u)?(t.computeDistance(),t.modified(),!0):!1,t.setPositionAndFocalPoint=(c,p)=>{const u=C(...c),l=w(...p);return u||l?(t.computeDistance(),t.modified(),!0):!1},t.setDistance=c=>{if(e.distance===c)return;e.distance=c,e.distance<1e-20&&(e.distance=1e-20,ze("Distance is set to minimum."));const p=e.directionOfProjection;e.focalPoint[0]=e.position[0]+p[0]*e.distance,e.focalPoint[1]=e.position[1]+p[1]*e.distance,e.focalPoint[2]=e.position[2]+p[2]*e.distance,t.modified()},t.computeDistance=()=>{const c=e.focalPoint[0]-e.position[0],p=e.focalPoint[1]-e.position[1],u=e.focalPoint[2]-e.position[2];if(e.distance=Math.sqrt(c*c+p*p+u*u),e.distance<1e-20){e.distance=1e-20,ze("Distance is set to minimum.");const l=e.directionOfProjection;e.focalPoint[0]=e.position[0]+l[0]*e.distance,e.focalPoint[1]=e.position[1]+l[1]*e.distance,e.focalPoint[2]=e.position[2]+l[2]*e.distance}e.directionOfProjection[0]=c/e.distance,e.directionOfProjection[1]=p/e.distance,e.directionOfProjection[2]=u/e.distance,T()},t.dolly=c=>{if(c<=0)return;const p=e.distance/c;t.setPosition(e.focalPoint[0]-p*e.directionOfProjection[0],e.focalPoint[1]-p*e.directionOfProjection[1],e.focalPoint[2]-p*e.directionOfProjection[2])},t.roll=c=>{const p=e.position,u=e.focalPoint,l=e.viewUp,v=new Float64Array([l[0],l[1],l[2],0]);P(h);const S=new Float64Array([u[0]-p[0],u[1]-p[1],u[2]-p[2]]);ue(h,h,k(c),S),De(v,v,h),e.viewUp[0]=v[0],e.viewUp[1]=v[1],e.viewUp[2]=v[2],t.modified()},t.azimuth=c=>{const p=e.focalPoint;P(a),Z(a,a,p),ue(a,a,k(c),e.viewUp),Z(a,a,[-p[0],-p[1],-p[2]]),U(y,e.position,a),t.setPosition(y[0],y[1],y[2])},t.yaw=c=>{const p=e.position;P(a),Z(a,a,p),ue(a,a,k(c),e.viewUp),Z(a,a,[-p[0],-p[1],-p[2]]),U(x,e.focalPoint,a),t.setFocalPoint(x[0],x[1],x[2])},t.elevation=c=>{const p=e.focalPoint;t.getViewMatrix(n);const u=[-n[0],-n[1],-n[2]];P(a),Z(a,a,p),ue(a,a,k(c),u),Z(a,a,[-p[0],-p[1],-p[2]]),U(y,e.position,a),t.setPosition(y[0],y[1],y[2])},t.pitch=c=>{const p=e.position;t.getViewMatrix(n);const u=[n[0],n[1],n[2]];P(a),Z(a,a,p),ue(a,a,k(c),u),Z(a,a,[-p[0],-p[1],-p[2]]),U(x,e.focalPoint,a),t.setFocalPoint(...x)},t.zoom=c=>{c<=0||(e.parallelProjection?e.parallelScale/=c:e.viewAngle/=c,t.modified())},t.translate=(c,p,u)=>{const l=[c,p,u];Rt(e.position,l,e.position),Rt(e.focalPoint,l,e.focalPoint),t.computeDistance(),t.modified()},t.applyTransform=c=>{const p=[...e.viewUp,1],u=[],l=[],v=[];p[0]+=e.position[0],p[1]+=e.position[1],p[2]+=e.position[2],De(u,[...e.position,1],c),De(l,[...e.focalPoint,1],c),De(v,p,c),v[0]-=u[0],v[1]-=u[1],v[2]-=u[2],t.setPosition(...u.slice(0,3)),t.setFocalPoint(...l.slice(0,3)),t.setViewUp(...v.slice(0,3))},t.getThickness=()=>e.clippingRange[1]-e.clippingRange[0],t.setThickness=c=>{let p=c;p<1e-20&&(p=1e-20,ze("Thickness is set to minimum.")),t.setClippingRange(e.clippingRange[0],e.clippingRange[0]+p)},t.setThicknessFromFocalPoint=c=>{let p=c;p<1e-20&&(p=1e-20,ze("Thickness is set to minimum.")),t.setClippingRange(e.distance-p/2,e.distance+p/2)},t.setRoll=c=>{},t.getRoll=()=>{},t.setObliqueAngles=(c,p)=>{},t.getOrientation=()=>{},t.getOrientationWXYZ=()=>{},t.getFrustumPlanes=(c=1,p=new Float64Array(24))=>{const u=[[1,0,0,1],[-1,0,0,1],[0,1,0,1],[0,-1,0,1],[0,0,1,1],[0,0,-1,1]],l=t.getCompositeProjectionMatrix(c,-1,1);for(let v=0;v<6;v++)De(u[v],u[v],l),Wr(u[v]),p[4*v+0]=u[v][0],p[4*v+1]=u[v][1],p[4*v+2]=u[v][2],p[4*v+3]=u[v][3];return p},t.getCameraLightTransformMatrix=c=>(Ge(c,e.cameraLightTransform),c),t.computeCameraLightTransform=()=>{t.getViewMatrix(n),Se(n,n),ea(i,[e.distance,e.distance,e.distance]),Q(n,n,i),P(e.cameraLightTransform),Z(e.cameraLightTransform,n,[0,0,-1])},t.deepCopy=c=>{},t.physicalOrientationToWorldDirection=c=>{const p=Mt(c[0],c[1],c[2],c[3]),u=Ft(),l=Mt(0,0,1,0);return sa(u,p),Lt(l,p,l),Lt(l,l,u),[l[0],l[1],l[2]]},t.getPhysicalToWorldMatrix=c=>{t.getWorldToPhysicalMatrix(c),Se(c,c)},t.getWorldToPhysicalMatrix=c=>{P(c);const p=[3];Ot(e.physicalViewNorth,e.physicalViewUp,p),c[0]=p[0],c[1]=p[1],c[2]=p[2],c[4]=e.physicalViewUp[0],c[5]=e.physicalViewUp[1],c[6]=e.physicalViewUp[2],c[8]=-e.physicalViewNorth[0],c[9]=-e.physicalViewNorth[1],c[10]=-e.physicalViewNorth[2],se(c,c),ke(f,1/e.physicalScale,1/e.physicalScale,1/e.physicalScale),ot(c,c,f),Z(c,c,e.physicalTranslation)},t.computeViewParametersFromViewMatrix=c=>{Se(n,c),U(f,r,n),t.computeDistance();const p=e.distance;t.setPosition(f[0],f[1],f[2]),U(d,o,n),Bt(d,d,f),_t(d,d),t.setDirectionOfProjection(d[0],d[1],d[2]),U(g,s,n),Bt(g,g,f),_t(g,g),t.setViewUp(g[0],g[1],g[2]),t.setDistance(p)},t.computeViewParametersFromPhysicalMatrix=c=>{t.getWorldToPhysicalMatrix(n),Q(n,c,n),t.computeViewParametersFromViewMatrix(n)},t.setViewMatrix=c=>{e.viewMatrix=c,e.viewMatrix&&(t.computeViewParametersFromViewMatrix(e.viewMatrix),se(e.viewMatrix,e.viewMatrix))},t.getViewMatrix=(c=new Float64Array(16))=>e.viewMatrix?(e.modelTransformMatrix?Q(c,e.modelTransformMatrix,e.viewMatrix):Ge(c,e.viewMatrix),c):(ta(c,e.position,e.focalPoint,e.viewUp),se(c,c),e.modelTransformMatrix&&Q(c,e.modelTransformMatrix,c),c),t.setProjectionMatrix=c=>{e.projectionMatrix=c},t.getProjectionMatrix=(c,p,u)=>{const l=new Float64Array(16);if(P(l),e.projectionMatrix){const R=1/e.physicalScale;return ke(f,R,R,R),Ge(l,e.projectionMatrix),ot(l,l,f),se(l,l),l}P(n);const v=e.clippingRange[1]-e.clippingRange[0],S=[e.clippingRange[0]+(p+1)*v/2,e.clippingRange[0]+(u+1)*v/2];if(e.parallelProjection){const R=e.parallelScale*c,B=e.parallelScale,D=(e.windowCenter[0]-1)*R,M=(e.windowCenter[0]+1)*R,_=(e.windowCenter[1]-1)*B,G=(e.windowCenter[1]+1)*B;ra(n,D,M,_,G,S[0],S[1]),se(n,n)}else{if(e.useOffAxisProjection)throw new Error("Off-Axis projection is not supported at this time");{const R=Math.tan(k(e.viewAngle)/2);let B,D;e.useHorizontalViewAngle===!0?(B=e.clippingRange[0]*R,D=e.clippingRange[0]*R/c):(B=e.clippingRange[0]*R*c,D=e.clippingRange[0]*R);const M=(e.windowCenter[0]-1)*B,_=(e.windowCenter[0]+1)*B,G=(e.windowCenter[1]-1)*D,Ce=(e.windowCenter[1]+1)*D,ie=S[0],de=S[1];n[0]=2*ie/(_-M),n[5]=2*ie/(Ce-G),n[2]=(M+_)/(_-M),n[6]=(G+Ce)/(Ce-G),n[10]=-(ie+de)/(de-ie),n[14]=-1,n[11]=-2*ie*de/(de-ie),n[15]=0}}return Ge(l,n),l},t.getCompositeProjectionMatrix=(c,p,u)=>{const l=t.getViewMatrix(),v=t.getProjectionMatrix(c,p,u);return Q(v,l,v),v},t.setDirectionOfProjection=(c,p,u)=>{if(e.directionOfProjection[0]===c&&e.directionOfProjection[1]===p&&e.directionOfProjection[2]===u)return;e.directionOfProjection[0]=c,e.directionOfProjection[1]=p,e.directionOfProjection[2]=u;const l=e.directionOfProjection;e.focalPoint[0]=e.position[0]+l[0]*e.distance,e.focalPoint[1]=e.position[1]+l[1]*e.distance,e.focalPoint[2]=e.position[2]+l[2]*e.distance,T()},t.setDeviceAngles=(c,p,u,l)=>{const v=[3];Ot(e.physicalViewNorth,e.physicalViewUp,v);const S=P(new Float64Array(16));ue(S,S,k(c),e.physicalViewUp),ue(S,S,k(p),v),ue(S,S,k(u),e.physicalViewNorth),ue(S,S,k(-l),e.physicalViewUp);const R=new Float64Array([-e.physicalViewUp[0],-e.physicalViewUp[1],-e.physicalViewUp[2]]),B=new Float64Array(e.physicalViewNorth);U(R,R,S),U(B,B,S),t.setDirectionOfProjection(R[0],R[1],R[2]),t.setViewUp(B[0],B[1],B[2]),t.modified()},t.setOrientationWXYZ=(c,p,u,l)=>{const v=P(new Float64Array(16));if(c!==0&&(p!==0||u!==0||l!==0)){const B=k(c),D=Ft();oa(D,[p,u,l],B),aa(v,D)}const S=new Float64Array(3);U(S,[0,0,-1],v);const R=new Float64Array(3);U(R,[0,1,0],v),t.setDirectionOfProjection(...S),t.setViewUp(...R),t.modified()},t.computeClippingRange=c=>{let p=null,u=null;p=e.viewPlaneNormal,u=e.position;const l=-p[0],v=-p[1],S=-p[2],R=-(l*u[0]+v*u[1]+S*u[2]),B=[l*c[0]+v*c[2]+S*c[4]+R,1e-18];for(let D=0;D<2;D++)for(let M=0;M<2;M++)for(let _=0;_<2;_++){const G=l*c[_]+v*c[2+M]+S*c[4+D]+R;B[0]=G<B[0]?G:B[0],B[1]=G>B[1]?G:B[1]}return B}}var Da={position:[0,0,1],focalPoint:[0,0,0],viewUp:[0,1,0],directionOfProjection:[0,0,-1],parallelProjection:!1,useHorizontalViewAngle:!1,viewAngle:30,parallelScale:1,clippingRange:[.01,1000.01],windowCenter:[0,0],viewPlaneNormal:[0,0,1],useOffAxisProjection:!1,screenBottomLeft:[-.5,-.5,-.5],screenBottomRight:[.5,-.5,-.5],screenTopRight:[.5,.5,-.5],freezeFocalPoint:!1,projectionMatrix:null,viewMatrix:null,modelTransformMatrix:null,cameraLightTransform:Qt(),physicalTranslation:[0,0,0],physicalScale:1,physicalViewUp:[0,1,0],physicalViewNorth:[0,0,-1]};function tr(t,e,r={}){Object.assign(e,Da,r),m.obj(t,e),m.get(t,e,["distance"]),m.setGet(t,e,["parallelProjection","useHorizontalViewAngle","viewAngle","parallelScale","useOffAxisProjection","freezeFocalPoint","physicalScale","modelTransformMatrix"]),m.getArray(t,e,["directionOfProjection","viewPlaneNormal","position","focalPoint"]),m.setGetArray(t,e,["clippingRange","windowCenter"],2),m.setGetArray(t,e,["viewUp","screenBottomLeft","screenBottomRight","screenTopRight","physicalTranslation","physicalViewUp","physicalViewNorth"],3),Va(t,e)}var Ma=m.newInstance(tr,"vtkCamera"),Fa={newInstance:Ma,extend:tr};function La(t,e){e.classHierarchy.push("vtkLight");const r=new Float64Array(3);t.getTransformedPosition=()=>(e.transformMatrix?U(r,e.position,e.transformMatrix):ke(r,e.position[0],e.position[1],e.position[2]),r),t.getTransformedFocalPoint=()=>(e.transformMatrix?U(r,e.focalPoint,e.transformMatrix):ke(r,e.focalPoint[0],e.focalPoint[1],e.focalPoint[2]),r),t.getDirection=()=>(e.directionMTime<e.mtime&&(Vt(e.direction,e.focalPoint,e.position),kr(e.direction),e.directionMTime=e.mtime),e.direction),t.setDirection=o=>{const s=new Float64Array(3);Vt(s,e.position,o),e.focalPoint=s},t.setDirectionAngle=(o,s)=>{const n=k(o),i=k(s);t.setPosition(Math.cos(n)*Math.sin(i),Math.sin(n),Math.cos(n)*Math.cos(i)),t.setFocalPoint(0,0,0),t.setPositional(0)},t.setLightTypeToHeadLight=()=>{t.setLightType("HeadLight")},t.setLightTypeToCameraLight=()=>{t.setLightType("CameraLight")},t.setLightTypeToSceneLight=()=>{t.setTransformMatrix(null),t.setLightType("SceneLight")},t.lightTypeIsHeadLight=()=>e.lightType==="HeadLight",t.lightTypeIsSceneLight=()=>e.lightType==="SceneLight",t.lightTypeIsCameraLight=()=>e.lightType==="CameraLight"}var Na={switch:!0,intensity:1,color:[1,1,1],position:[0,0,1],focalPoint:[0,0,0],positional:!1,exponent:1,coneAngle:30,coneFalloff:5,attenuationValues:[1,0,0],transformMatrix:null,lightType:"SceneLight",shadowAttenuation:1,direction:[0,0,0],directionMTime:0};function Ua(t,e,r={}){Object.assign(e,Na,r),m.obj(t,e),m.setGet(t,e,["intensity","switch","positional","exponent","coneAngle","coneFalloff","transformMatrix","lightType","shadowAttenuation","attenuationValues"]),m.setGetArray(t,e,["color","position","focalPoint","attenuationValues"],3),La(t,e)}var Ga=m.newInstance(Ua,"vtkLight"),Pa={newInstance:Ga},{vtkErrorMacro:We}=m;function za(t){return()=>We(`vtkViewport::${t} - NOT IMPLEMENTED`)}function Wa(t,e){e.classHierarchy.push("vtkViewport"),t.getViewProps=()=>e.props,t.hasViewProp=o=>e.props.includes(o),t.addViewProp=o=>{o&&!t.hasViewProp(o)&&e.props.push(o)},t.removeViewProp=o=>{const s=e.props.filter(n=>n!==o);e.props.length!==s.length&&(e.props=s)},t.removeAllViewProps=()=>{e.props=[]};function r(o,s=[]){s.push(o);const n=o.getNestedProps();if(n&&n.length)for(let i=0;i<n.length;i++)r(n[i],s);return s}t.getViewPropsWithNestedProps=()=>{let o=[];e.actors2D=[];for(let s=0;s<e.props.length;s++){const n=e.props[s].getActors2D();n&&(!Array.isArray(n)||n.length>0)?e.actors2D=e.actors2D.concat(n):r(e.props[s],o)}return e.actors2D.sort((s,n)=>s.getLayerNumber()-n.getLayerNumber()),o=o.concat(e.actors2D),o},t.addActor2D=t.addViewProp,t.removeActor2D=o=>{t.removeViewProp(o)},t.getActors2D=()=>(e.actors2D=[],e.props.forEach(o=>{e.actors2D=e.actors2D.concat(o.getActors2D())}),e.actors2D),t.displayToView=()=>We("call displayToView on your view instead"),t.viewToDisplay=()=>We("callviewtodisplay on your view instead"),t.getSize=()=>We("call getSize on your View instead"),t.normalizedDisplayToProjection=(o,s,n)=>{const i=t.normalizedDisplayToNormalizedViewport(o,s,n);return t.normalizedViewportToProjection(i[0],i[1],i[2])},t.normalizedDisplayToNormalizedViewport=(o,s,n)=>{const i=[e.viewport[2]-e.viewport[0],e.viewport[3]-e.viewport[1]];return[(o-e.viewport[0])/i[0],(s-e.viewport[1])/i[1],n]},t.normalizedViewportToProjection=(o,s,n)=>[o*2-1,s*2-1,n*2-1],t.projectionToNormalizedDisplay=(o,s,n)=>{const i=t.projectionToNormalizedViewport(o,s,n);return t.normalizedViewportToNormalizedDisplay(i[0],i[1],i[2])},t.normalizedViewportToNormalizedDisplay=(o,s,n)=>{const i=[e.viewport[2]-e.viewport[0],e.viewport[3]-e.viewport[1]];return[o*i[0]+e.viewport[0],s*i[1]+e.viewport[1],n]},t.projectionToNormalizedViewport=(o,s,n)=>[(o+1)*.5,(s+1)*.5,(n+1)*.5],t.PickPropFrom=za("PickPropFrom")}var ka={background:[0,0,0],background2:[.2,.2,.2],gradientBackground:!1,viewport:[0,0,1,1],aspect:[1,1],pixelAspect:[1,1],props:[],actors2D:[]};function rr(t,e,r={}){Object.assign(e,ka,r),m.obj(t,e),m.event(t,e,"event"),m.setGet(t,e,["gradientBackground"]),m.setGetArray(t,e,["viewport"],4),m.setGetArray(t,e,["background","background2"],3),Wa(t,e)}var Ia=m.newInstance(rr,"vtkViewport"),Ha={newInstance:Ia,extend:rr},{vtkDebugMacro:Me,vtkErrorMacro:he,vtkWarningMacro:ja}=At;function Nt(t){return()=>he(`vtkRenderer::${t} - NOT IMPLEMENTED`)}function ba(t,e){e.classHierarchy.push("vtkRenderer");const r={type:"ComputeVisiblePropBoundsEvent",renderer:t},o={type:"ResetCameraClippingRangeEvent",renderer:t},s={type:"ResetCameraEvent",renderer:t};t.updateCamera=()=>(e.activeCamera||(Me("No cameras are on, creating one."),t.getActiveCameraAndResetIfCreated()),e.activeCamera.render(t),!0),t.updateLightsGeometryToFollowCamera=()=>{const n=t.getActiveCameraAndResetIfCreated();e.lights.forEach(i=>{i.lightTypeIsSceneLight()||(i.lightTypeIsHeadLight()?(i.setPositionFrom(n.getPositionByReference()),i.setFocalPointFrom(n.getFocalPointByReference()),i.modified(n.getMTime())):i.lightTypeIsCameraLight()?i.setTransformMatrix(n.getCameraLightTransformMatrix(Qt())):he("light has unknown light type",i.get()))})},t.updateLightGeometry=()=>e.lightFollowCamera?t.updateLightsGeometryToFollowCamera():!0,t.allocateTime=Nt("allocateTime"),t.updateGeometry=Nt("updateGeometry"),t.getVTKWindow=()=>e._renderWindow,t.setLayer=n=>{Me(t.getClassName(),t,"setting Layer to ",n),e.layer!==n&&(e.layer=n,t.modified()),t.setPreserveColorBuffer(!!n)},t.setActiveCamera=n=>e.activeCamera===n?!1:(e.activeCamera=n,t.modified(),t.invokeEvent({type:"ActiveCameraEvent",camera:n}),!0),t.makeCamera=()=>{const n=Fa.newInstance();return t.invokeEvent({type:"CreateCameraEvent",camera:n}),n},t.getActiveCamera=()=>(e.activeCamera||(e.activeCamera=t.makeCamera()),e.activeCamera),t.getActiveCameraAndResetIfCreated=()=>(e.activeCamera||(t.getActiveCamera(),t.resetCamera()),e.activeCamera),t.getActors=()=>(e.actors=[],e.props.forEach(n=>{e.actors=e.actors.concat(n.getActors())}),e.actors),t.addActor=t.addViewProp,t.removeActor=n=>{e.actors=e.actors.filter(i=>i!==n),t.removeViewProp(n),t.modified()},t.removeAllActors=()=>{t.getActors().forEach(n=>{t.removeViewProp(n)}),e.actors=[],t.modified()},t.getVolumes=()=>(e.volumes=[],e.props.forEach(n=>{e.volumes=e.volumes.concat(n.getVolumes())}),e.volumes),t.addVolume=t.addViewProp,t.removeVolume=n=>{e.volumes=e.volumes.filter(i=>i!==n),t.removeViewProp(n),t.modified()},t.removeAllVolumes=()=>{t.getVolumes().forEach(n=>{t.removeViewProp(n)}),e.volumes=[],t.modified()},t.hasLight=n=>e.lights.includes(n),t.addLight=n=>{n&&!t.hasLight(n)&&(e.lights.push(n),t.modified())},t.removeLight=n=>{e.lights=e.lights.filter(i=>i!==n),t.modified()},t.removeAllLights=()=>{e.lights=[],t.modified()},t.setLightCollection=n=>{e.lights=n,t.modified()},t.makeLight=Pa.newInstance,t.createLight=()=>{e.automaticLightCreation&&(e._createdLight&&(t.removeLight(e._createdLight),e._createdLight.delete(),e._createdLight=null),e._createdLight=t.makeLight(),t.addLight(e._createdLight),e._createdLight.setLightTypeToHeadLight(),e._createdLight.setPosition(t.getActiveCamera().getPosition()),e._createdLight.setFocalPoint(t.getActiveCamera().getFocalPoint()))},t.normalizedDisplayToWorld=(n,i,f,d)=>{let g=t.normalizedDisplayToProjection(n,i,f);return g=t.projectionToView(g[0],g[1],g[2],d),t.viewToWorld(g[0],g[1],g[2])},t.worldToNormalizedDisplay=(n,i,f,d)=>{let g=t.worldToView(n,i,f);return g=t.viewToProjection(g[0],g[1],g[2],d),t.projectionToNormalizedDisplay(g[0],g[1],g[2])},t.viewToWorld=(n,i,f)=>{if(e.activeCamera===null)return he("ViewToWorld: no active camera, cannot compute view to world, returning 0,0,0"),[0,0,0];const d=e.activeCamera.getViewMatrix();Se(d,d),se(d,d);const g=new Float64Array([n,i,f]);return U(g,g,d),g},t.projectionToView=(n,i,f,d)=>{if(e.activeCamera===null)return he("ProjectionToView: no active camera, cannot compute projection to view, returning 0,0,0"),[0,0,0];const g=e.activeCamera.getProjectionMatrix(d,-1,1);Se(g,g),se(g,g);const h=new Float64Array([n,i,f]);return U(h,h,g),h},t.worldToView=(n,i,f)=>{if(e.activeCamera===null)return he("WorldToView: no active camera, cannot compute view to world, returning 0,0,0"),[0,0,0];const d=e.activeCamera.getViewMatrix();se(d,d);const g=new Float64Array([n,i,f]);return U(g,g,d),g},t.viewToProjection=(n,i,f,d)=>{if(e.activeCamera===null)return he("ViewToProjection: no active camera, cannot compute view to projection, returning 0,0,0"),[0,0,0];const g=e.activeCamera.getProjectionMatrix(d,-1,1);se(g,g);const h=new Float64Array([n,i,f]);return U(h,h,g),h},t.computeVisiblePropBounds=()=>{e.allBounds[0]=Oe.INIT_BOUNDS[0],e.allBounds[1]=Oe.INIT_BOUNDS[1],e.allBounds[2]=Oe.INIT_BOUNDS[2],e.allBounds[3]=Oe.INIT_BOUNDS[3],e.allBounds[4]=Oe.INIT_BOUNDS[4],e.allBounds[5]=Oe.INIT_BOUNDS[5];let n=!0;t.invokeEvent(r);for(let i=0;i<e.props.length;++i){const f=e.props[i];if(f.getVisibility()&&f.getUseBounds()){const d=f.getBounds();d&&Qe(d)&&(n=!1,d[0]<e.allBounds[0]&&(e.allBounds[0]=d[0]),d[1]>e.allBounds[1]&&(e.allBounds[1]=d[1]),d[2]<e.allBounds[2]&&(e.allBounds[2]=d[2]),d[3]>e.allBounds[3]&&(e.allBounds[3]=d[3]),d[4]<e.allBounds[4]&&(e.allBounds[4]=d[4]),d[5]>e.allBounds[5]&&(e.allBounds[5]=d[5]))}}return n&&($r(e.allBounds),Me("Can't compute bounds, no 3D props are visible")),e.allBounds},t.resetCamera=(n=null)=>{const i=n||t.computeVisiblePropBounds(),f=[0,0,0];if(!Qe(i))return Me("Cannot reset camera!"),!1;let d=null;if(t.getActiveCamera())d=e.activeCamera.getViewPlaneNormal();else return he("Trying to reset non-existent camera"),!1;e.activeCamera.setViewAngle(30),f[0]=(i[0]+i[1])/2,f[1]=(i[2]+i[3])/2,f[2]=(i[4]+i[5])/2;let g=i[1]-i[0],h=i[3]-i[2],a=i[5]-i[4];g*=g,h*=h,a*=a;let y=g+h+a;y=y===0?1:y,y=Math.sqrt(y)*.5;const x=k(e.activeCamera.getViewAngle()),T=y,C=y/Math.sin(x*.5),w=e.activeCamera.getViewUp();return Math.abs(Ar(w,d))>.999&&(ja("Resetting view-up since view plane normal is parallel"),e.activeCamera.setViewUp(-w[2],w[0],w[1])),e.activeCamera.setFocalPoint(f[0],f[1],f[2]),e.activeCamera.setPosition(f[0]+C*d[0],f[1]+C*d[1],f[2]+C*d[2]),t.resetCameraClippingRange(i),e.activeCamera.setParallelScale(T),e.activeCamera.setPhysicalScale(y),e.activeCamera.setPhysicalTranslation(-f[0],-f[1],-f[2]),t.invokeEvent(s),!0},t.resetCameraClippingRange=(n=null)=>{const i=n||t.computeVisiblePropBounds();if(!Qe(i))return Me("Cannot reset camera clipping range!"),!1;if(t.getActiveCameraAndResetIfCreated(),!e.activeCamera)return he("Trying to reset clipping range of non-existent camera"),!1;const f=e.activeCamera.computeClippingRange(i);let d=0;if(e.activeCamera.getParallelProjection())d=.2*e.activeCamera.getParallelScale();else{const g=k(e.activeCamera.getViewAngle());d=.2*Math.tan(g/2)*f[1]}return f[1]-f[0]<d&&(d=d-f[1]+f[0],f[1]+=d/2,f[0]-=d/2),f[0]<0&&(f[0]=0),f[0]=.99*f[0]-(f[1]-f[0])*e.clippingRangeExpansion,f[1]=1.01*f[1]+(f[1]-f[0])*e.clippingRangeExpansion,f[0]=f[0]>=f[1]?.01*f[1]:f[0],e.nearClippingPlaneTolerance||(e.nearClippingPlaneTolerance=.01),f[0]<e.nearClippingPlaneTolerance*f[1]&&(f[0]=e.nearClippingPlaneTolerance*f[1]),e.activeCamera.setClippingRange(f[0],f[1]),t.invokeEvent(o),!1},t.setRenderWindow=n=>{n!==e._renderWindow&&(e._vtkWindow=n,e._renderWindow=n)},t.visibleActorCount=()=>e.props.filter(n=>n.getVisibility()).length,t.visibleVolumeCount=t.visibleActorCount,t.getMTime=()=>{let n=e.mtime;const i=e.activeCamera?e.activeCamera.getMTime():0;i>n&&(n=i);const f=e._createdLight?e._createdLight.getMTime():0;return f>n&&(n=f),n},t.getTransparent=()=>!!e.preserveColorBuffer,t.isActiveCameraCreated=()=>!!e.activeCamera}var $a={pickedProp:null,activeCamera:null,allBounds:[],ambient:[1,1,1],allocatedRenderTime:100,timeFactor:1,automaticLightCreation:!0,twoSidedLighting:!0,lastRenderTimeInSeconds:-1,renderWindow:null,lights:[],actors:[],volumes:[],lightFollowCamera:!0,numberOfPropsRendered:0,propArray:null,pathArray:null,layer:0,preserveColorBuffer:!1,preserveDepthBuffer:!1,computeVisiblePropBounds:br(),interactive:!0,nearClippingPlaneTolerance:0,clippingRangeExpansion:.05,erase:!0,draw:!0,useShadows:!1,useDepthPeeling:!1,occlusionRatio:0,maximumNumberOfPeels:4,selector:null,delegate:null,texturedBackground:!1,backgroundTexture:null,environmentTexture:null,environmentTextureDiffuseStrength:1,environmentTextureSpecularStrength:1,useEnvironmentTextureAsBackground:!1,pass:0};function ar(t,e,r={}){for(Object.assign(e,$a,r),Ha.extend(t,e,r),e.background||(e.background=[0,0,0,1]);e.background.length<3;)e.background.push(0);e.background.length===3&&e.background.push(1),ut(t,e,["_renderWindow","allocatedRenderTime","timeFactor","lastRenderTimeInSeconds","numberOfPropsRendered","lastRenderingUsedDepthPeeling","selector"]),lt(t,e,["twoSidedLighting","lightFollowCamera","automaticLightCreation","erase","draw","nearClippingPlaneTolerance","clippingRangeExpansion","backingStore","interactive","layer","preserveColorBuffer","preserveDepthBuffer","useDepthPeeling","occlusionRatio","maximumNumberOfPeels","delegate","backgroundTexture","texturedBackground","environmentTexture","environmentTextureDiffuseStrength","environmentTextureSpecularStrength","useEnvironmentTextureAsBackground","useShadows","pass"]),Ir(t,e,["actors","volumes","lights"]),Hr(t,e,["background"],4,1),jr(t,e,["renderWindow"]),ba(t,e)}var Aa=ct(ar,"vtkRenderer"),Xa={newInstance:Aa,extend:ar},Ka="WebGL",He=Object.create(null);function ht(t,e){He[t]=e}function Za(){return Object.keys(He)}function nr(t,e={}){return He[t]&&He[t](e)}function Qa(t,e){e.classHierarchy.push("vtkRenderWindow"),t.addRenderer=r=>{t.hasRenderer(r)||(r.setRenderWindow(t),e.renderers.push(r),t.modified())},t.removeRenderer=r=>{e.renderers=e.renderers.filter(o=>o!==r),t.modified()},t.hasRenderer=r=>e.renderers.indexOf(r)!==-1,t.newAPISpecificView=(r,o={})=>nr(r||e.defaultViewAPI,o),t.addView=r=>{t.hasView(r)||(r.setRenderable(t),e._views.push(r),t.modified())},t.removeView=r=>{e._views=e._views.filter(o=>o!==r),t.modified()},t.hasView=r=>e._views.indexOf(r)!==-1,t.preRender=()=>{e.renderers.forEach(r=>{r.isActiveCameraCreated()||r.resetCamera()})},t.render=()=>{t.preRender(),e.interactor?e.interactor.render():e._views.forEach(r=>r.traverseAllPasses())},t.getStatistics=()=>{const r={propCount:0,invisiblePropCount:0,gpuMemoryMB:0};return e._views.forEach(o=>{o.getGraphicsMemoryInfo&&(r.gpuMemoryMB+=o.getGraphicsMemoryInfo()/1e6)}),e.renderers.forEach(o=>{const s=o.getViewProps(),n=e._views[0].getViewNodeFor(o);s.forEach(i=>{if(i.getVisibility()){r.propCount+=1;const f=i.getMapper&&i.getMapper();if(f&&f.getPrimitiveCount){const d=n.getViewNodeFor(f);if(d){d.getAllocatedGPUMemoryInBytes&&(r.gpuMemoryMB+=d.getAllocatedGPUMemoryInBytes()/1e6);const g=f.getPrimitiveCount();Object.keys(g).forEach(h=>{r[h]||(r[h]=0),r[h]+=g[h]})}}}else r.invisiblePropCount+=1})}),r.str=Object.keys(r).map(o=>`${o}: ${r[o]}`).join(`
`),r},t.captureImages=(r="image/png",o={})=>(m.setImmediate(t.render),e._views.map(s=>s.captureNextImage?s.captureNextImage(r,o):void 0).filter(s=>!!s)),t.addRenderWindow=r=>e.childRenderWindows.includes(r)?!1:(e.childRenderWindows.push(r),t.modified(),!0),t.removeRenderWindow=r=>{const o=e.childRenderWindows.findIndex(s=>s===r);return o<0?!1:(e.childRenderWindows.splice(o,1),t.modified(),!0)}}var Ya={defaultViewAPI:Ka,renderers:[],views:[],interactor:null,neverRendered:!0,numberOfLayers:1,childRenderWindows:[]};function sr(t,e,r={}){Object.assign(e,Ya,r),m.obj(t,e),m.setGet(t,e,["interactor","numberOfLayers","_views","defaultViewAPI"]),m.get(t,e,["neverRendered"]),m.getArray(t,e,["renderers","childRenderWindows"]),m.moveToProtected(t,e,["views"]),m.event(t,e,"completion"),Qa(t,e)}var qa=m.newInstance(sr,"vtkRenderWindow"),Ja={newInstance:qa,extend:sr,registerViewConstructor:ht,listViewAPIs:Za,newAPISpecificView:nr};function en(t,e){e.classHierarchy.push("vtkRenderPass"),t.getOperation=()=>e.currentOperation,t.setCurrentOperation=r=>{e.currentOperation=r,e.currentTraverseOperation=`traverse${m.capitalize(e.currentOperation)}`},t.getTraverseOperation=()=>e.currentTraverseOperation,t.traverse=(r,o=null)=>{e.deleted||(e._currentParent=o,e.preDelegateOperations.forEach(s=>{t.setCurrentOperation(s),r.traverse(t)}),e.delegates.forEach(s=>{s.traverse(r,t)}),e.postDelegateOperations.forEach(s=>{t.setCurrentOperation(s),r.traverse(t)}))}}var tn={delegates:[],currentOperation:null,preDelegateOperations:[],postDelegateOperations:[],currentParent:null};function or(t,e,r={}){Object.assign(e,tn,r),m.obj(t,e),m.get(t,e,["currentOperation"]),m.setGet(t,e,["delegates","_currentParent","preDelegateOperations","postDelegateOperations"]),m.moveToProtected(t,e,["currentParent"]),en(t,e)}var rn=m.newInstance(or,"vtkRenderPass"),pe={newInstance:rn,extend:or},{Representation:an}=Kt,{vtkErrorMacro:Ut}=m;function nn(t){t.Fragment=ne.substitute(t.Fragment,"//VTK::RenderPassFragmentShader::Impl",`
      float weight = gl_FragData[0].a * pow(max(1.1 - gl_FragCoord.z, 0.0), 2.0);
      gl_FragData[0] = vec4(gl_FragData[0].rgb*weight, gl_FragData[0].a);
      gl_FragData[1].r = weight;
    `,!1).result}var sn=`//VTK::System::Dec

in vec2 tcoord;

uniform sampler2D translucentRTexture;
uniform sampler2D translucentRGBATexture;

// the output of this shader
//VTK::Output::Dec

void main()
{
  vec4 t1Color = texture(translucentRGBATexture, tcoord);
  float t2Color = texture(translucentRTexture, tcoord).r;
  gl_FragData[0] = vec4(t1Color.rgb/max(t2Color,0.01), 1.0 - t1Color.a);
}
`;function on(t,e){e.classHierarchy.push("vtkOpenGLOrderIndependentTranslucentPass"),t.createVertexBuffer=()=>{const r=new Float32Array([-1,-1,-1,1,-1,-1,-1,1,-1,1,1,-1]),o=new Float32Array([0,0,1,0,0,1,1,1]),s=new Uint16Array([4,0,1,3,2]),n=st.newInstance({numberOfComponents:3,values:r});n.setName("points");const i=st.newInstance({numberOfComponents:2,values:o});i.setName("tcoords");const f=Zr.newInstance({values:s});e.tris.getCABO().createVBO(f,"polys",an.SURFACE,{points:n,tcoords:i,cellOffset:0,forceFlatten:!0}),e.VBOBuildTime.modified()},t.createFramebuffer=r=>{const o=r.getSize(),s=r.getContext();e.framebuffer=ft.newInstance(),e.framebuffer.setOpenGLRenderWindow(r),e.framebuffer.create(...o),e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.bind(),e.translucentRGBATexture=Ye.newInstance(),e.translucentRGBATexture.setInternalFormat(s.RGBA16F),e.translucentRGBATexture.setFormat(s.RGBA),e.translucentRGBATexture.setOpenGLDataType(s.HALF_FLOAT),e.translucentRGBATexture.setOpenGLRenderWindow(r),e.translucentRGBATexture.create2DFromRaw({width:o[0],height:o[1],numComps:4,dataType:"Float32Array",data:null}),e.translucentRTexture=Ye.newInstance(),e.translucentRTexture.setInternalFormat(s.R16F),e.translucentRTexture.setFormat(s.RED),e.translucentRTexture.setOpenGLDataType(s.HALF_FLOAT),e.translucentRTexture.setOpenGLRenderWindow(r),e.translucentRTexture.create2DFromRaw({width:o[0],height:o[1],numComps:1,dataType:"Float32Array",data:null}),e.translucentZTexture=Ye.newInstance(),e.translucentZTexture.setOpenGLRenderWindow(r),e.translucentZTexture.createDepthFromRaw({width:o[0],height:o[1],dataType:"Float32Array",data:null}),e.framebuffer.setColorBuffer(e.translucentRGBATexture,0),e.framebuffer.setColorBuffer(e.translucentRTexture,1),e.framebuffer.setDepthBuffer(e.translucentZTexture)},t.createCopyShader=r=>{e.copyShader=r.getShaderCache().readyShaderProgramArray(["//VTK::System::Dec","attribute vec4 vertexDC;","attribute vec2 tcoordTC;","varying vec2 tcoord;","void main() { tcoord = tcoordTC; gl_Position = vertexDC; }"].join(`
`),sn,"")},t.createVBO=r=>{const o=r.getContext();e.tris.setOpenGLRenderWindow(r),t.createVertexBuffer();const s=e.copyShader;e.tris.getCABO().bind(),e.copyVAO.addAttributeArray(s,e.tris.getCABO(),"vertexDC",e.tris.getCABO().getVertexOffset(),e.tris.getCABO().getStride(),o.FLOAT,3,o.FALSE)||Ut("Error setting vertexDC in copy shader VAO."),e.copyVAO.addAttributeArray(s,e.tris.getCABO(),"tcoordTC",e.tris.getCABO().getTCoordOffset(),e.tris.getCABO().getStride(),o.FLOAT,2,o.FALSE)||Ut("Error setting vertexDC in copy shader VAO.")},t.traverse=(r,o,s)=>{if(e.deleted)return;const n=r.getSize(),i=r.getContext();if(e._supported=!1,o.getSelector()||!i||!i.getExtension("EXT_color_buffer_half_float")&&!i.getExtension("EXT_color_buffer_float")){t.setCurrentOperation("translucentPass"),o.traverse(t);return}if(e._supported=!0,e.framebuffer===null)t.createFramebuffer(r);else{const h=e.framebuffer.getSize();h===null||h[0]!==n[0]||h[1]!==n[1]?(e.framebuffer.releaseGraphicsResources(),e.translucentRGBATexture.releaseGraphicsResources(r),e.translucentRTexture.releaseGraphicsResources(r),e.translucentZTexture.releaseGraphicsResources(r),t.createFramebuffer(r)):(e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.bind())}i.drawBuffers([i.COLOR_ATTACHMENT0]),i.clearBufferfv(i.COLOR,0,[0,0,0,0]),i.clearBufferfv(i.DEPTH,0,[1]),i.colorMask(!1,!1,!1,!1),s.getOpaqueActorCount()>0&&(s.setCurrentOperation("opaqueZBufferPass"),o.traverse(s)),i.colorMask(!0,!0,!0,!0),i.drawBuffers([i.COLOR_ATTACHMENT0,i.COLOR_ATTACHMENT1]),i.viewport(0,0,n[0],n[1]),i.scissor(0,0,n[0],n[1]),i.clearBufferfv(i.COLOR,0,[0,0,0,1]),i.clearBufferfv(i.COLOR,1,[0,0,0,0]),i.enable(i.DEPTH_TEST),i.enable(i.BLEND),i.blendFuncSeparate(i.ONE,i.ONE,i.ZERO,i.ONE_MINUS_SRC_ALPHA),t.setCurrentOperation("translucentPass"),o.traverse(t),i.drawBuffers([i.NONE]),e.framebuffer.restorePreviousBindingsAndBuffers(),e.copyShader===null?t.createCopyShader(r):r.getShaderCache().readyShaderProgram(e.copyShader),e.copyVAO||(e.copyVAO=ca.newInstance(),e.copyVAO.setOpenGLRenderWindow(r)),e.copyVAO.bind(),e.VBOBuildTime.getMTime()<t.getMTime()&&t.createVBO(r);const f=i.isEnabled(i.CULL_FACE),d=f?i.getParameter(i.CULL_FACE_MODE):null;r.disableCullFace(),i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA),i.depthMask(!1),i.depthFunc(i.ALWAYS),i.viewport(0,0,n[0],n[1]),i.scissor(0,0,n[0],n[1]),e.translucentRGBATexture.activate(),e.copyShader.setUniformi("translucentRGBATexture",e.translucentRGBATexture.getTextureUnit()),e.translucentRTexture.activate(),e.copyShader.setUniformi("translucentRTexture",e.translucentRTexture.getTextureUnit()),i.drawArrays(i.TRIANGLES,0,e.tris.getCABO().getElementCount()),i.depthMask(!0),i.depthFunc(i.LEQUAL),f&&(r.enableCullFace(),r.setCullFaceMode(d)),e.translucentRGBATexture.deactivate(),e.translucentRTexture.deactivate();const g=o.getTiledSizeAndOrigin();i.scissor(g.lowerLeftU,g.lowerLeftV,g.usize,g.vsize),i.viewport(g.lowerLeftU,g.lowerLeftV,g.usize,g.vsize)},t.getShaderReplacement=()=>e._supported?nn:null,t.releaseGraphicsResources=r=>{e.framebuffer&&(e.framebuffer.releaseGraphicsResources(r),e.framebuffer=null),e.translucentRGBATexture&&(e.translucentRGBATexture.releaseGraphicsResources(r),e.translucentRGBATexture=null),e.translucentRTexture&&(e.translucentRTexture.releaseGraphicsResources(r),e.translucentRTexture=null),e.translucentZTexture&&(e.translucentZTexture.releaseGraphicsResources(r),e.translucentZTexture=null),e.copyVAO&&(e.copyVAO.releaseGraphicsResources(r),e.copyVAO=null),e.copyShader&&(e.copyShader.releaseGraphicsResources(r),e.copyShader=null),e.tris&&(e.tris.releaseGraphicsResources(r),e.tris=null),t.modified()}}var cn={framebuffer:null,copyShader:null,tris:null};function ir(t,e,r={}){Object.assign(e,cn,r),pe.extend(t,e,r),e.VBOBuildTime={},m.obj(e.VBOBuildTime,{mtime:0}),e.tris=ia.newInstance(),m.get(t,e,["framebuffer"]),on(t,e)}var un=m.newInstance(ir,"vtkOpenGLOrderIndependentTranslucentPass"),ln={newInstance:un,extend:ir};function fn(t,e){e.classHierarchy.push("vtkForwardPass"),t.traverse=(r,o=null)=>{if(e.deleted)return;e._currentParent=o,t.setCurrentOperation("buildPass"),r.traverse(t);const s=r.getRenderable().getNumberOfLayers(),n=r.getRenderable().getRenderersByReference();for(let i=0;i<s;i++)for(let f=0;f<n.length;f++){const d=n[f],g=r.getViewNodeFor(d);if(d.getDraw()&&d.getLayer()===i){if(e.opaqueActorCount=0,e.translucentActorCount=0,e.volumeCount=0,e.overlayActorCount=0,t.setCurrentOperation("queryPass"),g.traverse(t),(e.opaqueActorCount>0||e.translucentActorCount>0)&&e.volumeCount>0||e.depthRequested){const h=r.getFramebufferSize();e.framebuffer===null&&(e.framebuffer=ft.newInstance()),e.framebuffer.setOpenGLRenderWindow(r),e.framebuffer.saveCurrentBindingsAndBuffers();const a=e.framebuffer.getSize();(a===null||a[0]!==h[0]||a[1]!==h[1])&&(e.framebuffer.create(h[0],h[1]),e.framebuffer.populateFramebuffer()),e.framebuffer.bind(),t.setCurrentOperation("zBufferPass"),g.traverse(t),e.framebuffer.restorePreviousBindingsAndBuffers(),e.depthRequested=!1}t.setCurrentOperation("cameraPass"),g.traverse(t),e.opaqueActorCount>0&&(t.setCurrentOperation("opaquePass"),g.traverse(t)),e.translucentActorCount>0&&(e.translucentPass||(e.translucentPass=ln.newInstance()),e.translucentPass.traverse(r,g,t)),e.volumeCount>0&&(t.setCurrentOperation("volumePass"),g.traverse(t)),e.overlayActorCount>0&&(t.setCurrentOperation("overlayPass"),g.traverse(t))}}},t.getZBufferTexture=()=>e.framebuffer?e.framebuffer.getColorTexture():null,t.requestDepth=()=>{e.depthRequested=!0},t.incrementOpaqueActorCount=()=>e.opaqueActorCount++,t.incrementTranslucentActorCount=()=>e.translucentActorCount++,t.incrementVolumeCount=()=>e.volumeCount++,t.incrementOverlayActorCount=()=>e.overlayActorCount++}var pn={opaqueActorCount:0,translucentActorCount:0,volumeCount:0,overlayActorCount:0,framebuffer:null,depthRequested:!1};function cr(t,e,r={}){Object.assign(e,pn,r),pe.extend(t,e,r),m.get(t,e,["framebuffer","opaqueActorCount","translucentActorCount","volumeCount"]),fn(t,e)}var gn=m.newInstance(cr,"vtkForwardPass"),hn={newInstance:gn,extend:cr},vn={GLOBALIDS:0,PEDIGREEIDS:1,VALUES:2,INDICES:3,FRUSTUM:4,LOCATIONS:5,THRESHOLDS:6,BLOCKS:7,QUERY:8},Sn={CELL:0,POINT:1,FIELD:2,VERTEX:3,EDGE:4,ROW:5},dn={SelectionContent:vn,SelectionField:Sn};function yn(t,e){e.classHierarchy.push("vtkSelectionNode"),t.getBounds=()=>e.points.getBounds()}var xn={contentType:-1,fieldType:-1,properties:null,selectionList:[]};function ur(t,e,r={}){Object.assign(e,xn,r),m.obj(t,e),e.properties={},m.setGet(t,e,["contentType","fieldType","properties","selectionList"]),yn(t,e)}var mn=m.newInstance(ur,"vtkSelectionNode"),$e={newInstance:mn,extend:ur,...dn},{FieldAssociations:Tn}=pt;function wn(t,e){e.classHierarchy.push("vtkHardwareSelector"),t.getSourceDataAsync=async(r,o,s,n,i)=>{},t.selectAsync=async(r,o,s,n,i)=>{const f=await t.getSourceDataAsync(r,o,s,n,i);return f?f.generateSelection(o,s,n,i):[]}}var Cn={fieldAssociation:Tn.FIELD_ASSOCIATION_CELLS,captureZValues:!1};function lr(t,e,r={}){Object.assign(e,Cn,r),m.obj(t,e),m.setGet(t,e,["fieldAssociation","captureZValues"]),wn(t,e)}var Rn=m.newInstance(lr,"vtkHardwareSelector"),fr={newInstance:Rn,extend:lr},{PassTypes:F}=Zt,{SelectionContent:On,SelectionField:Gt}=$e,{FieldAssociations:Le}=pt,{vtkErrorMacro:pr,vtkDebugMacro:Fe}=m,ve=1;function gr(t){return`${t.propID} ${t.compositeID}`}function hr(t,e,r,o){return r?r[(e*(o[2]-o[0]+1)+t)*4+3]:0}function le(t,e,r,o,s=null){if(!r)return 0;const n=(e*(o[2]-o[0]+1)+t)*4,i=r[n],f=r[n+1];return(r[n+2]*256+f)*256+i}function vr(t,e){let r=e;return r<<=24,r|=t,r}function En(t,e,r,o){{if(o[0]=e[0],o[1]=e[1],e[0]<t.area[0]||e[0]>t.area[2]||e[1]<t.area[1]||e[1]>t.area[3])return null;const s=[e[0]-t.area[0],e[1]-t.area[1]],n=le(s[0],s[1],t.pixBuffer[F.ACTOR_PASS],t.area,"getPixelInformationWithData1");if(n<=0||n-ve>=t.props.length)return null;const i={};i.valid=!0,i.propID=n-ve,i.prop=t.props[i.propID];let f=le(s[0],s[1],t.pixBuffer[F.COMPOSITE_INDEX_PASS],t.area,"getPixelInformationWithData2");if((f<0||f>16777215)&&(f=0),i.compositeID=f-ve,t.captureZValues){const d=(s[1]*(t.area[2]-t.area[0]+1)+s[0])*4;i.zValue=(256*t.zBuffer[d]+t.zBuffer[d+1])/65535,i.displayPosition=e}return t.pixBuffer[F.ID_LOW24]&&hr(s[0],s[1],t.pixBuffer[F.ID_LOW24],t.area)===0||(i.attributeID=vr(le(s[0],s[1],t.pixBuffer[F.ID_LOW24],t.area,"getPixelInformationWithData3"),le(s[0],s[1],t.pixBuffer[F.ID_HIGH24],t.area,"getPixelInformationWithData4"))),i}}function Sr(t,e,r,o,s){const n=[];let i=0;return e.forEach((f,d)=>{const g=$e.newInstance();switch(g.setContentType(On.INDICES),t){case Le.FIELD_ASSOCIATION_CELLS:g.setFieldType(Gt.CELL);break;case Le.FIELD_ASSOCIATION_POINTS:g.setFieldType(Gt.POINT);break;default:pr("Unknown field association")}g.getProperties().propID=f.info.propID,g.getProperties().prop=f.info.prop,g.getProperties().compositeID=f.info.compositeID,g.getProperties().attributeID=f.info.attributeID,g.getProperties().pixelCount=f.pixelCount,r&&(g.getProperties().displayPosition=[f.info.displayPosition[0],f.info.displayPosition[1],f.info.zValue],g.getProperties().worldPosition=s.displayToWorld(f.info.displayPosition[0],f.info.displayPosition[1],f.info.zValue,o)),g.setSelectionList(f.attributeIDs),n[i]=g,i++}),n}function Bn(t,e,r,o,s){const n=Math.floor(e),i=Math.floor(r),f=Math.floor(o),d=Math.floor(s),g=new Map,h=[0,0];for(let a=i;a<=d;a++)for(let y=n;y<=f;y++){const x=En(t,[y,a],0,h);if(x&&x.valid){const T=gr(x);if(!g.has(T))g.set(T,{info:x,pixelCount:1,attributeIDs:[x.attributeID]});else{const C=g.get(T);C.pixelCount++,t.captureZValues&&x.zValue<C.info.zValue&&(C.info=x),C.attributeIDs.indexOf(x.attributeID)===-1&&C.attributeIDs.push(x.attributeID)}}}return Sr(t.fieldAssociation,g,t.captureZValues,t.renderer,t.openGLRenderWindow)}function _n(t,e){e.classHierarchy.push("vtkOpenGLHardwareSelector"),t.releasePixBuffers=()=>{e.rawPixBuffer=[],e.pixBuffer=[],e.zBuffer=null},t.beginSelection=()=>{e._openGLRenderer=e._openGLRenderWindow.getViewNodeFor(e._renderer,e._openGLRenderer),e.maxAttributeId=0;const o=e._openGLRenderWindow.getSize();if(!e.framebuffer)e.framebuffer=ft.newInstance(),e.framebuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.create(o[0],o[1]),e.framebuffer.populateFramebuffer();else{e.framebuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.framebuffer.saveCurrentBindingsAndBuffers();const s=e.framebuffer.getSize();!s||s[0]!==o[0]||s[1]!==o[1]?(e.framebuffer.create(o[0],o[1]),e.framebuffer.populateFramebuffer()):e.framebuffer.bind()}if(e._openGLRenderer.clear(),e._openGLRenderer.setSelector(t),e.hitProps={},e.propPixels={},e.props=[],t.releasePixBuffers(),e.fieldAssociation===Le.FIELD_ASSOCIATION_POINTS){const s=e._openGLRenderWindow.getContext(),n=s.isEnabled(s.BLEND);s.disable(s.BLEND),e._openGLRenderWindow.traverseAllPasses(),n&&s.enable(s.BLEND)}},t.endSelection=()=>{e.hitProps={},e._openGLRenderer.setSelector(null),e.framebuffer.restorePreviousBindingsAndBuffers()},t.preCapturePass=()=>{const o=e._openGLRenderWindow.getContext();e.originalBlending=o.isEnabled(o.BLEND),o.disable(o.BLEND)},t.postCapturePass=()=>{const o=e._openGLRenderWindow.getContext();e.originalBlending&&o.enable(o.BLEND)},t.select=()=>{let o=null;return t.captureBuffers()&&(o=t.generateSelection(e.area[0],e.area[1],e.area[2],e.area[3]),t.releasePixBuffers()),o},t.getSourceDataAsync=async(o,s,n,i,f)=>{if(e._renderer=o,s===void 0){const g=e._openGLRenderWindow.getSize();t.setArea(0,0,g[0]-1,g[1]-1)}else t.setArea(s,n,i,f);if(!t.captureBuffers())return!1;const d={area:[...e.area],pixBuffer:[...e.pixBuffer],captureZValues:e.captureZValues,zBuffer:e.zBuffer,props:[...e.props],fieldAssociation:e.fieldAssociation,renderer:o,openGLRenderWindow:e._openGLRenderWindow};return d.generateSelection=(...g)=>Bn(d,...g),d},t.captureBuffers=()=>{if(!e._renderer||!e._openGLRenderWindow)return pr("Renderer and view must be set before calling Select."),!1;e._openGLRenderer=e._openGLRenderWindow.getViewNodeFor(e._renderer,e._openGLRenderer),e._openGLRenderWindow.getRenderable().preRender(),t.invokeEvent({type:"StartEvent"}),e.originalBackground=e._renderer.getBackgroundByReference(),e._renderer.setBackground(0,0,0,0);const o=e._openGLRenderWindow.getRenderPasses();t.beginSelection();const s=[];for(e.currentPass=F.MIN_KNOWN_PASS;e.currentPass<=F.MAX_KNOWN_PASS;e.currentPass++)t.passRequired(e.currentPass)&&(t.preCapturePass(e.currentPass),e.captureZValues&&e.currentPass===F.ACTOR_PASS&&typeof o[0].requestDepth=="function"&&typeof o[0].getFramebuffer=="function"&&o[0].requestDepth(),e._openGLRenderWindow.traverseAllPasses(),t.postCapturePass(e.currentPass),t.savePixelBuffer(e.currentPass),s.push(e.currentPass));return s.forEach(n=>{e.currentPass=n,t.processPixelBuffers()}),e.currentPass=F.MAX_KNOWN_PASS,t.endSelection(),e._renderer.setBackground(e.originalBackground),t.invokeEvent({type:"EndEvent"}),!0},t.processPixelBuffers=()=>{e.props.forEach((o,s)=>{t.isPropHit(s)&&o.processSelectorPixelBuffers(t,e.propPixels[s])})},t.passRequired=o=>{if(o===F.ID_HIGH24){if(e.fieldAssociation===Le.FIELD_ASSOCIATION_POINTS)return e.maximumPointId>16777215;if(e.fieldAssociation===Le.FIELD_ASSOCIATION_CELLS)return e.maximumCellId>16777215}return!0},t.savePixelBuffer=o=>{if(e.pixBuffer[o]=e._openGLRenderWindow.getPixelData(e.area[0],e.area[1],e.area[2],e.area[3]),!e.rawPixBuffer[o]){const s=(e.area[2]-e.area[0]+1)*(e.area[3]-e.area[1]+1)*4;e.rawPixBuffer[o]=new Uint8Array(s),e.rawPixBuffer[o].set(e.pixBuffer[o])}if(o===F.ACTOR_PASS){if(e.captureZValues){const s=e._openGLRenderWindow.getRenderPasses();if(typeof s[0].requestDepth=="function"&&typeof s[0].getFramebuffer=="function"){const n=s[0].getFramebuffer();n.saveCurrentBindingsAndBuffers(),n.bind(),e.zBuffer=e._openGLRenderWindow.getPixelData(e.area[0],e.area[1],e.area[2],e.area[3]),n.restorePreviousBindingsAndBuffers()}}t.buildPropHitList(e.rawPixBuffer[o])}},t.buildPropHitList=o=>{let s=0;for(let n=0;n<=e.area[3]-e.area[1];n++)for(let i=0;i<=e.area[2]-e.area[0];i++){let f=le(i,n,o,e.area,"buildPropHitList");f>0&&(f--,f in e.hitProps||(e.hitProps[f]=!0,e.propPixels[f]=[]),e.propPixels[f].push(s*4)),++s}},t.renderProp=o=>{e.currentPass===F.ACTOR_PASS&&(t.setPropColorValueFromInt(e.props.length+ve),e.props.push(o))},t.renderCompositeIndex=o=>{e.currentPass===F.COMPOSITE_INDEX_PASS&&t.setPropColorValueFromInt(o+ve)},t.renderAttributeId=o=>{o<0||(e.maxAttributeId=o>e.maxAttributeId?o:e.maxAttributeId)},t.passTypeToString=o=>m.enumToString(F,o),t.isPropHit=o=>!!e.hitProps[o],t.setPropColorValueFromInt=o=>{e.propColorValue[0]=o%256/255,e.propColorValue[1]=Math.floor(o/256)%256/255,e.propColorValue[2]=Math.floor(o/65536)%256/255},t.getPixelInformation=(o,s,n)=>{const i=s<0?0:s;if(Fe("getPixelInformation called",i),i===0){if(n[0]=o[0],n[1]=o[1],o[0]<e.area[0]||o[0]>e.area[2]||o[1]<e.area[1]||o[1]>e.area[3])return null;Fe(o),Fe(e.area);const h=[o[0]-e.area[0],o[1]-e.area[1]];Fe("adjusted displayPosition",h);const a=le(h[0],h[1],e.pixBuffer[F.ACTOR_PASS],e.area,"getPixelInformation");if(Fe("actorid",a),a<=0||a-ve>=e.props.length)return null;const y={};y.valid=!0,y.propID=a-ve,y.prop=e.props[y.propID];let x=le(h[0],h[1],e.pixBuffer[F.COMPOSITE_INDEX_PASS],e.area,"getPixelInformation2");if((x<0||x>16777215)&&(x=0),y.compositeID=x-ve,e.captureZValues){const T=(h[1]*(e.area[2]-e.area[0]+1)+h[0])*4;y.zValue=(256*e.zBuffer[T]+e.zBuffer[T+1])/65535,y.displayPosition=o}return e.pixBuffer[F.ID_LOW24]&&hr(h[0],h[1],e.pixBuffer[F.ID_LOW24],e.area)===0||(y.attributeID=vr(le(h[0],h[1],e.pixBuffer[F.ID_LOW24],e.area,"getPixelInformation3"),le(h[0],h[1],e.pixBuffer[F.ID_HIGH24],e.area,"getPixelInformation4"))),y}const f=[o[0],o[1]],d=[0,0];let g=t.getPixelInformation(o,0,n);if(g&&g.valid)return g;for(let h=1;h<i;++h){for(let a=f[1]>h?f[1]-h:0;a<=f[1]+h;++a)if(d[1]=a,f[0]>=h&&(d[0]=f[0]-h,g=t.getPixelInformation(d,0,n),g&&g.valid)||(d[0]=f[0]+h,g=t.getPixelInformation(d,0,n),g&&g.valid))return g;for(let a=f[0]>=h?f[0]-(h-1):0;a<=f[0]+(h-1);++a)if(d[0]=a,f[1]>=h&&(d[1]=f[1]-h,g=t.getPixelInformation(d,0,n),g&&g.valid)||(d[1]=f[1]+h,g=t.getPixelInformation(d,0,n),g&&g.valid))return g}return n[0]=o[0],n[1]=o[1],null},t.generateSelection=(o,s,n,i)=>{const f=Math.floor(o),d=Math.floor(s),g=Math.floor(n),h=Math.floor(i),a=new Map,y=[0,0];for(let x=d;x<=h;x++)for(let T=f;T<=g;T++){const C=[T,x],w=t.getPixelInformation(C,0,y);if(w&&w.valid){const c=gr(w);if(!a.has(c))a.set(c,{info:w,pixelCount:1,attributeIDs:[w.attributeID]});else{const p=a.get(c);p.pixelCount++,e.captureZValues&&w.zValue<p.info.zValue&&(p.info=w),p.attributeIDs.indexOf(w.attributeID)===-1&&p.attributeIDs.push(w.attributeID)}}}return Sr(e.fieldAssociation,a,e.captureZValues,e._renderer,e._openGLRenderWindow)},t.getRawPixelBuffer=o=>e.rawPixBuffer[o],t.getPixelBuffer=o=>e.pixBuffer[o],t.attach=(o,s)=>{e._openGLRenderWindow=o,e._renderer=s};const r=t.setArea;t.setArea=(...o)=>r(...o)?(e.area[0]=Math.floor(e.area[0]),e.area[1]=Math.floor(e.area[1]),e.area[2]=Math.floor(e.area[2]),e.area[3]=Math.floor(e.area[3]),!0):!1}var Vn={area:void 0,currentPass:-1,propColorValue:null,props:null,maximumPointId:0,maximumCellId:0,idOffset:1};function dr(t,e,r={}){Object.assign(e,Vn,r),fr.extend(t,e,r),e.propColorValue=[0,0,0],e.props=[],e.area||(e.area=[0,0,0,0]),m.setGetArray(t,e,["area"],4),m.setGet(t,e,["_renderer","currentPass","_openGLRenderWindow","maximumPointId","maximumCellId"]),m.setGetArray(t,e,["propColorValue"],3),m.moveToProtected(t,e,["renderer","openGLRenderWindow"]),m.event(t,e,"event"),_n(t,e)}var Dn=m.newInstance(dr,"vtkOpenGLHardwareSelector"),yr={newInstance:Dn,extend:dr,...Zt},qe={exports:{}},Pt;function Mn(){return Pt||(Pt=1,(function(t,e){(function(r){t.exports=r()})(function(r){var o=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];function s(c,p){var u=c[0],l=c[1],v=c[2],S=c[3];u+=(l&v|~l&S)+p[0]-680876936|0,u=(u<<7|u>>>25)+l|0,S+=(u&l|~u&v)+p[1]-389564586|0,S=(S<<12|S>>>20)+u|0,v+=(S&u|~S&l)+p[2]+606105819|0,v=(v<<17|v>>>15)+S|0,l+=(v&S|~v&u)+p[3]-1044525330|0,l=(l<<22|l>>>10)+v|0,u+=(l&v|~l&S)+p[4]-176418897|0,u=(u<<7|u>>>25)+l|0,S+=(u&l|~u&v)+p[5]+1200080426|0,S=(S<<12|S>>>20)+u|0,v+=(S&u|~S&l)+p[6]-1473231341|0,v=(v<<17|v>>>15)+S|0,l+=(v&S|~v&u)+p[7]-45705983|0,l=(l<<22|l>>>10)+v|0,u+=(l&v|~l&S)+p[8]+1770035416|0,u=(u<<7|u>>>25)+l|0,S+=(u&l|~u&v)+p[9]-1958414417|0,S=(S<<12|S>>>20)+u|0,v+=(S&u|~S&l)+p[10]-42063|0,v=(v<<17|v>>>15)+S|0,l+=(v&S|~v&u)+p[11]-1990404162|0,l=(l<<22|l>>>10)+v|0,u+=(l&v|~l&S)+p[12]+1804603682|0,u=(u<<7|u>>>25)+l|0,S+=(u&l|~u&v)+p[13]-40341101|0,S=(S<<12|S>>>20)+u|0,v+=(S&u|~S&l)+p[14]-1502002290|0,v=(v<<17|v>>>15)+S|0,l+=(v&S|~v&u)+p[15]+1236535329|0,l=(l<<22|l>>>10)+v|0,u+=(l&S|v&~S)+p[1]-165796510|0,u=(u<<5|u>>>27)+l|0,S+=(u&v|l&~v)+p[6]-1069501632|0,S=(S<<9|S>>>23)+u|0,v+=(S&l|u&~l)+p[11]+643717713|0,v=(v<<14|v>>>18)+S|0,l+=(v&u|S&~u)+p[0]-373897302|0,l=(l<<20|l>>>12)+v|0,u+=(l&S|v&~S)+p[5]-701558691|0,u=(u<<5|u>>>27)+l|0,S+=(u&v|l&~v)+p[10]+38016083|0,S=(S<<9|S>>>23)+u|0,v+=(S&l|u&~l)+p[15]-660478335|0,v=(v<<14|v>>>18)+S|0,l+=(v&u|S&~u)+p[4]-405537848|0,l=(l<<20|l>>>12)+v|0,u+=(l&S|v&~S)+p[9]+568446438|0,u=(u<<5|u>>>27)+l|0,S+=(u&v|l&~v)+p[14]-1019803690|0,S=(S<<9|S>>>23)+u|0,v+=(S&l|u&~l)+p[3]-187363961|0,v=(v<<14|v>>>18)+S|0,l+=(v&u|S&~u)+p[8]+1163531501|0,l=(l<<20|l>>>12)+v|0,u+=(l&S|v&~S)+p[13]-1444681467|0,u=(u<<5|u>>>27)+l|0,S+=(u&v|l&~v)+p[2]-51403784|0,S=(S<<9|S>>>23)+u|0,v+=(S&l|u&~l)+p[7]+1735328473|0,v=(v<<14|v>>>18)+S|0,l+=(v&u|S&~u)+p[12]-1926607734|0,l=(l<<20|l>>>12)+v|0,u+=(l^v^S)+p[5]-378558|0,u=(u<<4|u>>>28)+l|0,S+=(u^l^v)+p[8]-2022574463|0,S=(S<<11|S>>>21)+u|0,v+=(S^u^l)+p[11]+1839030562|0,v=(v<<16|v>>>16)+S|0,l+=(v^S^u)+p[14]-35309556|0,l=(l<<23|l>>>9)+v|0,u+=(l^v^S)+p[1]-1530992060|0,u=(u<<4|u>>>28)+l|0,S+=(u^l^v)+p[4]+1272893353|0,S=(S<<11|S>>>21)+u|0,v+=(S^u^l)+p[7]-155497632|0,v=(v<<16|v>>>16)+S|0,l+=(v^S^u)+p[10]-1094730640|0,l=(l<<23|l>>>9)+v|0,u+=(l^v^S)+p[13]+681279174|0,u=(u<<4|u>>>28)+l|0,S+=(u^l^v)+p[0]-358537222|0,S=(S<<11|S>>>21)+u|0,v+=(S^u^l)+p[3]-722521979|0,v=(v<<16|v>>>16)+S|0,l+=(v^S^u)+p[6]+76029189|0,l=(l<<23|l>>>9)+v|0,u+=(l^v^S)+p[9]-640364487|0,u=(u<<4|u>>>28)+l|0,S+=(u^l^v)+p[12]-421815835|0,S=(S<<11|S>>>21)+u|0,v+=(S^u^l)+p[15]+530742520|0,v=(v<<16|v>>>16)+S|0,l+=(v^S^u)+p[2]-995338651|0,l=(l<<23|l>>>9)+v|0,u+=(v^(l|~S))+p[0]-198630844|0,u=(u<<6|u>>>26)+l|0,S+=(l^(u|~v))+p[7]+1126891415|0,S=(S<<10|S>>>22)+u|0,v+=(u^(S|~l))+p[14]-1416354905|0,v=(v<<15|v>>>17)+S|0,l+=(S^(v|~u))+p[5]-57434055|0,l=(l<<21|l>>>11)+v|0,u+=(v^(l|~S))+p[12]+1700485571|0,u=(u<<6|u>>>26)+l|0,S+=(l^(u|~v))+p[3]-1894986606|0,S=(S<<10|S>>>22)+u|0,v+=(u^(S|~l))+p[10]-1051523|0,v=(v<<15|v>>>17)+S|0,l+=(S^(v|~u))+p[1]-2054922799|0,l=(l<<21|l>>>11)+v|0,u+=(v^(l|~S))+p[8]+1873313359|0,u=(u<<6|u>>>26)+l|0,S+=(l^(u|~v))+p[15]-30611744|0,S=(S<<10|S>>>22)+u|0,v+=(u^(S|~l))+p[6]-1560198380|0,v=(v<<15|v>>>17)+S|0,l+=(S^(v|~u))+p[13]+1309151649|0,l=(l<<21|l>>>11)+v|0,u+=(v^(l|~S))+p[4]-145523070|0,u=(u<<6|u>>>26)+l|0,S+=(l^(u|~v))+p[11]-1120210379|0,S=(S<<10|S>>>22)+u|0,v+=(u^(S|~l))+p[2]+718787259|0,v=(v<<15|v>>>17)+S|0,l+=(S^(v|~u))+p[9]-343485551|0,l=(l<<21|l>>>11)+v|0,c[0]=u+c[0]|0,c[1]=l+c[1]|0,c[2]=v+c[2]|0,c[3]=S+c[3]|0}function n(c){var p=[],u;for(u=0;u<64;u+=4)p[u>>2]=c.charCodeAt(u)+(c.charCodeAt(u+1)<<8)+(c.charCodeAt(u+2)<<16)+(c.charCodeAt(u+3)<<24);return p}function i(c){var p=[],u;for(u=0;u<64;u+=4)p[u>>2]=c[u]+(c[u+1]<<8)+(c[u+2]<<16)+(c[u+3]<<24);return p}function f(c){var p=c.length,u=[1732584193,-271733879,-1732584194,271733878],l,v,S,R,B,D;for(l=64;l<=p;l+=64)s(u,n(c.substring(l-64,l)));for(c=c.substring(l-64),v=c.length,S=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],l=0;l<v;l+=1)S[l>>2]|=c.charCodeAt(l)<<(l%4<<3);if(S[l>>2]|=128<<(l%4<<3),l>55)for(s(u,S),l=0;l<16;l+=1)S[l]=0;return R=p*8,R=R.toString(16).match(/(.*?)(.{0,8})$/),B=parseInt(R[2],16),D=parseInt(R[1],16)||0,S[14]=B,S[15]=D,s(u,S),u}function d(c){var p=c.length,u=[1732584193,-271733879,-1732584194,271733878],l,v,S,R,B,D;for(l=64;l<=p;l+=64)s(u,i(c.subarray(l-64,l)));for(c=l-64<p?c.subarray(l-64):new Uint8Array(0),v=c.length,S=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],l=0;l<v;l+=1)S[l>>2]|=c[l]<<(l%4<<3);if(S[l>>2]|=128<<(l%4<<3),l>55)for(s(u,S),l=0;l<16;l+=1)S[l]=0;return R=p*8,R=R.toString(16).match(/(.*?)(.{0,8})$/),B=parseInt(R[2],16),D=parseInt(R[1],16)||0,S[14]=B,S[15]=D,s(u,S),u}function g(c){var p="",u;for(u=0;u<4;u+=1)p+=o[c>>u*8+4&15]+o[c>>u*8&15];return p}function h(c){var p;for(p=0;p<c.length;p+=1)c[p]=g(c[p]);return c.join("")}h(f("hello")),typeof ArrayBuffer<"u"&&!ArrayBuffer.prototype.slice&&(function(){function c(p,u){return p=p|0||0,p<0?Math.max(p+u,0):Math.min(p,u)}ArrayBuffer.prototype.slice=function(p,u){var l=this.byteLength,v=c(p,l),S=l,R,B,D,M;return u!==r&&(S=c(u,l)),v>S?new ArrayBuffer(0):(R=S-v,B=new ArrayBuffer(R),D=new Uint8Array(B),M=new Uint8Array(this,v,R),D.set(M),B)}})();function a(c){return/[\u0080-\uFFFF]/.test(c)&&(c=unescape(encodeURIComponent(c))),c}function y(c,p){var u=c.length,l=new ArrayBuffer(u),v=new Uint8Array(l),S;for(S=0;S<u;S+=1)v[S]=c.charCodeAt(S);return p?v:l}function x(c){return String.fromCharCode.apply(null,new Uint8Array(c))}function T(c,p,u){var l=new Uint8Array(c.byteLength+p.byteLength);return l.set(new Uint8Array(c)),l.set(new Uint8Array(p),c.byteLength),l}function C(c){var p=[],u=c.length,l;for(l=0;l<u-1;l+=2)p.push(parseInt(c.substr(l,2),16));return String.fromCharCode.apply(String,p)}function w(){this.reset()}return w.prototype.append=function(c){return this.appendBinary(a(c)),this},w.prototype.appendBinary=function(c){this._buff+=c,this._length+=c.length;var p=this._buff.length,u;for(u=64;u<=p;u+=64)s(this._hash,n(this._buff.substring(u-64,u)));return this._buff=this._buff.substring(u-64),this},w.prototype.end=function(c){var p=this._buff,u=p.length,l,v=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],S;for(l=0;l<u;l+=1)v[l>>2]|=p.charCodeAt(l)<<(l%4<<3);return this._finish(v,u),S=h(this._hash),c&&(S=C(S)),this.reset(),S},w.prototype.reset=function(){return this._buff="",this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},w.prototype.getState=function(){return{buff:this._buff,length:this._length,hash:this._hash.slice()}},w.prototype.setState=function(c){return this._buff=c.buff,this._length=c.length,this._hash=c.hash,this},w.prototype.destroy=function(){delete this._hash,delete this._buff,delete this._length},w.prototype._finish=function(c,p){var u=p,l,v,S;if(c[u>>2]|=128<<(u%4<<3),u>55)for(s(this._hash,c),u=0;u<16;u+=1)c[u]=0;l=this._length*8,l=l.toString(16).match(/(.*?)(.{0,8})$/),v=parseInt(l[2],16),S=parseInt(l[1],16)||0,c[14]=v,c[15]=S,s(this._hash,c)},w.hash=function(c,p){return w.hashBinary(a(c),p)},w.hashBinary=function(c,p){var u=f(c),l=h(u);return p?C(l):l},w.ArrayBuffer=function(){this.reset()},w.ArrayBuffer.prototype.append=function(c){var p=T(this._buff.buffer,c),u=p.length,l;for(this._length+=c.byteLength,l=64;l<=u;l+=64)s(this._hash,i(p.subarray(l-64,l)));return this._buff=l-64<u?new Uint8Array(p.buffer.slice(l-64)):new Uint8Array(0),this},w.ArrayBuffer.prototype.end=function(c){var p=this._buff,u=p.length,l=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],v,S;for(v=0;v<u;v+=1)l[v>>2]|=p[v]<<(v%4<<3);return this._finish(l,u),S=h(this._hash),c&&(S=C(S)),this.reset(),S},w.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},w.ArrayBuffer.prototype.getState=function(){var c=w.prototype.getState.call(this);return c.buff=x(c.buff),c},w.ArrayBuffer.prototype.setState=function(c){return c.buff=y(c.buff,!0),w.prototype.setState.call(this,c)},w.ArrayBuffer.prototype.destroy=w.prototype.destroy,w.ArrayBuffer.prototype._finish=w.prototype._finish,w.ArrayBuffer.hash=function(c,p){var u=d(new Uint8Array(c)),l=h(u);return p?C(l):l},w})})(qe)),qe.exports}var Fn=Mn();const Ln=Xr(Fn);var Nn=["lastShaderProgramBound","context","_openGLRenderWindow"];function Un(t,e){e.classHierarchy.push("vtkShaderCache"),t.replaceShaderValues=(r,o,s)=>{let n=o;s.length>0&&(n=ne.substitute(n,"VSOut","GSOut").result);const i=`#version 300 es
#define attribute in
#define textureCube texture
#define texture2D texture
#define textureCubeLod textureLod
#define texture2DLod textureLod
`;n=ne.substitute(n,"//VTK::System::Dec",[`${i}
`,"#ifdef GL_FRAGMENT_PRECISION_HIGH","precision highp float;","precision highp int;","#else","precision mediump float;","precision mediump int;","#endif"]).result;let f=ne.substitute(r,"//VTK::System::Dec",[`${i}
`,"#ifdef GL_FRAGMENT_PRECISION_HIGH","precision highp float;","precision highp int;","#else","precision mediump float;","precision mediump int;","#endif"]).result;f=ne.substitute(f,"varying","out").result,n=ne.substitute(n,"varying","in").result;let d="",g=0;for(;n.includes(`gl_FragData[${g}]`);)n=ne.substitute(n,`gl_FragData\\[${g}\\]`,`fragOutput${g}`).result,d+=`layout(location = ${g}) out vec4 fragOutput${g};
`,g++;n=ne.substitute(n,"//VTK::Output::Dec",d).result;const h=ne.substitute(s,"//VTK::System::Dec",i).result;return{VSSource:f,FSSource:n,GSSource:h}},t.readyShaderProgramArray=(r,o,s)=>{const n=t.replaceShaderValues(r,o,s),i=t.getShaderProgram(n.VSSource,n.FSSource,n.GSSource);return t.readyShaderProgram(i)},t.readyShaderProgram=r=>!r||!r.getCompiled()&&!r.compileShader()||!t.bindShaderProgram(r)?null:r,t.getShaderProgram=(r,o,s)=>{const n=`${r}${o}${s}`,i=Ln.hash(n);if(!(i in e.shaderPrograms)){const f=ne.newInstance();return f.setContext(e.context),f.getVertexShader().setSource(r),f.getFragmentShader().setSource(o),s&&f.getGeometryShader().setSource(s),f.setMd5Hash(i),e.shaderPrograms[i]=f,f}return e.shaderPrograms[i]},t.releaseGraphicsResources=r=>{t.releaseCurrentShaderProgram(),Object.keys(e.shaderPrograms).map(o=>e.shaderPrograms[o]).forEach(o=>o.cleanup()),e.shaderPrograms={}},t.releaseCurrentShaderProgram=()=>{e.lastShaderProgramBound&&(e.lastShaderProgramBound.cleanup(),e.lastShaderProgramBound=null)},t.bindShaderProgram=r=>(e.lastShaderProgramBound===r||(e.lastShaderProgramBound&&e.lastShaderProgramBound.release(),r.bind(),e.lastShaderProgramBound=r),1)}var Gn={lastShaderProgramBound:null,shaderPrograms:null,context:null};function xr(t,e,r={}){Object.assign(e,Gn,r),e.shaderPrograms={},m.obj(t,e),m.setGet(t,e,Nn),m.moveToProtected(t,e,["openGLRenderWindow"]),Un(t,e)}var Pn=m.newInstance(xr,"vtkShaderCache"),zn={newInstance:Pn,extend:xr},{vtkErrorMacro:Wn}=m;function kn(t,e){e.classHierarchy.push("vtkOpenGLTextureUnitManager"),t.deleteTable=()=>{for(let r=0;r<e.numberOfTextureUnits;++r)e.textureUnits[r]===!0&&Wn("some texture units  were not properly released");e.textureUnits=[],e.numberOfTextureUnits=0},t.setContext=r=>{if(e.context!==r){if(e.context!==0&&t.deleteTable(),e.context=r,e.context){e.numberOfTextureUnits=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS);for(let o=0;o<e.numberOfTextureUnits;++o)e.textureUnits[o]=!1}t.modified()}},t.allocate=()=>{for(let r=0;r<e.numberOfTextureUnits;r++)if(!t.isAllocated(r))return e.textureUnits[r]=!0,r;return-1},t.allocateUnit=r=>t.isAllocated(r)?-1:(e.textureUnits[r]=!0,r),t.isAllocated=r=>e.textureUnits[r],t.free=r=>{e.textureUnits[r]=!1},t.freeAll=()=>{for(let r=0;r<e.numberOfTextureUnits;++r)e.textureUnits[r]=!1}}var In={context:null,numberOfTextureUnits:0,textureUnits:0};function mr(t,e,r={}){Object.assign(e,In,r),m.obj(t,e),e.textureUnits=[],m.get(t,e,["numberOfTextureUnits"]),m.setGet(t,e,["context"]),kn(t,e)}var Hn=m.newInstance(mr,"vtkOpenGLTextureUnitManager"),jn={newInstance:Hn,extend:mr};function bn(t,e){e.classHierarchy.push("vtkRenderWindowViewNode"),t.getViewNodeFactory=()=>null,t.getAspectRatio=()=>e.size[0]/e.size[1],t.getAspectRatioForRenderer=r=>{const o=r.getViewportByReference();return e.size[0]*(o[2]-o[0])/((o[3]-o[1])*e.size[1])},t.isInViewport=(r,o,s)=>{const n=s.getViewportByReference(),i=t.getFramebufferSize();return n[0]*i[0]<=r&&n[2]*i[0]>=r&&n[1]*i[1]<=o&&n[3]*i[1]>=o},t.getViewportSize=r=>{const o=r.getViewportByReference(),s=t.getFramebufferSize();return[(o[2]-o[0])*s[0],(o[3]-o[1])*s[1]]},t.getViewportCenter=r=>{const o=t.getViewportSize(r);return[o[0]*.5,o[1]*.5]},t.displayToNormalizedDisplay=(r,o,s)=>{const n=t.getFramebufferSize();return[r/n[0],o/n[1],s]},t.normalizedDisplayToDisplay=(r,o,s)=>{const n=t.getFramebufferSize();return[r*n[0],o*n[1],s]},t.worldToView=(r,o,s,n)=>n.worldToView(r,o,s),t.viewToWorld=(r,o,s,n)=>n.viewToWorld(r,o,s),t.worldToDisplay=(r,o,s,n)=>{const i=n.worldToView(r,o,s),f=t.getViewportSize(n),d=n.viewToProjection(i[0],i[1],i[2],f[0]/f[1]),g=n.projectionToNormalizedDisplay(d[0],d[1],d[2]);return t.normalizedDisplayToDisplay(g[0],g[1],g[2])},t.displayToWorld=(r,o,s,n)=>{const i=t.displayToNormalizedDisplay(r,o,s),f=n.normalizedDisplayToProjection(i[0],i[1],i[2]),d=t.getViewportSize(n),g=n.projectionToView(f[0],f[1],f[2],d[0]/d[1]);return n.viewToWorld(g[0],g[1],g[2])},t.normalizedDisplayToViewport=(r,o,s,n)=>{let i=n.getViewportByReference();i=t.normalizedDisplayToDisplay(i[0],i[1],0);const f=t.normalizedDisplayToDisplay(r,o,s);return[f[0]-i[0]-.5,f[1]-i[1]-.5,s]},t.viewportToNormalizedViewport=(r,o,s,n)=>{const i=t.getViewportSize(n);return i&&i[0]!==0&&i[1]!==0?[r/(i[0]-1),o/(i[1]-1),s]:[r,o,s]},t.normalizedViewportToViewport=(r,o,s,n)=>{const i=t.getViewportSize(n);return[r*(i[0]-1),o*(i[1]-1),s]},t.displayToLocalDisplay=(r,o,s)=>[r,t.getFramebufferSize()[1]-o-1,s],t.viewportToNormalizedDisplay=(r,o,s,n)=>{let i=n.getViewportByReference();i=t.normalizedDisplayToDisplay(i[0],i[1],0);const f=r+i[0]+.5,d=o+i[1]+.5;return t.displayToNormalizedDisplay(f,d,s)},t.getComputedDevicePixelRatio=()=>e.size[0]/t.getContainerSize()[0],t.getContainerSize=()=>{m.vtkErrorMacro("not implemented")},t.getPixelData=(r,o,s,n)=>{m.vtkErrorMacro("not implemented")},t.createSelector=()=>{m.vtkErrorMacro("not implemented")}}var $n={size:void 0,selector:void 0};function Tr(t,e,r={}){Object.assign(e,$n,r),e.size||(e.size=[300,300]),m.getArray(t,e,["size"],2),m.get(t,e,["selector"]),ua.extend(t,e,r),bn(t,e)}var An=m.newInstance(Tr,"vtkRenderWindowViewNode"),wr={newInstance:An,extend:Tr};function Xn(){const t=new Map,e={apply(s,n,i){return t.has(i[0])?t.get(i[0]):s.apply(n,i)}};function r(s){return{apply(n,i,f){return t.set(s,f[0]),n.apply(i,f)}}}const o=Object.create(null);return o.getParameter=(s,n,i,f)=>new Proxy(f.bind(s),e),o.depthMask=(s,n,i,f)=>new Proxy(f.bind(s),r(s.DEPTH_WRITEMASK)),{get(s,n,i){if(n==="__getUnderlyingContext")return()=>s;let f=Reflect.get(s,n,s);f instanceof Function&&(f=f.bind(s));const d=o[n];return d?d(s,n,i,f):f}}}var{vtkDebugMacro:Kn,vtkErrorMacro:Je,vtkWarningMacro:Zn}=m,Qn={position:"absolute",top:0,left:0,width:"100%",height:"100%"},Yn=["activateTexture","deactivateTexture","disableCullFace","enableCullFace","setCullFaceMode","get3DContext","getActiveFramebuffer","getContext","getDefaultTextureByteSize","getDefaultTextureInternalFormat","getGLInformations","getGraphicsMemoryInfo","getGraphicsResourceForObject","getHardwareMaximumLineWidth","getPixelData","getShaderCache","getTextureUnitForTexture","getTextureUnitManager","makeCurrent","releaseGraphicsResources","registerGraphicsResourceUser","unregisterGraphicsResourceUser","restoreContext","setActiveFramebuffer","setContext","setGraphicsResourceForObject"];function ae(t,e,r,o){const s=t.getParameter(t.TEXTURE_BINDING_2D),n=t.getParameter(t.FRAMEBUFFER_BINDING),i=t.createFramebuffer(),f=t.createTexture();t.bindTexture(t.TEXTURE_2D,f),t.texImage2D(t.TEXTURE_2D,0,e,2,2,0,r,o,null),t.bindFramebuffer(t.FRAMEBUFFER,i),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,f,0);const d=t.checkFramebufferStatus(t.FRAMEBUFFER);return t.bindFramebuffer(t.FRAMEBUFFER,n),t.bindTexture(t.TEXTURE_2D,s),t.deleteFramebuffer(i),t.deleteTexture(f),d===t.FRAMEBUFFER_COMPLETE}var je=0,Cr=[];function qn(){je++,Cr.forEach(t=>t(je))}function Jn(){je--,Cr.forEach(t=>t(je))}function zt(t){t.preventDefault()}function es(t,e){e.classHierarchy.push("vtkOpenGLRenderWindow");let r;function o(){return r||(r=Xn()),r}t.getViewNodeFactory=()=>e.myFactory,e.manageCanvas&&(e.canvas.addEventListener("webglcontextlost",zt,!1),e.canvas.addEventListener("webglcontextrestored",t.restoreContext,!1));const s=[0,0];function n(){e.renderable&&e.manageCanvas&&(e.size[0]!==s[0]||e.size[1]!==s[1])&&(s[0]=e.size[0],s[1]=e.size[1],e.canvas.setAttribute("width",e.size[0]),e.canvas.setAttribute("height",e.size[1])),e.viewStream&&e.viewStream.setSize(e.size[0],e.size[1]),e.manageCanvas&&(e.canvas.style.display=e.useOffScreen?"none":"block"),e.el&&(e.el.style.cursor=e.cursorVisibility?e.cursor:"none"),e.containerSize=null}t.onModified(n),t.buildPass=a=>{if(a){if(!e.renderable)return;t.prepareNodes(),t.addMissingNodes(e.renderable.getRenderersByReference()),t.addMissingNodes(e.renderable.getChildRenderWindowsByReference()),t.removeUnusedNodes(),t.initialize(),e.children.forEach(y=>{y.setOpenGLRenderWindow?.(t)})}},t.initialize=()=>{if(!e.initialized){if(e.rootOpenGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e.rootOpenGLRenderWindow)e.context2D=t.get2DContext();else{e.context=t.get3DContext(),t.resizeFromChildRenderWindows(),e.context&&qn(),e.textureUnitManager=jn.newInstance(),e.textureUnitManager.setContext(e.context),e.shaderCache.setContext(e.context);const a=e.context;a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA),a.depthFunc(a.LEQUAL),a.enable(a.BLEND)}e.initialized=!0}},t.makeCurrent=()=>{e.context.makeCurrent()},t.setContainer=a=>{e.el&&e.el!==a&&(e.canvas.parentNode!==e.el&&Je("Error: canvas parent node does not match container"),e.el.removeChild(e.canvas),e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)),e.el!==a&&(e.el=a,e.el&&(e.el.appendChild(e.canvas),e.useBackgroundImage&&e.el.appendChild(e.bgImage)),t.modified())},t.getContainer=()=>e.el,t.getContainerSize=()=>{if(!e.containerSize&&e.el){const{width:a,height:y}=e.el.getBoundingClientRect();e.containerSize=[a,y]}return e.containerSize||e.size},t.getFramebufferSize=()=>e.activeFramebuffer?.getSize()||e.size,t.getPixelData=(a,y,x,T)=>{const C=new Uint8Array((x-a+1)*(T-y+1)*4);return e.context.readPixels(a,y,x-a+1,T-y+1,e.context.RGBA,e.context.UNSIGNED_BYTE,C),C},t.get3DContext=(a={preserveDrawingBuffer:!1,depth:!0,alpha:!0,powerPreference:"high-performance"})=>{const y=typeof WebGL2RenderingContext<"u"?e.canvas.getContext("webgl2",a):null;return y&&Kn("using WebGL2"),y||Je("no WebGL2 context"),new Proxy(y,o())},t.get2DContext=(a={})=>e.canvas.getContext("2d",a),t.restoreContext=()=>{const a=pe.newInstance();a.setCurrentOperation("Release"),a.traverse(t,null)},t.activateTexture=a=>{const y=e._textureResourceIds.get(a);if(y!==void 0){e.context.activeTexture(e.context.TEXTURE0+y);return}const x=t.getTextureUnitManager().allocate();if(x<0){Je("Hardware does not support the number of textures defined.");return}e._textureResourceIds.set(a,x),e.context.activeTexture(e.context.TEXTURE0+x)},t.deactivateTexture=a=>{const y=e._textureResourceIds.get(a);y!==void 0&&(t.getTextureUnitManager().free(y),e._textureResourceIds.delete(a))},t.getTextureUnitForTexture=a=>{const y=e._textureResourceIds.get(a);return y!==void 0?y:-1},t.getDefaultTextureByteSize=(a,y=null,x=!1)=>{switch(a){case $.CHAR:case $.SIGNED_CHAR:case $.UNSIGNED_CHAR:return 1;case y:case x:case $.UNSIGNED_SHORT:case $.SHORT:case $.VOID:return 2;default:return 4}},t.getDefaultTextureInternalFormat=(a,y,x=null,T=!1)=>{switch(a){case $.UNSIGNED_CHAR:switch(y){case 1:return e.context.R8;case 2:return e.context.RG8;case 3:return e.context.RGB8;default:return e.context.RGBA8}case(x&&!T&&$.UNSIGNED_SHORT):switch(y){case 1:return x.R16_EXT;case 2:return x.RG16_EXT;case 3:return x.RGB16_EXT;default:return x.RGBA16_EXT}case(x&&!T&&$.SHORT):switch(y){case 1:return x.R16_SNORM_EXT;case 2:return x.RG16_SNORM_EXT;case 3:return x.RGB16_SNORM_EXT;default:return x.RGBA16_SNORM_EXT}case $.UNSIGNED_SHORT:case $.SHORT:case $.FLOAT:default:switch(y){case 1:return T?e.context.R16F:e.context.R32F;case 2:return T?e.context.RG16F:e.context.RG32F;case 3:return T?e.context.RGB16F:e.context.RGB32F;default:return T?e.context.RGBA16F:e.context.RGBA32F}}},t.setBackgroundImage=a=>{e.bgImage.src=a.src},t.setUseBackgroundImage=a=>{e.useBackgroundImage=a,e.useBackgroundImage&&!e.el.contains(e.bgImage)?e.el.appendChild(e.bgImage):!e.useBackgroundImage&&e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)};function i(a=e.imageFormat){const y=document.createElement("canvas"),x=y.getContext("2d");y.width=e.canvas.width,y.height=e.canvas.height,x.drawImage(e.canvas,0,0);const T=e.canvas.getBoundingClientRect();e.renderable.getRenderers().forEach(w=>{w.getViewProps().forEach(c=>{if(c.getContainer){const p=c.getContainer().getElementsByTagName("canvas");for(let u=0;u<p.length;u++){const l=p[u],v=l.getBoundingClientRect(),S=v.x-T.x,R=v.y-T.y;x.drawImage(l,S,R)}}})});const C=y.toDataURL(a);y.remove(),t.invokeImageReady(C)}t.captureNextImage=(a="image/png",{resetCamera:y=!1,size:x=null,scale:T=1}={})=>{if(e.deleted)return null;let C=x||T!==1?x||e.size.map(c=>c*T):null;C!==null&&!e.manageCanvas&&(Zn("Ignoring the requested screenshot size/scale: resizing the canvas requires manageCanvas=true on vtkOpenGLRenderWindow. Capturing at the current size instead."),C=null),e.imageFormat=a;const w=e.notifyStartCaptureImage;return e.notifyStartCaptureImage=!0,e._screenshot={size:C},new Promise((c,p)=>{const u=t.onImageReady(l=>{if(e._screenshot.size===null)e.notifyStartCaptureImage=w,u.unsubscribe(),e._screenshot.placeHolder&&(e.size=e._screenshot.originalSize,t.modified(),e._screenshot.cameras&&e._screenshot.cameras.forEach(({restoreParamsFn:v,arg:S})=>v(S)),t.traverseAllPasses(),e.el.removeChild(e._screenshot.placeHolder),e._screenshot.placeHolder.remove(),e._screenshot=null),c(l);else{const v=document.createElement("img");if(v.style=Qn,v.src=l,e._screenshot.placeHolder=e.el.appendChild(v),e.canvas.style.display="none",e._screenshot.originalSize=e.size,e.size=e._screenshot.size,e.rootOpenGLRenderWindow?.resizeFromChildRenderWindows(),e._screenshot.size=null,t.modified(),y){const S=y!==!0;e._screenshot.cameras=e.renderable.getRenderers().map(R=>{const B=R.getActiveCamera(),D=B.get("focalPoint","position","parallelScale");return{resetCameraArgs:S?{renderer:R}:void 0,resetCameraFn:S?y:R.resetCamera,restoreParamsFn:B.set,arg:JSON.parse(JSON.stringify(D))}}),e._screenshot.cameras.forEach(({resetCameraFn:R,resetCameraArgs:B})=>R(B))}t.traverseAllPasses()}})})};let f;t.getHardwareMaximumLineWidth=()=>{if(f!=null)return f;const a=t.get3DContext(),y=a.getParameter(a.ALIASED_LINE_WIDTH_RANGE);return f=y[1],y[1]},t.getGLInformations=()=>{if(e._glInformation)return e._glInformation;const a=t.get3DContext(),y=a.getExtension("EXT_color_buffer_float"),x=a.getExtension("WEBGL_debug_renderer_info"),T=a.getExtension("EXT_texture_filter_anisotropic")||a.getExtension("WEBKIT_EXT_texture_filter_anisotropic"),C=[["Max Vertex Attributes","MAX_VERTEX_ATTRIBS",a.getParameter(a.MAX_VERTEX_ATTRIBS)],["Max Varying Vectors","MAX_VARYING_VECTORS",a.getParameter(a.MAX_VARYING_VECTORS)],["Max Vertex Uniform Vectors","MAX_VERTEX_UNIFORM_VECTORS",a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS)],["Max Fragment Uniform Vectors","MAX_FRAGMENT_UNIFORM_VECTORS",a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS)],["Max Fragment Texture Image Units","MAX_TEXTURE_IMAGE_UNITS",a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS)],["Max Vertex Texture Image Units","MAX_VERTEX_TEXTURE_IMAGE_UNITS",a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS)],["Max Combined Texture Image Units","MAX_COMBINED_TEXTURE_IMAGE_UNITS",a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS)],["Max 2D Texture Size","MAX_TEXTURE_SIZE",a.getParameter(a.MAX_TEXTURE_SIZE)],["Max Cube Texture Size","MAX_CUBE_MAP_TEXTURE_SIZE",a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE)],["Max Texture Anisotropy","MAX_TEXTURE_MAX_ANISOTROPY_EXT",T&&a.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)],["Point Size Range","ALIASED_POINT_SIZE_RANGE",a.getParameter(a.ALIASED_POINT_SIZE_RANGE).join(" - ")],["Line Width Range","ALIASED_LINE_WIDTH_RANGE",a.getParameter(a.ALIASED_LINE_WIDTH_RANGE).join(" - ")],["Max Viewport Dimensions","MAX_VIEWPORT_DIMS",a.getParameter(a.MAX_VIEWPORT_DIMS).join(" - ")],["Max Renderbuffer Size","MAX_RENDERBUFFER_SIZE",a.getParameter(a.MAX_RENDERBUFFER_SIZE)],["Framebuffer Red Bits","RED_BITS",a.getParameter(a.RED_BITS)],["Framebuffer Green Bits","GREEN_BITS",a.getParameter(a.GREEN_BITS)],["Framebuffer Blue Bits","BLUE_BITS",a.getParameter(a.BLUE_BITS)],["Framebuffer Alpha Bits","ALPHA_BITS",a.getParameter(a.ALPHA_BITS)],["Framebuffer Depth Bits","DEPTH_BITS",a.getParameter(a.DEPTH_BITS)],["Framebuffer Stencil Bits","STENCIL_BITS",a.getParameter(a.STENCIL_BITS)],["Framebuffer Subpixel Bits","SUBPIXEL_BITS",a.getParameter(a.SUBPIXEL_BITS)],["MSAA Samples","SAMPLES",a.getParameter(a.SAMPLES)],["MSAA Sample Buffers","SAMPLE_BUFFERS",a.getParameter(a.SAMPLE_BUFFERS)],["Supported Formats for UByte Render Targets     ","UNSIGNED_BYTE RENDER TARGET FORMATS",[ae(a,a.RGBA8,a.RGBA,a.UNSIGNED_BYTE)?"RGBA8":"",ae(a,a.RGB8,a.RGB,a.UNSIGNED_BYTE)?"RGB8":"",ae(a,a.RG8,a.RG,a.UNSIGNED_BYTE)?"RG8":"",ae(a,a.R8,a.RED,a.UNSIGNED_BYTE)?"R8":""].join(" ")],["Supported Formats for Half Float Render Targets","HALF FLOAT RENDER TARGET FORMATS",[y&&ae(a,a.RGBA16F,a.RGBA,a.HALF_FLOAT)?"RGBA16F":"",y&&ae(a,a.RG16F,a.RG,a.HALF_FLOAT)?"RG16F":"",y&&ae(a,a.R16F,a.RED,a.HALF_FLOAT)?"R16F":""].join(" ")],["Supported Formats for Full Float Render Targets","FLOAT RENDER TARGET FORMATS",[y&&ae(a,a.RGBA32F,a.RGBA,a.FLOAT)?"RGBA32F":"",y&&ae(a,a.RG32F,a.RG,a.FLOAT)?"RG32F":"",y&&ae(a,a.R32F,a.RED,a.FLOAT)?"R32F":""].join(" ")],["Max Multiple Render Targets Buffers","MAX_DRAW_BUFFERS",a.getParameter(a.MAX_DRAW_BUFFERS)],["High Float Precision in Vertex Shader","HIGH_FLOAT VERTEX_SHADER",[a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).rangeMax,"</sup>)"].join("")],["Medium Float Precision in Vertex Shader","MEDIUM_FLOAT VERTEX_SHADER",[a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).rangeMax,"</sup>)"].join("")],["Low Float Precision in Vertex Shader","LOW_FLOAT VERTEX_SHADER",[a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.LOW_FLOAT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.LOW_FLOAT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.LOW_FLOAT).rangeMax,"</sup>)"].join("")],["High Float Precision in Fragment Shader","HIGH_FLOAT FRAGMENT_SHADER",[a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).rangeMax,"</sup>)"].join("")],["Medium Float Precision in Fragment Shader","MEDIUM_FLOAT FRAGMENT_SHADER",[a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).rangeMax,"</sup>)"].join("")],["Low Float Precision in Fragment Shader","LOW_FLOAT FRAGMENT_SHADER",[a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.LOW_FLOAT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.LOW_FLOAT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.LOW_FLOAT).rangeMax,"</sup>)"].join("")],["High Int Precision in Vertex Shader","HIGH_INT VERTEX_SHADER",[a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_INT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_INT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_INT).rangeMax,"</sup>)"].join("")],["Medium Int Precision in Vertex Shader","MEDIUM_INT VERTEX_SHADER",[a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_INT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_INT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_INT).rangeMax,"</sup>)"].join("")],["Low Int Precision in Vertex Shader","LOW_INT VERTEX_SHADER",[a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.LOW_INT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.LOW_INT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.LOW_INT).rangeMax,"</sup>)"].join("")],["High Int Precision in Fragment Shader","HIGH_INT FRAGMENT_SHADER",[a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_INT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_INT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_INT).rangeMax,"</sup>)"].join("")],["Medium Int Precision in Fragment Shader","MEDIUM_INT FRAGMENT_SHADER",[a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_INT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_INT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_INT).rangeMax,"</sup>)"].join("")],["Low Int Precision in Fragment Shader","LOW_INT FRAGMENT_SHADER",[a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.LOW_INT).precision," (-2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.LOW_INT).rangeMin,"</sup> - 2<sup>",a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.LOW_INT).rangeMax,"</sup>)"].join("")],["Supported Extensions","EXTENSIONS",a.getSupportedExtensions().join("<br/>					    ")],["WebGL Renderer","RENDERER",a.getParameter(a.RENDERER)],["WebGL Vendor","VENDOR",a.getParameter(a.VENDOR)],["WebGL Version","VERSION",a.getParameter(a.VERSION)],["Shading Language Version","SHADING_LANGUAGE_VERSION",a.getParameter(a.SHADING_LANGUAGE_VERSION)],["Unmasked Renderer","UNMASKED_RENDERER",x&&a.getParameter(x.UNMASKED_RENDERER_WEBGL)],["Unmasked Vendor","UNMASKED_VENDOR",x&&a.getParameter(x.UNMASKED_VENDOR_WEBGL)],["WebGL Version","WEBGL_VERSION",2]],w={};for(;C.length;){const[c,p,u]=C.pop();p&&(w[p]={label:c,value:u})}return e._glInformation=w,w},t.traverseAllPasses=()=>{if(e.renderPasses)for(let y=0;y<e.renderPasses.length;++y)e.renderPasses[y].traverse(t,null);t.copyParentContent(),e.notifyStartCaptureImage&&i();const a=e.renderable.getChildRenderWindowsByReference();for(let y=0;y<a.length;++y)t.getViewNodeFor(a[y])?.traverseAllPasses()},t.copyParentContent=()=>{const a=e.rootOpenGLRenderWindow;if(!a||!e.context2D||e.children.some(T=>!!T.getSelector?.()))return;const y=a.getCanvas(),x=e.canvas;e.context2D.drawImage(y,0,y.height-x.height,x.width,x.height,0,0,x.width,x.height)},t.resizeFromChildRenderWindows=()=>{const a=e.renderable.getChildRenderWindowsByReference();if(a.length>0){const y=[0,0];for(let x=0;x<a.length;++x){const T=t.getViewNodeFor(a[x])?.getSize();T&&(y[0]=T[0]>y[0]?T[0]:y[0],y[1]=T[1]>y[1]?T[1]:y[1])}t.setSize(...y)}},t.disableCullFace=()=>{e.cullFaceEnabled&&(e.context.disable(e.context.CULL_FACE),e.cullFaceEnabled=!1)},t.enableCullFace=()=>{e.cullFaceEnabled||(e.context.enable(e.context.CULL_FACE),e.cullFaceEnabled=!0)},t.setCullFaceMode=a=>{e.cullFaceMode!==a&&(e.context.cullFace(a),e.cullFaceMode=a)},t.setViewStream=a=>{if(e.viewStream===a)return!1;if(e.subscription&&(e.subscription.unsubscribe(),e.subscription=null),e.viewStream=a,e.viewStream){const y=e.renderable.getRenderers()[0];y.getBackgroundByReference()[3]=0,t.setUseBackgroundImage(!0),e.subscription=e.viewStream.onImageReady(x=>t.setBackgroundImage(x.image)),e.viewStream.setSize(e.size[0],e.size[1]),e.viewStream.invalidateCache(),e.viewStream.render(),t.modified()}return!0},t.createSelector=()=>{const a=yr.newInstance();return a.setOpenGLRenderWindow(t),a};function d(){e.canvas.removeEventListener("webglcontextlost",zt),e.canvas.removeEventListener("webglcontextrestored",t.restoreContext)}t.delete=m.chain(()=>{e.context&&Jn(),t.setContainer(),t.setViewStream()},d,t.delete),t.setActiveFramebuffer=a=>{e.activeFramebuffer=a};const g=t.setSize;t.setSize=(...a)=>{const y=g(...a);return y&&t.invokeWindowResizeEvent({width:e.size[0],height:e.size[1]}),y},t.registerGraphicsResourceUser=(a,y)=>{e._graphicsResources.has(a)||t.setGraphicsResourceForObject(a,null,null),e._graphicsResources.get(a)?.users.add(y)},t.unregisterGraphicsResourceUser=(a,y)=>{const x=e._graphicsResources.get(a);x&&(x.users.delete(y),x.users.size||(x.oglObject?.releaseGraphicsResources(t),e._graphicsResources.delete(a)))},t.getGraphicsResourceForObject=a=>e._graphicsResources.get(a),t.setGraphicsResourceForObject=(a,y,x)=>{if(!a)return;const T=e._graphicsResources.get(a);T?.oglObject?.releaseGraphicsResources(t),e._graphicsResources.set(a,{coreObject:a,oglObject:y,hash:x,users:T?.users??new Set})},t.getGraphicsMemoryInfo=()=>{let a=0;return e._graphicsResources.forEach(({oglObject:y})=>{a+=y.getAllocatedGPUMemoryInBytes()}),a},t.releaseGraphicsResources=()=>{e.shaderCache!==null&&e.shaderCache.releaseGraphicsResources(t),e._graphicsResources.forEach(({oglObject:a})=>{a.releaseGraphicsResources(t)}),e._graphicsResources.clear(),e.textureUnitManager!==null&&e.textureUnitManager.freeAll(),e.renderable.getRenderersByReference().forEach(a=>{t.getViewNodeFor(a)?.releaseGraphicsResources()})};const h={...t};Yn.forEach(a=>{t[a]=(...y)=>e.rootOpenGLRenderWindow?e.rootOpenGLRenderWindow[a](...y):h[a](...y)})}var ts={cullFaceEnabled:!1,cullFaceMode:null,shaderCache:null,initialized:!1,context:null,context2D:null,canvas:null,manageCanvas:!0,cursorVisibility:!0,cursor:"pointer",textureUnitManager:null,textureResourceIds:null,containerSize:null,renderPasses:[],notifyStartCaptureImage:!1,activeFramebuffer:null,imageFormat:"image/png",useOffScreen:!1,useBackgroundImage:!1};function rs(t,e,r={}){Object.assign(e,ts,r),wr.extend(t,e,r),e.canvas||(e.canvas=document.createElement("canvas"),e.canvas.style.width="100%"),e.selector||(e.selector=yr.newInstance(),e.selector.setOpenGLRenderWindow(t)),e.bgImage=new Image,e.bgImage.style.position="absolute",e.bgImage.style.left="0",e.bgImage.style.top="0",e.bgImage.style.width="100%",e.bgImage.style.height="100%",e.bgImage.style.zIndex="-1",e._textureResourceIds=new Map,e._graphicsResources=new Map,e._glInformation=null,e.myFactory=fa.newInstance(),e.shaderCache=zn.newInstance(),e.shaderCache.setOpenGLRenderWindow(t),e.renderPasses[0]=hn.newInstance(),m.get(t,e,["shaderCache","textureUnitManager","useBackgroundImage","activeFramebuffer","rootOpenGLRenderWindow"]),m.setGet(t,e,["initialized","context","context2D","canvas","manageCanvas","renderPasses","notifyStartCaptureImage","cursor","useOffScreen"]),m.setGetArray(t,e,["size"],2),m.event(t,e,"imageReady"),m.event(t,e,"windowResizeEvent"),es(t,e)}var Rr=m.newInstance(rs,"vtkOpenGLRenderWindow");ht("WebGL",Rr);la("vtkRenderWindow",Rr);var{vtkErrorMacro:as}=At,et=["setBindGroup","setIndexBuffer","setVertexBuffer","draw","drawIndexed"];function ns(t,e){e.classHierarchy.push("vtkWebGPURenderEncoder"),t.begin=r=>{e.drawCallbacks=[],e.handle=r.beginRenderPass(e.description),e.label&&e.handle.pushDebugGroup(e.label)},t.end=()=>{for(let r=0;r<e.drawCallbacks.length;r++){const o=e.drawCallbacks[r],s=o.pipeline;t.setPipeline(s);for(let n=0;n<o.callbacks.length;n++)o.callbacks[n](t)}e.label&&e.handle.popDebugGroup(),e.handle.end(),e.boundPipeline=null},t.setPipeline=r=>{if(e.boundPipeline===r)return;e.handle.setPipeline(r.getHandle());const o=r.getPipelineDescription(),s=o.fragment?.targets;if(e.colorTextureViews.length!==s.length)console.log(`mismatched attachment counts on pipeline ${s.length} while encoder has ${e.colorTextureViews.length}`),console.trace();else for(let n=0;n<e.colorTextureViews.length;n++){const i=e.colorTextureViews[n].getTexture()?.getFormat();i&&i!==s[n].format&&(console.log(`mismatched attachments for attachment ${n} on pipeline ${s[n].format} while encoder has ${i}`),console.trace())}if(!!e.depthTextureView!="depthStencil"in o)console.log("mismatched depth attachments"),console.trace();else if(e.depthTextureView){const n=e.depthTextureView.getTexture()?.getFormat();n&&n!==o.depthStencil.format&&(console.log(`mismatched depth attachments on pipeline ${o.depthStencil.format} while encoder has ${n}`),console.trace())}e.boundPipeline=r},t.replaceShaderCode=r=>{e.replaceShaderCodeFunction(r)},t.setColorTextureView=(r,o)=>{e.colorTextureViews[r]!==o&&(e.colorTextureViews[r]=o)},t.activateBindGroup=r=>{const o=e.boundPipeline.getDevice(),s=e.boundPipeline.getBindGroupLayoutIndex(r.getLabel());if(s<0){as(`vtkWebGPURenderEncoder: could not find bind group layout ${r.getLabel()}`);return}e.handle.setBindGroup(s,r.getBindGroup(o));const n=o.getBindGroupLayoutDescription(r.getBindGroupLayout(o)),i=o.getBindGroupLayoutDescription(e.boundPipeline.getBindGroupLayout(s));n!==i&&(console.log(`renderEncoder ${e.pipelineHash} mismatched bind group layouts bind group has
${n}
 versus pipeline
${i}
`),console.trace())},t.attachTextureViews=()=>{for(let r=0;r<e.colorTextureViews.length;r++)e.description.colorAttachments[r]?e.description.colorAttachments[r].view=e.colorTextureViews[r].getHandle():e.description.colorAttachments[r]={view:e.colorTextureViews[r].getHandle()};e.depthTextureView&&(e.description.depthStencilAttachment.view=e.depthTextureView.getHandle())},t.registerDrawCallback=(r,o)=>{for(let s=0;s<e.drawCallbacks.length;s++)if(e.drawCallbacks[s].pipeline===r){e.drawCallbacks[s].callbacks.push(o);return}e.drawCallbacks.push({pipeline:r,callbacks:[o]})};for(let r=0;r<et.length;r++)t[et[r]]=(...o)=>e.handle[et[r]](...o)}var ss={description:null,handle:null,boundPipeline:null,pipelineHash:null,pipelineSettings:null,replaceShaderCodeFunction:null,depthTextureView:null,label:null};function Or(t,e,r={}){Object.assign(e,ss,r),Xt(t,e),e.description={colorAttachments:[{view:void 0,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:void 0,depthLoadOp:"clear",depthClearValue:0,depthStoreOp:"store"}},e.replaceShaderCodeFunction=o=>{const s=o.getShaderDescription("fragment");s.addOutput("vec4<f32>","outColor");let n=s.getCode();n=I.substitute(n,"//VTK::RenderEncoder::Impl",["output.outColor = computedColor;"]).result,s.setCode(n)},e.pipelineSettings={primitive:{cullMode:"none"},depthStencil:{depthWriteEnabled:!0,depthCompare:"greater-equal",format:"depth32float"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}},e.colorTextureViews=[],ut(t,e,["boundPipeline","colorTextureViews"]),lt(t,e,["depthTextureView","description","handle","label","pipelineHash","pipelineSettings","replaceShaderCodeFunction"]),ns(t,e)}var os=ct(Or,"vtkWebGPURenderEncoder"),fe={newInstance:os,extend:Or};function is(t,e){e.classHierarchy.push("vtkWebGPUOpaquePass"),t.traverse=(r,o)=>{if(e.deleted)return;e._currentParent=o;const s=o.getDevice();if(e.renderEncoder)e.colorTexture.resize(o.getCanvas().width,o.getCanvas().height),e.depthTexture.resize(o.getCanvas().width,o.getCanvas().height);else{t.createRenderEncoder(),e.colorTexture=oe.newInstance({label:"opaquePassColor"}),e.colorTexture.create(s,{width:o.getCanvas().width,height:o.getCanvas().height,format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC});const n=e.colorTexture.createView("opaquePassColorTexture");e.renderEncoder.setColorTextureView(0,n),e.depthFormat="depth32float",e.depthTexture=oe.newInstance({label:"opaquePassDepth"}),e.depthTexture.create(s,{width:o.getCanvas().width,height:o.getCanvas().height,format:e.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC});const i=e.depthTexture.createView("opaquePassDepthTexture");e.renderEncoder.setDepthTextureView(i)}e.renderEncoder.attachTextureViews(),t.setCurrentOperation("opaquePass"),r.setRenderEncoder(e.renderEncoder),r.traverse(t)},t.getColorTextureView=()=>e.renderEncoder.getColorTextureViews()[0],t.getDepthTextureView=()=>e.renderEncoder.getDepthTextureView(),t.createRenderEncoder=()=>{e.renderEncoder=fe.newInstance({label:"OpaquePass"}),e.renderEncoder.setPipelineHash("op")},t.releaseGraphicsResources=()=>{e.renderEncoder=null,e.colorTexture=null,e.depthTexture=null}}var cs={renderEncoder:null,colorTexture:null,depthTexture:null};function Er(t,e,r={}){Object.assign(e,cs,r),pe.extend(t,e,r),m.get(t,e,["colorTexture","depthTexture"]),is(t,e)}var us=m.newInstance(Er,"vtkWebGPUOpaquePass"),ls={newInstance:us,extend:Er},fs=`
//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var tcoord: vec2<i32> = vec2<i32>(i32(input.fragPos.x), i32(input.fragPos.y));
  var reveal: f32 = textureLoad(oitpAccumTexture, tcoord, 0).r;
  if (reveal == 1.0) { discard; }
  var tcolor: vec4<f32> = textureLoad(oitpColorTexture, tcoord, 0);
  var total: f32 = max(tcolor.a, 0.01);
  var computedColor: vec4<f32> = vec4<f32>(tcolor.r/total, tcolor.g/total, tcolor.b/total, 1.0 - reveal);

  //VTK::RenderEncoder::Impl
  return output;
}
`;function ps(t,e){e.classHierarchy.push("vtkWebGPUOrderIndependentTranslucentPass"),t.traverse=(r,o)=>{if(e.deleted)return;e._currentParent=o;const s=o.getDevice();if(e.translucentRenderEncoder)e.translucentColorTexture.resizeToMatch(e.colorTextureView.getTexture()),e.translucentAccumulateTexture.resizeToMatch(e.colorTextureView.getTexture());else{t.createRenderEncoder(),t.createFinalEncoder(),e.translucentColorTexture=oe.newInstance({label:"translucentPassColor"}),e.translucentColorTexture.create(s,{width:o.getCanvas().width,height:o.getCanvas().height,format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});const n=e.translucentColorTexture.createView("oitpColorTexture");e.translucentRenderEncoder.setColorTextureView(0,n),e.translucentAccumulateTexture=oe.newInstance({label:"translucentPassAccumulate"}),e.translucentAccumulateTexture.create(s,{width:o.getCanvas().width,height:o.getCanvas().height,format:"r16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});const i=e.translucentAccumulateTexture.createView("oitpAccumTexture");e.translucentRenderEncoder.setColorTextureView(1,i),e.fullScreenQuad=be.newInstance(),e.fullScreenQuad.setDevice(o.getDevice()),e.fullScreenQuad.setPipelineHash("oitpfsq"),e.fullScreenQuad.setTextureViews(e.translucentRenderEncoder.getColorTextureViews()),e.fullScreenQuad.setFragmentShaderTemplate(fs)}e.translucentRenderEncoder.setDepthTextureView(e.depthTextureView),e.translucentRenderEncoder.attachTextureViews(),t.setCurrentOperation("translucentPass"),r.setRenderEncoder(e.translucentRenderEncoder),r.traverse(t),t.finalPass(o,r)},t.finalPass=(r,o)=>{e.translucentFinalEncoder.setColorTextureView(0,e.colorTextureView),e.translucentFinalEncoder.attachTextureViews(),e.translucentFinalEncoder.begin(r.getCommandEncoder()),o.scissorAndViewport(e.translucentFinalEncoder),e.fullScreenQuad.prepareAndDraw(e.translucentFinalEncoder),e.translucentFinalEncoder.end()},t.getTextures=()=>[e.translucentColorTexture,e.translucentAccumulateTexture],t.createRenderEncoder=()=>{e.translucentRenderEncoder=fe.newInstance({label:"translucentRender"});const r=e.translucentRenderEncoder.getDescription();r.colorAttachments=[{view:void 0,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"},{view:void 0,clearValue:[1,0,0,0],loadOp:"clear",storeOp:"store"}],r.depthStencilAttachment={view:void 0,depthLoadOp:"load",depthStoreOp:"store"},e.translucentRenderEncoder.setReplaceShaderCodeFunction(o=>{const s=o.getShaderDescription("fragment");s.addOutput("vec4<f32>","outColor"),s.addOutput("f32","outAccum"),s.addBuiltinInput("vec4<f32>","@builtin(position) fragPos");let n=s.getCode();n=I.substitute(n,"//VTK::RenderEncoder::Impl",["var w: f32 = computedColor.a * pow(0.1 + input.fragPos.z, 2.0);","output.outColor = vec4<f32>(computedColor.rgb*w, w);","output.outAccum = computedColor.a;"]).result,s.setCode(n)}),e.translucentRenderEncoder.setPipelineHash("oitpr"),e.translucentRenderEncoder.setPipelineSettings({primitive:{cullMode:"none"},depthStencil:{depthWriteEnabled:!1,depthCompare:"greater-equal",format:"depth32float"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"one",dstFactor:"one"},alpha:{srcFactor:"one",dstFactor:"one"}}},{format:"r16float",blend:{color:{srcFactor:"zero",dstFactor:"one-minus-src"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.createFinalEncoder=()=>{e.translucentFinalEncoder=fe.newInstance({label:"translucentFinal"}),e.translucentFinalEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e.translucentFinalEncoder.setReplaceShaderCodeFunction(r=>{const o=r.getShaderDescription("fragment");o.addOutput("vec4<f32>","outColor"),o.addBuiltinInput("vec4<f32>","@builtin(position) fragPos");let s=o.getCode();s=I.substitute(s,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<f32>(computedColor.rgb, computedColor.a);"]).result,o.setCode(s)}),e.translucentFinalEncoder.setPipelineHash("oitpf"),e.translucentFinalEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.releaseGraphicsResources=()=>{e.translucentRenderEncoder=null,e.translucentFinalEncoder=null,e.translucentColorTexture=null,e.translucentAccumulateTexture=null,e.fullScreenQuad=null}}var gs={colorTextureView:null,depthTextureView:null};function Br(t,e,r={}){Object.assign(e,gs,r),pe.extend(t,e,r),m.setGet(t,e,["colorTextureView","depthTextureView"]),ps(t,e)}var hs=m.newInstance(Br,"vtkWebGPUOrderIndependentTranslucentPass"),vs={newInstance:hs,extend:Br},{vtkWarningMacro:tt}=m,Ss=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::Volume::TraverseDec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

fn getTextureValue(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32) -> vec4<f32>
{
  let forceNearestMask = i32(volumeSSBO.values[vNum].componentInfo.w);
  if (forceNearestMask == 0)
  {
    return textureSampleLevel(vTex, clampSampler, tpos.xyz, 0.0);
  }

  // Match the OpenGL mapper's nearest-interpolation convention: re-sample at
  // the texel center (floor(p*dims)+0.5)/dims through the clamp sampler rather
  // than a raw textureLoad. This keeps boundary behaviour identical to WebGL.
  let dims = vec3<f32>(textureDimensions(vTex, 0));
  let nearestPos = (floor(tpos.xyz * dims) + vec3<f32>(0.5)) / dims;
  let nearestValue = textureSampleLevel(vTex, clampSampler, nearestPos, 0.0);
  if (forceNearestMask == 15)
  {
    return nearestValue;
  }

  var value = textureSampleLevel(vTex, clampSampler, tpos.xyz, 0.0);

  if ((forceNearestMask & 1) != 0) { value.x = nearestValue.x; }
  if ((forceNearestMask & 2) != 0) { value.y = nearestValue.y; }
  if ((forceNearestMask & 4) != 0) { value.z = nearestValue.z; }
  if ((forceNearestMask & 8) != 0) { value.w = nearestValue.w; }

  return value;
}

fn getComponent(v: vec4<f32>, idx: u32) -> f32
{
  if (idx == 0u) { return v.x; }
  if (idx == 1u) { return v.y; }
  if (idx == 2u) { return v.z; }
  return v.w;
}

fn getComponentValue(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, component: u32) -> f32
{
  return getComponent(getTextureValue(vTex, tpos, vNum), component);
}

fn getDependentOpacityValue(sample: vec4<f32>, numComp: u32) -> f32
{
  if (numComp == 1u) { return sample.x; }
  if (numComp == 2u) { return sample.y; }
  if (numComp == 3u) { return length(sample.xyz); }
  return sample.w;
}

fn getDependentValue(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, numComp: u32) -> f32
{
  return getDependentOpacityValue(getTextureValue(vTex, tpos, vNum), numComp);
}

fn getTraverseValue(sample: vec4<f32>, vNum: i32) -> f32
{
  let numComp: u32 = u32(volumeSSBO.values[vNum].componentInfo.x);
  if (volumeSSBO.values[vNum].componentInfo.y > 0.5) { return sample.x; }
  return getDependentOpacityValue(sample, numComp);
}

fn getTFunRowCoord(rowIdx: i32, tfunRows: f32) -> f32
{
  return (0.5 + 2.0 * f32(rowIdx)) / tfunRows;
}

fn intersectRayBoundsWithClipPlanes(vNum: i32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, rayBounds: vec2<f32>) -> vec2<f32>
{
  var result: vec2<f32> = rayBounds;
  let clipCount: i32 = i32(volumeSSBO.values[vNum].clipPlaneStates.x);
  if (clipCount <= 0)
  {
    return result;
  }

  ${Array.from({length:6},(t,e)=>`
  if (clipCount > ${e})
  {
    let clipPlane${e}: vec4<f32> = volumeSSBO.values[vNum].clipPlane${e};
    let rayDirRatio${e}: f32 = dot(rayStepSC, clipPlane${e});
    let equationResult${e}: f32 = dot(minPosSC, clipPlane${e});

    let absRayDirRatio${e}: f32 = abs(rayDirRatio${e});
    if (absRayDirRatio${e} > 1e-6)
    {
      let intersection${e}: f32 = -equationResult${e} / rayDirRatio${e};
      result.x = select(result.x, max(result.x, intersection${e}), rayDirRatio${e} > 0.0);
      result.y = select(result.y, min(result.y, intersection${e}), rayDirRatio${e} < 0.0);
    }
    else if (equationResult${e} < 0.0)
    {
      result.x = result.y;
    }

    if (result.x >= result.y)
    {
      return result;
    }
  }`).join(`
`)}

  return result;
}

fn getLabelOutlineThickness(vNum: i32, segmentIndex: i32) -> i32
{
  if (segmentIndex == 0)
  {
    return 0;
  }

  let dims = vec2<i32>(textureDimensions(labelOutlineThicknessTexture, 0));
  let x = clamp(segmentIndex - 1, 0, dims.x - 1);
  let y = clamp(vNum, 0, dims.y - 1);
  return i32(round(textureLoad(labelOutlineThicknessTexture, vec2<i32>(x, y), 0).r * 255.0));
}

// project a viewport tcoord (0..1) at the given NDC depth into the volume's
// texture coordinates.
fn labelFragToTPos(vNum: i32, tcoord: vec2<f32>, fragZ: f32) -> vec4<f32>
{
  let pcPos = vec4<f32>(2.0 * tcoord.x - 1.0, 1.0 - 2.0 * tcoord.y, fragZ, 1.0);
  var scPos = rendererUBO.PCSCMatrix * pcPos;
  scPos = scPos * (1.0 / scPos.w);
  // no half texel offset here: the SCTCMatrix already addresses texel centers
  return volumeSSBO.values[vNum].SCTCMatrix * scPos;
}

// Screen space label outline compare the segment under this fragment with the
// segments under its screen neighbors within the per segment thickness;
// any mismatch means we are on an edge and the outline color is emitted.
// labelOutline = (useLabelOutline, outlineOpacity, textureScale, unused)
fn getColorForLabelOutline(vTex: texture_3d<f32>, tcoord: vec2<f32>, fragZ: f32, vNum: i32, rowStart: i32, tfunRows: f32) -> vec4<f32>
{
  let centerTPos = labelFragToTPos(vNum, tcoord, fragZ);
  if (
    centerTPos.x < 0.0 || centerTPos.y < 0.0 || centerTPos.z < 0.0 ||
    centerTPos.x > 1.0 || centerTPos.y > 1.0 || centerTPos.z > 1.0
  )
  {
    return vec4<f32>(0.0);
  }

  let centerValue = getTextureValue(vTex, centerTPos, vNum);
  // recover the raw label value from the normalized texture sample
  let segmentIndex = i32(round(centerValue.r * volumeSSBO.values[vNum].labelOutline.z));
  if (segmentIndex == 0)
  {
    return vec4<f32>(0.0);
  }

  let rowCoord = getTFunRowCoord(rowStart, tfunRows);
  var coord = vec2<f32>(
    centerValue.r * volumeSSBO.values[vNum].colorScale.x +
      volumeSSBO.values[vNum].colorShift.x,
    rowCoord
  );
  let color = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
  coord.x = centerValue.r * volumeSSBO.values[vNum].opacityScale.x +
    volumeSSBO.values[vNum].opacityShift.x;
  let opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;

  let actualThickness = getLabelOutlineThickness(vNum, segmentIndex);
  if (actualThickness <= 0)
  {
    return vec4<f32>(color, opacity);
  }

  // one fragment in viewport tcoord units
  let fragStep = vec2<f32>(1.0, 1.0) / rendererUBO.viewportSize;

  for (var i = -actualThickness; i <= actualThickness; i = i + 1)
  {
    for (var j = -actualThickness; j <= actualThickness; j = j + 1)
    {
      if (i == 0 && j == 0)
      {
        continue;
      }

      let neighborTcoord = tcoord + vec2<f32>(f32(i), f32(j)) * fragStep;
      let neighborTPos = labelFragToTPos(vNum, neighborTcoord, fragZ);
      let neighborValue = getTextureValue(vTex, neighborTPos, vNum);
      if (any(neighborValue != centerValue))
      {
        return vec4<f32>(color, volumeSSBO.values[vNum].labelOutline.y);
      }
    }
  }

  return vec4<f32>(color, opacity);
}

fn getGradient(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, component: u32) -> vec4<f32>
{
  var result: vec4<f32>;

  var tstep: vec4<f32> = volumeSSBO.values[vNum].tstep;
  // Central differences (matches the OpenGL/WebGL mapper) for smoother normals.
  result.x = getComponentValue(vTex, tpos + vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component)
           - getComponentValue(vTex, tpos - vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component);
  result.y = getComponentValue(vTex, tpos + vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component)
           - getComponentValue(vTex, tpos - vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component);
  result.z = getComponentValue(vTex, tpos + vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component)
           - getComponentValue(vTex, tpos - vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component);
  // WebGPU texture coordinates have their Y axis opposite to the image-index
  // convention used by the OpenGL volume shader.
  result.y = -result.y;
  result.w = 0.0;

  // central difference spans two samples, so the delta is twice the spacing
  result = result / (2.0 * volumeSSBO.values[vNum].spacing);
  // now we have a gradient in unit tcoords

  var grad: f32 = length(result.xyz);
  if (grad > 0.0)
  {
    // rotate to View Coords, needed for lighting and shading
    var nMat: mat4x4<f32> = rendererUBO.SCVCMatrix * volumeSSBO.values[vNum].planeNormals;
    result = nMat * result;
    result = result / length(result);
  }

  // store gradient magnitude in .w
  result.w = grad;

  return result;
}

fn getDependentGradient(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, numComp: u32) -> vec4<f32>
{
  var result: vec4<f32>;

  var tstep: vec4<f32> = volumeSSBO.values[vNum].tstep;
  // Central differences (matches the OpenGL/WebGL mapper) for smoother normals.
  result.x = getDependentValue(vTex, tpos + vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, numComp)
           - getDependentValue(vTex, tpos - vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, numComp);
  result.y = getDependentValue(vTex, tpos + vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, numComp)
           - getDependentValue(vTex, tpos - vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, numComp);
  result.z = getDependentValue(vTex, tpos + vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, numComp)
           - getDependentValue(vTex, tpos - vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, numComp);
  result.y = -result.y;
  result.w = 0.0;

  // central difference spans two samples, so the delta is twice the spacing
  result = result / (2.0 * volumeSSBO.values[vNum].spacing);

  var grad: f32 = length(result.xyz);
  if (grad > 0.0)
  {
    var nMat: mat4x4<f32> = rendererUBO.SCVCMatrix * volumeSSBO.values[vNum].planeNormals;
    result = nMat * result;
    result = result / length(result);
  }

  result.w = grad;

  return result;
}

// Compute the lighting normal after mapping neighboring scalar values through
// the opacity transfer function. This matches computeDensityNormal in the
// OpenGL volume shader and is used when computeNormalFromOpacity is enabled.
fn getOpacityGradient(
  vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32,
  component: u32, rowIdx: i32, gradientOpacity: f32) -> vec4<f32>
{
  let tstep = volumeSSBO.values[vNum].tstep;
  let tfunRows = f32(textureDimensions(ofunTexture).y);
  var result = vec4<f32>(
    getOpacity(getComponentValue(vTex, tpos + vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component), rowIdx, tfunRows) -
      getOpacity(getComponentValue(vTex, tpos - vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component), rowIdx, tfunRows),
    getOpacity(getComponentValue(vTex, tpos + vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component), rowIdx, tfunRows) -
      getOpacity(getComponentValue(vTex, tpos - vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component), rowIdx, tfunRows),
    getOpacity(getComponentValue(vTex, tpos + vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component), rowIdx, tfunRows) -
      getOpacity(getComponentValue(vTex, tpos - vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component), rowIdx, tfunRows),
    0.0
  );
  result.y = -result.y;
  result = result * gradientOpacity / volumeSSBO.values[vNum].spacing;
  let gradientMagnitude = length(result.xyz);
  if (gradientMagnitude > 0.0)
  {
    let normalMatrix = rendererUBO.SCVCMatrix * volumeSSBO.values[vNum].planeNormals;
    result = normalMatrix * result;
    result = vec4<f32>(normalize(result.xyz), gradientMagnitude);
  }
  result.w = gradientMagnitude;
  return result;
}

fn getSampleOpacity(vTex: texture_3d<f32>, sample: vec4<f32>, tpos: vec4<f32>, vNum: i32, rowStart: i32) -> f32
{
  let numComp: u32 = u32(volumeSSBO.values[vNum].componentInfo.x);
  let independent = volumeSSBO.values[vNum].componentInfo.y > 0.5;
  let tfunRows = f32(textureDimensions(tfunTexture).y);

  if (independent)
  {
    var alpha: f32 = 0.0;
    for (var c: u32 = 0u; c < numComp; c = c + 1u)
    {
      let rowIdx: i32 = rowStart + i32(c);
      let scalar = getComponent(sample, c);
      var opacity = getOpacity(scalar, rowIdx, tfunRows);
      if (componentSSBO.values[rowIdx].gomin < 1.0)
      {
        let normal = getGradient(vTex, tpos, vNum, c);
        let gofactor = clamp(
          normal.a * componentSSBO.values[rowIdx].goScale + componentSSBO.values[rowIdx].goShift,
          componentSSBO.values[rowIdx].gomin,
          componentSSBO.values[rowIdx].gomax
        );
        opacity = opacity * gofactor;
      }
      alpha = alpha + componentSSBO.values[rowIdx].mixWeight * opacity;
    }
    return min(alpha, 1.0);
  }

  let opacityScalar = getDependentOpacityValue(sample, numComp);
  var opacity: f32;
  if (numComp == 1u)
  {
    opacity = getOpacity(sample.r, rowStart, tfunRows);
  }
  else if (numComp == 2u)
  {
    opacity = getOpacity(sample.g, rowStart, tfunRows);
  }
  else if (numComp == 3u)
  {
    opacity = getOpacity(opacityScalar, rowStart, tfunRows);
  }
  else
  {
    opacity = getOpacity(sample.a, rowStart, tfunRows);
  }

  if (componentSSBO.values[rowStart].gomin < 1.0)
  {
    let normal = getDependentGradient(vTex, tpos, vNum, numComp);
    let gofactor = clamp(
      normal.a * componentSSBO.values[rowStart].goScale + componentSSBO.values[rowStart].goShift,
      componentSSBO.values[rowStart].gomin,
      componentSSBO.values[rowStart].gomax
    );
    opacity = opacity * gofactor;
  }

  return opacity;
}

fn getViewVector(posVC: vec3<f32>) -> vec3<f32>
{
  if (rendererUBO.cameraParallel != 0u)
  {
    return vec3<f32>(0.0, 0.0, 1.0);
  }
  return normalize(-posVC);
}

fn getRayDirection(posVC: vec3<f32>) -> vec3<f32>
{
  return -getViewVector(posVC);
}

fn phaseFunction(cosAngle: f32, vNum: i32) -> f32
{
  let anisotropy = volumeSSBO.values[vNum].scattering.z;
  if (abs(anisotropy) <= 0.000001)
  {
    return 0.5;
  }

  let anisotropy2 = volumeSSBO.values[vNum].scattering.w;
  return ((1.0 - anisotropy2) /
    pow(1.0 + anisotropy2 - 2.0 * anisotropy * cosAngle, 1.5)) *
    0.5;
}

fn getVolumeLightDirection(posVC: vec3<f32>, lightIdx: i32) -> vec3<f32>
{
  let lightType = i32(rendererLightSSBO.values[lightIdx].LightData.x);
  if (lightType == 1)
  {
    return -normalize(
      (rendererUBO.WCVCNormals *
        vec4<f32>(normalize(rendererLightSSBO.values[lightIdx].LightDir.xyz), 0.0)).xyz
    );
  }

  let lightPosVC = rendererLightSSBO.values[lightIdx].LightPos.xyz;
  let lightOffset = lightPosVC - posVC;
  let lightDistance = length(lightOffset);
  if (lightDistance <= 0.0)
  {
    return vec3<f32>(0.0, 0.0, 0.0);
  }
  return lightOffset / lightDistance;
}

fn getFragmentSeed(fragPos: vec4<f32>) -> f32
{
  let firstNoise =
    fract(sin(dot(fragPos.xy, vec2<f32>(12.9898, 78.233))) * 43758.5453);
  let x = (i32(floor(fragPos.x)) % 32 + 32) % 32;
  let y = (i32(floor(fragPos.y)) % 32 + 32) % 32;
  let secondNoise = jitterSSBO.values[y * 32 + x].value;
  let noiseSum = firstNoise + secondNoise;
  return select(noiseSum - 1.0, noiseSum, noiseSum < 1.0);
}

fn sampleDirectionUniform(fragmentSeed: f32, rayIndex: i32) -> vec3<f32>
{
  let rayRandomness = kernelSampleSSBO.values[rayIndex].value;
  var mergedRandom = rayRandomness + vec2<f32>(fragmentSeed, fragmentSeed);
  if (mergedRandom.x >= 1.0) { mergedRandom.x = mergedRandom.x - 1.0; }
  if (mergedRandom.y >= 1.0) { mergedRandom.y = mergedRandom.y - 1.0; }
  let u = mergedRandom.x;
  let v = mergedRandom.y;
  let theta = u * 6.28318530718;
  let phi = acos(2.0 * v - 1.0);
  let sinTheta = sin(theta);
  let cosTheta = cos(theta);
  let sinPhi = sin(phi);
  let cosPhi = cos(phi);
  return vec3<f32>(sinPhi * cosTheta, sinPhi * sinTheta, cosPhi);
}

fn computeLAO(vTex: texture_3d<f32>, fragPos: vec4<f32>, posVC: vec3<f32>, normalVC: vec4<f32>, originalOpacity: f32, vNum: i32, rowStart: i32) -> f32
{
  if (normalVC.w <= 0.0 || originalOpacity <= 0.05)
  {
    return 1.0;
  }

  let kernelSize = i32(volumeSSBO.values[vNum].lao.x);
  if (kernelSize <= 0)
  {
    return 1.0;
  }
  let kernelRadius = i32(volumeSSBO.values[vNum].lao.y);
  let fragmentSeed = getFragmentSeed(fragPos);

  var visibilitySum = 0.0;
  var weightSum = 0.0;
  var i: i32 = 0;
  loop
  {
    if (i >= kernelSize) { break; }
    var rayDirectionVC = sampleDirectionUniform(fragmentSeed, i);
    var normalDotRay = dot(normalVC.xyz, rayDirectionVC);
    if (normalDotRay > 0.0)
    {
      rayDirectionVC = -rayDirectionVC;
      normalDotRay = -normalDotRay;
    }

    var currTC = (volumeSSBO.values[vNum].VCTCMatrix * vec4<f32>(posVC, 1.0)).xyz;
    let rayStepTC = (volumeSSBO.values[vNum].VCTCMatrix *
      vec4<f32>(rayDirectionVC * mapperUBO.SampleDistance, 0.0)).xyz;
    var visibility = 1.0;

    var j: i32 = 0;
    loop
    {
      if (j >= kernelRadius) { break; }
      currTC = currTC + rayStepTC;
      if (any(currTC < vec3<f32>(0.0)) || any(currTC > vec3<f32>(1.0)))
      {
        break;
      }
      let sampleTC = vec4<f32>(currTC, 1.0);
      let opacity = getSampleOpacity(vTex, getTextureValue(vTex, sampleTC, vNum), sampleTC, vNum, rowStart);
      visibility = visibility * (1.0 - opacity);
      if (visibility <= 0.000001)
      {
        visibility = 0.0;
        break;
      }
      j++;
    }

    let rayWeight = -normalDotRay;
    visibilitySum = visibilitySum + visibility * rayWeight;
    weightSum = weightSum + rayWeight;
    i++;
  }

  if (weightSum == 0.0)
  {
    return 1.0;
  }

  // LAO factor is the average ray visibility (low visibility -> low ambient).
  // The 0.3 floor matches the OpenGL mapper and reduces variance/noise so that
  // heavily occluded samples never collapse to fully black.
  return clamp(visibilitySum / weightSum, 0.3, 1.0);
}

fn applySurfaceLighting(vTex: texture_3d<f32>, fragPos: vec4<f32>, tColor: vec3<f32>, alpha: f32, posVC: vec3<f32>, normalVC: vec4<f32>, vNum: i32, rowStart: i32) -> vec3<f32>
{
  if (rendererUBO.LightCount <= 0)
  {
    return tColor;
  }

  let lighting = volumeSSBO.values[vNum].lighting;
  let ambient = lighting.x;
  let diffuseCoeff = lighting.y;
  let specularCoeff = lighting.z;
  let specularPower = lighting.w;
  let viewDir = getViewVector(posVC);
  let laoFactor = computeLAO(vTex, fragPos, posVC, normalVC, alpha, vNum, rowStart);

  var diffuse = vec3<f32>(0.0);
  var specular = vec3<f32>(0.0);

  var i: i32 = 0;
  loop
  {
    if (i >= rendererUBO.LightCount) { break; }

    let lightColor =
      rendererLightSSBO.values[i].LightColor.rgb *
      (rendererLightSSBO.values[i].LightColor.w * 0.2);
    let lightType = i32(rendererLightSSBO.values[i].LightData.x);

    var lightDirection = vec3<f32>(0.0);
    var attenuation = 1.0;

    if (lightType == 0)
    {
      let lightPosVC = rendererLightSSBO.values[i].LightPos.xyz;
      let lightOffset = posVC - lightPosVC;
      let lightDistance = length(lightOffset);
      if (lightDistance <= 0.0)
      {
        i++;
        continue;
      }
      lightDirection = lightOffset / lightDistance;
      let attenuationValues = rendererLightSSBO.values[i].LightAttenuation.xyz;
      attenuation = 1.0 / max(
        0.000001,
        attenuationValues.x + lightDistance *
          (attenuationValues.y + lightDistance * attenuationValues.z)
      );
    }
    else if (lightType == 1)
    {
      lightDirection = -normalize(
        (rendererUBO.WCVCNormals *
          vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.0)).xyz
      );
    }
    else if (lightType == 2)
    {
      let lightPosVC = rendererLightSSBO.values[i].LightPos.xyz;
      let lightOffset = posVC - lightPosVC;
      let lightDistance = length(lightOffset);
      if (lightDistance <= 0.0)
      {
        i++;
        continue;
      }
      lightDirection = lightOffset / lightDistance;
      let attenuationValues = rendererLightSSBO.values[i].LightAttenuation.xyz;
      attenuation = 1.0 / max(
        0.000001,
        attenuationValues.x + lightDistance *
          (attenuationValues.y + lightDistance * attenuationValues.z)
      );

      let spotDirVC = -normalize(
        (rendererUBO.WCVCNormals *
          vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.0)).xyz
      );
      let theta = dot(spotDirVC, lightDirection);
      let innerCone = rendererLightSSBO.values[i].LightData.y;
      if (theta < innerCone)
      {
        i++;
        continue;
      }
      attenuation = attenuation * pow(
        max(theta, 0.0),
        rendererLightSSBO.values[i].LightAttenuation.w
      );
    }
    else
    {
      i++;
      continue;
    }

    var ndotL = dot(normalVC.xyz, lightDirection);
    if (ndotL < 0.0 && volumeSSBO.values[vNum].shade.z > 0.0)
    {
      ndotL = -ndotL;
    }
    ndotL = max(ndotL, 0.0);
    if (ndotL > 0.0)
    {
      diffuse += ndotL * attenuation * lightColor;

      let reflectDir = normalize(lightDirection - 2.0 * ndotL * normalVC.xyz);
      let vdotR = max(dot(viewDir, reflectDir), 0.0);
      if (vdotR > 0.0)
      {
        specular += pow(vdotR, specularPower) * attenuation * lightColor;
      }
    }

    i++;
  }

  return tColor * (ambient * laoFactor + diffuseCoeff * diffuse) +
    specularCoeff * specular;
}

// The OpenGL mapper uses its simpler applyLighting path for the default
// independent-component preset. In particular, that path does not apply
// two-sided lighting, positional attenuation, LAO, or volume scattering.
fn applyIndependentLighting(tColor: vec3<f32>, normalVC: vec4<f32>, vNum: i32) -> vec3<f32>
{
  let lighting = volumeSSBO.values[vNum].lighting;
  var diffuse = vec3<f32>(0.0);
  var specular = vec3<f32>(0.0);

  var i: i32 = 0;
  loop
  {
    if (i >= rendererUBO.LightCount) { break; }

    let lightColor =
      rendererLightSSBO.values[i].LightColor.rgb *
      (rendererLightSSBO.values[i].LightColor.w * 0.2);
    let lightDirection = -normalize(
      (rendererUBO.WCVCNormals *
        vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.0)).xyz
    );
    let df = dot(normalVC.xyz, lightDirection);
    if (df > 0.0)
    {
      diffuse = diffuse + df * lightColor;
      let halfAngle = vec3<f32>(
        -0.5 * lightDirection.x,
        -0.5 * lightDirection.y,
        -0.5 * (lightDirection.z - 1.0)
      );
      let sf = dot(normalVC.xyz, -halfAngle);
      if (sf > 0.0)
      {
        specular = specular +
          pow(sf, lighting.w) * lightColor;
      }
    }
    i++;
  }

  return tColor * (diffuse * lighting.y + lighting.x) +
    specular * lighting.z;
}

fn applyVolumeLighting(vTex: texture_3d<f32>, tColor: vec3<f32>, posVC: vec3<f32>, vNum: i32, rowStart: i32, fragmentSeed: f32) -> vec3<f32>
{
  if (rendererUBO.LightCount <= 0)
  {
    return tColor;
  }

  let lighting = volumeSSBO.values[vNum].lighting;
  let ambient = lighting.x;
  let diffuseCoeff = lighting.y;
  let rayDir = getRayDirection(posVC);
  var diffuse = vec3<f32>(0.0);

  var i: i32 = 0;
  loop
  {
    if (i >= rendererUBO.LightCount) { break; }

    let lightDir = getVolumeLightDirection(posVC, i);
    if (dot(lightDir, lightDir) > 0.0)
    {
      let lightColor =
        rendererLightSSBO.values[i].LightColor.rgb *
        (rendererLightSSBO.values[i].LightColor.w * 0.2);
      let shadowCoeff = computeVolumeShadow(vTex, posVC, lightDir, vNum, rowStart, fragmentSeed);
      let phaseAttenuation = phaseFunction(dot(rayDir, lightDir), vNum);
      diffuse += phaseAttenuation * shadowCoeff * lightColor;
    }

    i++;
  }

  return tColor * (ambient + diffuseCoeff * diffuse);
}

fn rayIntersectTextureDistances(rayOriginTC: vec3<f32>, rayDirTC: vec3<f32>) -> vec2<f32>
{
  let invDir = 1.0 / rayDirTC;
  let distancesTo0 = invDir * (vec3<f32>(0.0) - rayOriginTC);
  let distancesTo1 = invDir * (vec3<f32>(1.0) - rayOriginTC);
  let dMinPerAxis = min(distancesTo0, distancesTo1);
  let dMaxPerAxis = max(distancesTo0, distancesTo1);
  let distanceMin = max(dMinPerAxis.x, max(dMinPerAxis.y, dMinPerAxis.z));
  let distanceMax = min(dMaxPerAxis.x, min(dMaxPerAxis.y, dMaxPerAxis.z));
  return vec2<f32>(distanceMin, distanceMax);
}

fn computeVolumeShadow(vTex: texture_3d<f32>, posVC: vec3<f32>, lightDirVC: vec3<f32>, vNum: i32, rowStart: i32, fragmentSeed: f32) -> f32
{
  // Jitter the shadow step length per fragment by a random factor in [1.5, 3.0]
  // to break up banding, matching the OpenGL mapper (mix(1.5, 3.0, fragmentSeed)).
  let shadowStepLength = volumeSSBO.values[vNum].shadow.y * mix(1.5, 3.0, fragmentSeed);
  if (shadowStepLength <= 0.0)
  {
    return 1.0;
  }

  let initialPosVC = posVC + shadowStepLength * lightDirVC;
  let rayOriginTC = (volumeSSBO.values[vNum].VCTCMatrix * vec4<f32>(initialPosVC, 1.0)).xyz;
  let lightReach = volumeSSBO.values[vNum].scattering.y * volumeSSBO.values[vNum].shadow.x;
  if (lightReach <= 0.0)
  {
    return 1.0;
  }

  let lightDirTC = (volumeSSBO.values[vNum].VCTCMatrix * vec4<f32>(lightDirVC, 0.0)).xyz;
  if (dot(lightDirTC, lightDirTC) <= 0.0)
  {
    return 1.0;
  }

  let intersectionDistances = rayIntersectTextureDistances(rayOriginTC, lightDirTC);
  if (intersectionDistances.y <= intersectionDistances.x || intersectionDistances.y <= 0.0)
  {
    return 1.0;
  }

  let startDistance = max(intersectionDistances.x, 0.0);
  let endDistance = min(intersectionDistances.y, startDistance + lightReach);
  if (endDistance <= startDistance)
  {
    return 1.0;
  }

  var currentDistance = startDistance;
  var shadow = 1.0;
  loop
  {
    if (currentDistance > endDistance) { break; }
    let sampleTC = rayOriginTC + currentDistance * lightDirTC;
    let sample = getTextureValue(vTex, vec4<f32>(sampleTC, 1.0), vNum);
    let opacity = getSampleOpacity(
      vTex,
      sample,
      vec4<f32>(sampleTC, 1.0),
      vNum,
      rowStart
    );
    shadow = shadow * (1.0 - opacity);
    if (shadow <= 0.000001)
    {
      return 0.0;
    }
    currentDistance = currentDistance + shadowStepLength;
  }

  return shadow;
}

fn applyAllLighting(vTex: texture_3d<f32>, fragPos: vec4<f32>, tColor: vec3<f32>, alpha: f32, posVC: vec3<f32>, normalVC: vec4<f32>, vNum: i32, rowStart: i32) -> vec3<f32>
{
  if (rendererUBO.LightCount <= 0)
  {
    return tColor;
  }

  // volCoeff decides how much volume shadowing vs surface shadowing to apply
  // (ported from the OpenGL mapper's applyAllLightning):
  //   0                 <= volCoeff < EPSILON       => surface shadows only
  //   EPSILON           <= volCoeff < 1 - EPSILON   => mix of surface + volume
  //   1 - EPSILON       <= volCoeff                 => volume shadows only
  // It scales the user's VolumetricScatteringBlending (scattering.x) by:
  //   (1 - alpha*0.5)            -> more transparent samples lean volumetric
  //   (1 - atan(grad) * 1/(4pi)) -> weaker gradients lean volumetric
  // normalVC.w is the gradient magnitude and 0.0795774715 == 1/(4*PI).
  let volCoeff = volumeSSBO.values[vNum].scattering.x *
    (1.0 - alpha * 0.5) *
    (1.0 - atan(normalVC.w) * 0.0795774715);

  if (volCoeff <= 0.000001)
  {
    return applySurfaceLighting(vTex, fragPos, tColor, alpha, posVC, normalVC, vNum, rowStart);
  }

  // per fragment seed shared by all lights for the shadow step jitter
  let fragmentSeed = getFragmentSeed(fragPos);
  let volumeShadedColor = applyVolumeLighting(vTex, tColor, posVC, vNum, rowStart, fragmentSeed);
  if (volCoeff >= 0.999999)
  {
    return volumeShadedColor;
  }

  let surfaceShadedColor =
    applySurfaceLighting(vTex, fragPos, tColor, alpha, posVC, normalVC, vNum, rowStart);
  return mix(surfaceShadedColor, volumeShadedColor, volCoeff);
}

fn processVolumeSample(
  vTex: texture_3d<f32>, fragPos: vec4<f32>, vNum: i32, rowStart: i32,
  posSC: vec4<f32>, tpos: vec4<f32>, sample: vec4<f32>,
  tfunRows: f32, enableShading: bool) -> vec4<f32>
{
  var outColor: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);

  let numComp: u32 = u32(volumeSSBO.values[vNum].componentInfo.x);
  let independent = volumeSSBO.values[vNum].componentInfo.y > 0.5;
  let colorMixPreset = i32(volumeSSBO.values[vNum].componentInfo.z);
  let posVC = (rendererUBO.SCVCMatrix * posSC).xyz;

  if (independent)
  {
    if (colorMixPreset == 1 && numComp >= 2u)
    {
      let scalar0 = getComponent(sample, 0u);
      let scalar1 = getComponent(sample, 1u);
      let rowIdx0 = rowStart;
      let rowIdx1 = rowStart + 1;

      let coord0 = vec2<f32>(
        scalar0 * componentSSBO.values[rowIdx0].cScale + componentSSBO.values[rowIdx0].cShift,
        getTFunRowCoord(rowIdx0, tfunRows)
      );
      let coord1 = vec2<f32>(
        scalar1 * componentSSBO.values[rowIdx1].cScale + componentSSBO.values[rowIdx1].cShift,
        getTFunRowCoord(rowIdx1, tfunRows)
      );
      var color0 = textureSampleLevel(tfunTexture, clampSampler, coord0, 0.0).rgb;
      var color1 = textureSampleLevel(tfunTexture, clampSampler, coord1, 0.0).rgb;
      var opacity0 = getOpacity(scalar0, rowIdx0, tfunRows);
      var opacity1 = getOpacity(scalar1, rowIdx1, tfunRows);

      var normal0 = vec4<f32>(0.0);
      var normal1 = vec4<f32>(0.0);
      if (componentSSBO.values[rowIdx0].gomin < 1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal0 = getGradient(vTex, tpos, vNum, 0u);
        if (componentSSBO.values[rowIdx0].gomin < 1.0)
        {
          opacity0 = opacity0 * clamp(
            normal0.a * componentSSBO.values[rowIdx0].goScale + componentSSBO.values[rowIdx0].goShift,
            componentSSBO.values[rowIdx0].gomin,
            componentSSBO.values[rowIdx0].gomax
          );
        }
      }
      if (componentSSBO.values[rowIdx1].gomin < 1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal1 = getGradient(vTex, tpos, vNum, 1u);
        if (componentSSBO.values[rowIdx1].gomin < 1.0)
        {
          opacity1 = opacity1 * clamp(
            normal1.a * componentSSBO.values[rowIdx1].goScale + componentSSBO.values[rowIdx1].goShift,
            componentSSBO.values[rowIdx1].gomin,
            componentSSBO.values[rowIdx1].gomax
          );
        }
      }

      let opacitySum = opacity0 + opacity1;
      if (opacitySum <= 0.0)
      {
        return outColor;
      }

      if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        if (volumeSSBO.values[vNum].shade[1] > 0.0)
        {
          normal0 = getOpacityGradient(vTex, tpos, vNum, 0u, rowIdx0, 1.0);
          normal1 = getOpacityGradient(vTex, tpos, vNum, 1u, rowIdx1, 1.0);
        }
        color0 = applyAllLighting(vTex, fragPos, color0, opacity0, posVC, normal0, vNum, rowIdx0);
        color1 = applyAllLighting(vTex, fragPos, color1, opacity1, posVC, normal1, vNum, rowIdx1);
      }

      outColor = vec4<f32>(
        (opacity0 * color0 + opacity1 * color1) / opacitySum,
        min(1.0, opacitySum)
      );
      return outColor;
    }

    if (colorMixPreset == 2 && numComp >= 2u)
    {
      let scalar0 = getComponent(sample, 0u);
      let scalar1 = getComponent(sample, 1u);
      let rowIdx0 = rowStart;
      let rowIdx1 = rowStart + 1;

      let coord0 = vec2<f32>(
        scalar0 * componentSSBO.values[rowIdx0].cScale + componentSSBO.values[rowIdx0].cShift,
        getTFunRowCoord(rowIdx0, tfunRows)
      );
      let coord1 = vec2<f32>(
        scalar1 * componentSSBO.values[rowIdx1].cScale + componentSSBO.values[rowIdx1].cShift,
        getTFunRowCoord(rowIdx1, tfunRows)
      );
      var color0 = textureSampleLevel(tfunTexture, clampSampler, coord0, 0.0).rgb;
      let colorizingColor = textureSampleLevel(tfunTexture, clampSampler, coord1, 0.0).rgb;
      var opacity0 = getOpacity(scalar0, rowIdx0, tfunRows);
      let colorizingOpacity = getOpacity(scalar1, rowIdx1, tfunRows);

      var normal0 = vec4<f32>(0.0);
      if (componentSSBO.values[rowIdx0].gomin < 1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal0 = getGradient(vTex, tpos, vNum, 0u);
        if (componentSSBO.values[rowIdx0].gomin < 1.0)
        {
          opacity0 = opacity0 * clamp(
            normal0.a * componentSSBO.values[rowIdx0].goScale + componentSSBO.values[rowIdx0].goShift,
            componentSSBO.values[rowIdx0].gomin,
            componentSSBO.values[rowIdx0].gomax
          );
        }
      }

      var color = color0 * mix(vec3<f32>(1.0), colorizingColor, colorizingOpacity);
      if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        if (volumeSSBO.values[vNum].shade[1] > 0.0)
        {
          normal0 = getOpacityGradient(vTex, tpos, vNum, 0u, rowIdx0, 1.0);
        }
        color = applyAllLighting(vTex, fragPos, color, opacity0, posVC, normal0, vNum, rowIdx0);
      }

      outColor = vec4<f32>(color, opacity0);
      return outColor;
    }

    var mixedColor: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var mixedAlpha: f32 = 0.0;
    if (i32(componentSSBO.values[rowStart].opacityMode) == 1)
    {
      mixedAlpha = 1.0;
    }
    for (var c: u32 = 0u; c < numComp; c = c + 1u)
    {
      let rowIdx: i32 = rowStart + i32(c);
      let scalar = getComponent(sample, c);
      var coord: vec2<f32> =
        vec2<f32>(
          scalar * componentSSBO.values[rowIdx].cScale + componentSSBO.values[rowIdx].cShift,
          getTFunRowCoord(rowIdx, tfunRows)
        );
      var color: vec3<f32> = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
      coord.x = scalar * componentSSBO.values[rowIdx].oScale + componentSSBO.values[rowIdx].oShift;
      var opacity: f32 = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;

      var gofactor: f32 = 1.0;
      var sampleAlpha = opacity;
      var normal: vec4<f32> = vec4<f32>(0.0,0.0,0.0,0.0);
      if (componentSSBO.values[rowIdx].gomin <  1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal = getGradient(vTex, tpos, vNum, c);
        if (componentSSBO.values[rowIdx].gomin <  1.0)
        {
          gofactor = clamp(normal.a*componentSSBO.values[rowIdx].goScale + componentSSBO.values[rowIdx].goShift,
            componentSSBO.values[rowIdx].gomin, componentSSBO.values[rowIdx].gomax);
        }
      }
      sampleAlpha = gofactor * opacity;

      if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        color = applyIndependentLighting(color, normal, vNum);
      }

      let mixWeight = componentSSBO.values[rowIdx].mixWeight;
      let opacityMode = i32(componentSSBO.values[rowIdx].opacityMode);
      if (opacityMode == 1)
      {
        color = color * sampleAlpha;
        mixedAlpha = mixedAlpha * mix(sampleAlpha, 1.0, 1.0 - mixWeight);
      }
      else
      {
        mixedAlpha = mixedAlpha + mixWeight * sampleAlpha;
      }
      mixedColor = mixedColor + mixWeight * color;
    }

    outColor = vec4<f32>(mixedColor, min(mixedAlpha, 1.0));
    return outColor;
  }

  let opacityScalar = getDependentOpacityValue(sample, numComp);
  var coord: vec2<f32> =
    vec2<f32>(
      0.0,
      getTFunRowCoord(rowStart, tfunRows)
    );
  var opacity: f32 = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  var color: vec3<f32>;
  if (numComp == 1u)
  {
    coord.x = sample.r * volumeSSBO.values[vNum].colorScale.x +
      volumeSSBO.values[vNum].colorShift.x;
    color = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
    coord.x = sample.r * volumeSSBO.values[vNum].opacityScale.x +
      volumeSSBO.values[vNum].opacityShift.x;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }
  else if (numComp == 2u)
  {
    color = vec3<f32>(
      sample.r * volumeSSBO.values[vNum].colorScale.x +
        volumeSSBO.values[vNum].colorShift.x
    );
    coord.x = sample.g * volumeSSBO.values[vNum].opacityScale.y +
      volumeSSBO.values[vNum].opacityShift.y;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }
  else if (numComp == 3u)
  {
    color = vec3<f32>(
      sample.r * volumeSSBO.values[vNum].colorScale.x +
        volumeSSBO.values[vNum].colorShift.x,
      sample.g * volumeSSBO.values[vNum].colorScale.y +
        volumeSSBO.values[vNum].colorShift.y,
      sample.b * volumeSSBO.values[vNum].colorScale.z +
        volumeSSBO.values[vNum].colorShift.z
    );
    coord.x = opacityScalar * volumeSSBO.values[vNum].opacityScale.x +
      volumeSSBO.values[vNum].opacityShift.x;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }
  else
  {
    color = vec3<f32>(
      sample.r * volumeSSBO.values[vNum].colorScale.x +
        volumeSSBO.values[vNum].colorShift.x,
      sample.g * volumeSSBO.values[vNum].colorScale.y +
        volumeSSBO.values[vNum].colorShift.y,
      sample.b * volumeSSBO.values[vNum].colorScale.z +
        volumeSSBO.values[vNum].colorShift.z
    );
    coord.x = sample.a * volumeSSBO.values[vNum].opacityScale.w +
      volumeSSBO.values[vNum].opacityShift.w;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }

  var gofactor: f32 = 1.0;
  var normal: vec4<f32> = vec4<f32>(0.0,0.0,0.0,0.0);
  if (componentSSBO.values[rowStart].gomin <  1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
  {
    normal = getDependentGradient(vTex, tpos, vNum, numComp);
    if (componentSSBO.values[rowStart].gomin <  1.0)
    {
      gofactor = clamp(normal.a*componentSSBO.values[rowStart].goScale + componentSSBO.values[rowStart].goShift,
        componentSSBO.values[rowStart].gomin, componentSSBO.values[rowStart].gomax);
    }
  }

  let alpha = gofactor * opacity;
  if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
  {
    if (volumeSSBO.values[vNum].shade[1] > 0.0)
    {
      var opacityComponent: u32 = 0u;
      if (numComp == 2u) { opacityComponent = 1u; }
      if (numComp == 4u) { opacityComponent = 3u; }
      let opacityNormal = getOpacityGradient(
        vTex, tpos, vNum, opacityComponent, rowStart, gofactor);
      if (opacityNormal.w > 0.0)
      {
        normal = opacityNormal;
      }
    }
    color = applyAllLighting(vTex, fragPos, color, alpha, posVC, normal, vNum, rowStart);
  }

  outColor = vec4<f32>(color, alpha);

  return outColor;
}

fn processVolume(vTex: texture_3d<f32>, fragPos: vec4<f32>, vNum: i32, rowStart: i32, posSC: vec4<f32>, tfunRows: f32) -> vec4<f32>
{
  let tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix * posSC;
  if (tpos.x < 0.0 || tpos.y < 0.0 || tpos.z < 0.0 ||
      tpos.x > 1.0 || tpos.y > 1.0 || tpos.z > 1.0)
  {
    return vec4<f32>(0.0);
  }
  let sample = getTextureValue(vTex, tpos, vNum);
  return processVolumeSample(
    vTex, fragPos, vNum, rowStart, posSC, tpos, sample, tfunRows, true);
}

// adjust the start and end point of a raycast such that it intersects the unit cube.
// This function is used to take a raycast starting point and step vector
// and numSteps and return the startijng and ending steps for intersecting the
// unit cube. Recall for a 3D texture, the unit cube is the range of texture coordsinates
// that have valid values. So this funtion can be used to take a ray in texture coordinates
// and bound it to intersecting the texture.
//
fn adjustBounds(tpos: vec4<f32>, tstep: vec4<f32>, numSteps: f32) -> vec2<f32>
{
  var result: vec2<f32> = vec2<f32>(0.0, numSteps);
  var tpos2: vec4<f32> = tpos + tstep*numSteps;

  // move tpos to the start of the volume
  var adjust: f32 =
    min(
      max(tpos.x/tstep.x, (tpos.x - 1.0)/tstep.x),
      min(
        max((tpos.y - 1.0)/tstep.y, tpos.y/tstep.y),
        max((tpos.z - 1.0)/tstep.z, tpos.z/tstep.z)));
  if (adjust < 0.0)
  {
    result.x = result.x - adjust;
  }

  // adjust length to the end
  adjust =
    max(
      min(tpos2.x/tstep.x, (tpos2.x - 1.0)/tstep.x),
      max(
        min((tpos2.y - 1.0)/tstep.y, tpos2.y/tstep.y),
        min((tpos2.z - 1.0)/tstep.z, tpos2.z/tstep.z)));
  if (adjust > 0.0)
  {
    result.y = result.y - adjust;
  }

  return result;
}

fn getSimpleColor(scalar: f32, rowIdx: i32, tfunRows: f32) -> vec4<f32>
{
  var coord: vec2<f32> =
    vec2<f32>(scalar * componentSSBO.values[rowIdx].cScale + componentSSBO.values[rowIdx].cShift,
      getTFunRowCoord(rowIdx, tfunRows));
  var color: vec4<f32> = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0);
  coord.x = (scalar * componentSSBO.values[rowIdx].oScale + componentSSBO.values[rowIdx].oShift);
  var opacity: f32 = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  return vec4<f32>(color.rgb, opacity);
}

fn getOpacity(scalar: f32, rowIdx: i32, tfunRows: f32) -> f32
{
  let coord = vec2<f32>(
    scalar * componentSSBO.values[rowIdx].oScale + componentSSBO.values[rowIdx].oShift,
    getTFunRowCoord(rowIdx, tfunRows)
  );
  return textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
}

fn getRadonColor(scalar: f32, rowIdx: i32, tfunRows: f32) -> vec4<f32>
{
  let coord = vec2<f32>(
    scalar * componentSSBO.values[rowIdx].cScale + componentSSBO.values[rowIdx].cShift,
    getTFunRowCoord(rowIdx, tfunRows)
  );
  let color = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
  // Radon/ output is an opaque intensity image: the accumulated
  // attenuation is already encoded in the lookup coordinate, so alpha is 1.0.
  return vec4<f32>(color, 1.0);
}

fn traverseMax(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  // sample the entry point, then jitter the interior samples per fragment to
  // break up banding (matches the OpenGL mapper)
  var selectedValue = getTextureValue(vTex, tpos, vNum);
  var selectedTpos = tpos;
  var selectedPosSC = minPosSC + rayStepSC * rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  if (rayBounds.y - rayBounds.x <= 1.0)
  {
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      selectedPosSC, selectedTpos, selectedValue, tfunRows, false);
    return;
  }
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let currentValue = getTextureValue(vTex, tpos, vNum);
    let nextValue = max(selectedValue, currentValue);
    if (any(nextValue != selectedValue))
    {
      selectedTpos = tpos;
      selectedPosSC = minPosSC + rayStepSC * curDist;
    }
    selectedValue = nextValue;

    // increment position
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  let finalValue = max(selectedValue, endValue);
  if (any(finalValue != selectedValue))
  {
    selectedTpos = endTpos;
    selectedPosSC = minPosSC + rayStepSC * rayBounds.y;
  }
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx, selectedPosSC, selectedTpos, finalValue, tfunRows, false);
}

fn traverseMin(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  // sample the entry point, then jitter the interior samples per fragment to
  // break up banding (matches the OpenGL mapper)
  var selectedValue = getTextureValue(vTex, tpos, vNum);
  var selectedTpos = tpos;
  var selectedPosSC = minPosSC + rayStepSC * rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  if (rayBounds.y - rayBounds.x <= 1.0)
  {
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      selectedPosSC, selectedTpos, selectedValue, tfunRows, false);
    return;
  }
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let currentValue = getTextureValue(vTex, tpos, vNum);
    let nextValue = min(selectedValue, currentValue);
    if (any(nextValue != selectedValue))
    {
      selectedTpos = tpos;
      selectedPosSC = minPosSC + rayStepSC * curDist;
    }
    selectedValue = nextValue;

    // increment position
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  let finalValue = min(selectedValue, endValue);
  if (any(finalValue != selectedValue))
  {
    selectedTpos = endTpos;
    selectedPosSC = minPosSC + rayStepSC * rayBounds.y;
  }
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx, selectedPosSC, selectedTpos, finalValue, tfunRows, false);
}

fn valueWithinIPRange(sample: vec4<f32>, vNum: i32) -> bool
{
  let rangeMin = volumeSSBO.values[vNum].ipScalarRangeMin;
  let rangeMax = volumeSSBO.values[vNum].ipScalarRangeMax;
  let numComp = u32(volumeSSBO.values[vNum].componentInfo.x);
  let independent = volumeSSBO.values[vNum].componentInfo.y > 0.5;
  if (numComp > 1u && !independent)
  {
    return false;
  }
  for (var component: u32 = 0u; component < numComp; component = component + 1u)
  {
    let value = getComponent(sample, component);
    if (value < getComponent(rangeMin, component) ||
        value > getComponent(rangeMax, component))
    {
      return false;
    }
  }
  return true;
}

fn traverseAverage(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  let raySpan = rayBounds.y - rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  let firstValue = getTextureValue(vTex, tpos, vNum);
  if (raySpan <= 1.0)
  {
    // Match the OpenGL mapper's effective coverage for a subsample projection
    // ray. Its rasterized entry/exit interval is 5/4 of the analytic interval
    // used by this fullscreen WebGPU pass.
    let thinRayWeight = raySpan * 1.25;
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      minPosSC + rayStepSC * rayBounds.x, tpos, firstValue * thinRayWeight, tfunRows, false);
    return;
  }

  var sum = vec4<f32>(0.0);
  var totalWeight: f32 = 0.0;
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  if (valueWithinIPRange(firstValue, vNum))
  {
    sum = sum + firstValue * jitter;
    totalWeight = totalWeight + jitter;
  }
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let sample = getTextureValue(vTex, tpos, vNum);
    if (valueWithinIPRange(sample, vNum))
    {
      sum = sum + sample;
      totalWeight = totalWeight + 1.0;
    }

    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  if (valueWithinIPRange(endValue, vNum))
  {
    sum = sum + endValue;
    totalWeight = totalWeight + rayBounds.y - curDist;
  }

  if (totalWeight <= 0.0)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  // WebGL leaves alpha unscaled here because only RGB components are averaged
  // by its vec4 divisor.
  let average = vec4<f32>(sum.rgb / totalWeight, sum.a);
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx,
    minPosSC + rayStepSC * rayBounds.y, endTpos, average, tfunRows, false);
}

fn traverseAdditive(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  let raySpan = rayBounds.y - rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  let firstValue = getTextureValue(vTex, tpos, vNum);
  if (raySpan <= 1.0)
  {
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      minPosSC + rayStepSC * rayBounds.x, tpos, firstValue * raySpan, tfunRows, false);
    return;
  }

  var sum = vec4<f32>(0.0);
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  if (valueWithinIPRange(firstValue, vNum))
  {
    sum = sum + firstValue * jitter;
  }
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let sample = getTextureValue(vTex, tpos, vNum);
    if (valueWithinIPRange(sample, vNum))
    {
      sum = sum + sample;
    }
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  if (valueWithinIPRange(endValue, vNum))
  {
    sum = sum + endValue;
  }
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx,
    minPosSC + rayStepSC * rayBounds.y, endTpos, sum, tfunRows, false);
}

// Radon: accumulate attenuation along the ray to produce a
// "normalized ray intensity" that is then mapped through the transfer function
// by getRadonColor. The result is an opaque intensity image (alpha is always
// 1.0), so no opacity is composited here.
//
// Port of the OpenGL mapper's RADON_TRANSFORM_BLEND path: the ray start is
// jittered per fragment to break up banding, and the leading/trailing partial
// samples are weighted by their fractional step length so thin slabs and ray
// endpoints integrate correctly (rather than marching uniform integer steps).
fn traverseRadon(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  let tpos0: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos0;

  var rayBounds: vec2<f32> = adjustBounds(tpos0, tstep, numSteps);

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  let raySpan: f32 = rayBounds.y - rayBounds.x;
  let sampleDistance: f32 = mapperUBO.SampleDistance;

  // Thin volumes can intersect the ray across less than a full sample step.
  if (raySpan <= 1.0)
  {
    let scalar: f32 = getTraverseValue(getTextureValue(vTex, tpos0 + tstep*rayBounds.x, vNum), vNum);
    let intensity = 1.0 - raySpan * sampleDistance * getOpacity(scalar, rowIdx, tfunRows);
    traverseVals[vNum] = getRadonColor(intensity, rowIdx, tfunRows);
    return;
  }

  let jitter: f32 = getFragmentSeed(fragPos);
  var normalizedRayIntensity: f32 = 1.0;

  // Leading partial sample at the entry point, weighted by the jitter offset.
  var tpos: vec4<f32> = tpos0 + tstep*rayBounds.x;
  let firstScalar: f32 = getTraverseValue(getTextureValue(vTex, tpos, vNum), vNum);
  normalizedRayIntensity = normalizedRayIntensity -
    jitter * sampleDistance * getOpacity(firstScalar, rowIdx, tfunRows);

  // Offset the start by the jitter so the interior samples are dithered.
  var curStep: f32 = rayBounds.x + jitter;
  tpos = tpos + tstep*jitter;

  // Full interior steps.
  loop
  {
    if (curStep + 1.0 >= rayBounds.y) { break; }
    let scalar: f32 = getTraverseValue(getTextureValue(vTex, tpos, vNum), vNum);
    normalizedRayIntensity = normalizedRayIntensity -
      sampleDistance * getOpacity(scalar, rowIdx, tfunRows);
    curStep = curStep + 1.0;
    tpos = tpos + tstep;
  }

  // Trailing partial sample at the clamped exit point.
  let remaining: f32 = rayBounds.y - curStep;
  if (remaining > 0.0)
  {
    var endPos: vec4<f32> = tpos0 + tstep*rayBounds.y;
    endPos = vec4<f32>(clamp(endPos.xyz, vec3<f32>(0.0), vec3<f32>(1.0)), 1.0);
    let endScalar: f32 = getTraverseValue(getTextureValue(vTex, endPos, vNum), vNum);
    normalizedRayIntensity = normalizedRayIntensity -
      remaining * sampleDistance * getOpacity(endScalar, rowIdx, tfunRows);
  }

  traverseVals[vNum] = getRadonColor(normalizedRayIntensity, rowIdx, tfunRows);
}

// Labelmap edge projection (LABELMAP_EDGE_PROJECTION_BLEND). Expects a two
// component volume: component 0 holds the image intensity and component 1
// the segment labels. The center ray does a maximum intensity projection of
// component 0 while collecting every segment index it crosses into a
// bitmask. For each collected segment, rays march again from the screen
// neighbors within the per segment outline thickness; when a neighbor ray
// never crosses the segment the fragment lies on the segment's projected
// edge and takes the segment's color from its own transfer function row.
var<private> labelEdgeSegmentBits: array<u32, 8>;

fn setLabelEdgeBit(segmentIndex: i32)
{
  if (segmentIndex > 0 && segmentIndex < 256)
  {
    labelEdgeSegmentBits[segmentIndex / 32] =
      labelEdgeSegmentBits[segmentIndex / 32] | (1u << u32(segmentIndex % 32));
  }
}

fn isLabelEdgeBitSet(segmentIndex: i32) -> bool
{
  return (labelEdgeSegmentBits[segmentIndex / 32] &
    (1u << u32(segmentIndex % 32))) != 0u;
}

// project a viewport tcoord (0..1) at the given NDC depth to SC coordinates
fn labelEdgeTcoordToSC(tcoord: vec2<f32>, fragZ: f32) -> vec4<f32>
{
  var scPos = rendererUBO.PCSCMatrix *
    vec4<f32>(2.0 * tcoord.x - 1.0, 1.0 - 2.0 * tcoord.y, fragZ, 1.0);
  return scPos * (1.0 / scPos.w);
}

// march the ray cast from a neighboring fragment and report whether it never
// crosses the given segment (true = the center fragment is on an edge with
// respect to this neighbor). The neighbor ray marches its own volume bounds
// front to back, covering the same span through the volume as the center ray.
fn labelEdgeNeighborMissesSegment(
  vTex: texture_3d<f32>, vNum: i32, segmentIndex: i32,
  minPosSC: vec4<f32>, rayStepSC: vec4<f32>, numSteps: f32) -> bool
{
  let labelScale: f32 = volumeSSBO.values[vNum].labelOutline.z;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix * minPosSC;
  let tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix * (minPosSC + rayStepSC);
  let tstep: vec4<f32> = tpos2 - tpos;

  let rayBounds: vec2<f32> = adjustBounds(tpos, tstep, numSteps);
  if (rayBounds.x >= rayBounds.y)
  {
    return true;
  }

  tpos = tpos + tstep * rayBounds.x;
  var curDist: f32 = rayBounds.x;
  loop
  {
    let sample: vec4<f32> = getTextureValue(vTex, tpos, vNum);
    if (i32(round(sample.y * labelScale)) == segmentIndex)
    {
      return false;
    }
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
    if (curDist > rayBounds.y) { break; }
  }
  return true;
}

fn traverseLabelEdge(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, segRowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>, tcoord: vec2<f32>, fragZ: f32)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  // scale to recover the raw label value from the normalized sample
  let labelScale: f32 = volumeSSBO.values[vNum].labelOutline.z;

  // clear the segment bitmask (private vars are zero initialized once per
  // invocation, but several volumes can share this blend mode)
  for (var w: i32 = 0; w < 8; w = w + 1) { labelEdgeSegmentBits[w] = 0u; }

  // maximum intensity projection of component 0 along the center ray while
  // collecting the segment indices (component 1) it crosses
  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  var sample: vec4<f32> = getTextureValue(vTex, tpos, vNum);
  var maxVal: f32 = sample.x;
  var segmentIndex: i32 = i32(round(sample.y * labelScale));
  var seenNonZero: bool = segmentIndex != 0;
  setLabelEdgeBit(segmentIndex);

  // handle very thin volumes
  if (rayBounds.y - rayBounds.x <= 1.0)
  {
    traverseVals[vNum] = getSimpleColor(maxVal, rowIdx, tfunRows);
    return;
  }

  // jitter the interior samples per fragment to break up banding
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    sample = getTextureValue(vTex, tpos, vNum);
    maxVal = max(maxVal, sample.x);
    segmentIndex = i32(round(sample.y * labelScale));
    if (segmentIndex != 0)
    {
      seenNonZero = true;
      setLabelEdgeBit(segmentIndex);
    }

    // increment position
    curDist = curDist + 1.0;
    tpos = tpos + tstep;

    // check if we have reached a terminating condition
    if (curDist > rayBounds.y) { break; }
  }

  // the ray never crossed a segment: output the projected image value
  if (!seenNonZero)
  {
    traverseVals[vNum] = getSimpleColor(maxVal, rowIdx, tfunRows);
    return;
  }

  // SC offsets of one fragment step in x and y at the ray entry depth; the
  // neighbor rays reuse the center ray's step direction and length
  let fragStep: vec2<f32> = vec2<f32>(1.0, 1.0) / rendererUBO.viewportSize;
  let baseSC: vec4<f32> = labelEdgeTcoordToSC(tcoord, fragZ);
  let deltaXSC: vec4<f32> =
    labelEdgeTcoordToSC(tcoord + vec2<f32>(fragStep.x, 0.0), fragZ) - baseSC;
  let deltaYSC: vec4<f32> =
    labelEdgeTcoordToSC(tcoord + vec2<f32>(0.0, fragStep.y), fragZ) - baseSC;

  // used to skip the full neighborhood scan when the fragments are small
  // relative to the voxels (zoomed out), in which case the four corner
  // checks below already catch every edge fragment
  let volSpacing: vec4<f32> = volumeSSBO.values[vNum].spacing;
  let minVoxelSpacing: f32 = min(volSpacing.x, min(volSpacing.y, volSpacing.z));
  let minFragSpacing: f32 = min(length(deltaXSC.xyz), length(deltaYSC.xyz));

  for (var s: i32 = 1; s < 256; s = s + 1)
  {
    // bail out quickly if the segment was not seen by the center ray
    if (!isLabelEdgeBitSet(s))
    {
      continue;
    }

    let actualThickness: i32 = getLabelOutlineThickness(vNum, s);
    if (actualThickness <= 0)
    {
      continue;
    }

    // check the extreme corners of the neighborhood first since there is a
    // better chance of finding the edge there, letting us bail out before
    // the full neighborhood scan
    let t: f32 = f32(actualThickness);
    var onEdge: bool =
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC - t*deltaXSC - t*deltaYSC, rayStepSC, numSteps) ||
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC + t*deltaXSC + t*deltaYSC, rayStepSC, numSteps) ||
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC + t*deltaXSC - t*deltaYSC, rayStepSC, numSteps) ||
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC - t*deltaXSC + t*deltaYSC, rayStepSC, numSteps);

    // the full scan runs only when the fragments are small enough relative
    // to the voxels that an edge can pass between the corners; otherwise the
    // corner checks above already caught every edge fragment (zoomed out)
    if (!onEdge &&
        minVoxelSpacing <= (2.0 * t - 1.0) * minFragSpacing)
    {
      // loop through the rest, skipping the processed corners and the center
      for (var i: i32 = -actualThickness; i <= actualThickness && !onEdge; i = i + 1)
      {
        for (var j: i32 = -actualThickness; j <= actualThickness && !onEdge; j = j + 1)
        {
          if ((i == 0 && j == 0) ||
              (abs(i) == actualThickness && abs(j) == actualThickness))
          {
            continue;
          }
          onEdge = labelEdgeNeighborMissesSegment(
            vTex, vNum, s,
            minPosSC + f32(i)*deltaXSC + f32(j)*deltaYSC, rayStepSC, numSteps);
        }
      }
    }

    if (onEdge)
    {
      // edge fragment: emit the segment's color and opacity from the label
      // component's transfer function row
      traverseVals[vNum] = getSimpleColor(f32(s) / labelScale, segRowIdx, tfunRows);
      return;
    }
  }

  // interior fragment: fall back to the projected image value
  traverseVals[vNum] = getSimpleColor(maxVal, rowIdx, tfunRows);
}

// opacity correction for samples that cover less than a full sample step
// (thin volumes / slabs and the trailing partial step), like the OpenGL
// mapper's 1-pow(1-a, raySteps) handling
fn correctSampleAlpha(alpha: f32, stepWeight: f32) -> f32
{
  if (stepWeight >= 1.0)
  {
    return alpha;
  }
  return 1.0 - pow(1.0 - alpha, max(stepWeight, 0.0));
}

fn composite(fragPos: vec4<f32>, tcoord: vec2<f32>, fragZ: f32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>) -> vec4<f32>
{
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;

  var rayPosSC: vec4<f32> = minPosSC;

  // how many rows (tfuns) do we have in our tfunTexture
  var tfunRows: f32 = f32(textureDimensions(tfunTexture).y);

  var curDist: f32 = 0.0;
  var computedColor: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  var sampleColor: vec4<f32>;
  // combined sample of all volumes at the current step
  var stepColor: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  // fraction of a full sample step the current sample covers. This is driven
  // by a coverage cursor from the segment start (the jitter only shifts the
  // sample position, not the covered length) so the total opacity matches
  // the OpenGL mapper's 1-pow(1-a, raySteps) behaviour for thin slabs.
  var stepWeight: f32 = 1.0;
  var coveredSteps: f32 = 0.0;
  // union of the per volume ray bounds (in steps), accumulated by the
  // generated TraverseInit code below
  var unionBounds: vec2<f32> = vec2<f32>(1.0e37, -1.0e37);
//VTK::Volume::TraverseCalls
//VTK::Volume::TraverseInit

  // Advance the ray to the first volume intersection and stop at the last
  // one, like the OpenGL mapper which intersects the volume box before
  // marching. Without this, rays shorter than a sample step (thin slabs)
  // take their single sample at the ray start, which can lie outside a
  // volume that only begins partway through the slab, cutting its edge.
  let clampedStart: f32 = max(0.0, unionBounds.x);
  let clampedEnd: f32 = min(numSteps, unionBounds.y);
  if (clampedEnd <= clampedStart) { return computedColor; }
  // Decide jitter from the clipped interval, not the untrimmed camera ray.
  // A thin MPR slab is often shorter than one sample even when the camera
  // ray is very long; jittering that slab skips it for random fragments.
  let clippedSteps: f32 = clampedEnd - clampedStart;
  let jitter: f32 = select(
    0.01 + 0.99 * getFragmentSeed(fragPos),
    0.0,
    clippedSteps <= 1.0);
  curDist = (clampedStart + jitter) * mapperUBO.SampleDistance;
  rayPosSC = minPosSC + rayStepSC * (clampedStart + jitter);
  coveredSteps = clampedStart;
  let endDist: f32 = clampedEnd * mapperUBO.SampleDistance;

  loop
  {
    stepWeight = min(1.0, clampedEnd - coveredSteps);
    coveredSteps = coveredSteps + stepWeight;
    stepColor = vec4<f32>(0.0, 0.0, 0.0, 0.0);

    // for each volume, sample and accumulate color
//VTK::Volume::CompositeCalls

    // increment position
    curDist = curDist + mapperUBO.SampleDistance;
    rayPosSC = rayPosSC + rayStepSC;

    // check if we have reached a terminating condition
    if (curDist > endDist) { break; }
    if (computedColor.a > 0.98) { break; }
  }
  return computedColor;
}

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  // the depth bounds textures store 1 - depth so the r16float values keep
  // their precision near the camera (see the VolumePass depth range encoder)
  var rayMax: f32 = 1.0 - textureSampleLevel(maxTexture, clampSampler, input.tcoordVS, 0.0).r;
  var rayMin: f32 = 1.0 - textureSampleLevel(minTexture, clampSampler, input.tcoordVS, 0.0).r;

  // Parallel cameras may legitimately use a clipping range that crosses the
  // camera plane. With a large range, the volume can occupy about one
  // representable step in the r16float depth-bound textures. Pad such an
  // interval around its measured center instead of using the full clipping
  // range, which would lose precision again in the f32 ray coordinates. The
  // analytic per-volume bounds intersection below trims the padded ray.
  if (rendererUBO.cameraParallel != 0u && mapperUBO.CamNear < 0.0 &&
      rayMax - rayMin < 0.001)
  {
    let rayCenter = 0.5 * (rayMax + rayMin);
    rayMax = min(1.0, rayCenter + 0.001);
    rayMin = max(0.0, rayCenter - 0.001);
  }

  // If the camera near plane cuts into the volume (e.g. MPR slab slicing or
  // fly-through), the front faces of the depth bounds geometry are clipped
  // away and only exit fragments remain (entry == exit). Restart the ray at
  // the near plane (depth 1.0 in reversed-z) like the OpenGL mapper, which
  // casts from the near plane and intersects the volume in the shader; the
  // per-volume bounds intersection below trims the ray to the volume.
  if (rayMax <= rayMin && rayMin < 1.0)
  {
    rayMax = 1.0;
  }

  // No depth bounds at all: nearly edge-on cube faces can rasterize to
  // nothing at the silhouette (especially when the near plane cuts into the
  // volume), visibly clipping the volume edge versus the OpenGL mapper,
  // which intersects the volume analytically from a full screen quad. Seed
  // such rays with the full clipping range instead of discarding; the
  // per volume bounds intersection exits early when nothing is hit.
  if (rayMax <= rayMin)
  {
    rayMax = 1.0;
    rayMin = select(mapperUBO.CamNear / mapperUBO.CamFar, 0.0,
      rendererUBO.cameraParallel != 0u);
  }

  // discard empty rays
  if (rayMax <= rayMin) { discard; }
  else
  {
    // compute start and end ray positions in view coordinates
    var minPosSC: vec4<f32> = rendererUBO.PCSCMatrix*vec4<f32>(2.0 * input.tcoordVS.x - 1.0, 1.0 - 2.0 * input.tcoordVS.y, rayMax, 1.0);
    minPosSC = minPosSC * (1.0 / minPosSC.w);
    var maxPosSC: vec4<f32> = rendererUBO.PCSCMatrix*vec4<f32>(2.0 * input.tcoordVS.x - 1.0, 1.0 - 2.0 * input.tcoordVS.y, rayMin, 1.0);
    maxPosSC = maxPosSC * (1.0 / maxPosSC.w);

    // Clamp the ray segment to the camera clipping range in view coordinates
    // (like the OpenGL mapper's camNear/camThick clamp). The projection is
    // reversed-z with an infinite far plane in perspective, so the depth
    // bounds geometry is never clipped against the far plane, and the r16float
    // depth bounds are too coarse near 1.0 to clamp in depth space. This is
    // what makes thin camera clipping ranges render as slices like they do in WebGL.
    let entryZVC: f32 = (rendererUBO.SCVCMatrix * minPosSC).z;
    let exitZVC: f32 = (rendererUBO.SCVCMatrix * maxPosSC).z;
    let zRangeVC: f32 = exitZVC - entryZVC;
    if (abs(zRangeVC) > 1.0e-10)
    {
      let tNear: f32 = (-mapperUBO.CamNear - entryZVC) / zRangeVC;
      let tFar: f32 = (-mapperUBO.CamFar - entryZVC) / zRangeVC;
      let t0: f32 = max(0.0, tNear);
      let t1: f32 = min(1.0, tFar);
      if (t0 >= t1) { discard; }
      let raySpanSC: vec4<f32> = maxPosSC - minPosSC;
      maxPosSC = minPosSC + t1 * raySpanSC;
      minPosSC = minPosSC + t0 * raySpanSC;
    }

    var rayLengthSC: f32 = distance(minPosSC.xyz, maxPosSC.xyz);
    var rayStepSC: vec4<f32> = (maxPosSC - minPosSC)*(mapperUBO.SampleDistance/rayLengthSC);
    rayStepSC.w = 0.0;

    var computedColor: vec4<f32>;

//VTK::Volume::Loop

//VTK::RenderEncoder::Impl
  }

  return output;
}
`,N=new Float64Array(16),H=new Float64Array(16),Wt=new Float64Array(16),rt=new Float64Array(16),kt=new Float64Array(3),It=new Float64Array(3);function ds(t,e){e.classHierarchy.push("vtkWebGPUVolumePassFSQ"),t.replaceShaderPosition=(s,n,i)=>{const f=n.getShaderDescription("vertex");f.addBuiltinOutput("vec4<f32>","@builtin(position) Position");let d=f.getCode();d=I.substitute(d,"//VTK::Position::Impl",["output.tcoordVS = vec2<f32>(vertexBC.x * 0.5 + 0.5, 1.0 - vertexBC.y * 0.5 - 0.5);","output.Position = vec4<f32>(vertexBC, 1.0);"]).result,f.setCode(d),n.getShaderDescription("fragment").addBuiltinInput("vec4<f32>","@builtin(position) fragPos")},e.shaderReplacements.set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderVolume=(s,n,i)=>{const f=n.getShaderDescription("fragment");let d=f.getCode();const g=[],h=[];for(let c=0;c<e.volumes.length;c++){const p=e.volumes[c].getRenderable(),u=p.getMapper(),l=u.getBlendMode(),v=u.getInputData()?.getPointData()?.getScalars()?.getNumberOfComponents?.(),S=l===A.COMPOSITE_BLEND&&p.getProperty().getUseLabelOutline()&&v===1;l===A.COMPOSITE_BLEND&&(h.push(`  var tpos${c}: vec4<f32> = volumeSSBO.values[${c}].SCTCMatrix*minPosSC;`),h.push(`  var tpos2_${c}: vec4<f32> = volumeSSBO.values[${c}].SCTCMatrix*(minPosSC + rayStepSC);`),h.push(`  var tstep${c}: vec4<f32> = tpos2_${c} - tpos${c};`),h.push(`  var rayBounds${c}: vec2<f32> = intersectRayBoundsWithClipPlanes(${c}, minPosSC, rayStepSC, adjustBounds(tpos${c}, tstep${c}, numSteps));`),h.push(`  if (rayBounds${c}.x < rayBounds${c}.y) {
    unionBounds = vec2<f32>(min(unionBounds.x, rayBounds${c}.x), max(unionBounds.y, rayBounds${c}.y));
  }`),S&&h.push(`  let labelColor${c}: vec4<f32> = getColorForLabelOutline(volTexture${c}, tcoord, fragZ, ${c}, ${e.rowStarts[c]}, tfunRows);`),g.push(`    if (curDist >= rayBounds${c}.x * mapperUBO.SampleDistance && curDist <= rayBounds${c}.y * mapperUBO.SampleDistance) {`),S?g.push(`      sampleColor = labelColor${c};`):g.push(`      sampleColor = processVolume(volTexture${c}, fragPos, ${c}, ${e.rowStarts[c]}, rayPosSC, tfunRows);`),g.push("      sampleColor.a = correctSampleAlpha(sampleColor.a, stepWeight);"),g.push(`      stepColor = vec4<f32>(
          sampleColor.a * sampleColor.rgb + (1.0 - sampleColor.a) * stepColor.rgb,
          sampleColor.a + (1.0 - sampleColor.a) * stepColor.a);`),g.push("    }"))}g.length&&g.push(`    computedColor = vec4<f32>(
        stepColor.rgb * (1.0 - computedColor.a) + computedColor.rgb,
        (1.0 - computedColor.a) * stepColor.a + computedColor.a);`),d=I.substitute(d,"//VTK::Volume::CompositeCalls",g).result,d=I.substitute(d,"//VTK::Volume::TraverseCalls",[]).result,d=I.substitute(d,"//VTK::Volume::TraverseInit",h).result,d=I.substitute(d,"//VTK::Volume::TraverseDec",[`var<private> traverseVals: array<vec4<f32>,${e.volumes.length}>;`]).result;const a=(c,p)=>{const u="rayLengthSC, minPosSC, rayStepSC, input.fragPos";switch(p){case A.MAXIMUM_INTENSITY_BLEND:return`    traverseMax(volTexture${c}, ${c}, ${e.rowStarts[c]}, ${u});`;case A.MINIMUM_INTENSITY_BLEND:return`    traverseMin(volTexture${c}, ${c}, ${e.rowStarts[c]}, ${u});`;case A.AVERAGE_INTENSITY_BLEND:return`    traverseAverage(volTexture${c}, ${c}, ${e.rowStarts[c]}, ${u});`;case A.ADDITIVE_INTENSITY_BLEND:return`    traverseAdditive(volTexture${c}, ${c}, ${e.rowStarts[c]}, ${u});`;case A.RADON_TRANSFORM_BLEND:return`    traverseRadon(volTexture${c}, ${c}, ${e.rowStarts[c]}, ${u});`;case A.LABELMAP_EDGE_PROJECTION_BLEND:{const l=e.volumes[c].getRenderable(),v=l.getMapper().getInputData()?.getPointData()?.getScalars()?.getNumberOfComponents?.(),S=l.getProperty().getIndependentComponents()&&v>=2,R=e.rowStarts[c]+(S?1:0);return S||tt("LABELMAP_EDGE_PROJECTION_BLEND expects a two component volume (image + labels) with independent components enabled."),`    traverseLabelEdge(volTexture${c}, ${c}, ${e.rowStarts[c]}, ${R}, ${u}, input.tcoordVS, rayMax);`}default:return null}},y=e.volumes.map(c=>c.getRenderable().getMapper().getBlendMode()),x=y.some(c=>c===A.COMPOSITE_BLEND),T=y.some(c=>c!==A.COMPOSITE_BLEND),C=x&&T;let w=!1;for(let c=0;c<e.volumes.length;c++){const p=y[c],u=[];if(p===A.COMPOSITE_BLEND){if(w)continue;w=!0,C?u.push("    let compositeLayer: vec4<f32> = composite(input.fragPos, input.tcoordVS, rayMax, rayLengthSC, minPosSC, rayStepSC);",`    computedColor = vec4<f32>(
      compositeLayer.rgb + (1.0 - compositeLayer.a) * computedColor.rgb,
      compositeLayer.a + (1.0 - compositeLayer.a) * computedColor.a);`):u.push("    computedColor = composite(input.fragPos, input.tcoordVS, rayMax, rayLengthSC, minPosSC, rayStepSC);")}else{const l=a(c,p);if(!l){tt(`WebGPU volume rendering does not support blend mode ${p} yet; volume ${c} will not be rendered.`);continue}u.push(l),C?u.push(`    let layer${c}: vec4<f32> = traverseVals[${c}];`,`    computedColor = vec4<f32>(
      layer${c}.rgb * layer${c}.a + (1.0 - layer${c}.a) * computedColor.rgb,
      layer${c}.a + (1.0 - layer${c}.a) * computedColor.a);`):u.push(`    computedColor = traverseVals[${c}];`)}u.push("//VTK::Volume::Loop"),d=I.substitute(d,"//VTK::Volume::Loop",u).result}C&&(d=I.substitute(d,"//VTK::Volume::Loop",["    if (computedColor.a > 0.0) {","      computedColor = vec4<f32>(computedColor.rgb / computedColor.a, computedColor.a);","    }"]).result),f.setCode(d)},e.shaderReplacements.set("replaceShaderVolume",t.replaceShaderVolume),t.updateLUTImage=s=>{let n=t.getMTime();for(let h=0;h<e.volumes.length;h++){const a=e.volumes[h].getRenderable(),y=a.getMapper().getInputData(),x=a.getProperty();n=Math.max(n,a.getMTime(),a.getMapper().getMTime(),y.getMTime(),x.getMTime());const T=y.getPointData()&&y.getPointData().getScalars(),C=T?T.getNumberOfComponents():1,w=x.getUseIndependentComponents(C)?C:1;for(let c=0;c<w;c++)n=Math.max(n,x.getRGBTransferFunction(c).getMTime(),x.getScalarOpacity(c).getMTime())}if(n<e.lutBuildTime.getMTime()&&e.lutSampleDist===e.sampleDist)return;e.colorRowLength=Math.max(1,...e.volumes.map(h=>h.getRenderable().getMapper().getColorTextureWidth())),e.opacityRowLength=Math.max(1,...e.volumes.map(h=>h.getRenderable().getMapper().getOpacityTextureWidth())),e.numRows=0,e.rowStarts=[];for(let h=0;h<e.volumes.length;h++){e.rowStarts.push(e.numRows);const a=e.volumes[h].getRenderable(),y=a.getMapper(),x=a.getProperty(),T=y.getInputData(),C=(T.getPointData()&&T.getPointData().getScalars()).getNumberOfComponents(),w=x.getUseIndependentComponents(C)?C:1;e.numRows+=w}const i=new Uint8ClampedArray(e.numRows*2*e.colorRowLength*4),f=new Float32Array(e.numRows*2*e.opacityRowLength);let d=0;const g=new Float32Array(Math.max(e.colorRowLength*3,e.opacityRowLength));for(let h=0;h<e.volumes.length;h++){const a=e.volumes[h].getRenderable(),y=a.getMapper(),x=a.getProperty(),T=y.getInputData(),C=(T.getPointData()&&T.getPointData().getScalars()).getNumberOfComponents(),w=x.getUseIndependentComponents(C),c=w?C:1;for(let p=0;p<c;++p){const u=w?p:0,l=w?p:0,v=x.getRGBTransferFunction(u),S=v.getRange();v.getTable(S[0],S[1],e.colorRowLength,g,1);let R=d*e.colorRowLength*4;for(let _=0;_<e.colorRowLength;++_){i[R+_*4]=255*g[_*3],i[R+_*4+1]=255*g[_*3+1],i[R+_*4+2]=255*g[_*3+2],i[R+_*4+3]=255;for(let G=0;G<4;G++)i[R+(e.colorRowLength+_)*4+G]=i[R+_*4+G]}const B=x.getScalarOpacity(l),D=e.sampleDist/x.getScalarOpacityUnitDistance(l),M=B.getRange();B.getTable(M[0],M[1],e.opacityRowLength,g,1),R=d*e.opacityRowLength;for(let _=0;_<e.opacityRowLength;++_)f[R+_]=1-(1-g[_])**D,f[R+_+e.opacityRowLength]=f[R+_];d+=2}}{const h={nativeArray:i,width:e.colorRowLength,height:e.numRows*2,depth:1,format:"rgba8unorm"},a=s.getTextureManager().getTexture(h).createView("tfunTexture");e.textureViews[2]=a}{const h={nativeArray:f,width:e.opacityRowLength,height:e.numRows*2,depth:1,format:"r16float"},a=s.getTextureManager().getTexture(h).createView("ofunTexture");e.textureViews[3]=a}e.lutSampleDist=e.sampleDist,e.lutBuildTime.modified()},t.updateSSBO=s=>{const n=e.WebGPURenderer.getRenderable(),i=n.getActiveCamera(),f=e.WebGPURenderer.getViewNodeFor(i),d=f.getKeyMatrices(e.WebGPURenderer);let g=Math.max(t.getMTime(),e.WebGPURenderer.getStabilizedTime(),n.getMTime(),i.getMTime(),f.getMTime());for(let O=0;O<e.volumes.length;O++){const j=e.volumes[O].getRenderable(),Y=j.getMapper(),L=Y.getInputData(),X=j.getProperty();g=Math.max(g,j.getMTime(),L.getMTime(),Y.getMTime(),Y.getClippingPlanesMTime(),X.getMTime());const b=L.getPointData()&&L.getPointData().getScalars(),V=b?b.getNumberOfComponents():1,Ee=X.getUseIndependentComponents(V)?V:1;for(let ge=0;ge<Ee;ge++)g=Math.max(g,X.getRGBTransferFunction(ge).getMTime(),X.getScalarOpacity(ge).getMTime())}if(g<e.SSBO.getSendTime())return;const h=e.WebGPURenderer.getStabilizedCenterByReference(),a=e.SSBO.getSizeInBytes()===0||e.SSBO.getNumberOfInstances()!==e.volumes.length;a&&(e.SSBO.clearData(),e.SSBO.setNumberOfInstances(e.volumes.length));const y=new Float64Array(e.volumes.length*16),x=new Float64Array(e.volumes.length*16),T=new Float64Array(e.volumes.length*16),C=Array.from({length:6},()=>new Float64Array(e.volumes.length*4)),w=new Float64Array(e.volumes.length*4),c=new Float64Array(e.volumes.length*4),p=new Float64Array(e.volumes.length*4),u=new Float64Array(e.volumes.length*4),l=new Float64Array(e.volumes.length*4),v=new Float64Array(e.volumes.length*4),S=new Float64Array(e.volumes.length*4),R=new Float64Array(e.volumes.length*4),B=new Float64Array(e.volumes.length*4),D=new Float64Array(e.volumes.length*4),M=new Float64Array(e.volumes.length*4),_=new Float64Array(e.volumes.length*4),G=new Float64Array(e.volumes.length*4),Ce=new Float64Array(e.volumes.length*4),ie=new Float64Array(e.volumes.length*4),de=new Float64Array(e.volumes.length*4);for(let O=0;O<e.volumes.length;O++){const j=e.volumes[O].getRenderable(),Y=j.getMapper(),L=Y.getInputData(),X=L.getPointData()&&L.getPointData().getScalars(),b=X.getNumberOfComponents(),V=j.getProperty();P(N),Z(N,N,h);const Ee=j.getMatrix();se(H,Ee),Se(H,H),Q(N,H,N);const ge=L.getWorldToIndex();Q(N,ge,N);const ce=L.getDimensions();Dt(H,[.5,.5,.5]),Q(N,H,N),P(H),ot(H,H,[1/ce[0],1/ce[1],1/ce[2]]),Q(N,H,N);for(let E=0;E<16;E++)y[O*16+E]=N[E];Se(Wt,d.scvc),Q(H,N,Wt);for(let E=0;E<16;E++)x[O*16+E]=H[E];Se(N,N);for(let E=0;E<4;E++)T[O*16+E*4]=N[E*4],T[O*16+E*4+1]=N[E*4+1],T[O*16+E*4+2]=N[E*4+2],T[O*16+E*4+3]=0;c[O*4]=1/ce[0],c[O*4+1]=1/ce[1],c[O*4+2]=1/ce[2],c[O*4+3]=1,p[O*4]=j.getProperty().getShade()?1:0,p[O*4+1]=V.getComputeNormalFromOpacity()?1:0,p[O*4+2]=n.getTwoSidedLighting()?1:0,u[O*4]=V.getAmbient(),u[O*4+1]=V.getDiffuse(),u[O*4+2]=V.getSpecular(),u[O*4+3]=V.getSpecularPower()===0?1:V.getSpecularPower(),l[O*4]=V.getVolumetricScatteringBlending(),l[O*4+1]=V.getGlobalIlluminationReach(),l[O*4+2]=V.getAnisotropy(),l[O*4+3]=V.getAnisotropy()*V.getAnisotropy(),Q(rt,d.scvc,N),U(kt,[0,0,0],rt),U(It,[1,1,1],rt),v[O*4]=na(It,kt),v[O*4+1]=Y.getSampleDistance()*Y.getVolumeShadowSamplingDistFactor(),S[O*4]=V.getLocalAmbientOcclusion()&&V.getAmbient()>0?V.getLAOKernelSize():0,S[O*4+1]=V.getLAOKernelRadius();const ye=L.getSpacing();R[O*4]=ye[0],R[O*4+1]=ye[1],R[O*4+2]=ye[2],R[O*4+3]=1;const K=e.textureViews[O+4].getTexture().getScale(),Ne=j.getProperty().getIpScalarRange(),Be=j.getProperty().getFilterMode();for(let E=0;E<b;E++){let W=Ne[0],J=Ne[1];if(Be!==pa.RAW){const ee=X.getRange(E),te=ee[1]-ee[0];W=ee[0]+W*te,J=ee[0]+J*te}B[O*4+E]=W/K,D[O*4+E]=J/K}M[O*4]=X.getNumberOfComponents();const q=V.getUseIndependentComponents(b);M[O*4+1]=q?1:0,M[O*4+2]=V.getColorMixPreset();let xe=0;if(V.getInterpolationType()===ga.NEAREST)xe=15;else for(let E=0;E<b;E++)V.getForceNearestInterpolation(E)&&(xe|=1<<E);M[O*4+3]=xe,_[O*4]=V.getUseLabelOutline()?1:0;const me=V.getLabelOutlineOpacity();_[O*4+1]=Array.isArray(me)?me[0]??1:me,_[O*4+2]=K,_[O*4+3]=0;for(let E=0;E<b;E++){const W=K,J=V.getRGBTransferFunction(q?E:0).getRange(),ee=J[1]-J[0],te=Math.abs(ee)>1e-6?1/ee:0;G[O*4+E]=W*te,Ce[O*4+E]=-J[0]*te;const Te=V.getScalarOpacity(q?E:0).getRange(),Re=Te[1]-Te[0],Ve=Math.abs(Re)>1e-6?1/Re:0;ie[O*4+E]=W*Ve,de[O*4+E]=-Te[0]*Ve}Dt(H,[-h[0],-h[1],-h[2]]);const _e=ha(Y,H,e.clipPlanes);w[O*4]=_e;for(let E=0;E<_e;E++){const W=O*4;C[E][W]=e.clipPlanes[E][0],C[E][W+1]=e.clipPlanes[E][1],C[E][W+2]=e.clipPlanes[E][2],C[E][W+3]=e.clipPlanes[E][3]}}a&&(e.SSBO.addEntry("SCTCMatrix","mat4x4<f32>"),e.SSBO.addEntry("VCTCMatrix","mat4x4<f32>"),e.SSBO.addEntry("planeNormals","mat4x4<f32>"),e.SSBO.addEntry("shade","vec4<f32>"),e.SSBO.addEntry("lighting","vec4<f32>"),e.SSBO.addEntry("scattering","vec4<f32>"),e.SSBO.addEntry("shadow","vec4<f32>"),e.SSBO.addEntry("lao","vec4<f32>"),e.SSBO.addEntry("tstep","vec4<f32>"),e.SSBO.addEntry("spacing","vec4<f32>"),e.SSBO.addEntry("ipScalarRangeMin","vec4<f32>"),e.SSBO.addEntry("ipScalarRangeMax","vec4<f32>"),e.SSBO.addEntry("componentInfo","vec4<f32>"),e.SSBO.addEntry("labelOutline","vec4<f32>"),e.SSBO.addEntry("colorScale","vec4<f32>"),e.SSBO.addEntry("colorShift","vec4<f32>"),e.SSBO.addEntry("opacityScale","vec4<f32>"),e.SSBO.addEntry("opacityShift","vec4<f32>"),va(e.SSBO,"clipPlane"),e.SSBO.addEntry("clipPlaneStates","vec4<f32>")),e.SSBO.setAllInstancesFromArray("SCTCMatrix",y),e.SSBO.setAllInstancesFromArray("VCTCMatrix",x),e.SSBO.setAllInstancesFromArray("planeNormals",T),e.SSBO.setAllInstancesFromArray("shade",p),e.SSBO.setAllInstancesFromArray("lighting",u),e.SSBO.setAllInstancesFromArray("scattering",l),e.SSBO.setAllInstancesFromArray("shadow",v),e.SSBO.setAllInstancesFromArray("lao",S),e.SSBO.setAllInstancesFromArray("tstep",c),e.SSBO.setAllInstancesFromArray("spacing",R),e.SSBO.setAllInstancesFromArray("ipScalarRangeMin",B),e.SSBO.setAllInstancesFromArray("ipScalarRangeMax",D),e.SSBO.setAllInstancesFromArray("componentInfo",M),e.SSBO.setAllInstancesFromArray("labelOutline",_),e.SSBO.setAllInstancesFromArray("colorScale",G),e.SSBO.setAllInstancesFromArray("colorShift",Ce),e.SSBO.setAllInstancesFromArray("opacityScale",ie),e.SSBO.setAllInstancesFromArray("opacityShift",de);for(let O=0;O<6;O++)e.SSBO.setAllInstancesFromArray(`clipPlane${O}`,C[O]);e.SSBO.setAllInstancesFromArray("clipPlaneStates",w),e.SSBO.send(s);const vt=e.componentSSBO.getSizeInBytes()===0||e.componentSSBO.getNumberOfInstances()!==e.numRows;vt&&(e.componentSSBO.clearData(),e.componentSSBO.setNumberOfInstances(e.numRows));const St=new Float64Array(e.numRows),dt=new Float64Array(e.numRows),yt=new Float64Array(e.numRows),xt=new Float64Array(e.numRows),Ae=new Float64Array(e.numRows),Xe=new Float64Array(e.numRows),Ke=new Float64Array(e.numRows),Ze=new Float64Array(e.numRows),mt=new Float64Array(e.numRows),Tt=new Float64Array(e.numRows);let z=0;for(let O=0;O<e.volumes.length;O++){const j=e.volumes[O].getRenderable(),Y=j.getMapper(),L=j.getProperty(),X=Y.getInputData(),b=(X.getPointData()&&X.getPointData().getScalars()).getNumberOfComponents(),V=L.getUseIndependentComponents(b),Ee=V?b:1,ge=e.textureViews[O+4].getTexture().getFormat(),ce=Sa.getDetailsFromTextureFormat(ge),ye={scale:ce.elementSize===2&&ce.sampleType==="float"?1:255,offset:0};for(let K=0;K<Ee;K++){const Ne=V?K:0;let Be=0;V?Be=K:(b===2||b===4)&&(Be=b-1);const q=V?K:0,xe=ye.scale,me=L.getScalarOpacity(Be).getRange(),_e=me[1]-me[0],E=Math.abs(_e)>1e-6?1/_e:0;xt[z]=(ye.offset-me[0])*E,yt[z]=xe*E;const W=L.getRGBTransferFunction(Ne).getRange(),J=W[1]-W[0],ee=Math.abs(J)>1e-6?1/J:0;if(dt[z]=(ye.offset-W[0])*ee,St[z]=xe*ee,mt[z]=V?L.getComponentWeight?.(K)??1:1,Tt[z]=L.getOpacityMode(q),L.getUseGradientOpacity(q)){const te=L.getGradientOpacityMinimumOpacity(q),Te=L.getGradientOpacityMaximumOpacity(q);Ae[z]=te,Xe[z]=Te;const Re=[L.getGradientOpacityMinimumValue(q),L.getGradientOpacityMaximumValue(q)],Ve=Re[1]-Re[0],wt=Math.abs(Ve)>1e-6?1/Ve:0;Ze[z]=xe*(Te-te)*wt,Ke[z]=-Re[0]*(Te-te)*wt+te}else Ae[z]=1,Xe[z]=1,Ze[z]=0,Ke[z]=1;z++}}vt&&(e.componentSSBO.addEntry("cScale","f32"),e.componentSSBO.addEntry("cShift","f32"),e.componentSSBO.addEntry("oScale","f32"),e.componentSSBO.addEntry("oShift","f32"),e.componentSSBO.addEntry("goShift","f32"),e.componentSSBO.addEntry("goScale","f32"),e.componentSSBO.addEntry("gomin","f32"),e.componentSSBO.addEntry("gomax","f32"),e.componentSSBO.addEntry("mixWeight","f32"),e.componentSSBO.addEntry("opacityMode","f32")),e.componentSSBO.setAllInstancesFromArray("cScale",St),e.componentSSBO.setAllInstancesFromArray("cShift",dt),e.componentSSBO.setAllInstancesFromArray("oScale",yt),e.componentSSBO.setAllInstancesFromArray("oShift",xt),e.componentSSBO.setAllInstancesFromArray("goScale",Ze),e.componentSSBO.setAllInstancesFromArray("goShift",Ke),e.componentSSBO.setAllInstancesFromArray("gomin",Ae),e.componentSSBO.setAllInstancesFromArray("gomax",Xe),e.componentSSBO.setAllInstancesFromArray("mixWeight",mt),e.componentSSBO.setAllInstancesFromArray("opacityMode",Tt),e.componentSSBO.send(s)};const r=t.updateBuffers;t.updateBuffers=()=>{r(),e.jitterSSBO||(e.jitterSSBO=e.device.getCachedObject("vtkWebGPUVolumePassFSQ-jitterSSBO",()=>{const d=Ie.newInstance({label:"jitterSSBO"});d.setNumberOfInstances(1024),d.addEntry("value","f32");const g=new Float32Array(1024);for(let h=0;h<g.length;h++)g[h]=Math.random();return d.setAllInstancesFromArray("value",g),d.send(e.device),d})),e.kernelSampleSSBO||(e.kernelSampleSSBO=e.device.getCachedObject("vtkWebGPUVolumePassFSQ-kernelSampleSSBO",()=>{const d=Ie.newInstance({label:"kernelSampleSSBO"});d.setNumberOfInstances(32),d.addEntry("value","vec2<f32>");const g=new Float32Array(64);for(let h=0;h<32;h++)g[h*2]=Math.random(),g[h*2+1]=Math.random();return d.setAllInstancesFromArray("value",g),d.send(e.device),d}));const s=e.WebGPURenderer.getRenderable().getVTKWindow()?.getInteractor()?.isAnimating()||!1,n=d=>d.getSampleDistance()*(s?d.getInteractionSampleDistanceFactor():1);let i=n(e.volumes[0].getRenderable().getMapper());for(let d=0;d<e.volumes.length;d++){const g=n(e.volumes[d].getRenderable().getMapper());g<i&&(i=g)}const f=e.WebGPURenderer.getRenderable().getActiveCamera().getClippingRange();if(e.UBO.setValue("CamNear",f[0]),e.UBO.setValue("CamFar",f[1]),e.UBO.sendIfNeeded(e.device),e.sampleDist!==i){e.sampleDist=i,e.UBO.setValue("SampleDistance",i),e.UBO.sendIfNeeded(e.device);for(let d=0;d<e.volumes.length;d++){const g=e.volumes[d].getRenderable().getMapper(),h=g.getInputData().getBounds(),a=Math.hypot(h[1]-h[0],h[3]-h[2],h[5]-h[4]),y=Math.ceil(a/i);y>g.getMaximumSamplesPerRay()&&tt(`The number of steps required ${y} is larger than the specified maximum number of steps ${g.getMaximumSamplesPerRay()}.
Please either change the volumeMapper sampleDistance or its maximum number of samples.`)}}for(let d=0;d<e.volumes.length;d++){const g=e.volumes[d].getRenderable().getMapper().getInputData(),h=e.device.getTextureManager().getTextureForImageData(g);if(!e.textureViews[d+4]||e.textureViews[d+4].getTexture()!==h){const a=h.createView(`volTexture${d}`);e.textureViews[d+4]=a}}{const d=e.volumes.map(h=>{const a=h.getRenderable().getProperty().getLabelOutlineThickness?.();return a==null?null:Array.isArray(a)?a:[a]}),g=JSON.stringify(d);if(e._labelThicknessHash!==g||e.volumes.length!==e.lastVolumeLength||!e.textureViews[4+e.volumes.length]){e._labelThicknessHash=g;let h=Math.max(1,...e.volumes.map(w=>w.getRenderable().getMapper().getLabelOutlineTextureWidth()));d.forEach(w=>{Array.isArray(w)&&(h=Math.max(h,w.length))});const a=h,y=Math.max(1,e.volumes.length),x=new Uint8Array(a*y);da(x,d.map(w=>w??[0]),a);const T={nativeArray:x,width:a,height:y,depth:1,format:"r8unorm"},C=e.device.getTextureManager().getTexture(T).createView("labelOutlineThicknessTexture");e.textureViews[4+e.volumes.length]=C}}e.textureViews.length=Math.min(e.textureViews.length,5+e.volumes.length),e.lastVolumeLength=e.volumes.length,t.updateLUTImage(e.device),t.updateSSBO(e.device),e.clampSampler||(e.clampSampler=qt.newInstance({label:"clampSampler"}),e.clampSampler.create(e.device,{minFilter:"linear",magFilter:"linear"}))},t.computePipelineHash=()=>{e.pipelineHash="volfsq";for(let s=0;s<e.volumes.length;s++){const n=e.volumes[s].getRenderable(),i=n.getMapper(),f=n.getProperty(),d=i.getBlendMode(),g=i.getInputData()?.getPointData()?.getScalars()?.getNumberOfComponents?.()??0,h=Number(f.getUseIndependentComponents(g)),a=Number(d===A.COMPOSITE_BLEND&&f.getUseLabelOutline()&&g===1);e.pipelineHash+=`${d}C${g}I${h}L${a}`}},t.setVolumes=s=>{if(!e.volumes||e.volumes.length!==s.length){e.volumes=[...s],t.modified();return}for(let n=0;n<s.length;n++)if(s[n]!==e.volumes[n]){e.volumes=[...s],t.modified();return}};const o=t.getBindables;t.getBindables=()=>{const s=o();return s.push(e.componentSSBO),s.push(e.jitterSSBO),s.push(e.kernelSampleSSBO),s.push(e.clampSampler),s}}var ys={volumes:null,colorRowLength:1024,opacityRowLength:1024,lastVolumeLength:0};function _r(t,e,r={}){Object.assign(e,ys,r),be.extend(t,e,r),e.fragmentShaderTemplate=Ss,e.UBO=Yt.newInstance({label:"mapperUBO"}),e.UBO.addEntry("SampleDistance","f32"),e.UBO.addEntry("CamNear","f32"),e.UBO.addEntry("CamFar","f32"),e.SSBO=Ie.newInstance({label:"volumeSSBO"}),e.componentSSBO=Ie.newInstance({label:"componentSSBO"}),e.lutBuildTime={},m.obj(e.lutBuildTime,{mtime:0}),e.clipPlanes=Array.from({length:6},()=>[0,0,0,0]),ds(t,e)}var xs=m.newInstance(_r,"vtkWebGPUVolumePassFSQ"),ms={newInstance:xs,extend:_r},{Representation:Ts}=Kt,{BufferUsage:Ht,PrimitiveTypes:ws}=Jt,at=[[0,4,6],[0,6,2],[1,3,7],[1,7,5],[0,5,4],[0,1,5],[2,6,7],[2,7,3],[0,3,1],[0,2,3],[4,5,7],[4,7,6]],Cs=`
//VTK::Renderer::Dec

//VTK::Select::Dec

//VTK::VolumePass::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::Mapper::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : fragmentOutput;

  //VTK::Select::Impl

  //VTK::TCoord::Impl

  //VTK::VolumePass::Impl

  // use the maximum (closest) of the current value and the zbuffer
  // the blend func will then take the min to find the farthest stop value
  var stopval: f32 = max(input.fragPos.z, textureLoad(opaquePassDepthTexture, vec2<i32>(i32(input.fragPos.x), i32(input.fragPos.y)), 0));

  //VTK::RenderEncoder::Impl
  return output;
}
`,Rs=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var computedColor: vec4<f32> = textureSample(volumePassColorTexture,
    volumePassColorTextureSampler, mapperUBO.tscale*input.tcoordVS);

  //VTK::RenderEncoder::Impl
  return output;
}
`;function Os(t,e){e.classHierarchy.push("vtkWebGPUVolumePass"),t.initialize=r=>{e._clearEncoder||t.createClearEncoder(r),e._mergeEncoder||t.createMergeEncoder(r),e._copyEncoder||t.createCopyEncoder(r),e._depthRangeEncoder||t.createDepthRangeEncoder(r),e.fullScreenQuad||(e.fullScreenQuad=ms.newInstance(),e.fullScreenQuad.setDevice(r.getDevice()),e.fullScreenQuad.setTextureViews([...e._depthRangeEncoder.getColorTextureViews()])),e._volumeCopyQuad||(e._volumeCopyQuad=be.newInstance(),e._volumeCopyQuad.setPipelineHash("volpassfsq"),e._volumeCopyQuad.setDevice(r.getDevice()),e._volumeCopyQuad.setFragmentShaderTemplate(Rs),e._copyUBO=Yt.newInstance({label:"mapperUBO"}),e._copyUBO.addEntry("tscale","vec2<f32>"),e._volumeCopyQuad.setUBO(e._copyUBO),e._volumeCopyQuad.setTextureViews([e._colorTextureView]))},t.traverse=(r,o)=>{if(e.deleted)return;e._currentParent=o,t.initialize(o),t.computeTiming(o),t.renderDepthBounds(r,o),e._firstGroup=!0;const s=o.getDevice(),n=s.getHandle().limits.maxSampledTexturesPerShaderStage-5;if(e.volumes.length>n){const i=r.getRenderable().getActiveCamera().getPosition(),f=[];for(let a=0;a<e.volumes.length;a++){const y=e.volumes[a].getRenderable().getBounds();f[a]=Kr([.5*(y[1]+y[0]),.5*(y[3]+y[2]),.5*(y[5]+y[4])],i)}const d=[...Array(e.volumes.length).keys()];d.sort((a,y)=>f[y]-f[a]);let g=[],h=d.length%n;h===0&&(h=n);for(let a=0;a<d.length;a++)g.push(e.volumes[d[a]]),g.length>=h&&(t.rayCastPass(o,r,g),g=[],h=n,e._firstGroup=!1)}else t.rayCastPass(o,r,e.volumes);if(e._volumeCopyQuad.setWebGPURenderer(r),e._useSmallViewport){const i=e._colorTextureView.getTexture().getWidth(),f=e._colorTextureView.getTexture().getHeight();e._copyUBO.setArray("tscale",[e._smallViewportWidth/i,e._smallViewportHeight/f])}else e._copyUBO.setArray("tscale",[1,1]);e._copyUBO.sendIfNeeded(s),e._copyEncoder.setColorTextureView(0,e.colorTextureView),e._copyEncoder.attachTextureViews(),e._copyEncoder.begin(o.getCommandEncoder()),r.scissorAndViewport(e._copyEncoder),e._volumeCopyQuad.prepareAndDraw(e._copyEncoder),e._copyEncoder.end()},t.delete=m.chain(()=>{e._animationRateSubscription&&(e._animationRateSubscription.unsubscribe(),e._animationRateSubscription=null)},t.delete),t.computeTiming=r=>{const o=r.getRenderable().getInteractor();e._lastScale==null&&(e._lastScale=e.volumes[0].getRenderable().getMapper().getInitialInteractionScale()||1),e._useSmallViewport=!1,o.isAnimating()&&e._lastScale>1.5&&(e._useSmallViewport=!0),e._colorTexture.resize(r.getCanvas().width,r.getCanvas().height),e._animationRateSubscription||(e._animationRateSubscription=o.onAnimationFrameRateUpdate(()=>{const s=e.volumes[0].getRenderable().getMapper();if(s.getAutoAdjustSampleDistances()){const n=o.getRecentAnimationFrameRate();e._lastScale=e._lastScale*o.getDesiredUpdateRate()/n,e._lastScale>400&&(e._lastScale=400)}else e._lastScale=s.getImageSampleDistance()*s.getImageSampleDistance();e._lastScale<1.5&&(e._lastScale=1.5)}))},t.rayCastPass=(r,o,s)=>{const n=e._firstGroup?e._clearEncoder:e._mergeEncoder;n.attachTextureViews(),n.begin(r.getCommandEncoder());let i=e._colorTextureView.getTexture().getWidth(),f=e._colorTextureView.getTexture().getHeight();if(e._useSmallViewport){const d=r.getCanvas(),g=1/Math.sqrt(e._lastScale);e._smallViewportWidth=Math.ceil(g*d.width),e._smallViewportHeight=Math.ceil(g*d.height),i=e._smallViewportWidth,f=e._smallViewportHeight}n.getHandle().setViewport(0,0,i,f,0,1),n.getHandle().setScissorRect(0,0,i,f),e.fullScreenQuad.setWebGPURenderer(o),e.fullScreenQuad.setVolumes(s),e.fullScreenQuad.prepareAndDraw(n),n.end()},t.renderDepthBounds=(r,o)=>{t.updateDepthPolyData(r);const s=e._boundsPoly,n=s.getPoints(),i=s.getPolys();let f={hash:`vp${i.getMTime()}`,usage:Ht.Index,cells:i,numberOfPoints:n.getNumberOfPoints(),primitiveType:ws.Triangles,representation:Ts.SURFACE};const d=o.getDevice().getBufferManager().getBuffer(f);e._mapper.getVertexInput().setIndexBuffer(d),f={usage:Ht.PointArray,format:"float32x4",hash:`vp${n.getMTime()}${i.getMTime()}`,dataArray:n,indexBuffer:d,packExtra:!0};const g=o.getDevice().getBufferManager().getBuffer(f);e._mapper.getVertexInput().addBuffer(g,["vertexBC"]),e._mapper.setNumberOfVertices(g.getSizeInBytes()/g.getStrideInBytes()),t.drawDepthRange(r,o)},t.updateDepthPolyData=r=>{let o=e._lastMTimes.length!==e.volumes.length+1;for(let h=0;h<e.volumes.length;h++){const a=e.volumes[h],y=a.getRenderable(),x=y.getMapper(),T=x.getInputData(),C=Math.max(a.getMTime(),y.getMTime(),x.getMTime(),T?.getMTime()??0);C!==e._lastMTimes[h]&&(o=!0,e._lastMTimes[h]=C)}const s=r.getStabilizedTime();if((e._lastMTimes.length<=e.volumes.length||s!==e._lastMTimes[e.volumes.length])&&(o=!0,e._lastMTimes[e.volumes.length]=s),e._lastMTimes.length=e.volumes.length+1,!o)return;const n=r.getStabilizedCenterByReference(),i=e.volumes.length*8,f=new Float64Array(i*3),d=e.volumes.length*12,g=new Uint16Array(d*4);for(let h=0;h<e.volumes.length;h++){e.volumes[h].getBoundingCubePoints(f,h*24);let a=h*12*4;const y=h*8;for(let x=0;x<12;x++)g[a++]=3,g[a++]=y+at[x][0],g[a++]=y+at[x][1],g[a++]=y+at[x][2]}for(let h=0;h<f.length;h+=3)f[h]-=n[0],f[h+1]-=n[1],f[h+2]-=n[2];e._boundsPoly.getPoints().setData(f,3),e._boundsPoly.getPoints().modified(),e._boundsPoly.getPolys().setData(g,1),e._boundsPoly.getPolys().modified(),e._boundsPoly.modified()},t.drawDepthRange=(r,o)=>{e._depthRangeTexture.resizeToMatch(e.colorTextureView.getTexture()),e._depthRangeTexture2.resizeToMatch(e.colorTextureView.getTexture()),e._depthRangeEncoder.attachTextureViews(),t.setCurrentOperation("volumeDepthRangePass"),r.setRenderEncoder(e._depthRangeEncoder),r.volumeDepthRangePass(!0),e._mapper.setWebGPURenderer(r),e._mapper.prepareToDraw(e._depthRangeEncoder),e._mapper.registerDrawCallback(e._depthRangeEncoder),r.volumeDepthRangePass(!1)},t.createDepthRangeEncoder=r=>{const o=r.getDevice();e._depthRangeEncoder=fe.newInstance({label:"VolumePass DepthRange"}),e._depthRangeEncoder.setPipelineHash("volr"),e._depthRangeEncoder.setReplaceShaderCodeFunction(i=>{const f=i.getShaderDescription("fragment");f.addOutput("vec4<f32>","outColor1"),f.addOutput("vec4<f32>","outColor2");let d=f.getCode();d=I.substitute(d,"//VTK::RenderEncoder::Impl",["output.outColor1 = vec4<f32>(1.0 - input.fragPos.z, 0.0, 0.0, 0.0);","output.outColor2 = vec4<f32>(1.0 - stopval, 0.0, 0.0, 0.0);"]).result,f.setCode(d)}),e._depthRangeEncoder.setDescription({colorAttachments:[{view:null,clearValue:[1,1,1,1],loadOp:"clear",storeOp:"store"},{view:null,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]}),e._depthRangeEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"r16float",blend:{color:{srcFactor:"one",dstFactor:"one",operation:"min"},alpha:{srcFactor:"one",dstFactor:"one",operation:"min"}}},{format:"r16float",blend:{color:{srcFactor:"one",dstFactor:"one",operation:"max"},alpha:{srcFactor:"one",dstFactor:"one",operation:"max"}}}]}}),e._depthRangeTexture=oe.newInstance({label:"volumePassMaxDepth"}),e._depthRangeTexture.create(o,{width:r.getCanvas().width,height:r.getCanvas().height,format:"r16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});const s=e._depthRangeTexture.createView("maxTexture");e._depthRangeEncoder.setColorTextureView(0,s),e._depthRangeTexture2=oe.newInstance({label:"volumePassDepthMin"}),e._depthRangeTexture2.create(o,{width:r.getCanvas().width,height:r.getCanvas().height,format:"r16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});const n=e._depthRangeTexture2.createView("minTexture");e._depthRangeEncoder.setColorTextureView(1,n),e._mapper.setDevice(r.getDevice()),e._mapper.setTextureViews([e.depthTextureView])},t.createClearEncoder=r=>{e._colorTexture=oe.newInstance({label:"volumePassColor"}),e._colorTexture.create(r.getDevice(),{width:r.getCanvas().width,height:r.getCanvas().height,format:"bgra8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),e._colorTextureView=e._colorTexture.createView("volumePassColorTexture"),e._colorTextureView.addSampler(r.getDevice(),{minFilter:"linear",magFilter:"linear"}),e._clearEncoder=fe.newInstance({label:"VolumePass Clear"}),e._clearEncoder.setColorTextureView(0,e._colorTextureView),e._clearEncoder.setDescription({colorAttachments:[{view:null,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]}),e._clearEncoder.setPipelineHash("volpf"),e._clearEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"bgra8unorm",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.createCopyEncoder=r=>{e._copyEncoder=fe.newInstance({label:"volumePassCopy"}),e._copyEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e._copyEncoder.setPipelineHash("volcopypf"),e._copyEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.createMergeEncoder=r=>{e._mergeEncoder=fe.newInstance({label:"volumePassMerge"}),e._mergeEncoder.setColorTextureView(0,e._colorTextureView),e._mergeEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e._mergeEncoder.setReplaceShaderCodeFunction(o=>{const s=o.getShaderDescription("fragment");s.addOutput("vec4<f32>","outColor");let n=s.getCode();n=I.substitute(n,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<f32>(computedColor.rgb, computedColor.a);"]).result,s.setCode(n)}),e._mergeEncoder.setPipelineHash("volpf"),e._mergeEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"bgra8unorm",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.setVolumes=r=>{if(!e.volumes||e.volumes.length!==r.length){e._lastScale=null,e._lastMTimes.length=0,e.volumes=[...r],t.modified();return}for(let o=0;o<r.length;o++)if(r[o]!==e.volumes[o]){e._lastScale=null,e._lastMTimes.length=0,e.volumes=[...r],t.modified();return}},t.releaseGraphicsResources=()=>{e._animationRateSubscription&&(e._animationRateSubscription.unsubscribe(),e._animationRateSubscription=null),e._mapper.releaseGraphicsResources?.(),e._volumeCopyQuad?.releaseGraphicsResources?.(),e.fullScreenQuad?.releaseGraphicsResources?.(),e._clearEncoder=null,e._mergeEncoder=null,e._copyEncoder=null,e._depthRangeEncoder=null,e._colorTexture=null,e._colorTextureView=null,e._depthRangeTexture=null,e._depthRangeTexture2=null,e._volumeCopyQuad=null,e.fullScreenQuad=null,e._copyUBO=null,e.colorTextureView=null,e.depthTextureView=null}}var Es={colorTextureView:null,depthTextureView:null,volumes:null};function Vr(t,e,r={}){Object.assign(e,Es,r),pe.extend(t,e,r),e._mapper=ya.newInstance(),e._mapper.setFragmentShaderTemplate(Cs),e._mapper.getShaderReplacements().set("replaceShaderVolumePass",(o,s,n)=>{s.getShaderDescription("fragment").addBuiltinInput("vec4<f32>","@builtin(position) fragPos")}),e._boundsPoly=Qr.newInstance(),e._lastMTimes=[],m.setGet(t,e,["colorTextureView","depthTextureView"]),Os(t,e)}var Bs=m.newInstance(Vr,"vtkWebGPUVolumePass"),_s={newInstance:Bs,extend:Vr},Vs=`
//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var texCoord: vec2<i32> =
    vec2<i32>(i32(input.fragPos.x), i32(input.fragPos.y));
  var computedColor: vec4<f32> = clamp(
    textureLoad(opaquePassColorTexture, texCoord, 0),
    vec4<f32>(0.0),
    vec4<f32>(1.0)
  );

  //VTK::RenderEncoder::Impl
  return output;
}
`;function Ds(t,e){e.classHierarchy.push("vtkForwardPass"),t.traverse=(r,o=null)=>{if(e.deleted)return;e._currentParent=o,t.setCurrentOperation("buildPass"),r.traverse(t),e.opaquePass||(e.opaquePass=ls.newInstance());const s=r.getRenderable().getNumberOfLayers(),n=r.getChildren();for(let i=0;i<s;i++)for(let f=0;f<n.length;f++){const d=n[f],g=r.getRenderable().getRenderers()[f];g.getDraw()&&g.getLayer()===i&&(e.opaqueActorCount=0,e.translucentActorCount=0,e.volumes=[],t.setCurrentOperation("queryPass"),d.traverse(t),t.setCurrentOperation("cameraPass"),d.traverse(t),e.opaquePass.traverse(d,r),e.translucentActorCount>0&&(e.translucentPass||(e.translucentPass=vs.newInstance()),e.translucentPass.setColorTextureView(e.opaquePass.getColorTextureView()),e.translucentPass.setDepthTextureView(e.opaquePass.getDepthTextureView()),e.translucentPass.traverse(d,r)),e.volumes.length>0&&(e.volumePass||(e.volumePass=_s.newInstance()),e.volumePass.setColorTextureView(e.opaquePass.getColorTextureView()),e.volumePass.setDepthTextureView(e.opaquePass.getDepthTextureView()),e.volumePass.setVolumes(e.volumes),e.volumePass.traverse(d,r)),t.finalPass(r,d))}},t.finalPass=(r,o)=>{e._finalBlitEncoder||t.createFinalBlitEncoder(r),e._finalBlitOutputTextureView.createFromTextureHandle(r.getCurrentTexture(),{depth:1,format:r.getPresentationFormat()}),e._finalBlitEncoder.attachTextureViews(),e._finalBlitEncoder.begin(r.getCommandEncoder()),o.scissorAndViewport(e._finalBlitEncoder),e._fullScreenQuad.prepareAndDraw(e._finalBlitEncoder),e._finalBlitEncoder.end()},t.createFinalBlitEncoder=r=>{e._finalBlitEncoder=fe.newInstance({label:"forwardPassBlit"}),e._finalBlitEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e._finalBlitEncoder.setPipelineHash("fpf"),e._finalBlitEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:r.getPresentationFormat(),blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}}),e._fsqSampler=qt.newInstance({label:"finalPassSampler"}),e._fsqSampler.create(r.getDevice(),{minFilter:"linear",magFilter:"linear"}),e._fullScreenQuad=be.newInstance(),e._fullScreenQuad.setDevice(r.getDevice()),e._fullScreenQuad.setPipelineHash("fpfsq"),e._fullScreenQuad.setTextureViews([e.opaquePass.getColorTextureView()]),e._fullScreenQuad.setAdditionalBindables([e._fsqSampler]),e._fullScreenQuad.setFragmentShaderTemplate(Vs),e._fullScreenQuad.getShaderReplacements().set("replaceShaderTCoord",(o,s)=>{const n=s.getShaderDescription("vertex");n.hasOutput("tcoordVS")||n.addOutput("vec2<f32>","tcoordVS"),s.getShaderDescription("fragment").addBuiltinInput("vec4<f32>","@builtin(position) fragPos")}),e._finalBlitOutputTextureView=xa.newInstance(),e._finalBlitEncoder.setColorTextureView(0,e._finalBlitOutputTextureView)},t.incrementOpaqueActorCount=()=>e.opaqueActorCount++,t.incrementTranslucentActorCount=()=>e.translucentActorCount++,t.addVolume=r=>{e.volumes.push(r)},t.releaseGraphicsResources=()=>{e.opaquePass?.releaseGraphicsResources?.(),e.translucentPass?.releaseGraphicsResources?.(),e.volumePass?.releaseGraphicsResources?.(),e.opaquePass=null,e.translucentPass=null,e.volumePass=null,e._finalBlitEncoder=null,e._finalBlitOutputTextureView=null,e._fullScreenQuad=null,e._fsqSampler=null}}var Ms={opaqueActorCount:0,translucentActorCount:0,volumes:null,opaqueRenderEncoder:null,translucentPass:null,volumePass:null};function Dr(t,e,r={}){Object.assign(e,Ms,r),pe.extend(t,e,r),m.setGet(t,e,["opaquePass","translucentPass","volumePass"]),Ds(t,e)}var Fs=m.newInstance(Dr,"vtkForwardPass"),Ls={newInstance:Fs,extend:Dr},{VtkDataTypes:we}=st;function Ns(t,e){e.classHierarchy.push("vtkWebGPUTextureManager");function r(s){if(s.imageData){s.dataArray=s.imageData.getPointData().getScalars(),s.time=s.dataArray.getMTime(),s.nativeArray=s.dataArray.getData();const n=s.imageData.getDimensions();s.width=n[0],s.height=n[1],s.depth=n[2];const i=s.dataArray.getNumberOfComponents();switch(i){case 1:s.format="r";break;case 2:s.format="rg";break;default:s.format="rgba";break}if(i===3){const f=s.nativeArray,d=m.newTypedArray(f.constructor.name,f.length/3*4),g=f.BYTES_PER_ELEMENT===1?255:1;for(let h=0,a=0;h<f.length;h+=3,a+=4)d[a]=f[h],d[a+1]=f[h+1],d[a+2]=f[h+2],d[a+3]=g;s.nativeArray=d}switch(s.dataArray.getDataType()){case we.UNSIGNED_CHAR:s.format+="8unorm";break;case we.FLOAT:case we.UNSIGNED_INT:case we.INT:case we.DOUBLE:case we.UNSIGNED_SHORT:case we.SHORT:default:s.format+="16float";break}}s.image&&(s.width=s.image.width,s.height=s.image.height,s.depth=1,s.format="rgba8unorm",s.flip=!0,s.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT),s.jsImageData&&(s.width=s.jsImageData.width,s.height=s.jsImageData.height,s.depth=1,s.format="rgba8unorm",s.flip=!0,s.nativeArray=s.jsImageData.data,s.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT),s.imageBitmap&&(s.width=s.imageBitmap.width,s.height=s.imageBitmap.height,s.depth=1,s.format="rgba8unorm",s.flip=!0,s.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT),s.canvas&&(s.width=s.canvas.width,s.height=s.canvas.height,s.depth=1,s.format="rgba8unorm",s.flip=!0,s.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT)}function o(s){const n=oe.newInstance({label:s.label});return n.create(e.device,{width:s.width,height:s.height,depth:s.depth,format:s.format,usage:s.usage,mipLevel:s.mipLevel}),(s.nativeArray||s.image||s.canvas||s.imageBitmap)&&n.writeImageData(s),n}t.getTexture=s=>s.hash?e.device.getCachedObject(s.hash,o,s):o(s),t.getTextureForImageData=s=>{const n={time:s.getMTime()};return n.imageData=s,r(n),n.time=Math.max(n.time,s.getMTime()),n.hash=n.time+n.format+n.mipLevel,e.device.getTextureManager().getTexture(n)},t.getTextureForVTKTexture=(s,n=void 0)=>{const i={time:s.getMTime(),label:n};return s.getInputData()?i.imageData=s.getInputData():s.getImage()?i.image=s.getImage():s.getJsImageData()?i.jsImageData=s.getJsImageData():s.getImageBitmap()?i.imageBitmap=s.getImageBitmap():s.getCanvas()&&(i.canvas=s.getCanvas()),r(i),i.time=Math.max(i.time,s.getMTime()),i.imageData&&(i.time=Math.max(i.time,i.imageData.getMTime())),i.mipLevel=s.getMipLevel(),i.hash=i.time+i.format+i.mipLevel,e.device.getTextureManager().getTexture(i)}}var Us={handle:null,device:null};function Mr(t,e,r={}){Object.assign(e,Us,r),m.obj(t,e),m.setGet(t,e,["device"]),Ns(t,e)}var Gs=m.newInstance(Mr),Ps={newInstance:Gs,extend:Mr},zs=class extends Map{constructor(){super(),this.registry=new FinalizationRegistry(t=>{const e=super.get(t);e&&e.deref&&e.deref()===void 0&&super.delete(t)})}getValue(t){const e=super.get(t);if(e){const r=e.deref();if(r!==void 0)return r;super.delete(t)}}setValue(t,e){let r;return e&&typeof e=="object"&&(r=new WeakRef(e),this.registry.register(e,t),super.set(t,r)),r}};function Ws(t,e){e.classHierarchy.push("vtkWebGPUDevice"),t.initialize=r=>{e.handle=r},t.createCommandEncoder=()=>e.handle.createCommandEncoder(),t.submitCommandEncoder=r=>{e.handle.queue.submit([r.finish()])},t.getShaderModule=r=>e.shaderCache.getShaderModule(r),t.getBindGroupLayout=r=>{if(!r.entries)return null;for(let n=0;n<r.entries.length;n++){const i=r.entries[n];i.binding=i.binding||0,i.visibility=i.visibility||GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT}const o=JSON.stringify(r);for(let n=0;n<e.bindGroupLayouts.length;n++)if(e.bindGroupLayouts[n].sval===o)return e.bindGroupLayouts[n].layout;const s=e.handle.createBindGroupLayout(r);return e.bindGroupLayouts.push({sval:o,layout:s}),s},t.getBindGroupLayoutDescription=r=>{for(let o=0;o<e.bindGroupLayouts.length;o++)if(e.bindGroupLayouts[o].layout===r)return e.bindGroupLayouts[o].sval;return vtkErrorMacro("layout not found"),console.trace(),null},t.getPipeline=r=>r in e.pipelines?e.pipelines[r]:null,t.createPipeline=(r,o)=>{o.initialize(t,r),e.pipelines[r]=o},t.onSubmittedWorkDone=()=>e.handle.queue.onSubmittedWorkDone(),t.hasCachedObject=r=>e.objectCache.getValue(r),t.getCachedObject=(r,o,...s)=>{if(!r)return vtkErrorMacro("attempt to cache an object without a hash"),null;const n=e.objectCache.getValue(r);if(n)return n;const i=o(...s);return e.objectCache.setValue(r,i),i}}var ks={handle:null,pipelines:null,shaderCache:null,bindGroupLayouts:null,bufferManager:null,textureManager:null};function Fr(t,e,r={}){Object.assign(e,ks,r),Xt(t,e),lt(t,e,["handle"]),ut(t,e,["bufferManager","shaderCache","textureManager"]),e.objectCache=new zs,e.shaderCache=I.newInstance(),e.shaderCache.setDevice(t),e.bindGroupLayouts=[],e.bufferManager=Jt.newInstance(),e.bufferManager.setDevice(t),e.textureManager=Ps.newInstance(),e.textureManager.setDevice(t),e.pipelines={},Ws(t,e)}var Is=ct(Fr,"vtkWebGPUDevice"),Hs={newInstance:Is,extend:Fr};function js(t,e){e.classHierarchy.push("vtkWebGPUHardwareSelectionPass"),t.traverse=(r,o)=>{if(e.deleted)return;e._currentParent=null,t.setCurrentOperation("buildPass"),r.traverse(t);const s=r.getDevice();if(e.selectionRenderEncoder)e.colorTexture.resize(r.getCanvas().width,r.getCanvas().height),e.depthTexture.resizeToMatch(e.colorTexture);else{t.createRenderEncoder(),e.colorTexture=oe.newInstance({label:"hardwareSelectorColor"}),e.colorTexture.create(s,{width:r.getCanvas().width,height:r.getCanvas().height,format:"rgba32uint",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});const n=e.colorTexture.createView("hardwareSelectColorTexture");e.selectionRenderEncoder.setColorTextureView(0,n),e.depthTexture=oe.newInstance({label:"hardwareSelectorDepth"}),e.depthTexture.create(s,{width:r.getCanvas().width,height:r.getCanvas().height,format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});const i=e.depthTexture.createView("hardwareSelectDepthTexture");e.selectionRenderEncoder.setDepthTextureView(i)}e.selectionRenderEncoder.attachTextureViews(),o.setRenderEncoder(e.selectionRenderEncoder),t.setCurrentOperation("cameraPass"),o.traverse(t),t.setCurrentOperation("opaquePass"),o.traverse(t)},t.createRenderEncoder=()=>{e.selectionRenderEncoder=fe.newInstance({label:"HardwareSelectionPass"}),e.selectionRenderEncoder.setPipelineHash("sel"),e.selectionRenderEncoder.setReplaceShaderCodeFunction(o=>{const s=o.getShaderDescription("fragment");s.addOutput("vec4<u32>","outColor");let n=s.getCode();n=I.substitute(n,"//VTK::Select::Impl",["  var compositeID: u32 = 0u;","  var attributeID: u32 = compositeID;"]).result,n=I.substitute(n,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<u32>(mapperUBO.PropID, compositeID, attributeID + 1u, 0u);"]).result,s.setCode(n)});const r=e.selectionRenderEncoder.getDescription();r.colorAttachments[0].clearValue=[0,0,0,0],e.selectionRenderEncoder.setPipelineSettings({primitive:{cullMode:"none"},depthStencil:{depthWriteEnabled:!0,depthCompare:"greater",format:"depth32float"},fragment:{targets:[{format:"rgba32uint",blend:void 0}]}})}}var bs={selectionRenderEncoder:null,colorTexture:null,depthTexture:null};function Lr(t,e,r={}){Object.assign(e,bs,r),pe.extend(t,e,r),m.get(t,e,["colorTexture","depthTexture"]),js(t,e)}var $s=m.newInstance(Lr,"vtkWebGPUHardwareSelectionPass"),As={newInstance:$s,extend:Lr},{SelectionContent:Xs,SelectionField:jt}=$e,{FieldAssociations:bt}=pt,{vtkErrorMacro:Nr}=m;function Ks(t){return`${t.propID} ${t.compositeID}`}function nt(t,e,r,o){const s=((r.height-e-1)*r.colorBufferWidth+t)*4+o;return r.colorValues[s]}function Zs(t,e,r,o){{if(o[0]=e[0],o[1]=e[1],e[0]<0||e[0]>=t.width||e[1]<0||e[1]>=t.height)return null;const s=nt(e[0],e[1],t,0);if(s<=0||s-1>=(t.props?.length??0))return null;const n={};n.propID=s-1,n.prop=t.props?.[n.propID];let i=nt(e[0],e[1],t,1);(i<0||i>16777215)&&(i=0),n.compositeID=i-1;let f=nt(e[0],e[1],t,2);if(f<1&&(f=i),n.attributeID=f-1,t.captureZValues){const d=(t.height-e[1]-1)*t.zbufferBufferWidth+e[0];n.zValue=t.depthValues[d],n.zValue=t.webGPURenderer.convertToOpenGLDepth(n.zValue),n.displayPosition=e}return n}}function Qs(t,e,r){const o=[];let s=0;return e.forEach((n,i)=>{const f=$e.newInstance();switch(f.setContentType(Xs.INDICES),t){case bt.FIELD_ASSOCIATION_CELLS:f.setFieldType(jt.CELL);break;case bt.FIELD_ASSOCIATION_POINTS:f.setFieldType(jt.POINT);break;default:Nr("Unknown field association")}f.getProperties().propID=n.info.propID,f.getProperties().prop=n.info.prop,f.getProperties().compositeID=n.info.compositeID,f.getProperties().attributeID=n.info.attributeID,f.getProperties().pixelCount=n.pixelCount,r.captureZValues&&(f.getProperties().displayPosition=[n.info.displayPosition[0],n.info.displayPosition[1],n.info.zValue],f.getProperties().worldPosition=r.webGPURenderWindow.displayToWorld(n.info.displayPosition[0],n.info.displayPosition[1],n.info.zValue,r.renderer)),f.setSelectionList(n.attributeIDs),o[s]=f,s++}),o}function Ys(t,e,r,o,s){const n=Math.floor(e),i=Math.floor(r),f=Math.floor(o),d=Math.floor(s),g=new Map,h=[0,0];for(let a=i;a<=d;a++)for(let y=n;y<=f;y++){const x=Zs(t,[y,a],0,h);if(x){const T=Ks(x);if(!g.has(T))g.set(T,{info:x,pixelCount:1,attributeIDs:[x.attributeID]});else{const C=g.get(T);C.pixelCount++,t.captureZValues&&x.zValue<C.info.zValue&&(C.info=x),C.attributeIDs.indexOf(x.attributeID)===-1&&C.attributeIDs.push(x.attributeID)}}}return Qs(t.fieldAssociation,g,t)}function qs(t,e){e.classHierarchy.push("vtkWebGPUHardwareSelector"),t.getPropIDForSelection=(r,o=null)=>{if(e._selectionPropMap.has(r))return e._selectionPropMap.get(r);const s=e._selectionProps.length;return e._selectionPropMap.set(r,s),e._selectionProps.push(o),s},t.endSelection=()=>{e.WebGPURenderer.setSelector(null)},t.getSourceDataAsync=async r=>{if(!r||!e._WebGPURenderWindow)return Nr("Renderer and view must be set before calling Select."),!1;e._WebGPURenderWindow.getRenderable().preRender(),e._WebGPURenderWindow.getInitialized()||(e._WebGPURenderWindow.initialize(),await new Promise(T=>{e._WebGPURenderWindow.onInitialized(T)}));const o=e._WebGPURenderWindow.getViewNodeFor(r);if(!o)return!1;const s=o.getSuppressClear(),n=o.getSelector();e._selectionPropMap.clear(),e._selectionProps=[],o.setSuppressClear(!0),o.setSelector(t);try{e._selectionPass.traverse(e._WebGPURenderWindow,o)}finally{o.setSelector(n),o.setSuppressClear(s)}const i=e._WebGPURenderWindow.getDevice(),f=e._selectionPass.getColorTexture(),d=e._selectionPass.getDepthTexture(),g={area:[0,0,f.getWidth()-1,f.getHeight()-1],captureZValues:e.captureZValues,fieldAssociation:e.fieldAssociation,props:[...e._selectionProps],renderer:r,webGPURenderer:o,webGPURenderWindow:e._WebGPURenderWindow,width:f.getWidth(),height:f.getHeight()};g.colorBufferWidth=16*Math.floor((g.width+15)/16),g.colorBufferSizeInBytes=g.colorBufferWidth*g.height*4*4;const h=it.newInstance({label:"hardwareSelectColorBuffer"});h.setDevice(i),h.create(g.colorBufferSizeInBytes,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);const a=e._WebGPURenderWindow.getCommandEncoder();a.copyTextureToBuffer({texture:f.getHandle()},{buffer:h.getHandle(),bytesPerRow:16*g.colorBufferWidth,rowsPerImage:g.height},{width:g.width,height:g.height,depthOrArrayLayers:1});let y;e.captureZValues&&(g.zbufferBufferWidth=64*Math.floor((g.width+63)/64),y=it.newInstance({label:"hardwareSelectDepthBuffer"}),y.setDevice(i),g.zbufferSizeInBytes=g.height*g.zbufferBufferWidth*4,y.create(g.zbufferSizeInBytes,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST),a.copyTextureToBuffer({texture:d.getHandle(),aspect:"depth-only"},{buffer:y.getHandle(),bytesPerRow:4*g.zbufferBufferWidth,rowsPerImage:g.height},{width:g.width,height:g.height,depthOrArrayLayers:1})),i.submitCommandEncoder(a);const x=h.mapAsync(GPUMapMode.READ);if(e.captureZValues){const T=y.mapAsync(GPUMapMode.READ);await Promise.all([x,T]),g.depthValues=new Float32Array(y.getMappedRange().slice()),y.unmap()}else await x;return g.colorValues=new Uint32Array(h.getMappedRange().slice()),h.unmap(),g.generateSelection=(T,C,w,c)=>Ys(g,T,C,w,c),g}}var Js={_selectionPropMap:null,_selectionProps:null};function Ur(t,e,r={}){Object.assign(e,Js,r),fr.extend(t,e,r),e._selectionPass=As.newInstance(),e._selectionPropMap=new Map,e._selectionProps=[],m.setGet(t,e,["_WebGPURenderWindow"]),m.moveToProtected(t,e,["WebGPURenderWindow"]),qs(t,e)}var eo=m.newInstance(Ur,"vtkWebGPUHardwareSelector"),Gr={newInstance:eo,extend:Ur},{vtkErrorMacro:$t,vtkWarningMacro:to}=m,ro={position:"absolute",top:0,left:0,width:"100%",height:"100%"};function ao(t,e){e.classHierarchy.push("vtkWebGPURenderWindow"),t.getViewNodeFactory=()=>e.myFactory;function r(h,a=new Set){if(!h||a.has(h))return;a.add(h);const y=h.getChildren?.()||[];for(let x=0;x<y.length;x++){const T=y[x];T?.releaseGraphicsResources?.(),r(T,a)}}function o(){const h=t.onInitialized(()=>{h.unsubscribe(),e.deleted||t.traverseAllPasses()})}function s(h,a){if(e.deleted||a!==e.deviceGeneration||e.handlingDeviceLost)return;e.handlingDeviceLost=!0,e.deviceLostInfo=h;const y=h?.reason??"unknown",x=h?.message||"WebGPU device was lost.";to(`WebGPU device lost (${y}): ${x}`),t.releaseGraphicsResources(),t.invokeDeviceLost({reason:y,message:x,recoverable:y!=="destroyed"}),y!=="destroyed"&&(o(),t.initialize()),e.handlingDeviceLost=!1}function n(h,a){h.lost.then(y=>{s(y,a)})}const i=[0,0];function f(){e.renderable&&(e.size[0]!==i[0]||e.size[1]!==i[1])&&(i[0]=e.size[0],i[1]=e.size[1],e.canvas.setAttribute("width",e.size[0]),e.canvas.setAttribute("height",e.size[1]),t.recreateSwapChain()),e.viewStream&&e.viewStream.setSize(e.size[0],e.size[1]),e.canvas.style.display=e.useOffScreen?"none":"block",e.el&&(e.el.style.cursor=e.cursorVisibility?e.cursor:"none"),e.containerSize=null}t.onModified(f),t.recreateSwapChain=()=>{e.context&&(e.context.unconfigure(),e.presentationFormat=navigator.gpu.getPreferredCanvasFormat(e.adapter),e.context.configure({device:e.device.getHandle(),format:e.presentationFormat,alphaMode:"premultiplied",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_DST,width:e.size[0],height:e.size[1]}),e._configured=!0)},t.getCurrentTexture=()=>e.context.getCurrentTexture(),t.buildPass=h=>{if(h){if(!e.renderable)return;t.prepareNodes(),t.addMissingNodes(e.renderable.getRenderersByReference()),t.removeUnusedNodes(),t.initialize()}else e.initialized&&(e._configured||t.recreateSwapChain(),e.commandEncoder=e.device.createCommandEncoder())},t.initialize=()=>{if(!e.initializing){if(e.initializing=!0,e.deviceLostInfo=null,!navigator.gpu){$t("WebGPU is not enabled.");return}t.create3DContextAsync().then(()=>{e.initialized=!0,!e.deleted&&t.invokeInitialized()})}},t.setContainer=h=>{e.el&&e.el!==h&&(e.canvas.parentNode!==e.el&&$t("Error: canvas parent node does not match container"),e.el.removeChild(e.canvas),e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)),e.el!==h&&(e.el=h,e.el&&(e.el.appendChild(e.canvas),e.useBackgroundImage&&e.el.appendChild(e.bgImage)),t.modified())},t.getContainer=()=>e.el,t.getContainerSize=()=>{if(!e.containerSize&&e.el){const{width:h,height:a}=e.el.getBoundingClientRect();e.containerSize=[h,a]}return e.containerSize||e.size},t.getFramebufferSize=()=>e.size,t.create3DContextAsync=async()=>{if(e.adapter=await navigator.gpu.requestAdapter({powerPreference:"high-performance"}),!e.deleted){if(e.device=Hs.newInstance(),e.device.initialize(await e.adapter.requestDevice({requiredLimits:{maxBufferSize:e.adapter.limits.maxBufferSize,maxStorageBufferBindingSize:e.adapter.limits.maxStorageBufferBindingSize,maxUniformBufferBindingSize:e.adapter.limits.maxUniformBufferBindingSize}})),e.deleted){e.device=null;return}e.deviceGeneration+=1,n(e.device.getHandle(),e.deviceGeneration),e.context=e.canvas.getContext("webgpu")}},t.releaseGraphicsResources=()=>{if(e.renderPasses)for(let a=0;a<e.renderPasses.length;a++)e.renderPasses[a]?.releaseGraphicsResources?.();r(t);const h=pe.newInstance();h.setCurrentOperation("Release"),h.traverse(t,null),e.context&&e.context.unconfigure(),e.adapter=null,e.device=null,e.context=null,e.commandEncoder=null,e._configured=!1,e.initialized=!1,e.initializing=!1},t.setBackgroundImage=h=>{e.bgImage.src=h.src},t.setUseBackgroundImage=h=>{e.useBackgroundImage=h,e.useBackgroundImage&&!e.el.contains(e.bgImage)?e.el.appendChild(e.bgImage):!e.useBackgroundImage&&e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)};async function d(h=e.imageFormat){const a=document.createElement("canvas"),y=a.getContext("2d");a.width=e.canvas.width,a.height=e.canvas.height;const x=await t.getPixelsAsync(),T=new ImageData(x.colorValues,x.width,x.height);y.putImageData(T,0,0);const C=e.canvas.getBoundingClientRect();e.renderable.getRenderers().forEach(c=>{c.getViewProps().forEach(p=>{if(p.getContainer){const u=p.getContainer().getElementsByTagName("canvas");for(let l=0;l<u.length;l++){const v=u[l],S=v.getBoundingClientRect(),R=S.x-C.x,B=S.y-C.y;y.drawImage(v,R,B)}}})});const w=a.toDataURL(h);a.remove(),t.invokeImageReady(w)}t.captureNextImage=(h="image/png",{resetCamera:a=!1,size:y=null,scale:x=1}={})=>{if(e.deleted)return null;e.imageFormat=h;const T=e.notifyStartCaptureImage;return e.notifyStartCaptureImage=!0,e._screenshot={size:y||x!==1?y||e.size.map(C=>C*x):null},new Promise((C,w)=>{const c=t.onImageReady(p=>{if(e._screenshot.size===null)e.notifyStartCaptureImage=T,c.unsubscribe(),e._screenshot.placeHolder&&(e.size=e._screenshot.originalSize,t.modified(),e._screenshot.cameras&&e._screenshot.cameras.forEach(({restoreParamsFn:u,arg:l})=>u(l)),t.traverseAllPasses(),e.el.removeChild(e._screenshot.placeHolder),e._screenshot.placeHolder.remove(),e._screenshot=null),C(p);else{const u=document.createElement("img");if(u.style=ro,u.src=p,e._screenshot.placeHolder=e.el.appendChild(u),e.canvas.style.display="none",e._screenshot.originalSize=e.size,e.size=e._screenshot.size,e._screenshot.size=null,t.modified(),a){const l=a!==!0;e._screenshot.cameras=e.renderable.getRenderers().map(v=>{const S=v.getActiveCamera(),R=S.get("focalPoint","position","parallelScale");return{resetCameraArgs:l?{renderer:v}:void 0,resetCameraFn:l?a:v.resetCamera,restoreParamsFn:S.set,arg:JSON.parse(JSON.stringify(R))}}),e._screenshot.cameras.forEach(({resetCameraFn:v,resetCameraArgs:S})=>v(S))}t.traverseAllPasses()}})})},t.traverseAllPasses=()=>{if(!e.deleted)if(e.initialized){if(e.renderPasses)for(let h=0;h<e.renderPasses.length;++h)e.renderPasses[h].traverse(t,null);e.commandEncoder&&(e.device.submitCommandEncoder(e.commandEncoder),e.commandEncoder=null,e.notifyStartCaptureImage&&e.device.onSubmittedWorkDone().then(()=>{d()}))}else{t.initialize();const h=t.onInitialized(()=>{h.unsubscribe(),t.traverseAllPasses()})}},t.setViewStream=h=>{if(e.viewStream===h)return!1;if(e.subscription&&(e.subscription.unsubscribe(),e.subscription=null),e.viewStream=h,e.viewStream){const a=e.renderable.getRenderers()[0];a.getBackgroundByReference()[3]=0,t.setUseBackgroundImage(!0),e.subscription=e.viewStream.onImageReady(y=>t.setBackgroundImage(y.image)),e.viewStream.setSize(e.size[0],e.size[1]),e.viewStream.invalidateCache(),e.viewStream.render(),t.modified()}return!0},t.getUniquePropID=()=>e.nextPropID++,t.getPropFromID=h=>{for(let a=0;a<e.children.length;a++){const y=e.children[a].getPropFromID(h);if(y!==null)return y}return null},t.getPixelsAsync=async()=>{const h=e.device,a=e.renderPasses[0].getOpaquePass().getColorTexture(),y={width:a.getWidth(),height:a.getHeight()};y.colorBufferWidth=32*Math.floor((y.width+31)/32),y.colorBufferSizeInBytes=y.colorBufferWidth*y.height*8;const x=it.newInstance();x.setDevice(h),x.create(y.colorBufferSizeInBytes,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);const T=e.device.createCommandEncoder();T.copyTextureToBuffer({texture:a.getHandle()},{buffer:x.getHandle(),bytesPerRow:8*y.colorBufferWidth,rowsPerImage:y.height},{width:y.width,height:y.height,depthOrArrayLayers:1}),h.submitCommandEncoder(T),await x.mapAsync(GPUMapMode.READ),y.colorValues=new Uint16Array(x.getMappedRange().slice()),x.unmap();const C=new Uint8ClampedArray(y.height*y.width*4);for(let w=0;w<y.height;w++)for(let c=0;c<y.width;c++){const p=(w*y.width+c)*4,u=(w*y.colorBufferWidth+c)*4;C[p]=255*Pe.fromHalf(y.colorValues[u]),C[p+1]=255*Pe.fromHalf(y.colorValues[u+1]),C[p+2]=255*Pe.fromHalf(y.colorValues[u+2]),C[p+3]=255*Pe.fromHalf(y.colorValues[u+3])}return y.colorValues=C,y},t.createSelector=()=>{const h=Gr.newInstance();return h.setWebGPURenderWindow(t),h};const g=t.setSize;t.setSize=(...h)=>{const a=g(...h);return a&&t.invokeWindowResizeEvent({width:e.size[0],height:e.size[1]}),a},t.delete=m.chain(t.delete,t.setViewStream)}var no={initialized:!1,initializing:!1,handlingDeviceLost:!1,deviceGeneration:0,deviceLostInfo:null,context:null,adapter:null,device:null,canvas:null,cursorVisibility:!0,cursor:"pointer",containerSize:null,renderPasses:[],notifyStartCaptureImage:!1,imageFormat:"image/png",useOffScreen:!1,useBackgroundImage:!1,nextPropID:1,xrSupported:!1,presentationFormat:null};function so(t,e,r={}){Object.assign(e,no,r),e.canvas=document.createElement("canvas"),e.canvas.style.width="100%",e.bgImage=new Image,e.bgImage.style.position="absolute",e.bgImage.style.left="0",e.bgImage.style.top="0",e.bgImage.style.width="100%",e.bgImage.style.height="100%",e.bgImage.style.zIndex="-1",wr.extend(t,e,r),e.myFactory=Ta.newInstance(),e.renderPasses[0]=Ls.newInstance(),e.selector||(e.selector=Gr.newInstance(),e.selector.setWebGPURenderWindow(t)),m.event(t,e,"imageReady"),m.event(t,e,"initialized"),m.event(t,e,"deviceLost"),m.get(t,e,["commandEncoder","deviceLostInfo","device","presentationFormat","useBackgroundImage","xrSupported"]),m.setGet(t,e,["initialized","context","canvas","device","renderPasses","notifyStartCaptureImage","cursor","useOffScreen"]),m.setGetArray(t,e,["size"],2),m.event(t,e,"windowResizeEvent"),ao(t,e)}var Pr=m.newInstance(so,"vtkWebGPURenderWindow");ht("WebGPU",Pr);ma("vtkRenderWindow",Pr);var oo=Ra.extractURLParameters();function io(t,e){const r=t.invokeResize;delete t.invokeResize,e.renderWindow=Ja.newInstance(),e.renderer=Xa.newInstance(),e.renderWindow.addRenderer(e.renderer),e._apiSpecificRenderWindow=e.renderWindow.newAPISpecificView(oo.viewAPI??e.defaultViewAPI),e.renderWindow.addView(e._apiSpecificRenderWindow),e.interactor=Yr.newInstance(),e.interactor.setInteractorStyle(_a.newInstance()),e.interactor.setView(e._apiSpecificRenderWindow),e.interactor.initialize(),t.setBackground=e.renderer.setBackground,t.setBackground(...e.background),t.resize=()=>{if(e.container){const o=e.container.getBoundingClientRect(),s=window.devicePixelRatio||1;e._apiSpecificRenderWindow.setSize(Math.floor(o.width*s),Math.floor(o.height*s)),r(),e.renderWindow.render()}},t.setContainer=o=>{e.container&&e.interactor.unbindEvents(e.container),e.container=o,e._apiSpecificRenderWindow.setContainer(e.container),e.container&&e.interactor.bindEvents(e.container)},t.delete=m.chain(t.setContainer,e._apiSpecificRenderWindow.delete,()=>{window.removeEventListener("resize",t.resize)},t.delete),e.listenWindowResize&&window.addEventListener("resize",t.resize),t.resize()}var co={background:[.32,.34,.43],listenWindowResize:!0,container:null};function zr(t,e,r={}){Object.assign(e,co,r),m.obj(t,e),m.get(t,e,["renderWindow","renderer","_apiSpecificRenderWindow","interactor","container"]),m.moveToProtected(t,e,["_apiSpecificRenderWindow"]),m.event(t,e,"resize"),io(t,e)}var uo=m.newInstance(zr),Vo={newInstance:uo,extend:zr};export{Vo as default,zr as extend,uo as newInstance};
