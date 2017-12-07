attribute vec2 quad;

void main(void) {
  gl_Position = vec4(quad, 0, 1.0);
}
