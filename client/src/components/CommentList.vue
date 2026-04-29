<template>
  <div class="comment-list">
    <p v-if="!comments.length" class="no-comments">暂无评论</p>
    <ul v-else class="comments">
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-main">
          <div class="comment-header">
            <span class="comment-nickname">{{ comment.nickname }}</span>
            <span class="comment-time">{{ comment.createdAt }}</span>
            <span v-if="comment.ipLocation" class="comment-location">{{ comment.ipLocation }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
          <button class="reply-btn" @click="toggleReply(comment.id)">回复</button>
        </div>
        <ul v-if="comment.replies?.length" class="comment-replies">
          <li v-for="reply in comment.replies" :key="reply.id" class="reply-item">
            <div class="comment-header">
              <span class="comment-nickname">{{ reply.nickname }}</span>
              <span class="comment-time">{{ reply.createdAt }}</span>
              <span v-if="reply.ipLocation" class="comment-location">{{ reply.ipLocation }}</span>
            </div>
            <p class="comment-content">{{ reply.content }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Comment {
  id: string
  nickname: string
  content: string
  createdAt: string
  ipLocation?: string
  replies?: Comment[]
}

defineProps<{ comments: Comment[] }>()

const toggleReply = (_id: string) => {
  // TODO: 阶段二实现回复功能
}
</script>

<style scoped>
.comment-list { padding: 1rem 0; }
.comments { list-style: none; padding: 0; margin: 0; }
.no-comments { text-align: center; color: var(--color-text-secondary); padding: 2rem 0; }
.comment-item { padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
.comment-header { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.4rem; font-size: 0.85rem; }
.comment-nickname { font-weight: 600; color: var(--color-accent); }
.comment-time, .comment-location { color: var(--color-text-secondary); }
.comment-content { line-height: 1.6; margin-bottom: 0.5rem; }
.reply-btn { background: none; border: none; color: var(--color-accent); cursor: pointer; font-size: 0.8rem; padding: 0; font-family: var(--font-sans); }
.comment-replies { margin-left: 2rem; margin-top: 0.5rem; padding-left: 1rem; border-left: 2px solid var(--color-border); list-style: none; }
.reply-item { padding: 0.75rem 0; }
</style>
