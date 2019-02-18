uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_picture;
uniform bool u_mousedown;

float Da = 1.0;
float Db = 0.5;
float feedRate = 0.0545;
float killRate = 0.062;

// cell split
// float feedRate = 0.0345;
// float killRate = 0.062;

float deltaT = 1.;

bool pixelate(float value, float num, float step) {
  return (value >= num - step && value <= num + step);
}

void main() {

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float step_x = 1. / u_resolution.x;
  float step_y = 1. / u_resolution.y;

  vec2 p = texture2D(u_texture, uv).rg;
  vec2 p1 = texture2D(u_texture, uv + vec2(-step_x, step_y)).rg;
  vec2 p2 = texture2D(u_texture, uv + vec2(0., step_y)).rg;
  vec2 p3 = texture2D(u_texture, uv + vec2(step_x, step_y)).rg;
  vec2 p4 = texture2D(u_texture, uv + vec2(-step_x, 0.)).rg;
  vec2 p5 = texture2D(u_texture, uv).rg;
  vec2 p6 = texture2D(u_texture, uv + vec2(step_x, 0.)).rg;
  vec2 p7 = texture2D(u_texture, uv + vec2(-step_x, -step_y)).rg;
  vec2 p8 = texture2D(u_texture, uv + vec2(0., -step_y)).rg;
  vec2 p9 = texture2D(u_texture, uv + vec2(step_x, -step_y)).rg;

  vec2 deltaP = (p1 * vec2(.05, .05) + p2 * vec2(.2, .2) + p3 * vec2(.05, .05) +
                 p4 * vec2(.2, .2) + p5 * vec2(-1., -1.) + p6 * vec2(.2, .2) +
                 p7 * vec2(.05, .05) + p8 * vec2(.2, .2) + p9 * vec2(.05, .05));

  float chemicalA =
      p.r + (Da * deltaP.r - p.r * p.g * p.g + feedRate * (1. - p.r)) * deltaT;

  float chemicalB =
      p.g +
      (Db * deltaP.g + p.r * p.g * p.g - (killRate + feedRate) * p.g) * deltaT;

  vec2 chemical = vec2(chemicalA, chemicalB);

  if (u_time == 0.) {
    chemical.r = 1.0;
    // if (pixelate(uv.x, 0.1, 5. * step_x) && pixelate(uv.y, 0.1, 5. * step_y))
    // {
    //   chemical.g = 1.0;
    // };
  } else {

    if (u_mousedown) {
      float pointDistance =
          pow((uv.x - u_mouse.x), 2.) + pow((uv.y - u_mouse.y), 2.);
      pointDistance = pow(pointDistance, 0.5);
      if (pointDistance < 0.002) {
        chemical.g = 1.0;
        chemical.r = 0.0;
      }
    }
  }

  // vec2 st = gl_FragCoord.xy / u_resolution.xy;
  gl_FragColor = vec4(chemical.x, chemical.y, 0., 1.0);
}
