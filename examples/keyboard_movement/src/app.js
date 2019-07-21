import * as THREE from 'three'


function init() {
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


    // Three Scene
    let scene, camera, renderer, animationId
    let geometry, material, mesh
    let cubeVelx = 0, cubeVelz = 0;
    
    var keyboard = require('./keyboard')
    var keyboardState = new keyboard.KeyboardState();

    var clock = new THREE.Clock();

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    )
    camera.position.z = 2;
    camera.position.y = 1;
    camera.lookAt(new THREE.Vector3(0,0,0));

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    var planeGeom =  new THREE.BoxGeometry(2, 0.02, 2 );
    var plane = new THREE.Mesh(planeGeom, material);
    plane.position.y = -0.2;
    scene.add(plane);


    function animate() {
        animationId = requestAnimationFrame(animate)
        keyboardState.update();
        var elapsed = clock.getDelta(); 
        if(keyboardState.pressed('A')){
            cubeVelx = -1;
        }else if(keyboardState.pressed('D')){
            cubeVelx = 1;
        }else{
            cubeVelx = 0;
        }
        if(keyboardState.pressed('W')){
            cubeVelz = -1;
        }else if(keyboardState.pressed('S')){
            cubeVelz = 1;
        }else{
            cubeVelz = 0;
        }
        mesh.position.x += cubeVelx * elapsed;
        mesh.position.z += cubeVelz * elapsed;
        renderer.render(scene, camera)
    }
    animate();

    // Event listeners
    function resize() {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    }

    addEventListener('resize', resize);

 
}



init()


