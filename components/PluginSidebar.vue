<template>
  <div class="space-y-6">
    <!-- Quick Actions -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-[#2c3e50] dark:text-slate-100 mb-4">Quick Actions</h3>
      <div class="space-y-3">
        <a 
          :href="plugin.githubUrl" 
          target="_blank"
          class="flex items-center justify-between w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-[#4fc08d] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div class="flex items-center">
            <Icon name="lucide:github" class="h-5 w-5 mr-3" />
            <span class="font-semibold dark:text-slate-200">View on GitHub</span>
          </div>
          <Icon name="lucide:external-link" class="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </a>
        
        <a 
          v-if="plugin.documentationUrl"
          :href="plugin.documentationUrl" 
          target="_blank"
          class="flex items-center justify-between w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-[#4fc08d] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div class="flex items-center">
            <Icon name="lucide:book-open" class="h-5 w-5 mr-3" />
            <span class="font-semibold dark:text-slate-200">Documentation</span>
          </div>
          <Icon name="lucide:external-link" class="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </a>
        
        <a 
          :href="`https://www.npmjs.com/package/${plugin.packageName}`" 
          target="_blank"
          class="flex items-center justify-between w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-[#4fc08d] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div class="flex items-center">
            <Icon name="lucide:package" class="h-5 w-5 mr-3" />
            <span class="font-semibold dark:text-slate-200">View on npm</span>
          </div>
          <Icon name="lucide:external-link" class="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </a>
      </div>
    </div>
    
    <!-- Installation -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-[#2c3e50] dark:text-slate-100 mb-4">Installation</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">npm</label>
          <div class="relative">
            <code class="block w-full p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-200 pr-10">
              npm install {{ plugin.packageName }}
            </code>
            <button 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-[#4fc08d]"
              @click="copyToClipboard(`npm install ${plugin.packageName}`)"
            >
              <Icon name="lucide:copy" class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-[#2c3e50] dark:text-slate-200 mb-2">yarn</label>
          <div class="relative">
            <code class="block w-full p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-200 pr-10">
              yarn add {{ plugin.packageName }}
            </code>
            <button 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-[#4fc08d]"
              @click="copyToClipboard(`yarn add ${plugin.packageName}`)"
            >
              <Icon name="lucide:copy" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Metadata -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-[#2c3e50] dark:text-slate-100 mb-4">Information</h3>
      <dl class="space-y-3">
        <div>
          <dt class="text-sm font-semibold text-slate-500 dark:text-slate-400">License</dt>
          <dd class="text-sm text-slate-800 dark:text-slate-200">{{ plugin.license }}</dd>
        </div>
        <div>
          <dt class="text-sm font-semibold text-slate-500 dark:text-slate-400">Package Name</dt>
          <dd class="text-sm text-slate-800 dark:text-slate-200 font-mono">{{ plugin.packageName }}</dd>
        </div>
        <div>
          <dt class="text-sm font-semibold text-slate-500 dark:text-slate-400">Last Commit</dt>
          <dd class="text-sm text-slate-800 dark:text-slate-200">{{ formatDate(plugin.lastCommit) }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PluginWithStats } from '~/types'

interface Props {
  plugin: PluginWithStats
}

defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const copyToClipboard = async (text: string) => {
  try {
    if (import.meta.client && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      showToast('Package command copied to clipboard!')
    }
  } catch (err) {
    console.error('Failed to copy text: ', err)
    showToast('Failed to copy to clipboard', 'error')
  }
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (!import.meta.client) return
  
  // Create toast element
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0 max-w-sm ${
    type === 'success' 
      ? 'bg-[#4fc08d] text-white border border-[#42b883]' 
      : 'bg-red-500 text-white border border-red-600'
  }`
  
  // Add icon and message
  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'success' 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
        }
      </svg>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `
  
  // Add to DOM
  document.body.appendChild(toast)
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  })
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}
</script>
