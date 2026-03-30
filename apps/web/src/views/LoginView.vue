<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('admin@example.com')
const password = ref('password')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    await auth.login(email.value, password.value)
    const next = typeof route.query.next === 'string' ? route.query.next : '/app'
    await router.replace(next)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <div class="auth-header">
        <h1>TeamFlow</h1>
        <p class="muted">Demo login. Use an email containing “admin” to unlock Admin.</p>
      </div>

      <form class="auth-form" @submit.prevent="onSubmit">
        <label class="field">
          <span>Email</span>
          <input v-model.trim="email" type="email" autocomplete="email" required />
        </label>

        <label class="field">
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="primary" :disabled="loading" type="submit">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background: radial-gradient(1200px 800px at 20% 10%, #e8f1ff 0%, #f7f7fb 45%, #fff 100%);
}
.auth-card {
  width: min(520px, 94vw);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 26px 60px rgba(14, 24, 45, 0.12);
  padding: 28px;
}
.auth-header h1 {
  margin: 0;
  font-size: 34px;
  letter-spacing: -0.03em;
}
.muted {
  margin: 8px 0 0;
  color: rgba(0, 0, 0, 0.55);
}
.auth-form {
  margin-top: 18px;
  display: grid;
  gap: 14px;
}
.field {
  display: grid;
  gap: 8px;
}
.field span {
  font-weight: 700;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.72);
}
input {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  padding: 12px 12px;
  font-size: 16px;
}
.primary {
  border: 0;
  border-radius: 999px;
  padding: 12px 16px;
  font-weight: 800;
  background: #0e0e12;
  color: #fff;
  cursor: pointer;
}
.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  margin: 0;
  color: #b42318;
  font-weight: 700;
}
</style>
