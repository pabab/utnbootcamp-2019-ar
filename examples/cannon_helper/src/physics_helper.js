import CANNON from 'cannon';
import * as THREE from 'three'


export class PhysicsHelper {
    constructor(scene) {
        this.scene = scene;

        // Setup our world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -5, 0); // m/s²

        this.debugMeshes = new THREE.Group();
        this.debugMeshes.visible = true;
        this.scene.add(this.debugMeshes);
        this.bodyMeshes = [];

        this.fixedTimeStep = 1.0 / 60.0; // seconds
        this.maxSubSteps = 3;
    }
  
    createBoxBody(mesh, args){
        var body = new CANNON.Body({
            mass: args['mass'] // mass == 0 makes the body static
        });
        var width = args['width'] || 1;
        var height = args['height'] || 1;
        var depth = args['depth'] || 1;
        var shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
        body.addShape(shape);
        var pos = args['position']||new CANNON.Vec3(0,0,0);
        body.position.set(pos.x,pos.y, pos.z);
        console.log(body.position)
        this.world.addBody(body);
        
        
        var boxGeometry = new THREE.BoxGeometry(width, height, depth);
        var geo = new THREE.WireframeGeometry( boxGeometry ); // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
        var wireframe = new THREE.LineSegments( geo, mat );

        this.bodyMeshes.push({body: body, mesh: mesh, debugMesh: wireframe});
        this.debugMeshes.add(wireframe)
        // debug mesh
        return body;
    }

    createSphereBody(mesh, args){
        let body = new CANNON.Body({
            mass: args['mass'],
            position: args['position'],
            shape: new CANNON.Sphere(args['radius'])
        });
        this.world.addBody(body);

        var sphereGeometry = new THREE.SphereGeometry(args['radius']||1, 10, 10);
        var geo = new THREE.WireframeGeometry( sphereGeometry ); // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
        var wireframe = new THREE.LineSegments( geo, mat );
        this.bodyMeshes.push({body: body, mesh: mesh, debugMesh: wireframe});;
        this.debugMeshes.add(wireframe)
        return body;
    }

    step(dt) {
        this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
        this.updateMeshes();
    }
  
    updateMeshes(){
        for(let i = 0; i < this.bodyMeshes.length; i++){
            this.bodyMeshes[i].mesh.position.copy(this.bodyMeshes[i].body.position);
            this.bodyMeshes[i].mesh.quaternion.copy(this.bodyMeshes[i].body.quaternion);
            this.bodyMeshes[i].debugMesh.position.copy(this.bodyMeshes[i].body.position);
            this.bodyMeshes[i].debugMesh.quaternion.copy(this.bodyMeshes[i].body.quaternion);
        }
    }
  
    
}