import * as THREE from "three";

const texture = new THREE.TextureLoader().load("/doodle.png");

interface IUniforms {
  u_time: { type: "f"; value: number };
  u_resolution: { type: "v2"; value: THREE.Vector2 };
  u_mouse: { type: "v2"; value: THREE.Vector2 };
  u_texture: { type: "t"; value: THREE.Texture };
  u_picture: { type: "t"; value: THREE.Texture };
}

class Lab extends THREE.Object3D {
  canvas: HTMLCanvasElement;
  uniforms: IUniforms;
  textBuffer1: THREE.WebGLRenderTarget;
  textBuffer2: THREE.WebGLRenderTarget;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.afterRender = this.afterRender.bind(this);
    this.init();
  }

  init() {
    const vertexShader = require("./3/shaderVertex.glsl");
    const fragmentShader = require("./3/shaderFragment.glsl");
    this.canvas = document.querySelector("canvas");

    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.uniforms = {
      u_time: { type: "f", value: 0 },
      u_resolution: { type: "v2", value: new THREE.Vector2() },
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_texture: { type: "t", value: undefined },
      u_picture: { type: "t", value: texture }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });

    var mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);

    this.textBuffer1 = new THREE.WebGLRenderTarget(
      300 * window.devicePixelRatio,
      300 * window.devicePixelRatio,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
      }
    );
    this.textBuffer1.texture.wrapS = THREE.RepeatWrapping;
    this.textBuffer1.texture.wrapT = THREE.RepeatWrapping;

    this.textBuffer2 = new THREE.WebGLRenderTarget(
      300 * window.devicePixelRatio,
      300 * window.devicePixelRatio,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
      }
    );
    this.textBuffer2.texture.wrapS = THREE.RepeatWrapping;
    this.textBuffer2.texture.wrapT = THREE.RepeatWrapping;

    this.uniforms.u_resolution.value.x = 300 * window.devicePixelRatio;
    this.uniforms.u_resolution.value.y = 300 * window.devicePixelRatio;

    document.onmousemove = e => {
      this.uniforms.u_mouse.value.x = e.pageX;
      this.uniforms.u_mouse.value.y = e.pageY;
    };
  }

  update(toggle: boolean) {
    // this.uniforms.u_texture.value = this.textBuffer;
    // console.log(this.uniforms.u_texture.value)
    const toggleName = toggle ? "textBuffer1" : "textBuffer2";
    this.uniforms.u_texture.value = this[toggleName].texture;
  }

  afterRender(toggle: boolean) {
    const toggleName = toggle ? "textBuffer2" : "textBuffer1";
    this.uniforms.u_texture.value = this[toggleName].texture;
    this.uniforms.u_time.value += 0.1;
    // console.log(this.uniforms.u_texture.value)
  }
}

export { Lab };
