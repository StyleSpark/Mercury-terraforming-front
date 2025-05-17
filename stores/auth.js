import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),
  actions: {
    setToken(token) {
      this.accessToken = token
    },
    setUser(user) {
      this.user = user
    },
    logout() {
      this.accessToken = null
      this.user = null
      localStorage.removeItem('access_token')
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
  },
})
