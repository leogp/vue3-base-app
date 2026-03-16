<template>
  <div>
    <h1>Posts</h1>
    <button type="button" class="btn btn-dark mb-2" @click="addPost">New Post</button>
    <ThePosts />
  </div>
</template>

<script setup lang="ts">
import ThePosts from '@/components/ThePosts.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const addPost = () => {
  router.push({name:'form-post'})
}

</script>