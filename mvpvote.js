/* Голосование «Игрок матча» среди игроков (16.11.2026).
   Админ на странице «Админ» создаёт голосование на дату игры и отмечает, кто был на игре.
   Голосуют только вошедшие игроки, которые были на игре; за себя нельзя; голос можно поменять, пока голосование открыто.
   Итоги видны всем после закрытия (админу — сразу). Карточка — на главной (открытое или недавно закрытое голосование)
   и на странице игры с той же датой. Данные — Supabase: mvp_polls, mvp_votes, функции cast_mvp_vote / mvp_results / mvp_count
   (supabase/schema.sql, раздел 6d). */
(function(){
  if(!window.CL||!CL.ctx) return;
  Object.assign(I18N.ru,{mvTitle:'Игрок матча — голос игроков',mvSub:'голосуют те, кто был на игре · за себя нельзя',mvVoted:(n,m)=>`проголосовали ${n} из ${m}`,
    mvLogin:'Войти, чтобы проголосовать',mvNotAtt:'Голосуют только игроки, которые были на этой игре.',mvNotPlayer:'Голосуют только игроки команды. Привяжите аккаунт к себе в составе в профиле.',
    mvPick:'Выберите лучшего игрока матча:',mvMine:'ваш голос',mvChange:'Голос можно поменять, пока голосование открыто.',mvThanks:'Голос принят',
    mvClosed:'Голосование закрыто',mvRes:'Итоги голосования',mvWinner:'Выбор игроков',mvVotesN:n=>`${n} ${n%10===1&&n%100!==11?'голос':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'голоса':'голосов'}`,
    mvNoVotes:'Голосов не было',mvAdmin:'Голосование «Игрок матча»',mvAdmHint:'Отметьте, кто был на игре, — только они смогут голосовать (за себя нельзя).',
    mvDate:'Дата игры',mvAtt:'Были на игре',mvAll:'все',mvNone:'никого',mvFrom:'Взять из «буду»',mvFromBox:'Взять из протокола',mvSave:'Сохранить и открыть голосование',mvSaved:'Голосование открыто',
    mvClose:'Закрыть голосование',mvReopen:'Открыть снова',mvDel:'Удалить',mvDelQ:'Удалить голосование вместе с голосами?',mvEdit:'Изменить',mvStOpen:'идёт',mvStClosed:'закрыто',mvNoPolls:'Голосований пока нет',
    mvNeed2:'Отметьте хотя бы двух игроков',mvAdmLive:'админу итоги видны сразу',
    mvE:{mvp_not_player:'Голосуют только игроки команды',mvp_closed:'Голосование уже закрыто',mvp_not_attendee:'Голосуют только те, кто был на игре',mvp_bad_candidate:'Этого игрока не было на игре',mvp_self:'За себя голосовать нельзя'}});
  Object.assign(I18N.az,{mvTitle:'Oyunun ən yaxşısı — oyunçuların səsi',mvSub:'oyunda olanlar səs verir · özünə səs vermək olmaz',mvVoted:(n,m)=>`${m} nəfərdən ${n} səs verdi`,
    mvLogin:'Səs vermək üçün daxil olun',mvNotAtt:'Yalnız bu oyunda olan oyunçular səs verir.',mvNotPlayer:'Yalnız komanda oyunçuları səs verir. Profildə hesabınızı heyətdəki adınıza bağlayın.',
    mvPick:'Oyunun ən yaxşı oyunçusunu seçin:',mvMine:'sizin səsiniz',mvChange:'Səsvermə açıq olduqca səsi dəyişmək olar.',mvThanks:'Səs qəbul edildi',
    mvClosed:'Səsvermə bağlanıb',mvRes:'Səsvermənin nəticələri',mvWinner:'Oyunçuların seçimi',mvVotesN:n=>`${n} səs`,
    mvNoVotes:'Səs verilməyib',mvAdmin:'«Oyunun ən yaxşısı» səsverməsi',mvAdmHint:'Oyunda kimlərin olduğunu qeyd edin — yalnız onlar səs verə biləcək (özünə olmaz).',
    mvDate:'Oyunun tarixi',mvAtt:'Oyunda olanlar',mvAll:'hamısı',mvNone:'heç kim',mvFrom:'«Gələcəyəm»dən götür',mvFromBox:'Protokoldan götür',mvSave:'Yadda saxla və səsverməni aç',mvSaved:'Səsvermə açıldı',
    mvClose:'Səsverməni bağla',mvReopen:'Yenidən aç',mvDel:'Sil',mvDelQ:'Səsvermə səslərlə birlikdə silinsin?',mvEdit:'Dəyiş',mvStOpen:'gedir',mvStClosed:'bağlanıb',mvNoPolls:'Hələ səsvermə yoxdur',
    mvNeed2:'Ən azı iki oyunçu qeyd edin',mvAdmLive:'admin nəticələri dərhal görür',
    mvE:{mvp_not_player:'Yalnız komanda oyunçuları səs verir',mvp_closed:'Səsvermə artıq bağlanıb',mvp_not_attendee:'Yalnız oyunda olanlar səs verir',mvp_bad_candidate:'Bu oyunçu oyunda olmayıb',mvp_self:'Özünə səs vermək olmaz'}});
  Object.assign(I18N.en,{mvTitle:'Player of the game — players’ vote',mvSub:'only those who played can vote · no voting for yourself',mvVoted:(n,m)=>`${n} of ${m} voted`,
    mvLogin:'Log in to vote',mvNotAtt:'Only players who were at this game can vote.',mvNotPlayer:'Only team players can vote. Link your account to yourself in the roster in your profile.',
    mvPick:'Pick the best player of the game:',mvMine:'your vote',mvChange:'You can change your vote while voting is open.',mvThanks:'Vote saved',
    mvClosed:'Voting closed',mvRes:'Voting results',mvWinner:'Players’ choice',mvVotesN:n=>`${n} vote${n===1?'':'s'}`,
    mvNoVotes:'No votes',mvAdmin:'“Player of the game” vote',mvAdmHint:'Mark who was at the game — only they can vote (not for themselves).',
    mvDate:'Game date',mvAtt:'At the game',mvAll:'all',mvNone:'none',mvFrom:'Take from “going”',mvFromBox:'Take from the box score',mvSave:'Save and open voting',mvSaved:'Voting is open',
    mvClose:'Close voting',mvReopen:'Reopen',mvDel:'Delete',mvDelQ:'Delete this vote together with all votes?',mvEdit:'Edit',mvStOpen:'open',mvStClosed:'closed',mvNoPolls:'No votes yet',
    mvNeed2:'Mark at least two players',mvAdmLive:'admin sees results right away',
    mvE:{mvp_not_player:'Only team players can vote',mvp_closed:'Voting is already closed',mvp_not_attendee:'Only those who were at the game can vote',mvp_bad_candidate:'This player was not at the game',mvp_self:'You cannot vote for yourself'}});

  const X=()=>CL.ctx(), esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const M={polls:null,mine:{},count:{},res:{},at:0,busy:null};
  const nm=id=>{ const p=S.players[id]; return p?pname(p):id; };
  const me=()=>{ const c=X().C; return c.profile&&['player','admin'].includes(c.profile.role)?c.profile.player_id:null; };
  const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const errMsg=e=>{ const m=(e&&e.message)||''; const k=Object.keys(T('mvE')).find(k=>m.includes(k)); return k?T('mvE')[k]:m; };

  function load(force){
    const c=X().C; if(!c.ok||!c.sb) return Promise.resolve();
    const uid=c.user?c.user.id:''; if(!force&&M.polls&&Date.now()-M.at<60e3&&M.uid===uid) return Promise.resolve();
    if(M.busy) return M.busy;
    M.busy=(async()=>{
      const {data,error}=await c.sb.from('mvp_polls').select('*').order('game_id',{ascending:false}).limit(8);
      if(error){ console.warn('[mvp]',error.message); M.polls=[]; return; }
      M.polls=data||[]; M.at=Date.now(); M.uid=c.user?c.user.id:'';
      await Promise.all(M.polls.map(async p=>{
        const a=await c.sb.rpc('mvp_count',{p_game:p.game_id}); M.count[p.game_id]=a.data||0;
        const r=await c.sb.rpc('mvp_results',{p_game:p.game_id}); M.res[p.game_id]=r.data||[];
      }));
      M.mine={};
      if(c.user){ const v=await c.sb.from('mvp_votes').select('game_id,candidate,voter').eq('voter',c.user.id); (v.data||[]).forEach(x=>M.mine[x.game_id]=x.candidate); }
    })().finally(()=>{M.busy=null;});
    return M.busy;
  }

  function avatar(id){ const p=S.players[id]; return p?av(p):`<span class="av"></span>`; }
  function card(p){
    const c=X().C, mine=me(), att=p.attendees||[], n=M.count[p.game_id]||0, adm=X().isAdmin();
    const g=S.games.find(x=>x.id===p.game_id);
    let h=`<div class="card mv-card" data-mv="${esc(p.game_id)}"><div class="mv-head"><div><span class="eyebrow">🏆 ${T('mvTitle')}</span>
      <div class="mv-date">${g?`<a href="#game-${esc(p.game_id)}">${fmtDate(p.game_id)}</a>`:fmtDate(p.game_id)} · ${p.status==='open'?T('mvVoted')(n,att.length):T('mvClosed')}</div></div>
      ${adm?`<div class="mv-adm">${p.status==='open'?`<button class="btn sm" onclick="MV.status('${esc(p.game_id)}','closed')">${T('mvClose')}</button>`:`<button class="btn sm" onclick="MV.status('${esc(p.game_id)}','open')">${T('mvReopen')}</button>`}</div>`:''}</div>`;
    const res=M.res[p.game_id]||[];
    if(p.status==='closed'||(adm&&res.length)){
      const tot=res.reduce((s,r)=>s+r.votes,0), top=res.length?res[0].votes:0;
      h+=`<div class="mv-sub">${p.status==='closed'?T('mvRes'):`${T('mvRes')} · ${T('mvAdmLive')}`}</div>`;
      h+=res.length?`<div class="mv-res">${res.slice(0,6).map(r=>`<a class="mv-r${r.votes===top?' win':''}" href="#player-${esc(r.candidate)}">${avatar(r.candidate)}<span class="mv-rn">${esc(nm(r.candidate))}${r.votes===top&&p.status==='closed'?` <span class="chip main">${T('mvWinner')}</span>`:''}</span><span class="mv-bar"><i style="width:${tot?Math.round(r.votes/tot*100):0}%"></i></span><b>${T('mvVotesN')(r.votes)}</b></a>`).join('')}</div>`:`<div class="muted">${T('mvNoVotes')}</div>`;
    }
    if(p.status==='open'){
      if(!c.user) h+=`<p class="mv-note">${T('mvSub')}</p><button class="btn pri" onclick="CL.auth('login')">${T('mvLogin')}</button>`;
      else if(!mine) h+=`<p class="mv-note">${T('mvNotPlayer')}</p>`;
      else if(!att.includes(mine)) h+=`<p class="mv-note">${T('mvNotAtt')}</p>`;
      else{
        const my=M.mine[p.game_id];
        h+=`<p class="mv-note">${T('mvPick')}</p><div class="mv-grid">${att.filter(id=>id!==mine).sort((a,b)=>nm(a).localeCompare(nm(b))).map(id=>`<button type="button" class="mv-c${my===id?' on':''}" onclick="MV.vote('${esc(p.game_id)}','${esc(id)}',this)">${avatar(id)}<span>${esc(nm(id))}</span>${my===id?`<em>${T('mvMine')}</em>`:''}</button>`).join('')}</div><p class="mv-note muted">${T('mvChange')}</p>`;
      }
    }
    return h+'</div>';
  }
  function homePoll(){ if(!M.polls) return null; const o=M.polls.find(p=>p.status==='open'); if(o) return o;
    return M.polls.find(p=>p.status==='closed'&&p.closed_at&&Date.now()-new Date(p.closed_at).getTime()<4*864e5)||null; }
  function page(){ const h=(location.hash||'').slice(1), i=h.indexOf('-'); return {page:i<0?h:h.slice(0,i), id:i<0?'':decodeURIComponent(h.slice(i+1))}; }
  function place(){
    const c=X().C; if(!c.ok) return;
    const {page:pg,id}=page(), FR=window.FEATURE_ROUTES||{}, home=!['player','game','games'].includes(pg)&&!FR[pg];
    document.querySelectorAll('.mv-sec').forEach(e=>e.remove());
    if(pg==='admin'){ if(X().isAdmin()) adminBlock(); return; }
    let p=null, anchor=null;
    if(home){ p=homePoll(); anchor=document.getElementById('cl-next'); }
    else if(pg==='game'){ p=(M.polls||[]).find(x=>x.game_id===id); anchor=document.querySelector('#app .lastgame'); }
    if(!p) return;
    const box=document.createElement('div'); box.className='mv-sec'; box.innerHTML=card(p);
    if(anchor) anchor.after(box); else { const a=document.getElementById('app'); a&&a.prepend(box); }
  }
  async function refresh(force){ await load(force); place(); }

  /* ---------- Админ ---------- */
  const A={date:null,att:null};
  function adminBlock(){
    const live=document.getElementById('adm-live'); if(!live) return;
    if(!A.date){ A.date=ymd(new Date()); }
    const poll=(M.polls||[]).find(p=>p.game_id===A.date);
    if(A.att==null) A.att=new Set(poll?poll.attendees:[]);
    const ids=Object.keys(S.players).sort((a,b)=>nm(a).localeCompare(nm(b)));
    const sec=document.createElement('div'); sec.className='mv-sec';
    sec.innerHTML=`<div class="section-title"><h2>${T('mvAdmin')}</h2><span class="hint">${T('mvAdmHint')}</span></div>
      <div class="card mv-admin"><div class="mv-arow"><label>${T('mvDate')} <input type="date" value="${A.date}" onchange="MV.date(this.value)"></label>
        <span class="mv-qs"><button class="btn sm" onclick="MV.fill('all')">${T('mvAll')}</button><button class="btn sm" onclick="MV.fill('none')">${T('mvNone')}</button>
        <button class="btn sm" onclick="MV.fill('rsvp')">${T('mvFrom')}</button>${S.games.some(g=>g.id===A.date&&g.box&&g.box.length)?`<button class="btn sm" onclick="MV.fill('box')">${T('mvFromBox')}</button>`:''}</span></div>
        <div class="mv-alab">${T('mvAtt')}: <b id="mv-n">${A.att.size}</b></div>
        <div class="mv-checks">${ids.map(id=>`<label class="mv-ck${A.att.has(id)?' on':''}"><input type="checkbox" value="${esc(id)}" ${A.att.has(id)?'checked':''} onchange="MV.tick(this)">${avatar(id)}<span>${esc(nm(id))}</span></label>`).join('')}</div>
        <button class="btn pri" onclick="MV.save()">${T('mvSave')}</button></div>
      <div class="card mv-list">${(M.polls||[]).length?(M.polls||[]).map(p=>`<div class="mv-li"><b>${fmtDate(p.game_id)}</b><span class="chip ${p.status==='open'?'main':''}">${p.status==='open'?T('mvStOpen'):T('mvStClosed')}</span>
        <span class="muted">${T('mvVoted')(M.count[p.game_id]||0,(p.attendees||[]).length)}</span><span class="mv-li-b">
        <button class="btn sm" onclick="MV.edit('${esc(p.game_id)}')">${T('mvEdit')}</button>
        ${p.status==='open'?`<button class="btn sm" onclick="MV.status('${esc(p.game_id)}','closed')">${T('mvClose')}</button>`:`<button class="btn sm" onclick="MV.status('${esc(p.game_id)}','open')">${T('mvReopen')}</button>`}
        <button class="btn sm danger" onclick="MV.del('${esc(p.game_id)}')">${T('mvDel')}</button></span></div>`).join(''):`<div class="muted">${T('mvNoPolls')}</div>`}</div>`;
    const sectTitle=live.previousElementSibling; (sectTitle||live).before(sec);
  }
  async function fillFrom(kind){
    const ids=Object.keys(S.players);
    if(kind==='all') A.att=new Set(ids);
    else if(kind==='none') A.att=new Set();
    else if(kind==='box'){ const g=S.games.find(x=>x.id===A.date); A.att=new Set((g&&g.box||[]).map(b=>b.player)); }
    else if(kind==='rsvp'){
      const c=X().C, d0=new Date(A.date+'T00:00:00'), d1=new Date(d0.getTime()+864e5);
      const ev=await c.sb.from('events').select('id,starts_at').gte('starts_at',d0.toISOString()).lt('starts_at',d1.toISOString());
      const evIds=(ev.data||[]).map(e=>e.id); const set=new Set();
      if(evIds.length){ const r=await c.sb.from('rsvps').select('event_id,user_id,status').in('event_id',evIds);
        (r.data||[]).filter(x=>x.status==='yes').forEach(x=>{ const pr=c.profiles[x.user_id]; if(pr&&pr.player_id) set.add(pr.player_id); }); }
      A.att=set; if(!set.size) toast('—');
    }
    place();
  }
  window.MV={
    vote:async(gid,cand,btn)=>{ const c=X().C; if(btn) btn.classList.add('busy');
      const {error}=await c.sb.rpc('cast_mvp_vote',{p_game:gid,p_candidate:cand});
      if(error){ toast(errMsg(error)); if(btn) btn.classList.remove('busy'); return; }
      toast(T('mvThanks')); M.mine[gid]=cand; await refresh(true); },
    status:async(gid,st)=>{ const c=X().C; const {error}=await c.sb.from('mvp_polls').update({status:st,closed_at:st==='closed'?new Date().toISOString():null}).eq('game_id',gid);
      if(error){ X().fail(error); return; } await refresh(true); },
    del:async gid=>{ if(!confirm(T('mvDelQ'))) return; const c=X().C; const {error}=await c.sb.from('mvp_polls').delete().eq('game_id',gid); if(error){ X().fail(error); return; } if(A.date===gid) A.att=null; await refresh(true); },
    edit:gid=>{ A.date=gid; A.att=null; place(); const el=document.querySelector('.mv-admin'); el&&el.scrollIntoView({block:'center',behavior:'smooth'}); },
    date:v=>{ A.date=v; A.att=null; place(); },
    tick:el=>{ el.checked?A.att.add(el.value):A.att.delete(el.value); el.closest('.mv-ck').classList.toggle('on',el.checked); const n=document.getElementById('mv-n'); if(n) n.textContent=A.att.size; },
    fill:k=>fillFrom(k),
    save:async()=>{ if(A.att.size<2){ toast(T('mvNeed2')); return; } const c=X().C;
      const {error}=await c.sb.from('mvp_polls').upsert({game_id:A.date,attendees:[...A.att],status:'open',closed_at:null});
      if(error){ X().fail(error); return; } toast(T('mvSaved')); await refresh(true); }
  };
  // после каждой отрисовки страницы (и после входа — club.js перерисовывает страницу)
  const _route=route; route=function(){ _route(); place(); load().then(place); };
  setInterval(()=>{ if(document.visibilityState==='visible'&&M.polls&&M.polls.some(p=>p.status==='open')) refresh(true); },90e3);
})();
