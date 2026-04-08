import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import FormPost from '@/components/FormPost.vue'
import * as postsService from '@/services/posts.service'
import { ROUTE_NAMES } from '@/router/routes'
import type { IPost } from '@/interfaces/post'

function setup(path = '/home/form-post') {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/home/form-post/:id?',
        name: ROUTE_NAMES.FORM_POST,
        component: FormPost,
      },
      { path: '/home/posts', name: ROUTE_NAMES.POSTS, component: { template: '<div />' } },
    ],
  })

  const vuetify = createVuetify({ components, directives })
  return { pinia, router, vuetify }
}

// Helper: get the native input inside a Vuetify v-text-field/v-textarea by its label text
function getInputByLabel(labelText: string): HTMLInputElement | HTMLTextAreaElement {
  // Vuetify renders a <label> with the text; the associated input is a sibling input/textarea
  const allInputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input, textarea',
  )
  for (const input of allInputs) {
    const id = input.id
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`)
      if (label?.textContent?.toLowerCase().includes(labelText.toLowerCase())) {
        return input
      }
    }
  }
  // Fallback: find by placeholder
  throw new Error(`Could not find input with label: ${labelText}`)
}

describe('FormPost', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders "New Post" title when no post prop', async () => {
    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post')
    render(FormPost, { global: { plugins: [pinia, router, vuetify] } })
    expect(screen.getByText('New Post')).toBeInTheDocument()
  })

  it('renders "Edit Post" title when post prop is provided', async () => {
    const post: IPost = { id: 1, userId: 1, title: 'Existing', body: 'Body' }
    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post/1')
    render(FormPost, {
      props: { post },
      global: { plugins: [pinia, router, vuetify] },
    })
    expect(screen.getByText('Edit Post')).toBeInTheDocument()
  })

  it('pre-fills title and body fields when post prop is given', async () => {
    const post: IPost = { id: 3, userId: 1, title: 'My Title', body: 'My Body' }
    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post/3')
    render(FormPost, {
      props: { post },
      global: { plugins: [pinia, router, vuetify] },
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('My Title')).toBeInTheDocument()
      expect(screen.getByDisplayValue('My Body')).toBeInTheDocument()
    })
  })

  it('submit button is disabled when title is empty', async () => {
    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post')
    render(FormPost, { global: { plugins: [pinia, router, vuetify] } })

    const submitBtn = screen.getByRole('button', { name: /create/i })
    expect(submitBtn).toBeDisabled()
  })

  it('submit button is enabled when both title and body are filled', async () => {
    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post')
    render(FormPost, { global: { plugins: [pinia, router, vuetify] } })

    const titleInput = getInputByLabel('Title')
    const bodyInput = getInputByLabel('Body')
    await fireEvent.update(titleInput, 'New Title')
    await fireEvent.update(bodyInput, 'New Body')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled()
    })
  })

  it('calls createPost with form data on submit', async () => {
    const newPost: IPost = { id: 101, userId: 1, title: 'New Title', body: 'New Body' }
    vi.spyOn(postsService, 'createPost').mockResolvedValue(newPost)

    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post')
    render(FormPost, { global: { plugins: [pinia, router, vuetify] } })

    const titleInput = getInputByLabel('Title')
    const bodyInput = getInputByLabel('Body')
    await fireEvent.update(titleInput, 'New Title')
    await fireEvent.update(bodyInput, 'New Body')

    const form = document.querySelector('form')!
    await fireEvent.submit(form)

    await waitFor(() => {
      expect(postsService.createPost).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Title', body: 'New Body' }),
      )
    })
  })

  it('shows error alert when store has an error', async () => {
    vi.spyOn(postsService, 'createPost').mockRejectedValue({ status: 500, message: 'Server error' })

    const { pinia, router, vuetify } = setup()
    await router.push('/home/form-post')
    render(FormPost, { global: { plugins: [pinia, router, vuetify] } })

    const titleInput = getInputByLabel('Title')
    const bodyInput = getInputByLabel('Body')
    await fireEvent.update(titleInput, 'T')
    await fireEvent.update(bodyInput, 'B')

    const form = document.querySelector('form')!
    await fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })
  })
})
