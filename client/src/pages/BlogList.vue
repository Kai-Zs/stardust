<template>
  <div class="container blog-list">
    <h1>博客</h1>
    <p class="page-subtitle">用文字记录，每一段值得留恋的时光</p>

    <section class="tag-section">
      <h3>标签筛选</h3>
      <TagCloud :tags="allTags" @select="filterByTag" />
      <button v-if="selectedTag" class="clear-filter" @click="clearFilter">清除筛选</button>
    </section>

    <section class="post-list">
      <PostCard v-for="post in paginatedPosts" :key="post.slug" :post="post" />
      <EmptyState v-if="!filteredPosts.length">暂无匹配的文章</EmptyState>
    </section>

    <Pagination
      v-if="filteredPosts.length > pageSize"
      :page="currentPage"
      :total-pages="totalPages"
      @change="goToPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '../stores/blog'
import PostCard from '../components/PostCard.vue'
import TagCloud from '../components/TagCloud.vue'
import Pagination from '../components/Pagination.vue'
import EmptyState from '../components/EmptyState.vue'

const blogStore = useBlogStore()

onMounted(() => {
  blogStore.fetchPosts()
})

const posts = computed(() => blogStore.posts)
const selectedTag = ref('')
const currentPage = ref(1)
const pageSize = 5

const allTags = computed(() => {
  const tagSet = new Set<string>()
  posts.value.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return [...tagSet].sort()
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value.filter((p) => p.tags.includes(selectedTag.value))
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

function filterByTag(tag: string) {
  selectedTag.value = tag
  currentPage.value = 1
}

function clearFilter() {
  selectedTag.value = ''
  currentPage.value = 1
}

function goToPage(page: number) {
  currentPage.value = page
}
</script>

<style scoped>
.blog-list {
  padding-bottom: 3rem;
}
.blog-list h1 {
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

.tag-section {
  margin-bottom: 2rem;
  animation: fadeDown 0.5s ease both;
  animation-delay: 0.1s;
}
.tag-section h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}
.clear-filter {
  margin-top: 0.5rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.2rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  transition:
    border-color 0.4s ease,
    color 0.4s ease;
}
.clear-filter:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* 文章列表 stagger 入场 */
.post-list :deep(.post-card:nth-child(1)) {
  animation-delay: 0.15s;
}
.post-list :deep(.post-card:nth-child(2)) {
  animation-delay: 0.22s;
}
.post-list :deep(.post-card:nth-child(3)) {
  animation-delay: 0.29s;
}
.post-list :deep(.post-card:nth-child(4)) {
  animation-delay: 0.36s;
}
.post-list :deep(.post-card:nth-child(5)) {
  animation-delay: 0.43s;
}
</style>
