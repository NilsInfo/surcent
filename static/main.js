import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';

// CREATE SCENE AND CAMERA
const scene = new THREE.Scene();
const clock = new THREE.Clock();


// camera variables
let camera_travel_time = 1.5; // seconds
let elapsed = 0;
let traveling = false;
let target = new THREE.Vector3(); // initial target is world view
let world_view_target = new THREE.Vector3(0, 0, 5);
let fov = 75;
let aspect = window.innerWidth / window.innerHeight;// TODO update on window size change ?
let near = 0.1;
let far = 1000;

// add camera
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

// CREATE Panel to see FPS
const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb
document.body.appendChild( stats.dom );

// CREATE RENDERER IN HTML DOC
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Lumière ambiante — éclaire tout uniformément
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// background pas noir
scene.background = new THREE.Color( 0xbde0fe );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

// Lumière directionnelle — simule le soleil
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// LOAD MY OBJECT
const loader = new GLTFLoader();
let globe
loader.load( '/static/3D_objects/terrev1.glb', function ( gltf ) {
  globe = gltf.scene
  scene.add( globe );
}, undefined, function ( error ) {
  console.error( error );
} );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

let top = 0
let middle = 0
let bottom = 0
// ajout des petits bonhommes
let mixers = [];
const center = new THREE.Vector3(0, 0, 0);
const radius = 1; // Corrige l'origine des smallGuys, qui devrait être à leur pied
const positions = []
const threshold = 0.3; // Pour ne pas que les persos se superposent
for(let i = 0; i < 10; i++)
{
  loader.load('/static/3D_objects/bonhommesurcent2.glb', function ( gltf ) {
    
      const smallGuy = gltf.scene
  
      let x = Math.random()*2*Math.PI
      let y = Math.random()*2*Math.PI
      let z = Math.random()
      while(checkIfTooClose(positions, [calcX(x,y,z), calcY(x,y,z), calcZ(x,y,z)], threshold)){
        x = Math.random()*2*Math.PI
        y = Math.random()*2*Math.PI
        z = Math.random()
      }
      
      positions.push([calcX(x,y,z), calcY(x,y,z), calcZ(x,y,z)])
      smallGuy.position.set(          
        calcX(x,y,z),
        calcY(x,y,z),
        calcZ(x,y,z)
      )
      smallGuy.scale.setScalar(0.1)
      smallGuy.lookAt(center) // to rotate the guy according to its position (always look at the center of the globe)
        smallGuy.rotateX(Math.PI/2) // to rotate the guy according to its position (always look at the center of the globe)
        smallGuy.rotateZ(Math.PI) // to rotate the guy according to its position (always look at the center of the globe)
      
      scene.add( smallGuy );

      mixers[i] = new THREE.AnimationMixer(smallGuy);
      const animations = gltf.animations;


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

// adding a static box to use as anchor for camera 
const nationalbox = new THREE.Mesh( new THREE.BoxGeometry( width, width, width ), material );
nationalbox.position.set(px, py, pz )
scene.add(nationalbox)
// target view is a vector one unit outside the globe in the direction of the box
let national_view_target = new THREE.Vector3(px*1.5, py*1.5, pz*1.5);


camera.position.z = 5;
// OrbitControls to orbit around 0
// To orbit around specific target, see https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_keyframes.html
const controls = new OrbitControls( camera, renderer.domElement );
let lastTime = 0;
// ANIMATE
function animate( time ) {
  if(time - lastTime < 1000/60) return; // limit to 60 fps
  lastTime = time;
  stats.begin();
  controls.update();
  if(globe && box){
    let xmov=time/2000
    let ymov = time/1000
    box.position.x = calcX(xmov,ymov,0);
    box.position.y = calcY(xmov,ymov,0);
    box.position.z = calcZ(xmov,ymov,0);
    box.lookAt(0, 0, 0); // to rotate the box according to its position (always look at the center of the globe)
  }

  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  
  for(let i = 0; i < 10; i++)
  {
    if (mixers[i]) mixers[i].update(delta);
  }

  // move camera if traveling
  if(traveling){
    elapsed += delta;
    // get next position of the camera
    const t = Math.min(elapsed / camera_travel_time, 1);
    camera.position.lerpVectors(camera.position, target, t);
    camera.lookAt(0, 0, 0);
    if(t === 1){
      traveling = false;
      elapsed = 0;
      console.log("camera move over")

    }
  }

  renderer.render( scene, camera );
  stats.end();
}
renderer.setAnimationLoop( animate );

function checkIfTooClose(positions,posToCheck, threshold){
  for(let i=0; i<positions.length; i++){
    if(Math.abs(posToCheck[0]-positions[i][0])<threshold && Math.abs(posToCheck[1]-positions[i][1])<threshold && Math.abs(posToCheck[2]-positions[i][2])<threshold){
      console.log("too close !")
      return true;
    }
  }
  return false;
}

function calcX(x,y,z){
  return Math.cos(x)*Math.cos(y)*radius        
}
function calcY(x,y,z){
  return Math.sin(x)*Math.cos(y)*radius        
}
function calcZ(x,y,z){
  return Math.sin(y)*radius
}

document.getElementById("national-box").addEventListener('click', () => {onNationalBoxClick()});

 function onNationalBoxClick(){
  // if camera is already moving, do nothing
  console.log("camera move start")
  if(traveling) return;

  traveling = true;
  target = national_view_target;
}

document.getElementById("world-box").addEventListener('click', () => {onWorldBoxClick()});

function onWorldBoxClick(){
  if(traveling) return;
  traveling = true;
  target = world_view_target;
}