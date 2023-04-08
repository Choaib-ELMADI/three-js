import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

camera.position.set(0, 4, 10);
orbit.update();

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
        visible: false
    })
);
planeMesh.rotation.x = -.5 * Math.PI;
scene.add(planeMesh);
planeMesh.name = 'ground';

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

const highLightSquareMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide,
        transparent: true
    })
);
highLightSquareMesh.rotation.x = -.5 * Math.PI;
highLightSquareMesh.position.set(.5, 0, .5);
scene.add(highLightSquareMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach((i) => {
        if (i.object.name === 'ground') {
            const highLightPosition = new THREE.Vector3().copy(i.point).floor().addScalar(.5);
            highLightSquareMesh.position.set(highLightPosition.x, 0, highLightPosition.z);
        }

        const cloneExist = clones.find((clone) => {
            return (
                clone.position.x === highLightSquareMesh.position.x &&
                clone.position.z === highLightSquareMesh.position.z 
            )
        });

        if (!cloneExist) {
            highLightSquareMesh.material.color.set(0xFFFFFF);
        } else {
            highLightSquareMesh.material.color.set(0xFF0000);
        }
    });
});

const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(.4, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xFFFF00,
    })
);

const clones = [];

window.addEventListener('mousedown', () => {
    const cloneExist = clones.find((clone) => {
        return (
            clone.position.x === highLightSquareMesh.position.x &&
            clone.position.z === highLightSquareMesh.position.z 
        )
    });

    if (!cloneExist) {
        intersects.forEach((i) => {
            if (i.object.name === 'ground') {
                const sphereClone = sphereMesh.clone();
                sphereClone.position.copy(highLightSquareMesh.position);
                sphereClone.position.y = .5;
                highLightSquareMesh.material.color.set(0xFF0000);
                scene.add(sphereClone);
                clones.push(sphereClone);
            }
        });
    }
});

function animate(time) {
    clones.forEach((c) => {
        c.rotation.y += .02;
        c.position.y = .5 + .5 * Math.abs(Math.sin(time / 1000));
    });

    highLightSquareMesh.material.opacity = 1 + Math.sin(time / 120);

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});