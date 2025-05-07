<script setup>
import { ref, computed } from 'vue'

const page = ref(1)
const searchKeyword = ref('')
const sortOption = ref('latest')

const items = [
  {
    id: 1,
    title: '아프리카 코끼리는 정말 커요!',
    author: '관리자',
    date: '2024-05-01',
    views: 122,
  },
  {
    id: 2,
    title: '사바나의 이야기',
    author: '홍길동',
    date: '2024-04-30',
    views: 87,
  },
  {
    id: 3,
    title: '동물 다큐멘터리 추천 좀요',
    author: '김코딩',
    date: '2024-04-29',
    views: 45,
  },
]

const perPage = 5

const filteredItems = computed(() => {
  let result = [...items]

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.author.toLowerCase().includes(keyword)
    )
  }

  if (sortOption.value === 'latest') {
    result.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (sortOption.value === 'views') {
    result.sort((a, b) => b.views - a.views)
  }

  return result
})

const paginatedItems = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredItems.value.slice(start, start + perPage)
})
</script>

<template>
  <v-container class="px-4 py-6 max-w-screen-sm mx-auto">
    <!-- 상단 정렬/검색 영역 -->
    <div class="d-flex justify-space-between align-center mb-5">
      <v-select
        v-model="sortOption"
        :items="[
          { title: '최신순', value: 'latest' },
          { title: '조회수순', value: 'views' },
        ]"
        variant="outlined"
         density="compact"
        hide-details
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
        style="max-width: 240px"
      />
    </div>

    <v-sheet
      v-for="item in paginatedItems"
      :key="item.id"
      class="pa-4 mb-3 rounded elevation-0 post-card"
      color="#FAFAFA"
      @click="$router.push(`/community/${item.id}`)"
    >
      <div class="d-flex flex-column">
        <div class="text-body-1 font-weight-medium text-black mb-1">{{ item.title }}</div>
        <div class="text-caption text-medium-emphasis">{{ item.author }} · {{ item.date }} · 조회수 {{ item.views }}</div>
      </div>
    </v-sheet>

    <div v-if="paginatedItems.length === 0" class="text-center text-grey py-10">
      게시글이 없습니다 🥲
    </div>

    <!-- 페이지네이션 -->
    <v-pagination
      v-model="page"
      :length="Math.ceil(filteredItems.length / perPage)"
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
