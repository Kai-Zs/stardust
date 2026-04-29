import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { users } from '../../db/schema.js'
import { eq } from 'drizzle-orm'
import { compareSync } from 'bcryptjs'
import { SignJWT } from 'jose'
import { getJwtPayload } from '../../middleware/auth.js'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'stardust-secret-key-change-in-production'
)

const app = new Hono()

// POST /api/admin/login
app.post('/login', async (c) => {
  const body = await c.req.json<{ username: string; password: string }>()
  if (!body.username || !body.password) {
    return c.json({ error: '用户名和密码不能为空' }, 400)
  }

  const user = db.select().from(users).where(eq(users.username, body.username)).get()
  if (!user || !compareSync(body.password, user.passwordHash)) {
    return c.json({ error: '用户名或密码错误' }, 401)
  }

  const token = await new SignJWT({ id: user.id, username: user.username, nickname: user.nickname })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  return c.json({
    token,
    user: { id: user.id, username: user.username, nickname: user.nickname },
  })
})

// GET /api/admin/me
app.get('/me', async (c) => {
  const payload = getJwtPayload(c)
  if (!payload) return c.json({ error: '未登录' }, 401)

  const user = db.select().from(users).where(eq(users.id, Number(payload.id))).get()
  if (!user) return c.json({ error: '用户不存在' }, 404)

  return c.json({ id: user.id, username: user.username, nickname: user.nickname })
})

export default app
