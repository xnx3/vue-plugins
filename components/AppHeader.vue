<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50 dark:bg-slate-900 dark:border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <VueLogo class="h-8 w-8" />
          <div>
            <h1 class="text-xl font-bold text-[#2c3e50] dark:text-slate-200">Vue Plugins</h1>
          </div>
        </NuxtLink>
        
        <nav class="flex items-center space-x-6">
          <button 
            class="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-[#4fc08d] hover:bg-[#42b883] rounded-lg transition-colors"
            @click="showSubmitModal = true"
          >
            <Icon name="lucide:plus" class="h-4 w-4" />
            <span>Submit Plugin</span>
          </button>
          <button 
            class="sm:hidden p-2 rounded-lg bg-[#4fc08d] hover:bg-[#42b883] transition-colors"
            title="Submit Plugin"
            @click="showSubmitModal = true"
          >
            <Icon name="lucide:plus" class="h-5 w-5 text-white" />
          </button>
          <a href="https://vuejs.org" target="_blank" class="hidden md:flex items-center space-x-1 text-slate-600 hover:text-[#4fc08d] font-medium transition-colors dark:text-slate-300 dark:hover:text-[#4fc08d]">
            <span>Vue.js</span>
            <Icon name="lucide:external-link" class="h-4 w-4" />
          </a>
          <button 
            class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            :title="colorMode.preference === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleColorMode"
          >
            <Icon 
              :name="colorMode.preference === 'dark' ? 'lucide:sun' : 'lucide:moon'" 
              class="h-5 w-5 text-slate-600 dark:text-slate-300 align-sub" 
            />
          </button>
        </nav>
      </div>
    </div>
  </header>

  <!-- Submit Plugin Modal -->
  <div 
    v-if="showSubmitModal"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="showSubmitModal = false"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="showSubmitModal = false" />
      
      <div class="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#4fc08d] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
              <Icon name="lucide:plus" class="h-6 w-6 text-[#4fc08d]" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100">
                Submit Your Vue.js Plugin
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-slate-400">
                  Want to add your Vue.js plugin to our collection? We'd love to include it! Follow these steps to submit your plugin:
                </p>
              </div>
            </div>
          </div>
        </div>
        
          <div class="px-4 pb-4 sm:px-6 sm:pb-6">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-6 w-6 rounded-full bg-[#4fc08d] text-white text-sm font-bold">1</div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-slate-100">Fork the Repository</p>
                  <p class="text-sm text-gray-500 dark:text-slate-400">Fork the <code class="bg-gray-100 dark:bg-slate-700 px-1 rounded">vue-plugins</code> repository on GitHub</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-6 w-6 rounded-full bg-[#4fc08d] text-white text-sm font-bold">2</div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-slate-100">Add Your Plugin</p>
                  <p class="text-sm text-gray-500 dark:text-slate-400 mb-2">Add your plugin information to <code class="bg-gray-100 dark:bg-slate-700 px-1 rounded">public/plugins.json</code></p>
                  <details class="text-xs">
                    <summary class="cursor-pointer text-[#4fc08d] hover:text-[#42b883] font-medium">Show example structure</summary>
                    <pre class="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded text-xs overflow-x-auto"><code>{
  "id": "my-awesome-plugin",
  "name": "My Awesome Plugin",
  "description": "Brief description of what your plugin does",
  "category": "Category Name",
  "packageName": "npm-package-name",
  "githubUrl": "https://github.com/username/repo",
  "npmUrl": "https://www.npmjs.com/package/package-name",
  "documentationUrl": "https://your-docs-url.com",
  "author": "Your Name",
  "tags": ["vue3", "typescript", "community"],
  "type": "community"
}</code></pre>
                  </details>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-6 w-6 rounded-full bg-[#4fc08d] text-white text-sm font-bold">3</div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-slate-100">Create Pull Request</p>
                  <p class="text-sm text-gray-500 dark:text-slate-400">Submit a PR with your plugin details and we'll review it</p>
                </div>
              </div>
              
              <div class="bg-blue-50 dark:bg-slate-700 rounded-lg p-4">
                <div class="flex">
                  <Icon name="lucide:info" class="h-5 w-5 text-blue-400 mt-0.5" />
                  <div class="ml-3">
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Requirements:</strong> Your plugin should be published on npm, have a GitHub repository, and include proper documentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        <div class="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <a
            href="https://github.com/monterail/vue-plugins"
            target="_blank"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#4fc08d] text-base font-medium text-white hover:bg-[#42b883] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4fc08d] sm:ml-3 sm:w-auto sm:text-sm transition-colors"
          >
            <Icon name="lucide:github" class="h-4 w-4 mr-2" />
            Open GitHub Repository
          </a>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            @click="showSubmitModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const showSubmitModal = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

// Close modal with Escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      showSubmitModal.value = false
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
