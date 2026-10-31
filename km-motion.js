/* KOTOMORY motion pack — works on top of script.js (uses its globals: products, favorites, lang, $, $$) */
(()=>{
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,H=document.documentElement;
const DROP_AT='2026-12-01T18:00:00+03:00'; // ← ПОСТАВЬ ДАТУ СВОЕГО СЛЕДУЮЩЕГО ДРОПА
const raf=requestAnimationFrame,clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),L=(r,e)=>lang==='ru'?r:e;
const tween=(el,to,ms=1100)=>{if(RM){el.textContent=to;return}const f=+el.textContent.replace(/\D/g,'')||0,t0=performance.now();const s=t=>{const k=clamp((t-t0)/ms,0,1);el.textContent=Math.round(f+(to-f)*(1-Math.pow(1-k,3)));if(k<1)raf(s)};raf(s)};
const copy=async t=>{try{await navigator.clipboard.writeText(t);return 1}catch(_){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();let ok=0;try{ok=document.execCommand('copy')}catch(_){}a.remove();return ok}};

/* 1. preloader → hero entrance */
const go=()=>H.classList.add('km-go'),pre=$('#kmPre');let seen=false;try{seen=!!sessionStorage.getItem('km-pre')}catch(_){}
if(pre&&(RM||seen)){pre.remove();go()}else if(pre){const n=pre.querySelector('em'),bar=pre.querySelector('u'),hero=$('.hero>img'),t0=performance.now();let p=0;
 const fin=()=>{pre.classList.add('done');setTimeout(go,350);setTimeout(()=>pre.remove(),1300);try{sessionStorage.setItem('km-pre','1')}catch(_){}};
 const step=t=>{const e=t-t0;p+=((hero&&hero.complete?100:Math.min(90,e/18))-p)*.12;n.textContent=String(Math.round(p)).padStart(3,'0');bar.style.setProperty('--p',p/100);
  if((p>99.2&&e>(FINE?1100:800))||e>3000){n.textContent='100';bar.style.setProperty('--p',1);fin()}else raf(step)};raf(step)}else go();

/* 2. scroll reveals */
const mark=(s,t,st)=>$$(s).forEach((el,i)=>{el.dataset.km=t;if(st)el.style.setProperty('--d',(i%6)*st+'ms')});
mark('.section h2,.editorial h2,.about h2,.newsletter h2','title');
mark('.section .eyebrow,.editorial-copy>p,.underlink,.details-intro','up');
mark('.values>div,.faq-block details,.km-stat,.km-drop,.newsletter>div,.newsletter form,.site-footer>div','up',90);
mark('.editorial-image','img');
const rmap=new Map(),rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){rmap.get(e.target).forEach(x=>x.classList.add('km-in'));rio.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -6% 0px'});
$$('[data-km]').forEach(el=>{if(RM)return el.classList.add('km-in');const t=el.dataset.km==='up'?el:el.parentElement;if(!rmap.has(t)){rmap.set(t,[]);rio.observe(t)}rmap.get(t).push(el)});

/* 3. stats count-up + countdown */
const st=$('.km-stats');if(st){const items=$('#kmStatItems');if(items)items.dataset.count=products.length;
 new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){$$('[data-count]').forEach(c=>tween(c,+c.dataset.count));o.disconnect()}}),{threshold:.3}).observe(st)}
const clock=()=>{const d=Math.max(0,new Date(DROP_AT)-Date.now()),v=[d/864e5,d/36e5%24,d/6e4%60,d/1e3%60];['kmD','kmH','kmM','kmS'].forEach((id,i)=>{const e=$('#'+id);if(e)e.textContent=String(Math.floor(v[i])).padStart(2,'0')})};clock();setInterval(clock,1000);

/* 4. product grid: stagger on filter/sort, no vanishing cards, counters, heart pop */
const grid=$('#productGrid');let mode='instant',popId=null;
document.addEventListener('click',e=>{if(e.target.closest('.filter,#mobileFavorites'))mode='stagger';const f=e.target.closest('[data-favorite]');if(f){mode='instant';popId=f.dataset.favorite}},true);
document.addEventListener('change',e=>{if(e.target.id==='sortSelect')mode='stagger'},true);
document.addEventListener('input',e=>{if(e.target.id==='searchInput')mode='stagger'},true);
const wishN=$('#kmWishN'),shown=$('#kmShown'),total=$('#kmTotal');if(total)total.textContent=products.length;
const sync=()=>{if(wishN)wishN.textContent=favorites.length;if(shown)tween(shown,grid.querySelectorAll('.product-card').length,500)};sync();
new MutationObserver(()=>{const cards=[...grid.querySelectorAll('.product-card')];
 cards.forEach((c,i)=>{const show=()=>{c.classList.add('is-visible');c.querySelector('.product-info')?.classList.add('is-visible')};
  if(mode==='stagger'&&!RM){c.style.transitionDelay=Math.min(i,11)*50+'ms';raf(()=>raf(show))}else{c.classList.add('km-instant');show()}});
 if(popId){grid.querySelector(`[data-favorite="${popId}"]`)?.classList.add('km-pop');popId=null}
 mode='instant';sync()}).observe(grid,{childList:true});
if(FINE&&!RM){grid.addEventListener('pointermove',e=>{const v=e.target.closest('.product-visual');if(!v)return;const r=v.getBoundingClientRect();v.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');v.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*8+'deg')});
 grid.addEventListener('pointerout',e=>{const v=e.target.closest?.('.product-visual');if(v&&!v.contains(e.relatedTarget)){v.style.setProperty('--rx','0deg');v.style.setProperty('--ry','0deg')}})}
$('#kmWish')?.addEventListener('click',()=>{$('.filter[data-filter="favorites"]').click();$('#shop').scrollIntoView({behavior:'smooth'})});

/* 5. cart: fly-to-cart, bump, row cascade */
const _add=window.addToCart;window.addToCart=function(id){if(!RM)try{fly(id)}catch(_){}return _add.apply(this,arguments)};
function fly(id){const open=$('#productDetailModal').classList.contains('open');const src=open?$('#detailProductImage'):$(`[data-product-image="${id}"]`);if(!src)return;const a=src.getBoundingClientRect(),t=(innerWidth<=760?$('#mobileCart'):$('#cartToggle')).getBoundingClientRect();
 const im=document.createElement('img');im.src=src.src;im.className='km-fly';document.body.append(im);
 const at=(r,s)=>`translate(${r.left+r.width/2-45}px,${r.top+r.height/2-55}px) scale(${s})`;
 im.animate([{transform:at(a,1),opacity:1},{transform:at(t,.18),opacity:.4}],{duration:750,easing:'cubic-bezier(.5,0,.2,1)'}).onfinish=()=>im.remove()}
const bump=el=>{el.classList.remove('km-bump');void el.offsetWidth;el.classList.add('km-bump')};
['#cartCount','#mobileCartCount'].forEach(s=>{const el=$(s);if(el)new MutationObserver(()=>bump(el)).observe(el,{childList:true,characterData:true,subtree:true})});
const ct=$('#cartTotal');if(ct)new MutationObserver(()=>{ct.classList.remove('km-flash');void ct.offsetWidth;ct.classList.add('km-flash')}).observe(ct,{childList:true});
let wasOpen=false;new MutationObserver(()=>{const o=document.body.classList.contains('cart-open');if(o&&!wasOpen){$$('.cart-row').forEach((r,i)=>r.style.setProperty('--i',i));const c=$('#cartItems');c.classList.add('km-rows');setTimeout(()=>c.classList.remove('km-rows'),1000)}wasOpen=o}).observe(document.body,{attributes:true,attributeFilter:['class']});

/* 6. confetti */
function confetti(n=90){if(RM)return;const c=document.createElement('canvas');c.className='km-conf';c.width=innerWidth;c.height=innerHeight;document.body.append(c);const g=c.getContext('2d'),cols=['#d7ff3f','#f5f5f2','#969692','#d7ff3f'],ps=Array.from({length:n},()=>({x:innerWidth/2,y:innerHeight*.6,vx:(Math.random()-.5)*16,vy:-Math.random()*16-6,s:4+Math.random()*6,r:Math.random()*6,c:cols[Math.random()*4|0]}));
 const f=()=>{g.clearRect(0,0,c.width,c.height);let a=0;ps.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.r+=.2;if(p.y<c.height+20){a++;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);g.restore()}});a?raf(f):c.remove()};f()}
window.kmConfetti=confetti;
const sv=$('#checkoutSuccessView');if(sv)new MutationObserver(()=>{if(!sv.hidden)confetti()}).observe(sv,{attributes:true,attributeFilter:['hidden']});
$('#newsletterForm')?.addEventListener('submit',()=>confetti(50));

/* 7. theme switch as a circular reveal */
document.addEventListener('click',e=>{const b=e.target.closest('#themeToggle,#mobileTheme');if(!b||RM||!document.startViewTransition)return;e.stopImmediatePropagation();
 const x=e.clientX,y=e.clientY,r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
 document.startViewTransition(()=>toggleTheme()).ready.then(()=>H.animate({clipPath:[`circle(0 at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:650,easing:'cubic-bezier(.2,.75,.25,1)',pseudoElement:'::view-transition-new(root)'}))},true);

/* 8. ripple + magnetic buttons + cursor ring */
$$('.button,.filter,.promo-apply').forEach(b=>b.classList.add('km-rip'));
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.km-rip');if(!b||RM)return;const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,i=document.createElement('i');i.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.append(i);setTimeout(()=>i.remove(),650)});
if(FINE&&!RM){$$('.button:not(.kc-btn),.cart-btn,.fun-actions button').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.25}px ${(e.clientY-r.top-r.height/2)*.25}px`});b.addEventListener('pointerleave',()=>b.style.translate='')});
 const c=document.createElement('div');c.className='km-cur';document.body.append(c);let x=0,y=0,cx=0,cy=0,run=false;
 const loop=()=>{cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate3d(${cx}px,${cy}px,0)`;if(Math.abs(x-cx)+Math.abs(y-cy)>.3)raf(loop);else run=false};
 addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;c.style.opacity=1;c.classList.toggle('big',!!e.target.closest('a,button,summary,select,label,[role=button],.product-visual'));if(!run){run=true;raf(loop)}},{passive:true});
 H.addEventListener('mouseleave',()=>c.style.opacity=0)}

/* 9. product modal: hover zoom, arrow keys, share link, deep link */
const dm=$('.detail-main-image'),di=$('#detailProductImage');
if(FINE&&!RM&&dm){const lens=document.createElement('div');lens.className='km-lens';dm.append(lens);const LS=170,Z=2.6;let lx=0,ly2=0,lt=false,vis=false;
 const draw=()=>{lt=false;const r=dm.getBoundingClientRect(),cw=r.width-24,ch=r.height-24,nw=di.naturalWidth||1,nh=di.naturalHeight||1,s=Math.min(cw/nw,ch/nh),dw=nw*s,dh=nh*s,ox=12+(cw-dw)/2,oy=12+(ch-dh)/2,x=lx-r.left,y=ly2-r.top;
  const inside=x>=ox&&x<=ox+dw&&y>=oy&&y<=oy+dh;if(!inside){lens.classList.remove('on');return}
  if(lens.dataset.src!==di.src){lens.dataset.src=di.src;lens.style.backgroundImage=`url("${di.src}")`}
  lens.style.backgroundSize=`${dw*Z}px ${dh*Z}px`;lens.style.backgroundPosition=`${-((x-ox)*Z-LS/2)}px ${-((y-oy)*Z-LS/2)}px`;lens.style.transform=`translate3d(${x-LS/2}px,${y-LS/2}px,0)`;lens.classList.add('on')};
 dm.addEventListener('pointermove',e=>{lx=e.clientX;ly2=e.clientY;if(!lt){lt=true;raf(draw)}});dm.addEventListener('pointerleave',()=>lens.classList.remove('on'))}
document.addEventListener('keydown',e=>{if(!$('#productDetailModal').classList.contains('open'))return;if(e.key==='ArrowRight')setDetailImage(detailImageIndex+1);if(e.key==='ArrowLeft')setDetailImage(detailImageIndex-1)});
const add=$('#detailAddToCart');if(add){const s=document.createElement('button');s.type='button';s.className='km-share';s.dataset.ru='ПОДЕЛИТЬСЯ ЭТОЙ ВЕЩЬЮ ↗';s.dataset.en='SHARE THIS PIECE ↗';s.textContent=s.dataset.ru;add.after(s);
 s.onclick=async()=>showToast(await copy(location.href.split('#')[0]+'#product-'+detailProductId)?L('ССЫЛКА НА ТОВАР СКОПИРОВАНА ↗','PRODUCT LINK COPIED ↗'):L('НЕ УДАЛОСЬ СКОПИРОВАТЬ','COULD NOT COPY'))}
const dl=location.hash.match(/^#product-(\d+)/);if(dl&&products.some(p=>p.id===+dl[1]))setTimeout(()=>openProductDetail(+dl[1]),600);

/* 10. one scroll loop: progress, header, parallax, back-to-top ring, marquee speed, scrollspy */
const bar=document.createElement('div');bar.className='km-bar';document.body.prepend(bar);
const hdr=$('.site-header'),nav=$('#mainNav'),hi=$('.hero>img'),hero=$('.hero'),ei=$('.editorial-image img'),eb=$('.editorial-image'),top=$('#backToTop');
const anims=[];const tk=$('.ticker div');if(tk&&tk.getAnimations)anims.push(...tk.getAnimations());
const big=$('.km-big div');if(big&&!RM)anims.push(big.animate([{transform:'translateX(0)'},{transform:'translateX(-50%)'}],{duration:40000,iterations:Infinity}));
let ly=scrollY,boost=0,tick=false,lp=-1;
function frame(){tick=false;const y=scrollY,dy=y-ly,h=H.scrollHeight-innerHeight;
 bar.style.transform=`scaleX(${h>0?y/h:0})`;
 if(!RM){if(y<120||nav.classList.contains('open'))hdr.classList.remove('km-hide');else if(dy>2)hdr.classList.add('km-hide');else if(dy<-2)hdr.classList.remove('km-hide');
  if(FINE&&y<hero.offsetHeight*1.2&&hi)hi.style.translate=`0 ${Math.min(y*.15,hero.offsetHeight*.14)}px`;
  if(FINE&&ei){const r=eb.getBoundingClientRect(),m=r.height*.07;if(r.bottom>0&&r.top<innerHeight)ei.style.translate=`0 ${clamp((r.top+r.height/2-innerHeight/2)*-.1,-m,m)}px`}
  if(FINE){boost=dy?clamp(dy*.35,-4,10):boost*.9;anims.forEach(a=>a.playbackRate=1+boost);if(Math.abs(boost)>.05)schedule()}}
 if(top){top.classList.toggle('km-show',y>600);const pp=Math.round(h>0?y/h*100:0);if(pp!==lp){lp=pp;top.style.setProperty('--p',pp)}}
 ly=y}
const schedule=()=>{if(!tick){tick=true;raf(frame)}};
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);frame();
const links=[...$$('.main-nav a')];
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});['shop','about','editorial','details','contact'].forEach(id=>{const el=document.getElementById(id);if(el)spy.observe(el)});

/* 11. size charts per product (cm, flat garment). Reference values — replace with your real measurements */
const R=(ru,en,v)=>[ru,en,v];
const SZ={
 tee:{rows:[R('Длина','Length',[70,72,74,76]),R('Ширина груди','Chest width',[55,58,61,64]),R('Плечи','Shoulders',[52,55,58,61]),R('Длина рукава','Sleeve length',[22,23,24,25])]},
 hoodie:{rows:[R('Длина','Length',[68,70,72,74]),R('Ширина груди','Chest width',[60,63,66,69]),R('Плечи','Shoulders',[56,58,60,62]),R('Длина рукава','Sleeve length',[66,67,68,69])]},
 jacket:{rows:[R('Длина','Length',[70,72,74,76]),R('Ширина груди','Chest width',[60,62,64,66]),R('Плечи','Shoulders',[54,56,58,60]),R('Длина рукава','Sleeve length',[66,67,68,69])]},
 jeans:{rows:[R('Талия (обхват)','Waist (girth)',[75,83,90,100]),R('Бёдра (обхват)','Hips (girth)',[108,114,120,126]),R('Длина по шагу','Inseam',[80,81,82,83]),R('Посадка','Rise',[29,30,31,32]),R('Низ штанины (обхват)','Leg opening (girth)',[58,60,62,64])]},
 gloves:{rows:[R('Обхват ладони','Palm girth',[20,22,24,26]),R('Длина перчатки','Glove length',[21,22,23,24])]},
 ring:{rows:[R('Внутренний диаметр, мм','Inner diameter, mm',[17.3,18.1,18.9,19.8]),R('Обхват, мм','Circumference, mm',[54.4,56.9,59.4,62.2]),R('Размер US','US size',[7,8,9,10])]},
 bracelet:{rows:[R('Длина (внутри)','Inner length',[17,18,19,20])]},
 bag:{one:1,rows:[R('Ширина','Width',[28]),R('Высота','Height',[20]),R('Глубина','Depth',[10]),R('Ремень (макс.)','Strap (max)',[120])]}
};
const SK={9:'tee',10:'jeans',11:'hoodie',12:'jacket',13:'bag',14:'hoodie',15:'gloves',16:'ring',17:'bracelet',18:'jacket'};
const szHTML=id=>{const d=SZ[SK[id]];if(!d)return'';const cols=d.one?['ONE SIZE']:['S','M','L','XL'];
 return `<details class="km-size" open><summary>${L('ТАБЛИЦА РАЗМЕРОВ','SIZE CHART')} · ${SK[id]==='ring'?'MM':L('СМ','CM')}</summary><div class="km-sz-wrap"><table><thead><tr><th></th>${cols.map(c=>`<th data-c="${c}">${c}</th>`).join('')}</tr></thead><tbody>${d.rows.map(r=>`<tr><th>${L(r[0],r[1])}</th>${r[2].map((v,i)=>`<td data-c="${cols[i]}">${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>${L('Замеры изделия лёжа, справочные: возможна погрешность до 2 см.','Flat garment measurements, for reference: up to 2 cm tolerance.')}</p><button type="button" class="sf-open">${L('ПОДОБРАТЬ РАЗМЕР ПО РОСТУ И ВЕСУ ↗','FIND MY SIZE BY HEIGHT & WEIGHT ↗')}</button></details>`};
const szMark=(box,sel)=>box&&box.querySelectorAll('[data-c]').forEach(c=>c.classList.toggle('sel',c.dataset.c===sel));
const szD=document.createElement('div'),szS=document.createElement('div');szD.id='kmSzD';szS.id='kmSzS';
$('.detail-sizes')?.after(szD);$('.size-note')?.before(szS);let curD=null,curS=null;
const paintD=()=>{if(curD==null)return;szD.innerHTML=szHTML(curD);szMark(szD,detailSelectedSize)},paintS=()=>{if(curS==null)return;szS.innerHTML=szHTML(curS);szMark(szS,selectedSize)};
const _opd=window.openProductDetail;window.openProductDetail=function(id){const r=_opd.apply(this,arguments);curD=id;paintD();return r};
const _osp=window.openSizePicker;window.openSizePicker=function(id){const r=_osp.apply(this,arguments);curS=id;paintS();return r};
document.addEventListener('click',e=>{if(e.target.closest('[data-detail-size]'))szMark(szD,detailSelectedSize);if(e.target.closest('[data-size]'))szMark(szS,selectedSize)});
$('#langToggle')?.addEventListener('click',()=>{paintD();paintS()});
})();
