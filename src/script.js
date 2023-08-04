import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import typefaceFont from "./fonts/helvetiker_regular.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import GUI from "lil-gui";

/**
 * GUI
 */

const gui = new GUI();

/**
 * Texture Loaders
 */
// Load Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const randomMatcap = THREE.MathUtils.randInt(1, 8);
const matcapTexture = textureLoader.load(`./textures/${randomMatcap}.png`);
console.log(`Random matcap: ${randomMatcap}`);
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

console.time("donuts");
// Object
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutTextMaterial = new THREE.MeshMatcapMaterial();
donutTextMaterial.matcap = matcapTexture;

for (let i = 0; i < 400; i++) {
  const randomVector3 = {
    x: (Math.random() - 0.5) * 30,
    y: (Math.random() - 0.5) * 20,
    z: (Math.random() - 0.5) * 30,
  };
  const donutMesh = new THREE.Mesh(donutGeometry, donutTextMaterial);
  donutMesh.position.set(randomVector3.x, randomVector3.y, randomVector3.z);
  donutMesh.rotation.x = Math.random() * Math.PI;

  const randomScale = (Math.random() + 0.5) * 2;
  donutMesh.scale.set(randomScale, randomScale, randomScale);
  scene.add(donutMesh);
}

console.timeEnd("donuts");

// Text Buffer
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello! Three.js!", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  // // Hardcode Centering
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(
  //     textGeometry.boundingBox.max.x - textGeometry.parameters.options.bevelSize
  //   ) * 0.5,
  //   -(
  //     textGeometry.boundingBox.max.y - textGeometry.parameters.options.bevelSize
  //   ) * 0.5,
  //   -(
  //     textGeometry.boundingBox.max.z - textGeometry.parameters.options.bevelSize
  //   ) * 0.5
  // );
  textGeometry.center();
  const textMesh = new THREE.Mesh(textGeometry, donutTextMaterial);
  scene.add(textMesh);
});
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
// Update pixel ratio for other screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

/*******************************************
 Helpers Start
 *******************************************/

const gridHelper = new THREE.GridHelper(10, 10, 0x00eeff, 0xffffff);
const axesHelper = new THREE.AxesHelper(3);
const helpersGroup = new THREE.Group();

// helpersGroup.add(axesHelper);
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
