var CACHE_NAME = "SSZJoff-data-v0";
/*var urlsToCache = [
	"/src/css/*",
	"/src/images/*",
	"/src/js/*",
	"/src/vendro/*"
];*/

self.addEventListener("install", event => {
	console.log("*sw installing...");

	// Add files to cache list
	/*event.waitUntil(
		caches.open(CACHE_NAME)
		.then(cache => cache.addAll(urlsToCache))
		.then(() => self.skipWaiting())
	);*/
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