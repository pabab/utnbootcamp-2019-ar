import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader';

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
var rocket_model;

function init() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    )
    camera.position.z = 5

    var ambient_light = new THREE.AmbientLight(0x999999);
    scene.add(ambient_light);

    var point_light = new THREE.PointLight( 0xffffff )
    point_light.position.set( -1, 1, 1 ).normalize()
    scene.add(point_light);

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    var loader = new GLTFLoader();

    loader.load( 'models/rocket/scene.gltf', function ( gltf ) {
        rocket_model = gltf.scene;
        scene.add( rocket_model );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

function animate() {
    animationId = requestAnimationFrame(animate)
    rocket_model.rotation.y += 0.01;
    

    renderer.render(scene, camera)
}


function load_model(){
    var loader = new THREE.GLTFLoader();
    loader.load( 'models/car/scene.gltf', function ( gltf ) {
        console.log("sucess")
        gltf.scene.scale.divideScalar(100)
        model = gltf.scene;
        scene.add( gltf.scene );
    }, undefined, function ( error ) {
        console.error( error );
    } );

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
