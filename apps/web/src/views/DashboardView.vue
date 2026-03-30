<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const quickAdd = ref('')
const items = ref<string[]>(['Draft requirements', 'Build auth middleware', 'Ship admin menu'])

function addItem() {
  const value = quickAdd.value.trim()
  if (!value) return
  items.value.unshift(value)
  quickAdd.value = ''
}

const perms = computed(() => auth.user?.permissions ?? [])
</script>

<template>
  <section class="page">
    <header class="header">
      <h2>Dashboard</h2>
      <p class="muted">A small area to practice Vue transitions and state.</p>
    </header>

    <div class="grid">
      <article class="card">
        <h3>Quick Actions</h3>
        <div class="row">
          <input v-model.trim="quickAdd" placeholder="Add a task…" @keydown.enter="addItem" />
          <button class="primary" @click="addItem">Add</button>
        </div>

        <TransitionGroup name="list-pop" tag="ul" class="list">
          <li v-for="it in items" :key="it" class="list-item">
            {{ it }}
          </li>
        </TransitionGroup>
      </article>

      <article class="card">
        <h3>My Permissions</h3>
        <p class="muted">Used to generate menus and guard routes.</p>
        <ul class="pill-list">
          <li v-for="p in perms" :key="p" class="pill">{{ p }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
}
.header h2 {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
}
.muted {
  margin: 6px 0 0;
  color: rgba(0, 0, 0, 0.6);
}
.grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;
}
.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px;
  box-shadow: 0 18px 34px rgba(20, 20, 40, 0.07);
}
.card h3 {
  margin: 0 0 10px;
  letter-spacing: -0.01em;
}
.row {
  display: flex;
  gap: 10px;
}
input {
  flex: 1;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 10px 12px;
}
.primary {
  border: 0;
  border-radius: 12px;
  padding: 10px 14px;
  background: #0b0c10;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}
.list {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
  display: grid;
  gap: 8px;
}
.list-item {
  background: #f7f7fb;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 10px 12px;
}
.pill-list {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(75, 123, 255, 0.12);
  border: 1px solid rgba(75, 123, 255, 0.22);
  color: #1f3b8c;
  font-weight: 700;
  font-size: 12px;
}
@media (max-width: 920px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
