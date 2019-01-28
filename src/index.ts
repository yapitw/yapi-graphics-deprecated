import * as THREE from "three";

const seq = location.hash.slice(1);
const Lab = require("./labs/" + seq).Lab;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-2, 2, -2, 2);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const lab = new Lab(renderer);

renderer.setSize(300, 300);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("app").appendChild(renderer.domElement);

camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);

scene.add(lab);

let switchTag = true;

function animate() {
  lab.update(switchTag);
  renderer.render(
    scene,
    camera,
    lab[switchTag ? "textBuffer2" : "textBuffer1"],
    true
  );
  renderer.render(scene, camera);
  lab.afterRender && lab.afterRender(switchTag);
  switchTag = !switchTag;
  requestAnimationFrame(animate);
}

animate();
