// Accessibility and UX Enhancements for Sonnet Generator
// WCAG 2.1 AA compliance and enhanced user experience

console.log('Accessibility enhancements loaded - Phase 4 implementation');

// ===============================
// ARIA AND ACCESSIBILITY FEATURES
// ===============================

// Enhanced screen reader announcements
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.getElementById('sr-announcements') || createAnnouncementRegion();
    
    // Clear previous announcement
    announcement.textContent = '';
    
    // Set priority
    announcement.setAttribute('aria-live', priority);
    
    // Add announcement with slight delay to ensure it's read
    setTimeout(() => {
        announcement.textContent = message;
    }, 100);
    
    // Clear after reading
    setTimeout(() => {
        announcement.textContent = '';
    }, 5000);
}

function createAnnouncementRegion() {
    const region = document.createElement('div');
    region.id = 'sr-announcements';
    region.className = 'visually-hidden';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
    return region;
}

// Live region updates for dynamic content
function updateLiveRegion(elementId, content, level = 'polite') {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('aria-live', level);
        element.textContent = content;
    }
}

// Enhanced form accessibility
function enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add form instructions
        const instructions = document.createElement('div');
        instructions.id = `${form.id}-instructions`;
        instructions.className = 'form-instructions';
        instructions.textContent = 'Fill out the form below to generate your custom sonnet. Required fields are marked with an asterisk.';
        form.insertBefore(instructions, form.firstChild);
        form.setAttribute('aria-describedby', instructions.id);
        
        // Enhance form fields
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            enhanceFormField(field);
        });
        
        // Add form validation feedback
        form.addEventListener('submit', (e) => {
            const isValid = validateFormForAccessibility(form);
            if (!isValid) {
                e.preventDefault();
                announceToScreenReader('Please correct the errors in the form before submitting', 'assertive');
            }
        });
    });
}

function enhanceFormField(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    const fieldContainer = field.closest('.form-group');
    
    // Add required indicators
    if (field.hasAttribute('required')) {
        if (label && !label.querySelector('.required-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'required-indicator';
            indicator.textContent = ' *';
            indicator.setAttribute('aria-label', 'required');
            label.appendChild(indicator);
        }
        field.setAttribute('aria-required', 'true');
    }
    
    // Add descriptions
    const description = fieldContainer?.querySelector('.label-description');
    if (description) {
        const descId = `${field.id}-desc`;
        description.id = descId;
        
        const ariaDescribedBy = field.getAttribute('aria-describedby');
        field.setAttribute('aria-describedby', 
            ariaDescribedBy ? `${ariaDescribedBy} ${descId}` : descId
        );
    }
    
    // Add error handling
    field.addEventListener('invalid', () => {
        announceToScreenReader(`Error in ${label?.textContent || field.name}: ${field.validationMessage}`, 'assertive');
    });
    
    // Add change announcements for important fields
    if (field.type === 'range' || field.type === 'radio' || field.tagName === 'SELECT') {
        field.addEventListener('change', () => {
            const value = field.type === 'range' ? 
                field.closest('.slider-container')?.querySelector('.mood-output')?.textContent || field.value :
                field.value;
            announceToScreenReader(`${label?.textContent || field.name} changed to ${value}`);
        });
    }
}

function validateFormForAccessibility(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstErrorField = null;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.setAttribute('aria-invalid', 'true');
            if (!firstErrorField) {
                firstErrorField = field;
            }
        } else {
            field.setAttribute('aria-invalid', 'false');
        }
    });
    
    // Focus first error field
    if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

// ===============================
// KEYBOARD NAVIGATION
// ===============================

// Enhanced keyboard navigation
function setupKeyboardNavigation() {
    // Skip links
    addSkipLinks();
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Enhanced focus management
    setupFocusManagement();
    
    // Roving tabindex for custom components
    setupRovingTabindex();
}

function addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#generator" class="skip-link">Skip to sonnet generator</a>
        <a href="#about" class="skip-link">Skip to about section</a>
    `;
    document.body.insertBefore(skipLinks, document.body.firstChild);
    
    // Add main content ID if not exists
    const mainContent = document.querySelector('.main-content, main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only when not in input fields
        if (e.target.matches('input, textarea, select')) return;
        
        switch (e.code) {
            case 'KeyG':
                if (e.altKey) {
                    e.preventDefault();
                    const generateBtn = document.getElementById('generate-btn');
                    if (generateBtn) {
                        generateBtn.focus();
                        announceToScreenReader('Generate button focused. Press Enter to generate a sonnet.');
                    }
                }
                break;
                
            case 'KeyA':
                if (e.altKey) {
                    e.preventDefault();
                    const analyzeBtn = document.getElementById('analyze-btn');
                    if (analyzeBtn && analyzeBtn.style.display !== 'none') {
                        analyzeBtn.focus();
                        announceToScreenReader('Analyze button focused. Press Enter to analyze the current sonnet.');
                    }
                }
                break;
                
            case 'KeyC':
                if (e.altKey) {
                    e.preventDefault();
                    const copyBtn = document.getElementById('copy-btn');
                    if (copyBtn && copyBtn.style.display !== 'none') {
                        copyBtn.focus();
                        announceToScreenReader('Copy button focused. Press Enter to copy the sonnet.');
                    }
                }
                break;
                
            case 'KeyH':
                if (e.altKey) {
                    e.preventDefault();
                    showKeyboardShortcutsHelp();
                }
                break;
                
            case 'Escape':
                closeActiveModals();
                break;
        }
    });
}

function setupFocusManagement() {
    // Enhanced focus indicators
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Focus trap for modals
    setupFocusTraps();
    
    // Return focus management
    setupReturnFocus();
}

function setupFocusTraps() {
    const modals = document.querySelectorAll('.sharing-menu, .analysis-panel');
    
    modals.forEach(modal => {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                trapFocus(e, modal);
            }
        });
    });
}

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

function setupReturnFocus() {
    let lastFocusedElement = null;
    
    // Store focus before opening modals
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-opens-modal]')) {
            lastFocusedElement = e.target;
        }
    });
    
    // Return focus when modals close
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.classList?.contains('sharing-menu') || 
                         node.classList?.contains('analysis-panel'))) {
                        if (lastFocusedElement) {
                            lastFocusedElement.focus();
                            lastFocusedElement = null;
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

function setupRovingTabindex() {
    // For radio button groups
    const radioGroups = document.querySelectorAll('.radio-group');
    
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        
        // Set initial tabindex
        radios.forEach((radio, index) => {
            radio.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });
        
        // Handle arrow key navigation
        group.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                
                const currentIndex = Array.from(radios).indexOf(e.target);
                let nextIndex;
                
                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : radios.length - 1;
                } else {
                    nextIndex = currentIndex < radios.length - 1 ? currentIndex + 1 : 0;
                }
                
                // Update tabindex and focus
                radios[currentIndex].setAttribute('tabindex', '-1');
                radios[nextIndex].setAttribute('tabindex', '0');
                radios[nextIndex].focus();
                radios[nextIndex].checked = true;
                
                // Trigger change event
                radios[nextIndex].dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// ===============================
// UX ENHANCEMENTS
// ===============================

// Tooltips and help text
function setupTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[title]');
    
    elementsWithTooltips.forEach(element => {
        const tooltip = createTooltip(element.title);
        element.removeAttribute('title'); // Remove default tooltip
        element.setAttribute('aria-describedby', tooltip.id);
        
        element.addEventListener('mouseenter', () => showTooltip(tooltip, element));
        element.addEventListener('mouseleave', () => hideTooltip(tooltip));
        element.addEventListener('focus', () => showTooltip(tooltip, element));
        element.addEventListener('blur', () => hideTooltip(tooltip));
    });
}

function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = `tooltip-${Date.now()}`;
    tooltip.textContent = text;
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
    return tooltip;
}

function showTooltip(tooltip, element) {
    const rect = element.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    tooltip.classList.add('tooltip-visible');
}

function hideTooltip(tooltip) {
    tooltip.classList.remove('tooltip-visible');
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 200);
}

// Progress indicators
function setupProgressIndicators() {
    // Generation progress
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            showGenerationProgress();
        });
    }
}

function showGenerationProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-text">Generating your sonnet...</div>
    `;
    
    const outputContainer = document.querySelector('.sonnet-output-container');
    outputContainer.insertBefore(progressContainer, outputContainer.firstChild);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        const progressBar = progressContainer.querySelector('.progress-bar');
        const progressFill = progressContainer.querySelector('.progress-fill');
        const progressText = progressContainer.querySelector('.progress-text');
        
        progressBar.setAttribute('aria-valuenow', progress);
        progressFill.style.width = `${progress}%`;
        
        if (progress >= 100) {
            progressText.textContent = 'Sonnet generated!';
            clearInterval(interval);
            setTimeout(() => {
                progressContainer.remove();
            }, 500);
        }
    }, 400);
}

// Help and guidance
function showKeyboardShortcutsHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    helpModal.innerHTML = `
        <div class="help-modal-content" role="dialog" aria-labelledby="help-title">
            <h3 id="help-title">Keyboard Shortcuts</h3>
            <div class="shortcuts-list">
                <div class="shortcut">
                    <kbd>Alt + G</kbd>
                    <span>Focus Generate button</span>
                </div>
                <div class="shortcut">
                    <kbd>Alt + S</kbd>
                    <span>Focus Save button</span>
                </div>
                <div class="shortcut">
                    <kbd>Alt + C</kbd>
                    <span>Focus Copy button</span>
                </div>
                <div class="shortcut">
                    <kbd>Alt + H</kbd>
                    <span>Show this help</span>
                </div>
                <div class="shortcut">
                    <kbd>Escape</kbd>
                    <span>Close modals</span>
                </div>
                <div class="shortcut">
                    <kbd>Tab</kbd>
                    <span>Navigate between elements</span>
                </div>
                <div class="shortcut">
                    <kbd>Arrow Keys</kbd>
                    <span>Navigate radio button groups</span>
                </div>
            </div>
            <button class="close-help-btn">Close (Escape)</button>
        </div>
        <div class="help-modal-overlay"></div>
    `;
    
    document.body.appendChild(helpModal);
    
    // Focus the modal
    const closeBtn = helpModal.querySelector('.close-help-btn');
    closeBtn.focus();
    
    // Close handlers
    const closeHelp = () => {
        document.body.removeChild(helpModal);
        announceToScreenReader('Help closed');
    };
    
    closeBtn.addEventListener('click', closeHelp);
    helpModal.querySelector('.help-modal-overlay').addEventListener('click', closeHelp);
    
    helpModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeHelp();
        }
    });
}

function closeActiveModals() {
    const modals = document.querySelectorAll('.sharing-menu, .help-modal, .analysis-panel[style*="block"]');
    modals.forEach(modal => {
        if (modal.classList.contains('sharing-menu')) {
            window.SharingFeatures?.closeSharingMenu();
        } else if (modal.classList.contains('help-modal')) {
            modal.remove();
        } else if (modal.classList.contains('analysis-panel')) {
            modal.style.display = 'none';
        }
    });
}

// ===============================
// INITIALIZATION
// ===============================

function initializeAccessibilityFeatures() {
    // Create announcement region
    createAnnouncementRegion();
    
    // Enhance forms
    enhanceFormAccessibility();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Setup tooltips
    setupTooltips();
    
    // Setup progress indicators
    setupProgressIndicators();
    
    // Add accessibility CSS
    addAccessibilityStyles();
    
    console.log('Accessibility features initialized');
    announceToScreenReader('Sonnet Generator loaded. Press Alt+H for keyboard shortcuts.');
}

function addAccessibilityStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Skip links */
        .skip-links {
            position: absolute;
            top: -40px;
            left: 6px;
            z-index: 1000;
        }
        
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
        }
        
        .skip-link:focus {
            top: 6px;
        }
        
        /* Enhanced focus indicators */
        .keyboard-navigation *:focus {
            outline: 3px solid var(--color-secondary);
            outline-offset: 2px;
            border-radius: 4px;
        }
        
        /* Required field indicators */
        .required-indicator {
            color: var(--color-error);
            font-weight: bold;
        }
        
        /* Progress indicators */
        .progress-container {
            margin: var(--space-4) 0;
            text-align: center;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background-color: var(--color-border-light);
            border-radius: var(--radius-full);
            overflow: hidden;
            margin-bottom: var(--space-2);
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
        }
        
        /* Tooltips */
        .tooltip {
            position: absolute;
            background: var(--color-text-primary);
            color: var(--color-text-inverse);
            padding: var(--space-2) var(--space-3);
            border-radius: var(--radius-md);
            font-size: var(--font-size-sm);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            max-width: 250px;
        }
        
        .tooltip-visible {
            opacity: 1;
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: var(--color-text-primary);
        }
        
        /* Help modal */
        .help-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .help-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .help-modal-content {
            position: relative;
            background: var(--color-surface);
            padding: var(--space-8);
            border-radius: var(--radius-xl);
            max-width: 500px;
            width: 90%;
            box-shadow: var(--shadow-xl);
        }
        
        .shortcuts-list {
            margin: var(--space-6) 0;
        }
        
        .shortcut {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-2) 0;
            border-bottom: 1px solid var(--color-border-light);
        }
        
        .shortcut:last-child {
            border-bottom: none;
        }
        
        kbd {
            background: var(--color-border-light);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            padding: var(--space-1) var(--space-2);
            font-family: monospace;
            font-size: var(--font-size-sm);
        }
        
        .close-help-btn {
            width: 100%;
            padding: var(--space-3) var(--space-6);
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
        }
        
        /* Form instructions */
        .form-instructions {
            background: var(--color-background-alt);
            padding: var(--space-4);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-6);
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .tooltip {
                border: 2px solid currentColor;
            }
            
            .progress-bar {
                border: 1px solid currentColor;
            }
            
            .skip-link:focus {
                outline: 3px solid currentColor;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            initializeAccessibilityFeatures();
            console.log('Accessibility features initialized successfully');
        } catch (error) {
            console.error('Failed to initialize accessibility features:', error);
        }
    });
} else {
    try {
        initializeAccessibilityFeatures();
        console.log('Accessibility features initialized successfully');
    } catch (error) {
        console.error('Failed to initialize accessibility features:', error);
    }
}

// Export accessibility utilities
window.AccessibilityEnhancer = {
    announceToScreenReader,
    updateLiveRegion,
    showKeyboardShortcutsHelp,
    closeActiveModals
};

