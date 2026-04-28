<template>
  <div class="manager-page">
    <h1>操作日志</h1>

    <!-- 日志表格 -->
    <table class="table" v-if="paginatedLogs.length > 0">
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
            <span class="tag" :class="log.actionType">{{ log.actionType }}</span>
          </td>
          <td>{{ log.target }}</td>
          <td>{{ log.ip }}</td>
          <td>{{ log.time }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">暂无操作日志</p>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage = 1"
      >首页</button>
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >上一页</button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >下一页</button>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage = totalPages"
      >末页</button>
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

const pageSize = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(logs.value.length / pageSize))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return logs.value.slice(start, start + pageSize)
})
</script>

<style scoped>
.manager-page { max-width: 1000px; margin: 0 auto; }
.manager-page h1 { margin-bottom: 1.5rem; }

.table { width: 100%; border-collapse: collapse; background: var(--color-surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--color-border); }
.table th, .table td { padding: 0.6rem 0.9rem; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 0.85rem; }
.table th { background: var(--color-bg); color: var(--color-text-secondary); font-weight: 600; }

.tag { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; background: var(--color-bg); color: var(--color-text-secondary); }
.tag.登录 { background: #d4edda; color: #155724; }
.tag.发布 { background: #cce5ff; color: #004085; }
.tag.编辑 { background: #fff3cd; color: #856404; }
.tag.删除 { background: #f8d7da; color: #721c24; }
.tag.审核 { background: #e2d5f1; color: #5a3d7a; }
.tag.封禁 { background: #f8d7da; color: #721c24; }
.tag.上传 { background: #d1ecf1; color: #0c5460; }
.tag.配置 { background: #e8d5c4; color: #5d4037; }
.tag.备份 { background: #d4edda; color: #155724; }

.empty { color: var(--color-text-secondary); text-align: center; padding: 2rem; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; }
.page-btn {
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.85rem;
}
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { background: var(--color-bg); }
.page-info { font-size: 0.9rem; color: var(--color-text-secondary); min-width: 80px; text-align: center; }
</style>
