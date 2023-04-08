import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

const boxGeometry = new THREE.BoxGeometry(3, 3, 3, 10, 10, 10);
const boxMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFF0000,
    wireframe: true
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.position.y = 1.5;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const tl = gsap.timeline();
window.addEventListener('mousedown', () => {
    tl.to(camera.position, {
        z: 40,
        duration: 2,
        onUpdate: function() {
            camera.lookAt(0, 0, 0);
        }
    })
    .to(camera.position, {
        y: 40,
        duration: 2,
        onUpdate: function() {
            camera.lookAt(0, 0, 0);
        }
    })
    .to(camera.position, {
        x: 40,
        duration: 2,
        onUpdate: function() {
            camera.lookAt(0, 0, 0);
        }
    });
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