/* Разбор рейтинга игрока за игру по эпизодам (16.11.2026).
   Нажатие на рейтинг в «Все игры» на странице игрока или в таблице команды на странице игры →
   окно: старт BASE, каждый эпизод с участием игрока (бита, ран, защита, ошибки, подача) с изменением рейтинга
   и нарастающим итогом, кнопка ▶ — встроенный плеер (тот же, что у протокола: a.hl[data-yt] внутри .hls).
   Очки считаются по тем же весам W, что и ratingParts() в app.js; сумма сходится с итогом box
   (в plays для этого есть поля po, a, fpo, rbi, pk, pbb, ofb — см. tools/enrich_plays.py). */
(function(){
  Object.assign(I18N.ru,{rbTitle:'Разбор рейтинга',rbStart:'Старт',rbPos:'Бонус за позицию',rbTotal:'Итог за игру',rbHint:'нажмите ▶, чтобы посмотреть эпизод',
    rbBat:'на бите',rbRun:'ран',rbRBI:'RBI',rbFPO:'сам сделал аут',rbFPO2:'ловля при бегуне на 2-й',rbFPO3:'ловля при бегуне на 3-й',rbA:'передача на аут',rbPO:'принял бросок',rbE:'ошибка',rbE2:'ошибка (2 базы)',rbE3:'ошибка (3+ базы)',rbPK:'страйк-аут на подаче',rbPBB:'уок на подаче',rbOut:'аут на бите',rbNoPlays:'Для этой игры нет подробного протокола.',rbClamp:'рейтинг ограничен шкалой 3–10',rbOpen:'Разбор по эпизодам',rbTapHint:'нажмите на рейтинг — разбор по эпизодам'});
  Object.assign(I18N.az,{rbTitle:'Reytinqin təhlili',rbStart:'Başlanğıc',rbPos:'Mövqe bonusu',rbTotal:'Oyun üzrə yekun',rbHint:'epizoda baxmaq üçün ▶ basın',
    rbBat:'vuruşda',rbRun:'qaçış',rbRBI:'RBI',rbFPO:'özü aut etdi',rbFPO2:'2-ci bazada qaçışçı ilə tutma',rbFPO3:'3-cü bazada qaçışçı ilə tutma',rbA:'auta ötürmə',rbPO:'ötürməni qəbul etdi',rbE:'səhv',rbE2:'səhv (2 baza)',rbE3:'səhv (3+ baza)',rbPK:'atışda strayk-aut',rbPBB:'atışda uok',rbOut:'vuruşda aut',rbNoPlays:'Bu oyun üçün ətraflı protokol yoxdur.',rbClamp:'reytinq 3–10 şkalası ilə məhdudlaşır',rbOpen:'Epizodlar üzrə təhlil',rbTapHint:'epizodlar üzrə təhlil üçün reytinqə basın'});
  Object.assign(I18N.en,{rbTitle:'Rating breakdown',rbStart:'Start',rbPos:'Position bonus',rbTotal:'Game total',rbHint:'tap ▶ to watch the play',
    rbBat:'at bat',rbRun:'run scored',rbRBI:'RBI',rbFPO:'unassisted out',rbFPO2:'catch, runner on 2nd',rbFPO3:'catch, runner on 3rd',rbA:'assist',rbPO:'caught the throw',rbE:'error',rbE2:'error (2 bases)',rbE3:'error (3+ bases)',rbPK:'strikeout pitching',rbPBB:'walk allowed',rbOut:'out at bat',rbNoPlays:'No detailed play-by-play for this game.',rbClamp:'rating is capped to the 3–10 scale',rbOpen:'Play-by-play breakdown',rbTapHint:'tap a rating for the play-by-play breakdown'});
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const HIT=['1B','2B','3B','HR'];
  function items(g,pid,b){
    const pos=String(b.pos||'').split(/[\/,\s]/)[0], of=OF_POS.has(pos), R=T('pbR'), out=[];
    for(const x of g.plays||[]){
      const L=[];
      if(x.b===pid){ const r=x.r;
        if(HIT.includes(r)||['BB','ROE','K'].includes(r)) L.push([R[r]||r,W[r]]);
        else if(r==='FC'&&!x.dp) L.push([R.FC,W.FC]);
        else if(r!=='SAC') L.push([`${T('rbOut')} · ${R[r]||r}`,W.OUT]);
        if(x.rbi) L.push([`${T('rbRBI')}${x.rbi>1?' ×'+x.rbi:''}`,W.RBI*x.rbi]); }
      if((x.sc||[]).includes(pid)) L.push([T('rbRun'),W.R]);
      if(x.fpo===pid){ const k=(x.ofb||{})[pid]; L.push(of?[k===3?T('rbFPO3'):k===2?T('rbFPO2'):T('rbFPO'),k===3?W.OFF3:k===2?W.OFF2:W.OFPO]:[T('rbFPO'),W.FPO]); }
      const npo=(x.po||[]).filter(q=>q===pid).length-(x.fpo===pid?1:0); for(let k=0;k<npo;k++) L.push([T('rbPO'),W.RPO]);
      for(const q of x.a||[]) if(q===pid) L.push([T('rbA'),of?W.OFA:W.A]);
      (x.e||[]).forEach((q,k)=>{ if(q!==pid) return; const eb=x.eb?x.eb[k]:1; L.push(eb>=3?[T('rbE3'),W.E3]:eb===2?[T('rbE2'),W.E2]:[T('rbE'),W.E]); });
      if(x.pk===pid) L.push([T('rbPK'),W.PK]);
      if(x.pbb===pid) L.push([T('rbPBB'),W.PBB]);
      if(L.length) out.push({x,L,d:L.reduce((s,[,v])=>s+v,0)});
    }
    const posB=(of?W.OFPOS:0)+(pos==='C'?W.CPOS:0);
    return {out,posB};
  }
  const sg=v=>{ const r=Math.round(v*100)/100; return `<span class="pts ${r>0?'pos':r<0?'neg':''}">${r>0?'+':r<0?'−':'±'}${Math.abs(r).toFixed(2)}</span>`; };
  function spark(vals){
    const w=560,h=70,p=6,mn=Math.min(...vals)-.25,mx=Math.max(...vals)+.25;
    const X=i=>p+i*(w-2*p)/Math.max(1,vals.length-1), Y=v=>h-p-(v-mn)/(mx-mn)*(h-2*p);
    const pts=vals.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    return `<svg class="rb-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="${w}" y1="${Y(BASE)}" y2="${Y(BASE)}" class="rb-base"/><polyline points="${pts}" class="rb-line"/>${vals.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="2.6" class="rb-dot"/>`).join('')}</svg>`;
  }
  window.rbOpen=function(gid,pid){
    const g=S.games.find(x=>x.id===gid), p=S.players[pid]; if(!g||!p) return;
    const b=g.box.find(x=>x.player===pid); if(!b) return;
    const yt=g.video?ytId(g.video):null, R=T('pbR'), nm=id=>{const q=S.players[id]; return q?esc(pname(q)):esc(id);};
    let body='';
    if(!g.plays||!g.plays.length){ body=`<div class="empty">${T('rbNoPlays')}</div>`; }
    else{
      const {out,posB}=items(g,pid,b); let cur=BASE; const vals=[BASE];
      let rows=`<div class="rb-row rb-start"><span class="rb-ep">${T('rbStart')}</span><span class="rb-d"></span><span class="rb-cur">${BASE.toFixed(2)}</span></div>`;
      if(posB){ cur+=posB; vals.push(cur); rows+=`<div class="rb-row"><span class="rb-ep">${T('rbPos')} · ${esc(b.pos)}</span><span class="rb-d">${sg(posB)}</span><span class="rb-cur">${cur.toFixed(2)}</span></div>`; }
      let lastInn='';
      for(const {x,L,d} of out){
        cur+=d; vals.push(cur);
        const inn=`${x.i}${x.h==='T'?'▲':'▼'}`;
        if(inn!==lastInn){ rows+=`<div class="rb-inn">${x.i} ${T('pbInn')} · ${x.h==='T'?T('pbTop'):T('pbBot')}</div>`; lastInn=inn; }
        const who=x.b===pid?'':`<span class="muted">${nm(x.b)} — ${R[x.r]||x.r} · </span>`;
        const play=yt&&x.t!=null?`<a class="hl pb-play" href="${ytAt(g.video,x.t)}" target="_blank" rel="noopener" data-yt="${yt}" data-t="${x.t}" data-lbl="${inn} · ${nm(x.b)} — ${R[x.r]||x.r}">▶ ${fmtT(x.t)}</a>`:'<span class="pb-play rb-noplay">—</span>';
        rows+=`<div class="rb-row">${play}<span class="rb-ep">${who}${L.map(([n,v])=>`${esc(n)} <i>${sg(v)}</i>`).join(' · ')}</span><span class="rb-d">${sg(d)}</span><span class="rb-cur">${cur.toFixed(2)}</span></div>`;
      }
      const fin=b.rating, clamp=Math.abs(Math.min(10,Math.max(3,cur))-cur)>0.001;
      rows+=`<div class="rb-row rb-end"><span class="rb-ep">${T('rbTotal')}${clamp?` <span class="muted">(${T('rbClamp')})</span>`:''}</span><span class="rb-d">${sg(cur-BASE)}</span><span class="rb-cur">${rt(fin)}</span></div>`;
      body=`${spark(vals)}<div class="rb-list hls">${rows}</div><div class="rb-hint muted">${T('rbHint')}</div>`;
    }
    const tm=g.teams[b.team];
    const m=document.createElement('div'); m.className='rb-m';
    m.innerHTML=`<div class="rb-box" role="dialog" aria-label="${T('rbTitle')}"><div class="rb-top"><div class="rb-who">${av(p)}<div><b>${esc(pname(p))}</b><div class="muted">${T('rbTitle')} · ${fmtDate(g.date)} · <span style="color:${tm.color}">${esc(tm.name)}</span> ${g.score.A}:${g.score.B}</div></div></div><button class="hlp-x rb-x" aria-label="×">×</button></div>${body}</div>`;
    const close=()=>{ m.remove(); document.removeEventListener('keydown',key,true); };
    const key=e=>{ if(e.key==='Escape'&&!document.querySelector('.hlp')) close(); };
    m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('.rb-x')) close(); });
    document.addEventListener('keydown',key,true); document.body.appendChild(m);
  };
})();
