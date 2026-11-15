import{m as u}from"./Math-BEu_l5xq.js";function C(t,e){e.classHierarchy.push("vtkTexture"),t.imageLoaded=()=>{e.image.removeEventListener("load",t.imageLoaded),e.imageLoaded=!0,t.modified()},t.setJsImageData=a=>{e.jsImageData!==a&&(a!==null&&(t.setInputData(null),t.setInputConnection(null),e.image=null,e.canvas=null,e.imageBitmap=null),e.jsImageData=a,e.imageLoaded=!0,t.modified())},t.setImageBitmap=a=>{e.imageBitmap!==a&&(a!==null&&(t.setInputData(null),t.setInputConnection(null),e.image=null,e.canvas=null,e.jsImageData=null),e.imageBitmap=a,e.imageLoaded=!0,t.modified())},t.setCanvas=a=>{e.canvas!==a&&(a!==null&&(t.setInputData(null),t.setInputConnection(null),e.image=null,e.imageBitmap=null,e.jsImageData=null),e.canvas=a,t.modified())},t.setImage=a=>{e.image!==a&&(a!==null&&(t.setInputData(null),t.setInputConnection(null),e.canvas=null,e.jsImageData=null,e.imageBitmap=null),e.image=a,e.imageLoaded=!1,a.complete?t.imageLoaded():a.addEventListener("load",t.imageLoaded),t.modified())},t.getDimensionality=()=>{let a=0,i=0,n=1;if(t.getInputData()){const s=t.getInputData();a=s.getDimensions()[0],i=s.getDimensions()[1],n=s.getDimensions()[2]}return e.jsImageData&&(a=e.jsImageData.width,i=e.jsImageData.height),e.canvas&&(a=e.canvas.width,i=e.canvas.height),e.image&&(a=e.image.width,i=e.image.height),e.imageBitmap&&(a=e.imageBitmap.width,i=e.imageBitmap.height),(a>1)+(i>1)+(n>1)},t.getInputAsJsImageData=()=>{if(!e.imageLoaded||t.getInputData())return null;if(e.jsImageData)return e.jsImageData;if(e.imageBitmap)return e.imageBitmap;if(e.canvas)return e.canvas.getContext("2d").getImageData(0,0,e.canvas.width,e.canvas.height);if(e.image){const a=e.image.width,i=e.image.height,n=new OffscreenCanvas(a,i).getContext("2d");return n.translate(0,i),n.scale(1,-1),n.drawImage(e.image,0,0,a,i),n.getImageData(0,0,a,i)}return null}}var L=(t,e,a)=>{const i=t.createShaderModule({code:`
    @group(0) @binding(0) var inputTexture: texture_2d<f32>;
    @group(0) @binding(1) var outputTexture: texture_storage_2d<rgba8unorm, write>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      let texelCoord = vec2<i32>(global_id.xy);
      let outputSize = textureDimensions(outputTexture);

      if (texelCoord.x >= i32(outputSize.x) || texelCoord.y >= i32(outputSize.y)) {
        return;
      }

      let inputSize = textureDimensions(inputTexture);
      let scale = vec2<f32>(inputSize) / vec2<f32>(outputSize);

      // Compute the floating-point source coordinate
      let srcCoord = (vec2<f32>(texelCoord) + 0.5) * scale - 0.5;

      // Get integer coordinates for the four surrounding texels
      let x0 = i32(floor(srcCoord.x));
      let x1 = min(x0 + 1, i32(inputSize.x) - 1);
      let y0 = i32(floor(srcCoord.y));
      let y1 = min(y0 + 1, i32(inputSize.y) - 1);

      // Compute the weights
      let wx = srcCoord.x - f32(x0);
      let wy = srcCoord.y - f32(y0);

      // Fetch the four texels
      let c00 = textureLoad(inputTexture, vec2<i32>(x0, y0), 0);
      let c10 = textureLoad(inputTexture, vec2<i32>(x1, y0), 0);
      let c01 = textureLoad(inputTexture, vec2<i32>(x0, y1), 0);
      let c11 = textureLoad(inputTexture, vec2<i32>(x1, y1), 0);

      // Bilinear interpolation
      let color = mix(
        mix(c00, c10, wx),
        mix(c01, c11, wx),
        wy
      );

      textureStore(outputTexture, texelCoord, color);
    }
  `}),n=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,storageTexture:{format:"rgba8unorm",access:"write-only"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),s=t.createPipelineLayout({bindGroupLayouts:[n]}),g=t.createComputePipeline({label:"ComputeMipmapPipeline",layout:s,compute:{module:i,entryPoint:"main"}}),m=t.createSampler({magFilter:"linear",minFilter:"linear"});for(let r=1;r<a;r++){const c=e.createView({baseMipLevel:r-1,mipLevelCount:1}),f=e.createView({baseMipLevel:r,mipLevelCount:1}),x=t.createBindGroup({layout:g.getBindGroupLayout(0),entries:[{binding:0,resource:c},{binding:1,resource:f},{binding:2,resource:m}]}),l=t.createCommandEncoder({label:"MipmapGenerateCommandEncoder"}),o=l.beginComputePass();o.setPipeline(g),o.setBindGroup(0,x);const h=Math.max(1,e.width>>r),d=Math.max(1,e.height>>r),v=Math.ceil(h/8),y=Math.ceil(d/8);o.dispatchWorkgroups(v,y),o.end(),t.queue.submit([l.finish()])}},w={image:null,canvas:null,jsImageData:null,imageBitmap:null,imageLoaded:!1,repeat:!1,interpolate:!1,edgeClamp:!1,mipLevel:0,resizable:!1};function p(t,e,a={}){Object.assign(e,w,a),u.obj(t,e),u.algo(t,e,6,0),u.get(t,e,["canvas","image","jsImageData","imageBitmap","imageLoaded","resizable"]),u.setGet(t,e,["repeat","edgeClamp","interpolate","mipLevel"]),C(t,e)}var D=u.newInstance(p,"vtkTexture"),T={generateMipmaps:L},B={newInstance:D,extend:p,...T};export{B as T};
