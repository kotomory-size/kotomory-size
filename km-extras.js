/* KOTOMORY extras: «Ход работы» presentation + chess vs AI + 10% reward banner */
(()=>{
const L=(r,e)=>lang==='ru'?r:e,RWK='kotomory-reward';
const rw=()=>{try{return localStorage.getItem(RWK)||'none'}catch(_){return'none'}};
const setRw=v=>{try{localStorage.setItem(RWK,v)}catch(_){}refresh()};
const lock=on=>document.body.style.overflow=on?'hidden':'';
const el=h=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ---------- reward banner + 60-second "hurry" offer ---------- */
const DELAY=30000,OFFER=60000,OK='kotomory-offer';let O=null;try{O=JSON.parse(sessionStorage.getItem(OK)||'null')}catch(_){}
const saveO=()=>{try{sessionStorage.setItem(OK,JSON.stringify(O))}catch(_){}};
const left=()=>O&&O.start?Math.min(OFFER,Math.max(0,OFFER-(Date.now()-O.start))):OFFER;
const fmt=t=>{const s=Math.ceil(t/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const state=()=>{const r=rw();if(r!=='none')return r;if(!O||Date.now()<O.start)return'wait';if(O.claimed)return'claimed';return left()>0?'live':'dead'};
const bn=el('<button type="button" class="km-banner"></button>');const an=$('.announcement');an?an.after(bn):document.body.prepend(bn);
let prev='';
function refresh(){const s=state(),t=left(),g=$('#kmGameBtn');
 bn.hidden=s==='used'||s==='dead';bn.classList.toggle('show',s!=='wait');bn.classList.toggle('won',s==='won');bn.classList.toggle('hot',s==='live'&&t<10000);bn.style.setProperty('--p',s==='live'?t/OFFER:0);
 bn.textContent=s==='won'?L('✦ СКИДКА 10% АКТИВНА — ПРИМЕНИТСЯ ПРИ ОФОРМЛЕНИИ ЗАКАЗА','✦ 10% OFF ACTIVE — APPLIED AT CHECKOUT'):s==='live'?L(`⚡ ПОТОРОПИСЬ! ИГРА С ИИ НА СКИДКУ 10% — ОСТАЛОСЬ ${fmt(t)} ↗`,`⚡ HURRY! CHESS VS AI FOR 10% OFF — ${fmt(t)} LEFT ↗`):L('♟ ПОБЕДИ ИИ В ШАХМАТЫ — СКИДКА 10% НА ЛЮБУЮ ВЕЩЬ ↗','♟ BEAT THE AI AT CHESS — 10% OFF ANY PIECE ↗');
 if(g){g.hidden=s==="dead";g.classList.toggle('live',s==='live');const sp=g.querySelector('span');if(sp)sp.textContent=s==='live'?fmt(t):L('ИГРА −10%','GAME −10%')}
 if(s==='dead'&&prev==='live'&&window.showToast)showToast(L('ВРЕМЯ ВЫШЛО — ПРЕДЛОЖЕНИЕ СГОРЕЛО. ВЕРНЁТСЯ ПРИ СЛЕДУЮЩЕМ ВИЗИТЕ','TIME IS UP — THE OFFER EXPIRED. IT RETURNS NEXT VISIT'));
 prev=s}
bn.onclick=()=>rw()==='won'?$('#shop').scrollIntoView({behavior:'smooth'}):openChess();
window.kmRewardRefresh=refresh;window.kmRewardUse=()=>setRw('used');
const begin=()=>{if(!O){O={start:Date.now()+DELAY};saveO()}refresh()};
if(rw()==='none'&&!O){const w=setInterval(()=>{if(!document.getElementById('kmPre')){clearInterval(w);begin()}},150);setTimeout(()=>{clearInterval(w);begin()},7000)}
setInterval(()=>{const s=state();if(s==='live'||s==='wait'||prev==='live')refresh()},250);

/* ---------- buttons ---------- */
const fa=$('.fun-actions');if(fa){const g=el(`<button type="button" id="kmGameBtn" aria-label="Chess"><b>♟</b> <span data-ru="ИГРА −10%" data-en="GAME −10%">ИГРА −10%</span></button>`);fa.prepend(g);g.onclick=()=>openChess()}
const wb=el('<button type="button" class="km-work" id="kmWorkBtn"><span data-ru="ХОД РАБОТЫ НАД ПРОЕКТОМ" data-en="PROJECT WORKFLOW">ХОД РАБОТЫ НАД ПРОЕКТОМ</span><i>↗</i></button>');
$('.site-footer')?.append(wb);wb.onclick=()=>openDeck();

/* ================= PRESENTATION ================= */
const A=(r,e)=>[r,e];
const SW=['#090909','#1a1a1a','#f5f5f2','#d7ff3f'];
const IM=u=>matchMedia('(max-width:760px)').matches?u.replace(/\.webp$/,'-sm.webp'):u;
const SL=[
 {k:A('МОЙ ХОД РАБОТЫ','HOW I MADE IT'),big:'KOTOMORY',t:A('Как я делал свой бренд и сайт','How I made my brand and website'),i:[A('Егор Розов, Хекслет колледж','Egor Rozov, Hexlet College'),A('Индивидуальный проект, 2026','Individual project, 2026')]},
 {k:A('01 / С ЧЕГО НАЧАЛ','01 / THE START'),t:A('Придумал бренд','I came up with a brand'),i:[A('Решил сделать свой бренд одежды — KOTOMORY','I decided to make my own clothing brand — KOTOMORY'),A('Вся одежда сделана вручную, по мотивам игры Dota 2','All the clothes are handmade, inspired by Dota 2'),A('Захотел сделать для бренда свой сайт, где можно выбрать вещь и оформить заказ','I wanted a website where you can pick a piece and place an order')]},
 {k:A('02 / ПЛАН','02 / THE PLAN'),t:A('Сначала написал ТЗ','First I wrote the brief'),i:[A('Расписал, что мне нужно: логотип, фирменный стиль, макеты сайта, сам магазин и продвижение','I listed what I needed: logo, style, website layouts, the store itself and promotion'),A('ТЗ стало моим планом — я шёл по нему шаг за шагом','The brief became my plan — I followed it step by step')]},
 {k:A('03 / РИСОВАЛ','03 / DRAWING'),t:A('Рисовал в Adobe Illustrator','Drawing in Adobe Illustrator'),ch:[A('Adobe Illustrator','Adobe Illustrator')],im:['assets/kotomory-logo.webp','assets/kotomory-hoodie-detail-board.webp','assets/kotomory-jeans-detail-board.webp'],i:[A('Всю одежду я нарисовал в Adobe Illustrator','I drew all the clothes in Adobe Illustrator'),A('Там же сделал логотип','I made the logo there too')]},
 {k:A('04 / МАКЕТЫ','04 / LAYOUTS'),t:A('Потом сделал макеты в Figma','Then I made layouts in Figma'),ch:[A('Figma','Figma')],i:[A('Придумал, как сайт будет выглядеть на компьютере и на телефоне','I planned how the site looks on desktop and on a phone'),A('Собрал кликабельный прототип — на нём можно нажимать и смотреть, как всё работает','I built a clickable prototype to see how everything works'),A('Сделал набор готовых кнопок и блоков (UI-kit), чтобы всё было в одном стиле','I made a set of ready buttons and blocks (UI kit) to keep one style')]},
 {k:A('05 / САЙТ','05 / THE SITE'),t:A('Собрал сам сайт','Then I built the site'),ch:[A('HTML','HTML'),A('CSS','CSS'),A('JavaScript','JavaScript'),A('ИИ-помощник Claude','AI helper Claude')],i:[A('Сайт сделан на HTML, CSS и JavaScript','The site is made with HTML, CSS and JavaScript'),A('Код мне помогал писать ИИ-помощник: я говорил, что хочу, смотрел результат и просил поменять','An AI helper wrote code with me: I said what I wanted, checked the result and asked for changes'),A('Следил, чтобы сайт одинаково хорошо работал на телефоне и на компьютере','I made sure it works well on both phone and desktop')]},
 {k:A('06 / ДОБАВЛЯЛ','06 / ADDED ALONG THE WAY'),t:A('Что добавлял по ходу','What I added along the way'),ch:[A('Анимации','Animations'),A('Таблицы размеров','Size charts'),A('Заказ в 3 шага','3-step checkout'),A('RU / EN','RU / EN'),A('Тёмная тема','Dark theme'),A('Шахматы со скидкой −10%','Chess for −10%'),A('Эта презентация','This presentation')],i:[A('Многое придумал уже в процессе, например мини-игру со скидкой и таймер «поторопись»','I came up with a lot while working, like the discount game and the “hurry” timer')]},
 {k:A('07 / ПЕРЕДЕЛЫВАЛ','07 / REDOING'),t:A('Что приходилось переделывать','What I had to redo'),i:[A('Оформление заказа мне не понравилось — переделали с нуля на 3 простых шага','I did not like the checkout, so we rebuilt it into 3 simple steps'),A('Лупа на фото сначала работала плохо — сделали новую','The photo magnifier worked badly at first, so we made a new one'),A('Кружок у курсора был слишком большой — уменьшили','The cursor ring was too big, so we made it smaller'),A('ИИ в шахматах был слишком сильным — сделали полегче','The chess AI was too strong, so we made it easier')]},
 {k:A('08 / ДАЛЬШЕ','08 / NEXT'),t:A('Как буду продвигать','How I will promote it'),ch:[A('Rutube','Rutube'),A('Pinterest','Pinterest'),A('ВКонтакте','VK')],i:[A('Rutube — видео про вещи и ткани','Rutube — videos about the pieces and fabrics'),A('Pinterest — подборки с образами','Pinterest — boards with looks'),A('ВКонтакте — витрина с товарами','VK — a product showcase')]},
 {k:A('09 / ИТОГ','09 / RESULT'),t:A('Что получилось','What I got'),i:[A('Свой бренд, логотип и одежда, нарисованная вручную','My own brand, logo and handmade, hand-drawn clothes'),A('Готовый магазин: каталог, корзина, заказ, размеры','A working store: catalog, cart, checkout, sizes'),A('Сайт нормально открывается и на телефоне, и на компьютере','The site opens fine on both phone and desktop')],cta:1}
];
let di=0,dd=1,dtx=0;
const deck=el(`<div class="pr-ov" hidden role="dialog" aria-modal="true"><div class="pr-top"><span class="pr-cnt"></span><button type="button" class="pr-x" aria-label="Close">✕</button></div><div class="pr-stage"></div><div class="pr-nav"><button type="button" class="pr-prev" aria-label="Prev">←</button><div class="pr-dots"></div><button type="button" class="pr-next" aria-label="Next">→</button></div><div class="pr-bar"><i></i></div></div>`);
document.body.append(deck);const st=deck.querySelector('.pr-stage');
function slide(){const s=SL[di],n=SL.length,f=a=>esc(L(a[0],a[1]));let h=`<article class="pr-slide ${dd>0?'r':'l'}" data-n="${String(di+1).padStart(2,'0')}"><p class="pr-k">${f(s.k)}</p>`;
 h+=s.big?`<h1 class="pr-big">${[...s.big].map((c,i)=>`<span style="--i:${i}">${c}</span>`).join('')}</h1><p class="pr-sub">${f(s.t)}</p>`:`<h2>${f(s.t)}</h2>`;
 if(s.sw)h+=`<div class="pr-sw">${SW.map((c,i)=>`<span style="background:${c};--i:${i}" title="${c}"></span>`).join('')}</div>`;
 if(s.st)h+=`<ol class="pr-steps">${s.st.map((a,i)=>`<li style="--i:${i}"><b>0${i+1}</b>${f(a)}</li>`).join('')}</ol>`;
 if(s.ch)h+=`<div class="pr-chips">${s.ch.map((a,i)=>`<span style="--i:${i}">${f(a)}</span>`).join('')}</div>`;
 if(s.im)h+=`<div class="pr-imgs">${s.im.map(u=>`<img src="${IM(u)}" alt="" loading="lazy" decoding="async">`).join('')}</div>`;
 if(s.i)h+=`<ul class="pr-list">${s.i.map((a,i)=>`<li style="--i:${i+2}">${f(a)}</li>`).join('')}</ul>`;
 if(s.cta)h+=`<div class="pr-cta"><button type="button" data-go="shop">${L('ОТКРЫТЬ МАГАЗИН ↗','OPEN THE STORE ↗')}</button><button type="button" data-go="game">${L('СЫГРАТЬ −10% ↗','PLAY FOR −10% ↗')}</button></div>`;
 st.innerHTML=h+'</article>';
 deck.querySelector('.pr-cnt').textContent=String(di+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');
 deck.querySelector('.pr-bar i').style.transform=`scaleX(${(di+1)/n})`;
 deck.querySelector('.pr-dots').innerHTML=SL.map((_,i)=>`<button type="button" data-d="${i}" class="${i===di?'on':''}" aria-label="${i+1}"></button>`).join('');
 deck.querySelector('.pr-prev').disabled=di===0;deck.querySelector('.pr-next').disabled=di===n-1}
const to=n=>{if(n<0||n>=SL.length||n===di)return;dd=n>di?1:-1;di=n;slide()};
function openDeck(){di=0;dd=1;slide();deck.hidden=false;lock(1);window.kmAch&&kmAch.unlock('deck')}
const closeDeck=()=>{deck.hidden=true;lock(0)};
deck.querySelector('.pr-x').onclick=closeDeck;deck.querySelector('.pr-prev').onclick=()=>to(di-1);deck.querySelector('.pr-next').onclick=()=>to(di+1);
deck.addEventListener('click',e=>{const d=e.target.closest('[data-d]'),g=e.target.closest('[data-go]');if(d)to(+d.dataset.d);if(g){closeDeck();if(g.dataset.go==='shop')$('#shop').scrollIntoView({behavior:'smooth'});else openChess()}});
deck.addEventListener('pointermove',e=>{deck.style.setProperty('--mx',e.clientX+'px');deck.style.setProperty('--my',e.clientY+'px')},{passive:true});
deck.addEventListener('touchstart',e=>dtx=e.changedTouches[0].clientX,{passive:true});
deck.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-dtx;if(Math.abs(dx)>50)to(di+(dx<0?1:-1))},{passive:true});

/* ================= CHESS ================= */
const V=[0,100,320,330,500,900,20000],KN=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]],KG=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],DG=[[-1,-1],[-1,1],[1,-1],[1,1]],OR=[[-1,0],[1,0],[0,-1],[0,1]];
const init=()=>{const b=new Int8Array(64),k=[4,2,3,5,6,3,2,4];for(let c=0;c<8;c++){b[c]=-k[c];b[8+c]=-1;b[48+c]=1;b[56+c]=k[c]}return{b,t:1,c:[1,1,1,1],ep:-1,hm:0}};
function att(b,sq,by){const r=sq>>3,c=sq&7,pr=r+(by===1?1:-1);
 if(pr>=0&&pr<8){if(c>0&&b[pr*8+c-1]===by)return true;if(c<7&&b[pr*8+c+1]===by)return true}
 for(const[d,e]of KN){const rr=r+d,cc=c+e;if(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===2*by)return true}
 for(const[d,e]of KG){const rr=r+d,cc=c+e;if(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===6*by)return true}
 for(const[d,e]of DG){let rr=r+d,cc=c+e;while(rr>=0&&rr<8&&cc>=0&&cc<8){const p=b[rr*8+cc];if(p){if(p===3*by||p===5*by)return true;break}rr+=d;cc+=e}}
 for(const[d,e]of OR){let rr=r+d,cc=c+e;while(rr>=0&&rr<8&&cc>=0&&cc<8){const p=b[rr*8+cc];if(p){if(p===4*by||p===5*by)return true;break}rr+=d;cc+=e}}
 return false}
function pseudo(s,q){const{b,t,c,ep}=s,out=[];
 for(let i=0;i<64;i++){const p=b[i];if(p*t<=0)continue;const a=Math.abs(p),r=i>>3,cc=i&7;
  if(a===1){const d=-t,r1=r+d;if(r1<0||r1>7)continue;const last=r1===(t===1?0:7)?5:0,P=(f,to)=>{if(last){for(const pr of q?[5]:[5,4,3,2])out.push({f,t:to,pr})}else out.push({f,t:to,pr:0})};
   if(!b[r1*8+cc]){P(i,r1*8+cc);if(r===(t===1?6:1)&&!b[(r+2*d)*8+cc])out.push({f:i,t:(r+2*d)*8+cc,pr:0})}
   for(const dc of[-1,1]){const c2=cc+dc;if(c2<0||c2>7)continue;const to=r1*8+c2;if(b[to]*t<0)P(i,to);else if(to===ep)out.push({f:i,t:to,pr:0,ep:1})}}
  else if(a===2||a===6){for(const[d,e]of a===2?KN:KG){const rr=r+d,c2=cc+e;if(rr<0||rr>7||c2<0||c2>7)continue;if(b[rr*8+c2]*t<=0)out.push({f:i,t:rr*8+c2,pr:0})}}
  else{for(const[d,e]of a===3?DG:a===4?OR:[...DG,...OR]){let rr=r+d,c2=cc+e;while(rr>=0&&rr<8&&c2>=0&&c2<8){const q=b[rr*8+c2];if(q*t>0)break;out.push({f:i,t:rr*8+c2,pr:0});if(q)break;rr+=d;c2+=e}}}}
 const h=t===1?60:4,k=t===1?0:2;
 if(b[h]===6*t&&!att(b,h,-t)){
  if(c[k]&&b[h+3]===4*t&&!b[h+1]&&!b[h+2]&&!att(b,h+1,-t)&&!att(b,h+2,-t))out.push({f:h,t:h+2,pr:0,ca:1});
  if(c[k+1]&&b[h-4]===4*t&&!b[h-1]&&!b[h-2]&&!b[h-3]&&!att(b,h-1,-t)&&!att(b,h-2,-t))out.push({f:h,t:h-2,pr:0,ca:-1})}
 return out}
function make(s,m){const b=Int8Array.from(s.b),t=s.t,o=s.b[m.f];b[m.f]=0;if(m.ep)b[(m.f>>3)*8+(m.t&7)]=0;b[m.t]=m.pr?m.pr*t:o;
 if(m.ca){if(m.ca>0){b[m.f+1]=b[m.f+3];b[m.f+3]=0}else{b[m.f-1]=b[m.f-4];b[m.f-4]=0}}
 const c=s.c.slice();if(Math.abs(o)===6){if(t===1)c[0]=c[1]=0;else c[2]=c[3]=0}
 for(const q of[m.f,m.t]){if(q===63)c[0]=0;if(q===56)c[1]=0;if(q===7)c[2]=0;if(q===0)c[3]=0}
 return{b,t:-t,c,ep:Math.abs(o)===1&&Math.abs(m.t-m.f)===16?(m.f+m.t)/2:-1,hm:(Math.abs(o)===1||s.b[m.t]||m.ep)?0:(s.hm||0)+1}}
const kp=(b,t)=>b.indexOf(6*t),legal=(s,q)=>pseudo(s,q).filter(m=>{const n=make(s,m);return!att(n.b,kp(n.b,s.t),-s.t)});
function ev(b){let s=0;for(let i=0;i<64;i++){const p=b[i];if(!p)continue;const a=Math.abs(p),sg=p>0?1:-1,r=i>>3,c=i&7,cen=7-Math.abs(r-3.5)-Math.abs(c-3.5);let v=V[a];
 if(a===1)v+=(sg===1?6-r:r-1)*8+(c>2&&c<5?cen*2:0);else if(a===2||a===3)v+=cen*7;else if(a===5)v+=cen*2;else if(a===6)v+=(sg===1?r===7:r===0)?10:-cen*4;
 s+=sg*v}return s}
const sc=(b,m)=>(b[m.t]?V[Math.abs(b[m.t])]*10-V[Math.abs(b[m.f])]:0)+(m.pr?800:0);
function nm(s,d,al,be){if(d===0)return ev(s.b)*s.t;const ms=pseudo(s,1);ms.sort((x,y)=>sc(s.b,y)-sc(s.b,x));let best=-1e9;
 for(const m of ms){if(Math.abs(s.b[m.t])===6)return 50000+d;const v=-nm(make(s,m),d-1,-be,-al);if(v>best)best=v;if(best>al)al=best;if(al>=be)break}return ms.length?best:0}
function aiPick(s){const ms=legal(s,1);if(!ms.length)return null;if(Math.random()<.08)return ms[Math.random()*ms.length|0];ms.sort((x,y)=>sc(s.b,y)-sc(s.b,x));let best=ms[0],bv=-1e9;for(const m of ms){const v=-nm(make(s,m),2,-1e9,1e9)+Math.random()*55;if(v>bv){bv=v;best=m}}return best}


function lowMat(b){const mi=[];let other=0;for(let i=0;i<64;i++){const a=Math.abs(b[i]);if(!a||a===6)continue;if(a===2||a===3)mi.push([a,((i>>3)+(i&7))&1]);else other++}if(other)return false;if(mi.length<=1)return true;return mi.every(x=>x[0]===3&&x[1]===mi[0][1])}
const key=s=>s.b.join(',')+'|'+s.t+s.c.join('');
const FL='abcdefgh';
function sanInfo(s,m){const o=s.b[m.f],a=Math.abs(o),cap=!!(s.b[m.t]||m.ep),sq=FL[m.t&7]+(8-(m.t>>3));if(m.ca)return{ca:m.ca};let pre='';
 if(a===1){if(cap)pre=FL[m.f&7]+'x'}else{const o2=legal(s).filter(x=>x.t===m.t&&x.f!==m.f&&Math.abs(s.b[x.f])===a);if(o2.length){pre=o2.some(x=>(x.f&7)===(m.f&7))?(o2.some(x=>(x.f>>3)===(m.f>>3))?FL[m.f&7]+(8-(m.f>>3)):String(8-(m.f>>3))):FL[m.f&7]}if(cap)pre+='x'}
 return{p:a,pre,sq,pr:m.pr}}
const LET={ru:{6:'Кр',5:'Ф',4:'Л',3:'С',2:'К'},en:{6:'K',5:'Q',4:'R',3:'B',2:'N'}};
const fmtSan=h=>{const T=LET[lang==='ru'?'ru':'en'];if(h.ca)return(h.ca>0?'O-O':'O-O-O')+h.sfx;return(h.p===1?'':T[h.p])+h.pre+h.sq+(h.pr?'='+T[h.pr]:'')+h.sfx};
const GL=['','♟\uFE0E','♞\uFE0E','♝\uFE0E','♜\uFE0E','♛\uFE0E','♚\uFE0E'];
let G=null;
window.kmChess={init,legal,make,pseudo,att,aiPick,key,lowMat,sanInfo,game:()=>G,end:()=>end()};
const cb=el(`<div class="cb-ov" hidden role="dialog" aria-modal="true"><div class="cb-box"><button type="button" class="cb-x" aria-label="Close">✕</button><p class="eyebrow">KOTOMORY / GAME</p><h2 class="cb-h"></h2><p class="cb-sub"></p><div class="cb-cap" data-s="top"></div><div class="cb-board"></div><div class="cb-cap" data-s="bot"></div><div class="cb-moves"></div><p class="cb-status" aria-live="polite"></p><div class="cb-btns"><button type="button" class="cb-new"></button><button type="button" class="cb-resign"></button><button type="button" class="cb-close"></button></div><div class="cb-promo" hidden></div><div class="cb-res" hidden></div><div class="cb-flash"></div></div></div>`);
document.body.append(cb);const mvEl=cb.querySelector('.cb-moves'),capTop=cb.querySelector('.cb-cap[data-s=top]'),capBot=cb.querySelector('.cb-cap[data-s=bot]'),pr=cb.querySelector('.cb-promo'),bd=cb.querySelector('.cb-board'),stt=cb.querySelector('.cb-status'),res=cb.querySelector('.cb-res');
for(let i=0;i<64;i++){const q=document.createElement('div');q.dataset.i=i;q.innerHTML='<span></span>'+((i>>3)===7?`<em class="cf">${FL[i&7]}</em>`:'')+((i&7)===0?`<em class="cr">${8-(i>>3)}</em>`:'');bd.append(q)}
const sqs=[...bd.children];
function texts(){cb.querySelector('.cb-h').textContent=L('ШАХМАТЫ С ИИ','CHESS VS AI');
 cb.querySelector('.cb-sub').textContent=rw()==='used'?L('Награда уже использована, но играть можно сколько угодно.','Reward already used, but you can still play for fun.'):rw()==='won'?L('Скидка 10% уже активна. Играй ради удовольствия.','10% discount is already active. Play for fun.'):L('Ты играешь белыми. Победа над ИИ (средний уровень) = скидка 10% на любую вещь, один раз.','You play white. Beat the AI (medium level) = 10% off any piece, once.');
 cb.querySelector('.cb-new').textContent=L('НОВАЯ ИГРА','NEW GAME');cb.querySelector('.cb-resign').textContent=L('СДАТЬСЯ','RESIGN');cb.querySelector('.cb-close').textContent=L('ЗАКРЫТЬ','CLOSE')}
function status(){if(!G)return;const k=G.over;stt.classList.toggle('think',!!(G&&G.think&&!k));stt.textContent=k==='win'?L('МАТ — ТЫ ПОБЕДИЛ ✦','CHECKMATE — YOU WIN ✦'):k==='lose'?(G.reason==='resign'?L('ТЫ СДАЛСЯ','YOU RESIGNED'):L('МАТ — ПОБЕДИЛ ИИ','CHECKMATE — AI WINS')):k==='draw'?drawTxt():G.think?L('ИИ ДУМАЕТ…','AI IS THINKING…'):G.chk?L('ШАХ! ТВОЙ ХОД','CHECK! YOUR MOVE'):L('ТВОЙ ХОД (БЕЛЫЕ)','YOUR MOVE (WHITE)')}
const drawTxt=()=>({stale:L('ПАТ — НИЧЬЯ','STALEMATE — DRAW'),rep:L('НИЧЬЯ: ТРОЕКРАТНОЕ ПОВТОРЕНИЕ','DRAW: THREEFOLD REPETITION'),fifty:L('НИЧЬЯ: ПРАВИЛО 50 ХОДОВ','DRAW: 50-MOVE RULE'),mat:L('НИЧЬЯ: МАЛО ФИГУР ДЛЯ МАТА','DRAW: NOT ENOUGH MATERIAL')}[G.reason]||L('НИЧЬЯ','DRAW'));
const INITC=[0,8,2,2,2,1],VAL=[0,1,3,3,5,9],GS=['','♟\uFE0E','♞\uFE0E','♝\uFE0E','♜\uFE0E','♛\uFE0E'];
function caps(){if(!G)return;const w=[0,0,0,0,0,0],bl=[0,0,0,0,0,0];G.s.b.forEach(p=>{if(p>0&&p<6)w[p]++;else if(p<0&&p>-6)bl[-p]++});let sw=0,sb=0,tw='',tb='';
 for(let t=5;t>=1;t--){const mw=Math.max(0,INITC[t]-w[t]),mb=Math.max(0,INITC[t]-bl[t]);tw+=GS[t].repeat(mw);tb+=GS[t].repeat(mb);sw+=mw*VAL[t];sb+=mb*VAL[t]}
 const d=sb-sw;capTop.innerHTML=`<span class="pcs w">${tw}</span>${d<0?`<b>+${-d}</b>`:''}`;capBot.innerHTML=`<span class="pcs b">${tb}</span>${d>0?`<b>+${d}</b>`:''}`}
function moves(){if(!G)return;let h='';G.hist.forEach((m,i)=>{if(i%2===0)h+=`<b>${i/2+1}.</b>`;h+=`<span>${fmtSan(m)}</span>`});mvEl.innerHTML=h||`<i>${L('Здесь будет запись ходов','Moves will appear here')}</i>`;mvEl.scrollLeft=mvEl.scrollWidth}
function draw(){const sel=G.sel,tg=new Map();if(sel>=0)G.lm.filter(m=>m.f===sel).forEach(m=>tg.set(m.t,1));const ck=G.chk?kp(G.s.b,G.s.t):-1;
 sqs.forEach((q,i)=>{const p=G.s.b[i],r=i>>3,c=i&7;q.className='cb-sq '+((r+c)%2?'d':'l')+(p?(p>0?' w':' b'):'')+(i===sel?' sel':'')+(tg.has(i)?(p?' cap':' tgt'):'')+(G.last&&(i===G.last[0]||i===G.last[1])?' last':'')+(i===ck?' chk':'');q.firstChild.textContent=p?GL[Math.abs(p)]:''});status();caps();moves()}
function judge(){const lm=legal(G.s),chk=att(G.s.b,kp(G.s.b,G.s.t),-G.s.t);G.lm=lm;G.chk=chk;G.over=null;G.reason='';G.ply++;
 const k=key(G.s);G.keys[k]=(G.keys[k]||0)+1;
 if(!lm.length){G.over=chk?(G.s.t===-1?'win':'lose'):'draw';G.reason=chk?'mate':'stale'}
 else if(lowMat(G.s.b)){G.over='draw';G.reason='mat'}
 else if(G.keys[k]>=3){G.over='draw';G.reason='rep'}
 else if(G.s.hm>=100||G.ply>400){G.over='draw';G.reason='fifty'}}
const RMo=matchMedia('(prefers-reduced-motion:reduce)').matches;
function apply(m){const cap=G.s.b[m.t]||m.ep,info=sanInfo(G.s,m);G.s=make(G.s,m);G.last=[m.f,m.t];G.sel=-1;judge();info.sfx=G.over==='win'||G.over==='lose'&&G.reason==='mate'?'#':G.chk?'+':'';G.hist.push(info);draw();const q=sqs[m.t],sp=q.firstChild;
 if(!RMo&&sp.animate){const a=sqs[m.f].getBoundingClientRect(),z=q.getBoundingClientRect();sp.style.zIndex=6;sp.animate([{transform:`translate(${a.left-z.left}px,${a.top-z.top}px) scale(1.18)`},{transform:'none'}],{duration:300,easing:'cubic-bezier(.2,.75,.25,1)'}).onfinish=()=>sp.style.zIndex='';
  if(cap)q.classList.add('boom');if(G.chk)sqs[kp(G.s.b,G.s.t)].classList.add('chk-pulse')}
 if(G.over)end()}
function aiTurn(){G.think=true;draw();setTimeout(()=>{if(!G||!cb||cb.hidden)return;const m=aiPick(G.s);G.think=false;if(m)apply(m)},380)}
function end(){const k=G.over;let h='';const bx=cb.querySelector('.cb-box');bx.classList.remove('fx-win','fx-lose');void bx.offsetWidth;
 if(k==='win'){window.kmAch&&kmAch.unlock('win');bx.classList.add('fx-win');window.kmConfetti&&kmConfetti(160);const w=kp(G.s.b,-1);if(w>=0)sqs[w].classList.add('kw')}else if(k==='lose'){bx.classList.add('fx-lose');const l=kp(G.s.b,1);if(l>=0)sqs[l].classList.add('kl')}
 if(k==='win'){const s=rw();if(s==='none'){setRw('won');h=`<div class="cb-stamp">−10%</div><h3>${L('ПОБЕДА ✦','VICTORY ✦')}</h3><p>${L('Скидка 10% на любую вещь активна. Она применится автоматически при оформлении заказа — один раз.','10% off any piece is active. It applies automatically at checkout — once.')}</p><button type="button" data-a="shop">${L('К ПОКУПКАМ ↗','SHOP NOW ↗')}</button>`}
  else h=`<h3>${L('ПОБЕДА ✦','VICTORY ✦')}</h3><p>${s==='won'?L('Скидка уже активна.','Your discount is already active.'):L('Скидка по этой награде уже использована.','The reward has already been used.')}</p>`}
 else if(k==='lose')h=`<h3>${L('ИИ ВЫИГРАЛ','AI WON')}</h3><p>${rw()==='none'?L('Попробуй ещё раз — скидка ждёт.','Try again — the discount is waiting.'):L('Ничего страшного, сыграй ещё раз.','No worries, play again.')}</p>`;
 else h=`<h3>${L('НИЧЬЯ','DRAW')}</h3><p>${drawTxt()}. ${L('Попробуй ещё раз.','Try again.')}</p>`;
 res.innerHTML=h+`<button type="button" data-a="new" class="alt">${L('ИГРАТЬ ЕЩЁ','PLAY AGAIN')}</button>`;setTimeout(()=>{res.hidden=false},k==='win'?500:300)}
function newGame(){cb.querySelector('.cb-box').classList.remove('fx-win','fx-lose');G={s:init(),sel:-1,lm:[],last:null,chk:false,over:null,think:false,ply:0,keys:{},hist:[],reason:''};G.keys[key(G.s)]=1;G.lm=legal(G.s);pr.hidden=true;res.hidden=true;texts();draw();
 if(!RMo)sqs.forEach((q,i)=>{const sp=q.firstChild;if(sp.textContent&&sp.animate)sp.animate([{opacity:0,transform:'translateY(-16px) scale(.5)'},{opacity:1,transform:'none'}],{duration:450,delay:(i>>3)*45+(i&7)*16,easing:'cubic-bezier(.2,.75,.25,1)',fill:'backwards'})})}
function openChess(){const s=state();if(s==='dead'){window.showToast&&showToast(L('ВРЕМЯ ВЫШЛО — ПРЕДЛОЖЕНИЕ ВЕРНЁТСЯ ПРИ СЛЕДУЮЩЕМ ВИЗИТЕ','TIME IS UP — THE OFFER RETURNS NEXT VISIT'));return}if(s==='live'||s==='wait'){if(!O)begin();O.claimed=true;saveO();refresh()}if(!G||G.over)newGame();else texts();cb.hidden=false;lock(1);draw()}
const closeChess=()=>{cb.hidden=true;lock(0)};window.openChess=openChess;
bd.addEventListener('click',e=>{const q=e.target.closest('.cb-sq');if(!q||!G||G.over||G.think||G.s.t!==1)return;const i=+q.dataset.i,ms=G.lm.filter(m=>m.f===G.sel&&m.t===i),m=ms[0];
 if(ms.length>1){askPromo(ms)}else if(m){apply(m);window.kmAch&&kmAch.unlock('move');if(!G.over)aiTurn()}else if(G.s.b[i]>0){G.sel=i===G.sel?-1:i;draw()}else{G.sel=-1;draw()}});
function askPromo(ms){pr.innerHTML=`<p>${L('Во что превратить пешку?','Promote the pawn to:')}</p><div>${[5,4,3,2].map(t=>`<button type="button" data-pr="${t}">${GL[t]}</button>`).join('')}</div>`;pr.hidden=false;pr._ms=ms}
pr.addEventListener('click',e=>{const b=e.target.closest('[data-pr]');if(b){const m=pr._ms.find(x=>x.pr===+b.dataset.pr);pr.hidden=true;apply(m);window.kmAch&&kmAch.unlock('move');if(!G.over)aiTurn()}else if(e.target===pr){pr.hidden=true}});
let rsT=null;const rb=cb.querySelector('.cb-resign');
rb.onclick=()=>{if(!G||G.over||G.think)return;if(!rb._c){rb._c=1;rb.textContent=L('ТОЧНО?','SURE?');rsT=setTimeout(()=>{rb._c=0;rb.textContent=L('СДАТЬСЯ','RESIGN')},2500);return}clearTimeout(rsT);rb._c=0;rb.textContent=L('СДАТЬСЯ','RESIGN');G.over='lose';G.reason='resign';draw();end()};
cb.querySelector('.cb-x').onclick=cb.querySelector('.cb-close').onclick=closeChess;cb.querySelector('.cb-new').onclick=newGame;
res.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='new')newGame();else{closeChess();$('#shop').scrollIntoView({behavior:'smooth'})}});
cb.addEventListener('click',e=>{if(e.target===cb)closeChess()});

document.addEventListener('keydown',e=>{if(!deck.hidden){if(e.key==='Escape')closeDeck();if(e.key==='ArrowRight')to(di+1);if(e.key==='ArrowLeft')to(di-1)}else if(!cb.hidden&&e.key==='Escape')closeChess()});
$('#langToggle')?.addEventListener('click',()=>{refresh();if(!deck.hidden)slide();if(!cb.hidden){texts();if(G)status();if(!res.hidden)end()}});
refresh();
})();
