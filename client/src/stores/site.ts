import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSiteStore = defineStore('site', () => {
  const config = ref<Record<string, string>>({})

  function setConfig(data: Record<string, string>) {
    config.value = { ...config.value, ...data }
  }

  function get(key: string) {
    return config.value[key] || ''
  }

  return { config, setConfig, get }
})
