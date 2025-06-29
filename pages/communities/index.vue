<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoginDialogStore } from '@/stores/loginDialog'

const router = useRouter()
const auth = useAuthStore()
const loginDialogStore = useLoginDialogStore()

const selectedCategoryId = ref(1)
const categories = ref([])

const page = ref(1)
const perPage = 10
const sortOption = ref('latest')
const filterTarget = ref('title')
const searchKeyword = ref('')

const posts = ref([])
const total = ref(0)

const fetchCategories = async () => {
  try {
    const res = await useApi('/communities/categories')
    categories.value = res.data || []
  } catch (e) {
    console.error('카테고리 목록 조회 실패:', e)
  }
}


const fetchPosts = async () => {
  const params = {
    page: page.value,
    size: perPage,
    sort: sortOption.value,
    categoryId: selectedCategoryId.value
  }

  const keyword = (searchKeyword.value || '').trim()

  if (keyword) {
    params[filterTarget.value] = keyword
  }

  try {
    const res = await useApi('/communities', { method: 'GET', params })
    posts.value = res?.data?.communities || []
    total.value = res?.data?.total || 0
  } catch (e) {
    console.error('게시글 목록 조회 실패:', e)
  }
}

onMounted(() => {
  fetchPosts()
  fetchCategories()
})

watch([page, sortOption, searchKeyword], fetchPosts)

const getPlainText = (html) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || ''
}

const handleCategoryClick = (id) => {
  if (selectedCategoryId.value === id) {
    selectedCategoryId.value = null  // 다시 클릭하면 선택 해제 & '전체' 게시글
  } else {
    selectedCategoryId.value = id
  }

  // 게시글 목록 새로 불러오기 등 필터 적용
  page.value = 1
  fetchPosts()
}

const onSearch = () => {
  page.value = 1
  fetchPosts()
}

const goToCreate = () => {
  if (!auth.isLoggedIn) {
    loginDialogStore.open()
    return
  }

  const category = categories.value.find((c) => c.id === selectedCategoryId.value)

  router.push({
    path: '/communities/create',
    query: {
      categoryId: category?.id,
      categoryName: category?.name
    }
  })
}

</script>

<template>
  <v-container class="py-6 max-w-screen-sm mx-auto">

    <!-- 카테고리 -->
    <div class="mb-6">
      <h1 class="text-subtitle-1 font-weight-bold mb-3"># 카테고리</h1>
      <div class="d-flex flex-wrap gap-2">
        <v-btn
          v-for="category in categories"
          :key="category.id"
          size="small"
          variant="outlined"
          :class="['category-btn', { selected: selectedCategoryId === category.id }]"
          @click="handleCategoryClick(category.id)"
        >
          #{{ category.name }}
        </v-btn>
      </div>
    </div>

    <!-- 정렬 + 검색 필터 -->
    <div class="d-flex justify-space-between align-center mb-5">
      <v-select
        v-model="sortOption"
        :items="[
          { title: '최신순', value: 'latest' },
          { title: '조회수순', value: 'views' }
        ]"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 130px"
      />

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
          @keydown.enter="onSearch"
          @click:clear="onSearch"
        />
      </div>
    </div>

    <!-- 게시글 목록 -->
    <v-sheet
      v-for="item in posts"
      :key="item.id"
      class="post-card mb-3"
      @click="$router.push(`/communities/${item.id}`)"
    >
      <!-- 왼쪽 텍스트 -->
      <div class="post-content">
        <div class="post-title">{{ item.title }}</div>
        <div class="post-snippet">
          {{ getPlainText(item.content) }}
        </div>
        <div class="post-meta">
          {{ item.userName }} · {{ item.createdAt }} · 조회수 {{ item.viewCount }}
        </div>
        <div class="post-reactions">
          💬 댓글 {{ item.commentCount }} · 👍 {{ item.likeCount }} · 👎 {{ item.dislikeCount }}
        </div>
      </div>

      <!-- 오른쪽 썸네일 -->
      <div v-if="item.thumbnailUrl" class="post-thumbnail-wrapper">
        <v-img
          :src="item.thumbnailUrl"
          class="post-thumbnail"
          width="120"
          height="90"
          cover
        />
      </div>
    </v-sheet>

    <!-- 게시글 없음 -->
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

    <!-- 글 작성 버튼 -->
    <div class="text-right mt-4">
      <v-btn color="primary" variant="outlined" @click="goToCreate">
        글 작성
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped>
.category-btn {
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  color: #333;
  background-color: white;
  padding: 10px 16px;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  height: 36px;
  transition: 0.2s;
}

.category-btn:hover {
  background-color: #f0f0f0;
  color: black;
}

.category-btn.selected {
  background-color: #333;
  color: white;
  border-color: #333;
}

.post-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: 0.2s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.post-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
}

.post-content {
  flex: 1;
  min-width: 0;
  margin-right: 16px;
}

.post-snippet {
  color: #555;
  font-size: 14px;
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.post-meta,
.post-reactions {
  font-size: 12px;
  color: #888;
  margin-bottom: 2px;
}

.post-thumbnail-wrapper {
  flex-shrink: 0;
}

.post-thumbnail {
  width: 120px;
  height: 90px;
  border-radius: 6px;
  object-fit: cover;
}

</style>