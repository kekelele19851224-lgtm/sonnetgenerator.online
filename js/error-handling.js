// Comprehensive Error Handling and Edge Cases for Sonnet Generator
// Graceful error management and user feedback system

console.log('Error handling system loaded - Phase 4 implementation');

// ===============================
// ERROR HANDLING SYSTEM
// ===============================

// Error types and codes
const ERROR_TYPES = {
    GENERATION_FAILED: 'GENERATION_FAILED',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    STORAGE_ERROR: 'STORAGE_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    BROWSER_COMPATIBILITY: 'BROWSER_COMPATIBILITY',
    RESOURCE_UNAVAILABLE: 'RESOURCE_UNAVAILABLE',
    USER_INPUT_ERROR: 'USER_INPUT_ERROR',
    SYSTEM_ERROR: 'SYSTEM_ERROR'
};

// Error severity levels
const ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

// Error tracking and logging
let errorLog = [];
const MAX_ERROR_LOG_SIZE = 100;

// Main error handler class
class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
        this.setupUnhandledRejectionHandling();
        this.setupResourceErrorHandling();
    }

    // Setup global error handling
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError({
                type: ERROR_TYPES.SYSTEM_ERROR,
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error,
                severity: ERROR_SEVERITY.HIGH
            });
        });
    }

    // Setup promise rejection handling
    setupUnhandledRejectionHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: ERROR_TYPES.SYSTEM_ERROR,
                message: `Unhandled promise rejection: ${event.reason}`,
                error: event.reason,
                severity: ERROR_SEVERITY.MEDIUM
            });
            
            // Prevent browser console logging
            event.preventDefault();
        });
    }

    // Setup resource loading error handling
    setupResourceErrorHandling() {
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleError({
                    type: ERROR_TYPES.RESOURCE_UNAVAILABLE,
                    message: `Failed to load resource: ${event.target.src || event.target.href}`,
                    source: event.target.tagName,
                    severity: ERROR_SEVERITY.MEDIUM
                });
            }
        }, true);
    }

    // Main error handling method
    handleError(errorInfo) {
        // Log error
        this.logError(errorInfo);
        
        // Determine user notification strategy
        const shouldNotifyUser = this.shouldNotifyUser(errorInfo);
        
        if (shouldNotifyUser) {
            this.showUserFriendlyError(errorInfo);
        }
        
        // Attempt recovery if possible
        this.attemptRecovery(errorInfo);
        
        // Report to analytics (if configured)
        this.reportError(errorInfo);
    }

    // Log error for debugging
    logError(errorInfo) {
        const logEntry = {
            ...errorInfo,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        errorLog.unshift(logEntry);
        
        // Limit log size
        if (errorLog.length > MAX_ERROR_LOG_SIZE) {
            errorLog = errorLog.slice(0, MAX_ERROR_LOG_SIZE);
        }
        
        // Console logging for development
        if (errorInfo.severity === ERROR_SEVERITY.CRITICAL || errorInfo.severity === ERROR_SEVERITY.HIGH) {
            console.error('Sonnet Generator Error:', logEntry);
        } else {
            console.warn('Sonnet Generator Warning:', logEntry);
        }
    }

    // Determine if user should be notified
    shouldNotifyUser(errorInfo) {
        return errorInfo.severity === ERROR_SEVERITY.HIGH || 
               errorInfo.severity === ERROR_SEVERITY.CRITICAL ||
               errorInfo.type === ERROR_TYPES.GENERATION_FAILED ||
               errorInfo.type === ERROR_TYPES.VALIDATION_ERROR;
    }

    // Show user-friendly error message
    showUserFriendlyError(errorInfo) {
        const userMessage = this.getUserFriendlyMessage(errorInfo);
        const suggestions = this.getRecoverySuggestions(errorInfo);
        
        this.displayErrorNotification(userMessage, suggestions, errorInfo.severity);
    }

    // Get user-friendly error message
    getUserFriendlyMessage(errorInfo) {
        const messages = {
            [ERROR_TYPES.GENERATION_FAILED]: 'We encountered an issue generating your sonnet. Please try again with different settings.',
            [ERROR_TYPES.VALIDATION_ERROR]: 'Please check your input and make sure all required fields are filled correctly.',
            [ERROR_TYPES.STORAGE_ERROR]: 'Unable to save your data. Your browser storage might be full.',
            [ERROR_TYPES.NETWORK_ERROR]: 'Network connection issue. Please check your internet connection.',
            [ERROR_TYPES.BROWSER_COMPATIBILITY]: 'Some features may not work properly in your browser. Please consider updating.',
            [ERROR_TYPES.RESOURCE_UNAVAILABLE]: 'Some resources failed to load. The page may not display correctly.',
            [ERROR_TYPES.USER_INPUT_ERROR]: 'There\'s an issue with your input. Please review and try again.',
            [ERROR_TYPES.SYSTEM_ERROR]: 'An unexpected error occurred. Please refresh the page and try again.'
        };
        
        return messages[errorInfo.type] || 'An unexpected error occurred. Please try again.';
    }

    // Get recovery suggestions
    getRecoverySuggestions(errorInfo) {
        const suggestions = {
            [ERROR_TYPES.GENERATION_FAILED]: [
                'Try a different theme or mood combination',
                'Use simpler vocabulary settings',
                'Check if custom words are appropriate',
                'Refresh the page and try again'
            ],
            [ERROR_TYPES.VALIDATION_ERROR]: [
                'Make sure all required fields are filled',
                'Check that custom words contain only letters',
                'Verify your selections are valid'
            ],
            [ERROR_TYPES.STORAGE_ERROR]: [
                'Clear your browser cache and cookies',
                'Free up storage space',
                'Try using a private/incognito window'
            ],
            [ERROR_TYPES.NETWORK_ERROR]: [
                'Check your internet connection',
                'Try refreshing the page',
                'Disable ad blockers or VPN temporarily'
            ],
            [ERROR_TYPES.BROWSER_COMPATIBILITY]: [
                'Update your browser to the latest version',
                'Try using Chrome, Firefox, Safari, or Edge',
                'Enable JavaScript if disabled'
            ]
        };
        
        return suggestions[errorInfo.type] || ['Refresh the page and try again'];
    }

    // Display error notification to user
    displayErrorNotification(message, suggestions, severity) {
        const notification = document.createElement('div');
        notification.className = `error-notification severity-${severity}`;
        
        notification.innerHTML = `
            <div class="error-content">
                <div class="error-header">
                    <span class="error-icon" aria-hidden="true">${this.getErrorIcon(severity)}</span>
                    <h4 class="error-title">${this.getErrorTitle(severity)}</h4>
                    <button class="error-close" aria-label="Close error message">&times;</button>
                </div>
                <p class="error-message">${message}</p>
                ${suggestions.length > 0 ? `
                    <div class="error-suggestions">
                        <h5>Try these solutions:</h5>
                        <ul class="suggestions-list">
                            ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="error-actions">
                    <button class="error-retry btn btn-primary">Try Again</button>
                    <button class="error-report btn btn-outline">Report Issue</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = notification.querySelector('.error-close');
        const retryBtn = notification.querySelector('.error-retry');
        const reportBtn = notification.querySelector('.error-report');
        
        closeBtn.addEventListener('click', () => this.hideErrorNotification(notification));
        retryBtn.addEventListener('click', () => this.retryLastAction(notification));
        reportBtn.addEventListener('click', () => this.showReportDialog());
        
        // Auto-hide after delay (except for critical errors)
        if (severity !== ERROR_SEVERITY.CRITICAL) {
            setTimeout(() => {
                if (notification.parentElement) {
                    this.hideErrorNotification(notification);
                }
            }, 15000);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Announce to screen readers
        if (window.AccessibilityEnhancer) {
            window.AccessibilityEnhancer.announceToScreenReader(
                `Error: ${message}`, 
                'assertive'
            );
        }
    }

    getErrorIcon(severity) {
        const icons = {
            [ERROR_SEVERITY.LOW]: '⚠️',
            [ERROR_SEVERITY.MEDIUM]: '❗',
            [ERROR_SEVERITY.HIGH]: '🚨',
            [ERROR_SEVERITY.CRITICAL]: '💥'
        };
        return icons[severity] || '❗';
    }

    getErrorTitle(severity) {
        const titles = {
            [ERROR_SEVERITY.LOW]: 'Notice',
            [ERROR_SEVERITY.MEDIUM]: 'Warning',
            [ERROR_SEVERITY.HIGH]: 'Error',
            [ERROR_SEVERITY.CRITICAL]: 'Critical Error'
        };
        return titles[severity] || 'Error';
    }

    hideErrorNotification(notification) {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }

    retryLastAction(notification) {
        this.hideErrorNotification(notification);
        
        // Trigger the last action (like form submission)
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.click();
        }
    }

    showReportDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'report-dialog';
        dialog.innerHTML = `
            <div class="report-content">
                <h4>Report an Issue</h4>
                <p>Help us improve by describing what you were trying to do:</p>
                <textarea class="report-description" placeholder="Describe what happened and what you expected..."></textarea>
                <div class="report-actions">
                    <button class="report-send btn btn-primary">Send Report</button>
                    <button class="report-cancel btn btn-outline">Cancel</button>
                </div>
            </div>
            <div class="report-overlay"></div>
        `;
        
        const sendBtn = dialog.querySelector('.report-send');
        const cancelBtn = dialog.querySelector('.report-cancel');
        const overlay = dialog.querySelector('.report-overlay');
        
        const closeDialog = () => document.body.removeChild(dialog);
        
        sendBtn.addEventListener('click', () => {
            const description = dialog.querySelector('.report-description').value;
            this.submitErrorReport(description);
            closeDialog();
        });
        
        cancelBtn.addEventListener('click', closeDialog);
        overlay.addEventListener('click', closeDialog);
        
        document.body.appendChild(dialog);
    }

    submitErrorReport(description) {
        // In a real implementation, this would send to an error reporting service
        console.log('Error report submitted:', {
            description,
            recentErrors: errorLog.slice(0, 5),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
        
        // Show success message
        this.showSuccessMessage('Thank you for your report! We\'ll look into this issue.');
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <span class="success-icon">✅</span>
            <span class="success-message">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Attempt automatic recovery
    attemptRecovery(errorInfo) {
        switch (errorInfo.type) {
            case ERROR_TYPES.STORAGE_ERROR:
                this.recoverFromStorageError();
                break;
            case ERROR_TYPES.GENERATION_FAILED:
                this.recoverFromGenerationError();
                break;
            case ERROR_TYPES.RESOURCE_UNAVAILABLE:
                this.recoverFromResourceError();
                break;
        }
    }

    recoverFromStorageError() {
        try {
            // Clear old data to free up space
            const oldData = localStorage.getItem('saved-sonnets');
            if (oldData) {
                const sonnets = JSON.parse(oldData);
                if (sonnets.length > 20) {
                    const trimmed = sonnets.slice(0, 20);
                    localStorage.setItem('saved-sonnets', JSON.stringify(trimmed));
                }
            }
        } catch (error) {
            console.warn('Storage recovery failed:', error);
        }
    }

    recoverFromGenerationError() {
        // Reset form to default values
        const form = document.getElementById('sonnet-form');
        if (form) {
            const defaults = {
                'sonnet-type': 'shakespearean',
                'theme': 'love',
                'mood': '0',
                'complexity': false,
                'custom-words': ''
            };
            
            Object.entries(defaults).forEach(([name, value]) => {
                const field = form.querySelector(`[name="${name}"]`);
                if (field) {
                    if (field.type === 'radio') {
                        const radio = form.querySelector(`[name="${name}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else if (field.type === 'checkbox') {
                        field.checked = value;
                    } else {
                        field.value = value;
                    }
                }
            });
        }
    }

    recoverFromResourceError() {
        // Retry loading critical resources
        const criticalResources = ['js/generator.js', 'js/wordbanks.js'];
        
        criticalResources.forEach(src => {
            const script = document.querySelector(`script[src*="${src}"]`);
            if (script && !window[src.split('/')[1].split('.')[0]]) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.onerror = () => console.warn(`Failed to reload ${src}`);
                document.head.appendChild(newScript);
            }
        });
    }

    // Report error to analytics (placeholder)
    reportError(errorInfo) {
        // This would typically send to an analytics service
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: errorInfo.message,
                fatal: errorInfo.severity === ERROR_SEVERITY.CRITICAL
            });
        }
    }

    // Get error log for debugging
    getErrorLog() {
        return errorLog;
    }

    // Clear error log
    clearErrorLog() {
        errorLog = [];
    }
}

// ===============================
// EDGE CASE HANDLERS
// ===============================

// Browser compatibility checks
function checkBrowserCompatibility() {
    const requiredFeatures = {
        'localStorage': () => 'localStorage' in window,
        'fetch': () => 'fetch' in window,
        'Promise': () => 'Promise' in window,
        'arrow functions': () => {
            try { eval('() => {}'); return true; } catch { return false; }
        },
        'CSS Grid': () => CSS.supports('display', 'grid'),
        'CSS Custom Properties': () => CSS.supports('color', 'var(--test)'),
        'Clipboard API': () => 'clipboard' in navigator
    };

    const unsupportedFeatures = [];
    
    Object.entries(requiredFeatures).forEach(([feature, check]) => {
        if (!check()) {
            unsupportedFeatures.push(feature);
        }
    });

    if (unsupportedFeatures.length > 0) {
        errorHandler.handleError({
            type: ERROR_TYPES.BROWSER_COMPATIBILITY,
            message: `Unsupported features: ${unsupportedFeatures.join(', ')}`,
            severity: ERROR_SEVERITY.MEDIUM,
            details: { unsupportedFeatures }
        });
    }
}

// Form validation with comprehensive error handling
function validateFormWithErrorHandling(form) {
    try {
        const errors = [];
        
        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                errors.push(`${field.labels[0]?.textContent || field.name} is required`);
            }
        });
        
        // Validate custom words
        const customWords = form.querySelector('#custom-words');
        if (customWords && customWords.value.trim()) {
            const words = customWords.value.split(',').map(w => w.trim());
            const invalidWords = words.filter(word => !/^[a-zA-Z\s]+$/.test(word));
            
            if (invalidWords.length > 0) {
                errors.push(`Invalid words: ${invalidWords.join(', ')}. Use only letters and spaces.`);
            }
            
            if (words.length > 10) {
                errors.push('Please limit custom words to 10 or fewer.');
            }
        }
        
        if (errors.length > 0) {
            errorHandler.handleError({
                type: ERROR_TYPES.VALIDATION_ERROR,
                message: errors.join('; '),
                severity: ERROR_SEVERITY.MEDIUM,
                details: { errors }
            });
            return false;
        }
        
        return true;
        
    } catch (error) {
        errorHandler.handleError({
            type: ERROR_TYPES.SYSTEM_ERROR,
            message: 'Form validation failed',
            error: error,
            severity: ERROR_SEVERITY.HIGH
        });
        return false;
    }
}

// Network connectivity check
function checkNetworkConnectivity() {
    if ('navigator' in window && 'onLine' in navigator) {
        if (!navigator.onLine) {
            errorHandler.handleError({
                type: ERROR_TYPES.NETWORK_ERROR,
                message: 'No internet connection detected',
                severity: ERROR_SEVERITY.MEDIUM
            });
            return false;
        }
    }
    return true;
}

// Memory usage monitoring
function monitorMemoryUsage() {
    if ('memory' in performance) {
        const memory = performance.memory;
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usagePercent > 80) {
            errorHandler.handleError({
                type: ERROR_TYPES.SYSTEM_ERROR,
                message: 'High memory usage detected',
                severity: ERROR_SEVERITY.MEDIUM,
                details: { usagePercent: Math.round(usagePercent) }
            });
        }
    }
}

// Initialize error handling system
const errorHandler = new ErrorHandler();

// Export for global access
window.ErrorHandler = ErrorHandler;
window.errorHandler = errorHandler;
window.ERROR_TYPES = ERROR_TYPES;
window.ERROR_SEVERITY = ERROR_SEVERITY;

// Utility functions
window.ErrorUtils = {
    validateFormWithErrorHandling,
    checkBrowserCompatibility,
    checkNetworkConnectivity,
    monitorMemoryUsage
};

// Initialize checks
document.addEventListener('DOMContentLoaded', () => {
    try {
        checkBrowserCompatibility();
        
        // Periodic memory monitoring
        setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
        console.log('Error handling system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize error handling system:', error);
    }
});

console.log('Error handling system initialized');

