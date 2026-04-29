<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-main {
  flex: 1;
  padding: 2rem;
  min-width: 0;
  transition:
    background-color 0.4s ease,
    color 0.4s ease;
}
.page-enter-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}
.page-leave-active {
  transition: opacity 0.15s ease-in;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
}
</style>
