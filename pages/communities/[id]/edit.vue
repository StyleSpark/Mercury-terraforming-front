<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import Tiptap from '@/components/Tiptap.vue'

const route = useRoute()
const router = useRouter()
const editorRef = ref(null)

const communityId = route.params.id

const categories = ref([])
const categoryNames = ref([])
const selectedCategoryName = ref('')

const uploadedImages = ref([]) // 새로 업로드된 파일
const blobUrlMap = ref({}) // blob URL → 인덱스 매핑

const originalPost = ref(null)

const form = ref({
  categoryId: null,
  title: '',
  content: ''
})

onMounted(async () => {
  const [categoryRes, postRes] = await Promise.all([
    useApi('/communities/categories'),
    useApi(`/communities/${communityId}`)
  ])

  categories.value = categoryRes.data
  categoryNames.value = categoryRes.data.map(c => c.name)

  const post = postRes.data
  originalPost.value = {
    categoryId: post.categoryId,
    title: post.title,
    content: post.content
  }

  // 초기값 세팅
  form.value.categoryId = post.categoryId
  form.value.title = post.title
  form.value.content = post.content
  selectedCategoryName.value = categoryRes.data.find(c => c.id === post.categoryId)?.name || ''

  // 에디터 내용도 초기화
  await nextTick()
  editorRef.value?.editor.commands.setContent(post.content)
})

watch(selectedCategoryName, (name) => {
  const found = categories.value.find(c => c.name === name)
  form.value.categoryId = found?.id || null
})

function handleImageInsert(file) {
  const index = uploadedImages.value.length
  uploadedImages.value.push(file)

  const blobUrl = URL.createObjectURL(file)
  blobUrlMap.value[blobUrl] = index

  const editor = editorRef.value?.editor
  if (editor) {
    editor.chain().focus().setImage({ src: blobUrl }).run()
  } else {
    console.warn('❗ Tiptap 에디터 인스턴스를 찾을 수 없습니다.')
  }
}

// 기존 이미지 및 blob 이미지 URL 추출 유틸 함수
function extractExistingImageUrls(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return Array.from(div.querySelectorAll('img')).map(img => img.src)
}

// blob: URL만 추출하는 유틸 함수
function extractBlobUrls(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return Array.from(div.querySelectorAll('img'))
    .map(img => img.src)
    .filter(src => src.startsWith('blob:'))
}

async function updatePost() {
  const htmlContent = editorRef.value?.editor.getHTML()
  const existingImageUrls = extractExistingImageUrls(htmlContent)

  // 🆕 사용된 blob URL만 필터링
  const usedBlobUrls = extractBlobUrls(htmlContent)

  // blobUrlMap 정리: 실제 content에 존재하는 blob만 남김
  // const usedBlobUrls = existingImageUrls.filter(url => url.startsWith('blob:'))

  const newUploadedImages = []
  const newBlobUrlMap = {}

  for (const blobUrl of usedBlobUrls) {
    const index = blobUrlMap.value[blobUrl]
    if (index !== undefined && uploadedImages.value[index]) {
      newUploadedImages.push(uploadedImages.value[index])
      newBlobUrlMap[blobUrl] = newUploadedImages.length - 1
    }
  }

  uploadedImages.value = newUploadedImages // 🔁 unused 이미지 제거
  blobUrlMap.value = newBlobUrlMap // 🔁 unused blob url 제거

  // usedBlobUrls.forEach(url => {
  //   if (blobUrlMap.value[url] !== undefined) {
  //     newBlobUrlMap[url] = blobUrlMap.value[url]
  //   }
  // })
  // blobUrlMap.value = newBlobUrlMap

  const isSame =
    originalPost.value.title === form.value.title &&
    originalPost.value.categoryId === form.value.categoryId &&
    originalPost.value.content === htmlContent &&
    uploadedImages.value.length === 0

  if (isSame) {
    alert('수정된 내용이 없습니다. 내용을 다시 확인해주세요.')
    return
  }

  try {
    const formData = new FormData()

    uploadedImages.value.forEach(file => {
      formData.append('images', file)
    })

    const requestBody = {
      categoryId: form.value.categoryId,
      title: form.value.title,
      content: htmlContent,
      blobUrlMap: blobUrlMap.value,
      existingImageUrls
    }

    formData.append('request', new Blob([
      JSON.stringify(requestBody)
    ], { type: 'application/json' }))

    await useApi(`/communities/${communityId}`, {
      method: 'PATCH',
      body: formData,
      headers: {}
    })

    alert('게시글이 수정되었습니다.')
    router.push(`/communities/${communityId}`)
  } catch (e) {
    console.error('❌ 게시글 수정 에러:', e)
    alert('게시글 수정 실패')
  }
}

function cancelEdit() {
  if (confirm('수정을 취소하시겠습니까?')) {
    router.push(`/communities/${communityId}`)
  }
}
</script>

<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-4">게시글 수정</h2>

    <v-select
      v-model="selectedCategoryName"
      :items="categoryNames"
      label="카테고리 선택"
      variant="outlined"
      density="comfortable"
      class="mb-4"
    />

    <v-text-field
      v-model="form.title"
      label="제목"
      variant="outlined"
      class="mb-4"
    />

    <Tiptap
      ref="editorRef"
      @insert-image="handleImageInsert"
    />

    <div class="mt-4 d-flex justify-end">
      <v-btn color="primary" @click="updatePost">수정</v-btn>
      <v-btn class="mr-2" @click="cancelEdit">취소</v-btn>
    </div>
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.editor-content img {
  max-width: 80%;
  height: auto;
  display: block;
  margin: 1rem auto;
}
</style>