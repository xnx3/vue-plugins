<template>
  <div class="card p-6 hover:scale-[1.02] cursor-pointer" @click="navigateToPlugin">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ plugin.name }}</h3>
        <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ plugin.description }}</p>
      </div>
    </div>
    
    <div class="flex items-center justify-between mb-4">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " :class="plugin.type === 'official' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-700'">
        {{ plugin.type }}
      </span>
    </div>
    
    <div class="flex flex-wrap gap-1 mb-4">
      <span 
        v-for="tag in plugin.tags.slice(0, 3)" 
        :key="tag"
        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
      >
        {{ tag }}
      </span>
      <span v-if="plugin.tags.length > 3" class="text-xs text-gray-500">
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
