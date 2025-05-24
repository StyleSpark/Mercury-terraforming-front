<script setup>
const props = defineProps({
  modelValue: Boolean,
})
  const items = ['Foo', 'Bar', 'Fizz', 'Buzz']
const emit = defineEmits(['update:modelValue', 'submit'])

const dialog = ref(props.modelValue)
const message = ref('')
const toastVisible = ref(false);

watch(() => props.modelValue, (val) => (dialog.value = val))
watch(dialog, (val) => emit('update:modelValue', val))

const closeDialog = () => {
  dialog.value = false
  message.value = ''
}

// 신고하기
const handleSend = () => {
  if (!message.value.trim()) {
    alert('내용을 입력해주세요.')
    return
  }

  closeDialog()
}
</script>
<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h6">신고하기</div>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-divider />
      <v-card-text class="mt-4">
          <v-select
            :items="items"
            variant="outlined"
            density="comfortable"
            label="category"
          ></v-select>
        <v-textarea
          v-model="message"
          label="메시지"
          rows="4"
          variant="outlined"
          placeholder="내용을 입력해주세요"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="closeDialog">취소</v-btn>
        <v-btn color="info" variant="flat" @click="handleSend">보내기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
   <Toast v-model="toastVisible" message="저장 완료!"  :duration="2000" />
</template>


