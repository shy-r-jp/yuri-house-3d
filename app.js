import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xe9eef4);

const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.05,150);
camera.position.set(14,13,18);

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
document.getElementById('app').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff,0x7d8790,1.85));
const sun=new THREE.DirectionalLight(0xffffff,2.4);
sun.position.set(12,24,14);sun.castShadow=true;scene.add(sun);

const ground=new THREE.Mesh(
  new THREE.PlaneGeometry(46,46),
  new THREE.MeshStandardMaterial({color:0xcfd6db,roughness:1})
);
ground.rotation.x=-Math.PI/2;ground.position.y=-.04;ground.receiveShadow=true;scene.add(ground);

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.target.set(0,1.8,0);
controls.minDistance=4;
controls.maxDistance=44;
controls.maxPolarAngle=Math.PI*.49;

const house=new THREE.Group();
const f1=new THREE.Group(),f2=new THREE.Group(),roof=new THREE.Group();
const labels1=new THREE.Group(),labels2=new THREE.Group();
const equip1=new THREE.Group(),equip2=new THREE.Group();
scene.add(house);house.add(f1,f2,roof,labels1,labels2,equip1,equip2);

// 2026/06/26 図面ベース主要値
const BW=12.740;
const BD=9.555;
const H1=2.600;
const H2=2.500;
const SLAB=.16;
const WALL=.11;
const Y2=H1+SLAB;

// materials
const matWall=new THREE.MeshStandardMaterial({color:0xf4efe5,roughness:.94});
const matWood=new THREE.MeshStandardMaterial({color:0xcaa977,roughness:.95});
const matWood2=new THREE.MeshStandardMaterial({color:0xd9c7a6,roughness:.95});
const matDark=new THREE.MeshStandardMaterial({color:0x57514b,roughness:.9});
const matWhite=new THREE.MeshStandardMaterial({color:0xf7f7f5,roughness:.9});
const matBath=new THREE.MeshStandardMaterial({color:0xdde9ee,roughness:.72});
const matStair=new THREE.MeshStandardMaterial({color:0xb18d62,roughness:.9});
const matBalcony=new THREE.MeshStandardMaterial({color:0xbfc2c4,roughness:1});
const matRoof=new THREE.MeshStandardMaterial({color:0x2b3035,roughness:.9});
const matGlass=new THREE.MeshStandardMaterial({color:0xaad2e3,transparent:true,opacity:.48,roughness:.1});

function box(g,x,z,w,d,h,y,m){
  const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
  o.position.set(x,y+h/2,z);
  o.castShadow=o.receiveShadow=true;
  g.add(o);return o;
}
function wall(g,x,z,len,h,y,alongX=true){
  return box(g,x,z,alongX?len:WALL,alongX?WALL:len,h,y,matWall);
}
function label(text,x,y,z,g){
  const c=document.createElement('canvas');c.width=512;c.height=128;
  const q=c.getContext('2d');
  q.fillStyle='rgba(255,255,255,.90)';q.fillRect(8,20,496,88);
  q.fillStyle='#222';q.font='700 34px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(text,256,64);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));
  s.position.set(x,y,z);s.scale.set(2.5,.63,1);g.add(s);
}
function stairs(g,x,z,w,d,steps,y){
  for(let i=0;i<steps;i++){
    const dep=d/steps,h=.16+i*.11;
    box(g,x,z-d/2+dep*(i+.5),w,dep+.01,h,y,matStair);
  }
}
function windowPane(g,x,z,w,h,sill,y,side='south'){
  const depth=.045;
  const o=new THREE.Mesh(
    new THREE.BoxGeometry(
      (side==='south'||side==='north')?w:depth,
      h,
      (side==='south'||side==='north')?depth:w
    ),matGlass
  );
  o.position.set(x,y+sill+h/2,z);g.add(o);
}

// ---------- 1F ----------
box(f1,0,0,BW,BD,.12,0,matWood);

// 外周
wall(f1,0,-BD/2,BW,H1,0,true);
wall(f1,0, BD/2,BW,H1,0,true);
wall(f1,-BW/2,0,BD,H1,0,false);
wall(f1, BW/2,0,BD,H1,0,false);

// 左側：洋室A / WIC / 納戸 / 洋室B
wall(f1,-2.72,0.0,8.85,H1,0,false);
wall(f1,-4.53,1.60,3.62,H1,0,true);
wall(f1,-4.53,-1.18,3.62,H1,0,true);
wall(f1,-4.53,-3.40,3.62,H1,0,true);
wall(f1,-5.20,.15,2.75,H1,0,false);
wall(f1,-4.05,.15,2.15,H1,0,false);

// 中央：LDK / 納戸 / 階段
wall(f1,-1.65,-.15,2.45,H1,0,true);
wall(f1,.95,-.10,3.15,H1,0,false);
wall(f1,1.75,-1.65,1.60,H1,0,true);
wall(f1,1.75,1.35,1.60,H1,0,true);

// 右側：浴室 / 洗面 / トイレ / 玄関 / SC
wall(f1,2.70,.60,7.40,H1,0,false);
wall(f1,4.55,2.25,3.60,H1,0,true);
wall(f1,4.55,.60,3.60,H1,0,true);
wall(f1,4.55,-.95,3.60,H1,0,true);
wall(f1,4.55,-2.25,3.60,H1,0,true);
wall(f1,4.55,-3.55,3.60,H1,0,true);

// ラベル
label('LDK1 29.4帖',-.10,1.02,.35,labels1);
label('洋室A 6帖',-4.65,1.02,3.0,labels1);
label('洋室B 7帖',-4.65,1.02,-2.85,labels1);
label('WIC',-5.45,1.02,.05,labels1);
label('納戸',-3.65,1.02,-.15,labels1);
label('浴室',4.55,1.02,3.10,labels1);
label('洗面脱衣',4.55,1.02,1.45,labels1);
label('玄関',4.20,1.02,-3.55,labels1);
label('トイレ',4.70,1.02,-.20,labels1);

// 設備
// ペニンシュラキッチン＋カップボード
box(equip1,.15,2.75,2.75,.82,.88,.12,matDark);
box(equip1,-.15,3.65,2.565,.55,2.05,.12,matWhite);
box(equip1,-2.10,3.55,.75,.75,2.10,.12,matWhite);
// 多目的カウンター
box(equip1,-1.25,1.20,1.65,.45,.74,.12,new THREE.MeshStandardMaterial({color:0xa98561,roughness:.9}));
// 浴室
box(equip1,4.62,3.12,1.62,1.62,.56,.12,matBath);
box(equip1,4.62,3.12,1.25,1.25,.20,.70,matWhite);
// 洗面
box(equip1,3.55,1.50,.72,1.45,.85,.12,matWhite);
// トイレ2台
box(equip1,4.75,-.20,.72,1.15,.52,.12,matWhite);
box(equip1,3.55,-1.55,.72,1.15,.52,.12,matWhite);
// 玄関収納
box(equip1,5.45,-3.55,.62,1.20,2.00,.12,matDark);
// 階段
stairs(equip1,1.45,-.10,1.15,2.65,15,.12);

// 窓（代表位置）
windowPane(f1,-4.65,-BD/2-.025,1.65,1.15,.80,0,'south');
windowPane(f1,-.30,-BD/2-.025,2.56,2.05,.25,0,'south');
windowPane(f1,4.05,-BD/2-.025,1.60,1.10,.90,0,'south');
windowPane(f1,-BW/2-.025,2.55,1.60,1.10,.80,0,'west');
windowPane(f1,-BW/2-.025,-2.65,1.65,1.75,.35,0,'west');

// ---------- 2F ----------
box(f2,0,0,BW,BD,.12,Y2,matWood2);
const Y2W=Y2+.12;

wall(f2,0,-BD/2,BW,H2,Y2W,true);
wall(f2,0, BD/2,BW,H2,Y2W,true);
wall(f2,-BW/2,0,BD,H2,Y2W,false);
wall(f2, BW/2,0,BD,H2,Y2W,false);

// 左：洋室C / 洋室D / 収納
wall(f2,-2.10,.10,8.50,H2,Y2W,false);
wall(f2,-4.45,1.35,4.65,H2,Y2W,true);
wall(f2,-4.45,-1.40,4.65,H2,Y2W,true);

// 中央：LDK2 / 階段
wall(f2,.80,-.10,3.00,H2,Y2W,false);
wall(f2,1.55,1.35,1.50,H2,Y2W,true);
wall(f2,1.55,-1.55,1.50,H2,Y2W,true);

// 右：洋室E / WIC / 書斎 / ホール / ランドリー
wall(f2,2.30,.15,8.45,H2,Y2W,false);
wall(f2,4.35,2.30,3.65,H2,Y2W,true);
wall(f2,4.35,.35,3.65,H2,Y2W,true);
wall(f2,4.35,-1.35,3.65,H2,Y2W,true);
wall(f2,4.35,-2.90,3.65,H2,Y2W,true);

// ラベル
label('LDK2 21.4帖',-.20,Y2W+1.02,.20,labels2);
label('洋室C 4.5帖',-4.55,Y2W+1.02,2.75,labels2);
label('洋室D 6帖',-4.55,Y2W+1.02,-2.70,labels2);
label('洋室E 7帖',4.35,Y2W+1.02,2.75,labels2);
label('WIC',4.55,Y2W+1.02,.80,labels2);
label('書斎',4.55,Y2W+1.02,1.65,labels2);
label('ランドリー',4.30,Y2W+1.02,-2.65,labels2);

// 2F設備
box(equip2,-.15,2.80,2.80,.72,.86,Y2W,matDark);
box(equip2,-.15,3.60,2.565,.55,2.00,Y2W,matWhite);
box(equip2,4.35,-2.70,2.05,.75,.84,Y2W,matWhite);
stairs(equip2,1.20,-.15,1.10,2.50,15,Y2W);

// バルコニー
box(f2,-4.45,-BD/2-.76,3.80,1.42,.12,Y2+.03,matBalcony);
box(f2,3.90,-BD/2-.70,2.80,1.30,.12,Y2+.03,matBalcony);

// 代表窓
windowPane(f2,-4.50,-BD/2-.025,1.65,1.15,.80,Y2W,'south');
windowPane(f2,-.35,-BD/2-.025,2.56,1.80,.35,Y2W,'south');
windowPane(f2,4.15,-BD/2-.025,1.65,1.15,.80,Y2W,'south');

// ---------- 屋根 ----------
// 立面図の寄棟形状を簡略再現。最高高さ 8.637m を目安に設定
const roofBase=Y2W+H2+.80;
const roofTop=8.637;
const roofH=Math.max(.8,roofTop-roofBase);
const geo=new THREE.BufferGeometry();
const v=new Float32Array([
 -6.95,0,-5.35, 6.95,0,-5.35, 0,roofH,0,
  6.95,0,-5.35, 6.95,0, 5.35, 0,roofH,0,
  6.95,0, 5.35,-6.95,0, 5.35, 0,roofH,0,
 -6.95,0, 5.35,-6.95,0,-5.35, 0,roofH,0
]);
geo.setAttribute('position',new THREE.BufferAttribute(v,3));
geo.computeVertexNormals();
const roofMesh=new THREE.Mesh(geo,matRoof);
roofMesh.position.y=roofBase;
roofMesh.castShadow=true;
roof.add(roofMesh);

// 下屋の雰囲気
box(roof,4.55,3.95,3.75,2.10,.12,H1+.55,matRoof);
box(roof,-4.35,-4.55,4.10,1.55,.12,H1+.25,matRoof);

// UI
let currentFloor='1',roofOn=false,labelsOn=true,equipOn=true,walkMode=false;

function sync(){
  f1.visible=currentFloor!=='2';
  f2.visible=currentFloor!=='1';
  labels1.visible=labelsOn&&currentFloor!=='2';
  labels2.visible=labelsOn&&currentFloor!=='1';
  equip1.visible=equipOn&&currentFloor!=='2';
  equip2.visible=equipOn&&currentFloor!=='1';
  roof.visible=roofOn&&currentFloor!=='1';
}

document.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-floor]').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  currentFloor=b.dataset.floor;
  sync();
});

function activateView(name){
  document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===name));
}
document.querySelector('[data-view="orbit"]').onclick=()=>{
  walkMode=false;controls.enabled=true;
  camera.position.set(14,13,18);controls.target.set(0,1.8,0);controls.update();activateView('orbit');
};
document.querySelector('[data-view="top"]').onclick=()=>{
  walkMode=false;controls.enabled=true;
  camera.position.set(0,28,.01);controls.target.set(0,0,0);controls.update();activateView('top');
};
document.querySelector('[data-view="walk"]').onclick=()=>{
  walkMode=true;controls.enabled=false;
  camera.position.set(-.2,1.62,-1.5);camera.rotation.set(0,Math.PI,0);activateView('walk');
};

document.getElementById('roofBtn').onclick=e=>{
  roofOn=!roofOn;e.currentTarget.textContent='屋根 '+(roofOn?'ON':'OFF');e.currentTarget.classList.toggle('active',roofOn);sync()
};
document.getElementById('labelBtn').onclick=e=>{
  labelsOn=!labelsOn;e.currentTarget.textContent='部屋名 '+(labelsOn?'ON':'OFF');e.currentTarget.classList.toggle('active',labelsOn);sync()
};
document.getElementById('equipBtn').onclick=e=>{
  equipOn=!equipOn;e.currentTarget.textContent='設備 '+(equipOn?'ON':'OFF');e.currentTarget.classList.toggle('active',equipOn);sync()
};

let drag=false,lx=0,ly=0,yaw=Math.PI,pitch=0;
renderer.domElement.addEventListener('pointerdown',e=>{if(walkMode){drag=true;lx=e.clientX;ly=e.clientY}});
renderer.domElement.addEventListener('pointermove',e=>{
  if(!walkMode||!drag)return;
  yaw-=(e.clientX-lx)*.005;
  pitch-=(e.clientY-ly)*.004;
  pitch=Math.max(-1.1,Math.min(1.1,pitch));
  lx=e.clientX;ly=e.clientY;
  camera.rotation.set(pitch,yaw,0,'YXZ');
});
renderer.domElement.addEventListener('pointerup',()=>drag=false);
renderer.domElement.addEventListener('pointercancel',()=>drag=false);

sync();
(function animate(){
  requestAnimationFrame(animate);
  if(!walkMode)controls.update();
  renderer.render(scene,camera);
})();
addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
