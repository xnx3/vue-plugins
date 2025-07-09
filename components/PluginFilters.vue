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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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

const updateFilters = () => {
  emit('update:filters', { ...localFilters.value, page: 1 })
}

const debouncedUpdate = useDebounceFn(updateFilters, 300)

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>
