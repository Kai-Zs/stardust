<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <h1>友链管理</h1>
      <button class="admin-btn-primary" @click="openCreate">新增友链</button>
    </div>

    <!-- 友链表格 -->
    <table v-if="links.length > 0" class="admin-table">
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
          <td>
            <strong>{{ link.name }}</strong>
          </td>
          <td>
            <a :href="link.url" target="_blank">{{ link.url }}</a>
          </td>
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
    <div v-if="showModal" class="admin-modal-overlay" @click.self="closeModal">
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useToastStore } from '@/stores/toast'
import { api } from '@/api'
import type { FriendLink } from '@/stores/blog'

const blogStore = useBlogStore()
const toast = useToastStore()

onMounted(() => {
  blogStore.fetchFriendLinks()
})

const links = computed(() => blogStore.friendLinks)

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

async function save() {
  const payload = {
    name: form.name,
    url: form.url,
    description: form.description,
  }
  if (editingId.value) {
    await api.put('/friend-links/' + editingId.value, payload)
  } else {
    await api.post('/friend-links', payload)
  }
  await blogStore.fetchFriendLinks()
  closeModal()
}

async function doDelete(id: number) {
  await api.delete('/friend-links/' + id)
  await blogStore.fetchFriendLinks()
  toast.success('友链已删除')
}
</script>

<style scoped>
.manager-page {
  max-width: 960px;
  margin: 0 auto;
}
.desc-cell {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.actions {
  white-space: nowrap;
}
</style>
