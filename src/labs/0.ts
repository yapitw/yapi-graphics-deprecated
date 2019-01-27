import * as THREE from "three";

interface IUniforms {
  u_time: { type: "f"; value: number };
  u_resolution: { type: "v2"; value: THREE.Vector2 };
  u_mouse: { type: "v2"; value: THREE.Vector2 };
}

class Lab extends THREE.Object3D {
  uniforms: IUniforms;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    const vertexShader = require("./0/shaderVertex.glsl");
    const fragmentShader = require("./0/shaderFragment.glsl");

    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.uniforms = {
      u_time: { type: "f", value: 1.0 },
      u_resolution: { type: "v2", value: new THREE.Vector2() },
      u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });

    var mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);

    document.onmousemove = e => {
      this.uniforms.u_mouse.value.x = e.pageX;
      this.uniforms.u_mouse.value.y = e.pageY;
    };

    this.uniforms.u_resolution.value.x = 300;
    this.uniforms.u_resolution.value.y = 300;
  }

  update() {}
}

export { Lab };
