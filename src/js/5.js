import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;

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

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, .8);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.position.set(50, 50, -50);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

const meshes = [];
const bodies = [];

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, new THREE.Vector3(0, 0, 0));
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
});

window.addEventListener('click', () => {
    const sphereGeo = new THREE.SphereGeometry(.5, 30, 30);
    const sphereMat = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xFFFFFF,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMesh.castShadow = true;

    const spherePhyMat = new CANNON.Material();
    const sphereBody = new CANNON.Body({
        shape: new CANNON.Sphere(.5),
        mass: 1,
        position: intersectionPoint,
        material: spherePhyMat
    });
    world.addBody(sphereBody);

    const planeSpherContactMat = new CANNON.ContactMaterial(
        planePhyMat,
        spherePhyMat,
        {
            restitution: .7
        }
    );
    world.addContactMaterial(planeSpherContactMat);

    meshes.push(sphereMesh);
    bodies.push(sphereBody);
});

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
});
const timeStep = 1 / 60;

const planeGeo = new THREE.PlaneGeometry(20, 20);
const planeMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
scene.add(planeMesh);

const planePhyMat = new CANNON.Material;
const planeBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(10, 10, .01)),
    mass: 0,
    type: CANNON.Body.STATIC,
    material: planePhyMat
});
world.addBody(planeBody);
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
planeMesh.receiveShadow = true;

function animate() {
    world.step(timeStep);

    planeMesh.position.copy(planeBody.position);
    planeMesh.quaternion.copy(planeBody.quaternion);

    for (let i=0; i<meshes.length; i++) {
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});