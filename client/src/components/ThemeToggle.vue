<template>
  <button class="theme-toggle" @click="themeStore.toggle()" :title="themeStore.theme === 'dark' ? '切换浅色' : '切换深色'">
    {{ themeStore.theme === 'dark' ? '☀' : '☾' }}
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle { background: none; border: 1px solid var(--color-border); border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; color: var(--color-text); transition: border-color var(--transition-fast), background var(--transition-fast); }
.theme-toggle:hover { border-color: var(--color-accent); background: var(--color-surface); }
</style>
