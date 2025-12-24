// sw.js — bump cache to force update
const CACHE = 'slow-burn-v4';
const ASSETS = ['./','./index.html','./manifest.json','./data.json'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=> k!==CACHE ? caches.delete(k) : null)))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(req, copy));
      return res;
    }).catch(()=> cached))
  );
});
