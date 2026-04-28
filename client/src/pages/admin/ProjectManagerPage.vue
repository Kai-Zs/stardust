<template>
  <div class="manager-page">
    <div class="page-header">
      <h1>项目管理</h1>
      <button class="btn-primary" @click="openCreate">新增项目</button>
    </div>

    <!-- 项目表格 -->
    <table class="table" v-if="projects.length > 0">
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
        <tr v-for="p in projects" :key="p.id">
          <td class="name-cell">
            <strong>{{ p.name }}</strong>
            <div class="links">
              <a v-if="p.githubUrl" :href="p.githubUrl" target="_blank">GitHub</a>
              <a v-if="p.homeUrl" :href="p.homeUrl" target="_blank">主页</a>
            </div>
          </td>
          <td class="desc-cell">{{ p.description }}</td>
          <td><span class="tag-item" v-for="t in p.techStack" :key="t">{{ t }}</span></td>
          <td>{{ p.featured ? '是' : '否' }}</td>
          <td class="actions">
            <button class="btn-sm" @click="openEdit(p)">编辑</button>
            <button class="btn-sm btn-danger" @click="doDelete(p.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">暂无项目</p>

    <!-- 弹窗表单 -->
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingId ? '编辑项目' : '新增项目' }}</h3>
        <div class="field">
          <label>项目名称</label>
          <input v-model="form.name" type="text" placeholder="项目名称" />
        </div>
        <div class="field">
          <label>描述</label>
          <input v-model="form.description" type="text" placeholder="简短描述" />
        </div>
        <div class="field">
          <label>技术栈（逗号分隔）</label>
          <input v-model="form.techStackInput" type="text" placeholder="Vue, TypeScript" />
        </div>
        <div class="field">
          <label>GitHub URL</label>
          <input v-model="form.githubUrl" type="text" placeholder="https://github.com/..." />
        </div>
        <div class="field">
          <label>主页 URL</label>
          <input v-model="form.homeUrl" type="text" placeholder="https://..." />
        </div>
        <div class="field-inline">
          <label>
            <input type="checkbox" v-model="form.featured" />
            设为精选
          </label>
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
.name-cell strong { display: block; }
.links { margin-top: 0.2rem; }
.links a { font-size: 0.8rem; margin-right: 0.5rem; }
.desc-cell { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tag-item { display: inline-block; margin-right: 0.3rem; padding: 0.1rem 0.4rem; background: var(--color-bg); border-radius: 4px; font-size: 0.8rem; color: var(--color-text-secondary); }

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
  color: #dc3545;
  border-color: #dc3545;
}
.btn-danger:hover { background: #dc3545; color: #fff; }

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
.field-inline { margin-bottom: 1rem; }
.field-inline label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-size: 0.9rem; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
</style>
