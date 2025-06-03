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
const isActive = (itemPath) => {
  if (route.path === itemPath) return true

  if (itemPath === '/mypage') return false

  return route.path.startsWith(itemPath + '/')
}
const route = useRoute()
const menu = [
  { label: '내 정보', path: '/mypage' },
  { label: '매물 관리', path: '/mypage/properties' },
  { label: '문의 내역', path: '/mypage/inquiries' },
  { label: '회원 탈퇴', path: '/mypage/withdraw' },
]
</script>

<style scoped>
.bg-blue-lighten-4 {
  background-color: #e3f2fd !important;
}
</style>
