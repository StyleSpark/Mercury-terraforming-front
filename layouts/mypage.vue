<!-- layouts/mypage.vue -->
<template>
  <v-container fluid class="mt-4">
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-list nav dense>
            <v-list-item
              v-for="item in menu"
              :key="item.path"
              :to="item.path"
              :class="{ 'bg-blue-lighten-4': route.path === item.path }"
              link
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <slot /> <!-- 여기서 /mypage/*.vue 들이 렌더링됨 -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute()

const menu = [
  { label: '내 정보', path: '/mypage' },
  { label: '매물 관리', path: '/mypage/properties' },
  { label: '대리 서비스 이용', path: '/mypage/proxy' },
  { label: '회원 탈퇴', path: '/mypage/withdraw' },
]
</script>

<style scoped>
.bg-blue-lighten-4 {
  background-color: #e3f2fd !important;
}
</style>
