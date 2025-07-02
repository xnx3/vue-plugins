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
import type { PluginWithStats, GitHubRepo } from '~/types'
import pluginsData from '~/public/plugins.json'
import { extractRepoPath, buildGitHubApiUrl, buildRawGitHubUrl } from '~/utils/github'

const route = useRoute()
const pluginId = route.params.id as string

// Helper functions for fetching GitHub data
async function fetchGitHubData(githubUrl: string): Promise<{
  stars: number
  forks: number
  issues: number
  lastCommit: string
  license: string
}> {
  try {
    const config = useRuntimeConfig()
    const repoPath = extractRepoPath(githubUrl)
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Vue-Plugins-Collection"
    }

    // Add auth token if available for higher rate limits
    if (config.githubToken) {
      headers["Authorization"] = `Bearer ${config.githubToken}`
    }

    const response = await $fetch<GitHubRepo>(buildGitHubApiUrl(repoPath, ""), {
      headers,
      timeout: 10000 // 10 second timeout for individual requests
    })

    return {
      stars: response.stargazers_count,
      forks: response.forks_count,
      issues: response.open_issues_count,
      lastCommit: response.pushed_at,
      license: response.license?.name || "Unknown",
    }
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error)
    return {
      stars: 0,
      forks: 0,
      issues: 0,
      lastCommit: new Date().toISOString(),
      license: "Unknown",
    }
  }
}

async function fetchGitHubReadme(githubUrl: string): Promise<string> {
  try {
    const config = useRuntimeConfig()
    const repoPath = extractRepoPath(githubUrl)
    const readmeFiles = ["README.md", "README.rst", "README.txt", "readme.md", "readme.rst", "readme.txt"]

    for (const filename of readmeFiles) {
      try {
        const headers: Record<string, string> = {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Vue-Plugins-Collection",
        }

        // Add auth token if available for higher rate limits
        if (config.githubToken) {
          headers["Authorization"] = `Bearer ${config.githubToken}`
        }

        const response = await $fetch<{ content: string; encoding: string }>(
          buildGitHubApiUrl(repoPath, `/contents/${filename}`),
          {
            headers,
            timeout: 10000 // Add timeout for README fetch too
          },
        )

        if (response.content && response.encoding === "base64") {
          let content = Buffer.from(response.content, "base64").toString("utf-8")

          // Fix relative URLs in the README to point to the correct GitHub URLs
          content = content.replace(
            /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
            `![$1](${buildRawGitHubUrl(repoPath, "main", "$2")})`,
          )

          content = content.replace(
            /\[([^\]]+)\]\((?!https?:\/\/)([^)]+)\.md\)/g,
            `[$1](https://github.com/${repoPath}/blob/main/$2.md)`,
          )

          return content
        }
      } catch {
        // Continue to next filename if this one fails
        continue
      }
    }

    return ""
  } catch (error) {
    console.error("Failed to fetch README:", error)
    return ""
  }
}

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

    // Fetch GitHub data and README in parallel
    const [githubData, readme] = await Promise.all([
      fetchGitHubData(basePlugin.githubUrl),
      fetchGitHubReadme(basePlugin.githubUrl),
    ])

    // Mock downloads data (in real app, fetch from npm API)
    const downloads = Math.floor(Math.random() * 1000000) + 10000

    const pluginWithStats = {
      ...basePlugin,
      ...githubData,
      downloads,
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
