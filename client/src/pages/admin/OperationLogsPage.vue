<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <div>
        <h1>操作日志</h1>
        <div class="admin-page-subtitle">记录后台所有操作行为</div>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="admin-search-bar">
      <input v-model="keyword" class="admin-search-input" type="text" placeholder="搜索操作对象、用户或 IP…" />
    </div>

    <!-- 操作类型筛选 -->
    <div class="admin-filter-bar" style="margin-bottom: 1rem;">
      <button class="admin-filter-btn" :class="{ active: !activeType }" @click="activeType = ''">全部 ({{ logs.length }})</button>
      <button v-for="t in allTypes" :key="t" class="admin-filter-btn" :class="{ active: activeType === t }" @click="activeType = activeType === t ? '' : t">{{ t }} ({{ countByType(t) }})</button>
    </div>

    <!-- 日志表格 -->
    <table class="admin-table" v-if="paginatedLogs.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户</th>
          <th>操作类型</th>
          <th>操作对象</th>
          <th>IP</th>
          <th>时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in paginatedLogs" :key="log.id">
          <td>{{ log.id }}</td>
          <td>{{ log.user }}</td>
          <td>
            <span class="admin-tag" :class="'type-' + log.actionType">{{ log.actionType }}</span>
          </td>
          <td>{{ log.target }}</td>
          <td>{{ log.ip }}</td>
          <td>{{ log.time }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-empty">暂无匹配的操作日志</p>

    <!-- 分页 -->
    <div class="admin-pagination" v-if="totalPages > 1">
      <button class="admin-page-btn" :disabled="currentPage === 1" @click="currentPage = 1">首页</button>
      <button class="admin-page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
      <span class="admin-page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button class="admin-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
      <button class="admin-page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">末页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface OperationLog {
  id: number
  user: string
  actionType: string
  target: string
  ip: string
  time: string
}

const logs = ref<OperationLog[]>([
  { id: 28, user: '管理员', actionType: '编辑', target: '文章 #3', ip: '127.0.0.1', time: '2026-04-28 14:30:00' },
  { id: 27, user: '管理员', actionType: '删除', target: '评论 #12', ip: '127.0.0.1', time: '2026-04-28 10:15:00' },
  { id: 26, user: '管理员', actionType: '发布', target: '文章 #5', ip: '127.0.0.1', time: '2026-04-27 16:45:00' },
  { id: 25, user: '管理员', actionType: '审核', target: '评论 #8', ip: '127.0.0.1', time: '2026-04-27 09:20:00' },
  { id: 24, user: '管理员', actionType: '登录', target: '后台', ip: '127.0.0.1', time: '2026-04-27 09:00:00' },
  { id: 23, user: '管理员', actionType: '编辑', target: '项目 #1', ip: '127.0.0.1', time: '2026-04-26 20:10:00' },
  { id: 22, user: '管理员', actionType: '删除', target: '友链 #3', ip: '127.0.0.1', time: '2026-04-26 11:30:00' },
  { id: 21, user: '管理员', actionType: '上传', target: '附件 cover-2.jpg', ip: '127.0.0.1', time: '2026-04-25 15:00:00' },
  { id: 20, user: '管理员', actionType: '配置', target: '站点设置', ip: '127.0.0.1', time: '2026-04-25 08:30:00' },
  { id: 19, user: '管理员', actionType: '备份', target: '数据库备份', ip: '127.0.0.1', time: '2026-04-24 03:00:00' },
  { id: 18, user: '管理员', actionType: '封禁', target: 'IP 1.2.3.4', ip: '127.0.0.1', time: '2026-04-23 22:00:00' },
  { id: 17, user: '管理员', actionType: '发布', target: '文章 #4', ip: '127.0.0.1', time: '2026-04-23 14:20:00' },
])

const keyword = ref('')
const activeType = ref('')
const pageSize = 10
const currentPage = ref(1)

const allTypes = computed(() => {
  const set = new Set<string>()
  logs.value.forEach(l => set.add(l.actionType))
  return Array.from(set).sort()
})

function countByType(type: string) {
  return filteredBySearch.value.filter(l => l.actionType === type).length
}

const filteredBySearch = computed(() => {
  let result = logs.value
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    result = result.filter(l =>
      l.target.toLowerCase().includes(kw) ||
      l.user.toLowerCase().includes(kw) ||
      l.ip.includes(kw),
    )
  }
  if (activeType.value) {
    result = result.filter(l => l.actionType === activeType.value)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredBySearch.value.length / pageSize))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBySearch.value.slice(start, start + pageSize)
})
</script>

<style scoped>
.manager-page { max-width: 1000px; margin: 0 auto; }
.type-登录 { background: var(--color-success-bg); color: var(--color-success-text); }
.type-发布 { background: var(--color-info-bg); color: var(--color-info-text); }
.type-编辑 { background: var(--color-warning-bg); color: var(--color-warning-text); }
.type-删除 { background: var(--color-danger-bg); color: var(--color-danger-text); }
.type-审核 { background: var(--color-purple-bg); color: var(--color-purple-text); }
.type-封禁 { background: var(--color-danger-bg); color: var(--color-danger-text); }
.type-上传 { background: var(--color-teal-bg); color: var(--color-teal-text); }
.type-配置 { background: var(--color-border); color: var(--color-text-secondary); }
.type-备份 { background: var(--color-success-bg); color: var(--color-success-text); }
</style>
