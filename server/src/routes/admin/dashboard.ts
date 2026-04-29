import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { posts, comments, projects } from '../../db/schema.js'
import { count, desc } from 'drizzle-orm'

const app = new Hono()

// GET /api/admin/dashboard — 仪表盘数据
app.get('/dashboard', async (c) => {
  const totalPosts = db.select({ count: count() }).from(posts).get()?.count || 0
  const totalComments = db.select({ count: count() }).from(comments).get()?.count || 0
  const totalProjects = db.select({ count: count() }).from(projects).get()?.count || 0

  const recentPosts = db.select().from(posts).orderBy(desc(posts.createdAt)).limit(5).all()

  return c.json({
    totalPosts,
    totalComments,
    totalProjects,
    recentPosts: recentPosts.map((p) => ({
      ...p,
      tags: JSON.parse(p.tags) as string[],
      commentEnabled: !!p.commentEnabled,
      pinned: !!p.pinned,
    })),
  })
})

export default app
