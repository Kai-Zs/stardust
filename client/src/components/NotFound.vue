<template>
  <div class="not-found">
    <h2>404</h2>
    <p class="not-found-msg">页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found { text-align: center; padding: 5rem 0; }
.not-found-msg { color: var(--color-text-secondary); margin: 1rem 0; }
</style>
