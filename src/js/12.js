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

const path = new YUKA.Path();
path.add(new YUKA.Vector3(-4, 0,  0));
path.add(new YUKA.Vector3(4,  0,  0));
path.add(new YUKA.Vector3(4,  0, -4));
path.add(new YUKA.Vector3(2,  0, -2));
path.add(new YUKA.Vector3(0,  0, -4));
path.add(new YUKA.Vector3(-2, 0, -2));
path.add(new YUKA.Vector3(-4, 0, -4));
path.add(new YUKA.Vector3(-4, 0, 0));
path.add(new YUKA.Vector3(-4, 0, 0));

path.loop = true;

const onPathBehavior = new YUKA.OnPathBehavior(path);
onPathBehavior.radius = 1;
vehicle.steering.add(onPathBehavior);

vehicle.position.copy(path.current());

const followPath = new YUKA.FollowPathBehavior(path, .5);
vehicle.steering.add(followPath);

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const position = [];
for (let i=0; i<path._waypoints.length; i++) {
    const wayPoint = path._waypoints[i];
    position.push(wayPoint.x, wayPoint.y, wayPoint.z);
};

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
scene.add(lines);

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