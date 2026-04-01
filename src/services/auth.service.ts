import { login } from "./api.endpoints";

export class AuthService {
  private url = login
  private user: string | null
  private password: string | null
  private expiresInMins = 30

  constructor(username:string | null ,password:string | null){
    this.user = username
    this.password = password
  }

  login = async () => {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.user,
          password: this.password,
          expiresInMins: this.expiresInMins
        })
      })
      if (!response.ok) {
        return { success: false, error: `${response.status}: ${response.statusText}` }
      }
      const data = await response.json()
      return { success: true, data: data }
    } catch (error) {
      return {
        success: false,
        error: '401: Forbidden'
      }
    }
  }
}