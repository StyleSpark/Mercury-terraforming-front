<template>
  <MypageLayoutWrapper>
    <v-container class="pa-4">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="text"
        class="mb-4"
        @click="goBack"
      >
        매물 목록으로
      </v-btn>

      <h2 class="text-h5 mb-4">매물 수정</h2>

      <v-form v-if="property">
        <v-row dense>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.title"
              label="제목"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-select
              v-model="property.category"
              label="카테고리"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.price"
              label="가격(만원)"
              type="number"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.deposit"
              label="보증금(만원)"
              type="number"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.rentalFee"
              label="월세(만원)"
              type="number"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.floorType"
              label="층 유형"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.floor"
              label="층"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.roomSize"
              label="방 크기"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.maintenanceFee"
              label="관리비(만원)"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.address"
              label="주소"
              variant="outlined"
              density="compact"
              readonly
            >
              <template #append>
                <v-btn
                  @click="openPostcode"
                  height="40"
                  color="primary"
                  variant="flat"
                  block
                >
                  주소 검색
                </v-btn>
              </template>
            </v-text-field></v-col
          >
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.addressDetail"
              label="상세 주소"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.postcode"
              label="우편번호"
              variant="outlined"
              density="compact"
              readonly
          /></v-col>

          <v-col cols="12" md="6"
            ><v-select
              v-model="property.propertyTypeId"
              label="매물 타입"
              variant="outlined"
              density="compact"
          /></v-col>
          <!-- 원룸,투룸 제외 -->
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.roomCount"
              label="방 개수"
              variant="outlined"
              density="compact"
          /></v-col>
        </v-row>
  <v-row dense class="mb-4">
    <v-col cols="12">
      <label class="text-subtitle-1 font-weight-medium mb-2 d-block">태그</label>
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
    :key="tag.name"
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
        <!-- 썸네일 및 추가 이미지 -->
        <!-- 대표 이미지 업로드 -->
        <v-file-input
          label="대표 이미지 변경"
          variant="outlined"
          accept="image/*"
          prepend-icon="mdi-image"
          density="compact"
          @update:modelValue="onThumbnailChange"
        />

        <div
          style="
            position: relative;
            width: 200px;
            height: 200px;
            border-radius: 10px;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 12px;
          "
        >
          <template v-if="thumbnailPreview || property.thumbnailUrl">
            <v-img
              :src="thumbnailPreview || property.thumbnailUrl"
              height="200"
              width="200"
              cover
              style="border-radius: 10px; position: absolute; top: 0; left: 0"
            />
            <v-btn
              icon
              size="x-small"
              color="error"
              @click="removeThumbnail"
              style="position: absolute; top: 8px; right: 8px; z-index: 2"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <span style="color: #aaa">썸네일 없음</span>
          </template>
        </div>

        <v-file-input
          label="추가 이미지 변경"
          variant="outlined"
          multiple
          accept="image/*"
          prepend-icon="mdi-image-multiple"
          density="compact"
          class="mt-5"
          @update:modelValue="onImagesChange"
        />

        <div style="min-height: 160px; margin-top: 12px">
          <v-row dense v-if="property.imageUrls.length || imagePreviews.length">
            <!-- 기존 이미지 출력 -->
            <v-col
              v-for="(url, idx) in property.imageUrls"
              :key="'existing-' + idx"
              cols="12"
              md="3"
              style="position: relative"
            >
              <div
                style="
                  position: relative;
                  width: 240px;
                  height: 135px;
                  border-radius: 10px;
                  overflow: hidden;
                  margin: 0 auto;
                "
              >
                <v-img
                  :src="url"
                  width="240"
                  height="135"
                  cover
                  style="object-fit: cover"
                />
                <v-btn
                  icon
                  size="x-small"
                  color="error"
                  @click="removeImage(idx, 'existing')"
                  style="position: absolute; top: 8px; right: 8px; z-index: 2"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-col>

            <!-- 새 이미지 출력 -->
            <v-col
              v-for="(url, idx) in imagePreviews"
              :key="'new-' + idx"
              cols="12"
              md="3"
              style="position: relative"
            >
              <div
                style="
                  position: relative;
                  width: 240px;
                  height: 135px;
                  border-radius: 10px;
                  overflow: hidden;
                  margin: 0 auto;
                "
              >
                <v-img
                  :src="url"
                  width="240"
                  height="135"
                  cover
                  style="object-fit: cover"
                />
                <v-btn
                  icon
                  size="x-small"
                  color="error"
                  @click="removeImage(idx, 'new')"
                  style="position: absolute; top: 8px; right: 8px; z-index: 2"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
        <!-- 상세 정보 -->
        <v-divider class="my-4" />
        <h3 class="text-subtitle-1">상세 정보</h3>
        <v-row dense>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.detail.content"
              label="설명"
              variant="outlined"
              density="compact"
          /></v-col>
          <v-col cols="12" md="6"
            ><v-text-field
              v-model="property.detail.availableDate"
              label="입주 가능일"
              variant="outlined"
              density="compact"
          /></v-col>
        </v-row>

        <v-row dense>
          <v-col
            v-for="(field, index) in checkboxFields"
            :key="index"
            cols="12"
            md="4"
          >
            <v-checkbox
              v-model="property.detail[field.model]"
              :label="field.label"
            />
          </v-col>
        </v-row>

        <!-- 버튼 -->
        <v-btn color="primary" class="mr-2" @click="submitEdit">저장</v-btn>
        <v-btn color="error" variant="outlined" @click="goBack">취소</v-btn>
      </v-form>
    </v-container>
  </MypageLayoutWrapper>
</template>

<script setup>
const route = useRoute();
const propertyId = route.params.id;
const newTag = ref('');
const property = ref(null);

onMounted(async () => {
  const res = await useApi(`/properties/${propertyId}`);
  property.value = res.data;
  model.value = res.data.tags
});

const submitEdit = async () => {
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
  if (
    tagText &&
    !property.value.tags.some(tag => tag.name === tagText)
  ) {
    // 새 태그는 id 없이 name만 가진 객체로 추가
    property.value.tags.push({ name: tagText });
  }
  newTag.value = '';
};

const removeTag = (tag) => {
  property.value.tags = property.value.tags.filter(t => t.name !== tag.name);
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
const { address, openPostcode, latitude, longitude, zonecode } = usePostcode();

watch([address, zonecode, latitude, longitude], () => {
  if (!property.value) return;

  property.value.address = address.value;
  property.value.postcode = zonecode.value;
  property.value.latitude = latitude.value;
  property.value.longitude = longitude.value;
});
</script>
