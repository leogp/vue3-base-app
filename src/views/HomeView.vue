<template>
  <v-layout>
    <NavBar />
    <v-main>
      <v-container fluid class="nerv-home-content">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
.nerv-home-content {
  padding: 24px;
}
</style>
