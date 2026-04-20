<script setup lang="ts">
import Pagination from '../../shared/components/Pagination/Pagination.vue'
import DataTable from '../../shared/components/DataTable/DataTable.vue'

const query = ref({
  page: 1,
  pageSize: 10,
  keyword: '',
  sortBy: undefined as string | undefined,
  sortOrder: undefined as 'asc' | 'desc' | undefined,
})
const columns = [
  { key: 'title', label: '标题', sortable: true },
  { key: 'type', label: '类型', sortable: true },
  { key: 'status', label: '状态', sortable: true },
  { key: 'owner', label: '负责人', sortable: true },
  { key: 'updateAt', label: '更新时间', sortable: true },
]
const allList = [
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
  {
    id: 4,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },
  {
    id: 5,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },
  {
    id: 6,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },
  {
    id: 7,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },
  {
    id: 8,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 9,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 10,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 11,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 12,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 13,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 14,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 15,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 16,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 17,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 18,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 19,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 20,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },{
    id: 21,
    title: 'Request 3',
    type: 'Access',
    status: 'Open',
    owner: 'kiwi Liu',
    updateAt: '2026-06-01',
  },
]

const filteredList = computed(() => {
  const value = query.value.keyword.trim().toLowerCase()

  if (!value) return allList

  return allList.filter((item) => {
    return [item.title, item.type, item.status, item.owner]
      .some((field) => field.toLowerCase().includes(value))
  })
})

const sortedList = computed(() => {
  const { sortBy, sortOrder } = query.value

  if (!sortBy || !sortOrder) return filteredList.value

  return [...filteredList.value].sort((a, b) => {
    const left = a[sortBy as keyof typeof a]
    const right = b[sortBy as keyof typeof b]

    if (left === right) return 0
    if (left == null) return 1
    if (right == null) return -1

    if (sortOrder === 'asc') {
      return String(left).localeCompare(String(right))
    }

    return String(right).localeCompare(String(left))
  })
})

const total = computed(() => filteredList.value.length)

const pagedList = computed(() => {
  const start = (query.value.page - 1) * query.value.pageSize
  const end = start + query.value.pageSize
  return sortedList.value.slice(start, end)
})

function handleSearch(value: string) {
  query.value.keyword = value
}

function handleSortChange(payload: { sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
  query.value.sortBy = payload.sortBy
  query.value.sortOrder = payload.sortOrder
}

watch([() => query.value.pageSize, total], () => {
  const pageCount = Math.max(1, Math.ceil(total.value / query.value.pageSize))

  if (query.value.page > pageCount) {
    query.value.page = pageCount
  }
})

watch(
  () => [query.value.keyword, query.value.sortBy, query.value.sortOrder],
  () => {
    query.value.page = 1
  }
)

</script>

<template>
  <section class="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <DataTable
      :columns="columns"
      :data="pagedList"
      :loading="false"
      @search="handleSearch"
      @sort-change="handleSortChange"
    >
      <template #footer-right>
        <Pagination
          v-model:page="query.page"
          v-model:pageSize="query.pageSize"
          :total="total"
          :page-size-options="[10, 20, 50, 100]"
        />
      </template>
    </DataTable>
  </section>
</template>
