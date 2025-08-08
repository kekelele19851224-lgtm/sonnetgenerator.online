// Word Banks and Vocabulary for Sonnet Generation
// Comprehensive word databases organized by theme, mood, and rhyme patterns

console.log('Word Banks JS loaded - Phase 3 implementation');

// Prevent duplicate loading
if (typeof window.WordBanks !== 'undefined') {
    console.warn('WordBanks already loaded, skipping redefinition');
} else {

// Rhyming Dictionary organized by sound patterns
const RHYMING_DICTIONARY = {
    // Perfect rhymes organized by ending sound
    perfectRhymes: {
        'ay': ['day', 'way', 'say', 'play', 'may', 'ray', 'bay', 'gray', 'stay', 'pray'],
        'ight': ['night', 'light', 'bright', 'sight', 'might', 'right', 'flight', 'white'],
        'ove': ['love', 'dove', 'above', 'shove', 'thereof', 'beloved'],
        'art': ['heart', 'part', 'start', 'dart', 'smart', 'apart', 'depart'],
        'ead': ['head', 'said', 'dead', 'bread', 'read', 'thread', 'spread'],
        'ime': ['time', 'rhyme', 'chime', 'climb', 'prime', 'sublime'],
        'eal': ['real', 'feel', 'steal', 'heal', 'deal', 'reveal', 'ideal'],
        'ound': ['sound', 'found', 'ground', 'round', 'bound', 'profound'],
        'ace': ['place', 'face', 'grace', 'space', 'race', 'embrace', 'trace'],
        'ire': ['fire', 'desire', 'tire', 'wire', 'inspire', 'require', 'admire'],
        'ower': ['flower', 'power', 'tower', 'hour', 'shower', 'devour'],
        'eauty': ['beauty', 'duty', 'fruity'],
        'orrow': ['sorrow', 'morrow', 'borrow', 'tomorrow'],
        'ever': ['never', 'ever', 'forever', 'whatever', 'however'],
        'onder': ['wonder', 'ponder', 'yonder', 'wander', 'fonder']
    },
    
    nearRhymes: {
        'ay': ['away', 'today', 'decay', 'display', 'delay', 'betray'],
        'ight': ['delight', 'insight', 'invite', 'unite', 'ignite'],
        'ove': ['remove', 'improve', 'approve', 'move', 'groove'],
        'art': ['court', 'sort', 'sport', 'report', 'support'],
        'ime': ['come', 'some', 'home', 'dome', 'roam'],
        'eal': ['will', 'still', 'fill', 'skill', 'chill', 'fulfill'],
        'ace': ['base', 'case', 'pace', 'lace', 'chase'],
        'ire': ['higher', 'choir', 'liar', 'buyer', 'entire']
    }
};

// Thematic vocabulary sets
const THEMATIC_WORDS = {
    love: {
        nouns: {
            simple: ['heart', 'love', 'kiss', 'hand', 'eyes', 'soul', 'dream', 'hope'],
            advanced: ['passion', 'devotion', 'affection', 'romance', 'desire', 'longing', 'tenderness', 'adoration']
        },
        adjectives: {
            simple: ['sweet', 'dear', 'true', 'kind', 'warm', 'soft', 'pure', 'bright'],
            advanced: ['passionate', 'devoted', 'ardent', 'tender', 'cherished', 'beloved', 'captivating', 'divine']
        },
        verbs: {
            simple: ['love', 'hold', 'kiss', 'dream', 'hope', 'care', 'feel', 'want'],
            advanced: ['adore', 'cherish', 'embrace', 'caress', 'yearn', 'worship', 'treasure', 'enchant']
        }
    },
    
    nature: {
        nouns: {
            simple: ['tree', 'flower', 'bird', 'sky', 'sun', 'moon', 'star', 'wind'],
            advanced: ['meadow', 'forest', 'mountain', 'ocean', 'breeze', 'tempest', 'aurora', 'wilderness']
        },
        adjectives: {
            simple: ['green', 'blue', 'bright', 'dark', 'wild', 'calm', 'deep', 'fresh'],
            advanced: ['verdant', 'azure', 'pristine', 'majestic', 'serene', 'tranquil', 'boundless', 'sublime']
        },
        verbs: {
            simple: ['grow', 'bloom', 'flow', 'shine', 'move', 'dance', 'sing', 'wave'],
            advanced: ['flourish', 'cascade', 'shimmer', 'whisper', 'rustle', 'meander', 'glisten', 'sway']
        }
    },
    
    time: {
        nouns: {
            simple: ['time', 'day', 'night', 'year', 'hour', 'moment', 'past', 'future'],
            advanced: ['eternity', 'infinity', 'season', 'twilight', 'millennium', 'epoch', 'yesterday', 'tomorrow']
        },
        adjectives: {
            simple: ['old', 'new', 'fast', 'slow', 'long', 'short', 'quick', 'late'],
            advanced: ['eternal', 'temporal', 'fleeting', 'everlasting', 'transient', 'perpetual', 'timeless', 'ancient']
        },
        verbs: {
            simple: ['pass', 'wait', 'last', 'end', 'start', 'grow', 'change', 'move'],
            advanced: ['endure', 'persist', 'elapse', 'transcend', 'evolve', 'transform', 'reminisce', 'anticipate']
        }
    },
    
    beauty: {
        nouns: {
            simple: ['beauty', 'face', 'smile', 'grace', 'charm', 'light', 'glow', 'shine'],
            advanced: ['radiance', 'elegance', 'splendor', 'magnificence', 'allure', 'grandeur', 'brilliance', 'perfection']
        },
        adjectives: {
            simple: ['pretty', 'lovely', 'nice', 'fine', 'good', 'bright', 'clear', 'fair'],
            advanced: ['radiant', 'graceful', 'sublime', 'elegant', 'divine', 'exquisite', 'pristine', 'resplendent']
        },
        verbs: {
            simple: ['shine', 'glow', 'gleam', 'look', 'seem', 'appear', 'show', 'flash'],
            advanced: ['illuminate', 'radiate', 'dazzle', 'captivate', 'mesmerize', 'entrance', 'beguile', 'enchant']
        }
    },
    
    loss: {
        nouns: {
            simple: ['loss', 'pain', 'tear', 'cry', 'fear', 'dark', 'end', 'cold'],
            advanced: ['sorrow', 'grief', 'melancholy', 'anguish', 'despair', 'mourning', 'lament', 'farewell']
        },
        adjectives: {
            simple: ['sad', 'cold', 'dark', 'empty', 'lost', 'gone', 'dead', 'hurt'],
            advanced: ['sorrowful', 'mournful', 'melancholic', 'desolate', 'forlorn', 'bereft', 'woeful', 'disconsolate']
        },
        verbs: {
            simple: ['cry', 'weep', 'miss', 'lose', 'hurt', 'break', 'fall', 'fade'],
            advanced: ['mourn', 'lament', 'grieve', 'yearn', 'reminisce', 'ache', 'languish', 'wither']
        }
    },
    
    hope: {
        nouns: {
            simple: ['hope', 'light', 'dawn', 'dream', 'wish', 'faith', 'joy', 'peace'],
            advanced: ['promise', 'aspiration', 'optimism', 'serenity', 'triumph', 'renewal', 'resurrection', 'salvation']
        },
        adjectives: {
            simple: ['bright', 'new', 'fresh', 'clear', 'warm', 'good', 'strong', 'free'],
            advanced: ['promising', 'hopeful', 'optimistic', 'radiant', 'triumphant', 'victorious', 'blessed', 'uplifting']
        },
        verbs: {
            simple: ['hope', 'wish', 'dream', 'pray', 'trust', 'believe', 'rise', 'grow'],
            advanced: ['aspire', 'anticipate', 'envision', 'transcend', 'overcome', 'persevere', 'flourish', 'triumph']
        }
    },
    
    seasons: {
        nouns: {
            simple: ['spring', 'summer', 'fall', 'winter', 'leaf', 'snow', 'rain', 'sun'],
            advanced: ['autumn', 'harvest', 'solstice', 'equinox', 'blossom', 'frost', 'tempest', 'zephyr']
        },
        adjectives: {
            simple: ['warm', 'cold', 'hot', 'cool', 'wet', 'dry', 'green', 'white'],
            advanced: ['temperate', 'frigid', 'balmy', 'crisp', 'verdant', 'barren', 'golden', 'crystalline']
        },
        verbs: {
            simple: ['bloom', 'grow', 'fall', 'melt', 'freeze', 'warm', 'cool', 'change'],
            advanced: ['blossom', 'flourish', 'wither', 'thaw', 'crystallize', 'regenerate', 'transform', 'cycle']
        }
    }
};

// Mood-based word collections
const MOOD_WORDS = {
    romantic: {
        adjectives: ['tender', 'sweet', 'gentle', 'passionate', 'loving', 'soft', 'warm', 'precious'],
        verbs: ['caress', 'embrace', 'whisper', 'kiss', 'hold', 'cherish', 'adore', 'treasure'],
        nouns: ['beloved', 'darling', 'sweetheart', 'passion', 'romance', 'intimacy', 'affection', 'devotion']
    },
    
    melancholic: {
        adjectives: ['sorrowful', 'weeping', 'fading', 'distant', 'lonely', 'mournful', 'wistful', 'forlorn'],
        verbs: ['mourn', 'weep', 'lament', 'fade', 'wither', 'pine', 'languish', 'sigh'],
        nouns: ['sorrow', 'grief', 'melancholy', 'shadow', 'tear', 'memory', 'loss', 'longing']
    },
    
    uplifting: {
        adjectives: ['bright', 'soaring', 'triumphant', 'joyous', 'radiant', 'glorious', 'inspiring', 'hopeful'],
        verbs: ['soar', 'triumph', 'celebrate', 'rejoice', 'inspire', 'uplift', 'encourage', 'motivate'],
        nouns: ['triumph', 'victory', 'joy', 'celebration', 'inspiration', 'hope', 'glory', 'success']
    },
    
    mysterious: {
        adjectives: ['shadowed', 'whispered', 'hidden', 'veiled', 'secret', 'cryptic', 'enigmatic', 'mystical'],
        verbs: ['whisper', 'conceal', 'shroud', 'veil', 'hide', 'mask', 'cloak', 'mystify'],
        nouns: ['shadow', 'secret', 'mystery', 'enigma', 'whisper', 'veil', 'darkness', 'phantom']
    }
};

// Archaic and poetic vocabulary
const ARCHAIC_WORDS = {
    pronouns: {
        'you': ['thee', 'thou', 'ye'],
        'your': ['thy', 'thine'],
        'yourself': ['thyself']
    },
    
    verbs: {
        'do': ['doth', 'dost'],
        'have': ['hath', 'hast'],
        'are': ['art'],
        'will': ['shall', 'wilt'],
        'can': ['canst', 'may']
    },
    
    conjunctions: {
        'while': ['whilst'],
        'before': ['ere'],
        'although': ['albeit'],
        'because': ['for'],
        'until': ['till']
    },
    
    adverbs: {
        'often': ['oft'],
        'always': ['ever', 'aye'],
        'never': ['ne\'er'],
        'over': ['o\'er'],
        'even': ['e\'en']
    },
    
    adjectives: ['fair', 'beauteous', 'wondrous', 'gentle', 'noble', 'sweet', 'dear', 'true', 'brave', 'pure']
};

// Utility functions
function getWordsByCategory(theme, partOfSpeech, complexity = 'simple') {
    if (!THEMATIC_WORDS[theme] || !THEMATIC_WORDS[theme][partOfSpeech]) {
        return [];
    }
    
    const words = THEMATIC_WORDS[theme][partOfSpeech];
    return complexity === 'advanced' && words.advanced ? words.advanced : words.simple;
}

function getMoodWords(mood, partOfSpeech) {
    if (!MOOD_WORDS[mood] || !MOOD_WORDS[mood][partOfSpeech]) {
        return [];
    }
    
    return MOOD_WORDS[mood][partOfSpeech];
}

function getRhymingWords(word, type = 'perfect') {
    const dictionary = type === 'perfect' ? RHYMING_DICTIONARY.perfectRhymes : RHYMING_DICTIONARY.nearRhymes;
    
    for (const [pattern, words] of Object.entries(dictionary)) {
        if (word.endsWith(pattern) || words.includes(word)) {
            return words.filter(w => w !== word);
        }
    }
    
    return [];
}

function getArchaicWord(modernWord, partOfSpeech) {
    if (ARCHAIC_WORDS[partOfSpeech] && ARCHAIC_WORDS[partOfSpeech][modernWord]) {
        const archaicOptions = ARCHAIC_WORDS[partOfSpeech][modernWord];
        return archaicOptions[Math.floor(Math.random() * archaicOptions.length)];
    }
    
    if (partOfSpeech === 'adjectives' && ARCHAIC_WORDS.adjectives.includes(modernWord)) {
        return modernWord;
    }
    
    return modernWord;
}

function getCombinedVocabulary(theme, mood, complexity = 'simple') {
    const themeWords = {
        nouns: getWordsByCategory(theme, 'nouns', complexity),
        adjectives: getWordsByCategory(theme, 'adjectives', complexity),
        verbs: getWordsByCategory(theme, 'verbs', complexity)
    };
    
    const moodWords = {
        nouns: getMoodWords(mood, 'nouns') || [],
        adjectives: getMoodWords(mood, 'adjectives') || [],
        verbs: getMoodWords(mood, 'verbs') || []
    };
    
    return {
        nouns: [...new Set([...themeWords.nouns, ...moodWords.nouns])],
        adjectives: [...new Set([...themeWords.adjectives, ...moodWords.adjectives])],
        verbs: [...new Set([...themeWords.verbs, ...moodWords.verbs])]
    };
}

// Export for global access
window.WordBanks = {
    getWordsByCategory,
    getMoodWords,
    getRhymingWords,
    getArchaicWord,
    getCombinedVocabulary,
    THEMATIC_WORDS,
    MOOD_WORDS,
    RHYMING_DICTIONARY,
    ARCHAIC_WORDS
};

} // End of duplicate loading check

