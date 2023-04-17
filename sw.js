var cacheName = '1010 v1.00';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',
  '/assets/classes/settings.png',
  '/assets/scenes/preload.png',
  '/assets/scenes/startGame.png',
  '/assets/scenes/UI.png',


  '/assets/fonts/mago1.tff',




  '/assets/sprites/tile.png',
  '/assets/sprites/tiles.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/home.png',
  '/assets/sprites/logo2.png',
  '/assets/sprites/rotate.png',
  '/assets/sprites/shape_sheet.png',
  '/assets/sprites/skip.png',
  '/assets/sprites/switch.png',
  '/assets/sprites/tilePreview.png',


  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});