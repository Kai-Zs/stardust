<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p v-if="daysRunning > 0">本站已运行 {{ daysRunning }} 天</p>
      <p>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"
          >CC BY-NC-SA 4.0</a
        >
        · Powered by <a href="https://github.com/Kai-Zs/stardust" target="_blank">星霜记</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteStore } from '../stores/site'

const siteStore = useSiteStore()

const daysRunning = computed(() => {
  const start = siteStore.get('site_created_at')
  if (!start) return 0
  return Math.floor((Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
})
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding: 2rem 0;
  margin-top: 3rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}
.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
</style>
