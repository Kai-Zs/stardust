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
.playlist {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  animation: listIn 0.5s ease both;
  animation-delay: 0.15s;
  transition: background-color 0.4s ease, border-color 0.4s ease;
}
@keyframes listIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.playlist h3 { font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.2rem; letter-spacing: 0.03em; }
.playlist-desc { color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 1rem; font-style: italic; }
.song-list { list-style: none; padding: 0; margin: 0; max-height: 480px; overflow-y: auto; }
.song-list::-webkit-scrollbar { width: 4px; }
.song-list::-webkit-scrollbar-track { background: transparent; }
.song-list::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
.song-list::-webkit-scrollbar-thumb:hover { background: var(--color-text-secondary); }
.song-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.7rem 0.6rem; cursor: pointer;
  border-radius: 10px;
  transition: background 0.2s ease, color 0.4s ease, border-color 0.4s ease;
  border-bottom: 1px solid transparent;
}
.song-item + .song-item { border-bottom-color: var(--color-border); }
.song-item:last-child { border-bottom-color: transparent; }
.song-item:hover { background: var(--color-bg); }
.song-item.active {
  background: var(--color-accent-light);
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  color: var(--color-accent);
}
.song-item.active .song-name { font-weight: 600; }
.index {
  font-size: 0.8rem; color: var(--color-text-secondary); min-width: 1.8rem;
  text-align: center; font-variant-numeric: tabular-nums;
}
.song-item.active .index { color: var(--color-accent); }
.song-name { flex: 1; font-size: 0.95rem; }
.artist { font-size: 0.8rem; color: var(--color-text-secondary); }
.empty { text-align: center; color: var(--color-text-secondary); padding: 3rem 1rem; font-style: italic; }
</style>
