import { AuthService } from "@/services/auth.service";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null,
    username: null,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    image: '',
    token: '',
    refreshToken: ''
  }),
  actions: {
    logout() {
      this.$reset()
    },
    async authUser(username: string, password: string){
      const authService = new AuthService(username, password)
      const res = await authService.login()

      if(res.success){
        this.userId = res.data.id
        this.username = res.data.username
        this.email = res.data.email
        this.firstName = res.data.firstName
        this.lastName = res.data.lastName
        this.gender = res.data.gender
        this.image = res.data.image
        this.token = res.data.accessToken
        this.refreshToken = res.data.refreshToken

        return '/home'
      }
      return ''
    }
  },
  getters: {},
  persist: true
})