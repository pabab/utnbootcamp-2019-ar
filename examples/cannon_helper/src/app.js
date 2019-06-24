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
    
    var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2 );
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)


    var planeGeometry = new THREE.BoxGeometry(1, 0.01, 1);
    var planeMesh = new THREE.Mesh(planeGeometry, material);
    scene.add(planeMesh);
    
    
    world.createBoxBody(planeMesh, {mass: 0, width: 1, height: 0.01, depth: 1});
    world.createSphereBody(mesh, {radius: 0.01, mass: 5, position: new CANNON.Vec3(0, 2, 0)});



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
    renderer.render(scene, camera)
  })();




