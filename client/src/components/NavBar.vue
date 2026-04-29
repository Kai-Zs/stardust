<template>
  <header class="navbar">
    <div class="container nav-inner">
      <router-link to="/" class="logo">
        <span class="logo-deco">✦</span>
        <span>星霜记</span>
      </router-link>

      <button
        class="menu-toggle"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="菜单"
      >
        <span></span><span></span><span></span>
      </button>

      <nav class="nav-links" :class="{ open: menuOpen }">
        <router-link to="/blog" @click="menuOpen = false">博客</router-link>
        <router-link to="/projects" @click="menuOpen = false">项目</router-link>
        <router-link to="/timeline" @click="menuOpen = false">时间线</router-link>
        <router-link to="/friends" @click="menuOpen = false">友链</router-link>
        <router-link to="/music" @click="menuOpen = false">音乐</router-link>
        <router-link to="/about" @click="menuOpen = false">关于</router-link>
      </nav>

      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const menuOpen = ref(false)
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.85rem 0;
  background: var(--color-bg);
  background: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 0.04em;
}
.logo:hover { text-decoration: none; }
.logo-deco {
  font-size: 0.7em;
  color: var(--color-accent);
  opacity: 0.7;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* Nav links */
.nav-links {
  display: flex;
  gap: 2rem;
}
.nav-links a {
  position: relative;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  transition: color var(--transition-fast);
}
.nav-links a::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  border-radius: 1px;
  transform: translateX(-50%);
  transition: width 0.25s ease;
}
.nav-links a:hover { color: var(--color-accent); text-decoration: none; }
.nav-links a:hover::after { width: 100%; }
.nav-links a.router-link-exact-active {
  color: var(--color-accent);
  font-weight: 600;
}
.nav-links a.router-link-exact-active::after {
  width: 100%;
}

/* Mobile hamburger */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.menu-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.2s ease, background-color 0.4s ease;
}
.menu-toggle.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-toggle.active span:nth-child(2) { opacity: 0; }
.menu-toggle.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 640px) {
  .menu-toggle { display: flex; }
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--color-bg);
    background: color-mix(in srgb, var(--color-bg) 95%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
    padding: 0 1.25rem;
  }
  .nav-links.open {
    max-height: 400px;
    padding: 0.75rem 1.25rem;
  }
  .nav-links a {
    padding: 0.65rem 0;
    font-size: 1rem;
  }
  .nav-links a::after { bottom: 2px; }
  .navbar { position: relative; }
}
</style>
