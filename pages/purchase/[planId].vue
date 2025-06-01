<script setup>

const route = useRoute()
const ticketId =route.params.planId 
const plan = ref({});
const response = await useApi(`/payments/tickets?ticketId=${ticketId}`);
plan.value=response.data[0];

const router = useRouter()
const { setup, requestPayment } = useTossPayments(plan.value);

const goBack = () => {
  router.back()
}

onMounted(async () => {
  //티켓 데이터

  await setup()

  document.getElementById('payment-button')?.addEventListener('click', async () => {
    await requestPayment(`ORDER-${Date.now()}`, plan.value.id)
  })
})
</script>


<template>
  <v-container class="py-8">
    <v-btn icon @click="goBack" class="mb-4">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <h2 class="text-h5 font-weight-bold mb-4">{{ plan?.name }} 결제</h2>
    <p class="text-body-1 mb-6">가격: {{ plan?.price.toLocaleString()}}원</p>

    <div id="payment-method" class="mb-4"></div>
    <div id="agreement" class="mb-4"></div>

    <v-btn id="payment-button" color="primary">결제하기</v-btn>
  </v-container>
</template>
