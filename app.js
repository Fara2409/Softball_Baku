// Softball Baku — статистика игроков.
// Данные: data/index.json (сезон и список игр), data/players.json (состав), data/games/*.json (протоколы игр).

/* ---------- Языки ---------- */
const I18N={
  ru:{rating:'Рейтинг',games:'Игры',players:'Игроки',lastGame:'Последняя игра',potg:'Игрок матча',leaders:'Лидеры сезона',avgPerGame:'средний рейтинг за игру',
    table:'Рейтинг игроков',qualHint:n=>`в рейтинге — от ${n} ${plural('ru',n)} · нажмите на столбец для сортировки`,player:'Игрок',position:'Позиция',pos:'Поз.',
    youtube:'Смотреть на YouTube',boxscore:'Протокол игры',season:'Сезон',avgRating:'Средний рейтинг',rOff:'Нападение',rDef:'Защита',rOffS:'Нап.',rDefS:'Защ.',rSplit:b=>`старт ${b} + очки за нападение и защиту в среднем за игру`,noRating:'Рейтинг появится после первой игры',
    G:'Игры',W:'Победы',WL:'В-П',R:'Раны',PO:'Ауты в защите',byGame:'Рейтинг по играм',dashed:'пунктир — среднее за сезон',avgLbl:'среднее',allGames:'Все игры',
    date:'Дата',team:'Команда',result:'Итог',win:'Победа',loss:'Поражение',tie:'Ничья',winL:'победа',lossL:'поражение',tieL:'ничья',runs:'ран',
    seasonStarts:d=>`Сезон ${d.season} стартует ${d.start}`,daysLeft:n=>`До старта ${n} ${pluralDays('ru',n)}`,seasonGames:'Игры сезона',
    noGames:'Игр пока нет. Первая игра сезона появится здесь.',noStats:'Статистика появится после первой игры сезона.',mainPos:'основная позиция',
    roster:'Состав',openProfile:'Открыть профиль',title:'Статистика',tagline:'Любительский софтбол в Баку. Рейтинг игроков, статистика и ролики каждой игры.',site:'Сайт',watch:'Смотреть',where:'Где играем',lastVideo:'Последняя игра на YouTube',channel:'Наш YouTube-канал',place:'Амирджан, Баку, Азербайджан',seasonPill:d=>`Сезон ${d.season} · старт ${d.start}`,language:'Язык',firstGame:'Первая игра',videoSoon:'Видео скоро',final:'Итог',notFound:'Не найдено',loadErr:'Не удалось загрузить данные',footer:'рейтинг считается автоматически после каждой игры',mvp:'MVP',city:'Баку'},
  az:{rating:'Reytinq',games:'Oyunlar',players:'Oyunçular',lastGame:'Son oyun',potg:'Oyunun ən yaxşısı',leaders:'Mövsümün liderləri',avgPerGame:'oyun başına orta reytinq',
    table:'Oyunçuların reytinqi',qualHint:n=>`reytinqdə — ən azı ${n} oyun · sıralamaq üçün sütuna toxunun`,player:'Oyunçu',position:'Mövqe',pos:'Mövqe',
    youtube:'YouTube-da izlə',boxscore:'Oyun protokolu',season:'Mövsüm',avgRating:'Orta reytinq',rOff:'Hücum',rDef:'Müdafiə',rOffS:'Hüc.',rDefS:'Müd.',rSplit:b=>`başlanğıc ${b} + oyun başına orta hücum və müdafiə balları`,noRating:'Reytinq ilk oyundan sonra görünəcək',
    G:'Oyunlar',W:'Qələbələr',WL:'Q-M',R:'Ranlar',PO:'Müdafiədə autlar',byGame:'Oyunlar üzrə reytinq',dashed:'qırıq xətt — mövsüm ortalaması',avgLbl:'orta',allGames:'Bütün oyunlar',
    date:'Tarix',team:'Komanda',result:'Nəticə',win:'Qələbə',loss:'Məğlubiyyət',tie:'Heç-heçə',winL:'qələbə',lossL:'məğlubiyyət',tieL:'heç-heçə',runs:'ran',
    seasonStarts:d=>`${d.season} mövsümü ${d.start} başlayır`,daysLeft:n=>`Başlanğıca ${n} gün qalıb`,seasonGames:'Mövsümün oyunları',
    noGames:'Hələ oyun yoxdur. Mövsümün ilk oyunu burada görünəcək.',noStats:'Statistika mövsümün ilk oyunundan sonra görünəcək.',mainPos:'əsas mövqe',
    roster:'Heyət',openProfile:'Profilə bax',title:'Statistika',tagline:'Bakıda həvəskar softbol. Oyunçuların reytinqi, statistika və hər oyunun videosu.',site:'Sayt',watch:'İzlə',where:'Harada oynayırıq',lastVideo:'Son oyun YouTube-da',channel:'YouTube kanalımız',place:'Əmircan, Bakı, Azərbaycan',seasonPill:d=>`${d.season} mövsümü · ${d.start}`,language:'Dil',firstGame:'İlk oyun',videoSoon:'Video tezliklə',final:'Yekun',notFound:'Tapılmadı',loadErr:'Məlumatları yükləmək alınmadı',footer:'reytinq hər oyundan sonra avtomatik hesablanır',mvp:'MVP',city:'Bakı'},
  en:{rating:'Ratings',games:'Games',players:'Players',lastGame:'Last game',potg:'Player of the game',leaders:'Season leaders',avgPerGame:'average rating per game',
    table:'Player ratings',qualHint:n=>`qualified — ${n}+ ${plural('en',n)} · click a column to sort`,player:'Player',position:'Position',pos:'Pos',
    youtube:'Watch on YouTube',boxscore:'Box score',season:'Season',avgRating:'Average rating',rOff:'Offense',rDef:'Defense',rOffS:'Off.',rDefS:'Def.',rSplit:b=>`start ${b} + average offense and defense points per game`,noRating:'Rating appears after the first game',
    G:'Games',W:'Wins',WL:'W-L',R:'Runs',PO:'Putouts',byGame:'Rating by game',dashed:'dashed line — season average',avgLbl:'avg',allGames:'Game log',
    date:'Date',team:'Team',result:'Result',win:'Win',loss:'Loss',tie:'Tie',winL:'win',lossL:'loss',tieL:'tie',runs:'runs',
    seasonStarts:d=>`Season ${d.season} starts ${d.start}`,daysLeft:n=>`${n} ${n===1?'day':'days'} to go`,seasonGames:'Season games',
    noGames:'No games yet. The first game of the season will appear here.',noStats:'Stats will appear after the first game of the season.',mainPos:'primary position',
    roster:'Roster',openProfile:'View profile',title:'Stats',tagline:'Amateur softball in Baku. Player ratings, stats and a video of every game.',site:'Site',watch:'Watch',where:'Where we play',lastVideo:'Latest game on YouTube',channel:'Our YouTube channel',place:'Amirajan, Baku, Azerbaijan',seasonPill:d=>`Season ${d.season} · from ${d.start}`,language:'Language',firstGame:'First game',videoSoon:'Video coming soon',final:'Final',notFound:'Not found',loadErr:'Could not load data',footer:'ratings are calculated automatically after every game',mvp:'MVP',city:'Baku'}
};
const POS_NAMES={
  ru:{P:'Питчер',C:'Кэтчер','1B':'1-я база','2B':'2-я база','3B':'3-я база',SS:'Шортстоп',LF:'Левый аутфилд',CF:'Центральный аутфилд',RF:'Правый аутфилд',SF:'Шорт-филдер'},
  az:{P:'Pitçer',C:'Ketçer','1B':'1-ci baza','2B':'2-ci baza','3B':'3-cü baza',SS:'Şortstop',LF:'Sol autfild',CF:'Mərkəzi autfild',RF:'Sağ autfild',SF:'Şort-filder'},
  en:{P:'Pitcher',C:'Catcher','1B':'First base','2B':'Second base','3B':'Third base',SS:'Shortstop',LF:'Left field',CF:'Center field',RF:'Right field',SF:'Short fielder'}
};
const LOCALE={ru:'ru-RU',az:'az-Latn-AZ',en:'en-GB'};
function plural(l,n){ if(l==='en') return n===1?'game':'games'; if(l==='az') return 'oyun';
  const m10=n%10,m100=n%100; return m10===1&&m100!==11?'игра':m10>=2&&m10<=4&&(m100<12||m100>14)?'игры':'игр'; }
function pluralDays(l,n){const m10=n%10,m100=n%100; return m10===1&&m100!==11?'день':m10>=2&&m10<=4&&(m100<12||m100>14)?'дня':'дней';}
let LANG='az';
try{ const s=localStorage.getItem('lang'); if(I18N[s]) LANG=s; }catch(e){}
const T=k=>I18N[LANG][k];

/* ---------- Логотип: бейсбольный мяч (крутится при наведении) ---------- */
const BALL_SEAM='M19 16C39 34 39 66 19 84 M81 16C61 34 61 66 81 84', BALL_ST='M19.3 22.2L23.3 22.3M25.8 16.9L25.1 20.8M22.9 26.9L26.8 27.5M30.1 22.5L28.9 26.3M25.8 31.9L29.5 33.1M33.5 28.6L31.7 32.1M27.9 37.2L31.4 38.9M36.0 35.0L33.8 38.3M29.2 42.7L32.5 44.9M37.5 41.6L34.9 44.6M29.8 48.4L32.8 51.0M38.2 48.4L35.2 51.0M29.6 54.1L32.3 57.1M38.0 55.2L34.6 57.4M28.7 59.7L30.9 63.0M36.8 61.9L33.2 63.7M27.0 65.2L28.8 68.8M34.7 68.5L31.0 69.7M24.6 70.4L25.8 74.2M31.8 74.8L27.8 75.4M21.4 75.3L22.0 79.2M27.8 80.7L23.9 80.8M74.2 16.9L74.9 20.8M80.7 22.2L76.7 22.3M69.9 22.5L71.1 26.3M77.1 26.9L73.2 27.5M66.5 28.6L68.3 32.1M74.2 31.9L70.5 33.1M64.0 35.0L66.2 38.3M72.1 37.2L68.6 38.9M62.5 41.6L65.1 44.6M70.8 42.7L67.5 44.9M61.8 48.4L64.8 51.0M70.2 48.4L67.2 51.0M62.0 55.2L65.4 57.4M70.4 54.1L67.7 57.1M63.2 61.9L66.8 63.7M71.3 59.7L69.1 63.0M65.3 68.5L69.0 69.7M73.0 65.2L71.2 68.8M68.2 74.8L72.2 75.4M75.4 70.4L74.2 74.2M72.2 80.7L76.1 80.8M78.6 75.3L78.0 79.2';
let _ballN=0;
function ballSVG(){ const i='b'+(++_ballN);
  return `<svg class="ball" viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="${i}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".62" stop-color="#f1ede4"/><stop offset="1" stop-color="#c9c2b3"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#${i})"/><g fill="none" stroke-linecap="round"><path d="${BALL_SEAM}" stroke="#c9302c" stroke-width="2.4" opacity=".55"/><path d="${BALL_ST}" stroke="#d2312b" stroke-width="3.6"/></g></svg>`; }
/* ---------- Performance score (0–10) ---------- */
// Формула v3 (07.11.2026). Абсолютная шкала: BASE + бита + защита (без бонуса за победу), предел 3–10.
// Ноябрь–декабрь 2026: тестовые игры, калибруем BASE и веса (цель: средний игрок ≈ 6.5).
// С 1 января 2027 формула заморожена на весь сезон.
// Защита: PO делится по типу розыгрыша:
//   FPO: сам сделал аут (поймал флай или аут по земле без передачи, напр. 1B сам наступил на базу)
//   PO кэтчера за страйк-аут (KPO) в рейтинг не идёт
//   остальные PO: принял бросок в цепочке (6-3 → PO первому бейсмену)
// PK: страйк-аут, пока этот игрок подавал (питчер), +0.2
// ROE: бьющий попал на базу по ошибке защиты, +0.15 (как уок), аутом не считается
// Кражи баз в нашей игре нет, в рейтинг не идут.
const BASE=6.0;
const W={'1B':.25,'2B':.5,'3B':.75,HR:1.0,BB:.15,ROE:.15,R:.25,RBI:.25,OUT:-.25,K:-.35,
  FPO:.15,A:.10,RPO:.05,PK:.2,E:-.4}; // бонуса за победу нет (убран 07.11.2026)
// Вклад в нападение и защиту (очки сверх BASE), без округления
function ratingParts(b){
  const roe=b.ROE||0, outs=Math.max(0,b.AB-b.H-b.K-roe);
  const off=W['1B']*b['1B']+W['2B']*b['2B']+W['3B']*b['3B']+W.HR*b.HR+W.BB*b.BB+W.ROE*roe+W.R*b.R+W.RBI*b.RBI+W.OUT*outs+W.K*b.K;
  const fpo=b.FPO||0,kpo=b.KPO||0,rpo=Math.max(0,(b.PO||0)-fpo-kpo); // в старых протоколах без FPO/KPO все PO считаются принятыми бросками
  const def=W.FPO*fpo+W.RPO*rpo+W.A*(b.A||0)+W.PK*(b.PK||0)+W.E*(b.E||0);
  return {off,def};
}
function rating(b,won){
  const {off,def}=ratingParts(b);
  return Math.round(Math.min(10,Math.max(3,BASE+off+def+(won&&W.WIN?W.WIN:0)))*10)/10;
}
function rclass(r){return r==null?'na':r>=9?'elite':r>=8?'great':r>=7?'good':r>=6?'mid':'low'}
const RCOL={low:'var(--r-low)',mid:'var(--r-mid)',good:'var(--r-good)',great:'var(--r-great)',elite:'var(--r-elite)'};
function rt(r,size=''){const c=rclass(r);return `<span class="rt ${size} ${c==='na'?'na':''}" style="${c!=='na'?`background:${RCOL[c]}`:''}">${r==null?'–':r.toFixed(1)}</span>`}
const avg3=x=>isFinite(x)?x.toFixed(3).replace(/^0/,''):'–';
const AZ_M=['yanvar','fevral','mart','aprel','may','iyun','iyul','avqust','sentyabr','oktyabr','noyabr','dekabr'];
const AZ_ABL=['yanvardan','fevraldan','martdan','apreldən','maydan','iyundan','iyuldan','avqustdan','sentyabrdan','oktyabrdan','noyabrdan','dekabrdan'];
function fmtDate(d,opt={day:'numeric',month:'long',year:'numeric'}){
  const dt=new Date(d+'T12:00:00');
  if(LANG==='az'){ const m=AZ_M[dt.getMonth()]; return `${dt.getDate()} ${opt.month==='short'?m.slice(0,3):m}${opt.year?' '+dt.getFullYear():''}`; }
  return dt.toLocaleDateString(LOCALE[LANG],opt);
}
const fromDate=d=>{const dt=new Date(d+'T12:00:00'); return LANG==='az'?`${dt.getDate()} ${AZ_ABL[dt.getMonth()]}`:fmtDate(d,{day:'numeric',month:'long'});};
const first=p=>p['first_'+LANG]||p.first, last=p=>p['last_'+LANG]||p.last||'';
const pname=p=>`${first(p)} ${last(p)}`.trim();
const initials=p=>(first(p)[0]+(last(p)[0]||'')).toUpperCase();
const av=(p,size='s')=>`<span class="av ${size} ${p.photo?'':'nophoto'}">${p.photo?`<img src="${p.photo}" alt="${pname(p)}" loading="lazy">`:p.number}</span>`;
const S={players:{},games:[]};

/* ---------- Загрузка и расчёт ---------- */
async function load(){
  const get=u=>fetch(u,{cache:'no-cache'}).then(r=>{if(!r.ok) throw new Error(u); return r.json();});
  const [idx,pl]=await Promise.all([get('data/index.json'),get('data/players.json')]);
  Object.assign(S,{analytics:idx.analytics||{},links:idx.links||{},league:idx.league,season:idx.season,start:idx.season_start,demo:!!(idx.demo||pl.demo)});
  pl.players.forEach(p=>S.players[p.id]={...p,log:[]});
  if(window.DEMO_MODE&&window.makeDemoGames){ S.demo=true; S.games=makeDemoGames(Object.values(S.players)); }
  else S.games=await Promise.all((idx.games||[]).map(id=>get(`data/games/${id}.json`)));
  S.games.sort((a,b)=>a.date.localeCompare(b.date));
  for(const g of S.games){
    g.winner=g.score.A>g.score.B?'A':g.score.B>g.score.A?'B':null;
    for(const b of g.box){ b.rating=rating(b,g.winner===b.team); const rp=ratingParts(b); b.rOff=rp.off; b.rDef=rp.def; S.players[b.player]?.log.push({game:g,b}); }
    g.stats=g.box.length>0; g.mvp=g.stats?[...g.box].sort((x,y)=>y.rating-x.rating)[0]:null;
  }
  S.qual=Math.max(1,Math.ceil(S.games.filter(g=>g.stats).length*0.4));
  for(const p of Object.values(S.players)){
    const t={G:0,PA:0,AB:0,H:0,'1B':0,'2B':0,'3B':0,HR:0,BB:0,K:0,R:0,RBI:0,ROE:0,PO:0,A:0,E:0,W:0,L:0}, pos={};
    for(const {game,b} of p.log){ t.G++; for(const k in t) if(k in b) t[k]+=b[k];
      if(game.winner===b.team) t.W++; else if(game.winner) t.L++; pos[b.pos]=(pos[b.pos]||0)+1; }
    const TB=t['1B']+2*t['2B']+3*t['3B']+4*t.HR;
    t.AVG=t.H/t.AB; t.OBP=(t.H+t.BB+t.ROE)/t.PA; t.SLG=TB/t.AB; t.OPS=t.OBP+t.SLG;
    t.OFF=t.G?p.log.reduce((s,x)=>s+x.b.rOff,0)/t.G:null; t.DEF=t.G?p.log.reduce((s,x)=>s+x.b.rDef,0)/t.G:null;
    t.RAT=t.G?Math.round(p.log.reduce((s,x)=>s+x.b.rating,0)/t.G*100)/100:null;
    t.qual=t.G>=S.qual; p.t=t;
    p.pos=Object.entries(pos).sort((a,b)=>b[1]-a[1]);
    if(!p.pos.length) p.pos=(p.positions||[]).map(x=>[x,0]);
  }
}

/* ---------- Общие куски ---------- */
const app=()=>document.getElementById('app');
const posChip=(x,i)=>`<span class="chip ${i?'':'main'}" title="${POS_NAMES[LANG][x[0]]||x[0]}">${x[0]}${x[1]?` · ${x[1]} ${plural(LANG,x[1])}`:''}</span>`;
function linescore(g){
  const n=Math.max(g.linescore.A.length,g.linescore.B.length);
  let h=`<table class="ls"><tr><th></th>${Array.from({length:n},(_,i)=>`<th>${i+1}</th>`).join('')}<th>R</th></tr>`;
  for(const k of ['A','B']) h+=`<tr class="${g.winner===k?'win':''}"><td class="tn"><i style="background:${g.teams[k].color}"></i>${g.teams[k].name}</td>${g.linescore[k].map(x=>`<td class="${x?'':'z'}">${x}</td>`).join('')}<td class="R">${g.score[k]}</td></tr>`;
  return h+'</table>';
}
function statLine(b){
  const p=[`${b.H}/${b.AB}`]; if(b.HR) p.push(`${b.HR} HR`); if(b['2B']) p.push(`${b['2B']} 2B`); if(b['3B']) p.push(`${b['3B']} 3B`);
  if(b.RBI) p.push(`${b.RBI} RBI`); if(b.R) p.push(`${b.R} R`); if(b.BB) p.push(`${b.BB} BB`); return p.join(' · ');
}
function seasonBanner(){
  const days=Math.ceil((new Date(S.start+'T00:00:00')-new Date())/864e5);
  return `<div class="card season"><div><span class="eyebrow">${S.league}</span>
    <h1>${T('seasonStarts')({season:S.season,start:fromDate(S.start)})}</h1>
    ${days>0?`<p class="muted">${T('daysLeft')(days)}</p>`:''}</div><div class="season-num">${S.season}</div></div>`;
}
function rosterGrid(){
  const ps=Object.values(S.players).sort((a,b)=>a.number-b.number);
  return `<div class="section-title"><h2>${T('roster')}</h2><span class="hint">${ps.length}</span></div><div class="roster">`+
    ps.map(p=>`<a class="card pcard" href="#player-${p.id}" data-peek="${p.id}"><span class="pc-num">${p.number}</span>${av(p,'m')}
      <div class="pc-txt"><div class="nm">${first(p)}${last(p)?`<br>${last(p)}`:''}</div><div class="sub">#${p.number} · ${p.pos[0]?.[0]||''}</div></div>
      ${p.t.RAT==null?'':rt(Math.round(p.t.RAT*10)/10,'lg')}</a>`).join('')+'</div>';
}
function ytId(u){ const m=(u||'').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/); return m?m[1]:null; }
function ytThumbCheck(el){ if(el.naturalWidth<=120) ytThumbFail(el); }
function ytThumbFail(el){
  if(el.src.includes('maxresdefault')) el.src=`https://i.ytimg.com/vi/${el.dataset.yt}/hqdefault.jpg`;
  else if(el.dataset.local && !el.src.endsWith(el.dataset.local)){ el.onerror=null; el.src=el.dataset.local; }
}
function featureGame(g){
  const yt=ytId(g.video), alt=`${g.teams.A.name} vs ${g.teams.B.name}`;
  // обложка с YouTube; если нет HD-обложки — обычная; если YouTube недоступен — своя картинка
  const img=yt?`<img src="https://i.ytimg.com/vi/${yt}/maxresdefault.jpg" alt="${alt}" data-yt="${yt}" data-local="${g.image||''}" onload="ytThumbCheck(this)" onerror="ytThumbFail(this)">`
    :g.image?`<img src="${g.image}" alt="${alt}">`:'';
  const media=g.video?`<a class="gmedia" href="${g.video}" target="_blank" rel="noopener">${img}<span class="play">▶</span></a>`:`<div class="gmedia">${img}</div>`;
  return `<div class="card feature">${media}<div class="fbody"><div class="meta"><span class="eyebrow">${S.games.length===1?T('firstGame'):T('lastGame')}</span><span>${fmtDate(g.date)} · ${g.venue}</span></div>
    ${linescore(g)}<div class="btns">${g.video?`<a class="btn yt" href="${g.video}" target="_blank" rel="noopener">▶ ${T('youtube')}</a>`:`<span class="btn muted">${T('videoSoon')}</span>`}</div></div></div>`;
}

/* ---------- Страницы ---------- */
let sortKey='RAT', sortDir=-1;
function home(){
  const last=S.games[S.games.length-1];
  const ps=Object.values(S.players).filter(p=>p.t.G);
  let h='';
  if(!last||!last.stats){ app().innerHTML=(last?featureGame(last):'')+seasonBanner()+rosterGrid(); return; }
  const mvp=S.players[last.mvp.player];
  h+=`<div class="hero">
    <div class="card lastgame" style="cursor:pointer" onclick="location.hash='#game-${last.id}'"><div class="meta"><span class="eyebrow">${T('lastGame')}</span><span>${fmtDate(last.date)} · ${last.venue}</span></div>
      ${linescore(last)}<div class="btns">${last.video?`<a class="btn yt" href="${last.video}" target="_blank" rel="noopener" onclick="event.stopPropagation()">▶ ${T('youtube')}</a>`:''}<span class="btn">${T('boxscore')} →</span></div></div>
    <a class="card mvp" href="#player-${mvp.id}"><span class="eyebrow">${T('potg')}</span>
      <div class="who">${av(mvp,'m')}<div><div class="name">${pname(mvp)}</div><div class="line">#${mvp.number} · ${last.mvp.pos} · ${statLine(last.mvp)}</div></div></div>
      <div>${rt(last.mvp.rating,'lg')}</div></a></div>`;
  const top=ps.filter(p=>p.t.qual).sort((a,b)=>b.t.RAT-a.t.RAT).slice(0,3);
  h+=`<div class="section-title"><h2>${T('leaders')} ${S.season}</h2><span class="hint">${T('avgPerGame')}</span></div><div class="podium">`;
  top.forEach((p,i)=>h+=`<a class="card pod" href="#player-${p.id}"><span class="place">${i+1}</span>${av(p,'m')}<div><div class="nm">${pname(p)}</div><div class="sub">#${p.number} · ${p.pos[0]?.[0]||''} · ${p.t.G} ${plural(LANG,p.t.G)}</div></div>${rt(p.t.RAT,'lg')}</a>`);
  h+=`</div><div class="section-title"><h2>${T('table')}</h2><span class="hint">${T('qualHint')(S.qual)}</span></div><div class="card tablewrap"><table class="lb" id="lb"></table></div>`;
  app().innerHTML=h; drawLB(ps);
}
function drawLB(ps){
  const COLS=[['RAT',T('rating')],['G',T('G')],['W',T('WL')],['AVG','AVG'],['OBP','OBP'],['OPS','OPS'],['HR','HR'],['RBI','RBI'],['R','R'],['E','E']];
  const val=(p,k)=>{const v=p.t[k];return v==null||!isFinite(v)?-1:v};
  ps.sort((a,b)=>(b.t.qual-a.t.qual)||sortDir*(val(a,sortKey)-val(b,sortKey))||(b.t.G-a.t.G));
  let h=`<thead><tr><th class="l">#</th><th class="l">${T('player')}</th><th class="l">${T('position')}</th>${COLS.map(([k,n])=>`<th data-k="${k}" class="${k===sortKey?'sorted':''}">${n}${k===sortKey?(sortDir<0?' ↓':' ↑'):''}</th>`).join('')}</tr></thead><tbody>`;
  let rank=0;
  for(const p of ps){ const t=p.t; if(t.qual) rank++;
    h+=`<tr data-peek="${p.id}" onclick="location.hash='#player-${p.id}'" style="${t.qual?'':'opacity:.55'}"><td class="l rank">${t.qual?rank:'–'}</td>
      <td class="l"><div class="pl">${av(p)}<div><div class="nm">${pname(p)}</div><div class="no">#${p.number}</div></div></div></td>
      <td class="l">${p.pos.slice(0,2).map((x,i)=>`<span class="chip ${i?'':'main'}">${x[0]}</span>`).join(' ')}</td>
      <td>${rt(t.RAT)}</td><td>${t.G}</td><td>${t.W}-${t.L}</td><td>${avg3(t.AVG)}</td><td>${avg3(t.OBP)}</td><td>${avg3(t.OPS)}</td><td>${t.HR}</td><td>${t.RBI}</td><td>${t.R}</td><td>${t.E}</td></tr>`; }
  const el=document.getElementById('lb'); el.innerHTML=h+'</tbody>';
  el.querySelectorAll('th[data-k]').forEach(th=>th.onclick=()=>{const k=th.dataset.k; if(k===sortKey) sortDir*=-1; else {sortKey=k; sortDir=-1;} drawLB(ps);});
}
function chart(p){
  const L=p.log, n=L.length; if(!n) return '';
  const W0=1000,H0=260,pad=36,bw=Math.min(64,(W0-pad*2)/n*0.62),step=(W0-pad*2)/n, y=v=>H0-40-((v-3)/7)*(H0-70);
  let s=`<svg viewBox="0 0 ${W0} ${H0}" role="img" aria-label="${T('byGame')}">`;
  for(const g of [4,6,8,10]) s+=`<line x1="${pad}" x2="${W0-pad}" y1="${y(g)}" y2="${y(g)}" stroke="#1f3150"/><text x="${pad-10}" y="${y(g)+4}" fill="#5f6f88" font-size="12" text-anchor="end">${g}</text>`;
  L.forEach(({game,b},i)=>{const x=pad+step*i+(step-bw)/2;
    s+=`<a href="#game-${game.id}"><rect x="${x}" y="${y(b.rating)}" width="${bw}" height="${y(3)-y(b.rating)}" rx="6" fill="${RCOL[rclass(b.rating)]}"/>
    <text x="${x+bw/2}" y="${y(b.rating)-8}" fill="#eef2f8" font-size="15" font-weight="800" text-anchor="middle">${b.rating.toFixed(1)}</text>
    <text x="${x+bw/2}" y="${H0-16}" fill="#8fa0b8" font-size="12" text-anchor="middle">${fmtDate(game.date,{day:'numeric',month:'short'})}</text></a>`;});
  if(p.t.RAT!=null) s+=`<line x1="${pad}" x2="${W0-pad}" y1="${y(p.t.RAT)}" y2="${y(p.t.RAT)}" stroke="#EF9F27" stroke-dasharray="6 6" stroke-width="2"/><text x="${W0-pad}" y="${y(p.t.RAT)-6}" fill="#EF9F27" font-size="12" font-weight="700" text-anchor="end">${T('avgLbl')} ${p.t.RAT.toFixed(2)}</text>`;
  return s+'</svg>';
}
// ±очки (вклад) и разбивка рейтинга на нападение и защиту
function pts(v){ if(v==null) return '–'; const r=Math.round(v*100)/100; return `<span class="pts ${r>0?'pos':r<0?'neg':''}">${r>0?'+':r<0?'−':'±'}${Math.abs(r).toFixed(2)}</span>`; }
function rsplit(t){
  const cell=(lbl,ic,v)=>`<div class="rs-i"><span class="rs-l">${ic}${lbl}</span>${rt(Math.round(Math.min(10,Math.max(3,BASE+v))*10)/10)}${pts(v)}</div>`;
  return `<div class="rsplit">${cell(T('rOff'),'<svg viewBox="0 0 24 24"><path d="M4 20 18 6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="19.5" cy="4.5" r="2.5" fill="currentColor"/></svg>',t.OFF)}${cell(T('rDef'),'<svg viewBox="0 0 24 24"><path d="M7 21c-2-1-3-3-3-6V9a1.5 1.5 0 013 0V5a1.5 1.5 0 013 0V4a1.5 1.5 0 013 0v1a1.5 1.5 0 013 0v5l1-1a1.6 1.6 0 012.3 2.2L15 17c-1 2-3 4-6 4z" fill="currentColor"/></svg>',t.DEF)}</div>
    <div class="rs-hint">${T('rSplit')(BASE.toFixed(1))}</div>`;
}
function player(id){
  const p=S.players[id]; if(!p){app().innerHTML=`<p class="muted">${T('notFound')}</p>`;return;}
  const t=p.t, has=t.G>0, d=v=>has?v:'–';
  let h=`<div class="card phead"><span class="bignum">${p.number}</span>${av(p,'xl')}
    <div><span class="eyebrow">#${p.number} · ${T('season')} ${S.season}</span><h1>${first(p)}<span>${last(p).toUpperCase()}</span></h1>
    <div class="posname">${POS_NAMES[LANG][p.pos[0]?.[0]]||''}${!has&&p.pos.length?` · <span class="muted">${T('mainPos')}</span>`:''}</div>
    <div class="chips">${p.pos.map(posChip).join('')}</div></div>
    <div class="rbox">${rt(t.RAT==null?null:Math.round(t.RAT*10)/10,'xl')}<div class="lbl">${has?T('avgRating'):T('noRating')}</div>${has?rsplit(t):''}</div></div>
    <div class="kpis">${[[T('G'),t.G],[T('W'),d(`${t.W}-${t.L}`)],['AVG',d(avg3(t.AVG))],['OBP',d(avg3(t.OBP))],['SLG',d(avg3(t.SLG))],['OPS',d(avg3(t.OPS))],['HR',d(t.HR)],['RBI',d(t.RBI)],[T('R'),d(t.R)],[T('PO'),d(t.PO)]]
      .map(([n,v])=>`<div class="card kpi"><div class="v">${v}</div><div class="k">${n}</div></div>`).join('')}</div>`;
  const X=window.playerExtras||(()=>({top:'',bottom:''})), ex=X(p);
  h+=ex.top;
  if(!has){ app().innerHTML=h+`<div class="card empty">${T('noStats')}</div>`+ex.bottom; return; }
  h+=`<div class="section-title"><h2>${T('byGame')}</h2><span class="hint">${T('dashed')}</span></div><div class="card chart">${chart(p)}</div>
    <div class="section-title"><h2>${T('allGames')}</h2></div><div class="card tablewrap"><table class="lb"><thead><tr><th class="l">${T('date')}</th><th class="l">${T('team')}</th><th class="l">${T('pos')}</th><th>${T('rating')}</th><th title="${T('rOff')}">${T('rOffS')}</th><th title="${T('rDef')}">${T('rDefS')}</th><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>R</th><th>RBI</th><th>BB</th><th>K</th><th>PO</th><th>A</th><th>E</th><th class="l">${T('result')}</th></tr></thead><tbody>`;
  for(const {game:g,b} of [...p.log].reverse()){
    const tm=g.teams[b.team], res=g.winner===b.team?`<b style="color:var(--r-good)">${T('win')}</b>`:g.winner?`<b style="color:var(--r-low)">${T('loss')}</b>`:T('tie');
    h+=`<tr onclick="location.hash='#game-${g.id}'"><td class="l">${fmtDate(g.date)}</td><td class="l"><span class="chip" style="background:${tm.color}22;color:${tm.color}">${tm.name}</span></td><td class="l">${b.pos}</td><td>${rt(b.rating)}</td><td>${pts(b.rOff)}</td><td>${pts(b.rDef)}</td><td>${b.AB}</td><td>${b.H}</td><td>${b['2B']}</td><td>${b['3B']}</td><td>${b.HR}</td><td>${b.R}</td><td>${b.RBI}</td><td>${b.BB}</td><td>${b.K}</td><td>${b.PO}</td><td>${b.A}</td><td>${b.E}</td><td class="l">${res} ${g.score[b.team]}:${g.score[b.team==='A'?'B':'A']}</td></tr>`;
  }
  app().innerHTML=h+'</tbody></table></div>'+ex.bottom;
}
function games(){
  let h=`<div class="section-title" style="margin-top:0"><h2>${T('games')}</h2><span class="hint">${S.games.length} ${plural(LANG,S.games.length)}</span></div>`;
  if(!S.games.length){ app().innerHTML=h+`<div class="card empty">${T('noGames')}</div>`; return; }
  h+=`<div class="${S.games.some(g=>g.stats)?'glist':'gstack'}">`;
  for(const g of [...S.games].reverse()) h+=!g.stats?featureGame(g):`<a class="card gcard" href="#game-${g.id}"><div class="d">${fmtDate(g.date)} · ${g.venue}</div>
      ${['A','B'].map(k=>`<div class="t ${g.winner===k?'win':''}"><span><i class="tbar" style="background:${g.teams[k].color}"></i>${g.teams[k].name}</span><b>${g.score[k]}</b></div>`).join('')}
      <div class="d" style="margin:10px 0 0">${T('potg')}: <b style="color:var(--text)">${pname(S.players[g.mvp.player])}</b> ${rt(g.mvp.rating)}</div></a>`;
  app().innerHTML=h+'</div>';
}
function game(id){
  const g=S.games.find(x=>x.id===id); if(g&&!g.stats){ app().innerHTML=featureGame(g); return; } if(!g){app().innerHTML=`<p class="muted">${T('notFound')}</p>`;return;}
  let h=`<span class="eyebrow">${fmtDate(g.date)} · ${g.venue}</span><div class="card lastgame" style="margin-top:12px">${linescore(g)}
    <div class="btns">${g.video?`<a class="btn yt" href="${g.video}" target="_blank" rel="noopener">▶ ${T('youtube')}</a>`:''}</div></div>`;
  for(const k of ['A','B']){
    h+=`<div class="section-title"><h2 style="color:${g.teams[k].color}">${g.teams[k].name}</h2><span class="hint">${g.winner===k?T('winL'):g.winner?T('lossL'):T('tieL')} · ${g.score[k]} ${T('runs')}</span></div>
    <div class="card tablewrap"><table class="lb"><thead><tr><th class="l">${T('player')}</th><th class="l">${T('pos')}</th><th>${T('rating')}</th><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>R</th><th>RBI</th><th>BB</th><th>ROE</th><th>K</th><th>PO</th><th>A</th><th>E</th></tr></thead><tbody>`;
    for(const b of g.box.filter(b=>b.team===k)){const p=S.players[b.player];
      h+=`<tr onclick="location.hash='#player-${p.id}'"><td class="l"><div class="pl">${av(p)}<div><div class="nm">${pname(p)}${g.mvp===b?` <span class="chip main">${T('mvp')}</span>`:''}</div><div class="no">#${p.number}</div></div></div></td><td class="l">${b.pos}</td><td>${rt(b.rating)}</td><td>${b.AB}</td><td>${b.H}</td><td>${b['2B']}</td><td>${b['3B']}</td><td>${b.HR}</td><td>${b.R}</td><td>${b.RBI}</td><td>${b.BB}</td><td>${b.ROE||0}</td><td>${b.K}</td><td>${b.PO}</td><td>${b.A}</td><td>${b.E}</td></tr>`;}
    h+='</tbody></table></div>';
  }
  if(window.gameHighlights) h+=gameHighlights(g);
  app().innerHTML=h;
}

/* ---------- Мини-превью игрока при наведении ---------- */
function peekHTML(p){
  const t=p.t, has=t.G>0, main=p.pos[0]?.[0];
  const big=p.photo?`<img src="${p.photo}" alt="">`:`<span>${p.number}</span>`;
  return `<div class="pk-top"><div class="pk-photo ${p.photo?'':'nophoto'}">${big}</div>
    <div class="pk-num">${p.number}</div></div>
    <div class="pk-body"><div class="pk-name">${first(p)}${last(p)?` <b>${last(p)}</b>`:''}</div>
    <div class="pk-pos">${main?`${POS_NAMES[LANG][main]||main}`:''}</div>
    <div class="pk-chips">${p.pos.map(posChip).join('')}</div>
    <div class="pk-rt">${rt(t.RAT==null?null:Math.round(t.RAT*10)/10,'lg')}<span>${has?T('avgRating'):T('noRating')}</span></div>
    ${has?`<div class="pk-split"><span>${T('rOff')} ${pts(t.OFF)}</span><span>${T('rDef')} ${pts(t.DEF)}</span></div>`:''}
    ${has?`<div class="pk-stats">${[[T('G'),t.G],['AVG',avg3(t.AVG)],['OPS',avg3(t.OPS)],['HR',t.HR],['RBI',t.RBI]].map(([k,v])=>`<div><b>${v}</b><i>${k}</i></div>`).join('')}</div>`:''}
    <div class="pk-go">${T('openProfile')} →</div></div>`;
}
const PEEK={el:null,timer:null,cur:null};
function initPeek(){
  if(!window.matchMedia||!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  PEEK.el=document.createElement('div'); PEEK.el.className='peek'; document.body.appendChild(PEEK.el);
  document.addEventListener('mouseover',e=>{
    const a=e.target.closest('[data-peek]'); if(!a||a===PEEK.cur) return;
    PEEK.cur=a; clearTimeout(PEEK.timer);
    PEEK.timer=setTimeout(()=>showPeek(a),180);
  });
  document.addEventListener('mouseout',e=>{
    const a=e.target.closest('[data-peek]'); if(!a||a.contains(e.relatedTarget)) return;
    PEEK.cur=null; clearTimeout(PEEK.timer); PEEK.el.classList.remove('on');
  });
  window.addEventListener('scroll',()=>{PEEK.el.classList.remove('on');PEEK.cur=null;},{passive:true});
  window.addEventListener('hashchange',()=>{PEEK.el.classList.remove('on');PEEK.cur=null;});
}
function showPeek(a){
  const p=S.players[a.dataset.peek]; if(!p||PEEK.cur!==a) return;
  const el=PEEK.el; el.innerHTML=peekHTML(p); el.classList.add('measure');
  const r=a.getBoundingClientRect(), W=el.offsetWidth, H=el.offsetHeight, gap=14, vw=innerWidth, vh=innerHeight;
  let x=r.right+gap; if(x+W>vw-8) x=r.left-gap-W; if(x<8) x=Math.min(vw-W-8,Math.max(8,r.left));
  let y=r.top+r.height/2-H/2; y=Math.max(8,Math.min(vh-H-8,y));
  el.style.left=(x+scrollX)+'px'; el.style.top=(y+scrollY)+'px';
  el.classList.remove('measure'); requestAnimationFrame(()=>el.classList.add('on'));
}

/* ---------- Навигация и язык ---------- */
function chrome(){
  document.documentElement.lang=LANG;
  document.title=`${S.league||'Softball Baku'} · ${T('title')}`;
  document.querySelectorAll('[data-t]').forEach(el=>el.textContent=T(el.dataset.t));
  document.querySelectorAll('.top .lang button').forEach(b=>b.classList.toggle('active',b.dataset.lang===LANG));
  document.getElementById('foot').innerHTML=footer();
  document.querySelectorAll('.foot .lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
}
function footer(){
  const lg=S.league||'Softball Baku', vid=[...(S.games||[])].reverse().find(g=>g.video)?.video;
  const startTxt=S.start?(LANG==='en'?fmtDate(S.start,{day:'numeric',month:'long'}):fromDate(S.start)):'';
  const L=S.links||{};
  const ICON={youtube:'<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" fill="#c4302b"/><path d="M10 9l5 3-5 3z" fill="#fff"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#25D366"/><path d="M8.5 7.5c.3-.4.8-.4 1 0l.9 1.9c.1.3 0 .6-.2.8l-.6.6c.6 1.3 1.7 2.4 3 3l.6-.6c.2-.2.5-.3.8-.2l1.9.9c.4.2.4.7 0 1-1 1.1-2.4 1.3-3.7.6-2-1-3.6-2.6-4.6-4.6-.7-1.3-.5-2.7.9-3.4z" fill="#fff"/></svg>'};
  const socials=Object.entries(ICON).filter(([k])=>L[k]).map(([k,svg])=>`<a class="soc" href="${L[k]}" target="_blank" rel="noopener" aria-label="${k}" title="${k==='youtube'?T('channel'):'WhatsApp'}">${svg}</a>`).join('');
  const langs=['az','ru','en'].map(l=>`<button data-lang="${l}" class="${l===LANG?'active':''}">${l.toUpperCase()}</button>`).join('');
  return `<div class="foot-stripe"><i style="background:var(--bina)"></i><i style="background:var(--amber)"></i><i style="background:var(--flames)"></i></div>
  <div class="foot-inner">
    <div class="foot-brand">
      <a class="brand" href="#rating"><span class="brand-mark">${ballSVG()}</span><span class="brand-text">SOFTBALL <b>BAKU</b></span></a>
      <p>${T('tagline')}</p>
      ${socials?`<div class="socials">${socials}</div>`:''}
      ${window.installBtnHTML?installBtnHTML():''}
      ${S.season?`<span class="foot-pill">${T('seasonPill')({season:S.season,start:startTxt})}</span>`:''}
    </div>
    <div class="foot-col"><h4>${T('site')}</h4><a href="#rating">${T('rating')}</a><a href="#games">${T('games')}</a>${I18N[LANG].navTeams?`<a href="#teams">${T('navTeams')}</a><a href="#records">${T('navRecords')}</a><a href="#rules">${T('navRules')}</a>`:''}</div>
    <div class="foot-col"><h4>${T('watch')}</h4>${L.youtube?`<a href="${L.youtube}" target="_blank" rel="noopener"><span class="yt-dot">▶</span>${T('channel')}</a>`:''}${vid?`<a href="${vid}" target="_blank" rel="noopener"><span class="yt-dot">▶</span>${T('lastVideo')}</a>`:(L.youtube?'':`<span class="muted">${T('videoSoon')}</span>`)}</div>
    <div class="foot-col"><h4>${T('where')}</h4><span>${T('place')}</span></div>
    <svg class="foot-diamond" viewBox="0 0 200 200" aria-hidden="true">
      <path d="M100 185 L15 100 A120 120 0 0 1 185 100 Z" fill="none" stroke="#1f3150" stroke-width="2"/>
      <path d="M100 170 L45 115 L100 60 L155 115 Z" fill="rgba(239,159,39,.06)" stroke="#2a3a55" stroke-width="2"/>
      <rect x="149" y="109" width="12" height="12" transform="rotate(45 155 115)" fill="#8fa0b8"/>
      <rect x="94" y="54" width="12" height="12" transform="rotate(45 100 60)" fill="#8fa0b8"/>
      <rect x="39" y="109" width="12" height="12" transform="rotate(45 45 115)" fill="#8fa0b8"/>
      <path d="M92 166 h16 v6 l-8 7 l-8 -7 z" fill="#EF9F27"/>
      <circle cx="100" cy="118" r="4" fill="#2a3a55"/>
    </svg>
  </div>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${lg} · ${T('footer')}</span>
    <div class="lang" role="group" aria-label="${T('language')}">${langs}</div></div>`;
}
/* ---------- Счётчик посещений (GoatCounter, без cookies) ---------- */
function countView(){ try{ if(window.goatcounter&&window.goatcounter.count) window.goatcounter.count({path:'/'+((location.hash||'').slice(1)||'rating')}); }catch(e){} }
function initAnalytics(){
  const code=S.analytics&&S.analytics.goatcounter; if(!code) return;
  window.goatcounter={no_onload:true};
  const sc=document.createElement('script'); sc.async=true; sc.src='https://gc.zgo.at/count.js';
  sc.dataset.goatcounter=`https://${code}.goatcounter.com/count`; sc.onload=countView; document.head.appendChild(sc);
}
function setLang(l){ LANG=l; try{localStorage.setItem('lang',LANG);}catch(e){} if(S.demo&&I18N[LANG].demoBanner) document.getElementById('demo-banner').innerHTML=T('demoBanner'); chrome(); route(); }
function route(){
  const h=(location.hash||'').slice(1), i=h.indexOf('-');
  const page=i<0?h:h.slice(0,i), id=i<0?'':h.slice(i+1);
  const navKey={games:'games',game:'games',teams:'teams',records:'records',rules:'rules'}[page]||'home';
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===navKey));
  const FR=window.FEATURE_ROUTES||{};
  if(page==='player') player(id); else if(page==='game') game(id); else if(page==='games') games(); else if(FR[page]) FR[page](id); else home();
}
document.querySelectorAll('.top .lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
function start(){ load().then(()=>{const db=document.getElementById('demo-banner'); db.hidden=!S.demo; if(S.demo&&I18N[LANG].demoBanner) db.innerHTML=T('demoBanner'); chrome(); route(); initAnalytics(); initPeek(); window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);countView();});})
  .catch(e=>{chrome(); app().innerHTML=`<p class="muted">${T('loadErr')}: ${e.message}</p>`;}); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
