// Sonnet Generator Core Logic
// Complete sonnet generation system with templates and algorithms

console.log('Sonnet Generator JS loaded - Phase 3 implementation');

// Helper function to show generation errors
function showGenerationError(message) {
    const errorElement = document.getElementById('generation-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        alert(message); // Fallback if error element doesn't exist
    }
}

// Helper function to show sonnet content
function showSonnetContent() {
    const placeholder = document.getElementById('output-placeholder');
    const content = document.getElementById('sonnet-content');
    const actions = document.getElementById('output-actions');
    
    if (placeholder) placeholder.style.display = 'none';
    if (content) content.style.display = 'block';
    if (actions) actions.style.display = 'flex';
}

// Sentence templates for different types
const SENTENCE_TEMPLATES = {
    declarative: [
        "The {ADJECTIVE} {NOUN} {VERB} in {TIME_PLACE}",
        "{PRONOUN} {VERB} the {ADJECTIVE} {NOUN} of {ABSTRACT_NOUN}",
        "When {NOUN} {VERB}, {PRONOUN} {VERB} with {EMOTION}",
        "Through {TIME_PLACE}, {PRONOUN} {VERB} {ADVERB}",
        "In {TIME_PLACE}, {ARTICLE} {ADJECTIVE} {NOUN} {VERB}",
        "The {NOUN} of {ABSTRACT_NOUN} {VERB} {ADVERB}",
        "{ADJECTIVE} {NOUN} {VERB} like {COMPARISON}",
        "With {ADJECTIVE} {NOUN}, {PRONOUN} {VERB}",
        "As {TIME_CONDITION}, {PRONOUN} {VERB} {OBJECT}",
        "Beyond {PLACE}, {PRONOUN} {VERB} {ADJECTIVE} {NOUN}"
    ],
    
    interrogative: [
        "What {ADJECTIVE} {NOUN} can {VERB} the {ABSTRACT_NOUN}?",
        "How can {PRONOUN} {VERB} when {CONDITION}?",
        "Where {VERB} the {ADJECTIVE} {NOUN} of {TIME}?",
        "Why {VERB} {PRONOUN} {ADVERB} in {TIME_PLACE}?",
        "When will {PRONOUN} {VERB} {ADJECTIVE} {NOUN}?",
        "Who can {VERB} the {NOUN} of {ABSTRACT_NOUN}?"
    ],
    
    exclamatory: [
        "How {ADJECTIVE} the {NOUN} {VERB}!",
        "What {ADJECTIVE} {NOUN} {PRONOUN} {VERB}!",
        "O {ADJECTIVE} {NOUN} of {ABSTRACT_NOUN}!",
        "Behold the {ADJECTIVE} {NOUN} that {VERB}!",
        "Alas! {PRONOUN} {VERB} {ADVERB}!"
    ]
};

// Rhyme scheme patterns
const RHYME_SCHEMES = {
    shakespearean: {
        pattern: ['A', 'B', 'A', 'B', 'C', 'D', 'C', 'D', 'E', 'F', 'E', 'F', 'G', 'G'],
        structure: {
            quatrain1: [0, 1, 2, 3],
            quatrain2: [4, 5, 6, 7],
            quatrain3: [8, 9, 10, 11],
            couplet: [12, 13]
        }
    },
    
    petrarchan: {
        pattern: ['A', 'B', 'B', 'A', 'A', 'B', 'B', 'A', 'C', 'D', 'E', 'C', 'D', 'E'],
        structure: {
            octave: [0, 1, 2, 3, 4, 5, 6, 7],
            sestet: [8, 9, 10, 11, 12, 13]
        }
    }
};

// Utility functions
function selectRandomWord(wordArray) {
    if (!wordArray || wordArray.length === 0) return '';
    return wordArray[Math.floor(Math.random() * wordArray.length)];
}

function generateWordSlots(template, vocabulary, archaic = false) {
    const slots = {
        '{ARTICLE}': ['the', 'a', 'an'],
        '{PRONOUN}': archaic ? ['thou', 'thee', 'I', 'we'] : ['you', 'I', 'we', 'they', 'he', 'she'],
        '{ADJECTIVE}': vocabulary.adjectives || [],
        '{NOUN}': vocabulary.nouns || [],
        '{VERB}': vocabulary.verbs || [],
        '{ABSTRACT_NOUN}': vocabulary.nouns || [],
        '{ADVERB}': ['softly', 'gently', 'sweetly', 'deeply', 'truly', 'ever', 'still'],
        '{TIME}': ['dawn', 'dusk', 'night', 'day', 'spring', 'winter', 'summer'],
        '{PLACE}': ['garden', 'meadow', 'sky', 'sea', 'forest', 'mountain'],
        '{TIME_PLACE}': ['the morning', 'the evening', 'the garden', 'my heart', 'the sky'],
        '{TIME_CONDITION}': ['dawn breaks', 'night falls', 'spring comes', 'winter ends'],
        '{EMOTION}': ['joy', 'sorrow', 'love', 'hope', 'longing', 'peace'],
        '{COMPARISON}': ['a rose', 'the wind', 'a star', 'the sun', 'a dream'],
        '{CONDITION}': ['love is near', 'hope is lost', 'time stands still'],
        '{OBJECT}': ['my heart', 'thy hand', 'the world', 'this dream']
    };
    
    return slots;
}

function fillTemplate(template, slots) {
    let result = template;
    
    for (const [placeholder, options] of Object.entries(slots)) {
        if (result.includes(placeholder)) {
            const replacement = selectRandomWord(options);
            result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
        }
    }
    
    return result;
}

// Quality control functions
function checkCoherence(line, theme) {
    const themeWords = window.WordBanks.getWordsByCategory(theme, 'nouns', 'simple')
        .concat(window.WordBanks.getWordsByCategory(theme, 'adjectives', 'simple'))
        .concat(window.WordBanks.getWordsByCategory(theme, 'verbs', 'simple'));
    
    const lineWords = line.toLowerCase().split(/\s+/);
    const themeWordCount = lineWords.filter(word => 
        themeWords.some(themeWord => word.includes(themeWord) || themeWord.includes(word))
    ).length;
    
    return {
        coherent: themeWordCount > 0,
        score: themeWordCount / Math.max(lineWords.length, 1),
        themeWords: themeWordCount
    };
}

function validateGrammar(line) {
    const words = line.split(/\s+/);
    if (words.length < 3) return { valid: false, reason: 'Too short' };
    
    const hasVerb = words.some(word => {
        const verbs = ['is', 'are', 'was', 'were', 'be', 'being', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'];
        return verbs.includes(word.toLowerCase()) || word.endsWith('ing') || word.endsWith('ed') || word.endsWith('s');
    });
    
    return {
        valid: hasVerb,
        reason: hasVerb ? 'Good' : 'No verb detected',
        wordCount: words.length
    };
}

function checkRepetition(lines) {
    const wordCounts = {};
    const allWords = lines.join(' ').toLowerCase().split(/\s+/);
    
    for (const word of allWords) {
        if (word.length > 3) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
    }
    
    const repetitions = Object.entries(wordCounts)
        .filter(([word, count]) => count > 2)
        .map(([word, count]) => ({ word, count }));
    
    return {
        hasRepetition: repetitions.length > 0,
        repetitions: repetitions,
        score: 1 - (repetitions.length / Math.max(Object.keys(wordCounts).length, 1))
    };
}

function assessFlow(lines) {
    let flowScore = 0;
    let totalLines = lines.length;
    
    for (const line of lines) {
        const rhythm = window.PoetryUtils.checkRhythm(line);
        const syllables = window.PoetryUtils.validateLineLength(line);
        
        if (rhythm.isGoodRhythm) flowScore += 0.5;
        if (syllables.isValid) flowScore += 0.5;
    }
    
    return {
        score: flowScore / totalLines,
        naturalRhythm: flowScore / totalLines > 0.6,
        averageFlow: flowScore / totalLines
    };
}

// Main generation class
class SonnetGenerator {
    constructor() {
        this.maxAttempts = 10;
        this.qualityThreshold = 0.6;
    }
    
    generate(options) {
        const {
            theme = 'love',
            mood = 'romantic',
            complexity = 'simple',
            sonnetType = 'shakespearean',
            customWords = []
        } = options;
        
        console.log('Generating sonnet with options:', options);
        
        const vocabulary = this.buildVocabulary(theme, mood, complexity, customWords);
        const rhymeScheme = RHYME_SCHEMES[sonnetType];
        const lines = this.generateLines(vocabulary, rhymeScheme, complexity);
        const quality = this.assessQuality(lines, theme);
        
        return {
            lines: lines,
            theme: theme,
            mood: mood,
            sonnetType: sonnetType,
            rhymeScheme: rhymeScheme.pattern,
            quality: quality,
            metadata: {
                syllableCounts: lines.map(line => window.PoetryUtils.countLineSyllables(line)),
                rhymeValidation: window.PoetryUtils.validateRhymeScheme(lines, sonnetType),
                totalWords: lines.join(' ').split(/\s+/).length
            }
        };
    }
    
    buildVocabulary(theme, mood, complexity, customWords) {
        const vocabulary = window.WordBanks.getCombinedVocabulary(theme, mood, complexity);
        
        if (customWords && customWords.length > 0) {
            const customWordsArray = customWords
                .split(',')
                .map(word => word.trim())
                .filter(word => word.length > 0);
            
            vocabulary.nouns = [...vocabulary.nouns, ...customWordsArray];
            vocabulary.adjectives = [...vocabulary.adjectives, ...customWordsArray];
            vocabulary.verbs = [...vocabulary.verbs, ...customWordsArray];
        }
        
        return vocabulary;
    }
    
    generateLines(vocabulary, rhymeScheme, complexity) {
        const lines = [];
        const rhymeWords = {};
        
        for (let i = 0; i < 14; i++) {
            const rhymeLetter = rhymeScheme.pattern[i];
            let line = '';
            let attempts = 0;
            
            while (attempts < this.maxAttempts) {
                line = this.generateSingleLine(vocabulary, complexity, rhymeLetter, rhymeWords, i);
                
                const syllables = window.PoetryUtils.validateLineLength(line);
                const grammar = validateGrammar(line);
                
                if (syllables.isValid && grammar.valid) {
                    break;
                }
                
                attempts++;
            }
            
            lines.push(line);
            
            const lastWord = this.getLastWord(line);
            if (!rhymeWords[rhymeLetter]) {
                rhymeWords[rhymeLetter] = lastWord;
            }
        }
        
        return lines;
    }
    
    generateSingleLine(vocabulary, complexity, rhymeLetter, rhymeWords, lineIndex) {
        const templateType = this.chooseTemplateType(lineIndex);
        const templates = SENTENCE_TEMPLATES[templateType] || SENTENCE_TEMPLATES.declarative;
        const template = selectRandomWord(templates);
        
        const slots = generateWordSlots(template, vocabulary, complexity === 'advanced');
        
        if (rhymeWords[rhymeLetter]) {
            const rhymingWords = window.WordBanks.getRhymingWords(rhymeWords[rhymeLetter]);
            if (rhymingWords.length > 0) {
                const contextualRhymes = rhymingWords.filter(word => 
                    vocabulary.nouns.includes(word) || 
                    vocabulary.adjectives.includes(word) || 
                    vocabulary.verbs.includes(word)
                );
                
                if (contextualRhymes.length > 0) {
                    const rhymeWord = selectRandomWord(contextualRhymes);
                    return this.adjustLineForRhyme(template, slots, rhymeWord);
                }
            }
        }
        
        const line = fillTemplate(template, slots);
        return this.adjustSyllables(line, vocabulary);
    }
    
    chooseTemplateType(lineIndex) {
        if (lineIndex === 0 || lineIndex === 8) return 'declarative';
        if (lineIndex === 7 || lineIndex === 13) return 'exclamatory';
        if (lineIndex === 3 || lineIndex === 11) return 'interrogative';
        
        return 'declarative';
    }
    
    adjustLineForRhyme(template, slots, rhymeWord) {
        const baseLine = fillTemplate(template, slots);
        const words = baseLine.split(/\s+/);
        words[words.length - 1] = rhymeWord;
        return words.join(' ');
    }
    
    adjustSyllables(line, vocabulary) {
        const syllables = window.PoetryUtils.countLineSyllables(line);
        
        if (syllables === 10) return line;
        
        if (syllables < 10) {
            return this.expandLine(line, vocabulary, 10 - syllables);
        } else if (syllables > 10) {
            return this.contractLine(line, syllables - 10);
        }
        
        return line;
    }
    
    expandLine(line, vocabulary, neededSyllables) {
        const words = line.split(/\s+/);
        const adjectives = vocabulary.adjectives.filter(adj => 
            window.PoetryUtils.countSyllables(adj) <= neededSyllables
        );
        
        if (adjectives.length > 0) {
            const adj = selectRandomWord(adjectives);
            words.splice(1, 0, adj);
        }
        
        return words.join(' ');
    }
    
    contractLine(line, excessSyllables) {
        const words = line.split(/\s+/);
        
        for (let i = words.length - 2; i >= 0 && excessSyllables > 0; i--) {
            const wordSyllables = window.PoetryUtils.countSyllables(words[i]);
            if (wordSyllables <= excessSyllables && words[i].length < 5) {
                words.splice(i, 1);
                excessSyllables -= wordSyllables;
            }
        }
        
        return words.join(' ');
    }
    
    getLastWord(line) {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1]?.replace(/[.,!?;:]$/, '') || '';
    }
    
    assessQuality(lines, theme) {
        const coherence = lines.map(line => checkCoherence(line, theme));
        const grammar = lines.map(line => validateGrammar(line));
        const repetition = checkRepetition(lines);
        const flow = assessFlow(lines);
        
        const coherenceScore = coherence.reduce((sum, c) => sum + (c.coherent ? 1 : 0), 0) / lines.length;
        const grammarScore = grammar.reduce((sum, g) => sum + (g.valid ? 1 : 0), 0) / lines.length;
        
        const overallScore = (coherenceScore + grammarScore + repetition.score + flow.score) / 4;
        
        return {
            overall: overallScore,
            coherence: coherenceScore,
            grammar: grammarScore,
            repetition: repetition.score,
            flow: flow.score,
            details: {
                coherence: coherence,
                grammar: grammar,
                repetition: repetition,
                flow: flow
            }
        };
    }
}

// Integration with UI
function generateSonnetFromForm() {
    try {
        const formData = new FormData(document.getElementById('sonnet-form'));
        const options = {
            theme: formData.get('theme') || 'love',
            mood: formData.get('mood') || '1',
            complexity: formData.get('complexity') ? 'advanced' : 'simple',
            sonnetType: formData.get('sonnet-type') || 'shakespearean',
            customWords: formData.get('custom-words') || ''
        };
        
        const moodNames = ['romantic', 'melancholic', 'uplifting', 'mysterious'];
        options.mood = moodNames[parseInt(options.mood)] || 'romantic';
        
        console.log('Form options:', options);
        
        const generator = new SonnetGenerator();
        const result = generator.generate(options);
        
        console.log('Generated result:', result);
        
        displayGeneratedSonnet(result);
        window.currentSonnet = result; // Store sonnet globally
        
        return result;
        
    } catch (error) {
        console.error('Error generating sonnet:', error);
        showGenerationError('Failed to generate sonnet. Please try again.');
        return null;
    }
}

function displayGeneratedSonnet(result) {
    if (!result) {
        console.error('displayGeneratedSonnet: result is null or undefined');
        showGenerationError('Failed to generate sonnet. Please try again.');
        return;
    }
    
    const title = generateSonnetTitle(result.theme || 'untitled', result.mood || 'romantic');
    const titleElement = document.getElementById('sonnet-title');
    if (titleElement) {
        titleElement.textContent = title;
    }
    
    const typeElement = document.getElementById('sonnet-type-display');
    if (typeElement && result.sonnetType) {
        typeElement.textContent = result.sonnetType.charAt(0).toUpperCase() + result.sonnetType.slice(1);
    }
    
    const themeElement = document.getElementById('sonnet-theme-display');
    if (themeElement && result.theme) {
        themeElement.textContent = result.theme.charAt(0).toUpperCase() + result.theme.slice(1);
    }
    
    const rhymeElement = document.getElementById('rhyme-scheme-display');
    if (rhymeElement && result.rhymeScheme && Array.isArray(result.rhymeScheme)) {
        rhymeElement.textContent = result.rhymeScheme.join(' ');
    }
    
    const poemContainer = document.getElementById('sonnet-poem');
    if (!poemContainer) {
        console.error('displayGeneratedSonnet: poem container not found');
        return;
    }
    
    poemContainer.innerHTML = '';
    
    if (result.lines && Array.isArray(result.lines)) {
        result.lines.forEach((line, index) => {
            if (line) {
                const lineElement = document.createElement('span');
                lineElement.className = 'poem-line';
                lineElement.textContent = line;
                poemContainer.appendChild(lineElement);
            }
        });
    } else {
        console.error('displayGeneratedSonnet: result.lines is not an array');
        showGenerationError('Failed to display sonnet lines. Please try again.');
        return;
    }
    
    console.log('Sonnet Quality:', result.quality);
    
    // Show the sonnet content and hide placeholder
    showSonnetContent();
}

function generateSonnetTitle(theme, mood) {
    const titleTemplates = {
        love: ['Love\'s Sweet Song', 'Beloved\'s Grace', 'Heart\'s Desire', 'Passion\'s Fire'],
        nature: ['Nature\'s Song', 'Whispers of Wind', 'Garden Dreams', 'Sky\'s Embrace'],
        time: ['Time\'s Passage', 'Eternal Moments', 'Dawn\'s Promise', 'Memory\'s Call'],
        beauty: ['Beauty\'s Light', 'Radiant Grace', 'Perfect Form', 'Divine Vision'],
        loss: ['Sorrow\'s Song', 'Farewell\'s Echo', 'Memory\'s Shadow', 'Grief\'s Lament'],
        hope: ['Hope\'s Dawn', 'Promise of Tomorrow', 'Light\'s Return', 'Faith\'s Song'],
        seasons: ['Season\'s Turn', 'Autumn\'s Call', 'Spring\'s Return', 'Winter\'s Rest']
    };
    
    const templates = titleTemplates[theme] || titleTemplates.love;
    return selectRandomWord(templates);
}

function showGenerationError(message) {
    const placeholder = document.getElementById('output-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <span class="placeholder-icon" aria-hidden="true">⚠️</span>
            <p class="placeholder-text">Generation Error</p>
            <p class="placeholder-subtext">${message}</p>
        `;
    }
}

// Export for global access
window.SonnetGenerator = SonnetGenerator;
window.generateSonnetFromForm = generateSonnetFromForm;

