uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_picture;

float Da = 1.0;
float Db = 0.5;
float funcF = 0.055;
float funcK = 0.062;
float deltaT = 1.;

bool pixelate(float value, float num, float step) {
  return (value >= num - step && value <= num + step);
}

void main() {

  vec2 position = gl_FragCoord.xy / u_resolution.xy;

  float step_x = 1. / u_resolution.x;
  float step_y = 1. / u_resolution.y;

  // vec2 value = texture2D(u_texture, position).rg;

  vec2 p = texture2D(u_texture, position).rg;

  vec2 p1 = texture2D(u_texture, position).rg * vec2(-1., -1.);
  vec2 p2 = texture2D(u_texture, position + vec2(-step_x, step_y)).rg *
            vec2(.05, .05);
  vec2 p3 = texture2D(u_texture, position + vec2(0., step_y)).rg * vec2(.2, .2);
  vec2 p4 =
      texture2D(u_texture, position + vec2(step_x, step_y)).rg * vec2(.05, .05);
  vec2 p5 =
      texture2D(u_texture, position + vec2(-step_x, 0.)).rg * vec2(.2, .2);
  vec2 p6 = texture2D(u_texture, position + vec2(step_x, 0.)).rg * vec2(.2, .2);
  vec2 p7 = texture2D(u_texture, position + vec2(-step_x, -step_y)).rg *
            vec2(.05, .05);
  vec2 p8 =
      texture2D(u_texture, position + vec2(0., -step_y)).rg * vec2(.2, .2);
  vec2 p9 = texture2D(u_texture, position + vec2(step_x, -step_y)).rg *
            vec2(.05, .05);

  vec2 deltaP = (p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9);

  float chemicalA =
      p.r + (Da * deltaP.r - p.r * p.g * p.g + funcF * (1. - p.r)) * deltaT;

  float chemicalB =
      p.g + (Db * deltaP.g + p.r * p.g * p.g - (funcK + funcF) * p.g) * deltaT;

  vec2 chemical = vec2(chemicalA, chemicalB);

  if (u_time == 0.) {
    chemical.r = 1.0;
    if (pixelate(position.x, 0.5, 5. * step_x) &&
        pixelate(position.y, 0.5, 5. * step_y)) {
      chemical.g = 1.0;
    };
  }

  // vec2 st = gl_FragCoord.xy / u_resolution.xy;
  gl_FragColor = vec4(chemical.x, chemical.y, 0., 1.0);
}
