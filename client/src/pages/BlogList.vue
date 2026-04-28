<template>
  <div class="container blog-list">
    <h1>博客</h1>

    <section class="tag-section">
      <h3>标签筛选</h3>
      <TagCloud :tags="allTags" @select="filterByTag" />
      <button v-if="selectedTag" class="clear-filter" @click="clearFilter">清除筛选</button>
    </section>

    <section class="post-list">
      <PostCard v-for="post in paginatedPosts" :key="post.slug" :post="post" />
      <EmptyState v-if="!filteredPosts.length" message="暂无匹配的文章" />
    </section>

    <Pagination
      v-if="filteredPosts.length > pageSize"
      :page="currentPage"
      :totalPages="totalPages"
      @change="goToPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostCard from '../components/PostCard.vue'
import TagCloud from '../components/TagCloud.vue'
import Pagination from '../components/Pagination.vue'
import EmptyState from '../components/EmptyState.vue'
import { mockPosts } from '../mock/data'

const posts = ref(mockPosts)
const selectedTag = ref('')
const currentPage = ref(1)
const pageSize = 5

const allTags = computed(() => {
  const tagSet = new Set<string>()
  posts.value.forEach(p => p.tags.forEach(t => tagSet.add(t)))
  return [...tagSet].sort()
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value.filter(p => p.tags.includes(selectedTag.value))
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
.blog-list h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
.tag-section { margin-bottom: 2rem; }
.tag-section h3 { font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-text-secondary); }
.clear-filter { margin-top: 0.5rem; background: none; border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.2rem 0.8rem; cursor: pointer; font-size: 0.8rem; color: var(--color-text-secondary); font-family: var(--font-sans); }
.clear-filter:hover { border-color: var(--color-accent); color: var(--color-accent); }
</style>
