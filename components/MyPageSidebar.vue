<template>
  <v-card>
    <v-list nav dense>
      <v-list-item
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        :class="{ 'bg-blue-lighten-4': isActive(item.path) }"
        link
      >
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const route = useRoute()
const isActive = (itemPath) => {
  if (route.path === itemPath) return true
  if (itemPath === '/mypage') return false
  return route.path.startsWith(itemPath + '/')
}

// 전체 메뉴
const fullMenu = [
  { label: '내 정보', path: '/mypage' },
  { label: '매물 관리', path: '/mypage/properties' },
  { label: '문의', path: '/mypage/inquiries' },
  { label: '구매 내역', path: '/mypage/purchase-history' },
  { label: '중개인 신청', path: '/mypage/agent/register', hideIfAgent: true },
  { label: '회원 탈퇴', path: '/mypage/withdraw' },
]

// 사용자 role이 agent라면 해당 메뉴 제거
const menu = computed(() => {
  return fullMenu.filter(item => {
    if (item.hideIfAgent && auth.user?.role === 'AGENT') return false
    return true
  })
})
</script>


<style scoped>
.bg-blue-lighten-4 {
  background-color: #e3f2fd !important;
}
</style>
