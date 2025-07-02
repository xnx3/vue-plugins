export interface NPMDownloadStats {
  downloads: number
  period: string
}

export interface NPMDownloadResponse {
  downloads: number
  start: string
  end: string
  package: string
}

/**
 * Fetches NPM download statistics for a package
 * @param packageName - The NPM package name
 * @param period - The period to fetch (default: last-month)
 * @returns Promise<NPMDownloadStats>
 */
export async function fetchNPMDownloads(
  packageName: string,
  period: string = 'last-month'
): Promise<NPMDownloadStats> {
  try {
    const url = `https://api.npmjs.org/downloads/point/${period}/${packageName}`
    
    const response = await $fetch<NPMDownloadResponse>(url, {
      timeout: 10000, // 10 second timeout
    })

    return {
      downloads: response.downloads || 0,
      period: period
    }
  } catch (error) {
    console.error(`Failed to fetch NPM downloads for ${packageName}:`, error)
    
    // Return fallback data
    return {
      downloads: 0,
      period: period
    }
  }
}

/**
 * Extracts package name from NPM URL
 * @param npmUrl - The NPM URL
 * @returns string - The package name
 */
export function extractPackageNameFromUrl(npmUrl: string): string {
  const match = npmUrl.match(/\/package\/(.+)$/)
  return match ? match[1] : ''
}
