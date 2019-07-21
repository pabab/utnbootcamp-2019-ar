import * as THREE from 'three'
const OrbitControls = require( 'three-orbit-controls' )( THREE );

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
let controls

function init() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    )
    camera.position.set(0, 0.5, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    
    scene.add( new THREE.AxisHelper( 1) );

    var material = new THREE.MeshNormalMaterial();

    // plane
    var planeGeometry = new THREE.BoxGeometry( 1, 0.01 , 1);
    var plane = new THREE.Mesh(planeGeometry, material)

    // box
    var boxGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.1 );
    var box = new THREE.Mesh(boxGeometry, material)
    box.position.y=0.2/2;
    
    // 

    scene.add(plane)
    scene.add(box)
    
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    controls = new OrbitControls( camera, renderer.domElement );

    controls.update();

    var geometry = new THREE.ConeGeometry( 0.1/2.0, 0.2, 20 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var cone = new THREE.Mesh( geometry, material );
    cone.position.y = 0.3;
    scene.add( cone );
    
}

function animate() {
    animationId = requestAnimationFrame(animate)


    renderer.render(scene, camera)
}

init()
animate()

// Event listeners
function resize() {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}

addEventListener('resize', resize)
