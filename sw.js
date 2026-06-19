const CACHE = 'ccr-v1';
const ASSETS = [
  '/charlie.cr.github.io/',
  '/charlie.cr.github.io/index.html',
  '/charlie.cr.github.io/apropos.html',
  '/charlie.cr.github.io/projets.html',
  '/charlie.cr.github.io/contact.html',
  '/charlie.cr.github.io/blog.html',
  '/charlie.cr.github.io/style.css',
  '/charlie.cr.github.io/script.js',
  '/charlie.cr.github.io/config.js',
  '/charlie.cr.github.io/db.js',
  '/charlie.cr.github.io/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => null);
      return cached || network;
    })
  );
});
