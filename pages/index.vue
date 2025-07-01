<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Filters -->
      <PluginFilters
        :filters="filters"
        :categories="categories || []"
        @update:filters="updateFilters"
      />
      
      <!-- Loading State -->
      <LoadingState v-if="pending" />
      
      <!-- Error State -->
      <ErrorState 
        v-else-if="error"
        title="Failed to load plugins"
        :message="error.message"
        show-retry
        @retry="refresh()"
      />
      
      <!-- Results -->
      <div v-else-if="sortedData">
        <!-- Results Header -->
        <ResultsHeader :total="sortedData.total" />
        
        <!-- Empty State -->
        <EmptyState v-if="sortedData.data.length === 0" />
        
        <!-- Plugin Grid -->
        <PluginGrid
          v-else
          :plugins="sortedData.data"
          :current-page="sortedData.page"
          :total-pages="sortedData.totalPages"
          :total="sortedData.total"
          :limit="sortedData.limit"
          @update:page="updatePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterOptions, PaginatedResponse, VuePluginWithStars } from '~/types'

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
const filters = ref<FilterOptions>({
  search: '',
  category: '',
  sort: 'stars-desc',
  page: 1,
  limit: 12
})

// Fetch categories
const { data: categories } = await useFetch<string[]>('/api/categories')

// Fetch plugins with reactivity
const { data, pending, error, refresh } = await useFetch<PaginatedResponse<VuePluginWithStars>>('/api/plugins', {
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
  if (newFilters.sort !== 'stars-desc') query.sort = newFilters.sort
  if (newFilters.page > 1) query.page = newFilters.page.toString()
  
  router.push({ query })
}, { deep: true })

// Initialize from URL
onMounted(() => {
  if (route.query.search) filters.value.search = route.query.search as string
  if (route.query.category) filters.value.category = route.query.category as string
  if (route.query.sort) filters.value.sort = route.query.sort as FilterOptions['sort']
  if (route.query.page) filters.value.page = parseInt(route.query.page as string)
})
</script>


