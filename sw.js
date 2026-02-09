
const CACHE = "fslab-pwa-cache-v1";
const ASSETS = [
  "/", "/index.html", "/checklist.html", "/backlog.html", "/settings.html",
  "/app.css", "/app.js", "/data.js", "/manifest.json",
  "/icon-192.png", "/icon-512.png"
];
self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null)))
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e)=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res=> res || fetch(req).then(net=>{
      const copy = net.clone();
      caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
      return net;
    }).catch(()=>caches.match("/index.html")))
  );
});
