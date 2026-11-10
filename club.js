// Softball Baku — аккаунты и онлайн-функции (Supabase).
// Вход и регистрация (или «продолжить как гость»), роли гость / игрок / админ,
// расписание и «буду / не буду», онлайн-счёт из приложения для записи игры,
// комментарии, профиль, страница админа.
// Сайт работает и без этого файла: если Supabase недоступен, статистика открывается как обычно.
'use strict';
(function(){

const SB_URL='https://walqgchpwehlaqgizwxj.supabase.co';
const SB_KEY='sb_publishable_p4odhSPoZi-rvOKZ9-9Ngg_P6lA9ehM'; // публичный ключ (publishable), его можно держать на сайте
const SITE='https://fara2409.github.io/Softball_Baku/';

/* ---------- Переводы ---------- */
const PL_RU={'1B':'Сингл','2B':'Дабл','3B':'Трипл',HR:'Хоум-ран',BB:'Уок',K:'Страйк-аут',GO:'Аут по земле',FO:'Аут в воздухе',FC:'Выбор полевого',E:'Ошибка защиты',SB:'Кража базы',ADV:'Продвижение',RO:'Аут бегуна',EH:'Конец половины иннинга',END:'Конец игры'};
const PL_AZ={'1B':'Sinql','2B':'Dabl','3B':'Tripl',HR:'Homeran',BB:'Uok',K:'Strayk-aut',GO:'Yerdən aut',FO:'Havada aut',FC:'Müdafiəçinin seçimi',E:'Müdafiə səhvi',SB:'Baza oğurluğu',ADV:'İrəliləmə',RO:'Qaçışçı autu',EH:'Yarım innin bitdi',END:'Oyun bitdi'};
const PL_EN={'1B':'Single','2B':'Double','3B':'Triple',HR:'Home run',BB:'Walk',K:'Strikeout',GO:'Groundout',FO:'Flyout',FC:"Fielder's choice",E:'Error',SB:'Stolen base',ADV:'Advance',RO:'Runner out',EH:'Half-inning ended',END:'Game over'};
Object.assign(I18N.ru,{
  cLogin:'Войти',cSignup:'Регистрация',cGuest:'Продолжить как гость',cWelcome:'Добро пожаловать!',
  cWelcomeTxt:'Смотреть сайт можно без регистрации. С аккаунтом можно писать комментарии, а игроки отмечают, придут ли на игру.',
  cName:'Ваше имя',cEmail:'Эл. почта',cPass:'Пароль',cPass2:'Повторите пароль',cErrMismatch:'Пароли не совпадают',cPassHint:'минимум 6 символов',cIAm:'Вы играете в команде?',cFan:'— Нет, я болельщик —',
  cIAmHint:'Когда админ подтвердит, сможете отмечать «буду / не буду».',cForgot:'Забыли пароль?',
  cForgotTxt:'Напишите админу — он задаст вам временный пароль. После входа поменяйте его в профиле.',cBack:'Назад',cTakenSfx:'уже зарегистрирован',
  cErrCreds:'Неверная почта или пароль',cErrExists:'Эта почта уже зарегистрирована — войдите',cErrShort:'Пароль должен быть не короче 6 символов',
  cErrEmail:'Проверьте адрес почты',cErrName:'Укажите имя',cErrNet:'Нет связи. Попробуйте чуть позже.',cErrRate:'Слишком много попыток — подождите несколько минут',
  cErrTaken:'Этот игрок уже привязан к другому аккаунту',cErrPerm:'Нет прав на это действие',cErrGeneric:'Ошибка',
  cConfirmNeeded:'Аккаунт создан, но сайт требует подтверждение почты. Напишите админу.',cHello:n=>`Здравствуйте, ${n}!`,cReqSent:'Заявка игрока отправлена админу',
  cRole_guest:'Гость',cRole_player:'Игрок',cRole_admin:'Админ',cProfile:'Профиль',cLogout:'Выйти',cAdmin:'Админка',
  cSave:'Сохранить',cSaved:'Сохранено',cLinked:'Вы подтверждены как игрок',cPending:p=>`Заявка отправлена: ${p}. Ждёт подтверждения админа.`,
  cRequest:'Я игрок команды',cSendReq:'Отправить заявку',cCancelReq:'Отменить заявку',cChangePass:'Сменить пароль',cNewPass:'Новый пароль',cPassChanged:'Пароль изменён',
  cNotLogged:'Вы не вошли',cNotLoggedTxt:'Войдите или зарегистрируйтесь, чтобы писать комментарии и отмечаться на игры.',
  cNext:'Ближайшие игры',cNextOne:'Следующая игра',cYes:'Буду',cNo:'Не буду',cMaybe:'Может быть',cComing:'будут',
  cCountNo:n=>`не будут: ${n}`,cYesL:'Будут',cMaybeL:'Может быть',cNoL:'Не будут',cOnlyPlayers:'Отмечаться могут только игроки',cPlayerLogin:'Вы игрок? Войдите',cWaitApproval:'Ваша заявка игрока ждёт подтверждения админа',
  cCancelled:'Отменена',cNoEvents:'⏳ Ждём подтверждения следующей игры',cAwait:'Ждём подтверждения игры',cAwaitAdm:'Назначить игру',cToTeams:'Разделить пришедших на команды',
  cAdminTitle:'Панель админа',cRequests:'Заявки игроков',cNoRequests:'Новых заявок нет',cApprove:'Подтвердить',cReject:'Отклонить',cWants:'хочет быть',
  cUsers:'Пользователи',cPlayerL:'Игрок',cReset:'Сбросить пароль',cResetQ:n=>`Задать ${n} новый временный пароль?`,cTempPass:'Временный пароль',
  cTempHint:'Отправьте этот пароль человеку. После входа пусть поменяет его в профиле.',cCopy:'Скопировать',cSendWA:'Отправить в WhatsApp',
  cWAtext:(e,p)=>`Softball Baku: ваш временный пароль для входа на сайт\n${SITE}\nПочта: ${e}\nПароль: ${p}\nПосле входа поменяйте его в профиле.`,
  cSchedule:'Расписание игр',cAddEvent:'Добавить игру',cDate:'Дата',cTime:'Время',cPlace:'Место',cNote:'Примечание',cNotePh:'например: берём свои перчатки',
  cCancelEv:'Отменить',cRestoreEv:'Вернуть',cDelete:'Удалить',cDelQ:'Удалить?',cPast:'прошла',cLiveAdmin:'Онлайн-счёт',
  cLiveHow:'Откройте на телефоне приложение для записи игры, войдя под аккаунтом админа, — счёт будет транслироваться на сайт автоматически.',
  cOpenScorer:'Открыть запись игры',cEndLive:'Завершить трансляцию',cDelLive:'Удалить',cDelLiveQ:'Удалить этот онлайн-счёт вместе с комментариями? Отменить будет нельзя.',cNoLiveRow:'Трансляций пока не было',cYou:'вы',cLastSeen:'вход',cNever:'не входил',
  cLive:'Онлайн',cLivePill:'ОНЛАЙН',cNoLive:'Сейчас игра не идёт',cNoLiveTxt:'Когда начнётся игра, счёт появится здесь в реальном времени.',
  cFinal:'Игра окончена',cFinalShort:'Итог',cPaused:'Нет обновлений',cAtBat:'Отбивает',cOnDeck:'Следующий',cFirstPA:'первый выход сегодня',cTodayL:'сегодня',
  cPlays:'Последние розыгрыши',cLiveBox:'Статистика по ходу игры',cLiveRt:'рейтинг по ходу игры',cUpdated:'обновлено',cWatchLive:'Смотреть онлайн',cRuns:'ран',
  cPl:PL_RU,cComments:'Комментарии',cWrite:'Напишите комментарий…',cSend:'Отправить',cLoginToComment:'Войдите, чтобы комментировать',cNoComments:'Комментариев пока нет',
  cOffline:'Онлайн-функции сейчас недоступны',cOldBrowser:'На этом устройстве вход не работает: браузер слишком старый для онлайн-функций (вход, «буду / не буду», онлайн-счёт). Статистику, игры и рейтинг можно смотреть как обычно. Войти можно с телефона или компьютера с более новой системой.',cTeamsOnly:'Деление на команды — только для игроков',cTeamsOnlyTxt:'Войдите под аккаунтом игрока. Если вы в команде, но ещё не подтверждены, отправьте заявку в профиле.',cPendingN:n=>`Новых заявок: ${n}`,cNow:'сейчас'
});
Object.assign(I18N.az,{
  cLogin:'Daxil ol',cSignup:'Qeydiyyat',cGuest:'Qonaq kimi davam et',cWelcome:'Xoş gəlmisiniz!',
  cWelcomeTxt:'Saytı izləmək üçün qeydiyyat lazım deyil. Hesabla şərh yaza bilərsiniz, oyunçular isə oyuna gəlib-gəlməyəcəklərini qeyd edir.',
  cName:'Adınız',cEmail:'E-poçt',cPass:'Şifrə',cPass2:'Şifrəni təkrarlayın',cErrMismatch:'Şifrələr eyni deyil',cPassHint:'ən azı 6 simvol',cIAm:'Komandada oynayırsınız?',cFan:'— Xeyr, mən azarkeşəm —',
  cIAmHint:'Admin təsdiq edəndən sonra «gələcəyəm / gəlməyəcəyəm» qeyd edə biləcəksiniz.',cForgot:'Şifrəni unutmusunuz?',
  cForgotTxt:'Adminə yazın — o sizə müvəqqəti şifrə verəcək. Daxil olandan sonra onu profilinizdə dəyişin.',cBack:'Geri',cTakenSfx:'artıq qeydiyyatdadır',
  cErrCreds:'E-poçt və ya şifrə səhvdir',cErrExists:'Bu e-poçt artıq qeydiyyatdadır — daxil olun',cErrShort:'Şifrə ən azı 6 simvol olmalıdır',
  cErrEmail:'E-poçtu yoxlayın',cErrName:'Adınızı yazın',cErrNet:'Bağlantı yoxdur. Bir az sonra yenidən cəhd edin.',cErrRate:'Çox cəhd — bir neçə dəqiqə gözləyin',
  cErrTaken:'Bu oyunçu artıq başqa hesaba bağlıdır',cErrPerm:'Bunun üçün icazəniz yoxdur',cErrGeneric:'Xəta',
  cConfirmNeeded:'Hesab yaradıldı, amma sayt e-poçt təsdiqi tələb edir. Adminə yazın.',cHello:n=>`Salam, ${n}!`,cReqSent:'Oyunçu sorğusu adminə göndərildi',
  cRole_guest:'Qonaq',cRole_player:'Oyunçu',cRole_admin:'Admin',cProfile:'Profil',cLogout:'Çıxış',cAdmin:'Admin paneli',
  cSave:'Yadda saxla',cSaved:'Yadda saxlanıldı',cLinked:'Siz oyunçu kimi təsdiqlənmisiniz',cPending:p=>`Sorğu göndərilib: ${p}. Admin təsdiqini gözləyir.`,
  cRequest:'Mən komandanın oyunçusuyam',cSendReq:'Sorğu göndər',cCancelReq:'Sorğunu ləğv et',cChangePass:'Şifrəni dəyiş',cNewPass:'Yeni şifrə',cPassChanged:'Şifrə dəyişdirildi',
  cNotLogged:'Daxil olmamısınız',cNotLoggedTxt:'Şərh yazmaq və oyunlara qeyd olunmaq üçün daxil olun və ya qeydiyyatdan keçin.',
  cNext:'Növbəti oyunlar',cNextOne:'Növbəti oyun',cYes:'Gələcəyəm',cNo:'Gəlməyəcəyəm',cMaybe:'Bəlkə',cComing:'gəlir',
  cCountNo:n=>`gəlmir: ${n}`,cYesL:'Gələcəklər',cMaybeL:'Bəlkə',cNoL:'Gəlməyəcəklər',cOnlyPlayers:'Qeyd olunmaq yalnız oyunçular üçündür',cPlayerLogin:'Oyunçusunuz? Daxil olun',cWaitApproval:'Oyunçu sorğunuz admin təsdiqini gözləyir',
  cCancelled:'Ləğv edildi',cNoEvents:'⏳ Növbəti oyunun təsdiqi gözlənilir',cAwait:'Oyunun təsdiqi gözlənilir',cAwaitAdm:'Oyun təyin et',cToTeams:'Gələnləri komandalara böl',
  cAdminTitle:'Admin paneli',cRequests:'Oyunçu sorğuları',cNoRequests:'Yeni sorğu yoxdur',cApprove:'Təsdiq et',cReject:'Rədd et',cWants:'olmaq istəyir',
  cUsers:'İstifadəçilər',cPlayerL:'Oyunçu',cReset:'Şifrəni sıfırla',cResetQ:n=>`${n} üçün yeni müvəqqəti şifrə yaradılsın?`,cTempPass:'Müvəqqəti şifrə',
  cTempHint:'Bu şifrəni həmin şəxsə göndərin. Daxil olandan sonra onu profilində dəyişsin.',cCopy:'Kopyala',cSendWA:'WhatsApp-da göndər',
  cWAtext:(e,p)=>`Softball Baku: sayta giriş üçün müvəqqəti şifrəniz\n${SITE}\nE-poçt: ${e}\nŞifrə: ${p}\nDaxil olandan sonra şifrəni profilinizdə dəyişin.`,
  cSchedule:'Oyun cədvəli',cAddEvent:'Oyun əlavə et',cDate:'Tarix',cTime:'Saat',cPlace:'Yer',cNote:'Qeyd',cNotePh:'məsələn: əlcəklərinizi götürün',
  cCancelEv:'Ləğv et',cRestoreEv:'Bərpa et',cDelete:'Sil',cDelQ:'Silinsin?',cPast:'keçib',cLiveAdmin:'Canlı hesab',
  cLiveHow:'Telefonda oyun qeydi tətbiqini admin hesabı ilə açın — hesab sayta avtomatik canlı ötürüləcək.',
  cOpenScorer:'Oyun qeydini aç',cEndLive:'Yayımı bitir',cDelLive:'Sil',cDelLiveQ:'Bu canlı hesab şərhləri ilə birlikdə silinsin? Geri qaytarmaq olmayacaq.',cNoLiveRow:'Hələ canlı yayım olmayıb',cYou:'siz',cLastSeen:'giriş',cNever:'daxil olmayıb',
  cLive:'Canlı',cLivePill:'CANLI',cNoLive:'Hazırda oyun getmir',cNoLiveTxt:'Oyun başlayanda hesab burada canlı göstəriləcək.',
  cFinal:'Oyun bitdi',cFinalShort:'Yekun',cPaused:'Yenilənmə yoxdur',cAtBat:'Vuruşda',cOnDeck:'Növbəti',cFirstPA:'bu gün ilk çıxışı',cTodayL:'bu gün',
  cPlays:'Son anlar',cLiveBox:'Oyun boyu statistika',cLiveRt:'oyun boyu reytinq',cUpdated:'yeniləndi',cWatchLive:'Canlı izlə',cRuns:'ran',
  cPl:PL_AZ,cComments:'Şərhlər',cWrite:'Şərh yazın…',cSend:'Göndər',cLoginToComment:'Şərh yazmaq üçün daxil olun',cNoComments:'Hələ şərh yoxdur',
  cOffline:'Onlayn funksiyalar hazırda əlçatan deyil',cOldBrowser:'Bu cihazda giriş işləmir: brauzer onlayn funksiyalar (giriş, «gələcəyəm / gəlməyəcəyəm», canlı hesab) üçün çox köhnədir. Statistikaya, oyunlara və reytinqə adi qaydada baxmaq olar. Daha yeni sistemli telefondan və ya kompüterdən daxil ola bilərsiniz.',cTeamsOnly:'Komandalara bölmə yalnız oyunçular üçündür',cTeamsOnlyTxt:'Oyunçu hesabı ilə daxil olun. Komandadasınızsa, amma hələ təsdiqlənməmisinizsə, profildə sorğu göndərin.',cPendingN:n=>`Yeni sorğular: ${n}`,cNow:'indi'
});
Object.assign(I18N.en,{
  cLogin:'Log in',cSignup:'Sign up',cGuest:'Continue as guest',cWelcome:'Welcome!',
  cWelcomeTxt:'You can browse without an account. With one you can comment, and players mark whether they are coming to games.',
  cName:'Your name',cEmail:'Email',cPass:'Password',cPass2:'Repeat password',cErrMismatch:"Passwords don't match",cPassHint:'at least 6 characters',cIAm:'Do you play on the team?',cFan:"— No, I'm a fan —",
  cIAmHint:"Once the admin confirms, you can mark whether you're coming.",cForgot:'Forgot password?',
  cForgotTxt:'Message the admin — they will set a temporary password for you. Change it in your profile after logging in.',cBack:'Back',cTakenSfx:'already registered',
  cErrCreds:'Wrong email or password',cErrExists:'This email is already registered — log in',cErrShort:'Password must be at least 6 characters',
  cErrEmail:'Check the email address',cErrName:'Enter your name',cErrNet:'No connection. Try again a bit later.',cErrRate:'Too many attempts — wait a few minutes',
  cErrTaken:'This player is already linked to another account',cErrPerm:"You don't have permission for this",cErrGeneric:'Error',
  cConfirmNeeded:'Account created, but the site requires email confirmation. Message the admin.',cHello:n=>`Hi, ${n}!`,cReqSent:'Player request sent to the admin',
  cRole_guest:'Guest',cRole_player:'Player',cRole_admin:'Admin',cProfile:'Profile',cLogout:'Log out',cAdmin:'Admin',
  cSave:'Save',cSaved:'Saved',cLinked:'You are confirmed as a player',cPending:p=>`Request sent: ${p}. Waiting for admin approval.`,
  cRequest:"I'm on the team",cSendReq:'Send request',cCancelReq:'Cancel request',cChangePass:'Change password',cNewPass:'New password',cPassChanged:'Password changed',
  cNotLogged:'You are not logged in',cNotLoggedTxt:'Log in or sign up to comment and respond to games.',
  cNext:'Upcoming games',cNextOne:'Next game',cYes:"I'm in",cNo:"Can't make it",cMaybe:'Maybe',cComing:'coming',
  cCountNo:n=>`out: ${n}`,cYesL:'Coming',cMaybeL:'Maybe',cNoL:'Not coming',cOnlyPlayers:'Only players can respond',cPlayerLogin:'Are you a player? Log in',cWaitApproval:'Your player request is waiting for admin approval',
  cCancelled:'Cancelled',cNoEvents:'⏳ Awaiting confirmation of the next game',cAwait:'Awaiting game confirmation',cAwaitAdm:'Schedule a game',cToTeams:'Split those coming into teams',
  cAdminTitle:'Admin panel',cRequests:'Player requests',cNoRequests:'No new requests',cApprove:'Approve',cReject:'Reject',cWants:'wants to be',
  cUsers:'Users',cPlayerL:'Player',cReset:'Reset password',cResetQ:n=>`Set a new temporary password for ${n}?`,cTempPass:'Temporary password',
  cTempHint:'Send this password to the person. After logging in they should change it in their profile.',cCopy:'Copy',cSendWA:'Send via WhatsApp',
  cWAtext:(e,p)=>`Softball Baku: your temporary password for the site\n${SITE}\nEmail: ${e}\nPassword: ${p}\nPlease change it in your profile after logging in.`,
  cSchedule:'Game schedule',cAddEvent:'Add game',cDate:'Date',cTime:'Time',cPlace:'Place',cNote:'Note',cNotePh:'e.g. bring your own gloves',
  cCancelEv:'Cancel',cRestoreEv:'Restore',cDelete:'Delete',cDelQ:'Delete?',cPast:'past',cLiveAdmin:'Live score',
  cLiveHow:'Open the game scorer on your phone while logged in as admin — the score will stream to the site automatically.',
  cOpenScorer:'Open the scorer',cEndLive:'End broadcast',cDelLive:'Delete',cDelLiveQ:'Delete this live score together with its comments? This cannot be undone.',cNoLiveRow:'No broadcasts yet',cYou:'you',cLastSeen:'login',cNever:'never',
  cLive:'Live',cLivePill:'LIVE',cNoLive:'No game in progress',cNoLiveTxt:'When a game starts, the score will appear here in real time.',
  cFinal:'Final',cFinalShort:'Final',cPaused:'No updates',cAtBat:'At bat',cOnDeck:'On deck',cFirstPA:'first time up today',cTodayL:'today',
  cPlays:'Latest plays',cLiveBox:'Live box score',cLiveRt:'live rating',cUpdated:'updated',cWatchLive:'Watch live',cRuns:'runs',
  cPl:PL_EN,cComments:'Comments',cWrite:'Write a comment…',cSend:'Send',cLoginToComment:'Log in to comment',cNoComments:'No comments yet',
  cOffline:'Online features are unavailable right now',cOldBrowser:'Logging in does not work on this device: the browser is too old for the online features (login, responses, live score). Stats, games and ratings work as usual. You can log in from a phone or computer with a newer system.',cTeamsOnly:'Team split is for players only',cTeamsOnlyTxt:"Log in with a player account. If you're on the team but not confirmed yet, send a request in your profile.",cPendingN:n=>`New requests: ${n}`,cNow:'now'
});

/* ---------- Состояние ---------- */
const C={sb:null,ok:false,ready:false,user:null,profile:null,profiles:{},profAt:0,
  events:null,rsvps:[],live:null,rt:'',page:'',welcomed:false,cm:{}};
const WD_AZ=['Bazar','Bazar ertəsi','Çərşənbə axşamı','Çərşənbə','Cümə axşamı','Cümə','Şənbə'];
const $id=id=>document.getElementById(id);
const role=()=>C.profile?C.profile.role:null;
const isAdmin=()=>role()==='admin';
const canRsvp=()=>role()==='player'||role()==='admin';
const okColor=c=>/^#[0-9a-f]{3,8}$/i.test(c||'')?c:'#8fa0b8';
const hm=d=>d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
function evWhen(iso){
  const d=new Date(iso);
  if(LANG==='az') return `${WD_AZ[d.getDay()]}, ${d.getDate()} ${AZ_M[d.getMonth()]} · ${hm(d)}`;
  const s=d.toLocaleDateString(LOCALE[LANG],{weekday:'long',day:'numeric',month:'long'});
  return `${s[0].toUpperCase()+s.slice(1)} · ${hm(d)}`;
}
function whenShort(iso){
  const d=new Date(iso), now=new Date();
  if(d.toDateString()===now.toDateString()) return hm(d);
  const ymd=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return `${fmtDate(ymd,{day:'numeric',month:'short',year:d.getFullYear()!==now.getFullYear()?'numeric':undefined})} ${hm(d)}`;
}
const plOf=pr=>pr&&pr.player_id&&S.players?S.players[pr.player_id]:null;
function personAv(pr,size){
  const p=plOf(pr); if(p) return av(p,size||'s');
  const n=((pr&&pr.display_name)||'?').trim(), ini=n.split(/\s+/).map(x=>x[0]||'').join('').slice(0,2).toUpperCase()||'?';
  return `<span class="av ${size||'s'} nophoto cl-ini">${esc(ini)}</span>`;
}
const personName=pr=>{const p=plOf(pr); return p?pname(p):((pr&&pr.display_name)||'—');};
const shortName=pr=>{const p=plOf(pr); return p?first(p):((pr&&pr.display_name)||'—').split(/\s+/)[0];};
const roleBadge=r=>r?`<span class="cl-role r-${esc(r)}">${T('cRole_'+r)||esc(r)}</span>`:'';
const plName=id=>{const p=S.players&&S.players[id]; return p?pname(p):String(id||'—');};
const plShort=id=>{const p=S.players&&S.players[id]; return p?`${first(p)} ${last(p)?last(p)[0]+'.':''}`.trim():String(id||'—');};
const sortedPlayers=()=>Object.values(S.players||{}).sort((a,b)=>a.number-b.number);

function errText(e){
  const m=`${(e&&e.code)||''} ${(e&&e.message)||e||''}`.toLowerCase();
  if(/invalid_credentials|invalid login/.test(m)) return T('cErrCreds');
  if(/user_already_exists|already registered|already been registered|already exists/.test(m)) return T('cErrExists');
  if(/weak_password|at least 6|password should/.test(m)) return T('cErrShort');
  if(/email_address_invalid|invalid format|unable to validate email|invalid email/.test(m)) return T('cErrEmail');
  if(/rate limit|too many|429|over_request/.test(m)||(e&&e.status===429)) return T('cErrRate');
  if(/failed to fetch|networkerror|load failed|network request/.test(m)) return T('cErrNet');
  if(/23505|duplicate key/.test(m)) return T('cErrTaken');
  if(/row-level security|42501|permission denied|только для админа/.test(m)) return T('cErrPerm');
  return `${T('cErrGeneric')}: ${(e&&e.message)||e}`;
}
const fail=e=>{console.warn('[club]',e); toast(errText(e));};

/* ---------- Данные ---------- */
async function loadProfile(){
  if(!C.user){ C.profile=null; return; }
  const {data,error}=await C.sb.from('profiles').select('*').eq('id',C.user.id).maybeSingle();
  if(error) console.warn('[club] profile',error);
  C.profile=data||{id:C.user.id,role:'guest',display_name:(C.user.user_metadata||{}).display_name||''};
  C.profiles[C.profile.id]=C.profile;
}
async function loadProfiles(force){
  if(!force&&Date.now()-C.profAt<60e3) return;
  const {data,error}=await C.sb.from('profiles').select('id,display_name,role,player_id,requested_player_id');
  if(error){ console.warn('[club] profiles',error); return; }
  C.profiles={}; (data||[]).forEach(p=>C.profiles[p.id]=p); C.profAt=Date.now();
  if(C.user&&C.profiles[C.user.id]) C.profile={...C.profile,...C.profiles[C.user.id]};
}
let evBusy=null;
function loadEvents(){
  if(evBusy) return evBusy;
  evBusy=(async()=>{
    const since=new Date(Date.now()-4*3600e3).toISOString();
    const {data,error}=await C.sb.from('events').select('*').gte('starts_at',since).order('starts_at',{ascending:true}).limit(8);
    if(error) throw error;
    C.events=data||[];
    const ids=C.events.map(e=>e.id);
    if(ids.length){ const r=await C.sb.from('rsvps').select('event_id,user_id,status').in('event_id',ids); if(r.error) throw r.error; C.rsvps=r.data||[]; }
    else C.rsvps=[];
    await loadProfiles();
  })().catch(e=>{console.warn('[club] events',e); if(!C.events) C.events=[];}).finally(()=>{evBusy=null;});
  return evBusy;
}
const isLiveNow=r=>!!r&&r.status==='live'&&Date.now()-new Date(r.updated_at).getTime()<5*3600e3;
const isRecentFinal=r=>!!r&&r.status==='final'&&Date.now()-new Date(r.updated_at).getTime()<8*3600e3;
async function loadLive(){
  const {data,error}=await C.sb.from('live_games').select('*').order('updated_at',{ascending:false}).limit(1);
  if(error){ console.warn('[club] live',error); return; }
  setLive((data&&data[0])||null);
}
function setLive(row){
  C.live=row; renderPill();
  if(C.page==='live') drawLive();
  const lc=$id('cl-livecard'); if(lc) lc.innerHTML=liveCard();
  if(C.page==='admin') drawAdminLive();
}
function subscribe(){
  try{
    C.sb.channel('club-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'live_games'},p=>{
        if(p.eventType==='DELETE'){ loadLive(); return; }
        const row=p.new; if(!row) return;
        if(!C.live||row.id===C.live.id||new Date(row.updated_at)>=new Date(C.live.updated_at)) setLive(row);
      })
      .subscribe(st=>{C.rt=st;});
  }catch(e){ console.warn('[club] realtime',e); }
}

/* ---------- Шапка: кнопка входа / меню, значок «онлайн» ---------- */
function pendingCount(){ return Object.values(C.profiles).filter(p=>p.requested_player_id&&!p.player_id).length; }
// «Составы» (деление на команды) видят только игроки и админ
function applyGates(){ const ok=C.ready&&canRsvp(); document.querySelectorAll('a[href="#teams"]').forEach(a=>{ a.hidden=!ok; }); }
function teamsGate(id){
  C.page='teams';
  if(canRsvp()) return TEAMS_PAGE(id);
  if(!C.ready&&!C.failed){ app().innerHTML=`<div class="loading">…</div>`; return; }
  app().innerHTML=`<div class="card empty cl-out"><div class="lv-none-ic">⚖</div><h2>${T('cTeamsOnly')}</h2><p>${T('cTeamsOnlyTxt')}</p>
    <div class="cl-btns">${C.user?`<a class="btn pri" href="#me">${T('cRequest')}</a>`:`<button class="btn pri" onclick="CL.auth('login')">${T('cLogin')}</button><button class="btn" onclick="CL.auth('signup')">${T('cSignup')}</button>`}</div></div>`;
}
function renderAcct(){
  applyGates();
  const box=$id('acct'); if(!box) return;
  if(C.failed){ box.innerHTML=`<button class="btn sm acct-in acct-off" onclick="CL.oldBrowser()">${T('cLogin')}</button>`; return; }
  if(!C.ok||!C.ready){ box.innerHTML=''; return; }
  if(!C.user){ box.innerHTML=`<button class="btn sm acct-in" onclick="CL.auth('login')">${T('cLogin')}</button>`; return; }
  const pr=C.profile||{}, n=isAdmin()?pendingCount():0;
  box.innerHTML=`<button class="acct-me" onclick="CL.menu(event)" aria-label="${T('cProfile')}">${personAv(pr,'s')}<span class="acct-nm">${esc(shortName(pr))}</span>${n?`<i class="acct-dot">${n}</i>`:''}</button>`;
}
function renderPill(){
  const el=$id('live-pill'); if(!el) return;
  const on=isLiveNow(C.live); el.hidden=!on;
  if(on){ const d=C.live.data||{}, s=d.score||{}; el.innerHTML=`<i></i>${T('cLivePill')} <b>${s.A??0}:${s.B??0}</b>`; }
}
function menu(ev){
  ev&&ev.stopPropagation();
  const old=document.querySelector('.acct-menu'); if(old){ old.remove(); return; }
  const pr=C.profile||{}, n=isAdmin()?pendingCount():0;
  const m=document.createElement('div'); m.className='acct-menu';
  m.innerHTML=`<div class="am-who">${personAv(pr,'m')}<div><b>${esc(personName(pr))}</b><span>${esc(C.user.email||'')}</span>${roleBadge(pr.role)}</div></div>
    <a href="#me" onclick="CL.closeMenu()">${T('cProfile')}</a>
    ${isAdmin()?`<a href="#admin" onclick="CL.closeMenu()">${T('cAdmin')}${n?` <i class="acct-dot">${n}</i>`:''}</a>`:''}
    <button onclick="CL.logout()">${T('cLogout')}</button>`;
  $id('acct').appendChild(m);
  setTimeout(()=>document.addEventListener('click',closeMenuOut),0);
}
function closeMenuOut(e){ const m=document.querySelector('.acct-menu'); if(m&&!m.contains(e.target)){ m.remove(); document.removeEventListener('click',closeMenuOut); } }
function closeMenu(){ const m=document.querySelector('.acct-menu'); if(m) m.remove(); document.removeEventListener('click',closeMenuOut); }

/* ---------- Окно входа / регистрации ---------- */
function openModal(html,cls){
  closeModal();
  const m=document.createElement('div'); m.className='modal cl-modal '+(cls||''); m.id='cl-modal';
  m.innerHTML=`<div class="sheet">${html}</div>`;
  m.addEventListener('click',e=>{ if(e.target===m) closeModal(); });
  document.body.appendChild(m);
  const f=m.querySelector('input:not([type=hidden])'); if(f&&matchMedia('(hover: hover)').matches) f.focus();
}
function closeModal(){ const m=$id('cl-modal'); if(m) m.remove(); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
const sheetHead=t=>`<div class="sh-h"><b>${t}</b><button class="x" onclick="CL.close()" aria-label="×">×</button></div>`;
function playerOptions(sel){
  const taken=new Set(Object.values(C.profiles).filter(p=>p.player_id&&(!C.user||p.id!==C.user.id)).map(p=>p.player_id));
  return `<option value="">${T('cFan')}</option>`+sortedPlayers().map(p=>`<option value="${esc(p.id)}" ${taken.has(p.id)?'disabled':''} ${sel===p.id?'selected':''}>#${p.number} ${esc(pname(p))}${taken.has(p.id)?` — ${T('cTakenSfx')}`:''}</option>`).join('');
}
function auth(mode){
  closeMenu();
  if(!C.ok){ toast(C.failed?T('cOffline'):'…'); return; }
  const tabs=`<div class="cl-tabs"><button class="${mode==='login'?'on':''}" onclick="CL.auth('login')">${T('cLogin')}</button><button class="${mode==='signup'?'on':''}" onclick="CL.auth('signup')">${T('cSignup')}</button></div>`;
  const guest=`<button class="cl-guest" onclick="CL.close()">${T('cGuest')} →</button>`;
  let h;
  if(mode==='welcome'){
    h=`<div class="cl-hello"><div class="cl-logo"><span class="brand-mark">${ballSVG()}</span><span class="brand-text">SOFTBALL <b>BAKU</b></span></div>
      <h2>${T('cWelcome')}</h2><p>${T('cWelcomeTxt')}</p></div>
      <div class="cl-btns"><button class="btn pri" onclick="CL.auth('login')">${T('cLogin')}</button><button class="btn" onclick="CL.auth('signup')">${T('cSignup')}</button></div>${guest}`;
  } else if(mode==='forgot'){
    h=sheetHead(T('cForgot'))+`<p class="cl-p">${T('cForgotTxt')}</p>${S.links&&S.links.whatsapp?`<a class="btn wa" href="${esc(S.links.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`:''}
      <button class="cl-guest" onclick="CL.auth('login')">← ${T('cBack')}</button>`;
  } else if(mode==='signup'){
    h=sheetHead(T('cSignup'))+tabs+`<form class="cl-form" onsubmit="return CL.doSignup(event)" novalidate>
      <label>${T('cName')}<input name="name" autocomplete="name" maxlength="40" required></label>
      <label>${T('cEmail')}<input name="email" type="email" autocomplete="email" inputmode="email" required></label>
      <label><span>${T('cPass')} <span class="muted">· ${T('cPassHint')}</span></span><input name="pass" type="password" autocomplete="new-password" minlength="6" required></label>
      <label>${T('cPass2')}<input name="pass2" type="password" autocomplete="new-password" minlength="6" required></label>
      <label>${T('cIAm')}<select name="player">${playerOptions('')}</select><span class="cl-hint">${T('cIAmHint')}</span></label>
      <div class="cl-err" id="cl-err"></div><button class="btn pri big" type="submit">${T('cSignup')}</button></form>${guest}`;
  } else {
    h=sheetHead(T('cLogin'))+tabs+`<form class="cl-form" onsubmit="return CL.doLogin(event)" novalidate>
      <label>${T('cEmail')}<input name="email" type="email" autocomplete="email" inputmode="email" required></label>
      <label>${T('cPass')}<input name="pass" type="password" autocomplete="current-password" required></label>
      <div class="cl-err" id="cl-err"></div><button class="btn pri big" type="submit">${T('cLogin')}</button>
      <button type="button" class="cl-link" onclick="CL.auth('forgot')">${T('cForgot')}</button></form>${guest}`;
  }
  openModal(h,mode==='welcome'?'welcome':'');
  if(mode==='signup'&&!C.profAt) loadProfiles().then(()=>{const s=document.querySelector('#cl-modal select[name=player]'); if(s){const v=s.value; s.innerHTML=playerOptions(v);}});
}
function formBusy(f,on){ const b=f.querySelector('button[type=submit]'); if(b){ b.disabled=on; b.classList.toggle('busy',on); } }
function formErr(msg){ const el=$id('cl-err'); if(el) el.textContent=msg||''; }
async function doLogin(ev){
  ev.preventDefault(); const f=ev.target, email=f.email.value.trim(), pass=f.pass.value;
  if(!/^\S+@\S+\.\S+$/.test(email)){ formErr(T('cErrEmail')); return false; }
  formBusy(f,true); formErr('');
  try{
    const {data,error}=await C.sb.auth.signInWithPassword({email,password:pass});
    if(error) throw error;
    closeModal(); await onSession(data.session,true);
    toast(T('cHello')(shortName(C.profile)));
  }catch(e){ formErr(errText(e)); }
  formBusy(f,false); return false;
}
async function doSignup(ev){
  ev.preventDefault(); const f=ev.target, name=f.name.value.trim(), email=f.email.value.trim(), pass=f.pass.value, pid=f.player.value;
  if(!name){ formErr(T('cErrName')); return false; }
  if(!/^\S+@\S+\.\S+$/.test(email)){ formErr(T('cErrEmail')); return false; }
  if(pass.length<6){ formErr(T('cErrShort')); return false; }
  if(pass!==f.pass2.value){ formErr(T('cErrMismatch')); f.pass2.focus(); return false; }
  formBusy(f,true); formErr('');
  try{
    const {data,error}=await C.sb.auth.signUp({email,password:pass,options:{data:{display_name:name,requested_player_id:pid||null}}});
    if(error) throw error;
    if(!data.session){ formErr(T('cConfirmNeeded')); formBusy(f,false); return false; }
    closeModal(); await onSession(data.session,true);
    toast(pid?T('cReqSent'):T('cHello')(name.split(/\s+/)[0]));
  }catch(e){ formErr(errText(e)); }
  formBusy(f,false); return false;
}
async function logout(){
  closeMenu();
  try{ await C.sb.auth.signOut(); }catch(e){ console.warn(e); }
  await onSession(null,true);
  if(['me','admin'].includes(C.page)) location.hash='#rating';
}
async function onSession(session,force){
  const uid=session&&session.user?session.user.id:null, changed=uid!==(C.user?C.user.id:null);
  C.user=session?session.user:null;
  if(changed||force){ if(C.user){ await loadProfile(); loadProfiles(true).then(renderAcct); } else C.profile=null; }
  const wasFirst=!C.ready; C.ready=true; renderAcct();
  if(force||(changed&&(C.user||!wasFirst))||(wasFirst&&['me','admin','teams'].includes(C.page))) rerender();
  maybeWelcome();
}
function maybeWelcome(){
  if(C.welcomed||!C.ready||C.user||!siteLoaded()||S.demo||C.page==='live'||$id('cl-modal')) return;
  if(lsGet('sb.welcomed',false)){ C.welcomed=true; return; }
  C.welcomed=true; lsSet('sb.welcomed',true); auth('welcome');
}
const siteLoaded=()=>!!S.league&&Object.values(S.players||{}).length>0&&Object.values(S.players).every(p=>p.t);
function rerender(){ if(typeof route==='function'&&siteLoaded()){ const y=scrollY; route(); scrollTo(0,y); } }

/* ---------- Расписание и «буду / не буду» ---------- */
function whoChip(r,cls){ const pr=C.profiles[r.user_id]||{}; return `<span class="who-chip ${cls}" title="${esc(personName(pr))}">${personAv(pr,'s')}<span>${esc(shortName(pr))}</span></span>`; }
// списки «будут / может быть / не будут»; имена отказавшихся видят игроки и админ, гости — только число
function whoGroups(yes,maybe,no){
  const g=(L,c,ic,lbl)=>L.length?`<div class="who-row ${c}"><span class="who-lbl">${ic} ${lbl} · ${L.length}</span><div class="who">${L.map(r=>whoChip(r,c)).join('')}</div></div>`:'';
  const noPart=canRsvp()?g(no,'n','✕',T('cNoL')):(no.length?`<span class="who-no">${T('cCountNo')(no.length)}</span>`:'');
  const h=g(yes,'y','✓',T('cYesL'))+g(maybe,'m','?',T('cMaybeL'))+noPart;
  return h?`<div class="who-groups">${h}</div>`:'';
}
function evCard(e,compact){
  const R=C.rsvps.filter(r=>r.event_id===e.id), by=s=>R.filter(r=>r.status===s);
  const yes=by('yes'), maybe=by('maybe'), no=by('no'), mine=C.user?(R.find(r=>r.user_id===C.user.id)||{}).status:null;
  const cx=e.status==='cancelled', can=!cx&&canRsvp(), pr=C.profile||{};
  const b=(s,l,c)=>`<button class="rsvp-b ${c} ${mine===s?'on':''}" ${can?'':'disabled'} onclick="CL.rsvp(${+e.id},'${s}')">${l}</button>`;
  // гости не решают, играть или нет: без кнопок, только кто придёт
  let hint='';
  if(!cx&&!can) hint=!C.user?`<button class="cl-link" onclick="CL.auth('login')">${T('cPlayerLogin')}</button>`
    :pr.requested_player_id&&!pr.player_id?T('cWaitApproval'):'';
  return `<div class="card ev ${cx?'cancelled':''} ${compact?'compact':''}" data-ev="${+e.id}">
    <div class="ev-head"><div class="ev-when">${compact?`<span class="eyebrow">${T('cNextOne')}</span>`:''}<b>${evWhen(e.starts_at)}</b>
      <span class="muted">${esc(e.place||'')}${e.note?` · ${esc(e.note)}`:''}</span>${!cx&&window.WX?WX.chip(e.starts_at):''}</div>
      ${cx?`<span class="ev-x">${T('cCancelled')}</span>`:`<div class="ev-count"><b>${yes.length}</b><span>${T('cComing')}</span></div>`}</div>
    ${cx?'':`${can?`<div class="rsvp">${b('yes','✓ '+T('cYes'),'y')}${b('maybe','? '+T('cMaybe'),'m')}${b('no','✕ '+T('cNo'),'n')}</div>`:''}
    ${hint?`<div class="ev-hint">${hint}</div>`:''}
    ${whoGroups(yes,maybe,no)}
    ${yes.length>=4&&canRsvp()?`<button class="btn sm ev-teams" onclick="CL.toTeams(${+e.id})">⚖ ${T('cToTeams')}</button>`:''}`}
  </div>`;
}
async function rsvp(eid,status){
  if(!canRsvp()) return;
  const uid=C.user.id, prev=C.rsvps.find(r=>r.event_id===eid&&r.user_id===uid);
  if(prev&&prev.status===status) return;
  const backup=C.rsvps.slice();
  C.rsvps=C.rsvps.filter(r=>!(r.event_id===eid&&r.user_id===uid)).concat([{event_id:eid,user_id:uid,status}]);
  drawWidgets();
  const {error}=await C.sb.from('rsvps').upsert({event_id:eid,user_id:uid,status,updated_at:new Date().toISOString()});
  if(error){ C.rsvps=backup; drawWidgets(); fail(error); }
}
function toTeams(eid){
  const ids=C.rsvps.filter(r=>r.event_id===eid&&r.status==='yes').map(r=>(C.profiles[r.user_id]||{}).player_id).filter(id=>id&&S.players[id]);
  lsSet(PRESENT_KEY,ids); try{ TM.sols=[]; }catch(e){} location.hash='#teams';
}

/* ---------- Блоки на главной и на странице «Игры» ---------- */
function teamSpan(d,k){ const t=(d.teams||{})[k]||{}; return `<span class="lv-tn"><i style="background:${okColor(t.color)}"></i>${esc(t.name||k)}</span>`; }
const outsDots=n=>`<span class="lv-outs">${[0,1,2].map(i=>`<i class="${i<(n||0)?'on':''}"></i>`).join('')}</span>`;
function liveCard(){
  const r=C.live; if(!r) return ''; const live=isLiveNow(r); if(!live&&!isRecentFinal(r)) return '';
  const d=r.data||{}, s=d.score||{};
  return `<a class="card lv-mini ${live?'on':''}" href="#live"><span class="lv-tag ${live?'on':''}">${live?`<i></i>${T('cLivePill')}`:T('cFinal')}</span>
    <span class="lv-t">${teamSpan(d,'A')}<b>${s.A??0}</b><em>:</em><b>${s.B??0}</b>${teamSpan(d,'B')}</span>
    ${live?`<span class="lv-inn">${d.top?'▲':'▼'} ${d.inning||1} ${outsDots(d.outs)}</span>`:''}<span class="lv-go">${T('cWatchLive')} →</span></a>`;
}
function drawWidgets(){
  const top=$id('cl-next'); if(top){ const e=(C.events||[]).find(x=>x.status!=='cancelled')||(C.events||[])[0];
    // игры пока нет — так и пишем: ждём подтверждения
    top.innerHTML=e?evCard(e,true):C.events==null?'':`<div class="card ev compact ev-wait"><div class="ev-when"><span class="eyebrow">${T('cNextOne')}</span><b>⏳ ${T('cAwait')}</b></div>${isAdmin()?`<a class="btn sm" href="#admin">+ ${T('cAwaitAdm')}</a>`:''}</div>`; }
  const sc=$id('cl-sched'); if(sc){
    sc.innerHTML=C.events==null?'':`<div class="section-title" style="margin-top:0"><h2>${T('cNext')}</h2></div>`+
      (C.events.length?`<div class="ev-list">${C.events.map(e=>evCard(e,false)).join('')}</div>`:`<div class="card empty" style="margin-top:0">${T('cNoEvents')}</div>`);
  }
  if(C.page==='admin'&&$id('adm-ev')) drawAdminEvents();
  if(window.WX&&WX.drawSec) WX.drawSec();
}
function afterRoute(){
  const h=(location.hash||'').slice(1), i=h.indexOf('-'), page=i<0?h:h.slice(0,i), id=i<0?'':decodeURIComponent(h.slice(i+1));
  const FR=window.FEATURE_ROUTES||{}, isHome=!['player','game','games'].includes(page)&&!FR[page];
  C.page=isHome?'home':page;
  document.querySelectorAll('nav a').forEach(a=>{ if(['me','admin','live'].includes(page)) a.classList.remove('active'); });
  if(!C.ok||!siteLoaded()) return;
  const A=app();
  if(isHome){ A.insertAdjacentHTML('afterbegin',`<div id="cl-livecard">${liveCard()}</div><div id="cl-next"></div>`); }
  if(page==='games'){ A.insertAdjacentHTML('afterbegin',`<div id="cl-sched" class="cl-sched"></div>`); }
  if(isHome||page==='games'){ drawWidgets(); loadEvents().then(drawWidgets); }
  // кнопка «Назад» на страницах игрока и игры
  if(['player','game'].includes(page)) A.insertAdjacentHTML('afterbegin',`<button class="back-btn" onclick="CL.back('${page==='game'?'#games':'#rating'}')">← ${T('cBack')}</button>`);
  if(page==='game'&&id&&S.games.some(g=>g.id===id)) A.insertAdjacentHTML('beforeend',commentsBlock('game:'+id));
  if(page==='player'&&id&&S.players[id]) A.insertAdjacentHTML('beforeend',commentsBlock('player:'+id));
  A.querySelectorAll('[data-cm]').forEach(el=>loadComments(el.dataset.cm));
  maybeWelcome();
}

/* ---------- Онлайн-счёт ---------- */
function diamondSVG(bases){
  const pts=[[150,78],[100,28],[50,78]], lbl=[[150,108],[100,14],[50,108]];
  let s=`<svg class="lv-dia" viewBox="0 0 200 140" aria-hidden="true"><path d="M100 128 L150 78 L100 28 L50 78 Z" fill="rgba(239,159,39,.05)" stroke="#2a3a55" stroke-width="2"/>
    <path d="M92 124 h16 v6 l-8 7 l-8 -7 z" fill="#eef2f8"/>`;
  pts.forEach(([x,y],i)=>{ const on=bases&&bases[i];
    s+=`<rect x="${x-10}" y="${y-10}" width="20" height="20" transform="rotate(45 ${x} ${y})" fill="${on?'#EF9F27':'#14233a'}" stroke="${on?'#EF9F27':'#5f6f88'}" stroke-width="2"/>`;
    if(on) s+=`<text x="${lbl[i][0]}" y="${lbl[i][1]}" text-anchor="middle" fill="#eef2f8" font-size="12" font-weight="700">${esc(plShort(on))}</text>`; });
  return s+'</svg>';
}
function playLabel(p){
  const L=T('cPl');
  return p.type==='pa'?(L[p.result]||p.result):p.type==='sb'?L.SB:p.type==='adv'?L.ADV:p.type==='runout'?L.RO:p.type==='endhalf'?L.EH:p.type==='end'?L.END:'';
}
function lineToday(b){
  if(!b||!b.PA) return T('cFirstPA');
  const x=[`${b.H}/${b.AB}`]; if(b.HR) x.push(`${b.HR} HR`); if(b.RBI) x.push(`${b.RBI} RBI`); if(b.BB) x.push(`${b.BB} BB`); if(b.K) x.push(`${b.K} K`);
  return `${T('cTodayL')}: ${x.join(', ')}`;
}
function liveMain(){
  const r=C.live, d=r.data||{}, live=isLiveNow(r), fin=r.status==='final'||!!d.over;
  const s=d.score||{A:0,B:0}, tm=d.teams||{}, k=d.batting||'A';
  const win=fin?(s.A>s.B?'A':s.B>s.A?'B':null):null;
  const tmBox=x=>{const t=tm[x]||{}; return `<div class="lv-tm ${live&&k===x?'bat':''} ${win===x?'win':''}"><i style="background:${okColor(t.color)}"></i><span>${esc(t.name||x)}</span><b>${s[x]??0}</b></div>`;};
  let h=`<div class="card lv-board"><div class="lv-status"><span class="lv-tag ${live?'on':''}">${live?`<i></i>${T('cLivePill')}`:fin?T('cFinal'):T('cPaused')}</span>
      <span class="muted">${/^\d{4}-\d\d-\d\d$/.test(r.id)?fmtDate(r.id):esc(r.id)}${d.venue?` · ${esc(d.venue)}`:''}</span></div>
    <div class="lv-score">${tmBox('A')}<div class="lv-mid">${live?`<b>${d.top?'▲':'▼'} ${d.inning||1}</b>${outsDots(d.outs)}`:`<b>${T('cFinalShort')}</b>`}</div>${tmBox('B')}</div></div>`;
  const box=d.box||[], bx=(id,t)=>box.find(b=>b.player===id&&b.team===t);
  if(live&&d.batter){
    const b=bx(d.batter,k), p=S.players[d.batter];
    h+=`<div class="lv-sit"><div class="card lv-field">${diamondSVG(d.bases)}</div>
      <div class="card lv-bat"><span class="eyebrow">${T('cAtBat')} · ${esc((tm[k]||{}).name||'')}</span>
        <div class="lv-who">${p?av(p,'m'):''}<div><b>${esc(plName(d.batter))}</b><span>${p?`#${p.number} · `:''}${esc(lineToday(b))}</span></div>${b&&b.PA?rt(rating(b,false)):''}</div>
        ${d.next?`<div class="lv-deck">${T('cOnDeck')}: <b>${esc(plName(d.next))}</b></div>`:''}</div></div>`;
  }
  const n=Math.max((d.line&&d.line.A||[]).length,(d.line&&d.line.B||[]).length,1), pad=a=>Array.from({length:n},(_,i)=>(a||[])[i]??(i<(a||[]).length?0:''));
  const pg={teams:{A:{name:esc((tm.A||{}).name||'A'),color:okColor((tm.A||{}).color)},B:{name:esc((tm.B||{}).name||'B'),color:okColor((tm.B||{}).color)}},
    linescore:{A:pad(d.line&&d.line.A),B:pad(d.line&&d.line.B)},score:{A:s.A??0,B:s.B??0},winner:win};
  h+=`<div class="card lv-ls tablewrap">${linescore(pg)}</div>`;
  const plays=(d.plays||[]).filter(p=>p.type!=='mark').slice(-12).reverse();
  if(plays.length){
    h+=`<div class="section-title"><h2>${T('cPlays')}</h2><span class="hint">${T('cUpdated')} ${hm(new Date(r.updated_at))}</span></div><div class="card lv-plays">`+
      plays.map(p=>`<div class="lv-play ${p.runs?'run':''}"><span class="lp-inn">${p.top?'▲':'▼'}${p.inning}</span><span class="lp-what"><b>${esc(playLabel(p))}</b>${p.player?` · ${esc(plName(p.player))}`:''}${p.runs?` <em>+${p.runs} ${T('cRuns')}</em>`:''}</span><span class="lp-sc">${p.score?`${p.score.A}:${p.score.B}`:''}</span></div>`).join('')+'</div>';
  }
  if(box.some(b=>b.PA||b.PO||b.A)){
    h+=`<div class="section-title"><h2>${T('cLiveBox')}</h2><span class="hint">⚡ ${T('cLiveRt')}</span></div><div class="lv-boxes">`;
    for(const t of ['A','B']){
      const order=(d.lineup&&d.lineup[t])||[], rows=box.filter(b=>b.team===t).sort((a,b)=>order.indexOf(a.player)-order.indexOf(b.player));
      h+=`<div class="card tablewrap"><table class="lb lv-bx"><thead><tr><th class="l"><span class="tbar" style="background:${okColor((tm[t]||{}).color)}"></span>${esc((tm[t]||{}).name||t)}</th><th>AB</th><th>H</th><th>HR</th><th>RBI</th><th>R</th><th>BB</th><th>K</th><th>⚡</th></tr></thead><tbody>`+
        rows.map(b=>`<tr class="${live&&d.batter===b.player&&k===t?'atbat':''}"><td class="l">${esc(plShort(b.player))} <span class="muted">${esc(b.pos||'')}</span></td><td>${b.AB}</td><td>${b.H}</td><td>${b.HR}</td><td>${b.RBI}</td><td>${b.R}</td><td>${b.BB}</td><td>${b.K}</td><td>${b.PA||b.PO||b.A||b.E?rt(rating(b,fin&&win===t)):'–'}</td></tr>`).join('')+'</tbody></table></div>';
    }
    h+='</div>';
  }
  return h;
}
function drawLive(){
  const m=$id('lv-main'); if(!m) return;
  if(!C.live){ m.innerHTML=noLiveHTML(); return; }
  m.innerHTML=liveMain();
  const cm=$id('lv-cm'), t='live:'+C.live.id;
  if(cm&&cm.dataset.t!==t){ cm.dataset.t=t; cm.innerHTML=commentsBlock(t); loadComments(t); }
}
function noLiveHTML(){
  const e=(C.events||[]).find(x=>x.status!=='cancelled');
  return `<div class="card empty lv-none"><div class="lv-none-ic">⚾</div><h2>${T('cNoLive')}</h2><p>${T('cNoLiveTxt')}</p></div>${e?evCard(e,true):''}`;
}
function livePage(){
  C.page='live';
  if(!C.ok){ app().innerHTML=notReady(); return; }
  app().innerHTML=`<div class="pagehead"><span class="eyebrow">${S.league||''}</span><h1>${T('cLive')}</h1></div><div id="lv-main"><div class="loading">…</div></div><div id="lv-cm"></div>`;
  drawLive(); loadLive(); if(C.events==null) loadEvents().then(()=>{ if(!C.live) drawLive(); });
}

const notReady=()=>C.failed?`<div class="card empty">${T('cOffline')}</div>`:`<div class="loading">…</div>`;

/* ---------- Комментарии ---------- */
function commentsBlock(t){
  return `<div class="section-title"><h2>${T('cComments')}</h2></div><div class="card cm" data-cm="${esc(t)}"><div class="cm-list"><div class="muted cm-empty">…</div></div>${commentForm(t)}</div>`;
}
function commentForm(t){
  if(!C.user) return `<div class="cm-login"><button class="btn sm" onclick="CL.auth('login')">${T('cLoginToComment')}</button></div>`;
  return `<form class="cm-form" onsubmit="return CL.sendComment(event,'${esc(t)}')">${personAv(C.profile,'s')}<textarea name="body" maxlength="1000" rows="1" placeholder="${T('cWrite')}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" onkeydown="if(event.key==='Enter'&&(event.ctrlKey||event.metaKey))this.form.requestSubmit()"></textarea><button class="btn pri sm" type="submit">${T('cSend')}</button></form>`;
}
async function loadComments(t){
  const {data,error}=await C.sb.from('comments').select('id,target,user_id,body,created_at').eq('target',t).order('created_at',{ascending:true}).limit(300);
  if(error){ console.warn('[club] comments',error); return; }
  C.cm[t]=data||[];
  const need=(data||[]).some(c=>!C.profiles[c.user_id]); if(need) await loadProfiles(true);
  drawComments(t);
}
function drawComments(t){
  document.querySelectorAll('[data-cm]').forEach(el=>{
    if(el.dataset.cm!==t) return; const L=C.cm[t]||[], list=el.querySelector('.cm-list');
    list.innerHTML=L.length?L.map(c=>{ const pr=C.profiles[c.user_id]||{}, mine=C.user&&c.user_id===C.user.id;
      return `<div class="cm-item">${personAv(pr,'s')}<div class="cm-b"><div class="cm-h"><b>${esc(personName(pr))}</b>${pr.role&&pr.role!=='guest'?roleBadge(pr.role):''}<span class="muted">${whenShort(c.created_at)}</span>
        ${mine||isAdmin()?`<button class="cm-del" onclick="CL.delComment(${+c.id},'${esc(t)}')" title="${T('cDelete')}">×</button>`:''}</div><div class="cm-t">${esc(c.body).replace(/\n/g,'<br>')}</div></div></div>`; }).join('')
      :`<div class="muted cm-empty">${T('cNoComments')}</div>`;
  });
}
async function sendComment(ev,t){
  ev.preventDefault(); const f=ev.target, body=f.body.value.trim(); if(!body||!C.user) return false;
  const btn=f.querySelector('button'); btn.disabled=true;
  const {error}=await C.sb.from('comments').insert({target:t,user_id:C.user.id,body});
  btn.disabled=false;
  if(error){ fail(error); return false; }
  f.body.value=''; f.body.style.height=''; loadComments(t); return false;
}
async function delComment(id,t){
  if(!confirm(T('cDelQ'))) return;
  const {error}=await C.sb.from('comments').delete().eq('id',id);
  if(error){ fail(error); return; } loadComments(t);
}

/* ---------- Профиль ---------- */
function mePage(){
  C.page='me';
  if(!C.ok){ app().innerHTML=notReady(); return; }
  if(!C.ready){ app().innerHTML=`<div class="loading">…</div>`; return; }
  if(!C.user){ app().innerHTML=`<div class="card empty cl-out"><h2>${T('cNotLogged')}</h2><p>${T('cNotLoggedTxt')}</p><div class="cl-btns"><button class="btn pri" onclick="CL.auth('login')">${T('cLogin')}</button><button class="btn" onclick="CL.auth('signup')">${T('cSignup')}</button></div></div>`; return; }
  const pr=C.profile||{}, p=plOf(pr), req=pr.requested_player_id&&S.players[pr.requested_player_id];
  let h=`<div class="card me-head">${personAv(pr,'xl')}<div><span class="eyebrow">${T('cProfile')}</span><h1>${esc(personName(pr))}</h1><div class="me-sub">${roleBadge(pr.role)}<span class="muted">${esc(C.user.email||'')}</span></div></div></div>
    <div class="me-grid">
    <div class="card me-card"><h3>${T('cName')}</h3><form class="cl-row" onsubmit="return CL.saveName(event)"><input name="name" maxlength="40" value="${esc(pr.display_name||'')}" required><button class="btn sm" type="submit">${T('cSave')}</button></form></div>
    <div class="card me-card"><h3>${T('cPlayerL')}</h3>`;
  if(p) h+=`<a class="me-pl" href="#player-${esc(p.id)}">${av(p,'m')}<div><b>${esc(pname(p))}</b><span>#${p.number} · ${T('cLinked')}</span></div></a>`;
  else if(req) h+=`<p class="cl-p">${T('cPending')(`#${req.number} ${esc(pname(req))}`)}</p><button class="btn sm" onclick="CL.request(null)">${T('cCancelReq')}</button>`;
  else h+=`<form class="cl-row" onsubmit="return CL.request(this.player.value)"><select name="player">${playerOptions('')}</select><button class="btn sm" type="submit">${T('cSendReq')}</button></form><span class="cl-hint">${T('cIAmHint')}</span>`;
  h+=`</div><div class="card me-card"><h3>${T('cChangePass')}</h3><form class="cl-row cl-col" onsubmit="return CL.changePass(event)"><input name="pass" type="password" autocomplete="new-password" minlength="6" placeholder="${T('cNewPass')} · ${T('cPassHint')}" required><input name="pass2" type="password" autocomplete="new-password" minlength="6" placeholder="${T('cPass2')}" required><button class="btn sm" type="submit">${T('cSave')}</button></form></div>
    </div><button class="btn me-out" onclick="CL.logout()">${T('cLogout')}</button>`;
  app().innerHTML=h;
  if(!C.profAt) loadProfiles().then(()=>{ if(C.page==='me'&&!p&&!req) { const s=app().querySelector('select[name=player]'); if(s) s.innerHTML=playerOptions(''); } });
}
async function saveName(ev){
  ev.preventDefault(); const v=ev.target.name.value.trim(); if(!v) return false;
  const {error}=await C.sb.from('profiles').update({display_name:v}).eq('id',C.user.id);
  if(error){ fail(error); return false; }
  C.profile.display_name=v; C.profiles[C.user.id]=C.profile; renderAcct(); mePage(); toast(T('cSaved')); return false;
}
async function request(pid){
  const {error}=await C.sb.from('profiles').update({requested_player_id:pid||null}).eq('id',C.user.id);
  if(error){ fail(error); return false; }
  C.profile.requested_player_id=pid||null; C.profiles[C.user.id]=C.profile; mePage(); if(pid) toast(T('cReqSent')); return false;
}
async function changePass(ev){
  ev.preventDefault(); const f=ev.target, v=f.pass.value; if(v.length<6){ toast(T('cErrShort')); return false; }
  if(v!==f.pass2.value){ toast(T('cErrMismatch')); f.pass2.focus(); return false; }
  const {error}=await C.sb.auth.updateUser({password:v});
  if(error){ fail(error); return false; }
  f.pass.value=''; f.pass2.value=''; toast(T('cPassChanged')); return false;
}

/* ---------- Админка ---------- */
const ADM={users:null,events:null,rsvps:[]};
async function adminPage(){
  C.page='admin';
  if(!C.ok){ app().innerHTML=notReady(); return; }
  if(!C.ready){ app().innerHTML=`<div class="loading">…</div>`; return; }
  if(!isAdmin()){ app().innerHTML=`<div class="card empty">${T('cErrPerm')}</div>`; return; }
  const d=new Date(Date.now()+864e5), pre=lsGet('sb.prefillDate',null), ymd=pre||`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  if(pre) lsSet('sb.prefillDate',null);
  app().innerHTML=`<div class="pagehead"><span class="eyebrow">${S.league||''}</span><h1>${T('cAdminTitle')}</h1></div>
    <div class="section-title" style="margin-top:0"><h2>${T('cRequests')}</h2></div><div id="adm-req"><div class="loading">…</div></div>
    <div class="section-title"><h2>${T('cSchedule')}</h2></div>
    <form class="card adm-add" onsubmit="return CL.addEvent(event)">
      <label>${T('cDate')}<input type="date" name="date" value="${ymd}" required></label>
      <label>${T('cTime')}<input type="time" name="time" value="08:00" required></label>
      <label>${T('cPlace')}<input name="place" value="Əmircan" maxlength="80" required></label>
      <label class="wide">${T('cNote')}<input name="note" maxlength="200" placeholder="${T('cNotePh')}"></label>
      <button class="btn pri" type="submit">+ ${T('cAddEvent')}</button></form>
    <div id="adm-ev"></div>
    <div class="section-title"><h2>${T('cLiveAdmin')}</h2></div><div id="adm-live"></div>
    <div class="section-title"><h2>${T('cUsers')}</h2></div><div id="adm-users"><div class="loading">…</div></div>`;
  if(pre){ const f=document.querySelector('.adm-add'); if(f){ f.scrollIntoView({block:'center'}); f.classList.add('flash'); } }
  drawAdminLive(); await Promise.all([admLoadUsers(),admLoadEvents()]);
}
async function admLoadUsers(){
  const {data,error}=await C.sb.rpc('admin_users');
  if(error){ fail(error); return; }
  ADM.users=data||[]; ADM.users.forEach(u=>{ C.profiles[u.id]={...(C.profiles[u.id]||{}),id:u.id,display_name:u.display_name,role:u.role,player_id:u.player_id,requested_player_id:u.requested_player_id}; });
  renderAcct(); drawAdminUsers();
}
async function admLoadEvents(){
  const since=new Date(Date.now()-21*864e5).toISOString();
  const {data,error}=await C.sb.from('events').select('*').gte('starts_at',since).order('starts_at',{ascending:false}).limit(40);
  if(error){ fail(error); return; }
  ADM.events=data||[];
  const ids=ADM.events.map(e=>e.id);
  ADM.rsvps=ids.length?((await C.sb.from('rsvps').select('event_id,user_id,status').in('event_id',ids)).data||[]):[];
  drawAdminEvents();
}
function drawAdminEvents(){
  const el=$id('adm-ev'); if(!el||!ADM.events) return;
  if(!ADM.events.length){ el.innerHTML=`<div class="card empty" style="margin-top:12px">${T('cNoEvents')}</div>`; return; }
  el.innerHTML=`<div class="card adm-list">`+ADM.events.map(e=>{
    const R=ADM.rsvps.filter(r=>r.event_id===e.id), c=s=>R.filter(r=>r.status===s).length, past=new Date(e.starts_at)<Date.now()-3*3600e3;
    const nm=st=>R.filter(r=>r.status===st).map(r=>esc(shortName(C.profiles[r.user_id]||{}))).join(', ');
    return `<div class="adm-ev ${e.status==='cancelled'?'cancelled':''} ${past?'past':''}"><div class="adm-ev-t"><b>${evWhen(e.starts_at)}</b><span class="muted">${esc(e.place||'')}${e.note?` · ${esc(e.note)}`:''}</span>${R.length?`<span class="adm-ev-who">${c('yes')?`<i class="y">✓ ${nm('yes')}</i>`:''}${c('maybe')?`<i class="m">? ${nm('maybe')}</i>`:''}${c('no')?`<i class="n">✕ ${nm('no')}</i>`:''}</span>`:''}</div>
      <div class="adm-ev-c"><span class="y">✓ ${c('yes')}</span><span class="m">? ${c('maybe')}</span><span class="n">✕ ${c('no')}</span>${e.status==='cancelled'?`<span class="ev-x">${T('cCancelled')}</span>`:past?`<span class="muted">${T('cPast')}</span>`:''}</div>
      <div class="adm-ev-a">${e.status==='cancelled'?`<button class="btn sm" onclick="CL.evStatus(${+e.id},'planned')">${T('cRestoreEv')}</button>`:past?'':`<button class="btn sm" onclick="CL.evStatus(${+e.id},'cancelled')">${T('cCancelEv')}</button>`}
        <button class="btn sm danger" onclick="CL.delEvent(${+e.id})">${T('cDelete')}</button></div></div>`; }).join('')+'</div>';
}
function drawAdminLive(){
  const el=$id('adm-live'); if(!el) return; const r=C.live, d=(r&&r.data)||{}, s=d.score||{};
  el.innerHTML=`<div class="card adm-live"><p class="cl-p">${T('cLiveHow')}</p><div class="cl-btns"><a class="btn" href="scorer/" target="_blank" rel="noopener">📱 ${T('cOpenScorer')}</a>
    ${r?`<a class="btn" href="#live">${T('cWatchLive')}</a>`:''}</div>
    ${r?`<div class="adm-live-row"><span class="lv-tag ${isLiveNow(r)?'on':''}">${isLiveNow(r)?`<i></i>${T('cLivePill')}`:r.status==='final'?T('cFinal'):T('cPaused')}</span>
      <b>${esc(r.id)}</b><span>${esc(((d.teams||{}).A||{}).name||'A')} ${s.A??0} : ${s.B??0} ${esc(((d.teams||{}).B||{}).name||'B')}</span>
      <span class="muted">${T('cUpdated')} ${whenShort(r.updated_at)}</span>
      ${r.status==='live'?`<button class="btn sm" onclick="CL.endLive()">${T('cEndLive')}</button>`:''}<button class="btn sm danger" onclick="CL.delLive()">🗑 ${T('cDelLive')}</button></div>`:`<p class="muted">${T('cNoLiveRow')}</p>`}</div>`;
}
function drawAdminUsers(){
  const el=$id('adm-users'), rq=$id('adm-req'); if(!el||!ADM.users) return;
  const reqs=ADM.users.filter(u=>u.requested_player_id&&!u.player_id);
  if(rq) rq.innerHTML=reqs.length?`<div class="card adm-list">`+reqs.map(u=>{ const p=S.players[u.requested_player_id];
      return `<div class="adm-req">${p?av(p,'s'):''}<div class="adm-u-t"><b>${esc(u.display_name||'—')}</b><span class="muted">${esc(u.email||'')} · ${T('cWants')} <b>${p?`#${p.number} ${esc(pname(p))}`:esc(u.requested_player_id)}</b></span></div>
        <div class="adm-ev-a"><button class="btn sm pri" onclick="CL.approve('${esc(u.id)}')">✓ ${T('cApprove')}</button><button class="btn sm" onclick="CL.reject('${esc(u.id)}')">${T('cReject')}</button></div></div>`; }).join('')+'</div>'
    :`<div class="card empty" style="margin-top:0">${T('cNoRequests')}</div>`;
  el.innerHTML=`<div class="card adm-list">`+ADM.users.map(u=>{ const self=C.user&&u.id===C.user.id, pr=C.profiles[u.id]||u;
    return `<div class="adm-user">${personAv(pr,'s')}<div class="adm-u-t"><b>${esc(u.display_name||'—')}${self?` <span class="muted">(${T('cYou')})</span>`:''}</b><span class="muted">${esc(u.email||'')} · ${T('cLastSeen')}: ${u.last_sign_in_at?whenShort(u.last_sign_in_at):T('cNever')}</span></div>
      <div class="adm-u-c"><select onchange="CL.setRole('${esc(u.id)}',this.value)" ${self?'disabled':''}>${['guest','player','admin'].map(r=>`<option value="${r}" ${u.role===r?'selected':''}>${T('cRole_'+r)}</option>`).join('')}</select>
        <select onchange="CL.setPlayer('${esc(u.id)}',this.value)"><option value="">${T('cPlayerL')}: —</option>${sortedPlayers().map(p=>`<option value="${esc(p.id)}" ${u.player_id===p.id?'selected':''}>#${p.number} ${esc(pname(p))}</option>`).join('')}</select>
        <button class="btn sm" onclick="CL.resetPass('${esc(u.id)}')">🔑 ${T('cReset')}</button></div></div>`; }).join('')+'</div>';
}
async function admUpdate(uid,patch){
  const {error}=await C.sb.from('profiles').update(patch).eq('id',uid);
  if(error){ fail(error); await admLoadUsers(); return false; }
  await admLoadUsers(); C.profAt=0; return true;
}
function approve(uid){ const u=ADM.users.find(x=>x.id===uid); if(!u) return;
  admUpdate(uid,{role:u.role==='admin'?'admin':'player',player_id:u.requested_player_id,requested_player_id:null}).then(ok=>ok&&toast('✓')); }
function reject(uid){ admUpdate(uid,{requested_player_id:null}); }
function setRole(uid,r){ admUpdate(uid,{role:r}); }
function setPlayer(uid,pid){ admUpdate(uid,{player_id:pid||null,...(pid?{requested_player_id:null}:{})}); }
function tempPass(){ const a='abcdefghjkmnpqrstuvwxyz23456789'; let s=''; const r=new Uint32Array(6); crypto.getRandomValues(r); r.forEach(x=>s+=a[x%a.length]); return 'softball-'+s; }
async function resetPass(uid){
  const u=ADM.users.find(x=>x.id===uid); if(!u||!confirm(T('cResetQ')(u.display_name||u.email))) return;
  const pw=tempPass();
  const {error}=await C.sb.rpc('admin_reset_password',{target:uid,new_password:pw});
  if(error){ fail(error); return; }
  const msg=T('cWAtext')(u.email,pw);
  openModal(sheetHead(T('cTempPass'))+`<p class="cl-p"><b>${esc(u.display_name||'')}</b> · ${esc(u.email||'')}</p><div class="cl-temp">${esc(pw)}</div><p class="cl-p muted">${T('cTempHint')}</p>
    <div class="cl-btns"><button class="btn" onclick="CL.copy(${esc(JSON.stringify(msg))})">${T('cCopy')}</button><a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${T('cSendWA')}</a></div>`);
}
function copy(t){ (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(T('tmCopied'))).catch(()=>prompt('',t)); }
async function addEvent(ev){
  ev.preventDefault(); const f=ev.target, dt=new Date(`${f.date.value}T${f.time.value}`);
  if(isNaN(dt)) return false;
  const btn=f.querySelector('button'); btn.disabled=true;
  const {error}=await C.sb.from('events').insert({starts_at:dt.toISOString(),place:f.place.value.trim()||'Əmircan',note:f.note.value.trim(),created_by:C.user.id});
  btn.disabled=false;
  if(error){ fail(error); return false; }
  f.note.value=''; toast('✓'); await admLoadEvents(); C.events=null; loadEvents(); return false;
}
async function evStatus(id,st){
  const {error}=await C.sb.from('events').update({status:st}).eq('id',id);
  if(error){ fail(error); return; } await admLoadEvents(); loadEvents();
}
async function delEvent(id){
  if(!confirm(T('cDelQ'))) return;
  const {error}=await C.sb.from('events').delete().eq('id',id);
  if(error){ fail(error); return; } await admLoadEvents(); loadEvents();
}
async function endLive(){
  if(!C.live) return;
  const {error}=await C.sb.from('live_games').update({status:'final',updated_at:new Date().toISOString()}).eq('id',C.live.id);
  if(error){ fail(error); return; } await loadLive(); drawAdminLive();
}

// удалить онлайн-счёт (например, тестовый) вместе с комментариями к нему
async function delLive(){
  if(!C.live||!confirm(T('cDelLiveQ'))) return;
  const id=C.live.id;
  const {error}=await C.sb.from('live_games').delete().eq('id',id);
  if(error){ fail(error); return; }
  await C.sb.from('comments').delete().eq('target','live:'+id);
  toast('✓'); await loadLive(); drawAdminLive();
}

// сколько переходов было внутри сайта — чтобы «Назад» не уводил с сайта
const NAV={n:-1}; window.addEventListener('hashchange',()=>{ NAV.n++; }); NAV.n=0;

/* ---------- Подключение к сайту ---------- */
window.CL={back:fb=>{ if(NAV.n>0) history.back(); else location.hash=fb; },oldBrowser:()=>openModal(sheetHead(T('cLogin'))+`<p class="cl-p">${T('cOldBrowser')}</p>`),redraw:()=>drawWidgets(),events:()=>C.events||[],isAdmin,canDecide:()=>C.ready&&canRsvp(),auth,close:closeModal,menu,closeMenu,logout,doLogin,doSignup,rsvp,toTeams,sendComment,delComment,saveName,request,changePass,
  approve,reject,setRole,setPlayer,resetPass,copy,addEvent,evStatus,delEvent,endLive,delLive};
const TEAMS_PAGE=(window.FEATURE_ROUTES||{}).teams||(()=>home());
Object.assign(window.FEATURE_ROUTES=window.FEATURE_ROUTES||{},{live:livePage,me:mePage,admin:adminPage,teams:teamsGate});
applyGates();
const _route=route; route=function(){ C.page=''; _route(); afterRoute(); };
const _chrome=chrome; chrome=function(){ _chrome(); renderAcct(); renderPill(); };

// supabase-js грузится асинхронно и не задерживает показ сайта.
// Свежие версии не запускаются в старом Safari (например, iPad mini 4 — максимум iPadOS 15),
// поэтому, если свежая не завелась, берём проверенную старую версию 2.45.4.
const SDK_NEW='@supabase/supabase-js@2', SDK_OLD='@supabase/supabase-js@2.45.4';
const SDK_SRC=[`https://cdn.jsdelivr.net/npm/${SDK_NEW}`,`https://cdn.jsdelivr.net/npm/${SDK_OLD}`,`https://unpkg.com/${SDK_NEW}`,`https://unpkg.com/${SDK_OLD}`];
function makeClient(){
  try{
    if(!(window.supabase&&typeof window.supabase.createClient==='function')) return false;
    const sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    if(!sb||typeof sb.from!=='function'||!sb.auth) return false;
    C.sb=sb; return true;
  }catch(e){ console.warn('[club]',e); return false; }
}
function loadSdk(){
  if(makeClient()){ init(); return; }
  const next=i=>{
    if(i>=SDK_SRC.length){ C.failed=true; console.warn('[club] supabase-js не загрузился'); renderAcct(); if(['live','me','admin','teams'].includes(C.page)) rerender(); return; }
    try{ window.supabase=undefined; }catch(e){}
    const sc=document.createElement('script'); sc.src=SDK_SRC[i]; sc.async=true;
    sc.onload=()=>{ if(makeClient()) init(); else next(i+1); }; sc.onerror=()=>next(i+1);
    document.head.appendChild(sc);
  };
  next(0);
}
function init(){
  C.ok=true;
  rerender();
  C.sb.auth.onAuthStateChange((ev,session)=>{ setTimeout(()=>onSession(session,false),0); });
  loadLive(); subscribe();
  setInterval(()=>{ if(document.visibilityState!=='visible') return;
    if(C.page==='live'&&C.rt!=='SUBSCRIBED') loadLive();
    if(C.page==='live'&&C.live) loadComments('live:'+C.live.id); },15e3);
  setInterval(()=>{ if(document.visibilityState==='visible'){ loadLive(); if(['home','games'].includes(C.page)) loadEvents().then(drawWidgets); } },120e3);
  document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'){ loadLive(); if(['home','games'].includes(C.page)) loadEvents().then(drawWidgets); } });
}
loadSdk();
})();
