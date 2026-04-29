<template>
  <div class="manager-page">
    <div class="page-header">
      <h1>友链管理</h1>
      <button class="btn-primary" @click="openCreate">新增友链</button>
    </div>

    <!-- 友链表格 -->
    <table class="table" v-if="links.length > 0">
      <thead>
        <tr>
          <th>名称</th>
          <th>URL</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="link in links" :key="link.id">
          <td><strong>{{ link.name }}</strong></td>
          <td><a :href="link.url" target="_blank">{{ link.url }}</a></td>
          <td class="desc-cell">{{ link.description }}</td>
          <td class="actions">
            <button class="btn-sm" @click="openEdit(link)">编辑</button>
            <button class="btn-sm btn-danger" @click="doDelete(link.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">暂无友链</p>

    <!-- 弹窗表单 -->
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingId ? '编辑友链' : '新增友链' }}</h3>
        <div class="field">
          <label>名称</label>
          <input v-model="form.name" type="text" placeholder="博客名称" />
        </div>
        <div class="field">
          <label>URL</label>
          <input v-model="form.url" type="text" placeholder="https://..." />
        </div>
        <div class="field">
          <label>描述</label>
          <input v-model="form.description" type="text" placeholder="简短描述" />
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeModal">取消</button>
          <button class="btn-primary" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface FriendLink {
  id: number
  name: string
  url: string
  description: string
}

const links = ref<FriendLink[]>([
  { id: 1, name: '张三的博客', url: 'https://zhangsan.example.com', description: '一个热爱前端的朋友' },
  { id: 2, name: '后端笔记', url: 'https://backend.example.com', description: '专注后端技术分享' },
])

const showModal = ref(false)
const editingId = ref<number | null>(null)

const defaultForm = () => ({
  name: '',
  url: '',
  description: '',
})

const form = reactive(defaultForm())

function openCreate() {
  editingId.value = null
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEdit(link: FriendLink) {
  editingId.value = link.id
  form.name = link.name
  form.url = link.url
  form.description = link.description
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function save() {
  if (editingId.value) {
    const idx = links.value.findIndex(l => l.id === editingId.value)
    if (idx > -1) {
      links.value[idx] = { ...links.value[idx], name: form.name, url: form.url, description: form.description }
    }
  } else {
    const newId = Math.max(0, ...links.value.map(l => l.id)) + 1
    links.value.push({ id: newId, name: form.name, url: form.url, description: form.description })
  }
  closeModal()
}

function doDelete(id: number) {
  links.value = links.value.filter(l => l.id !== id)
}
</script>

<style scoped>
.manager-page { max-width: 960px; margin: 0 auto; }

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
  transition: filter var(--transition-fast);
}
.btn-primary:hover { filter: brightness(0.9); }
.btn-secondary {
  padding: 0.5rem 1.25rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--color-text);
}

.table { width: 100%; border-collapse: collapse; background: var(--color-surface); border-radius: var(--radius); overflow: hidden; border: 1px solid var(--color-border); }
.table th, .table td { padding: 0.65rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border); font-size: 0.9rem; }
.table th { background: var(--color-bg); color: var(--color-text-secondary); font-weight: 600; }
.desc-cell { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.actions { white-space: nowrap; }
.btn-sm {
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.3rem;
  color: var(--color-text);
}
.btn-sm:hover { background: var(--color-bg); }
.btn-danger {
  color: var(--color-danger);
  border-color: var(--color-danger);
}
.btn-danger:hover { background: var(--color-danger); color: #fff; }

.empty { color: var(--color-text-secondary); text-align: center; padding: 2rem; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: var(--color-surface); border-radius: var(--radius); padding: 2rem; max-width: 480px; width: 90%; border: 1px solid var(--color-border); }
.modal h3 { margin-bottom: 1rem; }
.field { margin-bottom: 1rem; }
.field label { display: block; margin-bottom: 0.3rem; font-size: 0.85rem; color: var(--color-text-secondary); }
.field input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.95rem;
  background: var(--color-bg);
  color: var(--color-text);
}
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; }
</style>
