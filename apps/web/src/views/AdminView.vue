<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <section class="page">
    <h2>Admin</h2>
    <p class="muted">
      You can see this because you have <code>admin:access</code>.
    </p>
    <pre class="box">{{ auth.user }}</pre>
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
}
.muted {
  margin: 6px 0 0;
  color: rgba(0, 0, 0, 0.6);
}
.box {
  margin-top: 14px;
  padding: 12px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: auto;
}
</style>
