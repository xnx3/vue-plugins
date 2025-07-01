import type { FilterOptions, PaginatedResponse, VuePluginWithStars } from "~/types"
import { defineEventHandler, getQuery } from "h3"
import { pluginsData } from "~/server/data/plugins"

async function fetchGitHubStars(githubUrls: string[]): Promise<Record<string, number>> {
  try {
    const { getCachedStars, setCachedStars } = await import('~/server/utils/github-cache')
    const { extractRepoPath, buildGitHubApiUrl } = await import('~/utils/github')
    
    const results: Record<string, number> = {}
    const urlsToFetch: string[] = []

    // Check cache first
    for (const githubUrl of githubUrls) {
      const cached = await getCachedStars(githubUrl)
      if (cached) {
        results[githubUrl] = cached.stars
      } else {
        urlsToFetch.push(githubUrl)
      }
    }

    // If all results are cached, return early
    if (urlsToFetch.length === 0) {
      return results
    }

    const config = useRuntimeConfig()
    
    // Process requests in batches to avoid rate limiting
    const batchSize = 10
    const batches = []
    
    for (let i = 0; i < urlsToFetch.length; i += batchSize) {
      batches.push(urlsToFetch.slice(i, i + batchSize))
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

          const stars = response.stargazers_count
          await setCachedStars(githubUrl, stars)
          results[githubUrl] = stars
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch stars"
          console.error(`Failed to fetch stars for ${githubUrl}:`, errorMessage)
          await setCachedStars(githubUrl, 0, errorMessage)
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
    // Return empty object if fetching fails, plugins will have 0 stars
    return {}
  }
}


export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Partial<FilterOptions>

  const { search = "", category = "", sort = "stars-desc", page = 1, limit = 12 } = query

  const filteredPlugins = [...pluginsData]

  // Fetch GitHub stars for all plugins
  const githubUrls = filteredPlugins.map(plugin => plugin.githubUrl)
  const starsMap = await fetchGitHubStars(githubUrls)

  // Add stars to plugins
  const pluginsWithStars: VuePluginWithStars[] = filteredPlugins.map(plugin => ({
    ...plugin,
    stars: starsMap[plugin.githubUrl] || 0
  }))

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    pluginsWithStars.splice(0, pluginsWithStars.length, ...pluginsWithStars.filter(
      (plugin) =>
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.description.toLowerCase().includes(searchLower) ||
        plugin.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)),
    ))
  }

  // Apply category filter
  if (category) {
    pluginsWithStars.splice(0, pluginsWithStars.length, ...pluginsWithStars.filter((plugin) => plugin.category === category))
  }

  // Apply sorting
  pluginsWithStars.sort((a, b) => {
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
  const paginatedPlugins = pluginsWithStars.slice(startIndex, endIndex)

  const response: PaginatedResponse<VuePluginWithStars> = {
    data: paginatedPlugins,
    total: pluginsWithStars.length,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(pluginsWithStars.length / Number(limit)),
  }

  return response
})
