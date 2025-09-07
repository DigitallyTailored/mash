<template>
  <div class="has-text-centered mb-4">
    <div class="is-size-4 has-text-weight-bold">
      <span
          v-for="(letter, index) in mashLetters"
          :key="index"
          :ref="el => setRef(el, `house-${index}`)"
          :class="[
          'mx-2',
          {
            'eliminated': eliminatedItems.has(`house-${index}`),
            'counting': currentCount === `house-${index}`,
            'last-remaining': isLastRemaining('house', index)
          }
        ]"
      >
        🏠 {{ letter }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createRefManager } from '../utils/refs'
import { GAME_CONSTANTS } from '../constants/gameConstants'

defineProps<{
  eliminatedItems: Set<string>
  currentCount: string
  isLastRemaining: (categoryKey: string, index: number) => boolean
}>()

defineExpose({
  getRef: createRefManager<HTMLElement>().getRef
})

const mashLetters = GAME_CONSTANTS.MASH_LETTERS
const { setRef } = createRefManager<HTMLElement>()
</script>
