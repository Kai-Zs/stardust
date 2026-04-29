import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createUnhead } from '@unhead/vue'
import App from './App.vue'
import router from './router'
import './style.css'
import './assets/admin.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createUnhead())
// 全局错误处理
app.config.errorHandler = (err, _instance, info) => {
  console.error('[全局错误]', err, info)
  import('./stores/toast')
    .then(({ useToastStore }) => {
      useToastStore().error('发生了一个意外错误，请刷新页面重试')
    })
    .catch(() => { /* toast store 可能未初始化 */ })
}

app.mount('#app')
