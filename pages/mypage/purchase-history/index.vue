<template>
  <MypageLayoutWrapper>
    <v-card variant="outlined" class="pa-6">
      <div class="text-h5 mb-5">구매 내역</div>
<!-- 
      <v-data-table
        :headers="orderHeaders"
        :items="orders"
        class="elevation-1"
        item-value="id"
        no-data-text="구매 내역이 없습니다."
      >
        <template #item.totalAmount="{ item }">
          {{ formatCurrency(item.totalAmount) }}
        </template>

        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
      </v-data-table> -->
    </v-card>

    <Toast
      v-model="toastVisible"
      :message="message"
      :color="color"
      :duration="2000"
    />
  </MypageLayoutWrapper>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const orders = ref([])

const orderHeaders = [
  { text: '주문 ID', value: 'id' },
  { text: '상품명', value: 'productName' },
  { text: '구매일자', value: 'createdAt' },
  { text: '결제금액', value: 'totalAmount' },
  { text: '결제수단', value: 'paymentMethod' },
  { text: '주문상태', value: 'status' }
]

// 날짜 포맷
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 금액 포맷
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
}

// 구매 내역 조회 API 호출
const fetchOrders = async () => {
  // try {
  //   const response = await useApi('/orders', { method: 'GET' })
  //   orders.value = response
  // } catch (e) {
  //   console.error('구매 내역 조회 실패', e)
  // }
}

// 페이지 진입 시 구매내역 조회
onMounted(() => {
  fetchOrders()
})
</script>
