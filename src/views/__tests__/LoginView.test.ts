import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { defineComponent as vueDefineComponent, h } from 'vue'
import FormLogin from '@/components/FormLogin.vue'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/router/routes'

// Wrap in v-app so Vuetify layout injection (v-main) works
const WrappedFormLogin = vueDefineComponent({
  render() {
    return h(components.VApp, null, { default: () => h(FormLogin) })
  },
})

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: ROUTE_NAMES.LOGIN, component: { template: '<div />' } },
      { path: '/home', name: ROUTE_NAMES.HOME, component: { template: '<div />' } },
    ],
  })

  const vuetify = createVuetify({ components, directives })

  return { pinia, router, vuetify }
}

describe('FormLogin (LoginView)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders username and password fields and a login button', async () => {
    const { pinia, router, vuetify } = setup()
    render(WrappedFormLogin, { global: { plugins: [pinia, router, vuetify] } })

    expect(await screen.findByRole('button', { name: /login/i })).toBeInTheDocument()
    // Vuetify renders text inputs and a password input
    expect(document.querySelector('input[autocomplete="username"]')).toBeTruthy()
    expect(document.querySelector('input[type="password"]')).toBeTruthy()
  })

  it('login button is disabled when fields are empty', async () => {
    const { pinia, router, vuetify } = setup()
    render(WrappedFormLogin, { global: { plugins: [pinia, router, vuetify] } })

    const btn = await screen.findByRole('button', { name: /login/i })
    expect(btn).toBeDisabled()
  })

  it('calls authStore.authUser with entered credentials on submit', async () => {
    const { pinia, router, vuetify } = setup()
    render(WrappedFormLogin, { global: { plugins: [pinia, router, vuetify] } })

    const authStore = useAuthStore()
    authStore.authUser = vi.fn().mockResolvedValue({ success: true, redirect: '/home' })

    // Vuetify v-text-field renders native inputs — find them by type
    const inputs = await screen.findAllByRole('textbox')
    await fireEvent.update(inputs[0], 'johndoe')

    const passwordInput = document.querySelector('input[type="password"]')!
    await fireEvent.update(passwordInput, 'secret')

    const form = document.querySelector('form')!
    await fireEvent.submit(form)

    await waitFor(() => {
      expect(authStore.authUser).toHaveBeenCalledWith('johndoe', 'secret')
    })
  })

  it('shows error message when login fails', async () => {
    const { pinia, router, vuetify } = setup()
    render(WrappedFormLogin, { global: { plugins: [pinia, router, vuetify] } })

    const authStore = useAuthStore()
    authStore.authUser = vi
      .fn()
      .mockResolvedValue({ success: false, error: { status: 401, message: 'Invalid credentials' } })

    const inputs = await screen.findAllByRole('textbox')
    await fireEvent.update(inputs[0], 'bad')

    const passwordInput = document.querySelector('input[type="password"]')!
    await fireEvent.update(passwordInput, 'bad')

    const form = document.querySelector('form')!
    await fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})
