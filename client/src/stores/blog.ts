import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  mockPosts,
  mockProjects,
  mockTimeline,
  mockFriendLinks,
  mockPlaylist,
  mockComments,
  type MockComment,
} from '@/mock/data'

// ========== 类型定义 ==========

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  content: string
  wordCount: number
  readingTime: number
  commentEnabled: boolean
  pinned: boolean
}

export interface Project {
  id: number
  name: string
  description: string
  tech_stack: string[]
  github_url: string | null
  homepage_url: string | null
  featured: boolean
}

export interface TimelineItem {
  id: number
  title: string
  description: string
  date: string
  icon: string
}

export interface FriendLink {
  id: number
  name: string
  url: string
  description: string
}

export interface PlaylistSong {
  id: number
  name: string
  artist: string
}

export interface Playlist {
  playlist_id: string
  name: string
  description: string
  songs: PlaylistSong[]
}

export type Comment = MockComment

export interface CreatePostData {
  title: string
  excerpt: string
  tags: string[]
  content: string
  commentEnabled: boolean
  pinned: boolean
}

export interface UpdatePostData {
  title?: string
  excerpt?: string
  tags?: string[]
  content?: string
  commentEnabled?: boolean
  pinned?: boolean
}

export interface OperationLog {
  id: number
  action: string
  target: string
  created_at: string
}

export interface Attachment {
  id: number
  filename: string
  url: string
  size: number
  created_at: string
}

export interface DashboardStats {
  totalPosts: number
  totalComments: number
  totalViews: number
  recentPosts: Post[]
}

// ========== 模拟延迟 ==========

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms))

// ========== useBlogStore — 文章和公共数据 ==========

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<Post[]>([])
  const projects = ref<Project[]>([])
  const timeline = ref<TimelineItem[]>([])
  const friendLinks = ref<FriendLink[]>([])
  const playlist = ref<Playlist | null>(null)
  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      await delay()
      posts.value = [...mockPosts] as Post[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function getPost(slug: string): Promise<Post | undefined> {
    loading.value = true
    error.value = null
    try {
      await delay()
      return (mockPosts as Post[]).find((p) => p.slug === slug)
    } catch (e) {
      error.value = (e as Error).message
      return undefined
    } finally {
      loading.value = false
    }
  }

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      await delay()
      projects.value = [...mockProjects] as Project[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchTimeline() {
    loading.value = true
    error.value = null
    try {
      await delay()
      timeline.value = [...mockTimeline] as TimelineItem[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchFriendLinks() {
    loading.value = true
    error.value = null
    try {
      await delay()
      friendLinks.value = [...mockFriendLinks] as FriendLink[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchPlaylist() {
    loading.value = true
    error.value = null
    try {
      await delay()
      playlist.value = { ...mockPlaylist, songs: [...mockPlaylist.songs] } as Playlist
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchComments(postId: number) {
    loading.value = true
    error.value = null
    try {
      await delay()
      comments.value = mockComments.filter((c) => c.post_id === postId)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    projects,
    timeline,
    friendLinks,
    playlist,
    comments,
    loading,
    error,
    fetchPosts,
    getPost,
    fetchProjects,
    fetchTimeline,
    fetchFriendLinks,
    fetchPlaylist,
    fetchComments,
  }
})

// ========== useAdminStore — 后台管理数据 ==========

export const useAdminStore = defineStore('admin', () => {
  const allPosts = ref<Post[]>([])
  const allComments = ref<Comment[]>([])
  const operationLogs = ref<OperationLog[]>([])
  const attachments = ref<Attachment[]>([])
  const dashboardStats = ref<DashboardStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAllPosts() {
    loading.value = true
    error.value = null
    try {
      await delay()
      allPosts.value = [...mockPosts] as Post[]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function createPost(data: CreatePostData): Promise<Post | null> {
    loading.value = true
    error.value = null
    try {
      await delay()
      const newPost: Post = {
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        title: data.title,
        date: new Date().toISOString().slice(0, 10),
        excerpt: data.excerpt,
        tags: data.tags,
        content: data.content,
        wordCount: data.content.length,
        readingTime: Math.max(1, Math.ceil(data.content.length / 300)),
        commentEnabled: data.commentEnabled,
        pinned: data.pinned,
      }
      allPosts.value.unshift(newPost)
      return newPost
    } catch (e) {
      error.value = (e as Error).message
      return null
    } finally {
      loading.value = false
    }
  }

  async function updatePost(slug: string, data: UpdatePostData): Promise<Post | null> {
    loading.value = true
    error.value = null
    try {
      await delay()
      const index = allPosts.value.findIndex((p) => p.slug === slug)
      if (index === -1) throw new Error('文章不存在')
      allPosts.value[index] = { ...allPosts.value[index], ...data }
      return allPosts.value[index]
    } catch (e) {
      error.value = (e as Error).message
      return null
    } finally {
      loading.value = false
    }
  }

  async function deletePost(slug: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await delay()
      const index = allPosts.value.findIndex((p) => p.slug === slug)
      if (index === -1) throw new Error('文章不存在')
      allPosts.value.splice(index, 1)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchAllComments() {
    loading.value = true
    error.value = null
    try {
      await delay()
      allComments.value = [...mockComments]
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function approveComment(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await delay()
      const comment = allComments.value.find((c) => c.id === id)
      if (!comment) throw new Error('评论不存在')
      // mock 模式下仅模拟成功
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteComment(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await delay()
      const index = allComments.value.findIndex((c) => c.id === id)
      if (index === -1) throw new Error('评论不存在')
      allComments.value.splice(index, 1)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchDashboardStats() {
    loading.value = true
    error.value = null
    try {
      await delay()
      dashboardStats.value = {
        totalPosts: mockPosts.length,
        totalComments: mockComments.length,
        totalViews: 1024,
        recentPosts: [...mockPosts].slice(0, 5) as Post[],
      }
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    allPosts,
    allComments,
    operationLogs,
    attachments,
    dashboardStats,
    loading,
    error,
    fetchAllPosts,
    createPost,
    updatePost,
    deletePost,
    fetchAllComments,
    approveComment,
    deleteComment,
    fetchDashboardStats,
  }
})
