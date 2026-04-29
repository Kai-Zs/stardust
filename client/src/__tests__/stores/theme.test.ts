import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('默认主题为 light', () => {
    const store = useThemeStore()
    expect(store.theme).toBe('light')
  })

  it('toggle 切换明暗主题', () => {
    const store = useThemeStore()
    expect(store.theme).toBe('light')

    store.toggle()
    expect(store.theme).toBe('dark')

    store.toggle()
    expect(store.theme).toBe('light')
  })

  it('切换到 dark 后同步到 localStorage', () => {
    const store = useThemeStore()
    store.toggle()
    expect(store.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('切换到 dark 后给 html 加上 dark class', () => {
    const store = useThemeStore()
    store.toggle()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
