// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const token = auth.accessToken

  if (!token) return

  try {
    const decoded: any = jwtDecode(token)
    const now = Date.now() / 1000

    if (decoded.exp < now) {
      auth.logout()
      return navigateTo('/?session=expired', { replace: true })
    }
  } catch (e) {
    auth.logout()
    return navigateTo('/?session=invalid', { replace: true })
  }
})
