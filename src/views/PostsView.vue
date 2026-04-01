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

    <ThePosts />
  </v-container>
</template>

<script setup lang="ts">
import ThePosts from '@/components/ThePosts.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const addPost = () => {
  router.push({ name: 'form-post' })
}
</script>
