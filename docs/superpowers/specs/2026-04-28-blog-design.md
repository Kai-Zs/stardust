# 综合个人网站 — 设计文档

## 概述

基于 Vue3 + Hono + SQLite 的综合个人网站，包含博客、项目展示、关于我、时间线、友情链接、音乐播放器六大板块，配后台管理系统。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue3 + TypeScript + Vite + Pinia + Vue Router |
| 后端 | Hono (Node.js) + TypeScript |
| 数据库 | SQLite + Drizzle ORM |
| 部署 | 1Panel + OpenResty 反代 + PM2 |

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
├── password_hash TEXT NOT NULL
├── nickname TEXT
├── avatar TEXT
├── role TEXT DEFAULT 'admin'
├── created_at TEXT DEFAULT (datetime('now'))

posts
├── id INTEGER PRIMARY KEY
├── title TEXT NOT NULL
├── slug TEXT NOT NULL UNIQUE
├── content TEXT (Markdown)
├── excerpt TEXT
├── cover TEXT
├── tags TEXT (JSON 数组: ["Vue3","TypeScript"])
├── ai_summary TEXT (DeepSeek 自动生成)
├── status TEXT DEFAULT 'draft' (draft/published)
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
├── created_at TEXT DEFAULT (datetime('now'))

comments
├── id INTEGER PRIMARY KEY
├── post_id INTEGER REFERENCES posts(id)
├── parent_id INTEGER REFERENCES comments(id) (支持嵌套回复)
├── nickname TEXT NOT NULL
├── content TEXT NOT NULL
├── ip TEXT
├── ip_location TEXT (IP 属地)
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
| GET | `/api/site/:key` | 获取单个站点配置 |
| GET | `/api/posts?page=&tag=&status=published` | 文章列表（分页+筛选） |
| GET | `/api/posts/:slug` | 文章详情 |
| GET | `/api/tags` | 所有文章标签 |
| GET | `/api/projects` | 项目列表 |
| GET | `/api/timeline` | 时间线数据 |
| GET | `/api/friend-links` | 友链列表 |
| GET | `/api/music/playlist` | 歌单信息 |
| GET | `/api/comments?post_id=` | 某篇文章评论 |
| POST | `/api/comments` | 发表评论（匿名+昵称，限 3条/分钟/IP） |

### 后台接口（需 JWT 认证）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录 |
| GET | `/api/auth/me` | 当前用户信息 |
| POST/GET | `/api/admin/posts` | 创建/列出文章 |
| PUT/DELETE | `/api/admin/posts/:id` | 更新/删除文章 |
| CRUD | `/api/admin/projects` | 项目管理 |
| CRUD | `/api/admin/timeline` | 时间线管理 |
| CRUD | `/api/admin/friend-links` | 友链管理 |
| PUT | `/api/admin/comments/:id/status` | 审核/隐藏评论 |
| DELETE | `/api/admin/comments/:id` | 删除评论 |
| POST | `/api/admin/ip-blocks` | 封禁 IP |
| DELETE | `/api/admin/ip-blocks/:id` | 解封 IP |
| PUT | `/api/admin/music/playlist` | 更新歌单 |
| PUT | `/api/admin/site/:key` | 更新站点配置 |

### 认证方式

JWT Token，有效期 7 天。登录后存 localStorage，请求时放 Authorization Header。

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
/admin                    后台入口（自动跳转）
/admin/login              登录页
/admin/posts              文章管理
/admin/posts/new          写文章
/admin/posts/:id/edit     编辑文章（与新建共用 PostEditor 组件）
/admin/projects           项目管理
/admin/timeline           时间线管理
/admin/friend-links       友链管理
/admin/comments           评论管理
/admin/settings           站点设置
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
│   │   ├── ProjectsPage
│   │   ├── AboutPage
│   │   ├── TimelinePage
│   │   ├── FriendLinksPage
│   │   └── MusicPage
│   │       ├── PlayerControls
│   │       └── Playlist
│   └── Footer (运营时间 + 协议)
│
└── AdminLayout (后台)
    ├── AdminSidebar (用户信息 + 退出)
    └── <RouterView>
        ├── LoginPage
        ├── PostList
        ├── PostEditor (新建/编辑复用)
        ├── ProjectManager (CrudTable)
        ├── TimelineManager (CrudTable)
        ├── FriendLinkManager (CrudTable)
        ├── CommentManager
        └── SiteSettings

# 公共组件
├── PostCard
├── ProjectCard
├── TimelineItem
├── CommentList
├── CommentForm
├── TagCloud
├── MarkdownRenderer
├── Pagination
├── CrudTable (通用增删改查)
├── ImageUploader
├── ThemeToggle
├── LoadingSpinner
├── EmptyState
└── NotFound
```

---

## 数据流

### 全局状态 (Pinia)

| Store | 内容 |
|-------|------|
| `useAuthStore` | Token、当前用户、login/logout 方法 |
| `useSiteStore` | 站点配置（标题、关于我、建站日期等） |
| `useThemeStore` | 主题 (light/dark)、切换方法，持久化 localStorage |

### 数据流向

- 前台：Vue Router → 页面组件 → fetch API → 渲染
- 后台：路由守卫校验 JWT → 页面组件 → fetch + Bearer Token → API
- 深色主题：provide/inject 全局注入
- 页面数据（文章列表等）由各页面组件独立管理，不放入全局 Store

---

## 特殊功能

### DeepSeek AI 总结

- posts 表 ai_summary 字段存储
- 文章发布/更新时后端异步调用 DeepSeek API 生成摘要
- 前端在文章卡片和详情页标题下方展示

### 字数与阅读时间

- 前端根据 Markdown 内容实时计算
- 中文字数 = 去除空白后字符数，阅读时间 = 字数 ÷ 300 字/分钟
- 文章标题下方展示："约 xx 字 · 阅读约 x 分钟"

### 音乐播放器

- 自定义 UI，网易云歌单 API 做数据源
- 指定歌单 ID → 拉取播放列表 → 播放器展示

### 评论系统

- 匿名评论，填写昵称即可发表
- IP 属地显示
- 频率限制：同 IP 每分钟最多 3 条
- 评论开关：每篇文章可单独开启/关闭评论
- IP 封禁：后台可封禁/解封 IP

### 页脚运营时间

- site_settings 存建站日期
- Footer 实时计算并显示："本站已运行 xxx 天"
- 显示 CC BY-NC-SA 4.0 协议

### 深色模式

- 手动切换 + 跟随系统，持久化到 localStorage

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
- 评论频率限制 3条/分钟/IP
- IP 封禁机制
- SQL 参数化查询（Drizzle ORM 默认安全）

---

## 测试

- 后端：Vitest + `app.request()` 集成测试，覆盖核心路径
- 前端：Vitest + @vue/test-utils 单元测试，覆盖核心组件
- E2E：不上，个人项目手动验证

---

## 部署

- 前端：`npm run build` → scp 上传 → OpenResty 托管
- 后端：git pull → npm install → PM2 reload
- PM2 守护 Hono 进程，自动重启
- SQLite 文件定期备份

---

## 分阶段实施

| 阶段 | 内容 |
|------|------|
| 第一阶段 | Vue3 页面搭建，Mock 数据填充，页面可预览 |
| 第二阶段 | 后端 API + 数据库 + 文章 CRUD |
| 第三阶段 | JWT 登录 + 后台管理 + 评论系统 |
| 第四阶段 | 音乐播放器、AI 总结、深色模式、页脚运营时间 |
