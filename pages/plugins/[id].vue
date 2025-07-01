<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="pending" class="animate-pulse">
      <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"/>
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-8"/>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2">
          <div class="h-64 bg-slate-200 dark:bg-slate-700 rounded"/>
        </div>
        <div>
          <div class="h-32 bg-slate-200 dark:bg-slate-700 rounded"/>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="lucide:alert-circle" class="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-[#2c3e50] dark:text-slate-100 mb-2">Plugin not found</h3>
      <p class="text-slate-600 dark:text-slate-300 mb-4">{{ error.message }}</p>
      <NuxtLink to="/" class="btn-primary">
        Back to Plugins
      </NuxtLink>
    </div>
    
    <!-- Plugin Details -->
    <div v-else-if="plugin">
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <NuxtLink to="/" class="text-slate-500 dark:text-slate-400 hover:text-[#4fc08d] transition-colors">
                Plugins
              </NuxtLink>
            </li>
            <li>
              <Icon name="lucide:chevron-right" class="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </li>
            <li>
              <span class="text-[#2c3e50] dark:text-slate-100 font-semibold">{{ plugin.name }}</span>
            </li>
          </ol>
        </nav>
        
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-[#2c3e50] dark:text-slate-100 mb-3">{{ plugin.name }}</h1>
            <p class="text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{{ plugin.description }}</p>
            
            <div class="flex flex-wrap items-center gap-4 mb-6">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#4fc08d]/10 text-[#4fc08d] border border-[#4fc08d]/20">
                {{ plugin.category }}
              </span>
              <div class="flex items-center text-slate-600 dark:text-slate-300">
                <Icon name="lucide:user" class="h-4 w-4 mr-1" />
                {{ plugin.author }}
              </div>
              <div class="flex items-center text-slate-600 dark:text-slate-300">
                <Icon name="lucide:calendar" class="h-4 w-4 mr-1" />
                Updated {{ formatDate(plugin.lastCommit) }}
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span 
                v-for="tag in plugin.tags" 
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="card p-4 text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon name="lucide:star" class="h-5 w-5 text-yellow-500" />
              </div>
              <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.stars) }}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Stars</div>
            </div>
            <div class="card p-4 text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon name="lucide:download" class="h-5 w-5 text-blue-500" />
              </div>
              <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.downloads) }}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Downloads</div>
            </div>
            <div class="card p-4 text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon name="lucide:git-fork" class="h-5 w-5 text-[#4fc08d]" />
              </div>
              <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.forks) }}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Forks</div>
            </div>
            <div class="card p-4 text-center">
              <div class="flex items-center justify-center mb-2">
                <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-500" />
              </div>
              <div class="text-2xl font-bold text-[#2c3e50] dark:text-slate-100">{{ formatNumber(plugin.issues) }}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Issues</div>
            </div>
          </div>
          
          <div class="card p-6">
            <h2 class="text-xl font-semibold text-[#2c3e50] dark:text-slate-100 mb-4">Documentation</h2>
            <div class="prose max-w-none dark:prose-invert">
              <vue-markdown :source="plugin.readme" :options="{ html: true }" />
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PluginWithStats } from '~/types'
import VueMarkdown from 'vue-markdown-render'

const route = useRoute()
const pluginId = route.params.id as string

// Fetch plugin data
const { data: plugin, pending, error } = await useFetch<PluginWithStats>(`/api/plugins/${pluginId}`)

// SEO
useHead(() => ({
  title: plugin.value ? `${plugin.value.name} - Vue.js Plugin` : 'Plugin Not Found',
  meta: [
    {
      name: 'description',
      content: plugin.value?.description || 'Vue.js plugin details'
    }
  ]
}))

// Utility functions
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

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
      // You could add a toast notification here
    }
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>
