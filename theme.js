/* Оформление «Ночной матч · снаряжение» (вариант A3, 10.11.2026):
   значки софтбола (бита, перчатка, мяч, база, кепка), полоса значков под шапкой,
   подпись «Любительский софтбол в Баку». Значки — window.SBI(name, size). */
(function(){
  const P={
    glove:'<path d="M7 21v-7.5a1.5 1.5 0 0 1 3 0V5a1.5 1.5 0 0 1 3 0V3.8a1.5 1.5 0 0 1 3 0V5.5a1.5 1.5 0 0 1 3 0v7.5c0 4.5-2.7 8-6.5 8z"/><path d="M7 15.5L4.2 12.6a1.6 1.6 0 0 1 2.3-2.2L7 11"/><path d="M10 14h6"/>',
    plate:'<path d="M4 4h16v9l-8 7-8-7z"/>',
    bat:'<path d="M4.5 19.5l2-2"/><path d="M6.5 17.5L18 6a2.5 2.5 0 0 1 3.5 3.5L10 21z"/>',
    ball:'<circle cx="12" cy="12" r="9"/><path d="M6.5 5c2 2.5 2 11.5 0 14M17.5 5c-2 2.5-2 11.5 0 14"/>',
    hr:'<circle cx="16" cy="9" r="5"/><path d="M13 5.5c1 1.5 1 5.5 0 7M19 5.5c-1 1.5-1 5.5 0 7"/><path d="M3 20l6-6M3 15l4-4M8 21l3-3"/>',
    star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    cap:'<path d="M3 15c0-5 4-9 9-9s8 3.5 8.5 8H3z"/><path d="M12 6v8M20.5 14l2 1H3"/>',
    fire:'<path d="M12 21c-4 0-6-2.5-6-6 0-4 4-6 4-10 3 2 4 4 4 6 1-1 1.5-2 1.5-3 2 2 2.5 4.5 2.5 7 0 3.5-2 6-6 6z"/>',
    trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    diamond:'<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 21v-2"/>',
    news:'<rect x="3" y="4.5" width="14.5" height="15.5" rx="2"/><path d="M17.5 8.5H20a1 1 0 0 1 1 1V18a2 2 0 0 1-2 2H5.5"/><path d="M6.5 8.5h7.5M6.5 12h7.5M6.5 15.5h4.5"/>',
    sun:'<circle cx="8.5" cy="8" r="3"/><path d="M8.5 2.5v1M3 8h1M4.6 4.1l.7.7M12.4 4.1l-.7.7"/><path d="M7.5 20.5h10a4 4 0 0 0 .4-8 5.2 5.2 0 0 0-9.9 1.4 3.3 3.3 0 0 0-.5 6.6z"/>',
    medal:'<path d="M7.5 2.5h3l2 5M16.5 2.5h-3l-1.2 3"/><circle cx="12" cy="14.5" r="6.5"/><path d="M12 11l1.1 2.2 2.4.35-1.75 1.7.42 2.4L12 16.5l-2.17 1.15.42-2.4-1.75-1.7 2.4-.35z"/>',
    pulse:'<path d="M2.5 12h4l2.5-6.5 4.5 13 3-8.5 1.5 2H21.5"/>',
    chart:'<path d="M3 20.5h18"/><rect x="4.5" y="11" width="3.5" height="7.5" rx="1"/><rect x="10.25" y="4.5" width="3.5" height="14" rx="1"/><rect x="16" y="14" width="3.5" height="4.5" rx="1"/>',
    field:'<path d="M12 21.5L2.8 12.3a13 13 0 0 1 18.4 0z"/><path d="M12 21.5l-4.2-4.2L12 13l4.2 4.3z"/>',
    cal:'<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2"/>',
    users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.6 3-5.5 6-5.5s5.4 1.9 6 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.6c2.6.2 4.1 2 4.5 5"/>',
    list:'<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1.3"/><circle cx="4.5" cy="12" r="1.3"/><circle cx="4.5" cy="18" r="1.3"/>',
    play:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M10 9.2v5.6l4.8-2.8z"/>',
    chat:'<path d="M4 5h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 17H10l-5 4v-4H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 5z"/>',
    live:'<circle cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
    shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    book:'<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/>'
  };
  window.SBI=(n,s=20,w=2)=>`<svg class="sbi" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||P.ball}</svg>`;
  // бита: набалдашник, тонкая ручка, плавное расширение к бочке, скруглённый конец (ось x, длина ~92)
  const BAT='<ellipse cx="7.5" cy="50" rx="3.2" ry="5.4"/><path d="M9.5 48.1L42 47.7C56 47.1 64 44.1 78 43.8L90 43.8Q96.5 43.8 96.5 50Q96.5 56.2 90 56.2L78 56.2C64 55.9 56 52.9 42 52.3L9.5 51.9Z"/>';
  window.SB_BAT=BAT;
  // скрещённые биты (бочками вверх) и мяч над перекрестьем
  window.SB_BATS=(c,seam)=>`<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="${c}"><g transform="rotate(-45 50 50)">${BAT}</g><g transform="rotate(-135 50 50)">${BAT}</g></g>`+
    `<circle cx="50" cy="27" r="11" fill="${c}"/><path d="M43.5 18.5c3 4.5 3 12.5 0 17M56.5 18.5c-3 4.5-3 12.5 0 17" fill="none" stroke="${seam||'#FFFFFF'}" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  Object.assign(I18N.ru,{sbTag:'Любительский софтбол в Баку',sbWhen:'по воскресеньям · 08:00 · Əmircan',sbHits:'хиты',sbRuns:'пробежки',winW:'Победа',lossW:'Поражение',tieW:'Ничья'});
  Object.assign(I18N.az,{sbTag:'Bakıda həvəskar softbol',sbWhen:'bazar günləri · 08:00 · Əmircan',sbHits:'hitlər',sbRuns:'qaçışlar',winW:'Qələbə',lossW:'Məğlubiyyət',tieW:'Heç-heçə'});
  Object.assign(I18N.en,{sbTag:'Amateur softball in Baku',sbWhen:'Sundays · 08:00 · Əmircan',sbHits:'hits',sbRuns:'runs',winW:'Win',lossW:'Loss',tieW:'Tie'});

  // полоса значков под шапкой
  // полоса бейсбольных значков под шапкой (14.11.2026): двухцветные — контур тёмно-синий, детали красные
  const STRIP={
    // мяч: два шва со стежками
    ball:'<circle cx="16" cy="16" r="12.5" class="o"/><path class="r" d="M9.6 6.6c3.4 3 3.4 15.8 0 18.8M22.4 6.6c-3.4 3-3.4 15.8 0 18.8"/><path class="r t" d="M10.4 9.6l2.2-.7M11.3 13l2.3-.3M11.3 19l2.3.3M10.4 22.4l2.2.7M21.6 9.6l-2.2-.7M20.7 13l-2.3-.3M20.7 19l-2.3.3M21.6 22.4l-2.2.7"/>',
    // скрещённые биты
    bats:'<path class="o" d="M6.2 26.6l2.6-2.6M8.8 24L21.9 9.4a2.6 2.6 0 0 1 3.7 3.7L11 26.2zM25.8 26.6l-2.6-2.6M23.2 24L10.1 9.4a2.6 2.6 0 0 0-3.7 3.7L21 26.2z"/><circle cx="5.6" cy="27.2" r="1.3" class="r f"/><circle cx="26.4" cy="27.2" r="1.3" class="r f"/>',
    // ловушка (перчатка) с мячом
    glove:'<path class="o" d="M9 28c-2.6-1.4-4-4-4-7.4V12a2 2 0 0 1 4 0V7.6a2 2 0 0 1 4 0V6.2a2 2 0 0 1 4 0v1.4a2 2 0 0 1 4 0v6.2l1.6-1.5a2.2 2.2 0 0 1 3 3.2L19.8 22c-1.8 3.9-4.8 6-8.6 6z"/><path class="r" d="M9 13v5.5M13 9v8M17 8v8"/><circle cx="23.6" cy="23.6" r="4.2" class="o w"/><path class="r" d="M21.2 20.7c1 1 1 4.8 0 5.8M26 20.7c-1 1-1 4.8 0 5.8"/>',
    // «дом»
    plate:'<path class="o" d="M7 6.5h18v11.2L16 26.5l-9-8.8z"/><path class="r" d="M10.5 10h11"/>',
    // шлем отбивающего
    helmet:'<path class="o" d="M5.5 20.5C5.5 13 10 7.5 16.5 7.5c5.3 0 9.5 3.7 10 9.5l-.3 3.5z"/><path class="o" d="M5.5 20.5h22l-1.5 3H9.5z"/><path class="r" d="M15 12.5c1.6-1.5 4.2-1.9 6.2-.9"/><circle cx="12.5" cy="17" r="1.6" class="r f"/>',
    // поле-ромб с базами
    diamond:'<path class="o" d="M16 4.5L27.5 16 16 27.5 4.5 16z"/><circle cx="16" cy="16" r="2.2" class="r"/><rect x="14.4" y="2.9" width="3.2" height="3.2" rx=".6" transform="rotate(45 16 4.5)" class="r f"/><rect x="25.9" y="14.4" width="3.2" height="3.2" rx=".6" transform="rotate(45 27.5 16)" class="r f"/><rect x="2.9" y="14.4" width="3.2" height="3.2" rx=".6" transform="rotate(45 4.5 16)" class="r f"/>',
    // кепка
    cap:'<path class="o" d="M5 19.5C5 12.6 9.8 8 16 8s10.5 4.2 11 10.5"/><path class="o" d="M5 19.5h23.5c1.2 0 1.7 1.5.7 2.2l-1.2.8H5z"/><path class="r" d="M16 8v11.5M10.5 10.5c1.2 2.7 1.6 5.8 1.3 9M21.5 10.5c-1.2 2.7-1.6 5.8-1.3 9"/><circle cx="16" cy="7.4" r="1.1" class="r f"/>'
  };
  const stripIc=n=>`<svg class="eq" viewBox="0 0 32 32" aria-hidden="true">${STRIP[n]}</svg>`;
  function strip(){
    const el=document.getElementById('eq-strip'); if(!el||el.childElementCount) return;
    const set=['ball','bats','glove','plate','helmet','diamond','cap'];
    let h=''; for(let i=0;i<42;i++) h+=stripIc(set[i%set.length]);
    el.innerHTML=h;
  }
  // ---------- значки у всех заголовков разделов (одного размера) ----------
  // ключ перевода заголовка → значок; заголовок узнаём по тексту на текущем языке
  const TITLE_IC={roster:'users',leaders:'medal',leadersOff:'medal',table:'chart',byGame:'chart',allGames:'list',games:'cal',
    cNext:'cal',cPlays:'list',cLiveBox:'chart',cComments:'chat',cRequests:'users',cSchedule:'cal',cLiveAdmin:'live',cUsers:'users',
    bgTitle:'star',rcAwards:'trophy',rcGame:'star',rcSeason:'cal',rcBadges:'star',chTitle:'users',hlTitle:'play',hlGame:'play',pbT:'list',
    fdTitle:'pulse',spTitle:'field',wxTitle2:'sun',wxTitle:'sun',nwTitle:'news',glTitle:'play'};
  function titleIcon(txt){
    const L=I18N[LANG]||{};
    for(const [k,ic] of Object.entries(TITLE_IC)){
      let v=L[k]; if(typeof v==='function'){ try{ v=v(new Date().getFullYear()); }catch(e){ v=null; } }
      if(typeof v==='string'&&v&&(txt===v||txt.startsWith(v.split(' ')[0]+' ')&&k.startsWith('leaders'))) return ic;
      if(typeof v==='string'&&v&&txt.startsWith(v)) return ic;
    }
    return null;
  }
  let decorate=function(){
    document.querySelectorAll('#app .section-title h2').forEach(h=>{
      const ic=h.dataset.ic||titleIcon(h.textContent.trim()); if(!ic) return;
      const old=h.querySelector(':scope > svg.sbi');
      if(old&&old.dataset.ic===ic) return;
      if(old) old.remove();
      h.insertAdjacentHTML('afterbegin',SBI(ic,28,2.1).replace('<svg ',`<svg data-ic="${ic}" `));
    });
  };
  // маленькие значки у подзаголовков карточек («Последняя игра», «Игрок матча», «Следующая игра», «Сейчас отбивает»)
  const EYE_IC={lastGame:'cal',firstGame:'cal',potg:'medal',cNextOne:'cal',cAtBat:'bat',cProfile:'users'};
  function decorateEyebrows(){
    const L=I18N[LANG]||{};
    document.querySelectorAll('#app .card .eyebrow').forEach(el=>{
      if(el.querySelector('svg.sbi')) return;
      const t=el.textContent.trim();
      for(const [k,ic] of Object.entries(EYE_IC)){ const v=L[k]; if(typeof v==='string'&&v&&t.startsWith(v)){ el.insertAdjacentHTML('afterbegin',SBI(ic,15,2.3)); el.classList.add('eb-ic'); break; } }
    });
  }
  const _dec=decorate; decorate=function(){ _dec(); decorateEyebrows(); };
  window.sbDecorate=decorate;
  let decT=0; const decLater=()=>{ cancelAnimationFrame(decT); decT=requestAnimationFrame(decorate); };

  // ---------- нижние вкладки в приложении на телефоне ----------
  const TI={
    home:'<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
    games:'<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    teams:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.6 3-5.5 6-5.5s5.4 1.9 6 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.6c2.6.2 4.1 2 4.5 5"/>',
    records:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
    rules:'<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/>',
    me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.2 4-6.4 8-6.4s7 2.2 8 6.4"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    live:'<circle cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
    admin:'<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    close:'<path d="M6 6l12 12M18 6L6 18"/>'
  };
  const tico=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TI[n]}</svg>`;
  Object.assign(I18N.ru,{tbHome:'Главная',tbGames:'Игры',tbTeams:'Составы',tbRecords:'Рекорды',tbRules:'Правила',tbMe:'Профиль',tbIn:'Войти'});
  Object.assign(I18N.az,{tbHome:'Əsas',tbGames:'Oyunlar',tbTeams:'Heyət',tbRecords:'Rekordlar',tbRules:'Qaydalar',tbMe:'Profil',tbIn:'Daxil ol'});
  Object.assign(I18N.en,{tbHome:'Home',tbGames:'Games',tbTeams:'Teams',tbRecords:'Records',tbRules:'Rules',tbMe:'Profile',tbIn:'Log in'});
  Object.assign(I18N.ru,{tbMenu:'Меню',mnTitle:'Все разделы',mnHome:'Рейтинг',mnHomeD:'таблица, лидеры, галерея',mnGames:'Игры',mnGamesD:'результаты и протоколы',mnTeams:'Составы',mnTeamsD:'деление на команды, голосование',mnRecords:'Рекорды',mnRecordsD:'лучшие показатели',mnRules:'Правила',mnRulesD:'как играем и считаем рейтинг',mnLive:'Прямой эфир',mnLiveD:'счёт идущей игры',mnMe:'Мой профиль',mnMeD:'аккаунт, дата рождения',mnIn:'Войти',mnInD:'или зарегистрироваться',mnAdmin:'Админ',mnAdminD:'управление сайтом',mnLang:'Язык',mnTheme:'Тема'});
  Object.assign(I18N.az,{tbMenu:'Menyu',mnTitle:'Bütün bölmələr',mnHome:'Reytinq',mnHomeD:'cədvəl, liderlər, qalereya',mnGames:'Oyunlar',mnGamesD:'nəticələr və protokollar',mnTeams:'Komandalar',mnTeamsD:'heyətlərə bölgü, səsvermə',mnRecords:'Rekordlar',mnRecordsD:'ən yaxşı göstəricilər',mnRules:'Qaydalar',mnRulesD:'necə oynayırıq və reytinq',mnLive:'Canlı',mnLiveD:'gedən oyunun hesabı',mnMe:'Profilim',mnMeD:'hesab, doğum tarixi',mnIn:'Daxil ol',mnInD:'və ya qeydiyyat',mnAdmin:'Admin',mnAdminD:'saytın idarəsi',mnLang:'Dil',mnTheme:'Mövzu'});
  Object.assign(I18N.en,{tbMenu:'Menu',mnTitle:'All sections',mnHome:'Rating',mnHomeD:'table, leaders, gallery',mnGames:'Games',mnGamesD:'results and box scores',mnTeams:'Teams',mnTeamsD:'team split, voting',mnRecords:'Records',mnRecordsD:'best performances',mnRules:'Rules',mnRulesD:'how we play and rate',mnLive:'Live',mnLiveD:'score of the game in progress',mnMe:'My profile',mnMeD:'account, birthday',mnIn:'Log in',mnInD:'or sign up',mnAdmin:'Admin',mnAdminD:'site management',mnLang:'Language',mnTheme:'Theme'});
  const appMode=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||/[?&]app=1/.test(location.search);
  function section(){
    const h=location.hash||'#rating';
    if(/^#(games|game-|live)/.test(h)) return 'games';
    if(/^#teams/.test(h)) return 'teams';
    if(/^#records/.test(h)) return 'records';
    if(/^#rules/.test(h)) return 'rules';
    if(/^#(me|admin)/.test(h)) return 'me';
    return 'home';
  }
  // нижнее меню — в приложении и на любом телефоне (21.11.2026); последняя вкладка «Меню» открывает все разделы
  const tabMode=()=>appMode()||matchMedia('(max-width:820px)').matches;
  function drawTabs(){
    const de=document.documentElement;
    if(!tabMode()){ de.classList.remove('tab-mode'); return; }
    if(appMode()) de.classList.add('app-mode');
    de.classList.add('tab-mode');
    let bar=document.getElementById('tabbar');
    if(!bar){ bar=document.createElement('nav'); bar.id='tabbar'; bar.className='tabbar'; bar.setAttribute('aria-label','Menu'); document.body.appendChild(bar); }
    const player=!!(window.CL&&CL.canDecide&&CL.canDecide());
    const logged=!!document.querySelector('#acct .acct-me');
    const failed=!!document.querySelector('#acct .acct-off');
    const tabs=[['home','#rating','tbHome'],['games','#games','tbGames'],player?['teams','#teams','tbTeams']:['rules','#rules','tbRules'],['records','#records','tbRecords']];
    const cur=section(), inMenu=!tabs.some(t=>t[0]===cur)&&cur!=='home';
    bar.style.gridTemplateColumns='repeat(5,minmax(0,1fr))'; bar.classList.remove('t6');
    bar.innerHTML=tabs.map(([k,href,t])=>`<a href="${href}" class="${cur===k?'on':''}"${cur===k?' aria-current="page"':''}>${tico(k)}<span>${T(t)}</span></a>`).join('')+
      `<button type="button" class="tb-menu${inMenu||document.getElementById('sb-menu')?' on':''}" onclick="sbMenu()" aria-haspopup="dialog">${tico('menu')}<span>${T('tbMenu')}</span></button>`;
    const m=document.getElementById('sb-menu'); if(m) fillMenu(m);
  }
  function fillMenu(m){
    const player=!!(window.CL&&CL.canDecide&&CL.canDecide()), logged=!!document.querySelector('#acct .acct-me'), failed=!!document.querySelector('#acct .acct-off');
    const adm=!!(window.CL&&CL.ctx&&(()=>{ try{ return CL.ctx().isAdmin(); }catch(e){ return false; } })());
    const cur=section();
    const it=(k,href,t,d,on)=>`<a class="mn-it${on?' on':''}" href="${href}" onclick="sbMenu(false)"><span class="mn-ic">${tico(k)}</span><span class="mn-tx"><b>${T(t)}</b><small>${T(d)}</small></span></a>`;
    const rows=[it('home','#rating','mnHome','mnHomeD',cur==='home'),it('games','#games','mnGames','mnGamesD',cur==='games'),
      player?it('teams','#teams','mnTeams','mnTeamsD',cur==='teams'):'',it('records','#records','mnRecords','mnRecordsD',cur==='records'),
      it('rules','#rules','mnRules','mnRulesD',cur==='rules'),it('live','#live','mnLive','mnLiveD',/^#live/.test(location.hash)),
      logged?it('me','#me','mnMe','mnMeD',/^#me/.test(location.hash)):`<button class="mn-it" type="button" onclick="sbMenu(false);${failed?'CL.oldBrowser()':"CL.auth('login')"}"><span class="mn-ic">${tico('me')}</span><span class="mn-tx"><b>${T('mnIn')}</b><small>${T('mnInD')}</small></span></button>`,
      adm?it('admin','#admin','mnAdmin','mnAdminD',/^#admin/.test(location.hash)):''].join('');
    const dk=document.documentElement.classList.contains('theme-dark');
    m.innerHTML=`<div class="mn-back" onclick="sbMenu(false)"></div><div class="mn-sheet" role="dialog" aria-modal="true" aria-label="${T('mnTitle')}">
      <div class="mn-grab"></div><div class="mn-head"><b>${T('mnTitle')}</b><button type="button" class="mn-x" onclick="sbMenu(false)" aria-label="✕">${tico('close')}</button></div>
      <div class="mn-list">${rows}</div>
      <div class="mn-foot"><div class="mn-lang"><span>${T('mnLang')}</span>${['az','ru','en'].map(l=>`<button type="button" class="${LANG===l?'on':''}" onclick="setLang('${l}');sbMenu(true)">${l.toUpperCase()}</button>`).join('')}</div>
        <button type="button" class="mn-thm" onclick="sbTheme();sbMenu(true)">${dk?'☀️':'🌙'} ${T(dk?'thmToLight':'thmToDark')}</button></div></div>`;
  }
  window.sbMenu=function(open){
    let m=document.getElementById('sb-menu');
    if(open===undefined) open=!m;
    if(!open){ if(m){ m.classList.remove('show'); setTimeout(()=>{ m.remove(); drawTabs(); },180); document.documentElement.classList.remove('mn-open'); } return; }
    if(!m){ m=document.createElement('div'); m.id='sb-menu'; document.body.appendChild(m); requestAnimationFrame(()=>m.classList.add('show')); }
    document.documentElement.classList.add('mn-open'); fillMenu(m); drawTabs();
  };
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&document.getElementById('sb-menu')) sbMenu(false); });
  window.drawTabs=drawTabs;
  function init(){
    strip();
    const appEl=document.getElementById('app'); if(appEl) new MutationObserver(decLater).observe(appEl,{childList:true,subtree:true}); decLater();
    drawTabs();
    window.addEventListener('hashchange',()=>{ const m=document.getElementById('sb-menu'); if(m) m.remove(), document.documentElement.classList.remove('mn-open'); drawTabs(); });
    matchMedia('(max-width:820px)').addEventListener?.('change',drawTabs);
    const acct=document.getElementById('acct');
    if(acct) new MutationObserver(()=>drawTabs()).observe(acct,{childList:true});
    if(typeof window.chrome==='function'){ const oc=window.chrome; window.chrome=function(){ const r=oc.apply(this,arguments); drawTabs(); return r; }; }
  }
  // ---------- переключатель темы: светлая (по умолчанию) / тёмная (14.11.2026) ----------
  Object.assign(I18N.ru,{thmToDark:'Тёмная тема',thmToLight:'Светлая тема',toTop:'Наверх'});
  Object.assign(I18N.az,{thmToDark:'Tünd mövzu',thmToLight:'İşıqlı mövzu',toTop:'Yuxarı'});
  Object.assign(I18N.en,{thmToDark:'Dark theme',thmToLight:'Light theme',toTop:'Back to top'});
  const MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  const SUN='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>';
  const UP='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>';
  window.sbUp=function(){ try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){ window.scrollTo(0,0); } };
  const isDark=()=>document.documentElement.classList.contains('theme-dark');
  function drawThm(){
    const d=isDark(), t=T(d?'thmToLight':'thmToDark');
    const up=T('toTop');
    document.querySelectorAll('.up-btn').forEach(b=>{ b.innerHTML=UP+`<span>${up}</span>`; b.title=up; b.setAttribute('aria-label',up); });
    document.querySelectorAll('.thm-btn:not(.up-btn)').forEach(b=>{ b.innerHTML=(d?SUN:MOON)+(b.classList.contains('thm-foot')?`<span>${t}</span>`:''); b.title=t; b.setAttribute('aria-label',t); });
  }
  window.sbTheme=function(){
    const d=!isDark(), l=document.getElementById('light-css');
    document.documentElement.classList.toggle('theme-dark',d);
    const m=document.querySelector('meta[name=theme-color]'); if(m) m.content=d?'#070D18':'#FFFFFF';
    try{ localStorage.setItem('sb.theme',d?'dark':'light'); }catch(e){}
    drawThm();
  };
  window.addEventListener('hashchange',()=>setTimeout(drawThm,0));
  if(typeof window.chrome==='function'){ const oc2=window.chrome; window.chrome=function(){ const r=oc2.apply(this,arguments); drawThm(); return r; }; }
  const _setL=window.setLang; if(typeof _setL==='function') window.setLang=function(){ const r=_setL.apply(this,arguments); drawThm(); return r; };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{drawThm();}); else drawThm();
  setTimeout(drawThm,500);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

/* Автообновление (21.11.2026): приложение с домашнего экрана iPhone держит старую страницу в кеше.
   При запуске и при возврате в приложение (не чаще раза в 5 минут) сверяем версии файлов (?v=) с сайтом;
   если на сайте новее — обновляем кеш страницы и перезагружаем один раз. */
(function(){
  const vers=html=>[...html.matchAll(/\b([\w-]+\.(?:js|css))\?v=(\d+)/g)].map(m=>m[1]+m[2]).sort().join(',');
  let last=0;
  async function check(){
    if(Date.now()-last<5*60e3||!navigator.onLine) return; last=Date.now();
    try{
      const url=location.pathname.replace(/[^/]*$/,'')+'index.html';
      const r=await fetch(url,{cache:'no-cache'}); if(!r.ok) return;
      const fresh=vers(await r.text()), cur=vers(document.documentElement.outerHTML);
      if(!fresh||fresh===cur) return;
      const k='sb.upd.'+fresh.length+'.'+fresh.slice(-40); if(sessionStorage.getItem(k)) return; sessionStorage.setItem(k,'1');
      await fetch(url,{cache:'reload'}).catch(()=>{}); await fetch(location.pathname,{cache:'reload'}).catch(()=>{});
      if(document.querySelector('.modal.open,#cl-modal input:focus')) return;
      location.reload();
    }catch(e){}
  }
  addEventListener('load',()=>setTimeout(check,1500));
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) check(); });
})();
