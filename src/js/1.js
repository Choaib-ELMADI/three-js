import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import sunTexture     from '../assets/planets/sun.jpg';
import mercuryTexture from '../assets/planets/mercury.jpg';
import venusTexture   from '../assets/planets/venus.webp';
import earthTexture   from '../assets/planets/earth.jpg';
import marsTexture    from '../assets/planets/mars.jpg';
import jupiterTexture from '../assets/planets/jupiter.jpg';
import saturnTexture  from '../assets/planets/saturn.jpg';
import saturnRingsTexture  from '../assets/planets/saturnRings.webp';
import uranusTexture  from '../assets/planets/uranus.webp';
import uranusRingsTexture  from '../assets/planets/uranusRings.jpg';
import neptoneTexture from '../assets/planets/neptone.webp';
import plutoTexture   from '../assets/planets/pluto.jpg';



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

camera.position.set(90, 90, 90);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

function createPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return { mesh, obj };
};

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(6, venusTexture, 40);
const earth = createPlanet(10, earthTexture, 70);
const mars = createPlanet(6, marsTexture, 100);
const jupiter = createPlanet(20, jupiterTexture, 140);
const saturn = createPlanet(14, saturnTexture, 220, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingsTexture
});
const uranus = createPlanet(8, uranusTexture, 260, {
    innerRadius: 15,
    outerRadius: 24, 
    uranusRingsTexture
});
const neptone = createPlanet(8, neptoneTexture, 300);
const pluto = createPlanet(3.2, plutoTexture, 340);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 3000);
scene.add(pointLight);

function animate() {
    sun.rotateY(.004);

    // ! Rotation on itself
    mercury.mesh.rotateY(.004);
    venus.mesh.rotateY(.004);
    earth.mesh.rotateY(.004);
    mars.mesh.rotateY(.004);
    jupiter.mesh.rotateY(.004);
    saturn.mesh.rotateY(.004);
    uranus.mesh.rotateY(.004);
    neptone.mesh.rotateY(.004);
    pluto.mesh.rotateY(.004);
    
    // ! Rotation around the sun
    mercury.obj.rotateY(.004);
    venus.obj.rotateY(.005);
    earth.obj.rotateY(.006);
    mars.obj.rotateY(.009);
    jupiter.obj.rotateY(.0013);
    saturn.obj.rotateY(.0024);
    uranus.obj.rotateY(.003);
    neptone.obj.rotateY(.0035);
    pluto.obj.rotateY(.0047);

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});