// Service Worker for Surfers Bahia FM PWA
// Version: 2.1.0 - Added JSON data files to cache management

const CACHE_NAME = 'radio-cache-v2-1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/data/scrolling-text.json',
    '/assets/logo.webp',
    '/assets/favicon/favicon.ico',
    '/assets/favicon/favicon-16x16.png',
    '/assets/favicon/favicon-32x32.png',
    '/assets/favicon/apple-touch-icon.png',
    '/assets/favicon/android-chrome-192x192.png',
    '/assets/favicon/android-chrome-512x512.png'
];

/**
 * Install event - cache initial assets
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker v2.1.0 installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
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
 * Activate event - clear old caches
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker v2.1.0 activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete any cache that doesn't match current version
                        if (cacheName !== CACHE_NAME) {
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
 * Fetch event - handle network requests with network-first for HTML
 */
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // Skip non-HTTP(S) requests (chrome-extension, etc.)
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Skip audio stream requests - let browser handle directly
    if (isAudioStream(request.url)) {
        return;
    }
    
    // Handle navigation requests (HTML pages) with network-first strategy
    if (request.mode === 'navigate') {
        event.respondWith(networkFirstForNavigation(request));
        return;
    }
    
    // Handle other requests based on file type
    if (request.method === 'GET') {
        event.respondWith(handleGetRequest(request));
    }
});

/**
 * Network-first strategy for navigation (HTML files)
 * This ensures the latest version is always served when possible
 */
async function networkFirstForNavigation(request) {
    try {
        console.log('Network-first for navigation:', request.url);
        
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Update cache with fresh content
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('Navigation cache updated:', request.url);
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
        
    } catch (error) {
        console.log('Network failed for navigation, trying cache:', error.message);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Final fallback - return offline page or basic error
        return new Response(
            '<!DOCTYPE html><html><head><title>Offline - Surfers Bahia FM</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
        );
    }
}

/**
 * Handle GET requests for static assets
 */
async function handleGetRequest(request) {
    try {
        const url = new URL(request.url);
        
        // Network-first for CSS, JS, and JSON data files to ensure updates
        if (isCriticalAsset(request.url)) {
            return await networkFirstForAssets(request);
        }
        
        // Cache-first for images and other static assets
        return await cacheFirst(request);
        
    } catch (error) {
        console.error('Fetch handling failed:', error);
        return await handleOfflineResponse(request);
    }
}

/**
 * Network-first strategy for critical assets (CSS, JS, JSON)
 */
async function networkFirstForAssets(request) {
    try {
        console.log('Network-first for asset:', request.url);
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Update cache with fresh content
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('Asset cache updated:', request.url);
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
        
    } catch (error) {
        console.log('Network failed for asset, trying cache:', error.message);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

/**
 * Cache-first strategy for non-critical assets
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Cache-first strategy failed:', error);
        return await handleOfflineResponse(request);
    }
}

/**
 * Check if URL is an audio stream
 */
function isAudioStream(url) {
    return url.includes('stream') || 
           url.includes('.mp3') || 
           url.includes('.aac') || 
           url.includes('8110') ||
           url.includes('sistemahost.es');
}

/**
 * Check if asset is critical (CSS, JS, JSON) - needs network-first
 */
function isCriticalAsset(url) {
    return url.endsWith('.css') || 
           url.endsWith('.js') ||
           url.endsWith('.json') ||
           url.includes('style.css') ||
           url.includes('app.js') ||
           url.includes('scrolling-text.json') ||
           url.includes('/data/');
}

/**
 * Handle offline responses
 */
async function handleOfflineResponse(request) {
    if (request.destination === 'document') {
        const cachedResponse = await caches.match('/index.html');
        if (cachedResponse) {
            return cachedResponse;
        }
    }
    
    return new Response('Offline - content not available', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

/**
 * Message handling for cache updates
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

console.log('Service Worker v2.1.0 script loaded');
