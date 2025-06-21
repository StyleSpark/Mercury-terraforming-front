<template>
  <MypageLayoutWrapper>
    <v-container style="max-width: 800px">
      <h2 class="text-h5 font-weight-bold mb-6">중개인 신청</h2>

      <v-form ref="form" v-model="valid">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="agentName"
              label="대표명"
              :rules="[rules.required]"
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="officeName"
              label="사무소명"
              :rules="[rules.required]"
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="jurirno"
              label="법인등록번호 (13자리 숫자)"
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="7">
            <v-text-field
              v-model="address"
              label="주소"
              readonly
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="zonecode"
              label="우편번호"
              readonly
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="2">
            <v-btn
              @click="openPostcode"
              height="40"
              color="primary"
              variant="flat"
              block
            >
              주소 검색
            </v-btn>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="addressDetail"
              label="상세 주소"
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>

        <!-- 숨겨진 위도, 경도 필드 -->
        <input type="hidden" v-model="latitude" />
        <input type="hidden" v-model="longitude" />

        <v-row dense class="mb-4">
          <v-col cols="12">
            <v-textarea
              v-model="bio"
              label="중개사 소개"
              rows="4"
              variant="outlined"
              density="compact"
              auto-grow
              :rules="[rules.required]"
            />
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12">
            <label class="text-subtitle-1 mb-2 d-block">대표 이미지</label>
            <v-file-input
              v-model="profileFile"
              accept="image/*"
              label="대표 이미지 업로드"
              variant="outlined"
              density="compact"
              show-size
              @update:modelValue="onProfileImageChange"
            />

            <!-- 미리보기 -->
            <div
              v-if="profilePreview"
              style="
                margin-top: 12px;
                border-radius: 8px;
                overflow: hidden;
                width: 100%;
                max-width: 300px;
                height: 180px;
                background: #f2f2f2;
              "
            >
              <v-img :src="profilePreview" height="100%" cover />
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12">
            <v-btn
              :disabled="!valid"
              color="primary"
              size="large"
              block
              @click="submitForm"
              :loading="loading"
            >
              중개인 신청
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <Toast
        v-model="toastVisible"
        :message="message"
        :color="color"
        :duration="2000"
      />
    </v-container>
  </MypageLayoutWrapper>
</template>

<script setup>
const form = ref({});

const addressDetail = ref("");
const officeName = ref("")
const agentName = ref("")
const bio = ref("");
const jurirno = ref("")
const valid = ref(false);
const loading = ref(false);
const toastVisible = ref(false);
const message = ref("");
const color = ref("success");
const profileFile = ref([]);
const profilePreview = ref("");

const { address, zonecode, latitude, longitude, openPostcode } = usePostcode();

const rules = {
  required: (v) => !!v || "필수 입력 항목입니다.",
};

const onProfileImageChange = (file) => {
  if (!file) return;
  profileFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    profilePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const submitForm = async () => {
  if (!valid.value) return;

  try {
    loading.value = true;

    const request = {
      agentName: agentName.value,
      officeName: officeName.value,
      jurirno: jurirno.value,
      addressDetail: addressDetail.value,
      bio:bio.value,
      profileUrl: "",
      address: address.value,
      latitude: latitude.value,
      longitude: longitude.value,
      userId: null,
    };

    const body = new FormData();
    body.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );

    if (profileFile.value) {
      body.append("profileImage", profileFile.value);
    }

    const res = await useApi("/agents/register", {
      method: "POST",
      body,
    });

    message.value = "중개인 신청이 완료되었습니다.";
    color.value = "success";
    toastVisible.value = true;
  } catch (err) {
    console.error(err);
    message.value = "신청 중 오류가 발생했습니다.";
    color.value = "error";
    toastVisible.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-text-field,
.v-select,
.v-textarea {
  border-radius: 12px;
}
.v-btn {
  border-radius: 12px;
}
</style>
