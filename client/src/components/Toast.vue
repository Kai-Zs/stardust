<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast-item"
          :class="`toast-${t.type}`"
          role="alert"
          @click="remove(t.id)"
        >
          <span class="toast-icon">{{ iconMap[t.type] }}</span>
          <span class="toast-msg">{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '../stores/toast'

const { toasts, remove } = useToastStore()

const iconMap: Record<'success' | 'error' | 'warning' | 'info', string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 240px;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  font-size: 0.9rem;
  line-height: 1.4;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  border-left: 3px solid transparent;
  background: var(--color-surface);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.toast-item:hover {
  transform: translateX(-2px);
  box-shadow: var(--shadow-lg);
}

/* 类型配色 */
.toast-success {
  border-left-color: var(--color-success);
  color: var(--color-success-text);
  background: var(--color-success-bg);
}

.toast-error {
  border-left-color: var(--color-danger);
  color: var(--color-danger-text);
  background: var(--color-danger-bg);
}

.toast-warning {
  border-left-color: var(--color-warning);
  color: var(--color-warning-text);
  background: var(--color-warning-bg);
}

.toast-info {
  border-left-color: var(--color-info);
  color: var(--color-info-text);
  background: var(--color-info-bg);
}

.toast-icon {
  flex-shrink: 0;
  width: 1.2em;
  text-align: center;
  font-weight: 700;
  font-size: 1em;
}

.toast-msg {
  flex: 1;
  word-break: break-word;
}

/* 入场 / 退场动画 */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.25s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* 移动端居中 */
@media (max-width: 640px) {
  .toast-container {
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    align-items: center;
  }

  .toast-item {
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(20px);
  }
}

/* 减弱动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition-duration: 0.01ms !important;
  }
}
</style>
