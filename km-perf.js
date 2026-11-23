/* KOTOMORY performance governor.
   1. Watches real frame times on the phone while the user scrolls/animates.
      If frames are slow, it switches the page to a lighter mode (class km-slow) automatically.
   2. Pauses infinite decorative animations when the tab is hidden or the element is off-screen.
   Desktop keeps full effects unless its frames are slow too. */
(()=>{
const H=document.documentElement;if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const TOUCH=matchMedia('(pointer:coarse)').matches;
/* ---- 1. adaptive quality ---- */
let last=0,samples=[],decided=H.classList.contains('km-slow'),bad=0,t0=0;
function sample(t){if(decided)return;if(!last){last=t;requestAnimationFrame(sample);return}
 const dt=t-last;last=t;
 if(scrollActive&&dt<800)samples.push(dt);
 if(samples.length>=40){const s=[...samples].sort((a,b)=>a-b),med=s[Math.floor(s.length*.5)],p90=s[Math.floor(s.length*.9)];
   samples=[];
   const slowShare=s.filter(x=>x>25).length/s.length;if(med>22||slowShare>0.2){bad++;if(bad>=2){H.classList.add('km-slow');decided=true;H.dataset.perf='slow';return}}else bad=0}
 requestAnimationFrame(sample)}
let scrollActive=false,st=0;
addEventListener('scroll',()=>{scrollActive=true;clearTimeout(st);st=setTimeout(()=>scrollActive=false,160)},{passive:true});
requestAnimationFrame(sample);
/* ---- 2. pause decoration when hidden or off-screen ---- */
const SEL=['.ticker div','.km-big div','.kx-track','.kx-tape div','.kx-syms','.kx-badge .kx-spin','.kx-aurora','.kx-live .product-photo','.hero .button:after'];
const offscreen=new Set();
const io=new IntersectionObserver(es=>es.forEach(e=>{const t=e.target;if(e.isIntersecting)offscreen.delete(t);else offscreen.add(t);
  const paused=offscreen.has(t);t.classList.toggle('kp-off',paused)}),{rootMargin:'120px'});
const watch=()=>SEL.forEach(s=>document.querySelectorAll(s).forEach(el=>{if(!el._kp){el._kp=1;io.observe(el)}}));
watch();new MutationObserver(watch).observe(document.body,{childList:true,subtree:true});
document.addEventListener('visibilitychange',()=>H.classList.toggle('kp-hidden',document.hidden));
})();
/* phones: the chat button tucks away while the user scrolls so it never covers prices or cashback labels */
(()=>{if(!matchMedia('(pointer:coarse)').matches)return;let t=0,on=false;
 addEventListener('scroll',()=>{const fab=document.querySelector('.kz-fab');if(!fab)return;if(!on){on=true;fab.classList.add('away')}clearTimeout(t);t=setTimeout(()=>{on=false;fab.classList.remove('away')},700)},{passive:true})})();
