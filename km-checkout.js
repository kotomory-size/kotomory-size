/* KOTOMORY checkout: contacts → delivery → payment. Uses script.js globals (cart, products, money, lang, $, $$). */
(()=>{
/* ===== НАСТРОЙКИ — поменяй под себя ===== */
const KC={
 freeFrom:10000,                                   // бесплатная доставка от суммы
 ship:{courier:500,pickup:300,post:350},           // цены доставки, ₽
 promo:{KOTOMORY10:.10},                           // промокоды: код → скидка
 req:{recipient:'Розов Егор',bank:'ВПИШИ СВОЙ БАНК',card:'0000 0000 0000 0000',phone:'+7 000 000-00-00'}, // реквизиты для перевода
 tg:'https://t.me/spectremeiner'
};
window.KMCFG=KC;
const L=(r,e)=>lang==='ru'?r:e,G=id=>document.getElementById(id),F=n=>document.querySelector('#kcForm [name="'+n+'"]');
let step=1,del='courier',op='СДЭК',pay='card',promo=null,orderNo='',busy=false,lastSummary='';
const sub=()=>cartSubtotal(),ship=()=>{const s=sub();return s===0||s>=KC.freeFrom?0:KC.ship[del]},pd=()=>promo?Math.round(sub()*KC.promo[promo]):0,gd=()=>{let r='none';try{r=localStorage.getItem('kotomory-reward')||'none'}catch(_){}if(r!=='won'||!cart.length)return 0;return Math.round(Math.max(...cart.map(i=>(products.find(p=>p.id===i.id)||{price:0}).price))*.1)},disc=()=>pd()+gd(),total=()=>Math.max(0,sub()+ship()-disc());
const DN=()=>({courier:L('Курьер','Courier'),pickup:L('Пункт выдачи','Pickup point'),post:L('Почта России','Russian Post')});
const ADDR={courier:['УЛИЦА, ДОМ, КВАРТИРА','STREET, HOUSE, APT','Улица, дом, кв., подъезд, этаж','Street, house, apt'],pickup:['АДРЕС ИЛИ КОД ПУНКТА ВЫДАЧИ','PICKUP POINT ADDRESS OR CODE','Например, MSK1234 или адрес пункта','e.g. MSK1234 or point address'],post:['УЛИЦА, ДОМ, КВАРТИРА','STREET, HOUSE, APT','Улица, дом, квартира','Street, house, apt']};
const rules={name:v=>v.trim().length>=2,phone:v=>v.replace(/\D/g,'').length===11,email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),city:v=>v.trim().length>=2,address:v=>v.trim().length>=4,zip:v=>{v=v.trim();return del==='post'?/^\d{6}$/.test(v):(!v||/^\d{6}$/.test(v))}};
const fieldsOf={1:['name','phone','email'],2:['city','address','zip']};
const store='kotomory-checkout',load=()=>{try{return JSON.parse(localStorage.getItem(store)||'{}')}catch(_){return{}}};
const save=()=>{try{localStorage.setItem(store,JSON.stringify({name:F('name').value,phone:F('phone').value,email:F('email').value,city:F('city').value}))}catch(_){}};
const copy=async t=>{try{await navigator.clipboard.writeText(t);return 1}catch(_){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();let ok=0;try{ok=document.execCommand('copy')}catch(_){}a.remove();return ok}};

const reqHTML=()=>{const t=total(),r=KC.req,rows=[[L('Получатель','Recipient'),r.recipient],[L('Банк','Bank'),r.bank],[L('Номер карты','Card number'),r.card],[L('Телефон (СБП)','Phone (SBP)'),r.phone],[L('Сумма','Amount'),money(t)],[L('Комментарий к переводу','Payment comment'),orderNo]];
 return `<div class="kc-req">${rows.map(([k,v])=>`<div><div><span>${k}</span><strong>${v}</strong></div><button type="button" data-copy="${String(v).replace(/"/g,'&quot;')}">${L('КОПИРОВАТЬ','COPY')}</button></div>`).join('')}</div>`};

function render(){
 const s=sub(),free=s>=KC.freeFrom;
 Object.keys(KC.ship).forEach(k=>{const e=G('kcP_'+k);if(e)e.textContent=free?L('БЕСПЛАТНО','FREE'):money(KC.ship[k])});
 G('kcFreeHint').textContent=free?L('Бесплатная доставка уже включена ✦','Free shipping is already included ✦'):L(`Ещё ${money(KC.freeFrom-s)} до бесплатной доставки`,`${money(KC.freeFrom-s)} more for free shipping`);
 const a=ADDR[del];G('kcAddrL').textContent=L(a[0],a[1]);F('address').placeholder=L(a[2],a[3]);
 G('kcOp').hidden=del!=='pickup';G('kcZipBox').hidden=del==='pickup';G('kcZipL').textContent=del==='post'?L('ИНДЕКС','POSTCODE'):L('ИНДЕКС (НЕОБЯЗАТЕЛЬНО)','POSTCODE (OPTIONAL)');
 G('kcSub').textContent=money(s);G('kcShip').textContent=ship()===0?L('БЕСПЛАТНО','FREE'):money(ship());
 const d=disc();G('kcDiscRow').hidden=G('kcDisc').hidden=!d;G('kcDisc').textContent='−'+money(d);G('kcTotal').textContent=money(total());G('kcGameNote').textContent=gd()?L(`♟ Скидка за победу в игре применена к самой дорогой вещи: −${money(gd())}`,`♟ Game reward applied to your priciest piece: −${money(gd())}`):'';
 G('kcItems').innerHTML=cart.map(i=>{const p=products.find(p=>p.id===i.id);return p?`<li><span>${lang==='ru'?p.ru:p.name} · ${i.size} × ${i.qty}</span><b>${money(p.price*i.qty)}</b></li>`:''}).join('');
 G('kcPayPanel').innerHTML=pay==='transfer'?`<p class="kc-hint">${L('Переведи точную сумму и обязательно укажи номер заказа в комментарии.','Transfer the exact amount and put the order number in the comment.')}</p>${reqHTML()}`:`<p class="kc-hint">${L('Откроется демонстрационная оплата. Реальные деньги не списываются.','A demo payment will run. No real money is charged.')}</p>`;
 const nx=G('kcNext');if(!busy)nx.textContent=step<3?L('ДАЛЕЕ ↗','NEXT ↗'):pay==='card'?L(`ОПЛАТИТЬ ${money(total())} ↗`,`PAY ${money(total())} ↗`):L('ПОДТВЕРДИТЬ ЗАКАЗ ↗','CONFIRM ORDER ↗');
}
function go(n){step=n;document.querySelectorAll('.kc-step').forEach(s=>s.hidden=+s.dataset.step!==n);document.querySelectorAll('.kc-steps li').forEach(li=>{const k=+li.dataset.s;li.classList.toggle('on',k===n);li.classList.toggle('done',k<n)});G('kcBar').style.setProperty('--p',(n-1)/2);G('kcBack').hidden=n===1;render();G('checkoutModal').scrollTop=0}
function validate(n){let first=null;(fieldsOf[n]||[]).forEach(k=>{const el=F(k),box=el.closest('.kc-field');if(box.hidden)return;const ok=rules[k](el.value);box.classList.toggle('bad',!ok);if(!ok&&!first)first=el});
 if(first){first.focus();const st=first.closest('.kc-step');st.classList.remove('kc-shake');void st.offsetWidth;st.classList.add('kc-shake');return false}return true}
const summary=()=>{const D=DN();return [`KOTOMORY · ${orderNo}`,...cart.map(i=>{const p=products.find(p=>p.id===i.id);return p?`${p.name} · ${i.size} × ${i.qty} — ${money(p.price*i.qty)}`:''}),`${L('Доставка','Delivery')}: ${D[del]}${del==='pickup'?' ('+op+')':''} — ${F('city').value}, ${F('address').value}${F('zip').value?', '+F('zip').value:''}`,`${L('Оплата','Payment')}: ${pay==='card'?L('картой (демо)','card (demo)'):L('переводом','transfer')}`,`${L('Итого','Total')}: ${money(total())}`,`${F('name').value} · ${F('phone').value} · ${F('email').value}`].join('\n')};
function finish(){const t=total(),tr=pay==='transfer';lastSummary=summary();if(gd()>0&&window.kmRewardUse)window.kmRewardUse();window.kmAch&&kmAch.unlock('purchase');
 G('kcOrderNo').textContent=orderNo;G('kcOkTitle').textContent=tr?L('ЗАКАЗ ОФОРМЛЕН','ORDER PLACED'):L('ОПЛАТА УСПЕШНА','PAYMENT SUCCESSFUL');
 G('kcOkText').textContent=tr?L(`Переведи ${money(t)} по реквизитам и укажи номер заказа в комментарии. После подтверждения перевода мы свяжемся с тобой.`,`Transfer ${money(t)} with the details below and add the order number as a comment. We will contact you once the transfer is confirmed.`):L('Демонстрационный платёж прошёл успешно. Деньги не списывались.','Demo payment completed. No money was charged.');
 G('kcOkReq').innerHTML=tr?reqHTML():'';G('kcOkReq').hidden=!tr;G('kcOkTg').hidden=!tr;
 cart=[];saveCart();promo=null;busy=false;G('kcFlow').hidden=true;G('checkoutSuccessView').hidden=false;G('checkoutModal').scrollTop=0}
function submit(){if(busy)return;busy=true;const nx=G('kcNext');G('kcFlow').classList.add('busy');
 if(pay==='card'){nx.innerHTML='<i class="kc-spin"></i>'+L('ОБРАБАТЫВАЕМ ПЛАТЁЖ…','PROCESSING…');setTimeout(()=>{G('kcFlow').classList.remove('busy');finish()},1700)}else{G('kcFlow').classList.remove('busy');finish()}}

window.openCheckout=function(){closeCart();const d=load();['name','phone','email','city'].forEach(k=>{if(d[k]&&!F(k).value)F(k).value=d[k]});
 promo=null;busy=false;G('kcPromo').value='';G('kcPromoMsg').textContent='';document.querySelectorAll('.kc-field.bad').forEach(f=>f.classList.remove('bad'));
 orderNo='KTM-'+Math.random().toString(36).slice(2,8).toUpperCase();G('kcFlow').hidden=false;G('kcFlow').classList.remove('busy');G('checkoutSuccessView').hidden=true;go(1);
 G('checkoutModal').classList.add('open');G('checkoutModal').setAttribute('aria-hidden','false');G('checkoutBackdrop').classList.add('open')};
window.closeCheckout=function(){G('checkoutModal').classList.remove('open');G('checkoutModal').setAttribute('aria-hidden','true');G('checkoutBackdrop').classList.remove('open')};

$('#checkoutBtn').onclick=()=>{if(!cart.length){showToast(L('СНАЧАЛА ДОБАВЬ ТОВАР В КОРЗИНУ','ADD AN ITEM TO YOUR BAG FIRST'));return}openCheckout()};
G('checkoutClose').onclick=G('checkoutBackdrop').onclick=closeCheckout;
G('finishCheckout').onclick=()=>{closeCheckout();showToast(L('СПАСИБО ЗА ЗАКАЗ','THANKS FOR YOUR ORDER'))};
G('kcNext').onclick=()=>{if(busy)return;if(step<3){if(!validate(step))return;save();go(step+1)}else submit()};
G('kcBack').onclick=()=>{if(!busy&&step>1)go(step-1)};
document.querySelectorAll('.kc-steps li').forEach(li=>li.onclick=()=>{const k=+li.dataset.s;if(!busy&&k<step)go(k)});
document.querySelectorAll('[name=kcDel]').forEach(r=>r.addEventListener('change',()=>{del=r.value;render()}));
document.querySelectorAll('[name=kcPay]').forEach(r=>r.addEventListener('change',()=>{pay=r.value;render()}));
document.querySelectorAll('[data-op]').forEach(b=>b.onclick=()=>{op=b.dataset.op;document.querySelectorAll('[data-op]').forEach(x=>x.classList.toggle('on',x===b))});
G('kcPromoBtn').onclick=()=>{const c=G('kcPromo').value.trim().toUpperCase();promo=KC.promo[c]?c:null;G('kcPromoMsg').textContent=promo?L(`Промокод применён: скидка ${Math.round(KC.promo[c]*100)}% на товары ✦`,`Code applied: ${Math.round(KC.promo[c]*100)}% off items ✦`):L('Промокод не найден. Попробуй KOTOMORY10','Code not found. Try KOTOMORY10');render()};
G('kcForm').addEventListener('input',e=>{const b=e.target.closest('.kc-field');if(b)b.classList.remove('bad')});
G('kcForm').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();G('kcNext').click()}});
G('kcForm').addEventListener('submit',e=>e.preventDefault());
F('phone').addEventListener('input',e=>{let d=e.target.value.replace(/\D/g,'');if(d[0]==='8')d='7'+d.slice(1);if(d&&d[0]!=='7')d='7'+d;d=d.slice(0,11);let o='';if(d){o='+7';if(d.length>1)o+=' ('+d.slice(1,4);if(d.length>4)o+=') '+d.slice(4,7);if(d.length>7)o+='-'+d.slice(7,9);if(d.length>9)o+='-'+d.slice(9,11)}e.target.value=o});
F('zip').addEventListener('input',e=>e.target.value=e.target.value.replace(/\D/g,'').slice(0,6));
G('checkoutModal').addEventListener('click',async e=>{const b=e.target.closest('[data-copy]');if(b){showToast(await copy(b.dataset.copy)?L('СКОПИРОВАНО ✓','COPIED ✓'):L('НЕ УДАЛОСЬ СКОПИРОВАТЬ','COULD NOT COPY'))}});
G('kcOkTg').onclick=async()=>{const ok=await copy(lastSummary);showToast(ok?L('ЗАКАЗ СКОПИРОВАН — ВСТАВЬ ЕГО В ЧАТ','ORDER COPIED — PASTE IT IN THE CHAT'):L('ОТКРЫВАЮ TELEGRAM','OPENING TELEGRAM'));window.open(KC.tg,'_blank','noopener')};
$('#langToggle').addEventListener('click',()=>{if(!G('kcFlow').hidden)render();if(!G('checkoutSuccessView').hidden)finishLang()});
function finishLang(){}
render();
})();
