const baseURL = import.meta.env.VITE_API_BASE || '/api'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions extends RequestInit {
  /** 超时时间（毫秒），默认 15000 */
  timeout?: number
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = 15000, signal: externalSignal, ...fetchOptions } = options

  // 组合外部 signal 与内部超时 controller
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort()
    } else {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true })
    }
  }

  const token = localStorage.getItem('token')
  const isFormData = fetchOptions.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((fetchOptions.headers as Record<string, string>) || {}),
  }

  try {
    const res = await fetch(`${baseURL}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    })

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token')
        // 后续可替换为 router.push('/admin/login') 以支持 SPA 导航
        window.location.assign('/admin/login')
      }
      const body = await res.json().catch(() => ({}))
      throw new ApiError(res.status, body.error || `请求失败 (${res.status})`)
    }

    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, signal }),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: 'DELETE', signal }),
  /** 文件上传，不设置 Content-Type，由浏览器自动添加 multipart boundary */
  upload: <T>(path: string, formData: FormData, signal?: AbortSignal) =>
    request<T>(path, { method: 'POST', body: formData, signal }),
}
