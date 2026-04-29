<template>
  <div class="container projects-page">
    <h1>项目</h1>
    <p class="page-subtitle">代码是另一种诗歌</p>

    <section v-if="featuredProjects.length" class="featured-projects">
      <h2>精选项目</h2>
      <div class="project-grid">
        <ProjectCard
          v-for="project in featuredProjects"
          :key="project.id"
          :project="toComponentProp(project)"
        />
      </div>
    </section>

    <section v-if="regularProjects.length" class="all-projects">
      <h2 v-if="featuredProjects.length">其他项目</h2>
      <h2 v-else>全部项目</h2>
      <div class="project-grid">
        <ProjectCard
          v-for="project in regularProjects"
          :key="project.id"
          :project="toComponentProp(project)"
        />
      </div>
    </section>

    <EmptyState v-if="!blogStore.projects.length">暂无项目</EmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import ProjectCard from '../components/ProjectCard.vue'

useHead({
  title: '项目 — 星霜记',
  meta: [
    { name: 'description', content: '代码是另一种诗歌' },
    { property: 'og:title', content: '项目 — 星霜记' },
    { property: 'og:description', content: '代码是另一种诗歌' },
    { property: 'og:type', content: 'website' },
  ],
})
import EmptyState from '../components/EmptyState.vue'
import { useBlogStore } from '../stores/blog'
import type { Project } from '../stores/blog'

const blogStore = useBlogStore()
onMounted(() => blogStore.fetchProjects())

function toComponentProp(p: Project) {
  return {
    name: p.name,
    description: p.description,
    techStack: p.tech_stack,
    github: p.github_url || undefined,
    homepage: p.homepage_url || undefined,
  }
}

const featuredProjects = computed(() => blogStore.projects.filter((p) => p.featured))
const regularProjects = computed(() => blogStore.projects.filter((p) => !p.featured))
</script>

<style scoped>
.projects-page {
  padding-bottom: 3rem;
}
.projects-page h1 {
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

.featured-projects {
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease both;
  animation-delay: 0.1s;
}
.all-projects {
  animation: fadeIn 0.5s ease both;
  animation-delay: 0.2s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.featured-projects h2,
.all-projects h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
/* 卡片 stagger 入场 */
.project-grid :deep(.project-card) {
  animation: cardIn 0.4s ease both;
}
.project-grid :deep(.project-card:nth-child(1)) {
  animation-delay: 0.15s;
}
.project-grid :deep(.project-card:nth-child(2)) {
  animation-delay: 0.22s;
}
.project-grid :deep(.project-card:nth-child(3)) {
  animation-delay: 0.29s;
}
.project-grid :deep(.project-card:nth-child(4)) {
  animation-delay: 0.36s;
}
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
