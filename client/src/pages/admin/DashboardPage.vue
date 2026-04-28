<template>
  <div class="dashboard-page">
    <h1>仪表盘</h1>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ stats.totalPosts }}</div>
        <div class="stat-label">文章总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.publishedPosts }}</div>
        <div class="stat-label">已发布</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.draftPosts }}</div>
        <div class="stat-label">草稿</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.pendingComments }}</div>
        <div class="stat-label">待审核评论</div>
      </div>
    </div>

    <!-- 站点运行天数 -->
    <div class="uptime-info">
      站点已运行 <strong>{{ daysRunning }}</strong> 天
    </div>

    <!-- 最新评论 -->
    <div class="section">
      <h2>最新评论</h2>
      <table class="table" v-if="recentComments.length > 0">
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
              <span class="tag" :class="c.status">{{ c.status === 'approved' ? '已通过' : c.status === 'pending' ? '待审核' : '已隐藏' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">暂无评论</p>
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
.dashboard-page h1 { margin-bottom: 1.5rem; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
}
.stat-number { font-size: 2rem; font-weight: 700; color: var(--color-accent); font-family: var(--font-serif); }
.stat-label { font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 0.3rem; }

.uptime-info {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
}

.section { margin-top: 1.5rem; }
.section h2 { margin-bottom: 1rem; font-size: 1.2rem; }

.table { width: 100%; border-collapse: collapse; background: var(--color-surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--color-border); }
.table th, .table td { padding: 0.65rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 0.9rem; }
.table th { background: var(--color-bg); color: var(--color-text-secondary); font-weight: 600; }
.comment-content { max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.tag { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
.tag.pending { background: #fff3cd; color: #856404; }
.tag.approved { background: #d4edda; color: #155724; }
.tag.hidden { background: #f8d7da; color: #721c24; }

.empty { color: var(--color-text-secondary); text-align: center; padding: 2rem; }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
