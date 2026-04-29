/** 评论（前台展示用） */
export interface Comment {
  id: string
  nickname: string
  content: string
  createdAt: string
  ipLocation?: string
  replies?: Comment[]
}

/** 歌曲 */
export interface Song {
  id: number
  name: string
  artist: string
}
