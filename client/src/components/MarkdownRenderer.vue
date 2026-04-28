<template>
  <div class="markdown-body">
    <pre class="markdown-raw">{{ content }}</pre>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<style scoped>
.markdown-body {
  line-height: 1.8;
}
.markdown-raw {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  overflow-x: auto;
}
</style>
