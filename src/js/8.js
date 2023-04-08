import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xA3A3A3);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    .1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 4, 10);
orbit.update();

const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);
gridHelper.receiveShadow = true;

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

const loadingManger = new THREE.LoadingManager();

// loadingManger.onStart = function(url, item, total) {
//     console.log(`Start loading: ${ url }`);
// };

const progessBar = document.getElementById('progress-bar')
    progessContainer = document.getElementById('progress-bar-container');

loadingManger.onProgress = function(url, loaded, total) {
    progessBar.value = (loaded / total) * 100;
};

loadingManger.onLoad = function() {
    progessContainer.style.display = 'none';
};

// loadingManger.onError = function(url) {
//     console.error(`Error loading: ${ url }`);
// };

let car;
const gltfLoader = new GLTFLoader(loadingManger);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const rgbeLoader = new RGBELoader();
rgbeLoader.load('./Assets/1.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('./Assets/scene.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        car = model;
    });
});

function animate(time) {
    if (car) {
        // car.rotation.y = - time / 3000;
    }

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});