import * as THREE from "three";

interface IUniforms {
  u_time: { type: "f"; value: number };
  u_resolution: { type: "v2"; value: THREE.Vector2 };
  u_mouse: { type: "v2"; value: THREE.Vector2 };
  u_texture: { type: "t"; value: THREE.Texture };
}

class Lab extends THREE.Object3D {
  canvas: HTMLCanvasElement;
  uniforms: IUniforms;
  textBuffer: THREE.WebGLRenderTarget;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const vertexShader = require("./2/shaderVertex.glsl");
    const fragmentShader = require("./2/shaderFragment.glsl");
    this.canvas = document.querySelector("canvas");

    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.uniforms = {
      u_time: { type: "f", value: 1.0 },
      u_resolution: { type: "v2", value: new THREE.Vector2() },
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_texture: { type: "t", value: undefined }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });

    var mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);

    this.textBuffer = new THREE.WebGLRenderTarget(600, 600, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });
    this.textBuffer.texture.wrapS = THREE.RepeatWrapping;
    this.textBuffer.texture.wrapT = THREE.RepeatWrapping;

    this.uniforms.u_resolution.value.x = 300 * window.devicePixelRatio;
    this.uniforms.u_resolution.value.y = 300 * window.devicePixelRatio;

    document.onmousemove = e => {
      this.uniforms.u_mouse.value.x = e.pageX;
      this.uniforms.u_mouse.value.y = e.pageY;
    };
  }

  update() {
    // this.uniforms.u_texture.value = this.textBuffer;
    // console.log(this.uniforms.u_texture.value)
  }

  afterRender() {
    this.uniforms.u_texture.value = this.textBuffer.texture.clone();
    // console.log(this.uniforms.u_texture.value)
  }
}

export { Lab };
