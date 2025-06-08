<template>
  <MypageLayoutWrapper>
    <v-card variant="outlined" class="pa-6 mb-4 inquiry-detail-card">
      <div class="d-flex justify-space-between align-center mb-6">
        <!-- 왼쪽 : 목록으로 돌아가기 -->
        <v-btn variant="text" @click="goBack" class="px-0">
          <v-icon start>mdi-arrow-left</v-icon>
          목록으로 돌아가기
        </v-btn>

        <!-- 오른쪽 : 수정/삭제 버튼 (PROCESSING일 때만 노출) -->
        <div v-if="inquiry.status === 'PROCESSING'" class="d-flex align-center">
          <v-btn color="primary" class="mr-2" @click="goToEdit">수정하기</v-btn>
          <v-btn color="error" @click="confirmDialogVisible = true">삭제하기</v-btn>
        </div>
      </div>

      <div class="text-h5 font-weight-bold mb-3">문의 상세</div>
      <!-- 문의 제목 -->
      <div class="mb-4">
        <div class="text-subtitle-1 font-weight-medium mb-1">제목</div>
        <div class="text-body-1">{{ inquiry.title }}</div>
      </div>

      <!-- 상태 & 작성일 -->
      <v-row class="mb-4">
        <v-col cols="6">
          <div class="text-subtitle-1 font-weight-medium mb-1">상태</div>
          <v-chip
            :color="statusColor(inquiry.status)"
            variant="outlined"
            size="small"
          >
            {{ statusLabel(inquiry.status) }}
          </v-chip>
        </v-col>
        <v-col cols="6">
          <div class="text-subtitle-1 font-weight-medium mb-1">작성일</div>
          <div>{{ formatDate(inquiry.createdAt) }}</div>
        </v-col>
      </v-row>

      <!-- 문의 내용 -->
      <div class="mb-6">
        <div class="text-subtitle-1 font-weight-medium mb-1">문의 내용</div>
        <div class="text-body-1" style="white-space: pre-line">
          {{ inquiry.content }}
        </div>
      </div>

      <!-- 답변 내용 (있을 경우) -->
      <div v-if="inquiry.answer" class="mb-6">
        <div class="text-subtitle-1 font-weight-medium mb-1">답변 내용</div>
        <template></template>
        <v-alert type="success" border="start" variant="tonal">
          <div class="text-body-1" style="white-space: pre-line">
            {{ inquiry.answer }}
          </div>
        </v-alert>
      </div>
    </v-card>
<v-dialog v-model="confirmDialogVisible" max-width="400">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">문의 삭제 확인</v-card-title>
    <v-card-text>정말로 삭제하시겠습니까? 삭제 후 복구가 불가능합니다.</v-card-text>

    <v-card-actions class="justify-end">
      <v-btn variant="text" color="primary" @click="confirmDialogVisible = false">
        취소
      </v-btn>
      <v-btn color="error" @click="confirmDeleteInquiry">
        삭제
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
    <Toast
      v-model="toastVisible"
      :message="message"
      :color="color"
      :duration="2000"
    />
  </MypageLayoutWrapper>
</template>

<script setup>

const route = useRoute();
const router = useRouter();
const inquiryId = route.params.id;

const inquiry = ref({
  id: null,
  title: "",
  status: "PROCESSING", // or 'DONE'
  createdAt: "",
  content: "",
  answer: "", // 답변 없으면 빈 문자열
});

const toastVisible = ref(false);
const message = ref("");
const color = ref("");

// 임시 데이터 (실제 구현 시 API 호출로 대체)
onMounted(async () => {
  try {
    const response = await useApi(`/questions/${inquiryId}`); // 서버에 상세 조회 요청
    inquiry.value = response.data;
  } catch (error) {
    message.value = "문의 상세 정보를 불러오는데 실패했습니다.";
    color.value = "error";
    toastVisible.value = true;
  }
});

const goBack = () => {
  router.push("/mypage/inquiries");
};

const statusLabel = (status) => {
  switch (status) {
    case "PROCESSING":
      return "처리중";
    case "DONE":
      return "답변완료";
    default:
      return "알 수 없음";
  }
};

// 상태별 v-chip 컬러
const statusColor = (status) => {
  switch (status) {
    case "PROCESSING":
      return "orange";
    case "DONE":
      return "green";
    default:
      return "grey";
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

// tnwjd
const goToEdit = () => {
  router.push(`/mypage/inquiries/${inquiry.value.id}/edit`);
};

const confirmDialogVisible = ref(false);

const confirmDeleteInquiry = async () => {
  try {
    await useApi(`/questions/${inquiry.value.id}`, {
      method: "DELETE",
    });

    message.value = "문의가 삭제되었습니다.";
    color.value = "success";
    toastVisible.value = true;

    confirmDialogVisible.value = false; // dialog 닫기

    setTimeout(() => {
      router.push("/mypage/inquiries");
    }, 1000);

  } catch (error) {
    message.value = "문의 삭제에 실패했습니다.";
    color.value = "error";
    toastVisible.value = true;
    confirmDialogVisible.value = false; // dialog 닫기
  }
};
</script>

<style scoped>
.inquiry-detail-card {
  min-height: 700px;
}
</style>
