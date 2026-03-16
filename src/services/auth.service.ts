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
    console.log('authservice params', this.url, this.user, this.password)
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
      const data = await response.json()

      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.log('Error login' + error)
      // TODO: save in error store
      return {
        success: false,
        error: '401: forbiden'
      }
    }
  }
}