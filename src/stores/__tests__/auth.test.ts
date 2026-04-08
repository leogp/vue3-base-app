import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import * as authService from '@/services/auth.service'
import type { IAuthResponse } from '@/interfaces/auth'

const mockAuthResponse: IAuthResponse = {
  id: 42,
  username: 'johndoe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'male',
  image: 'https://example.com/avatar.png',
  accessToken: 'access-token-xyz',
  refreshToken: 'refresh-token-xyz',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('starts unauthenticated with empty fields', () => {
      const store = useAuthStore()
      expect(store.token).toBe('')
      expect(store.userId).toBeNull()
      expect(store.username).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
    })
  })

  describe('authUser', () => {
    it('populates store state and returns success redirect on valid credentials', async () => {
      vi.spyOn(authService, 'loginUser').mockResolvedValue(mockAuthResponse)

      const store = useAuthStore()
      const result = await store.authUser('johndoe', 'secret')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.redirect).toBe('/home')
      }
      expect(store.userId).toBe(42)
      expect(store.username).toBe('johndoe')
      expect(store.email).toBe('john@example.com')
      expect(store.firstName).toBe('John')
      expect(store.lastName).toBe('Doe')
      expect(store.token).toBe('access-token-xyz')
      expect(store.refreshToken).toBe('refresh-token-xyz')
      expect(store.isAuthenticated).toBe(true)
    })

    it('exposes user computed after successful login', async () => {
      vi.spyOn(authService, 'loginUser').mockResolvedValue(mockAuthResponse)
      const store = useAuthStore()
      await store.authUser('johndoe', 'secret')

      expect(store.user).toMatchObject({
        id: 42,
        username: 'johndoe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    it('returns failure with error when loginUser rejects', async () => {
      const apiError = { status: 401, message: 'Invalid credentials' }
      vi.spyOn(authService, 'loginUser').mockRejectedValue(apiError)

      const store = useAuthStore()
      const result = await store.authUser('wrong', 'wrong')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toEqual(apiError)
      }
      expect(store.token).toBe('')
      expect(store.isAuthenticated).toBe(false)
    })

    it('does not mutate store state on failure', async () => {
      vi.spyOn(authService, 'loginUser').mockRejectedValue({ status: 401, message: 'Bad' })
      const store = useAuthStore()
      await store.authUser('x', 'y')

      expect(store.userId).toBeNull()
      expect(store.user).toBeNull()
    })
  })

  describe('logout', () => {
    it('resets all fields to initial empty values', async () => {
      vi.spyOn(authService, 'loginUser').mockResolvedValue(mockAuthResponse)
      const store = useAuthStore()
      await store.authUser('johndoe', 'secret')
      expect(store.isAuthenticated).toBe(true)

      store.logout()

      expect(store.userId).toBeNull()
      expect(store.username).toBeNull()
      expect(store.email).toBe('')
      expect(store.firstName).toBe('')
      expect(store.lastName).toBe('')
      expect(store.token).toBe('')
      expect(store.refreshToken).toBe('')
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
    })
  })
})
