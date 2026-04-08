import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePostFilters } from '@/composables/usePostFilters'

describe('usePostFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes search and userId as empty/null', () => {
    const { search, userId } = usePostFilters(() => {})
    expect(search.value).toBe('')
    expect(userId.value).toBeNull()
  })

  it('calls onChange after debounce when search changes', async () => {
    const onChange = vi.fn()
    const { search } = usePostFilters(onChange)

    search.value = 'hello'
    await vi.runAllTimersAsync()

    expect(onChange).toHaveBeenCalledWith({ userId: null, search: 'hello' })
  })

  it('calls onChange after debounce when userId changes', async () => {
    const onChange = vi.fn()
    const { userId } = usePostFilters(onChange)

    userId.value = 5
    await vi.runAllTimersAsync()

    expect(onChange).toHaveBeenCalledWith({ userId: 5, search: '' })
  })

  it('debounces multiple rapid changes into a single call', async () => {
    const onChange = vi.fn()
    const { search } = usePostFilters(onChange)

    search.value = 'a'
    search.value = 'ab'
    search.value = 'abc'
    await vi.runAllTimersAsync()

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({ userId: null, search: 'abc' })
  })

  it('reset clears search and userId', async () => {
    const onChange = vi.fn()
    const { search, userId, reset } = usePostFilters(onChange)

    search.value = 'something'
    userId.value = 3
    await vi.runAllTimersAsync()

    reset()
    expect(search.value).toBe('')
    expect(userId.value).toBeNull()
  })
})
