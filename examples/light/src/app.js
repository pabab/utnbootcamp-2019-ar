import * as THREE from 'three'

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
    camera.position.y = 1
    camera.lookAt(new THREE.Vector3(0, 0, 0))

   
    const radius = 0.5
    const tubeRadius = 0.2
    const radialSegments = 8
    const tubularSegments = 24
    const geometry = new THREE.TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments)

    material = new THREE.MeshPhongMaterial({color: 0xccfc0c})
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    mesh.castShadow = true;

    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffccff})
    var planeGeom = new THREE.BoxGeometry(5, 0.1, 5);
    var plane = new THREE.Mesh(planeGeom, planeMaterial)
    plane.receiveShadow = true;
    plane.castShadow = true;

    plane.position.y = -1;
    scene.add(plane)

    var light = new THREE.PointLight( 0xffffff );
    light.position.set( -2, 5, 2 ).normalize();
    light.castShadow = true;   
    light.shadowDarkness = 0.5;
    light.shadowCameraVisible = true;

    scene.add(light);


    var ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add(ambientLight)
        
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement)
}

function animate() {
    animationId = requestAnimationFrame(animate)

    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02

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
