<template>
  <div class="box">
    <h2 class="title is-3 has-text-centered mb-4">🔮 {{ currentPlayer }}'s Fortune!</h2>

    <div class="card has-background-info-light">
      <div class="card-content py-3">
        <div class="columns is-multiline is-mobile">
          <div class="column is-half-mobile is-one-third-tablet is-3-desktop" v-for="(value, key) in result" :key="key">
            <div class="field">
              <label class="label is-size-7 mb-1">{{ formatLabel(key) }}</label>
              <p class="is-size-5 has-text-weight-semibold">{{ value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-grouped is-grouped-centered mt-4">
      <div class="control">
        <button
            v-if="hasMorePlayers"
            @click="nextPlayer"
            class="button is-primary"
            ref="nextPlayerBtn"
        >
          Next Player
        </button>
      </div>
      <div class="control">
        <button @click="newGame" class="button is-success" ref="newGameBtn">
          New Game
        </button>
      </div>
    </div>

    <GameHistory />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import GameHistory from './GameHistory.vue'
import { playPrimaryButtonSound, playSuccessButtonSound } from '../utils/audio'
import { playButtonClickEffect } from '../utils/effects'

const props = defineProps<{
  result: any
  currentPlayer: string
  allPlayers: string[]
}>()

const emit = defineEmits(['next-player', 'new-game', 'back-to-setup'])

const nextPlayerBtn = ref<HTMLElement>()
const newGameBtn = ref<HTMLElement>()

const hasMorePlayers = computed(() => {
  const currentIndex = props.allPlayers.indexOf(props.currentPlayer)
  return currentIndex < props.allPlayers.length - 1
})

const formatLabel = (key: string) => {
  const labels: Record<string, string> = {
    house: '🏠 Home',
    spouse: '💕 Spouse',
    children: '👶 Children',
    job: '💼 Job',
    car: '🚗 Car',
    location: '📍 Location',
    salary: '💰 Salary'
  }
  return labels[key] || key
}

const nextPlayer = () => {
  playPrimaryButtonSound()
  playButtonClickEffect(nextPlayerBtn.value)
  emit('next-player')
}

const newGame = () => {
  playSuccessButtonSound()
  playButtonClickEffect(newGameBtn.value)
  emit('new-game')
}

const backToSetup = () => emit('back-to-setup')
</script>
