<script setup>
const router = useRouter();
// 대리인 데이터
const agents = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `대리인 ${index + 1}`,
  area: ['강남구 청담동', '성수동', '마포구 서교동', '송파구 잠실동'][index % 4],
  temperature: (36.5 + Math.random() * 2).toFixed(1), // 온도
  price: `${(20000 + index * 3000).toLocaleString()}원`,
  thumbnail: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'
}))

const sortOption = ref('인기순')

const handleSortChange = (option) => {
  sortOption.value = option
  // 여기에 실제 정렬 로직 넣을 수 있음
}

const goToAgentDetail = (id) => {
  router.push(`/proxy-services/${id}`)
  console.log('대리인 상세로 이동:', id)
}
</script>

<template>
  <v-container fluid class="py-8">

    <!-- 1. 정렬 바 -->
    <v-row justify="end" class="mb-6">
      <v-col cols="3">
        <v-text-field variant="outlined"  :loading="loading" density="compact" label="지역 / 이름" append-inner-icon="mdi-magnify"></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-select
          v-model="sortOption"
          label="정렬 기준"
          :items="['날짜순', '인기순', '최신순', '오래된순']"
          variant="outlined"
          density="compact"
          class="sort-select"
        />
      </v-col>
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
        <v-card class="hover-card mb-2" @click="goToAgentDetail(agent.id)" style="cursor: pointer;" variant="outlined">
          
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
            <div class="d-flex align-center mb-2">
              <v-icon color="orange" size="18">mdi-message-reply-outline</v-icon>
              <span class="text-caption ml-1">100</span>
            </div>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
    <!-- 페이지 네이션 -->
    <div class="text-center">
    <v-pagination
      v-model="page"
      :length="15"
      :total-visible="7"
    ></v-pagination>
  </div>
  </v-container>
</template>

<style scoped>
.hover-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;
}
</style>
