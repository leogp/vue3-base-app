export interface IPost {
  userId: number
  id: number
  title: string
  body: string
}

export interface IPostRequest {
  title: string
  body: string
  userId: number
}

export interface IPostResponse extends IPost {}

export interface IApiError {
  status: number
  message: string
}

export interface IPostFilter {
  userId?: number | null
  search?: string
}
