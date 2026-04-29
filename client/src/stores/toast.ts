import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0

  function show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(msg: string) {
    show(msg, 'success')
  }
  function error(msg: string) {
    show(msg, 'error', 5000)
  }
  function info(msg: string) {
    show(msg, 'info')
  }
  function warning(msg: string) {
    show(msg, 'warning', 4000)
  }

  return { toasts, show, remove, success, error, info, warning }
})
