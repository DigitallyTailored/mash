<template>
  <div class="box has-text-centered">
    <h2 class="title is-4">{{ currentPlayer }}'s Turn</h2>
    <p class="subtitle is-6">Click STOP to select your lucky number!</p>

    <div class="spinner-container my-4">
      <div class="is-size-1 has-text-primary has-text-weight-bold">{{ displayNumber }}</div>
      <div class="mt-3">
        <button
            @click="stopSpinner"
            :disabled="!isSpinning"
            :class="['button', 'is-medium', isSpinning ? 'is-warning' : 'is-success']"
            ref="stopBtn"
        >
          {{ isSpinning ? '⏹️ STOP' : '✅ Selected!' }}
        </button>
      </div>
    </div>

    <div class="notification is-info is-light py-2">
      <p class="is-size-7">The spinner will auto-stop after 5 seconds if you don't click STOP.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { playTickSound, playDingSound, playWarningButtonSound, playSuccessButtonSound } from '../utils/audio'
import { playButtonClickEffect } from '../utils/effects'

const props = defineProps<{
  currentPlayer: string
}>()

const emit = defineEmits(['number-selected'])

const displayNumber = ref(3)
const isSpinning = ref(false)
const stopBtn = ref<HTMLElement>()
let spinInterval: number | null = null
let autoStopTimeout: number | null = null

const startSpinner = () => {
  isSpinning.value = true

  spinInterval = window.setInterval(() => {
    displayNumber.value = Math.floor(Math.random() * 8) + 3 // 3-10
    playTickSound()
  }, 100)

  autoStopTimeout = window.setTimeout(() => {
    stopSpinner()
  }, 5000)
}

const stopSpinner = () => {
  if (!isSpinning.value) return

  isSpinning.value = false

  if (spinInterval) {
    clearInterval(spinInterval)
    spinInterval = null
  }

  if (autoStopTimeout) {
    clearTimeout(autoStopTimeout)
    autoStopTimeout = null
  }

  // Play different sounds based on button state
  if (isSpinning.value) {
    playWarningButtonSound()
  } else {
    playSuccessButtonSound()
  }

  playButtonClickEffect(stopBtn.value)
  playDingSound()

  setTimeout(() => {
    emit('number-selected', displayNumber.value)
  }, 1000)
}

onMounted(() => {
  startSpinner()
})

onUnmounted(() => {
  if (spinInterval) clearInterval(spinInterval)
  if (autoStopTimeout) clearTimeout(autoStopTimeout)
})
</script>
