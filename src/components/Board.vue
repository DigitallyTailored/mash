<template>
  <div class="box">
    <!-- Setup Phase -->
    <div v-if="gamePhase === 'setup'">
      <h2 class="title is-4 has-text-centered">🎮 Game Setup</h2>

      <div class="columns">
        <div class="column">
          <h3 class="title is-5">Players</h3>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                  v-model="newPlayer"
                  @keyup.enter="addPlayer"
                  class="input is-small"
                  placeholder="Enter player name"
              >
            </div>
            <div class="control">
              <button @click="addPlayer" class="button is-primary is-small" ref="addPlayerBtn">Add</button>
            </div>
          </div>

          <div class="tags mt-2">
            <span
                v-for="(player, index) in players"
                :key="index"
                class="tag is-info"
            >
              {{ player }}
              <button @click="removePlayer(index)" class="delete is-small" ref="deletePlayerBtn"></button>
            </span>
          </div>
        </div>

        <div class="column is-narrow">
          <button @click="randomizeAll" class="button is-warning is-small" ref="randomizeBtn">
            🎲 Random
          </button>
          <button
              @click="startGame"
              class="button is-success is-small ml-2"
              ref="startGameBtn"
          >
            🚀 Start
          </button>
        </div>
      </div>
    </div>

    <!-- Elimination Phase -->
    <div v-if="gamePhase === 'elimination'">
      <h2 class="title is-4 has-text-centered">{{ currentPlayer }}'s Fortune</h2>
      <p class="subtitle is-6 has-text-centered">Lucky Number: {{ eliminationNumber }}</p>

      <div class="has-text-centered mb-3" v-if="isEliminating">
        <span class="tag is-warning">Counting... {{ countProgress }}</span>
      </div>
    </div>

    <!-- MASH Display -->
    <div class="has-text-centered mb-4">
      <div class="is-size-4 has-text-weight-bold">
        <span
            v-for="(letter, index) in mashLetters"
            :key="index"
            :ref="el => setMashRef(el, index)"
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

    <!-- Categories Grid - 3x2 Layout with animations -->
    <TransitionGroup name="card-slide" tag="div" class="columns is-multiline">
      <div
          class="column is-one-third card-container"
          v-for="(category, categoryIndex) in nonHouseCategories"
          :key="category.key"
          :style="{ animationDelay: `${categoryIndex * 150}ms` }"
      >
        <div class="card">
          <div class="card-header py-2">
            <div class="card-header-title is-size-6">{{ getCategoryTitle(category.key) }}</div>
            <div v-if="gamePhase === 'setup'" class="card-header-icon">
              <button @click="randomizeCategory(category.key)" class="button is-small is-light" :ref="el => setRandomizeCategoryBtnRef(el, category.key)">🎲</button>
            </div>
          </div>
          <div class="card-content py-2">
            <div v-if="gamePhase === 'setup'">
              <div class="field" v-for="(option, index) in category.options" :key="index">
                <div class="control">
                  <input
                      v-model="category.options[index]"
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
                  :ref="el => setOptionRef(el, category.key, index)"
                  :class="[
                  'mb-1', 'p-2', 'is-size-7', 'has-background-light',
                  {
                    'eliminated': eliminatedItems.has(`${category.key}-${index}`),
                    'counting': currentCount === `${category.key}-${index}`,
                    'last-remaining': isLastRemaining(category.key, index)
                  }
                ]"
              >
                {{ getCategoryEmoji(category.key) }} {{ option }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { getRandomOptions } from '../data/gameData'
import { playTickSound, playFanfareSound, playEliminationSound, playCategoryCompletedSound, playPrimaryButtonSound, playSuccessButtonSound, playWarningButtonSound, playDangerButtonSound, playLightButtonSound } from '../utils/audio'
import { playEliminationEffect, playCategoryCompletedEffect, playResultsFireworks, playButtonClickEffect } from '../utils/effects'
import { saveGameResult } from '../utils/storage'

const props = defineProps<{
  gamePhase: 'setup' | 'elimination'
  categories: any
  eliminationNumber?: number
  currentPlayer?: string
}>()

const emit = defineEmits(['start-game', 'elimination-complete'])

// Setup state
const newPlayer = ref('')
const players = ref<string[]>([])
const categories = ref(props.categories)

// DOM refs for positioning confetti
const mashRefs = ref<HTMLElement[]>([])
const optionRefs = ref<Record<string, HTMLElement>>({})
const addPlayerBtn = ref<HTMLElement>()
const deletePlayerBtn = ref<HTMLElement[]>([])
const randomizeBtn = ref<HTMLElement>()
const startGameBtn = ref<HTMLElement>()
const randomizeCategoryBtns = ref<Record<string, HTMLElement>>({})

const setMashRef = (el: HTMLElement | null, index: number) => {
  if (el) mashRefs.value[index] = el
}

const setOptionRef = (el: HTMLElement | null, categoryKey: string, index: number) => {
  if (el) optionRefs.value[`${categoryKey}-${index}`] = el
}

const setRandomizeCategoryBtnRef = (el: HTMLElement | null, categoryKey: string) => {
  if (el) randomizeCategoryBtns.value[categoryKey] = el
}

// Get category titles with emojis
const getCategoryTitle = (key: string) => {
  const titles: Record<string, string> = {
    spouse: '💕 Spouse',
    children: '👶 Children',
    job: '💼 Job',
    car: '🚗 Car',
    location: '📍 Location',
    salary: '💰 Salary'
  }
  return titles[key] || categories.value[key]?.title || ''
}

// Get category emojis for options
const getCategoryEmoji = (key: string) => {
  const emojis: Record<string, string> = {
    spouse: '💕',
    children: '👶',
    job: '💼',
    car: '🚗',
    location: '📍',
    salary: '💰'
  }
  return emojis[key] || ''
}

// Computed property to get non-house categories in order
const nonHouseCategories = computed(() => {
  const categoryOrder = ['spouse', 'children', 'job', 'car', 'location', 'salary']
  return categoryOrder.map(key => ({
    key,
    title: categories.value[key]?.title || '',
    options: categories.value[key]?.options || []
  })).filter(cat => cat.title)
})

// Elimination state
const mashLetters = ['M', 'A', 'S', 'H']
const houseOptions = ['Mansion', 'Apartment', 'Shack', 'House']
const eliminatedItems = ref(new Set<string>())
const currentCount = ref('')
const countProgress = ref(0)
const isEliminating = ref(false)
let allItems: string[] = []

// Setup methods with sound and confetti
const addPlayer = () => {
  if (newPlayer.value.trim() && !players.value.includes(newPlayer.value.trim())) {
    players.value.push(newPlayer.value.trim())
    newPlayer.value = ''
    playPrimaryButtonSound()
    playButtonClickEffect(addPlayerBtn.value)
  }
}

const removePlayer = (index: number) => {
  players.value.splice(index, 1)
  playDangerButtonSound()
  // Note: confetti effect for delete buttons will be added via event handling
}

const randomizeCategory = (key: string) => {
  categories.value[key].options = getRandomOptions(key)
  playWarningButtonSound()
  playButtonClickEffect(randomizeCategoryBtns.value[key])
}

const randomizeAll = () => {
  Object.keys(categories.value).forEach(key => {
    if (key !== 'house') {
      categories.value[key].options = getRandomOptions(key)
    }
  })
  playWarningButtonSound()
  playButtonClickEffect(randomizeBtn.value)
}

const startGame = () => {
  // Auto-add Player 1 if no players exist
  if (players.value.length === 0) {
    players.value.push('Player 1')
  }
  playSuccessButtonSound()
  playButtonClickEffect(startGameBtn.value)
  emit('start-game', players.value, categories.value)
}

// Method to check if an item is the last remaining in its category
const isLastRemaining = (categoryKey: string, index: number) => {
  if (props.gamePhase !== 'elimination') return false

  const itemKey = `${categoryKey}-${index}`
  if (eliminatedItems.value.has(itemKey)) return false

  // Count remaining items in this category
  let remainingCount = 0
  if (categoryKey === 'house') {
    mashLetters.forEach((_, i) => {
      if (!eliminatedItems.value.has(`house-${i}`)) {
        remainingCount++
      }
    })
  } else {
    props.categories[categoryKey]?.options.forEach((_: string, i: number) => {
      if (!eliminatedItems.value.has(`${categoryKey}-${i}`)) {
        remainingCount++
      }
    })
  }

  return remainingCount === 1
}

// Check if eliminating this item will complete a category
const willCompleteCategory = (itemKey: string) => {
  const [categoryKey] = itemKey.split('-')

  // Count remaining items in this category (before elimination)
  let remainingCount = 0
  if (categoryKey === 'house') {
    mashLetters.forEach((_, i) => {
      if (!eliminatedItems.value.has(`house-${i}`)) {
        remainingCount++
      }
    })
  } else {
    props.categories[categoryKey]?.options.forEach((_: string, i: number) => {
      if (!eliminatedItems.value.has(`${categoryKey}-${i}`)) {
        remainingCount++
      }
    })
  }

  // Will complete if exactly 2 remain (after elimination, 1 will remain)
  return remainingCount === 2
}

// Get DOM element for positioning confetti
const getElementForItem = (itemKey: string): HTMLElement | undefined => {
  const [categoryKey, indexStr] = itemKey.split('-')
  const index = parseInt(indexStr)

  if (categoryKey === 'house') {
    return mashRefs.value[index]
  } else {
    return optionRefs.value[itemKey]
  }
}

// Elimination methods
const buildItemsList = () => {
  allItems = []

  // Add MASH letters
  mashLetters.forEach((_, index) => {
    allItems.push(`house-${index}`)
  })

  // Add other categories in the same order as displayed using the existing computed property
  nonHouseCategories.value.forEach(category => {
    category.options.forEach((_: string, index: number) => {
      allItems.push(`${category.key}-${index}`)
    })
  })
}

const getRemainingItems = () => {
  return allItems.filter(item => !eliminatedItems.value.has(item))
}

const getRemainingItemsByCategory = () => {
  const categoryGroups: Record<string, string[]> = {}

  const remaining = getRemainingItems()
  remaining.forEach(item => {
    const [category] = item.split('-')
    if (!categoryGroups[category]) {
      categoryGroups[category] = []
    }
    categoryGroups[category].push(item)
  })

  return categoryGroups
}

const getEliminableItems = () => {
  const categoryGroups = getRemainingItemsByCategory()
  const eliminable: string[] = []

  // Only include items from categories that have more than 1 item remaining
  Object.entries(categoryGroups).forEach(([category, items]) => {
    if (items.length > 1) {
      eliminable.push(...items)
    }
  })

  return eliminable
}

const isGameComplete = () => {
  const categoryGroups = getRemainingItemsByCategory()
  const requiredCategories = ['house', 'spouse', 'children', 'job', 'car', 'location', 'salary']

  return requiredCategories.every(category =>
      categoryGroups[category] && categoryGroups[category].length === 1
  )
}

const getFinalResults = () => {
  const categoryGroups = getRemainingItemsByCategory()
  const results: any = {}

  Object.entries(categoryGroups).forEach(([category, items]) => {
    if (items.length === 1) {
      const [cat, indexStr] = items[0].split('-')
      const index = parseInt(indexStr)

      if (cat === 'house') {
        // Return the full house name, not just the letter
        results.house = houseOptions[index]
      } else {
        results[cat] = props.categories[cat].options[index]
      }
    }
  })

  return results
}

const startElimination = async () => {
  buildItemsList()
  isEliminating.value = true

  let currentIndex = 0

  while (!isGameComplete()) {
    const eliminable = getEliminableItems()

    if (eliminable.length === 0) {
      break // Safety check
    }

    // Count and eliminate - with positioned firework effects
    for (let i = 0; i < props.eliminationNumber!; i++) {
      if (currentIndex >= eliminable.length) {
        currentIndex = 0
      }

      currentCount.value = eliminable[currentIndex]
      countProgress.value = i + 1
      playTickSound()

      await new Promise(resolve => setTimeout(resolve, 200))

      if (i === props.eliminationNumber! - 1) {
        const eliminatedItemKey = eliminable[currentIndex]
        const willComplete = willCompleteCategory(eliminatedItemKey)
        const element = getElementForItem(eliminatedItemKey)

        eliminatedItems.value.add(eliminatedItemKey)
        currentCount.value = ''

        if (willComplete) {
          // 🎆 Category completed - bigger effect and sound
          playCategoryCompletedSound()
          playCategoryCompletedEffect(element)
          await new Promise(resolve => setTimeout(resolve, 800))
        } else {
          // 🎆 Regular elimination - smaller effect and sound
          playEliminationSound()
          playEliminationEffect(element)
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } else {
        currentIndex++
      }
    }

    // Reset index for next round
    const newEliminable = getEliminableItems()
    if (currentIndex >= newEliminable.length) {
      currentIndex = 0
    }
  }

  // Game complete - play big fireworks celebration
  const finalResults = getFinalResults()
  playFanfareSound()

  // Big fireworks celebration for final results
  playResultsFireworks()

  saveGameResult(props.currentPlayer!, finalResults)
  emit('elimination-complete', finalResults)
}

// Add event listeners for delete buttons to handle confetti
onMounted(() => {
  // Add event delegation for delete buttons since they're dynamically created
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('delete')) {
      playButtonClickEffect(target)
    }
  })
})

// Watchers
watch(() => props.categories, (newCategories) => {
  categories.value = newCategories
}, { deep: true })

onMounted(() => {
  if (props.gamePhase === 'elimination') {
    eliminatedItems.value.clear()
    setTimeout(startElimination, 1000)
  }
})

watch(() => props.gamePhase, (newPhase) => {
  if (newPhase === 'elimination') {
    eliminatedItems.value.clear()
    setTimeout(startElimination, 1000)
  }
})
</script>
