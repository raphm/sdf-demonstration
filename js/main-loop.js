
// This is the main loop. It sets up the shaders, textures, and buffers,
// and starts drawing.

var time_track = {
  last: undefined,
  delta: 0,
  tick: function () {
    var now = new Date().getTime();
    if(this.last) {
      this.delta = now - this.last;
    }
    this.last = now;
  }
}

function tick() {

  requestAnimFrame(tick);

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  time_track.tick();

  cube.handle_keys();
  cube.draw();
  cube.animate(time_track.delta);

  sdftext.handle_keys();
  sdftext.draw();
  sdftext.animate(time_track.delta)

}

function webGLStart() {

  var canvas = document.getElementById("main-canvas");

  initGL(canvas);

  sdftext.init_shaders();
  sdftext.init_textures();
  sdftext.init_anim();
  sdftext.set_text("This is a test of SDF font rendering.");
  sdftext.init_buffers();
  sdftext.position.x = -11;
  sdftext.position.z = -20;

  cube.init_shaders();
  cube.init_textures();
  cube.init_anim();
  cube.init_buffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  tick();
}
