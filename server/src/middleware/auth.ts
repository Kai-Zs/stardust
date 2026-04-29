import { createMiddleware } from 'hono/factory'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'stardust-secret-key-change-in-production'
)

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: '未登录' }, 401)
  }

  const token = authHeader.slice(7)
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    c.set('jwtPayload', payload)
    await next()
  } catch {
    return c.json({ error: '登录已过期，请重新登录' }, 401)
  }
})

export function signToken(payload: Record<string, unknown>): Promise<string> {
  const { SignJWT } = require('jose')
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export function getJwtPayload(c: { get: (key: string) => unknown }) {
  return c.get('jwtPayload') as Record<string, unknown> | undefined
}
