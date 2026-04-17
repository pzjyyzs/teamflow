import { defineStore } from "pinia"
import { computed, ref } from "vue"
import * as authApi from '../api/auth.api'
import { to } from "../../../shared/utils/to"

type User = authApi.MeRes
const TOKEN_STORAGE_KEY = 'teamflow.accessToken'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)
    const restoring = ref(false)

    const isAuthed = computed(() => Boolean(token.value && user.value))

    async function login(email: string, password: string) {
        const { accessToken } = await authApi.login({ email, password })
        token.value = accessToken
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
        const [err, userData] = await to(authApi.me(accessToken))

        if (err) {
            token.value = null
            localStorage.removeItem(TOKEN_STORAGE_KEY)
            throw err
        }

        user.value = userData
    }

    async function restoreSession() {
        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
        if (!savedToken || restoring.value) return

        restoring.value = true
        token.value = savedToken

        const [err, userData] = await to(authApi.me(savedToken))

        if (err) {
            token.value = null
            user.value = null
            localStorage.removeItem(TOKEN_STORAGE_KEY)
            restoring.value = false
            return
        }

        user.value = userData
        restoring.value = false
    }

    async function register(email: string, password: string) {
        await authApi.register({ email, password })
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    return { token, user, isAuthed, restoring, login, restoreSession, logout, register }
})
