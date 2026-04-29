import { Hono } from 'hono'
import { db } from '../db/index.js'
import { siteSettings } from '../db/schema.js'

const app = new Hono()

// GET /api/site — 返回站点配置键值对
app.get('/site', async (c) => {
  const rows = db.select().from(siteSettings).all()
  const config: Record<string, string> = {}
  for (const row of rows) {
    config[row.key] = row.value
  }
  return c.json(config)
})

export default app
