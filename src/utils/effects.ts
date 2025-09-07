import confetti from 'canvas-confetti'

// Small confetti when a single item is eliminated
export const playEliminationEffect = (element?: HTMLElement) => {
    let origin = { x: 0.5, y: 0.5 }

    if (element) {
        const rect = element.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight
        origin = { x, y }
    }

    confetti({
        particleCount: 25,
        spread: 40,
        origin,
        colors: ['#ffb200', '#eeff00', '#ff4e00'],
        startVelocity: 20,
        gravity: 1,
        drift: 0,
        ticks: 100
    })
}

// Medium confetti when a category is completed (only 1 item left)
export const playCategoryCompletedEffect = (element?: HTMLElement) => {
    let origin = { x: 0.5, y: 0.5 }

    if (element) {
        const rect = element.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight
        origin = { x, y }
    }

    // Multiple bursts for category completion
    const colors = ['#2456f9', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe']

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 60,
                spread: 70,
                origin,
                colors,
                startVelocity: 30,
                gravity: 1.2,
                drift: 0,
                ticks: 150
            })
        }, i * 100)
    }
}

// Big celebration for final results
export const playResultsFireworks = () => {
    const duration = 3500
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
            clearInterval(interval)
            return
        }

        const particleCount = 100 * (timeLeft / duration)

        // Left side
        confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: randomInRange(0.1, 0.3),
                y: Math.random() - 0.2
            },
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a55eea']
        })

        // Right side
        confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: randomInRange(0.7, 0.9),
                y: Math.random() - 0.2
            },
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a55eea']
        })
    }, 250)
}


// Very small confetti effect for button clicks
export const playButtonClickEffect = (element?: HTMLElement) => {
    let origin = { x: 0.5, y: 0.5 }

    if (element) {
        const rect = element.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight
        origin = { x, y }
    }

    confetti({
        particleCount: 8,
        spread: 25,
        origin,
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
        startVelocity: 15,
        gravity: 0.8,
        drift: 0,
        ticks: 50,
        scalar: 0.6
    })
}
