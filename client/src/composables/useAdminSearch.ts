import { ref, computed } from 'vue'

export function useAdminSearch<T>(
  items: () => T[],
  searchFields: (keyof T)[],
  filterField?: keyof T,
) {
  const keyword = ref('')
  const activeFilter = ref('')

  const filteredItems = computed(() => {
    let result = items()

    // 关键词搜索
    if (keyword.value.trim()) {
      const kw = keyword.value.trim().toLowerCase()
      result = result.filter(item =>
        searchFields.some(field => {
          const val = item[field]
          if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(kw))
          return String(val).toLowerCase().includes(kw)
        }),
      )
    }

    // 分类筛选
    if (filterField && activeFilter.value) {
      result = result.filter(item => String(item[filterField]) === activeFilter.value)
    }

    return result
  })

  function countByFilter(value: string) {
    if (!filterField) return 0
    if (!value) return items().length
    return items().filter(item => String(item[filterField]) === value).length
  }

  return { keyword, activeFilter, filteredItems, countByFilter }
}
