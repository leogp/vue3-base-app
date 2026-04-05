import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from './routes'
import './types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.LOGIN,
      component: LoginView,
      beforeEnter: () => {
        const authStore = useAuthStore()
        if (authStore.token) return { name: ROUTE_NAMES.HOME }
      },
    },
    {
      path: '/home',
      name: ROUTE_NAMES.HOME,
      component: HomeView,
      meta: {
        label: 'Portada',
        description: 'Tus datos personales',
        requiredAuth: true,
      },
      children: [
        {
          path: 'posts',
          name: ROUTE_NAMES.POSTS,
          component: () => import('@/views/PostsView.vue'),
        },
        {
          path: 'form-post/:id?',
          name: ROUTE_NAMES.FORM_POST,
          component: () => import('@/views/PostView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiredAuth && !authStore.token) {
    return { name: ROUTE_NAMES.LOGIN }
  }
})

export default router
