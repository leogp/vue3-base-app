import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import * as postsService from '@/services/posts.service'
import type { IPost } from '@/interfaces/post'

const makePost = (id: number): IPost => ({
  id,
  userId: 1,
  title: `Title ${id}`,
  body: `Body ${id}`,
})

describe('usePostsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty posts, no loading, no error', () => {
      const store = usePostsStore()
      expect(store.posts).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('loadPosts', () => {
    it('populates posts array on success', async () => {
      const mockPosts = [makePost(1), makePost(2)]
      vi.spyOn(postsService, 'fetchPosts').mockResolvedValue(mockPosts)

      const store = usePostsStore()
      await store.loadPosts()

      expect(store.posts).toEqual(mockPosts)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('passes active filters to fetchPosts', async () => {
      const spy = vi.spyOn(postsService, 'fetchPosts').mockResolvedValue([])
      const store = usePostsStore()
      await store.loadPosts({ userId: 3, search: 'hello' })

      expect(spy).toHaveBeenCalledWith({ userId: 3, search: 'hello' })
    })

    it('sets error state and keeps posts empty on fetch failure', async () => {
      const apiError = { status: 500, message: 'Server error' }
      vi.spyOn(postsService, 'fetchPosts').mockRejectedValue(apiError)

      const store = usePostsStore()
      await store.loadPosts()

      expect(store.posts).toEqual([])
      expect(store.error).toEqual(apiError)
      expect(store.loading).toBe(false)
    })
  })

  describe('addPost', () => {
    it('prepends the new post to posts array and returns true', async () => {
      const newPost = makePost(101)
      vi.spyOn(postsService, 'createPost').mockResolvedValue(newPost)

      const store = usePostsStore()
      store.posts = [makePost(1)]
      const success = await store.addPost({ title: 'T', body: 'B', userId: 1 })

      expect(success).toBe(true)
      expect(store.posts[0]).toEqual(newPost)
      expect(store.posts).toHaveLength(2)
    })

    it('sets error and returns false on failure', async () => {
      const apiError = { status: 422, message: 'Unprocessable' }
      vi.spyOn(postsService, 'createPost').mockRejectedValue(apiError)

      const store = usePostsStore()
      const success = await store.addPost({ title: '', body: '', userId: 1 })

      expect(success).toBe(false)
      expect(store.error).toEqual(apiError)
    })
  })

  describe('editPost', () => {
    it('updates the matching post in place and returns true', async () => {
      const original = makePost(5)
      const updated: IPost = { ...original, title: 'Updated' }
      vi.spyOn(postsService, 'updatePost').mockResolvedValue(updated)

      const store = usePostsStore()
      store.posts = [makePost(4), original, makePost(6)]
      const success = await store.editPost(5, { title: 'Updated', body: 'Body 5', userId: 1 })

      expect(success).toBe(true)
      expect(store.posts[1].title).toBe('Updated')
    })

    it('returns false and sets error when update fails', async () => {
      vi.spyOn(postsService, 'updatePost').mockRejectedValue({ status: 404, message: 'Not found' })

      const store = usePostsStore()
      const success = await store.editPost(99, { title: 'X', body: 'Y', userId: 1 })

      expect(success).toBe(false)
      expect(store.error).not.toBeNull()
    })
  })

  describe('removePost', () => {
    it('removes the post by id and returns true', async () => {
      vi.spyOn(postsService, 'deletePost').mockResolvedValue(undefined)

      const store = usePostsStore()
      store.posts = [makePost(1), makePost(2), makePost(3)]
      const success = await store.removePost(2)

      expect(success).toBe(true)
      expect(store.posts.map((p) => p.id)).toEqual([1, 3])
    })

    it('returns false and sets error when delete fails', async () => {
      vi.spyOn(postsService, 'deletePost').mockRejectedValue({ status: 403, message: 'Forbidden' })

      const store = usePostsStore()
      store.posts = [makePost(1)]
      const success = await store.removePost(1)

      expect(success).toBe(false)
      expect(store.error).not.toBeNull()
      expect(store.posts).toHaveLength(1)
    })
  })

  describe('setFilters', () => {
    it('updates filters state', () => {
      const store = usePostsStore()
      store.setFilters({ userId: 7, search: 'vue' })
      expect(store.filters).toEqual({ userId: 7, search: 'vue' })
    })
  })
})
