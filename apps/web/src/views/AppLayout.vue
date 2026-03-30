<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const displayName = computed(() => auth.user?.displayName ?? 'user')

async function onLogout() {
  auth.logout()
  await router.push({ name: 'login' })
}

const nav = computed(() => {
  const items = [
    { to: { name: 'dashboard' }, label: 'Dashboard', show: true },
    { to: { name: 'admin' }, label: 'Admin', show: auth.has('admin:access') },
  ]
  return items.filter((i) => i.show)
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">TF</div>
        <div>
          <div class="brand-name">TeamFlow</div>
          <div class="brand-sub">tenant: demo</div>
        </div>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="item in nav"
          :key="item.label"
          class="nav-item"
          :class="{ active: route.name === item.to.name }"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user">
          <div class="avatar">{{ displayName.slice(0, 1).toUpperCase() }}</div>
          <div class="meta">
            <div class="name">{{ displayName }}</div>
            <div class="email">{{ auth.user?.email }}</div>
          </div>
        </div>
        <button class="ghost" @click="onLogout">Log out</button>
      </div>
    </aside>

    <main class="main">
      <RouterView v-slot="{ Component, route: childRoute }">
        <Transition name="content-pop" mode="out-in">
          <component :is="Component" :key="childRoute.fullPath" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  background: #0b0c10;
}
.sidebar {
  padding: 18px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(1000px 700px at 10% 10%, rgba(85, 149, 255, 0.2) 0%, rgba(11, 12, 16, 1) 55%);
}
.brand {
  display: flex;
  gap: 10px;
  align-items: center;
}
.logo {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(140deg, #6be4ff, #4b7bff);
  display: grid;
  place-items: center;
  font-weight: 900;
  color: #0b0c10;
}
.brand-name {
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
}
.brand-sub {
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
}
.nav {
  display: grid;
  gap: 8px;
  align-content: start;
}
.nav-item {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.82);
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  transition: transform 0.16s ease, background 0.16s ease;
}
.nav-item:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.06);
}
.nav-item.active {
  background: rgba(107, 228, 255, 0.13);
  border-color: rgba(107, 228, 255, 0.35);
}
.sidebar-footer {
  display: grid;
  gap: 12px;
}
.user {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 900;
}
.meta .name {
  color: #fff;
  font-weight: 800;
  line-height: 1.2;
}
.meta .email {
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  line-height: 1.2;
}
.ghost {
  width: 100%;
  border-radius: 999px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
}
.main {
  background: #f7f7fb;
  padding: 22px;
}
</style>
