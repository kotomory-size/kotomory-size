/* KOTOMORY more: achievements (with sound + badges), "how it's made" mode, size finder, support chat, mobile dock */
(()=>{
const L=(r,e)=>lang==='ru'?r:e,el=h=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const rd=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}},wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const copy=async t=>{try{await navigator.clipboard.writeText(t);return 1}catch(_){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();let ok=0;try{ok=document.execCommand('copy')}catch(_){}a.remove();return ok}};
const fa=$('.fun-actions');

/* ================= ACHIEVEMENTS ================= */
const AC=[
 {id:'visit',ic:'✳',r:0,t:['Добро пожаловать','Welcome'],d:['Зашёл в KOTOMORY','Entered KOTOMORY']},
 {id:'cart',ic:'◉',r:0,t:['В корзину!','Into the bag!'],d:['Добавил первую вещь в корзину','Added your first piece to the bag']},
 {id:'fav',ic:'♡',r:0,t:['С первого взгляда','Love at first sight'],d:['Добавил вещь в избранное','Added a piece to favorites']},
 {id:'view5',ic:'◎',r:0,t:['Коллекционер','Collector'],d:['Открыл 5 разных вещей','Opened 5 different pieces']},
 {id:'theme',ic:'◐',r:0,t:['Тёмная сторона','The dark side'],d:['Переключил тему сайта','Switched the site theme']},
 {id:'lang',ic:'⇄',r:0,t:['Полиглот','Polyglot'],d:['Переключил язык','Switched the language']},
 {id:'chat',ic:'✉',r:0,t:['На связи','In touch'],d:['Открыл чат поддержки','Opened the support chat']},
 {id:'move',ic:'♟',r:0,t:['Первый ход','First move'],d:['Сделал ход в шахматах','Made a chess move']},
 {id:'size',ic:'⌖',r:1,t:['Точно в размер','A perfect fit'],d:['Подобрал размер по росту и весу','Found a size by height and weight']},
 {id:'deck',ic:'▤',r:1,t:['Закулисье','Behind the scenes'],d:['Посмотрел ход работы над проектом','Watched the project workflow']},
 {id:'maker',ic:'✎',r:1,t:['Как это сделано','How it is made'],d:['Включил режим «как это сделано»','Turned on the “how it is made” mode']},
 {id:'win',ic:'♚',r:2,t:['Победил ИИ','Beat the AI'],d:['Поставил мат ИИ в шахматах','Checkmated the AI at chess']},
 {id:'purchase',ic:'✦',r:2,t:['Первая покупка','First purchase'],d:['Оформил первый заказ','Placed your first order']},
 {id:'plat',ic:'★',r:3,t:['Платина','Platinum'],d:['Открыл все достижения','Unlocked every achievement']}
];
const RN=[['ОБЫЧНОЕ','COMMON'],['РЕДКОЕ','RARE'],['ЭПИЧЕСКОЕ','EPIC'],['ЛЕГЕНДАРНОЕ','LEGENDARY']];
let S=rd('kotomory-ach',{u:{},mute:0,v:[]});if(!S.u)S={u:{},mute:0,v:[]};if(!S.v)S.v=[];
const save=()=>wr('kotomory-ach',S);
let ac=null;
function chime(r){if(S.mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const t0=ac.currentTime,N=[[523.25,0],[659.25,.11],[783.99,.22],[1046.5,.34],[1318.5,.46]].slice(0,2+r+(r>2?1:0));
 N.forEach(([f,d])=>{const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0,t0+d);g.gain.linearRampToValueAtTime(.15,t0+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d+.55);o.connect(g);g.connect(ac.destination);o.start(t0+d);o.stop(t0+d+.6)})}catch(_){}}
const Q=[];let busy=false;
function nextToast(){const a=Q.shift();if(!a){busy=false;return}busy=true;
 const t=el(`<div class="ka-toast r${a.r}" role="status"><i>${a.ic}</i><div><small>${L('ДОСТИЖЕНИЕ ОТКРЫТО','ACHIEVEMENT UNLOCKED')} · ${L(...RN[a.r])}</small><b>${L(...a.t)}</b><span>${L(...a.d)}</span></div></div>`);
 document.body.append(t);chime(a.r);requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('in')));
 t.onclick=()=>openPanel();setTimeout(()=>{t.classList.remove('in');setTimeout(()=>{t.remove();nextToast()},500)},4300)}
function unlock(id){if(S.u[id])return;const a=AC.find(x=>x.id===id);if(!a)return;S.u[id]=Date.now();save();Q.push(a);if(!busy)nextToast();paint();
 if(id!=='plat'&&AC.filter(x=>x.id!=='plat').every(x=>S.u[x.id]))setTimeout(()=>unlock('plat'),1200)}
window.kmAch={unlock,list:()=>S.u};

const panel=el(`<div class="ka-ov" hidden role="dialog" aria-modal="true"><div class="ka-box"><button type="button" class="ka-x" aria-label="Close">✕</button><p class="eyebrow">KOTOMORY / ACHIEVEMENTS</p><h2></h2><div class="ka-prog"><i></i></div><p class="ka-cnt"></p><div class="ka-list"></div><button type="button" class="ka-snd"></button></div></div>`);
document.body.append(panel);
const list=panel.querySelector('.ka-list');
function paintPanel(){const n=AC.filter(a=>S.u[a.id]).length;panel.querySelector('h2').textContent=L('ДОСТИЖЕНИЯ','ACHIEVEMENTS');panel.querySelector('.ka-prog i').style.transform=`scaleX(${n/AC.length})`;
 panel.querySelector('.ka-cnt').textContent=`${n} / ${AC.length}`;panel.querySelector('.ka-snd').textContent=S.mute?L('ЗВУК: ВЫКЛ','SOUND: OFF'):L('ЗВУК: ВКЛ','SOUND: ON');
 list.innerHTML=AC.map(a=>{const u=S.u[a.id];return `<div class="ka-row r${a.r}${u?' on':''}"><i>${u?a.ic:'?'}</i><div><b>${u||a.id==='plat'?L(...a.t):L('Скрытое достижение','Hidden achievement')}</b><span>${L(...a.d)}</span><small>${L(...RN[a.r])}${u?' · '+new Date(u).toLocaleDateString(lang==='ru'?'ru-RU':'en-GB'):''}</small></div></div>`}).join('')}
function openPanel(){paintPanel();panel.hidden=false}
panel.querySelector('.ka-x').onclick=()=>panel.hidden=true;panel.addEventListener('click',e=>{if(e.target===panel)panel.hidden=true});
panel.querySelector('.ka-snd').onclick=()=>{S.mute=S.mute?0:1;save();paintPanel();if(!S.mute)chime(1)};
const badges=el('<div class="ka-badges" aria-label="Achievements"></div>');
const foot=$('.site-footer');if(foot)foot.insertBefore(badges,$('#kmWorkBtn')||null);
const wm=$('.wordmark'),mark=el('<sup class="ka-mark"></sup>');wm&&wm.append(mark);
const trophy=el('<button type="button" id="kaBtn" aria-label="Achievements"><b>🏆︎</b> <span>0/0</span></button>');
function paint(){const n=AC.filter(a=>S.u[a.id]).length;trophy.querySelector('span').textContent=`${n}/${AC.length}`;
 badges.innerHTML=`<p>${L('ТВОИ ЗНАЧКИ','YOUR BADGES')} · ${n}/${AC.length}</p><div>${AC.map(a=>`<span class="ka-b r${a.r}${S.u[a.id]?' on':''}" title="${S.u[a.id]?esc(L(...a.t)):'?'}">${S.u[a.id]?a.ic:'·'}</span>`).join('')}</div>`;
 mark.textContent=AC.filter(a=>S.u[a.id]&&a.r>=2).map(a=>a.ic).join('');if(!panel.hidden)paintPanel()}

/* event hooks */
addEventListener('pointerdown',()=>unlock('visit'),{once:true,passive:true});
const _add=window.addToCart;window.addToCart=function(){const r=_add.apply(this,arguments);unlock('cart');return r};
document.addEventListener('click',e=>{const f=e.target.closest('[data-favorite]');if(f){const id=f.dataset.favorite;setTimeout(()=>{const b=document.querySelector(`[data-favorite="${id}"]`);if(b&&b.classList.contains('is-favorite'))unlock('fav')},120)}},true);
const _opd=window.openProductDetail;window.openProductDetail=function(id){const r=_opd.apply(this,arguments);if(!S.v.includes(id)){S.v.push(id);save();if(S.v.length>=5)unlock('view5')}return r};
const _tt=window.toggleTheme;window.toggleTheme=function(){const r=_tt.apply(this,arguments);unlock('theme');return r};
['#themeToggle','#mobileTheme'].forEach(s=>$(s)?.addEventListener('click',()=>unlock('theme')));
$('#langToggle')?.addEventListener('click',()=>{unlock('lang');paint()});

/* ================= "HOW IT'S MADE" MODE ================= */
const HI=[
 {s:'.wordmark',t:['Логотип','Logo'],d:['Нарисован в Adobe Illustrator.','Drawn in Adobe Illustrator.'],c:['Illustrator']},
 {s:'.hero',t:['Главный экран','Hero screen'],d:['Макет сделан в Figma — отдельно для ПК и для телефона. Вёрстка на HTML и CSS, появление текста и параллакс на JavaScript.','Layout designed in Figma, separately for desktop and phone. Built with HTML and CSS; text reveal and parallax in JavaScript.'],c:['Figma','HTML','CSS','JS']},
 {s:'.ticker',t:['Бегущая строка','Ticker'],d:['Чистый CSS. При прокрутке страницы JavaScript её ускоряет.','Pure CSS. JavaScript speeds it up while you scroll.'],c:['CSS','JS']},
 {s:'.filters',t:['Фильтры и поиск','Filters and search'],d:['JavaScript: список вещей фильтруется и сортируется сразу, без перезагрузки страницы.','JavaScript: the list is filtered and sorted instantly, without reloading.'],c:['JS']},
 {s:'.product-card .product-visual',t:['Одежда','The clothes'],d:['Все вещи нарисованы в Adobe Illustrator. Одежда создана вручную по мотивам игры Dota 2.','Every piece is drawn in Adobe Illustrator. The clothes are handmade, inspired by Dota 2.'],c:['Illustrator']},
 {s:'.product-card .favorite-toggle',t:['Избранное','Favorites'],d:['Сердечко запоминается в браузере (localStorage), а при нажатии разлетаются частицы.','Hearts are saved in the browser (localStorage) and burst into particles on click.'],c:['JS','localStorage']},
 {s:'#cartToggle,#mobileCart',t:['Корзина и заказ','Cart and checkout'],d:['JavaScript: корзина, промокод и заказ в 3 шага с проверкой полей. Данные остаются в твоём браузере.','JavaScript: cart, promo code and a 3-step checkout with validation. Data stays in your browser.'],c:['JS','localStorage']},
 {s:'#themeToggle,#mobileTheme',t:['Тёмная и светлая тема','Dark and light theme'],d:['Цвета заданы CSS-переменными и меняются одним переключателем. Переход идёт кругом от места нажатия.','Colors are CSS variables switched in one go. The change spreads as a circle from your click.'],c:['CSS','JS']},
 {s:'#kmGameBtn',t:['Шахматы с ИИ','Chess vs AI'],d:['Собственный шахматный движок на JavaScript: все правила, шах и мат, превращение пешки. ИИ просчитывает ходы вперёд.','A custom JavaScript chess engine: all rules, check and mate, promotion. The AI looks several moves ahead.'],c:['JS']},
 {s:'.about',t:['О бренде','About the brand'],d:['Текст и подача — по моему ТЗ. Блоки появляются при прокрутке (IntersectionObserver).','Copy and layout follow my brief. Blocks appear on scroll (IntersectionObserver).'],c:['HTML','CSS','JS']},
 {s:'.km-stats',t:['Цифры и таймер','Numbers and timer'],d:['Числа считаются на JavaScript. Таймер следующего дропа считает секунды до даты, которую я задаю в коде.','Numbers are counted in JavaScript. The next-drop timer counts down to a date set in code.'],c:['JS']},
 {s:'.site-footer',t:['Подвал','Footer'],d:['Контакты, значки достижений и кнопка «Ход работы» с презентацией проекта.','Contacts, achievement badges and the “Project workflow” button with the presentation.'],c:['HTML','JS']}
];
const layer=el('<div class="kh-layer" hidden></div>'),card=el('<div class="kh-card" hidden></div>'),pill=el('<div class="kh-pill" hidden></div>');
document.body.append(layer,card,pill);
let KH=false,items=[],cur=-1;
const vis=r=>r.width>4&&r.height>4;
function scan(){layer.innerHTML='';items=[];let n=0;HI.forEach(h=>{const t=[...document.querySelectorAll(h.s)].find(x=>vis(x.getBoundingClientRect()));if(!t)return;n++;const m=el(`<button type="button" class="kh-m">${n}</button>`);m.onclick=e=>{e.stopPropagation();pick(items.findIndex(i=>i.m===m))};layer.append(m);items.push({h,t,m})});place()}
function place(){if(!KH)return;items.forEach(i=>{const r=i.t.getBoundingClientRect(),on=r.bottom>60&&r.top<innerHeight-60&&r.width>4;i.m.style.opacity=on?1:0;i.m.style.pointerEvents=on?'auto':'none';i.m.style.transform=`translate(${clamp(r.left+10,6,innerWidth-40)}px,${clamp(r.top+10,64,innerHeight-110)}px)`})}
function pick(k){items.forEach(i=>i.t.classList.remove('kh-hl'));items.forEach(i=>i.m.classList.remove('on'));if(k<0)return;cur=k;const i=items[k];i.t.classList.add('kh-hl');i.m.classList.add('on');
 card.innerHTML=`<button type="button" class="kh-cl" aria-label="Close">✕</button><small>${k+1} / ${items.length}</small><b>${esc(L(...i.h.t))}</b><p>${esc(L(...i.h.d))}</p><div>${i.h.c.map(c=>`<span>${c}</span>`).join('')}</div><nav><button type="button" data-d="-1">←</button><button type="button" data-d="1">→</button></nav>`;card.hidden=false;
 const r=i.t.getBoundingClientRect();if(r.top<70||r.bottom>innerHeight-200)i.t.scrollIntoView({behavior:'smooth',block:'center'})}
card.addEventListener('click',e=>{if(e.target.closest('.kh-cl')){card.hidden=true;items.forEach(i=>{i.t.classList.remove('kh-hl');i.m.classList.remove('on')})}const d=e.target.closest('[data-d]');if(d)pick((cur+ +d.dataset.d+items.length)%items.length)});
function setKH(on){KH=on;fa&&fa.classList.remove('open');layer.hidden=pill.hidden=!on;card.hidden=true;document.body.classList.toggle('kh-mode',on);btnKH.classList.toggle('on',on);
 if(on){pill.innerHTML=`<span>${L('РЕЖИМ «КАК ЭТО СДЕЛАНО»','“HOW IT IS MADE” MODE')}</span><button type="button">${L('ВЫКЛЮЧИТЬ','TURN OFF')}</button>`;pill.querySelector('button').onclick=()=>setKH(false);scan();unlock('maker')}else{items.forEach(i=>i.t.classList.remove('kh-hl'));layer.innerHTML='';items=[]}}
const btnKH=el('<button type="button" id="khBtn" aria-label="How it is made"><b>✎</b> <span data-ru="КАК СДЕЛАНО" data-en="HOW IT IS MADE">КАК СДЕЛАНО</span></button>');
btnKH.onclick=()=>setKH(!KH);
let tk=0;const loop=()=>{if(KH){place();tk++;if(tk%30===0)scan()}requestAnimationFrame(loop)};requestAnimationFrame(loop);
$('#langToggle')?.addEventListener('click',()=>{if(KH)setKH(true)});

/* ================= SIZE FINDER ================= */
const SKm={9:'tee',10:'jeans',11:'hoodie',12:'jacket',13:'bag',14:'hoodie',15:'gloves',16:'ring',17:'bracelet',18:'jacket'},SN=['S','M','L','XL'];
const sf=el(`<div class="sf-ov" hidden role="dialog" aria-modal="true"><div class="sf-box"><button class="sf-x" type="button" aria-label="Close">✕</button><p class="eyebrow">KOTOMORY / SIZE</p><h2></h2><p class="sf-sub"></p><div class="sf-row"><label><span class="sf-lh"></span><input id="sfH" type="number" inputmode="numeric" min="140" max="220" placeholder="178"></label><label><span class="sf-lw"></span><input id="sfW" type="number" inputmode="numeric" min="35" max="200" placeholder="72"></label></div><div class="sf-fit"></div><button type="button" class="sf-go"></button><div class="sf-res" hidden></div></div></div>`);
document.body.append(sf);let fit=0;const sH=sf.querySelector('#sfH'),sW=sf.querySelector('#sfW'),res=sf.querySelector('.sf-res');
const saved=rd('kotomory-body',{});if(saved.h)sH.value=saved.h;if(saved.w)sW.value=saved.w;
function sfTexts(){sf.querySelector('h2').textContent=L('ПОДБОР РАЗМЕРА','FIND YOUR SIZE');sf.querySelector('.sf-sub').textContent=L('Введи рост и вес — подскажем размер для этой вещи. Это ориентир: смотри и таблицу замеров.','Enter your height and weight — we will suggest a size for this piece. It is a guide: check the measurement table too.');
 sf.querySelector('.sf-lh').textContent=L('РОСТ, СМ','HEIGHT, CM');sf.querySelector('.sf-lw').textContent=L('ВЕС, КГ','WEIGHT, KG');sf.querySelector('.sf-go').textContent=L('ПОДОБРАТЬ ↗','FIND ↗');
 sf.querySelector('.sf-fit').innerHTML=[[-1,'Плотнее','Slimmer'],[0,'Как на фото','As shown'],[1,'Свободнее','Looser']].map(([v,r,e])=>`<button type="button" data-f="${v}" class="${v===fit?'on':''}">${L(r,e)}</button>`).join('')}
function ctx(){const dm=document.getElementById('productDetailModal');if(dm&&dm.classList.contains('open'))return{id:detailProductId,box:document.getElementById('kmSzD'),pick:s=>{const b=document.querySelector(`[data-detail-size="${s}"]`);b&&b.click()}};
 const sm=document.getElementById('sizeModal');if(sm&&sm.classList.contains('open')&&pendingProduct)return{id:pendingProduct.id,box:document.getElementById('kmSzS'),pick:s=>{const b=document.querySelector(`[data-size="${s}"]`);b&&b.click()}};return null}
let C0=null;
document.addEventListener('click',e=>{if(e.target.closest('.sf-open')){C0=ctx();sfTexts();res.hidden=true;sf.hidden=false}});
sf.querySelector('.sf-x').onclick=()=>sf.hidden=true;sf.addEventListener('click',e=>{if(e.target===sf)sf.hidden=true;const f=e.target.closest('[data-f]');if(f){fit=+f.dataset.f;sfTexts()}});
sf.querySelector('.sf-go').onclick=()=>{const h=+sH.value,w=+sW.value,c=C0||ctx();if(!(h>=140&&h<=220)||!(w>=35&&w<=200)){res.innerHTML=`<p class="bad">${L('Проверь рост (140–220 см) и вес (35–200 кг).','Check height (140–220 cm) and weight (35–200 kg).')}</p>`;res.hidden=false;return}
 wr('kotomory-body',{h,w});const kind=c?SKm[c.id]:'tee';
 if(!['tee','hoodie','jacket','jeans'].includes(kind)){res.innerHTML=`<p>${kind==='bag'?L('Сумка одного размера — подбирать ничего не нужно.','The bag is one size — nothing to choose.'):L('У этой вещи размер зависит от обхвата (ладони, пальца или запястья), а не от роста и веса. Смотри таблицу размеров.','This piece is sized by girth (hand, finger or wrist), not height and weight. See the size chart.')}</p>`;res.hidden=false;return}
 let idx,note='';
 if(kind==='jeans'){const waist=.55*w+40+fit*3,T=[75,83,90,100];idx=T.findIndex(x=>x>=waist);if(idx<0)idx=3;note=h<168?L('Рост невысокий: штанины могут быть длинноваты — их можно подвернуть.','You are on the shorter side: the legs may be long — you can roll them up.'):h>188?L('Рост высокий: штанины могут оказаться коротковаты.','You are tall: the legs may feel a bit short.'):''}
 else{const e=w+(h-175)*.45;idx=e<62?0:e<75?1:e<89?2:3;const near=[62,75,89].some(t=>Math.abs(e-t)<2.5);idx=clamp(idx+fit,0,3);note=near?L('Ты на границе между размерами — вещи свободного кроя, так что можно взять и больший.','You are between two sizes — the cut is relaxed, so you can go up one size.'):L('Крой свободный, поэтому размер даёт запас.','The cut is relaxed, so the size gives you room.')}
 const s=SN[idx];let rows='';if(c&&c.box){c.box.querySelectorAll('tbody tr').forEach(tr=>{const th=tr.querySelector('th'),td=tr.querySelector(`td[data-c="${s}"]`);if(th&&td)rows+=`<li><span>${esc(th.textContent)}</span><b>${esc(td.textContent)}</b></li>`})}
 res.innerHTML=`<p class="sf-big">${L('ТЕБЕ ПОДОЙДЁТ','YOUR SIZE')} <b>${s}</b></p><p>${note}</p>${rows?`<ul>${rows}</ul>`:''}${c?`<button type="button" class="sf-pick">${L('ВЫБРАТЬ РАЗМЕР','SELECT SIZE')} ${s} ↗</button>`:''}`;res.hidden=false;unlock('size');
 const pk=res.querySelector('.sf-pick');if(pk)pk.onclick=()=>{c.pick(s);sf.hidden=true}};
$('#langToggle')?.addEventListener('click',()=>{if(!sf.hidden){sfTexts();res.hidden=true}});

/* ================= SUPPORT CHAT ================= */
/* CHAT.endpoint: адрес твоего сервера для живых ответов (см. chat-backend/README.txt). Пусто = режим через Telegram. */
const CHAT={endpoint:'',poll:3000,tg:'https://t.me/spectremeiner',mail:'eg_roz00@mail.ru'};
const K=window.KMCFG||{freeFrom:10000,ship:{courier:500,pickup:300,post:350},promo:{KOTOMORY10:.1}};
const mny=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' ₽';
const KB=[
 {k:/привет|здравств|добр|hello|\bhi\b|hey/i,a:()=>['Привет! Я бот-помощник KOTOMORY. Спроси про доставку, оплату, размеры или промокод — или позови менеджера.','Hi! I am the KOTOMORY helper bot. Ask about delivery, payment, sizes or promo codes — or call a manager.']},
 {k:/достав|курьер|срок|почт|сдэк|cdek|boxberry|пункт|ship|deliver|courier|post/i,a:()=>[`Доставка: курьер — ${mny(K.ship.courier)}, пункт выдачи (СДЭК, Boxberry) — ${mny(K.ship.pickup)}, Почта России — ${mny(K.ship.post)}. От ${mny(K.freeFrom)} в заказе доставка бесплатная. Точные сроки лучше уточнить у менеджера.`,`Delivery: courier — ${mny(K.ship.courier)}, pickup point (CDEK, Boxberry) — ${mny(K.ship.pickup)}, Russian Post — ${mny(K.ship.post)}. Free for orders from ${mny(K.freeFrom)}. Ask the manager for exact timing.`]},
 {k:/оплат|карт|перевод|реквизит|pay|card|transfer|bank/i,a:()=>['Оплата: картой онлайн (сейчас демонстрационная — деньги не списываются) или переводом по реквизитам. Реквизиты и номер заказа покажем на последнем шаге оформления.','Payment: by card online (currently a demo — nothing is charged) or by bank transfer. We show the details and your order number on the last checkout step.']},
 {k:/размер|рост|вес|посад|size|fit|height|weight/i,a:()=>['В карточке каждой вещи есть таблица размеров. А ещё есть кнопка «Подобрать размер по росту и весу» — открой любую вещь и нажми её.','Every product page has a size chart, plus a “Find my size by height and weight” button — open any piece and tap it.']},
 {k:/промокод|скидк|купон|акци|promo|discount|coupon|sale/i,a:()=>[`Промокод ${Object.keys(K.promo)[0]} даёт ${Math.round(Object.values(K.promo)[0]*100)}% на товары — вводится на 3-м шаге заказа. Ещё есть скидка 10% за победу над ИИ в шахматах (один раз).`,`Promo code ${Object.keys(K.promo)[0]} gives ${Math.round(Object.values(K.promo)[0]*100)}% off items — enter it on step 3 of checkout. You can also win a one-time 10% discount by beating the AI at chess.`]},
 {k:/вручную|материал|ткан|dota|дота|hand|fabric|made/i,a:()=>['Вся одежда KOTOMORY создана вручную по мотивам игры Dota 2. Подробности по материалам лучше спросить у менеджера.','All KOTOMORY clothing is handmade, inspired by Dota 2. For material details, please ask the manager.']},
 {k:/заказ|статус|трек|order|status|track/i,a:()=>['Оформленные заказы подтверждает менеджер в Telegram. Если ты уже оформил заказ, пришли менеджеру его номер (KTM-…).','Orders are confirmed by the manager in Telegram. If you have placed an order, send the manager its number (KTM-…).']},
 {k:/возврат|обмен|вернуть|return|refund|exchange/i,a:()=>['Условия возврата и обмена уточняет менеджер — нажми «Позвать менеджера».','Return and exchange terms are confirmed by the manager — tap “Call a manager”.']},
 {k:/контакт|связ|telegram|телеграм|почта|email|mail|contact/i,a:()=>[`Telegram: @spectremeiner, почта: ${CHAT.mail}.`,`Telegram: @spectremeiner, email: ${CHAT.mail}.`]},
 {k:/игр|шахмат|chess|game/i,a:()=>['Победи ИИ в шахматах — получишь скидку 10% на одну вещь (кнопка «ИГРА −10%»). Скидка применяется сама при оформлении заказа.','Beat the AI at chess for a 10% discount on one piece (the “GAME −10%” button). It applies automatically at checkout.']}
];
const CH=rd('kotomory-chat',{sid:Math.random().toString(36).slice(2,10),m:[],last:0});if(!CH.m)CH.m=[];
const saveC=()=>{CH.m=CH.m.slice(-60);wr('kotomory-chat',CH)};
const chat=el(`<div class="kz" hidden role="dialog" aria-label="Support chat"><div class="kz-h"><i>K</i><div><b></b><small></small></div><button type="button" class="kz-x" aria-label="Close">✕</button></div><div class="kz-l"></div><div class="kz-q"></div><form class="kz-f"><input type="text" autocomplete="off" maxlength="400"><button type="submit" aria-label="Send">↗</button></form></div>`);
const fab=el('<button type="button" class="kz-fab" aria-label="Chat"><b>✉</b><span class="kz-dot" hidden></span></button>');
document.body.append(chat,fab);
const kl=chat.querySelector('.kz-l'),kq=chat.querySelector('.kz-q'),ki=chat.querySelector('input'),dot=fab.querySelector('.kz-dot');
let awaitMgr=false,lastQ='',typing=null,pollT=null;
const fmt=t=>esc(t).replace(/\n/g,'<br>');
function addMsg(w,t,silent){CH.m.push({w,t,ts:Date.now()});saveC();if(!silent)drawMsg(w,t)}
function drawMsg(w,t){const d=el(`<div class="kz-m ${w}">${fmt(t)}</div>`);kl.append(d);kl.scrollTop=kl.scrollHeight}
function bot(r,e){const t=e===undefined?r:L(r,e);showTyping();setTimeout(()=>{hideTyping();addMsg('b',t)},500+Math.min(900,t.length*6))}
function showTyping(){if(typing)return;typing=el('<div class="kz-m b kz-t"><i></i><i></i><i></i></div>');kl.append(typing);kl.scrollTop=kl.scrollHeight}
function hideTyping(){typing&&typing.remove();typing=null}
function chips(){const c=[['Доставка','Delivery'],['Оплата','Payment'],['Размеры','Sizes'],['Промокод','Promo code'],['Контакты','Contacts']];kq.innerHTML=c.map(([r,e])=>`<button type="button" data-q="${esc(L(r,e))}">${L(r,e)}</button>`).join('')+`<button type="button" class="mgr" data-mgr="1">${CH.mgr?L('Вернуться к боту','Back to the bot'):L('Позвать менеджера ↗','Call a manager ↗')}</button>`}
function texts(){chat.querySelector('.kz-h b').textContent=L('Поддержка KOTOMORY','KOTOMORY support');chat.querySelector('.kz-h small').textContent=CHAT.endpoint?L('менеджер отвечает здесь','the manager replies here'):L('бот отвечает сразу · менеджер в Telegram','bot answers instantly · manager on Telegram');ki.placeholder=L('Напиши вопрос…','Type your question…');chips()}
function redraw(){kl.innerHTML='';if(!CH.m.length){addMsg('b',L('Привет! Я помощник KOTOMORY. Выбери вопрос ниже или напиши свой.','Hi! I am the KOTOMORY helper. Pick a question below or type your own.'),true)}CH.m.forEach(m=>drawMsg(m.w,m.t))}
async function callMgr(text){const cartS=typeof cart!=='undefined'&&cart.length?cart.map(i=>{const p=products.find(p=>p.id===i.id);return p?`${p.name} ${i.size}×${i.qty}`:''}).join(', '):'';const page=location.href.split('#')[0];
 if(CHAT.endpoint){try{const r=await fetch(CHAT.endpoint.replace(/\/$/,'')+'/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sid:CH.sid,text,page,cart:cartS})});if(!r.ok)throw 0;CH.mgr=1;saveC();startPoll();bot('Передал менеджеру ✦ Ответ придёт прямо сюда — можно оставаться в чате.','Sent to the manager ✦ The reply will appear right here.');chips();return}catch(_){}}
 const ok=await copy(`${text}\n\n${cartS?'Корзина: '+cartS+'\n':''}${page}`);window.open(CHAT.tg,'_blank','noopener');bot(ok?'Я скопировал твой вопрос. Вставь его в чат Telegram — менеджер ответит там.':'Открыл Telegram — напиши менеджеру свой вопрос.',ok?'I copied your question. Paste it into the Telegram chat — the manager will reply there.':'Opened Telegram — write your question to the manager.')}
function answer(t){lastQ=t;const hit=KB.find(x=>x.k.test(t));if(hit){const a=hit.a();bot(a[0],a[1]);return}
 showTyping();setTimeout(()=>{hideTyping();addMsg('b',L('Я не нашёл ответ в своей базе. Могу передать вопрос менеджеру.','I could not find an answer in my base. I can pass your question to the manager.'));kq.innerHTML=`<button type="button" class="mgr" data-fwd="1">${L('Передать менеджеру ↗','Send to the manager ↗')}</button>`+kq.innerHTML},700)}
function send(t){t=t.trim();if(!t)return;addMsg('u',t);ki.value='';chips();if(awaitMgr||CH.mgr){awaitMgr=false;callMgr(t)}else answer(t)}
chat.querySelector('.kz-f').addEventListener('submit',e=>{e.preventDefault();send(ki.value)});
kq.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.q)send(b.dataset.q);else if(b.dataset.fwd){chips();callMgr(lastQ)}else if(b.dataset.mgr){if(CH.mgr){CH.mgr=0;saveC();bot('Хорошо, снова с вами бот. Спрашивай!','Okay, the bot is back. Ask away!');chips()}else{awaitMgr=true;bot('Напиши свой вопрос одним сообщением — я передам его менеджеру.','Type your question in one message — I will pass it to the manager.')}}});
function startPoll(){if(!CHAT.endpoint||pollT)return;pollT=setInterval(async()=>{if(!CH.mgr)return;try{const r=await fetch(`${CHAT.endpoint.replace(/\/$/,'')}/poll?sid=${CH.sid}&after=${CH.last||0}`);if(!r.ok)return;const j=await r.json();(j.replies||[]).forEach(m=>{CH.last=Math.max(CH.last||0,m.ts);addMsg('m',m.t);if(chat.hidden)dot.hidden=false;else chime(0)})}catch(_){}},CHAT.poll)}
function openChat(){chat.hidden=false;fab.classList.add('open');dot.hidden=true;texts();redraw();setTimeout(()=>ki.focus({preventScroll:true}),350);unlock('chat')}
fab.onclick=()=>chat.hidden?openChat():(chat.hidden=true,fab.classList.remove('open'));chat.querySelector('.kz-x').onclick=()=>{chat.hidden=true;fab.classList.remove('open')};
$('#langToggle')?.addEventListener('click',()=>{if(!chat.hidden)texts()});
if(CH.mgr)startPoll();

/* ================= DOCK (phones collapse the buttons) ================= */
if(fa){const dock=el('<button type="button" id="kmDock" aria-label="Menu"><b>✦</b></button>');fa.prepend(dock);dock.onclick=()=>fa.classList.toggle('open');
 const g=$('#kmGameBtn');trophy.onclick=()=>openPanel();g?g.after(trophy):fa.prepend(trophy);trophy.after(btnKH);
 document.addEventListener('click',e=>{if(fa.classList.contains('open')&&!e.target.closest('.fun-actions'))fa.classList.remove('open')})}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.hidden=true;sf.hidden=true;if(KH)setKH(false)}});
paint();
})();
