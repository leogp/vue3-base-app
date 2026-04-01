export const API = 'https://dummyjson.com'
export const login = `${API}/auth/login`

const POSTS_BASE = 'https://jsonplaceholder.typicode.com/posts'
export const postsEndpoint = POSTS_BASE
export const postEndpoint = (id: number | string) => `${POSTS_BASE}/${id}`
