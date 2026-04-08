import './assets/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#6C63FF',
          secondary: '#03DAC6',
          accent: '#FF6584',
          error: '#CF6679',
          warning: '#FFAB40',
          info: '#40C4FF',
          success: '#69F0AE',
          background: '#F5F5F7',
          surface: '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#BB86FC',
          secondary: '#03DAC6',
          accent: '#FF6584',
          error: '#CF6679',
          warning: '#FFAB40',
          info: '#40C4FF',
          success: '#69F0AE',
          background: '#121212',
          surface: '#1E1E1E',
        },
      },
    },
  },
})

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(vuetify)

router.isReady().then(() => {
  app.mount('#app')
})
