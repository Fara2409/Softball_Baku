import json
W={'1B':.2,'2B':.4,'3B':.6,'HR':.8,'BB':.15,'ROE':.15,'FC':.1,'R':.1,'RBI':.15,'OUT':-.25,'K':-.35,'FPO':.2,'A':.13,'RPO':.07,'PK':.2,'PBB':-.1,'E':-.2,'E2':-.25,'E3':-.3,'OFPO':.2,'OFF2':.25,'OFF3':.3,'OFA':.2,'OFPOS':.15,'CPOS':.15}
OF={'LF','CF','RF','LCF','RCF','SF'}
def boxparts(b):
    g=lambda k:b.get(k,0); roe,fc=g('ROE'),g('FC'); outs=max(0,g('AB')-g('H')-g('K')-roe-fc)
    off=sum(W[k]*g(k) for k in ['1B','2B','3B','HR','BB'])+W['ROE']*roe+W['FC']*fc+W['R']*g('R')+W['RBI']*g('RBI')+W['OUT']*outs+W['K']*g('K')
    fpo,kpo=g('FPO'),g('KPO'); rpo=max(0,g('PO')-fpo-kpo); pos=b['pos'].split('/')[0]; of=pos in OF
    de=(W['OFPO']*(fpo-g('OFF2')-g('OFF3'))+W['OFF2']*g('OFF2')+W['OFF3']*g('OFF3') if of else W['FPO']*fpo)+W['RPO']*rpo+(W['OFA'] if of else W['A'])*g('A')+(W['OFPOS'] if of else 0)+(W['CPOS'] if pos=='C' else 0)+W['PK']*g('PK')+W['PBB']*g('PBB')+W['E']*(g('E')-g('E2')-g('E3'))+W['E2']*g('E2')+W['E3']*g('E3')
    return off+de
def plays_parts(g,pid):
    pos=next(b['pos'] for b in g['box'] if b['player']==pid).split('/')[0]; of=pos in OF; s=(W['OFPOS'] if of else 0)+(W['CPOS'] if pos=='C' else 0)
    for x in g['plays']:
        r=x['r']
        if x['b']==pid:
            if r in('1B','2B','3B','HR','BB','ROE','K'): s+=W[r]
            elif r=='FC' and not x.get('dp'): s+=W['FC']
            elif r=='SAC': pass
            else: s+=W['OUT']
            s+=W['RBI']*x.get('rbi',0)
        if pid in (x.get('sc') or []): s+=W['R']
        if x.get('fpo')==pid:
            s+=(W[{2:'OFF2',3:'OFF3'}.get((x.get('ofb') or {}).get(pid),'OFPO')] if of else W['FPO'])
        nrpo=(x.get('po') or []).count(pid)-(1 if x.get('fpo')==pid else 0)
        s+=W['RPO']*max(0,nrpo)
        s+=(W['OFA'] if of else W['A'])*(x.get('a') or []).count(pid)
        for k,q in enumerate(x.get('e') or []):
            if q==pid: eb=(x.get('eb') or [1]*9)[k] if x.get('eb') else 1; s+=W['E'] if eb<=1 else W['E2'] if eb==2 else W['E3']
        if x.get('pk')==pid: s+=W['PK']
        if x.get('pbb')==pid: s+=W['PBB']
    return s
for gid in ['2026-11-01','2026-11-15','2026-11-22']:
    g=json.load(open(f'data/games/{gid}.json'))
    bad=[(b['player'],round(boxparts(b),2),round(plays_parts(g,b['player']),2)) for b in g['box'] if abs(boxparts(b)-plays_parts(g,b['player']))>0.001]
    print(gid,'mismatch',bad)
