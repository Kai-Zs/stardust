import { Hono } from 'hono'
import { db } from '../db/index.js'
import { timeline } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/timeline — 全部时间线（公开）
app.get('/timeline', async (c) => {
  const all = db.select().from(timeline).all()
  return c.json(all)
})

// POST /api/admin/timeline — 创建时间线条目
app.post('/admin/timeline', async (c) => {
  const body = await c.req.json<{ title: string; description?: string; date: string; icon?: string }>()
  if (!body.title?.trim() || !body.date?.trim()) return c.json({ error: '标题和日期不能为空' }, 400)

  const result = db.insert(timeline).values({
    title: body.title.trim(),
    description: body.description || '',
    date: body.date.trim(),
    icon: body.icon || '',
    createdAt: new Date().toISOString(),
  }).run()

  return c.json({ id: Number(result.lastInsertRowid) }, 201)
})

// PUT /api/admin/timeline/:id — 更新时间线条目
app.put('/admin/timeline/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ title?: string; description?: string; date?: string; icon?: string }>()

  const existing = db.select().from(timeline).where(eq(timeline.id, id)).get()
  if (!existing) return c.json({ error: '条目不存在' }, 404)

  db.update(timeline).set({
    ...(body.title !== undefined && { title: body.title }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.date !== undefined && { date: body.date }),
    ...(body.icon !== undefined && { icon: body.icon }),
  }).where(eq(timeline.id, id)).run()

  return c.json({ success: true })
})

// DELETE /api/admin/timeline/:id — 删除时间线条目
app.delete('/admin/timeline/:id', async (c) => {
  const id = Number(c.req.param('id'))
  db.delete(timeline).where(eq(timeline.id, id)).run()
  return c.json({ success: true })
})

export default app
