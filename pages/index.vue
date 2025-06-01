<script setup>
const serviceSteps = [
  { step: '01', title: '회원가입', desc: '간단한 가입으로 시작하세요.' },
  { step: '02', title: '매물 등록 또는 검색', desc: '내 집을 올리고, 원하는 집을 찾아보세요.' },
  { step: '03', title: '채팅 연결', desc: '당근처럼 채팅으로 바로 연결됩니다.' },
  { step: '04', title: '직거래 또는 중개 거래', desc: '개인간 직거래나 중개인을 통한 안전거래를 선택하세요.' },
]

const proxyOptions = [
  {
    title: '지정 매물 방문 대행',
    desc: '원하는 집 정보를 주시면 대리인이 방문하여 집을 대신 확인해드립니다.',
    icon: 'mdi-home-search'
  },
  {
    title: '조건 검색 및 추천',
    desc: '희망 동네와 조건을 알려주시면 여러 후보 집을 추천해드립니다.',
    icon: 'mdi-map-marker-radius'
  }
]
</script>

<template>
  <v-container fluid class="pa-0">

    <!-- Hero 섹션 -->
    <v-sheet
      height="420"
      class="d-flex align-center justify-center text-center position-relative rounded-0"
      style="
        background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/main_background.avif');
        background-size: cover;
        background-position: center;
      "
    >
      <div class="position-relative">
        <h1 class="text-h4 font-weight-bold mb-3 text-white">당신의 집, 당신의 방식으로</h1>
        <p class="text-subtitle-2 mb-5 text-white">직접 매물을 등록하고, 중개인을 찾고, 집을 대신 찾아드립니다.</p>
        <div>
          <v-btn color="white" class="text-black rounded-pill mr-3" to="/properties" elevation="1">매물 찾기</v-btn>
          <v-btn variant="outlined" color="white" class="rounded-pill" to="/post">매물 등록하기</v-btn>
        </div>
      </div>
    </v-sheet>


    <!-- 서비스 소개 -->
    <v-container class="py-14 px-4">
      <div class="text-center mb-12">
        <h2 class="text-h5 font-weight-semibold mb-2">우리가 제공하는 서비스</h2>
        <p class="text-body-2 text-medium-emphasis">매물을 등록하고, 중개인을 찾고, 채팅으로 직접 연결하는 모든 과정을 쉽고 빠르게 경험하세요.</p>
      </div>
      <v-row justify="center" align="center" dense>
        <v-col cols="12" md="4" class="text-center">
          <v-icon color="#FF8339" size="52">mdi-home-plus</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium mt-3">매물 등록</h3>
          <p class="text-body-2 mt-1">누구나 쉽게 집을 등록하고 공개할 수 있습니다.</p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon color="#FF8339" size="52">mdi-account-search</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium mt-3">중개인 찾기</h3>
          <p class="text-body-2 mt-1">검증된 중개인을 찾아 매끄러운 거래를 지원합니다.</p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon color="#FF8339" size="52">mdi-chat</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium mt-3">채팅 연결</h3>
          <p class="text-body-2 mt-1">당근마켓처럼 채팅으로 바로 연결하고 집을 확인하세요.</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- 대리 방문 서비스 -->
    <v-container class="py-14 px-4" style="background-color: #FAFAFA;">
      <div class="text-center mb-12">
        <h2 class="text-h5 font-weight-semibold mb-2">대신 찾아드립니다</h2>
        <p class="text-body-2 text-medium-emphasis">시간이 없거나 직접 방문이 어려운 경우, 원하는 집을 대신 찾아드립니다.</p>
      </div>
      <v-row justify="center" align="center" dense>
        <v-col
          v-for="(option, index) in proxyOptions"
          :key="index"
          cols="12" md="5"
          class="text-center mb-6"
        >
          <v-icon :icon="option.icon" size="48" color="#FF8339" />
          <h3 class="text-subtitle-1 font-weight-medium mt-3">{{ option.title }}</h3>
          <p class="text-body-2 mt-1">{{ option.desc }}</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- 서비스 흐름 -->
    <v-container class="py-14 px-4">
      <div class="text-center mb-12">
        <h2 class="text-h5 font-weight-semibold mb-2">이용 방법은 간단합니다</h2>
        <p class="text-body-2 text-medium-emphasis">회원가입부터 거래까지 단 몇 단계면 집을 사고 팔 수 있습니다.</p>
      </div>
      <v-row justify="center" dense>
        <v-col
          v-for="(step, index) in serviceSteps"
          :key="index"
          cols="6" md="3"
          class="text-center mb-6"
        >
          <div class="text-h4 font-weight-bold" style="color: #FF8339;">{{ step.step }}</div>
          <h3 class="text-subtitle-1 font-weight-medium mt-3">{{ step.title }}</h3>
          <p class="text-body-2 mt-1">{{ step.desc }}</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- CTA 하단 배너 -->
    <v-sheet height="180" class="d-flex flex-column align-center justify-center text-center" color="#FFB328">
      <h2 class="text-h6 font-weight-medium mb-3">지금 집을 찾아보세요!</h2>
      <v-btn color="white" class="text-black rounded-pill" to="/properties">매물 보기</v-btn>
    </v-sheet>

  </v-container>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.text-white {
  color: white !important;
}
.text-black {
  color: black !important;
}
</style>
