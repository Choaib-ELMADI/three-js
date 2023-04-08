import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

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

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);
orbit.update();

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0xFF00FF,
    wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x0000FF,
    wireframe: true
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
});
const timeStep = 1 / 60;

const groundPhyMat = new CANNON.Material;
const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, .1)),
    mass: 0,
    type: CANNON.Body.STATIC,
    material: groundPhyMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const boxPhyMat = new CANNON.Material();
const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    mass: 1,
    position: new CANNON.Vec3(0, 8, 5),
    material: boxPhyMat
});
world.addBody(boxBody);
// boxBody.angularVelocity.set(0, 10, 0);
// boxBody.angularDamping = .62;
boxBody.linearDamping = .42;

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhyMat, 
    boxPhyMat, 
    {
      friction: 0,  
    }
);
world.addContactMaterial(groundBoxContactMat);

const spherePhyMat = new CANNON.Material();
const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(2),
    mass: 1,
    position: new CANNON.Vec3(1, 2, 5),
    material: spherePhyMat
});
world.addBody(sphereBody);
sphereBody.linearDamping = .31;

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhyMat, 
    spherePhyMat, 
    {
        restitution: .7,
    }
);
world.addContactMaterial(groundSphereContactMat);

function animate() {
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});