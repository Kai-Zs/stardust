<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <h1>友链管理</h1>
      <button class="admin-btn-primary" @click="openCreate">新增友链</button>
    </div>

    <!-- 友链表格 -->
    <table class="admin-table" v-if="links.length > 0">
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
            <button class="admin-btn-sm" @click="openEdit(link)">编辑</button>
            <button class="admin-btn-sm admin-btn-danger" @click="doDelete(link.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-empty">暂无友链</p>

    <!-- 弹窗表单 -->
    <div class="admin-modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="admin-modal">
        <h3>{{ editingId ? '编辑友链' : '新增友链' }}</h3>
        <div class="admin-field">
          <label>名称</label>
          <input v-model="form.name" type="text" placeholder="博客名称" />
        </div>
        <div class="admin-field">
          <label>URL</label>
          <input v-model="form.url" type="text" placeholder="https://..." />
        </div>
        <div class="admin-field">
          <label>描述</label>
          <input v-model="form.description" type="text" placeholder="简短描述" />
        </div>
        <div class="admin-modal-actions">
          <button class="admin-btn-secondary" @click="closeModal">取消</button>
          <button class="admin-btn-primary" @click="save">保存</button>
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
.desc-cell { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.actions { white-space: nowrap; }
</style>
