import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.path.startsWith('/admin') && to.name !== 'login' && !auth.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
