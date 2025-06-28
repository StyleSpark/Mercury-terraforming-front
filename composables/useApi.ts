export const useApi = async <T>(endpoint: string, options: any = {}): Promise<T | null> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const router = useRouter()

  const headers = {
    ...options.headers,
    Authorization: authStore.accessToken ? `Bearer ${authStore.accessToken}` : undefined,
  }

  try {
    const response = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers,
    })
    return response
  } catch (error: any) {
    // access token 만료로 인한 401이면 → refresh 시도
    if (error?.response?.status === 401) {
      try {
        // ⬇️ refresh token으로 access token 재발급
        const refreshResult = await $fetch<{ accessToken: string }>('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // refresh token 쿠키로 보낼 경우 필요
        })

        // ⬇️ 새 access token 저장 후 원래 요청 재시도
        authStore.setAccessToken(refreshResult.accessToken)

        const retryResponse = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${refreshResult.accessToken}`,
          },
        })
        return retryResponse
      } catch (refreshError) {
        authStore.logout()
        alert('세션이 만료되어 로그아웃되었습니다.')
        router.push('/login')
        return null
      }
    }

    console.error('API 요청 실패:', error)
    return null
  }
}
