/* Оформление «Ночной матч · снаряжение» (вариант A3, 10.11.2026):
   значки софтбола (бита, перчатка, мяч, база, кепка), полоса значков под шапкой,
   подпись «Любительский софтбол в Баку». Значки — window.SBI(name, size). */
(function(){
  const P={
    glove:'<path d="M7 21v-7.5a1.5 1.5 0 0 1 3 0V5a1.5 1.5 0 0 1 3 0V3.8a1.5 1.5 0 0 1 3 0V5.5a1.5 1.5 0 0 1 3 0v7.5c0 4.5-2.7 8-6.5 8z"/><path d="M7 15.5L4.2 12.6a1.6 1.6 0 0 1 2.3-2.2L7 11"/><path d="M10 14h6"/>',
    plate:'<path d="M4 4h16v9l-8 7-8-7z"/>',
    bat:'<path d="M4.5 19.5l2-2"/><path d="M6.5 17.5L18 6a2.5 2.5 0 0 1 3.5 3.5L10 21z"/>',
    ball:'<circle cx="12" cy="12" r="9"/><path d="M6.5 5c2 2.5 2 11.5 0 14M17.5 5c-2 2.5-2 11.5 0 14"/>',
    hr:'<circle cx="16" cy="9" r="5"/><path d="M13 5.5c1 1.5 1 5.5 0 7M19 5.5c-1 1.5-1 5.5 0 7"/><path d="M3 20l6-6M3 15l4-4M8 21l3-3"/>',
    star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    cap:'<path d="M3 15c0-5 4-9 9-9s8 3.5 8.5 8H3z"/><path d="M12 6v8M20.5 14l2 1H3"/>',
    fire:'<path d="M12 21c-4 0-6-2.5-6-6 0-4 4-6 4-10 3 2 4 4 4 6 1-1 1.5-2 1.5-3 2 2 2.5 4.5 2.5 7 0 3.5-2 6-6 6z"/>',
    trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    diamond:'<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 21v-2"/>'
  };
  window.SBI=(n,s=20,w=2)=>`<svg class="sbi" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||P.ball}</svg>`;
  const bat=(c,flip)=>`<g${flip?' transform="translate(100 0) scale(-1 1)"':''}><path d="M22 84L34 72" stroke="${c}" stroke-width="5" stroke-linecap="round"/><path d="M34 72L82 24" stroke="${c}" stroke-width="12" stroke-linecap="round"/><circle cx="19" cy="87" r="5" fill="${c}"/></g>`;
  window.SB_BATS=c=>`<svg viewBox="0 0 100 100" aria-hidden="true">${bat(c)}${bat(c,1)}</svg>`;

  Object.assign(I18N.ru,{sbTag:'Любительский софтбол в Баку',sbWhen:'по воскресеньям · 08:00 · Əmircan',sbHits:'хиты',sbRuns:'пробежки',winW:'Победа',lossW:'Поражение',tieW:'Ничья'});
  Object.assign(I18N.az,{sbTag:'Bakıda həvəskar softbol',sbWhen:'bazar günləri · 08:00 · Əmircan',sbHits:'hitlər',sbRuns:'qaçışlar',winW:'Qələbə',lossW:'Məğlubiyyət',tieW:'Heç-heçə'});
  Object.assign(I18N.en,{sbTag:'Amateur softball in Baku',sbWhen:'Sundays · 08:00 · Əmircan',sbHits:'hits',sbRuns:'runs',winW:'Win',lossW:'Loss',tieW:'Tie'});

  // полоса значков под шапкой
  function strip(){
    const el=document.getElementById('eq-strip'); if(!el||el.childElementCount) return;
    const set=['ball','bat','glove','plate','cap'];
    let h=''; for(let i=0;i<40;i++) h+=SBI(set[i%set.length],14,1.8);
    el.innerHTML=h;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',strip); else strip();
})();
