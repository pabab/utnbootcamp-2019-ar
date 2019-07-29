import * as THREE from 'three'


class Enemy{
    constructor(scene) {
        var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2 )
        var material = new THREE.MeshNormalMaterial()
        this.mesh = new THREE.Mesh(geometry, material)
        this.initPosition();
        scene.add(this.mesh)
    }

    initPosition(){
        var x = -1+Math.random()*2;
        var z = -50-(50*Math.random()); 
        this.mesh.position.set(x, 0, z)
    }

    update(elapsed){
        this.mesh.position.z += 20 * elapsed;
        if(this.mesh.position.z>10){
            this.initPosition()
        }
    }

    getMesh(){
        return this.mesh
    }
}





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

    var vel = 0.01;
    var enemies = [];
    var gameOver = false;
    var score = 0;

    // Three Scene
    let scene, camera, renderer, animationId
    let geometry, material, mesh
    let cubeVelx = 0, cubeVelz = 0;
    const textureLoader = new THREE.TextureLoader();


    var keyboard = require('./keyboard')
    var keyboardState = new keyboard.KeyboardState();

    var clock = new THREE.Clock();

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        500
    )
    camera.position.z = 2;
    camera.position.y = 0.5;
    camera.lookAt(new THREE.Vector3(0,0,0));

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = 1
    mesh.position.y = 0
    scene.add(mesh)
    

    var boxPlayer = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    var boxEnemy = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    var floorTexture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 2);
    const floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
      });
    var planeGeom =  new THREE.BoxGeometry(2, 0.02, 100 );
    var plane = new THREE.Mesh(planeGeom, material);
    plane.position.y = -0.2;
    scene.add(plane);

    var materialCollision = new THREE.MeshBasicMaterial({color: '#ff0000'});

    var level = 0;
    function nextLevel(){
        level++;
        for(var i=0; i<level; i++){
            var e = new Enemy(scene)
            enemies.push(e)
        }
        if(!gameOver) setTimeout(nextLevel, 5000);
    }
    nextLevel();


    function animate() {
        animationId = requestAnimationFrame(animate)
        if(!gameOver){
            
            keyboardState.update();
            var elapsed = clock.getDelta(); 
            score += elapsed;
            if(keyboardState.pressed('A')){
                cubeVelx = -1;
            }else if(keyboardState.pressed('D')){
                cubeVelx = 1;
            }else{
                cubeVelx = 0;
            }

            mesh.position.x += cubeVelx * elapsed;
            mesh.position.z += cubeVelz * elapsed;

            if(mesh.position.x <= (-1+boxPlayer.getSize().x)){
                mesh.position.x = (-1+boxPlayer.getSize().x);
                cubeVelx = 0;
            }else if(mesh.position.x >= 1-boxPlayer.getSize().x){
                mesh.position.x = 1-boxPlayer.getSize().x;
                cubeVelx = 0;
            }

            // animate enemies
            enemies.forEach((e)=>{
                e.update(elapsed)
            })

            // test collisions
            boxPlayer.setFromObject(mesh)
            enemies.forEach((e)=>{
                boxEnemy.setFromObject(e.getMesh())
                if(boxPlayer.intersectsBox(boxEnemy)){
                    gameOver = true;
                    document.getElementById("game_over").style.display="block";
                }
            });

            // update score
            document.getElementById("score").innerHTML = Math.floor(score)
        }
        

        


       

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


