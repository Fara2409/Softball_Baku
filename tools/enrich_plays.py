"""Добавляет в g.plays поля для разбора рейтинга по эпизодам (16.11.2026):
po (все путауты, вкл. fpo), a, fpo, rbi, pk (питчер на страйк-ауте), pbb (питчер на уоке), ofb {id: 2|3} — флай-аут филдера при бегуне на 2-й/3-й.
Box не меняется. Источники: tools/build_2026-11-01.py и tools/build_2026-11-15.py (словари розыгрышей)."""
import json
def load_src(path,stop):
    src=open(path,encoding='utf-8').read(); src=src[:src.index(stop)]; ns={}; exec(src,ns); return ns
def save(p,g): json.dump(g,open(p,'w'),ensure_ascii=False,indent=1)
OF={'LF','CF','RF','LCF','RCF'}
def ofb_assign(g):
    pos={b['player']:b['pos'] for b in g['box']}
    for b in g['box']:
        for k,v in (('OFF3',3),('OFF2',2)):
            n=b.get(k,0)
            if not n: continue
            cand=[x for x in g['plays'] if x.get('fpo')==b['player'] and not (x.get('ofb') or {}).get(b['player'])]
            for x in cand[:n]: x.setdefault('ofb',{})[b['player']]=v
# 01.11
ns=load_src('tools/build_2026-11-01.py',"halves=[")
P=ns['plays']; p='data/games/2026-11-01.json'; g=json.load(open(p))
for x in g['plays']:
    pl=P[x['n']]
    for k in ('po','a'):
        if pl.get(k): x[k]=list(pl[k])
        else: x.pop(k,None)
    if pl.get('fpo'): x['fpo']=pl['fpo']
    if pl.get('rbi'): x['rbi']=pl['rbi']
    if pl.get('pk'): x['pk']=pl['pk']
    if x['r']=='BB': x['pbb']='rasim' if x['h']=='T' else 'sergey-antipov'
ofb_assign(g); save(p,g)
# 15.11
ns=load_src('tools/build_2026-11-15.py',"F_=[")
flat=[pl for _,pls in ns['H'] for pl in pls]; PIT=ns['PIT']
p='data/games/2026-11-15.json'; g=json.load(open(p))
assert len(flat)==len(g['plays'])
for x,pl in zip(g['plays'],flat):
    assert x['b']==pl['b'],(x['n'],x['b'],pl['b'])
    po=list(pl['po'])+([pl['fpo']] if pl['fpo'] else [])
    if po: x['po']=po
    if pl['a']: x['a']=list(pl['a'])
    if pl['fpo']: x['fpo']=pl['fpo']
    if pl['rbi']: x['rbi']=pl['rbi']
    D='B' if x['h']=='T' else 'A'
    if x['r']=='K': x['pk']=PIT[D]
    if x['r']=='BB': x['pbb']=PIT[D]
    if pl['e2']: x['eb']=[2 if q in pl['e2'] else 1 for q in pl['e']]
ofb_assign(g); save(p,g)
print('ok')
