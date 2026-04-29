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
.timeline-entry { display: flex; gap: 1rem; padding: 1rem 0; padding-right: 0; }
.timeline-dot {
  flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%;
  background: var(--color-surface); border: 2px solid var(--color-accent);
  display: flex; align-items: center; justify-content: center;
  position: relative;
  transition: background-color 0.4s ease, border-color 0.4s ease;
}
/* 圆点呼吸光晕 */
.timeline-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  opacity: 0;
  animation: pulse 2.5s ease-in-out infinite;
  transition: border-color 0.4s ease;
}
@keyframes pulse { 0%, 100% { opacity: 0; transform: scale(0.8); } 50% { opacity: 0.3; transform: scale(1); } }
.timeline-icon { font-size: 0.9rem; transition: color 0.4s ease; }
.timeline-date { font-size: 0.8rem; color: var(--color-text-secondary); }
.timeline-title { font-size: 1.05rem; margin: 0.2rem 0; }
.timeline-desc { color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.5; }
</style>
