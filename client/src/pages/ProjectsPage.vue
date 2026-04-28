<template>
  <div class="container projects-page">
    <h1>项目</h1>

    <section class="featured-projects" v-if="featuredProjects.length">
      <h2>精选项目</h2>
      <div class="project-grid">
        <ProjectCard
          v-for="project in featuredProjects"
          :key="project.id"
          :project="toComponentProp(project)"
        />
      </div>
    </section>

    <section class="all-projects" v-if="regularProjects.length">
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

    <EmptyState v-if="!projects.length" message="暂无项目" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { mockProjects } from '../mock/data'

const projects = ref(mockProjects)

interface MockProject {
  id: number
  name: string
  description: string
  tech_stack: string[]
  github_url: string | null
  homepage_url: string | null
  featured: boolean
}

function toComponentProp(p: MockProject) {
  return {
    name: p.name,
    description: p.description,
    techStack: p.tech_stack,
    github: p.github_url || undefined,
    homepage: p.homepage_url || undefined,
  }
}

const featuredProjects = computed(() => projects.value.filter(p => p.featured))
const regularProjects = computed(() => projects.value.filter(p => !p.featured))
</script>

<style scoped>
.projects-page h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
.featured-projects { margin-bottom: 2rem; }
.featured-projects h2, .all-projects h2 { font-size: 1.2rem; margin-bottom: 1rem; color: var(--color-text-secondary); }
.project-grid { display: grid; gap: 1rem; }
</style>
