# 星霜记 / Stardust

基于 Vue3 + Hono + SQLite 的综合个人网站。

## 技术栈

- **前端**: Vue3 + TypeScript + Vite + Pinia + Vue Router
- **后端**: Hono (Node.js) + TypeScript + Drizzle ORM
- **数据库**: SQLite
- **部署**: 1Panel + OpenResty + PM2

## 功能

- 博客文章（Markdown 编写 + AI 摘要）
- 项目展示（GitHub 自动拉取）
- 技术成长时间线
- 音乐播放器（网易云歌单）
- 匿名评论 + IP 属地
- 深色模式
- 后台管理系统

## 本地开发

```bash
# 前端
cd client
npm install
npm run dev

# 后端
cd server
npm install
npm run dev
```

## 协议

本作品采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。

代码部分采用 [GPLv3](LICENSE) 许可协议。
