import CANNON from 'cannon';
import * as THREE from 'three'




export class PhysicsHelper {
    constructor(scene) {
        this.scene = scene;
        
        // Setup our world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // m/s²

        this.debugMeshes = new THREE.Group();
        this.debugMeshes.visible = false;
        this.scene.add(this.debugMeshes);
        this.bodyMeshes = [];

        this.fixedTimeStep = 1.0 / 60.0; // seconds
        this.maxSubSteps = 3;
    }
  
    createBoxBody(mesh, args){
        var body = new CANNON.Body({
            mass: args['mass'] // mass == 0 makes the body static
        });
        var shape = new CANNON.Box(new CANNON.Vec3(args['width'], args['height'], args['depth']));
        body.addShape(shape);
        this.world.addBody(body);
        this.bodyMeshes.push({body: body, mesh: mesh});
        return body;
    }

    createSphereBody(mesh, args){
        let body = new CANNON.Body({
            mass: args['mass'],
            position: args['position'],
            shape: new CANNON.Sphere(args['radius'])
        });
        this.world.addBody(body);
        this.bodyMeshes.push({body: body, mesh: mesh});
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
        }
    }
  
    
}