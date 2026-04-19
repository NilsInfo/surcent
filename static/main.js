import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// CREATE SCENE AND CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// CREATE RENDERER IN HTML DOC
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
document.body.appendChild( renderer.domElement );

// Lumière ambiante — éclaire tout uniformément
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Lumière directionnelle — simule le soleil
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// LOAD MY OBJECT
const loader = new GLTFLoader();
let sphere
loader.load( '/static/3D_objects/test.glb', function ( gltf ) {
  sphere = gltf.scene
  scene.add( sphere );
}, undefined, function ( error ) {
  console.error( error );
} );

camera.position.z = 5;
// OrbitControls to orbit around 0
// To orbit around specific target, see https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_keyframes.html
const controls = new OrbitControls( camera, renderer.domElement );

// ANIMATE
function animate( time ) {
  controls.update();
  // if(sphere){
  //   sphere.rotation.x = time / 2000;
  //   sphere.rotation.y = time / 1000;
  // }
  
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );