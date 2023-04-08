import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xEAEAEA);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    .1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-10, 30, 30);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const assetLoader = new GLTFLoader();

let mixer,
    mixer2,
    mixer3;

assetLoader.load('', (gltf) => {
    const model = glyf.scene;
    model.scene.set(.01, .01, .01);
    const model2 = SkeletonUtils.clone(model);
    const model3 = SkeletonUtils.clone(model);

    scene.add(model);
    scene.add(model2);
    scene.add(model3);

    model2.position.set(7, -4, 6);
    model3.position.set(-7, 4, -2);

    mixer = new THREE.AnimationMixer(model);
    mixer2 = new THREE.AnimationMixer(model2);
    mixer3 = new THREE.AnimationMixer(model3);

    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Take 001');
});

// const tl = gsap.timeline();
// window.addEventListener('mousedown', () => {
//     tl.to(camera.position, {
//         z: 40,
//         duration: 2,
//         onUpdate: function() {
//             camera.lookAt(0, 0, 0);
//         }
//     })
//     .to(camera.position, {
//         y: 40,
//         duration: 2,
//         onUpdate: function() {
//             camera.lookAt(0, 0, 0);
//         }
//     })
//     .to(camera.position, {
//         x: 40,
//         duration: 2,
//         onUpdate: function() {
//             camera.lookAt(0, 0, 0);
//         }
//     });
// });

function animate() {

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});