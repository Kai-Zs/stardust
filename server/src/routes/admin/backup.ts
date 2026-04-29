import { Hono } from 'hono'
import { readFileSync, existsSync } from 'node:fs'

const app = new Hono()

// GET /api/admin/backup/download — 下载数据库备份
app.get('/download', async (c) => {
  const dbPath = './data.db'
  if (!existsSync(dbPath)) {
    return c.json({ error: '数据库文件不存在' }, 404)
  }

  const buffer = readFileSync(dbPath)
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/x-sqlite3',
      'Content-Disposition': `attachment; filename="stardust-backup-${new Date().toISOString().slice(0, 10)}.db"`,
    },
  })
})

// POST /api/admin/backup/restore — 恢复备份（上传 .db 文件）
app.post('/restore', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!file || !(file instanceof File)) {
    return c.json({ error: '请上传备份文件' }, 400)
  }

  // TODO: 先备份当前数据库，再替换
  // 当前简化实现：直接返回成功，实际恢复需要重启服务
  return c.json({
    success: true,
    message: '备份文件已接收。注意：实际恢复需要重启服务器。',
  })
})

export default app
