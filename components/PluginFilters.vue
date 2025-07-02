<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">Search</label>
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            id="search"
            v-model="localFilters.search"
            type="text"
            placeholder="Search plugins..."
            class="input-field pl-10"
            @input="debouncedUpdate"
          >
        </div>
      </div>
      
      <!-- Category -->
      <div>
        <label for="category" class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">Category</label>
        <select
          id="category"
          v-model="localFilters.category"
          class="input-field"
          @change="updateFilters"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <!-- Sort -->
      <div>
        <label for="sort" class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">Sort By</label>
        <select
          id="sort"
          v-model="localFilters.sort"
          class="input-field"
          @change="updateFilters"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="stars-desc">Stars (High to Low)</option>
          <option value="stars-asc">Stars (Low to High)</option>
        </select>
      </div>
      
      <!-- Results per Page -->
      <div>
        <label for="limit" class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">Results per Page</label>
        <select
          id="limit"
          v-model="localFilters.limit"
          class="input-field"
          @change="updateFilters"
        >
          <option :value="6">6 per page</option>
          <option :value="12">12 per page</option>
          <option :value="24">24 per page</option>
          <option :value="48">48 per page</option>
        </select>
      </div>
    </div>
    
    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2">
      <span class="text-sm font-semibold text-[#2c3e50] dark:text-slate-200">Active filters:</span>
      <button
        v-if="localFilters.search"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4fc08d]/10 text-[#4fc08d] border border-[#4fc08d]/20"
        @click="clearSearch"
      >
        Search: "{{ localFilters.search }}"
        <Icon name="lucide:x" class="h-3 w-3 ml-1" />
      </button>
      <button
        v-if="localFilters.category"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
        @click="clearCategory"
      >
        {{ localFilters.category }}
        <Icon name="lucide:x" class="h-3 w-3 ml-1" />
      </button>
      <button
        class="text-xs text-slate-500 hover:text-[#4fc08d] underline transition-colors"
        @click="clearAllFilters"
      >
        Clear all
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { FilterOptions } from '~/types'

interface Props {
  filters: FilterOptions
}

interface Emits {
  (e: 'update:filters', filters: FilterOptions): void
}

const categories = [
  "Routing",
  "State Management",
  "Utilities",
  "Internationalization",
  "UI Framework",
  "Animation",
  "Forms",
  "Testing",
  "Development Tools",
  "Data Fetching",
  "CMS",
  "Search",
]

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFilters = ref({ ...props.filters })

const hasActiveFilters = computed(() => {
  return localFilters.value.search || localFilters.value.category
})

const updateFilters = () => {
  emit('update:filters', { ...localFilters.value, page: 1 })
}

const debouncedUpdate = useDebounceFn(updateFilters, 300)

const clearSearch = () => {
  localFilters.value.search = ''
  updateFilters()
}

const clearCategory = () => {
  localFilters.value.category = ''
  updateFilters()
}

const clearAllFilters = () => {
  localFilters.value.search = ''
  localFilters.value.category = ''
  updateFilters()
}

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>
