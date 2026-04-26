import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// CREATE SCENE AND CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const clock = new THREE.Clock();

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
let globe
loader.load( '/static/3D_objects/test.glb', function ( gltf ) {
  globe = gltf.scene
  scene.add( globe );
}, undefined, function ( error ) {
  console.error( error );
} );

// ajout des petits bonhommes
let mixers = [];
for(let i = 0; i < 10; i++)
{
  loader.load('static/3D_objects/bonhomme3animations.glb', function ( gltf ) {
    
    
      const smallGuy = gltf.scene
      smallGuy.position.set(i*2, 0, 0);
      scene.add( smallGuy );

      mixers[i] = new THREE.AnimationMixer(smallGuy);
      const animations = gltf.animations;

      //console.log(animations)

      if (animations && animations.length > 0) {
        const action = mixers[i].clipAction(animations[4]); // idle low animation
        action.play();
      }

    

  }, undefined, function ( error ) {
    console.error( error );
  } );

  }
// TRY HAVING A box ABOVE
const width = 0.2
let px = 1+ width/2;
let py = 0;
let pz = 0;
const material = new THREE.MeshPhongMaterial({
  color: 0xFFFF00,   
  flatShading: true,
});
const box = new THREE.Mesh( new THREE.BoxGeometry( width, width, width ), material );
box.position.set(px, py, pz )
scene.add(box)

camera.position.z = 5;
// OrbitControls to orbit around 0
// To orbit around specific target, see https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_keyframes.html
const controls = new OrbitControls( camera, renderer.domElement );

// ANIMATE
function animate( time ) {
  controls.update();
  if(globe && box){
    let xmov=time/2000
    let ymov = time/1000
    box.position.x = Math.cos(xmov)*Math.cos(ymov);
    box.position.y = Math.sin(xmov)*Math.cos(ymov);
    box.position.z = Math.sin(ymov);
    box.lookAt(0, 0, 0); // to rotate the box according to its position (always look at the center of the globe)
  }

  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  
for(let i = 0; i < 10; i++)
{
  if (mixers[i]) mixers[i].update(delta);
}
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );