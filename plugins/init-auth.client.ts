// plugins/init-auth.client.ts
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.restoreAuth()
})
