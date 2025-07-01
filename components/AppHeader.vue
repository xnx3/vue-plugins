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
              class="h-5 w-5 text-slate-600 dark:text-slate-300" 
            />
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>
