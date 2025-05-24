<script setup>
const config = useRuntimeConfig()
useHead({
  script: [
    {
      src: `//dapi.kakao.com/v2/maps/sdk.js?autoload=true&appkey=${config.public.kakaoMapKey}&autoload=false&libraries=services`,
    },
  ],
})
</script>

<template>
  <v-app >
    <NuxtLayout/>
  </v-app>
</template>