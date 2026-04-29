<template>
  <button class="theme-toggle" @click="themeStore.toggle()" :title="themeStore.theme === 'dark' ? '切换浅色' : '切换深色'">
    <Transition name="icon" mode="out-in">
      <span :key="themeStore.theme" class="icon-wrap">
        {{ themeStore.theme === 'dark' ? '☀' : '☾' }}
      </span>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle { background: none; border: 1px solid var(--color-border); border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; color: var(--color-text); transition: border-color var(--transition-fast), background var(--transition-fast); overflow: hidden; }
.theme-toggle:hover { border-color: var(--color-accent); background: var(--color-surface); }
.icon-wrap { display: inline-block; line-height: 1; }
.icon-enter-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out; }
.icon-leave-active { transition: transform 0.2s ease-in, opacity 0.15s ease-in; }
.icon-enter-from { transform: rotate(-90deg) scale(0.5); opacity: 0; }
.icon-leave-to { transform: rotate(90deg) scale(0.5); opacity: 0; }
</style>
