<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <h1>附件管理</h1>
      <div class="header-actions">
        <label class="admin-btn-primary upload-btn">
          上传文件
          <input type="file" multiple hidden @change="handleUpload" />
        </label>
      </div>
    </div>

    <!-- 附件网格 -->
    <div v-if="files.length > 0" class="attachment-grid">
      <div v-for="f in files" :key="f.id" class="attachment-card">
        <div class="card-preview">
          <img v-if="isImage(f.name)" :src="f.url" :alt="f.name" />
          <div v-else class="file-icon">文档</div>
        </div>
        <div class="card-info">
          <div class="file-name" :title="f.name">{{ f.name }}</div>
          <div class="file-meta">
            <span>{{ formatSize(f.size) }}</span>
            <span>{{ f.date }}</span>
          </div>
          <div class="card-actions">
            <button class="admin-btn-sm" @click="copyUrl(f.url)">复制 URL</button>
            <button class="admin-btn-sm admin-btn-danger" @click="doDelete(f.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="admin-empty">暂无附件</p>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast'
import { api } from '../../api'

interface Attachment {
  id: number
  name: string
  url: string
  size: number
  date: string
}

// TODO: 后续改为从 adminStore 或专用 API 获取附件列表
const files = ref<Attachment[]>([])
const loading = ref(false)

const toast = useToastStore()

function isImage(filename: string): boolean {
  return /\.(png|jpe?g|gif|svg|webp)$/i.test(filename)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function copyUrl(url: string) {
  if (!url) {
    toast.warning('暂无 URL')
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    toast.success('已复制 URL')
  } catch {
    toast.error('复制失败')
  }
}

async function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  loading.value = true
  try {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i]
      const formData = new FormData()
      formData.append('file', file)
      // TODO: 对接真实附件上传接口
      const result = await api.upload<{ id: number; url: string }>('/attachments', formData)
      files.value.push({
        id: result.id,
        name: file.name,
        url: result.url,
        size: file.size,
        date: new Date().toISOString().slice(0, 10),
      })
    }
    toast.success('上传成功')
  } catch {
    toast.error('上传失败，请检查网络或服务端状态')
  } finally {
    loading.value = false
    input.value = ''
  }
}

async function doDelete(id: number) {
  try {
    // TODO: 对接真实附件删除接口
    await api.delete('/attachments/' + id)
    files.value = files.value.filter((f) => f.id !== id)
    toast.success('附件已删除')
  } catch {
    toast.error('删除失败')
  }
}

// TODO: 对接真实接口获取附件列表
async function fetchFiles() {
  loading.value = true
  try {
    const data = await api.get<Attachment[]>('/attachments')
    files.value = data
  } catch {
    // 接口未实现时静默失败，保持空列表
  } finally {
    loading.value = false
  }
}

onMounted(fetchFiles)
</script>

<style scoped>
.manager-page {
  max-width: 960px;
  margin: 0 auto;
}
.header-actions {
  display: flex;
  gap: 0.75rem;
}
.upload-btn {
  display: inline-block;
  cursor: pointer;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.attachment-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.25s ease;
}
.attachment-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-accent-light);
}
.card-preview {
  height: 130px;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.card-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.file-icon {
  font-size: 2rem;
  color: var(--color-text-secondary);
}
.card-info {
  padding: 0.75rem;
}
.file-name {
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.25rem;
}
.file-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}
.card-actions {
  display: flex;
  gap: 0.3rem;
}
</style>
