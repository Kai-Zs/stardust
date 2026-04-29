<template>
  <div class="container home">
    <section class="hero">
      <h1>{{ siteStore.get('site_title') || '星霜记' }}</h1>
      <p class="subtitle">{{ siteStore.get('site_description') }}</p>
    </section>
    <section class="recent-posts">
      <h2>最近文章</h2>
      <div v-if="blogStore.loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中…</p>
      </div>
      <template v-else>
        <PostCard v-for="post in blogStore.posts.slice(0, 5)" :key="post.slug" :post="post" />
        <router-link to="/blog" class="more">查看全部 &rarr;</router-link>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useSiteStore } from '../stores/site'
import { useThemeStore } from '../stores/theme'
import { useBlogStore } from '../stores/blog'
import PostCard from '../components/PostCard.vue'
// TODO: 后续改为 siteStore.init() 从后端获取配置，替换 mockSiteConfig 直接导入
import { mockSiteConfig } from '../mock/data'

useHead({
  title: '首页 — 星霜记',
  meta: [
    { name: 'description', content: '星霜记 — 岁月流转，记录时光' },
    { property: 'og:title', content: '首页 — 星霜记' },
    { property: 'og:description', content: '星霜记 — 岁月流转，记录时光' },
    { property: 'og:type', content: 'website' },
  ],
})

const siteStore = useSiteStore()
const blogStore = useBlogStore()
useThemeStore() // 初始化主题

onMounted(() => {
  siteStore.setConfig(mockSiteConfig)
  blogStore.fetchPosts()
})
</script>

<style scoped>
.home {
  padding-bottom: 3rem;
}

/* Hero 区域 */
.hero {
  text-align: center;
  padding: 5rem 0 3rem;
  position: relative;
}
/* 装饰符号 */
.hero::before {
  content: '✦';
  display: block;
  font-size: 1.4rem;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
  opacity: 0.5;
  animation:
    heroIn 0.7s ease both,
    twinkle 3s ease-in-out infinite;
  transition: color 0.4s ease;
}
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}
.hero::after {
  content: '';
  display: block;
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  margin: 2.5rem auto 0;
  border-radius: 1px;
  transition: background 0.4s ease;
}
.hero h1 {
  font-family: var(--font-serif);
  font-size: 2.6rem;
  margin-bottom: 0.6rem;
  letter-spacing: 0.08em;
  animation: heroIn 0.7s ease both;
}
.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  font-style: italic;
  letter-spacing: 0.06em;
  animation: heroIn 0.7s ease both;
  animation-delay: 0.15s;
}
@keyframes heroIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 最近文章区域 */
.recent-posts {
  max-width: 720px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease both;
  animation-delay: 0.3s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.recent-posts h2 {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  transition: border-color 0.4s ease;
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-accent);
  position: relative;
  transition:
    color 0.25s ease,
    gap 0.3s ease;
}
.more:hover {
  gap: 0.6rem;
}
</style>
