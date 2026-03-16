<template>
  <main>
    <NavBar/>
    <router-view></router-view> 
  </main>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
</script>