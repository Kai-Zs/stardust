<template>
  <div class="manager-page">
    <div class="page-header">
      <h1>评论管理</h1>
      <!-- 状态筛选 -->
      <div class="status-filter">
        <button
          v-for="s in statusOptions"
          :key="s.value"
          class="filter-btn"
          :class="{ active: currentStatus === s.value }"
          @click="currentStatus = s.value"
        >{{ s.label }} ({{ countByStatus(s.value) }})</button>
      </div>
    </div>

    <!-- 评论表格 -->
    <table class="table" v-if="filteredComments.length > 0">
      <thead>
        <tr>
          <th>文章</th>
          <th>昵称</th>
          <th>内容</th>
          <th>IP 属地</th>
          <th>时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in filteredComments" :key="c.id">
          <td>{{ c.articleTitle }}</td>
          <td>{{ c.nickname }}</td>
          <td class="comment-content">{{ c.content }}</td>
          <td>{{ c.ipLocation }}</td>
          <td>{{ c.time }}</td>
          <td>
            <span class="tag" :class="c.status">{{ statusLabel(c.status) }}</span>
          </td>
          <td class="actions">
            <button v-if="c.status === 'pending'" class="btn-sm btn-approve" @click="updateStatus(c.id, 'approved')">通过</button>
            <button v-if="c.status !== 'hidden'" class="btn-sm" @click="updateStatus(c.id, 'hidden')">隐藏</button>
            <button class="btn-sm btn-danger" @click="doDelete(c.id)">删除</button>
            <button class="btn-sm btn-warn" @click="banIp(c.ip)">封禁 IP</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">暂无评论</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Comment {
  id: number
  articleTitle: string
  nickname: string
  content: string
  ip: string
  ipLocation: string
  time: string
  status: 'pending' | 'approved' | 'hidden'
}

const comments = ref<Comment[]>([
  { id: 1, articleTitle: 'Vue3 入门教程', nickname: '小明', content: '写的太好了，受益匪浅！', ip: '192.168.1.1', ipLocation: '北京', time: '2026-04-28 10:30', status: 'pending' },
  { id: 2, articleTitle: 'TypeScript 实战', nickname: '前端小白', content: '请问泛型那块能再展开讲讲吗？', ip: '10.0.0.1', ipLocation: '上海', time: '2026-04-27 15:20', status: 'approved' },
  { id: 3, articleTitle: 'CSS 动画技巧', nickname: '设计师', content: '动画效果很丝滑', ip: '172.16.0.2', ipLocation: '深圳', time: '2026-04-26 09:15', status: 'approved' },
  { id: 4, articleTitle: 'Node.js 性能优化', nickname: '广告党', content: '加我微信 xxx 赚钱', ip: '1.2.3.4', ipLocation: '未知', time: '2026-04-25 22:00', status: 'hidden' },
  { id: 5, articleTitle: 'Vue3 入门教程', nickname: '游客123', content: '收藏了', ip: '192.168.2.5', ipLocation: '广州', time: '2026-04-24 18:45', status: 'pending' },
])

const currentStatus = ref<string>('all')

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'hidden', label: '已隐藏' },
]

function countByStatus(status: string) {
  if (status === 'all') return comments.value.length
  return comments.value.filter(c => c.status === status).length
}

const filteredComments = computed(() => {
  if (currentStatus.value === 'all') return comments.value
  return comments.value.filter(c => c.status === currentStatus.value)
})

function statusLabel(status: string) {
  const map: Record<string, string> = { pending: '待审核', approved: '已通过', hidden: '已隐藏' }
  return map[status] || status
}

function updateStatus(id: number, status: 'approved' | 'hidden') {
  const c = comments.value.find(c => c.id === id)
  if (c) c.status = status
}

function doDelete(id: number) {
  comments.value = comments.value.filter(c => c.id !== id)
}

function banIp(ip: string) {
  alert(`已封禁 IP: ${ip}（阶段二对接真实接口）`)
}
</script>

<style scoped>
.manager-page { max-width: 1100px; margin: 0 auto; }

.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.page-header h1 { margin: 0; }

.status-filter { display: flex; gap: 0.4rem; }
.filter-btn {
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.85rem;
}
.filter-btn.active { background: var(--color-accent); color: #fff; border-color: var(--color-accent); }

.table { width: 100%; border-collapse: collapse; background: var(--color-surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--color-border); }
.table th, .table td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 0.85rem; }
.table th { background: var(--color-bg); color: var(--color-text-secondary); font-weight: 600; }
.comment-content { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.tag { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
.tag.pending { background: #fff3cd; color: #856404; }
.tag.approved { background: #d4edda; color: #155724; }
.tag.hidden { background: #f8d7da; color: #721c24; }

.actions { white-space: nowrap; }
.btn-sm {
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 0.78rem;
  margin-right: 0.2rem;
  color: var(--color-text);
}
.btn-sm:hover { background: var(--color-bg); }
.btn-danger { color: #dc3545; border-color: #dc3545; }
.btn-danger:hover { background: #dc3545; color: #fff; }
.btn-approve { color: #28a745; border-color: #28a745; }
.btn-approve:hover { background: #28a745; color: #fff; }
.btn-warn { color: #e67e22; border-color: #e67e22; }
.btn-warn:hover { background: #e67e22; color: #fff; }

.empty { color: var(--color-text-secondary); text-align: center; padding: 2rem; }
</style>
