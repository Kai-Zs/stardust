<template>
  <div class="container blog-detail">
    <template v-if="post">
      <article class="article">
        <header class="article-header">
          <h1>{{ post.title }}</h1>
          <div class="article-meta">
            <span class="meta-item">{{ post.date }}</span>
            <span class="meta-item" v-if="post.wordCount">约 {{ post.wordCount }} 字</span>
            <span class="meta-item" v-if="post.readingTime">阅读约 {{ post.readingTime }} 分钟</span>
          </div>
          <div class="article-tags" v-if="post.tags?.length">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>

        <section class="article-body">
          <MarkdownRenderer :content="post.content" />
        </section>
      </article>

      <section class="ai-summary">
        <details>
          <summary>
            <span class="summary-title">AI 摘要</span>
            <span class="summary-hint">（接入 AI 后将自动生成）</span>
          </summary>
          <div class="summary-placeholder">
            <p>AI 摘要功能将在后续版本中接入，敬请期待。</p>
          </div>
        </details>
      </section>

      <section class="comments" v-if="post.commentEnabled">
        <h2>评论 ({{ commentTree.length }})</h2>
        <CommentList :comments="commentTree" />
        <CommentForm @submit="handleCommentSubmit" />
      </section>

      <section class="comments-disabled" v-else>
        <p class="no-comments-hint">本文未开放评论。</p>
      </section>
    </template>

    <NotFound v-else message="文章未找到" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'
import NotFound from '../components/NotFound.vue'
import { mockPosts, mockComments } from '../mock/data'
import type { MockComment } from '../mock/data'

const route = useRoute()
const slug = route.params.slug as string

const post = computed(() => mockPosts.find(p => p.slug === slug) || null)

function buildCommentTree(comments: MockComment[]): {
  id: string
  nickname: string
  content: string
  createdAt: string
  ipLocation?: string
  replies: {
    id: string
    nickname: string
    content: string
    createdAt: string
    ipLocation?: string
  }[]
}[] {
  const topLevel = comments.filter(c => c.parent_id === null)
  return topLevel.map(c => ({
    id: String(c.id),
    nickname: c.nickname,
    content: c.content,
    createdAt: c.created_at,
    ipLocation: c.ip_location,
    replies: comments
      .filter(r => r.parent_id === c.id)
      .map(r => ({
        id: String(r.id),
        nickname: r.nickname,
        content: r.content,
        createdAt: r.created_at,
        ipLocation: r.ip_location,
      })),
  }))
}

const commentTree = computed(() => buildCommentTree(mockComments))

function handleCommentSubmit(data: { nickname: string; content: string }) {
  // 阶段二接入真实 API
  console.log('新评论:', data)
  alert(`评论已提交（Mock）\n昵称：${data.nickname}\n内容：${data.content}`)
}
</script>

<style scoped>
.blog-detail { padding-top: 2rem; padding-bottom: 3rem; }

/* 文章头部 — 逐级入场 */
.article-header {
  margin-bottom: 2.5rem;
  animation: fadeDown 0.5s ease both;
}
.article-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}
.article-meta {
  display: flex; gap: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  animation: fadeDown 0.5s ease both;
  animation-delay: 0.1s;
}
.article-tags {
  display: flex; gap: 0.5rem; flex-wrap: wrap;
  animation: fadeDown 0.5s ease both;
  animation-delay: 0.2s;
}
@keyframes fadeDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }

.tag { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.15rem 0.6rem; font-size: 0.8rem; transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease; }

/* 文章正文 */
.article-body {
  margin-bottom: 2.5rem;
  animation: fadeIn 0.6s ease both;
  animation-delay: 0.25s;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* AI 摘要 */
/* 文章与评论区装饰分隔 */
.ai-summary::before,
.comments::before {
  content: '✦';
  display: block;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-accent);
  opacity: 0.35;
  margin-bottom: 1.5rem;
  letter-spacing: 1em;
  transition: color 0.4s ease;
}
.ai-summary {
  margin-bottom: 2rem;
  animation: fadeDown 0.5s ease both;
  animation-delay: 0.35s;
}
.ai-summary details { border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1rem; background: var(--color-surface); transition: background-color 0.4s ease, border-color 0.4s ease; }
.ai-summary summary { cursor: pointer; user-select: none; }
.summary-title { font-weight: 600; }
.summary-hint { color: var(--color-text-secondary); font-size: 0.85rem; }
.summary-placeholder { margin-top: 0.75rem; color: var(--color-text-secondary); font-size: 0.9rem; }

/* 评论区入场 */
.comments {
  animation: fadeUp 0.5s ease both;
  animation-delay: 0.4s;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.comments h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  transition: border-color 0.4s ease;
}
.no-comments-hint { text-align: center; color: var(--color-text-secondary); padding: 2rem 0; }
</style>
