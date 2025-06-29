<script setup>
const auth = useAuthStore();
const selectedItem = ref(null);
const detailMap = ref(null);
const defaultMap = ref(null);

const comments = ref([]);
const newComment = ref("");

const agents = ref([]);
const searchKeyword = ref("");
const agentList = ref({});
const agentMapCenter = ref([37.5665, 126.978]);
const agentMapLevel = ref(5);
const agentMapBounds = ref({
  swLat: 0,
  swLng: 0,
  neLat: 0,
  neLng: 0,
});

const selectItem = async (item) => {
  const [agentRes, propertiesRes, reviewsRes] = await Promise.all([
    useApi(`/agents/${item.id}`, { method: "GET" }),
    useApi(`/agents/${item.id}/properties`, {
      method: "GET",
      params: { page: 1, size: 10 },
    }),
    useApi(`/agents/${item.id}/reviews`, {
      method: "GET",
      params: { page: 1, size: 5 },
    }),
  ]);

  selectedItem.value = {
    ...agentRes.data,
    properties: propertiesRes.data?.properties || [],
    reviews: reviewsRes.data?.agentReviews || [],
  };

  await nextTick();
  drawDetailMap();
};

const drawDetailMap = async () => {
  if (!detailMap.value || !selectedItem.value) return;

  const { latitude, longitude } = selectedItem.value;
  const map = await useKakaoMap(detailMap.value, latitude, longitude, 3);

  new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(latitude, longitude),
    map,
  });
};

const lastMapCenter = ref([37.5665, 126.978]);
const lastMapLevel = ref(5);
const overlays = []; // 전역 또는 setup 밖에 선언

function removeAllOverlays() {
  overlays.forEach((o) => o.setMap(null));
  overlays.length = 0;
}

const drawDefaultMap = async (
  center = agentMapCenter.value,
  level = agentMapLevel.value
) => {
  if (!defaultMap.value) return;

  const [lat, lng] = center;
  const map = await useKakaoMap(defaultMap.value, lat, lng, level);
  window.agentMap = map;

  const updateAgentsByBounds = async () => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const center = map.getCenter();
    lastMapCenter.value = [center.getLat(), center.getLng()];
    lastMapLevel.value = map.getLevel();

    agentMapBounds.value = {
      swLat: sw.getLat(),
      swLng: sw.getLng(),
      neLat: ne.getLat(),
      neLng: ne.getLng(),
    };

    // 📍 서버로부터 해당 bounds 내 에이전트 요청
    const response = await useApi("/agents/markers", {
      method: "GET",
      params: {
        ...agentMapBounds.value,
        keyword: searchKeyword.value || null,
      },
    });

    currentPage.value = 1;
    totalPages.value = 1;
    agentList.value = [];
    await fetchAgentList();

    agents.value = response.data || [];

    // Supercluster 인덱스 갱신
    useSupercluster(agents.value);

    const zoom = Math.max(1, 18 - map.getLevel()); // tile zoom 계산
    const bbox = [sw.getLng(), sw.getLat(), ne.getLng(), ne.getLat()];
    const clusters = getClusters(bbox, zoom);

    // 기존 마커/오버레이 제거
    removeAllOverlays();

    // 클러스터 및 마커 렌더링
    clusters.forEach((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const isCluster = cluster.properties.cluster;
      const count = cluster.properties.point_count || 1;

      const el = document.createElement("div");
      el.className = "custom-cluster";
      el.innerText = count;

      el.style.cssText = `
    width: 40px;
    height: 40px;
    background: ${
      isCluster ? "rgba(255, 102, 102, 0.85)" : "rgba(100, 181, 246, 0.9)"
    };
    border-radius: 50%;
    color: white;
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    pointer-events: auto;
    z-index: 9999;
  `;

      el.addEventListener("click", () => {
        if (isCluster) {
          const targetZoom = Math.min(
            index.getClusterExpansionZoom(cluster.id),
            18
          );
          map.setLevel(18 - targetZoom, {
            anchor: new kakao.maps.LatLng(lat, lng),
          });
        } else {
          const agentId = cluster.properties.agentId; 
          const target = agents.value.find((a) => a.id === agentId);
          if (target) selectItem(target);
        }
      });

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(lat, lng),
        content: el,
        yAnchor: 0.5,
      });

      overlay.setMap(map);
      overlays.push(overlay);
    });
  };

  kakao.maps.event.addListener(map, "idle", updateAgentsByBounds);
  kakao.maps.event.trigger(map, "idle");
};

const rating = ref(0); // 평점
const selectedPropertyId = ref(null); // 선택한 매물 id, 필요시 선택 UI 추가

const submitComment = async () => {
  if (!newComment.value.trim() || rating.value === 0) {
    alert("리뷰 내용과 평점을 모두 입력해주세요.");
    return;
  }

  const agentId = selectedItem.value?.id;
  if (!agentId) return;
  try {
    const payload = {
      content: newComment.value.trim(),
      rate: rating.value,
      propertyId:
        selectedPropertyId.value ||
        selectedItem.value.properties?.[0]?.id ||
        null,
    };
    const res = await useApi(`/agents/${agentId}/reviews`, {
      method: "POST",
      body: payload,
    });

    // 서버 등록 후 댓글 다시 불러오기
    const reviewsRes = await useApi(`/agents/${agentId}/reviews`, {
      method: "GET",
      params: { page: 1, size: 5 },
    });
    selectedItem.value.reviews = reviewsRes.data.agentReviews || [];

    // 초기화
    newComment.value = "";
    rating.value = 0;
    selectedPropertyId.value = null;
  } catch (e) {
    console.error(e);
    alert("리뷰 등록에 실패했습니다.");
  }
};

watch(selectedItem, async (val) => {
  if (val === null) {
    await nextTick();
    drawDefaultMap(lastMapCenter.value, lastMapLevel.value);
  }
});

onMounted(async () => {
  if (!selectedItem.value) {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        agentMapCenter.value = [lat, lng];
      } catch (error) {
        console.warn("📍 위치 접근 실패, 기본 위치로 설정:", error);
      }
    }

    await nextTick();
    drawDefaultMap();
  }
});

const tab = ref("properties");
const tabs = [
  { text: "매물 목록", value: "properties", icon: "mdi-home-city" },
  { text: "중개인 리뷰", value: "reviews", icon: "mdi-star" },
];

const editingReviewId = ref(null);
const editingContent = ref("");

const startEditReview = (review) => {
  editingReviewId.value = review.reviewId;
  editingContent.value = review.content;
};

const cancelEditReview = () => {
  editingReviewId.value = null;
  editingContent.value = "";
};

const confirmEditReview = async () => {
  try {
    await useApi(
      `/agents/${selectedItem.value.id}/reviews/${editingReviewId.value}`,
      {
        method: "PUT",
        body: {
          content: editingContent.value,
        },
      }
    );

    const res = await useApi(`/agents/${selectedItem.value.id}/reviews`, {
      method: "GET",
      params: { page: 1, size: 5 },
    });

    selectedItem.value.reviews = res.data.agentReviews;
    editingReviewId.value = null;
    editingContent.value = "";
  } catch (e) {
    alert("리뷰 수정 실패");
  }
};

const deleteReview = async (reviewId) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  await useApi(`/agents/${selectedItem.value.id}/reviews/${reviewId}`, {
    method: "DELETE",
  });

  const res = await useApi(`/agents/${selectedItem.value.id}/reviews`, {
    method: "GET",
    params: { page: 1, size: 5 },
  });

  selectedItem.value.reviews = res.data.agentReviews;
};

//인피니티 스크롤
const currentPage = ref(1);
const totalPages = ref(1);
const isFetching = ref(false);

const fetchAgentList = async () => {
  if (isFetching.value || currentPage.value > totalPages.value) return;
  isFetching.value = true;

  const response = await useApi("/agents/withinBounds", {
    method: "GET",
    params: {
      ...agentMapBounds.value,
      keyword: searchKeyword.value || null,
      page: currentPage.value,
      size: 20,
    },
  });

  const agentsFromApi = response.data?.agents ?? [];
  const total = response.data?.total ?? 1;

  if (currentPage.value === 1) {
    agentList.value = agentsFromApi;
  } else {
    agentList.value.push(...agentsFromApi);
  }

  totalPages.value = total;
  currentPage.value++;
  isFetching.value = false;
};

const agentListContainer = ref(null);

const onScrollAgentList = () => {
  const el = agentListContainer.value;
  if (!el) return;

  const scrollBottom = el.scrollTop + el.clientHeight;
  if (scrollBottom + 200 >= el.scrollHeight) {
    fetchAgentList(); // 하단 근접 시 다음 페이지 요청
  }
};
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <!-- 왼쪽 매물 리스트 -->
      <v-col cols="12" md="4" class="pa-4">
        <div
          ref="agentListContainer"
          @scroll.passive="onScrollAgentList"
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
              v-for="item in agentList"
              :key="item.id"
              class="mb-4"
            >
              <v-card
                class="d-flex hover-card"
                @click="selectItem(item)"
                style="cursor: pointer; min-height: 120px"
              >
                <div style="width: 40%; height: 250px; display: flex">
                  <!-- 썸네일 이미지 -->
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
                    {{ item.brand }}
                  </h3>

                  <div class="d-flex align-center mb-1">
                    <v-icon color="#FFB300" size="16" class="mr-1"
                      >mdi-star</v-icon
                    >
                    <span class="text-body-2">
                      {{ item.reviewAvg?.toFixed(1) ?? "0.0" }}
                    </span>
                    <span class="text-caption text-grey ml-2">
                      ({{ item.reviewCount ?? 0 }}건)
                    </span>
                  </div>

                  <p
                    class="text-body-2 font-weight-bold mb-1"
                    style="color: #ff8339"
                  >
                    {{ item.location }}
                  </p>

                  <div class="d-flex align-center mt-2">
                    <v-avatar size="24" class="mr-2" />
                    <span class="text-caption text-grey" v-if="item.name">
                      {{ item.name }}
                    </span>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- 오른쪽 상세 보기 -->
      <v-col
        cols="12"
        md="8"
        class="pa-0"
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
            <!-- 
            <v-img
              :src="selectedItem.profileUrl"
              alt="thumbnail"
              cover
              height="500"
              style="
                width: 100%;
                object-fit: cover;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              "
            /> -->
            <v-container class="py-8">
              <v-row justify="center" class="text-center mb-8">
                <v-col cols="12" md="8">
                  <h2 class="text-h5 font-weight-bold mb-4">
                    {{ selectedItem.brand }}
                  </h2>
                  <p
                    class="text-body-1 font-weight-bold mb-2"
                    style="color: #ff8339"
                  >
                    {{ selectedItem.location }}
                  </p>
                  <p class="text-body-1">{{ selectedItem.description }}</p>
                </v-col>
              </v-row>

              <v-row class="mb-8" align="start">
                <!-- 옵션 -->
                <v-col cols="6">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4">
                    추가 설명
                  </h3>
                  <v-row class="text-center">
                    <div v-html="textWithTag" class="px-3 text-left"></div>
                  </v-row>
                </v-col>

                <!-- 지도 -->
                <v-col cols="6" class="text-center">
                  <h3 class="text-subtitle-1 font-weight-bold mb-4 text-left">
                    위치
                  </h3>
                  <div
                    ref="detailMap"
                    style="width: 500px; height: 400px"
                  ></div>
                  <div>
                    <v-icon color="#FF8339" size="16">mdi-map-marker</v-icon>
                    {{ selectedItem.address }}
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
                      <v-tabs-window-item
                        :value="item.value"
                        class="pa-4"
                        :transition="false"
                        :reverse-transition="false"
                      >
                        <!-- 매물 목록 탭 -->
                        <template v-if="item.value === 'properties'">
                          <v-row dense>
                            <v-col
                              v-for="(
                                property, index
                              ) in selectedItem.properties"
                              :key="index"
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-card>
                                <!-- <v-img
                                  :src="property.thumbnailUrl"
                                  height="160px"
                                  cover
                                  class="rounded-t"
                                /> -->
                                <v-card-title
                                  class="text-subtitle-1 font-weight-bold"
                                >
                                  {{ property.title }}
                                </v-card-title>
                                <v-card-subtitle class="text-body-2 text-grey">
                                  {{ property.address }}
                                </v-card-subtitle>
                                <v-card-text>
                                  <div class="text-caption">
                                    {{ property.propertyTypeId }}
                                    {{ property.deposit }} /
                                    {{ property.maintenanceFee }}
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </template>

                        <!-- 리뷰 탭 -->
                        <template v-else-if="item.value === 'reviews'">
                          <h3 class="text-h6 font-weight-bold mb-4">
                            리뷰 작성
                          </h3>

                          <!-- 평점 입력 -->
                          <v-row dense class="mb-2">
                            <v-col cols="12" class="d-flex align-center">
                              <span class="mr-2">평점:</span>
                              <v-rating
                                v-model="rating"
                                length="5"
                                color="amber"
                                background-color="grey lighten-2"
                                half-increments
                              />
                              <span class="ml-2">{{ rating }}</span>
                            </v-col>
                          </v-row>

                          <!-- 리뷰 작성 입력창 -->
                          <v-row dense class="mb-4">
                            <v-col cols="10">
                              <v-text-field
                                v-model="newComment"
                                placeholder="리뷰 내용을 입력하세요"
                                dense
                                variant="outlined"
                                density="compact"
                                hide-details
                                @keydown.enter="submitComment"
                              />
                            </v-col>
                            <v-col cols="2" class="d-flex align-center">
                              <v-btn
                                color="#FF8339"
                                @click="submitComment"
                                block
                                >등록</v-btn
                              >
                            </v-col>
                          </v-row>

                          <!-- 리뷰 목록 -->
                          <h3 class="text-h6 font-weight-bold mb-4">
                            작성된 리뷰
                          </h3>
                          <v-list>
                            <v-list-item
                              v-for="(review, index) in selectedItem.reviews"
                              :key="index"
                              class="pa-0 mb-4"
                            >
                              <v-row no-gutters>
                                <!-- 아바타 -->
                                <v-col cols="auto" class="mr-3">
                                  <v-avatar size="40">
                                    <!-- <img :src="review.profile" alt="profile" /> -->
                                  </v-avatar>
                                </v-col>

                                <!-- 본문 -->
                                <v-col>
                                  <div class="d-flex align-center mb-1">
                                    <span class="font-weight-bold mr-2">{{
                                      review.name
                                    }}</span>
                                    <v-icon color="amber" size="16"
                                      >mdi-star</v-icon
                                    >
                                    <span class="ml-1 text-caption">{{
                                      Number(review.rate).toFixed(1)
                                    }}</span>
                                    <span class="mx-2">·</span>
                                    <span class="text-caption grey--text">
                                      {{
                                        new Date(
                                          review.createdAt
                                        ).toLocaleDateString()
                                      }}
                                    </span>

                                    <!-- 본인이 작성한 경우 수정/삭제 버튼 표시 -->
                                    <v-spacer />
                                    <template
                                      v-if="
                                        auth.user?.id === review.id &&
                                        !editingReviewId
                                      "
                                    >
                                      <v-btn
                                        icon
                                        size="small"
                                        @click="startEditReview(review, index)"
                                      >
                                        <v-icon size="16">mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn
                                        icon
                                        size="small"
                                        @click="deleteReview(review.reviewId)"
                                      >
                                        <v-icon size="16" color="red"
                                          >mdi-delete</v-icon
                                        >
                                      </v-btn>
                                    </template>
                                  </div>

                                  <!-- 본문 or 수정 필드 -->
                                  <div
                                    v-if="editingReviewId === review.reviewId"
                                  >
                                    <v-row dense class="align-center mb-2">
                                      <!-- 수정 입력 필드 -->
                                      <v-col>
                                        <v-text-field
                                          v-model="editingContent"
                                          dense
                                          density="compact"
                                          hide-details
                                          variant="outlined"
                                          @keydown.enter="confirmEditReview"
                                        />
                                      </v-col>

                                      <!-- 저장 버튼 -->
                                      <v-col
                                        cols="1"
                                        class="d-flex justify-end"
                                      >
                                        <v-btn
                                          small
                                          color="primary"
                                          @click="confirmEditReview"
                                          block
                                          >저장</v-btn
                                        >
                                      </v-col>

                                      <!-- 취소 버튼 -->
                                      <v-col
                                        cols="1"
                                        class="d-flex justify-start"
                                      >
                                        <v-btn
                                          small
                                          @click="cancelEditReview"
                                          block
                                          >취소</v-btn
                                        >
                                      </v-col>
                                    </v-row>
                                  </div>
                                  <div v-else class="text-body-2">
                                    {{ review.content }}
                                  </div>
                                </v-col>
                              </v-row>
                            </v-list-item>
                          </v-list>
                        </template>
                      </v-tabs-window-item>
                    </template>
                  </v-tabs>
                </v-col>
              </v-row>
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
