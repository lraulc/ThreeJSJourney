import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

THREE.ColorManagement.enabled = true;

/**
 * DEBUG PROPERTIES
 */

const gui = new GUI();

const properties = {
  rotation: 0,
};

/**
 * Textures
 */

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("Loading Started");
};

loadingManager.onProgress = () => {
  console.log("Loading");
};

loadingManager.onLoad = () => {
  console.log("Finished Loading");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const techoBaseColorTexture = textureLoader.load("/TechoModular_BC.png");
const techoNormalMapTexture = textureLoader.load("/TechoModular_NRM.png");
const techoRAOM = textureLoader.load("/TechoModular_RAOM.png");

// Texture wrapping - Tiling
techoBaseColorTexture.wrapS = THREE.RepeatWrapping;
techoBaseColorTexture.wrapT = THREE.RepeatWrapping;
techoBaseColorTexture.repeat.set(4, 4);

// Offset
techoBaseColorTexture.offset.set(0.5, 0.5);

// Rotate Texture
// techoBaseColorTexture.rotation = Math.PI * 0.25;

techoBaseColorTexture.magFilter = THREE.NearestFilter;
techoBaseColorTexture.generateMipmaps = true;

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
  75,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.set(1.5, 2, 1.5);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Object
const sphereGeometry = new THREE.SphereGeometry(1, 128, 128);
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: techoBaseColorTexture,
  toneMapped: false,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.y = sphereMesh.scale.y / 2;
scene.add(sphereMesh);

// Camera Controls
// Add camera, and DOM element - this case, canvas
const controls = new OrbitControls(camera, canvas);
controls.target.set(
  sphereMesh.position.x,
  sphereMesh.position.y,
  sphereMesh.position.z
);
// controls.zoomSpeed = 0.1;
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
// Update pixel ratio for other screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.render(scene, camera);

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

/**
 * GUI
 */

gui.add(sphereMaterial, "wireframe").name("Show Wireframe?");
