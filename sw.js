const VERSION = "v1";
const CACHE = `formatomat-${VERSION}`;

const PRECACHE = [
    "/",
    "/impressum.html",
    "/datenschutz.html",
    "/assets/css/style.css",
    "/assets/js/app.js",
    "/assets/js/state.js",
    "/assets/js/theme.js",
    "/assets/js/i18n.js",
    "/assets/js/modals.js",
    "/assets/js/formats.js",
    "/assets/js/editor.js",
    "/assets/js/vendor/codemirror.bundle.js",
    "/assets/js/formats/json.js",
    "/assets/js/formats/yaml.js",
    "/assets/js/formats/xml.js",
    "/assets/js/formats/toml.js",
    "/assets/js/formats/ini.js",
    "/assets/js/formats/phparray.js",
    "/assets/js/vendor/fast-xml-parser.js",
    "/assets/js/vendor/smol-toml.js",
    "/assets/js/vendor/jsonc-parser.js",
    "/assets/js/vendor/jsonc-parser-impl/format.js",
    "/assets/js/vendor/jsonc-parser-impl/edit.js",
    "/assets/js/vendor/jsonc-parser-impl/scanner.js",
    "/assets/js/vendor/jsonc-parser-impl/parser.js",
    "/assets/js/vendor/jsonc-parser-impl/string-intern.js",
    "/manifest.json",
    "/assets/img/favicon.svg",
    "/assets/img/apple-touch-icon.png",
    "/assets/img/logo.svg",
    "/assets/fonts/ibm-plex-mono/ibm-plex-mono-latin-400-normal.woff2",
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    if (new URL(event.request.url).origin !== location.origin) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                // Cache locale files on first use so they work offline too
                if (event.request.url.includes("/assets/js/locales/") && response.ok) {
                    caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
                }
                return response;
            });
        })
    );
});
