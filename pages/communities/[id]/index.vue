<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoginDialogStore } from '@/stores/loginDialog'

const auth = useAuthStore()

const route = useRoute()
const router = useRouter()
const postId = Number(route.params.id)

const post = ref(null)

const isDeleteDialogOpen = ref(false)
const toastVisible = ref(false)

const fetchPost = async () => {
  const res = await useApi(`/communities/${postId}`)
  post.value = res.data
}

onMounted(async () => {
  auth.restoreAuth()
  await fetchPost()
})

watch(() => auth.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    await fetchPost()  // 로그인 상태에서 게시글 다시 조회 (로그인을 하고 나면 내가 좋아요/싫어요 를 눌렀는지 바로 확인 가능)
  }
})

function goToEdit() {
  router.push(`/communities/${postId}/edit`)
}

function deletePost() {
  isDeleteDialogOpen.value = true
}

async function confirmDeletePost() {
  try {
    await useApi(`/communities/${postId}`, {
      method: 'DELETE'
    })
    toastVisible.value = true
    router.push('/communities') // 목록 페이지로 이동
  } catch (e) {
    alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.')
    console.error(e)
  } finally {
    isDeleteDialogOpen.value = false
  }
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
            <v-chip
            v-if="post.isMine"
            color="red"
            variant="outlined"
            size="x-small"
            class="my-post-chip"
            >
            My Post
            </v-chip>
        </div>
        <div class="text-caption text-medium-emphasis mb-4">
          <div>
            {{ post.userName }} · {{ post.createdAt }}
          </div>
          <div>
            <span class="text-caption text-medium-emphasis">조회수 : {{ post.viewCount }}</span>
          </div>
        </div>

        <!-- 게시글 내용 (마크업 내용을 그대로 html로 뿌려줌) -->
        <div class="text-body-1" v-html="post.content"></div>

      </div>
      
      <div v-else class="text-center py-10 text-medium-emphasis">
        게시글을 찾을 수 없습니다.
      </div>
    </v-sheet>

    <div v-if="post && post.isMine" class="d-flex justify-end mb-3">
      <v-btn color="primary" size="small" @click="goToEdit">수정</v-btn>
      <v-btn color="error" size="small" class="ml-2" @click="deletePost">삭제</v-btn>
    </div>

    <!-- 삭제 확인 다이얼로그 -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="400">
      <v-card>
        <v-card-title class="text-h6">게시글을 삭제하시겠습니까?</v-card-title>
        <v-card-text>삭제된 게시글은 복구할 수 없습니다.</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="isDeleteDialogOpen = false">취소</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDeletePost">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 삭제 완료 토스트 -->
    <v-snackbar v-model="toastVisible" color="success" timeout="2000">
      게시글이 삭제되었습니다.
    </v-snackbar>

  </v-container>
</template>

<style scoped>
.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}
</style>