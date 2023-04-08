import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as dat from 'dat.gui';



const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
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

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -.5 * Math.PI;
plane.receiveShadow = true;

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

const sphereGeometry = new THREE.SphereGeometry(3, 30, 30);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(10, 10, 10);
sphere.castShadow = true;

const sphere2Geometry = new THREE.SphereGeometry(4);
const vShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fShader = `
    void main() {
        gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
    }
`;
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-10, 10, -10);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, .8);
// scene.add(directionalLight);
// directionalLight.position.set(20, 20, 20);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -10;

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

// const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(120, 120, 120);
spotLight.castShadow = true;
spotLight.angle = .1;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF, 1, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, .01);

const gui = new dat.GUI();
const options = {
    sphereColor: '#212236',
    wireframe: false,
    speed: .01,
    angle: .1,
    penumbra: 0,
    intensity: 1,
    backgroundColor: 0xFFEA00
};
gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function(e) {
    sphere.material.wireframe = e;
});
gui.add(options, 'speed', 0, .1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);
gui.addColor(options, 'backgroundColor').onChange(function(e) {
    renderer.setClearColor(e);
});

// const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(programming);
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([]);

let step = 0;
function animate() {
    box.rotation.x += .01;
    box.rotation.y += .01;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});