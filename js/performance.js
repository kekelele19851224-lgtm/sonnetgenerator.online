// Performance and SEO Optimization for Sonnet Generator
// Core Web Vitals improvements and loading optimizations

console.log('Performance optimizations loaded - Phase 4 implementation');

// ===============================
// CORE WEB VITALS OPTIMIZATION
// ===============================

// Preload critical resources
function preloadCriticalResources() {
    // Preload critical fonts
    const fontPreloads = [
        'https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJX-g73NuI.woff2',
        'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeAmM.woff2'
    ];
    
    fontPreloads.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// Optimize LCP (Largest Contentful Paint)
function optimizeLCP() {
    // Ensure hero section loads quickly
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.contentVisibility = 'auto';
        hero.style.containIntrinsicSize = '1000px 400px';
    }
    
    // Preload hero background if exists
    const heroBackground = getComputedStyle(hero)?.backgroundImage;
    if (heroBackground && heroBackground !== 'none') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = heroBackground.match(/url\("?([^"]*)"?\)/)?.[1];
        link.as = 'image';
        document.head.appendChild(link);
    }
}

// Minimize CLS (Cumulative Layout Shift)
function minimizeCLS() {
    // Reserve space for dynamic content
    const outputContainer = document.getElementById('sonnet-content');
    if (outputContainer) {
        outputContainer.style.minHeight = '400px';
    }
    
    // Ensure consistent button sizing
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!button.style.width) {
            button.style.minWidth = button.offsetWidth + 'px';
        }
    });
    
    // Prevent layout shifts from fonts loading
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
    });
}

// Optimize FID (First Input Delay)
function optimizeFID() {
    // Use passive event listeners where possible
    const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove'];
    
    passiveEvents.forEach(eventType => {
        document.addEventListener(eventType, () => {}, { passive: true });
    });
    
    // Debounce expensive operations
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize-dependent operations
            updateViewportDependentSizes();
        }, 250);
    });
    
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initializeAnalytics();
            preloadNonCriticalAssets();
        });
    } else {
        setTimeout(() => {
            initializeAnalytics();
            preloadNonCriticalAssets();
        }, 1000);
    }
}

// Lazy loading implementation
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        const lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.dataset.lazySrc) {
                        element.src = element.dataset.lazySrc;
                        element.removeAttribute('data-lazy-src');
                    }
                    
                    if (element.dataset.lazyBackground) {
                        element.style.backgroundImage = `url(${element.dataset.lazyBackground})`;
                        element.removeAttribute('data-lazy-background');
                    }
                    
                    element.classList.add('lazy-loaded');
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

// Resource loading optimization
function optimizeResourceLoading() {
    // DNS prefetch for external resources
    const dnsPrefetches = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com'
    ];
    
    dnsPrefetches.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });
    
    // Preconnect to critical third-party origins
    const preconnects = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    
    preconnects.forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// Service Worker registration for caching
function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch(registrationError => {
                    // Only log error if it's not a development environment
                    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                        console.warn('Service Worker registration failed:', registrationError);
                    }
                });
        });
    } else if ('serviceWorker' in navigator) {
        console.log('Service Worker requires HTTPS to register');
    }
}

// Critical CSS inlining detection
function optimizeCSSLoading() {
    // Mark critical CSS as loaded
    document.documentElement.classList.add('critical-css-loaded');
    
    // Load non-critical CSS asynchronously
    const nonCriticalCSS = [
        'css/print.css',
        'css/animations.css'
    ];
    
    nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() {
            this.media = 'all';
        };
        document.head.appendChild(link);
    });
}

// Memory management
function optimizeMemoryUsage() {
    // Clean up generation history if it gets too large
    const maxHistorySize = 50;
    const history = window.AdvancedFeatures?.getGenerationHistory() || [];
    
    if (history.length > maxHistorySize) {
        const trimmedHistory = history.slice(0, maxHistorySize);
        if (window.AdvancedFeatures) {
            window.AdvancedFeatures.clearGenerationHistory();
            trimmedHistory.forEach(item => {
                window.AdvancedFeatures.addToHistory(item);
            });
        }
    }
    
    // Clean up old notifications
    const notifications = document.querySelectorAll('.save-notification, .copy-notification');
    notifications.forEach(notification => {
        if (notification.classList.contains('fade-out')) {
            notification.remove();
        }
    });
}

// Performance monitoring
function setupPerformanceMonitoring() {
    // Web Vitals measurement
    if ('PerformanceObserver' in window) {
        try {
            // LCP Observer
            new PerformanceObserver((entryList) => {
                const lcpEntry = entryList.getEntries().at(-1);
                console.log('LCP:', lcpEntry.startTime);
                
                // Send to analytics if configured
                if (window.gtag) {
                    window.gtag('event', 'web_vitals', {
                        name: 'LCP',
                        value: Math.round(lcpEntry.startTime),
                        custom_map: { metric_name: 'largest_contentful_paint' }
                    });
                }
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            
            // FID Observer
            new PerformanceObserver((entryList) => {
                const fidEntry = entryList.getEntries()[0];
                console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
                
                if (window.gtag) {
                    window.gtag('event', 'web_vitals', {
                        name: 'FID',
                        value: Math.round(fidEntry.processingStart - fidEntry.startTime),
                        custom_map: { metric_name: 'first_input_delay' }
                    });
                }
            }).observe({ type: 'first-input', buffered: true });
            
            // CLS Observer
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
                
                if (window.gtag) {
                    window.gtag('event', 'web_vitals', {
                        name: 'CLS',
                        value: Math.round(clsValue * 1000),
                        custom_map: { metric_name: 'cumulative_layout_shift' }
                    });
                }
            }).observe({ type: 'layout-shift', buffered: true });
            
        } catch (error) {
            console.warn('Performance monitoring setup failed:', error);
        }
    }
}

// Utility functions
function updateViewportDependentSizes() {
    // Update any viewport-dependent calculations
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function initializeAnalytics() {
    // Initialize analytics if configured
    // This is a placeholder for actual analytics implementation
    console.log('Analytics initialized (placeholder)');
}

function preloadNonCriticalAssets() {
    // Preload assets that will likely be needed
    const likelyNeededAssets = [
        // Images removed - using inline SVG data URIs instead
        // Only preload assets that are actually used
    ];
    
    // Only preload if we have assets to preload
    if (likelyNeededAssets.length === 0) {
        console.log('No non-critical assets to preload');
        return;
    }
    
    likelyNeededAssets.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Debounce utility
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Initialize all performance optimizations
function initializePerformanceOptimizations() {
    // Run critical optimizations immediately
    preloadCriticalResources();
    optimizeLCP();
    minimizeCLS();
    optimizeFID();
    optimizeResourceLoading();
    optimizeCSSLoading();
    
    // Setup observers and monitoring
    setupLazyLoading();
    setupPerformanceMonitoring();
    
    // Register service worker (disabled for development)
    // registerServiceWorker();
    
    // Setup periodic cleanup
    setInterval(optimizeMemoryUsage, 5 * 60 * 1000); // Every 5 minutes
    
    // Update viewport sizes
    updateViewportDependentSizes();
    window.addEventListener('resize', debounce(updateViewportDependentSizes, 250));
    
    console.log('Performance optimizations initialized');
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePerformanceOptimizations);
} else {
    initializePerformanceOptimizations();
}

// Export performance utilities
window.PerformanceOptimizer = {
    optimizeLCP,
    minimizeCLS,
    optimizeFID,
    setupLazyLoading,
    optimizeMemoryUsage,
    debounce
};

