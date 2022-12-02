import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Enemy } from './enemy';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { AnimationMixer } from 'three';

const hdrTextureURL = new URL('kloppenheim_03_4k.hdr', import.meta.url)


// author: Fyrestar <info@mevedia.com>
var camera, scene, renderer, mesh, goal, keys, follow;

var time = 0;
var newPosition = new THREE.Vector3();
var matrix = new THREE.Matrix4();

var stop = 1;
var DEGTORAD = 0.01745327;
var temp = new THREE.Vector3;
var dir = new THREE.Vector3;
var a = new THREE.Vector3;
var b = new THREE.Vector3;
var coronaSafetyDistance = 1;
var velocity = 0.0;
var speed = 0.0;




init();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.set( 0, 0.3, 0 );
    
    scene = new THREE.Scene();
    camera.lookAt( scene.position );

    var geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
    var material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    
    goal = new THREE.Object3D;
    follow = new THREE.Object3D;
    follow.position.z = -coronaSafetyDistance;
    mesh.add( follow );
    
    goal.add( camera );
    scene.add( mesh );
 

    
    var gridHelper = new THREE.GridHelper( 40, 40 );
    // scene.add( gridHelper );
    
    scene.add( new THREE.AxesHelper() );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
  
keys = {
    a: false,
    s: false,
    d: false,
    w: false,
    n: false,
    m: false
  };
  
  document.body.addEventListener( 'keydown', function(e) {
    
    const key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
      keys[ key ] = true;
    
  });
  document.body.addEventListener( 'keyup', function(e) {
    
    const key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
      keys[ key ] = false;
    
  });

}

const enemyArr = []

for (let i = 0; i < 200; i++) {
  const enemy = new Enemy()
  const enemyMesh = enemy.mesh
  
  enemyMesh.position.set(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5) , Math.floor(Math.random() * 5))
  enemyArr.push(enemy)
  scene.add(enemyMesh)
}



let enemySpeed = (Math.random() * 0.05)

speed = 0.01;

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

const loader = new RGBELoader();
loader.load(hdrTextureURL, function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
})

// Ammo().then(start)

// function start() {

// }


animate();

function animate() {

    requestAnimationFrame( animate );
    
    
  // velocity += ( speed - velocity ) * .3;

  // enemy.velocity += (enemy.speed - enemy.velocity) * 0.3;

  // console.log('speed', enemy.speed);
  
  if ( keys.w )
    mesh.rotateX(0.05);
  else if ( keys.s )
    mesh.rotateX(-0.05);

  
  mesh.translateZ( speed );

  // console.log(enemyMesh.position.z);
  
  // console.log(enemy.speed);

  enemyArr.forEach(enemy => {
    console.log(enemy);
    enemy.mesh.translateX(enemy.xSpeed)
    enemy.mesh.translateY(enemy.ySpeed)
    enemy.mesh.translateZ(enemy.zSpeed)
    
    if (enemy.mesh.position.z > 5) {
      console.log('turn around');
      enemy.zSpeed = -enemy.zSpeed
    }
    if (enemy.mesh.position.z < -5) {
      console.log('turn around again');
      enemy.zSpeed = -enemy.zSpeed
    }
    if (enemy.mesh.position.y > 5) {
      console.log('turn around');
      enemy.ySpeed = -enemy.ySpeed
    }
    if (enemy.mesh.position.y < -5) {
      console.log('turn around again');
      enemy.ySpeed = -enemy.ySpeed
    }
    if (enemy.mesh.position.x > 5) {
      console.log('turn around');
      enemy.xSpeed = -enemy.xSpeed
    }
    if (enemy.mesh.position.x < -5) {
      console.log('turn around again');
      enemy.xSpeed = -enemy.xSpeed
    }
  })

  if ( keys.a )
    mesh.rotateY(0.05);
  else if ( keys.d )
    mesh.rotateY(-0.05);

  if ( keys.n )
    mesh.rotateZ(-0.03);
  else if ( keys.m )
    mesh.rotateZ(0.03);
		
  
  a.lerp(mesh.position, 0.4);
  b.copy(goal.position);
  
    dir.copy( a ).sub( b ).normalize();
    const dis = a.distanceTo( b ) - coronaSafetyDistance;
    goal.position.addScaledVector( dir, dis );
    goal.position.lerp(temp, 0.02);
    temp.setFromMatrixPosition(follow.matrixWorld);
    
    camera.lookAt( mesh.position );
    
    renderer.render( scene, camera );

}