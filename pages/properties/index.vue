<!-- 
  나중에 여기 utils로 빼야하는 함수 정리해야하고 불필요한 코드로직 정리해야함
  -->
<script setup>
import { useLoginDialogStore } from '@/stores/loginDialog'

const loginDialogStore = useLoginDialogStore()
const auth = useAuthStore()
const selectedItem = ref(null);
const selectedDate = ref(null);
const selectedTime = ref(null);
const properties = ref([]);
const detailMap = ref(null);
const defaultMap = ref(null);
// db에서?
const plan = {
  name: "방문 예약 예치금",
  price: 15000,
};

const { setup, requestPayment } = useTossPayments(plan);

//시간은 db에서 가져오도록 해야할까?
const rawTimeOptions = ref([
  { label: "오전 9:00", value: "09:00" },
  { label: "오전 9:30", value: "09:30" },
  { label: "오전 10:00", value: "10:00" },
  { label: "오전 10:30", value: "10:30" },
  { label: "오전 11:00", value: "11:00" },
  { label: "오전 11:30", value: "11:30" },
  { label: "오후 12:00", value: "12:00" },
  { label: "오후 1:00", value: "13:00" },
  { label: "오후 2:00", value: "14:00" },
  { label: "오후 3:00", value: "15:00" },
  { label: "오후 4:00", value: "16:00" },
  { label: "오후 5:00", value: "17:00" },
  { label: "오후 6:00", value: "18:00" },
]);

function parseKoreanTimeTo24Hour(timeStr) {
  const [period, time] = timeStr.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (period === "오후" && hour !== 12) hour += 12;
  if (period === "오전" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatDateToKorean(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

function formatDateToYYYYMMDD(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function convertToLocalTimeString(timeStr) {
  // "09:30" → "09:30:00"
  return `${timeStr}:00`;
}
const showReservation = ref(false);
//예약 하기 로직
const submitReservation = async () => {
  if (!selectedDate.value || !selectedTime.value) return;

  const formattedDate = formatDateToYYYYMMDD(selectedDate.value); // 날짜 추출

  showReservation.value = true;
  await nextTick();
  await setup();
  const tempRequest = {
    propertyId: selectedItem.value.id,
    userId: 1,
    reservedTime: convertToLocalTimeString(selectedTime.value),
    reservedDate: formattedDate,
    info: plan.name,
    deposit: plan.price,
    status: "결제중",
  };

  const response = await useApi("/payments/temp", {
    method: "POST",
    body: tempRequest,
  });

  const orderId = response.data.orderId;

  document
    .getElementById("payment-button")
    ?.addEventListener("click", async () => {
      await requestPayment(orderId,'reservation');
    });
};

const selectItem = async (item) => {
  showReservation.value = false;
  selectedDate.value = null;
  selectedTime.value = null;

  const response = await useApi(`/properties/${item.id}`);
  selectedItem.value = response.data;
  await nextTick();
  drawDetailMap(selectedItem.value);
};

function drawDetailMap(property) {
  if (!detailMap.value || !property) return;
  const { latitude, longitude } = property;
  const position = new kakao.maps.LatLng(latitude, longitude);

  const map = new kakao.maps.Map(detailMap.value, {
    center: position,
    level: 3,
  });

  new kakao.maps.Marker({
    map,
    position,
  });
}

async function drawListMap(propertyList) {
  if (!defaultMap.value || !propertyList?.length) return;

  const map = await useKakaoMap(defaultMap.value, 37.5665, 126.978, 5);
  if (!map) {
    console.error('지도 초기화 실패');
    return;
  }

  const bounds = new window.kakao.maps.LatLngBounds();

  propertyList.forEach((item) => {
    const { latitude, longitude } = item;
    if (!latitude || !longitude) return;

    const position = new window.kakao.maps.LatLng(latitude, longitude);
    new window.kakao.maps.Marker({ map, position });
    bounds.extend(position);
  });

  map.setBounds(bounds);
}

const isAllowedDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return target >= today;
};

const reservedTimes = ref([]); //예약 시간들

//날짜 값이 변경되면 백엔드에서 해당 날짜 값의 예약 시간들을 가져와야함
watch(selectedDate, async (val) => {});

// 현재 시간 기준으로
// 과거 시간은 선택이 안되도록 하기 위한 함수
const isTimeDisabled = (timeStr) => {
  if (!selectedDate.value) return true;

  const today = new Date();
  const selected = new Date(selectedDate.value);
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  const time24 = parseKoreanTimeTo24Hour(timeStr); // "09:00"

  // 오늘 이전이면 전부 비활성화
  if (selected < today) return true;

  // 오늘인 경우, 현재 시각 이전 시간은 비활성화
  if (selected.getTime() === today.getTime()) {
    const now = new Date();
    const [hour, minute] = time24.split(":").map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hour, minute, 0, 0);
    if (selectedTime <= now) return true;
  }
  // 예약된 시간과 일치하면 비활성화
  return reservedTimes.value.includes(time24);
};

//뒤로가기
const goBack = async () => {
  showReservation.value = false;
  selectedItem.value = null;
  await nextTick();
  drawListMap(properties.value);
};

watch(selectedItem, async (val) => {
  if (!val) {
    await nextTick();
    drawListMap(properties.value);
  }
});

// 예약된 시간들
const fetchAvailableTimes = async () => {
  selectedTime.value = null;
  // 날짜 포맷: YYYY-MM-DD
  const formattedDate = formatDateToYYYYMMDD(selectedDate.value);
  try {
    const res = await useApi(`/reservations/times`, {
      method: "GET",
      params: {
        propertyId: selectedItem.value.id,
        reservedDate: formattedDate,
      },
    });
    reservedTimes.value = (res.data || []).map((t) =>
      t.reservedTime.slice(0, 5)
    );
  } catch (error) {
    console.error("예약 시간 목록을 불러오는데 실패했습니다:", error);
    reservedTimes.value = [];
  }
};

onMounted(async () => {
  
  await nextTick();
  const response = await useApi("/properties");
  properties.value = response.data;
  drawListMap(properties.value);
});

const isHovered = ref(false)
const isFavorite = computed(() => selectedItem.value?.isFavorite ?? false)

const toastMessage = ref('');
const toastVisible = ref(false);

function showToast(msg) {
  toastMessage.value = msg
  toastVisible.value = true
}
const toggleFavorite = async (item) => {
  if (!auth.isLoggedIn) {
    loginDialogStore.open()
    return
  }

  const original = item.isFavorite
  item.isFavorite = !item.isFavorite

  try {
    await useApi('/favorites', {
      method: item.isFavorite ? 'POST' : 'DELETE',
      body: { propertyId: item.id }
    })

    showToast(item.isFavorite ? '즐겨찾기 추가됨' : '즐겨찾기 삭제됨')

    if (selectedItem.value?.id === item.id) {
      selectedItem.value.isFavorite = item.isFavorite
      selectedItem.value = { ...selectedItem.value }
    }

    const index = properties.value.findIndex(p => p.id === item.id)
    if (index !== -1) {
      properties.value[index].isFavorite = item.isFavorite
      properties.value[index] = { ...properties.value[index] }
    }

  } catch (e) {
    item.isFavorite = original
    showToast('에러 발생')
  }
}

const showDialog = ref(false);


</script>

<template>
  <v-container fluid  class="pa-0 overflow-x-hidden overflow-y-hidden">
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
          <v-col
            cols="12"
            v-for="item in properties"
            :key="item.id"
            class="mb-4"
          >
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
                <v-row class="mb-2">
                  <v-col cols="12">
                    <div class="d-flex flex-wrap gap-2">
                      <v-chip
                        v-for="(tag, index) in item.tags"
                        :key="index"
                        color="deep-orange"
                        text-color="white"
                        variant="elevated"
                        size="small"
                      >
                        #{{ tag.name }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
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
                  <v-btn
                    icon
                    variant="text"
                    class="favorite-icon"
                    @mouseenter="isHovered = true"
                    @mouseleave="isHovered = false"
                    :color="item.isFavorite ? 'red' : 'grey'"
                    @click.stop="toggleFavorite(item)"
                  >
                    <v-icon :color="isFavorite ? 'red' : (isHovered ? 'red' : 'red')">{{ item.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                  </v-btn>
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
              <v-row>
                <v-col class="mx-auto text-center">
                  <v-btn class="mr-2" color="info" variant="outlined">1:1 문의하기</v-btn>
                  <v-btn color="danger" variant="outlined" @click="showDialog = true">신고하기</v-btn>
                  <v-btn
                      icon
                      class="favorite-btn"
                      color="transparent"
                      variant="outlined"
                      @mouseenter="isHovered = true"
                      @mouseleave="isHovered = false"
                      @click="toggleFavorite(selectedItem)"
                    >
                      <v-icon
                        :color="isFavorite ? 'red' : (isHovered ? 'red' : 'red')"
                        transition="scale-transition"
                      >
                        {{ isFavorite || isHovered ? 'mdi-heart' : 'mdi-heart-outline' }}
                      </v-icon>
                    </v-btn>
                </v-col>
              </v-row>
              <v-row class="mb-2" align="start">
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
                    <v-col cols="3" sm="3" v-if="selectedItem.detail.lot">
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
                    <div
                      v-html="selectedItem.detail.content"
                      class="px-3 text-left"
                    ></div>
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
                          class="mb-0"
                          v-model="selectedDate"
                          :model-value="selectedDate"
                          :allowed-dates="isAllowedDate"
                          @update:modelValue="fetchAvailableTimes"
                          type="date"
                        />
                      </v-col>
                      <v-col>
                        <h4 class="text-subtitle-2 font-weight-medium mb-2">
                          시간 선택
                        </h4>
                        <div class="d-flex flex-wrap gap-2 mb-4">
                          <v-btn
                            v-for="time in rawTimeOptions"
                            :key="time.value"
                            :disabled="isTimeDisabled(time.label)"
                            @click="selectedTime = time.value"
                            :color="selectedTime === time.value ? 'deep-orange' : 'grey lighten-1'"
                          >
                            {{ time.label }}
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
  <ReportPopup v-model="showDialog" @submit="handleSubmit"></ReportPopup>
  <Toast v-model="toastVisible" :message="toastMessage"  :duration="1000" />
</template>

<style scoped>
.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}
div .v-picker-title{
  margin-bottom:0;
}
.favorite-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: transparent;
  transition: background-color 0.2s ease;
}
</style>
