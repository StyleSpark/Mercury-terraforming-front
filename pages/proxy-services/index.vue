<script setup>
import { ref } from 'vue'

// 대리인 데이터
const agents = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `대리인 ${index + 1}`,
  area: ['강남구 청담동', '성수동', '마포구 서교동', '송파구 잠실동'][index % 4],
  temperature: (36.5 + Math.random() * 2).toFixed(1), // 온도
  price: `${(20000 + index * 3000).toLocaleString()}원`,
  thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
}))

const sortOption = ref('인기순')

const handleSortChange = (option) => {
  sortOption.value = option
  // 여기에 실제 정렬 로직 넣을 수 있음
}

const goToAgentDetail = (id) => {
  // 상세 페이지 이동 (예시)
  // 실제 라우터 연결 시: router.push(`/agent/${id}`)
  console.log('대리인 상세로 이동:', id)
}
</script>

<template>
  <v-container fluid class="py-8">

    <!-- 1. 정렬 바 -->
    <v-row justify="end" class="mb-6">
      <v-btn-toggle v-model="sortOption" mandatory>
        <v-btn value="인기순" color="grey-lighten-3" size="small">인기순</v-btn>
        <v-btn value="가격순" color="grey-lighten-3" size="small">가격순</v-btn>
        <v-btn value="최신순" color="grey-lighten-3" size="small">최신순</v-btn>
      </v-btn-toggle>
    </v-row>

    <!-- 2. 대리인 카드 리스트 -->
    <v-row dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        v-for="agent in agents"
        :key="agent.id"
      >
        <v-card class="hover-card" @click="goToAgentDetail(agent.id)" style="cursor: pointer;">
          
          <v-img
            :src="agent.thumbnail"
            height="200"
            cover
          />

          <v-card-text>
            <h3 class="text-subtitle-1 font-weight-bold mb-1">{{ agent.name }}</h3>
            <p class="text-caption text-grey mb-2">{{ agent.area }}</p>

            <!-- 온도 (당근마켓 스타일) -->
            <div class="d-flex align-center mb-2">
              <v-icon color="orange" size="18">mdi-thermometer</v-icon>
              <span class="text-caption ml-1">{{ agent.temperature }}°C</span>
            </div>

            <!-- 가격 -->
            <p class="text-subtitle-2 font-weight-bold" style="color: #FF8339;">{{ agent.price }}</p>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>
.hover-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;
}
</style>
