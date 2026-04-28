<template>
  <div class="container home">
    <section class="hero">
      <h1>{{ siteStore.get('site_title') || '星霜记' }}</h1>
      <p class="subtitle">{{ siteStore.get('site_description') }}</p>
    </section>
    <section class="recent-posts">
      <h2>最近文章</h2>
      <PostCard v-for="post in posts.slice(0, 5)" :key="post.slug" :post="post" />
      <router-link to="/blog" class="more">查看全部 &rarr;</router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSiteStore } from '../stores/site'
import { useThemeStore } from '../stores/theme'
import PostCard from '../components/PostCard.vue'
import { mockPosts, mockSiteConfig } from '../mock/data'

const siteStore = useSiteStore()
useThemeStore() // 初始化主题

onMounted(() => {
  siteStore.setConfig(mockSiteConfig)
})

const posts = ref(mockPosts)
</script>

<style scoped>
.hero { text-align: center; padding: 4rem 0 2rem; }
.hero h1 { font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.5rem; }
.subtitle { color: var(--color-text-secondary); font-size: 1.1rem; }
.recent-posts h2 { font-size: 1.3rem; margin-bottom: 1rem; }
.more { display: inline-block; margin-top: 1rem; font-size: 0.9rem; }
</style>
