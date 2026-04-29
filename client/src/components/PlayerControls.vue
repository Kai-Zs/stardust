<template>
  <div class="player-controls">
    <!-- 唱片封面 — 始终占位 -->
    <div class="vinyl-area">
      <div v-show="current" class="vinyl" :class="{ spinning: playing }">
        <div class="vinyl-groove"></div>
        <div class="vinyl-groove inner"></div>
        <div class="vinyl-center">
          <span class="vinyl-note">♪</span>
        </div>
      </div>
      <div v-show="!current" class="empty-cover">
        <span class="empty-icon">♫</span>
        <span class="empty-text">未在播放</span>
      </div>
    </div>

    <!-- 歌曲信息 — 始终占位 -->
    <div class="song-info">
      <div v-if="current" class="song-name">{{ current.name }}</div>
      <div v-else class="song-name placeholder">暂未播放</div>
      <div v-if="current" class="artist">{{ current.artist }}</div>
      <div v-else class="artist placeholder">选择一首歌吧</div>
      <div class="equalizer" :class="{ active: playing }">
        <span class="bar"></span><span class="bar"></span> <span class="bar"></span
        ><span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="controls">
      <button title="上一首" class="ctrl-btn" @click="$emit('prev')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
        </svg>
      </button>
      <button class="ctrl-btn ctrl-play" @click="$emit('toggle')">
        <svg v-if="!playing" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M6 19h4V5H6zm8-14v14h4V5z" />
        </svg>
      </button>
      <button title="下一首" class="ctrl-btn" @click="$emit('next')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>

    <!-- 进度条 -->
    <div class="progress-wrap">
      <span class="time">{{ formatTime(currentTime) }}</span>
      <div class="progress-bar" @click="handleProgressClick">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="time">{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
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
  if (!seconds || !isFinite(seconds)) return '0:00'
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
  border-radius: 16px;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  animation: playerIn 0.5s ease both;
  transition:
    background-color 0.4s ease,
    border-color 0.4s ease;
}
@keyframes playerIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 唱片区域 — 固定高度 */
.vinyl-area {
  width: 130px;
  height: 130px;
  margin: 0 auto 1.25rem;
  position: relative;
}
.vinyl {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 50% 50%,
      transparent 29%,
      rgba(255, 255, 255, 0.03) 30%,
      transparent 31%
    ),
    radial-gradient(
      circle at 50% 50%,
      transparent 44%,
      rgba(255, 255, 255, 0.04) 45%,
      transparent 46%
    ),
    radial-gradient(
      circle at 50% 50%,
      transparent 59%,
      rgba(255, 255, 255, 0.03) 60%,
      transparent 61%
    ),
    radial-gradient(
      circle at 50% 50%,
      transparent 74%,
      rgba(255, 255, 255, 0.04) 75%,
      transparent 76%
    ),
    linear-gradient(
      135deg,
      var(--color-text) 0%,
      var(--color-text-secondary) 50%,
      var(--color-text) 100%
    );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 0 1px var(--color-border);
  transition: box-shadow 0.4s ease;
}
.vinyl.spinning {
  animation: spin 8s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.vinyl-center {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow:
    0 0 0 4px var(--color-surface),
    0 0 0 5px var(--color-border),
    0 0 12px rgba(193, 120, 23, 0.2);
  transition:
    background-color 0.4s ease,
    box-shadow 0.4s ease;
}
.vinyl-note {
  color: var(--color-on-accent);
  font-size: 1.1rem;
  line-height: 1;
}

/* 空状态 */
.empty-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 2px dashed var(--color-border);
  transition:
    background-color 0.4s ease,
    border-color 0.4s ease;
}
.empty-icon {
  font-size: 2.2rem;
  color: var(--color-text-secondary);
  opacity: 0.4;
}
.empty-text {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.3rem;
  opacity: 0.6;
}

/* 歌曲信息 — 固定高度 */
.song-info {
  min-height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}
.song-name {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1.15rem;
  margin-bottom: 0.15rem;
  letter-spacing: 0.02em;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.song-name.placeholder {
  color: var(--color-text-secondary);
  opacity: 0.5;
}
.artist {
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  font-style: italic;
}
.artist.placeholder {
  opacity: 0.5;
}

/* 均衡器 — 固定高度 */
.equalizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  height: 18px;
  margin-top: 0.5rem;
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.equalizer.active {
  opacity: 1;
}
.equalizer .bar {
  width: 3px;
  height: 4px;
  background: var(--color-accent);
  border-radius: 1px;
}
.equalizer.active .bar {
  animation: eq 0.8s ease-in-out infinite alternate;
}
.equalizer .bar:nth-child(1) {
  animation-delay: 0s;
}
.equalizer .bar:nth-child(2) {
  animation-delay: 0.15s;
}
.equalizer .bar:nth-child(3) {
  animation-delay: 0.3s;
}
.equalizer .bar:nth-child(4) {
  animation-delay: 0.1s;
}
.equalizer .bar:nth-child(5) {
  animation-delay: 0.25s;
}
@keyframes eq {
  0% {
    height: 4px;
  }
  100% {
    height: 18px;
  }
}

/* 控制按钮 */
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.ctrl-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  cursor: pointer;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast),
    background-color 0.4s ease,
    transform var(--transition-fast);
}
.ctrl-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: scale(1.08);
}
.ctrl-btn:active {
  transform: scale(0.95);
}
.ctrl-play {
  width: 54px;
  height: 54px;
  background: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 75%, var(--color-surface));
  color: var(--color-on-accent);
  border: none;
  box-shadow: var(--shadow-sm);
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}
.ctrl-play:hover {
  background: var(--color-accent);
  transform: scale(1.08);
  box-shadow: var(--shadow-md);
}
.ctrl-play:active {
  transform: scale(0.95);
}

/* 进度条 */
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.time {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 2.5em;
}
.progress-bar {
  flex: 1;
  height: 5px;
  background: var(--color-border);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.4s ease;
}
.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 3px;
  position: relative;
  transition:
    width 0.3s ease,
    background-color 0.4s ease;
}
.progress-fill::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  transition:
    transform 0.2s ease,
    background-color 0.4s ease;
  box-shadow: 0 0 6px rgba(193, 120, 23, 0.3);
}
.progress-bar:hover .progress-fill::after {
  transform: translateY(-50%) scale(1);
}
</style>
