import { defineStore } from "pinia"
import { computed, ref } from "vue"
import * as authApi from '../api/auth.api'
import { to } from "../../../shared/utils/to"

type User = authApi.MeRes

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)

    const isAuthed = computed(() => Boolean(token.value && user.value))

    async function login(username: string, password: string) {
        const { accessToken } = await authApi.login({ username, password })
        token.value = accessToken
        const [err, userData] = await to(authApi.me(accessToken))

        if (err) {
            token.value = null
            throw err
        }

        user.value = userData
    }

    function logout() {
        token.value = null
        user.value = null
    }

    return { token, user, isAuthed, login, logout }
})