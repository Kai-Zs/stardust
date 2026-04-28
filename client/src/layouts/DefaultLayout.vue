<template>
  <div>
    <header style="border-bottom: 1px solid var(--color-border); padding: 1rem 0;">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;">
        <router-link to="/" style="font-family:var(--font-serif);font-size:1.3rem;font-weight:700;">星霜记</router-link>
        <nav style="display:flex;gap:1.5rem;">
          <router-link to="/blog">博客</router-link>
          <router-link to="/projects">项目</router-link>
          <router-link to="/timeline">时间线</router-link>
          <router-link to="/friends">友链</router-link>
          <router-link to="/music">音乐</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
      </div>
    </header>
    <main style="min-height:70vh;">
      <router-view />
    </main>
    <footer style="border-top:1px solid var(--color-border);padding:2rem 0;text-align:center;color:var(--color-text-secondary);font-size:0.85rem;">
      <p>CC BY-NC-SA 4.0 · 星霜记</p>
    </footer>
  </div>
</template>
