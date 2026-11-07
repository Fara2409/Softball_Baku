// Softball Baku — дополнительные разделы сайта (работают без сервера, всё считается в браузере).
// Составы (балансировщик), рекорды/достижения/награды, партнёры и соперники,
// моменты из видео, картинка карточки для WhatsApp, демо-режим (?demo=1).
'use strict';

/* ---------- Переводы ---------- */
Object.assign(I18N.ru,{
  rtg:'Рейтинг',navTeams:'Составы',navRecords:'Рекорды',navRules:'Правила',
  demoBanner:'ДЕМО: статистика вымышленная, игроки настоящие · <a href="./">выйти из демо</a>',
  tmTitle:'Разделить на команды',tmSub:'Отметьте, кто пришёл, — сайт разделит всех на две равные команды по рейтингу и позициям.',
  tmAll:'Выбрать всех',tmNone:'Очистить',tmPresent:n=>`Пришли: ${n}`,tmGo:'Разделить',tmAgain:'Другой вариант',tmCopy:'Скопировать для WhatsApp',tmCopied:'Скопировано',
  tmNeed:'Отметьте хотя бы 4 игроков',tmPC:'Питчер и кэтчер в каждой команде',tmLevels:'Уровень игроков',tmLevelsHint:'Для игроков без статистики сила — ваша оценка (по умолчанию 6.5). После игр берётся настоящий рейтинг.',
  tmBalance:'Баланс',tmSubC:'сменный кэтчер — ловит любой свободный игрок',tmSubCs:'сменный',tmAvg:'средняя сила',tmEH:'EH',tmEst:'оценка',
  rcTitle:'Рекорды и награды',rcAwards:'Награды сезона',rcLeader:'текущий лидер',rcGame:'Рекорды одной игры',rcSeason:'Рекорды сезона',rcBadges:'Достижения',rcEmpty:'Рекорды и награды появятся после первых игр сезона.',
  rcEarned:n=>`получили: ${n}`,rcNobody:'пока никто',
  bgTitle:'Достижения',bgOf:(a,b)=>`${a} из ${b}`,
  chTitle:'С кем ты побеждаешь',chBest:'Лучшие партнёры',chHard:'Неудобные соперники',chHint:'от 2 игр вместе / против',chNone:'Нужно больше игр, чтобы посчитать.',chWith:'вместе',chVs:'против',
  hlTitle:'Моменты на видео',hlGame:'Моменты игры',
  shBtn:'Поделиться карточкой',shTitle:'Карточка для WhatsApp',shShare:'Отправить',shDownload:'Скачать картинку',shClose:'Закрыть',shSeason:d=>`Сезон ${d.season} стартует ${d.start}`,
  hlTypes:{HR:'Хоум-ран','3B':'Трипл','2B':'Дабл','1B':'Сингл',K:'Страйк-аут',catch:'Поймал флай',DP:'Дабл-плей',SB:'Кража базы',play:'Момент'},
  awMVP:'MVP сезона',awMVPd:'лучший средний рейтинг',awBat:'Лучший отбивающий',awBatd:'самый высокий OPS',awHR:'Король хоум-ранов',awHRd:'больше всего HR',awRBI:'Король RBI',awRBId:'больше всего RBI',
  awGlove:'Золотая перчатка',awGloved:'лучшая игра в защите',awIron:'Железный человек',awIrond:'больше всего игр',awWin:'Победитель',awWind:'лучший процент побед',awSpeed:'Самые быстрые ноги',awSpeedd:'больше всего краж баз',awProg:'Прогресс сезона',awProgd:'рост рейтинга',
  recH:'Больше всего хитов',recHR:'Больше всего HR',recRBI:'Больше всего RBI',recR:'Больше всего ранов',recRat:'Лучший рейтинг',recSB:'Больше всего краж',recPO:'Больше всего аутов в защите',recStreak:'Самая длинная серия игр с хитом',recMulti:'Больше всего игр с 2+ хитами',
  games_:n=>`${n} ${plural('ru',n)}`
});
Object.assign(I18N.az,{
  rtg:'Reytinq',navTeams:'Komandalar',navRecords:'Rekordlar',navRules:'Qaydalar',
  demoBanner:'DEMO: statistika uydurmadır, oyunçular realdır · <a href="./">demodan çıx</a>',
  tmTitle:'Komandalara böl',tmSub:'Gələnləri qeyd edin — sayt hamını reytinq və mövqelərə görə iki bərabər komandaya bölər.',
  tmAll:'Hamısını seç',tmNone:'Təmizlə',tmPresent:n=>`Gələnlər: ${n}`,tmGo:'Böl',tmAgain:'Başqa variant',tmCopy:'WhatsApp üçün kopyala',tmCopied:'Kopyalandı',
  tmNeed:'Ən azı 4 oyunçu seçin',tmPC:'Hər komandada pitçer və ketçer',tmLevels:'Oyunçuların səviyyəsi',tmLevelsHint:'Statistikası olmayan oyunçular üçün güc — sizin qiymətiniz (standart 6.5). Oyunlardan sonra real reytinq götürülür.',
  tmBalance:'Balans',tmSubC:'növbəli ketçer — boş olan istənilən oyunçu tutur',tmSubCs:'növbəli',tmAvg:'orta güc',tmEH:'EH',tmEst:'qiymət',
  rcTitle:'Rekordlar və mükafatlar',rcAwards:'Mövsümün mükafatları',rcLeader:'hazırkı lider',rcGame:'Bir oyunun rekordları',rcSeason:'Mövsüm rekordları',rcBadges:'Nailiyyətlər',rcEmpty:'Rekordlar və mükafatlar mövsümün ilk oyunlarından sonra görünəcək.',
  rcEarned:n=>`qazananlar: ${n}`,rcNobody:'hələ heç kim',
  bgTitle:'Nailiyyətlər',bgOf:(a,b)=>`${b}-dən ${a}`,
  chTitle:'Kiminlə qalib gəlirsən',chBest:'Ən yaxşı tərəfdaşlar',chHard:'Çətin rəqiblər',chHint:'birlikdə / qarşı ən azı 2 oyun',chNone:'Hesablamaq üçün daha çox oyun lazımdır.',chWith:'birlikdə',chVs:'qarşı',
  hlTitle:'Videoda anlar',hlGame:'Oyunun anları',
  shBtn:'Kartı paylaş',shTitle:'WhatsApp üçün kart',shShare:'Göndər',shDownload:'Şəkli yüklə',shClose:'Bağla',shSeason:d=>`${d.season} mövsümü ${d.start} başlayır`,
  hlTypes:{HR:'Homeran','3B':'Tripl','2B':'Dabl','1B':'Sinql',K:'Strayk-aut',catch:'Flayı tutdu',DP:'Dabl-pley',SB:'Baza oğurluğu',play:'An'},
  awMVP:'Mövsümün MVP-si',awMVPd:'ən yüksək orta reytinq',awBat:'Ən yaxşı vuran',awBatd:'ən yüksək OPS',awHR:'Homeran kralı',awHRd:'ən çox HR',awRBI:'RBI kralı',awRBId:'ən çox RBI',
  awGlove:'Qızıl əlcək',awGloved:'ən yaxşı müdafiə',awIron:'Dəmir adam',awIrond:'ən çox oyun',awWin:'Qalib',awWind:'ən yüksək qələbə faizi',awSpeed:'Ən sürətli ayaqlar',awSpeedd:'ən çox baza oğurluğu',awProg:'Mövsümün irəliləyişi',awProgd:'reytinqin artımı',
  recH:'Ən çox hit',recHR:'Ən çox HR',recRBI:'Ən çox RBI',recR:'Ən çox ran',recRat:'Ən yüksək reytinq',recSB:'Ən çox oğurluq',recPO:'Müdafiədə ən çox aut',recStreak:'Hitli oyunların ən uzun seriyası',recMulti:'2+ hitli ən çox oyun',
  games_:n=>`${n} oyun`
});
Object.assign(I18N.en,{
  rtg:'Rating',navTeams:'Teams',navRecords:'Records',navRules:'Rules',
  demoBanner:'DEMO: made-up stats, real players · <a href="./">exit demo</a>',
  tmTitle:'Split into teams',tmSub:'Tick who showed up — the site splits everyone into two even teams by rating and positions.',
  tmAll:'Select all',tmNone:'Clear',tmPresent:n=>`Present: ${n}`,tmGo:'Split',tmAgain:'Another option',tmCopy:'Copy for WhatsApp',tmCopied:'Copied',
  tmNeed:'Select at least 4 players',tmPC:'Pitcher and catcher on each team',tmLevels:'Player levels',tmLevelsHint:'For players without stats, strength is your estimate (default 6.5). After games the real rating is used.',
  tmBalance:'Balance',tmSubC:'rotating catcher — any free player catches',tmSubCs:'rotating',tmAvg:'avg strength',tmEH:'EH',tmEst:'estimate',
  rcTitle:'Records and awards',rcAwards:'Season awards',rcLeader:'current leader',rcGame:'Single-game records',rcSeason:'Season records',rcBadges:'Achievements',rcEmpty:'Records and awards will appear after the first games of the season.',
  rcEarned:n=>`earned by ${n}`,rcNobody:'nobody yet',
  bgTitle:'Achievements',bgOf:(a,b)=>`${a} of ${b}`,
  chTitle:'Who you win with',chBest:'Best teammates',chHard:'Toughest opponents',chHint:'2+ games together / against',chNone:'Not enough games yet.',chWith:'together',chVs:'against',
  hlTitle:'Video moments',hlGame:'Game moments',
  shBtn:'Share card',shTitle:'Card for WhatsApp',shShare:'Share',shDownload:'Download image',shClose:'Close',shSeason:d=>`Season ${d.season} starts ${d.start}`,
  hlTypes:{HR:'Home run','3B':'Triple','2B':'Double','1B':'Single',K:'Strikeout',catch:'Fly catch',DP:'Double play',SB:'Stolen base',play:'Moment'},
  awMVP:'Season MVP',awMVPd:'best average rating',awBat:'Best hitter',awBatd:'highest OPS',awHR:'Home run king',awHRd:'most HR',awRBI:'RBI king',awRBId:'most RBI',
  awGlove:'Gold glove',awGloved:'best defense',awIron:'Iron man',awIrond:'most games',awWin:'Winner',awWind:'best win percentage',awSpeed:'Fastest legs',awSpeedd:'most stolen bases',awProg:'Most improved',awProgd:'rating growth',
  recH:'Most hits',recHR:'Most HR',recRBI:'Most RBI',recR:'Most runs',recRat:'Best rating',recSB:'Most steals',recPO:'Most putouts',recStreak:'Longest hitting streak',recMulti:'Most multi-hit games',
  games_:n=>`${n} ${plural('en',n)}`
});
const FIELD_POS=['P','C','1B','2B','3B','SS','LF','LCF','CF','RCF','RF'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=(w,n)=>n?Math.round(w/n*100):0;
function lsGet(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function toast(msg){const d=document.createElement('div');d.className='toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.classList.add('out'),1600);setTimeout(()=>d.remove(),2100);}
function shuffle(a,rng){ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const playersArr=()=>Object.values(S.players).sort((a,b)=>a.number-b.number);
const statGames=()=>S.games.filter(g=>g.stats);
const mainPos=p=>(p.pos&&p.pos[0]&&p.pos[0][0])||(p.positions||[])[0]||'';
const canPlay=(p,pos)=>(p.pos||[]).some(x=>x[0]===pos)||(p.positions||[]).includes(pos);

/* =====================================================================
   1. БАЛАНСИРОВЩИК КОМАНД
   ===================================================================== */
// strength: настоящий средний рейтинг, если есть игры, иначе оценка организатора (localStorage) или 6.5
const LV_KEY='sb.levels', PRESENT_KEY='sb.present';
function strengthOf(p){ if(p.t&&p.t.G) return {v:p.t.RAT,est:false}; const lv=lsGet(LV_KEY,{}); return {v:lv[p.id]??p.level??6.5,est:true}; }
function splitTeams(list,rng,needPC){
  // list: [{p,s}] → лучший раздел из случайных стартов + обмены
  const n=list.length, nA=Math.ceil(n/2);
  const isP=x=>canPlay(x.p,'P'), isC=x=>canPlay(x.p,'C');
  const cost=(A,B)=>{
    const sa=A.reduce((t,x)=>t+x.s,0)/A.length, sb=B.reduce((t,x)=>t+x.s,0)/B.length;
    let c=Math.abs(sa-sb)*10;
    if(needPC){ const pa=A.filter(isP).length,pb=B.filter(isP).length,ca=A.filter(isC).length,cb=B.filter(isC).length;
      if(pa+pb>=2&&(!pa||!pb)) c+=5; if(ca+cb>=2&&(!ca||!cb)) c+=5; c+=Math.abs(pa-pb)*.3+Math.abs(ca-cb)*.3; }
    // основные позиции: игроки с одной основной позицией делятся поровну между командами
    const cnt={}; for(const x of A){const m=mainPos(x.p); if(m) (cnt[m]=cnt[m]||[0,0])[0]++;} for(const x of B){const m=mainPos(x.p); if(m) (cnt[m]=cnt[m]||[0,0])[1]++;}
    for(const k in cnt){ const [a,b]=cnt[k]; c+=Math.max(0,Math.abs(a-b)-((a+b)%2))*POS_W; }
    return c;
  };
  const sols=[];
  for(let r=0;r<160;r++){
    const sh=shuffle(list,rng); let A=sh.slice(0,nA), B=sh.slice(nA), c=cost(A,B);
    for(let it=0;it<60;it++){ let improved=false;
      for(let i=0;i<A.length&&!improved;i++) for(let j=0;j<B.length;j++){
        const A2=[...A],B2=[...B]; [A2[i],B2[j]]=[B2[j],A2[i]]; const c2=cost(A2,B2);
        if(c2<c-1e-9){A=A2;B=B2;c=c2;improved=true;break;} }
      if(!improved) break; }
    const key=A.map(x=>x.p.id).sort().join(',');
    if(!sols.some(s=>s.key===key||s.keyB===key)) sols.push({A,B,c,key,keyB:B.map(x=>x.p.id).sort().join(',')});
  }
  sols.sort((a,b)=>a.c-b.c);
  const best=sols[0].c, good=sols.filter(s=>s.c<=best+0.3).slice(0,12);
  return good;
}
const POS_W=0.6; // штраф за неравный раздел игроков одной основной позиции
const POS_GROUP={P:'B',C:'B','1B':'I','2B':'I','3B':'I',SS:'I',LF:'O',LCF:'O',CF:'O',RCF:'O',RF:'O'};
function fitScore(p,pos){ // насколько игроку подходит позиция
  if(mainPos(p)===pos) return 10;
  if(canPlay(p,pos)) return 6;
  const m=mainPos(p); if(m&&POS_GROUP[m]&&POS_GROUP[m]===POS_GROUP[pos]&&POS_GROUP[pos]!=='B') return 2;
  return 0;
}
function assignPositions(team){
  // оптимальная расстановка (перебор по маске позиций): все позиции заняты, сумма «подходит ли позиция» максимальна;
  // основная позиция игрока важнее всего, затем позиции, где он уже играл / указан, затем та же зона (инфилд / аутфилд)
  // Настоящий кэтчер обычно один (Седияр). В команде без кэтчера C не занимаем полевым игроком:
  // ловит любой свободный игрок (subC = true), а все стоят на своих позициях.
  const hasC=team.some(x=>canPlay(x.p,'C'));
  // хватает игроков на 4 аутфилдера (LF, LCF, RCF, RF) — ставим четверых, иначе троих (LF, CF, RF)
  const OF=team.length>=(hasC?10:9)?['LF','LCF','RCF','RF']:['CF','LF','RF'];
  const POS=['P','C','SS','1B','2B','3B',...OF].filter(p=>hasC||p!=='C').slice(0,Math.min(hasC?10:9,team.length));
  const n=team.length, M=1<<POS.length, NEG=-1e9;
  let dp=new Array(M).fill(NEG); dp[0]=0; const choice=[];
  for(let i=0;i<n;i++){
    const nd=new Array(M).fill(NEG), ch=new Array(M).fill(-2);
    for(let m=0;m<M;m++){ if(dp[m]===NEG) continue;
      if(dp[m]>nd[m]){nd[m]=dp[m];ch[m]=-1;}                       // запасной (EH)
      for(let k=0;k<POS.length;k++){ if(m&(1<<k)) continue; const m2=m|(1<<k), v=dp[m]+100+fitScore(team[i].p,POS[k]);
        if(v>nd[m2]){nd[m2]=v;ch[m2]=k;} } }
    choice.push(ch); dp=nd;
  }
  let m=0; for(let x=1;x<M;x++) if(dp[x]>dp[m]) m=x;
  const pos=new Array(n);
  for(let i=n-1;i>=0;i--){ const k=choice[i][m]; if(k>=0){pos[i]=POS[k]; m&=~(1<<k);} else pos[i]='EH'; }
  const out=team.map((x,i)=>({...x,pos:pos[i]})), ord=[...POS,'EH'];
  const res=out.sort((a,b)=>ord.indexOf(a.pos)-ord.indexOf(b.pos)); res.subC=!hasC; return res;
}
let TM={sols:[],idx:0,rng:mulberry32(Date.now()%1e9)};
function teamsPage(){
  const ps=playersArr(), present=new Set(lsGet(PRESENT_KEY,[]).filter(id=>S.players[id]));
  const showLv=lsGet('sb.showLv',false), lv=lsGet(LV_KEY,{}), needPC=lsGet('sb.needPC',true);
  let h=`<div class="pagehead"><span class="eyebrow">${S.league}</span><h1>${T('tmTitle')}</h1><p class="muted">${T('tmSub')}</p></div>
  <div class="card tm-pick"><div class="tm-bar"><b id="tmCount">${T('tmPresent')(present.size)}</b>
    <div class="tm-actions"><button class="btn sm" onclick="tmAll(1)">${T('tmAll')}</button><button class="btn sm" onclick="tmAll(0)">${T('tmNone')}</button>
    <label class="tgl"><input type="checkbox" ${needPC?'checked':''} onchange="lsSet('sb.needPC',this.checked)"> ${T('tmPC')}</label>
    <label class="tgl"><input type="checkbox" ${showLv?'checked':''} onchange="lsSet('sb.showLv',this.checked);teamsPage()"> ${T('tmLevels')}</label></div></div>
    ${showLv?`<p class="muted small">${T('tmLevelsHint')}</p>`:''}
    <div class="tm-grid">`;
  for(const p of ps){ const st=strengthOf(p), on=present.has(p.id);
    h+=`<div class="tm-p ${on?'on':''}" onclick="tmToggle('${p.id}',event)">${av(p)}<div class="tm-n"><b>${esc(first(p))}</b><span>#${p.number} · ${mainPos(p)}</span></div>
      ${showLv&&st.est?`<div class="lv" onclick="event.stopPropagation()"><button onclick="tmLv('${p.id}',-0.5)">−</button><b>${(lv[p.id]??p.level??6.5).toFixed(1)}</b><button onclick="tmLv('${p.id}',0.5)">+</button></div>`
        :`<span class="tm-s ${st.est?'est':''}" title="${st.est?T('tmEst'):T('avgRating')}">${st.est?'≈':''}${st.v.toFixed(1)}</span>`}
      <span class="tm-check">✓</span></div>`; }
  h+=`</div><button class="btn pri big" onclick="tmSplit(true)">${T('tmGo')}</button></div><div id="tmOut"></div>`;
  app().innerHTML=h;
  if(TM.sols.length) tmRender();
}
function tmToggle(id){ const s=new Set(lsGet(PRESENT_KEY,[])); s.has(id)?s.delete(id):s.add(id); lsSet(PRESENT_KEY,[...s]); TM.sols=[];
  const el=[...document.querySelectorAll('.tm-p')].find(e=>e.getAttribute('onclick').includes(`'${id}'`)); if(el) el.classList.toggle('on');
  document.getElementById('tmCount').textContent=T('tmPresent')(s.size); document.getElementById('tmOut').innerHTML=''; }
function tmAll(on){ lsSet(PRESENT_KEY,on?playersArr().map(p=>p.id):[]); TM.sols=[]; teamsPage(); }
function tmLv(id,d){ const lv=lsGet(LV_KEY,{}); lv[id]=Math.max(3,Math.min(10,(lv[id]??S.players[id].level??6.5)+d)); lsSet(LV_KEY,lv); TM.sols=[]; teamsPage(); }
function tmSplit(fresh){
  const ids=lsGet(PRESENT_KEY,[]).filter(id=>S.players[id]);
  if(ids.length<4){ toast(T('tmNeed')); return; }
  if(fresh||!TM.sols.length){ TM.sols=splitTeams(ids.map(id=>({p:S.players[id],s:strengthOf(S.players[id]).v})),TM.rng,lsGet('sb.needPC',true)); TM.idx=0; }
  else TM.idx=(TM.idx+1)%TM.sols.length;
  tmRender(); document.getElementById('tmOut').scrollIntoView({behavior:'smooth',block:'start'});
}
const TEAM_DEF=[{name:'Bina Warriors',color:'#D85A30'},{name:'Gilavar Baku',color:'#1f6fc0'}];
function tmTeams(){ const s=TM.sols[TM.idx]; return [assignPositions(s.A),assignPositions(s.B)]; }
function tmRender(){
  const teams=tmTeams(), avg=t=>t.reduce((a,x)=>a+x.s,0)/t.length;
  const a=avg(teams[0]), b=avg(teams[1]), bal=Math.max(0,Math.round(100-Math.abs(a-b)/Math.max(a,b)*100*4));
  let h=`<div class="tm-res"><div class="tm-bal"><span>${T('tmBalance')}</span><div class="meter"><i style="width:${bal}%"></i></div><b>${bal}%</b>
    <span class="muted small">${TM.sols.length>1?`${TM.idx+1}/${TM.sols.length}`:''}</span></div><div class="tm-teams">`;
  teams.forEach((t,k)=>{ const d=TEAM_DEF[k];
    h+=`<div class="card tm-team"><div class="tm-head" style="border-color:${d.color}"><i style="background:${d.color}"></i><b>${d.name}</b><span>${T('tmAvg')} ${avg(t).toFixed(2)} · ${t.length}</span></div>`;
    const ci=t[0]&&t[0].pos==='P'?1:0; t.forEach((x,i)=>{ if(t.subC&&i===ci) h+=`<div class="tm-row tm-subc"><span class="chip">C</span><span class="nm muted">${T('tmSubC')}</span></div>`;
      h+=`<div class="tm-row" data-peek="${x.p.id}"><span class="chip ${x.pos==='EH'?'':'main'}">${x.pos}</span>${av(x.p)}<span class="nm">${esc(pname(x.p))}</span><span class="no">#${x.p.number}</span>${rt(Math.round(x.s*10)/10)}</div>`; });
    h+=`</div>`; });
  h+=`</div><div class="btns center"><button class="btn" onclick="tmSplit(false)">↻ ${T('tmAgain')}</button><button class="btn wa" onclick="tmCopy(this)">${T('tmCopy')}</button></div></div>`;
  document.getElementById('tmOut').innerHTML=h;
}
function tmText(){
  const teams=tmTeams();
  return teams.map((t,k)=>`⚾ *${TEAM_DEF[k].name}*\n`+(t.subC?[`C   — ${T('tmSubCs')}`]:[]).concat(t.map(x=>`${x.pos.padEnd(3)} #${x.p.number} ${pname(x.p)}`)).join('\n')).join('\n\n')+`\n\n${location.origin}${location.pathname}`;
}
async function tmCopy(btn){
  const txt=tmText();
  try{ await navigator.clipboard.writeText(txt); }
  catch(e){ const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy')}catch(_){} ta.remove(); }
  toast(T('tmCopied'));
}

/* =====================================================================
   2. ДОСТИЖЕНИЯ, РЕКОРДЫ, НАГРАДЫ
   ===================================================================== */
const BADGES=[
  {id:'debut',once:1,ic:'1',tier:1,t:{ru:'Дебют',az:'Debüt',en:'Debut'},d:{ru:'Первая игра',az:'İlk oyun',en:'First game'},game:b=>true},
  {id:'hit',once:1,ic:'H',tier:1,t:{ru:'Первый хит',az:'İlk hit',en:'First hit'},d:{ru:'Хит в игре',az:'Oyunda hit',en:'A hit in a game'},game:b=>b.H>=1},
  {id:'hr',once:1,ic:'HR',tier:2,t:{ru:'Первый хоум-ран',az:'İlk homeran',en:'First home run'},d:{ru:'Хоум-ран',az:'Homeran',en:'A home run'},game:b=>b.HR>=1},
  {id:'multi',ic:'2H',tier:1,t:{ru:'Мульти-хит',az:'Multi-hit',en:'Multi-hit'},d:{ru:'2+ хита за игру',az:'Bir oyunda 2+ hit',en:'2+ hits in a game'},game:b=>b.H>=2},
  {id:'three',ic:'3H',tier:2,t:{ru:'Три хита',az:'Üç hit',en:'Three hits'},d:{ru:'3+ хита за игру',az:'Bir oyunda 3+ hit',en:'3+ hits in a game'},game:b=>b.H>=3},
  {id:'perfect',ic:'100',tier:3,t:{ru:'Идеальная бита',az:'Mükəmməl vuruş',en:'Perfect at the plate'},d:{ru:'Хит в каждом выходе (от 3)',az:'Hər çıxışda hit (3+)',en:'A hit every at-bat (3+)'},game:b=>b.AB>=3&&b.H===b.AB},
  {id:'twohr',ic:'2HR',tier:3,t:{ru:'Два хоум-рана',az:'İki homeran',en:'Two homers'},d:{ru:'2+ HR за игру',az:'Bir oyunda 2+ HR',en:'2+ HR in a game'},game:b=>b.HR>=2},
  {id:'cycle',ic:'↻',tier:4,t:{ru:'Сайкл',az:'Dövrə',en:'Hit for the cycle'},d:{ru:'Сингл, дабл, трипл и HR в одной игре',az:'Bir oyunda sinql, dabl, tripl və HR',en:'Single, double, triple and HR in one game'},game:b=>b['1B']&&b['2B']&&b['3B']&&b.HR},
  {id:'rbi5',ic:'5',tier:3,t:{ru:'Пять RBI',az:'Beş RBI',en:'Five RBI'},d:{ru:'5+ RBI за игру',az:'Bir oyunda 5+ RBI',en:'5+ RBI in a game'},game:b=>b.RBI>=5},
  {id:'star',ic:'★',tier:3,t:{ru:'Звёздная игра',az:'Ulduz oyun',en:'Star game'},d:{ru:'Рейтинг 9.0+',az:'Reytinq 9.0+',en:'Rating 9.0+'},game:b=>b.rating>=9},
  {id:'mvp',ic:'MVP',tier:2,t:{ru:'Игрок матча',az:'Oyunun ən yaxşısı',en:'Player of the game'},d:{ru:'Лучший рейтинг в игре',az:'Oyunda ən yüksək reytinq',en:'Top rating in a game'},game:(b,g)=>g.mvp===b},
  {id:'glove',ic:'✋',tier:2,t:{ru:'Надёжная перчатка',az:'Etibarlı əlcək',en:'Sure hands'},d:{ru:'5+ аутов в защите без ошибок',az:'Səhvsiz 5+ müdafiə autu',en:'5+ outs on defense, no errors'},game:b=>(b.PO||0)+(b.A||0)>=5&&!(b.E||0)},
  {id:'kmaster',ic:'K',tier:2,t:{ru:'Мастер страйк-аутов',az:'Strayk-aut ustası',en:'Strikeout artist'},d:{ru:'3+ страйк-аута на подаче',az:'Pitçer kimi 3+ strayk-aut',en:'3+ strikeouts pitching'},game:b=>(b.PK||0)>=3},
  {id:'streak3',ic:'3▸',tier:2,t:{ru:'Серия 3',az:'Seriya 3',en:'Streak 3'},d:{ru:'Хит в 3 играх подряд',az:'Ardıcıl 3 oyunda hit',en:'A hit in 3 straight games'},career:p=>maxStreak(p)>=3},
  {id:'streak5',ic:'5▸',tier:3,t:{ru:'Серия 5',az:'Seriya 5',en:'Streak 5'},d:{ru:'Хит в 5 играх подряд',az:'Ardıcıl 5 oyunda hit',en:'A hit in 5 straight games'},career:p=>maxStreak(p)>=5},
  {id:'g5',ic:'5G',tier:1,t:{ru:'5 игр',az:'5 oyun',en:'5 games'},d:{ru:'Сыграл 5 игр',az:'5 oyun oynadı',en:'Played 5 games'},career:p=>p.t.G>=5},
  {id:'g10',ic:'10G',tier:2,t:{ru:'10 игр',az:'10 oyun',en:'10 games'},d:{ru:'Сыграл 10 игр',az:'10 oyun oynadı',en:'Played 10 games'},career:p=>p.t.G>=10},
  {id:'g20',ic:'20G',tier:3,t:{ru:'20 игр',az:'20 oyun',en:'20 games'},d:{ru:'Сыграл 20 игр',az:'20 oyun oynadı',en:'Played 20 games'},career:p=>p.t.G>=20},
];
const BL=x=>x[LANG]||x.en;
function maxStreak(p){ let m=0,c=0; for(const {b} of p.log){ if(b.H>=1){c++;m=Math.max(m,c)} else c=0 } return m; }
function badgesOf(p){
  const got={};
  for(const bd of BADGES){
    if(bd.game){ const hit=p.log.find(({game,b})=>bd.game(b,game)); if(hit){ got[bd.id]={date:hit.game.date,count:bd.once?1:p.log.filter(({game,b})=>bd.game(b,game)).length}; } }
    else if(bd.career&&p.t.G&&bd.career(p)) got[bd.id]={date:p.log[p.log.length-1].game.date,count:1};
  }
  return got;
}
const badgeIcon=(bd,on)=>`<span class="bdg t${bd.tier} ${on?'':'off'}">${bd.ic}</span>`;
function badgesBlock(p){
  if(!p.t.G) return '';
  const got=badgesOf(p), n=Object.keys(got).length;
  let h=`<div class="section-title"><h2>${T('bgTitle')}</h2><span class="hint">${T('bgOf')(n,BADGES.length)}</span></div><div class="card bgrid">`;
  for(const bd of [...BADGES].sort((a,b)=>!!got[b.id]-!!got[a.id])){ const g=got[bd.id];
    h+=`<div class="bitem ${g?'':'off'}" title="${esc(BL(bd.d))}">${badgeIcon(bd,!!g)}<div><b>${esc(BL(bd.t))}${g&&g.count>1?` ×${g.count}`:''}</b><span>${esc(BL(bd.d))}${g?` · ${fmtDate(g.date,{day:'numeric',month:'short'})}`:''}</span></div></div>`; }
  return h+'</div>';
}
function awardsList(){
  const ps=playersArr().filter(p=>p.t.G), q=ps.filter(p=>p.t.qual);
  const top=(arr,f,min)=>{ const s=arr.filter(p=>isFinite(f(p))&&(min==null||f(p)>min)).sort((a,b)=>f(b)-f(a)); return s[0]?{p:s[0],v:f(s[0])}:null; };
  const def=p=>p.log.reduce((t,{b})=>t+(b.FPO??b.PO??0)*1+(b.A||0)*.8+(b.PK||0)*.5-(b.E||0)*1.5,0)/p.t.G;
  const prog=p=>{ const r=p.log.map(x=>x.b.rating); if(r.length<6) return NaN; const k=Math.floor(r.length/2), a=r.slice(0,k), b=r.slice(-k); return b.reduce((x,y)=>x+y,0)/k-a.reduce((x,y)=>x+y,0)/k; };
  return [
    ['awMVP','awMVPd',top(q,p=>p.t.RAT),v=>v.toFixed(2),'★'],
    ['awBat','awBatd',top(q,p=>p.t.OPS),avg3,'OPS'],
    ['awHR','awHRd',top(ps,p=>p.t.HR,0),v=>v,'HR'],
    ['awRBI','awRBId',top(ps,p=>p.t.RBI,0),v=>v,'RBI'],
    ['awGlove','awGloved',top(q,def,0),v=>v.toFixed(1),'✋'],
    ['awIron','awIrond',top(ps,p=>p.t.G),v=>T('games_')(v),'G'],
    ['awWin','awWind',top(q,p=>p.t.W/(p.t.W+p.t.L||1)),v=>Math.round(v*100)+'%','W'],
    ['awProg','awProgd',top(ps,prog,0),v=>'+'+v.toFixed(2),'↑'],
  ];
}
function recordsData(){
  const recs=[], ps=playersArr().filter(p=>p.t.G);
  const single=(key,label,fmt=v=>v)=>{ let best=null;
    for(const g of statGames()) for(const b of g.box){ const v=b[key]; if(v>0&&(!best||v>best.v)) best={v,b,g}; }
    if(best) recs.push({label:T(label),v:fmt(best.v),p:S.players[best.b.player],g:best.g}); };
  single('H','recH'); single('HR','recHR'); single('RBI','recRBI'); single('R','recR'); single('rating','recRat',v=>v.toFixed(1)); single('PO','recPO');
  const season=[];
  const st=ps.map(p=>({p,v:maxStreak(p)})).sort((a,b)=>b.v-a.v)[0]; if(st&&st.v>=2) season.push({label:T('recStreak'),v:T('games_')(st.v),p:st.p});
  const mh=ps.map(p=>({p,v:p.log.filter(x=>x.b.H>=2).length})).sort((a,b)=>b.v-a.v)[0]; if(mh&&mh.v) season.push({label:T('recMulti'),v:mh.v,p:mh.p});
  return {recs,season};
}
function recordsPage(){
  let h=`<div class="pagehead"><span class="eyebrow">${T('season')} ${S.season}</span><h1>${T('rcTitle')}</h1></div>`;
  if(!statGames().length){ app().innerHTML=h+`<div class="card empty">${T('rcEmpty')}</div>`+badgeGallery(); return; }
  h+=`<div class="section-title"><h2>${T('rcAwards')}</h2><span class="hint">${T('rcLeader')}</span></div><div class="awards">`;
  for(const [t,d,w,fmt,ic] of awardsList()){
    h+=`<div class="card award">${'<span class="aw-ic">'+ic+'</span>'}<div class="aw-t"><b>${T(t)}</b><span>${T(d)}</span></div>
      ${w?`<a class="aw-p" href="#player-${w.p.id}" data-peek="${w.p.id}">${av(w.p,'m')}<div><b>${esc(pname(w.p))}</b><span>${fmt(w.v)}</span></div></a>`:`<div class="aw-p muted">${T('rcNobody')}</div>`}</div>`; }
  const {recs,season}=recordsData();
  h+=`</div><div class="rec-cols"><div><div class="section-title"><h2>${T('rcGame')}</h2></div><div class="card reclist">`;
  for(const r of recs) h+=`<a class="rec" href="#game-${r.g.id}"><span class="rl">${r.label}</span><b class="rv">${r.v}</b>${av(r.p)}<span class="rp">${esc(pname(r.p))}<i>${fmtDate(r.g.date,{day:'numeric',month:'short'})}</i></span></a>`;
  h+=`</div></div><div><div class="section-title"><h2>${T('rcSeason')}</h2></div><div class="card reclist">`;
  for(const r of season) h+=`<a class="rec" href="#player-${r.p.id}"><span class="rl">${r.label}</span><b class="rv">${r.v}</b>${av(r.p)}<span class="rp">${esc(pname(r.p))}</span></a>`;
  h+=`</div></div></div>`+badgeGallery();
  app().innerHTML=h;
}
function badgeGallery(){
  const ps=playersArr().filter(p=>p.t.G), owners={};
  for(const p of ps){ const g=badgesOf(p); for(const id in g) (owners[id]=owners[id]||[]).push(p); }
  let h=`<div class="section-title"><h2>${T('rcBadges')}</h2><span class="hint">${BADGES.length}</span></div><div class="card bgal">`;
  for(const bd of BADGES){ const o=owners[bd.id]||[];
    h+=`<div class="bg-row">${badgeIcon(bd,o.length>0)}<div class="bg-t"><b>${esc(BL(bd.t))}</b><span>${esc(BL(bd.d))}</span></div>
      <div class="bg-own">${o.length?o.slice(0,8).map(p=>`<a href="#player-${p.id}" data-peek="${p.id}">${av(p)}</a>`).join('')+(o.length>8?`<span class="more">+${o.length-8}</span>`:''):`<span class="muted small">${T('rcNobody')}</span>`}</div></div>`; }
  return h+'</div>';
}

/* =====================================================================
   3. С КЕМ ПОБЕЖДАЕШЬ, МОМЕНТЫ
   ===================================================================== */
function chemistry(p){
  const with_={}, vs={};
  for(const {game:g,b} of p.log){ if(!g.winner) continue; const won=g.winner===b.team;
    for(const o of g.box){ if(o.player===p.id) continue; const m=o.team===b.team?with_:vs; const r=m[o.player]=m[o.player]||{g:0,w:0}; r.g++; if(won) r.w++; } }
  const arr=m=>Object.entries(m).filter(([id,r])=>r.g>=2&&S.players[id]).map(([id,r])=>({p:S.players[id],...r,pc:r.w/r.g}));
  return {best:arr(with_).sort((a,b)=>b.pc-a.pc||b.g-a.g).slice(0,3),hard:arr(vs).sort((a,b)=>a.pc-b.pc||b.g-a.g).slice(0,3)};
}
function chemBlock(p){
  if(!p.t.G) return '';
  const {best,hard}=chemistry(p);
  const row=(x,lbl)=>`<a class="ch-row" href="#player-${x.p.id}" data-peek="${x.p.id}">${av(x.p)}<span class="nm">${esc(pname(x.p))}</span><span class="rec2">${x.w}-${x.g-x.w}</span><span class="pc ${x.pc>=.5?'good':'bad'}">${Math.round(x.pc*100)}%</span></a>`;
  if(!best.length&&!hard.length) return `<div class="section-title"><h2>${T('chTitle')}</h2></div><div class="card empty">${T('chNone')}</div>`;
  return `<div class="section-title"><h2>${T('chTitle')}</h2><span class="hint">${T('chHint')}</span></div><div class="ch-cols">
    <div class="card ch"><h3>${T('chBest')}</h3>${best.map(x=>row(x)).join('')||`<p class="muted small">${T('chNone')}</p>`}</div>
    <div class="card ch"><h3>${T('chHard')}</h3>${hard.map(x=>row(x)).join('')||`<p class="muted small">${T('chNone')}</p>`}</div></div>`;
}
// моменты: g.highlights = [{player, t: секунды в ролике YouTube, type: 'HR'|'3B'|'catch'|..., note?}]
const fmtT=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function ytAt(url,t){ const id=ytId(url); return id?`https://youtu.be/${id}?t=${Math.floor(t)}`:url; }
function hlRow(h,g,showPlayer){
  const p=S.players[h.player], type=(T('hlTypes')[h.type]||T('hlTypes').play);
  return `<a class="hl" href="${ytAt(g.video,h.t)}" target="_blank" rel="noopener"><span class="hl-t">▶ ${fmtT(h.t)}</span><span class="hl-ty">${esc(type)}</span>
    ${showPlayer&&p?`${av(p)}<span class="nm">${esc(pname(p))}</span>`:`<span class="nm">${fmtDate(g.date,{day:'numeric',month:'short'})}</span>`}${h.note?`<span class="muted small">${esc(h.note)}</span>`:''}</a>`;
}
function hlBlock(p){
  const items=[]; for(const g of S.games) for(const x of (g.highlights||[])) if(x.player===p.id&&g.video) items.push({x,g});
  if(!items.length) return '';
  return `<div class="section-title"><h2>${T('hlTitle')}</h2><span class="hint">${items.length}</span></div><div class="card hls">${items.reverse().map(({x,g})=>hlRow(x,g,false)).join('')}</div>`;
}
window.gameHighlights=function(g){
  const hs=(g.highlights||[]).filter(x=>g.video); if(!hs.length) return '';
  return `<div class="section-title"><h2>${T('hlGame')}</h2><span class="hint">${hs.length}</span></div><div class="card hls">${hs.map(x=>hlRow(x,g,true)).join('')}</div>`;
};
window.playerExtras=function(p){
  const top=`<div class="btns pextra"><button class="btn" onclick="shareCard('${p.id}')">⇪ ${T('shBtn')}</button></div>`;
  return {top, bottom:badgesBlock(p)+hlBlock(p)+chemBlock(p)};
};
/* =====================================================================
   4. КАРТИНКА КАРТОЧКИ ДЛЯ WHATSAPP / INSTAGRAM (1080×1350)
   ===================================================================== */
async function shareCard(id){
  const p=S.players[id]; if(!p) return;
  const m=document.createElement('div'); m.className='modal'; m.innerHTML=`<div class="sheet"><div class="sh-h"><b>${T('shTitle')}</b><button class="x" onclick="this.closest('.modal').remove()">×</button></div><div class="sh-img">…</div><div class="btns center" id="shBtns"></div></div>`;
  m.onclick=e=>{ if(e.target===m) m.remove(); }; document.body.appendChild(m);
  const blob=await drawCard(p), url=URL.createObjectURL(blob), file=new File([blob],`softball-baku-${p.id}.png`,{type:'image/png'});
  m.querySelector('.sh-img').innerHTML=`<img src="${url}" alt="">`;
  const canShare=navigator.canShare&&navigator.canShare({files:[file]});
  const bt=m.querySelector('#shBtns');
  if(canShare){ const b=document.createElement('button'); b.className='btn wa'; b.textContent=T('shShare'); b.onclick=()=>navigator.share({files:[file],title:pname(p)}).catch(()=>{}); bt.appendChild(b); }
  const a=document.createElement('a'); a.className='btn'; a.href=url; a.download=file.name; a.textContent=T('shDownload'); bt.appendChild(a);
}
function loadImg(src){ return new Promise(r=>{ if(!src) return r(null); const i=new Image(); i.onload=()=>r(i); i.onerror=()=>r(null); i.src=src; }); }
async function drawCard(p){
  const W=1080,H=1350, c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d');
  try{ await Promise.all(['900 italic 80px Inter','800 40px Inter','700 30px Inter'].map(f=>document.fonts.load(f))); }catch(e){}
  const F=(w,s,it)=>`${it?'italic ':''}${w} ${s}px Inter, "Inter Display", system-ui, sans-serif`;
  // фон
  const g=x.createLinearGradient(0,0,W,H); g.addColorStop(0,'#16263f'); g.addColorStop(.6,'#0b1626'); g.addColorStop(1,'#060d18'); x.fillStyle=g; x.fillRect(0,0,W,H);
  x.save(); x.globalAlpha=.035; x.strokeStyle='#fff'; x.lineWidth=3; for(let i=-H;i<W+H;i+=60){x.beginPath();x.moveTo(i,0);x.lineTo(i-H*.47,H);x.stroke();} x.restore();
  ['#D85A30','#EF9F27','#1f6fc0'].forEach((col,i)=>{x.fillStyle=col;x.fillRect(i*W/3,0,W/3,14);});
  // номер-водяной знак
  x.font=F(900,560,1); x.fillStyle='rgba(239,159,39,.08)'; x.textAlign='right'; x.fillText(String(p.number),W+20,560);
  // бренд
  x.textAlign='left'; drawBall(x,92,95,24); x.fillStyle='#eef2f8'; x.font=F(800,40); x.fillText('SOFTBALL',130,108); x.fillStyle='#EF9F27'; x.fillText('BAKU',x.measureText('SOFTBALL ').width+130,108);
  // фото
  const cx=W/2, cy=470, r=230, img=await loadImg(p.photo);
  x.save(); x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.closePath(); x.fillStyle='#14233a'; x.fill(); x.clip();
  if(img) x.drawImage(img,cx-r,cy-r,r*2,r*2); else { x.fillStyle='#EF9F27'; x.font=F(900,200,1); x.textAlign='center'; x.fillText(String(p.number),cx,cy+70); }
  x.restore(); x.lineWidth=10; x.strokeStyle='#EF9F27'; x.beginPath(); x.arc(cx,cy,r+5,0,Math.PI*2); x.stroke();
  // имя
  x.textAlign='center'; x.fillStyle='#ffffff'; x.font=F(900,96,1); x.fillText(first(p),cx,850);
  if(last(p)){ x.fillStyle='#8fa0b8'; x.font=F(800,44); x.letterSpacing='8px'; x.fillText(last(p).toUpperCase(),cx,915); x.letterSpacing='0px'; }
  x.fillStyle='#EF9F27'; x.font=F(800,36); x.fillText(`#${p.number} · ${POS_NAMES[LANG][mainPos(p)]||mainPos(p)}`,cx,985);
  // рейтинг и статистика
  const t=p.t;
  if(t.G){
    const rv=Math.round(t.RAT*10)/10, rc=getComputedStyle(document.documentElement).getPropertyValue('--r-'+rclass(rv)).trim()||'#2fae66';
    x.fillStyle=rc; roundRect(x,cx-120,1030,240,110,22); x.fill(); x.fillStyle='#fff'; x.font=F(900,74,1); x.fillText(rv.toFixed(1),cx,1112);
    const st=[[T('G'),t.G],['AVG',avg3(t.AVG)],['OPS',avg3(t.OPS)],['HR',t.HR],['RBI',t.RBI]], w=W/st.length;
    st.forEach(([k,v],i)=>{ x.fillStyle='#ffffff'; x.font=F(900,48); x.fillText(String(v),w*i+w/2,1225); x.fillStyle='#8fa0b8'; x.font=F(700,24); x.fillText(String(k).toUpperCase(),w*i+w/2,1262); });
  } else {
    x.fillStyle='#8fa0b8'; x.font=F(700,34); x.fillText(T('shSeason')({season:S.season,start:fromDate(S.start)}),cx,1100);
  }
  x.fillStyle='#5f6f88'; x.font=F(700,24); x.fillText((location.host+location.pathname).replace(/\/$/,''),cx,1318);
  return await new Promise(r=>c.toBlob(r,'image/png'));
}
function roundRect(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();}

/* =====================================================================
   5. ДЕМО-РЕЖИМ: ?demo=1 — синтетические игры из настоящего состава
   ===================================================================== */
window.DEMO_MODE=/[?&]demo=1\b/.test(location.search);
window.makeDemoGames=function(players){
  const rnd=mulberry32(2027), skill={}; players.forEach(p=>skill[p.id]=.26+rnd()*.3);
  const pick=a=>a[Math.floor(rnd()*a.length)];
  const dates=['2027-01-03','2027-01-10','2027-01-17','2027-01-24','2027-01-31','2027-02-07','2027-02-14','2027-02-21'];
  const vid='https://youtu.be/GVoWwZC3y9Y';
  return dates.map((d,gi)=>{
    const pres=shuffle(players,rnd).slice(0,15+Math.floor(rnd()*5));
    const sol=splitTeams(pres.map(p=>({p,s:5+skill[p.id]*6})),rnd,true)[0];
    const teams={A:assignPositions(sol.A),B:assignPositions(sol.B)}, box=[], hl=[];
    const kBy={A:0,B:0};
    for(const k of ['A','B']) for(const x of teams[k]){
      const b={player:x.p.id,team:k,pos:x.pos,PA:0,AB:0,H:0,'1B':0,'2B':0,'3B':0,HR:0,BB:0,K:0,R:0,RBI:0,SB:0,PO:0,A:0,E:0,FPO:0,KPO:0,PK:0};
      b.PA=3+Math.floor(rnd()*2.4);
      for(let i=0;i<b.PA;i++){ const r=rnd();
        if(r<skill[x.p.id]){ const h=rnd(), t=h<.58?'1B':h<.8?'2B':h<.87?'3B':'HR'; b[t]++; b.H++; b.AB++;
          if(t==='HR'||t==='3B'||(t==='2B'&&rnd()<.3)) hl.push({player:x.p.id,t:Math.floor(60+rnd()*3500),type:t}); }
        else if(r<skill[x.p.id]+.08) b.BB++;
        else { b.AB++; if(rnd()<.22){ b.K++; kBy[k]++; } } }
      b.R=Math.min(b.H+b.BB,Math.floor(rnd()*(b.H+b.BB+1))); b.RBI=b.HR+Math.floor(rnd()*(b.H+1)); if(rnd()<.12) b.SB=1;
      const inf=['1B','2B','3B','SS','P'].includes(x.pos), of=['LF','LCF','CF','RCF','RF'].includes(x.pos);
      if(x.pos==='1B'){ b.PO=3+Math.floor(rnd()*4); b.FPO=Math.floor(rnd()*2); }
      else if(of){ b.FPO=Math.floor(rnd()*3.2); b.PO=b.FPO; if(b.FPO>=1&&rnd()<.4) hl.push({player:x.p.id,t:Math.floor(60+rnd()*3500),type:'catch'}); }
      else if(inf){ b.A=Math.floor(rnd()*4); b.FPO=Math.floor(rnd()*2); b.PO=b.FPO; }
      if(rnd()<.1) b.E=1;
      box.push(b); }
    for(const k of ['A','B']){ const o=k==='A'?'B':'A', c=box.find(b=>b.team===k&&b.pos==='C'), pi=box.find(b=>b.team===k&&b.pos==='P');
      if(c){ c.KPO=kBy[o]; c.PO+=kBy[o]; } if(pi) pi.PK=kBy[o]; }
    const sc={A:box.filter(b=>b.team==='A').reduce((t,b)=>t+b.R,0),B:box.filter(b=>b.team==='B').reduce((t,b)=>t+b.R,0)};
    if(sc.A===sc.B){ const b=pick(box.filter(b=>b.team==='A')); b.R++; sc.A++; }
    const ls={A:Array(7).fill(0),B:Array(7).fill(0)}; for(const k of ['A','B']) for(let i=0;i<sc[k];i++) ls[k][Math.floor(rnd()*7)]++;
    hl.sort((a,b)=>a.t-b.t);
    return {id:d,date:d,venue:'Amirajan, Baku',video:vid,image:'games/2026-11-01.jpg',teams:{A:{name:'Bina Warriors',color:'#D85A30'},B:{name:'Gilavar Baku',color:'#1f6fc0'}},linescore:ls,score:sc,box,highlights:hl.slice(0,8)};
  });
};

/* ---------- страницы правил подключаются из rules.js ---------- */
window.FEATURE_ROUTES={teams:teamsPage,records:recordsPage,rules:id=>window.rulesPage?rulesPage(id):home()};

/* мяч-логотип для картинок (canvas) */
function drawBall(x,cx,cy,r){
  x.save(); x.translate(cx,cy); x.rotate(-25*Math.PI/180); const k=r/46; x.scale(k,k); x.translate(-50,-50);
  const g=x.createRadialGradient(38,32,0,38,32,75); g.addColorStop(0,'#fff'); g.addColorStop(.62,'#f1ede4'); g.addColorStop(1,'#c9c2b3');
  x.beginPath(); x.arc(50,50,46,0,Math.PI*2); x.fillStyle=g; x.fill(); x.clip();
  x.lineCap='round'; x.globalAlpha=.55; x.strokeStyle='#c9302c'; x.lineWidth=2.4; x.stroke(new Path2D(BALL_SEAM));
  x.globalAlpha=1; x.strokeStyle='#d2312b'; x.lineWidth=3.6; x.stroke(new Path2D(BALL_ST)); x.restore();
}
