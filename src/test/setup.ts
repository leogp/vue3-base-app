import '@testing-library/jest-dom'

// Suppress Vuetify/Vue warnings about missing components in test env
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
