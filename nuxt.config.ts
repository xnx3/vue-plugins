// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "@vueuse/nuxt", "@nuxt/icon", '@nuxt/eslint', 'reka-ui/nuxt'],
  experimental: {
    viewTransition: true,
  },
  css: ["~/assets/css/main.css"],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN || "",
    public: {
      // Public runtime config for client-side access on local environment only
      githubToken: process.env.NODE_ENV === 'development' ? process.env.GITHUB_TOKEN : "",
    }
  },
  hooks: {
    'nitro:config': async (nitroConfig) => {
      // Import plugins data to generate routes
      const pluginsData = await import('./public/plugins.json').then(m => m.default)
      
      // Generate routes for all plugin detail pages
      const pluginRoutes = pluginsData.map((plugin: { id: string }) => `/plugins/${plugin.id}`)
      
      if (!nitroConfig.prerender) {
        nitroConfig.prerender = {}
      }
      
      nitroConfig.prerender.routes = [
        '/',
        ...pluginRoutes
      ]
    }
  }
})

