<template>
  <div style="display:flex;min-height:100vh;">
    <AdminSidebar />
    <main style="flex:1;padding:2rem;">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue'
</script>
