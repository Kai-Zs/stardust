<template>
  <nav class="pagination" v-if="totalPages > 1" aria-label="分页">
    <button :disabled="safePage <= 1" @click="$emit('change', safePage - 1)">上一页</button>
    <span>{{ safePage }} / {{ totalPages }}</span>
    <button :disabled="safePage >= totalPages" @click="$emit('change', safePage + 1)">下一页</button>
  </nav>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; totalPages: number }>()
defineEmits<{ change: [page: number] }>()

const safePage = computed(() => Math.max(1, Math.min(props.page, props.totalPages || 1)))
</script>
<style scoped>
.pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; padding: 2rem 0; }
.pagination button { padding: 0.4rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); cursor: pointer; color: var(--color-text); font-family: var(--font-sans); }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
