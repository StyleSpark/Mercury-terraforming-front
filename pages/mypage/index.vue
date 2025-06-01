<script setup>
// ✅ 초기 유저 상태 저장
const auth = useAuthStore();

const originalUser = reactive({ ...auth.user });
const user = reactive({
  ...auth.user,
});

const form = ref(null);
const password = ref("");
const imageInput = ref(null);
const uploadedImageFile = ref(null);

// 소셜 로그인 여부
const isOauthUser = computed(() => {
  return auth.user.provider == null;
});

// 이미지 선택 및 미리보기
const triggerImageInput = () => imageInput.value?.click();
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploadedImageFile.value = file;
  const previewUrl = URL.createObjectURL(file);
  user.profileImage = previewUrl;
};

// 사용자 정보 수정 여부 판단
const isModified = computed(() => {
  const changed =
    user.name !== originalUser.name ||
    user.email !== originalUser.email ||
    user.nickname !== originalUser.nickname ||
    user.phone !== originalUser.phone ||
    uploadedImageFile.value !== null;
  return changed;
});

// 정보 수정 요청
const updateUserInfo = async () => {
  const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify({
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      phone: user.phone,
      password: password.value
    })], { type: "application/json" }));

  if (!isOauthUser.value) {
    formData.append("password", password.value);
  }

  if (uploadedImageFile.value) {
    formData.append("file", uploadedImageFile.value);
  }

  const updated = await useApi("/auth/my-page", {
    method: "PUT",
    body: formData,
  });

  if (updated) {
    alert("정보가 수정되었습니다.");
    if (updated.profileImage) {
      user.profileImage = updated.profileImage;
    }
    auth.setUser({ ...user });
    Object.assign(originalUser, user);
    uploadedImageFile.value = null;
    password.value = "";
  }
};

// 정보 초기화
const resetUserInfo = () => {
  Object.assign(user, originalUser);
  uploadedImageFile.value = null;
  password.value = "";
};
const nicknameChanged = computed(() => {
  return user.nickname !== originalUser.nickname;
});

const isNicknameChecked = ref(false);
const checkNickname = async () => {
  if (!user.nickname) return;

  try {
    const res = await useApi('/auth/nickname-check', {
      method: 'POST',
      body: { nickname: user.nickname }
    });

    if (res?.available) {
      isNicknameChecked.value = true;
      nicknameChanged.value = false;
      alert('사용 가능한 닉네임입니다.');
    } else {
      isNicknameChecked.value = false;
      alert('이미 사용 중인 닉네임입니다.');
    }
  } catch (err) {
    console.error('닉네임 중복 확인 실패:', err);
    alert('중복 확인 중 오류가 발생했습니다.');
  }
};

onMounted(async()=> {
  const res = await useApi("/auth/my-page");
  const userData = res.data
  user.temperature = userData.temperature;
  user.ticket = userData.ticket;
  user.phone = userData.phone;
  user.nickname = userData.nickname;
  user.profileImage = userData.profile;
})
</script>

<template>
  <MypageLayoutWrapper>
    <v-card variant="outlined" class="pa-6">
      <div class="text-h5 mb-5">내 정보</div>
      <div class="d-flex flex-column align-center">
        <!-- 프로필 아바타 (수정 뱃지 포함) -->
        <div class="position-relative" style="width: 96px; height: 96px">
          <v-avatar
            size="96"
            color="info"
            @click="triggerImageInput"
            style="cursor: pointer"
          >
            <template v-if="user?.profileImage">
              <img :src="user.profileImage" alt="프로필" />
            </template>
            <template v-else>
              <v-icon size="64" icon="mdi-account-circle" />
            </template>
          </v-avatar>
          <!-- 수정 뱃지 -->
          <v-btn
            icon
            size="small"
            class="edit-badge"
            @click.stop="triggerImageInput"
            variant="flat"
            color="white"
          >
            <v-icon size="18" color="primary">mdi-camera</v-icon>
          </v-btn>
        </div>
        <input
          type="file"
          ref="imageInput"
          @change="handleImageChange"
          accept="image/*"
          class="d-none"
        />

        <!-- 사용자 기본 정보 -->
        <h3 class="mt-3 d-flex align-center">
          {{ user.nickname || user.name }}
        </h3>
        <p class="text-subtitle-2 mb-1">{{ user.email }}</p>
        <p class="text-caption text-grey-darken-1 mb-4">
          신뢰 온도: {{ user.temperature || 36.5 }}℃           
          <v-chip
            class="ms-2"
            color="primary"
            variant="flat"
            size="x-small"
            label
          >
            🎟 등록권 {{ user.ticket || 0 }}장
          </v-chip>
        </p>
        


        <!-- 사용자 정보 수정 폼 -->
        <v-form class="mt-2 w-50" @submit.prevent="updateUserInfo" ref="form">
          <v-text-field
            v-model="user.email"
            variant="outlined"
            label="이메일"
            dense
            density="compact"

          />
          <v-text-field
            v-model="user.name"
            variant="outlined"
            label="이름"
            dense
            density="compact"

          />
          <v-text-field
            v-model="user.nickname"
            label="닉네임"
            class="mb-1"
            variant="outlined"
            dense
            density="compact"
            :error="!isNicknameChecked && nicknameChanged"
            :rules="[(v) => !!v || '닉네임을 입력하세요.']"
            @input="isNicknameChecked = false"
          >
            <!-- ✅ append 버튼 슬롯 -->
           <template v-slot:append>
              <v-btn
                variant="flat"
                color="primary"
                class="ml-1"
                :disabled="!nicknameChanged || !user.nickname"
                @click="checkNickname"
              >
                중복확인
              </v-btn>
            </template>
          </v-text-field>

          <v-text-field
            v-model="user.phone"
            variant="outlined"
            label="전화번호"
            dense
            density="compact"

          />
          <v-text-field
            v-if="isOauthUser"
            v-model="password"
            type="password"
            variant="outlined"
            label="비밀번호 확인"
            dense
            density="compact"

            :rules="[(v) => !!v || '비밀번호를 입력해주세요.']"
          />

          <v-row class="mt-4" dense>
            <v-col cols="6">
              <v-btn
                type="submit"
                color="info"
                variant="flat"
                class="w-100"
                :disabled="!isModified"
              >
                정보 수정
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                type="button"
                color="grey"
                variant="outlined"
                class="w-100"
                @click="resetUserInfo"
              >
                초기화
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
  </MypageLayoutWrapper>
</template>

<style scoped>
.d-none {
  display: none;
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(25%, 25%);
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
</style>
