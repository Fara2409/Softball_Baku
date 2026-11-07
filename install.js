/* «Открой как приложение»: кнопка в footer, баннер на телефоне и гайд для iPhone и Android.
   Не показывается, если сайт уже открыт как приложение (с экрана «Домой»). */
(function(){
const TX={
 ru:{btn:'Открой как приложение',banner:'Добавь Softball Baku на экран телефона',bannerGo:'Как?',
  title:'Softball Baku как приложение',sub:'Иконка на экране телефона, сайт открывается на весь экран, без адресной строки. Ничего скачивать из магазина не нужно.',
  install:'Установить',installHint:'Телефон сам предложит добавить иконку.',
  ios:[['Открой сайт в <b>Safari</b>','Если ссылка открылась внутри WhatsApp, нажми ⋯ или значок компаса и выбери «Открыть в Safari».'],
       ['Нажми <b>«Поделиться»</b> {share}','Кнопка внизу экрана (на iPad — сверху).'],
       ['Выбери <b>«На экран „Домой“»</b> {plus}','Если пункта не видно, пролистай список вниз.'],
       ['Нажми <b>«Добавить»</b>','Иконка Softball Baku появится на экране телефона.']],
  and:[['Открой сайт в <b>Chrome</b>','Если ссылка открылась внутри WhatsApp, нажми ⋮ и выбери «Открыть в Chrome».'],
       ['Нажми <b>меню</b> {dots}','Три точки в правом верхнем углу.'],
       ['Выбери <b>«Добавить на главный экран»</b> или <b>«Установить приложение»</b>','Название пункта зависит от версии Chrome.'],
       ['Нажми <b>«Установить»</b>','Иконка Softball Baku появится на экране телефона.']],
  done:'Готово! Теперь открывай Softball Baku с иконки.',already:'Сайт уже открыт как приложение 👍',close:'Понятно'},
 az:{btn:'Tətbiq kimi aç',banner:'Softball Baku-nu telefon ekranına əlavə et',bannerGo:'Necə?',
  title:'Softball Baku tətbiq kimi',sub:'Telefon ekranında ikon, sayt tam ekranda açılır, ünvan sətri olmadan. Mağazadan heç nə yükləmək lazım deyil.',
  install:'Quraşdır',installHint:'Telefon özü ikon əlavə etməyi təklif edəcək.',
  ios:[['Saytı <b>Safari</b>-də aç','Link WhatsApp-ın içində açılıbsa, ⋯ və ya kompas işarəsinə bas və «Safari-də aç» seç.'],
       ['<b>«Paylaş»</b> düyməsinə bas {share}','Düymə ekranın aşağısındadır (iPad-də — yuxarıda).'],
       ['<b>«Əsas ekrana əlavə et»</b> seç {plus}','Görünmürsə, siyahını aşağı sürüşdür.'],
       ['<b>«Əlavə et»</b> düyməsinə bas','Softball Baku ikonu telefon ekranında görünəcək.']],
  and:[['Saytı <b>Chrome</b>-da aç','Link WhatsApp-ın içində açılıbsa, ⋮ bas və «Chrome-da aç» seç.'],
       ['<b>Menyuya</b> bas {dots}','Sağ yuxarı küncdə üç nöqtə.'],
       ['<b>«Əsas ekrana əlavə et»</b> və ya <b>«Tətbiqi quraşdır»</b> seç','Bəndin adı Chrome versiyasından asılıdır.'],
       ['<b>«Quraşdır»</b> düyməsinə bas','Softball Baku ikonu telefon ekranında görünəcək.']],
  done:'Hazırdır! İndi Softball Baku-nu ikondan aç.',already:'Sayt artıq tətbiq kimi açılıb 👍',close:'Aydındır'},
 en:{btn:'Open as an app',banner:'Add Softball Baku to your home screen',bannerGo:'How?',
  title:'Softball Baku as an app',sub:'An icon on your phone, full screen, no address bar. Nothing to download from a store.',
  install:'Install',installHint:'Your phone will offer to add the icon.',
  ios:[['Open the site in <b>Safari</b>','If the link opened inside WhatsApp, tap ⋯ or the compass icon and choose “Open in Safari”.'],
       ['Tap <b>Share</b> {share}','The button at the bottom of the screen (at the top on iPad).'],
       ['Choose <b>Add to Home Screen</b> {plus}','If you don’t see it, scroll the list down.'],
       ['Tap <b>Add</b>','The Softball Baku icon appears on your home screen.']],
  and:[['Open the site in <b>Chrome</b>','If the link opened inside WhatsApp, tap ⋮ and choose “Open in Chrome”.'],
       ['Tap the <b>menu</b> {dots}','Three dots in the top right corner.'],
       ['Choose <b>Add to Home screen</b> or <b>Install app</b>','The wording depends on your Chrome version.'],
       ['Tap <b>Install</b>','The Softball Baku icon appears on your home screen.']],
  done:'Done! Open Softball Baku from the icon.',already:'The site is already open as an app 👍',close:'Got it'}
};
const tx=()=>TX[(typeof LANG!=='undefined'&&TX[LANG])?LANG:'az'];
const ICO={
 share:'<svg viewBox="0 0 24 24" class="ia-ic"><path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11H5v10h14V11h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
 plus:'<svg viewBox="0 0 24 24" class="ia-ic"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 dots:'<svg viewBox="0 0 24 24" class="ia-ic"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>',
 phone:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 18.5h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 apple:'<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9s-2-.9-3.3-.9C6.1 7 4.5 8 3.6 9.5c-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.2-1.2 3-2.5 1-1.4 1.4-2.8 1.4-2.8s-2.6-1-2.6-4.3zM14 5.3c.7-.8 1.2-2 1-3.2-1 0-2.3.7-3 1.5-.7.7-1.2 1.9-1.1 3.1 1.2.1 2.4-.6 3.1-1.4z"/></svg>',
 android:'<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17.6 9.5l1.6-2.8a.4.4 0 00-.7-.4l-1.6 2.8a9.6 9.6 0 00-9.8 0L5.5 6.3a.4.4 0 00-.7.4l1.6 2.8A8.9 8.9 0 002 16.6h20a8.9 8.9 0 00-4.4-7.1zM7.5 14a1 1 0 110-2 1 1 0 010 2zm9 0a1 1 0 110-2 1 1 0 010 2z"/></svg>'
};
const ua=navigator.userAgent||'';
const isIOS=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isAndroid=/Android/.test(ua);
const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;});
window.addEventListener('appinstalled',()=>{deferred=null;hideBanner();});

const css=`
.ia-btn{display:inline-flex;align-items:center;gap:8px;margin:12px 0 4px;padding:10px 16px;border-radius:999px;border:1px solid rgba(239,159,39,.55);
 background:linear-gradient(135deg,rgba(239,159,39,.22),rgba(216,90,48,.18));color:var(--text);font-weight:700;font-size:14px;line-height:1.1;font-family:inherit;cursor:pointer;transition:transform .15s,border-color .15s}
.ia-btn:hover{transform:translateY(-1px);border-color:var(--amber)}
.ia-btn svg{color:var(--amber)}
.ia-modal{position:fixed;inset:0;z-index:95;background:rgba(3,8,15,.8);display:flex;align-items:flex-end;justify-content:center;padding:12px}
@media(min-width:640px){.ia-modal{align-items:center}}
.ia-sheet{width:min(440px,100%);max-height:92vh;overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:22px 20px 18px;position:relative;animation:iaUp .22s ease-out}
@keyframes iaUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}
.ia-x{position:absolute;top:10px;right:12px;background:none;border:0;color:var(--muted);font-size:24px;cursor:pointer;line-height:1}
.ia-head{display:flex;gap:14px;align-items:center;margin-bottom:8px}
.ia-head img{width:56px;height:56px;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.4)}
.ia-head h3{margin:0;font-size:19px}
.ia-sub{color:var(--muted);font-size:14px;line-height:1.45;margin:6px 0 14px}
.ia-tabs{display:flex;gap:6px;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:4px;margin-bottom:14px}
.ia-tabs button{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:9px;border:0;border-radius:9px;background:none;color:var(--muted);font-weight:700;font-size:14px;line-height:1.1;font-family:inherit;cursor:pointer}
.ia-tabs button.on{background:var(--panel2);color:var(--text)}
.ia-steps{list-style:none;margin:0;padding:0;counter-reset:s}
.ia-steps li{display:flex;gap:12px;padding:10px 0;border-top:1px solid var(--line)}
.ia-steps li:first-child{border-top:0}
.ia-steps li::before{counter-increment:s;content:counter(s);flex:none;width:28px;height:28px;border-radius:50%;background:var(--amber);color:#1a1205;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px}
.ia-steps b{color:var(--text)}
.ia-steps .t{font-size:15px;line-height:1.35}
.ia-steps .d{color:var(--muted);font-size:13px;line-height:1.4;margin-top:3px}
.ia-ic{width:20px;height:20px;vertical-align:-4px;margin-left:4px;color:var(--amber)}
.ia-native{background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:12px;display:flex;align-items:center;gap:12px}
.ia-native span{color:var(--muted);font-size:13px;flex:1}
.ia-go{padding:10px 18px;border-radius:10px;border:0;background:var(--amber);color:#1a1205;font-weight:800;font-size:14px;line-height:1.1;font-family:inherit;cursor:pointer}
.ia-done{margin-top:12px;padding:10px 12px;border-radius:10px;background:rgba(47,174,102,.12);color:#8fe0b0;font-size:13px}
.ia-ok{width:100%;margin-top:14px;padding:12px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);color:var(--text);font-weight:700;font-size:15px;line-height:1.1;font-family:inherit;cursor:pointer}
.ia-banner{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:10px;padding:10px 10px 10px 14px;
 background:rgba(15,27,45,.97);border:1px solid rgba(239,159,39,.5);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.45);animation:iaUp .25s ease-out;max-width:520px;margin:0 auto}
.ia-banner img{width:34px;height:34px;border-radius:9px}
.ia-banner span{flex:1;font-size:13.5px;font-weight:600;line-height:1.3}
.ia-banner .ia-go{padding:8px 14px}
.ia-banner .ia-bx{background:none;border:0;color:var(--muted);font-size:20px;cursor:pointer;padding:0 4px}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

window.installBtnHTML=()=>standalone()?'':`<button class="ia-btn" type="button" onclick="openInstall()">${ICO.phone}${tx().btn}</button>`;

function steps(list){return `<ol class="ia-steps">${list.map(([t,d])=>`<li><div><div class="t">${t.replace(/\{(\w+)\}/g,(m,k)=>ICO[k]||'')}</div><div class="d">${d}</div></div></li>`).join('')}</ol>`;}
window.openInstall=function(os){
  hideBanner();
  const X=tx(); os=os||(isAndroid?'and':'ios');
  document.querySelector('.ia-modal')?.remove();
  const m=document.createElement('div'); m.className='ia-modal';
  const body=standalone()?`<div class="ia-done">${X.already}</div>`:
    `${deferred&&os==='and'?`<div class="ia-native"><span>${X.installHint}</span><button class="ia-go" data-act="native">${X.install}</button></div>`:''}
     <div class="ia-tabs"><button data-os="ios" class="${os==='ios'?'on':''}">${ICO.apple}iPhone</button><button data-os="and" class="${os==='and'?'on':''}">${ICO.android}Android</button></div>
     ${steps(os==='ios'?X.ios:X.and)}<div class="ia-done">${X.done}</div>`;
  m.innerHTML=`<div class="ia-sheet" role="dialog" aria-modal="true" aria-label="${X.title}"><button class="ia-x" aria-label="×" data-act="close">×</button>
    <div class="ia-head"><img src="icons/icon-192.png" alt=""><h3>${X.title}</h3></div><p class="ia-sub">${X.sub}</p>${body}
    <button class="ia-ok" data-act="close">${X.close}</button></div>`;
  m.addEventListener('click',async e=>{
    const t=e.target.closest('[data-act],[data-os]');
    if(e.target===m||(t&&t.dataset.act==='close')){m.remove();return;}
    if(t&&t.dataset.os){openInstall(t.dataset.os);return;}
    if(t&&t.dataset.act==='native'&&deferred){deferred.prompt();try{await deferred.userChoice;}catch(_){}deferred=null;m.remove();}
  });
  document.body.appendChild(m);
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('.ia-modal')?.remove();});

/* Баннер: только на телефоне, не в режиме приложения, не в демо; после «×» не показывается 30 дней. */
const KEY='ia-banner-hidden';
function hideBanner(){document.querySelector('.ia-banner')?.remove();}
function showBanner(){
  if(standalone()||!(isIOS||isAndroid)||/[?&]demo=1/.test(location.search)) return;
  try{const v=+localStorage.getItem(KEY)||0; if(Date.now()-v<30*864e5) return;}catch(_){}
  if(document.querySelector('.ia-banner,.ia-modal,.cl-modal,.modal')){setTimeout(showBanner,5000);return;}
  if(location.hash==='#live') return;
  const X=tx(), b=document.createElement('div'); b.className='ia-banner';
  b.innerHTML=`<img src="icons/icon-192.png" alt=""><span>${X.banner}</span><button class="ia-go">${X.bannerGo}</button><button class="ia-bx" aria-label="×">×</button>`;
  b.querySelector('.ia-go').onclick=()=>openInstall();
  b.querySelector('.ia-bx').onclick=()=>{try{localStorage.setItem(KEY,Date.now())}catch(_){}hideBanner();};
  document.body.appendChild(b);
}
setTimeout(showBanner,4000);
})();
