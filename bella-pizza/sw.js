const CACHE = 'bella-pizza-v2';
const ASSETS = [
  'index.html','menu.html','commande.html','reservation.html','contact.html',
  'history.html','mes-points.html','pizza-builder.html','tracking.html',
  'avis.html','jeu.html','profil.html',
  'css/style.css','css/animations.css','css/darkmode.css','css/shaders.css',
  'js/app.js','js/particles.js','js/search.js','js/fidelite.js',
  'js/audio.js','js/transitions.js','js/scroll-fx.js','js/reviews.js',
  'js/easter-eggs.js','js/onboarding.js','js/personnalisation.js',
  'js/notifications.js','js/recommandations.js','js/voice.js',
  'img/logo.jpg','img/fond.jpg','img/pizza-margherita.jpg',
  'img/pizza-pepperoni.jpg','img/pizza-4fromages.jpg','img/pizza-vegetarienne.jpg',
  'img/pizza-chevre-miel.jpg','img/pizza-savoyarde.jpg','img/pizza-normande.jpg',
  'img/pizza-reine.jpg','img/pizza-calzone.jpg','img/pizza-californienne.jpg',
  'img/pizza-champignons.jpg','img/pizza-detroit.jpg','img/pizza-grecque.jpg',
  'img/pizza-merguez.jpg','img/pizza-nicoise.jpg','img/pizzeria1.jpg',
  'img/pizzeria2.jpg','img/pizzeria3.jpg','img/pizzeria4.jpg','img/moi.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(a => new Request(a, { cache: 'reload' })))).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => null);
      return cached || network || new Response('<h1>Hors ligne</h1><p>Reconnectez-vous pour accéder au site.</p>', { headers: { 'Content-Type': 'text/html' } });
    })
  );
});
