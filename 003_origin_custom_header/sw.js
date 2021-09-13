// Cache all css
// 
const raw = [
    "index.html",
    "offline.js",
    "styles.css",
];

const CACHE_NAME = '002_register_sw';

async function waitForAll(promises){
    return new Promise( resolve => {
        let rc = { success: 0, failure:0 };
        for (let i=0; i < promises.length; i++) {
            promises[i]
            .then(()=>{
                rc.success++;
                if (rc.success+rc.failure === promises.length) resolve(rc);
            }).catch(err => {
                rc.failure++;
                if (rc.success+rc.failure === promises.length) resolve(rc);
                console.error(`error occurred ${err}`);
            });
        }
    });
}

self.addEventListener('activate', function(event) {
    console.log('Claiming control');
    return self.clients.claim();
  });

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.delete(CACHE_NAME)
        .then(() => caches.open(CACHE_NAME))
        .then(async cache => {
            console.log('Opened cache');
            const leadingSlashRemoved = raw.map(url => url);
            do {
                // cache in batches of 10
                const sliceDice = leadingSlashRemoved.splice(0, 50);
                await waitForAll(sliceDice.map(async url => {
                    const response = await fetch(url);
                    console.log("URL", url, response);
                    await cache.put(url, response);
                }));
            } while(leadingSlashRemoved.length > 0);
            return true;
        })
    );
});

const MAX_WAIT = 300; // If network responds slower than 100 ms, respond with cache instead


//https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
self.addEventListener('fetch', function(event) {
event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(event.request).then(function (response) {
        if(response){
        return appendCustomOriginHeader(response, 'sw')
        }
        return fetch(event.request).then(function(response) {
            return appendCustomOriginHeader(response, 'server')
        });
    });
    })
);
});

function appendCustomOriginHeader(response, origin)
{
    const newHeaders = new Headers(response.headers);
    newHeaders.append('x-origin', origin);

    const customizedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
    return customizedResponse
}
