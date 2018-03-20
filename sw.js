const MY_CACHE='cache-v2'
const CACHE_LIST = [
  '/',
  '/index.html',
  '/styles/inline.css',
  '/manifest.json',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'

]
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(caches.open(MY_CACHE).then((cache) => {
    return cache.addAll(CACHE_LIST)
  })
  )
});

self.addEventListener('fetch', function (e) {

  // network first approach
  // e.respondWith(
  //   caches.open(dataCacheName).then(function(cache) {
  //     return fetch(e.request).then(function(response){
  //       cache.put(e.request.url, response.clone());
  //       return response;
  //     });
  //   })
  // );

  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (response) {
      console.warn(response)
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      /**
       * Remove all the cache that doesn't belong to this service worker
       */
      return Promise.all(keyList.map(function (key) {
        if (key !== MY_CACHE) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  /** 
   * clients.claim() takes over the scope immediately 
   * without it you need to close the browser to see 
   * the updated file, but it also make sense as a normal
   * app update flow
  */
  // return self.clients.claim();
});

self.addEventListener('push', function(event) {  
  var title = 'Yay a message.';  
  var icon = '/images/smiley.svg';  
  var tag = 'simple-push-example-tag';
  event.waitUntil(  
    self.registration.showNotification('hihi', {  
      body: 'modifiedy',  
      icon: icon,  
      tag: tag  
    })  
  );  
});