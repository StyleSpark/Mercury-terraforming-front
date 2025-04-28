<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>

      <!-- 왼쪽 매물 리스트 -->
      <v-col cols="12" md="4" class="pa-4" style="height: calc(100vh - 64px); overflow-y: auto;">
        <v-row dense>
          <v-col
            cols="12"
            v-for="item in items"
            :key="item.id"
            class="mb-4"
          >
            <v-card
              class="d-flex hover-card align-center"
              @click="selectItem(item)"
              style="cursor: pointer; min-height: 120px;"
            >
              <v-img :src="item.thumbnail" width="100" height="100" cover />
              <div class="d-flex flex-column justify-center pa-4" style="flex: 1;">
                <h3 class="text-subtitle-1 font-weight-bold mb-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.title }}</h3>
                <p class="text-body-2 font-weight-bold mb-1" style="color: #FF8339;">{{ item.price }}</p>
                <p class="text-caption text-grey">{{ item.location }}</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- 오른쪽 상세 보기 or 지도 -->
      <v-col cols="12" md="8" class="pa-0" style="height: calc(100vh - 64px); overflow-y: auto;">
        <template v-if="selectedItem">
          <div style="position: relative;">

            <!-- 돌아가기 버튼 (캐러셀 위에) -->
            <v-btn
              icon
              color="grey"
              class="ma-4"
              style="position: absolute; top: 0; left: 0; z-index: 10;"
              @click="selectedItem = null"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <!-- 캐러셀 -->
            <v-carousel height="300">
              <v-carousel-item
                v-for="(img, index) in selectedItem.images"
                :key="index"
                :src="img"
                cover
              />
            </v-carousel>

            <!-- 상세 내용 -->
            <v-container class="py-8">

              <!-- 타이틀, 가격, 설명 -->
              <v-row justify="center" class="text-center mb-8">
                <v-col cols="12" md="8">
                  <h2 class="text-h5 font-weight-bold mb-4">{{ selectedItem.title }}</h2>
                  <p class="text-body-1 font-weight-bold mb-2" style="color: #FF8339;">{{ selectedItem.price }}</p>
                  <p class="text-body-1">{{ selectedItem.description }}</p>
                </v-col>
              </v-row>

              <!-- 옵션들 -->
              <v-row justify="center" class="text-center mb-8">
                <v-col cols="6" sm="3">
                  <v-icon color="#FF8339" size="32">mdi-home</v-icon>
                  <div>방: {{ selectedItem.options.rooms }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-icon color="#FF8339" size="32">mdi-shower</v-icon>
                  <div>욕실: {{ selectedItem.options.bathrooms }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-icon color="#FF8339" size="32">mdi-ruler-square</v-icon>
                  <div>{{ selectedItem.options.size }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-icon color="#FF8339" size="32">mdi-office-building-marker</v-icon>
                  <div>{{ selectedItem.options.floor }}</div>
                </v-col>
              </v-row>

              <!-- 위치 -->
              <v-row justify="center" class="text-center mb-8">
                <v-col cols="12">
                  <v-icon color="#FF8339" size="28">mdi-map-marker</v-icon>
                  <div>{{ selectedItem.location }}</div>
                </v-col>
              </v-row>

              <!-- 댓글 -->
              <v-divider class="my-8"></v-divider>

              <v-row>
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-bold mb-4">댓글</h3>
                  <v-row dense class="mb-4">
                    <v-col cols="10">
                      <v-text-field
                        v-model="newComment"
                        placeholder="댓글을 입력하세요"
                        dense
                        hide-details
                      />
                    </v-col>
                    <v-col cols="2" class="d-flex align-center">
                      <v-btn color="#FF8339" @click="submitComment" block>등록</v-btn>
                    </v-col>
                  </v-row>

                  <v-list>
                    <v-list-item
                      v-for="(comment, index) in comments"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ comment }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>

            </v-container>
          </div>
        </template>

        <template v-else>
          <div style="width: 100%; height: 100%; background-color: #eee; display: flex; align-items: center; justify-content: center;">
            <p class="text-subtitle-1">지도 영역 (지도 컴포넌트 예정)</p>
          </div>
        </template>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const selectedItem = ref(null)

const items = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `매물 제목 ${index + 1}`,
  price: `월세 ${50 + index * 5}만원`,
  location: '서울시 강남구',
  description: '아늑한 공간과 뛰어난 채광을 갖춘 매물입니다.',
  thumbnail: 'https://images.unsplash.com/photo-1611602132416-da2045990f76?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  images: [
    'https://images.unsplash.com/photo-1560185008-5c4b7ae4e06c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'
  ],
  options: {
    rooms: 3,
    bathrooms: 2,
    size: '85㎡',
    floor: '5층'
  }
}))

const selectItem = (item) => {
  selectedItem.value = item
}

const comments = ref([])
const newComment = ref('')

const submitComment = () => {
  if (newComment.value.trim() !== '') {
    comments.value.push(newComment.value)
    newComment.value = ''
  }
}
</script>

<style scoped>
.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}
</style>
