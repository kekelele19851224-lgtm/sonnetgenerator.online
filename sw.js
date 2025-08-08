// Service Worker for Sonnet Generator
// Provides caching, offline functionality, and performance improvements

const CACHE_NAME = 'sonnet-generator-v4.0';
const STATIC_CACHE = 'sonnet-static-v4.0';
const DYNAMIC_CACHE = 'sonnet-dynamic-v4.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/responsive.css',
    '/js/utils.js',
    '/js/wordbanks.js',
    '/js/generator.js',
    '/js/sharing.js',
    '/js/performance.js',
    '/README.md',
    // Add fallback for fonts
    'https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap'
];

// Files that should always be fetched from network first
const NETWORK_FIRST = [
    '/api/', // API endpoints if any
    '/analytics/' // Analytics if any
];

// Files that can be cached but should be updated periodically
const STALE_WHILE_REVALIDATE = [
    // '/images/', // Images directory not used
    '/fonts/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting(); // Force activation
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete old caches
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim(); // Take control of all clients
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Handle different types of requests with appropriate strategies
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirstStrategy(request));
    } else if (isNetworkFirst(request)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isStaleWhileRevalidate(request)) {
        event.respondWith(staleWhileRevalidateStrategy(request));
    } else {
        event.respondWith(networkFirstWithFallback(request));
    }
});

// Cache first strategy - for static assets
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        
        // Return offline fallback for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html') || createOfflinePage();
        }
        
        throw error;
    }
}

// Network first strategy - for dynamic content
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network first falling back to cache:', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Stale while revalidate strategy - for images and fonts
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Fetch updated version in background
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('Background fetch failed:', error);
    });
    
    // Return cached version immediately if available
    return cachedResponse || fetchPromise;
}

// Network first with fallback - default strategy
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return appropriate fallback
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/') || createOfflinePage();
        }
        
        throw error;
    }
}

// Helper functions
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/css/') || 
           url.pathname.includes('/js/') || 
           url.pathname.endsWith('.html') ||
           STATIC_FILES.some(file => url.pathname.includes(file));
}

function isNetworkFirst(request) {
    const url = new URL(request.url);
    return NETWORK_FIRST.some(path => url.pathname.includes(path));
}

function isStaleWhileRevalidate(request) {
    const url = new URL(request.url);
    return STALE_WHILE_REVALIDATE.some(path => url.pathname.includes(path)) ||
           url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com';
}

// Create basic offline page
function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - Sonnet Generator</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background-color: #faf7f0;
                    color: #2d3748;
                    text-align: center;
                    padding: 20px;
                }
                .offline-content {
                    max-width: 500px;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                .offline-title {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    color: #1a365d;
                }
                .offline-message {
                    font-size: 1.1rem;
                    line-height: 1.5;
                    margin-bottom: 2rem;
                    opacity: 0.8;
                }
                .offline-button {
                    background-color: #1a365d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                }
                .offline-button:hover {
                    background-color: #2c5282;
                }
            </style>
        </head>
        <body>
            <div class="offline-content">
                <div class="offline-icon">📝</div>
                <h1 class="offline-title">You're Offline</h1>
                <p class="offline-message">
                    It looks like you're not connected to the internet. 
                    Don't worry - you can still use the basic sonnet generation features!
                </p>
                <a href="/" class="offline-button">Try Again</a>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Background sync for saving sonnets when online
self.addEventListener('sync', event => {
    if (event.tag === 'save-sonnet') {
        event.waitUntil(syncSavedSonnets());
    }
});

async function syncSavedSonnets() {
    // This would sync any locally saved sonnets to a server when back online
    console.log('Background sync: Saving sonnets...');
    // Implementation would depend on backend API
}

// Push notifications (if implemented)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjMWEzNjVkIi8+Cjx0ZXh0IHg9Ijk2IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJDcmltc29uIFRleHQsIHNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZjdmYWZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TPC90ZXh0Pgo8L3N2Zz4=',
            badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjMWEzNjVkIi8+Cjx0ZXh0IHg9IjM2IiB5PSI0MCIgZm9udC1mYW1pbHk9IkNyaW1zb24gVGV4dCwgc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmN2ZhZmMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlM8L3RleHQ+Cjwvc3ZnPg==',
            tag: 'sonnet-notification',
            renotify: true,
            actions: [
                {
                    action: 'view',
                    title: 'View Sonnet',
                    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVoLTJ2LTZoMnY2em0wLThoLTJWN2gydjJ6IiBmaWxsPSIjZjdmYWZjIi8+Cjwvc3ZnPg=='
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync for cache cleanup
self.addEventListener('periodicsync', event => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(cleanupCaches());
    }
});

async function cleanupCaches() {
    console.log('Periodic sync: Cleaning up caches...');
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    
    // Remove old entries (older than 1 week)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    await Promise.all(
        keys.map(async request => {
            const response = await cache.match(request);
            const dateHeader = response.headers.get('date');
            
            if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (responseDate < oneWeekAgo) {
                    await cache.delete(request);
                }
            }
        })
    );
}

console.log('Service Worker: Loaded');

