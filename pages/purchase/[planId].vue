<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const planId = route.params.planId

// 등록권 정보 매핑
const plans = {
  1: { name: '1회 등록권', price: 1000 },
  5: { name: '5회 등록권', price: 4800 },
  unlimited: { name: '10회 등록권', price: 9000 }
}

const selectedPlan = plans[planId]

const tossPayments = TossPayments('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm')

onMounted(async () => {
  const tossPayments = window.TossPayments('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm')
  const widgets = tossPayments.widgets({ customerKey: 'user_1234' })

  await widgets.setAmount({ currency: 'KRW', value: selectedPlan.price })

  await Promise.all([
    widgets.renderPaymentMethods({ selector: '#payment-method' }),
    widgets.renderAgreement({ selector: '#agreement' })
  ])

  document.getElementById('payment-button')?.addEventListener('click', async () => {
    await widgets.requestPayment({
      orderId: `ORDER-${Date.now()}`,
      orderName: selectedPlan.name,
      successUrl: window.location.origin + '/payment/success',
      failUrl: window.location.origin + '/payment/fail',
      customerEmail: 'test@example.com',
      customerName: '홍길동',
      customerMobilePhone: '01012345678'
    })
  })
})

</script>

<template>
  <v-container class="py-8">
    <h2 class="text-h5 font-weight-bold mb-4">{{ selectedPlan?.name }} 결제</h2>
    <p class="text-body-1 mb-6">가격: {{ selectedPlan?.price.toLocaleString() }}원</p>

    <div id="payment-method" class="mb-4"></div>
    <div id="agreement" class="mb-4"></div>

    <v-btn id="payment-button" color="primary">결제하기</v-btn>
  </v-container>
</template>
