import{r as fe,V as ee,S as V,H as Pe,T as K,c as ka,B as st,a as Wi,p as In,F as _,W as gr,f as zi,g as dr,b as cn,O as hr,d as vr,e as Ir,C as Nr,h as $i,I as Ki,i as mn,j as he,k as Ea,U as yt,l as Tn,m as Ot,n as Pa,o as G,q as Nn,s as Ur,t as Fa,u as Sn,v as Hi,w as ji,x as qi,y as _e,P as Yi,z as Gr}from"./FullScreenQuad-BDVyIUIw.js";import{n as X,o as de,s as ye,g as pt,m as I,a as Zi,b as xr,c as me,d as Gn,v as un,e as yn,r as Kt,f as Xi,I as Qi,M as ue,h as Ji,i as eo,j as Cr,D as to,k as ro,l as no,p as ao}from"./Math-BEu_l5xq.js";import{i as Z,c as Ce,t as ne,m as q,a as Te,s as Rt,b as Ae,d as Ut,e as Se,B as je,n as ln,f as Ia,g as Et,h as An,j as mr,k as io,l as Na,o as Ct,p as Ga,z as oo,q as we,r as Pt,u as so,v as fn,w as co,x as uo,y as pn,A as lo,C as fo}from"./BoundingBox-C1hltylu.js";import{i as We,f as lt,a as Xe,t as Tr,m as po,c as Ye,s as Aa,b as ht}from"./mat3-XneHzAl3.js";import{D as ce,V as se}from"./DataArray-18WVy4Au.js";import{P as Re,C as Je,R as bt,a as go,S as ho}from"./LookupTable-D0Q8T--3.js";import{M as mt,A as Tt,P as Ze,a as _t}from"./Mapper-D0DzFbZi.js";import{T as On}from"./Texture-BSag7eNu.js";import{D as _a}from"./ImageData-DWC4rEYz.js";import{P as kr,c as vo,s as xo}from"./Prop--ZA0pgXz.js";import{R as Vt,C as Co}from"./CoincidentTopologyHelper-dmX-HibR.js";import{C as Wa}from"./Constants-CiMvuo4g.js";import{I as qe}from"./Constants-CKW25iB3.js";import{D as mo,P as To}from"./Property2D-DtkdiUSb.js";import{C as So}from"./CubeSource-B4Yen82S.js";import{P as yo}from"./Plane-Cbs-kNLn.js";import{t as Ar,s as _n}from"./vec4-CAesuCqb.js";import"./Prop3D-DcSaBMkz.js";import"./Constants-D7OX7HTV.js";import"./AbstractMapper-CGC4NR1O.js";import"./MatrixBuilder-FYnFnaXN.js";function Oo(t,e){e.classHierarchy.push("vtkOpenGLActor"),t.buildPass=a=>{if(a){e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e.context=e._openGLRenderWindow.getContext(),t.prepareNodes(),t.addMissingNodes(e.renderable.getTextures()),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes(),e.ogltextures=null,e.activeTextures=null;for(let r=0;r<e.children.length;r++){const n=e.children[r];n.isA("vtkOpenGLTexture")?(e.ogltextures||(e.ogltextures=[]),e.ogltextures.push(n)):e.oglmapper=n}}},t.traverseZBufferPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.oglmapper.traverse(a),t.apply(a,!1))},t.traverseOpaqueZBufferPass=a=>t.traverseOpaquePass(a),t.traverseOpaquePass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.oglmapper.traverse(a),t.apply(a,!1))},t.traverseTranslucentPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.oglmapper.traverse(a),t.apply(a,!1))},t.activateTextures=()=>{if(e.ogltextures){e.activeTextures=[];for(let a=0;a<e.ogltextures.length;a++){const r=e.ogltextures[a];r.render(),r.getHandle()&&e.activeTextures.push(r)}}},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;e.renderable.getIsOpaque()?r.incrementOpaqueActorCount():r.incrementTranslucentActorCount()}},t.zBufferPass=(a,r)=>t.opaquePass(a,r),t.opaqueZBufferPass=(a,r)=>t.opaquePass(a,r),t.opaquePass=(a,r)=>{if(a)e.context.depthMask(!0),t.activateTextures();else{if(e.activeTextures)for(let n=0;n<e.activeTextures.length;n++)e.activeTextures[n].deactivate();e._openGLRenderWindow.disableCullFace()}},t.translucentPass=(a,r)=>{if(a)e.context.depthMask(e._openGLRenderer.getSelector()&&e.renderable.getNestedPickable()),t.activateTextures();else{if(e.activeTextures)for(let n=0;n<e.activeTextures.length;n++)e.activeTextures[n].deactivate();e._openGLRenderWindow.disableCullFace()}},t.getKeyMatrices=()=>(e.renderable.getMTime()>e.keyMatrixTime.getMTime()&&(e.renderable.computeMatrix(),Ce(e.keyMatrices.mcwc,e.renderable.getMatrix()),ne(e.keyMatrices.mcwc,e.keyMatrices.mcwc),e.renderable.getIsIdentity()?We(e.keyMatrices.normalMatrix):(lt(e.keyMatrices.normalMatrix,e.keyMatrices.mcwc),Xe(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),Tr(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix)),e.keyMatrixTime.modified()),e.keyMatrices)}var bo={context:null,keyMatrixTime:null,keyMatrices:null,activeTextures:null};function Vo(t,e,a={}){Object.assign(e,bo,a),ee.extend(t,e,a),e.keyMatrixTime={},de(e.keyMatrixTime,{mtime:0}),e.keyMatrices={normalMatrix:We(new Float64Array(9)),mcwc:Z(new Float64Array(16))},ye(t,e,["context"]),pt(t,e,["activeTextures"]),Oo(t,e)}var wo=X(Vo);fe("vtkActor",wo);function Mo(t,e){e.classHierarchy.push("vtkOpenGLActor2D"),t.buildPass=a=>{if(a){if(!e.renderable)return;e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e.context=e._openGLRenderWindow.getContext(),t.prepareNodes(),t.addMissingNodes(e.renderable.getTextures()),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes(),e.ogltextures=null,e.activeTextures=null;for(let r=0;r<e.children.length;r++){const n=e.children[r];n.isA("vtkOpenGLTexture")?(e.ogltextures||(e.ogltextures=[]),e.ogltextures.push(n)):e.oglmapper=n}}},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;r.incrementOverlayActorCount()}},t.traverseOpaquePass=a=>{!e.oglmapper||!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.oglmapper.traverse(a),t.apply(a,!1))},t.traverseTranslucentPass=a=>{!e.oglmapper||!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.oglmapper.traverse(a),t.apply(a,!1))},t.traverseOverlayPass=a=>{!e.oglmapper||!e.renderable||!e.renderable.getNestedVisibility()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable||(t.apply(a,!0),e.oglmapper.traverse(a),t.apply(a,!1))},t.activateTextures=()=>{if(e.ogltextures){e.activeTextures=[];for(let a=0;a<e.ogltextures.length;a++){const r=e.ogltextures[a];r.render(),r.getHandle()&&e.activeTextures.push(r)}}},t.opaquePass=(a,r)=>{if(a)e.context.depthMask(!0),t.activateTextures();else{if(e.activeTextures)for(let n=0;n<e.activeTextures.length;n++)e.activeTextures[n].deactivate();e._openGLRenderWindow.disableCullFace()}},t.translucentPass=(a,r)=>{if(a)e.context.depthMask(!1),t.activateTextures();else{if(e.activeTextures)for(let n=0;n<e.activeTextures.length;n++)e.activeTextures[n].deactivate();e._openGLRenderWindow.disableCullFace()}},t.overlayPass=(a,r)=>{if(a)e.context.depthMask(!0),t.activateTextures();else{if(e.activeTextures)for(let n=0;n<e.activeTextures.length;n++)e.activeTextures[n].deactivate();e._openGLRenderWindow.disableCullFace()}}}var Bo={context:null,activeTextures:null};function Do(t,e,a={}){Object.assign(e,Bo,a),ee.extend(t,e,a),ye(t,e,["context"]),pt(t,e,["activeTextures"]),Mo(t,e)}var Lo=X(Do);fe("vtkActor2D",Lo);function Ro(t,e){e.classHierarchy.push("vtkOpenGLCamera"),t.buildPass=a=>{a&&(e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getParent(),e.context=e._openGLRenderWindow.getContext())},t.opaquePass=a=>{if(a){const r=e._openGLRenderer.getTiledSizeAndOrigin();e.context.viewport(r.lowerLeftU,r.lowerLeftV,r.usize,r.vsize),e.context.scissor(r.lowerLeftU,r.lowerLeftV,r.usize,r.vsize)}},t.translucentPass=t.opaquePass,t.zBufferPass=t.opaquePass,t.opaqueZBufferPass=t.opaquePass,t.volumePass=t.opaquePass,t.getKeyMatrices=a=>{if(a!==e.lastRenderer||e._openGLRenderWindow.getMTime()>e.keyMatrixTime.getMTime()||t.getMTime()>e.keyMatrixTime.getMTime()||a.getMTime()>e.keyMatrixTime.getMTime()||e.renderable.getMTime()>e.keyMatrixTime.getMTime()){e.renderable.getViewMatrix(e.keyMatrices.wcvc),lt(e.keyMatrices.normalMatrix,e.keyMatrices.wcvc),Xe(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),ne(e.keyMatrices.wcvc,e.keyMatrices.wcvc);const r=e._openGLRenderer.getAspectRatio();Ce(e.keyMatrices.vcpc,e.renderable.getProjectionMatrix(r,-1,1)),ne(e.keyMatrices.vcpc,e.keyMatrices.vcpc),q(e.keyMatrices.wcpc,e.keyMatrices.vcpc,e.keyMatrices.wcvc),e.keyMatrixTime.modified(),e.lastRenderer=a}return e.keyMatrices}}var Uo={context:null,lastRenderer:null,keyMatrixTime:null,keyMatrices:null};function ko(t,e,a={}){Object.assign(e,Uo,a),ee.extend(t,e,a),e.keyMatrixTime={},de(e.keyMatrixTime),e.keyMatrices={normalMatrix:new Float64Array(9),vcpc:new Float64Array(16),wcvc:new Float64Array(16),wcpc:new Float64Array(16)},ye(t,e,["context","keyMatrixTime"]),Ro(t,e)}var Eo=X(ko);fe("vtkCamera",Eo);function pr(t,e){return t==null||e==null?NaN:t<e?-1:t>e?1:t>=e?0:NaN}function Po(t,e){return t==null||e==null?NaN:e<t?-1:e>t?1:e>=t?0:NaN}function za(t){let e,a,r;t.length!==2?(e=pr,a=(o,c)=>pr(t(o),c),r=(o,c)=>t(o)-c):(e=t===pr||t===Po?t:Fo,a=t,r=t);function n(o,c,u=0,p=o.length){if(u<p){if(e(c,c)!==0)return p;do{const l=u+p>>>1;a(o[l],c)<0?u=l+1:p=l}while(u<p)}return u}function s(o,c,u=0,p=o.length){if(u<p){if(e(c,c)!==0)return p;do{const l=u+p>>>1;a(o[l],c)<=0?u=l+1:p=l}while(u<p)}return u}function i(o,c,u=0,p=o.length){const l=n(o,c,u,p-1);return l>u&&r(o[l-1],c)>-r(o[l],c)?l-1:l}return{left:n,center:i,right:s}}function Fo(){return 0}function Io(t){return t===null?NaN:+t}const No=za(pr),Go=No.right;za(Io).center;const Ao=Math.sqrt(50),_o=Math.sqrt(10),Wo=Math.sqrt(2);function Sr(t,e,a){const r=(e-t)/Math.max(0,a),n=Math.floor(Math.log10(r)),s=r/Math.pow(10,n),i=s>=Ao?10:s>=_o?5:s>=Wo?2:1;let o,c,u;return n<0?(u=Math.pow(10,-n)/i,o=Math.round(t*u),c=Math.round(e*u),o/u<t&&++o,c/u>e&&--c,u=-u):(u=Math.pow(10,n)*i,o=Math.round(t/u),c=Math.round(e/u),o*u<t&&++o,c*u>e&&--c),c<o&&.5<=a&&a<2?Sr(t,e,a*2):[o,c,u]}function zo(t,e,a){if(e=+e,t=+t,a=+a,!(a>0))return[];if(t===e)return[t];const r=e<t,[n,s,i]=r?Sr(e,t,a):Sr(t,e,a);if(!(s>=n))return[];const o=s-n+1,c=new Array(o);if(r)if(i<0)for(let u=0;u<o;++u)c[u]=(s-u)/-i;else for(let u=0;u<o;++u)c[u]=(s-u)*i;else if(i<0)for(let u=0;u<o;++u)c[u]=(n+u)/-i;else for(let u=0;u<o;++u)c[u]=(n+u)*i;return c}function gn(t,e,a){return e=+e,t=+t,a=+a,Sr(t,e,a)[2]}function $o(t,e,a){e=+e,t=+t,a=+a;const r=e<t,n=r?gn(e,t,a):gn(t,e,a);return(r?-1:1)*(n<0?1/-n:n)}function Ko(t,e){switch(arguments.length){case 0:break;case 1:this.range(t);break;default:this.range(e).domain(t);break}return this}function bn(t,e,a){t.prototype=e.prototype=a,a.constructor=t}function $a(t,e){var a=Object.create(t.prototype);for(var r in e)a[r]=e[r];return a}function Wt(){}var Ft=.7,yr=1/Ft,xt="\\s*([+-]?\\d+)\\s*",It="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",ze="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Ho=/^#([0-9a-f]{3,8})$/,jo=new RegExp(`^rgb\\(${xt},${xt},${xt}\\)$`),qo=new RegExp(`^rgb\\(${ze},${ze},${ze}\\)$`),Yo=new RegExp(`^rgba\\(${xt},${xt},${xt},${It}\\)$`),Zo=new RegExp(`^rgba\\(${ze},${ze},${ze},${It}\\)$`),Xo=new RegExp(`^hsl\\(${It},${ze},${ze}\\)$`),Qo=new RegExp(`^hsla\\(${It},${ze},${ze},${It}\\)$`),Wn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};bn(Wt,Nt,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:zn,formatHex:zn,formatHex8:Jo,formatHsl:es,formatRgb:$n,toString:$n});function zn(){return this.rgb().formatHex()}function Jo(){return this.rgb().formatHex8()}function es(){return Ka(this).formatHsl()}function $n(){return this.rgb().formatRgb()}function Nt(t){var e,a;return t=(t+"").trim().toLowerCase(),(e=Ho.exec(t))?(a=e[1].length,e=parseInt(e[1],16),a===6?Kn(e):a===3?new Oe(e>>8&15|e>>4&240,e>>4&15|e&240,(e&15)<<4|e&15,1):a===8?Ht(e>>24&255,e>>16&255,e>>8&255,(e&255)/255):a===4?Ht(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|e&240,((e&15)<<4|e&15)/255):null):(e=jo.exec(t))?new Oe(e[1],e[2],e[3],1):(e=qo.exec(t))?new Oe(e[1]*255/100,e[2]*255/100,e[3]*255/100,1):(e=Yo.exec(t))?Ht(e[1],e[2],e[3],e[4]):(e=Zo.exec(t))?Ht(e[1]*255/100,e[2]*255/100,e[3]*255/100,e[4]):(e=Xo.exec(t))?qn(e[1],e[2]/100,e[3]/100,1):(e=Qo.exec(t))?qn(e[1],e[2]/100,e[3]/100,e[4]):Wn.hasOwnProperty(t)?Kn(Wn[t]):t==="transparent"?new Oe(NaN,NaN,NaN,0):null}function Kn(t){return new Oe(t>>16&255,t>>8&255,t&255,1)}function Ht(t,e,a,r){return r<=0&&(t=e=a=NaN),new Oe(t,e,a,r)}function ts(t){return t instanceof Wt||(t=Nt(t)),t?(t=t.rgb(),new Oe(t.r,t.g,t.b,t.opacity)):new Oe}function dn(t,e,a,r){return arguments.length===1?ts(t):new Oe(t,e,a,r??1)}function Oe(t,e,a,r){this.r=+t,this.g=+e,this.b=+a,this.opacity=+r}bn(Oe,dn,$a(Wt,{brighter(t){return t=t==null?yr:Math.pow(yr,t),new Oe(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=t==null?Ft:Math.pow(Ft,t),new Oe(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new Oe(ft(this.r),ft(this.g),ft(this.b),Or(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:Hn,formatHex:Hn,formatHex8:rs,formatRgb:jn,toString:jn}));function Hn(){return`#${ct(this.r)}${ct(this.g)}${ct(this.b)}`}function rs(){return`#${ct(this.r)}${ct(this.g)}${ct(this.b)}${ct((isNaN(this.opacity)?1:this.opacity)*255)}`}function jn(){const t=Or(this.opacity);return`${t===1?"rgb(":"rgba("}${ft(this.r)}, ${ft(this.g)}, ${ft(this.b)}${t===1?")":`, ${t})`}`}function Or(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function ft(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function ct(t){return t=ft(t),(t<16?"0":"")+t.toString(16)}function qn(t,e,a,r){return r<=0?t=e=a=NaN:a<=0||a>=1?t=e=NaN:e<=0&&(t=NaN),new Ee(t,e,a,r)}function Ka(t){if(t instanceof Ee)return new Ee(t.h,t.s,t.l,t.opacity);if(t instanceof Wt||(t=Nt(t)),!t)return new Ee;if(t instanceof Ee)return t;t=t.rgb();var e=t.r/255,a=t.g/255,r=t.b/255,n=Math.min(e,a,r),s=Math.max(e,a,r),i=NaN,o=s-n,c=(s+n)/2;return o?(e===s?i=(a-r)/o+(a<r)*6:a===s?i=(r-e)/o+2:i=(e-a)/o+4,o/=c<.5?s+n:2-s-n,i*=60):o=c>0&&c<1?0:i,new Ee(i,o,c,t.opacity)}function ns(t,e,a,r){return arguments.length===1?Ka(t):new Ee(t,e,a,r??1)}function Ee(t,e,a,r){this.h=+t,this.s=+e,this.l=+a,this.opacity=+r}bn(Ee,ns,$a(Wt,{brighter(t){return t=t==null?yr:Math.pow(yr,t),new Ee(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=t==null?Ft:Math.pow(Ft,t),new Ee(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+(this.h<0)*360,e=isNaN(t)||isNaN(this.s)?0:this.s,a=this.l,r=a+(a<.5?a:1-a)*e,n=2*a-r;return new Oe(_r(t>=240?t-240:t+120,n,r),_r(t,n,r),_r(t<120?t+240:t-120,n,r),this.opacity)},clamp(){return new Ee(Yn(this.h),jt(this.s),jt(this.l),Or(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=Or(this.opacity);return`${t===1?"hsl(":"hsla("}${Yn(this.h)}, ${jt(this.s)*100}%, ${jt(this.l)*100}%${t===1?")":`, ${t})`}`}}));function Yn(t){return t=(t||0)%360,t<0?t+360:t}function jt(t){return Math.max(0,Math.min(1,t||0))}function _r(t,e,a){return(t<60?e+(a-e)*t/60:t<180?a:t<240?e+(a-e)*(240-t)/60:e)*255}const Vn=t=>()=>t;function as(t,e){return function(a){return t+a*e}}function is(t,e,a){return t=Math.pow(t,a),e=Math.pow(e,a)-t,a=1/a,function(r){return Math.pow(t+r*e,a)}}function os(t){return(t=+t)==1?Ha:function(e,a){return a-e?is(e,a,t):Vn(isNaN(e)?a:e)}}function Ha(t,e){var a=e-t;return a?as(t,a):Vn(isNaN(t)?e:t)}const Zn=(function t(e){var a=os(e);function r(n,s){var i=a((n=dn(n)).r,(s=dn(s)).r),o=a(n.g,s.g),c=a(n.b,s.b),u=Ha(n.opacity,s.opacity);return function(p){return n.r=i(p),n.g=o(p),n.b=c(p),n.opacity=u(p),n+""}}return r.gamma=t,r})(1);function ss(t,e){e||(e=[]);var a=t?Math.min(e.length,t.length):0,r=e.slice(),n;return function(s){for(n=0;n<a;++n)r[n]=t[n]*(1-s)+e[n]*s;return r}}function cs(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}function us(t,e){var a=e?e.length:0,r=t?Math.min(a,t.length):0,n=new Array(r),s=new Array(a),i;for(i=0;i<r;++i)n[i]=wn(t[i],e[i]);for(;i<a;++i)s[i]=e[i];return function(o){for(i=0;i<r;++i)s[i]=n[i](o);return s}}function ls(t,e){var a=new Date;return t=+t,e=+e,function(r){return a.setTime(t*(1-r)+e*r),a}}function br(t,e){return t=+t,e=+e,function(a){return t*(1-a)+e*a}}function fs(t,e){var a={},r={},n;(t===null||typeof t!="object")&&(t={}),(e===null||typeof e!="object")&&(e={});for(n in e)n in t?a[n]=wn(t[n],e[n]):r[n]=e[n];return function(s){for(n in a)r[n]=a[n](s);return r}}var hn=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Wr=new RegExp(hn.source,"g");function ps(t){return function(){return t}}function gs(t){return function(e){return t(e)+""}}function ds(t,e){var a=hn.lastIndex=Wr.lastIndex=0,r,n,s,i=-1,o=[],c=[];for(t=t+"",e=e+"";(r=hn.exec(t))&&(n=Wr.exec(e));)(s=n.index)>a&&(s=e.slice(a,s),o[i]?o[i]+=s:o[++i]=s),(r=r[0])===(n=n[0])?o[i]?o[i]+=n:o[++i]=n:(o[++i]=null,c.push({i,x:br(r,n)})),a=Wr.lastIndex;return a<e.length&&(s=e.slice(a),o[i]?o[i]+=s:o[++i]=s),o.length<2?c[0]?gs(c[0].x):ps(e):(e=c.length,function(u){for(var p=0,l;p<e;++p)o[(l=c[p]).i]=l.x(u);return o.join("")})}function wn(t,e){var a=typeof e,r;return e==null||a==="boolean"?Vn(e):(a==="number"?br:a==="string"?(r=Nt(e))?(e=r,Zn):ds:e instanceof Nt?Zn:e instanceof Date?ls:cs(e)?ss:Array.isArray(e)?us:typeof e.valueOf!="function"&&typeof e.toString!="function"||isNaN(e)?fs:br)(t,e)}function hs(t,e){return t=+t,e=+e,function(a){return Math.round(t*(1-a)+e*a)}}function vs(t){return function(){return t}}function xs(t){return+t}var Xn=[0,1];function vt(t){return t}function vn(t,e){return(e-=t=+t)?function(a){return(a-t)/e}:vs(isNaN(e)?NaN:.5)}function Cs(t,e){var a;return t>e&&(a=t,t=e,e=a),function(r){return Math.max(t,Math.min(e,r))}}function ms(t,e,a){var r=t[0],n=t[1],s=e[0],i=e[1];return n<r?(r=vn(n,r),s=a(i,s)):(r=vn(r,n),s=a(s,i)),function(o){return s(r(o))}}function Ts(t,e,a){var r=Math.min(t.length,e.length)-1,n=new Array(r),s=new Array(r),i=-1;for(t[r]<t[0]&&(t=t.slice().reverse(),e=e.slice().reverse());++i<r;)n[i]=vn(t[i],t[i+1]),s[i]=a(e[i],e[i+1]);return function(o){var c=Go(t,o,1,r)-1;return s[c](n[c](o))}}function Ss(t,e){return e.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp()).unknown(t.unknown())}function ys(){var t=Xn,e=Xn,a=wn,r,n,s,i=vt,o,c,u;function p(){var f=Math.min(t.length,e.length);return i!==vt&&(i=Cs(t[0],t[f-1])),o=f>2?Ts:ms,c=u=null,l}function l(f){return f==null||isNaN(f=+f)?s:(c||(c=o(t.map(r),e,a)))(r(i(f)))}return l.invert=function(f){return i(n((u||(u=o(e,t.map(r),br)))(f)))},l.domain=function(f){return arguments.length?(t=Array.from(f,xs),p()):t.slice()},l.range=function(f){return arguments.length?(e=Array.from(f),p()):e.slice()},l.rangeRound=function(f){return e=Array.from(f),a=hs,p()},l.clamp=function(f){return arguments.length?(i=f?!0:vt,p()):i!==vt},l.interpolate=function(f){return arguments.length?(a=f,p()):a},l.unknown=function(f){return arguments.length?(s=f,l):s},function(f,g){return r=f,n=g,p()}}function Os(){return ys()(vt,vt)}function bs(t){return Math.abs(t=Math.round(t))>=1e21?t.toLocaleString("en").replace(/,/g,""):t.toString(10)}function Vr(t,e){if(!isFinite(t)||t===0)return null;var a=(t=e?t.toExponential(e-1):t.toExponential()).indexOf("e"),r=t.slice(0,a);return[r.length>1?r[0]+r.slice(2):r,+t.slice(a+1)]}function St(t){return t=Vr(Math.abs(t)),t?t[1]:NaN}function Vs(t,e){return function(a,r){for(var n=a.length,s=[],i=0,o=t[0],c=0;n>0&&o>0&&(c+o+1>r&&(o=Math.max(1,r-c)),s.push(a.substring(n-=o,n+o)),!((c+=o+1)>r));)o=t[i=(i+1)%t.length];return s.reverse().join(e)}}function ws(t){return function(e){return e.replace(/[0-9]/g,function(a){return t[+a]})}}var Ms=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function wr(t){if(!(e=Ms.exec(t)))throw new Error("invalid format: "+t);var e;return new Mn({fill:e[1],align:e[2],sign:e[3],symbol:e[4],zero:e[5],width:e[6],comma:e[7],precision:e[8]&&e[8].slice(1),trim:e[9],type:e[10]})}wr.prototype=Mn.prototype;function Mn(t){this.fill=t.fill===void 0?" ":t.fill+"",this.align=t.align===void 0?">":t.align+"",this.sign=t.sign===void 0?"-":t.sign+"",this.symbol=t.symbol===void 0?"":t.symbol+"",this.zero=!!t.zero,this.width=t.width===void 0?void 0:+t.width,this.comma=!!t.comma,this.precision=t.precision===void 0?void 0:+t.precision,this.trim=!!t.trim,this.type=t.type===void 0?"":t.type+""}Mn.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(this.width===void 0?"":Math.max(1,this.width|0))+(this.comma?",":"")+(this.precision===void 0?"":"."+Math.max(0,this.precision|0))+(this.trim?"~":"")+this.type};function Bs(t){e:for(var e=t.length,a=1,r=-1,n;a<e;++a)switch(t[a]){case".":r=n=a;break;case"0":r===0&&(r=a),n=a;break;default:if(!+t[a])break e;r>0&&(r=0);break}return r>0?t.slice(0,r)+t.slice(n+1):t}var Mr;function Ds(t,e){var a=Vr(t,e);if(!a)return Mr=void 0,t.toPrecision(e);var r=a[0],n=a[1],s=n-(Mr=Math.max(-8,Math.min(8,Math.floor(n/3)))*3)+1,i=r.length;return s===i?r:s>i?r+new Array(s-i+1).join("0"):s>0?r.slice(0,s)+"."+r.slice(s):"0."+new Array(1-s).join("0")+Vr(t,Math.max(0,e+s-1))[0]}function Qn(t,e){var a=Vr(t,e);if(!a)return t+"";var r=a[0],n=a[1];return n<0?"0."+new Array(-n).join("0")+r:r.length>n+1?r.slice(0,n+1)+"."+r.slice(n+1):r+new Array(n-r.length+2).join("0")}const Jn={"%":(t,e)=>(t*100).toFixed(e),b:t=>Math.round(t).toString(2),c:t=>t+"",d:bs,e:(t,e)=>t.toExponential(e),f:(t,e)=>t.toFixed(e),g:(t,e)=>t.toPrecision(e),o:t=>Math.round(t).toString(8),p:(t,e)=>Qn(t*100,e),r:Qn,s:Ds,X:t=>Math.round(t).toString(16).toUpperCase(),x:t=>Math.round(t).toString(16)};function ea(t){return t}var ta=Array.prototype.map,ra=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function Ls(t){var e=t.grouping===void 0||t.thousands===void 0?ea:Vs(ta.call(t.grouping,Number),t.thousands+""),a=t.currency===void 0?"":t.currency[0]+"",r=t.currency===void 0?"":t.currency[1]+"",n=t.decimal===void 0?".":t.decimal+"",s=t.numerals===void 0?ea:ws(ta.call(t.numerals,String)),i=t.percent===void 0?"%":t.percent+"",o=t.minus===void 0?"−":t.minus+"",c=t.nan===void 0?"NaN":t.nan+"";function u(l,f){l=wr(l);var g=l.fill,h=l.align,d=l.sign,v=l.symbol,x=l.zero,C=l.width,T=l.comma,m=l.precision,w=l.trim,O=l.type;O==="n"?(T=!0,O="g"):Jn[O]||(m===void 0&&(m=12),w=!0,O="g"),(x||g==="0"&&h==="=")&&(x=!0,g="0",h="=");var B=(f&&f.prefix!==void 0?f.prefix:"")+(v==="$"?a:v==="#"&&/[boxX]/.test(O)?"0"+O.toLowerCase():""),U=(v==="$"?r:/[%p]/.test(O)?i:"")+(f&&f.suffix!==void 0?f.suffix:""),F=Jn[O],D=/[defgprs%]/.test(O);m=m===void 0?6:/[gprs]/.test(O)?Math.max(1,Math.min(21,m)):Math.max(0,Math.min(20,m));function y(S){var P=B,M=U,b,L,R;if(O==="c")M=F(S)+M,S="";else{S=+S;var E=S<0||1/S<0;if(S=isNaN(S)?c:F(Math.abs(S),m),w&&(S=Bs(S)),E&&+S==0&&d!=="+"&&(E=!1),P=(E?d==="("?d:o:d==="-"||d==="("?"":d)+P,M=(O==="s"&&!isNaN(S)&&Mr!==void 0?ra[8+Mr/3]:"")+M+(E&&d==="("?")":""),D){for(b=-1,L=S.length;++b<L;)if(R=S.charCodeAt(b),48>R||R>57){M=(R===46?n+S.slice(b+1):S.slice(b))+M,S=S.slice(0,b);break}}}T&&!x&&(S=e(S,1/0));var k=P.length+S.length+M.length,N=k<C?new Array(C-k+1).join(g):"";switch(T&&x&&(S=e(N+S,N.length?C-M.length:1/0),N=""),h){case"<":S=P+S+M+N;break;case"=":S=P+N+S+M;break;case"^":S=N.slice(0,k=N.length>>1)+P+S+M+N.slice(k);break;default:S=N+P+S+M;break}return s(S)}return y.toString=function(){return l+""},y}function p(l,f){var g=Math.max(-8,Math.min(8,Math.floor(St(f)/3)))*3,h=Math.pow(10,-g),d=u((l=wr(l),l.type="f",l),{suffix:ra[8+g/3]});return function(v){return d(h*v)}}return{format:u,formatPrefix:p}}var qt,ja,qa;Rs({thousands:",",grouping:[3],currency:["$",""]});function Rs(t){return qt=Ls(t),ja=qt.format,qa=qt.formatPrefix,qt}function Us(t){return Math.max(0,-St(Math.abs(t)))}function ks(t,e){return Math.max(0,Math.max(-8,Math.min(8,Math.floor(St(e)/3)))*3-St(Math.abs(t)))}function Es(t,e){return t=Math.abs(t),e=Math.abs(e)-t,Math.max(0,St(e)-St(t))+1}function Ps(t,e,a,r){var n=$o(t,e,a),s;switch(r=wr(r??",f"),r.type){case"s":{var i=Math.max(Math.abs(t),Math.abs(e));return r.precision==null&&!isNaN(s=ks(n,i))&&(r.precision=s),qa(r,i)}case"":case"e":case"g":case"p":case"r":{r.precision==null&&!isNaN(s=Es(n,Math.max(Math.abs(t),Math.abs(e))))&&(r.precision=s-(r.type==="e"));break}case"f":case"%":{r.precision==null&&!isNaN(s=Us(n))&&(r.precision=s-(r.type==="%")*2);break}}return ja(r)}function Fs(t){var e=t.domain;return t.ticks=function(a){var r=e();return zo(r[0],r[r.length-1],a??10)},t.tickFormat=function(a,r){var n=e();return Ps(n[0],n[n.length-1],a??10,r)},t.nice=function(a){a==null&&(a=10);var r=e(),n=0,s=r.length-1,i=r[n],o=r[s],c,u,p=10;for(o<i&&(u=i,i=o,o=u,u=n,n=s,s=u);p-- >0;){if(u=gn(i,o,a),u===c)return r[n]=i,r[s]=o,e(r);if(u>0)i=Math.floor(i/u)*u,o=Math.ceil(o/u)*u;else if(u<0)i=Math.ceil(i*u)/u,o=Math.floor(o*u)/u;else break;c=u}return t},t}function Bn(){var t=Os();return t.copy=function(){return Ss(t,Bn())},Ko.apply(t,arguments),Fs(t)}var Is=[[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]],na=[[8,7,11,3],[9,1,10,5],[4,9,0,8],[2,11,6,10],[0,3,2,1],[4,5,6,7]],Yt=[[0,1],[1,3],[2,3],[0,2],[4,5],[5,7],[6,7],[4,6],[0,4],[1,5],[3,7],[2,6]],aa=[0,1,0,1,0,1,0,1,2,2,2,2],ae=[[1,2],[1,2],[0,2],[0,2],[0,1],[0,1]],W=new Float64Array(3),Zt=new Float64Array(3),Q=new Float64Array(3),ot=new Float64Array(3),tt=new Float64Array(3),Xt=new Float64Array(3),zr=new Float64Array(16);function $r(t,e){t.strokeStyle=e.strokeColor,t.lineWidth=e.strokeSize,t.fillStyle=e.fontColor,t.font=`${e.fontStyle} ${e.fontSize}px ${e.fontFamily}`}function Ya(t){const e=[],a=[];for(let r=0;r<3;r++){const n=Bn().domain([t[r*2],t[r*2+1]]);e[r]=n.ticks(5);const s=n.tickFormat(5);a[r]=e[r].map(s)}return{ticks:e,tickStrings:a}}function Ns(t,e){e.classHierarchy.push("vtkCubeAxesActorHelper"),t.setRenderable=a=>{e.renderable!==a&&(e.renderable=a,e.tmActor.addTexture(e.renderable.getTmTexture()),e.tmActor.setProperty(a.getProperty()),e.tmActor.setParentProp(a),t.modified())},t.createPolyDataForOneLabel=(a,r,n,s,i,o,c)=>{const u=e.renderable.get_tmAtlas().get(a);if(!u)return;const p=e.renderable.getTextPolyData().getPoints().getData(),l=e.lastSize;W[0]=p[r*3],W[1]=p[r*3+1],W[2]=p[r*3+2],Te(Q,W,n),Q[0]+=.1,Te(Zt,Q,s),Rt(tt,Zt,W),Q[0]-=.1,Q[1]+=.1,Te(Zt,Q,s),Rt(Xt,Zt,W);for(let h=0;h<3;h++)tt[h]/=.5*.1*l[0],Xt[h]/=.5*.1*l[1];let f=c.ptIdx,g=c.cellIdx;W[0]=p[r*3],W[1]=p[r*3+1],W[2]=p[r*3+2],i[0]<-.5?Ae(Q,tt,i[0]*o-u.width):i[0]>.5?Ae(Q,tt,i[0]*o):Ae(Q,tt,i[0]*o-u.width/2),Ut(W,W,Q),Ae(Q,Xt,i[1]*o-u.height/2),Ut(W,W,Q),c.points[f*3]=W[0],c.points[f*3+1]=W[1],c.points[f*3+2]=W[2],c.tcoords[f*2]=u.tcoords[0],c.tcoords[f*2+1]=u.tcoords[1],f++,Ae(Q,tt,u.width),Ut(W,W,Q),c.points[f*3]=W[0],c.points[f*3+1]=W[1],c.points[f*3+2]=W[2],c.tcoords[f*2]=u.tcoords[2],c.tcoords[f*2+1]=u.tcoords[3],f++,Ae(Q,Xt,u.height),Ut(W,W,Q),c.points[f*3]=W[0],c.points[f*3+1]=W[1],c.points[f*3+2]=W[2],c.tcoords[f*2]=u.tcoords[4],c.tcoords[f*2+1]=u.tcoords[5],f++,Ae(Q,tt,u.width),Rt(W,W,Q),c.points[f*3]=W[0],c.points[f*3+1]=W[1],c.points[f*3+2]=W[2],c.tcoords[f*2]=u.tcoords[6],c.tcoords[f*2+1]=u.tcoords[7],f++,c.polys[g*4]=3,c.polys[g*4+1]=f-4,c.polys[g*4+2]=f-3,c.polys[g*4+3]=f-2,g++,c.polys[g*4]=3,c.polys[g*4+1]=f-4,c.polys[g*4+2]=f-2,c.polys[g*4+3]=f-1,c.ptIdx+=4,c.cellIdx+=2},t.updateTexturePolyData=()=>{const a=e.camera.getCompositeProjectionMatrix(e.lastAspectRatio,-1,1);ne(a,a);const r=e.renderable.getTextValues().length,n=r*4,s=r*2,i=new Float64Array(n*3),o=new Uint16Array(s*4),c=new Float32Array(n*2);Se(zr,a);const u={ptIdx:0,cellIdx:0,polys:o,points:i,tcoords:c};let p=0,l=0,f=0;const g=e.renderable.getTextPolyData().getPoints().getData(),h=e.renderable.getTextValues();for(;p<g.length/3;){W[0]=g[p*3],W[1]=g[p*3+1],W[2]=g[p*3+2],Te(Q,W,a),W[0]=g[p*3+3],W[1]=g[p*3+4],W[2]=g[p*3+5],Te(ot,W,a),Rt(Q,Q,ot);const v=[Q[0],Q[1]];Zi(v),t.createPolyDataForOneLabel(h[l],p,a,zr,v,e.renderable.getAxisTitlePixelOffset(),u),p+=2,l++;for(let x=0;x<e.renderable.getTickCounts()[f];x++)t.createPolyDataForOneLabel(h[l],p,a,zr,v,e.renderable.getTickLabelPixelOffset(),u),p++,l++;f++}const d=ce.newInstance({numberOfComponents:2,values:c,name:"TextureCoordinates"});e.tmPolyData.getPointData().setTCoords(d),e.tmPolyData.getPoints().setData(i,3),e.tmPolyData.getPoints().modified(),e.tmPolyData.getPolys().setData(o,1),e.tmPolyData.getPolys().modified(),e.tmPolyData.modified()},t.updateAPISpecificData=(a,r,n)=>{(e.lastSize[0]!==a[0]||e.lastSize[1]!==a[1])&&(e.lastSize[0]=a[0],e.lastSize[1]=a[1],e.lastAspectRatio=a[0]/a[1],e.forceUpdate=!0),e.camera=r,t.updateTexturePolyData()}}var Gs=I.newInstance((t,e,a={renderable:null})=>{Object.assign(e,{},a),I.obj(t,e),e.tmPolyData=Re.newInstance(),e.tmMapper=mt.newInstance(),e.tmMapper.setInputData(e.tmPolyData),e.tmActor=Tt.newInstance({parentProp:t}),e.tmActor.setMapper(e.tmMapper),I.setGet(t,e,["renderable"]),I.get(t,e,["lastSize","lastAspectRatio","axisTextStyle","tickTextStyle","tmActor","ticks"]),e.forceUpdate=!1,e.lastRedrawTime={},I.obj(e.lastRedrawTime,{mtime:0}),e.lastRebuildTime={},I.obj(e.lastRebuildTime,{mtime:0}),e.lastSize=[-1,-1],e.lastTickBounds=[],Ns(t,e)},"vtkCubeAxesActorHelper");function As(t,e){e.classHierarchy.push("vtkCubeAxesActor"),t.setCamera=r=>{e.camera!==r&&(e.cameraModifiedSub&&(e.cameraModifiedSub.unsubscribe(),e.cameraModifiedSub=null),e.camera=r,r&&(e.cameraModifiedSub=r.onModified(t.update)),t.update(),t.modified())},t.computeFacesToDraw=()=>{const r=e.camera.getViewMatrix();ne(r,r);let n=!1;const s=je.getDiagonalLength(e.dataBounds),i=Math.sin(e.faceVisibilityAngle*Math.PI/180);for(let o=0;o<6;o++){let c=!1;const u=Math.floor(o/2),p=(u+1)%3,l=(u+2)%3;e.dataBounds[p*2]!==e.dataBounds[p*2+1]&&e.dataBounds[l*2]!==e.dataBounds[l*2+1]&&(W[u]=e.dataBounds[o]-.1*s*Is[o][u],W[p]=.5*(e.dataBounds[p*2]+e.dataBounds[p*2+1]),W[l]=.5*(e.dataBounds[l*2]+e.dataBounds[l*2+1]),Te(Q,W,r),W[u]=e.dataBounds[o],Te(ot,W,r),Rt(Q,ot,Q),ln(Q,Q),c=Q[2]>i,e.camera.getParallelProjection()||(ln(ot,ot),c=Ia(ot,Q)>i)),c!==e.lastFacesToDraw[o]&&(e.lastFacesToDraw[o]=c,n=!0)}return n},t.updatePolyData=(r,n,s)=>{let i=0,o=0;i+=8;let c=0;for(let g=0;g<12;g++)n[g]>0&&c++;if(o+=c,e.gridLines)for(let g=0;g<6;g++)r[g]&&(i+=s[ae[g][0]].length*2+s[ae[g][1]].length*2,o+=s[ae[g][0]].length+s[ae[g][1]].length);const u=new Float64Array(i*3),p=new Uint32Array(o*3);let l=0,f=0;for(let g=0;g<2;g++)for(let h=0;h<2;h++)for(let d=0;d<2;d++)u[l*3]=e.dataBounds[d],u[l*3+1]=e.dataBounds[2+h],u[l*3+2]=e.dataBounds[4+g],l++;for(let g=0;g<12;g++)n[g]>0&&(p[f*3]=2,p[f*3+1]=Yt[g][0],p[f*3+2]=Yt[g][1],f++);if(e.gridLines){for(let g=0;g<6;g++)if(r[g]){const h=Math.floor(g/2);let d=s[ae[g][0]];for(let v=0;v<d.length;v++)u[l*3+h]=e.dataBounds[g],u[l*3+ae[g][0]]=d[v],u[l*3+ae[g][1]]=e.dataBounds[ae[g][1]*2],l++,u[l*3+h]=e.dataBounds[g],u[l*3+ae[g][0]]=d[v],u[l*3+ae[g][1]]=e.dataBounds[ae[g][1]*2+1],l++,p[f*3]=2,p[f*3+1]=l-2,p[f*3+2]=l-1,f++;d=s[ae[g][1]];for(let v=0;v<d.length;v++)u[l*3+h]=e.dataBounds[g],u[l*3+ae[g][1]]=d[v],u[l*3+ae[g][0]]=e.dataBounds[ae[g][0]*2],l++,u[l*3+h]=e.dataBounds[g],u[l*3+ae[g][1]]=d[v],u[l*3+ae[g][0]]=e.dataBounds[ae[g][0]*2+1],l++,p[f*3]=2,p[f*3+1]=l-2,p[f*3+2]=l-1,f++}}e.polyData.getPoints().setData(u,3),e.polyData.getPoints().modified(),e.polyData.getLines().setData(p,1),e.polyData.getLines().modified(),e.polyData.modified()},t.updateTextData=(r,n,s,i)=>{let o=0;for(let g=0;g<12;g++)n[g]===1&&(o+=2,o+=s[aa[g]].length);const c=e.polyData.getPoints().getData(),u=new Float64Array(o*3);let p=0,l=0,f=0;for(let g=0;g<6;g++)if(r[g])for(let h=0;h<4;h++){const d=na[g][h];if(n[d]===1){const v=aa[d],x=Yt[d][0]*3,C=Yt[d][1]*3;u[p*3]=.5*(c[x]+c[C]),u[p*3+1]=.5*(c[x+1]+c[C+1]),u[p*3+2]=.5*(c[x+2]+c[C+2]),p++;const T=Math.floor(g/2);u[p*3+T]=e.dataBounds[g],u[p*3+ae[g][0]]=.5*(e.dataBounds[ae[g][0]*2]+e.dataBounds[ae[g][0]*2+1]),u[p*3+ae[g][1]]=.5*(e.dataBounds[ae[g][1]*2]+e.dataBounds[ae[g][1]*2+1]),p++,e.textValues[l]=e.axisLabels[v],l++;const m=(v+1)%3,w=(v+2)%3,O=s[v],B=i[v];e.tickCounts[f]=O.length;for(let U=0;U<O.length;U++)u[p*3+v]=O[U],u[p*3+m]=c[x+m],u[p*3+w]=c[x+w],p++,e.textValues[l]=B[U],l++;f++}}e.textPolyData.getPoints().setData(u,3),e.textPolyData.modified()},t.update=()=>{if(!e.camera)return;const r=t.computeFacesToDraw(),n=e.lastFacesToDraw;let s=!1;for(let i=0;i<6;i++)e.dataBounds[i]!==e.lastTickBounds[i]&&(s=!0,e.lastTickBounds[i]=e.dataBounds[i]);if(r||s||e.forceUpdate){const i=new Array(12).fill(0);for(let c=0;c<6;c++)if(n[c])for(let u=0;u<4;u++)i[na[c][u]]++;const o=e.generateTicks(e.dataBounds);t.updatePolyData(n,i,o.ticks),t.updateTextData(n,i,o.ticks,o.tickStrings),(s||e.forceUpdate)&&t.updateTextureAtlas(o.tickStrings)}e.forceUpdate=!1},t.updateTextureAtlas=r=>{e.tmContext.textBaseline="bottom",e.tmContext.textAlign="left",e._tmAtlas.clear();let n=0,s=1;for(let i=0;i<3;i++){if(!e._tmAtlas.has(e.axisLabels[i])){$r(e.tmContext,e.axisTextStyle);const o=e.tmContext.measureText(e.axisLabels[i]),c={height:o.actualBoundingBoxAscent+2,startingHeight:s,width:o.width+2,textStyle:e.axisTextStyle};e._tmAtlas.set(e.axisLabels[i],c),s+=c.height,n<c.width&&(n=c.width)}$r(e.tmContext,e.tickTextStyle);for(let o=0;o<r[i].length;o++)if(!e._tmAtlas.has(r[i][o])){const c=e.tmContext.measureText(r[i][o]),u={height:c.actualBoundingBoxAscent+2,startingHeight:s,width:c.width+2,textStyle:e.tickTextStyle};e._tmAtlas.set(r[i][o],u),s+=u.height,n<u.width&&(n=u.width)}}n=xr(n),s=xr(s),e._tmAtlas.forEach(i=>{i.tcoords=[0,(s-i.startingHeight-i.height)/s,i.width/n,(s-i.startingHeight-i.height)/s,i.width/n,(s-i.startingHeight)/s,0,(s-i.startingHeight)/s]}),e.tmCanvas.width=n,e.tmCanvas.height=s,e.tmContext.textBaseline="bottom",e.tmContext.textAlign="left",e.tmContext.clearRect(0,0,n,s),e._tmAtlas.forEach((i,o)=>{$r(e.tmContext,i.textStyle),e.tmContext.fillText(o,1,i.startingHeight+i.height-1)}),e.tmTexture.setCanvas(e.tmCanvas),e.tmTexture.modified()},t.onModified(()=>{e.forceUpdate=!0,t.update()}),t.setTickTextStyle=r=>{e.tickTextStyle={...e.tickTextStyle,...r},t.modified()},t.setAxisTextStyle=r=>{e.axisTextStyle={...e.axisTextStyle,...r},t.modified()},t.get_tmAtlas=()=>e._tmAtlas,t.computeBounds=()=>{t.update(),je.setBounds(e.bounds,e.gridActor.getBounds()),je.scaleAboutCenter(e.bounds,e.boundsScaleFactor,e.boundsScaleFactor,e.boundsScaleFactor)};const a=t.setProperty;t.setProperty=r=>{const n=a(r);return e.gridActor.setProperty(r),n}}function _s(t,e,a){return{boundsScaleFactor:1.3,camera:null,dataBounds:[...je.INIT_BOUNDS],faceVisibilityAngle:8,gridLines:!0,axisLabels:null,axisTitlePixelOffset:35,tickLabelPixelOffset:12,generateTicks:Ya,...a,axisTextStyle:{fontColor:"white",fontStyle:"normal",fontSize:18,fontFamily:"serif",...a?.axisTextStyle},tickTextStyle:{fontColor:"white",fontStyle:"normal",fontSize:14,fontFamily:"serif",...a?.tickTextStyle}}}function Za(t,e,a={}){Tt.extend(t,e,_s(t,e,a)),e.lastFacesToDraw=[!1,!1,!1,!1,!1,!1],e.axisLabels=["X-Axis","Y-Axis","Z-Axis"],e.tickCounts=[],e.textValues=[],e.lastTickBounds=[],e.tmCanvas=document.createElement("canvas"),e.tmContext=e.tmCanvas.getContext("2d"),e._tmAtlas=new Map,e.tmTexture=On.newInstance({resizable:!0}),e.tmTexture.setInterpolate(!1),t.getProperty().setDiffuse(0),t.getProperty().setAmbient(1),e.gridMapper=mt.newInstance(),e.polyData=Re.newInstance(),e.gridMapper.setInputData(e.polyData),e.gridActor=Tt.newInstance(),e.gridActor.setMapper(e.gridMapper),e.gridActor.setProperty(t.getProperty()),e.gridActor.setParentProp(t),e.textPolyData=Re.newInstance(),I.setGet(t,e,["axisTitlePixelOffset","boundsScaleFactor","faceVisibilityAngle","gridLines","tickLabelPixelOffset","generateTicks"]),I.setGetArray(t,e,["dataBounds"],6),I.setGetArray(t,e,["axisLabels"],3),I.get(t,e,["axisTextStyle","tickTextStyle","camera","tmTexture","textValues","textPolyData","tickCounts","gridActor"]),As(t,e)}var Ws=I.newInstance(Za,"vtkCubeAxesActor"),Xa={newInstance:Ws,extend:Za,newCubeAxesActorHelper:Gs,defaultGenerateTicks:Ya};function zs(t,e){e.classHierarchy.push("vtkOpenGLCubeAxesActor"),t.buildPass=a=>{a&&(e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getParent(),e.CubeAxesActorHelper.getRenderable()||e.CubeAxesActorHelper.setRenderable(e.renderable),t.prepareNodes(),t.addMissingNode(e.CubeAxesActorHelper.getTmActor()),t.addMissingNode(e.renderable.getGridActor()),t.removeUnusedNodes())},t.opaquePass=(a,r)=>{if(a){const n=e._openGLRenderer?e._openGLRenderer.getRenderable().getActiveCamera():null,s=e._openGLRenderer.getTiledSizeAndOrigin();e.CubeAxesActorHelper.updateAPISpecificData([s.usize,s.vsize],n,e._openGLRenderWindow.getRenderable())}}}var $s={};function Ks(t,e,a={}){Object.assign(e,$s,a),ee.extend(t,e,a),e.CubeAxesActorHelper=Xa.newCubeAxesActorHelper(),zs(t,e)}var Hs=X(Ks,"vtkOpenGLCubeAxesActor");fe("vtkCubeAxesActor",Hs);var Dn=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkPolyDataVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

attribute vec4 vertexMC;

// frag position in VC
//VTK::PositionVC::Dec

// optional normal declaration
//VTK::Normal::Dec

// extra lighting parameters
//VTK::Light::Dec

// Texture coordinates
//VTK::TCoord::Dec

// material property values
//VTK::Color::Dec

// clipping plane vars
//VTK::Clip::Dec

// camera and actor matrix values
//VTK::Camera::Dec

// Apple Bug
//VTK::PrimID::Dec

// picking support
//VTK::Picking::Dec

void main()
{
  //VTK::Color::Impl

  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Clip::Impl

  //VTK::PrimID::Impl

  //VTK::PositionVC::Impl

  //VTK::Light::Impl

  //VTK::Picking::Impl
}
`,zt=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkPolyDataFS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// Template for the polydata mappers fragment shader

uniform int PrimitiveIDOffset;

// VC position of this fragment
//VTK::PositionVC::Dec

// optional color passed in from the vertex shader, vertexColor
//VTK::Color::Dec

// optional surface normal declaration
//VTK::Normal::Dec

// extra lighting parameters
//VTK::Light::Dec

// define vtkImageLabelOutlineOn
//VTK::ImageLabelOutlineOn

// Texture coordinates
//VTK::TCoord::Dec

// picking support
//VTK::Picking::Dec

// Depth Peeling Support
//VTK::DepthPeeling::Dec

// clipping plane vars
//VTK::Clip::Dec

// label outline 
//VTK::LabelOutline::Dec

// the output of this shader
//VTK::Output::Dec

// Apple Bug
//VTK::PrimID::Dec

// handle coincident offsets
//VTK::Coincident::Dec

//VTK::ZBuffer::Dec

//VTK::LabelOutlineHelperFunction

void main()
{
  // VC position of this fragment. This should not branch/return/discard.
  //VTK::PositionVC::Impl

  // Place any calls that require uniform flow (e.g. dFdx) here.
  //VTK::UniformFlow::Impl

  // Set gl_FragDepth here (gl_FragCoord.z by default)
  //VTK::Depth::Impl

  // Early depth peeling abort:
  //VTK::DepthPeeling::PreColor

  // Apple Bug
  //VTK::PrimID::Impl

  //VTK::Clip::Impl

  //VTK::Color::Impl

  // Generate the normal if we are not passed in one
  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Light::Impl

  if (gl_FragData[0].a <= 0.0)
    {
    discard;
    }

  //VTK::DepthPeeling::Impl

  //VTK::Picking::Impl

  // handle coincident offsets
  //VTK::Coincident::Impl

  //VTK::ZBuffer::Impl

  //VTK::RenderPassFragmentShader::Impl
}
`;function js(t,e,a={}){t.replaceShaderCoincidentOffset=(r,n,s)=>{const i=t.getCoincidentParameters(n,s);if(i&&(i.factor!==0||i.offset!==0)){let o=r.Fragment;o=V.substitute(o,"//VTK::Coincident::Dec",["uniform float cfactor;","uniform float coffset;"]).result,i.factor!==0?(o=V.substitute(o,"//VTK::UniformFlow::Impl",["float cscale = length(vec2(dFdx(gl_FragCoord.z),dFdy(gl_FragCoord.z)));","//VTK::UniformFlow::Impl"],!1).result,o=V.substitute(o,"//VTK::Depth::Impl","gl_FragDepth = gl_FragCoord.z + cfactor*cscale + 0.000016*coffset;").result):o=V.substitute(o,"//VTK::Depth::Impl","gl_FragDepth = gl_FragCoord.z + 0.000016*coffset;").result,r.Fragment=o}}}function qs(t,e,a={}){t.applyShaderReplacements=(r,n,s)=>{let i=null;if(n&&(i=n.ShaderReplacements),i)for(let o=0;o<i.length;o++){const c=i[o];if(s&&c.replaceFirst||!s&&!c.replaceFirst){const u=c.shaderType,p=r[u];r[u]=V.substitute(p,c.originalValue,c.replacementValue,c.replaceAll).result}}},t.buildShaders=(r,n,s)=>{t.getReplacedShaderTemplate(r,n,s),e.lastRenderPassShaderReplacement=e.currentRenderPass?e.currentRenderPass.getShaderReplacement():null,e.lastRenderPassShaderReplacement&&e.lastRenderPassShaderReplacement(r);const i=e.renderable.getViewSpecificProperties().OpenGL;t.applyShaderReplacements(r,i,!0),t.replaceShaderValues(r,n,s),t.applyShaderReplacements(r,i)},t.getReplacedShaderTemplate=(r,n,s)=>{const i=e.renderable.getViewSpecificProperties().OpenGL;t.getShaderTemplate(r,n,s);let o=r.Vertex;if(i){const p=i.VertexShaderCode;p!==void 0&&p!==""&&(o=p)}r.Vertex=o;let c=r.Fragment;if(i){const p=i.FragmentShaderCode;p!==void 0&&p!==""&&(c=p)}r.Fragment=c;let u=r.Geometry;if(i){const p=i.GeometryShaderCode;p!==void 0&&(u=p)}r.Geometry=u}}var $e={implementReplaceShaderCoincidentOffset:js,implementBuildShadersWithReplacements:qs},{FieldAssociations:Qt}=_a,{primTypes:ge}=Pe,{Representation:rt,Shading:ia}=_t,{ScalarMode:Jt}=mt,{Filter:oa,Wrap:sa}=K,{vtkErrorMacro:nt}=me,Ys={type:"StartEvent"},Zs={type:"EndEvent"},{CoordinateSystem:Xs}=kr;function Qs(t){const e=t.getSelector();return e?e.getCurrentPass():Ze.MIN_KNOWN_PASS-1}function Js(t,e){e.classHierarchy.push("vtkOpenGLPolyDataMapper"),t.buildPass=n=>{n&&(e.currentRenderPass=null,e.openGLActor=t.getFirstAncestorOfType("vtkOpenGLActor"),e._openGLRenderer=e.openGLActor.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),e.openGLCamera=e._openGLRenderer.getViewNodeFor(e._openGLRenderer.getRenderable().getActiveCamera(),e.openGLCamera))},t.translucentPass=(n,s)=>{n&&(e.currentRenderPass=s,t.render())},t.zBufferPass=n=>{n&&(e.haveSeenDepthRequest=!0,e.renderDepth=!0,t.render(),e.renderDepth=!1)},t.opaqueZBufferPass=n=>t.zBufferPass(n),t.opaquePass=n=>{n&&t.render()},t.render=()=>{const n=e._openGLRenderWindow.getContext();if(e.context!==n){e.context=n;for(let o=ge.Start;o<ge.End;o++)e.primitives[o].setOpenGLRenderWindow(e._openGLRenderWindow)}const s=e.openGLActor.getRenderable(),i=e._openGLRenderer.getRenderable();t.renderPiece(i,s)},t.getShaderTemplate=(n,s,i)=>{n.Vertex=Dn,n.Fragment=zt,n.Geometry=""},t.replaceShaderColor=(n,s,i)=>{let o=n.Vertex,c=n.Geometry,u=n.Fragment;const p=e.lastBoundBO.getReferenceByName("lastLightComplexity");let l=["uniform float ambient;","uniform float diffuse;","uniform float specular;","uniform float opacityUniform; // the fragment opacity","uniform vec3 ambientColorUniform;","uniform vec3 diffuseColorUniform;"];p&&(l=l.concat(["uniform vec3 specularColorUniform;","uniform float specularPowerUniform;"]));let f=["vec3 ambientColor;","  vec3 diffuseColor;","  float opacity;"];p&&(f=f.concat(["  vec3 specularColor;","  float specularPower;"])),f=f.concat(["  ambientColor = ambientColorUniform;","  diffuseColor = diffuseColorUniform;","  opacity = opacityUniform;"]),p&&(f=f.concat(["  specularColor = specularColorUniform;","  specularPower = specularPowerUniform;"])),e.lastBoundBO.getCABO().getColorComponents()!==0&&!e.drawingEdges&&(l=l.concat(["varying vec4 vertexColorVSOutput;"]),o=V.substitute(o,"//VTK::Color::Dec",["attribute vec4 scalarColor;","varying vec4 vertexColorVSOutput;"]).result,o=V.substitute(o,"//VTK::Color::Impl",["vertexColorVSOutput =  scalarColor;"]).result,c=V.substitute(c,"//VTK::Color::Dec",["in vec4 vertexColorVSOutput[];","out vec4 vertexColorGSOutput;"]).result,c=V.substitute(c,"//VTK::Color::Impl",["vertexColorGSOutput = vertexColorVSOutput[i];"]).result),e.lastBoundBO.getCABO().getColorComponents()!==0&&!e.drawingEdges?u=V.substitute(u,"//VTK::Color::Impl",f.concat(["  diffuseColor = vertexColorVSOutput.rgb;","  ambientColor = vertexColorVSOutput.rgb;","  opacity = opacity*vertexColorVSOutput.a;"])).result:(e.renderable.getAreScalarsMappedFromCells()||e.renderable.getInterpolateScalarsBeforeMapping())&&e.renderable.getColorCoordinates()&&!e.drawingEdges?u=V.substitute(u,"//VTK::Color::Impl",f.concat(["  vec4 texColor = texture2D(texture1, tcoordVCVSOutput.st);","  diffuseColor = texColor.rgb;","  ambientColor = texColor.rgb;","  opacity = opacity*texColor.a;"])).result:(i.getBackfaceProperty()&&!e.drawingEdges&&(l=l.concat(["uniform float opacityUniformBF; // the fragment opacity","uniform float ambientIntensityBF; // the material ambient","uniform float diffuseIntensityBF; // the material diffuse","uniform vec3 ambientColorUniformBF; // ambient material color","uniform vec3 diffuseColorUniformBF; // diffuse material color"]),p?(l=l.concat(["uniform float specularIntensityBF; // the material specular intensity","uniform vec3 specularColorUniformBF; // intensity weighted color","uniform float specularPowerUniformBF;"]),f=f.concat(["if (gl_FrontFacing == false) {","  ambientColor = ambientIntensityBF * ambientColorUniformBF;","  diffuseColor = diffuseIntensityBF * diffuseColorUniformBF;","  specularColor = specularIntensityBF * specularColorUniformBF;","  specularPower = specularPowerUniformBF;","  opacity = opacityUniformBF; }"])):f=f.concat(["if (gl_FrontFacing == false) {","  ambientColor = ambientIntensityBF * ambientColorUniformBF;","  diffuseColor = diffuseIntensityBF * diffuseColorUniformBF;","  opacity = opacityUniformBF; }"])),e.haveCellScalars&&!e.drawingEdges&&(l=l.concat(["uniform samplerBuffer texture1;"])),u=V.substitute(u,"//VTK::Color::Impl",f).result),u=V.substitute(u,"//VTK::Color::Dec",l).result,n.Vertex=o,n.Geometry=c,n.Fragment=u},t.replaceShaderLight=(n,s,i)=>{let o=n.Fragment;const c="",u=e.lastBoundBO.getReferenceByName("lastLightComplexity"),p=e.lastBoundBO.getReferenceByName("lastLightCount");let l=[];switch(u){case 0:o=V.substitute(o,"//VTK::Light::Impl",["  gl_FragData[0] = vec4(ambientColor * ambient + diffuseColor * diffuse, opacity);","  //VTK::Light::Impl"],!1).result;break;case 1:o=V.substitute(o,"//VTK::Light::Impl",["  float df = max(0.0, normalVCVSOutput.z);","  float sf = pow(df, specularPower);","  vec3 diffuseL = df * diffuseColor;","  vec3 specularL = sf * specularColor;","  gl_FragData[0] = vec4(ambientColor * ambient + diffuseL * diffuse + specularL * specular, opacity);","  //VTK::Light::Impl"],!1).result;break;case 2:for(let f=0;f<p;++f)l=l.concat([`uniform vec3 lightColor${f};`,`uniform vec3 lightDirectionVC${f}; // normalized`,`uniform vec3 lightHalfAngleVC${f}; // normalized`]);o=V.substitute(o,"//VTK::Light::Dec",l).result,l=["vec3 diffuseL = vec3(0,0,0);","  vec3 specularL = vec3(0,0,0);","  float df;"];for(let f=0;f<p;++f)l=l.concat([`  df = max(0.0, dot(normalVCVSOutput, -lightDirectionVC${f}));`,`  diffuseL += ((df${c}) * lightColor${f});`,`  if (dot(normalVCVSOutput, lightDirectionVC${f}) < 0.0)`,"    {",`    float sf = sign(df)*pow(max(1e-5,
                                              dot(reflect(lightDirectionVC${f},normalVCVSOutput),
                                                  normalize(-vertexVC.xyz))),
                                         specularPower);`,`    specularL += (sf${c} * lightColor${f});`,"    }"]);l=l.concat(["  diffuseL = diffuseL * diffuseColor;","  specularL = specularL * specularColor;","  gl_FragData[0] = vec4(ambientColor * ambient + diffuseL * diffuse + specularL * specular, opacity);","  //VTK::Light::Impl"]),o=V.substitute(o,"//VTK::Light::Impl",l,!1).result;break;case 3:for(let f=0;f<p;++f)l=l.concat([`uniform vec3 lightColor${f};`,`uniform vec3 lightDirectionVC${f}; // normalized`,`uniform vec3 lightHalfAngleVC${f}; // normalized`,`uniform vec3 lightPositionVC${f};`,`uniform vec3 lightAttenuation${f};`,`uniform float lightConeAngle${f};`,`uniform float lightExponent${f};`,`uniform int lightPositional${f};`]);o=V.substitute(o,"//VTK::Light::Dec",l).result,l=["vec3 diffuseL = vec3(0,0,0);","  vec3 specularL = vec3(0,0,0);","  vec3 vertLightDirectionVC;","  float attenuation;","  float df;"];for(let f=0;f<p;++f)l=l.concat(["  attenuation = 1.0;",`  if (lightPositional${f} == 0)`,"    {",`      vertLightDirectionVC = lightDirectionVC${f};`,"    }","  else","    {",`    vertLightDirectionVC = vertexVC.xyz - lightPositionVC${f};`,"    float distanceVC = length(vertLightDirectionVC);","    vertLightDirectionVC = normalize(vertLightDirectionVC);","    attenuation = 1.0 /",`      (lightAttenuation${f}.x`,`       + lightAttenuation${f}.y * distanceVC`,`       + lightAttenuation${f}.z * distanceVC * distanceVC);`,"    // per OpenGL standard cone angle is 90 or less for a spot light",`    if (lightConeAngle${f} <= 90.0)`,"      {",`      float coneDot = dot(vertLightDirectionVC, lightDirectionVC${f});`,"      // if inside the cone",`      if (coneDot >= cos(radians(lightConeAngle${f})))`,"        {",`        attenuation = attenuation * pow(coneDot, lightExponent${f});`,"        }","      else","        {","        attenuation = 0.0;","        }","      }","    }","    df = max(0.0, attenuation*dot(normalVCVSOutput, -vertLightDirectionVC));",`    diffuseL += ((df${c}) * lightColor${f});`,"    if (dot(normalVCVSOutput, vertLightDirectionVC) < 0.0)","      {",`      float sf = sign(df)*attenuation*pow(max(1e-5,
                                                           dot(reflect(lightDirectionVC${f},
                                                                       normalVCVSOutput),
                                                               normalize(-vertexVC.xyz))),
                                                       specularPower);`,`    specularL += ((sf${c}) * lightColor${f});`,"    }"]);l=l.concat(["  diffuseL = diffuseL * diffuseColor;","  specularL = specularL * specularColor;","  gl_FragData[0] = vec4(ambientColor * ambient + diffuseL * diffuse + specularL * specular, opacity);","  //VTK::Light::Impl"]),o=V.substitute(o,"//VTK::Light::Impl",l,!1).result;break;default:nt("bad light complexity")}n.Fragment=o},t.replaceShaderNormal=(n,s,i)=>{if(e.lastBoundBO.getReferenceByName("lastLightComplexity")>0){let o=n.Vertex,c=n.Geometry,u=n.Fragment;e.lastBoundBO.getCABO().getNormalOffset()?(o=V.substitute(o,"//VTK::Normal::Dec",["attribute vec3 normalMC;","uniform mat3 normalMatrix;","varying vec3 normalVCVSOutput;"]).result,o=V.substitute(o,"//VTK::Normal::Impl",["normalVCVSOutput = normalMatrix * normalMC;"]).result,c=V.substitute(c,"//VTK::Normal::Dec",["in vec3 normalVCVSOutput[];","out vec3 normalVCGSOutput;"]).result,c=V.substitute(c,"//VTK::Normal::Impl",["normalVCGSOutput = normalVCVSOutput[i];"]).result,u=V.substitute(u,"//VTK::Normal::Dec",["varying vec3 normalVCVSOutput;"]).result,u=V.substitute(u,"//VTK::Normal::Impl",["vec3 normalVCVSOutput = normalize(normalVCVSOutput);","  if (gl_FrontFacing == false) { normalVCVSOutput = -normalVCVSOutput; }"]).result):e.haveCellNormals?(u=V.substitute(u,"//VTK::Normal::Dec",["uniform mat3 normalMatrix;","uniform samplerBuffer textureN;"]).result,u=V.substitute(u,"//VTK::Normal::Impl",["vec3 normalVCVSOutput = normalize(normalMatrix *","    texelFetchBuffer(textureN, gl_PrimitiveID + PrimitiveIDOffset).xyz);","  if (gl_FrontFacing == false) { normalVCVSOutput = -normalVCVSOutput; }"]).result):e.lastBoundBO.getOpenGLMode(i.getProperty().getRepresentation())===e.context.LINES?(u=V.substitute(u,"//VTK::UniformFlow::Impl",["  vec3 fdx = dFdx(vertexVC.xyz);","  vec3 fdy = dFdy(vertexVC.xyz);","  //VTK::UniformFlow::Impl"]).result,u=V.substitute(u,"//VTK::Normal::Impl",["vec3 normalVCVSOutput;","  if (abs(fdx.x) > 0.0)","    { fdx = normalize(fdx); normalVCVSOutput = normalize(cross(vec3(fdx.y, -fdx.x, 0.0), fdx)); }","  else { fdy = normalize(fdy); normalVCVSOutput = normalize(cross(vec3(fdy.y, -fdy.x, 0.0), fdy));}"]).result):(u=V.substitute(u,"//VTK::Normal::Dec",["uniform int cameraParallel;"]).result,u=V.substitute(u,"//VTK::UniformFlow::Impl",["  vec3 fdx = dFdx(vertexVC.xyz);","  vec3 fdy = dFdy(vertexVC.xyz);","  //VTK::UniformFlow::Impl"]).result,u=V.substitute(u,"//VTK::Normal::Impl",["  fdx = normalize(fdx);","  fdy = normalize(fdy);","  vec3 normalVCVSOutput = normalize(cross(fdx,fdy));","  if (cameraParallel == 1 && normalVCVSOutput.z < 0.0) { normalVCVSOutput = -1.0*normalVCVSOutput; }","  if (cameraParallel == 0 && dot(normalVCVSOutput,vertexVC.xyz) > 0.0) { normalVCVSOutput = -1.0*normalVCVSOutput; }"]).result),n.Vertex=o,n.Geometry=c,n.Fragment=u}},t.replaceShaderPositionVC=(n,s,i)=>{e.lastBoundBO.replaceShaderPositionVC(n,s,i);let o=n.Vertex,c=n.Geometry,u=n.Fragment;e.lastBoundBO.getReferenceByName("lastLightComplexity")>0?(o=V.substitute(o,"//VTK::PositionVC::Dec",["varying vec4 vertexVCVSOutput;"]).result,o=V.substitute(o,"//VTK::PositionVC::Impl",["vertexVCVSOutput = MCVCMatrix * vertexMC;","  gl_Position = MCPCMatrix * vertexMC;"]).result,o=V.substitute(o,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;","uniform mat4 MCVCMatrix;"]).result,c=V.substitute(c,"//VTK::PositionVC::Dec",["in vec4 vertexVCVSOutput[];","out vec4 vertexVCGSOutput;"]).result,c=V.substitute(c,"//VTK::PositionVC::Impl",["vertexVCGSOutput = vertexVCVSOutput[i];"]).result,u=V.substitute(u,"//VTK::PositionVC::Dec",["varying vec4 vertexVCVSOutput;"]).result,u=V.substitute(u,"//VTK::PositionVC::Impl",["vec4 vertexVC = vertexVCVSOutput;"]).result):(o=V.substitute(o,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;"]).result,o=V.substitute(o,"//VTK::PositionVC::Impl",["  gl_Position = MCPCMatrix * vertexMC;"]).result),n.Vertex=o,n.Geometry=c,n.Fragment=u},t.replaceShaderTCoord=(n,s,i)=>{if(e.lastBoundBO.getCABO().getTCoordOffset()){let o=n.Vertex,c=n.Geometry,u=n.Fragment;if(e.drawingEdges)return;o=V.substitute(o,"//VTK::TCoord::Impl","tcoordVCVSOutput = tcoordMC;").result;const p=e.openGLActor.getActiveTextures();let l=2,f=2;if(p&&p.length>0&&(l=p[0].getComponents(),p[0].getTarget()===e.context.TEXTURE_CUBE_MAP&&(f=3)),e.renderable.getColorTextureMap()&&(l=e.renderable.getColorTextureMap().getPointData().getScalars().getNumberOfComponents(),f=2),f===2){if(o=V.substitute(o,"//VTK::TCoord::Dec","attribute vec2 tcoordMC; varying vec2 tcoordVCVSOutput;").result,c=V.substitute(c,"//VTK::TCoord::Dec",["in vec2 tcoordVCVSOutput[];","out vec2 tcoordVCGSOutput;"]).result,c=V.substitute(c,"//VTK::TCoord::Impl","tcoordVCGSOutput = tcoordVCVSOutput[i];").result,u=V.substitute(u,"//VTK::TCoord::Dec",["varying vec2 tcoordVCVSOutput;","uniform sampler2D texture1;"]).result,p&&p.length>=1)switch(l){case 1:u=V.substitute(u,"//VTK::TCoord::Impl",["  vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);","  ambientColor = ambientColor*tcolor.r;","  diffuseColor = diffuseColor*tcolor.r;"]).result;break;case 2:u=V.substitute(u,"//VTK::TCoord::Impl",["  vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);","  ambientColor = ambientColor*tcolor.r;","  diffuseColor = diffuseColor*tcolor.r;","  opacity = opacity * tcolor.g;"]).result;break;default:u=V.substitute(u,"//VTK::TCoord::Impl",["  vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);","  ambientColor = ambientColor*tcolor.rgb;","  diffuseColor = diffuseColor*tcolor.rgb;","  opacity = opacity * tcolor.a;"]).result}}else switch(o=V.substitute(o,"//VTK::TCoord::Dec","attribute vec3 tcoordMC; varying vec3 tcoordVCVSOutput;").result,c=V.substitute(c,"//VTK::TCoord::Dec",["in vec3 tcoordVCVSOutput[];","out vec3 tcoordVCGSOutput;"]).result,c=V.substitute(c,"//VTK::TCoord::Impl","tcoordVCGSOutput = tcoordVCVSOutput[i];").result,u=V.substitute(u,"//VTK::TCoord::Dec",["varying vec3 tcoordVCVSOutput;","uniform samplerCube texture1;"]).result,l){case 1:u=V.substitute(u,"//VTK::TCoord::Impl",["  vec4 tcolor = textureCube(texture1, tcoordVCVSOutput);","  ambientColor = ambientColor*tcolor.r;","  diffuseColor = diffuseColor*tcolor.r;"]).result;break;case 2:u=V.substitute(u,"//VTK::TCoord::Impl",["  vec4 tcolor = textureCube(texture1, tcoordVCVSOutput);","  ambientColor = ambientColor*tcolor.r;","  diffuseColor = diffuseColor*tcolor.r;","  opacity = opacity * tcolor.g;"]).result;break;default:u=V.substitute(u,"//VTK::TCoord::Impl",["  vec4 tcolor = textureCube(texture1, tcoordVCVSOutput);","  ambientColor = ambientColor*tcolor.rgb;","  diffuseColor = diffuseColor*tcolor.rgb;","  opacity = opacity * tcolor.a;"]).result}n.Vertex=o,n.Geometry=c,n.Fragment=u}},t.replaceShaderClip=(n,s,i)=>{let o=n.Vertex,c=n.Fragment;if(e.renderable.getNumberOfClippingPlanes()){const u=e.renderable.getNumberOfClippingPlanes();o=V.substitute(o,"//VTK::Clip::Dec",["uniform int numClipPlanes;",`uniform vec4 clipPlanes[${u}];`,`varying float clipDistancesVSOutput[${u}];`]).result,o=V.substitute(o,"//VTK::Clip::Impl",[`for (int planeNum = 0; planeNum < ${u}; planeNum++)`,"    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    clipDistancesVSOutput[planeNum] = dot(clipPlanes[planeNum], vertexMC);","    }"]).result,c=V.substitute(c,"//VTK::Clip::Dec",["uniform int numClipPlanes;",`varying float clipDistancesVSOutput[${u}];`]).result,c=V.substitute(c,"//VTK::Clip::Impl",[`for (int planeNum = 0; planeNum < ${u}; planeNum++)`,"    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    if (clipDistancesVSOutput[planeNum] < 0.0) discard;","    }"]).result}n.Vertex=o,n.Fragment=c},t.getCoincidentParameters=(n,s)=>{let i={factor:0,offset:0};const o=s.getProperty();if(e.renderable.getResolveCoincidentTopology()==Vt.PolygonOffset||o.getEdgeVisibility()&&o.getRepresentation()===rt.SURFACE){const u=e.lastBoundBO.getPrimitiveType();u===ge.Points||o.getRepresentation()===rt.POINTS?i=e.renderable.getCoincidentTopologyPointOffsetParameter():u===ge.Lines||o.getRepresentation()===rt.WIREFRAME?i=e.renderable.getCoincidentTopologyLineOffsetParameters():(u===ge.Tris||u===ge.TriStrips)&&(i=e.renderable.getCoincidentTopologyPolygonOffsetParameters()),(u===ge.TrisEdges||u===ge.TriStripsEdges)&&(i=e.renderable.getCoincidentTopologyPolygonOffsetParameters(),i.factor/=2,i.offset/=2)}const c=e._openGLRenderer.getSelector();return c&&c.getFieldAssociation()===Qt.FIELD_ASSOCIATION_POINTS&&(i.offset-=2),i},t.replaceShaderPicking=(n,s,i)=>{let o=n.Fragment,c=n.Vertex;if(o=V.substitute(o,"//VTK::Picking::Dec",["uniform int picking;","//VTK::Picking::Dec"]).result,!!e._openGLRenderer.getSelector()){switch((e.lastSelectionState===Ze.ID_LOW24||e.lastSelectionState===Ze.ID_HIGH24)&&(c=V.substitute(c,"//VTK::Picking::Dec",[`flat out int vertexIDVSOutput;
`,`uniform int VertexIDOffset;
`]).result,c=V.substitute(c,"//VTK::Picking::Impl",`  vertexIDVSOutput = gl_VertexID + VertexIDOffset;
`).result,o=V.substitute(o,"//VTK::Picking::Dec",`flat in int vertexIDVSOutput;
`).result,o=V.substitute(o,"//VTK::Picking::Impl",["  int idx = vertexIDVSOutput;","//VTK::Picking::Impl"]).result),e.lastSelectionState){case Ze.ID_LOW24:o=V.substitute(o,"//VTK::Picking::Impl","  gl_FragData[0] = vec4(float(idx%256)/255.0, float((idx/256)%256)/255.0, float((idx/65536)%256)/255.0, 1.0);").result;break;case Ze.ID_HIGH24:o=V.substitute(o,"//VTK::Picking::Impl","  gl_FragData[0] = vec4(float((idx/16777216)%256)/255.0, 0.0, 0.0, 1.0);").result;break;default:o=V.substitute(o,"//VTK::Picking::Dec","uniform vec3 mapperIndex;").result,o=V.substitute(o,"//VTK::Picking::Impl","  gl_FragData[0] = picking != 0 ? vec4(mapperIndex,1.0) : gl_FragData[0];").result}n.Fragment=o,n.Vertex=c}},t.replaceShaderValues=(n,s,i)=>{if(t.replaceShaderColor(n,s,i),t.replaceShaderNormal(n,s,i),t.replaceShaderLight(n,s,i),t.replaceShaderTCoord(n,s,i),t.replaceShaderPicking(n,s,i),t.replaceShaderClip(n,s,i),t.replaceShaderCoincidentOffset(n,s,i),t.replaceShaderPositionVC(n,s,i),e.haveSeenDepthRequest){let o=n.Fragment;o=V.substitute(o,"//VTK::ZBuffer::Dec","uniform int depthRequest;").result,o=V.substitute(o,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float iz = floor(gl_FragCoord.z*65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result,n.Fragment=o}},t.getNeedToRebuildShaders=(n,s,i)=>{let o=0,c=0;const u=n.getPrimitiveType(),p=e.currentInput;let l=!1;const f=p.getPointData().getNormals(),g=p.getCellData().getNormals(),h=i.getProperty().getInterpolation()===ia.FLAT,d=i.getProperty().getRepresentation(),v=n.getOpenGLMode(d,u);if((v===e.context.TRIANGLES||g&&!f||!h&&f||!h&&v===e.context.LINES)&&(l=!0),i.getProperty().getLighting()&&l){o=0;const m=s.getLightsByReference();for(let w=0;w<m.length;++w){const O=m[w];O.getSwitch()>0&&(c++,o===0&&(o=1)),o===1&&(c>1||O.getIntensity()!==1||!O.lightTypeIsHeadLight())&&(o=2),o<3&&O.getPositional()&&(o=3)}}let x=!1;const C=e.lastBoundBO.getReferenceByName("lastLightComplexity"),T=e.lastBoundBO.getReferenceByName("lastLightCount");return(C!==o||T!==c)&&(e.lastBoundBO.set({lastLightComplexity:o},!0),e.lastBoundBO.set({lastLightCount:c},!0),x=!0),(!e.currentRenderPass&&e.lastRenderPassShaderReplacement||e.currentRenderPass&&e.currentRenderPass.getShaderReplacement()!==e.lastRenderPassShaderReplacement)&&(x=!0),e.lastHaveSeenDepthRequest!==e.haveSeenDepthRequest||n.getShaderSourceTime().getMTime()<e.renderable.getMTime()||n.getShaderSourceTime().getMTime()<e.currentInput.getMTime()||n.getShaderSourceTime().getMTime()<e.selectionStateChanged.getMTime()||x?(e.lastHaveSeenDepthRequest=e.haveSeenDepthRequest,!0):!1},t.invokeShaderCallbacks=(n,s,i)=>{const o=e.renderable.getViewSpecificProperties().ShadersCallbacks;o&&o.forEach(c=>{c.callback(c.userData,n,s,i)})},t.setMapperShaderParameters=(n,s,i)=>{if(n.getProgram().isUniformUsed("PrimitiveIDOffset")&&n.getProgram().setUniformi("PrimitiveIDOffset",e.primitiveIDOffset),n.getProgram().isUniformUsed("VertexIDOffset")&&n.getProgram().setUniformi("VertexIDOffset",e.vertexIDOffset),n.getCABO().getElementCount()&&(e.VBOBuildTime.getMTime()>n.getAttributeUpdateTime().getMTime()||n.getShaderSourceTime().getMTime()>n.getAttributeUpdateTime().getMTime())){const u=e.lastBoundBO.getReferenceByName("lastLightComplexity");n.getProgram().isAttributeUsed("vertexMC")&&(n.getVAO().addAttributeArray(n.getProgram(),n.getCABO(),"vertexMC",n.getCABO().getVertexOffset(),n.getCABO().getStride(),e.context.FLOAT,3,!1)||nt("Error setting vertexMC in shader VAO.")),n.getProgram().isAttributeUsed("normalMC")&&n.getCABO().getNormalOffset()&&u>0?n.getVAO().addAttributeArray(n.getProgram(),n.getCABO(),"normalMC",n.getCABO().getNormalOffset(),n.getCABO().getStride(),e.context.FLOAT,3,!1)||nt("Error setting normalMC in shader VAO."):n.getVAO().removeAttributeArray("normalMC"),e.renderable.getCustomShaderAttributes().forEach((p,l)=>{n.getProgram().isAttributeUsed(`${p}MC`)&&(n.getVAO().addAttributeArray(n.getProgram(),n.getCABO(),`${p}MC`,n.getCABO().getCustomData()[l].offset,n.getCABO().getStride(),e.context.FLOAT,n.getCABO().getCustomData()[l].components,!1)||nt(`Error setting ${p}MC in shader VAO.`))}),n.getProgram().isAttributeUsed("tcoordMC")&&n.getCABO().getTCoordOffset()?n.getVAO().addAttributeArray(n.getProgram(),n.getCABO(),"tcoordMC",n.getCABO().getTCoordOffset(),n.getCABO().getStride(),e.context.FLOAT,n.getCABO().getTCoordComponents(),!1)||nt("Error setting tcoordMC in shader VAO."):n.getVAO().removeAttributeArray("tcoordMC"),n.getProgram().isAttributeUsed("scalarColor")&&n.getCABO().getColorComponents()?n.getVAO().addAttributeArray(n.getProgram(),n.getCABO().getColorBO(),"scalarColor",n.getCABO().getColorOffset(),n.getCABO().getColorBOStride(),e.context.UNSIGNED_BYTE,4,!0)||nt("Error setting scalarColor in shader VAO."):n.getVAO().removeAttributeArray("scalarColor"),n.getAttributeUpdateTime().modified()}if(e.renderable.getNumberOfClippingPlanes()){const u=e.renderable.getNumberOfClippingPlanes(),p=[],l=n.getCABO().getCoordShiftAndScaleEnabled()?n.getCABO().getInverseShiftAndScaleMatrix():null,f=l?Ce(e.tmpMat4,i.getMatrix()):i.getMatrix();l&&(ne(f,f),q(f,f,l),ne(f,f));for(let g=0;g<u;g++){const h=[];e.renderable.getClippingPlaneInDataCoords(f,g,h);for(let d=0;d<4;d++)p.push(h[d])}n.getProgram().setUniformi("numClipPlanes",u),n.getProgram().setUniform4fv("clipPlanes",p)}e.internalColorTexture&&n.getProgram().isUniformUsed("texture1")&&n.getProgram().setUniformi("texture1",e.internalColorTexture.getTextureUnit());const o=e.openGLActor.getActiveTextures();if(o)for(let u=0;u<o.length;++u){const p=o[u].getTextureUnit(),l=`texture${p+1}`;n.getProgram().isUniformUsed(l)&&n.getProgram().setUniformi(l,p)}if(e.haveSeenDepthRequest&&n.getProgram().setUniformi("depthRequest",e.renderDepth?1:0),n.getProgram().isUniformUsed("coffset")){const u=t.getCoincidentParameters(s,i);n.getProgram().setUniformf("coffset",u.offset),n.getProgram().isUniformUsed("cfactor")&&n.getProgram().setUniformf("cfactor",u.factor)}n.setMapperShaderParameters(s,i,e._openGLRenderer.getTiledSizeAndOrigin());const c=e._openGLRenderer.getSelector();n.getProgram().setUniform3fArray("mapperIndex",c?c.getPropColorValue():[0,0,0]),n.getProgram().setUniformi("picking",c?c.getCurrentPass()+1:0)},t.setLightingShaderParameters=(n,s,i)=>{const o=e.lastBoundBO.getReferenceByName("lastLightComplexity");if(o<2)return;const c=n.getProgram();let u=0;const p=s.getLightsByReference();for(let f=0;f<p.length;++f){const g=p[f];if(g.getSwitch()>0){const h=g.getColorByReference(),d=g.getIntensity();e.lightColor[0]=h[0]*d,e.lightColor[1]=h[1]*d,e.lightColor[2]=h[2]*d;const v=g.getDirection(),x=s.getActiveCamera().getViewMatrix(),C=[...v];g.lightTypeIsSceneLight()&&(C[0]=x[0]*v[0]+x[1]*v[1]+x[2]*v[2],C[1]=x[4]*v[0]+x[5]*v[1]+x[6]*v[2],C[2]=x[8]*v[0]+x[9]*v[1]+x[10]*v[2],Gn(C)),e.lightDirection[0]=C[0],e.lightDirection[1]=C[1],e.lightDirection[2]=C[2],Gn(e.lightDirection),c.setUniform3fArray(`lightColor${u}`,e.lightColor),c.setUniform3fArray(`lightDirectionVC${u}`,e.lightDirection),u++}}if(o<3)return;const l=s.getActiveCamera().getViewMatrix();ne(l,l),u=0;for(let f=0;f<p.length;++f){const g=p[f];if(g.getSwitch()>0){const h=g.getTransformedPosition(),d=new Float64Array(3);Te(d,h,l),c.setUniform3fArray(`lightAttenuation${u}`,g.getAttenuationValuesByReference()),c.setUniformi(`lightPositional${u}`,g.getPositional()),c.setUniformf(`lightExponent${u}`,g.getExponent()),c.setUniformf(`lightConeAngle${u}`,g.getConeAngle()),c.setUniform3fArray(`lightPositionVC${u}`,[d[0],d[1],d[2]]),u++}}};function a(n,s,i){return s.identity(i),n.reduce((o,c,u)=>u===0?c?s.copy(o,c):s.identity(o):c?s.multiply(o,o,c):o,i)}t.setCameraShaderParameters=(n,s,i)=>{const o=n.getProgram(),c=e.openGLCamera.getKeyMatrices(s),u=s.getActiveCamera(),p=e.openGLCamera.getKeyMatrixTime().getMTime(),l=o.getLastCameraMTime(),f=n.getCABO().getCoordShiftAndScaleEnabled()?n.getCABO().getInverseShiftAndScaleMatrix():null,g=i.getIsIdentity(),h=g?{mcwc:null,normalMatrix:null}:e.openGLActor.getKeyMatrices();if(i.getCoordinateSystem()===Xs.DISPLAY){const d=e._openGLRenderer.getTiledSizeAndOrigin();Z(e.tmpMat4),e.tmpMat4[0]=2/d.usize,e.tmpMat4[12]=-1,e.tmpMat4[5]=2/d.vsize,e.tmpMat4[13]=-1,q(e.tmpMat4,e.tmpMat4,f),o.setUniformMatrix("MCPCMatrix",e.tmpMat4)}else o.setUniformMatrix("MCPCMatrix",a([c.wcpc,h.mcwc,f],Et,e.tmpMat4));o.isUniformUsed("MCVCMatrix")&&o.setUniformMatrix("MCVCMatrix",a([c.wcvc,h.mcwc,f],Et,e.tmpMat4)),o.isUniformUsed("normalMatrix")&&o.setUniformMatrix3x3("normalMatrix",a([c.normalMatrix,h.normalMatrix],po,e.tmpMat3)),l!==p&&(o.isUniformUsed("cameraParallel")&&o.setUniformi("cameraParallel",u.getParallelProjection()),o.setLastCameraMTime(p)),g||o.setLastCameraMTime(0)},t.setPropertyShaderParameters=(n,s,i)=>{const o=n.getProgram();let c=i.getProperty(),u=e.drawingEdges||c.getRepresentation()===rt.WIREFRAME?c.getEdgeOpacity():c.getOpacity(),p=e.drawingEdges?c.getEdgeColorByReference():c.getAmbientColorByReference(),l=e.drawingEdges?c.getEdgeColorByReference():c.getDiffuseColorByReference(),f=e.drawingEdges?1:c.getAmbient(),g=e.drawingEdges?0:c.getDiffuse(),h=e.drawingEdges?0:c.getSpecular();const d=c.getSpecularPower();o.setUniformf("opacityUniform",u),o.setUniform3fArray("ambientColorUniform",p),o.setUniform3fArray("diffuseColorUniform",l),o.setUniformf("ambient",f),o.setUniformf("diffuse",g);const v=e.lastBoundBO.getReferenceByName("lastLightComplexity");if(v<1)return;let x=c.getSpecularColorByReference();if(o.setUniform3fArray("specularColorUniform",x),o.setUniformf("specularPowerUniform",d),o.setUniformf("specular",h),o.isUniformUsed("ambientIntensityBF")){if(c=i.getBackfaceProperty(),u=c.getOpacity(),p=c.getAmbientColor(),f=c.getAmbient(),l=c.getDiffuseColor(),g=c.getDiffuse(),x=c.getSpecularColor(),h=c.getSpecular(),o.setUniformf("ambientIntensityBF",f),o.setUniformf("diffuseIntensityBF",g),o.setUniformf("opacityUniformBF",u),o.setUniform3fArray("ambientColorUniformBF",p),o.setUniform3fArray("diffuseColorUniformBF",l),v<1)return;o.setUniformf("specularIntensityBF",h),o.setUniform3fArray("specularColorUniformBF",x),o.setUniformf("specularPowerUniformBF",d)}},t.updateMaximumPointCellIds=(n,s)=>{const i=e._openGLRenderer.getSelector();if(i){if(e.selectionWebGLIdsToVTKIds?.points?.length){const o=e.selectionWebGLIdsToVTKIds.points.length;i.setMaximumPointId(o-1)}else e.currentInput&&e.currentInput.getPoints()&&i.setMaximumPointId(e.currentInput.getPoints().getNumberOfPoints()-1);if(e.selectionWebGLIdsToVTKIds?.cells?.length){const o=e.selectionWebGLIdsToVTKIds.cells.length;i.setMaximumCellId(o-1)}i.getFieldAssociation()===Qt.FIELD_ASSOCIATION_POINTS&&(e.pointPicking=!0)}},t.renderPieceStart=(n,s)=>{e.primitiveIDOffset=0,e.vertexIDOffset=0;const i=Qs(e._openGLRenderer);e.lastSelectionState!==i&&(e.selectionStateChanged.modified(),e.lastSelectionState=i),e._openGLRenderer.getSelector()&&e._openGLRenderer.getSelector().renderProp(s),t.updateBufferObjects(n,s),e.renderable.getColorTextureMap()&&e.internalColorTexture.activate(),e.lastBoundBO=null},t.renderPieceDraw=(n,s)=>{const i=s.getProperty().getRepresentation(),o=s.getProperty().getEdgeVisibility()&&i===rt.SURFACE,c=e._openGLRenderer.getSelector(),u=c&&c.getFieldAssociation()===Qt.FIELD_ASSOCIATION_POINTS&&(e.lastSelectionState===Ze.ID_LOW24||e.lastSelectionState===Ze.ID_HIGH24);for(let p=ge.Start;p<ge.End;p++){e.primitives[p].setPointPicking(u);const l=e.primitives[p].getCABO();l.getElementCount()&&(e.drawingEdges=o&&(p===ge.TrisEdges||p===ge.TriStripsEdges),(!e.drawingEdges||!(e.renderDepth||e.lastSelectionState>=0))&&(e.lastBoundBO=e.primitives[p],e.primitiveIDOffset+=e.primitives[p].drawArrays(n,s,i,t),l.getIndexed()||(e.vertexIDOffset+=l.getElementCount())))}},t.renderPieceFinish=(n,s)=>{e.LastBoundBO&&e.LastBoundBO.getVAO().release(),e.renderable.getColorTextureMap()&&e.internalColorTexture.deactivate()},t.renderPiece=(n,s)=>{if(t.invokeEvent(Ys),e.renderable.getStatic()||e.renderable.update(),e.currentInput=e.renderable.getInputData(),t.invokeEvent(Zs),!e.currentInput){nt("No input!");return}if(!e.currentInput.getPoints||!e.currentInput.getPoints().getNumberOfValues())return;const i=e.context,o=s.getProperty().getBackfaceCulling(),c=s.getProperty().getFrontfaceCulling();!o&&!c?e._openGLRenderWindow.disableCullFace():c?(e._openGLRenderWindow.enableCullFace(),e._openGLRenderWindow.setCullFaceMode(i.FRONT)):(e._openGLRenderWindow.enableCullFace(),e._openGLRenderWindow.setCullFaceMode(i.BACK)),t.renderPieceStart(n,s),t.renderPieceDraw(n,s),t.renderPieceFinish(n,s)},t.updateBufferObjects=(n,s)=>{t.getNeedToRebuildBufferObjects(n,s)&&t.buildBufferObjects(n,s),t.updateMaximumPointCellIds()};function r(){const n=e._openGLRenderer?e._openGLRenderer.getSelector():null;return!!n&&e.renderable.getPopulateSelectionSettings()&&n.getFieldAssociation()===Qt.FIELD_ASSOCIATION_CELLS}t.getNeedToRebuildBufferObjects=(n,s)=>{const i=e.VBOBuildTime.getMTime();return i<t.getMTime()||i<e.renderable.getMTime()||i<s.getMTime()||i<e.currentInput.getMTime()||r()!==e.lastForceFlatten},t.buildBufferObjects=(n,s)=>{const i=e.currentInput;if(i===null)return;e.renderable.mapScalars(i,1);const o=e.renderable.getColorMapColors();e.haveCellScalars=!1;const c=e.renderable.getScalarMode();e.renderable.getScalarVisibility()&&(c===Jt.USE_CELL_DATA||c===Jt.USE_CELL_FIELD_DATA||c===Jt.USE_FIELD_DATA||!i.getPointData().getScalars())&&c!==Jt.USE_POINT_FIELD_DATA&&o&&(e.haveCellScalars=!0);let u=s.getProperty().getInterpolation()!==ia.FLAT?i.getPointData().getNormals():null;u===null&&i.getCellData().getNormals()&&(e.haveCellNormals=!0,u=i.getCellData().getNormals());const p=s.getProperty().getRepresentation();let l=i.getPointData().getTCoords();e.openGLActor.getActiveTextures()||(l=null);let f=!1;if(e.renderable.getColorCoordinates()){l=e.renderable.getColorCoordinates(),f=e.renderable.getAreScalarsMappedFromCells(),e.internalColorTexture||(e.internalColorTexture=K.newInstance({resizable:!0}));const v=e.internalColorTexture;v.setMinificationFilter(oa.NEAREST),v.setMagnificationFilter(oa.NEAREST),v.setWrapS(sa.CLAMP_TO_EDGE),v.setWrapT(sa.CLAMP_TO_EDGE),v.setOpenGLRenderWindow(e._openGLRenderWindow);const x=e.renderable.getColorTextureMap(),C=x.getExtent(),T=x.getPointData().getScalars();v.create2DFromRaw({width:C[1]-C[0]+1,height:C[3]-C[2]+1,numComps:T.getNumberOfComponents(),dataType:T.getDataType(),data:T.getData()}),v.activate(),v.sendParameters(),v.deactivate()}const g=e.renderable.getCustomShaderAttributes().map(v=>i.getPointData().getArrayByName(v)),h=r();e.lastForceFlatten=h;const d=`${i.getMTime()}A${p}B${i.getMTime()}C${u?u.getMTime():1}D${o?o.getMTime():1}E${s.getProperty().getEdgeVisibility()}F${l?l.getMTime():1}G${g.map(v=>v.getMTime()).join(",")}H${h}`;if(e.VBOBuildString!==d){const v={points:i.getPoints(),normals:u,tcoords:l,colors:o,cellOffset:0,vertexOffset:0,useTCoordsPerCell:f,haveCellScalars:e.haveCellScalars,haveCellNormals:e.haveCellNormals,customAttributes:g,forceFlatten:h};h?e.selectionWebGLIdsToVTKIds={points:null,cells:null}:e.selectionWebGLIdsToVTKIds=null;const x=[{inRep:"verts",cells:i.getVerts()},{inRep:"lines",cells:i.getLines()},{inRep:"polys",cells:i.getPolys()},{inRep:"strips",cells:i.getStrips()},{inRep:"polys",cells:i.getPolys()},{inRep:"strips",cells:i.getStrips()}],C=s.getProperty().getEdgeVisibility()&&p===rt.SURFACE;for(let T=ge.Start;T<ge.End;T++)T!==ge.TrisEdges&&T!==ge.TriStripsEdges?(v.cellOffset+=e.primitives[T].getCABO().createVBO(x[T].cells,x[T].inRep,p,v,e.selectionWebGLIdsToVTKIds),v.vertexOffset+=e.primitives[T].getCABO().getElementCount()):C?e.primitives[T].getCABO().createVBO(x[T].cells,x[T].inRep,rt.WIREFRAME,{...v,tcoords:null,colors:null,haveCellScalars:!1,haveCellNormals:!1}):e.primitives[T].releaseGraphicsResources();e.renderable.getPopulateSelectionSettings()&&e.renderable.setSelectionWebGLIdsToVTKIds(e.selectionWebGLIdsToVTKIds),e.VBOBuildString=d}e.VBOBuildTime.modified()},t.getAllocatedGPUMemoryInBytes=()=>{let n=0;return e.primitives.forEach(s=>{n+=s.getAllocatedGPUMemoryInBytes()}),n}}var ec={context:null,VBOBuildTime:0,VBOBuildString:null,primitives:null,primTypes:null,shaderRebuildString:null,tmpMat4:null,ambientColor:[],diffuseColor:[],specularColor:[],lightColor:[],lightDirection:[],lastHaveSeenDepthRequest:!1,haveSeenDepthRequest:!1,lastSelectionState:Ze.MIN_KNOWN_PASS-1,selectionStateChanged:null,selectionWebGLIdsToVTKIds:null,pointPicking:!1,lastForceFlatten:!1};function Qa(t,e,a={}){Object.assign(e,ec,a),ee.extend(t,e,a),$e.implementReplaceShaderCoincidentOffset(t,e,a),$e.implementBuildShadersWithReplacements(t,e,a),e.primitives=[],e.primTypes=ge,e.tmpMat3=We(new Float64Array(9)),e.tmpMat4=Z(new Float64Array(16));for(let r=ge.Start;r<ge.End;r++)e.primitives[r]=Pe.newInstance(),e.primitives[r].setPrimitiveType(r),e.primitives[r].set({lastLightComplexity:0,lastLightCount:0,lastSelectionPass:!1},!0);ye(t,e,["context"]),e.VBOBuildTime={},de(e.VBOBuildTime,{mtime:0}),e.selectionStateChanged={},de(e.selectionStateChanged,{mtime:0}),Js(t,e)}var Ja=X(Qa,"vtkOpenGLPolyDataMapper"),Er={newInstance:Ja,extend:Qa};fe("vtkMapper",Ja);var{vtkErrorMacro:Bt}=me,{Representation:tc}=_t,{ObjectType:er}=st,rc={type:"StartEvent"},nc={type:"EndEvent"},ac=64,ic=16;function oc(t,e){e.classHierarchy.push("vtkOpenGLGlyph3DMapper");const a={...t};t.renderPiece=(r,n)=>{if(t.invokeEvent(rc),e.renderable.getStatic()||e.renderable.update(),e.currentInput=e.renderable.getInputData(1),t.invokeEvent(nc),!e.currentInput){Bt("No input!");return}if(!e.currentInput.getPoints||!e.currentInput.getPoints().getNumberOfValues())return;const s=e.context,i=n.getProperty().getBackfaceCulling(),o=n.getProperty().getFrontfaceCulling();!i&&!o?e._openGLRenderWindow.disableCullFace():o?(e._openGLRenderWindow.enableCullFace(),e._openGLRenderWindow.setCullFaceMode(s.FRONT)):(e._openGLRenderWindow.enableCullFace(),e._openGLRenderWindow.setCullFaceMode(s.BACK)),t.renderPieceStart(r,n),t.renderPieceDraw(r,n),t.renderPieceFinish(r,n)},t.replaceShaderNormal=(r,n,s)=>{if(e.lastBoundBO.getReferenceByName("lastLightComplexity")>0){let i=r.Vertex;e.lastBoundBO.getCABO().getNormalOffset()&&(i=V.substitute(i,"//VTK::Normal::Dec",["attribute vec3 normalMC;","attribute mat3 gNormal;","uniform mat3 normalMatrix;","varying vec3 normalVCVSOutput;"]).result,i=V.substitute(i,"//VTK::Normal::Impl",["normalVCVSOutput = normalMatrix * gNormal * normalMC;"]).result),r.Vertex=i}a.replaceShaderNormal(r,n,s)},t.replaceShaderClip=(r,n,s)=>{let i=r.Vertex,o=r.Fragment;if(e.renderable.getNumberOfClippingPlanes()){const c=e.renderable.getNumberOfClippingPlanes();i=V.substitute(i,"//VTK::Clip::Dec",["uniform int numClipPlanes;",`uniform vec4 clipPlanes[${c}];`,`varying float clipDistancesVSOutput[${c}];`]).result,i=V.substitute(i,"//VTK::Clip::Impl",[`for (int planeNum = 0; planeNum < ${c}; planeNum++)`,"    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    vec4 gVertex = gMatrix * vertexMC;","    clipDistancesVSOutput[planeNum] = dot(clipPlanes[planeNum], gVertex);","    }"]).result,o=V.substitute(o,"//VTK::Clip::Dec",["uniform int numClipPlanes;",`varying float clipDistancesVSOutput[${c}];`]).result,o=V.substitute(o,"//VTK::Clip::Impl",[`for (int planeNum = 0; planeNum < ${c}; planeNum++)`,"    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    if (clipDistancesVSOutput[planeNum] < 0.0) discard;","    }"]).result}r.Vertex=i,r.Fragment=o,a.replaceShaderClip(r,n,s)},t.replaceShaderColor=(r,n,s)=>{if(e.renderable.getColorArray()){let i=r.Vertex,o=r.Geometry,c=r.Fragment;const u=e.lastBoundBO.getReferenceByName("lastLightComplexity");let p=["uniform float ambient;","uniform float diffuse;","uniform float specular;","uniform float opacityUniform; // the fragment opacity"];u&&(p=p.concat(["uniform vec3 specularColorUniform;","uniform float specularPowerUniform;"]));let l=["vec3 ambientColor;","  vec3 diffuseColor;","  float opacity;"];u&&(l=l.concat(["  vec3 specularColor;","  float specularPower;"])),l=l.concat(["  opacity = opacityUniform;"]),u&&(l=l.concat(["  specularColor = specularColorUniform;","  specularPower = specularPowerUniform;"])),e.drawingEdges||(p=p.concat(["varying vec4 vertexColorVSOutput;"]),i=V.substitute(i,"//VTK::Color::Dec",["attribute vec4 gColor;","varying vec4 vertexColorVSOutput;"]).result,i=V.substitute(i,"//VTK::Color::Impl",["vertexColorVSOutput = gColor;"]).result,o=V.substitute(o,"//VTK::Color::Dec",["in vec4 vertexColorVSOutput[];","out vec4 vertexColorGSOutput;"]).result,o=V.substitute(o,"//VTK::Color::Impl",["vertexColorGSOutput = vertexColorVSOutput[i];"]).result,l=l.concat(["  diffuseColor = vertexColorVSOutput.rgb;","  ambientColor = vertexColorVSOutput.rgb;","  opacity = opacity*vertexColorVSOutput.a;"])),c=V.substitute(c,"//VTK::Color::Impl",l).result,c=V.substitute(c,"//VTK::Color::Dec",p).result,r.Vertex=i,r.Geometry=o,r.Fragment=c}a.replaceShaderColor(r,n,s)},t.replaceShaderPositionVC=(r,n,s)=>{let i=r.Vertex;e.lastBoundBO.getReferenceByName("lastLightComplexity")>0?(i=V.substitute(i,"//VTK::PositionVC::Impl",["vec4 gVertexMC = gMatrix * vertexMC;","vertexVCVSOutput = MCVCMatrix * gVertexMC;","  gl_Position = MCPCMatrix * gVertexMC;"]).result,i=V.substitute(i,"//VTK::Camera::Dec",["attribute mat4 gMatrix;","uniform mat4 MCPCMatrix;","uniform mat4 MCVCMatrix;"]).result):(i=V.substitute(i,"//VTK::Camera::Dec",["attribute mat4 gMatrix;","uniform mat4 MCPCMatrix;"]).result,i=V.substitute(i,"//VTK::PositionVC::Impl",["vec4 gVertexMC = gMatrix * vertexMC;","  gl_Position = MCPCMatrix * gVertexMC;"]).result),r.Vertex=i,a.replaceShaderPositionVC(r,n,s)},t.replaceShaderPicking=(r,n,s)=>{let i=r.Fragment,o=r.Vertex;o=V.substitute(o,"//VTK::Picking::Dec",["attribute vec3 mapperIndexVS;","varying vec3 mapperIndexVSOutput;"]).result,o=V.substitute(o,"//VTK::Picking::Impl","  mapperIndexVSOutput = mapperIndexVS;").result,r.Vertex=o,i=V.substitute(i,"//VTK::Picking::Dec",["varying vec3 mapperIndexVSOutput;","uniform vec3 mapperIndex;","uniform int picking;"]).result,i=V.substitute(i,"//VTK::Picking::Impl",["  vec4 pickColor = picking == 2 ? vec4(mapperIndexVSOutput,1.0) : vec4(mapperIndex,1.0);","  gl_FragData[0] = picking != 0 ? pickColor : gl_FragData[0];"]).result,r.Fragment=i},t.renderPieceDraw=(r,n)=>{const s=n.getProperty().getRepresentation(),i=e.context,o=n.getProperty().getEdgeVisibility()&&s===tc.SURFACE,c=e.renderable.getMatrixArray().length/16;for(let u=e.primTypes.Start;u<e.primTypes.End;u++){const p=e.primitives[u].getCABO();if(p.getElementCount()){e.drawingEdges=o&&(u===e.primTypes.TrisEdges||u===e.primTypes.TriStripsEdges),e.lastBoundBO=e.primitives[u],e.primitives[u].updateShaders(r,n,t);const l=e.primitives[u].getOpenGLMode(s);p.getIndexed()?(p.getIndexBO().bind(),i.drawElementsInstanced(l,p.getElementCount(),p.getIndexElementType(),0,c)):i.drawArraysInstanced(l,0,p.getElementCount(),c)}}},t.setMapperShaderParameters=(r,n,s)=>{if(r.getCABO().getElementCount()&&(e.glyphBOBuildTime.getMTime()>r.getAttributeUpdateTime().getMTime()||r.getShaderSourceTime().getMTime()>r.getAttributeUpdateTime().getMTime())){r.getProgram().isAttributeUsed("gMatrix")?r.getVAO().addAttributeMatrixWithDivisor(r.getProgram(),e.matrixBuffer,"gMatrix",0,64,e.context.FLOAT,4,!1,1)||Bt("Error setting gMatrix in shader VAO."):r.getVAO().removeAttributeArray("gMatrix"),r.getProgram().isAttributeUsed("gNormal")?r.getVAO().addAttributeMatrixWithDivisor(r.getProgram(),e.normalBuffer,"gNormal",0,36,e.context.FLOAT,3,!1,1)||Bt("Error setting gNormal in shader VAO."):r.getVAO().removeAttributeArray("gNormal"),r.getProgram().isAttributeUsed("gColor")?r.getVAO().addAttributeArrayWithDivisor(r.getProgram(),e.colorBuffer,"gColor",0,4,e.context.UNSIGNED_BYTE,4,!0,1,!1)||Bt("Error setting gColor in shader VAO."):r.getVAO().removeAttributeArray("gColor"),r.getProgram().isAttributeUsed("mapperIndexVS")?r.getVAO().addAttributeArrayWithDivisor(r.getProgram(),e.pickBuffer,"mapperIndexVS",0,4,e.context.UNSIGNED_BYTE,4,!0,1,!1)||Bt("Error setting mapperIndexVS in shader VAO."):r.getVAO().removeAttributeArray("mapperIndexVS"),a.setMapperShaderParameters(r,n,s),r.getAttributeUpdateTime().modified();return}a.setMapperShaderParameters(r,n,s)},t.getNeedToRebuildBufferObjects=(r,n)=>(e.renderable.buildArrays(),e.VBOBuildTime.getMTime()<e.renderable.getBuildTime().getMTime()?!0:a.getNeedToRebuildBufferObjects(r,n)),t.getNeedToRebuildShaders=(r,n,s)=>!!(a.getNeedToRebuildShaders(r,n,s)||r.getShaderSourceTime().getMTime()<e.renderable.getMTime()||r.getShaderSourceTime().getMTime()<e.currentInput.getMTime()),t.buildBufferObjects=(r,n)=>{const s=e.renderable.getMatrixArray(),{useShiftAndScale:i,coordShift:o,coordScale:c}=ka(e.renderable.getInputData(0).getPoints()),u=e.renderable.getNormalArray(),p=e.renderable.getColorArray();if(e.matrixBuffer||(e.matrixBuffer=st.newInstance(),e.matrixBuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.normalBuffer=st.newInstance(),e.normalBuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.colorBuffer=st.newInstance(),e.colorBuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.pickBuffer=st.newInstance(),e.pickBuffer.setOpenGLRenderWindow(e._openGLRenderWindow)),i){const l=s.buffer,f=Wi(o,c);Se(f,f);for(let g=0;g<s.byteLength;g+=ac){const h=new Float32Array(l,g,ic);q(h,f,h)}}if(e.renderable.getBuildTime().getMTime()>e.glyphBOBuildTime.getMTime()){e.matrixBuffer.upload(s,er.ARRAY_BUFFER),e.normalBuffer.upload(u,er.ARRAY_BUFFER),p?e.colorBuffer.upload(p.getData(),er.ARRAY_BUFFER):e.colorBuffer.releaseGraphicsResources();const l=s.length/16,f=new Uint8Array(4*l);for(let g=0;g<l;++g){let h=g+1;const d=g*4;f[d]=h%256,h-=f[d],h/=256,f[d+1]=h%256,h-=f[d+1],h/=256,f[d+2]=h%256,f[d+3]=255}e.pickBuffer.upload(f,er.ARRAY_BUFFER),e.glyphBOBuildTime.modified()}a.buildBufferObjects(r,n);for(let l=In.Start;l<In.End;l++)e.primitives[l].getCABO().setCoordShiftAndScale(i?o:null,i?c:null)}}var sc={};function cc(t,e,a={}){Object.assign(e,sc,a),Er.extend(t,e,a),e.glyphBOBuildTime={},de(e.glyphBOBuildTime,{mtime:0}),oc(t,e)}var uc=X(cc,"vtkOpenGLGlyph3DMapper");fe("vtkGlyph3DMapper",uc);function Qe(t,e,a){return t.length>0?`${t.map(r=>r?.getMTime()??"x").join("/")}-${e}-${a}`:"0"}function Ln(t,e){return`${e.getMTime()}`}var{vtkErrorMacro:gt}=me,{SlicingMode:be}=Wa;function lc(t){const e=t.split(`
`),a=[];for(let r=0;r<e.length;++r){const n=e[r].trim();n.length>0&&a.push(n)}return a}function fc(t,e){e.classHierarchy.push("vtkOpenGLImageMapper");function a(r){e.openGLTexture.releaseGraphicsResources(r),[e._colorTransferFunc,e._pwFunc,e._labelOutlineThicknessArray,e._labelOutlineOpacity].forEach(n=>r.unregisterGraphicsResourceUser(n,t))}t.buildPass=r=>{if(r){e.currentRenderPass=null,e.openGLImageSlice=t.getFirstAncestorOfType("vtkOpenGLImageSlice"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");const n=e._openGLRenderWindow;e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),n&&!n.isDeleted()&&n!==e._openGLRenderWindow&&a(n),e.context=e._openGLRenderWindow.getContext(),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow);const s=e._openGLRenderer.getRenderable();e.openGLCamera=e._openGLRenderer.getViewNodeFor(s.getActiveCamera(),e.openGLCamera),e.renderable.isA("vtkImageMapper")&&e.renderable.getSliceAtFocalPoint()&&e.renderable.setSliceFromCamera(s.getActiveCamera())}},t.translucentPass=(r,n)=>{r&&(e.currentRenderPass=n,t.render())},t.zBufferPass=r=>{r&&(e.haveSeenDepthRequest=!0,e.renderDepth=!0,t.render(),e.renderDepth=!1)},t.opaqueZBufferPass=r=>t.zBufferPass(r),t.opaquePass=r=>{r&&t.render()},t.getCoincidentParameters=(r,n)=>e.renderable.getResolveCoincidentTopology()==Vt.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.render=()=>{const r=e.openGLImageSlice.getRenderable(),n=e._openGLRenderer.getRenderable();t.renderPiece(n,r)},t.getShaderTemplate=(r,n,s)=>{r.Vertex=Dn,r.Fragment=zt,r.Geometry=""},t.replaceShaderValues=(r,n,s)=>{let i=r.Vertex,o=r.Fragment;i=V.substitute(i,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;"]).result,i=V.substitute(i,"//VTK::PositionVC::Impl",["  gl_Position = MCPCMatrix * vertexMC;"]).result,i=V.substitute(i,"//VTK::TCoord::Impl","tcoordVCVSOutput = tcoordMC;").result,i=V.substitute(i,"//VTK::TCoord::Dec","attribute vec2 tcoordMC; varying vec2 tcoordVCVSOutput;").result;const c=e.openGLTexture.getComponents(),u=s.getProperty().getIndependentComponents();let p=["varying vec2 tcoordVCVSOutput;","uniform float cshift0;","uniform float cscale0;","uniform float pwfshift0;","uniform float pwfscale0;","uniform sampler2D texture1;","uniform sampler2D colorTexture1;","uniform sampler2D pwfTexture1;","uniform float opacity;"];if(s.getProperty().getUseLabelOutline()&&(p=p.concat(["uniform sampler2D labelOutlineTexture1;","uniform sampler2D labelOutlineOpacityTexture1;"])),u){for(let l=1;l<c;l++)p=p.concat([`uniform float cshift${l};`,`uniform float cscale${l};`,`uniform float pwfshift${l};`,`uniform float pwfscale${l};`]);switch(c){case 1:p=p.concat(["uniform float mix0;","#define height0 0.5"]);break;case 2:p=p.concat(["uniform float mix0;","uniform float mix1;","#define height0 0.25","#define height1 0.75"]);break;case 3:p=p.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","#define height0 0.17","#define height1 0.5","#define height2 0.83"]);break;case 4:p=p.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","uniform float mix3;","#define height0 0.125","#define height1 0.375","#define height2 0.625","#define height3 0.875"]);break;default:gt("Unsupported number of independent coordinates.")}}if(o=V.substitute(o,"//VTK::TCoord::Dec",p).result,s.getProperty().getUseLabelOutline()===!0&&(o=V.substitute(o,"//VTK::LabelOutline::Dec",["uniform float vpWidth;","uniform float vpHeight;","uniform float vpOffsetX;","uniform float vpOffsetY;","uniform mat4 PCWCMatrix;","uniform mat4 vWCtoIDX;","uniform ivec3 imageDimensions;","uniform int sliceAxis;"]).result,o=V.substitute(o,"//VTK::ImageLabelOutlineOn","#define vtkImageLabelOutlineOn").result,o=V.substitute(o,"//VTK::LabelOutlineHelperFunction",["#ifdef vtkImageLabelOutlineOn","vec3 fragCoordToIndexSpace(vec4 fragCoord) {","  vec4 pcPos = vec4(","    (fragCoord.x / vpWidth - vpOffsetX - 0.5) * 2.0,","    (fragCoord.y / vpHeight - vpOffsetY - 0.5) * 2.0,","    (fragCoord.z - 0.5) * 2.0,","    1.0);","","  vec4 worldCoord = PCWCMatrix * pcPos;","  vec4 vertex = (worldCoord/worldCoord.w);","","  vec3 index = (vWCtoIDX * vertex).xyz;","","  // half voxel fix for labelmapOutline","  return (index + vec3(0.5)) / vec3(imageDimensions);","}","vec2 getSliceCoords(vec3 coord, int axis) {","  if (axis == 0) return coord.yz;","  if (axis == 1) return coord.xz;","  if (axis == 2) return coord.xy;","}","#endif"]).result),u){const l=["r","g","b","a"];let f=["vec4 tvalue = texture2D(texture1, tcoordVCVSOutput);"];for(let g=0;g<c;g++)f=f.concat([`vec3 tcolor${g} = mix${g} * texture2D(colorTexture1, vec2(tvalue.${l[g]} * cscale${g} + cshift${g}, height${g})).rgb;`,`float compWeight${g} = mix${g} * texture2D(pwfTexture1, vec2(tvalue.${l[g]} * pwfscale${g} + pwfshift${g}, height${g})).r;`]);switch(c){case 1:f=f.concat(["gl_FragData[0] = vec4(tcolor0.rgb, opacity);"]);break;case 2:f=f.concat(["float weightSum = compWeight0 + compWeight1;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum))), opacity);"]);break;case 3:f=f.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum))), opacity);"]);break;case 4:f=f.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2 + compWeight3;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum)) + (tcolor3.rgb * (compWeight3 / weightSum))), opacity);"]);break;default:gt("Unsupported number of independent coordinates.")}o=V.substitute(o,"//VTK::TCoord::Impl",f).result}else switch(c){case 1:o=V.substitute(o,"//VTK::TCoord::Impl",[...lc(`
                #ifdef vtkImageLabelOutlineOn
                  vec3 centerPosIS = fragCoordToIndexSpace(gl_FragCoord);
                  float centerValue = texture2D(texture1, getSliceCoords(centerPosIS, sliceAxis)).r;
                  bool pixelOnBorder = false;
                  vec3 tColor = texture2D(colorTexture1, vec2(centerValue * cscale0 + cshift0, 0.5)).rgb;
                  float scalarOpacity = texture2D(pwfTexture1, vec2(centerValue * pwfscale0 + pwfshift0, 0.5)).r;
                  float opacityToUse = scalarOpacity * opacity;
                  int segmentIndex = int(centerValue * 255.0);
                  float textureCoordinate = float(segmentIndex - 1) / 1024.0;
                  float textureValue = texture2D(labelOutlineTexture1, vec2(textureCoordinate, 0.5)).r;
                  float outlineOpacity = texture2D(labelOutlineOpacityTexture1, vec2(textureCoordinate, 0.5)).r;
                  int actualThickness = int(textureValue * 255.0);

                  if (segmentIndex == 0){
                    gl_FragData[0] = vec4(0.0, 0.0, 0.0, 0.0);
                    return;
                  }

                  for (int i = -actualThickness; i <= actualThickness; i++) {
                    for (int j = -actualThickness; j <= actualThickness; j++) {
                      if (i == 0 && j == 0) {
                        continue;
                      }
                      vec4 neighborPixelCoord = vec4(gl_FragCoord.x + float(i),
                        gl_FragCoord.y + float(j),
                        gl_FragCoord.z, gl_FragCoord.w);
                      vec3 neighborPosIS = fragCoordToIndexSpace(neighborPixelCoord);
                      float value = texture2D(texture1, getSliceCoords(neighborPosIS, sliceAxis)).r;
                      if (value != centerValue) {
                        pixelOnBorder = true;
                        break;
                      }
                    }
                    if (pixelOnBorder == true) {
                      break;
                    }
                  }
                  if (pixelOnBorder == true) {
                    gl_FragData[0] = vec4(tColor, outlineOpacity);
                  }
                  else {
                    gl_FragData[0] = vec4(tColor, opacityToUse);
                  }
                #else
                  float intensity = texture2D(texture1, tcoordVCVSOutput).r;
                  vec3 tcolor = texture2D(colorTexture1, vec2(intensity * cscale0 + cshift0, 0.5)).rgb;
                  float scalarOpacity = texture2D(pwfTexture1, vec2(intensity * pwfscale0 + pwfshift0, 0.5)).r;
                  gl_FragData[0] = vec4(tcolor, scalarOpacity * opacity);
                #endif
                `)]).result;break;case 2:o=V.substitute(o,"//VTK::TCoord::Impl",["vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);","float intensity = tcolor.r*cscale0 + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(intensity, 0.5)).rgb, pwfscale0*tcolor.g + pwfshift0);"]).result;break;case 3:o=V.substitute(o,"//VTK::TCoord::Impl",["vec4 tcolor = cscale0*texture2D(texture1, tcoordVCVSOutput.st) + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, opacity);"]).result;break;default:o=V.substitute(o,"//VTK::TCoord::Impl",["vec4 tcolor = cscale0*texture2D(texture1, tcoordVCVSOutput.st) + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, tcolor.a);"]).result}e.haveSeenDepthRequest&&(o=V.substitute(o,"//VTK::ZBuffer::Dec","uniform int depthRequest;").result,o=V.substitute(o,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float iz = floor(gl_FragCoord.z*65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result),r.Vertex=i,r.Fragment=o,t.replaceShaderClip(r,n,s),t.replaceShaderCoincidentOffset(r,n,s)},t.replaceShaderClip=(r,n,s)=>{let i=r.Vertex,o=r.Fragment;if(e.renderable.getNumberOfClippingPlanes()){let c=e.renderable.getNumberOfClippingPlanes();c>6&&(un("OpenGL has a limit of 6 clipping planes"),c=6),i=V.substitute(i,"//VTK::Clip::Dec",["uniform int numClipPlanes;","uniform vec4 clipPlanes[6];","varying float clipDistancesVSOutput[6];"]).result,i=V.substitute(i,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    clipDistancesVSOutput[planeNum] = dot(clipPlanes[planeNum], vertexMC);","    }"]).result,o=V.substitute(o,"//VTK::Clip::Dec",["uniform int numClipPlanes;","varying float clipDistancesVSOutput[6];"]).result,o=V.substitute(o,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    if (clipDistancesVSOutput[planeNum] < 0.0) discard;","    }"]).result}r.Vertex=i,r.Fragment=o},t.getNeedToRebuildShaders=(r,n,s)=>{const i=e.openGLTexture.getComponents(),o=s.getProperty().getIndependentComponents();let c=!1;return(!e.currentRenderPass&&e.lastRenderPassShaderReplacement||e.currentRenderPass&&e.currentRenderPass.getShaderReplacement()!==e.lastRenderPassShaderReplacement)&&(c=!0),c||e.lastHaveSeenDepthRequest!==e.haveSeenDepthRequest||r.getProgram()?.getHandle()===0||r.getShaderSourceTime().getMTime()<e.renderable.getMTime()||r.getShaderSourceTime().getMTime()<e.currentInput.getMTime()||r.getShaderSourceTime().getMTime()<s.getProperty().getMTime()||e.lastTextureComponents!==i||e.lastIndependentComponents!==o?(e.lastHaveSeenDepthRequest=e.haveSeenDepthRequest,e.lastTextureComponents=i,e.lastIndependentComponents=o,!0):!1},t.updateShaders=(r,n,s)=>{if(e.lastBoundBO=r,t.getNeedToRebuildShaders(r,n,s)){const i={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(i,n,s);const o=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(i.Vertex,i.Fragment,i.Geometry);o!==r.getProgram()&&(r.setProgram(o),r.getVAO().releaseGraphicsResources()),r.getShaderSourceTime().modified()}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(r.getProgram());r.getVAO().bind(),t.setMapperShaderParameters(r,n,s),t.setCameraShaderParameters(r,n,s),t.setPropertyShaderParameters(r,n,s)},t.setMapperShaderParameters=(r,n,s)=>{r.getCABO().getElementCount()&&(e.VBOBuildTime>r.getAttributeUpdateTime().getMTime()||r.getShaderSourceTime().getMTime()>r.getAttributeUpdateTime().getMTime())&&(r.getProgram().isAttributeUsed("vertexMC")&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),"vertexMC",r.getCABO().getVertexOffset(),r.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||gt("Error setting vertexMC in shader VAO.")),r.getProgram().isAttributeUsed("tcoordMC")&&r.getCABO().getTCoordOffset()&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),"tcoordMC",r.getCABO().getTCoordOffset(),r.getCABO().getStride(),e.context.FLOAT,r.getCABO().getTCoordComponents(),e.context.FALSE)||gt("Error setting tcoordMC in shader VAO.")),r.getAttributeUpdateTime().modified());const i=e.openGLTexture.getTextureUnit();r.getProgram().setUniformi("texture1",i);const o=e.openGLTexture.getComponents(),c=s.getProperty().getIndependentComponents();if(c)for(let f=0;f<o;f++)r.getProgram().setUniformf(`mix${f}`,s.getProperty().getComponentWeight(f));const u=e.openGLTexture.getShiftAndScale();for(let f=0;f<o;f++){let g=s.getProperty().getColorWindow(),h=s.getProperty().getColorLevel();const d=c?f:0,v=s.getProperty().getRGBTransferFunction(d);if(v&&s.getProperty().getUseLookupTableScalarRange()){const T=v.getRange();g=T[1]-T[0],h=.5*(T[1]+T[0])}const x=u.scale/g,C=(u.shift-h)/g+.5;r.getProgram().setUniformf(`cshift${f}`,C),r.getProgram().setUniformf(`cscale${f}`,x)}for(let f=0;f<o;f++){let g=1,h=0;const d=c?f:0,v=s.getProperty().getPiecewiseFunction(d);if(v){const x=v.getRange(),C=x[1]-x[0],T=.5*(x[0]+x[1]);g=u.scale/C,h=(u.shift-T)/C+.5}r.getProgram().setUniformf(`pwfshift${f}`,h),r.getProgram().setUniformf(`pwfscale${f}`,g)}if(e.haveSeenDepthRequest&&r.getProgram().setUniformi("depthRequest",e.renderDepth?1:0),r.getProgram().isUniformUsed("coffset")){const f=t.getCoincidentParameters(n,s);r.getProgram().setUniformf("coffset",f.offset),r.getProgram().isUniformUsed("cfactor")&&r.getProgram().setUniformf("cfactor",f.factor)}const p=e.colorTexture.getTextureUnit();r.getProgram().setUniformi("colorTexture1",p);const l=e.pwfTexture.getTextureUnit();if(r.getProgram().setUniformi("pwfTexture1",l),s.getProperty().getUseLabelOutline()){const f=e.labelOutlineThicknessTexture.getTextureUnit();r.getProgram().setUniformi("labelOutlineTexture1",f);const g=e.labelOutlineOpacityTexture.getTextureUnit();r.getProgram().setUniformi("labelOutlineOpacityTexture1",g)}if(e.renderable.getNumberOfClippingPlanes()){let f=e.renderable.getNumberOfClippingPlanes();f>6&&(un("OpenGL has a limit of 6 clipping planes"),f=6);const g=r.getCABO().getCoordShiftAndScaleEnabled()?r.getCABO().getInverseShiftAndScaleMatrix():null,h=g?Ce(e.imagematinv,s.getMatrix()):s.getMatrix();g&&(ne(h,h),q(h,h,g),ne(h,h)),ne(e.imagemat,e.currentInput.getIndexToWorld()),q(e.imagematinv,h,e.imagemat);const d=[];for(let v=0;v<f;v++){const x=[];e.renderable.getClippingPlaneInDataCoords(e.imagematinv,v,x);for(let C=0;C<4;C++)d.push(x[C])}r.getProgram().setUniformi("numClipPlanes",f),r.getProgram().setUniform4fv("clipPlanes",d)}},t.setCameraShaderParameters=(r,n,s)=>{const i=r.getProgram(),o=e.openGLImageSlice.getKeyMatrices(),c=e.currentInput,u=c.getIndexToWorld();q(e.imagemat,o.mcwc,u);const p=e.openGLCamera.getKeyMatrices(n);if(q(e.imagemat,p.wcpc,e.imagemat),r.getCABO().getCoordShiftAndScaleEnabled()){const l=r.getCABO().getInverseShiftAndScaleMatrix();q(e.imagemat,e.imagemat,l)}if(i.setUniformMatrix("MCPCMatrix",e.imagemat),s.getProperty().getUseLabelOutline()===!0){const l=c.getWorldToIndex(),f=c.getDimensions();let g=e.renderable.getClosestIJKAxis().ijkMode;g===be.NONE&&(g=be.K),i.setUniform3i("imageDimensions",f[0],f[1],f[2]),i.setUniformi("sliceAxis",g),i.setUniformMatrix("vWCtoIDX",l);const h=e.openGLCamera.getKeyMatrices(n);Se(e.projectionToWorld,h.wcpc),e.openGLCamera.getKeyMatrices(n),i.setUniformMatrix("PCWCMatrix",e.projectionToWorld);const d=t.getRenderTargetSize();i.setUniformf("vpWidth",d[0]),i.setUniformf("vpHeight",d[1]);const v=t.getRenderTargetOffset();i.setUniformf("vpOffsetX",v[0]/d[0]),i.setUniformf("vpOffsetY",v[1]/d[1])}},t.setPropertyShaderParameters=(r,n,s)=>{const i=r.getProgram(),o=s.getProperty().getOpacity();i.setUniformf("opacity",o)},t.renderPieceStart=(r,n)=>{t.updateBufferObjects(r,n),e.lastBoundBO=null},t.renderPieceDraw=(r,n)=>{const s=e.context;e.openGLTexture.activate(),e.colorTexture.activate(),n.getProperty().getUseLabelOutline()&&(e.labelOutlineThicknessTexture.activate(),e.labelOutlineOpacityTexture.activate()),e.pwfTexture.activate(),e.tris.getCABO().getElementCount()&&(t.updateShaders(e.tris,r,n),s.drawArrays(s.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release()),e.openGLTexture.deactivate(),e.colorTexture.deactivate(),n.getProperty().getUseLabelOutline()&&(e.labelOutlineThicknessTexture.deactivate(),e.labelOutlineOpacityTexture.deactivate()),e.pwfTexture.deactivate()},t.renderPieceFinish=(r,n)=>{},t.renderPiece=(r,n)=>{if(t.invokeEvent({type:"StartEvent"}),e.renderable.update(),e.currentInput=e.renderable.getCurrentImage(),t.invokeEvent({type:"EndEvent"}),!e.currentInput){gt("No input!");return}t.renderPieceStart(r,n),t.renderPieceDraw(r,n),t.renderPieceFinish(r,n)},t.updateBufferObjects=(r,n)=>{t.getNeedToRebuildBufferObjects(r,n)&&t.buildBufferObjects(r,n)},t.getNeedToRebuildBufferObjects=(r,n)=>e.VBOBuildTime.getMTime()<t.getMTime()||e.VBOBuildTime.getMTime()<n.getMTime()||e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.VBOBuildTime.getMTime()<n.getProperty().getMTime()||e.VBOBuildTime.getMTime()<e.currentInput.getMTime()||!e.openGLTexture?.getHandle()||!e.colorTexture?.getHandle()||n.getProperty().getUseLabelOutline()&&(!e.labelOutlineThicknessTexture?.getHandle()||!e.labelOutlineOpacityTexture?.getHandle())||!e.pwfTexture?.getHandle(),t.buildBufferObjects=(r,n)=>{const s=e.currentInput;if(!s)return;const i=s.getPointData()&&s.getPointData().getScalars();if(!i)return;const o=i.getDataType(),c=i.getNumberOfComponents(),u=n.getProperty(),p=u.getInterpolationType(),l=u.getIndependentComponents(),f=l?c:1,g=l?2*f:1,h=[];for(let S=0;S<f;++S)h.push(u.getRGBTransferFunction(S));const d=Qe(h,l,f),v=u.getRGBTransferFunction(),x=e._openGLRenderWindow.getGraphicsResourceForObject(v);if(!x?.oglObject?.getHandle()||x?.hash!==d){e.colorTexture=K.newInstance({resizable:!0}),e.colorTexture.setOpenGLRenderWindow(e._openGLRenderWindow);let S=e.renderable.getColorTextureWidth();S<=0&&(S=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const P=S*g*3,M=new Uint8ClampedArray(P);if(p===qe.NEAREST?(e.colorTexture.setMinificationFilter(_.NEAREST),e.colorTexture.setMagnificationFilter(_.NEAREST)):(e.colorTexture.setMinificationFilter(_.LINEAR),e.colorTexture.setMagnificationFilter(_.LINEAR)),v){const b=new Float32Array(S*3);for(let L=0;L<f;L++){const R=u.getRGBTransferFunction(L),E=R.getRange();if(R.getTable(E[0],E[1],S,b,1),l)for(let k=0;k<S*3;k++)M[L*S*6+k]=255*b[k],M[L*S*6+k+S*3]=255*b[k];else for(let k=0;k<S*3;k++)M[L*S*6+k]=255*b[k]}e.colorTexture.resetFormatAndType(),e.colorTexture.create2DFromRaw({width:S,height:g,numComps:3,dataType:se.UNSIGNED_CHAR,data:M})}else{for(let b=0;b<S*3;++b)M[b]=255*b/((S-1)*3),M[b+1]=255*b/((S-1)*3),M[b+2]=255*b/((S-1)*3);e.colorTexture.create2DFromRaw({width:S,height:1,numComps:3,dataType:se.UNSIGNED_CHAR,data:M})}v&&(e._openGLRenderWindow.setGraphicsResourceForObject(v,e.colorTexture,d),v!==e._colorTransferFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(v,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._colorTransferFunc,t)),e._colorTransferFunc=v)}else e.colorTexture=x.oglObject;const C=[];for(let S=0;S<f;++S)C.push(u.getPiecewiseFunction(S));const T=Qe(C,l,f),m=u.getPiecewiseFunction(),w=e._openGLRenderWindow.getGraphicsResourceForObject(m);if(!w?.oglObject?.getHandle()||w?.hash!==T){let S=e.renderable.getOpacityTextureWidth();S<=0&&(S=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const P=S*g,M=new Uint8ClampedArray(P);if(e.pwfTexture=K.newInstance({resizable:!0}),e.pwfTexture.setOpenGLRenderWindow(e._openGLRenderWindow),p===qe.NEAREST?(e.pwfTexture.setMinificationFilter(_.NEAREST),e.pwfTexture.setMagnificationFilter(_.NEAREST)):(e.pwfTexture.setMinificationFilter(_.LINEAR),e.pwfTexture.setMagnificationFilter(_.LINEAR)),m){const b=new Float32Array(P),L=new Float32Array(S);for(let R=0;R<f;++R){const E=u.getPiecewiseFunction(R);if(E===null)b.fill(1);else{const k=E.getRange();if(E.getTable(k[0],k[1],S,L,1),l)for(let N=0;N<S;N++)b[R*S*2+N]=L[N],b[R*S*2+N+S]=L[N];else for(let N=0;N<S;N++)b[R*S*2+N]=L[N]}}e.pwfTexture.resetFormatAndType(),e.pwfTexture.create2DFromRaw({width:S,height:g,numComps:1,dataType:se.FLOAT,data:b})}else M.fill(255),e.pwfTexture.create2DFromRaw({width:S,height:1,numComps:1,dataType:se.UNSIGNED_CHAR,data:M});m&&(e._openGLRenderWindow.setGraphicsResourceForObject(m,e.pwfTexture,T),m!==e._pwFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(m,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._pwFunc,t)),e._pwFunc=m)}else e.pwfTexture=w.oglObject;n.getProperty().getUseLabelOutline()&&(t.updatelabelOutlineThicknessTexture(n),t.updateLabelOutlineOpacityTexture(n));const{ijkMode:O}=e.renderable.getClosestIJKAxis();let B=e.renderable.getSlice();O!==e.renderable.getSlicingMode()&&(B=e.renderable.getSliceAtPosition(B));const U=e.renderable.isA("vtkImageArrayMapper")?e.renderable.getSubSlice():Math.round(B),F=s.getExtent();let D;O===be.I&&(D=U-F[0]),O===be.J&&(D=U-F[2]),(O===be.K||O===be.NONE)&&(D=U-F[4]);const y=`${B}A${s.getMTime()}A${i.getMTime()}B${t.getMTime()}C${e.renderable.getSlicingMode()}D${n.getProperty().getInterpolationType()}`;if(e.VBOBuildString!==y){const S=s.getDimensions();e.openGLTexture||(e.openGLTexture=K.newInstance({resizable:!0})),e.openGLTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.openGLTexture.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),p===qe.NEAREST?(new Set([1,3,4]).has(c)&&o===se.UNSIGNED_CHAR&&!l?(e.openGLTexture.setGenerateMipmap(!0),e.openGLTexture.setMinificationFilter(_.NEAREST)):e.openGLTexture.setMinificationFilter(_.NEAREST),e.openGLTexture.setMagnificationFilter(_.NEAREST)):(c===4&&o===se.UNSIGNED_CHAR&&!l?(e.openGLTexture.setGenerateMipmap(!0),e.openGLTexture.setMinificationFilter(_.LINEAR_MIPMAP_LINEAR)):e.openGLTexture.setMinificationFilter(_.LINEAR),e.openGLTexture.setMagnificationFilter(_.LINEAR)),e.openGLTexture.setWrapS(gr.CLAMP_TO_EDGE),e.openGLTexture.setWrapT(gr.CLAMP_TO_EDGE);const P=S[0]*S[1]*c,M=new Float32Array(12),b=new Float32Array(8);for(let j=0;j<4;j++)b[j*2]=j%2?1:0,b[j*2+1]=j>1?1:0;const L=[be.X,be.Y,be.Z].includes(e.renderable.getSlicingMode())?B:U,R=s.getSpatialExtent(),E=i.getData();let k=null;if(O===be.I){k=new E.constructor(S[2]*S[1]*c);let j=0;for(let oe=0;oe<S[2];oe++)for(let ve=0;ve<S[1];ve++){let Y=(D+ve*S[0]+oe*S[0]*S[1])*c;j=(oe*S[1]+ve)*c;const A=Y+c;for(;Y<A;)k[j++]=E[Y++]}S[0]=S[1],S[1]=S[2],M[0]=L,M[1]=R[2],M[2]=R[4],M[3]=L,M[4]=R[3],M[5]=R[4],M[6]=L,M[7]=R[2],M[8]=R[5],M[9]=L,M[10]=R[3],M[11]=R[5]}else if(O===be.J){k=new E.constructor(S[2]*S[0]*c);let j=0;for(let oe=0;oe<S[2];oe++)for(let ve=0;ve<S[0];ve++){let Y=(ve+D*S[0]+oe*S[0]*S[1])*c;j=(oe*S[0]+ve)*c;const A=Y+c;for(;Y<A;)k[j++]=E[Y++]}S[1]=S[2],M[0]=R[0],M[1]=L,M[2]=R[4],M[3]=R[1],M[4]=L,M[5]=R[4],M[6]=R[0],M[7]=L,M[8]=R[5],M[9]=R[1],M[10]=L,M[11]=R[5]}else O===be.K||O===be.NONE?(k=E.subarray(D*P,(D+1)*P),M[0]=R[0],M[1]=R[2],M[2]=L,M[3]=R[1],M[4]=R[2],M[5]=L,M[6]=R[0],M[7]=R[3],M[8]=L,M[9]=R[1],M[10]=R[3],M[11]=L):gt("Reformat slicing not yet supported.");const N=i.getRanges();e.openGLTexture.resetFormatAndType(),e.openGLTexture.create2DFilterableFromRaw({width:S[0],height:S[1],numComps:c,dataType:i.getDataType(),data:k,preferSizeOverAccuracy:!!e.renderable.getPreferSizeOverAccuracy?.(),ranges:N}),e.openGLTexture.activate(),e.openGLTexture.sendParameters(),e.openGLTexture.deactivate();const $=ce.newInstance({numberOfComponents:3,values:M});$.setName("points");const H=ce.newInstance({numberOfComponents:2,values:b});H.setName("tcoords");const z=new Uint16Array(8);z[0]=3,z[1]=0,z[2]=1,z[3]=3,z[4]=3,z[5]=0,z[6]=3,z[7]=2;const J=Je.newInstance({values:z});e.tris.getCABO().createVBO(J,"polys",bt.SURFACE,{points:$,tcoords:H,cellOffset:0,forceFlatten:!0}),e.VBOBuildTime.modified(),e.VBOBuildString=y}},t.updateLabelOutlineOpacityTexture=r=>{let n=r.getProperty().getLabelOutlineOpacity();typeof n=="number"&&(e._cachedLabelOutlineOpacityObj?.[0]===n?n=e._cachedLabelOutlineOpacityObj:n=[n],e._cachedLabelOutlineOpacityObj=n);const s=e._openGLRenderWindow.getGraphicsResourceForObject(n),i=`${n.join("-")}`;if(!s?.oglObject?.getHandle()||s?.hash!==i){let o=e.renderable.getLabelOutlineTextureWidth();o<=0&&(o=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const c=1,u=o*c,p=new Float32Array(u);for(let l=0;l<o;++l)p[l]=n[l]??n[0];e.labelOutlineOpacityTexture=K.newInstance({resizable:!1}),e.labelOutlineOpacityTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.labelOutlineOpacityTexture.resetFormatAndType(),e.labelOutlineOpacityTexture.setMinificationFilter(_.NEAREST),e.labelOutlineOpacityTexture.setMagnificationFilter(_.NEAREST),e.labelOutlineOpacityTexture.create2DFromRaw({width:o,height:c,numComps:1,dataType:se.FLOAT,data:p}),n&&(e._openGLRenderWindow.setGraphicsResourceForObject(n,e.labelOutlineOpacityTexture,i),n!==e._labelOutlineOpacity&&(e._openGLRenderWindow.registerGraphicsResourceUser(n,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._labelOutlineOpacity,t)),e._labelOutlineOpacity=n)}else e.labelOutlineOpacityTexture=s.oglObject},t.updatelabelOutlineThicknessTexture=r=>{const n=r.getProperty().getLabelOutlineThicknessByReference(),s=e._openGLRenderWindow.getGraphicsResourceForObject(n),i=`${n.join("-")}`;if(!s?.oglObject?.getHandle()||s?.hash!==i){let o=e.renderable.getLabelOutlineTextureWidth();o<=0&&(o=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const c=1,u=o*c,p=new Uint8Array(u);for(let l=0;l<o;++l)p[l]=typeof n[l]<"u"?n[l]:n[0];e.labelOutlineThicknessTexture=K.newInstance({resizable:!1}),e.labelOutlineThicknessTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.labelOutlineThicknessTexture.resetFormatAndType(),e.labelOutlineThicknessTexture.setMinificationFilter(_.NEAREST),e.labelOutlineThicknessTexture.setMagnificationFilter(_.NEAREST),e.labelOutlineThicknessTexture.create2DFromRaw({width:o,height:c,numComps:1,dataType:se.UNSIGNED_CHAR,data:p}),n&&(e._openGLRenderWindow.setGraphicsResourceForObject(n,e.labelOutlineThicknessTexture,i),n!==e._labelOutlineThicknessArray&&(e._openGLRenderWindow.registerGraphicsResourceUser(n,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._labelOutlineThicknessArray,t)),e._labelOutlineThicknessArray=n)}else e.labelOutlineThicknessTexture=s.oglObject},t.getRenderTargetSize=()=>{if(e._useSmallViewport)return[e._smallViewportWidth,e._smallViewportHeight];const{usize:r,vsize:n}=e._openGLRenderer.getTiledSizeAndOrigin();return[r,n]},t.getRenderTargetOffset=()=>{const{lowerLeftU:r,lowerLeftV:n}=e._openGLRenderer.getTiledSizeAndOrigin();return[r,n]},t.delete=yn(()=>{e._openGLRenderWindow&&a(e._openGLRenderWindow)},t.delete)}var pc={VBOBuildTime:0,VBOBuildString:null,openGLTexture:null,tris:null,imagemat:null,imagematinv:null,colorTexture:null,pwfTexture:null,labelOutlineThicknessTexture:null,labelOutlineOpacityTexture:null,lastHaveSeenDepthRequest:!1,haveSeenDepthRequest:!1,lastTextureComponents:0};function gc(t,e,a={}){Object.assign(e,pc,a),ee.extend(t,e,a),$e.implementReplaceShaderCoincidentOffset(t,e,a),$e.implementBuildShadersWithReplacements(t,e,a),e.tris=Pe.newInstance(),e.imagemat=Z(new Float64Array(16)),e.imagematinv=Z(new Float64Array(16)),e.projectionToWorld=Z(new Float64Array(16)),e.idxToView=Z(new Float64Array(16)),e.idxNormalMatrix=We(new Float64Array(9)),e.modelToView=Z(new Float64Array(16)),e.projectionToView=Z(new Float64Array(16)),ye(t,e,[]),e.VBOBuildTime={},de(e.VBOBuildTime),fc(t,e)}var dc=X(gc,"vtkOpenGLImageMapper");fe("vtkAbstractImageMapper",dc);function hc(t,e){e.classHierarchy.push("vtkOpenGLImageSlice"),t.buildPass=a=>{if(!(!e.renderable||!e.renderable.getVisibility())&&a){if(!e.renderable)return;e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e.context=e._openGLRenderWindow.getContext(),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes()}},t.traverseZBufferPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children.forEach(r=>{r.traverse(a)}),t.apply(a,!1))},t.traverseOpaqueZBufferPass=a=>t.traverseOpaquePass(a),t.traverseOpaquePass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children.forEach(r=>{r.traverse(a)}),t.apply(a,!1))},t.traverseTranslucentPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children.forEach(r=>{r.traverse(a)}),t.apply(a,!1))},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;e.renderable.getIsOpaque()?r.incrementOpaqueActorCount():r.incrementTranslucentActorCount()}},t.zBufferPass=(a,r)=>t.opaquePass(a,r),t.opaqueZBufferPass=(a,r)=>t.opaquePass(a,r),t.opaquePass=(a,r)=>{a&&e.context.depthMask(!0)},t.translucentPass=(a,r)=>{e.context.depthMask(!a)},t.getKeyMatrices=()=>(e.renderable.getMTime()>e.keyMatrixTime.getMTime()&&(Ce(e.keyMatrices.mcwc,e.renderable.getMatrix()),ne(e.keyMatrices.mcwc,e.keyMatrices.mcwc),e.keyMatrixTime.modified()),e.keyMatrices)}var vc={context:null,keyMatrixTime:null,keyMatrices:null};function xc(t,e,a={}){Object.assign(e,vc,a),ee.extend(t,e,a),e.keyMatrixTime={},de(e.keyMatrixTime,{mtime:0}),e.keyMatrices={mcwc:Z(new Float64Array(16))},ye(t,e,["context"]),hc(t,e)}var Cc=X(xc,"vtkOpenGLImageSlice");fe("vtkImageSlice",Cc);var{vtkDebugMacro:mc}=me;function Tc(t,e){e.classHierarchy.push("vtkOpenGLPixelSpaceCallbackMapper"),t.opaquePass=(a,r)=>{e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow");const n=e._openGLRenderer.getAspectRatio(),s=e._openGLRenderer?e._openGLRenderer.getRenderable().getActiveCamera():null,i=e._openGLRenderer.getTiledSizeAndOrigin();let o=null;if(e.renderable.getUseZValues()){const c=r.getZBufferTexture(),u=Math.floor(c.getWidth()),p=Math.floor(c.getHeight()),l=e._openGLRenderWindow.getContext();c.bind();const f=r.getFramebuffer();f?f.saveCurrentBindingsAndBuffers():mc("No framebuffer to save/restore");const g=l.createFramebuffer();l.bindFramebuffer(l.FRAMEBUFFER,g),l.framebufferTexture2D(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,c.getHandle(),0),l.checkFramebufferStatus(l.FRAMEBUFFER)===l.FRAMEBUFFER_COMPLETE&&(o=new Uint8Array(u*p*4),l.viewport(0,0,u,p),l.readPixels(0,0,u,p,l.RGBA,l.UNSIGNED_BYTE,o)),f&&f.restorePreviousBindingsAndBuffers(),l.deleteFramebuffer(g)}e.renderable.invokeCallback(e.renderable.getInputData(),s,n,i,o)},t.queryPass=(a,r)=>{a&&e.renderable.getUseZValues()&&r.requestDepth()}}var Sc={};function yc(t,e,a={}){Object.assign(e,Sc,a),ee.extend(t,e,a),Tc(t,e)}var Oc=X(yc,"vtkOpenGLPixelSpaceCallbackMapper");fe("vtkPixelSpaceCallbackMapper",Oc);var bc=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkPolyData2DFS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

uniform int PrimitiveIDOffset;

// Texture coordinates
//VTK::TCoord::Dec

// Scalar coloring
//VTK::Color::Dec

// Depth Peeling
//VTK::DepthPeeling::Dec

// picking support
//VTK::Picking::Dec

// the output of this shader
//VTK::Output::Dec

// Apple Bug
//VTK::PrimID::Dec

void main()
{
  // Apple Bug
  //VTK::PrimID::Impl

  //VTK::Color::Impl
  //VTK::TCoord::Impl

  //VTK::DepthPeeling::Impl
  //VTK::Picking::Impl

  if (gl_FragData[0].a <= 0.0)
    {
    discard;
    }
}
`,Vc=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkPolyData2DVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

// all variables that represent positions or directions have a suffix
// indicating the coordinate system they are in. The possible values are
// MC - Model Coordinates
// WC - WC world coordinates
// VC - View Coordinates
// DC - Display Coordinates

in vec4 vertexWC;

// frag position in VC
//VTK::PositionVC::Dec

// material property values
//VTK::Color::Dec

// Texture coordinates
//VTK::TCoord::Dec

// Apple Bug
//VTK::PrimID::Dec

uniform mat4 WCVCMatrix;  // World to view matrix

void main()
{
  // Apple Bug
  //VTK::PrimID::Impl

  gl_Position = WCVCMatrix*vertexWC;

  //VTK::TCoord::Impl

  //VTK::Color::Impl

  //VTK::PositionVC::Impl
}
`,{primTypes:Ue}=Pe,{Filter:ca,Wrap:ua}=K,{vtkErrorMacro:Dt}=me,wc={type:"StartEvent"},Mc={type:"EndEvent"};function Bc(t,e){e.classHierarchy.push("vtkOpenGLPolyDataMapper2D"),t.buildPass=r=>{r&&(e.openGLActor2D=t.getFirstAncestorOfType("vtkOpenGLActor2D"),e._openGLRenderer=e.openGLActor2D.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),e.openGLCamera=e._openGLRenderer.getViewNodeFor(e._openGLRenderer.getRenderable().getActiveCamera(),e.openGLCamera))},t.overlayPass=r=>{r&&t.render()},t.getShaderTemplate=(r,n,s)=>{r.Vertex=Vc,r.Fragment=bc,r.Geometry=""},t.render=()=>{const r=e._openGLRenderWindow.getContext();if(e.context!==r){e.context=r;for(let i=Ue.Start;i<Ue.End;i++)e.primitives[i].setOpenGLRenderWindow(e._openGLRenderWindow)}const n=e.openGLActor2D.getRenderable(),s=e._openGLRenderer.getRenderable();t.renderPiece(s,n)},t.renderPiece=(r,n)=>{if(t.invokeEvent(wc),e.renderable.getStatic()||e.renderable.update(),e.currentInput=e.renderable.getInputData(),t.invokeEvent(Mc),!e.currentInput){Dt("No input!");return}if(!e.currentInput.getPoints||!e.currentInput.getPoints().getNumberOfValues())return;const s=e.context,i=n.getProperty();i.getBackfaceCulling()||i.getFrontfaceCulling()?(e._openGLRenderWindow.enableCullFace(),i.getBackfaceCulling()&&i.getFrontfaceCulling()?e._openGLRenderWindow.setCullFaceMode(s.FRONT_AND_BACK):i.getBackfaceCulling()?e._openGLRenderWindow.setCullFaceMode(s.BACK):e._openGLRenderWindow.setCullFaceMode(s.FRONT)):e._openGLRenderWindow.disableCullFace(),t.renderPieceStart(r,n),t.renderPieceDraw(r,n),t.renderPieceFinish(r,n)},t.renderPieceStart=(r,n)=>{if(e.primitiveIDOffset=0,e._openGLRenderer.getSelector())switch(e._openGLRenderer.getSelector().getCurrentPass()){default:e._openGLRenderer.getSelector().renderProp(n)}e.renderable.getColorTextureMap()&&e.internalColorTexture.activate(),t.updateBufferObjects(r,n),e.lastBoundBO=null},t.getNeedToRebuildShaders=(r,n,s)=>r.getShaderSourceTime().getMTime()<e.renderable.getMTime()||r.getShaderSourceTime().getMTime()<e.currentInput.getMTime(),t.updateBufferObjects=(r,n)=>{t.getNeedToRebuildBufferObjects(r,n)&&t.buildBufferObjects(r,n)},t.getNeedToRebuildBufferObjects=(r,n)=>{const s=e.VBOBuildTime.getMTime();return!!(s<t.getMTime()||s<e._openGLRenderWindow.getMTime()||s<e.renderable.getMTime()||s<n.getMTime()||s<e.currentInput.getMTime()||e.renderable.getTransformCoordinate()&&s<r.getMTime())},t.buildBufferObjects=(r,n)=>{const s=e.currentInput;if(s===null)return;e.renderable.mapScalars(s,n.getProperty().getOpacity());const i=e.renderable.getColorMapColors(),o=n.getProperty().getRepresentation();let c=s.getPointData().getTCoords();e.openGLActor2D.getActiveTextures()||(c=null);let u=!1;if(e.renderable.getColorCoordinates()){c=e.renderable.getColorCoordinates(),u=e.renderable.getAreScalarsMappedFromCells(),e.internalColorTexture||(e.internalColorTexture=K.newInstance({resizable:!0}));const g=e.internalColorTexture;g.setMinificationFilter(ca.NEAREST),g.setMagnificationFilter(ca.NEAREST),g.setWrapS(ua.CLAMP_TO_EDGE),g.setWrapT(ua.CLAMP_TO_EDGE),g.setOpenGLRenderWindow(e._openGLRenderWindow);const h=e.renderable.getColorTextureMap(),d=h.getExtent(),v=h.getPointData().getScalars();g.create2DFromRaw({width:d[1]-d[0]+1,height:d[3]-d[2]+1,numComps:v.getNumberOfComponents(),dataType:v.getDataType(),data:v.getData()}),g.activate(),g.sendParameters(),g.deactivate()}const p=e.renderable.getTransformCoordinate(),l=r.getRenderWindow().getViews()[0].getViewportSize(r),f=`${s.getMTime()}A${o}B${s.getMTime()}C${i?i.getMTime():1}D${c?c.getMTime():1}E${p?r.getMTime():1}F${l}`;if(e.VBOBuildString!==f){let g=s.getPoints();if(p){const d=go.newInstance(),v=g.getNumberOfPoints();d.setNumberOfPoints(v);const x=[];for(let C=0;C<v;++C){g.getPoint(C,x),p.setValue(x);const T=p.getComputedDoubleViewportValue(r);d.setPoint(C,T[0],T[1],0)}g=d}const h={points:g,tcoords:c,colors:i,cellOffset:0,useTCoordsPerCell:u,haveCellScalars:e.renderable.getAreScalarsMappedFromCells(),customAttributes:e.renderable.getCustomShaderAttributes().map(d=>s.getPointData().getArrayByName(d))};h.cellOffset+=e.primitives[Ue.Points].getCABO().createVBO(s.getVerts(),"verts",o,h),h.cellOffset+=e.primitives[Ue.Lines].getCABO().createVBO(s.getLines(),"lines",o,h),h.cellOffset+=e.primitives[Ue.Tris].getCABO().createVBO(s.getPolys(),"polys",o,h),h.cellOffset+=e.primitives[Ue.TriStrips].getCABO().createVBO(s.getStrips(),"strips",o,h),e.VBOBuildTime.modified(),e.VBOBuildString=f}},t.renderPieceDraw=(r,n)=>{const s=n.getProperty().getRepresentation();e.context.depthMask(!0);for(let i=Ue.Start;i<Ue.End;i++)e.primitives[i].getCABO().getElementCount()&&(e.lastBoundBO=e.primitives[i],e.primitiveIDOffset+=e.primitives[i].drawArrays(r,n,s,t))},t.renderPieceFinish=(r,n)=>{e.lastBoundBO&&e.lastBoundBO.getVAO().release(),e.renderable.getColorTextureMap()&&e.internalColorTexture.deactivate()},t.replaceShaderValues=(r,n,s)=>{t.replaceShaderColor(r,n,s),t.replaceShaderTCoord(r,n,s),t.replaceShaderPicking(r,n,s),t.replaceShaderPositionVC(r,n,s)},t.replaceShaderColor=(r,n,s)=>{let i=r.Vertex,o=r.Geometry,c=r.Fragment,u=["uniform vec3 diffuseColorUniform;","uniform float opacityUniform;"],p=["vec3 diffuseColor = diffuseColorUniform;","float opacity = opacityUniform;"];e.lastBoundBO.getCABO().getColorComponents()!==0?(u=u.concat(["varying vec4 vertexColorVSOutput;"]),i=V.substitute(i,"//VTK::Color::Dec",["attribute vec4 scalarColor;","varying vec4 vertexColorVSOutput;"]).result,i=V.substitute(i,"//VTK::Color::Impl",["vertexColorVSOutput =  scalarColor;"]).result,o=V.substitute(o,"//VTK::Color::Dec",["in vec4 vertexColorVSOutput[];","out vec4 vertexColorGSOutput;"]).result,o=V.substitute(o,"//VTK::Color::Impl",["vertexColorGSOutput = vertexColorVSOutput[i];"]).result,c=V.substitute(c,"//VTK::Color::Impl",p.concat(["  diffuseColor = vertexColorVSOutput.rgb;","  opacity = opacity*vertexColorVSOutput.a;"])).result):e.renderable.getAreScalarsMappedFromCells()&&(p=p.concat(["  vec4 texColor = texture2D(texture1, tcoordVCVSOutput.st);","  diffuseColor = texColor.rgb;","  opacity = opacity*texColor.a;"])),p=p.concat(["gl_FragData[0] = vec4(diffuseColor, opacity);"]),c=V.substitute(c,"//VTK::Color::Dec",u).result,c=V.substitute(c,"//VTK::Color::Impl",p).result,r.Vertex=i,r.Geometry=o,r.Fragment=c},t.replaceShaderTCoord=(r,n,s)=>{if(e.lastBoundBO.getCABO().getTCoordOffset()){let i=r.Vertex,o=r.Geometry,c=r.Fragment;const u=e.lastBoundBO.getCABO().getTCoordComponents();u===1?(i=V.substitute(i,"//VTK::TCoord::Dec",["in float tcoordMC;","out float tcoordVCVSOutput;"]).result,i=V.substitute(i,"//VTK::TCoord::Impl",["tcoordVCVSOutput = tcoordMC;"]).result,o=V.substitute(o,"//VTK::TCoord::Dec",[`in float tcoordVCVSOutput[];
`,"out float tcoordVCGSOutput;"]).result,o=V.substitute(o,["//VTK::TCoord::Impl","tcoordVCGSOutput = tcoordVCVSOutput[i];"]).result,c=V.substitute(c,"//VTK::TCoord::Dec",["in float tcoordVCVSOutput;","uniform sampler2D texture1;"]).result,c=V.substitute(c,"//VTK::TCoord::Impl",["gl_FragData[0] = gl_FragData[0]*texture2D(texture1, vec2(tcoordVCVSOutput,0));"]).result):u===2&&(i=V.substitute(i,"//VTK::TCoord::Dec",["in vec2 tcoordMC;","out vec2 tcoordVCVSOutput;"]).result,i=V.substitute(i,"//VTK::TCoord::Impl",["tcoordVCVSOutput = tcoordMC;"]).result,o=V.substitute(o,"//VTK::TCoord::Dec",[`in vec2 tcoordVCVSOutput[];
`,"out vec2 tcoordVCGSOutput;"]).result,o=V.substitute(o,"//VTK::TCoord::Impl",["tcoordVCGSOutput = tcoordVCVSOutput[i];"]).result,c=V.substitute(c,"//VTK::TCoord::Dec",["in vec2 tcoordVCVSOutput;","uniform sampler2D texture1;"]).result,c=V.substitute(c,"//VTK::TCoord::Impl",["gl_FragData[0] = gl_FragData[0]*texture2D(texture1, tcoordVCVSOutput.st);"]).result),e.renderable.getAreScalarsMappedFromCells()&&(o=V.substitute(o,"//VTK::PrimID::Impl",["gl_PrimitiveID = gl_PrimitiveIDIn;"]).result),r.Vertex=i,r.Geometry=o,r.Fragment=c}},t.replaceShaderPicking=(r,n,s)=>{let i=r.Fragment;i=V.substitute(i,"//VTK::Picking::Dec",["uniform vec3 mapperIndex;","uniform int picking;"]).result,i=V.substitute(i,"//VTK::Picking::Impl","  gl_FragData[0] = picking != 0 ? vec4(mapperIndex,1.0) : gl_FragData[0];").result,r.Fragment=i},t.replaceShaderPositionVC=(r,n,s)=>{e.lastBoundBO.replaceShaderPositionVC(r,n,s)},t.invokeShaderCallbacks=(r,n,s)=>{const i=e.renderable.getViewSpecificProperties().ShadersCallbacks;i&&i.forEach(o=>{o.callback(o.userData,r,n,s)})},t.setMapperShaderParameters=(r,n,s)=>{if(r.getProgram().isUniformUsed("PrimitiveIDOffset")&&r.getProgram().setUniformi("PrimitiveIDOffset",e.primitiveIDOffset),r.getProgram().isAttributeUsed("vertexWC")&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),"vertexWC",r.getCABO().getVertexOffset(),r.getCABO().getStride(),e.context.FLOAT,3,!1)||Dt("Error setting vertexWC in shader VAO.")),r.getCABO().getElementCount()&&(e.VBOBuildTime.getMTime()>r.getAttributeUpdateTime().getMTime()||r.getShaderSourceTime().getMTime()>r.getAttributeUpdateTime().getMTime())){e.renderable.getCustomShaderAttributes().forEach((c,u)=>{r.getProgram().isAttributeUsed(`${c}MC`)&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),`${c}MC`,r.getCABO().getCustomData()[u].offset,r.getCABO().getStride(),e.context.FLOAT,r.getCABO().getCustomData()[u].components,!1)||Dt(`Error setting ${c}MC in shader VAO.`))}),r.getProgram().isAttributeUsed("tcoordMC")&&r.getCABO().getTCoordOffset()?r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),"tcoordMC",r.getCABO().getTCoordOffset(),r.getCABO().getStride(),e.context.FLOAT,r.getCABO().getTCoordComponents(),!1)||Dt("Error setting tcoordMC in shader VAO."):r.getVAO().removeAttributeArray("tcoordMC"),r.getProgram().isAttributeUsed("scalarColor")&&r.getCABO().getColorComponents()?r.getVAO().addAttributeArray(r.getProgram(),r.getCABO().getColorBO(),"scalarColor",r.getCABO().getColorOffset(),r.getCABO().getColorBOStride(),e.context.UNSIGNED_BYTE,4,!0)||Dt("Error setting scalarColor in shader VAO."):r.getVAO().removeAttributeArray("scalarColor"),e.internalColorTexture&&r.getProgram().isUniformUsed("texture1")&&e.internalColorTexture.getTextureUnit()>-1&&r.getProgram().setUniformi("texture1",e.internalColorTexture.getTextureUnit());const i=e.openGLActor2D.getActiveTextures();if(i)for(let c=0;c<i.length;++c){const u=i[c].getTextureUnit(),p=`texture${u+1}`;r.getProgram().isUniformUsed(p)&&r.getProgram().setUniformi(p,u)}r.setMapperShaderParameters(n,s,e._openGLRenderer.getTiledSizeAndOrigin());const o=e._openGLRenderer.getSelector();r.getProgram().setUniform3fArray("mapperIndex",o?o.getPropColorValue():[0,0,0]),r.getProgram().setUniformi("picking",o?o.getCurrentPass()+1:0)}},t.setPropertyShaderParameters=(r,n,s)=>{const i=e.renderable.getColorMapColors();if(!i||i.getNumberOfComponents()===0){const o=r.getProgram(),c=s.getProperty(),u=c.getOpacity();o.setUniformf("opacityUniform",u);const p=c.getColor();o.setUniform3fArray("diffuseColorUniform",p)}},t.setLightingShaderParameters=(r,n,s)=>{};function a(r,n,s){return n.identity(s),r.reduce((i,o,c)=>c===0?o?n.copy(i,o):n.identity(i):o?n.multiply(i,i,o):i,s)}t.setCameraShaderParameters=(r,n,s)=>{const i=r.getProgram(),o=r.getCABO().getCoordShiftAndScaleEnabled()?r.getCABO().getInverseShiftAndScaleMatrix():null,c=n.getRenderWindow().getViews()[0].getViewportSize(n),u=n.getViewport(),p=s.getActualPositionCoordinate().getComputedDoubleViewportValue(n),l=[0,0,1,1],f=[0,0,1,1];if(f[0]=u[0]>=l[0]?u[0]:l[0],f[1]=u[1]>=l[1]?u[1]:l[1],f[2]=u[2]<=l[2]?u[2]:l[2],f[3]=u[3]<=l[3]?u[3]:l[3],f[0]>=f[2]||f[1]>=f[3])return;c[0]=Kt(c[0]*(f[2]-f[0])/(u[2]-u[0])),c[1]=Kt(c[1]*(f[3]-f[1])/(u[3]-u[1]));const g=e._openGLRenderer.getParent().getSize(),h=Kt(p[0]-(f[0]-u[0])*g[0]),d=Kt(p[1]-(f[1]-u[1])*g[1]),v=-h;let x=-h+c[0];const C=-d;let T=-d+c[1];v===x&&(x=v+1),C===T&&(T=C+1);const m=Z(new Float64Array(16));m[0]=2/(x-v),m[5]=2/(T-C),m[3]=-1*(x+v)/(x-v),m[7]=-1*(T+C)/(T-C),m[10]=0,m[11]=s.getProperty().getDisplayLocation()===mo.FOREGROUND?-1:1,m[15]=1,ne(m,m),i.setUniformMatrix("WCVCMatrix",a([m,o],Et,e.tmpMat4))},t.getAllocatedGPUMemoryInBytes=()=>{let r=0;return e.primitives.forEach(n=>{r+=n.getAllocatedGPUMemoryInBytes()}),r}}var Dc={context:null,VBOBuildTime:0,VBOBuildString:null,primitives:null,primTypes:null,shaderRebuildString:null};function Lc(t,e,a={}){Object.assign(e,Dc,a),ee.extend(t,e,a),$e.implementReplaceShaderCoincidentOffset(t,e,a),$e.implementBuildShadersWithReplacements(t,e,a),e.primitives=[],e.primTypes=Ue,e.tmpMat4=Z(new Float64Array(16));for(let r=Ue.Start;r<Ue.End;r++)e.primitives[r]=Pe.newInstance(),e.primitives[r].setPrimitiveType(r),e.primitives[r].set({lastLightComplexity:0,lastLightCount:0,lastSelectionPass:!1},!0);ye(t,e,["context"]),e.VBOBuildTime={},de(e.VBOBuildTime,{mtime:0}),Bc(t,e)}var Rc=X(Lc,"vtkOpenGLPolyDataMapper2D");fe("vtkMapper2D",Rc);var{vtkDebugMacro:Uc}=me;function kc(t,e){e.classHierarchy.push("vtkOpenGLRenderer"),t.buildPass=a=>{if(a){if(!e.renderable)return;t.updateLights(),t.prepareNodes(),t.addMissingNode(e.renderable.getActiveCamera()),t.addMissingNodes(e.renderable.getViewPropsWithNestedProps(),!0),t.removeUnusedNodes()}},t.updateLights=()=>{let a=0;const r=e.renderable.getLightsByReference();for(let n=0;n<r.length;++n)r[n].getSwitch()>0&&a++;return a||(Uc("No lights are on, creating one."),e.renderable.createLight()),a},t.zBufferPass=a=>{if(a){let r=0;const n=e.context;e.renderable.getTransparent()||(e.context.clearColor(1,0,0,1),r|=n.COLOR_BUFFER_BIT),e.renderable.getPreserveDepthBuffer()||(n.clearDepth(1),r|=n.DEPTH_BUFFER_BIT,e.context.depthMask(!0));const s=t.getTiledSizeAndOrigin();n.enable(n.SCISSOR_TEST),n.scissor(s.lowerLeftU,s.lowerLeftV,s.usize,s.vsize),n.viewport(s.lowerLeftU,s.lowerLeftV,s.usize,s.vsize),n.colorMask(!0,!0,!0,!0),r&&n.clear(r),n.enable(n.DEPTH_TEST)}},t.opaqueZBufferPass=a=>t.zBufferPass(a),t.cameraPass=a=>{a&&t.clear()},t.getAspectRatio=()=>{const a=e._parent.getSizeByReference(),r=e.renderable.getViewportByReference();return a[0]*(r[2]-r[0])/((r[3]-r[1])*a[1])},t.getTiledSizeAndOrigin=()=>{const a=e.renderable.getViewportByReference(),r=[0,0,1,1],n=a[0]-r[0],s=a[1]-r[1],i=e._parent.normalizedDisplayToDisplay(n,s),o=Math.round(i[0]),c=Math.round(i[1]),u=a[2]-r[0],p=a[3]-r[1],l=e._parent.normalizedDisplayToDisplay(u,p);let f=Math.round(l[0])-o,g=Math.round(l[1])-c;return f<0&&(f=0),g<0&&(g=0),{usize:f,vsize:g,lowerLeftU:o,lowerLeftV:c}},t.clear=()=>{let a=0;const r=e.context;if(!e.renderable.getTransparent()){const s=e.renderable.getBackgroundByReference();r.clearColor(s[0],s[1],s[2],s[3]),a|=r.COLOR_BUFFER_BIT}e.renderable.getPreserveDepthBuffer()||(r.clearDepth(1),a|=r.DEPTH_BUFFER_BIT,r.depthMask(!0)),r.colorMask(!0,!0,!0,!0);const n=t.getTiledSizeAndOrigin();r.enable(r.SCISSOR_TEST),r.scissor(n.lowerLeftU,n.lowerLeftV,n.usize,n.vsize),r.viewport(n.lowerLeftU,n.lowerLeftV,n.usize,n.vsize),a&&r.clear(a),r.enable(r.DEPTH_TEST)},t.releaseGraphicsResources=()=>{e.selector!==null&&e.selector.releaseGraphicsResources(),e.renderable&&e.renderable.getViewProps().forEach(a=>{a.modified()})},t.setOpenGLRenderWindow=a=>{e._openGLRenderWindow!==a&&(t.releaseGraphicsResources(),e._openGLRenderWindow=a,e.context=null,a&&(e.context=e._openGLRenderWindow.getContext()))}}var Ec={context:null,_openGLRenderWindow:null,selector:null};function Pc(t,e,a={}){Object.assign(e,Ec,a),ee.extend(t,e,a),pt(t,e,["shaderCache"]),ye(t,e,["selector"]),Xi(t,e,["openGLRenderWindow"]),kc(t,e)}var Fc=X(Pc,"vtkOpenGLRenderer");fe("vtkRenderer",Fc);var{vtkWarningMacro:Ic}=I,Rn;function Nc(t,e){e.classHierarchy.push("vtkAbstractTransform","vtkHomogeneousTransform","vtkTransform"),t.transformPoint=(a,r)=>(Te(r,a,e.matrix),r),t.transformPoints=(a,r)=>{const n=new Float64Array(3),s=new Float64Array(3);for(let i=0;i<a.length;i+=3)n[0]=a[i],n[1]=a[i+1],n[2]=a[i+2],Te(s,n,e.matrix),r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2];return r},t.preMultiply=()=>{t.setPreMultiplyFlag(!0)},t.postMultiply=()=>{t.setPreMultiplyFlag(!1)},t.transformMatrix=(a,r)=>(e.preMultiplyFlag?q(r,e.matrix,a):q(r,a,e.matrix),r),t.transformMatrices=(a,r)=>{const n=new Float64Array(16),s=new Float64Array(16),i=e.preMultiplyFlag?()=>q(s,e.matrix,n):()=>q(s,n,e.matrix);for(let o=0;o<a.length;o+=16){for(let c=0;c<16;++c)n[c]=a[o+c];i();for(let c=0;c<16;++c)r[o+c]=s[c]}return r},t.getInverse=()=>Rn({matrix:ue.invertMatrix(Array.from(e.matrix),[],4),preMultiplyFlag:e.preMultiplyFlag}),t.translate=(a,r,n)=>{if(a===0&&r===0&&n===0)return;const s=An();mr(s,[a,r,n]),e.preMultiplyFlag?q(e.matrix,e.matrix,s):q(e.matrix,s,e.matrix),t.modified()},t.rotateWXYZ=(a,r,n,s)=>{if(r===0&&n===0&&s===0){Ic("No rotation applied, axis is zero vector.");return}if(a===0)return;const i=ue.radiansFromDegrees(a),o=vo();xo(o,[r,n,s],i);const c=new Float64Array(16);io(c,o),e.preMultiplyFlag?q(e.matrix,e.matrix,c):q(e.matrix,c,e.matrix),t.modified()},t.rotateX=a=>{t.rotateWXYZ(a,1,0,0)},t.rotateY=a=>{t.rotateWXYZ(a,0,1,0)},t.rotateZ=a=>{t.rotateWXYZ(a,0,0,1)},t.scale=(a,r,n)=>{if(a===1&&r===1&&n===1)return;const s=An();Na(s,[a,r,n]),e.preMultiplyFlag?q(e.matrix,e.matrix,s):q(e.matrix,s,e.matrix),t.modified()},t.transformNormal=(a,r=[])=>{const n=lt(Ye(),e.matrix),s=Ye();Xe(s,n);const i=Ye();return Tr(i,s),t.transformVector(a,r,i),ue.normalize(r),r},t.transformNormals=(a,r)=>{const n=a.getData(),s=r.getData(),i=[0,0,0],o=lt(Ye(),e.matrix),c=Ye();Xe(c,o);const u=Ye();Tr(u,c);for(let p=0;p<n.length;p+=3)i[0]=n[p],i[1]=n[p+1],i[2]=n[p+2],t.transformVector(i,i,u),ue.normalize(i),s[p]=i[0],s[p+1]=i[1],s[p+2]=i[2]},t.transformVector=(a,r=[],n=null)=>{const s=n||lt(Ye(),e.matrix);return Ct(r,a,s),r},t.transformVectors=(a,r)=>{const n=a.getData(),s=r.getData(),i=[0,0,0];for(let o=0;o<n.length;o+=3)i[0]=n[o],i[1]=n[o+1],i[2]=n[o+2],t.transformVector(i,i),ue.normalize(i),s[o]=i[0],s[o+1]=i[1],s[o+2]=i[2]},t.transformPointsNormalsVectors=(a,r,n,s,i,o,c=null,u=null)=>{const p=a.getNumberOfPoints(),l=c?.length??0,f=new Float64Array(3),g=new Float64Array(3),h=new Float64Array(3),d=new Float64Array(3);let v=!1,x=!1,C=!1;const T=[];for(let m=0;m<p;m++){if(a.getPoint(m,f),g.set(f),t.transformPoint(f,f),r.setPoint(m,...f),ue.areEquals(g,f)||(v=!0),i){const w=i.getData(),O=o.getData();f[0]=w[m*3],f[1]=w[m*3+1],f[2]=w[m*3+2],h.set(f),t.transformVector(f,f),O[m*3]=f[0],O[m*3+1]=f[1],O[m*3+2]=f[2],ue.areEquals(h,f)||(x=!0)}if(n){const w=n.getData(),O=s.getData();f[0]=w[m*3],f[1]=w[m*3+1],f[2]=w[m*3+2],d.set(f),t.transformNormal(f,f),O[m*3]=f[0],O[m*3+1]=f[1],O[m*3+2]=f[2],ue.areEquals(d,f)||(C=!0)}if(c)for(let w=0;w<l;w++){const O=c[w].getData(),B=u[w].getData();f[0]=O[m*3],f[1]=O[m*3+1],f[2]=O[m*3+2],h.set(f),t.transformVector(f,f),B[m*3]=f[0],B[m*3+1]=f[1],B[m*3+2]=f[2],!ue.arrayEqual(h,f)&&!T.includes(w)&&T.push(w)}}v&&r.modified(),x&&o.modified(),C&&s.modified(),T.forEach(m=>u[m].modified())}}var Gc={preMultiplyFlag:!1,matrix:[...Qi]};function ei(t,e,a={}){Object.assign(e,Gc,a),I.obj(t,e),I.setGet(t,e,["preMultiplyFlag"]),I.setGetArray(t,e,["matrix"],16),Nc(t,e)}Rn=I.newInstance(ei,"vtkTransform");var ti={newInstance:Rn,extend:ei},{vtkErrorMacro:la}=me;function Ac(t){const e=t.getPolys().getData(),a=t.getStrips().getData(),r={cellSize:0,cell:[],done:!1,polyIdx:0,stripIdx:0,remainingStripLength:0,next(){if(r.polyIdx<e.length){r.cellSize=e[r.polyIdx];const n=r.polyIdx+1,s=n+r.cellSize;r.polyIdx=s;let i=0;for(let o=n;o<s;++o)r.cell[i++]=e[o]}else if(r.stripIdx<a.length){r.cellSize=3,r.remainingStripLength===0&&(r.remainingStripLength=a[r.stripIdx]-2,r.stripIdx+=3);const n=r.stripIdx-2,s=r.stripIdx+1;r.stripIdx++,r.remainingStripLength--;let i=0;for(let o=n;o<s;++o)r.cell[i++]=a[o]}else if(!r.done)r.done=!0;else throw new Error("Iterator is done")}};return r.next(),r}function _c(t,e){e.classHierarchy.push("vtkCutter");const a={...t};t.getMTime=()=>{let n=a.getMTime();return e.cutFunction&&(n=Math.max(n,e.cutFunction.getMTime())),n};function r(n,s){const i=n.getPoints(),o=i.getData(),c=n.getPointData(),u=i.getNumberOfPoints(),p=[],l=[],f=[],g={},h=c.getNumberOfArrays();for(let O=0;O<h;O++)g[c.getArrayName(O)]=[];(!e.cutScalars||e.cutScalars.length<u)&&(e.cutScalars=new Float32Array(u));let d=0,v=0;for(;d<o.length;)e.cutScalars[v++]=e.cutFunction.evaluateFunction(o[d++],o[d++],o[d++]);const x=[],C=new Array(3),T=new Array(3),m=[];for(const O=Ac(n);!O.done;O.next()){if(O.cellSize<=2)continue;for(let y=0;y<O.cellSize;)m[y]=e.cutScalars[O.cell[y++]];const B=m[0]>0;let U=!0;for(let y=1;y<O.cell.length;y++)if(m[y]>0!==B){U=!1;break}if(U)continue;const F=[];for(let y=0;y<O.cellSize;y++){const S=y+1===O.cellSize?0:y+1,P=m[y]>0;if(m[S]>0===P)continue;let M=y,b=S,L=m[b]-m[M];L<=0&&(M=S,b=y,L*=-1);let R=0;L!==0&&(R=(e.cutValue-m[M])/L);const E=O.cell[M],k=O.cell[b];C[0]=o[E*3],C[1]=o[E*3+1],C[2]=o[E*3+2],T[0]=o[k*3],T[1]=o[k*3+1],T[2]=o[k*3+2];const N=[C[0]+R*(T[0]-C[0]),C[1]+R*(T[1]-C[1]),C[2]+R*(T[2]-C[2])],$={};for(let H=0;H<h;H++){const z=c.getArrayByIndex(H),J=c.getArrayName(H),j=z.getData(),oe=z.getNumberOfComponents(),ve=new Array(oe);for(let Y=0;Y<oe;Y++){const A=j[oe*E+Y],re=j[oe*k+Y];ve.push(A+R*(re-A))}$[J]=ve}F.push({pointEdge1:E,pointEdge2:k,intersectedPoint:N,intersectedArrays:$,newPointID:-1})}for(let y=0;y<F.length;y++){const S=F[y];let P=!1;for(let M=0;M<x.length;M++){const b=x[M],L=S.pointEdge1===b.pointEdge1&&S.pointEdge2===b.pointEdge2,R=S.intersectedPoint[0]===b.intersectedPoint[0]&&S.intersectedPoint[1]===b.intersectedPoint[1]&&S.intersectedPoint[2]===b.intersectedPoint[2];if(L||R){P=!0,F[y].newPointID=x[M].newPointID;break}}P||(p.push(S.intersectedPoint[0]),p.push(S.intersectedPoint[1]),p.push(S.intersectedPoint[2]),Object.keys(S.intersectedArrays).forEach(M=>{g[M].push(...S.intersectedArrays[M])}),F[y].newPointID=p.length/3-1,x.push(F[y]))}const D=F.length;D===2?l.push(D,F[0].newPointID,F[1].newPointID):D>2&&(f.push(D),F.forEach(y=>{f.push(y.newPointID)}))}s.getPoints().setData(eo(i.getDataType(),p),3);const w=s.getPointData();for(let O=0;O<h;O++){const B=c.getArrayName(O),U=ce.newInstance({name:B,dataType:c.getArrayByIndex(O).getDataType(),values:g[B],numberOfComponents:c.getArrayByIndex(O).getNumberOfComponents()});w.addArray(U)}l.length!==0&&s.getLines().setData(Uint16Array.from(l)),f.length!==0&&s.getPolys().setData(Uint16Array.from(f))}t.requestData=(n,s)=>{const i=n[0];if(!i){la("Invalid or missing input");return}if(!e.cutFunction){la("Missing cut function");return}const o=s[0]?.initialize()||Re.newInstance();r(i,o),s[0]=o}}var Wc={cutFunction:null,cutScalars:null,cutValue:0};function ri(t,e,a={}){Object.assign(e,Wc,a),de(t,e),Ji(t,e,1,1),ye(t,e,["cutFunction","cutValue"]),_c(t,e)}var zc=X(ri,"vtkCutter"),ni={newInstance:zc,extend:ri},{vtkErrorMacro:$c}=I,Kc=class{constructor(){this.segmentMapping={},this.segments=[null],this.faces=[]}addSegment(t){const e=t[0],a=t[t.length-1];if(e===a||t.length<2)return;const r=this.segmentMapping[e],n=this.segmentMapping[a];if(r!==void 0&&n!==void 0)if(Math.abs(r)===Math.abs(n)){const s=r<n?n:r,i=this.segments[s];if(r>0)for(let o=1;o<t.length-1;o++)i.push(t[o]);else for(let o=1;o<t.length-1;o++)i.unshift(t[t.length-1-o]);this.faces.push(i),this.segments[s]=null,this.segmentMapping[e]=void 0,this.segmentMapping[a]=void 0}else{const s=Math.abs(r),i=Math.abs(n),o=this.segments[s],c=this.segments[i];this.segments[s]=null,this.segments[i]=null,this.segmentMapping[o[0]]=void 0,this.segmentMapping[c[0]]=void 0,this.segmentMapping[o[o.length-1]]=void 0,this.segmentMapping[c[c.length-1]]=void 0,this.addSegment(t),this.addSegment(o),this.addSegment(c)}else if(r!==void 0){if(r>0){const s=this.segments[r];for(let i=1;i<t.length;i++)s.push(t[i]);this.segmentMapping[a]=r}else{const s=this.segments[-r];this.segmentMapping[a]=r;for(let i=1;i<t.length;i++)s.unshift(t[i])}this.segmentMapping[e]=void 0}else if(n!==void 0){if(n>0){const s=this.segments[n];for(let i=1;i<t.length;i++)s.push(t[t.length-1-i]);this.segmentMapping[e]=n}else{const s=this.segments[-n];this.segmentMapping[e]=n;for(let i=1;i<t.length;i++)s.unshift(t[t.length-i-1])}this.segmentMapping[a]=void 0}else{const s=this.segments.length;this.segments.push(t),this.segmentMapping[e]=-s,this.segmentMapping[a]=s}}};function Hc(t,e){e.classHierarchy.push("vtkClosedPolyLineToSurfaceFilter"),t.requestData=(a,r)=>{const n=a[0];if(!n){$c("Invalid or missing input");return}const s=r[0]?.initialize()||Re.newInstance();s.shallowCopy(n);const i=new Kc,o=n.getLines().getData();let c=0;for(;c<o.length;){const f=o[c++],g=[];for(let h=0;h<f;h++)g.push(o[c+h]);i.addSegment(g),c+=f}const{faces:u}=i;let p=u.length;for(let f=0;f<u.length;f++)p+=u[f].length;const l=new Uint16Array(p);c=0;for(let f=0;f<u.length;f++){const g=u[f];l[c++]=g.length;for(let h=0;h<g.length;h++)l[c++]=g[h]}s.setPolys(Je.newInstance({values:l,name:"faces"})),r[0]=s}}var jc={};function ai(t,e,a={}){Object.assign(e,jc,a),I.obj(t,e),I.algo(t,e,1,1),Hc(t,e)}var qc=I.newInstance(ai,"vtkClosedPolyLineToSurfaceFilter"),ii={newInstance:qc,extend:ai},{vtkErrorMacro:fa}=I;function Yc(t,e){e.classHierarchy.push("vtkImageDataOutlineFilter");const a={...t};t.requestData=(r,n)=>{const s=r[0];if(!s||!s.isA("vtkImageData")){fa("Invalid or missing input");return}const i=s.getSpatialExtent();if(!i){fa("Unable to fetch spatial extents of input image.");return}e._cubeSource.setBounds(i),e._cubeSource.setMatrix(s.getIndexToWorld()),n[0]=e._cubeSource.getOutputData()},t.getMTime=()=>Math.max(a.getMTime(),e._cubeSource.getMTime()),t.setGenerateFaces=e._cubeSource.setGenerateFaces,t.setGenerateLines=e._cubeSource.setGenerateLines,t.getGenerateFaces=e._cubeSource.getGenerateFaces,t.getGenerateLines=e._cubeSource.getGenerateLines}var Zc={};function oi(t,e,a={}){Object.assign(e,Zc,a),I.obj(t,e),I.algo(t,e,1,1),e._cubeSource=So.newInstance(),I.moveToProtected(t,e,["cubeSource","tmpOut"]),Yc(t,e)}var Xc=I.newInstance(oi,"vtkImageDataOutlineFilter"),si={newInstance:Xc,extend:oi};function ci({colorWindow:t,colorLevel:e,useLookupTableScalarRange:a,colorRange:r,volumeScale:n=1,volumeOffset:s=0}){let i=t,o=e;return a&&r&&(i=r[1]-r[0],o=.5*(r[1]+r[0])),{colorScale:n/i,colorShift:(s-o)/i+.5}}function ui({pwfRange:t,volumeScale:e=1,volumeOffset:a=0}){if(!t)return{opacityScale:1,opacityShift:0};const r=t[1]-t[0],n=.5*(t[0]+t[1]);return{opacityScale:e/r,opacityShift:(a-n)/r+.5}}function pa({currentValidInputs:t,independentComponents:e,numberOfRows:a,kind:r,getInputProperty:n}){if(!t.length)return"0";const s=r==="color"?"getRGBTransferFunction":"getPiecewiseFunction",i=[];for(let o=0;o<a;o++){const c=n(t[o].inputIndex),u=c?.[s]?.(0);i.push(`${c?.getMTime?.()??0}:${u?.getMTime?.()??0}`)}return i.join("|")}var Lt=new Float64Array(9),Ie=[0,0,0],Ne=[0,0,0],ga=Ga(),da=Ga();function li(t,e=[0,0,1]){if(e[0]=0,e[1]=0,e[2]=1,t){const a=t.getNormal();e[0]=a[0],e[1]=a[1],e[2]=a[2]}return ue.normalize(e),Ie[0]=0,Ie[1]=0,Ie[2]=0,Ne[0]=0,Ne[1]=0,Ne[2]=0,t?(ue.perpendiculars(e,Ie,Ne,0),(ue.norm(Ie)<1e-6||ue.norm(Ne)<1e-6)&&(Ie[0]=1,Ie[1]=0,Ie[2]=0,Ne[0]=0,Ne[1]=1,Ne[2]=0)):(Ie[0]=1,Ne[1]=1),{planeNormal:e,tangent1:Ie,tangent2:Ne}}function xn(t,e,a,r){Aa(Lt,...t.getDirection()),Xe(Lt,Lt),Ct(ga,e,Lt),Ct(da,a,Lt);const n=t.getDimensions(),s=t.getSpacing(),i=Math.min(Math.abs(s[0]),Math.abs(s[1]),Math.abs(s[2]));return r[0]=i/(n[0]*Math.abs(s[0])),r[1]=i/(n[1]*Math.abs(s[1])),r[2]=i/(n[2]*Math.abs(s[2])),{tangent1:ga,tangent2:da,texelSize:r}}var Kr=[0,0,0];function Qc(t){ue.normalize(t);for(let e=0;e<3;++e){oo(Kr),Kr[e]=1;const a=ue.dot(t,Kr);if(a<-.999999||a>.999999)return[!0,e]}return[!1,2]}function fi(t,e,a){for(let r=0;r<a;++r)t[3*r]=e[0],t[3*r+1]=e[1],t[3*r+2]=e[2]}function pi(t,e){let a="",r=!0,n=2;const s=e?.getBounds(),i=t.getSlicePolyData();let o=t.getSlicePlane();if(i)a=`PolyData${i.getMTime()}`;else if(o){if(a=`Plane${o.getMTime()}`,e){a=`${a}Image${e.getMTime()}`;const c=Ye();Aa(c,...e.getDirection()),Xe(c,c);const u=[...o.getNormal()];Ct(u,u,c),[r,n]=Qc(u)}}else{o=yo.newInstance(),o.setNormal(0,0,1);let c=[0,1,0,1,0,1];e&&(c=s),o.setOrigin(c[0],c[2],.5*(c[4]+c[5])),t.setSlicePlane(o),a=`Plane${o.getMTime()}Image${e?.getMTime?.()??0}`}return{resGeomString:a,slicePD:i,slicePlane:o,orthoSlicing:r,orthoAxis:n}}function gi(t,e,a,r,n){a.setInputData(t),r.setInputConnection(a.getOutputPort()),r.setCutFunction(e),n.setInputConnection(r.getOutputPort()),n.update();const s=n.getOutputData(),i=s.getPoints().getData(),o=s.getPolys().getData(),c=[...e.getNormal()];ue.normalize(c);const u=s.getPoints().getNumberOfPoints(),p=new Float32Array(u*3);return fi(p,c,u),{points:i,polys:o,normalsData:p}}function di(t,e,a,r){const n=new Float32Array(12),s=t.worldToIndex(e.getOrigin(),[0,0,0]),i=[(a+1)%3,(a+2)%3].sort(),o=t.getSpatialExtent();let c=0;for(let f=0;f<2;++f)for(let g=0;g<2;++g)n[c+a]=s[a],n[c+i[0]]=o[2*i[0]+g],n[c+i[1]]=o[2*i[1]+f],c+=3;r.setMatrix(t.getIndexToWorld()),r.transformPoints(n,n);const u=new Uint16Array([3,0,1,3,3,0,3,2]),p=[...e.getNormal()];ue.normalize(p);const l=new Float32Array(12);return fi(l,p,4),{points:n,polys:u,normalsData:l}}var Jc=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkImageResliceMapperVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

// all variables that represent positions or directions have a suffix
// indicating the coordinate system they are in. The possible values are
// MC - Model coordinates
// WC - World coordinates
// VC - View coordinates
// DC - Display coordinates
// TC - Texture coordinates

// frag position in VC
//VTK::PositionVC::Dec

// Texture coordinates
//VTK::TCoord::Dec

// picking support
//VTK::Picking::Dec

// camera and actor matrix values
//VTK::Camera::Dec

void main()
{
  //VTK::PositionVC::Impl

  //VTK::TCoord::Impl

  //VTK::Picking::Impl
}
`,eu=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkImageResliceMapperFS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// Template for the gpu image mapper fragment shader

// VC position of this fragment
//VTK::PositionVC::Dec

// Texture coordinates
//VTK::TCoord::Dec

// picking support
//VTK::Picking::Dec

// handle coincident offsets
//VTK::Coincident::Dec

//VTK::ZBuffer::Dec

// the output of this shader
//VTK::Output::Dec

void main()
{
  // VC position of this fragment. This should not branch/return/discard.
  //VTK::PositionVC::Impl

  // Place any calls that require uniform flow (e.g. dFdx) here.
  //VTK::UniformFlow::Impl

  // Set gl_FragDepth here (gl_FragCoord.z by default)
  //VTK::Depth::Impl

  // Early depth peeling abort:
  //VTK::DepthPeeling::PreColor

  //VTK::TCoord::Impl

  if (gl_FragData[0].a <= 0.0)
    {
    discard;
    }

  //VTK::DepthPeeling::Impl

  //VTK::Picking::Impl

  // handle coincident offsets
  //VTK::Coincident::Impl

  //VTK::ZBuffer::Impl

  //VTK::RenderPassFragmentShader::Impl
}
`,{vtkErrorMacro:at}=me,Hr=t=>t.split(`
`).map(e=>e.trim()).filter(Boolean);function ha(t,e,a){return e.identity(a),t.reduce((r,n,s)=>s===0?n?e.copy(r,n):e.identity(r):n?e.multiply(r,r,n):r,a)}function tu(t,e){e.classHierarchy.push("vtkOpenGLImageResliceMapper");const a=new Map;function r(d,v){if(!v)return;const x=(a.get(v)??0)-1;x<=0?(d.unregisterGraphicsResourceUser(v,t),a.delete(v)):a.set(v,x)}function n(d,v){if(!v)return;const x=a.get(v)??0,C=x+1;a.set(v,C),x<=0&&d.registerGraphicsResourceUser(v,t)}function s(d,v,x){v!==x&&(r(d,v),n(d,x))}function i(d){[...a.keys()].forEach(v=>d.unregisterGraphicsResourceUser(v,t))}t.buildPass=d=>{if(d){e.currentRenderPass=null,e._openGLImageSlice=t.getFirstAncestorOfType("vtkOpenGLImageSlice"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");const v=e._openGLRenderer.getRenderable();e._openGLCamera=e._openGLRenderer.getViewNodeFor(v.getActiveCamera(),e.openGLCamera);const x=e._openGLRenderWindow;e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),x&&!x.isDeleted()&&x!==e._openGLRenderWindow&&i(x),e.context=e._openGLRenderWindow.getContext(),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow)}},t.translucentPass=(d,v)=>{d&&(e.currentRenderPass=v,t.render())},t.zBufferPass=d=>{d&&(e.haveSeenDepthRequest=!0,e.renderDepth=!0,t.render(),e.renderDepth=!1)},t.opaqueZBufferPass=d=>t.zBufferPass(d),t.opaquePass=d=>{d&&t.render()},t.getCoincidentParameters=(d,v)=>e.renderable.getResolveCoincidentTopology()==Vt.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.render=()=>{const d=e._openGLImageSlice.getRenderable(),v=e._openGLRenderer.getRenderable();t.renderPiece(v,d)},t.renderPiece=(d,v)=>{t.invokeEvent({type:"StartEvent"}),e.renderable.update();const x=e.renderable.getNumberOfInputPorts();e.currentValidInputs=[];for(let m=0;m<x;++m){const w=e.renderable.getInputData(m);w&&!w.isDeleted()&&e.currentValidInputs.push({imageData:w,inputIndex:m})}const C=e.currentValidInputs.length;if(C<=0){at("No input!");return}e.labelOutlineProperties=zi(v,e.currentValidInputs);const T=e.currentValidInputs[0].imageData.getPointData().getScalars();e.multiTexturePerVolumeEnabled=C>1,e.numberOfComponents=e.multiTexturePerVolumeEnabled?C:T.getNumberOfComponents(),t.updateResliceGeometry(),t.renderPieceStart(d,v),t.renderPieceDraw(d,v),t.renderPieceFinish(d,v),t.invokeEvent({type:"EndEvent"})},t.renderPieceStart=(d,v)=>{t.updateBufferObjects(d,v);const x=v.getProperties();e.currentValidInputs.forEach(({inputIndex:C},T)=>{const m=x[C],w=e.scalarTextures[T];!m||!w||(m.getInterpolationType()===qe.NEAREST?(w.setMinificationFilter(_.NEAREST),w.setMagnificationFilter(_.NEAREST)):(w.setMinificationFilter(_.LINEAR),w.setMagnificationFilter(_.LINEAR)))}),x[e.currentValidInputs[0].inputIndex]?.getInterpolationType()===qe.NEAREST?(e.colorTexture.setMinificationFilter(_.NEAREST),e.colorTexture.setMagnificationFilter(_.NEAREST),e.pwfTexture.setMinificationFilter(_.NEAREST),e.pwfTexture.setMagnificationFilter(_.NEAREST)):(e.colorTexture.setMinificationFilter(_.LINEAR),e.colorTexture.setMagnificationFilter(_.LINEAR),e.pwfTexture.setMinificationFilter(_.LINEAR),e.pwfTexture.setMagnificationFilter(_.LINEAR)),e.lastBoundBO=null},t.renderPieceDraw=(d,v)=>{const x=e.context,C=e.labelOutlineProperties.length>0,T=[...e.scalarTextures,e.colorTexture,e.pwfTexture];C&&(T.push(e.labelOutlineThicknessTexture),T.push(e.labelOutlineOpacityTexture)),T.forEach(m=>m.activate()),t.updateShaders(e.tris,d,v),x.drawArrays(x.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release(),T.forEach(m=>m.deactivate())},t.renderPieceFinish=(d,v)=>{},t.updateBufferObjects=(d,v)=>{t.getNeedToRebuildBufferObjects(d,v)&&t.buildBufferObjects(d,v)},t.getNeedToRebuildBufferObjects=(d,v)=>{const x=v.getProperty(e.currentValidInputs[0].inputIndex),C=e.labelOutlineProperties.length>0;return e.VBOBuildTime.getMTime()<t.getMTime()||e.VBOBuildTime.getMTime()<v.getMTime()||e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.VBOBuildTime.getMTime()<x?.getMTime()||e.currentValidInputs.some(({imageData:T})=>e.VBOBuildTime.getMTime()<T.getMTime())||e.VBOBuildTime.getMTime()<e.resliceGeom.getMTime()||e.scalarTextures.length!==e.currentValidInputs.length||!e.scalarTextures.every(T=>!!T?.getHandle())||!e.colorTexture?.getHandle()||!e.pwfTexture?.getHandle()||C&&(!e.labelOutlineThicknessTexture?.getHandle()||!e.labelOutlineOpacityTexture?.getHandle())},t.buildBufferObjects=(d,v)=>{const x=v.getProperties();e.currentValidInputs.forEach(({imageData:b,inputIndex:L},R)=>{const E=b.getPointData().getScalars(),k=e._openGLRenderWindow.getGraphicsResourceForObject(E),N=Ln(b,E),$=!k?.oglObject?.getHandle()||k?.hash!==N,H=x[L],z=H?.getUpdatedExtents()??[],J=!!z.length;if($&&!J){const j=K.newInstance();j.setOpenGLRenderWindow(e._openGLRenderWindow);const oe=b.getDimensions();j.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),j.resetFormatAndType(),j.create3DFilterableFromDataArray({width:oe[0],height:oe[1],depth:oe[2],dataArray:E}),e._openGLRenderWindow.setGraphicsResourceForObject(E,j,N),e.scalarTextures[R]=j}else e.scalarTextures[R]=k.oglObject;if(J){H.setUpdatedExtents([]);const j=b.getDimensions();e.scalarTextures[R].create3DFilterableFromDataArray({width:j[0],height:j[1],depth:j[2],dataArray:E,updatedExtents:z})}s(e._openGLRenderWindow,e._scalarTexturesCore[R],E),e._scalarTexturesCore[R]=E});const C=x[e.currentValidInputs[0].inputIndex];if(!C){at("Missing property for first input");return}const T=C.getIndependentComponents(),m=T?e.numberOfComponents:1,w=T?2*m:1,O=[];for(let b=0;b<m;++b)if(e.multiTexturePerVolumeEnabled){const L=e.currentValidInputs[b],R=L?x[L.inputIndex]:null;O.push(R?.getRGBTransferFunction()||null)}else O.push(C.getRGBTransferFunction(b));const B=Qe(O,T,m),U=C.getRGBTransferFunction(),F=e._openGLRenderWindow.getGraphicsResourceForObject(U);if(!F?.oglObject?.getHandle()||F?.hash!==B){let b=e.renderable.getColorTextureWidth();b<=0&&(b=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const L=b*w*3,R=new Uint8ClampedArray(L),E=K.newInstance();if(E.setOpenGLRenderWindow(e._openGLRenderWindow),U){const k=new Float32Array(b*3);for(let N=0;N<m;N++){const $=O[N];if($){const H=$.getRange();if($.getTable(H[0],H[1],b,k,1),T)for(let z=0;z<b*3;z++)R[N*b*6+z]=255*k[z],R[N*b*6+z+b*3]=255*k[z];else for(let z=0;z<b*3;z++)R[N*b*3+z]=255*k[z]}}E.resetFormatAndType(),E.create2DFromRaw({width:b,height:w,numComps:3,dataType:se.UNSIGNED_CHAR,data:R})}else{for(let k=0;k<b*3;++k){const N=255*k/((b-1)*3);for(let $=0;$<w;++$)R[$*b*3+k+0]=N,R[$*b*3+k+1]=N,R[$*b*3+k+2]=N}E.resetFormatAndType(),E.create2DFromRaw({width:b,height:1,numComps:3,dataType:se.UNSIGNED_CHAR,data:R})}U&&e._openGLRenderWindow.setGraphicsResourceForObject(U,E,B),e.colorTexture=E}else e.colorTexture=F.oglObject;s(e._openGLRenderWindow,e._colorTextureCore,U),e._colorTextureCore=U;const D=[];for(let b=0;b<m;++b)if(e.multiTexturePerVolumeEnabled){const L=e.currentValidInputs[b],R=L?x[L.inputIndex]:null;D.push(R?.getPiecewiseFunction()||null)}else D.push(C.getPiecewiseFunction(b));const y=Qe(D,T,m),S=C.getPiecewiseFunction(),P=e._openGLRenderWindow.getGraphicsResourceForObject(S);if(!P?.oglObject?.getHandle()||P?.hash!==y){let b=e.renderable.getOpacityTextureWidth();b<=0&&(b=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const L=b*w,R=new Uint8ClampedArray(L),E=K.newInstance();if(E.setOpenGLRenderWindow(e._openGLRenderWindow),S){const k=new Float32Array(L),N=new Float32Array(b);for(let $=0;$<m;++$){const H=D[$];if(H===null)k.fill(1);else{const z=H.getRange();if(H.getTable(z[0],z[1],b,N,1),T)for(let J=0;J<b;J++)k[$*b*2+J]=N[J],k[$*b*2+J+b]=N[J];else for(let J=0;J<b;J++)k[J]=N[J]}}E.resetFormatAndType(),E.create2DFromRaw({width:b,height:w,numComps:1,dataType:se.FLOAT,data:k})}else R.fill(255),E.resetFormatAndType(),E.create2DFromRaw({width:b,height:w,numComps:1,dataType:se.UNSIGNED_CHAR,data:R});S&&e._openGLRenderWindow.setGraphicsResourceForObject(S,E,y),e.pwfTexture=E}else e.pwfTexture=P.oglObject;s(e._openGLRenderWindow,e._pwfTextureCore,S),e._pwfTextureCore=S,e.labelOutlineProperties.length>0&&(t.updateLabelOutlineThicknessTexture(e.labelOutlineProperties),t.updateLabelOutlineOpacityTexture(e.labelOutlineProperties));const M=`${e.resliceGeom.getMTime()}A${e.renderable.getSlabThickness()}`;if(!e.tris.getCABO().getElementCount()||e.VBOBuildString!==M){const b=ce.newInstance({numberOfComponents:3,values:e.resliceGeom.getPoints().getData()});b.setName("points");const L=Je.newInstance({values:e.resliceGeom.getPolys().getData()}),R={points:b,cellOffset:0,forceFlatten:!0};if(e.renderable.getSlabThickness()>0){const E=e.resliceGeom.getPointData().getNormals();E?R.normals=E:at("Slab mode requested without normals")}e.tris.getCABO().createVBO(L,"polys",bt.SURFACE,R)}e.VBOBuildString=M,e.VBOBuildTime.modified()},t.updateShaders=(d,v,x)=>{if(e.lastBoundBO=d,t.getNeedToRebuildShaders(d,v,x)){const C={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(C,v,x);const T=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(C.Vertex,C.Fragment,C.Geometry);T!==d.getProgram()&&(d.setProgram(T),d.getVAO().releaseGraphicsResources()),d.getShaderSourceTime().modified()}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(d.getProgram());d.getVAO().bind(),t.setMapperShaderParameters(d,v,x),t.setCameraShaderParameters(d,v,x),t.setPropertyShaderParameters(d,v,x)},t.setMapperShaderParameters=(d,v,x)=>{const C=d.getProgram(),T=e.currentValidInputs[0].imageData;if(d.getCABO().getElementCount()&&(e.VBOBuildTime.getMTime()>d.getAttributeUpdateTime().getMTime()||d.getShaderSourceTime().getMTime()>d.getAttributeUpdateTime().getMTime())){e.scalarTextures.forEach((w,O)=>{C.setUniformi(`volumeTexture[${O}]`,w.getTextureUnit())}),C.isAttributeUsed("vertexWC")&&(d.getVAO().addAttributeArray(C,d.getCABO(),"vertexWC",d.getCABO().getVertexOffset(),d.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||at("Error setting vertexWC in shader VAO.")),C.isAttributeUsed("normalWC")&&(d.getVAO().addAttributeArray(C,d.getCABO(),"normalWC",d.getCABO().getNormalOffset(),d.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||at("Error setting normalWC in shader VAO.")),C.isUniformUsed("slabThickness")&&C.setUniformf("slabThickness",e.renderable.getSlabThickness()),C.isUniformUsed("spacing")&&C.setUniform3fv("spacing",T.getSpacing()),C.isUniformUsed("slabType")&&C.setUniformi("slabType",e.renderable.getSlabType()),C.isUniformUsed("slabTrapezoid")&&C.setUniformi("slabTrapezoid",e.renderable.getSlabTrapezoidIntegration());const m=d.getCABO().getCoordShiftAndScaleEnabled()?d.getCABO().getInverseShiftAndScaleMatrix():null;for(let w=0;w<e.currentValidInputs.length;w++){const O=`WCTCMatrix${w}`;if(C.isUniformUsed(O)){const B=e.currentValidInputs[w].imageData,U=B.getDimensions();Ce(e.tmpMat4,B.getIndexToWorld()),we(e.tmpMat4,e.tmpMat4,[-.5,-.5,-.5]),Pt(e.tmpMat4,e.tmpMat4,U),Se(e.tmpMat4,e.tmpMat4),m&&q(e.tmpMat4,e.tmpMat4,m),C.setUniformMatrix(O,e.tmpMat4)}}C.isUniformUsed("vboScaling")&&C.setUniform3fv("vboScaling",d.getCABO().getCoordScale()??[1,1,1]),d.getAttributeUpdateTime().modified()}if(e.haveSeenDepthRequest&&d.getProgram().setUniformi("depthRequest",e.renderDepth?1:0),d.getProgram().isUniformUsed("coffset")){const m=t.getCoincidentParameters(v,x);d.getProgram().setUniformf("coffset",m.offset),d.getProgram().isUniformUsed("cfactor")&&d.getProgram().setUniformf("cfactor",m.factor)}},t.setCameraShaderParameters=(d,v,x)=>{const C=e._openGLCamera.getKeyMatrices(v),T=e._openGLImageSlice.getKeyMatrices(),m=d.getCABO().getCoordShiftAndScaleEnabled()?d.getCABO().getInverseShiftAndScaleMatrix():null,w=d.getProgram();w.isUniformUsed("MCPCMatrix")&&(Z(e.tmpMat4),w.setUniformMatrix("MCPCMatrix",ha([C.wcpc,T.mcwc,m],Et,e.tmpMat4))),w.isUniformUsed("MCVCMatrix")&&(Z(e.tmpMat4),w.setUniformMatrix("MCVCMatrix",ha([C.wcvc,T.mcwc,m],Et,e.tmpMat4)))},t.setPropertyShaderParameters=(d,v,x)=>{const C=d.getProgram(),T=x.getProperty(e.currentValidInputs[0].inputIndex),m=e.multiTexturePerVolumeEnabled?1:T.getOpacity();C.setUniformf("opacity",m);const w=e.numberOfComponents,O=T.getIndependentComponents(),B=e.multiTexturePerVolumeEnabled,U=x.getProperties();if(O)for(let y=0;y<w;++y){const S=B?U[e.currentValidInputs[y].inputIndex]:T;C.setUniformf(`mix${y}`,S.getComponentWeight(0))}for(let y=0;y<w;y++){const S=B?y:0,P=B?0:y,M=e.scalarTextures[S].getVolumeInfo(),b=M.scale[P],L=M.offset[P],R=O?y:0,E=B?U[e.currentValidInputs[y].inputIndex]:T,k=E.getColorWindow(),N=E.getColorLevel(),$=E.getRGBTransferFunction(B?0:R),{colorScale:H,colorShift:z}=ci({colorWindow:k,colorLevel:N,useLookupTableScalarRange:E.getUseLookupTableScalarRange(),colorRange:$?.getRange?.(),volumeScale:b,volumeOffset:L});C.setUniformf(`cshift${y}`,z),C.setUniformf(`cscale${y}`,H);const{opacityScale:J,opacityShift:j}=ui({pwfRange:E.getPiecewiseFunction(B?0:R)?.getRange?.(),volumeScale:b,volumeOffset:L});C.setUniformf(`pwfshift${y}`,j),C.setUniformf(`pwfscale${y}`,J)}const F=e.colorTexture.getTextureUnit();C.setUniformi("colorTexture1",F);const D=e.pwfTexture.getTextureUnit();if(C.setUniformi("pwfTexture1",D),C.setUniform4fv("backgroundColor",e.renderable.getBackgroundColor()),e.labelOutlineProperties.length>0){const y=e.labelOutlineThicknessTexture.getTextureUnit();C.setUniformi("labelOutlineThicknessTexture",y);const S=e.labelOutlineOpacityTexture.getTextureUnit();C.setUniformi("labelOutlineOpacityTexture",S);let P=e.renderable.getLabelOutlineTextureWidth();P<=0&&(P=e.context.getParameter(e.context.MAX_TEXTURE_SIZE)),C.setUniformf("labelOutlineTextureWidth",P),C.setUniformf("numLabelmaps",e.labelOutlineProperties.length);const{tangent1:M,tangent2:b}=li(e.renderable.getSlicePlane());for(let L=0;L<e.currentValidInputs.length;L++){const R=e.currentValidInputs[L].imageData,{tangent1:E,tangent2:k}=xn(R,M,b,e._tmpTexelSize),N=`outlineTangent1_${L}`,$=`outlineTangent2_${L}`;C.isUniformUsed(N)&&C.setUniform3fv(N,E),C.isUniformUsed($)&&C.setUniform3fv($,k)}for(let L=0;L<e.currentValidInputs.length;L++){const R=`texelSize${L}`;if(C.isUniformUsed(R)){const E=e.currentValidInputs[L].imageData,{texelSize:k}=xn(E,M,b,e._tmpTexelSize);C.setUniform3fv(R,k)}}}},t.getNeedToRebuildShaders=(d,v,x)=>{const C=x.getProperty(e.currentValidInputs[0].inputIndex).getIndependentComponents(),T=e.labelOutlineProperties.length>0,m=e.renderable.getSlabThickness(),w=e.renderable.getSlabType(),O=e.renderable.getSlabTrapezoidIntegration();let B=!1;(!e.currentRenderPass&&e.lastRenderPassShaderReplacement||e.currentRenderPass&&e.currentRenderPass.getShaderReplacement()!==e.lastRenderPassShaderReplacement)&&(B=!0);const U=e.currentValidInputs?.length??0;return B||e.lastHaveSeenDepthRequest!==e.haveSeenDepthRequest||e.lastNumberOfComponents!==e.numberOfComponents||e.lastMultiTexturePerVolumeEnabled!==e.multiTexturePerVolumeEnabled||d.getProgram()?.getHandle()===0||e.lastIndependentComponents!==C||e.lastUseLabelOutline!==T||e.lastNumValidInputs!==U||e.lastSlabThickness!==m||e.lastSlabType!==w||e.lastSlabTrapezoidIntegration!==O?(e.lastHaveSeenDepthRequest=e.haveSeenDepthRequest,e.lastNumberOfComponents=e.numberOfComponents,e.lastMultiTexturePerVolumeEnabled=e.multiTexturePerVolumeEnabled,e.lastIndependentComponents=C,e.lastUseLabelOutline=T,e.lastNumValidInputs=U,e.lastSlabThickness=m,e.lastSlabType=w,e.lastSlabTrapezoidIntegration=O,!0):!1},t.getShaderTemplate=(d,v,x)=>{d.Vertex=Jc,d.Fragment=eu,d.Geometry=""},t.replaceShaderValues=(d,v,x)=>{if(t.replaceShaderTCoord(d,v,x),t.replaceShaderPositionVC(d,v,x),e.haveSeenDepthRequest){let C=d.Fragment;C=V.substitute(C,"//VTK::ZBuffer::Dec","uniform int depthRequest;").result,C=V.substitute(C,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float iz = floor(gl_FragCoord.z*65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result,d.Fragment=C}t.replaceShaderCoincidentOffset(d,v,x)};function o(d,v){const x=["r","g","b","a"],C=Array.from({length:v},(O,B)=>B).filter(O=>!d.includes(O)),T=d.map(O=>`vec3 labelTexCoord${O} = (WCTCMatrix${O} * vec4(fragWorldPos, 1.0)).xyz;`).join(`
                `),m=d.length===0?"":`float neighborLabel = ${d.map((O,B)=>B===0?`(labelInputIdx == ${B}) ? texture(volumeTexture[${O}], neighborTexCoord).r`:` : (labelInputIdx == ${B}) ? texture(volumeTexture[${O}], neighborTexCoord).r`).join("")} : 0.0;`,w=[...C,...d].map(O=>{const B=d.includes(O),U=d.indexOf(O);return B?`
        // Process input ${O} as labelmap
        {
          float labelValue = tvalue.${x[O]};
          int segmentIndex = int(labelValue * 255.0);

          if (segmentIndex > 0) {
            float textureCoordinate = float(segmentIndex - 1) / labelOutlineTextureWidth;
            float labelmapRow = (float(${U}) + 0.5) / numLabelmaps;
            float thicknessValue = texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, labelmapRow)).r;
            float labelOutlineOpacityValue = texture2D(labelOutlineOpacityTexture, vec2(textureCoordinate, labelmapRow)).r;
            int actualThickness = int(thicknessValue * 255.0);

            vec3 currentLabelTC = labelTexCoord${O};
            vec3 currentTexelSize = texelSize${O};
            vec3 currentTangent1 = outlineTangent1_${O};
            vec3 currentTangent2 = outlineTangent2_${O};

            bool pixelOnBorder = false;
            int labelInputIdx = ${U};
            for (int i = -actualThickness; i <= actualThickness; i++) {
              for (int j = -actualThickness; j <= actualThickness; j++) {
                if (i == 0 && j == 0) continue;
                vec3 neighborTexCoord = currentLabelTC + float(i) * currentTangent1 * currentTexelSize + float(j) * currentTangent2 * currentTexelSize;
                if (any(greaterThan(neighborTexCoord, vec3(1.0))) || any(lessThan(neighborTexCoord, vec3(0.0)))) {
                  pixelOnBorder = true;
                  break;
                }
                ${m}
                if (neighborLabel != labelValue) {
                  pixelOnBorder = true;
                  break;
                }
              }
              if (pixelOnBorder) break;
            }

            if (pixelOnBorder) {
              convergentColor.rgb = mix(convergentColor.rgb, tcolor${O}.rgb, labelOutlineOpacityValue);
              convergentColor.a = max(convergentColor.a, labelOutlineOpacityValue);
            } else if (compWeight${O} > 0.0) {
              float fillAlpha = compWeight${O} * opacity;
              convergentColor.rgb = mix(convergentColor.rgb, tcolor${O}.rgb, fillAlpha);
              convergentColor.a = max(convergentColor.a, fillAlpha);
            }
          }
        }`:`
        // Process input ${O} as background image
        {
          float bgAlpha = compWeight${O} * opacity;
          convergentColor.rgb = mix(convergentColor.rgb, tcolor${O}.rgb, bgAlpha);
          convergentColor.a = max(convergentColor.a, bgAlpha);
        }`}).join(`
        `);return Hr(`
      // Multi-texture mode: ${d.length>0?`labelmaps at input${d.length>1?"s":""} ${d.join(", ")}`:"no labelmaps"}, ${C.length>0?`background at input${C.length>1?"s":""} ${C.join(", ")}`:"no background"}
      vec4 convergentColor = vec4(0.0, 0.0, 0.0, 0.0);

      // Compute labelmap texture coordinates
      ${T}

      // Process each input in order
      ${w}

      gl_FragData[0] = convergentColor;
    `)}function c(){return["vec4 compositeValue(vec4 currVal, vec4 valToComp, int trapezoid)","{","  vec4 retVal = vec4(1.0);","  if (slabType == 0) // min","  {","    retVal = min(currVal, valToComp);","  }","  else if (slabType == 1) // max","  {","    retVal = max(currVal, valToComp);","  }","  else if (slabType == 3) // sum","  {","    retVal = currVal + (trapezoid > 0 ? 0.5 * valToComp : valToComp); ","  }","  else // mean","  {","    retVal = currVal + (trapezoid > 0 ? 0.5 * valToComp : valToComp); ","  }","  return retVal;","}"]}function u(){return["// Get the first and last samples","int numSlices = 1;","float scaling = min(min(spacing.x, spacing.y), spacing.z) * 0.5;","vec3 slabNormal = normalize(normalWCVSOutput);","vec3 normalxspacing = scaling * slabNormal;","float distTraveled = length(normalxspacing);","int trapezoid = 0;","// Each march direction leaves the volume for good once it exits the","// unit cube (the sample positions are monotonic along a line and the","// cube is convex), so the loop can stop as soon as both directions","// have exited. Slab thicknesses larger than the volume then only cost","// the in-volume portion of the march.","bool negExited = false;","bool posExited = false;","while (distTraveled < slabThickness * 0.5)","{","  distTraveled += length(normalxspacing);","  float fnumSlices = float(numSlices);","  bool atSlabBoundary = false;","  if (distTraveled > slabThickness * 0.5)","  {","    // Before stepping outside the slab, sample at the boundaries","    normalxspacing = slabNormal * slabThickness * 0.5 / fnumSlices;","    trapezoid = slabTrapezoid;","    atSlabBoundary = true;","  }","  vec3 worldPosNeg = vertexWCVSOutput.xyz - fnumSlices * normalxspacing * vboScaling;","  vec3 fragTCoordNeg = (WCTCMatrix0 * vec4(worldPosNeg, 1.0)).xyz;","  if (!any(greaterThan(fragTCoordNeg, vec3(1.0))) && !any(lessThan(fragTCoordNeg, vec3(0.0))))","  {","    vec4 newVal = rawSampleTexture(worldPosNeg);","    tvalue = compositeValue(tvalue, newVal, trapezoid);","    numSlices += 1;","  }","  else if (!atSlabBoundary)","  {","    negExited = true;","  }","  vec3 worldPosPos = vertexWCVSOutput.xyz + fnumSlices * normalxspacing * vboScaling;","  vec3 fragTCoordPos = (WCTCMatrix0 * vec4(worldPosPos, 1.0)).xyz;","  if (!any(greaterThan(fragTCoordPos, vec3(1.0))) && !any(lessThan(fragTCoordPos, vec3(0.0))))","  {","    vec4 newVal = rawSampleTexture(worldPosPos);","    tvalue = compositeValue(tvalue, newVal, trapezoid);","    numSlices += 1;","  }","  else if (!atSlabBoundary)","  {","    posExited = true;","  }","  if (negExited && posExited) { break; }","}","// Finally, if slab type is *mean*, divide the sum by the numSlices","if (slabType == 2)","{","  tvalue = tvalue / float(numSlices);","}"]}function p(){return["// Returns a bitmask of the labels (1..31) present along the slab","// centered at startTC. Marches in texture space and exits as soon as","// the ray leaves the unit cube, so only the in-volume portion of the","// slab is sampled regardless of how large the slab thickness is.","int labelSlabMask(vec3 startTC, vec3 stepTC, float halfSlab, float stepLen)","{","  int mask = 0;","  vec3 tc = startTC;","  float dist = 0.0;","  for (int i = 0; i < 4096; ++i)","  {","    if (dist > halfSlab) { break; }","    if (any(greaterThan(tc, vec3(1.0))) || any(lessThan(tc, vec3(0.0)))) { break; }","    int label = int(texture(volumeTexture[0], tc).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask |= (1 << label); }","    tc += stepTC;","    dist += stepLen;","  }","  tc = startTC - stepTC;","  dist = stepLen;","  for (int i = 0; i < 4096; ++i)","  {","    if (dist > halfSlab) { break; }","    if (any(greaterThan(tc, vec3(1.0))) || any(lessThan(tc, vec3(0.0)))) { break; }","    int label = int(texture(volumeTexture[0], tc).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask |= (1 << label); }","    tc -= stepTC;","    dist += stepLen;","  }","  return mask;","}","","// Number of stepTC-sized steps from p that stay inside the unit cube","float labelSlabBoxSteps(vec3 p, vec3 stepTC)","{","  vec3 limit = vec3(65536.0);","  if (stepTC.x > 1e-8) { limit.x = (1.0 - p.x) / stepTC.x; }","  else if (stepTC.x < -1e-8) { limit.x = -p.x / stepTC.x; }","  if (stepTC.y > 1e-8) { limit.y = (1.0 - p.y) / stepTC.y; }","  else if (stepTC.y < -1e-8) { limit.y = -p.y / stepTC.y; }","  if (stepTC.z > 1e-8) { limit.z = (1.0 - p.z) / stepTC.z; }","  else if (stepTC.z < -1e-8) { limit.z = -p.z / stepTC.z; }","  return min(limit.x, min(limit.y, limit.z));","}","","// First label of labelMask found when marching the slab from its","// viewer-side end toward the back, so overlapping labels resolve in","// depth order; returns 0 when none of the mask labels is found","int labelSlabFrontLabel(vec3 startTC, vec3 towardCameraTC, float halfSlab, float stepLen, int labelMask)","{","  float slabSteps = halfSlab / stepLen;","  float nFront = min(slabSteps, labelSlabBoxSteps(startTC, towardCameraTC));","  float nBack = min(slabSteps, labelSlabBoxSteps(startTC, -towardCameraTC));","  vec3 tc = startTC + towardCameraTC * nFront;","  int totalSteps = int(nFront + nBack) + 1;","  for (int i = 0; i < 8192; ++i)","  {","    if (i >= totalSteps) { break; }","    int label = int(texture(volumeTexture[0], tc).r * 255.0 + 0.5);","    if (label > 0 && label < 32 && (labelMask & (1 << label)) != 0) { return label; }","    tc -= towardCameraTC;","  }","  return 0;","}"]}function l(){return Hr(`
      // Slab-projected label outline for single component
      vec4 slabOutlineResult = vec4(0.0, 0.0, 0.0, 0.0);
      // For MAX slabs, a composited value of 0 means no label anywhere
      // along the slab, so the expensive mask marches can be skipped.
      if (slabType != 1 || tvalue.r >= 0.5 / 255.0) {
        vec3 outlineStepTC = (WCTCMatrix0 * vec4(scaling * slabNormal * vboScaling, 0.0)).xyz;
        float halfSlab = slabThickness * 0.5;
        int centerMask = labelSlabMask(fragTexCoord, outlineStepTC, halfSlab, scaling);

        if (centerMask != 0) {
          // A label is on its projected edge when present here but missing in
          // some neighbor probed at that label's own outline thickness. Labels
          // sharing a thickness reuse the same neighbor masks, so the common
          // case still costs four neighbor marches.
          float labelmapRow = 0.5 / numLabelmaps;
          int edgeLabels = 0;
          int prevThickness = -1;
          int neighborMask = 0;
          for (int s = 1; s < 32; ++s) {
            if ((centerMask & (1 << s)) == 0) { continue; }
            float thicknessCoordinate = (float(s) - 1.0) / labelOutlineTextureWidth;
            int segmentThickness = max(1, int(texture2D(labelOutlineThicknessTexture, vec2(thicknessCoordinate, labelmapRow)).r * 255.0));
            if (segmentThickness != prevThickness) {
              vec3 outlineOffset1 = outlineTangent1_0 * texelSize0 * float(segmentThickness);
              vec3 outlineOffset2 = outlineTangent2_0 * texelSize0 * float(segmentThickness);
              neighborMask =
                labelSlabMask(fragTexCoord + outlineOffset1, outlineStepTC, halfSlab, scaling) &
                labelSlabMask(fragTexCoord - outlineOffset1, outlineStepTC, halfSlab, scaling) &
                labelSlabMask(fragTexCoord + outlineOffset2, outlineStepTC, halfSlab, scaling) &
                labelSlabMask(fragTexCoord - outlineOffset2, outlineStepTC, halfSlab, scaling);
              prevThickness = segmentThickness;
            }
            if ((neighborMask & (1 << s)) == 0) { edgeLabels |= (1 << s); }
          }

          // When several edge labels compete for this fragment, the one nearest
          // the viewer along the slab wins. The camera looks down -z in view
          // coordinates, so the slab normal points toward the viewer when its
          // view-space z component is positive.
          float slabNormalTowardCamera = (MCVCMatrix * vec4(slabNormal, 0.0)).z;
          vec3 towardCameraTC = slabNormalTowardCamera > 0.0 ? outlineStepTC : -outlineStepTC;

          if (edgeLabels != 0) {
            int edgeLabel = labelSlabFrontLabel(fragTexCoord, towardCameraTC, halfSlab, scaling, edgeLabels);
            if (edgeLabel == 0) {
              // numeric fallback: smallest edge label
              for (int s = 1; s < 32; ++s) {
                if ((edgeLabels & (1 << s)) != 0) { edgeLabel = s; break; }
              }
            }
            float labelValue = float(edgeLabel) / 255.0;
            vec3 edgeColor = texture2D(colorTexture1, vec2(labelValue * cscale0 + cshift0, 0.5)).rgb;
            float opacityCoordinate = (float(edgeLabel) - 1.0) / labelOutlineTextureWidth;
            float edgeOpacity = texture2D(labelOutlineOpacityTexture, vec2(opacityCoordinate, labelmapRow)).r;
            slabOutlineResult = vec4(edgeColor, edgeOpacity);
          } else {
            // Interior of the projected labels: regular fill through the
            // transfer functions using the label nearest the viewer
            int fillLabel = labelSlabFrontLabel(fragTexCoord, towardCameraTC, halfSlab, scaling, centerMask);
            float fillValue = fillLabel != 0 ? float(fillLabel) / 255.0 : tvalue.r;
            vec3 fillColor = texture2D(colorTexture1, vec2(fillValue * cscale0 + cshift0, 0.5)).rgb;
            float fillOpacity = texture2D(pwfTexture1, vec2(fillValue * pwfscale0 + pwfshift0, 0.5)).r;
            slabOutlineResult = vec4(fillColor, fillOpacity * opacity);
          }
        }
      }
      gl_FragData[0] = slabOutlineResult;
    `)}function f(d,v){const x=[];for(let C=0;C<d;C++)v(C)&&x.push(C);return x}t.replaceShaderTCoord=(d,v,x)=>{let C=d.Vertex;const T=d.Geometry;let m=d.Fragment;const w=e.labelOutlineProperties.length>0,O=e.renderable.getSlabThickness();C=V.substitute(C,"//VTK::TCoord::Dec",[]).result,C=V.substitute(C,"//VTK::TCoord::Impl",[]).result;const B=e.numberOfComponents,U=x.getProperty(e.currentValidInputs[0].inputIndex).getIndependentComponents(),F=e.scalarTextures.length;let D=[`uniform highp sampler3D volumeTexture[${F}];`,"uniform float cshift0;","uniform float cscale0;","uniform float pwfshift0;","uniform float pwfscale0;","uniform sampler2D colorTexture1;","uniform sampler2D pwfTexture1;","uniform float opacity;","uniform vec4 backgroundColor;"];for(let S=0;S<F;S++)D.push(`uniform mat4 WCTCMatrix${S};`);if(w){D=D.concat(["uniform sampler2D labelOutlineThicknessTexture;","uniform sampler2D labelOutlineOpacityTexture;","uniform float labelOutlineTextureWidth;","uniform float numLabelmaps;"]);for(let S=0;S<F;S++)D.push(`uniform vec3 outlineTangent1_${S};`),D.push(`uniform vec3 outlineTangent2_${S};`),D.push(`uniform vec3 texelSize${S};`)}if(D.push("vec4 rawSampleTexture(vec3 worldPos) {"),!e.multiTexturePerVolumeEnabled)D.push("vec3 tc0 = (WCTCMatrix0 * vec4(worldPos, 1.0)).xyz;","return texture(volumeTexture[0], tc0);","}");else{D.push("vec4 rawSample;");for(let S=0;S<F;++S)D.push(`vec3 tc${S} = (WCTCMatrix${S} * vec4(worldPos, 1.0)).xyz;`,`rawSample[${S}] = texture(volumeTexture[${S}], tc${S})[0];`);D.push("return rawSample;","}")}if(U){for(let S=1;S<B;S++)D=D.concat([`uniform float cshift${S};`,`uniform float cscale${S};`,`uniform float pwfshift${S};`,`uniform float pwfscale${S};`]);switch(B){case 1:D=D.concat(["uniform float mix0;","#define height0 0.5"]);break;case 2:D=D.concat(["uniform float mix0;","uniform float mix1;","#define height0 0.25","#define height1 0.75"]);break;case 3:D=D.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","#define height0 0.17","#define height1 0.5","#define height2 0.83"]);break;case 4:D=D.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","uniform float mix3;","#define height0 0.125","#define height1 0.375","#define height2 0.625","#define height3 0.875"]);break;default:at("Unsupported number of independent coordinates.")}}O>0&&(D=D.concat(["uniform vec3 spacing;","uniform float slabThickness;","uniform int slabType;","uniform int slabTrapezoid;","uniform vec3 vboScaling;"]),D=D.concat(c()),w&&!U&&B===1&&(D=D.concat(["uniform mat4 MCVCMatrix;"]),D=D.concat(p()))),m=V.substitute(m,"//VTK::TCoord::Dec",D).result;let y=["vec3 fragWorldPos = vertexWCVSOutput.xyz;","vec3 fragTexCoord = (WCTCMatrix0 * vec4(fragWorldPos, 1.0)).xyz;","if (any(greaterThan(fragTexCoord, vec3(1.0))) || any(lessThan(fragTexCoord, vec3(0.0))))","{","  // set the background color and exit","  gl_FragData[0] = backgroundColor;","  return;","}","vec4 tvalue = rawSampleTexture(fragWorldPos);"];if(O>0&&(y=y.concat(u())),U){const S=["r","g","b","a"];for(let b=0;b<B;++b)y=y.concat([`vec3 tcolor${b} = texture2D(colorTexture1, vec2(tvalue.${S[b]} * cscale${b} + cshift${b}, height${b})).rgb;`,`float compWeight${b} = mix${b} * texture2D(pwfTexture1, vec2(tvalue.${S[b]} * pwfscale${b} + pwfshift${b}, height${b})).r;`]);const P=w?f(B,b=>x.getProperty(e.currentValidInputs[b].inputIndex)?.getUseLabelOutline()):[],M=b=>{if(b===1)return["gl_FragData[0] = vec4(tcolor0.rgb, compWeight0 * opacity);"];const L=Array.from({length:b},(k,N)=>N),R=L.map(k=>`compWeight${k}`).join(" + "),E=L.map(k=>`(tcolor${k}.rgb * (compWeight${k} / weightSum))`).join(" + ");return[`float weightSum = ${R};`,`gl_FragData[0] = vec4(vec3(${E}), opacity);`]};P.length>0?y=y.concat(o(P,B)):y=y.concat(M(B))}else switch(B){case 1:w&&O>0?y=y.concat(l()):w?y=y.concat([...Hr(`
                // Label outline mode for single component
                float centerValue = tvalue.r;
                int segmentIndex = int(centerValue * 255.0);

                // Skip background (segment 0)
                if (segmentIndex == 0) {
                  gl_FragData[0] = vec4(0.0, 0.0, 0.0, 0.0);
                  return;
                }

                // Get outline parameters for this segment (row 0 for single labelmap)
                float textureCoordinate = float(segmentIndex - 1) / labelOutlineTextureWidth;
                float labelmapRow = 0.5 / numLabelmaps;
                float thicknessValue = texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, labelmapRow)).r;
                float outlineOpacity = texture2D(labelOutlineOpacityTexture, vec2(textureCoordinate, labelmapRow)).r;
                int actualThickness = int(thicknessValue * 255.0);

                // Get color for this segment
                vec3 tColor = texture2D(colorTexture1, vec2(centerValue * cscale0 + cshift0, 0.5)).rgb;
                float scalarOpacity = texture2D(pwfTexture1, vec2(centerValue * pwfscale0 + pwfshift0, 0.5)).r;
                float opacityToUse = scalarOpacity * opacity;

                // Check neighbors for border detection
                bool pixelOnBorder = false;
                for (int i = -actualThickness; i <= actualThickness; i++) {
                  for (int j = -actualThickness; j <= actualThickness; j++) {
                    if (i == 0 && j == 0) {
                      continue;
                    }
                    // Sample neighbor using tangent vectors in texture space
                    vec3 neighborTexCoord = fragTexCoord + float(i) * outlineTangent1_0 * texelSize0 + float(j) * outlineTangent2_0 * texelSize0;

                    // Skip if outside texture bounds
                    if (any(greaterThan(neighborTexCoord, vec3(1.0))) || any(lessThan(neighborTexCoord, vec3(0.0)))) {
                      pixelOnBorder = true;
                      break;
                    }

                    float neighborValue = texture(volumeTexture[0], neighborTexCoord).r;
                    if (neighborValue != centerValue) {
                      pixelOnBorder = true;
                      break;
                    }
                  }
                  if (pixelOnBorder) {
                    break;
                  }
                }

                if (pixelOnBorder) {
                  gl_FragData[0] = vec4(tColor, outlineOpacity);
                } else {
                  gl_FragData[0] = vec4(tColor, opacityToUse);
                }
              `)]):y=y.concat(["// Dependent components","float intensity = tvalue.r;","vec3 tcolor = texture2D(colorTexture1, vec2(intensity * cscale0 + cshift0, 0.5)).rgb;","float scalarOpacity = texture2D(pwfTexture1, vec2(intensity * pwfscale0 + pwfshift0, 0.5)).r;","gl_FragData[0] = vec4(tcolor, scalarOpacity * opacity);"]);break;case 2:y=y.concat(["float intensity = tvalue.r*cscale0 + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(intensity, 0.5)).rgb, pwfscale0*tvalue.g + pwfshift0);"]);break;case 3:y=y.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, opacity);"]);break;default:y=y.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, tcolor.a);"])}m=V.substitute(m,"//VTK::TCoord::Impl",y).result,d.Vertex=C,d.Fragment=m,d.Geometry=T},t.replaceShaderPositionVC=(d,v,x)=>{let C=d.Vertex;const T=d.Geometry;let m=d.Fragment;const w=e.renderable.getSlabThickness();let O=["attribute vec4 vertexWC;","varying vec4 vertexWCVSOutput;"];O=O.concat([`//${t.getMTime()}${e.resliceGeomUpdateString}`]),w>0&&(O=O.concat(["attribute vec3 normalWC;","varying vec3 normalWCVSOutput;"])),C=V.substitute(C,"//VTK::PositionVC::Dec",O).result;let B=["gl_Position = MCPCMatrix * vertexWC;","vertexWCVSOutput = vertexWC;"];w>0&&(B=B.concat(["normalWCVSOutput = normalWC;"])),C=V.substitute(C,"//VTK::PositionVC::Impl",B).result,C=V.substitute(C,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;","uniform mat4 MCVCMatrix;"]).result;let U=["varying vec4 vertexWCVSOutput;"];w>0&&(U=U.concat(["varying vec3 normalWCVSOutput;"])),m=V.substitute(m,"//VTK::PositionVC::Dec",U).result,d.Vertex=C,d.Geometry=T,d.Fragment=m},t.updateResliceGeometry=()=>{const d=e.currentValidInputs[0].imageData,{resGeomString:v,slicePD:x,slicePlane:C,orthoSlicing:T,orthoAxis:m}=pi(e.renderable,d);if(!e.resliceGeom||e.resliceGeomUpdateString!==v){if(x)e.resliceGeom||(e.resliceGeom=Re.newInstance()),e.resliceGeom.getPoints().setData(x.getPoints().getData(),3),e.resliceGeom.getPolys().setData(x.getPolys().getData(),1),e.resliceGeom.getPointData().setNormals(x.getPointData().getNormals());else if(C)if(e.resliceGeom||(e.resliceGeom=Re.newInstance()),T){const{points:w,polys:O,normalsData:B}=di(d,C,m,e.transform);e.resliceGeom.getPoints().setData(w,3),e.resliceGeom.getPolys().setData(O,1);const U=ce.newInstance({numberOfComponents:3,values:B,name:"Normals"});e.resliceGeom.getPointData().setNormals(U)}else{const{points:w,polys:O,normalsData:B}=gi(d,C,e.outlineFilter,e.cutter,e.lineToSurfaceFilter);e.resliceGeom.getPoints().setData(w,3),e.resliceGeom.getPolys().setData(O,1);const U=ce.newInstance({numberOfComponents:3,values:B,name:"Normals"});e.resliceGeom.getPointData().setNormals(U)}else at("Something went wrong.","A default slice plane should have been created in the beginning of","updateResliceGeometry.");e.resliceGeomUpdateString=v,e.resliceGeom?.modified()}};function g(d,v,x){const{width:C,height:T}=dr(d.map(B=>({property:B})),B=>B);let m=e.renderable.getLabelOutlineTextureWidth();m<=0&&(m=Math.max(C,e.context.getParameter(e.context.MAX_TEXTURE_SIZE)));const w=new v(m*T);cn(w,d,m);const O=K.newInstance({resizable:!1});return O.setOpenGLRenderWindow(e._openGLRenderWindow),O.resetFormatAndType(),O.setMinificationFilter(_.NEAREST),O.setMagnificationFilter(_.NEAREST),O.create2DFromRaw({width:m,height:T,numComps:1,dataType:x,data:w}),O}function h(d,v,x,C,T){const{hash:m}=dr(d.map(w=>({property:w})),w=>w);m!==e[C]&&(e[C]=m,e[T]&&e[T].releaseGraphicsResources(),e[T]=g(d,v,x))}t.updateLabelOutlineThicknessTexture=d=>{h(d.map(({property:v})=>v.getLabelOutlineThicknessByReference()),Uint8Array,se.UNSIGNED_CHAR,"_labelOutlineThicknessHash","labelOutlineThicknessTexture")},t.updateLabelOutlineOpacityTexture=d=>{h(d.map(({property:v})=>{let x=v.getLabelOutlineOpacity();return typeof x=="number"&&(x=[x]),x}),Float32Array,se.FLOAT,"_labelOutlineOpacityHash","labelOutlineOpacityTexture")},t.setScalarTextures=d=>{e.scalarTextures=[...d],e._externalOpenGLTexture=!0},t.delete=yn(()=>{e._openGLRenderWindow&&i(e._openGLRenderWindow),e.labelOutlineThicknessTexture&&(e.labelOutlineThicknessTexture.releaseGraphicsResources(),e.labelOutlineThicknessTexture=null),e.labelOutlineOpacityTexture&&(e.labelOutlineOpacityTexture.releaseGraphicsResources(),e.labelOutlineOpacityTexture=null)},t.delete)}var ru={VBOBuildTime:{},VBOBuildString:null,haveSeenDepthRequest:!1,lastHaveSeenDepthRequest:!1,lastIndependentComponents:!1,lastUseLabelOutline:!1,lastNumValidInputs:0,lastNumberOfComponents:0,lastMultiTexturePerVolumeEnabled:!1,lastSlabThickness:0,lastSlabTrapezoidIntegration:0,lastSlabType:-1,scalarTextures:[],_scalarTexturesCore:[],colorTexture:null,_colorTextureCore:null,pwfTexture:null,_pwfTextureCore:null,labelOutlineProperties:[],labelOutlineThicknessTexture:null,_labelOutlineThicknessHash:null,labelOutlineOpacityTexture:null,_labelOutlineOpacityHash:null,_externalOpenGLTexture:!1,resliceGeom:null,resliceGeomUpdateString:null,tris:null};function nu(t,e,a={}){Object.assign(e,ru,a),ee.extend(t,e,a),$e.implementReplaceShaderCoincidentOffset(t,e,a),$e.implementBuildShadersWithReplacements(t,e,a),e.tris=Pe.newInstance(),e.scalarTextures=[],e.colorTexture=null,e.pwfTexture=null,e.VBOBuildTime={},de(e.VBOBuildTime),e.tmpMat4=Z(new Float64Array(16)),e._tmpTexelSize=[0,0,0],e.outlineFilter=si.newInstance(),e.outlineFilter.setGenerateFaces(!0),e.outlineFilter.setGenerateLines(!1),e.cubePolyData=Re.newInstance(),e.cutter=ni.newInstance(),e.lineToSurfaceFilter=ii.newInstance(),e.transform=ti.newInstance(),pt(t,e,["scalarTextures"]),tu(t,e)}var au=X(nu,"vtkOpenGLImageResliceMapper");fe("vtkImageResliceMapper",au);var iu={HORIZONTAL:"horizontal",VERTICAL:"vertical",AUTO:"auto"},hi={Orientation:iu},{VectorMode:ou}=ho,{Orientation:Br}=hi;function jr(t,e,a){t.strokeStyle=e.strokeColor,t.lineWidth=e.strokeSize,t.fillStyle=e.fontColor;const r=e.fontSize??a;t.font=`${e.fontStyle} ${r}px ${e.fontFamily}`}function vi(t,e){return a=>{const r=a.getLastSize(),n=(r[0]/700)**.8,s=(r[1]/700)**.8,i=Math.min(n,s),o=a.getAxisTextStyle(),c=a.getTickTextStyle();Object.assign(o,e.axisTextStyle),Object.assign(c,e.tickTextStyle),o.fontSize===void 0&&(o.fontSize=Math.max(24*i,12)),c.fontSize===void 0&&(a.getLastAspectRatio()>1?c.fontSize=Math.max(20*i,10):c.fontSize=Math.max(16*i,10));const u=a.updateTextureAtlas();a.setTopTitle(!1);const p=a.getBoxSizeByReference();let l=!1;if(e.orientation===Br.VERTICAL?l=!0:e.orientation===Br.HORIZONTAL?l=!1:l=a.getLastAspectRatio()>1,l)a.setTickLabelPixelOffset(.3*c.fontSize),u.titleWidth<=u.tickWidth+a.getTickLabelPixelOffset()+.8*c.fontSize?(a.setTopTitle(!0),a.setAxisTitlePixelOffset(.2*c.fontSize),p[0]=2*(u.tickWidth+a.getTickLabelPixelOffset()+.8*c.fontSize)/r[0],a.setBoxPosition([.98-p[0],-.92])):(a.setAxisTitlePixelOffset(.2*c.fontSize),p[0]=2*(u.titleHeight+a.getAxisTitlePixelOffset()+u.tickWidth+a.getTickLabelPixelOffset()+.8*c.fontSize)/r[0],a.setBoxPosition([.99-p[0],-.92])),p[1]=Math.max(1.2,Math.min(1.84/s,1.84));else{a.setAxisTitlePixelOffset(1.2*c.fontSize),a.setTickLabelPixelOffset(.1*c.fontSize);const f=2*(.8*c.fontSize+u.titleHeight+a.getAxisTitlePixelOffset())/r[1],g=2*u.tickWidth/r[0];p[0]=Math.min(1.9,Math.max(1.4,1.4*g*(a.getTicks().length+3))),p[1]=f,a.setBoxPosition([-.5*p[0],-.97])}a.recomputeBarSegments(u)}}function xi(t,e){return a=>{const r=a.getLastTickBounds(),n=Bn().domain([r[0],r[1]]),s=n.ticks(5),i=n.tickFormat(5);a.setTicks(s),a.setTickStrings(s.map(i))}}function su(t,e){e.classHierarchy.push("vtkScalarBarActorHelper"),t.setRenderable=n=>{e.renderable!==n&&(e.renderable=n,e.barActor.setProperty(n.getProperty()),e.barActor.setParentProp(n),e.barActor.setCoordinateSystemToDisplay(),e.tmActor.setProperty(n.getProperty()),e.tmActor.setParentProp(n),e.tmActor.setCoordinateSystemToDisplay(),e.generateTicks=n.generateTicks,e.axisTextStyle={...n.getAxisTextStyle()},e.tickTextStyle={...n.getTickTextStyle()},t.modified())},t.updateAPISpecificData=(n,s,i)=>{(e.lastSize[0]!==n[0]||e.lastSize[1]!==n[1])&&(e.lastSize[0]=n[0],e.lastSize[1]=n[1],e.lastAspectRatio=n[0]/n[1],e.forceUpdate=!0);const o=e.renderable.getScalarsToColors();if(!(!o||!e.renderable.getVisibility())&&(e.barMapper.setLookupTable(o),e.camera=s,e.renderWindow=i,e.forceUpdate||Math.max(o.getMTime(),t.getMTime(),e.renderable.getMTime())>e.lastRebuildTime.getMTime())){if(e.lastTickBounds=[...o.getMappingRange()],e.renderable.getGenerateTicks()(t),e.renderable.getAutomated())e.renderable.getAutoLayout()(t);else{e.axisTextStyle={...e.renderable.getAxisTextStyle()},e.tickTextStyle={...e.renderable.getTickTextStyle()},e.barPosition=[...e.renderable.getBarPosition()],e.barSize=[...e.renderable.getBarSize()],e.boxPosition=[...e.renderable.getBoxPosition()],e.boxSize=[...e.renderable.getBoxSize()],e.axisTitlePixelOffset=e.renderable.getAxisTitlePixelOffset(),e.tickLabelPixelOffset=e.renderable.getTickLabelPixelOffset();const c=t.updateTextureAtlas();t.recomputeBarSegments(c)}t.updatePolyDataForLabels(),t.updatePolyDataForBarSegments(),e.lastRebuildTime.modified(),e.forceUpdate=!1}},t.updateTextureAtlas=()=>{e.tmContext.textBaseline="bottom",e.tmContext.textAlign="left";const n={},s=new Map;let i=0,o=1;jr(e.tmContext,e.axisTextStyle,18);let c=e.tmContext.measureText(e.renderable.getAxisLabel()),u={height:c.actualBoundingBoxAscent+2,startingHeight:o,width:c.width+2,textStyle:e.axisTextStyle};s.set(e.renderable.getAxisLabel(),u),o+=u.height,i=u.width,n.titleWidth=u.width,n.titleHeight=u.height,n.tickWidth=0,n.tickHeight=0,jr(e.tmContext,e.tickTextStyle,14);const p=[...t.getTickStrings(),"NaN","Below","Above"];for(let l=0;l<p.length;l++)s.has(p[l])||(c=e.tmContext.measureText(p[l]),u={height:c.actualBoundingBoxAscent+2,startingHeight:o,width:c.width+2,textStyle:e.tickTextStyle},s.set(p[l],u),o+=u.height,i<u.width&&(i=u.width),n.tickWidth<u.width&&(n.tickWidth=u.width),n.tickHeight<u.height&&(n.tickHeight=u.height));return i=xr(i),o=xr(o),s.forEach(l=>{l.tcoords=[0,(o-l.startingHeight-l.height)/o,l.width/i,(o-l.startingHeight-l.height)/o,l.width/i,(o-l.startingHeight)/o,0,(o-l.startingHeight)/o]}),e.tmCanvas.width=i,e.tmCanvas.height=o,e.tmContext.textBaseline="bottom",e.tmContext.textAlign="left",e.tmContext.clearRect(0,0,i,o),s.forEach((l,f)=>{const g=l.textStyle===e.axisTextStyle?18:14;jr(e.tmContext,l.textStyle,g),e.tmContext.fillText(f,1,l.startingHeight+l.height-1)}),e.tmTexture.setCanvas(e.tmCanvas),e.tmTexture.modified(),e._tmAtlas=s,n},t.computeBarSize=n=>{e.vertical=e.boxSize[1]>e.boxSize[0];const s=2*n.tickHeight/e.lastSize[1],i=[1,1];if(e.vertical){const o=2*(n.tickWidth+e.tickLabelPixelOffset)/e.lastSize[0];if(e.topTitle){const c=2*(n.titleHeight+e.axisTitlePixelOffset)/e.lastSize[1];e.barSize[0]=e.boxSize[0]-o,e.barSize[1]=e.boxSize[1]-c}else{const c=2*(n.titleHeight+e.axisTitlePixelOffset)/e.lastSize[0];e.barSize[0]=e.boxSize[0]-c-o,e.barSize[1]=e.boxSize[1]}e.barPosition[0]=e.boxPosition[0]+o,e.barPosition[1]=e.boxPosition[1],i[1]=s}else{const o=(2*n.tickWidth-8)/e.lastSize[0],c=2*(n.titleHeight+e.axisTitlePixelOffset)/e.lastSize[1];e.barSize[0]=e.boxSize[0],e.barPosition[0]=e.boxPosition[0],e.barSize[1]=e.boxSize[1]-c,e.barPosition[1]=e.boxPosition[1],i[0]=o}return i},t.recomputeBarSegments=n=>{const s=t.computeBarSize(n);e.barSegments=[];const i=[0,0],o=e.vertical?1:0,c=e.vertical?.01:.02;function u(f,g){e.barSegments.push({corners:[[...i],[i[0]+s[0],i[1]],[i[0]+s[0],i[1]+s[1]],[i[0],i[1]+s[1]]],scalars:g,title:f}),i[o]+=s[o]+c}e.renderable.getDrawNanAnnotation()&&e.renderable.getScalarsToColors().getNanColor()&&u("NaN",[NaN,NaN,NaN,NaN]),e.renderable.getDrawBelowRangeSwatch()&&e.renderable.getScalarsToColors().getUseBelowRangeColor?.()&&u("Below",[-.1,-.1,-.1,-.1]);const p=e.renderable.getScalarsToColors().getUseAboveRangeColor?.();i[o]+=c;const l=s[o];s[o]=p?1-2*c-s[o]-i[o]:1-c-i[o],u("ticks",e.vertical?[0,0,.995,.995]:[0,.995,.995,0]),e.renderable.getDrawAboveRangeSwatch()&&p&&(s[o]=l,i[o]+=c,u("Above",[1.1,1.1,1.1,1.1]))};const a=new Float64Array(3);t.createPolyDataForOneLabel=(n,s,i,o,c,u)=>{const p=e._tmAtlas.get(n);if(!p)return;let l=u.ptIdx,f=u.cellIdx;a[0]=(.5*s[0]+.5)*e.lastSize[0],a[1]=(.5*s[1]+.5)*e.lastSize[1],a[2]=s[2],a[0]+=c[0],a[1]+=c[1];const g=[],h=o==="vertical"?[1,0]:[0,1];o==="vertical"?(g[0]=p.width,g[1]=-p.height,i[0]==="middle"?a[1]-=p.width/2:i[0]==="right"&&(a[1]-=p.width),i[1]==="middle"?a[0]+=p.height/2:i[1]==="top"&&(a[0]+=p.height)):(g[0]=p.width,g[1]=p.height,i[0]==="middle"?a[0]-=p.width/2:i[0]==="right"&&(a[0]-=p.width),i[1]==="middle"?a[1]-=p.height/2:i[1]==="top"&&(a[1]-=p.height)),u.points[l*3]=a[0],u.points[l*3+1]=a[1],u.points[l*3+2]=a[2],u.tcoords[l*2]=p.tcoords[0],u.tcoords[l*2+1]=p.tcoords[1],l++,a[h[0]]+=g[0],u.points[l*3]=a[0],u.points[l*3+1]=a[1],u.points[l*3+2]=a[2],u.tcoords[l*2]=p.tcoords[2],u.tcoords[l*2+1]=p.tcoords[3],l++,a[h[1]]+=g[1],u.points[l*3]=a[0],u.points[l*3+1]=a[1],u.points[l*3+2]=a[2],u.tcoords[l*2]=p.tcoords[4],u.tcoords[l*2+1]=p.tcoords[5],l++,a[h[0]]-=g[0],u.points[l*3]=a[0],u.points[l*3+1]=a[1],u.points[l*3+2]=a[2],u.tcoords[l*2]=p.tcoords[6],u.tcoords[l*2+1]=p.tcoords[7],l++,u.polys[f*4]=3,u.polys[f*4+1]=l-4,u.polys[f*4+2]=l-3,u.polys[f*4+3]=l-2,f++,u.polys[f*4]=3,u.polys[f*4+1]=l-4,u.polys[f*4+2]=l-2,u.polys[f*4+3]=l-1,u.ptIdx+=4,u.cellIdx+=2};const r=new Float64Array(3);t.updatePolyDataForLabels=()=>{const n=t.getTickStrings().length+e.barSegments.length,s=n*4,i=n*2,o=new Float64Array(s*3),c=new Uint16Array(i*4),u=new Float32Array(s*2),p={ptIdx:0,cellIdx:0,polys:c,points:o,tcoords:u},l=e.vertical?0:1,f=e.vertical?1:0;r[2]=-.99;const g=e.vertical?["right","middle"]:["middle","bottom"];let h=[0,1];const d=[0,0];e.vertical?(d[0]=-e.tickLabelPixelOffset,e.topTitle?(r[0]=e.boxPosition[0]+.5*e.boxSize[0],r[1]=e.barPosition[1]+e.barSize[1],t.createPolyDataForOneLabel(e.renderable.getAxisLabel(),r,["middle","bottom"],"horizontal",[0,e.axisTitlePixelOffset],p)):(r[0]=e.barPosition[0]+e.barSize[0],r[1]=e.barPosition[1]+.5*e.barSize[1],t.createPolyDataForOneLabel(e.renderable.getAxisLabel(),r,["middle","top"],"vertical",[e.axisTitlePixelOffset,0],p)),h=[-1,0]):(d[1]=e.tickLabelPixelOffset,r[0]=e.barPosition[0]+.5*e.barSize[0],r[1]=e.barPosition[1]+e.barSize[1],t.createPolyDataForOneLabel(e.renderable.getAxisLabel(),r,["middle","bottom"],"horizontal",[0,e.axisTitlePixelOffset],p)),r[l]=e.barPosition[l]+(.5*h[l]+.5)*e.barSize[l],r[f]=e.barPosition[f]+e.barSize[f]*.5;let v=null;for(let B=0;B<e.barSegments.length;B++){const U=e.barSegments[B];U.title==="ticks"?v=U:(r[f]=e.barPosition[f]+.5*e.barSize[f]*(U.corners[2][f]+U.corners[0][f]),t.createPolyDataForOneLabel(U.title,r,g,"horizontal",d,p))}const x=e.barPosition[f]+e.barSize[f]*v.corners[0][f],C=e.barSize[f]*(v.corners[2][f]-v.corners[0][f]),T=t.getTicks(),m=t.getTickStrings(),w=t.getTickPositions();for(let B=0;B<T.length;B++)r[f]=x+C*(w?w[B]:(T[B]-e.lastTickBounds[0])/(e.lastTickBounds[1]-e.lastTickBounds[0])),t.createPolyDataForOneLabel(m[B],r,g,"horizontal",d,p);const O=ce.newInstance({numberOfComponents:2,values:u,name:"TextureCoordinates"});e.tmPolyData.getPointData().setTCoords(O),e.tmPolyData.getPoints().setData(o,3),e.tmPolyData.getPoints().modified(),e.tmPolyData.getPolys().setData(c,1),e.tmPolyData.getPolys().modified(),e.tmPolyData.modified()},t.updatePolyDataForBarSegments=()=>{const n=e.renderable.getScalarsToColors();let s=0;e.renderable.getDrawNanAnnotation()&&n.getNanColor()&&(s+=1),e.renderable.getDrawBelowRangeSwatch()&&n.getUseBelowRangeColor?.()&&(s+=1),e.renderable.getDrawAboveRangeSwatch()&&n.getUseAboveRangeColor?.()&&(s+=1);const i=4*(1+s),o=i;let c=1;n.getVectorMode()===ou.COMPONENT&&(c=n.getVectorComponent()+1);const u=new Float64Array(i*3),p=new Uint16Array(o*5),l=new Float32Array(i*c);let f=0,g=0;for(let d=0;d<e.barSegments.length;d++){const v=e.barSegments[d];for(let x=0;x<4;x++){r[0]=e.barPosition[0]+v.corners[x][0]*e.barSize[0],r[1]=e.barPosition[1]+v.corners[x][1]*e.barSize[1],u[f*3]=(.5*r[0]+.5)*e.lastSize[0],u[f*3+1]=(.5*r[1]+.5)*e.lastSize[1],u[f*3+2]=r[2];for(let C=0;C<c;C++)l[f*c+C]=e.lastTickBounds[0]+v.scalars[x]*(e.lastTickBounds[1]-e.lastTickBounds[0]);f++}p[g*5]=4,p[g*5+1]=f-4,p[g*5+2]=f-3,p[g*5+3]=f-2,p[g*5+4]=f-1,g++}const h=ce.newInstance({numberOfComponents:c,values:l,name:"Scalars"});e.polyData.getPointData().setScalars(h),e.polyData.getPoints().setData(u,3),e.polyData.getPoints().modified(),e.polyData.getPolys().setData(p,1),e.polyData.getPolys().modified(),e.polyData.modified()}}var cu=I.newInstance((t,e,a={renderable:null})=>{Object.assign(e,{},a),I.obj(t,e),I.setGet(t,e,["axisTitlePixelOffset","tickLabelPixelOffset","renderable","topTitle","ticks","tickStrings","tickPositions"]),I.get(t,e,["lastSize","lastAspectRatio","lastTickBounds","axisTextStyle","tickTextStyle","barActor","tmActor"]),I.getArray(t,e,["boxPosition","boxSize"]),I.setArray(t,e,["boxPosition","boxSize"],2),e.forceUpdate=!1,e.lastRebuildTime={},I.obj(e.lastRebuildTime,{mtime:0}),e.lastSize=[-1,-1],e.tmCanvas=document.createElement("canvas"),e.tmContext=e.tmCanvas.getContext("2d"),e._tmAtlas=new Map,e.barMapper=mt.newInstance(),e.barMapper.setInterpolateScalarsBeforeMapping(!0),e.barMapper.setUseLookupTableScalarRange(!0),e.polyData=Re.newInstance(),e.barMapper.setInputData(e.polyData),e.barActor=Tt.newInstance(),e.barActor.setMapper(e.barMapper),e.tmPolyData=Re.newInstance(),e.tmMapper=mt.newInstance(),e.tmMapper.setInputData(e.tmPolyData),e.tmTexture=On.newInstance({resizable:!0}),e.tmTexture.setInterpolate(!1),e.tmActor=Tt.newInstance({parentProp:t}),e.tmActor.setMapper(e.tmMapper),e.tmActor.addTexture(e.tmTexture),e.barPosition=[0,0],e.barSize=[0,0],e.boxPosition=[.88,-.92],e.boxSize=[.1,1.1],e.lastTickBounds=[],su(t,e)},"vtkScalarBarActorHelper");function uu(t,e){e.classHierarchy.push("vtkScalarBarActor"),t.setTickTextStyle=a=>{e.tickTextStyle={...e.tickTextStyle,...a},t.modified()},t.setAxisTextStyle=a=>{e.axisTextStyle={...e.axisTextStyle,...a},t.modified()},t.setOrientationToHorizontal=()=>t.setOrientation(Br.HORIZONTAL),t.setOrientationToVertical=()=>t.setOrientation(Br.VERTICAL),t.resetAutoLayoutToDefault=()=>{t.setAutoLayout(vi(t,e))},t.resetGenerateTicksToDefault=()=>{t.setGenerateTicks(xi())}}function lu(t){return{automated:!0,autoLayout:null,axisLabel:"Scalar Value",barPosition:[0,0],barSize:[0,0],boxPosition:[.88,-.92],boxSize:[.1,1.1],scalarToColors:null,axisTitlePixelOffset:36,axisTextStyle:{fontColor:"white",fontStyle:"normal",fontSize:void 0,fontFamily:"serif"},tickLabelPixelOffset:14,tickTextStyle:{fontColor:"white",fontStyle:"normal",fontSize:void 0,fontFamily:"serif"},generateTicks:null,drawNanAnnotation:!0,drawBelowRangeSwatch:!0,drawAboveRangeSwatch:!0,orientation:null,...t}}function Ci(t,e,a={}){Object.assign(e,lu(a)),e.autoLayout||(e.autoLayout=vi(t,e)),e.generateTicks||(e.generateTicks=xi()),Tt.extend(t,e,a),t.getProperty().setDiffuse(0),t.getProperty().setAmbient(1),I.setGet(t,e,["automated","autoLayout","axisTitlePixelOffset","axisLabel","scalarsToColors","tickLabelPixelOffset","generateTicks","drawNanAnnotation","drawBelowRangeSwatch","drawAboveRangeSwatch","orientation"]),I.get(t,e,["axisTextStyle","tickTextStyle"]),I.getArray(t,e,["barPosition","barSize","boxPosition","boxSize"]),I.setArray(t,e,["barPosition","barSize","boxPosition","boxSize"],2),uu(t,e)}var fu=I.newInstance(Ci,"vtkScalarBarActor"),mi={newInstance:fu,extend:Ci,newScalarBarActorHelper:cu,...hi};function pu(t,e){e.classHierarchy.push("vtkOpenGLScalarBarActor"),t.buildPass=a=>{a&&(e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getParent(),e.scalarBarActorHelper.getRenderable()||e.scalarBarActorHelper.setRenderable(e.renderable),t.prepareNodes(),t.addMissingNode(e.scalarBarActorHelper.getBarActor()),t.addMissingNode(e.scalarBarActorHelper.getTmActor()),t.removeUnusedNodes())},t.opaquePass=(a,r)=>{if(a){const n=e._openGLRenderer?e._openGLRenderer.getRenderable().getActiveCamera():null,s=e._openGLRenderer.getTiledSizeAndOrigin();e.scalarBarActorHelper.updateAPISpecificData([s.usize,s.vsize],n,e._openGLRenderWindow.getRenderable())}}}var gu={};function du(t,e,a={}){Object.assign(e,gu,a),ee.extend(t,e,a),e.scalarBarActorHelper=mi.newScalarBarActorHelper(),pu(t,e)}var hu=X(du,"vtkOpenGLScalarBarActor");fe("vtkScalarBarActor",hu);var{vtkErrorMacro:va}=me;function vu(t,e){e.classHierarchy.push("vtkOpenGLSkybox"),t.buildPass=a=>{if(a){e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getParent(),e.context=e._openGLRenderWindow.getContext(),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow),e.openGLTexture.setOpenGLRenderWindow(e._openGLRenderWindow);const r=e._openGLRenderer.getRenderable();e.openGLCamera=e._openGLRenderer.getViewNodeFor(r.getActiveCamera(),e.openGLCamera)}},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;r.incrementOpaqueActorCount()}},t.opaquePass=(a,r)=>{if(a&&!e._openGLRenderer.getSelector()){t.updateBufferObjects(),e.context.depthMask(!0),e._openGLRenderWindow.getShaderCache().readyShaderProgram(e.tris.getProgram()),e.openGLTexture.render(e._openGLRenderWindow);const n=e.openGLTexture.getTextureUnit();e.tris.getProgram().setUniformi("sbtexture",n);const s=e._openGLRenderer.getRenderable(),i=e.openGLCamera.getKeyMatrices(s),o=new Float64Array(16);if(Se(o,i.wcpc),e.tris.getProgram().setUniformMatrix("IMCPCMatrix",o),e.lastFormat==="box"){const c=s.getActiveCamera().getPosition();e.tris.getProgram().setUniform3f("camPos",c[0],c[1],c[2])}e.tris.getVAO().bind(),e.context.drawArrays(e.context.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release(),e.openGLTexture.deactivate()}},t.updateBufferObjects=()=>{if(!e.tris.getCABO().getElementCount()){const r=new Float32Array(12);for(let o=0;o<4;o++)r[o*3]=o%2*2-1,r[o*3+1]=o>1?1:-1,r[o*3+2]=1;const n=ce.newInstance({numberOfComponents:3,values:r});n.setName("points");const s=new Uint16Array(8);s[0]=3,s[1]=0,s[2]=1,s[3]=3,s[4]=3,s[5]=0,s[6]=3,s[7]=2;const i=Je.newInstance({values:s});e.tris.getCABO().createVBO(i,"polys",bt.SURFACE,{points:n,cellOffset:0,forceFlatten:!0})}e.renderable.getFormat()!==e.lastFormat&&(e.lastFormat=e.renderable.getFormat(),e.lastFormat==="box"&&e.tris.setProgram(e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(`//VTK::System::Dec
             attribute vec3 vertexMC;
             uniform mat4 IMCPCMatrix;
             varying vec3 TexCoords;
             void main () {
              gl_Position = vec4(vertexMC.xyz, 1.0);
              vec4 wpos = IMCPCMatrix * gl_Position;
              TexCoords = wpos.xyz/wpos.w;
             }`,`//VTK::System::Dec
             //VTK::Output::Dec
             varying vec3 TexCoords;
             uniform samplerCube sbtexture;
             uniform vec3 camPos;
             void main () {
               // skybox looks from inside out
               // which means we have to adjust
               // our tcoords. Otherwise text would
               // be flipped
               vec3 tc = normalize(TexCoords - camPos);
               if (abs(tc.z) < max(abs(tc.x),abs(tc.y)))
               {
                 tc = vec3(1.0, 1.0, -1.0) * tc;
               }
               else
               {
                 tc = vec3(-1.0, 1.0, 1.0) * tc;
               }
               gl_FragData[0] = textureCube(sbtexture, tc);
             }`,"")),e.lastFormat==="background"&&e.tris.setProgram(e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(`//VTK::System::Dec
             attribute vec3 vertexMC;
             uniform mat4 IMCPCMatrix;
             varying vec2 TexCoords;
             void main () {
              gl_Position = vec4(vertexMC.xyz, 1.0);
              vec4 wpos = IMCPCMatrix * gl_Position;
              TexCoords = vec2(vertexMC.x, vertexMC.y)*0.5 + 0.5;
             }`,`//VTK::System::Dec
             //VTK::Output::Dec
             varying vec2 TexCoords;
             uniform sampler2D sbtexture;
             void main () {
               gl_FragData[0] = texture2D(sbtexture, TexCoords);
             }`,"")),e.tris.getShaderSourceTime().modified(),e.tris.getVAO().bind(),e.tris.getVAO().addAttributeArray(e.tris.getProgram(),e.tris.getCABO(),"vertexMC",e.tris.getCABO().getVertexOffset(),e.tris.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||va("Error setting vertexMC in shader VAO."));const a=e.renderable.getTextures();a.length||va("vtkSkybox requires a texture map"),e.openGLTexture.getRenderable()!==a[0]&&(e.openGLTexture.releaseGraphicsResources(e._openGLRenderWindow),e.openGLTexture.setRenderable(a[0]))}}var xu={context:null};function Cu(t,e,a={}){Object.assign(e,xu,a),ee.extend(t,e,a),e.openGLTexture=K.newInstance(),e.tris=Pe.newInstance(),e.keyMatrixTime={},de(e.keyMatrixTime,{mtime:0}),e.keyMatrices={normalMatrix:We(new Float64Array(9)),mcwc:Z(new Float64Array(16))},ye(t,e,["context"]),pt(t,e,["activeTextures"]),vu(t,e)}var mu=X(Cu);fe("vtkSkybox",mu);var Tu=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkSphereMapperVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// this shader implements imposters in OpenGL for Spheres

attribute vec4 vertexMC;
attribute vec2 offsetMC;

// optional normal declaration
//VTK::Normal::Dec

//VTK::Picking::Dec

// Texture coordinates
//VTK::TCoord::Dec

uniform mat3 normalMatrix; // transform model coordinate directions to view coordinates

// material property values
//VTK::Color::Dec

// clipping plane vars
//VTK::Clip::Dec

// camera and actor matrix values
//VTK::Camera::Dec

varying vec4 vertexVCVSOutput;
varying float radiusVCVSOutput;
varying vec3 centerVCVSOutput;

uniform int cameraParallel;
uniform float scaleFactor;

void main()
{
  //VTK::Picking::Impl

  //VTK::Color::Impl

  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Clip::Impl

  // compute the projected vertex position
  vec2 scaledOffsetMC = scaleFactor * offsetMC;
  vertexVCVSOutput = MCVCMatrix * vertexMC;
  centerVCVSOutput = vertexVCVSOutput.xyz;
  radiusVCVSOutput = length(scaledOffsetMC)*0.5;

  // make the triangle face the camera
  if (cameraParallel == 0)
    {
    vec3 dir = normalize(-vertexVCVSOutput.xyz);
    vec3 base2 = normalize(cross(dir,vec3(1.0,0.0,0.0)));
    vec3 base1 = cross(base2,dir);
    vertexVCVSOutput.xyz = vertexVCVSOutput.xyz + scaledOffsetMC.x*base1 + scaledOffsetMC.y*base2;
    }
  else
    {
    // add in the offset
    vertexVCVSOutput.xy = vertexVCVSOutput.xy + scaledOffsetMC;
    }

  gl_Position = VCPCMatrix * vertexVCVSOutput;
}
`,{vtkErrorMacro:Su}=me;function yu(t,e){e.classHierarchy.push("vtkOpenGLSphereMapper");const a={...t};t.getShaderTemplate=(r,n,s)=>{r.Vertex=Tu,r.Fragment=zt,r.Geometry=""},t.replaceShaderValues=(r,n,s)=>{let i=r.Vertex,o=r.Fragment;i=V.substitute(i,"//VTK::Camera::Dec",[`uniform mat4 VCPCMatrix;
`,"uniform mat4 MCVCMatrix;"]).result,o=V.substitute(o,"//VTK::PositionVC::Dec",["varying vec4 vertexVCVSOutput;"]).result,o=V.substitute(o,"//VTK::PositionVC::Impl",[`vec4 vertexVC = vertexVCVSOutput;
`]).result,o=V.substitute(o,"//VTK::Normal::Dec",[`uniform float invertedDepth;
`,`uniform int cameraParallel;
`,`varying float radiusVCVSOutput;
`,`varying vec3 centerVCVSOutput;
`,`uniform mat4 VCPCMatrix;
`]).result,o=V.substitute(o,"//VTK::Depth::Impl",[`  vec3 EyePos;
`,`  vec3 EyeDir;
`,`  if (cameraParallel != 0) {
`,`    EyePos = vec3(vertexVC.x, vertexVC.y, vertexVC.z + 3.0*radiusVCVSOutput);
`,`    EyeDir = vec3(0.0,0.0,-1.0); }
`,`  else {
`,`    EyeDir = vertexVC.xyz;
`,`    EyePos = vec3(0.0,0.0,0.0);
`,`    float lengthED = length(EyeDir);
`,`    EyeDir = normalize(EyeDir);
`,`    if (lengthED > radiusVCVSOutput*3.0) {
`,`      EyePos = vertexVC.xyz - EyeDir*3.0*radiusVCVSOutput; }
`,`    }
`,`  EyePos = EyePos - centerVCVSOutput;
`,`  EyePos = EyePos/radiusVCVSOutput;
`,`  float b = 2.0*dot(EyePos,EyeDir);
`,`  float c = dot(EyePos,EyePos) - 1.0;
`,`  float d = b*b - 4.0*c;
`,`  vec3 normalVCVSOutput = vec3(0.0,0.0,1.0);
`,`  if (d < 0.0) { discard; }
`,`  else {
`,`    float t = (-b - invertedDepth*sqrt(d))*0.5;
`,`    normalVCVSOutput = invertedDepth*normalize(EyePos + t*EyeDir);
`,`    vertexVC.xyz = normalVCVSOutput*radiusVCVSOutput + centerVCVSOutput;
`,`    }
`,`  vec4 pos = VCPCMatrix * vertexVC;
`,`gl_FragDepth = (pos.z / pos.w + 1.0) / 2.0;
`]).result,o=V.substitute(o,"//VTK::Normal::Impl","").result,e.haveSeenDepthRequest&&(o=V.substitute(o,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float computedZ = (pos.z / pos.w + 1.0) / 2.0;","float iz = floor(computedZ * 65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result),r.Vertex=i,r.Fragment=o,a.replaceShaderValues(r,n,s)},t.setMapperShaderParameters=(r,n,s)=>{if(r.getCABO().getElementCount()&&(e.VBOBuildTime>r.getAttributeUpdateTime().getMTime()||r.getShaderSourceTime().getMTime()>r.getAttributeUpdateTime().getMTime())&&r.getProgram().isAttributeUsed("offsetMC")&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),"offsetMC",12,r.getCABO().getStride(),e.context.FLOAT,2,!1)||Su("Error setting 'offsetMC' in shader VAO.")),r.getProgram().isUniformUsed("invertedDepth")&&r.getProgram().setUniformf("invertedDepth",e.invert?-1:1),r.getProgram().isUniformUsed("scaleFactor")){const i=e.currentInput.getPointData();e.renderable.getScaleArray()!=null&&i.hasArray(e.renderable.getScaleArray())?r.getProgram().setUniformf("scaleFactor",e.renderable.getScaleFactor()):r.getProgram().setUniformf("scaleFactor",1)}a.setMapperShaderParameters(r,n,s)},t.setCameraShaderParameters=(r,n,s)=>{const i=r.getProgram(),o=n.getActiveCamera(),c=e.openGLCamera.getKeyMatrices(n);i.isUniformUsed("VCPCMatrix")&&i.setUniformMatrix("VCPCMatrix",c.vcpc);const u=new Float64Array(16);if(i.isUniformUsed("MCVCMatrix"))if(s.getIsIdentity())Ce(u,c.wcvc),r.getCABO().getCoordShiftAndScaleEnabled()&&q(u,u,r.getCABO().getInverseShiftAndScaleMatrix()),i.setUniformMatrix("MCVCMatrix",u);else{const p=e.openGLActor.getKeyMatrices();q(u,c.wcvc,p.mcwc),r.getCABO().getCoordShiftAndScaleEnabled()&&q(u,u,r.getCABO().getInverseShiftAndScaleMatrix()),i.setUniformMatrix("MCVCMatrix",u)}i.isUniformUsed("cameraParallel")&&r.getProgram().setUniformi("cameraParallel",o.getParallelProjection())},t.getOpenGLMode=(r,n)=>e.context.TRIANGLES,t.buildBufferObjects=(r,n)=>{const s=e.currentInput;if(s===null)return;e.renderable.mapScalars(s,1);const i=e.renderable.getColorMapColors(),o=e.primitives[e.primTypes.Tris].getCABO(),c=s.getPointData(),u=s.getPoints(),p=u.getNumberOfPoints(),l=u.getData(),f=5;let g=null;e.renderable.getScaleArray()!=null&&c.hasArray(e.renderable.getScaleArray())&&(g=c.getArray(e.renderable.getScaleArray()).getData());let h=null,d=0,v=null;i?(d=i.getNumberOfComponents(),o.setColorOffset(0),o.setColorBOStride(4),h=i.getData(),v=new Uint8Array(3*p*4),o.getColorBO()||o.setColorBO(st.newInstance()),o.getColorBO().setOpenGLRenderWindow(e._openGLRenderWindow)):o.getColorBO()&&o.setColorBO(null),o.setColorComponents(d);const x=new Float32Array(f*p*3);o.setStride(f*4);const C=Math.cos(Cr(30));let T=0,m=0;const{useShiftAndScale:w,coordShift:O,coordScale:B}=ka(u);o.setCoordShiftAndScale(w?O:null,w?B:null);let U=0,F=0;for(let D=0;D<p;++D){let y=e.renderable.getRadius();g&&(y=g[D]),T=D*3;const S=(l[T++]-O[0])*B[0],P=(l[T++]-O[1])*B[1],M=(l[T++]-O[2])*B[2];x[U++]=S,x[U++]=P,x[U++]=M,x[U++]=-2*y*C,x[U++]=-y,h&&(m=D*d,v[F++]=h[m],v[F++]=h[m+1],v[F++]=h[m+2],v[F++]=h[m+3]),x[U++]=S,x[U++]=P,x[U++]=M,x[U++]=2*y*C,x[U++]=-y,h&&(v[F++]=h[m],v[F++]=h[m+1],v[F++]=h[m+2],v[F++]=h[m+3]),x[U++]=S,x[U++]=P,x[U++]=M,x[U++]=0,x[U++]=2*y,h&&(v[F++]=h[m],v[F++]=h[m+1],v[F++]=h[m+2],v[F++]=h[m+3])}o.setElementCount(U/f),o.upload(x,hr.ARRAY_BUFFER),i&&o.getColorBO().upload(v,hr.ARRAY_BUFFER),e.VBOBuildTime.modified()}}var Ou={};function bu(t,e,a={}){Object.assign(e,Ou,a),Er.extend(t,e,a),yu(t,e)}var Vu=X(bu,"vtkOpenGLSphereMapper");fe("vtkSphereMapper",Vu);var wu=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkStickMapperVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// this shader implements imposters in OpenGL for Sticks

attribute vec4 vertexMC;
attribute vec3 orientMC;
attribute vec4 offsetMC;
attribute float radiusMC;

// optional normal declaration
//VTK::Normal::Dec

//VTK::Picking::Dec

// Texture coordinates
//VTK::TCoord::Dec

uniform mat3 normalMatrix; // transform model coordinate directions to view coordinates

// material property values
//VTK::Color::Dec

// clipping plane vars
//VTK::Clip::Dec

// camera and actor matrix values
//VTK::Camera::Dec

varying vec4 vertexVCVSOutput;
varying float radiusVCVSOutput;
varying float lengthVCVSOutput;
varying vec3 centerVCVSOutput;
varying vec3 orientVCVSOutput;

uniform int cameraParallel;

void main()
{
  //VTK::Picking::Impl

  //VTK::Color::Impl

  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Clip::Impl

  vertexVCVSOutput = MCVCMatrix * vertexMC;
  centerVCVSOutput = vertexVCVSOutput.xyz;
  radiusVCVSOutput = radiusMC;
  lengthVCVSOutput = length(orientMC);
  orientVCVSOutput = normalMatrix * normalize(orientMC);

  // make sure it is pointing out of the screen
  if (orientVCVSOutput.z < 0.0)
    {
    orientVCVSOutput = -orientVCVSOutput;
    }

  // make the basis
  vec3 xbase;
  vec3 ybase;
  vec3 dir = vec3(0.0,0.0,1.0);
  if (cameraParallel == 0)
    {
    dir = normalize(-vertexVCVSOutput.xyz);
    }
  if (abs(dot(dir,orientVCVSOutput)) == 1.0)
    {
    xbase = normalize(cross(vec3(0.0,1.0,0.0),orientVCVSOutput));
    ybase = cross(xbase,orientVCVSOutput);
    }
  else
    {
    xbase = normalize(cross(orientVCVSOutput,dir));
    ybase = cross(orientVCVSOutput,xbase);
    }

  vec3 offsets = offsetMC.xyz*2.0-1.0;
  vertexVCVSOutput.xyz = vertexVCVSOutput.xyz +
    radiusVCVSOutput*offsets.x*xbase +
    radiusVCVSOutput*offsets.y*ybase +
    0.5*lengthVCVSOutput*offsets.z*orientVCVSOutput;

  gl_Position = VCPCMatrix * vertexVCVSOutput;
}
`,{vtkErrorMacro:tr}=me;function Mu(t,e){e.classHierarchy.push("vtkOpenGLStickMapper");const a={...t};t.getShaderTemplate=(r,n,s)=>{r.Vertex=wu,r.Fragment=zt,r.Geometry=""},t.replaceShaderValues=(r,n,s)=>{let i=r.Vertex,o=r.Fragment;i=V.substitute(i,"//VTK::Camera::Dec",[`uniform mat4 VCPCMatrix;
`,"uniform mat4 MCVCMatrix;"]).result,o=V.substitute(o,"//VTK::PositionVC::Dec","varying vec4 vertexVCVSOutput;").result,o=V.substitute(o,"//VTK::PositionVC::Impl",`  vec4 vertexVC = vertexVCVSOutput;
`).result,o=V.substitute(o,"//VTK::Normal::Dec",[`uniform int cameraParallel;
`,`varying float radiusVCVSOutput;
`,`varying vec3 orientVCVSOutput;
`,`varying float lengthVCVSOutput;
`,`varying vec3 centerVCVSOutput;
`,`uniform mat4 VCPCMatrix;
`]).result,o=V.substitute(o,"//VTK::Depth::Impl",[`  vec3 EyePos;
`,`  vec3 EyeDir;
`,`  if (cameraParallel != 0) {
`,`    EyePos = vec3(vertexVC.x, vertexVC.y, vertexVC.z + 3.0*radiusVCVSOutput);
`,`    EyeDir = vec3(0.0,0.0,-1.0); }
`,`  else {
`,`    EyeDir = vertexVC.xyz;
`,`    EyePos = vec3(0.0,0.0,0.0);
`,`    float lengthED = length(EyeDir);
`,`    EyeDir = normalize(EyeDir);
`,`    if (lengthED > radiusVCVSOutput*3.0) {
`,`      EyePos = vertexVC.xyz - EyeDir*3.0*radiusVCVSOutput; }
`,`    }
`,`  EyePos = EyePos - centerVCVSOutput;
`,`  vec3 base1;
`,`  if (abs(orientVCVSOutput.z) < 0.99) {
`,`    base1 = normalize(cross(orientVCVSOutput,vec3(0.0,0.0,1.0))); }
`,`  else {
`,`    base1 = normalize(cross(orientVCVSOutput,vec3(0.0,1.0,0.0))); }
`,`  vec3 base2 = cross(orientVCVSOutput,base1);
`,`  EyePos = vec3(dot(EyePos,base1),dot(EyePos,base2),dot(EyePos,orientVCVSOutput));
`,`  EyeDir = vec3(dot(EyeDir,base1),dot(EyeDir,base2),dot(EyeDir,orientVCVSOutput));
`,`  EyePos = EyePos/radiusVCVSOutput;
`,`  float a = EyeDir.x*EyeDir.x + EyeDir.y*EyeDir.y;
`,`  float b = 2.0*(EyePos.x*EyeDir.x + EyePos.y*EyeDir.y);
`,`  float c = EyePos.x*EyePos.x + EyePos.y*EyePos.y - 1.0;
`,`  float d = b*b - 4.0*a*c;
`,`  vec3 normalVCVSOutput = vec3(0.0,0.0,1.0);
`,`  if (d < 0.0) { discard; }
`,`  else {
`,`    float t =  (-b - sqrt(d))/(2.0*a);
`,`    float tz = EyePos.z + t*EyeDir.z;
`,`    vec3 iPoint = EyePos + t*EyeDir;
`,`    if (abs(iPoint.z)*radiusVCVSOutput > lengthVCVSOutput*0.5) {
`,`      float t2 = (-b + sqrt(d))/(2.0*a);
`,`      float tz2 = EyePos.z + t2*EyeDir.z;
`,`      if (tz2*radiusVCVSOutput > lengthVCVSOutput*0.5 || tz*radiusVCVSOutput < -0.5*lengthVCVSOutput) { discard; }
`,`      else {
`,`        normalVCVSOutput = orientVCVSOutput;
`,`        float t3 = (lengthVCVSOutput*0.5/radiusVCVSOutput - EyePos.z)/EyeDir.z;
`,`        iPoint = EyePos + t3*EyeDir;
`,`        vertexVC.xyz = radiusVCVSOutput*(iPoint.x*base1 + iPoint.y*base2 + iPoint.z*orientVCVSOutput) + centerVCVSOutput;
`,`        }
`,`      }
`,`    else {
`,`      normalVCVSOutput = iPoint.x*base1 + iPoint.y*base2;
`,`      vertexVC.xyz = radiusVCVSOutput*(normalVCVSOutput + iPoint.z*orientVCVSOutput) + centerVCVSOutput;
`,`      }
`,`    }
`,`  vec4 pos = VCPCMatrix * vertexVC;
`,`gl_FragDepth = (pos.z / pos.w + 1.0) / 2.0;
`]).result,o=V.substitute(o,"//VTK::Normal::Impl","").result,e.haveSeenDepthRequest&&(o=V.substitute(o,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float computedZ = (pos.z / pos.w + 1.0) / 2.0;","float iz = floor(computedZ * 65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result),r.Vertex=i,r.Fragment=o,a.replaceShaderValues(r,n,s)},t.setMapperShaderParameters=(r,n,s)=>{r.getCABO().getElementCount()&&(e.VBOBuildTime>r.getAttributeUpdateTime().getMTime()||r.getShaderSourceTime().getMTime()>r.getAttributeUpdateTime().getMTime())&&(r.getProgram().isAttributeUsed("orientMC")&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),"orientMC",12,r.getCABO().getStride(),e.context.FLOAT,3,!1)||tr("Error setting 'orientMC' in shader VAO.")),r.getProgram().isAttributeUsed("offsetMC")&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO().getColorBO(),"offsetMC",0,r.getCABO().getColorBOStride(),e.context.UNSIGNED_BYTE,3,!0)||tr("Error setting 'offsetMC' in shader VAO.")),r.getProgram().isAttributeUsed("radiusMC")&&(r.getVAO().addAttributeArray(r.getProgram(),r.getCABO(),"radiusMC",24,r.getCABO().getStride(),e.context.FLOAT,1,!1)||tr("Error setting 'radiusMC' in shader VAO."))),a.setMapperShaderParameters(r,n,s)},t.setCameraShaderParameters=(r,n,s)=>{const i=r.getProgram(),o=n.getActiveCamera(),c=e.openGLCamera.getKeyMatrices(n);if(i.isUniformUsed("VCPCMatrix")&&i.setUniformMatrix("VCPCMatrix",c.vcpc),s.getIsIdentity())i.isUniformUsed("MCVCMatrix")&&i.setUniformMatrix("MCVCMatrix",c.wcvc),i.isUniformUsed("normalMatrix")&&i.setUniformMatrix3x3("normalMatrix",c.normalMatrix);else{const u=e.openGLActor.getKeyMatrices();if(i.isUniformUsed("MCVCMatrix")){const p=new Float64Array(16);q(p,c.wcvc,u.mcwc),i.setUniformMatrix("MCVCMatrix",p)}if(i.isUniformUsed("normalMatrix")){const p=new Float64Array(9);ht(p,c.normalMatrix,u.normalMatrix),i.setUniformMatrix3x3("normalMatrix",p)}}i.isUniformUsed("cameraParallel")&&r.getProgram().setUniformi("cameraParallel",o.getParallelProjection())},t.getOpenGLMode=(r,n)=>e.context.TRIANGLES,t.buildBufferObjects=(r,n)=>{const s=e.currentInput;if(s===null)return;e.renderable.mapScalars(s,1);const i=e.renderable.getColorMapColors(),o=e.primitives[e.primTypes.Tris].getCABO(),c=s.getPointData(),u=s.getPoints(),p=u.getNumberOfPoints(),l=u.getData();let f=3;f+=4;let g=null,h=0;o.setColorBOStride(4),o.getColorBO()||o.setColorBO(st.newInstance()),o.getColorBO().setOpenGLRenderWindow(e._openGLRenderWindow),i&&(h=i.getNumberOfComponents(),o.setColorOffset(4),g=i.getData(),o.setColorBOStride(8)),o.setColorComponents(h),o.setStride(f*4);const d=new Float32Array(f*p*12),v=new Uint8Array(12*p*(g?8:4));let x=null,C=null;e.renderable.getScaleArray()!=null&&c.hasArray(e.renderable.getScaleArray())&&(x=c.getArray(e.renderable.getScaleArray()).getData()),e.renderable.getOrientationArray()!=null&&c.hasArray(e.renderable.getOrientationArray())?C=c.getArray(e.renderable.getOrientationArray()).getData():tr([`Error setting orientationArray.
`,"You have to specify the stick orientation"]);const T=[0,1,3,0,3,2,2,3,5,2,5,4];let m=0,w=0,O=0,B=0;for(let U=0;U<p;++U){let F=e.renderable.getLength(),D=e.renderable.getRadius();x&&(F=x[U*2],D=x[U*2+1]);for(let y=0;y<T.length;++y)m=U*3,d[O++]=l[m++],d[O++]=l[m++],d[O++]=l[m++],m=U*3,d[O++]=C[m++]*F,d[O++]=C[m++]*F,d[O++]=C[m++]*F,d[O++]=D,v[B++]=255*(T[y]%2),v[B++]=T[y]>=4?255:0,v[B++]=T[y]>=2?255:0,v[B++]=255,w=U*h,g&&(v[B++]=g[w],v[B++]=g[w+1],v[B++]=g[w+2],v[B++]=g[w+3])}o.setElementCount(O/f),o.upload(d,hr.ARRAY_BUFFER),o.getColorBO().upload(v,hr.ARRAY_BUFFER),e.VBOBuildTime.modified()}}var Bu={};function Du(t,e,a={}){Object.assign(e,Bu,a),Er.extend(t,e,a),Mu(t,e)}var Lu=X(Du,"vtkOpenGLStickMapper");fe("vtkStickMapper",Lu);function Ru(t,e){e.classHierarchy.push("vtkOpenGLVolume"),t.buildPass=a=>{!e.renderable||!e.renderable.getVisibility()||a&&(e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e.context=e._openGLRenderWindow.getContext(),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes())},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;r.incrementVolumeCount()}},t.traverseVolumePass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children[0].traverse(a),t.apply(a,!1))},t.volumePass=a=>{!e.renderable||!e.renderable.getVisibility()||e.context.depthMask(!a)},t.getKeyMatrices=()=>(e.renderable.getMTime()>e.keyMatrixTime.getMTime()&&(e.renderable.computeMatrix(),Ce(e.MCWCMatrix,e.renderable.getMatrix()),ne(e.MCWCMatrix,e.MCWCMatrix),e.renderable.getIsIdentity()?We(e.normalMatrix):(lt(e.normalMatrix,e.MCWCMatrix),Xe(e.normalMatrix,e.normalMatrix),Tr(e.normalMatrix,e.normalMatrix)),e.keyMatrixTime.modified()),{mcwc:e.MCWCMatrix,normalMatrix:e.normalMatrix})}var Uu={};function ku(t,e,a={}){Object.assign(e,Uu,a),ee.extend(t,e,a),e.keyMatrixTime={},de(e.keyMatrixTime,{mtime:0}),e.normalMatrix=new Float64Array(9),e.MCWCMatrix=new Float64Array(16),ye(t,e,["context"]),Ru(t,e)}var Eu=X(ku,"vtkOpenGLVolume");fe("vtkVolume",Eu);var Pu=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkVolumeVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

attribute vec4 vertexDC;

varying vec3 vertexVCVSOutput;
uniform mat4 PCVCMatrix;

uniform float dcxmin;
uniform float dcxmax;
uniform float dcymin;
uniform float dcymax;

void main()
{
  // dcsmall is the device coords reduced to the
  // x y area covered by the volume
  vec4 dcsmall = vec4(
    dcxmin + 0.5 * (vertexDC.x + 1.0) * (dcxmax - dcxmin),
    dcymin + 0.5 * (vertexDC.y + 1.0) * (dcymax - dcymin),
    vertexDC.z,
    vertexDC.w);
  vec4 vcpos = PCVCMatrix * dcsmall;
  vertexVCVSOutput = vcpos.xyz/vcpos.w;
  gl_Position = dcsmall;
}
`,Fu=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkVolumeFS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// Template for the volume mappers fragment shader

const float infinity = 3.402823466e38;

// the output of this shader
//VTK::Output::Dec

in vec3 vertexVCVSOutput;

// From Sources\\Rendering\\Core\\VolumeProperty\\Constants.js
#define COMPOSITE_BLEND 0
#define MAXIMUM_INTENSITY_BLEND 1
#define MINIMUM_INTENSITY_BLEND 2
#define AVERAGE_INTENSITY_BLEND 3
#define ADDITIVE_INTENSITY_BLEND 4
#define RADON_TRANSFORM_BLEND 5
#define LABELMAP_EDGE_PROJECTION_BLEND 6

#define vtkNumberOfLights //VTK::NumberOfLights
#define vtkMaxLaoKernelSize //VTK::MaxLaoKernelSize
#define vtkNumberOfComponents //VTK::NumberOfComponents
#define vtkBlendMode //VTK::BlendMode
#define vtkMaximumNumberOfSamples //VTK::MaximumNumberOfSamples

//VTK::EnabledColorFunctions

//VTK::EnabledLightings

//VTK::EnabledMultiTexturePerVolume

//VTK::EnabledGradientOpacity

//VTK::EnabledIndependentComponents

//VTK::vtkProportionalComponents

//VTK::vtkForceNearestComponents

uniform int twoSidedLighting;

#if vtkMaxLaoKernelSize > 0
  vec2 kernelSample[vtkMaxLaoKernelSize];
#endif

// Textures
#ifdef EnabledMultiTexturePerVolume
  #define vtkNumberOfVolumeTextures vtkNumberOfComponents
#else
  #define vtkNumberOfVolumeTextures 1
#endif
uniform highp sampler3D volumeTexture[vtkNumberOfVolumeTextures];
uniform sampler2D colorTexture;
uniform sampler2D opacityTexture;
uniform sampler2D jtexture;
uniform sampler2D labelOutlineThicknessTexture;

struct Volume {
  // ---- Volume geometry settings ----

  vec3 originVC;          // in VC
  vec3 spacing;           // in VC per IC
  vec3 inverseSpacing;    // 1/spacing
  ivec3 dimensions;       // in IC
  vec3 inverseDimensions; // 1/vec3(dimensions)
  mat3 vecISToVCMatrix;   // convert from IS to VC without translation
  mat3 vecVCToISMatrix;   // convert from VC to IS without translation
  mat3 normalISToVCMatrix; // convert a normal from IS to VC
  mat4 PCWCMatrix;
  mat4 worldToIndex;
  float diagonalLength; // in VC, this is the length of the actor bounds diagonal

  // ---- Texture settings ----

  // Texture shift and scale
  vec4 colorTextureScale;
  vec4 colorTextureShift;
  vec4 opacityTextureScale;
  vec4 opacityTextureShift;

  // The heights defined below are the locations for the up to four components
  // of the transfer functions. The transfer functions have a height of (2 *
  // numberOfComponents) pixels so the values are computed to hit the middle of
  // the two rows for that component
  vec4 transferFunctionsSampleHeight;

  // ---- Mode specific settings ----

  // Independent component default preset settings per component
  vec4 independentComponentMix;

  // Additive / average blending mode settings
  vec4 ipScalarRangeMin;
  vec4 ipScalarRangeMax;

  // ---- Rendering settings ----

  // Lighting
  float ambient;
  float diffuse;
  float specular;
  float specularPower;
  int computeNormalFromOpacity;

  // Gradient opacity
  vec4 gradientOpacityScale;
  vec4 gradientOpacityShift;
  vec4 gradientOpacityMin;
  vec4 gradientOpacityMax;

  // Volume shadow
  float volumetricScatteringBlending;
  float globalIlluminationReach;
  float anisotropy;
  float anisotropySquared;

  // LAO
  int kernelSize;
  int kernelRadius;

  // Label outline
  float outlineOpacity;
};
uniform Volume volume;

struct Light {
  vec3 color;
  vec3 positionVC;
  vec3 directionVC; // normalized
  vec3 halfAngleVC;
  vec3 attenuation;
  float exponent;
  float coneAngle;
  int isPositional;
};
#if vtkNumberOfLights > 0
  uniform Light lights[vtkNumberOfLights];
#endif

uniform float vpWidth;
uniform float vpHeight;
uniform float vpOffsetX;
uniform float vpOffsetY;

// Bitmasks for label outline
const int MAX_SEGMENT_INDEX = 256; // Define as per expected maximum
#define MAX_SEGMENTS 256
#define UINT_SIZE 32
// We add UINT_SIZE - 1, as we want the ceil of the division instead of the
// floor
#define BITMASK_SIZE ((MAX_SEGMENTS + UINT_SIZE - 1) / UINT_SIZE)
uint labelOutlineBitmasks[BITMASK_SIZE];

// Set the corresponding bit in the bitmask
void setLabelOutlineBit(int segmentIndex) {
  int arrayIndex = segmentIndex / UINT_SIZE;
  int bitIndex = segmentIndex % UINT_SIZE;
  labelOutlineBitmasks[arrayIndex] |= 1u << bitIndex;
}

// Check if a bit is set in the bitmask
bool isLabelOutlineBitSet(int segmentIndex) {
  int arrayIndex = segmentIndex / UINT_SIZE;
  int bitIndex = segmentIndex % UINT_SIZE;
  return ((labelOutlineBitmasks[arrayIndex] & (1u << bitIndex)) != 0u);
}

// camera values
uniform float camThick;
uniform float camNear;
uniform float camFar;
uniform int cameraParallel;

//VTK::ClipPlane::Dec

// A random number between 0 and 1 that only depends on the fragment
// It uses the jtexture, so this random seed repeats by blocks of 32 fragments
// in screen space
float fragmentSeed;

// sample texture is global
uniform float sampleDistance;
uniform float volumeShadowSampleDistance;

// declaration for intermixed geometry
//VTK::ZBuffer::Dec

//=======================================================================
// global and custom variables (a temporary section before photorealistics
// rendering module is complete)
vec3 rayDirVC;

#define INV4PI 0.0796
#define EPSILON 0.001
#define PI 3.1415
#define PI2 9.8696

vec4 rawSampleTexture(vec3 pos) {
  #ifdef EnabledMultiTexturePerVolume
    vec4 rawSample;
    rawSample[0] = texture(volumeTexture[0], pos)[0];
  #if vtkNumberOfComponents > 1
    rawSample[1] = texture(volumeTexture[1], pos)[0];
  #endif
  #if vtkNumberOfComponents > 2
    rawSample[2] = texture(volumeTexture[2], pos)[0];
  #endif
  #if vtkNumberOfComponents > 3
    rawSample[3] = texture(volumeTexture[3], pos)[0];
  #endif
    return rawSample;
  #else
    return texture(volumeTexture[0], pos);
  #endif
}

vec4 rawFetchTexture(ivec3 pos) {
  #ifdef EnabledMultiTexturePerVolume
    vec4 rawSample;
    #if vtkNumberOfComponents > 0
      rawSample[0] = texelFetch(volumeTexture[0], pos, 0)[0];
    #endif
    #if vtkNumberOfComponents > 1
      rawSample[1] = texelFetch(volumeTexture[1], pos, 0)[0];
    #endif
    #if vtkNumberOfComponents > 2
      rawSample[2] = texelFetch(volumeTexture[2], pos, 0)[0];
    #endif
    #if vtkNumberOfComponents > 3
      rawSample[3] = texelFetch(volumeTexture[3], pos, 0)[0];
    #endif
    return rawSample;
  #else
    return texelFetch(volumeTexture[0], pos, 0);
  #endif
}

vec4 getTextureValue(vec3 pos) {
  vec4 tmp = rawSampleTexture(pos);

  // Force nearest
  #if defined(vtkComponent0ForceNearest) || \\
      defined(vtkComponent1ForceNearest) || \\
      defined(vtkComponent2ForceNearest) || \\
      defined(vtkComponent3ForceNearest)
    vec3 nearestPos = (floor(pos * vec3(volume.dimensions)) + 0.5) *
                      volume.inverseDimensions;
    vec4 nearestValue = rawSampleTexture(nearestPos);
    #ifdef vtkComponent0ForceNearest
      tmp[0] = nearestValue[0];
    #endif
    #ifdef vtkComponent1ForceNearest
      tmp[1] = nearestValue[1];
    #endif
    #ifdef vtkComponent2ForceNearest
      tmp[2] = nearestValue[2];
    #endif
    #ifdef vtkComponent3ForceNearest
      tmp[3] = nearestValue[3];
    #endif
  #endif

  // Set alpha when using dependent components
  #ifndef EnabledIndependentComponents
    #if vtkNumberOfComponents == 1
      tmp.a = tmp.r;
    #endif
    #if vtkNumberOfComponents == 2
      tmp.a = tmp.g;
    #endif
    #if vtkNumberOfComponents == 3
      tmp.a = length(tmp.rgb);
    #endif
  #endif

  return tmp;
}

// \`height\` is usually \`volume.transferFunctionsSampleHeight[component]\`
// when using independent component and \`0.5\` otherwise. Don't move the if
// statement in these function, as the callers usually already knows if it is
// using independent component or not
float getOpacityFromTexture(float scalar, int component, float height) {
  float scaledScalar = scalar * volume.opacityTextureScale[component] +
                       volume.opacityTextureShift[component];
  return texture2D(opacityTexture, vec2(scaledScalar, height)).r;
}
vec3 getColorFromTexture(float scalar, int component, float height) {
  float scaledScalar = scalar * volume.colorTextureScale[component] +
                       volume.colorTextureShift[component];
  return texture2D(colorTexture, vec2(scaledScalar, height)).rgb;
}

float getRadonOpacity(vec4 tValue) {
  #ifdef EnabledIndependentComponents
    return getOpacityFromTexture(tValue.r, 0, 0.5);
  #else
    #if vtkNumberOfComponents == 1
      return getOpacityFromTexture(tValue.r, 0, 0.5);
    #endif
    #if vtkNumberOfComponents == 2
      return getOpacityFromTexture(tValue.a, 1, 0.5);
    #endif
    #if vtkNumberOfComponents == 3
      return getOpacityFromTexture(tValue.a, 0, 0.5);
    #endif
    #if vtkNumberOfComponents == 4
      return getOpacityFromTexture(tValue.a, 3, 0.5);
    #endif
  #endif
}

vec3 getRadonColor(float normalizedRayIntensity) {
  float colorCoord = clamp(normalizedRayIntensity, 0.0, 1.0);
  return texture2D(colorTexture, vec2(colorCoord, 0.5)).rgb;
}

//=======================================================================
// transformation between VC and IS space

// convert vector position from idx to vc
vec3 posIStoVC(vec3 posIS) {
  return volume.vecISToVCMatrix * posIS + volume.originVC;
}

// convert vector position from vc to idx
vec3 posVCtoIS(vec3 posVC) {
  return volume.vecVCToISMatrix * (posVC - volume.originVC);
}

// Rotate vector to view coordinate
vec3 vecISToVC(vec3 dirIS) {
  return volume.vecISToVCMatrix * dirIS;
}

// Rotate a normal to view coordinate
// Normals use the inverse transpose transform, which is different from
// vecISToVCMatrix when the actor matrix scales or shears the volume
vec3 normalISToVC(vec3 normalIS) {
  return volume.normalISToVCMatrix * normalIS;
}

// Rotate vector to idx coordinate
vec3 vecVCToIS(vec3 dirVC) {
  return volume.vecVCToISMatrix * dirVC;
}

//=======================================================================
// Given a normal compute the gradient opacity factors
float computeGradientOpacityFactor(float normalMag, int component) {
  float goscale = volume.gradientOpacityScale[component];
  float goshift = volume.gradientOpacityShift[component];
  float gomin = volume.gradientOpacityMin[component];
  float gomax = volume.gradientOpacityMax[component];
  return clamp(normalMag * goscale + goshift, gomin, gomax);
}

#ifdef vtkClippingPlanesOn
  bool isPointClipped(vec3 posVC) {
    for (int i = 0; i < clip_numPlanes; ++i) {
      if (dot(vec3(vClipPlaneOrigins[i] - posVC), vClipPlaneNormals[i]) > 0.0) {
        return true;
      }
    }
    return false;
  }
#endif

//=======================================================================
// compute the normal and gradient magnitude for a position, uses forward
// difference

// The output normal is in VC
vec4 computeDensityNormal(vec3 opacityUCoords[2], float opacityTextureHeight,
                          float gradientOpacity, int component) {
  // Pass the scalars through the opacity functions
  vec4 opacityG;
  opacityG.x += getOpacityFromTexture(opacityUCoords[0].x, component,
                                      opacityTextureHeight);
  opacityG.y += getOpacityFromTexture(opacityUCoords[0].y, component,
                                      opacityTextureHeight);
  opacityG.z += getOpacityFromTexture(opacityUCoords[0].z, component,
                                      opacityTextureHeight);
  opacityG.x -= getOpacityFromTexture(opacityUCoords[1].x, component,
                                      opacityTextureHeight);
  opacityG.y -= getOpacityFromTexture(opacityUCoords[1].y, component,
                                      opacityTextureHeight);
  opacityG.z -= getOpacityFromTexture(opacityUCoords[1].z, component,
                                      opacityTextureHeight);

  // Divide by spacing and convert to VC
  opacityG.xyz *= gradientOpacity * volume.inverseSpacing;
  opacityG.w = length(opacityG.xyz);
  if (opacityG.w == 0.0) {
    return vec4(0.0);
  }

  // Normalize
  opacityG.xyz = normalize(normalISToVC(opacityG.xyz));

  return opacityG;
}

// The output normal is in VC
vec4 computeNormalForDensity(vec3 posIS, out vec3 scalarInterp[2],
                             const int opacityComponent) {
  vec3 offsetedPosIS;
  for (int axis = 0; axis < 3; ++axis) {
    // Positive direction
    offsetedPosIS = posIS;
    offsetedPosIS[axis] += volume.inverseDimensions[axis];
    scalarInterp[0][axis] =
        getTextureValue(offsetedPosIS)[opacityComponent];
    #ifdef vtkClippingPlanesOn
      if (isPointClipped(posIStoVC(offsetedPosIS))) {
        scalarInterp[0][axis] = 0.0;
      }
    #endif

    // Negative direction
    offsetedPosIS = posIS;
    offsetedPosIS[axis] -= volume.inverseDimensions[axis];
    scalarInterp[1][axis] =
        getTextureValue(offsetedPosIS)[opacityComponent];
    #ifdef vtkClippingPlanesOn
      if (isPointClipped(posIStoVC(offsetedPosIS))) {
        scalarInterp[1][axis] = 0.0;
      }
    #endif
  }

  vec4 result;
  result.xyz = (scalarInterp[0] - scalarInterp[1]) * volume.inverseSpacing;
  result.w = length(result.xyz);
  if (result.w == 0.0) {
    return vec4(0.0);
  }
  result.xyz = normalize(normalISToVC(result.xyz));
  return result;
}

vec4 fragCoordToPCPos(vec4 fragCoord) {
  return vec4((fragCoord.x / vpWidth - vpOffsetX - 0.5) * 2.0,
              (fragCoord.y / vpHeight - vpOffsetY - 0.5) * 2.0,
              (fragCoord.z - 0.5) * 2.0, 1.0);
}

vec4 pcPosToWorldCoord(vec4 pcPos) {
  return volume.PCWCMatrix * pcPos;
}

vec3 fragCoordToIndexSpace(vec4 fragCoord) {
  vec4 pcPos = fragCoordToPCPos(fragCoord);
  vec4 worldCoord = pcPosToWorldCoord(pcPos);
  vec4 vertex = (worldCoord / worldCoord.w);

  vec3 index = (volume.worldToIndex * vertex).xyz;

  // half voxel fix for labelmapOutline
  return (index + vec3(0.5)) * volume.inverseDimensions;
}

vec3 fragCoordToWorld(vec4 fragCoord) {
  vec4 pcPos = fragCoordToPCPos(fragCoord);
  vec4 worldCoord = pcPosToWorldCoord(pcPos);
  return worldCoord.xyz;
}

//=======================================================================
// Compute the normals and gradient magnitudes for a position for independent
// components The output normals are in VC
mat4 computeMat4Normal(vec3 posIS, vec4 tValue) {
  vec3 xvec = vec3(volume.inverseDimensions.x, 0.0, 0.0);
  vec3 yvec = vec3(0.0, volume.inverseDimensions.y, 0.0);
  vec3 zvec = vec3(0.0, 0.0, volume.inverseDimensions.z);

  vec4 distX = getTextureValue(posIS + xvec) - getTextureValue(posIS - xvec);
  vec4 distY = getTextureValue(posIS + yvec) - getTextureValue(posIS - yvec);
  vec4 distZ = getTextureValue(posIS + zvec) - getTextureValue(posIS - zvec);

  // divide by spacing
  distX *= 0.5 * volume.inverseSpacing.x;
  distY *= 0.5 * volume.inverseSpacing.y;
  distZ *= 0.5 * volume.inverseSpacing.z;

  mat4 result;

  // optionally compute the 1st component
  #if vtkNumberOfComponents > 0 && !defined(vtkComponent0Proportional)
    {
      const int component = 0;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  // optionally compute the 2nd component
  #if vtkNumberOfComponents > 1 && !defined(vtkComponent1Proportional)
    {
      const int component = 1;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  // optionally compute the 3rd component
  #if vtkNumberOfComponents > 2 && !defined(vtkComponent2Proportional)
    {
      const int component = 2;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  // optionally compute the 4th component
  #if vtkNumberOfComponents > 3 && !defined(vtkComponent3Proportional)
    {
      const int component = 3;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  return result;
}

//=======================================================================
// global shadow - secondary ray

// henyey greenstein phase function
float phaseFunction(float cos_angle) {
  // divide by 2.0 instead of 4pi to increase intensity
  float anisotropy = volume.anisotropy;
  if (abs(anisotropy) <= EPSILON) {
    // isotropic scatter returns 0.5 instead of 1/4pi to increase intensity
    return 0.5;
  }
  float anisotropy2 = volume.anisotropySquared;
  return ((1.0 - anisotropy2) /
          pow(1.0 + anisotropy2 - 2.0 * anisotropy * cos_angle, 1.5)) /
         2.0;
}

// Compute the two intersection distances of the ray with the volume in VC
// The entry point is \`rayOriginVC + distanceMin * rayDirVC\` and the exit point
// is \`rayOriginVC + distanceMax * rayDirVC\` If distanceMin < distanceMax, the
// volume is not intersected The ray origin is inside the box when distanceMin <
// 0.0 < distanceMax
vec2 rayIntersectVolumeDistances(vec3 rayOriginVC, vec3 rayDirVC) {
  // Compute origin and direction in IS
  vec3 rayOriginIS = posVCtoIS(rayOriginVC);
  vec3 rayDirIS = vecVCToIS(rayDirVC);
  // Don't check for infinity as the min/max combination afterward will always
  // find an intersection before infinity
  vec3 invDir = 1.0 / rayDirIS;

  // We have: bound = origin + t * dir
  // So: t = (1/dir) * (bound - origin)
  vec3 distancesTo0 = invDir * (vec3(0.0) - rayOriginIS);
  vec3 distancesTo1 = invDir * (vec3(1.0) - rayOriginIS);
  // Min and max distances to plane intersection per plane
  vec3 dMinPerAxis = min(distancesTo0, distancesTo1);
  vec3 dMaxPerAxis = max(distancesTo0, distancesTo1);
  // Overall first and last intersection
  float distanceMin = max(dMinPerAxis.x, max(dMinPerAxis.y, dMinPerAxis.z));
  float distanceMax = min(dMaxPerAxis.x, min(dMaxPerAxis.y, dMaxPerAxis.z));
  return vec2(distanceMin, distanceMax);
}

//=======================================================================
// local ambient occlusion
#if vtkMaxLaoKernelSize > 0

  // Return a random point on the unit sphere
  vec3 sampleDirectionUniform(int rayIndex) {
    // Each ray of each fragment should be different, two sources of randomness
    // are used. Only depends on ray index
    vec2 rayRandomness = kernelSample[rayIndex];
    // Only depends on fragment
    float fragmentRandomness = fragmentSeed;
    // Merge both source of randomness in a single uniform random variable using
    // the formula (x+y < 1 ? x+y : x+y-1). The simpler formula (x+y)/2 doesn't
    // result in a uniform distribution
    vec2 mergedRandom = rayRandomness + vec2(fragmentRandomness);
    mergedRandom -= vec2(greaterThanEqual(mergedRandom, vec2(1.0)));

    // Insipred by:
    // https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/#better-choice-of-spherical-coordinates
    float u = mergedRandom[0];
    float v = mergedRandom[1];
    float theta = u * 2.0 * PI;
    float phi = acos(2.0 * v - 1.0);
    float sinTheta = sin(theta);
    float cosTheta = cos(theta);
    float sinPhi = sin(phi);
    float cosPhi = cos(phi);
    return vec3(sinPhi * cosTheta, sinPhi * sinTheta, cosPhi);
  }

  float computeLAO(vec3 posVC, vec4 normalVC, float originalOpacity) {
    // apply LAO only at selected locations, otherwise return full brightness
    if (normalVC.w <= 0.0 || originalOpacity <= 0.05) {
      return 1.0;
    }

    #ifdef EnabledGradientOpacity
      float gradientOpacityFactor = computeGradientOpacityFactor(normalVC.w, 0);
    #endif

    float visibilitySum = 0.0;
    float weightSum = 0.0;
    for (int i = 0; i < volume.kernelSize; i++) {
      // Only sample on an hemisphere around the normalVC.xyz axis, so
      // normalDotRay should be negative
      vec3 rayDirectionVC = sampleDirectionUniform(i);
      float normalDotRay = dot(normalVC.xyz, rayDirectionVC);
      if (normalDotRay > 0.0) {
        // Flip rayDirectionVC when it is in the wrong hemisphere
        rayDirectionVC = -rayDirectionVC;
        normalDotRay = -normalDotRay;
      }

      vec3 currPosIS = posVCtoIS(posVC);
      float visibility = 1.0;
      vec3 randomDirStepIS = vecVCToIS(rayDirectionVC * sampleDistance);
      for (int j = 0; j < volume.kernelRadius; j++) {
        currPosIS += randomDirStepIS;
        // If out of the volume, we are done
        if (any(lessThan(currPosIS, vec3(0.0))) ||
            any(greaterThan(currPosIS, vec3(1.0)))) {
          break;
        }
        float opacity = getOpacityFromTexture(getTextureValue(currPosIS).r, 0, 0.5);
        #ifdef EnabledGradientOpacity
          opacity *= gradientOpacityFactor;
        #endif
        visibility *= 1.0 - opacity;
        // If visibility is less than EPSILON, consider it to be 0
        if (visibility < EPSILON) {
          visibility = 0.0;
          break;
        }
      }
      float rayWeight = -normalDotRay;
      visibilitySum += visibility * rayWeight;
      weightSum += rayWeight;
    }

    // If no sample, LAO factor is one
    if (weightSum == 0.0) {
      return 1.0;
    }

    // LAO factor is the average visibility:
    // - visibility low => ambient low
    // - visibility high => ambient high
    float lao = visibilitySum / weightSum;

    // Reduce variance by clamping
    return clamp(lao, 0.3, 1.0);
  }
#endif

//=======================================================================
// Volume shadows
#if vtkNumberOfLights > 0

  // Non-memoised version
  float computeVolumeShadowWithoutCache(vec3 posVC, vec3 lightDirNormVC) {
    // modify sample distance with a random number between 1.5 and 3.0
    float rayStepLength =
        volumeShadowSampleDistance * mix(1.5, 3.0, fragmentSeed);

    // in case the first sample near surface has a very tiled light ray, we need
    // to offset start position
    vec3 initialPosVC = posVC + rayStepLength * lightDirNormVC;

    #ifdef vtkClippingPlanesOn
      float clippingPlanesMaxDistance = infinity;
      for (int i = 0; i < clip_numPlanes; ++i) {
        // Find distance of intersection with the plane
        // Points are clipped when:
        // dot(planeOrigin - (rayOrigin + distance * rayDirection), planeNormal) > 0
        // This is equivalent to:
        // dot(planeOrigin - rayOrigin, planeNormal) - distance * dot(rayDirection,
        // planeNormal) > 0.0
        // We precompute the dot products, so we clip ray points when:
        // dotOrigin - distance * dotDirection > 0.0
        float dotOrigin =
            dot(vClipPlaneOrigins[i] - initialPosVC, vClipPlaneNormals[i]);
        if (dotOrigin > 0.0) {
          // The initialPosVC is clipped by this plane
          return 1.0;
        }
        float dotDirection = dot(lightDirNormVC, vClipPlaneNormals[i]);
        if (dotDirection < 0.0) {
          // We only hit the plane if dotDirection is negative, as (distance is
          // positive)
          float intersectionDistance =
              dotOrigin / dotDirection; // negative divided by negative => positive
          clippingPlanesMaxDistance =
              min(clippingPlanesMaxDistance, intersectionDistance);
        }
      }
    #endif

    vec2 intersectionDistances =
        rayIntersectVolumeDistances(initialPosVC, lightDirNormVC);

    if (intersectionDistances[1] <= intersectionDistances[0] ||
        intersectionDistances[1] <= 0.0) {
      // Volume not hit or behind the ray
      return 1.0;
    }

    // When globalIlluminationReach is 0, no sample at all
    // When globalIlluminationReach is 1, the ray will go through the whole
    // volume
    float maxTravelDistance = mix(0.0, volume.diagonalLength,
                                  volume.globalIlluminationReach);
    float startDistance = max(intersectionDistances[0], 0.0);
    float endDistance = min(intersectionDistances[1], startDistance + maxTravelDistance);
    #ifdef vtkClippingPlanesOn
      endDistance = min(endDistance, clippingPlanesMaxDistance);
    #endif
    if (endDistance - startDistance < 0.0) {
      return 1.0;
    }

    // These two variables are used to compute posIS, without having to call
    // VCtoIS at each step
    vec3 initialPosIS = posVCtoIS(initialPosVC);
    // The light dir is scaled and rotated, but not translated, as it is a
    // vector (w = 0)
    vec3 scaledLightDirIS = vecVCToIS(lightDirNormVC);

    float shadow = 1.0;
    for (float currentDistance = startDistance; currentDistance <= endDistance;
          currentDistance += rayStepLength) {
      vec3 posIS = initialPosIS + currentDistance * scaledLightDirIS;
      vec4 scalar = getTextureValue(posIS);
      float opacity = getOpacityFromTexture(scalar.r, 0, 0.5);
      #if defined(EnabledGradientOpacity) && !defined(EnabledIndependentComponents)
        vec3 scalarInterp[2];
        vec4 normal = computeNormalForDensity(posIS, scalarInterp, 3);
        float opacityFactor = computeGradientOpacityFactor(normal.w, 0);
        opacity *= opacityFactor;
      #endif
      shadow *= 1.0 - opacity;

      // Early termination if shadow coeff is near 0.0
      if (shadow < EPSILON) {
        return 0.0;
      }
    }
    return shadow;
  }

  // Some cache for volume shadows
  struct {
    vec3 posVC;
    float shadow;
  } cachedShadows[vtkNumberOfLights];

  // Memoised version
  float computeVolumeShadow(vec3 posVC, vec3 lightDirNormVC, int lightIdx) {
    if (posVC == cachedShadows[lightIdx].posVC) {
      return cachedShadows[lightIdx].shadow;
    }
    float shadow = computeVolumeShadowWithoutCache(posVC, lightDirNormVC);
    cachedShadows[lightIdx].posVC = posVC;
    cachedShadows[lightIdx].shadow = shadow;
    return shadow;
  }

#endif

//=======================================================================
// surface light contribution
#if vtkNumberOfLights > 0
  vec3 applyLighting(vec3 tColor, vec4 normalVC) {
    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    vec3 specular = vec3(0.0, 0.0, 0.0);
    for (int lightIdx = 0; lightIdx < vtkNumberOfLights; lightIdx++) {
      float df = dot(normalVC.xyz, lights[lightIdx].directionVC);
      if (df > 0.0) {
        diffuse += df * lights[lightIdx].color;
        float sf = dot(normalVC.xyz, -lights[lightIdx].halfAngleVC);
        if (sf > 0.0) {
          specular += pow(sf, volume.specularPower) * lights[lightIdx].color;
        }
      }
    }
    return tColor * (diffuse * volume.diffuse + volume.ambient) +
          specular * volume.specular;
  }

  vec3 applySurfaceShadowLighting(vec3 tColor, float alpha, vec3 posVC,
                                  vec4 normalVC) {
    // everything in VC
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int ligthIdx = 0; ligthIdx < vtkNumberOfLights; ligthIdx++) {
      vec3 vertLightDirection;
      float attenuation;
      if (lights[ligthIdx].isPositional == 1) {
        vertLightDirection = posVC - lights[ligthIdx].positionVC;
        float lightDistance = length(vertLightDirection);
        // Normalize with precomputed length
        vertLightDirection = vertLightDirection / lightDistance;
        // Base attenuation
        vec3 attenuationPolynom = lights[ligthIdx].attenuation;
        attenuation =
            1.0 / (attenuationPolynom[0] +
                  lightDistance * (attenuationPolynom[1] +
                                    lightDistance * attenuationPolynom[2]));
        // Cone attenuation
        float coneDot = dot(vertLightDirection, lights[ligthIdx].directionVC);
        // Per OpenGL standard cone angle is 90 or less for a spot light
        if (lights[ligthIdx].coneAngle <= 90.0) {
          if (coneDot >= cos(radians(lights[ligthIdx].coneAngle))) {
            // Inside the cone
            attenuation *= pow(coneDot, lights[ligthIdx].exponent);
          } else {
            // Outside the cone
            attenuation = 0.0;
          }
        }
      } else {
        vertLightDirection = lights[ligthIdx].directionVC;
        attenuation = 1.0;
      }

      float ndotL = dot(normalVC.xyz, vertLightDirection);
      if (ndotL < 0.0 && twoSidedLighting == 1) {
        ndotL = -ndotL;
      }
      if (ndotL > 0.0) {
        // Diffuse
        diffuse += ndotL * attenuation * lights[ligthIdx].color;
        // Specular
        float vdotR =
            dot(-rayDirVC, normalize(vertLightDirection - 2.0 * ndotL * normalVC.xyz));
        if (vdotR > 0.0) {
          specular += pow(vdotR, volume.specularPower) * attenuation *
                      lights[ligthIdx].color;
        }
      }
    }
    #if vtkMaxLaoKernelSize > 0
      float laoFactor = computeLAO(posVC, normalVC, alpha);
    #else
      const float laoFactor = 1.0;
    #endif
    return tColor * (diffuse * volume.diffuse +
                    volume.ambient * laoFactor) +
          specular * volume.specular;
  }

  vec3 applyVolumeShadowLighting(vec3 tColor, vec3 posVC) {
    // Here we have no effect of cones and no attenuation
    vec3 diffuse = vec3(0.0);
    for (int lightIdx = 0; lightIdx < vtkNumberOfLights; lightIdx++) {
      vec3 lightDirVC = lights[lightIdx].isPositional == 1
                            ? normalize(lights[lightIdx].positionVC - posVC)
                            : -lights[lightIdx].directionVC;
      float shadowCoeff = computeVolumeShadow(posVC, lightDirVC, lightIdx);
      float phaseAttenuation = phaseFunction(dot(rayDirVC, lightDirVC));
      diffuse += phaseAttenuation * shadowCoeff * lights[lightIdx].color;
    }
    return tColor * (diffuse * volume.diffuse + volume.ambient);
  }
#endif

// LAO of surface shadows and volume shadows only work with dependent components
vec3 applyAllLightning(vec3 tColor, float alpha, vec3 posVC,
                       vec4 surfaceNormalVC) {
  #if vtkNumberOfLights > 0
    // 0 <= volCoeff < EPSILON => only surface shadows
    // EPSILON <= volCoeff < 1 - EPSILON => mix of surface and volume shadows
    // 1 - EPSILON <= volCoeff => only volume shadows
    float volCoeff = volume.volumetricScatteringBlending *
                    (1.0 - alpha / 2.0) *
                    (1.0 - atan(surfaceNormalVC.w) * INV4PI);

    // Compute surface lighting if needed
    vec3 surfaceShadedColor = tColor;
    #ifdef EnableSurfaceLighting
      if (volCoeff < 1.0 - EPSILON) {
        surfaceShadedColor =
            applySurfaceShadowLighting(tColor, alpha, posVC, surfaceNormalVC);
      }
    #endif

    // Compute volume lighting if needed
    vec3 volumeShadedColor = tColor;
    #ifdef EnableVolumeLighting
      if (volCoeff >= EPSILON) {
        volumeShadedColor = applyVolumeShadowLighting(tColor, posVC);
      }
    #endif

    // Return the right mix
    if (volCoeff < EPSILON) {
      // Surface shadows
      return surfaceShadedColor;
    }
    if (volCoeff >= 1.0 - EPSILON) {
      // Volume shadows
      return volumeShadedColor;
    }
    // Mix of surface and volume shadows
    return mix(surfaceShadedColor, volumeShadedColor, volCoeff);
  #endif
  return tColor;
}

vec4 getColorForLabelOutline() {
  vec3 centerPosIS =
      fragCoordToIndexSpace(gl_FragCoord); // pos in texture space
  vec4 centerValue = getTextureValue(centerPosIS);
  bool pixelOnBorder = false;
  vec4 tColor = vec4(getColorFromTexture(centerValue.r, 0, 0.5),
                     getOpacityFromTexture(centerValue.r, 0, 0.5));

  int segmentIndex = int(centerValue.r * 255.0);

  // Use texture sampling for outlineThickness
  float textureCoordinate = float(segmentIndex - 1) / 1024.0;
  float textureValue =
      texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, 0.5)).r;
  int actualThickness = int(textureValue * 255.0);

  // If it is the background (segment index 0), we should quickly bail out.
  // Previously, this was determined by tColor.a, which was incorrect as it
  // prevented the outline from appearing when the fill is 0.
  if (segmentIndex == 0) {
    return vec4(0, 0, 0, 0);
  }

  // Only perform outline check on fragments rendering voxels that aren't
  // invisible. Saves a bunch of needless checks on the background.
  // TODO define epsilon when building shader?
  for (int i = -actualThickness; i <= actualThickness; i++) {
    for (int j = -actualThickness; j <= actualThickness; j++) {
      if (i == 0 && j == 0) {
        continue;
      }

      vec4 neighborPixelCoord =
          vec4(gl_FragCoord.x + float(i), gl_FragCoord.y + float(j),
               gl_FragCoord.z, gl_FragCoord.w);

      vec3 neighborPosIS = fragCoordToIndexSpace(neighborPixelCoord);
      vec4 value = getTextureValue(neighborPosIS);

      // If any of my neighbours are not the same value as I
      // am, this means I am on the border of the segment.
      // We can break the loops
      if (any(notEqual(value, centerValue))) {
        pixelOnBorder = true;
        break;
      }
    }

    if (pixelOnBorder == true) {
      break;
    }
  }

  // If I am on the border, I am displayed at full opacity
  if (pixelOnBorder == true) {
    tColor.a = volume.outlineOpacity;
  }

  return tColor;
}

vec4 getColorForAdditivePreset(vec4 tValue, vec3 posVC, vec3 posIS) {
  // compute normals
  mat4 normalMat = computeMat4Normal(posIS, tValue);
  vec4 normalLights[2];
  normalLights[0] = normalMat[0];
  normalLights[1] = normalMat[1];
  #if vtkNumberOfLights > 0
    if (volume.computeNormalFromOpacity == 1) {
      for (int component = 0; component < 2; ++component) {
        vec3 scalarInterp[2];
        float height = volume.transferFunctionsSampleHeight[component];
        computeNormalForDensity(posIS, scalarInterp, component);
        normalLights[component] =
            computeDensityNormal(scalarInterp, height, 1.0, component);
      }
    }
  #endif

  // compute opacities
  float opacities[2];
  opacities[0] = getOpacityFromTexture(
      tValue[0], 0, volume.transferFunctionsSampleHeight[0]);
  opacities[1] = getOpacityFromTexture(
      tValue[1], 1, volume.transferFunctionsSampleHeight[1]);
  #ifdef EnabledGradientOpacity
    for (int component = 0; component < 2; ++component) {
      opacities[component] *=
          computeGradientOpacityFactor(normalMat[component].a, component);
    }
  #endif
  float opacitySum = opacities[0] + opacities[1];
  if (opacitySum <= 0.0) {
    return vec4(0.0);
  }

  // mix the colors and opacities
  vec3 colors[2];
  for (int component = 0; component < 2; ++component) {
    float sampleHeight = volume.transferFunctionsSampleHeight[component];
    vec3 color = getColorFromTexture(tValue[component], component, sampleHeight);
    color = applyAllLightning(color, opacities[component], posVC,
                              normalLights[component]);
    colors[component] = color;
  }
  vec3 mixedColor =
      (opacities[0] * colors[0] + opacities[1] * colors[1]) / opacitySum;
  return vec4(mixedColor, min(1.0, opacitySum));
}

vec4 getColorForColorizePreset(vec4 tValue, vec3 posVC, vec3 posIS) {
  // compute normals
  mat4 normalMat = computeMat4Normal(posIS, tValue);
  vec4 normalLight = normalMat[0];
  #if vtkNumberOfLights > 0
    if (volume.computeNormalFromOpacity == 1) {
      vec3 scalarInterp[2];
      float height = volume.transferFunctionsSampleHeight[0];
      computeNormalForDensity(posIS, scalarInterp, 0);
      normalLight = computeDensityNormal(scalarInterp, height, 1.0, 0);
    }
  #endif

  // compute opacities
  float opacity = getOpacityFromTexture(
      tValue[0], 0, volume.transferFunctionsSampleHeight[0]);
  #ifdef EnabledGradientOpacity
    opacity *= computeGradientOpacityFactor(normalMat[0].a, 0);
  #endif

  // colorizing component
  vec3 colorizingColor = getColorFromTexture(
      tValue[0], 1, volume.transferFunctionsSampleHeight[1]);
  float colorizingOpacity = getOpacityFromTexture(
      tValue[1], 1, volume.transferFunctionsSampleHeight[1]);

  // mix the colors and opacities
  vec3 color =
      getColorFromTexture(tValue[0], 0,
                          volume.transferFunctionsSampleHeight[0]) *
      mix(vec3(1.0), colorizingColor, colorizingOpacity);
  color = applyAllLightning(color, opacity, posVC, normalLight);
  return vec4(color, opacity);
}

vec4 getColorForDefaultIndependentPreset(vec4 tValue, vec3 posIS) {

  // compute the normal vectors as needed
  #if defined(EnabledGradientOpacity) || vtkNumberOfLights > 0
    mat4 normalMat = computeMat4Normal(posIS, tValue);
  #endif

  // process color and opacity for each component
  // initial value of alpha is determined by wether the first component is
  // proportional or not
  #if defined(vtkComponent0Proportional)
    // when it is proportional, it starts at 1 (neutral for multiplications)
    float alpha = 1.0;
  #else
    // when it is not proportional, it starts at 0 (neutral for additions)
    float alpha = 0.0;
  #endif

  vec3 mixedColor = vec3(0.0);
  #if vtkNumberOfComponents > 0
    {
      const int component = 0;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent0Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif
  #if vtkNumberOfComponents > 1
    {
      const int component = 1;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent1Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif
  #if vtkNumberOfComponents > 2
    {
      const int component = 2;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent2Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif
  #if vtkNumberOfComponents > 3
    {
      const int component = 3;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent3Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif

  return vec4(mixedColor, alpha);
}

vec4 getColorForDependentComponents(vec4 tValue, vec3 posVC, vec3 posIS) {
  #if defined(EnabledGradientOpacity) || vtkNumberOfLights > 0
    // use component 3 of the opacity texture as getTextureValue() sets alpha to
    // the opacity value
    vec3 scalarInterp[2];
    vec4 normal0 = computeNormalForDensity(posIS, scalarInterp, 3);
    float gradientOpacity = computeGradientOpacityFactor(normal0.a, 0);
  #endif

  // get color and opacity
  #if vtkNumberOfComponents == 1
    vec3 tColor = getColorFromTexture(tValue.r, 0, 0.5);
    float alpha = getOpacityFromTexture(tValue.r, 0, 0.5);
  #endif
  #if vtkNumberOfComponents == 2
    vec3 tColor = vec3(tValue.r * volume.colorTextureScale[0] +
                  volume.colorTextureShift[0]);
    float alpha = getOpacityFromTexture(tValue.a, 1, 0.5);
  #endif
  #if vtkNumberOfComponents == 3
      vec3 tColor = tValue.rgb * volume.colorTextureScale.rgb +
              volume.colorTextureShift.rgb;
      float alpha = getOpacityFromTexture(tValue.a, 0, 0.5);
  #endif
  #if vtkNumberOfComponents == 4
      vec3 tColor = tValue.rgb * volume.colorTextureScale.rgb +
              volume.colorTextureShift.rgb;
      float alpha = getOpacityFromTexture(tValue.a, 3, 0.5);
  #endif

  // Apply gradient opacity
  #if defined(EnabledGradientOpacity)
    alpha *= gradientOpacity;
  #endif

  #if vtkNumberOfComponents == 1
    if (alpha < EPSILON) {
      return vec4(0.0);
    }
  #endif

  // lighting
  #if vtkNumberOfLights > 0
    vec4 normalLight;
    if (volume.computeNormalFromOpacity == 1) {
      if (normal0[3] != 0.0) {
        normalLight =
            computeDensityNormal(scalarInterp, 0.5, gradientOpacity, 0);
        if (normalLight[3] == 0.0) {
          normalLight = normal0;
        }
      }
    } else {
      normalLight = normal0;
    }
    tColor = applyAllLightning(tColor, alpha, posVC, normalLight);
  #endif

  return vec4(tColor, alpha);
}

vec4 getColorForValue(vec4 tValue, vec3 posVC, vec3 posIS) {
  #ifdef EnableColorForValueFunctionId0
    return getColorForDependentComponents(tValue, posVC, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId1
    return getColorForAdditivePreset(tValue, posVC, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId2
    return getColorForColorizePreset(tValue, posVC, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId3
    /*
      * Mix the color information from all the independent components to get a
      * single rgba output. See other shader functions like
      * \`getColorForAdditivePreset\` to learn how to create a custom color mix.
      * The custom color mix should return a value, but if it doesn't, it will
      * fallback on the default shading
      */
    //VTK::CustomColorMix
  #endif

  #if defined(EnableColorForValueFunctionId4) || defined(EnableColorForValueFunctionId3)
    return getColorForDefaultIndependentPreset(tValue, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId5
    return getColorForLabelOutline();
  #endif
}

bool valueWithinScalarRange(vec4 val) {
  #if vtkNumberOfComponents > 1 && !defined(EnabledIndependentComponents)
    return false;
  #endif
  vec4 rangeMin = volume.ipScalarRangeMin;
  vec4 rangeMax = volume.ipScalarRangeMax;
  for (int component = 0; component < vtkNumberOfComponents; ++component) {
    if (val[component] < rangeMin[component] ||
        rangeMax[component] < val[component]) {
      return false;
    }
  }
  return true;
}

#if vtkBlendMode == LABELMAP_EDGE_PROJECTION_BLEND
  bool checkOnEdgeForNeighbor(int xFragmentOffset, int yFragmentOffset,
                              int segmentIndex, vec3 stepIS) {
    vec3 volumeDimensions = vec3(volume.dimensions);
    vec4 neighborPixelCoord = vec4(gl_FragCoord.x + float(xFragmentOffset),
                                  gl_FragCoord.y + float(yFragmentOffset),
                                  gl_FragCoord.z, gl_FragCoord.w);
    vec3 originalNeighborPosIS = fragCoordToIndexSpace(neighborPixelCoord);

    vec3 neighborPosIS = originalNeighborPosIS;
    for (int k = 0; k < vtkMaximumNumberOfSamples / 2; ++k) {
      ivec3 texCoord = ivec3(neighborPosIS * volumeDimensions);
      vec4 texValue = rawFetchTexture(texCoord);
      if (int(texValue.g) == segmentIndex) {
        // not on edge
        return false;
      }
      neighborPosIS += stepIS;
    }

    neighborPosIS = originalNeighborPosIS;
    for (int k = 0; k < vtkMaximumNumberOfSamples / 2; ++k) {
      ivec3 texCoord = ivec3(neighborPosIS * volumeDimensions);
      vec4 texValue = rawFetchTexture(texCoord);
      if (int(texValue.g) == segmentIndex) {
        // not on edge
        return false;
      }
      neighborPosIS -= stepIS;
    }

    // onedge
    float sampleHeight = volume.transferFunctionsSampleHeight[1];
    vec3 tColorSegment =
        getColorFromTexture(float(segmentIndex), 1, sampleHeight);
    float pwfValueSegment =
        getOpacityFromTexture(float(segmentIndex), 1, sampleHeight);
    gl_FragData[0] = vec4(tColorSegment, pwfValueSegment);
    return true;
  }
#endif

vec4 getColorAtPos(vec3 posVC) {
  vec3 posIS = posVCtoIS(posVC);
  vec4 texValue = getTextureValue(posIS);
  return getColorForValue(texValue, posVC, posIS);
}

//=======================================================================
// Apply the specified blend mode operation along the ray's path.
//
void applyBlend(vec3 rayOriginVC, vec3 rayDirVC, float minDistance,
                float maxDistance) {
  // start slightly inside and apply some jitter
  vec3 stepVC = rayDirVC * sampleDistance;
  float raySteps = (maxDistance - minDistance) / sampleDistance;

  // Avoid 0.0 jitter
  float jitter = 0.01 + 0.99 * fragmentSeed;

  #if vtkBlendMode == COMPOSITE_BLEND
    // now map through opacity and color
    vec3 firstPosVC = rayOriginVC + minDistance * rayDirVC;
    vec4 firstColor = getColorAtPos(firstPosVC);

    // handle very thin volumes
    if (raySteps <= 1.0) {
      firstColor.a = 1.0 - pow(1.0 - firstColor.a, raySteps);
      gl_FragData[0] = firstColor;
      return;
    }

    // first color only counts for \`jitter\` factor of the step
    firstColor.a = 1.0 - pow(1.0 - firstColor.a, jitter);
    vec4 color = vec4(firstColor.rgb * firstColor.a, firstColor.a);
    vec3 posVC = firstPosVC + jitter * stepVC;
    float stepsTraveled = jitter;

    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }
      vec4 tColor = getColorAtPos(posVC);

      color = color + vec4(tColor.rgb * tColor.a, tColor.a) * (1.0 - color.a);
      stepsTraveled++;
      posVC += stepVC;
      if (color.a > 0.99) {
        color.a = 1.0;
        break;
      }
    }

    if (color.a < 0.99 && (raySteps - stepsTraveled) > 0.0) {
      vec3 endPosVC = rayOriginVC + maxDistance * rayDirVC;
      vec4 tColor = getColorAtPos(endPosVC);
      tColor.a = 1.0 - pow(1.0 - tColor.a, raySteps - stepsTraveled);

      float mix = (1.0 - color.a);
      color = color + vec4(tColor.rgb * tColor.a, tColor.a) * mix;
    }

    gl_FragData[0] = vec4(color.rgb / color.a, color.a);
  #endif

  #if vtkBlendMode == MAXIMUM_INTENSITY_BLEND ||                                 \\
      vtkBlendMode == MINIMUM_INTENSITY_BLEND
    // Find maximum/minimum intensity along the ray.

    // Define the operation we will use (min or max)
    #if vtkBlendMode == MAXIMUM_INTENSITY_BLEND
      #define OP max
    #else
      #define OP min
    #endif

    vec3 posVC = rayOriginVC + minDistance * rayDirVC;
    float stepsTraveled = 0.0;

    // Find a value to initialize the selected variables
    vec4 selectedValue;
    vec3 selectedPosVC;
    vec3 selectedPosIS;
    {
      vec3 posIS = posVCtoIS(posVC);
      selectedValue = getTextureValue(posIS);
      selectedPosVC = posVC;
      selectedPosIS = posIS;
    }

    // If the clipping range is shorter than the sample distance
    // we can skip the sampling loop along the ray.
    if (raySteps <= 1.0) {
      gl_FragData[0] = getColorForValue(selectedValue, selectedPosVC, selectedPosIS);
      return;
    }

    posVC += jitter * stepVC;
    stepsTraveled += jitter;

    // Sample along the ray until vtkMaximumNumberOfSamples,
    // ending slightly inside the total distance
    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      // Get selected values
      vec3 posIS = posVCtoIS(posVC);
      vec4 previousSelectedValue = selectedValue;
      vec4 currentValue = getTextureValue(posIS);
      selectedValue = OP(selectedValue, currentValue);
      if (previousSelectedValue != selectedValue) {
        selectedPosVC = posVC;
        selectedPosIS = posIS;
      }

      // Otherwise, continue along the ray
      stepsTraveled++;
      posVC += stepVC;
    }

    // Perform the last step along the ray using the
    // residual distance
    posVC = rayOriginVC + maxDistance * rayDirVC;
    {
      vec3 posIS = posVCtoIS(posVC);
      vec4 previousSelectedValue = selectedValue;
      vec4 currentValue = getTextureValue(posIS);
      selectedValue = OP(selectedValue, currentValue);
      if (previousSelectedValue != selectedValue) {
        selectedPosVC = posVC;
        selectedPosIS = posIS;
      }
    }

    gl_FragData[0] = getColorForValue(selectedValue, selectedPosVC, selectedPosIS);
  #endif

  #if vtkBlendMode == ADDITIVE_INTENSITY_BLEND ||                                \\
      vtkBlendMode == AVERAGE_INTENSITY_BLEND
    vec4 sum = vec4(0.);
    #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
      float totalWeight = 0.0;
    #endif
    vec3 posVC = rayOriginVC + minDistance * rayDirVC;
    float stepsTraveled = 0.0;

    vec3 posIS = posVCtoIS(posVC);
    vec4 value = getTextureValue(posIS);

    if (raySteps <= 1.0) {
      gl_FragData[0] = getColorForValue(value * raySteps, posVC, posIS);
      return;
    }

    if (valueWithinScalarRange(value)) {
      sum += value * jitter;
      #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
        totalWeight += jitter;
      #endif
    }
    posVC += jitter * stepVC;
    stepsTraveled += jitter;

    // Sample along the ray until vtkMaximumNumberOfSamples,
    // ending slightly inside the total distance
    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      posIS = posVCtoIS(posVC);
      value = getTextureValue(posIS);
      // One can control the scalar range by setting the AverageIPScalarRange to
      // disregard scalar values, not in the range of interest, from the average
      // computation. Notes:
      // - We are comparing all values in the texture to see if any of them
      //   are outside of the scalar range. In the future we might want to allow
      //   scalar ranges for each component.
      if (valueWithinScalarRange(value)) {
        sum += value;
        #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
          totalWeight++;
        #endif
      }

      stepsTraveled++;
      posVC += stepVC;
    }

    // Perform the last step along the ray using the
    // residual distance
    posVC = rayOriginVC + maxDistance * rayDirVC;
    posIS = posVCtoIS(posVC);
    value = getTextureValue(posIS);
    if (valueWithinScalarRange(value)) {
      sum += value;
      #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
        totalWeight += raySteps - stepsTraveled;
      #endif
    }

    #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
      sum /= vec4(totalWeight, totalWeight, totalWeight, 1.0);
    #endif

    gl_FragData[0] = getColorForValue(sum, posVC, posIS);
  #endif

  #if vtkBlendMode == RADON_TRANSFORM_BLEND
    float normalizedRayIntensity = 1.0;
    vec3 firstPosVC = rayOriginVC + minDistance * rayDirVC;
    vec3 posVC = firstPosVC;
    float stepsTraveled = 0.0;

    // handle very thin volumes
    if (raySteps <= 1.0) {
      vec3 posIS = posVCtoIS(posVC);
      vec4 tValue = getTextureValue(posIS);
      normalizedRayIntensity -= raySteps * sampleDistance *
                                getRadonOpacity(tValue);
      gl_FragData[0] =
          vec4(getRadonColor(normalizedRayIntensity), 1.0);
      return;
    }

    vec3 firstPosIS = posVCtoIS(firstPosVC);
    vec4 firstValue = getTextureValue(firstPosIS);
    normalizedRayIntensity -=
        jitter * sampleDistance * getRadonOpacity(firstValue);

    posVC += jitter * stepVC;
    stepsTraveled += jitter;

    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      vec3 posIS = posVCtoIS(posVC);
      vec4 value = getTextureValue(posIS);
      // Convert scalar value to normalizedRayIntensity coefficient and
      // accumulate normalizedRayIntensity
      normalizedRayIntensity -=
          sampleDistance * getRadonOpacity(value);

      posVC += stepVC;
      stepsTraveled++;
    }

    if ((raySteps - stepsTraveled) > 0.0) {
      vec3 endPosIS = clamp(
        posVCtoIS(rayOriginVC + maxDistance * rayDirVC),
        vec3(0.0), vec3(1.0));
      vec4 endValue = getTextureValue(endPosIS);
      normalizedRayIntensity -=
          (raySteps - stepsTraveled) * sampleDistance * getRadonOpacity(endValue);
    }

    // map normalizedRayIntensity to color
    gl_FragData[0] =
        vec4(getRadonColor(normalizedRayIntensity), 1.0);
  #endif

  #if vtkBlendMode == LABELMAP_EDGE_PROJECTION_BLEND
    // Only works with a single volume
    vec3 posVC = rayOriginVC + minDistance * rayDirVC;
    float stepsTraveled = 0.0;
    vec3 posIS = posVCtoIS(posVC);
    vec4 tValue = getTextureValue(posIS);
    if (raySteps <= 1.0) {
      gl_FragData[0] = getColorForValue(tValue, posVC, posIS);
      return;
    }

    vec3 stepIS = vecVCToIS(stepVC);
    vec4 value = tValue;
    posIS += jitter * stepIS;
    stepsTraveled += jitter;
    vec3 maxPosIS = posIS; // Store the position of the max value
    int segmentIndex = int(value.g);
    bool originalPosHasSeenNonZero = false;

    if (segmentIndex != 0) {
      // Tried using the segment index in an boolean array but reading
      // from the array by dynamic indexing was horrondously slow
      // so use bit masking instead and assign 1 to the bit corresponding to the
      // segment index and later check if the bit is set via bit operations
      setLabelOutlineBit(segmentIndex);
    }

    // Sample along the ray until vtkMaximumNumberOfSamples,
    // ending slightly inside the total distance
    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      // compute the scalar
      tValue = getTextureValue(posIS);
      segmentIndex = int(tValue.g);

      if (segmentIndex != 0) {
        originalPosHasSeenNonZero = true;
        setLabelOutlineBit(segmentIndex);
      }

      if (tValue.r > value.r) {
        value = tValue;   // Update the max value
        maxPosIS = posIS; // Update the position where max occurred
      }

      // Otherwise, continue along the ray
      stepsTraveled++;
      posIS += stepIS;
    }

    // Perform the last step along the ray using the
    // residual distance
    posIS = posVCtoIS(rayOriginVC + maxDistance * rayDirVC);
    tValue = getTextureValue(posIS);

    if (tValue.r > value.r) {
      value = tValue;   // Update the max value
      maxPosIS = posIS; // Update the position where max occurred
    }

    // If we have not seen any non-zero segments, we can return early
    // and grab color from the actual center value first component (image)
    if (!originalPosHasSeenNonZero) {
      vec3 maxPosVC = posIStoVC(maxPosIS);
      gl_FragData[0] = getColorForValue(value, maxPosVC, maxPosIS);
      return;
    }

    vec3 neighborRayStepsIS = stepIS;
    float neighborRaySteps = raySteps;
    bool shouldLookInAllNeighbors = false;

    vec3 volumeSpacings = volume.spacing;
    float minVoxelSpacing =
        min(volumeSpacings[0], min(volumeSpacings[1], volumeSpacings[2]));
    vec4 base =
        vec4(gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, gl_FragCoord.w);

    vec4 baseXPlus = vec4(gl_FragCoord.x + 1.0, gl_FragCoord.y, gl_FragCoord.z,
                          gl_FragCoord.w);
    vec4 baseYPlus = vec4(gl_FragCoord.x, gl_FragCoord.y + 1.0, gl_FragCoord.z,
                          gl_FragCoord.w);

    vec3 baseWorld = fragCoordToWorld(base);
    vec3 baseXPlusWorld = fragCoordToWorld(baseXPlus);
    vec3 baseYPlusWorld = fragCoordToWorld(baseYPlus);

    float XPlusDiff = length(baseXPlusWorld - baseWorld);
    float YPlusDiff = length(baseYPlusWorld - baseWorld);

    float minFragSpacingWorld = min(XPlusDiff, YPlusDiff);

    for (int s = 1; s < MAX_SEGMENT_INDEX; s++) {
      // bail out quickly if the segment index has not
      // been seen by the center segment
      if (!isLabelOutlineBitSet(s)) {
        continue;
      }

      // Use texture sampling for outlineThickness so that we can have
      // per segment thickness
      float textureCoordinate = float(s - 1) / 1024.0;
      float textureValue =
          texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, 0.5)).r;

      int actualThickness = int(textureValue * 255.0);

      // check the extreme points in the neighborhood since there is a better
      // chance of finding the edge there, so that we can bail out
      // faster if we find the edge
      bool onEdge = checkOnEdgeForNeighbor(-actualThickness, -actualThickness, s,
                                          stepIS) ||
                    checkOnEdgeForNeighbor(actualThickness, actualThickness, s,
                                          stepIS) ||
                    checkOnEdgeForNeighbor(actualThickness, -actualThickness, s,
                                          stepIS) ||
                    checkOnEdgeForNeighbor(-actualThickness, +actualThickness, s,
                                          stepIS);

      if (onEdge) {
        return;
      }

      // since the next step is computationally expensive, we need to perform
      // some optimizations to avoid it if possible. One of the optimizations
      // is to check the whether the minimum of the voxel spacing is greater than
      // the 2 * the thickness of the outline segment. If that is the case
      // then we can safely skip the next step since we can be sure that the
      // the previous 4 checks on the extreme points would caught the entirety
      // of the all the fragments inside. i.e., this happens when we zoom out,
      if (minVoxelSpacing >
          (2.0 * float(actualThickness) - 1.0) * minFragSpacingWorld) {
        continue;
      }

      // Loop through the rest, skipping the processed extremes and the center
      for (int i = -actualThickness; i <= actualThickness; i++) {
        for (int j = -actualThickness; j <= actualThickness; j++) {
          if (i == 0 && j == 0)
            continue; // Skip the center
          if (abs(i) == actualThickness && abs(j) == actualThickness)
            continue; // Skip corners
          if (checkOnEdgeForNeighbor(i, j, s, stepIS)) {
            return;
          }
        }
      }
    }

    float sampleHeight = volume.transferFunctionsSampleHeight[0];
    vec3 tColor0 = getColorFromTexture(value.r, 0, sampleHeight);
    float pwfValue0 = getOpacityFromTexture(value.r, 0, sampleHeight);
    gl_FragData[0] = vec4(tColor0, pwfValue0);
  #endif
}

//=======================================================================
// given a
// - ray direction (rayDir)
// - starting point (vertexVCVSOutput)
// - bounding planes of the volume
// - optionally depth buffer values
// - far clipping plane
// compute the start/end distances of the ray we need to cast
vec2 computeRayDistances(vec3 rayOriginVC, vec3 rayDirVC) {
  vec2 dists = rayIntersectVolumeDistances(rayOriginVC, rayDirVC);

  //VTK::ClipPlane::Impl

  // do not go behind front clipping plane
  dists.x = max(0.0, dists.x);

  // do not go PAST far clipping plane
  float farDist = -camThick / rayDirVC.z;
  dists.y = min(farDist, dists.y);

  // Do not go past the zbuffer value if set
  // This is used for intermixing opaque geometry
  //VTK::ZBuffer::Impl

  return dists;
}

float getFragmentSeed() {
  // This first noise has a diagonal pattern
  float firstNoise =
      fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  // This second noise is made out of blocks of CPU generated noise
  float secondNoise = texture2D(jtexture, gl_FragCoord.xy / 32.0).r;
  // Combine the two sources of noise in a way that the distribution is uniform
  // in [0,1[
  float noiseSum = firstNoise + secondNoise;
  return noiseSum < 1.0 ? noiseSum : noiseSum - 1.0;
}

void main() {
  fragmentSeed = getFragmentSeed();

  if (cameraParallel == 1) {
    // Camera is parallel, so the rayDir is just the direction of the camera.
    rayDirVC = vec3(0.0, 0.0, -1.0);
  } else {
    // camera is at 0,0,0 so rayDir for perspective is just the vc coord
    rayDirVC = normalize(vertexVCVSOutput);
  }

  vec3 rayOriginVC = vertexVCVSOutput;
  vec2 rayStartEndDistancesVC = computeRayDistances(rayOriginVC, rayDirVC);
  if (rayStartEndDistancesVC[1] <= rayStartEndDistancesVC[0] ||
      rayStartEndDistancesVC[1] <= 0.0) {
    // Volume not hit or behind the ray
    discard;
  }

  // Perform the blending operation along the ray
  applyBlend(rayOriginVC, rayDirVC, rayStartEndDistancesVC[0], rayStartEndDistancesVC[1]);
}
`,{vtkWarningMacro:Iu,vtkErrorMacro:qr}=me,Nu={idxToView:Z(new Float64Array(16)),vecISToVCMatrix:We(new Float64Array(9)),normalISToVCMatrix:We(new Float64Array(9)),linearModelToViewMatrix:We(new Float64Array(9)),modelToView:Z(new Float64Array(16)),projectionToView:Z(new Float64Array(16)),projectionToWorld:Z(new Float64Array(16))};function Gu(t,e){e.classHierarchy.push("vtkOpenGLVolumeMapper");function a(c){return c.getUseLabelOutline()||e.renderable.getBlendMode()===Ir.LABELMAP_EDGE_PROJECTION_BLEND}const r=new Map;function n(c,u){if(!u)return;const p=(r.get(u)??0)-1;p<=0?(c.unregisterGraphicsResourceUser(u,t),r.delete(u)):r.set(u,p)}function s(c,u){if(!u)return;const p=r.get(u)??0,l=p+1;r.set(u,l),p<=0&&c.registerGraphicsResourceUser(u,t)}function i(c,u,p){u!==p&&(n(c,u),s(c,p))}function o(c){[...r.keys()].forEach(u=>c.unregisterGraphicsResourceUser(u,t))}t.buildPass=()=>{e.zBufferTexture=null},t.zBufferPass=(c,u)=>{if(c){const p=u.getZBufferTexture();p!==e.zBufferTexture&&(e.zBufferTexture=p)}},t.opaqueZBufferPass=(c,u)=>t.zBufferPass(c,u),t.volumePass=(c,u)=>{if(c){const p=e._openGLRenderWindow;e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),p&&!p.isDeleted()&&p!==e._openGLRenderWindow&&o(p),e.context=e._openGLRenderWindow.getContext(),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow),e.jitterTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.framebuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.openGLVolume=t.getFirstAncestorOfType("vtkOpenGLVolume");const l=e.openGLVolume.getRenderable();e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");const f=e._openGLRenderer.getRenderable();e.openGLCamera=e._openGLRenderer.getViewNodeFor(f.getActiveCamera(),e.openGLCamera),t.renderPiece(f,l)}},t.getShaderTemplate=(c,u,p)=>{c.Vertex=Pu,c.Fragment=Fu,c.Geometry=""},t.replaceShaderValues=(c,u,p)=>{let l=c.Fragment;l=V.substitute(l,"//VTK::EnabledColorFunctions",`#define EnableColorForValueFunctionId${e.previousState.colorForValueFunctionId}`).result;const f=[];e.previousState.surfaceLightingEnabled&&f.push("Surface"),e.previousState.volumeLightingEnabled&&f.push("Volume"),l=V.substitute(l,"//VTK::EnabledLightings",f.map(h=>`#define Enable${h}Lighting`)).result,e.previousState.multiTexturePerVolumeEnabled&&(l=V.substitute(l,"//VTK::EnabledMultiTexturePerVolume","#define EnabledMultiTexturePerVolume").result),e.previousState.useIndependentComponents&&(l=V.substitute(l,"//VTK::EnabledIndependentComponents","#define EnabledIndependentComponents").result),e.previousState.gradientOpacityEnabled&&(l=V.substitute(l,"//VTK::EnabledGradientOpacity","#define EnabledGradientOpacity").result),l=V.substitute(l,"//VTK::vtkProportionalComponents",e.previousState.proportionalComponents.map(h=>`#define vtkComponent${h}Proportional`).join(`
`)).result,l=V.substitute(l,"//VTK::vtkForceNearestComponents",e.previousState.forceNearestComponents.map(h=>`#define vtkComponent${h}ForceNearest`).join(`
`)).result,e.previousState.hasZBufferTexture&&(l=V.substitute(l,"//VTK::ZBuffer::Dec",["uniform sampler2D zBufferTexture;","uniform float vpZWidth;","uniform float vpZHeight;"]).result,l=V.substitute(l,"//VTK::ZBuffer::Impl",["vec4 depthVec = texture2D(zBufferTexture, vec2(gl_FragCoord.x / vpZWidth, gl_FragCoord.y/vpZHeight));","float zdepth = (depthVec.r*256.0 + depthVec.g)/257.0;","zdepth = zdepth * 2.0 - 1.0;","if (cameraParallel == 0) {","zdepth = -2.0 * camFar * camNear / (zdepth*(camFar-camNear)-(camFar+camNear)) - camNear;}","else {",`zdepth = (zdepth + 1.0) * 0.5 * (camFar - camNear);}
`,"zdepth = -zdepth/rayDirVC.z;","dists.y = min(zdepth,dists.y);"]).result),l=V.substitute(l,"//VTK::BlendMode",`${e.previousState.blendMode}`).result,l=V.substitute(l,"//VTK::NumberOfLights",`${e.previousState.numberOfLights}`).result,l=V.substitute(l,"//VTK::MaxLaoKernelSize",`${e.previousState.maxLaoKernelSize}`).result,l=V.substitute(l,"//VTK::NumberOfComponents",`${e.previousState.numberOfComponents}`).result,l=V.substitute(l,"//VTK::MaximumNumberOfSamples",`${e.previousState.maximumNumberOfSamples}`).result,c.Fragment=l;const g=e.previousState.numberOfClippingPlanes;g>0&&(l=V.substitute(l,"//VTK::ClipPlane::Dec",["uniform vec3 vClipPlaneNormals[6];","uniform float vClipPlaneDistances[6];","uniform vec3 vClipPlaneOrigins[6];","uniform int clip_numPlanes;","//VTK::ClipPlane::Dec","#define vtkClippingPlanesOn"],!1).result,l=V.substitute(l,"//VTK::ClipPlane::Impl",[`for(int i = 0; i < ${g}; i++) {`,"  float rayDirRatio = dot(rayDirVC, vClipPlaneNormals[i]);","  float equationResult = dot(vertexVCVSOutput, vClipPlaneNormals[i]) + vClipPlaneDistances[i];","  if (rayDirRatio == 0.0)","  {","    if (equationResult < 0.0) dists.x = dists.y;","    continue;","  }","  float result = -1.0 * equationResult / rayDirRatio;","  if (rayDirRatio < 0.0) dists.y = min(dists.y, result);","  else dists.x = max(dists.x, result);","}","//VTK::ClipPlane::Impl"],!1).result),c.Fragment=l},t.getNeedToRebuildShaders=(c,u,p)=>{const l=!!e.zBufferTexture,f=e.currentValidInputs.length,g=e.numberOfLights,h=e.numberOfComponents,d=e.useIndependentComponents,v=p.getProperties()[e.currentValidInputs[0].inputIndex],x=f>1,C=je.getDiagonalLength(p.getBounds()),T=Math.ceil(C/t.getCurrentSampleDistance(u));T>e.renderable.getMaximumSamplesPerRay()&&Iu(`The number of steps required ${T} is larger than the specified maximum number of steps ${e.renderable.getMaximumSamplesPerRay()}.
Please either change the volumeMapper sampleDistance or its maximum number of samples.`);const m=d?h:1;let w=!1;for(let k=0;k<m;++k)if(v.getUseGradientOpacity(k)){w=!0;break}let O=0;const B=v.getLAOKernelSize();B>O&&v.getLocalAmbientOcclusion()&&v.getAmbient()>0&&(O=B);const U=e.renderable.getClippingPlanes().length,F=e.renderable.getViewSpecificProperties().OpenGL?.ShaderReplacements,D=e.currentRenderPass?.getShaderReplacement(),y=e.renderable.getBlendMode(),S=(()=>{if(y!==Ir.LABELMAP_EDGE_PROJECTION_BLEND&&a(v))return 5;if(d)switch(v.getColorMixPreset()){case Nr.ADDITIVE:return 1;case Nr.COLORIZE:return 2;case Nr.CUSTOM:return 3;default:return 4}return 0})(),P=v.getVolumetricScatteringBlending()<1,M=v.getVolumetricScatteringBlending()>0;let b=!1;for(let k=0;k<h;++k)if(v.getForceNearestInterpolation(k)){b=!0;break}const L=[],R=[];for(let k=0;k<h;k++)v.getOpacityMode(k)===$i.PROPORTIONAL&&L.push(k),v.getForceNearestInterpolation(k)&&R.push(k);const E={numberOfComponents:h,useIndependentComponents:d,proportionalComponents:L,forceNearestComponents:R,blendMode:y,numberOfLights:g,numberOfValidInputs:f,maximumNumberOfSamples:T,hasZBufferTexture:l,maxLaoKernelSize:O,numberOfClippingPlanes:U,mapperShaderReplacements:F,renderPassShaderReplacements:D,colorForValueFunctionId:S,surfaceLightingEnabled:P,volumeLightingEnabled:M,forceNearestInterpolationEnabled:b,multiTexturePerVolumeEnabled:x,gradientOpacityEnabled:w};return c.getProgram()?.getHandle()===0||!e.previousState||!to(e.previousState,E)?(e.previousState=E,!0):!1},t.updateShaders=(c,u,p)=>{if(t.getNeedToRebuildShaders(c,u,p)){const l={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(l,u,p);const f=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(l.Vertex,l.Fragment,l.Geometry);if(!f)return qr("Error compiling volume mapper shader program."),c.setProgram(null),!1;f!==c.getProgram()&&(c.setProgram(f),c.getVAO().releaseGraphicsResources()),c.getShaderSourceTime().modified()}else if(!e._openGLRenderWindow.getShaderCache().readyShaderProgram(c.getProgram()))return c.setProgram(null),!1;return c.getVAO().bind(),t.setMapperShaderParameters(c,u,p),t.setCameraShaderParameters(c,u,p),t.setPropertyShaderParameters(c,u,p),t.getClippingPlaneShaderParameters(c,u,p),!0},t.setMapperShaderParameters=(c,u,p)=>{const l=c.getProgram();if(!l)return;c.getCABO().getElementCount()&&(e.VBOBuildTime.getMTime()>c.getAttributeUpdateTime().getMTime()||c.getShaderSourceTime().getMTime()>c.getAttributeUpdateTime().getMTime())&&(l.isAttributeUsed("vertexDC")&&(c.getVAO().addAttributeArray(l,c.getCABO(),"vertexDC",c.getCABO().getVertexOffset(),c.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||qr("Error setting vertexDC in shader VAO.")),c.getAttributeUpdateTime().modified());const f=t.getCurrentSampleDistance(u);l.setUniformf("sampleDistance",f);const g=f*e.renderable.getVolumeShadowSamplingDistFactor();l.setUniformf("volumeShadowSampleDistance",g),e.scalarTextures.forEach((T,m)=>{l.setUniformi(`volumeTexture[${m}]`,T.getTextureUnit())});const h=p.getProperties()[e.currentValidInputs[0].inputIndex].getIpScalarRange(),d=new Float32Array(4),v=new Float32Array(4),x=(T,m,w)=>{m?.dataComputedScale?.length&&(d[T]=h[0]*m.dataComputedScale[w]+m.dataComputedOffset[w],v[T]=h[1]*m.dataComputedScale[w]+m.dataComputedOffset[w],d[T]=(d[T]-m.offset[w])/m.scale[w],v[T]=(v[T]-m.offset[w])/m.scale[w])};if(e.previousState.multiTexturePerVolumeEnabled)e.scalarTextures.forEach((T,m)=>{x(m,T.getVolumeInfo(),0)});else{const T=e.scalarTextures[0].getVolumeInfo();for(let m=0;m<4;++m)x(m,T,m)}const C="volume";if(l.setUniform4f(`${C}.ipScalarRangeMin`,d[0],d[1],d[2],d[3]),l.setUniform4f(`${C}.ipScalarRangeMax`,v[0],v[1],v[2],v[3]),e.zBufferTexture!==null){l.setUniformi("zBufferTexture",e.zBufferTexture.getTextureUnit());const T=e._useSmallViewport?[e._smallViewportWidth,e._smallViewportHeight]:e._openGLRenderWindow.getFramebufferSize();l.setUniformf("vpZWidth",T[0]),l.setUniformf("vpZHeight",T[1])}},t.setCameraShaderParameters=(c,u,p)=>{const{idxToView:l,vecISToVCMatrix:f,normalISToVCMatrix:g,linearModelToViewMatrix:h,modelToView:d,projectionToView:v,projectionToWorld:x}=Nu,C=e.openGLCamera.getKeyMatrices(u),T=e.openGLVolume.getKeyMatrices();q(d,C.wcvc,T.mcwc);const m=c.getProgram(),w=e.openGLCamera.getRenderable(),O=w.getParallelProjection(),B=w.getClippingRange();m.setUniformf("camThick",B[1]-B[0]),m.setUniformf("camNear",B[0]),m.setUniformf("camFar",B[1]),m.setUniformi("cameraParallel",O);const U=e.currentValidInputs[0],F=U.imageData.getBounds(),D=je.getCorners(F,[]).map(A=>{if(Te(A,A,d),!O){const re=-B[0]/(A[2]*so(A));Ae(A,A,re)}return Te(A,A,C.vcpc),A}),y=je.addPoints([...je.INIT_BOUNDS],D);m.setUniformf("dcxmin",y[0]),m.setUniformf("dcxmax",y[1]),m.setUniformf("dcymin",y[2]),m.setUniformf("dcymax",y[3]);const S=t.getRenderTargetSize();m.setUniformf("vpWidth",S[0]),m.setUniformf("vpHeight",S[1]);const P=t.getRenderTargetOffset();m.setUniformf("vpOffsetX",P[0]/S[0]),m.setUniformf("vpOffsetY",P[1]/S[1]),Se(v,C.vcpc),m.setUniformMatrix("PCVCMatrix",v),m.setUniformi("twoSidedLighting",u.getTwoSidedLighting());const M=new Array(2*e.previousState.maxLaoKernelSize);for(let A=0;A<e.previousState.maxLaoKernelSize;A++)M[A*2]=Math.random(),M[A*2+1]=Math.random();if(m.setUniform2fv("kernelSample",M),e.numberOfLights>0){let A=0;u.getLights().forEach(re=>{if(re.getSwitch()>0){const Fe=`lights[${A}]`,Pr=re.getColor(),et=re.getIntensity(),Fr=Ae([],Pr,et);m.setUniform3fv(`${Fe}.color`,Fr);const Mt=re.getTransformedPosition();Te(Mt,Mt,d),m.setUniform3fv(`${Fe}.positionVC`,Mt);const Me=[...re.getDirection()];Ct(Me,Me,C.normalMatrix),ln(Me,Me),m.setUniform3fv(`${Fe}.directionVC`,Me);const $t=[-.5*Me[0],-.5*Me[1],-.5*(Me[2]-1)];m.setUniform3fv(`${Fe}.halfAngleVC`,$t);const Ni=re.getAttenuationValues();m.setUniform3fv(`${Fe}.attenuation`,Ni);const Gi=re.getExponent();m.setUniformf(`${Fe}.exponent`,Gi);const Ai=re.getConeAngle();m.setUniformf(`${Fe}.coneAngle`,Ai);const _i=re.getPositional();m.setUniformi(`${Fe}.isPositional`,_i),A++}})}const b="volume",L=p.getProperties()[U.inputIndex],R=U.imageData,E=R.getSpatialExtent(),k=R.getSpacing(),N=R.getDimensions(),$=R.getIndexToWorld(),H=R.getWorldToIndex(),z=R.getDirectionByReference();q(l,d,$),m.setUniform3fv(`${b}.spacing`,k);const J=fn([],k);m.setUniform3fv(`${b}.inverseSpacing`,J),m.setUniform3iv(`${b}.dimensions`,N),m.setUniform3fv(`${b}.inverseDimensions`,fn([],N)),m.setUniformMatrix(`${b}.worldToIndex`,H),f.fill(0);const j=co(new Float64Array(3),N,k);f[0]=j[0],f[4]=j[1],f[8]=j[2],ht(f,z,f),lt(h,d),ht(f,h,f),m.setUniformMatrix3x3(`${b}.vecISToVCMatrix`,f),m.setUniformMatrix3x3(`${b}.vecVCToISMatrix`,Xe(new Float32Array(9),f)),g.fill(0),g[0]=j[0],g[4]=j[1],g[8]=j[2],ht(g,z,g),ht(g,T.normalMatrix,g),ht(g,C.normalMatrix,g),m.setUniformMatrix3x3(`${b}.normalISToVCMatrix`,g);const oe=uo(E[0],E[2],E[4]),ve=Te(new Float64Array(3),oe,l);m.setUniform3fv(`${b}.originVC`,ve);const Y=je.getDiagonalLength(p.getBounds());if(m.setUniformf(`${b}.diagonalLength`,Y),a(L)){const A=w.getDistance();w.setClippingRange(A,A+.1);const re=e.openGLCamera.getKeyMatrices(u);Se(x,re.wcpc),w.setClippingRange(B[0],B[1]),e.openGLCamera.getKeyMatrices(u),m.setUniformMatrix(`${b}.PCWCMatrix`,x)}if(L.getVolumetricScatteringBlending()>0&&(m.setUniformf(`${b}.globalIlluminationReach`,L.getGlobalIlluminationReach()),m.setUniformf(`${b}.volumetricScatteringBlending`,L.getVolumetricScatteringBlending()),m.setUniformf(`${b}.anisotropy`,L.getAnisotropy()),m.setUniformf(`${b}.anisotropySquared`,L.getAnisotropy()**2)),L.getLocalAmbientOcclusion()&&L.getAmbient()>0){const A=L.getLAOKernelSize();m.setUniformi(`${b}.kernelSize`,A);const re=L.getLAOKernelRadius();m.setUniformi(`${b}.kernelRadius`,re)}else m.setUniformi(`${b}.kernelSize`,0)},t.setPropertyShaderParameters=(c,u,p)=>{const l=c.getProgram();l.setUniformi("jtexture",e.jitterTexture.getTextureUnit());const f=p.getProperties();l.setUniformi("labelOutlineThicknessTexture",e.labelOutlineThicknessTexture.getTextureUnit()),l.setUniformi("opacityTexture",e.opacityTexture.getTextureUnit()),l.setUniformi("colorTexture",e.colorTexture.getTextureUnit());const g="volume",h=f[e.currentValidInputs[0].inputIndex],d=e.previousState.numberOfComponents,v=e.previousState.useIndependentComponents;if(v){const U=new Float32Array(4);for(let y=0;y<d;y++)U[y]=h.getComponentWeight(y);l.setUniform4fv(`${g}.independentComponentMix`,U);const F=new Float32Array(4),D=1/d;for(let y=0;y<d;++y)F[y]=(y+.5)*D;l.setUniform4fv(`${g}.transferFunctionsSampleHeight`,F)}const x=e.colorForValueFunctionId;l.setUniformi(`${g}.colorForValueFunctionId`,x);const C=h.getComputeNormalFromOpacity();l.setUniformi(`${g}.computeNormalFromOpacity`,C);const T=new Float32Array(4),m=new Float32Array(4),w=new Float32Array(4),O=new Float32Array(4);for(let U=0;U<d;U++){const F=e.previousState.multiTexturePerVolumeEnabled,D=F?U:0,y=F?0:U,S=e.scalarTextures[D].getVolumeInfo(),P=v?U:0,M=S.scale[y],b=h.getRGBTransferFunction(P).getRange();T[U]=M/(b[1]-b[0]),m[U]=(S.offset[y]-b[0])/(b[1]-b[0]);const L=h.getScalarOpacity(P).getRange();w[U]=M/(L[1]-L[0]),O[U]=(S.offset[y]-L[0])/(L[1]-L[0])}if(l.setUniform4fv(`${g}.colorTextureScale`,T),l.setUniform4fv(`${g}.colorTextureShift`,m),l.setUniform4fv(`${g}.opacityTextureScale`,w),l.setUniform4fv(`${g}.opacityTextureShift`,O),e.previousState.gradientOpacityEnabled){const U=new Array(4),F=new Array(4),D=new Array(4),y=new Array(4);if(v)for(let S=0;S<d;++S){const P=e.previousState.multiTexturePerVolumeEnabled,M=P?S:0,b=P?0:S,L=e.scalarTextures[M].getVolumeInfo().scale[b];if(h.getUseGradientOpacity(S)){const R=[h.getGradientOpacityMinimumOpacity(S),h.getGradientOpacityMaximumOpacity(S)],E=[h.getGradientOpacityMinimumValue(S),h.getGradientOpacityMaximumValue(S)];D[S]=R[0],y[S]=R[1],U[S]=L*(R[1]-R[0])/(E[1]-E[0]),F[S]=-E[0]*(R[1]-R[0])/(E[1]-E[0])+R[0]}else D[S]=1,y[S]=1,U[S]=0,F[S]=1}else{const S=d-1,P=e.previousState.multiTexturePerVolumeEnabled,M=P?S:0,b=P?0:S,L=e.scalarTextures[M].getVolumeInfo().scale[b],R=[h.getGradientOpacityMinimumOpacity(0),h.getGradientOpacityMaximumOpacity(0)],E=[h.getGradientOpacityMinimumValue(0),h.getGradientOpacityMaximumValue(0)];D[0]=R[0],y[0]=R[1],U[0]=L*(R[1]-R[0])/(E[1]-E[0]),F[0]=-E[0]*(R[1]-R[0])/(E[1]-E[0])+R[0]}l.setUniform4f(`${g}.gradientOpacityScale`,U),l.setUniform4f(`${g}.gradientOpacityShift`,F),l.setUniform4f(`${g}.gradientOpacityMin`,D),l.setUniform4f(`${g}.gradientOpacityMax`,y)}const B=h.getLabelOutlineOpacity();if(l.setUniformf(`${g}.outlineOpacity`,B),e.numberOfLights>0){l.setUniformf(`${g}.ambient`,h.getAmbient()),l.setUniformf(`${g}.diffuse`,h.getDiffuse()),l.setUniformf(`${g}.specular`,h.getSpecular());const U=h.getSpecularPower();l.setUniformf(`${g}.specularPower`,U===0?1:U)}},t.getClippingPlaneShaderParameters=(c,u,p)=>{if(e.renderable.getClippingPlanes().length>0){const l=e.openGLCamera.getKeyMatrices(u),f=[],g=[],h=[],d=e.renderable.getClippingPlanes(),v=d.length;for(let C=0;C<v;++C){const T=d[C].getNormal(),m=d[C].getOrigin();Ct(T,T,l.normalMatrix),Te(m,m,l.wcvc);const w=-1*Ia(m,T);f.push(T[0]),f.push(T[1]),f.push(T[2]),g.push(w),h.push(m[0]),h.push(m[1]),h.push(m[2])}const x=c.getProgram();x.setUniform3fv("vClipPlaneNormals",f),x.setUniformfv("vClipPlaneDistances",g),x.setUniform3fv("vClipPlaneOrigins",h),x.setUniformi("clip_numPlanes",v)}},t.delete=yn(()=>{e._animationRateSubscription&&(e._animationRateSubscription.unsubscribe(),e._animationRateSubscription=null)},()=>{e._openGLRenderWindow&&o(e._openGLRenderWindow)},t.delete),t.getRenderTargetSize=()=>{if(e._useSmallViewport)return[e._smallViewportWidth,e._smallViewportHeight];const{usize:c,vsize:u}=e._openGLRenderer.getTiledSizeAndOrigin();return[c,u]},t.getRenderTargetOffset=()=>{const{lowerLeftU:c,lowerLeftV:u}=e._openGLRenderer.getTiledSizeAndOrigin();return[c,u]},t.getCurrentSampleDistance=c=>{const u=c.getVTKWindow().getInteractor(),p=e.renderable.getSampleDistance();return u.isAnimating()?p*e.renderable.getInteractionSampleDistanceFactor():p},t.renderPieceStart=(c,u)=>{const p=c.getVTKWindow().getInteractor();if(e._lastScale||(e._lastScale=e.renderable.getInitialInteractionScale()),e._useSmallViewport=!1,p.isAnimating()&&e._lastScale>1.5&&(e._useSmallViewport=!0),e._animationRateSubscription||(e._animationRateSubscription=p.onAnimationFrameRateUpdate(()=>{if(e.renderable.getAutoAdjustSampleDistances()){const f=p.getRecentAnimationFrameRate(),g=p.getDesiredUpdateRate()/f;(g>1.15||g<.85)&&(e._lastScale*=g),e._lastScale>400&&(e._lastScale=400),e._lastScale<1.5&&(e._lastScale=1.5)}else e._lastScale=e.renderable.getImageSampleDistance()*e.renderable.getImageSampleDistance()})),e._useSmallViewport){const f=e._openGLRenderWindow.getFramebufferSize(),g=1/Math.sqrt(e._lastScale);if(e._smallViewportWidth=Math.ceil(g*f[0]),e._smallViewportHeight=Math.ceil(g*f[1]),e._smallViewportHeight>f[1]&&(e._smallViewportHeight=f[1]),e._smallViewportWidth>f[0]&&(e._smallViewportWidth=f[0]),e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.getGLFramebuffer()===null)e.framebuffer.create(f[0],f[1]),e.framebuffer.populateFramebuffer();else{const d=e.framebuffer.getSize();(!d||d[0]!==f[0]||d[1]!==f[1])&&(e.framebuffer.create(f[0],f[1]),e.framebuffer.populateFramebuffer())}e.framebuffer.bind();const h=e.context;h.clearColor(0,0,0,0),h.colorMask(!0,!0,!0,!0),h.clear(h.COLOR_BUFFER_BIT),h.viewport(0,0,e._smallViewportWidth,e._smallViewportHeight),e.fvp=[e._smallViewportWidth/f[0],e._smallViewportHeight/f[1]]}e.context.disable(e.context.DEPTH_TEST),t.updateBufferObjects(c,u);const l=u.getProperties();e.currentValidInputs.forEach(({inputIndex:f})=>{const g=l[f].getInterpolationType(),h=e.scalarTextures[f];g===Ki.NEAREST?(h.setMinificationFilter(_.NEAREST),h.setMagnificationFilter(_.NEAREST)):(h.setMinificationFilter(_.LINEAR),h.setMagnificationFilter(_.LINEAR))}),e.zBufferTexture!==null&&e.zBufferTexture.activate()},t.renderPieceDraw=(c,u)=>{const p=e.context,l=[...e.scalarTextures,e.colorTexture,e.opacityTexture,e.labelOutlineThicknessTexture,e.jitterTexture];if(l.forEach(f=>f.activate()),!t.updateShaders(e.tris,c,u)){l.forEach(f=>f.deactivate());return}p.drawArrays(p.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release(),l.forEach(f=>f.deactivate())},t.renderPieceFinish=(c,u)=>{if(e.zBufferTexture!==null&&e.zBufferTexture.deactivate(),e._useSmallViewport){if(e.framebuffer.restorePreviousBindingsAndBuffers(),e.copyShader===null){e.copyShader=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(["//VTK::System::Dec","attribute vec4 vertexDC;","uniform vec2 tfactor;","varying vec2 tcoord;","void main() { tcoord = vec2(vertexDC.x*0.5 + 0.5, vertexDC.y*0.5 + 0.5) * tfactor; gl_Position = vertexDC; }"].join(`
`),["//VTK::System::Dec","//VTK::Output::Dec","uniform sampler2D texture1;","varying vec2 tcoord;","void main() { gl_FragData[0] = texture2D(texture1,tcoord); }"].join(`
`),"");const g=e.copyShader;e.copyVAO=mn.newInstance(),e.copyVAO.setOpenGLRenderWindow(e._openGLRenderWindow),e.tris.getCABO().bind(),e.copyVAO.addAttributeArray(g,e.tris.getCABO(),"vertexDC",e.tris.getCABO().getVertexOffset(),e.tris.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||qr("Error setting vertexDC in copy shader VAO.")}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(e.copyShader);const p=e._openGLRenderWindow.getFramebufferSize();e.context.viewport(0,0,p[0],p[1]);const l=e.framebuffer.getColorTexture();l.activate(),e.copyShader.setUniformi("texture",l.getTextureUnit()),e.copyShader.setUniform2f("tfactor",e.fvp[0],e.fvp[1]);const f=e.context;f.blendFuncSeparate(f.ONE,f.ONE_MINUS_SRC_ALPHA,f.ONE,f.ONE_MINUS_SRC_ALPHA),e.context.drawArrays(e.context.TRIANGLES,0,e.tris.getCABO().getElementCount()),l.deactivate(),f.blendFuncSeparate(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA,f.ONE,f.ONE_MINUS_SRC_ALPHA)}},t.renderPiece=(c,u)=>{t.invokeEvent({type:"StartEvent"}),e.renderable.update();const p=e.renderable.getNumberOfInputPorts();e.currentValidInputs=[];for(let f=0;f<p;++f){const g=e.renderable.getInputData(f);g&&!g.isDeleted()&&e.currentValidInputs.push({imageData:g,inputIndex:f})}let l=0;if(e.currentValidInputs.length>0){const f=u.getProperties(),g=e.currentValidInputs[0],h=g.imageData.getPointData().getScalars(),d=f[g.inputIndex];d.getShade()&&e.renderable.getBlendMode()===Ir.COMPOSITE_BLEND&&c.getLights().forEach(x=>{x.getSwitch()>0&&l++});const v=e.currentValidInputs.length;e.numberOfComponents=v>1?v:h.getNumberOfComponents(),e.useIndependentComponents=d.getUseIndependentComponents(e.numberOfComponents)}l!==e.numberOfLights&&(e.numberOfLights=l,t.modified()),t.invokeEvent({type:"EndEvent"}),e.currentValidInputs.length!==0&&(t.renderPieceStart(c,u),t.renderPieceDraw(c,u),t.renderPieceFinish(c,u))},t.updateBufferObjects=(c,u)=>{t.getNeedToRebuildBufferObjects(c,u)&&t.buildBufferObjects(c,u)},t.getNeedToRebuildBufferObjects=(c,u)=>e.VBOBuildTime.getMTime()<t.getMTime()||e.VBOBuildTime.getMTime()<u.getMTime()||e.VBOBuildTime.getMTime()<u.getProperty(e.currentValidInputs[0].inputIndex)?.getMTime()||e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.currentValidInputs.some(({imageData:p})=>e.VBOBuildTime.getMTime()<p.getMTime())||e.scalarTextures.length!==e.currentValidInputs.length||!e.scalarTextures.every(p=>!!p?.getHandle())||!e.colorTexture?.getHandle()||!e.opacityTexture?.getHandle()||!e.labelOutlineThicknessTexture?.getHandle()||!e.jitterTexture?.getHandle(),t.buildBufferObjects=(c,u)=>{if(!e.jitterTexture.getHandle()){const D=new Float32Array(1024);for(let y=0;y<1024;++y)D[y]=Math.random();e.jitterTexture.setMinificationFilter(_.NEAREST),e.jitterTexture.setMagnificationFilter(_.NEAREST),e.jitterTexture.create2DFromRaw({width:32,height:32,numComps:1,dataType:se.FLOAT,data:D})}const p=u.getProperties(),l=p[e.currentValidInputs[0].inputIndex],f=e.numberOfComponents,g=e.useIndependentComponents,h=g?f:1,d=[];for(let D=0;D<h;++D)d.push(l.getScalarOpacity(D));const v=Qe(d,g,h),x=l.getScalarOpacity(),C=e._openGLRenderWindow.getGraphicsResourceForObject(x);if(!C?.oglObject?.getHandle()||C.hash!==v){const D=K.newInstance();D.setOpenGLRenderWindow(e._openGLRenderWindow);let y=e.renderable.getOpacityTextureWidth();y<=0&&(y=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const S=y*2*h,P=new Float32Array(S),M=new Float32Array(y);for(let b=0;b<h;++b){const L=l.getScalarOpacity(b),R=t.getCurrentSampleDistance(c)/l.getScalarOpacityUnitDistance(b),E=L.getRange();L.getTable(E[0],E[1],y,M,1);for(let k=0;k<y;++k)P[b*y*2+k]=1-(1-M[k])**R,P[b*y*2+k+y]=P[b*y*2+k]}if(D.resetFormatAndType(),D.setMinificationFilter(_.LINEAR),D.setMagnificationFilter(_.LINEAR),e.context.getExtension("OES_texture_float_linear"))D.create2DFromRaw({width:y,height:2*h,numComps:1,dataType:se.FLOAT,data:P});else{const b=new Uint8ClampedArray(S);for(let L=0;L<S;++L)b[L]=255*P[L];D.create2DFromRaw({width:y,height:2*h,numComps:1,dataType:se.UNSIGNED_CHAR,data:b})}x&&e._openGLRenderWindow.setGraphicsResourceForObject(x,D,v),e.opacityTexture=D}else e.opacityTexture=C.oglObject;i(e._openGLRenderWindow,e._opacityTextureCore,x),e._opacityTextureCore=x;const T=[];for(let D=0;D<h;++D)T.push(l.getRGBTransferFunction(D));const m=Qe(T,g,h),w=l.getRGBTransferFunction(),O=e._openGLRenderWindow.getGraphicsResourceForObject(w);if(!O?.oglObject?.getHandle()||O?.hash!==m){const D=K.newInstance();D.setOpenGLRenderWindow(e._openGLRenderWindow);let y=e.renderable.getColorTextureWidth();y<=0&&(y=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const S=y*2*h*3,P=new Uint8ClampedArray(S),M=new Float32Array(y*3);for(let b=0;b<h;++b){const L=l.getRGBTransferFunction(b),R=L.getRange();L.getTable(R[0],R[1],y,M,1);for(let E=0;E<y*3;++E)P[b*y*6+E]=255*M[E],P[b*y*6+E+y*3]=255*M[E]}D.resetFormatAndType(),D.setMinificationFilter(_.LINEAR),D.setMagnificationFilter(_.LINEAR),D.create2DFromRaw({width:y,height:2*h,numComps:3,dataType:se.UNSIGNED_CHAR,data:P}),e._openGLRenderWindow.setGraphicsResourceForObject(w,D,m),e.colorTexture=D}else e.colorTexture=O.oglObject;i(e._openGLRenderWindow,e._colorTextureCore,w),e._colorTextureCore=w,e.currentValidInputs.forEach(({imageData:D,inputIndex:y},S)=>{const P=p[y],M=D.getPointData().getScalars(),b=e._openGLRenderWindow.getGraphicsResourceForObject(M),L=Ln(D,M),R=!b?.oglObject?.getHandle()||b?.hash!==L,E=P.getUpdatedExtents(),k=!!E.length;if(R&&!k){const N=K.newInstance();N.setOpenGLRenderWindow(e._openGLRenderWindow);const $=D.getDimensions();N.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),N.resetFormatAndType(),N.create3DFilterableFromDataArray({width:$[0],height:$[1],depth:$[2],dataArray:M,preferSizeOverAccuracy:P.getPreferSizeOverAccuracy()}),e._openGLRenderWindow.setGraphicsResourceForObject(M,N,L),e.scalarTextures[S]=N}else e.scalarTextures[S]=b.oglObject;if(k){P.setUpdatedExtents([]);const N=D.getDimensions();e.scalarTextures[S].create3DFilterableFromDataArray({width:N[0],height:N[1],depth:N[2],dataArray:M,updatedExtents:E})}i(e._openGLRenderWindow,e._scalarTexturesCore[S],M),e._scalarTexturesCore[S]=M});const B=l.getLabelOutlineThickness(),U=e._openGLRenderWindow.getGraphicsResourceForObject(B),F=B.join("-");if(!U?.oglObject?.getHandle()||U?.hash!==F){const D=K.newInstance();D.setOpenGLRenderWindow(e._openGLRenderWindow);let y=e.renderable.getLabelOutlineTextureWidth();y<=0&&(y=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const S=1,P=y*S,M=new Uint8Array(P);for(let b=0;b<y;++b)M[b]=typeof B[b]<"u"?B[b]:B[0];D.resetFormatAndType(),D.setMinificationFilter(_.NEAREST),D.setMagnificationFilter(_.NEAREST),D.create2DFromRaw({width:y,height:S,numComps:1,dataType:se.UNSIGNED_CHAR,data:M}),B&&e._openGLRenderWindow.setGraphicsResourceForObject(B,D,F),e.labelOutlineThicknessTexture=D}else e.labelOutlineThicknessTexture=U.oglObject;if(i(e._openGLRenderWindow,e._labelOutlineThicknessTextureCore,B),e._labelOutlineThicknessTextureCore=B,!e.tris.getCABO().getElementCount()){const D=new Float32Array(12);for(let M=0;M<4;M++)D[M*3]=M%2*2-1,D[M*3+1]=M>1?1:-1,D[M*3+2]=-1;const y=new Uint16Array(8);y[0]=3,y[1]=0,y[2]=1,y[3]=3,y[4]=3,y[5]=0,y[6]=3,y[7]=2;const S=ce.newInstance({numberOfComponents:3,values:D});S.setName("points");const P=Je.newInstance({values:y});e.tris.getCABO().createVBO(P,"polys",bt.SURFACE,{points:S,cellOffset:0,forceFlatten:!0})}e.VBOBuildTime.modified()}}var Au={context:null,VBOBuildTime:null,scalarTextures:[],_scalarTexturesCore:[],opacityTexture:null,_opacityTextureCore:null,colorTexture:null,_colorTextureCore:null,labelOutlineThicknessTexture:null,_labelOutlineThicknessTextureCore:null,jitterTexture:null,tris:null,framebuffer:null,copyShader:null,copyVAO:null,lastXYF:1,targetXYF:1,zBufferTexture:null,lastZBufferTexture:null,fullViewportTime:1,idxToView:null,vecISToVCMatrix:null,modelToView:null,projectionToView:null,avgWindowArea:0,avgFrameTime:0};function _u(t,e,a={}){Object.assign(e,Au,a),ee.extend(t,e,a),$e.implementBuildShadersWithReplacements(t,e,a),e.VBOBuildTime={},de(e.VBOBuildTime,{mtime:0}),e.tris=Pe.newInstance(),e.jitterTexture=K.newInstance(),e.jitterTexture.setWrapS(gr.REPEAT),e.jitterTexture.setWrapT(gr.REPEAT),e.framebuffer=vr.newInstance(),ye(t,e,["context"]),Gu(t,e)}var Wu=X(_u,"vtkOpenGLVolumeMapper");fe("vtkVolumeMapper",Wu);var ke={MAX:0,MIN:1,AVERAGE:2},{vtkErrorMacro:rr}=I;function zu(t,e){e.classHierarchy.push("vtkOpenGLImageCPRMapper");function a(r){[e._scalars,e._colorTransferFunc,e._pwFunc].forEach(n=>r.unregisterGraphicsResourceUser(n,t))}t.buildPass=r=>{if(r){e.currentRenderPass=null,e.openGLImageSlice=t.getFirstAncestorOfType("vtkOpenGLImageSlice"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");const n=e._openGLRenderWindow;e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),n&&!n.isDeleted()&&n!==e._openGLRenderWindow&&a(n),e.context=e._openGLRenderWindow.getContext(),e.openGLCamera=e._openGLRenderer.getViewNodeFor(e._openGLRenderer.getRenderable().getActiveCamera(),e.openGLCamera),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow)}},t.opaquePass=(r,n)=>{r&&(e.currentRenderPass=n,t.render())},t.opaqueZBufferPass=r=>{r&&(e.haveSeenDepthRequest=!0,e.renderDepth=!0,t.render(),e.renderDepth=!1)},t.getCoincidentParameters=(r,n)=>e.renderable.getResolveCoincidentTopology()===Vt.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.render=()=>{const r=e.openGLImageSlice.getRenderable(),n=e._openGLRenderer.getRenderable();t.renderPiece(n,r)},t.renderPiece=(r,n)=>{t.invokeEvent({type:"StartEvent"}),e.renderable.update(),t.invokeEvent({type:"EndEvent"}),e.renderable.preRenderCheck()&&(e.currentImageDataInput=e.renderable.getInputData(0),e.currentCenterlineInput=e.renderable.getOrientedCenterline(),t.renderPieceStart(r,n),t.renderPieceDraw(r,n),t.renderPieceFinish(r,n))},t.renderPieceStart=(r,n)=>{t.updateBufferObjects(r,n)},t.renderPieceDraw=(r,n)=>{const s=e.context;e.volumeTexture.activate(),e.colorTexture.activate(),e.pwfTexture.activate(),e.tris.getCABO().getElementCount()&&(t.updateShaders(e.tris,r,n),s.drawArrays(s.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release()),e.volumeTexture.deactivate(),e.colorTexture.deactivate(),e.pwfTexture.deactivate()},t.renderPieceFinish=(r,n)=>{},t.updateBufferObjects=(r,n)=>{t.getNeedToRebuildBufferObjects(r,n)&&t.buildBufferObjects(r,n),n.getProperty().getInterpolationType()===qe.NEAREST?(e.volumeTexture.setMinificationFilter(_.NEAREST),e.volumeTexture.setMagnificationFilter(_.NEAREST),e.colorTexture.setMinificationFilter(_.NEAREST),e.colorTexture.setMagnificationFilter(_.NEAREST),e.pwfTexture.setMinificationFilter(_.NEAREST),e.pwfTexture.setMagnificationFilter(_.NEAREST)):(e.volumeTexture.setMinificationFilter(_.LINEAR),e.volumeTexture.setMagnificationFilter(_.LINEAR),e.colorTexture.setMinificationFilter(_.LINEAR),e.colorTexture.setMagnificationFilter(_.LINEAR),e.pwfTexture.setMinificationFilter(_.LINEAR),e.pwfTexture.setMagnificationFilter(_.LINEAR))},t.getNeedToRebuildBufferObjects=(r,n)=>{const s=e.VBOBuildTime.getMTime();return s<t.getMTime()||s<e.renderable.getMTime()||s<n.getMTime()||s<e.currentImageDataInput.getMTime()||s<e.currentCenterlineInput.getMTime()||!e.volumeTexture?.getHandle()},t.buildBufferObjects=(r,n)=>{const s=e.currentImageDataInput,i=e.currentCenterlineInput,o=n.getProperty(),c=s?.getPointData()?.getScalars();if(!c)return;const u=e._openGLRenderWindow.getGraphicsResourceForObject(c),p=Ln(s,c),l=!u?.oglObject?.getHandle()||u?.hash!==p,f=o.getUpdatedExtents(),g=!!f.length;if(l){e.volumeTexture=K.newInstance(),e.volumeTexture.setOpenGLRenderWindow(e._openGLRenderWindow);const y=s.getDimensions();e.volumeTexture.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),e.volumeTexture.resetFormatAndType(),e.volumeTexture.create3DFilterableFromDataArray({width:y[0],height:y[1],depth:y[2],dataArray:c,preferSizeOverAccuracy:e.renderable.getPreferSizeOverAccuracy()}),e._openGLRenderWindow.setGraphicsResourceForObject(c,e.volumeTexture,p),c!==e._scalars&&(e._openGLRenderWindow.registerGraphicsResourceUser(c,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._scalars,t)),e._scalars=c}else e.volumeTexture=u.oglObject;if(g){o.setUpdatedExtents([]);const y=s.getDimensions();e.volumeTexture.create3DFilterableFromDataArray({width:y[0],height:y[1],depth:y[2],dataArray:c,updatedExtents:f})}const h=c.getNumberOfComponents(),d=n.getProperty(),v=d.getIndependentComponents(),x=v?h:1,C=v?2*x:1,T=[];for(let y=0;y<x;++y)T.push(d.getRGBTransferFunction(y));const m=Qe(T,v,x),w=d.getRGBTransferFunction(),O=e._openGLRenderWindow.getGraphicsResourceForObject(w);if(!O?.oglObject?.getHandle()||O?.hash!==m){let y=e.renderable.getColorTextureWidth();y<=0&&(y=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const S=y*C*3,P=new Uint8ClampedArray(S);if(e.colorTexture=K.newInstance(),e.colorTexture.setOpenGLRenderWindow(e._openGLRenderWindow),w){const M=new Float32Array(y*3);for(let b=0;b<x;b++){const L=d.getRGBTransferFunction(b),R=L.getRange();if(L.getTable(R[0],R[1],y,M,1),v)for(let E=0;E<y*3;E++)P[b*y*6+E]=255*M[E],P[b*y*6+E+y*3]=255*M[E];else for(let E=0;E<y*3;E++)P[b*y*6+E]=255*M[E]}e.colorTexture.resetFormatAndType(),e.colorTexture.create2DFromRaw({width:y,height:C,numComps:3,dataType:se.UNSIGNED_CHAR,data:P})}else{for(let M=0;M<y*3;++M)P[M]=255*M/((y-1)*3),P[M+1]=255*M/((y-1)*3),P[M+2]=255*M/((y-1)*3);e.colorTexture.resetFormatAndType(),e.colorTexture.create2DFromRaw({width:y,height:1,numComps:3,dataType:se.UNSIGNED_CHAR,data:P})}w&&(e._openGLRenderWindow.setGraphicsResourceForObject(w,e.colorTexture,m),w!==e._colorTransferFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(w,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._colorTransferFunc,t)),e._colorTransferFunc=w)}else e.colorTexture=O.oglObject;const B=[];for(let y=0;y<x;++y)B.push(d.getPiecewiseFunction(y));const U=Qe(B,v,x),F=d.getPiecewiseFunction(),D=e._openGLRenderWindow.getGraphicsResourceForObject(F);if(!D?.oglObject?.getHandle()||D?.hash!==U){let y=e.renderable.getOpacityTextureWidth();y<=0&&(y=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));const S=y*C,P=new Uint8ClampedArray(S);if(e.pwfTexture=K.newInstance(),e.pwfTexture.setOpenGLRenderWindow(e._openGLRenderWindow),F){const M=new Float32Array(S),b=new Float32Array(y);for(let L=0;L<x;++L){const R=d.getPiecewiseFunction(L);if(R===null)M.fill(1);else{const E=R.getRange();if(R.getTable(E[0],E[1],y,b,1),v)for(let k=0;k<y;k++)M[L*y*2+k]=b[k],M[L*y*2+k+y]=b[k];else for(let k=0;k<y;k++)M[L*y*2+k]=b[k]}}e.pwfTexture.resetFormatAndType(),e.pwfTexture.create2DFromRaw({width:y,height:C,numComps:1,dataType:se.FLOAT,data:M})}else P.fill(255),e.pwfTexture.resetFormatAndType(),e.pwfTexture.create2DFromRaw({width:y,height:1,numComps:1,dataType:se.UNSIGNED_CHAR,data:P});F&&(e._openGLRenderWindow.setGraphicsResourceForObject(F,e.pwfTexture,U),F!==e._pwFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(F,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._pwFunc,t)),e._pwFunc=F)}else e.pwfTexture=D.oglObject;if(e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.VBOBuildTime.getMTime()<i.getMTime()){const y=i.getNumberOfPoints(),S=y<=1?0:y-1,P=i.getDistancesToFirstPoint(),M=e.renderable.getHeight(),b=4*S,L=new Float32Array(3*b),R=e.renderable.getWidth();for(let Y=0,A=0;Y<S;++Y)L.set([0,M-P[Y],0],A),A+=3,L.set([R,M-P[Y],0],A),A+=3,L.set([R,M-P[Y+1],0],A),A+=3,L.set([0,M-P[Y+1],0],A),A+=3;const E=ce.newInstance({numberOfComponents:3,values:L});E.setName("points");const k=new Uint16Array(5*S);for(let Y=0,A=0,re=0;Y<S;++Y)k.set([4,re+3,re+2,re+1,re],A),A+=5,re+=4;const N=Je.newInstance({values:k}),$=i.getPoints(),H=new Float32Array(3*b),z=new Array(3),J=new Array(3);for(let Y=0,A=0;Y<S;++Y)$.getPoint(Y,z),$.getPoint(Y+1,J),H.set(z,A),A+=3,H.set(z,A),A+=3,H.set(J,A),A+=3,H.set(J,A),A+=3;const j=ce.newInstance({numberOfComponents:3,values:H,name:"centerlinePosition"}),oe=new Float32Array(b);for(let Y=0,A=0;Y<S;++Y)oe.set([0,1,3,2],A),A+=4;const ve=[j,ce.newInstance({numberOfComponents:1,values:oe,name:"quadIndex"})];if(!e.renderable.getUseUniformOrientation()){const Y=e.renderable.getOrientedCenterline().getOrientations()??[],A=new Float32Array(4*b),re=new Float32Array(4*b);for(let et=0;et<S;++et){const Fr=Y[et],Mt=Y[et+1];for(let Me=0;Me<4;++Me){const $t=4*(Me+4*et);A.set(Fr,$t),re.set(Mt,$t)}}const Fe=ce.newInstance({numberOfComponents:4,values:A,name:"centerlineTopOrientation"}),Pr=ce.newInstance({numberOfComponents:4,values:re,name:"centerlineBotOrientation"});ve.push(Fe,Pr)}e.tris.getCABO().createVBO(N,"polys",bt.SURFACE,{points:E,customAttributes:ve,forceFlatten:!0}),e.VBOBuildTime.modified()}},t.getNeedToRebuildShaders=(r,n,s)=>{const i=e.volumeTexture.getComponents(),o=s.getProperty().getIndependentComponents(),c=!!e.renderable.getCenterPoint(),u=e.renderable.getUseUniformOrientation(),p=e.renderable.isProjectionEnabled()&&e.renderable.getProjectionMode();return r.getProgram()===0||e.lastUseCenterPoint!==c||e.lastUseUniformOrientation!==u||e.lastProjectionMode!==p||e.lastHaveSeenDepthRequest!==e.haveSeenDepthRequest||e.lastTextureComponents!==i||e.lastIndependentComponents!==o?(e.lastUseCenterPoint=c,e.lastUseUniformOrientation=u,e.lastProjectionMode=p,e.lastHaveSeenDepthRequest=e.haveSeenDepthRequest,e.lastTextureComponents=i,e.lastIndependentComponents=o,!0):!1},t.buildShaders=(r,n,s)=>{t.getShaderTemplate(r,n,s),t.replaceShaderValues(r,n,s)},t.replaceShaderValues=(r,n,s)=>{let i=r.Vertex,o=r.Fragment;const c=["vec3 applyQuaternionToVec(vec4 q, vec3 v) {","  float uvx = q.y * v.z - q.z * v.y;","  float uvy = q.z * v.x - q.x * v.z;","  float uvz = q.x * v.y - q.y * v.x;","  float uuvx = q.y * uvz - q.z * uvy;","  float uuvy = q.z * uvx - q.x * uvz;","  float uuvz = q.x * uvy - q.y * uvx;","  float w2 = q.w * 2.0;","  uvx *= w2;","  uvy *= w2;","  uvz *= w2;","  uuvx *= 2.0;","  uuvy *= 2.0;","  uuvz *= 2.0;","  return vec3(v.x + uvx + uuvx, v.y + uvy + uuvy, v.z + uvz + uuvz);","}"];i=V.substitute(i,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;"]).result,i=V.substitute(i,"//VTK::PositionVC::Impl",["  gl_Position = MCPCMatrix * vertexMC;"]).result;const u=["attribute vec3 centerlinePosition;","attribute float quadIndex;","uniform float width;","out vec2 quadOffsetVSOutput;","out vec3 centerlinePosVSOutput;"],p=e.renderable.isProjectionEnabled(),l=e.renderable.getUseUniformOrientation();l?(u.push("out vec3 samplingDirVSOutput;","uniform vec4 centerlineOrientation;","uniform vec3 tangentDirection;",...c),p&&u.push("out vec3 projectionDirVSOutput;","uniform vec3 bitangentDirection;")):u.push("out vec4 centerlineTopOrientationVSOutput;","out vec4 centerlineBotOrientationVSOutput;","attribute vec4 centerlineTopOrientation;","attribute vec4 centerlineBotOrientation;"),i=V.substitute(i,"//VTK::Color::Dec",u).result;const f=["quadOffsetVSOutput = vec2(width * (mod(quadIndex, 2.0) == 0.0 ? -0.5 : 0.5), quadIndex > 1.0 ? 0.0 : 1.0);","centerlinePosVSOutput = centerlinePosition;"];l?(f.push("samplingDirVSOutput = applyQuaternionToVec(centerlineOrientation, tangentDirection);"),p&&f.push("projectionDirVSOutput = applyQuaternionToVec(centerlineOrientation, bitangentDirection);")):f.push("centerlineTopOrientationVSOutput = centerlineTopOrientation;","centerlineBotOrientationVSOutput = centerlineBotOrientation;"),i=V.substitute(i,"//VTK::Color::Impl",f).result;const g=e.volumeTexture.getComponents(),h=s.getProperty().getIndependentComponents();let d=["uniform mat4 MCTCMatrix; // Model coordinates to texture coordinates","in vec2 quadOffsetVSOutput;","in vec3 centerlinePosVSOutput;","uniform highp sampler3D volumeTexture;","uniform sampler2D colorTexture1;","uniform sampler2D pwfTexture1;","uniform float opacity;","uniform vec4 backgroundColor;","uniform float cshift0;","uniform float cscale0;","uniform float pwfshift0;","uniform float pwfscale0;"];p&&d.push("uniform int projectionSlabNumberOfSamples;","uniform float projectionConstantOffset;","uniform float projectionStepLength;"),l?(d.push("in vec3 samplingDirVSOutput;"),p&&d.push("in vec3 projectionDirVSOutput;")):(d.push("uniform vec3 tangentDirection;","in vec4 centerlineTopOrientationVSOutput;","in vec4 centerlineBotOrientationVSOutput;",...c),p&&d.push("uniform vec3 bitangentDirection;"));const v=e.renderable.getCenterPoint();if(v&&d.push("uniform vec3 globalCenterPoint;"),h){for(let C=1;C<g;C++)d=d.concat([`uniform float cshift${C};`,`uniform float cscale${C};`,`uniform float pwfshift${C};`,`uniform float pwfscale${C};`]);switch(g){case 1:d=d.concat(["uniform float mix0;","#define height0 0.5"]);break;case 2:d=d.concat(["uniform float mix0;","uniform float mix1;","#define height0 0.25","#define height1 0.75"]);break;case 3:d=d.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","#define height0 0.17","#define height1 0.5","#define height2 0.83"]);break;case 4:d=d.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","uniform float mix3;","#define height0 0.125","#define height1 0.375","#define height2 0.625","#define height3 0.875"]);break;default:rr("Unsupported number of independent coordinates.")}}o=V.substitute(o,"//VTK::TCoord::Dec",d).result;let x=[];if(l?(x.push("vec3 samplingDirection = samplingDirVSOutput;"),p&&x.push("vec3 projectionDirection = projectionDirVSOutput;")):(x.push("vec4 q0 = centerlineBotOrientationVSOutput;","vec4 q1 = centerlineTopOrientationVSOutput;","float qCosAngle = dot(q0, q1);","vec4 interpolatedOrientation;","if (qCosAngle > 0.999 || qCosAngle < -0.999) {","  // Use LERP instead of SLERP when the two quaternions are close or opposite","  interpolatedOrientation = normalize(mix(q0, q1, quadOffsetVSOutput.y));","} else {","  float omega = acos(qCosAngle);","  interpolatedOrientation = normalize(sin((1.0 - quadOffsetVSOutput.y) * omega) * q0 + sin(quadOffsetVSOutput.y * omega) * q1);","}","vec3 samplingDirection = applyQuaternionToVec(interpolatedOrientation, tangentDirection);"),p&&x.push("vec3 projectionDirection = applyQuaternionToVec(interpolatedOrientation, bitangentDirection);")),v?x.push("float baseOffset = dot(samplingDirection, globalCenterPoint - centerlinePosVSOutput);","float horizontalOffset = quadOffsetVSOutput.x + baseOffset;"):x.push("float horizontalOffset = quadOffsetVSOutput.x;"),x.push("vec3 volumePosMC = centerlinePosVSOutput + horizontalOffset * samplingDirection;","vec3 volumePosTC = (MCTCMatrix * vec4(volumePosMC, 1.0)).xyz;","if (any(lessThan(volumePosTC, vec3(0.0))) || any(greaterThan(volumePosTC, vec3(1.0))))","{","  // set the background color and exit","  gl_FragData[0] = backgroundColor;","  return;","}"),p){const C=e.renderable.getProjectionMode();switch(C){case ke.MIN:x.push("const vec4 initialProjectionTextureValue = vec4(1.0);");break;case ke.MAX:case ke.AVERAGE:default:x.push("const vec4 initialProjectionTextureValue = vec4(0.0);");break}switch(x.push("vec3 projectionScaledDirection = (MCTCMatrix * vec4(projectionDirection, 0.0)).xyz;","vec3 projectionStep = projectionStepLength * projectionScaledDirection;","vec3 projectionStartPosition = volumePosTC + projectionConstantOffset * projectionScaledDirection;","vec4 tvalue = initialProjectionTextureValue;","for (int projectionSampleIdx = 0; projectionSampleIdx < projectionSlabNumberOfSamples; ++projectionSampleIdx) {","  vec3 projectionSamplePosition = projectionStartPosition + float(projectionSampleIdx) * projectionStep;","  vec4 sampledTextureValue = texture(volumeTexture, projectionSamplePosition);"),C){case ke.MAX:x.push("  tvalue = max(tvalue, sampledTextureValue);");break;case ke.MIN:x.push("  tvalue = min(tvalue, sampledTextureValue);");break;case ke.AVERAGE:default:x.push("  tvalue = tvalue + sampledTextureValue;");break}x.push("}"),C===ke.AVERAGE&&x.push("tvalue = tvalue / float(projectionSlabNumberOfSamples);")}else x.push("vec4 tvalue = texture(volumeTexture, volumePosTC);");if(h){const C=["r","g","b","a"];for(let T=0;T<g;++T)x=x.concat([`vec3 tcolor${T} = mix${T} * texture2D(colorTexture1, vec2(tvalue.${C[T]} * cscale${T} + cshift${T}, height${T})).rgb;`,`float compWeight${T} = mix${T} * texture2D(pwfTexture1, vec2(tvalue.${C[T]} * pwfscale${T} + pwfshift${T}, height${T})).r;`]);switch(g){case 1:x=x.concat(["gl_FragData[0] = vec4(tcolor0.rgb, compWeight0 * opacity);"]);break;case 2:x=x.concat(["float weightSum = compWeight0 + compWeight1;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum))), opacity);"]);break;case 3:x=x.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum))), opacity);"]);break;case 4:x=x.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2 + compWeight3;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum)) + (tcolor3.rgb * (compWeight3 / weightSum))), opacity);"]);break;default:rr("Unsupported number of independent coordinates.")}}else switch(g){case 1:x=x.concat(["// Dependent components","float intensity = tvalue.r;","vec3 tcolor = texture2D(colorTexture1, vec2(intensity * cscale0 + cshift0, 0.5)).rgb;","float scalarOpacity = texture2D(pwfTexture1, vec2(intensity * pwfscale0 + pwfshift0, 0.5)).r;","gl_FragData[0] = vec4(tcolor, scalarOpacity * opacity);"]);break;case 2:x=x.concat(["float intensity = tvalue.r*cscale0 + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(intensity, 0.5)).rgb, pwfscale0*tvalue.g + pwfshift0);"]);break;case 3:x=x.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, opacity);"]);break;default:x=x.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, tcolor.a);"])}o=V.substitute(o,"//VTK::TCoord::Impl",x).result,e.haveSeenDepthRequest&&(o=V.substitute(o,"//VTK::ZBuffer::Dec","uniform int depthRequest;").result,o=V.substitute(o,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float iz = floor(gl_FragCoord.z*65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result),r.Vertex=i,r.Fragment=o,t.replaceShaderClip(r,n,s),t.replaceShaderCoincidentOffset(r,n,s)},t.replaceShaderClip=(r,n,s)=>{let i=r.Vertex,o=r.Fragment;if(e.renderable.getNumberOfClippingPlanes()){let c=e.renderable.getNumberOfClippingPlanes();c>6&&(I.vtkErrorMacro("OpenGL has a limit of 6 clipping planes"),c=6),i=V.substitute(i,"//VTK::Clip::Dec",["uniform int numClipPlanes;","uniform vec4 clipPlanes[6];","varying float clipDistancesVSOutput[6];"]).result,i=V.substitute(i,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    clipDistancesVSOutput[planeNum] = dot(clipPlanes[planeNum], vertexMC);","    }"]).result,o=V.substitute(o,"//VTK::Clip::Dec",["uniform int numClipPlanes;","varying float clipDistancesVSOutput[6];"]).result,o=V.substitute(o,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    if (clipDistancesVSOutput[planeNum] < 0.0) discard;","    }"]).result}r.Vertex=i,r.Fragment=o},t.getShaderTemplate=(r,n,s)=>{r.Vertex=Dn,r.Fragment=zt,r.Geometry=""},t.setMapperShaderParameters=(r,n,s)=>{const i=r.getProgram(),o=r.getCABO();o.getElementCount()&&(e.VBOBuildTime.getMTime()>r.getAttributeUpdateTime().getMTime()||r.getShaderSourceTime().getMTime()>r.getAttributeUpdateTime().getMTime())&&(i.isAttributeUsed("vertexMC")&&(r.getVAO().addAttributeArray(i,o,"vertexMC",o.getVertexOffset(),o.getStride(),e.context.FLOAT,3,e.context.FALSE)||rr("Error setting vertexMC in shader VAO.")),r.getCABO().getCustomData().forEach(g=>{g&&i.isAttributeUsed(g.name)&&!r.getVAO().addAttributeArray(i,o,g.name,g.offset,o.getStride(),e.context.FLOAT,g.components,e.context.FALSE)&&rr(`Error setting ${g.name} in shader VAO.`)}),r.getAttributeUpdateTime().modified());const c=e.volumeTexture.getTextureUnit();if(i.setUniformi("volumeTexture",c),i.setUniformf("width",e.renderable.getWidth()),r.getProgram().setUniform4fv("backgroundColor",e.renderable.getBackgroundColor()),i.isUniformUsed("tangentDirection")){const g=e.renderable.getTangentDirection();r.getProgram().setUniform3fArray("tangentDirection",g)}if(i.isUniformUsed("bitangentDirection")){const g=e.renderable.getBitangentDirection();r.getProgram().setUniform3fArray("bitangentDirection",g)}if(i.isUniformUsed("centerlineOrientation")){const g=e.renderable.getUniformOrientation();r.getProgram().setUniform4fv("centerlineOrientation",g)}if(i.isUniformUsed("globalCenterPoint")){const g=e.renderable.getCenterPoint();i.setUniform3fArray("globalCenterPoint",g)}if(e.renderable.isProjectionEnabled()){const g=e.renderable.getProjectionSlabThickness(),h=e.renderable.getProjectionSlabNumberOfSamples();i.setUniformi("projectionSlabNumberOfSamples",h);const d=-.5*g;i.setUniformf("projectionConstantOffset",d);const v=g/(h-1);i.setUniformf("projectionStepLength",v)}const u=e.currentImageDataInput,p=u.getWorldToIndex(),l=Na(new Float32Array(16),fn([],u.getDimensions())),f=pn(l,l,p);if(i.setUniformMatrix("MCTCMatrix",f),e.haveSeenDepthRequest&&r.getProgram().setUniformi("depthRequest",e.renderDepth?1:0),e.renderable.getNumberOfClippingPlanes()){let g=e.renderable.getNumberOfClippingPlanes();g>6&&(I.vtkErrorMacro("OpenGL has a limit of 6 clipping planes"),g=6);const h=o.getCoordShiftAndScaleEnabled()?o.getInverseShiftAndScaleMatrix():null,d=h?Ce(e.imagematinv,s.getMatrix()):s.getMatrix();h&&(ne(d,d),q(d,d,h),ne(d,d)),ne(e.imagemat,e.currentImageDataInput.getIndexToWorld()),q(e.imagematinv,d,e.imagemat);const v=[];for(let x=0;x<g;x++){const C=[];e.renderable.getClippingPlaneInDataCoords(e.imagematinv,x,C);for(let T=0;T<4;T++)v.push(C[T])}i.setUniformi("numClipPlanes",g),i.setUniform4fv("clipPlanes",v)}if(i.isUniformUsed("coffset")){const g=t.getCoincidentParameters(n,s);i.setUniformf("coffset",g.offset),i.isUniformUsed("cfactor")&&i.setUniformf("cfactor",g.factor)}},t.setCameraShaderParameters=(r,n,s)=>{const i=e.openGLImageSlice.getKeyMatrices().mcwc,o=e.openGLCamera.getKeyMatrices(n).wcpc;if(q(e.imagemat,o,i),r.getCABO().getCoordShiftAndScaleEnabled()){const c=r.getCABO().getInverseShiftAndScaleMatrix();q(e.imagemat,e.imagemat,c)}r.getProgram().setUniformMatrix("MCPCMatrix",e.imagemat)},t.setPropertyShaderParameters=(r,n,s)=>{const i=r.getProgram(),o=s.getProperty(),c=o.getOpacity();i.setUniformf("opacity",c);const u=e.volumeTexture.getComponents(),p=o.getIndependentComponents();if(p)for(let h=0;h<u;++h)i.setUniformf(`mix${h}`,o.getComponentWeight(h));const l=e.volumeTexture.getVolumeInfo();for(let h=0;h<u;h++){let d=o.getColorWindow(),v=o.getColorLevel();const x=p?h:0,C=o.getRGBTransferFunction(x);if(C&&o.getUseLookupTableScalarRange()){const w=C.getRange();d=w[1]-w[0],v=.5*(w[1]+w[0])}const T=l.scale[h]/d,m=(l.offset[h]-v)/d+.5;i.setUniformf(`cshift${h}`,m),i.setUniformf(`cscale${h}`,T)}const f=e.colorTexture.getTextureUnit();i.setUniformi("colorTexture1",f);for(let h=0;h<u;h++){let d=1,v=0;const x=p?h:0,C=o.getPiecewiseFunction(x);if(C){const T=C.getRange(),m=T[1]-T[0],w=.5*(T[0]+T[1]);d=l.scale[h]/m,v=(l.offset[h]-w)/m+.5}i.setUniformf(`pwfshift${h}`,v),i.setUniformf(`pwfscale${h}`,d)}const g=e.pwfTexture.getTextureUnit();i.setUniformi("pwfTexture1",g)},t.updateShaders=(r,n,s)=>{if(t.getNeedToRebuildShaders(r,n,s)){const i={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(i,n,s);const o=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(i.Vertex,i.Fragment,i.Geometry);o!==r.getProgram()&&(r.setProgram(o),r.getVAO().releaseGraphicsResources()),r.getShaderSourceTime().modified()}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(r.getProgram());r.getVAO().bind(),t.setMapperShaderParameters(r,n,s),t.setCameraShaderParameters(r,n,s),t.setPropertyShaderParameters(r,n,s)},t.delete=I.chain(()=>{e._openGLRenderWindow&&a(e._openGLRenderWindow)},t.delete)}var $u={currentRenderPass:null,volumeTexture:null,colorTexture:null,pwfTexture:null,tris:null,lastHaveSeenDepthRequest:!1,haveSeenDepthRequest:!1,lastTextureComponents:0,lastIndependentComponents:0,imagemat:null,imagematinv:null};function Ku(t,e,a={}){Object.assign(e,$u,a),ee.extend(t,e,a),$e.implementReplaceShaderCoincidentOffset(t,e,a),I.algo(t,e,2,0),e.tris=Pe.newInstance(),e.volumeTexture=null,e.colorTexture=null,e.pwfTexture=null,e.imagemat=Z(new Float64Array(16)),e.imagematinv=Z(new Float64Array(16)),e.VBOBuildTime={},I.obj(e.VBOBuildTime,{mtime:0}),zu(t,e)}var Hu=I.newInstance(Ku,"vtkOpenGLImageCPRMapper");fe("vtkImageCPRMapper",Hu);var ut={NONE:0,LIC:1,COLOR:2,BOTH:3},Cn={UNIFORM:0,GAUSSIAN:1},ju={BLEND:0};function qu(t,e){e.classHierarchy.push("vtkSurfaceLICInterface")}var Yu={enableLIC:!1,nuberOfSteps:40,stepSize:.25,transformVectors:!0,normalizeVectors:!0,maskOnSurface:!1,maskThreshold:0,maskColor:[0,0,0],maskIntensity:0,enhancedLIC:!0,enhanceContrast:ut.NONE,lowLICContrastEnhancementFactor:0,highLICContrastEnhancementFactor:0,lowColorContrastEnhancementFactor:0,highColorContrastEnhancementFactor:0,antiAlias:0,colorMode:ju.BLEND,LICIntensity:1,mapModeBias:0,noiseTextureSize:200,noiseTextureType:Cn.GAUSSIAN,noiseGrainSize:8,noiseImpulseProbability:.1,noiseImpulseBackgroundValue:0,noiseGeneratorSeed:0,minNoiseValue:0,maxNoiseValue:1,numberOfNoiseLevels:2,shadersNeedBuilding:!0,reallocateTextures:!0,rebuildNoiseTexture:!1,viewPortScale:1};function Ti(t,e,a={}){Object.assign(e,Yu,a),I.obj(t,e),I.setGet(t,e,["enableLIC","numberOfSteps","stepSize","normalizeVectors","transformVectors","maskOnSurface","maskThreshold","maskColor","maskIntensity","enhancedLIC","enhanceContrast","lowLICContrastEnhancementFactor","highLICContrastEnhancementFactor","lowColorContrastEnhancementFactor","highColorContrastEnhancementFactor","antiAlias","colorMode","LICIntensity","mapModeBias","noiseTextureSize","noiseTextureType","noiseGrainSize","minNoiseValue","maxNoiseValue","numberOfNoiseLevels","noiseImpulseProbability","noiseImpulseBackgroundValue","noiseGeneratorSeed","viewPortScale","rebuildNoiseTexture"]),qu(t,e)}var Zu=I.newInstance(Ti,"vtkSurfaceLICInterface"),Si={newInstance:Zu,extend:Ti},yi=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtktextureObjectVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

attribute vec4 vertexDC;
attribute vec2 tcoordDC;
varying vec2 tcoordVC;

void main()
{
  tcoordVC = tcoordDC;
  gl_Position = vertexDC;
}
`,Xu=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_LIC0.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

/**
This shader initializes the convolution for the LIC computation.
*/

// the output of this shader
layout(location = 0) out vec4 LICOutput;
layout(location = 1) out vec4 SeedOutput;

uniform sampler2D texMaskVectors;
uniform sampler2D texNoise;
uniform sampler2D texLIC;

uniform int   uStepNo;         // in step 0 initialize lic and seeds, else just seeds
uniform int   uPassNo;         // in pass 1 hpf of pass 0 is convolved.
uniform float uMaskThreshold;  // if |V| < uMaskThreshold render transparent
uniform vec2  uNoiseBoundsPt1; // tc of upper right pt of noise texture

in vec2 tcoordVC;

// convert from vector coordinate space to noise coordinate space.
// the noise texture is tiled across the *whole* domain
vec2 VectorTCToNoiseTC(vec2 vectc)
{
  return vectc/uNoiseBoundsPt1;
}

// get the texture coordidnate to lookup noise value. this
// depends on the pass number.
vec2 getNoiseTC(vec2 vectc)
{
  // in pass 1 : convert from vector tc to noise tc
  // in pass 2 : use vector tc
  if (uPassNo == 0)
    {
    return VectorTCToNoiseTC(vectc);
    }
  else
    {
    return vectc;
    }
}

// look up noise value at the given location. The location
// is supplied in vector texture coordinates, hence the
// need to convert to noise texture coordinates.
float getNoise(vec2 vectc)
{
  return texture2D(texNoise, getNoiseTC(vectc)).r;
}

void main(void)
{
  vec2 vectc = tcoordVC.st;

  // lic => (convolution, mask, 0, step count)
  if (uStepNo == 0)
    {
    float maskCriteria = length(texture2D(texMaskVectors, vectc).xyz);
    float maskFlag;
    if (maskCriteria <= uMaskThreshold)
      {
      maskFlag = 1.0;
      }
    else
      {
      maskFlag = 0.0;
      }
    float noise = getNoise(vectc);
    LICOutput = vec4(noise, maskFlag, 0.0, 1.0);
    }
  else
    {
    LICOutput = texture2D(texLIC, vectc);
    }

  // initial seed
  SeedOutput = vec4(vectc, 0.0, 1.0);
}
`,Qu=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_fs1.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// the output of this shader
layout(location = 0) out vec4 LICOutput;
layout(location = 1) out vec4 SeedOutput;

uniform sampler2D  texVectors;
uniform sampler2D  texNoise;
uniform sampler2D  texLIC;
uniform sampler2D  texSeedPts;

uniform int   uPassNo;          // in pass 1 hpf of pass 0 is convolved.
uniform float uStepSize;        // step size in parametric space

uniform vec2  uNoiseBoundsPt1;  // tc of upper right pt of noise texture

in vec2 tcoordVC;

//VTK::LICVectorLookup::Impl

// We need to do this manually since CLAMP_TO_BORDER and and borderColor
// are very poorly supported in webgl
vec2 clampToBorder(vec2 uv){
  if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)
  {
    return vec2(0.0, 0.0);
  }
  return getVector(uv);
}

// convert from vector coordinate space to noise coordinate space.
// the noise texture is tiled across the whole domain
vec2 VectorTCToNoiseTC(vec2 vectc)
{
  return vectc/uNoiseBoundsPt1;
}

// get the texture coordidnate to lookup noise value.
// in pass 1 repeatedly tile the noise texture across
// the computational domain.
vec2 getNoiseTC(vec2 tc)
{
  if (uPassNo == 0)
    {
    return VectorTCToNoiseTC(tc);
    }
  else
    {
    return tc;
    }
}

// look up noise value at the given location. The location
// is supplied in vector texture coordinates, hence the need
// to convert to either noise or lic texture coordinates in
// pass 1 and 2 respectively.
float getNoise(vec2 vectc)
{
  return texture2D(texNoise, getNoiseTC(vectc)).r;
}

// fourth-order Runge-Kutta streamline integration
// no bounds checks are made, therefore it's essential
// to have the entire texture initialized to 0
// and set clamp to border and have border color 0
// an integer is set if the step was taken, keeping
// an accurate step count is necessary to prevent
// boundary artifacts. Don't count the step if
// all vector lookups are identically 0. This is
// a proxy for "stepped outside valid domain"
vec2 rk4(vec2 pt0, float dt, out bool count)
{
  count=true;
  float dtHalf = dt * 0.5;
  vec2 pt1;

  vec2 v0 = clampToBorder(pt0);
  pt1 = pt0 + v0 * dtHalf;

  vec2 v1 = clampToBorder(pt1);
  pt1 = pt0 + v1 * dtHalf;

  vec2 v2 = clampToBorder(pt1);
  pt1 = pt0 + v2 * dt;

  vec2 v3 = clampToBorder(pt1);
  vec2 vSum = v0 + v1 + v1 + v2 + v2 + v3;

  if (vSum == vec2(0.0, 0.0))
    {
      count = false;
    }

  pt1 = pt0 + (vSum) * (dt * (1.0/6.0));

 return pt1;
}

void main(void)
{
  vec2 lictc = tcoordVC.st;
  vec4 lic = texture2D(texLIC, lictc);
  vec2 pt0 = texture2D(texSeedPts, lictc).st;

  bool count;
  vec2 pt1 = rk4(pt0, uStepSize, count);

  if (count)
    {
    // accumulate lic step
    // (lic, mask, 0, step count)
    float noise = getNoise(pt1);
    LICOutput = vec4(lic.r + noise, lic.g, 0.0, lic.a + 1.0);
    SeedOutput = vec4(pt1, 0.0, 1.0);
    }
  else
    {
    // keep existing values
    LICOutput = lic;
    SeedOutput = vec4(pt0, 0.0, 1.0);
    }
}
`,Ju=` //VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_LICN.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// the output of this shader
layout(location = 0) out vec4 LICOutput;
layout(location = 1) out vec4 SeedOutput;

/**
This shader finalizes the convolution for the LIC computation
applying the normalization. eg. if box kernel is used the this
is the number of steps taken.
*/

uniform sampler2D texLIC;

in vec2 tcoordVC;

void main(void)
{
  vec4 conv = texture2D(texLIC, tcoordVC.st);
  conv.r = conv.r/conv.a;
  // lic => (convolution, mask, 0, 1)
  LICOutput = vec4(conv.rg , 0.0, 1.0);
  SeedOutput = vec4(0.0, 0.0, 0.0, 0.0);
}
`,el=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_CE.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// gray scale contrast enhance stage implemented via histogram stretching
// if the min and max are tweaked it can generate out-of-range values
// these will be clamped in 0 to 1

// the output of this shader
layout(location = 0) out vec4 LICOutput;
layout(location = 1) out vec4 SeedOutput;


uniform sampler2D texLIC;  // most recent lic pass
uniform float uMin;        // min gray scale color value
uniform float uMaxMinDiff; // max-min

in vec2 tcoordVC;

void main( void )
{
  vec4 lic = texture2D(texLIC, tcoordVC.st);
  if (lic.g!=0.0)
    {
    LICOutput = lic;
    }
  else
    {
    float CElic = clamp((lic.r - uMin)/uMaxMinDiff, 0.0, 1.0);
    LICOutput = vec4(CElic, lic.gb, 1.0);
    }
    SeedOutput = vec4(0.0, 0.0, 0.0, 0.0);
}
`,tl=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_fs2.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// high-pass filter stage employed by vtkLineIntegralConvolution2D
// between LIC pass 1 and LIC pass 2. filtered LIC pass 1, becomes
// noise for pass2.

// the output of this shader
layout(location = 0) out vec4 EEOutput;

uniform sampler2D texLIC; // most recent lic pass
uniform float     uDx;    // fragment size
uniform float     uDy;    // fragment size

in vec2 tcoordVC;

// kernel for simple laplace edge enhancement.
// p=Laplace(p)+p
float K[9] = float[9](
  -1.0, -1.0, -1.0,
  -1.0,  9.0, -1.0,
  -1.0, -1.0, -1.0
  );

// determine if the fragment was masked
bool Masked(float val) { return val != 0.0; }

void main(void)
{
  // tex coord neighbor offsets
  vec2 fragDx[9] = vec2[9](
    vec2(-uDx, uDy), vec2(0.0, uDy), vec2(uDx, uDy),
    vec2(-uDx, 0.0), vec2(0.0, 0.0), vec2(uDx, 0.0),
    vec2(-uDx,-uDy), vec2(0.0,-uDy), vec2(uDx,-uDy)
    );

  vec2 lictc = tcoordVC.st;

  // compute the convolution but don't use convovled values if
  // any masked fragments on the stencil. Fragments outside
  // the valid domain are masked during initialization, and
  // texture wrap parameters are clamp to border with border
  // color that contains masked flag
  float conv = 0.0;
  bool dontUse = false;
  for (int i=0; i<9; ++i)
    {
    vec2 tc = lictc + fragDx[i];
    vec4 lic = texture2D(texLIC, tc);
    dontUse = dontUse || Masked(lic.g);
    conv = conv + K[i] * lic.r;
    }

  if (dontUse)
    {
    EEOutput = vec4(texture2D(texLIC, lictc).rg, 0.0, 1.0);
    }
  else
    {
    conv = clamp(conv, 0.0, 1.0);
    EEOutput = vec4(conv,texture2D(texLIC, lictc).g, 0.0, 1.0);
    }

}
`,rl=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_AAH.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// Anti-alias stage in vtkLineIntegralConvolution2D
// horizontal pass of a Gaussian convolution

// the output of this shader
layout(location = 0) out vec4 LICOutput;
layout(location = 1) out vec4 SeedOutput;

uniform sampler2D texLIC; // input texture
uniform float     uDx;    // fragment size

in vec2 tcoordVC;

// factored 3x3 Gaussian kernel
// K^T*K = G
float K[3] = float[3](0.141421356, 0.707106781, 0.141421356);

// determine if the fragment was masked
bool Masked(float val){ return val != 0.0; }

void main(void)
{
// neighbor offsets
vec2 fragDx[3] = vec2[3](vec2(-uDx,0.0), vec2(0.0,0.0), vec2(uDx,0.0));

  vec2 lictc = tcoordVC.st;
  vec4 lic[3];
  bool dontUse = false;
  float conv = 0.0;
  for (int i=0; i<3; ++i)
    {
    vec2 tc = lictc + fragDx[i];
    lic[i] = texture2D(texLIC, tc);
    dontUse = dontUse || Masked(lic[i].g);
    conv = conv + K[i] * lic[i].r;
    }
  // output is (conv, mask, skip, 1)
  if (dontUse)
    {
    LICOutput = vec4(lic[1].rg, 1.0, 1.0);
    }
  else
    {
    LICOutput = vec4(conv, lic[1].gb, 1.0);
    }
  SeedOutput = vec4(0.0, 0.0, 0.0, 0.0);
}
`,nl=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_VT.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// move vector field to normalized image space
// pre-processing for vtkLineIntegralConvolution2D

// the output of this shader
//VTK::Output::Dec

// Fragment shader used by the gaussian blur filter render pass.

uniform sampler2D texVectors; // input texture
uniform vec2      uTexSize;   // size of texture

in vec2 tcoordVC;

void main(void)
{
  //VTK::LICComponentSelection::Impl
  V = V/uTexSize;
  gl_FragData[0] = vec4(V, 0.0, 1.0);
}
`,al=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkLineIntegralConvolution2D_AAV.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// Anti-alias stage in vtkLineIntegralConvolution2D
// vertical pass of a Gaussian convolution

// the output of this shader
layout(location = 0) out vec4 LICOutput;
layout(location = 1) out vec4 SeedOutput;

uniform sampler2D texLIC; // input texture
uniform float     uDy;    // fragment size

in vec2 tcoordVC;


// factored 3x3 Gaussian kernel
// K^T*K = G
float K[3] = float[3](0.141421356, 0.707106781, 0.141421356);

// determine if the fragment was masked
bool Masked(float val){ return val != 0.0; }

void main(void)
{
// neighbor offsets
vec2 fragDy[3] = vec2[3](vec2(0.0,-uDy), vec2(0.0,0.0), vec2(0.0,uDy));


  vec2 lictc = tcoordVC.st;
  vec4 lic[3];
  bool dontUse = false;
  float conv = 0.0;
  for (int i=0; i<3; ++i)
    {
    vec2 tc = lictc + fragDy[i];
    lic[i] = texture2D(texLIC, tc);
    dontUse = dontUse || Masked(lic[i].g);
    conv = conv + K[i] * lic[i].r;
    }
  // output is (conv, mask, skip, 1)
  if (dontUse)
    {
    LICOutput = vec4(lic[1].rg, 1.0, 1.0);
    }
  else
    {
    LICOutput = vec4(conv, lic[1].gb, 1.0);
    }
  SeedOutput = vec4(0.0, 0.0, 0.0, 0.0);
}
`,{Representation:il}=_t;function ol(t){const e=Pe.newInstance();e.setOpenGLRenderWindow(t);const a=new Float32Array(12);for(let c=0;c<4;c++)a[c*3]=c%2*2-1,a[c*3+1]=c>1?1:-1,a[c*3+2]=0;const r=new Float32Array([0,0,1,0,0,1,1,1]),n=new Uint16Array(8);n[0]=3,n[1]=0,n[2]=1,n[3]=3,n[4]=3,n[5]=0,n[6]=3,n[7]=2;const s=ce.newInstance({numberOfComponents:3,values:a});s.setName("points");const i=Je.newInstance({values:n}),o=ce.newInstance({numberOfComponents:2,values:r});return e.getCABO().createVBO(i,"polys",il.SURFACE,{points:s,cellOffset:0,tcoords:o,forceFlatten:!0}),e}function Un(t,[e,a],r,n){const s=t.getContext(),i=K.newInstance({autoParameters:!1,wrapS:n,wrapT:n,minificationFilter:r,magnificationFilter:r,generateMipmap:!1,openGLDataType:s.FLOAT,baseLevel:0,maxLevel:0});return i.setOpenGLRenderWindow(t),i.setInternalFormat(s.RGBA32F),i.create2DFromRaw({width:e,height:a,numComps:4,dataType:"Float32Array",data:null}),i.activate(),i.sendParameters(),i.deactivate(),i}function nr(t,e){return Un(t,e,K.Filter.NEAREST,K.Wrap.CLAMP_TO_EDGE)}function sl(t,e){return Un(t,e,K.Filter.NEAREST,K.Wrap.CLAMP_TO_EDGE)}function cl(t,e){return Un(t,e,K.Filter.LINEAR,K.Wrap.CLAMP_TO_EDGE)}function ul(t,e){if(e.classHierarchy.push("vtkLICPingPongBufferManager"),!e._openGLRenderWindow){console.error("Pass renderwindow to ping pong manager");return}e.quad=ol(e._openGLRenderWindow),e.context=e._openGLRenderWindow.getContext(),e.licTexture0=nr(e._openGLRenderWindow,e.size),e.seedTexture0=nr(e._openGLRenderWindow,e.size),e.licTexture1=nr(e._openGLRenderWindow,e.size),e.seedTexture1=nr(e._openGLRenderWindow,e.size),e.eeTexture=e.doEEPass?sl(e._openGLRenderWindow,e.size):null,e.imageVectorTexture=e.doVTPass?cl(e._openGLRenderWindow,e.size):null,e.pingTextures[0]=e.licTexture0,e.pingTextures[1]=e.seedTexture0,e.pongTextures[0]=e.licTexture1,e.pongTextures[1]=e.seedTexture1,e.textures[0]=e.pingTextures,e.textures[1]=e.pongTextures,t.swap=()=>{e.readIndex=1-e.readIndex},t.renderQuad=(a,r)=>{const n=e.quad,s=e.context;let i=e.quadVAO;i||(i=mn.newInstance(),i.setOpenGLRenderWindow(e._openGLRenderWindow),e.quadVAO=i),e.previousProgramHash!==r.getMd5Hash()&&(i.shaderProgramChanged(),n.getCABO().bind(),i.addAttributeArray(r,n.getCABO(),"vertexDC",n.getCABO().getVertexOffset(),n.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE),i.addAttributeArray(r,n.getCABO(),"tcoordDC",n.getCABO().getTCoordOffset(),n.getCABO().getStride(),e.context.FLOAT,2,e.context.FALSE),e.previousProgramHash=r.getMd5Hash()),s.drawArrays(s.TRIANGLES,0,n.getCABO().getElementCount()),i.release()},t.getLastLICBuffer=()=>e.readIndex===0?e.licTexture0:e.licTexture1,t.getLastSeedBuffer=()=>e.readIndex===0?e.seedTexture0:e.seedTexture1,t.getLICBuffer=()=>1-e.readIndex===0?e.licTexture0:e.licTexture1,t.getSeedBuffer=()=>1-e.readIndex===0?e.seedTexture0:e.seedTexture1,t.getLICTextureUnit=()=>{const a=e.textures[e.readIndex][0];return a.activate(),a.getTextureUnit()},t.getSeedTextureUnit=()=>{const a=e.textures[e.readIndex][1];return a.activate(),a.getTextureUnit()},t.getNoiseTextureUnit=(a=0)=>a===0?(e.noiseTexture.activate(),e.noiseTexture.getTextureUnit()):(e.eeTexture.activate(),e.eeTexture.getTextureUnit()),t.getVectorTextureUnit=()=>(e.vectorTexture.activate(),e.vectorTexture.getTextureUnit()),t.getImageVectorTextureUnit=()=>e.imageVectorTexture?(e.imageVectorTexture.activate(),e.imageVectorTexture.getTextureUnit()):t.getVectorTextureUnit(),t.getMaskVectorTextureUnit=()=>e.maskVectorTexture?(e.maskVectorTexture.activate(),e.maskVectorTexture.getTextureUnit()):t.getImageVectorTextureUnit(),t.clearBuffers=(a=!1)=>{const r=e.framebuffer,n=e.context;r.removeColorBuffer(0),r.removeColorBuffer(1),r.removeColorBuffer(2),r.removeColorBuffer(3),r.setColorBuffer(e.licTexture0,0),r.setColorBuffer(e.seedTexture0,1),r.setColorBuffer(e.licTexture1,2),r.setColorBuffer(e.seedTexture1,3);const s=[n.COLOR_ATTACHMENT0,n.COLOR_ATTACHMENT1,n.COLOR_ATTACHMENT2,n.COLOR_ATTACHMENT3];a&&(r.removeColorBuffer(4),r.setColorBuffer(e.eeTexture,4),s.push(n.COLOR_ATTACHMENT4)),n.drawBuffers(s),n.clearColor(0,1,0,0),n.disable(n.SCISSOR_TEST),n.disable(n.BLEND),n.clear(n.COLOR_BUFFER_BIT),r.removeColorBuffer(0),r.removeColorBuffer(1),r.removeColorBuffer(2),r.removeColorBuffer(3),a&&r.removeColorBuffer(4),n.drawBuffers([n.NONE])},t.clearBuffer=a=>{const r=e.framebuffer,n=e.context;r.removeColorBuffer(0),r.setColorBuffer(a,0),n.drawBuffers([n.COLOR_ATTACHMENT0]),n.clearColor(0,1,0,0),n.disable(n.SCISSOR_TEST),n.disable(n.BLEND),n.clear(n.COLOR_BUFFER_BIT),r.removeColorBuffer(a,0),n.drawBuffers([n.NONE])},t.activateVectorTextures=()=>{e.imageVectorTexture?e.imageVectorTexture.activate():e.vectorTexture.activate(),e.maskVectorTexture&&e.maskVectorTexture.activate()},t.deactivateVectorTextures=()=>{e.imageVectorTexture?e.imageVectorTexture.deactivate():e.vectorTexture.deactivate(),e.maskVectorTexture&&e.maskVectorTexture.deactivate()},t.activateNoiseTexture=(a=0)=>{switch(a){case 0:e.noiseTexture.activate();break;case 1:e.eeTexture.activate();break;default:console.error("Wrong LIC pass number")}},t.deactivateNoiseTexture=(a=0)=>{switch(a){case 0:e.noiseTexture.deactivate();break;case 1:e.eeTexture.deactivate();break;default:console.error("Wrong LIC pass number")}},t.attachLICBuffers=()=>{const a=e.textures[e.readIndex],r=e.textures[1-e.readIndex],n=e.framebuffer,s=e.context;a[0].activate(),a[1].activate(),n.removeColorBuffer(0),n.removeColorBuffer(1),n.setColorBuffer(r[0],0),n.setColorBuffer(r[1],1),s.drawBuffers([s.COLOR_ATTACHMENT0,s.COLOR_ATTACHMENT1])},t.detachLICBuffers=()=>{const a=e.textures[e.readIndex],r=e.context,n=e.framebuffer;a[0].deactivate(),a[1].deactivate(),n.removeColorBuffer(0),n.removeColorBuffer(1),r.drawBuffers([r.NONE])},t.attachImageVectorBuffer=()=>{const a=e.framebuffer,r=e.context;e.vectorTexture.activate(),a.removeColorBuffer(0),a.setColorBuffer(e.imageVectorTexture,0),r.drawBuffers([r.COLOR_ATTACHMENT0])},t.detachImageVectorBuffer=()=>{const a=e.context,r=e.framebuffer;e.vectorTexture.deactivate(),r.removeColorBuffer(0),a.drawBuffers([a.NONE])},t.attachEEBuffer=()=>{e.textures[e.readIndex][0].activate(),e.framebuffer.removeColorBuffer(0),e.framebuffer.setColorBuffer(e.eeTexture,0);const a=e.context;a.drawBuffers([a.COLOR_ATTACHMENT0])},t.detachEEBuffer=()=>{const a=e.context;e.framebuffer.removeColorBuffer(0),a.drawBuffers([a.NONE]),e.textures[e.readIndex][0].deactivate()},t.detachBuffers=()=>{const a=e.context,r=e.framebuffer;r.removeColorBuffer(0),r.removeColorBuffer(1),a.drawBuffers([a.NONE]);const n=e.textures[e.readIndex],s=e.textures[1-e.readIndex];n[0]&&n[0].deactivate(),n[1]&&n[1].deactivate(),s[0]&&s[0].deactivate(),s[1]&&s[1].deactivate(),e.eeTexture&&e.eeTexture.deactivate(),e.noiseTexture&&e.noiseTexture.deactivate()},t.getWriteIndex=()=>1-e.readIndex,t.detachBuffers()}var ll={vectorTexture:null,maskVectorTexture:null,noiseTexture:null,doEEPass:!1,doVTPass:!1,readIndex:0,quad:null,lastProgramHash:null,framebuffer:null,size:null,pingTextures:[],pongTextures:[],textures:[]};function Oi(t,e,a={}){Object.assign(e,ll,a),I.obj(t,e),I.get(t,e,["readIndex"]),I.setGet(t,e,["doEEPass","doVTPass","_openGLRenderWindow","vectorTexture","maskVectorTexture","noiseTexture","framebuffer","size"]),I.moveToProtected(t,e,["openGLRenderWindow"]),ul(t,e)}var fl=I.newInstance(Oi,"vtkLICPingPongBufferManager"),pl={newInstance:fl,extend:Oi};function gl(t=!0){const e=`
    vec2 getVector( vec2 vectc )

      {

      vec2 V = texture2D( texVectors, vectc ).xy;

      // normalize if |V| not 0

      float lenV = length( V );

      if ( lenV > 1.0e-8 )

        {

        return V/lenV;

        }

      else

        {

        return vec2( 0.0, 0.0 );

        }

      }

    `,a=`
    vec2 getVector( vec2 vectc )

      {

      return texture2D( texVectors, vectc ).xy;

      }

    `;return t?e:a}function dl(t,e){e.classHierarchy.push("vtkLineIntegralConvolution2D"),t.buildAShader=n=>e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(yi,n,""),t.dumpTextureValues=(n,[s,i],o=e.context,c=e._openGLRenderWindow,u=4)=>{const p=vr.newInstance(),l=o;let f=null;return p.setOpenGLRenderWindow(c),p.saveCurrentBindingsAndBuffers(),p.create(s,i),p.populateFramebuffer(),p.setColorBuffer(n),f=new Float32Array(s*i*u),l.readPixels(0,0,s,i,u===4?l.RGBA:l.RGB,l.FLOAT,f),p.restorePreviousBindingsAndBuffers(),f},t.getTextureMinMax=(n,s,i=e.context,o=e._openGLRenderWindow)=>{const c=t.dumpTextureValues(n,s,i,o,4);let u=Number.MAX_VALUE,p=Number.MIN_VALUE;for(let l=0;l<c.length;l+=4)if(c[l+1]===0){const f=c[l];f<u&&(u=f),f>p&&(p=f)}return{min:u,max:p}},t.getComponentSelectionProgram=n=>{const s="xyzw";return`.${s[n[0]]}${s[n[1]]}`},t.buildShaders=()=>{e.LIC0ShaderProgram=t.buildAShader(Xu);const n=V.substitute(nl,"//VTK::LICComponentSelection::Impl",`vec2 V = texture2D(texVectors, tcoordVC.st)${t.getComponentSelectionProgram(e.componentIds)};`).result;e.VTProgram=t.buildAShader(n);const s=V.substitute(Qu,"//VTK::LICVectorLookup::Impl",gl(e.normalizeVectors),!0).result;e.LICIShaderProgram=t.buildAShader(s),e.LICNShaderProgram=t.buildAShader(Ju),e.CEProgram=t.buildAShader(el),e.EEProgram=t.buildAShader(tl),e.AAHProgram=t.buildAShader(rl),e.AAVProgram=t.buildAShader(al)};function a(n,s){n.setUniformi("texLIC",s.getLICTextureUnit()),n.setUniformi("texSeedPts",s.getSeedTextureUnit())}function r(n,s,i){n.attachLICBuffers(),n.renderQuad(s,i),n.detachLICBuffers(),n.swap()}t.executeLIC=(n,s,i,o,c,u)=>{if(e._openGLRenderWindow=c,e.context=c.getContext(),Object.assign(e,u),n[0]<=0||n[1]<=0)return null;const p=[1/n[0],1/n[1]];let l=e.stepSize*Math.sqrt(p[0]*p[0]+p[1]*p[1]);l<=0&&(l=1e-10);const f=e.context;let g=e.framebuffer;const h=g?.getSize();(!g||!h||n[0]!==h||n[1]!==h)&&(g=vr.newInstance(),g.setOpenGLRenderWindow(e._openGLRenderWindow),g.saveCurrentBindingsAndBuffers(),g.create(...n),g.populateFramebuffer(),g.restorePreviousBindingsAndBuffers(),e.framebuffer=g),g.saveCurrentBindingsAndBuffers(),g.bind(),f.viewport(0,0,...n),f.scissor(0,0,...n),e.shadersNeedBuild&&(t.buildShaders(),e.shadersNeedBuild=!1),e.bufs?(e.bufs.setVectorTexture(s),e.bufs.setMaskVectorTexture(i),e.bufs.setNoiseTexture(o)):e.bufs=pl.newInstance({openGLRenderWindow:c,doEEPass:e.enhancedLIC,doVTPass:e.transformVectors,vectorTexture:s,maskVectorTexture:i,noiseTexture:o,framebuffer:g,size:n});const d=[(o.getWidth()+1)/n[0],(o.getHeight()+1)/n[1]],v=1/n[0],x=1/n[1],C=e._openGLRenderWindow.getShaderCache();if(e.transformVectors){const O=e.VTProgram;C.readyShaderProgram(O),e.bufs.attachImageVectorBuffer(),O.setUniform2f("uTexSize",...n),O.setUniformi("texVectors",e.bufs.getVectorTextureUnit()),f.clearColor(0,0,0,0),f.clear(f.COLOR_BUFFER_BIT),e.bufs.renderQuad(n,O),e.bufs.detachImageVectorBuffer()}e.bufs.clearBuffers(e.enhancedLIC),e.bufs.activateVectorTextures(),e.bufs.activateNoiseTexture(0);const{LIC0ShaderProgram:T}=e;C.readyShaderProgram(T),T.setUniformi("uStepNo",0),T.setUniformi("uPassNo",0),T.setUniformf("uMaskThreshold",e.maskThreshold),T.setUniform2f("uNoiseBoundsPt1",...d),T.setUniformi("texMaskVectors",e.bufs.getMaskVectorTextureUnit()),T.setUniformi("texLIC",e.bufs.getLICTextureUnit()),T.setUniformi("texNoise",e.bufs.getNoiseTextureUnit(0)),r(e.bufs,n,T);const{LICIShaderProgram:m}=e;C.readyShaderProgram(m),m.setUniformi("uPassNo",0),m.setUniformf("uStepSize",-l),m.setUniform2f("uNoiseBoundsPt1",...d),m.setUniformi("texVectors",e.bufs.getImageVectorTextureUnit()),m.setUniformi("texNoise",e.bufs.getNoiseTextureUnit(0));for(let O=0;O<e.numberOfSteps;++O)a(m,e.bufs),r(e.bufs,n,m);C.readyShaderProgram(T),T.setUniformi("uStepNo",1),a(T,e.bufs),r(e.bufs,n,T),C.readyShaderProgram(m),m.setUniformf("uStepSize",l);for(let O=0;O<e.numberOfSteps;++O)a(m,e.bufs),r(e.bufs,n,m);e.bufs.deactivateNoiseTexture(0),e.bufs.deactivateVectorTextures();const{LICNShaderProgram:w}=e;if(C.readyShaderProgram(w),w.setUniformi("texLIC",e.bufs.getLICTextureUnit()),r(e.bufs,n,w),e.enhancedLIC){(e.enhanceContrast===ut.LIC||e.enhanceContrast===ut.BOTH)&&t.contrastEnhance(!1,n),e.bufs.attachEEBuffer();const{EEProgram:O}=e;C.readyShaderProgram(O),O.setUniformi("texLIC",e.bufs.getLICTextureUnit()),O.setUniformf("uDx",v),O.setUniformf("uDy",x),e.bufs.renderQuad(n,O),e.bufs.detachEEBuffer(),e.bufs.detachBuffers(),e.bufs.clearBuffers(!1),e.bufs.activateVectorTextures(),e.bufs.activateNoiseTexture(1),C.readyShaderProgram(T),T.setUniformi("uStepNo",0),T.setUniformi("uPassNo",1),a(T,e.bufs),T.setUniformi("texNoise",e.bufs.getNoiseTextureUnit(1)),r(e.bufs,n,T),C.readyShaderProgram(m),m.setUniformi("uPassNo",1),m.setUniformf("uStepSize",-l),m.setUniformi("texNoise",e.bufs.getNoiseTextureUnit(1));const B=e.numberOfSteps/2;for(let U=0;U<B;++U)a(m,e.bufs),r(e.bufs,n,m);C.readyShaderProgram(T),T.setUniformi("uStepNo",1),a(T,e.bufs),r(e.bufs,n,T),C.readyShaderProgram(m),m.setUniformf("uStepSize",l);for(let U=0;U<B;++U)a(m,e.bufs),r(e.bufs,n,m);e.bufs.deactivateNoiseTexture(1),e.bufs.deactivateVectorTextures(),C.readyShaderProgram(w),w.setUniformi("texLIC",e.bufs.getLICTextureUnit()),w.setUniformi("texSeedPts",e.bufs.getSeedTextureUnit()),r(e.bufs,n,w)}if(e.antiAlias){const O=e.AAHProgram;C.readyShaderProgram(O),O.setUniformi("texLIC",e.bufs.getLICTextureUnit()),O.setUniformf("uDx",v);const B=e.AAVProgram;C.readyShaderProgram(B),B.setUniformi("texLIC",e.bufs.getLICTextureUnit()),B.setUniformf("uDy",x);for(let U=0;U<e.antiAlias;++U)C.readyShaderProgram(O),a(O,e.bufs),r(e.bufs,n,O),C.readyShaderProgram(B),a(B,e.bufs),r(e.bufs,n,B)}return(e.enhanceContrast===ut.LIC||e.enhanceContrast===ut.BOTH)&&t.contrastEnhance(!0,n),e.bufs.detachBuffers(),g.restorePreviousBindingsAndBuffers(),e.bufs.getLastLICBuffer()},t.contrastEnhance=(n,s)=>{const i=e._openGLRenderWindow.getShaderCache();let{min:o,max:c}=t.getTextureMinMax(e.bufs.getLastLICBuffer(),s,e.context,e._openGLRenderWindow);(c<=o||c>1||o<0)&&(console.error("Invalid color range: ",o,c),o=0,c=1);let u=c-o;n&&(o+=u*e.lowLICContrastEnhancementFactor,c-=u*e.highLICContrastEnhancementFactor,u=c-o);const{CEProgram:p}=e;i.readyShaderProgram(p),p.setUniformi("texLIC",e.bufs.getLICTextureUnit()),p.setUniformf("uMin",o),p.setUniformf("uMaxMinDiff",u),r(e.bufs,s,p)}}var hl={shadersNeedBuild:!0,stepSize:1,numberOfSteps:10,enhancedLIC:!0,enhanceContrast:!1,lowContrastEnhancementFactor:0,highContrastEnhancementFactor:0,antiAlias:0,componentIds:[0,1],normalizeVectors:!0,maskThreshold:0,transformVectors:!0,bufs:null,isComposite:!0};function bi(t,e,a={}){Object.assign(e,hl,a),I.obj(t,e),I.setGet(t,e,["context","_openGLRenderWindow","nuberOfSteps","stepSize","normalizeVectors","maskThreshold","enhancedLIC","enhanceContrast","lowLICContrastEnhancementFactor","highLICContrastEnhancementFactor","antiAlias","componentIds","isComposite"]),I.moveToProtected(t,e,["openGLRenderWindow"]),dl(t,e)}var vl=I.newInstance(bi,"vtkLineIntegralConvolution2D"),xl={newInstance:vl,extend:bi},Cl=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkSurfaceLICMapper_fs2.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// This shader combines surface geometry, LIC, and  scalar colors.

// the output of this shader
layout(location = 0) out vec4 RGBOutput;
layout(location = 1) out vec4 HSLOutput;

uniform sampler2D texVectors;       // vectors, depth
uniform sampler2D texGeomColors;    // scalar colors + lighting
uniform sampler2D texLIC;           // image lic
uniform int       uScalarColorMode; // select between blend, and map shader
uniform float     uLICIntensity;    // blend shader: blending factor for lic'd colors
uniform float     uMapBias;         // map shader: adjust the brightness of the result
uniform float     uMaskIntensity;   // blending factor for mask color
uniform vec3      uMaskColor;       // color for the masked out fragments

in vec2 tcoordVC;

/**
Convert from RGB color space into HSL colorspace.
*/
vec3 RGBToHSL(vec3 RGB)
{
  vec3 HSL = vec3(0.0, 0.0, 0.0);

  float RGBMin = min(min(RGB.r, RGB.g), RGB.b);
  float RGBMax = max(max(RGB.r, RGB.g), RGB.b);
  float RGBMaxMinDiff = RGBMax - RGBMin;

  HSL.z = (RGBMax + RGBMin) / 2.0;

  if (RGBMaxMinDiff == 0.0)
    {
    // Gray scale
    HSL.x = 0.0;
    HSL.y = 0.0;
    }
  else
    {
    // Color
    if (HSL.z < 0.5)
      HSL.y = RGBMaxMinDiff / (RGBMax + RGBMin);
    else
      HSL.y = RGBMaxMinDiff / (2.0 - RGBMax - RGBMin);

    float dR
      = (((RGBMax - RGB.r) / 6.0) + (RGBMaxMinDiff / 2.0)) / RGBMaxMinDiff;
    float dG
      = (((RGBMax - RGB.g) / 6.0) + (RGBMaxMinDiff / 2.0)) / RGBMaxMinDiff;
    float dB
      = (((RGBMax - RGB.b) / 6.0) + (RGBMaxMinDiff / 2.0)) / RGBMaxMinDiff;

    if (RGB.r == RGBMax)
      HSL.x = dB - dG;
    else
    if (RGB.g == RGBMax)
      HSL.x = (1.0 / 3.0) + dR - dB;
    else
    if (RGB.b == RGBMax)
      HSL.x = (2.0 / 3.0) + dG - dR;

    if (HSL.x < 0.0)
      HSL.x += 1.0;

    if (HSL.x > 1.0)
      HSL.x -= 1.0;
    }

  return HSL;
}

/**
Helper for HSL to RGB conversion.
*/
float Util(float v1, float v2, float vH)
{
  if (vH < 0.0)
    vH += 1.0;

  if (vH > 1.0)
     vH -= 1.0;

  if ((6.0 * vH) < 1.0)
    return (v1 + (v2 - v1) * 6.0 * vH);

  if ((2.0 * vH) < 1.0)
    return (v2);

  if ((3.0 * vH) < 2.0)
    return (v1 + (v2 - v1) * ((2.0 / 3.0) - vH) * 6.0);

  return v1;
}

/**
Convert from HSL space into RGB space.
*/
vec3 HSLToRGB(vec3 HSL)
{
  vec3 RGB;
  if (HSL.y == 0.0)
    {
    // Gray
    RGB.r = HSL.z;
    RGB.g = HSL.z;
    RGB.b = HSL.z;
    }
  else
    {
    // Chromatic
    float v2;
    if (HSL.z < 0.5)
      v2 = HSL.z * (1.0 + HSL.y);
    else
      v2 = (HSL.z + HSL.y) - (HSL.y * HSL.z);

    float v1 = 2.0 * HSL.z - v2;

    RGB.r = Util(v1, v2, HSL.x + (1.0 / 3.0));
    RGB.g = Util(v1, v2, HSL.x);
    RGB.b = Util(v1, v2, HSL.x - (1.0 / 3.0));
    }

  return RGB.rgb;
}

void main()
{
  vec4 lic = texture2D(texLIC, tcoordVC.st);
  vec4 geomColor = texture2D(texGeomColors, tcoordVC.st);

  // depth is used to determine which fragment belong to us
  // and we can change
  float depth = texture2D(texVectors, tcoordVC.st).a;

  vec3 fragColorRGB;
  float valid;
  if (depth > 1.0e-3)
    {
    // we own it
    // shade LIC'ed geometry, or apply mask
    if (lic.g!=0.0)
      {
      // it's masked
      // apply fragment mask
      fragColorRGB = uMaskIntensity * uMaskColor + (1.0 - uMaskIntensity) * geomColor.rgb;
      valid = 0.0;
      }
    else
      {
      if (uScalarColorMode==0)
        {
        // blend with scalars
        fragColorRGB = lic.rrr * uLICIntensity + geomColor.rgb * (1.0 - uLICIntensity);
        }
      else
        {
        // multiply with scalars
        fragColorRGB = geomColor.rgb * clamp((uMapBias + lic.r), 0.0, 1.0);
        }
      if (lic.b != 0.0)
        {
        // didn't have the required guard pixels
        // don't consider it in min max estimation
        // for histpgram stretching
        valid = 0.0;
        }
      else
        {
        // ok to use in min/max estimates for histogram
        // stretching
        valid = 1.0;
        }
      }
    }
  else
    {
    // we don't own it
    // pass through scalars
    fragColorRGB = geomColor.rgb;
    valid = 0.0;
    }

  // if no further stages this texture is
  // copied to the screen
  RGBOutput = vec4(fragColorRGB, geomColor.a);

  // if further stages, move to hsl space for contrast
  // enhancement. encoding validity saves moving a texture to the cpu
  vec3 fragColorHSL = RGBToHSL(fragColorRGB);
  HSLOutput = vec4(fragColorHSL, valid);
}
`,ml=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkSurfaceLICMapper_DCpy.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// This shader copies fragments and depths to the output buffer

// the output of this shader
//VTK::Output::Dec

uniform sampler2D texDepth;     // z values from vertex shader
uniform sampler2D texRGBColors; // final rgb LIC colors

in vec2 tcoordVC;

void main()
{
  gl_FragDepth = texture2D(texDepth, tcoordVC).x;
  gl_FragData[0] = texture2D(texRGBColors, tcoordVC);

  // since we render a screen aligned quad
  // we're going to be writing fragments
  // not touched by the original geometry
  // it's critical not to modify those
  // fragments.
  if (gl_FragDepth == 1.0)
    {
    discard;
    }
}
`,Tl=`//VTK::System::Dec

//=========================================================================
//
//  Program:   Visualization Toolkit
//  Module:    vtkSurfaceLICMapper_CE.glsl
//
//  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
//  All rights reserved.
//  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.
//
//     This software is distributed WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
//     PURPOSE.  See the above copyright notice for more information.
//
//=========================================================================

// color contrast enhance stage implemented via histogram stretching
// on lightness channel. if the min and max are tweaked it can generate
// out-of-range values these will be clamped in 0 to 1

// the output of this shader
//VTK::Output::Dec

uniform sampler2D texGeomColors; // scalars + lighting
uniform sampler2D texLIC;        // image lic, mask
uniform sampler2D texHSLColors;  // hsla colors

uniform float     uLMin;         // min lightness over all fragments
uniform float     uLMaxMinDiff;  // max - min lightness over all fragments

in vec2 tcoordVC;

vec3 HSLToRGB(vec3 HSL)
{
  vec3 RGB;
  float v;
  float h = HSL.x;
  float sl = HSL.y;
  float l = HSL.z;

  v = (l <= 0.5) ? (l * (1.0 + sl)) : (l + sl - l * sl);
  if (v <= 0.0) {
    RGB = vec3(0.0,0.0,0.0);
  } else {
    float m;
    int sextant;
    float fract, vsf, mid1, mid2;

    m = l + l - v;
    h *= 6.0;
    sextant = int(h);
    fract = h - float(sextant);

    vsf = (v - m) * fract;
    mid1 = m + vsf;
    mid2 = v - vsf;
    switch (sextant) {
      case 0: RGB.r = v; RGB.g = mid1; RGB.b = m; break;
      case 1: RGB.r = mid2; RGB.g = v; RGB.b = m; break;
      case 2: RGB.r = m; RGB.g = v; RGB.b = mid1; break;
      case 3: RGB.r = m; RGB.g = mid2; RGB.b = v; break;
      case 4: RGB.r = mid1; RGB.g = m; RGB.b = v; break;
      case 5: RGB.r = v; RGB.g = m; RGB.b = mid2; break;
    }
  }
  return RGB;
}

void main()
{
  // lookup hsl color , mask
  vec4 fragColor = texture2D(texHSLColors, tcoordVC.st);

  // don't modify masked fragments (masked => lic.g==1)
  vec4 lic = texture2D(texLIC, tcoordVC.st);
  if (lic.g==0.0)
    {
    // normalize lightness channel
    fragColor.z = clamp((fragColor.z - uLMin)/uLMaxMinDiff, 0.0, 1.0);
    }

  // back into rgb space
  fragColor.rgb = HSLToRGB(fragColor.xyz);

  // add alpha
  vec4 geomColor = texture2D(texGeomColors, tcoordVC.st);
  fragColor.a = geomColor.a;

  gl_FragData[0] = fragColor;
}
`,{Representation:Sl}=_t;function yl(t){const e=Pe.newInstance();e.setOpenGLRenderWindow(t);const a=new Float32Array(12);for(let c=0;c<4;c++)a[c*3]=c%2*2-1,a[c*3+1]=c>1?1:-1,a[c*3+2]=0;const r=new Float32Array([0,0,1,0,0,1,1,1]),n=new Uint16Array(8);n[0]=3,n[1]=0,n[2]=1,n[3]=3,n[4]=3,n[5]=0,n[6]=3,n[7]=2;const s=ce.newInstance({numberOfComponents:3,values:a});s.setName("points");const i=Je.newInstance({values:n}),o=ce.newInstance({numberOfComponents:2,values:r});return e.getCABO().createVBO(i,"polys",Sl.SURFACE,{points:s,cellOffset:0,tcoords:o,forceFlatten:!0}),e}function Ol(t,e){e.classHierarchy.push("vtkOpenGLSurfaceLICInterface"),t.renderQuad=(n,s)=>{const i=e.licQuad,o=e.context;let c=e.licQuadVAO;c||(c=mn.newInstance(),c.setOpenGLRenderWindow(e._openGLRenderWindow),e.licQuadVAO=c),e.previousProgramHash!==s.getMd5Hash()&&(c.shaderProgramChanged(),i.getCABO().bind(),c.addAttributeArray(s,i.getCABO(),"vertexDC",i.getCABO().getVertexOffset(),i.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE),c.addAttributeArray(s,i.getCABO(),"tcoordDC",i.getCABO().getTCoordOffset(),i.getCABO().getStride(),e.context.FLOAT,2,e.context.FALSE),e.previousProgramHash=s.getMd5Hash()),o.drawArrays(o.TRIANGLES,0,i.getCABO().getElementCount()),c.release()};function a(n,s,i,o,c,u){const l=Math.max(0,Math.min(1,i)),f=Float32Array.from({length:n*n},()=>{let T=0;if(l===1||Math.random()>1-l)for(let m=0;m<2048;++m)T+=Math.random();return T});let g=0,h=2049;f.forEach(T=>{l===1?h=T<h?T:h:h=T<h&&T>0?T:h,g=T>g?T:g});let d=g-h;d===0&&(h=0,g===0?d=1:d=g);const v=s-1,x=v!==0?1/v:0,C=u-c;return f.map(T=>{const m=T<h?T:(T-h)/d,w=Math.floor(m*s),O=w>v?v:w;return T>=h?s===1?u:c+O*x*C:o})}function r([n,s],i,o,c){const u=c-o;return Float32Array.from({length:n*s},()=>{let p=Math.random();return p=Math.floor(p*i)/i,p=p*u+o,p>1?1:p<0?0:p})}t.generateNoiseTexture=n=>{if(!e.noiseTexture||e.licInterface.getRebuildNoiseTexture()){e.licInterface.setRebuildNoiseTexture(!1),e.noiseTexture&&e.noiseTexture.releaseGraphicsResources(),ro(e.noiseGeneratorSeed,{global:!0});let s=[];const{noiseTextureType:i,noiseGrainSize:o,numberOfNoiseLevels:c,noiseImpulseProbability:u,noiseImpulseBackgroundValue:p,minNoiseValue:l,maxNoiseValue:f}=e.licInterface.get("noiseTextureType","noiseGrainSize","numberOfNoiseLevels","noiseImpulseProbability","noiseImpulseBackgroundValue","minNoiseValue","maxNoiseValue");switch(i){case Cn.GAUSSIAN:s=a(Math.floor(n/o),c,u,p,l,f);break;case Cn.UNIFORM:default:s=r([Math.ceil(n/o),Math.ceil(n/o)],c,l,f)}const g=1/o,h=Float32Array.from({length:n*n*4},(v,x)=>{const C=x/4;if(x%4===0){const T=Math.floor(C%n*g),m=Math.floor(C/n*g);return s[m*(n/o)+T]}return x%4===1||x%4===3?1:0}),d=K.newInstance({wrapS:K.Wrap.REPEAT,wrapT:K.Wrap.REPEAT,minificationFilter:K.Filter.NEAREST,magnificationFilter:K.Filter.NEAREST,generateMipMap:!1,openGLDataType:e.context.FLOAT,baseLevel:0,maxLevel:0,autoParameters:!1});d.setOpenGLRenderWindow(e._openGLRenderWindow),d.create2DFromRaw({width:n,height:n,numComps:4,dataType:"Float32Array",data:h}),d.activate(),d.sendParameters(),d.deactivate(),e.noiseTexture=d}},t.buildAShader=n=>e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(yi,n,""),t.allocateTextures=()=>{const n=K.Filter.NEAREST,s=K.Filter.LINEAR,i=e._openGLRenderWindow;e.geometryImage||(e.geometryImage=t.allocateTexture(i,n)),e.vectorImage||(e.vectorImage=t.allocateTexture(i,s)),e.maskVectorImage||(e.maskVectorImage=t.allocateTexture(i,s)),e.LICImage||(e.LICImage=t.allocateTexture(i,n)),e.RGBColorImage||(e.RGBColorImage=t.allocateTexture(i,n)),e.HSLColorImage||(e.HSLColorImage=t.allocateTexture(i,n)),e.depthTexture||(e.depthTexture=t.allocateDepthTexture(i))},t.allocateTexture=(n,s)=>{const i=e.context,o=K.newInstance({wrapS:K.Wrap.CLAMP_TO_EDGE,wrapT:K.Wrap.CLAMP_TO_EDGE,minificationFilter:s,magnificationFilter:s,generateMipmap:!1,openGLDataType:i.FLOAT,baseLevel:0,maxLevel:0,autoParameters:!1});return o.setOpenGLRenderWindow(n),o.setInternalFormat(i.RGBA32F),o.create2DFromRaw({width:e.size[0],height:e.size[1],numComps:4,dataType:"Float32Array",data:null}),o.activate(),o.sendParameters(),o.deactivate(),o},t.allocateDepthTexture=n=>{const s=e.context,i=K.newInstance({generateMipmap:!1,openGLDataType:s.FLOAT,autoParameters:!1});return i.setOpenGLRenderWindow(n),i.createDepthFromRaw({width:e.size[0],height:e.size[1],dataType:"Float32Array",data:null}),i.activate(),i.sendParameters(),i.deactivate(),i},t.createFBO=()=>{if(!e.framebuffer){e.licHelper=null;const n=vr.newInstance();n.setOpenGLRenderWindow(e._openGLRenderWindow),n.saveCurrentBindingsAndBuffers(),n.create(...e.size),n.populateFramebuffer(),e.framebuffer=n,n.restorePreviousBindingsAndBuffers()}},t.completedGeometry=()=>{const n=e.context,s=e.framebuffer;s.removeColorBuffer(0),s.removeColorBuffer(1),s.removeColorBuffer(2),s.removeDepthBuffer(),n.drawBuffers([n.NONE]),s.restorePreviousBindingsAndBuffers()},t.buildAllShaders=()=>{e.shadersNeedBuilding&&(e.licColorPass=t.buildAShader(Cl),e.licCopyPass=t.buildAShader(ml),e.enhanceContrastPass=t.buildAShader(Tl),e.shadersNeedBuilding=!1)},t.initializeResources=()=>{t.createFBO(),t.generateNoiseTexture(e.licInterface.getNoiseTextureSize()),t.allocateTextures(),t.buildAllShaders(),e.licQuad||(e.licQuad=yl(e._openGLRenderWindow)),e.licHelper||(e.licHelper=xl.newInstance())},t.prepareForGeometry=()=>{const n=e.framebuffer;n.saveCurrentBindingsAndBuffers(),n.bind(),e.geometryImage.activate(),e.vectorImage.activate(),e.maskVectorImage.activate(),n.removeColorBuffer(0),n.removeColorBuffer(2),n.removeColorBuffer(3),n.setColorBuffer(e.geometryImage,0),n.setColorBuffer(e.vectorImage,2),n.setColorBuffer(e.maskVectorImage,3),n.setDepthBuffer(e.depthTexture);const s=e.context;s.drawBuffers([s.COLOR_ATTACHMENT0,s.NONE,s.COLOR_ATTACHMENT2,s.COLOR_ATTACHMENT3]),s.viewport(0,0,...e.size),s.scissor(0,0,...e.size),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.disable(s.SCISSOR_TEST),s.clearColor(0,0,0,0),s.clear(s.DEPTH_BUFFER_BIT|s.COLOR_BUFFER_BIT)},t.copyToScreen=n=>{e.RGBColorImage.activate(),e.depthTexture.activate(),e.licCopyPass||t.initializeResources();const s=e.licCopyPass;e._openGLRenderWindow.getShaderCache().readyShaderProgram(s);const i=e.context;i.viewport(0,0,...n),i.scissor(0,0,...n),i.disable(i.BLEND),i.enable(i.DEPTH_TEST),i.disable(i.SCISSOR_TEST),s.setUniformi("texDepth",e.depthTexture.getTextureUnit()),s.setUniformi("texRGBColors",e.RGBColorImage.getTextureUnit()),t.renderQuad(n,s),e.RGBColorImage.deactivate(),e.depthTexture.deactivate()},t.combineColorsAndLIC=()=>{const n=e.context,s=e.framebuffer;s.saveCurrentBindingsAndBuffers(),s.bind(),s.create(...e.size),s.removeColorBuffer(0),s.removeColorBuffer(1),s.setColorBuffer(e.RGBColorImage,0),s.setColorBuffer(e.HSLColorImage,1),n.drawBuffers([n.COLOR_ATTACHMENT0,n.COLOR_ATTACHMENT1]),n.disable(n.DEPTH_TEST),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),e.vectorImage.activate(),e.geometryImage.activate(),e.LICImage.activate(),e.licColorPass||t.initializeResources();const i=e.licColorPass;e._openGLRenderWindow.getShaderCache().readyShaderProgram(i),i.setUniformi("texVectors",e.vectorImage.getTextureUnit()),i.setUniformi("texGeomColors",e.geometryImage.getTextureUnit());const{colorMode:o,LICIntensity:c,mapModeBias:u,maskIntensity:p,maskColor:l,enhanceContrast:f,lowColorContrastEnhancementFactor:g,highColorContrastEnhancementFactor:h}=e.licInterface.get("colorMode","LICIntensity","mapModeBias","maskIntensity","maskColor","enhanceContrast","lowColorContrastEnhancementFactor","highColorContrastEnhancementFactor");if(i.setUniformi("texLIC",e.LICImage.getTextureUnit()),i.setUniformi("uScalarColorMode",o),i.setUniformf("uLICIntensity",c),i.setUniformf("uMapBias",u),i.setUniformf("uMaskIntensity",p),i.setUniform3f("uMaskColor",...l),t.renderQuad(e.size,i),e.vectorImage.deactivate(),e.geometryImage.deactivate(),e.LICImage.deactivate(),s.removeColorBuffer(0),s.removeColorBuffer(1),n.drawBuffers([n.NONE]),f===ut.COLOR||f===ut.BOTH){let d=0,v=1,x=v-d;d+=x*g,v-=x*h,x=v-d,s.setColorBuffer(e.RGBColorImage),n.drawBuffers([n.COLOR_ATTACHMENT0]),e.geometryImage.activate(),e.HSLColorImage.activate(),e.LICImage.activate(),e.enhanceContrastPass||t.initializeResources();const{enhanceContrastPass:C}=e;e._openGLRenderWindow.getShaderCache().readyShaderProgram(C),C.setUniformi("texGeomColors",e.geometryImage.getTextureUnit()),C.setUniformi("texHSLColors",e.HSLColorImage.getTextureUnit()),C.setUniformi("texLIC",e.LICImage.getTextureUnit()),C.setUniformf("uLMin",d),C.setUniformf("uLMaxMinDiff",x),t.renderQuad(e.size,C),e.geometryImage.deactivate(),e.HSLColorImage.deactivate(),e.LICImage.deactivate(),s.removeColorBuffer(0),n.drawBuffers([n.NONE])}s.restorePreviousBindingsAndBuffers()},t.applyLIC=()=>{const n=e.licInterface.get("stepSize","numberOfSteps","enhancedLIC","enhanceContrast","lowLICContrastEnhancementFactor","highLICContrastEnhancementFactor","antiAlias","normalizeVectors","maskThreshold","transformVectors"),s=e.licHelper.executeLIC(e.size,e.vectorImage,e.maskVectorImage,e.noiseTexture,e._openGLRenderWindow,n);if(!s){console.error("Failed to compute image LIC"),e.LICImage=null;return}e.LICImage=s},t.setSize=n=>{Array.isArray(n)&&n.length===2&&(!e.size||e.size[0]!==n[0]||e.size[1]!==n[1])&&(e.size=n,t.releaseGraphicsResources())},t.releaseGraphicsResources=()=>{e.geometryImage&&(e.geometryImage.releaseGraphicsResources(),e.geometryImage=null),e.vectorImage&&(e.vectorImage.releaseGraphicsResources(),e.vectorImage=null),e.maskVectorImage&&(e.maskVectorImage.releaseGraphicsResources(),e.maskVectorImage=null),e.LICImage&&(e.LICImage.releaseGraphicsResources(),e.LICImage=null),e.RGBColorImage&&(e.RGBColorImage.releaseGraphicsResources(),e.RGBColorImage=null),e.HSLColorImage&&(e.HSLColorImage.releaseGraphicsResources(),e.HSLColorImage=null),e.depthTexture&&(e.depthTexture.releaseGraphicsResources(),e.depthTexture=null),e.framebuffer&&(e.framebuffer.releaseGraphicsResources(),e.framebuffer=null)}}var bl={context:null,shadersNeedBuilding:!0,reallocateTextures:!0,size:null,licInterface:null};function Vi(t,e,a={}){Object.assign(e,bl,a),Si.extend(t,e,a),I.obj(t,e),I.setGet(t,e,["context","_openGLRenderWindow","reallocateTextures","licInterface","size"]),I.moveToProtected(t,e,["openGLRenderWindow"]),Ol(t,e)}var Vl=I.newInstance(Vi,"vtkSurfaceLICInterface"),wl={newInstance:Vl,extend:Vi},{vtkErrorMacro:Yr}=me;function Ml(t,e){e.classHierarchy.push("vtkOpenGLSurfaceLICMapper");const a={...t};t.getNeedToRebuildShaders=(r,n,s)=>e.rebuildLICShaders||a.getNeedToRebuildShaders(r,n,s),t.replaceShaderValues=(r,n,s)=>{const i=e.lastBoundBO.getReferenceByName("lastLightComplexity");let o=r.Vertex,c=r.Fragment;const u=e.renderable.getInputArrayToProcess(0);if(u&&e.canDrawLIC){c=V.substitute(c,"//VTK::Output::Dec",["//VTK::Output::Dec","layout(location = 2) out vec4 vectorTexture;","layout(location = 3) out vec4 maskVectorTexture;"]).result;const p=`${u.getName()}MC`;i===0&&e.lastBoundBO.set({lastLightComplexity:1},!0),o=V.substitute(o,"//VTK::TCoord::Dec",[`attribute vec3 ${p};`,"out vec3 licOutput;","//VTK::TCoord::Dec"]).result,o=V.substitute(o,"//VTK::TCoord::Impl",[`licOutput = ${p};`,"//VTK::TCoord::Impl"]).result,c=V.substitute(c,"//VTK::TCoord::Dec",["uniform int uMaskOnSurface;","uniform mat3 normalMatrix;","in vec3 licOutput;","//VTK::TCoord::Dec"]).result,c=V.substitute(c,"//VTK::TCoord::Impl",["// projected vectors","  vec3 tcoordLIC = normalMatrix * licOutput;","  vec3 normN = normalize(normalVCVSOutput);","  float k = dot(tcoordLIC, normN);","  vec3 projected = (tcoordLIC - k*normN);","  vectorTexture = vec4(projected.x, projected.y, 0.0 , 1.0);","// vectors for fragment masking","  if (uMaskOnSurface == 0)","    {","    maskVectorTexture = vec4(licOutput, 1.0);","    }","  else","    {","    maskVectorTexture = vec4(projected.x, projected.y, 0.0 , 1.0);","    }","//VTK::TCoord::Impl"],!1).result,r.Vertex=o}e.rebuildLICShaders=!1,r.Fragment=c,a.replaceShaderValues(r,n,s),i>0&&e.lastBoundBO.set({lastLightComplexity:i},!0)},t.setMapperShaderParameters=(r,n,s)=>{a.setMapperShaderParameters(r,n,s),e.canDrawLIC&&r.getProgram().setUniformi("uMaskOnSurface",e.maskOnSurface)},t.getNeedToRebuildBufferObjects=(r,n)=>e.rebuildLICBuffers||a.getNeedToRebuildBufferObjects(r,n),t.buildBufferObjects=(r,n)=>{if(e.canDrawLIC){const s=e.renderable.getInputArrayToProcess(0);s&&s.getNumberOfComponents()>1&&e.renderable.setCustomShaderAttributes([s.getName()])}e.rebuildLICBuffers=!1,a.buildBufferObjects(r,n)},t.pushState=r=>{e.stateCache={[r.BLEND]:r.isEnabled(r.BLEND),[r.DEPTH_TEST]:r.isEnabled(r.DEPTH_TEST),[r.SCISSOR_TEST]:r.isEnabled(r.SCISSOR_TEST),[r.CULL_FACE]:r.isEnabled(r.CULL_FACE)}},t.popState=r=>{const n=s=>e.stateCache[s]?r.enable(s):r.disable(s);n(r.BLEND),n(r.DEPTH_TEST),n(r.SCISSOR_TEST),e.stateCache[r.CULL_FACE]?e._openGLRenderWindow.enableCullFace():e._openGLRenderWindow.disableCullFace()},t.renderPiece=(r,n)=>{let s=!0;(!e.context.getExtension("EXT_color_buffer_float")||!e.context.getExtension("OES_texture_float_linear"))&&(Yr("SurfaceLICMapper requires the EXT_color_buffer_float and OES_texture_float_linear WebGL2 extensions."),s=!1),e.currentInput=e.renderable.getInputData(),e.currentInput||(Yr("No input"),s=!1);let i=e.renderable.getLicInterface();i||(i=Si.newInstance(),e.renderable.setLicInterface(i)),e.openGLLicInterface||(e.openGLLicInterface=wl.newInstance()),i!==e.openGLLicInterface.getLicInterface()&&e.openGLLicInterface.setLicInterface(i);const o=e.renderable.getInputArrayToProcess(0);if(i.getEnableLIC()&&(!o||o.getNumberOfComponents()<2)&&(Yr("No vector input array"),s=!1),i.getEnableLIC()||(s=!1),e.canDrawLIC!==s&&(e.rebuildLICShaders=!0,e.rebuildLICBuffers=!0),e.canDrawLIC=s,!s||!i.getEnableLIC()){a.renderPiece(r,n);return}const c=e.context,u=n.getProperty().getBackfaceCulling(),p=n.getProperty().getFrontfaceCulling();!u&&!p?e._openGLRenderWindow.disableCullFace():p?(e._openGLRenderWindow.enableCullFace(),e._openGLRenderWindow.setCullFaceMode(c.FRONT)):(e._openGLRenderWindow.enableCullFace(),e._openGLRenderWindow.setCullFaceMode(c.BACK));const l=e._openGLRenderWindow.getSize(),f=l.map(g=>Math.round(g*i.getViewPortScale()));e.openGLLicInterface.setSize(f),e.openGLLicInterface.setOpenGLRenderWindow(e._openGLRenderWindow),e.openGLLicInterface.setContext(e.context),t.pushState(e.context),e.openGLLicInterface.initializeResources(),e.openGLLicInterface.prepareForGeometry(),t.popState(e.context),a.renderPieceStart(r,n),a.renderPieceDraw(r,n),a.renderPieceFinish(r,n),t.pushState(e.context),e.VBOBuildTime.modified(),e.openGLLicInterface.completedGeometry(),e._openGLRenderWindow.disableCullFace(),e.openGLLicInterface.applyLIC(),e.openGLLicInterface.combineColorsAndLIC(),e.openGLLicInterface.copyToScreen(l),t.popState(e.context)}}var Bl={canDrawLIC:!1,rebuildLICShaders:!1,rebuildLICBuffers:!1,openGLLicInterface:null};function Dl(t,e,a={}){Object.assign(e,Bl,a),Er.extend(t,e,a),Ml(t,e),ye(t,e,["openGLLicInterface"])}var Ll=X(Dl,"vtkOpenGLSurfaceLICMapper");fe("vtkSurfaceLICMapper",Ll);var{CoordinateSystem:xa}=kr;function Rl(t,e){e.classHierarchy.push("vtkWebGPUActor"),t.buildPass=a=>{a&&(e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getFirstAncestorOfType("vtkWebGPURenderWindow"),e.propID===void 0&&(e.propID=e.WebGPURenderWindow.getUniquePropID()),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes())},t.traverseZBufferPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children[0]&&e.children[0].traverse(a),t.apply(a,!1))},t.traverseOpaqueZBufferPass=a=>t.traverseOpaquePass(a),t.traverseOpaquePass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children[0]&&e.children[0].traverse(a),t.apply(a,!1))},t.traverseTranslucentPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children[0]&&e.children[0].traverse(a),t.apply(a,!1))},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;e.renderable.getIsOpaque()?r.incrementOpaqueActorCount():r.incrementTranslucentActorCount()}},t.getBufferShift=a=>(t.getKeyMatrices(a),e.bufferShift),t.getKeyMatrices=a=>{if(Math.max(e.renderable.getMTime(),a.getStabilizedTime())>e.keyMatricesTime.getMTime()){e.renderable.computeMatrix();const r=e.renderable.getMatrix();e.bufferShift[0]=r[3],e.bufferShift[1]=r[7],e.bufferShift[2]=r[11];const n=a.getStabilizedCenterByReference();e.renderable.getCoordinateSystem()===xa.WORLD&&(e.bufferShift[0]-=n[0],e.bufferShift[1]-=n[1],e.bufferShift[2]-=n[2]),ne(e.keyMatrices.bcwc,r),e.renderable.getIsIdentity()?Z(e.keyMatrices.normalMatrix):(Ce(e.keyMatrices.normalMatrix,e.keyMatrices.bcwc),e.keyMatrices.normalMatrix[3]=0,e.keyMatrices.normalMatrix[7]=0,e.keyMatrices.normalMatrix[11]=0,Se(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),ne(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix)),we(e.keyMatrices.bcwc,e.keyMatrices.bcwc,[-e.bufferShift[0],-e.bufferShift[1],-e.bufferShift[2]]),e.renderable.getCoordinateSystem()===xa.WORLD?we(e.keyMatrices.bcsc,e.keyMatrices.bcwc,[-n[0],-n[1],-n[2]]):Ce(e.keyMatrices.bcsc,e.keyMatrices.bcwc),e.keyMatricesTime.modified()}return e.keyMatrices}}var Ul={keyMatricesTime:null,keyMatrices:null,propID:void 0,bufferShift:void 0};function kl(t,e,a={}){Object.assign(e,Ul,a),ee.extend(t,e,a),e.keyMatricesTime={},I.obj(e.keyMatricesTime,{mtime:0}),e.keyMatrices={normalMatrix:new Float64Array(16),bcwc:new Float64Array(16),bcsc:new Float64Array(16)},I.get(t,e,["propID","keyMatricesTime"]),e.bufferShift=[0,0,0,0],Rl(t,e)}var El=I.newInstance(kl);he("vtkActor",El);var{CoordinateSystem:Ca}=kr;function Pl(t,e){e.classHierarchy.push("vtkWebGPUActor2D"),t.buildPass=a=>{a&&(e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getFirstAncestorOfType("vtkWebGPURenderWindow"),e.propID===void 0&&(e.propID=e.WebGPURenderWindow.getUniquePropID()),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes())},t.traverseOpaquePass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children[0]&&e.children[0].traverse(a),t.apply(a,!1))},t.traverseTranslucentPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children[0]&&e.children[0].traverse(a),t.apply(a,!1))},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;e.renderable.getIsOpaque()?r.incrementOpaqueActorCount():r.incrementTranslucentActorCount()}},t.getBufferShift=a=>(t.getKeyMatrices(a),e.bufferShift),t.getKeyMatrices=a=>{if(Math.max(e.renderable.getMTime(),a.getStabilizedTime())>e.keyMatricesTime.getMTime()){e.bufferShift[0]=0,e.bufferShift[1]=0,e.bufferShift[2]=0;const r=a.getStabilizedCenterByReference();e.renderable.getCoordinateSystem()===Ca.WORLD&&(e.bufferShift[0]-=r[0],e.bufferShift[1]-=r[1],e.bufferShift[2]-=r[2]),Z(e.keyMatrices.bcwc),Z(e.keyMatrices.normalMatrix),we(e.keyMatrices.bcwc,e.keyMatrices.bcwc,[-e.bufferShift[0],-e.bufferShift[1],-e.bufferShift[2]]),e.renderable.getCoordinateSystem()===Ca.WORLD?we(e.keyMatrices.bcsc,e.keyMatrices.bcwc,[-r[0],-r[1],-r[2]]):Ce(e.keyMatrices.bcsc,e.keyMatrices.bcwc),e.keyMatricesTime.modified()}return e.keyMatrices}}var Fl={keyMatricesTime:null,keyMatrices:null,propID:void 0,bufferShift:void 0};function Il(t,e,a={}){Object.assign(e,Fl,a),ee.extend(t,e,a),e.keyMatricesTime={},I.obj(e.keyMatricesTime,{mtime:0}),e.keyMatrices={normalMatrix:new Float64Array(16),bcwc:new Float64Array(16),bcsc:new Float64Array(16)},I.get(t,e,["propID","keyMatricesTime"]),e.bufferShift=[0,0,0,0],Pl(t,e)}var Nl=I.newInstance(Il);he("vtkActor2D",Nl);function Gl(t,e){e.classHierarchy.push("vtkWebGPUCamera"),t.getProjectionMatrix=(a,r,n,s)=>{if(Z(a),e.renderable.getParallelProjection()){const i=e.renderable.getParallelScale(),o=i*r,c=i,u=(s[0]-1)*o,p=(s[0]+1)*o,l=(s[1]-1)*c,f=(s[1]+1)*c,g=1/(p-u),h=1/(f-l);a[0]=2*g,a[5]=2*h,a[10]=1/(n[1]-n[0]),a[12]=(p+u)*g,a[13]=(f+l)*h,a[14]=n[1]/(n[1]-n[0])}else{const i=Math.tan(Math.PI*e.renderable.getViewAngle()/360);let o,c;e.renderable.getUseHorizontalViewAngle()===!0?(o=n[0]*i,c=n[0]*i/r):(o=n[0]*i*r,c=n[0]*i);const u=(s[0]-1)*o,p=(s[0]+1)*o,l=(s[1]-1)*c,f=(s[1]+1)*c;a[0]=2*n[0]/(p-u),a[5]=2*n[0]/(f-l),a[12]=(u+p)/(p-u),a[13]=(l+f)/(f-l),a[10]=0,a[14]=n[0],a[11]=-1,a[15]=0}},t.convertToOpenGLDepth=a=>{if(e.renderable.getParallelProjection())return 1-a;const r=e.renderable.getClippingRangeByReference();let n=-r[0]/a;return n=(r[0]+r[1])/(r[1]-r[0])+2*r[0]*r[1]/(n*(r[1]-r[0])),.5*n+.5},t.getKeyMatrices=a=>{const r=a.getRenderable(),n=a.getParent();if(Math.max(n.getMTime(),t.getMTime(),r.getMTime(),e.renderable.getMTime(),a.getStabilizedTime())>e.keyMatrixTime.getMTime()){const s=e.renderable.getViewMatrix();Ce(e.keyMatrices.normalMatrix,s),e.keyMatrices.normalMatrix[3]=0,e.keyMatrices.normalMatrix[7]=0,e.keyMatrices.normalMatrix[11]=0,Se(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),ne(e.keyMatrices.wcvc,s);const i=a.getStabilizedCenterByReference();we(e.keyMatrices.scvc,e.keyMatrices.wcvc,i);const o=a.getAspectRatio(),c=e.renderable.getClippingRangeByReference();t.getProjectionMatrix(e.keyMatrices.vcpc,o,c,e.renderable.getWindowCenterByReference()),q(e.keyMatrices.scpc,e.keyMatrices.vcpc,e.keyMatrices.scvc),Se(e.keyMatrices.pcsc,e.keyMatrices.scpc),e.keyMatrixTime.modified()}return e.keyMatrices}}var Al={keyMatrixTime:null,keyMatrices:null};function _l(t,e,a={}){Object.assign(e,Al,a),ee.extend(t,e,a),e.keyMatrixTime={},I.obj(e.keyMatrixTime),e.keyMatrices={normalMatrix:new Float64Array(16),vcpc:new Float64Array(16),pcsc:new Float64Array(16),wcvc:new Float64Array(16),scpc:new Float64Array(16),scvc:new Float64Array(16)},I.setGet(t,e,["keyMatrixTime"]),Gl(t,e)}var Wl=I.newInstance(_l);he("vtkCamera",Wl);function zl(t,e){e.classHierarchy.push("vtkWebGPUCubeAxesActor"),t.buildPass=a=>{a&&(e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getParent(),e.CubeAxesActorHelper.getRenderable()||e.CubeAxesActorHelper.setRenderable(e.renderable),t.prepareNodes(),t.addMissingNode(e.CubeAxesActorHelper.getTmActor()),t.addMissingNode(e.renderable.getGridActor()),t.removeUnusedNodes())},t.opaquePass=(a,r)=>{if(a){const n=e.WebGPURenderer?e.WebGPURenderer.getRenderable().getActiveCamera():null,s=e.WebGPURenderer.getTiledSizeAndOrigin();e.CubeAxesActorHelper.updateAPISpecificData([s.usize,s.vsize],n,e.WebGPURenderWindow.getRenderable())}}}var $l={};function Kl(t,e,a={}){Object.assign(e,$l,a),ee.extend(t,e,a),e.CubeAxesActorHelper=Xa.newCubeAxesActorHelper(),zl(t,e)}var Hl=X(Kl,"vtkWebGPUCubeAxesActor");he("vtkCubeAxesActor",Hl);var{Resolve:jl}=Co,{FieldAssociations:Zr}=_a,{BufferUsage:pe,PrimitiveTypes:te}=Ot,{Representation:Ke}=_t,{ScalarMode:ar}=mt,{CoordinateSystem:ql}=kr,{DisplayLocation:ma}=To,Yl=`
//VTK::Renderer::Dec

//VTK::Color::Dec

//VTK::Normal::Dec

//VTK::TCoord::Dec

//VTK::Select::Dec

//VTK::Mapper::Dec

//VTK::IOStructs::Dec

@vertex
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : vertexOutput;

  var vertex: vec4<f32> = vertexBC;

  //VTK::Color::Impl

  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Select::Impl

  //VTK::Position::Impl

  return output;
}
`,Zl=`
struct PBRData {
  diffuse: vec3<f32>,
  specular: vec3<f32>,
}

struct Material {
  ior: f32,
  roughness: f32,
  metallic: f32,
  base: vec3<f32>,
};

struct DirectionalLight {
  direction: vec3<f32>,
  color: vec3<f32>,
};

struct PointLight {
  position: vec3<f32>,
  color: vec3<f32>,
};

struct SpotLight {
  position: vec3<f32>,
  direction: vec3<f32>,
  cones: vec2<f32>,
  color: vec3<f32>,
};

const pi: f32 = 3.14159265359;

// Dot product with the max already in it
fn mdot(a: vec3<f32>, b: vec3<f32>) -> f32 {
  return max(0.0, dot(a, b));
}
// Dot product with a max in it that does not allow for negative values
// Physically based rendering is accurate as long as normals are accurate,
// however this is pretty often not the case. In order to prevent negative
// values from ruining light calculations and creating zones of zero light,
// this remapping is used, which smoothly clamps the dot product between
// zero and one while still maintaining a good amount of accuracy.
fn cdot(a: vec3<f32>, b: vec3<f32>) -> f32 {
  var d: f32 = max(0.0, dot(a, b));
  d = pow((d + 1.0) / 2.0, 2.6);
  return d;
}

// Lambertian diffuse model
fn lambertDiffuse(base: vec3<f32>, N: vec3<f32>, L: vec3<f32>) -> vec3<f32> {
  var NdotL: f32 = mdot(N, L);
  NdotL = pow(NdotL, 1.5);
  return (base/pi)*NdotL;
}

// Yasuhiro Fujii improvement on the Oren-Nayar model
// https://mimosa-pudica.net/improved-oren-nayar.html
// p is surface color, o is roughness
fn fujiiOrenNayar(p: vec3<f32>, o: f32, N: vec3<f32>, L: vec3<f32>, V: vec3<f32>) -> vec3<f32> {
  var invpi: f32 = 0.31830988618; // 1/pi

  var o2 = o*o;
  var NdotL: f32 = mdot(N, L);
  NdotL = pow(NdotL, 1.5); // Less physically accurate, but hides the "seams" between lights better

  var NdotV: f32 = mdot(N, V);
  var LdotV: f32 = mdot(L, V);

  var s: f32 = LdotV - NdotL*NdotV;
  var t: f32 = mix(1.0, max(NdotL, NdotV), step(0.0, s)); // Mix with step is the equivalent of an if statement
  var A: vec3<f32> = 0.5*(o2 / (o2 + 0.33)) + 0.17*p*(o2 / (o2 + 0.13));
  A = invpi*(1 - A);
  var B: f32 = 0.45*(o2 / (o2 + 0.09));
  B = invpi*B;

  return p*NdotL*(A + B*(s/t));
}

// Fresnel portion of BRDF (IOR only, simplified)
fn schlickFresnelIOR(V: vec3<f32>, N: vec3<f32>, ior: f32, k: f32) -> f32 {
  var NdotV: f32 = mdot(V, N);
  var F0: f32 = (pow((ior - 1.0), 2.0) + k*k) / (pow((ior + 1.0), 2.0) + k*k); // This takes into account the roughness, which the other one does not
  return F0 + (1.0 - F0) * pow((1.0-NdotV), 5.0);
}

// Fresnel portion of BRDF (Color ior, better)
fn schlickFresnelRGB(V: vec3<f32>, N: vec3<f32>, F0: vec3<f32>) -> vec3<f32> {
  var NdotV: f32 = mdot(V, N);
  return F0 + (1.0 - F0) * pow((1-NdotV), 5.0);
}

// Normal portion of BRDF
// https://learnopengl.com/PBR/Theory
// Trowbridge-Reitz GGX functions: normal, halfway, roughness^2
fn trGGX(N: vec3<f32>, H: vec3<f32>, a: f32) -> f32 {
  var a2: f32 = a*a;
  var NdotH = mdot(N, H);
  var NdotH2 = NdotH*NdotH;

  var denom: f32 = NdotH2 * (a2 - 1.0) + 1.0;

  return a2 / max((pi*denom*denom), 0.000001);
}

// A VERY bad approximation of anisotropy. Real anisotropic calculations require tangent and bitangent
fn anisotrophicTrGGX(N: vec3<f32>, H: vec3<f32>, O: vec3<f32>, s: f32, a: f32) -> f32 {
  var Op: vec3<f32> = (rendererUBO.WCVCNormals * vec4<f32>(normalize(O) * s, 0.)).xyz;

  var ggx1: f32 = trGGX(N + Op*s, H, a);
  var ggx2: f32 = trGGX(N - Op*s, H, a);
  return (0.5 * ggx1 + 0.5 * ggx2);
}

// Geometry portion of BRDF
fn schlickGGX(N: vec3<f32>, X: vec3<f32>, k: f32) -> f32 {
  var NdotX = cdot(N, X);
  return NdotX / max(0.000001, (NdotX*(1.0-k) + k));
}

fn smithSurfaceRoughness(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, k: f32) -> f32 {
  var ggx1: f32 = min(1.0, schlickGGX(N, V, k));
  var ggx2: f32 = min(1.0, schlickGGX(N, L, k));
  return ggx1*ggx2;
}

// BRDF Combination
fn cookTorrance(D: f32, F: f32, G: f32, N: vec3<f32>, V: vec3<f32>, L: vec3<f32>) -> f32 {
  var num: f32 = D*F*G;
  var denom: f32 = 4*cdot(V, N)*cdot(L, N);

  return num / max(denom, 0.000001);
}

// Different lighting calculations for different light sources
fn calcDirectionalLight(N: vec3<f32>, V: vec3<f32>, mat: Material, light: DirectionalLight) -> PBRData {
  var L: vec3<f32> = normalize(light.direction); // Light Vector
  var H: vec3<f32> = normalize(L + V); // Halfway Vector

  var alpha = mat.roughness * mat.roughness;
  var k: f32 = alpha * alpha / 2.0;

  var D: f32 = trGGX(N, H, alpha); // Distribution
  // var F: f32 = schlickFresnelIOR(V, N, ior, k); // Fresnel
  var G: f32 = smithSurfaceRoughness(N, V, L, k); // Geometry

  var brdf: f32 = cookTorrance(D, 1.0, G, N, V, L); // Fresnel term is replaced with 1 because it is added later
  var incoming: vec3<f32> = light.color;
  var angle: f32 = mdot(L, N);
  angle = pow(angle, 1.5);

  var specular: vec3<f32> = brdf * incoming * angle;
  // Oren-Nayar gives a clay-like effect when fully rough which some people may not want, so it might be better to give a separate
  // control property for the diffuse vs specular roughness
  var diffuse: vec3<f32> = incoming * fujiiOrenNayar(mat.base, mat.roughness, N, L, V);
  // Stores the specular and diffuse separately to allow for finer post processing
  var out = PBRData(diffuse, specular);

  return out; // Returns angle along with color of light so the final color can be multiplied by angle as well (creates black areas)
}

fn calcPointLight(N: vec3<f32>, V: vec3<f32>, fragPos: vec3<f32>, mat: Material, light: PointLight) -> PBRData {
  var L: vec3<f32> = normalize(light.position - fragPos);
  var H: vec3<f32> = normalize(L + V);
  var dist = distance(light.position, fragPos);

  var alpha = mat.roughness * mat.roughness;
  var k: f32 = alpha * alpha / 2.0;

  var D: f32 = trGGX(N, H, alpha); // Distribution
  var F: f32 = schlickFresnelIOR(V, N, mat.ior, k); // Fresnel
  var G: f32 = smithSurfaceRoughness(N, V, L, k); // Geometry

  var brdf: f32 = cookTorrance(D, 1.0, G, N, V, L);
  var incoming: vec3<f32> = light.color * (1.0 / (dist * dist));
  var angle: f32 = mdot(L, N);
  angle = pow(angle, 1.5); // Smoothing factor makes it less accurate, but reduces ugly "seams" between light sources

  var specular: vec3<f32> = brdf * incoming * angle;
  var diffuse: vec3<f32> = incoming * fujiiOrenNayar(mat.base, mat.roughness, N, L, V);
  // Stores the specular and diffuse separately to allow for finer post processing
  // Could also be done (propably more properly) with a struct
  var out = PBRData(diffuse, specular);

  return out; // Returns angle along with color of light so the final color can be multiplied by angle as well (creates black areas)
}

// For a reason unknown to me, spheres dont seem to behave propperly with head-on spot lights
fn calcSpotLight(N: vec3<f32>, V: vec3<f32>, fragPos: vec3<f32>, mat: Material, light: SpotLight) -> PBRData {
  var L: vec3<f32> = normalize(light.position - fragPos);
  var H: vec3<f32> = normalize(L + V); // Halfway Vector
  var dist = distance(light.position, fragPos);

  var alpha = mat.roughness * mat.roughness;
  var k: f32 = alpha * alpha / 2.0; // could also be pow(alpha + 1.0, 2) / 8

  var D: f32 = trGGX(N, H, alpha); // Distribution
  // var F: f32 = schlickFresnelIOR(V, N, ior, k); // Fresnel
  var G: f32 = smithSurfaceRoughness(N, V, L, k); // Geometry

  var brdf: f32 = cookTorrance(D, 1.0, G, N, V, L);

  var theta: f32 = mdot(normalize(light.direction), L);
  var epsilon: f32 = light.cones.x - light.cones.y;
  var intensity: f32 = (theta - light.cones.y) / epsilon;
  intensity = clamp(intensity, 0.0, 1.0);
  intensity /= dist * dist;

  var incoming: vec3<f32> = light.color * intensity;

  var angle: f32 = mdot(L, N);
  angle = pow(angle, 1.5); // Smoothing factor makes it less accurate, but reduces ugly "seams" between light sources

  var specular: vec3<f32> = brdf * incoming * angle;
  var diffuse: vec3<f32> = incoming * fujiiOrenNayar(mat.base, mat.roughness, N, L, V);

  // Stores the specular and diffuse separately to allow for finer post processing
  // Could also be done (propably more properly) with a struct
  var out = PBRData(diffuse, specular);

  return out; // Returns angle along with color of light so the final color can be multiplied by angle as well (creates black areas)
}

// Environment mapping stuff
// Takes in a vector and converts it to an equivalent coordinate in a rectilinear texture. Should be replaced with cubemaps at some point
fn vecToRectCoord(dir: vec3<f32>) -> vec2<f32> {
  var tau: f32 = 6.28318530718;
  var out: vec2<f32> = vec2<f32>(0.0);

  out.x = atan2(dir.z, dir.x) / tau;
  out.x += 0.5;

  var phix: f32 = length(vec2(dir.x, dir.z));
  out.y = atan2(dir.y, phix) / pi + 0.5;

  return out;
}

//VTK::Renderer::Dec

//VTK::Color::Dec

//VTK::TCoord::Dec

// optional surface normal declaration
//VTK::Normal::Dec

//VTK::Select::Dec

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

  // Temporary ambient, diffuse, and opacity
  var ambientColor: vec4<f32> = mapperUBO.AmbientColor;
  var diffuseColor: vec4<f32> = mapperUBO.DiffuseColor;
  var ambientIntensity: f32 = mapperUBO.AmbientIntensity;
  var diffuseIntensity: f32 = mapperUBO.DiffuseIntensity;
  var specularColor: vec4<f32> = mapperUBO.SpecularColor;
  var specularIntensity: f32 = mapperUBO.SpecularIntensity;
  var opacity: f32 = mapperUBO.Opacity;
  var ior: f32 = mapperUBO.BaseIOR;
  var normalStrengthUniform: f32 = mapperUBO.NormalStrength;
  var roughnessUniform: f32 = mapperUBO.Roughness;
  var metallicUniform: f32 = mapperUBO.Metallic;
  var emissionUniform: f32 = mapperUBO.Emission;

  if (!input.frontFacing) {
    ambientColor = mapperUBO.AmbientColorBF;
    diffuseColor = mapperUBO.DiffuseColorBF;
    ambientIntensity = mapperUBO.AmbientIntensityBF;
    diffuseIntensity = mapperUBO.DiffuseIntensityBF;
    specularColor = mapperUBO.SpecularColorBF;
    specularIntensity = mapperUBO.SpecularIntensityBF;
    opacity = mapperUBO.OpacityBF;
    ior = mapperUBO.BaseIORBF;
    normalStrengthUniform = mapperUBO.NormalStrengthBF;
    roughnessUniform = mapperUBO.RoughnessBF;
    metallicUniform = mapperUBO.MetallicBF;
    emissionUniform = mapperUBO.EmissionBF;
  }

  // This should be declared somewhere else
  var _diffuseMap: vec4<f32> = vec4<f32>(1.0);
  var _roughnessMap: vec4<f32> = vec4<f32>(1.0);
  var _metallicMap: vec4<f32> = vec4<f32>(1.0);
  var _normalMap: vec4<f32> = vec4<f32>(0.0, 0.0, 1.0, 0.0); // normal map was setting off the normal vector detection in fragment
  var _ambientOcclusionMap: vec4<f32> = vec4<f32>(1.);
  var _emissionMap: vec4<f32> = vec4<f32>(0.);

  //VTK::Color::Impl

  //VTK::TCoord::Impl

  //VTK::Normal::Impl

  var computedColor: vec4<f32> = vec4<f32>(diffuseColor.rgb, 1.0);

  //VTK::Light::Impl

  //VTK::Select::Impl

  // Use texture alpha for transparency
  computedColor.a = opacity * _diffuseMap.a;
  if (computedColor.a == 0.0) { discard; };

  //VTK::Position::Impl

  //VTK::RenderEncoder::Impl

  return output;
}
`,Ta=new Float64Array(16);function Sa(t){return t.indexOf("edge")>=0}function Xl(t,e){e.classHierarchy.push("vtkWebGPUCellArrayMapper"),t.buildPass=a=>{a&&(e.is2D?(e.WebGPUActor=t.getFirstAncestorOfType("vtkWebGPUActor2D"),e.forceZValue=!0):(e.WebGPUActor=t.getFirstAncestorOfType("vtkWebGPUActor"),e.forceZValue=!1),e.coordinateSystem=e.WebGPUActor.getRenderable().getCoordinateSystem(),e.useRendererMatrix=e.coordinateSystem!==ql.DISPLAY,e.WebGPURenderer=e.WebGPUActor.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getParent(),e.device=e.WebGPURenderWindow.getDevice())},t.isEdgePrimitive=()=>e.primitiveType===te.TriangleEdges||e.primitiveType===te.TriangleStripEdges,t.shouldSkipPass=()=>t.isEdgePrimitive()&&(e.depthOnlyPass||e.selectionPass),t.renderForPass=(a,r=!1)=>{if(e.depthOnlyPass=r,e.selectionPass=a?.getPipelineHash?.()==="sel",t.shouldSkipPass()){e.depthOnlyPass=!1,e.selectionPass=!1;return}t.prepareToDraw(a),e.renderEncoder.registerDrawCallback(e.pipeline,t.draw),e.depthOnlyPass=!1,e.selectionPass=!1},t.translucentPass=a=>{a&&t.renderForPass(e.WebGPURenderer.getRenderEncoder())},t.opaquePass=a=>{a&&t.renderForPass(e.WebGPURenderer.getRenderEncoder())},t.zBufferPass=a=>{a&&t.renderForPass(e.WebGPURenderer.getRenderEncoder(),!0)},t.opaqueZBufferPass=a=>t.zBufferPass(a),t.updateUBO=()=>{const a=e.WebGPUActor.getRenderable(),r=a.getProperty(),n=e.renderable.getClippingPlanesMTime(),s=a.getBackfaceProperty?.()??r,i=e.WebGPURenderer?.getSelector?.(),o=e.UBO.getSendTime();if(!i&&t.getMTime()<=o&&r.getMTime()<=o&&s.getMTime()<=o&&e.renderable.getMTime()<=o&&n<=o)return;const c=e.WebGPUActor.getKeyMatrices(e.WebGPURenderer);e.UBO.setArray("BCWCMatrix",c.bcwc),e.UBO.setArray("BCSCMatrix",c.bcsc),e.UBO.setArray("MCWCNormals",c.normalMatrix);const u=e.WebGPUActor.getBufferShift(e.WebGPURenderer);if(e.UBO.setArray("BufferShift",[u[0],u[1],u[2]]),e.is2D){const h=r.getDisplayLocation?.()??ma.BACKGROUND;e.UBO.setValue("ZValue",h===ma.FOREGROUND?1:0);const d=r.getColorByReference();e.UBO.setValue("AmbientIntensity",1),e.UBO.setArray("AmbientColor",[...d,1]),e.UBO.setArray("DiffuseColor",[...d,1]),e.UBO.setValue("DiffuseIntensity",0),e.UBO.setArray("SpecularColor",[1,1,1,1]),e.UBO.setValue("SpecularIntensity",0),e.UBO.setValue("Roughness",1),e.UBO.setValue("BaseIOR",1.45),e.UBO.setValue("Metallic",0),e.UBO.setValue("Emission",1),e.UBO.setValue("NormalStrength",1),e.UBO.setValue("AmbientIntensityBF",1),e.UBO.setArray("AmbientColorBF",[...d,1]),e.UBO.setValue("DiffuseIntensityBF",0),e.UBO.setArray("DiffuseColorBF",[...d,1]),e.UBO.setArray("SpecularColorBF",[1,1,1,1]),e.UBO.setValue("SpecularIntensityBF",0),e.UBO.setValue("RoughnessBF",1),e.UBO.setValue("BaseIORBF",1.45),e.UBO.setValue("MetallicBF",0),e.UBO.setValue("EmissionBF",1),e.UBO.setValue("NormalStrengthBF",1),e.UBO.setValue("OpacityBF",r.getOpacity())}else e.UBO.setValue("AmbientIntensity",r.getAmbient()),e.UBO.setArray("AmbientColor",[...r.getAmbientColorByReference(),1]),e.UBO.setValue("DiffuseIntensity",r.getDiffuse()),e.UBO.setArray("DiffuseColor",[...r.getDiffuseColorByReference(),1]),e.UBO.setValue("Roughness",r.getRoughness()),e.UBO.setValue("BaseIOR",r.getBaseIOR()),e.UBO.setValue("Metallic",r.getMetallic()),e.UBO.setValue("NormalStrength",r.getNormalStrength()),e.UBO.setValue("Emission",r.getEmission()),e.UBO.setValue("SpecularIntensity",r.getSpecular()),e.UBO.setArray("SpecularColor",[...r.getSpecularColorByReference(),1]),e.UBO.setValue("AmbientIntensityBF",s.getAmbient()),e.UBO.setArray("AmbientColorBF",[...s.getAmbientColorByReference(),1]),e.UBO.setValue("DiffuseIntensityBF",s.getDiffuse()),e.UBO.setArray("DiffuseColorBF",[...s.getDiffuseColorByReference(),1]),e.UBO.setValue("RoughnessBF",s.getRoughness()),e.UBO.setValue("BaseIORBF",s.getBaseIOR()),e.UBO.setValue("MetallicBF",s.getMetallic()),e.UBO.setValue("EmissionBF",s.getEmission()),e.UBO.setValue("NormalStrengthBF",s.getNormalStrength()),e.UBO.setValue("SpecularIntensityBF",s.getSpecular()),e.UBO.setArray("SpecularColorBF",[...s.getSpecularColorByReference(),1]),e.UBO.setValue("OpacityBF",s.getOpacity());const p=r.getEdgeColorByReference?.();p&&e.UBO.setArray("EdgeColor",[...p,1]),e.UBO.setValue("LineWidth",r.getLineWidth());const l=e.primitiveType===te.TriangleEdges||e.primitiveType===te.TriangleStripEdges||r.getRepresentation()===Ke.WIREFRAME;e.UBO.setValue("Opacity",l?r.getEdgeOpacity():r.getOpacity());const f=e.WebGPUActor.getPropID();e.UBO.setValue("PropID",i?.getPropIDForSelection?i.getPropIDForSelection(f,a)+1:f);const g=t.getCoincidentParameters();if(e.UBO.setValue("CoincidentFactor",g.factor),e.UBO.setValue("CoincidentOffset",g.offset),e.UBO.setValue("NumClipPlanes",0),!e.is2D&&e.useRendererMatrix){const h=e.WebGPURenderer.getStabilizedCenterByReference();mr(Ta,[-h[0],-h[1],-h[2]]);const d=Pa(e.renderable,Ta,e.clipPlanes);if(e.UBO.setValue("NumClipPlanes",d),d>0)for(let v=0;v<d;v++)e.UBO.setArray(`ClipPlane${v}`,e.clipPlanes[v])}e.UBO.sendIfNeeded(e.WebGPURenderWindow.getDevice())},t.haveWideLines=()=>{const a=e.WebGPUActor.getRenderable(),r=a.getProperty().getRepresentation();return a.getProperty().getLineWidth()<=1||e.primitiveType===te.Verts?!1:e.primitiveType===te.Triangles||e.primitiveType===te.TriangleStrips?r===Ke.WIREFRAME:!0},t.getCullMode=()=>{const a=e.WebGPUActor.getRenderable().getProperty();return a.getFrontfaceCulling()?"front":a.getBackfaceCulling()?"back":"none"},t.getPipelineSettings=()=>({primitive:{cullMode:t.getCullMode()},...e.depthOnlyPass?{fragment:{targets:[{format:"rgba16float",writeMask:0}]}}:{}}),t.getCoincidentParameters=()=>{let a={factor:0,offset:0};const r=e.WebGPUActor?.getRenderable()?.getProperty?.();if(!r)return a;if(e.renderable.getResolveCoincidentTopology()==jl.PolygonOffset||r.getEdgeVisibility()&&r.getRepresentation()===Ke.SURFACE){const s=e.primitiveType;s===te.Verts||r.getRepresentation()===Ke.POINTS?a=e.renderable.getCoincidentTopologyPointOffsetParameter():s===te.Lines||r.getRepresentation()===Ke.WIREFRAME?a=e.renderable.getCoincidentTopologyLineOffsetParameters():(s===te.Triangles||s===te.TriangleStrips)&&(a=e.renderable.getCoincidentTopologyPolygonOffsetParameters()),(s===te.TriangleEdges||s===te.TriangleStripEdges)&&(a=e.renderable.getCoincidentTopologyPolygonOffsetParameters(),a.factor/=2,a.offset/=2)}const n=e.WebGPURenderer?.getSelector?.();return n&&n.getFieldAssociation()===Zr.FIELD_ASSOCIATION_POINTS&&(a.offset-=2),a},t.replaceShaderPosition=(a,r,n)=>{const s=r.getShaderDescription("vertex");s.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),s.hasOutput("vertexVC")||s.addOutput("vec4<f32>","vertexVC"),s.hasOutput("vertexSC")||s.addOutput("vec4<f32>","vertexSC");let i=s.getCode();e.useRendererMatrix?(i=G.substitute(i,"//VTK::Position::Impl",["    output.vertexSC = mapperUBO.BCSCMatrix * vec4<f32>(vertexBC.xyz, 1.0);","    var pCoord: vec4<f32> = rendererUBO.SCPCMatrix*mapperUBO.BCSCMatrix*vertexBC;","    output.vertexVC = rendererUBO.SCVCMatrix * mapperUBO.BCSCMatrix * vec4<f32>(vertexBC.xyz, 1.0);","//VTK::Position::Impl"]).result,e.forceZValue&&(i=G.substitute(i,"//VTK::Position::Impl",["pCoord = vec4<f32>(pCoord.xyz/pCoord.w, 1.0);","pCoord.z = mapperUBO.ZValue;","//VTK::Position::Impl"]).result)):(i=G.substitute(i,"//VTK::Position::Impl",["    var pCoord: vec4<f32> = mapperUBO.BCSCMatrix*vertexBC;","    pCoord.x = 2.0* pCoord.x / rendererUBO.viewportSize.x - 1.0;","    pCoord.y = 2.0* pCoord.y / rendererUBO.viewportSize.y - 1.0;","    pCoord.z = 0.5 - 0.5 * pCoord.z;","//VTK::Position::Impl"]).result,e.forceZValue&&(i=G.substitute(i,"//VTK::Position::Impl",["    pCoord.z = mapperUBO.ZValue;","//VTK::Position::Impl"]).result)),t.haveWideLines()&&(s.addBuiltinInput("u32","@builtin(instance_index) instanceIndex"),i=G.substitute(i,"//VTK::Position::Impl",["    var tmpPos: vec4<f32> = pCoord;","    var numSteps: f32 = ceil(mapperUBO.LineWidth - 1.0);","    var offset: f32 = (mapperUBO.LineWidth - 1.0) * (f32(input.instanceIndex / 2u) - numSteps/2.0) / numSteps;","    var tmpPos2: vec3<f32> = tmpPos.xyz / tmpPos.w;","    tmpPos2.x = tmpPos2.x + 2.0 * (f32(input.instanceIndex) % 2.0) * offset / rendererUBO.viewportSize.x;","    tmpPos2.y = tmpPos2.y + 2.0 * (f32(input.instanceIndex + 1u) % 2.0) * offset / rendererUBO.viewportSize.y;","    tmpPos2.z = min(1.0, tmpPos2.z + 0.00001);","    pCoord = vec4<f32>(tmpPos2.xyz * tmpPos.w, tmpPos.w);","//VTK::Position::Impl"]).result),i=G.substitute(i,"//VTK::Position::Impl",["    pCoord.z = clamp(pCoord.z - 0.000016 * mapperUBO.CoincidentOffset * pCoord.w, 0.0, pCoord.w);","    output.Position = pCoord;"]).result,s.setCode(i);const o=r.getShaderDescription("fragment");i=o.getCode();const c=Ur({countName:"mapperUBO.NumClipPlanes",planePrefix:"mapperUBO.ClipPlane",positionName:"input.vertexSC"});i=G.substitute(i,"//VTK::Position::Impl",[...c,"//VTK::Position::Impl"]).result,o.setCode(i)},e.shaderReplacements.set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderCoincidentOffset=(a,r,n)=>{const s=r.getShaderDescription("fragment");if(!s)return;s.addBuiltinInput("vec4<f32>","@builtin(position) fragPos"),s.addBuiltinOutput("f32","@builtin(frag_depth) fragDepth");let i=s.getCode();i=G.substitute(i,"//VTK::Position::Impl",["  var coincidentDepth: f32 = input.fragPos.z;","  if (mapperUBO.CoincidentFactor != 0.0) {","    let cscale = length(vec2<f32>(dpdx(input.fragPos.z), dpdy(input.fragPos.z)));","    coincidentDepth = coincidentDepth - mapperUBO.CoincidentFactor * cscale;","  }","  output.fragDepth = clamp(coincidentDepth, 0.0, 1.0);"]).result,s.setCode(i)},e.shaderReplacements.set("replaceShaderCoincidentOffset",t.replaceShaderCoincidentOffset),t.replaceShaderNormal=(a,r,n)=>{const s=n.getBuffer("normalMC"),i=e.WebGPUActor.getRenderable();if(s){const o=r.getShaderDescription("vertex");o.hasOutput("normalVC")||o.addOutput("vec3<f32>","normalVC",s.getArrayInformation()[0].interpolation),o.hasOutput("tangentVC")||o.addOutput("vec3<f32>","tangentVC",s.getArrayInformation()[0].interpolation),o.hasOutput("bitangentVC")||o.addOutput("vec3<f32>","bitangentVC",s.getArrayInformation()[0].interpolation);let c=o.getCode();c=G.substitute(c,"//VTK::Normal::Impl",["  output.normalVC = normalize((rendererUBO.WCVCNormals * mapperUBO.MCWCNormals * normalMC).xyz);","  var c1: vec3<f32> = cross(output.normalVC, vec3<f32>(0, 0, 1));","  var c2: vec3<f32> = cross(output.normalVC, vec3<f32>(0, 1, 0));","  var tangent: vec3<f32> = mix(c1, c2, distance(c1, c2));","  output.tangentVC = normalize(tangent);","  output.bitangentVC = normalize(cross(output.normalVC, tangent));"]).result,o.setCode(c);const u=r.getShaderDescription("fragment");c=u.getCode(),i.getProperty().getNormalTexture()?c=G.substitute(c,"//VTK::Normal::Impl",["  var normal: vec3<f32> = input.normalVC;","  if (!input.frontFacing) { normal = -normal; }","  var tangent: vec3<f32> = input.tangentVC;","  var bitangent: vec3<f32> = input.bitangentVC;","  var TCVCMatrix: mat3x3<f32> = mat3x3<f32>(","    tangent.x, bitangent.x, normal.x,","    tangent.y, bitangent.y, normal.y,","    tangent.z, bitangent.z, normal.z,","  );","  var mappedNormal: vec3<f32> = TCVCMatrix * (_normalMap.xyz * 2 - 1);","  normal = mix(normal, mappedNormal, normalStrengthUniform);","  normal = normalize(normal);"]).result:c=G.substitute(c,"//VTK::Normal::Impl",["  var normal: vec3<f32> = input.normalVC;","  if (!input.frontFacing) { normal = -normal; }","  normal = normalize(normal);"]).result,u.setCode(c)}},e.shaderReplacements.set("replaceShaderNormal",t.replaceShaderNormal),t.replaceShaderLight=(a,r,n)=>{if(a.includes("sel"))return;const s=r.getShaderDescription("vertex");s.hasOutput("vertexVC")||s.addOutput("vec4<f32>","vertexVC");const i=e.WebGPURenderer.getRenderable(),o=r.getShaderDescription("fragment");let c=o.getCode();if(c.includes("var normal:")&&e.useRendererMatrix&&!Sa(a)&&!e.is2D&&!a.includes("sel")){const u=["  let fragPos = vec3<f32>(input.vertexVC.xyz);","  let V = mix(normalize(-fragPos), vec3<f32>(0, 0, 1), f32(rendererUBO.cameraParallel)); // View Vector","  let baseColor = _diffuseMap.rgb * diffuseColor.rgb;","  let roughness = max(0.000001, roughnessUniform * _roughnessMap.r);","  let metallic = metallicUniform * _metallicMap.r;","  let alpha = roughness * roughness;","  let k = alpha * alpha / 2.0;","  var diffuse = vec3<f32>(0.);","  var specular = vec3<f32>(0.);","  let emission = _emissionMap.rgb * emissionUniform;","","  // Material struct","  let mat = Material(ior, roughness, metallic, baseColor);","","  {","    var i = 0;","    loop {","      if (!(i < rendererUBO.LightCount)) { break; }","      switch (i32(rendererLightSSBO.values[i].LightData.x)) {","         // Point Light","         case 0 {","           let color = rendererLightSSBO.values[i].LightColor.rgb * rendererLightSSBO.values[i].LightColor.w;","           let pos = (rendererLightSSBO.values[i].LightPos).xyz;","           let pointLight = PointLight(pos, color);","           let result = calcPointLight(normal, V, fragPos, mat, pointLight);","           diffuse += max(vec3<f32>(0), result.diffuse);","           specular += max(vec3<f32>(0), result.specular);","          }","         // Directional light","         case 1 {","           let dir = normalize((rendererUBO.WCVCNormals * vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.)).xyz);","           let color = rendererLightSSBO.values[i].LightColor.rgb * rendererLightSSBO.values[i].LightColor.w;","           let dirLight = DirectionalLight(dir, color);","           let result = calcDirectionalLight(normal, V, mat, dirLight); // diffuseColor.rgb needs to be fixed with a more dynamic diffuse color","           diffuse += max(vec3<f32>(0), result.diffuse);","           specular += max(vec3<f32>(0), result.specular);","         }","         // Spot Light","         case 2 {","           let color = rendererLightSSBO.values[i].LightColor.rgb * rendererLightSSBO.values[i].LightColor.w;","           let pos = (rendererLightSSBO.values[i].LightPos).xyz;","           let dir = normalize((rendererUBO.WCVCNormals * vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.)).xyz);","           let cones = vec2<f32>(rendererLightSSBO.values[i].LightData.y, rendererLightSSBO.values[i].LightData.z);","           let spotLight = SpotLight(pos, dir, cones, color);","           let result = calcSpotLight(normal, V, fragPos, mat, spotLight);","           diffuse += max(vec3<f32>(0), result.diffuse);","           specular += max(vec3<f32>(0), result.specular);","         }","         default { continue; }","       }","      continuing { i++; }","    }","  }","  let fresnel = min(1.0, schlickFresnelIOR(V, normal, ior, k)); // Fresnel","  // This could be controlled with its own variable (that isnt base color) for better artistic control","  let fresnelMetallic = schlickFresnelRGB(V, normal, baseColor); // Fresnel for metal, takes color into account","  let kS = min(vec3<f32>(1.0), mix(vec3<f32>(fresnel), fresnelMetallic, metallic));","  let kD = (1.0 - kS) * (1.0 - metallic);","  let specularMaterial = specularColor.rgb * specularColor.a;","  let PBR = diffuseIntensity * kD * diffuse + kS * specularIntensity * specular * specularMaterial;","  computedColor = vec4<f32>(PBR + emission, opacity);"];i.getEnvironmentTexture()?.getImageLoaded()&&u.push("  // To get diffuse IBL, the texture is sampled with normals in worldspace","  let diffuseIBLCoords = (transpose(rendererUBO.WCVCNormals) * vec4<f32>(normal, 1.)).xyz;","  let diffuseCoords = vecToRectCoord(diffuseIBLCoords);","  // To get specular IBL, the texture is sampled as the worldspace reflection between the normal and view vectors","  // Reflections are first calculated in viewspace, then converted to worldspace to sample the environment","  let VreflN = normalize(reflect(-V, normal));","  let reflectionIBLCoords = (transpose(rendererUBO.WCVCNormals) * vec4<f32>(VreflN, 1.)).xyz;","  let specularCoords = vecToRectCoord(reflectionIBLCoords);","  let diffuseIBL = textureSampleLevel(EnvironmentTexture, EnvironmentTextureSampler, diffuseCoords, rendererUBO.MaxEnvironmentMipLevel);","  let level = roughness * rendererUBO.MaxEnvironmentMipLevel;","  let specularIBL = textureSampleLevel(EnvironmentTexture, EnvironmentTextureSampler, specularCoords, level);","  let specularIBLContribution = specularIBL.rgb * rendererUBO.BackgroundSpecularStrength;","  computedColor += vec4<f32>(specularIBLContribution * kS, 0);","  let diffuseIBLContribution = diffuseIBL.rgb * rendererUBO.BackgroundDiffuseStrength;","  computedColor += vec4<f32>(diffuseIBLContribution * baseColor * _ambientOcclusionMap.rgb * kD, 0);"),c=G.substitute(c,"//VTK::Light::Impl",u).result,o.setCode(c)}else c=G.substitute(c,"//VTK::Light::Impl",["  let diffuse = diffuseColor.rgb;","  let specular = specularColor.rgb * specularColor.a;","  computedColor = vec4<f32>(diffuse * _diffuseMap.rgb, opacity);"]).result,o.setCode(c)},e.shaderReplacements.set("replaceShaderLight",t.replaceShaderLight),t.replaceShaderColor=(a,r,n)=>{if(Sa(a)){const u=r.getShaderDescription("fragment");let p=u.getCode();p=G.substitute(p,"//VTK::Color::Impl",["ambientColor = mapperUBO.EdgeColor;","diffuseColor = mapperUBO.EdgeColor;"]).result,u.setCode(p);return}if((e.renderable.getAreScalarsMappedFromCells()||e.renderable.getInterpolateScalarsBeforeMapping?.())&&e.renderable.getColorCoordinates()&&n.hasAttribute("tcoord")&&e.colorTexture){const u=r.getShaderDescription("fragment");let p=u.getCode();p=G.substitute(p,"//VTK::Color::Impl",["var texColor = textureSample(DiffuseTexture, DiffuseTextureSampler, input.tcoordVS);","diffuseColor = vec4<f32>(texColor.rgb, 1.0);","ambientColor = vec4<f32>(texColor.rgb, 1.0);","opacity = opacity * texColor.a;"]).result,u.setCode(p);return}const s=n.getBuffer("colorVI");if(!s)return;const i=r.getShaderDescription("vertex");i.addOutput("vec4<f32>","color",s.getArrayInformation()[0].interpolation);let o=i.getCode();o=G.substitute(o,"//VTK::Color::Impl",["  output.color = colorVI;"]).result,i.setCode(o);const c=r.getShaderDescription("fragment");o=c.getCode(),o=G.substitute(o,"//VTK::Color::Impl",["ambientColor = input.color;","diffuseColor = input.color;","opacity = opacity * input.color.a;"]).result,c.setCode(o)},e.shaderReplacements.set("replaceShaderColor",t.replaceShaderColor),t.replaceShaderTCoord=(a,r,n)=>{if(!n.hasAttribute("tcoord"))return;const s=r.getShaderDescription("vertex"),i=n.getBuffer("tcoord").getArrayInformation()[0],o=Nn.getNumberOfComponentsFromBufferFormat(i.format),c=i.interpolation;let u=s.getCode();s.addOutput(`vec${o}<f32>`,"tcoordVS",c),u=G.substitute(u,"//VTK::TCoord::Impl",["  output.tcoordVS = tcoord;"]).result,s.setCode(u);const p=r.getShaderDescription("fragment");u=p.getCode();const l=e.WebGPUActor.getRenderable(),f=l.getProperty(),g=B=>B?B.getDimensionality()===o:!1,h=[],d=f.getDiffuseTexture?.();(d?.getImageLoaded()||l.getTextures()[0]||e.colorTexture)&&(g(d)||g(l.getTextures()[0])||g(e.colorTexture))&&h.push("_diffuseMap = textureSample(DiffuseTexture, DiffuseTextureSampler, input.tcoordVS);");const v=f.getORMTexture?.(),x=f.getRMTexture?.(),C=f.getRoughnessTexture?.(),T=f.getMetallicTexture?.(),m=f.getAmbientOcclusionTexture?.(),w=f.getEmissionTexture?.(),O=f.getNormalTexture?.();v?.getImageLoaded()?g(v)&&h.push("let ormSample = textureSample(ORMTexture, ORMTextureSampler, input.tcoordVS);","_ambientOcclusionMap = ormSample.rrra;","_roughnessMap = ormSample.ggga;","_metallicMap = ormSample.bbba;"):x?.getImageLoaded()?g(x)&&h.push("let rmSample = textureSample(RMTexture, RMTextureSampler, input.tcoordVS);","_roughnessMap = rmSample.ggga;","_metallicMap = rmSample.bbba;"):(C?.getImageLoaded()&&g(C)&&h.push("_roughnessMap = textureSample(RoughnessTexture, RoughnessTextureSampler, input.tcoordVS).ggga;"),T?.getImageLoaded()&&g(T)&&h.push("_metallicMap = textureSample(MetallicTexture, MetallicTextureSampler, input.tcoordVS).bbba;"),m?.getImageLoaded()&&g(m)&&h.push("_ambientOcclusionMap = textureSample(AmbientOcclusionTexture, AmbientOcclusionTextureSampler, input.tcoordVS).rrra;")),w?.getImageLoaded()&&g(w)&&h.push("_emissionMap = textureSample(EmissionTexture, EmissionTextureSampler, input.tcoordVS);"),O?.getImageLoaded()&&g(O)&&h.push("_normalMap = textureSample(NormalTexture, NormalTextureSampler, input.tcoordVS);"),u=G.substitute(u,"//VTK::TCoord::Impl",h).result,p.setCode(u)},e.shaderReplacements.set("replaceShaderTCoord",t.replaceShaderTCoord),t.replaceShaderSelect=(a,r,n)=>{if(a.includes("sel")){const s=n.getBuffer("selectId");if(s){const u=r.getShaderDescription("vertex");u.addOutput("u32","attributeID",s.getArrayInformation()[0].interpolation),u.addOutput("u32","compositeID",s.getArrayInformation()[0].interpolation);let p=u.getCode();p=G.substitute(p,"//VTK::Select::Impl",["  output.compositeID = 1u;","  output.attributeID = selectId + 1u;"]).result,u.setCode(p)}const i=r.getShaderDescription("fragment");let o=i.getCode();const c=s?["  var compositeID: u32 = input.compositeID;","  var attributeID: u32 = input.attributeID;"]:["  var compositeID: u32 = 0u;","  var attributeID: u32 = 0u;"];o=G.substitute(o,"//VTK::Select::Impl",c).result,i.setCode(o)}},e.shaderReplacements.set("replaceShaderSelect",t.replaceShaderSelect),t.getUsage=(a,r)=>a===Ke.POINTS||r===te.Points?pe.Verts:r===te.Lines?pe.Lines:a===Ke.WIREFRAME?r===te.Triangles?pe.LinesFromTriangles:pe.LinesFromStrips:r===te.Triangles?pe.Triangles:r===te.TriangleStrips?pe.Strips:r===te.TriangleEdges?pe.LinesFromTriangles:pe.LinesFromStrips,t.getHashFromUsage=a=>`pt${a}`,t.getTopologyFromUsage=a=>{switch(a){case pe.Triangles:return"triangle-list";case pe.Verts:return"point-list";case pe.Lines:default:return"line-list"}},t.buildVertexInput=()=>{const a=e.currentInput,r=e.cellArray,n=e.primitiveType;let s=e.WebGPUActor.getRenderable().getProperty().getRepresentation();const i=e.WebGPURenderWindow.getDevice();let o=!1;n===te.TriangleEdges&&(o=!0,s=Ke.WIREFRAME);const c=e.vertexInput,u=a.getPoints();let p=null;if(r?(p=i.getBufferManager().getBuffer({hash:`R${s}P${n}O${e.cellOffset}${r.getMTime()}`,usage:pe.Index,cells:r,numberOfPoints:u.getNumberOfPoints(),primitiveType:n,representation:s,cellOffset:e.cellOffset}),c.setIndexBuffer(p)):c.setIndexBuffer(null),u){const x=e.WebGPUActor.getBufferShift(e.WebGPURenderer);c.addBuffer(i.getBufferManager().getBuffer({hash:`${u.getMTime()}I${p?.getMTime?.()??0}${x.join()}float32x4`,usage:pe.PointArray,format:"float32x4",dataArray:u,indexBuffer:p,shift:x,packExtra:!0}),["vertexBC"])}else c.removeBufferIfPresent("vertexBC");const l=t.getUsage(s,n);e._usesCellNormals=!1;const f=s===Ke.WIREFRAME&&(n===te.Triangles||n===te.TriangleStrips);if(!e.is2D&&(l===pe.Triangles||l===pe.Strips||f)){const x=a.getPointData().getNormals(),C={format:"snorm8x4",indexBuffer:p,packExtra:!0,shift:0,scale:127};x?(C.hash=`${x.getMTime()}I${p.getMTime()}snorm8x4`,C.dataArray=x,C.usage=pe.PointArray,c.addBuffer(i.getBufferManager().getBuffer(C),["normalMC"])):n===te.Triangles?(e._usesCellNormals=!0,C.hash=`PFN${u.getMTime()}I${p.getMTime()}snorm8x4`,C.dataArray=u,C.cells=r,C.usage=pe.NormalsFromPoints,C.cellOffset=e.cellOffset,c.addBuffer(i.getBufferManager().getBuffer(C),["normalMC"])):c.removeBufferIfPresent("normalMC")}else c.removeBufferIfPresent("normalMC");let g=!1;if(e.renderable.getScalarVisibility()){const x=e.renderable.getColorMapColors();if(x&&!o){const C=e.renderable.getScalarMode(),T=(C===ar.USE_CELL_DATA||C===ar.USE_CELL_FIELD_DATA||C===ar.USE_FIELD_DATA||!a.getPointData().getScalars())&&C!==ar.USE_POINT_FIELD_DATA&&x;c.addBuffer(i.getBufferManager().getBuffer({usage:pe.PointArray,format:"unorm8x4",hash:`${T}${x.getMTime()}I${p.getMTime()}O${e.cellOffset}unorm8x4`,dataArray:x,indexBuffer:p,cellData:T,cellOffset:e.cellOffset}),["colorVI"]),g=!0}}g||c.removeBufferIfPresent("colorVI");let h=null,d=!1;(e.renderable.getAreScalarsMappedFromCells()||e.renderable.getInterpolateScalarsBeforeMapping?.())&&e.renderable.getColorCoordinates()?(h=e.renderable.getColorCoordinates(),d=e.renderable.getAreScalarsMappedFromCells()):h=a.getPointData().getTCoords(),h&&!o?c.addBuffer(d?i.getBufferManager().getBufferForCellArray(h,c.getIndexBuffer(),e.cellOffset):i.getBufferManager().getBufferForPointArray(h,c.getIndexBuffer()),["tcoord"]):c.removeBufferIfPresent("tcoord");const v=e.WebGPURenderer?.getSelector?.();if(v&&!o&&p){let x=null;v.getFieldAssociation()===Zr.FIELD_ASSOCIATION_POINTS?x=p.getFlatIdToPointId():v.getFieldAssociation()===Zr.FIELD_ASSOCIATION_CELLS&&(x=p.getFlatIdToCellId()),x?c.addBuffer(i.getBufferManager().getBuffer({hash:`sel${v.getFieldAssociation()}I${p.getMTime()}`,usage:pe.RawVertex,format:"uint32",interpolation:"flat",nativeArray:x instanceof Uint32Array?x:Uint32Array.from(x)}),["selectId"]):c.removeBufferIfPresent("selectId")}else c.removeBufferIfPresent("selectId")},t.updateTextures=()=>{const a=[],r=[],n=e.renderable.getColorTextureMap?.();n&&!e.colorTexture&&(e.colorTexture=On.newInstance({label:"polyDataColor"})),n&&(e.colorTexture.setInputData(n),r.push(["DiffuseTexture",e.colorTexture]));const s=e.WebGPUActor.getRenderable(),i=e.WebGPURenderer.getRenderable();[["DiffuseTexture",s.getProperty().getDiffuseTexture?.()],["DiffuseTexture",s.getTextures()[0]],["DiffuseTexture",e.colorTexture],["ORMTexture",s.getProperty().getORMTexture?.()],["RMTexture",s.getProperty().getRMTexture?.()],["RoughnessTexture",s.getProperty().getRoughnessTexture?.()],["MetallicTexture",s.getProperty().getMetallicTexture?.()],["NormalTexture",s.getProperty().getNormalTexture?.()],["AmbientOcclusionTexture",s.getProperty().getAmbientOcclusionTexture?.()],["EmissionTexture",s.getProperty().getEmissionTexture?.()],["EnvironmentTexture",i.getEnvironmentTexture?.()]].forEach(([o,c])=>{c&&((c.getInputData()||c.getJsImageData()||c.getCanvas()||c.getImageBitmap())&&r.push([o,c]),c.getImage()&&c.getImageLoaded()&&r.push([o,c]))}),r.forEach(([o,c])=>{const u=e.device.getTextureManager().getTextureForVTKTexture(c,o);if(!u.getReady())return;let p=!1;for(let l=0;l<e.textures.length;++l)if(e.textures[l]===u){p=!0,a[l]=!0;break}if(!p){a[e.textures.length]=!0;const l=u.createView(o);e.textures.push(u),e.textureViews.push(l);const f=c.getInterpolate()?"linear":"nearest";let g=null;c.getEdgeClamp()&&c.getRepeat()?g="mirror-repeat":c.getEdgeClamp()?g="clamp-to-edge":c.getRepeat()&&(g="repeat");let h={addressModeU:g,addressModeV:g,addressModeW:g,minFilter:f,magFilter:f};o==="EnvironmentTexture"&&(h={addressModeU:"repeat",addressModeV:"clamp-to-edge",addressModeW:"repeat",minFilter:f,magFilter:f,mipmapFilter:"linear"}),l.addSampler(e.device,h)}});for(let o=e.textures.length-1;o>=0;o--)a[o]||(e.textures.splice(o,1),e.textureViews.splice(o,1))},t.computePipelineHash=()=>{let a=`pd${e.useRendererMatrix?"r":""}${e.forceZValue?"z":""}`;if(e.depthOnlyPass&&(a+="d"),e.selectionPass&&(a+="s"),e.primitiveType===te.TriangleEdges||e.primitiveType===te.TriangleStripEdges)a+="edge";else{if(e.vertexInput.hasAttribute("normalMC")&&(a+="n"),e.vertexInput.hasAttribute("colorVI")&&(a+="c"),e.vertexInput.hasAttribute("tcoord")){const n=e.vertexInput.getBuffer("tcoord"),s=Nn.getNumberOfComponentsFromBufferFormat(n.getArrayInformation()[0].format);a+=`t${s}`}e.textures.length&&(a+=`tx${e.textures.length}`)}e._usesCellNormals&&(a+="cn"),e.SSBO&&(a+="ssbo");const r=t.getHashFromUsage(e.usage);a+=r,a+=`cm${t.getCullMode()}`,a+=e.renderEncoder.getPipelineHash(),e.pipelineHash=a},t.updateBuffers=()=>{e.primitiveType!==te.TriangleEdges&&e.primitiveType!==te.TriangleStripEdges&&t.updateTextures();const a=e.WebGPUActor.getRenderable(),r=a.getProperty().getRepresentation();e.usage=t.getUsage(r,e.primitiveType),t.buildVertexInput();const n=e.vertexInput.getBuffer("vertexBC");if(t.setNumberOfVertices(n.getSizeInBytes()/n.getStrideInBytes()),t.setTopology(t.getTopologyFromUsage(e.usage)),t.updateUBO(),t.haveWideLines()){const s=a.getProperty();t.setNumberOfInstances(Math.ceil(s.getLineWidth()*2))}else t.setNumberOfInstances(1)}}var Ql={depthOnlyPass:!1,selectionPass:!1,is2D:!1,cellArray:null,currentInput:null,cellOffset:0,primitiveType:0,colorTexture:null,renderEncoder:null,textures:null};function wi(t,e,a={}){Object.assign(e,Ql,a),Ea.extend(t,e,a),e.fragmentShaderTemplate=Zl,e.vertexShaderTemplate=Yl,e._tmpMat3=We(new Float64Array(9)),e.UBO=yt.newInstance({label:"mapperUBO"}),e.UBO.addEntry("BCWCMatrix","mat4x4<f32>"),e.UBO.addEntry("BCSCMatrix","mat4x4<f32>"),e.UBO.addEntry("MCWCNormals","mat4x4<f32>"),e.UBO.addEntry("AmbientColor","vec4<f32>"),e.UBO.addEntry("AmbientColorBF","vec4<f32>"),e.UBO.addEntry("DiffuseColor","vec4<f32>"),e.UBO.addEntry("DiffuseColorBF","vec4<f32>"),e.UBO.addEntry("EdgeColor","vec4<f32>"),e.UBO.addEntry("SpecularColor","vec4<f32>"),e.UBO.addEntry("SpecularColorBF","vec4<f32>"),e.UBO.addEntry("AmbientIntensity","f32"),e.UBO.addEntry("AmbientIntensityBF","f32"),e.UBO.addEntry("DiffuseIntensity","f32"),e.UBO.addEntry("DiffuseIntensityBF","f32"),e.UBO.addEntry("Roughness","f32"),e.UBO.addEntry("RoughnessBF","f32"),e.UBO.addEntry("Metallic","f32"),e.UBO.addEntry("MetallicBF","f32"),e.UBO.addEntry("Ambient","f32"),e.UBO.addEntry("Normal","f32"),e.UBO.addEntry("Emission","f32"),e.UBO.addEntry("EmissionBF","f32"),e.UBO.addEntry("NormalStrength","f32"),e.UBO.addEntry("NormalStrengthBF","f32"),e.UBO.addEntry("BaseIOR","f32"),e.UBO.addEntry("BaseIORBF","f32"),e.UBO.addEntry("SpecularIntensity","f32"),e.UBO.addEntry("SpecularIntensityBF","f32"),e.UBO.addEntry("LineWidth","f32"),e.UBO.addEntry("Opacity","f32"),e.UBO.addEntry("OpacityBF","f32"),e.UBO.addEntry("ZValue","f32"),e.UBO.addEntry("CoincidentFactor","f32"),e.UBO.addEntry("CoincidentOffset","f32"),e.UBO.addEntry("PropID","u32"),e.UBO.addEntry("ClipNear","f32"),e.UBO.addEntry("ClipFar","f32"),e.UBO.addEntry("Time","u32"),Tn(e.UBO,"ClipPlane"),e.UBO.addEntry("NumClipPlanes","u32"),e.UBO.addEntry("BufferShift","vec3<f32>"),ye(t,e,["cellArray","currentInput","cellOffset","is2D","primitiveType","renderEncoder"]),e.textures=[],e.clipPlanes=Array.from({length:6},()=>[0,0,0,0]),Xl(t,e)}var Jl=X(wi,"vtkWebGPUCellArrayMapper"),wt={newInstance:Jl,extend:wi},{PrimitiveTypes:Be}=Ot;function ef(t,e){e.classHierarchy.push("vtkWebGPUPolyDataMapper"),t.createCellArrayMapper=()=>wt.newInstance(),t.buildPass=a=>{if(a){e.WebGPUActor=t.getFirstAncestorOfType("vtkWebGPUActor"),e.renderable.getStatic()||e.renderable.update();const r=e.renderable.getInputData();e.renderable.mapScalars(r,1),t.updateCellArrayMappers(r)}},t.updateCellArrayMappers=a=>{if(!a){un("No input!");return}const r=[a.getVerts(),a.getLines(),a.getPolys(),a.getStrips()],n=[];let s=0;for(let i=Be.Points;i<=Be.TriangleStrips;i++)if(r[i].getNumberOfValues()>0){e.primitives[i]||(e.primitives[i]=t.createCellArrayMapper());const o=e.primitives[i];o.setCellArray(r[i]),o.setCurrentInput(a),o.setCellOffset(s),o.setPrimitiveType(i),o.setRenderable(e.renderable),s+=r[i].getNumberOfCells(),n.push(o)}else e.primitives[i]=null;if(e.WebGPUActor.getRenderable().getProperty().getEdgeVisibility()){if(r[Be.Triangles].getNumberOfValues()>0){const i=Be.TriangleEdges;e.primitives[i]||(e.primitives[i]=t.createCellArrayMapper());const o=e.primitives[i];o.setCellArray(r[Be.Triangles]),o.setCurrentInput(a),o.setCellOffset(e.primitives[Be.Triangles].getCellOffset()),o.setPrimitiveType(i),o.setRenderable(e.renderable),n.push(o)}else e.primitives[Be.TriangleEdges]=null;if(r[Be.TriangleStrips].getNumberOfValues()>0){const i=Be.TriangleStripEdges;e.primitives[i]||(e.primitives[i]=t.createCellArrayMapper());const o=e.primitives[i];o.setCellArray(r[Be.TriangleStrips]),o.setCurrentInput(a),o.setCellOffset(e.primitives[Be.TriangleStrips].getCellOffset()),o.setPrimitiveType(i),o.setRenderable(e.renderable),n.push(o)}else e.primitives[Be.TriangleStripEdges]=null}t.prepareNodes(),t.addMissingChildren(n),t.removeUnusedNodes()}}var tf={primitives:null};function Mi(t,e,a={}){Object.assign(e,tf,a),ee.extend(t,e,a),e.primitives=[],ef(t,e)}var Bi=X(Mi,"vtkWebGPUPolyDataMapper"),Di={newInstance:Bi,extend:Mi};he("vtkMapper",Bi);function Xr(t,e,a=0){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=a,t}function ir(t,e,a){return t[0]=e[0]+a[0],t[1]=e[1]+a[1],t[2]=e[2]+a[2],t[3]=0,t}function rf(t,e,a){return t[0]=e[0]+a[0],t[1]=e[2]+a[1],t[2]=e[4]+a[2],t[3]=0,t}function nf(t,e,a){return t[0]=e[1]+a[0],t[1]=e[3]+a[1],t[2]=e[5]+a[2],t[3]=0,t}var{vtkErrorMacro:Qr}=I;function af(t,e){e.classHierarchy.push("vtkWebGPUCutterCellArrayMapper"),t.replaceShaderPosition=(n,s,i)=>{const o=e.renderable.getSupportedImplicitFunctionName();if(!o){Qr("No cut function set.");return}const c=s.getShaderDescription("vertex");c.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),c.hasOutput("vertexVC")||c.addOutput("vec4<f32>","vertexVC"),c.addOutput("f32","cutDistanceVS");let u=[];e.useRendererMatrix?u=["    var pCoord: vec4<f32> = rendererUBO.SCPCMatrix*mapperUBO.BCSCMatrix*vertexBC;","    output.vertexVC = rendererUBO.SCVCMatrix * mapperUBO.BCSCMatrix * vec4<f32>(vertexBC.xyz, 1.0);"]:u=["    var pCoord: vec4<f32> = mapperUBO.BCSCMatrix*vertexBC;","    pCoord.x = 2.0* pCoord.x / rendererUBO.viewportSize.x - 1.0;","    pCoord.y = 2.0* pCoord.y / rendererUBO.viewportSize.y - 1.0;","    pCoord.z = 0.5 - 0.5 * pCoord.z;","    output.vertexVC = vec4<f32>(0.0);"];let p=["    output.cutDistanceVS = 1.0;"];switch(o){case"vtkPlane":p=["    output.cutDistanceVS = dot(mapperUBO.CutPlaneNormal.xyz, vertexBC.xyz - mapperUBO.CutPlaneOrigin.xyz) - mapperUBO.CutValue;"];break;case"vtkSphere":p=["    let cutSphereDelta: vec3<f32> = vertexBC.xyz - mapperUBO.CutSphereCenter.xyz;","    if (mapperUBO.CutSphereUsesAxisRadii == 1u) {","      let cutSphereNormalizedDelta: vec3<f32> = cutSphereDelta / mapperUBO.CutSphereRadius.xyz;","      output.cutDistanceVS = dot(cutSphereNormalizedDelta, cutSphereNormalizedDelta) - 1.0;","    } else {","      output.cutDistanceVS = dot(cutSphereDelta, cutSphereDelta) - mapperUBO.CutSphereRadius.x * mapperUBO.CutSphereRadius.x;","    }"];break;case"vtkBox":p=["    var cutBoxMinDistance: f32 = -1.0e20;","    var cutBoxDistance: f32 = 0.0;","    var cutBoxInside: bool = true;","    var cutBoxIsDegenerate: bool = false;","    for (var i: i32 = 0; i < 3; i++) {","      let cutBoxLength: f32 = mapperUBO.CutBoxMaxPoint[i] - mapperUBO.CutBoxMinPoint[i];","      var cutBoxDist: f32 = 0.0;","      if (cutBoxLength != 0.0) {","        let cutBoxT: f32 = (vertexBC[i] - mapperUBO.CutBoxMinPoint[i]) / cutBoxLength;","        if (cutBoxT < 0.0) {","          cutBoxInside = false;","          cutBoxDist = mapperUBO.CutBoxMinPoint[i] - vertexBC[i];","        } else if (cutBoxT > 1.0) {","          cutBoxInside = false;","          cutBoxDist = vertexBC[i] - mapperUBO.CutBoxMaxPoint[i];","        } else if (cutBoxT <= 0.5) {","          cutBoxDist = mapperUBO.CutBoxMinPoint[i] - vertexBC[i];","          cutBoxMinDistance = max(cutBoxMinDistance, cutBoxDist);","        } else {","          cutBoxDist = vertexBC[i] - mapperUBO.CutBoxMaxPoint[i];","          cutBoxMinDistance = max(cutBoxMinDistance, cutBoxDist);","        }","      } else {","        // Degenerate axis: box has zero thickness along this dimension","        cutBoxIsDegenerate = true;","        cutBoxDist = abs(vertexBC[i] - mapperUBO.CutBoxMinPoint[i]);","        if (cutBoxDist > 0.0) {","          cutBoxInside = false;","        }","      }","      if (cutBoxDist > 0.0) {","        cutBoxDistance += cutBoxDist * cutBoxDist;","      }","    }","    // Guard against degenerate boxes (zero size on one or more axes)","    let cutDistanceIfInside = select(cutBoxMinDistance, 0.0, cutBoxIsDegenerate);","    output.cutDistanceVS = select(sqrt(cutBoxDistance), cutDistanceIfInside, cutBoxInside);"];break;case"vtkCylinder":p=["    let cutCylinderDelta: vec3<f32> = vertexBC.xyz - mapperUBO.CutCylinderCenter.xyz;","    let cutCylinderAxisLengthSq: f32 = dot(mapperUBO.CutCylinderAxis.xyz, mapperUBO.CutCylinderAxis.xyz);","    let cutCylinderProjection: f32 = dot(mapperUBO.CutCylinderAxis.xyz, cutCylinderDelta);","    let cutCylinderDistWithAxis: f32 = dot(cutCylinderDelta, cutCylinderDelta) - cutCylinderProjection * cutCylinderProjection / cutCylinderAxisLengthSq - mapperUBO.CutCylinderRadius * mapperUBO.CutCylinderRadius;","    let cutCylinderDistWithoutAxis: f32 = dot(cutCylinderDelta, cutCylinderDelta) - mapperUBO.CutCylinderRadius * mapperUBO.CutCylinderRadius;","    output.cutDistanceVS = select(cutCylinderDistWithoutAxis, cutCylinderDistWithAxis, cutCylinderAxisLengthSq > 0.0);"];break;case"vtkCone":p=["    let cutConeDelta: vec3<f32> = vertexBC.xyz - mapperUBO.CutConeApex.xyz;","    let cutConeAxial: f32 = dot(mapperUBO.CutConeAxis.xyz, cutConeDelta);","    let cutConeRadial2: f32 = dot(cutConeDelta, cutConeDelta) - cutConeAxial * cutConeAxial;","    output.cutDistanceVS = cutConeRadial2 - cutConeAxial * cutConeAxial * mapperUBO.CutConeTanThetaSquared;"];break;default:Qr("No cut function set.");break}let l=c.getCode();l=G.substitute(l,"//VTK::Position::Impl",[...u,...p,"//VTK::Position::Impl"]).result,e.forceZValue&&(l=G.substitute(l,"//VTK::Position::Impl",[e.useRendererMatrix?"pCoord = vec4<f32>(pCoord.xyz/pCoord.w, 1.0);":"    pCoord = vec4<f32>(pCoord.xyz/pCoord.w, 1.0);","    pCoord.z = mapperUBO.ZValue;","//VTK::Position::Impl"]).result),t.haveWideLines()&&(c.addBuiltinInput("u32","@builtin(instance_index) instanceIndex"),l=G.substitute(l,"//VTK::Position::Impl",["    var tmpPos: vec4<f32> = pCoord;","    var numSteps: f32 = max(1.0, ceil(mapperUBO.LineWidth - 1.0));","    var offset: f32 = (mapperUBO.LineWidth - 1.0) * (f32(input.instanceIndex / 2u) - numSteps/2.0) / numSteps;","    var tmpPos2: vec3<f32> = tmpPos.xyz / tmpPos.w;","    tmpPos2.x = tmpPos2.x + 2.0 * (f32(input.instanceIndex) % 2.0) * offset / rendererUBO.viewportSize.x;","    tmpPos2.y = tmpPos2.y + 2.0 * (f32(input.instanceIndex + 1u) % 2.0) * offset / rendererUBO.viewportSize.y;","    tmpPos2.z = min(1.0, tmpPos2.z + 0.00001);","    pCoord = vec4<f32>(tmpPos2.xyz * tmpPos.w, tmpPos.w);","//VTK::Position::Impl"]).result),l=G.substitute(l,"//VTK::Position::Impl",["    output.Position = pCoord;"]).result,c.setCode(l);const f=s.getShaderDescription("fragment");l=f.getCode(),l=G.substitute(l,"//VTK::Position::Impl",["  if (abs(input.cutDistanceVS) > max(fwidth(input.cutDistanceVS) * mapperUBO.CutWidth, 1.0e-6)) { discard; }","//VTK::Position::Impl"]).result,l=G.substitute(l,"//VTK::RenderEncoder::Impl",["  let cutterDistanceDx: f32 = dpdx(input.cutDistanceVS);","  let cutterDistanceDy: f32 = dpdy(input.cutDistanceVS);","  let cutterDistanceGradient: f32 = length(vec2<f32>(cutterDistanceDx, cutterDistanceDy));","  if (cutterDistanceGradient <= 0.0 && abs(input.cutDistanceVS) > 1.0e-6) { discard; }","//VTK::RenderEncoder::Impl"]).result,f.setCode(l)},e.shaderReplacements.set("replaceShaderPosition",t.replaceShaderPosition);const a=t.computePipelineHash;t.computePipelineHash=()=>{a();const n=e.renderable.getSupportedImplicitFunctionName()||"none";e.pipelineHash+=`cf${n}Params`};const r=t.updateUBO;t.updateUBO=()=>{r();const n=e.renderable,s=n.getCutFunction(),i=n.getSupportedImplicitFunctionName();if(!i||!s)return;const o=e.WebGPUActor.getBufferShift(e.WebGPURenderer);switch(e.UBO.setValue("CutWidth",Math.max(n.getCutWidth(),0)),i){case"vtkPlane":e.UBO.setArray("CutPlaneOrigin",ir(e.cutPlaneOrigin,s.getOrigin(),o)),e.UBO.setArray("CutPlaneNormal",Xr(e.cutPlaneNormal,s.getNormal())),e.UBO.setValue("CutValue",n.getCutValue());break;case"vtkSphere":{const c=s.getRadius(),u=Array.isArray(c);e.UBO.setArray("CutSphereCenter",ir(e.cutSphereCenter,s.getCenter(),o)),u?(e.cutSphereRadius[0]=c[0],e.cutSphereRadius[1]=c[1],e.cutSphereRadius[2]=c[2]):(e.cutSphereRadius[0]=c,e.cutSphereRadius[1]=c,e.cutSphereRadius[2]=c),e.cutSphereRadius[3]=0,e.UBO.setArray("CutSphereRadius",e.cutSphereRadius),e.UBO.setValue("CutSphereUsesAxisRadii",u?1:0);break}case"vtkBox":{const c=s.getBounds();e.UBO.setArray("CutBoxMinPoint",rf(e.cutBoxMinPoint,c,o)),e.UBO.setArray("CutBoxMaxPoint",nf(e.cutBoxMaxPoint,c,o));break}case"vtkCylinder":e.UBO.setArray("CutCylinderCenter",ir(e.cutCylinderCenter,s.getCenter(),o)),e.UBO.setArray("CutCylinderAxis",Xr(e.cutCylinderAxis,s.getAxis())),e.UBO.setValue("CutCylinderRadius",s.getRadius());break;case"vtkCone":{const c=e.cutConeApex,u=e.cutConeAxis,p=e.cutConeAxisPoint,l=s.getTransform?.()?.getInverse?.();c[0]=0,c[1]=0,c[2]=0,u[0]=1,u[1]=0,u[2]=0,p[0]=1,p[1]=0,p[2]=0,l?.transformPoint?(l.transformPoint(c,c),l.transformPoint(p,p),ue.subtract(p,c,u),ue.norm(u)>0&&ue.normalize(u)):s.getTransform?.()&&Qr("Failed to retrieve inverse transform for cone cut function"),e.UBO.setArray("CutConeApex",ir(e.cutConeApex4,c,o)),e.UBO.setArray("CutConeAxis",Xr(e.cutConeAxis4,u));const f=Math.tan(ue.radiansFromDegrees(s.getAngle()));e.UBO.setValue("CutConeTanThetaSquared",f*f);break}}e.UBO.sendIfNeeded(e.WebGPURenderWindow.getDevice())}}function of(t,e,a={}){wt.extend(t,e,a),e.UBO.addEntry("CutPlaneOrigin","vec4<f32>"),e.UBO.addEntry("CutPlaneNormal","vec4<f32>"),e.UBO.addEntry("CutSphereCenter","vec4<f32>"),e.UBO.addEntry("CutSphereRadius","vec4<f32>"),e.UBO.addEntry("CutBoxMinPoint","vec4<f32>"),e.UBO.addEntry("CutBoxMaxPoint","vec4<f32>"),e.UBO.addEntry("CutCylinderCenter","vec4<f32>"),e.UBO.addEntry("CutCylinderAxis","vec4<f32>"),e.UBO.addEntry("CutConeApex","vec4<f32>"),e.UBO.addEntry("CutConeAxis","vec4<f32>"),e.UBO.addEntry("CutValue","f32"),e.UBO.addEntry("CutWidth","f32"),e.UBO.addEntry("CutCylinderRadius","f32"),e.UBO.addEntry("CutConeTanThetaSquared","f32"),e.UBO.addEntry("CutSphereUsesAxisRadii","u32"),e.cutPlaneOrigin=[0,0,0,0],e.cutPlaneNormal=[0,0,0,0],e.cutSphereCenter=[0,0,0,0],e.cutSphereRadius=[0,0,0,0],e.cutBoxMinPoint=[0,0,0,0],e.cutBoxMaxPoint=[0,0,0,0],e.cutCylinderCenter=[0,0,0,0],e.cutCylinderAxis=[0,0,0,0],e.cutConeApex=[0,0,0],e.cutConeAxis=[1,0,0],e.cutConeAxisPoint=[1,0,0],e.cutConeApex4=[0,0,0,0],e.cutConeAxis4=[1,0,0,0],af(t,e)}var sf=I.newInstance(of,"vtkWebGPUCutterCellArrayMapper");function cf(t,e){e.classHierarchy.push("vtkWebGPUCutterMapper"),t.createCellArrayMapper=()=>sf()}function uf(t,e,a={}){Di.extend(t,e,a),cf(t,e)}var lf=I.newInstance(uf,"vtkWebGPUCutterMapper");he("vtkCutterMapper",lf);function ff(t,e){e.classHierarchy.push("vtkWebGPUGlyph3DCellArrayMapper");const a={...t};t.setGlyphInstances=r=>{e.glyphInstances=r},t.updateBuffers=()=>{a.updateBuffers(),t.setNumberOfInstances(e.glyphInstances)},t.computePipelineHash=()=>{a.computePipelineHash(),e.renderable.getColorArray()&&(e.pipelineHash+="gc")},t.replaceShaderPosition=(r,n,s)=>{const i=n.getShaderDescription("vertex");i.addBuiltinInput("u32","@builtin(instance_index) instanceIndex"),i.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),i.hasOutput("vertexVC")||i.addOutput("vec3<f32>","vertexVC"),i.hasOutput("vertexSC")||i.addOutput("vec4<f32>","vertexSC");let o=i.getCode();o=G.substitute(o,"//VTK::Position::Impl",["    var glyphMC: vec4<f32> = vec4<f32>(vertexBC.xyz - mapperUBO.BufferShift, 1.0);","    var glyphModel: vec4<f32> = glyphSSBO.values[input.instanceIndex].matrix*glyphMC;","    var glyphBC: vec4<f32> = vec4<f32>(glyphModel.xyz + mapperUBO.BufferShift, 1.0);","    output.vertexSC = mapperUBO.BCSCMatrix*glyphBC;","    output.vertexVC = (rendererUBO.SCVCMatrix*output.vertexSC).xyz;","    output.Position = rendererUBO.SCPCMatrix*output.vertexSC;"]).result,i.setCode(o);const c=n.getShaderDescription("fragment");let u=c.getCode();const p=Ur({countName:"mapperUBO.NumClipPlanes",planePrefix:"mapperUBO.ClipPlane",positionName:"input.vertexSC"});u=G.substitute(u,"//VTK::Position::Impl",[...p,"//VTK::Position::Impl"]).result,c.setCode(u)},e.shaderReplacements.set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderNormal=(r,n,s)=>{if(s.hasAttribute("normalMC")){const i=n.getShaderDescription("vertex");let o=i.getCode();o=G.substitute(o,"//VTK::Normal::Impl",["  output.normalVC = normalize((rendererUBO.WCVCNormals"," * mapperUBO.MCWCNormals"," * glyphSSBO.values[input.instanceIndex].normal*normalMC).xyz);"]).result,i.setCode(o)}a.replaceShaderNormal(r,n,s)},e.shaderReplacements.set("replaceShaderNormal",t.replaceShaderNormal),t.replaceShaderColor=(r,n,s)=>{if(!e.renderable.getColorArray()){a.replaceShaderColor(r,n,s);return}const i=n.getShaderDescription("vertex");i.addOutput("vec4<f32>","color");let o=i.getCode();o=G.substitute(o,"//VTK::Color::Impl",["  output.color = glyphSSBO.values[input.instanceIndex].color;"]).result,i.setCode(o);const c=n.getShaderDescription("fragment");o=c.getCode(),o=G.substitute(o,"//VTK::Color::Impl",["ambientColor = input.color;","diffuseColor = input.color;","opacity = mapperUBO.Opacity * input.color.a;"]).result,c.setCode(o)},e.shaderReplacements.set("replaceShaderColor",t.replaceShaderColor),t.replaceShaderSelect=(r,n,s)=>{if(r.includes("sel")){const i=n.getShaderDescription("vertex");i.addOutput("u32","attributeID","flat"),i.addOutput("u32","compositeID","flat");let o=i.getCode();o=G.substitute(o,"//VTK::Select::Impl",["  output.compositeID = input.instanceIndex + 1u;","  output.attributeID = input.instanceIndex + 1u;"]).result,i.setCode(o);const c=n.getShaderDescription("fragment");o=c.getCode(),o=G.substitute(o,"//VTK::Select::Impl",["var compositeID: u32 = input.compositeID;","var attributeID: u32 = input.attributeID;"]).result,c.setCode(o)}},e.shaderReplacements.set("replaceShaderSelect",t.replaceShaderSelect)}function pf(t,e,a={}){Object.assign(e,{},a),wt.extend(t,e,a),ff(t,e)}var gf=X(pf,"vtkWebGPUGlyph3DCellArrayMapper");function df(t,e){e.classHierarchy.push("vtkWebGPUGlyph3DMapper"),t.createCellArrayMapper=()=>{const a=gf();return a.setSSBO(e.SSBO),a.setRenderable(e.renderable),a},t.buildPass=a=>{if(a){e.WebGPUActor=t.getFirstAncestorOfType("vtkWebGPUActor"),e.renderable.getStatic()||e.renderable.update();const r=e.renderable.getInputData(1);e.renderable.mapScalars(r,1),t.updateSSBO(),t.updateCellArrayMappers(r);for(let n=0;n<e.children.length;n++)e.children[n].setGlyphInstances(e.numInstances)}},t.updateSSBO=()=>{e.currentInput=e.renderable.getInputData(1),e.renderable.buildArrays();const a=e.renderable.getMatrixArray(),r=e.renderable.getNormalArray();if(e.carray=e.renderable.getColorArray(),e.numInstances=a.length/16,e.renderable.getBuildTime().getMTime()>e.glyphBOBuildTime.getMTime()){e.WebGPURenderWindow=t.getFirstAncestorOfType("vtkWebGPURenderWindow");const n=e.WebGPURenderWindow.getDevice(),s=Math.max(e.numInstances,1);e.SSBO.clearData(),e.SSBO.setNumberOfInstances(s),e.SSBO.addEntry("matrix","mat4x4<f32>"),e.SSBO.addEntry("normal","mat4x4<f32>"),e.carray&&e.SSBO.addEntry("color","vec4<f32>"),e.numInstances>0?(e.SSBO.setAllInstancesFromArray("matrix",a),e.SSBO.setAllInstancesFromArray3x3To4x4("normal",r),e.carray&&e.SSBO.setAllInstancesFromArrayColorToFloat("color",e.carray.getData())):(e.SSBO.setArray("matrix",0,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),e.SSBO.setArray("normal",0,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),e.carray&&e.SSBO.setArray("color",0,[1,1,1,1])),e.SSBO.send(n),e.glyphBOBuildTime.modified()}}}var hf={};function vf(t,e,a={}){Object.assign(e,hf,a),Di.extend(t,e,a),e.glyphBOBuildTime={},de(e.glyphBOBuildTime,{mtime:0}),e.SSBO=Fa.newInstance({label:"glyphSSBO"}),df(t,e)}var xf=X(vf,"vtkWebGPUGlyph3DMapper");he("vtkGlyph3DMapper",xf);var ie={SINGLE:"single",DEPENDENT_LA:"dependent-la",DEPENDENT_RGB:"dependent-rgb",DEPENDENT_RGBA:"dependent-rgba",INDEPENDENT_1:"independent-1",INDEPENDENT_2:"independent-2",INDEPENDENT_3:"independent-3",INDEPENDENT_4:"independent-4"},Le={IMAGE:0,COLOR_LUT:1,OPACITY_LUT:2,LABEL_OUTLINE_THICKNESS:3,LABEL_OUTLINE_OPACITY:4};function Cf(t,e){const a=t?.getSampler?.();if(!a)return!1;const r=a.getOptions();return r.minFilter===e.minFilter&&r.magFilter===e.magFilter&&r.addressModeU===(e.addressModeU??"clamp-to-edge")&&r.addressModeV===(e.addressModeV??"clamp-to-edge")&&r.addressModeW===(e.addressModeW??"clamp-to-edge")}function Li(t,e){if(t)switch(e){case 1:return ie.INDEPENDENT_1;case 2:return ie.INDEPENDENT_2;case 3:return ie.INDEPENDENT_3;default:return ie.INDEPENDENT_4}switch(e){case 1:return ie.SINGLE;case 2:return ie.DEPENDENT_LA;case 3:return ie.DEPENDENT_RGB;default:return ie.DEPENDENT_RGBA}}function Ge(t,e="tfunRows"){return`${2*t+.5} / ${e}`}function mf(t,e,a){return t.getUseLabelOutline()&&!e&&a===1}function Dr(t,e,a){if(e.apply(t)){const r=t.getIndependentComponents();return`${t.getMTime()}-${r}-${a}`}return"0"}var{vtkErrorMacro:Tf}=me,{SlicingMode:ya}=Wa,Sf=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::Image::Dec

//VTK::Clip::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  //VTK::Clip::Impl

  //VTK::Select::Impl

  //VTK::Image::Sample

  // var computedColor: vec4<f32> = vec4<f32>(1.0,0.7, 0.5, 1.0);

  //VTK::Position::Impl

//VTK::RenderEncoder::Impl

  return output;
}
`,Ve=new Float64Array(16),De=new Float64Array(16),or=new Float64Array(16),sr=new Float64Array(3),cr=new Float64Array(3),He=new Float64Array(4),le=new Float64Array(4);function yf(t,e){e.classHierarchy.push("vtkWebGPUImageMapper"),t.ensureTextureSampler=(n,s)=>{n&&!Cf(n,s)&&n.addSampler(e.device,s)},t.computeImageState=()=>{const n=e.WebGPUImageSlice.getRenderable().getProperty(),s=t.getTextureViews()[Le.IMAGE]?.getTexture().getNumberOfComponents()??1,i=n.getIndependentComponents();return{actorProperty:n,numberOfComponents:s,independentComponents:i,numberOfIComponents:i?s:1,useLabelOutline:mf(n,i,s),textureChannelMode:Li(i,s)}},t.getImageState=()=>e.imageState??t.computeImageState(),t.buildPass=n=>{if(n){e.WebGPUImageSlice=t.getFirstAncestorOfType("vtkWebGPUImageSlice"),e.WebGPURenderer=e.WebGPUImageSlice.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getParent(),e.device=e.WebGPURenderWindow.getDevice();const s=e.WebGPURenderer.getRenderable();e.renderable.getSliceAtFocalPoint()&&e.renderable.setSliceFromCamera(s.getActiveCamera())}},t.translucentPass=n=>{n&&t.render()},t.zBufferPass=n=>{n&&t.render()},t.opaqueZBufferPass=n=>t.zBufferPass(n),t.opaquePass=n=>{n&&t.render()},t.render=()=>{if(e.renderable.update(),e.currentInput=e.renderable.getCurrentImage(),!e.currentInput){Tf("No input!");return}t.prepareToDraw(e.WebGPURenderer.getRenderEncoder()),e.renderEncoder.registerDrawCallback(e.pipeline,t.draw)},t.getCoincidentParameters=()=>e.renderable.getResolveCoincidentTopology()==Vt.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():{factor:0,offset:0},t.computePipelineHash=()=>{const n=e.currentInput.getExtent(),s=t.getImageState();n[0]===n[1]||n[2]===n[3]||n[4]===n[5]?(e.dimensions=2,e.pipelineHash="img2"):(e.dimensions=3,e.pipelineHash="img3"),e.pipelineHash+=s.textureChannelMode,s.useLabelOutline&&(e.pipelineHash+="outline"),e.pipelineHash+=e.renderEncoder.getPipelineHash()},t.updateUBO=()=>{const n=e.UBO.getSendTime(),s=e.WebGPUImageSlice.getRenderable(),i=s.getMapper(),o=e.renderable.getClippingPlanesMTime();if(t.getMTime()>n||e.renderable.getMTime()>n||s.getProperty().getMTime()>n||o>n){const c=i.getCurrentImage(),u=e.WebGPURenderer.getStabilizedCenterByReference();Z(Ve),we(Ve,Ve,u);const p=s.getMatrix();ne(De,p),Se(De,De),q(Ve,De,Ve);const l=c.getWorldToIndex();q(Ve,l,Ve),Se(or,Ve),sr[0]=.5,sr[1]=.5,sr[2]=.5,mr(De,sr),q(Ve,De,Ve);const f=c.getDimensions();Z(De),cr[0]=1/f[0],cr[1]=1/f[1],cr[2]=1/f[2],Pt(De,De,cr),q(Ve,De,Ve),e.UBO.setArray("SCTCMatrix",Ve);const g=e.currentInput.getExtent(),{ijkMode:h}=e.renderable.getClosestIJKAxis();let d=e.renderable.getSlice();h!==e.renderable.getSlicingMode()&&(d=e.renderable.getSliceAtPosition(d));let v=2,x=0,C=1;h===ya.I?(v=0,x=1,C=2):h===ya.J&&(v=1,x=2,C=0),He[v]=d,He[x]=g[x*2]-.5,He[C]=g[C*2]-.5,He[3]=1,Ar(He,He,or),e.UBO.setArray("Origin",He),le[v]=d,le[x]=g[x*2+1]+.5,le[C]=g[C*2]-.5,le[3]=1,Ar(le,le,or),_n(le,le,He),le[3]=1,e.UBO.setArray("Axis1",le),le[v]=d,le[x]=g[x*2]-.5,le[C]=g[C*2+1]+.5,le[3]=1,Ar(le,le,or),_n(le,le,He),le[3]=1,e.UBO.setArray("Axis2",le);const{cScale:T,cShift:m,oScale:w,oShift:O,componentWeight:B}=e;T[0]=1,T[1]=1,T[2]=1,T[3]=1,m[0]=0,m[1]=0,m[2]=0,m[3]=0,w[0]=1,w[1]=1,w[2]=1,w[3]=1,O[0]=0,O[1]=0,O[2]=0,O[3]=0,B[0]=1,B[1]=1,B[2]=1,B[3]=1;const U=e.textureViews[0].getTexture().getScale(),{numberOfComponents:F,independentComponents:D}=t.getImageState(),y=s.getProperty();for(let M=0;M<F;M++){let b=y.getColorWindow(),L=y.getColorLevel();const R=D?M:0,E=y.getRGBTransferFunction(R);if(E&&y.getUseLookupTableScalarRange()){const H=E.getRange();b=H[1]-H[0],L=.5*(H[1]+H[0])}T[M]=U/b,m[M]=-L/b+.5;let k=1,N=0;const $=y.getPiecewiseFunction(R);if($){const H=$.getRange(),z=H[1]-H[0],J=.5*(H[0]+H[1]);k=U/z,N=-J/z+.5}w[M]=k,O[M]=N,B[M]=y.getComponentWeight(M)}e.UBO.setArray("cScale",T),e.UBO.setArray("cShift",m),e.UBO.setArray("oScale",w),e.UBO.setArray("oShift",O),e.UBO.setArray("componentWeight",B),e.UBO.setValue("Opacity",y.getOpacity());const S=t.getCoincidentParameters();e.UBO.setValue("CoincidentFactor",S.factor),e.UBO.setValue("CoincidentOffset",S.offset),e.UBO.setValue("NumClipPlanes",0);const P=e.renderable.getClippingPlanes().length;if(e.UBO.setValue("NumClipPlanes",P),P>0){mr(De,[-u[0],-u[1],-u[2]]),Pa(e.renderable,De,e.clipPlanes);for(let M=0;M<P;M++)e.UBO.setArray(`ClipPlane${M}`,e.clipPlanes[M])}e.UBO.sendIfNeeded(e.device)}},t.updateLUTImage=()=>{const n=t.getImageState(),{actorProperty:s}=n,i=n.numberOfIComponents,o=Dr(s,s.getRGBTransferFunction,i);if(e.colorTextureString!==o){e.numRows=i;const c=e.numRows*2*e.rowLength*4;(!e.colorLUTArray||e.colorLUTArray.length!==c)&&(e.colorLUTArray=new Uint8ClampedArray(c));const u=e.colorLUTArray;let p=s.getRGBTransferFunction();if(p){const l=e.colorTmpTable;for(let f=0;f<i;f++){p=s.getRGBTransferFunction(f);const g=p.getRange();p.getTable(g[0],g[1],e.rowLength,l,1);for(let h=0;h<e.rowLength;h++){const d=f*e.rowLength*8+h*4;u[d]=255*l[h*3],u[d+1]=255*l[h*3+1],u[d+2]=255*l[h*3+2],u[d+3]=255;for(let v=0;v<4;v++)u[d+e.rowLength*4+v]=u[d+v]}}}else for(let l=0;l<e.rowLength;++l){const f=255*l/(e.rowLength-1);u[l*4]=f,u[l*4+1]=f,u[l*4+2]=f,u[l*4+3]=255;for(let g=0;g<4;g++)u[l*4+e.rowLength*4+g]=u[l*4+g]}{const l={nativeArray:u,width:e.rowLength,height:e.numRows*2,depth:1,format:"rgba8unorm"},f=e.device.getTextureManager().getTexture(l).createView("tfunTexture");t.ensureTextureSampler(f,{minFilter:"linear",magFilter:"linear"}),e.textureViews[Le.COLOR_LUT]=f}e.colorTextureString=o}},t.updateOpacityLUTImage=()=>{const n=t.getImageState(),{actorProperty:s}=n,i=n.numberOfIComponents;e.numRows=i;const o=Dr(s,s.getPiecewiseFunction,i);if(e.opacityTextureString!==o){const c=e.numRows*2*e.rowLength;(!e.opacityLUTArray||e.opacityLUTArray.length!==c)&&(e.opacityLUTArray=new Float32Array(c));const u=e.opacityLUTArray,p=e.opacityTmpTable;for(let g=0;g<i;g++){const h=s.getPiecewiseFunction(g);if(!h){const x=g*e.rowLength*2;u.fill(1,x,x+e.rowLength*2);continue}const d=h.getRange();h.getTable(d[0],d[1],e.rowLength,p,1);const v=g*e.rowLength*2;for(let x=0;x<e.rowLength;x++)u[v+x]=p[x],u[v+e.rowLength+x]=p[x]}const l={nativeArray:u,width:e.rowLength,height:e.numRows*2,depth:1,format:"r16float"},f=e.device.getTextureManager().getTexture(l).createView("ofunTexture");t.ensureTextureSampler(f,{minFilter:"linear",magFilter:"linear"}),e.textureViews[Le.OPACITY_LUT]=f,e.opacityTextureString=o}},t.updateLabelOutlineThicknessTexture=()=>{const n=e.WebGPUImageSlice.getRenderable().getProperty().getLabelOutlineThicknessByReference(),s=Math.max(1,e.renderable.getLabelOutlineTextureWidth()),i=`${n.join("-")}-${s}`;if(e.labelOutlineThicknessString!==i){const o=new Uint8Array(s);for(let p=0;p<s;++p)o[p]=typeof n[p]<"u"?n[p]:n[0];const c={nativeArray:o,width:s,height:1,depth:1,format:"r8unorm"},u=e.device.getTextureManager().getTexture(c).createView("labelOutlineTexture");t.ensureTextureSampler(u,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[Le.LABEL_OUTLINE_THICKNESS]=u,e.labelOutlineThicknessString=i}},t.updateLabelOutlineOpacityTexture=()=>{const n=e.WebGPUImageSlice.getRenderable().getProperty().getLabelOutlineOpacity(),s=Array.isArray(n)?n:[n],i=Math.max(1,e.renderable.getLabelOutlineTextureWidth()),o=`${s.join("-")}-${i}`;if(e.labelOutlineOpacityString!==o){const c=new Float32Array(i);for(let l=0;l<i;++l)c[l]=s[l]??s[0];const u={nativeArray:c,width:i,height:1,depth:1,format:"r16float"},p=e.device.getTextureManager().getTexture(u).createView("labelOutlineOpacityTexture");t.ensureTextureSampler(p,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[Le.LABEL_OUTLINE_OPACITY]=p,e.labelOutlineOpacityString=o}};const a=t.updateBuffers;t.updateBuffers=()=>{a();const n=e.device.getTextureManager().getTextureForImageData(e.currentInput),s=e.textureViews;if(!s[Le.IMAGE]||s[Le.IMAGE].getTexture()!==n){const o=n.createView("imgTexture");t.ensureTextureSampler(o,{minFilter:"linear",magFilter:"linear"}),s[Le.IMAGE]=o}e.imageState=t.computeImageState(),t.updateLUTImage(),t.updateOpacityLUTImage(),e.imageState.useLabelOutline?(t.updateLabelOutlineThicknessTexture(),t.updateLabelOutlineOpacityTexture()):e.textureViews.length=Math.min(e.textureViews.length,Le.OPACITY_LUT+1),t.updateUBO();const i=e.WebGPUImageSlice.getRenderable().getProperty().getInterpolationType()===qe.NEAREST?"nearest":"linear";t.ensureTextureSampler(s[Le.IMAGE],{minFilter:i,magFilter:i})};const r=t.getShaderReplacements();t.replaceShaderPosition=(n,s,i)=>{const o=s.getShaderDescription("vertex");o.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),o.addOutput("vec4<f32>","vertexSC");let c=o.getCode();const u=["var pos: vec4<f32> = mapperUBO.Origin +","   (vertexBC.x * 0.5 + 0.5) * mapperUBO.Axis1 + (vertexBC.y * 0.5 + 0.5) * mapperUBO.Axis2;","pos.w = 1.0;"];e.dimensions===2?u.push("var tcoord : vec2<f32> = (mapperUBO.SCTCMatrix * pos).xy;"):u.push("var tcoord : vec3<f32> = (mapperUBO.SCTCMatrix * pos).xyz;"),u.push("output.vertexSC = pos;","pos = rendererUBO.SCPCMatrix * pos;","pos.z = clamp(pos.z - 0.000016 * mapperUBO.CoincidentOffset * pos.w, 0.0, pos.w);","output.tcoordVS = tcoord;","output.Position = pos;"),c=G.substitute(c,"//VTK::Position::Impl",u).result,o.setCode(c)},r.set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderTCoord=(n,s,i)=>{const o=s.getShaderDescription("vertex");e.dimensions===2?o.addOutput("vec2<f32>","tcoordVS"):o.addOutput("vec3<f32>","tcoordVS")},r.set("replaceShaderTCoord",t.replaceShaderTCoord),t.replaceShaderImage=(n,s,i)=>{const o=s.getShaderDescription("fragment");let c=o.getCode();const u=t.getImageState();switch(c=G.substitute(c,"//VTK::Image::Sample",["    var computedColor: vec4<f32> =","      textureSampleLevel(imgTexture, imgTextureSampler, input.tcoordVS, 0.0);","//VTK::Image::Sample"]).result,u.textureChannelMode){case ie.SINGLE:if(u.useLabelOutline){const p=e.dimensions===3?["    let centerCoord: vec3<f32> = input.tcoordVS;","    let stepX: vec3<f32> = dpdx(input.tcoordVS);","    let stepY: vec3<f32> = dpdy(input.tcoordVS);","    let clampMin: vec3<f32> = vec3<f32>(0.0);","    let clampMax: vec3<f32> = vec3<f32>(1.0);"]:["    let centerCoord: vec2<f32> = input.tcoordVS;","    let stepX: vec2<f32> = dpdx(input.tcoordVS);","    let stepY: vec2<f32> = dpdy(input.tcoordVS);","    let clampMin: vec2<f32> = vec2<f32>(0.0);","    let clampMax: vec2<f32> = vec2<f32>(1.0);"];c=G.substitute(c,"//VTK::Image::Sample",[...p,"    let centerValue: f32 = textureSampleLevel(","      imgTexture,","      imgTextureSampler,","      centerCoord,","      0.0).r;","    let segmentIndex: i32 = i32(round(centerValue * 255.0));","    if (segmentIndex == 0) {","      computedColor = vec4<f32>(0.0);","    } else {","      let colorCoord: vec2<f32> = vec2<f32>(","        centerValue * mapperUBO.cScale.r + mapperUBO.cShift.r,","        0.5);","      let tColor: vec4<f32> =","        textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","      let opacityCoord: vec2<f32> = vec2<f32>(","        centerValue * mapperUBO.oScale.r + mapperUBO.oShift.r,","        0.5);","      let scalarOpacity: f32 =","        textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","      let outlineWidth: i32 = i32(textureDimensions(labelOutlineTexture).x);","      let outlineIndex: i32 = clamp(segmentIndex - 1, 0, outlineWidth - 1);","      let outlineCoord: vec2<f32> = vec2<f32>(","        (f32(outlineIndex) + 0.5) / f32(outlineWidth),","        0.5);","      let thicknessValue: f32 = textureSampleLevel(","        labelOutlineTexture,","        labelOutlineTextureSampler,","        outlineCoord,","        0.0).r;","      let outlineOpacity: f32 = textureSampleLevel(","        labelOutlineOpacityTexture,","        labelOutlineOpacityTextureSampler,","        outlineCoord,","        0.0).r;","      let actualThickness: i32 = i32(round(thicknessValue * 255.0));","      var pixelOnBorder: bool = false;","      if (actualThickness > 0) {","        for (var i: i32 = -actualThickness; i <= actualThickness; i++) {","          for (var j: i32 = -actualThickness; j <= actualThickness; j++) {","            if (i == 0 && j == 0) {","              continue;","            }","            let neighborCoord = clamp(","              centerCoord + f32(i) * stepX + f32(j) * stepY,","              clampMin,","              clampMax);","            let neighborValue: f32 = textureSampleLevel(","              imgTexture,","              imgTextureSampler,","              neighborCoord,","              0.0).r;","            if (neighborValue != centerValue) {","              pixelOnBorder = true;","              break;","            }","          }","          if (pixelOnBorder) {","            break;","          }","        }","      }","      if (pixelOnBorder) {","        computedColor = vec4<f32>(tColor.rgb, outlineOpacity);","      } else {","        computedColor = vec4<f32>(","          tColor.rgb,","          scalarOpacity * mapperUBO.Opacity);","      }","    }"]).result}else c=G.substitute(c,"//VTK::Image::Sample",["    let scalar: f32 = computedColor.r;","    var colorCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","    let tColor: vec4<f32> =","      textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","    var opacityCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5);","    let scalarOpacity: f32 =","      textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","    computedColor = vec4<f32>(tColor.rgb, scalarOpacity * mapperUBO.Opacity);"]).result;break;case ie.INDEPENDENT_1:c=G.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    let scalar: f32 = computedColor.r;",`    let rowCoord: f32 = ${Ge(0)};`,"    let colorCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord);","    let tColor: vec4<f32> =","      textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","    computedColor = vec4<f32>(","      tColor.rgb * mapperUBO.componentWeight.r,","      mapperUBO.Opacity);"]).result;break;case ie.INDEPENDENT_2:c=G.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    // Independent component LUT rows are duplicated, so sample the","    // center of row 2 * componentIndex for each component.","    let rawColor: vec4<f32> = computedColor;",`    let rowCoord0: f32 = ${Ge(0)};`,`    let rowCoord1: f32 = ${Ge(1)};`,"    let scalar0: f32 = rawColor.r;","    let scalar1: f32 = rawColor.g;","    let color0: vec3<f32> = mapperUBO.componentWeight.r *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord0),","        0.0).rgb;","    let color1: vec3<f32> = mapperUBO.componentWeight.g *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.cScale.g + mapperUBO.cShift.g, rowCoord1),","        0.0).rgb;","    let weight0: f32 = mapperUBO.componentWeight.r *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.oScale.r + mapperUBO.oShift.r, rowCoord0),","        0.0).r;","    let weight1: f32 = mapperUBO.componentWeight.g *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.oScale.g + mapperUBO.oShift.g, rowCoord1),","        0.0).r;","    let weightSum: f32 = max(weight0 + weight1, 1.0e-6);","    computedColor = vec4<f32>(","      color0 * (weight0 / weightSum) + color1 * (weight1 / weightSum),","      mapperUBO.Opacity);"]).result;break;case ie.INDEPENDENT_3:c=G.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    let rawColor: vec4<f32> = computedColor;",`    let rowCoord0: f32 = ${Ge(0)};`,`    let rowCoord1: f32 = ${Ge(1)};`,`    let rowCoord2: f32 = ${Ge(2)};`,"    let scalar0: f32 = rawColor.r;","    let scalar1: f32 = rawColor.g;","    let scalar2: f32 = rawColor.b;","    let color0: vec3<f32> = mapperUBO.componentWeight.r *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord0),","        0.0).rgb;","    let color1: vec3<f32> = mapperUBO.componentWeight.g *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.cScale.g + mapperUBO.cShift.g, rowCoord1),","        0.0).rgb;","    let color2: vec3<f32> = mapperUBO.componentWeight.b *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.cScale.b + mapperUBO.cShift.b, rowCoord2),","        0.0).rgb;","    let weight0: f32 = mapperUBO.componentWeight.r *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.oScale.r + mapperUBO.oShift.r, rowCoord0),","        0.0).r;","    let weight1: f32 = mapperUBO.componentWeight.g *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.oScale.g + mapperUBO.oShift.g, rowCoord1),","        0.0).r;","    let weight2: f32 = mapperUBO.componentWeight.b *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.oScale.b + mapperUBO.oShift.b, rowCoord2),","        0.0).r;","    let weightSum: f32 = max(weight0 + weight1 + weight2, 1.0e-6);","    computedColor = vec4<f32>(","      color0 * (weight0 / weightSum) + color1 * (weight1 / weightSum) + color2 * (weight2 / weightSum),","      mapperUBO.Opacity);"]).result;break;case ie.INDEPENDENT_4:c=G.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    let rawColor: vec4<f32> = computedColor;",`    let rowCoord0: f32 = ${Ge(0)};`,`    let rowCoord1: f32 = ${Ge(1)};`,`    let rowCoord2: f32 = ${Ge(2)};`,`    let rowCoord3: f32 = ${Ge(3)};`,"    let scalar0: f32 = rawColor.r;","    let scalar1: f32 = rawColor.g;","    let scalar2: f32 = rawColor.b;","    let scalar3: f32 = rawColor.a;","    let color0: vec3<f32> = mapperUBO.componentWeight.r *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord0),","        0.0).rgb;","    let color1: vec3<f32> = mapperUBO.componentWeight.g *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.cScale.g + mapperUBO.cShift.g, rowCoord1),","        0.0).rgb;","    let color2: vec3<f32> = mapperUBO.componentWeight.b *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.cScale.b + mapperUBO.cShift.b, rowCoord2),","        0.0).rgb;","    let color3: vec3<f32> = mapperUBO.componentWeight.a *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar3 * mapperUBO.cScale.a + mapperUBO.cShift.a, rowCoord3),","        0.0).rgb;","    let weight0: f32 = mapperUBO.componentWeight.r *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.oScale.r + mapperUBO.oShift.r, rowCoord0),","        0.0).r;","    let weight1: f32 = mapperUBO.componentWeight.g *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.oScale.g + mapperUBO.oShift.g, rowCoord1),","        0.0).r;","    let weight2: f32 = mapperUBO.componentWeight.b *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.oScale.b + mapperUBO.oShift.b, rowCoord2),","        0.0).r;","    let weight3: f32 = mapperUBO.componentWeight.a *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar3 * mapperUBO.oScale.a + mapperUBO.oShift.a, rowCoord3),","        0.0).r;","    let weightSum: f32 = max(weight0 + weight1 + weight2 + weight3, 1.0e-6);","    computedColor = vec4<f32>(","      color0 * (weight0 / weightSum) + color1 * (weight1 / weightSum) + color2 * (weight2 / weightSum) + color3 * (weight3 / weightSum),","      mapperUBO.Opacity);"]).result;break;case ie.DEPENDENT_LA:c=G.substitute(c,"//VTK::Image::Sample",["    let rawColor: vec4<f32> = computedColor;","    let intensity: f32 = rawColor.r * mapperUBO.cScale.r + mapperUBO.cShift.r;","    let tColor: vec4<f32> =","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(intensity, 0.5), 0.0);","    computedColor = vec4<f32>(","      tColor.rgb,","      rawColor.g * mapperUBO.oScale.r + mapperUBO.oShift.r);"]).result;break;case ie.DEPENDENT_RGB:c=G.substitute(c,"//VTK::Image::Sample",["    let rawColor: vec4<f32> =","      computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","    computedColor = vec4<f32>(","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","      mapperUBO.Opacity);"]).result;break;case ie.DEPENDENT_RGBA:c=G.substitute(c,"//VTK::Image::Sample",["    let rawColor: vec4<f32> =","      computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","    computedColor = vec4<f32>(","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","      rawColor.a);"]).result;break;default:c=G.substitute(c,"//VTK::Image::Sample",["    let scalar: f32 = computedColor.r;","    var colorCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","    computedColor = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);"]).result;break}o.setCode(c)},r.set("replaceShaderImage",t.replaceShaderImage),t.replaceShaderClip=(n,s,i)=>{const o=s.getShaderDescription("fragment");let c=o.getCode();const u=Ur({countName:"mapperUBO.NumClipPlanes",planePrefix:"mapperUBO.ClipPlane",positionName:"input.vertexSC"});c=G.substitute(c,"//VTK::Clip::Impl",[...u,"//VTK::Clip::Impl"]).result,o.setCode(c)},r.set("replaceShaderClip",t.replaceShaderClip),t.replaceShaderCoincidentOffset=(n,s,i)=>{const o=s.getShaderDescription("fragment");if(!o)return;o.addBuiltinInput("vec4<f32>","@builtin(position) fragPos"),o.addBuiltinOutput("f32","@builtin(frag_depth) fragDepth");let c=o.getCode();c=G.substitute(c,"//VTK::Position::Impl",["  var coincidentDepth: f32 = input.fragPos.z;","  if (mapperUBO.CoincidentFactor != 0.0) {","    let cscale = length(vec2<f32>(dpdx(input.fragPos.z), dpdy(input.fragPos.z)));","    coincidentDepth = coincidentDepth - mapperUBO.CoincidentFactor * cscale;","  }","  output.fragDepth = clamp(coincidentDepth, 0.0, 1.0);"]).result,o.setCode(c)},r.set("replaceShaderCoincidentOffset",t.replaceShaderCoincidentOffset),t.replaceShaderSelect=(n,s,i)=>{const o=s.getShaderDescription("fragment");if(!o)return;let c=o.getCode();c=G.substitute(c,"//VTK::Select::Impl",["  var compositeID: u32 = 0u;","  var attributeID: u32 = 0u;"]).result,o.setCode(c)},r.set("replaceShaderSelect",t.replaceShaderSelect)}var Of={imageState:null,rowLength:1024};function Ri(t,e,a={}){Object.assign(e,Of,a),Sn.extend(t,e,a),t.setFragmentShaderTemplate(Sf),e.UBO=yt.newInstance({label:"mapperUBO"}),e.UBO.addEntry("SCTCMatrix","mat4x4<f32>"),e.UBO.addEntry("Origin","vec4<f32>"),e.UBO.addEntry("Axis2","vec4<f32>"),e.UBO.addEntry("Axis1","vec4<f32>"),e.UBO.addEntry("cScale","vec4<f32>"),e.UBO.addEntry("cShift","vec4<f32>"),e.UBO.addEntry("oScale","vec4<f32>"),e.UBO.addEntry("oShift","vec4<f32>"),e.UBO.addEntry("componentWeight","vec4<f32>"),e.UBO.addEntry("Opacity","f32"),e.UBO.addEntry("CoincidentFactor","f32"),e.UBO.addEntry("CoincidentOffset","f32"),Tn(e.UBO,"ClipPlane"),e.UBO.addEntry("NumClipPlanes","u32"),e.lutBuildTime={},de(e.lutBuildTime,{mtime:0}),e.imagemat=Z(new Float64Array(16)),e.imagematinv=Z(new Float64Array(16)),e.cScale=new Float32Array(4),e.cShift=new Float32Array(4),e.oScale=new Float32Array(4),e.oShift=new Float32Array(4),e.componentWeight=new Float32Array(4),e.colorTmpTable=new Float32Array(e.rowLength*3),e.opacityTmpTable=new Float32Array(e.rowLength),e.colorLUTArray=null,e.opacityLUTArray=null,e.clipPlanes=Array.from({length:6},()=>[0,0,0,0]),e.VBOBuildTime={},de(e.VBOBuildTime),yf(t,e)}var Ui=X(Ri,"vtkWebGPUImageMapper"),bf={newInstance:Ui,extend:Ri};he("vtkAbstractImageMapper",Ui);function Vf(t,e){e.classHierarchy.push("vtkWebGPUImageSlice"),t.buildPass=a=>{if(!(!e.renderable||!e.renderable.getVisibility())&&a){if(!e.renderable)return;e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getFirstAncestorOfType("vtkWebGPURenderWindow"),e.propID===void 0&&(e.propID=e.WebGPURenderWindow.getUniquePropID()),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes()}},t.traverseZBufferPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children.forEach(r=>{r.traverse(a)}),t.apply(a,!1))},t.traverseOpaqueZBufferPass=a=>t.traverseOpaquePass(a),t.traverseOpaquePass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children.forEach(r=>{r.traverse(a)}),t.apply(a,!1))},t.traverseTranslucentPass=a=>{!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(a,!0),e.children.forEach(r=>{r.traverse(a)}),t.apply(a,!1))},t.queryPass=(a,r)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;e.renderable.getIsOpaque()?r.incrementOpaqueActorCount():r.incrementTranslucentActorCount()}},t.getBufferShift=a=>(t.getKeyMatrices(a),e.bufferShift),t.getKeyMatrices=a=>{if(Math.max(e.renderable.getMTime(),a.getStabilizedTime())>e.keyMatricesTime.getMTime()){e.renderable.computeMatrix();const r=e.renderable.getMatrix(),n=a.getStabilizedCenterByReference();e.bufferShift[0]=r[3]-n[0],e.bufferShift[1]=r[7]-n[1],e.bufferShift[2]=r[11]-n[2],ne(e.keyMatrices.bcwc,r),e.renderable.getIsIdentity()?Z(e.keyMatrices.normalMatrix):(Ce(e.keyMatrices.normalMatrix,e.keyMatrices.bcwc),e.keyMatrices.normalMatrix[3]=0,e.keyMatrices.normalMatrix[7]=0,e.keyMatrices.normalMatrix[11]=0,Se(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),ne(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix)),we(e.keyMatrices.bcwc,e.keyMatrices.bcwc,[-e.bufferShift[0],-e.bufferShift[1],-e.bufferShift[2]]),we(e.keyMatrices.bcsc,e.keyMatrices.bcwc,[-n[0],-n[1],-n[2]]),e.keyMatricesTime.modified()}return e.keyMatrices}}var wf={bufferShift:void 0,keyMatrixTime:null,keyMatrices:null,propID:void 0};function Mf(t,e,a={}){Object.assign(e,wf,a),ee.extend(t,e,a),e.keyMatricesTime={},de(e.keyMatricesTime,{mtime:0}),e.keyMatrices={normalMatrix:new Float64Array(16),bcwc:new Float64Array(16),bcsc:new Float64Array(16)},e.keyMatrixTime={},de(e.keyMatrixTime,{mtime:0}),e.keyMatrices={mcwc:Z(new Float64Array(16))},e.bufferShift=[0,0,0,0],pt(t,e,["propID","keyMatricesTime"]),Vf(t,e)}var Bf=X(Mf,"vtkWebGPUImageSlice");he("vtkImageSlice",Bf);function Df(t,e){e.classHierarchy.push("vtkWebGPUPixelSpaceCallbackMapper"),t.opaquePass=(a,r)=>{e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getParent();const n=e.WebGPURenderer.getAspectRatio(),s=e.WebGPURenderer?e.WebGPURenderer.getRenderable().getActiveCamera():null,i=e.WebGPURenderer.getTiledSizeAndOrigin(),o=null;e.renderable.getUseZValues(),e.renderable.invokeCallback(e.renderable.getInputData(),s,n,i,o)}}var Lf={};function Rf(t,e,a={}){Object.assign(e,Lf,a),ee.extend(t,e,a),Df(t,e)}var Uf=I.newInstance(Rf,"vtkWebGPUPixelSpaceCallbackMapper");he("vtkPixelSpaceCallbackMapper",Uf);var{PrimitiveTypes:Oa}=Ot;function kf(t,e){e.classHierarchy.push("vtkWebGPUPolyDataMapper2D"),t.createCellArrayMapper=()=>wt.newInstance(),t.buildPass=a=>{if(a){e.WebGPUActor=t.getFirstAncestorOfType("vtkWebGPUActor2D"),e.renderable.getStatic()||e.renderable.update();const r=e.renderable.getInputData();e.renderable.mapScalars(r,1),t.updateCellArrayMappers(r)}},t.updateCellArrayMappers=a=>{const r=[a.getVerts(),a.getLines(),a.getPolys(),a.getStrips()],n=[];let s=0;for(let i=Oa.Points;i<=Oa.Triangles;i++)if(r[i].getNumberOfValues()>0){e.primitives[i]||(e.primitives[i]=t.createCellArrayMapper());const o=e.primitives[i];o.setCellArray(r[i]),o.setCurrentInput(a),o.setCellOffset(s),o.setPrimitiveType(i),o.setRenderable(e.renderable),o.setIs2D(!0),s+=r[i].getNumberOfCells(),n.push(o)}else e.primitives[i]=null;t.prepareNodes(),t.addMissingChildren(n),t.removeUnusedNodes()}}function Ef(t){return{primitives:[],...t}}function Pf(t,e,a={}){Object.assign(e,Ef(a)),ee.extend(t,e,a),e.primitives=[],kf(t,e)}var Ff=X(Pf,"vtkWebGPUPolyDataMapper2D");he("vtkMapper2D",Ff);var If=`
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

  var computedColor: vec4<f32> = mapperUBO.BackgroundColor;

  //VTK::RenderEncoder::Impl
  return output;
}
`,Nf=`
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

  let t = clamp(input.tcoordVS.y, 0.0, 1.0);
  var computedColor: vec4<f32> = mix(mapperUBO.BackgroundColor2, mapperUBO.BackgroundColor, t);

  //VTK::RenderEncoder::Impl
  return output;
}
`,Gf=`
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

  var computedColor: vec4<f32> = textureSampleLevel(BackgroundTexture, BackgroundTextureSampler, input.tcoordVS, 0.0);

  //VTK::RenderEncoder::Impl
  return output;
}
`,Af=`
fn vecToRectCoord(dir: vec3<f32>) -> vec2<f32> {
  var tau: f32 = 6.28318530718;
  var pi: f32 = 3.14159265359;
  var out: vec2<f32> = vec2<f32>(0.0);

  out.x = atan2(dir.z, dir.x) / tau;
  out.x += 0.5;

  var phix: f32 = length(vec2(dir.x, dir.z));
  out.y = atan2(dir.y, phix) / pi + 0.5;

  return out;
}

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

  var tcoord: vec4<f32> = vec4<f32>(input.vertexVC.xy, -1, 1);
  var V: vec4<f32> = normalize(mapperUBO.FSQMatrix * tcoord);
  var background = textureSampleLevel(EnvironmentTexture, EnvironmentTextureSampler, vecToRectCoord(V.xyz), 0.0);
  var computedColor: vec4<f32> = vec4<f32>(background.rgb, 1.0);

  //VTK::RenderEncoder::Impl
  return output;
}
`,ur=new Float64Array(16),ba=new Float64Array(16);function _f(t,e){e.classHierarchy.push("vtkWebGPUBackground"),t.getMode=a=>{if(a.getTexturedBackground?.()&&a.getBackgroundTexture?.().getImageLoaded?.())return{mode:"texture",texture:a.getBackgroundTexture(),textureName:"BackgroundTexture",pipelineHash:"backgroundTexture"};if(a.getUseEnvironmentTextureAsBackground?.()&&a.getEnvironmentTexture?.().getImageLoaded?.())return{mode:"environment",texture:a.getEnvironmentTexture(),textureName:"EnvironmentTexture",pipelineHash:"backgroundEnvironment"};const r=a.getGradientBackground?.(),n=a.getBackgroundByReference?.()??[0,0,0],s=a.getBackground2ByReference?.()??[0,0,0];return r&&!no(n,s)?{mode:"gradient",texture:null,textureName:null,pipelineHash:"backgroundGradient"}:{mode:"solid",texture:null,textureName:null,pipelineHash:"backgroundSolid"}},t.ensureQuad=a=>{e.quad||(e.quad=Sn.newInstance(),e.quad.setDevice(a),e.UBO=yt.newInstance({label:"mapperUBO"}),e.UBO.addEntry("FSQMatrix","mat4x4<f32>"),e.UBO.addEntry("BackgroundColor","vec4<f32>"),e.UBO.addEntry("BackgroundColor2","vec4<f32>"),e.quad.setUBO(e.UBO))},t.getFragmentTemplate=a=>{switch(a){case"gradient":return Nf;case"texture":return Gf;case"environment":return Af;default:return If}},t.updateTexture=(a,r,n)=>{if(!r||!n){e.quad.setTextureViews([]);return}const s=a.getTextureManager().getTextureForVTKTexture(r,n);if(!s.getReady()){e.quad.setTextureViews([]);return}const i=s.createView(n),o=r.getInterpolate?.()?"linear":"nearest";let c={minFilter:o,magFilter:o};n==="EnvironmentTexture"&&(c={addressModeU:"repeat",addressModeV:"clamp-to-edge",addressModeW:"repeat",minFilter:o,magFilter:o,mipmapFilter:"linear"}),i.addSampler(a,c),e.quad.setTextureViews([i])},t.updateUBO=(a,r,n)=>{const s=n.getBackgroundByReference?.()??[0,0,0],i=n.getBackground2ByReference?.()??[0,0,0];e.UBO.setArray("BackgroundColor",[s[0],s[1],s[2],1]),e.UBO.setArray("BackgroundColor2",[i[0],i[1],i[2],1]);const o=e.webgpuCamera.getKeyMatrices(r);ne(ba,o.normalMatrix),pn(ur,o.scvc,o.pcsc),pn(ur,ba,ur),e.UBO.setArray("FSQMatrix",ur),e.UBO.sendIfNeeded(a)},t.render=(a,r)=>{const n=r.getRenderable(),s=r.getParent().getDevice();t.ensureQuad(s),e.webgpuCamera=r.getViewNodeFor(n.getActiveCamera(),e.webgpuCamera);const{mode:i,texture:o,textureName:c,pipelineHash:u}=t.getMode(n);e.quad.setPipelineHash(u),e.quad.setFragmentShaderTemplate(t.getFragmentTemplate(i)),t.updateTexture(s,o,c),t.updateUBO(s,r,n),e.quad.prepareAndDraw(a)}}var Wf={quad:null,UBO:null,webgpuCamera:null};function ki(t,e,a={}){Object.assign(e,Wf,a),I.obj(t,e),_f(t,e)}var zf=I.newInstance(ki,"vtkWebGPUBackground"),$f={newInstance:zf,extend:ki},{vtkDebugMacro:Kf}=me;function Hf(t){return t.getPositional()?t.getConeAngle()>=90?0:2:1}function jf(t,e){e.classHierarchy.push("vtkWebGPURenderer"),t.buildPass=a=>{if(a){if(!e.renderable)return;e.camera=e.renderable.getActiveCamera(),t.updateLights(),t.prepareNodes(),t.addMissingNode(e.camera),t.addMissingNodes(e.renderable.getViewPropsWithNestedProps()),t.removeUnusedNodes(),e.webgpuCamera=t.getViewNodeFor(e.camera,e.webgpuCamera),t.updateStabilizedMatrix()}},t.updateStabilizedMatrix=()=>{const a=e.camera.getClippingRange(),r=e.camera.getPositionByReference(),n=e.camera.getDirectionOfProjectionByReference(),s=[],i=[];Ae(i,n,.5*(a[0]+a[1])),Ut(s,r,i),lo(i,s,e.stabilizedCenter),fo(i)/(a[1]-a[0])>e.recenterThreshold&&(e.stabilizedCenter=s,e.stabilizedTime.modified())},t.updateLights=()=>{let a=0;const r=e.renderable.getLightsByReference();for(let n=0;n<r.length;++n)r[n].getSwitch()>0&&a++;return a||(Kf("No lights are on, creating one."),e.renderable.createLight()),a},t.updateUBO=()=>{const a=e.UBO.getSendTime();if(e._parent.getMTime()>a||t.getMTime()>a||e.camera.getMTime()>a||e.renderable.getMTime()>a){const r=e.webgpuCamera.getKeyMatrices(t);e.UBO.setArray("WCVCMatrix",r.wcvc),e.UBO.setArray("SCPCMatrix",r.scpc),e.UBO.setArray("PCSCMatrix",r.pcsc),e.UBO.setArray("SCVCMatrix",r.scvc),e.UBO.setArray("VCPCMatrix",r.vcpc),e.UBO.setArray("WCVCNormals",r.normalMatrix),e.UBO.setValue("LightCount",e.renderable.getLights().filter(i=>i.getSwitch()>0).length),e.UBO.setValue("MaxEnvironmentMipLevel",e.renderable.getEnvironmentTexture()?.getMipLevel()),e.UBO.setValue("BackgroundDiffuseStrength",e.renderable.getEnvironmentTextureDiffuseStrength()),e.UBO.setValue("BackgroundSpecularStrength",e.renderable.getEnvironmentTextureSpecularStrength());const n=t.getYInvertedTiledSizeAndOrigin();e.UBO.setArray("viewportSize",[n.usize,n.vsize]),e.UBO.setValue("cameraParallel",e.camera.getParallelProjection());const s=e._parent.getDevice();e.UBO.sendIfNeeded(s)}},t.updateSSBO=()=>{const a=e.renderable.getLights().filter(s=>s.getSwitch()>0),r=e.webgpuCamera.getKeyMatrices(t);let n=`${e.renderable.getMTime()}`;for(let s=0;s<a.length;s++)n+=a[s].getMTime();if(n!==e.lightTimeString){const s=new Float32Array(a.length*4),i=new Float32Array(a.length*4),o=new Float32Array(a.length*4),c=new Float32Array(a.length*4),u=new Float32Array(a.length*4);for(let l=0;l<a.length;l++){const f=l*4,g=a[l].getPosition();Te(g,g,r.wcvc),s[f]=g[0],s[f+1]=g[1],s[f+2]=g[2],s[f+3]=0,i[f]=-a[l].getDirection()[0],i[f+1]=-a[l].getDirection()[1],i[f+2]=-a[l].getDirection()[2],i[f+3]=0,o[f]=a[l].getColor()[0],o[f+1]=a[l].getColor()[1],o[f+2]=a[l].getColor()[2],o[f+3]=a[l].getIntensity()*5,c[f]=Hf(a[l]),c[f+1]=Math.cos(Cr(a[l].getConeAngle())),c[f+2]=Math.cos(Cr(a[l].getConeAngle()+a[l].getConeFalloff())),c[f+3]=0;const h=a[l].getAttenuationValues();u[f]=h[0],u[f+1]=h[1],u[f+2]=h[2],u[f+3]=a[l].getExponent()}e.SSBO.clearData(),e.SSBO.setNumberOfInstances(a.length),e.SSBO.addEntry("LightPos","vec4<f32>"),e.SSBO.addEntry("LightDir","vec4<f32>"),e.SSBO.addEntry("LightColor","vec4<f32>"),e.SSBO.addEntry("LightData","vec4<f32>"),e.SSBO.addEntry("LightAttenuation","vec4<f32>"),e.SSBO.setAllInstancesFromArray("LightPos",s),e.SSBO.setAllInstancesFromArray("LightDir",i),e.SSBO.setAllInstancesFromArray("LightColor",o),e.SSBO.setAllInstancesFromArray("LightData",c),e.SSBO.setAllInstancesFromArray("LightAttenuation",u);const p=e._parent.getDevice();e.SSBO.send(p)}e.lightTimeString=n},t.scissorAndViewport=a=>{const r=t.getYInvertedTiledSizeAndOrigin();a.getHandle().setViewport(r.lowerLeftU,r.lowerLeftV,r.usize,r.vsize,0,1),a.getHandle().setScissorRect(r.lowerLeftU,r.lowerLeftV,r.usize,r.vsize)},t.bindUBO=a=>{a.activateBindGroup(e.bindGroup)},t.opaquePass=a=>{a?(e.renderEncoder.begin(e._parent.getCommandEncoder()),t.updateUBO(),t.updateSSBO()):(t.scissorAndViewport(e.renderEncoder),t.clear(),e.renderEncoder.end())},t.zBufferPass=a=>{a?(e.renderEncoder.begin(e._parent.getCommandEncoder()),t.updateUBO(),t.updateSSBO()):(t.scissorAndViewport(e.renderEncoder),e.renderEncoder.end())},t.opaqueZBufferPass=a=>t.zBufferPass(a),t.clear=()=>{e.renderable.getTransparent()||e.suppressClear||e.background.render(e.renderEncoder,t)},t.translucentPass=a=>{a?e.renderEncoder.begin(e._parent.getCommandEncoder()):(t.scissorAndViewport(e.renderEncoder),e.renderEncoder.end())},t.volumeDepthRangePass=a=>{a?e.renderEncoder.begin(e._parent.getCommandEncoder()):(t.scissorAndViewport(e.renderEncoder),e.renderEncoder.end())},t.getAspectRatio=()=>{const a=e._parent.getSizeByReference(),r=e.renderable.getViewportByReference();return a[0]*(r[2]-r[0])/((r[3]-r[1])*a[1])},t.convertToOpenGLDepth=a=>e.webgpuCamera.convertToOpenGLDepth(a),t.getYInvertedTiledSizeAndOrigin=()=>{const a=t.getTiledSizeAndOrigin();return a.lowerLeftV=e._parent.getSizeByReference()[1]-a.vsize-a.lowerLeftV,a},t.getTiledSizeAndOrigin=()=>{const a=e.renderable.getViewportByReference(),r=[0,0,1,1],n=a[0]-r[0],s=a[1]-r[1],i=e._parent.normalizedDisplayToDisplay(n,s),o=Math.round(i[0]),c=Math.round(i[1]),u=a[2]-r[0],p=a[3]-r[1],l=e._parent.normalizedDisplayToDisplay(u,p);let f=Math.round(l[0])-o,g=Math.round(l[1])-c;return f<0&&(f=0),g<0&&(g=0),{usize:f,vsize:g,lowerLeftU:o,lowerLeftV:c}},t.getPropFromID=a=>{for(let r=0;r<e.children.length;r++)if((e.children[r].getPropID?e.children[r].getPropID():-1)===a)return e.children[r];return null},t.getStabilizedTime=()=>e.stabilizedTime.getMTime(),t.releaseGraphicsResources=()=>{e.selector!==null&&e.selector.releaseGraphicsResources(),e.clearFSQ?.releaseGraphicsResources?.(),e.clearFSQ=null,e.bindGroup.releaseGraphicsResources?.(),e.UBO.releaseGraphicsResources?.(),e.SSBO.releaseGraphicsResources?.(),e.renderEncoder=null,e.backgroundTexLoaded=!1}}var qf={bindGroup:null,selector:null,renderEncoder:null,recenterThreshold:20,suppressClear:!1,stabilizedCenter:[0,0,0]};function Yf(t,e,a={}){Object.assign(e,qf,a),ee.extend(t,e,a),e.UBO=yt.newInstance({label:"rendererUBO"}),e.UBO.addEntry("WCVCMatrix","mat4x4<f32>"),e.UBO.addEntry("SCPCMatrix","mat4x4<f32>"),e.UBO.addEntry("PCSCMatrix","mat4x4<f32>"),e.UBO.addEntry("SCVCMatrix","mat4x4<f32>"),e.UBO.addEntry("VCPCMatrix","mat4x4<f32>"),e.UBO.addEntry("WCVCNormals","mat4x4<f32>"),e.UBO.addEntry("viewportSize","vec2<f32>"),e.UBO.addEntry("LightCount","i32"),e.UBO.addEntry("MaxEnvironmentMipLevel","f32"),e.UBO.addEntry("BackgroundDiffuseStrength","f32"),e.UBO.addEntry("BackgroundSpecularStrength","f32"),e.UBO.addEntry("cameraParallel","u32"),e.SSBO=Fa.newInstance({label:"rendererLightSSBO"}),e.lightTimeString="",e.bindGroup=Hi.newInstance({label:"rendererBG"}),e.bindGroup.setBindables([e.UBO,e.SSBO]),e.background=$f.newInstance(),e.tmpMat4=Z(new Float64Array(16)),e.stabilizedTime={},de(e.stabilizedTime,{mtime:0}),pt(t,e,["bindGroup","stabilizedTime"]),ao(t,e,["stabilizedCenter"]),ye(t,e,["renderEncoder","selector","suppressClear","UBO"]),jf(t,e)}var Zf=X(Yf,"vtkWebGPURenderer");he("vtkRenderer",Zf);function Xf(t,e){e.classHierarchy.push("vtkWebGPUScalarBarActor"),t.buildPass=a=>{a&&(e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getParent(),e.scalarBarActorHelper.getRenderable()||e.scalarBarActorHelper.setRenderable(e.renderable),t.prepareNodes(),t.addMissingNode(e.scalarBarActorHelper.getBarActor()),t.addMissingNode(e.scalarBarActorHelper.getTmActor()),t.removeUnusedNodes())},t.opaquePass=(a,r)=>{if(a){const n=e.WebGPURenderer?e.WebGPURenderer.getRenderable().getActiveCamera():null,s=e.WebGPURenderer.getTiledSizeAndOrigin();e.scalarBarActorHelper.updateAPISpecificData([s.usize,s.vsize],n,e.WebGPURenderWindow.getRenderable())}}}var Qf={};function Jf(t,e,a={}){Object.assign(e,Qf,a),ee.extend(t,e,a),e.scalarBarActorHelper=mi.newScalarBarActorHelper(),Xf(t,e)}var ep=X(Jf,"vtkWebGPUScalarBarActor");he("vtkScalarBarActor",ep);var{VtkDataTypes:it}=ce,{vtkErrorMacro:tp}=I,rp=`
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

  var computedColor: vec4<f32> = textureSampleLevel(sbtexture, sbtextureSampler, input.tcoordVS, 0.0);

  //VTK::RenderEncoder::Impl
  return output;
}
`,np=`
fn remapCubeCoord(dir: vec3<f32>) -> vec3<f32> {
  var tc = normalize(dir);
  if (abs(tc.z) < max(abs(tc.x), abs(tc.y))) {
    tc = vec3<f32>(1.0, 1.0, -1.0) * tc;
  } else {
    tc = vec3<f32>(-1.0, 1.0, 1.0) * tc;
  }
  return tc;
}

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

  let clipPos = vec4<f32>(input.vertexVC.xy, 1.0, 1.0);
  let worldPos = mapperUBO.IMCPCMatrix * clipPos;
  let direction = remapCubeCoord(worldPos.xyz / worldPos.w - mapperUBO.CameraPosition.xyz);
  var computedColor: vec4<f32> = textureSampleLevel(sbtexture, sbtextureSampler, direction, 0.0);

  //VTK::RenderEncoder::Impl
  return output;
}
`,Va=new Float64Array(16);function ap(t){const e=t.getNumberOfComponents();let a="rgba";switch(e===1?a="r":e===2&&(a="rg"),t.getDataType()){case it.UNSIGNED_CHAR:return`${a}8unorm`;case it.FLOAT:case it.UNSIGNED_INT:case it.INT:case it.DOUBLE:case it.UNSIGNED_SHORT:case it.SHORT:default:return`${a}16float`}}function ip(t,e,a,r){const n=I.newTypedArray(t.constructor.name,t.length),s=e*r;for(let i=0;i<a;++i){const o=i*s,c=(a-i-1)*s;n.set(t.subarray(c,c+s),o)}return n}function op(t,e){e.classHierarchy.push("vtkWebGPUSkybox");function a(n){return n.getInterpolate?.()?"linear":"nearest"}function r(n,s,i,o){const c=a(s);if(o==="background"){if(e.backgroundTextureView&&e.backgroundWebGPUTexture===i&&e.backgroundInterpolate===c)return e.backgroundTextureView;const p=i.createView("sbtexture");return p.addSampler(n,{minFilter:c,magFilter:c}),e.backgroundWebGPUTexture=i,e.backgroundInterpolate=c,e.backgroundTextureView=p,p}if(e.boxTextureView&&e.boxWebGPUTexture===i&&e.boxInterpolate===c)return e.boxTextureView;const u=i.createView("sbtexture",{dimension:"cube"});return u.addSampler(n,{addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge",minFilter:c,magFilter:c}),e.boxWebGPUTexture=i,e.boxInterpolate=c,e.boxTextureView=u,u}t.buildPass=n=>{if(n&&(e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer?.getFirstAncestorOfType("vtkWebGPURenderWindow"),e.WebGPURenderer)){const s=e.WebGPURenderer.getRenderable();e.webgpuCamera=e.WebGPURenderer.getViewNodeFor(s.getActiveCamera(),e.webgpuCamera)}},t.queryPass=(n,s)=>{if(n){if(!e.renderable||!e.renderable.getVisibility())return;s.incrementOpaqueActorCount()}},t.ensureQuad=n=>{if(e.quad)return;e.quad=Sn.newInstance(),e.quad.setDevice(n),e.quad.setWebGPURenderer(e.WebGPURenderer),e.UBO=yt.newInstance({label:"mapperUBO"}),e.UBO.addEntry("IMCPCMatrix","mat4x4<f32>"),e.UBO.addEntry("CameraPosition","vec4<f32>"),e.quad.setUBO(e.UBO);const s=(i,o)=>{const c=o.getShaderDescription("vertex");c.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),c.hasOutput("vertexVC")||c.addOutput("vec4<f32>","vertexVC"),c.hasOutput("tcoordVS")||c.addOutput("vec2<f32>","tcoordVS");let u=c.getCode();u=G.substitute(u,"//VTK::Position::Impl",["output.tcoordVS = vec2<f32>(vertexBC.x * 0.5 + 0.5, vertexBC.y * 0.5 + 0.5);","output.Position = vec4<f32>(vertexBC.x, vertexBC.y, 1.0, 1.0);","output.vertexVC = vec4<f32>(vertexBC.x, vertexBC.y, 1.0, 1.0);"]).result,c.setCode(u)};e.quad.getShaderReplacements().set("replaceShaderPosition",s)},t.getTexture=()=>e.renderable.getTextures?.()?.[0]??null,t.getCubeTextureHash=n=>{let s=`${n.getMTime()}-skybox-cube`;for(let i=0;i<6;i++){const o=n.getInputData(i);if(!o)return null;s+=`-${o.getMTime()}`;const c=o.getPointData().getScalars();c&&(s+=`-${c.getMTime()}`)}return s},t.getCubeTexture=(n,s)=>{const i=t.getCubeTextureHash(s);return i?n.getCachedObject(i,()=>{const o=s.getInputData(0),c=o.getPointData().getScalars(),u=o.getDimensions(),p=ji.newInstance({label:"sbtexture"});p.create(n,{width:u[0],height:u[1],depth:6,dimension:"2d",format:ap(c)});for(let l=0;l<6;l++){const f=s.getInputData(l),g=f.getDimensions(),h=f.getPointData().getScalars(),d=ip(h.getData(),g[0],g[1],h.getNumberOfComponents());p.writeImageData({nativeArray:d,width:g[0],height:g[1],depth:1,originZ:l})}return p}):null},t.updateTexture=n=>{const s=t.getTexture();if(!s)return e.quad.setTextureViews([]),!1;if(e.renderable.getFormat()==="background"){const i=n.getTextureManager().getTextureForVTKTexture(s,"sbtexture");if(!i.getReady())return e.quad.setTextureViews([]),!1;const o=r(n,s,i,"background");return e.quad.setTextureViews([o]),!0}if(e.renderable.getFormat()==="box"){const i=t.getCubeTexture(n,s);if(!i?.getReady())return e.quad.setTextureViews([]),!1;const o=r(n,s,i,"box");return e.quad.setTextureViews([o]),!0}return tp(`Unsupported vtkSkybox format ${e.renderable.getFormat()}`),e.quad.setTextureViews([]),!1},t.updateUBO=n=>{const s=e.WebGPURenderer.getRenderable().getActiveCamera(),i=e.webgpuCamera.getKeyMatrices(e.WebGPURenderer),o=e.WebGPURenderer.getStabilizedCenterByReference();Ce(Va,i.pcsc),e.UBO.setArray("IMCPCMatrix",Va),e.UBO.setArray("CameraPosition",[s.getPositionByReference()[0]-o[0],s.getPositionByReference()[1]-o[1],s.getPositionByReference()[2]-o[2],1]),e.UBO.sendIfNeeded(n)},t.releaseGraphicsResources=()=>{e.quad?.releaseGraphicsResources?.(),e.quad=null,e.UBO=null,e.backgroundTextureView=null,e.backgroundWebGPUTexture=null,e.backgroundInterpolate=null,e.boxTextureView=null,e.boxWebGPUTexture=null,e.boxInterpolate=null,e.lastFormat=null,e.webgpuCamera=null,e.WebGPURenderer=null,e.WebGPURenderWindow=null},t.opaquePass=n=>{if(!n||!e.renderable||!e.renderable.getVisibility()||e.WebGPURenderer?.getSelector())return;const s=e.WebGPURenderWindow.getDevice();t.ensureQuad(s),e.quad.setWebGPURenderer(e.WebGPURenderer);const i=e.renderable.getFormat();e.lastFormat!==i&&(e.quad.setPipelineHash(`skybox-${i}`),e.quad.setFragmentShaderTemplate(i==="background"?rp:np),e.lastFormat=i),t.updateTexture(s)&&(t.updateUBO(s),e.quad.prepareToDraw(e.WebGPURenderer.getRenderEncoder()),e.quad.registerDrawCallback(e.WebGPURenderer.getRenderEncoder()))}}var sp={backgroundInterpolate:null,backgroundTextureView:null,backgroundWebGPUTexture:null,boxInterpolate:null,boxTextureView:null,boxWebGPUTexture:null,lastFormat:null,quad:null,UBO:null,webgpuCamera:null,WebGPURenderer:null,WebGPURenderWindow:null};function cp(t,e,a={}){Object.assign(e,sp,a),ee.extend(t,e,a),op(t,e)}var up=I.newInstance(cp,"vtkWebGPUSkybox");he("vtkSkybox",up);var{BufferUsage:Jr}=Ot,{vtkErrorMacro:lp}=me,fp=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::Color::Dec

//VTK::IOStructs::Dec

@vertex
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : vertexOutput;

  var vertexVC: vec4<f32> = rendererUBO.SCVCMatrix * mapperUBO.BCSCMatrix * vec4<f32>(vertexBC.xyz, 1.0);

  //VTK::Color::Impl

  // compute the projected vertex position
  output.centerVC = vertexVC.xyz;
  output.radiusVC = length(offsetMC)*0.5;

  // make the triangle face the camera
  if (rendererUBO.cameraParallel == 0u)
    {
    var dir: vec3<f32> = normalize(-vertexVC.xyz);
    var base2: vec3<f32> = normalize(cross(dir,vec3<f32>(1.0,0.0,0.0)));
    var base1: vec3<f32> = cross(base2,dir);
    dir = vertexVC.xyz + offsetMC.x*base1 + offsetMC.y*base2;
    vertexVC = vec4<f32>(dir, 1.0);
    }
  else
    {
    // add in the offset
    var tmp2: vec2<f32> = vertexVC.xy + offsetMC;
    vertexVC = vec4<f32>(tmp2, vertexVC.zw);
    }

  output.vertexVC = vec4<f32>(vertexVC.xyz, 0.0);

  //VTK::Position::Impl

  return output;
}
`;function pp(t,e){e.classHierarchy.push("vtkWebGPUSphereMapper");const a=t.buildPass;t.buildPass=r=>{if(r){e.renderable.getStatic()||e.renderable.update();const n=e.renderable.getInputData();t.setCellArray(n.getVerts()),t.setCurrentInput(n)}a(r)},t.replaceShaderNormal=(r,n,s)=>{const i=n.getShaderDescription("vertex");i.hasOutput("vertexVC")||i.addOutput("vec4<f32>","vertexVC"),i.addOutput("vec3<f32>","centerVC"),i.addOutput("f32","radiusVC");const o=n.getShaderDescription("fragment");o.addBuiltinOutput("f32","@builtin(frag_depth) fragDepth");const c=`
    // compute the eye position and unit direction
    var vertexVC: vec4<f32>;
    var EyePos: vec3<f32>;
    var EyeDir: vec3<f32>;
    var invertedDepth: f32 = 1.0;
    if (rendererUBO.cameraParallel != 0u) {
      EyePos = vec3<f32>(input.vertexVC.x, input.vertexVC.y, input.vertexVC.z + 3.0*input.radiusVC);
      EyeDir = vec3<f32>(0.0, 0.0, -1.0);
    }
    else {
      EyeDir = input.vertexVC.xyz;
      EyePos = vec3<f32>(0.0,0.0,0.0);
      var lengthED: f32 = length(EyeDir);
      EyeDir = normalize(EyeDir);
      // we adjust the EyePos to be closer if it is too far away
      // to prevent floating point precision noise
      if (lengthED > input.radiusVC*3.0) {
        EyePos = input.vertexVC.xyz - EyeDir*3.0*input.radiusVC;
      }
    }

    // translate to Sphere center
    EyePos = EyePos - input.centerVC;
    // scale to radius 1.0
    EyePos = EyePos * (1.0 / input.radiusVC);
    // find the intersection
    var b: f32 = 2.0*dot(EyePos,EyeDir);
    var c: f32 = dot(EyePos,EyePos) - 1.0;
    var d: f32 = b*b - 4.0*c;
    var normal: vec3<f32> = vec3<f32>(0.0,0.0,1.0);
    if (d < 0.0) { discard; }
    else {
      var t: f32 = (-b - invertedDepth*sqrt(d))*0.5;

      // compute the normal, for unit sphere this is just
      // the intersection point
      normal = invertedDepth*normalize(EyePos + t*EyeDir);
      // compute the intersection point in VC
      vertexVC = vec4<f32>(normal * input.radiusVC + input.centerVC, 1.0);
    }
    // compute the pixel's depth
    var pos: vec4<f32> = rendererUBO.VCPCMatrix * vertexVC;
    output.fragDepth = pos.z / pos.w;
    `;let u=o.getCode();u=G.substitute(u,"//VTK::Normal::Impl",[c]).result,o.setCode(u)},t.replaceShaderPosition=(r,n,s)=>{const i=n.getShaderDescription("vertex");i.addBuiltinOutput("vec4<f32>","@builtin(position) Position");let o=i.getCode();o=G.substitute(o,"//VTK::Position::Impl",["  output.Position = rendererUBO.VCPCMatrix*vertexVC;"]).result,i.setCode(o)},t.computePipelineHash=()=>{e.pipelineHash="spm",e.vertexInput.hasAttribute("colorVI")&&(e.pipelineHash+="c"),e.pipelineHash+=e.renderEncoder.getPipelineHash()},t.updateBuffers=()=>{const r=e.currentInput;e.renderable.mapScalars(r,1);const n=r.getPoints(),s=n.getNumberOfPoints(),i=n.getData();t.setNumberOfInstances(1),t.setNumberOfVertices(3*s);const o=e.vertexInput;let c=`spm${n.getMTime()}float32x3`;if(!e.device.getBufferManager().hasBuffer(c)){const g={hash:c,usage:Jr.RawVertex,format:"float32x3"},h=new Float32Array(3*s*3);let d=0,v=0;for(let C=0;C<s;++C)d=C*3,h[v++]=i[d],h[v++]=i[d+1],h[v++]=i[d+2],h[v++]=i[d],h[v++]=i[d+1],h[v++]=i[d+2],h[v++]=i[d],h[v++]=i[d+1],h[v++]=i[d+2];g.nativeArray=h;const x=e.device.getBufferManager().getBuffer(g);o.addBuffer(x,["vertexBC"])}const u=r.getPointData();let p=null;e.renderable.getScaleArray()!=null&&u.hasArray(e.renderable.getScaleArray())&&(p=u.getArray(e.renderable.getScaleArray()).getData());const l=e.renderable.getRadius();if(p||l!==e._lastRadius){if(c=`spm${p?u.getArray(e.renderable.getScaleArray()).getMTime():l}float32x2`,!e.device.getBufferManager().hasBuffer(c)){const g={hash:c,usage:Jr.RawVertex,format:"float32x2"},h=new Float32Array(3*s*2),d=Math.cos(Cr(30));let v=0;for(let C=0;C<s;++C){let T=e.renderable.getRadius();p&&(T=p[C]*e.renderable.getScaleFactor()),h[v++]=-2*T*d,h[v++]=-T,h[v++]=2*T*d,h[v++]=-T,h[v++]=0,h[v++]=2*T}g.nativeArray=h;const x=e.device.getBufferManager().getBuffer(g);o.addBuffer(x,["offsetMC"])}e._lastRadius=l}let f=!1;if(e.renderable.getScalarVisibility()){const g=e.renderable.getColorMapColors();if(g){if(c=`spm${g.getMTime()}unorm8x4`,!e.device.getBufferManager().hasBuffer(c)){const h={hash:c,usage:Jr.RawVertex,format:"unorm8x4"},d=g.getNumberOfComponents();d!==4&&lp("this should be 4");const v=new Uint8ClampedArray(3*s*4);let x=0;const C=g.getData();for(let m=0;m<s;++m){const w=m*d;for(let O=0;O<3;O++)v[x++]=C[w],v[x++]=C[w+1],v[x++]=C[w+2],v[x++]=C[w+3]}h.nativeArray=v;const T=e.device.getBufferManager().getBuffer(h);o.addBuffer(T,["colorVI"])}f=!0}}f||o.removeBufferIfPresent("colorVI"),t.setTopology("triangle-list"),t.updateUBO()}}var gp={};function dp(t,e,a={}){Object.assign(e,gp,a),wt.extend(t,e,a),t.setVertexShaderTemplate(fp),pp(t,e);const r=e.shaderReplacements;r.set("replaceShaderPosition",t.replaceShaderPosition),r.set("replaceShaderNormal",t.replaceShaderNormal)}var hp=X(dp,"vtkWebGPUSphereMapper");he("vtkSphereMapper",hp);var{BufferUsage:lr}=Ot,{vtkErrorMacro:wa}=me,vp=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::Color::Dec

//VTK::IOStructs::Dec

@vertex
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var offsetsArray: array<vec3<f32>, 12> = array<vec3<f32>, 12>(
    vec3<f32>(-1.0, -1.0, -1.0),
    vec3<f32>(1.0, -1.0, -1.0),
    vec3<f32>(1.0, -1.0, 1.0),

    vec3<f32>(-1.0, -1.0, -1.0),
    vec3<f32>(1.0, -1.0, 1.0),
    vec3<f32>(-1.0, -1.0, 1.0),

    vec3<f32>(-1.0, -1.0, 1.0),
    vec3<f32>(1.0, -1.0, 1.0),
    vec3<f32>(1.0, 1.0, 1.0),

    vec3<f32>(-1.0, -1.0, 1.0),
    vec3<f32>(1.0, 1.0, 1.0),
    vec3<f32>(-1.0, 1.0, 1.0)
  );

  var output : vertexOutput;

  var vertexVC: vec4<f32> = rendererUBO.SCVCMatrix * mapperUBO.BCSCMatrix * vec4<f32>(vertexBC.xyz, 1.0);

  //VTK::Color::Impl

  // compute the projected vertex position
  output.centerVC = vertexVC.xyz;
  output.radiusVC = radiusMC;
  output.lengthVC = length(orientMC);
  output.orientVC = (rendererUBO.WCVCNormals * vec4<f32>(normalize(orientMC), 0.0)).xyz;

  // make sure it is pointing out of the screen
  if (output.orientVC.z < 0.0)
    {
    output.orientVC = -output.orientVC;
    }

  // make the basis
  var xbase: vec3<f32>;
  var ybase: vec3<f32>;
  var dir: vec3<f32> = vec3<f32>(0.0,0.0,1.0);
  if (rendererUBO.cameraParallel == 0u)
    {
    dir = normalize(-vertexVC.xyz);
    }
  if (abs(dot(dir,output.orientVC)) == 1.0)
    {
    xbase = normalize(cross(vec3<f32>(0.0,1.0,0.0),output.orientVC));
    ybase = cross(xbase,output.orientVC);
    }
  else
    {
    xbase = normalize(cross(output.orientVC,dir));
    ybase = cross(output.orientVC,xbase);
    }


  var vertIdx: u32 = input.vertexIndex % 12u;
  var offsets: vec3<f32> = offsetsArray[vertIdx];

  vertexVC = vec4<f32>(vertexVC.xyz +
    output.radiusVC * offsets.x * xbase +
    output.radiusVC * offsets.y * ybase +
    0.5 * output.lengthVC * offsets.z * output.orientVC, 1.0);

  output.vertexVC = vertexVC;

  //VTK::Position::Impl

  return output;
}
`;function xp(t,e){e.classHierarchy.push("vtkWebGPUStickMapper");const a=t.buildPass;t.buildPass=r=>{if(r){e.renderable.getStatic()||e.renderable.update();const n=e.renderable.getInputData();t.setCellArray(n.getVerts()),t.setCurrentInput(n)}a(r)},t.replaceShaderNormal=(r,n,s)=>{const i=n.getShaderDescription("vertex");i.hasOutput("vertexVC")||i.addOutput("vec4<f32>","vertexVC"),i.addOutput("vec3<f32>","centerVC"),i.addOutput("vec3<f32>","orientVC"),i.addOutput("f32","radiusVC"),i.addOutput("f32","lengthVC"),i.addBuiltinInput("u32","@builtin(vertex_index) vertexIndex");const o=n.getShaderDescription("fragment");o.addBuiltinOutput("f32","@builtin(frag_depth) fragDepth");const c=`
    // compute the eye position and unit direction
    var vertexVC: vec4<f32>;
    var EyePos: vec3<f32>;
    var EyeDir: vec3<f32>;

    if (rendererUBO.cameraParallel != 0u)
    {
      EyePos = vec3<f32>(input.vertexVC.x, input.vertexVC.y, input.vertexVC.z + 3.0*input.radiusVC);
      EyeDir = vec3<f32>(0.0, 0.0, -1.0);
    }
    else
    {
      EyeDir = input.vertexVC.xyz;
      EyePos = vec3<f32>(0.0,0.0,0.0);
      var lengthED: f32 = length(EyeDir);
      EyeDir = normalize(EyeDir);
      // we adjust the EyePos to be closer if it is too far away
      // to prevent floating point precision noise
      if (lengthED > input.radiusVC*3.0)
      {
        EyePos = input.vertexVC.xyz - EyeDir*3.0*input.radiusVC;
      }
    }
    // translate to Sphere center
    EyePos = EyePos - input.centerVC;

    // rotate to new basis
    // base1, base2, orientVC
    var base1: vec3<f32>;
    if (abs(input.orientVC.z) < 0.99)
    {
      base1 = normalize(cross(input.orientVC,vec3<f32>(0.0,0.0,1.0)));
    }
    else
    {
      base1 = normalize(cross(input.orientVC,vec3<f32>(0.0,1.0,0.0)));
    }
    var base2: vec3<f32> = cross(input.orientVC,base1);
    EyePos = vec3<f32>(dot(EyePos,base1),dot(EyePos,base2),dot(EyePos,input.orientVC));
    EyeDir = vec3<f32>(dot(EyeDir,base1),dot(EyeDir,base2),dot(EyeDir,input.orientVC));

    // scale to radius 1.0
    EyePos = EyePos * (1.0 / input.radiusVC);

    // find the intersection
    var a: f32 = EyeDir.x*EyeDir.x + EyeDir.y*EyeDir.y;
    var b: f32 = 2.0*(EyePos.x*EyeDir.x + EyePos.y*EyeDir.y);
    var c: f32 = EyePos.x*EyePos.x + EyePos.y*EyePos.y - 1.0;
    var d: f32 = b*b - 4.0*a*c;
    var normal: vec3<f32> = vec3<f32>(0.0,0.0,1.0);
    if (d < 0.0) { discard; }
    else
    {
      var t: f32 = (-b - sqrt(d))*(0.5 / a);
      var tz: f32 = EyePos.z + t*EyeDir.z;
      var iPoint: vec3<f32> = EyePos + t*EyeDir;
      if (abs(iPoint.z)*input.radiusVC > input.lengthVC*0.5)
      {
        // test for end cap
        var t2: f32 = (-b + sqrt(d))*(0.5 / a);
        var tz2: f32 = EyePos.z + t2*EyeDir.z;
        if (tz2*input.radiusVC > input.lengthVC*0.5 || tz*input.radiusVC < -0.5*input.lengthVC) { discard; }
        else
        {
          normal = input.orientVC;
          var t3: f32 = (input.lengthVC*0.5/input.radiusVC - EyePos.z)/EyeDir.z;
          iPoint = EyePos + t3*EyeDir;
          vertexVC = vec4<f32>(input.radiusVC*(iPoint.x*base1 + iPoint.y*base2 + iPoint.z*input.orientVC) + input.centerVC, 1.0);
        }
      }
      else
      {
        // The normal is the iPoint.xy rotated back into VC
        normal = iPoint.x*base1 + iPoint.y*base2;
        // rescale rerotate and translate
        vertexVC = vec4<f32>(input.radiusVC*(normal + iPoint.z*input.orientVC) + input.centerVC, 1.0);
      }
    }
    // compute the pixel's depth
    var pos: vec4<f32> = rendererUBO.VCPCMatrix * vertexVC;
    output.fragDepth = pos.z / pos.w;
  `;let u=o.getCode();u=G.substitute(u,"//VTK::Normal::Impl",[c]).result,o.setCode(u)},t.replaceShaderPosition=(r,n,s)=>{const i=n.getShaderDescription("vertex");i.addBuiltinOutput("vec4<f32>","@builtin(position) Position");let o=i.getCode();o=G.substitute(o,"//VTK::Position::Impl",["  output.Position = rendererUBO.VCPCMatrix*vertexVC;"]).result,i.setCode(o)},t.computePipelineHash=()=>{e.pipelineHash="stm",e.vertexInput.hasAttribute("colorVI")&&(e.pipelineHash+="c"),e.pipelineHash+=e.renderEncoder.getPipelineHash()},t.updateBuffers=()=>{const r=e.currentInput;e.renderable.mapScalars(r,1);const n=e.device,s=r.getPoints(),i=r.getPointData(),o=s.getNumberOfPoints(),c=s.getData();t.setNumberOfInstances(o),t.setNumberOfVertices(12);const u=e.vertexInput;let p=`stm${s.getMTime()}float32x3`;if(!n.getBufferManager().hasBuffer(p)){const d={hash:p,usage:lr.RawVertex,format:"float32x3"},v=new Float32Array(o*3);let x=0,C=0;for(let m=0;m<o;++m)x=m*3,v[C++]=c[x],v[C++]=c[x+1],v[C++]=c[x+2];d.nativeArray=v;const T=n.getBufferManager().getBuffer(d);u.addBuffer(T,["vertexBC"],"instance")}let l=null;e.renderable.getScaleArray()!=null&&i.hasArray(e.renderable.getScaleArray())&&(l=i.getArray(e.renderable.getScaleArray()).getData());const f=e.renderable.getRadius();if(l||f!==e._lastRadius){if(p=`stm${l?i.getArray(e.renderable.getScaleArray()).getMTime():f}float32`,!n.getBufferManager().hasBuffer(p)){const d={hash:p,usage:lr.RawVertex,format:"float32"},v=new Float32Array(o);let x=0;for(let T=0;T<o;++T){let m=e.renderable.getRadius();l&&(m=l[T*2+1]),v[x++]=m}d.nativeArray=v;const C=n.getBufferManager().getBuffer(d);u.addBuffer(C,["radiusMC"],"instance")}e._lastRadius=f}let g=null;if(e.renderable.getOrientationArray()!=null&&i.hasArray(e.renderable.getOrientationArray())?g=i.getArray(e.renderable.getOrientationArray()).getData():wa([`Error setting orientationArray.
`,"You have to specify the stick orientation"]),p=`stm${i.getArray(e.renderable.getOrientationArray()).getMTime()}float32x3`,!n.getBufferManager().hasBuffer(p)){const d={hash:p,usage:lr.RawVertex,format:"float32x3"},v=new Float32Array(o*3);let x=0,C=0;for(let m=0;m<o;++m){x=m*3;let w=e.renderable.getLength();l&&(w=l[m*2]),v[C++]=g[x]*w,v[C++]=g[x+1]*w,v[C++]=g[x+2]*w}d.nativeArray=v;const T=n.getBufferManager().getBuffer(d);u.addBuffer(T,["orientMC"],"instance")}let h=!1;if(e.renderable.getScalarVisibility()){const d=e.renderable.getColorMapColors();if(d){if(p=`stm${d.getMTime()}unorm8x4`,!n.getBufferManager().hasBuffer(p)){const v={usage:lr.RawVertex,format:"unorm8x4"},x=d.getNumberOfComponents();x!==4&&wa("this should be 4");const C=new Uint8ClampedArray(o*4);let T=0;const m=d.getData();for(let O=0;O<o;++O){const B=O*x;C[T++]=m[B],C[T++]=m[B+1],C[T++]=m[B+2],C[T++]=m[B+3]}v.nativeArray=C;const w=n.getBufferManager().getBuffer(v);u.addBuffer(w,["colorVI"],"instance")}h=!0}}h||u.removeBufferIfPresent("colorVI"),t.setTopology("triangle-list"),t.updateUBO()}}var Cp={};function mp(t,e,a={}){Object.assign(e,Cp,a),wt.extend(t,e,a),t.setVertexShaderTemplate(vp),xp(t,e);const r=e.shaderReplacements;r.set("replaceShaderPosition",t.replaceShaderPosition),r.set("replaceShaderNormal",t.replaceShaderNormal)}var Tp=X(mp,"vtkWebGPUStickMapper");he("vtkStickMapper",Tp);function Sp(t,e){e.classHierarchy.push("vtkWebGPUVolume"),t.buildPass=n=>{!e.renderable||!e.renderable.getVisibility()||n&&(e.WebGPURenderer=t.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getFirstAncestorOfType("vtkWebGPURenderWindow"),e.propID===void 0&&(e.propID=e.WebGPURenderWindow.getUniquePropID()),e.renderable.getMapper().update())},t.queryPass=(n,s)=>{if(n){if(!e.renderable||!e.renderable.getVisibility())return;const i=e.renderable.getMapper().getBounds();if(!i||i.length!==6||i[0]>i[1])return;s.addVolume(t)}};const a=new Float64Array(3),r=new Float64Array(3);t.getBoundingCubePoints=(n,s)=>{const i=e.renderable.getMapper().getInputData();if(!i)return;const o=i.getSpatialExtent(),c=e.renderable.getMatrix();let u=0;for(let p=4;p<6;p++){a[2]=o[p];for(let l=2;l<4;l++){a[1]=o[l];for(let f=0;f<2;f++){a[0]=o[f],i.indexToWorld(a,r);let g=s+u*3;n[g++]=c[0]*r[0]+c[1]*r[1]+c[2]*r[2]+c[3],n[g++]=c[4]*r[0]+c[5]*r[1]+c[6]*r[2]+c[7],n[g++]=c[8]*r[0]+c[9]*r[1]+c[10]*r[2]+c[11],u++}}}},t.getKeyMatrices=n=>{if(Math.max(e.renderable.getMTime(),n.getStabilizedTime())>e.keyMatricesTime.getMTime()){e.renderable.computeMatrix();const s=e.renderable.getMatrix(),i=n.getStabilizedCenterByReference();ne(e.keyMatrices.bcwc,s),we(e.keyMatrices.bcsc,e.keyMatrices.bcwc,[-i[0],-i[1],-i[2]]),e.keyMatricesTime.modified()}return e.keyMatrices}}var yp={propID:void 0,keyMatricesTime:null};function Op(t,e,a={}){Object.assign(e,yp,a),ee.extend(t,e,a),e.keyMatricesTime={},I.obj(e.keyMatricesTime,{mtime:0}),e.keyMatrices={bcwc:new Float64Array(16),bcsc:new Float64Array(16)},I.get(t,e,["propID","keyMatricesTime"]),Sp(t,e)}var bp=I.newInstance(Op,"vtkWebGPUVolume");he("vtkVolume",bp);var{BufferUsage:Vp}=Ot,wp=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::IOStructs::Dec

@vertex
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : vertexOutput;

  //VTK::ImageCPR::Impl

  return output;
}
`,Mp=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::Clip::Dec

//VTK::Coincident::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

fn applyQuaternionToVec(q: vec4<f32>, v: vec3<f32>) -> vec3<f32>
{
  let uv = cross(q.xyz, v);
  let uuv = cross(q.xyz, uv);
  return v + (2.0 * q.w) * uv + 2.0 * uuv;
}

fn quaternionLerpOrSlerp(q0In: vec4<f32>, q1In: vec4<f32>, t: f32) -> vec4<f32>
{
  var q0 = normalize(q0In);
  var q1 = normalize(q1In);
  var cosAngle = dot(q0, q1);
  if (cosAngle < 0.0)
  {
    q1 = -q1;
    cosAngle = -cosAngle;
  }
  if (cosAngle > 0.999)
  {
    return normalize((1.0 - t) * q0 + t * q1);
  }
  let omega = acos(cosAngle);
  let sinOmega = max(sin(omega), 0.000001);
  let w0 = sin((1.0 - t) * omega) / sinOmega;
  let w1 = sin(t * omega) / sinOmega;
  return normalize(w0 * q0 + w1 * q1);
}

fn getComponent(v: vec4<f32>, idx: u32) -> f32
{
  if (idx == 0u) { return v.x; }
  if (idx == 1u) { return v.y; }
  if (idx == 2u) { return v.z; }
  return v.w;
}

fn sampleColorTF(value: f32) -> vec4<f32>
{
  return textureSampleLevel(colorTexture, cprSampler, vec2<f32>(value, 0.5), 0.0);
}

fn sampleScalarColor(value: f32) -> vec3<f32>
{
  return sampleColorTF(value).rgb;
}

fn sampleColorRow(value: f32, row: f32) -> vec4<f32>
{
  return textureSampleLevel(colorTexture, cprSampler, vec2<f32>(value, row), 0.0);
}

fn sampleOpacityRow(value: f32, row: f32) -> f32
{
  return textureSampleLevel(pwfTexture, cprSampler, vec2<f32>(value, row), 0.0).r;
}

fn getProjectedValue(volumePosTC: vec3<f32>, projectionDirection: vec3<f32>) -> vec4<f32>
{
  let scaledDirection =
    (mapperUBO.MCTCMatrix * vec4<f32>(projectionDirection, 0.0)).xyz;
  let projectionStep = mapperUBO.ProjectionParams.z * scaledDirection;
  let projectionStart = volumePosTC + mapperUBO.ProjectionParams.y * scaledDirection;

  var tvalue = vec4<f32>(0.0);
  if (mapperUBO.ProjectionMode == ${ke.MIN}u)
  {
    tvalue = vec4<f32>(1.0);
  }

  for (var projectionSampleIdx: u32 = 0u;
    projectionSampleIdx < mapperUBO.ProjectionSamples;
    projectionSampleIdx = projectionSampleIdx + 1u)
  {
    let projectionSamplePosition =
      projectionStart + f32(projectionSampleIdx) * projectionStep;
    let sampledTextureValue =
      textureSampleLevel(volumeTexture, cprSampler, projectionSamplePosition, 0.0);

    if (mapperUBO.ProjectionMode == ${ke.MAX}u)
    {
      tvalue = max(tvalue, sampledTextureValue);
    }
    else if (mapperUBO.ProjectionMode == ${ke.MIN}u)
    {
      tvalue = min(tvalue, sampledTextureValue);
    }
    else
    {
      tvalue = tvalue + sampledTextureValue;
    }
  }

  if (mapperUBO.ProjectionMode == ${ke.AVERAGE}u)
  {
    tvalue = tvalue / max(f32(mapperUBO.ProjectionSamples), 1.0);
  }
  return tvalue;
}

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : fragmentOutput;

  var interpolatedOrientation = mapperUBO.UniformOrientation;
  if (mapperUBO.UseUniformOrientation == 0u)
  {
    interpolatedOrientation = quaternionLerpOrSlerp(
      input.centerlineBottomOrientationVS,
      input.centerlineTopOrientationVS,
      input.quadOffsetVS.y
    );
  }
  let samplingDirection = applyQuaternionToVec(
    interpolatedOrientation,
    mapperUBO.TangentDirection.xyz
  );
  let projectionDirection = applyQuaternionToVec(
    interpolatedOrientation,
    mapperUBO.BitangentDirection.xyz
  );

  var horizontalOffset = input.quadOffsetVS.x;
  if (mapperUBO.UseCenterPoint != 0u)
  {
    let baseOffset = dot(
      samplingDirection,
      mapperUBO.GlobalCenterPoint.xyz - input.centerlinePosVS
    );
    horizontalOffset = horizontalOffset + baseOffset;
  }

  let volumePosMC = input.centerlinePosVS + horizontalOffset * samplingDirection;
  //VTK::Clip::Impl
  let volumePosTC =
    (mapperUBO.MCTCMatrix * vec4<f32>(volumePosMC, 1.0)).xyz;

  if (any(volumePosTC < vec3<f32>(0.0)) || any(volumePosTC > vec3<f32>(1.0)))
  {
    var computedColor = mapperUBO.BackgroundColor;
    //VTK::RenderEncoder::Impl
    return output;
  }

  var tvalue = textureSampleLevel(volumeTexture, cprSampler, volumePosTC, 0.0);
  if (mapperUBO.ProjectionSamples > 1u)
  {
    tvalue = getProjectedValue(volumePosTC, projectionDirection);
  }

  var computedColor = vec4<f32>(0.0);
  if (mapperUBO.IndependentComponents != 0u)
  {
    var sumColor = vec3<f32>(0.0);
    var sumWeight = 0.0;
    for (var c: u32 = 0u; c < mapperUBO.NumComponents; c = c + 1u)
    {
      let row = (f32(c) + 0.5) / max(f32(mapperUBO.NumComponents), 1.0);
      let componentValue = getComponent(tvalue, c);
      let lutValue = componentValue * getComponent(mapperUBO.CScale, c) +
        getComponent(mapperUBO.CShift, c);
      let opacityValue = componentValue * getComponent(mapperUBO.PWFScale, c) +
        getComponent(mapperUBO.PWFShift, c);
      let componentMix = getComponent(mapperUBO.ComponentMix, c);
      let color = sampleColorRow(lutValue, row).rgb;
      let weight = componentMix * sampleOpacityRow(opacityValue, row);
      sumColor = sumColor + weight * color;
      sumWeight = sumWeight + weight;
    }

    let finalColor = select(sumColor, sumColor / max(sumWeight, 0.000001), sumWeight > 0.0);
    if (mapperUBO.NumComponents == 1u)
    {
      computedColor = vec4<f32>(finalColor, sumWeight * mapperUBO.Opacity);
    }
    else
    {
      computedColor = vec4<f32>(finalColor, mapperUBO.Opacity);
    }
  }
  else if (mapperUBO.NumComponents == 1u)
  {
    let intensity = tvalue.r;
    let lutValue = intensity * mapperUBO.CScale.x + mapperUBO.CShift.x;
    let opacityValue = intensity * mapperUBO.PWFScale.x + mapperUBO.PWFShift.x;
    computedColor = vec4<f32>(
      sampleScalarColor(lutValue),
      sampleOpacityRow(opacityValue, 0.5) * mapperUBO.Opacity
    );
  }
  else if (mapperUBO.NumComponents == 2u)
  {
    let intensity = tvalue.r * mapperUBO.CScale.x + mapperUBO.CShift.x;
    computedColor = vec4<f32>(
      sampleScalarColor(intensity),
      mapperUBO.PWFScale.x * tvalue.g + mapperUBO.PWFShift.x
    );
  }
  else if (mapperUBO.NumComponents == 3u)
  {
    let tcolor = mapperUBO.CScale * tvalue + mapperUBO.CShift;
    computedColor = vec4<f32>(
      sampleColorTF(tcolor.r).r,
      sampleColorTF(tcolor.g).r,
      sampleColorTF(tcolor.b).r,
      mapperUBO.Opacity
    );
  }
  else
  {
    let tcolor = mapperUBO.CScale * tvalue + mapperUBO.CShift;
    computedColor = vec4<f32>(
      sampleColorTF(tcolor.r).r,
      sampleColorTF(tcolor.g).r,
      sampleColorTF(tcolor.b).r,
      tcolor.a
    );
  }

  //VTK::Select::Impl
  //VTK::Coincident::Impl
  //VTK::RenderEncoder::Impl
  return output;
}
`,dt=new Float64Array(16),fr=new Float64Array(16),Bp=[0,0,0,1],Dp=[0,1,3,0,3,2];function Lp(t,e){e.classHierarchy.push("vtkWebGPUImageCPRMapper"),t.getCoincidentParameters=()=>e.renderable.getResolveCoincidentTopology()===Vt.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.buildPass=r=>{r&&(e.WebGPUImageSlice=t.getFirstAncestorOfType("vtkWebGPUImageSlice"),e.WebGPURenderer=e.WebGPUImageSlice.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getParent(),e.device=e.WebGPURenderWindow.getDevice(),t.setWebGPURenderer(e.WebGPURenderer))},t.opaquePass=r=>{r&&t.render()},t.translucentPass=r=>{r&&t.render()},t.zBufferPass=r=>{r&&t.render()},t.opaqueZBufferPass=r=>t.zBufferPass(r),t.render=()=>{e.renderable.update(),e.renderable.preRenderCheck()&&(e.currentImageDataInput=e.renderable.getInputData(0),e.currentCenterlineInput=e.renderable.getOrientedCenterline(),t.prepareToDraw(e.WebGPURenderer.getRenderEncoder()),e.renderEncoder.registerDrawCallback(e.pipeline,t.draw))},t.computePipelineHash=()=>{const r=Math.min(e.renderable.getNumberOfClippingPlanes(),6),n=t.getCoincidentParameters();e.pipelineHash=`cprcp${r}co${n?.factor||n?.offset?1:0}${e.renderEncoder.getPipelineHash()}`},t.updateGeometry=()=>{const r=e.currentCenterlineInput,n=r?.getNumberOfPoints?.()??0,s=n<=1?0:n-1;if(!s){t.setNumberOfVertices(0);return}const i=e.renderable.getHeight(),o=e.renderable.getWidth(),c=r.getDistancesToFirstPoint(),u=r.getPoints(),p=r.getOrientations()??[],l=6*s,f=new Float32Array(l*3),g=new Float32Array(l*3),h=new Uint32Array(l),d=new Float32Array(l*4),v=new Float32Array(l*4),x=[0,0,0],C=[0,0,0];for(let D=0;D<s;++D){u.getPoint(D,x),u.getPoint(D+1,C);const y=i-c[D],S=i-c[D+1],P=p[D]??Bp,M=p[D+1]??P;for(let b=0;b<6;++b){const L=Dp[b],R=D*6+b,E=R*3,k=R*4;f[E]=L===1||L===3?o:0,f[E+1]=L>1?S:y,f[E+2]=0;const N=L>1?C:x;g[E]=N[0],g[E+1]=N[1],g[E+2]=N[2],h[R]=L,d[k]=P[0],d[k+1]=P[1],d[k+2]=P[2],d[k+3]=P[3],v[k]=M[0],v[k+1]=M[1],v[k+2]=M[2],v[k+3]=M[3]}}const T=e.device.getBufferManager(),m=Math.max(e.renderable.getMTime(),r.getMTime(),r.getPoints().getMTime()),w=`cpr-vertex-${m}`,O=`cpr-centerline-${m}`,B=`cpr-quad-${m}`,U=`cpr-top-${m}`,F=`cpr-bottom-${m}`;[[w,f,"float32x3",["vertexMC"]],[O,g,"float32x3",["centerlinePosition"]],[B,h,"uint32",["quadIndex"]],[U,d,"float32x4",["centerlineTopOrientation"]],[F,v,"float32x4",["centerlineBottomOrientation"]]].forEach(([D,y,S,P])=>{const M=T.getBuffer({hash:D,nativeArray:y,usage:Vp.RawVertex,format:S});e.vertexInput.addBuffer(M,P)}),t.setNumberOfVertices(l)},t.updateVolumeTexture=()=>{const r=e.device.getTextureManager().getTextureForImageData(e.currentImageDataInput);(!e.textureViews[0]||e.textureViews[0].getTexture()!==r)&&(e.textureViews[0]=r.createView("volumeTexture"))},t.updateColorTexture=()=>{const r=e.WebGPUImageSlice.getRenderable().getProperty(),n=e.currentImageDataInput?.getPointData()?.getScalars();if(!n)return;const s=n.getNumberOfComponents(),i=r.getIndependentComponents()?s:1,o=Dr(r,r.getRGBTransferFunction,i);if(e.colorTextureString===o)return;const c=new Uint8ClampedArray(e.rowLength*i*4),u=new Float32Array(e.rowLength*3);if(r.getRGBTransferFunction())for(let l=0;l<i;++l){const f=r.getRGBTransferFunction(l),g=f.getRange();f.getTable(g[0],g[1],e.rowLength,u,1);for(let h=0;h<e.rowLength;++h){const d=l*e.rowLength*4+h*4;c[d]=255*u[h*3],c[d+1]=255*u[h*3+1],c[d+2]=255*u[h*3+2],c[d+3]=255}}else{const l=Math.max(e.rowLength-1,1);for(let f=0;f<e.rowLength;++f){const g=f*4,h=255*f/l;c[g]=h,c[g+1]=h,c[g+2]=h,c[g+3]=255}}const p=e.device.getTextureManager().getTexture({nativeArray:c,width:e.rowLength,height:i,depth:1,format:"rgba8unorm"});e.textureViews[1]=p.createView("colorTexture"),e.colorTextureString=o},t.updateOpacityTexture=()=>{const r=e.WebGPUImageSlice.getRenderable().getProperty(),n=e.currentImageDataInput?.getPointData()?.getScalars();if(!n)return;const s=n.getNumberOfComponents(),i=r.getIndependentComponents()?s:1,o=Dr(r,r.getPiecewiseFunction,i);if(e.pwfTextureString===o)return;const c=new Float32Array(e.rowLength*i),u=new Float32Array(e.rowLength);if(r.getPiecewiseFunction())for(let l=0;l<i;++l){const f=r.getPiecewiseFunction(l);if(f){const g=f.getRange();f.getTable(g[0],g[1],e.rowLength,u,1),c.set(u,l*e.rowLength)}else c.fill(1,l*e.rowLength,(l+1)*e.rowLength)}else c.fill(1);const p=e.device.getTextureManager().getTexture({nativeArray:c,width:e.rowLength,height:i,depth:1,format:"r16float"});e.textureViews[2]=p.createView("pwfTexture"),e.pwfTextureString=o},t.updateUBO=()=>{const r=e.UBO.getSendTime(),n=e.WebGPUImageSlice.getRenderable(),s=n.getProperty(),i=e.currentImageDataInput;if(t.getMTime()<=r&&e.renderable.getMTime()<=r&&n.getMTime()<=r&&s.getMTime()<=r&&i.getMTime()<=r&&e.WebGPURenderer.getStabilizedTime()<=r)return;const o=e.WebGPURenderer.getStabilizedCenterByReference();ne(dt,n.getMatrix()),we(dt,dt,[-o[0],-o[1],-o[2]]),e.UBO.setArray("BCSCMatrix",dt);const c=i.getWorldToIndex(),u=i.getDimensions();Z(fr),Pt(fr,fr,[1/Math.max(u[0],1),1/Math.max(u[1],1),1/Math.max(u[2],1)]),q(dt,fr,c),e.UBO.setArray("MCTCMatrix",dt);const p=e.renderable.getCenterPoint();e.UBO.setArray("GlobalCenterPoint",[...p??[0,0,0],1]),e.UBO.setValue("UseCenterPoint",p?1:0),e.UBO.setArray("BackgroundColor",e.renderable.getBackgroundColor()),e.UBO.setArray("TangentDirection",[...e.renderable.getTangentDirection(),0]),e.UBO.setArray("BitangentDirection",[...e.renderable.getBitangentDirection(),0]),e.UBO.setArray("UniformOrientation",e.renderable.getUniformOrientation()),e.UBO.setValue("UseUniformOrientation",e.renderable.getUseUniformOrientation()?1:0),e.UBO.setValue("Width",e.renderable.getWidth()),e.UBO.setValue("Opacity",s.getOpacity()),e.UBO.setValue("PropID",e.WebGPUImageSlice.getPropID());const l=Math.min(e.renderable.getNumberOfClippingPlanes(),6);e.UBO.setValue("NumClipPlanes",l);const f=[0,0,0,0];for(let F=0;F<6;++F)f.fill(0),F<l&&e.renderable.getClippingPlaneInDataCoords(n.getMatrix(),F,f),e.UBO.setArray(`ClipPlane${F}`,f);const g=t.getCoincidentParameters();e.UBO.setValue("CoincidentFactor",g?.factor??0),e.UBO.setValue("CoincidentOffset",16e-6*(g?.offset??0));const h=e.renderable.getProjectionSlabNumberOfSamples(),d=e.renderable.getProjectionSlabThickness(),v=h>1?d/(h-1):0;e.UBO.setValue("ProjectionSamples",h),e.UBO.setValue("ProjectionMode",e.renderable.getProjectionMode()),e.UBO.setArray("ProjectionParams",[d,-.5*d,v,0]);const x=i.getPointData().getScalars().getNumberOfComponents(),C=s.getIndependentComponents(),T=[0,0,0,0],m=[1,1,1,1],w=[0,0,0,0],O=[1,1,1,1],B=[0,0,0,0],U=e.textureViews[0].getTexture().getScale();for(let F=0;F<Math.min(x,4);++F){const D=C?F:0;T[F]=s.getComponentWeight?.(F)??1;let y=s.getColorWindow(),S=s.getColorLevel();const P=s.getRGBTransferFunction(D);if(P&&s.getUseLookupTableScalarRange()){const L=P.getRange();y=L[1]-L[0],S=.5*(L[1]+L[0])}const M=Math.abs(y)>0?y:1;m[F]=U/M,w[F]=-S/M+.5;const b=s.getPiecewiseFunction(D);if(b){const L=b.getRange(),R=L[1]-L[0],E=.5*(L[1]+L[0]),k=Math.abs(R)>0?R:1;O[F]=U/k,B[F]=-E/k+.5}}e.UBO.setValue("NumComponents",x),e.UBO.setValue("IndependentComponents",C?1:0),e.UBO.setArray("ComponentMix",T),e.UBO.setArray("CScale",m),e.UBO.setArray("CShift",w),e.UBO.setArray("PWFScale",O),e.UBO.setArray("PWFShift",B),e.UBO.sendIfNeeded(e.device)};const a=t.updateBuffers;t.updateBuffers=()=>{a(),t.updateGeometry(),t.updateVolumeTexture(),t.updateColorTexture(),t.updateOpacityTexture(),t.updateUBO();const r=e.WebGPUImageSlice.getRenderable().getProperty().getInterpolationType()===qe.NEAREST?"nearest":"linear";(!e.cprSampler||e.cprSampler.getOptions().minFilter!==r)&&(e.cprSampler=qi.newInstance({label:"cprSampler"}),e.cprSampler.create(e.device,{minFilter:r,magFilter:r}),e.additionalBindables=[e.cprSampler])},t.replaceShaderImageCPR=(r,n)=>{const s=n.getShaderDescription("vertex");s.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),s.addOutput("vec2<f32>","quadOffsetVS"),s.addOutput("vec3<f32>","centerlinePosVS"),s.addOutput("vec4<f32>","centerlineTopOrientationVS"),s.addOutput("vec4<f32>","centerlineBottomOrientationVS");let i=s.getCode();i=G.substitute(i,"//VTK::ImageCPR::Impl",["let isLeft = quadIndex == 0u || quadIndex == 2u;","let isTop = quadIndex == 0u || quadIndex == 1u;","output.quadOffsetVS = vec2<f32>(","  mapperUBO.Width * select(0.5, -0.5, isLeft),","  select(0.0, 1.0, isTop)",");","output.centerlinePosVS = centerlinePosition;","output.centerlineTopOrientationVS = centerlineTopOrientation;","output.centerlineBottomOrientationVS = centerlineBottomOrientation;","let posSC = mapperUBO.BCSCMatrix * vec4<f32>(vertexMC, 1.0);","output.Position = rendererUBO.SCPCMatrix * posSC;"]).result,s.setCode(i)},e.shaderReplacements.set("replaceShaderImageCPR",t.replaceShaderImageCPR),t.replaceShaderClip=(r,n)=>{const s=n.getShaderDescription("fragment");let i=s.getCode();if(!e.renderable.getNumberOfClippingPlanes()){i=G.substitute(i,"//VTK::Clip::Impl",[]).result,s.setCode(i);return}const o=Ur({countName:"mapperUBO.NumClipPlanes",planePrefix:"mapperUBO.ClipPlane",positionName:"vec4<f32>(volumePosMC, 1.0)"});i=G.substitute(i,"//VTK::Clip::Impl",[...o]).result,s.setCode(i)},e.shaderReplacements.set("replaceShaderClip",t.replaceShaderClip),t.replaceShaderCoincident=(r,n)=>{const s=n.getShaderDescription("fragment");let i=s.getCode();const o=t.getCoincidentParameters();if(!o||o.factor===0&&o.offset===0){i=G.substitute(i,"//VTK::Coincident::Dec",[]).result,i=G.substitute(i,"//VTK::Coincident::Impl",[]).result,s.setCode(i);return}s.addBuiltinInput("vec4<f32>","@builtin(position) fragPos"),s.addBuiltinOutput("f32","@builtin(frag_depth) fragDepth"),i=G.substitute(i,"//VTK::Coincident::Dec",[]).result,i=G.substitute(i,"var output : fragmentOutput;",["var output : fragmentOutput;","var coincidentDepth = input.fragPos.z + mapperUBO.CoincidentOffset;","if (mapperUBO.CoincidentFactor != 0.0) {","  let cscale = length(vec2<f32>(dpdx(input.fragPos.z), dpdy(input.fragPos.z)));","  coincidentDepth = coincidentDepth + mapperUBO.CoincidentFactor * cscale;","}","output.fragDepth = clamp(coincidentDepth, 0.0, 1.0);"]).result,i=G.substitute(i,"//VTK::Coincident::Impl",[""]).result,s.setCode(i)},e.shaderReplacements.set("replaceShaderCoincident",t.replaceShaderCoincident),t.replaceShaderRenderEncoder=(r,n)=>{if(r.includes("sel")){const s=n.getShaderDescription("fragment");s.addOutput("vec4<u32>","outColor");let i=s.getCode();i=G.substitute(i,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<u32>(mapperUBO.PropID, 0u, 0u, 0u);"]).result,s.setCode(i);return}e.renderEncoder.replaceShaderCode(n)},e.shaderReplacements.set("replaceShaderRenderEncoder",t.replaceShaderRenderEncoder)}var Rp={rowLength:1024,currentImageDataInput:null,currentCenterlineInput:null,colorTextureString:null,pwfTextureString:null,cprSampler:null};function Up(t,e,a={}){Object.assign(e,Rp,a),Ea.extend(t,e,a),t.setVertexShaderTemplate(wp),t.setFragmentShaderTemplate(Mp),e.UBO=yt.newInstance({label:"mapperUBO"}),e.UBO.addEntry("BCSCMatrix","mat4x4<f32>"),e.UBO.addEntry("MCTCMatrix","mat4x4<f32>"),e.UBO.addEntry("BackgroundColor","vec4<f32>"),e.UBO.addEntry("GlobalCenterPoint","vec4<f32>"),e.UBO.addEntry("UniformOrientation","vec4<f32>"),e.UBO.addEntry("TangentDirection","vec4<f32>"),e.UBO.addEntry("BitangentDirection","vec4<f32>"),e.UBO.addEntry("ComponentMix","vec4<f32>"),e.UBO.addEntry("CScale","vec4<f32>"),e.UBO.addEntry("CShift","vec4<f32>"),e.UBO.addEntry("PWFScale","vec4<f32>"),e.UBO.addEntry("PWFShift","vec4<f32>"),e.UBO.addEntry("ProjectionParams","vec4<f32>"),Tn(e.UBO,"ClipPlane"),e.UBO.addEntry("Width","f32"),e.UBO.addEntry("Opacity","f32"),e.UBO.addEntry("CoincidentFactor","f32"),e.UBO.addEntry("CoincidentOffset","f32"),e.UBO.addEntry("PropID","u32"),e.UBO.addEntry("NumClipPlanes","u32"),e.UBO.addEntry("ProjectionSamples","u32"),e.UBO.addEntry("ProjectionMode","u32"),e.UBO.addEntry("NumComponents","u32"),e.UBO.addEntry("IndependentComponents","u32"),e.UBO.addEntry("UseUniformOrientation","u32"),e.UBO.addEntry("UseCenterPoint","u32"),Lp(t,e)}var kp=I.newInstance(Up,"vtkWebGPUImageCPRMapper");he("vtkImageCPRMapper",kp);var{vtkErrorMacro:Ma}=I,xe=new Float64Array(16),en=new Float32Array(4),tn=new Float32Array(4),rn=new Float32Array(4),nn=new Float32Array(4),an=new Float32Array(4),Ep=[0,0,1],Pp=[0,0,0],on=new Float32Array(4),Ei=new Float32Array(4),sn=new Float32Array(4),Fp=["r","g","b","a"],kn=4;function Lr(t){return`OutlineTangent1_${t}`}function Rr(t){return`OutlineTangent2_${t}`}function Gt(t){return`OutlineTexelSize_${t}`}function Ip(t,e){const a=[],r=[],n=e.getNumberOfInputPorts();for(let s=0;s<n;++s){const i=e.getInputData(s);if(i&&!i.isDeleted()){const o=a.length;a.push({imageData:i,inputIndex:s});const c=_e(t,s);c?.getUseLabelOutline()&&r.push({property:c,arrayIndex:o})}}return{currentValidInputs:a,labelOutlineProperties:r}}function En(t){return t===0?"imgTexture":`imgTexture${t+1}`}function At(t){return t===0?"SCTCMatrix":`WCTCMatrix${t}`}function Pi(t){return t.multiTexturePerVolumeEnabled?t.currentValidInputs.length:Le.COLOR_LUT}function Pn(t){return Pi(t)+1}function Fi(t){return Pn(t)+1}function Ba(t){return Fi(t)+1}function Np(t,e){return e.map(({inputIndex:a})=>_e(t,a)?.getUseLabelOutline()?"1":"0").join("")}function kt(t,e,a,r,n=0){return t[0]=e,t[1]=a,t[2]=r,t[3]=n,t}function Da(t,e){e.vertexInput.setIndexBuffer(null),e.vertexInput.removeBufferIfPresent("vertexBC"),e.vertexInput.removeBufferIfPresent("vertexNormal"),t.setNumberOfVertices(0)}function Gp(t,e,a){const r=e.getPointData().getScalars().getMTime(),n=t.scalarTextures[a];if(n&&n.mtime===r)return n.texture;const s=t.device.getTextureManager().getTextureForImageData(e);return t.scalarTextures[a]={texture:s,mtime:r},s}function Ap(t){return t?.getInterpolationType()===qe.NEAREST?"nearest":"linear"}function La(t,e,a,r,n,s){const i=s,o=En(s),c=Gp(e,r,s);(!e.textureViews[i]||e.textureViews[i].getTexture()!==c)&&(e.textureViews[i]=c.createView(o));const u=Ap(_e(a,n));t.ensureTextureSampler(e.textureViews[i],{minFilter:u,magFilter:u})}function Ra(t,e){const a=t.renderable.getLabelOutlineTextureWidth();return Math.max(1,e,a>0?a:0)}function Ua(){return GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}function Fn(t){return t===2?"xy":"xyz"}function _p(t){return t===2?{sampleCoordType:"vec2<f32>",coordFromWorldNeg:"(mapperUBO.SCTCMatrix * vec4<f32>(worldNeg, 1.0)).xy",coordFromWorldPos:"(mapperUBO.SCTCMatrix * vec4<f32>(worldPos, 1.0)).xy",coordBounds:"all(sampleCoord >= vec2<f32>(0.0)) && all(sampleCoord <= vec2<f32>(1.0))",negBounds:"all(coordNeg >= vec2<f32>(0.0)) && all(coordNeg <= vec2<f32>(1.0))",posBounds:"all(coordPos >= vec2<f32>(0.0)) && all(coordPos <= vec2<f32>(1.0))"}:{sampleCoordType:"vec3<f32>",coordFromWorldNeg:"(mapperUBO.SCTCMatrix * vec4<f32>(worldNeg, 1.0)).xyz",coordFromWorldPos:"(mapperUBO.SCTCMatrix * vec4<f32>(worldPos, 1.0)).xyz",coordBounds:"all(sampleCoord >= vec3<f32>(0.0)) && all(sampleCoord <= vec3<f32>(1.0))",negBounds:"all(coordNeg >= vec3<f32>(0.0)) && all(coordNeg <= vec3<f32>(1.0))",posBounds:"all(coordPos >= vec3<f32>(0.0)) && all(coordPos <= vec3<f32>(1.0))"}}function Wp(t,e,a){const r=[],n=Fn(t.dimensions);for(let s=0;s<kn;s++)if(s<e){const i=En(s),o=`(mapperUBO.${At(s)} * vec4<f32>(${a}, 1.0)).${n}`;r.push(`textureSampleLevel(${i}, ${i}Sampler, ${o}, 0.0).r`)}else r.push("0.0");return`vec4<f32>(${r.join(", ")})`}function zp(){return["fn vtkCompositeSlab(currVal: vec4<f32>, valToComp: vec4<f32>, slabType: i32, trapezoid: i32) -> vec4<f32> {","  if (slabType == 0) { return min(currVal, valToComp); }","  if (slabType == 1) { return max(currVal, valToComp); }","  if (trapezoid > 0) { return currVal + 0.5 * valToComp; }","  return currVal + valToComp;","}"]}function Ii(t){return t.renderable.getSlabThickness()>0&&t.dimensions===3}function $p(){return["fn labelSlabMask(startTC: vec3<f32>, stepTC: vec3<f32>, halfSlab: f32, stepLen: f32) -> u32 {","  var mask: u32 = 0u;","  var tc: vec3<f32> = startTC;","  var dist: f32 = 0.0;","  for (var i: i32 = 0; i < 4096; i = i + 1) {","    if (dist > halfSlab) { break; }","    if (any(tc > vec3<f32>(1.0)) || any(tc < vec3<f32>(0.0))) { break; }","    let label: i32 = i32(textureSampleLevel(imgTexture, imgTextureSampler, tc, 0.0).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask = mask | (1u << u32(label)); }","    tc = tc + stepTC;","    dist = dist + stepLen;","  }","  tc = startTC - stepTC;","  dist = stepLen;","  for (var i: i32 = 0; i < 4096; i = i + 1) {","    if (dist > halfSlab) { break; }","    if (any(tc > vec3<f32>(1.0)) || any(tc < vec3<f32>(0.0))) { break; }","    let label: i32 = i32(textureSampleLevel(imgTexture, imgTextureSampler, tc, 0.0).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask = mask | (1u << u32(label)); }","    tc = tc - stepTC;","    dist = dist + stepLen;","  }","  return mask;","}","","fn labelSlabBoxSteps(p: vec3<f32>, stepTC: vec3<f32>) -> f32 {","  var limit: vec3<f32> = vec3<f32>(65536.0);","  if (stepTC.x > 1e-8) { limit.x = (1.0 - p.x) / stepTC.x; }","  else if (stepTC.x < -1e-8) { limit.x = -p.x / stepTC.x; }","  if (stepTC.y > 1e-8) { limit.y = (1.0 - p.y) / stepTC.y; }","  else if (stepTC.y < -1e-8) { limit.y = -p.y / stepTC.y; }","  if (stepTC.z > 1e-8) { limit.z = (1.0 - p.z) / stepTC.z; }","  else if (stepTC.z < -1e-8) { limit.z = -p.z / stepTC.z; }","  return min(limit.x, min(limit.y, limit.z));","}","","fn labelSlabFrontLabel(startTC: vec3<f32>, towardCameraTC: vec3<f32>, halfSlab: f32, stepLen: f32, labelMask: u32) -> i32 {","  let slabSteps: f32 = halfSlab / stepLen;","  let nFront: f32 = min(slabSteps, labelSlabBoxSteps(startTC, towardCameraTC));","  let nBack: f32 = min(slabSteps, labelSlabBoxSteps(startTC, -towardCameraTC));","  var tc: vec3<f32> = startTC + towardCameraTC * nFront;","  let totalSteps: i32 = i32(nFront + nBack) + 1;","  for (var i: i32 = 0; i < 8192; i = i + 1) {","    if (i >= totalSteps) { break; }","    let label: i32 = i32(textureSampleLevel(imgTexture, imgTextureSampler, tc, 0.0).r * 255.0 + 0.5);","    if (label > 0 && label < 32 && (labelMask & (1u << u32(label))) != 0u) { return label; }","    tc = tc - towardCameraTC;","  }","  return 0;","}"]}function Kp(){return["      var slabOutline: vec4<f32> = vec4<f32>(0.0);","      if (i32(mapperUBO.SlabType) != 1 || computedColor.r >= 0.5 / 255.0) {","        let slabNormal: vec3<f32> = normalize(input.normalWC);","        let outlineStepTC: vec3<f32> = (mapperUBO.SCTCMatrix * vec4<f32>(slabNormal * mapperUBO.SlabSampleStep, 0.0)).xyz;","        let halfSlab: f32 = mapperUBO.SlabThickness * 0.5;","        let centerMask: u32 = labelSlabMask(sampleCoord, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep);","        if (centerMask != 0u) {","          let outlineDims: vec2<i32> = vec2<i32>(textureDimensions(labelOutlineThickness, 0));","          let labelmapRow: f32 = 0.5 / f32(outlineDims.y);","          var edgeLabels: u32 = 0u;","          var prevThickness: i32 = -1;","          var neighborMask: u32 = 0u;","          for (var s: i32 = 1; s < 32; s = s + 1) {","            if ((centerMask & (1u << u32(s))) == 0u) { continue; }","            let thicknessCoord: vec2<f32> = vec2<f32>((f32(s) - 0.5) / f32(outlineDims.x), labelmapRow);","            let segmentThickness: i32 = max(1, i32(textureSampleLevel(labelOutlineThickness, labelOutlineThicknessSampler, thicknessCoord, 0.0).r * 255.0));","            if (segmentThickness != prevThickness) {","              let outlineOffset1: vec3<f32> = mapperUBO.OutlineTangent1_0.xyz * mapperUBO.OutlineTexelSize_0.xyz * f32(segmentThickness);","              let outlineOffset2: vec3<f32> = mapperUBO.OutlineTangent2_0.xyz * mapperUBO.OutlineTexelSize_0.xyz * f32(segmentThickness);","              neighborMask =","                labelSlabMask(sampleCoord + outlineOffset1, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep) &","                labelSlabMask(sampleCoord - outlineOffset1, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep) &","                labelSlabMask(sampleCoord + outlineOffset2, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep) &","                labelSlabMask(sampleCoord - outlineOffset2, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep);","              prevThickness = segmentThickness;","            }","            if ((neighborMask & (1u << u32(s))) == 0u) { edgeLabels = edgeLabels | (1u << u32(s)); }","          }","          let slabNormalTowardCamera: f32 = (rendererUBO.SCVCMatrix * vec4<f32>(slabNormal, 0.0)).z;","          let towardCameraTC: vec3<f32> = select(-outlineStepTC, outlineStepTC, slabNormalTowardCamera > 0.0);","          if (edgeLabels != 0u) {","            var edgeLabel: i32 = labelSlabFrontLabel(sampleCoord, towardCameraTC, halfSlab, mapperUBO.SlabSampleStep, edgeLabels);","            if (edgeLabel == 0) {","              for (var s: i32 = 1; s < 32; s = s + 1) {","                if ((edgeLabels & (1u << u32(s))) != 0u) { edgeLabel = s; break; }","              }","            }","            let labelValue: f32 = f32(edgeLabel) / 255.0;","            let edgeColor: vec3<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(labelValue * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5), 0.0).rgb;","            let opacityCoord: vec2<f32> = vec2<f32>((f32(edgeLabel) - 0.5) / f32(outlineDims.x), labelmapRow);","            let edgeOpacity: f32 = textureSampleLevel(labelOutlineOpacity, labelOutlineOpacitySampler, opacityCoord, 0.0).r;","            slabOutline = vec4<f32>(edgeColor, edgeOpacity);","          } else {","            let fillLabel: i32 = labelSlabFrontLabel(sampleCoord, towardCameraTC, halfSlab, mapperUBO.SlabSampleStep, centerMask);","            let fillValue: f32 = select(computedColor.r, f32(fillLabel) / 255.0, fillLabel != 0);","            let fillColor: vec3<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(fillValue * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5), 0.0).rgb;","            let fillOpacity: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, vec2<f32>(fillValue * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5), 0.0).r;","            slabOutline = vec4<f32>(fillColor, fillOpacity * mapperUBO.Opacity);","          }","        }","      }","      computedColor = slabOutline;"]}function Hp(t,e,a){const r=t.renderable.getSlabThickness()>0,n=t.multiTexturePerVolumeEnabled?`      var rawValue: vec4<f32> = ${a("input.worldPosVS")};`:"      var rawValue: vec4<f32> = textureSampleLevel(imgTexture, imgTextureSampler, sampleCoord, 0.0);",s=[`    let sampleCoord: ${e.sampleCoordType} = input.tcoordVS;`,"    var computedColor: vec4<f32>;",`    if (!(${e.coordBounds})) {`,"      computedColor = mapperUBO.BackgroundColor;","    } else {",n];if(r){let i="textureSampleLevel(imgTexture, imgTextureSampler, coordNeg, 0.0)",o="textureSampleLevel(imgTexture, imgTextureSampler, coordPos, 0.0)";t.multiTexturePerVolumeEnabled&&(i=a("worldNeg"),o=a("worldPos")),s.push("      if (mapperUBO.SlabThickness > 0.0) {","        var numSlices: i32 = 1;","        var distTraveled: f32 = mapperUBO.SlabSampleStep;","        var trapezoid: i32 = 0;","        let slabNormal: vec3<f32> = normalize(input.normalWC);","        while (distTraveled < mapperUBO.SlabThickness * 0.5) {","          distTraveled = distTraveled + mapperUBO.SlabSampleStep;","          let fnumSlices: f32 = f32(numSlices);","          var localStep: f32 = fnumSlices * mapperUBO.SlabSampleStep;","          if (distTraveled > mapperUBO.SlabThickness * 0.5) {","            localStep = mapperUBO.SlabThickness * 0.5;","            trapezoid = i32(mapperUBO.SlabTrapezoid);","          }","          let worldNeg: vec3<f32> = input.worldPosVS - localStep * slabNormal;",`          let coordNeg: ${e.sampleCoordType} = ${e.coordFromWorldNeg};`,`          if (${e.negBounds}) {`,`            rawValue = vtkCompositeSlab(rawValue, ${i}, i32(mapperUBO.SlabType), trapezoid);`,"            numSlices += 1;","          }","          let worldPos: vec3<f32> = input.worldPosVS + localStep * slabNormal;",`          let coordPos: ${e.sampleCoordType} = ${e.coordFromWorldPos};`,`          if (${e.posBounds}) {`,`            rawValue = vtkCompositeSlab(rawValue, ${o}, i32(mapperUBO.SlabType), trapezoid);`,"            numSlices += 1;","          }","        }","        if (i32(mapperUBO.SlabType) == 2) {","          rawValue = rawValue / f32(numSlices);","        }","      }")}return s.push("      computedColor = rawValue;","      //VTK::Image::Sample","    }"),s}function jp(t,e){const a=[];for(let r=0;r<t;r++)e.has(r)||a.push(r);for(let r=0;r<t;r++)e.has(r)&&a.push(r);return a}function qp(t){return new Map(t.map(({arrayIndex:e},a)=>[e,a]))}function Yp(t,e,a){const r=Fn(t.dimensions);return a?Ii(t)?Kp():["      let centerValue: f32 = computedColor.r;","      let segmentIndex: u32 = u32(centerValue * 255.0);","      if (segmentIndex == 0u) {","        computedColor = vec4<f32>(0.0, 0.0, 0.0, 0.0);","      } else {","        let outlineDims: vec2<i32> = vec2<i32>(textureDimensions(labelOutlineThickness, 0));","        let textureCoordinate: f32 = (f32(segmentIndex) - 0.5) / f32(outlineDims.x);","        let labelmapRow: f32 = 0.5 / f32(outlineDims.y);","        let thicknessValue: f32 = textureSampleLevel(labelOutlineThickness, labelOutlineThicknessSampler, vec2<f32>(textureCoordinate, labelmapRow), 0.0).r;","        let outlineOpacity: f32 = textureSampleLevel(labelOutlineOpacity, labelOutlineOpacitySampler, vec2<f32>(textureCoordinate, labelmapRow), 0.0).r;","        let actualThickness: i32 = i32(thicknessValue * 255.0);","        let scalar: f32 = centerValue;","        let colorCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","        let tColor: vec4<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","        let opacityCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5);","        let scalarOpacity: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","        var pixelOnBorder: bool = false;","        for (var i: i32 = -actualThickness; i <= actualThickness; i++) {","          for (var j: i32 = -actualThickness; j <= actualThickness; j++) {","            if (i == 0 && j == 0) { continue; }",`            let neighborCoord: ${e.sampleCoordType} = sampleCoord + f32(i) * mapperUBO.OutlineTangent1_0.${r} * mapperUBO.OutlineTexelSize_0.${r} + f32(j) * mapperUBO.OutlineTangent2_0.${r} * mapperUBO.OutlineTexelSize_0.${r};`,`            if (!(${e.coordBounds.replace(/sampleCoord/g,"neighborCoord")})) {`,"              pixelOnBorder = true;","              break;","            }","            let neighborValue: f32 = textureSampleLevel(imgTexture, imgTextureSampler, neighborCoord, 0.0).r;","            if (neighborValue != centerValue) {","              pixelOnBorder = true;","              break;","            }","          }","          if (pixelOnBorder) { break; }","        }","        if (pixelOnBorder) {","          computedColor = vec4<f32>(tColor.rgb, outlineOpacity);","        } else {","          computedColor = vec4<f32>(tColor.rgb, scalarOpacity * mapperUBO.Opacity);","        }","      }"]:["      let scalar: f32 = computedColor.r;","      let colorCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","      let tColor: vec4<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","      let opacityCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5);","      let scalarOpacity: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","      computedColor = vec4<f32>(tColor.rgb, scalarOpacity * mapperUBO.Opacity);"]}function Zp(t,e){const a=qp(t.labelOutlineProperties),r=jp(t.numberOfComponents,a),n=Fn(t.dimensions),s=["      var convergentColor: vec4<f32> = vec4<f32>(0.0);"];for(let i=0;i<t.numberOfComponents;i++){const o=`${2*i}.0 / f32(textureDimensions(tfunTexture, 0).y) + 0.5 / f32(textureDimensions(tfunTexture, 0).y)`;s.push(`      let scalar${i}: f32 = computedColor.${Fp[i]};`,`      let colorCoord${i}: vec2<f32> = vec2<f32>(scalar${i} * mapperUBO.cScale[${i}] + mapperUBO.cShift[${i}], ${o});`,`      let tColor${i}: vec4<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord${i}, 0.0);`,`      let opacityCoord${i}: vec2<f32> = vec2<f32>(scalar${i} * mapperUBO.oScale[${i}] + mapperUBO.oShift[${i}], ${o});`,`      let alpha${i}: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord${i}, 0.0).r * mapperUBO.componentWeight[${i}] * mapperUBO.Opacity;`)}for(let i=0;i<r.length;i++){const o=r[i];if(a.has(o)){const c=En(o),u=a.get(o);s.push(`      let segmentIndex${o}: u32 = u32(scalar${o} * 255.0);`,`      if (segmentIndex${o} > 0u) {`,`        let sampleCoord${o}: ${e.sampleCoordType} = (mapperUBO.${At(o)} * vec4<f32>(input.worldPosVS, 1.0)).${n};`,`        let outlineDims${o}: vec2<i32> = vec2<i32>(textureDimensions(labelOutlineThickness, 0));`,`        let textureCoordinate${o}: f32 = (f32(segmentIndex${o}) - 0.5) / f32(outlineDims${o}.x);`,`        let labelmapRow${o}: f32 = (${u}.0 + 0.5) / f32(outlineDims${o}.y);`,`        let thickness${o}: i32 = i32(textureSampleLevel(labelOutlineThickness, labelOutlineThicknessSampler, vec2<f32>(textureCoordinate${o}, labelmapRow${o}), 0.0).r * 255.0);`,`        let outlineOpacity${o}: f32 = textureSampleLevel(labelOutlineOpacity, labelOutlineOpacitySampler, vec2<f32>(textureCoordinate${o}, labelmapRow${o}), 0.0).r;`,`        var pixelOnBorder${o}: bool = false;`,`        for (var ii${o}: i32 = -thickness${o}; ii${o} <= thickness${o}; ii${o}++) {`,`          for (var jj${o}: i32 = -thickness${o}; jj${o} <= thickness${o}; jj${o}++) {`,`            if (ii${o} == 0 && jj${o} == 0) { continue; }`,`            let neighborCoord${o}: ${e.sampleCoordType} = sampleCoord${o} + f32(ii${o}) * mapperUBO.${Lr(o)}.${n} * mapperUBO.${Gt(o)}.${n} + f32(jj${o}) * mapperUBO.${Rr(o)}.${n} * mapperUBO.${Gt(o)}.${n};`,`            if (!(${e.coordBounds.replace(/sampleCoord/g,`neighborCoord${o}`)})) { pixelOnBorder${o} = true; break; }`,`            let neighborValue${o}: f32 = textureSampleLevel(${c}, ${c}Sampler, neighborCoord${o}, 0.0).r;`,`            if (neighborValue${o} != scalar${o}) { pixelOnBorder${o} = true; break; }`,"          }",`          if (pixelOnBorder${o}) { break; }`,"        }",`        let finalAlpha${o}: f32 = select(alpha${o}, outlineOpacity${o}, pixelOnBorder${o});`,`        convergentColor = vec4<f32>(mix(convergentColor.rgb, tColor${o}.rgb, finalAlpha${o}), max(convergentColor.a, finalAlpha${o}));`,"      }")}else s.push(`      convergentColor = vec4<f32>(mix(convergentColor.rgb, tColor${o}.rgb, alpha${o}), max(convergentColor.a, alpha${o}));`)}return s.push("      computedColor = convergentColor;"),s}function Xp(t){switch(t){case ie.DEPENDENT_LA:return["      let rawColor: vec4<f32> = computedColor;","      let intensity: f32 = rawColor.r * mapperUBO.cScale.r + mapperUBO.cShift.r;","      let tColor: vec4<f32> =","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(intensity, 0.5), 0.0);","      computedColor = vec4<f32>(","        tColor.rgb,","        rawColor.g * mapperUBO.oScale.r + mapperUBO.oShift.r);"];case ie.DEPENDENT_RGB:return["      let rawColor: vec4<f32> =","        computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","      computedColor = vec4<f32>(","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","        mapperUBO.Opacity);"];case ie.DEPENDENT_RGBA:return["      let rawColor: vec4<f32> =","        computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","      computedColor = vec4<f32>(","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","        rawColor.a);"];default:return["      let scalar: f32 = computedColor.r;","      let colorCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","      computedColor = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);"]}}function Qp(t){const e=t.currentInput;Ce(xe,e.getIndexToWorld()),we(xe,xe,[-.5,-.5,-.5]),Pt(xe,xe,e.getDimensions()),Se(xe,xe),t.UBO.setArray("SCTCMatrix",xe);for(let a=1;a<kn;a++){const r=t.currentValidInputs[a]?.imageData;r?(Ce(xe,r.getIndexToWorld()),we(xe,xe,[-.5,-.5,-.5]),Pt(xe,xe,r.getDimensions()),Se(xe,xe),t.UBO.setArray(At(a),xe)):t.UBO.setArray(At(a),Z(xe))}}function Jp(t,e){const{planeNormal:a,tangent1:r,tangent2:n}=li(e,Ep);t.UBO.setArray("PlaneNormalWC",kt(Ei,a[0],a[1],a[2]));for(let s=0;s<kn;s++){const i=t.currentValidInputs[s]?.imageData;if(i){const{tangent1:o,tangent2:c,texelSize:u}=xn(i,r,n,Pp);t.UBO.setArray(Lr(s),kt(on,o[0],o[1],o[2])),t.UBO.setArray(Rr(s),kt(on,c[0],c[1],c[2])),t.UBO.setArray(Gt(s),kt(on,u[0],u[1],u[2]))}else t.UBO.setArray(Lr(s),sn),t.UBO.setArray(Rr(s),sn),t.UBO.setArray(Gt(s),sn)}}function eg(t,e,a,r){en.fill(1),tn.fill(0),rn.fill(1),nn.fill(0),an.fill(1);const{numberOfComponents:n,independentComponents:s}=r;for(let i=0;i<n;i++){const o=t.multiTexturePerVolumeEnabled?i:Le.IMAGE,c=t.textureViews[o].getTexture().getScale();let u=a;t.multiTexturePerVolumeEnabled&&t.currentValidInputs[i]&&(u=_e(e,t.currentValidInputs[i].inputIndex));const p=u.getColorWindow(),l=u.getColorLevel();let f=0;!t.multiTexturePerVolumeEnabled&&s&&(f=i);const g=u.getRGBTransferFunction(f),h=ci({colorWindow:p,colorLevel:l,useLookupTableScalarRange:u.getUseLookupTableScalarRange(),colorRange:g?.getRange?.(),volumeScale:c,volumeOffset:0}),d=ui({pwfRange:u.getPiecewiseFunction(f)?.getRange?.(),volumeScale:c,volumeOffset:0});en[i]=h.colorScale,tn[i]=h.colorShift,rn[i]=d.opacityScale,nn[i]=d.opacityShift,an[i]=u.getComponentWeight(f)}t.UBO.setArray("cScale",en),t.UBO.setArray("cShift",tn),t.UBO.setArray("oScale",rn),t.UBO.setArray("oShift",nn),t.UBO.setArray("componentWeight",an),t.UBO.setValue("Opacity",a.getOpacity())}function tg(t,e){e.classHierarchy.push("vtkWebGPUImageResliceMapper"),t.buildPass=a=>{a&&(e.WebGPUImageSlice=t.getFirstAncestorOfType("vtkWebGPUImageSlice"),e.WebGPURenderer=e.WebGPUImageSlice.getFirstAncestorOfType("vtkWebGPURenderer"),e.WebGPURenderWindow=e.WebGPURenderer.getParent(),e.device=e.WebGPURenderWindow.getDevice())},t.render=()=>{e.renderable.update();const{currentValidInputs:a,labelOutlineProperties:r}=Ip(e.WebGPUImageSlice.getRenderable(),e.renderable);if(e.currentValidInputs=a,!e.currentValidInputs.length){Ma("No input!");return}e.labelOutlineProperties=r;const n=e.currentValidInputs.length,s=e.currentValidInputs[0].imageData,i=s.getPointData().getScalars();e.multiTexturePerVolumeEnabled=n>1,e.numberOfComponents=e.multiTexturePerVolumeEnabled?n:i.getNumberOfComponents(),e.currentInput=s,t.updateResliceGeometry(),t.prepareToDraw(e.WebGPURenderer.getRenderEncoder()),e.numberOfVertices&&e.renderEncoder.registerDrawCallback(e.pipeline,t.draw)},t.computePipelineHash=()=>{const a=e.currentInput.getExtent(),r=t.getImageState(),n=e.WebGPUImageSlice.getRenderable();a[0]===a[1]||a[2]===a[3]||a[4]===a[5]?(e.dimensions=2,e.pipelineHash="reslice2"):(e.dimensions=3,e.pipelineHash="reslice3"),e.pipelineHash+=r.textureChannelMode,r.useLabelOutline&&(e.pipelineHash+="outline"),e.pipelineHash+=`ind${r.independentComponents?1:0}`,e.pipelineHash+=`slab${e.renderable.getSlabThickness()>0?1:0}`,e.pipelineHash+=`norm${e.vertexInput.hasAttribute("vertexNormal")?1:0}`,e.multiTexturePerVolumeEnabled&&(e.pipelineHash+=`multi${e.numberOfComponents}`),e.pipelineHash+=`in${e.currentValidInputs.length}`,e.pipelineHash+=`lbl${Np(n,e.currentValidInputs)}`,e.pipelineHash+=`comp${e.numberOfComponents}`,e.pipelineHash+=e.renderEncoder.getPipelineHash()},t.updateResliceGeometry=()=>{const a=e.currentInput,{resGeomString:r,slicePD:n,slicePlane:s,orthoSlicing:i,orthoAxis:o}=pi(e.renderable,a);if(!(e.resliceGeom&&e.resliceGeomUpdateString===r)){if(n)e.resliceGeom||(e.resliceGeom=Re.newInstance()),e.resliceGeom.getPoints().setData(n.getPoints().getData(),3),e.resliceGeom.getPolys().setData(n.getPolys().getData(),1),e.resliceGeom.getPointData().setNormals(n.getPointData().getNormals());else if(s&&a)if(e.resliceGeom||(e.resliceGeom=Re.newInstance()),i){const{points:c,polys:u,normalsData:p}=di(a,s,o,e.transform);e.resliceGeom.getPoints().setData(c,3),e.resliceGeom.getPolys().setData(u,1),e.resliceGeom.getPointData().setNormals(ce.newInstance({numberOfComponents:3,values:p,name:"Normals"}))}else{const{points:c,polys:u,normalsData:p}=gi(a,s,e.outlineFilter,e.cutter,e.lineToSurfaceFilter);e.resliceGeom.getPoints().setData(c,3),e.resliceGeom.getPolys().setData(u,1);const l=ce.newInstance({numberOfComponents:3,values:p,name:"Normals"});e.resliceGeom.getPointData().setNormals(l)}else{Ma("Unable to build reslice geometry.");return}e.resliceGeomUpdateString=r,e.resliceGeom.modified()}},t.updateGeometryBuffers=()=>{const a=e.resliceGeom,r=a?.getPoints(),n=a?.getPolys();if(!r||!n||!n.getNumberOfValues()){Da(t,e);return}const s=e.device,i=s.getBufferManager().getBuffer({hash:`ResliceIdx${n.getMTime()}${r.getNumberOfPoints()}`,usage:Gr.Index,cells:n,numberOfPoints:r.getNumberOfPoints(),primitiveType:Yi.Triangles,representation:bt.SURFACE});if(!i||!i.getFlatSize()||!i.getIndexCount()){Da(t,e);return}e.vertexInput.setIndexBuffer(i),e.vertexInput.addBuffer(s.getBufferManager().getBuffer({hash:`ReslicePts${r.getMTime()}I${i.getMTime()}float32x4`,usage:Gr.PointArray,format:"float32x4",dataArray:r,indexBuffer:i,shift:0,packExtra:!0}),["vertexBC"]);const o=e.renderable.getSlabThickness()>0,c=o?a.getPointData().getNormals():null;o&&c?e.vertexInput.addBuffer(s.getBufferManager().getBuffer({hash:`ResliceNorm${c.getMTime()}I${i.getMTime()}float32x3`,usage:Gr.PointArray,format:"float32x3",dataArray:c,indexBuffer:i}),["vertexNormal"]):e.vertexInput.removeBufferIfPresent("vertexNormal"),t.setTopology("triangle-list"),t.setNumberOfVertices(i.getIndexCount())},t.updateUBO=()=>{const a=e.WebGPUImageSlice.getRenderable(),r=_e(a,e.currentValidInputs[0].inputIndex),n=a.getMapper(),s=n.getSlicePlane(),i=e.WebGPURenderer.getStabilizedCenterByReference(),o=t.getImageState();Qp(e),e.UBO.setArray("StabilizedCenter",kt(Ei,i[0],i[1],i[2])),e.UBO.setArray("BackgroundColor",e.renderable.getBackgroundColorByReference());const c=e.currentInput.getSpacing(),u=.5*Math.min(c[0],c[1],c[2]);e.UBO.setValue("SlabThickness",n.getSlabThickness()),e.UBO.setValue("SlabType",n.getSlabType()),e.UBO.setValue("SlabTrapezoid",n.getSlabTrapezoidIntegration()),e.UBO.setValue("SlabSampleStep",u),Jp(e,s),eg(e,a,r,o),e.UBO.setValue("PropID",e.WebGPUImageSlice.getPropID());const p=t.getCoincidentParameters();e.UBO.setValue("CoincidentFactor",p.factor),e.UBO.setValue("CoincidentOffset",p.offset),e.UBO.sendIfNeeded(e.device)},t.updateBuffers=()=>{if(t.updateGeometryBuffers(),!e.currentInput||!e.numberOfVertices)return;const a=e.WebGPUImageSlice.getRenderable(),r=e.currentValidInputs.length;if(e.multiTexturePerVolumeEnabled)for(let s=0;s<r;s++){const{imageData:i,inputIndex:o}=e.currentValidInputs[s];La(t,e,a,i,o,s)}else{const{imageData:s,inputIndex:i}=e.currentValidInputs[0];La(t,e,a,s,i,0)}for(let s=r;s<e.scalarTextures.length;s++)e.scalarTextures[s]=null;e.imageState=t.computeImageState(),t.updateLUTImage(),t.updateOpacityLUTImage(),e.imageState.useLabelOutline?(t.updateLabelOutlineThicknessTexture(),t.updateLabelOutlineOpacityTexture()):(e._labelOutlineThicknessHash=null,e._labelOutlineOpacityHash=null);const n=e.imageState.useLabelOutline?Ba(e):Pn(e);e.textureViews.length=Math.min(e.textureViews.length,n+1),t.updateUBO()},t.replaceShaderPosition=(a,r,n)=>{const s=r.getShaderDescription("vertex");s.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),s.addOutput("vec4<f32>","vertexSC");const i=e.renderable.getSlabThickness()>0;let o=s.getCode();const c=["var vertexWC: vec4<f32> = vec4<f32>(vertexBC.xyz, 1.0);","var vertexSC: vec4<f32> = vertexWC - mapperUBO.StabilizedCenter;","vertexSC.w = 1.0;"];e.dimensions===2?c.push("output.tcoordVS = (mapperUBO.SCTCMatrix * vertexWC).xy;"):c.push("output.tcoordVS = (mapperUBO.SCTCMatrix * vertexWC).xyz;"),c.push("output.worldPosVS = vertexWC.xyz;"),i&&c.push(n.hasAttribute("vertexNormal")?"output.normalWC = normalize(vertexNormal);":"output.normalWC = mapperUBO.PlaneNormalWC.xyz;"),c.push("output.vertexSC = vertexSC;","var pos: vec4<f32> = rendererUBO.SCPCMatrix * vertexSC;","pos.z = clamp(pos.z - 0.000016 * mapperUBO.CoincidentOffset * pos.w, 0.0, pos.w);","output.Position = pos;"),o=G.substitute(o,"//VTK::Position::Impl",c).result,s.setCode(o)},t.getShaderReplacements().set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderTCoord=(a,r,n)=>{const s=r.getShaderDescription("vertex");e.dimensions===2?s.addOutput("vec2<f32>","tcoordVS"):s.addOutput("vec3<f32>","tcoordVS"),s.addOutput("vec3<f32>","worldPosVS"),e.renderable.getSlabThickness()>0&&s.addOutput("vec3<f32>","normalWC")},t.getShaderReplacements().set("replaceShaderTCoord",t.replaceShaderTCoord),t.replaceShaderImage=(a,r,n)=>{const s=r.getShaderDescription("fragment");let i=s.getCode();const o=t.getImageState(),c=e.currentValidInputs.length,u=_p(e.dimensions),p=f=>Wp(e,c,f),l=zp();switch(o.useLabelOutline&&Ii(e)&&l.push(...$p()),i=G.substitute(i,"//VTK::Image::Dec",l).result,i=G.substitute(i,"//VTK::Image::Sample",Hp(e,u,p)).result,o.textureChannelMode){case ie.SINGLE:case ie.INDEPENDENT_1:i=G.substitute(i,"//VTK::Image::Sample",Yp(e,u,o.useLabelOutline)).result;break;case ie.INDEPENDENT_2:case ie.INDEPENDENT_3:case ie.INDEPENDENT_4:i=G.substitute(i,"//VTK::Image::Sample",Zp(e,u)).result;break;default:i=G.substitute(i,"//VTK::Image::Sample",Xp(o.textureChannelMode)).result;break}s.setCode(i)},t.getShaderReplacements().set("replaceShaderImage",t.replaceShaderImage),t.updateLabelOutlineThicknessTexture=()=>{if(!e.labelOutlineProperties.length)return;const{dataArrays:a,hash:r,width:n,height:s}=dr(e.labelOutlineProperties,p=>p.getLabelOutlineThicknessByReference()),i=Ra(e,n),o=`${r}-${i}`;if(o===e._labelOutlineThicknessHash)return;e._labelOutlineThicknessHash=o;const c=new Uint8Array(i*s);cn(c,a,i);const u=e.device.getTextureManager().getTexture({hash:`irm-outline-thickness-${o}`,nativeArray:c,width:i,height:s,depth:1,format:"r8unorm",usage:Ua()}).createView("labelOutlineThickness");t.ensureTextureSampler(u,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[Fi(e)]=u},t.updateLabelOutlineOpacityTexture=()=>{if(!e.labelOutlineProperties.length)return;const{dataArrays:a,hash:r,width:n,height:s}=dr(e.labelOutlineProperties,p=>{const l=p.getLabelOutlineOpacity();return typeof l=="number"?[l]:l}),i=Ra(e,n),o=`${r}-${i}`;if(o===e._labelOutlineOpacityHash)return;e._labelOutlineOpacityHash=o;const c=new Float32Array(i*s);cn(c,a,i);const u=e.device.getTextureManager().getTexture({hash:`irm-outline-opacity-${o}`,nativeArray:c,width:i,height:s,depth:1,format:"r16float",usage:Ua()}).createView("labelOutlineOpacity");t.ensureTextureSampler(u,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[Ba(e)]=u}}var rg={currentValidInputs:null,resliceGeom:null,resliceGeomUpdateString:null,multiTexturePerVolumeEnabled:!1,numberOfComponents:0,labelOutlineProperties:[],_labelOutlineThicknessHash:null,_labelOutlineOpacityHash:null,scalarTextures:[]};function ng(t,e,a={}){Object.assign(e,rg,a),bf.extend(t,e,a),I.get(t,e,["scalarTextures"]);const r=t.computeImageState;t.computeImageState=()=>{if(e.multiTexturePerVolumeEnabled&&e.currentValidInputs?.length){const o=_e(e.WebGPUImageSlice.getRenderable(),e.currentValidInputs[0].inputIndex),c=!0;return{actorProperty:o,numberOfComponents:e.numberOfComponents,independentComponents:c,numberOfIComponents:e.numberOfComponents,useLabelOutline:e.labelOutlineProperties.length>0,textureChannelMode:Li(c,e.numberOfComponents)}}const i=r();return i.useLabelOutline=e.labelOutlineProperties.length>0,i};const n=t.updateLUTImage;t.updateLUTImage=()=>{if(!e.multiTexturePerVolumeEnabled){n();return}const i=t.getImageState(),o=e.WebGPUImageSlice.getRenderable(),c=i.numberOfIComponents,u=pa({currentValidInputs:e.currentValidInputs,independentComponents:!0,numberOfRows:c,kind:"color",getInputProperty:d=>_e(o,d)});if(e.colorTextureString===u)return;e.numRows=c;const p=e.numRows*2*e.rowLength*4;(!e.colorLUTArray||e.colorLUTArray.length!==p)&&(e.colorLUTArray=new Uint8ClampedArray(p));const l=e.colorLUTArray,f=e.colorTmpTable,g=e.rowLength*4;l.fill(0);for(let d=0;d<c;d++){const v=_e(o,e.currentValidInputs[d].inputIndex)?.getRGBTransferFunction(0);if(v){const x=v.getRange();v.getTable(x[0],x[1],e.rowLength,f,1);const C=d*g*2;for(let T=0;T<e.rowLength;T++){const m=C+T*4,w=m+g;l[m]=255*f[T*3],l[m+1]=255*f[T*3+1],l[m+2]=255*f[T*3+2],l[m+3]=255,l[w]=l[m],l[w+1]=l[m+1],l[w+2]=l[m+2],l[w+3]=l[m+3]}}}const h=e.device.getTextureManager().getTexture({hash:`irm-color-${u}`,nativeArray:l,width:e.rowLength,height:e.numRows*2,depth:1,format:"rgba8unorm"}).createView("tfunTexture");t.ensureTextureSampler(h,{minFilter:"linear",magFilter:"linear"}),e.textureViews[Pi(e)]=h,e.colorTextureString=u};const s=t.updateOpacityLUTImage;t.updateOpacityLUTImage=()=>{if(!e.multiTexturePerVolumeEnabled){s();return}const i=t.getImageState(),o=e.WebGPUImageSlice.getRenderable(),c=i.numberOfIComponents,u=pa({currentValidInputs:e.currentValidInputs,independentComponents:!0,numberOfRows:c,kind:"opacity",getInputProperty:h=>_e(o,h)});if(e.opacityTextureString===u)return;e.numRows=c;const p=e.numRows*2*e.rowLength;(!e.opacityLUTArray||e.opacityLUTArray.length!==p)&&(e.opacityLUTArray=new Float32Array(p));const l=e.opacityLUTArray,f=e.opacityTmpTable;l.fill(1);for(let h=0;h<c;h++){const d=_e(o,e.currentValidInputs[h].inputIndex)?.getPiecewiseFunction(0);if(d){const v=d.getRange();d.getTable(v[0],v[1],e.rowLength,f,1);const x=h*e.rowLength*2,C=x+e.rowLength;for(let T=0;T<e.rowLength;T++)l[x+T]=f[T],l[C+T]=f[T]}}const g=e.device.getTextureManager().getTexture({hash:`irm-opacity-${u}`,nativeArray:l,width:e.rowLength,height:e.numRows*2,depth:1,format:"r16float"}).createView("ofunTexture");t.ensureTextureSampler(g,{minFilter:"linear",magFilter:"linear"}),e.textureViews[Pn(e)]=g,e.opacityTextureString=u},t.setScalarTextures=(i=[])=>{e.scalarTextures=[...i],t.modified()},t.releaseGraphicsResources=()=>{e.vertexInput.releaseGraphicsResources(),e.textureViews.length=0,e.imageState=null,e.pipelineHash=null,e._labelOutlineThicknessHash=null,e._labelOutlineOpacityHash=null,e.colorTextureString=null,e.opacityTextureString=null},e.UBO.addEntry("StabilizedCenter","vec4<f32>"),e.UBO.addEntry("BackgroundColor","vec4<f32>"),e.UBO.addEntry("PlaneNormalWC","vec4<f32>");for(let i=0;i<4;i++)i>0&&e.UBO.addEntry(At(i),"mat4x4<f32>"),e.UBO.addEntry(Lr(i),"vec4<f32>"),e.UBO.addEntry(Rr(i),"vec4<f32>"),e.UBO.addEntry(Gt(i),"vec4<f32>");e.UBO.addEntry("SlabThickness","f32"),e.UBO.addEntry("SlabType","f32"),e.UBO.addEntry("SlabTrapezoid","f32"),e.UBO.addEntry("SlabSampleStep","f32"),e.UBO.addEntry("PropID","u32"),e.outlineFilter=si.newInstance(),e.cutter=ni.newInstance(),e.lineToSurfaceFilter=ii.newInstance(),e.transform=ti.newInstance(),tg(t,e),t.delete=I.chain(()=>{t.releaseGraphicsResources(),e.outlineFilter?.delete?.(),e.cutter?.delete?.(),e.lineToSurfaceFilter?.delete?.(),e.transform?.delete?.()},t.delete)}var ag=I.newInstance(ng,"vtkWebGPUImageResliceMapper");he("vtkImageResliceMapper",ag);
