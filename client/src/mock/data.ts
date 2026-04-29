export const mockPosts = [
  {
    id: 1,
    slug: 'hello-world',
    title: '你好，星霜记',
    date: '2026-04-28',
    excerpt: '这是我的第一篇博客文章，记录这个新站点诞生的时刻。',
    tags: ['生活', '博客'],
    content: `# 你好，星霜记\n\n这是我的第一篇博客文章。\n\n## 为什么叫星霜记\n\n星霜，指岁月流转。记，是记录。\n\n我希望在这里记录技术与生活中的点滴。`,
    wordCount: 156,
    readingTime: 1,
    commentEnabled: true,
    pinned: true,
  },
  {
    id: 2,
    slug: 'vue3-learning',
    title: 'Vue3 学习笔记：组合式 API',
    date: '2026-04-25',
    excerpt: '记录学习 Vue3 Composition API 的心得体会。',
    tags: ['Vue3', '前端'],
    content: `# Vue3 学习笔记\n\n组合式 API 是 Vue3 的核心特性之一。\n\n## 响应式基础\n\n\`\`\`ts\nimport { ref } from 'vue'\nconst count = ref(0)\n\`\`\`\n\n数学公式示例：$E = mc^2$`,
    wordCount: 2340,
    readingTime: 8,
    commentEnabled: true,
    pinned: false,
  },
  {
    id: 3,
    slug: 'typescript-tips',
    title: 'TypeScript 实用技巧',
    date: '2026-04-20',
    excerpt: '分享一些日常开发中实用的 TypeScript 技巧。',
    tags: ['TypeScript', '前端'],
    content: `# TypeScript 实用技巧\n\n## 类型守卫\n\n\`\`\`ts\nfunction isString(val: unknown): val is string {\n  return typeof val === 'string'\n}\n\`\`\`\n\n块级公式：\n\n$$\n\\sum_{i=1}^{n} x_i = x_1 + x_2 + ... + x_n\n$$`,
    wordCount: 1800,
    readingTime: 6,
    commentEnabled: false,
    pinned: false,
  },
]

export const mockProjects = [
  {
    id: 1,
    name: '星霜记',
    description: '这个博客本身',
    tech_stack: ['Vue3', 'Hono', 'SQLite'],
    github_url: 'https://github.com/Kai-Zs/stardust',
    homepage_url: null,
    featured: true,
  },
  {
    id: 2,
    name: '音乐播放器',
    description: '基于网易云 API 的在线音乐播放器',
    tech_stack: ['Vue3', 'NetEase API'],
    github_url: 'https://github.com/Kai-Zs/music-player',
    homepage_url: 'http://39.102.209.242:8090/music',
    featured: false,
  },
  {
    id: 3,
    name: '工具脚本集',
    description: '日常使用的 Python/Shell 脚本集合',
    tech_stack: ['Python', 'Shell'],
    github_url: 'https://github.com/Kai-Zs/scripts',
    homepage_url: null,
    featured: false,
  },
]

export const mockTimeline = [
  {
    id: 1,
    title: '创建星霜记',
    description: '基于 Vue3 + Hono 搭建个人网站',
    date: '2026-04',
    icon: '🚀',
  },
  {
    id: 2,
    title: '学习 Vue3',
    description: '系统学习 Vue3 组合式 API 和 TypeScript',
    date: '2026-03',
    icon: '📚',
  },
  { id: 3, title: '学习 Node.js', description: '开始接触后端开发', date: '2026-02', icon: '🔧' },
  {
    id: 4,
    title: '搭建第一台服务器',
    description: '购买云服务器，学习 Linux 基础运维',
    date: '2026-01',
    icon: '💻',
  },
]

export const mockFriendLinks = [
  { id: 1, name: 'Example Blog', url: 'https://example.com', description: '一个很棒的技术博客' },
  { id: 2, name: 'Vue.js 中文文档', url: 'https://cn.vuejs.org/', description: 'Vue 官方中文文档' },
]

export const mockSiteConfig: Record<string, string> = {
  site_title: '星霜记',
  site_description: '岁月流转，记录时光',
  about_me:
    '## 关于我\n\n一个热爱技术与生活的人。\n\n喜欢用代码构建有趣的东西，也喜欢音乐和旅行。\n\n### 技能\n\n- 前端：Vue3, TypeScript, HTML/CSS\n- 后端：Node.js, Python（学习中）\n- 工具：Git, Linux, Docker（入门）',
  site_created_at: '2026-04-28',
}

export interface MockComment {
  id: number
  post_id: number
  parent_id: number | null
  nickname: string
  content: string
  ip: string
  ip_location: string
  created_at: string
  status: 'pending' | 'approved' | 'hidden'
}

export const mockComments: MockComment[] = [
  {
    id: 1,
    post_id: 1,
    parent_id: null,
    nickname: '小明',
    content: '写得真好，期待更多文章！',
    ip: '192.168.1.1',
    ip_location: '北京',
    created_at: '2026-04-28 12:00',
    status: 'approved',
  },
  {
    id: 2,
    post_id: 1,
    parent_id: 1,
    nickname: '博主',
    content: '谢谢支持！',
    ip: '10.0.0.1',
    ip_location: '上海',
    created_at: '2026-04-28 12:30',
    status: 'approved',
  },
]

export const mockPlaylist = {
  playlist_id: '7539826158',
  name: '我的歌单',
  description: '一些喜欢的歌',
  songs: [
    { id: 1, name: '晴天', artist: '周杰伦' },
    { id: 2, name: '夜曲', artist: '周杰伦' },
    { id: 3, name: '起风了', artist: '买辣椒也用券' },
  ],
}
