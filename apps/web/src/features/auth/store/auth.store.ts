import { defineStore } from "pinia"
import { computed, ref } from "vue"
import * as authApi from '../api/auth.api'
import { to } from "../../../shared/utils/to"
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens
} from "../../../shared/auth/token"

type User = authApi.MeRes

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)
    const restoring = ref(false)
    const refreshToken = ref<string | null>(null)

    const isAuthed = computed(() => Boolean(token.value && user.value))

    async function login(email: string, password: string) {
        const { accessToken, refreshToken: newRefreshToken } = await authApi.login({ email, password })

        // 使用 token.ts 的函数管理 token
        setTokens(accessToken, newRefreshToken)

        token.value = accessToken
        refreshToken.value = newRefreshToken

        const [err, userData] = await to(authApi.me())

        if (err) {
            token.value = null
            refreshToken.value = null
            clearTokens()
            throw err
        }

        user.value = userData
    }

    async function restoreSession() {
        const savedToken = getAccessToken()
        const savedRefreshToken = getRefreshToken()
        if (!savedToken || !savedRefreshToken || restoring.value) return

        restoring.value = true
        token.value = savedToken
        refreshToken.value = savedRefreshToken

        const [err, userData] = await to(authApi.me())

        if (err) {
            token.value = null
            user.value = null
            refreshToken.value = null
            clearTokens()
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
        refreshToken.value = null
        user.value = null
        clearTokens()
    }

    function updateTokens(newAccessToken: string, newRefreshToken: string) {
        token.value = newAccessToken
        refreshToken.value = newRefreshToken
        setTokens(newAccessToken, newRefreshToken)
    }

    return { token, refreshToken, user, isAuthed, restoring, login, restoreSession, logout, register, updateTokens }
})
