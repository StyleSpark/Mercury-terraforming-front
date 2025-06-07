<template>
  <MypageLayoutWrapper>
    <v-card variant="outlined" class="pa-6 mb-4 inquiry-detail-card">
      <div class="d-flex justify-space-between align-center mb-6">
        <div class="text-h5 font-weight-bold">문의 상세</div>
        <v-btn color="primary" @click="goBack">목록으로 돌아가기</v-btn>
      </div>

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

    <Toast
      v-model="toastVisible"
      :message="message"
      :color="color"
      :duration="2000"
    />
  </MypageLayoutWrapper>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

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
</script>

<style scoped>
.inquiry-detail-card {
  min-height: 700px;
}
</style>
