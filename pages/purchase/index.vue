<script setup>
const router = useRouter()

const plans = ref([])

const goToCheckout = (planId) => {
  router.push(`/purchase/${planId}`)
}
onMounted(async()=>{
  const response = await useApi('/payments/tickets');
  plans.value=response.data;
})
</script>

<template>
  <v-container class="py-8" style="max-width: 900px;">
    <!-- 상단 안내 문구 -->
    <h2 class="text-h5 font-weight-bold mb-4">등록권 구매</h2>
    <p class="mb-6 text-body-1">
      원하는 등록권을 선택하여 매물을 등록해보세요. <br />
      등록권을 구매하면 더 많은 사용자에게 노출되며, <br />
      <span class="text-medium-emphasis">등록권은 구매일로부터 <strong>30일간 유효</strong>합니다.</span>
    </p>

    <!-- 등록권 리스트 -->
    <v-row dense>
      <v-col
        v-for="plan in plans"
        :key="plan.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card elevation="1" class="pa-5 rounded-xl d-flex flex-column justify-space-between position-relative h-100">
          <!-- 추천 뱃지 -->
          <v-chip
            v-if="plan.recommended"
            color="deep-purple-accent-2"
            text-color="white"
            size="small"
            class="position-absolute"
            style="top: 10px; right: 10px;"
          >
            ⭐ 추천
          </v-chip>

          <!-- 내용 -->
          <div>
            <v-icon size="28" color="primary" class="mb-2">mdi-ticket-confirmation</v-icon>
            <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ plan.name }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">{{ plan.description }}</p>
          </div>

          <!-- 가격 및 버튼 -->
          <div class="mt-auto">
            <p class="text-h6 font-weight-bold mb-2">{{ plan.price.toLocaleString() +"원" }}</p>
            <v-btn
              block
              color="primary"
              @click="goToCheckout(plan.id)"
            >
              구매하기
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Divider -->
    <v-divider class="my-8" />

    <!-- 자주 묻는 질문 -->
    <h3 class="text-subtitle-1 font-weight-bold mb-3">자주 묻는 질문</h3>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>등록권은 언제까지 사용할 수 있나요?</v-expansion-panel-title>
        <v-expansion-panel-text>
          등록권은 <strong>구매일로부터 30일간</strong> 사용할 수 있으며, 기간 내 사용하지 않으면 자동 소멸됩니다.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>환불이 가능한가요?</v-expansion-panel-title>
        <v-expansion-panel-text>
          <strong>사용하지 않은 등록권</strong>에 한해 구매일로부터 7일 이내 환불이 가능합니다. 사용된 등록권은 환불되지 않습니다.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>등록한 매물은 어디에 노출되나요?</v-expansion-panel-title>
        <v-expansion-panel-text>
          등록한 매물은 <strong>홈 화면, 지도 기반 검색 결과</strong>, 추천 리스트 등에 노출됩니다.
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style scoped>
.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}
</style>
