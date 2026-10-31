/* KOTOMORY motion2: more moving things (spinning badge, drifting symbols, photo roll, tapes, floating photos) */
(()=>{
const H=document.documentElement;if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const LITE=H.classList.contains('km-lite'),PC=H.classList.contains('km-pc'),raf=requestAnimationFrame,rnd=(a,b)=>a+Math.random()*(b-a);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

/* 1. hero: aurora glow, scan line, drifting symbols, spinning badge */
const hero=$('.hero');
if(hero&&!LITE){
 const sy=['✳','✦','✧','+','◇','✺'],n=PC?14:6;let s='';
 for(let i=0;i<n;i++)s+=`<span class="kx-sym" style="left:${rnd(2,96).toFixed(1)}%;top:${rnd(8,92).toFixed(1)}%;--s:${rnd(14,34).toFixed(0)}px;--d:${rnd(9,18).toFixed(1)}s;--dl:-${rnd(0,12).toFixed(1)}s;--dx:${rnd(-40,40).toFixed(0)}px;--r:${rnd(-180,180).toFixed(0)}deg">${sy[i%sy.length]}</span>`;
 hero.insertAdjacentHTML('beforeend',`<div class="kx-aurora" aria-hidden="true"><i></i><i></i></div><div class="kx-scan" aria-hidden="true"></div><div class="kx-syms" aria-hidden="true">${s}</div><div class="kx-badge" aria-hidden="true"><div class="kx-scroll"><div class="kx-spin"><svg viewBox="0 0 200 200"><defs><path id="kxc" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs><text><textPath href="#kxc" textLength="484" lengthAdjust="spacing">HANDMADE ✳ DOTA 2 ✳ KOTOMORY ✳ DROP 001 ✳ </textPath></text></svg></div></div><b>K</b></div>`);
 const sc=hero.querySelector('.kx-scroll');let q=0;addEventListener('scroll',()=>{if(q)return;q=1;raf(()=>{q=0;sc.style.rotate=scrollY*.14+'deg'})},{passive:true});
}

/* 2. photo roll between the shop and the editorial block */
const shop=$('#shop');
if(shop&&typeof products!=='undefined'){
 const its=products.map(p=>({id:p.id,src:p.cardImage||(p.images&&p.images[0])||p.image,alt:p.ru})).filter(x=>x.src);
 const track=(arr,rev)=>`<div class="kx-row${rev?' rev':''}"><div class="kx-track">${[...arr,...arr].map(x=>`<button type="button" class="kx-it" data-id="${x.id}" aria-label="${esc(x.alt)}"><img src="${x.src}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div></div>`;
 const sec=document.createElement('section');sec.className='kx-roll';sec.setAttribute('aria-label','KOTOMORY lookbook');
 sec.innerHTML=`<p class="kx-cap" data-ru="ЛЕНТА / DROP 001" data-en="ROLL / DROP 001">ЛЕНТА / DROP 001</p>${track(its,false)}${PC?track(its.slice().reverse(),true):''}`;
 shop.insertAdjacentElement('afterend',sec);
 sec.addEventListener('load',e=>e.target.classList&&e.target.classList.add('ok'),true);sec.querySelectorAll('img').forEach(i=>{if(i.complete&&i.naturalWidth)i.classList.add('ok')});
 sec.addEventListener('click',e=>{const b=e.target.closest('.kx-it');if(b)openProductDetail(+b.dataset.id)});
}

/* 3. two crossing "tape" strips before the About block */
const ab=$('.about');
if(ab){const txt='KOTOMORY ✳ HANDMADE ✳ DOTA 2 ✳ Y2K ✳ DROP 001 ✳ ',t=txt.repeat(8);
 ab.insertAdjacentHTML('beforebegin',`<div class="kx-tapes" aria-hidden="true"><div class="kx-tape a"><div>${t}</div></div><div class="kx-tape b"><div>${t}</div></div></div>`)}

/* 4. product photos float gently, but only while they are on screen */
const grid=$('#productGrid');
if(grid&&'IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('kx-live',e.isIntersecting)),{rootMargin:'80px'});
 const watch=()=>grid.querySelectorAll('.product-card:not([data-kx])').forEach((c,i)=>{c.dataset.kx=1;c.style.setProperty('--kd',-(i%5)*1.1+'s');io.observe(c)});
 watch();new MutationObserver(watch).observe(grid,{childList:true});
}
})();
