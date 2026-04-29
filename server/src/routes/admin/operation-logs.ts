import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { operationLogs } from '../../db/schema.js'
import { desc } from 'drizzle-orm'

const app = new Hono()

// GET /api/admin/operation-logs — 操作日志分页
app.get('/operation-logs', async (c) => {
  const page = Number(c.req.query('page') || 1)
  const limit = Number(c.req.query('limit') || 20)
  const offset = (page - 1) * limit

  const logs = db.select().from(operationLogs)
    .orderBy(desc(operationLogs.createdAt))
    .limit(limit)
    .offset(offset)
    .all()

  return c.json(logs)
})

export default app
