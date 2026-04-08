import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import PostsView from '@/views/PostsView.vue'
import { usePostsStore } from '@/stores/posts'
import { ROUTE_NAMES } from '@/router/routes'
import * as postsService from '@/services/posts.service'

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory('/'),
    routes: [
      { path: '/home/posts', name: ROUTE_NAMES.POSTS, component: PostsView },
      {
        path: '/home/form-post/:id?',
        name: ROUTE_NAMES.FORM_POST,
        component: { template: '<div />' },
      },
    ],
  })

  const vuetify = createVuetify({ components, directives })
  return { pinia, router, vuetify }
}

describe('PostsView', () => {
  beforeEach(() => {
    vi.spyOn(postsService, 'fetchPosts').mockResolvedValue([])
    vi.restoreAllMocks()
  })

  it('renders a "Posts" heading', async () => {
    vi.spyOn(postsService, 'fetchPosts').mockResolvedValue([])
    const { pinia, router, vuetify } = setup()
    await router.push('/home/posts')
    render(PostsView, { global: { plugins: [pinia, router, vuetify] } })
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })

  it('renders a "New Post" button', async () => {
    vi.spyOn(postsService, 'fetchPosts').mockResolvedValue([])
    const { pinia, router, vuetify } = setup()
    await router.push('/home/posts')
    render(PostsView, { global: { plugins: [pinia, router, vuetify] } })
    expect(screen.getByRole('button', { name: /new post/i })).toBeInTheDocument()
  })

  it('calls postsStore.loadPosts on mount', async () => {
    const spy = vi.spyOn(postsService, 'fetchPosts').mockResolvedValue([])
    const { pinia, router, vuetify } = setup()
    await router.push('/home/posts')
    render(PostsView, { global: { plugins: [pinia, router, vuetify] } })

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  it('navigates to form-post route when "New Post" is clicked', async () => {
    vi.spyOn(postsService, 'fetchPosts').mockResolvedValue([])
    const { pinia, router, vuetify } = setup()
    await router.push('/home/posts')
    render(PostsView, { global: { plugins: [pinia, router, vuetify] } })

    const btn = screen.getByRole('button', { name: /new post/i })
    await fireEvent.click(btn)

    await waitFor(() => {
      expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.FORM_POST)
    })
  })

  it('reloads posts with new filters when PostsFilter emits change', async () => {
    const spy = vi.spyOn(postsService, 'fetchPosts').mockResolvedValue([])
    const { pinia, router, vuetify } = setup()
    await router.push('/home/posts')
    render(PostsView, {
      global: { plugins: [pinia, router, vuetify] },
    })

    const store = usePostsStore()
    await store.loadPosts({ userId: 2 })

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ userId: 2 }))
    })
  })
})
