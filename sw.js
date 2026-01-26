const CACHE_NAME = 'infiltre-v1.2.1';
const ASSETS = ['./', './index.html', './manifest.json', './mots.csv', './beta.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {

            // LOGIQUE DE DÉTECTION DE CHANGEMENT
            if (cachedResponse) {
              // On compare les ETag ou Last-Modified (si disponibles) 
              // ou on peut comparer la taille/contenu pour les fichiers critiques
              const isDifferent = networkResponse.headers.get('ETag') !== cachedResponse.headers.get('ETag');

              if (isDifferent && event.request.url.includes('index.html')) {
                notifyClientsOfUpdate();
              }
            }

            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Fonction pour envoyer un message à la page HTML
function notifyClientsOfUpdate() {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
  });
}