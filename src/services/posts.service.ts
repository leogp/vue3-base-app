import type { IPost, IPostRequest, IApiError, IPostFilter } from '@/interfaces/post'
import { postsEndpoint, postEndpoint, postsFilteredEndpoint } from './api.endpoints'

function toApiError(status: number, statusText: string): IApiError {
  return { status, message: statusText || 'Unknown error' }
}

export async function fetchPosts(filters: IPostFilter = {}): Promise<IPost[]> {
  const response = await fetch(postsFilteredEndpoint(filters))
  if (!response.ok) throw toApiError(response.status, response.statusText)
  return response.json() as Promise<IPost[]>
}

export async function fetchPost(id: number | string): Promise<IPost> {
  const response = await fetch(postEndpoint(id))
  if (!response.ok) throw toApiError(response.status, response.statusText)
  return response.json() as Promise<IPost>
}

export async function createPost(data: IPostRequest): Promise<IPost> {
  const response = await fetch(postsEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw toApiError(response.status, response.statusText)
  return response.json() as Promise<IPost>
}

export async function updatePost(id: number | string, data: IPostRequest): Promise<IPost> {
  const response = await fetch(postEndpoint(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  })
  if (!response.ok) throw toApiError(response.status, response.statusText)
  return response.json() as Promise<IPost>
}

export async function deletePost(id: number | string): Promise<void> {
  const response = await fetch(postEndpoint(id), { method: 'DELETE' })
  if (!response.ok) throw toApiError(response.status, response.statusText)
}
