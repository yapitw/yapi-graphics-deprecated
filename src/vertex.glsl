precision highp float;

// position
attribute vec3 position;
// uv
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform float time;

varying vec3 v_position;
varying vec2 v_uv;
varying float v_depth;

void main()
{
    float x = floor(uv.x + time);
    vec4 mv_position = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mv_position;
    v_depth = (sin((uv.x + time - x) * 2. * 3.1415926)) * 0.8;
}