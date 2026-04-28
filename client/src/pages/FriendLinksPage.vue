<template>
  <div class="container friend-links-page">
    <h1>友链</h1>
    <div class="links-grid">
      <a
        v-for="link in links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-card"
      >
        <span class="link-name">{{ link.name }}</span>
        <span class="link-desc">{{ link.description }}</span>
      </a>
    </div>
    <EmptyState v-if="!links.length" message="暂无友链" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import { mockFriendLinks } from '../mock/data'

const links = ref(mockFriendLinks)
</script>

<style scoped>
.friend-links-page h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
.links-grid { display: grid; gap: 0.75rem; }
.link-card {
  display: flex; flex-direction: column; gap: 0.25rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.link-card:hover { border-color: var(--color-accent); box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-decoration: none; }
.link-name { font-weight: 600; color: var(--color-text); }
.link-desc { color: var(--color-text-secondary); font-size: 0.85rem; }
</style>
