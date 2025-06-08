<script setup>
const config = useRuntimeConfig();
useHead({
  script: [
    {
      src: `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${config.public.kakaoMapKey}&libraries=services,clusterer`,
    },
  ],
});
</script>

<template>
  <v-app>
    <NuxtLayout />
  </v-app>
</template>
