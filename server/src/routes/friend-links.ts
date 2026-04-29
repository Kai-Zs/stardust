import { Hono } from 'hono'
import { db } from '../db/index.js'
import { friendLinks } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/friend-links — 全部友链（公开）
app.get('/friend-links', async (c) => {
  const all = db.select().from(friendLinks).all()
  return c.json(all)
})

// POST /api/admin/friend-links — 创建友链
app.post('/admin/friend-links', async (c) => {
  const body = await c.req.json<{ name: string; url: string; description?: string }>()
  if (!body.name?.trim() || !body.url?.trim()) return c.json({ error: '名称和 URL 不能为空' }, 400)

  const result = db.insert(friendLinks).values({
    name: body.name.trim(),
    url: body.url.trim(),
    description: body.description || '',
    createdAt: new Date().toISOString(),
  }).run()

  return c.json({ id: Number(result.lastInsertRowid) }, 201)
})

// PUT /api/admin/friend-links/:id — 更新友链
app.put('/admin/friend-links/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ name?: string; url?: string; description?: string }>()

  const existing = db.select().from(friendLinks).where(eq(friendLinks.id, id)).get()
  if (!existing) return c.json({ error: '友链不存在' }, 404)

  db.update(friendLinks).set({
    ...(body.name !== undefined && { name: body.name }),
    ...(body.url !== undefined && { url: body.url }),
    ...(body.description !== undefined && { description: body.description }),
  }).where(eq(friendLinks.id, id)).run()

  return c.json({ success: true })
})

// DELETE /api/admin/friend-links/:id — 删除友链
app.delete('/admin/friend-links/:id', async (c) => {
  const id = Number(c.req.param('id'))
  db.delete(friendLinks).where(eq(friendLinks.id, id)).run()
  return c.json({ success: true })
})

export default app
