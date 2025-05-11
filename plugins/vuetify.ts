import { createVuetify } from 'vuetify'
import { ko } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'ko',        // 기본 언어를 한글로 설정
      messages: { ko },    // 한글 메시지 로딩
    },
    components,
    directives,
  })
  nuxtApp.vueApp.use(vuetify)
})
