import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * GUI INIT
 */
const gui = new GUI();

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
});

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.set(0, 1, 5);
scene.add(camera);

// Objects
const objectsGroup = new THREE.Group();
const standardMaterial = new THREE.MeshStandardMaterial({
  wireframe: false,
  roughness: 0.25,
  color: 0xffffff,
});
const boxGeometry = new THREE.BoxGeometry();
const donutGeometry = new THREE.TorusGeometry(0.5, 0.2, 32, 32);
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const planeGeometry = new THREE.PlaneGeometry(8, 8, 1);
const boxMesh = new THREE.Mesh(boxGeometry, standardMaterial);
const donutMesh = new THREE.Mesh(donutGeometry, standardMaterial);
const sphereMesh = new THREE.Mesh(sphereGeometry, standardMaterial);
const planeMesh = new THREE.Mesh(planeGeometry, standardMaterial);
boxMesh.position.y = 1;
donutMesh.position.x = 2;
donutMesh.position.y = 1;
sphereMesh.position.x = 3.5;
sphereMesh.position.y = 1;
planeMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

objectsGroup.add(boxMesh, sphereMesh, donutMesh);
objectsGroup.position.set(-2, 0, 0);

scene.add(objectsGroup, planeMesh);

/*******************************************
 Lights Start
 *******************************************/

const ambientLight = new THREE.AmbientLight(0x233a43, 0.2);
scene.add(ambientLight);

gui.addColor(ambientLight, "color");
gui.add(ambientLight, "intensity", 0, 1);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

/*******************************************/
// Camera Controls
// Add camera, and DOM element - this case, canvas
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
// controls.zoomSpeed = 0.1;
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
// Update pixel ratio for other screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

/*******************************************
 Helpers Start
 *******************************************/

const gridHelper = new THREE.GridHelper(10, 10, 0x00eeff, 0xffffff);
const axesHelper = new THREE.AxesHelper(3);
const helpersGroup = new THREE.Group();

helpersGroup.add(gridHelper, axesHelper);
// scene.add(helpersGroup);

/*******************************************
 Helpers End
 *******************************************/

////////////////////////////////////////////////////////////

const clock = new THREE.Clock();

const tick = () => {
  const deltaTime = clock.getElapsedTime();

  boxMesh.rotation.set(0.2 * deltaTime, 0.2 * deltaTime, 0.2 * deltaTime);
  donutMesh.rotation.set(0.2 * deltaTime, 0.2 * deltaTime, 0.2 * deltaTime);
  sphereMesh.rotation.set(0.2 * deltaTime, 0.2 * deltaTime, 0.2 * deltaTime);

  // Controls have to be updated when using damping
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// Handle Window Resize
window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitfullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});
