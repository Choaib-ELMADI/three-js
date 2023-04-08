import * as THREE from 'three';
import * as YUKA from 'yuka';

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

camera.position.set(0, 20, 0);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 8, 5);

const vehicleGeo = new THREE.ConeBufferGeometry(.35, 1.2, 8);
vehicleGeo.rotateX(Math.PI * .5);
const vehicleMat = new THREE.MeshNormalMaterial();
const vehicleMesh = new THREE.Mesh(vehicleGeo, vehicleMat);
vehicleMesh.matrixAutoUpdate = false;
scene.add(vehicleMesh);

const vehicle = new YUKA.Vehicle();
vehicle.setRenderComponent(vehicleMesh, sync);

vehicle.maxSpeed = 3;

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
};

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const targetGeo = new THREE.SphereGeometry(.25);
const targetMat = new THREE.MeshPhongMaterial({ color: 0xffff00 })
const targetMesh = new THREE.Mesh(targetGeo, targetMat);
targetMesh.matrixAutoUpdate = false;
scene.add(targetMesh);
targetMesh.position.set(4, 0, 4);

const target = new YUKA.GameEntity();
target.setRenderComponent(targetMesh, sync);
entityManager.add(target);

const seekBehavior = new YUKA.SeekBehavior(target.position);
vehicle.steering.add(seekBehavior);

setInterval(function() {
    const x = Math.random() * 4;
    const y = Math.random() * 4;
    const z = Math.random() * 4;

    target.position.set(x, y, z);
}, 2000);

const time = new YUKA.Time();

function animate() {
    const delta = time.update().getDelta();
    entityManager.update(delta);
    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});