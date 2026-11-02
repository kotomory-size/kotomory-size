/* KOTOMORY loyalty card: cashback in points (1 point = 1 ruble). Stored in the visitor's browser (localStorage). */
(()=>{
/* ===== НАСТРОЙКИ — поменяй под себя ===== */
const CFG={
 welcome:150,          // подарок при получении карты, ₽
 maxPct:.30,           // сколько от суммы товаров можно оплатить баллами (30%)
 tiers:[               // уровень зависит от суммы всех покупок
  {n:['СТАРТ','START'],from:0,rate:.03},
  {n:['СЕРЕБРО','SILVER'],from:10000,rate:.05},
  {n:['ЗОЛОТО','GOLD'],from:25000,rate:.07}
 ]
};
window.KMLOYALTY_CFG=CFG;
const L=(r,e)=>lang==='ru'?r:e,mny=n=>typeof money==='function'?money(n):n+' ₽',el=h=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const KEY='kotomory-loyalty',rd=()=>{try{return JSON.parse(localStorage.getItem(KEY))||null}catch(_){return null}},save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){}};
let S=rd();
const has=()=>!!S,tIdx=()=>{let k=0;CFG.tiers.forEach((x,i)=>{if(S&&S.total>=x.from)k=i});return k},tier=()=>CFG.tiers[tIdx()],rate=()=>tier().rate,nextTier=()=>CFG.tiers[tIdx()+1];
const clampUse=(want,net)=>{if(!S)return 0;return Math.max(0,Math.min(Math.floor(want||0),S.bal,Math.floor(net*CFG.maxPct)))};
const maxUse=net=>clampUse(1e9,net);
const fmtNum=()=>'KTM '+[0,0].map(()=>String(Math.floor(1000+Math.random()*9000))).join(' ');
function create(name){if(S)return S;S={num:fmtNum(),name:(name||'').trim().toUpperCase().slice(0,22)||'KOTOMORY FAN',bal:CFG.welcome,total:0,hist:[],created:Date.now()};if(CFG.welcome)S.hist.unshift({t:'welcome',v:CFG.welcome,ts:Date.now()});save();paintAll();return S}
function commitOrder({order,used,paid}){const r=S?rate():CFG.tiers[0].rate,earn=Math.floor(paid*r),before=S?tIdx():0;if(!S)return{card:false,earn,rate:r};
 if(used>0){S.bal-=used;S.hist.unshift({t:'spend',v:-used,order,ts:Date.now()})}
 if(earn>0){S.bal+=earn;S.hist.unshift({t:'earn',v:earn,order,ts:Date.now()})}
 S.total+=paid;S.hist=S.hist.slice(0,40);save();paintAll();return{card:true,earn,rate:r,bal:S.bal,tier:tier(),levelUp:tIdx()>before,tierName:L(...tier().n)}}
function claimLast({order,paid,name}){create(name);const r=rate(),earn=Math.floor(paid*r);if(earn>0){S.bal+=earn;S.hist.unshift({t:'earn',v:earn,order,ts:Date.now()})}S.total+=paid;save();paintAll();return{card:true,earn,rate:r,bal:S.bal,tier:tier()}}

/* ---------- card visual + modal ---------- */
const C39={'0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn','4':'nnnwwnnnw','5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw','8':'wnnwnnwnn','9':'nnwwnnwnn','A':'wnnnnwnnw','B':'nnwnnwnnw','C':'wnwnnwnnn','D':'nnnnwwnnw','E':'wnnnwwnnn','F':'nnwnwwnnn','G':'nnnnnwwnw','H':'wnnnnwwnn','I':'nnwnnwwnn','J':'nnnnwwwnn','K':'wnnnnnnww','L':'nnwnnnnww','M':'wnwnnnnwn','N':'nnnnwnnww','O':'wnnnwnnwn','P':'nnwnwnnwn','Q':'nnnnnnwww','R':'wnnnnnwwn','S':'nnwnnnwwn','T':'nnnnwnwwn','U':'wwnnnnnnw','V':'nwwnnnnnw','W':'wwwnnnnnn','X':'nwnnwnnnw','Y':'wwnnwnnnn','Z':'nwwnwnnnn','-':'nwnnnnwnw','.':'wwnnnnwnn',' ':'nwwnnnwnn','*':'nwnnwnwnn'};
const barcode=t=>{const s='*'+String(t).toUpperCase()+'*';let x=0,r='';for(const ch of s){const p=C39[ch];if(!p)continue;for(let i=0;i<9;i++){const w=p[i]==='w'?3:1;if(i%2===0)r+=`<rect x="${x}" width="${w}" height="40"/>`;x+=w}x+=1}return `<svg viewBox="0 0 ${x} 40" preserveAspectRatio="none" role="img" aria-label="${esc(t)}">${r}</svg>`};
const copy=async t=>{try{await navigator.clipboard.writeText(t);return 1}catch(_){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();let ok=0;try{ok=document.execCommand('copy')}catch(_){}a.remove();return ok}};
const toast=m=>window.showToast&&showToast(m);
const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(16)};
const exportCode=()=>{const j=JSON.stringify({n:S.num,m:S.name,b:S.bal,t:S.total,c:S.created,h:S.hist.slice(0,10)});return 'KOTO1-'+btoa(unescape(encodeURIComponent(j))).replace(/=+$/,'')+'-'+hash(j)};
function importCode(code){try{const m=String(code).trim().match(/^KOTO1-([A-Za-z0-9+/]+)-([0-9a-f]+)$/);if(!m)return false;const js=decodeURIComponent(escape(atob(m[1])));if(hash(js)!==m[2])return false;const o=JSON.parse(js);
 if(!/^KTM \d{4} \d{4}$/.test(o.n)||!(o.b>=0&&o.b<1e7)||!(o.t>=0&&o.t<1e9))return false;S={num:o.n,name:String(o.m||'').slice(0,22),bal:Math.floor(o.b),total:Math.floor(o.t),hist:Array.isArray(o.h)?o.h.slice(0,10):[],created:o.c||Date.now()};save();paintAll();return true}catch(_){return false}}
const cardHTML=()=>{const k=tIdx(),t=tier();return `<div class="kl-card t${k}"><div class="kl-inner"><div class="kl-face kl-front"><i class="kl-glow"></i><div class="kl-top"><b>KOTOMORY</b><span>${L(...t.n)} · ${Math.round(t.rate*100)}%</span></div><div class="kl-chip"></div><div class="kl-num">${esc(S.num)}</div><div class="kl-bot"><div><small>${L('ВЛАДЕЛЕЦ','HOLDER')}</small><b>${esc(S.name)}</b></div><div class="kl-bal"><small>${L('БАЛЛЫ','POINTS')}</small><b>${mny(S.bal)}</b></div></div></div><div class="kl-face kl-back"><i class="kl-glow"></i><div class="kl-stripe"></div><div class="kl-bc">${barcode(S.num)}</div><p class="kl-bcn">${esc(S.num)}</p><p class="kl-bct">${L('Назови номер карты или покажи код менеджеру','Tell the card number or show the code to the manager')}</p></div></div></div><p class="kl-flipHint">${L('Нажми на карту, чтобы перевернуть','Tap the card to flip it')}</p>`};
const ov=el('<div class="kl-ov" hidden role="dialog" aria-modal="true"><div class="kl-box"><button type="button" class="kl-x" aria-label="Close">✕</button><div class="kl-in"></div></div></div>');document.body.append(ov);
const inn=ov.querySelector('.kl-in');
const fmtD=ts=>new Date(ts).toLocaleDateString(lang==='ru'?'ru-RU':'en-GB',{day:'2-digit',month:'2-digit'});
const importBlock=()=>`<details class="kl-set"><summary>${L('УЖЕ ЕСТЬ КАРТА? ВОССТАНОВИТЬ ПО КОДУ','ALREADY HAVE A CARD? RESTORE BY CODE')}</summary><textarea id="klImp" rows="3" placeholder="KOTO1-…"></textarea><button type="button" class="kl-sm" data-a="import">${L('ВОССТАНОВИТЬ','RESTORE')}</button></details>`;
function paintModal(){const wasOpen=inn.querySelector('.kl-set')&&inn.querySelector('.kl-set').open;
 if(!S){let nm='';try{nm=(JSON.parse(localStorage.getItem('kotomory-checkout'))||{}).name||''}catch(_){}
  inn.innerHTML=`<p class="eyebrow">KOTOMORY / LOYALTY</p><h2>${L('КАРТА ЛОЯЛЬНОСТИ','LOYALTY CARD')}</h2><p class="kl-sub">${L('Получай кешбек баллами с каждого заказа и оплачивай ими часть следующих покупок. 1 балл = 1 ₽.','Earn cashback in points on every order and pay for part of your next purchases with them. 1 point = 1 ₽.')}</p>
  <ul class="kl-list">${CFG.tiers.map(t=>`<li><b>${L(...t.n)}</b> — ${Math.round(t.rate*100)}% ${L('кешбека','cashback')}${t.from?`, ${L('от','from')} ${mny(t.from)} ${L('покупок','in purchases')}`:''}</li>`).join('')}${CFG.welcome?`<li><b>+${mny(CFG.welcome)}</b> ${L('в подарок сразу после получения карты','as a welcome gift')}</li>`:''}<li>${L('Баллами можно оплатить до','Pay up to')} ${Math.round(CFG.maxPct*100)}% ${L('стоимости товаров','of the items price')}</li></ul>
  <label class="kl-in-f"><span>${L('ИМЯ НА КАРТЕ','NAME ON CARD')}</span><input id="klName" maxlength="22" value="${esc(nm)}" placeholder="EGOR ROZOV"></label><button type="button" class="kl-go" data-a="create">${L('ПОЛУЧИТЬ КАРТУ','GET THE CARD')}${CFG.welcome?` +${mny(CFG.welcome)}`:''}</button>${importBlock()}`;return}
 const t=tier(),nx=nextTier(),pct=nx?Math.min(100,(S.total-t.from)/(nx.from-t.from)*100):100;
 inn.innerHTML=`<p class="eyebrow">KOTOMORY / LOYALTY</p><h2>${L('МОЯ КАРТА','MY CARD')}</h2>${cardHTML()}
 <div class="kl-stats"><div><small>${L('КЕШБЕК','CASHBACK')}</small><b>${Math.round(t.rate*100)}%</b></div><div><small>${L('ВСЕГО ПОКУПОК','TOTAL SPENT')}</small><b>${mny(S.total)}</b></div><div><small>${L('МАКС. СПИСАНИЕ','MAX PAYMENT')}</small><b>${Math.round(CFG.maxPct*100)}%</b></div></div>
 <div class="kl-prog"><i style="transform:scaleX(${pct/100})"></i></div><p class="kl-hint">${nx?`${L('До уровня','To the')} ${L(...nx.n)} ${L('осталось покупок на','level: spend')} ${mny(nx.from-S.total)}`:L('У тебя максимальный уровень ✦','You have the top level ✦')}</p>
 <p class="kl-h">${L('ИСТОРИЯ','HISTORY')}</p><ul class="kl-hist">${S.hist.length?S.hist.slice(0,12).map(h=>`<li class="${h.v>0?'p':'m'}"><span>${fmtD(h.ts)}</span><em>${h.t==='welcome'?L('Подарок за карту','Welcome gift'):h.t==='earn'?L('Кешбек за заказ','Cashback')+' '+esc(h.order||''):L('Оплата баллами','Paid with points')+' '+esc(h.order||'')}</em><b>${h.v>0?'+':'−'}${mny(Math.abs(h.v))}</b></li>`).join(''):`<li><em>${L('Пока пусто — самое время сделать заказ','Nothing yet — time for your first order')}</em></li>`}</ul>
 <button type="button" class="kl-go" data-a="shop">${L('ПЕРЕЙТИ К ПОКУПКАМ ↗','GO SHOPPING ↗')}</button>
 <details class="kl-set"><summary>${L('НАСТРОЙКИ КАРТЫ','CARD SETTINGS')}</summary>
  <label class="kl-in-f"><span>${L('ИМЯ НА КАРТЕ','NAME ON CARD')}</span><input id="klName2" maxlength="22" value="${esc(S.name)}"></label>
  <div class="kl-row"><button type="button" class="kl-sm" data-a="rename">${L('СОХРАНИТЬ ИМЯ','SAVE NAME')}</button><button type="button" class="kl-sm" data-a="copynum">${L('КОПИРОВАТЬ НОМЕР','COPY NUMBER')}</button></div>
  <p class="kl-h">${L('ПЕРЕНОС НА ДРУГОЕ УСТРОЙСТВО','MOVE TO ANOTHER DEVICE')}</p><p class="kl-hint">${L('Карта хранится в этом браузере. Скопируй код, сохрани его и вставь на другом устройстве, чтобы восстановить карту.','The card is stored in this browser. Copy the code, save it and paste it on another device to restore the card.')}</p>
  <button type="button" class="kl-sm" data-a="export">${L('СКОПИРОВАТЬ КОД КАРТЫ','COPY CARD CODE')}</button>
  <textarea id="klImp" rows="2" placeholder="KOTO1-…"></textarea><button type="button" class="kl-sm" data-a="import">${L('ВОССТАНОВИТЬ ПО КОДУ','RESTORE BY CODE')}</button>
  <button type="button" class="kl-sm danger" data-a="del">${L('УДАЛИТЬ КАРТУ','DELETE CARD')}</button></details>`;
 if(wasOpen)inn.querySelector('.kl-set').open=true;
 const c=inn.querySelector('.kl-card');if(c&&matchMedia('(hover:hover) and (pointer:fine)').matches){c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*12+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*12+'deg')});c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')})}}
const open=()=>{paintModal();ov.hidden=false};
inn.addEventListener('click',async e=>{const card=e.target.closest('.kl-card');if(card){card.classList.toggle('flip');return}
 const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
 if(k==='create'){create(inn.querySelector('#klName').value);paintModal();toast(L('КАРТА ГОТОВА ✦','CARD READY ✦'))}
 else if(k==='shop'){ov.hidden=true;$('#shop').scrollIntoView({behavior:'smooth'})}
 else if(k==='rename'){const v=inn.querySelector('#klName2').value.trim().toUpperCase().slice(0,22);if(v){S.name=v;save();paintAll();toast(L('ИМЯ СОХРАНЕНО','NAME SAVED'))}}
 else if(k==='copynum')toast(await copy(S.num)?L('НОМЕР СКОПИРОВАН','NUMBER COPIED'):L('НЕ УДАЛОСЬ СКОПИРОВАТЬ','COULD NOT COPY'));
 else if(k==='export')toast(await copy(exportCode())?L('КОД КАРТЫ СКОПИРОВАН — СОХРАНИ ЕГО','CARD CODE COPIED — KEEP IT'):L('НЕ УДАЛОСЬ СКОПИРОВАТЬ','COULD NOT COPY'));
 else if(k==='import'){const ok=importCode(inn.querySelector('#klImp').value);toast(ok?L('КАРТА ВОССТАНОВЛЕНА ✦','CARD RESTORED ✦'):L('КОД НЕ ПОДОШЁЛ — ПРОВЕРЬ, ЧТО СКОПИРОВАН ПОЛНОСТЬЮ','THE CODE DID NOT WORK — CHECK THAT IT IS COPIED IN FULL'))}
 else if(k==='del'){if(!a._c){a._c=1;const o=a.textContent;a.textContent=L('ТОЧНО УДАЛИТЬ?','REALLY DELETE?');setTimeout(()=>{a._c=0;a.textContent=o},3000);return}S=null;try{localStorage.removeItem(KEY)}catch(_){}paintAll();paintModal();toast(L('КАРТА УДАЛЕНА','CARD DELETED'))}});
ov.querySelector('.kl-x').onclick=()=>ov.hidden=true;ov.addEventListener('click',e=>{if(e.target===ov)ov.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')ov.hidden=true});

/* ---------- buttons ---------- */
const fa=$('.fun-actions'),btn=el('<button type="button" id="klBtn" aria-label="Loyalty card"><b>▣</b> <span></span></button>');
const g=$('#kmGameBtn');if(fa){g?g.after(btn):fa.prepend(btn)}btn.onclick=open;
const head=el('<button type="button" id="klHead" class="text-btn" aria-label="Loyalty card"></button>');const wish=$('#kmWish');wish?wish.before(head):$('.header-actions')?.prepend(head);head.onclick=open;
let pq=0;const sched=()=>{if(!pq){pq=1;requestAnimationFrame(()=>{pq=0;paintPrev()})}};
function paintPrev(){const r=S?rate():CFG.tiers[0].rate;
 document.querySelectorAll('.product-card').forEach(c=>{const o=c.querySelector('[data-open-detail]'),p=o&&products.find(x=>x.id==o.dataset.openDetail);if(!p)return;let e=c.querySelector('.kl-cb');if(!e){e=document.createElement('button');e.type='button';e.className='kl-cb';e.onclick=open;const m=c.querySelector('.product-meta');m?m.after(e):c.querySelector('.product-info')?.after(e)}e.textContent=`▣ +${mny(Math.floor(p.price*r))} ${L('кешбек','cashback')}`});
 const dp=$('#detailProductPrice');if(dp&&typeof detailProductId!=='undefined'){const p=products.find(x=>x.id===detailProductId);let e=$('#klDetail');if(!e){e=document.createElement('button');e.type='button';e.id='klDetail';e.className='kl-cb';e.onclick=open;dp.after(e)}if(p)e.textContent=`▣ +${mny(Math.floor(p.price*r))} ${L('кешбек баллами','cashback in points')}`}
 const ct=$('#cartTotal');if(ct){let e=$('#klCart');if(!e){e=document.createElement('button');e.type='button';e.id='klCart';e.className='kl-cart';e.onclick=()=>{const cl=$('#cartClose');cl&&cl.click();open()};const tt=ct.closest('.total');tt&&tt.before(e)}const s=typeof cartSubtotal==='function'?cartSubtotal():0;e.hidden=!s;e.textContent=S?`▣ ${L('Кешбек за заказ','Cashback for this order')} ≈ +${mny(Math.floor(s*r))} · ${L('на карте','on card')} ${mny(S.bal)}`:`▣ ${L('С картой вернётся','With the card you get back')} ≈ ${mny(Math.floor(s*r))}${CFG.welcome?` + ${mny(CFG.welcome)} ${L('в подарок','as a gift')}`:''}`}}
function paintAll(){sched();const t=S?mny(S.bal):L('КАРТА','CARD');btn.querySelector('span').textContent=S?mny(S.bal):L('КАРТА','CARD');head.innerHTML=`▣ ${S?mny(S.bal):L('КАРТА','CARD')}`;if(!ov.hidden)paintModal()}

/* ---------- checkout block ---------- */
function renderCheckout(box,ctx){box._c=ctx;const st=S?'card':'none';
 if(box.dataset.st!==st){box.dataset.st=st;
  box.innerHTML=S?`<div class="kl-co"><p class="kl-t">▣ ${L('КАРТА ЛОЯЛЬНОСТИ','LOYALTY CARD')} · <b data-k="bal"></b></p><label class="kl-sl"><span>${L('Списать баллы','Use points')}: <b data-k="val">0 ₽</b></span><input type="range" min="0" max="0" step="1" value="0"></label><div class="kl-bt"><button type="button" data-a="all">${L('Списать максимум','Use maximum')}</button><button type="button" data-a="none">${L('Не списывать','Do not use')}</button></div><p class="kl-hint" data-k="hint"></p></div>`
   :`<div class="kl-co none"><p class="kl-t">▣ ${L('КАРТА ЛОЯЛЬНОСТИ','LOYALTY CARD')}</p><p class="kl-hint">${L('Кешбек баллами до','Cashback up to')} ${Math.round(CFG.tiers[CFG.tiers.length-1].rate*100)}% ${L('с каждого заказа','on every order')}. 1 ${L('балл','point')} = 1 ₽.${CFG.welcome?` ${L('Подарок','Gift')} +${mny(CFG.welcome)}.`:''}</p><button type="button" class="kl-get" data-a="get">${L('ПОЛУЧИТЬ КАРТУ','GET THE CARD')}${CFG.welcome?` +${mny(CFG.welcome)}`:''}</button></div>`;
  box.onclick=e=>{const a=e.target.closest('[data-a]');if(!a)return;const c=box._c;if(a.dataset.a==='get'){create(c.name);c.refresh()}else if(a.dataset.a==='all')c.setUse(maxUse(c.net));else if(a.dataset.a==='none')c.setUse(0)};
  const rg=box.querySelector('input[type=range]');if(rg)rg.oninput=()=>box._c.setUse(+rg.value)}
 if(S){const rg=box.querySelector('input[type=range]'),use=clampUse(ctx.use,ctx.net),mx=maxUse(ctx.net);rg.max=mx;rg.disabled=mx<1;rg.value=use;
  box.querySelector('[data-k=bal]').textContent=mny(S.bal);box.querySelector('[data-k=val]').textContent=mny(use);
  box.querySelector('[data-k=hint]').textContent=`${L('Начислим','You will earn')} ≈${mny(Math.floor((ctx.net-use)*rate()))} ${L('кешбека','cashback')} (${Math.round(rate()*100)}%) · ${L('можно списать до','up to')} ${mny(mx)}`}}
window.kmLoyalty={has,rate,clampUse,maxUse,create,commitOrder,claimLast,renderCheckout,open,cfg:CFG};
const gridEl=$('#productGrid');if(gridEl)new MutationObserver(sched).observe(gridEl,{childList:true});
const dpEl=$('#detailProductPrice');if(dpEl)new MutationObserver(sched).observe(dpEl,{childList:true,characterData:true,subtree:true});
const ctEl=$('#cartTotal');if(ctEl)new MutationObserver(sched).observe(ctEl,{childList:true,characterData:true,subtree:true});
$('#langToggle')?.addEventListener('click',()=>{paintAll()});
paintAll();
})();
