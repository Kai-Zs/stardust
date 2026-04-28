<template>
  <div class="player-controls">
    <div class="player-info">
      <span class="current-song" v-if="current">{{ current.name }} - {{ current.artist }}</span>
      <span class="current-song" v-else>未选择歌曲</span>
    </div>
    <div class="controls">
      <button class="ctrl-btn" title="上一首">&laquo;</button>
      <button class="ctrl-btn ctrl-play" @click="$emit('toggle')">
        {{ playing ? '⏸' : '▶' }}
      </button>
      <button class="ctrl-btn" title="下一首">&raquo;</button>
    </div>
    <input
      type="range"
      class="progress-bar"
      :value="progress"
      min="0"
      max="100"
      @input="$emit('seek', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  current?: { id: number; name: string; artist: string }
  playing?: boolean
  progress?: number
}>()

defineEmits<{
  toggle: []
  seek: [value: string]
}>()
</script>

<style scoped>
.player-controls {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem;
}
.player-info { text-align: center; margin-bottom: 0.75rem; }
.current-song { font-size: 1rem; color: var(--color-text); }
.controls { display: flex; justify-content: center; gap: 1rem; margin-bottom: 0.75rem; }
.ctrl-btn {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--color-text);
  font-family: var(--font-sans);
}
.ctrl-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.ctrl-play { font-size: 1.3rem; padding: 0.3rem 0.8rem; }
.progress-bar { width: 100%; accent-color: var(--color-accent); }
</style>
