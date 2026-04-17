<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import { to } from '../../../shared/utils/to'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function onRegister() {
  error.value = null
  
  if (!email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  const [err] = await to(auth.register(email.value, password.value))

  loading.value = false

  if (err) {
    error.value = err.message
    return
  }

  router.push('/login')
  
}
</script>

<template>
  <main class="min-h-screen bg-zinc-50 px-6 py-10">
    <div class="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div class="space-y-2">
        <p class="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">TeamFlow</p>
        <h1 class="text-3xl font-bold text-zinc-900">Create your account</h1>
        <p class="text-sm text-zinc-600">Set up a workspace login to continue building your admin flow.</p>
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="onRegister">
        <label class="block space-y-2">
          <span class="text-sm font-medium text-zinc-700">Email</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="name@company.com"
            class="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
          />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-zinc-700">Password</span>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="At least 6 characters"
            class="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
          />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-zinc-700">Confirm password</span>
          <input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Repeat your password"
            class="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900"
          />
        </label>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          class="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-zinc-600">
        Already have an account?
        <RouterLink to="/login" class="font-medium text-zinc-900 underline underline-offset-4">
          Sign in
        </RouterLink>
      </p>
    </div>
  </main>
</template>
