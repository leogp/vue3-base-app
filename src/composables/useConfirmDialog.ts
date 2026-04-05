import { ref } from 'vue'

export function useConfirmDialog<T>() {
  const isOpen = ref(false)
  const pending = ref<T | null>(null)

  function open(item: T) {
    pending.value = item
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    pending.value = null
  }

  async function confirm(action: (item: T) => Promise<unknown> | unknown) {
    if (!pending.value) return
    const item = pending.value
    close()
    await action(item)
  }

  return { isOpen, pending, open, close, confirm }
}
