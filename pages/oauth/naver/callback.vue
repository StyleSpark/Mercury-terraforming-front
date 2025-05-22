<!-- /pages/oauth/naver/callback.vue -->
<script setup>
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code
  const state = route.query.state

  if (!code || !state) {
    alert('로그인 실패: code 또는 state가 없습니다.')
    return
  }

  try {
    const res = await useApi('/auth/naver', {
      method: 'POST',
      body: { code, state },
    })
    localStorage.setItem('access_token', res.accessToken)
    alert('로그인 성공')
    router.push('/')
  } catch (err) {
    console.error('로그인 실패:', err)
    alert('로그인 실패')
    router.push('/login')
  }
})
</script>

<template>
  <div>네이버 로그인 중입니다...</div>
</template>
