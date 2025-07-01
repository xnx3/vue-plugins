<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-[#2c3e50] mb-6">
        Vue.js Plugins Collection
      </h1>
      <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
        Discover and explore the best Vue.js plugins to supercharge your applications. 
        Curated by the community, maintained by developers.
      </p>
    </div>
    
    <!-- Filters -->
    <PluginFilters
      :filters="filters"
      :categories="categories || []"
      :types="types || []"
      :view-mode="viewMode"
      @update:filters="updateFilters"
      @update:view-mode="viewMode = $event"
    />
    
    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card p-6 animate-pulse">
        <div class="h-4 bg-slate-200 rounded w-3/4 mb-4"/>
        <div class="h-3 bg-slate-200 rounded w-full mb-2"/>
        <div class="h-3 bg-slate-200 rounded w-2/3 mb-4"/>
        <div class="flex space-x-2 mb-4">
          <div class="h-6 bg-slate-200 rounded-full w-16"/>
          <div class="h-6 bg-slate-200 rounded-full w-20"/>
        </div>
        <div class="h-3 bg-slate-200 rounded w-1/2"/>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="lucide:alert-circle" class="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-[#2c3e50] mb-2">Failed to load plugins</h3>
      <p class="text-slate-600 mb-4">{{ error.message }}</p>
      <button class="btn-primary" @click="refresh()">
        Try Again
      </button>
    </div>
    
    <!-- Results -->
    <div v-else-if="sortedData">
      <!-- Results Header -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-slate-600">
          {{ sortedData.total }} plugin{{ sortedData.total !== 1 ? 's' : '' }} found
        </p>
      </div>
      
      <!-- Empty State -->
      <div v-if="sortedData.data.length === 0" class="text-center py-12">
        <Icon name="lucide:search-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No plugins found</h3>
        <p class="text-gray-600">Try adjusting your search criteria</p>
      </div>
      
      <!-- Plugin Grid/List -->
      <div v-else>
        <div 
          :class="[
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          ]"
        >
          <PluginCard
            v-for="plugin in sortedData.data"
            :key="plugin.id"
            :plugin="plugin"
          />
        </div>
        
        <!-- Pagination -->
        <div class="mt-12">
          <AppPagination
            :current-page="sortedData.page"
            :total-pages="sortedData.totalPages"
            :total="sortedData.total"
            :limit="sortedData.limit"
            @update:page="updatePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterOptions, PaginatedResponse, VuePlugin } from '~/types'

// SEO
useHead({
  title: 'Vue.js Plugins Collection - Discover the Best Vue Plugins',
  meta: [
    {
      name: 'description',
      content: 'Discover and explore the best Vue.js plugins to supercharge your applications. Curated by the community, maintained by developers.'
    }
  ]
})

// State
const viewMode = ref<'grid' | 'list'>('grid')
const filters = ref<FilterOptions>({
  search: '',
  category: '',
  type: '',
  sort: 'name-asc',
  page: 1,
  limit: 12
})

// Fetch categories and types
const { data: categories } = await useFetch<string[]>('/api/categories')
const { data: types } = await useFetch<string[]>('/api/types')

// Fetch plugins with reactivity
const { data, pending, error, refresh } = await useFetch<PaginatedResponse<VuePlugin>>('/api/plugins', {
  query: filters,
  server: false,
  watch: [filters]
})

// Computed property to sort plugins with official plugins first
const sortedData = computed(() => {
  if (!data.value) return null
  
  const sortedPlugins = [...data.value.data].sort((a, b) => {
    // First, prioritize official plugins
    if (a.type === "official" && b.type === "community") {
      return -1
    }
    if (a.type === "community" && b.type === "official") {
      return 1
    }
    
    // If both are the same type, maintain original order (already sorted by API)
    return 0
  })
  
  return {
    ...data.value,
    data: sortedPlugins
  }
})

// Methods
const updateFilters = (newFilters: FilterOptions) => {
  filters.value = { ...newFilters }
}

const updatePage = (page: number) => {
  filters.value.page = page
  // Scroll to top
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// URL sync
const route = useRoute()
const router = useRouter()

watch(filters, (newFilters) => {
  const query: Record<string, string> = {}
  
  if (newFilters.search) query.search = newFilters.search
  if (newFilters.category) query.category = newFilters.category
  if (newFilters.type) query.type = newFilters.type
  if (newFilters.sort !== 'name-asc') query.sort = newFilters.sort
  if (newFilters.page > 1) query.page = newFilters.page.toString()
  
  router.push({ query })
}, { deep: true })

// Initialize from URL
onMounted(() => {
  if (route.query.search) filters.value.search = route.query.search as string
  if (route.query.category) filters.value.category = route.query.category as string
  if (route.query.type) filters.value.type = route.query.type as string
  if (route.query.sort) filters.value.sort = route.query.sort as FilterOptions['sort']
  if (route.query.page) filters.value.page = parseInt(route.query.page as string)
})
</script>
