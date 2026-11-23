/* product window: the short line (fit / colour) and material now live here, not under the card */
(()=>{
const DESC_RU={9:'Вымытый чёрный / свободный оверсайз-крой',10:'Графика «Аркана» / широкий крой',11:'Вымытый чёрный / модульные детали',12:'Броня-техвир / чёрный и неоново-зелёный',13:'По мотивам Aegis / утилитарный ремень',14:'Астральный техвир / худи на молнии',15:'Зимние перчатки / золотые броневые детали',16:'Готическое кольцо / тёмные кристаллы',17:'Космическое свечение / аксессуар по мотивам Wisp',18:'Тёмное фэнтези-техвир / силуэт с шипами'};
const L=(r,e)=>lang==='ru'?r:e;
KM.detail.push(function(id){try{
 const p=products.find(x=>x.id===id);const box=document.querySelector('.detail-info');if(!p||!box)return;
 let b=box.querySelector('.km-dmeta');if(!b){b=document.createElement('div');b.className='km-dmeta';const d=box.querySelector('.detail-description,.detail-desc,p');(d&&d.after?d:box.querySelector('h2,h3')||box.firstElementChild).after?null:null;
  const anchor=box.querySelector('.detail-price')||box.querySelector('[id=detailProductPrice]');box.insertBefore(b,anchor?anchor.nextSibling:box.children[2]||null)}
 const tag=L('ПОСАДКА И ЦВЕТ','FIT & COLOUR');
 b.innerHTML=`<p class="km-dm-k">${tag}</p><p class="km-dm-v">${lang==='ru'&&DESC_RU[p.id]?DESC_RU[p.id]:String(p.desc||'')}</p>${p.mat?`<p class="km-dm-k">${L('МАТЕРИАЛ','MATERIAL')}</p><p class="km-dm-v">${p.mat}</p>`:''}`;
}catch(_){}});
})();
