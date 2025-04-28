<script setup>
import { ref } from 'vue'

const selectedAgent = ref(null)
const activeTab = ref('reviews') // 'reviews' or 'properties'

const agents = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `부동산 ${index + 1}호`,
  location: '서울시 강남구',
  intro: '고객 만족을 최우선으로 생각하는 부동산입니다.',
  thumbnail: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
  images: [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80'
  ],
  properties: [
    { id: 1, title: '강남 오피스텔', price: '월세 120만원' },
    { id: 2, title: '역삼동 아파트', price: '전세 5억' }
  ]
}))

const selectAgent = (agent) => {
  selectedAgent.value = agent
  activeTab.value = 'reviews'
}
</script>

<template>
  <v-container fluid class="pa-0">

    <v-row no-gutters>

      <!-- 왼쪽: 중개인 리스트 -->
      <v-col cols="12" md="4" class="pa-4" style="height: calc(100vh - 64px); overflow-y: auto;">
        <v-row dense>
          <v-col
            cols="12"
            v-for="agent in agents"
            :key="agent.id"
            class="mb-4"
          >
            <v-card
              class="d-flex hover-card align-center"
              @click="selectAgent(agent)"
              style="cursor: pointer; min-height: 120px;"
            >
              <v-img
                :src="agent.thumbnail"
                width="100"
                height="100"
                cover
              />
              <div class="d-flex flex-column justify-center pa-4" style="flex: 1;">
                <h3 class="text-subtitle-1 font-weight-bold mb-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ agent.name }}
                </h3>
                <p class="text-caption text-grey">{{ agent.location }}</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- 오른쪽: 상세 정보 -->
      <v-col cols="12" md="8" class="pa-0" style="height: calc(100vh - 64px); overflow-y: auto;">
        <div style="width: 100%; height: 100%;">
          <template v-if="selectedAgent">
            <!-- 상세 정보 -->
            <div>

              <!-- 캐러셀 상단 -->
              <v-carousel height="300">
                <v-carousel-item
                  v-for="(img, index) in selectedAgent.images"
                  :key="index"
                  :src="img"
                  cover
                />
              </v-carousel>

              <v-container class="py-8">

                <!-- 중개소 기본 정보 -->
                <v-row justify="center" class="text-center mb-8">
                  <v-col cols="12" md="8">
                    <h2 class="text-h5 font-weight-bold mb-2">{{ selectedAgent.name }}</h2>
                    <p class="text-body-2 mb-2">{{ selectedAgent.location }}</p>
                    <p class="text-body-1">{{ selectedAgent.intro }}</p>
                  </v-col>
                </v-row>

                <!-- 탭 -->
                <v-tabs
                  v-model="activeTab"
                  background-color="transparent"
                  color="#FF8339"
                  align-tabs="center"
                  class="mb-8"
                >
                  <v-tab value="reviews">리뷰</v-tab>
                  <v-tab value="properties">등록 매물</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                  <!-- 리뷰 탭 -->
                  <v-window-item value="reviews">
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <h3 class="text-h6 font-weight-bold mb-4">고객 리뷰</h3>
                        <p class="text-body-2">"정말 친절하고 믿을 수 있었습니다!"</p>
                        <p class="text-body-2">"빠르고 정확한 상담 감사합니다."</p>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <!-- 등록 매물 탭 -->
                  <v-window-item value="properties">
                    <v-row dense>
                      <v-col
                        cols="12"
                        v-for="property in selectedAgent.properties"
                        :key="property.id"
                        class="mb-4"
                      >
                        <v-card class="hover-card pa-4">
                          <h3 class="text-subtitle-1 font-weight-bold">{{ property.title }}</h3>
                          <p class="text-body-2" style="color: #FF8339;">{{ property.price }}</p>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>

              </v-container>

            </div>
          </template>

          <template v-else>
            <!-- 기본 지도/대기 화면 -->
            <div style="width: 100%; height: 100%; background-color: #eee; display: flex; align-items: center; justify-content: center;">
              <p class="text-subtitle-1">중개인을 선택하세요.</p>
            </div>
          </template>
        </div>
      </v-col>

    </v-row>

  </v-container>
</template>

<style scoped>
.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}
</style>
