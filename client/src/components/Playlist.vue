<template>
  <div class="playlist">
    <h3>{{ name }}</h3>
    <p class="playlist-desc" v-if="description">{{ description }}</p>
    <ul class="song-list">
      <li
        v-for="(song, index) in songs"
        :key="song.id"
        class="song-item"
        :class="{ active: currentIndex === index }"
        @click="$emit('select', index)"
      >
        <span class="index">{{ index + 1 }}</span>
        <span class="song-name">{{ song.name }}</span>
        <span class="artist">{{ song.artist }}</span>
      </li>
    </ul>
    <p v-if="songs.length === 0" class="empty">暂无歌曲</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  description?: string
  songs: { id: number; name: string; artist: string }[]
  currentIndex: number
}>()

defineEmits<{
  select: [index: number]
}>()
</script>

<style scoped>
.playlist h3 { font-size: 1.1rem; margin-bottom: 0.3rem; }
.playlist-desc { color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 1rem; }
.song-list { list-style: none; padding: 0; max-height: 400px; overflow-y: auto; }
.song-list::-webkit-scrollbar { width: 6px; }
.song-list::-webkit-scrollbar-track { background: transparent; }
.song-list::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
.song-list::-webkit-scrollbar-thumb:hover { background: var(--color-text-secondary); }
.song-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; cursor: pointer; border-radius: var(--radius); transition: background 0.15s; }
.song-item:hover { background: var(--color-surface); }
.song-item.active { background: var(--color-accent-light); color: var(--color-text); }
.index { font-size: 0.85rem; color: var(--color-text-secondary); min-width: 1.5rem; }
.song-name { flex: 1; font-weight: 500; }
.artist { font-size: 0.85rem; color: var(--color-text-secondary); }
.empty { text-align: center; color: var(--color-text-secondary); padding: 2rem; }
</style>
