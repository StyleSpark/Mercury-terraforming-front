<!-- mypage/proxy.vue - 대리 서비스 이용 내역 -->
<template>
  <MypageLayoutWrapper>
    <v-card class="pa-4">
      <v-card-title class="text-h6">대리 서비스 이용 내역</v-card-title>
      <v-divider class="mb-2" />
      <div v-if="services.length">
        <v-list>
          <v-list-item v-for="s in services" :key="s.id">
            <v-list-item-title>{{ s.title }}</v-list-item-title>
            <v-list-item-subtitle>
              상태: {{ s.status }} / 신청일: {{ new Date(s.createdAt).toLocaleDateString() }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
      <div v-else class="text-grey">이용 내역이 없습니다.</div>
    </v-card>
  </MypageLayoutWrapper>
</template>

<script setup>
import MypageLayoutWrapper from '@/components/MypageLayoutWrapper.vue'
const services = ref([])

onMounted(async () => {
  services.value = await useApi('/my/proxy-services')
})
</script>

<style scoped>
.text-grey {
  color: #999;
}
</style>