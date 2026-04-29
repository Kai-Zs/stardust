import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { comments } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/admin/comments — 全部评论（含待审核）
app.get('/comments', async (c) => {
  const all = db.select().from(comments).all()
  return c.json(all)
})

// PATCH /api/admin/comments/:id/approve — 审核评论
app.patch('/comments/:id/approve', async (c) => {
  const id = Number(c.req.param('id'))
  db.update(comments).set({ status: 'approved' }).where(eq(comments.id, id)).run()
  return c.json({ success: true })
})

// PATCH /api/admin/comments/:id/hide — 隐藏评论
app.patch('/comments/:id/hide', async (c) => {
  const id = Number(c.req.param('id'))
  db.update(comments).set({ status: 'hidden' }).where(eq(comments.id, id)).run()
  return c.json({ success: true })
})

// DELETE /api/admin/comments/:id — 删除评论
app.delete('/comments/:id', async (c) => {
  const id = Number(c.req.param('id'))
  db.delete(comments).where(eq(comments.id, id)).run()
  return c.json({ success: true })
})

export default app
