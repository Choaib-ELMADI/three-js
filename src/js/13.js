import * as THREE from 'three';
import * as YUKA from 'yuka';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    .1,
    1000
);

camera.position.set(0, 12, 7);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 8, 5);

const vehicle = new YUKA.Vehicle();

vehicle.maxSpeed = 3;

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
};

const gltfLoader = new GLTFLoader();
gltfLoader.load('./Assets/mustang/scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(.8, .8, .8);
    scene.add(model);

    model.matrixAutoUpdate = false;
    vehicle.setRenderComponent(model, sync);
});

const path = new YUKA.Path();
path.add(new YUKA.Vector3(-8, 0,  0));
path.add(new YUKA.Vector3(8,  0,  0));
path.add(new YUKA.Vector3(8,  0, -8));
path.add(new YUKA.Vector3(4,  0, -4));
path.add(new YUKA.Vector3(0,  0, -8));
path.add(new YUKA.Vector3(-4, 0, -4));
path.add(new YUKA.Vector3(-8, 0, -8));
path.add(new YUKA.Vector3(-8, 0, 0));
path.add(new YUKA.Vector3(-8, 0, 0));

path.loop = true;

const onPathBehavior = new YUKA.OnPathBehavior(path);
onPathBehavior.radius = 2;
vehicle.steering.add(onPathBehavior);

vehicle.position.copy(path.current());

const followPath = new YUKA.FollowPathBehavior(path, 2);
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