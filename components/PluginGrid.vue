<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PluginCard
        v-for="plugin in plugins"
        :key="plugin.id"
        :plugin="plugin"
      />
    </div>
    
    <!-- Pagination -->
    <div v-if="showPagination" class="mt-12">
      <AppPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        :limit="limit"
        @update:page="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VuePluginWithStars } from '~/types'

interface Props {
  plugins: VuePluginWithStars[]
  currentPage?: number
  totalPages?: number
  total?: number
  limit?: number
  showPagination?: boolean
}

withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
  total: 0,
  limit: 12,
  showPagination: true
})

defineEmits<{
  'update:page': [page: number]
}>()
</script>
