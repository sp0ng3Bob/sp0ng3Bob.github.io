var CACHE_NAME = "SSZJoff-data-v0";
var urlsToCache = [
	"/sw.js",
	"/index.html",
	"/manifest.json",
	"/src/css/style.css",
	"/src/js/main.js",
	"/src/vendor/bootstrap/css/bootstrap.css",
	"/src/vendor/bootstrap/css/bootstrap.css.map",
	"/src/vendor/bootstrap/css/bootstrap.min.css",
	"/src/vendor/bootstrap/css/bootstrap.min.css.map",
	"/src/vendor/bootstrap/css/bootstrap-grid.css",
	"/src/vendor/bootstrap/css/bootstrap-grid.css.map",
	"/src/vendor/bootstrap/css/bootstrap-grid.min.css",
	"/src/vendor/bootstrap/css/bootstrap-grid.min.css.map",
	"/src/vendor/bootstrap/css/bootstrap-reboot.css",
	"/src/vendor/bootstrap/css/bootstrap-reboot.css.map",
	"/src/vendor/bootstrap/css/bootstrap-reboot.min.css",
	"/src/vendor/bootstrap/css/bootstrap-reboot.min.css.map",
	"/src/vendor/bootstrap/js/bootstrap.js",
	"/src/vendor/bootstrap/js/bootstrap.js.map",
	"/src/vendor/bootstrap/js/bootstrap.min.js",
	"/src/vendor/bootstrap/js/bootstrap.min.js.map"
];

self.addEventListener("install", event => {
	console.log("*sw installing...");

	// Add files to cache list
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(cache => cache.addAll(urlsToCache))
		.then(() => self.skipWaiting())
		.catch(err => console.log(err))
	);
});

self.addEventListener("activate", event => {
	console.log("*sw now ready to handle fetches!");
	
	// Remove unwanted caches
	event.waitUntil(
		caches.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cache => {
						if (cache !== CACHE_NAME) {
							console.log("*sw old cache cleared");
							return caches.delete(cache);
						}
					})
				);
			})
			.catch(err => console.log(err))
	);
});

self.addEventListener("fetch", event => {
	console.log('*sw fetching...');
  
	// Fetch response+data and save it in cache
	event.respondWith(
		fetch(event.request)
			.then(res => {
				const resClone = res.clone();
				console.log(resClone);
				caches
					.open(CACHE_NAME)
					.then(cache => {
						cache.put(event.request, resClone);
					});
				return res;
			})
			.catch(err => caches.match(event.request).then(res => res))
	);
});