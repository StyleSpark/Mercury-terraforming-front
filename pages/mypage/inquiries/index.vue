<template>
  <MypageLayoutWrapper>
    <v-card variant="outlined" class="pa-6 mb-4 h-100">
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="text-h5 font-weight-bold">내 문의 내역</div>
        <v-btn color="primary" @click="goToCreateInquiry">문의사항 작성하기</v-btn>
      </div>

      <!-- 게시판 형식 테이블 -->
      <v-data-table
        :headers="headers"
        :items="inquiries"
        :items-per-page="10"
        no-data-text="아직 등록한 문의 내역이 없습니다."
      >
        <template #item="{ item }">
          <tr @click="goToInquiryDetail(item)" style="cursor: pointer;">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>
              <v-chip :color="statusColor(item.status)" variant="outlined" size="small">
                {{ statusLabel(item.status) }}
              </v-chip>
            </td>
            <td>{{ formatDate(item.createdAt) }}</td>
          </tr>
        </template>
      </v-data-table>

    </v-card>

    <Toast v-model="toastVisible" :message="message" :color="color" :duration="2000" />
  </MypageLayoutWrapper>
</template>

<script setup>

const router = useRouter();

const inquiries = ref([]); // 문의 내역 목록
const toastVisible = ref(false);
const message = ref('');
const color = ref('');

// 테이블 헤더 정의
const headers = [
  { title: '문의번호', value: 'id', width: '100px' },
  { title: '제목', value: 'title', sortable: false },
  { title: '상태', value: 'status', width: '120px', sortable: true },
  { title: '작성일', value: 'createdAt', width: '160px',sortable:true }
];

onMounted(async () => {

 const response = await useApi('/questions');
  // 실제로는 API 호출해서 데이터 조회
  inquiries.value = response.data;
});

const goToCreateInquiry = () => {
  router.push('/mypage/inquiries/create');
};

const goToInquiryDetail = (inquiry) => {
  router.push(`/mypage/inquiries/${inquiry.id}`);
};

const statusLabel = (status) => {
  switch (status) {
    case 'PROCESSING':
      return '처리중';
    case 'DONE':
      return '답변완료';
    default:
      return '알 수 없음';
  }
};

const statusColor = (status) => {
  switch (status) {
    case 'PROCESSING':
      return 'orange';
    case 'DONE':
      return 'green';
    default:
      return 'grey';
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
};
</script>

<style scoped>
.v-data-table {
  cursor: pointer;
}

.v-data-table th {
  text-align: center;
}

.v-data-table td {
  text-align: center;
}
</style>
