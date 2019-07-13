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

    ////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////
    const _artoolkitsource = ArToolkitSource(THREE);
    const arToolkitSource = new _artoolkitsource({
        // to read from the webcam
        sourceType: 'webcam',

        // to read from an image
		// sourceType : 'image',
        // sourceUrl : '../assets/images/img.jpg',
        
		// to read from a video
		// sourceType : 'video',
		// sourceUrl : '../assets/videos/video.mp4',
    });

    function onResize(){
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)	
        
        if( arToolkitContext.arController !== null ){
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
        }
    }

    arToolkitSource.init(function onReady(){
        onResize()
    })

    // handle resize
    window.addEventListener('resize', function(){
        onResize()
    })

    ////////////////////////////////////////////////////////////
	// setup arToolkitContext
    ////////////////////////////////////////////////////////////
    const arToolkitContext = new ArToolkitContext({
        cameraParametersUrl: 'assets/params/camera_para.dat',
        detectionMode: 'mono',
        maxDetectionRate: 30,
        canvasWidth: 640,
        canvasHeight: 480
    });

    // copy projection matrix to camera when initialization complete
    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    ////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////
    var markerRoot = new THREE.Group();
    scene.add(markerRoot);
    var markerControls = new ArMarkerControls(arToolkitContext, markerRoot, {
        type: 'pattern',
        patternUrl: 'assets/params/patt.hiro',
    });

    var geometry, material, mesh;
    geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material)
    markerRoot.add(mesh)


    ////////////////////////////////////////////////////////////
	// setup animation loop
	////////////////////////////////////////////////////////////
    function update() {
        // update artoolkit on every frame
        if ( arToolkitSource.ready !== false )
            arToolkitContext.update( arToolkitSource.domElement );
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
