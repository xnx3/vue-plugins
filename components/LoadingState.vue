<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="i in skeletonCount" :key="i" class="card p-6 animate-pulse">
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"/>
      <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"/>
      <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"/>
      <div class="flex space-x-2 mb-4">
        <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"/>
        <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"/>
      </div>
      <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"/>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  skeletonCount?: number
}

withDefaults(defineProps<Props>(), {
  skeletonCount: 6
})
</script>
