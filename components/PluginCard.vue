<template>
  <div class="card p-6 hover:scale-[1.02] cursor-pointer hover:border-[#4fc08d]/30 transition-all flex flex-col h-full" @click="navigateToPlugin">
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-[#2c3e50] dark:text-slate-100 mb-2">{{ plugin.name }}</h3>
      <p class="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-10">{{ plugin.description }}</p>
    </div>
    
    <div class="flex items-center justify-between mt-auto">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " :class="plugin.type === 'official' ? 'bg-[#4fc08d]/10 text-[#4fc08d] border border-[#4fc08d]/20' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700'">
        {{ plugin.type }}
      </span>
      
      <!-- Stats -->
      <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <!-- GitHub Stars -->
        <div class="flex items-center">
          <Icon name="lucide:star" class="h-4 w-4 mr-1 text-yellow-500" />
          <span class="font-medium">
            {{ formatNumber(plugin.stars) }}
          </span>
        </div>
        
        <!-- NPM Downloads -->
        <div class="flex items-center">
          <Icon name="lucide:download" class="h-4 w-4 mr-1 text-blue-500" />
          <span class="font-medium">
            {{ formatNumber(plugin.downloads) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VuePluginWithStarsAndDownloads } from '~/types'
import { navigateTo } from '#app'

interface Props {
  plugin: VuePluginWithStarsAndDownloads
}

const props = defineProps<Props>()

const navigateToPlugin = () => {
  navigateTo(`/plugins/${props.plugin.id}`)
}

const formatNumber = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
