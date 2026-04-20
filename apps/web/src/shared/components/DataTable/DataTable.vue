<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Column, DataTableProps, SortState } from './DataTable.types'

const props = withDefaults(defineProps<DataTableProps>(), {
  loading: false,
})


const emit = defineEmits<{
  (e: 'search', keyword: string): void
  (e: 'sort-change', sort: SortState): void
  (e: 'columns-change', keys: string[]): void
  (e: 'row-click', row: any): void
}>()

const keyword = ref('')
const searchInputEl = ref<HTMLInputElement | null>(null)

const showColumnConfig = ref(false)
const columnConfigEl = ref<HTMLElement | null>(null)
const columnConfigBtnEl = ref<HTMLButtonElement | null>(null)

const visibleColumns = ref<string[]>([])
const currentSort = ref<SortState>({})

const hideableColumns = computed(() => props.columns.filter((col) => col.hideable !== false))

watch(
  () => props.columns,
  (next) => {
    const allKeys = next.map((col) => col.key)
    if (!visibleColumns.value.length) {
      visibleColumns.value = [...allKeys]
      return
    }

    visibleColumns.value = visibleColumns.value.filter((key) => allKeys.includes(key))
    if (!visibleColumns.value.length) visibleColumns.value = [...allKeys]
  },
  { immediate: true }
)

const displayColumns = computed(() => {
  const keySet = new Set(visibleColumns.value)
  return props.columns.filter((col) => keySet.has(col.key))
})

const hasRows = computed(() => props.data.length > 0)
const isEmpty = computed(() => !props.loading && !hasRows.value)
const hasNoColumns = computed(() => displayColumns.value.length === 0)

const selectedCountLabel = computed(() => `${displayColumns.value.length}/${props.columns.length}`)

const formatCell = (value: unknown) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string' && value.trim() === '') return '-'
  return String(value)
}

const onSearch = () => {
  emit('search', keyword.value.trim())
}

const onClearSearch = async () => {
  keyword.value = ''
  emit('search', '')
  await nextTick()
  searchInputEl.value?.focus()
}

const toggleColumn = (key: string) => {
  if (visibleColumns.value.includes(key) && visibleColumns.value.length <= 1) return

  const next = new Set(visibleColumns.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)

  visibleColumns.value = [...next]
  emit('columns-change', [...visibleColumns.value])
}

const setVisibleColumns = (keys: string[]) => {
  const allowed = new Set(props.columns.map((col) => col.key))
  const next = keys.filter((k) => allowed.has(k))
  visibleColumns.value = next.length ? next : props.columns.map((col) => col.key)
  emit('columns-change', [...visibleColumns.value])
}

const showAllColumns = () => {
  setVisibleColumns(props.columns.map((col) => col.key))
}

const hideAllHideableColumns = () => {
  const required = props.columns.filter((col) => col.hideable === false).map((col) => col.key)
  setVisibleColumns(required.length ? required : [props.columns[0]?.key].filter(Boolean) as string[])
}

const setSort = (next: SortState) => {
  currentSort.value = { ...next }
  emit('sort-change', { ...currentSort.value })
}

const handleSortClick = (column: Column) => {
  if (!column.sortable) return

  const prev = currentSort.value
  if (prev.sortBy !== column.key) {
    setSort({ sortBy: column.key, sortOrder: 'asc' })
    return
  }

  if (prev.sortOrder === 'asc') {
    setSort({ sortBy: column.key, sortOrder: 'desc' })
    return
  }

  setSort({})
}

const onRowClick = (row: any) => {
  emit('row-click', row)
}

const closeColumnConfig = () => {
  showColumnConfig.value = false
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!showColumnConfig.value) return
  const target = event.target as Node | null
  if (!target) return
  if (columnConfigEl.value?.contains(target)) return
  if (columnConfigBtnEl.value?.contains(target)) return
  closeColumnConfig()
}

const onDocumentKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  closeColumnConfig()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeyDown)
})
</script>

<template>
  <section class="rounded-2xl border border-zinc-200 bg-white shadow-sm">
    <header class="flex flex-col gap-3 border-b border-zinc-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <slot name="toolbar-left" :keyword="keyword" :focus="() => searchInputEl?.focus?.()">
          <div class="relative w-full sm:max-w-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.1-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
            </svg>

            <input
              ref="searchInputEl"
              v-model="keyword"
              type="search"
              placeholder="搜索..."
              class="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900"
              @keyup.enter="onSearch"
            />
          </div>

          <button
            type="button"
            class="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            @click="onSearch"
          >
            搜索
          </button>

          <button
            v-if="keyword.trim()"
            type="button"
            class="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            @click="onClearSearch"
          >
            清空
          </button>
        </slot>
      </div>

      <div class="flex items-center justify-between gap-2 sm:justify-end">
        <slot name="toolbar-right" />

        <div class="relative">
          <button
            ref="columnConfigBtnEl"
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            @click="showColumnConfig = !showColumnConfig"
          >
            列配置
            <span class="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600">
              {{ selectedCountLabel }}
            </span>
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-if="showColumnConfig"
              ref="columnConfigEl"
              class="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg"
            >
              <div class="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
                <div>
                  <p class="text-sm font-semibold text-zinc-900">显示列</p>
                  <p class="mt-0.5 text-xs text-zinc-500">至少保留 1 列</p>
                </div>

                <button
                  type="button"
                  class="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                  @click="closeColumnConfig"
                >
                  关闭
                </button>
              </div>

              <div class="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  class="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                  @click="showAllColumns"
                >
                  全选
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                  @click="hideAllHideableColumns"
                >
                  全不选
                </button>
              </div>

              <div class="max-h-72 overflow-auto px-2 pb-2">
                <label
                  v-for="column of hideableColumns"
                  :key="column.key"
                  class="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-zinc-50"
                >
                  <div class="min-w-0">
                    <p class="truncate font-medium text-zinc-900">{{ column.label }}</p>
                    <p class="mt-0.5 truncate text-xs text-zinc-500">{{ column.key }}</p>
                  </div>

                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    :checked="visibleColumns.includes(column.key)"
                    @change="toggleColumn(column.key)"
                  />
                </label>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white text-sm">
        <thead class="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
          <tr>
            <th
              v-for="column of displayColumns"
              :key="column.key"
              class="whitespace-nowrap px-4 py-3 text-left font-semibold"
              :style="{ width: column.width, textAlign: column.align || 'left' }"
            >
              <button
                v-if="column.sortable"
                type="button"
                class="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-white"
                @click="handleSortClick(column)"
              >
                <span class="text-zinc-800">{{ column.label }}</span>
                <span class="text-zinc-400">
                  <span v-if="currentSort.sortBy === column.key">
                    {{ currentSort.sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                  <span v-else>↕</span>
                </span>
              </button>
              <span v-else class="text-zinc-800">{{ column.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody v-if="props.loading">
          <tr>
            <td :colspan="displayColumns.length || 1" class="px-4 py-10 text-center text-zinc-500">
              <slot name="loading">
                <div class="flex items-center justify-center gap-2">
                  <div class="h-5 w-5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                  <span>加载中...</span>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="hasNoColumns">
          <tr>
            <td :colspan="1" class="px-4 py-10 text-center text-zinc-500">
              请在列配置中选择至少一列
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="isEmpty">
          <tr>
            <td :colspan="displayColumns.length" class="px-4 py-10 text-center text-zinc-500">
              <slot name="empty">暂无数据</slot>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr
            v-for="(row, rowIndex) of props.data"
            :key="row?.id ?? rowIndex"
            class="border-b border-zinc-100 transition hover:bg-zinc-50"
            @click="onRowClick(row)"
          >
            <td
              v-for="column of displayColumns"
              :key="column.key"
              class="px-4 py-3 text-zinc-700"
              :style="{ textAlign: column.align || 'left' }"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row?.[column.key]"
                :column="column"
              >
                <span class="block truncate">
                  {{
                    column.render
                      ? formatCell(column.render(row?.[column.key], row))
                      : formatCell(row?.[column.key])
                  }}
                </span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer class="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
      <slot name="footer-left">
        <span>本页 {{ props.data.length }} 条</span>
      </slot>
      <slot name="footer-right" />
    </footer>
  </section>
</template>
