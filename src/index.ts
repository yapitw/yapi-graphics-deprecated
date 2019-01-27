import * as THREE from "three";

const seq = location.hash.slice(1);
const Lab = require("./labs/" + seq).Lab;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-2, 2, -2, 2);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("app").appendChild(renderer.domElement);

camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);

const lab = new Lab();

scene.add(lab);

function animate() {
  lab.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
