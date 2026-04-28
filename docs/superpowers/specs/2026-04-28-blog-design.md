# 星霜记 / Stardust — 设计文档

## 概述

基于 Vue3 + Hono + SQLite 的综合个人网站，包含博客、项目展示、关于我、时间线、友情链接、音乐播放器六大板块，配后台管理系统。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue3 + TypeScript + Vite + Pinia + Vue Router |
| 后端 | Hono (Node.js) + TypeScript |
| 数据库 | SQLite + Drizzle ORM |
| 部署 | 1Panel + OpenResty 反代 + PM2 |
| Markdown | markdown-it + KaTeX (数学公式) + highlight.js (代码高亮) + DOMPurify (XSS 防护) |
| AI | DeepSeek API (文章摘要生成) |

## 架构

```
浏览器
  │
  ▼
1Panel + OpenResty (:80/:443)
  │
  ├── /*         →  Vue3 SPA 静态文件
  ├── /assets/*  →  静态资源 (CSS/JS/图片)
  └── /api/*     →  反代 Hono (:3000) → SQLite
```

前后端分离：Vue3 SPA 纯静态部署，Hono 纯 API 服务。OpenResty 统一入口。

---

## 数据库设计

```sql
users
├── id INTEGER PRIMARY KEY
├── username TEXT NOT NULL UNIQUE
├── password_hash TEXT NOT NULL (bcrypt)
├── nickname TEXT
├── avatar TEXT
├── role TEXT DEFAULT 'admin'
├── created_at TEXT DEFAULT (datetime('now'))

posts
├── id INTEGER PRIMARY KEY
├── title TEXT NOT NULL
├── slug TEXT NOT NULL UNIQUE
├── content TEXT (Markdown)
├── excerpt TEXT (人工编写摘要)
├── cover TEXT
├── tags TEXT (JSON 数组: ["Vue3","TypeScript"])
├── ai_summary TEXT (DeepSeek 自动生成，仅在 draft→published 时触发)
├── status TEXT DEFAULT 'draft' (draft/published)
├── pinned INTEGER DEFAULT 0 (置顶)
├── comment_enabled INTEGER DEFAULT 1
├── author_id INTEGER REFERENCES users(id)
├── created_at TEXT DEFAULT (datetime('now'))
├── updated_at TEXT DEFAULT (datetime('now'))

projects
├── id INTEGER PRIMARY KEY
├── name TEXT NOT NULL
├── description TEXT
├── cover TEXT
├── tech_stack TEXT (JSON 数组)
├── github_url TEXT
├── homepage_url TEXT (自定义项目主页)
├── featured INTEGER DEFAULT 0
├── sort_order INTEGER DEFAULT 0
├── created_at TEXT DEFAULT (datetime('now'))

timeline_items
├── id INTEGER PRIMARY KEY
├── title TEXT NOT NULL
├── description TEXT
├── date TEXT NOT NULL
├── icon TEXT
├── link TEXT
├── sort_order INTEGER DEFAULT 0
├── created_at TEXT DEFAULT (datetime('now'))

friend_links
├── id INTEGER PRIMARY KEY
├── name TEXT NOT NULL
├── url TEXT NOT NULL
├── description TEXT
├── sort_order INTEGER DEFAULT 0
├── last_checked_at TEXT
├── created_at TEXT DEFAULT (datetime('now'))

comments
├── id INTEGER PRIMARY KEY
├── post_id INTEGER REFERENCES posts(id)
├── parent_id INTEGER REFERENCES comments(id) (限制两层：一级评论 + 回复)
├── nickname TEXT NOT NULL
├── content TEXT NOT NULL
├── ip TEXT (明文存储，用于频率限制和封禁)
├── ip_location TEXT (城市级别，前端展示 IP 属地)
├── status TEXT DEFAULT 'approved' (approved/hidden)
├── created_at TEXT DEFAULT (datetime('now'))

ip_blocks
├── id INTEGER PRIMARY KEY
├── ip TEXT NOT NULL
├── reason TEXT
├── created_at TEXT DEFAULT (datetime('now'))

music_playlist
├── id INTEGER PRIMARY KEY
├── playlist_id TEXT NOT NULL (网易云歌单 ID)
├── name TEXT
├── description TEXT
├── created_at TEXT DEFAULT (datetime('now'))

attachments
├── id INTEGER PRIMARY KEY
├── filename TEXT NOT NULL
├── original_name TEXT NOT NULL
├── mime_type TEXT
├── size INTEGER
├── url TEXT NOT NULL
├── created_at TEXT DEFAULT (datetime('now'))

operation_logs
├── id INTEGER PRIMARY KEY
├── user_id INTEGER
├── action TEXT (操作类型: delete_post、block_ip、update_site 等)
├── target TEXT (操作对象描述)
├── ip TEXT
├── created_at TEXT DEFAULT (datetime('now'))

site_settings
├── id INTEGER PRIMARY KEY
├── key TEXT NOT NULL UNIQUE
├── value TEXT
```

**关键 site_settings 键：**
- `site_title` — 站点标题
- `site_description` — 站点描述
- `about_me` — 关于我内容 (Markdown)
- `site_created_at` — 建站日期，Footer 显示"本站已运行 xxx 天"
- `footer_license` — 页脚协议 (CC BY-NC-SA 4.0)
- `social_github` / `social_twitter` / `social_email` — 社交链接

---

## API 设计

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/site` | 获取全部站点配置 |
| GET | `/api/posts?page=&tag=&status=published` | 文章列表（分页+筛选，置顶优先） |
| GET | `/api/posts/:slug` | 文章详情 |
| GET | `/api/tags` | 所有文章标签（Pinia 缓存，过期时间 5 分钟） |
| GET | `/api/projects` | 项目列表 |
| GET | `/api/timeline` | 时间线数据 |
| GET | `/api/friend-links` | 友链列表 |
| GET | `/api/music/playlist` | 歌单信息 |
| GET | `/api/comments?post_id=` | 某篇文章评论 |
| POST | `/api/comments` | 发表评论（匿名+昵称，限 3条/分钟/IP，两层嵌套） |
| GET | `/api/rss.xml` | RSS 订阅 |
| GET | `/api/sitemap.xml` | 站点地图 |

### 后台接口（需 JWT 认证）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/auth/captcha` | 获取登录验证码 |
| POST | `/api/auth/login` | 登录（需验证码） |
| GET | `/api/auth/me` | 当前用户信息 |
| GET | `/api/admin/dashboard` | 仪表盘数据（文章数、最新评论、待审核数等） |
| GET/POST | `/api/admin/posts` | 列出/创建文章 |
| PUT/DELETE | `/api/admin/posts/:id` | 更新/删除文章 |
| POST | `/api/admin/posts/:id/ai-summary` | 手动重新生成 AI 摘要 |
| CRUD | `/api/admin/projects` | 项目管理 |
| CRUD | `/api/admin/timeline` | 时间线管理 |
| CRUD | `/api/admin/friend-links` | 友链管理 |
| GET | `/api/admin/comments?status=&post_id=` | 评论列表 |
| PUT | `/api/admin/comments/:id/status` | 审核/隐藏评论 |
| DELETE | `/api/admin/comments/:id` | 删除评论 |
| GET | `/api/admin/ip-blocks` | 封禁列表 |
| POST | `/api/admin/ip-blocks` | 封禁 IP |
| DELETE | `/api/admin/ip-blocks/:id` | 解封 IP |
| PUT | `/api/admin/music/playlist` | 更新歌单 |
| PUT | `/api/admin/site/:key` | 更新站点配置 |
| POST | `/api/admin/upload` | 上传附件（大小限制 10MB，类型校验） |
| GET | `/api/admin/attachments` | 附件列表 |
| DELETE | `/api/admin/attachments/:id` | 删除附件 |
| GET | `/api/admin/backup/download` | 下载数据库备份 |
| POST | `/api/admin/backup/restore` | 上传并恢复备份 |
| GET | `/api/admin/operation-logs?page=` | 操作审计日志 |

### 认证方式

JWT Token，有效期 7 天。登录需输入图形验证码（防暴力破解）。Token 存 localStorage，请求时放 Authorization Header。

**敏感操作二次确认：** 删除文章、封禁 IP、修改站点配置、恢复备份，前端弹确认窗。

---

## 前端路由

```
/                        首页（简介 + 最近文章）
/blog                    博客列表（分页 + 标签筛选）
/blog/:slug              文章详情 + 评论区
/projects                 项目展示
/about                    关于我
/timeline                 技术成长时间线
/friends                  友情链接
/music                    音乐播放器
/admin                    后台入口 → 有登录态跳仪表盘，否则跳登录页
/admin/login              登录页
/admin/dashboard           仪表盘
/admin/posts              文章管理
/admin/posts/new          写文章
/admin/posts/:id/edit     编辑文章（与新建共用 PostEditor 组件）
/admin/projects           项目管理
/admin/timeline           时间线管理
/admin/friend-links       友链管理
/admin/comments           评论管理
/admin/attachments        附件管理
/admin/backup             备份恢复
/admin/settings           站点设置
/admin/operation-logs     操作日志
```

---

## 组件树

```
App.vue
├── Layout (公开)
│   ├── NavBar (导航 + ThemeToggle)
│   ├── <RouterView>
│   │   ├── HomePage
│   │   ├── BlogList
│   │   ├── BlogDetail
│   │   │   └── CommentList + CommentForm
│   │   ├── ProjectsPage
│   │   ├── AboutPage
│   │   ├── TimelinePage
│   │   ├── FriendLinksPage
│   │   └── MusicPage
│   │       ├── PlayerControls
│   │       └── Playlist
│   └── Footer (运营时间 + CC BY-NC-SA 4.0 协议)
│
└── AdminLayout (后台)
    ├── AdminSidebar (用户信息 + 退出 + 导航)
    └── <RouterView>
        ├── LoginPage (验证码)
        ├── Dashboard (仪表盘概览)
        ├── PostList
        ├── PostEditor (新建/编辑复用)
        ├── ProjectManager
        ├── TimelineManager
        ├── FriendLinkManager
        ├── CommentManager
        ├── AttachmentManager
        ├── BackupManager
        ├── OperationLogs
        └── SiteSettings

# 公共组件
├── PostCard
├── ProjectCard
├── TimelineItem
├── CommentList
├── CommentForm
├── TagCloud
├── MarkdownRenderer (markdown-it + KaTeX + highlight.js + DOMPurify + 图片懒加载 + Lightbox)
├── Pagination
├── ImageUploader
├── ThemeToggle
├── LoadingSpinner
├── EmptyState
├── NotFound
└── CaptchaInput
```

---

## 数据流

### 全局状态 (Pinia)

| Store | 内容 |
|-------|------|
| `useAuthStore` | Token、当前用户、login/logout 方法 |
| `useSiteStore` | 站点配置（标题、关于我、建站日期等） |
| `useThemeStore` | 主题 (light/dark)、切换方法，持久化 localStorage |
| `useTagsStore` | 标签列表缓存，5 分钟过期 |

### 数据流向

- 前台：Vue Router → 页面组件 → fetch API → 渲染
- 后台：路由守卫校验 JWT → 页面组件 → fetch + Bearer Token → API
- 深色主题：provide/inject 全局注入，`<head>` 中 inline script 读取 localStorage 防止首次加载闪屏
- 页面数据（文章列表等）由各页面组件独立管理，不放入全局 Store
- 标签数据跨页面共享，由 useTagsStore 管理缓存

---

## 特殊功能

### Markdown 渲染

- **引擎**: markdown-it
- **数学公式**: KaTeX，支持 `$...$` 行内和 `$$...$$` 块级公式
- **代码高亮**: highlight.js，深色模式自动切换高亮主题
- **XSS 防护**: DOMPurify 净化渲染输出
- **图片**: 自动 `loading="lazy"` 懒加载，点击 Lightbox 放大预览

### DeepSeek AI 摘要

- posts 表 `ai_summary` 字段存储
- **仅在文章状态由 draft → published 时触发**（首次发布），更新文章不自动触发
- 后台提供"重新生成摘要"按钮，手动触发
- 调用失败最多重试 2 次，失败后保留旧摘要不变
- 前端展示：正文顶部折叠区域，底色与正文区分，标注"AI 生成摘要"

### 字数与阅读时间

- 前端根据 Markdown 内容实时计算
- 中文字数 = 去除空白后字符数，阅读时间 = 字数 ÷ 300 字/分钟
- 文章标题下方展示："约 xx 字 · 阅读约 x 分钟"

### 音乐播放器

- 自定义 UI，网易云歌单 API 做数据源
- 指定歌单 ID → 拉取播放列表 → 播放器展示
- **缓存策略**: 前端优先读缓存（2 小时有效期），缓存过期后再请求 API
- API 挂掉时显示"歌曲加载失败"的友好提示

### 评论系统

- 匿名评论，填写昵称即可发表
- IP 属地显示（城市级别）
- 频率限制：同 IP 每分钟最多 3 条
- 评论开关：每篇文章可单独开启/关闭评论
- IP 封禁：后台可封禁/解封 IP，被封 IP 无法发表评论
- **嵌套层级限制为两层**：一级评论 + 回复，后端创建时校验 parent_id 深度

### 页脚运营时间

- site_settings 存建站日期
- Footer 实时计算并显示："本站已运行 xxx 天"
- 显示 CC BY-NC-SA 4.0 协议

### 深色模式

- 手动切换 + 跟随系统，持久化到 localStorage
- **防闪屏**: `<head>` 中 inline script 在页面渲染前读取 localStorage 并给 `<html>` 添加 `dark` class

### 文章置顶

- posts 表 `pinned` 字段，查询时置顶文章排最前

### 仪表盘

- 文章总数 / 已发布 / 草稿数
- 最新评论（最近 5 条）
- 评论待审核数量
- 站点运行天数

### 附件管理

- 上传接口 `/api/admin/upload`，文件大小限制 10MB，前后端双重类型校验
- 上传后返回可引用的 URL，一键复制到剪贴板
- 附件列表页：缩略图预览、文件名、文件大小、上传时间
- 支持删除不再使用的附件
- 存储位置：本地文件系统 `uploads/` 目录

### 备份恢复

- 一键下载备份：导出 SQLite 数据库文件 + `uploads/` 目录压缩包
- 支持上传备份文件恢复数据
- 可配置定时自动备份（每天一次，保留最近 7 天）

### 操作审计日志

- 记录关键操作：删除文章、封禁/解封 IP、修改站点配置、恢复备份
- 记录字段：操作用户、操作类型、操作对象、IP、时间
- 后台可查看分页日志

### SEO

- `@vueuse/head` 动态设置 `<title>` 和 `<meta description>`
- 文章详情页：`description` 取自 `posts.excerpt`
- Open Graph 标签（`og:title`、`og:image` 使用文章封面图）

### RSS & Sitemap

- `GET /api/rss.xml` — 最近 20 篇已发布文章，生成 RSS XML
- `GET /api/sitemap.xml` — 列出所有公开页面 URL

---

## 错误处理

| 状态码 | 前端处理 | 后端处理 |
|--------|---------|---------|
| 400 | 提示具体错误 | 参数校验失败，返回 error 信息 |
| 401 | 跳登录页，清 Token | JWT 验证失败 |
| 404 | NotFound 页面/提示 | 资源不存在 |
| 500 | "服务器开小差了" | 全局异常捕获，打日志，不泄露细节 |

后端日志：Hono logger 中间件，输出请求路径、耗时、错误堆栈。

---

## 安全

- 密码 bcrypt 加密
- JWT Token 7 天过期
- 登录加图形验证码，防暴力破解
- 敏感操作（删除文章、封禁 IP、改站点配置、恢复备份）前端二次确认弹窗
- 评论频率限制 3条/分钟/IP
- IP 封禁机制
- XSS 防护：MarkdownRenderer 渲染后经 DOMPurify 净化
- SQL 参数化查询（Drizzle ORM 默认安全）
- CORS 中间件限制开发环境仅允许 localhost
- 文件上传前后端双重类型和大小校验

---

## 工程化

- 前端环境变量：`VITE_API_BASE` — 开发环境 `http://localhost:3000/api`，生产环境 `/api`
- OpenResty 缓存策略：HTML 文件 `Cache-Control: no-cache`，JS/CSS 带 hash 文件名设长期缓存
- PM2 守护 Hono 进程，自动重启

---

## 测试

- 后端：Vitest + `app.request()` 集成测试，覆盖核心路径和评论频率限制并发场景
- 前端：Vitest + @vue/test-utils 单元测试，覆盖核心组件；EmptyState、NotFound 等纯展示组件加快照测试
- E2E：不上，个人项目手动验证

---

## 部署

- 前端：`npm run build` → scp 上传 → OpenResty 托管
- 后端：git pull → npm install → PM2 reload
- PM2 守护 Hono 进程，自动重启
- SQLite 文件可通过后台或脚本定期备份

---

## 分阶段实施

| 阶段 | 内容 |
|------|------|
| 第一阶段 | Vue3 项目初始化、路由、布局、所有页面组件（Mock 数据），页面可预览 |
| 第二阶段 | 后端 API + 数据库 + 文章 CRUD + 文件上传 + Markdown 渲染（含 KaTeX/代码高亮） |
| 第三阶段 | JWT 登录 + 验证码 + 后台管理 + 评论系统 + IP 封禁 + 审计日志 |
| 第四阶段 | 音乐播放器、AI 摘要、深色模式、备份恢复、仪表盘、RSS/Sitemap、SEO |
