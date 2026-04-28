<template>
  <div class="post-list-page">
    <div class="page-header">
      <h1>文章管理</h1>
      <button class="btn-primary" @click="$router.push('/admin/posts/new')">写文章</button>
    </div>

    <!-- 标签筛选 -->
    <div class="filter-bar">
      <button
        v-for="t in allTags"
        :key="t"
        class="tag-btn"
        :class="{ active: selectedTag === t }"
        @click="selectedTag = selectedTag === t ? '' : t"
      >{{ t }}</button>
      <button v-if="selectedTag" class="tag-btn clear" @click="selectedTag = ''">清除筛选</button>
    </div>

    <!-- 文章表格 -->
    <table class="table" v-if="filteredPosts.length > 0">
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
            <span class="tag" :class="post.status">{{ post.status === 'published' ? '已发布' : '草稿' }}</span>
          </td>
          <td>
            <span class="tag-item" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
          </td>
          <td>{{ post.date }}</td>
          <td class="actions">
            <button class="btn-sm" @click="$router.push(`/admin/posts/${post.id}/edit`)">编辑</button>
            <button class="btn-sm btn-danger" @click="confirmDelete(post)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">暂无文章</p>

    <!-- 删除确认弹窗 -->
    <div class="modal-overlay" v-if="deleteTarget" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>确认删除</h3>
        <p>确定要删除文章「{{ deleteTarget.title }}」吗？此操作不可撤销。</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="deleteTarget = null">取消</button>
          <button class="btn-danger" @click="doDelete">确认删除</button>
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

const selectedTag = ref('')

const allTags = computed(() => {
  const set = new Set<string>()
  posts.value.forEach(p => p.tags.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value.filter(p => p.tags.includes(selectedTag.value))
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

.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.page-header h1 { margin: 0; }

.btn-primary {
  padding: 0.5rem 1.25rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.95rem;
}
.btn-primary:hover { opacity: 0.9; }

.filter-bar { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
.tag-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.85rem;
}
.tag-btn.active { background: var(--color-accent); color: #fff; border-color: var(--color-accent); }
.tag-btn.clear { border-style: dashed; color: var(--color-text-secondary); }

.table { width: 100%; border-collapse: collapse; background: var(--color-surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--color-border); }
.table th, .table td { padding: 0.65rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 0.9rem; }
.table th { background: var(--color-bg); color: var(--color-text-secondary); font-weight: 600; }
.post-title { font-weight: 600; }

.tag { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
.tag.published { background: #d4edda; color: #155724; }
.tag.draft { background: #fff3cd; color: #856404; }

.tag-item { display: inline-block; margin-right: 0.3rem; padding: 0.1rem 0.4rem; background: var(--color-bg); border-radius: 4px; font-size: 0.8rem; color: var(--color-text-secondary); }

.actions { white-space: nowrap; }
.btn-sm {
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.3rem;
}
.btn-sm:hover { background: var(--color-bg); }

.btn-secondary {
  padding: 0.5rem 1.25rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--color-text);
}

.btn-danger {
  padding: 0.2rem 0.6rem;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background: transparent;
  color: #dc3545;
  cursor: pointer;
  font-size: 0.8rem;
}
.btn-danger:hover { background: #dc3545; color: #fff; }

.empty { color: var(--color-text-secondary); text-align: center; padding: 2rem; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: var(--color-surface); border-radius: var(--radius); padding: 2rem; max-width: 420px; width: 90%; border: 1px solid var(--color-border); }
.modal h3 { margin-bottom: 0.5rem; }
.modal p { color: var(--color-text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
.modal-actions .btn-danger {
  padding: 0.5rem 1.25rem;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}
</style>
