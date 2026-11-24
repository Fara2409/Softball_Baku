// Табло работает без интернета: страница и библиотеки берутся из кэша, а в фоне обновляются, когда сеть есть.
const C='board-v4';
const CORE=['./','./index.html','./manifest.json','../icons/icon-192.png','../favicon.ico'];
const LIB=[];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(CORE).then(()=>Promise.all(LIB.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{})))))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('board-')&&k!==C).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.hostname.endsWith('supabase.co')||u.hostname.includes('cloudflare')) return;   // данные и капча — только сеть
  const mine=u.origin===location.origin&&(u.pathname.includes('/board/')||u.pathname.endsWith('/icons/icon-192.png')||u.pathname.endsWith('/favicon.ico')||u.pathname.includes('/captcha.js'));
  const lib=LIB.includes(r.url);
  if(!mine&&!lib) return;
  // сначала сеть (свежая версия), без сети — кэш
  e.respondWith(fetch(r).then(res=>{ if(res&&(res.ok||res.type==='opaque')){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; })
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
