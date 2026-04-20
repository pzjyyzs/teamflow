<script setup lang="ts">
import type { PageItem, PaginationChange, PaginationProps } from './Pagination.types';

const props = withDefaults(defineProps<PaginationProps>(), {
    disabled: false
})

const emit = defineEmits<{
    (e: 'update:page', page: number): void
    (e: 'update:pageSize', pageSize: number): void
    (e: 'change', payload: PaginationChange): void
}>()

// 总数
const pageCount = computed(() => {
  const total = Math.max(0, props.total)
  const pageSize = Math.max(1, props.pageSize)
  return Math.max(1, Math.ceil(total / pageSize))
})

// 合理页码
const clampedPage = computed(() => {
    return Math.min(Math.max(props.page, 1), pageCount.value)
})

const rangeText = computed(() => {
    const total = Math.max(0, props.total)

    if (total === 0) return '0 条'

    const from = (clampedPage.value - 1) * props.pageSize + 1
    const to = Math.min(clampedPage.value * props.pageSize, total)

    return `${from}-${to} / ${total}`
})

const pageItems = computed(() => {
  return getPageItems(clampedPage.value, pageCount.value)
})

const canPrev = computed(() => {
  return !props.disabled && clampedPage.value > 1
})

const canNext = computed(() => {
  return !props.disabled && clampedPage.value < pageCount.value
})

function getPageItems(page: number, count: number): PageItem[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, index) => index + 1)
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, '...', count]
  }

  if (page >= count - 3) {
    return [1, '...', count - 4, count - 3, count - 2, count - 1, count]
  }

  return [1, '...', page - 1, page, page + 1, '...', count]
}

function goToPage(nextPage: number) {
    const page = Math.min(Math.max(nextPage, 1), pageCount.value)

    if (page === props.page) return

    emit('update:page', page)
    
    emit('change', {
        page,
        pageSize: props.pageSize,
        reason: 'page'
    })
}


function prev() {
  if (!canPrev.value) return
  goToPage(clampedPage.value - 1)
}

function next() {
  if (!canNext.value) return
  goToPage(clampedPage.value + 1)
}

function onChangePageSize(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value)

    if (!Number.isFinite(value) || value <= 0) return
    if (value === props.pageSize) return

    emit('update:pageSize', value)
    emit('update:page', 1)
    emit('change', {
        page: 1,
        pageSize: value,
        reason: 'pageSize'})
}
</script>

<template>
    <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="text-xs text-zinc-500">
            {{ rangeText }}
        </div>

        <div class="flex items-center gap-1">
            <button
                type="button"
                class="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!canPrev"
                @click="prev"
            >
                上一页
            </button>

            <template v-for="(item, index) of pageItems" :key="`${item}-${index}`">
                <span
                    v-if="item === '...'"
                    class="px-2 text-xs text-zinc-400"
                >...</span>
                <button 
                    v-else
                    type="button"
                    class="min-w-9 rounded-xl border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                    :class="item === clampedPage ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'"
                    :disabled="props.disabled"
                    @click="goToPage(item)"
                >
                    {{ item }}
                </button>
            </template>

            <button
                type="button"
                class="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!canNext"
                @click="next"
            >
                下一页
            </button>
        </div>

        <div v-if="props.pageSizeOptions?.length" class="flex items-center gap-2">
            <span class="text-xs text-zinc-500">每页</span>

            <select
                class="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="props.disabled"
                :value="props.pageSize"
                @change="onChangePageSize"
            >
                <option
                    v-for="size in props.pageSizeOptions"
                    :key="size"
                    :value="size"
                >
                    {{ size }}
                </option>
            </select>

                <span class="text-xs text-zinc-500">条</span>
        </div>
    </div>
</template>