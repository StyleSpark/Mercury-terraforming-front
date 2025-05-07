<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const postId = Number(route.params.id)

const post = ref(null)
const newComment = ref('')
const comments = ref([])
const replyTargets = ref({})

const dummyPosts = [
  {
    id: 1,
    title: '아프리카 코끼리는 정말 커요!',
    author: '관리자',
    date: '2024-05-01',
    views: 122,
    content: '아프리카 코끼리는 육지 동물 중 가장 크며 하루에 150kg의 식물을 먹습니다. 이들은 매우 사회적이며 가족 단위로 이동합니다.'
  },
  {
    id: 2,
    title: '사바나의 이야기',
    author: '홍길동',
    date: '2024-04-30',
    views: 87,
    content: '사바나는 초원과 숲이 공존하는 생태계로, 다양한 동물들이 서식합니다. 대표적으로 기린, 얼룩말, 사자 등이 있습니다.'
  },
]

onMounted(() => {
  post.value = dummyPosts.find(p => p.id === postId)
})

function submitComment(parentId = null, content = null) {
  const input = content || newComment.value
  if (input.trim()) {
    comments.value.push({
      id: Date.now(),
      parentId: parentId,
      content: input,
      author: '익명 사용자',
      date: new Date().toISOString().split('T')[0]
    })
    if (parentId) {
      replyTargets.value[parentId] = ''
    } else {
      newComment.value = ''
    }
  }
}

function getReplies(commentId) {
  return comments.value.filter(c => c.parentId === commentId)
}
</script>

<template>
  <v-container class="py-6 max-w-screen-md mx-auto">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()" class="mb-4 text-medium-emphasis">
      목록으로 돌아가기
    </v-btn>

    <v-sheet class="pa-6 rounded-xl mb-6" color="white" elevation="0" border>
      <div v-if="post">
        <div class="d-flex justify-space-between align-start mb-2">
          <h1 class="text-h6 font-weight-bold text-truncate">{{ post.title }}</h1>
          <span class="text-caption text-medium-emphasis">조회 {{ post.views }}</span>
        </div>
        <div class="text-caption text-medium-emphasis mb-4">
          {{ post.author }} · {{ post.date }}
        </div>
        <div class="text-body-1" style="white-space: pre-line;">
          {{ post.content }}
        </div>
      </div>
      <div v-else class="text-center py-10 text-medium-emphasis">
        게시글을 찾을 수 없습니다.
      </div>
    </v-sheet>

    <!-- 댓글 작성 -->
    <v-card class="pa-4 mb-4 rounded-xl" variant="outlined">
      <h3 class="text-subtitle-1 font-weight-medium mb-2">💬 댓글 작성</h3>
      <v-textarea
        v-model="newComment"
        placeholder="댓글을 입력하세요"
        auto-grow
        clearable
        class="mb-2"
        density="compact"
        variant="outlined"
      />
      <v-btn color="primary" @click="submitComment()">댓글 등록</v-btn>
    </v-card>

    <!-- 댓글 목록 -->
    <div v-if="comments.length" class="mt-4">
      <h4 class="text-subtitle-2 font-weight-medium mb-3">🗨️ 댓글</h4>
      <div v-for="comment in comments.filter(c => c.parentId === null)" :key="comment.id">
        <v-card class="mb-3 px-4 py-3 rounded-lg" variant="outlined">
          <div class="text-body-2 mb-1">{{ comment.content }}</div>
          <div class="text-caption text-medium-emphasis mb-1">{{ comment.author }} · {{ comment.date }}</div>
          <v-btn variant="text" density="comfortable" size="small" class="px-1" @click="replyTargets[comment.id] = ''">답글 달기</v-btn>

          <!-- 답글 입력 -->
          <div v-if="replyTargets[comment.id] !== undefined" class="mt-2 ml-2">
            <v-textarea
              v-model="replyTargets[comment.id]"
              placeholder="답글 입력"
              auto-grow
              clearable
              density="compact"
              class="mb-2"
              variant="outlined"
            />
            <v-btn color="primary" size="small" @click="submitComment(comment.id, replyTargets[comment.id])">
              답글 등록
            </v-btn>
          </div>

          <!-- 대댓글 -->
          <div v-for="reply in getReplies(comment.id)" :key="reply.id" class="ml-4 mt-2">
            <v-card class="px-3 py-2 rounded-lg" variant="outlined">
              <div class="text-body-2">{{ reply.content }}</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ reply.author }} · {{ reply.date }}</div>
            </v-card>
          </div>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}
</style>
