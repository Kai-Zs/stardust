<template>
  <div class="container timeline-page">
    <h1>时间线</h1>
    <div class="timeline">
      <TimelineEntry v-for="item in items" :key="item.id" :entry="item" />
    </div>
    <EmptyState v-if="!items.length" message="暂无记录" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimelineEntry from '../components/TimelineEntry.vue'
import EmptyState from '../components/EmptyState.vue'
import { mockTimeline } from '../mock/data'

const items = ref(mockTimeline)
</script>

<style scoped>
.timeline-page h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
.timeline { position: relative; }
</style>
