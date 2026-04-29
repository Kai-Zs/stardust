<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <div>
        <h1>项目管理</h1>
        <div class="admin-page-subtitle">管理展示在前端的项目列表</div>
      </div>
      <button class="admin-btn-primary" @click="openCreate">新增项目</button>
    </div>

    <!-- 搜索 -->
    <div class="admin-search-bar">
      <input v-model="keyword" class="admin-search-input" type="text" placeholder="搜索项目名称、描述或技术栈…" />
    </div>

    <!-- 项目表格 -->
    <table class="admin-table" v-if="filteredProjects.length > 0">
      <thead>
        <tr>
          <th>项目名称</th>
          <th>描述</th>
          <th>技术栈</th>
          <th>精选</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filteredProjects" :key="p.id">
          <td class="name-cell">
            <strong>{{ p.name }}</strong>
            <div class="links">
              <a v-if="p.githubUrl" :href="p.githubUrl" target="_blank">GitHub</a>
              <a v-if="p.homeUrl" :href="p.homeUrl" target="_blank">主页</a>
            </div>
          </td>
          <td class="desc-cell">{{ p.description }}</td>
          <td><span class="admin-tag-item" v-for="t in p.techStack" :key="t">{{ t }}</span></td>
          <td><span v-if="p.featured" class="featured-star">★</span><span v-else>—</span></td>
          <td class="actions">
            <button class="admin-btn-sm" @click="openEdit(p)">编辑</button>
            <button class="admin-btn-sm admin-btn-danger" @click="doDelete(p.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-empty">暂无匹配的项目</p>

    <!-- 弹窗表单 -->
    <div class="admin-modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="admin-modal">
        <h3>{{ editingId ? '编辑项目' : '新增项目' }}</h3>
        <div class="admin-field">
          <label>项目名称</label>
          <input v-model="form.name" type="text" placeholder="项目名称" />
        </div>
        <div class="admin-field">
          <label>描述</label>
          <input v-model="form.description" type="text" placeholder="简短描述" />
        </div>
        <div class="admin-field">
          <label>技术栈（逗号分隔）</label>
          <input v-model="form.techStackInput" type="text" placeholder="Vue, TypeScript" />
        </div>
        <div class="admin-field">
          <label>GitHub URL</label>
          <input v-model="form.githubUrl" type="text" placeholder="https://github.com/..." />
        </div>
        <div class="admin-field">
          <label>主页 URL</label>
          <input v-model="form.homeUrl" type="text" placeholder="https://..." />
        </div>
        <div class="admin-field-inline">
          <label>
            <input type="checkbox" v-model="form.featured" />
            设为精选
          </label>
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
import { ref, reactive, computed } from 'vue'

interface Project {
  id: number
  name: string
  description: string
  techStack: string[]
  githubUrl: string
  homeUrl: string
  featured: boolean
}

const projects = ref<Project[]>([
  { id: 1, name: '星霜记', description: '个人博客系统', techStack: ['Vue3', 'Hono', 'TypeScript'], githubUrl: 'https://github.com/example/stardust', homeUrl: 'https://stardust.example.com', featured: true },
  { id: 2, name: 'Todo App', description: '全栈待办应用', techStack: ['React', 'Express'], githubUrl: 'https://github.com/example/todo', homeUrl: '', featured: false },
])

const keyword = ref('')

const filteredProjects = computed(() => {
  if (!keyword.value.trim()) return projects.value
  const kw = keyword.value.trim().toLowerCase()
  return projects.value.filter(p =>
    p.name.toLowerCase().includes(kw) ||
    p.description.toLowerCase().includes(kw) ||
    p.techStack.some(t => t.toLowerCase().includes(kw)),
  )
})

const showModal = ref(false)
const editingId = ref<number | null>(null)

const defaultForm = () => ({
  name: '',
  description: '',
  techStackInput: '',
  githubUrl: '',
  homeUrl: '',
  featured: false,
})

const form = reactive(defaultForm())

function openCreate() {
  editingId.value = null
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEdit(p: Project) {
  editingId.value = p.id
  form.name = p.name
  form.description = p.description
  form.techStackInput = p.techStack.join(', ')
  form.githubUrl = p.githubUrl
  form.homeUrl = p.homeUrl
  form.featured = p.featured
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function save() {
  const techStack = form.techStackInput.split(',').map(s => s.trim()).filter(Boolean)
  if (editingId.value) {
    const idx = projects.value.findIndex(p => p.id === editingId.value)
    if (idx > -1) {
      projects.value[idx] = {
        ...projects.value[idx],
        name: form.name,
        description: form.description,
        techStack,
        githubUrl: form.githubUrl,
        homeUrl: form.homeUrl,
        featured: form.featured,
      }
    }
  } else {
    const newId = Math.max(0, ...projects.value.map(p => p.id)) + 1
    projects.value.push({
      id: newId,
      name: form.name,
      description: form.description,
      techStack,
      githubUrl: form.githubUrl,
      homeUrl: form.homeUrl,
      featured: form.featured,
    })
  }
  closeModal()
}

function doDelete(id: number) {
  projects.value = projects.value.filter(p => p.id !== id)
}
</script>

<style scoped>
.manager-page { max-width: 960px; margin: 0 auto; }
.name-cell strong { display: block; }
.links { margin-top: 0.2rem; }
.links a { font-size: 0.8rem; margin-right: 0.5rem; }
.desc-cell { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.featured-star { color: var(--color-accent); font-size: 1.1rem; }
.actions { white-space: nowrap; }
</style>
