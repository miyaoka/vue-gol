precision mediump float;

uniform sampler2D state;
uniform vec2 scale;

int valueAt(float x, float y) {
  return int(texture2D(state, (gl_FragCoord.xy + vec2(x, y)) / scale).a);
}
bool isAlive() {
  return valueAt(0.0, 0.0) == 1;
}

void main(void) {
  int sum =
  valueAt(-1.0,  1.0) +
  valueAt(-1.0,  0.0) +
  valueAt(-1.0, -1.0) +
  valueAt( 0.0, -1.0) +
  valueAt( 0.0,  1.0) +
  valueAt( 1.0, -1.0) +
  valueAt( 1.0,  0.0) +
  valueAt( 1.0,  1.0);

  vec4 cl = texture2D(state, gl_FragCoord.xy / scale);

  gl_FragColor = (sum == 3 || (sum == 2 && isAlive()))
  ? vec4(0.5, 0.8, 0.5, 1.0)
  // : vec4(0.0, 0.0, 0.0, 0.0);
  // : cl.a < 0.07 ? vec4(0.0, 0.0, 0.0, 0.0) : cl * 0.97;
  : cl.a < 0.07 ? vec4(0.0, 0.0, 0.0, 0.0) : cl * 0.9;
}
