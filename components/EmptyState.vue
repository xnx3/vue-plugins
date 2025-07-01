<template>
  <div class="text-center py-12">
    <Icon name="lucide:search-x" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">{{ title }}</h3>
    <p class="text-gray-600 dark:text-slate-300">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'No plugins found',
  message: 'Try adjusting your search criteria'
})
</script>
