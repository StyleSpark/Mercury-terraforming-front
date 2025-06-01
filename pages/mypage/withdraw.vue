<template>
  <MypageLayoutWrapper>
    <v-card class="pa-4">
      <v-card-title class="text-h6 text-red">회원 탈퇴</v-card-title>
      <v-divider class="mb-4" />
      <p class="text-body-2 mb-4">정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
      <v-btn color="error" variant="flat" @click="withdrawUser">회원 탈퇴하기</v-btn>
    </v-card>
  </MypageLayoutWrapper>
</template>

<script setup>
import MypageLayoutWrapper from '@/components/MypageLayoutWrapper.vue'
import { useApi } from '@/composables/useApi'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const withdrawUser = async () => {
  const confirmDelete = confirm('정말로 탈퇴하시겠습니까?')
  if (!confirmDelete) return
  const res = await useApi('/my/withdraw', { method: 'DELETE' })
  if (res?.success) {
    alert('회원 탈퇴가 완료되었습니다.')
    auth.logout()
    router.push('/')
  }
}
</script>

