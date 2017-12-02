precision mediump float;

uniform sampler2D texture;
uniform vec2 scale;

void main() {
  gl_FragColor = texture2D(texture, gl_FragCoord.xy / scale);
}
