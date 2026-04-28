<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <div class="form-row">
      <input
        v-model="nickname"
        type="text"
        placeholder="昵称"
        required
        maxlength="30"
        class="form-input"
      />
    </div>
    <div class="form-row">
      <textarea
        v-model="content"
        placeholder="写下你的评论..."
        required
        maxlength="500"
        rows="4"
        class="form-textarea"
      ></textarea>
    </div>
    <div class="form-row">
      <button type="submit" class="submit-btn" :disabled="submitting || !nickname.trim() || !content.trim()">
        {{ submitting ? '提交中...' : '发表评论' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const nickname = ref('')
const content = ref('')
const submitting = ref(false)

const emit = defineEmits<{ submit: [data: { nickname: string; content: string }] }>()

async function handleSubmit() {
  if (!nickname.value.trim() || !content.value.trim()) return
  submitting.value = true
  emit('submit', { nickname: nickname.value.trim(), content: content.value.trim() })
  // TODO: 阶段二接入实际提交逻辑
  submitting.value = false
  content.value = ''
}
</script>

<style scoped>
.comment-form { padding: 1rem 0; }
.form-row { margin-bottom: 0.75rem; }
.form-input, .form-textarea { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); font-size: 0.9rem; resize: vertical; }
.submit-btn { padding: 0.5rem 1.5rem; border: none; border-radius: var(--radius); background: var(--color-accent); color: #fff; cursor: pointer; font-family: var(--font-sans); font-size: 0.9rem; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
