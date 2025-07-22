<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Filters -->
      <PluginFilters
        :filters="filters"
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
        @retry="refresh"
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
import type { FilterOptions, PaginatedResponse, VuePluginWithStarsAndDownloads } from '~/types'
import pluginsData from '~/public/plugins.json'
import { fetchGitHubStars } from '~/utils/github'
import { fetchNPMDownloads } from '~/utils/npm'

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

// URL sync helpers
const route = useRoute()
const router = useRouter()

// Initialize filters from URL query parameters
const getFiltersFromQuery = () => {
  const search = (route.query.search as string) || ''
  const category = (route.query.category as string) || ''
  const sort = (route.query.sort as FilterOptions['sort']) || 'downloads-desc'
  const page = parseInt((route.query.page as string) || '1')
  const limit = parseInt((route.query.limit as string) || '12')
  
  return {
    search,
    category,
    sort,
    page,
    limit
  }
}

// State - Initialize from URL
const filters = ref<FilterOptions>(getFiltersFromQuery())

// Helper function to fetch NPM downloads
async function fetchNPMDownloadsBatch(packageNames: string[]): Promise<Record<string, number>> {
  try {
    const results: Record<string, number> = {}
    
    // Process requests in batches to avoid rate limiting
    const batchSize = 15
    const batches = []
    
    for (let i = 0; i < packageNames.length; i += batchSize) {
      batches.push(packageNames.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      const promises = batch.map(async (packageName: string) => {
        try {
          const npmData = await fetchNPMDownloads(packageName)
          results[packageName] = npmData.downloads
        } catch (error) {
          console.error(`Failed to fetch downloads for ${packageName}:`, error)
          results[packageName] = 0
        }
      })

      await Promise.all(promises)
      
      // Small delay between batches to be respectful to NPM API
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  } catch (error) {
    console.error('Failed to fetch NPM downloads:', error)
    return {}
  }
}

// Fetch all plugins with GitHub data and NPM downloads once on server side
const { data: allPluginsWithStars, pending, error, refresh } = await useAsyncData<VuePluginWithStarsAndDownloads[]>(
  'all-plugins-with-stars-and-downloads',
  async () => {
    // Start with all plugins
    const basePlugins = [...pluginsData]

    // Fetch GitHub stars and NPM downloads for all plugins in parallel
    const githubUrls = basePlugins.map(plugin => plugin.githubUrl)
    const packageNames = basePlugins.map(plugin => plugin.packageName)
    
    const [starsMap, downloadsMap] = await Promise.all([
      fetchGitHubStars(githubUrls),
      fetchNPMDownloadsBatch(packageNames)
    ])

    // Add stars and downloads to plugins
    const pluginsWithStarsAndDownloads = basePlugins.map(plugin => ({
      ...plugin,
      stars: starsMap[plugin.githubUrl] || 0,
      downloads: downloadsMap[plugin.packageName] || 0
    })) as VuePluginWithStarsAndDownloads[]

    return pluginsWithStarsAndDownloads
  }
)

// Computed property for filtering and pagination on the client side
const sortedData = computed(() => {
  if (!allPluginsWithStars.value) return null

  const { search = "", category = "", sort = "downloads-desc", page = 1, limit = 12 } = filters.value
  
  // Start with all plugins
  let filteredPlugins = [...allPluginsWithStars.value]

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredPlugins = filteredPlugins.filter(
      (plugin) =>
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.description.toLowerCase().includes(searchLower) ||
        plugin.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Apply category filter
  if (category) {
    filteredPlugins = filteredPlugins.filter((plugin) => plugin.category === category)
  }

  // Apply sorting with official plugins always first
  filteredPlugins.sort((a, b) => {
    // First, prioritize official plugins
    if (a.type === "official" && b.type !== "official") {
      return -1
    }
    if (b.type === "official" && a.type !== "official") {
      return 1
    }
    
    // If both are the same type, apply the selected sorting
    switch (sort) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "downloads-desc":
        return b.downloads - a.downloads
      case "downloads-asc":
        return a.downloads - b.downloads
      case "stars-desc":
        return b.stars - a.stars
      case "stars-asc":
        return a.stars - b.stars
      default:
        return b.downloads - a.downloads
    }
  })

  // Apply pagination
  const startIndex = (Number(page) - 1) * Number(limit)
  const endIndex = startIndex + Number(limit)
  const paginatedPlugins = filteredPlugins.slice(startIndex, endIndex)

  const response: PaginatedResponse<VuePluginWithStarsAndDownloads> = {
    data: paginatedPlugins,
    total: filteredPlugins.length,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(filteredPlugins.length / Number(limit)),
  }

  return response
})

// Methods
const updateFilters = (newFilters: FilterOptions) => {
  // Reset page to 1 when other filters change, unless it's a page-only update
  const isPageOnlyUpdate = Object.keys(newFilters).every(key => 
    key === 'page' || newFilters[key as keyof FilterOptions] === filters.value[key as keyof FilterOptions]
  )
  
  filters.value = { 
    ...newFilters, 
    page: isPageOnlyUpdate ? newFilters.page : 1 
  }
}

const updatePage = (page: number) => {
  filters.value.page = page
  // Scroll to top
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// URL sync - Watch filters and update URL
watch(filters, (newFilters) => {
  const query: Record<string, string> = {}
  
  if (newFilters.search) query.search = newFilters.search
  if (newFilters.category) query.category = newFilters.category
  if (newFilters.sort !== 'stars-desc') query.sort = newFilters.sort
  if (newFilters.page > 1) query.page = newFilters.page.toString()
  if (newFilters.limit !== 12) query.limit = newFilters.limit.toString()
  
  router.push({ query })
}, { deep: true })

// Watch URL changes and update filters (for browser back/forward)
watch(() => route.query, () => {
  const newFilters = getFiltersFromQuery()
  
  // Only update if filters actually changed to avoid infinite loop
  if (JSON.stringify(filters.value) !== JSON.stringify(newFilters)) {
    filters.value = newFilters
  }
}, { deep: true })
</script>


