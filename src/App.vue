<template>
  <div class="container is-max-desktop">
    <!-- Music Button - Always Visible -->
    <button
        @click="toggleBackgroundMusic"
        :class="['button', 'music-toggle', musicPlaying ? 'is-warning' : 'is-light']"
        :title="musicPlaying ? 'Music On' : 'Music Off'"
        ref="musicBtn"
    >
      {{ musicPlaying ? '🎵' : '🔇' }}
    </button>

    <section class="hero is-small">
      <div class="hero-body has-text-centered py-3">
        <h1 class="title is-4 has-text-white">MASH</h1>
        <p class="subtitle is-6 has-text-white-ter subtitle-animated">{{ subtitleMessage }}</p>
      </div>
    </section>

    <div class="section py-4">
      <Board
          v-if="gamePhase === 'setup' || gamePhase === 'elimination'"
          :game-phase="gamePhase"
          :categories="gameCategories"
          :elimination-number="eliminationNumber"
          :current-player="currentPlayer"
          @start-game="startGame"
          @elimination-complete="onEliminationComplete"
      />

      <NumberSelection
          v-if="gamePhase === 'number-selection'"
          :current-player="currentPlayer"
          @number-selected="onNumberSelected"
      />

      <Results
          v-if="gamePhase === 'results'"
          :result="currentResult"
          :current-player="currentPlayer"
          :all-players="players"
          @next-player="nextPlayer"
          @new-game="newGame"
          @back-to-setup="backToSetup"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Board from './components/Board.vue'
import NumberSelection from './components/NumberSelection.vue'
import Results from './components/Results.vue'
import { getDefaultCategories } from './data/gameData'
import { playBackgroundMusic, stopBackgroundMusic, playLightButtonSound } from './utils/audio'
import { playButtonClickEffect } from './utils/effects'

type GamePhase = 'setup' | 'number-selection' | 'elimination' | 'results'
type GameResult = {
  house: string
  spouse: string
  children: string
  job: string
  car: string
  location: string
  salary: string
}

// Subtitle messages array
const subtitleMessages = [
  "In a world where pen and paper don't exist 🌍",
  "Much like life, best played with sound 🔊",
  "Coming to a career counsellor near you",
  "Not responsible for any actual life outcomes",
  "Now with 87% more existential dread 😱",
  "Warning: may cause flashbacks to primary school ⚠️",
  "The algorithm your guidance counsellor warned you about 🤖",
  "Surprisingly accurate (not a guarantee)",
  "Based on a true story (that hasn't happened yet)",
  "Side effects may include unrealistic expectations",
  "The only fortune-telling you can trust (don't) 🔮",
  "Rated M for Millennial 📱",
  "Your parents' disappointment, now gamified 🎮",
  "It's like gambling for kids 🧒👧"
]


const gamePhase = ref<GamePhase>('setup')
const players = ref<string[]>([])
const currentPlayerIndex = ref(0)
const currentPlayer = ref('')
const gameCategories = ref(getDefaultCategories())
const eliminationNumber = ref(0)
const currentResult = ref<GameResult | null>(null)
const musicPlaying = ref(false)
const musicUserInteracted = ref(false) // Track if user has ever clicked the music button
const musicBtn = ref<HTMLElement>()
const subtitleMessage = ref('')

// Timer for cycling subtitles
let subtitleInterval: number | null = null

// Initialize random subtitle message
const setRandomSubtitle = () => {
  const randomIndex = Math.floor(Math.random() * subtitleMessages.length)
  subtitleMessage.value = subtitleMessages[randomIndex]
}

// Start cycling subtitles
const startSubtitleCycling = () => {
  // Clear any existing interval
  if (subtitleInterval) {
    clearInterval(subtitleInterval)
  }

  // Set up new interval
  subtitleInterval = window.setInterval(() => {
    setRandomSubtitle()
  }, 15000)
}

// Stop cycling subtitles
const stopSubtitleCycling = () => {
  if (subtitleInterval) {
    clearInterval(subtitleInterval)
    subtitleInterval = null
  }
}

const startGame = (playerList: string[], categories: any) => {
  players.value = playerList
  gameCategories.value = categories
  currentPlayerIndex.value = 0
  currentPlayer.value = players.value[0]
  gamePhase.value = 'number-selection'

  // Auto-play music if user hasn't interacted with music controls yet
  if (!musicUserInteracted.value && !musicPlaying.value) {
    playBackgroundMusic()
    musicPlaying.value = true
  }
}

const onNumberSelected = (number: number) => {
  eliminationNumber.value = number
  gamePhase.value = 'elimination'
}

const onEliminationComplete = (result: GameResult) => {
  currentResult.value = result
  gamePhase.value = 'results'
}

const nextPlayer = () => {
  currentPlayerIndex.value++
  if (currentPlayerIndex.value < players.value.length) {
    currentPlayer.value = players.value[currentPlayerIndex.value]
    gameCategories.value = getDefaultCategories()
    gamePhase.value = 'number-selection'
  } else {
    newGame()
  }
}

const newGame = () => {
  gamePhase.value = 'setup'
  players.value = []
  currentPlayerIndex.value = 0
  gameCategories.value = getDefaultCategories()
  // Set a new random subtitle message for the new game
  setRandomSubtitle()
}

const backToSetup = () => {
  gamePhase.value = 'setup'
}

const toggleBackgroundMusic = () => {
  // Mark that user has interacted with music controls
  musicUserInteracted.value = true

  if (musicPlaying.value) {
    stopBackgroundMusic()
  } else {
    playBackgroundMusic()
  }
  musicPlaying.value = !musicPlaying.value
  playLightButtonSound()
  playButtonClickEffect(musicBtn.value)
}

onMounted(() => {
  // Set initial random subtitle
  setRandomSubtitle()

  // Start cycling subtitles
  startSubtitleCycling()

  if (musicPlaying.value) {
    playBackgroundMusic()
  }
})

onUnmounted(() => {
  // Clean up interval when component is destroyed
  stopSubtitleCycling()
})
</script>
