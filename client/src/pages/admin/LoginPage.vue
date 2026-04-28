<template>
  <div class="login-page">
    <form @submit.prevent="login" class="login-form">
      <h2>后台登录</h2>
      <div class="field">
        <label>用户名</label>
        <input v-model="form.username" type="text" required />
      </div>
      <div class="field">
        <label>密码</label>
        <input v-model="form.password" type="password" required />
      </div>
      <div class="field">
        <label>验证码</label>
        <div class="captcha-row">
          <input v-model="form.captcha" type="text" required placeholder="请输入验证码" />
          <div class="captcha-img" @click="refreshCaptcha">验证码</div>
        </div>
      </div>
      <button type="submit" class="btn-primary">登录</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ username: '', password: '', captcha: '' })

function refreshCaptcha() {
  // 阶段二对接真实验证码刷新
}

function login() {
  // 阶段二对接真实 API
  authStore.setToken('mock-token')
  authStore.setUser({ id: 1, username: form.value.username, nickname: '管理员' })
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.login-page { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
.login-form { width: 100%; max-width: 380px; background: var(--color-surface); padding: 2.5rem; border-radius: var(--radius); border: 1px solid var(--color-border); }
.login-form h2 { text-align: center; margin-bottom: 1.5rem; }
.field { margin-bottom: 1rem; }
.field label { display: block; margin-bottom: 0.3rem; font-size: 0.9rem; color: var(--color-text-secondary); }
.field input { width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius); font-size: 1rem; background: var(--color-bg); color: var(--color-text); }
.captcha-row { display: flex; gap: 0.75rem; }
.captcha-row input { flex: 1; }
.captcha-img { width: 100px; height: 38px; background: var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; border-radius: var(--radius); cursor: pointer; user-select: none; }
.btn-primary { width: 100%; padding: 0.6rem; background: var(--color-accent); color: #fff; border: none; border-radius: var(--radius); font-size: 1rem; cursor: pointer; margin-top: 0.5rem; }
.btn-primary:hover { opacity: 0.9; }
</style>
