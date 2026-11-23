"""Игра 22.11.2026: Gilavar Baku (A, бьёт первым) 15:11 Bina Warriors (B), 8 иннингов. Протокол — диктовка пользователя 22.11 (claude/game-2026-11-22-timings.txt).
t в plays — время на YouTube = время в смонтированном видео + 5.3 с заставки, минус 15 с.
Сразу пишет поля разбора рейтинга (po, a, fpo, rbi, pk, pbb, eb, ofb). eb — базы, отданные ошибкой самому дальнему бегуну."""
import json,sys
OFF=5.3; VIDEO='https://youtu.be/7jd6m162WDU'
RD,MO,AN,RA,FA,PA,FK,RZ,IH,HK,MM,KE='rashid','sergey-molchanov','sergey-antipov','rasul-21','farhad-eyvazov','parviz-ismayilov','fakhri-eyvazov','ramiz-ismayilov','ilham','hikmat','mammad-aliyev','kesha'
DA,EM,IG,VI,EL,SB,AL,RM,MU,BH,SD,RS='danylo-shapovalov','emilien','ilgar','vidadi','emil','sabir-talibov','alim','rasim','mushfig-ibrahimov','bahram-jamilov','sediyar-aliyev','rasul-4'
A_ord=[RD,MO,AN,RA,FA,PA,FK,RZ,IH,HK,MM,KE]; B_ord=[DA,EM,IG,VI,EL,SB,AL,RM,MU,BH,SD,RS]
POS=json.load(open('tools/pos_2026-11-22.json'))
TEAM={**{p:'A' for p in A_ord},**{p:'B' for p in B_ord}}
PIT={'A':AN,'B':RM}
OF={'LF','CF','RF','LCF','RCF','SF'}
def p(t,b,r,d=None,bt=None,f=(),fpo=None,po=(),a=(),e=(),eb=None,sc=(),rbi=0,o=None,dp=0,note=None,hl=None):
    return dict(t=t,b=b,r=r,d=d,bt=bt,f=list(f),fpo=fpo,po=list(po),a=list(a),e=list(e),eb=eb,sc=list(sc),rbi=rbi,o=o,dp=dp,note=note,hl=hl)
T=lambda m,s,fr=0: m*60+s+fr/30
H=[
 ('A',[
  p(T(0,10,15),RD,'ROE','1B','g',e=[MU]),
  p(T(0,25,0),MO,'FO','LF','f',fpo=DA,note='Рашид на 2-ю после ловли'),
  p(T(0,38,0),AN,'ROE','2B','g',e=[SB]),
  p(T(0,52,0),RA,'1B','RCF','f',f=[EL,RS],po=[RS],a=[EL],sc=[RD],rbi=1,o=1,note='Антипов аут на 2-й (Эмиль → Расул Шукюров)'),
  p(T(1,2,13),FA,'BB'),
  p(T(1,16,8),PA,'1B','RCF','l',sc=[RA],rbi=1),
  p(T(1,24,9),FK,'FO','RCF','f',fpo=RS),
 ]),
 ('B',[
  p(T(1,33,14),DA,'FO','LF','f',fpo=RD),
  p(T(1,41,14),EM,'1B','C','g',note='как бант'),
  p(T(1,48,22),IG,'FO','SS','l',fpo=MO),
  p(T(2,2,14),VI,'1B','2B','g'),
  p(T(2,15,9),EL,'ROE','3B','g',e=[RZ]),
  p(T(2,25,2),SB,'FO','LCF','f',fpo=RA),
 ]),
 ('A',[
  p(T(2,37,17),RZ,'1B','SS','g'),
  p(T(2,49,2),IH,'FO','2B','l',fpo=SB),
  p(T(3,7,15),HK,'ROE','RF','f',e=[EL],eb=[2],note='Рамиз с 1-й на 3-ю'),
  p(T(3,15,29),MM,'K'),
  p(T(3,22,11),KE,'K'),
 ]),
 ('B',[
  p(T(3,32,27),AL,'1B','SS','g'),
  p(T(3,42,16),RM,'FC','2B','g',f=[FA,MO],po=[MO],a=[FA]),
  p(T(3,57,9),MU,'ROE','SS','g',f=[MO],e=[PA],eb=[2],note='точный пас Молчанова, Пярвиз не поймал; Расим на 3-ю'),
  p(T(4,8,5),BH,'FC','SS','g',f=[MO,PA],po=[PA],a=[MO],sc=[RM],rbi=1),
  p(T(4,15,9),SD,'BB'),
  p(T(4,25,0),RS,'FC','SS','g',f=[MO,RZ],po=[RZ],a=[MO]),
 ]),
 ('A',[
  p(T(4,36,3),RD,'FO','LCF','f',fpo=RS),
  p(T(4,44,29),MO,'FO','LF','f',fpo=DA),
  p(T(4,55,8),AN,'1B','RCF','g'),
  p(T(5,11,5),RA,'HR','LCF','f',sc=[AN,RA],rbi=2,hl='HR'),
  p(T(5,28,5),FA,'1B','3B','g',e=[IG],note='Ильгар бросил мимо 1-й, Фархад на 2-ю'),
  p(T(5,42,23),PA,'1B','LF','f',sc=[FA],rbi=1),
  p(T(6,5,20),FK,'2B','RCF','f',sc=[PA],rbi=1,hl='2B'),
  p(T(6,17,8),RZ,'FO','RF','f',fpo=EL),
 ]),
 ('B',[
  p(T(6,26,6),DA,'ROE','SS','g',f=[MO],e=[HK],note='точный пас Молчанова, Хикмят не поймал'),
  p(T(6,35,22),EM,'FC','P','l',f=[AN,MO],po=[MO],a=[AN]),
  p(T(6,48,3),IG,'ROE','SS','g',f=[MO],e=[PA],note='точный пас Молчанова, Пярвиз не поймал'),
  p(T(7,9,4),VI,'1B','SS','g',e=[RA],eb=[2],sc=[EM,IG],rbi=1,note='ошибка Расула Алиева: Ильгар дома, Видади на 3-й'),
  p(T(7,26,28),EL,'GO','3B','g',f=[RZ,HK],po=[HK],a=[RZ],sc=[VI],rbi=1,note='спорный момент — OUT',hl='play'),
  p(T(7,37,18),SB,'GO','P','g',f=[AN,HK],po=[HK],a=[AN]),
 ]),
 ('A',[
  p(T(7,46,23),IH,'FO','SS','f',fpo=VI),
  p(T(7,58,20),HK,'1B','SS','g'),
  p(T(8,5,26),MM,'BB'),
  p(T(8,15,0),KE,'FC','P','g',f=[RM,AL],po=[AL],a=[RM]),
  p(T(8,26,2),RD,'1B','SS','g'),
  p(T(8,37,15),MO,'1B','LF','l',sc=[MM],rbi=1),
  p(T(8,53,15),AN,'1B','3B','g',sc=[KE],rbi=1),
  p(T(9,13,24),RA,'1B','SS','f',sc=[RD,MO],rbi=2,note='на броске домой Антипов на 3-ю, Расул на 2-ю'),
  p(T(9,33,0),FA,'2B','LCF','f',e=[VI],sc=[AN,RA],rbi=2,note='ошибка Видади при броске домой, Фархад на 3-ю'),
  p(T(9,43,25),PA,'ROE','3B','g',e=[AL],sc=[FA]),
  p(T(9,52,0),FK,'GO','2B','g',f=[VI,MU],po=[MU],a=[VI]),
 ]),
 ('B',[
  p(T(10,1,0),AL,'GO','2B','g',f=[PA,HK],po=[HK],a=[PA]),
  p(T(10,9,5),RM,'FO','P','f',fpo=AN),
  p(T(10,20,12),MU,'1B','2B','g'),
  p(T(10,28,0),BH,'FC','SS','g',f=[MO,PA],po=[PA],a=[MO]),
 ]),
 ('A',[
  p(T(10,37,21),RZ,'GO','SS','g',f=[VI,MU],po=[MU],a=[VI]),
  p(T(10,48,22),IH,'1B','2B','g'),
  p(T(11,1,15),HK,'FC','2B','g',f=[VI,AL],po=[AL],a=[VI]),
  p(T(11,7,5),MM,'BB'),
  p(T(11,18,12),KE,'1B','2B','g'),
  p(T(11,30,9),RD,'FO','CF','f',fpo=EM),
 ]),
 ('B',[
  p(T(11,40,0),SD,'GO','P','g',f=[AN,HK],po=[HK],a=[AN]),
  p(T(11,54,9),RS,'ROE','RCF','f',e=[KE]),
  p(T(12,3,3),DA,'FO','SS','l',fpo=MO),
  p(T(12,18,0),EM,'1B','2B','g'),
  p(T(12,31,15),IG,'1B','2B','g'),
  p(T(12,47,18),VI,'1B','SS','g',sc=[RS,EM],rbi=2),
  p(T(13,2,0),EL,'ROE','SS','g',f=[MO],e=[PA],eb=[2],sc=[IG],note='точный пас Молчанова, Пярвиз не поймал; Ильгар дома'),
  p(T(13,12,29),SB,'FC','3B','g',fpo=RZ),
 ]),
 ('A',[
  p(T(13,28,0),MO,'2B','LCF','l',hl='2B'),
  p(T(13,43,27),AN,'ROE','SS','g',e=[VI],eb=[2],note='одна ошибка Видади (ловля и бросок), Антипов на 2-й'),
  p(T(14,1,14),RA,'SAC','LF','f',fpo=IG,sc=[MO],rbi=1),
  p(T(14,10,16),FA,'BB'),
  p(T(14,28,7),PA,'FC','3B','g',fpo=AL,e=[AL],eb=[2],sc=[FA],note='Алим осалил Антипова, потом бросил мимо 2-й; Фархад дома'),
  p(T(14,38,3),FK,'GO','2B','g',f=[VI,MU],po=[MU],a=[VI]),
 ]),
 ('B',[
  p(T(14,47,15),AL,'GO','2B','g',f=[PA,HK],po=[HK],a=[PA]),
  p(T(15,2,14),RM,'2B','RF','f',hl='2B'),
  p(T(15,16,8),MU,'ROE','2B','g',e=[PA],eb=[2],sc=[RM]),
  p(T(15,26,17),BH,'1B','C','g'),
  p(T(15,35,0),SD,'FC','SS','g',f=[MO,RZ],po=[RZ],a=[MO]),
  p(T(15,45,3),RS,'FO','RF','f',fpo=MM),
 ]),
 ('A',[
  p(T(15,57,9),RZ,'1B','2B','g'),
  p(T(16,6,7),IH,'FO','SS','f',fpo=VI),
  p(T(16,29,2),HK,'FO','RF','f',fpo=EL,f=[EL,MU],po=[MU],a=[EL],o=2,dp=1,note='Рамиз ушёл с базы раньше — аут на 1-й',hl='DP'),
 ]),
 ('B',[
  p(T(16,40,4),DA,'1B','C','g'),
  p(T(16,50,10),EM,'1B','2B','g'),
  p(T(16,59,26),IG,'FO','CF','f',fpo=RA),
  p(T(17,15,29),VI,'1B','2B','f',sc=[DA],rbi=1),
  p(T(17,24,28),EL,'BB'),
  p(T(17,33,29),SB,'FC','3B','g',fpo=RZ,sc=[EM],rbi=1),
  p(T(17,42,17),AL,'FC','SS','g',f=[MO,FA],po=[FA],a=[MO]),
 ]),
 ('A',[
  p(T(17,55,0),MM,'GO','3B','g',f=[AL,MU],po=[MU],a=[AL]),
  p(T(18,5,29),KE,'1B','C','g'),
  p(T(18,23,0),RD,'BB'),
  p(T(18,38,0),MO,'FO','LCF','f',fpo=DA,f=[VI,RS],po=[RS],a=[VI],o=2,dp=1,note='Кеша ушёл со 2-й раньше — аут на 2-й',hl='DP'),
 ]),
 ('B',[
  p(T(18,49,29),RM,'1B','1B','g'),
  p(T(19,0,0),MU,'1B','2B','f'),
  p(T(19,14,29),BH,'FC','SS','g',f=[MO,FA],po=[FA],a=[MO]),
  p(T(19,21,29),SD,'BB'),
  p(T(19,32,29),RS,'SAC','2B','f',fpo=FA,sc=[RM],rbi=1),
  p(T(19,44,0),DA,'FO','LF','f',fpo=RD),
 ]),
]
# базы до каждого розыгрыша — из протокола (events.json монтажа)
EV=json.load(open('/home/claude/g2211/events.json'))['events']
flat=[x for _,pl in H for x in pl]
assert len(flat)==len(EV),(len(flat),len(EV))
F_=['PA','AB','H','1B','2B','3B','HR','BB','K','R','RBI','ROE','FC','SAC','PO','FPO','KPO','PK','PBB','A','E','E2','E3','OFF2','OFF3']
box={q:{'player':q,'team':TEAM[q],'pos':POS[q],**{k:0 for k in F_}} for q in TEAM}
pbp=[]; score={'A':0,'B':0}; inn={'A':0,'B':0}; line={'A':[],'B':[]}; n=0; last_t=0; hl=[]; k=0
for t,plays in H:
    inn[t]+=1; outs=0; runs=0; bases=[]
    for x in plays:
        ev=EV[k]; k+=1
        n+=1; b=x['b']; r=x['r']; X=box[b]
        X['PA']+=1
        if r not in('BB','SAC'): X['AB']+=1
        if r in('1B','2B','3B','HR'): X['H']+=1; X[r]+=1
        if r in('BB','K','ROE','FC','SAC'): X[r]+=1
        X['RBI']+=x['rbi']
        for s in x['sc']: box[s]['R']+=1; runs+=1; score[t]+=1
        po=list(x['po'])+([x['fpo']] if x['fpo'] else [])
        for q in po: box[q]['PO']+=1
        if x['fpo']: box[x['fpo']]['FPO']+=1
        for q in x['a']: box[q]['A']+=1
        eb=x['eb'] or [1]*len(x['e'])
        for q,v in zip(x['e'],eb):
            box[q]['E']+=1
            if v==2: box[q]['E2']+=1
            if v>=3: box[q]['E3']+=1
        D='B' if t=='A' else 'A'
        if r=='K': box[PIT[D]]['PK']+=1
        if r=='BB': box[PIT[D]]['PBB']+=1
        o=x['o'] if x['o'] is not None else (1 if r in('GO','FO','K','SAC','FC') else 0)
        outs+=o
        assert outs==ev['outs'],(n,b,outs,ev['outs'])
        assert [score['A'],score['B']]==ev['score'],(n,b,score,ev['score'])
        ofb=None
        if x['fpo'] and r in('FO','SAC') and POS[x['fpo']] in OF and bases:
            far=max(bases)
            if far>=2: ofb=far; box[x['fpo']]['OFF3' if far==3 else 'OFF2']+=1
        tt=x['t']+OFF
        y={'n':n,'i':inn[t],'h':'T' if t=='A' else 'B','b':b,'r':r,'o':outs,'s':[score['A'],score['B']],'t':int(last_t) if last_t and tt-last_t<45 else int(max(0,tt-15))}  # с начала эпизода (конец предыдущего), чтобы был виден удар (23.11.2026)
        if x['d']: y['d']=x['d']
        if x['bt']: y['bt']=x['bt']
        fl=list(dict.fromkeys(([x['fpo']] if x['fpo'] else [])+x['f']))
        if fl: y['f']=fl
        if x['e']: y['e']=x['e']
        if x['eb'] and any(v>1 for v in x['eb']): y['eb']=x['eb']
        if x['sc']: y['sc']=x['sc']
        if x['dp']: y['dp']=1
        if x['note']: y['note']=x['note']
        if po: y['po']=po
        if x['a']: y['a']=x['a']
        if x['fpo']: y['fpo']=x['fpo']
        if x['rbi']: y['rbi']=x['rbi']
        if r=='K': y['pk']=PIT[D]
        if r=='BB': y['pbb']=PIT[D]
        if ofb: y['ofb']={x['fpo']:ofb}
        pbp.append(y)
        if x['hl']: hl.append({'player':b if x['hl'] not in('catch','DP') else (x['fpo'] or b),'t':y['t'],'type':x['hl']})
        last_t=tt
        bases=ev['bases']
    assert outs==3,(t,inn[t],outs)
    line[t].append(runs)
print(line,score)
G={'id':'2026-11-22','date':'2026-11-22','venue':'Amirajan, Baku','video':VIDEO,
   'teams':{'A':{'name':'Gilavar Baku','color':'#1f6fc0'},'B':{'name':'Bina Warriors','color':'#D85A30'}},
   'linescore':line,'score':score,'box':list(box.values()),
   'note':'Протокол по видео (диктовка 22.11.2026). Gilavar 15:11, 8 иннингов. Gilavar бьёт первым.',
   'highlights':hl,'plays':pbp,'clips':2}
json.dump(G,open('data/games/2026-11-22.json','w'),ensure_ascii=False,indent=1)
