<template>
  <div class="post-list-page">
    <div class="admin-page-header">
      <h1>文章管理</h1>
      <button class="admin-btn-primary" @click="$router.push('/admin/posts/new')">写文章</button>
    </div>

    <!-- 搜索 + 筛选 -->
    <div class="admin-search-bar">
      <input v-model="keyword" class="admin-search-input" type="text" placeholder="搜索文章标题或标签…" />
    </div>
    <div class="admin-filter-bar" style="margin-bottom: 1rem;">
      <button class="admin-filter-btn" :class="{ active: !selectedTag }" @click="selectedTag = ''">全部 ({{ posts.length }})</button>
      <button v-for="t in allTags" :key="t" class="admin-filter-btn" :class="{ active: selectedTag === t }" @click="selectedTag = selectedTag === t ? '' : t">{{ t }} ({{ countByTag(t) }})</button>
    </div>

    <!-- 文章表格 -->
    <table class="admin-table" v-if="filteredPosts.length > 0">
      <thead>
        <tr>
          <th>标题</th>
          <th>状态</th>
          <th>标签</th>
          <th>日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in filteredPosts" :key="post.id">
          <td class="post-title">{{ post.title }}</td>
          <td>
            <span class="admin-tag" :class="post.status">{{ post.status === 'published' ? '已发布' : '草稿' }}</span>
          </td>
          <td>
            <span class="admin-tag-item" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
          </td>
          <td>{{ post.date }}</td>
          <td class="actions">
            <button class="admin-btn-sm" @click="$router.push(`/admin/posts/${post.id}/edit`)">编辑</button>
            <button class="admin-btn-sm admin-btn-danger" @click="confirmDelete(post)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-empty">暂无匹配的文章</p>

    <!-- 删除确认弹窗 -->
    <div class="admin-modal-overlay" v-if="deleteTarget" @click.self="deleteTarget = null">
      <div class="admin-modal">
        <h3>确认删除</h3>
        <p>确定要删除文章「{{ deleteTarget.title }}」吗？此操作不可撤销。</p>
        <div class="admin-modal-actions">
          <button class="admin-btn-secondary" @click="deleteTarget = null">取消</button>
          <button class="admin-btn-primary" style="background: var(--color-danger);" @click="doDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Post {
  id: number
  title: string
  status: 'published' | 'draft'
  tags: string[]
  date: string
}

const posts = ref<Post[]>([
  { id: 1, title: 'Vue3 组合式 API 入门', status: 'published', tags: ['Vue', '前端'], date: '2026-04-20' },
  { id: 2, title: 'TypeScript 类型体操', status: 'published', tags: ['TypeScript'], date: '2026-04-15' },
  { id: 3, title: 'Hono 框架初探', status: 'draft', tags: ['后端', 'Hono'], date: '2026-04-10' },
  { id: 4, title: 'CSS Grid 布局实战', status: 'published', tags: ['CSS', '前端'], date: '2026-04-05' },
  { id: 5, title: 'Node.js Stream 深入理解', status: 'draft', tags: ['Node.js', '后端'], date: '2026-03-28' },
])

const keyword = ref('')
const selectedTag = ref('')

const allTags = computed(() => {
  const set = new Set<string>()
  posts.value.forEach(p => p.tags.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

function countByTag(tag: string) {
  return posts.value.filter(p => p.tags.includes(tag)).length
}

const filteredPosts = computed(() => {
  let result = posts.value
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(kw) || p.tags.some(t => t.toLowerCase().includes(kw)))
  }
  if (selectedTag.value) {
    result = result.filter(p => p.tags.includes(selectedTag.value))
  }
  return result
})

const deleteTarget = ref<Post | null>(null)

function confirmDelete(post: Post) {
  deleteTarget.value = post
}

function doDelete() {
  if (!deleteTarget.value) return
  posts.value = posts.value.filter(p => p.id !== deleteTarget.value!.id)
  deleteTarget.value = null
}
</script>

<style scoped>
.post-list-page { max-width: 960px; margin: 0 auto; }
.post-title { font-weight: 600; }
.tag.published { background: var(--color-success-bg); color: var(--color-success-text); }
.tag.draft { background: var(--color-warning-bg); color: var(--color-warning-text); }
.actions { white-space: nowrap; }
</style>
