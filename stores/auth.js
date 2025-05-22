import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),
  actions: {
    setToken(token) {
      this.accessToken = token
      localStorage.setItem('access_token', token) // 저장 추가
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user)) // 저장 추가
    },
    restoreAuth() {
      const token = localStorage.getItem('access_token')
      const user = localStorage.getItem('user')

      if (token) this.accessToken = token
      if (user) this.user = JSON.parse(user)
    },
    logout() {
      this.accessToken = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
  },
})
