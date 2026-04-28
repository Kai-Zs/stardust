<template>
  <div class="container about-page">
    <h1>关于</h1>
    <section class="about-content">
      <MarkdownRenderer :content="aboutMe" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSiteStore } from '../stores/site'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { mockSiteConfig } from '../mock/data'

const siteStore = useSiteStore()

onMounted(() => {
  siteStore.setConfig(mockSiteConfig)
})

const aboutMe = ref(siteStore.get('about_me') || '暂无介绍')
</script>

<style scoped>
.about-page h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
</style>
