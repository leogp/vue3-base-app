<template>
  <div>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      :text="error.message"
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
          <v-btn variant="text" @click="close">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="executeDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IPost } from '@/interfaces/post'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { ROUTE_NAMES } from '@/router/routes'

const router = useRouter()
const postsStore = usePostsStore()
const { posts, loading, error } = storeToRefs(postsStore)

const { isOpen: deleteDialog, pending: pendingDelete, open, close, confirm } = useConfirmDialog<IPost>()

const headers = [
  { title: 'ID', key: 'id', width: '60px', sortable: true },
  { title: 'User', key: 'userId', width: '80px', sortable: true },
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Body', key: 'body', sortable: false },
  { title: 'Actions', key: 'actions', width: '100px', sortable: false },
]

const edit = (id: number) => {
  router.push({ name: ROUTE_NAMES.FORM_POST, params: { id } })
}

const confirmDelete = (post: IPost) => {
  open(post)
}

const executeDelete = async () => {
  await confirm((item) => postsStore.removePost(item.id))
}
</script>
