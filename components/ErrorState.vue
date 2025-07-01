<template>
  <div class="text-center py-12">
    <Icon name="lucide:alert-circle" class="h-16 w-16 text-red-500 mx-auto mb-4" />
    <h3 class="text-lg font-semibold text-[#2c3e50] dark:text-slate-100 mb-2">{{ title }}</h3>
    <p class="text-slate-600 dark:text-slate-300 mb-4">{{ message }}</p>
    <button v-if="showRetry" class="btn-primary" @click="$emit('retry')">
      {{ retryText }}
    </button>
    <NuxtLink v-if="linkTo" :to="linkTo" class="btn-primary">
      {{ linkText }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  message: string
  showRetry?: boolean
  retryText?: string
  linkTo?: string
  linkText?: string
}

withDefaults(defineProps<Props>(), {
  showRetry: false,
  retryText: 'Try Again',
  linkTo: undefined,
  linkText: 'Go Back'
})

defineEmits<{
  retry: []
}>()
</script>
