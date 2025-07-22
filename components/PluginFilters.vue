<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
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
            class="input-field pl-10 pr-12"
            @input="updateFilters"
          >
          <button
            v-if="localFilters.search"
            class="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-400 hover:text-slate-600 hover:border-slate-400 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:border-slate-400 transition-colors flex items-center justify-center"
            aria-label="Clear search"
            @click="clearSearch"
          >
            <Icon name="lucide:x" class="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <!-- Category -->
      <div>
        <label for="category" class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">Category</label>
        <div class="relative">
          <select
            id="category"
            v-model="localFilters.category"
            class="input-field appearance-none pr-10"
            @change="updateFilters"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <Icon 
            name="lucide:chevron-down" 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" 
          />
          <button
            v-if="localFilters.category"
            class="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-400 hover:text-slate-600 hover:border-slate-400 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:border-slate-400 transition-colors flex items-center justify-center z-10"
            aria-label="Clear category filter"
            @click="clearCategory"
          >
            <Icon name="lucide:x" class="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <!-- Sort -->
      <div>
        <label for="sort" class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">Sort By</label>
        <div class="relative">
          <select
            id="sort"
            v-model="localFilters.sort"
            class="input-field appearance-none pr-10"
            @change="updateFilters"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="downloads-desc">Downloads (High to Low)</option>
            <option value="downloads-asc">Downloads (Low to High)</option>
            <option value="stars-desc">Stars (High to Low)</option>
            <option value="stars-asc">Stars (Low to High)</option>
          </select>
          <Icon 
            name="lucide:chevron-down" 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" 
          />
          <button
            v-if="localFilters.sort !== 'downloads-desc'"
            class="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-400 hover:text-slate-600 hover:border-slate-400 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:border-slate-400 transition-colors flex items-center justify-center z-10"
            aria-label="Reset sort to default (Downloads High to Low)"
            @click="clearSort"
          >
            <Icon name="lucide:x" class="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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

const clearSearch = () => {
  localFilters.value.search = ''
  updateFilters()
}

const clearCategory = () => {
  localFilters.value.category = ''
  updateFilters()
}

const clearSort = () => {
  localFilters.value.sort = 'downloads-desc'
  updateFilters()
}


watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>
