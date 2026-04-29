<template>
  <div class="dashboard-page">
    <div class="admin-page-header">
      <div>
        <h1>仪表盘</h1>
        <div class="admin-page-subtitle">站点概览与快捷操作</div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-number">{{ stats.totalPosts }}</div>
        <div class="stat-label">文章总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-number">{{ stats.publishedPosts }}</div>
        <div class="stat-label">已发布</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-number">{{ stats.draftPosts }}</div>
        <div class="stat-label">草稿</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💬</div>
        <div class="stat-number">{{ stats.pendingComments }}</div>
        <div class="stat-label">待审核评论</div>
      </div>
    </div>

    <!-- 站点运行天数 -->
    <div class="uptime-info">
      站点已运行 <strong>{{ daysRunning }}</strong> 天
    </div>

    <!-- 最新评论 -->
    <div class="section admin-fade-in">
      <h2>最新评论</h2>
      <table class="admin-table" v-if="recentComments.length > 0">
        <thead>
          <tr>
            <th>文章</th>
            <th>昵称</th>
            <th>内容</th>
            <th>时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in recentComments" :key="c.id">
            <td>{{ c.articleTitle }}</td>
            <td>{{ c.nickname }}</td>
            <td class="comment-content">{{ c.content }}</td>
            <td>{{ c.time }}</td>
            <td>
              <span class="admin-tag" :class="'status-' + c.status">{{ c.status === 'approved' ? '已通过' : c.status === 'pending' ? '待审核' : '已隐藏' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="admin-empty">暂无评论</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const stats = ref({
  totalPosts: 42,
  publishedPosts: 35,
  draftPosts: 7,
  pendingComments: 3,
})

const siteCreatedAt = ref('2022-01-01')

const daysRunning = computed(() => {
  const created = new Date(siteCreatedAt.value)
  const now = new Date()
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
})

const recentComments = ref([
  { id: 1, articleTitle: 'Vue3 入门教程', nickname: '小明', content: '写的太好了，受益匪浅！', time: '2026-04-28 10:30', status: 'pending' },
  { id: 2, articleTitle: 'TypeScript 实战', nickname: '前端小白', content: '请问泛型那块能再展开讲讲吗？', time: '2026-04-27 15:20', status: 'approved' },
  { id: 3, articleTitle: 'CSS 动画技巧', nickname: '设计师', content: '动画效果很丝滑', time: '2026-04-26 09:15', status: 'approved' },
  { id: 4, articleTitle: 'Node.js 性能优化', nickname: '后端老炮', content: '缓存策略这块很实用', time: '2026-04-25 22:00', status: 'approved' },
  { id: 5, articleTitle: 'Vue3 入门教程', nickname: '游客123', content: '收藏了', time: '2026-04-24 18:45', status: 'hidden' },
])
</script>

<style scoped>
.dashboard-page { max-width: 960px; margin: 0 auto; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
  animation: adminSlideIn 0.4s ease both;
  cursor: default;
  transition: background-color 0.4s ease, border-color 0.4s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.stat-card:nth-child(1) { animation-delay: 0s; }
.stat-card:nth-child(2) { animation-delay: 0.06s; }
.stat-card:nth-child(3) { animation-delay: 0.12s; }
.stat-card:nth-child(4) { animation-delay: 0.18s; }
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
.stat-icon { font-size: 1.4rem; margin-bottom: 0.4rem; }
.stat-number { font-size: 2rem; font-weight: 700; color: var(--color-accent); font-family: var(--font-serif); }
.stat-label { font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 0.3rem; }

.uptime-info {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
  animation: adminSlideIn 0.4s ease both;
  animation-delay: 0.24s;
  transition: background-color 0.4s ease, border-color 0.4s ease;
}

.section { margin-top: 1.5rem; }
.section h2 { margin-bottom: 1rem; font-size: 1.2rem; }

.comment-content { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.status-pending { background: var(--color-warning-bg); color: var(--color-warning-text); }
.status-approved { background: var(--color-success-bg); color: var(--color-success-text); }
.status-hidden { background: var(--color-danger-bg); color: var(--color-danger-text); }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
