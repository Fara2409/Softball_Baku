// Amirajan Softball — статистика. Данные: data/index.json, data/players.json, data/games/*.json
const POS_NAMES={P:'Питчер',C:'Кэтчер','1B':'1-я база','2B':'2-я база','3B':'3-я база',SS:'Шортстоп',LF:'Левый аутфилд',CF:'Центр. аутфилд',RF:'Правый аутфилд',SF:'Шорт-филдер'};
const S={players:{},games:[],season:'',demo:false};

/* ---------- Performance score (0–10) ---------- */
// Каждый стартует с 6.0. Бита (вклад за выход), защита, бонус за победу.
const W={'1B':.45,'2B':.75,'3B':1.0,HR:1.4,BB:.3,R:.2,RBI:.2,SB:.15,OUT:-.25,K:-.35,PO:.12,A:.10,E:-.5,WIN:.25};
function rating(b,won){
  const outs=Math.max(0,b.AB-b.H-b.K);
  const off=W['1B']*b['1B']+W['2B']*b['2B']+W['3B']*b['3B']+W.HR*b.HR+W.BB*b.BB+W.R*b.R+W.RBI*b.RBI+W.SB*(b.SB||0)+W.OUT*outs+W.K*b.K;
  const def=W.PO*(b.PO||0)+W.A*(b.A||0)+W.E*(b.E||0);
  return Math.round(Math.min(10,Math.max(3,6+0.9*off+def+(won?W.WIN:0)))*10)/10;
}
function rclass(r){return r==null?'na':r>=9?'elite':r>=8?'great':r>=7?'good':r>=6?'mid':'low'}
const RCOL={low:'var(--r-low)',mid:'var(--r-mid)',good:'var(--r-good)',great:'var(--r-great)',elite:'var(--r-elite)',na:'var(--panel2)'};
function rt(r,size=''){const c=rclass(r);return `<span class="rt ${size} ${c==='na'?'na':''}" style="${c!=='na'?`background:${RCOL[c]}`:''}">${r==null?'–':r.toFixed(1)}</span>`}
const avg3=x=>isFinite(x)?x.toFixed(3).replace(/^0/,''):'–';
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
const initials=p=>(p.first[0]+(p.last?p.last[0]:'')).toUpperCase();
const av=(p,size='s')=>`<span class="av ${size}">${p.photo?`<img src="${p.photo}" alt="">`:initials(p)}</span>`;
const pname=p=>`${p.first} ${p.last||''}`.trim();

/* ---------- Загрузка и расчёт ---------- */
async function load(){
  const [idx,pl]=await Promise.all([fetch('data/index.json').then(r=>r.json()),fetch('data/players.json').then(r=>r.json())]);
  S.season=idx.season; S.demo=idx.demo||pl.demo;
  pl.players.forEach(p=>S.players[p.id]={...p,log:[]});
  S.games=await Promise.all(idx.games.map(id=>fetch(`data/games/${id}.json`).then(r=>r.json())));
  S.games.sort((a,b)=>a.date.localeCompare(b.date));
  for(const g of S.games){
    g.winner=g.score.A>g.score.B?'A':g.score.B>g.score.A?'B':null;
    for(const b of g.box){
      b.rating=rating(b,g.winner===b.team);
      const p=S.players[b.player]; if(p) p.log.push({game:g,b});
    }
    g.mvp=[...g.box].sort((x,y)=>y.rating-x.rating)[0];
  }
  const qual=Math.max(1,Math.ceil(S.games.length*0.4));
  for(const p of Object.values(S.players)){
    const t={G:0,PA:0,AB:0,H:0,'1B':0,'2B':0,'3B':0,HR:0,BB:0,K:0,R:0,RBI:0,SB:0,PO:0,A:0,E:0,W:0,L:0};
    const pos={};
    for(const {game,b} of p.log){
      t.G++; for(const k in t) if(k in b) t[k]+=b[k];
      if(game.winner===b.team) t.W++; else if(game.winner) t.L++;
      pos[b.pos]=(pos[b.pos]||0)+1;
    }
    const TB=t['1B']+2*t['2B']+3*t['3B']+4*t.HR;
    t.AVG=t.H/t.AB; t.OBP=(t.H+t.BB)/t.PA; t.SLG=TB/t.AB; t.OPS=t.OBP+t.SLG;
    t.RAT=t.G?Math.round(p.log.reduce((s,x)=>s+x.b.rating,0)/t.G*100)/100:null;
    t.qual=t.G>=qual;
    p.t=t; p.pos=Object.entries(pos).sort((a,b)=>b[1]-a[1]);
  }
  S.qual=qual;
}

/* ---------- Страницы ---------- */
const app=()=>document.getElementById('app');
function linescore(g){
  const n=Math.max(g.linescore.A.length,g.linescore.B.length);
  let h=`<table class="ls"><tr><th style="text-align:left"></th>${Array.from({length:n},(_,i)=>`<th>${i+1}</th>`).join('')}<th>R</th></tr>`;
  for(const k of ['A','B']){
    h+=`<tr class="${g.winner===k?'win':''}"><td class="tn"><i style="background:${g.teams[k].color}"></i>${g.teams[k].name}</td>${g.linescore[k].map(x=>`<td class="${x?'':'z'}">${x}</td>`).join('')}<td class="R">${g.score[k]}</td></tr>`;
  }
  return h+'</table>';
}
function statLine(b){
  const parts=[`${b.H}/${b.AB}`];
  if(b.HR) parts.push(`${b.HR} HR`); if(b['2B']) parts.push(`${b['2B']} 2B`); if(b['3B']) parts.push(`${b['3B']} 3B`);
  if(b.RBI) parts.push(`${b.RBI} RBI`); if(b.R) parts.push(`${b.R} R`); if(b.BB) parts.push(`${b.BB} BB`);
  return parts.join(' · ');
}
let sortKey='RAT', sortDir=-1;
function home(){
  const last=S.games[S.games.length-1];
  const ps=Object.values(S.players).filter(p=>p.t.G);
  const top=ps.filter(p=>p.t.qual).sort((a,b)=>b.t.RAT-a.t.RAT).slice(0,3);
  const mvp=last&&S.players[last.mvp.player];
  let h='';
  if(last) h+=`<div class="hero">
    <div class="card lastgame" style="cursor:pointer" onclick="location.hash='#game-${last.id}'"><div class="meta"><span class="eyebrow">Последняя игра</span><span>${fmtDate(last.date)} · ${last.venue}</span></div>
      ${linescore(last)}
      <div class="btns">${last.video?`<a class="btn yt" href="${last.video}" target="_blank" rel="noopener" onclick="event.stopPropagation()">▶ Смотреть на YouTube</a>`:''}<span class="btn">Протокол игры →</span></div></div>
    <a class="card mvp" href="#player-${mvp.id}"><span class="eyebrow">Игрок матча</span>
      <div class="who">${av(mvp,'m')}<div><div class="name">${pname(mvp)}</div><div class="line">#${mvp.number} · ${last.mvp.pos} · ${statLine(last.mvp)}</div></div></div>
      <div>${rt(last.mvp.rating,'lg')}</div></a></div>`;
  h+=`<div class="section-title"><h2>Лидеры сезона ${S.season}</h2><span class="hint">средний рейтинг за игру</span></div><div class="podium">`;
  top.forEach((p,i)=>h+=`<a class="card pod" href="#player-${p.id}"><span class="place">${i+1}</span>${av(p,'m')}<div><div class="nm">${pname(p)}</div><div class="sub">#${p.number} · ${p.pos[0]?.[0]||''} · ${p.t.G} игр</div></div>${rt(p.t.RAT,'lg')}</a>`);
  h+=`</div><div class="section-title"><h2>Рейтинг игроков</h2><span class="hint">в рейтинге — от ${S.qual} игр · нажмите на столбец для сортировки</span></div>
    <div class="card tablewrap"><table class="lb" id="lb"></table></div>`;
  app().innerHTML=h; drawLB(ps);
}
const COLS=[['RAT','Рейтинг'],['G','И'],['W','В-П'],['AVG','AVG'],['OBP','OBP'],['OPS','OPS'],['HR','HR'],['RBI','RBI'],['R','R'],['SB','SB'],['E','E']];
function drawLB(ps){
  const val=(p,k)=>{const v=p.t[k];return v==null||!isFinite(v)?-1:v};
  ps.sort((a,b)=>(b.t.qual-a.t.qual)||sortDir*(val(a,sortKey)-val(b,sortKey))||(b.t.G-a.t.G));
  let h=`<thead><tr><th class="l">#</th><th class="l">Игрок</th><th class="l">Позиция</th>${COLS.map(([k,n])=>`<th data-k="${k}" class="${k===sortKey?'sorted':''}">${n}${k===sortKey?(sortDir<0?' ↓':' ↑'):''}</th>`).join('')}</tr></thead><tbody>`;
  let rank=0;
  for(const p of ps){
    const t=p.t; if(t.qual) rank++;
    h+=`<tr onclick="location.hash='#player-${p.id}'" style="${t.qual?'':'opacity:.55'}"><td class="l rank">${t.qual?rank:'–'}</td>
      <td class="l"><div class="pl">${av(p)}<div><div class="nm">${pname(p)}</div><div class="no">#${p.number}</div></div></div></td>
      <td class="l">${p.pos.slice(0,2).map((x,i)=>`<span class="chip ${i?'':'main'}">${x[0]}</span>`).join(' ')}</td>
      <td>${rt(t.RAT)}</td><td>${t.G}</td><td>${t.W}-${t.L}</td><td>${avg3(t.AVG)}</td><td>${avg3(t.OBP)}</td><td>${avg3(t.OPS)}</td><td>${t.HR}</td><td>${t.RBI}</td><td>${t.R}</td><td>${t.SB}</td><td>${t.E}</td></tr>`;
  }
  const el=document.getElementById('lb'); el.innerHTML=h+'</tbody>';
  el.querySelectorAll('th[data-k]').forEach(th=>th.onclick=()=>{const k=th.dataset.k; if(k===sortKey) sortDir*=-1; else {sortKey=k; sortDir=-1;} drawLB(ps);});
}
function chart(p){
  const L=p.log, n=L.length; if(!n) return '';
  const W0=1000,H0=260,pad=36,bw=Math.min(64,(W0-pad*2)/n*0.62),step=(W0-pad*2)/n;
  const y=v=>H0-40-((v-3)/7)*(H0-70);
  let s=`<svg viewBox="0 0 ${W0} ${H0}" role="img" aria-label="Рейтинг по играм">`;
  for(const g of [4,6,8,10]) s+=`<line x1="${pad}" x2="${W0-pad}" y1="${y(g)}" y2="${y(g)}" stroke="#1f3150" stroke-width="1"/><text x="${pad-10}" y="${y(g)+4}" fill="#5f6f88" font-size="12" text-anchor="end">${g}</text>`;
  L.forEach(({game,b},i)=>{const x=pad+step*i+(step-bw)/2, c=RCOL[rclass(b.rating)];
    s+=`<a href="#game-${game.id}"><rect x="${x}" y="${y(b.rating)}" width="${bw}" height="${y(3)-y(b.rating)}" rx="6" fill="${c}"/>
    <text x="${x+bw/2}" y="${y(b.rating)-8}" fill="#eef2f8" font-size="15" font-weight="800" text-anchor="middle">${b.rating.toFixed(1)}</text>
    <text x="${x+bw/2}" y="${H0-16}" fill="#8fa0b8" font-size="12" text-anchor="middle">${new Date(game.date+'T12:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}</text></a>`;});
  if(p.t.RAT!=null) s+=`<line x1="${pad}" x2="${W0-pad}" y1="${y(p.t.RAT)}" y2="${y(p.t.RAT)}" stroke="#EF9F27" stroke-dasharray="6 6" stroke-width="2"/><text x="${W0-pad}" y="${y(p.t.RAT)-6}" fill="#EF9F27" font-size="12" font-weight="700" text-anchor="end">среднее ${p.t.RAT.toFixed(2)}</text>`;
  return s+'</svg>';
}
function player(id){
  const p=S.players[id]; if(!p){app().innerHTML='<p class="muted">Игрок не найден</p>';return;}
  const t=p.t;
  let h=`<div class="card phead"><span class="bignum">${p.number}</span>${av(p,'xl')}
    <div><span class="eyebrow">#${p.number} · сезон ${S.season}</span><h1>${p.first}<span>${(p.last||'').toUpperCase()}</span></h1>
    <div class="chips">${p.pos.map((x,i)=>`<span class="chip ${i?'':'main'}" title="${POS_NAMES[x[0]]||x[0]}">${x[0]} · ${x[1]} ${x[1]===1?'игра':x[1]<5?'игры':'игр'}</span>`).join('')}</div></div>
    <div class="rbox">${rt(t.RAT==null?null:Math.round(t.RAT*10)/10,'xl')}<div class="lbl">СРЕДНИЙ РЕЙТИНГ</div></div></div>
    <div class="kpis">${[['G','Игры',t.G],['W','Победы',`${t.W}-${t.L}`],['AVG','AVG',avg3(t.AVG)],['OBP','OBP',avg3(t.OBP)],['SLG','SLG',avg3(t.SLG)],['OPS','OPS',avg3(t.OPS)],['HR','HR',t.HR],['RBI','RBI',t.RBI],['R','Раны',t.R],['PO','Ауты в защите',t.PO]]
      .map(([k,n,v])=>`<div class="card kpi"><div class="v">${v}</div><div class="k">${n}</div></div>`).join('')}</div>
    <div class="section-title"><h2>Рейтинг по играм</h2><span class="hint">пунктир — среднее за сезон</span></div><div class="card chart">${chart(p)}</div>
    <div class="section-title"><h2>Все игры</h2></div><div class="card tablewrap"><table class="lb"><thead><tr><th class="l">Дата</th><th class="l">Команда</th><th class="l">Поз.</th><th>Рейтинг</th><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>R</th><th>RBI</th><th>BB</th><th>K</th><th>PO</th><th>A</th><th>E</th><th class="l">Итог</th></tr></thead><tbody>`;
  for(const {game:g,b} of [...p.log].reverse()){
    const tm=g.teams[b.team], res=g.winner===b.team?'<b style="color:var(--r-good)">Победа</b>':g.winner?'<b style="color:var(--r-low)">Поражение</b>':'Ничья';
    h+=`<tr onclick="location.hash='#game-${g.id}'"><td class="l">${fmtDate(g.date)}</td><td class="l"><span class="chip" style="background:${tm.color}22;color:${tm.color}">${tm.name}</span></td><td class="l">${b.pos}</td><td>${rt(b.rating)}</td><td>${b.AB}</td><td>${b.H}</td><td>${b['2B']}</td><td>${b['3B']}</td><td>${b.HR}</td><td>${b.R}</td><td>${b.RBI}</td><td>${b.BB}</td><td>${b.K}</td><td>${b.PO}</td><td>${b.A}</td><td>${b.E}</td><td class="l">${res} ${g.score[b.team]}:${g.score[b.team==='A'?'B':'A']}</td></tr>`;
  }
  app().innerHTML=h+'</tbody></table></div>';
}
function games(){
  let h=`<div class="section-title" style="margin-top:0"><h2>Игры сезона ${S.season}</h2><span class="hint">${S.games.length} игр</span></div><div class="glist">`;
  for(const g of [...S.games].reverse()){
    h+=`<a class="card gcard" href="#game-${g.id}"><div class="d">${fmtDate(g.date)} · ${g.venue}</div>
      ${['A','B'].map(k=>`<div class="t ${g.winner===k?'win':''}"><span><i style="display:inline-block;width:6px;height:16px;border-radius:2px;background:${g.teams[k].color};margin-right:10px;vertical-align:-2px"></i>${g.teams[k].name}</span><b>${g.score[k]}</b></div>`).join('')}
      <div class="d" style="margin:10px 0 0">Игрок матча: <b style="color:var(--text)">${pname(S.players[g.mvp.player])}</b> ${rt(g.mvp.rating)}</div></a>`;
  }
  app().innerHTML=h+'</div>';
}
function game(id){
  const g=S.games.find(x=>x.id===id); if(!g){app().innerHTML='<p class="muted">Игра не найдена</p>';return;}
  let h=`<span class="eyebrow">${fmtDate(g.date)} · ${g.venue}</span><div class="card lastgame" style="margin-top:12px">${linescore(g)}
    <div class="btns">${g.video?`<a class="btn yt" href="${g.video}" target="_blank" rel="noopener">▶ Смотреть на YouTube</a>`:''}</div></div>`;
  for(const k of ['A','B']){
    const rows=g.box.filter(b=>b.team===k);
    h+=`<div class="section-title"><h2 style="color:${g.teams[k].color}">${g.teams[k].name}</h2><span class="hint">${g.winner===k?'победа':g.winner?'поражение':'ничья'} · ${g.score[k]} ран</span></div>
    <div class="card tablewrap"><table class="lb"><thead><tr><th class="l">Игрок</th><th class="l">Поз.</th><th>Рейтинг</th><th>AB</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>R</th><th>RBI</th><th>BB</th><th>K</th><th>SB</th><th>PO</th><th>A</th><th>E</th></tr></thead><tbody>`;
    for(const b of rows){const p=S.players[b.player];
      h+=`<tr onclick="location.hash='#player-${p.id}'"><td class="l"><div class="pl">${av(p)}<div><div class="nm">${pname(p)}${g.mvp===b?' <span class="chip main">MVP</span>':''}</div><div class="no">#${p.number}</div></div></div></td><td class="l">${b.pos}</td><td>${rt(b.rating)}</td><td>${b.AB}</td><td>${b.H}</td><td>${b['2B']}</td><td>${b['3B']}</td><td>${b.HR}</td><td>${b.R}</td><td>${b.RBI}</td><td>${b.BB}</td><td>${b.K}</td><td>${b.SB}</td><td>${b.PO}</td><td>${b.A}</td><td>${b.E}</td></tr>`;}
    h+='</tbody></table></div>';
  }
  app().innerHTML=h;
}
function route(){
  const h=(location.hash||'').slice(1); const i=h.indexOf('-');
  const page=i<0?h:h.slice(0,i), id=i<0?'':h.slice(i+1);
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===((page==='games'||page==='game')?'games':'home')));
  if(page==='player') player(id); else if(page==='game') game(id); else if(page==='games') games(); else home();
  window.scrollTo(0,0);
}
load().then(()=>{document.getElementById('demo-banner').hidden=!S.demo;route();window.addEventListener('hashchange',route);})
  .catch(e=>{app().innerHTML=`<p class="muted">Не удалось загрузить данные: ${e.message}</p>`;});
