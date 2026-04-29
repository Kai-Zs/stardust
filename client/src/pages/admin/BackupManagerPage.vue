<template>
  <div class="manager-page">
    <div class="admin-page-header">
      <h1>备份恢复</h1>
      <p class="admin-page-subtitle">创建备份、恢复数据</p>
    </div>

    <!-- 自动备份状态 -->
    <div class="status-card">
      <h3>自动备份状态</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">上次自动备份</span>
          <span class="status-value">{{ lastAutoBackup }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">备份间隔</span>
          <span class="status-value">每天 03:00</span>
        </div>
        <div class="status-item">
          <span class="status-label">备份保留份数</span>
          <span class="status-value">7 份</span>
        </div>
        <div class="status-item">
          <span class="status-label">备份文件大小</span>
          <span class="status-value">~2.3 MB</span>
        </div>
      </div>
    </div>

    <!-- 手动备份下载 -->
    <div class="action-card">
      <h3>手动备份</h3>
      <p class="desc">点击下方按钮下载当前数据库的完整备份文件（JSON 格式）。</p>
      <button class="admin-btn-primary" @click="downloadBackup">下载备份</button>
    </div>

    <!-- 上传恢复 -->
    <div class="action-card">
      <h3>数据恢复</h3>
      <p class="desc">上传之前下载的备份文件以恢复数据。此操作将覆盖当前所有数据，请谨慎操作。</p>
      <div class="restore-area">
        <label class="admin-btn-secondary restore-btn">
          选择备份文件
          <input type="file" accept=".json" @change="handleRestore" hidden />
        </label>
        <span v-if="restoreFile" class="selected-file">{{ restoreFile.name }}</span>
      </div>
      <button
        class="admin-btn-danger restore-submit"
        :disabled="!restoreFile"
        @click="confirmRestore"
      >开始恢复</button>
    </div>

    <!-- 恢复确认弹窗 -->
    <div class="admin-modal-overlay" v-if="showRestoreModal" @click.self="showRestoreModal = false">
      <div class="admin-modal backup-modal">
        <h3>确认恢复数据</h3>
        <p>此操作将<strong>永久覆盖</strong>当前所有数据，建议先下载一份当前备份。确定要继续吗？</p>
        <div class="admin-modal-actions">
          <button class="admin-btn-secondary" @click="showRestoreModal = false">取消</button>
          <button class="admin-btn-danger" @click="doRestore">确认恢复</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const lastAutoBackup = ref('2026-04-28 03:00:05')
const restoreFile = ref<File | null>(null)
const showRestoreModal = ref(false)

function downloadBackup() {
  // 阶段二对接真实 API
  const data = JSON.stringify({ exportedAt: new Date().toISOString(), version: '1.0' }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `stardust-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleRestore(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    restoreFile.value = input.files[0]
  }
}

function confirmRestore() {
  if (!restoreFile.value) return
  showRestoreModal.value = true
}

function doRestore() {
  // 阶段二对接真实 API
  alert('数据已恢复（阶段二对接真实接口）')
  restoreFile.value = null
  showRestoreModal.value = false
}
</script>

<style scoped>
.manager-page { max-width: 720px; margin: 0 auto; }
.manager-page h1 { margin-bottom: 1.5rem; }

.status-card, .action-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.status-card h3, .action-card h3 { margin-bottom: 1rem; font-size: 1.1rem; }

.status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.status-item { display: flex; flex-direction: column; gap: 0.2rem; }
.status-label { font-size: 0.85rem; color: var(--color-text-secondary); }
.status-value { font-weight: 600; }

.desc { color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: 1rem; }

.restore-area { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.restore-btn { cursor: pointer; }
.selected-file { font-size: 0.9rem; color: var(--color-accent); }

.backup-modal { max-width: 440px; }
.backup-modal h3 { margin-bottom: 0.5rem; }
.backup-modal p { color: var(--color-text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.6; }
.admin-modal-actions .admin-btn-danger { padding: 0.5rem 1.25rem; border-radius: var(--radius); }

@media (max-width: 480px) {
  .status-grid { grid-template-columns: 1fr; }
}
</style>
