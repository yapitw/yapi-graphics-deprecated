precision highp float;

uniform float time;
varying float v_depth;

vec4 color() {
  float r = (sin(time) + 1.) / 2. / 2. * (0.9 / 2.);
  float g = 0.1 / 2.;
  float b = 0.9 / 2.;
  float a = 1. * v_depth;
  return vec4(r, g, b, a);
}

void main() { gl_FragColor = color(); }
