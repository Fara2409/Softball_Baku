// Онлайн-трансляция счёта на сайт (Supabase).
// Подключается в scorer/index.html после основного скрипта и ничего в нём не меняет:
// после каждого сохранения игры отправляет «снимок» (счёт, иннинг, ауты, базы, отбивающий,
// последние розыгрыши, статистика) в таблицу live_games. Зрители видят его на сайте: #live.
// Работает, только если на этом телефоне выполнен вход под аккаунтом админа
// (тот же вход, что на сайте; войти можно и прямо здесь, через кнопку внизу справа).
(function(){
'use strict';
const SB_URL='https://walqgchpwehlaqgizwxj.supabase.co';
const SB_KEY='sb_publishable_p4odhSPoZi-rvOKZ9-9Ngg_P6lA9ehM';
const ON_KEY='sbScorer.live';
const ROLE_RU={guest:'гость',player:'игрок',admin:'админ'};
const X={sb:null,user:null,role:null,state:'load',err:'',last:'',lastAt:0,timer:null,retry:null};
let enabled=localStorage.getItem(ON_KEY)!=='0';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hms=t=>new Date(t).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit',second:'2-digit'});

/* ---------- значок ---------- */
const st=document.createElement('style');
st.textContent=`.lvb{flex:none;display:flex;align-items:center;gap:6px;padding:5px 9px;border-radius:10px;font:700 11px/1.15 system-ui,-apple-system,sans-serif;background:#1a1d24;border:1px solid #2c313c;color:#8a93a3;text-align:left;white-space:nowrap}
.lvb small{display:block;font-size:9px;font-weight:600;letter-spacing:.06em;opacity:.7}
.lvb.fx{position:fixed;top:calc(8px + env(safe-area-inset-top));right:10px;z-index:20}
.lvb i{width:8px;height:8px;border-radius:50%;background:#5a6170;flex:none}
.lvb.ok{color:#eef1f5;border-color:#e5484d;background:#2a1416}.lvb.ok i{background:#ff4d4f;animation:bl 1.2s infinite}
.lvb.wait i{background:#ffb020}
.lvb.err{color:#ffb020;border-color:#ffb020}.lvb.err i{background:#ffb020}
.lvp p{margin:6px 0 12px;line-height:1.45}.lvp label{display:block;margin:10px 0 4px;font-size:13px;color:var(--mut)}
.lvp .row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}.lvp .row>*{flex:1}
.lvp .on{background:#2a1416;border-color:#e5484d;color:#fff;font-weight:700}
.lvp .err{color:#ffb020}.lvp a{color:var(--acc)}`;
document.head.appendChild(st);
const pill=document.createElement('button'); pill.className='lvb'; pill.onclick=panel;
// значок живёт в шапке (.sb); шапка перерисовывается при каждом нажатии, поэтому возвращаем его на место
function mount(){const sb=document.querySelector('.sb');if(sb){if(pill.parentNode!==sb)sb.appendChild(pill);pill.classList.remove('fx')}else if(!pill.parentNode){document.body.appendChild(pill);pill.classList.add('fx')}}
new MutationObserver(mount).observe(document.getElementById('app'),{childList:true}); mount();
function badge(){
  let cls='',txt='';
  if(X.state==='load'){ txt='…'; }
  else if(X.state==='nosdk'){ txt='нет связи'; cls='err'; }
  else if(!X.user){ txt='войти'; }
  else if(X.role!=='admin'){ txt='нет прав'; }
  else if(!enabled){ txt='выкл'; }
  else if(X.state==='err'){ txt='нет сети'; cls='err'; }
  else if(X.state==='send'){ txt='отправка…'; cls='ok wait'; }
  else if(X.lastAt){ txt='В ЭФИРЕ'; cls='ok'; }
  else { txt='готов'; cls='ok'; }
  pill.className='lvb '+cls+(pill.parentNode===document.body?' fx':''); pill.title='Онлайн: '+txt; pill.innerHTML=`<i></i><span><small>ОНЛАЙН</small>${txt}</span>`;
}

/* ---------- панель ---------- */
function panel(){
  let h=`<div class="lvp"><h3>Онлайн-счёт на сайте</h3>`;
  if(X.state==='nosdk') h+=`<p class="err">Не удалось подключиться к серверу. Проверьте интернет и перезагрузите страницу.</p>`;
  else if(!X.user) h+=`<p>Войдите под аккаунтом админа сайта — счёт будет сразу появляться у зрителей.</p>
    <label>Эл. почта</label><input id="lv-em" type="email" autocomplete="email" inputmode="email">
    <label>Пароль</label><input id="lv-pw" type="password" autocomplete="current-password">
    <p class="err" id="lv-er"></p><div class="row"><button class="pri" onclick="LIVE.login()">Войти</button><button onclick="closeM()">Закрыть</button></div>`;
  else if(X.role!=='admin') h+=`<p>Вы вошли как <b>${e(X.user.email)}</b> (${ROLE_RU[X.role]||'гость'}). Транслировать счёт может только админ.</p>
    <div class="row"><button onclick="LIVE.logout()">Выйти</button><button onclick="closeM()">Закрыть</button></div>`;
  else h+=`<p>Вход: <b>${e(X.user.email)}</b> (админ).</p>
    <button class="${enabled?'on':''}" style="width:100%;padding:14px" onclick="LIVE.toggle()">${enabled?'● Трансляция включена':'Трансляция выключена — включить'}</button>
    <p class="${X.state==='err'?'err':'muted'}">${X.state==='err'?`Нет связи: ${e(X.err)}. Повторю автоматически.`:X.lastAt?`Последнее обновление: ${hms(X.lastAt)}`:S&&S.started?'Счёт отправится после следующего действия.':'Начните игру — счёт пойдёт на сайт автоматически.'}</p>
    <div class="row"><button onclick="LIVE.push(true)" ${enabled&&S&&S.started?'':'disabled'}>Отправить сейчас</button><button onclick="window.open('../#live','_blank')">Страница зрителей</button></div>
    <div class="row"><button onclick="LIVE.logout()">Выйти</button><button onclick="closeM()">Закрыть</button></div>`;
  modal(h+'</div>');
}

/* ---------- снимок игры ---------- */
function snapshot(){
  if(typeof S==='undefined'||!S||!S.started||typeof replay!=='function') return null;
  const g=replay(), k=g.half%2?'B':'A', Lu=S.teams[k].lineup;
  const batter=Lu.length?Lu[g.idx[k]%Lu.length]:null, next=Lu.length>1?Lu[(g.idx[k]+1)%Lu.length]:null;
  const plays=[];
  S.events.forEach((ev,i)=>{ if(ev.type==='mark') return; const s=g.steps[i]||{};
    plays.push({type:ev.type,result:ev.result||null,player:ev.batter||ev.runner||null,runs:s.runsOnPlay||0,inning:s.inning,top:s.top,score:s.score,t:ev.t}); });
  return {id:S.id,status:g.over?'final':'live',data:{v:1,venue:S.venue,
    teams:{A:{name:S.teams.A.name,color:S.teams.A.color},B:{name:S.teams.B.name,color:S.teams.B.color}},
    score:{A:g.runs.A,B:g.runs.B},line:{A:g.line.A,B:g.line.B},inning:Math.floor(g.half/2)+1,top:g.half%2===0,outs:g.outs,
    bases:g.bases,batting:k,batter,next,over:!!g.over,plays:plays.slice(-15),
    lineup:{A:S.teams.A.lineup.slice(),B:S.teams.B.lineup.slice()},box:Object.values(g.box)}};
}
function schedule(ms){ clearTimeout(X.timer); X.timer=setTimeout(()=>push(false),ms==null?900:ms); }
async function push(force){
  if(!X.sb||!X.user||X.role!=='admin'||!enabled) return;
  const snap=snapshot(); if(!snap) return;
  const body=JSON.stringify(snap); if(!force&&body===X.last) return;
  X.state='send'; badge();
  const {error}=await X.sb.from('live_games').upsert({id:snap.id,status:snap.status,data:snap.data,updated_at:new Date().toISOString(),updated_by:X.user.id});
  clearTimeout(X.retry);
  if(error){ X.state='err'; X.err=error.message||String(error); badge(); X.retry=setTimeout(()=>push(true),10000); }
  else { X.state='ok'; X.last=body; X.lastAt=Date.now(); badge(); }
  if(document.querySelector('.lvp')) panel();
}

/* ---------- вход ---------- */
async function refresh(){
  const {data}=await X.sb.auth.getSession(); X.user=data&&data.session?data.session.user:null; X.role=null;
  if(X.user){ const r=await X.sb.from('profiles').select('role').eq('id',X.user.id).maybeSingle(); X.role=r.data?r.data.role:null; }
  X.state='ok'; badge();
}
async function login(){
  const em=(document.getElementById('lv-em').value||'').trim(), pw=document.getElementById('lv-pw').value, er=document.getElementById('lv-er');
  er.textContent='';
  const {error}=await X.sb.auth.signInWithPassword({email:em,password:pw});
  if(error){ er.textContent=/invalid/i.test(error.message)?'Неверная почта или пароль':error.message; return; }
  await refresh(); panel(); if(X.role==='admin'&&S&&S.started) push(true);
}
async function logout(){ await X.sb.auth.signOut(); await refresh(); panel(); }
function toggle(){ enabled=!enabled; localStorage.setItem(ON_KEY,enabled?'1':'0'); badge(); panel(); if(enabled) push(true); }
window.LIVE={login,logout,toggle,push};

/* ---------- подключение ---------- */
const _save=window.save;
if(typeof _save==='function') window.save=function(){ const r=_save.apply(this,arguments); schedule(); return r; };
window.addEventListener('online',()=>push(true));
function init(){
  X.sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  X.sb.auth.onAuthStateChange(()=>setTimeout(()=>refresh().then(()=>{ if(S&&S.started&&S.id===today()) schedule(300); }),0));
}
badge();
// свежая версия; для старого Safari (iOS 15 и ниже) — проверенная 2.45.4
const src=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4','https://unpkg.com/@supabase/supabase-js@2','https://unpkg.com/@supabase/supabase-js@2.45.4'];
const ok=()=>{ try{ if(!(window.supabase&&window.supabase.createClient)) return false; init(); return true; }catch(e){ console.warn('[live]',e); return false; } };
if(!ok()) (function next(i){
  if(i>=src.length){ X.state='nosdk'; badge(); return; }
  try{ window.supabase=undefined; }catch(e){}
  const sc=document.createElement('script'); sc.src=src[i]; sc.async=true;
  sc.onload=()=>{ if(!ok()) next(i+1); }; sc.onerror=()=>next(i+1); document.head.appendChild(sc);
})(0);
})();
