<template>
  <div>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      :text="error"
    />

    <v-data-table
      :headers="headers"
      :items="posts"
      :items-per-page="10"
      :loading="loading"
      loading-text="Loading posts..."
    >
      <template #[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-pencil"
          variant="text"
          size="small"
          @click="edit(item.id)"
        />
        <v-btn
          icon="mdi-delete"
          variant="text"
          size="small"
          color="error"
          @click="confirmDelete(item)"
        />
      </template>
    </v-data-table>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Post</v-card-title>
        <v-card-text>
          Are you sure you want to delete <strong>{{ pendingDelete?.title }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="executeDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IPost } from '@/interfaces/post'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { postsEndpoint, postEndpoint } from '@/services/api.endpoints'

const posts = ref<IPost[]>([])
const error = ref<string | null>(null)
const loading = ref(false)
const router = useRouter()

const deleteDialog = ref(false)
const pendingDelete = ref<IPost | null>(null)

const headers = [
  { title: 'ID', key: 'id', width: '60px', sortable: true },
  { title: 'User', key: 'userId', width: '80px', sortable: true },
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Body', key: 'body', sortable: false },
  { title: 'Actions', key: 'actions', width: '100px', sortable: false },
]

onMounted(async () => {
  loading.value = true
  try {
    const response = await fetch(postsEndpoint)
    if (!response.ok) throw new Error(response.statusText)
    posts.value = await response.json()
  } catch {
    error.value = 'Failed to load posts.'
  } finally {
    loading.value = false
  }
})

const edit = (id: number) => {
  router.push({ name: 'form-post', params: { id } })
}

const confirmDelete = (post: IPost) => {
  pendingDelete.value = post
  deleteDialog.value = true
}

const executeDelete = async () => {
  if (!pendingDelete.value) return
  const { id } = pendingDelete.value
  deleteDialog.value = false
  try {
    const response = await fetch(postEndpoint(id), { method: 'DELETE' })
    if (response.ok) {
      posts.value = posts.value.filter(post => post.id !== id)
    } else {
      error.value = 'Failed to delete post.'
    }
  } catch {
    error.value = 'Network error while deleting post.'
  } finally {
    pendingDelete.value = null
  }
}
</script>
