import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const RESOURCES_PATH = 'resources/images/'


//Scene configuration
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(10, 5, 10);
camera.lookAt(0, 0, 0);

//renderer configuration
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);
document.getElementById('section1').appendChild(renderer.domElement);


// Controls configuration
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const loader = new THREE.TextureLoader();

// Add galaxy texture
const galaxyTexture = loader.load(RESOURCES_PATH + 'galaxy_texture.png')
const galaxyMaterial = new THREE.MeshBasicMaterial({
    map: galaxyTexture,
    side: THREE.BackSide,
})
const galaxyRadius = 99;
const galaxyGeometry = new THREE.SphereGeometry(galaxyRadius, 32, 32)
const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
scene.add(galaxyMesh)

// Add earth sphere 
const earthRadius = 1
var geometry = new THREE.SphereGeometry(earthRadius, 32, 32);

const texture = loader.load(RESOURCES_PATH + 'earth_texture.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshPhongMaterial({
    map: texture,
});
// Load the bumpTexture
const bumpTexture = loader.load(RESOURCES_PATH + 'earth_bump.jpg')
material.bumpMap = bumpTexture
// FIXME: According to the docs, this value should be between 0 and 1
material.bumpScale = 25

// Load the specularMap
material.specularMap = loader.load(RESOURCES_PATH + 'earth_specular.jpg')
material.specular = new THREE.Color('grey')

//Load the cloudMesh
var cloudTexture = loader.load(RESOURCES_PATH + 'fair_clouds_4k.png')
var cloudGeometry = new THREE.SphereGeometry(earthRadius + 0.1, 32, 32)
var cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    side: THREE.DoubleSide,
    opacity: 0.8,
    transparent: true,
    depthWrite: false,
});
var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
var earthmesh = new THREE.Mesh(geometry, material);
earthmesh.add(cloudMesh)

scene.add(earthmesh)

// Add ambiental light
const color_white = 0x000000
const ambientalLight = new THREE.AmbientLight(color_white, 1);
scene.add(ambientalLight);

// Add directional light
const color_yellow_light = 0x404040
const directionalLight = new THREE.DirectionalLight(color_yellow_light, 100);
scene.add(directionalLight);


// Add the sun 
const suntexture = loader.load(RESOURCES_PATH + 'sun_texture.jpg');
const sunmaterial = new THREE.MeshBasicMaterial({ map: suntexture })
var sunmesh = new THREE.Mesh(geometry, sunmaterial)
scene.add(sunmesh)


// --- HELPER SECTION ---
// Add light helper
// const helper = new THREE.DirectionalLightHelper(directionalLight, 3, 0x00ff00);
//scene.add(helper);
//scene.add(new THREE.AxesHelper(5))

function animate() {
    requestAnimationFrame(animate);


    const time = performance.now() * 0.001;
    const radius = 10;
    const centerX = 0;
    const centerY = 0;
    const centerZ = 0;
    const angle = time * 0.5; // Velocidad de rotación

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.cos(angle) * radius;
    const z = centerZ + Math.sin(angle) * radius;

    cloudMesh.rotation.y += 0.01;
    earthmesh.rotation.y += 0.01;
    sunmesh.position.set(x, y, z);
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
