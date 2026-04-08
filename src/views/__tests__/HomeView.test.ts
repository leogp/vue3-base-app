import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/router/routes'

function setup(initialPath = '/home') {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/home',
        name: ROUTE_NAMES.HOME,
        component: HomeView,
        children: [
          { path: 'posts', name: ROUTE_NAMES.POSTS, component: { template: '<div>PostsView</div>' } },
          {
            path: 'form-post/:id?',
            name: ROUTE_NAMES.FORM_POST,
            component: { template: '<div />' },
          },
        ],
      },
      { path: '/', name: ROUTE_NAMES.LOGIN, component: { template: '<div />' } },
    ],
  })

  const vuetify = createVuetify({ components, directives })
  return { pinia, router, vuetify, initialPath }
}

describe('HomeView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('displays the authenticated user\'s first and last name', async () => {
    const { pinia, router, vuetify, initialPath } = setup()
    await router.push(initialPath)

    const authStore = useAuthStore()
    authStore.firstName = 'Jane'
    authStore.lastName = 'Smith'
    authStore.email = 'jane@example.com'
    authStore.userId = 7

    render(HomeView, { global: { plugins: [pinia, router, vuetify] } })

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('displays the user email', async () => {
    const { pinia, router, vuetify, initialPath } = setup()
    await router.push(initialPath)

    const authStore = useAuthStore()
    authStore.email = 'jane@example.com'
    authStore.firstName = 'Jane'
    authStore.lastName = 'Smith'

    render(HomeView, { global: { plugins: [pinia, router, vuetify] } })

    await waitFor(() => {
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })
  })

  it('renders a "Go to Posts" button on the home dashboard', async () => {
    const { pinia, router, vuetify, initialPath } = setup()
    await router.push(initialPath)

    render(HomeView, { global: { plugins: [pinia, router, vuetify] } })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /go to posts/i })).toBeInTheDocument()
    })
  })

  it('"Go to Posts" button navigates to posts route', async () => {
    const { pinia, router, vuetify, initialPath } = setup()
    await router.push(initialPath)

    render(HomeView, { global: { plugins: [pinia, router, vuetify] } })

    const btn = await screen.findByRole('button', { name: /go to posts/i })
    await fireEvent.click(btn)

    await waitFor(() => {
      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.POSTS)
    })
  })

  it('renders stat cards with User ID and Member Since', async () => {
    const { pinia, router, vuetify, initialPath } = setup()
    await router.push(initialPath)

    const authStore = useAuthStore()
    authStore.userId = 99

    render(HomeView, { global: { plugins: [pinia, router, vuetify] } })

    await waitFor(() => {
      expect(screen.getByText('User ID')).toBeInTheDocument()
      expect(screen.getByText('Member Since')).toBeInTheDocument()
      expect(screen.getByText('99')).toBeInTheDocument()
    })
  })
})
