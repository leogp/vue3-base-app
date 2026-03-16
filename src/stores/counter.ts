import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // estado
  const count = ref(0)
  // getters
  const doubleCount = computed(() => count.value * 2)
  // acciones
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
