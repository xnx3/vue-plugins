<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <VueLogo class="h-8 w-8" />
          <div>
            <h1 class="text-xl font-bold text-[#2c3e50]">Vue Plugins</h1>
          </div>
        </NuxtLink>
        
        <nav class="hidden md:flex items-center space-x-6">
          <a href="https://vuejs.org" target="_blank" class="text-slate-600 hover:text-[#4fc08d] font-medium transition-colors">
            Vue.js
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>
