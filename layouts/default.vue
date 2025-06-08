<template>
  <v-app>
    <!-- 상단 네비게이션 바 -->
    <v-app-bar class="py-1 px-5" app flat style="background-color: #ffb328">
      <div class="d-flex align-center">
        <v-toolbar-title class="font-weight-bold text-primary cursor-pointer mr-4" @click="goHome">
          <img src="/images/logo.png" alt="로고" height="32" width="50" class="mr-2" />
        </v-toolbar-title>

        <v-btn text @click="navigateTo('/')" :class="{ active: route.path === '/' }">홈</v-btn>
        <v-btn text @click="navigateTo('/properties')" :class="{ active: route.path === '/properties' }">매물 리스트</v-btn>
        <v-btn text @click="navigateTo('/agents')" :class="{ active: route.path === '/agents' }">중개인 리스트</v-btn>
        <!-- <v-btn text @click="navigateTo('/proxy-services')" :class="{ active: route.path === '/proxy-services' }">대리 서비스</v-btn> -->
        <v-btn text @click="navigateTo('/community')" :class="{ active: route.path === '/community' }">커뮤니티</v-btn>
      </div>

      <v-spacer />

      <!-- 우측 로그인/유저 정보 -->
      <div class="d-flex align-center">
        <!-- 로그인 버튼 -->
        <v-btn
          v-if="!auth.isLoggedIn"
          class="pe-2 me-2"
          prepend-icon="mdi-login"
          variant="flat"
          color="#2773FF"
        >
          <div class="text-none font-weight-regular">로그인</div>

          <v-dialog activator="parent" v-model="loginDialog" max-width="500">
            <template v-slot:default>
              <v-card rounded="lg">
                <v-card-title class="d-flex justify-space-between align-center">
                  <div class="text-h5 text-medium-emphasis ps-2">로그인</div>
                  <v-btn icon="mdi-close" variant="text" @click="loginDialog = false" />
                </v-card-title>

                <v-divider class="mb-4" />
                <v-card-text>
                  <v-form ref="formRef" v-model="valid">
                    <v-text-field v-model="email" label="이메일" :rules="[required]" variant="outlined" class="mb-2" density="compact" />
                    <v-text-field v-model="password" label="비밀번호" type="password" :rules="[required]" variant="outlined" density="compact" />
                    <v-btn size="large" class="w-100 mt-2" variant="outlined" @click="handleLogin">로그인</v-btn>
                  </v-form>

                  <v-divider class="my-3" />
                  <div class="w-100 text-center">
                    <v-btn size="large" class="w-100 mt-2" variant="outlined" @click="navigateTo('/signup')">회원가입</v-btn>
                    <GoogleLoginButton @success="onLoginSuccess" />
                    <NaverLoginButton />
                  </div>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-btn>

        <!-- 유저 프로필 메뉴 -->
        <v-menu v-if="auth.isLoggedIn" offset-y transition="scale-transition">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="d-flex align-center" style="text-transform: none;">
              <v-avatar size="32" class="me-2" color="secondary">
                <template v-if="auth.user?.profile">
                  <img :src="auth.user.profile" alt="프로필" />
                </template>
                <template v-else>
                  <v-icon icon="mdi-account-circle" />
                </template>
              </v-avatar>
              <span>{{ auth.user?.nickname || auth.user?.name || '사용자' }}</span>
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="navigateTo('/mypage')">
              <v-list-item-title>마이페이지</v-list-item-title>
            </v-list-item>
            <v-list-item @click="navigateTo('/mypage/properties')">
              <v-list-item-title>매물 관리</v-list-item-title>
            </v-list-item>
            <v-list-item @click="navigateTo('/mypage/inquiries')">
              <v-list-item-title>문의</v-list-item-title>
            </v-list-item>
            <v-list-item @click="navigateTo('/mypage/purchase-history')">
              <v-list-item-title>구매내용</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>로그아웃</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- 추가 메뉴 버튼들 -->
        <v-btn v-if="auth.isLoggedIn" class="me-2 text-none" color="#2773FF" prepend-icon="mdi-credit-card-outline" variant="flat" @click="navigateTo('/purchase')">
          등록권 구매
        </v-btn>
        <v-btn v-if="auth.isLoggedIn" class="me-2 text-none" color="#2773FF" prepend-icon="mdi-home-plus" variant="flat" @click="navigateTo('/register')">
          매물 등록
        </v-btn>
      </div>
    </v-app-bar>

    <!-- 페이지 본문 -->
    <v-main class="mt-2">
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
import { useLoginDialogStore } from '@/stores/loginDialog'
const loginDialogStore = useLoginDialogStore()

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const valid = ref(false)
const formRef = ref()

const required = (v) => !!v || '필수 입력값입니다.'

const loginDialog = computed({
  get: () => loginDialogStore.isOpen,
  set: (val) => val ? loginDialogStore.open() : loginDialogStore.close()
})

const navigateTo = (path) => {
  loginDialog.value = false
  router.push(path)
}

const goHome = () => {
  loginDialog.value = false
  router.push('/')
}

const onLoginSuccess = () => {
  loginDialog.value = false
}

const handleLogin = async () => {
  if (!valid.value) return

  const response = await useApi("/auth/login", {
    method: "POST",
    body: {
      email: email.value,
      password: password.value
    }
  })

  if (response?.accessToken) {
    localStorage.setItem("access_token", response.accessToken)
    auth.setToken(response.accessToken)
    loginDialog.value = false
    
    const res = await useApi("/auth/my-page"); // 유저 정보
    auth.setUser(res.data)
    

  } else {
    alert("로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.")
  }
}

const logout = () => {
  auth.logout()
  localStorage.removeItem("access_token")
  router.push('/')
}

watch(() => loginDialogStore.isOpen, (open) => {
  if (open) {
    email.value = ''
    password.value = ''
    valid.value = false
    formRef.value?.resetValidation?.()
  }
})
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
