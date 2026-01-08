const SHELL_CACHE = 'roznamcha-shell-v3'
const ASSET_CACHE = 'roznamcha-assets-v3'
const OFFLINE_URL = '/offline'
const VITE_MANIFEST = '/build/manifest.json'

const CORE_PAGES = [
  '/',
  OFFLINE_URL,
  '/blog',
  '/about',
  '/contact',
  '/kharcha-map',
  '/ration-brain',
  '/survival-report',
  '/privacy-policy',
  '/terms',
]

const STATIC_ASSETS = ['/icons/appicon.png', '/manifest.webmanifest']

const ASSET_EXTENSION_REGEX = /\.(css|js|png|jpe?g|svg|webp|ico|woff2?|ttf|eot|json|webmanifest)$/i

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await precacheCore()
      self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith('roznamcha-') && ![SHELL_CACHE, ASSET_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }

  if (ASSET_EXTENSION_REGEX.test(url.pathname) || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }
})

async function precacheCore() {
  const pageUrls = Array.from(new Set(CORE_PAGES))
  const assetUrls = await resolveAssetUrls()

  await Promise.all([cacheUrls(SHELL_CACHE, pageUrls), cacheUrls(ASSET_CACHE, assetUrls)])
}

async function resolveAssetUrls() {
  const urls = new Set(STATIC_ASSETS)

  try {
    const response = await fetch(VITE_MANIFEST, { cache: 'no-cache', credentials: 'same-origin' })
    if (response.ok) {
      const manifest = await response.json()
      const appendEntry = (entry) => {
        if (!entry) return
        addPath(entry.file)
        if (Array.isArray(entry.css)) {
          entry.css.forEach(addPath)
        }
      }

      appendEntry(manifest['resources/js/app.jsx'])

      Object.entries(manifest).forEach(([key, value]) => {
        if (key.startsWith('resources/js/Pages/Public/')) {
          appendEntry(value)
        }
      })
    }
  } catch (error) {
    console.warn('[SW] Unable to read Vite manifest for precaching', error)
  }

  return Array.from(urls)

  function addPath(assetPath) {
    if (!assetPath) return
    const normalized = assetPath.startsWith('/') ? assetPath : `/build/${assetPath}`
    urls.add(normalized)
  }
}

async function cacheUrls(cacheName, urls) {
  if (!urls.length) return

  const cache = await caches.open(cacheName)
  await Promise.all(
    urls.map(async (url) => {
      try {
        const request = new Request(url, { cache: 'no-cache', credentials: 'same-origin' })
        const response = await fetch(request)
        if (response.ok) {
          await cache.put(request, response.clone())
        }
      } catch (error) {
        console.warn('[SW] Skipped caching', url, error)
      }
    })
  )
}

async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request)
    const cache = await caches.open(SHELL_CACHE)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    const cache = await caches.open(SHELL_CACHE)
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const offlineFallback = await cache.match(OFFLINE_URL)
    if (offlineFallback) {
      return offlineFallback
    }

    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE)
  const cached = await cache.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response && response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    throw error
  }
}
