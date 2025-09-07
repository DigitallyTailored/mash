import { GAME_CONSTANTS, type AudioKey } from '../constants/gameConstants'

// Preloaded audio objects for better performance
const audioCache: Record<string, HTMLAudioElement> = {}
let backgroundMusicAudio: HTMLAudioElement | null = null

// Initialize and preload all audio files
const initializeAudio = () => {
    Object.entries(GAME_CONSTANTS.AUDIO).forEach(([key, config]) => {
        const audio = new Audio(config.file)
        audio.preload = 'auto'
        audio.addEventListener('error', () => {
            console.warn(`Failed to load audio file: ${config.file}`)
        })
        audioCache[key] = audio
    })

    // Special handling for background music
    backgroundMusicAudio = audioCache.BACKGROUND_MUSIC
    if (backgroundMusicAudio) {
        backgroundMusicAudio.loop = true
        backgroundMusicAudio.volume = GAME_CONSTANTS.AUDIO.BACKGROUND_MUSIC.volume
    }
}

// Generic function to play a sound using the centralized config
const playSound = (audioKey: AudioKey, volumeOverride?: number) => {
    const audio = audioCache[audioKey]
    const config = GAME_CONSTANTS.AUDIO[audioKey]

    if (audio && config) {
        const audioClone = audio.cloneNode() as HTMLAudioElement
        audioClone.volume = volumeOverride ?? config.volume
        audioClone.play().catch(err => {
            console.warn(`Failed to play audio: ${audioKey}`, err)
        })
    }
}

// Initialize audio on first import
initializeAudio()

// Exported sound functions
export const playTickSound = () => playSound('TICK')
export const playDingSound = () => playSound('DING')
export const playEliminationSound = () => playSound('ELIMINATION')
export const playCategoryCompletedSound = () => playSound('CATEGORY_COMPLETED')
export const playFanfareSound = () => playSound('FANFARE')
export const playPrimaryButtonSound = () => playSound('BUTTON_PRIMARY')
export const playSuccessButtonSound = () => playSound('BUTTON_SUCCESS')
export const playWarningButtonSound = () => playSound('BUTTON_WARNING')
export const playDangerButtonSound = () => playSound('BUTTON_DANGER')
export const playLightButtonSound = () => playSound('BUTTON_LIGHT')

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
    return Object.values(GAME_CONSTANTS.AUDIO).map(config => config.file)
}
