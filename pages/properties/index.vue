<!-- 
  나중에 여기 utils로 빼야하는 함수 정리해야하고 불필요한 코드로직 정리해야함
  -->
<script setup>
const selectedItem = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)
const properties = ref([])
const detailMap = ref(null)
const defaultMap = ref(null)

// db에서?
const plan = {
  name: '방문 예약 예치금',
  price: 15000,
}

const { setup, requestPayment } = useTossPayments(plan)

//시간은 db에서 가져오도록 해야할까?
const timeOptions = [
  '오전 9:00', '오전 9:30', '오전 10:00', '오전 10:30',
  '오전 11:00', '오전 11:30', '오후 12:00', '오후 1:00',
  '오후 2:00', '오후 3:00', '오후 4:00', '오후 5:00', '오후 6:00',
]

function parseKoreanTimeTo24Hour(timeStr) {
  const [period, time] = timeStr.split(' ')
  let [hour, minute] = time.split(':').map(Number)

  if (period === '오후' && hour !== 12) hour += 12
  if (period === '오전' && hour === 12) hour = 0

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function formatDateToKorean(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date)
}

function formatDateToYYYYMMDD(date) {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function toLocalISOString(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}
const showReservation = ref(false)
//예약 하기 로직
const submitReservation = async () => {
  if (!selectedDate.value || !selectedTime.value) return;

  const formattedDate = formatDateToYYYYMMDD(selectedDate.value);
  const time24 = parseKoreanTimeTo24Hour(selectedTime.value);
  const date = new Date(`${formattedDate}T${time24}:00`);

  showReservation.value = true;
  await nextTick();
  await setup();

  const tempRequest = {
    propertyId: selectedItem.value.id,
    userId: 1, 
    time: toLocalISOString(date), 
    info: plan.name,
    deposit: plan.price,
    status: "결제중",
  };

  const response = await useApi('/payments/temp', {
    method: 'POST',
    body: tempRequest,
  });

  const orderId = response.data.orderId;

  document.getElementById('payment-button')?.addEventListener('click', async () => {
    await requestPayment(orderId);
  });
};


const selectItem = async (item) => {
  selectedItem.value = null;
  showReservation.value = false;
  selectedDate.value = null;
  selectedTime.value = null;

  const response = await useApi(`/properties/${item.id}`)
  selectedItem.value = response.data
  await nextTick()
  drawDetailMap(selectedItem.value)
}

function drawDetailMap(property) {
  if (!detailMap.value || !property) return
  const { latitude, longitude } = property
  const position = new kakao.maps.LatLng(latitude, longitude)

  const map = new kakao.maps.Map(detailMap.value, {
    center: position,
    level: 3,
  })

  new kakao.maps.Marker({
    map,
    position,
  })
}

function drawListMap(propertyList) {
  if (!defaultMap.value || !propertyList?.length) return

  const map = new kakao.maps.Map(defaultMap.value, {
    center: new kakao.maps.LatLng(37.5665, 126.978), // 후에 사용자 위치로 변경해야함
    level: 5,
  })

  const bounds = new kakao.maps.LatLngBounds()

  propertyList.forEach((item) => {
    const { latitude, longitude } = item
    if (!latitude || !longitude) return

    const position = new kakao.maps.LatLng(latitude, longitude)
    new kakao.maps.Marker({ map, position })
    bounds.extend(position)
  })

  map.setBounds(bounds)
}

const isAllowedDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  return target >= today
}

const isTimeDisabled = (timeStr) => {
  if (!selectedDate.value) return true

  const today = new Date()
  const selected = new Date(selectedDate.value)
  today.setHours(0, 0, 0, 0)
  selected.setHours(0, 0, 0, 0)

  // 오늘이 아닌 날은 모든 시간 허용
  if (selected > today) return false

  // 오늘이라면 현재 시간 기준 이전 시간 비활성화
  const now = new Date()
  const parsedTime = parseKoreanTimeTo24Hour(timeStr)
  const [hour, minute] = parsedTime.split(':').map(Number)

  const selectedTime = new Date()
  selectedTime.setHours(hour, minute, 0, 0)

  return selectedTime <= now
}

const goBack = async () => {
  showReservation.value = false
  selectedItem.value = null 
  await nextTick()
  drawListMap(properties.value)
}

watch(selectedItem, async (val) => {
  if (!val) {
    await nextTick()
    drawListMap(properties.value)
  }
})

onMounted(async () => {
  await nextTick()
  const response = await useApi('/properties')
  properties.value = response.data
  await nextTick()
  drawListMap(properties.value)
})

</script>

<template>
  <v-container fluid class="pa-0 overflow-x-hidden">
    <v-row no-gutters>
      <!-- 왼쪽 매물 리스트 -->
      <v-col
        cols="12"
        md="4"
        class="pa-4"
        style="height: calc(100vh - 64px); overflow-y: auto"
      >
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
          <v-col cols="12" v-for="item in properties" :key="item.id" class="mb-4">
            <v-card
              class="d-flex hover-card"
              @click="selectItem(item)"
              style="cursor: pointer; min-height: 120px"
              variant="outlined"
            >
              <div style="width: 40%; height: 100%; display: flex">
                <v-img
                  :src="item.thumbnailUrl"
                  alt="thumbnailUrl"
                  cover
                  style="
                    width: 100%;
                    object-fit: cover;
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                  "
                />
              </div>
              <div
                class="d-flex flex-column justify-center pa-4"
                style="width: 60%"
              >
                <h3
                  class="text-subtitle-1 font-weight-bold mb-1"
                  style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  {{ item.title }}
                </h3>
                <p
                  class="text-body-2 font-weight-bold mb-1"
                  style="color: #ff8339"
                >
                  {{ item.price }}
                </p>
                <p class="text-caption text-grey">{{ item.location }}</p>
                <div class="d-flex align-center mt-2">
                  <v-avatar size="24" class="mr-2">
                    <img :src="item.profile" alt="프로필 이미지" />
                  </v-avatar>
                  <span class="text-caption text-grey">{{
                    item.nickname
                  }}</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- 오른쪽 상세 보기 -->
      <v-col
        cols="12"
        md="8"
        class="pa-0 overflow-x-hidden"
        style="height: calc(100vh - 64px); overflow-y: auto"
      >
        <template v-if="selectedItem">
          <div style="position: relative">
            <v-btn
              icon
              color="grey"
              class="ma-4"
              style="position: absolute; top: 0; left: 0; z-index: 10"
              @click="selectedItem = null"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-carousel height="500">
              <v-carousel-item
                v-for="(img, index) in selectedItem.imageUrls"
                :key="index"
                :src="img"
                :alt="img"
                cover
              />
            </v-carousel>

            <v-container class="py-8" v-show="!showReservation">
              <v-row justify="center" class="text-center mb-8">
                <v-col cols="12" md="8">
                  <h2 class="text-h5 font-weight-bold mb-4">
                    {{ selectedItem.title }}
                  </h2>
                  <p
                    class="text-body-1 font-weight-bold mb-2"
                    style="color: #ff8339"
                  >
                    {{ selectedItem.price }}
                  </p>
                  <p class="text-body-1">{{ selectedItem.detail.content }}</p>
                </v-col>
              </v-row>

              <v-row class="mb-8" align="start">
                <!-- 옵션 -->
                <v-col cols="12" md="6">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4 pl-5">
                    옵션
                  </h3>
                  <v-row class="text-center">
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16">mdi-home</v-icon>
                      <div class="text-body-2">
                        방: {{ selectedItem.roomCount }}
                      </div>
                    </v-col>
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16">mdi-shower</v-icon>
                      <div class="text-body-2">
                        욕실: {{ selectedItem.bathroomCount }}
                      </div>
                    </v-col>
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16"
                        >mdi-ruler-square</v-icon
                      >
                      <div class="text-body-2">
                        {{ selectedItem.roomSize }}
                      </div>
                    </v-col>
                    <v-col cols="3" sm="3">
                      <v-icon color="#FF8339" size="16"
                        >mdi-office-building-marker</v-icon
                      >
                      <div class="text-body-2">
                        {{ selectedItem.floor }}
                      </div>
                    </v-col>

                    <!-- Boolean 옵션 -->
                    <v-col
                      cols="3"
                      sm="3"
                      v-if="selectedItem.detail.lot"
                    >
                      <v-icon color="#FF8339" size="16">mdi-parking</v-icon>
                      <div class="text-body-2">주차 가능</div>
                    </v-col>
                    <v-col
                      cols="3"
                      sm="3"
                      v-if="selectedItem.detail.hasElevator"
                    >
                      <v-icon color="#FF8339" size="16">mdi-elevator</v-icon>
                      <div class="text-body-2">엘리베이터</div>
                    </v-col>
                    <v-col cols="3" sm="3" v-if="selectedItem.detail.hasPet">
                      <v-icon color="#FF8339" size="16">mdi-dog</v-icon>
                      <div class="text-body-2">반려동물 가능</div>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- 지도 -->
                <v-col cols="12" md="6" class="text-center">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4 text-left">
                    위치
                  </h3>
                  <div
                    ref="detailMap"
                    style="width: 500px; height: 400px"
                  ></div>
                  <div>
                    <v-icon color="#FF8339" size="16">mdi-map-marker</v-icon>
                    {{ selectedItem.location }}
                  </div>
                </v-col>
              </v-row>
              <v-row class="mb-8" align="start">
                <!-- 옵션 -->
                <v-col cols="12">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4">
                    추가 설명
                  </h3>
                  <v-row class="text-center">
                    <div v-html="selectedItem.detail.content" class="px-3 text-left"></div>
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
                          color="deep-orange"
                          v-model="selectedDate"
                          :model-value="selectedDate"
                          :allowed-dates="isAllowedDate"
                          type="date"
                        />
                      </v-col>
                      <v-col>
                        <h4 class="text-subtitle-2 font-weight-medium mb-2">
                          시간 선택
                        </h4>
                        <div class="d-flex flex-wrap gap-2 mb-4">
                          <v-btn
                            v-for="time in timeOptions"
                            :key="time"
                            class="ma-1"
                            variant="outlined"
                            :disabled="!selectedDate || isTimeDisabled(time)"
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
            <v-container class="py-8" v-show="showReservation">
              <h2 class="text-h5 font-weight-bold mb-4">예치금 결제</h2>
              <p class="text-body-1 mb-4">
                예약 날짜: {{ formatDateToKorean(selectedDate) }}
              </p>
              <p class="text-body-1 mb-4">예약 시간: {{ selectedTime }}</p>
              <p class="text-body-1 mb-4">예치금: 15,000원</p>

              <div id="payment-method" class="mb-4"></div>
              <div id="agreement" class="mb-4"></div>

              <v-btn id="payment-button" class="mr-2" color="primary"
                >결제하기</v-btn
              >
              <v-btn
                id="payment-button"
                variant="outlined"
                color="primary"
                @click="goBack"
                >뒤로가기</v-btn
              >
            </v-container>
          </div>
        </template>

        <template v-else>
          <div
            ref="defaultMap"
            style="
              width: 100%;
              height: 100%;
              background-color: #eee;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          ></div>
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