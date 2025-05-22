<script setup>
const runtimeConfig = useRuntimeConfig();
const clientId = runtimeConfig.public.naverClientId;
const redirectUri = "http://localhost:3000/oauth/naver/callback";
const state = crypto.randomUUID(); // CSRF 방지용

const redirectToNaver = () => {
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}`;
  window.location.href = url;
};
</script>
<template>
  <v-btn color="#03C75A" @click="redirectToNaver">네이버 로그인</v-btn>
</template>
