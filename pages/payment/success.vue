<script setup>
const route = useRoute()

onMounted(async () => {
  const { paymentKey, orderId, amount, type } = route.query

  if (!paymentKey || !orderId || !amount || !type) {
    console.error('결제 정보 누락')
    return
  }

  try {
    let endpoint = ''

    if (type === 'reservation') {
      endpoint = '/payments/reservationConfirm'
    } else if (type === 'ticket') {
      endpoint = '/payments/purchaseTicket'
    } else {
      console.error('알 수 없는 결제 유형:', type)
      return
    }

    const response = await useApi(endpoint, {
      method: 'POST',
      body: {
        paymentKey,
        orderId,
        amount: Number(amount),
        ticketId: type,
      }
    })

    console.log('결제 성공 처리 결과:', response)

  } catch (error) {
    console.error('결제 확인 실패:', error)
  }
})
</script>


<template>
  <v-container class="py-8 text-center ">
    <h2 class="text-h5 font-weight-bold">결제가 완료되었습니다 🎉</h2>
    <p class="text-body-1 mt-4">등록권이 정상적으로 발급되었습니다.</p>
    <NuxtLink to="/"><v-btn class="mt-3" color="info">홈으로 돌아가기</v-btn></NuxtLink>
  </v-container>
</template>
