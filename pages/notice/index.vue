<script setup>
const notices = ref([])

onMounted(async () => {
  try {
    const response = await useApi('/notices')
    
    notices.value = response.data.notices;
  } catch (err) {
    console.error('API 실패:', err)
  }
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">공지사항</h1>
    <ul v-if="notices.length > 0">
      <li v-for="notice in notices" :key="notice.id" class="mb-2">
        <p class="font-semibold">{{ notice.title }}</p>
        <p class="text-sm text-gray-600">{{ notice.content }}</p>
      </li>
    </ul>
    <p v-else>공지사항이 없습니다.</p>
  </div>
</template>
