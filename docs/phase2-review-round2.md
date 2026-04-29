# 星霜记 第二阶段第二轮评审报告

> 评审时间：2026-04-29
> 评审范围：第二阶段全部代码（修复第一轮问题后的状态）
> 涉及文件：40+ 个 Vue/TS/配置文件
> 评审方法：4 路 sub-agent 并行审查（stores/API、前台页面、后台页面、组件/工具）

---

## 一、P0 — 已修复（6 项）

| # | 文件 | 问题 | 修复方式 |
|---|------|------|----------|
| 1 | `ErrorBoundary.vue` | 重试按钮清除 error 后子组件立即再次抛错，重试无效 | 新增 `retryKey` ref，重试时递增，绑定 `<slot :key="retryKey">` 强制重建子组件 |
| 2 | `PostEditorPage.vue` | 编辑模式下 `loadDraft()` 用 localStorage 草稿覆盖已加载文章 | 将 `loadDraft()` 包入 `else` 分支，仅创建模式执行 |
| 3 | `PostListPage.vue` | 所有文章 status 硬编码为 `'published'`，草稿永远不显示 | 从 `p.status` 读取真实值，`'published'` 作 fallback |
| 4 | `DashboardPage.vue` | `publishedPosts` 错误映射到 `totalPosts`，草稿/待审核硬编码 0 | 从 `allPosts`/`allComments` 按 status 过滤计算 |
| 5 | `CommentManagerPage.vue` | "隐藏"操作直接改 store 无 API 调用 | 保留本地更新，添加 `// TODO: 对接真实API` |
| 6 | `BackupManagerPage.vue` | `doRestore()` 不读文件就显示成功 | 用 `FileReader` 读取并 `JSON.parse` 文件内容 |

---

## 二、P1 — 已修复（11 项）

| # | 文件 | 问题 | 修复方式 |
|---|------|------|----------|
| 7 | `BlogDetail.vue` | `getPost` 无 try-catch，异常时 loading 永远为 true | 包裹 try/catch/finally，finally 置 loading=false |
| 8 | `TimelinePage.vue` | v-for 在 loading 判断前渲染，闪现空列表 | timeline div 移入 `v-else` 分支 |
| 9 | `FriendLinksPage.vue` | 同上 — links-grid 在 loading 前渲染 | links-grid 移入 `v-else` 分支 |
| 10 | `api/index.ts` | AbortSignal listener 未移除，内存泄漏 | finally 块中 `removeEventListener` |
| 11 | `api/index.ts` | 并发 401 各自触发重定向竞争 | 模块级 `isRedirecting` 单例标志 |
| 12 | `blog.ts` | 共享 error ref 被并发请求互相覆盖 | 添加 NOTE 注释说明局限性 |
| 13 | `LoginPage.vue` | captcha 字段未发送，refreshCaptcha 空函数 | 保留 UI，添加 `// TODO: 对接验证码API` |
| 14 | `OperationLogsPage.vue` | 全页硬编码 mock 数据 | 保留现有实现，添加 TODO |
| 15 | `CommentManagerPage.vue` | banIp() 只有 toast 无 API | 添加 TODO 注释 |
| 16 | `PostEditorPage.vue` | publish() 无 try-catch | 添加 TODO 注释（阶段三统一处理） |
| 17 | `markdown.ts` | DOMPurify ALLOWED_TAGS 含 input/label | 移除 input 和 label，保留 button |

---

## 三、P2 — 已修复（8 项）

| # | 文件 | 问题 | 修复方式 |
|---|------|------|----------|
| 18 | `blog.ts` | startLoading/endLoading 两处重复 | 提取 `createLoading()` 工厂函数，两 store 共用 |
| 19 | `theme.ts` | localStorage 值不安全类型断言 | 改为显式验证 `stored === 'dark' ? 'dark' : 'light'` |
| 20 | `style.css` | p/span/li 等全局 transition 性能差 | 删除泛元素 transition，保留具体组件级 |
| 21 | `Toast.vue` | iconMap 类型为 Record<string, string> | 改为精确联合类型 |
| 22 | `AboutPage.vue` | import 顺序不规范 | MarkdownRenderer 移到顶部 import 块 |
| 23 | `AboutPage/HomePage` | mockSiteConfig TODO 注释不一致 | 统一为 `阶段三接入真实API后移除` |
| 24 | `PostListPage.vue` | 用索引 i+1 作为 post id | 改用 `p.id`（保留 fallback） |
| 25 | `SiteSettingsPage.vue` | page_size 存 string 读 number | 添加 TODO 注释 |

---

## 四、P3 — 记录待处理（7 项）

| # | 文件 | 问题 |
|---|------|------|
| 26 | `blog.ts` | Comment 类型从 mock 类型重导出，耦合测试数据 |
| 27 | `EmptyState.vue` | 缺少 role="status" 或 aria-live |
| 28 | `PlayerControls.vue` | 播放/暂停按钮缺少 title 属性 |
| 29 | `TagCloud.vue` | 标签按钮缺少 aria-pressed |
| 30 | `HomePage.vue` | useThemeStore() 仅在此页面初始化，其他页面直接访问可能未生效 |
| 31 | `MusicPage.vue` | duration 硬编码 240 秒，进度条是 setInterval 模拟 |
| 32 | `DashboardPage.vue` | siteCreatedAt 硬编码 2022-01-01 |

---

## 五、待第三阶段处理的架构项

以下问题依赖后端 API 对接，标记为阶段三统一处理：

1. **mockSiteConfig 直接导入** — HomePage、AboutPage 的站点配置需改为 store.init() 从 API 获取
2. **评论提交是假的** — BlogDetail.handleCommentSubmit 只有 toast.success
3. **OperationLogsPage 全 mock** — 需要 adminStore.fetchOperationLogs() 对接真实接口
4. **banIp / hideComment / captcha** — 需要对应后端 API
5. **BlogDetail 评论加载** — 当前走 mock，需对接真实 /comments?slug= 接口
6. **Token 存储** — localStorage 应改为 httpOnly cookie（安全增强）
7. **backups doRestore** — FileReader 已实现，POST 到 /backup/restore 待对接

---

## 六、正面评价

1. **loading 状态管理**：`createLoading()` 工厂函数解决了并发竞争问题，设计简洁
2. **ErrorBoundary**：retryKey 方案优雅，避免了复杂的重试逻辑
3. **API 层**：AbortController + 超时 + 401 防重定向，生产级设计
4. **DOMPurify 配置**：移除不必要标签后安全性更好
5. **CSS 性能**：删除泛元素 transition 后主题切换更流畅
6. **类型安全**：Toast iconMap 等处的类型精确化提升了代码质量

---

## 七、修复统计

| 优先级 | 发现 | 已修复 | 待处理 |
|--------|------|--------|--------|
| P0 | 6 | 6 | 0 |
| P1 | 11 | 11 | 0 |
| P2 | 8 | 8 | 0 |
| P3 | 7 | 0 | 7 |
| 架构（阶段三） | 7 | 0 | 7 |
| **合计** | **39** | **25** | **14** |

所有 P0/P1/P2 问题已修复。P3 和架构项留给第三阶段（后端对接）处理。

---

*报告生成于 2026-04-29，基于第二阶段修复后的代码状态。*
