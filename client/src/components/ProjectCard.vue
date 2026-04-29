<template>
  <article class="project-card">
    <h3 class="project-name">{{ project.name }}</h3>
    <p class="project-desc">{{ project.description }}</p>
    <div v-if="project.techStack?.length" class="tech-stack">
      <span v-for="tech in project.techStack" :key="tech" class="tech-tag">{{ tech }}</span>
    </div>
    <div v-if="project.github || project.homepage" class="project-links">
      <a v-if="project.github" :href="project.github" target="_blank">GitHub</a>
      <a v-if="project.homepage" :href="project.homepage" target="_blank">主页</a>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  project: {
    name: string
    description: string
    techStack?: string[]
    github?: string
    homepage?: string
  }
}>()
</script>

<style scoped>
.project-card {
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  transition:
    box-shadow var(--transition-normal),
    transform var(--transition-normal),
    background-color 0.4s ease,
    border-color 0.4s ease;
  cursor: pointer;
}
.project-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-accent-light);
}
.project-name {
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
}
.project-desc {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}
.tech-stack {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.tech-tag {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  transition:
    background-color 0.4s ease,
    border-color 0.4s ease;
}
.project-links {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
}
.project-links a {
  color: var(--color-accent);
}
</style>
