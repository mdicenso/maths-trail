/* IronMath service worker: cache the app so it opens offline. Bump VERSION on every release. */
const VERSION = "mt-2.4.0";
const FILES = ["./", "index.html", "styles.css", "data.js", "engine.js", "gen.js", "gen_u.js", "app.js", "manifest.webmanifest",
  "fonts/nunito-latin-wght-normal.woff2", "fonts/orbitron-latin-800-normal.woff2", "fonts/exo-2-latin-800-normal.woff2", "fonts/rajdhani-latin-700-normal.woff2", "fonts/audiowide-latin-400-normal.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // network first for the page itself (so updates arrive), cache first for everything else
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("./", copy)); return r; }).catch(() => caches.match("./")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return r; })));
});
