<template>
  <table class="table">
  <thead class="table-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Ttile</th>
      <th scope="col">Body</th>
      <th scope="col">UserId</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody class="table-group-divider">
    <tr v-for="(post, index) in posts" :key="index">
      <th scope="row">{{ post.id }}</th>
      <td>{{ post.title }}</td>
      <td>{{ post.body }}</td>
      <td>{{ post.userId }}</td>
      <td>
        <span style="cursor: pointer" title="editar" @click="edit(post.id)"> 📝 </span>
        <span class="ms-2" style="cursor: pointer" title="eliminar" @click="del(post)"> ❌ </span>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script setup lang="ts">

import type { IPost } from '@/interfaces/post';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const posts = ref<IPost[]>([])
const router = useRouter()
const { params } = useRoute()

onMounted(async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
  const data = await response.json()
  posts.value = data
})

const edit = async (id:number) => {
  router.push(`/form-post/${id}`)
}

const del = async ({id,title}:IPost) => {
  const sure = confirm(`Are you sure to delete ${title}`)
  if(sure){
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`,{
      method: 'DELETE',
    })
    if (response.ok) {
      // Filter out the deleted post from the posts array
      posts.value = posts.value.filter(post => post.id !== id)
    } else {
      console.error('Failed to delete the post');
    }
  }
}

</script>