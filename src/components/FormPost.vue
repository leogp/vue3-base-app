<template>
  <v-card>
    <v-card-title>{{ post ? 'Edit Post' : 'New Post' }}</v-card-title>

    <v-card-text>
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
        :text="error"
      />

      <v-form @submit.prevent="save" novalidate>
        <v-text-field
          v-model="formData.title"
          label="Title"
          type="text"
          placeholder="Enter post title"
          :disabled="loading"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          hide-details="auto"
          required
        />

        <v-textarea
          v-model="formData.body"
          label="Body"
          placeholder="Enter post body"
          :disabled="loading"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          rows="5"
          hide-details="auto"
          required
        />

        <v-text-field
          v-model="formData.userId"
          label="User ID"
          variant="outlined"
          density="comfortable"
          class="mb-1"
          hide-details
          disabled
        />
        <div class="text-caption text-medium-emphasis mb-4">Read-only — assigned by system</div>

        <div class="d-flex justify-end">
          <v-btn
            type="submit"
            :disabled="!enableSubmit || loading"
            :loading="loading"
            color="primary"
            variant="flat"
          >
            {{ post ? 'Update' : 'Create' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IPost } from '@/interfaces/post'
import { postsEndpoint, postEndpoint } from '@/services/api.endpoints'

const props = defineProps({
  post: {
    type: Object as () => IPost | null,
    default: null,
  },
})

const enableSubmit = computed(() => formData.title.trim() !== '' && formData.body.trim() !== '')
const loading = ref(false)
const error = ref<string | null>(null)

const formData = reactive({
  title: '',
  body: '',
  userId: 1,
})

const { params } = useRoute()
const router = useRouter()

watch(
  () => props.post,
  (post) => {
    if (post) {
      formData.title = post.title
      formData.body = post.body
      formData.userId = post.userId
    }
  },
)

const save = async () => {
  error.value = null
  loading.value = true

  try {
    if (params.id) {
      const response = await fetch(postEndpoint(params.id as string), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          id: params.id,
          title: formData.title,
          body: formData.body,
          userId: formData.userId,
        }),
      })
      if (!response.ok) throw new Error(response.statusText)
      await response.json()
    } else {
      const response = await fetch(postsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          userId: formData.userId,
        }),
      })
      if (!response.ok) throw new Error(response.statusText)
      await response.json()
    }
    router.back()
  } catch {
    error.value = 'Failed to save post.'
  } finally {
    loading.value = false
  }
}
</script>
