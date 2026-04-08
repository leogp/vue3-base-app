<template>
  <v-layout>
    <NavBar />
    <v-main>
      <v-container fluid class="nerv-home-content">
        <template v-if="route.name === ROUTE_NAMES.HOME">
          <v-row justify="center" class="mb-6">
            <v-col cols="12" md="8" lg="6">
              <v-card rounded="xl" elevation="3">
                <v-card-text class="d-flex flex-column align-center pa-8">
                  <v-avatar size="80" color="primary" class="mb-4">
                    <v-img v-if="image" :src="image" :alt="firstName" />
                    <v-icon v-else icon="mdi-account-circle" size="56" />
                  </v-avatar>
                  <h2 class="text-h5 font-weight-bold mb-1">
                    {{ firstName }} {{ lastName }}
                  </h2>
                  <p class="text-body-2 text-medium-emphasis mb-6">{{ email }}</p>
                  <v-btn
                    color="primary"
                    variant="flat"
                    rounded="lg"
                    prepend-icon="mdi-post-outline"
                    @click="router.push({ name: ROUTE_NAMES.POSTS })"
                  >
                    Go to Posts
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="4" md="3">
              <v-card rounded="xl" elevation="2" class="text-center pa-4">
                <v-icon :icon="stat.icon" color="primary" size="32" class="mb-2" />
                <div class="text-caption text-medium-emphasis text-uppercase mb-1">
                  {{ stat.label }}
                </div>
                <div class="text-h6 font-weight-bold">{{ stat.value }}</div>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <router-view v-else />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/router/routes'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const { firstName, lastName, email, userId, image } = storeToRefs(authStore)

const stats = computed(() => [
  { label: 'User ID', value: userId.value, icon: 'mdi-identifier' },
  { label: 'Member Since', value: '2024', icon: 'mdi-calendar-check' },
  { label: 'Posts API', value: 'jsonplaceholder.typicode.com', icon: 'mdi-api' },
])
</script>

<style scoped>
.nerv-home-content {
  padding: 24px;
}
</style>
