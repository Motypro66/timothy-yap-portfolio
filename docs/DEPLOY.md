# 部署指南

项目路径：`sites/timothy-yap-portfolio`

---

## 主站 — Cloudflare Pages（推荐）

**网址：** https://timothy-yap.pages.dev/

已连接 GitHub 仓库 `Motypro66/timothy-yap-portfolio`，推送到 `main` 后自动部署。

### Cloudflare 构建设置

| 项目 | 值 |
|------|-----|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `20`（或用仓库里的 `.node-version`） |

Cloudflare 构建时会自动设置 `CF_PAGES=1`，Vite 使用根路径 `base: '/'`。

### 以后每次改完

```powershell
git add .
git commit -m "描述你的改动"
git push
```

Cloudflare 约 1–2 分钟自动重新部署。

---

## 镜像 — GitHub Pages

**网址：** https://motypro66.github.io/timothy-yap-portfolio/

GitHub Actions 同样监听 `main` 分支，使用子路径 `base: '/timothy-yap-portfolio/'`。

### 开启 GitHub Pages（一次性）

1. https://github.com/Motypro66/timothy-yap-portfolio/settings/pages
2. **Build and deployment → Source** 选 **GitHub Actions**

---

## 本地开发

```powershell
cd "C:\Users\timot\Documents\I Have a Plan\sites\timothy-yap-portfolio"
npm install
npm run dev
```

浏览器打开 http://localhost:5173/timothy-yap-portfolio/

模拟 Cloudflare 构建：

```powershell
$env:CF_PAGES='1'; npm run build; npm run preview
```

预览地址 http://localhost:4173/

---

## 常见问题

| 问题 | 处理 |
|------|------|
| Cloudflare 白屏 / 404 | 确认 Build output 是 `dist`，且 Cloudflare 已连对仓库 |
| GitHub Pages 白屏 | 确认 `vite.config.ts` 在非 CF 环境用 `base: '/timothy-yap-portfolio/'` |
| Favicon 仍是旧的 | 浏览器 **Ctrl+Shift+R** 硬刷新 |
| 本地 npm 报错 | 需要 Node.js 20+ |
