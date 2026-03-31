// Gymcentrix Service Worker
// Scope: /app/
// Strategy: Cache-first for static assets, network-first for API and pages

const CACHE_VERSION = "v2";
const STATIC_CACHE = `gymcentrix-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `gymcentrix-runtime-${CACHE_VERSION}`;

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/app/gymcentrix-logo.png",
  "/app/gymcentrix-logo.svg",
];

// Routes that must NEVER be cached by this SW
const EXCLUDED_PATHS = ["/login", "/super-admin", "/app/kiosk"];

function isExcluded(url) {
  const { pathname } = new URL(url);
  return EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
}

function isStaticAsset(url) {
  const { pathname } = new URL(url);
  return (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/app/gymcentrix-logo") ||
    /\.(js|css|woff2?|ttf|otf|eot|png|jpg|jpeg|svg|gif|webp|ico)$/.test(
      pathname
    )
  );
}

function isApiCall(url) {
  return new URL(url).pathname.startsWith("/api/");
}

// ─── Install ───────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ──────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !currentCaches.includes(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = request.url;

  // Never intercept excluded paths
  if (isExcluded(url)) return;

  // ── Static assets: Cache-first ──
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // ── API calls: Network-first, no cache ──
  if (isApiCall(url)) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: "You appear to be offline." }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // ── Navigation / pages: Network-first ──
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        // If offline and navigating, try to serve from runtime cache
        return caches.match(request).then(
          (cached) =>
            cached ||
            new Response(
              "<html><body style='background:#111;color:#87f100;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'><div style='text-align:center'><h1 style='font-size:2rem'>Gymcentrix</h1><p>You are offline. Please reconnect to continue.</p></div></body></html>",
              { headers: { "Content-Type": "text/html" } }
            )
        );
      })
    );
    return;
  }
});

// ─── Message handler (for update triggering from UI) ───────────────────────
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
