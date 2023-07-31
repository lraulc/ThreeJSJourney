import "./style.css";
import * as THREE from "three";
import gsap from 'gsap';

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
// camera.position.z = 3
camera.position.set(4, 2, 4);
camera.lookAt(0, 0, 0);
scene.add(camera);

/*
Meshes
*/

// Default Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

/*
Helpers
*/

const gridScale = 5;
const axesHelpers = new THREE.AxesHelper(3);
const gridHelper = new THREE.GridHelper(
  gridScale,
  gridScale,
  0x00ddff,
  0xffffff
);
scene.add(gridHelper);
scene.add(axesHelpers);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Start time - ThreeJs
const clock = new THREE.Clock();

/*
Animation using GSAP
*/
  // Move left
  gsap.to(boxMesh.position, {duration:1, delay:1, x:2});
  // Move right
  gsap.to(boxMesh.position, {duration:1, delay:2, x:0, });
////////////////////////////////////////////////////////

// Tick
const tick = () =>  
{

  // Animation using ThreeJS clock
  const deltaTime = clock.getElapsedTime();
  boxMesh.rotation.set(0, 2 * deltaTime, 0);
  
  renderer.render(scene,camera);  
  
  window.requestAnimationFrame(tick);
}

tick();
