import { ref, watch } from 'vue'
import type { IPostFilter } from '@/interfaces/post'

export function usePostFilters(onChange: (filters: IPostFilter) => void) {
  const search = ref('')
  const userId = ref<number | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function scheduleEmit() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      onChange({ userId: userId.value, search: search.value })
    }, 300)
  }

  watch(search, scheduleEmit)
  watch(userId, scheduleEmit)

  function reset() {
    search.value = ''
    userId.value = null
  }

  return { search, userId, reset }
}
