/* KOTOMORY 360°: free rotation around the product.
   Drag = turn (left/right) and tilt (up/down). Neighbouring photos blend smoothly.
   Frames come from km-spin-data.js (yaw/pitch per photo). */
(()=>{
const DATA=window.KM_SPIN||{};
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const L=(r,e)=>lang==='ru'?r:e;
const D2R=Math.PI/180,clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const vec=(yaw,pitch)=>{const y=yaw*D2R,p=pitch*D2R;return[Math.cos(p)*Math.sin(y),Math.sin(p),Math.cos(p)*Math.cos(y)]};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];

/* ---- DOM ---- */
const dm=document.querySelector('.detail-main-image');
const btn=document.createElement('button');btn.type='button';btn.className='ks-open';btn.hidden=true;
btn.innerHTML=`<b>360°</b><span>${L('КРУТИ','SPIN')}</span>`;
const wrap=document.createElement('div');wrap.className='km-spin';wrap.hidden=true;wrap.tabIndex=0;
wrap.innerHTML=`<div class="ks-stage"></div><div class="ks-bar"><button type="button" class="ks-reset">${L('↺ СБРОС','↺ RESET')}</button><button type="button" class="ks-auto" aria-pressed="false">${L('▶ АВТО','▶ AUTO')}</button></div><p class="ks-hint">${L('Тяни в любую сторону, чтобы крутить вещь','Drag in any direction to turn the piece')}</p><button type="button" class="ks-x" aria-label="Close">✕</button>`;
if(dm)dm.append(btn,wrap);
const stage=wrap.querySelector('.ks-stage');

/* ---- state ---- */
let cur=null,layers=[],yaw=0,pitch=0,vy=0,vp=0,drag=null,raf=0,auto=false,lastW=null;
const frameVecs=frames=>frames.map(f=>vec(f.yaw,f.pitch));
function weights(){const v=vec(yaw,pitch),fv=cur.vecs;const sig=cur.sigma;
 const w=fv.map(f=>{const c=clamp(dot(v,f),-1,1);const a=Math.acos(c)/D2R;return Math.exp(-(a*a)/(2*sig*sig))});
 const q=w.map(x=>x*x*x*x);const s=q.reduce((a,b)=>a+b,0)||1;return q.map(x=>x/s)}
function paint(){if(!cur)return;const w=weights();
 for(let i=0;i<layers.length;i++){const o=w[i]<.004?0:w[i];if(layers[i]._o!==o){layers[i].style.opacity=o.toFixed(3);layers[i]._o=o}}}
function tick(){raf=0;if(!cur)return;let moving=false;
 if(!drag){
  if(auto&&!RM){yaw+=0.22;moving=true}
  if(Math.abs(vy)>.02||Math.abs(vp)>.02){yaw+=vy;pitch+=vp;vy*=.92;vp*=.92;moving=true}
  else{vy=vp=0}
 }
 yaw=((yaw%360)+360)%360;pitch=clamp(pitch,-90,90);
 paint();if(moving||drag)raf=requestAnimationFrame(tick)}
const kick=()=>{if(!raf)raf=requestAnimationFrame(tick)};

/* ---- build layers for a product ---- */
function build(id){const d=DATA[id];if(!d){cur=null;return false}
 stage.innerHTML='';layers=d.frames.map(f=>{const im=new Image();im.decoding='async';im.draggable=false;im.src=f.src;im.className='ks-img';im.style.opacity=0;stage.append(im);return im});
 cur={frames:d.frames,vecs:frameVecs(d.frames),sigma:20,w:d.w,h:d.h};
 stage.style.setProperty('--ar',d.w/d.h);return true}

/* ---- input ---- */
wrap.addEventListener('pointerdown',e=>{if(!cur||e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,t:performance.now(),hist:[]};vy=vp=0;wrap.classList.add('drag');kick()});
wrap.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
 const k=0.42;yaw+=dx*k;pitch=clamp(pitch+dy*k,-90,90);
 const now=performance.now();drag.hist.push({dx:dx*k,dy:dy*k,t:now});drag.hist=drag.hist.filter(h=>now-h.t<90);kick()});
const release=()=>{if(!drag)return;const h=drag.hist;drag=null;wrap.classList.remove('drag');
 const sx=h.reduce((a,b)=>a+b.dx,0),sy=h.reduce((a,b)=>a+b.dy,0),n=Math.max(1,h.length);
 vy=clamp(sx/n*.9,-14,14);vp=clamp(sy/n*.9,-14,14);kick()};
wrap.addEventListener('pointerup',release);wrap.addEventListener('pointercancel',release);
wrap.addEventListener('keydown',e=>{if(!cur)return;const s=12;
 if(e.key==='ArrowLeft'){yaw-=s;e.preventDefault()}if(e.key==='ArrowRight'){yaw+=s;e.preventDefault()}
 if(e.key==='ArrowUp'){pitch=clamp(pitch+s,-90,90);e.preventDefault()}if(e.key==='ArrowDown'){pitch=clamp(pitch-s,-90,90);e.preventDefault()}
 if(e.key==='Escape'){close()}kick()});
wrap.querySelector('.ks-reset').onclick=e=>{e.stopPropagation();reset()};
wrap.querySelector('.ks-auto').onclick=e=>{e.stopPropagation();auto=!auto;e.currentTarget.setAttribute('aria-pressed',auto);e.currentTarget.classList.toggle('on',auto);kick()};
wrap.querySelector('.ks-x').onclick=e=>{e.stopPropagation();close()};
function reset(){if(RM){yaw=0;pitch=0;paint();return}
 const sy=((yaw+540)%360)-180,sp=pitch;const t0=performance.now(),dur=520;
 const ease=t=>1-Math.pow(1-t,3);const from={y:sy,p:sp};
 const step=t=>{const k=ease(Math.min(1,(t-t0)/dur));yaw=(from.y*(1-k)+0*k);pitch=from.p*(1-k);paint();if(k<1)requestAnimationFrame(step)};
 requestAnimationFrame(step)}

/* ---- open / close ---- */
btn.onclick=e=>{e.stopPropagation();open()};
function open(){if(!cur)return;wrap.hidden=false;wrap.focus({preventScroll:true});yaw=-25;pitch=12;vy=vp=0;auto=false;const ap=wrap.querySelector('.ks-auto');ap.classList.remove('on');ap.setAttribute('aria-pressed','false');paint();kick();
 reset();}
function close(){wrap.hidden=true;drag=null;vy=vp=0;auto=false}
const _setup=id=>{close();btn.hidden=!DATA[id];if(!DATA[id]){cur=null;return}build(id)};
KM.detail.push(id=>_setup(id));
KM.close.push(()=>close());
const first=typeof detailProductId!=='undefined'?detailProductId:null;if(first)_setup(first);
})();
