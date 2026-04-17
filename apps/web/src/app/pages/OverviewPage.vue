<script setup lang="ts">
import { useAuthStore } from '../../features/auth/store/auth.store'
import { PERMISSIONS } from '../../../../../packages/shared/src/permissions'

const auth = useAuthStore()
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p class="text-sm uppercase tracking-[0.18em] text-zinc-500">Overview</p>
      <h1 class="mt-2 text-3xl font-bold text-zinc-900">Welcome back</h1>
      <p class="mt-3 max-w-2xl text-zinc-600">
        Your session is active and the base admin shell is ready. Next we can connect real menu permissions,
        request lists, and management pages to this layout.
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <button
          v-permission="PERMISSIONS.RequestsWrite"
          class="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          New request
        </button>

        <button
          v-permission="[PERMISSIONS.AdminAccess, PERMISSIONS.RequestsWrite]"
          class="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          Admin or editor action
        </button>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-zinc-500">Current area</p>
        <p class="mt-2 text-2xl font-semibold text-zinc-900">Overview</p>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-zinc-500">Permissions</p>
        <p class="mt-2 text-2xl font-semibold text-zinc-900">{{ auth.user?.permissions.length ?? 0 }}</p>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-zinc-500">Auth state</p>
        <p class="mt-2 text-2xl font-semibold text-zinc-900">{{ auth.user ? 'Active' : 'Loading' }}</p>
      </div>
    </section>

    <section class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-zinc-900">Account</h2>

      <div v-if="auth.user" class="mt-5 space-y-4">
        <div class="rounded-xl bg-zinc-50 px-4 py-3">
          <p class="text-sm text-zinc-500">User ID</p>
          <p class="mt-1 break-all font-medium text-zinc-900">{{ auth.user.id }}</p>
        </div>

        <div class="rounded-xl bg-zinc-50 px-4 py-3">
          <p class="text-sm text-zinc-500">Email</p>
          <p class="mt-1 font-medium text-zinc-900">{{ auth.user.email }}</p>
        </div>

        <div class="rounded-xl bg-zinc-50 px-4 py-3">
          <p class="text-sm text-zinc-500">Roles</p>

          <div v-if="auth.user.roles.length" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="role in auth.user.roles"
              :key="role"
              class="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white"
            >
              {{ role }}
            </span>
          </div>

          <p v-else class="mt-1 text-zinc-600">No roles assigned</p>
        </div>

        <div class="rounded-xl bg-zinc-50 px-4 py-3">
          <p class="text-sm text-zinc-500">Permissions</p>

          <div v-if="auth.user.permissions.length" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="permission in auth.user.permissions"
              :key="permission"
              class="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
            >
              {{ permission }}
            </span>
          </div>

          <p v-else class="mt-1 text-zinc-600">No permissions assigned</p>
        </div>
      </div>

      <p v-else class="mt-5 text-zinc-600">Loading account...</p>
    </section>
  </div>
</template>
