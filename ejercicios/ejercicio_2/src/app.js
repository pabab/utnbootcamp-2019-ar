import * as THREE from 'three'
import {
    ArToolkitSource,
    ArToolkitContext,
    ArMarkerControls,
} from 'node-ar.js';


function init() {
    ////////////////////////////////////////////////////////////
	// setup Three scene, camera and renderer
    ////////////////////////////////////////////////////////////
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(640, 480)
    document.body.appendChild(renderer.domElement)

    /// 1) TODO: create artoolkit source

    function onResize(){
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)	
        
        if( arToolkitContext.arController !== null ){
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
        }
    }

    /// 2) TODO: init artoolkit source
    

    // handle resize
    window.addEventListener('resize', function(){
        onResize()
    })


    /// 3) TODO: setup artoolkit context

    var markerRoot = new THREE.Group();
    scene.add(markerRoot);

    /// 4) TODO: setup marker controls
   
    
  

    var geometry, material, mesh;
    geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material)
    markerRoot.add(mesh)


    ////////////////////////////////////////////////////////////
	// setup animation loop
	////////////////////////////////////////////////////////////
    function update() {
        /// 5) TODO: update artoolkit

    }
    
    function render() {
        renderer.render( scene, camera );
    }
    
    // Three Scene
    var animationId
    function animate() {
        animationId=requestAnimationFrame(animate);
        update();
        render();
    }

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
            removeEventListener('resize', onResize)
        })
    }

    animate()
}

init()
