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
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.dialog { background: var(--color-surface); padding: 2rem; border-radius: var(--radius); max-width: 400px; border: 1px solid var(--color-border); }
.actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
.btn-cancel { padding: 0.4rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-bg); cursor: pointer; color: var(--color-text); }
.btn-confirm { padding: 0.4rem 1rem; border: none; border-radius: var(--radius); background: var(--color-accent); color: #fff; cursor: pointer; }
</style>
