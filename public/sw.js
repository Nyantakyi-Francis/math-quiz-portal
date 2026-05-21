/* eslint-disable no-restricted-globals */

const CACHE_NAME = "math-quiz-portal-pwa-v1";

const PRECACHE_URLS = ["/", "/offline.html", "/manifest.webmanifest", "/dp.PNG"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

function isSameOrigin(requestUrl) {
  try {
    return new URL(requestUrl).origin === self.location.origin;
  } catch {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Navigations: try network first, then fall back to offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone()).catch(() => {});
          return response;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match("/offline.html")) || Response.error();
        }
      })()
    );
    return;
  }

  // Only cache same-origin assets.
  if (!isSameOrigin(request.url)) return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
        return response;
      } catch {
        return Response.error();
      }
    })()
  );
});

