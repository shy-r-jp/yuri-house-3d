import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/controls/OrbitControls.js';

const scene=new THREE.Scene(); scene.background=new THREE.Color(0xdce8ef);
scene.fog=new THREE.Fog(0xdce8ef,32,70);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.05,120);
camera.position.set(16,13,18);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; document.body.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.target.set(0,2.2,0); controls.maxPolarAngle=Math.PI*.49;

scene.add(new THREE.HemisphereLight(0xeaf5ff,0x777066,2.2));
const sun=new THREE.DirectionalLight(0xfff2d5,3.2);sun.position.set(-12,18,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);

const mat=(c,rough=.8,metal=0)=>new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:metal});
const M={wall:mat(0xf3f0e9), trim:mat(0xddd9d0), wood:mat(0xb9976d), darkwood:mat(0x65513f),
 tile:mat(0xb7b7af), roof:mat(0x4c4b47,.95), black:mat(0x24282a,.5,.15), glass:new THREE.MeshPhysicalMaterial({color:0xa9d5e5,transparent:true,opacity:.42,roughness:.08,metalness:.05}), kitchen:mat(0xe9e5dc), top:mat(0x8b8b86,.35), green:mat(0x78936c), solar:mat(0x1e3543,.25,.25)};
const house=new THREE.Group(), f1=new THREE.Group(), f2=new THREE.Group(), roofs=new THREE.Group(), labels=new THREE.Group();house.add(f1,f2,roofs,labels);scene.add(house);
const wallMeshes=[];

function box(g,x,z,w,d,h,y,m=M.wall){let q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y+h/2,z);q.castShadow=q.receiveShadow=true;g.add(q);return q}
function wall(g,x,z,w,d,h,y=0){let q=box(g,x,z,w,d,h,y,M.wall);wallMeshes.push(q);return q}
function floor(g,x,z,w,d,y,m=M.wood){return box(g,x,z,w,d,.08,y,m)}
function label(txt,x,z,y){const c=document.createElement('canvas'),ctx=c.getContext('2d');c.width=420;c.height=90;ctx.fillStyle='#ffffffdd';ctx.roundRect(4,4,412,82,15);ctx.fill();ctx.fillStyle='#202326';ctx.font='bold 30px sans-serif';ctx.textAlign='center';ctx.fillText(txt,210,56);let t=new THREE.CanvasTexture(c),s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false}));s.scale.set(3.3,.7,1);s.position.set(x,y,z);labels.add(s)}
function windowUnit(g,x,z,w,h,y,rot=0){let frame=box(g,x,z,w+.12,.12,h+.12,y-.06,M.black);frame.rotation.y=rot;let gl=box(g,x,z,w,.08,h,y,M.glass);gl.rotation.y=rot;return gl}
function door(g,x,z,w,h,y,rot=0){let d=box(g,x,z,w,.11,h,y,M.darkwood);d.rotation.y=rot;return d}
function table(g,x,z,w,d,y){box(g,x,z,w,d,.08,y,M.darkwood);for(const dx of [-w*.42,w*.42])for(const dz of [-d*.38,d*.38])box(g,x+dx,z+dz,.07,.07,.7,y-.7,M.darkwood)}
function bed(g,x,z,w,d,y){box(g,x,z,w,d,.35,y,M.trim);box(g,x,z-d*.38,w*.9,d*.18,.15,y+.35,M.wall)}
function cabinet(g,x,z,w,d,h,y,m=M.kitchen){return box(g,x,z,w,d,h,y,m)}

// ground / approach
box(scene,0,0,36,34,.18,-.18,mat(0x9cae8d));box(scene,0,8.4,7,8,.03,0,mat(0xc7c5bc));
for(let i=0;i<18;i++) box(scene,-12+i*1.4,-11+(i%3)*.5,.7,.7,.35,0,M.green);

// Dimensions are modeled in metres from the 1:100 plan; detailed wall positions are a visual trace, not construction CAD.
const W=12.74,D=9.555,H1=2.60,H2=2.50,Y2=3.20;
floor(f1,0,0,W,D,0,M.wood);
// exterior 1F walls with openings visually represented
wall(f1,0,-D/2,W,.16,H1); wall(f1,-W/2,0,.16,D,H1); wall(f1,W/2,0,.16,D,H1);
wall(f1,-4.9,D/2,2.9,.16,H1); wall(f1,4.7,D/2,3.3,.16,H1);
// south large openings / entrance
windowUnit(f1,-2.2,D/2+.01,2.56,2.2,.2); windowUnit(f1,1.3,D/2+.01,1.65,2.0,.2);door(f1,4.15,D/2+.01,1.24,2.33,0,0);
// internal walls approximating plan zoning
wall(f1,-3.65,-1.6,.13,6.2,H1); wall(f1,-5.0,.15,2.7,.13,H1);
wall(f1,-1.5,-2.9,4.3,.13,H1); wall(f1,2.65,-2.0,.13,5.5,H1); wall(f1,4.5,-1.0,.13,6.8,H1);
wall(f1,3.55,1.2,2.0,.13,H1); wall(f1,5.35,1.1,1.8,.13,H1);
// windows north/east/west
windowUnit(f1,-4.8,-D/2-.01,1.6,1.1,1.0);windowUnit(f1,-.6,-D/2-.01,1.6,.9,1.25);windowUnit(f1,4.7,-D/2-.01,.6,.9,1.3);
windowUnit(f1,-W/2-.01,-2.8,1.65,2.0,.2,Math.PI/2);windowUnit(f1,-W/2-.01,2.6,1.6,1.1,.8,Math.PI/2);

// 1F fixtures: peninsula kitchen, cupboard, bath, wash, toilets, storage
cabinet(f1,.5,-2.55,3.0,.72,.88,0,M.kitchen);box(f1,.5,-2.55,3.05,.77,.05,.88,M.top);
cabinet(f1,-.6,-4.25,2.565,.48,2.05,0,M.kitchen);
cabinet(f1,3.5,-3.4,1.62,1.65,.55,0,M.wall); // unit bath base
cabinet(f1,3.4,-1.3,1.25,.55,.82,0,M.wall); // vanity
cabinet(f1,5.35,.3,.65,.42,.45,0,M.wall); // toilet
table(f1,-.2,1.25,2.0,.95,.76); // dining
box(f1,-1.1,3.9,2.3,.5,.55,0,M.darkwood); // TV board
bed(f1,-5.0,-3.1,1.4,2.0,.1); bed(f1,-5.0,2.7,1.5,2.05,.1);
label('LDK1 29.4帖',-.3,.5,2.85);label('洋室A 6帖',-5,-3.2,2.85);label('洋室B 7帖',-5,2.8,2.85);label('浴室',3.6,-3.5,2.85);label('玄関',4.1,3.7,2.85);

// stairs
for(let i=0;i<15;i++) box(f1,2.0+i*.11,1.4-i*.13,1.05,.22,.12,i*.17,M.wood);

// 2F floor and plan
floor(f2,0,-.2,W,8.645,Y2,M.wood);
wall(f2,0,-4.52,W,.16,H2,Y2);wall(f2,-W/2,-.2,.16,8.65,H2,Y2);wall(f2,W/2,-.2,.16,8.65,H2,Y2);
wall(f2,-4.8,4.1,3.0,.16,H2,Y2);wall(f2,4.7,4.1,3.4,.16,H2,Y2);
wall(f2,-3.7,-.8,.13,7.3,H2,Y2);wall(f2,2.8,-.7,.13,7.4,H2,Y2);wall(f2,4.55,-.2,.13,7.7,H2,Y2);
wall(f2,-1.3,-2.6,4.8,.13,H2,Y2);wall(f2,-1.3,2.35,4.8,.13,H2,Y2);wall(f2,3.7,1.6,1.7,.13,H2,Y2);
// balcony
floor(f2,-2.0,4.65,5.2,1.05,Y2-.03,M.tile);
for(const x of [-4.5,-3.5,-2.5,-1.5,-.5]) box(f2,x,5.1,.04,.04,1.1,Y2,M.black);
box(f2,-2.5,5.1,5.0,.05,.06,Y2+1.02,M.black);
// 2F windows
windowUnit(f2,-2.0,4.12,2.56,2.0,Y2+.3);windowUnit(f2,1.3,4.12,1.65,1.1,Y2+.7);windowUnit(f2,4.9,4.12,.6,.9,Y2+.8);
windowUnit(f2,-4.9,-4.53,1.65,1.1,Y2+.7);windowUnit(f2,.2,-4.53,1.5,.9,Y2+.9);
bed(f2,-5,-2.8,1.4,2,.1+Y2);bed(f2,-5,2.4,1.4,2,.1+Y2);bed(f2,5,-2.8,1.5,2.05,.1+Y2);
cabinet(f2,3.6,2.9,2.1,.5,.9,Y2,M.kitchen);
label('LDK2 21.4帖',-.3,0,5.95);label('洋室C 4.5帖',-5,-.6,5.95);label('洋室D 6帖',-5,2.6,5.95);label('洋室E 7帖',5,-2.7,5.95);label('ランドリー',4,2.8,5.95);

// hip-ish roof made from sloped planes + ridge cap; includes solar arrays
function roofPlane(x,z,w,d,y,rx,rz){let q=box(roofs,x,z,w,d,.12,y,M.roof);q.rotation.x=rx;q.rotation.z=rz;return q}
roofPlane(0,-.2,13.5,5.4,6.55,-.36,0);roofPlane(0,-.2,13.5,5.4,6.55,.36,0);
roofPlane(-5.2,-.2,3.4,8.8,6.45,0,.36);roofPlane(5.2,-.2,3.4,8.8,6.45,0,-.36);
box(roofs,0,-.2,4.5,.18,.16,7.47,M.roof);
// lower roofs / eaves
roofPlane(3.8,3.8,4.4,2.1,3.0,-.28,0);roofPlane(-3.0,4.4,6.3,1.7,3.0,-.18,0);
// solar panels, matching drawing intent (south/main roof)
for(let r=0;r<2;r++)for(let c=0;c<6;c++){let p=box(roofs,-2.8+c*1.05,-1.2+r*.75,.92,.62,.035,7.08-r*.25,M.solar);p.rotation.x=-.36}

// facade siding lines for more realism
for(let y=.35;y<5.8;y+=.24){let l=box(house,0,D/2+.095,W,.025,.012,y,mat(0xc9c7c0));l.castShadow=false}
box(house,0,0,W+.5,D+.5,.35,-.35,mat(0xaaa9a2)); // foundation

let roofOn=true,labelsOn=true,wallsOn=true;
document.getElementById('roof').onclick=e=>{roofOn=!roofOn;roofs.visible=roofOn;e.target.textContent=`屋根 ${roofOn?'ON':'OFF'}`};
document.getElementById('labels').onclick=e=>{labelsOn=!labelsOn;labels.visible=labelsOn;e.target.textContent=`部屋名 ${labelsOn?'ON':'OFF'}`};
document.getElementById('walls').onclick=e=>{wallsOn=!wallsOn;wallMeshes.forEach(w=>w.visible=wallsOn);e.target.textContent=`壁 ${wallsOn?'ON':'OFF'}`};

function view(v){
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
 f1.visible=f2.visible=true;roofs.visible=roofOn;labels.visible=labelsOn;camera.fov=48;camera.updateProjectionMatrix();
 if(v==='outside'){camera.position.set(16,10,17);controls.target.set(0,2.6,0)}
 if(v==='all'){roofs.visible=false;camera.position.set(13,16,15);controls.target.set(0,2,0)}
 if(v==='f1'){f2.visible=false;roofs.visible=false;camera.position.set(11,14,13);controls.target.set(0,.8,0)}
 if(v==='f2'){f1.visible=false;roofs.visible=false;camera.position.set(11,15,13);controls.target.set(0,4,0)}
 if(v==='walk'){roofs.visible=false;camera.position.set(-1,1.62,3.2);controls.target.set(-1,1.55,-1.5);controls.minDistance=.1;controls.maxDistance=18}
 controls.update();
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)}loop();
