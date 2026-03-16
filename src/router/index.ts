import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import PostsView from '@/views/PostsView.vue'
import PostView from '@/views/PostView.vue'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.token) {
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
      component: HomeView, // carga sincronica de ruta
      // component: () =>(@/views/HomeView),
      meta: { // normalmente se usa para decirle a las vistas si requieren rol o autenticacion
        label: 'Portada',
        description: 'Tus datos personales',
        requiredAuth: true,
      }, // Ver como se accede a esto
      children: [
        {
          path: 'posts',
          name: 'posts',
          component: PostsView
        },
        {
          path: 'form-post/:id?',
          name: 'form-post',
          component: PostView
        }
      ]
    }
  ]
})

export default router
