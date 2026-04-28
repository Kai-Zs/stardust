<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>站点设置</h1>
      <button class="btn-primary" @click="save">保存设置</button>
    </div>

    <form @submit.prevent="save" class="settings-form">
      <div class="field">
        <label>站点标题</label>
        <input v-model="form.site_title" type="text" placeholder="星霜记" />
      </div>
      <div class="field">
        <label>站点描述</label>
        <textarea v-model="form.site_description" rows="2" placeholder="一个记录时光的个人博客"></textarea>
      </div>
      <div class="field">
        <label>关于我</label>
        <textarea v-model="form.about_me" rows="4" placeholder="写一些关于你的介绍..."></textarea>
      </div>
      <div class="field-row">
        <div class="field flex-1">
          <label>站点创建日期</label>
          <input v-model="form.site_created_at" type="date" />
        </div>
        <div class="field flex-1">
          <label>作者名称</label>
          <input v-model="form.author_name" type="text" placeholder="你的名字" />
        </div>
      </div>
      <div class="field-row">
        <div class="field flex-1">
          <label>站长邮箱</label>
          <input v-model="form.admin_email" type="email" placeholder="admin@example.com" />
        </div>
        <div class="field flex-1">
          <label>ICP 备案号</label>
          <input v-model="form.icp" type="text" placeholder="粤ICP备XXXXXXXX号" />
        </div>
      </div>
      <div class="field">
        <label>页脚文案</label>
        <input v-model="form.footer_text" type="text" :placeholder="'© ' + new Date().getFullYear() + ' 星霜记'" />
      </div>
      <div class="field">
        <label>每页文章数</label>
        <input v-model.number="form.page_size" type="number" min="1" max="50" />
      </div>
    </form>

    <!-- 保存提示 -->
    <div v-if="saveMsg" class="toast">{{ saveMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useSiteStore } from '../../stores/site'

const siteStore = useSiteStore()

const form = reactive({
  site_title: '星霜记',
  site_description: '一个记录时光与技术的个人博客',
  about_me: '热爱前端开发，喜欢探索新技术。',
  site_created_at: '2022-01-01',
  author_name: '星霜',
  admin_email: 'admin@example.com',
  icp: '',
  footer_text: '',
  page_size: 10,
})

const saveMsg = ref('')

function save() {
  // 阶段二对接真实 API
  const data: Record<string, string> = {}
  for (const [key, value] of Object.entries(form)) {
    data[key] = String(value)
  }
  siteStore.setConfig(data)
  saveMsg.value = '设置已保存'
  setTimeout(() => { saveMsg.value = '' }, 2000)
}
</script>

<style scoped>
.settings-page { max-width: 720px; margin: 0 auto; }

.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.page-header h1 { margin: 0; }

.btn-primary {
  padding: 0.5rem 1.5rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.95rem;
}
.btn-primary:hover { opacity: 0.9; }

.settings-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.field { margin-bottom: 1.2rem; }
.field:last-child { margin-bottom: 0; }
.field label { display: block; margin-bottom: 0.3rem; font-size: 0.85rem; color: var(--color-text-secondary); }
.field input[type="text"],
.field input[type="email"],
.field input[type="date"],
.field input[type="number"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.95rem;
  background: var(--color-bg);
  color: var(--color-text);
}
.field textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.95rem;
  background: var(--color-bg);
  color: var(--color-text);
  resize: vertical;
}

.field-row { display: flex; gap: 1rem; margin-bottom: 1.2rem; }
.field-row:last-of-type { margin-bottom: 1.2rem; }
.flex-1 { flex: 1; }

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: var(--color-bg);
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.85rem;
  z-index: 200;
}

@media (max-width: 600px) {
  .field-row { flex-direction: column; gap: 0; }
  .field-row .field { margin-bottom: 1.2rem; }
}
</style>
