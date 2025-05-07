<template>
  <v-container class="py-10" style="max-width: 600px">
    <v-card elevation="2">
      <v-card-title class="text-h5">문의하기</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="formValid">
          <v-text-field
            v-model="form.title"
            label="제목"
            :rules="[v => !!v || '제목을 입력하세요']"
            required
          />
          <v-textarea
            v-model="form.content"
            label="내용"
            :rules="[v => !!v || '내용을 입력하세요']"
            rows="6"
            auto-grow
            required
          />
          <v-text-field
            v-model="form.email"
            label="이메일 (선택)"
            type="email"
            :rules="[v => !v || /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다.']"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="!formValid" @click="submitInquiry" color="primary">제출</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
const formRef = ref()
const formValid = ref(false)

const form = ref({
  title: '',
  content: '',
  email: ''
})

const submitInquiry = () => {
  if (!formRef.value?.validate()) return

  // TODO: 실제 API 호출 예시
  console.log('문의 전송됨:', form.value)

  // 폼 초기화
  form.value = {
    title: '',
    content: '',
    email: ''
  }
  formRef.value.resetValidation()
  alert('문의가 성공적으로 제출되었습니다.')
}
</script>
