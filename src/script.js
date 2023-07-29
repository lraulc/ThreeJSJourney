import * as THREE from "three";

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
    75,
    sizes.width / sizes.height,
    0.01,
    1000
);
camera.position.z = 3
scene.add(camera);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xaaffaa,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas
    }
);
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);