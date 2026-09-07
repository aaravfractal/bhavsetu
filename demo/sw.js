/* BhavSetu demo service worker.
 *
 * The stage demo has to open with the network genuinely off — not just with
 * the in-app offline toggle flipped. Everything the page needs is precached on
 * install and served cache-first, so a cold start in airplane mode is
 * indistinguishable from a warm one online.
 *
 * Bump CACHE on any change to the shell or the fonts; activate then drops
 * every older cache.
 *
 * v3 adds consented QR access — the public trust card, the OTP consent flow
 * and the access log. Still nothing new on disk: the requester screen, the
 * farmer's second frame and the QR itself are markup, inline SVG and the QR
 * encoder already in index.html.
 *
 * v2 (Phase A–C): the auction, add-lot, onboarding, the incoming-call overlay,
 * the bank-report PDF and the government dashboard are all inline — canvas,
 * inline SVG and data URLs — so the precache list below is unchanged and still
 * complete. The version bump is what makes an already-installed home-screen
 * copy pick up the new index.html.
 */
const CACHE = 'bhavsetu-demo-v3'

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './fonts/mukta-400.woff2',
  './fonts/mukta-600.woff2',
  './fonts/mukta-700.woff2',
  './fonts/mukta-800.woff2',
  './fonts/tiro-devanagari-marathi-400.woff2',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  if (new URL(request.url).origin !== self.location.origin) return

  // A navigation offline must still land on the cached shell, whatever path
  // the home-screen icon happens to open.
  if (request.mode === 'navigate') {
    e.respondWith(
      caches
        .match(request)
        .then((hit) => hit || caches.match('./index.html'))
        .then((hit) => hit || fetch(request)),
    )
    return
  }

  e.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          // Opportunistically keep anything else the page asks for.
          if (res.ok && res.type === 'basic') {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy))
          }
          return res
        }),
    ),
  )
})
