<template>
  <v-container fluid>
    <v-row align="center" class="mb-4">
      <v-col cols="auto">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="goBack">Back</v-btn>
      </v-col>
      <v-col>
        <span class="text-body-2 text-medium-emphasis">
          Posts / {{ params.id ? 'Edit #' + params.id : 'New Post' }}
        </span>
      </v-col>
    </v-row>

    <v-progress-linear v-if="fetchingPost" indeterminate color="primary" class="mb-4" />

    <FormPost v-else :post="post" />
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormPost from '@/components/FormPost.vue'
import type { IPost } from '@/interfaces/post'
import { postEndpoint } from '@/services/api.endpoints'

const router = useRouter()
const { params } = useRoute()

const post = ref<IPost | null>(null)
const fetchingPost = ref(false)

onBeforeMount(async () => {
  if (params.id) {
    fetchingPost.value = true
    try {
      const response = await fetch(postEndpoint(params.id as string))
      if (!response.ok) throw new Error(response.statusText)
      post.value = await response.json()
    } catch {
      // handled by FormPost receiving null post
    } finally {
      fetchingPost.value = false
    }
  }
})

const goBack = () => {
  router.back()
}
</script>
