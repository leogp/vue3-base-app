import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/router/routes'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  async function login(username: string, password: string): Promise<string | null> {
    const result = await authStore.authUser(username, password)
    if (result.success) {
      return null
    }
    return `${result.error.status}: ${result.error.message}`
  }

  function logout() {
    authStore.logout()
    router.push({ name: ROUTE_NAMES.LOGIN })
  }

  return {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    login,
    logout,
  }
}
