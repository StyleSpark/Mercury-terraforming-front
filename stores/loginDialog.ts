// stores/loginDialog.ts
import { defineStore } from 'pinia'

export const useLoginDialogStore = defineStore('loginDialog', () => {
  const isOpen = ref(false)
  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }

  return { isOpen, open, close }
})
