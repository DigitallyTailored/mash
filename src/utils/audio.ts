// Audio file paths - define all sound files in one place
const AUDIO_FILES = {
    tick: '/sounds/tick.ogg',
    ding: '/sounds/ding.ogg',
    elimination: '/sounds/elimination.ogg',
    categoryCompleted: '/sounds/category-completed.ogg',
    fanfare: '/sounds/fanfare.ogg',
    buttonPrimary: '/sounds/button-primary.ogg',
    buttonSuccess: '/sounds/button-success.ogg',
    buttonWarning: '/sounds/button-warning.ogg',
    buttonDanger: '/sounds/button-danger.ogg',
    buttonLight: '/sounds/button-light.ogg',
    backgroundMusic: '/sounds/background-music.mp3'
} as const

// Preloaded audio objects for better performance
const audioCache: Record<string, HTMLAudioElement> = {}
let backgroundMusicAudio: HTMLAudioElement | null = null

// Initialize and preload all audio files
const initializeAudio = () => {
    Object.entries(AUDIO_FILES).forEach(([key, path]) => {
        const audio = new Audio(path)
        audio.preload = 'auto'

        // Handle loading errors gracefully
        audio.addEventListener('error', () => {
            console.warn(`Failed to load audio file: ${path}`)
        })

        audioCache[key] = audio
    })

    // Special handling for background music
    backgroundMusicAudio = audioCache.backgroundMusic
    if (backgroundMusicAudio) {
        backgroundMusicAudio.loop = true
        backgroundMusicAudio.volume = 0.3 // Lower volume for background music
    }
}

// Generic function to play a sound with optional volume
const playSound = (audioKey: keyof typeof AUDIO_FILES, volume: number = 0.7) => {
    const audio = audioCache[audioKey]
    if (audio) {
        // Clone audio for overlapping sounds
        const audioClone = audio.cloneNode() as HTMLAudioElement
        audioClone.volume = volume
        audioClone.play().catch(err => {
            console.warn(`Failed to play audio: ${audioKey}`, err)
        })
    }
}

// Initialize audio on first import
initializeAudio()

// Exported sound functions - same interface as before
export const playTickSound = () => {
    playSound('tick', 0.5)
}

export const playDingSound = () => {
    playSound('ding', 0.6)
}

export const playEliminationSound = () => {
    playSound('elimination', 0.5)
}

export const playCategoryCompletedSound = () => {
    playSound('categoryCompleted', 0.8)
}

export const playFanfareSound = () => {
    playSound('fanfare', 0.9)
}

export const playPrimaryButtonSound = () => {
    playSound('buttonPrimary', 0.4)
}

export const playSuccessButtonSound = () => {
    playSound('buttonSuccess', 0.4)
}

export const playWarningButtonSound = () => {
    playSound('buttonWarning', 0.4)
}

export const playDangerButtonSound = () => {
    playSound('buttonDanger', 0.4)
}

export const playLightButtonSound = () => {
    playSound('buttonLight', 0.3)
}

export const playBackgroundMusic = () => {
    if (backgroundMusicAudio) {
        backgroundMusicAudio.currentTime = 0
        backgroundMusicAudio.play().catch(err => {
            console.warn('Failed to play background music', err)
        })
    }
}

export const stopBackgroundMusic = () => {
    if (backgroundMusicAudio) {
        backgroundMusicAudio.pause()
        backgroundMusicAudio.currentTime = 0
    }
}

// Utility function to get all required audio file paths
export const getRequiredAudioFiles = () => {
    return Object.values(AUDIO_FILES)
}

