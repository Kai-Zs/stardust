<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <h1>时间线管理</h1>
      <button class="admin-btn-primary" @click="openCreate">新增条目</button>
    </div>

    <!-- 时间线表格 -->
    <table class="admin-table" v-if="items.length > 0">
      <thead>
        <tr>
          <th>标题</th>
          <th>描述</th>
          <th>日期</th>
          <th>图标</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td><strong>{{ item.title }}</strong></td>
          <td class="desc-cell">{{ item.description }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.icon }}</td>
          <td class="actions">
            <button class="admin-btn-sm" @click="openEdit(item)">编辑</button>
            <button class="admin-btn-sm admin-btn-danger" @click="doDelete(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-empty">暂无时间线条目</p>

    <!-- 弹窗表单 -->
    <div class="admin-modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="admin-modal">
        <h3>{{ editingId ? '编辑条目' : '新增条目' }}</h3>
        <div class="admin-field">
          <label>标题</label>
          <input v-model="form.title" type="text" placeholder="事件标题" />
        </div>
        <div class="admin-field">
          <label>描述</label>
          <input v-model="form.description" type="text" placeholder="简短描述" />
        </div>
        <div class="admin-field">
          <label>日期</label>
          <input v-model="form.date" type="date" />
        </div>
        <div class="admin-field">
          <label>图标（emoji 或 icon class）</label>
          <input v-model="form.icon" type="text" placeholder="如 🎓 或 mdi-school" />
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

interface TimelineItem {
  id: number
  title: string
  description: string
  date: string
  icon: string
}

const items = ref<TimelineItem[]>([
  { id: 1, title: '开始学习前端', description: '从 HTML/CSS 入门，开启编程之旅', date: '2019-09-01', icon: '🎓' },
  { id: 2, title: '第一份实习', description: '在某互联网公司担任前端实习生', date: '2022-06-01', icon: '💼' },
  { id: 3, title: '毕业', description: '顺利完成大学学业', date: '2023-07-01', icon: '🎉' },
])

const showModal = ref(false)
const editingId = ref<number | null>(null)

const defaultForm = () => ({
  title: '',
  description: '',
  date: '',
  icon: '',
})

const form = reactive(defaultForm())

function openCreate() {
  editingId.value = null
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEdit(item: TimelineItem) {
  editingId.value = item.id
  form.title = item.title
  form.description = item.description
  form.date = item.date
  form.icon = item.icon
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function save() {
  if (editingId.value) {
    const idx = items.value.findIndex(i => i.id === editingId.value)
    if (idx > -1) {
      items.value[idx] = { ...items.value[idx], title: form.title, description: form.description, date: form.date, icon: form.icon }
    }
  } else {
    const newId = Math.max(0, ...items.value.map(i => i.id)) + 1
    items.value.push({ id: newId, title: form.title, description: form.description, date: form.date, icon: form.icon })
  }
  closeModal()
}

function doDelete(id: number) {
  items.value = items.value.filter(i => i.id !== id)
}
</script>

<style scoped>
.manager-page { max-width: 960px; margin: 0 auto; }
.desc-cell { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.actions { white-space: nowrap; }
</style>
