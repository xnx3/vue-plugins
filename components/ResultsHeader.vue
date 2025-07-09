<template>
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-sm text-slate-600 dark:text-slate-300">
      {{ total }} plugin{{ total !== 1 ? 's' : '' }} found
    </h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  total: number
}

defineProps<Props>()
</script>
