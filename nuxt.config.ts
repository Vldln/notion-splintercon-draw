// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
  },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    public: {
      domain: process.env.DOMAIN || 'http://localhost:3000',
    }
  }

})