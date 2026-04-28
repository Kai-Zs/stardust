<template>
  <div class="pagination" v-if="totalPages > 1">
    <button :disabled="page <= 1" @click="$emit('change', page - 1)">上一页</button>
    <span>{{ page }} / {{ totalPages }}</span>
    <button :disabled="page >= totalPages" @click="$emit('change', page + 1)">下一页</button>
  </div>
</template>
<script setup lang="ts">
defineProps<{ page: number; totalPages: number }>()
defineEmits<{ change: [page: number] }>()
</script>
<style scoped>
.pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; padding: 2rem 0; }
.pagination button { padding: 0.4rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); cursor: pointer; color: var(--color-text); font-family: var(--font-sans); }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
