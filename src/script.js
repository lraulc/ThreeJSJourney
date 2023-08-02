import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

/*******************************************
 Camera Start
 *******************************************/
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.set(3, 2, 3);
camera.lookAt(0, 0, 0);
scene.add(camera);
/*******************************************
 Camera End
 *******************************************/

/*******************************************
 Objects Start
 *******************************************/
// Torus Knot
const torusKnot = new THREE.TorusKnotGeometry(8, 2.5, 300, 8, 2, 3);
const torusKnotMaterial = new THREE.MeshNormalMaterial({});
const torusKnotMesh = new THREE.Mesh(torusKnot, torusKnotMaterial);
torusKnotMesh.scale.set(0.1, 0.1, 0.1);
torusKnotMesh.position.y = torusKnotMesh.scale.y / 2;
scene.add(torusKnotMesh);

/*******************************************
 Objects End
 *******************************************/

/*******************************************
 Controls Start
 *******************************************/
// Add camera, and DOM element - this case, canvas
const controls = new OrbitControls(camera, canvas);
controls.target = new THREE.Vector3(0, 0, 0);
// controls.zoomSpeed = 0.1;
controls.enableDamping = true;
/*******************************************
 Camera End
 *******************************************/

/*******************************************
 Renderer Start
 *******************************************/
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(0x0e1823, 1);
renderer.setSize(sizes.width, sizes.height);
// Update pixel ratio for other screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

/*******************************************
 Renderer End
 *******************************************/

/*******************************************
 Helpers Start
 *******************************************/

const gridHelper = new THREE.GridHelper(10, 10, 0x00eeff, 0xffffff);
const axesHelper = new THREE.AxesHelper(3);
const helpersGroup = new THREE.Group();

helpersGroup.add(gridHelper, axesHelper);
scene.add(helpersGroup);

/*******************************************
 Helpers End
 *******************************************/

////////////////////////////////////////////////////////////

const clock = new THREE.Clock();

const tick = () => {
  const deltaTime = clock.getElapsedTime();

  // torusKnotMesh.rotation.set(2 * deltaTime, 2 * deltaTime, 2 * deltaTime);

  // Controls have to be updated when using damping
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/*******************************************
 Window Resize Handlers Start
 *******************************************/

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

/*******************************************
 Window Resize Handlers End
 *******************************************/
