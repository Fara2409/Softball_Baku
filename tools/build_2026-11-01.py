import json
# A = Bina (TOP), B = Gilavar (BOTTOM)
A_ord=['ilgar','sergey-antipov','vidadi','rasul-21','parviz-ismayilov','ilham','farhad-eyvazov','mushfig-ibrahimov','rasul-4']
B_ord=['danylo-shapovalov','fakhri-eyvazov','emilien','rasim','alim','sergey-molchanov','hikmat','sediyar-aliyev','rashid']
POS={'ilgar':'3B','sergey-antipov':'P','vidadi':'SS','rasul-21':'LF','parviz-ismayilov':'2B','ilham':'RF','farhad-eyvazov':'CF','mushfig-ibrahimov':'1B','rasul-4':'RF',
     'danylo-shapovalov':'LF','fakhri-eyvazov':'3B','emilien':'CF','rasim':'P','alim':'2B','sergey-molchanov':'SS','hikmat':'1B','sediyar-aliyev':'C','rashid':'3B'}
TEAM={**{p:'A' for p in A_ord},**{p:'B' for p in B_ord}}
# ab: тип; po/a/e: защита (id); fpo: кто сам сделал аут; runs: кто забил; rbi; pk
I,AN,V,RA,PA_,IH,F,M,RS='ilgar','sergey-antipov','vidadi','rasul-21','parviz-ismayilov','ilham','farhad-eyvazov','mushfig-ibrahimov','rasul-4'
D,FK,EM,RM,AL,MO,HK,SD,RD='danylo-shapovalov','fakhri-eyvazov','emilien','rasim','alim','sergey-molchanov','hikmat','sediyar-aliyev','rashid'
def e(r,**k): k['r']=r; return k
plays={
 # 1 TOP
 1:e('OUT',a=[MO],po=[HK]),2:e('1B'),3:e('1B'),4:e('OUT',po=[MO],fpo=MO),5:e('1B'),
 6:e('1B',err=[FK],runs=[AN],rbi=1),7:e('2B',runs=[V,PA_],rbi=2),8:e('2B',err=[EM],runs=[IH,F],rbi=1),9:e('1B'),10:e('OUT',a=[FK],po=[HK]),
 # 1 BOTTOM
 11:e('ROE',err=[I]),12:e('K',pk=AN),13:e('FC',a=[AN],po=[PA_]),14:e('OUT',a=[AN],po=[M]),
 # 2 TOP
 15:e('ROE',err=[MO]),16:e('OUT',po=[MO],fpo=MO),17:e('OUT',po=[MO],fpo=MO),18:e('OUT',po=[FK],fpo=FK),
 # 2 BOTTOM
 19:e('ROE',err=[V]),20:e('ROE',err=[I]),21:e('OUT',po=[V],fpo=V),22:e('K',pk=AN),23:e('OUT',a=[V],po=[PA_]),
 # 3 TOP (3B Рашид, Фахри RF)
 24:e('1B'),25:e('OUT',po=[HK]),26:e('OUT',po=[AL],fpo=AL),27:e('1B'),28:e('1B',runs=[F],rbi=1),29:e('2B',runs=[I],rbi=1),
 30:e('1B',err=[HK],runs=[AN,V],rbi=1),31:e('2B',err=[EM],runs=[RA],rbi=1),32:e('OUT',a=[RM],po=[HK]),
 # 3 BOTTOM
 33:e('1B'),34:e('OUT',po=[F],fpo=F),35:e('3B',runs=[D],rbi=1),36:e('OUT',po=[PA_,I],fpo=PA_,a=[PA_]),
 # 4 TOP
 37:e('OUT',po=[D],fpo=D),38:e('1B'),39:e('1B'),40:e('FC',po=[MO],fpo=MO),41:e('1B',err=[HK],runs=[RS],rbi=1),42:e('OUT',po=[EM],fpo=EM),
 # 4 BOTTOM (сменный кэтчер Расул Шукюров — не засчитывается)
 43:e('1B',err=[M]),44:e('1B',err=[I]),45:e('OUT',po=[M],fpo=M,a=[M]),46:e('ROE',err=[V],runs=[MO],rbi=0),47:e('ROE',err=[I]),
 48:e('ROE',err=[I],runs=[SD],rbi=0),49:e('3B',runs=[RD,D],rbi=2),50:e('3B',runs=[FK],rbi=1),51:e('OUT'),
 # 5 TOP
 52:e('OUT',a=[MO],po=[HK]),53:e('BB'),54:e('FC',a=[AL],po=[MO]),55:e('OUT',a=[RD],po=[AL]),
 # 5 BOTTOM
 56:e('ROE',err=[M]),57:e('OUT',po=[I],fpo=I),58:e('BB'),59:e('FC',a=[V],po=[I]),60:e('1B'),61:e('2B',runs=[HK,SD],rbi=2),62:e('1B',runs=[RD,D],rbi=2),63:e('OUT',po=[IH],fpo=IH),
 # 6 TOP
 64:e('OUT',a=[MO],po=[HK]),65:e('ROE',err=[RD]),66:e('HR',runs=[RS,I],rbi=2),67:e('1B'),68:e('2B'),69:e('ROE',err=[RD,D],runs=[AN,V],rbi=0),
 70:e('1B'),71:e('BB'),72:e('1B',runs=[RA],rbi=1),73:e('1B',runs=[PA_],rbi=1),74:e('FC',po=[MO,MO],fpo=MO),
 # 6 BOTTOM
 75:e('OUT',a=[AN],po=[M]),76:e('1B'),77:e('1B'),78:e('OUT',po=[M],fpo=M),79:e('OUT',a=[V],po=[I]),
 # 7 TOP
 80:e('ROE',err=[HK]),81:e('3B',runs=[I],rbi=1),82:e('HR',runs=[AN,V],rbi=2),83:e('OUT',po=[RD],fpo=RD),84:e('OUT',a=[MO],po=[HK]),85:e('OUT',po=[SD],fpo=SD),
 # 7 BOTTOM
 86:e('OUT',po=[I],fpo=I),87:e('OUT',po=[RA],fpo=RA),88:e('OUT',po=[F],fpo=F),
 # 8 TOP
 89:e('ROE',err=[HK]),90:e('FC',a=[MO],po=[AL]),91:e('OUT',po=[HK],fpo=HK),92:e('ROE',err=[RM]),93:e('1B',runs=[M],rbi=1),94:e('1B'),95:e('OUT',po=[D],fpo=D),
 # 8 BOTTOM
 96:e('OUT',a=[V],po=[M]),97:e('OUT',a=[PA_],po=[M]),98:e('OUT',a=[AN],po=[M]),
}
halves=[('A',1,10),('B',11,14),('A',15,18),('B',19,23),('A',24,32),('B',33,36),('A',37,42),('B',43,51),('A',52,55),('B',56,63),('A',64,74),('B',75,79),('A',80,85),('B',86,88),('A',89,95),('B',96,98)]
F_=['PA','AB','H','1B','2B','3B','HR','BB','K','R','RBI','ROE','PO','FPO','KPO','PK','A','E']
box={p:{'player':p,'team':TEAM[p],'pos':POS[p],**{k:0 for k in F_}} for p in TEAM}
last={'A':None,'B':None}; line={'A':[],'B':[]}; batters={}
for t,a,b in halves:
    order=A_ord if t=='A' else B_ord; runs=0
    for n in range(a,b+1):
        pl=plays[n]
        act=[p for p in order if not (p=='rasul-4' and n<26)]   # Расул Шукюров бьёт с 3 TOP
        bt=act[0] if last[t] is None else act[(act.index(last[t])+1)%len(act)]; last[t]=bt; batters[n]=bt; x=box[bt]; r=pl['r']
        x['PA']+=1
        if r!='BB': x['AB']+=1
        if r in('1B','2B','3B','HR'): x['H']+=1; x[r]+=1
        if r=='BB': x['BB']+=1
        if r=='K': x['K']+=1
        if r=='ROE': x['ROE']+=1
        x['RBI']+=pl.get('rbi',0)
        for s in pl.get('runs',[]): box[s]['R']+=1; runs+=1
        for p in pl.get('po',[]): box[p]['PO']+=1
        for p in pl.get('a',[]): box[p]['A']+=1
        for p in pl.get('err',[]): box[p]['E']+=1
        if pl.get('fpo'): box[pl['fpo']]['FPO']+=1
        if pl.get('pk'): box[pl['pk']]['PK']+=1
    line[t].append(runs)
print(line, sum(line['A']),sum(line['B']))
json.dump({'box':list(box.values()),'line':line,'batters':batters},open('box.json','w'),ensure_ascii=False,indent=1)
