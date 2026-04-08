import { describe, it, expect, vi } from 'vitest'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

describe('useConfirmDialog', () => {
  it('starts closed with no pending item', () => {
    const { isOpen, pending } = useConfirmDialog<string>()
    expect(isOpen.value).toBe(false)
    expect(pending.value).toBeNull()
  })

  it('open sets isOpen to true and stores the item', () => {
    const { isOpen, pending, open } = useConfirmDialog<string>()
    open('test-item')
    expect(isOpen.value).toBe(true)
    expect(pending.value).toBe('test-item')
  })

  it('close sets isOpen to false and clears pending', () => {
    const { isOpen, pending, open, close } = useConfirmDialog<string>()
    open('item')
    close()
    expect(isOpen.value).toBe(false)
    expect(pending.value).toBeNull()
  })

  it('confirm calls the action with the pending item and clears state', async () => {
    const { isOpen, pending, open, confirm } = useConfirmDialog<number>()
    open(42)
    const action = vi.fn().mockResolvedValue(undefined)
    await confirm(action)

    expect(action).toHaveBeenCalledWith(42)
    expect(isOpen.value).toBe(false)
    expect(pending.value).toBeNull()
  })

  it('confirm does nothing when no pending item is set', async () => {
    const { confirm } = useConfirmDialog<number>()
    const action = vi.fn()
    await confirm(action)
    expect(action).not.toHaveBeenCalled()
  })
})
