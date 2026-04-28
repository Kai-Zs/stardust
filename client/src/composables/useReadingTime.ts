import { computed } from 'vue'

export function useReadingTime(content: string) {
  const wordCount = computed(() => {
    if (!content) return 0
    return content.replace(/\s/g, '').length
  })

  const readingTime = computed(() => {
    return Math.max(1, Math.round(wordCount.value / 300))
  })

  return { wordCount, readingTime }
}
