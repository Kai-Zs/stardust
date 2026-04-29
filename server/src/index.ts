import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'
import { initDb } from './db/index.js'
import { errorHandler } from './middleware/error-handler.js'
import { authMiddleware } from './middleware/auth.js'

// 公开路由
import siteRoutes from './routes/site.js'
import postsRoutes from './routes/posts.js'
import commentsRoutes from './routes/comments.js'
import projectsRoutes from './routes/projects.js'
import timelineRoutes from './routes/timeline.js'
import friendLinksRoutes from './routes/friend-links.js'

// 管理路由
import adminAuthRoutes from './routes/admin/auth.js'
import adminPostsRoutes from './routes/admin/posts.js'
import adminCommentsRoutes from './routes/admin/comments.js'
import adminSettingsRoutes from './routes/admin/settings.js'
import adminDashboardRoutes from './routes/admin/dashboard.js'
import adminOperationLogsRoutes from './routes/admin/operation-logs.js'
import adminAttachmentsRoutes from './routes/admin/attachments.js'
import adminBackupRoutes from './routes/admin/backup.js'

// 初始化数据库
initDb()

const app = new Hono().basePath('/api')

// 全局错误处理
app.onError(errorHandler)

// CORS
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// 静态文件服务（上传的附件）
app.use('/uploads/*', serveStatic({ root: './' }))

// ========== 公开路由（无需认证） ==========
app.route('/', siteRoutes)
app.route('/', postsRoutes)
app.route('/', commentsRoutes)
// 公开 GET 路由
app.route('/', projectsRoutes)
app.route('/', timelineRoutes)
app.route('/', friendLinksRoutes)

// ========== 管理路由（/admin/ 前缀 + JWT） ==========
// auth 路由（login 不需要认证，me 需要）
app.use('/admin/me', authMiddleware)
app.route('/admin', adminAuthRoutes)
// 其余管理路由需要认证
app.use('/admin/posts', authMiddleware)
app.use('/admin/posts/*', authMiddleware)
app.use('/admin/comments', authMiddleware)
app.use('/admin/comments/*', authMiddleware)
app.use('/admin/dashboard', authMiddleware)
app.use('/admin/operation-logs', authMiddleware)
app.use('/admin/settings', authMiddleware)
app.use('/admin/settings/*', authMiddleware)
app.use('/admin/attachments', authMiddleware)
app.use('/admin/attachments/*', authMiddleware)
app.use('/admin/backup', authMiddleware)
app.use('/admin/backup/*', authMiddleware)
app.route('/admin', adminPostsRoutes)
app.route('/admin', adminCommentsRoutes)
app.route('/admin', adminDashboardRoutes)
app.route('/admin', adminOperationLogsRoutes)
app.route('/admin', adminSettingsRoutes)
app.route('/admin', adminAttachmentsRoutes)
app.route('/admin', adminBackupRoutes)

// ========== 前端兼容路由（无 /admin/ 前缀但需 JWT） ==========
// 前端硬编码了 /projects (POST), /timeline (POST) 等路径
// 将管理路由也挂载到根路径，但加上 JWT 认证
app.use('/projects', authMiddleware)
app.use('/projects/*', authMiddleware)
app.use('/timeline', authMiddleware)
app.use('/timeline/*', authMiddleware)
app.use('/friend-links', authMiddleware)
app.use('/friend-links/*', authMiddleware)
app.use('/settings', authMiddleware)
app.use('/settings/*', authMiddleware)
app.use('/attachments', authMiddleware)
app.use('/attachments/*', authMiddleware)

// 挂载管理路由到根路径（供前端兼容使用）
app.route('/', adminSettingsRoutes)
app.route('/', adminAttachmentsRoutes)
app.route('/', adminPostsRoutes)
app.route('/', adminCommentsRoutes)
app.route('/', adminDashboardRoutes)
app.route('/', adminOperationLogsRoutes)
app.route('/', adminBackupRoutes)
app.route('/', adminAuthRoutes)

// 启动服务器
const port = Number(process.env.PORT || 3000)
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`✨ 星霜记后端已启动: http://localhost:${info.port}/api`)
})
