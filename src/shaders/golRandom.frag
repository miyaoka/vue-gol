precision mediump float;

float rand(vec2 co){
  return fract(sin(dot(co ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
  gl_FragColor = random(gl_FragCoord.xy) > 0.5
  ? vec4(1.0, 1.0, 1.0, 1.0)
  : vec4(0.0, 0.0, 0.0, 1.0);
}
