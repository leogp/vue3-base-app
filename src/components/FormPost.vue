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
import { computed, reactive, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IPost } from '@/interfaces/post'
import { usePostsStore } from '@/stores/posts'

const props = defineProps({
  post: {
    type: Object as () => IPost | null,
    default: null,
  },
})

const postsStore = usePostsStore()

const enableSubmit = computed(() => formData.title.trim() !== '' && formData.body.trim() !== '')
const loading = computed(() => postsStore.loading)
const error = computed(() => postsStore.error?.message ?? null)

const formData = reactive({
  title: '',
  body: '',
  userId: 1,
})

const { params } = useRoute()
const router = useRouter()

watchEffect(() => {
  if (props.post) {
    formData.title = props.post.title
    formData.body = props.post.body
    formData.userId = props.post.userId
  }
})

const save = async () => {
  const payload = { title: formData.title, body: formData.body, userId: formData.userId }
  let success: boolean

  if (params.id) {
    success = await postsStore.editPost(Number(params.id), payload)
  } else {
    success = await postsStore.addPost(payload)
  }

  if (success) {
    router.back()
  }
}
</script>
