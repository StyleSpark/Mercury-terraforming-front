<script setup>
import { usePostcode } from '~/composables/usePostcode'

const form = ref()
const valid = ref(false)

const title = ref('')
const detailAddress = ref('')
const description = ref('')
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

// 주소 관련 (composable 사용)
const { address, openPostcode } = usePostcode()

const submitForm = () => {
  if (!valid.value) return
  const fullAddress = `${address.value} ${detailAddress.value}`
  const fullPrice = isMonthly.value ? { deposit: deposit.value, rent: rent.value } : { deposit: deposit.value }

  console.log({
    title: title.value,
    type: type.value,
    price: fullPrice,
    maintenanceFee: maintenanceFee.value,
    address: fullAddress,
    buildingType: buildingType.value,
    description: description.value,
    options: options.value,
    images: images.value,
    tags: tags.value
  })
}

const optionItems = [
  { label: '엘리베이터', value: 'elevator' },
  { label: '반려동물 가능', value: 'pet' },
  { label: '주차 가능', value: 'parking' },
  { label: '발코니 있음', value: 'balcony' },
  { label: '풀옵션', value: 'full_option' },
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
      <v-text-field
        v-model="title"
        label="제목"
        :rules="[v => !!v || '제목은 필수입니다.']"
        variant="outlined"
        class="mb-4"
        density="comfortable"
        clearable
      />

      <v-select
        v-model="type"
        :items="['전세', '월세', '단기']"
        label="거래 형태"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />

      <v-text-field
        v-model="deposit"
        label="보증금 (만원)"
        type="number"
        :rules="[v => !!v || '보증금은 필수입니다.']"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        clearable
      />

      <v-text-field
        v-if="isMonthly"
        v-model="rent"
        label="월세 (만원)"
        type="number"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        clearable
      />

      <v-text-field
        v-model="maintenanceFee"
        label="관리비 (만원)"
        type="number"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        clearable
      />

      <v-select
        v-model="buildingType"
        :items="['오피스텔', '원룸', '투룸', '아파트', '주택']"
        label="건물 유형"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        clearable
      />

      <div class="d-flex mb-2 gap-2">
        <v-text-field
          v-model="address"
          label="주소"
          disabled
          variant="outlined"
          density="comfortable"
          style="flex: 1;"
        />
        <v-btn @click="openPostcode" height="35" color="primary" variant="flat">
          주소 검색
        </v-btn>
      </div>

      <v-text-field
        v-model="detailAddress"
        label="상세 주소"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        clearable
      />

      <v-textarea
        v-model="description"
        label="상세 설명"
        variant="outlined"
        rows="4"
        density="comfortable"
        auto-grow
        class="mb-4"
      />

      <div class="mb-4">
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
                density="comfortable"
                hide-details
              />
            </v-col>
          </v-row>
        </v-sheet>
      </div>

      <div class="mb-4">
        <label class="text-subtitle-1 font-weight-medium mb-2 d-block">태그</label>
        <v-text-field
          v-model="newTag"
          placeholder="태그를 입력 후 Enter"
          @keyup.enter="addTag"
          variant="outlined"
          density="comfortable"
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
      </div>

      <v-file-input
        v-model="images"
        label="대표 사진 업로드"
        variant="outlined"
        multiple
        show-size
        density="comfortable"
        accept="image/*"
        class="mb-6"
      />
      <v-file-input
        v-model="images"
        label="추가 사진 업로드"
        variant="outlined"
        multiple
        show-size
        density="comfortable"
        accept="image/*"
        class="mb-6"
      />

      <v-btn
        :disabled="!valid"
        color="primary"
        size="large"
        block
        @click="submitForm"
      >
        매물 등록
      </v-btn>
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