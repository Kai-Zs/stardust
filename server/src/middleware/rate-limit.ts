import { createMiddleware } from 'hono/factory'

// 内存 Map，按 IP 限制评论频率
const hits = new Map<string, number[]>()

const WINDOW_MS = 60_000 // 1 分钟
const MAX_HITS = 3 // 每窗口最多 3 条

// 定期清理过期记录
setInterval(() => {
  const now = Date.now()
  for (const [ip, timestamps] of hits) {
    const fresh = timestamps.filter((t) => now - t < WINDOW_MS)
    if (fresh.length === 0) hits.delete(ip)
    else hits.set(ip, fresh)
  }
}, 60_000)

export const rateLimit = createMiddleware(async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
  const now = Date.now()
  const timestamps = hits.get(ip) || []
  const fresh = timestamps.filter((t) => now - t < WINDOW_MS)

  if (fresh.length >= MAX_HITS) {
    return c.json({ error: '评论太频繁，请稍后再试' }, 429)
  }

  fresh.push(now)
  hits.set(ip, fresh)
  await next()
})
