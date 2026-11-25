// Softball Baku — лента событий на главной и карта ударов на странице игрока.
// Всё считается из протоколов игр (data/games/*.json → box и plays), без сервера.
'use strict';
(function(){

const HITS=['1B','2B','3B','HR'];
Object.assign(I18N.ru,{
  fdTitle:'Лента событий',fdHint:'обновляется после каждой игры',
  fdGame:(a,sa,sb,b)=>`${a} ${sa}:${sb} ${b}`,fdGameSub:n=>`Игрок матча — ${n}`,
  fdFirstHR:n=>`${n} выбил первый хоум-ран`,fdMultiHR:(n,k)=>`${n}: ${k} хоум-рана за игру`,
  fdStreak:(n,k)=>`${n} — ${k} игры подряд с хитом`,fdBig:(n,r)=>`${n} сыграл на ${r}`,
  fdRecH:(n,k)=>`Новый рекорд: ${n} — ${k} хитов за игру`,fdRecRBI:(n,k)=>`Новый рекорд: ${n} — ${k} RBI за игру`,
  fdDebut:n=>`${n} провёл первую игру`,fdPerfect:(n,h,ab)=>`${n} — ${h} из ${ab}, ни одного аута на бите`,
  spTitle:'Карта ударов',spGround:'по земле',spFly:'в воздухе',spLine:'лайн-драйв',spReplay:'Повторить',spHint:'куда игрок отправляет мяч',spHit:'хит',spOut:'аут',spErr:'ошибка защиты',
  spLeft:'влево',spCenter:'центр',spRight:'вправо',spBalls:n=>`мячей в игре: ${n}`,
  spNoDir:'Направление хитов записывается с новых игр — пока на карте в основном ауты.',spFew:'Пока нет мячей с известным направлением — карта заполнится с новыми играми.'
});
Object.assign(I18N.az,{
  fdTitle:'Hadisələr lenti',fdHint:'hər oyundan sonra yenilənir',
  fdGame:(a,sa,sb,b)=>`${a} ${sa}:${sb} ${b}`,fdGameSub:n=>`Oyunun ən yaxşısı — ${n}`,
  fdFirstHR:n=>`${n} ilk homeranını vurdu`,fdMultiHR:(n,k)=>`${n}: bir oyunda ${k} homeran`,
  fdStreak:(n,k)=>`${n} — ardıcıl ${k} oyunda hit`,fdBig:(n,r)=>`${n} ${r} reytinqlə oynadı`,
  fdRecH:(n,k)=>`Yeni rekord: ${n} — bir oyunda ${k} hit`,fdRecRBI:(n,k)=>`Yeni rekord: ${n} — bir oyunda ${k} RBI`,
  fdDebut:n=>`${n} ilk oyununu keçirdi`,fdPerfect:(n,h,ab)=>`${n} — ${ab} vuruşdan ${h} hit, bir dəfə də aut olmadı`,
  spTitle:'Zərbə xəritəsi',spGround:'yerlə',spFly:'havadan',spLine:'düz zərbə',spReplay:'Təkrarla',spHint:'oyunçu topu hara göndərir',spHit:'hit',spOut:'aut',spErr:'müdafiə səhvi',
  spLeft:'sola',spCenter:'mərkəz',spRight:'sağa',spBalls:n=>`oyundakı toplar: ${n}`,
  spNoDir:'Hitlərin istiqaməti yeni oyunlardan qeyd olunur — hələlik xəritədə əsasən autlar var.',spFew:'Hələ istiqaməti məlum olan top yoxdur — xəritə yeni oyunlarla dolacaq.'
});
Object.assign(I18N.en,{
  fdTitle:'Activity feed',fdHint:'updates after every game',
  fdGame:(a,sa,sb,b)=>`${a} ${sa}:${sb} ${b}`,fdGameSub:n=>`Player of the game — ${n}`,
  fdFirstHR:n=>`${n} hit his first home run`,fdMultiHR:(n,k)=>`${n}: ${k} home runs in one game`,
  fdStreak:(n,k)=>`${n} — hits in ${k} straight games`,fdBig:(n,r)=>`${n} played to a ${r}`,
  fdRecH:(n,k)=>`New record: ${n} — ${k} hits in a game`,fdRecRBI:(n,k)=>`New record: ${n} — ${k} RBI in a game`,
  fdDebut:n=>`${n} played his first game`,fdPerfect:(n,h,ab)=>`${n} — ${h} for ${ab}, never out at the plate`,
  spTitle:'Spray Chart',spGround:'ground ball',spFly:'fly ball',spLine:'line drive',spReplay:'Replay',spHint:'where this batter hits the ball',spHit:'hit',spOut:'out',spErr:'reached on error',
  spLeft:'left field',spCenter:'center field',spRight:'right field',spBalls:n=>`batted balls: ${n}`,
  spNoDir:'Hit locations are tracked from the next game on, so for now the chart mostly shows outs.',spFew:'No batted balls with a known location yet. The chart fills in as new games are scored.'
});

const P=id=>S.players[id];
const nm=id=>{ const p=P(id); return p?esc(pname(p)):esc(id); };

/* ---------- лента событий ---------- */
function feedEvents(){
  const games=S.games.filter(g=>g.stats), out=[];
  const hrSeen={}, played={}, streak={}, rec={H:0,RBI:0};
  games.forEach((g,gi)=>{
    const ev=[], add=(ic,txt,href,pid,w)=>ev.push({g,ic,txt,href,pid,w});
    const win=g.score.A>g.score.B?'A':g.score.B>g.score.A?'B':null, lose=win==='A'?'B':'A';
    const a=win||'A', b=win?lose:'B';
    add('game',T('fdGame')(esc(g.teams[a].name),g.score[a],g.score[b],esc(g.teams[b].name))+(g.mvp?`<span>${T('fdGameSub')(nm(g.mvp.player))}</span>`:''),`#game-${g.id}`,g.mvp&&g.mvp.player,0);
    const recH=rec.H, recR=rec.RBI;
    for(const x of g.box){ const id=x.player; if(!P(id)) continue;
      if(gi>0&&!played[id]) add('debut',T('fdDebut')(nm(id)),`#player-${id}`,id,9);
      played[id]=true;
      if(x.HR>0&&!hrSeen[id]) add('hr',T('fdFirstHR')(nm(id)),`#player-${id}`,id,2);
      if(x.HR>1) add('hr',T('fdMultiHR')(nm(id),x.HR),`#player-${id}`,id,3);
      if(x.HR>0) hrSeen[id]=true;
      streak[id]=x.H>0?(streak[id]||0)+1:0;
      if(streak[id]>=3) add('streak',T('fdStreak')(nm(id),streak[id]),`#player-${id}`,id,4);
      if(x.rating>=9) add('big',T('fdBig')(nm(id),x.rating.toFixed(1)),`#player-${id}`,id,5);
      if(x.AB>=4&&x.H===x.AB) add('perfect',T('fdPerfect')(nm(id),x.H,x.AB),`#player-${id}`,id,6);
      if(gi>0&&x.H>recH&&x.H>=3) add('rec',T('fdRecH')(nm(id),x.H),`#player-${id}`,id,1);
      if(gi>0&&x.RBI>recR&&x.RBI>=3) add('rec',T('fdRecRBI')(nm(id),x.RBI),`#player-${id}`,id,1);
      rec.H=Math.max(rec.H,x.H); rec.RBI=Math.max(rec.RBI,x.RBI);
    }
    out.push(...ev);
  });
  return out;
}
const FD_IC={game:'plate',debut:'cap',hr:'hr',streak:'fire',big:'star',perfect:'target',rec:'trophy'};
/* ---------- лента событий в виде газеты (25.11.2026): 3 варианта оформления, выбор — localStorage sb.fdv (a/b/c) ---------- */
Object.assign(I18N.ru,{npName:'Вестник Softball Baku',npTag:'Еженедельная газета любительского софтбола · Баку',npNo:n=>`№ ${n}`,npPrice:'Цена: одна хорошая подача',npPrev:'Прошлые выпуски',npMore:'Читать',npBrief:'Коротко',
  npK:{game:'Итог игры',hr:'Хоум-ран',streak:'Серия',big:'Звезда игры',perfect:'Идеальная игра',rec:'Рекорд',debut:'Дебют'},npMvp:'Игрок матча',npRt:'рейтинг'});
Object.assign(I18N.az,{npName:'Softball Baku Qəzeti',npTag:'Həvəskar softbolun həftəlik qəzeti · Bakı',npNo:n=>`№ ${n}`,npPrice:'Qiyməti: bir yaxşı atış',npPrev:'Əvvəlki saylar',npMore:'Oxu',npBrief:'Qısa xəbərlər',
  npK:{game:'Oyunun nəticəsi',hr:'Homeran',streak:'Seriya',big:'Oyunun ulduzu',perfect:'Mükəmməl oyun',rec:'Rekord',debut:'Debüt'},npMvp:'Oyunun ən yaxşısı',npRt:'reytinq'});
Object.assign(I18N.en,{npName:'The Softball Baku Times',npTag:'The weekly paper of amateur softball · Baku',npNo:n=>`No. ${n}`,npPrice:'Price: one good pitch',npPrev:'Past issues',npMore:'Read',npBrief:'In brief',
  npK:{game:'Final score',hr:'Home run',streak:'Streak',big:'Star of the game',perfect:'Perfect day',rec:'Record',debut:'Debut'},npMvp:'Player of the game',npRt:'rating'});
const strip=s=>String(s).replace(/<span>.*?<\/span>/,'');
function paperIssues(){
  const games=S.games.filter(g=>g.stats); if(!games.length) return [];
  const all=feedEvents();
  return [...games].reverse().map(g=>({g,no:games.indexOf(g)+1,ev:all.filter(e=>e.g===g&&e.ic!=='game').sort((p,q)=>p.w-q.w)}));
}
function bigPhoto(p,cls){ return p&&p.photo?`<img class="${cls}" src="${avSrc(p.photo,'xl')}" alt="${esc(pname(p))}" loading="lazy">`:`<span class="${cls} np-nophoto">⚾</span>`; }
function feedBlock(){
  const I=paperIssues(); if(!I.length) return '';
  const v=(()=>{ try{ const q=new URLSearchParams(location.search).get('gazeta'); if(/^[abc]$/.test(q||'')) localStorage.setItem('sb.fdv',q); return localStorage.getItem('sb.fdv')||'c'; }catch(e){ return 'c'; } })(); // ?gazeta=a|b|c — посмотреть вариант
  const cur=I[0], g=cur.g, win=g.score.A>g.score.B?'A':g.score.B>g.score.A?'B':null, a=win||'A', b=a==='A'?'B':'A';
  const mvp=g.mvp&&P(g.mvp.player), K=T('npK'), date=fmtDate(g.date,{day:'numeric',month:'long',year:'numeric'});
  const head=`${esc(g.teams[a].name)} ${g.score[a]}:${g.score[b]} ${esc(g.teams[b].name)}`;
  const lead=mvp?`${T('npMvp')} — <b>${esc(pname(mvp))}</b>, ${T('npRt')} ${g.mvp.rating.toFixed(1)}`:''; // без вложенных ссылок: вся заметка — ссылка на игру
  const items=cur.ev.slice(0,v==='c'?6:5);
  const prev=I.slice(1,4).map(x=>{ const w=x.g.score.A>=x.g.score.B?'A':'B', l=w==='A'?'B':'A';
    return `<a class="np-prev-i" href="#game-${x.g.id}"><b>${T('npNo')(x.no)}</b> · ${fmtDate(x.g.date,{day:'numeric',month:'short'})}<span>${esc(x.g.teams[w].name)} ${x.g.score[w]}:${x.g.score[l]} ${esc(x.g.teams[l].name)}</span></a>`; }).join('');
  let h='';
  if(v==='a'){ // классическая газета: шапка с названием, крупный заголовок, колонки
    h=`<div class="np np-a"><div class="np-mast"><div class="np-meta"><span>${T('npNo')(cur.no)}</span><span>${date}</span><span>${T('npPrice')}</span></div>
      <h3 class="np-title">${T('npName')}</h3><div class="np-tag">${T('npTag')}</div></div>
      <a class="np-lead" href="#game-${g.id}"><div class="np-lead-t"><span class="np-kick">${K.game}</span><h4>${head}</h4><p>${lead}</p></div>${mvp?`<figure>${bigPhoto(mvp,'np-ph')}<figcaption>${esc(pname(mvp))}</figcaption></figure>`:''}</a>
      <div class="np-cols">${items.map(e=>{ const p=e.pid&&P(e.pid); return `<a class="np-art" href="${e.href}"><span class="np-kick">${K[e.ic]||''}</span><p>${e.txt}</p>${p?`<span class="np-by">${av(p)}${esc(pname(p))}</span>`:''}</a>`; }).join('')}</div>
      ${prev?`<div class="np-prev"><span class="np-prev-h">${T('npPrev')}</span>${prev}</div>`:''}</div>`;
  } else if(v==='b'){ // спортивный таблоид: красная шапка, огромный заголовок, фото звезды, колонка «Коротко»
    h=`<div class="np np-b"><div class="np-mast"><h3 class="np-title">${T('npName')}</h3><span>${T('npNo')(cur.no)} · ${date}</span></div>
      <div class="np-b-grid"><a class="np-lead" href="#game-${g.id}">${mvp?bigPhoto(mvp,'np-ph'):''}<div class="np-lead-t"><span class="np-kick">${K.game}</span><h4>${head}</h4><p>${lead}</p></div></a>
      <div class="np-brief"><div class="np-brief-h">${T('npBrief')}</div>${items.map(e=>{ const p=e.pid&&P(e.pid); return `<a class="np-art" href="${e.href}">${p?av(p):''}<div><span class="np-kick">${K[e.ic]||''}</span><p>${e.txt}</p></div></a>`; }).join('')}</div></div>
      ${prev?`<div class="np-prev"><span class="np-prev-h">${T('npPrev')}</span>${prev}</div>`:''}</div>`;
  } else { // вырезки из газеты на пробковой доске
    const rot=[-2.2,1.6,-1.2,2.4,-1.8,1.1,-.8], seen=new Set(mvp?[mvp.id]:[]);
    h=`<div class="np np-c"><a class="np-clip np-clip-lead" href="#game-${g.id}" style="--r:-1deg"${mvp?` data-pid="${mvp.id}"`:''}><span class="np-tape"></span><div class="np-paper-name">${T('npName')} · ${T('npNo')(cur.no)} · ${date}</div><div class="np-cl-row"><div><h4>${head}</h4><p>${lead}</p></div>${mvp?bigPhoto(mvp,'np-ph'):''}</div></a>
      ${items.map((e,i)=>{ const p=e.pid&&P(e.pid), ph=p&&!seen.has(p.id); if(p) seen.add(p.id); return `<a class="np-clip" href="${e.href}" style="--r:${rot[i%rot.length]}deg"${p?` data-pid="${p.id}"`:''}><span class="np-tape"></span><span class="np-kick">${K[e.ic]||''}</span>${ph?bigPhoto(p,'np-ph'):''}<p>${e.txt}</p></a>`; }).join('')}</div>`;
  }
  return `<div class="section-title"><h2>${T('fdTitle')}</h2><span class="hint">${T('fdHint')}</span></div>${h}`;
}
window.fdVariant=v=>{ try{ localStorage.setItem('sb.fdv',v); }catch(e){} const s=document.querySelector('.feed-sec'); if(s) s.innerHTML=feedBlock(); };

/* ---------- карта ударов ---------- */
const XY={P:[150,168],C:[150,226],'1B':[204,160],'2B':[180,124],SS:[120,124],'3B':[96,160],LF:[62,82],LCF:[104,54],CF:[150,42],RCF:[196,54],RF:[238,82]};
const SIDE={'3B':'L',SS:'L',LF:'L',LCF:'C',CF:'C',RCF:'C',P:'C',C:'C','2B':'R','1B':'R',RF:'R'};
function posOf(g,id){ const b=g.box.find(x=>x.player===id); return b?b.pos:null; }
// как летел мяч: g — по земле (прямая), l — лайн-драйв (лёгкая дуга), f — флай (высокая дуга)
const INF=['P','C','1B','2B','3B','SS'];
function trajOf(r,pos,bt){
  if(bt==='g'||bt==='l'||bt==='f') return bt;   // записано в счётчике
  const inf=INF.includes(pos);
  if(r==='GO'||r==='FC') return 'g';
  if(r==='FO'||r==='SAC') return 'f';
  if(r==='HR'||r==='3B') return 'f';
  if(r==='2B') return inf?'g':'l';
  if(r==='1B') return inf?'g':'l';
  return inf?'g':'f';   // ROE: по зоне ошибки
}
function ballsOf(p){
  const out=[]; let hitsNoDir=0;
  for(const {game:g} of p.log){ if(!g.plays) continue;
    for(const x of g.plays){ if(x.b!==p.id) continue;
      let pos=null, kind=null;
      if(HITS.includes(x.r)){ kind='h'; pos=x.d||(x.f&&x.f[0]?posOf(g,x.f[0]):null); if(!pos){ hitsNoDir++; continue; } }
      else if(['GO','FO','FC','SAC'].includes(x.r)&&(x.d||x.f&&x.f[0])){ kind='o'; pos=x.d||posOf(g,x.f[0]); }
      else if(x.r==='ROE'&&(x.d||x.e&&x.e[0])){ kind='e'; pos=x.d||posOf(g,x.e[0]); }   // d — куда ушёл мяч (ошибиться мог принимающий, напр. 1B)
      if(pos&&XY[pos]) out.push({pos,kind,r:x.r,tr:trajOf(x.r,pos,x.bt)});
    } }
  return {balls:out,hitsNoDir};
}
window.SPRAY={XY,SIDE,HITS,posOf,trajOf}; // для scout.js
const R_=new Proxy({},{get:(o,k)=>((I18N[LANG]&&I18N[LANG].pbR)||{})[k]});
window.spReplay=btn=>{ const sv=btn.closest('.spray').querySelector('.sp-svg'); sv.classList.remove('go'); void sv.getBoundingClientRect(); sv.classList.add('go'); };
function spObserve(){
  document.querySelectorAll('.sp-svg:not(.obs)').forEach(sv=>{ sv.classList.add('obs');
    if(!('IntersectionObserver' in window)){ sv.classList.add('go'); return; }
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ sv.classList.add('go'); io.disconnect(); } }),{threshold:.35}); io.observe(sv); });
}
function spray(p){
  if(!p.log||!p.log.some(l=>l.game.plays)) return '';
  const {balls,hitsNoDir}=ballsOf(p);
  let h=`<div class="section-title"><h2>${T('spTitle')}</h2><span class="hint">${T('spHint')}</span></div><div class="card spray">`;
  if(balls.length<1) return h+`<p class="muted sp-note">${T('spFew')}</p></div>`;
  const by={}; balls.forEach(b=>(by[b.pos]=by[b.pos]||[]).push(b));
  const COL={h:'var(--r-good)',o:'var(--r-low)',e:'var(--amber)'};
  let svg=`<svg viewBox="0 0 300 250" class="sp-svg" role="img" aria-label="${T('spTitle')}">
    <path d="M150 236 L14 100 A190 190 0 0 1 286 100 Z" fill="#CFE8D6"/>
    <path d="M150 236 L14 100 A190 190 0 0 1 286 100 Z" fill="none" stroke="#7FB894" stroke-width="2"/>
    <path d="M150 236 L204 176 L150 124 L96 176 Z" fill="#E6D3BC"/>
    <path d="M150 236 L204 176 L150 124 L96 176 Z" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
    ${[[204,176],[150,124],[96,176]].map(([x,y])=>`<rect x="${x-4}" y="${y-4}" width="8" height="8" transform="rotate(45 ${x} ${y})" fill="#FFFFFF" stroke="#8A99B0" stroke-width=".8"/>`).join('')}
    <path d="M145 233 h10 v4 l-5 4 l-5 -4 z" fill="#FFFFFF" stroke="#8A99B0" stroke-width=".8"/>`;
  const HX=150, HY=230; let paths='', dots='', labels='', k=0;
  for(const [pos,L] of Object.entries(by)){ const [cx,cy]=XY[pos], n=L.length;
    L.sort((a,b)=>'hoe'.indexOf(a.kind)-'hoe'.indexOf(b.kind)).forEach((b,i)=>{ // точки по спирали вокруг зоны
      const a=i*2.4, r=i?5+3.2*Math.sqrt(i):0;
      let x=cx+r*Math.cos(a), y=cy+r*Math.sin(a);
      if(b.r==='HR'){ const dx=x-HX, dy=y-HY, d=Math.hypot(dx,dy)||1; x=HX+dx/d*Math.max(d,200); y=HY+dy/d*Math.max(d,200); } // хоум-ран — за забор
      const dx=x-HX, dy=y-HY, d=Math.hypot(dx,dy)||1;
      // дуга: контрольная точка сдвинута перпендикулярно (вид сверху, как на трансляциях)
      const bend=b.tr==='f'?0.32:b.tr==='l'?0.12:0, side=dx>=0?-1:1;
      const mx=HX+dx/2+(-dy/d)*d*bend*side, my=HY+dy/2+(dx/d)*d*bend*side;
      const dpath=b.tr==='g'?`M${HX} ${HY} L${x.toFixed(1)} ${y.toFixed(1)}`:`M${HX} ${HY} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
      const del=(k*0.12).toFixed(2); k++;
      paths+=`<path class="sp-tr sp-${b.tr}" d="${dpath}" pathLength="1" stroke="${COL[b.kind]}" style="animation-delay:${del}s"><title>${pos} · ${R_[b.r]||b.r}</title></path>`;
      if(b.tr==='g') paths+=`<path class="sp-hop" d="${dpath}" pathLength="1" stroke="${COL[b.kind]}" style="animation-delay:${del}s"/>`;
      dots+=`<circle class="sp-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${COL[b.kind]}" stroke="#FFFFFF" stroke-width="1.2" style="animation-delay:${(+del+0.55).toFixed(2)}s"><title>${pos} · ${R_[b.r]||b.r}</title></circle>`; });
    labels+=`<text x="${cx}" y="${cy-12-Math.min(14,3.2*Math.sqrt(n))}" text-anchor="middle" font-size="10" font-weight="800" fill="#2C3F5C">${pos} · ${n}</text>`;
  }
  svg+=`<g fill="none">${paths}</g>${dots}${labels}`;
  svg+='</svg>';
  const side={L:0,C:0,R:0}; balls.forEach(b=>side[SIDE[b.pos]]++); const tot=balls.length, pct=k=>Math.round(side[k]/tot*100);
  const cnt=k=>balls.filter(b=>b.kind===k).length;
  h+=`<div class="sp-wrap">${svg}<div class="sp-side">
      <div class="sp-bars">${[['L','spLeft'],['C','spCenter'],['R','spRight']].map(([k,l])=>`<div class="sp-bar"><span>${T(l)}</span><i><b style="width:${pct(k)}%"></b></i><em>${pct(k)}%</em></div>`).join('')}</div>
      <div class="sp-leg"><span><i style="background:var(--r-good)"></i>${T('spHit')} · ${cnt('h')}</span><span><i style="background:var(--r-low)"></i>${T('spOut')} · ${cnt('o')}</span>${cnt('e')?`<span><i style="background:var(--amber)"></i>${T('spErr')} · ${cnt('e')}</span>`:''}</div>
      <div class="sp-leg sp-leg2"><span><svg width="26" height="10" aria-hidden="true"><path d="M1 8 L25 2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 6.5 L19 3.5" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 6" fill="none" opacity=".6"/></svg>${T('spGround')}</span><span><svg width="26" height="12" aria-hidden="true"><path d="M1 10 Q10 -2 25 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>${T('spFly')}</span><button type="button" class="cl-link sp-replay" onclick="spReplay(this)">↻ ${T('spReplay')}</button></div>
      <div class="muted sp-note">${T('spBalls')(tot)}${hitsNoDir?` · ${T('spNoDir')}`:''}</div></div></div></div>`;
  return h;
}

/* ---------- подключение ---------- */
const _pe=window.playerExtras;
window.playerExtras=function(p){ const r=_pe?_pe(p):{top:'',bottom:''}; return {top:r.top,bottom:spray(p)+r.bottom}; };
const _route=route; route=function(){
  _route();
  setTimeout(spObserve,0);
  const h=(location.hash||'').slice(1), page=h.split('-')[0], FR=window.FEATURE_ROUTES||{};
  const isHome=!['player','game','games'].includes(page)&&!FR[page];
  if(!isHome||!S.league) return;
  const f=feedBlock(); if(!f) return;
  // 16.11.2026: лента событий — после таблицы рейтинга (раньше была сразу после лидеров)
  const lb=document.querySelector('#app #lb'), anchor=(lb&&lb.closest('.tablewrap'))||document.querySelector('#app .podium');
  const box=document.createElement('div'); box.className='feed-sec'; box.innerHTML=f;
  if(anchor) anchor.after(box); else app().appendChild(box);
};
})();

