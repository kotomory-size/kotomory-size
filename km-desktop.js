/* KOTOMORY desktop-only max motion. Runs only on real desktops (mouse + >=1024px); phones keep the light version. */
(()=>{
const H=document.documentElement;if(!H.classList.contains('km-pc')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const raf=requestAnimationFrame,clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),L=(r,e)=>lang==='ru'?r:e;
let mx=innerWidth/2,my=innerHeight/2;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});

/* 1. film grain over everything */
const gr=document.createElement('div');gr.className='kd-grain';document.body.append(gr);

/* 2. spark trail that follows the cursor (cheap: clears only the small area the sparks occupy) */
const cv=document.createElement('canvas');cv.className='kd-trail';document.body.append(cv);const cx=cv.getContext('2d',{desynchronized:true});let ps=[],run=false,lx=0,ly=0,dirty=false,bx0=0,by0=0,bx1=0,by1=0;
const fit=()=>{cv.width=innerWidth;cv.height=innerHeight};fit();addEventListener('resize',fit);
const cols=['#f5f5f2','#cfcfc8','#f5f5f2','#d7ff3f'];
addEventListener('pointermove',e=>{const d=Math.hypot(e.clientX-lx,e.clientY-ly);if(d<10)return;lx=e.clientX;ly=e.clientY;if(e.target.closest&&e.target.closest('.cb-ov,.pr-ov,.checkout-modal,input,textarea'))return;
 for(let i=0;i<2&&ps.length<34;i++)ps.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5-.3,s:1.4+Math.random()*2,a:.7,c:cols[Math.random()*4|0]});
 if(!run){run=true;raf(loop)}},{passive:true});
function loop(){if(dirty){cx.clearRect(bx0-3,by0-3,bx1-bx0+6,by1-by0+6);dirty=false}
 ps=ps.filter(p=>p.a>.05);if(!ps.length){run=false;return}
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
 for(const p of ps){p.x+=p.vx;p.y+=p.vy;p.a*=.9;cx.globalAlpha=p.a;cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.s,p.s);if(p.x<x0)x0=p.x;if(p.y<y0)y0=p.y;if(p.x>x1)x1=p.x;if(p.y>y1)y1=p.y}
 bx0=x0;by0=y0;bx1=x1+4;by1=y1+4;dirty=true;raf(loop)}

/* 3. hero: mouse parallax + cursor spotlight */
const hero=$('.hero'),him=$('.hero>img'),hc=$('.hero-copy');
if(hero&&him){const sp=document.createElement('div');let tx=0,ty=0,cxp=0,cyp=0,on=false;
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;if(!on){on=true;raf(f)}});
 hero.addEventListener('pointerleave',()=>{tx=ty=0});
 function f(){cxp+=(tx-cxp)*.08;cyp+=(ty-cyp)*.08;him.style.transform=`translate3d(${-cxp*34}px,${-cyp*22}px,0) scale(1.06)`;if(hc)hc.style.transform=`translate3d(${cxp*14}px,${cyp*9}px,0)`;if(Math.abs(tx-cxp)+Math.abs(ty-cyp)>.002)raf(f);else on=false}}

/* 4. magnetic nav + header buttons */
$$('.main-nav a,.header-actions>*').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.28}px ${(e.clientY-r.top-r.height/2)*.4}px`});b.addEventListener('pointerleave',()=>b.style.translate='')});

/* 6. chess board follows the mouse in 3D */
const bd=$('.cb-board'),cbo=$('.cb-ov');if(bd&&cbo)cbo.addEventListener('pointermove',e=>{const r=bd.getBoundingClientRect();bd.style.setProperty('--bx',((e.clientY-r.top)/r.height-.5)*-5+'deg');bd.style.setProperty('--by',((e.clientX-r.left)/r.width-.5)*6+'deg')});
if(cbo)cbo.addEventListener('pointerleave',()=>{bd.style.setProperty('--bx','0deg');bd.style.setProperty('--by','0deg')});

/* 7. presentation: big number drifts with the mouse */
const pro=$('.pr-ov');if(pro)pro.addEventListener('pointermove',e=>{pro.style.setProperty('--dx',(e.clientX/innerWidth-.5)*-40+'px');pro.style.setProperty('--dy',(e.clientY/innerHeight-.5)*-24+'px')});
})();
