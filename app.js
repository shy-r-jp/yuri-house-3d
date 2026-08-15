import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x8ec5ee);
scene.fog=new THREE.Fog(0x8ec5ee,35,80);

const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.05,120);
camera.position.set(15,10,17);

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
document.getElementById('app').appendChild(renderer.domElement);

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.target.set(0,2.5,0);
controls.maxPolarAngle=Math.PI*.49;
controls.minDistance=4;
controls.maxDistance=40;

scene.add(new THREE.HemisphereLight(0xffffff,0x6e786b,2.2));
const sun=new THREE.DirectionalLight(0xfff2d7,3.1);
sun.position.set(-12,18,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);

const mat=(c,r=.8,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const wallTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');x.fillStyle='#eee9df';x.fillRect(0,0,256,256);x.strokeStyle='#d7d0c4';x.lineWidth=2;for(let y=0;y<256;y+=22){x.beginPath();x.moveTo(0,y);x.lineTo(256,y);x.stroke()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t})();
const woodTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');x.fillStyle='#c9a77d';x.fillRect(0,0,256,256);for(let i=0;i<14;i++){x.strokeStyle=i%2?'#a67f56':'#d9bc94';x.lineWidth=2;x.beginPath();x.moveTo(i*19,0);x.lineTo(i*19,256);x.stroke()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,4);return t})();
const tileTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');x.fillStyle='#c8c5bd';x.fillRect(0,0,256,256);x.strokeStyle='#aaa69d';for(let i=0;i<256;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(256,i);x.stroke()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t})();

const M={
 wall:new THREE.MeshStandardMaterial({map:wallTex,roughness:.95}),
 floor:new THREE.MeshStandardMaterial({map:woodTex,roughness:.88}),
 tile:new THREE.MeshStandardMaterial({map:tileTex,roughness:.95}),
 trim:mat(0xe8e3d9),dark:mat(0x4c3a2e),black:mat(0x24282b,.45,.15),
 glass:new THREE.MeshPhysicalMaterial({color:0xaed8ea,transparent:true,opacity:.35,roughness:.08,transmission:.15}),
 kitchen:mat(0xded8cf),top:mat(0x7a7b78,.35),roof:mat(0x343638,.88),
 solar:mat(0x1f3a4b,.25,.25),green:mat(0x78946a)
};

const house=new THREE.Group(),f1=new THREE.Group(),f2=new THREE.Group(),roof=new THREE.Group(),equip=new THREE.Group(),labels=new THREE.Group();
house.add(f1,f2,roof,equip,labels);scene.add(house);
const wallMeshes=[];

function box(g,x,z,w,d,h,y,m=M.wall){const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y+h/2,z);q.castShadow=q.receiveShadow=true;g.add(q);return q}
function wall(g,x,z,w,d,h,y=0){const q=box(g,x,z,w,d,h,y,M.wall);wallMeshes.push(q);return q}
function floor(g,x,z,w,d,y,m=M.floor){return box(g,x,z,w,d,.08,y,m)}
function label(txt,x,z,y){const c=document.createElement('canvas');c.width=420;c.height=90;const cx=c.getContext('2d');cx.fillStyle='#ffffffdd';cx.roundRect(4,4,412,82,15);cx.fill();cx.fillStyle='#222';cx.font='bold 29px sans-serif';cx.textAlign='center';cx.fillText(txt,210,56);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(3.2,.68,1);s.position.set(x,y,z);labels.add(s)}
function door(g,x,z,w,h,y,rot=0,color=0x79563d){const m=mat(color,.75);const d=box(g,x,z,w,.12,h,y,m);d.rotation.y=rot;box(g,x+(rot?0:.28),z+(rot?.28:0),.05,.05,.05,y+h*.55,M.black);return d}
function windowUnit(g,x,z,w,h,y,rot=0){const frame=box(g,x,z,w+.14,.12,h+.14,y-.07,M.black);frame.rotation.y=rot;const gl=box(g,x,z,w,.07,h,y,M.glass);gl.rotation.y=rot}
function table(g,x,z,w,d,y){box(g,x,z,w,d,.08,y,M.dark);for(const dx of[-w*.4,w*.4])for(const dz of[-d*.35,d*.35])box(g,x+dx,z+dz,.07,.07,.68,y-.68,M.dark)}
function bed(g,x,z,w,d,y){box(g,x,z,w,d,.32,y,M.trim);box(g,x,z-d*.38,w*.9,d*.18,.14,y+.32,M.wall)}
function shelf(g,x,z,w,d,h,y){box(g,x,z,w,d,h,y,M.dark)}
function stairs(g,x,z,y){for(let i=0;i<15;i++)box(g,x+i*.1,z-i*.13,1.05,.22,.12,y+i*.17,M.floor)}

// site
box(scene,0,0,34,32,.18,-.18,mat(0x9aae8a));
box(scene,0,8.4,7,8,.035,0,M.tile);
for(let i=0;i<24;i++)box(scene,-13+i*1.15,-11+(i%4)*.42,.48,.48,.35,0,M.green);

// 1F
const W=12.74,D=9.555,H1=2.6,H2=2.5,Y2=3.2;
floor(f1,0,0,W,D,0);
wall(f1,0,-D/2,W,.15,H1);wall(f1,-W/2,0,.15,D,H1);wall(f1,W/2,0,.15,D,H1);
wall(f1,-4.9,D/2,2.7,.15,H1);wall(f1,4.75,D/2,3.05,.15,H1);
windowUnit(f1,-2.15,D/2+.01,2.56,2.18,.2);windowUnit(f1,1.35,D/2+.01,1.65,1.95,.22);door(f1,4.15,D/2+.01,1.235,2.33,0);
wall(f1,-3.65,-1.5,.13,6.3,H1);wall(f1,-5.0,.15,2.8,.13,H1);wall(f1,-1.55,-2.85,4.2,.13,H1);
wall(f1,2.55,-1.95,.13,5.6,H1);wall(f1,4.45,-1.0,.13,6.9,H1);wall(f1,3.5,1.1,2.0,.13,H1);wall(f1,5.35,1.05,1.8,.13,H1);

// inferred internal doors at circulation openings
door(f1,-3.65,1.55,.82,2.05,0,Math.PI/2,0x8b6546);door(f1,-3.65,-2.0,.82,2.05,0,Math.PI/2,0x8b6546);
door(f1,-4.95,-1.25,.76,2.0,0,Math.PI/2,0x8b6546);door(f1,-2.0,-2.85,.82,2.05,0,0,0x8b6546);
door(f1,2.55,-.65,.82,2.05,0,Math.PI/2,0x8b6546);door(f1,2.55,1.9,.82,2.05,0,Math.PI/2,0x8b6546);
door(f1,4.45,-2.2,.76,2.0,0,Math.PI/2,0x8b6546);door(f1,4.45,.1,.76,2.0,0,Math.PI/2,0x8b6546);
door(f1,3.55,1.1,.76,2.0,0,0,0x8b6546);door(f1,5.3,2.0,.76,2.0,0,0,0x8b6546);

windowUnit(f1,-4.8,-D/2-.01,1.6,1.1,1.0);windowUnit(f1,-.6,-D/2-.01,1.6,.9,1.25);windowUnit(f1,4.7,-D/2-.01,.6,.9,1.3);
windowUnit(f1,-W/2-.01,-2.8,1.65,2.0,.2,Math.PI/2);windowUnit(f1,-W/2-.01,2.6,1.6,1.1,.8,Math.PI/2);

box(equip,.45,-2.55,3.0,.72,.88,0,M.kitchen);box(equip,.45,-2.55,3.05,.77,.05,.88,M.top);
box(equip,-.5,-4.2,2.565,.5,2.05,0,M.kitchen);box(equip,3.55,-3.4,1.62,1.65,.55,0,M.trim);
box(equip,3.4,-1.25,1.2,.55,.82,0,M.kitchen);box(equip,5.35,.25,.65,.42,.45,0,M.trim);
table(equip,-.25,1.2,2,.95,.76);shelf(equip,-1.1,3.9,2.3,.45,.5,0);
bed(equip,-5,-3.0,1.4,2,.1);bed(equip,-5,2.7,1.5,2.05,.1);stairs(equip,1.25,1.45,.02);
label('LDK1 29.4帖',-.3,.5,2.85);label('洋室A 6帖',-5,-3.1,2.85);label('洋室B 7帖',-5,2.8,2.85);label('浴室',3.55,-3.45,2.85);label('玄関',4.15,3.65,2.85);

// 2F
floor(f2,0,-.2,W,8.645,Y2);
wall(f2,0,-4.52,W,.15,H2,Y2);wall(f2,-W/2,-.2,.15,8.65,H2,Y2);wall(f2,W/2,-.2,.15,8.65,H2,Y2);
wall(f2,-4.8,4.1,3.0,.15,H2,Y2);wall(f2,4.7,4.1,3.4,.15,H2,Y2);
wall(f2,-3.7,-.8,.13,7.3,H2,Y2);wall(f2,2.8,-.7,.13,7.4,H2,Y2);wall(f2,4.55,-.2,.13,7.7,H2,Y2);
wall(f2,-1.3,-2.6,4.8,.13,H2,Y2);wall(f2,-1.3,2.35,4.8,.13,H2,Y2);wall(f2,3.7,1.6,1.7,.13,H2,Y2);

// inferred 2F doors
door(f2,-3.7,1.55,.82,2.05,Y2,Math.PI/2,0x8b6546);door(f2,-3.7,-2.1,.82,2.05,Y2,Math.PI/2,0x8b6546);
door(f2,2.8,-2.2,.82,2.05,Y2,Math.PI/2,0x8b6546);door(f2,2.8,.4,.82,2.05,Y2,Math.PI/2,0x8b6546);
door(f2,4.55,-1.5,.76,2.0,Y2,Math.PI/2,0x8b6546);door(f2,4.55,1.2,.76,2.0,Y2,Math.PI/2,0x8b6546);
door(f2,3.75,1.6,.76,2.0,Y2,0,0x8b6546);

floor(f2,-2.0,4.65,5.2,1.05,Y2-.03,M.tile);
for(const x of[-4.5,-3.5,-2.5,-1.5,-.5])box(f2,x,5.1,.04,.04,1.1,Y2,M.black);box(f2,-2.5,5.1,5,.05,.06,Y2+1.02,M.black);
windowUnit(f2,-2,4.12,2.56,2.0,Y2+.3);windowUnit(f2,1.3,4.12,1.65,1.1,Y2+.7);windowUnit(f2,4.9,4.12,.6,.9,Y2+.8);
windowUnit(f2,-4.9,-4.53,1.65,1.1,Y2+.7);windowUnit(f2,.2,-4.53,1.5,.9,Y2+.9);
bed(equip,-5,-2.8,1.4,2,Y2+.1);bed(equip,-5,2.4,1.4,2,Y2+.1);bed(equip,5,-2.8,1.5,2.05,Y2+.1);
box(equip,3.6,2.9,2.1,.5,.9,Y2,M.kitchen);
label('LDK2 21.4帖',-.3,0,5.95);label('洋室C 4.5帖',-5,-.6,5.95);label('洋室D 6帖',-5,2.6,5.95);label('洋室E 7帖',5,-2.7,5.95);label('ランドリー',4,2.8,5.95);

// roof + panels
function roofPlane(x,z,w,d,y,rx,rz){const q=box(roof,x,z,w,d,.12,y,M.roof);q.rotation.x=rx;q.rotation.z=rz;return q}
roofPlane(0,-.2,13.5,5.4,6.55,-.36,0);roofPlane(0,-.2,13.5,5.4,6.55,.36,0);
roofPlane(-5.2,-.2,3.4,8.8,6.45,0,.36);roofPlane(5.2,-.2,3.4,8.8,6.45,0,-.36);box(roof,0,-.2,4.5,.18,.16,7.47,M.roof);
roofPlane(3.8,3.8,4.4,2.1,3.0,-.28,0);roofPlane(-3.0,4.4,6.3,1.7,3.0,-.18,0);
for(let r=0;r<2;r++)for(let c=0;c<6;c++){const p=box(roof,-2.8+c*1.05,-1.2+r*.75,.92,.62,.035,7.08-r*.25,M.solar);p.rotation.x=-.36}
box(house,0,0,W+.5,D+.5,.35,-.35,mat(0xaaa9a2));

// mini plans
function drawPlan(el,rooms){
  const node=document.getElementById(el);
  for(const r of rooms){const d=document.createElement('div');d.style.cssText=`position:absolute;left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%;border:2px solid #333;background:${r.c||'#d8b98e'};font-size:9px;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700`;d.textContent=r.t;node.appendChild(d)}
}
drawPlan('miniF1',[{x:2,y:2,w:28,h:36,t:'洋室A\\n6帖'},{x:2,y:40,w:28,h:55,t:'洋室B\\n7帖'},{x:31,y:2,w:47,h:93,t:'LDK1\\n29.4帖'},{x:79,y:2,w:19,h:28,t:'浴室'},{x:79,y:31,w:19,h:26,t:'洗面'},{x:79,y:58,w:19,h:39,t:'玄関'}]);
drawPlan('miniF2',[{x:2,y:2,w:28,h:32,t:'洋室C\\n4.5帖'},{x:2,y:36,w:28,h:60,t:'洋室D\\n6帖'},{x:31,y:2,w:47,h:94,t:'LDK2\\n21.4帖'},{x:79,y:2,w:19,h:42,t:'洋室E\\n7帖'},{x:79,y:46,w:19,h:22,t:'WIC'},{x:79,y:70,w:19,h:27,t:'書斎'}]);

const chip1=['玄関ホール','LDK1','キッチン','洗面脱衣室','浴室','トイレ','階段下収納','納戸','洋室A（6帖）','洋室B（7帖）'];
const chip2=['LDK2','洋室C（4.5帖）','洋室D（6帖）','洋室E（7帖）','ランドリールーム','トイレ（2階）','書斎','バルコニー'];
for(const [id,arr] of [['chips1',chip1],['chips2',chip2]]){const root=document.getElementById(id);arr.forEach(t=>{const d=document.createElement('div');d.className='chip';d.innerHTML=`<span>${t}</span>`;root.appendChild(d)})}

function setView(mode){
 document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
 f1.visible=f2.visible=true;roof.visible=true;labels.visible=document.getElementById('labelToggle').checked;
 if(mode==='outside'){camera.position.set(15,10,17);controls.target.set(0,2.5,0)}
 if(mode==='f1'){f2.visible=false;roof.visible=false;camera.position.set(10,15,12);controls.target.set(0,.6,0)}
 if(mode==='f2'){f1.visible=false;roof.visible=false;camera.position.set(10,15,12);controls.target.set(0,4,0)}
 controls.update();
}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setView(b.dataset.mode));
document.querySelectorAll('[data-side]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-side]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const v=b.dataset.side;if(v==='south')camera.position.set(0,7,20);if(v==='north')camera.position.set(0,7,-20);if(v==='east')camera.position.set(20,7,0);if(v==='west')camera.position.set(-20,7,0);controls.target.set(0,2.7,0);controls.update()});
document.getElementById('equipToggle').onchange=e=>equip.visible=e.target.checked;
document.getElementById('labelToggle').onchange=e=>labels.visible=e.target.checked;
document.getElementById('cutToggle').onchange=e=>{const cut=e.target.checked;wallMeshes.forEach((w,i)=>w.visible=!cut || i%3!==0)};

addEventListener('resize',()=>{const r=document.getElementById('app').getBoundingClientRect();camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height)});
function size(){const r=document.getElementById('app').getBoundingClientRect();camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height)}size();
(function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)})();
