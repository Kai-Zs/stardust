import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { attachments } from '../../db/schema.js'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const UPLOAD_DIR = './uploads'
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const app = new Hono()

// POST /api/attachments — 文件上传（需 JWT）
app.post('/attachments', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!file || !(file instanceof File)) {
    return c.json({ error: '请选择文件' }, 400)
  }

  if (file.size > MAX_SIZE) {
    return c.json({ error: '文件大小不能超过 10MB' }, 400)
  }

  // 确保上传目录存在
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  // 生成唯一文件名
  const ext = file.name.split('.').pop() || ''
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const filepath = join(UPLOAD_DIR, filename)

  // 写入文件
  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(filepath, buffer)

  // 记录到数据库
  const url = `/uploads/${filename}`
  const result = db.insert(attachments).values({
    filename: file.name,
    url,
    size: file.size,
    createdAt: new Date().toISOString(),
  }).run()

  return c.json({ id: Number(result.lastInsertRowid), url }, 201)
})

export default app
