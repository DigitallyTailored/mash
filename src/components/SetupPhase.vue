<template>
  <div>
    <h2 class="title is-4 has-text-centered">🎮 Game Setup</h2>

    <div class="columns">
      <div class="column">
        <h3 class="title is-5">Players</h3>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input
                v-model="newPlayer"
                @keyup.enter="handleAddPlayer"
                class="input is-small"
                placeholder="Enter player name"
            >
          </div>
          <div class="control">
            <button @click="handleAddPlayer" class="button is-primary is-small" :ref="el => setRef(el, 'addPlayerBtn')">
              Add
            </button>
          </div>
        </div>

        <div class="tags mt-2">
          <span
              v-for="(player, index) in players"
              :key="index"
              class="tag is-info"
          >
            {{ player }}
            <button @click="handleRemovePlayer(index)" class="delete is-small"></button>
          </span>
        </div>
      </div>

      <div class="column is-narrow">
        <button @click="handleRandomizeAll" class="button is-warning is-small" :ref="el => setRef(el, 'randomizeBtn')">
          🎲 Random
        </button>
        <button
            @click="handleStartGame"
            class="button is-success is-small ml-2"
            :ref="el => setRef(el, 'startGameBtn')"
        >
          🚀 Start
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createRefManager } from '../utils/refs'
import { playPrimaryButtonSound, playWarningButtonSound, playSuccessButtonSound, playDangerButtonSound } from '../utils/audio'
import { playButtonClickEffect } from '../utils/effects'

const props = defineProps<{
  players: string[]
  categories: any
}>()

const emit = defineEmits(['update:players', 'randomize-all', 'start-game'])

const newPlayer = ref('')
const { setRef, getRef } = createRefManager<HTMLElement>()

const handleAddPlayer = () => {
  if (newPlayer.value.trim() && !props.players.includes(newPlayer.value.trim())) {
    const updatedPlayers = [...props.players, newPlayer.value.trim()]
    emit('update:players', updatedPlayers)
    newPlayer.value = ''
    playPrimaryButtonSound()
    playButtonClickEffect(getRef('addPlayerBtn'))
  }
}

const handleRemovePlayer = (index: number) => {
  const updatedPlayers = props.players.filter((_, i) => i !== index)
  emit('update:players', updatedPlayers)
  playDangerButtonSound()
}

const handleRandomizeAll = () => {
  emit('randomize-all')
  playWarningButtonSound()
  playButtonClickEffect(getRef('randomizeBtn'))
}

const handleStartGame = () => {
  const finalPlayers = props.players.length === 0 ? ['Player 1'] : props.players
  emit('start-game', finalPlayers, props.categories)
  playSuccessButtonSound()
  playButtonClickEffect(getRef('startGameBtn'))
}
</script>
