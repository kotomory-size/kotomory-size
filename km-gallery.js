/* KOTOMORY galleries: the photo follows the finger, the next frame slides in, neighbours are pre-decoded.
   Arrow buttons use the same animation. The photo roll is a native scroll area on touch screens. */
(()=>{
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const TOUCH=matchMedia('(pointer:coarse)').matches;
const EASE='cubic-bezier(.2,.75,.25,1)';
const pre=src=>{if(!src)return;const im=new Image();im.decoding='async';im.src=src;return im.decode?im.decode().catch(()=>{}):0};
const mod=(i,n)=>((i%n)+n)%n;

/* ---------- one gallery = one visible <img> inside a host ---------- */
function gallery(img,host,api){
 let ghost=null,drag=null,busy=false,suppress=0,hist=[];
 const W=()=>host.clientWidth||img.clientWidth||300;
 const list=()=>api.list();
 const idx=()=>api.index();
 const neigh=d=>{const L=list();return L.length>1?L[mod(idx()+d,L.length)]:null};
 function makeGhost(d){const L=list(),src=L[mod(idx()+d,L.length)];if(!L.length)return null;
  const g=img.cloneNode(false);g.removeAttribute('id');g.removeAttribute('data-product-image');g.removeAttribute('data-image-index');
  g.classList.add('kg-ghost');g.draggable=false;g.setAttribute('aria-hidden','true');g.alt='';g.src=src;host.append(g);pre(neigh(d+1));pre(neigh(d-1));return g}
 function clear(){if(ghost)ghost.remove();ghost=null;img.style.transform=''}
 function settle(d){const next=mod(idx()+d,list().length);api.set(next);clear();busy=false;pre(neigh(1));pre(neigh(-1))}
 function slide(d){if(busy||list().length<2)return;busy=true;const g=makeGhost(d);ghost=g;
  if(RM){settle(d);return}
  const w=W();const go=()=>{img.animate([{transform:'translate3d(0,0,0)'},{transform:`translate3d(${-d*w}px,0,0)`}],{duration:420,easing:EASE});
   const a=g.animate([{transform:`translate3d(${d*w}px,0,0)`},{transform:'translate3d(0,0,0)'}],{duration:420,easing:EASE});
   a.onfinish=()=>settle(d)};
  const ready=g.decode?g.decode().catch(()=>{}):Promise.resolve();ready.then(go)}
 function onDown(e){if(e.target.closest('button,a,input'))return;if(busy)return;
  drag={x:e.clientX,y:e.clientY,dx:0,moved:false,t:performance.now(),pid:e.pointerId};hist=[{x:e.clientX,t:drag.t}];
  addEventListener('pointermove',onMove,true);addEventListener('pointerup',onUp,true);addEventListener('pointercancel',onUp,true)}
 function onMove(e){if(!drag||e.pointerId!==drag.pid)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moved){if(Math.abs(dx)<8||Math.abs(dy)>Math.abs(dx))return;drag.moved=true;img.classList.add('kg-drag');ghost=makeGhost(dx<0?1:-1)}
  drag.dx=dx;hist.push({x:e.clientX,t:performance.now()});if(hist.length>5)hist.shift();
  const w=W(),d=dx<0?1:-1;
  img.style.transform=`translate3d(${dx}px,0,0)`;
  if(ghost)ghost.style.transform=`translate3d(${dx+d*w}px,0,0)`;}
 function onUp(e){if(!drag||e.pointerId!==drag.pid)return;const d0=drag;drag=null;removeEventListener('pointermove',onMove,true);removeEventListener('pointerup',onUp,true);removeEventListener('pointercancel',onUp,true);
  if(!d0.moved){return}
  suppress=performance.now()+350;img.classList.remove('kg-drag');
  const h=hist[0],t=hist[hist.length-1],v=h&&t.t>h.t?(t.x-h.x)/(t.t-h.t):0;   // px per ms
  const w=W(),dx=d0.dx,dir=dx<0?1:-1,fast=Math.abs(v)>.6&&Math.abs(dx)>48&&Math.sign(v)===-dir;
  const commit=Math.abs(dx)>w*.22||fast||(Math.abs(v)>1.2&&Math.sign(v)===-dir);
  if(!ghost){return}
  busy=true;
  const target=commit?-dir*0:0;
  const endX=commit?-dir*w:0,ghostEnd=commit?0:dir*w;
  const left=Math.abs(endX-dx)/w,speed=Math.min(3,Math.abs(v)),dur=Math.max(150,Math.min(360,(260+200*left)/(1+speed*0.6)));
  const done=()=>{if(commit)settle(dir);else{clear();busy=false}};
  if(RM){done();return}
  const g=ghost;
  img.animate([{transform:`translate3d(${dx}px,0,0)`},{transform:`translate3d(${endX}px,0,0)`}],{duration:dur,easing:EASE});
  const a=g.animate([{transform:`translate3d(${dx+dir*w}px,0,0)`},{transform:`translate3d(${ghostEnd}px,0,0)`}],{duration:dur,easing:EASE});
  a.onfinish=done}
  img.draggable=false;host.addEventListener('dragstart',e=>e.preventDefault());
 host.addEventListener('pointerdown',onDown);
 /* a drag must not also count as a click that opens the product */
 host.addEventListener('click',e=>{if(performance.now()<suppress){e.stopPropagation();e.preventDefault()}},true);
 return{slide,clear}
}

/* ---------- card photos ---------- */
const cards=new Map();
function cardApi(id){const p=products.find(x=>x.id===id);const img=document.querySelector(`[data-product-image="${id}"]`);
 return{img,list:()=>p&&p.images?p.images:[],index:()=>+(img.dataset.imageIndex||0),
  set:i=>{img.dataset.imageIndex=i;img.src=p.images[i];img.alt=`${p.ru} — фото ${i+1}`}}}
function wireCards(){document.querySelectorAll('.product-card').forEach(c=>{
  const id=+c.dataset.productCard;const img=c.querySelector('.product-photo[data-product-image]');if(!img||cards.has(id)||!c.querySelector('.product-gallery-controls'))return;
  const host=img.parentElement;host.classList.add('kg-host');
  if(TOUCH)host.style.touchAction='pan-y';
  const api=cardApi(id);cards.set(id,gallery(img,host,api));
 })}
/* arrows: animated, not instant */
document.addEventListener('click',e=>{const b=e.target.closest('[data-gallery-next],[data-gallery-prev]');if(!b)return;
 e.stopImmediatePropagation();e.preventDefault();const id=+(b.dataset.galleryNext||b.dataset.galleryPrev);
 const g=cards.get(id);if(g)g.slide(b.dataset.galleryNext?1:-1)},true);

window.kmSlideCard=(id,d)=>{const g=cards.get(id);if(!g)return false;g.slide(d);return true};
/* ---------- detail window ---------- */
let detailG=null,detailId=null;
function wireDetail(){const img=document.getElementById('detailProductImage');const host=img&&img.parentElement;if(!img||!host)return;
 host.classList.add('kg-host');if(TOUCH)host.style.touchAction='pan-y';
 const api={img,list:()=>{const p=products.find(x=>x.id===detailProductId);if(!p)return[];return[...new Set((p.detailImages&&p.detailImages.length?p.detailImages:p.images)||[])]},
  index:()=>detailImageIndex,set:i=>setDetailImage(i)};
 detailG=gallery(img,host,api)}
document.addEventListener('click',e=>{const b=e.target.closest('#detailPrev,#detailNext');if(!b||!detailG)return;
 e.stopImmediatePropagation();e.preventDefault();detailG.slide(b.id==='detailNext'?1:-1)},true);
const _o=window.openProductDetail;

/* ---------- photo roll: native scroll on touch, slow autoplay that pauses while the finger is on it ---------- */
function wireRoll(){if(!TOUCH||RM)return;document.querySelectorAll('.kx-row').forEach(row=>{
 row.style.overflowX='auto';row.style.scrollbarWidth='none';row.style.webkitOverflowScrolling='touch';row.style.overscrollBehaviorX='contain';
 const track=row.querySelector('.kx-track');if(!track||row._kg)return;row._kg=1;track.style.animation='none';
 let pausedUntil=0,pos=0;
 const hold=()=>pausedUntil=performance.now()+2200;
 row.addEventListener('pointerdown',hold,{passive:true});row.addEventListener('touchstart',hold,{passive:true});
 row.addEventListener('touchmove',hold,{passive:true});row.addEventListener('scroll',hold,{passive:true});
 const half=()=>track.scrollWidth/2;
 const step=()=>{if(performance.now()>pausedUntil&&!document.hidden&&row.getBoundingClientRect().bottom>0&&row.getBoundingClientRect().top<innerHeight){
   row.scrollLeft+=0.5;if(row.scrollLeft>=half())row.scrollLeft-=half()}
   requestAnimationFrame(step)};
 requestAnimationFrame(step)})}

/* ---------- boot ---------- */
const boot=()=>{wireCards();wireDetail();wireRoll()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
new MutationObserver(()=>{wireCards();wireRoll()}).observe(document.getElementById('productGrid')||document.body,{childList:true,subtree:true});
window.KM&&KM.detail.push(id=>{detailId=id;if(!detailG)wireDetail()});
})();
