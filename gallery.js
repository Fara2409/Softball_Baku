/* Галерея команды вверху главной (16.11.2026) — вместо ленты новостей MLB.
   Данные — data/gallery.json: items [{type:'photo'|'video', src, thumb, title:{ru,az,en}, date}], файлы в gallery/.
   Карусель как у новостей: стрелки + медленная автопрокрутка (CSS transform). Видео в карточке — без звука,
   крутятся, только пока карточка на экране. Нажатие — просмотр на весь экран (видео со звуком). */
(function(){
  Object.assign(I18N.ru,{glTitle:'Галерея',glHint:'фото и видео команды',glClose:'Закрыть'});
  Object.assign(I18N.az,{glTitle:'Qalereya',glHint:'komandanın foto və videoları',glClose:'Bağla'});
  Object.assign(I18N.en,{glTitle:'Gallery',glHint:'team photos and videos',glClose:'Close'});
  const G={items:null};
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const ttl=x=>esc((x.title&&(x.title[LANG]||x.title.ru))||'');
  const dt=x=>{ try{ return x.date?fmtDate(x.date):''; }catch(e){ return x.date||''; } };
  function load(){
    if(G.items||G.loading) return; G.loading=true;
    fetch('data/gallery.json?t='+Math.floor(Date.now()/600e3),{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
      G.items=(d&&Array.isArray(d.items))?d.items.filter(x=>x&&x.src):[]; G.loading=false; draw();
    }).catch(()=>{G.items=[];G.loading=false;});
  }
  const PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
  function block(){
    if(!G.items||!G.items.length) return '';
    const card=(x,i)=>`<button type="button" class="nw-card gl-card" onclick="glOpen(${i})">
      <span class="nw-img gl-img">${x.type==='video'
        ?`<video src="${esc(x.src)}" poster="${esc(x.thumb||'')}" muted playsinline preload="none"></video><b class="gl-play">${PLAY}</b>`
        :`<img src="${esc(x.thumb||x.src)}" alt="${ttl(x)}" loading="lazy">`}</span>
      <span class="nw-body"><span class="nw-t">${ttl(x)}</span><span class="nw-when">${dt(x)}</span></span></button>`;
    return `<div class="section-title nw-head"><h2>${T('glTitle')}</h2><span class="hint">${T('glHint')}</span></div>
      <div class="nw-wrap gl-wrap"><button type="button" class="nw-arr nw-prev" aria-label="‹" onclick="glScroll(this,-1)" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="nw-row" onscroll="glArrows(this)"><div class="nw-track">${G.items.map(card).join('')}</div></div>
      <button type="button" class="nw-arr nw-next" aria-label="›" onclick="glScroll(this,1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div>`;
  }
  window.glScroll=(btn,dir)=>{ const row=btn.parentNode.querySelector('.nw-row'); if(row._freeze) row._freeze(); row.scrollBy({left:dir*Math.max(260,row.clientWidth*0.85),behavior:'smooth'}); };
  window.glArrows=row=>{ const w=row.parentNode, max=row.scrollWidth-row.clientWidth-4;
    if(w.classList.contains('nw-anim')){ w.querySelector('.nw-prev').hidden=false; w.querySelector('.nw-next').hidden=false; w.classList.remove('at-start','at-end'); return; }
    w.querySelector('.nw-prev').hidden=row.scrollLeft<=4; w.querySelector('.nw-next').hidden=row.scrollLeft>=max;
    w.classList.toggle('at-start',row.scrollLeft<=4); w.classList.toggle('at-end',row.scrollLeft>=max); };
  // автопрокрутка — та же схема, что была у новостей (см. news.js): медленно к концу, пауза, плавно назад
  const SPEED=18, GO=.78, START=.03;
  function auto(row){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tr=row.querySelector('.nw-track'); if(!tr) return;
    let dist=0, dur=0, idle=0;
    const measure=()=>{ dist=Math.max(0,tr.scrollWidth-row.clientWidth); dur=dist/SPEED/GO; };
    const play=pos=>{ measure(); if(dist<20){ tr.classList.remove('nw-run'); row.parentNode.classList.remove('nw-anim'); glArrows(row); return; }
      const t=START+Math.min(1,Math.max(0,pos/dist))*GO;
      tr.style.setProperty('--nw-dist',`-${dist}px`); tr.style.setProperty('--nw-dur',`${dur.toFixed(1)}s`);
      tr.style.animationDelay=`-${(t*dur).toFixed(2)}s`;
      row.scrollLeft=0; tr.classList.remove('nw-run'); void tr.offsetWidth; tr.classList.add('nw-run');
      row.parentNode.classList.add('nw-anim'); glArrows(row); };
    const freeze=()=>{ clearTimeout(idle); idle=setTimeout(()=>{ if(!document.querySelector('.gl-box')) play(row.scrollLeft); },8000);
      if(!tr.classList.contains('nw-run')) return;
      const m=new DOMMatrixReadOnly(getComputedStyle(tr).transform), x=-m.m41;
      tr.classList.remove('nw-run'); row.parentNode.classList.remove('nw-anim'); row.scrollLeft=x; glArrows(row); };
    row._freeze=freeze;
    ['touchstart','wheel','pointerdown'].forEach(ev=>row.addEventListener(ev,freeze,{passive:true}));
    window.addEventListener('resize',()=>{ if(tr.classList.contains('nw-run')) freeze(); });
    play(0);
  }
  // видео в карточках — по очереди, без звука: одно закончилось — начинается следующее, после последнего снова первое.
  // Пока галерея не видна на экране (или открыт просмотр на весь экран) — пауза.
  function watchVideos(box){
    const vids=[...box.querySelectorAll('.gl-card video')]; if(!vids.length) return;
    let cur=0, seen=true;
    const busy=()=>!seen||document.hidden||document.querySelector('.gl-box');
    const play=i=>{ cur=(i+vids.length)%vids.length;
      vids.forEach((v,k)=>{ const on=k===cur; v.closest('.gl-card').classList.toggle('gl-on',on); if(!on&&!v.paused) v.pause(); });
      const v=vids[cur]; if(busy()) return; if(v.preload==='none') v.preload='auto'; v.play().catch(()=>{}); };
    vids.forEach((v,k)=>v.addEventListener('ended',()=>{ v.currentTime=0; play(k+1); }));
    box._glResume=()=>play(cur); box._glPause=()=>vids.forEach(v=>v.pause());
    if('IntersectionObserver' in window){
      new IntersectionObserver(es=>es.forEach(e=>{ seen=e.isIntersecting; seen?play(cur):box._glPause(); }),{threshold:.2}).observe(box);
    }
    document.addEventListener('visibilitychange',()=>{ document.hidden?box._glPause():play(cur); });
    play(0);
  }
  // просмотр на весь экран
  window.glOpen=i=>{
    const x=G.items&&G.items[i]; if(!x) return;
    const row=document.querySelector('.gl-wrap .nw-row'); if(row&&row._freeze) row._freeze();
    const sec=document.querySelector('.gallery-sec'); if(sec&&sec._glPause) sec._glPause();
    const n=G.items.length, d=document.createElement('div'); d.className='gl-box';
    d.innerHTML=`<div class="gl-stage">${x.type==='video'?`<video src="${esc(x.src)}" poster="${esc(x.thumb||'')}" controls autoplay playsinline></video>`:`<img src="${esc(x.src)}" alt="${ttl(x)}">`}
      <div class="gl-cap"><b>${ttl(x)}</b> · ${dt(x)} <span>${i+1} / ${n}</span></div></div>
      <button type="button" class="gl-x" aria-label="${T('glClose')}">×</button>
      ${n>1?`<button type="button" class="gl-nav gl-l" aria-label="‹"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button type="button" class="gl-nav gl-r" aria-label="›"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>`:''}`;
    const close=()=>{ d.remove(); document.removeEventListener('keydown',key); document.body.style.overflow=''; const sec=document.querySelector('.gallery-sec'); if(sec&&sec._glResume&&!document.querySelector('.gl-box')) setTimeout(()=>sec._glResume(),0); };
    const go=k=>{ close(); glOpen((i+k+n)%n); };
    const key=e=>{ if(e.key==='Escape') close(); else if(e.key==='ArrowRight') go(1); else if(e.key==='ArrowLeft') go(-1); };
    d.addEventListener('click',e=>{ if(e.target===d||e.target.classList.contains('gl-stage')) close(); });
    d.querySelector('.gl-x').onclick=close;
    if(n>1){ d.querySelector('.gl-l').onclick=()=>go(-1); d.querySelector('.gl-r').onclick=()=>go(1); }
    // свайп влево / вправо на телефоне
    let sx=null; d.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; },{passive:true});
    d.addEventListener('touchend',e=>{ if(sx==null) return; const dx=e.changedTouches[0].clientX-sx; sx=null; if(Math.abs(dx)>60&&n>1&&!(e.target.tagName==='VIDEO'&&Math.abs(dx)<120)) go(dx<0?1:-1); },{passive:true});
    document.addEventListener('keydown',key); document.body.style.overflow='hidden'; document.body.appendChild(d);
  };
  function isHome(){ const h=(location.hash||'').slice(1), page=h.split('-')[0], FR=window.FEATURE_ROUTES||{}; return !page||page==='rating'||(!['player','game','games'].includes(page)&&!FR[page]); }
  function draw(){
    const a=document.getElementById('app'); if(!a||!isHome()||!S.league) return;
    let box=a.querySelector('.gallery-sec'); const h=block(); if(!h){ if(box) box.remove(); return; }
    if(!box){ box=document.createElement('div'); box.className='gallery-sec'; a.prepend(box); }
    box.innerHTML=h;
    const row=box.querySelector('.nw-row'); if(row){ requestAnimationFrame(()=>glArrows(row)); auto(row); }
    watchVideos(box);
  }
  const _route=route; route=function(){ _route(); if(isHome()){ load(); draw(); } };
})();
