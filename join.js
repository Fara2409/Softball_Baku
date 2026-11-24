/* «Хочу играть» для новичков (23.11.2026).
   #join — страница: когда и где, сколько стоит (первая игра бесплатно, дальше 5 ₼), что взять, кто может (13+ или отцы с сыновьями),
   форма заявки (Supabase join_requests, schema.sql 6k) и кнопка WhatsApp админу.
   На главной — карточка-приглашение для тех, кто не игрок; в админке — список заявок. */
(function(){
  const WA='994517450079', FEE=5;
  Object.assign(I18N.ru,{jnNav:'Хочу играть',jnEyebrow:'Для новичков',jnTitle:'Хочешь играть с нами?',
    jnLead:'Мы — любительская группа софтбола в Баку. Играем для удовольствия, опыт не нужен: всему научим прямо на поле.',
    jnWhen:'Когда и где',jnWhenTxt:'Обычно по воскресеньям в 08:00, в праздники бывают и другие дни. Поле в Амирджане. В дождь не играем.',jnMap:'Открыть на карте',jnNext:'Ближайшая игра',
    jnCost:'Сколько стоит',jnCostTxt:`Первая игра — бесплатно. Дальше — ${FEE} ₼ за игру.`,
    jnBring:'Что взять с собой',jnBringTxt:'Хорошее настроение и интерес. Перчатки, биты и мячи у нас есть.',
    jnWho:'Кто может играть',jnWhoTxt:'С 13 лет. Отцы с сыновьями — особенно приветствуются.',
    jnNew:'Никогда не играл?',jnNewTxt:'Это нормально. Коротко о правилах — в разделе «Правила», а как это выглядит — в наших видео.',jnRules:'Правила',jnVideo:'Видео игр',
    jnForm:'Оставить заявку',jnFormTxt:'Админ напишет вам в WhatsApp и расскажет о ближайшей игре.',
    jnName:'Имя',jnPhone:'Телефон (WhatsApp)',jnAge:'Возраст',jnAges:{teen:'13–17 лет',adult:'18+',dad:'Отец с сыном'},jnExp:'Опыт',jnExps:{none:'Никогда не играл',little:'Пробовал немного',yes:'Играю в бейсбол / софтбол'},
    jnNote:'Комментарий (необязательно)',jnSend:'Отправить заявку',jnSent:'Заявка отправлена! Админ скоро напишет вам в WhatsApp.',jnOr:'или',jnWa:'Написать админу в WhatsApp',
    jnWaTxt:'Здравствуйте! Хочу играть в софтбол с вами. Увидел сайт softball.az.',jnBadPhone:'Проверьте номер телефона',jnErr:'Не получилось отправить. Напишите админу в WhatsApp.',
    jnCta:'Хочешь играть? Первая игра — бесплатно',jnCtaTxt:'Опыт не нужен, инвентарь есть. С 13 лет.',jnCtaBtn:'Подробнее',
    jnNotListed:'Вас нет в списке и вы хотите играть? Оставьте заявку →',
    jnAdm:'Заявки новичков',jnAdmNone:'Новых заявок нет.',jnAdmSQL:'Заявки ещё не подключены: выполните SQL из раздела 6k (supabase/schema.sql).',
    jnSt:{new:'новая',contacted:'связались',added:'в составе',declined:'отказ'},jnDel:'Удалить',jnDelQ:'Удалить заявку?',jnWaHi:n=>`Здравствуйте, ${n}! Это Softball Baku, вы оставили заявку на сайте.`});
  Object.assign(I18N.az,{jnNav:'Oynamaq istəyirəm',jnEyebrow:'Yeni oyunçular üçün',jnTitle:'Bizimlə oynamaq istəyirsən?',
    jnLead:'Biz Bakıda həvəskar softbol qrupuyuq. Zövq üçün oynayırıq, təcrübə lazım deyil: hər şeyi elə meydançada öyrədərik.',
    jnWhen:'Nə vaxt və harada',jnWhenTxt:'Adətən bazar günləri saat 08:00-da, bayramlarda başqa günlər də olur. Meydança Əmircandadır. Yağışda oynamırıq.',jnMap:'Xəritədə aç',jnNext:'Növbəti oyun',
    jnCost:'Qiyməti',jnCostTxt:`İlk oyun pulsuzdur. Sonra hər oyun ${FEE} ₼.`,
    jnBring:'Özünlə nə gətirməli',jnBringTxt:'Yaxşı əhval və maraq. Əlcək, bita və toplar bizdə var.',
    jnWho:'Kim oynaya bilər',jnWhoTxt:'13 yaşdan. Ataların oğulları ilə gəlməsi xüsusilə xoşdur.',
    jnNew:'Heç oynamamısan?',jnNewTxt:'Problem deyil. Qaydalar qısaca «Qaydalar» bölməsindədir, necə göründüyü isə videolarımızda.',jnRules:'Qaydalar',jnVideo:'Oyun videoları',
    jnForm:'Müraciət et',jnFormTxt:'Admin sizə WhatsApp-da yazacaq və növbəti oyun barədə danışacaq.',
    jnName:'Ad',jnPhone:'Telefon (WhatsApp)',jnAge:'Yaş',jnAges:{teen:'13–17 yaş',adult:'18+',dad:'Ata oğlu ilə'},jnExp:'Təcrübə',jnExps:{none:'Heç oynamamışam',little:'Bir az sınamışam',yes:'Beysbol / softbol oynayıram'},
    jnNote:'Şərh (məcburi deyil)',jnSend:'Müraciəti göndər',jnSent:'Müraciət göndərildi! Admin tezliklə sizə WhatsApp-da yazacaq.',jnOr:'və ya',jnWa:'Adminə WhatsApp-da yaz',
    jnWaTxt:'Salam! Sizinlə softbol oynamaq istəyirəm. softball.az saytını gördüm.',jnBadPhone:'Telefon nömrəsini yoxlayın',jnErr:'Göndərmək alınmadı. Adminə WhatsApp-da yazın.',
    jnCta:'Oynamaq istəyirsən? İlk oyun pulsuzdur',jnCtaTxt:'Təcrübə lazım deyil, inventar var. 13 yaşdan.',jnCtaBtn:'Ətraflı',
    jnNotListed:'Siyahıda yoxsunuz və oynamaq istəyirsiniz? Müraciət edin →',
    jnAdm:'Yeni oyunçuların müraciətləri',jnAdmNone:'Yeni müraciət yoxdur.',jnAdmSQL:'Müraciətlər hələ qoşulmayıb: 6k bölməsindəki SQL-i icra edin (supabase/schema.sql).',
    jnSt:{new:'yeni',contacted:'əlaqə saxlanıldı',added:'heyətdə',declined:'imtina'},jnDel:'Sil',jnDelQ:'Müraciət silinsin?',jnWaHi:n=>`Salam, ${n}! Bu Softball Baku-dur, saytda müraciət etmisiniz.`});
  Object.assign(I18N.en,{jnNav:'Join us',jnEyebrow:'For newcomers',jnTitle:'Want to play with us?',
    jnLead:'We are an amateur softball group in Baku. We play for fun and no experience is needed — we will teach you right on the field.',
    jnWhen:'When and where',jnWhenTxt:'Usually on Sundays at 08:00, sometimes on other days during holidays. The field is in Amirjan. No games in the rain.',jnMap:'Open map',jnNext:'Next game',
    jnCost:'Cost',jnCostTxt:`Your first game is free. After that — ${FEE} ₼ per game.`,
    jnBring:'What to bring',jnBringTxt:'A good mood and curiosity. We have gloves, bats and balls.',
    jnWho:'Who can play',jnWhoTxt:'Ages 13 and up. Fathers with sons are especially welcome.',
    jnNew:'Never played?',jnNewTxt:'That is fine. The basics are in «Rules», and our videos show what it looks like.',jnRules:'Rules',jnVideo:'Game videos',
    jnForm:'Sign up',jnFormTxt:'The admin will message you on WhatsApp about the next game.',
    jnName:'Name',jnPhone:'Phone (WhatsApp)',jnAge:'Age',jnAges:{teen:'13–17',adult:'18+',dad:'Father with son'},jnExp:'Experience',jnExps:{none:'Never played',little:'Tried a little',yes:'I play baseball / softball'},
    jnNote:'Comment (optional)',jnSend:'Send request',jnSent:'Request sent! The admin will message you on WhatsApp soon.',jnOr:'or',jnWa:'Message the admin on WhatsApp',
    jnWaTxt:'Hello! I would like to play softball with you. I found softball.az.',jnBadPhone:'Please check the phone number',jnErr:'Could not send. Please message the admin on WhatsApp.',
    jnCta:'Want to play? Your first game is free',jnCtaTxt:'No experience needed, equipment provided. Ages 13+.',jnCtaBtn:'Learn more',
    jnNotListed:'Not on the list and want to play? Send a request →',
    jnAdm:'Newcomer requests',jnAdmNone:'No new requests.',jnAdmSQL:'Requests are not enabled yet: run the SQL from section 6k (supabase/schema.sql).',
    jnSt:{new:'new',contacted:'contacted',added:'on roster',declined:'declined'},jnDel:'Delete',jnDelQ:'Delete this request?',jnWaHi:n=>`Hello, ${n}! This is Softball Baku — you left a request on our site.`});

  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ctx=()=>window.CL&&CL.ctx?CL.ctx():null;
  const waLink=(num,txt)=>`https://wa.me/${num}?text=${encodeURIComponent(txt)}`;
  const isMember=()=>{ const c=ctx(); const r=c&&c.C.profile&&c.C.profile.role; return r==='player'||r==='admin'; };

  function nextGame(){
    const ev=(window.CL&&CL.events?CL.events():[]).find(e=>e.status!=='cancelled'&&new Date(e.starts_at)>Date.now()-3*3600e3);
    if(!ev) return '';
    const d=new Date(ev.starts_at);
    return `<p class="jn-next">📅 <b>${T('jnNext')}:</b> ${fmtDate(ev.starts_at.slice(0,10),{weekday:'long',day:'numeric',month:'long'})}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}</p>`;
  }
  function joinPage(){
    const yt=(S.links||{}).youtube;
    const info=[['📍',T('jnWhen'),T('jnWhenTxt')+nextGame()+`<a class="btn sm" href="https://maps.google.com/?q=40.4306275,49.9843899" target="_blank" rel="noopener">${T('jnMap')}</a>`],
      ['💸',T('jnCost'),T('jnCostTxt')],['🧢',T('jnBring'),T('jnBringTxt')],['👨‍👦',T('jnWho'),T('jnWhoTxt')],
      ['⚾',T('jnNew'),T('jnNewTxt')+`<span class="jn-links"><a class="btn sm" href="#rules">${T('jnRules')}</a>${yt?`<a class="btn sm" href="${esc(yt)}" target="_blank" rel="noopener">▶ ${T('jnVideo')}</a>`:''}</span>`]];
    const opt=o=>Object.entries(o).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
    app().innerHTML=`<div class="pagehead"><span class="eyebrow">${T('jnEyebrow')}</span><h1>${T('jnTitle')}</h1><p class="muted">${T('jnLead')}</p></div>
      <div class="jn-grid">${info.map(([i,h,t])=>`<div class="card jn-i"><div class="jn-ic">${i}</div><h3>${h}</h3><div class="jn-t">${t}</div></div>`).join('')}</div>
      <div class="card jn-form" id="jn-form"><h2>${T('jnForm')}</h2><p class="muted">${T('jnFormTxt')}</p>
        <form onsubmit="return JN.send(event)">
          <label>${T('jnName')}<input name="name" required minlength="2" maxlength="60" autocomplete="name"></label>
          <label>${T('jnPhone')}<input name="phone" required type="tel" inputmode="tel" maxlength="20" placeholder="+994 50 123 45 67" autocomplete="tel"></label>
          <label>${T('jnAge')}<select name="age" required>${opt(T('jnAges'))}</select></label>
          <label>${T('jnExp')}<select name="exp">${opt(T('jnExps'))}</select></label>
          <label class="wide">${T('jnNote')}<textarea name="note" maxlength="300" rows="2"></textarea></label>
          <label class="jn-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
          <button class="btn pri big wide" type="submit">${T('jnSend')}</button>
        </form>
        <div class="jn-or"><span>${T('jnOr')}</span></div>
        <a class="btn wa big jn-wa" href="${waLink(WA,T('jnWaTxt'))}" target="_blank" rel="noopener">💬 ${T('jnWa')}</a>
      </div>`;
    const sel=app().querySelector('select[name=age]'); if(sel) sel.value='adult';
    shownAt=Date.now();
  }

  let shownAt=0;
  const done=()=>{ document.getElementById('jn-form').innerHTML=`<div class="jn-done">✅ ${T('jnSent')}</div>`; };
  async function send(ev){
    ev.preventDefault(); const f=ev.target, btn=f.querySelector('button[type=submit]');
    // ловушка для ботов: скрытое поле заполнено или форма отправлена быстрее 3 с — делаем вид, что всё ушло (24.11.2026)
    if(f.website.value||Date.now()-shownAt<3000){ done(); return false; }
    const name=f.name.value.trim(), phone=f.phone.value.trim().replace(/\s+/g,' ');
    if(!/^[+0-9 ()-]{7,20}$/.test(phone)||phone.replace(/\D/g,'').length<7){ toast(T('jnBadPhone')); f.phone.focus(); return false; }
    const row={name,phone,age:f.age.value,exp:f.exp.value,note:f.note.value.trim()||null,lang:LANG};
    const c=ctx(); btn.disabled=true;
    let ok=false;
    if(c&&c.C.sb){ const {error}=await c.C.sb.from('join_requests').insert(row); ok=!error; if(error) console.warn('[join]',error); }
    btn.disabled=false;
    if(ok){ done(); return false; }
    // нет базы / ошибка — то же самое через WhatsApp
    toast(T('jnErr'));
    window.open(waLink(WA,`${T('jnWaTxt')}\n${name}, ${phone}, ${T('jnAges')[row.age]}, ${T('jnExps')[row.exp]}${row.note?`\n${row.note}`:''}`),'_blank','noopener');
    return false;
  }

  /* ---------- главная: приглашение (не игрокам) ---------- */
  function cta(){
    document.querySelectorAll('.jn-cta').forEach(e=>e.remove());
    const h=(location.hash||'#rating').slice(1).split('-')[0]; if(h&&h!=='rating') return;
    if(isMember()||S.demo) return;
    const head=document.querySelector('#app .pagehead')||document.querySelector('#app > *'); if(!head) return;
    const a=document.createElement('a'); a.className='card jn-cta'; a.href='#join';
    a.innerHTML=`<span class="jn-cta-ic">⚾</span><span class="jn-cta-t"><b>${T('jnCta')}</b><span>${T('jnCtaTxt')}</span></span><span class="btn pri sm">${T('jnCtaBtn')} →</span>`;
    head.parentNode.insertBefore(a,head); placeCta();
  }
  function placeCta(){ const a=document.querySelector('.jn-cta'), hb=document.querySelector('#app > .gl-hero-box'); if(a&&hb&&hb.nextElementSibling!==a) hb.after(a); } // сразу под фото команды
  /* ---------- админка: заявки ---------- */
  let REQ=null, noTable=false;
  async function admLoad(){ const c=ctx(); if(!c||!c.C.sb||!c.isAdmin()) return;
    const {data,error}=await c.C.sb.from('join_requests').select('*').order('created_at',{ascending:false}).limit(50);
    noTable=!!error; REQ=error?[]:data||[]; }
  function admDraw(){
    const c=ctx(); if(!c||!c.isAdmin()||(location.hash||'')!=='#admin') return;
    const head=document.querySelector('#app .pagehead'); if(!head||!REQ) return;
    let box=document.getElementById('jn-adm'); if(!box){ box=document.createElement('div'); box.id='jn-adm'; head.after(box); }
    const st=T('jnSt'), digits=s=>{ let d=String(s).replace(/\D/g,''); if(d.length===9) d='994'+d; else if(d.length===10&&d[0]==='0') d='994'+d.slice(1); return d; };
    const n=REQ.filter(r=>r.status==='new').length;
    box.innerHTML=`<div class="section-title" style="margin-top:0"><h2>${T('jnAdm')}${n?` <span class="jn-badge">${n}</span>`:''}</h2></div>`+
      (noTable?`<div class="card lp-note">${T('jnAdmSQL')}</div>`:!REQ.length?`<div class="card empty" style="margin-top:0">${T('jnAdmNone')}</div>`:
      `<div class="card adm-list">${REQ.map(r=>`<div class="jn-req ${esc(r.status)}"><div class="jn-req-t"><b>${esc(r.name)}</b>
        <span class="muted">${esc(r.phone)} · ${esc((T('jnAges')||{})[r.age]||'')} · ${esc((T('jnExps')||{})[r.exp]||'')} · ${new Date(r.created_at).toLocaleDateString()}</span>${r.note?`<span class="jn-note">${esc(r.note)}</span>`:''}</div>
        <div class="jn-req-a"><a class="btn sm wa" href="${waLink(digits(r.phone),T('jnWaHi')(r.name))}" target="_blank" rel="noopener">💬 WhatsApp</a>
          <select onchange="JN.status(${+r.id},this.value)">${Object.entries(st).map(([k,v])=>`<option value="${k}" ${k===r.status?'selected':''}>${v}</option>`).join('')}</select>
          <button class="btn sm danger" onclick="JN.del(${+r.id})">✕</button></div></div>`).join('')}</div>`);
  }
  window.JN={send,
    status:async(id,v)=>{ const c=ctx(); const {error}=await c.C.sb.from('join_requests').update({status:v}).eq('id',id); if(error){ c.fail(error); return; } await admLoad(); admDraw(); },
    del:async id=>{ if(!confirm(T('jnDelQ'))) return; const c=ctx(); const {error}=await c.C.sb.from('join_requests').delete().eq('id',id); if(error){ c.fail(error); return; } await admLoad(); admDraw(); }};

  (window.FEATURE_ROUTES=window.FEATURE_ROUTES||{}).join=joinPage;
  const _route=route; route=function(){ _route(); cta(); if((location.hash||'')==='#admin'){ admDraw(); setTimeout(()=>admLoad().then(admDraw),300); } };
  // вход / выход меняет, кому показывать приглашение
  setInterval(()=>{ const has=!!document.querySelector('.jn-cta'); const h=(location.hash||'#rating').slice(1).split('-')[0];
    if((!h||h==='rating')&&has===isMember()) cta(); else placeCta();
    if((location.hash||'')==='#admin'&&REQ&&!document.getElementById('jn-adm')) admDraw(); },2000);
})();
