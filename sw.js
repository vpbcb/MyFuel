const CACHE_NAME = 'myfuel-v1'; // МЕНЯЙТЕ ЭТУ ВЕРСИЮ ПРИ КАЖДОМ ОБНОВЛЕНИИ КОДА
const ASSETS_TO_CACHE = [
    './Indexfuel.html',
    './FuelIcon.png',
    './manifest.json'
    // Если у вас есть отдельные css или js файлы, добавьте их сюда
];

// Установка SW и кэширование
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Принудительно активируем новый SW сразу
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

// Активация и удаление старого кэша
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Захватываем контроль над всеми вкладками сразу
});

// Перехват запросов (Network first, falling back to cache)
// Для калькулятора лучше стратегия: сначала сеть, если нет — кэш
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});