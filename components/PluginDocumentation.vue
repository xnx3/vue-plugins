<template>
  <div class="card p-6">
    <h2 class="text-xl font-semibold text-[#2c3e50] dark:text-slate-100 mb-4">Documentation</h2>
    <div class="prose max-w-none dark:prose-invert">
      <ClientOnly>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="overflow-auto" v-html="renderedMarkdown"/>
        <template #fallback>
          <div class="animate-pulse">
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-2" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  renderedMarkdown: string
}

defineProps<Props>()
</script>
