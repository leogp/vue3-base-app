import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiredAuth?: boolean
    label?: string
    description?: string
  }
}
