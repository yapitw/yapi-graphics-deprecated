import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-2, 2, -2, 2);
const renderer = new THREE.WebGLRenderer({
  alpha: false
});


camera.position.set(1, 1, 1);

camera.lookAt(0, 0, 0);

renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("app").appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
const geometry = new THREE.TorusKnotBufferGeometry(1, .25, 200, 18, 4, 3);

// const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const material = new THREE.RawShaderMaterial({
  uniforms: {
    time: { value: 0 },
    speed: { value: 1 },
    offset: { value: 0 },
    color: { value: new THREE.Color(0x455b69) }
  },
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
window.cube = cube;

// const light = new THREE.HemisphereLight("#fff", "#222", 1);
// light.position.set(-10, -30, 0);
// scene.add(light);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(-2, 2, 2);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.near = -1;
// directionalLight.shadow.camera.far = 10;
// scene.add(directionalLight);

// const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight2.position.set(1, 2, 1);
// directionalLight2.castShadow = true;
// directionalLight2.shadow.camera.near = -4;
// directionalLight2.shadow.camera.far = 10;
// scene.add(directionalLight2);

// const ambientLight = new THREE.AmbientLight(0x808080, 0.5);
// scene.add(ambientLight);


function animate() {
  const time = (0.001 * (performance.now() - 0)) % 8;
  cube.material.uniforms.time.value = time/10;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotateY(-0.05);
}

animate();
