/* Защита от ботов: Cloudflare Turnstile (24.11.2026).
   Обычно невидима (appearance: interaction-only): проверка проходит сама, окно появляется только если Cloudflare сомневается.
   Используется во входе и регистрации (club.js) и во входе счётчика (scorer/live.js): токен уходит в Supabase Auth
   как captchaToken. Секретный ключ хранится только в Supabase (Authentication → Attack Protection), здесь — публичный site key.
   Пока KEY пустой, капча выключена и формы работают как раньше. */
(function(){
  const KEY='0x4AAAAAAGQQbB9KjAsFHl2k';   // Turnstile site key (публичный, начинается с 0x4…)
  let loading=null;
  const load=()=>loading||(loading=new Promise((res,rej)=>{
    if(window.turnstile) return res();
    const s=document.createElement('script');
    s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async=true;
    s.onload=()=>res(); s.onerror=()=>{ loading=null; rej(new Error('captcha load')); };
    document.head.appendChild(s);
  }));
  const lang=()=>{ const l=(window.LANG||document.documentElement.lang||'ru').slice(0,2); return l==='az'?'az':l==='en'?'en':'ru'; };
  // el — пустой <div> в форме. Рисует виджет; повторный вызов для того же el ничего не делает.
  function mount(el){
    if(!KEY||!el||el.dataset.cw) return;
    el.dataset.cw='1';
    load().then(()=>{
      if(!el.isConnected) return;
      el._tok=null; el._wait=el._wait||[];
      el._id=window.turnstile.render(el,{sitekey:KEY,appearance:'interaction-only',language:lang(),theme:document.documentElement.classList.contains('theme-dark')?'dark':'light',
        callback:t=>{ el._tok=t; (el._wait||[]).splice(0).forEach(f=>f(t)); },
        'expired-callback':()=>{ el._tok=null; },
        'error-callback':()=>{ el._tok=null; return false; }});
    }).catch(e=>console.warn('[captcha]',e));
  }
  // токен для запроса: ждёт до 15 с, пока Turnstile закончит проверку. Без ключа — undefined (капча выключена).
  function token(el){
    if(!KEY) return Promise.resolve(undefined);
    if(!el) return Promise.resolve(undefined);
    if(!el.dataset.cw) mount(el);
    if(el._tok) return Promise.resolve(el._tok);
    return new Promise(res=>{ const t=setTimeout(()=>res(null),15000); (el._wait=el._wait||[]).push(v=>{ clearTimeout(t); res(v); }); });
  }
  // токен одноразовый: после каждой попытки входа берём новый
  function reset(el){ if(KEY&&el&&el._id!=null&&window.turnstile){ el._tok=null; try{ window.turnstile.reset(el._id); }catch(e){} } }
  window.CAPTCHA={on:!!KEY,mount,token,reset};
})();
