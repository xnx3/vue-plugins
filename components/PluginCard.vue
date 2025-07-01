<template>
  <div class="card p-6 hover:scale-[1.02] cursor-pointer hover:border-[#4fc08d]/30 transition-all" @click="navigateToPlugin">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-[#2c3e50] mb-2">{{ plugin.name }}</h3>
        <p class="text-slate-600 text-sm line-clamp-2 mb-3">{{ plugin.description }}</p>
      </div>
    </div>
    
    <div class="flex items-center justify-between mb-4">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " :class="plugin.type === 'official' ? 'bg-[#4fc08d]/10 text-[#4fc08d] border border-[#4fc08d]/20' : 'bg-amber-50 text-amber-700 border border-amber-200'">
        {{ plugin.type }}
      </span>
    </div>
    
    <div class="flex flex-wrap gap-1 mb-4">
      <span 
        v-for="tag in plugin.tags.slice(0, 3)" 
        :key="tag"
        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
      >
        {{ tag }}
      </span>
      <span v-if="plugin.tags.length > 3" class="text-xs text-slate-500">
        +{{ plugin.tags.length - 3 }} more
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VuePlugin } from '~/types'
import { navigateTo } from '#app'
interface Props {
  plugin: VuePlugin
}

const props = defineProps<Props>()

const navigateToPlugin = () => {
  navigateTo(`/plugins/${props.plugin.id}`)
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
