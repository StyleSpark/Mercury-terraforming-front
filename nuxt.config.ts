import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ['vuetify/styles','~/assets/css/main.css',],

  devtools: {
    enabled: false
  },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    plugins: [
      tailwindcss(),
    ],
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css'
        }
      ],
      script: [
        {
          src: `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.PUBLIC_NAVER_MAP_CLIENT_ID}`,
          defer: true
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      naverMapClientId: process.env.PUBLIC_NAVER_MAP_CLIENT_ID
    }
  },

  compatibilityDate: '2025-04-01'
})
