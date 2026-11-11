/* Блок «Новости бейсбола» вверху главной (11.11.2026).
   Данные — data/news.json, его каждые 2 часа обновляет GitHub Actions (tools/fetch_news.py: MLB.com + ESPN MLB).
   Заголовки на английском — так в источниках; ссылки открываются на сайте источника. */
(function(){
  Object.assign(I18N.ru,{nwTitle:'Новости бейсбола',nwHint:'MLB · на английском',nwAgo:{m:n=>`${n} мин назад`,h:n=>`${n} ч назад`,d:n=>`${n} дн. назад`},nwMore:'Ещё на MLB.com'});
  Object.assign(I18N.az,{nwTitle:'Beysbol xəbərləri',nwHint:'MLB · ingilis dilində',nwAgo:{m:n=>`${n} dəq əvvəl`,h:n=>`${n} saat əvvəl`,d:n=>`${n} gün əvvəl`},nwMore:'MLB.com-da daha çox'});
  Object.assign(I18N.en,{nwTitle:'Baseball news',nwHint:'from MLB.com and ESPN',nwAgo:{m:n=>`${n} min ago`,h:n=>`${n}h ago`,d:n=>`${n}d ago`},nwMore:'More on MLB.com'});
  const N={items:null,at:0};
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function ago(iso){
    if(!iso) return ''; const s=(Date.now()-new Date(iso).getTime())/1000, A=T('nwAgo');
    if(!(s>=0)) return ''; if(s<3600) return A.m(Math.max(1,Math.round(s/60))); if(s<86400) return A.h(Math.round(s/3600)); return A.d(Math.round(s/86400));
  }
  function load(){
    if(N.items||N.loading) return; N.loading=true;
    fetch('data/news.json?t='+Math.floor(Date.now()/600e3),{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
      N.items=(d&&Array.isArray(d.items))?d.items.filter(x=>x&&x.title&&/^https?:/.test(x.link)).slice(0,10):[];
      N.loading=false; draw();
    }).catch(()=>{N.items=[];N.loading=false;});
  }
  function block(){
    if(!N.items||!N.items.length) return '';
    const card=x=>`<a class="nw-card" href="${esc(x.link)}" target="_blank" rel="noopener">
      <span class="nw-img"><i class="nw-ph">${(window.SBI||(()=>''))('ball',46,1.3)}</i>${x.image?`<img src="${esc(x.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:''}<b class="nw-src nw-${esc((x.source||'').toLowerCase())}">${esc(x.source)}</b></span>
      <span class="nw-body"><span class="nw-t">${esc(x.title)}</span><span class="nw-when">${ago(x.date)}</span></span></a>`;
    return `<div class="section-title nw-head"><h2>${(window.SBI||(()=>''))('ball',26,2.2)}${T('nwTitle')}</h2><span class="hint">${T('nwHint')}</span></div>
      <div class="nw-row">${N.items.map(card).join('')}<a class="nw-card nw-more" href="https://www.mlb.com/news" target="_blank" rel="noopener"><span>${T('nwMore')} →</span></a></div>`;
  }
  function isHome(){ const h=(location.hash||'').slice(1), page=h.split('-')[0], FR=window.FEATURE_ROUTES||{}; return !page||page==='rating'||(!['player','game','games'].includes(page)&&!FR[page]); }
  function draw(){
    const a=document.getElementById('app'); if(!a||!isHome()||!S.league) return;
    let box=a.querySelector('.news-sec'); const h=block(); if(!h){ if(box) box.remove(); return; }
    if(!box){ box=document.createElement('div'); box.className='news-sec'; a.prepend(box); }
    box.innerHTML=h;
  }
  const _route=route; route=function(){ _route(); if(isHome()){ load(); draw(); } };
})();
