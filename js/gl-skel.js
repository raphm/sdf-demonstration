

// This small file wraps up some basic webgl functionality.

var gl;
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var currentlyPressedKeys = {};

function mvPushMatrix() {
  mvMatrixStack.push(mat4.clone(mvMatrix));
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function initShaders(shaderDest, fragSrc, vertSrc) {

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource(fragmentShader, fragSrc);
  gl.shaderSource(vertexShader, vertSrc);

  gl.compileShader(fragmentShader);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log("Fragment shader compile failure.");
    console.log(gl.getShaderInfoLog(fragmentShader));
    alert(gl.getShaderInfoLog(fragmentShader));
    return null;
  }

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log("Vertex shader compile failure.");
    console.log(gl.getShaderInfoLog(vertexShader));
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialize shaders.");
  }

  shaderDest.shaderProgID = shaderProgram;

}

function initUniform(shaderDest, uniform_name) {
  shaderDest[uniform_name] =
    gl.getUniformLocation(shaderDest.shaderProgID, uniform_name);
}

function initAttrib(shaderDest, attrib_name) {
  shaderDest[attrib_name] =
    gl.getAttribLocation(shaderDest.shaderProgID, attrib_name);
}

function setLoadedTextureParams(texture, mag_filter, min_filter, generate_mipmaps) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag_filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min_filter);
  if(generate_mipmaps) {
    gl.generateMipmap(gl.TEXTURE_2D);
  }
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture(img_src, mag_filter, min_filter, generate_mipmaps) {
  var newTex = gl.createTexture();
  newTex.image = new Image();
  newTex.image.onload = function () {
    setLoadedTextureParams(newTex, mag_filter, min_filter, generate_mipmaps);
  }
  newTex.image.src = img_src;
  return newTex;
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}
