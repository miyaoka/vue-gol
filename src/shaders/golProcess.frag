precision mediump float;

uniform sampler2D texture;
uniform vec2 scale;

int valueAt(float x, float y) {
  return int(texture2D(texture, (gl_FragCoord.xy + vec2(x, y)) / scale).r);
}
bool isAlive() {
  return valueAt(0.0, 0.0) == 1
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

  if (sum == 3 || (sum == 2 && isAlive())){
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}
