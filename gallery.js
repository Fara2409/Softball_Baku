/* Галерея команды вверху главной (16.11.2026) — вместо ленты новостей MLB.
   Данные — data/gallery.json: items [{type:'photo'|'video', src, thumb, title:{ru,az,en}, date}], файлы в gallery/.
   Карусель как у новостей: стрелки + медленная автопрокрутка (CSS transform). Видео в карточке — без звука,
   крутятся, только пока карточка на экране. Нажатие — просмотр на весь экран (видео со звуком). */
(function(){
  Object.assign(I18N.ru,{bdTitle:n=>`С днём рождения, ${n}!`,bdWish:'Команда Softball Baku поздравляет! Здоровья, удачи и побольше хоум-ранов ⚾',bdToday:'Сегодня день рождения',glTitle:'Галерея',glHint:'фото и видео команды',glClose:'Закрыть',hrKick:'Любительский софтбол · Баку',hrTitle:'Наша команда',hrSub:'Две команды — Bina Warriors и Gilavar Baku — и одна большая семья. Играем в Амирджане, Баку.',hrPl:'игроков',hrGm:'игр',hrRt:'Рейтинг игроков',hrPh:'Фото целиком'});
  Object.assign(I18N.az,{bdTitle:n=>`Ad günün mübarək, ${n}!`,bdWish:'Softball Baku komandası təbrik edir! Cansağlığı, uğurlar və daha çox hom-ran ⚾',bdToday:'Bu gün ad günüdür',glTitle:'Qalereya',glHint:'komandanın foto və videoları',glClose:'Bağla',hrKick:'Həvəskar softbol · Bakı',hrTitle:'Komandamız',hrSub:'İki komanda — Bina Warriors və Gilavar Baku — və bir böyük ailə. Əmircanda, Bakıda oynayırıq.',hrPl:'oyunçu',hrGm:'oyun',hrRt:'Oyunçu reytinqi',hrPh:'Tam foto'});
  Object.assign(I18N.en,{bdTitle:n=>`Happy birthday, ${n}!`,bdWish:'Softball Baku wishes you health, luck and lots of home runs ⚾',bdToday:'Birthday today',glTitle:'Gallery',glHint:'team photos and videos',glClose:'Close',hrKick:'Amateur softball · Baku',hrTitle:'Our team',hrSub:'Two teams — Bina Warriors and Gilavar Baku — and one big family. We play in Əmircan, Baku.',hrPl:'players',hrGm:'games',hrRt:'Player rating',hrPh:'Full photo'});
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
  // Поздравление с днём рождения (19.11.2026): в players.json поле birthday "ММ-ДД" (без года).
  // В этот день по времени Баку карточка встаёт в галерею сразу после фото «Наша команда».
  function bdays(){
    const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Baku'}).slice(5);  // ММ-ДД
    const out=Object.values(S.players||{}).filter(p=>p.birthday===today), have=new Set(out.map(p=>p.id));
    // из аккаунтов (birthdays_on): игроки — с фото из состава; остальные — по имени
    if(G.bd&&G.bd.md===today) for(const r of G.bd.list){ if(r.player_id&&S.players[r.player_id]){ if(!have.has(r.player_id)){ out.push(S.players[r.player_id]); have.add(r.player_id); } }
      else if(r.display_name&&!out.some(x=>x.fan&&x.name===r.display_name)) out.push({fan:true,name:r.display_name,id:''}); }
    return out;
  }
  const CONF='🎉🎂🎈⚾🎊';
  function bdCard(p){
    const nmx=p.fan?esc(p.name):esc(pname(p));
    const ph=p.photo?`<img class="bd-ph" src="${esc(p.photo)}" alt="">`:`<span class="bd-ph bd-num">${p.fan?esc((p.name||'?').trim()[0]||'?').toUpperCase():esc(p.number)}</span>`;
    return `<a class="nw-card gl-card gl-bday" ${p.fan?'':`href="#player-${esc(p.id)}"`}><span class="nw-img gl-img bd-img">
      ${[...Array(14)].map((_,k)=>`<i class="bd-c" style="--x:${(k*37)%100}%;--d:${(k%7)*0.45}s;--r:${(k*53)%360}deg;--h:${(k*47)%360}"></i>`).join('')}
      <span class="bd-ring">${ph}</span><span class="bd-emo">🎂</span></span>
      <span class="nw-body"><span class="bd-kicker">${T('bdToday')}</span><span class="nw-t">${T('bdTitle')(nmx)} 🎉</span><span class="nw-when">${T('bdWish')}</span></span></a>`;
  }
  function fetchBd(){
    const c=window.CL&&CL.ctx?CL.ctx().C:null; if(!c||!c.ok||!c.sb) return false;
    const md=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Baku'}).slice(5);
    if(G.bd&&G.bd.md===md) return true; G.bd={md,list:[]};
    c.sb.rpc('birthdays_on',{p_md:md}).then(r=>{ if(!r.error&&Array.isArray(r.data)&&r.data.length){ G.bd.list=r.data; draw(); } });
    return true;
  }
  window.glBdayRefresh=()=>{ G.bd=null; fetchBd(); };
  // Большое фото команды в самом верху главной (20.11.2026): элемент gallery.json с "hero":true
  const pl=(n,k)=>{ if(LANG==='az') return k==='pl'?'oyunçu':'oyun'; if(LANG==='en') return (k==='pl'?'player':'game')+(n===1?'':'s');
    const f=k==='pl'?['игрок','игрока','игроков']:['игра','игры','игр'], a=n%100, b=n%10;
    return f[a>10&&a<20?2:b===1?0:b>=2&&b<=4?1:2]; };
  window.glToRating=()=>{ const tw=document.querySelector('#app .tablewrap'); if(!tw) return false;
    const t=(tw.previousElementSibling&&tw.previousElementSibling.classList.contains('section-title'))?tw.previousElementSibling:tw;
    let off=8; document.querySelectorAll('.top, header').forEach(h=>{ const cs=getComputedStyle(h); if(cs.position==='sticky'||cs.position==='fixed') off=Math.max(off,h.getBoundingClientRect().bottom+8); });
    scrollTo({top:t.getBoundingClientRect().top+scrollY-off,behavior:'smooth'}); return false; };
  // фото команды — встроено, чтобы рисовать сразу, не дожидаясь gallery.json (страница не «прыгает» при загрузке)
  const HERO={hero:true,type:'photo',src:'gallery/team-1.jpg',webp:['gallery/team-1-800.webp','gallery/team-1-1200.webp'],title:{ru:'Наша команда',az:'Komandamız',en:'Our team'}};
  // ссылки на YouTube и TikTok в углу фото команды (24.11.2026)
  function socPills(){
    const L=S.links||{}, I=window.SOC_ICON||{};
    const a=[['youtube','YouTube'],['tiktok','TikTok']].filter(([k])=>L[k]&&I[k]);
    return a.length?`<div class="hr-soc">${a.map(([k,n])=>`<a class="hr-soc-a" href="${esc(L[k])}" target="_blank" rel="noopener" aria-label="${n}">${I[k]}<span>${n}</span></a>`).join('')}</div>`:'';
  }
  function hero(){
    let i=(G.items||[]).findIndex(x=>x.hero); if(i<0&&G.items) return '';
    const x=i<0?HERO:G.items[i], np=Object.keys(S.players||{}).length, ng=(S.games||[]).length;
    return `<section class="gl-hero"><img src="${esc(x.webp?x.webp[0]:x.src)}" srcset="${x.webp?`${esc(x.webp[0])} 800w, ${esc(x.webp[1])} 1200w`:`${esc(x.thumb||x.src)} 800w, ${esc(x.src)} 1600w`}" sizes="(max-width:700px) 100vw, 1200px" width="1200" height="900" alt="${ttl(x)}" fetchpriority="high" onclick="glOpen(${Math.max(0,i)})">
      <div class="hr-shade"></div>${socPills()}
      <div class="hr-txt"><span class="hr-kick">${T('hrKick')}</span><h1>${T('hrTitle')}</h1><p>${T('hrSub')}</p>
        <div class="hr-stats"><span><b>${np}</b> ${pl(np,'pl')}</span><span><b>${ng}</b> ${pl(ng,'gm')}</span><span><b>2</b> ${LANG==='ru'?'команды':LANG==='az'?'komanda':'teams'}</span></div>
        <div class="hr-btns"><a class="hr-btn pri" href="#rating" onclick="return glToRating()">${T('hrRt')} ↓</a><button type="button" class="hr-btn" onclick="glOpen(${Math.max(0,i)})">${T('hrPh')}</button></div></div></section>`;
  }
  function block(){
    if(!G.items||!G.items.length) return '';
    const card=(x,i)=>`<button type="button" class="nw-card gl-card${x.special?' gl-'+esc(x.special):''}" onclick="glOpen(${i})">
      <span class="nw-img gl-img">${x.type==='video'
        ?`<video src="${esc(x.small||x.src)}" poster="${esc(x.poster||x.thumb||'')}" muted playsinline preload="none"></video><b class="gl-play">${PLAY}</b>`
        :`<img src="${esc(x.thumb||x.src)}" alt="${ttl(x)}" loading="lazy">`}</span>
      <span class="nw-body">${x.special==='az40'?'<i class="gl-flag"><b></b><b></b><b></b></i>':''}<span class="nw-t">${ttl(x)}</span><span class="nw-when">${x.sub?esc(x.sub[LANG]||x.sub.ru)+' · ':''}${dt(x)}</span></span></button>`;
    return `<div class="section-title nw-head"><h2>${T('glTitle')}</h2><span class="hint">${T('glHint')}</span></div>
      <div class="nw-wrap gl-wrap"><button type="button" class="nw-arr nw-prev" aria-label="‹" onclick="glScroll(this,-1)" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="nw-row" onscroll="glArrows(this)"><div class="nw-track">${bdays().map(bdCard).join('')}${G.items.map((x,i)=>x.hero?'':card(x,i)).join('')}</div></div>
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
    // кадр анимации только пока галерея на экране и идёт видео — иначе цикл останавливается (не грузит телефон)
    const live=()=>box.isConnected&&!manual&&st.on&&!document.hidden;
    const frame=()=>{ if(!live()){ raf=0; return; } raf=requestAnimationFrame(frame);
      if(st.cur!==lastCur){ if(lastCur>=0&&st.cur<lastCur) glide(1400); lastCur=st.cur; }
      if(maxX()<20){ tr.style.transform=''; return; }
      x=target(); tr.style.transform=`translate3d(${-x.toFixed(2)}px,0,0)`; };
    const auto=()=>{ manual=false; row.parentNode.classList.add('nw-anim'); setTimeout(()=>st.kick&&st.kick(),0);
      const s=row.scrollLeft; tr.style.transition=''; tr.style.transform=`translate3d(${-s}px,0,0)`; row.scrollLeft=0; void tr.offsetWidth;
      glide(1100); lastCur=st.cur; glArrows(row); };
    const freeze=()=>{ clearTimeout(idle); idle=setTimeout(auto,8000); if(manual) return; manual=true;
      const m=new DOMMatrixReadOnly(getComputedStyle(tr).transform), cx=-m.m41;
      tr.style.transition=''; tr.style.transform=''; row.parentNode.classList.remove('nw-anim'); row.scrollLeft=cx; glArrows(row); };
    row._freeze=freeze; st.kick=()=>{ if(!raf&&live()) raf=requestAnimationFrame(frame); };
    ['touchstart','wheel','pointerdown'].forEach(ev=>row.addEventListener(ev,freeze,{passive:true}));
    window.addEventListener('resize',()=>{ if(!manual){ tr.style.transition=''; } });
    row.parentNode.classList.add('nw-anim'); glArrows(row); frame();
  }
  // видео в карточках — по очереди, без звука: одно закончилось — начинается следующее, после последнего снова первое.
  // Пока галерея не видна на экране (или открыт просмотр на весь экран) — пауза.
  function watchVideos(box){
    const vids=[...box.querySelectorAll('.gl-card video')]; if(!vids.length) return;
    let cur=0, seen=true; const st={vids,cur:0}; box._glState=st;
    const cn=navigator.connection||{}, lite=cn.saveData||/(^|-)2g$/.test(cn.effectiveType||'');
    const busy=()=>!G.ready||lite||!seen||document.hidden||document.querySelector('.gl-box');
    const play=i=>{ cur=(i+vids.length)%vids.length; st.cur=cur;
      vids.forEach((v,k)=>{ const on=k===cur; v.closest('.gl-card').classList.toggle('gl-on',on); if(!on&&!v.paused) v.pause(); });
      const v=vids[cur]; st.on=!busy(); if(!st.on) return; if(v.preload==='none') v.preload='auto'; v.play().catch(()=>{}); st.kick&&st.kick(); };
    vids.forEach((v,k)=>v.addEventListener('ended',()=>{ v.currentTime=0; play(k+1); }));
    box._glResume=()=>play(cur); box._glPause=()=>{ st.on=false; vids.forEach(v=>v.pause()); };
    if('IntersectionObserver' in window){
      new IntersectionObserver(es=>es.forEach(e=>{ seen=e.isIntersecting; seen?play(cur):box._glPause(); }),{threshold:.2}).observe(box);
    }
    if(!G.vis){ G.vis=1; document.addEventListener('visibilitychange',()=>{ const b=document.querySelector('.gallery-sec'); if(!b||!b._glPause) return; document.hidden?b._glPause():b._glResume(); }); }
    if(!G.ready&&!G.wait){ G.wait=1; const go=()=>setTimeout(()=>{ G.ready=1; const b=document.querySelector('.gallery-sec'); b&&b._glResume&&b._glResume(); },2500);
      document.readyState==='complete'?go():addEventListener('load',go,{once:true}); }
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
  const np=()=>Object.keys(S.players||{}).length+'/'+(S.games||[]).length;
  function isHome(){ const h=(location.hash||'').slice(1), page=h.split('-')[0], FR=window.FEATURE_ROUTES||{}; return !page||page==='rating'||(!['player','game','games'].includes(page)&&!FR[page]); }
  function draw(){
    if(!fetchBd()) setTimeout(()=>{ if(fetchBd()) draw(); },1500);
    const a=document.getElementById('app'); if(!a||!isHome()||!S.league) return;
    let box=a.querySelector('.gallery-sec'); const h=G.items?block():`<div class="gl-skel"></div>`; if(!h){ if(box) box.remove(); return; }
    if(!box){ box=document.createElement('div'); box.className='gallery-sec'; a.prepend(box); }
    box.innerHTML=h;
    let hb=a.querySelector('.gl-hero-box'); const hh=hero();
    if(hh){ if(!hb){ hb=document.createElement('div'); hb.className='gl-hero-box'; a.prepend(hb); } if(hb.dataset.l!==LANG+np()){ hb.innerHTML=hh; hb.dataset.l=LANG+np(); } } else if(hb) hb.remove();
    const row=box.querySelector('.nw-row'); if(!row) return;
    watchVideos(box);
    if(row){ requestAnimationFrame(()=>glArrows(row)); follow(box,row); }
  }
  load();
  const _route=route; route=function(){ _route(); if(isHome()){ load(); draw(); } };
})();
