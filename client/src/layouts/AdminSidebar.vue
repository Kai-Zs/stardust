<template>
  <aside style="width:220px;background:var(--color-surface);border-right:1px solid var(--color-border);padding:1.5rem;">
    <h2 style="font-family:var(--font-serif);margin-bottom:1.5rem;">星霜记</h2>
    <nav style="display:flex;flex-direction:column;gap:0.3rem;">
      <router-link v-for="item in menu" :key="item.to" :to="item.to" style="padding:0.5rem 0;font-size:0.95rem;">{{ item.label }}</router-link>
    </nav>
    <div style="margin-top:auto;padding-top:2rem;font-size:0.85rem;color:var(--color-text-secondary);">
      <router-link to="/">← 返回站点</router-link>
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
