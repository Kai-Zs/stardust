<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <div>
        <h1>评论管理</h1>
        <div class="admin-page-subtitle">管理访客评论，审核或屏蔽不当内容</div>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="admin-search-bar">
      <input v-model="keyword" class="admin-search-input" type="text" placeholder="搜索昵称、内容或文章标题…" />
    </div>

    <!-- 状态筛选 -->
    <div class="admin-filter-bar" style="margin-bottom: 1rem;">
      <button
        v-for="s in statusOptions"
        :key="s.value"
        class="admin-filter-btn"
        :class="{ active: currentStatus === s.value }"
        @click="currentStatus = s.value"
      >{{ s.label }} ({{ countByStatus(s.value) }})</button>
    </div>

    <!-- 评论表格 -->
    <table class="admin-table" v-if="filteredComments.length > 0">
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
            <span class="admin-tag" :class="'status-' + c.status">{{ statusLabel(c.status) }}</span>
          </td>
          <td class="actions">
            <button v-if="c.status === 'pending'" class="admin-btn-sm admin-btn-approve" @click="updateStatus(c.id, 'approved')">通过</button>
            <button v-if="c.status !== 'hidden'" class="admin-btn-sm" @click="updateStatus(c.id, 'hidden')">隐藏</button>
            <button class="admin-btn-sm admin-btn-danger" @click="doDelete(c.id)">删除</button>
            <button class="admin-btn-sm admin-btn-warn" @click="banIp(c.ip)">封禁 IP</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-empty">暂无匹配的评论</p>
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

const keyword = ref('')
const currentStatus = ref<string>('all')

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'hidden', label: '已隐藏' },
]

function countByStatus(status: string) {
  const base = keywordFiltered.value
  if (status === 'all') return base.length
  return base.filter(c => c.status === status).length
}

const keywordFiltered = computed(() => {
  if (!keyword.value.trim()) return comments.value
  const kw = keyword.value.trim().toLowerCase()
  return comments.value.filter(c =>
    c.nickname.toLowerCase().includes(kw) ||
    c.content.toLowerCase().includes(kw) ||
    c.articleTitle.toLowerCase().includes(kw),
  )
})

const filteredComments = computed(() => {
  if (currentStatus.value === 'all') return keywordFiltered.value
  return keywordFiltered.value.filter(c => c.status === currentStatus.value)
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
.comment-content { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.status-pending { background: var(--color-warning-bg); color: var(--color-warning-text); }
.status-approved { background: var(--color-success-bg); color: var(--color-success-text); }
.status-hidden { background: var(--color-danger-bg); color: var(--color-danger-text); }
.actions { white-space: nowrap; }
</style>
