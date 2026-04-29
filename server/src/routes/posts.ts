import { Hono } from 'hono'
import { db } from '../db/index.js'
import { posts } from '../db/schema.js'
import { eq, like, desc, asc, sql } from 'drizzle-orm'

const app = new Hono()

// GET /api/posts — 文章列表（分页 + 标签筛选）
app.get('/posts', async (c) => {
  const page = Number(c.req.query('page') || 1)
  const limit = Number(c.req.query('limit') || 10)
  const tag = c.req.query('tag')
  const offset = (page - 1) * limit

  let query = db.select().from(posts)

  // 标签筛选：SQLite JSON 查询
  if (tag) {
    query = db.select().from(posts).where(
      sql`json_each.value = ${tag}`
    ) as typeof query
  }

  const allPosts = db.select().from(posts)
    .orderBy(desc(posts.pinned), desc(posts.date))
    .limit(limit)
    .offset(offset)
    .all()

  // 解析 JSON 字段
  const result = allPosts.map((p) => ({
    ...p,
    tags: JSON.parse(p.tags) as string[],
    commentEnabled: !!p.commentEnabled,
    pinned: !!p.pinned,
  }))

  return c.json(result)
})

// GET /api/posts/:slug — 单篇文章
app.get('/posts/:slug', async (c) => {
  const slug = c.req.param('slug')
  const post = db.select().from(posts).where(eq(posts.slug, slug)).get()

  if (!post) {
    return c.json({ error: '文章不存在' }, 404)
  }

  return c.json({
    ...post,
    tags: JSON.parse(post.tags) as string[],
    commentEnabled: !!post.commentEnabled,
    pinned: !!post.pinned,
  })
})

export default app
