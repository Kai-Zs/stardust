import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    localStorage.setItem('theme', theme.value)
  })

  return { theme, toggle }
})
