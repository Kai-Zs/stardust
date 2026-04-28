<template>
  <div class="container music-page">
    <h1>音乐</h1>

    <section class="player-section">
      <PlayerControls
        :current="currentSong"
        :playing="isPlaying"
        :progress="progress"
        @toggle="togglePlay"
        @seek="handleSeek"
      />
    </section>

    <section class="playlist-section">
      <Playlist
        :name="playlist.name"
        :description="playlist.description"
        :songs="playlist.songs"
        :current="currentSong"
        @select="selectSong"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PlayerControls from '../components/PlayerControls.vue'
import Playlist from '../components/Playlist.vue'
import { mockPlaylist } from '../mock/data'

interface Song {
  id: number
  name: string
  artist: string
}

const playlist = ref(mockPlaylist)
const currentSong = ref<Song | undefined>(undefined)
const isPlaying = ref(false)
const progress = ref(0)

function selectSong(song: Song) {
  currentSong.value = song
  isPlaying.value = true
  progress.value = 0
}

function togglePlay() {
  if (!currentSong.value) return
  isPlaying.value = !isPlaying.value
}

function handleSeek(value: string) {
  progress.value = Number(value)
}
</script>

<style scoped>
.music-page h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
.player-section { margin-bottom: 2rem; }
</style>
