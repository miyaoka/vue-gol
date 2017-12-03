attribute vec2 pos2d;
attribute float size;

void main(void) {
  gl_Position = vec4(pos2d, 0, 1.0);
  gl_PointSize = size;
}
