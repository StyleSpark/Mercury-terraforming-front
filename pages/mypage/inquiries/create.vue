<template>
  <MypageLayoutWrapper>
    <v-card variant="outlined" class="pa-6 mb-4 inquiry-create-card">
      <div class="text-h5 font-weight-bold mb-6">문의사항 작성</div>

      <v-form ref="form" v-model="valid" @submit.prevent="submitInquiry">
        <!-- 제목 -->
        <v-text-field
          v-model="request.title"
          label="제목"
          :rules="[(v) => !!v || '제목은 필수입니다.']"
          variant="outlined"
          density="compact"
          class="mb-4"
        />

        <!-- 카테고리 선택 -->
        <v-select
          v-model="request.category"
          :items="categories"
          item-title="label"
          item-value="value"
          label="카테고리"
          :rules="[(v) => !!v || '카테고리는 필수입니다.']"
          variant="outlined"
          density="compact"
          class="mb-4"
        />

        <!-- 문의 내용 -->
        <v-textarea
          v-model="request.content"
          label="문의 내용"
          :rules="[(v) => !!v || '문의 내용은 필수입니다.']"
          variant="outlined"
          density="compact"
          rows="6"
          auto-grow
          class="mb-6"
        />

        <!-- 버튼 영역 -->
        <v-row>
          <v-col cols="6" md="3">
            <v-btn color="primary" size="large" block @click="submitInquiry">
              제출하기
            </v-btn>
          </v-col>
          <v-col cols="6" md="3">
            <v-btn variant="outlined" size="large" block color="error" @click="goBack">
              취소
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <Toast v-model="toastVisible" :message="message" :color="color" :duration="2000" />
  </MypageLayoutWrapper>
</template>

<script setup>
import { ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const request = ref({
  title: '',
  category: '',
  content: '',
});

// 카테고리 리스트
const categories = [
  { label: '결제 문의', value: '결제 문의' },
  { label: '서비스 문의', value: '서비스 문의' },
  { label: '환불 문의', value: '환불 문의' },
  { label: '기타', value: '기타' },
];

const valid = ref(false);
const toastVisible = ref(false);
const message = ref('');
const color = ref('');

const submitInquiry = async () => {
  if (!request.value.title || !request.value.category || !request.value.content) {
    message.value = '제목, 카테고리, 내용을 모두 입력해주세요.';
    color.value = 'error';
    toastVisible.value = true;
    return;
  }

  // API 호출 시 반드시 toRaw 사용
  await useApi('/questions', { method: 'POST', body: toRaw(request.value) });

  message.value = '문의가 정상적으로 등록되었습니다.';
  color.value = 'success';
  toastVisible.value = true;

  setTimeout(() => {
    router.push('/mypage/inquiries');
  }, 1000);
};

const goBack = () => {
  router.push('/mypage/inquiries');
};
</script>

<style scoped>
.inquiry-create-card {
  min-height: 500px;
}
</style>
