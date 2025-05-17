import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ['vuetify/styles','~/assets/css/main.css',],
  ssr: false,
  devtools: {
    enabled: false
  },
 modules: ['@pinia/nuxt'],
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
        src: 'https://accounts.google.com/gsi/client',
        async: true,
        defer: true,
        },
        {
          src: `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.PUBLIC_NAVER_MAP_CLIENT_ID}`,
          defer: true
        },
        {
          src: 'https://js.tosspayments.com/v2/standard',
          defer: true
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      kakaoMapKey: process.env.KAKAO_MAP_KEY,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      naverClientId: process.env.NAVER_CLIENT_ID
    }
  },

  compatibilityDate: '2025-04-01'
})
