export const ROUTE_NAMES = {
  LOGIN: 'login',
  HOME: 'home',
  POSTS: 'posts',
  FORM_POST: 'form-post',
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
