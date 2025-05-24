<script setup>
const route = useRoute();
const router = useRouter();
const query = route.query

const selectedDate = query.date
const selectedTime = query.time
const propertyId = query.propertyId

const tossPayments = window.TossPayments('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm')
const widgets = tossPayments.widgets({ customerKey: 'user_1234' })
const goBack = () => {
  router.back();
}
onMounted(async () => {
  await widgets.setAmount({ currency: 'KRW', value: 15000 })

  await Promise.all([
    widgets.renderPaymentMethods({ selector: '#payment-method' }),
    widgets.renderAgreement({ selector: '#agreement' })
  ])

  document.getElementById('payment-button')?.addEventListener('click', async () => {
    await widgets.requestPayment({
      orderId: `RESERVATION`,
      orderName: '방문 예약 예치금',
    })
  })
})
</script>

<template>
  <v-container class="py-8">
    <h2 class="text-h5 font-weight-bold mb-4">예치금 결제</h2>
    <p class="text-body-1 mb-4">예약 날짜: {{ selectedDate }}</p>
    <p class="text-body-1 mb-4">예약 시간: {{ selectedTime }}</p>
    <p class="text-body-1 mb-4">예치금: 15,000원</p>

    <div id="payment-method" class="mb-4"></div>
    <div id="agreement" class="mb-4"></div>

    <v-btn id="payment-button" color="primary">결제하기</v-btn>
    <v-btn id="payment-button ml-2" variant="outlined" color="primary" @click="goBack">뒤로가기</v-btn>
  </v-container>
</template>
