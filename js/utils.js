// Utility Functions for Sonnet Generator
// Basic interactivity and UI state management

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sonnet Generator Utils loaded');
    
    try {
        initializeUI();
        setupEventListeners();
        loadUserPreferences();
        console.log('Sonnet Generator initialized successfully');
    } catch (error) {
        console.error('Error initializing Sonnet Generator:', error);
        // Don't show error modal for initialization errors
    }
});

// Initialize UI components
function initializeUI() {
    try {
        updateMoodDisplay();
    } catch (error) {
        console.warn('Failed to update mood display:', error);
    }
    
    try {
        initializeThemePreference();
    } catch (error) {
        console.warn('Failed to initialize theme preference:', error);
    }
    
    try {
        setupFormValidation();
    } catch (error) {
        console.warn('Failed to setup form validation:', error);
    }
    
    try {
        addFormValidationStyles();
    } catch (error) {
        console.warn('Failed to add form validation styles:', error);
    }
}

// Setup event listeners for interactive elements
function setupEventListeners() {
    try {
        setupMobileMenu();
    } catch (error) {
        console.warn('Failed to setup mobile menu:', error);
    }
    
    try {
        setupMoodSlider();
    } catch (error) {
        console.warn('Failed to setup mood slider:', error);
    }
    
    try {
        setupCopyToClipboard();
    } catch (error) {
        console.warn('Failed to setup copy to clipboard:', error);
    }
    
    try {
        setupFormSubmission();
    } catch (error) {
        console.warn('Failed to setup form submission:', error);
    }
    
    try {
        setupActionButtons();
    } catch (error) {
        console.warn('Failed to setup action buttons:', error);
    }
    
    try {
        setupSmoothScrolling();
    } catch (error) {
        console.warn('Failed to setup smooth scrolling:', error);
    }
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Ensure the target element is visible
                targetElement.style.display = 'block';
                targetElement.offsetHeight; // Force reflow
                
                // Scroll to the element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navigationMenu = document.querySelector('.navigation-menu');
    
    if (menuToggle && navigationMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navigationMenu.classList.toggle('show');
        });
    }
}

// Mood slider functionality
function setupMoodSlider() {
    const moodSlider = document.getElementById('mood-slider');
    
    if (moodSlider) {
        moodSlider.addEventListener('input', updateMoodDisplay);
        moodSlider.addEventListener('change', saveMoodPreference);
    }
}

function updateMoodDisplay() {
    const moodSlider = document.getElementById('mood-slider');
    const moodOutput = document.getElementById('mood-value');
    
    if (moodSlider && moodOutput) {
        const moods = ['Romantic', 'Melancholic', 'Uplifting', 'Mysterious'];
        const value = parseInt(moodSlider.value);
        moodOutput.textContent = moods[value] || 'Melancholic';
    }
}

function saveMoodPreference() {
    const moodSlider = document.getElementById('mood-slider');
    if (moodSlider && typeof Storage !== 'undefined') {
        localStorage.setItem('sonnet-mood-preference', moodSlider.value);
    }
}

// Copy to clipboard functionality
function setupCopyToClipboard() {
    const copyBtn = document.getElementById('copy-btn');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboard);
    }
}

async function copyToClipboard(textToCopy) {
    try {
        const fullText = textToCopy || `${document.getElementById('sonnet-title')?.textContent || 'Untitled Sonnet'}\n\n${Array.from(document.querySelectorAll('#sonnet-poem .poem-line')).map(line => line.textContent).join('\n')}\n\n- Generated by Sonnet Generator`;

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(fullText);
        } else {
            fallbackCopyToClipboard(fullText);
        }
        
        showCopyFeedback();
        
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        showCopyError();
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (error) {
        console.error('Fallback copy failed:', error);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    const copyBtn = document.getElementById('copy-btn');
    if (!copyBtn) return;
    
    const btnText = copyBtn.querySelector('.btn-text');
    const btnIcon = copyBtn.querySelector('.btn-icon');
    
    if (!btnText || !btnIcon) {
        console.warn('Copy button missing text or icon elements');
        return;
    }
    
    const originalText = btnText.textContent;
    const originalIcon = btnIcon.textContent;
    
    btnText.textContent = 'Copied!';
    btnIcon.textContent = '✅';
    copyBtn.style.backgroundColor = 'var(--color-success)';
    
    setTimeout(() => {
        if (btnText && btnIcon) {
            btnText.textContent = originalText;
            btnIcon.textContent = originalIcon;
            copyBtn.style.backgroundColor = '';
        }
    }, 2000);
}

function showCopyError() {
    const copyBtn = document.getElementById('copy-btn');
    if (!copyBtn) return;
    
    const btnText = copyBtn.querySelector('.btn-text');
    if (!btnText) {
        console.warn('Copy button missing text element');
        return;
    }
    
    const originalText = btnText.textContent;
    btnText.textContent = 'Error';
    copyBtn.style.backgroundColor = 'var(--color-error)';
    
    setTimeout(() => {
        if (btnText) {
            btnText.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }
    }, 2000);
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('sonnet-form');
    
    if (form) {
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });
    }
}

function validateField(event) {
    if (!event || !event.target) {
        console.warn('validateField: event or event.target is null');
        return false;
    }
    
    const field = event.target;
    if (!field || !field.value) {
        console.warn('validateField: field or field.value is null');
        return false;
    }
    
    const value = field.value.trim();
    
    if (field.hasAttribute && field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    if (!field) {
        console.warn('showFieldError: field is null or undefined');
        return;
    }
    
    clearFieldError(field);
    
    if (field.classList) {
        field.classList.add('error');
    }
    
    if (field.parentNode && field.parentNode.appendChild) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message || 'Error';
        field.parentNode.appendChild(errorElement);
    }
}

function clearFieldError(field) {
    if (!field) {
        console.warn('clearFieldError: field is null or undefined');
        return;
    }
    
    if (field.classList) {
        field.classList.remove('error');
    }
    
    if (field.parentNode && field.parentNode.querySelector) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError && existingError.remove) {
            existingError.remove();
        }
    }
}

// Form submission (placeholder for Phase 3)
function setupFormSubmission() {
    const form = document.getElementById('sonnet-form');
    const generateBtn = document.getElementById('generate-btn');
    
    if (form && generateBtn) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateForm()) {
                showLoadingState(generateBtn);
                
                setTimeout(() => {
                    hideLoadingState(generateBtn);
                    showPlaceholderSonnet();
                }, 2000);
            }
        });
    }
}

function validateForm() {
    const form = document.getElementById('sonnet-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function hideLoadingState(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

function showPlaceholderSonnet() {
    // Actually generate a real sonnet now
    if (typeof window.generateSonnetFromForm === 'function') {
        const result = window.generateSonnetFromForm();
        if (result) {
            // Show the generated content
            const placeholder = document.getElementById('output-placeholder');
            const sonnetContent = document.getElementById('sonnet-content');
            const outputActions = document.getElementById('output-actions');
            
            if (placeholder) placeholder.style.display = 'none';
            if (sonnetContent) sonnetContent.style.display = 'block';
            if (outputActions) outputActions.style.display = 'block';
            
            const outputSection = document.querySelector('.output-section');
            if (outputSection) {
                outputSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } else {
        // Fallback to placeholder
        const placeholder = document.getElementById('output-placeholder');
        const sonnetContent = document.getElementById('sonnet-content');
        const outputActions = document.getElementById('output-actions');
        
        if (placeholder) placeholder.style.display = 'none';
        if (sonnetContent) sonnetContent.style.display = 'block';
        if (outputActions) outputActions.style.display = 'block';
        
        const outputSection = document.querySelector('.output-section');
        if (outputSection) {
            outputSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Action buttons setup
function setupActionButtons() {
    const regenerateBtn = document.getElementById('regenerate-btn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            const generateBtn = document.getElementById('generate-btn');
            if (generateBtn) generateBtn.click();
        });
    }

    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', showSharingModal);
    }

    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadSonnet);

    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeSonnet);

    const printBtn = document.getElementById('print-btn');
    if (printBtn) printBtn.addEventListener('click', printSonnet);

    const closeAnalysisBtn = document.getElementById('close-analysis-btn');
    if (closeAnalysisBtn) closeAnalysisBtn.addEventListener('click', closeAnalysisPanel);
}

function shareContent() {
    const title = document.getElementById('sonnet-title')?.textContent || 'My Sonnet';
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out this beautiful sonnet I generated!',
            url: url
        }).catch(error => console.log('Error sharing:', error));
    } else {
        copyToClipboard();
    }
}

function downloadSonnet() {
    const title = document.getElementById('sonnet-title')?.textContent || 'Untitled Sonnet';
    const poemLines = Array.from(document.querySelectorAll('#sonnet-poem .poem-line'))
        .map(line => line.textContent)
        .join('\n');
    
    const content = `${title}\n\n${poemLines}\n\n- Generated by Sonnet Generator\n- ${new Date().toLocaleDateString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                const navigationMenu = document.querySelector('.navigation-menu');
                const menuToggle = document.querySelector('.mobile-menu-toggle');
                if (navigationMenu && menuToggle) {
                    navigationMenu.classList.remove('show');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

// Theme preference management
function initializeThemePreference() {
    if (typeof Storage !== 'undefined') {
        const savedTheme = localStorage.getItem('sonnet-theme-preference');
        if (savedTheme) {
            const themeSelect = document.getElementById('theme-select');
            if (themeSelect) themeSelect.value = savedTheme;
        }
    }
}

function loadUserPreferences() {
    if (typeof Storage !== 'undefined') {
        const savedMood = localStorage.getItem('sonnet-mood-preference');
        if (savedMood) {
            const moodSlider = document.getElementById('mood-slider');
            if (moodSlider) {
                moodSlider.value = savedMood;
                updateMoodDisplay();
            }
        }
        
        const savedComplexity = localStorage.getItem('sonnet-complexity-preference');
        if (savedComplexity) {
            const complexityToggle = document.getElementById('complexity-level');
            if (complexityToggle) {
                complexityToggle.checked = savedComplexity === 'advanced';
            }
        }
    }
}

// ===============================
// SYLLABLE AND METER SYSTEM
// ===============================

// Syllable counting for English words
function countSyllables(word) {
    if (!word || word.length === 0) return 0;
    
    word = word.toLowerCase().trim();
    
    // Handle common contractions
    const contractions = {
        "don't": 1, "can't": 1, "won't": 1, "shouldn't": 2,
        "wouldn't": 2, "couldn't": 2, "isn't": 2, "wasn't": 2,
        "aren't": 2, "weren't": 2, "haven't": 2, "hasn't": 2,
        "hadn't": 2, "doesn't": 2, "didn't": 2, "they're": 1,
        "we're": 1, "you're": 1, "it's": 1, "that's": 1,
        "there's": 1, "here's": 1, "what's": 1, "let's": 1,
        "i'm": 1, "i'll": 1, "i'd": 1, "i've": 1
    };
    
    if (contractions[word]) {
        return contractions[word];
    }
    
    // Remove punctuation
    word = word.replace(/[^a-z]/g, '');
    
    // Handle special cases
    if (word.length <= 3) return 1;
    
    // Count vowel groups
    let syllables = 0;
    let previousWasVowel = false;
    const vowels = 'aeiouy';
    
    for (let i = 0; i < word.length; i++) {
        const isVowel = vowels.includes(word[i]);
        
        if (isVowel && !previousWasVowel) {
            syllables++;
        }
        
        previousWasVowel = isVowel;
    }
    
    // Handle silent 'e'
    if (word.endsWith('e') && syllables > 1) {
        syllables--;
    }
    
    // Handle special endings
    if (word.endsWith('ed') && syllables > 1) {
        // Check if 'ed' forms a separate syllable
        const beforeEd = word.slice(-3, -2);
        if (!'td'.includes(beforeEd)) {
            syllables--;
        }
    }
    
    // Handle 'le' endings
    if (word.endsWith('le') && word.length > 2) {
        const beforeLe = word.slice(-3, -2);
        if (!'aeiou'.includes(beforeLe)) {
            syllables++;
        }
    }
    
    // Minimum of 1 syllable
    return Math.max(1, syllables);
}

// Count syllables in a line of text
function countLineSyllables(line) {
    if (!line || line.trim().length === 0) return 0;
    
    // Remove punctuation and split into words
    const words = line.toLowerCase()
        .replace(/[^\w\s']/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    let totalSyllables = 0;
    for (const word of words) {
        totalSyllables += countSyllables(word);
    }
    
    return totalSyllables;
}

// Check if line follows iambic pentameter (10 syllables, unstressed-stressed pattern)
function isIambicPentameter(line) {
    const syllableCount = countLineSyllables(line);
    
    // Must be exactly 10 syllables
    if (syllableCount !== 10) {
        return false;
    }
    
    // Additional checks for stress patterns could be added here
    // For now, we'll accept any 10-syllable line
    return true;
}

// Analyze stress pattern (simplified version)
function analyzeStressPattern(line) {
    const words = line.toLowerCase()
        .replace(/[^\w\s']/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    const stressPattern = [];
    
    for (const word of words) {
        const syllables = countSyllables(word);
        
        if (syllables === 1) {
            // Simple heuristic: short words are usually unstressed, longer ones stressed
            stressPattern.push(word.length > 3 ? 'S' : 'U');
        } else {
            // Multi-syllable words: usually stress on first or second syllable
            for (let i = 0; i < syllables; i++) {
                if (i === 0 && syllables > 2) {
                    stressPattern.push('S');
                } else if (i === 1 && syllables <= 2) {
                    stressPattern.push('S');
                } else {
                    stressPattern.push('U');
                }
            }
        }
    }
    
    return stressPattern;
}

// Validate line length (should be 10 syllables for sonnets)
function validateLineLength(line, targetSyllables = 10) {
    const syllables = countLineSyllables(line);
    return {
        isValid: syllables === targetSyllables,
        actual: syllables,
        target: targetSyllables,
        difference: syllables - targetSyllables
    };
}

// Check natural rhythm of a line
function checkRhythm(line) {
    const stressPattern = analyzeStressPattern(line);
    const syllableCount = stressPattern.length;
    
    // For iambic pentameter, we want alternating unstressed-stressed (U-S)
    let iambicScore = 0;
    for (let i = 0; i < syllableCount; i++) {
        const expected = i % 2 === 0 ? 'U' : 'S';
        if (stressPattern[i] === expected) {
            iambicScore++;
        }
    }
    
    return {
        pattern: stressPattern.join('-'),
        iambicScore: iambicScore,
        naturalness: iambicScore / Math.max(syllableCount, 1),
        isGoodRhythm: iambicScore >= syllableCount * 0.6 // 60% match is acceptable
    };
}

// Get rhyme sound from word ending
function getRhymeSound(word) {
    if (!word) return '';
    
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    
    // Common rhyme patterns
    const patterns = [
        { pattern: /ight$/, sound: 'ight' },
        { pattern: /ay$/, sound: 'ay' },
        { pattern: /ove$/, sound: 'ove' },
        { pattern: /art$/, sound: 'art' },
        { pattern: /ead$/, sound: 'ead' },
        { pattern: /ime$/, sound: 'ime' },
        { pattern: /eal$/, sound: 'eal' },
        { pattern: /ound$/, sound: 'ound' },
        { pattern: /ace$/, sound: 'ace' },
        { pattern: /ire$/, sound: 'ire' },
        { pattern: /ower$/, sound: 'ower' },
        { pattern: /eauty$/, sound: 'eauty' },
        { pattern: /orrow$/, sound: 'orrow' },
        { pattern: /ever$/, sound: 'ever' },
        { pattern: /onder$/, sound: 'onder' }
    ];
    
    for (const { pattern, sound } of patterns) {
        if (pattern.test(word)) {
            return sound;
        }
    }
    
    // Fallback: last 2-3 characters
    if (word.length >= 3) {
        return word.slice(-3);
    } else if (word.length >= 2) {
        return word.slice(-2);
    } else {
        return word;
    }
}

// Check if two words rhyme
function doWordsRhyme(word1, word2) {
    if (!word1 || !word2) return false;
    
    const sound1 = getRhymeSound(word1);
    const sound2 = getRhymeSound(word2);
    
    return sound1 === sound2 && sound1.length > 0;
}

// Validate rhyme scheme for a sonnet
function validateRhymeScheme(lines, scheme = 'shakespearean') {
    if (!lines || lines.length === 0) return { isValid: false, errors: ['No lines provided'] };
    
    const expectedSchemes = {
        shakespearean: ['A', 'B', 'A', 'B', 'C', 'D', 'C', 'D', 'E', 'F', 'E', 'F', 'G', 'G'],
        petrarchan: ['A', 'B', 'B', 'A', 'A', 'B', 'B', 'A', 'C', 'D', 'E', 'C', 'D', 'E']
    };
    
    const expected = expectedSchemes[scheme];
    if (!expected) {
        return { isValid: false, errors: ['Unknown rhyme scheme'] };
    }
    
    if (lines.length !== 14) {
        return { isValid: false, errors: [`Expected 14 lines, got ${lines.length}`] };
    }
    
    // Extract last words from each line
    const lastWords = lines.map(line => {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1]?.replace(/[.,!?;:]$/, '') || '';
    });
    
    // Group lines by rhyme scheme letter
    const rhymeGroups = {};
    for (let i = 0; i < expected.length; i++) {
        const letter = expected[i];
        if (!rhymeGroups[letter]) {
            rhymeGroups[letter] = [];
        }
        rhymeGroups[letter].push({ index: i, word: lastWords[i] });
    }
    
    // Check that words in each group rhyme with each other
    const errors = [];
    for (const [letter, group] of Object.entries(rhymeGroups)) {
        if (group.length < 2) continue;
        
        for (let i = 1; i < group.length; i++) {
            if (!doWordsRhyme(group[0].word, group[i].word)) {
                errors.push(`Lines ${group[0].index + 1} and ${group[i].index + 1} should rhyme (${letter}): "${group[0].word}" and "${group[i].word}"`);
            }
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        rhymeGroups: rhymeGroups,
        actualScheme: expected,
        lastWords: lastWords
    };
}

// ===============================
// ADVANCED USER FEATURES
// ===============================

// Save/Load functionality using localStorage
function saveSonnet(sonnet, title) {
    try {
        const savedSonnets = getSavedSonnets();
        const sonnetData = {
            id: Date.now().toString(),
            title: title || 'Untitled Sonnet',
            lines: sonnet.lines,
            theme: sonnet.theme,
            mood: sonnet.mood,
            sonnetType: sonnet.sonnetType,
            quality: sonnet.quality,
            timestamp: new Date().toISOString(),
            favorite: false
        };
        
        savedSonnets.push(sonnetData);
        localStorage.setItem('saved-sonnets', JSON.stringify(savedSonnets));
        
        showSaveConfirmation(sonnetData.title);
        return sonnetData.id;
    } catch (error) {
        console.error('Failed to save sonnet:', error);
        showSaveError('Failed to save sonnet. Storage may be full.');
        return null;
    }
}

function getSavedSonnets() {
    try {
        const saved = localStorage.getItem('saved-sonnets');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load saved sonnets:', error);
        return [];
    }
}

function deleteSonnet(sonnetId) {
    try {
        const savedSonnets = getSavedSonnets();
        const filtered = savedSonnets.filter(s => s.id !== sonnetId);
        localStorage.setItem('saved-sonnets', JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Failed to delete sonnet:', error);
        return false;
    }
}

function toggleFavorite(sonnetId) {
    try {
        const savedSonnets = getSavedSonnets();
        const sonnet = savedSonnets.find(s => s.id === sonnetId);
        if (sonnet) {
            sonnet.favorite = !sonnet.favorite;
            localStorage.setItem('saved-sonnets', JSON.stringify(savedSonnets));
            return sonnet.favorite;
        }
        return false;
    } catch (error) {
        console.error('Failed to toggle favorite:', error);
        return false;
    }
}

function exportSonnetsCollection(format = 'txt') {
    const savedSonnets = getSavedSonnets();
    if (savedSonnets.length === 0) {
        alert('No saved sonnets to export.');
        return;
    }
    
    let content = '';
    const timestamp = new Date().toLocaleDateString();
    
    if (format === 'txt') {
        content = `My Sonnet Collection\nGenerated by Sonnet Generator - ${timestamp}\n${'='.repeat(50)}\n\n`;
        
        savedSonnets.forEach((sonnet, index) => {
            content += `${index + 1}. ${sonnet.title}\n`;
            content += `Theme: ${sonnet.theme} | Mood: ${sonnet.mood} | Type: ${sonnet.sonnetType}\n`;
            content += `Created: ${new Date(sonnet.timestamp).toLocaleDateString()}\n`;
            content += `${'-'.repeat(30)}\n`;
            content += sonnet.lines.join('\n') + '\n\n';
        });
    }
    
    downloadTextFile(content, `sonnet-collection-${timestamp}.txt`);
}

// Batch generation functionality
function generateMultipleSonnets(count, options) {
    const results = [];
    const generator = new window.SonnetGenerator();
    
    for (let i = 0; i < count; i++) {
        // Vary options slightly for each sonnet
        const variedOptions = { ...options };
        if (Math.random() < 0.3) {
            const themes = ['love', 'nature', 'time', 'beauty', 'loss', 'hope'];
            variedOptions.theme = themes[Math.floor(Math.random() * themes.length)];
        }
        
        const result = generator.generate(variedOptions);
        results.push(result);
    }
    
    return results;
}

// Advanced customization
function createCustomTheme(name, words) {
    try {
        const customThemes = getCustomThemes();
        customThemes[name] = {
            nouns: words.nouns || [],
            adjectives: words.adjectives || [],
            verbs: words.verbs || [],
            created: new Date().toISOString()
        };
        localStorage.setItem('custom-themes', JSON.stringify(customThemes));
        return true;
    } catch (error) {
        console.error('Failed to save custom theme:', error);
        return false;
    }
}

function getCustomThemes() {
    try {
        const themes = localStorage.getItem('custom-themes');
        return themes ? JSON.parse(themes) : {};
    } catch (error) {
        return {};
    }
}

// Sonnet analysis functionality
function analyzeSonnet(sonnet) {
    const analysis = {
        structure: {
            lineCount: sonnet.lines.length,
            sonnetType: sonnet.sonnetType,
            rhymeScheme: sonnet.rhymeScheme
        },
        meter: {
            syllableCounts: sonnet.lines.map(line => window.PoetryUtils.countLineSyllables(line)),
            iambicPentameter: sonnet.lines.map(line => window.PoetryUtils.isIambicPentameter(line)),
            rhythmScores: sonnet.lines.map(line => window.PoetryUtils.checkRhythm(line))
        },
        rhyme: window.PoetryUtils.validateRhymeScheme(sonnet.lines, sonnet.sonnetType),
        quality: sonnet.quality,
        wordStats: {
            totalWords: sonnet.lines.join(' ').split(/\s+/).length,
            uniqueWords: new Set(sonnet.lines.join(' ').toLowerCase().split(/\s+/)).size,
            averageWordsPerLine: sonnet.lines.join(' ').split(/\s+/).length / sonnet.lines.length
        }
    };
    
    // Calculate overall meter compliance
    const validLines = analysis.meter.iambicPentameter.filter(Boolean).length;
    analysis.meter.compliance = validLines / sonnet.lines.length;
    
    return analysis;
}

// User preferences management
function saveAdvancedPreferences(preferences) {
    try {
        localStorage.setItem('advanced-preferences', JSON.stringify(preferences));
        return true;
    } catch (error) {
        console.error('Failed to save preferences:', error);
        return false;
    }
}

function getAdvancedPreferences() {
    try {
        const prefs = localStorage.getItem('advanced-preferences');
        return prefs ? JSON.parse(prefs) : {
            autoSave: false,
            showAnalysis: true,
            defaultTheme: 'love',
            vocabularyLevel: 'mixed',
            generationCount: 1,
            showQualityMetrics: false
        };
    } catch (error) {
        return {};
    }
}

// UI feedback functions
function showSaveConfirmation(title) {
    const message = document.createElement('div');
    message.className = 'save-notification success';
    message.innerHTML = `
        <span class="notification-icon">✅</span>
        <span class="notification-text">Saved "${title}" successfully!</span>
    `;
    
    document.body.appendChild(message);
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(message), 300);
    }, 3000);
}

function showSaveError(errorMessage) {
    const message = document.createElement('div');
    message.className = 'save-notification error';
    message.innerHTML = `
        <span class="notification-icon">❌</span>
        <span class="notification-text">${errorMessage}</span>
    `;
    
    document.body.appendChild(message);
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(message), 300);
    }, 4000);
}

// Generation history
let generationHistory = [];

function addToHistory(sonnet) {
    generationHistory.unshift({
        ...sonnet,
        timestamp: Date.now()
    });
    
    // Keep only last 20 generations
    if (generationHistory.length > 20) {
        generationHistory = generationHistory.slice(0, 20);
    }
}

function getGenerationHistory() {
    return generationHistory;
}

function clearGenerationHistory() {
    generationHistory = [];
}

// Export poetry utility functions
window.PoetryUtils = {
    countSyllables,
    countLineSyllables,
    isIambicPentameter,
    analyzeStressPattern,
    validateLineLength,
    checkRhythm,
    getRhymeSound,
    doWordsRhyme,
    validateRhymeScheme
};

// Export advanced features
window.AdvancedFeatures = {
    saveSonnet,
    getSavedSonnets,
    deleteSonnet,
    toggleFavorite,
    exportSonnetsCollection,
    generateMultipleSonnets,
    createCustomTheme,
    getCustomThemes,
    analyzeSonnet,
    saveAdvancedPreferences,
    getAdvancedPreferences,
    addToHistory,
    getGenerationHistory,
    clearGenerationHistory
};

// Function to add form validation CSS
function addFormValidationStyles() {
    // Check if styles are already added
    if (document.getElementById('form-validation-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'form-validation-styles';
    style.textContent = `
        .form-input.error,
        .form-select.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
        
        .field-error {
            color: var(--color-error);
            font-size: var(--font-size-xs);
            margin-top: var(--space-1);
            font-weight: var(--font-weight-medium);
        }
    `;
    
    if (document.head) {
        document.head.appendChild(style);
    }
}

// Sharing Modal Functions
function showSharingModal() {
    const modal = document.getElementById('sharing-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const closeBtn = modal.querySelector('.close-modal-btn');
        if (closeBtn) closeBtn.focus();
    }
}

function closeSharingModal() {
    const modal = document.getElementById('sharing-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Return focus to share button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.focus();
    }
}

function shareToFacebook() {
    const sonnetData = getSonnetData();
    if (!sonnetData.title || sonnetData.poemLines.length === 0) {
        alert('Please generate a sonnet before sharing.');
        closeSharingModal();
        return;
    }

    const shareText = `${sonnetData.title}\n\n${sonnetData.fullText}\n\n- Generated by Sonnet Generator`;
    const encodedQuote = encodeURIComponent(shareText);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodedQuote}`;
    
    window.open(facebookUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
    closeSharingModal();
}

function shareToTwitter() {
    const sonnetData = getSonnetData();
    if (!sonnetData.title || sonnetData.poemLines.length === 0) {
        alert('Please generate a sonnet before sharing.');
        closeSharingModal();
        return;
    }

    const text = `${sonnetData.title}\n\n${sonnetData.fullText}\n\n#SonnetGenerator #AI #Poetry`;
    const encodedText = encodeURIComponent(text);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
    closeSharingModal();
}

function shareToInstagram() {
    const sonnetData = getSonnetData();
    if (!sonnetData.title || sonnetData.poemLines.length === 0) {
        alert('Please generate a sonnet before sharing.');
        closeSharingModal();
        return;
    }

    const text = `${sonnetData.title}\n\n${sonnetData.fullText}\n\n#SonnetGenerator #AI #Poetry`;
    
    copyToClipboard(text);
    alert('The sonnet has been copied to your clipboard. You can now paste it into Instagram.');
    closeSharingModal();
}

function shareToLinkedIn() {
    try {
        const title = document.getElementById('sonnet-title')?.textContent || 'My Sonnet';
        const poemLines = Array.from(document.querySelectorAll('#sonnet-poem .poem-line'))
            .map(line => line.textContent.trim())
            .filter(line => line)
            .join('\n');
        
        const shareUrl = window.location.href;
        const summary = `${title}\n\n${poemLines}\n\n- Generated by Sonnet Generator`;
        
        // LinkedIn share URL format
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(title);
        const encodedSummary = encodeURIComponent(summary);
        
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
        
        console.log('LinkedIn share URL:', linkedInUrl);
        console.log('Share summary:', summary);
        
        const popup = window.open(linkedInUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        
        if (!popup) {
            console.warn('Popup blocked - falling back to copy to clipboard');
            copyToClipboard();
            alert('Popup was blocked. The sonnet has been copied to your clipboard instead.');
        }
        
        closeSharingModal();
    } catch (error) {
        console.error('Error sharing to LinkedIn:', error);
        alert('Failed to share to LinkedIn. Please try copying the sonnet manually.');
        closeSharingModal();
    }
}

function shareViaEmail() {
    try {
        if (!validateSonnetContent()) {
            closeSharingModal();
            return;
        }
        
        const sonnetData = getSonnetData();
        const subject = `Check out this sonnet: ${sonnetData.title}`;
        const emailBody = `I wanted to share this beautiful sonnet with you:\n\n${sonnetData.title}\n\n${sonnetData.fullText}\n\n- Generated by Sonnet Generator\n\nView online: ${sonnetData.shareUrl}`;
        
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(emailBody);
        
        const mailtoUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
        
        console.log('Email share URL length:', mailtoUrl.length);
        console.log('Email subject:', subject);
        console.log('Email body length:', emailBody.length);
        
        // Check if the URL is too long (some email clients have limits)
        if (mailtoUrl.length > 2000) {
            console.warn('Email URL is too long, using simplified version');
            const simplifiedBody = `Check out this sonnet: ${sonnetData.title}\n\nView online: ${sonnetData.shareUrl}`;
            const simplifiedMailto = `mailto:?subject=${encodedSubject}&body=${encodeURIComponent(simplifiedBody)}`;
            console.log('Simplified email URL length:', simplifiedMailto.length);
            window.location.href = simplifiedMailto;
        } else {
            window.location.href = mailtoUrl;
        }
        
        showShareFeedback('Opening email client...');
        closeSharingModal();
    } catch (error) {
        console.error('Error sharing via email:', error);
        showShareFeedback('Failed to open email client. Try copying manually.', true);
        closeSharingModal();
    }
}

function copyLink() {
    try {
        const url = window.location.href;
        
        console.log('Copying link:', url);
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => {
                console.log('Successfully copied link to clipboard');
                showCopyFeedback('Link copied to clipboard!');
            }).catch((error) => {
                console.error('Clipboard API failed:', error);
                fallbackCopyToClipboard(url);
                showCopyFeedback('Link copied to clipboard!');
            });
        } else {
            console.log('Using fallback copy method for link');
            fallbackCopyToClipboard(url);
            showCopyFeedback('Link copied to clipboard!');
        }
        
        closeSharingModal();
    } catch (error) {
        console.error('Error copying link:', error);
        alert('Failed to copy link. Please copy the URL manually from your browser.');
        closeSharingModal();
    }
}

// Analysis Functions
function analyzeSonnet() {
    const title = document.getElementById('sonnet-title')?.textContent || 'Untitled Sonnet';
    const poemLines = Array.from(document.querySelectorAll('#sonnet-poem .poem-line'))
        .map(line => line.textContent);
    const sonnetType = document.getElementById('sonnet-type-display')?.textContent || 'Unknown';
    const theme = document.getElementById('sonnet-theme-display')?.textContent || 'Unknown';
    
    if (poemLines.length === 0) return;
    
    const analysis = performSonnetAnalysis(poemLines, sonnetType, theme);
    displayAnalysis(analysis);
    
    const analysisPanel = document.getElementById('analysis-panel');
    if (analysisPanel) {
        analysisPanel.style.display = 'block';
        analysisPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

function performSonnetAnalysis(lines, type, theme) {
    const analysis = {
        structure: analyzeStructure(lines, type),
        rhythm: analyzeRhythm(lines),
        themes: analyzeThemes(lines, theme),
        literary: analyzeLiteraryDevices(lines),
        emotion: analyzeEmotion(lines)
    };
    
    return analysis;
}

function analyzeStructure(lines, type) {
    const lineCount = lines.length;
    const avgWordsPerLine = lines.reduce((sum, line) => sum + line.split(' ').length, 0) / lineCount;
    const avgSyllablesPerLine = lines.reduce((sum, line) => sum + estimateSyllables(line), 0) / lineCount;
    
    return {
        lineCount,
        avgWordsPerLine: Math.round(avgWordsPerLine * 10) / 10,
        avgSyllablesPerLine: Math.round(avgSyllablesPerLine * 10) / 10,
        type,
        adherence: avgSyllablesPerLine >= 9 && avgSyllablesPerLine <= 11 ? 'Good' : 'Needs improvement'
    };
}

function analyzeRhythm(lines) {
    const stressed = lines.map(line => {
        const syllables = estimateSyllables(line);
        return syllables >= 9 && syllables <= 11 ? 'Regular' : 'Irregular';
    });
    
    const regularCount = stressed.filter(s => s === 'Regular').length;
    const rhythmScore = (regularCount / lines.length) * 100;
    
    return {
        rhythmScore: Math.round(rhythmScore),
        assessment: rhythmScore >= 80 ? 'Excellent' : rhythmScore >= 60 ? 'Good' : 'Needs work',
        details: stressed
    };
}

function analyzeThemes(lines, primaryTheme) {
    const text = lines.join(' ').toLowerCase();
    const themeWords = {
        love: ['love', 'heart', 'dear', 'beloved', 'passion', 'romance', 'kiss', 'tender'],
        nature: ['sun', 'moon', 'tree', 'flower', 'wind', 'sea', 'sky', 'earth', 'season'],
        time: ['time', 'age', 'year', 'day', 'moment', 'eternal', 'forever', 'fleeting'],
        beauty: ['beauty', 'fair', 'lovely', 'grace', 'elegant', 'divine', 'radiant'],
        loss: ['loss', 'grief', 'sorrow', 'pain', 'farewell', 'memory', 'absence']
    };
    
    const detected = Object.entries(themeWords).map(([theme, words]) => {
        const count = words.filter(word => text.includes(word)).length;
        return { theme, count, percentage: Math.round((count / words.length) * 100) };
    }).filter(t => t.count > 0).sort((a, b) => b.count - a.count);
    
    return {
        primary: primaryTheme,
        detected: detected.slice(0, 3),
        thematicRichness: detected.length >= 2 ? 'Rich' : 'Focused'
    };
}

function analyzeLiteraryDevices(lines) {
    const text = lines.join(' ').toLowerCase();
    const devices = [];
    
    // Check for alliteration (simplified)
    const words = text.split(' ');
    let alliterationCount = 0;
    for (let i = 0; i < words.length - 1; i++) {
        if (words[i][0] === words[i + 1][0]) alliterationCount++;
    }
    if (alliterationCount > 0) devices.push(`Alliteration (${alliterationCount} instances)`);
    
    // Check for metaphor indicators
    const metaphorWords = ['like', 'as', 'is', 'are', 'becomes', 'transforms'];
    const metaphorCount = metaphorWords.filter(word => text.includes(word)).length;
    if (metaphorCount > 0) devices.push(`Metaphorical language (${metaphorCount} indicators)`);
    
    // Check for repetition
    const uniqueWords = new Set(words);
    const repetitionRatio = (words.length - uniqueWords.size) / words.length;
    if (repetitionRatio > 0.1) devices.push('Repetition for emphasis');
    
    return devices.length > 0 ? devices : ['Direct, clear imagery'];
}

function analyzeEmotion(lines) {
    const text = lines.join(' ').toLowerCase();
    const emotions = {
        joy: ['joy', 'happy', 'bright', 'smile', 'laugh', 'delight', 'glad', 'cheer'],
        melancholy: ['sad', 'sorrow', 'tear', 'weep', 'mourn', 'lament', 'grief', 'dark'],
        love: ['love', 'adore', 'cherish', 'tender', 'sweet', 'dear', 'beloved'],
        wonder: ['wonder', 'awe', 'marvel', 'mystery', 'magic', 'divine', 'sublime'],
        longing: ['yearn', 'long', 'desire', 'wish', 'dream', 'hope', 'seek']
    };
    
    const detected = Object.entries(emotions).map(([emotion, words]) => {
        const count = words.filter(word => text.includes(word)).length;
        return { emotion, count };
    }).filter(e => e.count > 0).sort((a, b) => b.count - a.count);
    
    const primaryEmotion = detected[0]?.emotion || 'contemplative';
    const intensity = detected.reduce((sum, e) => sum + e.count, 0);
    
    return {
        primary: primaryEmotion,
        intensity: intensity > 3 ? 'High' : intensity > 1 ? 'Moderate' : 'Subtle',
        range: detected.length > 2 ? 'Complex' : 'Focused'
    };
}

function estimateSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllables = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
        const isVowel = vowels.includes(word[i]);
        if (isVowel && !previousWasVowel) syllables++;
        previousWasVowel = isVowel;
    }
    
    if (word.endsWith('e')) syllables--;
    return Math.max(1, syllables);
}

function displayAnalysis(analysis) {
    const content = document.getElementById('analysis-content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="analysis-section">
            <h5>Structure Analysis</h5>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <span class="analysis-label">Line Count:</span>
                    <span class="analysis-value">${analysis.structure.lineCount}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Avg. Syllables/Line:</span>
                    <span class="analysis-value">${analysis.structure.avgSyllablesPerLine}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Meter Adherence:</span>
                    <span class="analysis-value">${analysis.structure.adherence}</span>
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h5>Rhythm & Meter</h5>
            <div class="analysis-item">
                <span class="analysis-label">Rhythm Score:</span>
                <span class="analysis-value">${analysis.rhythm.rhythmScore}% (${analysis.rhythm.assessment})</span>
            </div>
        </div>
        
        <div class="analysis-section">
            <h5>Thematic Content</h5>
            <div class="analysis-item">
                <span class="analysis-label">Primary Theme:</span>
                <span class="analysis-value">${analysis.themes.primary}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Thematic Richness:</span>
                <span class="analysis-value">${analysis.themes.thematicRichness}</span>
            </div>
            ${analysis.themes.detected.length > 0 ? `
                <div class="analysis-item">
                    <span class="analysis-label">Detected Themes:</span>
                    <span class="analysis-value">${analysis.themes.detected.map(t => t.theme).join(', ')}</span>
                </div>
            ` : ''}
        </div>
        
        <div class="analysis-section">
            <h5>Literary Devices</h5>
            <div class="analysis-item">
                <span class="analysis-label">Devices Used:</span>
                <span class="analysis-value">${analysis.literary.join(', ')}</span>
            </div>
        </div>
        
        <div class="analysis-section">
            <h5>Emotional Tone</h5>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <span class="analysis-label">Primary Emotion:</span>
                    <span class="analysis-value">${analysis.emotion.primary}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Intensity:</span>
                    <span class="analysis-value">${analysis.emotion.intensity}</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">Emotional Range:</span>
                    <span class="analysis-value">${analysis.emotion.range}</span>
                </div>
            </div>
        </div>
    `;
}

function closeAnalysisPanel() {
    const panel = document.getElementById('analysis-panel');
    if (panel) {
        panel.style.display = 'none';
        
        // Return focus to analyze button
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) analyzeBtn.focus();
    }
}

// Print Function
function printSonnet() {
    const title = document.getElementById('sonnet-title')?.textContent || 'Untitled Sonnet';
    const poemLines = Array.from(document.querySelectorAll('#sonnet-poem .poem-line'))
        .map(line => line.textContent);
    const sonnetType = document.getElementById('sonnet-type-display')?.textContent || '';
    const theme = document.getElementById('sonnet-theme-display')?.textContent || '';
    const rhymeScheme = document.getElementById('rhyme-scheme-display')?.textContent || '';
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title} - Print</title>
            <style>
                body {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    line-height: 1.6;
                    color: #333;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 10px;
                    color: #2c3e50;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }
                .meta {
                    text-align: center;
                    margin-bottom: 30px;
                    color: #666;
                    font-style: italic;
                }
                .poem {
                    margin: 30px 0;
                    padding: 20px;
                    border-left: 4px solid #3498db;
                    background-color: #f8f9fa;
                }
                .poem-line {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 16px;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                @media print {
                    body {
                        padding: 20px;
                    }
                    .footer {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="meta">
                ${sonnetType} Sonnet • ${theme} • ${rhymeScheme}
            </div>
            <div class="poem">
                ${poemLines.map(line => `<span class="poem-line">${line}</span>`).join('')}
            </div>
            <div class="footer">
                Generated by Sonnet Generator • ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Small delay to ensure content is loaded before printing
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Helper function to validate if we have sonnet content before sharing
function validateSonnetContent() {
    const title = document.getElementById('sonnet-title')?.textContent;
    const poemLines = document.querySelectorAll('#sonnet-poem .poem-line');
    
    if (!title || title === 'Untitled Sonnet' || poemLines.length === 0) {
        console.warn('No sonnet content found for sharing');
        alert('Please generate a sonnet first before sharing.');
        return false;
    }
    
    return true;
}

// Helper function to get clean sonnet data
function getSonnetData() {
    const title = document.getElementById('sonnet-title')?.textContent || 'My Sonnet';
    const poemLines = Array.from(document.querySelectorAll('#sonnet-poem .poem-line'))
        .map(line => line.textContent.trim())
        .filter(line => line && line.length > 0);
    
    const shareUrl = window.location.href;
    
    return {
        title,
        poemLines,
        shareUrl,
        fullText: poemLines.join('\n'),
        lineCount: poemLines.length
    };
}

// Show notification for sharing feedback
function showShareFeedback(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = isError ? 'error-notification' : 'success-notification';
    notification.textContent = message;
    notification.setAttribute('aria-live', 'polite');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 4000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
