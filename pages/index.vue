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
import type { FilterOptions, PaginatedResponse, VuePluginWithStars } from '~/types'
import pluginsData from '~/public/plugins.json'
import { extractRepoPath, buildGitHubApiUrl } from '~/utils/github'

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

// Helper function to fetch GitHub stars
async function fetchGitHubStars(githubUrls: string[]): Promise<Record<string, number>> {
  try {
    const config = useRuntimeConfig()
    const results: Record<string, number> = {}
    
    // Process requests in batches to avoid rate limiting
    const batchSize = 10
    const batches = []
    
    for (let i = 0; i < githubUrls.length; i += batchSize) {
      batches.push(githubUrls.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      const promises = batch.map(async (githubUrl: string) => {
        try {
          const repoPath = extractRepoPath(githubUrl)
          const headers: Record<string, string> = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Vue-Plugins-Collection"
          }

          // Add auth token if available for higher rate limits
          if (config.githubToken) {
            headers["Authorization"] = `Bearer ${config.githubToken}`
          }

          const response = await $fetch<{ stargazers_count: number }>(
            buildGitHubApiUrl(repoPath, ""),
            {
              headers,
              timeout: 5000 // 5 second timeout
            }
          )

          results[githubUrl] = response.stargazers_count
        } catch (error) {
          console.error(`Failed to fetch stars for ${githubUrl}:`, error)
          results[githubUrl] = 0
        }
      })

      await Promise.all(promises)
      
      // Small delay between batches to be respectful to GitHub API
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error)
    return {}
  }
}

// Fetch all plugins with GitHub data once on server side
const { data: allPluginsWithStars, pending, error, refresh } = await useAsyncData<VuePluginWithStars[]>(
  'all-plugins-with-stars',
  async () => {
    // Start with all plugins
    const basePlugins = [...pluginsData]

    // Fetch GitHub stars for all plugins
    const githubUrls = basePlugins.map(plugin => plugin.githubUrl)
    const starsMap = await fetchGitHubStars(githubUrls)

    // Add stars to plugins
    const pluginsWithStars = basePlugins.map(plugin => ({
      ...plugin,
      stars: starsMap[plugin.githubUrl] || 0
    })) as VuePluginWithStars[]

    return pluginsWithStars
  }
)

// Computed property for filtering and pagination on the client side
const sortedData = computed(() => {
  if (!allPluginsWithStars.value) return null

  const { search = "", category = "", sort = "stars-desc", page = 1, limit = 12 } = filters.value
  
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
      case "stars-desc":
        return b.stars - a.stars
      case "stars-asc":
        return a.stars - b.stars
      default:
        return b.stars - a.stars
    }
  })

  // Apply pagination
  const startIndex = (Number(page) - 1) * Number(limit)
  const endIndex = startIndex + Number(limit)
  const paginatedPlugins = filteredPlugins.slice(startIndex, endIndex)

  const response: PaginatedResponse<VuePluginWithStars> = {
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


