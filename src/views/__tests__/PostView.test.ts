import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import PostView from '@/views/PostView.vue'
import * as postsService from '@/services/posts.service'
import { ROUTE_NAMES } from '@/router/routes'

function setup(path = '/home/form-post') {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/home/form-post/:id?',
        name: ROUTE_NAMES.FORM_POST,
        component: PostView,
      },
      { path: '/home/posts', name: ROUTE_NAMES.POSTS, component: { template: '<div />' } },
    ],
  })

  const vuetify = createVuetify({ components, directives })
  return { pinia, router, vuetify, path }
}

describe('PostView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows "New Post" breadcrumb when no id param', async () => {
    const { pinia, router, vuetify, path } = setup('/home/form-post')
    await router.push(path)
    render(PostView, { global: { plugins: [pinia, router, vuetify] } })

    // The breadcrumb span contains "Posts / New Post"
    expect(screen.getByText(/posts \/ new post/i)).toBeInTheDocument()
  })

  it('shows "Edit #5" breadcrumb when id param is 5', async () => {
    vi.spyOn(postsService, 'fetchPost').mockResolvedValue({
      id: 5,
      userId: 1,
      title: 'Test',
      body: 'Content',
    })

    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post/5')
    render(PostView, { global: { plugins: [pinia, router, vuetify] } })

    await waitFor(() => {
      expect(screen.getByText(/edit #5/i)).toBeInTheDocument()
    })
  })

  it('fetches post data when id param is present', async () => {
    const spy = vi.spyOn(postsService, 'fetchPost').mockResolvedValue({
      id: 5,
      userId: 1,
      title: 'Test',
      body: 'Content',
    })

    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post/5')
    render(PostView, { global: { plugins: [pinia, router, vuetify] } })

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('5')
    })
  })

  it('does not fetch post data when no id param', async () => {
    const spy = vi.spyOn(postsService, 'fetchPost').mockResolvedValue({
      id: 1,
      userId: 1,
      title: 'T',
      body: 'B',
    })

    const { pinia, router, vuetify, path } = setup('/home/form-post')
    await router.push(path)
    render(PostView, { global: { plugins: [pinia, router, vuetify] } })

    // Allow component to mount fully
    await new Promise((r) => setTimeout(r, 50))
    expect(spy).not.toHaveBeenCalled()
  })

  it('renders a Back button', async () => {
    const { pinia, router, vuetify, path } = setup('/home/form-post')
    await router.push(path)
    render(PostView, { global: { plugins: [pinia, router, vuetify] } })
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })
})
