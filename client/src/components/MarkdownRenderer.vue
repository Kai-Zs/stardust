<template>
  <div class="markdown-body" v-html="rendered" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps<{ content: string }>()
const rendered = computed(() => renderMarkdown(props.content))
</script>

<style>
/* highlight.js dark mode 适配 */
html.dark .hljs { background: #1e1e1e !important; }
/* KaTeX dark mode 适配 */
html.dark .katex { color: #e8d5c4; }
</style>

<style scoped>
.markdown-body { line-height: 1.85; word-wrap: break-word; }
.markdown-body :deep(h2) { font-size: 1.5rem; margin: 2rem 0 0.8rem; padding-bottom: 0.3rem; border-bottom: 1px solid var(--color-border); }
.markdown-body :deep(h3) { font-size: 1.2rem; margin: 1.5rem 0 0.5rem; }
.markdown-body :deep(p) { margin-bottom: 1rem; }
.markdown-body :deep(code) { background: var(--color-surface); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; font-family: var(--font-mono); }
.markdown-body :deep(.code-block) { position: relative; margin: 1rem 0; }
.markdown-body :deep(.code-block .copy-btn) { position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.2rem 0.6rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 4px; cursor: pointer; font-size: 0.75rem; color: var(--color-text-secondary); font-family: var(--font-sans); opacity: 0; transition: opacity var(--transition-fast); z-index: 1; }
.markdown-body :deep(.code-block:hover .copy-btn) { opacity: 1; }
.markdown-body :deep(.code-block .copy-btn:hover) { border-color: var(--color-accent); color: var(--color-accent); }
.markdown-body :deep(pre) { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem; overflow-x: auto; margin: 0; }
.markdown-body :deep(pre code) { background: none; padding: 0; font-size: 0.85rem; line-height: 1.6; }
.markdown-body :deep(blockquote) { border-left: 3px solid var(--color-accent); padding-left: 1rem; color: var(--color-text-secondary); margin: 1rem 0; }
.markdown-body :deep(img) { border-radius: var(--radius); max-width: 100%; }
.markdown-body :deep(a) { color: var(--color-accent); }
.markdown-body :deep(table) { width: 100%; border-collapse: collapse; margin: 1rem 0; }
.markdown-body :deep(th), .markdown-body :deep(td) { border: 1px solid var(--color-border); padding: 0.5rem 0.75rem; text-align: left; }
.markdown-body :deep(th) { background: var(--color-surface); }
.markdown-body :deep(.katex-display) { margin: 1rem 0; overflow-x: auto; }
.markdown-body :deep(.katex-error) { color: #d32f2f; }
</style>
