import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { gsap } from "gsap";

/**
 * Debug GUI Init
 */
const gui = new GUI();
const parameters = {
  torusColor: 0x66eeaa,
  tubeSegments: 300,
  // Function as a button in the UI
  spin: () => {
    gsap.to(torusKnotMesh.rotation, {
      duration: 1,
      y: torusKnotMesh.rotation.y + Math.PI * 2,
    });
  },
};

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

/*******************************************/

/*******************************************
 Objects Start
 *******************************************/
// Torus Knot
const torusKnotGeometry = new THREE.TorusKnotGeometry(
  8,
  2.5,
  parameters.tubeSegments,
  100,
  2,
  3
);
const torusKnotMaterial = new THREE.MeshBasicMaterial({
  color: parameters.torusColor,
});
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
torusKnotMesh.scale.set(0.1, 0.1, 0.1);
torusKnotMesh.rotation.set(0, 45, 0);
torusKnotMesh.position.y = torusKnotMesh.scale.y / 2;
scene.add(torusKnotMesh);

/*******************************************/

/*******************************************
 Controls Start
 *******************************************/
// Add camera, and DOM element - this case, canvas
const controls = new OrbitControls(camera, canvas);
controls.target = new THREE.Vector3(0, 0, 0);
controls.enableDamping = true;

/*******************************************/

/*******************************************
 Renderer Start
 *******************************************/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(0x0e1823, 1);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

/*******************************************/

/*******************************************
 Helpers Start
 *******************************************/

const gridHelper = new THREE.GridHelper(10, 10, 0x00eeff, 0xffffff);
const axesHelper = new THREE.AxesHelper(3);
const helpersGroup = new THREE.Group();

helpersGroup.add(gridHelper, axesHelper);
scene.add(helpersGroup);

/*******************************************/

const clock = new THREE.Clock();

const tick = () => {
  const deltaTime = clock.getElapsedTime();

  // Controls have to be updated when using damping
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/*******************************************
 Debug GUI Handlers Start
 *******************************************/

gui.add(torusKnotMesh.position, "y", 0, 10).name("Y position");
gui.add(torusKnotMesh, "visible").name("Visibility");
gui.add(torusKnotMaterial, "wireframe").name("Wireframe?");

// Verision using parameters for Color
gui
  .addColor(parameters, "torusColor")
  .name("Color")
  .onChange(() => {
    torusKnotMaterial.color.set(parameters.torusColor);
  });

// Buttons
gui.add(parameters, "spin").name("Spin Animation");

gui.add(parameters, "tubeSegments", 10, 300, 10).name("Segments");

// Version for lil-gui - For Color
// gui.addColor(torusKnotMaterial, "color").name("Torus Color");

/*******************************************/

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
/*******************************************/
