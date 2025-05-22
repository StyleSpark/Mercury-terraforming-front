import { useAuthStore } from '@/stores/auth'

export const useApi = <T>(endpoint: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const headers = {
    ...options.headers,
    Authorization: authStore.accessToken ? `Bearer ${authStore.accessToken}` : undefined,
  }

  return $fetch<T>(`${config.public.apiBase}${endpoint}`, {
    ...options,
    headers,
  })
}
