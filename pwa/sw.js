const VERSION = "1"
const STATIC_CACHE_NAME = `static-v${VERSION}`

// Let op: deze functie is niet async
self.addEventListener('install', () => {
    const urls =
    [
        "/",
        "/style.css",
        "/main.js",
        "/192.png",
        "/manifest.json"
    ]

    cacheUrls(STATIC_CACHE_NAME, urls)
})

// Let op: deze functie is niet async
self.addEventListener('activate', () => {
    cleanOldCaches(STATIC_CACHE_NAME)
})

self.addEventListener('fetch', async (e) => {
    e.respondWith((async () => {
        const url = new URL(e.request.url)

        const cache = await caches.open(STATIC_CACHE_NAME)
        const cacheResponse = await cache.match(url.pathname)

        if (cacheResponse != undefined)
        {
            return cacheResponse
        }
        else
        {
            const networkResponse = await fetch(url.pathname)

            if (networkResponse.ok)
            {
                cache.put(url.pathname, networkResponse.clone())
            }

            return networkResponse
        }
    })())
})

async function cacheUrls (cacheName, urls)
{
    const cache = await caches.open(cacheName)
    cache.addAll(urls)
}

async function cleanOldCaches (cacheToKeep)
{
    const keys = await caches.keys()
    const keysToDelete = keys.filter(key => key !== cacheToKeep)
    keysToDelete.forEach(key => caches.delete(key))
}