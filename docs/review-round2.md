# 星霜记 第二轮独立评审报告

> 评审日期：2026-04-29 | 评审范围：client/src/ 全部文件
> 背景：第一轮评审发现的问题已全部修复，本轮验证修复效果并发现新问题

---

## 一、功能完整性

### 路由 ✅ 满分
22 条路由 + 鉴权守卫 + 滚动重置，全部按设计规格实现。

### 缺失的功能点（11 项）

| # | 功能 | 说明 |
|---|------|------|
| 1 | SEO meta 标签 | `@vueuse/head` 已安装但无任何页面调用 `useHead()` |
| 2 | 图片懒加载 | MarkdownRenderer 渲染的 `<img>` 未注入 `loading="lazy"` |
| 3 | 图片灯箱 | 无点击放大查看功能 |
| 4 | 置顶文章排序 | BlogList 未按 `pinned` 字段排序 |
| 5 | BlogList 搜索栏 | 设计规格有 `?tag=` 但无文本搜索输入框 |
| 6 | 文章状态筛选 | PostListPage 无 published/draft 切换 |
| 7 | IP 封禁管理页 | 无查看/管理封禁 IP 的界面 |
| 8 | 社交链接设置 | SiteSettingsPage 缺少 github/twitter/email 字段 |
| 9 | 页脚版权设置 | SiteSettingsPage 缺少 `footer_license` 字段 |
| 10 | 时间线 link 字段 | TimelineEntry 不渲染链接，管理表单也缺此字段 |
| 11 | 排序字段 | 项目/时间线/友链管理表单均缺 `sort_order` |

### 部分实现的功能（8 项）

| # | 功能 | 现状 |
|---|------|------|
| 1 | 所有 API 调用 | 全部使用 mock 数据 |
| 2 | AI 摘要 | UI 占位存在，显示"敬请期待" |
| 3 | 评论回复 | `toggleReply()` 是空函数 |
| 4 | 验证码 | UI 存在但 `refreshCaptcha()` 为空 |
| 5 | 音乐缓存策略 | 未实现 2 小时 TTL |
| 6 | 文章编辑器预览 | 用简单 regex 而非真正的 MarkdownRenderer |
| 7 | 附件上传验证 | 无文件类型/大小限制检查 |
| 8 | 侧边栏用户信息 | 无用户头像/名称/退出按钮 |

**功能完整性评分：⭐⭐⭐⭐ (4/5)**

---

## 二、UI/UX 一致性

### 视觉不一致（10 项）

| # | 问题 | 位置 |
|---|------|------|
| 1 | MusicPage 标题 2.2rem，其他公开页均为 1.8rem | `MusicPage.vue:129` |
| 2 | BackupManagerPage 未用 `admin-page-header` | `BackupManagerPage.vue:5` |
| 3 | 5 个后台页缺副标题 | PostList/Timeline/FriendLink/Attachment/SiteSettings |
| 4 | ProjectCard hover 缺 border-color 变化 | `ProjectCard.vue:29` |
| 5 | AttachmentManagerPage 卡片无 hover 效果 | `AttachmentManagerPage.vue:113` |
| 6 | DashboardPage stat-card 上浮 -4px | `DashboardPage.vue:120` |
| 7 | fadeIn 动画时长不一 | BlogDetail/HomePage 0.6s vs Projects/FriendLinks 0.5s |
| 8 | ConfirmDialog 独立模态系统，动画方向相反 | `ConfirmDialog.vue` |
| 9 | PostEditorPage 硬编码 box-shadow 不适配暗色模式 | `PostEditorPage.vue:228` |
| 10 | 过渡时长混用 | 150ms/200ms/250ms/400ms，timing function 混用 |

### 兼容性风险（3 项）

| # | 风险 | 影响 |
|---|------|------|
| 1 | `color-mix()` 无 fallback（6 处） | 导航栏在旧浏览器完全透明 |
| 2 | `:focus-visible` 无 `:focus` fallback | Safari <15.4 无聚焦指示器 |
| 3 | 无 browserslist / build target | 无明确浏览器支持范围 |

**UI/UX 一致性评分：⭐⭐⭐⭐ (4/5)**

---

## 三、性能与响应

| 严重度 | 问题 | 影响 |
|--------|------|------|
| 🔴 严重 | highlight.js 全量导入（~250KB gzipped） | MarkdownRenderer 单 chunk 1.3MB |
| 🔴 严重 | Vite 配置完全空白 | 无代码分割策略 |
| ⚠️ 中等 | Google Fonts 阻塞渲染 | 阻塞首次绘制 |
| ⚠️ 中等 | Markdown 渲染图片无 lazy loading | 长文章一次性加载所有图片 |

**性能评分：⭐⭐⭐ (3/5)**

---

## 四、代码可维护性

| 严重度 | 问题 | 详情 |
|--------|------|------|
| ⚠️ | 5 个死模块未清理 | ConfirmDialog/LoadingSpinner/useTagsStore/api/index/useAdminSearch |
| ⚠️ | BackupManagerPage 本地 `.btn-danger` | 唯一未迁移到 admin-btn-danger 的后台页 |
| ⚠️ | 4 处 TODO 注释残留 | CommentList/CommentForm/ImageUploader/CaptchaInput |
| ⚠️ | @keyframes 重复定义 | fadeDown 7处/fadeIn 4处/cardIn 3处 |
| ⚠️ | 3 处硬编码 rgba | PostEditorPage/PlayerControls |

**代码可维护性评分：⭐⭐⭐⭐ (4/5)**

---

## 五、综合评估

| 维度 | 评分 |
|------|------|
| 功能完整性 | ⭐⭐⭐⭐ |
| UI/UX 一致性 | ⭐⭐⭐⭐ |
| 性能与响应 | ⭐⭐⭐ |
| 代码可维护性 | ⭐⭐⭐⭐ |

### 整体结论：**通过，需改进**

进入第二阶段前建议优先处理：
1. **P0**：highlight.js 按需导入 + Vite manualChunks（30 分钟）
2. **P1**：color-mix 添加 fallback（20 分钟）
3. **P2**：清理死模块 + 按钮类迁移（15 分钟）
