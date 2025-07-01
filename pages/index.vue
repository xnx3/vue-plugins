<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section with Background Animation -->
    <div class="relative text-center overflow-hidden min-h-[400px] flex flex-col justify-center py-16">
      <!-- Background Animation -->
      <div class="absolute inset-0 z-0">
        <!-- Floating particles -->
        <div class="absolute inset-0">
          <div 
            v-for="(particle, i) in particles" 
            :key="i"
            class="absolute animate-float particle-diamond"
            :class="[
              `animate-float-${particle.pattern}`,
              particle.size === 3 ? 'w-3 h-3' : 
              particle.size === 4 ? 'w-4 h-4' : 
              particle.size === 5 ? 'w-5 h-5' : 'w-6 h-6'
            ]"
            :style="{
              left: particle.left + '%',
              top: particle.top + '%',
              animationDelay: particle.delay + 's',
              animationDuration: particle.duration + 's',
              '--rotation-offset': particle.rotationOffset + 'deg'
            }"
          />
        </div>
      </div>
      
      <h1 class="relative text-5xl font-bold text-[#2c3e50] dark:text-slate-100 mb-6 z-20">
        Vue.js Plugins Collection
      </h1>
      <p class="relative text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed z-20">
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
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"/>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"/>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"/>
        <div class="flex space-x-2 mb-4">
          <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"/>
          <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"/>
        </div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"/>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="lucide:alert-circle" class="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-[#2c3e50] dark:text-slate-100 mb-2">Failed to load plugins</h3>
      <p class="text-slate-600 dark:text-slate-300 mb-4">{{ error.message }}</p>
      <button class="btn-primary" @click="refresh()">
        Try Again
      </button>
    </div>
    
    <!-- Results -->
    <div v-else-if="sortedData">
      <!-- Results Header -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-slate-600 dark:text-slate-300">
          {{ sortedData.total }} plugin{{ sortedData.total !== 1 ? 's' : '' }} found
        </p>
      </div>
      
      <!-- Empty State -->
      <div v-if="sortedData.data.length === 0" class="text-center py-12">
        <Icon name="lucide:search-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No plugins found</h3>
        <p class="text-gray-600 dark:text-slate-300">Try adjusting your search criteria</p>
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
const viewMode = ref<'grid' | 'list'>('grid')
const filters = ref<FilterOptions>({
  search: '',
  category: '',
  type: '',
  sort: 'stars-desc',
  page: 1,
  limit: 12
})

// Generate particles for animation (to avoid hydration mismatch)
// Using multiple prime numbers and offsets to create truly scattered distribution
const particles = ref(
  Array.from({ length: 60 }, (_, i) => {
    // Multiple mathematical sequences to break any linear patterns
    const leftBase = (i * 37) % 100;
    const leftOffset = (i * 73) % 20;
    const topBase = (i * 41) % 100;
    const topOffset = (i * 67) % 25;
    
    return {
      left: Math.max(1, Math.min(99, leftBase + (leftOffset - 10))), // Random scatter with bounds
      top: Math.max(1, Math.min(99, topBase + (topOffset - 12))), // Random scatter with bounds
      delay: (i * 0.13) % 18, // Extended delay range
      duration: 4 + (i % 12), // Longer duration variety
      size: 3 + (i % 4), // Size range: 3-6
      pattern: i % 4, // 4 different patterns
      rotationOffset: (i * 31) % 360 // Random initial rotation
    }
  })
)

// Fetch categories and types
const { data: categories } = await useFetch<string[]>('/api/categories')
const { data: types } = await useFetch<string[]>('/api/types')

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

<style scoped>
/* Animation keyframes - Multiple patterns for varied movement */
@keyframes float {
  0%, 100% { 
    transform: rotate(45deg) translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  25% {
    transform: rotate(135deg) translateY(-30px) translateX(10px);
    opacity: 0.6;
  }
  50% { 
    transform: rotate(225deg) translateY(-50px) translateX(-10px);
    opacity: 0.4;
  }
  75% {
    transform: rotate(315deg) translateY(-20px) translateX(-15px);
    opacity: 0.5;
  }
}

@keyframes float-0 {
  0%, 100% { 
    transform: rotate(0deg) translateY(0px) translateX(0px);
    opacity: 0.25;
  }
  33% {
    transform: rotate(120deg) translateY(-40px) translateX(20px);
    opacity: 0.5;
  }
  66% { 
    transform: rotate(240deg) translateY(-25px) translateX(-25px);
    opacity: 0.35;
  }
}

@keyframes float-1 {
  0%, 100% { 
    transform: rotate(90deg) translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  25% {
    transform: rotate(180deg) translateY(-35px) translateX(-15px);
    opacity: 0.6;
  }
  50% { 
    transform: rotate(270deg) translateY(-60px) translateX(5px);
    opacity: 0.4;
  }
  75% {
    transform: rotate(360deg) translateY(-15px) translateX(20px);
    opacity: 0.55;
  }
}

@keyframes float-2 {
  0%, 100% { 
    transform: rotate(calc(30deg + var(--rotation-offset, 0deg))) translateY(0px) translateX(0px);
    opacity: 0.35;
  }
  20% {
    transform: rotate(calc(90deg + var(--rotation-offset, 0deg))) translateY(-20px) translateX(30px);
    opacity: 0.5;
  }
  40% { 
    transform: rotate(calc(150deg + var(--rotation-offset, 0deg))) translateY(-45px) translateX(-10px);
    opacity: 0.25;
  }
  60% {
    transform: rotate(calc(210deg + var(--rotation-offset, 0deg))) translateY(-30px) translateX(-20px);
    opacity: 0.45;
  }
  80% {
    transform: rotate(calc(270deg + var(--rotation-offset, 0deg))) translateY(-10px) translateX(15px);
    opacity: 0.6;
  }
}

@keyframes float-3 {
  0%, 100% { 
    transform: rotate(calc(60deg + var(--rotation-offset, 0deg))) translateY(0px) translateX(0px) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: rotate(calc(150deg + var(--rotation-offset, 0deg))) translateY(-35px) translateX(25px) scale(1.1);
    opacity: 0.55;
  }
  50% { 
    transform: rotate(calc(240deg + var(--rotation-offset, 0deg))) translateY(-55px) translateX(-15px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: rotate(calc(330deg + var(--rotation-offset, 0deg))) translateY(-25px) translateX(-30px) scale(1.05);
    opacity: 0.5;
  }
}

@keyframes pulse-slow {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.8;
  }
  50% { 
    transform: scale(1.15);
    opacity: 1;
  }
}

@keyframes pulse-slower {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    opacity: 0.6;
  }
  33% {
    transform: scale(1.08) rotate(120deg);
    opacity: 0.9;
  }
  66% {
    transform: scale(0.95) rotate(240deg);
    opacity: 0.7;
  }
}

/* Floating particle animation classes */
.animate-float {
  animation-name: float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.animate-float-0 {
  animation-name: float-0;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.animate-float-1 {
  animation-name: float-1;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.animate-float-2 {
  animation-name: float-2;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.animate-float-3 {
  animation-name: float-3;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* Futuristic diamond particle shape */
.particle-diamond {
  transform: rotate(45deg);
  border-radius: 3px;
  position: relative;
  background: linear-gradient(135deg, #4fc08d, #42b883);
  opacity: 0.4;
  box-shadow: 
    0 0 6px rgba(79, 192, 141, 0.2),
    0 0 12px rgba(79, 192, 141, 0.1);
  flex-shrink: 0;
  overflow: hidden;
  max-width: 24px;
  max-height: 24px;
}

.particle-diamond::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: linear-gradient(135deg, #4fc08d, #42b883, #4fc08d);
  border-radius: 4px;
  z-index: -1;
  opacity: 0.3;
  filter: blur(1px);
}

.animate-pulse-slow {
  animation-name: pulse-slow;
  animation-duration: 4s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.animate-pulse-slower {
  animation-name: pulse-slower;
  animation-duration: 8s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
</style>
