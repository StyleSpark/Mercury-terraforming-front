import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  // 중개인인 경우 접근 차단
  if (to.path === '/mypage/agent/register' && auth.user?.role === 'AGENT') {
    return navigateTo('/mypage')
  }
})
