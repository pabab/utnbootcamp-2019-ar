import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader';
import CANNON from 'cannon';
import {PhysicsHelper} from './physics_helper'

// Initial HMR Setup
if (module.hot) {
    module.hot.accept()

    module.hot.dispose(() => {
        document.querySelector('canvas').remove()
        renderer.forceContextLoss()
        renderer.context = null
        renderer.domElement = null
        renderer = null
        cancelAnimationFrame(animationId)
        removeEventListener('resize', resize)
    })
}

let scene, camera, renderer, animationId
var world;
var lastTime, time;
function init() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    )
    camera.position.z = 1
    camera.position.y = 0.5


    // Create a sphere
    world = new PhysicsHelper(scene)
    
    var geometry = new THREE.BoxGeometry(0.12, 0.12, 0.12 );
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    var mesh2 = new THREE.Mesh(geometry, material)
    scene.add(mesh2)

    var mesh3 = new THREE.Mesh(geometry, material)
    scene.add(mesh3)

    var mesh4 = new THREE.Mesh(geometry, material)
    scene.add(mesh4)

    var planeGeometry = new THREE.BoxGeometry(1, 0.01, 1);
    var planeMesh = new THREE.Mesh(planeGeometry, material);
    scene.add(planeMesh);
    
    
    world.createBoxBody(planeMesh, {mass: 0, width: 1, height: 0.01, depth: 1});
    world.createBoxBody(mesh, {mass: 1, width: 0.12, height: 0.12, depth: 0.12, position: new CANNON.Vec3(0, 2, 0)});
    world.createBoxBody(mesh2, {mass: 1, width: 0.12, height: 0.12, depth: 0.12, position: new CANNON.Vec3(0, 3, 0)});
    world.createBoxBody(mesh3, {mass: 1, width: 0.12, height: 0.12, depth: 0.12, position: new CANNON.Vec3(0, 4, 0)});
    var b = world.createSphereBody(mesh4, {radius: 0.1, mass: 5, position: new CANNON.Vec3(0, 2, 0)});
    b.velocity.set(0.1, 0, 0)


    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    
    
}

init();

// Start the simulation loop
(function simloop(time){
    requestAnimationFrame(simloop);
    if(lastTime !== undefined){
       var dt = (time - lastTime) / 1000;
       world.step(dt);
    }
    //console.log("Sphere z position: " + sphereBody.position.z);
    lastTime = time;
    if(renderer)renderer.render(scene, camera)
  })();


// Event listeners
function resize() {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}

addEventListener('resize', resize)

