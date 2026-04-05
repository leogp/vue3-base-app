export interface IAuthRequest {
  username: string
  password: string
  expiresInMins?: number
}

export interface IAuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface IUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}
