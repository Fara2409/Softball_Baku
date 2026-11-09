/* Подсказки к показателям: наведение (или касание на телефоне) на заголовок столбца — короткое пояснение.
   Тексты терминов берутся из GLOSS (rules.js), плюс свои для «Рейтинг», «Игры», «В-П», «Нап.», «Защ.». */
(function(){
const EXTRA={
 ru:{RAT:'Рейтинг за игру от 3 до 10: старт 6.0 + очки за биту и защиту. В таблице — среднее по играм.',G:'Сыгранные игры',WL:'Победы — поражения команд, за которые играл',
   OFF:'Очки за нападение (бита) в этой игре',DEF:'Очки за защиту в этой игре',POS:'Позиция в защите'},
 az:{RAT:'Oyun üzrə reytinq 3-dən 10-a: başlanğıc 6.0 + vuruş və müdafiə balları. Cədvəldə — oyunlar üzrə orta.',G:'Oynanan oyunlar',WL:'Oynadığı komandaların qələbə — məğlubiyyətləri',
   OFF:'Bu oyunda hücum (vuruş) balları',DEF:'Bu oyunda müdafiə balları',POS:'Müdafiədə mövqe'},
 en:{RAT:'Game rating from 3 to 10: start 6.0 + points for batting and defense. In the table — the average per game.',G:'Games played',WL:'Wins — losses of the teams he played for',
   OFF:'Offense (batting) points in this game',DEF:'Defense points in this game',POS:'Fielding position'}
};
const L=()=>(typeof LANG!=='undefined'&&EXTRA[LANG])?LANG:'en';
function dict(){
  const d={}, g=(typeof GLOSS!=='undefined'&&(GLOSS[L()]||GLOSS.en))||{items:[]};
  for(const [k,v] of g.items){ if(k.includes('/')){ const ks=k.split('/').map(s=>s.trim()), vs=v.split('/').map(s=>s.trim()); ks.forEach((x,i)=>d[x]=vs[i]||v); } else d[k]=v; }
  const X=EXTRA[L()], t=k=>{try{return T(k)}catch(_){return null}};
  [[t('rating'),X.RAT],['RAT',X.RAT],[t('G'),X.G],[t('WL'),X.WL],[t('rOffS'),X.OFF],[t('rDefS'),X.DEF],[t('rOff'),X.OFF],[t('rDef'),X.DEF],[t('pos'),X.POS],[t('position'),X.POS]]
    .forEach(([k,v])=>{ if(k) d[k]=v; });
  return d;
}
const tip=document.createElement('div'); tip.className='stip'; tip.hidden=true;
const st=document.createElement('style');
st.textContent=`.stip{position:fixed;z-index:120;max-width:260px;padding:8px 11px;border-radius:9px;background:#f4f6fa;color:#0b1626;font-size:12.5px;line-height:1.4;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.45);pointer-events:none;text-transform:none;letter-spacing:0}
.stip b{display:block;font-weight:800;margin-bottom:2px}
th.has-tip{text-decoration:underline dotted rgba(143,160,184,.6);text-underline-offset:4px;cursor:help}`;
document.head.appendChild(st);
function keyOf(th){ return th.textContent.replace(/[↑↓▲▼]/g,'').trim(); }
function textFor(th){ const k=keyOf(th); if(!k) return null; const v=dict()[k]; return v?{k,v}:null; }
function show(th){
  const x=textFor(th); if(!x){hide();return;}
  if(!tip.isConnected) document.body.appendChild(tip);
  tip.innerHTML=`<b>${x.k}</b>${x.v}`; tip.hidden=false;
  const r=th.getBoundingClientRect(), w=tip.offsetWidth, h=tip.offsetHeight;
  let left=Math.min(Math.max(8,r.left+r.width/2-w/2),innerWidth-w-8), top=r.bottom+8;
  if(top+h>innerHeight-8) top=r.top-h-8;
  tip.style.left=left+'px'; tip.style.top=top+'px';
}
function hide(){ tip.hidden=true; }
// подчеркнуть заголовки, у которых есть пояснение
function mark(){ const d=dict(); document.querySelectorAll('table th').forEach(th=>th.classList.toggle('has-tip',!!d[keyOf(th)])); }
new MutationObserver(()=>{ clearTimeout(mark.t); mark.t=setTimeout(mark,50); }).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('mouseover',e=>{ const th=e.target.closest&&e.target.closest('th.has-tip'); if(th) show(th); else if(!tip.hidden&&!e.target.closest('.stip')) hide(); });
let tt=null;
document.addEventListener('touchstart',e=>{ const th=e.target.closest&&e.target.closest('th.has-tip'); if(!th){hide();return;} show(th); clearTimeout(tt); tt=setTimeout(hide,3500); },{passive:true});
addEventListener('scroll',hide,{passive:true,capture:true});
})();
