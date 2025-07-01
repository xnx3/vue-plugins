// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "@vueuse/nuxt", "@nuxt/icon", '@nuxt/eslint', 'reka-ui/nuxt'],
  css: ["~/assets/css/main.css"],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN || "",
  },
})

