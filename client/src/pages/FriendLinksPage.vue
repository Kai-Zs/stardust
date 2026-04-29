<template>
  <div class="container friend-links-page">
    <h1>友链</h1>
    <p class="page-subtitle">在茫茫网海中，与有趣的灵魂相遇</p>
    <div class="links-grid">
      <a
        v-for="link in links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-card"
      >
        <span class="link-avatar">{{ link.name.charAt(0) }}</span>
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
.friend-links-page { padding-bottom: 3rem; }
.friend-links-page h1 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  animation: fadeDown 0.5s ease both;
}
@keyframes fadeDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
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

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.85rem;
}
.link-card {
  display: flex; flex-direction: column; gap: 0.25rem;
  padding: 1.2rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  text-decoration: none;
  animation: cardIn 0.4s ease both;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.4s ease, transform 0.25s ease;
}
.link-card:hover { border-color: var(--color-accent); box-shadow: var(--shadow-hover); text-decoration: none; transform: translateY(-2px); }
@keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.link-card:nth-child(1) { animation-delay: 0.1s; }
.link-card:nth-child(2) { animation-delay: 0.15s; }
.link-card:nth-child(3) { animation-delay: 0.2s; }
.link-card:nth-child(4) { animation-delay: 0.25s; }
.link-card:nth-child(5) { animation-delay: 0.3s; }
.link-card:nth-child(6) { animation-delay: 0.35s; }
.link-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  color: var(--color-accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; font-weight: 600; font-family: var(--font-serif);
  margin-bottom: 0.3rem;
  transition: background-color 0.4s ease, color 0.4s ease;
}
.link-name { font-weight: 600; color: var(--color-text); }
.link-desc { color: var(--color-text-secondary); font-size: 0.85rem; }
</style>
