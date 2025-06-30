export interface VuePlugin {
  id: string
  name: string
  description: string
  category: string
  packageName: string
  githubUrl: string
  npmUrl?: string
  documentationUrl?: string
  author: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface PluginWithStats extends VuePlugin {
  stars: number
  downloads: number
  lastCommit: string
  license: string
  readme?: string
  issues: number
  forks: number
}

export interface FilterOptions {
  search: string
  category: string
  sort: "name-asc" | "name-desc" | "stars-desc" | "updated-desc"
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GitHubRepo {
  name: string
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  license: {
    name: string
  } | null
  pushed_at: string
  html_url: string
}
