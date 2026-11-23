/* Условия деления на команды (23.11.2026).
   Админ на странице «Составы» (#teams) задаёт условия для балансировщика (splitTeams в features.js):
     pitch    — эти игроки питчеры: если пришли, подают они; двое и больше — в разных командах;
     apart    — двое игроков в разных командах;
     together — двое игроков в одной команде;
     rookies  — новичков (isRookie) поровну.
   Условие применяется, только если его игроки отмечены как пришедшие. Нарушение условия — большой штраф,
   поэтому балансировщик выполняет его всегда, когда это вообще возможно; под результатом видно ✓ / ⚠ по каждому.
   Игроки видят список условий, менять может только админ.
   Данные — Supabase, таблица team_rules (schema.sql, 6i); копия в localStorage, чтобы работало и без сети. */
(function(){
  if(!window.CL||!CL.ctx) return;
  Object.assign(I18N.ru,{trTitle:'Условия деления',trSub:'Балансировщик выполняет их, если нужные игроки пришли. Всегда уравниваются общий рейтинг, нападение и защита.',
    trPitch:'Питчеры',trPitchD:'подают они; если пришли двое — в разных командах',trApart:'в разных командах',trTogether:'в одной команде',trRookies:'Новичков поровну',
    trAdd:'+ Добавить условие',trKind:'Условие',trKinds:{pitch:'Эти игроки — питчеры',apart:'Двое в разных командах',together:'Двое в одной команде',rookies:'Новичков поровну'},
    trPick:{pitch:'Отметьте питчеров',apart:'Отметьте двух игроков',together:'Отметьте двух игроков',rookies:''},
    trSave:'Сохранить',trCancel:'Отмена',trDel:'Удалить',trDelQ:'Удалить это условие?',trOff:'выключено',trOn:'включено',trNone:'Условий пока нет.',
    trNeed1:'Отметьте хотя бы одного игрока',trNeed2:'Нужно ровно два игрока',trSaved:'Условие добавлено',trDup:'Такое условие уже есть',
    trNeedSQL:'Условия ещё не подключены: нужно один раз выполнить SQL (раздел 6i в supabase/schema.sql).',
    trCheck:'Условия',trBroken:'не удалось выполнить',trNoP:'нет'});
  Object.assign(I18N.az,{trTitle:'Bölgü şərtləri',trSub:'Lazımi oyunçular gələndə balanslaşdırıcı bunlara əməl edir. Ümumi reytinq, hücum və müdafiə həmişə bərabərləşdirilir.',
    trPitch:'Piçerlər',trPitchD:'atış onlardadır; iki nəfər gəlibsə — fərqli komandalarda',trApart:'fərqli komandalarda',trTogether:'eyni komandada',trRookies:'Yeni oyunçular bərabər',
    trAdd:'+ Şərt əlavə et',trKind:'Şərt',trKinds:{pitch:'Bu oyunçular piçerdir',apart:'İkisi fərqli komandalarda',together:'İkisi eyni komandada',rookies:'Yeni oyunçular bərabər'},
    trPick:{pitch:'Piçerləri qeyd edin',apart:'İki oyunçu qeyd edin',together:'İki oyunçu qeyd edin',rookies:''},
    trSave:'Yadda saxla',trCancel:'Ləğv et',trDel:'Sil',trDelQ:'Bu şərt silinsin?',trOff:'söndürülüb',trOn:'aktivdir',trNone:'Hələ şərt yoxdur.',
    trNeed1:'Ən azı bir oyunçu qeyd edin',trNeed2:'Düz iki oyunçu lazımdır',trSaved:'Şərt əlavə olundu',trDup:'Belə şərt artıq var',
    trNeedSQL:'Şərtlər hələ qoşulmayıb: SQL-i bir dəfə icra etmək lazımdır (supabase/schema.sql, 6i bölməsi).',
    trCheck:'Şərtlər',trBroken:'yerinə yetirilmədi',trNoP:'yoxdur'});
  Object.assign(I18N.en,{trTitle:'Split conditions',trSub:'The balancer follows them when the players involved are present. Overall rating, offense and defense are always balanced.',
    trPitch:'Pitchers',trPitchD:'they pitch; if two are present — on different teams',trApart:'on different teams',trTogether:'on the same team',trRookies:'Rookies split evenly',
    trAdd:'+ Add condition',trKind:'Condition',trKinds:{pitch:'These players pitch',apart:'Two players on different teams',together:'Two players on the same team',rookies:'Rookies split evenly'},
    trPick:{pitch:'Select the pitchers',apart:'Select two players',together:'Select two players',rookies:''},
    trSave:'Save',trCancel:'Cancel',trDel:'Delete',trDelQ:'Delete this condition?',trOff:'off',trOn:'on',trNone:'No conditions yet.',
    trNeed1:'Select at least one player',trNeed2:'Exactly two players are needed',trSaved:'Condition added',trDup:'This condition already exists',
    trNeedSQL:'Conditions are not enabled yet: run the SQL once (section 6i in supabase/schema.sql).',
    trCheck:'Conditions',trBroken:'could not be met',trNoP:'none'});

  const X=()=>CL.ctx(), CK='sb.teamRules', W=40;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let RULES=lsGet(CK,[]), noTable=false, busy=null, form=null; // form: {kind, ids:Set}
  const nm=id=>{ const p=S.players[id]; return p?esc(pname(p)):esc(id); };
  const rk=p=>typeof isRookie==='function'&&isRookie(p);

  function load(){
    const c=X().C; if(!c.ok||!c.sb) return Promise.resolve();
    if(busy) return busy;
    busy=(async()=>{ const {data,error}=await c.sb.from('team_rules').select('*').order('id');
      if(error){ noTable=true; } else { noTable=false; RULES=data||[]; lsSet(CK,RULES); } })().finally(()=>{ busy=null; });
    return busy;
  }

  /* ---------- для балансировщика ---------- */
  function applicable(ids){
    const P=new Set(ids);
    return RULES.filter(r=>r.active!==false).map(r=>{
      if(r.kind==='rookies') return r;
      const ps=(r.players||[]).filter(id=>P.has(id));
      if(r.kind==='pitch') return ps.length?{...r,pp:ps}:null;
      return ps.length===2&&r.players.length===2?r:null; }).filter(Boolean);
  }
  function judge(A,B,r){ // штраф одного условия (0 — выполнено)
    const a=new Set(A.map(x=>x.p.id));
    if(r.kind==='apart') return a.has(r.players[0])===a.has(r.players[1])?W:0;
    if(r.kind==='together') return a.has(r.players[0])!==a.has(r.players[1])?W:0;
    if(r.kind==='pitch'){ const n=r.pp.length, pa=r.pp.filter(id=>a.has(id)).length, pb=n-pa;
      return (n>=2&&(!pa||!pb)?W:0)+Math.max(0,Math.abs(pa-pb)-n%2)*2; }
    if(r.kind==='rookies'){ const ra=A.filter(x=>rk(x.p)).length, rb=B.filter(x=>rk(x.p)).length;
      return Math.max(0,Math.abs(ra-rb)-(ra+rb)%2)*3; }
    return 0;
  }
  const cost=(A,B,R)=>R.reduce((c,r)=>c+judge(A,B,r),0);
  function pitcherOf(team){ // первый по списку условия питчер в этой команде
    const ids=team.map(x=>x.p.id);
    for(const r of RULES) if(r.active!==false&&r.kind==='pitch'){ const id=(r.players||[]).find(i=>ids.includes(i)); if(id) return id; }
    return null;
  }
  window.TR={applicable,cost,pitcherOf};

  /* ---------- Вид ---------- */
  function desc(r){
    const ps=r.players||[];
    if(r.kind==='pitch') return `⚾ <b>${T('trPitch')}:</b> ${ps.map(nm).join(', ')} — ${T('trPitchD')}`;
    if(r.kind==='apart') return `↔ <b>${nm(ps[0])}</b> ${'&'} <b>${nm(ps[1])}</b> — ${T('trApart')}`;
    if(r.kind==='together') return `🤝 <b>${nm(ps[0])}</b> ${'&'} <b>${nm(ps[1])}</b> — ${T('trTogether')}`;
    if(r.kind==='rookies'){ const n=Object.values(S.players).filter(rk); return `🌱 <b>${T('trRookies')}</b>${n.length?` <span class="muted">(${n.map(p=>esc(first(p))).join(', ')})</span>`:''}`; }
    return esc(r.kind);
  }
  function card(){
    const adm=X().isAdmin(); if(!adm) return ''; // условия видит только админ
    let h=`<div class="card tr-card"><div class="tr-head"><h3>⚖ ${T('trTitle')}</h3></div><p class="muted small tr-sub">${T('trSub')}</p>`;
    if(adm&&noTable) return h+`<div class="lp-note">${T('trNeedSQL')}</div></div>`;
    h+=RULES.length?`<div class="tr-list">${RULES.map(r=>`<div class="tr-row${r.active===false?' off':''}"><span class="tr-d">${desc(r)}</span>
      ${adm?`<span class="tr-a"><label class="tr-sw" title="${r.active===false?T('trOff'):T('trOn')}"><input type="checkbox" ${r.active===false?'':'checked'} onchange="TRU.toggle(${+r.id})"><i></i><span>${r.active===false?T('trOff'):T('trOn')}</span></label><button class="btn sm danger" title="${T('trDel')}" onclick="TRU.del(${+r.id})">✕</button></span>`:''}</div>`).join('')}</div>`
      :`<p class="muted tr-none">${T('trNone')}</p>`;
    if(adm) h+=form?formHtml():`<button class="btn sm" onclick="TRU.form()">${T('trAdd')}</button>`;
    return h+'</div>';
  }
  function formHtml(){
    const k=form.kind, ps=playersArr();
    return `<div class="tr-form"><label>${T('trKind')} <select onchange="TRU.kind(this.value)">${Object.entries(T('trKinds')).map(([v,t])=>`<option value="${v}"${v===k?' selected':''}>${t}</option>`).join('')}</select></label>
      ${k==='rookies'?'':`<p class="muted small">${T('trPick')[k]}</p><div class="mv-checks">${ps.map(p=>`<label class="mv-ck${form.ids.has(p.id)?' on':''}"><input type="checkbox" value="${esc(p.id)}" ${form.ids.has(p.id)?'checked':''} onchange="TRU.tick(this)">${av(p)}<span>${esc(pname(p))}</span></label>`).join('')}</div>`}
      <div class="btns"><button class="btn pri" onclick="TRU.save()">${T('trSave')}</button><button class="btn" onclick="TRU.cancel()">${T('trCancel')}</button></div></div>`;
  }
  function place(){
    if(!/^#teams/.test(location.hash||'')) return;
    const pick=document.querySelector('#app .tm-pick'); if(!pick) return;
    document.querySelectorAll('.tr-sec').forEach(e=>e.remove());
    const h=card(); if(!h) return;
    const box=document.createElement('div'); box.className='tr-sec'; box.innerHTML=h; pick.after(box);
  }
  // проверка под результатом деления
  function checkBox(){
    const res=document.querySelector('#tmOut .tm-res'); if(!res||typeof TM==='undefined'||!TM.sols[TM.idx]) return;
    res.querySelectorAll('.tr-check').forEach(e=>e.remove());
    const s=TM.sols[TM.idx], R=applicable([...s.A,...s.B].map(x=>x.p.id)); if(!R.length) return;
    const d=document.createElement('div'); d.className='tr-check';
    d.innerHTML=`<b>${T('trCheck')}:</b>`+R.map(r=>{ const ok=!judge(s.A,s.B,r); return `<span class="${ok?'ok':'bad'}">${ok?'✓':'⚠'} ${desc(r)}${ok?'':` — ${T('trBroken')}`}</span>`; }).join('');
    const bal=res.querySelector('.tm-bal'); bal?bal.after(d):res.prepend(d);
  }
  const reset=()=>{ if(typeof TM!=='undefined'){ TM.sols=[]; const o=document.getElementById('tmOut'); if(o) o.innerHTML=''; } };

  window.TRU={
    form:()=>{ form={kind:'pitch',ids:new Set()}; place(); },
    kind:v=>{ form.kind=v; if(v==='rookies') form.ids=new Set(); place(); },
    tick:el=>{ el.checked?form.ids.add(el.value):form.ids.delete(el.value); el.closest('.mv-ck').classList.toggle('on',el.checked); },
    cancel:()=>{ form=null; place(); },
    save:async()=>{ const k=form.kind, ids=[...form.ids];
      if(k==='pitch'&&!ids.length){ toast(T('trNeed1')); return; }
      if((k==='apart'||k==='together')&&ids.length!==2){ toast(T('trNeed2')); return; }
      const key=r=>r.kind+':'+[...(r.players||[])].sort().join(',');
      if(RULES.some(r=>key(r)===key({kind:k,players:ids}))){ toast(T('trDup')); return; }
      // питчеры — в порядке номеров, чтобы было видно, кто подаёт первым
      const pl=k==='rookies'?[]:playersArr().map(p=>p.id).filter(id=>form.ids.has(id));
      const {error}=await X().C.sb.from('team_rules').insert({kind:k,players:pl});
      if(error){ X().fail(error); return; }
      form=null; toast(T('trSaved')); await load(); reset(); place(); },
    toggle:async id=>{ const r=RULES.find(x=>x.id===id); if(!r) return;
      const {error}=await X().C.sb.from('team_rules').update({active:r.active===false}).eq('id',id);
      if(error){ X().fail(error); return; } await load(); reset(); place(); },
    del:async id=>{ if(!confirm(T('trDelQ'))) return;
      const {error}=await X().C.sb.from('team_rules').delete().eq('id',id);
      if(error){ X().fail(error); return; } await load(); reset(); place(); }
  };

  const _route=route; route=function(){ _route(); place(); load().then(place); };
  if(typeof teamsPage==='function'){ const _tp=teamsPage; teamsPage=function(){ _tp.apply(this,arguments); place(); }; }
  if(typeof tmRender==='function'){ const _tr=tmRender; tmRender=function(){ _tr.apply(this,arguments); checkBox(); }; }
})();
