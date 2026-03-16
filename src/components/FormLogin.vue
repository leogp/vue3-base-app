<template>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login Form</title>
  </head>
  <body>  
    <main class="form-signin w-100 m-auto">
      <h1 class="h3 mb-3 fw-normal">Sign in</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-floating">
          <input type="input" class="form-control" id="floatingInput" placeholder="Username"
          v-model="username" required>
          <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
          v-model="password" required>
          <label for="floatingPassword">Password</label>
        </div>
  
        <div class="form-check text-start my-3">
          <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            Remember me
          </label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      </form>
    </main>
  </body>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const {username, password} = storeToRefs(authStore)
const router = useRouter()

const handleLogin = async () => {
  try {
    const navTo = await authStore.authUser()
    router.push(navTo)    
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>