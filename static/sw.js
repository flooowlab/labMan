/**
 * public/sw.js — Lab Manager service worker
 *
 * Strategy:
 *  - Cache-first for static assets (JS/CSS bundles, fonts, icons, PWA manifest)
 *  - Network-only for: all API calls, and all HTML page navigations
 *  - Stale-while-revalidate for non-bypassed non-static GETs (images, catalog pages)
 */

const CACHE = 'lab-v2';

// Only true static assets — never HTML page navigations
const STATIC_PATTERNS = [
  /\/_app\//,
  /\.woff2?$/,
  /\.png$/,
  /\.svg$/,
  /\.ico$/,
  /\/manifest\.webmanifest$/,
];

// Patterns that must NEVER be served from cache
const BYPASS_PATTERNS = [
  /\/api\//,          // all API calls (mutations, auth, data)
];

function isStatic(url) {
  return STATIC_PATTERNS.some((p) => p.test(url));
}

function isBypass(url) {
  return BYPASS_PATTERNS.some((p) => p.test(url));
}

// Navigation requests (HTML pages) are always fetched fresh — never cached
function isNavigation(request) {
  return request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html');
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Never intercept non-GET, API calls, or HTML page navigations
  if (request.method !== 'GET' || isBypass(url) || isNavigation(request)) return;

  if (isStatic(url)) {
    // Cache-first for hashed static assets
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      })
    );
  } else {
    // Stale-while-revalidate for other GETs (e.g. catalog images)
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE).then((c) => c.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
