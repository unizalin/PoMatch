// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-02-28',
  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: false // We will handle custom redirection logic for landing/admin/profile
  },

  // Fix: Prevent SSR conflict where /confirm or /register match [id].vue dynamic route.
  // These pages handle OAuth callbacks and registration — they must render client-side only.
  routeRules: {
    '/confirm': { ssr: false },
    '/register': { ssr: false },
    '/login': { ssr: false },
    '/admin/**': { ssr: false }
  },

  app: {
    head: {
      title: 'PoMatch - 專屬你的數位名片',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '建立美觀、專業的數位名片 (Prototype)，整合所有連結與社交媒體。' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap' }
      ]
    }
  },

  vite: {
    define: {
      'process.env.DEBUG': 'false',
    },
  },
})
