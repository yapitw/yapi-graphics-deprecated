const parabola = `float parabola( float x, float k ){
    return pow( 4.0*x*(1.0-x), k );
  }`;

export const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform float time;
uniform float offset;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDepth;

#define PI 3.1415926535897932384626433832795
#define TAU (2.*PI)

${parabola}

void main() {
  vUv = uv;
  vec3 p = position;
  vec4 mvPosition = modelViewMatrix * vec4( p, 1. );
  gl_Position = projectionMatrix * mvPosition;
  vDepth = 30.5-20.*abs(gl_Position.z);
}
`;

export const fragmentShader = `
precision highp float;

uniform float time;
uniform float offset;
uniform vec3 color;
uniform float speed;

varying vec2 vUv;
varying float vDepth;

#define PI 3.1415926535897932384626433832795
#define TAU (2.*PI)

${parabola}

void main(){
  float repeat = 1.;
  float r = .125;
  float l = .95;
  float length = 10. + 90. * parabola(time,1.);
  float o = max(smoothstep(l,1.,.5+.5*sin(vUv.x*TAU*1600.*r)),smoothstep(l,1.,.5+.5*sin(vUv.y*TAU*72.*r)));
  float v = parabola(mod(repeat*vUv.x+offset+speed*time,1.),length);
  o += .5*v;
  gl_FragColor = vec4(vDepth *vec3(.001+v/3.)*color,o);
}
`;
