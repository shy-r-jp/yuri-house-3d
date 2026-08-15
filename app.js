import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xe9eef4);

const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.05,120);
camera.position.set(14,13,17);

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.getElementById('app').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff,0x7b8790,1.8));
const sun=new THREE.DirectionalLight(0xffffff,2.5);
sun.position.set(12,22,14);sun.castShadow=true;scene.add(sun);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(44,44),new THREE.MeshStandardMaterial({color:0xcfd6db,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.035;ground.receiveShadow=true;scene.add(ground);

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.target.set(0,1.8,0);
controls.minDistance=4;
controls.maxDistance=42;
controls.maxPolarAngle=Math.PI*.49;

const house=new THREE.Group(),f1=new THREE.Group(),f2=new THREE.Group(),roof=new THREE.Group();
const labels1=new THREE.Group(),labels2=new THREE.Group(),equip1=new THREE.Group(),equip2=new THREE.Group();
scene.add(house);house.add(f1,f2,roof,labels1,labels2,equip1,equip2);

const BW=12.740,BD=9.555,H1=2.600,H2=2.500,SL=.16,W=.11,Y2=H1+SL;

function makeWoodTexture(){
  const c=document.createElement('canvas');c.width=256;c.height=256;
  const x=c.getContext('2d');x.fillStyle='#caa77c';x.fillRect(0,0,256,256);
  for(let i=0;i<16;i++){x.strokeStyle=i%2?'#b58d62':'#dfbd93';x.lineWidth=2;x.beginPath();x.moveTo(i*16,0);x.lineTo(i*16,256);x.stroke()}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,3);return t;
}
function makeWallTexture(){
  const c=document.createElement('canvas');c.width=256;c.height=256;
  const x=c.getContext('2d');x.fillStyle='#f0ece3';x.fillRect(0,0,256,256);
  x.strokeStyle='#d6d0c5';x.lineWidth=1;
  for(let y=0;y<256;y+=18){x.beginPath();x.moveTo(0,y);x.lineTo(256,y);x.stroke()}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t;
}
function makeTileTexture(){
  const c=document.createElement('canvas');c.width=256;c.height=256;
  const x=c.getContext('2d');x.fillStyle='#c7c6c1';x.fillRect(0,0,256,256);x.strokeStyle='#a9a8a3';
  for(let i=0;i<=256;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(256,i);x.stroke()}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t;
}
const wallMat=new THREE.MeshStandardMaterial({map:makeWallTexture(),roughness:.95});
const floorWood=new THREE.MeshStandardMaterial({map:makeWoodTexture(),roughness:.9});
const floorLight=new THREE.MeshStandardMaterial({map:makeWoodTexture(),roughness:.92});
const tileMat=new THREE.MeshStandardMaterial({map:makeTileTexture(),roughness:.95});
const kitchenMat=new THREE.MeshStandardMaterial({color:0x7c746c,roughness:.85});
const whiteMat=new THREE.MeshStandardMaterial({color:0xf7f7f5,roughness:.9});
const bathMat=new THREE.MeshStandardMaterial({color:0xdce8ee,roughness:.7});
const stairMat=new THREE.MeshStandardMaterial({color:0xb18d62,roughness:.9});
const roofMat=new THREE.MeshStandardMaterial({color:0x2b3035,roughness:.9});
const balconyMat=new THREE.MeshStandardMaterial({map:makeTileTexture(),roughness:1});
const doorMat=new THREE.MeshStandardMaterial({color:0x7d5b3f,roughness:.82});
const frameMat=new THREE.MeshStandardMaterial({color:0x4d5357,roughness:.7});
const glassMat=new THREE.MeshStandardMaterial({color:0xaed8e6,transparent:true,opacity:.45,roughness:.1});

function box(g,x,z,w,d,h,y,m){
  const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
  o.position.set(x,y+h/2,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;
}
function wall(g,x,z,len,h,y,alongX=true){box(g,x,z,alongX?len:W,alongX?W:len,h,y,wallMat)}
function label(t,x,y,z,g){
  const c=document.createElement('canvas');c.width=512;c.height=128;const q=c.getContext('2d');
  q.fillStyle='rgba(255,255,255,.90)';q.fillRect(8,20,496,88);
  q.fillStyle='#222';q.font='700 34px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(t,256,64);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));
  s.position.set(x,y,z);s.scale.set(2.5,.63,1);g.add(s);
}
function stairs(g,x,z,w,d,steps,y){for(let i=0;i<steps;i++){const dep=d/steps,h=.18+i*.11;box(g,x,z-d/2+dep*(i+.5),w,dep+.01,h,y,stairMat)}}
function door(g,x,z,w,h,y,rot=0){
  const d=box(g,x,z,w,.08,h,y,doorMat);d.rotation.y=rot;
  const knob=box(g,x+(rot?0:.28),z+(rot?.28:0),.05,.05,.05,y+h*.52,frameMat);return d;
}
function windowUnit(g,x,z,w,h,y,rot=0){
  const f=box(g,x,z,w+.12,.08,h+.12,y-.06,frameMat);f.rotation.y=rot;
  const gl=box(g,x,z,w,.05,h,y,glassMat);gl.rotation.y=rot;
}

// 1F
box(f1,0,0,BW,BD,.12,0,floorWood);
wall(f1,0,-BD/2,BW,H1,0,true);wall(f1,0,BD/2,BW,H1,0,true);wall(f1,-BW/2,0,BD,H1,0,false);wall(f1,BW/2,0,BD,H1,0,false);
wall(f1,-2.72,0,8.85,H1,0,false);wall(f1,-4.53,1.55,3.62,H1,0,true);wall(f1,-4.53,-1.30,3.62,H1,0,true);wall(f1,-4.53,-3.45,3.62,H1,0,true);
wall(f1,-4.95,.25,2.75,H1,0,false);wall(f1,-3.95,.25,2.25,H1,0,false);
wall(f1,2.65,.65,7.25,H1,0,false);wall(f1,4.55,2.15,3.65,H1,0,true);wall(f1,4.55,.55,3.65,H1,0,true);wall(f1,4.55,-1.35,3.65,H1,0,true);wall(f1,4.55,-3.15,3.65,H1,0,true);
wall(f1,1.12,-.2,2.95,H1,0,false);wall(f1,1.90,-1.65,1.55,H1,0,true);wall(f1,1.90,1.35,1.55,H1,0,true);

// inferred internal doors
door(f1,-2.72,2.2,.82,2.05,0,Math.PI/2);
door(f1,-2.72,-2.5,.82,2.05,0,Math.PI/2);
door(f1,-4.95,-1.0,.76,2.0,0,Math.PI/2);
door(f1,2.65,1.55,.82,2.05,0,Math.PI/2);
door(f1,2.65,-.45,.82,2.05,0,Math.PI/2);
door(f1,4.55,.0,.76,2.0,0,Math.PI/2);
door(f1,4.55,-2.2,.76,2.0,0,Math.PI/2);
door(f1,1.90,-.3,.82,2.05,0,0);
door(f1,1.90,2.1,.82,2.05,0,0);

// exterior door/windows
door(f1,4.0,BD/2-.05,1.23,2.33,0,0);
windowUnit(f1,-4.6,-BD/2+.03,1.65,1.15,.8,0);
windowUnit(f1,-.5,-BD/2+.03,2.56,2.0,.3,0);
windowUnit(f1,4.0,-BD/2+.03,1.6,1.1,.8,0);
windowUnit(f1,-BW/2+.03,-2.3,1.65,1.9,.25,Math.PI/2);
windowUnit(f1,-BW/2+.03,2.5,1.6,1.1,.8,Math.PI/2);

label('LDK1 約29.4帖',-.05,1.05,.1,labels1);label('洋室A 6帖',-4.65,1.05,3.0,labels1);label('洋室B 7帖',-4.65,1.05,-2.75,labels1);label('WIC',-5.55,1.05,-.3,labels1);label('納戸',-3.75,1.05,-.15,labels1);label('玄関',4.45,1.05,-3.65,labels1);label('浴室',4.55,1.05,3.15,labels1);label('洗面脱衣',4.55,1.05,1.35,labels1);

box(equip1,.15,2.95,3.3,.72,.88,.12,kitchenMat);box(equip1,-.15,1.65,1.95,.78,.90,.12,kitchenMat);box(equip1,-.4,.35,2.0,1.0,.72,.12,new THREE.MeshStandardMaterial({color:0xa97d54,roughness:.9}));
box(equip1,4.60,3.15,1.62,1.62,.56,.12,bathMat);box(equip1,4.60,3.15,1.30,1.30,.22,.70,whiteMat);box(equip1,3.55,1.35,.70,1.45,.82,.12,whiteMat);box(equip1,4.75,-.55,.75,1.25,.55,.12,whiteMat);stairs(equip1,1.55,-.15,1.15,2.55,13,.12);

// 2F
box(f2,0,0,BW,BD,.12,Y2,floorLight);const y2w=Y2+.12;
wall(f2,0,-BD/2,BW,H2,y2w,true);wall(f2,0,BD/2,BW,H2,y2w,true);wall(f2,-BW/2,0,BD,H2,y2w,false);wall(f2,BW/2,0,BD,H2,y2w,false);
wall(f2,-2.10,.1,8.5,H2,y2w,false);wall(f2,-4.45,1.35,4.65,H2,y2w,true);wall(f2,-4.45,-1.40,4.65,H2,y2w,true);
wall(f2,2.30,.15,8.45,H2,y2w,false);wall(f2,4.35,2.30,3.65,H2,y2w,true);wall(f2,4.35,.25,3.65,H2,y2w,true);wall(f2,4.35,-1.85,3.65,H2,y2w,true);
wall(f2,.80,-.1,3.0,H2,y2w,false);wall(f2,1.55,1.35,1.5,H2,y2w,true);wall(f2,1.55,-1.55,1.5,H2,y2w,true);

door(f2,-2.10,2.15,.82,2.05,y2w,Math.PI/2);
door(f2,-2.10,-2.3,.82,2.05,y2w,Math.PI/2);
door(f2,2.30,1.6,.82,2.05,y2w,Math.PI/2);
door(f2,2.30,-1.2,.82,2.05,y2w,Math.PI/2);
door(f2,4.35,1.2,.76,2.0,y2w,Math.PI/2);
door(f2,4.35,-1.3,.76,2.0,y2w,Math.PI/2);
door(f2,1.55,.1,.82,2.05,y2w,0);

windowUnit(f2,-4.5,-BD/2+.03,1.65,1.15,Y2W=.8+y2w,0);
windowUnit(f2,-.55,-BD/2+.03,2.56,1.75,y2w+.35,0);
windowUnit(f2,4.0,-BD/2+.03,1.65,1.15,y2w+.8,0);

label('LDK2 約21.4帖',-.25,y2w+1.05,.15,labels2);label('洋室C 4.5帖',-4.55,y2w+1.05,2.8,labels2);label('洋室D 6帖',-4.55,y2w+1.05,-2.65,labels2);label('洋室E 7帖',4.35,y2w+1.05,2.75,labels2);label('ランドリー',4.30,y2w+1.05,-2.80,labels2);label('WIC',4.55,y2w+1.05,.9,labels2);
box(equip2,-.15,2.85,3.15,.70,.86,y2w,kitchenMat);box(equip2,4.45,-2.75,2.1,.75,.85,y2w,whiteMat);stairs(equip2,1.25,-.15,1.10,2.45,13,y2w);
box(f2,-4.45,-BD/2-.78,3.8,1.45,.12,Y2+.03,balconyMat);box(f2,3.85,-BD/2-.72,2.85,1.32,.12,Y2+.03,balconyMat);

// roof
const geo=new THREE.BufferGeometry();const verts=new Float32Array([-6.95,0,-5.35,6.95,0,-5.35,0,1.05,0,6.95,0,-5.35,6.95,0,5.35,0,1.05,0,6.95,0,5.35,-6.95,0,5.35,0,1.05,0,-6.95,0,5.35,-6.95,0,-5.35,0,1.05,0]);
geo.setAttribute('position',new THREE.BufferAttribute(verts,3));geo.computeVertexNormals();const r=new THREE.Mesh(geo,roofMat);r.position.y=y2w+H2;r.castShadow=true;roof.add(r);

// UI
let currentFloor='1',roofOn=false,labelsOn=true,equipOn=true,walkMode=false;
function sync(){f1.visible=currentFloor!=='2';f2.visible=currentFloor!=='1';labels1.visible=labelsOn&&currentFloor!=='2';labels2.visible=labelsOn&&currentFloor!=='1';equip1.visible=equipOn&&currentFloor!=='2';equip2.visible=equipOn&&currentFloor!=='1';roof.visible=roofOn&&currentFloor!=='1'}
document.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-floor]').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentFloor=b.dataset.floor;sync()});
function activateView(name){document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===name))}
document.querySelector('[data-view="orbit"]').onclick=()=>{walkMode=false;controls.enabled=true;camera.position.set(14,13,17);controls.target.set(0,1.8,0);controls.update();activateView('orbit')};
document.querySelector('[data-view="top"]').onclick=()=>{walkMode=false;controls.enabled=true;camera.position.set(0,28,.01);controls.target.set(0,0,0);controls.update();activateView('top')};
document.querySelector('[data-view="walk"]').onclick=()=>{walkMode=true;controls.enabled=false;camera.position.set(0,1.62,-1.8);camera.rotation.set(0,Math.PI,0);activateView('walk')};
document.getElementById('roofBtn').onclick=e=>{roofOn=!roofOn;e.currentTarget.textContent='屋根 '+(roofOn?'ON':'OFF');e.currentTarget.classList.toggle('active',roofOn);sync()};
document.getElementById('labelBtn').onclick=e=>{labelsOn=!labelsOn;e.currentTarget.textContent='部屋名 '+(labelsOn?'ON':'OFF');e.currentTarget.classList.toggle('active',labelsOn);sync()};
document.getElementById('equipBtn').onclick=e=>{equipOn=!equipOn;e.currentTarget.textContent='設備 '+(equipOn?'ON':'OFF');e.currentTarget.classList.toggle('active',equipOn);sync()};
let drag=false,lx=0,ly=0,yaw=Math.PI,pitch=0;
renderer.domElement.addEventListener('pointerdown',e=>{if(walkMode){drag=true;lx=e.clientX;ly=e.clientY}});
renderer.domElement.addEventListener('pointermove',e=>{if(!walkMode||!drag)return;yaw-=(e.clientX-lx)*.005;pitch-=(e.clientY-ly)*.004;pitch=Math.max(-1.1,Math.min(1.1,pitch));lx=e.clientX;ly=e.clientY;camera.rotation.set(pitch,yaw,0,'YXZ')});
renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointercancel',()=>drag=false);
sync();(function animate(){requestAnimationFrame(animate);if(!walkMode)controls.update();renderer.render(scene,camera)})();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
