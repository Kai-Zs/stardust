<template>
  <div class="editor-page">
    <div class="admin-page-header">
      <h1>{{ isEdit ? '编辑文章' : '撰写新文章' }}</h1>
      <div class="header-actions">
        <button class="admin-btn-secondary" @click="saveDraft">存草稿</button>
        <button class="admin-btn-primary" @click="publish">发布</button>
      </div>
    </div>

    <!-- 文章元信息 -->
    <div class="meta-form">
      <div class="admin-field">
        <label>标题</label>
        <input v-model="form.title" type="text" placeholder="文章标题" />
      </div>
      <div class="field-row">
        <div class="admin-field flex-1">
          <label>Slug</label>
          <input v-model="form.slug" type="text" placeholder="article-slug" />
        </div>
        <div class="admin-field flex-1">
          <label>摘要</label>
          <input v-model="form.summary" type="text" placeholder="简短摘要" />
        </div>
      </div>
      <div class="field-row">
        <div class="admin-field flex-1">
          <label>标签（逗号分隔）</label>
          <input v-model="form.tagsInput" type="text" placeholder="Vue, TypeScript" />
        </div>
        <div class="admin-field flex-1">
          <label>封面图 URL</label>
          <input v-model="form.coverUrl" type="text" placeholder="https://..." />
        </div>
      </div>
      <div class="admin-field-inline">
        <label>
          <input v-model="form.allowComment" type="checkbox" />
          允许评论
        </label>
      </div>
    </div>

    <!-- 编辑器区域：左右分栏 -->
    <div class="editor-area">
      <div class="pane pane-edit">
        <div class="pane-header">Markdown 编辑</div>
        <textarea
          v-model="form.content"
          class="editor-textarea"
          placeholder="开始用 Markdown 写作..."
        ></textarea>
      </div>
      <div class="pane pane-preview">
        <div class="pane-header">实时预览</div>
        <div class="preview-content">
          <MarkdownRenderer v-if="form.content" :content="form.content" />
          <p v-else class="preview-placeholder">预览区域...</p>
        </div>
      </div>
    </div>

    <!-- 保存提示 -->
    <div v-if="saveStatus" class="save-indicator">
      {{ saveStatus }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/blog'
import { useToastStore } from '../../stores/toast'
import MarkdownRenderer from '../../components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const toast = useToastStore()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  slug: '',
  summary: '',
  tagsInput: '',
  coverUrl: '',
  content: '',
  allowComment: true,
})

const saveStatus = ref('')

// localStorage 自动保存
const SAVE_KEY = 'post-editor-draft'
let saveTimer: ReturnType<typeof setInterval> | null = null

function loadDraft() {
  const raw = localStorage.getItem(SAVE_KEY)
  if (raw) {
    try {
      const data = JSON.parse(raw)
      Object.assign(form, data)
      saveStatus.value = '已恢复上次草稿'
      setTimeout(() => {
        saveStatus.value = ''
      }, 2000)
    } catch {
      /* ignore */
    }
  }
}

function saveToDraft() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...form }))
  saveStatus.value = '草稿已保存'
  setTimeout(() => {
    saveStatus.value = ''
  }, 1500)
}

function startAutoSave() {
  saveTimer = setInterval(saveToDraft, 30000) // 30秒间隔
}

function stopAutoSave() {
  if (saveTimer) {
    clearInterval(saveTimer)
    saveTimer = null
  }
}

// beforeunload 提醒
function beforeUnload(e: BeforeUnloadEvent) {
  if (form.title || form.content) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  loadDraft()
  startAutoSave()
  window.addEventListener('beforeunload', beforeUnload)
})

onBeforeUnmount(() => {
  stopAutoSave()
  window.removeEventListener('beforeunload', beforeUnload)
})

function saveDraft() {
  saveToDraft()
}

async function publish() {
  const tags = form.tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const data = {
    title: form.title,
    excerpt: form.summary,
    tags,
    content: form.content,
    commentEnabled: form.allowComment,
    pinned: false,
  }

  let result
  if (isEdit.value) {
    result = await adminStore.updatePost(route.params.id as string, data)
  } else {
    result = await adminStore.createPost(data)
  }

  if (result) {
    toast.success('文章已发布')
    localStorage.removeItem(SAVE_KEY)
    stopAutoSave()
    window.removeEventListener('beforeunload', beforeUnload)
    router.push('/admin/posts')
  } else {
    toast.error('发布失败，请重试')
  }
}
</script>

<style scoped>
.editor-page {
  max-width: 1200px;
  margin: 0 auto;
}
.header-actions {
  display: flex;
  gap: 0.75rem;
}

.meta-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.field-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.field-row:last-of-type {
  margin-bottom: 1rem;
}
.flex-1 {
  flex: 1;
}

.editor-area {
  display: flex;
  gap: 1rem;
  height: 55vh;
}
.pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-surface);
}
.pane-header {
  padding: 0.5rem 1rem;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}
.editor-textarea {
  flex: 1;
  padding: 1rem;
  border: none;
  resize: none;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.7;
  background: var(--color-surface);
  color: var(--color-text);
  outline: none;
}
.preview-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  line-height: 1.75;
}
.preview-placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

.save-indicator {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .field-row {
    flex-direction: column;
    gap: 0;
  }
  .editor-area {
    flex-direction: column;
    height: auto;
  }
  .pane {
    min-height: 40vh;
  }
}
</style>
