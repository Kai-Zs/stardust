<template>
  <div class="tag-cloud">
    <button v-for="tag in tags" :key="tag" @click="$emit('select', tag)" class="tag-btn">{{ tag }}</button>
  </div>
</template>
<script setup lang="ts">
defineProps<{ tags: string[] }>()
defineEmits<{ select: [tag: string] }>()
</script>
<style scoped>
.tag-cloud { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag-btn { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.3rem 0.8rem; cursor: pointer; font-size: 0.85rem; color: var(--color-text); font-family: var(--font-sans); }
.tag-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
</style>
