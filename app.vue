<script setup>
const config = useRuntimeConfig();
const route = useRoute()
useHead({
  script: [
    {
      src: `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${config.public.kakaoMapKey}&libraries=services,clusterer`,
    },
  ],
});
watch(
  () => route.query.session,
  (session) => {
    if (!session) return

    if (session === 'expired') {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.')
    } else if (session === 'invalid') {
      alert('유효하지 않은 세션입니다.')
    }
    auth.logout()
    // 쿼리 제거: URL에서 ?session=... 제거
    const { fullPath, path } = route
    const newUrl = path // 쿼리 제거된 주소
    window.history.replaceState(null, '', newUrl)
  },
  { immediate: true }
)

</script>

<template>
  <v-app>
    <NuxtLayout />
  </v-app>
</template>
