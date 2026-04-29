<template>
  <article class="timeline-entry">
    <div class="timeline-dot">
      <span class="timeline-icon">{{ entry.icon || '●' }}</span>
    </div>
    <div class="timeline-content">
      <time class="timeline-date">{{ entry.date }}</time>
      <h3 class="timeline-title">{{ entry.title }}</h3>
      <p v-if="entry.description" class="timeline-desc">{{ entry.description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  entry: {
    date: string
    icon?: string
    title: string
    description?: string
  }
}>()
</script>

<style scoped>
.timeline-entry { display: flex; gap: 1rem; padding: 1rem 0; }
.timeline-dot { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--color-surface); border: 2px solid var(--color-accent); display: flex; align-items: center; justify-content: center; }
.timeline-icon { font-size: 0.9rem; }
.timeline-date { font-size: 0.8rem; color: var(--color-text-secondary); }
.timeline-title { font-size: 1.05rem; margin: 0.2rem 0; }
.timeline-desc { color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.5; }
</style>
