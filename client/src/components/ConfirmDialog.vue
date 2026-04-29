<template>
  <div v-if="visible" class="overlay" @click.self="$emit('cancel')">
    <div class="dialog">
      <p>{{ message }}</p>
      <div class="actions">
        <button class="btn-cancel" @click="$emit('cancel')">取消</button>
        <button class="btn-confirm" @click="$emit('confirm')">确认</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ visible: boolean; message: string }>()
defineEmits<{ confirm: []; cancel: [] }>()
</script>
<style scoped>
.overlay { position: fixed; inset: 0; background: var(--shadow-overlay); display: flex; align-items: center; justify-content: center; z-index: 100; animation: overlayIn 0.2s ease both; }
.dialog { background: var(--color-surface); padding: 2rem; border-radius: var(--radius); max-width: 400px; border: 1px solid var(--color-border); animation: dialogIn 0.25s ease both; }
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes dialogIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
.btn-cancel { padding: 0.4rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-bg); cursor: pointer; color: var(--color-text); }
.btn-confirm { padding: 0.4rem 1rem; border: none; border-radius: var(--radius); background: var(--color-accent); color: var(--color-on-accent); cursor: pointer; }
</style>
