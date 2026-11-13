// Softball Baku — страница «Правила»: основы софтбола, позиции, термины статистики, как считается рейтинг.
'use strict';
const RULES={
 ru:{title:'Правила софтбола',sub:'Коротко и понятно: для новичков и для тех, кто хочет разобраться в статистике.',
  sec:[
   ['Коротко об игре',`<p>Две команды по очереди нападают и защищаются. Нападающая команда бьёт по мячу и бежит по базам против часовой стрелки: <b>1-я → 2-я → 3-я → дом</b>. Каждый игрок, добежавший до дома, приносит команде <b>ран</b> (очко).</p>
    <p>Защита старается сделать <b>три аута</b>, после этого команды меняются. Когда обе команды отбили, заканчивается <b>иннинг</b>. Побеждает тот, кто набрал больше ранов.</p>`],
   ['Отбивание',`<ul><li><b>Страйк</b>: мяч прошёл через зону удара или бэттер промахнулся. 3 страйка — <b>страйк-аут</b>.</li>
    <li><b>Бол</b>: подача мимо зоны. 4 бола — бэттер идёт на 1-ю базу (<b>BB</b>).</li>
    <li><b>Фол</b>: мяч улетел за линии поля. Считается страйком, но третьим страйком быть не может.</li>
    <li><b>Хит</b>: удар, после которого бэттер сам добежал до базы. Сингл, дабл, трипл, а <b>хоум-ран</b> — когда он обежал все базы.</li></ul>`],
   ['Как делают аут',`<ul><li><b>Страйк-аут</b>: три страйка.</li><li><b>Флай-аут</b>: защитник поймал мяч с лёту.</li>
    <li><b>Форс-аут</b>: бегун обязан бежать на следующую базу, а мяч оказался там раньше.</li><li><b>Тэг-аут</b>: бегуна коснулись мячом, когда он не на базе.</li></ul>
    <p>Если флай поймали, бегун должен сначала вернуться на свою базу и только потом бежать дальше.</p>`],
   ['Наши правила',`<p class="muted">Количество иннингов, счёт на подаче, правило досрочного окончания при большом разрыве — этот раздел заполним вместе с организаторами.</p>`]
  ]},
 az:{title:'Softbol qaydaları',sub:'Qısa və aydın: yeni başlayanlar və statistikanı anlamaq istəyənlər üçün.',
  sec:[
   ['Oyun haqqında qısaca',`<p>İki komanda növbə ilə hücum və müdafiə edir. Hücum edən komanda topu vurur və bazalar üzrə saat əqrəbinin əksinə qaçır: <b>1-ci → 2-ci → 3-cü → ev</b>. Evə çatan hər oyunçu komandaya <b>ran</b> (xal) qazandırır.</p>
    <p>Müdafiə <b>üç aut</b> etməyə çalışır, bundan sonra komandalar yerlərini dəyişir. Hər iki komanda vurduqdan sonra <b>inninq</b> bitir. Daha çox ran toplayan qalib gəlir.</p>`],
   ['Vuruş',`<ul><li><b>Strayk</b>: top vuruş zonasından keçdi və ya vuran yayındı. 3 strayk — <b>strayk-aut</b>.</li>
    <li><b>Bol</b>: zonadan kənar atış. 4 bol — vuran 1-ci bazaya gedir (<b>BB</b>).</li>
    <li><b>Faul</b>: top meydanın xətlərindən kənara uçdu. Strayk sayılır, amma üçüncü strayk ola bilməz.</li>
    <li><b>Hit</b>: vurandan sonra oyunçu özü bazaya çatır. Sinql, dabl, tripl, <b>homeran</b> isə bütün bazaları dolananda.</li></ul>`],
   ['Aut necə edilir',`<ul><li><b>Strayk-aut</b>: üç strayk.</li><li><b>Flay-aut</b>: müdafiəçi topu havada tutdu.</li>
    <li><b>Fors-aut</b>: qaçan növbəti bazaya qaçmalıdır, top isə ora daha tez çatdı.</li><li><b>Teq-aut</b>: qaçana baza üzərində olmayanda topla toxundular.</li></ul>
    <p>Flay tutulubsa, qaçan əvvəlcə öz bazasına qayıtmalı, sonra irəli qaça bilər.</p>`],
   ['Bizim qaydalar',`<p class="muted">İnninqlərin sayı, atışda hesab, böyük fərqdə oyunun vaxtından əvvəl bitməsi — bu bölməni təşkilatçılarla birlikdə dolduracağıq.</p>`]
  ]},
 en:{title:'Softball rules',sub:'Short and clear: for newcomers and for anyone who wants to understand the stats.',
  sec:[
   ['The game in brief',`<p>Two teams take turns batting and fielding. The batting team hits the ball and runs the bases counter-clockwise: <b>1st → 2nd → 3rd → home</b>. Every player who reaches home scores a <b>run</b>.</p>
    <p>The fielding team tries to make <b>three outs</b>, then the teams switch. When both teams have batted, the <b>inning</b> is over. The team with more runs wins.</p>`],
   ['Batting',`<ul><li><b>Strike</b>: the pitch crosses the strike zone or the batter swings and misses. 3 strikes — <b>strikeout</b>.</li>
    <li><b>Ball</b>: a pitch outside the zone. 4 balls — the batter walks to first base (<b>walk</b>).</li>
    <li><b>Foul</b>: the ball goes outside the foul lines. It counts as a strike, but can't be the third one.</li>
    <li><b>Hit</b>: the batter reaches base on his own. Single, double, triple — and a <b>home run</b> when he rounds all the bases.</li></ul>`],
   ['How outs are made',`<ul><li><b>Strikeout</b>: three strikes.</li><li><b>Fly out</b>: a fielder catches the ball in the air.</li>
    <li><b>Force out</b>: the runner has to advance, and the ball gets to the base first.</li><li><b>Tag out</b>: the runner is touched with the ball while off a base.</li></ul>
    <p>After a caught fly ball, runners must go back to their base before advancing.</p>`],
   ['Our house rules',`<p class="muted">Number of innings, pitch count, mercy rule for big leads — we'll fill this in together with the organizers.</p>`]
  ]}
};
const GLOSS={
 ru:{t:'Термины статистики',items:[['AB','выходы на биту без BB'],['H','хиты'],['1B / 2B / 3B','сингл / дабл / трипл'],['HR','хоум-раны'],['BB','4 бола — бэттер проходит на 1-ю базу'],['K','страйк-ауты'],['R','раны — сколько раз игрок дошёл до дома'],['RBI','раны, принесённые ударом этого игрока'],['ROE','попал на базу по ошибке защиты'],['AVG','H ÷ AB — доля хитов'],['OBP','(H + BB + ROE) ÷ (AB + BB + ROE + SAC) — как часто попадает на базу; ROE — попал на базу из-за ошибки защиты'],['SAC','сакрифайс (жертвенный удар): бьющий выбыл, но продвинул бегуна; в AB не входит, RBI засчитывается'],['SLG','базы за удары ÷ AB — сила ударов'],['OPS','OBP + SLG — общий показатель бэттера'],['PO','ауты, сделанные в защите'],['A','передачи, после которых сделан аут'],['E','ошибки в защите']]},
 az:{t:'Statistika terminləri',items:[['AB','BB olmadan vuruşa çıxışlar'],['H','hitlər'],['1B / 2B / 3B','sinql / dabl / tripl'],['HR','homeranlar'],['BB','4 bol — vuran 1-ci bazaya keçir'],['K','strayk-autlar'],['R','ranlar — oyunçu neçə dəfə evə çatıb'],['RBI','bu oyunçunun vuruşu ilə gələn ranlar'],['ROE','müdafiə səhvi ilə bazaya çıxdı'],['AVG','H ÷ AB — hit payı'],['OBP','(H + BB + ROE) ÷ (AB + BB + ROE + SAC) — bazaya nə qədər tez-tez çıxır; ROE — müdafiənin səhvi ilə bazaya çıxış'],['SAC','sakrifays: vuran aut olur, amma qaçışçını irəlilədir; AB-yə daxil deyil, RBI sayılır'],['SLG','vuruşlarla qazanılan bazalar ÷ AB — vuruş gücü'],['OPS','OBP + SLG — vuranın ümumi göstəricisi'],['PO','müdafiədə edilən autlar'],['A','autla nəticələnən ötürmələr'],['E','müdafiədə səhvlər']]},
 en:{t:'Stat glossary',items:[['AB','at-bats, not counting walks'],['H','hits'],['1B / 2B / 3B','single / double / triple'],['HR','home runs'],['BB','walks'],['K','strikeouts'],['R','runs — times the player crossed home'],['RBI','runs driven in by this player\'s hit'],['ROE','reached base on a fielding error'],['AVG','H ÷ AB — share of hits'],['OBP','(H + BB + ROE) ÷ (AB + BB + ROE + SAC) — how often he gets on base; ROE — reached on a fielding error'],['SAC','sacrifice: the batter is out but advances a runner; not an at-bat, RBI counts'],['SLG','total bases ÷ AB — hitting power'],['OPS','OBP + SLG — overall hitting'],['PO','putouts on defense'],['A','assists — throws that led to an out'],['E','fielding errors']]}
};
const RT_TXT={
 ru:{t:'Как считается рейтинг',intro:b=>`Каждый игрок начинает игру с <b>${b.toFixed(1)}</b>. Дальше за каждое действие добавляются или снимаются баллы. Итог за игру — от 3 до 10, рейтинг сезона — среднее по играм.`,
   bat:'Бита',def:'Защита',win:'Победа команды',
   n:{'1B':'Сингл','2B':'Дабл','3B':'Трипл',HR:'Хоум-ран',BB:'BB',ROE:'Попал на базу по ошибке защиты',R:'Ран',RBI:'RBI',OUT:'Аут при выходе на биту (по земле, флай…)',K:'Страйк-аут',FPO:'Сам сделал аут (флай или сам на базе)',A:'Передача на аут',RPO:'Принял бросок на аут',KPO:'Кэтчер принял третий страйк',PBB:'BB отбивающему, пока подавал (питчер)',PK:'Страйк-аут на подаче (питчер)',E:'Ошибка (отдала 1 базу)',E2:'Ошибка (2 базы)',E3:'Ошибка (3+ базы)',WIN:'Бонус за победу'}},
 az:{t:'Reytinq necə hesablanır',intro:b=>`Hər oyunçu oyuna <b>${b.toFixed(1)}</b> ilə başlayır. Sonra hər hərəkət üçün bal əlavə olunur və ya çıxılır. Oyunun nəticəsi 3-dən 10-a qədər, mövsüm reytinqi — oyunlar üzrə ortalama.`,
   bat:'Vuruş',def:'Müdafiə',win:'Komandanın qələbəsi',
   n:{'1B':'Sinql','2B':'Dabl','3B':'Tripl',HR:'Homeran',BB:'BB',ROE:'Müdafiə səhvi ilə bazaya çıxdı',R:'Ran',RBI:'RBI',OUT:'Vuruşda aut',K:'Strayk-aut',FPO:'Özü aut etdi (flay və ya özü bazada)',A:'Auta ötürmə',RPO:'Auta atışı qəbul etdi',KPO:'Ketçer üçüncü straykı tutdu',PBB:'Atıcı olarkən vuruşçuya BB',PK:'Atışda strayk-aut (pitçer)',E:'Səhv (1 baza)',E2:'Səhv (2 baza)',E3:'Səhv (3+ baza)',WIN:'Qələbə bonusu'}},
 en:{t:'How the rating works',intro:b=>`Every player starts a game at <b>${b.toFixed(1)}</b>. Points are then added or taken away for each action. A game score is 3 to 10; the season rating is the average across games.`,
   bat:'Batting',def:'Defense',win:'Team win',
   n:{'1B':'Single','2B':'Double','3B':'Triple',HR:'Home run',BB:'Walk',ROE:'Reached on error',R:'Run',RBI:'RBI',OUT:'Out while batting (groundout, flyout…)',K:'Strikeout',FPO:'Made the out himself (fly or unassisted)',A:'Assist',RPO:'Took a throw for an out',KPO:'Catcher caught strike three',PBB:'Walk allowed while pitching',PK:'Strikeout while pitching',E:'Error (1 base given)',E2:'Error (2 bases)',E3:'Error (3+ bases)',WIN:'Win bonus'}}
};
function fieldSVG(){
  // схема для 10 игроков в защите: четыре аутфилдера
  const FXY={LF:[14,27],LCF:[35,13],RCF:[65,13],RF:[86,27],SS:[34,44],'2B':[66,44],P:[50,62],'3B':[20,63],'1B':[80,63],C:[50,90]};
  let s=`<svg viewBox="0 0 100 100" class="field"><path d="M50 96 L4 50 A64 64 0 0 1 96 50 Z" fill="#12301f" stroke="#1d4a30" stroke-width=".6"/>
    <path d="M50 92 L24 66 L50 40 L76 66 Z" fill="#5a3b22" opacity=".55"/><path d="M50 86 L30 66 L50 46 L70 66 Z" fill="#1a3d28"/>`;
  for(const [x,y] of [[76,66],[50,40],[24,66]]) s+=`<rect x="${x-1.6}" y="${y-1.6}" width="3.2" height="3.2" transform="rotate(45 ${x} ${y})" fill="#eef2f8"/>`;
  s+=`<path d="M48.2 91 h3.6 v1.6 l-1.8 1.6 l-1.8 -1.6 z" fill="#EF9F27"/>`;
  for(const [p,[x,y]] of Object.entries(FXY)) s+=`<g><circle cx="${x}" cy="${y}" r="4.6" fill="#0b1626" stroke="#EF9F27" stroke-width=".7"/><text x="${x}" y="${y+1.3}" font-size="3.6" font-weight="800" fill="#eef2f8" text-anchor="middle">${p}</text></g>`;
  return s+'</svg>';
}
// пример (без имени и фото): цифры лучшего игрока периода — общий рейтинг и разбивка «нападение / защита»
function rateExample(){
  if(typeof rsplit!=='function'||!S.players) return '';
  const P=Object.values(S.players).filter(p=>p.t&&p.t.G&&p.t.RAT!=null&&p.t.OFF!=null).sort((a,b)=>b.t.RAT-a.t.RAT)[0];
  if(!P) return '';
  const t=P.t, B=typeof BASE!=='undefined'?BASE:6, sum=Math.round((B+t.OFF+t.DEF)*10)/10;
  const L={ru:{h:'Пример',tot:'Общий рейтинг',sub:'так он выглядит в профиле игрока',eq:'старт',o:'нападение',d:'защита'},
           az:{h:'Nümunə',tot:'Ümumi reytinq',sub:'oyunçu profilində belə görünür',eq:'başlanğıc',o:'hücum',d:'müdafiə'},
           en:{h:'Example',tot:'Overall rating',sub:'this is how it looks in a player profile',eq:'start',o:'offense',d:'defense'}}[LANG]||{};
  const n=v=>`${v>=0?'+':'−'}${Math.abs(Math.round(v*100)/100).toFixed(2)}`;
  const eq=Math.abs(sum-t.RAT)<0.06?`<div class="rx-eq"><b>${B.toFixed(1)}</b> ${L.eq} <span class="${t.OFF>=0?'pos':'neg'}">${n(t.OFF)}</span> ${L.o} <span class="${t.DEF>=0?'pos':'neg'}">${n(t.DEF)}</span> ${L.d} = ${rt(t.RAT)}</div>`:'';
  return `<div class="rx"><h4>${L.h}</h4><div class="rx-p"><span><b>${L.tot}</b><small>${L.sub}</small></span>${rt(t.RAT,'lg')}</div>${rsplit(t)}${eq}</div>`;
}
window.rulesPage=function(){
  const R=RULES[LANG]||RULES.en, G=GLOSS[LANG]||GLOSS.en, X=RT_TXT[LANG]||RT_TXT.en;
  const NUM={P:1,C:2,'1B':3,'2B':4,'3B':5,SS:6,LF:7,LCF:8,RCF:9,RF:10};
  let h=`<div class="pagehead"><span class="eyebrow">${S.league}</span><h1>${R.title}</h1><p class="muted">${R.sub}</p></div>`;
  h+=`<div class="rules-top"><div class="card rule">${'<h3>'+R.sec[0][0]+'</h3>'+R.sec[0][1]}</div>
     <div class="card rule field-card">${fieldSVG()}<div class="poslist">${Object.entries(NUM).map(([p,n])=>`<div><b>${p}</b><span>${POS_NAMES[LANG][p]}</span><i>${n}</i></div>`).join('')}</div></div></div>`;
  h+=`<div class="rules-grid">${R.sec.slice(1,3).map(([t,b])=>`<div class="card rule"><h3>${t}</h3>${b}</div>`).join('')}</div>`;
  // рейтинг — веса берутся прямо из формулы в app.js
  const fmt=v=>(v>0?'+':v<0?'−':'±')+Math.abs(v).toFixed(2).replace(/0$/,'');
  const bat=['1B','2B','3B','HR','BB','ROE','R','RBI','OUT','K'], def=['FPO','A','RPO','PK','PBB','E','E2','E3'];
  const row=k=>(k in W)?`<div class="w-row"><span>${X.n[k]}</span><b class="${W[k]>0?'pos':W[k]<0?'neg':''}">${fmt(W[k])}</b></div>`:'';
  h+=`<div class="section-title"><h2 data-ic="chart">${X.t}</h2></div><div class="card rule"><p>${X.intro(typeof BASE!=='undefined'?BASE:6)}</p>
     <div class="w-cols"><div><h4>${X.bat}</h4>${bat.map(row).join('')}</div><div><h4>${X.def}</h4>${def.map(row).join('')}</div><div>${'WIN' in W?`<h4>${X.win}</h4>${row('WIN')}`:''}
     <div class="r-scale">${[['low','< 5'],['avg','5–5.9'],['mid','6–6.9'],['good','7–7.9'],['great','8–8.9'],['elite','9–10']].map(([c,l])=>`<span style="background:${RCOL[c]}">${l}</span>`).join('')}</div>${rateExample()}</div></div></div>`;
  h+=`<div class="section-title"><h2 data-ic="book">${G.t}</h2></div><div class="card gloss">${G.items.map(([k,v])=>`<div><b>${k}</b><span>${v}</span></div>`).join('')}</div>`;
  h+=`<div class="section-title"><h2 data-ic="shield">${R.sec[3][0]}</h2></div><div class="card rule">${R.sec[3][1]}</div>`;
  app().innerHTML=h;
};
