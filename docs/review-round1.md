# 星霜记 第一阶段评审报告

> 评审日期：2026-04-29 | 评审范围：client/src/ 全部 56 个文件

---

## 总体评价

第一阶段交付了一个**架构清晰、视觉精致**的 Vue 3 SPA 前端。8 个公开页面 + 12 个后台页面 + 17 个组件，全部使用 `<script setup lang="ts">` Composition API，无一处 Options API。CSS 变量体系覆盖 30+ token，明暗模式过渡平滑。动画编排有层次感，微交互细节到位。

**综合评分：⭐⭐⭐⭐ (4/5)** — 作为 mock 阶段的原型，完成度很高。主要扣分在代码复用和几个实际 bug 上。

---

## 做得好的地方

### 架构 & Vue 3 实践 ⭐⭐⭐⭐⭐
- 100% `<script setup>` + Composition API，零 Options API
- 目录结构清晰：`pages/` `components/` `layouts/` `stores/` `composables/` `utils/` `mock/`
- 所有路由懒加载，滚动行为重置
- Pinia stores 全部使用 Composition API 风格

### 视觉设计 ⭐⭐⭐⭐⭐
- 温暖文艺风配色（奶油底 + 琥珀 accent），暗色模式单独调色而非简单反转
- CSS 变量体系完整：背景/文字/语义色/阴影/字体/间距/z-index
- 明暗切换 `0.4s ease` 全局过渡，无闪烁
- 暗色模式防闪烁：`index.html` 内联 script 在 Vue 挂载前读取 localStorage

### 动画 ⭐⭐⭐⭐⭐
- 页面切换：fade + translateY，离开 0.15s / 进入 0.25s（离开更快 = 更流畅的感知）
- 卡片入场：`:deep()` 选择器实现交错 delay（0.15s, 0.22s, 0.29s...）
- 时间线连接线 `scaleY` 生长动画 + 呼吸脉冲光晕
- 主题切换按钮：旋转 + 缩放 + `cubic-bezier(0.34, 1.56, 0.64, 1)` 弹性曲线
- 音乐播放器：唱片旋转 8s、均衡器 5 条交错、进度条 hover 显示圆点
- NavBar：汉堡 → X 变形、链接下划线从中心展开、logo 星星 twinkle

### 无障碍 ⭐⭐⭐⭐
- `prefers-reduced-motion: reduce` 媒体查询正确实现
- `:focus-visible` 聚焦样式
- `aria-label` 在 NavBar 汉堡按钮上
- `font-variant-numeric: tabular-nums` 用于时间显示

---

## 需要修复的问题

### 🔴 Bug（影响功能）

| # | 问题 | 文件 | 说明 |
|---|------|------|------|
| 1 | **AboutPage 数据时序 bug** | `AboutPage.vue` | `aboutMe = ref(siteStore.get('about_me'))` 在 `onMounted` 之前执行，store 此时为空，永远显示"暂无介绍"。应改为 `computed()` |
| 2 | **MusicPage 内存泄漏** | `MusicPage.vue` | `setInterval` 未在 `onBeforeUnmount` 清理，离开音乐页后定时器继续运行 |
| 3 | **后台路由无鉴权守卫** | `router/index.ts` | 任何人可直接访问 `/admin/dashboard`，无需登录。缺少 `router.beforeEach` 守卫 |
| 4 | **401 重定向用了 hash 路由** | `api/index.ts` | `window.location.hash = '#/admin/login'` 但路由用的是 HTML5 history 模式，应改用 `window.location.href` 或 `router.push()` |

### 🟡 代码质量问题

| # | 问题 | 影响范围 | 说明 |
|---|------|----------|------|
| 5 | **后台页面 CSS 不统一** | 7 个 admin 页面 | TimelineManager/FriendLinkManager/AttachmentManager/BackupManager/SiteSettings/PostEditor/LoginPage 定义了本地 `.btn-primary` `.modal-overlay` `.table` 等，与 `admin.css` 的 `admin-*` 前缀类并行存在 |
| 6 | **useAdminSearch 未被使用** | `composables/useAdminSearch.ts` | 设计良好的泛型搜索 composable 是死代码，4 个后台页面各自重复实现搜索逻辑 |
| 7 | **useReadingTime 未被使用** | `composables/useReadingTime.ts` | 另一个死代码 composable，且有 bug：参数是 `string` 而非 `Ref<string>`，`computed()` 永远不会响应变化 |
| 8 | **Keyframes 动画重复定义** | 8+ 文件 | `fadeDown` 在 7 个文件中重复、`fadeIn` 在 4 个文件中重复、`cardIn` 在 3 个文件中重复、`adminSlideIn` 在 admin.css 和 DashboardPage 中各定义一次 |
| 9 | **后台 CRUD 模式重复** | 3 个管理页面 | ProjectManager/TimelineManager/FriendLinkManager 的 modal CRUD 逻辑几乎完全相同（showModal/editingId/defaultForm/openCreate/openEdit/closeModal/save/doDelete），可提取 `useCrudManager<T>()` composable |
| 10 | **硬编码 `#fff`** | 10+ 文件 | 按钮文字 `color: #fff` 硬编码而非使用 `--color-on-accent` 变量 |
| 11 | **硬编码 `rgba(0,0,0,0.4)`** | 5+ 文件 | 模态框遮罩层颜色硬编码而非使用 `--shadow-overlay` 变量 |
| 12 | **Mock 数据分散** | 所有 admin 页面 | 每个后台页面内联自己的 mock 数据，未使用共享的 `mock/data.ts`，迁移真实 API 时需逐个修改 |
| 13 | **缺失共享类型定义** | 全局 | Post/Project/Timeline/Comment/FriendLink 接口在各组件中重复定义，应提取到 `types/` 目录 |

### 🟢 小问题

| # | 问题 | 文件 |
|---|------|------|
| 14 | `console.log('新评论:', data)` 残留 | `BlogDetail.vue:101` |
| 15 | "阶段三完善" 对用户可见 | `CaptchaInput.vue:10` |
| 16 | `EmptyState` 传了不存在的 `message` prop | `FriendLinksPage.vue` |
| 17 | `ImageUploader` 和 `AttachmentManagerPage` 的 `createObjectURL` 未调用 `revokeObjectURL` | 2 个文件 |
| 18 | `ConfirmDialog` 缺少入场动画（admin modal 有 `adminSlideIn`） | `ConfirmDialog.vue` |
| 19 | `NotFound.vue` 用内联样式而非 scoped CSS | `NotFound.vue` |
| 20 | 3 处 `alert()` mock 交互残留 | `BlogDetail.vue` `CommentManagerPage.vue` `BackupManagerPage.vue` |
| 21 | 13 处 TODO/阶段注释（可接受，但 `CaptchaInput` 的对用户可见） | 全局 |

---

## 改进建议优先级

如果要在进入第二阶段前清理，建议按以下顺序处理：

### P0：必须修（影响功能/安全）
1. 修 AboutPage bug：`ref()` → `computed()`
2. 修 MusicPage 内存泄漏：添加 `onBeforeUnmount`
3. 添加后台路由鉴权守卫
4. 修 API 层 401 重定向

### P1：强烈建议（技术债）
5. 统一后台页面 CSS：老页面迁移到 `admin-*` 类
6. 提取共享 `@keyframes` 到 `style.css`
7. 删除 `console.log` 和可见的 "阶段三完善" 文字
8. 采纳 `useAdminSearch` 或删除它

### P2：锦上添花（可延后）
9. 提取共享类型到 `types/`
10. 添加 `--color-on-accent` 变量替代硬编码 `#fff`
11. 提取 CRUD composable
12. 统一 mock 数据源
13. 给 `ConfirmDialog` 加入场动画

---

## 总结

第一阶段的核心目标——**完整的页面骨架 + 精致的视觉体验**——已经达成。设计系统（CSS 变量 + 暗色模式 + 动画体系）质量很高。主要问题集中在代码复用层面：后台页面的 CSS 和逻辑存在显著重复，两个 composable 是死代码，几个实际 bug 需要修复。这些问题不影响第二阶段（后端接入）的推进，但如果在接入真实 API 之前先做一轮清理，会让后续工作更顺畅。
