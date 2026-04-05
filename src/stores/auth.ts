import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginUser } from '@/services/auth.service'
import type { IUser } from '@/interfaces/auth'
import type { IApiError } from '@/interfaces/post'
import { ROUTE_NAMES } from '@/router/routes'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userId = ref<number | null>(null)
    const username = ref<string | null>(null)
    const email = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const gender = ref('')
    const image = ref('')
    const token = ref('')
    const refreshToken = ref('')

    const isAuthenticated = computed(() => !!token.value)

    const user = computed<IUser | null>(() =>
      userId.value
        ? {
            id: userId.value,
            username: username.value ?? '',
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
            gender: gender.value,
            image: image.value,
          }
        : null,
    )

    async function authUser(
      usernameInput: string,
      password: string,
    ): Promise<{ success: true; redirect: string } | { success: false; error: IApiError }> {
      try {
        const data = await loginUser({ username: usernameInput, password })
        userId.value = data.id
        username.value = data.username
        email.value = data.email
        firstName.value = data.firstName
        lastName.value = data.lastName
        gender.value = data.gender
        image.value = data.image
        token.value = data.accessToken
        refreshToken.value = data.refreshToken
        return { success: true, redirect: `/${ROUTE_NAMES.HOME}` }
      } catch (err) {
        return { success: false, error: err as IApiError }
      }
    }

    function logout() {
      userId.value = null
      username.value = null
      email.value = ''
      firstName.value = ''
      lastName.value = ''
      gender.value = ''
      image.value = ''
      token.value = ''
      refreshToken.value = ''
    }

    return {
      userId,
      username,
      email,
      firstName,
      lastName,
      gender,
      image,
      token,
      refreshToken,
      isAuthenticated,
      user,
      authUser,
      logout,
    }
  },
  { persist: true },
)
