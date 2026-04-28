<template>
  <article class="post-card">
    <router-link :to="`/blog/${post.slug}`">
      <h3>{{ post.title }}</h3>
    </router-link>
    <div class="meta">
      <span>{{ post.date }}</span>
      <span v-if="post.wordCount">约 {{ post.wordCount }} 字</span>
      <span v-if="post.readingTime">阅读约 {{ post.readingTime }} 分钟</span>
    </div>
    <p class="excerpt">{{ post.excerpt }}</p>
    <div class="tags" v-if="post.tags?.length">
      <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    slug: string; title: string; date: string; excerpt: string
    tags: string[]; wordCount?: number; readingTime?: number
  }
}>()
</script>

<style scoped>
.post-card { padding: 1.5rem 0; border-bottom: 1px solid var(--color-border); }
.post-card h3 { font-size: 1.25rem; margin-bottom: 0.3rem; }
.meta { font-size: 0.85rem; color: var(--color-text-secondary); display: flex; gap: 0.75rem; margin-bottom: 0.4rem; }
.excerpt { color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 0.5rem; }
.tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tag { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.15rem 0.6rem; font-size: 0.8rem; }
</style>
