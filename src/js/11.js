import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import gsap from 'gsap';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    .1,
    1000
);

renderer.setClearColor(0xA3A3A3);

// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.movementSpeed = 8;
// controls.lookSpeed = .08;

camera.position.set(-2, 0, 8);
camera.lookAt(2, 0, 8);

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = (loaded / total) * 100;
};

const progressContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = () => {
    progressContainer.style.display = 'none';
};

const gltfLoader = new GLTFLoader(loadingManager);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

let position = 0;

gltfLoader.load('./Assets/king/scene.gltf', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    window.addEventListener('mouseup', () => {
        switch (position) {
            case 0:
                moveCamera(-1.8, 1.6, 5);
                rotateCamera(0, 0.1, 0);
                position = 1;
                break;
            case 1:
                moveCamera(2.8, 0, 3.6);
                rotateCamera(0, -2, 0);
                position = 2;
                break;
            case 2:
                moveCamera(2.5, -0.9, 12.2);
                rotateCamera(0.9, 0.6, -0.6);
                position = 3;
                break;
            case 3:
                moveCamera(-2.7, 0.6, 3.7);
                rotateCamera(0.6, 1.09, -0.6);
                position = 4;
                break;
            case 4:
                moveCamera(-1.8, 0, 8.7);
                rotateCamera(0, 4.7, 0);
                position = 0;
                break;
        };
    });

    function moveCamera(x, y, z) {
        gsap.to(camera.position, {
            x,
            y,
            z,
            duration: 3
        });
    };

    function rotateCamera(x, y, z) {
        gsap.to(camera.rotation, {
            x,
            y,
            z,
            duration: 3.2
        });
    };
});

const clock = new THREE.Clock();
function animate() {
    renderer.render(scene, camera);
    // controls.update(clock.getDelta());
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});