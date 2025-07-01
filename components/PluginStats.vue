<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="card p-4 text-center">
      <div class="flex items-center justify-center mb-2">
        <Icon name="lucide:star" class="h-5 w-5 text-yellow-500" />
      </div>
      <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.stars) }}</div>
      <div class="text-sm text-slate-600 dark:text-slate-400">Stars</div>
    </div>
    <div class="card p-4 text-center">
      <div class="flex items-center justify-center mb-2">
        <Icon name="lucide:download" class="h-5 w-5 text-blue-500" />
      </div>
      <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.downloads) }}</div>
      <div class="text-sm text-slate-600 dark:text-slate-400">Downloads</div>
    </div>
    <div class="card p-4 text-center">
      <div class="flex items-center justify-center mb-2">
        <Icon name="lucide:git-fork" class="h-5 w-5 text-[#4fc08d]" />
      </div>
      <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.forks) }}</div>
      <div class="text-sm text-slate-600 dark:text-slate-400">Forks</div>
    </div>
    <div class="card p-4 text-center">
      <div class="flex items-center justify-center mb-2">
        <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500" />
      </div>
      <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.issues) }}</div>
      <div class="text-sm text-slate-600 dark:text-slate-400">Issues</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PluginWithStats } from '~/types'

interface Props {
  plugin: PluginWithStats
}

defineProps<Props>()

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>
