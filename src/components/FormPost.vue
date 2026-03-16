<template>
  <h1>{{ post ? 'Edit' : 'Create' }} Post</h1>
  <form class="row g-3 " @submit.prevent="save">
    <div>
      <label for="title" class="form-label">Title</label>
      <input type="text" id="title" class="form-control" aria-label="Title" 
      v-model="formData.title" required>
    </div>
    <div >
      <label for="body" class="form-label">Body</label>
      <textarea class="form-control" id="body" rows="3" 
      v-model="formData.body" required></textarea>
    </div>
    <div>
      <label for="userId" class="form-label">User id</label>
      <input class="form-control" id="userId" type="text" 
      v-model="formData.userId" disabled>
    </div>
    <div class="col-12">
      <button class="btn btn-primary" type="submit" 
      :disabled="enableSubmit">Save</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type {IPost} from '@/interfaces/post'


const props = defineProps({
  post: {
    type: Object as () => IPost | null,
    default: null
  }
})

const updatePost = computed(() => props.post)
const enableSubmit = computed(() => {return formData.title.trim() === '' || formData.body.trim() === ''})

const formData = reactive({
  title: '',
  body: '',
  userId: 1,
})

const { params } = useRoute()
const router = useRouter()

// Cuando la propiedad computada cambie (porque recibio los datos desde edit), se va a ejecutar esto
watch(updatePost, () => {
  if(updatePost.value){
    formData.title = updatePost.value.title
    formData.body = updatePost.value.body
    formData.userId = updatePost.value.userId
  }
})

const save = async () => {
  if (params.id) {
    // Actualizar
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        id: params.id,
        title: formData.title,
        body: formData.body,
        userId: formData.userId
      })
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
    router.back()
  } else {
    // Crear
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        title: formData.title,
        body: formData.body,
        userId: formData.userId
      })
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
    router.back()
  }
}

</script>