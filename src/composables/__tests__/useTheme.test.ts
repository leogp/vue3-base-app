import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('useTheme', () => {
  beforeEach(() => {
    // Reset module state between tests by clearing localStorage mock
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('initializes isDark as false when localStorage has no theme', async () => {
    const { useTheme } = await import('@/composables/useTheme')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(false)
  })

  it('toggle flips isDark from false to true', async () => {
    const { useTheme } = await import('@/composables/useTheme')
    const { isDark, toggle } = useTheme()
    toggle()
    expect(isDark.value).toBe(true)
  })

  it('toggle flips isDark back to false on second call', async () => {
    const { useTheme } = await import('@/composables/useTheme')
    const { isDark, toggle } = useTheme()
    toggle()
    toggle()
    expect(isDark.value).toBe(false)
  })
})
