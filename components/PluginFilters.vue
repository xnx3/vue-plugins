<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
      
      <!-- Type -->
      <div>
        <label for="type" class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">Type</label>
        <select
          id="type"
          v-model="localFilters.type"
          class="input-field"
          @change="updateFilters"
        >
          <option value="">All Types</option>
          <option v-for="type in types" :key="type" :value="type">
            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
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
        </select>
      </div>
      
      <!-- View Toggle -->
      <div>
        <label class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">View</label>
        <div class="flex rounded-lg border border-slate-200 dark:border-slate-600 p-1">
          <button
            :class="[
              'flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all',
              viewMode === 'grid' 
                ? 'bg-[#4fc08d] text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            ]"
            @click="$emit('update:viewMode', 'grid')"
          >
            <Icon name="lucide:grid-3x3" class="h-4 w-4 mr-1" />
            Grid
          </button>
          <button
            :class="[
              'flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all',
              viewMode === 'list' 
                ? 'bg-[#4fc08d] text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            ]"
            @click="$emit('update:viewMode', 'list')"
          >
            <Icon name="lucide:list" class="h-4 w-4 mr-1" />
            List
          </button>
        </div>
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
        v-if="localFilters.type"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700"
        @click="clearType"
      >
        {{ localFilters.type.charAt(0).toUpperCase() + localFilters.type.slice(1) }}
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
  categories: string[]
  types: string[]
  viewMode: 'grid' | 'list'
}

interface Emits {
  (e: 'update:filters', filters: FilterOptions): void
  (e: 'update:viewMode', mode: 'grid' | 'list'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFilters = ref({ ...props.filters })

const hasActiveFilters = computed(() => {
  return localFilters.value.search || localFilters.value.category || localFilters.value.type
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

const clearType = () => {
  localFilters.value.type = ''
  updateFilters()
}

const clearAllFilters = () => {
  localFilters.value.search = ''
  localFilters.value.category = ''
  localFilters.value.type = ''
  updateFilters()
}

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>
