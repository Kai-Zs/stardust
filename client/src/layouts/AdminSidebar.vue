<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">星霜记</h2>
    <nav class="sidebar-nav">
      <router-link v-for="item in menu" :key="item.to" :to="item.to" class="sidebar-link">{{ item.label }}</router-link>
    </nav>
    <div class="sidebar-footer">
      <router-link to="/" class="back-link">&larr; 返回站点</router-link>
    </div>
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
.sidebar {
  width: 220px;
  min-width: 220px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.sidebar-title {
  font-family: var(--font-serif);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}
.sidebar-link {
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  border-radius: var(--radius);
  transition: background var(--transition-fast), color var(--transition-fast);
}
.sidebar-link:hover {
  background: var(--color-bg);
  color: var(--color-accent);
  text-decoration: none;
}
.sidebar-link.router-link-exact-active {
  background: var(--color-bg);
  color: var(--color-accent);
  font-weight: 600;
}
.sidebar-footer {
  padding-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}
.back-link { transition: color var(--transition-fast); }
.back-link:hover { color: var(--color-accent); }
</style>
