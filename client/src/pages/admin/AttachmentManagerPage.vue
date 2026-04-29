<template>
  <div class="manager-page">
    <div class="page-header">
      <h1>附件管理</h1>
      <div class="header-actions">
        <label class="btn-primary upload-btn">
          上传文件
          <input type="file" multiple @change="handleUpload" hidden />
        </label>
      </div>
    </div>

    <!-- 附件网格 -->
    <div class="attachment-grid" v-if="files.length > 0">
      <div class="attachment-card" v-for="f in files" :key="f.id">
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
            <button class="btn-sm" @click="copyUrl(f.url)">复制 URL</button>
            <button class="btn-sm btn-danger" @click="doDelete(f.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="empty">暂无附件</p>

    <!-- 复制提示 -->
    <div v-if="copyMsg" class="toast">{{ copyMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Attachment {
  id: number
  name: string
  url: string
  size: number
  date: string
}

const files = ref<Attachment[]>([
  { id: 1, name: 'cover-1.jpg', url: 'https://picsum.photos/seed/img1/300/200', size: 245760, date: '2026-04-20' },
  { id: 2, name: 'avatar.png', url: 'https://picsum.photos/seed/avatar/200/200', size: 102400, date: '2026-04-18' },
  { id: 3, name: 'diagram.svg', url: '', size: 51200, date: '2026-04-15' },
  { id: 4, name: 'readme.md', url: '', size: 4096, date: '2026-04-10' },
])

const copyMsg = ref('')

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
    copyMsg.value = '暂无 URL'
  } else {
    try {
      await navigator.clipboard.writeText(url)
      copyMsg.value = '已复制 URL'
    } catch {
      copyMsg.value = '复制失败'
    }
  }
  setTimeout(() => { copyMsg.value = '' }, 2000)
}

function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  // 阶段二对接真实上传 API
  const newId = Math.max(0, ...files.value.map(f => f.id)) + 1
  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i]
    files.value.push({
      id: newId + i,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      date: new Date().toISOString().slice(0, 10),
    })
  }
  input.value = ''
}

function doDelete(id: number) {
  files.value = files.value.filter(f => f.id !== id)
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
.upload-btn { display: inline-block; cursor: pointer; }

.attachment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.attachment-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}
.card-preview {
  height: 130px;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.card-preview img { width: 100%; height: 100%; object-fit: cover; }
.file-icon {
  font-size: 2rem;
  color: var(--color-text-secondary);
}
.card-info { padding: 0.75rem; }
.file-name {
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.25rem;
}
.file-meta { display: flex; gap: 0.5rem; font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: 0.5rem; }
.card-actions { display: flex; gap: 0.3rem; }
.btn-sm {
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--color-text);
}
.btn-sm:hover { background: var(--color-bg); }
.btn-danger { color: var(--color-danger); border-color: var(--color-danger); }
.btn-danger:hover { background: var(--color-danger); color: #fff; }

.empty { color: var(--color-text-secondary); text-align: center; padding: 2rem; }

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: var(--color-bg);
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.85rem;
  z-index: 200;
}
</style>
