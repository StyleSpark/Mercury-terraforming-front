<script setup>
// 특별한 데이터는 일단 정적 데이터로 시작합니다
</script>

<template>
  <v-container fluid class="pa-0">

    <!-- 1. 최상단 타이틀 영역 -->
    <v-sheet
      height="250"
      style="background-image: url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1470&q=80'); background-size: cover; background-position: center;"
      class="d-flex align-center justify-center text-center"
    >
      <div style="background: rgba(0,0,0,0.5); padding: 20px;">
        <h1 class="text-h4 font-weight-bold text-white mb-2">대리 방문 서비스</h1>
        <p class="text-subtitle-1 text-white">서울, 수도권 지역 집을 대신 확인해드립니다.</p>
      </div>
    </v-sheet>

    <!-- 2. 메인 내용 -->
    <v-container class="py-12">

      <!-- 커버 이미지 + 서비스 요약 -->
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="6" class="text-center">
          <v-img
            src="https://via.placeholder.com/400x500.png?text=서비스+대표+이미지"
            height="400"
            contain
            class="mb-6"
          />
          <h2 class="text-h5 font-weight-bold mb-2">시간이 부족한 당신을 대신합니다</h2>
          <p class="text-body-1">서울, 수도권 지역의 부동산 매물을 직접 확인하기 어려운 분들을 위해 전문 대리인이 방문해드립니다.</p>
        </v-col>
      </v-row>

      <!-- 서비스 설명 -->
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="8">
          <h3 class="text-h6 font-weight-bold mb-4">서비스 설명</h3>
          <p class="mb-4">
            지방에 거주하거나 바쁜 일정으로 인해 매물 직접 방문이 어려우신가요?
            <br>전문 대리인이 직접 방문하여 매물 상태, 주변 환경, 관리 상황 등을 체크하고 상세한 사진과 정보를 제공합니다.
          </p>
          <p class="mb-4">
            희망 지역 및 조건을 입력하면 추천 매물도 찾아드립니다!
          </p>
        </v-col>
      </v-row>

      <!-- 3. 가격 테이블 -->
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="10">
          <h3 class="text-h6 font-weight-bold mb-8 text-center">요금제 안내</h3>
          <v-row dense>
            <v-col cols="12" sm="4" class="text-center mb-4">
              <v-card class="pa-6 hover-card">
                <h4 class="font-weight-bold mb-2">STANDARD</h4>
                <p class="text-h6 font-weight-bold mb-4" style="color: #FF8339;">29,000원</p>
                <p>지정 매물 1건 방문</p>
                <p>간단한 사진 + 요약 정보 제공</p>
                <v-btn color="#FF8339" class="text-white mt-6">신청하기</v-btn>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4" class="text-center mb-4">
              <v-card class="pa-6 hover-card">
                <h4 class="font-weight-bold mb-2">DELUXE</h4>
                <p class="text-h6 font-weight-bold mb-4" style="color: #FF8339;">49,000원</p>
                <p>지정 매물 2건 방문</p>
                <p>상세 사진 + 요약/평가 리포트</p>
                <v-btn color="#FF8339" class="text-white mt-6">신청하기</v-btn>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4" class="text-center mb-4">
              <v-card class="pa-6 hover-card">
                <h4 class="font-weight-bold mb-2">PREMIUM</h4>
                <p class="text-h6 font-weight-bold mb-4" style="color: #FF8339;">99,000원</p>
                <p>지정 매물 3건 + 조건 검색</p>
                <p>자세한 사진, 영상, 평가 리포트 제공</p>
                <v-btn color="#FF8339" class="text-white mt-6">신청하기</v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- 4. 전문가 프로필 (선택) -->
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="8">
          <h3 class="text-h6 font-weight-bold mb-6 text-center">서비스 제공자</h3>
          <v-card class="pa-6 d-flex align-center">
            <v-avatar size="80" class="mr-6">
              <v-img src="https://via.placeholder.com/80x80.png?text=대리인" />
            </v-avatar>
            <div>
              <h4 class="font-weight-bold mb-2">홍길동 대리인</h4>
              <p class="text-body-2 mb-2">서울 강남구 전문가 · 현장 경험 5년 이상</p>
              <p class="text-caption">"빠르고 정확한 집 상태 확인, 믿고 맡겨주세요!"</p>
            </div>
          </v-card>
        </v-col>
      </v-row>

    </v-container>

  </v-container>
</template>

<style scoped>
.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}
.text-white {
  color: white !important;
}
</style>
