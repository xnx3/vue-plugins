<template>
  <div class="flex items-center justify-between mb-6">
    <p class="text-sm text-slate-600 dark:text-slate-300">
      {{ total }} plugin{{ total !== 1 ? 's' : '' }} found
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  total: number
}

defineProps<Props>()
</script>
