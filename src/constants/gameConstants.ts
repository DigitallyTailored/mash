// Centralized game constants to eliminate duplication
export const GAME_CONSTANTS = {
    MASH_LETTERS: ['M', 'A', 'S', 'H'],
    HOUSE_OPTIONS: ['Mansion', 'Apartment', 'Shack', 'House'],
    MAX_HISTORY_ENTRIES: 50,
    CATEGORY_ORDER: ['spouse', 'children', 'job', 'car', 'location', 'salary'],

    // Elimination timing
    ELIMINATION_TIMING: {
        TICK_DELAY: 200,
        ELIMINATION_DELAY: 500,
        CATEGORY_COMPLETE_DELAY: 800,
        GAME_START_DELAY: 1000
    },

    // Audio configuration
    AUDIO: {
        TICK: {
            file: '/sounds/tick.ogg',
            volume: 0.5
        },
        DING: {
            file: '/sounds/ding.ogg',
            volume: 0.6
        },
        ELIMINATION: {
            file: '/sounds/elimination.ogg',
            volume: 0.5
        },
        CATEGORY_COMPLETED: {
            file: '/sounds/category-completed.ogg',
            volume: 0.8
        },
        FANFARE: {
            file: '/sounds/fanfare.ogg',
            volume: 0.9
        },
        BUTTON_PRIMARY: {
            file: '/sounds/button-primary.ogg',
            volume: 0.4
        },
        BUTTON_SUCCESS: {
            file: '/sounds/button-success.ogg',
            volume: 0.4
        },
        BUTTON_WARNING: {
            file: '/sounds/button-warning.ogg',
            volume: 0.4
        },
        BUTTON_DANGER: {
            file: '/sounds/button-danger.ogg',
            volume: 0.4
        },
        BUTTON_LIGHT: {
            file: '/sounds/button-light.ogg',
            volume: 0.3
        },
        BACKGROUND_MUSIC: {
            file: '/sounds/background-music.mp3',
            volume: 0.3
        }
    }
} as const

// Category configuration
export const CATEGORIES = {
    house: {
        title: '🏠 Home',
        emoji: '🏠',
        key: 'house'
    },
    spouse: {
        title: '💕 Spouse',
        emoji: '💕',
        key: 'spouse'
    },
    children: {
        title: '👶 Children',
        emoji: '👶',
        key: 'children'
    },
    job: {
        title: '💼 Job',
        emoji: '💼',
        key: 'job'
    },
    car: {
        title: '🚗 Car',
        emoji: '🚗',
        key: 'car'
    },
    location: {
        title: '📍 Location',
        emoji: '📍',
        key: 'location'
    },
    salary: {
        title: '💰 Salary',
        emoji: '💰',
        key: 'salary'
    }
} as const

export type CategoryKey = keyof typeof CATEGORIES
export type AudioKey = keyof typeof GAME_CONSTANTS.AUDIO
