import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 用户表
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  nickname: text('nickname').notNull(),
  createdAt: text('created_at').notNull().default(''),
})

// 文章表
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  excerpt: text('excerpt').notNull().default(''),
  tags: text('tags').notNull().default('[]'), // JSON string array
  content: text('content').notNull().default(''),
  wordCount: integer('word_count').notNull().default(0),
  readingTime: integer('reading_time').notNull().default(0),
  commentEnabled: integer('comment_enabled', { mode: 'boolean' }).notNull().default(true),
  pinned: integer('pinned', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(''),
  updatedAt: text('updated_at').notNull().default(''),
})

// 项目表
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  techStack: text('tech_stack').notNull().default('[]'), // JSON string array
  githubUrl: text('github_url'),
  homepageUrl: text('homepage_url'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(''),
})

// 时间线表
export const timeline = sqliteTable('timeline', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  date: text('date').notNull(),
  icon: text('icon').notNull().default(''),
  createdAt: text('created_at').notNull().default(''),
})

// 友链表
export const friendLinks = sqliteTable('friend_links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  description: text('description').notNull().default(''),
  createdAt: text('created_at').notNull().default(''),
})

// 评论表
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').notNull(),
  parentId: integer('parent_id'),
  nickname: text('nickname').notNull(),
  content: text('content').notNull(),
  ip: text('ip').notNull().default(''),
  ipLocation: text('ip_location').notNull().default('未知'),
  status: text('status').notNull().default('pending'), // pending | approved | hidden
  createdAt: text('created_at').notNull().default(''),
})

// 站点设置表（键值对）
export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull().default(''),
})

// 操作日志表
export const operationLogs = sqliteTable('operation_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  action: text('action').notNull(),
  target: text('target').notNull().default(''),
  operator: text('operator').notNull().default('admin'),
  createdAt: text('created_at').notNull().default(''),
})

// 附件表
export const attachments = sqliteTable('attachments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  size: integer('size').notNull().default(0),
  createdAt: text('created_at').notNull().default(''),
})
