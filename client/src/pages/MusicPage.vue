<template>
  <div class="container music-page">
    <header class="page-header">
      <h1>音乐</h1>
      <p class="page-subtitle">愿每一段旋律，都能温柔你的时光</p>
    </header>

    <div class="music-layout">
      <section class="player-section">
        <PlayerControls
          :current="currentSong"
          :playing="playing"
          :progress="progress"
          :current-time="currentTime"
          :duration="duration"
          @toggle="togglePlay"
          @prev="prevSong"
          @next="nextSong"
          @seek="handleSeek"
        />
      </section>

      <section class="playlist-section">
        <Playlist
          :name="playlist.name"
          :description="playlist.description"
          :songs="playlist.songs"
          :current-index="currentIndex"
          @select="selectSong"
        />
      </section>
    </div>

    <div v-if="error" class="error-msg">歌曲加载失败，请稍后重试</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import PlayerControls from '../components/PlayerControls.vue'
import Playlist from '../components/Playlist.vue'
import { mockPlaylist } from '../mock/data'

interface Song {
  id: number
  name: string
  artist: string
}

const playlist = ref(mockPlaylist)
const currentIndex = ref(-1)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(240)
const error = ref(false)
let progressTimer: number | null = null

const currentSong = computed<Song | null>(() => {
  if (currentIndex.value < 0 || currentIndex.value >= playlist.value.songs.length) return null
  return playlist.value.songs[currentIndex.value]
})

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

function selectSong(index: number) {
  currentIndex.value = index
  currentTime.value = 0
  playing.value = true
  error.value = false
  startProgress()
}

function togglePlay() {
  if (!currentSong.value) {
    selectSong(0)
    return
  }
  playing.value = !playing.value
  if (playing.value) startProgress()
  else stopProgress()
}

function prevSong() {
  if (playlist.value.songs.length === 0) return
  const idx = currentIndex.value <= 0 ? playlist.value.songs.length - 1 : currentIndex.value - 1
  selectSong(idx)
}

function nextSong() {
  if (playlist.value.songs.length === 0) return
  const idx = currentIndex.value >= playlist.value.songs.length - 1 ? 0 : currentIndex.value + 1
  selectSong(idx)
}

function handleSeek(percent: number) {
  currentTime.value = Math.round((percent / 100) * duration.value)
}

function startProgress() {
  stopProgress()
  progressTimer = window.setInterval(() => {
    if (currentTime.value >= duration.value) {
      nextSong()
    } else {
      currentTime.value++
    }
  }, 1000)
}

function stopProgress() {
  if (progressTimer !== null) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

onBeforeUnmount(() => {
  stopProgress()
})
</script>

<style scoped>
.music-page { padding-bottom: 3rem; }
.page-header { text-align: center; margin-bottom: 2.5rem; animation: fadeDown 0.5s ease both; }
@keyframes fadeDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
.page-header h1 { font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.4rem; letter-spacing: 0.06em; }
.page-subtitle { color: var(--color-text-secondary); font-size: 0.95rem; font-style: italic; letter-spacing: 0.04em; }
.music-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
.player-section { position: sticky; top: 5rem; }
.error-msg { text-align: center; color: var(--color-error); margin-top: 1.5rem; padding: 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
@media (max-width: 768px) {
  .music-layout { grid-template-columns: 1fr; }
  .player-section { position: static; }
}
</style>
