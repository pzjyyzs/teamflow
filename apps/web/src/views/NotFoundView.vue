<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="nf">
    <h1>404</h1>
    <p class="muted">Page not found.</p>
    <RouterLink class="link" to="/app">Go back</RouterLink>
  </main>
</template>

<style scoped>
.nf {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 10px;
  background: #0b0c10;
  color: #fff;
  text-align: center;
  padding: 24px;
}
.muted {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}
.link {
  color: #6be4ff;
  text-decoration: none;
  font-weight: 800;
}
</style>
