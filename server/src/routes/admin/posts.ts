import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { posts, operationLogs } from '../../db/schema.js'
import { eq, desc } from 'drizzle-orm'
import { generateUniqueSlug } from '../../utils/slug.js'
import { getJwtPayload } from '../../middleware/auth.js'

const app = new Hono()

// GET /api/admin/posts — 全部文章（含草稿）
app.get('/posts', async (c) => {
  const all = db.select().from(posts).orderBy(desc(posts.createdAt)).all()
  return c.json(all.map((p) => ({
    ...p,
    tags: JSON.parse(p.tags) as string[],
    commentEnabled: !!p.commentEnabled,
    pinned: !!p.pinned,
  })))
})

// POST /api/admin/posts — 创建文章
app.post('/posts', async (c) => {
  const body = await c.req.json<{
    title: string; excerpt?: string; tags?: string[]; content?: string;
    commentEnabled?: boolean; pinned?: boolean
  }>()
  if (!body.title?.trim()) return c.json({ error: '标题不能为空' }, 400)

  const slug = generateUniqueSlug(body.title)
  const now = new Date().toISOString()
  const content = body.content || ''
  const wordCount = content.replace(/\s/g, '').length
  const readingTime = Math.max(1, Math.round(wordCount / 300))

  const result = db.insert(posts).values({
    slug,
    title: body.title.trim(),
    date: now.slice(0, 10),
    excerpt: body.excerpt || '',
    tags: JSON.stringify(body.tags || []),
    content,
    wordCount,
    readingTime,
    commentEnabled: body.commentEnabled !== false,
    pinned: body.pinned || false,
    createdAt: now,
    updatedAt: now,
  }).run()

  // 记录操作日志
  const payload = getJwtPayload(c)
  db.insert(operationLogs).values({
    action: '创建文章',
    target: body.title,
    operator: (payload?.nickname as string) || 'admin',
    createdAt: now,
  }).run()

  return c.json({ id: Number(result.lastInsertRowid), slug }, 201)
})

// PUT /api/admin/posts/:id — 更新文章
app.put('/posts/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{
    title?: string; excerpt?: string; tags?: string[]; content?: string;
    commentEnabled?: boolean; pinned?: boolean
  }>()

  const existing = db.select().from(posts).where(eq(posts.id, id)).get()
  if (!existing) return c.json({ error: '文章不存在' }, 404)

  const now = new Date().toISOString()
  const content = body.content ?? existing.content
  const wordCount = content.replace(/\s/g, '').length
  const readingTime = Math.max(1, Math.round(wordCount / 300))

  db.update(posts).set({
    ...(body.title !== undefined && { title: body.title }),
    ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
    ...(body.tags !== undefined && { tags: JSON.stringify(body.tags) }),
    ...(body.content !== undefined && { content, wordCount, readingTime }),
    ...(body.commentEnabled !== undefined && { commentEnabled: body.commentEnabled }),
    ...(body.pinned !== undefined && { pinned: body.pinned }),
    updatedAt: now,
  }).where(eq(posts.id, id)).run()

  return c.json({ success: true })
})

// DELETE /api/admin/posts/:id — 删除文章
app.delete('/posts/:id', async (c) => {
  const id = Number(c.req.param('id'))
  db.delete(posts).where(eq(posts.id, id)).run()
  return c.json({ success: true })
})

export default app
