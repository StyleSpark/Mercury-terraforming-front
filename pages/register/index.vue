<script setup>
const form = ref();
const valid = ref(false);

const title = ref("");
const detailAddress = ref("");
const content = ref("");
const thumbnail = ref([]);
const options = ref([]);
const images = ref([]);
const tags = ref([]);
const newTag = ref("");
// 거래 및 건물 타입 관련
const type = ref("전세");
const buildingType = ref(null);
const deposit = ref(null);
const rent = ref(null);
const maintenanceFee = ref(null);
const isMonthly = computed(
  () => type.value === "월세" || type.value === "단기"
);
const floorType = ref(null);
const floor = ref(null);
const totalFloor = ref(null);
const thumbnailPreview = ref("");
const imagePreviews = ref([]);
const datePickerMenu = ref(false);
const availableDateRaw = ref(null);

const roomSize = ref(""); // 사용자 입력값 (문자열로 관리)
const roomSizeUnit = ref("m²"); // 선택된 단위

const convertedRoomSize = computed(() => {
  const size = parseFloat(roomSize.value);
  if (isNaN(size)) return "";

  return roomSizeUnit.value === "m²"
    ? `${(size / 3.3058).toFixed(1)} 평`
    : `${(size * 3.3058).toFixed(1)} m²`;
});


//선택 옵션
const optionItems = [
  { label: "욕조", value: "HasBath" },
  { label: "엘리베이터", value: "HasElevator" },
  { label: "침대", value: "HasBed" },
  { label: "주차장", value: "HasParking" },
  { label: "히터", value: "HasHeating" },
  { label: "에어컨", value: "HasCooling" },
  { label: "전자레인지", value: "HasMicrowave" },
  { label: "가스레인지", value: "HasBurner" },
  { label: "냉장고", value: "HasFridge" },
  { label: "신발장", value: "HasShoeCloset" },
  { label: "TV", value: "HasTv" },
  { label: "옷장", value: "HasCloset" },
  { label: "식탁", value: "HasDiningTable" },
  { label: "선반", value: "HasTableItem" },
  { label: "세탁기", value: "HasWasher" },
  { label: "인덕션", value: "HasInduction" },
  { label: "반려동물 가능", value: "HasPet" },
];

const onThumbnailChange = (file) => {
  if (!file) return;
  thumbnail.value = [file];

  const reader = new FileReader();
  reader.onload = (e) => {
    thumbnailPreview.value = e.target?.result;
  };
  reader.readAsDataURL(file);
};

const onImagesChange = (newFiles) => {
  if (!newFiles || newFiles.length === 0) return;

  for (const file of newFiles) {
    images.value.push(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target?.result);
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = (index) => {
  images.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
};
// 주소 관련 (composable 사용)
const { address, openPostcode, latitude, longitude, zonecode } = usePostcode();

// 체크한 option 값들 boolean으로 변환
const buildOptionsMap = (selectedOptions) => {
  return {
    HasBath: selectedOptions.includes("HasBath"),
    HasElevator: selectedOptions.includes("HasElevator"),
    HasBed: selectedOptions.includes("HasBed"),
    HasParking: selectedOptions.includes("HasParking"),
    HasHeating: selectedOptions.includes("HasHeating"),
    HasCooling: selectedOptions.includes("HasCooling"),
    HasMicrowave: selectedOptions.includes("HasMicrowave"),
    HasBurner: selectedOptions.includes("HasBurner"),
    HasFridge: selectedOptions.includes("HasFridge"),
    HasShoeCloset: selectedOptions.includes("HasShoeCloset"),
    HasTv: selectedOptions.includes("HasTv"),
    HasCloset: selectedOptions.includes("HasCloset"),
    HasDiningTable: selectedOptions.includes("HasDiningTable"),
    HasTableItem: selectedOptions.includes("HasTableItem"),
    HasWasher: selectedOptions.includes("HasWasher"),
    HasInduction: selectedOptions.includes("HasInduction"),
    HasPet: selectedOptions.includes("HasPet"),
  };
};

const availableDateFormatted = computed(() => {
  if (!(availableDateRaw.value instanceof Date)) return availableDateRaw.value;
  const d = availableDateRaw.value;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
});

const handleDepositInput = (value) => {
  const numeric = value.replace(/[^0-9]/g, '');
  deposit.value = numeric;
}

const handleRentInput = (value) => {
  const numeric = value.replace(/[^0-9]/g, '');
  rent.value = numeric;
}

const handleMaintenanceFeeInput = (value) => {
  const numeric = value.replace(/[^0-9]/g, '');
  maintenanceFee.value = numeric;
}

const submitForm = async () => {
  if (!valid.value) return;

  const formData = new FormData();

  // 1. request 객체 구성
  const requestPayload = {
    title: title.value,
    category: buildingType.value,
    deposit: Number(deposit.value),
    rentalFee: isMonthly.value ? Number(rent.value) : null,
    maintenanceFee: Number(maintenanceFee.value),
    address: address.value,
    postcode: zonecode.value,
    addressDetail: detailAddress.value,
    latitude: latitude.value,
    longitude: longitude.value,
    propertyTypeId: type.value,
    tags: tags.value,
    roomSize: roomSizeAsM2.value,
    detail: {
      content: content.value,
      availableDate: availableDateFormatted.value,
      ...buildOptionsMap(options.value),
    },
  };

  formData.append(
    "request",
    new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
  );

  // 2. 썸네일 첨부
  if (thumbnail.value?.length > 0) {
    formData.append("thumbnail", thumbnail.value[0]); // 단일 파일만 첨부
  }

  // 3. 추가 이미지 첨부
  if (images.value?.length > 0) {
    for (const file of images.value) {
      formData.append("images", file); // 다중 업로드
    }
  }
  // 4. API 호출
  try {
    const result = await useApi('/properties', {
      method: 'POST',
      body: formData,
    });
    console.log('등록 완료:', result);
     navigateTo('/');
  } catch (e) {
    console.error('등록 실패:', e);
  }
};




const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag);
    newTag.value = "";
  }
};

const removeTag = (tag) => {
  tags.value = tags.value.filter((t) => t !== tag);
};

const roomSizeAsM2 = computed(() => {
  const size = parseFloat(roomSize.value);
  if (isNaN(size)) return null;

  return roomSizeUnit.value === "평"
    ? parseFloat((size * 3.3058).toFixed(2))
    : size;
});
</script>

<template>
  <v-container style="max-width: 800px">
    <h2 class="text-h5 font-weight-bold mb-6">매물 등록</h2>

    <v-form ref="form" v-model="valid">
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="title"
            label="제목"
            :rules="[(v) => !!v || '제목은 필수입니다.']"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="type"
            :items="['전세', '월세', '단기']"
            label="거래 형태"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="deposit"
            label="보증금 (만원)"
            type="text"
            density="compact"
            variant="outlined"
            inputmode="numeric"
            clearable
            @update:modelValue="handleDepositInput"
          />
        </v-col>

        <v-col cols="12" sm="6" v-if="isMonthly">
          <v-text-field
            v-model="rent"
            label="월세 (만원)"
            type="text"
            variant="outlined"
            density="compact"
            clearable
            @update:modelValue="handleRentInput"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="maintenanceFee"
            label="관리비 (만원)"
            type="text"
            variant="outlined"
            density="compact"
            clearable
            @update:modelValue="handleMaintenanceFeeInput"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="buildingType"
            :items="['오피스텔', '원룸', '투룸', '아파트', '주택']"
            label="건물 유형"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>
      </v-row>
<v-row dense>
  <!-- 실제 입력 -->
  <v-col cols="6" sm="4">
    <v-text-field
      v-model="roomSize"
      label="방 크기"
      type="text"
      inputmode="decimal"
      variant="outlined"
      density="compact"
      clearable
    />
  </v-col>

  <!-- 단위 선택 -->
  <v-col cols="4" sm="3">
    <v-select
      v-model="roomSizeUnit"
      :items="['m²', '평']"
      label="단위"
      variant="outlined"
      density="compact"
      hide-details
      clearable
    />
  </v-col>

  <!-- 변환된 값 readonly 출력 -->
  <v-col cols="12" sm="5">
    <v-text-field
      :model-value="convertedRoomSize"
      :label="`변환된 크기 `"
      readonly
      variant="outlined"
      density="compact"
      hide-details
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
            hide-details
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="zonecode"
            label="우편번호"
            readonly
            variant="outlined"
            density="compact"
            hide-details
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
            v-model="detailAddress"
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
            v-model="content"
            label="상세 설명"
            variant="outlined"
            rows="4"
            density="compact"
            auto-grow
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="4">
          <v-select
            v-model="floorType"
            :items="['1층', '저층', '중층', '고층', '옥탑']"
            label="층 타입"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            v-model="floor"
            label="현재 층수"
            type="number"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            v-model="totalFloor"
            label="총 층수"
            type="number"
            variant="outlined"
            density="compact"
            clearable
          />
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
                  v-model="options"
                  :label="item.label"
                  :value="item.value"
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
          <label class="text-subtitle-1 font-weight-medium mb-2 d-block"
            >태그</label
          >
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
              v-for="tag in tags"
              :key="tag"
              class="me-2 mb-2"
              color="primary"
              label
              closable
              @click:close="removeTag(tag)"
            >
              #{{ tag }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-menu
            v-model="datePickerMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="availableDateFormatted"
                label="입주 가능일"
                readonly
                v-bind="props"
                variant="outlined"
                density="compact"
              />
            </template>
            <v-date-picker
              v-model="availableDateRaw"
              @update:modelValue="datePickerMenu = false"
            />
          </v-menu>
        </v-col>
      </v-row>
<v-row dense class="mb-4">
  <v-col cols="12">
    <label class="text-subtitle-1 mb-2 d-block">대표 이미지</label>
    <v-file-input
      v-model="thumbnail"
      accept="image/*"
      label="대표 이미지 업로드"
      variant="outlined"
      density="compact"
      show-size
      @update:modelValue="onThumbnailChange"
    />

    <!-- 미리보기 컨테이너 -->
    <div
      style="position: relative; width: 100%; max-width: 300px; height: 180px; margin-top: 12px; border-radius: 8px; overflow: hidden; background-color: #f2f2f2;"
    >
      <!-- 이미지가 있을 경우 표시 -->
      <v-img
        v-if="thumbnailPreview"
        :src="thumbnailPreview"
        width="100%"
        height="100%"
        cover
      />

      <!-- 삭제 버튼 -->
      <v-btn
        v-if="thumbnailPreview"
        icon="mdi-close"
        size="x-small"
        color="red"
        variant="tonal"
        @click="() => {
          thumbnail = [];
          thumbnailPreview = '';
        }"
        style="position: absolute; top: 6px; right: 6px; z-index: 2;"
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

    <!-- 미리보기 영역 높이 확보 및 X 버튼 우상단 배치 -->
    <v-row dense class="mt-3" style="min-height: 160px;">
      <v-col
        v-for="(src, i) in imagePreviews"
        :key="i"
        cols="4"
        class="d-flex justify-center align-center"
        style="position: relative;"
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
          variant="tonal"
          @click="removeImage(i)"
          style="position: absolute; top: 6px; right: 6px; z-index: 2;"
        />
      </v-col>
    </v-row>
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
          >
            매물 등록
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

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
