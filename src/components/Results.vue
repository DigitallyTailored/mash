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
            :ref="el => setRef(el, 'nextPlayerBtn')"
        >
          Next Player
        </button>
      </div>
      <div class="control">
        <button @click="newGame" class="button is-success" :ref="el => setRef(el, 'newGameBtn')">
          New Game
        </button>
      </div>
    </div>

    <GameHistory />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GameHistory from './GameHistory.vue'
import { playPrimaryButtonSound, playSuccessButtonSound } from '../utils/audio'
import { playButtonClickEffect } from '../utils/effects'
import { createRefManager } from '../utils/refs'
import { CATEGORIES, type CategoryKey } from '../constants/gameConstants'

const props = defineProps<{
  result: any
  currentPlayer: string
  allPlayers: string[]
}>()

const emit = defineEmits(['next-player', 'new-game', 'back-to-setup'])

const { setRef, getRef } = createRefManager<HTMLElement>()

const hasMorePlayers = computed(() => {
  const currentIndex = props.allPlayers.indexOf(props.currentPlayer)
  return currentIndex < props.allPlayers.length - 1
})

const formatLabel = (key: string) => {
  return CATEGORIES[key as CategoryKey]?.title || key
}

const nextPlayer = () => {
  playPrimaryButtonSound()
  playButtonClickEffect(getRef('nextPlayerBtn'))
  emit('next-player')
}

const newGame = () => {
  playSuccessButtonSound()
  playButtonClickEffect(getRef('newGameBtn'))
  emit('new-game')
}
</script>
