import * as THREE from "three";
import { Quaternion } from "three";

// Canvas
const canvas = document.querySelector('.webgl');


// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = 
{
    width: 800,
    height:800
};


// Camera
const camera = new THREE.PerspectiveCamera(
    50,
    sizes.width / sizes.height,
    0.01,
    1000
);
camera.position.set(7,3,7);
camera.lookAt(0,0,0);
scene.add(camera);

// Box Object
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
const boxRotation = new THREE.Quaternion()
scene.add(boxMesh);



/*
Axis Helpers
*/
const gridSize = 10;
const gridHelper = new THREE.GridHelper(gridSize, gridSize, 0x00eeff, 0xffffff);
const axesHelper = new THREE.AxesHelper(3);

const mainHelpersGroup = new THREE.Group();
mainHelpersGroup.add(gridHelper, axesHelper);
scene.add(mainHelpersGroup);



// Renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas
    }
);
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);


// Delta time (start time)
let time = Date.now();
// Animations

const tick = () =>
{

    // Delta time
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
    // console.log(deltaTime);


    boxMesh.rotation.y += 0.002 * deltaTime;
    renderer.render(scene,camera);
    window.requestAnimationFrame(tick);
}

tick();