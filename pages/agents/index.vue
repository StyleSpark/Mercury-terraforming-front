
<script setup>
const selectedItem = ref(null)

const items = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `중개인 ${index + 1}`,
  price: `월세 ${50 + index * 5}만원`,
  location: '서울시 강남구',
  description: '강남구 주변으로 10년 넘게 집을 소개시켜드리고 있는 중개인 입니다.',
  thumbnail: 'https://images.unsplash.com/photo-1611602132416-da2045990f76?q=80&w=2574&auto=format&fit=crop',
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

const tab = shallowRef('tab-1')
  const tabs = [
    {
      icon: 'mdi-book-open-page-variant',
      text: 'Readme',
      value: 'tab-1',
    },
    {
      icon: 'mdi-handshake-outline',
      text: 'Code of Conduct',
      value: 'tab-2',
    },
  ]


</script>

<template>
  <v-container fluid class="pa-0">
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
                <p class="text-body-2 font-weight-bold mb-1" style="color: #FF8339;">{{ item.location }}</p>
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
      <v-col cols="12" md="8" class="pa-0" style="height: calc(100vh - 64px); overflow-y: auto;">
        <template v-if="selectedItem">
          <div style="position: relative;">
            <v-btn icon color="grey" class="ma-4" style="position: absolute; top: 0; left: 0; z-index: 10;" @click="selectedItem = null">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-img
                  :src="selectedItem.thumbnail"
                  alt="thumbnail"
                  cover
                  height="500"
                  style="width: 100%; object-fit: cover; border-top-left-radius: 4px; border-bottom-left-radius: 4px;"
                />
            <v-container class="py-8">
              <v-row justify="center" class="text-center mb-8">
                <v-col cols="12" md="8">
                  <h2 class="text-h5 font-weight-bold mb-4">{{ selectedItem.title }}</h2>
                  <p class="text-body-1 font-weight-bold mb-2" style="color: #FF8339;">{{ selectedItem.location }}</p>
                  <p class="text-body-1">{{ selectedItem.description }}</p>
                </v-col>
              </v-row>

              <v-row class="mb-8" align="start">
                <!-- 옵션 -->
                <v-col cols="6">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4">추가 설명</h3>
                  <v-row class="text-center">
                    <div v-html="textWithTag" class="px-3 text-left"></div>
                  </v-row>
                </v-col>

                <!-- 지도 -->
                <v-col cols="6" class="text-center">
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
                  <!-- tabs 영역 -->
                    <v-tabs
                      v-model="tab"
                      :items="tabs"
                      align-tabs="left"
                      color="black"
                      height="60"
                      slider-color="#f78166"
                    >
                      <template v-slot:tab="{ item }">
                        <v-tab
                          :prepend-icon="item.icon"
                          :text="item.text"
                          :value="item.value"
                          class="text-none"
                        ></v-tab>
                      </template>

                      <template v-slot:item="{ item }">
                        <v-tabs-window-item :value="item.value" class="pa-4">
                          <v-card
                            class="mx-auto"
                            max-width="344"
                          >
                            <v-img
                              height="200px"
                              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                              cover
                            ></v-img>

                            <v-card-title>
                              Top western road trips
                            </v-card-title>

                            <v-card-subtitle>
                              1,000 miles of wonder
                            </v-card-subtitle>
                          </v-card>
                        </v-tabs-window-item>
                      </template>
                    </v-tabs>
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
                        density="compact"
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
