import { db, initDb } from './db/index.js'
import { users, posts, projects, timeline, friendLinks, siteSettings, comments } from './db/schema.js'
import { hashSync } from 'bcryptjs'

const now = new Date().toISOString()

console.log('初始化数据库...')
initDb()

console.log('清空旧数据...')
db.delete(comments).run()
db.delete(friendLinks).run()
db.delete(timeline).run()
db.delete(projects).run()
db.delete(posts).run()
db.delete(siteSettings).run()
db.delete(users).run()

// 管理员
console.log('创建管理员...')
db.insert(users).values({
  username: 'admin',
  passwordHash: hashSync('admin123', 10),
  nickname: '管理员',
  createdAt: now,
}).run()

// 站点配置
console.log('插入站点配置...')
const siteConfig = [
  { key: 'site_title', value: '星霜记' },
  { key: 'site_description', value: '岁月流转，记录时光' },
  { key: 'about_me', value: '## 关于我\n\n一个热爱技术与生活的人。\n\n喜欢用代码构建有趣的东西。' },
  { key: 'site_created_at', value: '2026-04-28' },
]
for (const cfg of siteConfig) {
  db.insert(siteSettings).values(cfg).run()
}

// 文章
console.log('插入文章...')
db.insert(posts).values([
  {
    slug: 'hello-world',
    title: '你好，星霜记',
    date: '2026-04-28',
    excerpt: '这是我的第一篇博客文章，记录这个新站点诞生的时刻。',
    tags: JSON.stringify(['生活', '博客']),
    content: '# 你好，星霜记\n\n这是我的第一篇博客文章，记录这个新站点诞生的时刻。\n\n## 为什么叫星霜记\n\n星霜，指岁月流转。记，是记录。\n\n我希望在这里记录技术与生活中的点滴。',
    wordCount: 156,
    readingTime: 1,
    commentEnabled: true,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: 'vue3-learning',
    title: 'Vue3 学习笔记：组合式 API',
    date: '2026-04-25',
    excerpt: '记录学习 Vue3 Composition API 的心得体会。',
    tags: JSON.stringify(['Vue3', '前端']),
    content: '# Vue3 学习笔记\n\n组合式 API 是 Vue3 的核心特性之一。\n\n```ts\nconst count = ref(0)\n```\n\n数学公式示例：$E = mc^2$',
    wordCount: 2340,
    readingTime: 8,
    commentEnabled: true,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  },
]).run()

// 项目
console.log('插入项目...')
db.insert(projects).values([
  {
    name: '星霜记',
    description: '这个博客本身',
    techStack: JSON.stringify(['Vue3', 'Hono', 'SQLite']),
    githubUrl: 'https://github.com/Kai-Zs/stardust',
    homepageUrl: null,
    featured: true,
    createdAt: now,
  },
  {
    name: '音乐播放器',
    description: '基于网易云 API 的在线音乐播放器',
    techStack: JSON.stringify(['Vue3', 'NetEase API']),
    githubUrl: 'https://github.com/Kai-Zs/music-player',
    homepageUrl: 'http://39.102.209.242:8090/music',
    featured: false,
    createdAt: now,
  },
]).run()

// 时间线
console.log('插入时间线...')
db.insert(timeline).values([
  { title: '创建星霜记', description: '基于 Vue3 + Hono 搭建个人网站', date: '2026-04', icon: '🚀', createdAt: now },
  { title: '学习 Vue3', description: '系统学习 Vue3 组合式 API 和 TypeScript', date: '2026-03', icon: '📚', createdAt: now },
  { title: '学习 Node.js', description: '开始接触后端开发', date: '2026-02', icon: '🔧', createdAt: now },
]).run()

// 友链
console.log('插入友链...')
db.insert(friendLinks).values([
  { name: 'Example Blog', url: 'https://example.com', description: '一个很棒的技术博客', createdAt: now },
]).run()

console.log('种子数据插入完成！')
