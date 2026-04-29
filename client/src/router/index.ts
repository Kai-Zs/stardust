import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('../pages/HomePage.vue'), meta: { title: '首页', description: '星霜记 — 岁月流转，记录时光' } },
      { path: 'blog', name: 'blog', component: () => import('../pages/BlogList.vue'), meta: { title: '博客', description: '用文字记录每一段值得留恋的时光' } },
      {
        path: 'blog/:slug',
        name: 'blog-detail',
        component: () => import('../pages/BlogDetail.vue'),
        meta: { title: '文章', description: '' },
      },
      { path: 'projects', name: 'projects', component: () => import('../pages/ProjectsPage.vue'), meta: { title: '项目', description: '代码是另一种诗歌' } },
      { path: 'about', name: 'about', component: () => import('../pages/AboutPage.vue'), meta: { title: '关于', description: '关于这个博客和它背后的人' } },
      { path: 'timeline', name: 'timeline', component: () => import('../pages/TimelinePage.vue'), meta: { title: '时间线', description: '回首来路，每一步都是风景' } },
      { path: 'friends', name: 'friends', component: () => import('../pages/FriendLinksPage.vue'), meta: { title: '友链', description: '在茫茫网海中与有趣的灵魂相遇' } },
      { path: 'music', name: 'music', component: () => import('../pages/MusicPage.vue'), meta: { title: '音乐', description: '愿每一段旋律都能温柔你的时光' } },
    ],
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      { path: 'login', name: 'login', component: () => import('../pages/admin/LoginPage.vue') },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../pages/admin/DashboardPage.vue'),
      },
      {
        path: 'posts',
        name: 'admin-posts',
        component: () => import('../pages/admin/PostListPage.vue'),
      },
      {
        path: 'posts/new',
        name: 'admin-post-new',
        component: () => import('../pages/admin/PostEditorPage.vue'),
      },
      {
        path: 'posts/:id/edit',
        name: 'admin-post-edit',
        component: () => import('../pages/admin/PostEditorPage.vue'),
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('../pages/admin/ProjectManagerPage.vue'),
      },
      {
        path: 'timeline',
        name: 'admin-timeline',
        component: () => import('../pages/admin/TimelineManagerPage.vue'),
      },
      {
        path: 'friend-links',
        name: 'admin-friend-links',
        component: () => import('../pages/admin/FriendLinkManagerPage.vue'),
      },
      {
        path: 'comments',
        name: 'admin-comments',
        component: () => import('../pages/admin/CommentManagerPage.vue'),
      },
      {
        path: 'attachments',
        name: 'admin-attachments',
        component: () => import('../pages/admin/AttachmentManagerPage.vue'),
      },
      {
        path: 'backup',
        name: 'admin-backup',
        component: () => import('../pages/admin/BackupManagerPage.vue'),
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../pages/admin/SiteSettingsPage.vue'),
      },
      {
        path: 'operation-logs',
        name: 'admin-operation-logs',
        component: () => import('../pages/admin/OperationLogsPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../components/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.path.startsWith('/admin') && to.name !== 'login' && !auth.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
