// Softball Baku — погода в игровые дни (Əmircan).
// Игровые дни: все воскресенья + праздничные нерабочие дни из data/calendar.json.
// Блок с вердиктами видят только игроки и админ; гостям — только прогноз у назначенной игры.
// Прогноз: Open-Meteo (бесплатно, без ключа). Обновляется сам: каждые 15 минут, пока сайт открыт,
// и сразу, когда сайт / приложение снова открывают (кэш в браузере 15 минут).
// На сегодня и завтра пороги строже, а если дождь идёт прямо сейчас — это тоже учитывается.
// Оценка по часам игры: дождь, вероятность дождя, гроза, ветер, холод и дождь за 12 часов до игры (мокрое поле).
'use strict';
(function(){

const SITE='https://softball.az/';
const CACHE='sb.wx.v4', TTL=15*60e3;
Object.assign(I18N.ru,{
  wxTitle:'Погода в игровые дни',wxSub:'Амирджан · воскресенья и праздничные дни · прогноз обновляется автоматически каждые 15 минут',
  wxGood:'Игровая погода',wxRisk:'Под вопросом',wxBad:'Неигровая погода',wxWait:'Ждём подтверждения игры',wxBest:'Лучший день',wxFar:'прогноз на 8+ дней, может измениться',
  wxRain:mm=>`дождь ${mm} мм`,wxNoRain:'без дождя',wxProb:p=>`вероятность дождя ${p}%`,wxStorm:'гроза',wxWet:mm=>`до игры дождь ${mm} мм — поле может быть мокрым`,
  wxWind:v=>`порывы ветра до ${v} км/ч`,wxCold:t=>`холодно: ${t}°`,wxKmh:'км/ч',wxCopy:'Скопировать для WhatsApp',wxSet:'Назначить игру',wxGame:t=>`Игра назначена · ${t}`,
  wxErr:'Не удалось загрузить прогноз погоды',wxUpd:t=>`обновлено в ${t}`,wxNow:'сейчас идёт дождь',wxRefresh:'Обновить',wxSrc:'Прогноз: Open-Meteo.com',wxHead:t=>`погода (Амирджан), ${t}`,wxNone:'В ближайшие 16 дней игровых дней нет'
});
Object.assign(I18N.ru,{wxTitle2:'Погода в Амирджане',wxSub2:'игровые дни выделены · прогноз обновляется сам каждые 15 минут',wxGameDay:'Игровой день',wxNowT:'Сейчас',wxFeels:t=>`ощущается ${t}°`,wxToday:'Сегодня',wxTomorrow:'Завтра',wxWindNow:v=>`ветер ${v} км/ч`});
Object.assign(I18N.az,{
  wxTitle:'Oyun günlərində hava',wxSub:'Əmircan · bazar günləri və bayram günləri · proqnoz hər 15 dəqiqədən bir avtomatik yenilənir',
  wxGood:'Hava uyğundur',wxRisk:'Sual altındadır',wxBad:'Hava uyğun deyil',wxWait:'Oyunun təsdiqi gözlənilir',wxBest:'Ən yaxşı gün',wxFar:'8+ günlük proqnoz, dəyişə bilər',
  wxRain:mm=>`yağış ${mm} mm`,wxNoRain:'yağışsız',wxProb:p=>`yağış ehtimalı ${p}%`,wxStorm:'ildırım',wxWet:mm=>`oyundan əvvəl yağış ${mm} mm — meydança yaş ola bilər`,
  wxWind:v=>`külək ${v} km/saata qədər`,wxCold:t=>`soyuq: ${t}°`,wxKmh:'km/saat',wxCopy:'WhatsApp üçün kopyala',wxSet:'Oyun təyin et',wxGame:t=>`Oyun təyin olunub · ${t}`,
  wxErr:'Hava proqnozunu yükləmək alınmadı',wxUpd:t=>`${t}-da yeniləndi`,wxNow:'hazırda yağış yağır',wxRefresh:'Yenilə',wxSrc:'Proqnoz: Open-Meteo.com',wxHead:t=>`hava (Əmircan), ${t}`,wxNone:'Yaxın 16 gündə oyun günü yoxdur'
});
Object.assign(I18N.az,{wxTitle2:'Əmircanda hava',wxSub2:'oyun günləri seçilib · proqnoz hər 15 dəqiqədən bir yenilənir',wxGameDay:'Oyun günü',wxNowT:'İndi',wxFeels:t=>`hiss olunur ${t}°`,wxToday:'Bu gün',wxTomorrow:'Sabah',wxWindNow:v=>`külək ${v} km/saat`});
Object.assign(I18N.en,{
  wxTitle:'Weather on game days',wxSub:'Amirajan · Sundays and holidays · forecast refreshes automatically every 15 minutes',
  wxGood:'Playable weather',wxRisk:'Doubtful',wxBad:'Unplayable weather',wxWait:'Awaiting game confirmation',wxBest:'Best day',wxFar:'8+ days out, may change',
  wxRain:mm=>`rain ${mm} mm`,wxNoRain:'dry',wxProb:p=>`${p}% chance of rain`,wxStorm:'thunderstorm',wxWet:mm=>`${mm} mm of rain before the game — field may be wet`,
  wxWind:v=>`gusts up to ${v} km/h`,wxCold:t=>`cold: ${t}°`,wxKmh:'km/h',wxCopy:'Copy for WhatsApp',wxSet:'Schedule a game',wxGame:t=>`Game set · ${t}`,
  wxErr:'Could not load the weather forecast',wxUpd:t=>`updated at ${t}`,wxNow:'raining right now',wxRefresh:'Refresh',wxSrc:'Forecast: Open-Meteo.com',wxHead:t=>`weather (Amirajan), ${t}`,wxNone:'No game days in the next 16 days'
});

Object.assign(I18N.en,{wxTitle2:'Weather in Amirajan',wxSub2:'game days highlighted · forecast refreshes every 15 minutes',wxGameDay:'Game day',wxNowT:'Now',wxFeels:t=>`feels like ${t}°`,wxToday:'Today',wxTomorrow:'Tomorrow',wxWindNow:v=>`wind ${v} km/h`});
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
function load(force){
  if(W.busy) return W.busy;
  W.busy=(async()=>{
    if(!W.cal) W.cal=await fetch('data/calendar.json?v=202611070315',{cache:'no-cache'}).then(r=>r.json());
    let c=null; try{ c=JSON.parse(localStorage.getItem(CACHE)); }catch(e){}
    if(!force&&c&&Date.now()-c.at<TTL&&c.data&&c.data.hourly&&c.data.hourly.relative_humidity_2m&&c.data.daily&&c.data.daily.precipitation_sum){ W.data=c.data; W.at=c.at; return; }
    const p=W.cal.place||{lat:40.4306275,lon:49.9843899};
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}`+
      `&hourly=temperature_2m,precipitation,precipitation_probability,weather_code,wind_gusts_10m,relative_humidity_2m,wind_speed_10m`+
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max`+
      `&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m`+
      `&timezone=Asia%2FBaku&forecast_days=16`;
    const r=await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status);
    W.data=await r.json(); W.err=false; W.at=Date.now();
    try{ localStorage.setItem(CACHE,JSON.stringify({at:W.at,data:W.data})); }catch(e){}
  })().catch(e=>{ console.warn('[weather]',e); W.err=true; if(c0()) W.data=c0(); }).finally(()=>{ W.busy=null; });
  return W.busy;
}
function c0(){ try{ const c=JSON.parse(localStorage.getItem(CACHE)); if(c&&c.at) W.at=c.at; return c&&c.data; }catch(e){ return null; } }
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
  // сегодня и завтра прогноз точнее, поэтому и строже: даже небольшой дождь или вероятность 30%+ — уже «под вопросом»
  const days=(new Date(ymd)-new Date(bakuToday()))/864e5, near=days<=1;
  const C=W.data.current||{}, nowRain=days===0&&bakuHour()<sh+hours&&((C.precipitation||0)>0||((C.weather_code||0)>=51&&(C.weather_code||0)<=99));
  const pRisk=near?30:40, pBad=near?60:80, rRisk=near?0.1:0.2, rBad=near?0.5:1;
  const bad=storm||rain>=rBad||(prob!=null&&prob>=pBad)||before>=6||gust>=75||(nowRain&&bakuHour()>=sh-2);
  const risk=!bad&&(rain>=rRisk||(prob!=null&&prob>=pRisk)||before>=(near?1:2)||gust>=55||(tmin!=null&&tmin<3)||nowRain);
  const why=[], note=[];
  if(nowRain){ why.push(T('wxNow')); note.push(T('wxNow')); }
  if(storm){ why.push(T('wxStorm')); note.push(T('wxStorm')); }
  if(rain>=rRisk) why.push(T('wxRain')(rain));
  if(prob!=null&&prob>=pRisk) why.push(T('wxProb')(prob));
  if(before>=(near?1:2)){ why.push(T('wxWet')(before)); note.push(T('wxWet')(before)); }
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
// обычный прогноз на каждый день, игровые дни (воскресенья, праздники, назначенные игры) — крупной карточкой с вердиктом
const WD_AZ_S=['B.','B.e.','Ç.a.','Ç.','C.a.','C.','Ş.'];
function shortDay(ymd,i){
  if(i===0) return T('wxToday'); if(i===1) return T('wxTomorrow');
  const d=new Date(ymd+'T12:00:00Z');
  if(LANG==='az') return WD_AZ_S[d.getUTCDay()];
  const w=d.toLocaleDateString(LOCALE[LANG],{timeZone:'UTC',weekday:'short'}); return w[0].toUpperCase()+w.slice(1).replace('.','');
}
const shortDate=ymd=>{ const d=new Date(ymd+'T12:00:00Z'); return LANG==='az'?`${d.getUTCDate()} ${AZ_M[d.getUTCMonth()].slice(0,3)}`:d.toLocaleDateString(LOCALE[LANG],{timeZone:'UTC',day:'numeric',month:'short'}).replace('.',''); };
function days(n){
  const D=(W.data&&W.data.daily)||{}, today=bakuToday(), out=[];
  for(let i=0;i<n;i++){
    const ymd=addDays(today,i), k=(D.time||[]).indexOf(ymd); if(k<0) continue;
    const per=periodOf(ymd), isGame=wday(ymd)===0||!!per||eventsOn(ymd).length>0;
    let g=null; if(isGame){ g=evalDay(ymd); if(g){ g.period=per; if(i===0&&bakuHour()>=+g.end.slice(0,2)) g.past=true; } }
    out.push({ymd,i,code:D.weather_code[k],max:Math.round(D.temperature_2m_max[k]),min:Math.round(D.temperature_2m_min[k]),
      prob:(D.precipitation_probability_max||[])[k],sum:r1((D.precipitation_sum||[])[k]||0),g});
  }
  const best=new Set(candidates().filter(e=>e.best).map(e=>e.ymd)); out.forEach(d=>{ if(d.g&&best.has(d.ymd)) d.g.best=true; });
  return out;
}
function dayTile(d){
  const rain=d.prob!=null?`<em class="${d.prob>=50?'hi':''}">☔ ${d.prob}%</em>`:'';
  if(!d.g||d.g.past) return `<div class="wd ${d.i===0?'today':''}"><b>${shortDay(d.ymd,d.i)}</b><span class="wd-dt">${shortDate(d.ymd)}</span>
    <span class="wd-ic">${icon(d.code)}</span><span class="wd-t">${d.max}°<i>${d.min}°</i></span>${rain}</div>`;
  const e=d.g, admin=window.CL&&CL.isAdmin&&CL.isAdmin();
  const det=[`${e.start}–${e.end}`, e.rain>=0.1?`${e.rain} mm`:T('wxNoRain')];
  if(e.prob!=null) det.push(`☔ ${e.prob}%`);
  det.push(`💨 ${e.gust} ${T('wxKmh')}`);
  return `<div class="wd wd-game ${e.v} ${e.best?'best':''} ${d.i===0?'today':''}">
    <div class="wd-tag">⚾ ${e.period?esc(e.period.name[LANG]||e.period.name.az):T('wxGameDay')}${e.best?` · ★ ${T('wxBest')}`:''}</div>
    <div class="wd-gh"><div><b>${shortDay(d.ymd,d.i)}</b><span class="wd-dt">${shortDate(d.ymd)}</span></div>
      <span class="wd-ic">${icon(d.code)}</span><span class="wd-t">${d.max}°<i>${d.min}°</i></span></div>
    <div class="wx-v"><i></i>${T(VL[e.v])}</div>
    <div class="wx-d">${det.join(' · ')}</div>
    ${e.note.length?`<div class="wx-why">${e.note.join(' · ')}</div>`:''}
    ${e.far?`<div class="wx-far">${T('wxFar')}</div>`:''}
    ${e.ev?`<div class="wx-ev">📅 ${T('wxGame')(e.start)}</div>`:`<div class="wx-wait">⏳ ${T('wxWait')}</div>${admin&&e.v!=='bad'?`<button class="btn sm wx-set" onclick="WX.setGame('${e.ymd}')">+ ${T('wxSet')}</button>`:''}`}
  </div>`;
}
function nowBox(){
  const c=W.data&&W.data.current; if(!c||c.temperature_2m==null) return '';
  return `<div class="wx-now"><span class="wx-now-l">${T('wxNowT')}</span><span class="wx-now-ic">${icon(c.weather_code||0)}</span><b>${Math.round(c.temperature_2m)}°</b>
    <span class="muted">${c.apparent_temperature!=null?T('wxFeels')(Math.round(c.apparent_temperature))+' · ':''}${c.wind_speed_10m!=null?T('wxWindNow')(Math.round(c.wind_speed_10m)):''}</span></div>`;
}
/* ---------- новый вид (25.11.2026): как погода в Google + карточки игровых дней ---------- */
Object.assign(I18N.ru,{gwLoc:'Амирджан',gwHava:'Погода',gwProb:'Вероятность осадков',gwHum:'Влажность',gwWind:'Ветер',gwT:'Температура',gwP:'Осадки',gwW:'Ветер',
  gdTitle:'Игровой день',gdWait:'Ждём подтверждения',gdOk:'Игра подтверждена',gdNone:'В ближайшие дни игровых дней нет',
  gwC:{0:'Ясно',1:'Преимущественно ясно',2:'Переменная облачность',3:'Облачно',45:'Туман',51:'Морось',61:'Дождь',66:'Ледяной дождь',71:'Снег',80:'Ливень',85:'Снегопад',95:'Гроза'}});
Object.assign(I18N.az,{gwLoc:'Əmircan',gwHava:'Hava',gwProb:'Yağış ehtimalı',gwHum:'Rütubət',gwWind:'Külək',gwT:'Temperatur',gwP:'Yağış ehtimalı',gwW:'Külək',
  gdTitle:'Oyun günü',gdWait:'Təsdiq gözlənilir',gdOk:'Oyun təsdiqlənib',gdNone:'Yaxın günlərdə oyun günü yoxdur',
  gwC:{0:'Açıq',1:'Əsasən açıq',2:'Dəyişkən buludlu',3:'Buludlu',45:'Duman',51:'Çiskin',61:'Yağış',66:'Buzlu yağış',71:'Qar',80:'Leysan',85:'Qar yağır',95:'İldırım'}});
Object.assign(I18N.en,{gwLoc:'Amirjan',gwHava:'Weather',gwProb:'Chance of rain',gwHum:'Humidity',gwWind:'Wind',gwT:'Temperature',gwP:'Precipitation',gwW:'Wind',
  gdTitle:'Game day',gdWait:'Awaiting confirmation',gdOk:'Game confirmed',gdNone:'No game days coming up',
  gwC:{0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Cloudy',45:'Fog',51:'Drizzle',61:'Rain',66:'Freezing rain',71:'Snow',80:'Showers',85:'Snow showers',95:'Thunderstorm'}});
const GW={day:0,tab:'t'};
const condTxt=c=>{ const M=T('gwC'), ks=Object.keys(M).map(Number).sort((a,b)=>b-a); for(const k of ks) if(c>=k) return M[k]; return M[0]; };
const wdLong=ymd=>{ const d=new Date(ymd+'T12:00:00Z'); if(LANG==='az') return WD_AZ[d.getUTCDay()].toLowerCase(); return d.toLocaleDateString(LOCALE[LANG],{timeZone:'UTC',weekday:'long'}); };
const wdShort=ymd=>{ const d=new Date(ymd+'T12:00:00Z'); if(LANG==='az') return WD_AZ_S[d.getUTCDay()]; const w=d.toLocaleDateString(LOCALE[LANG],{timeZone:'UTC',weekday:'short'}).replace('.',''); return w[0].toUpperCase()+w.slice(1); };
function hourIdx(ymd,h){ const H=W.data.hourly; return H.time.indexOf(`${ymd}T${pad(h)}:00`); }
function gwState(L){
  const d=L[Math.min(GW.day,L.length-1)], H=W.data.hourly, C=W.data.current||{}, now=d.i===0;
  const h=now?bakuHour():12, k=hourIdx(d.ymd,h);
  const v=(a,f)=>k>=0&&a?a[k]:f;
  return {d,h,
    temp:Math.round(now&&C.temperature_2m!=null?C.temperature_2m:v(H.temperature_2m,d.max)),
    code:now&&C.weather_code!=null?C.weather_code:v(H.weather_code,d.code),
    prob:v(H.precipitation_probability,d.prob??0)??0,
    hum:Math.round(now&&C.relative_humidity_2m!=null?C.relative_humidity_2m:v(H.relative_humidity_2m,null)??0),
    wind:Math.round(now&&C.wind_speed_10m!=null?C.wind_speed_10m:v(H.wind_speed_10m,0)??0)};
}
function gwChart(s){
  const H=W.data.hourly, start=s.d.i===0?bakuHour():2, pts=[];
  for(let j=0;j<8;j++){ const hh=start+j*3, base=hourIdx(s.d.ymd,0); if(base<0) break; const k=base+hh; if(k>=H.time.length) break;
    const val=GW.tab==='t'?H.temperature_2m[k]:GW.tab==='p'?(H.precipitation_probability||[])[k]:(H.wind_speed_10m||[])[k];
    pts.push({lab:H.time[k].slice(11,16),v:Math.round(val??0)}); }
  if(!pts.length) return '';
  const Wd=640,Hh=120,px=20,top=26,bot=30, vs=pts.map(p=>p.v);
  let mn=Math.min(...vs), mx=Math.max(...vs); if(GW.tab!=='t'){ mn=0; mx=Math.max(mx,GW.tab==='p'?100:20); } if(mx===mn) mx=mn+1;
  const X=i=>px+i*(Wd-2*px)/(pts.length-1||1), Y=v=>top+(Hh-top-bot)*(1-(v-mn)/(mx-mn));
  const col=GW.tab==='t'?'#F4B400':GW.tab==='p'?'#4285F4':'#7E8C9E', fill=GW.tab==='t'?'rgba(244,180,0,.18)':GW.tab==='p'?'rgba(66,133,244,.16)':'rgba(126,140,158,.14)';
  const line=pts.map((p,i)=>`${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
  const unit=GW.tab==='p'?'%':'';
  return `<svg class="gw-svg" viewBox="0 0 ${Wd} ${Hh}" preserveAspectRatio="none" aria-hidden="true">
    <polygon points="${X(0)},${Hh-bot} ${line} ${X(pts.length-1)},${Hh-bot}" fill="${fill}"/><polyline points="${line}" fill="none" stroke="${col}" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>
    <div class="gw-lbl">${pts.map((p,i)=>`<span style="left:${(X(i)/Wd*100).toFixed(2)}%;top:${(Y(p.v)/Hh*100-18).toFixed(1)}%" class="${i===0?'b':''}">${p.v}${unit}</span>`).join('')}</div>
    <div class="gw-hrs">${pts.map((p,i)=>`<span style="left:${(X(i)/Wd*100).toFixed(2)}%">${p.lab}</span>`).join('')}</div>`;
}
function gwCard(L){
  if(!L.length) return '';
  const s=gwState(L), now=s.d.i===0;
  const gd=d=>d.g&&!d.g.past;
  return `<div class="card gw">
    <div class="gw-top"><span class="gw-loc"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${T('gwLoc')}</span>
      ${W.at?`<button class="gw-upd" onclick="WX.refresh()" title="${T('wxRefresh')}">↻ ${new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Baku',hour:'2-digit',minute:'2-digit'}).format(new Date(W.at))}</button>`:''}</div>
    <div class="gw-main"><div class="gw-now"><span class="gw-ic">${icon(s.code)}</span><b class="gw-t">${s.temp}</b><span class="gw-u">°C</span>
      <div class="gw-meta"><span>${T('gwProb')}: <b>${s.prob}%</b></span><span>${T('gwHum')}: <b>${s.hum}%</b></span><span>${T('gwWind')}: <b>${s.wind} ${T('wxKmh')}</b></span></div></div>
      <div class="gw-when"><b>${T('gwHava')}</b><span>${wdLong(s.d.ymd)} ${pad(s.h)}:00</span><span>${condTxt(s.code)}</span></div></div>
    <div class="gw-tabs">${[['t','gwT'],['p','gwP'],['w','gwW']].map(([k,l])=>`<button class="${GW.tab===k?'on':''}" onclick="WX.tab('${k}')">${T(l)}</button>`).join('')}</div>
    <div class="gw-chart">${gwChart(s)}</div>
    <div class="gw-days">${L.map((d,j)=>`<button class="gw-day ${j===GW.day?'on':''} ${gd(d)?(d.g.ev?'gd-ok':'gd-wait'):''}" onclick="WX.day(${j})">
      <span class="gw-dn">${j===0?T('wxToday'):wdShort(d.ymd)}</span>${gd(d)?'<i class="gw-ball">⚾</i>':''}<span class="gw-di">${icon(d.code)}</span><span class="gw-dt"><b>${d.max}°</b> ${d.min}°</span></button>`).join('')}</div>
  </div>`;
}
// анимированные песочные часы для «ждём подтверждения» (25.11.2026): своё SVG + CSS, без внешних библиотек
const SAND=`<span class="sand" aria-hidden="true"><svg viewBox="0 0 40 56">
  <defs><clipPath id="sandTop"><path d="M10 9h20c0 8-6 12-9 16h-2c-3-4-9-8-9-16z"/></clipPath><clipPath id="sandBot"><path d="M19 31h2c3 4 9 8 9 16H10c0-8 6-12 9-16z"/></clipPath></defs>
  <rect x="6" y="3" width="28" height="5" rx="2.5" class="sd-cap"/><rect x="6" y="48" width="28" height="5" rx="2.5" class="sd-cap"/>
  <path d="M9 8h22c0 10-7 14-9.5 20C24 34 31 38 31 48H9c0-10 7-14 9.5-20C16 22 9 18 9 8z" class="sd-glass"/>
  <g clip-path="url(#sandTop)"><rect x="8" y="9" width="24" height="17" class="sd-sand sd-top"/></g>
  <g clip-path="url(#sandBot)"><rect x="8" y="31" width="24" height="17" class="sd-sand sd-bot"/></g>
  <rect x="19.2" y="25" width="1.6" height="22" rx=".8" class="sd-sand sd-flow"/>
</svg></span>`;
function gdCard(d){
  const e=d.g, admin=window.CL&&CL.isAdmin&&CL.isAdmin(), ok=e.ev;
  const det=[]; if(e.prob!=null) det.push(`☔ ${e.prob}%`); det.push(`💨 ${e.gust} ${T('wxKmh')}`); if(e.rain>=0.1) det.push(`${e.rain} mm`);
  return `<div class="gd ${ok?'ok':'wait'} ${e.v}" onclick="WX.day(${GW._map&&GW._map[d.ymd]!=null?GW._map[d.ymd]:0})">
    <div class="gd-h"><span class="gd-ball">⚾</span>${e.period?esc(e.period.name[LANG]||e.period.name.az):T('gdTitle')}${e.best?` <em>★ ${T('wxBest')}</em>`:''}</div>
    <div class="gd-r"><div class="gd-dt"><b>${wdShort(d.ymd)} ${shortDate(d.ymd)}</b><span>🕗 ${e.start}–${e.end}</span></div><div class="gd-w"><span>${icon(e.code)}</span>${e.tmax??d.max}°</div></div>
    <div class="gd-v"><i></i>${T(VL[e.v])}</div>
    <div class="gd-d">${det.join(' · ')}${e.note.length?` · ${e.note.join(' · ')}`:''}${e.far?` · ${T('wxFar')}`:''}</div>
    <div class="gd-st">${ok?`✅ ${T('gdOk')}`:`${SAND}<span>${T('gdWait')}</span>`}</div>
    ${!ok&&admin&&e.v!=='bad'?`<button class="btn sm wx-set" onclick="event.stopPropagation();WX.setGame('${e.ymd}')">+ ${T('wxSet')}</button>`:''}
  </div>`;
}
function section(compact){
  const L=W.data?days(compact?8:16):[];
  GW._map={}; L.forEach((d,j)=>GW._map[d.ymd]=j);
  if(GW.day>=L.length) GW.day=0;
  let body;
  if(!W.data) body=W.err?`<div class="card empty" style="margin-top:0">${T('wxErr')}</div>`:`<div class="loading" style="padding:20px">…</div>`;
  else { const G2=L.filter(d=>d.g&&!d.g.past);
    body=`<div class="gw-wrap">${gwCard(L)}<div class="gd-list">${G2.length?G2.map(gdCard).join(''):`<div class="card empty gd-none">${T('gdNone')}</div>`}</div></div>`; }
  const hasGame=L.some(d=>d.g&&!d.g.past);
  return `<div class="section-title wx-title"><h2>${T('wxTitle2')}</h2>${hasGame?`<button class="btn sm" onclick="WX.copy()">${T('wxCopy')}</button>`:''}</div>${body}
    <p class="wx-src muted small"><a href="https://open-meteo.com/" target="_blank" rel="noopener">${T('wxSrc')}</a></p>`;
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
  return `<span class="wx-chip ${e.v}" title="${esc(e.why.join(' · ')||T('wxNoRain'))}">${icon(e.code)} ${t}° · ${T(VL[e.v])}</span>`;
}
function refresh(){ const b=document.querySelector('.wx-ref'); if(b) b.textContent='…'; return load(true).then(draw); }
window.WX={copy,setGame,chip,candidates,drawSec,refresh,ready:()=>!!W.data,day:j=>{ GW.day=j; drawSec(); },tab:k=>{ GW.tab=k; drawSec(); }};

const _route=route; route=function(){
  _route();
  const h=(location.hash||'').slice(1), page=h.split('-')[0];
  const FR=window.FEATURE_ROUTES||{}, isHome=!['player','game','games'].includes(page)&&!FR[page];
  if(!(isHome||page==='games')||!S.league) return;
  // с 11.11.2026 блок погоды видят все (и гости); «+ Назначить игру» — только админу, «буду / не буду» в карточке игры — только игрокам
  const A=app(), sec=`<div id="wx-sec" class="wx-sec" data-compact="${isHome?1:0}">${section(isHome)}</div>`;
  const anchor=isHome?document.getElementById('cl-next'):document.getElementById('cl-sched');
  if(anchor) anchor.insertAdjacentHTML('afterend',sec); else A.insertAdjacentHTML('afterbegin',sec);
  let at=0; try{ at=(JSON.parse(localStorage.getItem(CACHE)||'{}').at)||0; }catch(e){}
  if(!W.data||Date.now()-at>TTL) load().then(draw);
};
load().then(draw);
// автообновление: пока сайт открыт — раз в 15 минут; при возвращении в сайт / приложение — сразу, если данные старше 10 минут
setInterval(()=>{ if(document.visibilityState==='visible') load(true).then(draw); },TTL);
const stale=()=>!W.at||Date.now()-W.at>10*60e3;
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'&&stale()) load(true).then(draw); });
window.addEventListener('pageshow',()=>{ if(stale()) load(true).then(draw); });
window.addEventListener('online',()=>load(true).then(draw));
})();
