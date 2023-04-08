import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const hdrTextureUrl  = new URL('../assets/hdr/1.hdr', import.meta.url);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

renderer.outputEncoding = THREE.sRGBEncoding; //! add some light
renderer.toneMapping = THREE.ACESFilmicToneMapping; //! add details to very bright spots
renderer.toneMappingExposure = 1.8;

const loader = new RGBELoader();
loader.load(hdrTextureUrl, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping; //! make the hdr picture take 360 deg
    scene.background = texture;
    scene.environment = texture; //! make objects reflects the environment

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 20, 20),
        new THREE.MeshStandardMaterial({
            roughness: 0,
        }),
    );
    scene.add(sphere);
});

function animate() {
    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});