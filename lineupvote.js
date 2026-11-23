/* Голосование за деление на составы (20.11.2026).
   Админ на странице «Составы» (#teams) получает варианты деления и кнопкой «В голосование» складывает их в черновик,
   затем выбирает дату игры и игроков, которые голосуют, и открывает голосование.
   Голосуют только отмеченные игроки (вошедшие, с привязкой к себе в составе); голос можно поменять.
   Как только за вариант больше половины голосующих — он побеждает и голосование закрывается (это делает сервер).
   Админ может закрыть голосование вручную, утвердив любой вариант (например, при ничьей).
   Карточка — на главной (открытое или недавно закрытое голосование) и на странице «Составы».
   Данные — Supabase: lineup_polls, lineup_votes, функции cast_lineup_vote / lineup_counts / lineup_voted (schema.sql, 6g). */
(function(){
  if(!window.CL||!CL.ctx) return;
  Object.assign(I18N.ru,{lpTitle:'Голосование за составы',lpVoted:(n,m)=>`проголосовали ${n} из ${m}`,lpOpt:n=>`Вариант ${n}`,
    lpVote:'Голосую за этот',lpMine:'ваш голос',lpLogin:'Войти, чтобы проголосовать',lpNotVoter:'Голосуют только игроки, которых отметил админ.',
    lpNotPlayer:'Голосуют только игроки команды. Привяжите аккаунт к себе в составе (профиль).',lpRule:'Побеждает вариант, за который больше половины голосующих. Голос можно поменять.',
    lpThanks:'Голос принят',lpWon:'Составы определены',lpWinner:'выбран',lpClosed:'Голосование закрыто',lpVotesN:n=>`${n} ${n%10===1&&n%100!==11?'голос':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'голоса':'голосов'}`,
    lpWho:'Голосуют',lpOpenB:'Голосование открытое: видно, кто за какой вариант.',lpAvg:'сила',
    lpAdd:'В голосование',lpAdded:n=>`Вариант добавлен в голосование (вариантов: ${n})`,lpDraft:'Новое голосование за составы',lpDraftHint:'Нажимайте «В голосование» под нужными вариантами деления — они появятся здесь. Позицию можно поменять, стрелкой ⇄ — перевести игрока в другую команду. Нужно минимум 2 варианта.',
    lpDate:'Дата игры',lpVoters:'Кто голосует',lpFromPresent:'кто на игре',lpAll:'все',lpNone:'никого',lpOpen:'Открыть голосование',lpOpened:'Голосование открыто',
    lpNeed2:'Добавьте хотя бы 2 варианта',lpNeedV:'Отметьте хотя бы двух голосующих',lpRm:'Убрать',lpClear:'Очистить',
    lpApprove:'Утвердить этот',lpApproveQ:'Утвердить этот вариант и закрыть голосование?',lpReopen:'Открыть снова',lpDel:'Удалить',lpDelQ:'Удалить голосование вместе с голосами?',
    lpShare:'Ссылка для WhatsApp',lpShareTxt:d=>`🗳 Голосование за составы на ${d}. Голосуйте здесь:`,lpCopied:'Скопировано',lpScorer:'В счётчик',lpNeedSQL:'Голосование ещё не включено: админу нужно выполнить SQL (раздел 6g).',
    lpE:{lp_not_player:'Голосуют только игроки команды',lp_closed:'Голосование уже закрыто',lp_not_voter:'Вы не в списке голосующих',lp_bad_choice:'Такого варианта нет'}});
  Object.assign(I18N.az,{lpTitle:'Heyətlər üçün səsvermə',lpVoted:(n,m)=>`${m} nəfərdən ${n} səs verdi`,lpOpt:n=>`Variant ${n}`,
    lpVote:'Buna səs verirəm',lpMine:'sizin səsiniz',lpLogin:'Səs vermək üçün daxil olun',lpNotVoter:'Yalnız adminin qeyd etdiyi oyunçular səs verir.',
    lpNotPlayer:'Yalnız komanda oyunçuları səs verir. Profildə hesabınızı heyətdəki adınıza bağlayın.',lpRule:'Səs verənlərin yarıdan çoxunun seçdiyi variant qalib gəlir. Səsi dəyişmək olar.',
    lpThanks:'Səs qəbul edildi',lpWon:'Heyətlər müəyyən olundu',lpWinner:'seçildi',lpClosed:'Səsvermə bağlanıb',lpVotesN:n=>`${n} səs`,
    lpWho:'Səs verənlər',lpOpenB:'Səsvermə açıqdır: kimin hansı varianta səs verdiyi görünür.',lpAvg:'güc',
    lpAdd:'Səsverməyə',lpAdded:n=>`Variant səsverməyə əlavə olundu (variant: ${n})`,lpDraft:'Heyətlər üçün yeni səsvermə',lpDraftHint:'Lazımi bölgü variantlarının altında «Səsverməyə» düyməsini basın — onlar burada görünəcək. Mövqeyi dəyişmək, ⇄ oxu ilə oyunçunu digər komandaya keçirmək olar. Ən azı 2 variant lazımdır.',
    lpDate:'Oyunun tarixi',lpVoters:'Kim səs verir',lpFromPresent:'oyunda olanlar',lpAll:'hamısı',lpNone:'heç kim',lpOpen:'Səsverməni aç',lpOpened:'Səsvermə açıldı',
    lpNeed2:'Ən azı 2 variant əlavə edin',lpNeedV:'Ən azı iki səs verən qeyd edin',lpRm:'Çıxar',lpClear:'Təmizlə',
    lpApprove:'Bunu təsdiqlə',lpApproveQ:'Bu variant təsdiqlənsin və səsvermə bağlansın?',lpReopen:'Yenidən aç',lpDel:'Sil',lpDelQ:'Səsvermə səslərlə birlikdə silinsin?',
    lpShare:'WhatsApp üçün link',lpShareTxt:d=>`🗳 ${d} oyunu üçün heyətlər səsverməsi. Səs verin:`,lpCopied:'Kopyalandı',lpScorer:'Hesablayıcıya',lpNeedSQL:'Səsvermə hələ qoşulmayıb: admin SQL-i (6g bölməsi) icra etməlidir.',
    lpE:{lp_not_player:'Yalnız komanda oyunçuları səs verir',lp_closed:'Səsvermə artıq bağlanıb',lp_not_voter:'Siz səs verənlərin siyahısında deyilsiniz',lp_bad_choice:'Belə variant yoxdur'}});
  Object.assign(I18N.en,{lpTitle:'Team split vote',lpVoted:(n,m)=>`${n} of ${m} voted`,lpOpt:n=>`Option ${n}`,
    lpVote:'Vote for this one',lpMine:'your vote',lpLogin:'Log in to vote',lpNotVoter:'Only players marked by the admin can vote.',
    lpNotPlayer:'Only team players can vote. Link your account to yourself in the roster (profile).',lpRule:'The option backed by more than half of the voters wins. You can change your vote.',
    lpThanks:'Vote saved',lpWon:'Teams are set',lpWinner:'chosen',lpClosed:'Voting closed',lpVotesN:n=>`${n} vote${n===1?'':'s'}`,
    lpWho:'Voters',lpOpenB:'Open ballot: everyone sees who voted for which option.',lpAvg:'strength',
    lpAdd:'Add to vote',lpAdded:n=>`Option added to the vote (options: ${n})`,lpDraft:'New team split vote',lpDraftHint:'Press “Add to vote” under the splits you like — they will appear here. You can change positions and move a player to the other team with ⇄. At least 2 options are needed.',
    lpDate:'Game date',lpVoters:'Who votes',lpFromPresent:'present',lpAll:'all',lpNone:'none',lpOpen:'Open voting',lpOpened:'Voting is open',
    lpNeed2:'Add at least 2 options',lpNeedV:'Mark at least two voters',lpRm:'Remove',lpClear:'Clear',
    lpApprove:'Approve this',lpApproveQ:'Approve this option and close voting?',lpReopen:'Reopen',lpDel:'Delete',lpDelQ:'Delete this vote together with all votes?',
    lpShare:'Link for WhatsApp',lpShareTxt:d=>`🗳 Team split vote for ${d}. Vote here:`,lpCopied:'Copied',lpScorer:'To scorer',lpNeedSQL:'Voting is not enabled yet: the admin needs to run the SQL (section 6g).',
    lpE:{lp_not_player:'Only team players can vote',lp_closed:'Voting is already closed',lp_not_voter:'You are not on the voters list',lp_bad_choice:'No such option'}});

  const X=()=>CL.ctx(), esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const L={polls:null,cnt:{},voted:{},mine:{},at:0,busy:null,noTable:false};
  const DK='sb.lpDraft';
  const draft=()=>{ try{ const d=JSON.parse(localStorage.getItem(DK)||'null'); return d&&Array.isArray(d.opts)?d:{opts:[]}; }catch(e){ return {opts:[]}; } };
  const setDraft=d=>{ try{ localStorage.setItem(DK,JSON.stringify(d)); }catch(e){} };
  const me=()=>{ const c=X().C; return c.profile&&['player','admin'].includes(c.profile.role)?c.profile.player_id:null; };
  const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const nextSat=()=>{ const d=new Date(); d.setDate(d.getDate()+((6-d.getDay()+7)%7||7)); return ymd(d); };
  const errMsg=e=>{ const m=(e&&e.message)||''; const k=Object.keys(T('lpE')).find(k=>m.includes(k)); return k?T('lpE')[k]:m; };
  const TD=()=>(typeof TEAM_DEF!=='undefined'?TEAM_DEF:[{name:'Bina Warriors',color:'#D85A30'},{name:'Gilavar Baku',color:'#1f6fc0'}]);
  const str=id=>{ const p=S.players[id]; if(!p) return 6.5; try{ return strengthOf(p).v; }catch(e){ return p.level||6.5; } };

  function load(force){
    const c=X().C; if(!c.ok||!c.sb) return Promise.resolve();
    const uid=c.user?c.user.id:''; if(!force&&L.polls&&Date.now()-L.at<60e3&&L.uid===uid) return Promise.resolve();
    if(L.busy) return L.busy;
    L.busy=(async()=>{
      const {data,error}=await c.sb.from('lineup_polls').select('*').order('id',{ascending:false}).limit(6);
      if(error){ L.noTable=true; L.polls=[]; return; }
      L.noTable=false; L.polls=data||[]; L.at=Date.now(); L.uid=uid;
      await Promise.all(L.polls.map(async p=>{
        const a=await c.sb.rpc('lineup_counts',{p_poll:p.id}); L.cnt[p.id]=a.data||[];
        const b=await c.sb.rpc('lineup_voted',{p_poll:p.id}); L.voted[p.id]=(b.data||[]).map(x=>typeof x==='string'?x:(x.lineup_voted||x.voter_player));
        const q=await c.sb.rpc('lineup_ballots',{p_poll:p.id}); L.bal=L.bal||{}; L.bal[p.id]=q.error?null:(q.data||[]);
      }));
      L.mine={};
      if(c.user){ const v=await c.sb.from('lineup_votes').select('poll_id,choice,voter').eq('voter',c.user.id); (v.data||[]).forEach(x=>L.mine[x.poll_id]=x.choice); }
    })().finally(()=>{L.busy=null;});
    return L.busy;
  }

  // один вариант: две команды в колонку
  const POSL=['P','C','SS','1B','2B','3B','LF','LCF','CF','RCF','RF','SF','EH'];
  function optHtml(o,ei){ const ed=ei!=null;
    return `<div class="lp-teams">${['A','B'].map((k,ti)=>{ const d=TD()[ti], rows=o[k]||[], sub=ed?false:o[ti?'sb':'sa'];
      const avg=rows.length?rows.reduce((s,[id])=>s+str(id),0)/rows.length:0;
      return `<div class="lp-team"><div class="lp-th" style="--tc:${d.color}"><i></i><b>${esc(d.name)}</b><span>${T('lpAvg')} ${avg.toFixed(2)}</span></div>
        ${rows.map(([id,pos],i)=>{ const p=S.players[id]; return (sub&&i===(rows[0]&&rows[0][1]==='P'?1:0)?`<div class="lp-r lp-subc"><span class="chip">C</span><span class="muted">${esc(T('tmSubCs')||'—')}</span></div>`:'')+
          `<div class="lp-r">${ed?`<select class="lp-ps" onchange="LP.pos(${ei},'${k}',${i},this.value)">${POSL.map(x=>`<option ${x===pos?'selected':''}>${x}</option>`).join('')}</select>`:`<span class="chip ${pos==='EH'?'':'main'}">${esc(pos)}</span>`}${p?av(p):''}<span class="lp-n">${esc(p?pname(p):id)}</span>${ed?`<button type="button" class="lp-mv" title="⇄" onclick="LP.move(${ei},'${k}',${i})">${ti?'⇠':'⇢'}</button>`:''}</div>`; }).join('')}</div>`; }).join('')}</div>`;
  }
  function card(p,full){
    const c=X().C, adm=X().isAdmin(), mine=me(), voters=p.voters||[], voted=L.voted[p.id]||[], my=L.mine[p.id];
    const cnt={}; (L.cnt[p.id]||[]).forEach(r=>cnt[r.choice]=r.votes);
    const bal=(L.bal||{})[p.id], open=p.status==='open', canVote=open&&c.user&&mine&&voters.includes(mine);
    let h=`<div class="card lp-card" id="lp-${p.id}"><div class="lp-head"><div><span class="eyebrow">🗳 ${T('lpTitle')}</span>
      <div class="lp-date">${fmtDate(p.game_date)} · ${open?T('lpVoted')(voted.length,voters.length):`<b class="lp-won">✓ ${T('lpWon')}</b>`}</div></div>
      <div class="lp-hb"><button class="btn sm" onclick="LP.share(${p.id})">🔗 ${T('lpShare')}</button>
      ${adm?(open?'':`<button class="btn sm" onclick="LP.reopen(${p.id})">${T('lpReopen')}</button>`)+`<button class="btn sm danger" onclick="LP.del(${p.id})">${T('lpDel')}</button>`:''}</div></div>`;
    if(open) h+=`<p class="lp-note">${T('lpRule')}${bal?' '+T('lpOpenB'):''}</p>`;
    h+=`<div class="lp-opts">${(p.options||[]).map((o,i)=>{ const n=cnt[i]||0, win=!open&&p.winner===i, pct=voters.length?Math.round(n/voters.length*100):0;
      if(!open&&!win&&!full) return '';
      return `<div class="lp-opt${win?' win':''}${my===i?' mine':''}${!open&&!win?' lose':''}"><div class="lp-oh"><b>${T('lpOpt')(i+1)}</b>${win?`<span class="lp-badge">✓ ${T('lpWinner')}</span>`:''}${my===i?`<span class="lp-my">${T('lpMine')}</span>`:''}
        <span class="lp-cnt">${T('lpVotesN')(n)}</span></div><div class="lp-bar"><i style="width:${pct}%"></i></div>${bal?`<div class="lp-by">${bal.filter(x=>x.choice===i).map(x=>{ const pl=S.players[x.voter_player]; return `<span class="lp-v ok">${pl?av(pl):''}<span>${esc(pl?first(pl):x.voter_player)}</span></span>`; }).join('')||`<span class="muted small">—</span>`}</div>`:''}${optHtml(o)}
        ${canVote?`<button class="btn ${my===i?'':'pri'} lp-vb" ${my===i?'disabled':''} onclick="LP.vote(${p.id},${i},this)">${my===i?'✓ '+T('lpMine'):T('lpVote')}</button>`:''}
        ${adm&&open?`<button class="btn sm lp-ab" onclick="LP.approve(${p.id},${i})">${T('lpApprove')}</button>`:''}
        ${adm&&win&&S.scorer!==false?`<button class="btn sm pri lp-ab" onclick="LP.scorer(${p.id})">▶ ${T('lpScorer')}</button>`:''}</div>`; }).join('')}</div>`;
    if(open){
      if(!c.user) h+=`<button class="btn pri" onclick="CL.auth('login')">${T('lpLogin')}</button>`;
      else if(!mine) h+=`<p class="lp-note">${T('lpNotPlayer')}</p>`;
      else if(!voters.includes(mine)) h+=`<p class="lp-note">${T('lpNotVoter')}</p>`;
      h+=`<div class="lp-who"><span class="muted small">${T('lpWho')}:</span>${voters.map(id=>{ const pl=S.players[id]; return `<span class="lp-v${voted.includes(id)?' ok':''}" title="${esc(pl?pname(pl):id)}">${pl?av(pl):''}<span>${esc(pl?first(pl):id)}</span>${bal&&bal.find(x=>x.voter_player===id)?`<em class="lp-to">→ ${bal.find(x=>x.voter_player===id).choice+1}</em>`:''}</span>`; }).join('')}</div>`;
    }
    return h+'</div>';
  }

  /* ---------- Админ: черновик на странице «Составы» ---------- */
  const A={date:null,voters:null};
  function adminDraft(){
    const d=draft(); if(!X().isAdmin()) return '';
    if(!A.date) A.date=d.date||nextSat();
    if(!A.voters){ let pr=[]; try{ pr=JSON.parse(localStorage.getItem('sb.present')||'[]'); }catch(e){} A.voters=new Set((d.voters||pr).filter(id=>S.players[id])); }
    const ids=Object.keys(S.players).sort((a,b)=>pname(S.players[a]).localeCompare(pname(S.players[b])));
    return `<div class="card lp-draft"><div class="lp-head"><div><span class="eyebrow">🗳 ${T('lpDraft')}</span><div class="lp-note">${T('lpDraftHint')}</div></div>
      ${d.opts.length?`<div class="lp-hb"><button class="btn sm" onclick="LP.clear()">${T('lpClear')}</button></div>`:''}</div>
      ${d.opts.length?`<div class="lp-opts">${d.opts.map((o,i)=>`<div class="lp-opt"><div class="lp-oh"><b>${T('lpOpt')(i+1)}</b><button class="btn sm" onclick="LP.rm(${i})">✕ ${T('lpRm')}</button></div>${optHtml(o,i)}</div>`).join('')}</div>`:''}
      <div class="lp-arow"><label>${T('lpDate')} <input type="date" value="${A.date}" onchange="LP.date(this.value)"></label>
        <span class="lp-qs">${T('lpVoters')}: <b id="lp-vn">${A.voters.size}</b> <button class="btn sm" onclick="LP.fill('present')">${T('lpFromPresent')}</button><button class="btn sm" onclick="LP.fill('all')">${T('lpAll')}</button><button class="btn sm" onclick="LP.fill('none')">${T('lpNone')}</button></span></div>
      <div class="mv-checks lp-checks">${ids.map(id=>`<label class="mv-ck${A.voters.has(id)?' on':''}"><input type="checkbox" value="${esc(id)}" ${A.voters.has(id)?'checked':''} onchange="LP.tick(this)">${av(S.players[id])}<span>${esc(pname(S.players[id]))}</span></label>`).join('')}</div>
      <button class="btn pri big" onclick="LP.open()">${T('lpOpen')}</button></div>`;
  }

  /* ---------- Размещение ---------- */
  function page(){ const h=(location.hash||'').slice(1), i=h.indexOf('-'); return i<0?h:h.slice(0,i); }
  function homePoll(){ if(!L.polls) return null; const o=L.polls.find(p=>p.status==='open'); if(o) return o;
    return L.polls.find(p=>p.status==='closed'&&p.closed_at&&Date.now()-new Date(p.closed_at).getTime()<3*864e5)||null; }
  function place(){
    const c=X().C; if(!c.ok) return;
    const pg=page(), FR=window.FEATURE_ROUTES||{}, home=!['player','game','games','admin','me','live'].includes(pg)&&!FR[pg];
    document.querySelectorAll('.lp-sec').forEach(e=>e.remove());
    const box=document.createElement('div'); box.className='lp-sec';
    if(pg==='teams'){
      const head=document.querySelector('#app .pagehead'); if(!head) return;
      const polls=(L.polls||[]).filter(p=>p.status==='open'||(p.closed_at&&Date.now()-new Date(p.closed_at).getTime()<7*864e5));
      box.innerHTML=polls.map(p=>card(p,true)).join('')+(X().isAdmin()?(L.noTable?`<div class="card lp-note">${T('lpNeedSQL')}</div>`:adminDraft()):'');
      if(box.innerHTML) head.after(box);
      addBtn();
      if(location.hash.startsWith('#teams-lp')){ const el=box.querySelector('.lp-card'); el&&setTimeout(()=>el.scrollIntoView({block:'start',behavior:'smooth'}),50); }
      return;
    }
    if(!home) return;
    const p=homePoll(); if(!p) return;
    box.innerHTML=card(p,false);
    const anchor=document.querySelector('#app .mv-sec')||document.getElementById('cl-next');
    if(anchor) anchor.after(box); else { const a=document.getElementById('app'); a&&a.prepend(box); }
    if(location.hash==='#vote'&&!L.jumped){ L.jumped=true; setTimeout(()=>{ const el=document.querySelector('.lp-sec'); if(!el) return; const hd=document.querySelector('.top'); scrollTo({top:el.getBoundingClientRect().top+scrollY-(hd?hd.getBoundingClientRect().bottom:0)-10,behavior:'smooth'}); },900); }
  }
  // кнопка «В голосование» под результатом деления (только админу)
  function addBtn(){
    if(!X().isAdmin()) return; const res=document.querySelector('#tmOut .tm-res'); if(!res||res.querySelector('.lp-add')) return;
    const b=document.createElement('div'); b.className='btns center lp-add';
    b.innerHTML=`<button class="btn pri" onclick="LP.add()">🗳 ${T('lpAdd')}</button>`; res.appendChild(b);
  }
  async function refresh(force){ await load(force); place(); }

  function winTeams(p){ return p.options[p.winner]; }
  window.LP={
    vote:async(id,i,btn)=>{ const c=X().C; if(btn) btn.classList.add('busy');
      const {data,error}=await c.sb.rpc('cast_lineup_vote',{p_poll:id,p_choice:i});
      if(error){ toast(errMsg(error)); if(btn) btn.classList.remove('busy'); return; }
      toast(data&&data.closed?'✓ '+T('lpWon'):T('lpThanks')); L.mine[id]=i; await refresh(true); },
    approve:async(id,i)=>{ if(!confirm(T('lpApproveQ'))) return; const c=X().C;
      const {error}=await c.sb.from('lineup_polls').update({status:'closed',winner:i,closed_at:new Date().toISOString()}).eq('id',id);
      if(error){ X().fail(error); return; } await refresh(true); },
    reopen:async id=>{ const c=X().C; const {error}=await c.sb.from('lineup_polls').update({status:'open',winner:null,closed_at:null}).eq('id',id);
      if(error){ X().fail(error); return; } await refresh(true); },
    del:async id=>{ if(!confirm(T('lpDelQ'))) return; const c=X().C; const {error}=await c.sb.from('lineup_polls').delete().eq('id',id);
      if(error){ X().fail(error); return; } await refresh(true); },
    share:async id=>{ const p=(L.polls||[]).find(x=>x.id===id); if(!p) return;
      const txt=`${T('lpShareTxt')(fmtDate(p.game_date,{day:'numeric',month:'long'}))}\n${location.origin}${location.pathname}#vote`;
      try{ await navigator.clipboard.writeText(txt); }catch(e){ const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy')}catch(_){} ta.remove(); }
      toast(T('lpCopied')); },
    scorer:id=>{ const p=(L.polls||[]).find(x=>x.id===id); if(!p||p.winner==null) return; const w=winTeams(p), o={v:1};
      ['A','B'].forEach((k,ti)=>{ o[k]={n:TD()[ti].name,c:TD()[ti].color,l:w[k]}; });
      const b64=btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
      location.href=new URL('scorer/#lineup='+b64,location.href.split('#')[0]).href; },
    // черновик (админ)
    add:()=>{ if(typeof tmTeams!=='function') return; const t=tmTeams(), d=draft();
      d.opts.push({A:t[0].map(x=>[x.p.id,x.pos]),B:t[1].map(x=>[x.p.id,x.pos]),sa:!!t[0].subC,sb:!!t[1].subC}); if(d.opts.length>6) d.opts.shift();
      setDraft(d); toast(T('lpAdded')(d.opts.length)); place(); },
    pos:(i,k,r,v)=>{ const d=draft(); d.opts[i][k][r][1]=v; setDraft(d); },
    move:(i,k,r)=>{ const d=draft(), o=d.opts[i], to=k==='A'?'B':'A'; const [x]=o[k].splice(r,1); x[1]='EH'; o[to].push(x);
      const ord=POSL; o[to].sort((a,b)=>ord.indexOf(a[1])-ord.indexOf(b[1])); setDraft(d); place(); },
    rm:i=>{ const d=draft(); d.opts.splice(i,1); setDraft(d); place(); },
    clear:()=>{ setDraft({opts:[]}); A.voters=null; place(); },
    date:v=>{ A.date=v; const d=draft(); d.date=v; setDraft(d); },
    tick:el=>{ el.checked?A.voters.add(el.value):A.voters.delete(el.value); el.closest('.mv-ck').classList.toggle('on',el.checked);
      const d=draft(); d.voters=[...A.voters]; setDraft(d); const n=document.getElementById('lp-vn'); if(n) n.textContent=A.voters.size; },
    fill:k=>{ let pr=[]; try{ pr=JSON.parse(localStorage.getItem('sb.present')||'[]'); }catch(e){}
      A.voters=new Set(k==='all'?Object.keys(S.players):k==='none'?[]:pr.filter(id=>S.players[id])); const d=draft(); d.voters=[...A.voters]; setDraft(d); place(); },
    open:async()=>{ const d=draft(); if(d.opts.length<2){ toast(T('lpNeed2')); return; } if(A.voters.size<2){ toast(T('lpNeedV')); return; }
      d.opts.forEach(o=>{ o.sa=!o.A.some(x=>x[1]==='C'); o.sb=!o.B.some(x=>x[1]==='C'); });
      const c=X().C; const {error}=await c.sb.from('lineup_polls').insert({game_date:A.date,options:d.opts,voters:[...A.voters]});
      if(error){ X().fail(error); return; } setDraft({opts:[]}); A.voters=null; toast(T('lpOpened')); await refresh(true);
      const el=document.querySelector('.lp-card'); el&&el.scrollIntoView({block:'start',behavior:'smooth'}); }
  };
  const _route=route; route=function(){ _route(); place(); load().then(place); };
  if(typeof tmRender==='function'){ const _tr=tmRender; tmRender=function(){ _tr.apply(this,arguments); addBtn(); }; }
  setInterval(()=>{ if(document.visibilityState==='visible'&&L.polls&&L.polls.some(p=>p.status==='open')) refresh(true); },60e3);
})();
