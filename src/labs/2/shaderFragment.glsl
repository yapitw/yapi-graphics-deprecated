uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

bool pixelate(float value, float num) {
  return (value >= num - 1. && value <= num + 2.);
}

void main() {

  vec2 position = gl_FragCoord.xy;

  // vec2 value = texture2D(u_texture, position).rg;
  vec2 value1 = texture2D(u_texture, position).rg;
  vec2 value2 = texture2D(u_texture, position + vec2(-1., 1.)).rg;
  vec2 value3 = texture2D(u_texture, position + vec2(0., 1.)).rg;
  vec2 value4 = texture2D(u_texture, position + vec2(1., 1.)).rg;
  vec2 value5 = texture2D(u_texture, position + vec2(-1., 0.)).rg;
  vec2 value6 = texture2D(u_texture, position + vec2(1., 0.)).rg;
  vec2 value7 = texture2D(u_texture, position + vec2(-1., -1.)).rg;
  vec2 value8 = texture2D(u_texture, position + vec2(0., -1.)).rg;
  vec2 value9 = texture2D(u_texture, position + vec2(1., -1.)).rg;

  vec2 value = (value1 + value2 + value3 + value4 + value5 + value6 + value7 +
                value8 + value9) /
               vec2(9., 9.) * vec2(9., 9.);

  // value = value2;

  if (pixelate(position.x, 300.) && pixelate(position.y, 300.)) {
    value = vec2(1., 1.);
  };

  // vec2 st = gl_FragCoord.xy / u_resolution.xy;
  gl_FragColor = vec4(value.x, value.y, 0., 1.0);
}
