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

        <v-btn text @click="navigateTo('/')" :class="{ active: route.path === '/' }">홈</v-btn>
        <v-btn text @click="navigateTo('/properties')" :class="{ active: route.path === '/properties' }">매물 리스트</v-btn>
        <v-btn text @click="navigateTo('/agents')" :class="{ active: route.path === '/agents' }">중개인 리스트</v-btn>
        <v-btn text @click="navigateTo('/proxy-services')" :class="{ active: route.path === '/proxy-services' }">대리 서비스</v-btn>
        <v-btn text @click="navigateTo('/inquiry')" :class="{ active: route.path === '/inquiry' }">문의사항</v-btn>
        <v-btn text @click="navigateTo('/community')" :class="{ active: route.path === '/community' }">커뮤니티</v-btn>
      </div>

      <v-spacer />

      <!-- 오른쪽 버튼들 -->
      <div class="d-flex align-center">
        <v-btn
          class="pe-2 me-2"
          prepend-icon="mdi-login"
          variant="flat"
          color="#2773FF"
        >
          <div class="text-none font-weight-regular">로그인</div>

          <v-dialog activator="parent" max-width="500">
            <template v-slot:default="{ isActive }">
              <v-card rounded="lg">
                <v-card-title class="d-flex justify-space-between align-center">
                  <div class="text-h5 text-medium-emphasis ps-2">로그인</div>
                  <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" />
                </v-card-title>

                <v-divider class="mb-4" />

                <v-card-text>
                  <v-form ref="formRef" v-model="valid">
                    <v-text-field
                      v-model="email"
                      label="이메일"
                      :rules="[required]"
                      variant="outlined"
                      class="mb-2"
                      density="compact"
                    />
                    <v-text-field
                      v-model="password"
                      label="비밀번호"
                      type="password"
                      :rules="[required]"
                      variant="outlined"
                      density="compact"
                    />
                    <v-btn size="large" class="w-100 mt-2" variant="outlined">로그인</v-btn>
                  </v-form>
                  <v-divider class="my-3" />
                  <div class="w-100 text-center">
                    <v-btn size="large" class="w-100 mt-2" variant="outlined" @click="navigateTo('/signup')">회원가입</v-btn>
                    <v-btn size="large" class="w-100 mt-2" variant="outlined" @click="socialLogin()">소셜 로그인</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-btn>

        <v-btn class="me-2 text-none" color="#2773FF" prepend-icon="mdi-credit-card-outline" variant="flat" @click="navigateTo('/purchase')">
          등록권 구매
        </v-btn>
        <v-btn class="me-2 text-none" color="#2773FF" prepend-icon="mdi-home-plus" variant="flat" @click="navigateTo('/register')">
          매물 등록
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="mt-2">
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const valid = ref(false)
const formRef = ref()

const required = (v) => !!v || '필수 입력값입니다.'

const navigateTo = (path) => {
  router.push(path)
}

const goHome = () => {
  router.push('/')
}

const socialLogin = () => {
  // 소셜 로그인 로직
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.menu-btn {
  border-radius: 0 !important;
}

.active {
  border-radius: 0 !important;
  border-bottom: 2px solid white;
  font-weight: bold;
}
</style>
