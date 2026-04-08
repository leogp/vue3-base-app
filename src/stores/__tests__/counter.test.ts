import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter'

describe('useCounterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes count at zero', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('increments count by one on each call', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
    store.increment()
    expect(store.count).toBe(2)
  })

  it('doubleCount returns twice the count value', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    store.increment()
    expect(store.doubleCount).toBe(6)
  })

  it('doubleCount is 0 when count is 0', () => {
    const store = useCounterStore()
    expect(store.doubleCount).toBe(0)
  })
})
