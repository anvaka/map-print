let wgl = require('w-gl');
let gl_utils = wgl.utils;

export default class MergeCanvasLayer extends wgl.Element {
  constructor(canvas) {
    super();
    this.canvas = canvas;
  }

  draw(gl) {
    if (!this._layer) {
      this._layer = makeLayerPrimitives(gl, this.canvas);
    }

    drawImage(gl, this._layer);
  }
}

let programCache = new Map(); // maps from GL context to program

function makeLayerPrimitives(gl, canvas) {
  const program = makeMergeProgram(gl);
  const locations = gl_utils.getLocations(gl, program);
  const tex = makeTexture(gl, canvas);
  const positionBuffer = makePositionBuffer(gl);

  return {
    program, tex, positionBuffer,
    positionLocation: locations.attributes.a_position,
    textureLocation: locations.uniforms.u_texture
  }
}


function drawImage(gl, ctx) {
  let {tex, program, positionBuffer, textureLocation, positionLocation} = ctx;

  gl.enable(gl.BLEND); 
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.bindTexture(gl.TEXTURE_2D, tex.texture);
 
  // Tell WebGL to use our shader program pair
  gl.useProgram(program);
 
  // Setup the attributes to pull data from our buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(textureLocation, 0);
 
  // draw the quad (2 triangles, 6 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function makePositionBuffer(gl) {
   // Create a buffer.
   var positionBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 
   // Put a unit quad in the buffer
   var positions = [
     0, 0,
     0, 1,
     1, 0,
     1, 0,
     0, 1,
     1, 1,
   ]
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
   return positionBuffer;
}


function makeMergeProgram(gl) {
  let mergeProgram = programCache.get(gl)
  if (mergeProgram) {
    return mergeProgram;
  }

  let vertexShader = gl_utils.compile(gl, gl.VERTEX_SHADER, vertexShaderCode());
  let fragmentShader = gl_utils.compile(gl, gl.FRAGMENT_SHADER, fragmentShaderCode());
  mergeProgram = gl_utils.link(gl, vertexShader, fragmentShader);
  programCache.set(gl, mergeProgram);

  return mergeProgram;
}

function makeTexture(gl, canvas) {
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
 
  // let's assume all images are not a power of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 
  var textureInfo = {
    width: canvas.width,  
    height: canvas.height,
    texture: tex,
  };

  gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
 
  return textureInfo;
}

function vertexShaderCode() {
  return `
attribute vec4 a_position;
// attribute vec2 a_texcoord;
 
// uniform mat4 u_matrix;
varying vec2 v_texcoord;
 
void main() {
  vec2 xy = 1. - 2.0 * a_position.xy;
  gl_Position =  vec4(-xy.x, xy.y, 0.0, 1.0);

  v_texcoord = a_position.xy;
}
`
}

function fragmentShaderCode() {
  return `
  precision mediump float;
 
varying vec2 v_texcoord;
 
uniform sampler2D u_texture;
 
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}
`
}