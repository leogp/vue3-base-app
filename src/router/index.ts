import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import type { Pinia } from 'pinia'

let _pinia: Pinia | null = null

export const setPinia = (pinia: Pinia) => { _pinia = pinia }

const getAuthStore = () => {
  if (!_pinia) return null
  return useAuthStore(_pinia)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      beforeEnter: async (to, from, next) => {
        const authStore = getAuthStore()
        if (authStore?.token) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        label: 'Portada',
        description: 'Tus datos personales',
        requiredAuth: true,
      },
      children: [
        {
          path: 'posts',
          name: 'posts',
          component: () => import('@/views/PostsView.vue')
        },
        {
          path: 'form-post/:id?',
          name: 'form-post',
          component: () => import('@/views/PostView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const authStore = getAuthStore()
if (to.meta.requiredAuth && !authStore?.token) {
    return { name: 'login' }
  }
})

export default router
