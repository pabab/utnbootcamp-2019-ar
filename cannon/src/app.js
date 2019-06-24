import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader';
import CANNON from 'cannon';


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

var world, sphereBody, groundBody;
var fixedTimeStep = 1.0 / 60.0; // seconds
var maxSubSteps = 3;
var lastTime, time;
function init() {
    // Setup our world
    world = new CANNON.World();
    world.gravity.set(0, 0, -9.82); // m/s²

    // Create a sphere
    var radius = 1; // m
    sphereBody = new CANNON.Body({
    mass: 5, // kg
    position: new CANNON.Vec3(0, 0, 10), // m
    shape: new CANNON.Sphere(radius)
    });
    world.addBody(sphereBody);

    // Create a plane
    groundBody = new CANNON.Body({
        mass: 0 // mass == 0 makes the body static
    });
    var groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    world.addBody(groundBody);
}

init();

// Start the simulation loop
(function simloop(time){
    requestAnimationFrame(simloop);
    if(lastTime !== undefined){
       var dt = (time - lastTime) / 1000;
       world.step(fixedTimeStep, dt, maxSubSteps);
    }
    console.log("Sphere z position: " + sphereBody.position.z);
    lastTime = time;
  })();




