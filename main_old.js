import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);
document.getElementById('section2').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Add a plane with texture
const planeSize = 40;
const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = Math.PI * -0.5;
scene.add(plane);


// Add cube with a texture
const geometry = new THREE.BoxGeometry(4, 4, 4);
const texture_wall = loader.load("resources/images/wall.jpg");
texture_wall.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshPhongMaterial({
    map: texture_wall,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.set(1, 10, 0);
scene.add(cube);


const cubeSize = 4;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
const meshCube = new THREE.Mesh(cubeGeo, cubeMat);
meshCube.position.set(1, 1, 1);
scene.add(meshCube);

const sphereRadius = 3;
const sphereWidthDivisions = 32;
const sphereHeightDivisions = 16;
const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
);
const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
const meshSphere = new THREE.Mesh(sphereGeo, sphereMat);
meshSphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
scene.add(meshSphere);

// Add ambiental light
const color_red = 0xff0000
const ambientalLight = new THREE.AmbientLight(color_red, 1);
scene.add(ambientalLight);

// Add directional light
const color_yellow_light = 0x404040
const directionalLight = new THREE.DirectionalLight(color_yellow_light, 100);
scene.add(directionalLight);

// Add light helper
const helper = new THREE.DirectionalLightHelper(directionalLight, 3, 0x00ff00);
scene.add(helper);


function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    const time = performance.now() * 0.001;
    const radius = 10;
    const centerX = 0;
    const centerY = 0;
    const centerZ = 0;
    const angle = time * 1; // Velocidad de rotación

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + 10;
    const z = centerZ + Math.sin(angle) * radius;

    directionalLight.position.set(x, y, z);
    renderer.render(scene, camera);
}

animate();



// Properties to resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
