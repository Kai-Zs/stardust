import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<string[]>([])
  const lastFetch = ref(0)
  let pendingPromise: Promise<string[]> | null = null

  async function fetchTags(apiBase: string) {
    if (Date.now() - lastFetch.value < 5 * 60 * 1000) return tags.value
    if (pendingPromise) return pendingPromise

    pendingPromise = fetch(`${apiBase}/tags`)
      .then(r => r.json())
      .then(data => {
        tags.value = data
        lastFetch.value = Date.now()
        pendingPromise = null
        return data
      })
      .catch(() => {
        pendingPromise = null
        return tags.value
      })

    return pendingPromise
  }

  return { tags, fetchTags }
})
