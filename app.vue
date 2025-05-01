<script setup>
const config = useRuntimeConfig()
useHead({
  script: [
    {
      src: `//dapi.kakao.com/v2/maps/sdk.js?autoload=true&appkey=${config.public.kakaoMapKey}&libraries=services`,
    },
  ],
})
</script>

<template>
  <v-app>
    <NuxtLayout />
  </v-app>
</template>