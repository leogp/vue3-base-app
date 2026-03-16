<template>
  <div>
    <button class="btn btn-dark my-2" @click="goBack">Back</button>
    <FormPost :post="post"/>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormPost from '@/components/FormPost.vue';
import type { IPost } from '@/interfaces/post';


const router = useRouter()
const { params } = useRoute()

const post = ref<IPost | null>(null)

onBeforeMount(async () => {
  if (params.id) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`)
    post.value = await response.json()
  }  
})

const goBack = () => {
  router.back()
}
</script>