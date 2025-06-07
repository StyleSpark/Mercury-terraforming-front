<template>
  <MypageLayoutWrapper>
    <v-container fluid class="pa-4">
      <div class="text-h4 mb-3">매물 관리</div>

      <!-- 매물 카드 -->
      <v-row dense>
        <v-col
          v-for="p in paginatedProperties"
          :key="p.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="rounded-lg elevation-2" height="100%">
            <v-img
              :src="p.thumbnailUrl"
              height="180"
              cover
              class="rounded-t-lg"
            />
            <v-card-text>
              <v-chip>{{p.propertyTypeId}}</v-chip>
              <div class="text-subtitle-1 font-weight-bold">{{ p.title }}</div>
              <div class="text-body-2 text-grey">{{ p.address }}</div>
              <div v-if="p.propertyTypeId != '전세'" class="mt-2 text-body-1 font-weight-bold">
                {{ p.price }}만원
              </div>
              <div v-if="p.propertyTypeId == '전세'" class="mt-2 text-body-1 font-weight-bold">
                보증: {{ p.deposit }}만원 / 관리비: {{ p.maintenanceFee }} 만원
              </div>
            </v-card-text>
            <v-card-actions class="px-4 pb-4 d-flex flex-wrap gap-2">
              <v-btn size="small" color="primary" @click="editProperty(p)"
                >수정</v-btn
              >
              <v-btn size="small" color="error" @click="confirmDelete(p.id)"
                >삭제</v-btn
              >
              <v-btn size="small" @click="toggleStatus(p)">
                {{ p.status === "ACTIVE" ? "활성화" : "거래완료" }}
              </v-btn>
              <v-btn
                size="small"
                color="secondary"
                @click="openReservation(p.id)"
                >예약 보기</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- 페이지네이션 -->
      <v-row justify="center" class="mt-6">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="5"
          rounded
        />
      </v-row>

      <!-- 삭제 확인 Dialog -->
      <v-dialog v-model="isDialogOpen" max-width="400">
        <v-card>
          <v-card-title class="text-h6">매물을 삭제하시겠습니까?</v-card-title>
          <v-card-text>삭제된 매물은 복구할 수 없습니다.</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" @click="isDialogOpen = false">취소</v-btn>
            <v-btn color="error" variant="flat" @click="deleteProperty"
              >삭제</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <Toast v-model="toastVisible" message="삭제 완료!" :duration="2000" />
  </MypageLayoutWrapper>
</template>

<script setup>
const router = useRouter();
const properties = ref([]);
const toastVisible = ref(false);
const page = ref(1);
const itemsPerPage = 4;
const totalPages = computed(() =>
  Math.ceil(properties.value.length / itemsPerPage)
);
const paginatedProperties = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return properties.value.slice(start, end);
});

// 삭제 Dialog 관련 상태
const isDialogOpen = ref(false);
const deleteTargetId = ref(null);

const confirmDelete = (id) => {
  deleteTargetId.value = id;
  isDialogOpen.value = true;
};

const deleteProperty = async () => {
  // 실제 삭제 API 호출
  await useApi(`/properties/${deleteTargetId.value}`, {
    method: "DELETE",
  });

  // 목록에서 제거
  properties.value = properties.value.filter(
    (p) => p.id !== deleteTargetId.value
  );

  // Dialog 닫기
  isDialogOpen.value = false;
  toastVisible.value =true;
};

onMounted(async () => {
  const res = await useApi("/auth/properties");
  properties.value = res.data;
});

// 수정 페이지로 이동
const editProperty = (p) => {
  router.push(`/mypage/properties/edit/${p.id}`);
};

const toggleStatus = (p) => {
  // 상태 토글 (ACTIVE ↔ COMPLETE)
};

const openReservation = (id) => {
  // 예약 보기 로직
};
</script>
