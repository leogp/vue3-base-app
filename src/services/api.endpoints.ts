import type { IPostFilter } from '@/interfaces/post'

export const POSTS_BASE = 'https://jsonplaceholder.typicode.com/posts'

export const postsEndpoint = POSTS_BASE
export const postEndpoint = (id: number | string): string => `${POSTS_BASE}/${id}`

export const postsFilteredEndpoint = (filters: IPostFilter = {}): string => {
  const params = new URLSearchParams()
  if (filters.userId) params.set('userId', String(filters.userId))
  if (filters.search?.trim()) params.set('q', filters.search.trim())
  const query = params.toString()
  return query ? `${POSTS_BASE}?${query}` : POSTS_BASE
}
