<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../../features/auth/store/auth.store'
import { PERMISSIONS } from '../../../../../packages/shared/src/permissions'

const auth = useAuthStore()
const router = useRouter()

const menuItems = [
  {
    label: 'Overview',
    description: 'Workspace snapshot',
    to: '/app/overview',
  },
  {
    label: 'Requests',
    description: 'Forms and approvals',
    to: '/app/requests',
    requiredPermission: PERMISSIONS.RequestsRead,
  },
  {
    label: 'Members',
    description: 'Roles and access',
    to: '/app/members',
    requiredPermission: PERMISSIONS.AdminAccess,
  },
  {
    label: 'Settings',
    description: 'Project configuration',
    to: '/app/settings',
    requiredPermission: PERMISSIONS.AdminAccess,
  },
]

const visibleMenuItems = computed(() => {
  const permissions = auth.user?.permissions ?? []

  return menuItems.filter((item) => {
    if (!item.requiredPermission) return true
    return permissions.includes(item.requiredPermission)
  })
})

const onLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-900">
    <nav class="border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white">
            TF
          </div>

          <div>
            <p class="text-lg font-semibold">TeamFlow</p>
            <p class="text-sm text-zinc-500">Internal operations console</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            v-if="auth.user"
            class="hidden rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-600 sm:block"
          >
            {{ auth.user.email }}
          </div>

          <button
            @click="onLogout"
            class="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div class="rounded-2xl bg-zinc-900 p-4 text-white">
          <p class="text-sm uppercase tracking-[0.18em] text-zinc-300">Workspace</p>
          <h2 class="mt-2 text-xl font-semibold">Admin shell</h2>
          <p class="mt-2 text-sm text-zinc-300">A starter navigation rail for requests, users, and settings.</p>
        </div>

        <div class="mt-4 space-y-2">
          <RouterLink
            v-for="item in visibleMenuItems"
            :key="item.label"
            :to="item.to"
            class="block w-full rounded-xl border px-4 py-3 text-left transition"
            active-class="border-zinc-900 bg-zinc-900 text-white shadow-sm"
            exact-active-class="border-zinc-900 bg-zinc-900 text-white shadow-sm"
            :class="'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white'"
          >
            <p class="text-sm font-medium">{{ item.label }}</p>
            <p class="mt-1 text-xs text-zinc-500">
              {{ item.description }}
            </p>
          </RouterLink>
        </div>
      </aside>

      <main class="min-w-0">
        <RouterView />
      </main>
    </div>
  </div>
</template>
