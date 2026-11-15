"""Игра 15.11.2026: Gilavar Baku (A, бьёт первым) 9:9 Bina Warriors (B). Разметка — диктовка пользователя 15.11 (stats_15-11.txt).
t в plays — время на YouTube = время в смонтированном видео + 5.3 с заставки, минус 15 с (как в 01.11)."""
import json
OFF=5.3
# Gilavar
RS,EM,MO,DA,AN,RD,HK,AL,IH,NA,SD='rasul-4','emilien','sergey-molchanov','danylo-shapovalov','sergey-antipov','rashid','hikmat','alim','ilham','nariman','sediyar-aliyev'
# Bina
IG,RZ,FA,RA,VI,RM,MU,PA,MM,KE='ilgar','ramiz-ismayilov','farhad-eyvazov','rasul-21','vidadi','rasim','mushfig-ibrahimov','parviz-ismayilov','mammad-aliyev','kesha'
A_ord=[RS,EM,MO,DA,AN,RD,HK,AL,IH,NA,SD]; B_ord=[IG,RZ,FA,RA,VI,RM,MU,PA,MM,KE]
POS={AN:'P',SD:'C',HK:'1B',RS:'2B',RD:'3B',MO:'SS',DA:'LF',EM:'LCF',AL:'RCF',IH:'RF',NA:'RF',
     RM:'P',KE:'C',MU:'1B',PA:'2B',IG:'3B',VI:'SS',RA:'LF',RZ:'LCF',FA:'RCF',MM:'RF'}
TEAM={**{p:'A' for p in A_ord},**{p:'B' for p in B_ord}}
PIT={'A':AN,'B':RM}
def p(t,b,r,d=None,bt=None,f=(),fpo=None,po=(),a=(),e=(),e2=(),sc=(),rbi=0,o=None,dp=0,note=None,hl=None):
    return dict(t=t,b=b,r=r,d=d,bt=bt,f=list(f),fpo=fpo,po=list(po),a=list(a),e=list(e),e2=list(e2),sc=list(sc),rbi=rbi,o=o,dp=dp,note=note,hl=hl)
T=lambda m,s,fr=0: m*60+s+fr/30
H=[ # (half, [plays])
 ('A',[
  p(T(0,8,10),RS,'FO','P','f',f=[RM],fpo=RM),
  p(T(0,19,13),EM,'ROE','P','g',e=[RM]),
  p(T(0,31,18),MO,'1B','LCF','l'),
  p(T(0,45,11),DA,'1B','3B','g'),
  p(T(0,57,24),AN,'1B','2B','g',sc=[EM],rbi=1),
  p(T(1,10,27),RD,'1B','LF','l',sc=[MO],rbi=1),
  p(T(1,25,4),HK,'1B','CF','l',sc=[DA],rbi=1),
  p(T(1,39,15),AL,'FC','P','g',e=[KE],sc=[AN],o=0,note='Расим бросил домой, Кеша не поймал'),
  p(T(1,52,3),IH,'1B','3B','g',sc=[RD],rbi=1),
  p(T(2,4,0),NA,'BB',sc=[HK],rbi=1),
  p(T(2,14,10),SD,'BB',sc=[AL],rbi=1),
  p(T(2,25,24),RS,'FO','RF','f',f=[MM,VI],fpo=MM,po=[VI],a=[MM],o=2,dp=1),
 ]),
 ('B',[
  p(T(2,37,27),IG,'FO','LF','f',f=[DA],fpo=DA),
  p(T(2,49,25),RZ,'1B','CF','f'),
  p(T(3,3,23),FA,'FC','3B','g',f=[RD,RS],po=[RS],a=[RD]),
  p(T(3,17,12),RA,'ROE','SS','f',e=[MO]),
  p(T(3,45,28),VI,'1B','LCF','g',e=[EM],sc=[FA],rbi=1,note='ошибка броска Эмильена: +1 база бегунам'),
  p(T(3,57,14),RM,'GO','P','g',f=[AN,HK],po=[HK],a=[AN]),
 ]),
 ('A',[
  p(T(4,6,14),EM,'BB'),
  p(T(4,15,28),MO,'FO','LF','f',f=[RA],fpo=RA),
  p(T(4,24,13),DA,'FO','3B','l',f=[IG],fpo=IG),
  p(T(4,37,8),AN,'1B','RF','f'),
  p(T(4,47,15),RD,'FO','2B','f',f=[PA],fpo=PA),
 ]),
 ('B',[
  p(T(5,0,19),MU,'ROE','3B','g',e=[HK]),
  p(T(5,12,10),PA,'FC','SS','g',f=[MO,RS],po=[RS],a=[MO]),
  p(T(5,19,23),MM,'K'),
  p(T(5,27,27),KE,'1B','C','g',note='бант'),
  p(T(5,37,21),IG,'1B','CF','f'),
  p(T(5,48,14),RZ,'GO','2B','g',f=[RS,HK],po=[HK],a=[RS]),
 ]),
 ('A',[
  p(None,HK,'GO','2B','g',f=[VI,MU],po=[MU],a=[VI],note='нет в видео'),
  p(T(6,2,23),AL,'BB'),
  p(T(6,11,1),IH,'FO','2B','f',f=[VI],fpo=VI),
  p(T(6,26,10),NA,'FC','3B','g',e=[IG],o=0,note='Ильгар бросил на 2-ю мимо, Алим на 3-ю'),
  p(T(6,33,10),SD,'BB'),
  p(T(6,41,10),RS,'BB',sc=[AL],rbi=1),
  p(T(6,51,7),EM,'K'),
 ]),
 ('B',[
  p(T(7,2,25),FA,'ROE','3B','g',e=[RD]),
  p(T(7,17,24),RA,'1B','CF','f'),
  p(T(7,25,26),VI,'FO','2B','f',f=[RS],fpo=RS),
  p(T(7,40,27),RM,'1B','CF','g',e=[IH],sc=[FA],note='Фархад дома из-за ошибки Ильхама'),
  p(T(7,49,24),MU,'BB'),
  p(T(8,1,5),PA,'1B','LCF','l',sc=[RA],rbi=1),
  p(T(8,9,8),MM,'BB',sc=[RM],rbi=1),
  p(T(8,11,0),KE,'FC','SS','g',f=[MO,RD],po=[RD],a=[MO],sc=[MU],rbi=1),
  p(T(8,18,7),IG,'FC','P','g',f=[AN,RD],po=[RD],a=[AN]),
 ]),
 ('A',[
  p(T(8,26,25),MO,'1B','LF','l'),
  p(T(8,36,25),DA,'FC','3B','g',f=[IG,PA],po=[PA],a=[IG]),
  p(T(8,47,10),AN,'FC','3B','g',f=[IG,PA],po=[PA],a=[IG]),
  p(T(9,0,24),RD,'1B','RCF','l'),
  p(T(9,14,10),HK,'FO','2B','f',f=[PA],fpo=PA),
 ]),
 ('B',[
  p(T(9,27,3),RZ,'ROE','SS','g',e=[MO],e2=[MO]),
  p(T(9,42,0),FA,'1B','LCF','g',e=[EM]),
  p(T(10,2,0),RA,'1B','CF','g',e=[MO],sc=[RZ,FA],rbi=2),
  p(T(10,13,4),VI,'1B','CF','g',sc=[RA],rbi=1),
  p(T(10,24,26),RM,'1B','LCF','l'),
  p(T(10,36,22),MU,'FC','P','g',f=[AN,RD],po=[RD],a=[AN]),
  p(T(10,47,26),PA,'FC','SS','g',f=[MO,RS],po=[RS],a=[MO]),
  p(T(10,58,0),MM,'GO','P','g',f=[AN,HK],po=[HK],a=[AN]),
 ]),
 ('A',[
  p(None,AL,'FO','LF','f',f=[RA],fpo=RA,note='нет в видео'),
  p(T(11,8,22),IH,'GO','2B','g',f=[PA,MU],po=[MU],a=[PA]),
  p(T(11,15,7),NA,'K'),
 ]),
 ('B',[
  p(T(11,25,22),KE,'GO','SS','g',f=[MO,HK],po=[HK],a=[MO]),
  p(T(11,38,0),IG,'1B','CF','g'),
  p(T(11,48,7),RZ,'1B','RCF','l'),
  p(T(12,0,0),FA,'FC','3B','g',f=[RD],fpo=RD),
  p(T(12,10,9),RA,'FO','P','f',f=[AN],fpo=AN),
 ]),
 ('A',[
  p(T(12,21,0),SD,'GO','SS','g',f=[VI,MU],po=[MU],a=[VI]),
  p(T(12,32,0),RS,'1B','SS','g'),
  p(T(12,42,16),EM,'1B','RF','l'),
  p(T(12,52,0),MO,'FO','SS','f',f=[VI],fpo=VI),
  p(T(13,0,0),DA,'BB'),
  p(T(13,12,0),AN,'FO','2B','l',f=[PA],fpo=PA,hl='catch'),
 ]),
 ('B',[
  p(T(13,31,28),VI,'2B','RF','f',hl='2B'),
  p(T(13,44,0),RM,'1B','SS','f'),
  p(T(13,56,22),MU,'FC','SS','g',f=[MO,RS],po=[RS],a=[MO],sc=[VI],rbi=1),
  p(T(14,8,0),PA,'FC','3B','g',f=[RD,RS],po=[RS],a=[RD]),
  p(T(14,20,0),MM,'FC','3B','g',e=[RS],o=0,note='Рашид точно бросил на 2-ю, Расул Шукюров не поймал'),
  p(T(14,31,26),KE,'FO','3B','f',f=[RD],fpo=RD),
 ]),
 ('A',[
  p(T(14,55,16),RD,'1B','2B','g',note='спорный момент — SAFE',hl='play'),
  p(T(15,12,24),HK,'GO','P','g',f=[RM,MU],po=[MU],a=[RM],e=[MU],sc=[RD],note='Мушфиг бросил на 3-ю мимо, Рашид дома'),
  p(T(15,22,22),AL,'GO','P','g',f=[RM,MU],po=[MU],a=[RM]),
  p(T(15,35,18),IH,'GO','1B','g',f=[MU],fpo=MU),
 ]),
 ('B',[
  p(T(15,50,25),IG,'1B','LCF','f'),
  p(T(16,2,11),RZ,'FO','3B','l',f=[RD,HK],fpo=RD,po=[HK],a=[RD],o=2,dp=1,hl='DP'),
  p(T(16,23,0),FA,'ROE','3B','g',e=[RD],f=[HK,RS],po=[RS],a=[HK],o=1,note='потом выбит на 2-й'),
 ]),
]
F_=['PA','AB','H','1B','2B','3B','HR','BB','K','R','RBI','ROE','FC','SAC','PO','FPO','KPO','PK','PBB','A','E','E2','E3']
box={q:{'player':q,'team':TEAM[q],'pos':POS[q],**{k:0 for k in F_}} for q in TEAM}
pbp=[]; score={'A':0,'B':0}; inn={'A':0,'B':0}; line={'A':[],'B':[]}; n=0; last_t=0; hl=[]
for t,plays in H:
    inn[t]+=1; outs=0; runs=0; order=A_ord if t=='A' else B_ord
    for x in plays:
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
        for q in x['e']: box[q]['E']+=1
        for q in x['e2']: box[q]['E2']+=1
        D='B' if t=='A' else 'A'
        if r=='K': box[PIT[D]]['PK']+=1
        if r=='BB': box[PIT[D]]['PBB']+=1
        o=x['o'] if x['o'] is not None else (1 if r in('GO','FO','K','SAC','FC') else 0)
        outs+=o
        tt=(x['t']+OFF) if x['t'] is not None else last_t+1
        y={'n':n,'i':inn[t],'h':'T' if t=='A' else 'B','b':b,'r':r,'o':outs,'s':[score['A'],score['B']],'t':int(max(last_t+1,tt-15))}
        if x['t'] is None: y['t']=None
        if x['d']: y['d']=x['d']
        if x['bt']: y['bt']=x['bt']
        if x['f']: y['f']=x['f']
        if x['e']: y['e']=x['e']
        if x['sc']: y['sc']=x['sc']
        if x['dp']: y['dp']=1
        if x['note']: y['note']=x['note']
        pbp.append(y)
        if x['hl']: hl.append({'player':b if x['hl'] not in('catch','DP') else (x['fpo'] or b),'t':y['t'],'type':x['hl']})
        if x['t'] is not None: last_t=tt
    assert outs==3,(t,inn[t],outs)
    line[t].append(runs)
print(line,score)
# защитник за пределами box? проверим
G={'id':'2026-11-15','date':'2026-11-15','venue':'Amirajan, Baku','video':'https://youtu.be/f3tJXbSaYi8',
   'teams':{'A':{'name':'Gilavar Baku','color':'#1f6fc0'},'B':{'name':'Bina Warriors','color':'#D85A30'}},
   'linescore':line,'score':score,'box':list(box.values()),
   'note':'Протокол по видео и разметке Фархада (15.11.2026). Ничья 9:9 после 7 иннингов. Gilavar бьёт первым.',
   'highlights':hl,'plays':pbp}
json.dump(G,open('data/games/2026-11-15.json','w'),ensure_ascii=False,indent=1)
