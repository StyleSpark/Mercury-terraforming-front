<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import Tiptap from '@/components/Tiptap.vue'

const route = useRoute()
const router = useRouter()

const editorRef = ref(null)

const categories = ref([])
const categoryNames = ref([])
const selectedCategoryName = ref(route.query.categoryName || '')

const uploadedImages = ref([])
const blobUrlMap = ref({})

const form = ref({
  categoryId: null,
  title: '',
  content: ''
})

onMounted(async () => {
  const res = await useApi('/communities/categories')
  categories.value = res.data
  categoryNames.value = res.data.map(c => c.name)

  const { categoryId, categoryName } = route.query
  if (categoryId && categoryName) {
    selectedCategoryName.value = categoryName
    form.value.categoryId = Number(categoryId)
  }
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

async function submitPost() {
  try {
    const formData = new FormData()

    uploadedImages.value.forEach((file, index) => {
      formData.append('images', file)
    })

    const htmlContent = editorRef.value?.editor.getHTML()

    const requestBody = {
      categoryId: form.value.categoryId,
      title: form.value.title,
      content: htmlContent,
      blobUrlMap: blobUrlMap.value
    }

    formData.append('request', new Blob([
      JSON.stringify(requestBody)
    ], { type: 'application/json' }))

    await useApi('/communities', {
      method: 'POST',
      body: formData,
      headers: {} // Content-Type 자동 설정됨
    })

    alert('게시글이 등록되었습니다.')
    router.push('/communities')
  } catch (e) {
    console.error('❌ 게시글 등록 에러:', e)
    alert('게시글 등록 실패')
  }
}
</script>

<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-4">게시글 작성</h2>

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

    <v-btn color="primary" class="mt-4" @click="submitPost">
      작성하기
    </v-btn>
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