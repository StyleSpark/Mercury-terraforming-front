<script setup>
import { usePostcode } from '~/composables/usePostcode'

const form = ref()
const valid = ref(false)

const title = ref('')
const detailAddress = ref('')
const description = ref('')
const thumbnail = ref([]);
const options = ref([])
const images = ref([])
const tags = ref([])
const newTag = ref('')
// 거래 및 건물 타입 관련
const type = ref('전세')
const buildingType = ref(null)
const deposit = ref(null)
const rent = ref(null)
const maintenanceFee = ref(null)
const isMonthly = computed(() => type.value === '월세' || type.value === '단기')
const floorType = ref('')
const floor = ref(null)
const totalFloor = ref(null)
const thumbnailPreview = ref('')
const imagePreviews = ref([])

const onThumbnailChange = (file) => {
  if (!file) return
  thumbnail.value = [file]

  const reader = new FileReader()
  reader.onload = (e) => {
    thumbnailPreview.value = e.target?.result
  }
  reader.readAsDataURL(file)
}

const onImagesChange = (newFiles) => {
  if (!newFiles || newFiles.length === 0) {
    images.value = []
    imagePreviews.value = []
    return
  }

  images.value = [...newFiles]  // Vue에서 Proxy 객체 해소
  imagePreviews.value = []

  for (const file of newFiles) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target?.result)
    }
    reader.readAsDataURL(file)
  }
}


const removeImage = (index) => {
  images.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}
// 주소 관련 (composable 사용)
const {
  address,
  openPostcode,
  latitude,
  longitude,
  zonecode
} = usePostcode()

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
  status: 'ACTIVE',
  propertyTypeId: 1,
  tags: tags.value,
  detail: {
    description: description.value,
    options: options.value,
  }

}


  formData.append('request', new Blob(
    [JSON.stringify(requestPayload)],
    { type: 'application/json' }
  ));

  // 2. 썸네일 첨부
  if (thumbnail.value?.length > 0) {
    formData.append('thumbnail', thumbnail.value[0]); // 단일 파일만 첨부
  }

  // 3. 추가 이미지 첨부
  if (images.value?.length > 0) {
    for (const file of images.value) {
      formData.append('images', file); // 다중 업로드
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


const optionItems = [
  { label: '욕조', value: 'has_bath' },
  { label: '엘리베이터', value: 'has_elevator' },
  { label: '침대', value: 'has_bed' },
  { label: '주차장', value: 'has_parking' },
  { label: '히터', value: 'has_heating' },
  { label: '에어컨', value: 'has_cooling' },
  { label: '전자레인지', value: 'has_microwave' },
  { label: '가스레인지', value: 'has_burner' },
  { label: '냉장고', value: 'has_fridge' },
  { label: '신발장', value: 'has_shoe_closet' },
  { label: 'TV', value: 'has_tv' },
  { label: '옷장', value: 'has_closet' },
  { label: '식탁', value: 'has_dining_table' },
  { label: '선반', value: 'has_table_item' },
  { label: '세탁기', value: 'has_washer' },
  { label: '인덕션', value: 'has_induction' },
  { label: '반려동물 가능', value: 'has_pet' }
]

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  tags.value = tags.value.filter(t => t !== tag)
}
</script>

<template>
  <v-container style="max-width: 800px;">
    <h2 class="text-h5 font-weight-bold mb-6">매물 등록</h2>

<v-form ref="form" v-model="valid">
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-text-field
        v-model="title"
        label="제목"
        :rules="[v => !!v || '제목은 필수입니다.']"
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
        type="number"
        :rules="[v => !!v || '보증금은 필수입니다.']"
        variant="outlined"
        density="compact"
        clearable
      />
    </v-col>

    <v-col cols="12" sm="6" v-if="isMonthly">
      <v-text-field
        v-model="rent"
        label="월세 (만원)"
        type="number"
        variant="outlined"
        density="compact"
        clearable
      />
    </v-col>

    <v-col cols="12" sm="6">
      <v-text-field
        v-model="maintenanceFee"
        label="관리비 (만원)"
        type="number"
        variant="outlined"
        density="compact"
        clearable
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
      <v-btn @click="openPostcode" height="40" color="primary" variant="flat" block>
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
        v-model="description"
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
    <v-img
      v-if="thumbnailPreview"
      :src="thumbnailPreview"
      max-width="300"
      class="mt-3 rounded elevation-1"
      cover
    />
  </v-col>
</v-row>


<v-row dense class="mb-4">
  <v-col cols="12">
    <label class="text-subtitle-1 mb-2 d-block">추가 이미지</label>
    <v-file-input
      multiple
      v-model="images"
      accept="image/*"
      label="추가 이미지 업로드"
      variant="outlined"
      density="compact"
      show-size
      @update:modelValue="onImagesChange"
    />

    <v-row dense class="mt-3">
<v-col
  v-for="(src, i) in imagePreviews"
  :key="i"
  cols="4"
  class="d-flex flex-column align-center"
>
  <img
    :src="src"
    style="max-height: 120px; max-width: 100%; border-radius: 6px; margin-bottom: 4px;"
  />
  <v-btn
    icon="mdi-close"
    size="x-small"
    color="red"
    variant="text"
    @click="removeImage(i)"
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
.v-text-field, .v-select, .v-textarea {
  border-radius: 12px;
}
.v-btn {
  border-radius: 12px;
}
</style>