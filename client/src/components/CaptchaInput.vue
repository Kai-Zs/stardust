<template>
  <div class="captcha-input">
    <input
      v-model="captcha"
      type="text"
      placeholder="请输入验证码"
      maxlength="6"
      class="captcha-field"
    />
    <span class="captcha-hint">阶段三完善</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const captcha = ref('')
</script>

<style scoped>
.captcha-input { display: flex; gap: 0.5rem; align-items: center; }
.captcha-field { flex: 1; padding: 0.5rem 0.8rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); font-size: 0.9rem; }
.captcha-hint { font-size: 0.75rem; color: var(--color-text-secondary); }
</style>
