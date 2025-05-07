<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const route = useRoute()

onMounted(async () => {
  const { paymentKey, orderId, amount } = route.query

  try {
    const response = await useApi('/payments/confirm', {
      method: 'POST',
      body: {
        paymentKey,
        orderId,
        amount
      }
    })

    console.log('결제 성공 및 등록권 처리 결과:', response)
    // → 완료 페이지로 이동하거나 메시지 출력
  } catch (error) {
    console.error('결제 확인 실패:', error)
    // → 에러 메시지 띄우기 등
  }
})
</script>

<template>
  <v-container class="py-8">
    <h2 class="text-h5 font-weight-bold">결제가 완료되었습니다 🎉</h2>
    <p class="text-body-1 mt-4">등록권이 정상적으로 발급되었습니다.</p>
  </v-container>
</template>
