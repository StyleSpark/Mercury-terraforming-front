<script setup>
const runtimeConfig = useRuntimeConfig();
const clientId = runtimeConfig.public.googleClientId;
const authStore = useAuthStore();

const loginCallback = async (response) => {
  const token = response.credential;

  try {
    const result = await useApi("/auth/social-login", {
      method: "POST",
      body: {
        provider: "google",
        token,
      },
    });

    debugger;
    localStorage.setItem("access_token", result.accessToken);
    authStore.setToken(result.accessToken);
    authStore.setUser(result.user);
    alert("로그인 성공");
  } catch (err) {
    console.error("로그인 실패:", err);
    alert("로그인 실패");
  }
};

onMounted(() => {
  console.log(clientId)
  const target = document.getElementById("google-login-btn");
  if (window.google && clientId && target) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: loginCallback,
    });

    window.google.accounts.id.renderButton(target, {
      theme: "outline",
      size: "large",
      width: 500,
    });
  }
});
</script>

<template>
  <div id="google-login-btn" class="w-100" />
</template>
