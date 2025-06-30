import type { PluginWithStats, GitHubRepo } from "~/types"
import { $fetch } from "ofetch"
import { defineEventHandler, getRouterParam, createError } from "h3"
import { pluginsData } from "~/server/data/plugins"

async function fetchGitHubData(githubUrl: string): Promise<Partial<PluginWithStats>> {
  try {
    const repoPath = githubUrl.replace("https://github.com/", "")
    const response = await $fetch<GitHubRepo>(`https://api.github.com/repos/${repoPath}`)

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

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  const plugin = pluginsData.find((p) => p.id === id)
  if (!plugin) {
    throw createError({
      statusCode: 404,
      statusMessage: "Plugin not found",
    })
  }

  // Fetch GitHub data
  const githubData = await fetchGitHubData(plugin.githubUrl)

  // Mock downloads data (in real app, fetch from npm API)
  const downloads = Math.floor(Math.random() * 1000000) + 10000

  const pluginWithStats: PluginWithStats = {
    ...plugin,
    ...githubData,
    downloads,
  }

  return pluginWithStats
})
