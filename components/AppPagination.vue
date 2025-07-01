<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between">
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        :disabled="currentPage <= 1"
        class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        @click="emit('update:page', currentPage - 1)"
      >
        Previous
      </button>
      <button
        :disabled="currentPage >= totalPages"
        class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        @click="emit('update:page', currentPage + 1)"
      >
        Next
      </button>
    </div>
    
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-slate-700">
          Showing
          <span class="font-semibold">{{ startItem }}</span>
          to
          <span class="font-semibold">{{ endItem }}</span>
          of
          <span class="font-semibold">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="emit('update:page', currentPage - 1)"
          >
            <Icon name="lucide:chevron-left" class="h-5 w-5" />
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === currentPage
                ? 'z-10 bg-[#4fc08d]/10 border-[#4fc08d] text-[#4fc08d]'
                : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
            ]"
            @click="emit('update:page', page)"
          >
            {{ page }}
          </button>
          
          <button
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="emit('update:page', currentPage + 1)"
          >
            <Icon name="lucide:chevron-right" class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number
  totalPages: number
  total: number
  limit: number
}

interface Emits {
  (e: 'update:page', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const startItem = computed(() => (props.currentPage - 1) * props.limit + 1)
const endItem = computed(() => Math.min(props.currentPage * props.limit, props.total))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>
