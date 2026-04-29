<template>
  <div class="player-controls">
    <div class="now-playing" v-if="current">
      <div class="cover-placeholder" :class="{ spinning: playing }">🎵</div>
      <div class="song-info">
        <div class="song-name">{{ current.name }}</div>
        <div class="artist">{{ current.artist }}</div>
        <div class="equalizer" v-if="playing">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
    </div>
    <div class="empty" v-else>未在播放</div>

    <div class="controls">
      <button @click="$emit('prev')" title="上一首" class="ctrl-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
      </button>
      <button class="ctrl-btn ctrl-play" @click="$emit('toggle')">
        <svg v-if="!playing" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>
      </button>
      <button @click="$emit('next')" title="下一首" class="ctrl-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2 0V6l6.5 6L8 18zM16 6v12h2V6z"/></svg>
      </button>
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
.cover-placeholder { font-size: 2.5rem; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; background: var(--color-bg); border-radius: 50%; transition: transform 0.3s; }
.cover-placeholder.spinning { animation: spin 4s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.equalizer { display: flex; align-items: flex-end; gap: 3px; height: 16px; margin-top: 0.3rem; }
.equalizer .bar { width: 3px; background: var(--color-accent); border-radius: 1px; animation: eq 0.8s ease-in-out infinite alternate; }
.equalizer .bar:nth-child(1) { height: 6px; animation-delay: 0s; }
.equalizer .bar:nth-child(2) { height: 12px; animation-delay: 0.2s; }
.equalizer .bar:nth-child(3) { height: 8px; animation-delay: 0.4s; }
.equalizer .bar:nth-child(4) { height: 14px; animation-delay: 0.1s; }
@keyframes eq { 0% { height: 4px; } 100% { height: 16px; } }
.song-info { text-align: left; }
.song-name { font-weight: 600; font-size: 1.1rem; }
.artist { color: var(--color-text-secondary); font-size: 0.9rem; }
.empty { color: var(--color-text-secondary); padding: 1.5rem; }
.controls { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem; }
.ctrl-btn { background: none; border: 1px solid var(--color-border); border-radius: 50%; width: 44px; height: 44px; cursor: pointer; color: var(--color-text); display: flex; align-items: center; justify-content: center; transition: border-color var(--transition-fast), color var(--transition-fast); padding: 0; }
.ctrl-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.ctrl-play { background: var(--color-accent); color: #fff; border: none; width: 52px; height: 52px; }
.ctrl-play:hover { background: var(--color-accent-light); }
.progress-bar { height: 6px; background: var(--color-border); border-radius: 3px; margin-bottom: 0.3rem; cursor: pointer; }
.progress-fill { height: 100%; background: var(--color-accent); border-radius: 3px; transition: width 0.3s; }
.time-info { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-secondary); }
</style>
