import { GAME_CONSTANTS } from '../constants/gameConstants'

const STORAGE_KEY = 'mash-game-history'

export interface GameResult {
    player: string
    result: {
        house: string
        spouse: string
        children: string
        job: string
        car: string
        location: string
        salary: string
    }
    timestamp: number
}

export const saveGameResult = (player: string, result: any) => {
    const history = getGameHistory()
    const gameResult: GameResult = {
        player,
        result,
        timestamp: Date.now()
    }

    history.push(gameResult)

    // Keep only last N results using constant
    if (history.length > GAME_CONSTANTS.MAX_HISTORY_ENTRIES) {
        history.shift()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export const getGameHistory = (): GameResult[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

export const clearGameHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
}
