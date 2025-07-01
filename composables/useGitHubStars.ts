import type { Ref } from 'vue'

interface GitHubStarsData {
  [githubUrl: string]: {
    stars: number
    error?: string
  }
}

interface UseGitHubStarsReturn {
  starsData: Ref<GitHubStarsData>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchStars: (githubUrls: string[]) => Promise<void>
  getStars: (githubUrl: string) => number | null
  isLoading: (githubUrl: string) => boolean
}

export const useGitHubStars = (): UseGitHubStarsReturn => {
  const starsData = ref<GitHubStarsData>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const requestedUrls = ref(new Set<string>())

  const fetchStars = async (githubUrls: string[]) => {
    // Filter out URLs we've already requested
    const newUrls = githubUrls.filter(url => !requestedUrls.value.has(url))
    if (newUrls.length === 0) return

    // Mark URLs as requested
    newUrls.forEach(url => requestedUrls.value.add(url))

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<GitHubStarsData>('/api/github/stars', {
        method: 'POST',
        body: { githubUrls: newUrls }
      })

      // Merge new data with existing data
      starsData.value = { ...starsData.value, ...response }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stars'
      error.value = errorMessage
      console.error('Failed to fetch GitHub stars:', errorMessage)
      
      // Set default values for failed requests
      newUrls.forEach(url => {
        starsData.value[url] = { stars: 0, error: errorMessage }
      })
    } finally {
      loading.value = false
    }
  }

  const getStars = (githubUrl: string): number | null => {
    const data = starsData.value[githubUrl]
    return data ? data.stars : null
  }

  const isLoading = (githubUrl: string): boolean => {
    return loading.value && requestedUrls.value.has(githubUrl) && !starsData.value[githubUrl]
  }

  return {
    starsData,
    loading,
    error,
    fetchStars,
    getStars,
    isLoading
  }
}
