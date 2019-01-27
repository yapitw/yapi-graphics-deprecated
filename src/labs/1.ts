import * as THREE from "three";

class Lab extends THREE.Object3D {
  cube: THREE.Mesh;
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    console.log("lab1 init");
    // const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const vertexShader = require("./1/shaderVertex.glsl");
    const fragmentShader = require("./1/shaderFragment.glsl");

    const material = new THREE.RawShaderMaterial({
      uniforms: { time: { type: "f", value: 1.0 } },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      // blending: THREE.AdditiveBlending,
      wireframe: false,
      side: THREE.DoubleSide
    });

    const geometry = new THREE.TorusKnotBufferGeometry(1, 0.25, 200, 18, 4, 3);

    this.cube = new THREE.Mesh(geometry, material);
    this.add(this.cube);
  }
  update() {
    let time = Date.now();
    this.cube.material["uniforms"].time.value += 0.01;
    // if(material.program){
    //   console.log(material.program.getUniforms())
    //   console.log(material.program.getAttributes())
    // }
    this.cube.rotateY(-0.05);
  }
}

export { Lab };
