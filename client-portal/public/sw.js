const SHELL_CACHE = "beyvra-shell-v2";
const SHELL_ASSETS = ["/", "/manifest.webmanifest", "/logo.svg"];
const SENSITIVE_PREFIXES = [
  "/api",
  "/ws",
  "/auth",
  "/login",
  "/logout",
  "/register",
  "/forgot-password",
  "/password-reset",
  "/session-expired",
];

const isSensitive = (url) =>
  url.origin !== self.location.origin || SENSITIVE_PREFIXES.some((prefix) =>
    url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)
  );

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== SHELL_CACHE).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    isSensitive(url)
  ) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/")));
    return;
  }

  if (["style", "script", "image", "font"].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        const cacheControl = response.headers.get("Cache-Control") || "";
        if (response.ok && !cacheControl.toLowerCase().includes("no-store")) {
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      }))
    );
  }
});
