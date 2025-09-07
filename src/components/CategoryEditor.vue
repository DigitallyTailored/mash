<template>
  <div class="card">
    <div class="card-header">
      <div class="card-header-title">{{ title }}</div>
      <div class="card-header-icon">
        <button @click="randomize" class="button is-small is-light">🎲</button>
      </div>
    </div>
    <div class="card-content">
      <div class="field" v-for="(option, index) in localOptions" :key="index">
        <div class="control">
          <input
              v-model="localOptions[index]"
              @input="updateOptions"
              class="input is-small"
              :placeholder="`Option ${index + 1}`"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  title: string
  options: string[]
}>()

const emit = defineEmits(['update', 'randomize'])

const localOptions = ref([...props.options])

const updateOptions = () => {
  emit('update', [...localOptions.value])
}

const randomize = () => {
  emit('randomize')
}

watch(() => props.options, (newOptions) => {
  localOptions.value = [...newOptions]
}, { deep: true })
</script>
