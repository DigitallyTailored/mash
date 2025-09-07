<template>
  <div class="box">
    <!-- Setup Phase -->
    <SetupPhase
        v-if="gamePhase === 'setup'"
        :players="players"
        :categories="categories"
        @update:players="players = $event"
        @randomize-all="randomizeAll"
        @start-game="startGame"
    />

    <!-- Elimination Phase -->
    <EliminationPhase
        v-if="gamePhase === 'elimination'"
        :current-player="currentPlayer!"
        :elimination-number="eliminationNumber!"
        :is-eliminating="isEliminating"
        :count-progress="countProgress"
    />

    <!-- MASH Display (shown in elimination phase) -->
    <MashDisplay
        v-if="gamePhase === 'elimination'"
        ref="mashDisplayRef"
        :eliminated-items="eliminatedItems"
        :current-count="currentCount"
        :is-last-remaining="isLastRemaining"
    />

    <!-- Categories Grid -->
    <CategoriesGrid
        ref="categoriesGridRef"
        :categories="displayCategories"
        :game-phase="gamePhase"
        :eliminated-items="eliminatedItems"
        :current-count="currentCount"
        :is-last-remaining="isLastRemaining"
        @randomize-category="randomizeCategory"
        @update-option="updateCategoryOption"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import SetupPhase from './SetupPhase.vue'
import EliminationPhase from './EliminationPhase.vue'
import MashDisplay from './MashDisplay.vue'
import CategoriesGrid from './CategoriesGrid.vue'
import { getRandomOptions } from '../data/gameData'
import { GAME_CONSTANTS, CATEGORIES, type CategoryKey } from '../constants/gameConstants'
import { playTickSound, playFanfareSound, playEliminationSound, playCategoryCompletedSound } from '../utils/audio'
import { playEliminationEffect, playCategoryCompletedEffect, playResultsFireworks } from '../utils/effects'
import { saveGameResult } from '../utils/storage'

const props = defineProps<{
  gamePhase: 'setup' | 'elimination'
  categories: any
  eliminationNumber?: number
  currentPlayer?: string
}>()

const emit = defineEmits(['start-game', 'elimination-complete'])

// Setup state
const players = ref<string[]>([])
const categories = ref(props.categories)

// Component refs
const mashDisplayRef = ref()
const categoriesGridRef = ref()

// Elimination state
const eliminatedItems = ref(new Set<string>())
const currentCount = ref('')
const countProgress = ref(0)
const isEliminating = ref(false)
let allItems: string[] = []

// Computed properties
const displayCategories = computed(() => {
  return GAME_CONSTANTS.CATEGORY_ORDER.map(key => ({
    key,
    title: CATEGORIES[key as CategoryKey].title,
    emoji: CATEGORIES[key as CategoryKey].emoji,
    options: categories.value[key]?.options || []
  })).filter(cat => cat.options.length > 0)
})

// Setup methods
const randomizeCategory = (key: string) => {
  if (categories.value[key]) {
    categories.value[key].options = getRandomOptions(key)
  }
}

const randomizeAll = () => {
  Object.keys(categories.value).forEach(key => {
    if (key !== 'house') {
      randomizeCategory(key)
    }
  })
}

const updateCategoryOption = (categoryKey: string, index: number, value: string) => {
  if (categories.value[categoryKey]?.options) {
    categories.value[categoryKey].options[index] = value
  }
}

const startGame = (playerList: string[], gameCategories: any) => {
  emit('start-game', playerList, gameCategories)
}

// Elimination methods
const isLastRemaining = (categoryKey: string, index: number) => {
  if (props.gamePhase !== 'elimination') return false

  const itemKey = `${categoryKey}-${index}`
  if (eliminatedItems.value.has(itemKey)) return false

  let remainingCount = 0
  if (categoryKey === 'house') {
    GAME_CONSTANTS.MASH_LETTERS.forEach((_, i) => {
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

const getElementForItem = (itemKey: string): HTMLElement | undefined => {
  const [categoryKey, indexStr] = itemKey.split('-')

  if (categoryKey === 'house') {
    return mashDisplayRef.value?.getRef?.(itemKey)
  } else {
    return categoriesGridRef.value?.getRef?.(itemKey)
  }
}

const buildItemsList = () => {
  allItems = []

  // Add MASH letters
  GAME_CONSTANTS.MASH_LETTERS.forEach((_, index) => {
    allItems.push(`house-${index}`)
  })

  // Add other categories
  displayCategories.value.forEach(category => {
    category.options.forEach((_: string, index: number) => {
      allItems.push(`${category.key}-${index}`)
    })
  })
}

const startElimination = async () => {
  buildItemsList()
  isEliminating.value = true

  let currentIndex = 0

  while (!isGameComplete()) {
    const eliminable = getEliminableItems()
    if (eliminable.length === 0) break

    // Elimination logic with improved timing
    for (let i = 0; i < props.eliminationNumber!; i++) {
      if (currentIndex >= eliminable.length) {
        currentIndex = 0
      }

      currentCount.value = eliminable[currentIndex]
      countProgress.value = i + 1
      playTickSound()

      await new Promise(resolve => setTimeout(resolve, GAME_CONSTANTS.ELIMINATION_TIMING.TICK_DELAY))

      if (i === props.eliminationNumber! - 1) {
        await handleElimination(eliminable[currentIndex])
      } else {
        currentIndex++
      }
    }

    const newEliminable = getEliminableItems()
    if (currentIndex >= newEliminable.length) {
      currentIndex = 0
    }
  }

  await handleGameComplete()
}

const handleElimination = async (itemKey: string) => {
  const willComplete = willCompleteCategory(itemKey)
  const element = getElementForItem(itemKey)

  eliminatedItems.value.add(itemKey)
  currentCount.value = ''

  if (willComplete) {
    playCategoryCompletedSound()
    playCategoryCompletedEffect(element)
    await new Promise(resolve => setTimeout(resolve, GAME_CONSTANTS.ELIMINATION_TIMING.CATEGORY_COMPLETE_DELAY))
  } else {
    playEliminationSound()
    playEliminationEffect(element)
    await new Promise(resolve => setTimeout(resolve, GAME_CONSTANTS.ELIMINATION_TIMING.ELIMINATION_DELAY))
  }
}

const handleGameComplete = async () => {
  const finalResults = getFinalResults()
  playFanfareSound()
  playResultsFireworks()
  saveGameResult(props.currentPlayer!, finalResults)
  emit('elimination-complete', finalResults)
}

// Helper methods (simplified versions of the original complex logic)
const willCompleteCategory = (itemKey: string) => {
  const [categoryKey] = itemKey.split('-')
  let remainingCount = 0

  if (categoryKey === 'house') {
    GAME_CONSTANTS.MASH_LETTERS.forEach((_, i) => {
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

  return remainingCount === 2
}

const getRemainingItems = () => {
  return allItems.filter(item => !eliminatedItems.value.has(item))
}

const getEliminableItems = () => {
  const categoryGroups: Record<string, string[]> = {}
  const remaining = getRemainingItems()

  remaining.forEach(item => {
    const [category] = item.split('-')
    if (!categoryGroups[category]) {
      categoryGroups[category] = []
    }
    categoryGroups[category].push(item)
  })

  const eliminable: string[] = []
  Object.entries(categoryGroups).forEach(([category, items]) => {
    if (items.length > 1) {
      eliminable.push(...items)
    }
  })

  return eliminable
}

const isGameComplete = () => {
  const categoryGroups: Record<string, string[]> = {}
  const remaining = getRemainingItems()

  remaining.forEach(item => {
    const [category] = item.split('-')
    if (!categoryGroups[category]) {
      categoryGroups[category] = []
    }
    categoryGroups[category].push(item)
  })

  const requiredCategories = ['house', ...GAME_CONSTANTS.CATEGORY_ORDER]
  return requiredCategories.every(category =>
      categoryGroups[category] && categoryGroups[category].length === 1
  )
}

const getFinalResults = () => {
  const categoryGroups: Record<string, string[]> = {}
  const remaining = getRemainingItems()

  remaining.forEach(item => {
    const [category] = item.split('-')
    if (!categoryGroups[category]) {
      categoryGroups[category] = []
    }
    categoryGroups[category].push(item)
  })

  const results: any = {}
  Object.entries(categoryGroups).forEach(([category, items]) => {
    if (items.length === 1) {
      const [cat, indexStr] = items[0].split('-')
      const index = parseInt(indexStr)

      if (cat === 'house') {
        results.house = GAME_CONSTANTS.HOUSE_OPTIONS[index]
      } else {
        results[cat] = props.categories[cat].options[index]
      }
    }
  })

  return results
}

// Watchers and lifecycle
watch(() => props.categories, (newCategories) => {
  categories.value = newCategories
}, { deep: true })

onMounted(() => {
  if (props.gamePhase === 'elimination') {
    eliminatedItems.value.clear()
    setTimeout(startElimination, GAME_CONSTANTS.ELIMINATION_TIMING.GAME_START_DELAY)
  }
})

watch(() => props.gamePhase, (newPhase) => {
  if (newPhase === 'elimination') {
    eliminatedItems.value.clear()
    setTimeout(startElimination, GAME_CONSTANTS.ELIMINATION_TIMING.GAME_START_DELAY)
  }
})
</script>
