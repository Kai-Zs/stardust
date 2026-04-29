<template>
  <slot v-if="!error" />
  <div v-else class="error-boundary">
    <h2>出错了</h2>
    <p>{{ error.message || '发生了一个意外错误' }}</p>
    <button class="btn-retry" @click="retry">重试</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  return false // 阻止错误继续向上传播
})

function retry() {
  error.value = null
}
</script>

<style scoped>
.error-boundary {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text);
}
.error-boundary h2 {
  color: var(--color-error, #e74c3c);
  margin-bottom: 0.5rem;
}
.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}
</style>
