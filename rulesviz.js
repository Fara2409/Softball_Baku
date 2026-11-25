/* Мини-анимации к правилам (25.11.2026): страйк, бол, фол, хит, страйк-аут, флай-аут, форс-аут, тэг-аут, возврат на базу после флая.
   Одна петля requestAnimationFrame на все сценки; невидимые сценки не обновляются. */
(function(){
const lerp=(a,b,k)=>a+(b-a)*k, cl=k=>Math.max(0,Math.min(1,k)), ez=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const BALL=(c='rv-b')=>`<g class="${c}"><circle r="3" fill="#fff" stroke="#C0392B" stroke-width=".8"/></g>`;
const RING=c=>`<circle class="${c}" r="3" fill="none" stroke-width="1.4" opacity="0"/>`;
const STAMP=(c,txt,x,y,col)=>`<g class="${c}" opacity="0" transform="translate(${x} ${y})"><rect x="${-txt.length*3.4-4}" y="-7" width="${txt.length*6.8+8}" height="13" rx="3" fill="${col}"/><text y="3.3" font-size="9" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing=".5">${txt}</text></g>`;
const DOTS=(lbl,n,x0,y)=>`<text x="${x0-9}" y="${y+3}" font-size="8" font-weight="800" class="rv-tx">${lbl}</text>`+Array.from({length:n},(_,i)=>`<circle class="rv-d" cx="${x0+i*9}" cy="${y}" r="3"/>`).join('');
const RUN=c=>`<g class="${c}"><circle r="3.6" fill="#F5A524" stroke="#fff" stroke-width=".9"/></g>`;
const FLD=c=>`<g class="${c}"><circle r="3.8" fill="#1F5FBF" stroke="#fff" stroke-width=".9"/></g>`;
const SH=`<ellipse class="rv-sh" rx="2.6" ry="1" fill="rgba(0,0,0,.25)" opacity="0"/>`;
const FLDS=`<g transform="translate(84 41)"><circle r="3.8" fill="#1F5FBF" stroke="#fff" stroke-width=".9"/><text y="1.3" font-size="3.6" font-weight="900" fill="#fff" text-anchor="middle">P</text></g>`;
const BASE=(x,y)=>`<rect x="${x-3}" y="${y-3}" width="6" height="6" transform="rotate(45 ${x} ${y})" fill="#fff" stroke="#8A99B0" stroke-width=".6"/>`;
const DIAM=`<path d="M46 60 L4 18 M46 60 L88 18" class="rv-ln"/><path d="M46 60 L4 18 A60 60 0 0 1 88 18 Z" class="rv-fair"/>
  <path d="M46 58 L62 42 L46 26 L30 42 Z" fill="none" class="rv-ln"/>${BASE(62,42)}${BASE(46,26)}${BASE(30,42)}`;
// слоупитч, вид сбоку: питчер справа, мяч по высокой дуге, пластина на земле (упал на пластину — страйк, мимо — бол)
const ZONE=`<path d="M4 46 H88" class="rv-ln"/><rect class="rv-zf" x="33" y="42" width="22" height="7" rx="2" opacity="0"/><rect x="36" y="44.6" width="16" height="2.8" rx="1" class="rv-plate"/>${FLDS}<g transform="translate(29 41)" opacity=".9"><circle r="3.8" fill="#F5A524" stroke="#fff" stroke-width=".9"/><text y="1.3" font-size="3.6" font-weight="900" fill="#10233F" text-anchor="middle">B</text></g>${SH}`;
const pos=(el,x,y,s=1)=>el&&el.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(3)})`);
const op=(el,o)=>el&&el.setAttribute('opacity',Math.max(0,Math.min(1,o)).toFixed(3));
function ring(el,t,t0,x,y,col){ if(!el) return; const k=(t-t0)/.6; if(k<0||k>1){op(el,0);return;} el.setAttribute('cx',x);el.setAttribute('cy',y);el.setAttribute('r',3+k*8);el.setAttribute('stroke',col);op(el,1-k); }
function stamp(el,t,t0,t1){ if(!el) return; const on=t>=t0&&t<t1; op(el,on?1:0); if(on){ const k=cl((t-t0)/.25), s=k<1?.4+.8*k-(k>.7?(k-.7)*1.2:0):1; const m=/translate\(([^)]*)\)/.exec(el.getAttribute('transform')); el.setAttribute('transform',`translate(${m?m[1]:'0 0'}) scale(${s.toFixed(3)})`); } }
function dots(q,n,ts,t){ q('.rv-d',true).forEach((d,i)=>d.classList.toggle('on',t>=ts[i])); }
// pitch: мяч летит от питчера (справа) к зоне; end — точка прихода
const PD=.8;
function pitch(b,t,t0,ex,ey,q){ const k=(t-t0)/PD, sh=q&&q('.rv-sh'); if(k<0||k>1.35){op(b,0);op(sh,0);return;} const kk=cl(k);
  pos(b,lerp(81,ex,kk),lerp(39,43,kk)-Math.sin(Math.PI*kk)*34,.9); op(b,k>1.15?(1.35-k)/.2:1);
  if(sh){ sh.setAttribute('cx',lerp(81,ex,kk)); sh.setAttribute('cy',46.5); op(sh,k>1.15?0:.6); } }
function arc(b,sh,t,t0,t1,x0,y0,x1,y1,h){ const k=(t-t0)/(t1-t0); if(k<0||k>1){op(b,0);op(sh,0);return false;} const x=lerp(x0,x1,k), y=lerp(y0,y1,k); pos(b,x,y-Math.sin(Math.PI*k)*h,1+Math.sin(Math.PI*k)*.5); op(b,1); if(sh){ sh.setAttribute('cx',x);sh.setAttribute('cy',y);op(sh,.5);} return true; }

const SC={
 strike:{D:5.4,svg:ZONE+DOTS('S',3,18,58)+BALL()+RING('rv-r')+STAMP('rv-st','K',20,16,'#D64541'),
  f(t,q){ const T=[.3,1.6,2.9], X=[44,42,46]; let hit=-1; T.forEach((t0,i)=>{ if(t>=t0&&t<t0+1.3) hit=i; }); if(hit<0){op(q('.rv-b'),0);op(q('.rv-sh'),0);} else pitch(q('.rv-b'),t,T[hit],X[hit],43,q);
    op(q('.rv-zf'),T.some(t0=>t>t0+PD&&t<t0+PD+.45)?.45:0); dots(q,3,T.map(x=>x+PD),t); const i=T.findIndex(t0=>t>=t0+PD&&t<t0+PD+.6); ring(q('.rv-r'),t,i<0?-9:T[i]+PD,i<0?0:X[i],45,'#1E9E5A'); stamp(q('.rv-st'),t,4,5.3); }},
 ball:{D:7,svg:ZONE+DOTS('B',4,18,58)+BALL()+RING('rv-r')+STAMP('rv-st','BB → 1B',30,16,'#1E9E5A'),
  f(t,q){ const T=[.3,1.5,2.7,3.9], X=[62,22,65,25]; let hit=-1; T.forEach((t0,i)=>{ if(t>=t0&&t<t0+1.2) hit=i; }); if(hit<0){op(q('.rv-b'),0);op(q('.rv-sh'),0);} else pitch(q('.rv-b'),t,T[hit],X[hit],43,q);
    op(q('.rv-zf'),0); dots(q,4,T.map(x=>x+PD),t); const i=T.findIndex(t0=>t>=t0+PD&&t<t0+PD+.6); ring(q('.rv-r'),t,i<0?-9:T[i]+PD,i<0?0:X[i],45,'#D64541'); stamp(q('.rv-st'),t,5,6.8); }},
 foul:{D:3.6,svg:DIAM+SH+BALL()+RING('rv-r')+STAMP('rv-st','FOUL',70,54,'#D64541'),
  f(t,q){ const on=arc(q('.rv-b'),q('.rv-sh'),t,.4,1.6,46,58,80,50,16); if(!on&&t>1.6) op(q('.rv-b'),0); ring(q('.rv-r'),t,1.6,80,50,'#D64541'); op(q('.rv-fair'),.9); stamp(q('.rv-st'),t,1.7,3.3); }},
 hit:{D:4.2,svg:DIAM+SH+BALL()+RING('rv-r')+RUN('rv-run')+STAMP('rv-st','HIT',78,56,'#1E9E5A'),
  f(t,q){ arc(q('.rv-b'),q('.rv-sh'),t,.4,1.5,46,58,64,10,14); if(t>1.5) op(q('.rv-b'),0); ring(q('.rv-r'),t,1.5,64,10,'#1E9E5A');
    const k=ez(cl((t-.6)/1.3)); pos(q('.rv-run'),lerp(42,62,k),lerp(58,42,k)); stamp(q('.rv-st'),t,2,4); }},
 k:{D:4.4,svg:ZONE+DOTS('S',3,18,58)+BALL()+STAMP('rv-st','OUT',22,16,'#D64541'),
  f(t,q){ const T=[.2,1.1,2.0]; let hit=-1; T.forEach((t0,i)=>{ if(t>=t0&&t<t0+.9) hit=i; }); if(hit<0){op(q('.rv-b'),0);op(q('.rv-sh'),0);} else pitch(q('.rv-b'),t,T[hit],44,43,q);
    op(q('.rv-zf'),T.some(t0=>t>t0+PD&&t<t0+PD+.3)?.45:0); dots(q,3,T.map(x=>x+PD),t); stamp(q('.rv-st'),t,2.9,4.3); }},
 fly:{D:4,svg:`<path d="M4 54 H88" class="rv-ln"/>`+SH+FLD('rv-f')+BALL()+STAMP('rv-st','OUT',26,20,'#D64541'),
  f(t,q){ const fx=lerp(58,68,ez(cl((t-.3)/1.2))); pos(q('.rv-f'),fx,50); const on=arc(q('.rv-b'),q('.rv-sh'),t,.2,1.6,8,52,68,48,40);
    if(!on){ if(t>=1.6&&t<3.6){ pos(q('.rv-b'),fx+1,47,.9); op(q('.rv-b'),1);} else op(q('.rv-b'),0); op(q('.rv-sh'),0);} stamp(q('.rv-st'),t,1.7,3.6); }},
 force:{D:4.6,svg:`<path d="M6 46 H86" class="rv-ln" stroke-dasharray="2 2"/>`+BASE(74,46)+FLD('rv-f')+RUN('rv-run')+BALL()+RING('rv-r')+STAMP('rv-st','OUT',40,16,'#D64541'),
  f(t,q){ pos(q('.rv-f'),74,38); const rk=ez(cl((t-.2)/2.4)); pos(q('.rv-run'),lerp(10,58,rk),46);
    const bk=(t-.5)/1.2; if(bk>=0&&bk<=1){ const k=ez(bk); pos(q('.rv-b'),lerp(30,74,k),lerp(8,38,k)-Math.sin(Math.PI*bk)*6); op(q('.rv-b'),1);} else if(bk>1&&t<4.3){ pos(q('.rv-b'),74,38,.9); op(q('.rv-b'),1);} else op(q('.rv-b'),0);
    ring(q('.rv-r'),t,1.7,74,42,'#D64541'); stamp(q('.rv-st'),t,1.8,4.3); }},
 tag:{D:4.6,svg:`<path d="M6 46 H86" class="rv-ln" stroke-dasharray="2 2"/>`+BASE(10,46)+BASE(82,46)+RUN('rv-run')+FLD('rv-f')+BALL()+RING('rv-r')+STAMP('rv-st','OUT',46,14,'#D64541'),
  f(t,q){ const X=tt=>lerp(10,82,cl((tt-.2)/2.2)), xc=X(1.7), rx=t<1.7?X(t):xc; pos(q('.rv-run'),rx,46);
    const fk=ez(cl((t-.3)/1.4)), fx=lerp(70,xc+5,fk), fy=lerp(18,44,fk); pos(q('.rv-f'),fx,fy); pos(q('.rv-b'),fx-3,fy-3,.8); op(q('.rv-b'),t<4.3?1:0);
    ring(q('.rv-r'),t,1.7,xc+2,44,'#D64541'); stamp(q('.rv-st'),t,1.8,4.3); }},
 tagup:{D:6.2,svg:`<path d="M6 50 H86" class="rv-ln" stroke-dasharray="2 2"/>`+BASE(12,50)+BASE(82,50)+FLD('rv-f')+SH+BALL()+RUN('rv-run')+RING('rv-r')+`<path class="rv-arr" d="M30 40 H16 m4 -3 l-4 3 l4 3" fill="none" stroke="#F5A524" stroke-width="1.6" stroke-linecap="round" opacity="0"/>`+STAMP('rv-st','OUT',62,30,'#D64541')+STAMP('rv-st2','SAFE',58,30,'#1E9E5A'),
  f(t,q){ pos(q('.rv-f'),70,16); const on=arc(q('.rv-b'),q('.rv-sh'),t,.3,1.6,20,46,70,14,22); if(!on){ op(q('.rv-sh'),0); if(t>=1.6&&t<2.6){pos(q('.rv-b'),70,13,.8);op(q('.rv-b'),1);} else op(q('.rv-b'),0);}
    let x=12; if(t<1.6) x=lerp(12,32,ez(cl((t-.3)/.9))); else if(t<2.5) x=lerp(32,12,ez(cl((t-1.7)/.7))); else x=lerp(12,82,ez(cl((t-2.9)/1.8)));
    pos(q('.rv-run'),x,50); op(q('.rv-arr'),t>1.6&&t<2.5?1:0); ring(q('.rv-r'),t,2.4,12,50,'#F5A524');
    stamp(q('.rv-st'),t,1.65,2.6); stamp(q('.rv-st2'),t,4.7,6); }}
};
const items=[];
window.rulesViz=function(){
  const cards=document.querySelectorAll('.rules-grid > .card.rule'); if(cards.length<2) return;
  const MAP=[['strike','ball','foul','hit'],['k','fly','force','tag']];
  items.length=0;
  [0,1].forEach(ci=>{ const ul=cards[ci].querySelector('ul'); if(!ul) return; ul.classList.add('rv-list');
    [...ul.children].forEach((li,i)=>{ const k=MAP[ci][i]; if(!k||!SC[k]) return; li.innerHTML=`<div class="rv-pic">${mk(k)}</div><div class="rv-txt">${li.innerHTML}</div>`; });
    if(ci===1){ const p=cards[1].querySelector('ul ~ p'); if(p){ p.outerHTML=`<div class="rv-note"><div class="rv-pic">${mk('tagup')}</div><p>${p.innerHTML}</p></div>`; } }
  });
  document.querySelectorAll('.rv-svg').forEach(svg=>{ const k=svg.dataset.k, cache={}; items.push({svg,sc:SC[k],vis:true,q:(c,all)=>all?[...svg.querySelectorAll(c)]:(cache[c]!==undefined?cache[c]:(cache[c]=svg.querySelector(c)))}); });
  if('IntersectionObserver' in window){ const io=new IntersectionObserver(es=>es.forEach(e=>{ const it=items.find(x=>x.svg===e.target); if(it) it.vis=e.isIntersecting; })); items.forEach(it=>{ it.vis=false; io.observe(it.svg); }); }
  const still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(still){ items.forEach(it=>it.sc.f(it.sc.D*.8,it.q)); return; }
  if(window._rvRaf) cancelAnimationFrame(window._rvRaf);
  const t0=performance.now();
  const tick=now=>{ if(!items.length||!items[0].svg.isConnected){ window._rvRaf=null; return; }
    const s=(now-t0)/1000; items.forEach(it=>{ if(it.vis) it.sc.f(s%it.sc.D,it.q); }); window._rvRaf=requestAnimationFrame(tick); };
  window._rvRaf=requestAnimationFrame(tick);
};
function mk(k){ return `<svg viewBox="0 0 92 64" class="rv-svg" data-k="${k}" aria-hidden="true"><rect width="92" height="64" rx="9" class="rv-bg"/>${SC[k].svg}</svg>`; }
})();
