export const useApi = <T>(endpoint: string, options = {}) => {
  const config = useRuntimeConfig()
  return $fetch<T>(`${config.public.apiBase}${endpoint}`, options)
}