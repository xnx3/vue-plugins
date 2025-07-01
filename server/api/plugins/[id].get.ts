import type { PluginWithStats, GitHubRepo } from "~/types"
import { $fetch } from "ofetch"
import { defineEventHandler, getRouterParam, createError } from "h3"
import { extractRepoPath, buildGitHubApiUrl, buildRawGitHubUrl } from "~/utils/github"
import { pluginsData } from "~/server/data/plugins"
import { getCachedStars, setCachedStars } from "~/server/utils/github-cache"

async function fetchGitHubData(githubUrl: string): Promise<{
  stars: number
  forks: number
  issues: number
  lastCommit: string
  license: string
}> {
  try {
    const repoPath = extractRepoPath(githubUrl)
    const response = await $fetch<GitHubRepo>(buildGitHubApiUrl(repoPath, ""))

    const stars = response.stargazers_count
    
    // Update cache with fresh data
    await setCachedStars(githubUrl, stars)

    return {
      stars,
      forks: response.forks_count,
      issues: response.open_issues_count,
      lastCommit: response.pushed_at,
      license: response.license?.name || "Unknown",
    }
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error)
    
    // If we have cached stars, use them
    const cachedStars = await getCachedStars(githubUrl)
    
    return {
      stars: cachedStars?.stars || 0,
      forks: 0,
      issues: 0,
      lastCommit: new Date().toISOString(),
      license: "Unknown",
    }
  }
}

async function fetchGitHubReadme(githubUrl: string): Promise<string> {
  try {
    const repoPath = extractRepoPath(githubUrl)

    // Try to fetch README.md first, then other variants
    const readmeFiles = ["README.md", "README.rst", "README.txt", "readme.md", "readme.rst", "readme.txt"]

    for (const filename of readmeFiles) {
      try {
        const response = await $fetch<{ content: string; encoding: string }>(
          buildGitHubApiUrl(repoPath, `/contents/${filename}`),
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "Vue-Plugins-Collection",
            },
          },
        )

        if (response.content && response.encoding === "base64") {
          let content = Buffer.from(response.content, "base64").toString("utf-8")

          // Fix relative URLs in the README to point to the correct GitHub URLs
          content = content.replace(
            /!\[([^\]]*)\]$$(?!https?:\/\/)([^)]+)$$/g,
            `![$$1](${buildRawGitHubUrl(repoPath, "main", "$2")})`,
          )

          content = content.replace(
            /\[([^\]]+)\]$$(?!https?:\/\/)([^)]+)\.md$$/g,
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

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  const plugin = pluginsData.find((p) => p.id === id)
  if (!plugin) {
    throw createError({
      statusCode: 404,
      statusMessage: "Plugin not found",
    })
  }

  // Fetch GitHub data and README in parallel
  const [githubData, readme] = await Promise.all([
    fetchGitHubData(plugin.githubUrl),
    fetchGitHubReadme(plugin.githubUrl),
  ])

  // Mock downloads data (in real app, fetch from npm API)
  const downloads = Math.floor(Math.random() * 1000000) + 10000

  const pluginWithStats: PluginWithStats = {
    ...plugin,
    ...githubData,
    downloads,
    readme,
  }

  return pluginWithStats
})
