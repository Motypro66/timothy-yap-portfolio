# 部署指南

项目路径：`sites/timothy-yap-portfolio`  
**栈：** Next.js 15（`output: 'export'` 静态导出）

---

## 主站 — Cloudflare Pages（推荐）

**网址：** https://timothy-yap.pages.dev/

| 项目 | 值 |
|------|-----|
| Production branch | `main` |
| **Build command** | **`npm run build:cf`** |
| **Build output directory** | **`out`** |
| Environment | `NODE_VERSION` = `20`（可选） |

Cloudflare 会自动设置 `CF_PAGES=1` → `basePath` 为 `/`（根路径）。

---

## 镜像 — GitHub Pages

**网址：** https://motypro66.github.io/timothy-yap-portfolio/

GitHub Actions 使用 `npm run build`（无 `CF_PAGES`）→ `basePath` = `/timothy-yap-portfolio`。

---

## 本地开发

```powershell
cd "C:\Users\timot\Documents\I Have a Plan\sites\timothy-yap-portfolio"
npm install
npm run dev
```

- **Cloudflare 模拟：** http://localhost:3000/  
  ```powershell
  $env:CF_PAGES='1'; npm run dev
  ```

- **GitHub Pages 子路径模拟：** http://localhost:3000/timothy-yap-portfolio  
  ```powershell
  npm run dev
  ```

### 本地预览生产构建

```powershell
$env:CF_PAGES='1'; npm run build:cf; npm run preview
```

打开 http://localhost:4173/

---

## 架构说明

- **SSG：** `next build` 预渲染完整 HTML（修复纯 CSR 空 `#root` 问题）
- **SEO：** `app/layout.tsx` metadata + `sitemap.ts` + `robots.ts` + JSON-LD Person
- **动效：** GSAP / Framer / particles 保留在 `'use client'` 的 `App` 组件树

---

## 常见问题

| 问题 | 处理 |
|------|------|
| Cloudflare 空白页 | Build command = `npm run build:cf`，Output = **`out`** |
| GitHub Pages 白屏 | 确认 Actions 上传的是 `out` 目录 |
| 资源 404 | CF 用 `CF_PAGES=1`；GH 不要设 `CF_PAGES` |
| Favicon 旧缓存 | Ctrl+Shift+R 硬刷新 |
