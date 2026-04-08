<template>
  <v-container fluid>
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h5">Posts</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="addPost">
          New Post
        </v-btn>
      </v-col>
    </v-row>

    <PostsFilter @change="onFilterChange" />
    <ThePosts />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ThePosts from '@/components/ThePosts.vue'
import PostsFilter from '@/components/PostsFilter.vue'
import type { IPostFilter } from '@/interfaces/post'
import { usePostsStore } from '@/stores/posts'
import { ROUTE_NAMES } from '@/router/routes'

const router = useRouter()
const postsStore = usePostsStore()

onMounted(() => {
  postsStore.loadPosts()
})

const addPost = () => {
  router.push({ name: ROUTE_NAMES.FORM_POST })
}

const onFilterChange = (newFilters: IPostFilter) => {
  postsStore.loadPosts(newFilters)
}
</script>
