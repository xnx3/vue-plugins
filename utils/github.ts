export function extractRepoPath(githubUrl: string): string {
  // Handle various GitHub URL formats
  const patterns = [/github\.com\/([^/]+\/[^/]+)/, /github\.com\/([^/]+\/[^/]+)\.git/, /github\.com\/([^/]+\/[^/]+)\/$/]

  for (const pattern of patterns) {
    const match = githubUrl.match(pattern)
    if (match) {
      return match[1].replace(".git", "")
    }
  }

  throw new Error(`Invalid GitHub URL: ${githubUrl}`)
}

export function buildGitHubApiUrl(repoPath: string, endpoint: string): string {
  return `https://api.github.com/repos/${repoPath}${endpoint}`
}

export function buildRawGitHubUrl(repoPath: string, branch = "main", filePath: string): string {
  return `https://raw.githubusercontent.com/${repoPath}/${branch}/${filePath}`
}
