import { defineEventHandler } from "h3"
import { pluginsData } from "~/server/data/plugins"

export default defineEventHandler(async () => {
  // Extract unique types from plugins data
  const types = [...new Set(pluginsData.map(plugin => plugin.type))].sort()
  return types
})
