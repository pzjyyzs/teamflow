<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import { http } from '../../../shared/api/http';

const auth = useAuthStore()
const router = useRouter()

function onLogin() {
    auth.login()
    router.push('/app')
}

async function onPing() {
    const { data } = await http.get('/health')
    console.log(data)
}
</script>

<template>
    <main class="p-6">Login</main>
    <h1>Login</h1>
    <button class="px-3 py-2 rounded bg-black text-white cursor-pointer" @click="onLogin">Login (demo)</button>
    <button class="px-3 py-2 rounded bg-black text-white cursor-pointer" @click="onPing">ping (demo)</button>
</template>