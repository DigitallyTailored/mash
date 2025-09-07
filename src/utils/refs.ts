import { ref, readonly } from 'vue'

// Single utility for DOM ref management
export function createRefManager<T = HTMLElement>() {
    const refs = ref<Record<string, T>>({})

    const setRef = (el: T | null, key: string) => {
        if (el) {
            refs.value[key] = el
        }
    }

    const getRef = (key: string): T | undefined => {
        return refs.value[key]
    }

    const clearRefs = () => {
        refs.value = {}
    }

    return { refs: readonly(refs), setRef, getRef, clearRefs }
}
