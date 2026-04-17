<script setup>
const list = [
  {
    id: 1,
    title: 'Request 1',
    type: 'Access',
    status: 'Closed',
    owner: 'John Doe',
    updateAt: '2024-06-01',
  },
  {
    id: 2,
    title: 'Request 2',
    type: 'Access',
    status: 'In Review',
    owner: 'Kobe Bryant',
    updateAt: '2025-06-01',
  },
  {
    id: 3,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },
]
</script>

<template>
  <div class="space-y-6">
   <section class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p class="text-3xl font-bold text-zinc-900">Requests</p>
      <p class="mt-2 max-w-2xl text-zinc-600">
        Track forms, approvals, and request activity across the workspace.
      </p>
    </section>

    <section class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      
    </section>
  </div> 
</template>
