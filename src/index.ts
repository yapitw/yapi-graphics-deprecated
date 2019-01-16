import * as THREE from "three";
const vertexShader = require("./vertex.glsl");
const fragmentShader = require("./fragment.glsl");

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-2, 2, -2, 2);
const renderer = new THREE.WebGLRenderer({ alpha: true });

camera.position.set(1, 1, 1);

camera.lookAt(0, 0, 0);

renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("app").appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
const geometry = new THREE.TorusKnotBufferGeometry(1, 0.25, 200, 18, 4, 3);

// const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const material = new THREE.RawShaderMaterial({
  uniforms: { time: { type: "f", value: 1.0 } },
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  wireframe: false,
  side: THREE.DoubleSide
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  let time = Date.now();
  cube.material.uniforms.time.value += 0.01;
  // if(material.program){
  //   console.log(material.program.getUniforms())
  //   console.log(material.program.getAttributes())
  // }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotateY(-0.05);
}

animate();
