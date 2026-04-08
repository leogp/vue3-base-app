import { render, type RenderOptions } from '@testing-library/vue'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import type { Component } from 'vue'
import { ROUTE_NAMES } from '@/router/routes'

export function makeVuetify() {
  return createVuetify({ components, directives })
}

export function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: ROUTE_NAMES.LOGIN, component: { template: '<div />' } },
      {
        path: '/home',
        name: ROUTE_NAMES.HOME,
        component: { template: '<router-view />' },
        children: [
          { path: 'posts', name: ROUTE_NAMES.POSTS, component: { template: '<div />' } },
          {
            path: 'form-post/:id?',
            name: ROUTE_NAMES.FORM_POST,
            component: { template: '<div />' },
          },
        ],
      },
    ],
  })
}

export function renderWithPlugins(
  component: Component,
  options: RenderOptions = {},
) {
  const pinia = createPinia()
  const router = makeRouter()
  const vuetify = makeVuetify()

  return render(component, {
    global: {
      plugins: [pinia, router, vuetify],
    },
    ...options,
  })
}
