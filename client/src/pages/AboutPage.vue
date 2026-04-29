<template>
  <div class="container about-page">
    <h1>关于</h1>
    <p class="page-subtitle">关于这个博客，和它背后的人</p>
    <section class="about-content">
      <MarkdownRenderer :content="aboutMe" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useSiteStore } from '../stores/site'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
// TODO: 阶段三接入真实API后移除 mockSiteConfig
import { mockSiteConfig } from '../mock/data'

useHead({
  title: '关于 — 星霜记',
  meta: [
    { name: 'description', content: '关于这个博客和它背后的人' },
    { property: 'og:title', content: '关于 — 星霜记' },
    { property: 'og:description', content: '关于这个博客和它背后的人' },
    { property: 'og:type', content: 'website' },
  ],
})

const siteStore = useSiteStore()

onMounted(() => {
  siteStore.setConfig(mockSiteConfig)
})

const aboutMe = computed(() => siteStore.get('about_me') || '暂无介绍')
</script>

<style scoped>
.about-page {
  padding-bottom: 3rem;
}
.about-page h1 {
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
.about-content {
  animation: fadeUp 0.5s ease both;
  animation-delay: 0.15s;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
