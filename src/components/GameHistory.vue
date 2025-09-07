<template>
  <div class="card mt-4">
    <div class="card-header py-2">
      <div class="card-header-title is-size-6">📚 Game History</div>
      <div class="card-header-icon">
        <button @click="clearHistory" class="button is-small is-danger" ref="clearBtn">
          Clear
        </button>
      </div>
    </div>
    <div class="card-content py-3">
      <div v-if="history.length === 0" class="has-text-centered is-size-7">
        No games played yet!
      </div>
      <div v-else>
        <div
            v-for="(game, index) in history.slice().reverse()"
            :key="index"
            class="box py-2 mb-2"
        >
          <div class="level mb-2">
            <div class="level-left">
              <div class="level-item">
                <strong class="is-size-6">{{ game.player }}</strong>
              </div>
              <div class="level-item">
                <small class="is-size-7">{{ formatDate(game.timestamp) }}</small>
              </div>
            </div>
          </div>
          <!-- Changed to 2 rows instead of 3 -->
          <div class="columns is-multiline is-mobile">
            <div class="column is-half-mobile is-half-tablet is-3-desktop" v-for="(value, key) in game.result" :key="key">
              <small class="is-size-7">{{ formatLabel(key) }}:</small><br>
              <span class="is-size-7 has-text-weight-semibold">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGameHistory, clearGameHistory } from '../utils/storage'
import { playDangerButtonSound } from '../utils/audio'
import { playButtonClickEffect } from '../utils/effects'

const history = ref<any[]>([])
const clearBtn = ref<HTMLElement>()

const loadHistory = () => {
  history.value = getGameHistory()
}

const clearHistory = () => {
  clearGameHistory()
  history.value = []
  playDangerButtonSound()
  playButtonClickEffect(clearBtn.value)
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

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

onMounted(() => {
  loadHistory()
})
</script>
