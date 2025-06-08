<script setup>
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'submit']);

const dialog = ref(props.modelValue);
const reportReasons = [
  "광고/도배/스팸 게시물",
  "거짓 또는 허위 매물 정보",
  "비정상 가격(시세와 동떨어진 가격)",
  "욕설/비방/혐오/불법성",
  "개인정보 노출/사기 의심",
  "기타"
];
const selectedReason = ref(null);
const message = ref('');
const toastVisible = ref(false);

watch(() => props.modelValue, (val) => (dialog.value = val));
watch(dialog, (val) => emit('update:modelValue', val));

const closeDialog = () => {
  dialog.value = false;
  selectedReason.value = '';
  message.value = '';
};

const handleSend = () => {
  if (!selectedReason.value) {
    alert('신고 종류를 선택해주세요.');
    return;
  }
  if (!message.value.trim()) {
    alert('신고 사유를 입력해주세요.');
    return;
  }

  emit('submit', {
    reason: selectedReason.value,
    message: message.value,
  });

  closeDialog();
  toastVisible.value = true;
};


</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h6">매물 신고하기</div>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-divider />
      <v-card-text class="mt-4">
        <v-select
          v-model="selectedReason"
          :items="reportReasons"
          variant="outlined"
          density="comfortable"
          label="신고 종류"
          required
        ></v-select>
        <v-textarea
          v-model="message"
          label="신고 사유 (자세히 작성)"
          rows="4"
          variant="outlined"
          placeholder="예시: 허위 가격, 중복 매물, 부적절한 내용 등"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="closeDialog">취소</v-btn>
        <v-btn color="error" variant="flat" @click="handleSend">신고</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <Toast v-model="toastVisible" message="신고가 접수되었습니다." :duration="2000" />
</template>
