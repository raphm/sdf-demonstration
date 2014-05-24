

// This code is a heavily edited version of code that originated from
// http://learningwebgl.com/blog/?p=859. It also uses a current version of
// gl-matrix.js (http://glmatrix.net/).


var cube = {};

cube.vert_src = [
"attribute vec3 aVertexPosition;",
"attribute vec3 aVertexNormal;",
"attribute vec2 aTextureCoord;",
"uniform mat4 uMVMatrix;",
"uniform mat4 uPMatrix;",
"uniform mat3 uNMatrix;",
"uniform vec3 uAmbientColor;",
"uniform vec3 uLightingDirection;",
"uniform vec3 uDirectionalColor;",
"uniform bool uUseLighting;",
"varying vec2 vTextureCoord;",
"varying vec3 vLightWeighting;",
"void main(void) {",
"  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
"  vTextureCoord = aTextureCoord;",
"  if (!uUseLighting) {",
"    vLightWeighting = vec3(1.0, 1.0, 1.0);",
"  } else {",
"    vec3 transformedNormal = uNMatrix * aVertexNormal;",
"    float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);",
"    vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;",
"  }",
"}"
].join("\n");

cube.frag_src = [
"precision mediump float;",
"varying vec2 vTextureCoord;",
"varying vec3 vLightWeighting;",
"uniform float uAlpha;",
"uniform sampler2D uSampler;",
"void main(void) {",
"  vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));",
"  gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlpha);",
"}"
].join("\n");

cube.init_shaders = function() {
  cube.shader_prog = {};

  initShaders(cube.shader_prog, cube.frag_src, cube.vert_src);

  initAttrib(cube.shader_prog, "aVertexPosition");
  gl.enableVertexAttribArray(cube.shader_prog["aVertexPosition"]);

  initAttrib(cube.shader_prog, "aVertexNormal");
  gl.enableVertexAttribArray(cube.shader_prog["aVertexNormal"]);

  initAttrib(cube.shader_prog, "aTextureCoord");
  gl.enableVertexAttribArray(cube.shader_prog["aTextureCoord"]);

  initUniform(cube.shader_prog, "uPMatrix");
  initUniform(cube.shader_prog, "uMVMatrix");
  initUniform(cube.shader_prog, "uNMatrix");
  initUniform(cube.shader_prog, "uSampler");
  initUniform(cube.shader_prog, "uUseLighting");
  initUniform(cube.shader_prog, "uAmbientColor");
  initUniform(cube.shader_prog, "uLightingDirection");
  initUniform(cube.shader_prog, "uDirectionalColor");
  initUniform(cube.shader_prog, "uAlpha");
}

cube.init_textures = function() {
  cube.texture = initTexture("mensch.png", gl.NEAREST, gl.NEAREST, false);
  // We do NOT need to load 'mensch.png' here. You can put any texture on
  // the cube, which is simply here for decorative purposes and to serve as
  // a useful demonstration of animation and lighting.
}

cube.init_anim = function() {
  cube.xRot = 0;
  cube.xSpeed = 3;
  cube.yRot = 0;
  cube.ySpeed = -3;
  cube.z = -5.0;
}

cube.handle_keys = function() {
  if (currentlyPressedKeys[90]) {
    // Z
    cube.z -= 0.05;
  }
  if (currentlyPressedKeys[88]) {
    // X
    cube.z += 0.05;
  }
  if (currentlyPressedKeys[37]) {
    // Left cursor key
    cube.ySpeed -= 1;
  }
  if (currentlyPressedKeys[39]) {
    // Right cursor key
    cube.ySpeed += 1;
  }
  if (currentlyPressedKeys[38]) {
    // Up cursor key
    cube.xSpeed -= 1;
  }
  if (currentlyPressedKeys[40]) {
    // Down cursor key
    cube.xSpeed += 1;
  }
}

cube.animate = function(time_delta) {
  cube.xRot += (cube.xSpeed * time_delta) / 1000.0;
  cube.yRot += (cube.ySpeed * time_delta) / 1000.0;
}

cube.init_buffers = function() {
  cube.vertex_position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_position_buffer);
  vertices = [
  // Front face
  -1.0, -1.0,  1.0,
  1.0, -1.0,  1.0,
  1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
  1.0,  1.0, -1.0,
  1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
  1.0,  1.0,  1.0,
  1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
  1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
  1.0, -1.0, -1.0,
  1.0,  1.0, -1.0,
  1.0,  1.0,  1.0,
  1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  cube.vertex_position_buffer.itemSize = 3;
  cube.vertex_position_buffer.numItems = 24;

  cube.vertex_normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_normal_buffer);
  var vertexNormals = [
  // Front face
  0.0,  0.0,  1.0,
  0.0,  0.0,  1.0,
  0.0,  0.0,  1.0,
  0.0,  0.0,  1.0,

  // Back face
  0.0,  0.0, -1.0,
  0.0,  0.0, -1.0,
  0.0,  0.0, -1.0,
  0.0,  0.0, -1.0,

  // Top face
  0.0,  1.0,  0.0,
  0.0,  1.0,  0.0,
  0.0,  1.0,  0.0,
  0.0,  1.0,  0.0,

  // Bottom face
  0.0, -1.0,  0.0,
  0.0, -1.0,  0.0,
  0.0, -1.0,  0.0,
  0.0, -1.0,  0.0,

  // Right face
  1.0,  0.0,  0.0,
  1.0,  0.0,  0.0,
  1.0,  0.0,  0.0,
  1.0,  0.0,  0.0,

  // Left face
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  cube.vertex_normal_buffer.itemSize = 3;
  cube.vertex_normal_buffer.numItems = 24;

  cube.vertex_texcoord_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_texcoord_buffer);
  var textureCoords = [
  // Front face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,

  // Back face
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,

  // Top face
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,

  // Bottom face
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,

  // Right face
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0,

  // Left face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
  cube.vertex_texcoord_buffer.itemSize = 2;
  cube.vertex_texcoord_buffer.numItems = 24;

  cube.vertex_index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertex_index_buffer);
  var cubeVertexIndices = [
  0, 1, 2,      0, 2, 3,    // Front face
  4, 5, 6,      4, 6, 7,    // Back face
  8, 9, 10,     8, 10, 11,  // Top face
  12, 13, 14,   12, 14, 15, // Bottom face
  16, 17, 18,   16, 18, 19, // Right face
  20, 21, 22,   20, 22, 23  // Left face
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  cube.vertex_index_buffer.itemSize = 1;
  cube.vertex_index_buffer.numItems = 36;
}

cube.draw = function() {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cube.texture);
  gl.useProgram(cube.shader_prog.shaderProgID);
  gl.uniform1i(cube.shader_prog["uSampler"], 0);

  mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

  mat4.identity(mvMatrix);

  mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, cube.z]);

  mat4.rotate(mvMatrix, mvMatrix, degToRad(cube.xRot), [1, 0, 0]);

  mat4.rotate(mvMatrix, mvMatrix, degToRad(cube.yRot), [0, 1, 0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_position_buffer);
  gl.vertexAttribPointer(cube.shader_prog["aVertexPosition"],
    cube.vertex_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_normal_buffer);
  gl.vertexAttribPointer(cube.shader_prog["aVertexNormal"],
    cube.vertex_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertex_texcoord_buffer);
  gl.vertexAttribPointer(cube.shader_prog["aTextureCoord"],
    cube.vertex_texcoord_buffer.itemSize, gl.FLOAT, false, 0, 0);

  var blending = true;
  if (blending) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.uniform1f(cube.shader_prog["uAlpha"], 0.5);
  } else {
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
  }

  var lighting = true;
  gl.uniform1i(cube.shader_prog["uUseLighting"], lighting);

  if (lighting) {

    gl.uniform3f(cube.shader_prog["uAmbientColor"], 0.2, 0.2, 0.2);

    var lightingDirection = [-0.25, -0.25, -1.0];

    var adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, lightingDirection);
    vec3.scale(adjustedLD, adjustedLD, -1);

    gl.uniform3fv(cube.shader_prog["uLightingDirection"], adjustedLD);
    gl.uniform3f(cube.shader_prog["uDirectionalColor"], 1.0, 1.0, 1.0);

  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertex_index_buffer);

  gl.uniformMatrix4fv(cube.shader_prog["uPMatrix"], false, pMatrix);
  gl.uniformMatrix4fv(cube.shader_prog["uMVMatrix"], false, mvMatrix);
  var normalMatrix = mat3.create();
  mat3.normalFromMat4(normalMatrix, mvMatrix);
  gl.uniformMatrix3fv(cube.shader_prog["uNMatrix"], false, normalMatrix);

  gl.drawElements(gl.TRIANGLES, cube.vertex_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
}
