<template>
  <TransitionGroup name="card-slide" tag="div" class="columns is-multiline">
    <div
        class="column is-one-third card-container"
        v-for="(category, categoryIndex) in categories"
        :key="category.key"
        :style="{ animationDelay: `${categoryIndex * 150}ms` }"
    >
      <div class="card">
        <div class="card-header py-2">
          <div class="card-header-title is-size-6">{{ category.title }}</div>
          <div v-if="gamePhase === 'setup'" class="card-header-icon">
            <button @click="handleRandomizeCategory(category.key)" class="button is-small is-light" :ref="el => setRef(el, `randomize-${category.key}`)">
              🎲
            </button>
          </div>
        </div>
        <div class="card-content py-2">
          <div v-if="gamePhase === 'setup'">
            <div class="field" v-for="(option, index) in category.options" :key="index">
              <div class="control">
                <input
                    :value="option"
                    @input="handleOptionUpdate(category.key, index, ($event.target as HTMLInputElement).value)"
                    class="input is-small"
                    :placeholder="`Option ${index + 1}`"
                >
              </div>
            </div>
          </div>
          <div v-else>
            <div
                v-for="(option, index) in category.options"
                :key="`${category.key}-${index}`"
                :ref="el => setRef(el, `${category.key}-${index}`)"
                :class="[
                'mb-1', 'p-2', 'is-size-7', 'has-background-light',
                {
                  'eliminated': eliminatedItems.has(`${category.key}-${index}`),
                  'counting': currentCount === `${category.key}-${index}`,
                  'last-remaining': isLastRemaining(category.key, index)
                }
              ]"
            >
              {{ category.emoji }} {{ option }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { createRefManager } from '../utils/refs'
import { playWarningButtonSound, playLightButtonSound } from '../utils/audio'
import { playButtonClickEffect } from '../utils/effects'

const props = defineProps<{
  categories: Array<{
    key: string
    title: string
    emoji: string
    options: string[]
  }>
  gamePhase: 'setup' | 'elimination'
  eliminatedItems?: Set<string>
  currentCount?: string
  isLastRemaining?: (categoryKey: string, index: number) => boolean
}>()

const emit = defineEmits(['randomize-category', 'update-option'])

const { setRef, getRef } = createRefManager<HTMLElement>()

const handleRandomizeCategory = (categoryKey: string) => {
  emit('randomize-category', categoryKey)
  playWarningButtonSound()
  playButtonClickEffect(getRef(`randomize-${categoryKey}`))
}

const handleOptionUpdate = (categoryKey: string, index: number, value: string) => {
  emit('update-option', categoryKey, index, value)
}

defineExpose({ getRef })
</script>
