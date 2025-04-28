<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const agentId = route.params.id

// 예시 대리인 정보 (추후 API 연결 가능)
const agent = ref({
  id: agentId,
  name: `대리인 ${agentId}`,
  area: '강남구 청담동',
  temperature: 37.5,
  intro: '청담동과 강남 지역 부동산 시장을 누구보다 잘 이해하고 있습니다.',
  profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  services: [
    { id: 1, title: '단일 매물 방문 대행', price: '29,000원', description: '지정한 매물 1건을 직접 방문하여 상태 확인 및 사진 제공' },
    { id: 2, title: '복수 매물 방문 대행', price: '49,000원', description: '지정한 매물 2건 방문 및 리포트 제공' },
    { id: 3, title: '조건 검색 및 추천 대행', price: '99,000원', description: '조건에 맞는 매물 탐색 및 종합 리포트 제공' }
  ],
  reviews: [
    { id: 1, user: '사용자 A', content: '정말 빠르고 친절했습니다. 추천합니다!', rating: 5 },
    { id: 2, user: '사용자 B', content: '사진도 꼼꼼하고 설명도 잘 해주셨어요.', rating: 4 }
  ]
})

const activeTab = ref('reviews')
</script>

<template>
  <v-container fluid class="py-8">

    <!-- 1. 대리인 프로필 -->
    <v-row justify="center" class="mb-12">
      <v-col cols="12" md="8" class="text-center">
        <v-avatar size="120" class="mb-6">
          <v-img :src="agent.profileImage" />
        </v-avatar>
        <h1 class="text-h5 font-weight-bold mb-2">{{ agent.name }}</h1>
        <p class="text-body-1 mb-2">{{ agent.area }}</p>
        <div class="d-flex justify-center align-center mb-2">
          <v-icon color="orange" size="20">mdi-thermometer</v-icon>
          <span class="text-caption ml-1">{{ agent.temperature }}°C</span>
        </div>
        <p class="text-body-2 mt-4">{{ agent.intro }}</p>
      </v-col>
    </v-row>

    <!-- 2. 탭 영역 (후기 / 서비스) -->
    <v-container>
      <v-tabs
        v-model="activeTab"
        background-color="transparent"
        color="#FF8339"
        align-tabs="center"
        class="mb-8"
      >
        <v-tab value="reviews">후기</v-tab>
        <v-tab value="services">대리 서비스</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">

        <!-- 후기 탭 -->
        <v-window-item value="reviews">
          <v-row>
            <v-col cols="12" v-for="review in agent.reviews" :key="review.id" class="mb-6">
              <v-card class="pa-4">
                <div class="d-flex align-center mb-2">
                  <v-avatar size="40" class="mr-3">
                    <v-img src="https://via.placeholder.com/40x40.png?text=User" />
                  </v-avatar>
                  <div>
                    <h4 class="text-subtitle-2 font-weight-bold">{{ review.user }}</h4>
                    <v-rating :model-value="review.rating" color="amber" density="compact" half-increments readonly size="small" />
                  </div>
                </div>
                <p class="text-body-2">{{ review.content }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- 대리 서비스 탭 -->
        <v-window-item value="services">
          <v-row>
            <v-col cols="12" sm="6" md="4" v-for="service in agent.services" :key="service.id" class="mb-6">
              <v-card class="pa-6 hover-card text-center">
                <h3 class="font-weight-bold mb-2">{{ service.title }}</h3>
                <p class="text-body-1 mb-2" style="color: #FF8339;">{{ service.price }}</p>
                <p class="text-caption mb-4">{{ service.description }}</p>
                <v-btn color="#FF8339" class="text-white" block>서비스 신청</v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

      </v-window>
    </v-container>

  </v-container>
</template>

<style scoped>
.hover-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;
}
.text-white {
  color: white !important;
}
</style>
