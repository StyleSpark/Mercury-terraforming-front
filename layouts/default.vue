<template>
  <v-app>
    <v-app-bar class="py-1 px-5" app flat style="background-color: #ffb328">
      <!-- 왼쪽: 로고 + 메인 메뉴 -->
      <div class="d-flex align-center">
        <v-toolbar-title
          class="font-weight-bold text-primary cursor-pointer mr-4"
          @click="goHome"
        >
          <img
            src="/images/logo.png"
            alt="로고"
            height="32"
            width="50"
            class="mr-2"
          />
        </v-toolbar-title>

        <v-btn text @click="navigateTo('/')">홈</v-btn>
        <v-btn text @click="navigateTo('/properties')">매물 리스트</v-btn>
        <v-btn text @click="navigateTo('/agents')">중개인 리스트</v-btn>
        <v-btn text @click="navigateTo('/proxy-services')">대리 서비스</v-btn>
        <v-btn text @click="navigateTo('/inquiry')">게시판</v-btn>
      </div>

      <v-spacer />

      <!-- 오른쪽 버튼들 -->
      <div class="d-flex align-center">
        <v-btn  class="me-2 text-none" color="#2773FF" prepend-icon="mdi-export-variant" variant="flat" text @click="navigateTo('/login')">로그인</v-btn>
        <v-btn  class="me-2 text-none" color="#2773FF" prepend-icon="mdi-export-variant" variant="flat" text @click="navigateTo('/purchase')">등록권 구매</v-btn
        >
      </div>
    </v-app-bar>

    <v-main class="mt-2">
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
