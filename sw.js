const CACHE = 'floresceria-v88';
const ASSETS = ['/', '/index.html', '/painel.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Só interceptar requisições do próprio domínio
  // Deixar TUDO externo passar sem interferência
  if (e.request.url.startsWith('http') && !e.request.url.startsWith(self.registration.scope)) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://geracaofloresce.com.br';
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
      const w = list.find(c => c.url.includes('geracaofloresce.com.br'));
      return w ? w.focus() : clients.openWindow(url);
    })
  );
});
