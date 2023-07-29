import "./style.css";
import * as THREE from "three";

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

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);

cube1.position.set(0, 0, 0);
cube2.position.set(2, 2, 2);
cube3.position.set(-1, -2, -3);

const meshesGroup = new THREE.Group();
scene.add(meshesGroup);
meshesGroup.add(cube1, cube2, cube3);
meshesGroup.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), 45);
// Default Box
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshNormalMaterial({
// //   color: 0xaaffaa,
// });
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

// boxMesh.position.set(0,0,0);
// boxMesh.scale.set(2,2,2);
// //Euler Rotations
// // mesh.rotation.set(0, Math.PI * 0.25, 0);
// boxMesh.setRotationFromAxisAngle(new THREE.Vector3(1,1,1), 75);
// //Quaternion Rotation

// scene.add(boxMesh);

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
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
