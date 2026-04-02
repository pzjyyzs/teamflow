<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import { ref } from 'vue';
import { to } from '../../../shared/utils/to';

const auth = useAuthStore()
const router = useRouter()


const username = ref('demo@example.com')
const password = ref('password')
const loading = ref(false)
const error = ref<string | null>(null)

async function onLogin() {
  loading.value = true
  error.value = null
  const [err] = await to(auth.login(username.value, password.value))

  loading.value = false

  if (err) {
    error.value = err.message
    return
  }

  router.push('/app')
}
</script>

<template>
    <main class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Login</h1>

    <div class="space-y-2">
      <input class="border rounded px-3 py-2 w-full" v-model="username" placeholder="username" />
      <input class="border rounded px-3 py-2 w-full" type="password" v-model="password" placeholder="password" />
    </div>

    <p v-if="error" class="text-red-600">{{ error }}</p>

    <button class="px-3 py-2 rounded bg-black text-white disabled:opacity-60" :disabled="loading" @click="onLogin">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </main>
</template>