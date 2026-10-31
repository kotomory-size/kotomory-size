/* KOTOMORY desktop-only max motion. Runs only on real desktops (mouse + >=1024px); phones keep the light version. */
(()=>{
const H=document.documentElement;if(!H.classList.contains('km-pc')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const raf=requestAnimationFrame,clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),L=(r,e)=>lang==='ru'?r:e;
let mx=innerWidth/2,my=innerHeight/2;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});

/* 1. film grain over everything */
const gr=document.createElement('div');gr.className='kd-grain';document.body.append(gr);

/* 2. spark trail that follows the cursor */
const cv=document.createElement('canvas');cv.className='kd-trail';document.body.append(cv);const cx=cv.getContext('2d');let ps=[],run=false,lx=0,ly=0;
const fit=()=>{cv.width=innerWidth;cv.height=innerHeight};fit();addEventListener('resize',fit);
const cols=['#d7ff3f','#f5f5f2','#d7ff3f'];
addEventListener('pointermove',e=>{const d=Math.hypot(e.clientX-lx,e.clientY-ly);if(d<7)return;lx=e.clientX;ly=e.clientY;if(e.target.closest&&e.target.closest('.cb-ov,.pr-ov,.checkout-modal,input,textarea'))return;
 for(let i=0;i<2&&ps.length<70;i++)ps.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*1.6,vy:(Math.random()-.5)*1.6-.3,s:1.5+Math.random()*2.5,a:1,c:cols[Math.random()*3|0],r:Math.random()*6});
 if(!run){run=true;raf(loop)}},{passive:true});
function loop(){cx.clearRect(0,0,cv.width,cv.height);ps=ps.filter(p=>p.a>.03);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a*=.92;p.r+=.15;cx.globalAlpha=p.a;cx.fillStyle=p.c;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillRect(-p.s,-p.s/3,p.s*2,p.s*.66);cx.restore()});ps.length?raf(loop):(run=false,cx.clearRect(0,0,cv.width,cv.height))}

/* 3. hero: mouse parallax + cursor spotlight */
const hero=$('.hero'),him=$('.hero>img'),hc=$('.hero-copy');
if(hero&&him){const sp=document.createElement('div');sp.className='kd-hspot';hero.append(sp);let tx=0,ty=0,cxp=0,cyp=0,on=false;
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;sp.style.setProperty('--sx',e.clientX-r.left+'px');sp.style.setProperty('--sy',e.clientY-r.top+'px');if(!on){on=true;raf(f)}});
 hero.addEventListener('pointerleave',()=>{tx=ty=0});
 function f(){cxp+=(tx-cxp)*.08;cyp+=(ty-cyp)*.08;him.style.transform=`translate3d(${-cxp*34}px,${-cyp*22}px,0) scale(1.06)`;if(hc)hc.style.transform=`translate3d(${cxp*14}px,${cyp*9}px,0)`;if(Math.abs(tx-cxp)+Math.abs(ty-cyp)>.002)raf(f);else on=false}}

/* 4. magnetic nav + header buttons */
$$('.main-nav a,.header-actions>*').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.28}px ${(e.clientY-r.top-r.height/2)*.4}px`});b.addEventListener('pointerleave',()=>b.style.translate='')});

/* 5. cursor label ("VIEW") over product photos */
const cur=$('.km-cur');if(cur)addEventListener('pointermove',e=>{const t=e.target.closest&&e.target.closest('.product-visual');const txt=t&&!e.target.closest('button')?L('СМОТРЕТЬ','VIEW'):'';if(cur.textContent!==txt)cur.textContent=txt;cur.classList.toggle('lbl',!!txt)},{passive:true});

/* 6. chess board follows the mouse in 3D */
const bd=$('.cb-board'),cbo=$('.cb-ov');if(bd&&cbo)cbo.addEventListener('pointermove',e=>{const r=bd.getBoundingClientRect();bd.style.setProperty('--bx',((e.clientY-r.top)/r.height-.5)*-5+'deg');bd.style.setProperty('--by',((e.clientX-r.left)/r.width-.5)*6+'deg')});
if(cbo)cbo.addEventListener('pointerleave',()=>{bd.style.setProperty('--bx','0deg');bd.style.setProperty('--by','0deg')});

/* 7. presentation: big number drifts with the mouse */
const pro=$('.pr-ov');if(pro)pro.addEventListener('pointermove',e=>{pro.style.setProperty('--dx',(e.clientX/innerWidth-.5)*-40+'px');pro.style.setProperty('--dy',(e.clientY/innerHeight-.5)*-24+'px')});
})();
