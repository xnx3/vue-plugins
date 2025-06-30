import type { FilterOptions, PaginatedResponse, VuePlugin } from "~/types"
import { defineEventHandler, getQuery } from "h3"
import { pluginsData } from "~/server/data/plugins"

// Mock data - in a real app, this would come from a database


export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Partial<FilterOptions>

  const { search = "", category = "", sort = "name-asc", page = 1, limit = 12 } = query

  let filteredPlugins = [...pluginsData]

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredPlugins = filteredPlugins.filter(
      (plugin) =>
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.description.toLowerCase().includes(searchLower) ||
        plugin.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Apply category filter
  if (category) {
    filteredPlugins = filteredPlugins.filter((plugin) => plugin.category === category)
  }

  // Apply sorting
  filteredPlugins.sort((a, b) => {
    switch (sort) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "updated-desc":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return a.name.localeCompare(b.name)
    }
  })

  // Apply pagination
  const startIndex = (Number(page) - 1) * Number(limit)
  const endIndex = startIndex + Number(limit)
  const paginatedPlugins = filteredPlugins.slice(startIndex, endIndex)

  const response: PaginatedResponse<VuePlugin> = {
    data: paginatedPlugins,
    total: filteredPlugins.length,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(filteredPlugins.length / Number(limit)),
  }

  return response
})
