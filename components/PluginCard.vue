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
      
      <!-- GitHub Stars -->
      <div class="flex items-center text-sm text-slate-600 dark:text-slate-300">
        <Icon name="lucide:star" class="h-4 w-4 mr-1 text-yellow-500" />
        <span v-if="props.isStarsLoading" class="inline-flex items-center">
          <div class="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
        </span>
        <span v-else-if="stars !== null" class="font-medium">
          {{ formatStars(stars) }}
        </span>
        <span v-else class="text-slate-400 dark:text-slate-500">--</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VuePlugin } from '~/types'
import { navigateTo } from '#app'

interface Props {
  plugin: VuePlugin
  starsData?: { stars: number; error?: string } | null
  isStarsLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  starsData: null,
  isStarsLoading: false
})

const navigateToPlugin = () => {
  navigateTo(`/plugins/${props.plugin.id}`)
}

const stars = computed(() => {
  return props.starsData?.stars ?? null
})

const formatStars = (count: number): string => {
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
