<template>
  <div class="container music-page">
    <h1>音乐</h1>

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

    <div v-if="error" class="error-msg">歌曲加载失败，请稍后重试</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
</script>

<style scoped>
.music-page { padding-top: 2rem; }
.music-page h1 { font-family: var(--font-serif); font-size: 2rem; margin-bottom: 1.5rem; }
.player-section { margin-bottom: 2rem; }
.error-msg { text-align: center; color: #d32f2f; margin-top: 1.5rem; padding: 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
</style>
