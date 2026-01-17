const CACHE_NAME = 'infiltre-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './mots.csv'
];

// Installation : Mise en cache initiale
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Stratégie Stale-While-Revalidate : 
// Sert le cache immédiatement, mais télécharge la mise à jour en arrière-plan si internet est disponible.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Si la réponse réseau est valide, on met à jour le cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Échec du réseau (hors-ligne), rien à faire, on a déjà servi le cache si dispo
        });

        // Retourne la réponse du cache si elle existe, sinon attend le réseau
        return response || fetchPromise;
      });
    })
  );
});

