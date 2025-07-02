<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <PluginDetailLoadingState v-if="pending" />
    
    <!-- Error State -->
    <ErrorState 
      v-else-if="error"
      title="Plugin not found"
      :message="error.message"
      link-to="/"
      link-text="Back to Plugins"
    />
    
    <!-- Plugin Details -->
    <div v-else-if="plugin">
      <!-- Header -->
      <PluginDetailHeader :plugin="plugin" />
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Stats -->
          <PluginStats :plugin="plugin" />
          
          <!-- Documentation -->
          <PluginDocumentation :rendered-markdown="renderedMarkdown" />
        </div>
        
        <!-- Sidebar -->
        <PluginSidebar :plugin="plugin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PluginWithStats } from '~/types'
import pluginsData from '~/public/plugins.json'
import { fetchGitHubData, fetchGitHubReadme } from '~/utils/github'
import { fetchNPMDownloads } from '~/utils/npm'

const route = useRoute()
const pluginId = route.params.id as string

// Fetch plugin data using useAsyncData
const { data: plugin, pending, error } = await useAsyncData<PluginWithStats>(
  `plugin-${pluginId}`,
  async () => {
    // Find the plugin in the static data
    const basePlugin = pluginsData.find((p) => p.id === pluginId)
    if (!basePlugin) {
      throw createError({
        statusCode: 404,
        statusMessage: "Plugin not found",
      })
    }

    // Fetch GitHub data, README, and NPM downloads in parallel
    const [githubData, readme, npmData] = await Promise.all([
      fetchGitHubData(basePlugin.githubUrl),
      fetchGitHubReadme(basePlugin.githubUrl),
      fetchNPMDownloads(basePlugin.packageName),
    ])

    const pluginWithStats = {
      ...basePlugin,
      ...githubData,
      downloads: npmData.downloads,
      readme,
    } as PluginWithStats

    return pluginWithStats
  },
  {
    // Ensure data is fetched on server during static generation
    server: true
  }
)

// Initialize markdown renderer
const { renderMarkdown } = useMarkdown()

// Compute rendered markdown
const renderedMarkdown = ref('')

// Watch for plugin changes and render markdown
watchEffect(async () => {
  if (plugin.value?.readme) {
    try {
      renderedMarkdown.value = await renderMarkdown(plugin.value.readme)
    } catch (error) {
      console.error('Error rendering markdown:', error)
      renderedMarkdown.value = plugin.value.readme // Fallback to raw markdown
    }
  }
})

// SEO
useHead(() => ({
  title: plugin.value ? `${plugin.value.name} - Vue.js Plugin` : 'Plugin Not Found',
  meta: [
    {
      name: 'description',
      content: plugin.value?.description || 'Vue.js plugin details'
    }
  ]
}))
</script>
