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

function init() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    )
    camera.position.z = 5

    const radius = 0.7
    const tubeRadius = 0.3
    const radialSegments = 8
    const tubularSegments = 24
    const geometry = new THREE.TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments)

    material = new THREE.MeshPhongMaterial({color: 0xccfc0c})
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    var lighta = new THREE.AmbientLight(0x993333)
    scene.add(lighta);

    var light = new THREE.PointLight( 0xffffff )
    light.position.set( -1, 1, 1 ).normalize()
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    var loader = new GLTFLoader();
    loader.load( 'models/model.gltf', function ( gltf ) {
        scene.add( gltf.scene );
        console.log("model ready")
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

function animate() {
    animationId = requestAnimationFrame(animate)

    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02

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
