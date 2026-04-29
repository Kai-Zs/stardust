<template>
  <div class="image-uploader">
    <div class="upload-area" @click="triggerFileInput">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileChange"
      />
      <div v-if="!previewUrl" class="upload-placeholder">
        <span class="upload-icon">+</span>
        <p>点击选择图片</p>
      </div>
      <img v-else :src="previewUrl" class="preview" alt="预览" />
    </div>
    <button v-if="selectedFile" class="upload-btn" :disabled="uploading" @click="handleUpload">
      {{ uploading ? '上传中...' : '上传图片' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const uploading = ref(false)

const emit = defineEmits<{ upload: [file: File] }>()

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function handleUpload() {
  if (!selectedFile.value) return
  uploading.value = true
  emit('upload', selectedFile.value)
  // TODO: 阶段二接入实际上传逻辑
  uploading.value = false
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}
.upload-placeholder {
  text-align: center;
  color: var(--color-text-secondary);
}
.upload-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}
.preview {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}
.upload-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  background: var(--color-accent);
  color: var(--color-on-accent);
  cursor: pointer;
  font-family: var(--font-sans);
  align-self: flex-start;
}
.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
