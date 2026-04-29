import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { siteSettings } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/admin/settings — 站点设置
app.get('/settings', async (c) => {
  const rows = db.select().from(siteSettings).all()
  const config: Record<string, string> = {}
  for (const row of rows) {
    config[row.key] = row.value
  }
  return c.json(config)
})

// PUT /api/admin/settings — 更新站点设置
app.put('/settings', async (c) => {
  const body = await c.req.json<Record<string, string>>()

  for (const [key, value] of Object.entries(body)) {
    const existing = db.select().from(siteSettings).where(eq(siteSettings.key, key)).get()
    if (existing) {
      db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key)).run()
    } else {
      db.insert(siteSettings).values({ key, value }).run()
    }
  }

  return c.json({ success: true })
})

export default app
