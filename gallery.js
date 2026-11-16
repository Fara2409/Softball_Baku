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
    const card=(x,i)=>`<button type="button" class="nw-card gl-card${x.special?' gl-'+esc(x.special):''}" onclick="glOpen(${i})">
      <span class="nw-img gl-img">${x.special==='az40'?`<i class="gl-bg" style="background-image:url('${esc(x.thumb)}')"></i>`:''}${x.type==='video'
        ?`<video src="${esc(x.src)}" poster="${esc(x.thumb||'')}" muted playsinline preload="none"></video><b class="gl-play">${PLAY}</b>`
        :`<img src="${esc(x.thumb||x.src)}" alt="${ttl(x)}" loading="lazy">`}</span>
      <span class="nw-body">${x.special==='az40'?'<i class="gl-flag"><b></b><b></b><b></b></i>':''}<span class="nw-t">${ttl(x)}</span><span class="nw-when">${x.sub?esc(x.sub[LANG]||x.sub.ru)+' · ':''}${dt(x)}</span></span></button>`;
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
  // Движение карусели вместе с видео (16.11.2026): пока играет видео i, лента плавно едет от карточки i к карточке i+1
  // и приходит к ней ровно к концу ролика; после последнего — плавный возврат к первому видео.
  // Двигаем transform у .nw-track (видеокарта, без «дрожания» на iPhone). Касание / колёсико / стрелки — лента
  // переходит на обычную прокрутку рукой, через 8 с без касаний плавно возвращается к играющему видео.
  function follow(box,row){
    const tr=row.querySelector('.nw-track'); if(!tr||!box._glState) return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards=[...tr.children], st=box._glState;
    let manual=false, idle=0, raf=0, x=0, lastCur=-1;
    const maxX=()=>Math.max(0,tr.scrollWidth-row.clientWidth);
    const pos=el=>Math.min(maxX(),Math.max(0,el.offsetLeft+el.offsetWidth/2-row.clientWidth/2));
    const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const glide=(ms)=>{ tr.style.transition=`transform ${ms}ms cubic-bezier(.45,0,.25,1)`; clearTimeout(glide.t); glide.t=setTimeout(()=>tr.style.transition='',ms+30); };
    const target=()=>{ const v=st.vids[st.cur], card=v.closest('.gl-card'), nx=st.vids[st.cur+1];
      const a=pos(card), b=nx?pos(nx.closest('.gl-card')):a, p=(v.duration>0)?Math.min(1,v.currentTime/v.duration):0;
      return a+(b-a)*ease(p); };
    const frame=()=>{ raf=requestAnimationFrame(frame); if(manual||!box.isConnected){ if(!box.isConnected) cancelAnimationFrame(raf); return; }
      if(st.cur!==lastCur){ if(lastCur>=0&&st.cur<lastCur) glide(1400); lastCur=st.cur; }
      if(maxX()<20){ tr.style.transform=''; return; }
      x=target(); tr.style.transform=`translate3d(${-x.toFixed(2)}px,0,0)`; };
    const auto=()=>{ manual=false; row.parentNode.classList.add('nw-anim');
      const s=row.scrollLeft; tr.style.transition=''; tr.style.transform=`translate3d(${-s}px,0,0)`; row.scrollLeft=0; void tr.offsetWidth;
      glide(1100); lastCur=st.cur; glArrows(row); };
    const freeze=()=>{ clearTimeout(idle); idle=setTimeout(auto,8000); if(manual) return; manual=true;
      const m=new DOMMatrixReadOnly(getComputedStyle(tr).transform), cx=-m.m41;
      tr.style.transition=''; tr.style.transform=''; row.parentNode.classList.remove('nw-anim'); row.scrollLeft=cx; glArrows(row); };
    row._freeze=freeze;
    ['touchstart','wheel','pointerdown'].forEach(ev=>row.addEventListener(ev,freeze,{passive:true}));
    window.addEventListener('resize',()=>{ if(!manual){ tr.style.transition=''; } });
    row.parentNode.classList.add('nw-anim'); glArrows(row); frame();
  }
  // видео в карточках — по очереди, без звука: одно закончилось — начинается следующее, после последнего снова первое.
  // Пока галерея не видна на экране (или открыт просмотр на весь экран) — пауза.
  function watchVideos(box){
    const vids=[...box.querySelectorAll('.gl-card video')]; if(!vids.length) return;
    let cur=0, seen=true; const st={vids,cur:0}; box._glState=st;
    const busy=()=>!seen||document.hidden||document.querySelector('.gl-box');
    const play=i=>{ cur=(i+vids.length)%vids.length; st.cur=cur;
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
      <div class="gl-cap"><b>${ttl(x)}</b>${x.sub?' · '+esc(x.sub[LANG]||x.sub.ru):''}${dt(x)?' · '+dt(x):''} <span>${i+1} / ${n}</span></div></div>
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
    const row=box.querySelector('.nw-row');
    watchVideos(box);
    if(row){ requestAnimationFrame(()=>glArrows(row)); follow(box,row); }
  }
  const _route=route; route=function(){ _route(); if(isHome()){ load(); draw(); } };
})();
