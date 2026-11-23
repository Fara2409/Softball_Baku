/* Скаутинг отбивающего (23.11.2026): куда и как бьёт игрок — по всем играм с подробным протоколом (plays: d — зона, bt — тип удара).
   1) Страница игрока: под «Картой ударов» блок «Как защищаться против него» — проценты и советы.
   2) «Составы» (админ): под делением — «Скаутинг соперника»: по каждому отбивающему одна строка.
   Нужны extras.js (XY, SIDE, HITS, posOf, trajOf). Считаем по p.logAll — за всё время, чтобы данных было больше. */
(function(){
  if(!window.SPRAY) return;
  const {SIDE,HITS,posOf,trajOf}=window.SPRAY;
  const MIN=5; // меньше мячей в игре — выводы не делаем
  Object.assign(I18N.ru,{scTitle:'Как защищаться против него',scHint:n=>`по ${n} мячам в игре за все игры`,scFew:n=>`Пока мало данных: ${n} мячей в игре, нужно хотя бы ${MIN}.`,
    scL:'влево',scC:'в центр',scR:'вправо',scG:'по земле',scLn:'лайн-драйв',scF:'флай',scIn:'в инфилд',scOut:'в аутфилд',
    scDir:'Направление',scType:'Тип удара',scDepth:'Дальность',scTips:'Совет защите',scHitG:'хитов по земле',scHitF:'хитов по воздуху',
    tPullL:'Чаще всего бьёт влево — сдвиньте 3B и SS к третьей базе, LF ближе к линии.',tPullR:'Чаще бьёт вправо — 2B и 1B шире к первой, RF ближе к линии.',
    tCenter:'Бьёт в основном в центр — закройте середину: SS и 2B ближе к второй базе, CF по центру.',tSpray:'Бьёт во все стороны — стандартная расстановка.',
    tGround:'В основном по земле — главное надёжный инфилд; аутфилд может стоять ближе.',tFly:'Много флаев — аутфилд глубже, ловите в воздухе.',tLine:'Много лайн-драйвов — следите за промежутками между аутфилдерами.',
    tDeep:'Часто бьёт далеко — аутфилд на шаг-два глубже.',tShort:'Мяч редко уходит из инфилда — аутфилд ближе, страхуйте инфилдеров.',
    tWeakF:(h,n)=>`Слабое место — флаи: хитов ${h} из ${n}.`,tWeakG:(h,n)=>`Слабое место — мячи по земле: хитов ${h} из ${n}.`,
    tTop:z=>`Любимая зона: ${z}.`,
    scTeam:'Скаутинг соперника',scTeamHint:'как бьют игроки этой команды — подсказка защите другой',scTeamFew:'мало данных'});
  Object.assign(I18N.az,{scTitle:'Ona qarşı necə müdafiə olunmalı',scHint:n=>`bütün oyunlarda ${n} oyuna düşən topa görə`,scFew:n=>`Hələ məlumat azdır: ${n} top, ən azı ${MIN} lazımdır.`,
    scL:'sola',scC:'mərkəzə',scR:'sağa',scG:'yerlə',scLn:'layn-drayv',scF:'flay',scIn:'infilde',scOut:'autfilde',
    scDir:'İstiqamət',scType:'Zərbənin növü',scDepth:'Məsafə',scTips:'Müdafiəyə məsləhət',scHitG:'yerlə hit',scHitF:'havadan hit',
    tPullL:'Daha çox sola vurur — 3B və SS-i üçüncü bazaya, LF-i xəttə yaxın çəkin.',tPullR:'Daha çox sağa vurur — 2B və 1B birinciyə tərəf, RF xəttə yaxın.',
    tCenter:'Əsasən mərkəzə vurur — ortanı bağlayın: SS və 2B ikinci bazaya yaxın, CF mərkəzdə.',tSpray:'Hər tərəfə vurur — standart düzülüş.',
    tGround:'Əsasən yerlə — əsas etibarlı infilddir; autfild yaxında dura bilər.',tFly:'Çox flay — autfild daha dərində, havada tutun.',tLine:'Çox layn-drayv — autfilderlər arasındakı boşluqlara diqqət.',
    tDeep:'Tez-tez uzağa vurur — autfild bir-iki addım dərinə.',tShort:'Top nadir hallarda infilddən çıxır — autfild yaxına, infilderləri sığortalayın.',
    tWeakF:(h,n)=>`Zəif yeri — flaylar: hit ${h} / ${n}.`,tWeakG:(h,n)=>`Zəif yeri — yerlə toplar: hit ${h} / ${n}.`,
    tTop:z=>`Sevimli zona: ${z}.`,
    scTeam:'Rəqibin skautinqi',scTeamHint:'bu komandanın oyunçuları necə vurur — o biri komandanın müdafiəsinə ipucu',scTeamFew:'məlumat azdır'});
  Object.assign(I18N.en,{scTitle:'How to defend against him',scHint:n=>`based on ${n} balls in play across all games`,scFew:n=>`Not enough data yet: ${n} balls in play, at least ${MIN} needed.`,
    scL:'left',scC:'center',scR:'right',scG:'ground',scLn:'line drive',scF:'fly',scIn:'infield',scOut:'outfield',
    scDir:'Direction',scType:'Ball type',scDepth:'Depth',scTips:'Defensive tips',scHitG:'hits on the ground',scHitF:'hits in the air',
    tPullL:'Mostly hits to the left — shift 3B and SS toward third, LF toward the line.',tPullR:'Mostly hits to the right — 2B and 1B wider toward first, RF toward the line.',
    tCenter:'Mostly up the middle — close the middle: SS and 2B near second, CF centered.',tSpray:'Sprays the ball everywhere — standard alignment.',
    tGround:'Mostly ground balls — a solid infield matters most; the outfield can play shallower.',tFly:'Lots of fly balls — play the outfield deeper.',tLine:'Lots of line drives — watch the gaps between outfielders.',
    tDeep:'Often hits it far — outfield a step or two deeper.',tShort:'Rarely leaves the infield — bring the outfield in and back up the infielders.',
    tWeakF:(h,n)=>`Weak spot — fly balls: ${h} hits out of ${n}.`,tWeakG:(h,n)=>`Weak spot — ground balls: ${h} hits out of ${n}.`,
    tTop:z=>`Favorite zone: ${z}.`,
    scTeam:'Scouting the opponent',scTeamHint:'how this team’s batters hit — a hint for the other team’s defense',scTeamFew:'not enough data'});

  const INFP=['P','C','1B','2B','3B','SS'];
  function balls(p){
    const out=[];
    for(const {game:g} of (p.logAll||p.log||[])){ if(!g.plays) continue;
      for(const x of g.plays){ if(x.b!==p.id) continue;
        let pos=null;
        if(HITS.includes(x.r)) pos=x.d||(x.f&&x.f[0]?posOf(g,x.f[0]):null);
        else if(['GO','FO','FC','SAC'].includes(x.r)) pos=x.d||(x.f&&x.f[0]?posOf(g,x.f[0]):null);
        else if(x.r==='ROE') pos=x.d||(x.e&&x.e[0]?posOf(g,x.e[0]):null);
        if(!pos||!SIDE[pos]) continue;
        out.push({pos,hit:HITS.includes(x.r),tr:trajOf(x.r,pos,x.bt),side:SIDE[pos],inf:INFP.includes(pos)});
      } }
    return out;
  }
  function analyze(p){
    const B=balls(p), n=B.length; if(n<MIN) return {n};
    const pc=f=>Math.round(B.filter(f).length/n*100);
    const s={L:pc(b=>b.side==='L'),C:pc(b=>b.side==='C'),R:pc(b=>b.side==='R'),g:pc(b=>b.tr==='g'),l:pc(b=>b.tr==='l'),f:pc(b=>b.tr==='f'),out:pc(b=>!b.inf)};
    const tips=[];
    if(s.L>=55) tips.push(T('tPullL')); else if(s.R>=45) tips.push(T('tPullR')); else if(s.C>=50) tips.push(T('tCenter')); else tips.push(T('tSpray'));
    if(s.g>=55) tips.push(T('tGround')); else if(s.f>=45) tips.push(T('tFly')); else if(s.l>=35) tips.push(T('tLine'));
    if(s.out>=65) tips.push(T('tDeep')); else if(s.out<=25&&s.g<55) tips.push(T('tShort'));
    const fl=B.filter(b=>b.tr==='f'), gr=B.filter(b=>b.tr==='g'), hr=a=>a.filter(b=>b.hit).length;
    if(fl.length>=3&&hr(fl)/fl.length<=0.2) tips.push(T('tWeakF')(hr(fl),fl.length));
    else if(gr.length>=4&&hr(gr)/gr.length<=0.2) tips.push(T('tWeakG')(hr(gr),gr.length));
    const z={}; B.forEach(b=>z[b.pos]=(z[b.pos]||0)+1); const top=Object.entries(z).sort((a,b)=>b[1]-a[1]);
    if(top[0]&&top[0][1]/n>=0.25) tips.push(T('tTop')(`${top[0][0]} (${Math.round(top[0][1]/n*100)}%)`));
    return {n,s,tips,top};
  }
  // короткая строка для скаутинга команды
  function brief(a){
    if(!a.s) return `<span class="muted">${T('scTeamFew')} (${a.n})</span>`;
    const s=a.s, dir=[['L','scL'],['C','scC'],['R','scR']].sort((x,y)=>s[y[0]]-s[x[0]])[0], typ=[['g','scG'],['l','scLn'],['f','scF']].sort((x,y)=>s[y[0]]-s[x[0]])[0];
    return `<b>${s[dir[0]]}% ${T(dir[1])}</b> · ${s[typ[0]]}% ${T(typ[1])} · ${s.out}% ${T('scOut')}`;
  }
  const bar=(l,v)=>`<div class="sc-b"><span>${l}</span><i><b style="width:${v}%"></b></i><em>${v}%</em></div>`;
  function block(p){
    if(!(p.logAll||[]).some(l=>l.game.plays)) return '';
    const a=analyze(p);
    let h=`<div class="section-title"><h2>${T('scTitle')}</h2><span class="hint">${a.s?T('scHint')(a.n):''}</span></div><div class="card sc-card">`;
    if(!a.s) return h+`<p class="muted">${T('scFew')(a.n)}</p></div>`;
    const s=a.s;
    h+=`<div class="sc-grid"><div><h4>${T('scDir')}</h4>${bar(T('scL'),s.L)}${bar(T('scC'),s.C)}${bar(T('scR'),s.R)}</div>
      <div><h4>${T('scType')}</h4>${bar(T('scG'),s.g)}${bar(T('scLn'),s.l)}${bar(T('scF'),s.f)}</div>
      <div><h4>${T('scDepth')}</h4>${bar(T('scIn'),100-s.out)}${bar(T('scOut'),s.out)}</div></div>
      <h4 class="sc-th">🛡 ${T('scTips')}</h4><ul class="sc-tips">${a.tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>`;
    return h;
  }
  // страница игрока: сразу после «Карты ударов»
  const _pe=window.playerExtras;
  window.playerExtras=function(p){ const r=_pe?_pe(p):{top:'',bottom:''}; const b=block(p);
    if(!b) return r;
    const i=r.bottom.indexOf('<div class="section-title"',r.bottom.indexOf('class="card spray"'));
    return {top:r.top,bottom:i>0?r.bottom.slice(0,i)+b+r.bottom.slice(i):b+r.bottom}; };

  // «Составы» (админ): скаутинг обеих команд под результатом деления
  function teamBox(){
    const res=document.querySelector('#tmOut .tm-res'); if(!res||typeof tmTeams!=='function') return;
    res.querySelectorAll('.sc-team').forEach(e=>e.remove());
    const t=tmTeams(), names=typeof TEAM_DEF!=='undefined'?TEAM_DEF:null;
    const col=(team,i)=>{ const d=(typeof tmTeamName==='function'?tmTeamName(i):null)||(names&&names[i]&&names[i].name)||(i?'B':'A');
      return `<div class="sc-tc"><h4>${esc(d)}</h4>${team.map(x=>`<div class="sc-row"><span class="sc-n">${esc(pname(x.p))}</span><span class="sc-v">${brief(analyze(x.p))}</span></div>`).join('')}</div>`; };
    const d=document.createElement('details'); d.className='card sc-team';
    d.innerHTML=`<summary><b>🔎 ${T('scTeam')}</b> <span class="muted small">${T('scTeamHint')}</span></summary><div class="sc-tcs">${col(t[0],0)}${col(t[1],1)}</div>`;
    const anchor=res.querySelector('.tr-check')||res.querySelector('.tm-bal'); anchor?anchor.after(d):res.appendChild(d);
  }
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if(typeof tmRender==='function'){ const _tr=tmRender; tmRender=function(){ _tr.apply(this,arguments); try{ teamBox(); }catch(e){ console.warn('[scout]',e); } }; }
  window.SCOUT={analyze};
})();
