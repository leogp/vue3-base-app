<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card>
            <v-card-title class="text-h5 pa-4">Login</v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleLogin" novalidate>
                <v-text-field
                  v-model="username"
                  label="Username"
                  type="text"
                  autocomplete="username"
                  :disabled="loading"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  hide-details="auto"
                  required
                />

                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  autocomplete="current-password"
                  :disabled="loading"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  hide-details="auto"
                  required
                />

                <v-alert
                  v-if="loginError"
                  type="error"
                  variant="tonal"
                  density="compact"
                  class="mb-3"
                  :text="loginError"
                />

                <v-btn
                  type="submit"
                  :disabled="loading || !username || !password"
                  :loading="loading"
                  color="primary"
                  variant="flat"
                  block
                >
                  Login
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const loginError = ref<string | null>(null)
const loading = ref(false)

const handleLogin = async () => {
  loginError.value = null
  loading.value = true
  try {
    const result = await authStore.authUser(username.value, password.value)
    if (!result.success) {
      loginError.value = result.error.message || 'Invalid username or password.'
      return
    }
    router.push(result.redirect)
  } finally {
    loading.value = false
  }
}
</script>
