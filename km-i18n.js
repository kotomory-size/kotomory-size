/* KOTOMORY i18n patch: translates the strings that were still Russian-only when the language is EN (and back). */
(()=>{
const PAIRS=[
 ['ALL / ВСЁ','ALL'],['TOPS / ВЕРХ','TOPS'],['BOTTOMS / НИЗ','BOTTOMS'],['ACCESSORIES / АКСЕССУАРЫ','ACCESSORIES'],
 ['♡ ИЗБРАННОЕ','♡ FAVORITES'],['ЛИЧНЫЙ КАБИНЕТ','ACCOUNT'],
 ['Создай демо-аккаунт, чтобы сохранить данные в этом браузере.','Create a demo account to keep your data in this browser.'],
 ['СОЗДАТЬ АККАУНТ ↗','CREATE ACCOUNT ↗'],['Уже есть демо-аккаунт? Войти','Already have a demo account? Sign in'],
 ['Демо-режим: аккаунт хранится только в локальном браузере. Не используй настоящий пароль.','Demo mode: the account is stored only in this browser. Do not use a real password.'],
 ['КРУТИ','SPIN'],['Тяни мышью или пальцем, чтобы повернуть','Drag with mouse or finger to turn'],
 ['ПОДОБРАТЬ РАЗМЕР ПО РОСТУ И ВЕСУ ↗','FIND MY SIZE BY HEIGHT & WEIGHT ↗']
];
const CAT={'ФУТБОЛКА':'T-SHIRT','КУРТКА':'JACKET','ДЖИНСЫ':'JEANS','ХУДИ':'HOODIE','СУМКА':'BAG','ЗИП-ХУДИ':'ZIP HOODIE','ПЕРЧАТКИ':'GLOVES','КОЛЬЦО':'RING','БРАСЛЕТ':'BRACELET','НАКИДКА':'CAPE'};
const RU2EN=new Map(PAIRS),EN2RU=new Map(PAIRS.map(([r,e])=>[e,r]));
const SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','INPUT','NOSCRIPT']);
function fix(node,toEN){const t=node.nodeValue,k=t.trim();if(!k)return;let out=null;
 if(toEN){if(RU2EN.has(k))out=RU2EN.get(k);else{const m=k.match(/^([А-ЯЁ\- ]+) \/ (KTM-\d+)$/);if(m&&CAT[m[1]])out=`${CAT[m[1]]} / ${m[2]}`}}
 else if(EN2RU.has(k))out=EN2RU.get(k);
 if(out!=null&&out!==k)node.nodeValue=t.replace(k,out)}
function walk(root,toEN){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>SKIP.has(n.parentNode&&n.parentNode.nodeName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const list=[];while(w.nextNode())list.push(w.currentNode);list.forEach(n=>fix(n,toEN))}
let timer=0;const run=()=>{timer=0;walk(document.body,lang==='en')};
const later=()=>{if(!timer)timer=setTimeout(run,30)};
document.getElementById('langToggle')?.addEventListener('click',()=>setTimeout(run,60));
new MutationObserver(later).observe(document.body,{childList:true,subtree:true});
setTimeout(run,300);
})();
