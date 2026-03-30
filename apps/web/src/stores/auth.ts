import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type DemoUser = {
  id: string
  email: string
  displayName: string
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<DemoUser | null>(null)

  const isAuthed = computed(() => Boolean(token.value && user.value))

  function has(permission: string) {
    return Boolean(user.value?.permissions.includes(permission))
  }

  async function login(email: string, _password: string) {
    // MVP: local demo login. Replace with API call later.
    token.value = `demo.${Date.now()}`
    user.value = {
      id: 'demo-user',
      email,
      displayName: email.split('@')[0] || 'demo',
      permissions: email.includes('admin')
        ? ['admin:access', 'requests:read', 'requests:write']
        : ['requests:read', 'requests:write'],
    }
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, isAuthed, has, login, logout }
})
