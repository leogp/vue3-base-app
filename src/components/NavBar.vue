<template>
  <v-app-bar elevation="1">
    <v-app-bar-title>Vue3 App</v-app-bar-title>

    <template #append>
      <v-chip class="me-4" prepend-icon="mdi-account-circle" variant="text">
        {{ firstName }}
      </v-chip>

      <v-btn variant="text" :to="'/home'" exact>Home</v-btn>
      <v-btn variant="text" :to="{ name: ROUTE_NAMES.POSTS }">Posts</v-btn>
      <v-btn
        variant="text"
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="handleThemeToggle"
      />
      <v-btn variant="text" color="error" @click="logout">Logout</v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTheme as useVuetifyTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { ROUTE_NAMES } from '@/router/routes'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { firstName } = storeToRefs(authStore)
const router = useRouter()

const vuetifyTheme = useVuetifyTheme()
const { isDark, toggle } = useTheme()

const handleThemeToggle = () => {
  toggle()
  vuetifyTheme.global.name.value = isDark.value ? 'dark' : 'light'
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>
