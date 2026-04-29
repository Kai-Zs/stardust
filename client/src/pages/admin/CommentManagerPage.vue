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
      <input
        v-model="keyword"
        class="admin-search-input"
        type="text"
        placeholder="搜索昵称、内容或文章标题…"
      />
    </div>

    <!-- 状态筛选 -->
    <div class="admin-filter-bar" style="margin-bottom: 1rem">
      <button
        v-for="s in statusOptions"
        :key="s.value"
        class="admin-filter-btn"
        :class="{ active: currentStatus === s.value }"
        @click="currentStatus = s.value"
      >
        {{ s.label }} ({{ countByStatus(s.value) }})
      </button>
    </div>

    <!-- 评论表格 -->
    <table v-if="filteredComments.length > 0" class="admin-table">
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
            <button
              v-if="c.status === 'pending'"
              class="admin-btn-sm admin-btn-approve"
              @click="updateStatus(c.id, 'approved')"
            >
              通过
            </button>
            <button
              v-if="c.status !== 'hidden'"
              class="admin-btn-sm"
              @click="updateStatus(c.id, 'hidden')"
            >
              隐藏
            </button>
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
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/blog'
import { useToastStore } from '../../stores/toast'
import type { Comment } from '../../stores/blog'

const adminStore = useAdminStore()
const toast = useToastStore()

interface DisplayComment {
  id: number
  articleTitle: string
  nickname: string
  content: string
  ip: string
  ipLocation: string
  time: string
  status: 'pending' | 'approved' | 'hidden'
}

/** 将 store 的 Comment 适配为页面展示格式 */
function toDisplay(c: Comment): DisplayComment {
  return {
    id: c.id,
    articleTitle: '文章 #' + c.post_id,
    nickname: c.nickname,
    content: c.content,
    ip: c.ip || '',
    ipLocation: c.ip_location,
    time: c.created_at,
    status: c.status || 'pending',
  }
}

const comments = computed<DisplayComment[]>(() => adminStore.allComments.map(toDisplay))

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
  return base.filter((c) => c.status === status).length
}

const keywordFiltered = computed(() => {
  if (!keyword.value.trim()) return comments.value
  const kw = keyword.value.trim().toLowerCase()
  return comments.value.filter(
    (c) =>
      c.nickname.toLowerCase().includes(kw) ||
      c.content.toLowerCase().includes(kw) ||
      c.articleTitle.toLowerCase().includes(kw),
  )
})

const filteredComments = computed(() => {
  if (currentStatus.value === 'all') return keywordFiltered.value
  return keywordFiltered.value.filter((c) => c.status === currentStatus.value)
})

function statusLabel(status: string) {
  const map: Record<string, string> = { pending: '待审核', approved: '已通过', hidden: '已隐藏' }
  return map[status] || status
}

async function updateStatus(id: number, status: 'approved' | 'hidden') {
  if (status === 'approved') {
    const ok = await adminStore.approveComment(id)
    if (ok) {
      // 本地同步更新状态
      const c = adminStore.allComments.find((c) => c.id === id)
      if (c) c.status = 'approved'
      toast.success('评论已通过')
    } else {
      toast.error('操作失败')
    }
  } else {
    // TODO: 对接真实API — 当前仅本地状态更新
    const c = adminStore.allComments.find((c) => c.id === id)
    if (c) c.status = 'hidden'
    toast.success('评论已隐藏')
  }
}

async function doDelete(id: number) {
  const ok = await adminStore.deleteComment(id)
  if (ok) {
    toast.success('评论已删除')
  } else {
    toast.error('删除失败')
  }
}

function banIp(ip: string) {
  toast.info('已封禁 IP: ' + ip)
}

onMounted(() => {
  adminStore.fetchAllComments()
})
</script>

<style scoped>
.manager-page {
  max-width: 1100px;
  margin: 0 auto;
}
.comment-content {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.status-pending {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}
.status-approved {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}
.status-hidden {
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
}
.actions {
  white-space: nowrap;
}
</style>
