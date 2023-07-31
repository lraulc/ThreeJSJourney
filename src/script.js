import * as THREE from "three";
import gsap from "gsap";

/*
 *Cursor
 */
const cursor = {
  mouseX: 0,
  mouseY: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.mouseX = event.clientX / sizes.width - 0.5;
  cursor.mouseY = -(event.clientY / sizes.height - 0.5);
  console.log(cursor.mouseX);
  console.log(cursor.mouseY);
});

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: 800,
  height: 800,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Object
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/*******************************************
                  Helpers 
*******************************************/

const gridHelper = new THREE.GridHelper(10, 10, 0x00eeff, 0xffffff);
const axesHelper = new THREE.AxesHelper(3);
const helpersGroup = new THREE.Group();

helpersGroup.add(gridHelper, axesHelper);
scene.add(helpersGroup);
////////////////////////////////////////////////////////////

const clock = new THREE.Clock();

const tick = () => {
  const deltaTime = clock.getElapsedTime();

  // boxMesh.rotation.y = 1 * deltaTime;

  // Update Camera
  const cameraSpeed = Math.PI;
  camera.position.set(
    Math.sin(cursor.mouseX * Math.PI * 2) * cameraSpeed,
    cursor.mouseY * Math.PI * 2,
    Math.cos(cursor.mouseX * Math.PI * 2) * cameraSpeed
  );

  camera.lookAt(boxMesh.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
