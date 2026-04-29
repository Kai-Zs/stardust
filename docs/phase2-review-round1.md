# 星霜记 第二阶段第一轮评审报告

> 评审时间：2026-04-29
> 评审范围：第二阶段全部代码改动（基础设施 + 安全修复 + Store 架构 + 20 页迁移 + SEO）
> 涉及文件：33 个 Vue/TS/配置文件
> 评审目的：发现并修复第二阶段引入的问题

---

## 一、Bug 级别（必须修复）

### BUG-1: BlogDetail.vue — 评论加载硬编码 postId=1

| 位置 | 严重程度 | 说明 |
|------|---------|------|
| `BlogDetail.vue:86` | P0 | 无论查看哪篇文章，评论始终取 postId=1 |

```ts
blogStore.fetchComments(1)  // 永远加载文章 ID=1 的评论
```

**修复**: Post 类型增加 id 字段，fetchComments 改用实际文章 ID。

### BUG-2: vitest/jsdom 未列入 devDependencies

| 位置 | 严重程度 | 说明 |
|------|---------|------|
| `package.json` | P0 | `npm test` 在新环境下会失败 |

**修复**: `npm install -D vitest jsdom`（确认已安装但未写入 devDependencies）。

### BUG-3: PostEditorPage — 编辑模式不加载已有文章

| 位置 | 严重程度 | 说明 |
|------|---------|------|
| `PostEditorPage.vue` | P0 | 从列表点"编辑"进入空白编辑器 |

**修复**: onMounted 检测 isEdit，从 store/API 加载文章数据到 form。

### BUG-4: Store loading 状态并发竞争

| 位置 | 严重程度 | 说明 |
|------|---------|------|
| `stores/blog.ts` | P0 | 多个 fetch 并发时，先完成的会提前重置 loading=false |

**修复**: 改为计数器方案，所有并发请求完成后再重置 loading。

### BUG-5: approveComment 不更新内部状态

| 位置 | 严重程度 | 说明 |
|------|---------|------|
| `stores/blog.ts` | P1 | approveComment 仅返回 true，不修改 comment.status |

**修复**: 内部执行 `comment.status = 'approved'`。

### BUG-6: BlogDetail 无加载状态，闪现 404

| 位置 | 严重程度 | 说明 |
|------|---------|------|
| `BlogDetail.vue` | P1 | getPost 异步期间模板显示 404，数据到达后切换 |

**修复**: 增加 loading ref，模板增加加载中分支。

---

## 二、架构/安全问题

### ARCH-1: Store mock 与 API 混用，数据不一致

| 位置 | 严重程度 |
|------|---------|
| `stores/blog.ts` | P1 |

后台页面直接调 api.post 创建数据，但前台通过 store 读取仍走 mock，新建数据不会出现。

### ARCH-2: HomePage/AboutPage 直接导入 mock 数据

| 位置 | 严重程度 |
|------|---------|
| `HomePage.vue:22`, `AboutPage.vue:26` | P2 |

`import { mockSiteConfig }` 残留，应通过 store.init() 统一管理。

### ARCH-3: Token 存储在 localStorage

| 位置 | 严重程度 |
|------|---------|
| `api/index.ts:32` | P2 |

长期应改用 httpOnly cookie。

### ARCH-4: DOMPurify 允许 style 属性

| 位置 | 严重程度 |
|------|---------|
| `markdown.ts:165` | P2 |

存在 CSS 注入风险，建议移除或限制。

### ARCH-5: DashboardPage 评论硬编码假数据

| 位置 | 严重程度 |
|------|---------|
| `DashboardPage.vue:95-136` | P1 |

应从 adminStore.allComments 获取。

### ARCH-6: PostListPage 本地 Post 接口与 store 冲突

| 位置 | 严重程度 |
|------|---------|
| `PostListPage.vue` | P2 |

id 由索引生成不稳定，status 硬编码为 published。

---

## 三、代码质量问题

### QUALITY-1: useHead() 穿插在 import 之间（5 个页面）

`BlogList.vue`、`ProjectsPage.vue`、`TimelinePage.vue`、`FriendLinksPage.vue`、`MusicPage.vue` — import 应集中在文件顶部。

### QUALITY-2: 后台管理页 save/delete 缺少 try-catch（3 个页面）

`ProjectManagerPage`、`TimelineManagerPage`、`FriendLinkManagerPage` — API 失败时错误未捕获。

### QUALITY-3: 内联样式应提取为 CSS class

`CommentManagerPage`、`PostListPage` 等多处 `style="margin-bottom: 1rem"`。

### QUALITY-4: 自动保存不检测变更

`PostEditorPage.vue` — 每 30 秒无条件保存，应用 watch 检测 dirty 状态。

### QUALITY-5: vite.config.ts 中 @vueuse 匹配无效

已迁移至 @unhead/vue，`@vueuse` 匹配永远不会命中。

### QUALITY-6: siteStore 无持久化和初始化方法

每次刷新后 config 丢失，非所有页面都注入数据。

### QUALITY-7: 数学公式占位符可能与内容冲突

`%%MATH_BLOCK_0%%` 如果出现在正文中会被错误替换。

### QUALITY-8: highlight.js 15 种语言全部静态导入

可减少到 5-7 种常用语言，其余按需加载。

### QUALITY-9: 表单 label 缺少 for/id 关联

所有表单的 label 和 input 未通过 for/id 关联。

### QUALITY-10: 模态框缺少焦点陷阱和 Escape 关闭

5 个管理页的弹窗无焦点管理和键盘关闭。

### QUALITY-11: Toast aria-live 与 role="alert" 冲突

`aria-live="polite"` 和 `role="alert"`（assertive）语义冲突。

### QUALITY-12: scrollBehavior 不支持 hash 锚点导航

---

## 四、正面评价

1. TypeScript strict 模式正确启用，vue-tsc 零错误
2. API 层设计合理：AbortController + 超时 + FormData 上传
3. MarkdownRenderer + DOMPurify 安全修复到位
4. Toast 系统实现完整（Teleport + TransitionGroup + aria + 移动端）
5. useHead SEO 覆盖全面，BlogDetail 支持动态 title
6. ErrorBoundary + 全局错误处理双层防护设计合理
7. 测试文件覆盖主题切换核心场景

---

## 五、修复优先级

| 优先级 | 编号 | 问题 |
|--------|------|------|
| P0 | BUG-1~4 | 评论硬编码、vitest 未安装、编辑模式空白、loading 竞争 |
| P1 | BUG-5~6, ARCH-1, ARCH-5, QUALITY-2 | approveComment、404 闪现、mock 混用、try-catch |
| P2 | ARCH-2~4~6, QUALITY-1~5~9 | mock 残留、安全细节、代码规范 |
| P3 | QUALITY-6~12, MINOR | 无障碍增强、性能优化 |

---

*报告生成于 2026-04-29，基于第二阶段完成后代码状态。*
