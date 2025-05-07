
<script setup>
const selectedItem = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)

const timeOptions = [
  '오전 9:00', '오전 9:30', '오전 10:00', '오전 10:30',
  '오전 11:00', '오전 11:30', '오후 12:00', '오후 1:00',
  '오후 2:00', '오후 3:00', '오후 4:00', '오후 5:00', '오후 6:00'
]

const submitReservation = () => {
  if (!selectedDate.value || !selectedTime.value) return

  const datetime = new Date(`${selectedDate.value} ${selectedTime.value}`)
  console.log('예약 날짜 및 시간:', datetime.toISOString())

  // 예: `/payment/reservation` 페이지로 라우팅
  router.push({
    path: '/payment/reservation',
    query: {
      date: selectedDate.value,
      time: selectedTime.value,
      propertyId: selectedItem.value.id
    }
  })
}
const items = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `매물 제목 ${index + 1}`,
  price: `월세 ${50 + index * 5}만원`,
  location: '서울시 강남구',
  description: '아늑한 공간과 뛰어난 채광을 갖춘 매물입니다.',
  thumbnail: 'https://images.unsplash.com/photo-1611602132416-da2045990f76?q=80&w=2574&auto=format&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'
  ],
  options: {
    rooms: 3,
    bathrooms: 2,
    size: '85㎡',
    floor: '5층',
    hasParking: index % 2 === 0,
    hasElevator: index % 3 === 0,
    hasPet: index % 4 === 0
  },
  user: {
    nickname: `사용자${index + 1}`,
    profileImg: `https://randomuser.me/api/portraits/men/${index + 10}.jpg`
  }
}))

const comments = ref([])
const newComment = ref('')

const selectItem = (item) => {
  selectedItem.value = item
}

const submitComment = () => {
  if (newComment.value.trim() !== '') {
    comments.value.push(newComment.value)
    newComment.value = ''
    
  }
}

const textWithTag = ref("<p>태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.태그가 달린 텍스트 코드입니다.</p>");


const detailMap = ref(null)
const defaultMap = ref(null)

watch([selectedItem, detailMap, defaultMap], async () => {
  await nextTick()
  const target = selectedItem.value ? detailMap.value : defaultMap.value
  if (!target) return

  target.innerHTML = ''
  new kakao.maps.Map(target, {
    center: new window.kakao.maps.LatLng(37.5665, 126.9780),
    level: 3
  })
})




</script>

<template>
  <v-container fluid class="pa-0 overflow-x-hidden">
    <v-row no-gutters>
      
      <!-- 왼쪽 매물 리스트 -->
      <v-col cols="12" md="4" class="pa-4" style="height: calc(100vh - 64px); overflow-y: auto;">
        <!-- 리스트 영역 맨 위에 추가 -->
          <v-col cols="12" class="px-0">
            <v-text-field
              v-model="searchKeyword"
              placeholder="지역, 제목, 가격 등으로 검색"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              density="compact" 
              class="mb-4"
              variant="outlined"
            />
          </v-col>
          
        <v-row dense>
          <v-col cols="12" v-for="item in items" :key="item.id" class="mb-4">
            <v-card
              class="d-flex hover-card"
              @click="selectItem(item)"
              style="cursor: pointer; min-height: 120px;"
              variant="outlined"
            >
              <div style="width: 40%; height: 100%; display: flex;">
                <v-img
                  :src="item.thumbnail"
                  alt="thumbnail"
                  cover
                  style="width: 100%; object-fit: cover; border-top-left-radius: 4px; border-bottom-left-radius: 4px;"
                />
              </div>
              <div class="d-flex flex-column justify-center pa-4" style="width: 60%;">
                <h3 class="text-subtitle-1 font-weight-bold mb-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ item.title }}
                </h3>
                <p class="text-body-2 font-weight-bold mb-1" style="color: #FF8339;">{{ item.price }}</p>
                <p class="text-caption text-grey">{{ item.location }}</p>
                <div class="d-flex align-center mt-2">
                  <v-avatar size="24" class="mr-2">
                    <img :src="item.user.profileImg" alt="프로필 이미지" />
                  </v-avatar>
                  <span class="text-caption text-grey">{{ item.user.nickname }}</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- 오른쪽 상세 보기 -->
      <v-col cols="12" md="8" class="pa-0 overflow-x-hidden" style="height: calc(100vh - 64px); overflow-y: auto;">
        <template v-if="selectedItem">
          <div style="position: relative;">
            <v-btn icon color="grey" class="ma-4" style="position: absolute; top: 0; left: 0; z-index: 10;" @click="selectedItem = null">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-carousel height="500">
              <v-carousel-item
                v-for="(img, index) in selectedItem.images"
                :key="index"
                :src="img"
                cover
              />
            </v-carousel>

            <v-container class="py-8">
              <v-row justify="center" class="text-center mb-8">
                <v-col cols="12" md="8">
                  <h2 class="text-h5 font-weight-bold mb-4">{{ selectedItem.title }}</h2>
                  <p class="text-body-1 font-weight-bold mb-2" style="color: #FF8339;">{{ selectedItem.price }}</p>
                  <p class="text-body-1">{{ selectedItem.description }}</p>
                </v-col>
              </v-row>

              <v-row class="mb-8" align="start">
                <!-- 옵션 -->
                <v-col cols="12" md="6">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4 pl-5">옵션</h3>
                  <v-row class="text-center">
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16">mdi-home</v-icon>
                      <div class="text-body-2">방: {{ selectedItem.options.rooms }}</div>
                    </v-col>
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16">mdi-shower</v-icon>
                      <div class="text-body-2">욕실: {{ selectedItem.options.bathrooms }}</div>
                    </v-col>
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16">mdi-ruler-square</v-icon>
                      <div class="text-body-2">{{ selectedItem.options.size }}</div>
                    </v-col>
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16">mdi-office-building-marker</v-icon>
                      <div class="text-body-2">{{ selectedItem.options.floor }}</div>
                    </v-col>

                    <!-- Boolean 옵션 -->
                    <v-col cols="3" sm="3" v-if="selectedItem.options.hasParking">
                      <v-icon color="#FF8339" size="16">mdi-parking</v-icon>
                      <div class="text-body-2">주차 가능</div>
                    </v-col>
                    <v-col cols="3" sm="3" v-if="selectedItem.options.hasElevator">
                      <v-icon color="#FF8339" size="16">mdi-elevator</v-icon>
                      <div class="text-body-2">엘리베이터</div>
                    </v-col>
                    <v-col cols="3" sm="3" v-if="selectedItem.options.hasPet">
                      <v-icon color="#FF8339" size="16">mdi-dog</v-icon>
                      <div class="text-body-2">반려동물 가능</div>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- 지도 -->
                <v-col cols="12" md="6" class="text-center">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4 text-left">위치</h3>
                  <div ref="detailMap" style="width: 500px; height: 400px;"></div>
                  <div>
                    <v-icon color="#FF8339" size="16">mdi-map-marker</v-icon>
                    {{ selectedItem.location }}
                  </div>
                </v-col>
              </v-row>
              <v-row class="mb-8" align="start">
                <!-- 옵션 -->
                <v-col cols="12">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4">추가 설명</h3>
                  <v-row class="text-center">
                    <div v-html="textWithTag" class="px-3 text-left"></div>
                  </v-row>
                </v-col>
              </v-row>

            <!-- 예약 -->
            <v-row class="h-auto">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-4">예약</h3>

                <!-- 날짜 선택 -->
                <div class="mb-6">
                  <v-row>
                    <v-col>
                      <v-date-picker
                        v-model="selectedDate"
                        color="deep-orange"
                        elevation="1"
                        :show-adjacent-months="false"
                        show-current
                        header-color="white"
                        full-width
                      />
                    </v-col>
<v-col v-if="selectedDate">
  <h4 class="text-subtitle-2 font-weight-medium mb-2">시간 선택</h4>
                  <div class="d-flex flex-wrap gap-2 mb-4">
                    <v-btn
                      v-for="time in timeOptions"
                      :key="time"
                      class="ma-1"
                      variant="outlined"
                      :color="selectedTime === time ? 'deep-orange' : ''"
                      @click="selectedTime = time"
                    >
                      {{ time }}
                    </v-btn>
                  </div>
</v-col>
                  </v-row>
                </div>
                  <!-- 예약 버튼 -->
                  <v-btn
                    block
                    color="deep-orange"
                    :disabled="!selectedDate || !selectedTime"
                    @click="submitReservation"
                  >
                    예약하기
                  </v-btn>
              </v-col>
            </v-row>

            </v-container>
          </div>
        </template>

        <template v-else>
          <div  ref="defaultMap" style="width: 100%; height: 100%; background-color: #eee; display: flex; align-items: center; justify-content: center;"></div>
        </template>
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
