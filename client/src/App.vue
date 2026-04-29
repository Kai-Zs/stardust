<template>
  <ErrorBoundary>
    <router-view />
  </ErrorBoundary>
  <Toast />
</template>

<script setup lang="ts">
import ErrorBoundary from './components/ErrorBoundary.vue'
import Toast from './components/Toast.vue'
</script>
