import * as THREE from 'three'

export class Enemy{

    constructor(){
        this.geometry = new THREE.SphereGeometry( 0.2, 62, 32 );
        this.geometry
        this.material = new THREE.MeshNormalMaterial();
        this.velocity = 0
        this.xSpeed =(Math.random() * 0.05) 
        this.ySpeed =(Math.random() * 0.05) 
        this.zSpeed =(Math.random() * 0.05) 
        this.mesh = new THREE.Mesh( this.geometry, this.material )
        
    }
}