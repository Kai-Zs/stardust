import { Hono } from 'hono'
import { db } from '../db/index.js'
import { projects } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/projects — 全部项目（公开）
app.get('/projects', async (c) => {
  const all = db.select().from(projects).all()
  return c.json(all.map((p) => ({
    ...p,
    techStack: JSON.parse(p.techStack) as string[],
    featured: !!p.featured,
  })))
})

// POST /api/admin/projects — 创建项目
app.post('/admin/projects', async (c) => {
  const body = await c.req.json<{
    name: string; description?: string; tech_stack?: string[];
    github_url?: string; homepage_url?: string; featured?: boolean
  }>()
  if (!body.name?.trim()) return c.json({ error: '项目名不能为空' }, 400)

  const result = db.insert(projects).values({
    name: body.name.trim(),
    description: body.description || '',
    techStack: JSON.stringify(body.tech_stack || []),
    githubUrl: body.github_url || null,
    homepageUrl: body.homepage_url || null,
    featured: body.featured || false,
    createdAt: new Date().toISOString(),
  }).run()

  return c.json({ id: Number(result.lastInsertRowid) }, 201)
})

// PUT /api/admin/projects/:id — 更新项目
app.put('/admin/projects/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{
    name?: string; description?: string; tech_stack?: string[];
    github_url?: string; homepage_url?: string; featured?: boolean
  }>()

  const existing = db.select().from(projects).where(eq(projects.id, id)).get()
  if (!existing) return c.json({ error: '项目不存在' }, 404)

  db.update(projects).set({
    ...(body.name !== undefined && { name: body.name }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.tech_stack !== undefined && { techStack: JSON.stringify(body.tech_stack) }),
    ...(body.github_url !== undefined && { githubUrl: body.github_url }),
    ...(body.homepage_url !== undefined && { homepageUrl: body.homepage_url }),
    ...(body.featured !== undefined && { featured: body.featured }),
  }).where(eq(projects.id, id)).run()

  return c.json({ success: true })
})

// DELETE /api/admin/projects/:id — 删除项目
app.delete('/admin/projects/:id', async (c) => {
  const id = Number(c.req.param('id'))
  db.delete(projects).where(eq(projects.id, id)).run()
  return c.json({ success: true })
})

export default app
