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
 {k:A('МОЙ ХОД РАБОТЫ','HOW I MADE IT'),big:'KOTOMORY',t:A('Как я делал свой бренд и сайт','How I made my brand and website'),i:[A('Егор Розов, Хекслет колледж','Egor Rozov, Hexlet College'),A('Группа 01-26.Д.ОД.9','Group 01-26.Д.ОД.9'),A('Индивидуальный проект, 2026','Individual project, 2026')]},
 {k:A('01 / С ЧЕГО НАЧАЛОСЬ','01 / THE START'),t:A('Придумал свой бренд','I came up with my own brand'),
  p:A('Я решил сделать собственный бренд одежды и назвал его KOTOMORY. Вся одежда создаётся вручную, а вдохновение я беру из игры Dota 2: из героев, брони и артефактов. Мне хотелось, чтобы у каждой вещи была своя история, а не просто красивая картинка.','I decided to make my own clothing brand and called it KOTOMORY. All the clothes are made by hand, and I take inspiration from Dota 2: its heroes, armor and artifacts. I wanted every piece to have its own story, not just a pretty picture.'),
  i:[A('Названия вещей взяты из игры: Aegis, Hand of Midas, Phantom Assassin, Wisp','The pieces are named after the game: Aegis, Hand of Midas, Phantom Assassin, Wisp'),A('Стиль — Y2K, то есть эстетика начала 2000-х: металл, звёзды, мягкий блеск','The style is Y2K, the early-2000s look: metal, stars, soft shine'),A('У каждой вещи свой герой или артефакт, на который она ссылается','Every piece refers to its own hero or artifact'),A('Хотелось собрать всё в одном месте: вещи, магазин и свой сайт','I wanted everything in one place: the clothes, the store and my own website')]},
 {k:A('02 / ПЛАН','02 / THE PLAN'),t:A('Сначала написал ТЗ','First I wrote the brief'),
  p:A('Прежде чем что-то рисовать, я написал техническое задание. Это подробный план проекта: что именно нужно сделать, какими инструментами и в каком порядке. Так мне было проще не запутаться и двигаться шаг за шагом.','Before drawing anything, I wrote a technical brief. It is a detailed plan: what exactly to make, with which tools and in what order. It helped me stay organized and move step by step.'),
  i:[A('Логотип и фирменный стиль, которые передают характер бренда','A logo and visual style that show the character of the brand'),A('Макеты сайта отдельно для компьютера и для телефона','Website layouts separately for desktop and phone'),A('Интернет-магазин, где путь до покупки короткий и понятный','An online store with a short, clear path to purchase'),A('Страницы сайта: главная, каталог, карточка товара, корзина, оформление заказа, о бренде','Site pages: home, catalog, product, cart, checkout, about'),A('План продвижения бренда в соцсетях','A plan for promoting the brand on social media')]},
 {k:A('03 / РИСОВАЛ','03 / DRAWING'),t:A('Рисовал в Adobe Illustrator','Drawing in Adobe Illustrator'),ch:[A('Adobe Illustrator','Adobe Illustrator')],im:['assets/kotomory-logo.webp','assets/kotomory-hoodie-detail-board.webp','assets/kotomory-jeans-detail-board.webp'],
  p:A('Дальше начался самый творческий этап. В Adobe Illustrator я нарисовал всю одежду и сделал логотип бренда. Это программа для векторной графики: рисунок можно увеличивать и менять, и он не теряет чёткости.','Then came the most creative stage. In Adobe Illustrator I drew all the clothes and made the brand logo. It is a vector graphics program: drawings can be enlarged and edited without losing sharpness.'),
  i:[A('Каждую вещь рисовал спереди и сзади, чтобы было понятно, как она выглядит целиком','I drew every piece from the front and the back so it is clear how it looks as a whole'),A('Отдельно прорисовывал детали: ремни, шипы, броню, застёжки','I drew details separately: straps, spikes, armor, fastenings'),A('Работал на отдельных слоях: так можно менять цвет и надписи, не трогая остальное','I worked on separate layers, so colors and text can be changed without touching the rest'),A('Из этих рисунков потом собрал карточки вещей для сайта','Later I built the product pages for the website from these drawings')]},
 {k:A('04 / МАКЕТ КУРТКИ','04 / THE JACKET'),t:A('Макет куртки в Illustrator','The jacket layout in Illustrator'),shot:'assets/process-illustrator-jacket.webp',
  p:A('Вот так выглядит мой рабочий файл куртки в Adobe Illustrator. Нажми на картинку, чтобы рассмотреть детали. Такой макет помогает понять, как устроена каждая часть, ещё до того как вещь начинают делать.','This is my working jacket file in Adobe Illustrator. Tap the picture to look at the details. A layout like this shows how each part is built before the piece is made.'),
  i:[A('Куртка нарисована с нескольких сторон: спереди, сзади, сбоку, а капюшон отдельно','The jacket is drawn from several sides: front, back, side, and the hood separately'),A('Внизу крупные детали: рукав, плечо, молния, подкладка и низ куртки','Below are close-ups: sleeve, shoulder, zipper, lining and hem'),A('Слева — палитра цветов куртки: чёрный, графит и несколько серых оттенков','On the left is the jacket color palette: black, graphite and several shades of gray'),A('Справа — фурнитура и выкройки, а всё разложено по слоям: логотип, текст, дизайн, детали, узоры, направляющие','On the right are hardware and patterns, and everything sits on layers: logo, text, design, details, patterns, guides')]},
 {k:A('05 / ТЕХПАК','05 / TECH PACK'),t:A('Чертёж по частям (техпак)','A drawing broken into parts (tech pack)'),shot:'assets/process-illustrator-techpack.webp',
  p:A('Второй файл — техпак. Это чертёж, по которому вещь можно сделать: каждая часть показана отдельно, с названием. По такому файлу понятно, из чего собирается куртка и как соединяются детали.','The second file is a tech pack. It is a drawing you can make the piece from: every part is shown separately and named. It shows what the jacket is made of and how the parts connect.'),
  i:[A('Есть виды спереди, сзади и сбоку, а ещё капюшон, воротник и плечо крупным планом','There are front, back and side views, plus close-ups of the hood, collar and shoulder'),A('Ниже — выкройки: передняя, боковая и задняя части, два рукава и выкройка капюшона','Below are the patterns: front, side and back panels, two sleeves and the hood pattern'),A('Отдельно показаны ремни, пряжки и молнии — всё, что нужно для сборки','Straps, buckles and zippers are shown separately — everything needed for assembly'),A('Тонкие красные линии — направляющие по центру вещи, а слева палитра: чёрный, зелёные и серые тона','Thin red lines are center guides, and on the left is the palette: black, greens and grays'),A('Слои названы по частям: FRONT, BACK, SLEEVE, HOOD, COLLAR, DETAILS, PATTERNS, COLOR, NOTES','Layers are named after the parts: FRONT, BACK, SLEEVE, HOOD, COLLAR, DETAILS, PATTERNS, COLOR, NOTES')]},
 {k:A('06 / МАКЕТЫ','06 / LAYOUTS'),t:A('Потом сделал макеты в Figma','Then I made layouts in Figma'),ch:[A('Figma','Figma')],
  p:A('Прежде чем делать сам сайт, я продумал в Figma, как он будет выглядеть и работать. Это как чертёж дома: сначала решаешь, где что стоит, а потом строишь.','Before building the site itself, I planned in Figma how it would look and work. It is like a blueprint of a house: first you decide where everything goes, then you build.'),
  i:[A('Придумал, как сайт выглядит на компьютере и на телефоне','Planned how the site looks on desktop and on a phone'),A('Собрал кликабельный прототип: на нём можно нажимать и смотреть, как всё будет работать','Built a clickable prototype to tap through and see how everything will work'),A('Сделал набор готовых кнопок и блоков (UI-kit), чтобы весь сайт был в одном стиле','Made a set of ready buttons and blocks (UI kit) so the whole site has one style'),A('По прототипу проверил путь покупателя: от главной страницы до оформления заказа','I checked the buyer’s path with the prototype: from the home page to placing an order')]},
 {k:A('07 / СТИЛЬ САЙТА','07 / SITE STYLE'),t:A('Чёрный, белый и один яркий акцент','Black, white and one bright accent'),sw:1,
  p:A('Я хотел, чтобы сайт был строгим и узнаваемым. Основа — тёмные тона, а яркий лаймовый цвет используется только для важных мест: кнопок и подсказок. Вокруг фото оставил много пустого места, чтобы вещь была главным героем страницы.','I wanted the site to feel strict and recognizable. The base is dark tones, and the bright lime color is used only for the important spots: buttons and hints. I left a lot of empty space around the photos so the piece is the hero of the page.'),
  i:[A('Палитра: чёрный, графит, белый и лайм для кнопок и акцентов','Palette: black, graphite, white and lime for buttons and accents'),A('Заголовки — крупный плотный шрифт, подписи — моноширинный, как в технических схемах','Headlines use a heavy, tight typeface; captions use a monospace font like technical diagrams'),A('Звёздочки, бегущие строки и металлический блеск напоминают о Y2K','Stars, tickers and metallic shine bring back the Y2K feeling')]},
 {k:A('08 / САЙТ','08 / THE SITE'),t:A('Что есть на сайте','What the site has'),ch:[A('Каталог','Catalog'),A('Фильтры и поиск','Filters & search'),A('Избранное','Favorites'),A('Корзина','Cart'),A('Заказ в 3 шага','3-step checkout'),A('Таблицы размеров','Size charts'),A('Подбор размера','Size finder'),A('Материалы','Materials'),A('RU / EN','RU / EN'),A('Тёмная тема','Dark theme'),A('Чат поддержки','Support chat'),A('Карта лояльности','Loyalty card')],
  p:A('Сайт сделан на HTML, CSS и JavaScript. Я хотел, чтобы им было удобно пользоваться: от выбора вещи до оформления заказа. Он одинаково работает и на компьютере, и на телефоне.','The site is built with HTML, CSS and JavaScript. I wanted it to be convenient from choosing a piece to placing an order. It works the same on desktop and on a phone.'),
  i:[A('В каталоге 10 вещей: одежда, сумка и аксессуары, их можно фильтровать и искать','The catalog has 10 pieces: clothes, a bag and accessories; you can filter and search them'),A('Заказ оформляется за 3 шага: контакты, доставка (курьер, пункт выдачи, почта) и оплата','An order takes 3 steps: contacts, delivery (courier, pickup point, post) and payment'),A('У каждой вещи есть таблица размеров, материалы и подбор размера по росту и весу','Every piece has a size chart, materials and a size finder by height and weight'),A('Есть промокод, русский и английский язык, светлая и тёмная тема, а ещё чат с ответами на частые вопросы','There is a promo code, Russian and English, light and dark themes, and a chat with answers to common questions')]},
 {k:A('КОД','CODE'),t:A('Кусочек кода сайта','A piece of the site code'),
  p:A('Так выглядит небольшая часть кода, из которого сделан сайт. Код — это инструкции, по которым браузер рисует страницу и двигает элементы. Сверху — анимация, из-за которой фото вещей мягко «парят». Снизу — упрощённый расчёт скидки за победу в шахматах.','Here is a small part of the code the site is made of. Code is the set of instructions a browser uses to draw the page and move things. Above is the animation that makes product photos float gently. Below is a simplified version of the chess-win discount calculation.'),
  code:[{f:'styles.css',t:"/* фото вещей мягко «парят» */\n.kx-live .product-photo {\n  animation: kxFloat 6.5s ease-in-out infinite;\n}\n@keyframes kxFloat {\n  0%, 100% { translate: 0 0; }\n  50%      { translate: 0 -7px; }\n}"},{f:'discount.js · упрощённо',t:"// скидка 10% за победу — на самую дорогую вещь\nconst prices   = cart.map(item => priceOf(item.id));\nconst biggest  = Math.max(...prices);\nconst discount = Math.round(biggest * 0.1);"}]},
 {k:A('10 / ДВИЖЕНИЕ','10 / MOTION'),t:A('Сайт, который двигается','A site that moves'),
  p:A('Анимации нужны, чтобы сайт ощущался живым. Но они не должны мешать пользоваться им, поэтому я следил за плавностью и за тем, как сайт ведёт себя на слабых телефонах.','Animations make the site feel alive. But they must not get in the way, so I paid attention to smoothness and to how the site behaves on weaker phones.'),
  i:[A('Блоки появляются при прокрутке, фото вещей плавно «парят», есть лента с одеждой и вращающийся значок','Blocks appear on scroll, photos gently float, and there is a clothing roll and a spinning badge'),A('Двигаются только прозрачность и положение, поэтому сайт не тормозит','Only opacity and position are animated, so the site does not lag'),A('Фото в каталоге сжаты: на телефон загружаются лёгкие версии, на компьютер — полные','Catalog photos are optimized: phones load light versions, desktops load full-size ones'),A('На телефонах анимаций меньше и они проще, а на компьютере включаются все эффекты','Phones get fewer, simpler animations, while desktops get every effect'),A('Если у человека включено «уменьшить движение», анимации отключаются','If a person turns on “reduce motion”, animations are switched off')]},
 {k:A('11 / ИГРА','11 / THE GAME'),t:A('Шахматы со скидкой','Chess for a discount'),
  p:A('Чтобы на сайт было интереснее заходить, я добавил мини-игру: шахматы против компьютера. Победа даёт скидку 10% на одну вещь. Фигуры можно нажимать или перетаскивать пальцем и мышью.','To make the site more fun to visit, I added a mini-game: chess against the computer. Winning gives a 10% discount on one piece. You can tap the pieces or drag them with a finger or mouse.'),
  i:[A('В шахматах работают все основные правила: рокировка, взятие на проходе, превращение пешки, шах, мат и ничья','All the main rules work: castling, en passant, promotion, check, checkmate and draws'),A('Соперник лёгкого уровня: он играет без грубых ошибок, но обыграть его может обычный игрок','The opponent is easy level: it avoids blunders, but an ordinary player can beat it'),A('Скидка применяется сама на последнем шаге оформления заказа, один раз','The discount applies by itself on the last checkout step, once'),A('Через 30 секунд после захода появляется баннер «поторопись» с таймером на минуту','After 30 seconds a “hurry” banner appears with a one-minute timer')]},
 {k:A('12 / ПЕРЕДЕЛЫВАЛ','12 / REDOING'),t:A('Что мне пришлось менять','What I had to change'),
  p:A('Не всё получилось с первого раза, и это нормально. Вот что мне пришлось поменять по ходу работы — на каждом шаге я смотрел, удобно ли пользоваться, и исправлял то, что не нравилось.','Not everything worked the first time, and that is normal. Here is what I had to change along the way — at each step I checked whether it was comfortable and fixed what I did not like.'),
  i:[A('Оформление заказа мне не понравилось, поэтому я переделал его с нуля на 3 простых шага','I did not like the checkout, so I redid it from scratch into 3 simple steps'),A('Лупа на фото сначала работала неудобно, и мне пришлось заменить её на новую','The photo magnifier was awkward at first, so I had to replace it with a new one'),A('Кружок у курсора получился слишком большим, и я его уменьшил','The cursor ring turned out too big, so I made it smaller'),A('Шахматный соперник сначала был слабым, потом сильным — мне пришлось найти золотую середину, чтобы с ним было интересно играть','The chess opponent was first weak and then strong — I had to find the middle ground so it is fun to play'),A('Зелёные эффекты на карточках и баннере мне не понравились, поэтому я их убрал','I did not like the green effects on the cards and the banner, so I removed them'),A('Таблицы размеров сверял с размерными сетками магазинов','I compared the size charts with the size guides of other stores')]},
 {k:A('13 / ДАЛЬШЕ','13 / NEXT'),t:A('Как буду продвигать','How I will promote it'),ch:[A('Rutube','Rutube'),A('Pinterest','Pinterest'),A('ВКонтакте','VK')],
  p:A('Сайт — это только начало: бренду нужны люди, которые о нём узнают. Для этого у меня есть план по трём площадкам, и на каждой своя задача.','The site is only the beginning: a brand needs people to find it. I have a plan for three platforms, and each has its own task.'),
  i:[A('Rutube — видео про вещи: lookbook, обзоры тканей, рассказ о создании','Rutube — videos about the pieces: lookbooks, fabric reviews, how things are made'),A('Pinterest — подборки с образами и мудборды, чтобы люди находили бренд по картинкам','Pinterest — boards with looks and moodboards so people find the brand through images'),A('ВКонтакте — витрина с товарами и аккуратная сетка постов','VK — a product showcase and a tidy grid of posts'),A('Для всех площадок — единый стиль: те же цвета, шрифты и фото, что на сайте','One style for all platforms: the same colors, fonts and photos as on the site')]},
 {k:A('14 / ИТОГ','14 / RESULT'),t:A('Что получилось','What I got'),
  p:A('За время проекта я прошёл путь от идеи до готового интернет-магазина: придумал бренд, нарисовал одежду, спроектировал сайт и собрал его. Многое пришлось пробовать и переделывать, но именно поэтому результат получился таким, каким я хотел его видеть.','During the project I went from an idea to a finished online store: I came up with a brand, drew the clothes, designed the site and built it. I had to try and redo a lot, but that is why the result turned out the way I wanted.'),
  i:[A('Свой бренд, логотип и одежда, нарисованная вручную','My own brand, logo and hand-drawn clothes'),A('Готовый магазин: каталог, корзина, заказ, размеры, материалы','A working store: catalog, cart, checkout, sizes, materials'),A('Сайт удобно открывать и на телефоне, и на компьютере','The site is comfortable to open on both phone and desktop'),A('Следующий шаг — показать магазин людям и собрать отзывы, чтобы сделать его ещё лучше','The next step is to show the store to people and collect feedback to make it even better')],cta:1}
];
let di=0,dd=1,dtx=0;
const deck=el(`<div class="pr-ov" hidden role="dialog" aria-modal="true"><div class="pr-top"><span class="pr-cnt"></span><button type="button" class="pr-x" aria-label="Close">✕</button></div><div class="pr-stage"></div><div class="pr-nav"><button type="button" class="pr-prev" aria-label="Prev">←</button><div class="pr-dots"></div><button type="button" class="pr-next" aria-label="Next">→</button></div><div class="pr-bar"><i></i></div></div>`);
document.body.append(deck);const st=deck.querySelector('.pr-stage');
function slide(){const s=SL[di],n=SL.length,f=a=>esc(L(a[0],a[1]));let h=`<article class="pr-slide ${dd>0?'r':'l'}" data-n="${String(di+1).padStart(2,'0')}"><p class="pr-k">${di===0?f(s.k):String(di).padStart(2,'0')+' / '+f(s.k).replace(/^\d+ \/ /,'')}</p>`;
 h+=s.big?`<h1 class="pr-big">${[...s.big].map((c,i)=>`<span style="--i:${i}">${c}</span>`).join('')}</h1><p class="pr-sub">${f(s.t)}</p>`:`<h2>${f(s.t)}</h2>`;
 if(s.p)h+=`<p class="pr-p">${f(s.p)}</p>`;
 if(s.shot)h+=`<figure class="pr-shot"><img src="${IM(s.shot)}" data-full="${s.shot}" alt="" decoding="async"><figcaption>${L('Нажми, чтобы увеличить','Tap to zoom')}</figcaption></figure>`;
 if(s.code)h+=s.code.map(c=>`<div class="pr-term"><div class="pr-bar2"><i></i><i></i><i></i><span>${esc(c.f)}</span></div><pre>${c.t.split('\n').map((l,i)=>`<span class="${/^\s*(\/\/|\/\*)/.test(l)?'c':''}" style="--l:${i}">${esc(l)}</span>`).join('\n')}</pre></div>`).join('');
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
const zoom=el('<div class="pr-zoom" hidden><img alt=""></div>');deck.append(zoom);zoom.onclick=()=>zoom.hidden=true;
deck.addEventListener('click',e=>{const im=e.target.closest('.pr-shot img');if(im){zoom.firstChild.src=im.dataset.full;zoom.scrollTo(0,0);zoom.hidden=false}});
const to=n=>{if(n<0||n>=SL.length||n===di)return;dd=n>di?1:-1;di=n;slide()};
function openDeck(){di=0;dd=1;slide();deck.hidden=false;lock(1);}
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
function aiPick(s){const ms=legal(s,1);if(!ms.length)return null;if(Math.random()<.16)return ms[Math.random()*ms.length|0];ms.sort((x,y)=>sc(s.b,y)-sc(s.b,x));let best=ms[0],bv=-1e9;for(const m of ms){const v=-nm(make(s,m),1,-1e9,1e9)+Math.random()*85;if(v>bv){bv=v;best=m}}return best}


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
 cb.querySelector('.cb-sub').textContent=rw()==='used'?L('Награда уже использована, но играть можно сколько угодно.','Reward already used, but you can still play for fun.'):rw()==='won'?L('Скидка 10% уже активна. Играй ради удовольствия.','10% discount is already active. Play for fun.'):L('Ты играешь белыми. Победа над ИИ (лёгкий уровень) = скидка 10% на любую вещь, один раз.','You play white. Beat the AI (easy level) = 10% off any piece, once.');
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
 if(!RMo&&sp.animate&&!G.noflip){const a=sqs[m.f].getBoundingClientRect(),z=q.getBoundingClientRect();sp.style.zIndex=6;sp.animate([{transform:`translate(${a.left-z.left}px,${a.top-z.top}px) scale(1.18)`},{transform:'none'}],{duration:300,easing:'cubic-bezier(.2,.75,.25,1)'}).onfinish=()=>sp.style.zIndex='';
  if(cap)q.classList.add('boom');if(G.chk)sqs[kp(G.s.b,G.s.t)].classList.add('chk-pulse')}
 if(G.over)end()}
function aiTurn(){G.think=true;draw();setTimeout(()=>{if(!G||!cb||cb.hidden)return;const m=aiPick(G.s);G.think=false;if(m)apply(m)},380)}
function end(){const k=G.over;let h='';const bx=cb.querySelector('.cb-box');bx.classList.remove('fx-win','fx-lose');void bx.offsetWidth;
 if(k==='win'){bx.classList.add('fx-win');window.kmConfetti&&kmConfetti(160);const w=kp(G.s.b,-1);if(w>=0)sqs[w].classList.add('kw')}else if(k==='lose'){bx.classList.add('fx-lose');const l=kp(G.s.b,1);if(l>=0)sqs[l].classList.add('kl')}
 if(k==='win'){const s=rw();if(s==='none'){setRw('won');h=`<div class="cb-stamp">−10%</div><h3>${L('ПОБЕДА ✦','VICTORY ✦')}</h3><p>${L('Скидка 10% на любую вещь активна. Она применится автоматически при оформлении заказа — один раз.','10% off any piece is active. It applies automatically at checkout — once.')}</p><button type="button" data-a="shop">${L('К ПОКУПКАМ ↗','SHOP NOW ↗')}</button>`}
  else h=`<h3>${L('ПОБЕДА ✦','VICTORY ✦')}</h3><p>${s==='won'?L('Скидка уже активна.','Your discount is already active.'):L('Скидка по этой награде уже использована.','The reward has already been used.')}</p>`}
 else if(k==='lose')h=`<h3>${L('ИИ ВЫИГРАЛ','AI WON')}</h3><p>${rw()==='none'?L('Попробуй ещё раз — скидка ждёт.','Try again — the discount is waiting.'):L('Ничего страшного, сыграй ещё раз.','No worries, play again.')}</p>`;
 else h=`<h3>${L('НИЧЬЯ','DRAW')}</h3><p>${drawTxt()}. ${L('Попробуй ещё раз.','Try again.')}</p>`;
 res.innerHTML=h+`<button type="button" data-a="new" class="alt">${L('ИГРАТЬ ЕЩЁ','PLAY AGAIN')}</button>`;setTimeout(()=>{res.hidden=false},k==='win'?500:300)}
function newGame(){cb.querySelector('.cb-box').classList.remove('fx-win','fx-lose');G={s:init(),sel:-1,lm:[],last:null,chk:false,over:null,think:false,ply:0,keys:{},hist:[],reason:''};G.keys[key(G.s)]=1;G.lm=legal(G.s);pr.hidden=true;res.hidden=true;texts();draw();
 if(!RMo)sqs.forEach((q,i)=>{const sp=q.firstChild;if(sp.textContent&&sp.animate)sp.animate([{opacity:0,transform:'translateY(-16px) scale(.5)'},{opacity:1,transform:'none'}],{duration:450,delay:(i>>3)*45+(i&7)*16,easing:'cubic-bezier(.2,.75,.25,1)',fill:'backwards'})})}
function openChess(){const s=state();if(s==='dead'){window.showToast&&showToast(L('ВРЕМЯ ВЫШЛО — ПРЕДЛОЖЕНИЕ ВЕРНЁТСЯ ПРИ СЛЕДУЮЩЕМ ВИЗИТЕ','TIME IS UP — THE OFFER RETURNS NEXT VISIT'));return}if(s==='live'||s==='wait'){if(!O)begin();O.claimed=true;saveO();refresh()}if(!G||G.over)newGame();else texts();cb.hidden=false;lock(1);draw()}
const closeChess=()=>{cb.hidden=true;lock(0)};window.openChess=openChess;
let dg=null;
const tryMove=(from,to,dropped)=>{const ms=G.lm.filter(m=>m.f===from&&m.t===to);if(!ms.length)return false;if(ms.length>1){askPromo(ms);return true}G.noflip=!!dropped;apply(ms[0]);G.noflip=false;if(!G.over)aiTurn();return true};
bd.addEventListener('pointerdown',e=>{const q=e.target.closest('.cb-sq');if(!q||!G||G.over||G.think||G.s.t!==1||!pr.hidden)return;const i=+q.dataset.i;
 if(G.sel>=0&&G.sel!==i&&tryMove(G.sel,i,false))return;
 if(G.s.b[i]>0){const was=G.sel===i;G.sel=i;draw();dg={from:i,x:e.clientX,y:e.clientY,moved:false,was,id:e.pointerId};try{bd.setPointerCapture(e.pointerId)}catch(_){}}
 else{G.sel=-1;draw()}});
bd.addEventListener('pointermove',e=>{if(!dg||e.pointerId!==dg.id)return;
 if(!dg.moved){if(Math.hypot(e.clientX-dg.x,e.clientY-dg.y)<7)return;dg.moved=true;const sq=sqs[dg.from],r=sq.getBoundingClientRect(),gh=document.createElement('div');gh.className='cb-ghost '+(sq.classList.contains('w')?'w':'b');gh.textContent=sq.firstChild.textContent;gh.style.cssText=`width:${r.width}px;height:${r.height}px;font-size:${getComputedStyle(sq).fontSize}`;document.body.append(gh);dg.ghost=gh;dg.w=r.width;sq.classList.add('drag')}
 dg.ghost.style.transform=`translate(${e.clientX-dg.w/2}px,${e.clientY-dg.w/2}px) scale(1.18)`});
const endDrag=(e,cancel)=>{if(!dg||e.pointerId!==dg.id)return;const d=dg;dg=null;try{bd.releasePointerCapture(e.pointerId)}catch(_){}
 if(!d.moved){if(d.was&&!cancel){G.sel=-1;draw()}return}
 sqs[d.from].classList.remove('drag');let ok=false;
 if(!cancel){const t=document.elementFromPoint(e.clientX,e.clientY),q=t&&t.closest&&t.closest('.cb-sq');if(q&&bd.contains(q))ok=tryMove(d.from,+q.dataset.i,true)}
 if(ok){d.ghost.remove()}else{const g=d.ghost,r=sqs[d.from].getBoundingClientRect();g.animate([{transform:g.style.transform},{transform:`translate(${r.left}px,${r.top}px) scale(1)`}],{duration:220,easing:'cubic-bezier(.2,.75,.25,1)'}).onfinish=()=>{g.remove();draw()}}};
bd.addEventListener('pointerup',e=>endDrag(e,false));bd.addEventListener('pointercancel',e=>endDrag(e,true));
function askPromo(ms){pr.innerHTML=`<p>${L('Во что превратить пешку?','Promote the pawn to:')}</p><div>${[5,4,3,2].map(t=>`<button type="button" data-pr="${t}">${GL[t]}</button>`).join('')}</div>`;pr.hidden=false;pr._ms=ms}
pr.addEventListener('click',e=>{const b=e.target.closest('[data-pr]');if(b){const m=pr._ms.find(x=>x.pr===+b.dataset.pr);pr.hidden=true;apply(m);if(!G.over)aiTurn()}else if(e.target===pr){pr.hidden=true}});
let rsT=null;const rb=cb.querySelector('.cb-resign');
rb.onclick=()=>{if(!G||G.over||G.think)return;if(!rb._c){rb._c=1;rb.textContent=L('ТОЧНО?','SURE?');rsT=setTimeout(()=>{rb._c=0;rb.textContent=L('СДАТЬСЯ','RESIGN')},2500);return}clearTimeout(rsT);rb._c=0;rb.textContent=L('СДАТЬСЯ','RESIGN');G.over='lose';G.reason='resign';draw();end()};
cb.querySelector('.cb-x').onclick=cb.querySelector('.cb-close').onclick=closeChess;cb.querySelector('.cb-new').onclick=newGame;
res.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='new')newGame();else{closeChess();$('#shop').scrollIntoView({behavior:'smooth'})}});
cb.addEventListener('click',e=>{if(e.target===cb)closeChess()});

document.addEventListener('keydown',e=>{if(!deck.hidden){if(e.key==='Escape'){if(!zoom.hidden)zoom.hidden=true;else closeDeck()}if(e.key==='ArrowRight')to(di+1);if(e.key==='ArrowLeft')to(di-1)}else if(!cb.hidden&&e.key==='Escape')closeChess()});
$('#langToggle')?.addEventListener('click',()=>{refresh();if(!deck.hidden)slide();if(!cb.hidden){texts();if(G)status();if(!res.hidden)end()}});
refresh();
})();
