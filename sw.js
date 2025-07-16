// Service Worker for Surfers Bahia FM PWA
// Version: 1.0.0

const CACHE_NAME = 'radio-cache-v1';
const STATIC_CACHE_NAME = 'radio-static-v1';
const DYNAMIC_CACHE_NAME = 'radio-dynamic-v1';

// Files to cache immediately
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/assets/logo.png'
];

// Files to cache dynamically
const DYNAMIC_CACHE_URLS = [
    // Audio stream URLs will be handled separately
    // API endpoints for metadata
    // External resources
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Caching static files');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                console.log('Static files cached successfully');
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Old caches cleaned up');
                // Take control of all clients immediately
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('Activation failed:', error);
            })
    );
});

/**
 * Fetch event - handle network requests
 */
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-HTTP(S) requests (chrome-extension, etc.)
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Skip cross-origin requests for audio streams
    if (url.origin !== location.origin && isAudioStream(request.url)) {
        return; // Let browser handle audio streams directly
    }
    
    // Handle different types of requests
    if (request.method === 'GET') {
        event.respondWith(handleGetRequest(request));
    }
});

/**
 * Handle GET requests with cache strategy
 */
async function handleGetRequest(request) {
    // Skip invalid URLs
    try {
        const url = new URL(request.url);
        if (!url.protocol.startsWith('http')) {
            return fetch(request);
        }
    } catch (error) {
        console.error('Invalid URL:', request.url);
        return new Response('Invalid URL', { status: 400 });
    }
    
    try {
        // Strategy 1: Cache First (for static assets)
        if (isStaticAsset(request.url)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network First (for dynamic content)
        if (isDynamicContent(request.url)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale While Revalidate (for API calls)
        if (isApiCall(request.url)) {
            return await staleWhileRevalidate(request);
        }
        
        // Default: Cache First
        return await cacheFirst(request);
        
    } catch (error) {
        console.error('Fetch handling failed:', error);
        return await handleOfflineResponse(request);
    }
}

/**
 * Cache First strategy
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            try {
                const cache = await caches.open(STATIC_CACHE_NAME);
                cache.put(request, networkResponse.clone());
            } catch (cacheError) {
                console.warn('Failed to cache response:', cacheError);
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Network request failed:', error);
        return await handleOfflineResponse(request);
    }
}

/**
 * Network First strategy
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Network request failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return await handleOfflineResponse(request);
    }
}

/**
 * Stale While Revalidate strategy
 */
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Always try to fetch from network in the background
    const networkPromise = fetch(request).then(async (networkResponse) => {
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch((error) => {
        console.error('Background fetch failed:', error);
    });
    
    // Return cached response immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Otherwise wait for network
    return networkPromise;
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
    return url.includes('.css') || 
           url.includes('.js') || 
           url.includes('.png') || 
           url.includes('.jpg') || 
           url.includes('.jpeg') || 
           url.includes('.gif') || 
           url.includes('.svg') || 
           url.includes('.ico') ||
           url.includes('.woff') ||
           url.includes('.woff2') ||
           url.includes('.ttf');
}

/**
 * Check if URL is dynamic content
 */
function isDynamicContent(url) {
    return url.includes('/api/') || 
           url.includes('/metadata/') || 
           url.includes('/nowplaying/');
}

/**
 * Check if URL is an API call
 */
function isApiCall(url) {
    return url.includes('/api/') || 
           url.includes('/metadata/');
}

/**
 * Check if URL is an audio stream
 */
function isAudioStream(url) {
    return url.includes('/stream') || 
           url.includes('.mp3') || 
           url.includes('.aac') || 
           url.includes('.m3u8') ||
           url.includes('sonic2.sistemahost.es');
}

/**
 * Handle offline responses
 */
async function handleOfflineResponse(request) {
    const url = new URL(request.url);
    
    // For navigation requests, return cached index.html
    if (request.destination === 'document') {
        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) {
            return cachedIndex;
        }
    }
    
    // For API requests, return offline message
    if (isApiCall(request.url)) {
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'This feature requires an internet connection'
            }),
            {
                status: 503,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
    
    // For other requests, return generic offline response
    return new Response(
        'This content is not available offline',
        {
            status: 503,
            headers: {
                'Content-Type': 'text/plain'
            }
        }
    );
}

/**
 * Message handling for communication with main thread
 */
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'CACHE_URLS':
            cacheUrls(data.urls).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        default:
            console.warn('Unknown message type:', type);
    }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
}

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    await cache.addAll(urls);
    console.log('URLs cached:', urls);
}

/**
 * Periodic background sync (if supported)
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // TODO: Implement background sync logic
            // e.g., sync playlist, metadata, etc.
            console.log('Background sync triggered')
        );
    }
});

/**
 * Push notifications (if supported)
 */
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/assets/logo.png',
            badge: '/assets/logo.png',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            },
            actions: [
                {
                    action: 'open',
                    title: 'Open Radio',
                    icon: '/assets/logo.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/assets/logo.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

/**
 * Notification click handling
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// TODO: Add more sophisticated caching strategies
// TODO: Add background sync for metadata
// TODO: Add push notification support
// TODO: Add offline page functionality
// TODO: Add cache size management
// TODO: Add analytics tracking for offline usage
