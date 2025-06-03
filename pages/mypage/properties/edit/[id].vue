<template>
  <MypageLayoutWrapper>
    <v-container style="max-width: 800px">
      <h2 class="text-h5 font-weight-bold mb-6">매물 수정</h2>
      <v-form ref="form" v-model="valid">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="property.title"
              label="제목"
              :rules="[(v) => !!v || '제목은 필수입니다.']"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="property.propertyTypeId"
              :items="['전세', '월세', '단기']"
              label="거래 형태"
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="property.deposit"
              label="보증금 (만원)"
              type="number"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
            v-if="
              property.propertyType === '월세' ||
              property.propertyType === '단기'
            "
          >
            <v-text-field
              v-model="property.rentalFee"
              label="월세 (만원)"
              type="number"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="property.maintenanceFee"
              label="관리비 (만원)"
              type="number"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="property.category"
              :items="['오피스텔', '원룸', '투룸', '아파트', '주택']"
              label="건물 유형"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="7">
            <v-text-field
              v-model="property.address"
              label="주소"
              readonly
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" sm="3">
            <v-text-field
              v-model="property.postcode"
              label="우편번호"
              readonly
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" sm="2">
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
              v-model="property.addressDetail"
              label="상세 주소"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12">
            <v-textarea
              v-model="property.detail.content"
              label="상세 설명"
              variant="outlined"
              rows="4"
              density="compact"
              auto-grow
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12">
            <v-menu
              v-model="datePickerMenu"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  :model-value="availableDateFormatted"
                  label="입주 가능일"
                  readonly
                  variant="outlined"
                  density="compact"
                />
              </template>
              <v-date-picker
                v-model="property.availableDate"
                @update:modelValue="
                  (v) => {
                    datePickerMenu = false;
                    property.detail.availableDate = v;
                  }
                "
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row dense class="mb-4">
          <v-col cols="12">
            <label class="text-subtitle-1 font-weight-medium mb-2">옵션</label>
            <v-sheet elevation="0" class="pa-3 rounded-lg" color="#f9f9f9">
              <v-row dense>
                <v-col
                  v-for="item in optionItems"
                  :key="item.value"
                  cols="6"
                  sm="4"
                  md="3"
                >
                  <v-checkbox
                    v-model="property.detail[item.value]"
                    :label="item.label"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row dense class="mb-4">
          <v-col cols="12">
            <label class="text-subtitle-1 mb-2 d-block">태그</label>
            <v-text-field
              v-model="newTag"
              placeholder="태그를 입력 후 Enter"
              @keyup.enter="addTag"
              variant="outlined"
              density="compact"
              clearable
            />
            <div class="d-flex flex-wrap mt-2">
              <v-chip
                v-for="tag in property.tags"
                :key="tag.id"
                class="me-2 mb-2"
                color="primary"
                label
                closable
                @click:close="removeTag(tag)"
              >
                #{{ tag.name }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
        <v-row dense class="mb-4">
          <v-col cols="12">
            <label class="text-subtitle-1 mb-2 d-block">대표 이미지</label>
            <v-file-input
              v-model="thumbnailFile"
              accept="image/*"
              label="대표 이미지 업로드"
              variant="outlined"
              density="compact"
              show-size
              @update:modelValue="onThumbnailChange"
            />

            <div
              style="
                position: relative;
                width: 100%;
                max-width: 300px;
                height: 180px;
                margin-top: 12px;
                border-radius: 8px;
                overflow: hidden;
                background-color: #f2f2f2;
              "
            >
              <v-img
                v-if="thumbnailPreview"
                :src="thumbnailPreview"
                width="100%"
                height="100%"
                cover
              />

              <v-btn
                v-if="thumbnailPreview"
                icon="mdi-close"
                size="x-small"
                color="red"
                variant="flat"
                @click="removeThumbnail"
                style="position: absolute; top: 6px; right: 6px; z-index: 2"
              />
            </div>
          </v-col>
        </v-row>

        <v-row dense class="mb-4">
          <v-col cols="12">
            <label class="text-subtitle-1 mb-2 d-block">추가 이미지</label>
            <v-file-input
              multiple
              accept="image/*"
              label="추가 이미지 업로드"
              variant="outlined"
              density="compact"
              show-size
              @update:modelValue="onImagesChange"
            />

            <v-row dense class="mt-3" style="min-height: 160px">
              <v-col
                v-for="(src, i) in imagePreviews"
                :key="i"
                cols="4"
                class="d-flex justify-center align-center"
                style="position: relative"
              >
                <img
                  :src="src"
                  style="
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 6px;
                  "
                />
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  color="red"
                  variant="flat"
                  @click="removeImage(i, 'new')"
                  style="position: absolute; top: 6px; right: 6px; z-index: 2"
                />
              </v-col>
              <v-col
                v-for="(url, idx) in property.imageUrls"
                :key="`existing-${idx}`"
                cols="4"
                class="d-flex justify-center align-center"
                style="position: relative"
              >
                <img
                  :src="url"
                  style="
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 6px;
                  "
                />
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  color="red"
                  variant="flat"
                  @click="removeImage(idx, 'existing')"
                  style="position: absolute; top: 6px; right: 6px; z-index: 2"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="3">
            <v-btn color="primary" size="large" block @click="submitEdit">
              매물 수정
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              variant="outlined"
              color="error"
              size="large"
              block
              @click="goBack"
            >
              취소
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              variant="outlined"
              color="success"
              size="large"
              block
              @click="resetForm"
            >
              초기화
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <Toast v-model="toastVisible" :message=message :color="color" :duration="2000" />
  </MypageLayoutWrapper>
</template>

<script setup>
const route = useRoute();
const propertyId = route.params.id;
const newTag = ref("");
const optionItems = [
  { label: "욕조", value: "hasBath" },
  { label: "엘리베이터", value: "hasElevator" },
  { label: "침대", value: "hasBed" },
  { label: "주차장", value: "hasParking" },
  { label: "히터", value: "hasHeating" },
  { label: "에어컨", value: "hasCooling" },
  { label: "전자레인지", value: "hasMicrowave" },
  { label: "가스레인지", value: "hasBurner" },
  { label: "냉장고", value: "hasFridge" },
  { label: "신발장", value: "hasShoeCloset" },
  { label: "TV", value: "hasTv" },
  { label: "옷장", value: "hasCloset" },
  { label: "식탁", value: "hasDiningTable" },
  { label: "선반", value: "hasTableItem" },
  { label: "세탁기", value: "hasWasher" },
  { label: "인덕션", value: "hasInduction" },
  { label: "반려동물 가능", value: "hasPet" },
];
const message = ref(null);
const color = ref(null);
const toastVisible = ref(false);
const property = ref({
  title: "",
  propertyType: "",
  deposit: null,
  rentalFee: null,
  maintenanceFee: null,
  category: "",
  address: "",
  postcode: "",
  addressDetail: "",
  detail: {
    content: "",
    availableDate: null,
    hasBath: false,
    hasElevator: false,
    hasBed: false,
    hasParking: false,
    hasHeating: false,
    hasCooling: false,
    hasMicrowave: false,
    hasBurner: false,
    hasFridge: false,
    hasShoe_closet: false,
    hasTv: false,
    hasCloset: false,
    hasDining_table: false,
    hasTable_item: false,
    hasWasher: false,
    hasInduction: false,
    hasPet: false,
  },
  tags: [],
});
const datePickerMenu = ref(false);
const model = ref(null);
const originalResponse = ref(null);

const resetForm = () => {
  if (!originalResponse.value) return;

  property.value = JSON.parse(JSON.stringify(originalResponse.value));
  model.value = property.value.tags;

  thumbnailFile.value = null;
  thumbnailPreview.value = property.value.thumbnailUrl || "";
  imageFiles.value = [];
  imagePreviews.value = [];
  removedImageUrls.value = [];
  newTag.value = "";
};

const clearTags = () => {
  if (!originalResponse.value) return;
  property.value.tags = JSON.parse(JSON.stringify(originalResponse.value.tags));
};

const submitEdit = async () => {
  if (!isModified.value) {
    message.value = '수정된 내용이 없음'
    color.value = 'info';
    toastVisible.value = true;
    return;
  }

  await useApi(`/my/properties/${propertyId}`, {
    method: "PUT",
    body: property.value,
  });
  alert("수정 완료");
  navigateTo("/mypage/properties");
};

const goBack = () => {
  navigateTo("/mypage/properties");
};

const addTag = () => {
  const tagText = newTag.value.trim();
  if (tagText && !property.value.tags.some((tag) => tag.name === tagText)) {
    // 새 태그는 id 없이 name만 가진 객체로 추가
    property.value.tags.push({ name: tagText });
  }
  newTag.value = "";
};

const removeTag = (tag) => {
  property.value.tags = property.value.tags.filter((t) => t.name !== tag.name);
};

// 이미지
const thumbnailFile = ref(null);
const thumbnailPreview = ref("");
const imageFiles = ref([]); // 새로 업로드한 이미지 파일 객체
const imagePreviews = ref([]); // 새로 업로드한 이미지 미리보기 URL
const removedImageUrls = ref([]); // 기존 이미지 중 삭제 대상인 URL 목록
// 대표 이미지 변경
const onThumbnailChange = (file) => {
  if (file) {
    thumbnailFile.value = file;
    thumbnailPreview.value = URL.createObjectURL(file);
    // property.thumbnailUrl를 즉시 대체
    property.value.thumbnailUrl = null;
  }
};

// 대표 이미지 삭제
const removeThumbnail = () => {
  thumbnailFile.value = null;
  thumbnailPreview.value = "";
  property.value.thumbnailUrl = null;
};

// 추가 이미지 변경
const onImagesChange = (files) => {
  const fileList = Array.from(files);
  fileList.forEach((file) => {
    imageFiles.value.push(file);
    imagePreviews.value.push(URL.createObjectURL(file));
  });
};

// 추가 이미지 미리보기 삭제
const removeImage = (index, type) => {
  if (type === "existing") {
    removedImageUrls.value.push(property.value.imageUrls[index]);
    property.value.imageUrls.splice(index, 1);
  } else if (type === "new") {
    imageFiles.value.splice(index, 1);
    imagePreviews.value.splice(index, 1);
  }
};
const availableDateFormatted = computed(() => {
  if (!(property.value.detail.availableDate instanceof Date))
    return property.value.detail.availableDate;
  const d = property.value.detail.availableDate;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
});

const isModified = computed(() => {
  if (!originalResponse.value) return false;

  const current = JSON.stringify(property.value);
  const original = JSON.stringify(originalResponse.value);
  return current !== original;
});

const { address, openPostcode, latitude, longitude, zonecode } = usePostcode();

onMounted(async () => {
  const res = await useApi(`/properties/${propertyId}`);

  // 옵션 필드 초기화 보완
  optionItems.forEach((item) => {
    if (!(item.value in res.data.detail)) {
      res.data.detail[item.value] = false;
    }
  });

  property.value = res.data;

  model.value = res.data.tags;
  thumbnailPreview.value = property.value.thumbnailUrl;
  originalResponse.value = JSON.parse(JSON.stringify(res.data));
});

onBeforeRouteLeave((to, from, next) => {
  if (isModified.value) {
    const answer = window.confirm("수정된 내용이 있습니다. 이동하면 변경 사항이 사라집니다. 이동하시겠습니까?");
    if (answer) {
      next(); // 이동 허용
    } else {
      next(false); // 이동 차단
    }
  } else {
    next(); // 수정된 내용 없으면 이동 허용
  }
});
watch([address, zonecode, latitude, longitude], () => {
  if (!property.value) return;

  property.value.address = address.value;
  property.value.postcode = zonecode.value;
  property.value.latitude = latitude.value;
  property.value.longitude = longitude.value;
});
</script>
