<template>
  <header class="navbar">
    <div class="container nav-inner">
      <router-link to="/" class="logo">星霜记</router-link>
      <nav class="nav-links">
        <router-link to="/blog">博客</router-link>
        <router-link to="/projects">项目</router-link>
        <router-link to="/timeline">时间线</router-link>
        <router-link to="/friends">友链</router-link>
        <router-link to="/music">音乐</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<style scoped>
.navbar { border-bottom: 1px solid var(--color-border); padding: 1rem 0; background: var(--color-bg); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; }
.logo { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: var(--color-text); }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { font-size: 0.95rem; transition: color var(--transition-fast); }
.nav-links a:hover { color: var(--color-accent); }
.nav-links a.router-link-exact-active { color: var(--color-accent); font-weight: 600; }
</style>
