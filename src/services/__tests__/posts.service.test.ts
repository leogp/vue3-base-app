import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  fetchPosts,
  fetchPost,
  createPost,
  updatePost,
  deletePost,
} from '@/services/posts.service'
import type { IPost } from '@/interfaces/post'

const mockPost: IPost = { id: 1, userId: 1, title: 'Hello', body: 'World' }

function makeFetch(status: number, body: unknown, statusText = 'OK') {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: () => Promise.resolve(body),
  })
}

describe('posts.service', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('fetchPosts', () => {
    it('returns posts array on success', async () => {
      vi.stubGlobal('fetch', makeFetch(200, [mockPost]))
      const result = await fetchPosts()
      expect(result).toEqual([mockPost])
    })

    it('builds URL with userId filter', async () => {
      const spy = makeFetch(200, [])
      vi.stubGlobal('fetch', spy)
      await fetchPosts({ userId: 3 })
      const url = spy.mock.calls[0][0] as string
      expect(url).toContain('userId=3')
    })

    it('builds URL with search filter', async () => {
      const spy = makeFetch(200, [])
      vi.stubGlobal('fetch', spy)
      await fetchPosts({ search: 'vue' })
      const url = spy.mock.calls[0][0] as string
      expect(url).toContain('q=vue')
    })

    it('uses base posts URL when no filters given', async () => {
      const spy = makeFetch(200, [])
      vi.stubGlobal('fetch', spy)
      await fetchPosts()
      const url = spy.mock.calls[0][0] as string
      expect(url).not.toContain('?')
    })

    it('throws on HTTP error', async () => {
      vi.stubGlobal('fetch', makeFetch(500, null, 'Server Error'))
      await expect(fetchPosts()).rejects.toMatchObject({ status: 500 })
    })
  })

  describe('fetchPost', () => {
    it('returns a single post by id', async () => {
      vi.stubGlobal('fetch', makeFetch(200, mockPost))
      const result = await fetchPost(1)
      expect(result).toEqual(mockPost)
    })

    it('throws on 404', async () => {
      vi.stubGlobal('fetch', makeFetch(404, null, 'Not Found'))
      await expect(fetchPost(9999)).rejects.toMatchObject({ status: 404 })
    })
  })

  describe('createPost', () => {
    it('returns the created post', async () => {
      vi.stubGlobal('fetch', makeFetch(201, mockPost))
      const result = await createPost({ title: 'Hello', body: 'World', userId: 1 })
      expect(result).toEqual(mockPost)
    })

    it('sends POST request with JSON body', async () => {
      const spy = makeFetch(201, mockPost)
      vi.stubGlobal('fetch', spy)
      await createPost({ title: 'T', body: 'B', userId: 2 })
      const [, init] = spy.mock.calls[0] as [string, RequestInit]
      expect(init.method).toBe('POST')
      const body = JSON.parse(init.body as string)
      expect(body).toMatchObject({ title: 'T', body: 'B', userId: 2 })
    })

    it('throws on failure', async () => {
      vi.stubGlobal('fetch', makeFetch(422, null, 'Unprocessable Entity'))
      await expect(createPost({ title: '', body: '', userId: 1 })).rejects.toMatchObject({
        status: 422,
      })
    })
  })

  describe('updatePost', () => {
    it('returns the updated post', async () => {
      const updated: IPost = { ...mockPost, title: 'New Title' }
      vi.stubGlobal('fetch', makeFetch(200, updated))
      const result = await updatePost(1, { title: 'New Title', body: 'World', userId: 1 })
      expect(result.title).toBe('New Title')
    })

    it('sends PUT request including id in body', async () => {
      const spy = makeFetch(200, mockPost)
      vi.stubGlobal('fetch', spy)
      await updatePost(5, { title: 'T', body: 'B', userId: 1 })
      const [, init] = spy.mock.calls[0] as [string, RequestInit]
      expect(init.method).toBe('PUT')
      const body = JSON.parse(init.body as string)
      expect(body.id).toBe(5)
    })
  })

  describe('deletePost', () => {
    it('resolves without value on success', async () => {
      vi.stubGlobal('fetch', makeFetch(200, {}))
      await expect(deletePost(1)).resolves.toBeUndefined()
    })

    it('throws on HTTP error', async () => {
      vi.stubGlobal('fetch', makeFetch(403, null, 'Forbidden'))
      await expect(deletePost(1)).rejects.toMatchObject({ status: 403 })
    })
  })
})
