<template>
  <div class="player-controls">
    <div class="now-playing" v-if="current">
      <div class="cover-placeholder">🎵</div>
      <div class="song-info">
        <div class="song-name">{{ current.name }}</div>
        <div class="artist">{{ current.artist }}</div>
      </div>
    </div>
    <div class="empty" v-else>未在播放</div>

    <div class="controls">
      <button @click="$emit('prev')" title="上一首" class="ctrl-btn">⏮</button>
      <button class="ctrl-btn ctrl-play" @click="$emit('toggle')">
        {{ playing ? '⏸' : '▶' }}
      </button>
      <button @click="$emit('next')" title="下一首" class="ctrl-btn">⏭</button>
    </div>

    <div class="progress-bar" @click="handleProgressClick">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="time-info">
      <span>{{ formatTime(currentTime) }}</span>
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  current: { id: number; name: string; artist: string } | null
  playing: boolean
  progress: number
  currentTime: number
  duration: number
}>()

const emit = defineEmits<{
  toggle: []
  prev: []
  next: []
  seek: [percent: number]
}>()

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function handleProgressClick(e: MouseEvent) {
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = ((e.clientX - rect.left) / rect.width) * 100
  emit('seek', Math.round(percent))
}
</script>

<style scoped>
.player-controls {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
}
.now-playing { display: flex; align-items: center; gap: 1rem; justify-content: center; margin-bottom: 1rem; }
.cover-placeholder { font-size: 2.5rem; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; background: var(--color-bg); border-radius: var(--radius); }
.song-info { text-align: left; }
.song-name { font-weight: 600; font-size: 1.1rem; }
.artist { color: var(--color-text-secondary); font-size: 0.9rem; }
.empty { color: var(--color-text-secondary); padding: 1.5rem; }
.controls { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem; }
.ctrl-btn { background: none; border: 1px solid var(--color-border); border-radius: 50%; width: 44px; height: 44px; cursor: pointer; font-size: 1.2rem; color: var(--color-text); display: flex; align-items: center; justify-content: center; }
.ctrl-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.ctrl-play { background: var(--color-accent) !important; color: #fff !important; border: none !important; width: 52px; height: 52px; font-size: 1.4rem; }
.ctrl-play:hover { background: var(--color-accent-light) !important; color: var(--color-text) !important; }
.progress-bar { height: 6px; background: var(--color-border); border-radius: 3px; margin-bottom: 0.3rem; cursor: pointer; }
.progress-fill { height: 100%; background: var(--color-accent); border-radius: 3px; transition: width 0.3s; }
.time-info { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-secondary); }
</style>
