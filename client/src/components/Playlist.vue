<template>
  <div class="playlist">
    <h3 class="playlist-title">{{ name }}</h3>
    <p class="playlist-desc" v-if="description">{{ description }}</p>
    <ul class="song-list">
      <li
        v-for="song in songs"
        :key="song.id"
        class="song-item"
        :class="{ active: current?.id === song.id }"
        @click="$emit('select', song)"
      >
        <span class="song-name">{{ song.name }}</span>
        <span class="song-artist">{{ song.artist }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  description?: string
  songs: { id: number; name: string; artist: string }[]
  current?: { id: number; name: string; artist: string }
}>()

defineEmits<{
  select: [song: { id: number; name: string; artist: string }]
}>()
</script>

<style scoped>
.playlist-title { font-size: 1.15rem; margin-bottom: 0.3rem; }
.playlist-desc { color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 1rem; }
.song-list { list-style: none; padding: 0; }
.song-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s;
}
.song-item:hover { background: var(--color-surface); }
.song-item.active { background: var(--color-surface); color: var(--color-accent); }
.song-name { font-weight: 500; }
.song-artist { color: var(--color-text-secondary); font-size: 0.85rem; }
</style>
