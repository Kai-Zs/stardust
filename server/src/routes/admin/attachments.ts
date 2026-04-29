import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { attachments } from '../../db/schema.js'
import { eq } from 'drizzle-orm'
import { unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { writeFileSync, mkdirSync } from 'node:fs'

const UPLOAD_DIR = './uploads'
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const app = new Hono()

// GET /api/admin/attachments — 附件列表
app.get('/attachments', async (c) => {
  const all = db.select().from(attachments).all()
  return c.json(all)
})

// POST /api/admin/attachments — 文件上传
app.post('/attachments', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!file || !(file instanceof File)) {
    return c.json({ error: '请选择文件' }, 400)
  }

  if (file.size > MAX_SIZE) {
    return c.json({ error: '文件大小不能超过 10MB' }, 400)
  }

  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  const ext = file.name.split('.').pop() || ''
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const filepath = join(UPLOAD_DIR, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(filepath, buffer)

  const url = `/uploads/${filename}`
  const result = db.insert(attachments).values({
    filename: file.name,
    url,
    size: file.size,
    createdAt: new Date().toISOString(),
  }).run()

  return c.json({ id: Number(result.lastInsertRowid), url }, 201)
})

// DELETE /api/admin/attachments/:id — 删除附件
app.delete('/attachments/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const attachment = db.select().from(attachments).where(eq(attachments.id, id)).get()
  if (!attachment) return c.json({ error: '附件不存在' }, 404)

  const filepath = join('.', attachment.url)
  if (existsSync(filepath)) {
    unlinkSync(filepath)
  }

  db.delete(attachments).where(eq(attachments.id, id)).run()
  return c.json({ success: true })
})

export default app
