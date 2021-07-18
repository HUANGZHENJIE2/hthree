

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import img from '../img/2k_mercury.jpg'

import sceneBg from '../img/2k_stars_milky_way.jpg'
import earthDayMap from '../img/2k_earth_daymap.jpg'

let hCanvas = document.querySelector('#hCanvas');
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


let renderer = new THREE.WebGLRenderer({
  canvas: hCanvas,
  antialias: true,
  alpha: true
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

//圆环
let geometry = new THREE.TorusGeometry(100, 1,16, 2000);
let material = new THREE.MeshStandardMaterial( { color: 0xFF6347});
let torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// 光源
let pointLight = new THREE.SpotLight(0xffffff);
pointLight.position.set(2000,4,20);

// let ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(pointLight, ambientLight);

scene.add(pointLight);
// let lightHelper = new THREE.PointLightHelper(pointLight);
// let gridHelper = new THREE.GridHelper(200,50);
//
// scene.add(lightHelper,gridHelper);

let spaceTexture = new THREE.TextureLoader().load(sceneBg);
scene.background = spaceTexture;

let controls = new OrbitControls(camera, renderer.domElement);

function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
            default:
                return 0;
            break;
    }
}
let starColor = [
    0xffffff,
    0x00188e,
    0xa90000,
]


let starArray = [];

// 小星星生成
function addStar() {
  let size = randomNum(25,100)
  let geometry = new THREE.SphereGeometry(0.25, size, size);
  let material = new THREE.MeshBasicMaterial({color: starColor[randomNum(0,2)]});
  let star = new THREE.Mesh(geometry, material);
  starArray.push(star)
  let [x,y,z] = Array(3)
    .fill()
    .map(()=> THREE.MathUtils.randFloatSpread(1000));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(2000).fill().forEach(addStar)


let moonTextures = new THREE.TextureLoader().load(img);
let earthTextures = new THREE.TextureLoader().load(earthDayMap);

// 月球
let moon  = new THREE.Mesh(
  new THREE.SphereGeometry(10,100,100),
  new THREE.MeshStandardMaterial({map: moonTextures})
);

// 地球
window.earth = new THREE.Mesh(
  new THREE.SphereGeometry(10,800,800),
  new THREE.MeshStandardMaterial({map: earthTextures})
);


window.earth.position.set(-800,0,20)

scene.add(window.earth)
scene.add(moon)

renderer.render(scene, camera);


function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;


  starArray.forEach(function (star) {
    star.position.y += 0.01;
    star.position.x += 0.005;
    star.position.z += 0.01;
  })

  earth.position.y += 0.01;
  earth.position.x += 0.005;
  earth.position.z += 0.01;
  earth.rotation.y += 0.01;
  moon.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}
animate();

function moveCamera(){
  let t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

