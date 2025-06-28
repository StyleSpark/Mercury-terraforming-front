<script setup>
const route = useRoute()

onMounted(async () => {
  const { paymentKey, orderId, amount, type, token } = route.query

  if (!paymentKey || !orderId || !amount || !type || !token) {
    console.error('결제 정보 누락')
    return navigateTo('/')
  }

  const sessionKey = `payment_access_token_${orderId}`
  const sessionToken = sessionStorage.getItem(sessionKey)

  if (token !== sessionToken) {
    console.warn('정상 결제 흐름이 아님. 접근 차단.')
    return navigateTo('/') // 혹은 에러 페이지
  }

  // 처리 후 삭제
  sessionStorage.removeItem(sessionKey)

  // 중복 확인도 추가 가능
  const processedKey = `payment_processed_${orderId}`
  if (sessionStorage.getItem(processedKey)) return
  sessionStorage.setItem(processedKey, 'done')

  try {
    const endpoint = type === 'reservation'
      ? '/payments/reservationConfirm'
      : '/payments/purchaseTicket'

    const res = await useApi(endpoint, {
      method: 'POST',
      body: {
        paymentKey,
        orderId,
        amount: Number(amount),
        ticketId: type,
      }
    })

    console.log('결제 완료:', res)
  } catch (err) {
    console.error('결제 처리 실패:', err)
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
