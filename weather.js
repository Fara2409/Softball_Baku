// Softball Baku — погода в игровые дни (Əmircan).
// Игровые дни: все воскресенья + праздничные нерабочие дни из data/calendar.json.
// Блок с вердиктами видят только игроки и админ; гостям — только прогноз у назначенной игры.
// Прогноз: Open-Meteo (бесплатно, без ключа), берётся заново при открытии сайта (кэш в браузере 1 час).
// Оценка по часам игры: дождь, вероятность дождя, гроза, ветер, холод и дождь за 12 часов до игры (мокрое поле).
'use strict';
(function(){

const SITE='https://fara2409.github.io/Softball_Baku/';
const CACHE='sb.wx.v1', TTL=60*60e3;
Object.assign(I18N.ru,{
  wxTitle:'Погода в игровые дни',wxSub:'Амирджан · воскресенья и праздничные дни · прогноз обновляется при каждом открытии',
  wxGood:'Игровая погода',wxRisk:'Под вопросом',wxBad:'Неигровая погода',wxWait:'Ждём подтверждения игры',wxBest:'Лучший день',wxFar:'прогноз на 8+ дней, может измениться',
  wxRain:mm=>`дождь ${mm} мм`,wxNoRain:'без дождя',wxProb:p=>`вероятность дождя ${p}%`,wxStorm:'гроза',wxWet:mm=>`до игры дождь ${mm} мм — поле может быть мокрым`,
  wxWind:v=>`порывы ветра до ${v} км/ч`,wxCold:t=>`холодно: ${t}°`,wxKmh:'км/ч',wxCopy:'Скопировать для WhatsApp',wxSet:'Назначить игру',wxGame:t=>`Игра назначена · ${t}`,
  wxErr:'Не удалось загрузить прогноз погоды',wxSrc:'Прогноз: Open-Meteo.com',wxHead:t=>`погода (Амирджан), ${t}`,wxNone:'В ближайшие 16 дней игровых дней нет'
});
Object.assign(I18N.az,{
  wxTitle:'Oyun günlərində hava',wxSub:'Əmircan · bazar günləri və bayram günləri · proqnoz hər açılışda yenilənir',
  wxGood:'Hava uyğundur',wxRisk:'Sual altındadır',wxBad:'Hava uyğun deyil',wxWait:'Oyunun təsdiqi gözlənilir',wxBest:'Ən yaxşı gün',wxFar:'8+ günlük proqnoz, dəyişə bilər',
  wxRain:mm=>`yağış ${mm} mm`,wxNoRain:'yağışsız',wxProb:p=>`yağış ehtimalı ${p}%`,wxStorm:'ildırım',wxWet:mm=>`oyundan əvvəl yağış ${mm} mm — meydança yaş ola bilər`,
  wxWind:v=>`külək ${v} km/saata qədər`,wxCold:t=>`soyuq: ${t}°`,wxKmh:'km/saat',wxCopy:'WhatsApp üçün kopyala',wxSet:'Oyun təyin et',wxGame:t=>`Oyun təyin olunub · ${t}`,
  wxErr:'Hava proqnozunu yükləmək alınmadı',wxSrc:'Proqnoz: Open-Meteo.com',wxHead:t=>`hava (Əmircan), ${t}`,wxNone:'Yaxın 16 gündə oyun günü yoxdur'
});
Object.assign(I18N.en,{
  wxTitle:'Weather on game days',wxSub:'Amirajan · Sundays and holidays · forecast refreshes every time you open the site',
  wxGood:'Playable weather',wxRisk:'Doubtful',wxBad:'Unplayable weather',wxWait:'Awaiting game confirmation',wxBest:'Best day',wxFar:'8+ days out, may change',
  wxRain:mm=>`rain ${mm} mm`,wxNoRain:'dry',wxProb:p=>`${p}% chance of rain`,wxStorm:'thunderstorm',wxWet:mm=>`${mm} mm of rain before the game — field may be wet`,
  wxWind:v=>`gusts up to ${v} km/h`,wxCold:t=>`cold: ${t}°`,wxKmh:'km/h',wxCopy:'Copy for WhatsApp',wxSet:'Schedule a game',wxGame:t=>`Game set · ${t}`,
  wxErr:'Could not load the weather forecast',wxSrc:'Forecast: Open-Meteo.com',wxHead:t=>`weather (Amirajan), ${t}`,wxNone:'No game days in the next 16 days'
});

const W={cal:null,data:null,err:false,busy:null};
const WD_AZ=['Bazar','Bazar ertəsi','Çərşənbə axşamı','Çərşənbə','Cümə axşamı','Cümə','Şənbə'];
const pad=n=>String(n).padStart(2,'0');
const bakuToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Baku',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const bakuHour=()=>+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Baku',hour:'2-digit',hour12:false}).format(new Date())%24;
const addDays=(ymd,n)=>{ const d=new Date(ymd+'T12:00:00Z'); d.setUTCDate(d.getUTCDate()+n); return d.toISOString().slice(0,10); };
const wday=ymd=>new Date(ymd+'T12:00:00Z').getUTCDay();
const evYmd=iso=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Baku',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
const evHM=iso=>new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Baku',hour:'2-digit',minute:'2-digit'}).format(new Date(iso));
function dayName(ymd){
  const d=new Date(ymd+'T12:00:00Z');
  if(LANG==='az') return `${WD_AZ[d.getUTCDay()]}, ${d.getUTCDate()} ${AZ_M[d.getUTCMonth()]}`;
  const s=d.toLocaleDateString(LOCALE[LANG],{timeZone:'UTC',weekday:'long',day:'numeric',month:'long'}); return s[0].toUpperCase()+s.slice(1);
}
const icon=c=>c>=95?'⛈️':c>=85?'🌨️':c>=80?'🌧️':c>=71?'🌨️':c>=61?'🌧️':c>=51?'🌦️':c>=45?'🌫️':c>=3?'☁️':c>=1?'🌤️':'☀️';
const r1=x=>Math.round(x*10)/10;

/* ---------- данные ---------- */
function load(){
  if(W.busy) return W.busy;
  W.busy=(async()=>{
    if(!W.cal) W.cal=await fetch('data/calendar.json?v=202611070315',{cache:'no-cache'}).then(r=>r.json());
    let c=null; try{ c=JSON.parse(localStorage.getItem(CACHE)); }catch(e){}
    if(c&&Date.now()-c.at<TTL&&c.data&&c.data.hourly){ W.data=c.data; return; }
    const p=W.cal.place||{lat:40.4264,lon:49.9836};
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}`+
      `&hourly=temperature_2m,precipitation,precipitation_probability,weather_code,wind_gusts_10m`+
      `&daily=weather_code,temperature_2m_max,temperature_2m_min`+
      `&timezone=Asia%2FBaku&forecast_days=16`;
    const r=await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status);
    W.data=await r.json(); W.err=false;
    try{ localStorage.setItem(CACHE,JSON.stringify({at:Date.now(),data:W.data})); }catch(e){}
  })().catch(e=>{ console.warn('[weather]',e); W.err=true; if(c0()) W.data=c0(); }).finally(()=>{ W.busy=null; });
  return W.busy;
}
function c0(){ try{ const c=JSON.parse(localStorage.getItem(CACHE)); return c&&c.data; }catch(e){ return null; } }
const periodOf=ymd=>((W.cal&&W.cal.periods)||[]).find(p=>ymd>=p.from&&ymd<=p.to)||null;
const eventsOn=ymd=>((window.CL&&CL.events&&CL.events())||[]).filter(e=>e.status!=='cancelled'&&evYmd(e.starts_at)===ymd);

/* ---------- оценка дня ---------- */
function evalDay(ymd,startHM){
  const H=W.data&&W.data.hourly; if(!H) return null;
  const g=(W.cal&&W.cal.game)||{start:'10:00',hours:3};
  const ev=eventsOn(ymd)[0], start=startHM||(ev?evHM(ev.starts_at):g.start), hours=g.hours||3;
  const sh=+start.slice(0,2), s=H.time.indexOf(`${ymd}T${pad(sh)}:00`); if(s<0) return null;
  const end=Math.min(H.time.length-1,s+hours), win=[], inst=[], pre=[];
  for(let i=s+1;i<=end;i++) win.push(i);          // осадки и вероятность — «за предыдущий час»
  for(let i=s;i<=end;i++) inst.push(i);
  for(let i=Math.max(0,s-11);i<=s;i++) pre.push(i); // 12 часов до начала игры
  const num=a=>a.filter(v=>v!=null&&isFinite(v));
  const rain=r1(num(win.map(i=>H.precipitation[i])).reduce((a,b)=>a+b,0));
  const probs=num(win.map(i=>(H.precipitation_probability||[])[i])), prob=probs.length?Math.max(...probs):null;
  const codes=num(inst.map(i=>H.weather_code[i])), code=codes.length?Math.max(...codes):0;
  const gusts=num(inst.map(i=>H.wind_gusts_10m[i])), gust=gusts.length?Math.round(Math.max(...gusts)):0;
  const temps=num(inst.map(i=>H.temperature_2m[i])), tmin=temps.length?Math.round(Math.min(...temps)):null, tmax=temps.length?Math.round(Math.max(...temps)):null;
  const before=r1(num(pre.map(i=>H.precipitation[i])).reduce((a,b)=>a+b,0));
  const storm=code>=95;
  const bad=storm||rain>=1||(prob!=null&&prob>=80)||before>=6||gust>=75;
  const risk=!bad&&(rain>=0.2||(prob!=null&&prob>=40)||before>=2||gust>=55||(tmin!=null&&tmin<3));
  const why=[], note=[];
  if(storm){ why.push(T('wxStorm')); note.push(T('wxStorm')); }
  if(rain>=0.2) why.push(T('wxRain')(rain));
  if(prob!=null&&prob>=40) why.push(T('wxProb')(prob));
  if(before>=2){ why.push(T('wxWet')(before)); note.push(T('wxWet')(before)); }
  if(gust>=55) why.push(T('wxWind')(gust));
  if(tmin!=null&&tmin<3){ why.push(T('wxCold')(tmin)); note.push(T('wxCold')(tmin)); }
  // при равной погоде предпочитаем воскресенье — обычный игровой день
  const score=rain*3+(prob||0)/20+(storm?10:0)+Math.max(0,gust-40)/10+before*0.5+(tmin!=null&&tmin<3?2:0)+(wday(ymd)===0?0:0.3);
  const di=(W.data.daily&&W.data.daily.time||[]).indexOf(ymd), D=W.data.daily||{};
  return {ymd,start,end:`${pad(Math.min(24,sh+hours))}:00`,rain,prob,gust,tmin,tmax,before,storm,code,why,note,score,
    v:bad?'bad':risk?'risk':'good',ev:!!ev,
    dmax:di>=0?Math.round(D.temperature_2m_max[di]):tmax,dmin:di>=0?Math.round(D.temperature_2m_min[di]):tmin,
    far:(new Date(ymd)-new Date(bakuToday()))/864e5>=8};
}
function candidates(){
  if(!W.data) return [];
  const today=bakuToday(), out=[];
  for(let i=0;i<16;i++){
    const d=addDays(today,i), per=periodOf(d);
    if(wday(d)!==0&&!per) continue;
    const e=evalDay(d); if(!e) continue;
    if(i===0&&bakuHour()>=+e.end.slice(0,2)) continue; // сегодняшняя игра уже прошла
    e.period=per; out.push(e);
  }
  // лучший день внутри каждого праздничного периода
  const groups={}; out.forEach(e=>{ if(e.period){ (groups[e.period.from]=groups[e.period.from]||[]).push(e); } });
  Object.values(groups).forEach(g=>{ if(g.length<2) return; const b=[...g].sort((a,b)=>a.score-b.score)[0]; if(b.v!=='bad') b.best=true; });
  return out;
}

/* ---------- вывод ---------- */
const VL={good:'wxGood',risk:'wxRisk',bad:'wxBad'}, VI={good:'✅',risk:'⚠️',bad:'❌'};
function card(e){
  const admin=window.CL&&CL.isAdmin&&CL.isAdmin();
  const det=[`${e.start}–${e.end}`, e.rain>=0.1?`${e.rain} mm`:T('wxNoRain')];
  if(e.prob!=null) det.push(`☔ ${e.prob}%`);
  det.push(`💨 ${e.gust} ${T('wxKmh')}`);
  return `<div class="card wx-card ${e.v} ${e.best?'best':''}">
    <div class="wx-h"><b>${dayName(e.ymd)}</b>${e.period?`<span class="wx-hol">${esc(e.period.name[LANG]||e.period.name.az)}</span>`:''}${e.best?`<span class="wx-best">★ ${T('wxBest')}</span>`:''}</div>
    <div class="wx-m"><span class="wx-ic">${icon(e.code)}</span><span class="wx-t">${e.dmax}°<i>/${e.dmin}°</i></span></div>
    <div class="wx-v"><i></i>${T(VL[e.v])}</div>
    <div class="wx-d">${det.join(' · ')}</div>
    ${e.note.length?`<div class="wx-why">${e.note.join(' · ')}</div>`:''}
    ${e.far?`<div class="wx-far">${T('wxFar')}</div>`:''}
    ${e.ev?`<div class="wx-ev">📅 ${T('wxGame')(e.start)}</div>`:`<div class="wx-wait">⏳ ${T('wxWait')}</div>${admin&&e.v!=='bad'?`<button class="btn sm wx-set" onclick="WX.setGame('${e.ymd}')">+ ${T('wxSet')}</button>`:''}`}
  </div>`;
}
function section(compact){
  const L=candidates();
  let body;
  if(!W.data) body=W.err?`<div class="card empty" style="margin-top:0">${T('wxErr')}</div>`:`<div class="loading" style="padding:20px">…</div>`;
  else if(!L.length) body=`<div class="card empty" style="margin-top:0">${T('wxNone')}</div>`;
  else body=`<div class="wx-grid">${(compact?L.slice(0,5):L).map(card).join('')}</div>`;
  return `<div class="section-title wx-title"><h2>${T('wxTitle')}</h2>${L.length?`<button class="btn sm" onclick="WX.copy()">${T('wxCopy')}</button>`:''}</div>
    <p class="wx-sub muted">${T('wxSub')}</p>${body}<p class="wx-src"><a href="https://open-meteo.com/" target="_blank" rel="noopener">${T('wxSrc')}</a></p>`;
}
function drawSec(){ const el=document.getElementById('wx-sec'); if(el) el.innerHTML=section(el.dataset.compact==='1'); }
function draw(){ drawSec(); if(window.CL&&CL.redraw) CL.redraw(); }
function copy(){
  const L=candidates(); if(!L.length) return;
  const g=(W.cal&&W.cal.game)||{start:'10:00',hours:3};
  const lines=[`⚾ Softball Baku — ${T('wxHead')(`${g.start}–${pad(+g.start.slice(0,2)+g.hours)}:00`)}`];
  L.forEach(e=>lines.push(`${VI[e.v]} ${dayName(e.ymd)}${e.period?` (${e.period.name[LANG]||e.period.name.az})`:''} — ${T(VL[e.v])}: ${icon(e.code)} ${e.dmax}°, ${e.why.length?e.why.join(', '):T('wxNoRain')}${e.best?` ★ ${T('wxBest')}`:''}`));
  lines.push(SITE);
  const t=lines.join('\n');
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(T('tmCopied'))).catch(()=>prompt('',t));
}
function setGame(ymd){ lsSet('sb.prefillDate',ymd); location.hash='#admin'; }
// значок погоды для карточки игры в расписании
function chip(iso){
  if(!W.data) return '';
  const ymd=evYmd(iso), e=evalDay(ymd,evHM(iso)); if(!e) return '';
  const t=e.tmax??e.dmax;
  if(!(window.CL&&CL.canDecide&&CL.canDecide())) // гостям — просто прогноз, без «можно / нельзя играть»
    return `<span class="wx-chip">${icon(e.code)} ${t}° · ${e.rain>=0.2?T('wxRain')(e.rain):T('wxNoRain')}${e.prob!=null&&e.prob>=30?` · ☔ ${e.prob}%`:''}</span>`;
  return `<span class="wx-chip ${e.v}" title="${esc(e.why.join(' · ')||T('wxNoRain'))}">${icon(e.code)} ${t}° · ${T(VL[e.v])}</span>`;
}
window.WX={copy,setGame,chip,candidates,drawSec,ready:()=>!!W.data};

const _route=route; route=function(){
  _route();
  const h=(location.hash||'').slice(1), page=h.split('-')[0];
  const FR=window.FEATURE_ROUTES||{}, isHome=!['player','game','games'].includes(page)&&!FR[page];
  if(!(isHome||page==='games')||!S.league) return;
  // блок «можно ли играть» — только игрокам и админу: гости в этом решении не участвуют
  if(!(window.CL&&CL.canDecide&&CL.canDecide())){ if(!W.data) load().then(()=>{ if(window.CL&&CL.redraw) CL.redraw(); }); return; }
  const A=app(), sec=`<div id="wx-sec" class="wx-sec" data-compact="${isHome?1:0}">${section(isHome)}</div>`;
  const anchor=isHome?document.getElementById('cl-next'):document.getElementById('cl-sched');
  if(anchor) anchor.insertAdjacentHTML('afterend',sec); else A.insertAdjacentHTML('afterbegin',sec);
  let at=0; try{ at=(JSON.parse(localStorage.getItem(CACHE)||'{}').at)||0; }catch(e){}
  if(!W.data||Date.now()-at>TTL) load().then(draw);
};
load().then(draw);
})();
