# 星霜记 / Stardust — 实施计划

> **适用执行方式:** 推荐使用 superpowers:subagent-driven-development 或 superpowers:executing-plans 逐任务实施。步骤使用 `- [ ]` 勾选语法追踪进度。

**目标:** 按四阶段将设计文档落地为完整可运行的综合个人网站。

**架构:** 前后端分离——Vue3 SPA 纯静态部署 + Hono 纯 API 服务，SQLite 存储，OpenResty 反代统一入口。

**技术栈:** Vue3 + TypeScript + Vite + Pinia + Vue Router（前端）| Hono + TypeScript + Drizzle ORM + SQLite（后端）| markdown-it + KaTeX + highlight.js + DOMPurify（内容渲染）

---

## 文件结构

```
blog/
├── client/                          # 前端 (Vue3 + Vite)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env                        # VITE_API_BASE=http://localhost:3000/api
│   ├── .env.production             # VITE_API_BASE=/api
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── style.css               # 全局样式 + CSS 变量 (温暖文艺风)
│       ├── api/index.ts            # fetch 封装 + 错误拦截
│       ├── router/index.ts         # 路由配置 + 导航守卫
│       ├── stores/
│       │   ├── auth.ts             # useAuthStore
│       │   ├── site.ts             # useSiteStore
│       │   ├── theme.ts            # useThemeStore
│       │   └── tags.ts             # useTagsStore
│       ├── composables/
│       │   └── useReadingTime.ts   # 字数 + 阅读时间计算
│       ├── utils/
│       │   └── markdown.ts         # markdown-it 配置
│       ├── mock/data.ts            # Mock 数据 (阶段一用)
│       ├── components/
│       │   ├── NavBar.vue
│       │   ├── Footer.vue
│       │   ├── ThemeToggle.vue
│       │   ├── PostCard.vue
│       │   ├── ProjectCard.vue
│       │   ├── TimelineEntry.vue
│       │   ├── CommentList.vue
│       │   ├── CommentForm.vue
│       │   ├── TagCloud.vue
│       │   ├── MarkdownRenderer.vue
│       │   ├── Pagination.vue
│       │   ├── ImageUploader.vue
│       │   ├── LoadingSpinner.vue
│       │   ├── EmptyState.vue
│       │   ├── NotFound.vue
│       │   ├── CaptchaInput.vue
│       │   └── ConfirmDialog.vue
│       ├── layouts/
│       │   ├── DefaultLayout.vue
│       │   ├── AdminLayout.vue
│       │   └── AdminSidebar.vue
│       └── pages/
│           ├── HomePage.vue
│           ├── BlogList.vue
│           ├── BlogDetail.vue
│           ├── ProjectsPage.vue
│           ├── AboutPage.vue
│           ├── TimelinePage.vue
│           ├── FriendLinksPage.vue
│           ├── MusicPage.vue
│           │   ├── PlayerControls.vue
│           │   └── Playlist.vue
│           └── admin/
│               ├── LoginPage.vue
│               ├── DashboardPage.vue
│               ├── PostListPage.vue
│               ├── PostEditorPage.vue
│               ├── ProjectManagerPage.vue
│               ├── TimelineManagerPage.vue
│               ├── FriendLinkManagerPage.vue
│               ├── CommentManagerPage.vue
│               ├── AttachmentManagerPage.vue
│               ├── BackupManagerPage.vue
│               ├── SiteSettingsPage.vue
│               └── OperationLogsPage.vue
│
├── server/                          # 后端 (Hono + TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                 # Hono 入口
│       ├── db/
│       │   ├── index.ts             # Drizzle 初始化
│       │   └── schema.ts            # 全部表定义
│       ├── middleware/
│       │   ├── auth.ts              # JWT 验证中间件
│       │   ├── error-handler.ts     # 全局错误处理
│       │   └── rate-limit.ts        # 评论频率限制
│       ├── routes/
│       │   ├── site.ts
│       │   ├── posts.ts
│       │   ├── projects.ts
│       │   ├── timeline.ts
│       │   ├── friend-links.ts
│       │   ├── comments.ts
│       │   ├── music.ts
│       │   ├── auth.ts
│       │   ├── rss.ts
│       │   ├── sitemap.ts
│       │   └── admin/
│       │       ├── dashboard.ts
│       │       ├── posts.ts
│       │       ├── projects.ts
│       │       ├── timeline.ts
│       │       ├── friend-links.ts
│       │       ├── comments.ts
│       │       ├── ip-blocks.ts
│       │       ├── upload.ts
│       │       ├── attachments.ts
│       │       ├── backup.ts
│       │       ├── settings.ts
│       │       └── operation-logs.ts
│       ├── services/
│       │   └── ai.ts
│       └── utils/
│           ├── ip.ts
│           └── slug.ts
│
└── uploads/                         # 附件存储目录
```

---

# 第一阶段：Vue3 前端基础搭建（Mock 数据，页面可预览）

## Task 1.1: 项目脚手架

**操作:**
- 创建: `client/` — 使用 `npm create vite@latest client -- --template vue-ts`
- 创建: `client/.env` 和 `client/.env.production`
- 修改: `client/index.html` — 加防闪屏 script

### Step 1: 创建 Vite 项目

```bash
cd D:/Documents/玩具/blog
npm create vite@latest client -- --template vue-ts
cd client && npm install
```

### Step 2: 安装核心依赖

```bash
cd client && npm install vue-router pinia @vueuse/head
```

### Step 3: 创建环境变量文件

`client/.env`:
```
VITE_API_BASE=http://localhost:3000/api
```

`client/.env.production`:
```
VITE_API_BASE=/api
```

### Step 4: 修改 index.html 防深色模式闪屏

在 `client/index.html` 的 `<head>` 最前面加入：

```html
<script>
(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')})()
</script>
```

### Step 5: 验证

```bash
cd client && npm run dev
```
打开浏览器确认 Vite 默认页面正常显示。

### Step 6: 提交

```bash
git add client/
git commit -m "chore(client): scaffold Vite + Vue3 + TS project

使用 vite create 初始化前端项目，安装 vue-router/pinia/@vueuse/head 依赖，
配置环境变量，添加深色模式防闪屏 inline script。"
```

---

## Task 1.2: 全局样式 + CSS 变量

**操作:**
- 覆盖: `client/src/style.css`
- 修改: `client/src/main.ts` — 引入样式

### Step 1: 写入全局样式

`client/src/style.css` — 温暖文艺风 CSS 变量 + 全局样式：

```css
/* CSS 变量 — 温暖文艺风 */
:root {
  --color-bg: #fdf6f0;
  --color-surface: #fffaf5;
  --color-text: #4e342e;
  --color-text-secondary: #8d6e63;
  --color-accent: #c17817;
  --color-accent-light: #e8b86d;
  --color-border: #e8d5c4;
  --color-link: #a0522d;
  --font-serif: 'Georgia', 'Noto Serif SC', serif;
  --font-sans: 'Inter', 'PingFang SC', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --max-width: 720px;
  --radius: 8px;
}

/* 深色模式 */
html.dark {
  --color-bg: #1a1614;
  --color-surface: #241e1a;
  --color-text: #e8d5c4;
  --color-text-secondary: #a1887f;
  --color-accent: #e8b86d;
  --color-accent-light: #c17817;
  --color-border: #3d3229;
  --color-link: #d4956b;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 17px; }
body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--color-link); text-decoration: none; }
a:hover { text-decoration: underline; }
h1, h2, h3, h4 { font-family: var(--font-serif); line-height: 1.4; }
code { font-family: var(--font-mono); font-size: 0.9em; }
img { max-width: 100%; height: auto; }
.container { max-width: var(--max-width); margin: 0 auto; padding: 0 1.25rem; }
```

### Step 2: 更新 main.ts

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createHead())
app.mount('#app')
```

### Step 3: 验证 + 提交

```bash
cd client && npm run dev
# 确认无报错
git add client/src/style.css client/src/main.ts
git commit -m "style(client): add warm literary CSS variables and global styles

温暖文艺风配色方案，浅色/深色双主题 CSS 变量，
引入 Pinia/Vue Router/VueUse Head。"
```

---

## Task 1.3: 路由配置 + 导航守卫

**操作:**
- 创建: `client/src/router/index.ts`
- 创建: 所有页面的骨架文件（空组件）
- 修改: `client/src/App.vue`

### Step 1: 先创建所有页面骨架

为每个页面创建最小占位组件，以 `HomePage.vue` 为例：

```vue
<template>
  <div class="container">
    <h1>首页</h1>
    <p>星霜记 / Stardust</p>
  </div>
</template>

<script setup lang="ts">
</script>
```

依次创建所有页面文件：
- `client/src/pages/HomePage.vue`
- `client/src/pages/BlogList.vue`
- `client/src/pages/BlogDetail.vue`
- `client/src/pages/ProjectsPage.vue`
- `client/src/pages/AboutPage.vue`
- `client/src/pages/TimelinePage.vue`
- `client/src/pages/FriendLinksPage.vue`
- `client/src/pages/MusicPage.vue`
- `client/src/pages/admin/LoginPage.vue`
- `client/src/pages/admin/DashboardPage.vue`
- `client/src/pages/admin/PostListPage.vue`
- `client/src/pages/admin/PostEditorPage.vue`
- `client/src/pages/admin/ProjectManagerPage.vue`
- `client/src/pages/admin/TimelineManagerPage.vue`
- `client/src/pages/admin/FriendLinkManagerPage.vue`
- `client/src/pages/admin/CommentManagerPage.vue`
- `client/src/pages/admin/AttachmentManagerPage.vue`
- `client/src/pages/admin/BackupManagerPage.vue`
- `client/src/pages/admin/SiteSettingsPage.vue`
- `client/src/pages/admin/OperationLogsPage.vue`

### Step 2: 创建路由文件

```typescript
// client/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('../pages/HomePage.vue') },
      { path: 'blog', name: 'blog', component: () => import('../pages/BlogList.vue') },
      { path: 'blog/:slug', name: 'blog-detail', component: () => import('../pages/BlogDetail.vue') },
      { path: 'projects', name: 'projects', component: () => import('../pages/ProjectsPage.vue') },
      { path: 'about', name: 'about', component: () => import('../pages/AboutPage.vue') },
      { path: 'timeline', name: 'timeline', component: () => import('../pages/TimelinePage.vue') },
      { path: 'friends', name: 'friends', component: () => import('../pages/FriendLinksPage.vue') },
      { path: 'music', name: 'music', component: () => import('../pages/MusicPage.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      { path: 'login', name: 'login', component: () => import('../pages/admin/LoginPage.vue') },
      { path: 'dashboard', name: 'dashboard', component: () => import('../pages/admin/DashboardPage.vue') },
      { path: 'posts', name: 'admin-posts', component: () => import('../pages/admin/PostListPage.vue') },
      { path: 'posts/new', name: 'admin-post-new', component: () => import('../pages/admin/PostEditorPage.vue') },
      { path: 'posts/:id/edit', name: 'admin-post-edit', component: () => import('../pages/admin/PostEditorPage.vue') },
      { path: 'projects', name: 'admin-projects', component: () => import('../pages/admin/ProjectManagerPage.vue') },
      { path: 'timeline', name: 'admin-timeline', component: () => import('../pages/admin/TimelineManagerPage.vue') },
      { path: 'friend-links', name: 'admin-friend-links', component: () => import('../pages/admin/FriendLinkManagerPage.vue') },
      { path: 'comments', name: 'admin-comments', component: () => import('../pages/admin/CommentManagerPage.vue') },
      { path: 'attachments', name: 'admin-attachments', component: () => import('../pages/admin/AttachmentManagerPage.vue') },
      { path: 'backup', name: 'admin-backup', component: () => import('../pages/admin/BackupManagerPage.vue') },
      { path: 'settings', name: 'admin-settings', component: () => import('../pages/admin/SiteSettingsPage.vue') },
      { path: 'operation-logs', name: 'admin-operation-logs', component: () => import('../pages/admin/OperationLogsPage.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../components/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

export default router
```

### Step 3: 创建布局骨架

`client/src/layouts/DefaultLayout.vue`:
```vue
<template>
  <div>
    <NavBar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
</script>
```

`client/src/layouts/AdminLayout.vue`:
```vue
<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue'
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-main { flex: 1; padding: 2rem; }
</style>
```

`client/src/layouts/AdminSidebar.vue`:
```vue
<template>
  <aside class="sidebar">
    <h2>星霜记</h2>
    <nav>
      <router-link v-for="item in menu" :key="item.to" :to="item.to">{{ item.label }}</router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const menu = [
  { to: '/admin/dashboard', label: '仪表盘' },
  { to: '/admin/posts', label: '文章管理' },
  { to: '/admin/projects', label: '项目管理' },
  { to: '/admin/timeline', label: '时间线' },
  { to: '/admin/friend-links', label: '友链' },
  { to: '/admin/comments', label: '评论管理' },
  { to: '/admin/attachments', label: '附件' },
  { to: '/admin/backup', label: '备份恢复' },
  { to: '/admin/settings', label: '站点设置' },
  { to: '/admin/operation-logs', label: '操作日志' },
]
</script>

<style scoped>
.sidebar { width: 220px; background: var(--color-surface); border-right: 1px solid var(--color-border); padding: 1.5rem; }
.sidebar a { display: block; padding: 0.5rem 0; font-size: 0.95rem; }
</style>
```

### Step 4: 创建 App.vue

```vue
<template>
  <router-view />
</template>
```

### Step 5: 验证 + 提交

```bash
cd client && npm run dev
# 手动点击所有路由链接，确认页面切换正常、无 404
git add client/src/router client/src/pages client/src/layouts client/src/App.vue
git commit -m "feat(client): add Vue Router with all routes and layout skeletons

配置全部前台和后台路由，创建 DefaultLayout/AdminLayout/AdminSidebar，
所有页面使用骨架占位组件。"
```

---

## Task 1.4: Pinia Store 初始化

**操作:**
- 创建: 4 个 Store 文件

### Step 1: useAuthStore

`client/src/stores/auth.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref<{ id: number; username: string; nickname: string } | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('token', t)
  }

  function setUser(u: typeof user.value) {
    user.value = u
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, setToken, setUser, logout }
})
```

### Step 2: useSiteStore

`client/src/stores/site.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSiteStore = defineStore('site', () => {
  const config = ref<Record<string, string>>({})

  function setConfig(data: Record<string, string>) {
    config.value = { ...config.value, ...data }
  }

  function get(key: string) {
    return config.value[key] || ''
  }

  return { config, setConfig, get }
})
```

### Step 3: useThemeStore

`client/src/stores/theme.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    localStorage.setItem('theme', theme.value)
  })

  return { theme, toggle }
})
```

### Step 4: useTagsStore

`client/src/stores/tags.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<string[]>([])
  const lastFetch = ref(0)
  let pendingPromise: Promise<string[]> | null = null

  async function fetchTags(apiBase: string) {
    if (Date.now() - lastFetch.value < 5 * 60 * 1000) return tags.value
    if (pendingPromise) return pendingPromise

    pendingPromise = fetch(`${apiBase}/tags`)
      .then(r => r.json())
      .then(data => {
        tags.value = data
        lastFetch.value = Date.now()
        pendingPromise = null
        return data
      })
      .catch(() => {
        pendingPromise = null
        return tags.value
      })

    return pendingPromise
  }

  return { tags, fetchTags }
})
```

### Step 5: 提交

```bash
git add client/src/stores/
git commit -m "feat(client): add Pinia stores for auth, site, theme and tags

useAuthStore: JWT Token 管理 + 用户状态
useSiteStore: 站点配置缓存
useThemeStore: 深色模式切换 + localStorage 持久化
useTagsStore: 标签缓存 5 分钟过期 + 请求去重"
```

---

## Task 1.5: 公共组件

**操作:**
- 创建: 17 个公共组件

### NavBar

`client/src/components/NavBar.vue`:
```vue
<template>
  <header class="navbar">
    <div class="container nav-inner">
      <router-link to="/" class="logo">星霜记</router-link>
      <nav class="nav-links">
        <router-link to="/blog">博客</router-link>
        <router-link to="/projects">项目</router-link>
        <router-link to="/timeline">时间线</router-link>
        <router-link to="/friends">友链</router-link>
        <router-link to="/music">音乐</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<style scoped>
.navbar { border-bottom: 1px solid var(--color-border); padding: 1rem 0; }
.nav-inner { display: flex; align-items: center; justify-content: space-between; }
.logo { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { font-size: 0.95rem; }
.nav-links a.router-link-exact-active { color: var(--color-accent); font-weight: 600; }
</style>
```

### ThemeToggle

`client/src/components/ThemeToggle.vue`:
```vue
<template>
  <button class="theme-toggle" @click="themeStore.toggle()" :title="themeStore.theme === 'dark' ? '切换浅色' : '切换深色'">
    {{ themeStore.theme === 'dark' ? '☀' : '☾' }}
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle { background: none; border: 1px solid var(--color-border); border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; }
</style>
```

### Footer

`client/src/components/Footer.vue`:
```vue
<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p v-if="siteStore.get('site_created_at')">
        本站已运行 {{ daysRunning }} 天
      </p>
      <p>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a>
        · Powered by <a href="https://github.com/Kai-Zs/stardust" target="_blank">星霜记</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteStore } from '../stores/site'

const siteStore = useSiteStore()

const daysRunning = computed(() => {
  const start = siteStore.get('site_created_at')
  if (!start) return 0
  return Math.floor((Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
})
</script>

<style scoped>
.footer { border-top: 1px solid var(--color-border); padding: 2rem 0; margin-top: 3rem; text-align: center; font-size: 0.85rem; color: var(--color-text-secondary); }
.footer-inner { display: flex; flex-direction: column; gap: 0.3rem; }
</style>
```

### PostCard

`client/src/components/PostCard.vue`:
```vue
<template>
  <article class="post-card">
    <router-link :to="`/blog/${post.slug}`">
      <h3>{{ post.title }}</h3>
    </router-link>
    <div class="meta">
      <span>{{ post.date }}</span>
      <span v-if="post.wordCount">约 {{ post.wordCount }} 字</span>
      <span v-if="post.readingTime">阅读约 {{ post.readingTime }} 分钟</span>
    </div>
    <p class="excerpt">{{ post.excerpt }}</p>
    <div class="tags">
      <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    slug: string
    title: string
    date: string
    excerpt: string
    tags: string[]
    wordCount?: number
    readingTime?: number
  }
}>()
</script>

<style scoped>
.post-card { padding: 1.5rem 0; border-bottom: 1px solid var(--color-border); }
.post-card h3 { font-size: 1.25rem; margin-bottom: 0.3rem; }
.meta { font-size: 0.85rem; color: var(--color-text-secondary); display: flex; gap: 0.75rem; margin-bottom: 0.4rem; }
.excerpt { color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 0.5rem; }
.tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tag { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.15rem 0.6rem; font-size: 0.8rem; }
</style>
```

### 其余公共组件

按同样模式创建骨架版本（先不写完整逻辑，留到后续阶段填充）：

`LoadingSpinner.vue`:
```vue
<template><div class="spinner">加载中...</div></template>
```

`EmptyState.vue`:
```vue
<template><div class="empty"><slot>暂无数据</slot></div></template>
```

`NotFound.vue`:
```vue
<template><div class="container"><h2>404</h2><p>页面不存在</p><router-link to="/">返回首页</router-link></div></template>
```

`ConfirmDialog.vue`:
```vue
<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cancel')">
    <div class="dialog">
      <p>{{ message }}</p>
      <div class="actions">
        <button @click="$emit('confirm')">确认</button>
        <button @click="$emit('cancel')">取消</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ visible: boolean; message: string }>()
defineEmits<{ confirm: []; cancel: [] }>()
</script>
<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.dialog { background: var(--color-surface); padding: 2rem; border-radius: var(--radius); max-width: 400px; }
.actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
</style>
```

`TagCloud.vue`:
```vue
<template>
  <div class="tag-cloud">
    <button v-for="tag in tags" :key="tag" @click="$emit('select', tag)" class="tag-btn">{{ tag }}</button>
  </div>
</template>
<script setup lang="ts">
defineProps<{ tags: string[] }>()
defineEmits<{ select: [tag: string] }>()
</script>
<style scoped>
.tag-cloud { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag-btn { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.3rem 0.8rem; cursor: pointer; font-size: 0.85rem; }
</style>
```

`Pagination.vue`:
```vue
<template>
  <div class="pagination" v-if="totalPages > 1">
    <button :disabled="page <= 1" @click="$emit('change', page - 1)">上一页</button>
    <span>{{ page }} / {{ totalPages }}</span>
    <button :disabled="page >= totalPages" @click="$emit('change', page + 1)">下一页</button>
  </div>
</template>
<script setup lang="ts">
defineProps<{ page: number; totalPages: number }>()
defineEmits<{ change: [page: number] }>()
</script>
<style scoped>
.pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; padding: 2rem 0; }
</style>
```

`ProjectCard.vue`、`TimelineEntry.vue`、`CommentList.vue`、`CommentForm.vue` 同理创建骨架。

### 提交

```bash
git add client/src/components/
git commit -m "feat(client): add shared components with warm literary style

NavBar/Footer/ThemeToggle/PostCard/TagCloud/Pagination 等 17 个公共组件，
包含温暖文艺风样式。部分组件先用骨架版本。"
```

---

## Task 1.6: 前台页面 + Mock 数据

**操作:**
- 创建: `client/src/mock/data.ts`
- 创建: `client/src/api/index.ts`
- 完善: 所有前台页面用 Mock 数据渲染

### Step 1: 创建 Mock 数据

`client/src/mock/data.ts`:
```typescript
export const mockPosts = [
  {
    slug: 'hello-world',
    title: '你好，星霜记',
    date: '2026-04-28',
    excerpt: '这是我的第一篇博客文章，记录这个新站点诞生的时刻。',
    tags: ['生活', '博客'],
    content: `# 你好，星霜记\n\n这是我的第一篇博客文章...\n\n## 为什么叫星霜记\n\n星霜，指岁月流转。记，是记录。\n\n我希望在这里记录技术与生活中的点滴。`,
    wordCount: 156,
    readingTime: 1,
    commentEnabled: true,
  },
  {
    slug: 'vue3-learning',
    title: 'Vue3 学习笔记：组合式 API',
    date: '2026-04-25',
    excerpt: '记录学习 Vue3 Composition API 的心得体会。',
    tags: ['Vue3', '前端'],
    content: `# Vue3 学习笔记\n\n组合式 API 是 Vue3 的核心特性之一...\n\n\`\`\`ts\nconst count = ref(0)\n\`\`\`\n\n数学公式示例：$E = mc^2$`,
    wordCount: 2340,
    readingTime: 8,
    commentEnabled: true,
  },
]

export const mockProjects = [
  { id: 1, name: '星霜记', description: '这个博客本身', tech_stack: ['Vue3', 'Hono', 'SQLite'], github_url: 'https://github.com/Kai-Zs/stardust', homepage_url: null, featured: true },
  { id: 2, name: '音乐播放器', description: '基于网易云 API 的在线音乐播放器', tech_stack: ['Vue3', 'NetEase API'], github_url: 'https://github.com/Kai-Zs/music-player', homepage_url: 'http://39.102.209.242:8090/music', featured: false },
]

export const mockTimeline = [
  { id: 1, title: '创建星霜记', description: '基于 Vue3 + Hono 搭建个人网站', date: '2026-04', icon: '🚀' },
  { id: 2, title: '学习 Vue3', description: '系统学习 Vue3 组合式 API 和 TypeScript', date: '2026-03', icon: '📚' },
  { id: 3, title: '学习 Node.js', description: '开始接触后端开发', date: '2026-02', icon: '🔧' },
]

export const mockFriendLinks = [
  { id: 1, name: 'Example Blog', url: 'https://example.com', description: '一个很棒的技术博客' },
]

export const mockSiteConfig: Record<string, string> = {
  site_title: '星霜记',
  site_description: '岁月流转，记录时光',
  about_me: '## 关于我\n\n一个热爱技术与生活的人。\n\n喜欢用代码构建有趣的东西。',
  site_created_at: '2026-04-28',
}

export const mockPlaylist = {
  playlist_id: '7539826158',
  name: '我的歌单',
  description: '一些喜欢的歌',
}
```

### Step 2: 创建 API 封装

`client/src/api/index.ts`:
```typescript
const baseURL = import.meta.env.VITE_API_BASE || '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  }

  const res = await fetch(`${baseURL}${path}`, { ...options, headers })

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token')
      window.location.hash = '#/admin/login'
    }
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `请求失败 (${res.status})`)
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
```

### Step 3: 完善 HomePage

```vue
<template>
  <div class="container home">
    <section class="hero">
      <h1>{{ siteStore.get('site_title') || '星霜记' }}</h1>
      <p class="subtitle">{{ siteStore.get('site_description') }}</p>
    </section>

    <section class="recent-posts">
      <h2>最近文章</h2>
      <PostCard v-for="post in posts.slice(0, 5)" :key="post.slug" :post="post" />
      <router-link to="/blog" class="more">查看全部 →</router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSiteStore } from '../stores/site'
import PostCard from '../components/PostCard.vue'
import { mockPosts, mockSiteConfig } from '../mock/data'

const siteStore = useSiteStore()
siteStore.setConfig(mockSiteConfig)

const posts = ref(mockPosts)
</script>

<style scoped>
.hero { text-align: center; padding: 4rem 0 2rem; }
.hero h1 { font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.5rem; }
.subtitle { color: var(--color-text-secondary); font-size: 1.1rem; }
.recent-posts h2 { font-size: 1.3rem; margin-bottom: 1rem; }
.more { display: inline-block; margin-top: 1rem; font-size: 0.9rem; }
</style>
```

其余前台页面同理，用 Mock 数据填充。BlogDetail 含 CommentList + CommentForm 骨架，MusicPage 含 PlayerControls + Playlist 骨架。

### Step 4: 验证

```bash
cd client && npm run dev
# 浏览所有前台页面，确认 Mock 数据渲染正常
```

### Step 5: 提交

```bash
git add client/src/pages/ client/src/mock/ client/src/api/ client/src/components/
git commit -m "feat(client): implement public pages with mock data

所有前台页面使用 Mock 数据完整渲染：首页/博客列表/文章详情/项目/
关于/时间线/友链/音乐播放器。api 封装层支持 JWT 自动附带和 401 拦截。"
```

---

## Task 1.7: 后台管理页面

**操作:**
- 完善所有 `/admin` 下页面，用 Mock 数据和表单骨架

各管理页创建完整功能骨架。以 PostEditorPage 为例：

```vue
<template>
  <div class="post-editor">
    <h2>{{ isEdit ? '编辑文章' : '写文章' }}</h2>
    <form @submit.prevent="save">
      <div class="field">
        <label>标题</label>
        <input v-model="form.title" type="text" required />
      </div>
      <div class="field">
        <label>Slug</label>
        <input v-model="form.slug" type="text" required />
      </div>
      <div class="field">
        <label>摘要</label>
        <textarea v-model="form.excerpt" rows="3"></textarea>
      </div>
      <div class="field">
        <label>标签（逗号分隔）</label>
        <input v-model="tagsInput" type="text" placeholder="Vue3, TypeScript" />
      </div>
      <div class="field">
        <label>封面图 URL</label>
        <input v-model="form.cover" type="text" />
      </div>
      <div class="field">
        <label>内容 (Markdown)</label>
        <div class="editor-area">
          <textarea v-model="form.content" rows="20" class="md-input"></textarea>
          <div class="preview">
            <MarkdownRenderer :content="form.content" />
          </div>
        </div>
      </div>
      <div class="field">
        <label>
          <input type="checkbox" v-model="form.commentEnabled" /> 允许评论
        </label>
      </div>
      <div class="actions">
        <button type="button" @click="saveDraft">存草稿</button>
        <button type="submit">发布</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownRenderer from '../../components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '', slug: '', excerpt: '', content: '', cover: '',
  commentEnabled: true,
})
const tagsInput = ref('')

let autoSaveTimer: number | null = null

onMounted(() => {
  // 从 localStorage 恢复草稿
  const draft = localStorage.getItem('post-draft')
  if (draft) {
    try {
      const d = JSON.parse(draft)
      form.value = { ...form.value, ...d }
      if (confirm('检测到未保存的草稿，是否恢复？')) return
    } catch {}
  }
  // 每 30 秒自动保存
  autoSaveTimer = window.setInterval(() => {
    localStorage.setItem('post-draft', JSON.stringify(form.value))
  }, 30000)
  window.addEventListener('beforeunload', warnUnsaved)
})

onBeforeUnmount(() => {
  if (autoSaveTimer) clearInterval(autoSaveTimer)
  window.removeEventListener('beforeunload', warnUnsaved)
})

function warnUnsaved(e: BeforeUnloadEvent) {
  e.preventDefault()
  e.returnValue = ''
}

async function saveDraft() { /* 存草稿逻辑（阶段二对接 API） */ }
async function save() {
  localStorage.removeItem('post-draft')
  router.push('/admin/posts')
}
</script>
```

其余管理页同理创建完整骨架（表格 + 表单 + 确认弹窗）。

### 提交

```bash
git add client/src/pages/admin/
git commit -m "feat(client): implement admin pages with full UI skeletons

所有后台管理页面：仪表盘/文章管理(含自动保存草稿)/项目管理/时间线/
友链/评论/附件/备份/站点设置/操作日志。含表单交互和敏感操作确认弹窗。"
```

---

## Task 1.8: MarkdownRenderer + Composables

**操作:**
- 创建: `client/src/components/MarkdownRenderer.vue`
- 创建: `client/src/composables/useReadingTime.ts`
- 创建: `client/src/utils/markdown.ts`

### Step 1: 安装 markdown 渲染依赖

```bash
cd client && npm install markdown-it katex highlight.js dompurify
npm install -D @types/markdown-it @types/dompurify
```

### Step 2: markdown 工具函数

`client/src/utils/markdown.ts`:
```typescript
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import katex from 'katex'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

// KaTeX 集成：在 markdown-it 渲染前处理 $$...$$ 和 $...$
md.use((md) => {
  const defaultRender = md.render.bind(md)
  md.render = (src: string, env?: unknown) => {
    // 块级公式 $$...$$
    src = src.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula: string) => {
      try { return katex.renderToString(formula.trim(), { displayMode: true }) }
      catch { return `<pre>${formula}</pre>` }
    })
    // 行内公式 $...$
    src = src.replace(/\$(.*?)\$/g, (_, formula: string) => {
      try { return katex.renderToString(formula.trim(), { displayMode: false }) }
      catch { return `$${formula}$` }
    })
    return defaultRender(src, env)
  }
})

export function renderMarkdown(content: string): string {
  const raw = md.render(content)
  return DOMPurify.sanitize(raw)
}
```

### Step 3: useReadingTime composable

`client/src/composables/useReadingTime.ts`:
```typescript
import { computed } from 'vue'

export function useReadingTime(content: string) {
  const wordCount = computed(() => {
    return content.replace(/\s/g, '').length
  })

  const readingTime = computed(() => {
    return Math.max(1, Math.round(wordCount.value / 300))
  })

  return { wordCount, readingTime }
}
```

### Step 4: MarkdownRenderer 组件

```vue
<template>
  <div class="markdown-body" v-html="rendered" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps<{ content: string }>()
const rendered = computed(() => renderMarkdown(props.content))
</script>

<style scoped>
.markdown-body { line-height: 1.85; }
.markdown-body :deep(h2) { font-size: 1.5rem; margin: 2rem 0 0.8rem; }
.markdown-body :deep(h3) { font-size: 1.2rem; margin: 1.5rem 0 0.5rem; }
.markdown-body :deep(p) { margin-bottom: 1rem; }
.markdown-body :deep(code) { background: var(--color-surface); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
.markdown-body :deep(pre) { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem; overflow-x: auto; margin: 1rem 0; }
.markdown-body :deep(blockquote) { border-left: 3px solid var(--color-accent); padding-left: 1rem; color: var(--color-text-secondary); margin: 1rem 0; }
.markdown-body :deep(img) { border-radius: var(--radius); cursor: pointer; }
</style>
```

### Step 5: 验证 + 提交

```bash
cd client && npm run dev
# 打开 BlogDetail 页面，确认 Markdown 渲染正常、代码高亮生效、公式渲染正常
git add client/src/utils/ client/src/composables/ client/src/components/MarkdownRenderer.vue client/package.json
git commit -m "feat(client): add MarkdownRenderer with KaTeX, code highlighting and XSS protection

集成 markdown-it + KaTeX 数学公式 + highlight.js 代码高亮 + DOMPurify XSS 防护。
useReadingTime composable 计算字数和阅读时间。"
```

---

## Task 1.9: MusicPage 子组件

**操作:**
- 创建: `client/src/pages/MusicPage/PlayerControls.vue`
- 创建: `client/src/pages/MusicPage/Playlist.vue`
- 完善: `MusicPage.vue`

模拟播放器 UI，用 Mock 歌单数据填充（阶段四接真实 API）。

### Step 1: PlayerControls

```vue
<template>
  <div class="player-controls">
    <div class="now-playing" v-if="current">
      <div class="cover">{{ current.cover }}</div>
      <div>
        <div class="song-name">{{ current.name }}</div>
        <div class="artist">{{ current.artist }}</div>
      </div>
    </div>
    <div class="controls">
      <button @click="prev">⏮</button>
      <button @click="toggle">⏯</button>
      <button @click="next">⏭</button>
    </div>
    <div class="progress">进度条（阶段四实现）</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const current = ref<{ name: string; artist: string; cover: string } | null>(null)
const playing = ref(false)
function toggle() { playing.value = !playing.value }
function prev() {}
function next() {}
</script>
```

### Step 2: Playlist

```vue
<template>
  <ul class="playlist">
    <li v-for="song in songs" :key="song.id" @click="$emit('select', song)">
      {{ song.name }} - {{ song.artist }}
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{ songs: { id: number; name: string; artist: string }[] }>()
defineEmits<{ select: [song: unknown] }>()
</script>
```

### 提交

```bash
git add client/src/pages/MusicPage/
git commit -m "feat(client): add MusicPage with PlayerControls and Playlist

音乐播放器 UI 骨架，PlayerControls 展示当前播放/控制按钮，
Playlist 展示歌单列表。当前使用 Mock 数据。"
```

---

## Task 1.10: 第一阶段收尾

### Step 1: 确保所有路由可访问

```bash
cd client && npm run dev
# 逐个检查所有前台和后台路由，确认无异常
```

### Step 2: 收尾提交

```bash
git add -A
git commit -m "feat(client): complete Phase 1 — all pages with mock data ready for preview

第一阶段完成：Vue3 项目初始化、路由配置、Pinia Store、
全部公共组件、全部前台和后台页面、Mock 数据、
MarkdownRenderer (KaTeX+highlight.js+DOMPurify)、
MusicPage 子组件、自动保存草稿功能。"
```

---

# 第二阶段：后端 API + 数据库 + 文章 CRUD

（后续阶段的详细任务结构将按同样粒度展开，这里先给出概要框架，实施时为每项补充完整的 Step 细节）

## Task 2.1: 后端项目初始化
- 创建 `server/` 目录，初始化 Hono + TypeScript + Drizzle ORM 项目
- 安装 `hono @hono/node-server drizzle-orm better-sqlite3 bcryptjs jsonwebtoken`
- 安装开发依赖: `tsx @types/better-sqlite3 @types/bcryptjs @types/jsonwebtoken`
- 配置 tsconfig、package.json scripts

## Task 2.2: 数据库 Schema 与迁移
- 创建 `server/src/db/schema.ts` — 全部 12 张表的 Drizzle 定义
- 创建 `server/src/db/index.ts` — Drizzle 初始化 + migrate 函数
- 运行首次迁移，生成 SQLite 数据库文件

## Task 2.3: 中间件
- `error-handler.ts` — 全局异常捕获
- `auth.ts` — JWT 验证中间件
- `rate-limit.ts` — 评论频率限制 (3条/分钟/IP, 内存 Map)

## Task 2.4: 公开接口
- `site.ts` — GET /api/site
- `posts.ts` — GET /api/posts (分页+标签+置顶), GET /api/posts/:slug
- `tags.ts` — GET /api/tags
- `projects.ts` — GET /api/projects
- `timeline.ts` — GET /api/timeline
- `friend-links.ts` — GET /api/friend-links
- `music.ts` — GET /api/music/playlist

## Task 2.5: 文件上传
- `upload.ts` — POST /api/admin/upload (multer, 10MB 限制)
- `attachments.ts` — CRUD 附件管理

## Task 2.6: 前端接入真实 API
- 修改 `client/src/api/index.ts`，替换 Mock 调用为真实 fetch
- 移除 mock 依赖，各页面从 API 获取数据

## Task 2.7: 第二阶段测试 + 收尾

---

# 第三阶段：认证 + 后台管理 + 评论系统 + 评审遗留修复

> 本阶段同时处理第二阶段第二轮评审（phase2-review-round2）遗留的 14 个问题。
> 来源标记：[P3] = 评审 P3 项，[ARCH] = 架构/阶段三阻塞项。

## Task 3.1: JWT 认证 [ARCH: 验证码]
- `auth.ts` — GET /api/auth/captcha, POST /api/auth/login, GET /api/auth/me
- `bcryptjs` 密码验证，`jsonwebtoken` Token 签发
- 验证码内存存储 (Map, 5 分钟 TTL)
- [ARCH] **LoginPage.vue** — 将空函数 `refreshCaptcha()` 对接真实验证码 API，`captcha` 字段加入登录请求体
- [ARCH] **Token 存储安全** — 评估 httpOnly cookie 方案（需后端 Set-Cookie），当前 localStorage 暂保留但记录安全风险

## Task 3.2: 后台 CRUD [ARCH: DashboardPage/PostListPage/PostEditorPage]
- `admin/posts.ts` — 文章增删改（含 slug 自动生成、AI 摘要触发）
- `admin/projects.ts` — 项目 CRUD
- `admin/timeline.ts` — 时间线 CRUD
- `admin/friend-links.ts` — 友链 CRUD
- `admin/settings.ts` — 站点设置读写
- `admin/dashboard.ts` — 仪表盘数据聚合
- [ARCH] **DashboardPage.vue** — 从 API 获取真实统计数据（发布/草稿/待审核），移除 `siteCreatedAt` 硬编码 `2022-01-01`，改为从 `siteStore.config.site_created_at` 读取
- [ARCH] **PostListPage.vue** — 文章 status 从 API 返回值读取，移除硬编码
- [ARCH] **PostEditorPage.vue** — `publish()` 包裹 try-catch，失败时 toast.error 提示
- [ARCH] **SiteSettingsPage.vue** — `page_size` 类型统一（string/number 不一致），使用 typed payload

## Task 3.3: 评论系统 [ARCH: CommentManagerPage/BlogDetail]
- `comments.ts` — GET/POST /api/comments（含频率限制、IP 属地查询）
- `admin/comments.ts` — 审核/隐藏/删除
- `ip-blocks.ts` — IP 封禁/解封
- [ARCH] **CommentManagerPage.vue** — "隐藏"操作对接 `adminStore.hideComment(id)` 真实 API
- [ARCH] **CommentManagerPage.vue** — `banIp()` 对接 `api.post('/ip-bans', { ip })`，添加确认弹窗
- [ARCH] **BlogDetail.vue** — `handleCommentSubmit` 对接 `api.post('/comments', ...)` 真实提交

## Task 3.4: 操作审计日志 [ARCH: OperationLogsPage]
- `operation-logs.ts` — 统一日志写入函数 + 后台查看分页接口
- 各管理接口关键操作后调用日志写入
- [ARCH] **OperationLogsPage.vue** — 移除硬编码 mock 数据，对接 `adminStore.fetchOperationLogs()` 真实 API

## Task 3.5: 备份恢复 [ARCH: BackupManagerPage]
- `backup.ts` — 下载备份（压缩 .db + uploads/）
- `backup.ts` — 恢复备份（先自动备份当前，返回 503 维护模式）
- [ARCH] **BackupManagerPage.vue** — `doRestore()` 已用 FileReader 读取文件，需对接 `api.post('/backup/restore', ...)` 真实恢复

## Task 3.6: 前端页面接入 API + Mock 清理 [ARCH: mockSiteConfig]
- LoginPage 接验证码 + JWT 登录
- 各管理页接入真实 CRUD API
- CommentManager 接审核/封禁操作
- 敏感操作确认弹窗
- [ARCH] **HomePage.vue** — 移除 `import { mockSiteConfig }`，改为 `siteStore.init()` 从 `/api/site` 获取配置
- [ARCH] **AboutPage.vue** — 同上，移除 mockSiteConfig 导入
- [ARCH] **blog.ts** — 移除 mock 数据和 300ms delay()，所有 fetch 走真实 API
- [P3] **blog.ts** — `Comment` 类型独立定义，不再从 mock 类型重导出
- [P3] **PostListPage.vue** — 移除 `p.id || i+1` fallback，统一使用 API 返回的 id
- **删除或归档** `client/src/mock/data.ts`（确认所有引用已清除后）

## Task 3.7: 无障碍与质量增强 [P3: 全部剩余项]
- [P3] **EmptyState.vue** — 添加 `role="status"` 和 `aria-live="polite"`
- [P3] **PlayerControls.vue** — 播放/暂停按钮添加 `title` 属性（`title="播放"` / `title="暂停"`）
- [P3] **TagCloud.vue** — 标签按钮添加 `aria-pressed` 和 `aria-label`
- [P3] **HomePage.vue** — `useThemeStore()` 初始化移入 `App.vue` 或 router `beforeEach`，确保所有页面主题一致生效

## Task 3.8: 第三阶段测试 + 收尾
- 全量回归测试，确认所有 mock 已清除
- 确认所有管理页 CRUD 操作正常
- 确认评论系统完整流程（提交→审核→显示→封禁）
- 确认备份恢复完整流程
- 提交评审遗留修复的总结报告

---

# 第四阶段：锦上添花

## Task 4.1: 音乐播放器
- 前端接入网易云 API 获取真实歌单
- 缓存策略 (2 小时 localStorage)
- 播放控制逻辑完善
- 硬编码兜底歌单
- API 挂掉时的友好提示

## Task 4.2: DeepSeek AI 摘要
- `services/ai.ts` — DeepSeek API 调用 + 重试逻辑
- 文章发布时异步触发
- 后台"重新生成摘要"按钮
- 前端展示：正文顶部折叠区域

## Task 4.3: RSS + Sitemap
- `rss.ts` — 最近 20 篇全文 (2000 字符截断)
- `sitemap.ts` — 文章最多 100 个 + 其他公开页面

## Task 4.4: SEO
- `@vueuse/head` 动态设置 title/description/OG 标签
- 各页面设置关键 meta

## Task 4.5: 深色模式完善
- 确保所有组件在深色模式下显示正常
- 代码高亮主题随深色模式切换

## Task 4.6: 图片懒加载 + Lightbox
- MarkdownRenderer 图片自动 `loading="lazy"`
- 点击放大预览

## Task 4.7: 第四阶段测试 + 完整联调

## Task 4.8: 部署脚本
- 创建 `deploy.sh` — 构建前端、scp 上传、后端 git pull + PM2 reload
- OpenResty 配置文件模板
- PM2 ecosystem 配置文件

---

## 验证清单

部署后逐项确认：

- [ ] 所有公开页面可访问，无 404
- [ ] 后台登录 + JWT 正常，Token 过期后自动跳登录
- [ ] 文章增删改查 + Markdown 渲染正常
- [ ] KaTeX 数学公式、代码高亮显示正确
- [ ] 评论发表 + 频率限制 + IP 属地 + 封禁正常
- [ ] 文件上传 + 附件管理正常
- [ ] 备份下载 + 恢复正常
- [ ] 音乐播放器缓存 + 兜底正常
- [ ] AI 摘要仅在首次发布时触发，手动重生成正常
- [ ] 深色模式切换 + 防闪屏正常
- [ ] RSS + Sitemap 可访问
- [ ] SEO title/description/OG 标签正确
- [ ] Footer 运营天数 + CC 协议显示正常
- [ ] 操作审计日志记录并可分页查看
- [ ] 敏感操作二次确认弹窗
- [ ] POST /api/auth/login 需验证码

### 评审遗留项验收（第二轮评审 14 项）

- [ ] [P3] EmptyState 有 role="status" + aria-live
- [ ] [P3] PlayerControls 播放/暂停按钮有 title 属性
- [ ] [P3] TagCloud 标签按钮有 aria-pressed + aria-label
- [ ] [P3] useThemeStore 初始化在 App.vue 或 router beforeEach，所有页面生效
- [ ] [P3] MusicPage duration 接入 HTMLAudioElement 真实时长（第四阶段）
- [ ] [P3] DashboardPage siteCreatedAt 从 siteStore 读取，不再硬编码
- [ ] [P3] Comment 类型独立定义，不从 mock 重导出
- [ ] [ARCH] HomePage/AboutPage 移除 mockSiteConfig 导入，改用 siteStore.init()
- [ ] [ARCH] BlogDetail 评论提交对接真实 API
- [ ] [ARCH] OperationLogsPage 对接真实 API，移除 mock 数据
- [ ] [ARCH] CommentManagerPage hideComment/banIp 对接真实 API + 确认弹窗
- [ ] [ARCH] Token 存储评估 httpOnly cookie 方案
- [ ] [ARCH] BackupManagerPage doRestore 对接 POST /backup/restore
- [ ] [ARCH] mock/data.ts 已删除或归档，无残留引用
