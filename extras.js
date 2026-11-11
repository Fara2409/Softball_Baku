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
  spTitle:'Карта ударов',spHint:'куда игрок отправляет мяч',spHit:'хит',spOut:'аут',spErr:'ошибка защиты',
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
  spTitle:'Zərbə xəritəsi',spHint:'oyunçu topu hara göndərir',spHit:'hit',spOut:'aut',spErr:'müdafiə səhvi',
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
  spTitle:'Spray chart',spHint:'where the player sends the ball',spHit:'hit',spOut:'out',spErr:'error',
  spLeft:'left',spCenter:'center',spRight:'right',spBalls:n=>`balls in play: ${n}`,
  spNoDir:'Hit directions are recorded from new games on — for now the chart shows mostly outs.',spFew:'No balls with a known direction yet — the chart fills in with new games.'
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
function feedBlock(){
  const games=S.games.filter(g=>g.stats); if(!games.length) return '';
  // новые игры сверху, внутри игры — по важности
  const all=feedEvents(), byGame=[];
  for(const g of [...games].reverse()) byGame.push(...all.filter(e=>e.g===g).sort((p,q)=>p.w-q.w));
  const L=byGame.slice(0,8);
  return `<div class="section-title"><h2>${(window.SBI||(()=>''))('bat',26,2.2)}${T('fdTitle')}</h2><span class="hint">${T('fdHint')}</span></div>
    <div class="card feed">${L.map(e=>{ const p=e.pid&&P(e.pid);
      return `<a class="fd-row" href="${e.href}"><span class="fd-ic fd-${e.ic}">${(window.SBI||(()=>""))(FD_IC[e.ic]||"ball",20)}</span>${p?av(p):''}<span class="fd-t">${e.txt}</span><span class="fd-d">${fmtDate(e.g.date,{day:'numeric',month:'short'})}</span></a>`; }).join('')}</div>`;
}

/* ---------- карта ударов ---------- */
const XY={P:[150,168],C:[150,226],'1B':[204,160],'2B':[180,124],SS:[120,124],'3B':[96,160],LF:[62,82],LCF:[104,54],CF:[150,42],RCF:[196,54],RF:[238,82]};
const SIDE={'3B':'L',SS:'L',LF:'L',LCF:'C',CF:'C',RCF:'C',P:'C',C:'C','2B':'R','1B':'R',RF:'R'};
function posOf(g,id){ const b=g.box.find(x=>x.player===id); return b?b.pos:null; }
function ballsOf(p){
  const out=[]; let hitsNoDir=0;
  for(const {game:g} of p.log){ if(!g.plays) continue;
    for(const x of g.plays){ if(x.b!==p.id) continue;
      let pos=null, kind=null;
      if(HITS.includes(x.r)){ kind='h'; pos=x.d||(x.f&&x.f[0]?posOf(g,x.f[0]):null); if(!pos){ hitsNoDir++; continue; } }
      else if(['GO','FO','FC','SAC'].includes(x.r)&&x.f&&x.f[0]){ kind='o'; pos=posOf(g,x.f[0]); }
      else if(x.r==='ROE'&&x.e&&x.e[0]){ kind='e'; pos=posOf(g,x.e[0]); }
      if(pos&&XY[pos]) out.push({pos,kind,r:x.r});
    } }
  return {balls:out,hitsNoDir};
}
function spray(p){
  if(!p.log||!p.log.some(l=>l.game.plays)) return '';
  const {balls,hitsNoDir}=ballsOf(p);
  let h=`<div class="section-title"><h2>${(window.SBI||(()=>''))('ball',26,2.2)}${T('spTitle')}</h2><span class="hint">${T('spHint')}</span></div><div class="card spray">`;
  if(balls.length<1) return h+`<p class="muted sp-note">${T('spFew')}</p></div>`;
  const by={}; balls.forEach(b=>(by[b.pos]=by[b.pos]||[]).push(b));
  const COL={h:'var(--r-good)',o:'var(--r-low)',e:'var(--amber)'};
  let svg=`<svg viewBox="0 0 300 250" class="sp-svg" role="img" aria-label="${T('spTitle')}">
    <path d="M150 236 L14 100 A190 190 0 0 1 286 100 Z" fill="#12301f" opacity=".55"/>
    <path d="M150 236 L14 100 A190 190 0 0 1 286 100 Z" fill="none" stroke="#2f5a3f" stroke-width="2"/>
    <path d="M150 236 L204 176 L150 124 L96 176 Z" fill="#4a3424" opacity=".7"/>
    <path d="M150 236 L204 176 L150 124 L96 176 Z" fill="none" stroke="#eef2f8" stroke-opacity=".5" stroke-width="1.5"/>
    ${[[204,176],[150,124],[96,176]].map(([x,y])=>`<rect x="${x-4}" y="${y-4}" width="8" height="8" transform="rotate(45 ${x} ${y})" fill="#eef2f8"/>`).join('')}
    <path d="M145 233 h10 v4 l-5 4 l-5 -4 z" fill="#eef2f8"/>`;
  for(const [pos,L] of Object.entries(by)){ const [cx,cy]=XY[pos], n=L.length;
    L.sort((a,b)=>'hoe'.indexOf(a.kind)-'hoe'.indexOf(b.kind)).forEach((b,i)=>{ // точки по спирали вокруг зоны
      const a=i*2.4, r=i?5+3.2*Math.sqrt(i):0;
      svg+=`<circle cx="${(cx+r*Math.cos(a)).toFixed(1)}" cy="${(cy+r*Math.sin(a)).toFixed(1)}" r="5" fill="${COL[b.kind]}" stroke="#0b1626" stroke-width="1.2"/>`; });
    svg+=`<text x="${cx}" y="${cy-12-Math.min(14,3.2*Math.sqrt(n))}" text-anchor="middle" font-size="10" font-weight="800" fill="#c9d3e1">${pos} · ${n}</text>`;
  }
  svg+='</svg>';
  const side={L:0,C:0,R:0}; balls.forEach(b=>side[SIDE[b.pos]]++); const tot=balls.length, pct=k=>Math.round(side[k]/tot*100);
  const cnt=k=>balls.filter(b=>b.kind===k).length;
  h+=`<div class="sp-wrap">${svg}<div class="sp-side">
      <div class="sp-bars">${[['L','spLeft'],['C','spCenter'],['R','spRight']].map(([k,l])=>`<div class="sp-bar"><span>${T(l)}</span><i><b style="width:${pct(k)}%"></b></i><em>${pct(k)}%</em></div>`).join('')}</div>
      <div class="sp-leg"><span><i style="background:var(--r-good)"></i>${T('spHit')} · ${cnt('h')}</span><span><i style="background:var(--r-low)"></i>${T('spOut')} · ${cnt('o')}</span>${cnt('e')?`<span><i style="background:var(--amber)"></i>${T('spErr')} · ${cnt('e')}</span>`:''}</div>
      <div class="muted sp-note">${T('spBalls')(tot)}${hitsNoDir?` · ${T('spNoDir')}`:''}</div></div></div></div>`;
  return h;
}

/* ---------- подключение ---------- */
const _pe=window.playerExtras;
window.playerExtras=function(p){ const r=_pe?_pe(p):{top:'',bottom:''}; return {top:r.top,bottom:spray(p)+r.bottom}; };
const _route=route; route=function(){
  _route();
  const h=(location.hash||'').slice(1), page=h.split('-')[0], FR=window.FEATURE_ROUTES||{};
  const isHome=!['player','game','games'].includes(page)&&!FR[page];
  if(!isHome||!S.league) return;
  const f=feedBlock(); if(!f) return;
  const pod=document.querySelector('#app .podium');
  const box=document.createElement('div'); box.className='feed-sec'; box.innerHTML=f;
  if(pod) pod.after(box); else app().appendChild(box);
};
})();
