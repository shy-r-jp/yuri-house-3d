
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene=new THREE.Scene(); scene.background=new THREE.Color(0xe9eef4);
const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.05,100); camera.position.set(15,12,17);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; document.getElementById('app').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x77818b,1.8));
const sun=new THREE.DirectionalLight(0xffffff,2.4); sun.position.set(10,20,12); sun.castShadow=true; scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0xcfd6db,roughness:1})); ground.rotation.x=-Math.PI/2; ground.position.y=-.03; ground.receiveShadow=true; scene.add(ground);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.target.set(0,2.4,0); controls.minDistance=4; controls.maxDistance=40; controls.maxPolarAngle=Math.PI*.49;

const house=new THREE.Group(), f1=new THREE.Group(), f2=new THREE.Group(), roof=new THREE.Group(), labels1=new THREE.Group(), labels2=new THREE.Group();
scene.add(house); house.add(f1,f2,roof,labels1,labels2);
const BW=12.740, BD=9.555, H1=2.600, H2=2.500, SL=.16, WALL=.12, Y2=H1+SL;
const wallMat=new THREE.MeshStandardMaterial({color:0xf0eadf,roughness:.92}), innerMat=new THREE.MeshStandardMaterial({color:0xf8f5ef,roughness:.95}), f1Mat=new THREE.MeshStandardMaterial({color:0xc8aa7a,roughness:.95}), f2Mat=new THREE.MeshStandardMaterial({color:0xd7c29a,roughness:.95}), foundation=new THREE.MeshStandardMaterial({color:0xc4c7c8,roughness:1}), roofMat=new THREE.MeshStandardMaterial({color:0x2b3035,roughness:.9});

function cube(g,x,z,w,d,h,y,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y+h/2,z);o.castShadow=o.receiveShadow=true;g.add(o);return o}
function wall(g,x,z,len,h,y,alongX=true,m=innerMat){cube(g,x,z,alongX?len:WALL,alongX?WALL:len,h,y,m)}
function label(t,x,y,z,g){const c=document.createElement('canvas');c.width=512;c.height=128;const q=c.getContext('2d');q.fillStyle='rgba(255,255,255,.88)';q.fillRect(8,20,496,88);q.fillStyle='#222';q.font='700 36px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(t,256,64);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));s.position.set(x,y,z);s.scale.set(2.7,.68,1);g.add(s)}

// 1F
cube(f1,0,0,BW,BD,.2,-.2,foundation); cube(f1,0,0,BW,BD,.1,0,f1Mat);
wall(f1,0,-BD/2,BW,H1,0,true,wallMat); wall(f1,0,BD/2,BW,H1,0,true,wallMat); wall(f1,-BW/2,0,BD,H1,0,false,wallMat); wall(f1,BW/2,0,BD,H1,0,false,wallMat);
wall(f1,-2.73,.10,8.90,H1,0,false); wall(f1,-4.55,.18,3.64,H1,0,true); wall(f1,-4.55,-2.58,3.64,H1,0,true); wall(f1,3.15,-.45,6.90,H1,0,false); wall(f1,4.55,1.00,2.75,H1,0,true); wall(f1,4.55,-1.35,2.75,H1,0,true); wall(f1,1.75,2.10,2.45,H1,0,true);
label('LDK1 約29.4帖',.1,1.05,-.8,labels1); label('洋室A 6帖',-4.55,1.05,2.45,labels1); label('洋室B 7帖',-4.55,1.05,-2.75,labels1); label('玄関',4.15,1.05,-3.05,labels1);

// 2F
cube(f2,0,0,BW,BD,.12,Y2,f2Mat); const Y2W=Y2+.12;
wall(f2,0,-BD/2,BW,H2,Y2W,true,wallMat); wall(f2,0,BD/2,BW,H2,Y2W,true,wallMat); wall(f2,-BW/2,0,BD,H2,Y2W,false,wallMat); wall(f2,BW/2,0,BD,H2,Y2W,false,wallMat);
wall(f2,-2.05,.15,8.60,H2,Y2W,false); wall(f2,-4.30,.45,4.55,H2,Y2W,true); wall(f2,-4.30,-2.35,4.55,H2,Y2W,true); wall(f2,2.35,.25,8.20,H2,Y2W,false); wall(f2,4.25,1.10,3.15,H2,Y2W,true); wall(f2,4.25,-1.10,3.15,H2,Y2W,true);
cube(f2,-4.35,-BD/2-.78,3.85,1.45,.12,Y2+.02,foundation); cube(f2,3.75,-BD/2-.74,2.70,1.36,.12,Y2+.02,foundation);
label('LDK2 約21.4帖',0,Y2W+1.05,-.6,labels2); label('洋室C 4.5帖',-4.5,Y2W+1.05,2.5,labels2); label('洋室D 6帖',-4.5,Y2W+1.05,-2.7,labels2); label('洋室E 7帖',4.05,Y2W+1.05,2.4,labels2);

// roof
const geo=new THREE.BufferGeometry(); const v=new Float32Array([-6.9,0,-5.35,6.9,0,-5.35,0,1,0, 6.9,0,-5.35,6.9,0,5.35,0,1,0, 6.9,0,5.35,-6.9,0,5.35,0,1,0, -6.9,0,5.35,-6.9,0,-5.35,0,1,0]); geo.setAttribute('position',new THREE.BufferAttribute(v,3)); geo.computeVertexNormals(); const rm=new THREE.Mesh(geo,roofMat); rm.position.y=Y2W+H2; rm.castShadow=true; roof.add(rm);

let floor='all',roofOn=true,labelsOn=true,walk=false;
function sync(){f1.visible=floor!=='2';f2.visible=floor!=='1';labels1.visible=labelsOn&&floor!=='2';labels2.visible=labelsOn&&floor!=='1';roof.visible=roofOn&&floor!=='1'}
document.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-floor]').forEach(x=>x.classList.remove('active'));b.classList.add('active');floor=b.dataset.floor;sync()});
function view(name){document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===name))}
document.querySelector('[data-view="orbit"]').onclick=()=>{walk=false;controls.enabled=true;camera.position.set(15,12,17);controls.target.set(0,2.4,0);controls.update();view('orbit')};
document.querySelector('[data-view="top"]').onclick=()=>{walk=false;controls.enabled=true;camera.position.set(0,27,.01);controls.target.set(0,0,0);controls.update();view('top')};
document.querySelector('[data-view="walk"]').onclick=()=>{walk=true;controls.enabled=false;camera.position.set(0,1.6,-1.7);camera.rotation.set(0,Math.PI,0);view('walk')};
document.getElementById('roofBtn').onclick=e=>{roofOn=!roofOn;e.currentTarget.textContent='屋根 '+(roofOn?'ON':'OFF');e.currentTarget.classList.toggle('active',roofOn);sync()};
document.getElementById('labelBtn').onclick=e=>{labelsOn=!labelsOn;e.currentTarget.textContent='部屋名 '+(labelsOn?'ON':'OFF');e.currentTarget.classList.toggle('active',labelsOn);sync()};
let drag=false,lx=0,ly=0,yaw=Math.PI,pitch=0;
renderer.domElement.addEventListener('pointerdown',e=>{if(walk){drag=true;lx=e.clientX;ly=e.clientY}});
renderer.domElement.addEventListener('pointermove',e=>{if(!walk||!drag)return;yaw-=(e.clientX-lx)*.005;pitch-=(e.clientY-ly)*.004;pitch=Math.max(-1.15,Math.min(1.15,pitch));lx=e.clientX;ly=e.clientY;camera.rotation.set(pitch,yaw,0,'YXZ')});
renderer.domElement.addEventListener('pointerup',()=>drag=false); renderer.domElement.addEventListener('pointercancel',()=>drag=false);
sync(); document.getElementById('status').textContent='ready';
(function loop(){requestAnimationFrame(loop);if(!walk)controls.update();renderer.render(scene,camera)})();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
