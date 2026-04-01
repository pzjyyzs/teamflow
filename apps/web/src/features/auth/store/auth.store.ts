import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const isAuthed = computed(() => Boolean(token.value))

    function login() {
        token.value = `teamflow.${Date.now}`
    }

    function logout() {
        token.value = null
    }

    return { token, isAuthed, login, logout }
})