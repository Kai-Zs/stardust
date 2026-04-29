import { db } from '../db/index.js'
import { posts } from '../db/schema.js'
import { eq } from 'drizzle-orm'

/**
 * 将标题转为 URL-friendly slug
 * 支持中文（保留）和英文（转小写、连字符）
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w一-鿿-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled'
}

/**
 * 生成唯一 slug，如果已存在则追加数字后缀
 */
export function generateUniqueSlug(title: string): string {
  const base = slugify(title)
  let slug = base
  let counter = 2

  while (true) {
    const existing = db.select().from(posts).where(eq(posts.slug, slug)).get()
    if (!existing) return slug
    slug = `${base}-${counter}`
    counter++
  }
}
