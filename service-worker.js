const CACHE_NAME = 'passmgr-v3';    // имя/версия кэша
// то, что нужно сохранить при первом запуске для работы
const urlsToCache = [
  './',
  './index.html',             // основная страница
  './manifest.json',          // манифест
  './icons/icon_192x192.png', // иконка
  './style.css',              // стили
  './script.js'               // логика
];

// устанавливаем service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)                       // открываем или создаем кэш
      .then(cache => cache.addAll(urlsToCache))   // загружаем и сохраняем указанные ссылки
      .then(() => self.skipWaiting())             // активируем service worker
  );
});

// сразу активируем PWA
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// перехватываем сетевые запросы для offline-работы
self.addEventListener('fetch', event => {  
  // ищем точное совпадение запроса
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
    // если нашли, то возвращаем кэшированный ответ
    // если нет, то обращаемся в сеть
  );
});