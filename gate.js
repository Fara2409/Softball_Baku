/* Ограничения для незарегистрированных посетителей (16.11.2026, решение пользователя).
   Без входа в аккаунт НЕ видно: страница игрока (рейтинг в таблице на главной виден, а внутрь профиля — нельзя),
   протокол игры, «Моменты игры», карта ударов, онлайн-счёт (страница #live, значок в шапке и карточка на главной).
   Разбор рейтинга по эпизодам закрыт в rbreak.js. Всем по-прежнему видно: главная с таблицей рейтинга, лидеры,
   список игр, счёт по иннингам, таблицы команд, кнопка YouTube, рекорды, правила, галерея.
   Если онлайн-функции не загрузились (старый браузер — войти нельзя), ничего не закрываем. */
(function(){
  if(!window.CL||!CL.ctx) return;
  Object.assign(I18N.ru,{gtTitle:'Только для зарегистрированных пользователей',gtPlayer:'Профиль игрока — рейтинг по играм, разбор каждой игры, моменты на видео и карта ударов — доступен после регистрации.',
    gtGame:'Протокол игры, моменты на видео и карта ударов доступны зарегистрированным пользователям.',gtLive:'Онлайн-счёт игры доступен зарегистрированным пользователям.',gtLogin:'Войти',gtSignup:'Регистрация',gtFree:'Это бесплатно и занимает минуту — можно через Google.'});
  Object.assign(I18N.az,{gtTitle:'Yalnız qeydiyyatdan keçmiş istifadəçilər üçün',gtPlayer:'Oyunçu profili — oyunlar üzrə reytinq, hər oyunun təhlili, videodakı anlar və zərbə xəritəsi — qeydiyyatdan sonra açılır.',
    gtGame:'Oyunun protokolu, videodakı anlar və zərbə xəritəsi qeydiyyatdan keçmiş istifadəçilər üçündür.',gtLive:'Oyunun canlı hesabı qeydiyyatdan keçmiş istifadəçilər üçündür.',gtLogin:'Daxil ol',gtSignup:'Qeydiyyat',gtFree:'Pulsuzdur və bir dəqiqə çəkir — Google ilə də olar.'});
  Object.assign(I18N.en,{gtTitle:'For registered users only',gtPlayer:'The player profile — rating by game, every game’s breakdown, video moments and the spray chart — opens after you sign up.',
    gtGame:'The play-by-play, video moments and spray chart are available to registered users.',gtLive:'The live score is available to registered users.',gtLogin:'Log in',gtSignup:'Sign up',gtFree:'It’s free and takes a minute — you can use Google.'});
  // 'open' — показываем всё; 'locked' — гость; 'wait' — ещё не знаем (онлайн-функции грузятся)
  const st=()=>{ const c=CL.ctx().C; if(c.failed) return 'open'; if(!c.ok||!c.ready) return 'wait'; return c.user?'open':'locked'; };
  window.SB_GATE=st;
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const card=txt=>`<div class="card gate-card"><div class="gate-ic">🔒</div><b>${T('gtTitle')}</b><p>${txt}</p>
    <div class="btns"><button class="btn pri" onclick="CL.auth('signup')">${T('gtSignup')}</button><button class="btn" onclick="CL.auth('login')">${T('gtLogin')}</button></div><span class="muted">${T('gtFree')}</span></div>`;
  const parse=()=>{ const h=(location.hash||'').slice(1), i=h.indexOf('-'); return {page:i<0?h:h.slice(0,i), id:i<0?'':decodeURIComponent(h.slice(i+1))}; };
  const dropSec=sel=>document.querySelectorAll('#app '+sel).forEach(el=>{ const t=el.previousElementSibling; if(t&&t.classList.contains('section-title')) t.remove(); el.remove(); });
  let waitN=0, waitT=0;
  function apply(){
    const s=st(), {page,id}=parse(), A=document.getElementById('app'); if(!A) return;
    document.body.classList.toggle('gate-locked',s!=='open');
    if(s==='wait'){ clearTimeout(waitT); if(waitN++<40) waitT=setTimeout(()=>{ if(st()!=='wait'){ waitN=0; route(); } else apply(); },250); }
    else waitN=0;
    if(s==='open') return;
    if(page==='player'){
      const p=S.players[id]; if(!p) return;
      const back=A.querySelector('.back-btn'); const bk=back?back.outerHTML:'';
      A.innerHTML=s==='wait'?`${bk}<div class="loading">…</div>`:`${bk}<div class="gate-head">${av(p,'m')}<div><h1>${esc(pname(p))}</h1><div class="muted">#${p.number}${p.pos&&p.pos[0]?` · ${p.pos[0][0]}`:''}</div></div>${p.t&&p.t.RAT!=null?rt(p.t.RAT,'lg'):''}</div>${card(T('gtPlayer'))}`;
      return;
    }
    if(page==='live'){ const back=A.querySelector('.back-btn'); A.innerHTML=(back?back.outerHTML:'')+(s==='wait'?'<div class="loading">…</div>':card(T('gtLive'))); return; }
    if(page==='game'){
      dropSec('.card.pbp'); dropSec('.card.hls'); dropSec('.card.spray');
      if(s==='locked'&&!A.querySelector('.gate-card')){ const tabs=A.querySelectorAll('[id^="gbox-"]'); const last=tabs[tabs.length-1]; const d=document.createElement('div'); d.innerHTML=card(T('gtGame')); (last||A.lastElementChild).after(d.firstElementChild); }
    }
  }
  const _route=route; route=function(){ _route(); apply(); };
  // онлайн-карточка на главной и значок в шапке обновляются сами (club.js) — прячем стилями (gate.css)
})();
