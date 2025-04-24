// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },

  ssr: false,

  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",

  ui: {
    colorMode: false,
  },
});
