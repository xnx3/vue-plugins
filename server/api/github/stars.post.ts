import { defineEventHandler, readBody, createError } from "h3"
import { $fetch } from "ofetch"
import { extractRepoPath, buildGitHubApiUrl } from "~/utils/github"
import { getCachedStars, setCachedStars } from "~/server/utils/github-cache"

interface GitHubStarsRequest {
  githubUrls: string[]
}

interface GitHubStarsResponse {
  [githubUrl: string]: {
    stars: number
    error?: string
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<GitHubStarsRequest>(event)
  
  if (!body.githubUrls || !Array.isArray(body.githubUrls)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body. Expected githubUrls array."
    })
  }

  const config = useRuntimeConfig()
  const results: GitHubStarsResponse = {}
  const urlsToFetch: string[] = []

  // Check cache first
  for (const githubUrl of body.githubUrls) {
    const cached = await getCachedStars(githubUrl)
    if (cached) {
      results[githubUrl] = {
        stars: cached.stars,
        ...(cached.error && { error: cached.error })
      }
    } else {
      urlsToFetch.push(githubUrl)
    }
  }

  // If all results are cached, return early
  if (urlsToFetch.length === 0) {
    return results
  }

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
        results[githubUrl] = { stars }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch stars"
        console.error(`Failed to fetch stars for ${githubUrl}:`, errorMessage)
        await setCachedStars(githubUrl, 0, errorMessage)
        results[githubUrl] = {
          stars: 0,
          error: errorMessage
        }
      }
    })

    await Promise.all(promises)
    
    // Small delay between batches to be respectful to GitHub API
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return results
})
