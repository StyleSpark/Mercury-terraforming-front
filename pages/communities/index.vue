<script setup>
const page = ref(1)
const perPage = 10

const sortOption = ref('latest')
const filterTarget = ref('title')
const searchKeyword = ref('')

const posts = ref([]);
const total = ref(0);


const fetchPosts = async () => {
  const filterKey = filterTarget.value
  const keyword = searchKeyword.value.trim()

  const params = {
    page: page.value,
    size: perPage,
    sort: sortOption.value,
  }

  // 검색 조건이 있을 때만 해당 파라미터 추가
  if (keyword) {
    params[filterKey] = keyword
  }

  const response = await useApi('/communities', { params })
  posts.value = response?.data?.communities || []
  total.value = response?.data?.total || 0
}

// 최초 로드
onMounted(fetchPosts)

// 정렬 또는 페이지 변경 시만 호출
watch([sortOption, page], fetchPosts)

// 검색 버튼 클릭 또는 엔터 시 수동 호출
const onSearch = async () => {
  page.value = 1
  const filterKey = filterTarget.value
  const keyword = searchKeyword.value.trim()

  const params = {
    page: page.value,
    size: perPage,
    sort: sortOption.value,
  }

  if (keyword) {
    params[filterKey] = keyword
  }

  console.log('🔍 검색 파라미터:', params) // ✅ 요청 확인용
  const response = await useApi('/communities', { params }) // ✅ 이 줄이 빠졌던 것!
  console.log('✅ 응답 데이터:', response)

  posts.value = response?.data?.communities || []
  total.value = response?.data?.total || 0
}

</script>

<template>
  <v-container class="px-4 py-6 max-w-screen-sm mx-auto">
    <!-- 상단 정렬/검색 영역 -->
    <div class="d-flex justify-space-between align-center mb-5">
      <!-- 왼쪽: 정렬 -->
      <v-select
        v-model="sortOption"
        :items="[
          { title: '최신순', value: 'latest' },
          { title: '조회수순', value: 'views' }
        ]"
        variant="outlined"
        density="compact"
        hide-details
        class="select-item"
        style="max-width: 130px"
      />

      <!-- 오른쪽: 필터 + 검색창 묶음 -->
      <div class="d-flex align-center" style="gap: 12px;">
        <v-select
          v-model="filterTarget"
          :items="[
            { title: '제목', value: 'title' },
            { title: '작성자', value: 'userName' },
            { title: '제목+내용', value: 'titleOrContent' }
          ]"
          variant="outlined"
          density="compact"
          hide-details
          class="select-item"
          style="max-width: 140px"
        />

        <v-text-field
          v-model="searchKeyword"
          placeholder="검색어 입력"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="search-input"
          style="max-width: 240px"
          @keydown.enter="onSearch"
        />
      </div>
    </div>

    <v-sheet
      v-for="item in posts"
      :key="item.id"
      class="pa-4 mb-3 rounded elevation-0 post-card"
      color="#FAFAFA"
      @click="$router.push(`/communities/${item.id}`)"
    >
      <div class="d-flex flex-column">
        <div class="text-body-1 font-weight-medium text-black mb-1">{{ item.title }}</div>
        <div class="text-caption text-medium-emphasis">{{ item.userName }} · {{ item.createdAt }} · 조회수 {{ item.viewCount }}</div>
        <div class="text-caption text-medium-emphasis">
          💬 댓글 {{ item.commentCount }} · 👍 {{ item.likeCount }} · 👎 {{ item.dislikeCount }}
        </div>
      </div>
    </v-sheet>

    <div v-if="posts.length === 0" class="text-center text-grey py-10">
      게시글이 없습니다 🥲
    </div>

    <!-- 페이지네이션 -->
    <v-pagination
      v-model="page"
      :length="Math.ceil(total / perPage)"
      :total-visible="5"
      color="primary"
      size="small"
      class="mt-8 justify-center"
    />
  </v-container>
</template>

<style scoped>
.post-card {
  transition: box-shadow 0.2s ease;
  border: 1px solid #ececec;
  cursor: pointer;
}
.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
