<template>
  <div>
    <h2 class="title is-4 has-text-centered">{{ currentPlayer }}'s Fortune</h2>
    <p class="subtitle is-6 has-text-centered">Lucky Number: {{ eliminationNumber }}</p>

    <div class="has-text-centered mb-3" v-if="isEliminating">
      <span class="tag is-warning">Counting... {{ countProgress }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPlayer: string
  eliminationNumber: number
  isEliminating: boolean
  countProgress: number
}>()
</script>
