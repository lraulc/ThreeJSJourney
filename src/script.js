import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * DEBUG PROPERTIES
 */

const gui = new GUI();

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
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
const cubeMap = cubeTextureLoader.load([
  "/textures/environmentMaps/2/px.jpg",
  "/textures/environmentMaps/2/nx.jpg",
  "/textures/environmentMaps/2/py.jpg",
  "/textures/environmentMaps/2/ny.jpg",
  "/textures/environmentMaps/2/pz.jpg",
  "/textures/environmentMaps/2/nz.jpg",
]);
const matcap = textureLoader.load("/textures/matcaps/3.png");
const gradient = textureLoader.load("/textures/gradients/3.jpg");
gradient.magFilter = THREE.NearestFilter;
gradient.generateMipmaps = false;

// Door Textures
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorAoTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

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
camera.position.set(3, 2, 3);
scene.add(camera);

/*******************************************
 Materials Start
 *******************************************/
// // Default Basic Material
// const defaultMaterial = new THREE.MeshBasicMaterial();
// defaultMaterial.map = doorColorTexture;
// defaultMaterial.transparent = true;
// defaultMaterial.opacity = 0.5;
// defaultMaterial.alphaMap = doorAlphaTexture;
// // Double Sided
// defaultMaterial.side = THREE.DoubleSide;

// // Mesh Matcap Material
// const defaultMaterial = new THREE.MeshMatcapMaterial();
// defaultMaterial.matcap = matcap;

// // Depth Material
// const defaultMaterial = new THREE.MeshDepthMaterial();

// // Basic Lambert
// const defaultMaterial = new THREE.MeshLambertMaterial();
// defaultMaterial.map = doorColorTexture;

// // Basic Phong
// const defaultMaterial = new THREE.MeshPhongMaterial();
// defaultMaterial.shininess = 100;
// defaultMaterial.specular = new THREE.Color(0xff0000);

// // Basic Toon Material
// const defaultMaterial = new THREE.MeshToonMaterial();
// defaultMaterial.gradientMap = gradient;
// defaultMaterial.color = new THREE.Color(0x33eeaa);

// // // Default Sourface - Non PBR
const defaultMaterial = new THREE.MeshStandardMaterial();

gui.add(defaultMaterial, "metalness", 0, 1, 0.01).name("Metallic");
gui.add(defaultMaterial, "roughness", 0, 1, 0.01).name("Roughness");

defaultMaterial.side = THREE.DoubleSide;
defaultMaterial.map = doorColorTexture;
defaultMaterial.normalMap = doorNormalTexture;
defaultMaterial.normalScale = new THREE.Vector2(2, 2);
defaultMaterial.roughnessMapMap = doorRoughnessTexture;
defaultMaterial.metalnessMap = doorMetalnessTexture;
defaultMaterial.aoMap = doorAoTexture;
defaultMaterial.aoMapIntensity = 1;
defaultMaterial.displacementMap = doorHeightTexture;
defaultMaterial.displacementScale = 0.1;
defaultMaterial.transparent = true;
defaultMaterial.alphaMap = doorAlphaTexture;

defaultMaterial.envMap = cubeMap;

gui.add(defaultMaterial, "aoMapIntensity", 0, 10);
gui.add(defaultMaterial, "displacementScale", 0, 1, 0.001);

/*******************************************/

/*******************************************
 Objects Start
 *******************************************/
const sphereGeometry = new THREE.SphereGeometry(0.5, 128, 128);
const sphereMesh = new THREE.Mesh(sphereGeometry, defaultMaterial);
sphereMesh.position.y = sphereMesh.scale.y / 2;
scene.add(sphereMesh);

// Plane Mesh
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
const planeMesh = new THREE.Mesh(planeGeometry, defaultMaterial);
planeMesh.position.set(2, 0.5, 0);
scene.add(planeMesh);

// Torus Mesh
const torusGeometry = new THREE.TorusGeometry(0.4, 0.2, 128, 128);
const torusMesh = new THREE.Mesh(torusGeometry, defaultMaterial);
torusMesh.position.set(4, 0.5, 0);
scene.add(torusMesh);

/*******************************************/

/*******************************************
 Lights Start
 *******************************************/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);

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
const speed = 0.15;
const tick = () => {
  const deltaTime = clock.getElapsedTime();

  // Update objects
  sphereMesh.rotation.y = speed * deltaTime;
  planeMesh.rotation.y = speed * deltaTime;
  torusMesh.rotation.y = speed * deltaTime;

  // sphereMesh.rotation.x = speed * deltaTime;
  // planeMesh.rotation.x = speed * deltaTime;
  // torusMesh.rotation.x = speed * deltaTime;

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

gui.add(defaultMaterial, "wireframe").name("Show Wireframe?");
