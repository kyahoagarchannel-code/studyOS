// Minimal service worker: makes the app installable and lets it open offline.
// Network first (you always get the newest app when online), cache as backup.
var CACHE='studyos-v1';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return; // never touch Supabase / CDN calls
  e.respondWith(fetch(r).then(function(res){
    var copy=res.clone();caches.open(CACHE).then(function(c){c.put(r,copy);});return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./');});}));
});
