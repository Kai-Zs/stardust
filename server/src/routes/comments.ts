import { Hono } from 'hono'
import { db } from '../db/index.js'
import { comments, posts } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { rateLimit } from '../middleware/rate-limit.js'
import { getIpLocation } from '../utils/ip.js'

const app = new Hono()

// GET /api/posts/:slug/comments — 获取已审核评论
app.get('/posts/:slug/comments', async (c) => {
  const slug = c.req.param('slug')
  const post = db.select().from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return c.json({ error: '文章不存在' }, 404)

  const approvedComments = db.select().from(comments).where(
    and(eq(comments.postId, post.id), eq(comments.status, 'approved'))
  ).all()

  return c.json(approvedComments)
})

// POST /api/posts/:slug/comments — 提交评论
app.post('/posts/:slug/comments', rateLimit, async (c) => {
  const slug = c.req.param('slug')
  const post = db.select().from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return c.json({ error: '文章不存在' }, 404)
  if (!post.commentEnabled) return c.json({ error: '该文章已关闭评论' }, 403)

  const body = await c.req.json<{ nickname: string; content: string; parent_id?: number }>()
  if (!body.nickname?.trim() || !body.content?.trim()) {
    return c.json({ error: '昵称和内容不能为空' }, 400)
  }

  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || ''

  const result = db.insert(comments).values({
    postId: post.id,
    parentId: body.parent_id || null,
    nickname: body.nickname.trim(),
    content: body.content.trim(),
    ip,
    ipLocation: getIpLocation(ip),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }).run()

  return c.json({ id: Number(result.lastInsertRowid), status: 'pending' }, 201)
})

export default app
