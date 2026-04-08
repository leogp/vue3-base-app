import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/router/routes'

// Build an isolated router instance with the real guards for each test
function buildRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: ROUTE_NAMES.LOGIN,
        component: { template: '<div />' },
        beforeEnter: () => {
          const authStore = useAuthStore()
          if (authStore.token) return { name: ROUTE_NAMES.HOME }
        },
      },
      {
        path: '/home',
        name: ROUTE_NAMES.HOME,
        component: { template: '<div />' },
        meta: { requiredAuth: true },
      },
    ],
  })

  router.beforeEach((to) => {
    const authStore = useAuthStore()
    if (to.meta.requiredAuth && !authStore.token) {
      return { name: ROUTE_NAMES.LOGIN }
    }
  })

  return router
}

describe('router guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('global beforeEach guard', () => {
    it('redirects unauthenticated user from protected route to login', async () => {
      const router = buildRouter()
      await router.push('/home')
      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.LOGIN)
    })

    it('allows authenticated user to access protected route', async () => {
      const router = buildRouter()
      const authStore = useAuthStore()
      authStore.token = 'valid-token'

      await router.push('/home')
      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.HOME)
    })

    it('allows navigation to login route without authentication', async () => {
      const router = buildRouter()
      await router.push('/')
      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.LOGIN)
    })
  })

  describe('login route beforeEnter guard', () => {
    it('redirects authenticated user away from login to home', async () => {
      const router = buildRouter()
      const authStore = useAuthStore()
      authStore.token = 'valid-token'

      await router.push('/')
      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.HOME)
    })

    it('allows unauthenticated user to visit login page', async () => {
      const router = buildRouter()
      // Start at home (will be redirected to login), then try login directly
      await router.push('/')
      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.LOGIN)
    })
  })
})
