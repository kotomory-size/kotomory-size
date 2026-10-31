/* KOTOMORY fx: extra motion layer (loaded last). Skipped entirely for reduced-motion. */
(()=>{
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,raf=requestAnimationFrame;

/* 1. section titles: word-by-word mask reveal */
$$('[data-km=title]').forEach(h=>{let n=0;const walk=node=>[...node.childNodes].forEach(c=>{
 if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.append(t);else{const w=document.createElement('span'),i=document.createElement('i');w.className='kf-w';i.textContent=t;i.style.setProperty('--wi',n++);w.append(i);f.append(w)}});c.replaceWith(f)}
 else if(c.nodeType===1&&c.tagName!=='BR')walk(c)});walk(h);h.classList.add('kf-split')});

/* 2. text scramble: nav links on hover, eyebrows on first reveal */
const GL='01/\\*#<>+=';
const scr=(e,ms=480)=>{if(e._s||e.children.length)return;const t=e.textContent;e._s=1;const t0=performance.now();
 const f=now=>{const k=Math.min(1,(now-t0)/ms);let o='';for(let i=0;i<t.length;i++)o+=t[i]===' '||i<t.length*k?t[i]:GL[Math.random()*GL.length|0];e.textContent=o;if(k<1)raf(f);else{e.textContent=t;e._s=0}};raf(f)};
if(FINE)$$('.main-nav a,.footer-links a').forEach(a=>a.addEventListener('pointerenter',()=>scr(a,380)));
const eio=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){scr(e.target,620);o.unobserve(e.target)}}),{threshold:.6});
$$('.eyebrow').forEach(e=>{if(!e.closest('.hero,.checkout-modal,.cb-ov,.pr-ov,.cart-drawer'))eio.observe(e)});

/* 3. spotlight that follows the cursor on cards */
if(FINE)document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.product-visual,.detail-card,.km-stat,.km-work,.km-size');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')},{passive:true});

/* 4. heart burst on favorite */
document.addEventListener('click',e=>{const f=e.target.closest('[data-favorite]');if(!f)return;const id=f.dataset.favorite;
 setTimeout(()=>{const b=document.querySelector(`[data-favorite="${id}"]`);if(!b||!b.classList.contains('is-favorite'))return;const r=b.getBoundingClientRect();
  for(let i=0;i<9;i++){const p=document.createElement('i');p.className='kf-h';p.textContent='♥';p.style.cssText=`left:${r.left+r.width/2}px;top:${r.top+r.height/2}px`;document.body.append(p);
   const a=i/9*Math.PI*2,d=36+Math.random()*26;p.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(1.1)`,opacity:0}],{duration:700,easing:'cubic-bezier(.2,.75,.25,1)'}).onfinish=()=>p.remove()}},70)});

/* 5. photo swaps (gallery arrows) fade + zoom */
const swap=new MutationObserver(ms=>ms.forEach(m=>{const i=m.target;if(i.tagName!=='IMG')return;i.classList.remove('kf-swap');void i.offsetWidth;i.classList.add('kf-swap')}));
const g=$('#productGrid');g&&swap.observe(g,{attributes:true,attributeFilter:['src'],subtree:true});
const di=$('#detailProductImage');di&&swap.observe(di,{attributes:true,attributeFilter:['src']});

/* 6. checkout: drawn checkmark + total tick */
const sm=$('.success-mark');if(sm)sm.innerHTML='<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M13 27l9 9 17-19"/></svg>';
const kt=$('#kcTotal');if(kt)new MutationObserver(()=>{kt.classList.remove('kf-tick');void kt.offsetWidth;kt.classList.add('kf-tick')}).observe(kt,{childList:true});

/* 7. gentle attention pulse on the game button until it is clicked */
const gb=$('#kmGameBtn');if(gb){gb.classList.add('kf-idle');gb.addEventListener('click',()=>gb.classList.remove('kf-idle'),{once:true})}
})();
