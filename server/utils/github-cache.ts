interface CacheEntry {
  stars: number
  timestamp: number
  error?: string
}

// Cache TTL (1 hour = 3600000ms)
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

export async function getCachedStars(githubUrl: string): Promise<CacheEntry | null> {
  const storage = useStorage('github-stars')
  const cacheKey = `stars:${Buffer.from(githubUrl).toString('base64')}`
  
  try {
    const entry = await storage.getItem<CacheEntry>(cacheKey)
    if (!entry) return null
    
    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      await storage.removeItem(cacheKey)
      return null
    }
    
    return entry
  } catch (error) {
    console.error('Error reading from cache:', error)
    return null
  }
}

export async function setCachedStars(githubUrl: string, stars: number, error?: string): Promise<void> {
  const storage = useStorage('github-stars')
  const cacheKey = `stars:${Buffer.from(githubUrl).toString('base64')}`
  
  try {
    await storage.setItem(cacheKey, {
      stars,
      timestamp: Date.now(),
      error
    })
  } catch (error) {
    console.error('Error writing to cache:', error)
  }
}
