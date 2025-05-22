<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <v-card class="pa-6" max-width="600" elevation="4">
      <v-card-title class="text-h5 font-weight-bold text-center mb-4">
        회원가입
      </v-card-title>

      <v-form v-model="valid" class="d-flex flex-column gap-4">
        <v-text-field
          v-model="form.name"
          label="이름"
          variant="outlined"
          :rules="[rules.required]"
        />

        <v-text-field
          v-model="form.email"
          label="이메일"
          variant="outlined"
          type="email"
          :rules="[rules.required, rules.email]"
        />

        <v-text-field
          v-model="form.phone"
          label="전화번호"
          variant="outlined"
          type="tel"
          :rules="[rules.required, rules.phone]"
        />

        <v-text-field
          v-model="form.password"
          label="비밀번호"
          type="password"
          variant="outlined"
          :rules="[rules.required, rules.min(6)]"
        />

        <v-text-field
          v-model="form.confirmPassword"
          label="비밀번호 확인"
          type="password"
          variant="outlined"
          :rules="[rules.required, rules.matchPassword]"
        />

        <v-btn
          color="primary"
          size="large"
          block
          class="mt-4"
          :disabled="!valid"
          @click="submit"
        >
          가입하기
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
const valid = ref(false)
const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  required: v => !!v || '필수 입력 항목입니다.',
  email: v => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다.',
  phone: v => /^\d{10,11}$/.test(v) || '숫자만 입력해 주세요.',
  min: min => v => v?.length >= min || `${min}자 이상 입력하세요.`,
  matchPassword: v => v === form.value.password || '비밀번호가 일치하지 않습니다.'
}

const submit = async () => {
  if (!valid.value) return
  alert(JSON.stringify(form.value, null, 2))

  const response = await useApi("/auth/signup", {
    method: "POST",
    body: {
    name: form.value.name,
    email:form.value.email,
    phone: form.value.phone,
    password: form.value.password
    }
  })
  if (response?.accessToken) {
    localStorage.setItem("access_token", response.accessToken);
    authStore.setToken(response.accessToken);
    authStore.setUser(response.user);
    // ✅ 3. 메인 화면 또는 대시보드 이동
    router.push("/")
  } else {
    // 실패 시 알림 또는 예외 처리
    alert("회원가입에 실패했습니다. 다시 시도해주세요.")
  }
}

</script>

<style scoped>
.v-card {
  width: 100%;
  max-width: 600px;
}
</style>
