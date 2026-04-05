import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IPost, IPostRequest, IApiError, IPostFilter } from '@/interfaces/post'
import { fetchPosts, createPost, updatePost, deletePost } from '@/services/posts.service'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<IPost[]>([])
  const loading = ref(false)
  const error = ref<IApiError | null>(null)
  const filters = ref<IPostFilter>({})

  async function loadPosts(activeFilters?: IPostFilter) {
    loading.value = true
    error.value = null
    try {
      posts.value = await fetchPosts(activeFilters ?? filters.value)
    } catch (err) {
      error.value = err as IApiError
    } finally {
      loading.value = false
    }
  }

  async function addPost(data: IPostRequest): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const newPost = await createPost(data)
      posts.value.unshift(newPost)
      return true
    } catch (err) {
      error.value = err as IApiError
      return false
    } finally {
      loading.value = false
    }
  }

  async function editPost(id: number, data: IPostRequest): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const updated = await updatePost(id, data)
      const idx = posts.value.findIndex((p) => p.id === id)
      if (idx !== -1) posts.value[idx] = updated
      return true
    } catch (err) {
      error.value = err as IApiError
      return false
    } finally {
      loading.value = false
    }
  }

  async function removePost(id: number): Promise<boolean> {
    error.value = null
    try {
      await deletePost(id)
      posts.value = posts.value.filter((p) => p.id !== id)
      return true
    } catch (err) {
      error.value = err as IApiError
      return false
    }
  }

  function setFilters(newFilters: IPostFilter) {
    filters.value = newFilters
  }

  return {
    posts,
    loading,
    error,
    filters,
    loadPosts,
    addPost,
    editPost,
    removePost,
    setFilters,
  }
})
