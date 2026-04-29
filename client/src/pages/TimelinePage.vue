<template>
  <div class="container timeline-page">
    <h1>时间线</h1>
    <p class="page-subtitle">回首来路，每一步都是风景</p>
    <div class="timeline">
      <TimelineEntry v-for="item in blogStore.timeline" :key="item.id" :entry="item" />
    </div>
    <div v-if="blogStore.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中…</p>
    </div>
    <EmptyState v-else-if="!blogStore.timeline.length">暂无记录</EmptyState>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import TimelineEntry from '../components/TimelineEntry.vue'
import EmptyState from '../components/EmptyState.vue'
import { useBlogStore } from '../stores/blog'

useHead({
  title: '时间线 — 星霜记',
  meta: [
    { name: 'description', content: '回首来路，每一步都是风景' },
    { property: 'og:title', content: '时间线 — 星霜记' },
    { property: 'og:description', content: '回首来路，每一步都是风景' },
    { property: 'og:type', content: 'website' },
  ],
})

const blogStore = useBlogStore()
onMounted(() => blogStore.fetchTimeline())
</script>

<style scoped>
.timeline-page {
  padding-bottom: 3rem;
}
.timeline-page h1 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  animation: fadeDown 0.5s ease both;
}
@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  font-style: italic;
  letter-spacing: 0.04em;
  margin-top: -1rem;
  margin-bottom: 2rem;
  animation: fadeDown 0.5s ease both;
  animation-delay: 0.08s;
}

.timeline {
  position: relative;
  padding-left: 0;
}
/* 连接线 — 从上到下绘制动画 */
.timeline::before {
  content: '';
  position: absolute;
  left: 39px;
  top: 1rem;
  bottom: 1rem;
  width: 2px;
  background: linear-gradient(
    to bottom,
    var(--color-accent) 0%,
    var(--color-border) 50%,
    var(--color-border) 100%
  );
  border-radius: 1px;
  opacity: 0.4;
  transform: scaleY(0);
  transform-origin: top;
  animation: lineGrow 0.8s ease both;
  animation-delay: 0.2s;
  transition: background 0.4s ease;
}
@keyframes lineGrow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
/* 条目 stagger 入场 */
.timeline :deep(.timeline-entry) {
  animation: entryIn 0.4s ease both;
}
.timeline :deep(.timeline-entry:nth-child(1)) {
  animation-delay: 0.35s;
}
.timeline :deep(.timeline-entry:nth-child(2)) {
  animation-delay: 0.45s;
}
.timeline :deep(.timeline-entry:nth-child(3)) {
  animation-delay: 0.55s;
}
.timeline :deep(.timeline-entry:nth-child(4)) {
  animation-delay: 0.65s;
}
.timeline :deep(.timeline-entry:nth-child(5)) {
  animation-delay: 0.75s;
}
@keyframes entryIn {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
